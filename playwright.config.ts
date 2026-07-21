import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  snapshotDir: "./tests/visual/__snapshots__",
  fullyParallel: true,
  retries: 0,
  reporter: process.env.CI
    ? [
        ["list"],
        ["json", { outputFile: "test-results/results.json" }],
        ["html", { outputFolder: "playwright-report", open: "never" }],
      ]
    : [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080",
    ignoreHTTPSErrors: true,
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    },
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 1800 } },
    },
    {
      name: "chromium-tablet-portrait",
      use: { ...devices["iPad (gen 7)"], viewport: { width: 810, height: 1080 } },
    },
    {
      name: "chromium-tablet-landscape",
      use: { ...devices["iPad (gen 7) landscape"], viewport: { width: 1080, height: 810 } },
    },
    {
      name: "chromium-mobile-390",
      use: { ...devices["iPhone 12"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "chromium-mobile-428",
      use: { ...devices["iPhone 14 Pro Max"], viewport: { width: 428, height: 926 } },
    },
  ],
});