import { getScoreBand } from "@/lib/scoreBand";

export type CurvePoint = {
  session_number: number | null;
  readiness_score_end: number | null;
  created_at?: string | null;
};

export function ScoreCurve({
  points,
  baseline,
  totalSessions,
}: {
  points: CurvePoint[];
  baseline: number | null;
  totalSessions: number;
}) {
  const scored = points
    .filter((p) => typeof p.readiness_score_end === "number")
    .map((p, i) => ({
      day: p.session_number ?? i + 1,
      score: p.readiness_score_end as number,
    }))
    .sort((a, b) => a.day - b.day);

  const series =
    baseline !== null ? [{ day: 0, score: baseline }, ...scored] : scored;

  if (series.length === 0) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-left">
        <h2 className="text-lg font-semibold">Grow your score</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your curve starts after your first scored session. Every session adds
          a point to this line so you can see the change accumulating.
        </p>
      </div>
    );
  }

  const latest = series[series.length - 1]!;
  const first = series[0]!;
  const delta = latest.score - first.score;
  const band = getScoreBand(latest.score);

  const W = 600;
  const H = 180;
  const PAD = 24;
  const maxDay = Math.max(totalSessions || 30, latest.day, 1);
  const x = (d: number) => PAD + (d / maxDay) * (W - PAD * 2);
  const y = (s: number) => H - PAD - (s / 100) * (H - PAD * 2);
  const path = series
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.day).toFixed(1)},${y(p.score).toFixed(1)}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-6 text-left">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Grow your score</h2>
        <p className="text-sm text-muted-foreground">
          {first.score} → <span className="font-semibold text-foreground">{latest.score}</span>
          {delta !== 0 && (
            <span
              className="ml-2 font-semibold"
              style={{ color: delta > 0 ? "var(--primary)" : undefined }}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </span>
          )}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`Readiness score curve, currently ${latest.score} out of 100`}
      >
        {[0, 25, 50, 75, 100].map((g) => (
          <line
            key={g}
            x1={PAD}
            x2={W - PAD}
            y1={y(g)}
            y2={y(g)}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        ))}
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        {series.map((p) => (
          <circle key={p.day} cx={x(p.day)} cy={y(p.score)} r={4} fill="var(--primary)" />
        ))}
      </svg>

      <div className="mt-4 rounded-xl border border-border/50 bg-background/40 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          What {latest.score} means
        </p>
        <p className="mt-1 font-semibold">{band.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{band.meaning}</p>
        <p className="mt-2 text-sm">
          <span className="font-semibold">Next: </span>
          {band.next}
        </p>
      </div>
    </div>
  );
}
