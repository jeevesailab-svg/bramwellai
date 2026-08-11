import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { CtaButton } from "@/components/site/CtaButton";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";

const PRICE_ID = "voice_mastery_30day_once";
const SHOW_TESTIMONIALS = true;


type ProgramSearch = { resume?: string; score?: number };

export const Route = createFileRoute("/program")({
  component: ProgramPage,
  validateSearch: (search: Record<string, unknown>): ProgramSearch => ({
    ...(typeof search.resume === "string" ? { resume: search.resume } : {}),
    ...(typeof search.score === "string" || typeof search.score === "number"
      ? { score: Number(search.score) }
      : {}),
  }),
  head: () => ({
      meta: [
        { title: "Speak like a CEO | 30 Day Voice Mastery Program | Bramwell AI" },
        {
          name: "description",
          content:
            "Bramwell your Voice AI Mentor. Speak like a CEO in 30 days. Daily practice, every session scored, your progress proven. $349 USD.",
        },
        { property: "og:title", content: "Speak like a CEO | 30 Day Voice Mastery Program | Bramwell AI" },
        {
          property: "og:description",
          content:
            "Your Voice AI Mentor trains you daily, scores every session, and proves your progress. 30 days. $349 USD.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],

  }),
});

/**
 * The calendar is the 5 phases. The 7 steps are the content taught inside
 * them, cross referenced by number so the two never read as separate systems.
 */
const PHASES = [
  {
    n: "Phase 1",
    days: "Days 1 to 5",
    title: "Set the Baseline",
    body: "You record your Day 1 diagnostic and get a Readiness Score across Structure, Specificity, Confidence Signals and Relevance. You learn to open with the answer instead of the run up.",
    steps: ["Step 1", "Step 2"],
  },
  {
    n: "Phase 2",
    days: "Days 6 to 12",
    title: "Structure Your Thinking",
    body: "Cold prompts, no prep. You drill one repeatable frame until a clear point, three supports and a close come out under pressure every time.",
    steps: ["Step 2", "Step 3"],
  },
  {
    n: "Phase 3",
    days: "Days 13 to 19",
    title: "Command the Room",
    body: "Steady pace, deliberate pauses and a calm response to interruption. Filler count and words per minute are tracked every session so you can hear and see the change.",
    steps: ["Step 4", "Step 5"],
  },
  {
    n: "Phase 4",
    days: "Days 20 to 26",
    title: "Move to Decision",
    body: "You practise changing what the listener thinks or does: a direct recommendation, the evidence behind it, and a clear ask that ends the conversation with a decision.",
    steps: ["Step 6", "Step 7"],
  },
  {
    n: "Phase 5",
    days: "Days 27 to 30",
    title: "Perform Under Pressure",
    body: "Live style simulations of the interview, the board update and the hostile question. Day 30 you retake the diagnostic and compare it with Day 1.",
    steps: ["All 7 steps"],
  },
];

const STEPS = [
  { n: "Step 1", title: "Lead with the answer", phase: "Phase 1", body: "The point first, the context after. Kill the preamble." },
  { n: "Step 2", title: "Structure in three", phase: "Phases 1 and 2", body: "One repeatable frame that holds under pressure." },
  { n: "Step 3", title: "Evidence that lands", phase: "Phase 2", body: "Numbers, names and outcomes instead of vague claims." },
  { n: "Step 4", title: "Pace and pause", phase: "Phase 3", body: "Slow the delivery, replace filler with silence." },
  { n: "Step 5", title: "Hold the interruption", phase: "Phase 3", body: "Stay calm, finish the thought, keep the room." },
  { n: "Step 6", title: "Make the recommendation", phase: "Phase 4", body: "Say what you would do and why, without hedging." },
  { n: "Step 7", title: "Close with the ask", phase: "Phases 4 and 5", body: "End on a decision, not a trailing sentence." },
];

const TESTIMONIALS = [
  { quote: "You are accomplishing in 30 days what it would probably take you years to learn.", name: "Sarah, Marketing Manager" },
  { quote: "I spoke up in a meeting today. Someone said good point. That has never happened before.", name: "David, Product Lead" },
  { quote: "My score went from 42 to 65. I can see the number. I can prove it.", name: "Lisa, Operations Director" },
  { quote: "I used to rehearse what I would say in the elevator. Then I would take the stairs. Not anymore.", name: "Marcus, Sales Leader" },
];

const FAQS = [
  {
    q: "What is the 30 Day Voice Mastery Program?",
    a: "A 30 day structured voice training program with Bramwell your Voice AI Mentor. You speak with your Mentor daily and get scored across four dimensions. You diagnose on Day 1, practise for 30 days across five phases, and prove the change on Day 30.",
  },
  {
    q: "Who is the program for?",
    a: "Managers and executives, founders and sales leaders, professionals at any stage who want to transform how they sound. If you have ever felt overlooked in meetings, passed over for presentations, or like your voice has not caught up to your expertise, this is for you.",
  },
  {
    q: "What can I expect to learn?",
    a: "Five phases across 30 days: Set the Baseline, Structure Your Thinking, Command the Room, Move to Decision and Perform Under Pressure. The seven steps of the method are taught inside those phases. Every session is scored across Structure, Specificity, Confidence Signals and Relevance, with a Day 1 and Day 30 Readiness Score.",
  },
  {
    q: "I have never done voice training before, is this for me?",
    a: "Yes. Most participants have never measured their voice. The diagnostic gives you a baseline score on Day 1 and the program builds from there. No experience required.",
  },
  {
    q: "I manage a sales team, how can this help me?",
    a: "The Elite Sales Team Voice AI Coach 30 Day Program is our done-for-you implementation. We document your sales methodology and build a private AI coaching platform that trains every salesperson to the same standard, with a manager dashboard and performance reporting.",
  },
  {
    q: "What makes this different from other voice coaching?",
    a: "Three things: your Voice AI Mentor, the score, and the timeline. Your Mentor practises with you daily, listening, scoring and giving real time feedback. Your voice has a number. In 30 days you retake the test and watch the number change.",
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
      returnUrl: `${window.location.origin}/portal/welcome?checkout=success&pathway=mastery&session_id={CHECKOUT_SESSION_ID}`,
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
    <main className="min-h-screen bg-background text-foreground pb-24 md:pb-0">
      <PaymentTestModeBanner />
      <SiteNav ctaLabel="Get started" ctaHref="/program#enrol" />

      {/* Hero */}
      <section
        className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur">
            30 days · 30 scored sessions · One payment
          </span>

          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            Speak like a CEO.
            <br />
            In 30 days.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A structured 30 day program with Bramwell, your Voice AI Mentor. Five phases, one
            scored session a day. On Day 30 the number proves it.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3">
            <CtaButton as="button" onClick={startCheckout} size="lg" showIcon={false}>
            Get started, $349
            </CtaButton>
            <p className="text-xs text-muted-foreground">
              One payment, $349 USD.{" "}
              <a href="/diagnostic" className="font-medium text-foreground underline underline-offset-4">
                Or take the free 5 minute test first
              </a>
            </p>
            {typeof score === "number" && !Number.isNaN(score) ? (
              <p className="text-xs text-muted-foreground">
                Your diagnostic scored {score}. This is the program that moves it.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Proof band */}
      <section className="bg-foreground py-16 text-background md:py-20">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
            <div className="text-center md:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Day 1</p>
              <p className="mt-2 text-7xl font-semibold tracking-tight opacity-50 md:text-8xl">42</p>
              <p className="mt-1 text-sm opacity-60">Overlooked in the room</p>
            </div>
            <div aria-hidden className="text-center text-3xl opacity-40">
              →
            </div>
            <div className="text-center md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Day 30</p>
              <p
                className="mt-2 text-7xl font-semibold tracking-tight md:text-8xl"
                style={{ color: "var(--primary)" }}
              >
                65
              </p>
              <p className="mt-1 text-sm opacity-80">Impossible to ignore</p>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed opacity-70">
            Your Readiness Score is measured on Day 1 and again on Day 30, across Structure,
            Specificity, Confidence Signals and Relevance. The change is not a feeling. It is a
            number you can show someone.
          </p>
        </div>
      </section>

      {/* What it costs you */}
      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            You are not underqualified. You are under heard.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The promotion went to the person who spoke second. The pitch died in the room. You had
            the better answer and said it three seconds too late. That is not a knowledge gap. It is
            a delivery gap, and it is the only skill nobody ever taught you.
          </p>
        </div>
      </section>



      {/* The 5 phases, the calendar */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            The 30 day calendar
          </p>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Five phases. Seven steps taught inside them.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            The phases are your calendar. The seven steps are the content, drilled in the phase
            where they matter most. Every session is impromptu and scored.
          </p>
          <ol className="mt-12 space-y-4">
            {PHASES.map((p) => (
              <li
                key={p.n}
                className="grid gap-3 rounded-2xl border border-border bg-foreground/[0.02] p-7 md:grid-cols-[180px_1fr]"
              >
                <div>
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "var(--primary)" }}
                  >
                    {p.n}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{p.days}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.steps.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 rounded-2xl border border-border bg-background p-7">
            <h3 className="text-lg font-semibold tracking-tight">The seven steps</h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n}>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.18em]"
                      style={{ color: "var(--primary)" }}
                    >
                      {s.n}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{s.phase}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold tracking-tight">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enrol */}
      <section id="enrol" className="border-t border-border bg-background py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <article
            className="relative flex flex-col rounded-2xl border border-foreground/30 bg-foreground/[0.04] p-8"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <span
              className="absolute -top-3 right-5 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ background: "var(--gradient-gold)", color: "var(--primary-foreground)" }}
            >
              Most popular
            </span>

            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              30 Day Voice Mastery Program
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              One human voice coach costs $300 an hour and gives you an opinion. Bramwell costs $349
              once, trains you every day for 30 days, and gives you a score.
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-5xl font-semibold tracking-tight">$349</span>
              <span className="text-sm text-muted-foreground">USD, one payment</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              30 scored sessions, 5 phases, 7 steps
            </p>

            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {[
                "30 structured impromptu speaking sessions with Bramwell your Voice AI Mentor",
                "Five phases: Baseline, Structure, Command the Room, Move to Decision, Perform Under Pressure",
                "Scored across Structure, Specificity, Confidence Signals and Relevance",
                "Day 1 and Day 30 Readiness Score, so the change is a number",
              ].map((i) => (
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
              <CtaButton as="button" onClick={startCheckout} size="lg" showIcon={false} className="w-full">
                Get started
              </CtaButton>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secure checkout. Begin today.

              </p>
            </div>
          </article>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Not ready?{" "}
            <a
              href="/diagnostic"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Take the free 5 minute test
            </a>{" "}
            and hear your score first. No card. No login.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      {SHOW_TESTIMONIALS ? (
        <section className="border-y border-border bg-foreground/[0.02] py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6 md:px-10">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              See what others are saying
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="rounded-2xl border border-border bg-background p-7">
                  <blockquote className="text-base leading-relaxed">"{t.quote}"</blockquote>
                  <figcaption className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className="border-t border-border bg-background py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group py-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold tracking-tight">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-sm text-muted-foreground">
            Leading a team?{" "}
            <Link to="/founders" className="font-medium text-foreground underline-offset-4 hover:underline">
              See the Elite Sales Team Voice AI Coach 30 Day Program
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-foreground py-20 text-background md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Thirty days from now, they stop talking over you.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base opacity-70">
            A structured 30 day curriculum. Begin today. One payment of $349.

          </p>
          <div className="mt-9 flex justify-center">
            <CtaButton as="button" onClick={startCheckout} size="lg" showIcon={false}>
              Get started
            </CtaButton>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">30 Day Voice Mastery</p>
            <p className="truncate text-xs text-muted-foreground">$349 USD, one payment</p>
          </div>
          <CtaButton as="button" onClick={startCheckout} size="sm" showIcon={false}>
            Get started
          </CtaButton>
        </div>
      </div>

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
