// Public, SEO-facing routes we assert stay on the light theme across every
// viewport project defined in playwright.config.ts (desktop, tablet portrait,
// tablet landscape, iPhone 12, iPhone 14 Pro Max).
// Kept explicit (rather than parsing routeTree.gen.ts) so param/api/underscore
// routes are trivially excluded and new SEO routes are added intentionally.
// `priority: true` routes are the highest-conversion pages — they must render
// correctly on every viewport; filter with `pnpm test -g "priority"` for a
// fast smoke run.
export const PUBLIC_ROUTES: { path: string; label: string; priority?: boolean }[] = [
  { path: "/", label: "home", priority: true },
  { path: "/pricing", label: "pricing", priority: true },
  { path: "/login", label: "login", priority: true },
  { path: "/signup", label: "signup", priority: true },
  { path: "/dashboard", label: "dashboard", priority: true },
  { path: "/diagnostic", label: "diagnostic", priority: true },
  { path: "/advisors", label: "advisors" },
  { path: "/executive", label: "executive" },
  { path: "/graduate", label: "graduate" },
  { path: "/pivot", label: "pivot" },
  { path: "/redundant", label: "redundant" },
  { path: "/returner", label: "returner" },
  { path: "/the-7-questions", label: "the-7-questions" },
];

// Selectors that are ALLOWED to render a near-black background — modal scrims,
// etc. Everything else with an rgb(0,0,0)-ish bg counts as a regression.
export const DARK_BG_ALLOWLIST = [
  '[data-slot="dialog-overlay"]',
  '[data-slot="alert-dialog-overlay"]',
  '[data-slot="sheet-overlay"]',
  '[data-slot="drawer-overlay"]',
  '[data-radix-popper-content-wrapper]',
];