import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bramwell AI — The coaching that gets people chosen" },
      {
        name: "description",
        content:
          "Live voice coaching for high-stakes interviews. Built on the same methodology as $5,000-a-session executive coaches. Take the free 5-minute diagnostic.",
      },
      { property: "og:title", content: "Bramwell AI — The coaching that gets people chosen" },
      {
        property: "og:description",
        content:
          "Live voice coaching for the interviews that change everything. Free 5-minute diagnostic. No login, no card.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Stats />
      <SecretWeapon />
      <ValueDislocation />
      <PainAccordion />
      <HowItWorks />
      <Pathways />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
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
          background: "var(--gradient-gold)",
          color: "var(--primary-foreground)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        Take the Free Diagnostic — Free →
      </a>
    </header>
  );
}

/* ───────────── Hero ───────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-12 text-center md:px-10 md:pb-40 md:pt-20">
        <p
          className="mx-auto mb-8 text-xs font-medium uppercase tracking-[0.22em] md:text-sm"
          style={{
            backgroundImage: "var(--gradient-gold)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Private coaching for the interviews that matter
        </p>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          Everyone in that room prepared.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
            Only one of them prepared with this.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          Live voice coaching. Real pressure. The version of you the panel remembers.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/diagnostic?autostart=1"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-95 sm:w-auto"
            style={{
              background: "var(--gradient-gold)",
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-elegant)",
            }}
          >
            Start the Free Diagnostic
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a href="#how" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            See how it works
          </a>
        </div>

        <p className="mx-auto mt-6 text-xs text-muted-foreground/80 md:text-sm">
          5 minutes · No login · No card
        </p>
      </div>
    </section>
  );
}

/* ───────────── Stats ───────────── */
function Stats() {
  const stats = [
    {
      value: "340",
      label: "Candidates competing for the role you just applied for.",
    },
    {
      value: "$5,000",
      label: "Per session with the coaches who built this methodology.",
    },
    {
      value: "$199",
      label: "What it costs you. Tonight. No waitlist.",
    },
  ];
  return (
    <section
      className="relative border-y border-border py-16 md:py-20"
      style={{ background: "oklch(0.12 0.02 255)" }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3 md:gap-8 md:px-10">
        {stats.map((s) => (
          <div key={s.value} className="text-center md:text-left">
            <div
              className="bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              {s.value}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Secret Weapon ───────────── */
function SecretWeapon() {
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Every elite performer has a coach.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
            You were just never told that included you.
          </span>
        </h2>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            {`Athletes have coaches. Executives have coaches. The candidates who consistently get chosen had something the other finalists didn't know existed.`}
          </p>
          <p>
            {`Bramwell is that layer — live voice, real-time correction, answer-specific calibration. Built on what's always existed at the top of the market. Available to you tonight, before the panel ever sees you.`}
          </p>
        </div>

        <blockquote
          className="mt-12 border-l-2 pl-6 text-xl italic leading-relaxed text-foreground/90 md:text-2xl"
          style={{ borderColor: "var(--primary)" }}
        >
          {`"I walked in knowing exactly how I sounded. That changed everything."`}
          <footer className="mt-3 text-xs font-normal not-italic uppercase tracking-[0.18em] text-muted-foreground">
            — Director, FTSE 100, promotion panel
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

/* ───────────── Value Dislocation ───────────── */
function ValueDislocation() {
  return (
    <section className="relative border-t border-border py-24 md:py-32" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The preparation that gets people chosen.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
            Available to you tonight. For $199.
          </span>
        </h2>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            {`Executive coaches charge $3,000–$5,000 per session. Booked weeks out. Unavailable the night before. Accessible only to the people who least needed the help.`}
          </p>
          <p className="font-medium text-foreground">That changes here.</p>
          <p>
            {`You're not paying $199 for an app. You're paying for the preparation people with the right networks have always had — and everyone else has been locked out of.`}
          </p>
          <p>
            {`The interview is in three days. The $5,000 coaches are booked for six weeks. `}
            <span className="font-medium text-foreground">Bramwell is open right now.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Pain Accordion ───────────── */
function PainAccordion() {
  const items = [
    {
      q: `"I ramble and lose the point I was trying to make."`,
      a: `That is not nerves. That is the absence of structure. Bramwell installs PREP — a framework that locks any answer into place in under 60 seconds. You hit the point before you lose the room. The panel follows. Every time.`,
    },
    {
      q: `"I freeze. My mind goes blank. I can hear myself falling apart."`,
      a: `Freezing is a familiarity problem, not a capability problem. Bramwell drills you on the questions you dread most — out loud, under pressure, on repeat — until familiar is the only thing they feel. You cannot freeze on a question you've answered fifty times.`,
    },
    {
      q: `"I walk out replaying what I should have said."`,
      a: `The answer you thought of on the drive home was your best one. It was also too late. Bramwell runs you through the hardest moments the night before — out loud — so the room hears your best take, not your second draft.`,
    },
    {
      q: `"I know I'm capable. I just can't sell myself."`,
      a: `You do not have a capability problem. You have a translation problem. Bramwell mines your CV for the moments that prove your level, then drills you on delivering them in the language of the role you actually want. The evidence was always there. Now it lands.`,
    },
    {
      q: `"I sound less senior than I am."`,
      a: `The panel is forming an opinion of your level in the first ninety seconds. If your cadence, your vocabulary, and your conviction don't match the work you've actually done, the gap costs you the role. Bramwell closes that gap in real time — until the version of you the panel hears matches the version that did the work.`,
    },
    {
      q: `"I've watched less qualified people get the roles I deserved."`,
      a: `They were not smarter. They were not more experienced. They were better coached — and you didn't know that was the difference until after you lost. Bramwell closes it before the next interview. Not after.`,
    },
    {
      q: `"I haven't interviewed in years. I don't know who I am in a room anymore."`,
      a: `Twelve years at one company. Made redundant. First real interview in a decade. You haven't lost your capability — you've just never had to perform it under this kind of pressure before. Bramwell is built for exactly this. Privately. Specifically. Before the panel ever sees you.`,
    },
    {
      q: `"I need to explain a career gap without it becoming the whole interview."`,
      a: `The gap is not the problem. The moment you apologise for it is. Bramwell trains you to own it — to deliver it as evidence of exactly the kind of person they want to hire. You won't dread the question. You'll use it.`,
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          You know your stuff.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
            You just freeze under pressure.
          </span>
        </h2>
        <div className="mt-12 divide-y divide-border border-y border-border">
          {items.map((p) => (
            <details key={p.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium tracking-tight md:text-lg">
                <span>{p.q}</span>
                <span className="mt-1 text-muted-foreground transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                {p.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── How It Works ───────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Take the Free Diagnostic",
      body: `Five minutes. No login. No card. Bramwell listens to how you speak, identifies your three biggest gaps, and produces your Readiness Score. You will hear things about the way you come across that no one in your life has had the courage to say. Most people find it uncomfortable. All of them say it was the most useful five minutes they spent on this.`,
      cta: { label: "Take the Diagnostic →", href: "/diagnostic?autostart=1" },
    },
    {
      n: "02",
      title: "Choose Your Pathway",
      body: `This is not a one-size-fits-all programme. It is built for the exact moment you are in. The Graduate. The Comeback. The Confidence. The Executive. The Club. Each one knows your situation, your level, and the specific questions that panel is likely to ask. The wrong pathway wastes your time. The right one changes the outcome.`,
    },
    {
      n: "03",
      title: "Practice Until It's Unshakeable",
      body: `Live, two-way voice coaching. You speak. Bramwell listens. It coaches the single most important fix. You retry. It does not move on until the answer is genuinely ready. Not rehearsed. Not scripted. Owned. The goal is not to sound coached. The goal is to sound like the most capable version of yourself, under the exact conditions that used to make you forget who that was.`,
    },
  ];
  return (
    <section id="how" className="relative border-t border-border py-24 md:py-32" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
            Three steps between you and the room.
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
              The only step that matters is the one you take tonight.
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
                    background: "var(--gradient-gold)",
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

/* ───────────── Pathways ───────────── */
type Pathway = {
  name: string;
  price: string;
  headline: string;
  body: string;
  emotional?: string;
  priceLine: string;
  cta: string;
  href: string;
  featured?: boolean;
};

function Pathways() {
  const pathways: Pathway[] = [
    {
      name: "The Graduate",
      price: "$99 AUD, one-time",
      headline: "First serious interview. The one that sets the next ten years in motion.",
      body: `You've applied to dozens of roles. You've had interviews. You've lost them and received feedback so vague it told you nothing. Here is what they won't tell you: you are not losing because of your CV. You are losing because every other finalist sounds like a professional and you still sound like someone hoping they'll give you a chance. Bramwell fixes that. The same framework used by candidates who walked into rooms with no directly relevant experience and left with the offer. Not because they were the most qualified. Because they were the best prepared.`,
      emotional: "The role you get in the next six months will shape the decade that follows.",
      priceLine: "$99. One pathway. The room that starts it all.",
      cta: "Start the Graduate Pathway →",
      href: "/pricing",
    },
    {
      name: "The Comeback",
      price: "$199 AUD, one-time",
      headline: "Redundant after years in one place. Returning from a gap. Back in the market for the first time in a long time.",
      body: `You have more experience than most people interviewing for this role. You also haven't done this in years — maybe a decade — and that asymmetry is loud in the room before you've said a word. The gap question is coming. The "why now?" is coming. The panel forming a quiet opinion about whether you're still current — that's coming too. Bramwell prepares you for every one of them. Not with scripts. With answers so specifically, undeniably yours that the panel stops registering the gap and starts registering the person.`,
      emotional: "You are more capable than you currently sound. That ends here.",
      priceLine: "$199. One pathway. Back in the room — on your terms.",
      cta: "Start the Comeback Pathway →",
      href: "/pricing",
    },
    {
      name: "The Confidence",
      price: "$249 AUD, one-time",
      headline: "You've done the work. You keep losing the room to people who shouldn't be beating you.",
      body: `Eight, ten, twelve years of real output. Going for the next level — or into a new industry — and the panels keep choosing someone with the exact title they advertised for, even when your track record is objectively stronger. The problem is not your experience. The problem is that your experience is still speaking the language of your last role. The panel is hearing the old version of you — not the one ready for what's next. Bramwell translates. It rebuilds your narrative in the language of the role you want, drills you until it sounds native, and calibrates the register of authority that gets people promoted.`,
      priceLine: "$249. One pivot. Your career, on the terms you set.",
      cta: "Start the Confidence Pathway →",
      href: "/pricing",
    },
    {
      name: "The Executive",
      price: "$499 AUD, one-time",
      headline: "Board rooms. C-suite. The conversation where every sentence is worth millions.",
      body: `You have run rooms. You have hired hundreds of people. You know exactly how a panel thinks. And if you are honest with yourself: right now you are more uncertain about this conversation than you have been about anything in twenty years. Because the stakes are real. Because you cannot practice with anyone who knows you. Because you cannot let anyone in your world see you need to prepare. Bramwell is the only coach that will never tell a soul. Private. Precise. Calibrated to the register of the room where you are not a candidate — you are a decision. The coaching infrastructure that existed only for people who could afford $5,000 an engagement. Available to you right now, tonight, without a referral.`,
      priceLine: "$499. One engagement. The room that changes everything.",
      cta: "Start the Executive Pathway →",
      href: "/pricing",
    },
    {
      name: "The Club",
      price: "$79 AUD per month",
      headline: "For the professional who knows the interview never really ends.",
      body: `Promotions. Board presentations. Investor pitches. The internal panel. The conversation that gets you the budget. The one that lands the client. The professionals who consistently win these moments do not perform better under pressure. They practice more than everyone around them suspects. Bramwell stays with you — for every conversation, every room, every year.`,
      priceLine: "$79/month. Unlimited access. Permanent edge.",
      cta: "Join The Club →",
      href: "/pricing",
      featured: true,
    },
  ];
  return (
    <section id="pathways" className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The coaching is calibrated to the moment you're in.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
            Not the moment someone else is in.
          </span>
        </h2>

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
                    background: "var(--gradient-gold)",
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
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              {p.emotional && (
                <p className="mt-5 text-sm italic text-foreground/80">{p.emotional}</p>
              )}
              <p className="mt-5 text-sm font-medium text-foreground">{p.priceLine}</p>
              <a
                href={p.href}
                className="mt-6 inline-flex h-11 w-fit items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
                style={{
                  background: "var(--gradient-gold)",
                  color: "var(--primary-foreground)",
                  boxShadow: p.featured ? "var(--shadow-elegant)" : undefined,
                }}
              >
                {p.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Testimonials ───────────── */
function Testimonials() {
  const quotes = [
    {
      q: `"I walked in knowing exactly how I sounded. That changed everything."`,
      a: "Director, FTSE 100 — promotion panel",
    },
    {
      q: `"It's the only coach that's there at 11pm the night before. That's the only time I needed it."`,
      a: "Senior PM, Series B Fintech",
    },
    {
      q: `"Within two sessions my answers stopped wandering. I got the offer. I'd spent eight months getting nowhere."`,
      a: "Returning to work after maternity leave",
    },
    {
      q: `"I hadn't interviewed in eleven years. I thought I'd lost it. Turns out I just needed to practice out loud once — with something that actually pushed back."`,
      a: "Operations Director, made redundant after 14 years",
    },
    {
      q: `"There were three of us on the final shortlist. All of us were qualified. I was the only one who knew exactly what I was going to say and exactly how I was going to say it."`,
      a: "Senior candidate, final round offer",
    },
  ];
  return (
    <section className="relative border-t border-border py-24 md:py-32" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          The room, after{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
            Bramwell.
          </span>
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotes.map((t, i) => (
            <figure
              key={i}
              className="flex h-full flex-col rounded-2xl border border-border bg-background/60 p-8 backdrop-blur"
            >
              <div className="text-3xl leading-none" style={{ color: "var(--primary)" }}>
                "
              </div>
              <blockquote className="mt-3 flex-1 text-base font-medium leading-snug tracking-tight md:text-lg">
                {t.q}
              </blockquote>
              <hr className="my-5 border-border" />
              <figcaption className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
      q: "Is this an AI or a human coach?",
      a: `Bramwell is an AI coach engineered to the standard of a senior executive communications partner — not a chatbot recycling tips from a careers blog. It listens to your voice in real time, finds the specific thing costing you the room, and coaches that one thing until it is fixed. Then it moves to the next. It is also available at 11pm, carries no other clients into the session with it, and will never make you feel embarrassed for needing to prepare. That last part matters more than people expect.`,
    },
    {
      q: "How long is a session?",
      a: `15 to 30 minutes, depending on your pathway. Long enough to work on the questions that terrify you. Short enough that you will actually do it the night before — instead of just telling yourself you will.`,
    },
    {
      q: "Is my data private?",
      a: `Completely. Your CV, your target role, your voice recordings — private to your account, never used to train public models, never seen by anyone. This is the one place you can sound terrible before you sound brilliant. That is entirely the point.`,
    },
    {
      q: "I'm not in Australia. Does this work for me?",
      a: `Bramwell coaches in native English and works globally. The methodology is calibrated for any room where English is the language of the decision and presence is the thing they are hiring for.`,
    },
    {
      q: "What if I try it and it doesn't work?",
      a: `Take the free diagnostic first. Five minutes. No card. You will hear your Readiness Score and your three biggest gaps — things most people have never had named for them before. If that five minutes isn't the most useful feedback you've received on how you come across, don't go further. Most people go further.`,
    },
    {
      q: "Is this better than just using ChatGPT to prep?",
      a: `ChatGPT can write you an answer. It cannot hear you deliver it. The gap between the answer that reads well on a screen and the answer that lands in a room is not a content problem. It is a delivery problem — cadence, conviction, the register of someone who owns the answer rather than reciting it. Bramwell coaches the delivery. That is the part that costs people the room.`,
    },
    {
      q: "Can I use this the night before an interview?",
      a: `That is exactly what it is designed for. You do not need weeks of preparation. You need one session where you practice the questions that are likely to come, hear what is not landing, fix it, and walk into the room knowing exactly how you sound. Most candidates do their best preparation after the interview, on the drive home. Bramwell does it the night before.`,
    },
  ];
  return (
    <section className="border-t border-border bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_2fr] md:px-10">
        <div>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            The questions worth asking before you walk in.
          </h2>
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
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Everyone who lost that role was qualified.
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-gold)" }}>
            The one who got it knew exactly how they sounded.
          </span>
        </h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            {`The free diagnostic is five minutes. No card. No login. It will tell you exactly what is costing you the room — and what it takes to fix it before the panel sees you.`}
          </p>
          <p>
            {`The preparation that gets people chosen. Available to you right now, for nothing, for five minutes, before you decide anything else.`}
          </p>
          <p>The interview is coming. The question is which version of you walks into it.</p>
        </div>
        <a
          href="/diagnostic?autostart=1"
          className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-95"
          style={{
            background: "var(--gradient-gold)",
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          Take the Free Diagnostic →
        </a>
        <p className="mt-6 text-xs text-muted-foreground/80 md:text-sm">
          5 minutes. No credit card. No login. Just the truth about where you stand.
        </p>
        <p className="mt-4 text-xs italic text-muted-foreground/70 md:text-sm">
          The coaches who charge $5,000 for this are booked for six weeks. Bramwell is open right now.
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
            Your data is private. Your voice recordings are yours. Bramwell never uses your sessions to train public models.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Bramwell</p>
          <nav className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="/diagnostic?autostart=1" className="transition-colors hover:text-foreground">Free Diagnostic</a>
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
