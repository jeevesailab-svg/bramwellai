import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Your dashboard — Bramwell AI" },
      {
        name: "description",
        content: "Track your sessions, Readiness Score, and next steps.",
      },
    ],
  }),
});

type UserRow = {
  first_name: string | null;
  pathway: string | null;
  sessions_purchased: number;
  sessions_completed: number;
  access_expires_at: string | null;
  payment_status: string;
  practice_focus: string | null;
  last_question_worked_on: string | null;
};

type SessionRow = {
  id: string;
  created_at: string;
  session_number: number | null;
  readiness_score_end: number | null;
  questions_covered: string | null;
  practice_focus: string | null;
  strongest_moment: string | null;
};

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserRow | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!auth.user) {
        navigate({ to: "/login", replace: true });
        return;
      }
      const [{ data: u }, { data: s }] = await Promise.all([
        supabase
          .from("users")
          .select(
            "first_name, pathway, sessions_purchased, sessions_completed, access_expires_at, payment_status, practice_focus, last_question_worked_on"
          )
          .eq("id", auth.user.id)
          .maybeSingle(),
        supabase
          .from("sessions")
          .select(
            "id, created_at, session_number, readiness_score_end, questions_covered, practice_focus, strongest_moment"
          )
          .eq("user_id", auth.user.id)
          .order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;
      setUser((u as UserRow) ?? null);
      setSessions((s as SessionRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading your dashboard…
      </main>
    );
  }

  const remaining = user
    ? Math.max(0, (user.sessions_purchased ?? 0) - (user.sessions_completed ?? 0))
    : 0;
  const pct =
    user && user.sessions_purchased > 0
      ? Math.min(100, Math.round((user.sessions_completed / user.sessions_purchased) * 100))
      : 0;
  const expired =
    !!user?.access_expires_at && new Date(user.access_expires_at) < new Date();
  const exhausted = !!user && remaining <= 0 && user.pathway !== "club";
  const needsUpgrade = !user?.pathway || user.payment_status !== "active" || expired || exhausted;

  const last = sessions[sessions.length - 1];
  const scores = sessions
    .map((s) => s.readiness_score_end)
    .filter((v): v is number => typeof v === "number");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight">Bramwell</span>
            <span className="text-lg font-light tracking-tight" style={{ color: "var(--primary)" }}>
              AI
            </span>
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/login", replace: true });
            }}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
          {user?.first_name ? `Welcome back, ${user.first_name}.` : "Welcome back."}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {user?.pathway ? `Plan · ${user.pathway}` : "No active plan yet"}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Card label="Sessions completed" value={`${user?.sessions_completed ?? 0} / ${user?.sessions_purchased ?? 0}`}>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: "var(--gradient-gold)" }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{remaining} remaining</p>
          </Card>

          <Card
            label="Latest readiness score"
            value={scores.length ? `${scores[scores.length - 1]}` : "—"}
          >
            {scores.length > 1 ? (
              <Sparkline values={scores} />
            ) : (
              <p className="mt-4 text-xs text-muted-foreground">
                Complete a session to start tracking.
              </p>
            )}
          </Card>

          <Card
            label="Access"
            value={
              expired
                ? "Expired"
                : user?.access_expires_at
                ? new Date(user.access_expires_at).toLocaleDateString()
                : "—"
            }
          >
            <p className="mt-3 text-xs text-muted-foreground">
              {user?.payment_status === "active" ? "Active plan" : "Awaiting payment"}
            </p>
          </Card>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-foreground/[0.02] p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Last session
            </p>
            {last ? (
              <div className="mt-4 space-y-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Date · </span>
                  {new Date(last.created_at).toLocaleDateString()}
                </p>
                {last.questions_covered && (
                  <p>
                    <span className="text-muted-foreground">Worked on · </span>
                    {last.questions_covered}
                  </p>
                )}
                {last.strongest_moment && (
                  <p>
                    <span className="text-muted-foreground">Strongest moment · </span>
                    {last.strongest_moment}
                  </p>
                )}
                {last.practice_focus && (
                  <p>
                    <span className="text-muted-foreground">Practice focus · </span>
                    {last.practice_focus}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                You haven't completed a session yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-foreground/[0.02] p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Next step
            </p>
            {needsUpgrade ? (
              <>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {expired
                    ? "Your access has expired."
                    : exhausted
                    ? "You're out of sessions."
                    : "Choose a pathway to begin."}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {expired || exhausted
                    ? "Renew or upgrade to keep training with Bramwell."
                    : "Pick the pathway that matches the moment you're in."}
                </p>
                <Link
                  to="/pricing"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "var(--primary-foreground)",
                    boxShadow: "var(--shadow-elegant)",
                  }}
                >
                  See pathways →
                </Link>
              </>
            ) : (
              <>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  Ready when you are.
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Pick up where you left off in the coaching portal.
                </p>
                <Link
                  to="/portal"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition hover:opacity-95"
                  style={{
                    background: "var(--gradient-gold)",
                    color: "var(--primary-foreground)",
                    boxShadow: "var(--shadow-elegant)",
                  }}
                >
                  Start next session →
                </Link>
              </>
            )}
          </div>
        </div>

        {sessions.length > 0 && (
          <div className="mt-10 rounded-2xl border border-border bg-foreground/[0.02] p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Session history
            </p>
            <div className="mt-5 divide-y divide-border">
              {sessions
                .slice()
                .reverse()
                .map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        Session {s.session_number ?? sessions.length - i}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString()}
                        {s.questions_covered ? ` · ${s.questions_covered}` : ""}
                      </p>
                    </div>
                    <div
                      className="shrink-0 text-base font-semibold tabular-nums"
                      style={{ color: "var(--primary)" }}
                    >
                      {s.readiness_score_end ?? "—"}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Card({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-foreground/[0.02] p-7">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {children}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 200;
  const h = 48;
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);
  const range = Math.max(1, max - min);
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 h-12 w-full"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
        style={{ color: "oklch(0.78 0.13 78)" }}
      />
    </svg>
  );
}