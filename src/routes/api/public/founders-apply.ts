import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { subscribeToNurture } from "@/lib/klaviyo.server";
import { sendTransactionalServerSide } from "@/lib/email/send.server";

const Schema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(200),
  teamSize: z.string().trim().min(1).max(80),
  role: z.string().trim().min(1).max(80),
  source: z.string().trim().max(80).optional(),
});

const KLAVIYO_REVISION = "2024-10-15";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export const Route = createFileRoute("/api/public/founders-apply")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders() }),
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders() });
        }

        const parsed = Schema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid input" }, { status: 400, headers: corsHeaders() });
        }

        const data = parsed.data;
        const normalizedEmail = data.email.toLowerCase();
        const eventSource = data.source ?? "founders_page";

        await subscribeToNurture(normalizedEmail, data.firstName, {
          company: data.company,
          team_size: data.teamSize,
          role: data.role,
          pathway: "enterprise",
        });

        // Track in Klaviyo if configured
        const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
        if (apiKey) {
          const klaviyoBody = {
            data: {
              type: "event",
              attributes: {
                properties: {
                  pathway: "enterprise",
                  source: eventSource,
                  first_name: data.firstName,
                  last_name: data.lastName,
                  company: data.company,
                  team_size: data.teamSize,
                  role: data.role,
                },
                metric: { data: { type: "metric", attributes: { name: "Applied, Enterprise Waitlist" } } },
                profile: {
                  data: {
                    type: "profile",
                    attributes: {
                      email: normalizedEmail,
                      first_name: data.firstName,
                      last_name: data.lastName,
                      properties: { company: data.company, team_size: data.teamSize, role: data.role },
                    },
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
              body: JSON.stringify(klaviyoBody),
            });
            if (!res.ok && res.status !== 202) {
              const text = await res.text();
              console.warn("Klaviyo event failed", res.status, text);
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn("Klaviyo fetch failed", msg);
          }
        }

        // Confirmation email to applicant
        const confirmation = await sendTransactionalServerSide({
          templateName: "founder-application-confirmation",
          recipientEmail: normalizedEmail,
          idempotencyKey: `founders-apply-confirm-${normalizedEmail}-${Date.now()}`,
          templateData: {
            firstName: data.firstName,
            bookingUrl: "https://calendar.app.google/QWKYUsrzx2k44UE76",
          },
        });
        if (!confirmation.ok) {
          console.warn("Founder confirmation email failed", confirmation.reason);
        }

        // Internal notification to team
        const internal = await sendTransactionalServerSide({
          templateName: "founder-application-internal",
          recipientEmail: "bramwell@bramwellai.com",
          idempotencyKey: `founders-apply-internal-${normalizedEmail}-${Date.now()}`,
          templateData: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: normalizedEmail,
            company: data.company,
            teamSize: data.teamSize,
            role: data.role,
            source: eventSource,
          },
        });
        if (!internal.ok) {
          console.warn("Founder internal email failed", internal.reason);
        }

        return Response.json({ ok: true }, { headers: corsHeaders() });
      },
    },
  },
});
