import { test, expect, type Page } from "@playwright/test";
import { PUBLIC_ROUTES, DARK_BG_ALLOWLIST } from "./routes";

// Expected light-theme tokens (mirrors :root in src/styles.css).
// oklch(0.995 0.005 95) resolves in Chromium to ~rgb(254, 253, 250).
const EXPECTED = {
  bodyBgRgbApprox: { r: 254, g: 253, b: 250, tolerance: 6 },
  // --foreground oklch(0.18 0.03 275) is a dark ink — R,G,B all < 90.
  bodyFgMaxChannel: 90,
  requiredCssVars: [
    "--background",
    "--foreground",
    "--primary",
    "--gradient-hero",
    "--gradient-gold",
  ] as const,
};

function parseRgb(s: string): { r: number; g: number; b: number; a: number } | null {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((x) => parseFloat(x.trim()));
  return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

async function readThemeSnapshot(page: Page) {
  return page.evaluate((allowlist) => {
    // Chromium reports oklch()-derived computed colors in lab() form. Convert
    // any CSS color to a normalized rgb() string by painting it into a canvas.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d")!;
    const toRgb = (css: string): string => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000";
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    };

    const root = document.documentElement;
    const rootStyle = getComputedStyle(root);
    const bodyStyle = getComputedStyle(document.body);

    const vars: Record<string, string> = {};
    for (const v of [
      "--background",
      "--foreground",
      "--primary",
      "--gradient-hero",
      "--gradient-gold",
    ]) {
      vars[v] = rootStyle.getPropertyValue(v).trim();
    }

    // Find dark-bg offenders in the viewport (excluding allowlisted scrims).
    const offenders: { selector: string; bg: string }[] = [];
    const allowSet = new Set<Element>();
    for (const sel of allowlist) {
      document.querySelectorAll(sel).forEach((el) => allowSet.add(el));
    }
    document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
      if (allowSet.has(el)) return;
      // Skip elements inside an allowlisted ancestor
      let p: Element | null = el.parentElement;
      while (p) {
        if (allowSet.has(p)) return;
        p = p.parentElement;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) return;
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const bg = toRgb(getComputedStyle(el).backgroundColor);
      const m = bg.match(/rgba?\(([^)]+)\)/);
      if (!m) return;
      const [r, g, b, a = 1] = m[1].split(",").map((x) => parseFloat(x.trim()));
      if ((a ?? 1) < 0.5) return;
      // near-black: all channels below 40
      if (r < 40 && g < 40 && b < 40) {
        const id = el.id ? `#${el.id}` : "";
        const cls =
          typeof el.className === "string" && el.className
            ? "." + el.className.split(/\s+/).slice(0, 3).join(".")
            : "";
        offenders.push({ selector: `${el.tagName.toLowerCase()}${id}${cls}`, bg });
      }
    });

    return {
      bodyBg: toRgb(bodyStyle.backgroundColor),
      bodyColor: toRgb(bodyStyle.color),
      vars,
      offenders,
      url: location.pathname,
    };
  }, DARK_BG_ALLOWLIST);
}

for (const route of PUBLIC_ROUTES) {
  test.describe(`route ${route.path}`, () => {
    test(`applies light theme tokens (${route.label})`, async ({ page }) => {
      const resp = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      // Redirects (e.g. /dashboard when unauthed) still land somewhere — we
      // assert whatever renders is in the light theme.
      expect(resp, "response").toBeTruthy();
      await page.waitForLoadState("networkidle").catch(() => {});

      const snap = await readThemeSnapshot(page);

      // 1. CSS vars present
      for (const v of EXPECTED.requiredCssVars) {
        expect(snap.vars[v], `${v} on :root`).not.toEqual("");
      }

      // 2. body background matches light cream
      const bg = parseRgb(snap.bodyBg);
      expect(bg, `body bg parses (${snap.bodyBg})`).not.toBeNull();
      if (bg) {
        const { r, g, b, tolerance } = EXPECTED.bodyBgRgbApprox;
        expect(Math.abs(bg.r - r), `body bg R off (${bg.r})`).toBeLessThanOrEqual(tolerance);
        expect(Math.abs(bg.g - g), `body bg G off (${bg.g})`).toBeLessThanOrEqual(tolerance);
        expect(Math.abs(bg.b - b), `body bg B off (${bg.b})`).toBeLessThanOrEqual(tolerance);
      }

      // 3. body foreground is dark ink
      const fg = parseRgb(snap.bodyColor);
      expect(fg, `body color parses (${snap.bodyColor})`).not.toBeNull();
      if (fg) {
        expect(
          Math.max(fg.r, fg.g, fg.b),
          `body fg should be dark ink, got ${snap.bodyColor}`,
        ).toBeLessThanOrEqual(EXPECTED.bodyFgMaxChannel);
      }

      // 4. no unexpected near-black backgrounds in viewport
      expect(
        snap.offenders,
        `dark backgrounds outside allowlist: ${JSON.stringify(snap.offenders)}`,
      ).toEqual([]);
    });

    test(`hero screenshot (${route.label})`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});
      // Freeze anything animated; hide the sticky mobile CTA on small viewports.
      await page.addStyleTag({
        content: `*, *::before, *::after { animation: none !important; transition: none !important; }`,
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      const size = page.viewportSize() ?? { width: 1280, height: 900 };
      await expect(page).toHaveScreenshot(`${route.label}-hero.png`, {
        clip: { x: 0, y: 0, width: size.width, height: Math.min(size.height, 900) },
      });
    });
  });
}