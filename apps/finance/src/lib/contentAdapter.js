import fallbackSeed from "../content/fallback.json";

const SUPPORTED_LOCALES = new Set(["en", "tr", "fa", "ar"]);

function normalizePath(pathname) {
  const normalized = String(pathname || "/").replace(/\/+$/, "");
  return normalized || "/";
}

function currentLocale(localeOverride) {
  const requested = String(
    localeOverride ||
      (typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("locale") || window.localStorage.getItem("rezaei-locale")
        : "") ||
      "en",
  ).toLowerCase();
  return SUPPORTED_LOCALES.has(requested) ? requested : "en";
}

function sortByOrder(items = []) {
  return [...items].sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

function pageFromSeed(seedData, pathname, locale = "en") {
  const path = normalizePath(pathname);
  const site = seedData?.site;
  const requestedLocale = currentLocale(locale);
  const defaultLocale = site?.default_locale || "en";
  const pages = site?.pages || [];
  const page =
    pages.find((item) => normalizePath(item.slug) === path && item.locale === requestedLocale) ||
    pages.find((item) => normalizePath(item.slug) === path && item.locale === defaultLocale) ||
    pages.find((item) => normalizePath(item.slug) === path);
  if (!site || !page) throw new Error("Fallback content is missing the requested page");
  const navigation = (site.navigation || []).filter((item) => (item.locale || defaultLocale) === (page.locale || defaultLocale));
  return {
    site: { key: site.key, name: site.name, domain: site.domain, default_locale: site.default_locale },
    page,
    navigation: sortByOrder(navigation.length ? navigation : site.navigation || []),
    settings: site.settings || {},
    sections: sortByOrder(page.sections || []),
  };
}

function normalizePayload(payload, pathname, locale) {
  if (payload?.page && Array.isArray(payload?.sections)) {
    return {
      site: payload.site,
      page: payload.page,
      navigation: sortByOrder(payload.navigation || []),
      settings: payload.settings || {},
      sections: sortByOrder(payload.sections),
    };
  }
  if (payload?.site?.pages) return pageFromSeed(payload, pathname, locale);
  throw new Error("CMS content shape is not supported");
}

function blocks(section, type) {
  return sortByOrder(section?.blocks || []).filter((block) => block.type === type);
}

function contentBlocks(section) {
  return sortByOrder(section?.blocks || []).filter((block) => !["button", "contact_row"].includes(block.type));
}

function actionBlocks(section) {
  return sortByOrder(section?.blocks || []).filter((block) => ["button", "link"].includes(block.type));
}

function valueOr(value, fallback = "") {
  return value === undefined || value === null ? fallback : value;
}

function pageTuple(page) {
  const slug = normalizePath(page.slug);
  const id = slug === "/" ? "home" : slug.replace(/^\/+/, "");
  const hero = sortByOrder(page.sections || []).find((section) => section.type === "hero") || {};
  return [id, slug, valueOr(hero.subtitle, page.title), valueOr(hero.title, page.title), valueOr(hero.summary, page.seo?.description || page.title)];
}

function adaptHome(payload) {
  const sectionMap = Object.fromEntries(payload.sections.map((section) => [section.section_key, section]));
  const hero = sectionMap.home || payload.sections[0] || {};
  return {
    hero: {
      eyebrow: valueOr(hero.subtitle, payload.page.title),
      title: valueOr(hero.title, payload.page.title),
      lead: valueOr(hero.summary, payload.page.seo?.description || ""),
      cards: [...blocks(hero, "card"), ...blocks(hero, "stat")].map((block) => [valueOr(block.title), valueOr(block.subtitle), valueOr(block.body)]),
      buttons: actionBlocks(hero).map((block) => ({ label: valueOr(block.title), href: valueOr(block.href, "/") })),
    },
    sections: Object.fromEntries(
      Object.entries(sectionMap).map(([key, section]) => [
        key,
        {
          eyebrow: valueOr(section.subtitle, section.title),
          title: valueOr(section.title),
          summary: [section.summary, section.body].filter((part) => part !== undefined && part !== null && part !== "").join(" "),
          cards: contentBlocks(section).map((block) => [valueOr(block.title), valueOr(block.body), valueOr(block.href), valueOr(block.subtitle)]),
          buttons: actionBlocks(section).map((block) => ({ label: valueOr(block.title), href: valueOr(block.href, "/") })),
        },
      ]),
    ),
  };
}

function adaptFaqQuestions(sections) {
  return sortByOrder(sections)
    .filter((section) => section.type === "cards" && section.section_key !== "hero")
    .flatMap((section) =>
      contentBlocks(section).map((block) => ({ title: valueOr(block.title), text: valueOr(block.body) })),
    )
    .filter((item) => item.title);
}

function buildUiStringsLookup(extra, locale) {
  const uiSource = extra?.ui_strings || {};
  const lookup = {};
  Object.entries(uiSource).forEach(([key, value]) => {
    if (!value) return;
    if (typeof value === "string") {
      lookup[key] = value;
      return;
    }
    if (typeof value === "object") {
      lookup[key] = value[locale] || value.en || Object.values(value).find(Boolean) || "";
    }
  });
  return lookup;
}

function adaptBrand(extra) {
  if (!extra) return {};
  return {
    logoWide: extra.brand_logo_wide || "",
    logoStacked: extra.brand_logo_stacked || "",
    favicon: extra.favicon_url || extra.brand_logo_stacked || "",
    color: extra.brand_color || "",
    accent: extra.accent_color || "",
  };
}

function adaptHeroMedia(extra) {
  if (!extra) return {};
  return {
    video: extra.hero_video || "",
    poster: extra.hero_poster || "",
  };
}

function adaptContent(payload, pathname, source, locale = "en") {
  if (!payload?.site || !payload?.page || !Array.isArray(payload.sections)) {
    throw new Error("CMS page payload is incomplete");
  }

  const path = normalizePath(pathname);
  const settings = payload.settings || {};
  const extra = settings.settings || {};
  const uiStrings = buildUiStringsLookup(extra, locale);
  const brand = adaptBrand(extra);
  const heroMedia = adaptHeroMedia(extra);
  const groupSiteUrls = extra.group_site_urls || {};
  const areaServed = Array.isArray(extra.area_served) ? extra.area_served : [];
  const footerTextByLocale = extra.footer_text_by_locale || {};
  const footerText = footerTextByLocale[locale] || footerTextByLocale.en || settings.footer_text || "";
  const seo = payload.page.seo || {};
  const pages = payload.navigation.map((item) => [
    item.section_key || item.href.replace(/^\/+/, "") || "home",
    normalizePath(item.href),
    item.label,
    item.label,
    item.label,
  ]);

  const isFaq = path === "/faq";

  return {
    source,
    siteName: payload.site.name,
    settings,
    extra,
    uiStrings,
    brand,
    heroMedia,
    groupSiteUrls,
    areaServed,
    footerText,
    seo,
    pageTuple: pageTuple(payload.page),
    navPages: pages,
    home: path === "/" ? adaptHome(payload) : adaptHome(pageFromSeed(fallbackSeed, "/", locale)),
    sections: payload.sections.map((section) => ({
      key: section.section_key,
      type: section.type,
      eyebrow: valueOr(section.subtitle, section.title),
      title: valueOr(section.title),
      text: [section.summary, section.body].filter(Boolean).join(" "),
      cards: [
        ...blocks(section, "card"),
        ...blocks(section, "service_item"),
        ...blocks(section, "process_step"),
        ...blocks(section, "stat"),
      ].map((block) => [valueOr(block.title), valueOr(block.body), valueOr(block.href), valueOr(block.subtitle)]),
      buttons: actionBlocks(section).map((block) => ({ label: valueOr(block.title), href: valueOr(block.href, "/") })),
    })),
    faqQuestions: isFaq ? adaptFaqQuestions(payload.sections) : null,
    pageTitle: payload.page.title,
    pageDescription: valueOr(seo.description, payload.page.title),
    pageKeywords: valueOr(seo.keywords),
    ogImageUrl: valueOr(seo.og_image_url, brand.logoWide || ""),
  };
}

export function getFallbackContent(pathname, locale = currentLocale()) {
  const path = normalizePath(pathname);
  try {
    return adaptContent(pageFromSeed(fallbackSeed, path, locale), path, "fallback", locale);
  } catch {
    return adaptContent(pageFromSeed(fallbackSeed, "/", locale), "/", "fallback", locale);
  }
}

export function getPageContent(pathname, cmsPayload, locale = currentLocale()) {
  const path = normalizePath(pathname);
  if (!cmsPayload) return getFallbackContent(path, locale);
  try {
    return adaptContent(normalizePayload(cmsPayload, path, locale), path, "cms", locale);
  } catch {
    return getFallbackContent(path, locale);
  }
}
