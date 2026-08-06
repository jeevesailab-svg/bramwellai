import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter, GoldText } from "@/components/site/SiteChrome";
import { CtaButton } from "@/components/site/CtaButton";

export const Route = createFileRoute("/founders")({
  component: WaitlistPage,
  head: () => ({
    meta: [
      { title: "30 Day Team Voice Mastery Program | Bramwell your Voice AI Mentor" },
      {
        name: "description",
        content:
          "Your Voice AI Mentor in every rep's pocket. Clone your founder. Build an army of closers. 30 days, manager dashboard, team benchmarking. $1,500 for 10 seats.",
      },
      { property: "og:title", content: "30 Day Team Voice Mastery Program | Bramwell your Voice AI Mentor" },
      {
        property: "og:description",
        content:
          "Every rep trains daily against your founder's pitch with their Voice AI Mentor. Team benchmark on Day 1, proof on Day 30.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

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

const BENEFITS = [
  {
    icon: "🧬",
    title: "Clone your founder's pitch",
    body: "Bramwell your Voice AI Mentor turns your founder's words, pace, objections and closes into daily practice every rep trains against.",
  },
  {
    icon: "🎯",
    title: "Master the art of closing",
    body: "Win any deal by uncovering the secret behind how prospects decide to listen. Your Mentor rehearses with every rep until they own it.",
  },
  {
    icon: "📈",
    title: "Gain a competitive edge",
    body: "Create a comprehensive voice strategy to target your ideal prospects and build pipeline, guided by your Mentor every step.",
  },
  {
    icon: "🎙️",
    title: "Take charge of your team's presence",
    body: "Use proven insights from your Mentor to steer your reps through any call, objection or conversation.",
  },
  {
    icon: "⚡",
    title: "Stay ahead of the competition",
    body: "Build a team that is differentiated and adaptable no matter the market. Your Mentor adapts practice as each rep grows.",
  },
  {
    icon: "🗺️",
    title: "Create a map for your team",
    body: "Your Mentor builds a flexible, results driven plan so you hit your revenue goals faster.",
  },
];

const PILLARS = [
  {
    title: "Personalised attention",
    body: "Bramwell your Voice AI Mentor runs live practice sessions with every rep, listening, scoring and building a plan for each rep's exact gaps. Your manager dashboard tracks it all.",
  },
  {
    title: "Practical strategies",
    body: "Improve your team's tone, pace and confidence immediately, with real time feedback from the Mentor after every practice session.",
  },
  {
    title: "Immersive experiences",
    body: "This is not passive training. Your reps speak with their Voice AI Mentor daily. It listens. It scores. They adjust.",
  },
  {
    title: "Empowering discoveries",
    body: "Break the cycle of reps freezing on calls, with a Mentor that never judges, never gets impatient, and is always available.",
  },
];

const METHOD = [
  {
    step: "Diagnose",
    body: "Every rep takes the free test and speaks with their Voice AI Mentor for 5 minutes. You get a team benchmark report on Day 1. Most sales leaders have never measured their team's voice. The numbers might sting. That is the point.",
  },
  {
    step: "Practise",
    body: "Five minutes a day with their Voice AI Mentor. Every rep trains against your founder's pitch: their words, their pace, their objections, their closes. 30 sessions. 4 weekly check ins. A pod that holds them to it.",
  },
  {
    step: "Perform",
    body: "Week by week every rep's score moves. Week 1: team average 48. Week 2: 53. Week 3: 57. Week 4: 62. You see the difference in your next pipeline review.",
  },
  {
    step: "Prove",
    body: "Day 30. Every rep retakes the diagnostic with their Voice AI Mentor. Team average went from 48 to 62. You can see it. You can share it with your VP. You can prove it.",
  },
];

const TESTIMONIALS = [
  { quote: "You are accomplishing in 30 days what it would probably take a year of coaching to learn.", name: "Marcus, VP of Sales" },
  { quote: "My team's average score went from 48 to 62. I showed my VP. She said how did you do that?", name: "David, Sales Manager" },
  { quote: "Every rep on my team now pitches like our founder. Same words. Same confidence. Same closes.", name: "Lisa, Revenue Lead" },
  { quote: "We used to rely on one or two heroes to carry the number. Now every rep sounds like a closer.", name: "James, Head of Sales" },
];

const FAQS = [
  {
    q: "What is the 30 Day Team Voice Mastery Program?",
    a: "A 30 day structured voice training program for sales teams with a Voice AI Mentor. Every rep practises daily against your founder's pitch with their Mentor, an AI that listens, scores and gives real time feedback. You get a team benchmark on Day 1, weekly score updates, and a final report on Day 30 that proves the transformation.",
  },
  {
    q: "Who is it for?",
    a: "VPs and sales managers, founders and revenue leaders, anyone who wants their team to pitch like their top performer. If your reps freeze on calls, lose deals in the first 30 seconds, or sound nothing like your founder, this is for you.",
  },
  {
    q: "How does the founder cloning work?",
    a: "You upload your founder's best pitch: their words, pace, objection handling and closes. Bramwell's Voice AI Mentor turns that into roleplay scenarios every rep trains against, scores their responses against your founder's patterns, and gives real time feedback. Cloning means cloning the pitch, words and approach into AI practice scenarios, not cloning a literal voice or creating deepfakes.",
  },
  {
    q: "What can I expect my team to learn?",
    a: "Daily voice practice with their Voice AI Mentor, scored across four dimensions: Structure, Specificity, Confidence Signals and Relevance. Weekly check ins that track every rep's score, a manager dashboard with team benchmarking, and a before and after Readiness Score for every rep.",
  },
  {
    q: "How long is the program?",
    a: "30 days. Daily practice takes 5 minutes per rep. Weekly check ins take 15 minutes. The full program runs across 4 weeks with a final team retest on Day 30.",
  },
  {
    q: "How much does it cost?",
    a: "$1,500 for 10 seats. That is $150 per rep for 30 days of daily practice, team benchmarking, and a manager dashboard that proves the change.",
  },
  {
    q: "We already use a sales enablement tool, is this different?",
    a: "Yes. Sales enablement tools tell your reps what to say. Bramwell trains how they say it. The Readiness Score measures tone, pace, confidence signals and structure, not just content. Most enablement tools do not score voice. Bramwell does.",
  },
  {
    q: "I have a sales kickoff in 4 weeks, can this work?",
    a: "That is exactly what the program is designed for. Run it before the kickoff. Every rep's score moves before the event and you walk in with a benchmarked team.",
  },
  {
    q: "Is there a manager dashboard?",
    a: "Yes. You see every rep's daily practice, weekly score movement and team benchmark. Week 2: average 48. Week 4: average 62. Printable one pager for your VP.",
  },
  {
    q: "What makes this different from hiring a sales coach?",
    a: "The global average for a communication coach is $244 per hour, per the ICF 2023 Global Coaching Study. For $150 per rep, every rep gets 30 days of daily practice with their Voice AI Mentor against your founder's pitch, not one hour of coaching they forget in a week. The Mentor is always available and never cancels.",
  },
];

function WaitlistPage() {
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel="Audit my team now" ctaHref="#apply" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--primary)" }} />
              Bramwell for Sales Teams
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              30 Day <GoldText>Team Voice Mastery</GoldText> Program
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
              Your Voice AI Mentor in every rep's pocket. Clone your founder. Build an army of closers.
            </p>
            <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground">
              Get the concrete strategies and tools that have transformed thousands of sales teams at
              every stage. Your Voice AI Mentor trains every rep daily against your founder's pitch.
            </p>
            <div className="mt-9">
              <CtaButton as="button" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })} size="lg" showIcon={false} showArrow={false}>
                Audit my team now ↓
              </CtaButton>
            </div>
            <dl className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border text-left sm:grid-cols-3">
              {[
                { k: "Date", v: "Cohort 1, starts 15 August 2026" },
                { k: "Format", v: "30 day online program, manager dashboard, pods" },
                { k: "Price", v: "$1,500 for 10 seats" },
              ].map((row) => (
                <div key={row.k} className="bg-white/80 px-5 py-4 backdrop-blur">
                  <dt className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{row.k}</dt>
                  <dd className="mt-1 text-sm font-medium">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-b border-border py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:px-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">About</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Your Voice AI Mentor. <GoldText>Every rep. Every day.</GoldText>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Bramwell your Voice AI Mentor in every rep's pocket, training them on the system for
              sustainable sales transformation. They speak. It listens. It scores. Every day for 30 days.
            </p>
          </div>
          <div className="flex aspect-video items-center justify-center rounded-3xl border border-border bg-white shadow-sm">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">Watch video</span>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="border-b border-border bg-white py-20 md:py-28" style={{ boxShadow: "var(--shadow-soft)" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1.1fr_1fr] md:px-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Step 1 of 1, Application</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              We select 12 teams per intake.
              <br />
              <GoldText>Tell us why yours should be one.</GoldText>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              Every application is reviewed by our team. We onboard teams personally, so we cap each intake to protect the quality of the coaching. If you fit, we'll be in touch within 48 hours.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3"><span style={{ color: "var(--primary)" }}>✓</span> No commitment required to apply</li>
              <li className="flex items-start gap-3"><span style={{ color: "var(--primary)" }}>✓</span> September intake, limited spots</li>
              <li className="flex items-start gap-3"><span style={{ color: "var(--primary)" }}>✓</span> Personal onboarding included</li>
              <li className="flex items-start gap-3"><span style={{ color: "var(--primary)" }}>✓</span> Founding pricing, locked forever</li>
            </ul>
          </div>

          {submitted ? (
            <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
              <div className="text-4xl">🎉</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">Application received.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Thank you, {form.firstName}. Our team reviews every application personally. If {form.company} is a fit for the September intake, we'll be in touch within 48 hours from a real human, not an automation.
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Position on the list</p>
              <p className="mt-1 text-xl font-semibold">Reviewing, priority queue</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-background p-6 shadow-sm md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="First Name" placeholder="James" value={form.firstName} onChange={(v) => update("firstName", v)} />
                <Field label="Last Name" placeholder="Chen" value={form.lastName} onChange={(v) => update("lastName", v)} />
                <Field label="Work Email" type="email" placeholder="james@company.com" value={form.email} onChange={(v) => update("email", v)} className="md:col-span-2" />
                <Field label="Company" placeholder="Acme Inc." value={form.company} onChange={(v) => update("company", v)} className="md:col-span-2" />
                <Select label="Team Size" placeholder="Select team size" options={TEAM_SIZES} value={form.teamSize} onChange={(v) => update("teamSize", v)} />
                <Select label="Your Role" placeholder="Select your role" options={ROLES} value={form.role} onChange={(v) => update("role", v)} />
              </div>
              {error && <p className="mt-4 text-sm" style={{ color: "var(--destructive, #b00020)" }}>{error}</p>}
              <div className="mt-6">
                <CtaButton as="button" size="md" className={submitting ? "opacity-60" : ""}>
                  {submitting ? "Submitting…" : "Audit my team now"}
                </CtaButton>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>No commitment required</span>
                <span>September intake, limited spots</span>
                <span>Personal onboarding included</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Key benefits</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Your Voice AI Mentor in every rep's pocket, training them on the system for{" "}
              <GoldText>sustainable sales transformation.</GoldText>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-3xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-border bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Change your team's voice and your <GoldText>revenue.</GoldText>
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PILLARS.map((p) => (
              <article key={p.title} className="rounded-3xl border border-border bg-background p-7">
                <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="border-b border-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">The Bramwell Method for teams</p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Your Mentor trains every rep against your founder's pitch, scores every response, and{" "}
            <GoldText>proves every rep's progress.</GoldText>
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-2">
            {METHOD.map((m, i) => (
              <li key={m.step} className="rounded-3xl border border-border bg-white p-7 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--primary)" }}>0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">{m.step}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <p className="rounded-3xl border border-border bg-white p-7 text-sm leading-relaxed text-muted-foreground">
              41% of your reps want more roleplay. Only 26% are getting it. That gap is costing you deals.
              <span className="mt-2 block text-xs">Source: Salesforce State of Sales 2026</span>
            </p>
            <p className="rounded-3xl border border-border bg-white p-7 text-sm leading-relaxed text-muted-foreground">
              Snowflake eliminated 1,215 manager hours per quarter with AI roleplay. Your team is next.
              <span className="mt-2 block text-xs">Source: Yoodli case study</span>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border bg-white py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            See what others are saying
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-border bg-background p-7">
                <blockquote className="text-base leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border py-20 md:py-24">
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
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b border-border bg-background py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Break through to the next level in your <GoldText>team's voice.</GoldText>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            Stop hiring and hoping. Start cloning and closing. $1,500 for 10 seats, 30 days, proof on Day 30.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButton as="button" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })} size="md">
              Audit my team now ↓
            </CtaButton>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={200}
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-foreground/40"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-foreground/40"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}