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
          "Your communication type, three biggest gaps, and Readiness Score — and the Bramwell pathway built for you.",
      },
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
};

const STRIPE: Record<PathwayKey, string> = {
  graduate: import.meta.env.VITE_STRIPE_GRADUATE ?? "#",
  comeback: import.meta.env.VITE_STRIPE_COMEBACK ?? "#",
  confidence: import.meta.env.VITE_STRIPE_CONFIDENCE ?? "#",
  executive: import.meta.env.VITE_STRIPE_EXECUTIVE ?? "#",
  club: import.meta.env.VITE_STRIPE_CLUB ?? "#",
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  rambler:
    "You have strong ideas — they just come out in the wrong order under pressure.",
  "under-seller":
    "You have done impressive things. You just do not say so.",
  "over-explainer":
    "You give the room everything when it only needed one thing.",
  apologiser:
    "You shrink when you should stand. Your voice asks for permission instead of commanding attention.",
  "invisible achiever":
    "You deliver at the highest level. Nobody outside your immediate team knows it.",
  "next-level leader":
    "You communicate well. You just need sharper edges.",
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
    "Every conversation — interview, negotiation, presentation — feels like home ground.",
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
  const key = type.toLowerCase().replace(/^the\s+/, "").trim();
  return (
    TYPE_DESCRIPTIONS[key] ??
    "Your communication has a clear pattern — and a clear way to sharpen it."
  );
}

function formatType(type: string): string {
  const cleaned = type
    .replace(/^the\s+/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const titled = cleaned
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
  return `The ${titled}`;
}

function DiagnosticResultPage() {
  const { id, incomplete } = Route.useSearch();
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "error"; message: string }
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
        const json = (await res.json()) as { result: Result };
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
          <Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
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
              {incomplete === "1" ? (
                <>
                  <p className="mx-auto max-w-md text-base text-foreground/90">
                    Your call ended before Bramwell could finalise your
                    Readiness Score.
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                    This usually means the conversation was too short.
                    Give it another five minutes — answer one question the way
                    you normally would, and Bramwell will score you on the spot.
                  </p>
                  <Link
                    to="/diagnostic"
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
                    to="/diagnostic"
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
  const pathwayKey = result.recommended_pathway;
  const stripeHref = STRIPE[pathwayKey];
  const isStubStripe = stripeHref === "#";
  const outcomes = PATHWAY_OUTCOMES[pathwayKey];

  return (
    <div className="space-y-12">
      {/* SECTION 1 — Score */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Your result
        </p>
        <p
          className="mt-6 bg-clip-text text-[7rem] font-semibold leading-none tracking-tight text-transparent md:text-[10rem]"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          {result.readiness_score}
        </p>
        <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          Your Readiness Score
        </p>
        <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
          This is your starting point — not your ceiling.
        </p>
      </section>

      {/* SECTION 2 — Type */}
      <section className="rounded-2xl border border-border bg-foreground/[0.03] p-8 text-center backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Your communication type
        </p>
        <h2
          className="mt-4 bg-clip-text text-3xl font-semibold tracking-tight text-transparent md:text-4xl"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          You are {formatType(result.communication_type)}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-foreground/90">
          {describeType(result.communication_type)}
        </p>
      </section>

      {/* SECTION 3 — Gaps */}
      <section>
        <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
          What is holding you back
        </h2>
        <ul className="mt-6 grid gap-4">
          {result.gaps.slice(0, 3).map((gap, i) => (
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
      </section>

      {/* SECTION 4 — What changes */}
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

      {/* SECTION 5 — CTA */}
      <section className="text-center">
        <a
          href={stripeHref}
          aria-disabled={isStubStripe}
          target={isStubStripe ? undefined : "_blank"}
          rel={isStubStripe ? undefined : "noopener noreferrer"}
          className={`inline-flex h-14 w-full items-center justify-center rounded-full px-8 text-base font-semibold transition md:w-auto ${
            isStubStripe
              ? "cursor-not-allowed border border-border bg-foreground/5 text-muted-foreground"
              : "text-white hover:opacity-95"
          }`}
          style={
            isStubStripe
              ? undefined
              : {
                  background:
                    "linear-gradient(135deg, hsl(142 76% 36%), hsl(160 84% 39%))",
                  boxShadow: "var(--shadow-elegant)",
                }
          }
        >
          {isStubStripe
            ? `${result.recommended_pathway_name} — coming soon`
            : `Start my ${result.recommended_pathway_name} — ${result.recommended_price}`}
        </a>
        <div className="mt-4">
          <Link
            to="/pricing"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Learn more about Bramwell →
          </Link>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          30 day money back guarantee if your score does not improve
        </p>
      </section>

      {/* SECTION 6 — Email capture */}
      {!result.has_email && <EmailCapture sessionId={result.id} />}
    </div>
  );
}

function EmailCapture({ sessionId }: { sessionId: string }) {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <section className="rounded-2xl border border-border bg-foreground/[0.03] p-8 text-center backdrop-blur">
        <p className="text-base font-medium">Sent. Check your inbox.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll also send you practice tips for tonight.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-foreground/[0.03] p-8 backdrop-blur">
      <h3 className="text-center text-xl font-semibold tracking-tight">
        Want us to send you your results?
      </h3>
      <form
        onSubmit={onSubmit}
        className="mx-auto mt-5 flex max-w-md flex-col gap-3"
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
          {state === "submitting" ? "Sending…" : "Send my results"}
        </button>
        {error && <p className="text-center text-xs text-destructive">{error}</p>}
        <p className="text-center text-xs text-muted-foreground">
          We will also send you practice tips for tonight.
        </p>
      </form>
    </section>
  );
}