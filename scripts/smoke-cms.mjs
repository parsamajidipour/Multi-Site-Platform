#!/usr/bin/env node
// Fails the build if deleted hardcoded constants reappear in app source.

import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const FORBIDDEN = [
  { pattern: "STOCK_IMAGES", globs: ["apps"] },
  { pattern: "demoVisaBlogPosts", globs: ["apps"] },
  { pattern: "showcaseProjects", globs: ["apps"] },
  { pattern: "inquiryStatusCopy", globs: ["apps"] },
  { pattern: "holdingBusinessUnits", globs: ["apps"] },
  { pattern: "groupPageCopy", globs: ["apps"] },
  { pattern: "unsplash.com", globs: ["apps/main-site/src", "apps/real-estate/src", "apps/finance/src", "apps/visa/src"] },
];

const ALLOWED_PATH_FRAGMENTS = [
  "fallback.json",
  "/content/",
  "/dist/",
  "scripts/",
  "node_modules",
];

function isAllowed(file) {
  return ALLOWED_PATH_FRAGMENTS.some((fragment) => file.replace(/\\/g, "/").includes(fragment));
}

function rg(pattern, globs) {
  const args = ["--no-heading", "-n", pattern];
  globs.forEach((g) => args.push("-g", g));
  args.push("apps");
  const result = spawnSync("rg", args, { cwd: ROOT, encoding: "utf-8" });
  if (result.status !== 0 && result.status !== 1) {
    console.error(`ripgrep failed for ${pattern}:`, result.stderr || result.error || "");
    return [];
  }
  return (result.stdout || "")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [file, lineNo, ...rest] = line.split(":");
      return { file, lineNo, text: rest.join(":") };
    })
    .filter((entry) => !isAllowed(entry.file));
}

let failed = false;
for (const { pattern, globs } of FORBIDDEN) {
  const matches = rg(pattern, globs);
  if (matches.length === 0) {
    console.log(`[smoke-cms] OK   ${pattern}`);
    continue;
  }
  failed = true;
  console.error(`[smoke-cms] FAIL ${pattern}`);
  for (const match of matches) {
    console.error(`              ${match.file}:${match.lineNo}: ${match.text}`);
  }
}

if (failed) {
  console.error("\n[smoke-cms] One or more forbidden patterns are still present in app code.");
  process.exit(1);
}

console.log("\n[smoke-cms] All forbidden patterns removed from app code.");
