import { createServerFn } from "@tanstack/react-start";

export type GrowthSnapshot = {
  funnel: {
    pageViews: number;
    diagnosticStarts: number;
    diagnosticCompletions: number;
    emailsCaptured: number;
    accounts: number;
    purchases: number;
  };
  rates: {
    startToComplete: number;
    startToEmail: number;
    emailToAccount: number;
    accountToPurchase: number;
  };
  bySource: { source: string; sessions: number; starts: number; emails: number }[];
  daily: { day: string; starts: number; completions: number; emails: number }[];
  targets: { label: string; current: number; target: number }[];
};

export const getGrowthSnapshot = createServerFn({ method: "GET" }).handler(
  async (): Promise<GrowthSnapshot> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const count = async (
      table: string,
      apply: (q: any) => any = (q) => q,
    ): Promise<number> => {
      const { count: c } = await apply(
        supabaseAdmin.from(table).select("id", { count: "exact", head: true }),
      );
      return c ?? 0;
    };

    const [starts, completions, withEmail, accounts, purchases, pageViews] =
      await Promise.all([
        count("diagnostic_sessions"),
        count("diagnostic_sessions", (q) => q.not("completed_at", "is", null)),
        count("diagnostic_sessions", (q) => q.not("email", "is", null)),
        count("users"),
        count("transactions"),
        count("funnel_events", (q) => q.eq("event_name", "page_view")),
      ]);

    const { data: events } = await supabaseAdmin
      .from("funnel_events")
      .select("event_name, utm_source, session_id, created_at")
      .order("created_at", { ascending: false })
      .limit(5000);

    const sourceMap = new Map<
      string,
      { sessions: Set<string>; starts: number; emails: number }
    >();
    for (const e of events ?? []) {
      const key = e.utm_source || "direct";
      const bucket =
        sourceMap.get(key) ?? { sessions: new Set<string>(), starts: 0, emails: 0 };
      if (e.session_id) bucket.sessions.add(e.session_id);
      if (e.event_name === "diagnostic_start") bucket.starts += 1;
      if (e.event_name === "email_captured") bucket.emails += 1;
      sourceMap.set(key, bucket);
    }
    const bySource = [...sourceMap.entries()]
      .map(([source, b]) => ({
        source,
        sessions: b.sessions.size,
        starts: b.starts,
        emails: b.emails,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 12);

    const { data: sessions } = await supabaseAdmin
      .from("diagnostic_sessions")
      .select("created_at, completed_at, email")
      .gte(
        "created_at",
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      );

    const dayMap = new Map<
      string,
      { starts: number; completions: number; emails: number }
    >();
    for (const s of sessions ?? []) {
      const day = String(s.created_at).slice(0, 10);
      const b = dayMap.get(day) ?? { starts: 0, completions: 0, emails: 0 };
      b.starts += 1;
      if (s.completed_at) b.completions += 1;
      if (s.email) b.emails += 1;
      dayMap.set(day, b);
    }
    const daily = [...dayMap.entries()]
      .map(([day, b]) => ({ day, ...b }))
      .sort((a, b) => (a.day < b.day ? -1 : 1));

    const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

    return {
      funnel: {
        pageViews,
        diagnosticStarts: starts,
        diagnosticCompletions: completions,
        emailsCaptured: withEmail,
        accounts,
        purchases,
      },
      rates: {
        startToComplete: pct(completions, starts),
        startToEmail: pct(withEmail, starts),
        emailToAccount: pct(accounts, withEmail),
        accountToPurchase: pct(purchases, accounts),
      },
      bySource,
      daily,
      targets: [
        { label: "Diagnostic completion", current: pct(completions, starts), target: 55 },
        { label: "Email capture", current: pct(withEmail, starts), target: 60 },
        { label: "Email to account", current: pct(accounts, withEmail), target: 25 },
        { label: "Sign-ups", current: accounts, target: 200 },
      ],
    };
  },
);
