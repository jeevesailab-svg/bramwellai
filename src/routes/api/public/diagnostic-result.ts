import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const MetricsSchema = z
  .object({
    filler_words: z
      .object({
        total: z.number().int().min(0).max(10000),
        top: z
          .array(
            z.object({
              word: z.string().min(1).max(40),
              count: z.number().int().min(0).max(10000),
            }),
          )
          .max(10),
      })
      .partial()
      .optional(),
    pace: z
      .object({
        words_per_minute: z.number().min(0).max(500),
        longest_pause_sec: z.number().min(0).max(120),
        long_pauses_count: z.number().int().min(0).max(500),
      })
      .partial()
      .optional(),
    hedging: z
      .object({
        total: z.number().int().min(0).max(10000),
        samples: z.array(z.string().min(1).max(120)).max(10),
      })
      .partial()
      .optional(),
    structure: z
      .object({
        time_to_point_sec: z.number().min(0).max(600),
        led_with_point: z.boolean(),
        ramble_score: z.number().min(0).max(100),
      })
      .partial()
      .optional(),
  })
  .partial();

const Schema = z.object({
  sessionId: z.string().uuid(),
  first_name: z.string().min(1).max(80).optional(),
  email: z.string().email().max(255).optional(),
  communication_type: z.enum([
    "invisible_achiever",
    "over_explainer",
    "under_seller",
    "rambler",
    "apologiser",
    "next_level_leader",
  ]),
  readiness_score: z.number().int().min(0).max(100),
  gaps: z.array(z.string().min(1).max(280)).min(1).max(5),
  career_moment: z.string().max(120).optional().default(""),
  recommended_pathway: z.enum([
    "graduate",
    "comeback",
    "confidence",
    "executive",
    "club",
  ]),
  recommended_pathway_name: z.string().min(1).max(120),
  recommended_price: z.string().min(1).max(32),
  transcript: z.string().max(50000).optional().default(""),
  metrics: MetricsSchema.optional(),
});

export const Route = createFileRoute("/api/public/diagnostic-result")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? url.searchParams.get("sessionId");
        if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
          if (request.headers.get("accept")?.includes("text/html")) {
            return Response.redirect(new URL("/diagnostic", url.origin), 302);
          }
          return Response.json({ error: "Invalid id" }, { status: 400 });
        }
        const { data, error } = await supabaseAdmin
          .from("diagnostic_sessions")
          .select(
            "id, first_name, email, communication_type, readiness_score, gaps, career_moment, recommended_pathway, recommended_pathway_name, recommended_price, completed_at, metrics",
          )
          .eq("id", id)
          .maybeSingle();
        if (error) {
          console.error("diagnostic-result GET failed", error);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        if (!data) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }
        if (!data.completed_at) {
          // Row exists but the agent never submitted a result. Surface this
          // distinctly so the result page can show the "try again" state
          // instead of a generic 404.
          return Response.json({ incomplete: true }, { status: 200 });
        }
        const { email, ...safe } = data;
        return Response.json({
          result: { ...safe, has_email: email !== null && email !== "" },
        });
      },
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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

        const { error } = await supabaseAdmin
          .from("diagnostic_sessions")
          .update({
            completed_at: new Date().toISOString(),
            first_name: d.first_name ?? null,
            email: d.email?.toLowerCase() ?? null,
            communication_type: d.communication_type,
            readiness_score: d.readiness_score,
            gaps: d.gaps,
            career_moment: d.career_moment || null,
            recommended_pathway: d.recommended_pathway,
            recommended_pathway_name: d.recommended_pathway_name,
            recommended_price: d.recommended_price,
            transcript: d.transcript || null,
            metrics: d.metrics ?? null,
          })
          .eq("id", d.sessionId);
        if (error) {
          console.error("diagnostic-result update failed", error);
          return Response.json({ error: "Database error" }, { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});