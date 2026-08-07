export type ScoreBand = {
  label: string;
  meaning: string;
  next: string;
};

export function getScoreBand(score: number): ScoreBand {
  if (score >= 85)
    return {
      label: "Room commanding",
      meaning:
        "You land your point early, back it with evidence and hold the room without effort. People act on what you say.",
      next: "Protect it. At this level the risk is drift, not weakness.",
    };
  if (score >= 70)
    return {
      label: "Credible, not yet commanding",
      meaning:
        "You are clear and people follow you, but the first eight seconds still leak. You are persuasive in the second half, not the first.",
      next: "Tighten your opening line and cut the wind up.",
    };
  if (score >= 55)
    return {
      label: "Competent but forgettable",
      meaning:
        "Your content is fine. The delivery buries it. Listeners have to work to find your point, so it does not stick.",
      next: "Lead with the answer, then the proof, then the so what.",
    };
  if (score >= 40)
    return {
      label: "Being talked over",
      meaning:
        "You hedge, over explain and arrive at the point late. In a fast room, someone else fills the gap before you finish.",
      next: "Halve your time to point and remove hedging language.",
    };
  return {
    label: "Not landing",
    meaning:
      "Your ideas are not reaching the room. Structure, specificity and confidence signals are all working against you at once.",
    next: "Start with structure. Everything else improves behind it.",
  };
}

export const SCORE_SCALE =
  "0 to 39 not landing · 40 to 54 talked over · 55 to 69 forgettable · 70 to 84 credible · 85+ room commanding";
