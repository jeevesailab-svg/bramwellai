import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter } from "@/components/site/SiteChrome";
import { CtaButton } from "@/components/site/CtaButton";

export const Route = createFileRoute("/founders")({
  component: FoundersPage,
  head: () => ({
    meta: [
      { title: "Elite Sales Team Accelerator | Bramwell for Founder-Led Businesses" },
      {
        name: "description",
        content:
          "Bramwell analyses your highest-performing sales conversations, documents how your best people win business, and builds a private AI coaching platform that trains every salesperson to the same standard.",
      },
      { property: "og:title", content: "Build the Sales Team That Drives Your Next Stage of Growth" },
      {
        property: "og:description",
        content:
          "A done-for-you implementation programme. Your sales methodology, documented and turned into daily AI coaching for every salesperson.",
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

/** Before / after contrast used for the Current vs New Sales Team diagram. */
const CONTRAST: { label: string; current: string; next: string }[] = [
  {
    label: "Sales methodology",
    current: "Lives in the founder's head",
    next: "Documented, taught and measurable",
  },
  {
    label: "Questions asked",
    current: "Different in every conversation",
    next: "One proven questioning framework",
  },
  {
    label: "Onboarding",
    current: "Shadow someone and hope",
    next: "Structured daily practice from day one",
  },
  {
    label: "Coaching",
    current: "When the manager finds time",
    next: "Every salesperson, every day",
  },
  {
    label: "Performance visibility",
    current: "Pipeline reports after the fact",
    next: "Live view of who is improving and where",
  },
  {
    label: "Revenue",
    current: "Carried by a handful of individuals",
    next: "Produced by a repeatable sales system",
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

const FAQS = [
  {
    q: "What is the Elite Sales Team Accelerator?",
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
    q: "Who is it not for?",
    a: "Businesses without a sales team yet, or leaders looking for a one-off workshop. This is an implementation programme for founder-led businesses scaling beyond themselves.",
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
      <SiteNav ctaLabel="Apply now" ctaHref="#apply" />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:px-10 md:pb-24 md:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
            Elite Sales Team Accelerator
          </span>

          <h1 className="mt-8 max-w-4xl text-balance text-[44px] font-semibold leading-[0.96] tracking-[-0.035em] sm:text-6xl md:text-[84px]">
            Build the sales team that drives your next stage of growth.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            The market has changed. Guesswork will not build a high-performing sales team. Bramwell
            analyses your highest-performing sales conversations, documents how your best people win
            business, and builds a private AI coaching platform that trains every salesperson to the
            same standard.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <CtaButton as="button" onClick={scrollToApply} size="lg" showIcon={false}>
              Apply now
            </CtaButton>
            <span className="text-sm text-muted-foreground">
              Applications reviewed by hand. Limited implementations each quarter.
            </span>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="bg-foreground py-24 text-background md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-50">
            Where founder-led businesses build high-performing sales teams
          </p>
          <h2 className="mt-6 text-balance text-[38px] font-semibold leading-[0.98] tracking-[-0.03em] md:text-7xl">
            Growth eventually exposes every inconsistency.
          </h2>
          <ul className="mt-10 max-w-2xl space-y-4 text-lg leading-relaxed opacity-70">
            {[
              "Different salespeople ask different questions.",
              "Different conversations produce different outcomes.",
              "Revenue becomes dependent on a handful of individuals instead of a repeatable sales system.",
            ].map((l) => (
              <li key={l} className="flex gap-4">
                <span aria-hidden className="mt-3 inline-block h-1.5 w-1.5 flex-none rounded-full bg-background/60" />
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-2xl font-semibold tracking-tight md:text-3xl">
            Hope is not a sales strategy.
          </p>
        </div>
      </section>

      {/* Current vs New Sales Team diagram */}
      <section className="border-b border-border py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            This is what your next stage of growth looks like
          </p>
          <h2 className="mt-6 max-w-3xl text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            One sales team before. A different company after.
          </h2>

          <div className="mt-14 overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-[220px_1fr_1fr]">
              <div className="hidden bg-muted px-6 py-5 md:block" />
              <div className="bg-muted px-6 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Current sales team
                </p>
              </div>
              <div className="bg-foreground px-6 py-5 text-background">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">
                  New sales team
                </p>
              </div>

              {CONTRAST.map((row) => (
                <div key={row.label} className="contents">
                  <div className="bg-background px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {row.label}
                    </p>
                  </div>
                  <div className="bg-background px-6 py-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">{row.current}</p>
                  </div>
                  <div className="bg-foreground/[0.03] px-6 py-5">
                    <p className="text-sm font-medium leading-relaxed">{row.next}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 max-w-3xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Elite Sales Team Accelerator is Bramwell's done-for-you implementation programme. We
              analyse your highest-performing sales conversations, interview your founder and top
              performers, document your sales methodology, and build a private AI coaching platform
              that trains every salesperson using your products, your customers and your sales
              process.
            </p>
            <p className="mt-6 text-lg font-medium leading-relaxed">
              Built for implementation. Designed to become the standard your team sells to every day.
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="border-b border-border bg-muted py-24 md:py-32">
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
              Apply now
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

      {/* Apply */}
      <section id="apply" className="border-b border-border bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <h2 className="text-balance text-[38px] font-semibold leading-[1] tracking-[-0.03em] md:text-6xl">
            Apply for an implementation.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Tell us about your sales team. We review every application by hand and take on a limited
            number of implementations each quarter.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-border bg-background p-8">
              <h3 className="text-2xl font-semibold tracking-tight">Application received.</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We review every application by hand. If your business is a fit you will hear from us
                within two business days to arrange the qualification call.
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
                  Sales team size
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
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full text-base font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--gradient-cta)", boxShadow: "var(--shadow-cta)" }}
                >
                  {submitting ? "Sending" : "Apply now"} <span>→</span>
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
              Apply now <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
