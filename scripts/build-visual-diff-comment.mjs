#!/usr/bin/env node
/**
 * Build a Markdown PR comment summarizing failed visual regression tests.
 *
 * Reads Playwright's JSON reporter output at test-results/results.json and
 * emits Markdown to stdout. Diff / actual / expected screenshots are linked
 * to the uploaded `playwright-report` artifact so reviewers can download and
 * view them without leaving the PR.
 *
 * Inputs (env):
 *   RESULTS_JSON       path to Playwright results.json (default: test-results/results.json)
 *   ARTIFACT_URL       URL to the uploaded playwright-report artifact (optional)
 *   REPORT_URL         URL to the hosted HTML report (optional)
 *   RUN_URL            URL to the GitHub Actions run (optional)
 */
import { readFileSync, existsSync } from "node:fs";
import { relative, sep } from "node:path";

const RESULTS = process.env.RESULTS_JSON ?? "test-results/results.json";
const ARTIFACT_URL = process.env.ARTIFACT_URL ?? "";
const DIFFS_URL = process.env.DIFFS_URL ?? "";
const REPORT_URL = process.env.REPORT_URL ?? "";
const RUN_URL = process.env.RUN_URL ?? "";

const MARKER = "<!-- visual-regression-comment -->";

function normalizePath(p) {
  if (!p) return p;
  return relative(process.cwd(), p).split(sep).join("/");
}

function collectFailedTests(suite, acc = []) {
  for (const s of suite.suites ?? []) collectFailedTests(s, acc);
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const failing = test.results?.some((r) => r.status !== "passed" && r.status !== "skipped");
      if (!failing) continue;
      const lastResult = test.results[test.results.length - 1];
      acc.push({
        title: spec.title,
        file: spec.file,
        line: spec.line,
        project: test.projectName,
        status: lastResult?.status ?? "failed",
        error: lastResult?.error?.message ?? "",
        attachments: (lastResult?.attachments ?? []).filter((a) =>
          /(diff|actual|expected)\.png$/i.test(a.name ?? a.path ?? ""),
        ),
      });
    }
  }
  return acc;
}

function buildBody(failures) {
  const lines = [MARKER];
  lines.push("### 🎨 Visual regression tests failed");
  lines.push("");
  lines.push(`**${failures.length}** test${failures.length === 1 ? "" : "s"} produced screenshot diffs.`);
  lines.push("");

  const links = [];
  if (RUN_URL) links.push(`[Workflow run](${RUN_URL})`);
  if (DIFFS_URL) links.push(`[Download failing diff images](${DIFFS_URL})`);
  if (ARTIFACT_URL) links.push(`[Download \`playwright-report\` artifact](${ARTIFACT_URL})`);
  if (REPORT_URL) links.push(`[Open HTML report](${REPORT_URL})`);
  if (links.length) {
    lines.push(links.join(" · "));
    lines.push("");
  }

  const byFile = new Map();
  for (const f of failures) {
    const key = f.file ?? "(unknown file)";
    if (!byFile.has(key)) byFile.set(key, []);
    byFile.get(key).push(f);
  }

  for (const [file, group] of byFile) {
    lines.push(`#### \`${file}\``);
    lines.push("");
    lines.push("| Test | Viewport | Diff | Actual | Expected |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const f of group) {
      const cell = (kind) => {
        const att = f.attachments.find((a) => (a.name ?? "").toLowerCase().includes(kind));
        if (!att?.path) return "—";
        const rel = normalizePath(att.path);
        return ARTIFACT_URL ? `[\`${kind}\`](${ARTIFACT_URL} "${rel}")` : `\`${rel}\``;
      };
      lines.push(
        `| ${f.title} | ${f.project} | ${cell("diff")} | ${cell("actual")} | ${cell("expected")} |`,
      );
    }
    lines.push("");
  }

  lines.push("<details><summary>Fix locally</summary>");
  lines.push("");
  lines.push("```bash");
  lines.push("bunx playwright test --update-snapshots");
  lines.push("```");
  lines.push("</details>");
  return lines.join("\n");
}

function main() {
  if (!existsSync(RESULTS)) {
    console.error(`No results file at ${RESULTS}`);
    process.exit(0);
  }
  const report = JSON.parse(readFileSync(RESULTS, "utf8"));
  const failures = [];
  for (const suite of report.suites ?? []) collectFailedTests(suite, failures);
  if (failures.length === 0) {
    process.stdout.write("");
    return;
  }
  process.stdout.write(buildBody(failures));
}

main();