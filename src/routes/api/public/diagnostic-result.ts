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

const PATHWAY = {
  graduate: { name: "Graduate Interview Sprint", price: "$99 AUD" },
  comeback: { name: "Career Comeback Sprint", price: "$199 AUD" },
  confidence: { name: "Interview Confidence Sprint", price: "$249 AUD" },
  executive: { name: "Executive Communication Sprint", price: "$499 AUD" },
  club: { name: "Career Confidence Club", price: "$79 AUD / month" },
} as const;

type CommunicationType =
  | "invisible_achiever"
  | "over_explainer"
  | "under_seller"
  | "rambler"
  | "apologiser"
  | "next_level_leader";

type PathwayKey = keyof typeof PATHWAY;

function normalizeCommunicationType(value: unknown): CommunicationType | null {
  if (typeof value !== "string") return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const aliases: Record<string, CommunicationType> = {
    invisible_achiever: "invisible_achiever",
    invisible_achievers: "invisible_achiever",
    over_explainer: "over_explainer",
    overexplainer: "over_explainer",
    under_seller: "under_seller",
    underseller: "under_seller",
    rambler: "rambler",
    apologiser: "apologiser",
    apologizer: "apologiser",
    next_level_leader: "next_level_leader",
    nextlevelleader: "next_level_leader",
  };

  return aliases[normalized] ?? null;
}

function routePathway(input: {
  communication_type: CommunicationType;
  readiness_score: number;
  career_moment?: string;
}): { key: PathwayKey; name: string; price: string } {
  const moment = (input.career_moment ?? "").toLowerCase();
  const type = input.communication_type;
  const score = input.readiness_score;

  if (/(executive|board|c-?suite|cxo|director)/.test(moment)) {
    return { key: "executive", ...PATHWAY.executive };
  }
  if (/(graduate|student|university|college)/.test(moment)) {
    return { key: "graduate", ...PATHWAY.graduate };
  }
  if (/(redundan|career gap|career break|return to work|maternity)/.test(moment)) {
    return { key: "comeback", ...PATHWAY.comeback };
  }
  if (score >= 80 || type === "next_level_leader") return { key: "club", ...PATHWAY.club };
  if (score < 40) return { key: "graduate", ...PATHWAY.graduate };
  if (type === "apologiser") return { key: "comeback", ...PATHWAY.comeback };
  return { key: "confidence", ...PATHWAY.confidence };
}

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

function normalizePayload(payload: unknown): unknown {
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return payload;
  const input = payload as Record<string, unknown>;
  const communicationType = normalizeCommunicationType(input.communication_type);
  const score =
    typeof input.readiness_score === "number"
      ? Math.round(input.readiness_score)
      : typeof input.readiness_score === "string"
        ? Number.parseInt(input.readiness_score, 10)
        : Number.NaN;

  const careerMoment = typeof input.career_moment === "string" ? input.career_moment : "";
  const computedPathway =
    communicationType && Number.isFinite(score)
      ? routePathway({
          communication_type: communicationType,
          readiness_score: Math.max(0, Math.min(100, score)),
          career_moment: careerMoment,
        })
      : null;

  const rawGaps = Array.isArray(input.gaps)
    ? input.gaps
    : [input.gap_1, input.gap_2, input.gap_3].filter(Boolean);

  return {
    ...input,
    sessionId: input.sessionId ?? input.session_id,
    communication_type: communicationType ?? input.communication_type,
    readiness_score: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : input.readiness_score,
    gaps: rawGaps,
    career_moment: careerMoment,
    recommended_pathway: computedPathway?.key ?? input.recommended_pathway,
    recommended_pathway_name: computedPathway?.name ?? input.recommended_pathway_name,
    recommended_price: computedPathway?.price ?? input.recommended_price,
  };
}

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
        const parsed = Schema.safeParse(normalizePayload(payload));
        if (!parsed.success) {
          console.error("diagnostic-result invalid input", parsed.error.flatten());
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