import { createFileRoute } from "@tanstack/react-router";
import { sendReceiptEmail } from "./webhook";

// Development-only helper for verifying the enrolment email renders and sends.
// Returns 404 in production builds.
export const Route = createFileRoute("/api/public/payments/test-email")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (process.env.NODE_ENV === "production") {
          return new Response("Not found", { status: 404 });
        }
        const to = new URL(request.url).searchParams.get("to");
        if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
          return Response.json({ error: "Provide ?to=<email>" }, { status: 400 });
        }
        const pathway = new URL(request.url).searchParams.get("pathway") || undefined;
        const isB2B = pathway === "founders";
        try {
          await sendReceiptEmail({
            to,
            firstName: isB2B ? "Alex" : "Sarah",
            productName: isB2B
              ? "Elite Sales Team Voice AI Coach — 30 Day Program"
              : "Speak Like a CEO, 30 Day Program",
            amountCents: isB2B ? 350000 : 34900,
            currency: "usd",
            pathwayWelcome: "",
            pathway: pathway === "founders" ? "founders" : undefined,
          });
          return Response.json({ ok: true, to, pathway: pathway || "b2c" });
        } catch (e) {
          return Response.json({ ok: false, error: String(e) }, { status: 500 });
        }
      },
    },
  },
});