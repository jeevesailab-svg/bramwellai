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
        try {
          await sendReceiptEmail({
            to,
            firstName: "Sarah",
            productName: "Speak Like a CEO, 30 Day Program",
            amountCents: 34900,
            currency: "usd",
            pathwayWelcome: "",
          });
          return Response.json({ ok: true, to });
        } catch (e) {
          return Response.json({ ok: false, error: String(e) }, { status: 500 });
        }
      },
    },
  },
});