import { test, expect } from "@playwright/test";

// These smoke tests only exercise navigation and form UI - they never submit
// real credentials, hit Supabase, or start a paid ElevenLabs session. Every
// assertion is on client-side behavior a broken build would visibly break.

test.describe("landing → diagnostic CTA", () => {
  test("hero primary CTA routes to /diagnostic", async ({ page }) => {
    await page.goto("/");
    // Primary CTA copy is standardized across the site. /diagnostic now auto-starts the voice session.
    const cta = page.getByRole("link", { name: /start your 5-minute session/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/diagnostic(\?|$)/);
  });

  test("top-nav Pricing link routes to /pricing", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /^pricing$/i }).first().click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("pricing → signup", () => {
  test("pricing page exposes a signup entry point", async ({ page }) => {
    await page.goto("/pricing");
    // The header-right link is the canonical signup hop from pricing.
    const signup = page
      .getByRole("link", { name: /(sign up|create account|get started)/i })
      .first();
    await expect(signup).toBeVisible();
    await signup.click();
    await expect(page).toHaveURL(/\/signup(\?|$)/);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});

test.describe("auth forms render + cross-link", () => {
  test("/signup shows first name / email / password and a submit button", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /create account|sign up/i })).toBeEnabled();
  });

  test("/signup → /login via 'Sign in' cross-link", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("link", { name: /sign in|log in/i }).first().click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("/login shows email + password and cross-links back to /signup", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeEnabled();
    await page.getByRole("link", { name: /create an account/i }).first().click();
    await expect(page).toHaveURL(/\/signup$/);
  });

  test("/login blocks empty submit (HTML5 required)", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /sign in/i }).first().click();
    // Required inputs prevent navigation; still on /login.
    await expect(page).toHaveURL(/\/login$/);
    const email = page.getByLabel(/email/i);
    // :invalid is the browser's own validity state - no state hooks needed.
    await expect(email).toHaveJSProperty("validity.valid", false);
  });
});

test.describe("footer/nav resilience", () => {
  test("landing has no console errors on initial paint", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/", { waitUntil: "networkidle" });
    // Filter noisy third-party warnings that don't indicate a broken flow.
    const real = errors.filter((e) => !/favicon|elevenlabs|Stripe/i.test(e));
    expect(real, `console errors: ${real.join("\n")}`).toEqual([]);
  });
});