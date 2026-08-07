/**
 * Deterministic communication scoring.
 *
 * Same transcript in, same numbers out. The voice agent supplies the
 * transcript and the qualitative read; the numbers below are computed here
 * so a Readiness Score is measurable, repeatable and comparable across
 * Day 1 and Day 30.
 */

export type SubScores = {
  structure: number;
  specificity: number;
  confidence: number;
  relevance: number;
};

export type Evidence = {
  /** Verbatim sentence pulled from the user's own words. */
  quote: string;
  /** Which dimension the quote is evidence for. */
  dimension: keyof SubScores;
  /** Plain-language reason the quote matters. */
  note: string;
};

export type ComputedMetrics = {
  filler_words: { total: number; per_100_words: number; top: { word: string; count: number }[] };
  pace: { words_per_minute: number; word_count: number; duration_sec: number };
  hedging: { total: number; per_100_words: number; samples: string[] };
  structure: { time_to_point_sec: number; led_with_point: boolean; ramble_score: number };
  specificity: { numbers_used: number; first_person_ratio: number; concrete_markers: number };
  sub_scores: SubScores;
  evidence: Evidence[];
  computed: true;
};

const FILLERS = [
  "um", "uh", "erm", "ah", "like", "basically", "actually", "literally",
  "you know", "i mean", "sort of", "kind of", "yeah so", "right so",
];

const HEDGES = [
  "i think", "i guess", "i suppose", "maybe", "probably", "hopefully",
  "just", "sorry", "a bit", "a little bit", "i'm not sure", "im not sure",
  "if that makes sense", "does that make sense", "i would say", "perhaps",
  "somewhat", "pretty much", "more or less", "to be honest", "honestly",
];

/** Openers that signal the speaker led with their point rather than context. */
const POINT_MARKERS = [
  "my recommendation", "i recommend", "the short answer", "in short",
  "the key point", "the main thing", "bottom line", "my view is",
  "i led", "i built", "i delivered", "i increased", "i reduced", "i own",
  "we should", "the answer is", "yes,", "no,",
];

const SPEAKER_PREFIXES = /^(user|candidate|speaker|you|me|client)\s*[:>-]\s*/i;
const AGENT_PREFIXES = /^(bramwell|agent|assistant|coach|ai)\s*[:>-]\s*/i;

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

/** Pull only the user's speech out of a labelled transcript. */
export function extractUserSpeech(transcript: string): string {
  const lines = transcript.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const labelled = lines.filter((l) => SPEAKER_PREFIXES.test(l) || AGENT_PREFIXES.test(l));
  if (labelled.length === 0) return transcript.trim();
  return lines
    .filter((l) => SPEAKER_PREFIXES.test(l))
    .map((l) => l.replace(SPEAKER_PREFIXES, ""))
    .join(" ")
    .trim();
}

function countPhrase(haystack: string, phrase: string): number {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z'])${escaped}([^a-z']|$)`, "gi");
  let n = 0;
  while (re.exec(haystack) !== null) n += 1;
  return n;
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9'’-]+/g) ?? [];
}

/**
 * Compute every number shown on a result page from the transcript alone.
 *
 * @param transcript Full session transcript, ideally speaker-labelled.
 * @param durationSec Wall-clock length of the user's speaking time. When
 *   unknown, pace is estimated at a neutral 140 wpm so it cannot skew the
 *   score either way.
 */
export function computeMetrics(transcript: string, durationSec?: number): ComputedMetrics | null {
  const speech = extractUserSpeech(transcript);
  const allWords = words(speech);
  const wordCount = allWords.length;
  if (wordCount < 20) return null;

  const lower = ` ${speech.toLowerCase()} `;
  const per100 = (n: number) => Math.round((n / wordCount) * 1000) / 10;

  // Fillers
  const fillerCounts = FILLERS.map((w) => ({ word: w, count: countPhrase(lower, w) }))
    .filter((f) => f.count > 0)
    .sort((a, b) => b.count - a.count);
  const fillerTotal = fillerCounts.reduce((s, f) => s + f.count, 0);

  // Hedges
  const hedgeCounts = HEDGES.map((w) => ({ word: w, count: countPhrase(lower, w) })).filter(
    (h) => h.count > 0,
  );
  const hedgeTotal = hedgeCounts.reduce((s, h) => s + h.count, 0);

  const sents = sentences(speech);

  // Time to point: how many words in before the first point marker appears.
  let wordsBeforePoint = wordCount;
  let pointSentenceIndex = -1;
  let running = 0;
  for (let i = 0; i < sents.length; i += 1) {
    const s = ` ${sents[i].toLowerCase()} `;
    if (POINT_MARKERS.some((m) => s.includes(m))) {
      wordsBeforePoint = running;
      pointSentenceIndex = i;
      break;
    }
    running += words(sents[i]).length;
  }
  const effectiveDuration =
    durationSec && durationSec > 5 ? durationSec : Math.max(10, (wordCount / 140) * 60);
  const wpm = Math.round((wordCount / effectiveDuration) * 60);
  // Words-per-second based on the speaker's own rate, capped so a long
  // session with a short answer cannot manufacture an absurd delay.
  const secPerWord = Math.min(0.6, Math.max(0.25, effectiveDuration / Math.max(1, wordCount)));
  const timeToPointSec =
    Math.round(Math.min(60, wordsBeforePoint * secPerWord) * 10) / 10;
  const ledWithPoint = pointSentenceIndex === 0;

  const avgSentenceWords = wordCount / Math.max(1, sents.length);
  const rambleScore = clamp(Math.round((avgSentenceWords - 14) * 4 + timeToPointSec * 1.5));

  // Specificity
  const numbersUsed = (speech.match(/\b\d+(\.\d+)?%?\b/g) ?? []).length;
  const iCount = countPhrase(lower, "i");
  const weCount = countPhrase(lower, "we");
  const firstPersonRatio =
    iCount + weCount === 0 ? 0 : Math.round((iCount / (iCount + weCount)) * 100) / 100;
  const concreteMarkers =
    countPhrase(lower, "for example") +
    countPhrase(lower, "specifically") +
    countPhrase(lower, "the result") +
    countPhrase(lower, "which meant") +
    numbersUsed;

  // Relevance: did they close with a next step or a decision request?
  const closing = sents.slice(-2).join(" ").toLowerCase();
  const hasNextStep = [
    "next step", "i'd like", "i would like", "what i need", "can we",
    "i'm asking", "the decision", "recommend we", "so my ask",
  ].some((m) => closing.includes(m));

  // Pace only counts when we were given a reliable speaking duration and the
  // resulting rate is physically plausible. Otherwise it must not move the
  // score in either direction.
  const paceReliable = !!durationSec && durationSec > 5 && wpm >= 60 && wpm <= 260;
  const pacePenalty = paceReliable ? Math.abs(wpm - 145) * 0.25 : 0;

  // ---- Sub-scores -------------------------------------------------------
  // Banded 15..98: a floor of zero is neither credible nor coachable, and a
  // perfect 100 leaves nothing to sell.
  const band = (n: number) => clamp(n, 15, 98);
  const structure = band(
    100 - timeToPointSec * 2.2 - Math.max(0, avgSentenceWords - 16) * 2 + (ledWithPoint ? 12 : 0),
  );
  const specificity = band(
    35 + concreteMarkers * 7 + firstPersonRatio * 25 - Math.max(0, 25 - wordCount / 8),
  );
  const confidence = band(
    100 - per100(hedgeTotal) * 6 - per100(fillerTotal) * 4 - pacePenalty,
  );
  const relevance = band(
    45 + (hasNextStep ? 30 : 0) + (ledWithPoint ? 10 : 0) + Math.min(15, concreteMarkers * 3),
  );

  const sub: SubScores = {
    structure: Math.round(structure),
    specificity: Math.round(specificity),
    confidence: Math.round(confidence),
    relevance: Math.round(relevance),
  };

  // ---- Evidence: quote them back to themselves --------------------------
  const evidence: Evidence[] = [];
  const hedgeSentence = sents.find((s) =>
    HEDGES.some((h) => ` ${s.toLowerCase()} `.includes(` ${h} `)),
  );
  if (hedgeSentence) {
    evidence.push({
      quote: hedgeSentence,
      dimension: "confidence",
      note: "Hedging language here invites the listener to doubt the claim before you finish it.",
    });
  }
  if (!ledWithPoint && sents.length > 0) {
    evidence.push({
      quote: sents[0],
      dimension: "structure",
      note: `You opened with context. Your point did not arrive until roughly ${timeToPointSec}s in.`,
    });
  }
  if (numbersUsed === 0) {
    const longest = [...sents].sort((a, b) => b.length - a.length)[0];
    if (longest) {
      evidence.push({
        quote: longest,
        dimension: "specificity",
        note: "No number, timeframe or named result anywhere in this answer. A listener has nothing to hold on to.",
      });
    }
  }
  if (!hasNextStep && sents.length > 1) {
    evidence.push({
      quote: sents[sents.length - 1],
      dimension: "relevance",
      note: "You ended without asking for anything. The listener leaves without knowing what to do next.",
    });
  }

  const hedgeSamples = sents
    .filter((s) => HEDGES.some((h) => ` ${s.toLowerCase()} `.includes(` ${h} `)))
    .slice(0, 3)
    .map((s) => (s.length > 110 ? `${s.slice(0, 107)}...` : s));

  return {
    filler_words: {
      total: fillerTotal,
      per_100_words: per100(fillerTotal),
      top: fillerCounts.slice(0, 5),
    },
    pace: {
      words_per_minute: paceReliable ? wpm : 0,
      word_count: wordCount,
      duration_sec: Math.round(effectiveDuration),
    },
    hedging: { total: hedgeTotal, per_100_words: per100(hedgeTotal), samples: hedgeSamples },
    structure: {
      time_to_point_sec: timeToPointSec,
      led_with_point: ledWithPoint,
      ramble_score: rambleScore,
    },
    specificity: {
      numbers_used: numbersUsed,
      first_person_ratio: firstPersonRatio,
      concrete_markers: concreteMarkers,
    },
    sub_scores: sub,
    evidence: evidence.slice(0, 4),
    computed: true,
  };
}

/** Weighted composite of the four dimensions. */
export function readinessFromSubScores(sub: SubScores): number {
  return Math.round(
    sub.structure * 0.3 + sub.specificity * 0.25 + sub.confidence * 0.25 + sub.relevance * 0.2,
  );
}
