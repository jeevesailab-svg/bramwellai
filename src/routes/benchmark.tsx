import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/benchmark")({
  component: BenchmarkPage,
  head: () => ({
    meta: [
      { title: "The Bramwell Benchmark — Free 4-minute communication assessment" },
      {
        name: "description",
        content:
          "Discover your communication type and the three biggest gaps holding you back. Free. No credit card. 12 questions, 4 minutes.",
      },
      { property: "og:title", content: "The Bramwell Benchmark" },
      {
        property: "og:description",
        content:
          "Find your communication type in 4 minutes. Get the right pathway for the moment you're in.",
      },
    ],
  }),
});

/* ─────────────────────────────────────────────
   Result types
   ───────────────────────────────────────────── */
type ResultType =
  | "Rambler"
  | "Under-Seller"
  | "Over-Explainer"
  | "Apologiser"
  | "Invisible Achiever"
  | "Next-Level Leader";

const RESULTS: Record<
  ResultType,
  {
    title: string;
    blurb: string;
    gaps: [string, string, string];
    pathwayKey: "graduate" | "comeback" | "confidence" | "executive" | "club";
    pathwayName: string;
    price: string;
  }
> = {
  Rambler: {
    title: "The Rambler",
    blurb:
      "You know the answer — but it arrives wrapped in three other answers. The room loses the point before you do.",
    gaps: [
      "Answers run 90+ seconds before landing the point",
      "You restart sentences mid-thought",
      "You finish unsure if the interviewer got the takeaway",
    ],
    pathwayKey: "confidence",
    pathwayName: "Interview Confidence Sprint",
    price: "$249 AUD",
  },
  "Under-Seller": {
    title: "The Under-Seller",
    blurb:
      "You've done the work. You just refuse to take the credit out loud. The interviewer hears 'we' when they need to hear 'I'.",
    gaps: [
      "You default to 'we' instead of 'I'",
      "You skip the result and stay in the process",
      "Your CV is stronger than your interview",
    ],
    pathwayKey: "comeback",
    pathwayName: "Career Comeback Sprint",
    price: "$199 AUD",
  },
  "Over-Explainer": {
    title: "The Over-Explainer",
    blurb:
      "You answer the question — then justify the answer, then justify the justification. The room mistakes detail for doubt.",
    gaps: [
      "You add caveats nobody asked for",
      "Your answers shrink in authority as they grow in length",
      "You explain instead of decide",
    ],
    pathwayKey: "confidence",
    pathwayName: "Interview Confidence Sprint",
    price: "$249 AUD",
  },
  Apologiser: {
    title: "The Apologiser",
    blurb:
      "Your sentences open with 'sorry', 'just', and 'I might be wrong but'. You're discounting yourself before the room can.",
    gaps: [
      "You hedge before you've even answered",
      "You apologise for taking up space",
      "You sound less senior than your CV reads",
    ],
    pathwayKey: "comeback",
    pathwayName: "Career Comeback Sprint",
    price: "$199 AUD",
  },
  "Invisible Achiever": {
    title: "The Invisible Achiever",
    blurb:
      "Your work is exceptional. Nobody knows because you've never been taught to name it. Promotions go to louder rooms.",
    gaps: [
      "You don't have a 60-second version of your impact",
      "You wait to be asked rather than offer",
      "Stakeholders underestimate your scope",
    ],
    pathwayKey: "executive",
    pathwayName: "Executive Communication Sprint",
    price: "$499 AUD",
  },
  "Next-Level Leader": {
    title: "The Next-Level Leader",
    blurb:
      "You're already capable. The next role asks for a different register — calmer, sharper, scarcer with words. That's the work.",
    gaps: [
      "Your authority needs calibration for the next room",
      "You're translating from doer-language to leader-language",
      "Stakes are now measured in millions, not minutes",
    ],
    pathwayKey: "executive",
    pathwayName: "Executive Communication Sprint",
    price: "$499 AUD",
  },
};

/* ─────────────────────────────────────────────
   Questions
   ───────────────────────────────────────────── */
type Option = { label: string; type?: ResultType; meta?: Record<string, string> };
type Question = { id: string; q: string; sub?: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "moment",
    q: "Which moment are you preparing for?",
    sub: "We'll tune the recommendation to your situation.",
    options: [
      { label: "My first serious interview after study", meta: { career_moment: "graduate" } },
      { label: "Returning to work after a break", meta: { career_moment: "comeback" } },
      { label: "A mid-career interview or pivot", meta: { career_moment: "confidence" } },
      { label: "A board, exec or C-suite conversation", meta: { career_moment: "executive" } },
    ],
  },
  {
    id: "q1",
    q: "When the interviewer asks 'tell me about yourself' — what actually happens?",
    options: [
      { label: "I start strong then trail into three other stories", type: "Rambler" },
      { label: "I undersell. I leave the best parts out", type: "Under-Seller" },
      { label: "I justify every step instead of summarising it", type: "Over-Explainer" },
      { label: "I open with 'sorry, where do I start' or similar", type: "Apologiser" },
    ],
  },
  {
    id: "q2",
    q: "Read your last big achievement out loud, right now. How does it come out?",
    options: [
      { label: "Long. With three caveats and a tangent", type: "Rambler" },
      { label: "I say 'we' more than 'I'", type: "Under-Seller" },
      { label: "I describe HOW more than WHAT it delivered", type: "Over-Explainer" },
      { label: "I literally have not said it out loud before", type: "Invisible Achiever" },
    ],
  },
  {
    id: "q3",
    q: "Walk into the room. What's the first word out of your mouth?",
    options: [
      { label: "'Sorry I'm—' something", type: "Apologiser" },
      { label: "A small joke to break the tension", type: "Rambler" },
      { label: "'Thanks for having me' — polite, neutral", type: "Under-Seller" },
      { label: "A clean, direct hello. I own the room", type: "Next-Level Leader" },
    ],
  },
  {
    id: "q4",
    q: "When asked a question you don't immediately know the answer to:",
    options: [
      { label: "I fill the silence. I keep talking until I find one", type: "Rambler" },
      { label: "I panic and minimise — 'I'm probably not the best person to answer'", type: "Apologiser" },
      { label: "I over-explain the adjacent thing I do know", type: "Over-Explainer" },
      { label: "I pause, think, give a clean honest answer", type: "Next-Level Leader" },
    ],
  },
  {
    id: "q5",
    q: "How often do you use the word 'just' in interviews? ('I just helped with…')",
    options: [
      { label: "Constantly. It's a verbal tic", type: "Apologiser" },
      { label: "A lot — I'm trying to be humble", type: "Under-Seller" },
      { label: "Sometimes, when I'm explaining detail", type: "Over-Explainer" },
      { label: "Almost never", type: "Next-Level Leader" },
    ],
  },
  {
    id: "q6",
    q: "Have you ever watched a less qualified person get a role you wanted?",
    options: [
      { label: "Yes. More than once. It still stings", type: "Invisible Achiever" },
      { label: "Yes — and I know it's because they spoke better, not did better", type: "Invisible Achiever" },
      { label: "Once or twice", type: "Under-Seller" },
      { label: "Not really — but I'm worried it's coming", type: "Next-Level Leader" },
    ],
  },
  {
    id: "q7",
    q: "When you describe what you actually do at work to a stranger:",
    options: [
      { label: "I take five sentences when one would do", type: "Rambler" },
      { label: "I downplay it. 'It's not that interesting'", type: "Under-Seller" },
      { label: "I go deep on jargon and process", type: "Over-Explainer" },
      { label: "I realise mid-sentence I've never had a clean version", type: "Invisible Achiever" },
    ],
  },
  {
    id: "q8",
    q: "In meetings with senior people, you mostly:",
    options: [
      { label: "Talk to fill space, then regret what I said", type: "Rambler" },
      { label: "Stay quiet unless directly asked", type: "Invisible Achiever" },
      { label: "Apologise before disagreeing", type: "Apologiser" },
      { label: "Pick my moment and land one clean point", type: "Next-Level Leader" },
    ],
  },
  {
    id: "q9",
    q: "The night before a big interview you usually:",
    options: [
      { label: "Lie awake replaying scenarios", type: "Apologiser" },
      { label: "Read the JD for the eighth time", type: "Over-Explainer" },
      { label: "Rehearse out loud — but it's never quite right", type: "Rambler" },
      { label: "I'd love to rehearse out loud but I have no one to rehearse with", type: "Invisible Achiever" },
    ],
  },
  {
    id: "q10",
    q: "After an interview, the dominant feeling is:",
    options: [
      { label: "'I should have said X.' Always", type: "Rambler" },
      { label: "'I sounded smaller than I am'", type: "Under-Seller" },
      { label: "'I over-explained the third question'", type: "Over-Explainer" },
      { label: "'I apologised when I should have stood firm'", type: "Apologiser" },
    ],
  },
  {
    id: "q11",
    q: "If a senior leader said 'you'd be ready for the next level if…' — what's the most likely ending?",
    options: [
      { label: "…you were more concise", type: "Rambler" },
      { label: "…you took more credit", type: "Under-Seller" },
      { label: "…you spoke with more authority", type: "Apologiser" },
      { label: "…the right people knew what you'd done", type: "Invisible Achiever" },
    ],
  },
  {
    id: "urgency",
    q: "How soon is the moment that matters?",
    sub: "Honest answer. We won't push you faster than you need.",
    options: [
      { label: "This week", meta: { urgency: "this_week" } },
      { label: "Within the next month", meta: { urgency: "this_month" } },
      { label: "Next 1–3 months", meta: { urgency: "this_quarter" } },
      { label: "I'm getting ahead of it", meta: { urgency: "exploring" } },
    ],
  },
];

/* ─────────────────────────────────────────────
   Pathway recommendation
   ───────────────────────────────────────────── */
function computeResult(answers: Record<string, Option>): {
  type: ResultType;
  pathwayKey: string;
  pathwayName: string;
  price: string;
  career_moment: string;
  urgency: string;
} {
  const tally: Record<ResultType, number> = {
    Rambler: 0,
    "Under-Seller": 0,
    "Over-Explainer": 0,
    Apologiser: 0,
    "Invisible Achiever": 0,
    "Next-Level Leader": 0,
  };
  for (const opt of Object.values(answers)) {
    if (opt?.type) tally[opt.type] += 1;
  }
  const top = (Object.entries(tally) as [ResultType, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  const meta = RESULTS[top];
  const career_moment = answers["moment"]?.meta?.career_moment ?? "";
  const urgency = answers["urgency"]?.meta?.urgency ?? "";

  // Career-moment overrides — moment trumps type for pathway selection
  let pathwayKey = meta.pathwayKey;
  let pathwayName = meta.pathwayName;
  let price = meta.price;
  if (career_moment === "graduate") {
    pathwayKey = "graduate";
    pathwayName = "Graduate Interview Sprint";
    price = "$99 AUD";
  } else if (career_moment === "executive" && pathwayKey !== "executive") {
    pathwayKey = "executive";
    pathwayName = "Executive Communication Sprint";
    price = "$499 AUD";
  } else if (career_moment === "comeback" && pathwayKey === "confidence") {
    pathwayKey = "comeback";
    pathwayName = "Career Comeback Sprint";
    price = "$199 AUD";
  }

  return { type: top, pathwayKey, pathwayName, price, career_moment, urgency };
}

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */
type Stage = "intro" | "quiz" | "capture" | "result";

function BenchmarkPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Option>>({});
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(
    () => Math.round((step / QUESTIONS.length) * 100),
    [step],
  );

  const result = useMemo(
    () => (stage === "result" ? computeResult(answers) : null),
    [stage, answers],
  );

  function pick(opt: Option) {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: opt };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setStage("capture");
    }
  }

  function back() {
    if (step === 0) {
      setStage("intro");
    } else {
      setStep(step - 1);
    }
  }

  async function submitCapture(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanName = firstName.trim().slice(0, 80);
    const cleanEmail = email.trim().toLowerCase().slice(0, 255);
    if (!cleanName) return setError("Please add your first name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      return setError("That doesn't look like a valid email.");

    setSubmitting(true);
    const r = computeResult({ ...answers });

    try {
      // Server route handles insert + Zapier webhook (URL stays server-side)
      const res = await fetch("/api/public/quiz-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: cleanName,
          email: cleanEmail,
          communication_type: r.type,
          career_moment: r.career_moment,
          urgency: r.urgency,
          recommended_pathway: r.pathwayKey,
          recommended_pathway_name: r.pathwayName,
          recommended_price: r.price,
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setStage("result");
    } catch (err: unknown) {
      console.error(err);
      setError("We couldn't save your result. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          {stage === "intro" && (
            <Intro onStart={() => setStage("quiz")} />
          )}

          {stage === "quiz" && (
            <QuizCard
              question={QUESTIONS[step]}
              step={step}
              total={QUESTIONS.length}
              progress={progress}
              selected={answers[QUESTIONS[step].id]}
              onPick={pick}
              onBack={back}
            />
          )}

          {stage === "capture" && (
            <Capture
              firstName={firstName}
              email={email}
              onFirstName={setFirstName}
              onEmail={setEmail}
              onSubmit={submitCapture}
              onBack={() => {
                setStep(QUESTIONS.length - 1);
                setStage("quiz");
              }}
              submitting={submitting}
              error={error}
            />
          )}

          {stage === "result" && result && (
            <Result
              firstName={firstName}
              result={result}
              onContinue={() =>
                navigate({
                  to: "/pricing",
                  search: { recommended: result.pathwayKey },
                })
              }
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ─────────────────────────────────────────────
   Subcomponents
   ───────────────────────────────────────────── */
function Header() {
  return (
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
      <Link to="/" className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tracking-tight">Bramwell</span>
        <span
          className="text-xl font-light tracking-tight"
          style={{ color: "var(--primary)" }}
        >
          AI
        </span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
        <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
        <Link to="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
        <Link to="/login" className="transition-colors hover:text-foreground">Sign in</Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 md:flex-row md:items-center md:px-10">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bramwell AI · Private by design
        </p>
        <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground">
          See pathways →
        </Link>
      </div>
    </footer>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
        The Bramwell Benchmark · 4 minutes
      </div>
      <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        Find your{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          communication type
        </span>{" "}
        — and the three gaps holding you back.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
        Twelve honest questions. One private result. The pathway that meets you
        exactly where you are.
      </p>
      <button
        onClick={onStart}
        className="group mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-95"
        style={{
          background: "var(--gradient-gold)",
          color: "var(--primary-foreground)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        Start the benchmark
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </button>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
        No credit card · Private by design
      </p>
    </div>
  );
}

function QuizCard({
  question,
  step,
  total,
  progress,
  selected,
  onPick,
  onBack,
}: {
  question: Question;
  step: number;
  total: number;
  progress: number;
  selected?: Option;
  onPick: (o: Option) => void;
  onBack: () => void;
}) {
  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>
            Question {step + 1} / {total}
          </span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "var(--gradient-gold)",
            }}
          />
        </div>
      </div>

      <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight md:text-4xl">
        {question.q}
      </h2>
      {question.sub && (
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {question.sub}
        </p>
      )}

      <div className="mt-10 grid gap-3">
        {question.options.map((opt) => {
          const isSelected = selected?.label === opt.label;
          return (
            <button
              key={opt.label}
              onClick={() => onPick(opt)}
              className={`group flex items-start gap-4 rounded-2xl border bg-foreground/[0.02] p-5 text-left transition hover:border-foreground/30 hover:bg-foreground/[0.05] ${
                isSelected ? "border-foreground/40 bg-foreground/[0.06]" : "border-border"
              }`}
            >
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border border-border transition group-hover:border-foreground/40"
              >
                <span
                  className={`h-2 w-2 rounded-full transition ${isSelected ? "" : "bg-transparent"}`}
                  style={isSelected ? { background: "var(--primary)" } : undefined}
                />
              </span>
              <span className="text-base leading-snug">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between text-sm">
        <button
          onClick={onBack}
          className="text-muted-foreground transition hover:text-foreground"
        >
          ← Back
        </button>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          Pick the closest answer
        </span>
      </div>
    </div>
  );
}

function Capture({
  firstName,
  email,
  onFirstName,
  onEmail,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  firstName: string;
  email: string;
  onFirstName: (v: string) => void;
  onEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Last step
      </p>
      <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
        Where should we send your result?
      </h2>
      <p className="mt-4 text-sm text-muted-foreground md:text-base">
        We'll show you your communication type and your three biggest gaps —
        and email you the full breakdown.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            First name
          </span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => onFirstName(e.target.value)}
            required
            maxLength={80}
            autoComplete="given-name"
            className="h-12 rounded-xl border border-border bg-foreground/[0.04] px-4 text-base outline-none transition focus:border-foreground/40"
            placeholder="Alex"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            required
            maxLength={255}
            autoComplete="email"
            className="h-12 rounded-xl border border-border bg-foreground/[0.04] px-4 text-base outline-none transition focus:border-foreground/40"
            placeholder="you@email.com"
          />
        </label>

        {error && (
          <p className="text-sm" style={{ color: "oklch(0.65 0.18 25)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "var(--gradient-gold)",
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          {submitting ? "Calculating…" : "Show my result →"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-center text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Back to questions
        </button>

        <p className="mt-2 text-center text-xs text-muted-foreground/80">
          Private by design. We never sell or share your data.
        </p>
      </form>
    </div>
  );
}

function Result({
  firstName,
  result,
  onContinue,
}: {
  firstName: string;
  result: ReturnType<typeof computeResult>;
  onContinue: () => void;
}) {
  const meta = RESULTS[result.type];
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Your result, {firstName}
      </p>
      <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        You're{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        >
          {meta.title}.
        </span>
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {meta.blurb}
      </p>

      <div className="mt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Your three biggest gaps
        </p>
        <ul className="mt-6 grid gap-3">
          {meta.gaps.map((g, i) => (
            <li
              key={g}
              className="flex items-start gap-4 rounded-2xl border border-border bg-foreground/[0.02] p-5"
            >
              <span
                aria-hidden
                className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: "var(--gradient-gold)",
                  color: "var(--primary-foreground)",
                }}
              >
                {i + 1}
              </span>
              <span className="text-base leading-snug">{g}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="mt-12 rounded-2xl border border-border p-7 md:p-10"
        style={{ background: "oklch(0.12 0.02 255)" }}
      >
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Recommended pathway
        </p>
        <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          The {result.pathwayName}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className="bg-clip-text text-3xl font-semibold tracking-tight text-transparent"
            style={{ backgroundImage: "var(--gradient-gold)" }}
          >
            {result.price}
          </span>
          <span className="text-sm text-muted-foreground">one-time</span>
        </div>
        <button
          onClick={onContinue}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-95"
          style={{
            background: "var(--gradient-gold)",
            color: "var(--primary-foreground)",
            boxShadow: "var(--shadow-elegant)",
          }}
        >
          See your pathway →
        </button>
        <p className="mt-4 text-xs text-muted-foreground">
          You can also compare all five pathways before you decide.
        </p>
      </div>
    </div>
  );
}