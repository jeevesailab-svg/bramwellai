// Public, SEO-facing routes we assert stay on the light theme.
// Kept explicit (rather than parsing routeTree.gen.ts) so param/api/underscore
// routes are trivially excluded and new SEO routes are added intentionally.
export const PUBLIC_ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "home" },
  { path: "/pricing", label: "pricing" },
  { path: "/login", label: "login" },
  { path: "/signup", label: "signup" },
  { path: "/dashboard", label: "dashboard" },
  { path: "/diagnostic", label: "diagnostic" },
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