import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/diagnostic-incomplete")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let sessionId: string | undefined;
        try {
          const body = (await request.json()) as { sessionId?: string };
          sessionId = body.sessionId;
        } catch {
          return Response.json({ error: "Invalid body" }, { status: 400 });
        }
        if (!sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId)) {
          return Response.json({ error: "Invalid sessionId" }, { status: 400 });
        }

        // Only flag rows that never received a result (completed_at IS NULL).
        const { error } = await supabaseAdmin
          .from("diagnostic_sessions")
          .update({
            needs_followup: true,
            ended_at: new Date().toISOString(),
          })
          .eq("id", sessionId)
          .is("completed_at", null);

        if (error) {
          console.error("diagnostic-incomplete: update failed", error);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});