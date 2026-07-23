
## Goal

Catch regressions where a route stops honoring the light Loveable/Canva theme tokens (e.g. someone reintroduces `bg-black`, a dark hero, or a hardcoded hex). Cover pricing, login, dashboard, and every SEO-facing route.

## Approach

Use Playwright (already available in the sandbox) with two complementary checks per route:

1. **Token assertion (fast, deterministic).** Read computed styles of `<body>` and key landmarks and assert they resolve to the light theme:
   - `body` background ≈ `oklch(0.995 0.005 95)` (warm cream)
   - `body` color is the dark ink (`--foreground`)
   - No element in the initial viewport has `background-color: rgb(0,0,0)` or a near-black fill outside allow-listed selectors (modal scrims: `[data-slot="dialog-overlay"]`, `.bg-black\/70`, etc.)
   - `--background`, `--foreground`, `--primary`, `--gradient-hero` CSS vars are present on `:root`
2. **Screenshot snapshot (visual).** `page.screenshot()` of the above-the-fold hero saved under `tests/visual/__snapshots__/`. Re-runs pixel-diff against the baseline with a small tolerance.

## Routes covered

Public/SEO + the three named pages:
- `/`
- `/pricing`
- `/login`
- `/dashboard` (redirects when unauthed - assert the redirect target still renders in light theme, or seed a session if `LOVABLE_BROWSER_AUTH_STATUS=injected`)
- `/diagnostic`
- `/advisors`, `/executive`, `/graduate`, `/pivot`, `/redundant`, `/returner`, `/signup`, `/the-7-questions`

Route list is generated at test time from `src/routeTree.gen.ts` so new SEO routes are picked up automatically (filtered to public, non-`api/`, non-`$`-param routes).

## Files

- `tests/visual/theme.spec.ts` - Playwright test file
- `tests/visual/routes.ts` - helper that reads the route tree and returns the public route list
- `playwright.config.ts` - chromium project, `viewport: 1280x1800`, `baseURL: http://localhost:8080`, snapshot dir under `tests/visual/__snapshots__/`
- `package.json` - add `test:visual` script and `@playwright/test` dev dep
- `.gitignore` - ignore `test-results/` and `playwright-report/`

## How it runs

- Local / CI: `bun run test:visual` (assumes dev server on `:8080`, matching the existing sandbox convention).
- First run generates baselines; subsequent runs fail on token drift or visual diff.
- Baselines are checked in so a PR that flips the theme back to dark fails immediately.

## Out of scope

- Authenticated deep pages behind role gates (dashboard beyond redirect).
- Mobile viewport snapshots (can add a second project later).
- Component-level snapshots (Storybook) - route-level is enough to catch token regressions.
