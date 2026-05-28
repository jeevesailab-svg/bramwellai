import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/diagnostic")({
  component: DiagnosticPage,
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

function DiagnosticPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"intro" | "connecting" | "live" | "wrapping" | "error">(
    "intro",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_LIMIT_MS / 1000);
  const transcriptRef = useRef<string[]>([]);
  const sessionIdRef = useRef<string | null>(null);
  const submittedRef = useRef(false);

  const submitResult = useCallback(
    async (input: SubmitInput) => {
      if (submittedRef.current) return "Already submitted";
      const sessionId = sessionIdRef.current;
      if (!sessionId) return "Missing session";

      const required =
        typeof input.communication_type === "string" &&
        typeof input.readiness_score === "number" &&
        Array.isArray(input.gaps) &&
        input.gaps.length > 0;
      if (!required) return "Missing required fields";

      const pathway = routePathway(input);
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
            gaps: input.gaps,
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
      navigate({
        to: "/diagnostic/result",
        search: { id: sessionId },
      }).catch(() => {
        /* result route not built yet; ignore */
      });
      return "Result captured";
    },
    [navigate],
  );

  const conversation = useConversation({
    onConnect: () => setPhase("live"),
    onDisconnect: () => {
      setPhase((p) => (p === "wrapping" ? "wrapping" : "intro"));
    },
    onError: (err) => {
      console.error("[diagnostic] conversation error", err);
      setErrorMsg("Connection lost. Please try again.");
      setPhase("error");
    },
    onMessage: (msg) => {
      const m = msg as unknown as { type?: string; [k: string]: unknown };
      if (m?.type === "user_transcript") {
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
      submitDiagnostic: async (params: SubmitInput) => {
        setPhase("wrapping");
        return submitResult(params ?? {});
      },
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
        void Promise.resolve(conversation.endSession()).catch(() => undefined);
        setPhase("wrapping");
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [phase, conversation]);

  const startDiagnostic = useCallback(async () => {
    setErrorMsg(null);
    setPhase("connecting");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch("/api/public/diagnostic-token", {
        method: "POST",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body?.error ?? `Could not start (${res.status})`);
      }
      const { token, sessionId } = (await res.json()) as {
        token: string;
        agentId: string;
        sessionId: string;
      };
      sessionIdRef.current = sessionId;
      transcriptRef.current = [];
      submittedRef.current = false;

      await conversation.startSession({
        conversationToken: token,
        connectionType: "webrtc",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      console.error("[diagnostic] start failed", e);
      setErrorMsg(msg);
      setPhase("error");
    }
  }, [conversation]);

  const endEarly = useCallback(async () => {
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
              <p className="text-sm text-muted-foreground">
                Bramwell is preparing your Readiness Score…
              </p>
            )}

            {phase === "error" && (
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