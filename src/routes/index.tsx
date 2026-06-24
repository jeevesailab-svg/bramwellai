import { createFileRoute } from "@tanstack/react-router";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bramwell AI — The AI communication coach for career-defining conversations" },
      {
        name: "description",
        content:
          "Practise out loud. Get your Readiness Score. Fix the answers, habits and blind spots that could cost you the role. Free 5-minute diagnostic — no login, no card.",
      },
      {
        property: "og:title",
        content: "Bramwell AI — Know exactly how you sound before the room decides for you",
      },
      {
        property: "og:description",
        content:
          "Live AI voice coaching for interviews, promotions and high-stakes conversations. Free 5-minute Readiness Score.",
      },
    ],
  }),
});

const GOLD = "var(--gradient-gold)";
const HERO = "var(--gradient-hero)";

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <WrongWay />
      <NotCapable />
      <EliteCoach />
      <FreeDiagnostic />
      <AnswerSharper />
      <HowItWorks />
      <NotInterviewPrep />
      <Pathways />
      <AfterBramwell />
      <SevenQuestions />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}

/* ───────────── Nav ───────────── */
function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      <a href="/" className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tracking-tight">Bramwell</span>
        <span className="text-xl font-light tracking-tight" style={{ color: "var(--primary)" }}>
          AI
        </span>
      </a>
      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <a href="#how" className="transition-colors hover:text-foreground">How It Works</a>
        <a href="#pathways" className="transition-colors hover:text-foreground">Pathways</a>
        <a href="/pricing" className="transition-colors hover:text-foreground">Pricing</a>
        <a href="/login" className="transition-colors hover:text-foreground">Sign In</a>
      </nav>
      <a
        href="/diagnostic?autostart=1"
        className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:opacity-95"
        style={{
          background: GOLD,
          color: "var(--primary-foreground)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        Get Your Free Readiness Score →
      </a>
    </header>
  );
}

/* ───────────── Hero ───────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: HERO }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: GOLD }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-12 text-center md:px-10 md:pb-40 md:pt-20">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--primary)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
          Free 5-minute diagnostic · No login · No card
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Fix the exact habit that's costing you the{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            room.
          </span>
        </h1>

        <div className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          <p>
            Bramwell coaches you out loud — on the exact questions you'll face, in real time, until the right answer lives in your voice. Not on a script. Available the night before. No booking. No $400/session coach. No ChatGPT answer that falls apart the moment they go off-script.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/diagnostic?autostart=1"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-95 sm:w-auto"
            style={{
              background: GOLD,
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Find out what's costing you the room — free, 5 minutes
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        <p className="mx-auto mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground/80 md:text-sm">
          5 minutes · No login · No credit card · Hear exactly what is holding you back
        </p>
      </div>
    </section>
  );
}

/* ───────────── Most people prepare wrong ───────────── */
function WrongWay() {
  return (
    <section className="border-y border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The answers that get people{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            chosen.
          </span>
        </h2>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p className="font-medium text-foreground">Most people prepare for interviews the wrong way.</p>
          <ul className="space-y-2">
            <li>They think through answers in their head.</li>
            <li>They write notes they will never say naturally.</li>
            <li>They ask friends who are too kind to tell the truth.</li>
            <li>They watch generic advice that has nothing to do with their role, level or pressure point.</li>
          </ul>
          <p className="font-medium text-foreground">Then the room starts.</p>
          <p>
            And the answer that sounded strong in their mind comes out vague, rushed, too junior, too long, too modest or completely off point.
          </p>
          <p className="font-medium text-foreground">Bramwell changes that.</p>
          <p>
            You speak your answers out loud. Bramwell listens. It shows you what the panel hears — then coaches you until the answer is sharper, clearer and ready.
          </p>
          <p>
            Not scripted.
            <br />
            Not rehearsed.
            <br />
            Not robotic.
          </p>
          <p className="font-medium text-foreground">You, at your best, under pressure.</p>
        </div>

        <div className="mt-10">
          <a
            href="/diagnostic?autostart=1"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
            style={{
              background: GOLD,
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Take the free diagnostic →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── You are not losing because you are not capable ───────────── */
function NotCapable() {
  return (
    <section className="relative border-t border-border py-24 md:py-32" style={{ background: HERO }}>
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          You are not losing because you are{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            not capable.
          </span>
        </h2>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>You may be experienced. Qualified. Intelligent. Ready.</p>
          <p>But if your answers do not land, the room does not experience your capability.</p>
          <p className="font-medium text-foreground">They experience uncertainty.</p>
          <ul className="space-y-2">
            <li>They hear the rambling.</li>
            <li>They hear the hesitation.</li>
            <li>They hear the answer that never quite gets to the point.</li>
            <li>They hear the career gap before they hear the value.</li>
            <li>They hear effort instead of authority.</li>
            <li>They hear potential instead of proof.</li>
          </ul>
          <p className="font-medium text-foreground">That is what costs people the role.</p>
          <p>
            Not always the CV.
            <br />
            Not always the experience.
            <br />
            Not always the competition.
          </p>
          <p>Sometimes it is the way you sound when it matters.</p>
          <p className="font-medium text-foreground">
            Bramwell helps you fix that before the panel hears it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Every elite performer has a coach ───────────── */
function EliteCoach() {
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Every elite performer has{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            a coach.
          </span>
        </h2>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <ul className="space-y-2">
            <li>Athletes have coaches.</li>
            <li>Executives have coaches.</li>
            <li>Founders have pitch coaches.</li>
            <li>Leaders have media coaches.</li>
            <li>Top candidates have interview coaches.</li>
          </ul>
          <p>But most people only realise they need that level of preparation when the interview is already close.</p>
          <ul className="space-y-2">
            <li>The $5,000 executive coach is booked for weeks.</li>
            <li>Your friend cannot judge senior-level answers.</li>
            <li>Generic AI can help you write something, but it cannot tell you how you sound saying it.</li>
          </ul>
          <p className="font-medium text-foreground">Bramwell gives you the missing layer.</p>
          <ul className="space-y-2">
            <li>Live voice coaching.</li>
            <li>Real-time correction.</li>
            <li>Answer-specific feedback.</li>
            <li>A private Readiness Score.</li>
            <li>Available tonight.</li>
          </ul>
          <p>The coaching layer that used to sit at the top of the market — now available before the room sees you.</p>
        </div>
        <div className="mt-10">
          <a
            href="/diagnostic?autostart=1"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
            style={{
              background: GOLD,
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Get Your Free Readiness Score →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Free diagnostic explainer ───────────── */
function FreeDiagnostic() {
  const gaps = [
    "Whether your answer actually answers the question",
    "Where you ramble",
    "Where you sound too junior",
    "Where your structure breaks",
    "Where your confidence drops",
    "Where your examples lack proof",
    "Where you undersell your value",
    "Where the panel may start to doubt you",
  ];
  return (
    <section className="relative border-t border-border py-24 md:py-32" style={{ background: HERO }}>
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The free diagnostic shows you what is{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            costing you the room.
          </span>
        </h2>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            In five minutes, Bramwell listens to how you answer under pressure and gives you a Readiness Score.
          </p>
          <p>It identifies the three biggest gaps in the way you communicate, including:</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {gaps.map((g) => (
              <li key={g} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <p>
            No login.
            <br />
            No credit card.
            <br />
            No awkward human judgement.
          </p>
          <p className="font-medium text-foreground">
            Just the truth about how you are coming across — while there is still time to fix it.
          </p>
        </div>
        <div className="mt-10">
          <a
            href="/diagnostic?autostart=1"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
            style={{
              background: GOLD,
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Take the free diagnostic →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Answer sharper. Sound senior. Get chosen. ───────────── */
function AnswerSharper() {
  const moments = [
    "The interview.",
    "The final panel.",
    "The promotion conversation.",
    "The pay rise.",
    "The career comeback.",
    "The boardroom.",
    "The media interview.",
    "The internal pitch.",
    "The room where you need to sound like the person they can trust.",
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <h2 className="text-balance text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          ANSWER SHARPER.
          <br />
          SOUND SENIOR.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            GET CHOSEN.
          </span>
        </h2>
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Bramwell is built for the moments where communication changes the outcome.
        </p>
        <ul className="mt-8 grid gap-2 text-base text-muted-foreground md:grid-cols-2 md:text-lg">
          {moments.map((m) => (
            <li key={m} className="flex items-start gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "var(--primary)" }} />
              <span>{m}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>It does not just help you find the right words.</p>
          <p className="font-medium text-foreground">
            It helps you become clear, calm, specific and credible when the pressure is real.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── How Bramwell works ───────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Run the free diagnostic",
      body: `Five minutes with Bramwell. You'll hear your communication style, your three biggest gaps, and a Readiness Score — a clear benchmark of where you stand right now versus where you need to be. No login. No credit card. No pitch call after.`,
      cta: { label: "Take the free diagnostic →", href: "/diagnostic?autostart=1" },
    },
    {
      n: "02",
      title: "Choose your pathway",
      body: `Graduate Sprint, Career Comeback, Interview Confidence, or Executive Communication. Each pathway is built for your exact situation — not a template that fits everyone and changes no one.`,
    },
    {
      n: "03",
      title: "Fix the one thing that matters most",
      body: `Bramwell does not overwhelm you with generic feedback. It gives you the most important fix first. You retry. It listens again. You improve again. The loop continues until the answer sounds ready — not memorised. Owned.`,
    },
  ];
  return (
    <section id="how" className="relative border-t border-border py-24 md:py-32" style={{ background: HERO }}>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            How Bramwell{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
              works.
            </span>
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col bg-background p-8 md:p-10">
              <div className="text-sm font-medium tracking-[0.2em]" style={{ color: "var(--primary)" }}>
                {s.n}
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              {s.cta && (
                <a
                  href={s.cta.href}
                  className="mt-6 inline-flex h-10 w-fit items-center justify-center rounded-full px-5 text-sm font-semibold transition hover:opacity-95"
                  style={{
                    background: GOLD,
                    color: "var(--primary-foreground)",
                  }}
                >
                  {s.cta.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── This is not interview prep ───────────── */
function NotInterviewPrep() {
  const rows = [
    {
      a: "Interview prep gives you tips.",
      b: "Bramwell gives you reps.",
    },
    {
      a: "Generic AI helps you write answers.",
      b: "Bramwell helps you say them.",
    },
    {
      a: `A friend tells you, "That sounded good."`,
      b: `Bramwell tells you where you lost the point, sounded uncertain, missed the commercial impact or failed to answer the real question.`,
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          This is not interview prep. It is{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            communication performance training.
          </span>
        </h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {rows.map((r, i) => (
            <div key={i} className="grid gap-4 py-8 md:grid-cols-2 md:gap-12">
              <p className="text-base text-muted-foreground md:text-lg">{r.a}</p>
              <p className="text-base font-medium text-foreground md:text-lg">{r.b}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>Because the room does not choose the person with the best notes.</p>
          <p className="font-medium text-foreground">It chooses the person who makes them feel certain.</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Pathways ───────────── */
type Pathway = {
  name: string;
  price: string;
  headline: string;
  body: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

function Pathways() {
  const pathways: Pathway[] = [
    {
      name: "The Graduate",
      price: "$99 AUD one-time",
      headline: "For your first serious interviews — the ones that shape the next decade.",
      body: [
        "You may have potential, but the room needs to hear readiness.",
        "Bramwell helps you answer like someone who understands the role, the company and the standard expected — not like someone hoping to be given a chance.",
        "You will practise the questions graduates actually get asked, build stronger examples and learn how to sound clear, prepared and employable.",
      ],
      cta: "Start The Graduate Pathway →",
      href: "/pricing",
    },
    {
      name: "The Comeback",
      price: "$199 AUD one-time",
      headline:
        "For returning to work, recovering after redundancy, explaining a gap or interviewing for the first time in years.",
      body: [
        "You have experience. But if you sound uncertain, outdated or apologetic, the panel may quietly question whether you are ready.",
        "Bramwell helps you turn your story into a clear, current and confident narrative.",
        "The gap does not become the whole interview. The redundancy does not define you. The time away does not weaken your value.",
        "You walk in knowing how to explain it — and move the room back to what you bring.",
      ],
      cta: "Start The Comeback Pathway →",
      href: "/pricing",
    },
    {
      name: "The Confidence",
      price: "$249 AUD one-time",
      headline: "For capable professionals who keep getting close but not chosen.",
      body: [
        "You have the experience. You have the results. You know you can do the role.",
        "But your answers may still sound like the level you are leaving, not the level you want.",
        "Bramwell helps you reposition your experience so it sounds more senior, more commercial and more aligned to the opportunity in front of you.",
        "You learn how to turn experience into evidence, responsibility into leadership and scattered examples into a compelling reason to choose you.",
      ],
      cta: "Start The Confidence Pathway →",
      href: "/pricing",
    },
    {
      name: "The Executive",
      price: "$499 AUD one-time",
      headline: "For senior appointments, board conversations, C-suite panels and high-stakes leadership opportunities.",
      body: [
        "At this level, everyone has experience. The difference is judgement, authority, clarity and presence.",
        "Bramwell helps you sharpen your leadership narrative, strategic value, commercial impact and executive register — privately.",
        "No one needs to know you are preparing. But the room will know you did.",
      ],
      cta: "Start The Executive Pathway →",
      href: "/pricing",
    },
    {
      name: "The Club",
      price: "$79 AUD per month",
      headline: "For professionals who know the interview never really ends.",
      body: [
        "Your career doesn't stop between interviews. Neither does Bramwell. One subscription. Every conversation, every pitch, every year — for as long as you want to keep winning rooms.",
      ],
      cta: "Join The Club →",
      href: "/pricing",
      featured: true,
    },
  ];
  return (
    <section id="pathways" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Choose the pathway for the{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            room you are walking into.
          </span>
        </h2>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          A private communications coach charges $400–600 per session. They're booked weeks out. They're not available the night before.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pathways.map((p) => (
            <article
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition ${
                p.featured
                  ? "md:col-span-2"
                  : "border-border bg-foreground/[0.02] hover:border-foreground/20 hover:bg-foreground/[0.04]"
              }`}
              style={
                p.featured
                  ? {
                      borderColor: "oklch(0.78 0.13 78 / 0.5)",
                      background: "oklch(0.78 0.13 78 / 0.06)",
                      boxShadow: "var(--shadow-elegant)",
                    }
                  : undefined
              }
            >
              {p.featured && (
                <span
                  className="absolute -top-3 left-8 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    background: GOLD,
                    color: "var(--primary-foreground)",
                  }}
                >
                  Most Popular
                </span>
              )}
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{p.name}</h3>
                <span className="text-sm font-medium text-muted-foreground">{p.price}</span>
              </div>
              <p className="mt-4 text-base font-medium leading-snug tracking-tight text-foreground md:text-lg">
                {p.headline}
              </p>
              <div className="mt-4 flex-1 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {p.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <a
                href={p.href}
                className="mt-6 inline-flex h-11 w-fit items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
                style={{
                  background: GOLD,
                  color: "var(--primary-foreground)",
                  boxShadow: p.featured ? "var(--shadow-elegant)" : undefined,
                }}
              >
                {p.cta}
              </a>
              {p.featured && (
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Most members who start on a one-time pathway move to The Club within 60 days. Because the conversations don't stop.
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── What changes after Bramwell ───────────── */
function AfterBramwell() {
  const knows = [
    "You know where the point is.",
    "You know what proof to use.",
    "You know how to explain the gap.",
    "You know how to sound senior.",
    "You know how to stop rambling.",
    "You know how to recover when pressure hits.",
    "You know how to make the room feel certain.",
  ];
  return (
    <section className="relative border-t border-border py-24 md:py-32" style={{ background: HERO }}>
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          What changes after{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            Bramwell?
          </span>
        </h2>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>You stop hoping your answer will land.</p>
          <p className="text-2xl font-semibold text-foreground md:text-3xl">You know.</p>
          <ul className="space-y-2">
            {knows.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <p className="font-medium text-foreground">That is what preparation is supposed to do.</p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 7 Questions Guide ───────────── */
function SevenQuestions() {
  const qs = [
    "Tell me about yourself",
    "Why this role?",
    "Why should we choose you?",
    "What is your weakness?",
    "Tell me about a time you failed",
    "Why are you leaving?",
    "Do you have any questions for us?",
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <p
          className="text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: "var(--primary)" }}
        >
          Not ready to speak yet?
        </p>
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The 7 Questions Every Panel Asks —{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            And What They Are Really Testing.
          </span>
        </h2>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>Most candidates answer the question they hear.</p>
          <p className="font-medium text-foreground">The best candidates answer the question underneath it.</p>
          <p>Get the free guide and learn what panels are really listening for when they ask:</p>
          <ul className="space-y-2">
            {qs.map((q) => (
              <li key={q} className="flex items-start gap-2">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href="/the-7-questions"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
            style={{
              background: GOLD,
              color: "var(--primary-foreground)",
            }}
          >
            Get the Free Guide →
          </a>
          <span className="text-xs text-muted-foreground/80">Free guide. No card required.</span>
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
function FAQ() {
  const faqs = [
    {
      q: "Is Bramwell an AI or a human coach?",
      a: `Bramwell is an AI communication and interview coach. It helps you practise out loud, analyses how your answers land and gives you specific coaching to improve.`,
    },
    {
      q: "Is this better than using ChatGPT?",
      a: `ChatGPT can help you write an answer. Bramwell helps you perform it. That means it focuses on how you sound out loud — your structure, clarity, confidence, seniority, pace and whether the answer actually lands.`,
    },
    {
      q: "Can I use it the night before an interview?",
      a: `Yes. Bramwell is built for the moment most people realise they need help — when the interview is close and the stakes are real.`,
    },
    {
      q: "Is my data private?",
      a: `Your sessions are private. Your voice recordings are yours. Bramwell does not use your private sessions to train public models.`,
    },
    {
      q: "What if I do not know which pathway to choose?",
      a: `Start with the free diagnostic. Bramwell will show you where you are now and what kind of coaching you need next.`,
    },
    {
      q: "Is this only for interviews?",
      a: `No. Interviews are the first use case because they are urgent and high-stakes. But Bramwell is built for career-defining communication: promotions, pay rises, board conversations, media training, investor pitches, performance reviews and any room where how you speak changes the outcome.`,
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_2fr] md:px-10">
        <div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            FAQ
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            The questions worth asking before you walk in.
          </p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium tracking-tight">
                {f.q}
                <span className="mt-0.5 text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{f.a}</p>
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
      style={{ background: HERO }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: GOLD }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          The room will decide how ready you sound.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: GOLD }}>
            Bramwell lets you find out first.
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Take the free 5-minute diagnostic and hear what your answers are really signalling — before the panel, before the pressure, before it costs you the opportunity.
        </p>
        <a
          href="/diagnostic?autostart=1"
          className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-95"
          style={{
            background: GOLD,
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          Get Your Free Readiness Score →
        </a>
        <p className="mt-6 text-xs text-muted-foreground/80 md:text-sm">
          5 minutes. No login. No credit card.
        </p>
        <p className="mt-4 text-xs text-muted-foreground/80 md:text-sm">
          Or{" "}
          <a
            href="/the-7-questions"
            className="underline-offset-4 hover:text-foreground hover:underline"
            style={{ color: "var(--primary)" }}
          >
            read the 7 questions every panel asks →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ───────────── Footer ───────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.5fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight">Bramwell</span>
            <span className="text-lg font-light tracking-tight" style={{ color: "var(--primary)" }}>
              AI
            </span>
          </div>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
            The AI communication and interview coach for career-defining conversations.
          </p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Your data is private. Your voice recordings are yours. Bramwell does not use your private sessions to train public models.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Bramwell</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/diagnostic?autostart=1" className="transition-colors hover:text-foreground">Free Diagnostic</a>
            <a href="/the-7-questions" className="transition-colors hover:text-foreground">The 7 Questions (Free Guide)</a>
            <a href="#pathways" className="transition-colors hover:text-foreground">Pathways</a>
            <a href="/pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="/login" className="transition-colors hover:text-foreground">Sign In</a>
            <a href="/signup" className="transition-colors hover:text-foreground">Sign Up</a>
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Pathways</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/pricing" className="transition-colors hover:text-foreground">The Graduate</a>
            <a href="/pricing" className="transition-colors hover:text-foreground">The Comeback</a>
            <a href="/pricing" className="transition-colors hover:text-foreground">The Confidence</a>
            <a href="/pricing" className="transition-colors hover:text-foreground">The Executive</a>
            <a href="/pricing" className="transition-colors hover:text-foreground">The Club</a>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl px-6 md:px-10">
        <p className="text-xs text-muted-foreground">© 2026 Bramwell AI. All rights reserved.</p>
      </div>
    </footer>
  );
}