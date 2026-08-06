# Bramwell v2: Brand Book to Build Plan

You asked for a revised plan with questions before any build. Here it is. Nothing has been built.

## What the brand book changes

The site today sells one thing: a $79/month AI communication mentor, with a free voice diagnostic as the hook. The brand book replaces that with a two-step ladder and a much stronger emotional spine.

New commercial architecture:

| Offer | B2C | B2B (10 seats) | Duration |
| --- | --- | --- | --- |
| Free diagnostic | $0 | $0 | 5 min |
| 28-Day Reset / Sprint | $197 | $1,500 | 28 days |
| 90-Day Transformation / Cohort | $497 | $3,500 | 90 days |
| 28 to 90 upgrade | $300 | $2,000 | +62 days |

New spine: 28 days to a new you. The Readiness Score is the mirror. The before and after number is the proof.

## Decisions I need from you before I build

1. **Does $79/month survive?** The brand book has no monthly tier. My recommendation: kill it publicly, keep $197/month only as a graduate continuity offer sold inside the product, not on the pricing page. Confirm.
2. **Score movement is a promise.** The book states 42 to 65 in 28 days and 42 to 71 in 90 days. Today the score is a single number the model asserts, not a measured metric. I will not ship those numbers as a guarantee until the score is deterministic. Do you want them shown as illustrative example journeys for launch, or held back until Wave 4 lands?
3. **Currency.** Prices in the book are unmarked. AUD or USD? Site copy is Australian English but the audience skews US.
4. **Cohort or self-paced?** 28 days with weekly check-ins and Discord pods implies real cohort scheduling. Are we launching with fixed start dates and pods, or self-paced starting on purchase with the community layer added later? This is the single biggest scope difference.
5. **Existing $79 members.** Any live subscribers to grandfather or migrate?

## Build waves

### Wave 1: the offer ladder (revenue-critical)

- Two Stripe products, one-time: 28-Day Reset $197, 90-Day Transformation $497. Plus a $300 upgrade price. B2B seat products created but sold via the audit form, not self-serve checkout.
- Pricing page rebuilt as a two-card ladder with the 28-day as the entry and the 90-day as the anchor. Remove every $79 and $197/month public reference.
- Result page becomes the conversion moment: score, the mirror copy, then a B2C or B2B branch. Individual sees the two offers. Team leader sees the audit CTA.
- Email capture before the result renders, session ID minted before the call so score, transcript and email are one record.
- Refund promise stated on both offers and at checkout.

### Wave 2: copy and brand rewrite

- Homepage hero to the Worth or Explosive Transformation version, pending your pick.
- Diagnostic page to the mirror moment framing: your voice has a score, most people have never measured it.
- Villain section rewritten around The Invisible Expert Problem.
- Waitlist and B2B page to the army of closers spine, with qualifying fields on the audit form.
- Voice rules enforced across every route: no em dashes, no "lack confidence", Australian English, no hype and no begging.

### Wave 3: entitlement and program

- Replace session-count gating with program enrolment: which program, which day, which week unlocked.
- Schema for programs, enrolments, day and week unlocks, and baseline / mid / final assessments.
- Post-purchase onboarding page: start date, what happens on day one, calendar add.

### Wave 4: defensible score

- Deterministic sub-scores from the transcript: filler count, words per minute, pause pattern, answer structure. The score becomes measurable, repeatable and comparable.
- Before and after view. Day 1 versus Day 28. This is the proof the whole brand rests on and the asset people share.
- Audio retention with explicit consent so the two sessions can be played back to back.

### Wave 5: hygiene

- Patch the critical dependency advisory in the router and start packages.

## Voice agent changes

- Ask the scenario inside the conversation, never as a pre-call form.
- Always deliver the spoken summary before the session ends.
- Pass the B2C or B2B signal through to the result so the CTA branch is accurate.

## Technical notes

- Programs are one-time Stripe prices, promotion codes stay enabled.
- The 28 to 90 upgrade is a separate price, gated to people with a completed 28-day enrolment.
- Enrolment written by the Stripe webhook, keyed on user and program, environment scoped.
- Sub-scores computed server side from the stored transcript so the same input always returns the same number.