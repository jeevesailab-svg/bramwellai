import { createServerFn } from "@tanstack/react-start";

/**
 * Mints a short-lived WebRTC conversation token for the configured
 * ElevenLabs coaching agent. Keeps the API key server-side; the agent ID
 * is also returned so the client doesn't need it in its bundle.
 */
export const getElevenLabsCoachToken = createServerFn({ method: "POST" }).handler(
  async () => {
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
  },
);