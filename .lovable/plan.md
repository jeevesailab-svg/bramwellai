# Bramwell AI: the road to 200 sign-ups

I inspected the live site, the codebase, the database, the analytics wiring, the connector catalogue and the search landscape before writing this. No code has been changed.

## 1. What the data actually says (measured, not estimated)

From the production database:

| Metric | Value |
|---|---|
| Diagnostic sessions started (since 9 June) | 68 |
| Diagnostics completed | 16 (24%) |
| Diagnostics that captured an email | 2 (3%) |
| Quiz leads captured | 7 |
| Registered accounts | 4 |
| Paid transactions | 1 |
| Paid coaching sessions run | 0 |

From the SEO side: Semrush has **no index record at all** for bramwellai.com in either the AU or US database. There is no `public/robots.txt` and no `public/sitemap.xml` in the repo. Google Search Console exists as a workspace connection but is **not linked to this project**. Organic traffic is effectively zero.

## 2. The bottleneck is not traffic

The instinct is "we need more traffic". The numbers say otherwise. 68 people reached the most expensive, highest-intent asset on the site — a live voice diagnostic — and the system kept the contact details of **2 of them**. Every dollar of future traffic leaks through the same hole.

Ranked constraints:

1. **Email capture at the diagnostic (3%).** 66 warm prospects are permanently unreachable. This is the single largest destroyer of value in the funnel.
2. **Diagnostic completion (24%).** Three of four people who start the voice session abandon it.
3. **No lifecycle follow-up.** Resend is connected and sending transactional mail, but there is no nurture sequence. A completed diagnostic produces one email and then silence.
4. **Zero organic surface.** No robots.txt, no sitemap, no content pages, no structured data, no Search Console link. The site is invisible to both search engines and answer engines.
5. **Only then: traffic volume.**

## 3. Working backwards from 200 sign-ups

Defining a sign-up as a registered account with a completed diagnostic:

At today's rates (24% completion, 3% capture) 200 sign-ups needs roughly 100,000 diagnostic starts. Not achievable.

With the fixes in section 4 (target 55% completion, 60% capture, 25% capture-to-account):

- ~2,400 diagnostic starts
- ~1,300 completions
- ~800 emails captured
- ~200 accounts

2,400 starts over 90 days is ~27 per day. That is reachable from organic long-tail plus LinkedIn plus a referral loop. The maths only works after the leak is closed, which is why the leak comes first.

## 4. Execution plan

### Phase 1 — Stop the leak (week 1)
- Move email capture to a required field before the voice session begins, not after. Frame it as "where your report is sent".
- Persist partial sessions so an abandoned diagnostic still leaves a contactable record with a resume link.
- Instrument every funnel step as a GA4 event and mirror it into a database `funnel_events` table so the system can read its own performance without depending on the GA UI.
- Build an internal `/growth` dashboard reading directly from the database: starts, completions, capture rate, account rate, revenue, by day and by traffic source.

### Phase 2 — Lifecycle (week 1-2)
- A 6-email post-diagnostic sequence via Resend, personalised by the behavioural gap the diagnostic returned, driving to the $349 program.
- An abandonment sequence for incomplete diagnostics with a one-click resume link.
- A 4-email pre-purchase sequence for captured emails that have not bought.

### Phase 3 — Organic surface (week 2-4)
- robots.txt, sitemap.xml, canonical tags, Organization and FAQPage JSON-LD, Search Console linked and sitemap submitted.
- A content system with a real database-backed `articles` table and a route rendering them, so pages are data not hardcoded files.
- Seed clusters grounded in verified Semrush demand. "Executive presence" alone: 2,900/mo, KD 39, with a long tail of low-difficulty question queries ("what is executive presence" 720/mo, "how to develop executive presence" 140/mo) that a new domain can realistically take. Every article ends in the diagnostic.
- Answer-engine formatting: direct answer in the first 40 words, question-shaped H2s, FAQ schema.

### Phase 4 — Referral loop (week 3-4)
- Shareable result cards with a dynamic OG image showing the score against the CEO benchmark of 88.
- Referral codes on every account, with a tracked attribution chain.

### Phase 5 — The growth brain (week 4+)
- A scheduled server job that reads funnel data, ranks content and channels by sign-ups produced, and writes a prioritised recommendation queue.
- A content agent that drafts articles, LinkedIn posts and short-form scripts into a review queue, biased toward whatever the funnel data says is converting.

## 5. What requires you

Only these. Everything else I can build and run.

- **Social publishing.** LinkedIn and TikTok connectors exist and I can architect the pipeline, but posting to your accounts needs you to authorise the connection. Instagram and YouTube have no connector, so those stay human-published from generated drafts.
- **Google Search Console.** The connection exists in the workspace but is not linked to this project. One click.
- **Webinars.** No native capability. Needs an external platform decision if you want it; I would defer it until the funnel converts.
- **Paid retargeting.** Requires ad accounts and budget.

## 6. Technical notes

New tables: `funnel_events`, `articles`, `referrals`, `email_sequences`. All with RLS and explicit grants. Content pages render from the database through a TanStack route rather than one file per article. The scheduled agent runs as a public API route triggered by pg_cron. Analytics events write both to GA4 and to the database so the growth dashboard never depends on an external UI.
