import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteNav, SiteFooter, GoldText } from "@/components/site/SiteChrome";

const QUESTIONS = [
  {
    n: "01",
    q: "Tell me about yourself.",
    test: "Whether you can frame your value in 60 seconds without rambling.",
    answer:
      "Lead with the relevant arc, not your CV. Past (the thread that got you here) → Present (the work that matters now) → Future (why this role, specifically). 30 seconds each. No life story.",
  },
  {
    n: "02",
    q: "Why this role? Why us?",
    test: "Whether you've done the work, or you're spraying applications.",
    answer:
      "Name something specific they did in the last six months that you have a view on. Connect it to a problem you've solved. Generic praise (\"great culture\", \"market leader\") signals you applied to twenty others.",
  },
  {
    n: "03",
    q: "What's your biggest weakness?",
    test: "Self-awareness. Not your weakness, your relationship to it.",
    answer:
      "Pick a real one that isn't load-bearing for the role. Name it, name the impact it had once, name what you actively do about it now. Never \"I'm a perfectionist.\" They've heard it 400 times.",
  },
  {
    n: "04",
    q: "Tell me about a time you failed.",
    test: "Whether you'll own outcomes or hide behind the team.",
    answer:
      "Use SOAR. Situation. Owned-decision (the one that didn't work). Action you took to recover. Result + what you do differently now. The recovery is the story. The failure is just the setup.",
  },
  {
    n: "05",
    q: "Walk me through a difficult stakeholder.",
    test: "Whether you can disagree without being defensive.",
    answer:
      "Name the tension without naming the person. Show you sought to understand their position before pushing yours. Land on what you both learned. Never make them the villain, it tells the panel exactly how you'll talk about them in six months.",
  },
  {
    n: "06",
    q: "Where do you see yourself in five years?",
    test: "Whether you're a flight risk and whether your ambition fits the shape of the role.",
    answer:
      "Talk about the kind of problems you want to be solving, not titles. Anchor it to a capability you're building that this role accelerates. \"Running my own thing in two years\" is a no. \"Operating at this level with more scope\" is a yes.",
  },
  {
    n: "07",
    q: "Do you have any questions for us?",
    test: "Whether you treat this as a two-way decision, or you're just hoping to be picked.",
    answer:
      "Ask one question that proves you understand the role's hardest problem, one that probes how they actually work (decision-making, not perks), and one that signals you're already imagining yourself in it. \"No questions, I think you've covered everything\" loses you the room in the final 90 seconds.",
  },
];

export const Route = createFileRoute("/the-7-questions")({
  component: SevenQuestionsPage,
  head: () => ({
    meta: [
      { title: "The 7 Questions That Decide Every Interview, Bramwell AI" },
      {
        name: "description",
        content:
          "The seven questions every panel asks, what they're actually testing, and the framework-built answer for each. Free.",
      },
      { property: "og:title", content: "The 7 Questions That Decide Every Interview" },
      {
        property: "og:description",
        content:
          "What the panel is actually testing, and the answer framework that gets people chosen. Free guide from Bramwell AI.",
      },
    ],
  }),
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(180),
});

function SevenQuestionsPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your email");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await fetch("/api/public/klaviyo-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          eventName: "Requested 7 Questions Guide",
          pathway: "lead_magnet",
          source: "the_7_questions_page",
          properties: { magnet: "7_questions" },
        }),
      });
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("bramwell_lead_email", parsed.data.email);
        } catch {
          /* noop */
        }
      }
    } catch {
      /* non-blocking */
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav ctaLabel="Talk to Bramwell free" ctaHref="/diagnostic?autostart=1" />

      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-12 text-center md:px-10 md:pb-28 md:pt-20">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--primary)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
            Free guide · No card
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            The 7 questions every panel asks.
            <br />
            <GoldText>What they're actually testing.</GoldText>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Every panel, junior, senior, executive, circles the same seven questions. Lose any
            one of them and you lose the room. Get the breakdown of what each is really testing and
            the framework-built answer that lands.
          </p>

          {!submitted ? (
            <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-md" noValidate>
              <div className="flex flex-col gap-2 rounded-2xl border border-border bg-background/60 p-2 backdrop-blur sm:flex-row sm:items-center">
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="h-11 flex-1 rounded-full bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:opacity-95 disabled:opacity-60"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {submitting ? "Sending…" : "Send Me The Guide →"}
                </button>
              </div>
              {error ? (
                <p className="mt-2 text-xs text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <p className="mt-3 text-[11px] text-muted-foreground/70">
                Unlocks the full guide on this page. No spam.
              </p>
            </form>
          ) : (
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-background/70 p-5 text-left">
              <p
                className="text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: "var(--primary)" }}
              >
                ✓ Sent to {email}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                The full guide is unlocked below, start reading now. Bookmark this page to come
                back anytime.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        className={`border-t border-border bg-background py-20 md:py-28 ${submitted ? "" : "relative"}`}
      >
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <div className={submitted ? "" : "pointer-events-none select-none blur-[6px]"}>
            <div className="divide-y divide-border border-y border-border">
              {QUESTIONS.map((item) => (
                <article key={item.n} className="py-8 md:py-10">
                  <div
                    className="text-xs font-semibold uppercase tracking-[0.22em]"
                    style={{ color: "var(--primary)" }}
                  >
                    Question {item.n}
                  </div>
                  <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                    {item.q}
                  </h2>
                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                    <p>
                      <span className="font-semibold text-foreground">What they're testing, </span>
                      {item.test}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">How to land it, </span>
                      {item.answer}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {!submitted ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full items-center justify-center">
              <div className="pointer-events-auto mx-6 max-w-md rounded-2xl border border-border bg-background/95 p-6 text-center shadow-xl backdrop-blur">
                <p className="text-sm font-semibold text-foreground">
                  Enter your email above to unlock all 7.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Instant access. Read it right here.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {submitted ? (
        <section
          className="relative overflow-hidden border-t border-border py-24 md:py-32"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "var(--gradient-gold)" }}
          />
          <div className="relative mx-auto max-w-2xl px-6 text-center md:px-10">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Reading is one thing.
              <br />
              <GoldText>Hearing yourself answer is another.</GoldText>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Try Bramwell free. He listens to how you actually deliver
              these answers, and tells you what the panel will hear before they do.
            </p>
            <Link
              to="/diagnostic"
              search={{ autostart: "1" }}
              className="group mt-8 inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-7 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:opacity-95"
              style={{
                background: "var(--gradient-cta)",
                boxShadow: "var(--shadow-cta)",
              }}
            >
              <MicIcon /> Talk to Bramwell free <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <p className="mt-4 text-xs text-muted-foreground/80">
              No card · No login
            </p>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}