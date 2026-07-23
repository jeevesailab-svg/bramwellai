#!/usr/bin/env node
/**
 * Build a concise Markdown PR comment for visual regression runs.
 *
 * Emits a short status line, per-viewport failure counts, and links to the
 * Playwright HTML report / artifacts. Full per-test details live in the
 * uploaded report - this comment is intentionally scannable, not exhaustive.
 *
 * Inputs (env):
 *   RESULTS_JSON   path to Playwright results.json (default: test-results/results.json)
 *   ARTIFACT_URL   URL to the uploaded playwright-report artifact (optional)
 *   DIFFS_URL      URL to the uploaded visual-diffs artifact (optional)
 *   REPORT_URL     URL to a hosted HTML report (optional)
 *   RUN_URL        URL to the GitHub Actions run (optional)
 */
import { readFileSync, existsSync } from "node:fs";

const RESULTS = process.env.RESULTS_JSON ?? "test-results/results.json";
const ARTIFACT_URL = process.env.ARTIFACT_URL ?? "";
const DIFFS_URL = process.env.DIFFS_URL ?? "";
const REPORT_URL = process.env.REPORT_URL ?? "";
const RUN_URL = process.env.RUN_URL ?? "";

const MARKER = "<!-- visual-regression-comment -->";

function collectTests(suite, acc = []) {
  for (const s of suite.suites ?? []) collectTests(s, acc);
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const last = test.results?.[test.results.length - 1];
      if (!last) continue;
      acc.push({
        title: spec.title,
        project: test.projectName,
        status: last.status ?? "failed",
      });
    }
  }
  return acc;
}

function buildBody(tests, failures) {
  const byProject = new Map();
  for (const f of failures) {
    byProject.set(f.project, (byProject.get(f.project) ?? 0) + 1);
  }

  const lines = [MARKER];
  lines.push(
    `### 🎨 Visual regression: ${failures.length} failing / ${tests.length} total`,
  );
  lines.push("");

  if (byProject.size) {
    const parts = [...byProject.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([project, count]) => `\`${project}\` ×${count}`);
    lines.push(parts.join(" · "));
    lines.push("");
  }

  const links = [];
  if (REPORT_URL) links.push(`[HTML report](${REPORT_URL})`);
  if (ARTIFACT_URL) links.push(`[Playwright report artifact](${ARTIFACT_URL})`);
  if (DIFFS_URL) links.push(`[Diff images](${DIFFS_URL})`);
  if (RUN_URL) links.push(`[Workflow run](${RUN_URL})`);
  if (links.length) {
    lines.push(links.join(" · "));
    lines.push("");
  }

  const preview = failures.slice(0, 5).map((f) => `- \`${f.project}\` - ${f.title}`);
  if (preview.length) {
    lines.push("<details><summary>First failures</summary>");
    lines.push("");
    lines.push(...preview);
    if (failures.length > preview.length) {
      lines.push(`- …and ${failures.length - preview.length} more (see report)`);
    }
    lines.push("");
    lines.push("Reproduce locally: `bunx playwright test`");
    lines.push("Accept new baselines: `bunx playwright test --update-snapshots`");
    lines.push("</details>");
  }

  return lines.join("\n");
}

function main() {
  if (!existsSync(RESULTS)) {
    console.error(`No results file at ${RESULTS}`);
    process.exit(0);
  }
  const report = JSON.parse(readFileSync(RESULTS, "utf8"));
  const tests = [];
  for (const suite of report.suites ?? []) collectTests(suite, tests);
  const failures = tests.filter(
    (t) => t.status !== "passed" && t.status !== "skipped",
  );
  if (failures.length === 0) {
    process.stdout.write("");
    return;
  }
  process.stdout.write(buildBody(tests, failures));
}

main();