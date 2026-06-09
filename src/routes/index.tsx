import { createFileRoute } from "@tanstack/react-router";
import { StatBar } from "@/components/landing/StatBar";
import { PainChecklist } from "@/components/landing/PainChecklist";
import { GraduationCap, RefreshCcw, TrendingUp, Award } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bramwell AI — Command the room. Be the one they remember." },
      {
        name: "description",
        content:
          "Bramwell is the always-on AI communication coach for high-stakes career moments. Sound as capable as you are.",
      },
      { property: "og:title", content: "Bramwell AI — Command the room." },
      {
        property: "og:description",
        content:
          "Always-on AI communication coaching for interviews, promotions, and the moments that matter.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <StatBar />
      <PainChecklist />
      <WhoFor />
      <Problem />
      <HowItWorks />
      <Pathways />
      <AlwaysOn />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a href="/" className="flex items-baseline gap-1.5">
          <span className="text-xl font-semibold tracking-tight">Bramwell</span>
          <span
            className="text-xl font-light tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            AI
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="/pricing" className="transition-colors hover:text-foreground">Pricing</a>
          <a href="/login" className="transition-colors hover:text-foreground">Sign in</a>
        </nav>
        <a
          href="/diagnostic"
          className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-foreground/5 px-5 text-sm font-medium backdrop-blur transition hover:bg-foreground/10"
        >
          Free diagnostic
        </a>
      </header>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.78 0.13 78 / 0.4), transparent)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-32 pt-20 text-center md:px-10 md:pb-40 md:pt-32">
        <p
          className="mb-6 text-sm font-medium uppercase tracking-[0.22em] md:text-base"
          style={{
            backgroundImage: "var(--gradient-gold)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Command the room. Be the one they remember.
        </p>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          You are more capable than you sound{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            under pressure.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Bramwell is your private AI voice coach — trained on the world's
          leading communication experts to help you win interviews, earn
          promotions, and own every high-stakes moment.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground/90 md:text-lg">
          The version of you that walks into that room and owns it — that is who Bramwell builds.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/diagnostic?autostart=1"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-95"
            style={{
              background: "var(--gradient-gold)",
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Take the test — free, 5 minutes
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href="/pricing"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-foreground/5 px-7 text-sm font-medium backdrop-blur transition hover:bg-foreground/10"
          >
            See pathways
          </a>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          <span className="sm:hidden">3 minutes · No credit card</span>
          <span className="hidden sm:inline">
            3 minutes · No credit card · Find out what is holding your voice back
          </span>
        </p>
      </div>
    </section>
  );
}

/* ───────────── Problem ───────────── */
function WhoFor() {
  const cards = [
    {
      Icon: GraduationCap,
      title: "First serious interview.",
      body: "You've got the skills. Now make the room feel it in the first 90 seconds.",
    },
    {
      Icon: RefreshCcw,
      title: "Back after a break.",
      body: "You haven't interviewed in years. Everything has changed. Bramwell gets you back up to speed — fast.",
    },
    {
      Icon: TrendingUp,
      title: "Mid-career pivot.",
      body: "You've done the work. Now translate it into the language of the role you actually want.",
    },
    {
      Icon: Award,
      title: "Executive and C-suite.",
      body: "Every sentence is measured in millions. Calibrate your presence before the room does it for you.",
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Who is this for?
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Built for the moment{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            you're in.
          </span>
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {cards.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-foreground/[0.02] p-7 transition hover:border-foreground/20 hover:bg-foreground/[0.04]"
            >
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border"
                style={{ color: "var(--primary)" }}
              >
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          The gap
        </p>
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          You're brilliant on paper. But the room only hears the{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            first ninety seconds.
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Most coaching is generic, expensive, and gone the moment you hang up.
          Bramwell listens, asks the questions you'll actually face, and
          rehearses with you until the answer lives in your voice — not on a
          script.
        </p>
      </div>
    </section>
  );
}

/* ───────────── How it works ───────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Take the free diagnostic",
      body: "Five minutes with Bramwell. Hear your communication type, your three biggest gaps, and your Readiness Score. No login, no card.",
    },
    {
      n: "02",
      title: "Choose your pathway",
      body: "Graduate Sprint, Career Comeback, Interview Confidence Sprint, or Executive Communication Sprint. Built for your specific situation and level.",
    },
    {
      n: "03",
      title: "Practice with Bramwell",
      body: "Live two-way voice coaching. You speak. Bramwell listens. Coaches the single most important fix. You retry. Bramwell does not move on until the answer is genuinely ready.",
    },
  ];
  return (
    <section
      id="how"
      className="relative border-t border-border py-24 md:py-32"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Three steps between you and the room.
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-background p-8 md:p-10">
              <div
                className="text-sm font-medium tracking-[0.2em]"
                style={{ color: "var(--primary)" }}
              >
                {s.n}
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Pathways ───────────── */
function Pathways() {
  const pathways = [
    {
      name: "The Graduate",
      for: "First serious interview",
      price: "$99 AUD",
      cadence: "one-time",
      blurb: "Land the role that sets the next ten years in motion.",
    },
    {
      name: "The Comeback",
      for: "Returning to work",
      price: "$199 AUD",
      cadence: "one-time",
      blurb: "Rebuild fluency, authority, and presence on your own terms.",
    },
    {
      name: "The Confidence",
      for: "Mid-career pivot",
      price: "$249 AUD",
      cadence: "one-time",
      blurb: "Translate what you've already done into the language of the next role.",
    },
    {
      name: "The Executive",
      for: "Board rooms & C-suite",
      price: "$499 AUD",
      cadence: "one-time",
      blurb: "Calibrate every sentence for stakes measured in millions.",
    },
    {
      name: "The Club",
      for: "Always-on access",
      price: "$79 AUD",
      cadence: "per month",
      blurb: "Bramwell stays with you — for every interview, every pitch, every year.",
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Five pathways
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Coaching tuned to the moment you're in.
            </h2>
          </div>
          <a
            href="/pricing"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-foreground/5 px-6 text-sm font-medium transition hover:bg-foreground/10"
          >
            Compare pathways →
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pathways.map((p, i) => (
            <div
              key={p.name}
              className={`group rounded-2xl border border-border bg-foreground/[0.02] p-7 transition hover:border-foreground/20 hover:bg-foreground/[0.04] ${
                i === pathways.length - 1 ? "lg:col-span-1 md:col-span-2" : ""
              }`}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {p.for}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {p.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-xs text-muted-foreground">{p.cadence}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p.blurb}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Testimonials ───────────── */
function Testimonials() {
  return TestimonialsImpl();
}

function AlwaysOn() {
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          The always-on coach
        </p>
        <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Courses teach you once.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            Bramwell trains you daily.
          </span>
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-foreground/[0.02] p-7 transition hover:border-foreground/20 hover:bg-foreground/[0.04]">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              The Intensive
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              One moment. Coached until ready.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Sprint for the interview, the promotion, the media appearance,
              the board presentation. We rehearse it until the answer lives
              in your voice.
            </p>
          </div>
          <div
            className="rounded-2xl border p-7 transition"
            style={{
              borderColor: "oklch(0.78 0.13 78 / 0.35)",
              background: "oklch(0.78 0.13 78 / 0.06)",
            }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              The Club — $79 AUD / month
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              Your always-on coach. For life.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              After the intensive, Bramwell stays with you. New job intro.
              Performance review. Pay rise conversation. Media interview.
              Every high-stakes moment. One coach. For life.
            </p>
          </div>
        </div>

        <blockquote
          className="mt-12 border-l-2 pl-6 text-lg italic leading-relaxed text-foreground/90 md:text-xl"
          style={{ borderColor: "var(--primary)" }}
        >
          "You do not rise to the occasion. You fall to the level of your
          rehearsal. Bramwell makes rehearsal part of your life."
        </blockquote>
      </div>
    </section>
  );
}

function TestimonialsImpl() {
  const quotes = [
    {
      q: "I walked in knowing exactly how I sounded. That changed everything.",
      a: "Director, FTSE 100 — promotion panel",
    },
    {
      q: "It's the only coach that's there at 11pm the night before.",
      a: "Senior PM — Series B fintech",
    },
    {
      q: "Within two sessions my answers stopped wandering. I got the offer.",
      a: "Returning to work after maternity leave",
    },
  ];
  return (
    <section
      className="relative border-t border-border py-24 md:py-32"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          What people say
        </p>
        <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The conversations that change careers.
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((t, i) => (
            <figure
              key={i}
              className="flex h-full flex-col rounded-2xl border border-border bg-background/60 p-8 backdrop-blur"
            >
              <div
                className="text-3xl leading-none"
                style={{ color: "var(--primary)" }}
              >
                "
              </div>
              <blockquote className="mt-3 flex-1 text-lg font-medium leading-snug tracking-tight">
                {t.q}
              </blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t.a}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
function FAQ() {
  const faqs = [
    {
      q: "Is this an AI, a human coach, or both?",
      a: "Bramwell is a private AI coach with the calibre of a senior executive communications partner. It listens, asks, and responds in real time — available the moment you need it.",
    },
    {
      q: "How long is a session?",
      a: "Sessions are timed to your pathway — typically 15 to 30 minutes. Enough to rehearse the hardest questions without losing your voice.",
    },
    {
      q: "Is my data private?",
      a: "Yes. Your CV, your job spec, and your recordings are stored privately to your account and never used to train public models.",
    },
    {
      q: "What if I'm not in the UK?",
      a: "Bramwell works wherever the conversation matters. Native English coaching, available globally.",
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_2fr] md:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Questions worth asking.
          </h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium tracking-tight">
                {f.q}
                <span className="mt-0.5 text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
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
    <section
      className="relative overflow-hidden border-t border-border py-28 md:py-40"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Sound as capable
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            as you already are.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Take the free 5-minute diagnostic. Hear where you stand. Then decide.
        </p>
        <a
          href="/diagnostic"
          className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-95"
          style={{
            background: "var(--gradient-gold)",
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          Take the test
          <span>→</span>
        </a>
      </div>
    </section>
  );
}

/* ───────────── Footer ───────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-10">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-semibold tracking-tight">Bramwell</span>
          <span
            className="text-base font-light tracking-tight"
            style={{ color: "var(--primary)" }}
          >
            AI
          </span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="/diagnostic" className="transition-colors hover:text-foreground">Free diagnostic</a>
          <a href="/pricing" className="transition-colors hover:text-foreground">Pricing</a>
          <a href="/login" className="transition-colors hover:text-foreground">Sign in</a>
          <a href="/signup" className="transition-colors hover:text-foreground">Sign up</a>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bramwell AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
