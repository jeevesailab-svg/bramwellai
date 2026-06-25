import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const Schema = z.object({
  first_name: z.string().min(1).max(80),
  email: z.string().email().max(255),
  communication_type: z.string().min(1).max(64),
  career_moment: z.string().max(32).optional().default(""),
  urgency: z.string().max(32).optional().default(""),
  recommended_pathway: z.string().min(1).max(32),
  recommended_pathway_name: z.string().min(1).max(120),
  recommended_price: z.string().min(1).max(32),
});

export const Route = createFileRoute("/api/public/quiz-lead")({
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
        const data = parsed.data;

        const { error: insertErr } = await supabaseAdmin
          .from("quiz_leads")
          .insert({
            email: data.email.toLowerCase(),
            first_name: data.first_name,
            communication_type: data.communication_type,
            career_moment: data.career_moment || null,
            urgency: data.urgency || null,
            recommended_pathway: data.recommended_pathway,
            recommended_price: data.recommended_price,
            source: "benchmark",
          });
        if (insertErr) {
          console.error("quiz_leads insert failed", insertErr);
          return Response.json({ error: "Database error" }, { status: 500 });
        }

        // Fire Zapier webhook server-side (URL never reaches the browser)
        const zapUrl = process.env.ZAPIER_QUIZ_WEBHOOK_URL;
        if (zapUrl) {
          try {
            const zapRes = await fetch(zapUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                timestamp: new Date().toISOString(),
                source: "benchmark",
                first_name: data.first_name,
                email: data.email.toLowerCase(),
                communication_type: data.communication_type,
                career_moment: data.career_moment,
                urgency: data.urgency,
                recommended_pathway: data.recommended_pathway,
                recommended_pathway_name: data.recommended_pathway_name,
                recommended_price: data.recommended_price,
              }),
            });
            const bodyText = await zapRes.text().catch(() => "");
            // Server-side logging only, never expose to the client
            console.log("Zapier webhook response", {
              status: zapRes.status,
              ok: zapRes.ok,
              body: bodyText.slice(0, 300),
            });
          } catch (zapErr) {
            const msg = zapErr instanceof Error ? zapErr.message : String(zapErr);
            console.warn("Zapier webhook failed", msg);
          }
        } else {
          console.warn("ZAPIER_QUIZ_WEBHOOK_URL not configured");
        }

        return Response.json({ ok: true });
      },
    },
  },
});