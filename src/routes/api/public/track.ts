import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  eventName: z.string().min(1).max(80),
  sessionId: z.string().max(80).optional(),
  diagnosticSessionId: z.string().uuid().optional(),
  email: z.string().trim().email().max(255).optional(),
  path: z.string().max(400).optional(),
  referrer: z.string().max(600).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(160).optional(),
  utm_content: z.string().max(160).optional(),
  referral_code: z.string().max(60).optional(),
  properties: z.record(z.string(), z.any()).optional(),
});

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = Schema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }
        const d = parsed.data;

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("funnel_events").insert({
            event_name: d.eventName,
            session_id: d.sessionId ?? null,
            diagnostic_session_id: d.diagnosticSessionId ?? null,
            email: d.email?.toLowerCase() ?? null,
            path: d.path ?? null,
            referrer: d.referrer ?? null,
            utm_source: d.utm_source ?? null,
            utm_medium: d.utm_medium ?? null,
            utm_campaign: d.utm_campaign ?? null,
            utm_content: d.utm_content ?? null,
            referral_code: d.referral_code ?? null,
            properties: d.properties ?? {},
          });
          if (error) console.warn("track: insert failed", error.message);
        } catch (err) {
          console.warn("track: failed", err instanceof Error ? err.message : String(err));
        }

        return Response.json({ ok: true });
      },
    },
  },
});
