import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getScoreBand } from "@/lib/scoreBand";

export const Route = createFileRoute("/portal/sessions/")({
  component: SessionHistoryPage,
  head: () => ({
    meta: [
      { title: "Session history, Bramwell AI" },
      {
        name: "description",
        content:
          "Every coaching session you have run with Bramwell, with the scores, the focus and the fix from each one.",
      },
      { property: "og:title", content: "Session history, Bramwell AI" },
      {
        property: "og:description",
        content:
          "Review what you said, what it scored and what Bramwell fixed in every session.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Row = {
  id: string;
  created_at: string;
  session_number: number | null;
  duration_minutes: number | null;
  practice_focus: string | null;
  readiness_score_start: number | null;
  readiness_score_end: number | null;
  session_status: string | null;
};

function SessionHistoryPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[] | null>(null);

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
          "id, created_at, session_number, duration_minutes, practice_focus, readiness_score_start, readiness_score_end, session_status",
        )
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setRows((data ?? []) as Row[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10">
        <Link
          to="/portal/coach"
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          ← Back to coaching
        </Link>
        <h1 className="mt-6 text-3xl font-semibold md:text-4xl">
          Your session history
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every session you have run, what it scored and what Bramwell told you
          to fix. Open any session to see the detail.
        </p>

        {rows === null ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border/50 bg-card/40 p-6">
            <p className="font-semibold">No sessions yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your first session appears here the moment you finish it, with the
              full score breakdown.
            </p>
            <Link
              to="/portal/coach"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-gold)" }}
            >
              Start your first session
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-3">
            {rows.map((r) => {
              const end = r.readiness_score_end;
              const start = r.readiness_score_start;
              const delta =
                typeof end === "number" && typeof start === "number"
                  ? end - start
                  : null;
              return (
                <li key={r.id}>
                  <Link
                    to="/portal/sessions/$sessionId"
                    params={{ sessionId: r.id }}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/40 p-5 transition hover:border-primary/40"
                  >
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Day {r.session_number ?? "-"} ·{" "}
                        {new Date(r.created_at).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                        })}
                        {r.duration_minutes ? ` · ${r.duration_minutes} min` : ""}
                      </p>
                      <p className="mt-1 truncate font-medium">
                        {r.practice_focus ?? "Session review"}
                      </p>
                      {typeof end === "number" && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {getScoreBand(end).label}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-semibold">
                        {typeof end === "number" ? end : "-"}
                      </p>
                      {delta !== null && delta !== 0 && (
                        <p
                          className="text-xs font-semibold"
                          style={{
                            color: delta > 0 ? "var(--primary)" : undefined,
                          }}
                        >
                          {delta > 0 ? "+" : ""}
                          {delta} this session
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
