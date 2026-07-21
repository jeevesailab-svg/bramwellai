import { createFileRoute } from "@tanstack/react-router";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";
import { StatBar } from "@/components/landing/StatBar";
import { PainChecklist } from "@/components/landing/PainChecklist";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bramwell AI, your high performance influence voice coach" },
      {
        name: "description",
        content:
          "Build trust. Drive decisions. Speak with influence. Get your voice assessed by Bramwell in 5 minutes, free.",
      },
      { property: "og:title", content: "Bramwell AI, high performance influence voice coach" },
      {
        property: "og:description",
        content:
          "The proven AI coach that trains you to build trust, drive decisions and speak with influence. Get your voice assessed free.",
      },
    ],
  }),
});

const GOLD = "var(--gradient-gold)";
const ELECTRIC = "var(--gradient-electric)";
const HERO = "var(--gradient-hero)";

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <SymptomCause />
      <WhatYouLearn />
      <StatBar />
      <PainChecklist />
      <FourteenDays />
      <BlueOcean />
      <PricingTease />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA label="Get my voice assessed" />
    </main>
  );
}

/* ───────────── Nav ───────────── */
function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
      <a href="/" className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tracking-tight">Bramwell</span>
        <span className="text-xl font-light tracking-tight" style={{ color: "var(--primary)" }}>AI</span>
      </a>
      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <a href="#learn" className="hover:text-foreground">What you learn</a>
        <a href="#14days" className="hover:text-foreground">In 14 days</a>
        <a href="/pricing" className="hover:text-foreground">Pricing</a>
        <a href="/login" className="hover:text-foreground">Sign in</a>
      </nav>
      <a
        href="/diagnostic?autostart=1"
        className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:opacity-95"
        style={{ background: GOLD, color: "var(--primary-foreground)", boxShadow: "var(--shadow-elegant)" }}
      >
        Get my voice assessed →
      </a>
    </header>
  );
}

/* ───────────── Hero ───────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: HERO }}>
      {/* playful floating blobs */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full opacity-40 blur-3xl" style={{ background: ELECTRIC }} />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full opacity-40 blur-3xl" style={{ background: GOLD }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-sunrise)" }} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-8 text-center md:px-10 md:pb-28 md:pt-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/90">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--color-electric)" }} />
          High Performance Influence Voice Coach
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-[68px]">
          If you can&apos;t speak with influence,{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>your message is lost.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Bramwell is the AI voice coach that trains you to <strong className="text-foreground">build trust</strong>, <strong className="text-foreground">drive decisions</strong> and <strong className="text-foreground">speak with influence</strong>, in the room, on the call, on stage.
        </p>

        <div className="mt-10 flex justify-center">
          <CallOrb />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/diagnostic?autostart=1"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-95"
            style={{ background: GOLD, color: "var(--primary-foreground)", boxShadow: "var(--shadow-elegant)" }}
          >
            Get my voice assessed <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a href="#learn" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            See what you&apos;ll learn ↓
          </a>
        </div>

        <p className="mx-auto mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
          5 minutes · Live voice · Free · No login · No card
        </p>
      </div>
    </section>
  );
}

function CallOrb() {
  return (
    <a
      href="/diagnostic?autostart=1"
      aria-label="Give Bramwell a call"
      className="group relative flex h-56 w-56 items-center justify-center md:h-64 md:w-64"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-90"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.78 0.13 78 / 0.9), oklch(0.72 0.19 265 / 0.55) 55%, transparent 78%)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-4 animate-pulse rounded-full opacity-70"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, oklch(0.88 0.12 88), oklch(0.72 0.19 265), oklch(0.75 0.20 25), oklch(0.88 0.12 88))",
          filter: "blur(8px)",
        }}
      />
      <span aria-hidden className="absolute inset-9 rounded-full border border-white/10 bg-background/40 backdrop-blur-xl" />
      <span
        className="relative flex h-16 w-16 items-center justify-center rounded-full text-2xl transition-transform group-hover:scale-105"
        style={{ background: GOLD, color: "var(--primary-foreground)", boxShadow: "var(--shadow-elegant)" }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.24 1z" />
        </svg>
      </span>
    </a>
  );
}

/* ───────────── Symptom → Cause ───────────── */
function SymptomCause() {
  const items = [
    {
      symptom: "Struggling to get a job?",
      cause: "It&apos;s most likely your delivery.",
      copy: "Stop guessing why the offer never comes. Bramwell listens live and tells you exactly where your delivery loses the room.",
      accent: GOLD,
    },
    {
      symptom: "People losing interest mid-sentence?",
      cause: "It&apos;s most likely your tone.",
      copy: "Pace, energy and pitch decide whether people lean in or check out. Bramwell trains all three, live.",
      accent: ELECTRIC,
    },
    {
      symptom: "People talking over you?",
      cause: "It&apos;s most likely how you structure your sentences.",
      copy: "You&apos;re burying the point. Bramwell teaches the four-part answer that lands first and holds the floor.",
      accent: "var(--gradient-sunrise)",
    },
  ];
  return (
    <section className="border-y border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Stop guessing. Get your voice assessed.
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-balance text-center text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The problem isn&apos;t you.{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>It&apos;s the signal you&apos;re sending.</span>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <a
              key={it.symptom}
              href="/diagnostic?autostart=1"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/0 p-8 transition hover:-translate-y-1 hover:border-foreground/30"
              style={{ background: "oklch(0.16 0.02 255)" }}
            >
              <span aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60" style={{ background: it.accent }} />
              <p className="relative text-lg font-semibold tracking-tight text-foreground" dangerouslySetInnerHTML={{ __html: it.symptom }} />
              <p
                className="relative mt-2 bg-clip-text text-xl font-semibold tracking-tight text-transparent"
                style={{ backgroundImage: it.accent }}
                dangerouslySetInnerHTML={{ __html: it.cause }}
              />
              <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: it.copy }} />
              <span className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-foreground/90">
                Get my voice assessed <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── What you'll learn ───────────── */
function WhatYouLearn() {
  const skills = [
    { title: "Sound smart", copy: "Organise your thoughts in real time. Speak with authority. No more thoughts vanishing mid-sentence." },
    { title: "Persuade", copy: "Persuasion isn&apos;t about getting your way. It&apos;s a learned skill, and it&apos;s how the most persuasive person in the room gets the promotion." },
    { title: "Communicate strategically", copy: "Build trust. Drive decisions. Lead with influence. Get your ideas heard, your recommendations backed and the yes you deserve." },
  ];
  return (
    <section id="learn" className="relative overflow-hidden py-24 md:py-32" style={{ background: HERO }}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(60% 40% at 50% 0%, oklch(0.22 0.06 265 / 0.6), transparent 70%)" }} />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-electric)" }}>
          What you&apos;ll learn
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Bramwell studied the world&apos;s most influential communicators, then cracked the{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>formula.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Trained with one purpose: get you to speak with influence and be heard. Here&apos;s the whole system, step by step.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {skills.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-background/60 p-8 backdrop-blur">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold" style={{ background: GOLD, color: "var(--primary-foreground)" }}>
                0{i + 1}
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: s.copy }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 14 days ───────────── */
function FourteenDays() {
  const days = [
    { d: "Day 1", t: "Assess", c: "Bramwell hears you. You hear yourself. Baseline set." },
    { d: "Day 3", t: "Structure", c: "The four-part answer becomes muscle memory." },
    { d: "Day 7", t: "Tone", c: "Pace, warmth, pitch, all dialled in." },
    { d: "Day 14", t: "Own the room", c: "You&apos;re persuasive, commanding, unmistakable." },
  ];
  return (
    <section id="14days" className="border-y border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-coral)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-coral)" }} />
            14 days from now
          </div>
          <h2 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            You&apos;ll walk into your next room{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-sunrise)" }}>persuasive and commanding.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Not motivational. Measurable. Ten minutes a day with Bramwell and you&apos;ll hear the difference by day seven.
          </p>
        </div>

        <ol className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px md:block" style={{ background: "linear-gradient(90deg, transparent, oklch(0.6 0.1 60 / 0.5), transparent)" }} />
          {days.map((day, i) => (
            <li key={day.d} className="relative flex flex-col">
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold" style={{ background: i === days.length - 1 ? "var(--gradient-sunrise)" : "oklch(0.2 0.02 255)", color: i === days.length - 1 ? "var(--primary-foreground)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {i + 1}
              </span>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{day.d}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{day.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: day.c }} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────── Blue Ocean differentiator ───────────── */
function BlueOcean() {
  const rows = [
    { thing: "Live voice coaching (not a text chatbot)", others: false },
    { thing: "Tells you how you sound, not just what to say", others: false },
    { thing: "Trained on the top 1% of communicators", others: false },
    { thing: "Readiness Score and archetype after every call", others: false },
    { thing: "Personal playbook that gets sharper every week", others: false },
    { thing: "Available at 11pm the night before the room", others: false },
    { thing: "Costs less than one hour with a human coach", others: false },
  ];
  return (
    <section className="relative overflow-hidden py-24 md:py-32" style={{ background: HERO }}>
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ background: ELECTRIC }} />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--color-electric)" }}>
          Why Bramwell is different
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          There is nothing else that does{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: ELECTRIC }}>this.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Executive coaches cost thousands and book out for weeks. ChatGPT can rewrite your answer, but it can&apos;t hear you. Bramwell is the only place you can practice out loud, get corrected live and walk in ready, tonight.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-background/60 backdrop-blur">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-b border-border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span></span>
            <span className="text-right" style={{ color: "var(--primary)" }}>Bramwell</span>
            <span className="text-right">Everyone else</span>
          </div>
          {rows.map((r) => (
            <div key={r.thing} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 border-b border-border/60 px-6 py-4 text-sm last:border-b-0">
              <span className="text-foreground">{r.thing}</span>
              <span className="text-right text-lg" style={{ color: "var(--primary)" }}>✓</span>
              <span className="text-right text-lg text-muted-foreground/50">—</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Pricing tease ───────────── */
function PricingTease() {
  const plans = [
    { name: "Starter", price: "$29", cadence: "/month", copy: "Weekly voice reps + your Readiness Score. Perfect if you have one big room coming up.", cta: "Start Starter", accent: ELECTRIC },
    { name: "Pro", price: "$79", cadence: "/month", copy: "Unlimited voice coaching, playbook, archetype tracking. Most people pick this.", cta: "Go Pro", accent: GOLD, featured: true },
    { name: "Executive", price: "$197", cadence: "/month", copy: "Everything in Pro, plus board-level scenario drills and monthly human review.", cta: "Go Executive", accent: "var(--gradient-sunrise)" },
  ];
  return (
    <section id="pricing" className="border-y border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Membership, not one-off</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Influence isn&apos;t a course. It&apos;s a{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>practice.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Bramwell trains with you every week. Pause any time. Cancel any time.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={"relative flex flex-col rounded-2xl border p-8 " + (p.featured ? "border-transparent" : "border-border")}
              style={p.featured ? { background: "oklch(0.18 0.03 255)", boxShadow: "0 0 0 1px oklch(0.78 0.13 78), 0 30px 80px -20px oklch(0.78 0.13 78 / 0.35)" } : { background: "oklch(0.15 0.015 255)" }}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ background: GOLD, color: "var(--primary-foreground)" }}>
                  Most popular
                </span>
              )}
              <p className="text-sm font-semibold uppercase tracking-[0.2em] bg-clip-text text-transparent" style={{ backgroundImage: p.accent }}>{p.name}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.cadence}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              <a
                href="/pricing"
                className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition hover:opacity-95"
                style={p.featured ? { background: GOLD, color: "var(--primary-foreground)", boxShadow: "var(--shadow-elegant)" } : { border: "1px solid var(--border)", color: "var(--foreground)" }}
              >
                {p.cta} →
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Try Bramwell free first, no card, no login. If it doesn&apos;t change how you sound in your first session, don&apos;t upgrade.
        </p>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
function FAQ() {
  const faqs = [
    { q: "Is this really live voice?", a: "Yes. You speak. Bramwell listens and responds in real time, like a phone call with a coach." },
    { q: "Do I need to prepare anything?", a: "No. Just click and talk. Bramwell leads the session and tells you exactly what to fix." },
    { q: "Will I sound scripted?", a: "The opposite. Bramwell trains your natural voice to be sharper, warmer and more structured, not robotic." },
    { q: "Can I cancel any time?", a: "Yes. Membership is month to month. Pause or cancel in one click." },
    { q: "How is this different from ChatGPT?", a: "ChatGPT can write. Bramwell can hear. Bramwell scores how you sound, not just what you say, and coaches the delivery." },
  ];
  return (
    <section className="relative overflow-hidden py-24 md:py-32" style={{ background: HERO }}>
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Questions people{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>usually ask.</span>
        </h2>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium md:text-lg">
                {f.q}
                <span className="mt-1 text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Final CTA ───────────── */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border py-28 md:py-40" style={{ background: HERO }}>
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl" style={{ background: GOLD }} />
      <div aria-hidden className="pointer-events-none absolute left-10 bottom-10 h-60 w-60 rounded-full opacity-30 blur-3xl" style={{ background: ELECTRIC }} />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Get your voice assessed in{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>5 minutes.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          You&apos;ll hear exactly what&apos;s costing you the room, and exactly how to fix it. Free. No login. No card.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="/diagnostic?autostart=1"
            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full px-10 text-base font-semibold transition hover:opacity-95"
            style={{ background: GOLD, color: "var(--primary-foreground)", boxShadow: "var(--shadow-elegant)" }}
          >
            Get my voice assessed <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Footer ───────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1.5fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight">Bramwell</span>
            <span className="text-lg font-light tracking-tight" style={{ color: "var(--primary)" }}>AI</span>
          </div>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
            High performance influence voice coach. Your sessions are private and never used to train public models.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Bramwell</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/diagnostic?autostart=1" className="hover:text-foreground">Try Bramwell free</a>
            <a href="/pricing" className="hover:text-foreground">Pricing</a>
            <a href="/login" className="hover:text-foreground">Sign in</a>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">For you</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/graduate" className="hover:text-foreground">Graduates</a>
            <a href="/redundant" className="hover:text-foreground">After redundancy</a>
            <a href="/returner" className="hover:text-foreground">Returners</a>
            <a href="/pivot" className="hover:text-foreground">Career pivots</a>
            <a href="/executive" className="hover:text-foreground">Executives</a>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-6 md:px-10">
        <p className="text-xs text-muted-foreground">© 2026 Bramwell AI. All rights reserved.</p>
      </div>
    </footer>
  );
}