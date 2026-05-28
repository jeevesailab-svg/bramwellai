import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Mints a short-lived WebRTC conversation token for the configured
 * ElevenLabs coaching agent. Keeps the API key server-side; the agent ID
 * is also returned so the client doesn't need it in its bundle.
 *
 * Requires an authenticated user with an active paid plan and remaining
 * sessions — prevents anonymous token harvesting / quota abuse.
 */
export const getElevenLabsCoachToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;

    // Verify the user has an active paid plan with sessions remaining.
    const { data: row, error: rowErr } = await supabaseAdmin
      .from("users")
      .select(
        "payment_status, sessions_purchased, sessions_completed, access_expires_at",
      )
      .eq("id", userId)
      .maybeSingle();
    if (rowErr) {
      console.error("coach token: user lookup failed", rowErr);
      throw new Error("Unable to verify access");
    }
    const isPaid = row?.payment_status === "paid";
    const hasSessionsLeft =
      (row?.sessions_purchased ?? 0) > (row?.sessions_completed ?? 0);
    const notExpired =
      !row?.access_expires_at || new Date(row.access_expires_at) > new Date();
    if (!isPaid || !hasSessionsLeft || !notExpired) {
      throw new Error("No active coaching plan");
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");
    if (!agentId) throw new Error("ELEVENLABS_AGENT_ID is not configured");

    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      { headers: { "xi-api-key": apiKey } },
    );
    if (!res.ok) {
      const txt = await res.text();
      console.error("ElevenLabs token error:", res.status, txt);
      throw new Error(`ElevenLabs token request failed (${res.status})`);
    }
    const { token } = (await res.json()) as { token: string };
    return { token, agentId };
  });