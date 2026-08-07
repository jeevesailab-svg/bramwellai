import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { extractUserSpeech } from "@/lib/scoring";

const Schema = z.object({ sessionId: z.string().uuid() });

type Rewrite = { original: string; rewritten: string; why: string };

/** Pick the single line most worth rebuilding: longest, hedged, unspecific. */
function pickTargetSentence(speech: string): string | null {
  const sents = speech
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 8);
  if (sents.length === 0) return null;
  const hedges = ["i think", "i guess", "maybe", "just", "sort of", "kind of", "probably", "hopefully", "i would say"];
  const score = (s: string) => {
    const l = ` ${s.toLowerCase()} `;
    const hedgeHits = hedges.filter((h) => l.includes(` ${h} `)).length;
    const hasNumber = /\d/.test(s) ? 1 : 0;
    return s.split(/\s+/).length * 0.4 + hedgeHits * 12 - hasNumber * 10;
  };
  return [...sents].sort((a, b) => score(b) - score(a))[0] ?? null;
}

export const Route = createFileRoute("/api/public/diagnostic-rewrite")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = Schema.safeParse(body);
        if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

        const { data, error } = await supabaseAdmin
          .from("diagnostic_sessions")
          .select("id, transcript, metrics, completed_at")
          .eq("id", parsed.data.sessionId)
          .maybeSingle();
        if (error) {
          console.error("diagnostic-rewrite select failed", error);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        if (!data) return Response.json({ error: "Not found" }, { status: 404 });

        const metrics = (data.metrics ?? {}) as Record<string, unknown>;
        const cached = metrics.rewrite as Rewrite | undefined;
        if (cached?.rewritten) return Response.json({ rewrite: cached });

        if (!data.transcript) return Response.json({ rewrite: null });
        const speech = extractUserSpeech(data.transcript);
        const target = pickTargetSentence(speech);
        if (!target) return Response.json({ rewrite: null });

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          console.error("diagnostic-rewrite missing LOVABLE_API_KEY");
          return Response.json({ rewrite: null });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content:
                  "You are Bramwell, an executive communication coach. Rebuild one spoken sentence so it leads with the point, cuts hedging and adds a concrete anchor. Australian English. Never use em dashes. Keep the speaker's own facts, never invent numbers or achievements. If a number is missing, use a clearly marked placeholder in square brackets. Return strict JSON only: {\"rewritten\": string, \"why\": string}. rewritten is one or two spoken sentences under 45 words. why is one sentence under 25 words naming what changed.",
              },
              { role: "user", content: `Original spoken line:\n"""${target}"""` },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!res.ok) {
          if (res.status === 429) return Response.json({ error: "Busy" }, { status: 429 });
          console.error("diagnostic-rewrite gateway failed", res.status, await res.text());
          return Response.json({ rewrite: null });
        }

        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const raw = json.choices?.[0]?.message?.content ?? "";
        let out: { rewritten?: string; why?: string } = {};
        try {
          out = JSON.parse(raw);
        } catch {
          console.error("diagnostic-rewrite unparsable model output");
          return Response.json({ rewrite: null });
        }
        if (!out.rewritten) return Response.json({ rewrite: null });

        const rewrite: Rewrite = {
          original: target,
          rewritten: String(out.rewritten).slice(0, 600),
          why: String(out.why ?? "").slice(0, 240),
        };

        const { error: updateError } = await supabaseAdmin
          .from("diagnostic_sessions")
          .update({ metrics: { ...metrics, rewrite } })
          .eq("id", data.id);
        if (updateError) console.error("diagnostic-rewrite save failed", updateError);

        return Response.json({ rewrite });
      },
    },
  },
});
