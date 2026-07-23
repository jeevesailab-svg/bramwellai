import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type ReportRow = {
  first_name: string | null;
  email: string;
  communication_type: string | null;
  readiness_score: number | null;
  gaps: unknown;
  career_moment: string | null;
  recommended_pathway: string | null;
  recommended_pathway_name: string | null;
  recommended_price: string | null;
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderReportEmail(row: ReportRow): string {
  const name = row.first_name ? esc(row.first_name) : "there";
  const score = row.readiness_score ?? 0;
  const type = (row.communication_type ?? "").replace(/_/g, " ");
  const pathway = row.recommended_pathway_name ?? "Career Confidence Club";
  const price = row.recommended_price ?? "A$79/month";
  const gapsArr: string[] = Array.isArray(row.gaps)
    ? (row.gaps as unknown[]).map(String)
    : [];
  const gapsHtml = gapsArr
    .map((g) => `<li style="margin:0 0 8px 0;">${esc(g)}</li>`)
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f8f4ec;color:#1a1a1a;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#7a6f5b;margin:0 0 12px;">Bramwell AI</p>
    <h1 style="font-size:22px;margin:0 0 20px;">Hi ${name}, here is your Readiness Score</h1>
    <div style="text-align:center;padding:24px;border:1px solid #e6e0d4;border-radius:16px;background:#ffffff;">
      <div style="font-size:64px;font-weight:600;color:#c4a04a;line-height:1;">${score}<span style="font-size:22px;color:#7a6f5b;font-weight:300;">/100</span></div>
      <p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#7a6f5b;margin:12px 0 0;">Communication Readiness</p>
    </div>
    ${type ? `<p style="margin:24px 0 8px;font-size:14px;color:#7a6f5b;text-transform:uppercase;letter-spacing:.2em;">Your communication type</p><p style="margin:0;font-size:18px;color:#c4a04a;text-transform:capitalize;">The ${esc(type)}</p>` : ""}
    ${gapsHtml ? `<h2 style="font-size:16px;margin:28px 0 12px;">Your top gaps</h2><ul style="padding-left:18px;margin:0;color:#333333;font-size:14px;line-height:1.6;">${gapsHtml}</ul>` : ""}
    <h2 style="font-size:16px;margin:28px 0 8px;">Recommended next step</h2>
    <p style="margin:0 0 20px;color:#333333;font-size:14px;line-height:1.6;">Join the ${esc(pathway)} at ${esc(price)}. Up to 3 voice sessions per week, monthly progress checks, cancel anytime.</p>
    <p style="margin:24px 0 0;font-size:12px;color:#7a6f5b;">Your full interactive report is on screen at bramwellai.lovable.app.</p>
  </div>
</body></html>`;
}

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
        if (lovableKey && resendKey && row.email) {
          try {
            const html = renderReportEmail({ ...row, email: row.email });
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