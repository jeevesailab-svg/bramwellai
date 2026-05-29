import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    recommended:
      typeof search.recommended === "string" ? search.recommended : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pricing — Bramwell AI" },
      {
        name: "description",
        content:
          "Five coaching pathways for every career moment. Pick the one that meets you where you are.",
      },
      { property: "og:title", content: "Pricing — Bramwell AI" },
      {
        property: "og:description",
        content: "Five coaching pathways for every career moment.",
      },
    ],
  }),
});

// TODO (Section 10): replace stubs with real Stripe payment links via env vars.
const STRIPE = {
  graduate: import.meta.env.VITE_STRIPE_GRADUATE ?? "#",
  comeback: import.meta.env.VITE_STRIPE_COMEBACK ?? "#",
  confidence: import.meta.env.VITE_STRIPE_CONFIDENCE ?? "#",
  executive: import.meta.env.VITE_STRIPE_EXECUTIVE ?? "#",
  club: import.meta.env.VITE_STRIPE_CLUB ?? "#",
};

type Pathway = {
  key: keyof typeof STRIPE;
  name: string;
  forWho: string;
  price: string;
  cadence: string;
  sessions: string;
  highlight?: boolean;
  blurb: string;
  includes: string[];
};

const PATHWAYS: Pathway[] = [
  {
    key: "club",
    name: "The Club",
    forWho: "Always-on access",
    price: "$79 AUD",
    cadence: "per month",
    sessions: "Unlimited sessions",
    highlight: true,
    blurb:
      "Every interview. Every pitch. Every year. Bramwell stays with you — the moment you need it, whatever the stakes.",
    includes: [
      "Unlimited live voice sessions",
      "Full story-bank & history",
      "Priority feature access",
      "Cancel anytime",
    ],
  },
  {
    key: "graduate",
    name: "The Graduate",
    forWho: "First serious interview",
    price: "$99 AUD",
    cadence: "one-time",
    sessions: "3 sessions · 20 min",
    blurb: "Land the role that sets the next ten years in motion.",
    includes: [
      "CV + JD context analysis",
      "Live AI voice rehearsal",
      "Readiness score after each session",
      "Homework between sessions",
    ],
  },
  {
    key: "comeback",
    name: "The Comeback",
    forWho: "Returning to work",
    price: "$199 AUD",
    cadence: "one-time",
    sessions: "5 sessions · 25 min",
    blurb: "Rebuild fluency, authority, and presence on your own terms.",
    includes: [
      "Everything in The Graduate",
      "Story-bank library of your answers",
      "Targeted confidence drills",
      "30-day access window",
    ],
  },
  {
    key: "confidence",
    name: "The Confidence",
    forWho: "Mid-career pivot",
    price: "$249 AUD",
    cadence: "one-time",
    sessions: "6 sessions · 30 min",
    highlight: true,
    blurb: "Translate what you've done into the language of the next role.",
    includes: [
      "Everything in The Comeback",
      "Narrative architecture for pivots",
      "Salary & negotiation rehearsal",
      "60-day access window",
    ],
  },
  {
    key: "executive",
    name: "Executive Presence",
    forWho: "C-suite · Board rooms · High-stakes pitches",
    price: "$499 AUD",
    cadence: "one-time",
    sessions: "8 sessions · 30 min",
    blurb:
      "For leaders where every word carries commercial weight. Bramwell calibrates your authority, cadence, and conviction — until the room reads you as the most senior person in it.",
    includes: [
      "Everything in The Confidence",
      "Board-level question banks",
      "Stakeholder & investor rehearsal",
      "90-day access window",
    ],
  },
];

function PricingPage() {
  const { recommended } = Route.useSearch();
  const recommendedKey = (
    ["graduate", "comeback", "confidence", "executive", "club"] as const
  ).find((k) => k === recommended);

  const pathways = recommendedKey
    ? PATHWAYS.map((p) => ({ ...p, highlight: p.key === recommendedKey }))
    : PATHWAYS;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight">Bramwell</span>
          <span className="text-xl font-light tracking-tight" style={{ color: "var(--primary)" }}>AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          <Link to="/login" className="transition-colors hover:text-foreground">Sign in</Link>
        </nav>
        <Link
          to="/signup"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-foreground/5 px-5 text-sm font-medium backdrop-blur transition hover:bg-foreground/10"
        >
          Get started
        </Link>
      </header>

      <section className="relative overflow-hidden pb-20 pt-12 md:pb-28 md:pt-20" style={{ background: "var(--gradient-hero)" }}>
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-25 blur-3xl" style={{ background: "var(--gradient-gold)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Pricing</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            One pathway. The whole career change.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Five Bramwell pathways. Each one tuned to the moment you're standing in.
            Take the free diagnostic first — we'll recommend the right fit.
          </p>
          <Link
            to="/diagnostic"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium backdrop-blur transition hover:bg-foreground/10"
          >
            Take the free diagnostic →
          </Link>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        {recommendedKey && (
          <div className="mx-auto mb-10 max-w-3xl px-6 text-center md:px-10">
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{
                background: "var(--gradient-gold)",
                color: "var(--primary-foreground)",
              }}
            >
              Your Bramwell diagnostic match
            </span>
            <p className="mt-4 text-sm text-muted-foreground">
              Based on your diagnostic, we've highlighted your recommended
              pathway. You can still pick a different one if it feels closer.
            </p>
          </div>
        )}
        <div className="mx-auto grid max-w-6xl gap-5 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3">
          {pathways.map((p) => (
            <PathwayCard key={p.key} p={p} href={STRIPE[p.key]} />
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl px-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Private by design · Cancel anytime · Built for the moments that matter
        </p>
      </section>

      <footer className="border-t border-border bg-background py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-10">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tracking-tight">Bramwell</span>
            <span className="text-base font-light tracking-tight" style={{ color: "var(--primary)" }}>AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bramwell AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

function PathwayCard({ p, href }: { p: Pathway; href: string }) {
  const isStub = href === "#";
  return (
    <article
      className={`group flex flex-col rounded-2xl border bg-foreground/[0.02] p-8 transition ${
        p.highlight ? "border-foreground/30 bg-foreground/[0.04]" : "border-border hover:border-foreground/20 hover:bg-foreground/[0.04]"
      } ${p.key === "club" ? "md:col-span-2 lg:col-span-1" : ""}`}
      style={p.highlight ? { boxShadow: "var(--shadow-elegant)" } : undefined}
    >
      {p.highlight && (
        <span
          className="mb-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
        >
          Most chosen
        </span>
      )}
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{p.forWho}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight">{p.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
        <span className="text-sm text-muted-foreground">{p.cadence}</span>
      </div>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{p.sessions}</p>

      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {p.includes.map((i) => (
          <li key={i} className="flex gap-3 text-foreground/90">
            <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full" style={{ background: "var(--primary)" }} />
            {i}
          </li>
        ))}
      </ul>

      <a
        href={href}
        target={isStub ? undefined : "_blank"}
        rel={isStub ? undefined : "noopener noreferrer"}
        aria-disabled={isStub}
        className={`mt-8 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition ${
          isStub
            ? "cursor-not-allowed border border-border bg-foreground/5 text-muted-foreground"
            : p.highlight
              ? "hover:opacity-95"
              : "border border-foreground/30 bg-foreground/5 hover:bg-foreground/10"
        }`}
        style={
          !isStub && p.highlight
            ? { background: "var(--gradient-gold)", color: "var(--primary-foreground)" }
            : undefined
        }
      >
        {isStub ? "Coming soon" : `Choose ${p.name}`}
      </a>
    </article>
  );
}