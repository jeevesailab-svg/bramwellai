import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";
import { CtaButton } from "@/components/site/CtaButton";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

export const Route = createFileRoute("/founders")({
  component: FoundersPage,
  head: () => ({
    meta: [
      { title: "Clone Your Best Salesperson Across the Whole Team | Bramwell AI" },
      {
        name: "description",
        content:
          "A private Sales Voice AI Coach that never sleeps: it analyses every call, gives each salesperson actionable feedback, and trains your whole team to the same proven standard. Accelerate growth and lead with certainty in 30 days.",
      },
      { property: "og:title", content: "Clone your best salesperson across the whole team." },
      {
        property: "og:description",
        content:
          "A private Sales Voice AI Coach that never sleeps: it analyses every call, gives each salesperson actionable feedback, and trains your whole team to the same proven standard. Accelerate growth and lead with certainty in 30 days.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const TEAM_SIZES = [
  "1-5 salespeople",
  "6-15 salespeople",
  "16-30 salespeople",
  "31-60 salespeople",
  "60+ salespeople",
];
const ROLES = [
  "Founder / CEO",
  "Managing Director",
  "VP Sales",
  "Head of Sales",
  "Sales Director",
  "Sales Manager",
  "Sales Enablement",
  "RevOps",
  "Other",
];

/** The four pressures a founder feels before they call us. */
const PRESSURES = [
  {
    k: "Deals stall",
    body: "Your team runs good conversations that never convert. The pipeline looks healthy and the revenue does not follow.",
  },
  {
    k: "Sales are flat",
    body: "Growth has plateaued at the ceiling of what you personally can sell. Adding headcount has not moved the number.",
  },
  {
    k: "Competitors are winning",
    body: "You are losing deals to businesses with a weaker product and a stronger sales conversation.",
  },
  {
    k: "Motivation is slipping",
    body: "Salespeople lose confidence after losses they cannot explain. Nobody has time to coach them through it.",
  },
];

/** The 30-day implementation sequence. */
const PHASES = [
  {
    n: "Days 1-5",
    title: "Analyse how you win",
    body: "We review your recorded sales conversations and interview you and your top performers. We identify the exact questions, framing and objection responses that separate the deals you win from the deals you lose.",
  },
  {
    n: "Days 6-10",
    title: "Document your sales methodology",
    body: "Your winning process is written down: discovery structure, qualification criteria, objection responses, pricing conversation and close. One standard, in your language, specific to your customers.",
  },
  {
    n: "Days 11-15",
    title: "Build your private AI sales coach",
    body: "We configure a private AI coach trained on your products, your buyers, your objections and your methodology. It role-plays your real deals, not generic sales scenarios.",
  },
  {
    n: "Days 16-30",
    title: "Train and clone every salesperson",
    body: "Every salesperson practises daily in 15-minute sessions. Every role play is scored against your standard, with specific coaching on what to change in the next live call.",
  },
  {
    n: "Day 30",
    title: "Measure the change",
    body: "You receive a performance report for every salesperson: starting benchmark, current score, movement, and where coaching is still required.",
  },
];

/** Certainty: what we commit to. */
const CERTAINTY = [
  {
    t: "Your methodology, not ours",
    b: "We do not install a generic framework. The standard is extracted from the conversations your business already wins.",
  },
  {
    t: "Coaching happens without you",
    b: "You do not run the training. The platform coaches every salesperson daily, whether or not you have the time that week.",
  },
  {
    t: "Fifteen minutes a day per salesperson",
    b: "No offsites, no workshops out of the field, no week away from the pipeline.",
  },
  {
    t: "Performance is measured, not assumed",
    b: "Every salesperson has a score against your standard and a visible trend line. Coaching goes where the data says it is needed.",
  },
];

const RESULTS = [
  {
    k: "01",
    title: "Document how your best people win business",
    body: "Turn your highest-performing sales conversations into a documented sales methodology your entire team can learn.",
  },
  {
    k: "02",
    title: "Train every salesperson using your proven sales process",
    body: "Replace inconsistent onboarding with structured daily practice built around your customers, products and objections.",
  },
  {
    k: "03",
    title: "Improve consistency across every customer conversation",
    body: "Give every salesperson the same language, questioning framework and decision process used by your highest performers.",
  },
  {
    k: "04",
    title: "Coach every salesperson every day",
    body: "Every role play ends with measurable feedback, practical coaching and another opportunity to improve.",
  },
  {
    k: "05",
    title: "Give sales managers complete visibility",
    body: "See where each salesperson is improving, where coaching is required and how performance changes over time.",
  },
  {
    k: "06",
    title: "Build a sales team that scales",
    body: "As your business grows, every new salesperson learns the same proven sales standard from day one.",
  },
];

const WHO_ITS_FOR = [
  "You are still the strongest salesperson in the business",
  "Every new hire develops different habits",
  "Sales performance varies from one person to the next",
  "Your growth depends on a small number of top performers",
];

const INCLUDED = [
  "Founder and sales leadership workshops",
  "Analysis of your highest-performing sales conversations",
  "Documentation of your sales methodology",
  "Private AI sales coach configured for your business",
  "Daily AI role-play coaching for every salesperson",
  "Manager dashboard and performance reporting",
  "Ongoing platform updates and coaching scenarios",
];

const ROI_COMPARISON = [
  {
    label: "One day sales trainer",
    cost: "$8,000 - $15,000",
    note: "One event. No daily reinforcement. No measurement.",
  },
  {
    label: "Sales methodology consultant",
    cost: "$25,000 - $60,000",
    note: "3-6 month project. Delivered and gone. No ongoing coaching.",
  },
  {
    label: "Full-time sales enablement hire",
    cost: "$120,000 - $180,000 / year",
    note: "Salary + overhead. Cannot coach every salesperson every day.",
  },
  {
    label: "Bramwell AI Voice Coach",
    cost: "$3,500 + $1,500 / month",
    note: "Private coach, daily role-play, manager dashboard, documented methodology.",
  },
];



const FAQS = [
  {
    q: "What is the Elite Sales Team Voice AI Coach 30 Day Program?",
    a: "A done-for-you implementation programme. We analyse your highest-performing sales conversations, interview your founder and top performers, document your sales methodology, and build a private AI coaching platform that trains every salesperson using your products, your customers and your sales process.",
  },
  {
    q: "How is this different from sales training?",
    a: "Training is an event. This is infrastructure. Your methodology is documented once and then practised daily by every salesperson, with measurable feedback after every role play.",
  },
  {
    q: "Do you use a generic sales methodology?",
    a: "No. The platform is built on your sales process, your products, your customers and the objections your team actually hears. The standard is yours, not ours.",
  },
  {
    q: "What do you need from our team?",
    a: "Access to recorded sales conversations, workshop time with the founder and top performers, and a sales leader who owns the rollout internally.",
  },
  {
    q: "How long does implementation take?",
    a: "Analysis and documentation run first, then the private coaching platform is configured and rolled out to your team. Timelines are confirmed on the qualification call once we understand team size and call volume.",
  },
  {
    q: "What do sales managers get?",
    a: "A dashboard showing daily practice, coaching feedback and performance movement for every salesperson, so coaching goes where it is needed instead of where it is convenient.",
  },
  {
    q: "Do you guarantee results?",
    a: "We do not guarantee revenue or market outcomes — no one can. We guarantee delivery: your private Voice AI Coach, your documented methodology, and daily coaching access for every enrolled salesperson within 30 days. If we do not deliver that, you do not pay for the implementation.",
  },
  {
    q: "Is our sales call data private?",
    a: "Yes. Recorded calls and your methodology are used only to build your private coach. They are never shared, sold, or used to train public models.",
  },
  {
    q: "Who is it not for?",
    a: "Businesses without a sales team yet, or leaders looking for a one-off workshop. This is an implementation programme for founder-led businesses scaling beyond themselves.",
  },
];


function scrollToApply() {
  document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
}

function scrollToBookCall() {
  document.getElementById("book-call")?.scrollIntoView({ behavior: "smooth" });
}


function FoundersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openCheckout, closeCheckout, isOpen: checkoutOpen, checkoutElement } = useStripeCheckout();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const teamSizeRef = useRef<HTMLSelectElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const firstName = firstNameRef.current?.value.trim() ?? "";
    const lastName = lastNameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const company = companyRef.current?.value.trim() ?? "";
    const teamSize = teamSizeRef.current?.value ?? "";
    const role = roleRef.current?.value ?? "";

    if (!firstName || !lastName || !email || !company || !teamSize || !role) {
      setError("Please complete every field so we can review your application.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/public/founders-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          company,
          teamSize,
          role,
          source: "founders_page",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Submission failed" }));
        setError(body?.error || "Submission failed. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-foreground";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel="Get Started" ctaHref="#apply" />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-12 md:px-10 md:pb-24 md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
            Elite Sales Voice AI Coach 30 Day Program
          </span>

          <h1 className="mt-8 max-w-5xl text-balance text-4xl font-semibold leading-[0.96] tracking-[-0.04em] sm:text-6xl md:text-[80px] lg:text-[96px]">
            Clone your best salesperson across the whole team.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            A private Sales Voice AI Coach that never sleeps: it analyses every call, gives each
            salesperson actionable feedback, and trains your whole team to the same proven
            standard. Accelerate growth and lead with certainty in 30 days.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <CtaButton as="button" onClick={scrollToApply} size="lg" showIcon={false}>
              Get Started
            </CtaButton>
            <span className="text-sm text-muted-foreground">
              30 day implementation. Done for you.
            </span>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {[
              { k: "30 days", v: "From analysis to a trained team" },
              { k: "15 min / day", v: "Practice per salesperson, in the field" },
              { k: "1 goal", v: "Get your team to close" },
            ].map((s) => (
              <div key={s.k} className="bg-background px-7 py-6">
                <p className="text-2xl font-semibold tracking-tight md:text-3xl">{s.k}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The mechanism */}
      <section className="border-b border-border bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {[
              {
                k: "Clone",
                title: "Clone your best closer",
                body: "We analyse the conversations your top performers win, then encode their language, questions and objection handling into a private Voice AI coach.",
              },
              {
                k: "Coach",
                title: "Daily AI role-play",
                body: "Every salesperson practises in 15-minute voice sessions with realistic buyers, real objections and instant feedback tuned to your standard.",
              },
              {
                k: "Track",
                title: "See progress on a dashboard",
                body: "Managers see daily practice, scoring and improvement trends for every salesperson, so coaching goes where the data says it is needed.",
              },
            ].map((m) => (
              <div key={m.k} className="bg-background p-8 md:p-10">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {m.k}
                </span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            See it in action
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[32px] font-semibold leading-[1] tracking-[-0.03em] md:text-5xl">
            A sales coach that listens, scores, and coaches every call.
          </h2>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Recorded calls become a private training standard for every salesperson. Here is how the platform turns one winning conversation into team-wide consistency.
          </p>

          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-muted p-8 md:p-12">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Upload the call",
                  body: "Drop in a recorded sales conversation your team already has.",
                },
                {
                  step: "02",
                  title: "Extract the standard",
                  body: "Bramwell identifies the questions, framing and responses that won the deal.",
                },
                {
                  step: "03",
                  title: "Coach the team",
                  body: "Every salesperson practises against that standard and receives scored feedback.",
                },
              ].map((s) => (
                <div key={s.step} className="rounded-xl border border-border bg-background p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Step {s.step}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
            <div id="book-call" className="mt-8 overflow-hidden rounded-xl border border-border bg-background">
              <div className="border-b border-border bg-muted p-6">
                <p className="text-sm font-semibold">Book a 15-minute qualification call</p>
                <p className="text-sm text-muted-foreground">
                  Pick a time that works for you. We will walk through your sales calls and answer questions about the programme.
                </p>
              </div>
              <div className="h-[520px] w-full md:h-[640px]">
                <iframe
                  src="https://calendar.app.google/QWKYUsrzx2k44UE76"
                  title="Book a qualification call with Bramwell AI"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="auto"
                  className="h-full w-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* The problem */}

      <section className="bg-foreground py-24 text-background md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-50">
            Why growth stalls
          </p>
          <h2 className="mt-6 max-w-4xl text-balance text-[38px] font-semibold leading-[0.98] tracking-[-0.03em] md:text-7xl">
            You do not have a lead problem. You have a conversation problem.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-70">
            Deals are not lost in the pipeline. They are lost in the twenty minutes where one
            salesperson asks the right question and another does not.
          </p>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-background/20 sm:grid-cols-2">
            {PRESSURES.map((p) => (
              <div key={p.k} className="bg-foreground px-7 py-8 md:px-9 md:py-10">
                <h3 className="text-xl font-semibold tracking-tight">{p.k}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{p.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-2xl font-semibold tracking-tight md:text-3xl">
            Hope is not a sales strategy.
          </p>
          <div className="mt-10">
            <CtaButton as="button" onClick={scrollToApply} size="lg" showIcon={false}>
              Get Started
            </CtaButton>
          </div>
        </div>
      </section>

      {/* How it works: 30 day sequence */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            The 30 day programme
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Done for you. Implemented in thirty days.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            You do not run this. We do. Your team keeps selling while the system is built around them.
          </p>

          <ol className="mt-16 border-t border-border">
            {PHASES.map((p) => (
              <li key={p.n} className="grid gap-4 border-b border-border py-8 md:grid-cols-[160px_1fr] md:gap-10 md:py-10">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:pt-1">
                  {p.n}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Certainty */}
      <section className="border-b border-border bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Why this works when training does not
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Training is an event. This is infrastructure.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {CERTAINTY.map((c) => (
              <div key={c.t} className="bg-background p-8 md:p-10">
                <h3 className="text-xl font-semibold tracking-tight">{c.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Results
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Build a sales team that performs to one standard.
          </h2>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {RESULTS.map((p) => (
              <div key={p.k} className="bg-background p-8 md:p-10">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {p.k}
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Who it is for
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Built for founders ready to scale beyond themselves.
          </h2>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2">
            {WHO_ITS_FOR.map((w) => (
              <li key={w} className="rounded-2xl border border-border bg-background p-7 text-base leading-relaxed">
                {w}
              </li>
            ))}
          </ul>
          <p className="mt-12 text-2xl font-semibold tracking-tight md:text-3xl">
            This programme was built for you.
          </p>
          <div className="mt-10">
            <CtaButton as="button" onClick={scrollToApply} size="lg" showIcon={false}>
              Get Started
            </CtaButton>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-b border-border bg-foreground py-24 text-background md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-50">
            What is included
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            One implementation. One sales standard. One coaching platform.
          </h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-background/20 sm:grid-cols-2">
            {INCLUDED.map((i) => (
              <li key={i} className="bg-foreground px-7 py-6 text-base leading-relaxed">
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ROI comparison */}
      <section className="border-b border-border bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Cost comparison
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            A full-time coach for less than a single trainer day.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Sales training is expensive and fades. A private Voice AI Coach is always available, scales to every salesperson, and costs a fraction of the alternatives.
          </p>

          <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-background">
            <div className="hidden md:grid md:grid-cols-[1fr_200px_1fr] md:gap-px md:bg-border">
              <div className="bg-background px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Option
              </div>
              <div className="bg-background px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Cost
              </div>
              <div className="bg-background px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Reality
              </div>
              {ROI_COMPARISON.map((row, i) => (
                <>
                  <div
                    key={`${row.label}-label`}
                    className={`bg-background px-6 py-5 text-base font-semibold ${i === ROI_COMPARISON.length - 1 ? "text-foreground" : ""}`}
                  >
                    {row.label}
                  </div>
                  <div
                    key={`${row.label}-cost`}
                    className={`bg-background px-6 py-5 text-base ${i === ROI_COMPARISON.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    {row.cost}
                  </div>
                  <div
                    key={`${row.label}-note`}
                    className={`bg-background px-6 py-5 text-sm leading-relaxed ${i === ROI_COMPARISON.length - 1 ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {row.note}
                  </div>
                </>
              ))}
            </div>

            <div className="md:hidden">
              {ROI_COMPARISON.map((row, i) => (
                <div
                  key={row.label}
                  className={`border-b border-border p-6 last:border-b-0 ${i === ROI_COMPARISON.length - 1 ? "bg-muted/50" : ""}`}
                >
                  <p className="text-base font-semibold">{row.label}</p>
                  <p className={`mt-1 text-base ${i === ROI_COMPARISON.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {row.cost}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{row.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-background p-8 md:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-base font-semibold">What this means for a 10-person sales team</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A single sales trainer day costs roughly the same as a full year of daily AI coaching per person. With Bramwell, every salesperson practises every day, not once a quarter.
                </p>
              </div>
              <CtaButton as="button" onClick={scrollToApply} size="lg" showIcon={false}>
                Get Started
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* Investment */}

      <section className="border-b border-border bg-background py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Investment
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            One implementation. One standard. One team that closes.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            For founder-led teams ready to install a repeatable sales standard without adding headcount.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Primary offer */}
            <div className="rounded-2xl border border-border bg-foreground p-8 text-background md:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-60">
                30 day programme
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                USD $3,500
              </p>
              <p className="mt-3 text-sm opacity-70">
                One-time implementation. Built for teams of 5 or more salespeople.
              </p>
              <ul className="mt-8 space-y-3 text-sm opacity-90">
                {INCLUDED.slice(0, 5).map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="opacity-60">✓</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  openCheckout({
                    priceId: "elite_sales_voice_ai_30day_onetime",
                    returnUrl: `${window.location.origin}/founders-thanks?session_id={CHECKOUT_SESSION_ID}`,
                  })
                }
                className="mt-10 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-background text-base font-semibold text-foreground transition hover:opacity-90"
              >
                Get Started <span>→</span>
              </button>
            </div>

            {/* Retainer */}
            <div className="rounded-2xl border border-border bg-muted p-8 md:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Ongoing retraining
              </p>
              <p className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                USD $1,500
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                per month. Retraining, new scenarios, and platform maintenance.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                {[
                  "Monthly new coaching scenarios",
                  "Refreshed objection handling",
                  "Performance trend reviews",
                  "Platform updates and support",
                ].map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-muted-foreground">✓</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={scrollToBookCall}
                className="mt-10 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border border-border bg-background text-base font-semibold transition hover:bg-accent"
              >
                Book a qualification call <span>→</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Need a custom scope or larger rollout?{" "}
            <button
              type="button"
              onClick={scrollToBookCall}
              className="underline underline-offset-4"
            >
              Book a call
            </button>{" "}
            and we will scope it.
          </p>
        </div>
      </section>

      {/* Risk reversal */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Risk reversal
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            We guarantee the work, not the market.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            We cannot promise your product will sell itself. We can promise the system will be built
            and your team will be trained.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 rounded-2xl border border-border bg-foreground p-8 text-background md:p-10">
              <h3 className="text-2xl font-semibold tracking-tight">30-day delivery guarantee</h3>
              <p className="mt-4 text-sm leading-relaxed opacity-80">
                If we do not deliver your private Voice AI Coach, document your sales methodology,
                and give every enrolled salesperson access to personalised coaching within 30 days,
                you do not pay for the implementation.
              </p>
              <ul className="mt-6 space-y-2 text-sm opacity-90">
                {[
                  "Private AI coach configured to your business",
                  "Sales methodology documented in your language",
                  "Daily coaching access for every enrolled salesperson",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="opacity-60">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-muted p-8">
                <h3 className="text-lg font-semibold tracking-tight">No ongoing lock-in</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The retainer is month-to-month. You keep your methodology and coach data if you
                  ever leave.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted p-8">
                <h3 className="text-lg font-semibold tracking-tight">Your data stays private</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Recorded calls and methodology are used only to train your private coach. They
                  are never shared or used to train a public model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apply */}

      <section id="apply" className="border-b border-border bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Get Started.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Tell us about your sales team. We review every application by hand and take on a limited
            number of implementations each quarter.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-border bg-background p-8 md:p-10">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Application received.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                We review every application by hand. A confirmation email is on its way to you now.
                If your business is a fit, we will be in touch within two business days to arrange
                a 30-minute qualification call.
              </p>
              <div className="mt-6 border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  What happens next
                </p>
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-muted-foreground md:text-base">
                  <li>We review your application against current programme capacity.</li>
                  <li>If you are a fit, we email you to book the qualification call.</li>
                  <li>On the call we discuss your sales team, pipeline, and whether the programme is the right fit.</li>
                </ol>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={scrollToBookCall}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-7 text-sm font-semibold transition hover:bg-accent"
                >
                  Book your qualification call <span>→</span>
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Optional: skip the wait and book directly if you already know this is a fit.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-border bg-background p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium">First name</label>
                  <input id="firstName" name="firstName" ref={firstNameRef} className={field} suppressHydrationWarning />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium">Last name</label>
                  <input id="lastName" name="lastName" ref={lastNameRef} className={field} suppressHydrationWarning />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium">Work email</label>
                  <input id="email" name="email" ref={emailRef} type="email" className={field} suppressHydrationWarning />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium">Company</label>
                  <input id="company" name="company" ref={companyRef} className={field} suppressHydrationWarning />
                </div>
                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium">Sales team size</label>
                  <select id="teamSize" name="teamSize" ref={teamSizeRef} className={field} suppressHydrationWarning>
                    <option value="">Select</option>
                    {TEAM_SIZES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium">Your role</label>
                  <select id="role" name="role" ref={roleRef} className={field} suppressHydrationWarning>
                    <option value="">Select</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error ? <p className="mt-5 text-sm text-destructive">{error}</p> : null}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full text-base font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
                >
                  {submitting ? "Sending" : "Get Started"} <span>→</span>
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                We only use these details to review your application and arrange your call.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border py-24 md:py-28">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-5xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group py-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold tracking-tight">
                  {f.q}
                  <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-foreground py-28 text-background md:py-36">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
          <h2 className="text-balance text-[42px] font-semibold leading-[0.96] tracking-[-0.035em] md:text-7xl">
            Your competitors are still guessing. Build the system instead.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg opacity-70">
            One implementation. One sales standard. Every salesperson trained to it, every day.
          </p>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={scrollToApply}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-background px-9 text-base font-semibold text-foreground transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Get Started <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Checkout modal */}
      {checkoutOpen ? (
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

      <SiteFooter />
    </main>
  );
}
