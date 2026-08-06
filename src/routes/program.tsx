import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { CtaButton } from "@/components/site/CtaButton";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";

const PRICE_ID = "voice_mastery_30day_once";
const COHORT_START = "15 August 2026";
const SHOW_TESTIMONIALS = false;

export const Route = createFileRoute("/program")({
  component: ProgramPage,
  validateSearch: (search: Record<string, unknown>) => ({
    resume: typeof search.resume === "string" ? search.resume : undefined,
    score:
      typeof search.score === "string" || typeof search.score === "number"
        ? Number(search.score)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "The 30 Day Voice Mastery Program, Bramwell AI" },
      {
        name: "description",
        content:
          "Ten minutes a day for 30 days. Move your Readiness Score from 42 to 65 and sound like the person who runs the room. $299 USD, one payment.",
      },
      { property: "og:title", content: "The 30 Day Voice Mastery Program, Bramwell AI" },
      {
        property: "og:description",
        content:
          "Ten minutes a day for 30 days with your AI voice coach. Measured before and after. $299 USD, one payment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const INCLUDES = [
  "A daily 10 minute live voice session with Bramwell, 30 days straight",
  "The step by step system: structure, pace, tone, and presence under pressure",
  "Your Readiness Score measured on Day 1 and Day 30, so the change is a number",
  "Real scenarios: interviews, board updates, pitches, negotiations, hard conversations",
  "Your personal playbook, rewritten every week as you improve",
  "Day 1 and Day 30 recordings, side by side, so the change is undeniable",
];

const WEEKS = [
  {
    week: "Week 1",
    title: "Break the cycle",
    body: "Strip the fillers, the hedging, and the apology in your opening line. You learn what the room actually hears in the first eight seconds.",
  },
  {
    week: "Week 2",
    title: "Build the structure",
    body: "One point. One reason. One proof. You stop rambling and start landing. Every answer gets a spine.",
  },
  {
    week: "Week 3",
    title: "Own the pressure",
    body: "Hard questions, interruptions, silence. You train the pause instead of fearing it. Calm becomes your default setting.",
  },
  {
    week: "Week 4",
    title: "Command the room",
    body: "Pace, tone, and authority under real stakes. Day 30 you retest, and you see the number move.",
  },
];

const FAQS = [
  {
    q: "How much time does this take?",
    a: "Ten minutes a day. That is the whole commitment. Miss a day and you pick it up the next one.",
  },
  {
    q: "What is the Readiness Score?",
    a: "A measure of how you come across under pressure: fillers, pace, structure, and presence. You get it on Day 1 and again on Day 30. Most people start near 42 and finish near 65.",
  },
  {
    q: "What does $299 include?",
    a: "One payment for 30 days of daily coaching, your playbook, and both assessments. No subscription. No payment plans.",
  },
  {
    q: "Do I need to be at a certain level?",
    a: "No. Managers, executives, founders, sales leaders, and professionals at any stage all run the same 30 days.",
  },
  {
    q: "What if it does not work?",
    a: "Run your first session. If Bramwell does not identify something specific and actionable about how you communicate, we refund you in full. No forms. No questions.",
  },
];

function ProgramPage() {
  const { resume, score } = Route.useSearch();
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();
  const [user, setUser] = useState<{ id: string; email?: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled || !data.user) return;
      setUser({ id: data.user.id, email: data.user.email });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startCheckout = () => {
    if (!user) {
      try {
        sessionStorage.setItem("bramwell_pending_purchase", "mastery");
      } catch {
        /* noop */
      }
      window.location.href = "/signup?resume=mastery";
      return;
    }
    openCheckout({
      priceId: PRICE_ID,
      customerEmail: user.email ?? undefined,
      userId: user.id,
      returnUrl: `${window.location.origin}/portal?checkout=success&pathway=mastery&session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  useEffect(() => {
    if (!user) return;
    const pending =
      resume ??
      (typeof window !== "undefined"
        ? sessionStorage.getItem("bramwell_pending_purchase")
        : null);
    if (pending === "mastery") {
      try {
        sessionStorage.removeItem("bramwell_pending_purchase");
      } catch {
        /* noop */
      }
      setTimeout(startCheckout, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, resume]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <SiteNav ctaLabel="Start the 30 days" ctaHref="#enrol" />

      <section
        className="relative overflow-hidden pb-20 pt-10 md:pb-28 md:pt-16"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
            Next cohort starts {COHORT_START}
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            The 30 Day Voice Mastery Program
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Be coached for ten minutes a day for 30 days and you will not be
            recognisable. People stop and listen. You command attention. You get
            paid more. This is the secret you wish you were taught before.
          </p>

          <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-6 rounded-2xl border border-border bg-background/70 px-6 py-5 backdrop-blur">
            <div className="text-center">
              <div className="text-3xl font-semibold tracking-tight text-muted-foreground">42</div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Day 1</p>
            </div>
            <span aria-hidden className="text-2xl text-muted-foreground">→</span>
            <div className="text-center">
              <div
                className="bg-clip-text text-4xl font-semibold tracking-tight text-transparent"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                65
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Day 30</p>
            </div>
            <p className="max-w-[9rem] text-left text-xs leading-relaxed text-muted-foreground">
              The average Readiness Score movement across the 30 days.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <CtaButton as="button" onClick={startCheckout} size="lg" showIcon={false}>
              Start the 30 days →
            </CtaButton>
            <p className="text-xs text-muted-foreground">
              $299 USD, one payment. 30 days of access. No subscription.
            </p>
            {typeof score === "number" && !Number.isNaN(score) ? (
              <p className="text-xs text-muted-foreground">
                Your diagnostic scored {score}. This is the program that moves it.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            The four weeks
          </p>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Thirty days. Four shifts. One voice nobody talks over.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {WEEKS.map((w) => (
              <article
                key={w.week}
                className="rounded-2xl border border-border bg-foreground/[0.02] p-7 transition hover:border-foreground/20"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{w.week}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="enrol" className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <article
            className="relative flex flex-col rounded-2xl border border-foreground/30 bg-foreground/[0.04] p-8"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <span
              className="absolute -top-3 right-5 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
            >
              Cohort {COHORT_START}
            </span>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              For managers and executives, founders and sales leaders
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              30 Day Voice Mastery Program
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For managers and executives, founders and sales leaders, professionals at any
              stage who want to transform how they sound. If you have ever felt overlooked in
              meetings, passed over for presentations, or like your voice has not caught up to
              your expertise, this program is for you. This is the step by step system to
              transform your voice in 30 days. See massive change in your finances,
              relationships, and more.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight">$299</span>
              <span className="text-sm text-muted-foreground">USD, one payment</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Ten minutes a day for 30 days
            </p>

            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {INCLUDES.map((i) => (
                <li key={i} className="flex gap-3 text-foreground/90">
                  <span
                    aria-hidden
                    className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  {i}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CtaButton as="button" onClick={startCheckout} size="md" showIcon={false} className="w-full">
                Start the 30 days →
              </CtaButton>
            </div>
          </article>

          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Not ready? Take the free test first. No card. No login. If it does not change how
            you sound in your first session, do not buy the program.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton href="/diagnostic?autostart=1" size="md" showIcon={false}>
              Start the test →
            </CtaButton>
          </div>
        </div>
      </section>

      {SHOW_TESTIMONIALS ? null : null}

      <section className="border-t border-border bg-foreground/[0.02] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            The Bramwell Guarantee
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Value on session one, or your money back.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Run your first session. If Bramwell does not identify something specific and
            actionable about how you communicate, something you had not seen yourself, we
            refund you in full. No forms. No questions.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Questions people ask before Day 1
          </h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {FAQS.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="text-base font-semibold tracking-tight">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            Leading a team?{" "}
            <Link to="/waitlist" className="font-medium text-foreground underline-offset-4 hover:underline">
              Get a free sales team assessment
            </Link>
            .
          </p>
        </div>
      </section>

      <SiteFooter />

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="relative mt-10 w-full max-w-xl rounded-2xl border border-border bg-background p-4">
            <button
              type="button"
              onClick={closeCheckout}
              className="absolute right-4 top-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
            <div className="pt-8">{checkoutElement}</div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
