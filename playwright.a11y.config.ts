import { defineConfig, devices } from "@playwright/test";

// Axe-core accessibility audit. Runs against the same public route list as
// the visual suite but on a single desktop viewport - WCAG violations don't
// change per-breakpoint often enough to justify the matrix cost.
export default defineConfig({
  testDir: "./tests/a11y",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["json", { outputFile: "test-results/a11y.json" }], ["html", { outputFolder: "playwright-report-a11y", open: "never" }]]
    : [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080",
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],
});