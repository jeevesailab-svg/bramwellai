import { test, expect, type Page } from "@playwright/test";
import { PUBLIC_ROUTES, DARK_BG_ALLOWLIST, FORBIDDEN_CLASS_PATTERNS } from "./routes";

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

async function readThemeSnapshot(page: Page, forbiddenPatterns: string[]) {
  return page.evaluate(
    ({ allowlist, forbiddenSrc }) => {
      const forbidden = forbiddenSrc.map((s) => new RegExp(s));
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
    const parseChannels = (rgba: string) => {
      const m = rgba.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = 1] = m[1].split(",").map((x) => parseFloat(x.trim()));
      return { r, g, b, a };
    };
    const isNearBlack = (r: number, g: number, b: number) => r < 40 && g < 40 && b < 40;

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

    // Walk the ENTIRE rendered DOM (not just current viewport) and flag any
    // non-allowlisted element that paints, gradients into, sets a hardcoded
    // dark class on, or inline-styles a near-black surface.
    const bgOffenders: { selector: string; bg: string; reason: string }[] = [];
    const classOffenders: { selector: string; className: string; pattern: string }[] = [];
    const inlineOffenders: { selector: string; style: string }[] = [];

    const allowSet = new Set<Element>();
    for (const sel of allowlist) {
      document.querySelectorAll(sel).forEach((el) => allowSet.add(el));
    }
    const isAllowed = (el: Element): boolean => {
      let p: Element | null = el;
      while (p) {
        if (allowSet.has(p)) return true;
        p = p.parentElement;
      }
      return false;
    };
    const describe = (el: Element): string => {
      const id = el.id ? `#${el.id}` : "";
      const cls =
        typeof (el as HTMLElement).className === "string" && (el as HTMLElement).className
          ? "." + (el as HTMLElement).className.split(/\s+/).filter(Boolean).slice(0, 3).join(".")
          : "";
      return `${el.tagName.toLowerCase()}${id}${cls}`;
    };

    document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
      if (isAllowed(el)) return;
      const rect = el.getBoundingClientRect();
      // Ignore truly zero-size nodes; keep tiny/off-screen ones — a stray
      // dark surface below the fold is still a regression.
      if (rect.width === 0 || rect.height === 0) return;

      const cs = getComputedStyle(el);

      // 1) solid background-color
      const bg = toRgb(cs.backgroundColor);
      const bgParts = parseChannels(bg);
      if (bgParts && bgParts.a >= 0.5 && isNearBlack(bgParts.r, bgParts.g, bgParts.b)) {
        bgOffenders.push({ selector: describe(el), bg, reason: "background-color" });
      }

      // 2) background-image gradient with a near-black color stop
      const bgImage = cs.backgroundImage;
      if (bgImage && bgImage !== "none" && /gradient/i.test(bgImage)) {
        const stops = bgImage.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}\b/gi) ?? [];
        for (const stop of stops) {
          const parts = parseChannels(toRgb(stop));
          if (parts && parts.a >= 0.5 && isNearBlack(parts.r, parts.g, parts.b)) {
            bgOffenders.push({ selector: describe(el), bg: bgImage, reason: `gradient stop ${stop}` });
            break;
          }
        }
      }

      // 3) forbidden Tailwind / arbitrary dark classes
      const className =
        typeof (el as HTMLElement).className === "string" ? (el as HTMLElement).className : "";
      if (className) {
        for (const rx of forbidden) {
          if (rx.test(className)) {
            classOffenders.push({ selector: describe(el), className, pattern: String(rx) });
            break;
          }
        }
      }

      // 4) inline style with dark hex or dark rgb background
      const inline = el.getAttribute("style") ?? "";
      if (inline && /background/i.test(inline)) {
        const values = inline.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)/gi) ?? [];
        for (const v of values) {
          const parts = parseChannels(toRgb(v));
          if (parts && parts.a >= 0.5 && isNearBlack(parts.r, parts.g, parts.b)) {
            inlineOffenders.push({ selector: describe(el), style: inline });
            break;
          }
        }
      }
    });

    return {
      bodyBg: toRgb(bodyStyle.backgroundColor),
      bodyColor: toRgb(bodyStyle.color),
      vars,
      bgOffenders,
      classOffenders,
      inlineOffenders,
      url: location.pathname,
    };
    },
    { allowlist: DARK_BG_ALLOWLIST, forbiddenSrc: forbiddenPatterns },
  );
}

// Scroll the full document so lazy / below-the-fold content mounts before we
// scan. Waits a beat between hops so IntersectionObservers fire.
async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
}

for (const route of PUBLIC_ROUTES) {
  const tag = route.priority ? "[priority] " : "";
  test.describe(`${tag}route ${route.path}`, () => {
    test(`${tag}applies light theme tokens (${route.label})`, async ({ page }) => {
      const resp = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      // Redirects (e.g. /dashboard when unauthed) still land somewhere — we
      // assert whatever renders is in the light theme.
      expect(resp, "response").toBeTruthy();
      await page.waitForLoadState("networkidle").catch(() => {});
      await scrollThroughPage(page);

      const snap = await readThemeSnapshot(
        page,
        FORBIDDEN_CLASS_PATTERNS.map((r) => r.source),
      );

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

      // 4. no unexpected near-black backgrounds anywhere in the rendered DOM
      expect(
        snap.bgOffenders,
        `dark backgrounds outside allowlist: ${JSON.stringify(snap.bgOffenders, null, 2)}`,
      ).toEqual([]);

      // 5. no forbidden hardcoded dark utility classes anywhere in the DOM
      expect(
        snap.classOffenders,
        `forbidden dark classes present: ${JSON.stringify(snap.classOffenders, null, 2)}`,
      ).toEqual([]);

      // 6. no inline style="background: <near-black>" leaks
      expect(
        snap.inlineOffenders,
        `inline dark background styles: ${JSON.stringify(snap.inlineOffenders, null, 2)}`,
      ).toEqual([]);
    });

    test(`${tag}hero screenshot (${route.label})`, async ({ page }) => {
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