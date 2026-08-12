import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getGrowthSnapshot } from "@/lib/growth.functions";

export const Route = createFileRoute("/growth")({
  component: GrowthDashboard,
  head: () => ({
    meta: [
      { title: "Growth dashboard | Bramwell AI" },
      { name: "description", content: "Internal funnel and acquisition dashboard." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Growth dashboard | Bramwell AI" },
      { property: "og:description", content: "Internal funnel and acquisition dashboard." },
    ],
  }),
});

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-foreground/[0.03] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function GrowthDashboard() {
  const fetchSnapshot = useServerFn(getGrowthSnapshot);
  const { data, isLoading, error } = useQuery({
    queryKey: ["growth-snapshot"],
    queryFn: () => fetchSnapshot({}),
    refetchInterval: 60_000,
  });

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Growth dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Live funnel from the database. Objective: 200 sign-ups.
        </p>

        {isLoading ? <p className="mt-10 text-sm text-muted-foreground">Loading…</p> : null}
        {error ? <p className="mt-10 text-sm text-destructive">Could not load data.</p> : null}

        {data ? (
          <>
            <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Stat label="Page views" value={data.funnel.pageViews} sub="tracked since instrumentation" />
              <Stat label="Diagnostic starts" value={data.funnel.diagnosticStarts} />
              <Stat
                label="Completions"
                value={data.funnel.diagnosticCompletions}
                sub={`${data.rates.startToComplete}% of starts`}
              />
              <Stat
                label="Emails captured"
                value={data.funnel.emailsCaptured}
                sub={`${data.rates.startToEmail}% of starts`}
              />
              <Stat
                label="Accounts"
                value={data.funnel.accounts}
                sub={`${data.rates.emailToAccount}% of emails`}
              />
              <Stat
                label="Purchases"
                value={data.funnel.purchases}
                sub={`${data.rates.accountToPurchase}% of accounts`}
              />
            </section>

            <section className="mt-12">
              <h2 className="text-lg font-semibold tracking-tight">Progress to target</h2>
              <div className="mt-4 space-y-4">
                {data.targets.map((t) => {
                  const pct = Math.min(100, Math.round((t.current / t.target) * 100));
                  return (
                    <div key={t.label}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span>{t.label}</span>
                        <span className="text-muted-foreground">
                          {t.current} / {t.target}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: "var(--gradient-gold)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-lg font-semibold tracking-tight">By traffic source</h2>
              {data.bySource.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No attributed traffic recorded yet. Data appears as soon as visitors land.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-foreground/[0.03] text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Source</th>
                        <th className="px-4 py-3">Visitors</th>
                        <th className="px-4 py-3">Starts</th>
                        <th className="px-4 py-3">Emails</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.bySource.map((s) => (
                        <tr key={s.source} className="border-t border-border">
                          <td className="px-4 py-3 font-medium">{s.source}</td>
                          <td className="px-4 py-3">{s.sessions}</td>
                          <td className="px-4 py-3">{s.starts}</td>
                          <td className="px-4 py-3">{s.emails}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2 className="text-lg font-semibold tracking-tight">Last 30 days</h2>
              {data.daily.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No sessions in the last 30 days.</p>
              ) : (
                <div className="mt-4 flex items-end gap-1 overflow-x-auto">
                  {data.daily.map((d) => {
                    const max = Math.max(...data.daily.map((x) => x.starts), 1);
                    return (
                      <div key={d.day} className="flex min-w-[18px] flex-1 flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${Math.max(4, (d.starts / max) * 120)}px`,
                            background: "var(--gradient-gold)",
                          }}
                          title={`${d.day}: ${d.starts} starts, ${d.completions} completed`}
                        />
                        <span className="text-[9px] text-muted-foreground">{d.day.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
