import { createFileRoute } from "@tanstack/react-router";

const MAX_PER_IP_PER_DAY = 3;

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export const Route = createFileRoute("/api/public/diagnostic-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const ip = clientIp(request);

        // Per-IP quota: count completed diagnostics only. Failed, disconnected,
        // or incomplete test starts should not block another attempt.
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count, error: countErr } = await supabaseAdmin
          .from("diagnostic_sessions")
          .select("id", { count: "exact", head: true })
          .eq("ip_address", ip)
          .gte("completed_at", since);
        if (countErr) {
          console.error("diagnostic-token: count failed", countErr);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        if ((count ?? 0) >= MAX_PER_IP_PER_DAY) {
          return Response.json(
            {
              error:
                "You've used your free diagnostics for today. Come back tomorrow or pick a coaching pathway to keep going.",
            },
            { status: 429 },
          );
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        const agentId = process.env.ELEVENLABS_DIAGNOSTIC_AGENT_ID;
        if (!apiKey || !agentId) {
          console.error("diagnostic-token: missing ElevenLabs config");
          return Response.json(
            { error: "Diagnostic is not configured" },
            { status: 500 },
          );
        }

        const res = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
          { headers: { "xi-api-key": apiKey } },
        );
        if (!res.ok) {
          const txt = await res.text();
          console.error("ElevenLabs diagnostic token error:", res.status, txt);

          if (/missing_permissions/i.test(txt)) {
            const { data: row, error: insertErr } = await supabaseAdmin
              .from("diagnostic_sessions")
              .insert({ ip_address: ip })
              .select("id")
              .single();
            if (insertErr || !row) {
              console.error("diagnostic-token: insert failed", insertErr);
              return Response.json({ error: "Server error" }, { status: 500 });
            }

            return Response.json({
              agentId,
              sessionId: row.id,
              authMode: "public-agent",
            });
          }

          return Response.json(
            { error: "Could not start diagnostic" },
            { status: 502 },
          );
        }
        const { token } = (await res.json()) as { token: string };

        // Record this attempt (counts toward the 24h limit).
        const { data: row, error: insertErr } = await supabaseAdmin
          .from("diagnostic_sessions")
          .insert({ ip_address: ip })
          .select("id")
          .single();
        if (insertErr || !row) {
          console.error("diagnostic-token: insert failed", insertErr);
          return Response.json({ error: "Server error" }, { status: 500 });
        }

        return Response.json({ token, agentId, sessionId: row.id });
      },
    },
  },
});