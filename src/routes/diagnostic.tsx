import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/diagnostic")({
  component: DiagnosticRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    autostart: search.autostart === "1" ? "1" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Free Bramwell Diagnostic — Hear how you really sound" },
      {
        name: "description",
        content:
          "A five-minute live voice diagnostic. Bramwell asks one question, listens, and gives you your communication type, your three biggest gaps, and your Readiness Score.",
      },
      { property: "og:title", content: "Free Bramwell Diagnostic" },
      {
        property: "og:description",
        content:
          "Five minutes with Bramwell. One question. Your communication type, three biggest gaps, and Readiness Score.",
      },
    ],
  }),
});

// Pathway routing — mirrors src/routes/pricing.tsx keys.
const PATHWAY = {
  graduate: { name: "Graduate Interview Sprint", price: "$99 AUD" },
  comeback: { name: "Career Comeback Sprint", price: "$199 AUD" },
  confidence: { name: "Interview Confidence Sprint", price: "$249 AUD" },
  executive: { name: "Executive Communication Sprint", price: "$499 AUD" },
  club: { name: "Career Confidence Club", price: "$79 AUD / month" },
} as const;
type PathwayKey = keyof typeof PATHWAY;

const SESSION_LIMIT_MS = 5 * 60 * 1000;

type SubmitInput = {
  communication_type?: string;
  readiness_score?: number;
  gaps?: string[];
  gap_1?: string;
  gap_2?: string;
  gap_3?: string;
  career_moment?: string;
  first_name?: string;
  email?: string;
};

function routePathway(
  input: SubmitInput,
): { key: PathwayKey; name: string; price: string } {
  const moment = (input.career_moment ?? "").toLowerCase();
  const type = (input.communication_type ?? "").toLowerCase();
  const score = input.readiness_score ?? 0;

  // Career-moment overrides win.
  if (/(executive|board|c-?suite|cxo|director)/.test(moment)) {
    return { key: "executive", ...PATHWAY.executive };
  }
  if (/(graduate|student|university|college)/.test(moment)) {
    return { key: "graduate", ...PATHWAY.graduate };
  }
  if (/(redundan|career gap|career break|return to work|maternity)/.test(moment)) {
    return { key: "comeback", ...PATHWAY.comeback };
  }

  // Score overrides.
  if (score >= 80) return { key: "club", ...PATHWAY.club };
  if (score < 40) return { key: "graduate", ...PATHWAY.graduate };

  // Communication-type routing.
  if (/(rambler|over[- ]?explainer|under[- ]?seller|invisible)/.test(type)) {
    return { key: "confidence", ...PATHWAY.confidence };
  }
  if (/(apolog)/.test(type)) {
    return { key: "comeback", ...PATHWAY.comeback };
  }
  if (/(next[- ]?level|leader)/.test(type)) {
    return { key: "club", ...PATHWAY.club };
  }

  return { key: "confidence", ...PATHWAY.confidence };
}

function DiagnosticRoute() {
  return (
    <ConversationProvider>
      <DiagnosticPage />
    </ConversationProvider>
  );
}

function DiagnosticPage() {
  const [phase, setPhase] = useState<"intro" | "connecting" | "live" | "wrapping" | "error">(
    "intro",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_LIMIT_MS / 1000);
  const transcriptRef = useRef<string[]>([]);
  const sessionIdRef = useRef<string | null>(null);
  const submittedRef = useRef(false);
  const phaseRef = useRef(phase);
  const hasConnectedRef = useRef(false);
  const intentionallyEndingRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const submitResult = useCallback(async (input: SubmitInput) => {
      if (submittedRef.current) return "Already submitted";
      const sessionId = sessionIdRef.current;
      if (!sessionId) return "Missing session";

      // Accept either `gaps: string[]` or individual `gap_1/2/3` fields
      // (depends on how the ElevenLabs agent's client tool is configured).
      const normalizedGaps: string[] = Array.isArray(input.gaps)
        ? input.gaps.filter((g): g is string => typeof g === "string" && g.trim().length > 0)
        : [input.gap_1, input.gap_2, input.gap_3].filter(
            (g): g is string => typeof g === "string" && g.trim().length > 0,
          );

      const required =
        typeof input.communication_type === "string" &&
        typeof input.readiness_score === "number" &&
        normalizedGaps.length > 0;
      if (!required) return "Missing required fields";

      const pathway = routePathway({ ...input, gaps: normalizedGaps });
      submittedRef.current = true;
      try {
        await fetch("/api/public/diagnostic-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            first_name: input.first_name,
            email: input.email,
            communication_type: input.communication_type,
            readiness_score: input.readiness_score,
            gaps: normalizedGaps,
            career_moment: input.career_moment ?? "",
            recommended_pathway: pathway.key,
            recommended_pathway_name: pathway.name,
            recommended_price: pathway.price,
            transcript: transcriptRef.current.join("\n"),
          }),
        });
      } catch (e) {
        console.error("[diagnostic] result POST failed", e);
      }
      // Score screen route is built in the next step.
      window.location.assign(`/diagnostic/result?id=${sessionId}`);
      return "Result captured";
    }, []);

  const handleDiagnosticToolCall = useCallback(async (params: SubmitInput) => {
    // Guard: ignore tool calls that fire before the session is actually live
    // (ElevenLabs occasionally invokes registered client tools on widget
    // init / reconnect handshakes with empty params — we must not treat
    // those as a real result submission).
    const sid = sessionIdRef.current;
    const input = params ?? {};
    const hasPayload =
      typeof input.communication_type === "string" &&
      input.communication_type.trim().length > 0 &&
      typeof input.readiness_score === "number" &&
      Number.isFinite(input.readiness_score) &&
      (Array.isArray(input.gaps)
        ? input.gaps.some((g) => typeof g === "string" && g.trim().length > 0)
        : [input.gap_1, input.gap_2, input.gap_3].some(
            (g) => typeof g === "string" && g.trim().length > 0,
          ));
    const sessionLive = hasConnectedRef.current && phaseRef.current === "live";
    if (!sid || !hasPayload || !sessionLive) {
      console.warn("[diagnostic] ignoring premature diagnostic tool call", {
        hasSession: Boolean(sid),
        hasPayload,
        sessionLive,
      });
      return "Ignored: session not ready";
    }
    intentionallyEndingRef.current = true;
    setPhase("wrapping");
    return submitResult(input);
  }, [submitResult]);

  const conversation = useConversation({
    onConnect: () => {
      hasConnectedRef.current = true;
      setPhase("live");
    },
    onDisconnect: (details) => {
      const intentional =
        intentionallyEndingRef.current ||
        submittedRef.current ||
        phaseRef.current === "wrapping" ||
        details?.reason === "agent";
      const sid = sessionIdRef.current;

      if (intentional) {
        if (!submittedRef.current) setPhase("wrapping");
        // Fallback: if the user ended the call or the timer expired without the
        // agent invoking submitDiagnostic, flag the session instead of losing it.
        if (sid && !submittedRef.current) {
          void fetch("/api/public/diagnostic-incomplete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: sid }),
          }).catch(() => undefined);
        }
        return;
      }

      if (phaseRef.current === "connecting" || phaseRef.current === "live") {
        setErrorMsg("Bramwell disconnected before the diagnostic finished. Please start again.");
        setPhase("error");
        return;
      }

      if (sid && !submittedRef.current) {
        void fetch("/api/public/diagnostic-incomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid }),
        }).catch(() => undefined);
      }
    },
    onError: (message, context) => {
      console.error("[diagnostic] conversation error", message, context);
      setErrorMsg("Connection lost. Please try again.");
      setPhase("error");
    },
    onMessage: (msg) => {
      const m = msg as unknown as { type?: string; [k: string]: unknown };
      if (typeof m?.message === "string" && m.role === "user") {
        transcriptRef.current.push(`You: ${m.message}`);
      } else if (typeof m?.message === "string" && m.role === "agent") {
        transcriptRef.current.push(`Bramwell: ${m.message}`);
      } else if (m?.type === "user_transcript") {
        const t = (m as { user_transcription_event?: { user_transcript?: string } })
          .user_transcription_event?.user_transcript;
        if (t) transcriptRef.current.push(`You: ${t}`);
      } else if (m?.type === "agent_response") {
        const t = (m as { agent_response_event?: { agent_response?: string } })
          .agent_response_event?.agent_response;
        if (t) transcriptRef.current.push(`Bramwell: ${t}`);
      }
    },
    clientTools: {
      submitDiagnostic: handleDiagnosticToolCall,
      submit_diagnostic: handleDiagnosticToolCall,
      submitDiagnosticResult: handleDiagnosticToolCall,
      saveDiagnosticResult: handleDiagnosticToolCall,
      completeDiagnostic: handleDiagnosticToolCall,
    },
  });

  // Five-minute hard cap
  useEffect(() => {
    if (phase !== "live") return;
    const startedAt = Date.now();
    const tick = setInterval(() => {
      const left = Math.max(
        0,
        Math.round((SESSION_LIMIT_MS - (Date.now() - startedAt)) / 1000),
      );
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(tick);
        intentionallyEndingRef.current = true;
        void Promise.resolve(conversation.endSession()).catch(() => undefined);
        setPhase("wrapping");
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [phase, conversation]);

  // Safety net: if we enter "wrapping" but the agent never fires the
  // submitDiagnostic client tool (call dropped, agent ended without invoking
  // the tool, websocket 1006, etc.), forward the user to the result page
  // anyway after a short grace window so they're never stuck on "preparing…".
  useEffect(() => {
    if (phase !== "wrapping") return;
    const sid =
      sessionIdRef.current ??
      window.sessionStorage.getItem("bramwell-diagnostic-session-id");
    if (!sid) return;
    const timeout = setTimeout(() => {
      if (submittedRef.current) return;
      window.location.assign(`/diagnostic/result?id=${sid}&incomplete=1`);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [phase]);

  const startDiagnostic = useCallback(async () => {
    setErrorMsg(null);
    setRateLimited(false);
    setPhase("connecting");
    hasConnectedRef.current = false;
    intentionallyEndingRef.current = false;
    submittedRef.current = false;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch("/api/public/diagnostic-token", {
        method: "POST",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 429) {
          setRateLimited(true);
          setErrorMsg(body?.error ?? "You've used your free diagnostics for today.");
          setPhase("error");
          return;
        }
        throw new Error(body?.error ?? `Could not start (${res.status})`);
      }
      const { token, sessionId, authMode } = (await res.json()) as {
        token?: string;
        sessionId: string;
        authMode?: "conversation-token";
      };
      sessionIdRef.current = sessionId;
      window.sessionStorage.setItem("bramwell-diagnostic-session-id", sessionId);
      transcriptRef.current = [];
      submittedRef.current = false;

      if (authMode === "conversation-token" && token) {
        await conversation.startSession({
          conversationToken: token,
          connectionType: "webrtc",
        });
      } else {
        throw new Error("Could not start diagnostic");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      console.error("[diagnostic] start failed", e);
      setErrorMsg(msg);
      setPhase("error");
    }
  }, [conversation]);

  // Auto-start when coming from the hero CTA with ?autostart=1
  const search = useSearch({ from: "/diagnostic" });
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (search.autostart === "1" && phase === "intro" && !autoStartedRef.current) {
      autoStartedRef.current = true;
      void startDiagnostic();
    }
  }, [search.autostart, phase, startDiagnostic]);

  const endEarly = useCallback(async () => {
    intentionallyEndingRef.current = true;
    try {
      await conversation.endSession();
    } catch {
      /* noop */
    }
    setPhase("wrapping");
  }, [conversation]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(1, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight">Bramwell</span>
          <span
            className="text-xl font-light tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            AI
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          <Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          <Link to="/login" className="transition-colors hover:text-foreground">Sign in</Link>
        </nav>
      </header>

      <section
        className="relative overflow-hidden pb-20 pt-12 md:pb-28 md:pt-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Free voice diagnostic
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Your free Bramwell diagnostic
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Bramwell will ask you one question, listen to your answer, and give
            you your communication type, your three biggest gaps, and your
            Readiness Score. Five minutes. No login, no card.
          </p>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-border bg-foreground/[0.03] p-8 backdrop-blur">
            {phase === "intro" && (
              <>
                <p className="text-sm text-muted-foreground">
                  When you're ready, allow microphone access. Bramwell will
                  greet you and ask: <em>"Tell me about yourself."</em>
                </p>
                <button
                  onClick={startDiagnostic}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition hover:opacity-95"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  Start the diagnostic
                </button>
                <p className="mt-4 text-xs text-muted-foreground">
                  Five-minute limit · Private by design
                </p>
              </>
            )}

            {phase === "connecting" && (
              <p className="text-sm text-muted-foreground">
                Connecting Bramwell…
              </p>
            )}

            {phase === "live" && (
              <>
                <div className="flex items-center justify-center gap-3">
                  <span
                    aria-hidden
                    className={`inline-block h-3 w-3 rounded-full ${
                      conversation.isSpeaking ? "animate-pulse" : ""
                    }`}
                    style={{ background: "var(--primary)" }}
                  />
                  <span className="text-sm font-medium">
                    {conversation.isSpeaking
                      ? "Bramwell is speaking…"
                      : "Listening…"}
                  </span>
                </div>
                <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight">
                  {mm}:{ss}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Time remaining
                </p>
                <button
                  onClick={endEarly}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium transition hover:bg-foreground/10"
                >
                  End and get my result
                </button>
              </>
            )}

            {phase === "wrapping" && (
              <>
                <p className="text-sm text-muted-foreground">
                  Bramwell is preparing your Readiness Score…
                </p>
                <p className="mt-2 text-xs text-muted-foreground/70">
                  This usually takes a few seconds. If nothing happens, use the button below.
                </p>
                <button
                  onClick={() => {
                    const sid =
                      sessionIdRef.current ??
                      window.sessionStorage.getItem("bramwell-diagnostic-session-id");
                    if (sid) {
                      window.location.assign(
                        `/diagnostic/result?id=${sid}&incomplete=1`,
                      );
                    } else {
                      setErrorMsg("We could not find this diagnostic session. Please start again.");
                      setPhase("error");
                    }
                  }}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium transition hover:bg-foreground/10"
                >
                  Take me to my result →
                </button>
              </>
            )}

            {phase === "error" && (
              <>
                {rateLimited ? (
                  <>
                    <p className="text-base font-medium text-foreground">
                      You've used your free diagnostic for today.
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      The free version is a five-minute snapshot. To keep
                      going — rehearse real questions, get specific
                      feedback, and actually move your Readiness Score —
                      pick a Bramwell pathway.
                    </p>
                    <Link
                      to="/pricing"
                      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition hover:opacity-95"
                      style={{
                        background: "var(--gradient-gold)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      See coaching pathways →
                    </Link>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Free diagnostics reset every 24 hours.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-destructive">{errorMsg}</p>
                    <button
                      onClick={startDiagnostic}
                      className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium transition hover:bg-foreground/10"
                    >
                      Try again
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-10">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight">Bramwell</span>
            <span
              className="text-base font-light tracking-tight"
              style={{ color: "var(--primary)" }}
            >
              AI
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bramwell AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}