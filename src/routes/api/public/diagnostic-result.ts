import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { computeMetrics, readinessFromSubScores } from "@/lib/scoring";

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
  club: { name: "30 Day Voice Mastery Program", price: "$349 USD, one payment" },
} as const;

type CommunicationType =
  | "signal_gap"
  | "concision_gap"
  | "conviction_gap"
  | "structure_gap"
  | "authority_gap"
  | "command_edge";

type PathwayKey = keyof typeof PATHWAY;

function normalizeCommunicationType(value: unknown): CommunicationType | null {
  if (typeof value !== "string") return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const aliases: Record<string, CommunicationType> = {
    signal_gap: "signal_gap",
    concision_gap: "concision_gap",
    conviction_gap: "conviction_gap",
    structure_gap: "structure_gap",
    authority_gap: "authority_gap",
    command_edge: "command_edge",
    // Legacy archetype labels map onto the CEO readiness gaps.
    invisible_achiever: "signal_gap",
    invisible_achievers: "signal_gap",
    over_explainer: "concision_gap",
    overexplainer: "concision_gap",
    under_seller: "conviction_gap",
    underseller: "conviction_gap",
    rambler: "structure_gap",
    apologiser: "authority_gap",
    apologizer: "authority_gap",
    next_level_leader: "command_edge",
    nextlevelleader: "command_edge",
  };

  return aliases[normalized] ?? null;
}

function routePathway(input: {
  communication_type: CommunicationType;
  readiness_score: number;
  career_moment?: string;
}): { key: PathwayKey; name: string; price: string } {
  // Simple monthly pricing is the default primary recommendation for every
  // archetype. Career-moment hints still surface in the result copy, but the
  // purchase path is a single, low-friction subscription.
  return { key: "club", ...PATHWAY.club };
}

const Schema = z.object({
  sessionId: z.string().uuid(),
  first_name: z.string().min(1).max(80).optional(),
  email: z.string().email().max(255).optional(),
  communication_type: z.enum([
    "signal_gap",
    "concision_gap",
    "conviction_gap",
    "structure_gap",
    "authority_gap",
    "command_edge",
    // Accepted for backwards compatibility, normalised before storage.
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
  recommended_pathway: z
    .enum(["graduate", "comeback", "confidence", "executive", "club"])
    .optional()
    .default("club"),
  recommended_pathway_name: z.string().min(1).max(120).optional().default(PATHWAY.club.name),
  recommended_price: z.string().min(1).max(32).optional().default(PATHWAY.club.price),
  transcript: z.string().max(50000).optional().default(""),
  duration_sec: z.number().min(0).max(3600).optional(),
  metrics: MetricsSchema.optional(),
});

function normalizePayload(payload: unknown): unknown {
  if (!payload || Array.isArray(payload) || typeof payload !== "object") return payload;
  const envelope = payload as Record<string, unknown>;
  const input =
    envelope.parameters && typeof envelope.parameters === "object" && !Array.isArray(envelope.parameters)
      ? (envelope.parameters as Record<string, unknown>)
      : envelope.data && typeof envelope.data === "object" && !Array.isArray(envelope.data)
        ? (envelope.data as Record<string, unknown>)
        : envelope.payload && typeof envelope.payload === "object" && !Array.isArray(envelope.payload)
          ? (envelope.payload as Record<string, unknown>)
          : envelope;
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
    : typeof input.gaps === "string"
      ? input.gaps
          .split(/\n|;|\|/)
          .map((gap) => gap.trim())
          .filter(Boolean)
      : [input.gap_1, input.gap_2, input.gap_3].filter(Boolean);

  const metrics =
    typeof input.metrics === "string"
      ? (() => {
          try {
            return JSON.parse(input.metrics);
          } catch {
            return undefined;
          }
        })()
      : input.metrics;

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
    metrics,
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

        // Deterministic scoring. The agent's own number is only a fallback:
        // whenever we have enough of the user's own words, the score and the
        // behavioural metrics are computed here so the same transcript always
        // produces the same result and Day 1 can be compared to Day 30.
        const computed = d.transcript ? computeMetrics(d.transcript, d.duration_sec) : null;
        const readinessScore = computed
          ? readinessFromSubScores(computed.sub_scores)
          : d.readiness_score;
        const mergedMetrics = computed
          ? { ...(d.metrics ?? {}), ...computed }
          : (d.metrics ?? null);

        const { error } = await supabaseAdmin
          .from("diagnostic_sessions")
          .update({
            completed_at: new Date().toISOString(),
            first_name: d.first_name ?? null,
            email: d.email?.toLowerCase() ?? null,
            communication_type: d.communication_type,
            readiness_score: readinessScore,
            gaps: d.gaps,
            career_moment: d.career_moment || null,
            recommended_pathway: d.recommended_pathway,
            recommended_pathway_name: d.recommended_pathway_name,
            recommended_price: d.recommended_price,
            transcript: d.transcript || null,
            metrics: mergedMetrics,
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