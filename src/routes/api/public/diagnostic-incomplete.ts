import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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

const Schema = z.object({
  sessionId: z.string().uuid(),
  transcript: z.string().max(50000).optional().default(""),
});

function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

function countPattern(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function extractUserAnswer(transcript: string): string {
  const userLines = transcript
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => /^you:/i.test(line))
    .map((line) => line.replace(/^you:\s*/i, "").trim())
    .filter(Boolean);
  return (userLines.length ? userLines : [transcript]).join(" ").trim();
}

function routePathway(input: {
  communication_type: CommunicationType;
  readiness_score: number;
}): { key: PathwayKey; name: string; price: string } {
  const { communication_type: type, readiness_score: score } = input;
  if (score >= 80 || type === "next_level_leader") return { key: "club", ...PATHWAY.club };
  if (score < 40) return { key: "graduate", ...PATHWAY.graduate };
  if (type === "apologiser") return { key: "comeback", ...PATHWAY.comeback };
  return { key: "confidence", ...PATHWAY.confidence };
}

function scoreFromTranscript(transcript: string) {
  const answer = extractUserAnswer(transcript);
  const tokenList = words(answer);
  const wordCount = tokenList.length;
  if (wordCount < 3) return null;

  const lower = ` ${answer.toLowerCase()} `;
  const fillerTop = [
    { word: "um", count: countPattern(lower, /\bum+\b/g) },
    { word: "uh", count: countPattern(lower, /\buh+\b/g) },
    { word: "like", count: countPattern(lower, /\blike\b/g) },
    { word: "you know", count: countPattern(lower, /\byou know\b/g) },
    { word: "basically", count: countPattern(lower, /\bbasically\b/g) },
    { word: "actually", count: countPattern(lower, /\bactually\b/g) },
  ].filter((item) => item.count > 0);
  const fillerTotal = fillerTop.reduce((sum, item) => sum + item.count, 0);
  const hedgeSamples = [
    "I think",
    "maybe",
    "kind of",
    "sort of",
    "just",
    "I guess",
    "probably",
    "sorry",
    "hopefully",
  ].filter((phrase) => lower.includes(` ${phrase.toLowerCase()} `));
  const hedgeTotal = hedgeSamples.reduce(
    (sum, phrase) =>
      sum + countPattern(lower, new RegExp(`\\b${phrase.replace(/ /g, "\\s+")}\\b`, "g")),
    0,
  );
  const specificitySignals = countPattern(
    lower,
    /\b\d+[\d,%$]*\b|\b(team|client|customer|revenue|cost|deadline|project|launched|delivered|improved|reduced|increased|managed|led|built|saved|result|impact|outcome)s?\b/g,
  );
  const structureSignals = countPattern(
    lower,
    /\b(first|second|third|finally|because|example|for example|situation|task|action|result|what i did|the outcome|my role|the reason)\b/g,
  );
  const opening = tokenList.slice(0, 16).join(" ");
  const ledWithPoint = /\b(i am|i'm|my strength|my role|i bring|i led|i built|i delivered|the reason|because)\b/.test(
    opening,
  );

  const fillerDensity = wordCount ? fillerTotal / wordCount : 0;
  const hedgeDensity = wordCount ? hedgeTotal / wordCount : 0;
  const lengthPenalty = wordCount > 180 ? 16 : wordCount > 130 ? 8 : wordCount < 25 ? 12 : 0;
  const rambleScore = Math.max(
    0,
    Math.min(100, Math.round((wordCount > 120 ? 35 : 10) + fillerDensity * 650 + hedgeDensity * 500 + lengthPenalty)),
  );

  let structureScore = 8 + Math.min(10, structureSignals * 3) + (ledWithPoint ? 7 : 0);
  let specificityScore = 6 + Math.min(15, specificitySignals * 3) + (/[0-9]/.test(answer) ? 4 : 0);
  let confidenceScore = 18 - Math.min(12, hedgeTotal * 2) - Math.min(8, fillerTotal);
  let relevanceScore = wordCount >= 45 && wordCount <= 130 ? 20 : wordCount >= 25 ? 14 : 8;

  if (wordCount < 20) {
    structureScore = Math.min(structureScore, 10);
    specificityScore = Math.min(specificityScore, 8);
    confidenceScore = Math.min(confidenceScore, 10);
    relevanceScore = Math.min(relevanceScore, 7);
  }

  const readiness_score = Math.max(
    12,
    Math.min(
      92,
      Math.round(structureScore + specificityScore + confidenceScore + relevanceScore - lengthPenalty),
    ),
  );

  const communication_type: CommunicationType =
    readiness_score >= 80
      ? "next_level_leader"
      : hedgeTotal >= 3 || /\bsorry\b/.test(lower)
        ? "apologiser"
        : rambleScore >= 55
          ? "rambler"
          : wordCount > 110 && specificitySignals < 4
            ? "over_explainer"
            : specificitySignals < 3
              ? "under_seller"
              : "invisible_achiever";

  const gaps = [
    !ledWithPoint
      ? "You did not lead with the point, so the listener has to work too hard before they know why your answer matters."
      : null,
    specificitySignals < 4
      ? "You need more concrete evidence, numbers, outcomes, examples, or stakes, so your answer proves value instead of describing effort."
      : null,
    hedgeTotal + fillerTotal > 2
      ? "Hedging and filler words softened your authority, making you sound less certain than your experience should."
      : null,
    wordCount > 130
      ? "The answer ran long, which makes strong points harder to remember and gives the room too many threads to follow."
      : null,
    wordCount < 35
      ? "The answer was too thin, you need enough structure and evidence for the room to understand your level."
      : null,
  ].filter((gap): gap is string => Boolean(gap));

  while (gaps.length < 3) {
    gaps.push(
      [
        "Turn the answer into a clear before, action, result sequence so it sounds intentional rather than improvised.",
        "Name the commercial or human impact earlier, not just the task you completed.",
        "Finish with a confident closing line that tells the listener exactly what to remember about you.",
      ][gaps.length],
    );
  }

  const pathway = routePathway({ communication_type, readiness_score });
  return {
    communication_type,
    readiness_score,
    gaps: gaps.slice(0, 3),
    recommended_pathway: pathway.key,
    recommended_pathway_name: pathway.name,
    recommended_price: pathway.price,
    metrics: {
      filler_words: { total: fillerTotal, top: fillerTop.slice(0, 5) },
      hedging: { total: hedgeTotal, samples: hedgeSamples.slice(0, 5) },
      structure: {
        time_to_point_sec: ledWithPoint ? 3 : Math.min(45, Math.max(8, Math.round(wordCount / 4))),
        led_with_point: ledWithPoint,
        ramble_score: rambleScore,
      },
    },
  };
}

export const Route = createFileRoute("/api/public/diagnostic-incomplete")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        let parsed: z.infer<typeof Schema>;
        try {
          const body = await request.json();
          const result = Schema.safeParse(body);
          if (!result.success) {
            return Response.json({ error: "Invalid body" }, { status: 400 });
          }
          parsed = result.data;
        } catch {
          return Response.json({ error: "Invalid body" }, { status: 400 });
        }

        const fallback = scoreFromTranscript(parsed.transcript);

        if (fallback) {
          const { error } = await supabaseAdmin
            .from("diagnostic_sessions")
            .update({
              completed_at: new Date().toISOString(),
              needs_followup: false,
              ended_at: new Date().toISOString(),
              communication_type: fallback.communication_type,
              readiness_score: fallback.readiness_score,
              gaps: fallback.gaps,
              recommended_pathway: fallback.recommended_pathway,
              recommended_pathway_name: fallback.recommended_pathway_name,
              recommended_price: fallback.recommended_price,
              transcript: parsed.transcript || null,
              metrics: fallback.metrics,
            })
            .eq("id", parsed.sessionId)
            .is("completed_at", null);

          if (error) {
            console.error("diagnostic-incomplete: fallback score failed", error);
            return Response.json({ error: "Server error" }, { status: 500 });
          }
          return Response.json({ ok: true, completed: true });
        }

        // Only flag rows that never received a result (completed_at IS NULL).
        const { error } = await supabaseAdmin
          .from("diagnostic_sessions")
          .update({
            needs_followup: true,
            ended_at: new Date().toISOString(),
            transcript: parsed.transcript || null,
          })
          .eq("id", parsed.sessionId)
          .is("completed_at", null);

        if (error) {
          console.error("diagnostic-incomplete: update failed", error);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
        return Response.json({ ok: true, completed: false });
      },
    },
  },
});