import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";
import { CtaButton } from "@/components/site/CtaButton";

export const Route = createFileRoute("/founders")({
  component: FoundersPage,
  head: () => ({
    meta: [
      { title: "Clone Your Best Closer | 30 Day Team Voice Mastery | Bramwell" },
      {
        name: "description",
        content:
          "Your best closer is one person. Make them everyone. Every rep trains daily against your founder's pitch with their Voice AI Mentor. 30 days. $1,500 for 10 seats.",
      },
      { property: "og:title", content: "Clone Your Best Closer | 30 Day Team Voice Mastery" },
      {
        property: "og:description",
        content:
          "Every rep trains daily against your founder's pitch with their Voice AI Mentor. Team benchmark on Day 1. Proof on Day 30.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const COHORT_START = "15 August 2026";

const TEAM_SIZES = ["1-10 reps", "11-25 reps", "26-50 reps", "51-100 reps", "100+ reps"];
const ROLES = [
  "Founder / CEO",
  "VP Sales",
  "Head of Sales",
  "Sales Director",
  "Sales Manager",
  "Sales Enablement",
  "RevOps",
  "Other",
];

const STATS = [
  { n: "41%", l: "of reps want more roleplay practice", s: "Salesforce, State of Sales 2026" },
  { n: "26%", l: "actually get it from their manager", s: "Salesforce, State of Sales 2026" },
  { n: "1,215", l: "manager hours a quarter freed by AI roleplay", s: "Snowflake, Yoodli case study" },
];

const PILLARS = [
  {
    k: "01",
    title: "Clone your best closer",
    body: "You upload the pitch that wins. Their words, their pace, their objection handling, their close. Your Voice AI Mentor turns it into daily roleplay every rep trains against.",
  },
  {
    k: "02",
    title: "Practice that actually happens",
    body: "Five minutes a day, every day, for every rep. No calendar tetris, no manager shadowing, no waiting for a coach who cancels. The Mentor never cancels.",
  },
  {
    k: "03",
    title: "A number on every rep",
    body: "Structure, Specificity, Confidence Signals, Relevance. Every session scored. You finally know who is ready for the enterprise call and who is not.",
  },
  {
    k: "04",
    title: "Proof for your VP",
    body: "Day 1 team benchmark. Day 30 team benchmark. Average 48 to 62 on one printable page. Not a feeling about ramp. A number.",
  },
];

const METHOD = [
  {
    step: "Diagnose",
    body: "Every rep speaks with their Voice AI Mentor for five minutes. You get a team benchmark on Day 1. Most sales leaders have never measured their team's voice. The numbers sting. That is the point.",
  },
  {
    step: "Practise",
    body: "Five minutes a day against your founder's pitch. Their words. Their objections. Their closes. Thirty sessions, four weekly check ins, a pod that holds them to it.",
  },
  {
    step: "Perform",
    body: "Week 1: team average 48. Week 2: 53. Week 3: 57. Week 4: 62. You hear it on live calls before you see it in the dashboard.",
  },
  {
    step: "Prove",
    body: "Day 30 retest. Team average 48 to 62. You can see it, share it and defend it in the board meeting.",
  },
];

const TESTIMONIALS = [
  { quote: "You are accomplishing in 30 days what it would take a year of coaching to learn.", name: "Marcus, VP of Sales" },
  { quote: "My team average went from 48 to 62. I showed my VP. She said how did you do that?", name: "David, Sales Manager" },
  { quote: "Every rep now pitches like our founder. Same words. Same confidence. Same closes.", name: "Lisa, Revenue Lead" },
  { quote: "We used to rely on two heroes to carry the number. Now every rep sounds like a closer.", name: "James, Head of Sales" },
];

const INCLUDED = [
  "Ten seats, 30 days of daily voice practice per rep",
  "Your founder's pitch cloned into roleplay scenarios",
  "Every session scored across four dimensions",
  "Manager dashboard with live team benchmarking",
  "Day 1 and Day 30 team report, printable for your VP",
  "Four weekly check ins and accountability pods",
];

const FAQS = [
  {
    q: "What is the 30 Day Team Voice Mastery Program?",
    a: "A 30 day voice training program for sales teams. Every rep practises daily against your founder's pitch with a Voice AI Mentor that listens, scores and gives real time feedback. You get a team benchmark on Day 1, weekly score movement, and a final report on Day 30.",
  },
  {
    q: "How does cloning your closer work?",
    a: "You upload your best pitch: words, pace, objection handling and closes. The Mentor turns that into roleplay scenarios and scores every rep against those patterns. Cloning means cloning the pitch and approach into practice scenarios, not cloning a literal voice or creating deepfakes.",
  },
  {
    q: "How much does it cost?",
    a: "$1,500 for 10 seats. That is $150 per rep for 30 days of daily practice, team benchmarking and a manager dashboard that proves the change.",
  },
  {
    q: "We already use a sales enablement tool, is this different?",
    a: "Yes. Enablement tools tell reps what to say. Bramwell trains how they say it. The Readiness Score measures structure, specificity, confidence signals and relevance, not just content.",
  },
  {
    q: "I have a sales kickoff in four weeks, can this work?",
    a: "That is exactly what the program is built for. Run it before the kickoff and walk in with a benchmarked team instead of a hope.",
  },
  {
    q: "Is there a manager dashboard?",
    a: "Yes. Every rep's daily practice, weekly score movement and the team benchmark, on one page you can print.",
  },
  {
    q: "What makes this different from hiring a sales coach?",
    a: "The global average for a communication coach is $244 an hour, per the ICF 2023 Global Coaching Study. For $150 a rep you get 30 days of daily practice against your own winning pitch, not one hour they forget in a week.",
  },
  {
    q: "How long is the program?",
    a: "30 days. Five minutes of practice a day per rep. Fifteen minute weekly check ins. Final team retest on Day 30.",
  },
];

function scrollToApply() {
  document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
}

function FoundersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    teamSize: "",
    role: "",
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.firstName || !form.lastName || !form.email || !form.company || !form.teamSize || !form.role) {
      setError("Please complete every field so we can review your application.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/public/klaviyo-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          eventName: "Applied, Enterprise Waitlist",
          pathway: "enterprise",
          source: "waitlist_page",
          properties: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            company: form.company.trim(),
            team_size: form.teamSize,
            role: form.role,
          },
        }),
      });
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
      <SiteNav ctaLabel="Audit my team" ctaHref="#apply" />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
            Bramwell for sales teams
          </span>

          <h1 className="mt-8 max-w-4xl text-balance text-[46px] font-semibold leading-[0.94] tracking-[-0.035em] sm:text-7xl md:text-[92px]">
            Your best closer is one person.
            <br />
            Make them everyone.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Every rep trains daily against your founder's pitch with their Voice AI Mentor. It
            listens, it scores, it never cancels. Thirty days later the whole team sounds like your
            top performer.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <CtaButton as="button" onClick={scrollToApply} size="lg" showIcon={false}>
              Audit my team
            </CtaButton>
            <span className="text-sm text-muted-foreground">
              Free team benchmark. No card. Cohort 1 starts {COHORT_START}.
            </span>
          </div>

          <dl className="mt-14 grid w-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border text-left sm:grid-cols-3">
            {[
              { k: "Date", v: `Cohort 1, starts ${COHORT_START}` },
              { k: "Format", v: "30 day program, manager dashboard, pods" },
              { k: "Price", v: "$1,500 for 10 seats" },
            ].map((row) => (
              <div key={row.k} className="bg-background px-5 py-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {row.k}
                </dt>
                <dd className="mt-2 text-sm font-medium">{row.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Big statement */}
      <section className="bg-foreground py-24 text-background md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-50">
            The real leak
          </p>
          <h2 className="mt-6 text-balance text-[38px] font-semibold leading-[0.98] tracking-[-0.03em] md:text-7xl">
            You do not have a lead problem.
            <br />
            You have a delivery problem.
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-70">
            The deck is fine. The pricing is fine. The deal dies in the first thirty seconds of the
            call, when the prospect decides whether this rep sounds like someone worth listening to.
            Nobody scores that. So nobody fixes it.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.n}>
                <p className="text-6xl font-semibold tracking-[-0.04em] md:text-7xl">{s.n}</p>
                <p className="mt-4 text-base font-medium leading-snug">{s.l}</p>
                <p className="mt-2 text-xs text-muted-foreground">{s.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Stop hiring and hoping.
            <br />
            Start cloning and closing.
          </h2>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {PILLARS.map((p) => (
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

      {/* Method */}
      <section className="border-b border-border bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            The Bramwell Method
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Four steps. Thirty days. One number that moves.
          </h2>
          <ol className="mt-16 grid gap-5 md:grid-cols-2">
            {METHOD.map((m, i) => (
              <li key={m.step} className="rounded-2xl border border-border bg-background p-8">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{m.step}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Proof band */}
      <section className="bg-foreground py-24 text-background md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <h2 className="text-balance text-center text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            The change is not a feeling.
            <br />
            It is a number.
          </h2>
          <div className="mt-16 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
            <div className="text-center md:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-50">
                Day 1 team average
              </p>
              <p className="mt-3 text-7xl font-semibold tracking-[-0.04em] opacity-50 md:text-8xl">48</p>
              <p className="mt-2 text-sm opacity-60">Two heroes carry the number</p>
            </div>
            <div aria-hidden className="text-center text-3xl opacity-40">
              →
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-50">
                Day 30 team average
              </p>
              <p className="mt-3 text-7xl font-semibold tracking-[-0.04em] md:text-8xl">62</p>
              <p className="mt-2 text-sm opacity-80">Every rep sounds like a closer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-5xl">
            What sales leaders say
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-background p-8">
                <blockquote className="text-lg leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Price */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
                $150 a rep.
                <br />
                Thirty days of practice.
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                One hour with a communication coach averages $244 and your reps forget it by Friday.
                This is daily practice against your own winning pitch, scored every session, for a
                month.
              </p>
              <div className="mt-10">
                <CtaButton as="button" onClick={scrollToApply} size="lg" showIcon={false}>
                  Audit my team
                </CtaButton>
              </div>
            </div>
            <div className="rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                30 Day Team Voice Mastery
              </p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-5xl font-semibold tracking-[-0.03em]">$1,500</span>
                <span className="text-sm text-muted-foreground">USD, 10 seats</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm">
                {INCLUDED.map((i) => (
                  <li key={i} className="flex gap-3 text-foreground/90">
                    <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-foreground" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="border-b border-border bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Get a free team assessment.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Tell us about your team. We benchmark your reps and show you exactly where the deals are
            leaking, before you spend a dollar.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-border bg-background p-8">
              <h3 className="text-2xl font-semibold tracking-tight">Application received.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We review every application by hand. If your team is a fit for Cohort 1 you will
                hear from us within two business days with your assessment details.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 rounded-2xl border border-border bg-background p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  First name
                  <input className={field} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
                </label>
                <label className="block text-sm font-medium">
                  Last name
                  <input className={field} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
                </label>
                <label className="block text-sm font-medium sm:col-span-2">
                  Work email
                  <input type="email" className={field} value={form.email} onChange={(e) => update("email", e.target.value)} />
                </label>
                <label className="block text-sm font-medium sm:col-span-2">
                  Company
                  <input className={field} value={form.company} onChange={(e) => update("company", e.target.value)} />
                </label>
                <label className="block text-sm font-medium">
                  Team size
                  <select className={field} value={form.teamSize} onChange={(e) => update("teamSize", e.target.value)}>
                    <option value="">Select</option>
                    {TEAM_SIZES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  Your role
                  <select className={field} value={form.role} onChange={(e) => update("role", e.target.value)}>
                    <option value="">Select</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {error ? <p className="mt-5 text-sm text-destructive">{error}</p> : null}

              <div className="mt-8">
                <CtaButton as="button" onClick={() => undefined} size="lg" showIcon={false} className="w-full">
                  {submitting ? "Sending" : "Audit my team"}
                </CtaButton>
                <button type="submit" className="sr-only">
                  Submit
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                We only use these details to review your team and send your assessment.
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
            Thirty days from now,
            <br />
            every rep sounds like your best one.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg opacity-70">
            Cohort 1 starts {COHORT_START}. Ten seats. $1,500.
          </p>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={scrollToApply}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-background px-9 text-base font-semibold text-foreground transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Audit my team <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
