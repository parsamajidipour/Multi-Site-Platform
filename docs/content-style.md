# Content Style Guide

This guide governs every user-visible string across the four public sites
(`main-site`, `real-estate`, `finance`, `visa`) in all four locales
(`en`, `tr`, `fa`, `ar`). It exists because the previous copy read as
machine-templated and noun-stacked, which made the brand feel unreliable.

## 1. Voice and tone

- Write for a real reader, not for a search engine.
- Lead with what the visitor can do or decide, then how we help.
- Short sentences carry weight. Mix one short sentence with one longer one
  rather than three long, comma-stacked ones.
- Be confident without boasting. Avoid superlatives unless they are factual.

## 2. Things we never claim

We do not invent facts. Do not introduce any of the following unless the
business owner has provided exact values:

- Specific years in business, founding year, or age of the company.
- Counts of projects, clients, transactions, deals, hectares, units, or
  similar numbers.
- Named clients, named partners, named developments, named landlords or
  tenants.
- Awards, certifications, licence numbers, registration numbers, ratings.
- Monetary amounts, ROI, yields, transaction values, market shares.
- Testimonials or quotes.

If the existing copy has any of those, remove them or replace them with a
qualitative description.

## 3. Banned scaffolding (any locale)

These words and phrases signal templated copy. Replace them with concrete
language:

- "framework", "platform", "ecosystem", "infrastructure" (when used about
  the service itself rather than literal IT systems).
- "shaped around", "structured path", "structured around", "designed
  around", "built around".
- "premium", "world-class", "best-in-class", "cutting-edge", "seamless",
  "robust", "synergy", "holistic", "leverage".
- Title-Case-Every-Word headlines. Use sentence case for headings.
- SEO keyword stuffing. Keep `seo.keywords` to 5-8 plain terms or empty.

## 4. Length budgets

Layouts rely on stable text lengths. Stay within +/- 20% of the original.

| Field type             | Target length      |
| ---------------------- | ------------------ |
| Hero `title`           | 6-12 words         |
| Hero `subtitle`        | 2-5 words          |
| Hero `summary`         | 18-35 words        |
| Section `title`        | 4-10 words         |
| Section `summary`      | 15-30 words        |
| Card `title`           | 1-4 words          |
| Card `body`            | 12-25 words        |
| SEO `title`            | <=60 chars         |
| SEO `description`      | 140-160 chars      |
| Footer text            | 8-16 words         |
| UI strings (success)   | <=12 words         |

## 5. Locale rules

### English (`en`)
- Sentence case for headings ("Property choices made clear", not
  "Property Choices Made Clear").
- Plain professional register. No corporate jargon.
- Use the Oxford comma.

### Turkish (`tr`)
- Never leave English words inside Turkish copy ("finishing", "framework",
  "MEP", "platform"). Use Turkish equivalents:
  - "finishing" -> "ince işler" or "son kat"
  - "framework" -> "çerçeve" or rephrase
  - "MEP" -> "mekanik, elektrik ve tesisat"
  - "platform" -> "hizmet" or rephrase
- Natural Turkish word order: verb at the end.
- Use Turkish quotation marks and punctuation.

### Persian (`fa`)
- Idiomatic Persian, not literal English-to-Persian translation.
- Avoid the repeated passive scaffolding
  "...پروژه‌ای است که حول... شکل گرفته است" across multiple cards.
- Replace mechanical compounds:
  - "کوریدور رشد شهری" -> "محور رشد شهری" or "منطقه در حال توسعه"
  - "ابتکار توسعه مختلط" -> "پروژه ترکیبی" or "توسعه چندمنظوره"
  - "زیرساخت گروه" -> "هماهنگی میان مجموعه‌ها"
- Use Persian punctuation: `،` (comma), `؛` (semicolon), `؟` (question).
- Use Persian half-space (ZWNJ) for compound words (`می‌کنیم`, not `میکنیم`).
- Numbers stay in Western digits unless the surrounding text is fully Persian.

### Arabic (`ar`)
- Modern Standard Arabic (MSA).
- No transliterated English nouns ("بليتفورم", "إيكوسيستم"). Use Arabic
  equivalents or rephrase.
- Correct gender, number, and case agreement.
- Use Arabic punctuation: `،` (comma), `؛` (semicolon), `؟` (question).
- Right-to-left friendly ordering; numbers stay in Western digits.

## 6. Structural guardrails (DO NOT TOUCH)

These fields are structural, not content. Editing them will break the
sites:

- `slug`, `locale`, `section_key`, `block_key`, `type`, `order`,
  `page_type`, `status`, navigation `href`.
- URLs, image paths, video paths (`/media/...`, `/brand/...`).
- Hex colors, emails, phone numbers, addresses.
- Array lengths. Components count on a fixed number of cards/blocks
  (e.g. 6 material categories, 5 process steps). Never add or remove
  entries; only rewrite their text.
- Block ordering. Keep `order: 0..N` exactly as it was.

## 7. SEO fields

- `seo.title`: under 60 characters. Site name suffix is fine
  (e.g. `... | Rezaei Global`).
- `seo.description`: 140-160 characters, one sentence, written for a
  human scanning search results.
- `seo.keywords`: 5-8 plain terms separated by commas, or an empty
  string if the page does not have a meaningful keyword set.

## 8. UI strings

`settings.ui_strings` covers success, error, empty, and form labels.
Keep these short, friendly, and consistent across the four sites so
users see the same voice everywhere:

- Success: "Thanks - your message reached us. We will reply shortly."
- Error: "We could not send that. Please try again in a moment."

## 9. Files governed by this guide

- `apps/<app>/src/content/fallback.json` (offline / first-load mirror)
- `services/cms-api/content/seed_data/<site>.json` (CMS seed)
- `apps/real-estate/src/lib/*Copy.js` (hard-coded page copy modules)
- `apps/real-estate/src/lib/projectContentLocales.js` (project descriptions)

Each `fallback.json` and its matching `seed_data/<site>.json` must
stay mirror-identical. Edit them together, never one without the other.
