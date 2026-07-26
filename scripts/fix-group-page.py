#!/usr/bin/env python3
"""Remove corrupted groupPageCopy remnant from main-site App.jsx."""
from pathlib import Path

path = Path(__file__).resolve().parents[1] / "apps/main-site/src/App.jsx"
text = path.read_text(encoding="utf-8")
marker_start = "/* ─── Group Page"
marker_end = "/* ─── About Page"
start = text.index(marker_start)
end = text.index(marker_end)

# Extract the valid JSX return from the duplicate function (second one)
chunk = text[start:end]
return_idx = chunk.rindex("  return (")
jsx_body = chunk[return_idx:]
# jsx_body ends before About Page comment - find closing brace of function
close_idx = jsx_body.rindex("\n}\n")
jsx_body = jsx_body[: close_idx + 2]

replacement = '''/* ─── Group Page ─────────────────────────────────────────────── */

const groupUnitIcons = [ClipboardCheck, Target, BadgeCheck];

function GroupPage({ navigate, cmsHero, cmsData }) {
  const pick = (cms, fb = "") => (cms && (Array.isArray(cms) ? cms.length : String(cms).trim()) ? cms : fb);
  const c = {
    eyebrow: pick(cmsHero?.eyebrow),
    hero: pick(cmsHero?.title),
    heroSub: pick(cmsHero?.lead || cmsHero?.summary),
    unitsEyebrow: pick(cmsData?.unitsEyebrow),
    unitsTitle: pick(cmsData?.unitsTitle),
    units: pick(cmsData?.units, []),
    flowEyebrow: pick(cmsData?.flowEyebrow),
    flowTitle: pick(cmsData?.flowTitle),
    flowSteps: pick(cmsData?.flowSteps, []),
    holdingEyebrow: pick(cmsData?.holdingEyebrow),
    holdingTitle: pick(cmsData?.holdingTitle),
    holdingItems: pick(cmsData?.holdingItems, []),
    ctaEyebrow: pick(cmsData?.ctaEyebrow),
    ctaTitle: pick(cmsData?.ctaTitle),
    ctaText: pick(cmsData?.ctaText),
    ctaButton: pick(cmsData?.ctaButton, "Contact"),
  };
''' + jsx_body[len("  return (") - len("  return (") :]  # keep return block as-is

# Fix: jsx_body already starts with "  return ("
replacement = '''/* ─── Group Page ─────────────────────────────────────────────── */

const groupUnitIcons = [ClipboardCheck, Target, BadgeCheck];

function GroupPage({ navigate, cmsHero, cmsData }) {
  const pick = (cms, fb = "") => (cms && (Array.isArray(cms) ? cms.length : String(cms).trim()) ? cms : fb);
  const c = {
    eyebrow: pick(cmsHero?.eyebrow),
    hero: pick(cmsHero?.title),
    heroSub: pick(cmsHero?.lead || cmsHero?.summary),
    unitsEyebrow: pick(cmsData?.unitsEyebrow),
    unitsTitle: pick(cmsData?.unitsTitle),
    units: pick(cmsData?.units, []),
    flowEyebrow: pick(cmsData?.flowEyebrow),
    flowTitle: pick(cmsData?.flowTitle),
    flowSteps: pick(cmsData?.flowSteps, []),
    holdingEyebrow: pick(cmsData?.holdingEyebrow),
    holdingTitle: pick(cmsData?.holdingTitle),
    holdingItems: pick(cmsData?.holdingItems, []),
    ctaEyebrow: pick(cmsData?.ctaEyebrow),
    ctaTitle: pick(cmsData?.ctaTitle),
    ctaText: pick(cmsData?.ctaText),
    ctaButton: pick(cmsData?.ctaButton, "Contact"),
  };
''' + jsx_body

new_text = text[:start] + replacement + "\n\n" + text[end:]
path.write_text(new_text, encoding="utf-8")
print("Fixed GroupPage section")
