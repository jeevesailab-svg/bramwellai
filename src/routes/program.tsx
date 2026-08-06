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
    <main className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <SiteNav ctaLabel="Start the test" ctaHref="/diagnostic?autostart=1" />

      {/* Hero */}
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
            Cohort 1 starts {COHORT_START}
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            30 Day Voice Mastery Program
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Bramwell your Voice AI Mentor in your pocket. Change your voice.
            Change your life in 30 days.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Get the concrete strategies and tools that have transformed thousands of voices at
            every stage. Your Voice AI Mentor trains you daily, scores every session, and proves
            your progress.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <CtaButton href="/diagnostic?autostart=1" size="lg" showIcon={false} showArrow={false}>
              Start the test ↓
            </CtaButton>
            {typeof score === "number" && !Number.isNaN(score) ? (
              <p className="text-xs text-muted-foreground">
                Your diagnostic scored {score}. This is the program that moves it.
              </p>
            ) : null}
          </div>

          <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border text-left sm:grid-cols-3">
            {[
              { k: "Date", v: `Cohort 1, starts ${COHORT_START}` },
              { k: "Format", v: "30 day online program plus community pod" },
              { k: "Price", v: "$299 USD, one payment" },
            ].map((row) => (
              <div key={row.k} className="bg-background/80 px-5 py-4 backdrop-blur">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {row.k}
                </dt>
                <dd className="mt-1 text-sm font-medium">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* About */}
      <section className="border-y border-border bg-background py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 md:grid-cols-2 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
              About
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Meet Bramwell your Voice AI Mentor
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Bramwell your Voice AI Mentor in your pocket, training you on the system for
              sustainable transformation. You speak. It listens. It scores. Every day for 30 days.
            </p>
            <div className="mt-7">
              <CtaButton href="/diagnostic?autostart=1" size="md" showIcon={false} showArrow={false}>
                Start the test ↓
              </CtaButton>
            </div>
          </div>
          <div
            className="flex aspect-video items-center justify-center rounded-2xl border border-border bg-foreground/[0.03]"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <span className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Watch video
            </span>
          </div>
        </div>
      </section>

      {/* Key benefits */}
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--primary)" }}>
            Key benefits
          </p>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Bramwell your Voice AI Mentor in your pocket, training you on the system for
            sustainable transformation.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <article
                key={b.title}
                className="rounded-2xl border border-border bg-foreground/[0.02] p-7 transition hover:border-foreground/20"
              >
                <h3 className="text-lg font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Overlooked to undeniable */}
      <section className="border-y border-border bg-foreground/[0.02] py-20 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-3 md:px-10">
          <div className="md:col-span-3">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Go from overlooked to undeniable
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              With the right tools and skills you stop shrinking in meetings and start owning every
              room you walk into. This is your roadmap for scaling like you never thought possible.
            </p>
          </div>
          {[
            {
              t: "Built for today's professionals",
              b: "For managers and executives, founders and sales leaders, anyone who wants to transform their voice, align on a new direction, or grow to heights they never thought possible.",
            },
            {
              t: "Now is the time",
              b: "During economic, social and professional challenges, the quest for authority in a sea of voices becomes crucial. Voice Mastery does not just help you weather any room, it helps you thrive.",
            },
            {
              t: "Change your voice and your life",
              b: "From the strategies to the support, Voice Mastery is unlike any program you have experienced. Your Voice AI Mentor is with you every day, listening, scoring and coaching.",
            },
          ].map((c) => (
            <article key={c.t} className="rounded-2xl border border-border bg-background p-7">
              <h3 className="text-lg font-semibold tracking-tight">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.b}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-background py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="grid gap-5 md:grid-cols-2">
            {PILLARS.map((p) => (
              <article key={p.title} className="rounded-2xl border border-border p-7">
                <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
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
            <h3 className="text-2xl font-semibold tracking-tight">
              This is your step by step voice playbook
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Get to the root of what is holding you back and create a practice system that lets you
              scale without sacrificing time, energy and confidence. In this immersive experience you
              get the system of success Bramwell has leveraged, along with insights from the most
              brilliant minds in communication.
            </p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight">$299</span>
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
              <CtaButton as="button" onClick={startCheckout} size="md" showIcon={false} className="w-full">
                Join the 30 Day Voice Mastery Program
              </CtaButton>
            </div>
          </article>

          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Own your voice, do not let it own you. Take the free test first. No card. No login. If it
            does not change how you sound in your first session, do not buy the program.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton href="/diagnostic?autostart=1" size="md" showIcon={false} showArrow={false}>
              Start the test ↓
            </CtaButton>
          </div>
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
              See the 30 Day Team Voice Mastery Program
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-foreground/[0.02] py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Break through to the next level in your voice
          </h2>
          <div className="mt-8 flex justify-center">
            <CtaButton href="/diagnostic?autostart=1" size="lg" showIcon={false} showArrow={false}>
              Start the test ↓
            </CtaButton>
          </div>
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
