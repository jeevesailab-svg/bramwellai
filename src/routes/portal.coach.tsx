import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useConversation } from "@elevenlabs/react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getElevenLabsCoachToken } from "@/lib/elevenlabs.functions";
import { recordCompletedSession } from "@/lib/sessions.functions";

export const Route = createFileRoute("/portal/coach")({
  component: PortalCoachPage,
  head: () => ({
    meta: [
      { title: "Coaching — Bramwell AI" },
      {
        name: "description",
        content:
          "Your live Bramwell coaching session with a real-time voice coach.",
      },
    ],
  }),
});

type UserRow = {
  id: string;
  first_name: string | null;
  pathway: string | null;
  sessions_purchased: number | null;
  sessions_completed: number | null;
  minutes_per_session: number | null;
  cv_text: string | null;
  jd_text: string | null;
  jd_key_phrases: string | null;
  communication_type: string | null;
  last_question_worked_on: string | null;
  last_readiness_score: number | null;
  practice_focus: string | null;
};

type SessionRow = {
  session_number: number | null;
  practice_focus: string | null;
  homework_instructions: string | null;
  questions_covered: string | null;
  readiness_score_end: number | null;
};

function PortalCoachPage() {
  const navigate = useNavigate();
  const fetchToken = useServerFn(getElevenLabsCoachToken);
  const completeSession = useServerFn(recordCompletedSession);

  const [user, setUser] = useState<UserRow | null>(null);
  const [lastSession, setLastSession] = useState<SessionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const sessionStartRef = useRef<Date | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      sessionStartRef.current = new Date();
    },
    onDisconnect: () => {
      void handleSessionEnded();
    },
    onError: (err) => {
      console.error("ElevenLabs error:", err);
      setError("The coaching connection dropped. Please try again.");
    },
  });

  const status = conversation.status;
  const isConnected = status === "connected";

  // Load user + most recent session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!auth.user) {
        navigate({ to: "/login", replace: true });
        return;
      }
      const [{ data: u }, { data: s }] = await Promise.all([
        supabase
          .from("users")
          .select(
            "id, first_name, pathway, sessions_purchased, sessions_completed, minutes_per_session, cv_text, jd_text, jd_key_phrases, communication_type, last_question_worked_on, last_readiness_score, practice_focus",
          )
          .eq("id", auth.user.id)
          .maybeSingle(),
        supabase
          .from("sessions")
          .select(
            "session_number, practice_focus, homework_instructions, questions_covered, readiness_score_end",
          )
          .eq("user_id", auth.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      setUser(u as UserRow | null);
      setLastSession(s as SessionRow | null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const sessionsRemaining =
    (user?.sessions_purchased ?? 0) - (user?.sessions_completed ?? 0);
  const sessionNumber = (user?.sessions_completed ?? 0) + 1;
  const minutesPerSession = user?.minutes_per_session ?? 20;

  function buildContext(u: UserRow, prev: SessionRow | null): string {
    return [
      `CANDIDATE_NAME: ${u.first_name ?? ""}`,
      `CANDIDATE_PLAN: ${u.pathway ?? ""}`,
      `SESSIONS_REMAINING: ${(u.sessions_purchased ?? 0) - (u.sessions_completed ?? 0)}`,
      `SESSIONS_TOTAL: ${u.sessions_purchased ?? 0}`,
      `SESSION_NUMBER: ${(u.sessions_completed ?? 0) + 1}`,
      `MINUTES_PER_SESSION: ${u.minutes_per_session ?? 20}`,
      `COMMUNICATION_TYPE: ${u.communication_type ?? "unknown"}`,
      `LAST_READINESS_SCORE: ${u.last_readiness_score ?? "n/a"}`,
      `LAST_QUESTION_WORKED_ON: ${u.last_question_worked_on ?? "n/a"}`,
      `PRACTICE_FOCUS: ${u.practice_focus ?? prev?.practice_focus ?? "n/a"}`,
      `PREVIOUS_HOMEWORK: ${prev?.homework_instructions ?? "n/a"}`,
      `JD_KEY_PHRASES: ${u.jd_key_phrases ?? "n/a"}`,
      `CV:\n${(u.cv_text ?? "").slice(0, 6000)}`,
      `JOB_DESCRIPTION:\n${(u.jd_text ?? "").slice(0, 6000)}`,
    ].join("\n");
  }

  // Countdown
  useEffect(() => {
    if (!isConnected) return;
    setSecondsLeft(minutesPerSession * 60);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null) return null;
        if (s <= 1) {
          clearInterval(interval);
          void conversation.endSession();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, minutesPerSession]);

  const handleStart = useCallback(async () => {
    if (!user) return;
    setError(null);
    setStarting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const { token } = await fetchToken();
      const context = buildContext(user, lastSession);
      const id = await conversation.startSession({
        conversationToken: token,
        connectionType: "webrtc",
        overrides: {
          agent: {
            prompt: { prompt: context },
          },
        },
      });
      conversationIdRef.current = typeof id === "string" ? id : null;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.name === "NotAllowedError"
          ? "Microphone access is required for coaching."
          : "Couldn't start the session. Please try again.",
      );
    } finally {
      setStarting(false);
    }
  }, [user, lastSession, conversation, fetchToken]);

  const handleStop = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  // Persist session on disconnect — guarded so it only runs once per session
  const persistedRef = useRef(false);
  async function handleSessionEnded() {
    if (persistedRef.current) return;
    if (!sessionStartRef.current || !user) return;
    persistedRef.current = true;

    const startedAt = sessionStartRef.current;
    const durationMin = Math.max(
      1,
      Math.round((Date.now() - startedAt.getTime()) / 60000),
    );

    try {
      const { sessions_completed } = await completeSession({
        data: { duration_minutes: durationMin },
      });
      setUser((u) => (u ? { ...u, sessions_completed } : u));
    } catch (e) {
      console.error(e);
    } finally {
      sessionStartRef.current = null;
      setSecondsLeft(null);
      // Re-arm for next session
      setTimeout(() => {
        persistedRef.current = false;
      }, 1500);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="text-sm font-semibold tracking-wide">
            BRAMWELL AI
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {isConnected && secondsLeft !== null && (
              <span
                className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold"
                style={{ color: "var(--primary)" }}
              >
                {formatTime(secondsLeft)}
              </span>
            )}
            <Link
              to="/portal/setup"
              className="text-muted-foreground hover:text-foreground"
            >
              Update CV / JD
            </Link>
            <button
              onClick={async () => {
                if (isConnected) await conversation.endSession();
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center md:px-10 md:py-24">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading your session…</p>
        ) : (
          <>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {user?.pathway ?? "Coaching"} · Session {sessionNumber} of{" "}
              {user?.sessions_purchased ?? 0}
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">
              {user?.first_name
                ? `Ready when you are, ${user.first_name}.`
                : "Bramwell is ready for you."}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
              {minutesPerSession} minutes of live voice coaching. Bramwell will
              ask. You answer. Bramwell coaches until the answer is ready.
            </p>

            <div className="mx-auto mt-12 max-w-md">
              <div
                className="rounded-2xl border border-border/50 bg-card/40 p-8"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <div className="mb-6 flex items-center justify-center gap-3 text-sm">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isConnected
                        ? "animate-pulse bg-green-500"
                        : "bg-muted-foreground/40"
                    }`}
                  />
                  <span className="text-muted-foreground">
                    {isConnected
                      ? conversation.isSpeaking
                        ? "Bramwell is speaking"
                        : "Listening"
                      : "Not connected"}
                  </span>
                </div>

                {!isConnected ? (
                  <button
                    onClick={handleStart}
                    disabled={starting || sessionsRemaining <= 0}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full px-7 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: "var(--gradient-gold)" }}
                  >
                    {starting
                      ? "Connecting…"
                      : sessionsRemaining <= 0
                        ? "No sessions remaining"
                        : "Start session"}
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-foreground/5 px-7 text-sm font-semibold transition hover:bg-foreground/10"
                  >
                    End session
                  </button>
                )}

                <p className="mt-4 text-xs text-muted-foreground">
                  {sessionsRemaining} of {user?.sessions_purchased ?? 0}{" "}
                  sessions remaining
                </p>
              </div>

              {error && (
                <p className="mt-4 text-sm text-destructive">{error}</p>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}