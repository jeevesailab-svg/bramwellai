import { defineConfig, devices } from "@playwright/test";

// Lightweight smoke suite: real user flows, one desktop viewport, no
// screenshot snapshots. Kept separate from the visual-regression config so it
// runs fast (< 30s) and can gate merges without waiting on pixel diffs.
export default defineConfig({
  testDir: "./tests/smoke",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [["list"], ["json", { outputFile: "test-results/smoke.json" }]]
    : [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],
});