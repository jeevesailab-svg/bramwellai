import { createFileRoute } from "@tanstack/react-router";

// Cost controls for ElevenLabs Conversational AI (each signed URL = a paid session).
// Starts per IP is the primary abuse guard; completions cap reserves free-tier fairness;
// global starts is a circuit-breaker so a single bad actor / botnet can't drain the account.
const MAX_STARTS_PER_IP_PER_DAY = 6;
const MAX_COMPLETED_PER_IP_PER_DAY = 3;
const MAX_GLOBAL_STARTS_PER_DAY = 500;

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

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // 1. Per-IP STARTS cap — the real cost guard. Every mint of a signed URL costs
        //    ElevenLabs credits whether the user completes or not, so we cap attempts.
        const { count: ipStarts, error: ipStartsErr } = await supabaseAdmin
          .from("diagnostic_sessions")
          .select("id", { count: "exact", head: true })
          .eq("ip_address", ip)
          .gte("created_at", since);
        if (ipStartsErr) {
          console.error("diagnostic-token: ip starts count failed", ipStartsErr);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        if ((ipStarts ?? 0) >= MAX_STARTS_PER_IP_PER_DAY) {
          return Response.json(
            {
              error:
                "You've reached today's free session limit. Come back tomorrow or pick a coaching pathway to keep going.",
            },
            { status: 429 },
          );
        }

        // 2. Per-IP COMPLETIONS cap — one household shouldn't burn many full sessions.
        const { count: ipCompleted, error: ipDoneErr } = await supabaseAdmin
          .from("diagnostic_sessions")
          .select("id", { count: "exact", head: true })
          .eq("ip_address", ip)
          .gte("completed_at", since);
        if (ipDoneErr) {
          console.error("diagnostic-token: ip completed count failed", ipDoneErr);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        if ((ipCompleted ?? 0) >= MAX_COMPLETED_PER_IP_PER_DAY) {
          return Response.json(
            {
              error:
                "You've used your free diagnostics for today. Pick a coaching pathway to keep going.",
            },
            { status: 429 },
          );
        }

        // 3. GLOBAL circuit-breaker — hard ceiling on paid sessions per 24h across all users.
        const { count: globalStarts, error: globalErr } = await supabaseAdmin
          .from("diagnostic_sessions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", since);
        if (globalErr) {
          console.error("diagnostic-token: global count failed", globalErr);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        if ((globalStarts ?? 0) >= MAX_GLOBAL_STARTS_PER_DAY) {
          console.warn("diagnostic-token: global daily cap reached", { globalStarts });
          return Response.json(
            {
              error:
                "Bramwell is at capacity today. Please try again tomorrow, or start a coaching pathway now.",
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

        const signedUrlRes = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
          { headers: { "xi-api-key": apiKey } },
        );
        if (signedUrlRes.ok) {
          const { signed_url } = (await signedUrlRes.json()) as { signed_url?: string };
          if (signed_url) {
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
              signedUrl: signed_url,
              agentId,
              sessionId: row.id,
              authMode: "signed-url",
            });
          }
        } else {
          const txt = await signedUrlRes.text();
          console.error("ElevenLabs diagnostic signed-url error:", signedUrlRes.status, txt);

          if (/missing_permissions/i.test(txt)) {
            return Response.json(
              {
                error:
                  "Bramwell is not authorized yet. Please reconnect Maria's ElevenLabs with Conversational AI write permission enabled, then try again.",
              },
              { status: 502 },
            );
          }
        }

        // Fallback for accounts where signed URLs are temporarily unavailable.
        const tokenRes = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
          { headers: { "xi-api-key": apiKey } },
        );
        if (!tokenRes.ok) {
          const txt = await tokenRes.text();
          console.error("ElevenLabs diagnostic token error:", tokenRes.status, txt);

          if (/missing_permissions/i.test(txt)) {
            return Response.json(
              {
                error:
                  "Bramwell is not authorized yet. Please reconnect Maria's ElevenLabs with Conversational AI write permission enabled, then try again.",
              },
              { status: 502 },
            );
          }

          return Response.json(
            { error: "Could not start diagnostic" },
            { status: 502 },
          );
        }
        const { token } = (await tokenRes.json()) as { token?: string };
        if (!token) {
          console.error("diagnostic-token: missing ElevenLabs conversation token");
          return Response.json(
            { error: "Could not start diagnostic" },
            { status: 502 },
          );
        }

        // Record this attempt so any diagnostic result can be attached to it.
        const { data: row, error: insertErr } = await supabaseAdmin
          .from("diagnostic_sessions")
          .insert({ ip_address: ip })
          .select("id")
          .single();
        if (insertErr || !row) {
          console.error("diagnostic-token: insert failed", insertErr);
          return Response.json({ error: "Server error" }, { status: 500 });
        }

        return Response.json({ token, agentId, sessionId: row.id, authMode: "conversation-token" });
      },
    },
  },
});