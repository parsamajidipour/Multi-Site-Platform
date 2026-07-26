#!/usr/bin/env node
// Regenerates each app's src/content/fallback.json from the live CMS.
// Usage:
//   node scripts/snapshot-cms-fallback.mjs [--api http://localhost:8000] [--app main-site,real-estate,finance,visa]
// Environment overrides:
//   CMS_API_BASE  - base URL of the CMS API (defaults to http://localhost:8000)
//   FALLBACK_APPS - comma separated list of app keys (defaults to all four)
//
// The script hits the public endpoints exposed by the CMS:
//   GET /api/public/sites/<key>/homepage/?locale=<locale>
//   GET /api/public/sites/<key>/pages/<slug>/?locale=<locale>
// and writes a merged fallback structure compatible with each app's contentAdapter.

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
function flag(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return fallback;
}

const API_BASE = flag("api", process.env.CMS_API_BASE || "http://localhost:8000").replace(/\/$/, "");
const APPS = (flag("app", process.env.FALLBACK_APPS || "main-site,real-estate,finance,visa")).split(",").map((x) => x.trim()).filter(Boolean);
const LOCALES = ["en", "tr", "fa", "ar"];

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

function fallbackPath(appKey) {
  return resolve(ROOT, "apps", appKey, "src", "content", "fallback.json");
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf-8"));
  } catch {
    return null;
  }
}

function pickSitePayload(homepage) {
  const site = homepage?.site || {};
  return {
    key: site.key,
    name: site.name,
    domain: site.domain,
    default_locale: site.default_locale || "en",
    is_active: site.is_active !== false,
    settings: homepage?.settings || {},
    navigation: homepage?.navigation || [],
    pages: [],
  };
}

function pageEntryFromPayload(payload, locale) {
  const page = payload?.page;
  if (!page) return null;
  return {
    ...page,
    locale,
    sections: payload?.sections || [],
  };
}

async function snapshotApp(appKey) {
  const writePath = fallbackPath(appKey);
  const existing = await readJson(writePath);
  const pageSlugs = new Set(["/"]);
  if (existing?.site?.pages) {
    for (const p of existing.site.pages) pageSlugs.add(p.slug || "/");
  }

  console.log(`[snapshot] ${appKey}: collecting from ${API_BASE}`);
  const allPages = [];
  let siteShell = null;
  let navigation = [];

  for (const locale of LOCALES) {
    try {
      const home = await getJson(`${API_BASE}/api/public/sites/${appKey}/homepage/?locale=${locale}`);
      if (!siteShell) siteShell = pickSitePayload(home);
      if (locale === (siteShell.default_locale || "en") && Array.isArray(home.navigation)) {
        navigation = home.navigation;
      }
      const entry = pageEntryFromPayload(home, locale);
      if (entry) allPages.push(entry);
    } catch (err) {
      console.warn(`[snapshot] ${appKey} homepage ${locale}: ${err.message}`);
    }

    for (const slug of pageSlugs) {
      if (slug === "/") continue;
      try {
        const cleanSlug = slug.replace(/^\/+/, "");
        const payload = await getJson(`${API_BASE}/api/public/sites/${appKey}/pages/${cleanSlug}/?locale=${locale}`);
        const entry = pageEntryFromPayload(payload, locale);
        if (entry) allPages.push(entry);
      } catch {
        // page may not exist in this locale - that's fine, skip
      }
    }
  }

  if (!siteShell) {
    console.warn(`[snapshot] ${appKey}: no homepage payload returned, leaving fallback untouched`);
    return;
  }

  siteShell.navigation = navigation;
  siteShell.pages = allPages;

  await mkdir(dirname(writePath), { recursive: true });
  await writeFile(writePath, `${JSON.stringify({ site: siteShell }, null, 2)}\n`, "utf-8");
  console.log(`[snapshot] ${appKey}: wrote ${allPages.length} pages to ${writePath}`);
}

(async () => {
  for (const appKey of APPS) {
    try {
      await snapshotApp(appKey);
    } catch (err) {
      console.error(`[snapshot] ${appKey} failed:`, err);
    }
  }
})();
