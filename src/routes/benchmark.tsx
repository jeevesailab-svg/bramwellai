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
   Result types — R/U/O/A/I/N letter system per spec
   ───────────────────────────────────────────── */
type Letter = "R" | "U" | "O" | "A" | "I" | "N";
type ResultName =
  | "Rambler"
  | "Under-Seller"
  | "Over-Explainer"
  | "Apologiser"
  | "Invisible Achiever"
  | "Next-Level Leader";

type PathwayKey = "graduate" | "comeback" | "confidence" | "executive" | "club";

const LETTER_TO_NAME: Record<Letter, ResultName> = {
  R: "Rambler",
  U: "Under-Seller",
  O: "Over-Explainer",
  A: "Apologiser",
  I: "Invisible Achiever",
  N: "Next-Level Leader",
};

const RESULTS: Record<
  Letter,
  { title: string; subline: string; body: string }
> = {
  R: {
    title: "You are a Rambler.",
    subline:
      "You have more to say than you have structure to say it in.",
    body: "Your ideas are strong. The problem is they come out in the wrong order under pressure. You start strong, then go in three directions at once, then trail off before your best point lands. The room hears potential — but misses the proof. Bramwell fixes this with one framework that organises any answer in under 60 seconds.",
  },
  U: {
    title: "You are an Under-Seller.",
    subline: "You have done impressive things. You just do not say so.",
    body: "You minimise. You qualify. You say just and only and a little bit. You describe what you did without naming what changed because of you. The room sees someone capable — but undersells themselves out of roles and promotions they deserved. Bramwell excavates what is actually there and coaches you to own it.",
  },
  O: {
    title: "You are an Over-Explainer.",
    subline: "You give the room everything — when it only needed one thing.",
    body: "You are thorough. You are detailed. You cover every angle because you want to be accurate. But the room loses the thread before you get to the point. Bramwell coaches you to lead with the conclusion and let the evidence follow — not the other way around.",
  },
  A: {
    title: "You are an Apologiser.",
    subline: "You shrink when you should stand.",
    body: "You hedge. You qualify. You apologise for taking up space. Under pressure your voice rises at the end of statements, turning conviction into questions. The room hears uncertainty instead of capability. Bramwell coaches the delivery of belief — until what comes out of your mouth matches what you know about yourself.",
  },
  I: {
    title: "You are an Invisible Achiever.",
    subline:
      "You deliver at the highest level. Nobody outside your immediate team knows it.",
    body: "You do the work. You hit the outcomes. You just do not talk about it in a way that makes the right people notice. You describe tasks not transformations. You sound like someone doing the job — not someone ready for the next one. Bramwell helps you build the language of the level above.",
  },
  N: {
    title: "You are a Next-Level Leader.",
    subline: "You are closer than you think. You just need sharper edges.",
    body: "You communicate well. You know your value. What you need is precision — the specific language, the exact framework, the pressure practice that turns good into exceptional. Bramwell sharpens what is already there.",
  },
};

/* ─────────────────────────────────────────────
   Questions
   ───────────────────────────────────────────── */
type Scores = Partial<Record<Letter, number>>;
type Option = {
  label: string;
  scores?: Scores;
  meta?: Record<string, string>;
};
type Question = { id: string; q: string; sub?: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "q1",
    q: "What career moment are you preparing for?",
    sub: "We'll tune the recommendation to your situation.",
    options: [
      { label: "Job interview", meta: { career_moment: "interview" } },
      { label: "Promotion conversation", meta: { career_moment: "promotion" } },
      { label: "Pay rise or salary negotiation", meta: { career_moment: "pay_rise" } },
      { label: "Performance review", meta: { career_moment: "review" } },
      { label: "Media interview or podcast", meta: { career_moment: "media" } },
      { label: "Board or senior stakeholder presentation", meta: { career_moment: "board" } },
      { label: "I want to sound more confident generally", meta: { career_moment: "general_confidence" } },
    ],
  },
  {
    id: "q2",
    q: "Which best describes you right now?",
    options: [
      { label: "Student or graduate", meta: { life_stage: "student" } },
      { label: "Job seeker", meta: { life_stage: "job_seeker" } },
      { label: "Recently made redundant", meta: { life_stage: "redundant" } },
      { label: "Mid-career professional", meta: { life_stage: "mid_career" } },
      { label: "Manager or senior leader", meta: { life_stage: "manager" } },
      { label: "Executive or C-suite", meta: { life_stage: "executive" } },
      { label: "Founder or business owner", meta: { life_stage: "founder" } },
      { label: "Returning to work after a break", meta: { life_stage: "returning" } },
    ],
  },
  {
    id: "q3",
    q: "What do you struggle with most when speaking under pressure?",
    options: [
      { label: "I ramble and lose the point", scores: { R: 2 } },
      { label: "I freeze and go blank", scores: { A: 2 } },
      { label: "I over-explain and give too much detail", scores: { O: 2 } },
      { label: "I under-sell myself and minimise my achievements", scores: { U: 2 } },
      { label: "I sound nervous or less confident than I feel", scores: { A: 2 } },
      { label: "I sound too junior for the level I am going for", scores: { I: 2 } },
      { label: "I struggle to organise my thoughts quickly", scores: { R: 2 } },
    ],
  },
  {
    id: "q4",
    q: "When someone says 'tell me about yourself' — what happens?",
    options: [
      { label: "I give a long career history that goes everywhere", scores: { R: 2 } },
      { label: "I freeze and sound awkward", scores: { A: 2 } },
      { label: "I speak too generally and nothing lands", scores: { I: 2 } },
      { label: "I under-sell my achievements", scores: { U: 2 } },
      { label: "I sound rehearsed and robotic", scores: { O: 2 } },
      { label: "I do not know where to start", scores: { R: 2 } },
    ],
  },
  {
    id: "q5",
    q: "What feedback have you received before?",
    options: [
      { label: "Be more concise", scores: { R: 2 } },
      { label: "Speak with more confidence", scores: { A: 2 } },
      { label: "Get to the point", scores: { R: 2 } },
      { label: "Show more leadership presence", scores: { I: 2 } },
      { label: "Use more specific examples", scores: { U: 2 } },
      { label: "Be more strategic in how you talk about your work", scores: { I: 2 } },
      { label: "I have not had clear feedback", scores: { O: 1 } },
    ],
  },
  {
    id: "q6",
    q: "What do you want people to think after hearing you speak?",
    options: [
      { label: "They are the obvious hire", meta: { outcome_want: "obvious_hire" } },
      { label: "They are ready for the next level", meta: { outcome_want: "next_level" } },
      { label: "They are calm and completely credible", meta: { outcome_want: "credible" } },
      { label: "They are a strong leader", meta: { outcome_want: "leader" } },
      { label: "They know exactly what they are worth", meta: { outcome_want: "worth" } },
      { label: "They are memorable — I want to hear more", meta: { outcome_want: "memorable" } },
    ],
  },
  {
    id: "q7",
    q: "Which statement feels most true?",
    options: [
      { label: "I have the experience but I do not communicate it well", scores: { U: 2 } },
      { label: "I know I am capable but I struggle to sell myself", scores: { U: 2 } },
      { label: "I feel confident in my head but not when I speak", scores: { A: 2 } },
      { label: "I sound better in writing than out loud", scores: { O: 2 } },
      { label: "I am ready for the next level but need to sound like it", scores: { I: 2 } },
      { label: "I need to rebuild my confidence after a setback", scores: { A: 2 } },
    ],
  },
  {
    id: "q8",
    q: "How often do you practise important conversations before they happen?",
    options: [
      { label: "Never", scores: { R: 1 } },
      { label: "Only in my head", scores: { A: 1 } },
      { label: "Sometimes with notes", scores: { O: 1 } },
      { label: "With a friend or partner", scores: { N: 1 } },
      { label: "I practise properly and want sharper feedback", scores: { N: 2 } },
    ],
  },
  {
    id: "q9",
    q: "What would be most valuable to you right now?",
    options: [
      { label: "A better 'tell me about yourself' answer", scores: { R: 1 } },
      { label: "Stronger interview answers with real examples", scores: { U: 1 } },
      { label: "More executive presence and authority", scores: { I: 1 } },
      { label: "A clearer promotion or career story", scores: { I: 1 } },
      { label: "Help with salary or pay rise conversations", scores: { U: 1 } },
      { label: "Rebuilding confidence after redundancy or a gap", scores: { A: 1 } },
      { label: "Better stakeholder communication", scores: { I: 1 } },
      { label: "A personalised career story bank", scores: { N: 1 } },
    ],
  },
  {
    id: "q10",
    q: "How soon is your next career-defining conversation?",
    sub: "Honest answer. We'll calibrate the urgency of your pathway.",
    options: [
      { label: "This week", meta: { urgency: "this_week" } },
      { label: "Next two weeks", meta: { urgency: "two_weeks" } },
      { label: "Next month", meta: { urgency: "this_month" } },
      { label: "Next three months", meta: { urgency: "this_quarter" } },
      { label: "No date yet but I want to be ready", meta: { urgency: "no_date" } },
    ],
  },
  {
    id: "q11",
    q: "What is your biggest fear going into that conversation?",
    options: [
      { label: "Sounding stupid or unprepared", scores: { A: 1 } },
      { label: "Being too nervous to think clearly", scores: { A: 2 } },
      { label: "Forgetting what I wanted to say", scores: { R: 1 } },
      { label: "Not sounding senior enough", scores: { I: 2 } },
      { label: "Freezing under pressure", scores: { A: 2 } },
      { label: "Missing the opportunity", scores: { U: 1 } },
    ],
  },
  {
    id: "q12",
    q: "What outcome do you want most?",
    options: [
      { label: "Get hired", meta: { outcome: "hired" } },
      { label: "Get promoted", meta: { outcome: "promoted" } },
      { label: "Get paid more", meta: { outcome: "paid" } },
      { label: "Speak with more authority", meta: { outcome: "authority" } },
      { label: "Build lasting confidence", meta: { outcome: "confidence" } },
      { label: "Command the room", meta: { outcome: "command" } },
      { label: "Sound as strong as my experience", meta: { outcome: "match_experience" } },
    ],
  },
];

/* ─────────────────────────────────────────────
   Scoring + pathway recommendation
   ───────────────────────────────────────────── */

// Tie-break by Q1 career moment (priority list of letters when scores tie)
const TIEBREAK_BY_MOMENT: Record<string, Letter> = {
  interview: "R",
  promotion: "I",
  pay_rise: "U",
  review: "A",
  media: "I",
  board: "I",
  general_confidence: "A",
};

function pickPathway(
  letter: Letter,
  life_stage: string,
): { key: PathwayKey; name: string; price: string } {
  // Apologiser routes via life stage
  if (letter === "A") {
    if (life_stage === "redundant" || life_stage === "returning") {
      return { key: "comeback", name: "Career Comeback Sprint", price: "$199 AUD" };
    }
    return { key: "confidence", name: "Interview Confidence Sprint", price: "$249 AUD" };
  }
  if (letter === "I")
    return { key: "executive", name: "Executive Communication Sprint", price: "$499 AUD" };
  if (letter === "N")
    return { key: "club", name: "Career Confidence Club", price: "$79 AUD / month" };
  // R, U, O default to the Confidence Sprint
  return { key: "confidence", name: "Interview Confidence Sprint", price: "$249 AUD" };
}

function computeResult(answers: Record<string, Option>): {
  letter: Letter;
  name: ResultName;
  pathwayKey: PathwayKey;
  pathwayName: string;
  price: string;
  career_moment: string;
  life_stage: string;
  urgency: string;
} {
  const tally: Record<Letter, number> = { R: 0, U: 0, O: 0, A: 0, I: 0, N: 0 };
  for (const opt of Object.values(answers)) {
    if (!opt?.scores) continue;
    for (const [k, v] of Object.entries(opt.scores) as [Letter, number][]) {
      tally[k] += v;
    }
  }

  const career_moment = answers["q1"]?.meta?.career_moment ?? "";
  const life_stage = answers["q2"]?.meta?.life_stage ?? "";
  const urgency = answers["q10"]?.meta?.urgency ?? "";

  // Highest score wins; ties broken by Q1 career moment
  const max = Math.max(...Object.values(tally));
  const topLetters = (Object.entries(tally) as [Letter, number][])
    .filter(([, n]) => n === max)
    .map(([l]) => l);

  let letter: Letter = topLetters[0];
  if (topLetters.length > 1) {
    const preferred = TIEBREAK_BY_MOMENT[career_moment];
    if (preferred && topLetters.includes(preferred)) letter = preferred;
  }

  const pathway = pickPathway(letter, life_stage);
  return {
    letter,
    name: LETTER_TO_NAME[letter],
    pathwayKey: pathway.key,
    pathwayName: pathway.name,
    price: pathway.price,
    career_moment,
    life_stage,
    urgency,
  };
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