import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CtaButton } from "@/components/site/CtaButton";

export const Route = createFileRoute("/diagnostic/")({
  component: DiagnosticRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    autostart: search.autostart === "1" ? "1" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Try Bramwell Free. Hear how you really sound" },
      {
        name: "description",
        content:
          "A free voice session with Bramwell. Answer one question, get your communication type, your three biggest gaps, and your Readiness Score.",
      },
      { property: "og:title", content: "Try Bramwell Free" },
      {
        property: "og:description",
        content:
          "One question with Bramwell. Your communication type, three biggest gaps, and Readiness Score. No login, no card.",
      },
    ],
  }),
});

// Pathway routing, mirrors src/routes/pricing.tsx keys.
const PATHWAY = {
  graduate: { name: "Graduate Interview Sprint", price: "$99 AUD" },
  comeback: { name: "Career Comeback Sprint", price: "$199 AUD" },
  confidence: { name: "Interview Confidence Sprint", price: "$249 AUD" },
  executive: { name: "Executive Communication Sprint", price: "$499 AUD" },
  club: { name: "Career Confidence Club", price: "$79 AUD / month" },
} as const;
type PathwayKey = keyof typeof PATHWAY;

const SESSION_LIMIT_MS = 5 * 60 * 1000;
const RESULT_NAV_MIN_DELAY_MS = 45000;
const RESULT_NAV_SILENCE_MS = 10000;
const RESULT_NAV_HARD_CAP_MS = 90000;

type ConversationHandle = {
  endSession: () => unknown;
  sendContextualUpdate?: (text: string) => unknown;
  isSpeaking?: boolean;
  status?: string;
};

type SubmitInput = {
  sessionId?: string;
  session_id?: string;
  communication_type?: string;
  readiness_score?: number | string;
  gaps?: string[];
  gap_1?: string;
  gap_2?: string;
  gap_3?: string;
  career_moment?: string;
  first_name?: string;
  email?: string;
  metrics?: unknown;
};

function normalizeCommunicationType(value: unknown): SubmitInput["communication_type"] | null {
  if (typeof value !== "string") return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const aliases: Record<string, string> = {
    invisible_achiever: "invisible_achiever",
    invisible_achievers: "invisible_achiever",
    over_explainer: "over_explainer",
    overexplainer: "over_explainer",
    under_seller: "under_seller",
    underseller: "under_seller",
    rambler: "rambler",
    apologiser: "apologiser",
    apologizer: "apologiser",
    next_level_leader: "next_level_leader",
    nextlevelleader: "next_level_leader",
  };

  return aliases[normalized] ?? null;
}

function diagnosticResultCacheKey(sessionId: string) {
  return `bramwell-diagnostic-result:${sessionId}`;
}

async function fetchSavedDiagnosticResult(sessionId: string): Promise<"ready" | "incomplete" | "missing"> {
  const res = await fetch(`/api/public/diagnostic-result?id=${encodeURIComponent(sessionId)}`);
  if (res.status === 404) return "missing";
  if (!res.ok) return "incomplete";
  const json = (await res.json().catch(() => ({}))) as { result?: unknown; incomplete?: boolean };
  return json.result ? "ready" : "incomplete";
}

function normalizeReadinessScore(value: SubmitInput["readiness_score"]): number | null {
  const score =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;
  if (!Number.isFinite(score)) return null;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function routePathway(
  input: SubmitInput,
): { key: PathwayKey; name: string; price: string } {
  const moment = (input.career_moment ?? "").toLowerCase();
  const type = normalizeCommunicationType(input.communication_type) ?? "";
  const score = normalizeReadinessScore(input.readiness_score) ?? 0;

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

  // Simple monthly pricing as the default recommendation: every archetype
  // flows into the Career Confidence Club, with sprints available as upsells
  // on the pricing page. Career-moment hints are still surfaced in the result
  // copy, but the purchase path is a single, low-friction subscription.
  return { key: "club", ...PATHWAY.club };
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
    "connecting",
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
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [resultReadyId, setResultReadyId] = useState<string | null>(null);
  const [pendingNavigateId, setPendingNavigateId] = useState<string | null>(null);
  const conversationRef = useRef<ConversationHandle | null>(null);
  const sessionStartedAtRef = useRef<number | null>(null);
  const timeWarningSentRef = useRef(false);
  const resultSubmittedAtRef = useRef<number | null>(null);
  const lastAgentResponseAtRef = useRef<number | null>(null);
  const resultReadyRef = useRef(false);

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

      const readinessScore = normalizeReadinessScore(input.readiness_score);
      const communicationType = normalizeCommunicationType(input.communication_type);
      const required =
        communicationType !== null &&
        readinessScore !== null &&
        normalizedGaps.length > 0;
      if (!required) return "Missing required fields";

      const normalizedInput = {
        ...input,
        communication_type: communicationType,
        gaps: normalizedGaps,
        readiness_score: readinessScore,
      };
      const pathway = routePathway(normalizedInput);
      submittedRef.current = true;
      resultReadyRef.current = true;
      resultSubmittedAtRef.current = Date.now();
      try {
        const res = await fetch("/api/public/diagnostic-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            first_name: input.first_name,
            email: input.email,
            communication_type: communicationType,
            readiness_score: readinessScore,
            gaps: normalizedGaps,
            career_moment: input.career_moment ?? "",
            recommended_pathway: pathway.key,
            recommended_pathway_name: pathway.name,
            recommended_price: pathway.price,
            transcript: transcriptRef.current.join("\n"),
            metrics: input.metrics,
          }),
        });
        if (!res.ok) throw new Error(`Result save failed (${res.status})`);
        window.sessionStorage.setItem(
          diagnosticResultCacheKey(sessionId),
          JSON.stringify({
            id: sessionId,
            first_name: input.first_name ?? null,
            has_email: Boolean(input.email),
            communication_type: communicationType,
            readiness_score: readinessScore,
            gaps: normalizedGaps,
            career_moment: input.career_moment || null,
            recommended_pathway: pathway.key,
            recommended_pathway_name: pathway.name,
            recommended_price: pathway.price,
            metrics: input.metrics ?? null,
          }),
        );
      } catch (e) {
        submittedRef.current = false;
        resultSubmittedAtRef.current = null;
        console.error("[diagnostic] result POST failed", e);
        return "Could not save result";
      }
      // Save the result, but do not flip the UI or end the call here, the
      // client tool can fire while Bramwell is still speaking the feedback.
      setResultReadyId(sessionId);
      setPendingNavigateId(sessionId);
      return "Result captured";
    }, []);

  const handleDiagnosticToolCall = useCallback(async (params: SubmitInput) => {
    // Guard: ignore tool calls that fire before the session is actually live
    // (ElevenLabs occasionally invokes registered client tools on widget
    // init / reconnect handshakes with empty params, we must not treat
    // those as a real result submission).
    const sid = sessionIdRef.current;
    const input = params ?? {};
    const hasPayload =
      normalizeCommunicationType(input.communication_type) !== null &&
      normalizeReadinessScore(input.readiness_score) !== null &&
      (Array.isArray(input.gaps)
        ? input.gaps.some((g) => typeof g === "string" && g.trim().length > 0)
        : [input.gap_1, input.gap_2, input.gap_3].some(
            (g) => typeof g === "string" && g.trim().length > 0,
          ));
    const sessionLive =
      hasConnectedRef.current &&
      (phaseRef.current === "live" || phaseRef.current === "wrapping");
    if (!sid || !hasPayload || !sessionLive) {
      console.warn("[diagnostic] ignoring premature diagnostic tool call", {
        hasSession: Boolean(sid),
        hasPayload,
        sessionLive,
      });
      return "Ignored: session not ready";
    }
    const result = await submitResult(input);
    if (result === "Result captured") {
      // After the result is saved, nudge Bramwell to speak the summary out loud
      // so the user hears their score and type before the page transitions.
      try {
        void conversationRef.current?.sendContextualUpdate?.(
          "The diagnostic result has been saved. Now give the user a warm, concise 2-sentence summary of their communication type and Readiness Score in plain language, tell them what it means, and say goodbye. Do not ask another question."
        );
      } catch {
        /* noop */
      }
    }
    return result;
  }, [submitResult]);

  const finalizeFromTranscript = useCallback(async (sessionId: string) => {
    const res = await fetch("/api/public/diagnostic-incomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        transcript: transcriptRef.current.join("\n"),
      }),
    }).catch(() => null);

    if (!res?.ok) return false;
    const body = (await res.json().catch(() => ({}))) as { completed?: boolean };
    if (!body.completed) return false;

    submittedRef.current = true;
    resultReadyRef.current = true;
    resultSubmittedAtRef.current ??= Date.now();
    setResultReadyId(sessionId);
    setPendingNavigateId(sessionId);
    return true;
  }, []);

  const conversation = useConversation({
    onConnect: () => {
      hasConnectedRef.current = true;
      sessionStartedAtRef.current = Date.now();
      setSecondsLeft(SESSION_LIMIT_MS / 1000);
      setPhase("live");
    },
    onDisconnect: (details) => {
      console.warn("[diagnostic] conversation disconnected", details);
      const intentional =
        intentionallyEndingRef.current ||
        submittedRef.current ||
        resultReadyRef.current ||
        phaseRef.current === "wrapping";
      const sid = sessionIdRef.current;

      if (intentional) {
        if (submittedRef.current && sid) {
          // Do not navigate immediately. Let the pendingNavigateId useEffect
          // wait until Bramwell finishes his spoken summary before moving
          // to the result page, so users never get a silent hard cut.
          setPendingNavigateId(sid);
          return;
        }
        if (!submittedRef.current) setPhase("wrapping");
        // Fallback: if the user ended the call or the timer expired without the
        // agent invoking submitDiagnostic, flag the session instead of losing it.
        if (sid && !submittedRef.current) {
          void finalizeFromTranscript(sid);
        }
        return;
      }

      if (phaseRef.current === "connecting" || phaseRef.current === "live") {
        // With an ElevenLabs webhook/server tool, the result is saved directly
        // to the backend, so the browser may never receive a client-tool event.
        // Move into the result-waiting state instead of showing an immediate
        // failure while the webhook is still arriving.
        if (sid) {
          setPhase("wrapping");
          setPendingNavigateId(sid);
          return;
        }
        setErrorMsg("Bramwell disconnected before the diagnostic started. Please start again.");
        setPhase("error");
        return;
      }

      if (sid && !submittedRef.current) {
        void finalizeFromTranscript(sid);
      }
    },
    onError: (message, context) => {
      console.error("[diagnostic] conversation error", message, context);
      if (submittedRef.current || pendingNavigateId) return;
      setErrorMsg("Connection lost. Please try again.");
      setPhase("error");
    },
    onUnhandledClientToolCall: (toolCall) => {
      console.warn("[diagnostic] unhandled client tool call", toolCall);
    },
    onMessage: (msg) => {
      const m = msg as unknown as { type?: string; [k: string]: unknown };
      if (typeof m?.message === "string" && m.role === "user") {
        transcriptRef.current.push(`You: ${m.message}`);
      } else if (typeof m?.message === "string" && m.role === "agent") {
        transcriptRef.current.push(`Bramwell: ${m.message}`);
        lastAgentResponseAtRef.current = Date.now();
      } else if (m?.type === "user_transcript") {
        const t = (m as { user_transcription_event?: { user_transcript?: string } })
          .user_transcription_event?.user_transcript;
        if (t) transcriptRef.current.push(`You: ${t}`);
      } else if (m?.type === "agent_response") {
        const t = (m as { agent_response_event?: { agent_response?: string } })
          .agent_response_event?.agent_response;
        if (t) {
          transcriptRef.current.push(`Bramwell: ${t}`);
          lastAgentResponseAtRef.current = Date.now();
        }
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

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  useEffect(() => {
    const ignoreMalformedElevenLabsError = (event: PromiseRejectionEvent) => {
      const message =
        event.reason instanceof Error
          ? event.reason.message
          : typeof event.reason === "string"
            ? event.reason
            : "";
      if (message === "Cannot read properties of undefined (reading 'error_type')") {
        event.preventDefault();
        console.warn("[diagnostic] ignored malformed ElevenLabs error event");
      }
    };
    window.addEventListener("unhandledrejection", ignoreMalformedElevenLabsError);
    return () => {
      window.removeEventListener("unhandledrejection", ignoreMalformedElevenLabsError);
    };
  }, []);

  // Five-minute hard cap
  useEffect(() => {
    if (phase !== "live") return;
    if (!sessionStartedAtRef.current) sessionStartedAtRef.current = Date.now();
    const tick = setInterval(() => {
      const startedAt = sessionStartedAtRef.current ?? Date.now();
      const left = Math.max(
        0,
        Math.ceil((SESSION_LIMIT_MS - (Date.now() - startedAt)) / 1000),
      );
      setSecondsLeft((current) => Math.min(current, left));
      if (left <= 15 && !timeWarningSentRef.current && !submittedRef.current) {
        timeWarningSentRef.current = true;
        try {
          void conversationRef.current?.sendContextualUpdate?.(
            "The five-minute diagnostic is ending. Stop asking questions now, give concise final feedback, and call submitDiagnostic with the final result.",
          );
        } catch {
          /* noop */
        }
      }
      if (left <= 0) {
        clearInterval(tick);
        if (submittedRef.current) return;
        intentionallyEndingRef.current = true;
        setPhase("wrapping");
        try {
          void conversationRef.current?.endSession();
        } catch {
          /* noop */
        }
      }
    }, 250);
    return () => clearInterval(tick);
  }, [phase]);

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
      if (submittedRef.current || pendingNavigateId) return;
      void finalizeFromTranscript(sid).finally(() => {
        window.location.assign(`/diagnostic/result?id=${sid}`);
      });
    }, 12000);
    return () => clearTimeout(timeout);
  }, [phase, pendingNavigateId, finalizeFromTranscript]);

  // Server/webhook tools save the score without calling the browser. Poll the
  // current session so the UI can move forward as soon as the backend result
  // exists, even if no client-tool callback fires.
  useEffect(() => {
    if (!currentSessionId || (phase !== "live" && phase !== "wrapping")) return;
    let cancelled = false;

    const checkForWebhookResult = async () => {
      if (cancelled || resultReadyRef.current) return;
      const status = await fetchSavedDiagnosticResult(currentSessionId);
      if (cancelled || status !== "ready") return;

      resultReadyRef.current = true;
      submittedRef.current = true;
      resultSubmittedAtRef.current ??= Date.now();
      setResultReadyId(currentSessionId);
      setPendingNavigateId(currentSessionId);
      setPhase("wrapping");
    };

    const poll = window.setInterval(() => void checkForWebhookResult(), 1500);
    void checkForWebhookResult();
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, [currentSessionId, phase]);

  // Once a result is expected, wait for it to exist in the backend before
  // navigating. This supports both client tools and ElevenLabs webhook/server
  // tools. If the webhook never lands, the result page will show the retry
  // state instead of a generic Not found.
  useEffect(() => {
    if (!pendingNavigateId) return;
    const target = `/diagnostic/result?id=${pendingNavigateId}`;
    let cancelled = false;
    const submittedAt = resultSubmittedAtRef.current ?? Date.now();
    let notSpeakingSince: number | null = null;
    let resultIsReady = Boolean(resultReadyId);

    const check = async () => {
      if (cancelled) return;
      const now = Date.now();
      const elapsed = now - submittedAt;
      const lastAgentSpeechAt = lastAgentResponseAtRef.current ?? submittedAt;
      const hasWaitedLongEnough = elapsed >= RESULT_NAV_MIN_DELAY_MS;
      const hasTrailingSilence = now - lastAgentSpeechAt >= RESULT_NAV_SILENCE_MS;
      const isSpeaking = Boolean(conversationRef.current?.isSpeaking);
      const isDisconnected = conversationRef.current?.status === "disconnected";

      if (!resultIsReady) {
        resultIsReady = (await fetchSavedDiagnosticResult(pendingNavigateId)) === "ready";
      }

      if (isDisconnected) {
        if (resultIsReady) {
          window.location.assign(target);
          return;
        }
        if (elapsed >= RESULT_NAV_HARD_CAP_MS) {
          void finalizeFromTranscript(pendingNavigateId).finally(() => {
            window.location.assign(target);
          });
        }
        return;
      }

      if (isSpeaking) {
        notSpeakingSince = null;
        return;
      }

      notSpeakingSince ??= now;
      const hasContinuousSilence = now - notSpeakingSince >= RESULT_NAV_SILENCE_MS;

      if (resultIsReady && hasWaitedLongEnough && hasTrailingSilence && hasContinuousSilence) {
        window.location.assign(target);
      }
    };

    const poll = setInterval(() => void check(), 1000);
    void check();

    // Hard safety cap so users are never stranded if isSpeaking never flips.
    const hardTimeout = setTimeout(() => {
      if (cancelled) return;
      if (resultIsReady) {
        window.location.assign(target);
        return;
      }
      void finalizeFromTranscript(pendingNavigateId).finally(() => {
        window.location.assign(target);
      });
    }, RESULT_NAV_HARD_CAP_MS);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearTimeout(hardTimeout);
    };
  }, [pendingNavigateId, resultReadyId, finalizeFromTranscript]);

  const startDiagnostic = useCallback(async () => {
    setErrorMsg(null);
    setRateLimited(false);
    setPhase("connecting");
    hasConnectedRef.current = false;
    intentionallyEndingRef.current = false;
    submittedRef.current = false;
    setCurrentSessionId(null);
    setResultReadyId(null);
    setPendingNavigateId(null);
    resultReadyRef.current = false;
    setSecondsLeft(SESSION_LIMIT_MS / 1000);
    sessionStartedAtRef.current = null;
    timeWarningSentRef.current = false;
    resultSubmittedAtRef.current = null;
    lastAgentResponseAtRef.current = null;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const res = await fetch("/api/public/diagnostic-token", {
        method: "POST",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 429) {
          setRateLimited(true);
          setErrorMsg(body?.error ?? "You've used your free session for today.");
          setPhase("error");
          return;
        }
        throw new Error(body?.error ?? `Could not start (${res.status})`);
      }
      const { token, signedUrl, sessionId, authMode } = (await res.json()) as {
        token?: string;
        signedUrl?: string;
        sessionId: string;
        authMode?: "conversation-token" | "signed-url";
      };
      sessionIdRef.current = sessionId;
      setCurrentSessionId(sessionId);
      window.sessionStorage.setItem("bramwell-diagnostic-session-id", sessionId);
      transcriptRef.current = [];
      submittedRef.current = false;
      const dynamicVariables = {
        sessionId,
        session_id: sessionId,
        user_first_name: "there",
      };

      if (authMode === "signed-url" && signedUrl) {
        await conversation.startSession({
          signedUrl,
          connectionType: "websocket",
          dynamicVariables,
        });
      } else if (authMode === "conversation-token" && token) {
        await conversation.startSession({
          conversationToken: token,
          connectionType: "webrtc",
          dynamicVariables,
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

  // Always auto-start immediately — no intro page. The CTA opens ElevenLabs directly.
  useSearch({ from: "/diagnostic/" });
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    void startDiagnostic();
  }, [startDiagnostic]);

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
  const visibleSessionId = resultReadyId ?? pendingNavigateId ?? currentSessionId;
  const resultHref = visibleSessionId
    ? `/diagnostic/result?id=${visibleSessionId}`
    : "/diagnostic";

  return (
    <main className="relative flex min-h-screen flex-col bg-background text-foreground">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-6 py-6 md:px-10">
        <Link to="/" className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight">Bramwell</span>
          <span
            className="text-xl font-light tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            AI
          </span>
        </Link>
      </header>

      <section
        className="relative flex flex-1 items-center overflow-hidden px-6 py-16 md:px-10"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative mx-auto w-full max-w-3xl text-center">
          {phase === "intro" && (
            <>
              <div className="flex justify-center">
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase text-muted-foreground backdrop-blur"
                  style={{ letterSpacing: "0.22em" }}
                >
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  Free · Live · No card required
                </span>
              </div>
              <h1
                className="mt-6 text-balance font-extrabold tracking-tight text-white"
                style={{
                  fontSize: "clamp(40px, 6.5vw, 76px)",
                  lineHeight: 1.04,
                  fontWeight: 800,
                }}
              >
                Talk to Bramwell. Hear what the room hears.
              </h1>
              <p className="mx-auto mt-6 max-w-[560px] text-[18px] leading-relaxed text-muted-foreground">
                Answer one question out loud. Bramwell will show you exactly how you sound under pressure.
              </p>
              <div className="mt-8 flex justify-center">
                <CtaButton as="button" onClick={startDiagnostic} size="lg">
                  Start free voice session
                </CtaButton>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Instant result · Free · No credit card
              </p>

              <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {[
                  {
                    title: "3 minutes",
                    body: "One question. One honest answer.",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" /></svg>
                    ),
                  },
                  {
                    title: "Private by default",
                    body: "No login, no card. Audio deleted after analysis.",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /></svg>
                    ),
                  },
                  {
                    title: "Research-backed",
                    body: "40+ years of communication science.",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 4-9 4-9-4 9-4z" /><path d="M21 10v5M6 9v5a6 6 0 0 0 12 0V9" /></svg>
                    ),
                  },
                ].map((item) => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-border bg-foreground/[0.03] px-4 py-3 text-left backdrop-blur"
                  >
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      {item.icon}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                      <span className="text-xs leading-snug text-muted-foreground">{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mx-auto mt-10 max-w-xl border-t border-border/60 pt-6">
                <p
                  className="text-[10px] font-semibold uppercase"
                  style={{ letterSpacing: "0.24em", color: "var(--primary)" }}
                >
                  The science behind Bramwell
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Trained on <span className="font-semibold text-white">10,000+ hours</span> of
                  high-stakes interviews, pitches and board briefings, analysed against the
                  frameworks of <span className="font-semibold text-white">Mehrabian, Cuddy,
                  Goleman and Carnegie</span>. Bramwell hears what interviewers and boards hear,
                  and tells you what they won't.
                </p>
              </div>
            </>
          )}

          {phase !== "intro" && (
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-foreground/[0.03] p-8 backdrop-blur">
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
                {resultReadyId || pendingNavigateId ? (
                  <p className="text-sm text-muted-foreground">
                    Your Readiness Score is ready.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Bramwell is scoring your answer…
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground/70">
                  This usually takes a few seconds. If the voice handoff misses, Bramwell will score from your transcript.
                </p>
                <a
                  href={resultHref}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium transition hover:bg-foreground/10"
                >
                  Take me to my result →
                </a>
              </>
            )}

            {phase === "error" && (
              <>
                {rateLimited ? (
                  <>
                    <p className="text-base font-medium text-foreground">
                      You've used your free session for today.
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      The free session is a quick snapshot. To keep
                      going: rehearse real questions, get specific
                      feedback, and actually move your Readiness Score,
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
                      Free sessions reset every 24 hours.
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
          )}
        </div>
      </section>
    </main>
  );
}