import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { createPortalSession } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    recommended:
      typeof search.recommended === "string" ? search.recommended : undefined,
    resume:
      typeof search.resume === "string" ? search.resume : undefined,
    score:
      typeof search.score === "string" || typeof search.score === "number"
        ? Number(search.score)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pricing, Bramwell AI" },
      {
        name: "description",
        content:
          "Five coaching pathways for every career moment. Pick the one that meets you where you are.",
      },
      { property: "og:title", content: "Pricing, Bramwell AI" },
      {
        property: "og:description",
        content: "Five coaching pathways for every career moment.",
      },
    ],
  }),
});

// Stripe lookup_keys for the 5 Bramwell pathways
const PRICE_IDS = {
  graduate: "graduate_sprint_onetime",
  comeback: "comeback_sprint_onetime",
  confidence: "confidence_sprint_onetime",
  executive: "executive_sprint_onetime",
  club: "career_confidence_club_monthly",
} as const;

type Pathway = {
  key: keyof typeof PRICE_IDS;
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
    key: "graduate",
    name: "Graduate Interview Prep",
    forWho: "Graduates entering the workforce",
    price: "A$99",
    cadence: "one-time",
    sessions: "3 sessions · 20 mins · use within 14 days",
    blurb:
      "You've worked for this. Transform your words to be the person that gets chosen. Your CV got you the interview, now the job goes to whoever commands the room.",
    includes: [
      "Free AI voice check, your exact gaps identified before session one",
      "3 × 20-min voice coaching sessions built to your role and industry",
      "Structured frameworks for behavioural and competency questions",
      "Real-time interruption when your delivery drifts, no empty praise",
      "Full performance report delivered to your inbox",
    ],
  },
  {
    key: "comeback",
    name: "Career Comeback Sprint",
    forWho: "Returning after a break or redundancy",
    price: "A$199",
    cadence: "one-time",
    sessions: "3 sessions · 30 mins · use within 21 days",
    blurb:
      "The experience is still there. It just needs to sound like it. Your story, rebuilt for the room you're walking into, no judgement, no generic prep.",
    includes: [
      "Diagnostic that maps your gap and rebuilds your confidence baseline",
      "3 × 30-min sessions tuned to modern language and your specific story",
      "Career break narrative coaching, turn the gap into a strength",
      "Pressure simulation: harder follow-ups when you're getting comfortable",
      "Full performance report and recommended next session focus",
    ],
  },
  {
    key: "confidence",
    name: "Interview Confidence Sprint",
    forWho: "Mid-career with a real interview coming",
    price: "A$249",
    cadence: "one-time",
    sessions: "4 sessions · 30 mins · use within 14 days",
    highlight: true,
    blurb:
      "You're the most qualified person in the room. It's time to sound like it. Four sessions designed to close the gap between who you are and how they hear you.",
    includes: [
      "Full voice check, readiness score, communication type, three specific gaps",
      "4 × 30-min sessions: diagnose → drill → pressure → perform",
      "Commercial language coaching, translate impact into numbers that land",
      "Curveball and pushback simulation, trained for what actually happens",
      "Before-and-after performance report to track your improvement",
      "Salary and offer negotiation language coaching",
    ],
  },
  {
    key: "executive",
    name: "Executive Communication Sprint",
    forWho: "Senior leaders in high-stakes conversations",
    price: "A$499",
    cadence: "one-time",
    sessions: "3 sessions · 30 mins · precision over volume",
    blurb:
      "The room already respects your title. Make them respect your thinking. Peer-level coaching: direct, precise, zero filler. Three high-signal sessions.",
    includes: [
      "Executive voice check, precision readiness mapping for senior conversations",
      "3 × 30-min peer-level coaching, high-signal feedback only",
      "Board, CEO, and panel interview simulation",
      "Strategic narrative coaching, the three-line version of your vision",
      "Stakeholder influence and buying committee language",
      "Executive presence: pacing, silence, authority under pressure",
    ],
  },
  {
    key: "club",
    name: "Career Confidence Club",
    forWho: "When high-stakes conversations never stop",
    price: "A$79",
    cadence: "per month · cancel anytime",
    sessions: "Up to 3 sessions per week · 30 mins each",
    blurb:
      "Promotions. Pay reviews. Difficult stakeholders. Board presentations. Stay sharp between the moments that matter, so when your moment arrives, you're already ready.",
    includes: [
      "Unlimited voice coaching, up to 3 sessions per week",
      "Monthly voice check to track your improvement over time",
      "New scenario library added monthly: negotiations, presentations, stakeholders",
      "Priority access to new features and session types as they launch",
      "Community access, share wins, prep together, stay accountable",
      "20% off any sprint upgrade, any time",
    ],
  },
];

function getHeroCopy(score?: number) {
  if (typeof score === "number" && score <= 50) {
    return {
      eyebrow: "Your next move",
      headline: "Train your speaking skills. Sound like the person you already are.",
      sub: "Short, focused training to organise your thoughts in real time and speak with authority, no more ideas vanishing mid sentence, no more rooms you should have won slipping away.",
      cta: "Start training →",
    };
  }
  if (typeof score === "number" && score <= 75) {
    return {
      eyebrow: "Your next level",
      headline: "Persuasion is not getting your way. It is a skill you can learn.",
      sub: "Influence and persuasion are how the most persuasive person in the room gets the promotion, wins the pitch, and closes the offer. Bramwell trains both, in your own voice.",
      cta: "Build my edge →",
    };
  }
  return {
    eyebrow: "Strategic communication",
    headline: "Build trust. Drive decisions. Lead with influence.",
    sub: "Learn to persuade, influence and lead conversations so your ideas get heard, your recommendations get backed, and you get the yes you deserve.",
    cta: "Sharpen my edge →",
  };
}

function PricingPage() {
  const { recommended, resume, score } = Route.useSearch();
  const recommendedKey = (
    ["graduate", "comeback", "confidence", "executive", "club"] as const
  ).find((k) => k === recommended);

  const hero = getHeroCopy(score);

  const pathways = recommendedKey
    ? PATHWAYS.map((p) => ({ ...p, highlight: p.key === recommendedKey }))
    : PATHWAYS;

  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);
  const [activePlan, setActivePlan] = useState<{
    pathway: string | null;
    expiresAt: string | null;
  } | null>(null);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;
      setUser({ id: data.user.id, email: data.user.email });
      const { data: row } = await supabase
        .from("users")
        .select("payment_status, pathway, access_expires_at, sessions_purchased, sessions_completed")
        .eq("id", data.user.id)
        .maybeSingle();
      if (cancelled) return;
      const isPaid = row?.payment_status === "paid";
      const notExpired = !row?.access_expires_at || new Date(row.access_expires_at) > new Date();
      const hasSessionsLeft = (row?.sessions_purchased ?? 0) > (row?.sessions_completed ?? 0);
      if (isPaid && notExpired && hasSessionsLeft) {
        setActivePlan({
          pathway: row?.pathway ?? null,
          expiresAt: row?.access_expires_at ?? null,
        });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handlePurchase = (key: keyof typeof PRICE_IDS) => {
    if (!user) {
      // Send the user to sign up and remember which pathway they picked
      sessionStorage.setItem("bramwell_pending_purchase", key);
      window.location.href = "/signup?next=/pricing";
      return;
    }
    if (activePlan) {
      const expires = activePlan.expiresAt
        ? new Date(activePlan.expiresAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : null;
      setBlockMessage(
        `You already have an active ${activePlan.pathway ?? "Bramwell"} plan${
          expires ? ` through ${expires}` : ""
        }. Finish your current pathway first, or manage your billing to switch.`,
      );
      return;
    }
    openCheckout({
      priceId: PRICE_IDS[key],
      customerEmail: user.email ?? undefined,
      userId: user.id,
      returnUrl: `${window.location.origin}/portal?checkout=success&pathway=${key}&session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  // Auto-resume checkout after signup/login
  useEffect(() => {
    if (!user) return;
    const pendingFromUrl = resume;
    const pendingFromStorage =
      typeof window !== "undefined"
        ? sessionStorage.getItem("bramwell_pending_purchase")
        : null;
    const pending = (pendingFromUrl || pendingFromStorage) as
      | keyof typeof PRICE_IDS
      | null;
    if (pending && PRICE_IDS[pending]) {
      sessionStorage.removeItem("bramwell_pending_purchase");
      // Defer so activePlan check (in handlePurchase) sees latest state
      setTimeout(() => handlePurchase(pending), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activePlan, resume]);

  const openBillingPortal = async () => {
    setPortalLoading(true);
    try {
      const result = await createPortalSession({
        data: {
          returnUrl: `${window.location.origin}/portal`,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in result) throw new Error(result.error);
      window.open(result.url, "_blank");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
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
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{hero.eyebrow}</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {hero.sub}
          </p>
          <Link
            to="/diagnostic"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium backdrop-blur transition hover:bg-foreground/10"
          >
            {hero.cta}
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
              Your Bramwell voice check match
            </span>
            <p className="mt-4 text-sm text-muted-foreground">
              Based on your free session, we've highlighted your recommended
              pathway. You can still pick a different one if it feels closer.
            </p>
          </div>
        )}
        <div className="mx-auto grid max-w-6xl gap-5 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-3">
          {pathways.map((p) => (
            <PathwayCard key={p.key} p={p} onSelect={() => handlePurchase(p.key)} />
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl px-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Private by design · Cancel anytime · Built for the moments that matter
        </p>
      </section>

      <section className="border-t border-border bg-foreground/[0.02] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>The Bramwell Guarantee</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Value on session one, or your money back.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Run your first session. If Bramwell doesn't identify something specific and actionable about how you communicate, something you hadn't seen yourself, we'll refund you in full. No forms. No questions.
          </p>
        </div>
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-background p-6 shadow-2xl">
            <button
              onClick={closeCheckout}
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-foreground/5 text-sm hover:bg-foreground/10"
              aria-label="Close checkout"
            >
              ✕
            </button>
            {checkoutElement}
          </div>
        </div>
      )}
      {blockMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <h3 className="text-lg font-semibold tracking-tight">You're already in.</h3>
            <p className="mt-3 text-sm text-muted-foreground">{blockMessage}</p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={openBillingPortal}
                disabled={portalLoading}
                className="inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition hover:opacity-95 disabled:opacity-60"
                style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
              >
                {portalLoading ? "Opening…" : "Manage billing"}
              </button>
              <Link
                to="/portal"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 text-sm font-medium hover:bg-foreground/10"
              >
                Back to portal
              </Link>
              <button
                type="button"
                onClick={() => setBlockMessage(null)}
                className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PathwayCard({ p, onSelect }: { p: Pathway; onSelect: () => void }) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border bg-foreground/[0.02] p-8 transition ${
        p.highlight ? "border-foreground/30 bg-foreground/[0.04]" : "border-border hover:border-foreground/20 hover:bg-foreground/[0.04]"
      } ${p.key === "club" ? "md:col-span-2 lg:col-span-1" : ""}`}
      style={p.highlight ? { boxShadow: "var(--shadow-elegant)" } : undefined}
    >
      {p.highlight && (
        <span
          className="absolute -top-3 right-5 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
        >
          Most popular
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

      <button
        type="button"
        onClick={onSelect}
        className={`mt-8 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition ${
          p.highlight
              ? "hover:opacity-95"
              : "border border-foreground/30 bg-foreground/5 hover:bg-foreground/10"
        }`}
        style={
          p.highlight
            ? { background: "var(--gradient-gold)", color: "var(--primary-foreground)" }
            : undefined
        }
      >
        Choose {p.name}
      </button>
    </article>
  );
}