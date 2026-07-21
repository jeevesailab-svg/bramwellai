import { createFileRoute } from "@tanstack/react-router";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";
import { StatBar } from "@/components/landing/StatBar";
import { PainChecklist } from "@/components/landing/PainChecklist";
import { BramwellLogo } from "@/components/site/BramwellLogo";
import { CtaButton } from "@/components/site/CtaButton";
import { Mic, Sparkles, Zap, MessageCircle, Rocket, Target, Heart, Star, Wand2, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bramwell.ai — Speak like the best in the room" },
      {
        name: "description",
        content:
          "The fun, live AI voice coach that trains you to speak with confidence, structure and influence. Talk to Bramwell free.",
      },
      { property: "og:title", content: "Bramwell.ai — Speak like the best in the room" },
      {
        property: "og:description",
        content:
          "Live AI voice coach. Talk. Get feedback. Sound like the best leaders in the room. Free to try.",
      },
    ],
  }),
});

const GOLD = "var(--gradient-gold)";
const ELECTRIC = "var(--gradient-electric)";
const HERO = "var(--gradient-hero)";
const MINT = "var(--gradient-mint)";
const SUNRISE = "var(--gradient-sunrise)";

function PrimaryCTA({ label = "Talk to Bramwell free", href = "/diagnostic?autostart=1", size = "md" as "md" | "lg" | "sm" }) {
  return <CtaButton href={href} size={size}>{label}</CtaButton>;
}

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
      <StickyMobileCTA label="Talk to Bramwell free" />
    </main>
  );
}

/* ───────────── Nav ───────────── */
function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
      <a href="/" className="flex items-center">
        <BramwellLogo size={32} />
      </a>
      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <a href="#learn" className="hover:text-foreground">What you learn</a>
        <a href="#14days" className="hover:text-foreground">In 14 days</a>
        <a href="/pricing" className="hover:text-foreground">Pricing</a>
        <a href="/login" className="hover:text-foreground">Sign in</a>
      </nav>
      <PrimaryCTA size="sm" />
    </header>
  );
}

/* ───────────── Hero ───────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: HERO }}>
      {/* playful floating blobs, brighter & softer */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full opacity-60 blur-3xl" style={{ background: ELECTRIC }} />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full opacity-60 blur-3xl" style={{ background: SUNRISE }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" style={{ background: MINT }} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-8 text-center md:px-10 md:pb-28 md:pt-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground shadow-sm backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
          Your AI voice coach · Live · Free to try
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-[72px]">
          Speak like the{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>best in the room.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Bramwell is your live AI voice coach. Talk to him. Hear what the room hears. Train to sound clear, calm and <strong className="text-foreground">impossible to ignore</strong>.
        </p>

        <div className="mt-10 flex justify-center">
          <CallOrb />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <PrimaryCTA size="lg" />
          <a href="#learn" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            See what you&apos;ll learn ↓
          </a>
        </div>

        <p className="mx-auto mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          5 min · Live voice · Free · No login · No card
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
        className="absolute inset-0 rounded-full opacity-80 blur-2xl transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.72 0.22 40 / 0.9), oklch(0.66 0.24 340 / 0.65) 45%, oklch(0.68 0.19 265 / 0.4) 70%, transparent 82%)",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-4 animate-pulse rounded-full opacity-80"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, oklch(0.85 0.18 90), oklch(0.72 0.22 40), oklch(0.66 0.24 340), oklch(0.68 0.19 265), oklch(0.72 0.16 175), oklch(0.85 0.18 90))",
          filter: "blur(8px)",
        }}
      />
      <span aria-hidden className="absolute inset-9 rounded-full border border-white bg-white/70 backdrop-blur-xl" />
      <span
        className="relative flex h-16 w-16 items-center justify-center rounded-full text-2xl transition-transform group-hover:scale-105"
        style={{ background: GOLD, color: "white", boxShadow: "var(--shadow-elegant)" }}
      >
        <Mic className="h-7 w-7" strokeWidth={2.5} />
      </span>
    </a>
  );
}

/* ───────────── Symptom → Cause ───────────── */
function SymptomCause() {
  const items = [
    { icon: Target, symptom: "Struggling to get a job?", cause: "It&apos;s most likely your delivery.", copy: "Bramwell listens live and tells you exactly where your delivery loses the room.", accent: GOLD },
    { icon: Heart, symptom: "People losing interest mid-sentence?", cause: "It&apos;s most likely your tone.", copy: "Pace, energy and pitch decide whether people lean in or check out. Bramwell trains all three, live.", accent: ELECTRIC },
    { icon: MessageCircle, symptom: "People talking over you?", cause: "It&apos;s most likely how you structure your sentences.", copy: "You&apos;re burying the point. Bramwell teaches the four-part answer that lands first and holds the floor.", accent: SUNRISE },
  ];
  return (
    <section className="border-y border-border bg-white py-20 md:py-28">
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
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:border-primary/40"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <span aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-2xl transition group-hover:opacity-70" style={{ background: it.accent }} />
              <span
                aria-hidden
                className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                style={{ background: it.accent, boxShadow: "var(--shadow-soft)" }}
              >
                <it.icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <p className="relative text-lg font-semibold tracking-tight text-foreground" dangerouslySetInnerHTML={{ __html: it.symptom }} />
              <p
                className="relative mt-2 bg-clip-text text-xl font-semibold tracking-tight text-transparent"
                style={{ backgroundImage: it.accent }}
                dangerouslySetInnerHTML={{ __html: it.cause }}
              />
              <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: it.copy }} />
              <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--primary)" }}>
                <Mic className="h-3.5 w-3.5" strokeWidth={2.5} /> Talk to Bramwell free <span className="transition-transform group-hover:translate-x-0.5">→</span>
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
  const skills: { icon: typeof Wand2; title: string; copy: string; accent: string }[] = [
    { icon: Wand2, title: "Sound smart", copy: "Organise your thoughts in real time. Speak with authority. No more thoughts vanishing mid-sentence.", accent: SUNRISE },
    { icon: Zap, title: "Persuade", copy: "Persuasion isn&apos;t about getting your way. It&apos;s a learned skill, and it&apos;s how the most persuasive person in the room gets the promotion.", accent: GOLD },
    { icon: Trophy, title: "Communicate strategically", copy: "Build trust. Drive decisions. Lead with influence. Get your ideas heard, your recommendations backed and the yes you deserve.", accent: ELECTRIC },
  ];
  return (
    <section id="learn" className="relative overflow-hidden py-24 md:py-32" style={{ background: HERO }}>
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--primary)" }}>
          <Star className="h-3.5 w-3.5" /> What you&apos;ll learn
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Bramwell studied the world&apos;s most influential communicators, then cracked the{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>formula.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Trained with one purpose: get you to speak with influence and be heard. Here&apos;s the whole system, step by step.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {skills.map((s) => (
            <div key={s.title} className="relative rounded-3xl border border-border bg-white/90 p-8 backdrop-blur transition hover:-translate-y-1" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: s.accent, boxShadow: "var(--shadow-soft)" }}>
                <s.icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: s.copy }} />
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <PrimaryCTA />
        </div>
      </div>
    </section>
  );
}

/* ───────────── 14 days ───────────── */
function FourteenDays() {
  const days: { d: string; t: string; c: string; icon: typeof Mic; accent: string }[] = [
    { d: "Day 1", t: "Assess", c: "Bramwell hears you. You hear yourself. Baseline set.", icon: Mic, accent: ELECTRIC },
    { d: "Day 3", t: "Structure", c: "The four-part answer becomes muscle memory.", icon: Target, accent: MINT },
    { d: "Day 7", t: "Tone", c: "Pace, warmth, pitch, all dialled in.", icon: Wand2, accent: SUNRISE },
    { d: "Day 14", t: "Own the room", c: "You&apos;re persuasive, commanding, unmistakable.", icon: Trophy, accent: GOLD },
  ];
  return (
    <section id="14days" className="border-y border-border bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--color-coral)" }}>
            <Rocket className="h-3.5 w-3.5" /> 14 days from now
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
          <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px md:block" style={{ background: "var(--gradient-rainbow)", opacity: 0.5 }} />
          {days.map((day) => (
            <li key={day.d} className="relative flex flex-col">
              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: day.accent, boxShadow: "var(--shadow-soft)" }}>
                <day.icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">{day.d}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{day.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground" dangerouslySetInnerHTML={{ __html: day.c }} />
            </li>
          ))}
        </ol>
        <div className="mt-14 flex justify-center">
          <PrimaryCTA />
        </div>
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
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full opacity-50 blur-3xl" style={{ background: MINT }} />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full opacity-50 blur-3xl" style={{ background: SUNRISE }} />
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--primary)" }}>
          <Sparkles className="h-3.5 w-3.5" /> Why Bramwell is different
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          There is nothing else that does{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: ELECTRIC }}>this.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Executive coaches cost thousands and book out for weeks. ChatGPT can rewrite your answer, but it can&apos;t hear you. Bramwell is the only place you can practice out loud, get corrected live and walk in ready, tonight.
        </p>

        <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-white/90 backdrop-blur" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-b border-border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span></span>
            <span className="text-right" style={{ color: "var(--primary)" }}>Bramwell</span>
            <span className="text-right">Everyone else</span>
          </div>
          {rows.map((r) => (
            <div key={r.thing} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 border-b border-border/60 px-6 py-4 text-sm last:border-b-0">
              <span className="text-foreground">{r.thing}</span>
              <span className="text-right text-lg" style={{ color: "var(--primary)" }}>✓</span>
              <span className="text-right text-lg text-muted-foreground/40">—</span>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <PrimaryCTA />
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
    { name: "Executive", price: "$197", cadence: "/month", copy: "Everything in Pro, plus board-level scenario drills and monthly human review.", cta: "Go Executive", accent: SUNRISE },
  ];
  return (
    <section id="pricing" className="border-y border-border bg-white py-24 md:py-32">
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
              className={"relative flex flex-col rounded-3xl border p-8 transition hover:-translate-y-1 " + (p.featured ? "border-transparent" : "border-border")}
              style={p.featured ? { background: "white", boxShadow: "0 0 0 2px var(--primary), var(--shadow-elegant)" } : { background: "white", boxShadow: "var(--shadow-soft)" }}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white" style={{ background: GOLD }}>
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
                className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition hover:-translate-y-0.5"
                style={p.featured ? { background: GOLD, color: "white", boxShadow: "var(--shadow-elegant)" } : { border: "1px solid var(--border)", color: "var(--foreground)", background: "white" }}
              >
                <Sparkles className="h-3.5 w-3.5" /> {p.cta} →
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
        <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-white/90 px-6 backdrop-blur" style={{ boxShadow: "var(--shadow-soft)" }}>
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
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl" style={{ background: GOLD }} />
      <div aria-hidden className="pointer-events-none absolute left-10 bottom-10 h-60 w-60 rounded-full opacity-50 blur-3xl" style={{ background: MINT }} />
      <div aria-hidden className="pointer-events-none absolute right-10 top-10 h-60 w-60 rounded-full opacity-50 blur-3xl" style={{ background: ELECTRIC }} />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Ready to sound like the{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>best in the room?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Talk to Bramwell for 5 minutes. Hear exactly what&apos;s costing you the room, and exactly how to fix it. Free. No login. No card.
        </p>
        <div className="mt-10 flex justify-center">
          <PrimaryCTA size="lg" />
        </div>
      </div>
    </section>
  );
}

/* ───────────── Footer ───────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-white py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1.5fr_1fr_1fr] md:px-10">
        <div>
          <BramwellLogo size={28} />
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Your live AI voice coach. Speak like the best in the room. Your sessions are private and never used to train public models.
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