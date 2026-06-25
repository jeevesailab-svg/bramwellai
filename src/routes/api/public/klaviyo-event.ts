import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().email().max(255).optional(),
  eventName: z.string().min(1).max(120),
  pathway: z.string().min(1).max(40),
  source: z.string().max(80).optional(),
  properties: z.record(z.string(), z.any()).optional(),
});

const KLAVIYO_REVISION = "2024-10-15";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export const Route = createFileRoute("/api/public/klaviyo-event")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: corsHeaders() }),
      POST: async ({ request }) => {
        const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
        if (!apiKey) {
          console.error("KLAVIYO_PRIVATE_API_KEY missing");
          return Response.json(
            { error: "Not configured" },
            { status: 500, headers: corsHeaders() },
          );
        }

        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json(
            { error: "Invalid JSON" },
            { status: 400, headers: corsHeaders() },
          );
        }
        const parsed = Schema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid input" },
            { status: 400, headers: corsHeaders() },
          );
        }
        const { email, eventName, pathway, source, properties } = parsed.data;

        // Klaviyo requires a profile identifier, skip silently if no email captured
        if (!email) {
          return Response.json(
            { ok: true, skipped: "no_email" },
            { headers: corsHeaders() },
          );
        }

        const body = {
          data: {
            type: "event",
            attributes: {
              properties: {
                pathway,
                source: source ?? "cta_click",
                ...(properties ?? {}),
              },
              metric: { data: { type: "metric", attributes: { name: eventName } } },
              profile: {
                data: {
                  type: "profile",
                  attributes: { email: email.toLowerCase() },
                },
              },
            },
          },
        };

        try {
          const res = await fetch("https://a.klaviyo.com/api/events/", {
            method: "POST",
            headers: {
              Authorization: `Klaviyo-API-Key ${apiKey}`,
              "Content-Type": "application/json",
              accept: "application/json",
              revision: KLAVIYO_REVISION,
            },
            body: JSON.stringify(body),
          });
          if (!res.ok && res.status !== 202) {
            const text = await res.text();
            console.warn("Klaviyo event failed", res.status, text);
            return Response.json(
              { ok: false, status: res.status },
              { status: 200, headers: corsHeaders() },
            );
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn("Klaviyo fetch failed", msg);
        }

        return Response.json({ ok: true }, { headers: corsHeaders() });
      },
    },
  },
});