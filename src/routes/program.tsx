import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { CtaButton } from "@/components/site/CtaButton";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";

const PRICE_ID = "voice_mastery_30day_once";
const COHORT_START = "15 August 2026";
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
      { title: "30 Day Voice Mastery Program | Bramwell your Voice AI Mentor" },
      {
        name: "description",
        content:
          "Bramwell your Voice AI Mentor in your pocket. Change your voice, change your life in 30 days. Daily practice, every session scored, your progress proven. $299 USD.",
      },
      { property: "og:title", content: "30 Day Voice Mastery Program | Bramwell your Voice AI Mentor" },
      {
        property: "og:description",
        content:
          "Your Voice AI Mentor trains you daily, scores every session, and proves your progress. 30 days. $299 USD.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const METHOD = [
  {
    step: "Diagnose",
    body: "Take the free test. Speak with Bramwell your Voice AI Mentor for 5 minutes. Get your Readiness Score. Most people have never measured their voice. The number might sting. That is the point.",
  },
  {
    step: "Practise",
    body: "Five minutes a day with your Voice AI Mentor. You speak. It listens. It scores. No judgement, just honest feedback. 30 sessions. 4 weekly check ins. A pod that holds you to it.",
  },
  {
    step: "Perform",
    body: "Week by week your score moves. Week 1: 47. Week 2: 53. Week 3: 59. Week 4: 65. Your Mentor tracks every session and you feel the difference in your next meeting.",
  },
  {
    step: "Prove",
    body: "Day 30. You retake the diagnostic with your Voice AI Mentor. Your score went from 42 to 65. You can see it. You can share it. You can prove it.",
  },
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
    a: "A 30 day structured voice training program with Bramwell your Voice AI Mentor. You speak with your Mentor daily, get scored across four dimensions, and receive weekly check ins with a before and after Readiness Score. You diagnose on Day 1, practise for 30 days, and prove the change on Day 30.",
  },
  {
    q: "Who is the program for?",
    a: "Managers and executives, founders and sales leaders, professionals at any stage who want to transform how they sound. If you have ever felt overlooked in meetings, passed over for presentations, or like your voice has not caught up to your expertise, this is for you.",
  },
  {
    q: "What can I expect to learn?",
    a: "Daily voice practice with your Voice AI Mentor. Your Mentor scores you across four dimensions: Structure, Specificity, Confidence Signals and Relevance. Weekly check ins that track your score, an accountability pod, and a before and after Readiness Score that proves your transformation.",
  },
  {
    q: "How long is the program?",
    a: "30 days. Daily practice takes 5 minutes. Weekly check ins take 15 minutes. The full program runs across 4 weeks with a final retest on Day 30.",
  },
  {
    q: "I have never done voice training before, is this for me?",
    a: "Yes. Most participants have never measured their voice. The diagnostic gives you a baseline score on Day 1 and the program builds from there. No experience required.",
  },
  {
    q: "Are there any prerequisites?",
    a: "You take the free test first. That gives you your Readiness Score. If your score is below 60 the program is designed to move it. If it is above 60 the program will push you higher.",
  },
  {
    q: "I manage a sales team, how can this help me?",
    a: "The team version clones your founder's pitch into AI practice scenarios every rep trains against. 30 days. $1,500 for 10 seats. Manager dashboard and team benchmarking included.",
  },
  {
    q: "Is there a community component?",
    a: "Yes. Accountability pods of 4 to 6 people. You are not alone, you are in a cohort of professionals on the same journey.",
  },
  {
    q: "What makes this different from other voice coaching?",
    a: "Three things: your Voice AI Mentor, the score, and the timeline. Your Mentor practises with you daily, listening, scoring and giving real time feedback. Your voice has a number. In 30 days you retake the test and watch the number change.",
  },
  {
    q: "How will this help me in my career?",
    a: "Your voice decides if they listen or forget, if you sound confident or unsure, if you get heard or get overlooked. In 30 days of daily practice with your Voice AI Mentor your Readiness Score moves from 42 to 65, and that number moves with you into every meeting.",
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
            Cohort 1 starts {COHORT_START}
          </span>
          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            Change your voice.
            <br />
            Change your life.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Ten minutes a day for 30 days with Bramwell, your Voice AI Mentor. You speak. He scores
            you. On Day 30 the number proves it.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3">
            <CtaButton as="button" onClick={startCheckout} size="lg" showIcon={false}>
              Get started, $299
            </CtaButton>
            <p className="text-xs text-muted-foreground">
              One payment. Full refund after session one if it does not land.{" "}
              <a href="/diagnostic?autostart=1" className="font-medium text-foreground underline underline-offset-4">
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



      {/* The Bramwell Method */}
      <section className="border-y border-border bg-foreground/[0.02] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            The Bramwell Method
          </p>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Our proven system for voice transformation.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Your Voice AI Mentor practises with you daily, scores every response, and proves your
            progress.
          </p>
          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {METHOD.map((m, i) => (
              <li key={m.step} className="rounded-2xl border border-border bg-background p-7">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "var(--primary)" }}
                >
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{m.step}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Enrol */}
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
              Cohort 1, {COHORT_START}
            </span>
            <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
              30 Day Voice Mastery Program
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              One human voice coach costs $300 an hour and gives you an opinion. Bramwell costs $299
              once, trains you every day for 30 days, and gives you a score.
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-5xl font-semibold tracking-tight">$299</span>
              <span className="text-sm text-muted-foreground">USD, one payment</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Ten minutes a day for 30 days
            </p>

            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {[
                "Daily live voice sessions with Bramwell your Voice AI Mentor, 30 days straight",
                "Scored across Structure, Specificity, Confidence Signals and Relevance",
                "Weekly check ins that track your Readiness Score",
                "An accountability pod of 4 to 6 professionals",
                "Your personal playbook, rewritten every week as you improve",
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
                Cohort 1 begins {COHORT_START}. Secure checkout. Refunded in full after session one
                if it does not land.
              </p>
            </div>
          </article>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Not ready?{" "}
            <a
              href="/diagnostic?autostart=1"
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

      {/* Guarantee */}
      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            The Bramwell Guarantee
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Value on session one, or your money back.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Run your first session. If Bramwell your Voice AI Mentor does not identify something
            specific and actionable about how you communicate, something you had not seen yourself,
            we refund you in full. No forms. No questions.
          </p>
        </div>
      </section>

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
            <Link to="/waitlist" className="font-medium text-foreground underline-offset-4 hover:underline">
              See the 30 Day Team Voice Mastery Program
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
            Cohort 1 starts {COHORT_START}. Ten minutes a day. One payment of $299.
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
            <p className="truncate text-xs text-muted-foreground">$299 USD, one payment</p>
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
