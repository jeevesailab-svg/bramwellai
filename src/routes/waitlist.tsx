import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter, GoldText } from "@/components/site/SiteChrome";
import { CtaButton } from "@/components/site/CtaButton";

export const Route = createFileRoute("/waitlist")({
  component: WaitlistPage,
  head: () => ({
    meta: [
      { title: "Bramwell for Sales Teams, Apply for the September intake" },
      {
        name: "description",
        content:
          "Clone your best closer. Bramwell studies your top performer and trains every rep on your team to do the same. Applications only. Limited spots.",
      },
      { property: "og:title", content: "Bramwell for Sales Teams, Apply for the September intake" },
      {
        property: "og:description",
        content:
          "Clone your best closer. Build an army of closers. Waitlist pricing for founding teams. Application required.",
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
    icon: "🎯",
    title: "The Methodology",
    body: "Your team learns the exact influence and persuasion formula used by the world's top sales performers. Structured, repeatable, scoreable.",
  },
  {
    icon: "🎙️",
    title: "Live Practice Sessions",
    body: "Reps practise real objection handling, discovery and closing conversations with Bramwell before they cost you a live deal.",
  },
  {
    icon: "📊",
    title: "Team Performance Scores",
    body: "Every session scored. Every rep tracked. You see exactly who is ready and who needs work, before the next pipeline review.",
  },
  {
    icon: "⚡",
    title: "Live in One Day",
    body: "No IT. No procurement. No 6 month onboarding. Bramwell Sales Coach is running for your team within 24 hours of signing.",
  },
  {
    icon: "🔒",
    title: "Waitlist Pricing",
    body: "Founding members lock in pricing significantly below public launch. First in, best deal. Never repeated.",
  },
  {
    icon: "🤝",
    title: "Personal Onboarding",
    body: "Every accepted team gets a personal onboarding call. We configure Bramwell to your playbook, your ICP and your objections.",
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
      <SiteNav ctaLabel="Apply for access" ctaHref="#apply" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--primary)" }} />
              Bramwell for Sales Teams, By Application
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              Clone your best closer.
              <br />
              <GoldText>Build an army of closers.</GoldText>
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
              Bramwell High Performance Sales Coach studies your top performer, extracts exactly what they do differently, and trains every rep on your team to do the same. Until closing is no longer a personality. It's a system.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-white/70 px-3 py-1">September intake</span>
              <span className="rounded-full border border-border bg-white/70 px-3 py-1">12 teams selected</span>
              <span className="rounded-full border border-border bg-white/70 px-3 py-1">Founding pricing, locked forever</span>
            </div>
            <div className="mt-10">
              <CtaButton as="button" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })} size="md">
                Apply for the waitlist
              </CtaButton>
            </div>
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
                  {submitting ? "Submitting…" : "Join the Waitlist"}
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
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Founding members only</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              What waitlist members
              <br />
              <GoldText>get first.</GoldText>
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

      {/* Final CTA */}
      <section className="border-b border-border bg-background py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            The next intake closes when we hit <GoldText>12 teams.</GoldText>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            After that, founding pricing is gone and the waitlist re opens for the following quarter.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButton as="button" onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })} size="md">
              Apply for the waitlist
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