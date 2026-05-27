const STOPWORDS = new Set(
  `a an the and or but if then else of in on at to for from by with without within into onto over under between across through during before after about above below up down out off is are was were be been being am have has had do does did will would shall should can could may might must this that these those it its as not no nor so than too very just only also more most other such own same we you they he she i me my our your their his her them us who whom which what where when why how all any each every some many few much several both either neither one two three new role roles job jobs work working ability able strong good great excellent including include includes etc you'll we're you're we'll your's role's job's company companies team teams will be must have should have nice to have plus please apply candidate candidates position positions opportunity opportunities`
    .split(/\s+/),
);

/**
 * Extract the top N most important phrases from a job description.
 * Uses simple frequency + bigram analysis. Deterministic, no API calls.
 */
export function extractKeyPhrases(text: string, n = 7): string[] {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-+/.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = clean.split(" ").filter(
    (t) => t.length > 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t),
  );

  const counts = new Map<string, number>();
  const bump = (k: string, w = 1) => counts.set(k, (counts.get(k) ?? 0) + w);

  // Bigrams (weighted higher — multi-word phrases are more informative)
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (STOPWORDS.has(a) || STOPWORDS.has(b)) continue;
    bump(`${a} ${b}`, 3);
  }
  // Unigrams
  for (const t of tokens) bump(t, 1);

  const ranked = [...counts.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1]);

  // Dedupe: drop unigrams already contained in a higher-ranked bigram
  const out: string[] = [];
  for (const [phrase] of ranked) {
    if (out.some((p) => p.includes(phrase) || phrase.includes(p))) continue;
    out.push(phrase.replace(/\b\w/g, (c) => c.toUpperCase()));
    if (out.length >= n) break;
  }
  return out;
}