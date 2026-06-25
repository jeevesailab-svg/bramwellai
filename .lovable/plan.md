## Goal

Make the diagnostic result page clear, credible, and conversion-driven. The score becomes "Your Communication Readiness Score — /100" with a subhead that answers "readiness for what?". The page reveals score + communication type immediately, then gates the detailed behavioural breakdown behind email capture. On submit, the full report unlocks on-screen and is emailed.

## On-screen flow (in order)

1. **Score hero** — Huge `30/100`, label "Your Communication Readiness Score", one-line subhead: *"How ready you are to walk into your next high-stakes conversation — interview, pitch, board room — and land it."*
2. **Communication type card** — "You are The Invisible Achiever" (underscore bug already fixed) with the existing one-line description.
3. **Locked report section** — Blurred preview of 4 metric cards (Filler words, Pace & pauses, Hedging & apologising, Answer structure) with a centred email-capture form overlaid:
   - Heading: *"See exactly what's holding you back"*
   - Sub: *"Your full behavioural report — every 'um', every pause, every hedge — sent to your inbox and unlocked here."*
   - First name + email, single CTA: "Send my report"
4. **Unlocked state (after email submit)** — Cards fill with real data:
   - **Filler words**: total count + top 3 ("um" ×14, "like" ×9, "you know" ×6)
   - **Pace & pauses**: words/min, longest pause, number of pauses >2s
   - **Hedging & apologising**: count + sample phrases ("I think", "sorry", "just")
   - **Answer structure**: time-to-point (seconds before you made your point), rambling index, did-you-lead-with-the-point yes/no
   - Each card ends with one behavioural insight sentence.
5. **Three biggest gaps** — keep existing list, now below the metrics.
6. **Pathway CTA** — keep existing Stripe CTA + outcomes section.

## Data changes

The agent currently returns `readiness_score` and `gaps`. Extend the result payload with a `metrics` object:

```ts
metrics: {
  filler_words: { total: number; top: { word: string; count: number }[] };
  pace: { words_per_minute: number; longest_pause_sec: number; long_pauses_count: number };
  hedging: { total: number; samples: string[] };
  structure: { time_to_point_sec: number; led_with_point: boolean; ramble_score: number };
}
```

- Add `metrics jsonb` column to `diagnostic_sessions` (migration).
- Update `src/routes/api/public/diagnostic-result.ts` POST Zod schema + UPDATE + GET response to accept/return `metrics`.
- Update the ElevenLabs agent prompt/tool to compute these from the transcript and pass them in the result webhook. (User will need to update the agent's system prompt — I'll provide the exact JSON shape.)
- Until the agent ships the new fields, the result page degrades gracefully: locked cards show generic copy, no fake numbers.

## Email delivery

- Use Lovable Emails (built-in). Run `email_domain--setup_email_infra` if not already set up, then `email_domain--scaffold_transactional_email`.
- New template `diagnostic-report.tsx` rendering the same metrics + gaps + pathway CTA.
- New public route `/api/public/diagnostic-email` (already exists for capture) is extended to: save email → trigger the report send via the internal transactional sender.

## Files touched

- `src/routes/diagnostic.result.tsx` — full layout rewrite (score hero, type, locked/unlocked metric grid, email capture overlay, gaps, CTA).
- `src/routes/api/public/diagnostic-result.ts` — schema + GET response with `metrics`.
- `src/routes/api/public/diagnostic-email.ts` — trigger email send on capture.
- New migration: `alter table diagnostic_sessions add column metrics jsonb`.
- New email template + registry entry.

## What I need from you

1. Confirm the score subhead wording above, or give your own.
2. Confirm you're OK with me updating the ElevenLabs agent prompt to emit the new `metrics` JSON (I'll write it; you paste it into the agent config).

Reply "go" and I'll build it.
