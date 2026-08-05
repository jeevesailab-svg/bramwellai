import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { createPortalSession } from "@/lib/payments.functions";
import { getStripeEnvironment } from "@/lib/stripe";
import { CtaButton } from "@/components/site/CtaButton";

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
          "Simple monthly coaching for the moments that matter. Start with the Career Confidence Club, or pick a focused sprint.",
      },
      { property: "og:title", content: "Pricing, Bramwell AI" },
      {
        property: "og:description",
        content:
          "Simple monthly coaching for the moments that matter. Start with the Career Confidence Club, or pick a focused sprint.",
      },
    ],
  }),
});

// Stripe lookup_keys for the 5 Bramwell pathways
const PRICE_IDS = {
  executive: "executive_monthly",
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
    key: "club",
    name: "Pro",
    forWho: "Most popular",
    price: "$79",
    cadence: "per month · cancel anytime",
    sessions: "Unlimited live voice coaching",
    highlight: true,
    blurb:
      "Your step by step process to being successful in an interview: walk in rehearsed, sound structured under pressure, and answer the way the best leaders do. Practice every week before the interview, through your first 90 days, and every time you ask for more. $79 a month is less than one hour with a human coach. Most people stay.",
    includes: [
      "Unlimited live voice coaching sessions with Bramwell",
      "Your personal playbook, sharpened every week",
      "Archetype tracking and Readiness Score after every call",
      "New scenario library added monthly: interviews, negotiations, presentations",
      "Priority access to new session types as they launch",
    ],
  },
  {
    key: "executive",
    name: "Executive",
    forWho: "Senior leaders and high-stakes rooms",
    price: "$197",
    cadence: "per month · cancel anytime",
    sessions: "Everything in Pro, plus human review",
    blurb:
      "Everything in Pro, plus board-level scenario drills and a monthly human review of your progress.",
    includes: [
      "Everything in Pro",
      "Board-level scenario drills: CEO, panel and investor rooms",
      "Monthly human review of your sessions and progress",
      "Strategic narrative coaching, the three-line version of your vision",
      "Executive presence: pacing, silence and authority under pressure",
    ],
  },
];

function getHeroCopy(score?: number, recommended?: keyof typeof PRICE_IDS) {
  if (recommended === "club") {
    return {
      eyebrow: "Simple monthly coaching",
      headline: "Stay ready for every room that matters.",
      sub: "One subscription. Up to 3 voice sessions a week. Monthly progress checks. Every new scenario as it drops. Cancel anytime.",
      cta: "Join the Club →",
    };
  }
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
    eyebrow: "Simple monthly coaching",
    headline: "Stay ready for every room that matters.",
    sub: "One subscription. Up to 3 voice sessions a week. Monthly progress checks. Every new scenario as it drops. Cancel anytime.",
    cta: "Join the Club →",
  };
}

function PricingPage() {
  const { recommended, resume, score } = Route.useSearch();
  const recommendedKey = (["executive", "club"] as const).find(
    (k) => k === recommended || (k === "club" && recommended !== "executive" && !!recommended),
  );

  const hero = getHeroCopy(score, recommendedKey);

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
          <div className="mt-8 flex justify-center">
            {recommendedKey ? (
              <CtaButton
                size="md"
                showIcon={false}
                onClick={() => {
                  if (user) {
                    handlePurchase(recommendedKey);
                  } else {
                    sessionStorage.setItem("bramwell_pending_purchase", recommendedKey);
                    window.location.href = `/signup?resume=${recommendedKey}`;
                  }
                }}
              >
                {hero.cta}
              </CtaButton>
            ) : (
              <CtaButton href="#plans" size="md" showIcon={false}>
                {hero.cta}
              </CtaButton>
            )}
          </div>
        </div>
      </section>

      <section id="plans" className="bg-background py-20 md:py-28">
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
        <div className="mx-auto grid max-w-4xl gap-5 px-6 md:grid-cols-2 md:px-10 lg:grid-cols-2">
          {pathways.map((p) => (
            <PathwayCard key={p.key} p={p} onSelect={() => handlePurchase(p.key)} />
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl px-6 text-center text-sm leading-relaxed text-muted-foreground">
          Try Bramwell free first. No card. No login. If it doesn&apos;t change how you sound in your first session, don&apos;t upgrade.
        </p>
        <div className="mt-8 flex justify-center px-6">
          <CtaButton href="/diagnostic?autostart=1" size="md" showIcon={false}>
            Take the free diagnostic →
          </CtaButton>
        </div>
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
      } `}
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

      <div className="mt-8">
        <CtaButton as="button" onClick={onSelect} size="md" className="w-full">
          Go {p.name} →
        </CtaButton>
      </div>
    </article>
  );
}