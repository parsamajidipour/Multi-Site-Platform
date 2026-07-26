import fallbackSeed from "../content/fallback.json";

const SUPPORTED_LOCALES = new Set(["en", "tr", "fa", "ar"]);

const fallbackSettings = {
  contact_email: "info@rezaeiglobal.com",
  contact_phone: "",
  contact_address: "Muscat, Sultanate of Oman",
  footer_text: "Premium residency, visa, corporate setup, and official document coordination.",
  settings: {
    brand_logo_wide: "/brand/rezaei-global-logo-wide-web.png",
    brand_logo_stacked: "/brand/rezaei-global-logo-stacked-web.png",
    hero_video: "/media/hero/visa-hero.mp4",
    hero_poster: "/brand/rezaei-global-logo-stacked-web.png",
  },
};

const sectionHref = {
  home: "/",
  "residency-visa": "/residency-visa",
  "corporate-setup": "/corporate-setup",
  translation: "/translation",
  legalization: "/legalization",
  attestation: "/attestation",
  "case-review": "/case-review",
  contact: "/contact",
};

const secondarySectionKeys = new Set(["privacy", "terms"]);
const homeSectionExclusions = new Set(["contact", "faq", "privacy", "terms"]);

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

function blocksOfType(section, type) {
  return sortByOrder(section?.blocks || []).filter((block) => block.type === type);
}

function displayBlocks(section) {
  return sortByOrder(section?.blocks || []).filter((block) => !["button", "contact_row"].includes(block.type));
}

function actionBlocks(section) {
  return sortByOrder(section?.blocks || []).filter((block) => ["button", "link"].includes(block.type));
}

function bodyText(...parts) {
  return parts.filter((part) => part !== undefined && part !== null && part !== "").join(" ");
}

function valueOr(value, fallback = "") {
  return value === undefined || value === null ? fallback : value;
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
    settings: site.settings || fallbackSettings,
    sections: sortByOrder(page.sections || []),
  };
}

function normalizePayload(payload, pathname, locale) {
  if (payload?.page && Array.isArray(payload?.sections)) {
    return {
      site: payload.site,
      page: payload.page,
      navigation: sortByOrder(payload.navigation || []),
      settings: payload.settings || fallbackSettings,
      sections: sortByOrder(payload.sections),
    };
  }
  if (payload?.site?.pages) return pageFromSeed(payload, pathname, locale);
  throw new Error("CMS content shape is not supported");
}

function assertPagePayload(payload) {
  if (!payload?.site || !payload?.page || !Array.isArray(payload.sections)) {
    throw new Error("CMS page payload is incomplete");
  }
}

function adaptNavigation(navigation) {
  return sortByOrder(navigation)
    .filter((item) => {
      const sectionKey = item.section_key || item.href?.replace(/^\/+/, "") || "home";
      return !secondarySectionKeys.has(sectionKey);
    })
    .map((item) => ({
      label: item.label,
      sectionId: item.section_key || item.href?.replace(/^\/+/, "") || "home",
      href: item.href || sectionHref[item.section_key] || "/",
    }));
}

function adaptHome(payload) {
  const hero = payload.sections.find((section) => section.section_key === "home") || payload.sections[0] || {};
  const contact = payload.sections.find((section) => section.section_key === "contact") || {};
  const heroButtons = actionBlocks(hero);

  return {
    hero: {
      eyebrow: valueOr(hero.subtitle, payload.page.title),
      title: valueOr(hero.title, payload.page.title),
      lead: valueOr(hero.summary, payload.page.seo?.description || ""),
      cards: displayBlocks(hero).map((block) => ({ title: valueOr(block.title), text: valueOr(block.body) })),
      actions: heroButtons.map((block) => ({ label: valueOr(block.title), href: valueOr(block.href, "/contact") })),
    },
    sections: payload.sections
      .filter((section) => section.section_key !== "home" && !homeSectionExclusions.has(section.section_key))
      .map((section) => {
        const button = actionBlocks(section)[0];
        return {
          id: section.section_key,
          iconKey: section.section_key,
          eyebrow: valueOr(section.subtitle, section.title),
          title: valueOr(section.title),
          text: bodyText(section.summary, section.body),
          href: valueOr(button?.href, sectionHref[section.section_key] || "/contact"),
          items: displayBlocks(section).map((block) => [valueOr(block.title), valueOr(block.body)]),
        };
      }),
    contact: {
      eyebrow: valueOr(contact.subtitle, "Contact"),
      title: valueOr(contact.title, "Send a residency or document request."),
      text: bodyText(contact.summary, contact.body),
      rows: blocksOfType(contact, "contact_row").map((block) => ({ label: valueOr(block.title), value: valueOr(block.body) })),
    },
  };
}

function sectionByKey(sections, key) {
  return sections.find((section) => section.section_key === key) || {};
}

function adaptBlogIndex(payload) {
  const hero = sectionByKey(payload.sections, "hero");
  return {
    title: valueOr(hero.title, payload.page.title),
    eyebrow: valueOr(hero.subtitle, "Blog"),
    lead: valueOr(hero.summary, payload.page.seo?.description || ""),
  };
}

function adaptBlogPost(payload) {
  const hero = sectionByKey(payload.sections, "hero");
  const content = sectionByKey(payload.sections, "content");
  return {
    slug: payload.page.slug,
    title: valueOr(hero.title, payload.page.title),
    category: valueOr(hero.subtitle),
    excerpt: valueOr(hero.summary, payload.page.seo?.description || ""),
    body: valueOr(content.body, bodyText(content.summary, hero.body)),
    imageUrl: valueOr(payload.page.seo?.og_image_url, hero.settings?.image_url || ""),
    publishedAt: payload.page.published_at || null,
  };
}

function adaptBlogPostSummary(page) {
  const hero = sectionByKey(page.sections || [], "hero");
  const firstBlock = sortByOrder(hero.blocks || [])[0];
  return {
    slug: page.slug,
    title: valueOr(hero.title, page.title),
    category: valueOr(hero.subtitle),
    excerpt: valueOr(hero.summary, page.seo?.description || ""),
    imageUrl: valueOr(page.seo?.og_image_url, firstBlock?.image_url || ""),
    publishedAt: page.published_at || null,
  };
}

function blogPostsFromSeed(seedData, locale = "en") {
  const site = seedData?.site;
  const requestedLocale = currentLocale(locale);
  const defaultLocale = site?.default_locale || "en";
  const pages = (site?.pages || []).filter((page) => page.page_type === "blog_post" && page.status === "published");
  const localized = pages.filter((page) => page.locale === requestedLocale);
  const sourcePages = localized.length ? localized : pages.filter((page) => page.locale === defaultLocale);
  return sourcePages
    .map((page) => adaptBlogPostSummary(page))
    .sort((a, b) => String(b.publishedAt || "").localeCompare(String(a.publishedAt || "")));
}

function adaptDetail(payload, pathname) {
  const path = normalizePath(pathname);
  const hero = payload.sections.find((section) => section.section_key === "hero") || payload.sections[0] || {};
  const contentSections = payload.sections.filter((section) => section.section_key !== "hero");
  const ctaSection = payload.sections.find((section) => section.type === "cta");
  const buttons = actionBlocks(ctaSection);
  return {
    eyebrow: valueOr(hero.subtitle, payload.page.title),
    title: valueOr(hero.title, payload.page.title),
    lead: valueOr(hero.summary, payload.page.seo?.description || ""),
    pageType: payload.page.page_type || path.replace(/^\/+/, "") || "detail",
    iconKey: path.replace(/^\/+/, "") || "home",
    cta: valueOr(buttons[0]?.title, ""),
    ctaHref: valueOr(buttons[0]?.href, ""),
    alternate: valueOr(buttons[1]?.title, ""),
    alternateHref: valueOr(buttons[1]?.href, ""),
    ctaEyebrow: valueOr(ctaSection?.subtitle, "Next Step"),
    ctaTitle: valueOr(ctaSection?.title, "Ready to prepare the right document path?"),
    ctaText: bodyText(ctaSection?.summary, ctaSection?.body),
    contact: payload.page.page_type === "contact" || path === "/contact",
    blocks: contentSections.flatMap((section) =>
      displayBlocks(section).map((block) => ({ title: valueOr(block.title), text: valueOr(block.body), href: valueOr(block.href) })),
    ),
  };
}

function adaptFaqSections(sections) {
  return sortByOrder(sections)
    .filter((section) => section.type === "cards" && section.section_key !== "hero")
    .map((section) => ({
      category: valueOr(section.subtitle, section.title),
      items: displayBlocks(section).map((block) => ({ q: valueOr(block.title), a: valueOr(block.body) })),
    }))
    .filter((section) => section.items.length > 0);
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
  assertPagePayload(payload);
  const path = normalizePath(pathname);
  const settings = payload.settings || fallbackSettings;
  const extra = settings.settings || {};
  const uiStrings = buildUiStringsLookup(extra, locale);
  const brand = adaptBrand(extra);
  const heroMedia = adaptHeroMedia(extra);
  const groupSiteUrls = extra.group_site_urls || {};
  const areaServed = Array.isArray(extra.area_served) ? extra.area_served : [];
  const footerTextByLocale = extra.footer_text_by_locale || {};
  const footerText = footerTextByLocale[locale] || footerTextByLocale.en || settings.footer_text || "";
  const seo = payload.page.seo || {};
  const pageType = payload.page.page_type || "standard";
  const isBlogIndex = path === "/blog" || pageType === "blog";
  const isBlogPost = pageType === "blog_post";
  const isFaq = path === "/faq";
  return {
    source,
    siteName: payload.site.name,
    navItems: adaptNavigation(payload.navigation),
    settings,
    extra,
    uiStrings,
    brand,
    heroMedia,
    groupSiteUrls,
    areaServed,
    footerText,
    seo,
    pageTitle: payload.page.title,
    pageDescription: valueOr(seo.description, payload.page.title),
    pageKeywords: valueOr(seo.keywords),
    ogImageUrl: valueOr(seo.og_image_url, brand.logoWide || extra.brand_logo_wide || ""),
    home: path === "/" ? adaptHome(payload) : adaptHome(pageFromSeed(fallbackSeed, "/", locale)),
    detail: path === "/" || isBlogIndex || isBlogPost || isFaq || path === "/services" ? null : adaptDetail(payload, path),
    blogIndex: isBlogIndex ? adaptBlogIndex(payload) : null,
    blogPost: isBlogPost ? adaptBlogPost(payload) : null,
    faqSections: isFaq ? adaptFaqSections(payload.sections) : null,
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

export function getFallbackBlogPosts(locale = currentLocale()) {
  try {
    return blogPostsFromSeed(fallbackSeed, locale);
  } catch {
    return [];
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
