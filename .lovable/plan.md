# Bramwell AI: Pivot to the 90-Day Cohort

Goal: move the site from a $79/month subscription to one flagship paid outcome, and stop the diagnostic from dead-ending. Ship in four waves so revenue is live after Wave 1.

## The commercial decision (locked before code)

One flagship offer: **The 90-Day Room Test, $697 USD**, quarterly cohort intake, capped seats.
Continuity for graduates only: $197/month, not sold on the public site.
Free live voice diagnostic stays the only top-of-funnel entry.

Why: the diagnostic sells a transformation, not tool access. A cohort with a start date, a cap and a refund promise converts far better than an open-ended subscription, and it removes the churn problem entirely.

## Wave 1: stop the leak (revenue-critical)

1. Result page branch. After the score, split the CTA by who they are: individual goes to the cohort offer, team or leader goes to the B2B audit. Today every archetype funnels to a subscription that will no longer exist.
2. Email capture before the result renders, session ID minted before the call so the score, transcript and email are one record.
3. Cohort checkout: single $697 one-time Stripe product, seat counter, sold-out and waitlist states.
4. Pricing page rewritten to one offer plus a graduate continuity note. Remove every $79 and $197 public card.
5. Explicit guarantee: complete the 90 days, sound different or full refund. Stated on the offer page and at checkout.

## Wave 2: entitlement truth

6. Replace session-decrement gating with cohort membership. Access is: are you in an active cohort, and which week are you in.
7. Cohort schema: cohorts, enrolments, week unlocks, baseline / mid / final assessment slots.
8. Onboarding page after purchase: start date, what happens in week one, calendar add.

## Wave 3: defensible score

9. Deterministic sub-scores from the transcript: filler count, words per minute, pause pattern, answer structure. The score stops being an opinion the model asserts and becomes numbers we can show twice and compare.
10. Baseline vs final comparison view. This is the proof the guarantee rests on and the asset people share.
11. Audio retention with explicit consent, so week one and week twelve can be played back to back.

## Wave 4: B2B and hygiene

12. Team audit form with qualifying fields, team size, budget band, timeline, so the enterprise waitlist is not noise.
13. Patch the critical dependency advisory in the router and start packages.

## Voice agent changes (runs alongside Wave 1)

- Ask the scenario inside the conversation, never as a pre-call form. Every extra field before the mic costs conversion.
- Fix the spoken close so Bramwell always delivers the summary before the session ends.
- Pass the scenario answer through to the result so the CTA branch is accurate.

## Copy rules carried forward

Australian English. No em dashes. Never "lack confidence", never "take the quiz". "Not a course. A coach." Specific step by step language, not vague signal language.

## Technical notes

- Cohort SKU is a one-time Stripe price with promotion codes left enabled.
- Seat cap enforced server side at checkout creation, not in the UI.
- Enrolment written by the Stripe webhook, keyed on cohort and user, environment scoped.
- Sub-scores computed server side from the stored transcript so the same input always gives the same number.
