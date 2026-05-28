import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const Schema = z.object({
  sessionId: z.string().uuid(),
  first_name: z.string().min(1).max(80).optional(),
  email: z.string().email().max(255).optional(),
  communication_type: z.string().min(1).max(64),
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
});

export const Route = createFileRoute("/api/public/diagnostic-result")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
          return Response.json({ error: "Invalid id" }, { status: 400 });
        }
        const { data, error } = await supabaseAdmin
          .from("diagnostic_sessions")
          .select(
            "id, first_name, email, communication_type, readiness_score, gaps, career_moment, recommended_pathway, recommended_pathway_name, recommended_price, completed_at",
          )
          .eq("id", id)
          .maybeSingle();
        if (error) {
          console.error("diagnostic-result GET failed", error);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        if (!data || !data.completed_at) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }
        return Response.json({ result: data });
      },
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