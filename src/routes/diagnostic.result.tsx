import { getScoreBand, SCORE_SCALE, getCeoGap } from "@/lib/scoreBand";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/diagnostic/result")({
  component: DiagnosticResultPage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : "",
    incomplete: search.incomplete === "1" ? "1" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Your Bramwell Readiness Score" },
      {
        name: "description",
        content:
          "Your Communication Readiness Score, distance from CEO level, and the three gaps to fix. From Bramwell AI.",
      },
      { property: "og:title", content: "Your Bramwell Readiness Score" },
      {
        property: "og:description",
        content:
          "Your Communication Readiness Score, distance from CEO level, and the three gaps to fix.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type PathwayKey =
  | "graduate"
  | "comeback"
  | "confidence"
  | "executive"
  | "club";

type Result = {
  id: string;
  first_name: string | null;
  has_email: boolean;
  communication_type: string;
  readiness_score: number;
  gaps: string[];
  career_moment: string | null;
  recommended_pathway: PathwayKey;
  recommended_pathway_name: string;
  recommended_price: string;
  metrics?: Metrics | null;
};

type Metrics = {
  filler_words?: { total?: number; top?: { word: string; count: number }[] };
  pace?: {
    words_per_minute?: number;
    longest_pause_sec?: number;
    long_pauses_count?: number;
  };
  hedging?: { total?: number; samples?: string[] };
  structure?: {
    time_to_point_sec?: number;
    led_with_point?: boolean;
    ramble_score?: number;
  };
  sub_scores?: {
    structure: number;
    specificity: number;
    confidence: number;
    relevance: number;
  };
  evidence?: { quote: string; dimension: string; note: string }[];
  rewrite?: { original: string; rewritten: string; why: string };
};

const STRIPE: Record<PathwayKey, string> = {
  graduate: import.meta.env.VITE_STRIPE_GRADUATE ?? "#",
  comeback: import.meta.env.VITE_STRIPE_COMEBACK ?? "#",
  confidence: import.meta.env.VITE_STRIPE_CONFIDENCE ?? "#",
  executive: import.meta.env.VITE_STRIPE_EXECUTIVE ?? "#",
  club: import.meta.env.VITE_STRIPE_CLUB ?? "#",
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  structure_gap:
    "Your ideas are strong. The problem is structure. You'll learn the communication frameworks that senior professionals use to organise their thinking on the spot, so your point arrives clearly, and the room remembers it.",
  conviction_gap:
    "You've done the work. The gap is between what you've delivered and how you're describing it. You'll learn the system that translates your results into precise, confident language, so what you say in the room reflects what you've actually achieved.",
  concision_gap:
    "You have command of the detail. The challenge is knowing when to use it. You give the room the full picture when they need the headline. We'll train you to lead with your conclusion, hold the detail in reserve, and become the person leadership turns to when they need clarity under pressure.",
  authority_gap:
    "You have the credentials, the experience, and the track record. What needs work is how that comes across under pressure. We'll close the gap between your capability and your delivery, so the room hears your authority from the first sentence.",
  signal_gap:
    "You're operating at a high level. The problem is visibility. You've been focused on the work while others have been focused on being seen doing it. We'll make sure the people who matter know exactly what you're contributing, because impact that isn't communicated doesn't advance a career.",
  command_edge:
    "You already present well and hold the room. What we're refining now is the difference between competent and commanding, the precision, the timing, the presence that makes people stop and listen. That's the final edge.",
};

const TYPE_LABELS: Record<string, string> = {
  structure_gap: "Structure gap",
  conviction_gap: "Conviction gap",
  concision_gap: "Concision gap",
  authority_gap: "Authority gap",
  signal_gap: "Signal gap",
  command_edge: "Command edge",
};

const TYPE_ALIASES: Record<string, string> = {
  rambler: "structure_gap",
  under_seller: "conviction_gap",
  underseller: "conviction_gap",
  over_explainer: "concision_gap",
  overexplainer: "concision_gap",
  apologiser: "authority_gap",
  apologizer: "authority_gap",
  invisible_achiever: "signal_gap",
  invisible_achievers: "signal_gap",
  next_level_leader: "command_edge",
  nextlevelleader: "command_edge",
};

const PATHWAY_OUTCOMES: Record<PathwayKey, string[]> = {
  graduate: [
    "You stop sounding like a student and start sounding like a professional.",
    "Your Tell Me About Yourself lands in under 90 seconds.",
    "You walk in knowing your answer is ready.",
  ],
  comeback: [
    "You explain your gap without sounding defensive.",
    "You reconnect with your professional value.",
    "You walk in with your confidence and your story back.",
  ],
  confidence: [
    "You lead with your strongest point every time.",
    "You stop rambling under pressure.",
    "You sound as capable as you actually are.",
  ],
  executive: [
    "You sound as senior as your experience.",
    "You own the room before you finish your first sentence.",
    "You speak with the authority of the level above.",
  ],
  club: [
    "You are always ready for the next high-stakes moment.",
    "Every conversation, interview, negotiation, presentation, feels like home ground.",
    "Bramwell stays with you for every interview, every pitch, every year.",
  ],
};

function diagnosticResultCacheKey(sessionId: string) {
  return `bramwell-diagnostic-result:${sessionId}`;
}

function readCachedResult(id: string): Result | null {
  try {
    const raw = window.sessionStorage.getItem(diagnosticResultCacheKey(id));
    if (!raw) return null;
    const result = JSON.parse(raw) as Result;
    return result?.id === id ? result : null;
  } catch {
    return null;
  }
}

function describeType(type: string): string {
  const key = normalizeTypeKey(type);
  return (
    TYPE_DESCRIPTIONS[key] ??
    "Your communication has a clear pattern, and a clear way to sharpen it."
  );
}

function normalizeTypeKey(type: string): string {
  const key = type
    .toLowerCase()
    .replace(/^the\s+/i, "")
    .trim()
    .replace(/[\s-]+/g, "_");
  return TYPE_ALIASES[key] ?? key;
}

function formatType(type: string): string {
  const cleaned = normalizeTypeKey(type).replace(/_/g, " ");
  const key = normalizeTypeKey(type);
  if (TYPE_LABELS[key]) return TYPE_LABELS[key];
  const titled = cleaned
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
  return titled;
}

function DiagnosticResultPage() {
  const { id, incomplete } = Route.useSearch();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "error"; message: string; incomplete?: boolean }
    | { kind: "ready"; result: Result }
  >({ kind: "loading" });

  useEffect(() => {
    if (!id) {
      setState({ kind: "error", message: "Missing diagnostic id." });
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/public/diagnostic-result?id=${encodeURIComponent(id)}`,
        );
        if (!res.ok) {
          const cached = readCachedResult(id);
          if (cached) {
            if (active) setState({ kind: "ready", result: cached });
            return;
          }
          const body = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(body?.error ?? `Failed (${res.status})`);
        }
        const json = (await res.json()) as { result?: Result; incomplete?: boolean };
        if (json.incomplete || !json.result) {
          const cached = readCachedResult(id);
          if (cached) {
            if (active) setState({ kind: "ready", result: cached });
            return;
          }
          if (active)
            setState({
              kind: "error",
              incomplete: true,
              message:
                "Your call ended before Bramwell finalised your score.",
            });
          return;
        }
        if (active) setState({ kind: "ready", result: json.result });
      } catch (e) {
        const cached = readCachedResult(id);
        if (cached) {
          if (active) setState({ kind: "ready", result: cached });
          return;
        }
        if (active)
          setState({
            kind: "error",
            message: e instanceof Error ? e.message : "Something went wrong",
          });
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

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
          <Link to="/program" className="transition-colors hover:text-foreground">Pricing</Link>
          <Link to="/login" className="transition-colors hover:text-foreground">Sign in</Link>
        </nav>
      </header>

      <section
        className="relative overflow-hidden pb-20 pt-8 md:pb-28 md:pt-12"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative mx-auto max-w-2xl px-6 md:px-10">
          {state.kind === "loading" && (
            <p className="py-24 text-center text-sm text-muted-foreground">
              Loading your results…
            </p>
          )}
          {state.kind === "error" && (
            <div className="py-24 text-center">
              {incomplete === "1" || state.incomplete ? (
                <>
                  <p className="mx-auto max-w-md text-base text-foreground/90">
                    Your call ended before Bramwell could finalise your
                    Readiness Score.
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                    This usually means the conversation was too short.
                    Give it another five minutes, answer one question the way
                    you normally would, and Bramwell will score you on the spot.
                  </p>
                  <Link
                    to="/diagnostic" search={{}}
                    className="mt-8 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-semibold transition hover:opacity-95"
                    style={{
                      background: "var(--gradient-gold)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    Try the diagnostic again
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm text-destructive">{state.message}</p>
                  <Link
                    to="/diagnostic" search={{}}
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium transition hover:bg-foreground/10"
                  >
                    Take the diagnostic
                  </Link>
                </>
              )}
            </div>
          )}
          {state.kind === "ready" && <ResultBody result={state.result} />}
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

function ResultBody({ result }: { result: Result }) {
  return <ResultBodyInner result={result} />;
}

function CeoBenchmark({ score }: { score: number }) {
  const { benchmark, gap, atOrAbove, progressPct, verdict } = getCeoGap(score);
  return (
    <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-foreground/[0.03] p-6 text-left">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Distance from CEO level
        </p>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--primary)" }}
        >
          {atOrAbove ? "At benchmark" : `${gap} points to go`}
        </p>
      </div>

      <div className="relative mt-5 h-2 w-full rounded-full bg-foreground/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progressPct}%`,
            backgroundImage: "var(--gradient-gold)",
          }}
        />
        <div className="absolute -top-1 h-4 w-px bg-foreground/50" style={{ left: "100%" }} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>You: {score}</span>
        <span>CEO benchmark: {benchmark}</span>
      </div>

      <p className="mt-4 text-base leading-relaxed text-foreground/90">
        {verdict}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        The CEO benchmark is the average score of senior executives on the same
        four dimensions: Structure, Specificity, Confidence Signals, Relevance.
      </p>
    </div>
  );
}

function ResultBodyInner({ result }: { result: Result }) {
  const pathwayKey = result.recommended_pathway;
  const stripeHref = STRIPE[pathwayKey];
  const isStubStripe = stripeHref === "#";
  const outcomes = PATHWAY_OUTCOMES[pathwayKey];

  return (
    <div className="space-y-12">
      {/* SECTION 1, Score */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Your result
        </p>
        <div className="mt-6 flex items-baseline justify-center gap-2">
          <span
            className="bg-clip-text text-[7rem] font-semibold leading-none tracking-tight text-transparent md:text-[10rem]"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            {result.readiness_score}
          </span>
          <span className="text-3xl font-light text-muted-foreground md:text-4xl">
            /100
          </span>
        </div>
        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Your Communication Readiness Score
        </p>
        <CeoBenchmark score={result.readiness_score} />
        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-border bg-foreground/[0.03] p-6 text-left">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            What {result.readiness_score} means
          </p>
          <p
            className="mt-1 text-lg font-semibold"
            style={{ color: "var(--primary)" }}
          >
            {getScoreBand(result.readiness_score).label}
          </p>
          <p className="mt-2 text-base leading-relaxed text-foreground/90">
            {getScoreBand(result.readiness_score).meaning}
          </p>
          <p className="mt-3 text-sm text-foreground/90">
            <span className="font-semibold">Next: </span>
            {getScoreBand(result.readiness_score).next}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Scale: {SCORE_SCALE}
          </p>
        </div>
      </section>

      {/* SECTION 2, Type */}
      <a
        href={`/program?score=${result.readiness_score}`}
        className="block rounded-2xl border border-border bg-foreground/[0.03] p-8 text-center backdrop-blur transition hover:border-foreground/30 hover:bg-foreground/[0.06]"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Your communication type
        </p>
        <h2
          className="mt-4 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          {formatType(result.communication_type)}
        </h2>
        {result.gaps && result.gaps.length > 0 && (
          <ul className="mx-auto mt-6 max-w-lg space-y-2 text-left">
            {result.gaps.slice(0, 2).map((gap) => (
              <li
                key={gap}
                className="flex gap-3 text-base leading-relaxed text-foreground/90"
              >
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full"
                  style={{ background: "var(--primary)" }}
                />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--primary)" }}>
          See coaching options →
        </p>
      </a>

      {/* SECTION 3, Behavioural report (gated) */}
      <BehaviouralReport
        sessionId={result.id}
        initiallyUnlocked={result.has_email}
        gaps={result.gaps}
        metrics={result.metrics ?? null}
      />

      {/* SECTION 3b, Day 1 win: one line, rebuilt */}
      <Day1Win sessionId={result.id} initial={result.metrics?.rewrite ?? null} />

      {/* SECTION 4, What changes */}
      <section>
        <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
          What changes after your {result.recommended_pathway_name}
        </h2>
        <ul className="mt-6 space-y-3">
          {outcomes.map((o) => (
            <li
              key={o}
              className="flex gap-3 rounded-xl border border-border bg-foreground/[0.03] p-5 text-sm leading-relaxed text-foreground/90 backdrop-blur"
            >
              <span
                aria-hidden
                className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full"
                style={{ background: "var(--primary)" }}
              />
              {o}
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 5, CTA , high-conversion */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-60 blur-2xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div
          className="relative overflow-hidden rounded-3xl border p-8 text-center md:p-10"
          style={{
            borderColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
            background:
              "radial-gradient(120% 100% at 50% 0%, color-mix(in oklab, var(--primary) 14%, transparent) 0%, transparent 70%), var(--background)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/80"
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "var(--primary)" }}
            />
            Cohort 1, 15 August 2026
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-4xl">
            Move this score in 30 days for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              $349
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            A structured 30 day curriculum with Bramwell your Voice AI Mentor: structure under pressure, specificity and evidence, confidence signals, then high stakes rehearsal. Every session impromptu and scored, weekly check ins, and a Day 30 retest that proves the change. One payment, USD.
          </p>

          <a
            href={`/program?resume=mastery&score=${result.readiness_score}`}
            className="group mt-7 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full px-8 text-base font-semibold transition hover:scale-[1.02] active:scale-[0.99] md:w-auto md:min-w-[360px]"
            style={{
              background: "var(--gradient-gold)",
              color: "var(--primary-foreground)",
              boxShadow:
                "0 20px 60px -15px color-mix(in oklab, var(--primary) 70%, transparent), 0 0 0 1px color-mix(in oklab, var(--primary) 50%, transparent) inset",
            }}
          >
            <span>Get started, $349</span>
            <span aria-hidden className="transition group-hover:translate-x-1">→</span>
          </a>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden style={{ color: "var(--primary)" }}>✓</span>
              Refund after session one
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden style={{ color: "var(--primary)" }}>✓</span>
              Begin today
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden style={{ color: "var(--primary)" }}>✓</span>
              One payment
            </span>
          </div>

          <div className="mt-6">
            <a
              href={`/program?score=${result.readiness_score}`}
              className="text-xs text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              See what the 30 days looks like
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function BehaviouralReport({
  sessionId,
  initiallyUnlocked,
  gaps,
  metrics,
}: {
  sessionId: string;
  initiallyUnlocked: boolean;
  gaps: string[];
  metrics: Metrics | null;
}) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);

  return (
    <section>
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Your detailed report
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          {unlocked ? "What's holding you back" : "See what's holding you back"}
        </h2>
        {!unlocked && (
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Your full behavioural report, every "um", every long pause, every
            hedge, your top three gaps, sent to your inbox and unlocked right
            here.
          </p>
        )}
      </div>

      <div className="relative mt-8">
        <div
          className={
            unlocked
              ? ""
              : "pointer-events-none select-none blur-md transition"
          }
          aria-hidden={!unlocked}
        >
          <ReportContent gaps={gaps} metrics={metrics} unlocked={unlocked} />
        </div>

        {!unlocked && (
          <div className="absolute inset-x-0 top-0 flex justify-center p-4">
            <UnlockCard
              sessionId={sessionId}
              onUnlocked={() => setUnlocked(true)}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function ReportContent({
  gaps,
  metrics,
  unlocked,
}: {
  gaps: string[];
  metrics: Metrics | null;
  unlocked: boolean;
}) {
  const hasMetrics =
    !!metrics &&
    (metrics.filler_words ||
      metrics.pace ||
      metrics.hedging ||
      metrics.structure);

  return (
    <div className="space-y-6">
      {metrics?.sub_scores && <SubScoreBars sub={metrics.sub_scores} />}

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          label="Filler words"
          primary={
            metrics?.filler_words?.total != null
              ? String(metrics.filler_words.total)
              : ", "
          }
          unit="used"
          detail={
            metrics?.filler_words?.top?.length
              ? metrics.filler_words.top
                  .slice(0, 3)
                  .map((t) => `"${t.word}" ×${t.count}`)
                  .join("  ·  ")
              : 'Every "um", "like", "you know" counted.'
          }
        />
        <MetricCard
          label="Pace & pauses"
          primary={
            metrics?.pace?.words_per_minute
              ? String(Math.round(metrics.pace.words_per_minute))
              : ", "
          }
          unit="words / min"
          detail={
            metrics?.pace?.words_per_minute
              ? `${metrics.pace.long_pauses_count ?? 0} long pauses · longest ${
                  metrics.pace.longest_pause_sec?.toFixed(1) ?? "0"
                }s`
              : "Your speaking pace and where you stalled."
          }
        />
        <MetricCard
          label="Hedging & apologising"
          primary={
            metrics?.hedging?.total != null
              ? String(metrics.hedging.total)
              : ", "
          }
          unit="hedge phrases"
          detail={
            metrics?.hedging?.samples?.length
              ? metrics.hedging.samples
                  .slice(0, 3)
                  .map((s) => `"${s}"`)
                  .join("  ·  ")
              : 'Language that shrinks your authority, "I think", "sorry", "just".'
          }
        />
        <MetricCard
          label="Answer structure"
          primary={
            metrics?.structure?.time_to_point_sec != null
              ? `${metrics.structure.time_to_point_sec.toFixed(1)}s`
              : ", "
          }
          unit="to your point"
          detail={
            metrics?.structure
              ? metrics.structure.led_with_point
                ? "You led with the point. Rambling under control."
                : "You buried the point. Rambling index high."
              : "Did you lead with the answer, or bury it?"
          }
        />
      </div>

      <div>
        <h3 className="text-center text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Your three biggest gaps
        </h3>
        <ul className="mt-4 grid gap-3">
          {gaps.slice(0, 3).map((gap, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-xl border border-border bg-foreground/[0.03] p-5 backdrop-blur"
            >
              <span
                className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: "var(--gradient-gold)",
                  color: "var(--primary-foreground)",
                }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">{gap}</p>
            </li>
          ))}
        </ul>
      </div>

      {!!metrics?.evidence?.length && <EvidenceList evidence={metrics.evidence} />}

      {unlocked && !hasMetrics && (
        <p className="text-center text-xs text-muted-foreground">
          Your full behavioural breakdown, filler words, pace, pauses, hedging
          and structure, is on its way to your inbox.
        </p>
      )}
    </div>
  );
}

const DIMENSION_LABELS: Record<string, string> = {
  structure: "Structure",
  specificity: "Specificity",
  confidence: "Confidence signals",
  relevance: "Relevance",
};

function SubScoreBars({
  sub,
}: {
  sub: { structure: number; specificity: number; confidence: number; relevance: number };
}) {
  const rows = [
    ["structure", sub.structure],
    ["specificity", sub.specificity],
    ["confidence", sub.confidence],
    ["relevance", sub.relevance],
  ] as const;

  return (
    <div className="rounded-2xl border border-border bg-foreground/[0.03] p-6 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Scored across four dimensions
      </p>
      <div className="mt-5 space-y-4">
        {rows.map(([key, value]) => (
          <div key={key}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground/90">
                {DIMENSION_LABELS[key]}
              </span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {value}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(2, Math.min(100, value))}%`,
                  background: "var(--gradient-gold)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Measured from your own words, not estimated. The same answer always
        returns the same numbers, so Day 1 can be compared to Day 30.
      </p>
    </div>
  );
}

function EvidenceList({
  evidence,
}: {
  evidence: { quote: string; dimension: string; note: string }[];
}) {
  return (
    <div>
      <h3 className="text-center text-base font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        In your own words
      </h3>
      <ul className="mt-4 grid gap-3">
        {evidence.slice(0, 4).map((item, i) => (
          <li
            key={i}
            className="rounded-xl border border-border bg-foreground/[0.03] p-5 backdrop-blur"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {DIMENSION_LABELS[item.dimension] ?? item.dimension}
            </p>
            <blockquote className="mt-2 border-l-2 border-foreground/20 pl-4 text-sm italic leading-relaxed text-foreground/90">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">{item.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetricCard({
  label,
  primary,
  unit,
  detail,
}: {
  label: string;
  primary: string;
  unit: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-foreground/[0.03] p-6 backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-3 flex items-baseline gap-2">
        <span
          className="bg-clip-text text-4xl font-semibold tracking-tight text-transparent"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          {primary}
        </span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{detail}</p>
    </div>
  );
}

function UnlockCard({
  sessionId,
  onUnlocked,
}: {
  sessionId: string;
  onUnlocked: () => void;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setState("submitting");
    try {
      const res = await fetch("/api/public/diagnostic-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          email: email.trim(),
          first_name: firstName.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body?.error ?? "Could not save your email");
      }
      setState("done");
      onUnlocked();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  return (
    <div
      className="w-full max-w-md rounded-2xl border border-border bg-background/95 p-6 shadow-2xl backdrop-blur"
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <h3 className="text-center text-lg font-semibold tracking-tight">
        Unlock your full report
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-center text-xs text-muted-foreground">
        We'll email a copy and reveal the breakdown on this page.
      </p>
      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-3"
      >
        <input
          type="text"
          inputMode="text"
          autoComplete="given-name"
          maxLength={80}
          placeholder="First name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="h-12 rounded-full border border-border bg-background/60 px-5 text-sm outline-none focus:border-foreground/40"
        />
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={255}
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-full border border-border bg-background/60 px-5 text-sm outline-none focus:border-foreground/40"
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-12 items-center justify-center rounded-full text-sm font-semibold transition hover:opacity-95 disabled:opacity-60"
          style={{
            background: "var(--gradient-gold)",
            color: "var(--primary-foreground)",
          }}
        >
          {state === "submitting" ? "Unlocking…" : "Send my report & unlock"}
        </button>
        {error && <p className="text-center text-xs text-destructive">{error}</p>}
      </form>
    </div>
  );
}
/**
 * Day 1 win. The user leaves with one of their own sentences rebuilt,
 * so the score is felt as a change, not just a number.
 */
function Day1Win({
  sessionId,
  initial,
}: {
  sessionId: string;
  initial: { original: string; rewritten: string; why: string } | null;
}) {
  const [rewrite, setRewrite] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "empty">(
    initial ? "idle" : "loading",
  );

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/diagnostic-rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const json = (await res.json()) as {
          rewrite?: { original: string; rewritten: string; why: string } | null;
        };
        if (cancelled) return;
        if (json.rewrite) {
          setRewrite(json.rewrite);
          setState("idle");
        } else {
          setState("empty");
        }
      } catch {
        if (!cancelled) setState("empty");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, initial]);

  if (state === "empty") return null;

  return (
    <section className="rounded-2xl border border-border bg-foreground/[0.03] p-8 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Your first win
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        One line of yours, rebuilt
      </h2>

      {state === "loading" || !rewrite ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Bramwell is rebuilding your strongest line...
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background/40 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                What you said
              </p>
              <p className="mt-3 text-base italic leading-relaxed text-foreground/70">
                "{rewrite.original}"
              </p>
            </div>
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: "var(--primary)", background: "color-mix(in oklab, var(--primary) 8%, transparent)" }}
            >
              <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "var(--primary)" }}>
                How it should land
              </p>
              <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
                "{rewrite.rewritten}"
              </p>
            </div>
          </div>
          {rewrite.why && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {rewrite.why}
            </p>
          )}
          <p className="mt-6 text-sm leading-relaxed text-foreground/90">
            That is one line after one pass. The 30 day program does this to
            every answer you will need, live, and scores the change.
          </p>
          <a
            href="/program"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-background"
            style={{ background: "var(--primary)" }}
          >
            See the 30 day program →
          </a>
        </>
      )}
    </section>
  );
}
