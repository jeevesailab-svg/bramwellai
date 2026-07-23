import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PUBLIC_ROUTES } from "../visual/routes";

// WCAG 2.1 A/AA + best-practice audit. We surface violations with a compact
// summary so failures point straight at the offending selector rather than
// dumping the full axe payload.
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

// Rules we intentionally skip:
// - `region`: some marketing sections deliberately sit outside a landmark.
// Add rule IDs here (with a comment) rather than silencing whole routes.
const DISABLED_RULES: string[] = [];

for (const route of PUBLIC_ROUTES) {
  test(`a11y ${route.label} (${route.path})`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: "networkidle" });
    // Routes behind auth (dashboard) may redirect - audit whatever renders.
    expect(response, `no response for ${route.path}`).not.toBeNull();

    const builder = new AxeBuilder({ page }).withTags(AXE_TAGS);
    if (DISABLED_RULES.length) builder.disableRules(DISABLED_RULES);
    const { violations } = await builder.analyze();

    if (violations.length) {
      const summary = violations
        .map((v) => {
          const nodes = v.nodes
            .slice(0, 3)
            .map((n) => `      • ${n.target.join(" ")}`)
            .join("\n");
          return `  [${v.impact ?? "n/a"}] ${v.id} - ${v.help}\n    ${v.helpUrl}\n${nodes}`;
        })
        .join("\n\n");
      throw new Error(
        `${violations.length} a11y violation(s) on ${route.path}:\n\n${summary}`,
      );
    }
  });
}