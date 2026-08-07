import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getScoreBand } from "@/lib/scoreBand";

export const Route = createFileRoute("/portal/sessions/$sessionId")({
  component: SessionDetailPage,
  head: () => ({
    meta: [
      { title: "Session detail, Bramwell AI" },
      {
        name: "description",
        content:
          "What you said, what it scored and the exact fix Bramwell gave you in this coaching session.",
      },
      { property: "og:title", content: "Session detail, Bramwell AI" },
      {
        property: "og:description",
        content:
          "Replay a coaching session with its score breakdown, practice focus and homework.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Row = {
  id: string;
  created_at: string;
  session_number: number | null;
  duration_minutes: number | null;
  questions_covered: string | null;
  strongest_moment: string | null;
  practice_focus: string | null;
  homework_instructions: string | null;
  readiness_score_start: number | null;
  readiness_score_end: number | null;
  clarity_score: number | null;
  confidence_score: number | null;
  authority_score: number | null;
  evidence_score: number | null;
  transcript: string | null;
  session_status: string | null;
};

const DIMENSIONS: { key: keyof Row; label: string; blurb: string }[] = [
  {
    key: "clarity_score",
    label: "Structure",
    blurb: "Answer first, evidence second, then the so what.",
  },
  {
    key: "evidence_score",
    label: "Specificity",
    blurb: "Numbers, names, timeframes and outcomes instead of claims.",
  },
  {
    key: "confidence_score",
    label: "Confidence signals",
    blurb: "Pace, pauses and how you land the end of a sentence.",
  },
  {
    key: "authority_score",
    label: "Relevance",
    blurb: "Answering the question that was actually asked.",
  },
];

function SessionDetailPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams({ from: "/portal/sessions/$sessionId" });
  const [row, setRow] = useState<Row | null | "missing">(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!auth.user) {
        navigate({ to: "/login", replace: true });
        return;
      }
      const { data } = await supabase
        .from("sessions")
        .select(
          "id, created_at, session_number, duration_minutes, questions_covered, strongest_moment, practice_focus, homework_instructions, readiness_score_start, readiness_score_end, clarity_score, confidence_score, authority_score, evidence_score, transcript, session_status",
        )
        .eq("id", sessionId)
        .eq("user_id", auth.user.id)
        .maybeSingle();
      if (cancelled) return;
      setRow((data as Row | null) ?? "missing");
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, sessionId]);

  if (row === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading session…
      </main>
    );
  }

  if (row === "missing") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Session not found</h1>
        <p className="mt-3 text-muted-foreground">
          That session does not exist or does not belong to your account.
        </p>
        <Link
          to="/portal/sessions"
          className="mt-6 inline-block text-sm font-semibold underline"
        >
          Back to session history
        </Link>
      </main>
    );
  }

  const end = row.readiness_score_end;
  const start = row.readiness_score_start;
  const delta =
    typeof end === "number" && typeof start === "number" ? end - start : null;
  const band = typeof end === "number" ? getScoreBand(end) : null;
  const lines = (row.transcript ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10">
        <Link
          to="/portal/sessions"
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← Session history
        </Link>

        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Day {row.session_number ?? "-"} ·{" "}
          {new Date(row.created_at).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {row.duration_minutes ? ` · ${row.duration_minutes} min` : ""}
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-6xl font-semibold leading-none">
              {typeof end === "number" ? end : "-"}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Readiness score
            </p>
          </div>
          {delta !== null && (
            <p
              className="pb-2 text-lg font-semibold"
              style={{ color: delta > 0 ? "var(--primary)" : undefined }}
            >
              {delta > 0 ? "+" : ""}
              {delta} from {start} at the start of this session
            </p>
          )}
        </div>

        {band && (
          <div className="mt-6 rounded-2xl border border-border/50 bg-card/40 p-5">
            <p className="font-semibold">{band.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{band.meaning}</p>
            <p className="mt-2 text-sm">
              <span className="font-semibold">Next: </span>
              {band.next}
            </p>
          </div>
        )}

        <h2 className="mt-10 text-lg font-semibold">How it scored</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DIMENSIONS.map((d) => {
            const v = row[d.key] as number | null;
            return (
              <div
                key={d.label}
                className="rounded-2xl border border-border/50 bg-card/40 p-5"
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-medium">{d.label}</p>
                  <p className="text-xl font-semibold">
                    {typeof v === "number" ? v : "-"}
                  </p>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, v ?? 0))}%`,
                      background: "var(--gradient-gold)",
                    }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{d.blurb}</p>
              </div>
            );
          })}
        </div>

        {row.questions_covered && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">What you were asked</h2>
            <p className="mt-2 whitespace-pre-line text-muted-foreground">
              {row.questions_covered}
            </p>
          </section>
        )}

        {row.strongest_moment && (
          <section className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Strongest moment
            </p>
            <p className="mt-2 text-lg font-medium leading-relaxed">
              "{row.strongest_moment}"
            </p>
          </section>
        )}

        {(row.practice_focus || row.homework_instructions) && (
          <section className="mt-10 grid gap-3 sm:grid-cols-2">
            {row.practice_focus && (
              <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  What Bramwell fixed
                </p>
                <p className="mt-2 whitespace-pre-line">{row.practice_focus}</p>
              </div>
            )}
            {row.homework_instructions && (
              <div className="rounded-2xl border border-border/50 bg-card/40 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Homework set
                </p>
                <p className="mt-2 whitespace-pre-line">
                  {row.homework_instructions}
                </p>
              </div>
            )}
          </section>
        )}

        {lines.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">Transcript</h2>
            <div className="mt-4 space-y-3 rounded-2xl border border-border/50 bg-card/40 p-5">
              {lines.map((line, i) => {
                const isCoach = /^(bramwell|coach|agent)\s*:/i.test(line);
                const text = line.replace(/^[^:]{0,20}:\s*/, "");
                return (
                  <p key={i} className="text-sm leading-relaxed">
                    <span
                      className="mr-2 text-xs font-semibold uppercase tracking-[0.14em]"
                      style={{
                        color: isCoach ? "var(--primary)" : undefined,
                      }}
                    >
                      {isCoach ? "Bramwell" : "You"}
                    </span>
                    <span className={isCoach ? "text-muted-foreground" : ""}>
                      {text}
                    </span>
                  </p>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            to="/portal/coach"
            className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-primary-foreground"
            style={{ background: "var(--gradient-gold)" }}
          >
            Run your next session
          </Link>
        </div>
      </div>
    </main>
  );
}
