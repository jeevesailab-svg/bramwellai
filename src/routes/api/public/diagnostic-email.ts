import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const Schema = z.object({
  sessionId: z.string().uuid(),
  email: z.string().trim().email().max(255),
  first_name: z.string().trim().min(1).max(80).optional(),
});

export const Route = createFileRoute("/api/public/diagnostic-email")({
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

        const { data: row, error: updErr } = await supabaseAdmin
          .from("diagnostic_sessions")
          .update({
            email: d.email.toLowerCase(),
            first_name: d.first_name ?? null,
          })
          .eq("id", d.sessionId)
          .select(
            "first_name, email, communication_type, readiness_score, gaps, career_moment, recommended_pathway, recommended_pathway_name, recommended_price, metrics",
          )
          .maybeSingle();
        if (updErr || !row) {
          console.error("diagnostic-email update failed", updErr);
          return Response.json({ error: "Database error" }, { status: 500 });
        }

        // Send the readiness report directly via Resend (connector gateway).
        const lovableKey = process.env.LOVABLE_API_KEY;
        const resendKey = process.env.RESEND_API_KEY;
        if (lovableKey && resendKey) {
          try {
            const html = renderReportEmail(row);
            const sendRes = await fetch(
              "https://connector-gateway.lovable.dev/resend/emails",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${lovableKey}`,
                  "X-Connection-Api-Key": resendKey,
                },
                body: JSON.stringify({
                  from: "Bramwell <onboarding@resend.dev>",
                  to: [row.email],
                  subject: `Your Bramwell Readiness Score: ${row.readiness_score}/100`,
                  html,
                }),
              },
            );
            if (!sendRes.ok) {
              console.warn(
                "Resend send failed",
                sendRes.status,
                await sendRes.text(),
              );
            }
          } catch (sendErr) {
            const msg = sendErr instanceof Error ? sendErr.message : String(sendErr);
            console.warn("Resend send threw", msg);
          }
        } else {
          console.warn("Skipping Resend send, missing LOVABLE_API_KEY or RESEND_API_KEY");
        }

        const zapUrl = process.env.ZAPIER_QUIZ_WEBHOOK_URL;
        if (zapUrl) {
          try {
            const zapRes = await fetch(zapUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                timestamp: new Date().toISOString(),
                source: "diagnostic",
                sessionId: d.sessionId,
                first_name: row.first_name,
                email: row.email,
                communication_type: row.communication_type,
                readiness_score: row.readiness_score,
                gaps: row.gaps,
                career_moment: row.career_moment,
                recommended_pathway: row.recommended_pathway,
                recommended_pathway_name: row.recommended_pathway_name,
                recommended_price: row.recommended_price,
              }),
            });
            console.log("Zapier diagnostic webhook", {
              status: zapRes.status,
              ok: zapRes.ok,
            });
          } catch (zapErr) {
            const msg =
              zapErr instanceof Error ? zapErr.message : String(zapErr);
            console.warn("Zapier diagnostic webhook failed", msg);
          }
        }

        // Fire Klaviyo "Completed Diagnostic" event tagged with recommended pathway
        const klaviyoKey = process.env.KLAVIYO_PRIVATE_API_KEY;
        if (klaviyoKey) {
          const pathway = (row.recommended_pathway ?? "unknown") as string;
          const pretty =
            row.recommended_pathway_name ??
            pathway.charAt(0).toUpperCase() + pathway.slice(1);
          try {
            const kRes = await fetch("https://a.klaviyo.com/api/events/", {
              method: "POST",
              headers: {
                Authorization: `Klaviyo-API-Key ${klaviyoKey}`,
                "Content-Type": "application/json",
                accept: "application/json",
                revision: "2024-10-15",
              },
              body: JSON.stringify({
                data: {
                  type: "event",
                  attributes: {
                    properties: {
                      pathway,
                      source: "diagnostic_complete",
                      readiness_score: row.readiness_score,
                      communication_type: row.communication_type,
                      career_moment: row.career_moment,
                      recommended_price: row.recommended_price,
                    },
                    metric: {
                      data: {
                        type: "metric",
                        attributes: { name: `Completed Diagnostic, ${pretty}` },
                      },
                    },
                    profile: {
                      data: {
                        type: "profile",
                        attributes: {
                          email: row.email,
                          first_name: row.first_name ?? undefined,
                        },
                      },
                    },
                  },
                },
              }),
            });
            if (!kRes.ok && kRes.status !== 202) {
              console.warn("Klaviyo completion failed", kRes.status, await kRes.text());
            }
          } catch (kErr) {
            const msg = kErr instanceof Error ? kErr.message : String(kErr);
            console.warn("Klaviyo completion fetch failed", msg);
          }
        }

        return Response.json({ ok: true });
      },
    },
  },
});