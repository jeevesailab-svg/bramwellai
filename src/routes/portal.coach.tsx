import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useConversation } from "@elevenlabs/react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getElevenLabsCoachToken } from "@/lib/elevenlabs.functions";
import { recordCompletedSession } from "@/lib/sessions.functions";
import { ScoreCurve, type CurvePoint } from "@/components/portal/ScoreCurve";

export const Route = createFileRoute("/portal/coach")({
  component: PortalCoachPage,
  head: () => ({
    meta: [
      { title: "Coaching, Bramwell AI" },
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

const CURRICULUM = [
  {
    theme: "Week 1: Structure under pressure",
    objective:
      "Answer first, evidence second. One clear line, then proof, then the so what. No wind up.",
    drill:
      "Cold impromptu prompts with no thinking time. 60 to 90 second answers, scored, then one rebuild of the same answer.",
  },
  {
    theme: "Week 2: Specificity and evidence",
    objective:
      "Replace vague claims with numbers, names, timeframes and outcomes. Every claim gets a receipt.",
    drill:
      "Impromptu prompts where every general statement is challenged live and rebuilt with concrete evidence.",
  },
  {
    theme: "Week 3: Confidence signals",
    objective:
      "Pace, pauses and filler. Land the end of sentences. Pause instead of um. Slow the first ten seconds.",
    drill:
      "Impromptu prompts with live counting of filler words and pace, then a re run targeting the same score dimensions.",
  },
  {
    theme: "Week 4: High stakes rehearsal",
    objective:
      "Real rooms. Interview answers, status updates, pitches and objection handling under pressure.",
    drill:
      "Role play the member's actual upcoming room, interrupt with hard follow ups, then score and rebuild.",
  },
] as const;

const COACH_SYSTEM_PROMPT = `You are Bramwell, a Voice AI Mentor. Australian English only. Never use em dashes.

You are running a paid daily session inside the 30 Day Voice Mastery Program ($349 one time).
The program runs as five phases across 30 days:
 Phase 1, Days 1 to 5, Set the Baseline
 Phase 2, Days 6 to 12, Structure Your Thinking
 Phase 3, Days 13 to 19, Command the Room
 Phase 4, Days 20 to 26, Move to Decision
 Phase 5, Days 27 to 30, Perform Under Pressure
The seven steps taught inside those phases: 1 Lead with the answer, 2 Structure in three, 3 Evidence that lands, 4 Pace and pause, 5 Hold the interruption, 6 Make the recommendation, 7 Close with the ask.

SESSION FORMAT (keep to MINUTES_PER_SESSION):
1. Greet by first name. In one sentence, state the day, the week theme and this week's objective.
2. Reference PREVIOUS_HOMEWORK and PRACTICE_FOCUS if present, and ask if they did it. Keep this under 20 seconds.
3. Run the week's drill. Give ONE impromptu prompt at a time, no thinking time, and tell them to answer as they normally would.
4. Listen fully. Do not interrupt unless the drill calls for it.
5. Give feedback using their own words. Quote them directly. Be specific, never generic praise.
6. Score the answer out of 100 across four dimensions and say each one aloud: Structure, Specificity, Confidence Signals, Relevance.
7. Make them rebuild the same answer once. Score the rebuild so they hear the delta.
8. Repeat with a new prompt if time allows.
9. Close with one Readiness Score for the session, one practice focus, and one specific homework task for tomorrow.

RULES:
- Score honestly. A weak answer gets a low score. Do not inflate.
- Never read internal labels, archetype names or field names aloud.
- Coach, do not lecture. Short turns. They should be speaking most of the session.
- There is no refund guarantee. If they ask, say purchases are final and point them to support.
- Use CV and JOB_DESCRIPTION below to make prompts relevant to their real role.
- When the time is nearly up, wrap with the score, focus and homework. Never cut off mid feedback.`;

function PortalCoachPage() {
  const navigate = useNavigate();
  const fetchToken = useServerFn(getElevenLabsCoachToken);
  const completeSession = useServerFn(recordCompletedSession);

  const [user, setUser] = useState<UserRow | null>(null);
  const [lastSession, setLastSession] = useState<SessionRow | null>(null);
  const [curve, setCurve] = useState<CurvePoint[]>([]);
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
      const { data: all } = await supabase
        .from("sessions")
        .select("session_number, readiness_score_end, created_at")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      setCurve((all ?? []) as CurvePoint[]);
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
    const dayNumber = Math.min((u.sessions_completed ?? 0) + 1, 30);
    const weekNumber = Math.min(Math.ceil(dayNumber / 7), 4);
    const week = CURRICULUM[weekNumber - 1];
    return [
      COACH_SYSTEM_PROMPT,
      "",
      "=== THIS MEMBER, RIGHT NOW ===",
      `DAY_NUMBER: ${dayNumber} of 30`,
      `WEEK_NUMBER: ${weekNumber} of 4`,
      `WEEK_THEME: ${week.theme}`,
      `WEEK_OBJECTIVE: ${week.objective}`,
      `WEEK_DRILL: ${week.drill}`,
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

  // Persist session on disconnect, guarded so it only runs once per session
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
              to="/portal/setup" search={{}}
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

            <div className="mx-auto mt-12 max-w-2xl">
              <ScoreCurve
                points={curve}
                baseline={
                  curve.some((p) => typeof p.readiness_score_end === "number")
                    ? null
                    : (user?.last_readiness_score ?? null)
                }
                totalSessions={user?.sessions_purchased ?? 30}
              />
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