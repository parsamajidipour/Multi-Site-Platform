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
      body: valueOr(hero.body, ""),
      settings: hero.settings || {},
      cards: contentBlocks(hero).map((block) => [valueOr(block.title), valueOr(block.subtitle), valueOr(block.body), valueOr(block.href)]),
      buttons: actionBlocks(hero).map((block) => ({ label: valueOr(block.title), href: valueOr(block.href, "/") })),
    },
    sections: Object.fromEntries(
      Object.entries(sectionMap).map(([key, section]) => [
        key,
        {
          eyebrow: valueOr(section.subtitle, section.title),
          title: valueOr(section.title),
          summary: [section.summary, section.body].filter((part) => part !== undefined && part !== null && part !== "").join(" "),
          settings: section.settings || {},
          cards: contentBlocks(section).map((block) => [
            valueOr(block.title),
            valueOr(block.body),
            valueOr(block.href),
            valueOr(block.subtitle),
            valueOr(block.type),
            valueOr(block.image_url),
          ]),
          buttons: actionBlocks(section).map((block) => ({ label: valueOr(block.title), href: valueOr(block.href, "/") })),
        },
      ]),
    ),
  };
}

function sectionMap(sections) {
  return Object.fromEntries(sortByOrder(sections).map((s) => [s.section_key, s]));
}

function adaptHero(sections) {
  const hero = sortByOrder(sections).find((s) => s.type === "hero") || {};
  return {
    eyebrow: valueOr(hero.subtitle),
    title: valueOr(hero.title),
    lead: valueOr(hero.summary),
    body: valueOr(hero.body),
    settings: hero.settings || {},
  };
}

function adaptFaqGroups(sections) {
  return sortByOrder(sections)
    .filter((s) => (s.type === "cards" || s.section_key === "support") && s.section_key !== "hero")
    .map((s) => ({
      title: valueOr(s.subtitle, s.title),
      text: valueOr(s.summary, s.body),
      questions: contentBlocks(s).map((b) => [valueOr(b.title), valueOr(b.body)]),
    }));
}

function adaptGroupedItems(sections) {
  return sortByOrder(sections)
    .filter((s) => s.type === "cards" && s.section_key !== "hero" && !s.section_key.includes("note") && s.section_key !== "cta")
    .map((s) => ({
      title: valueOr(s.subtitle, s.title),
      text: valueOr(s.summary, s.body),
      items: contentBlocks(s).map((b) => [valueOr(b.title), valueOr(b.body)]),
    }));
}

function adaptNote(sections, noteKey) {
  const note = sections.find((s) => s.section_key === noteKey);
  if (!note) return null;
  return valueOr(note.title, "") + (note.summary ? " " + note.summary : "");
}

function adaptGovernance(sections) {
  const sm = sectionMap(sections);
  const principlesSection = sm.principles || sm.standards || {};
  const frameworkSection = sm.framework || {};
  const processSection = sm.process || {};
  const ctaSection = sm.cta || {};
  return {
    principlesEyebrow: valueOr(principlesSection.subtitle),
    principlesTitle: valueOr(principlesSection.title),
    principles: contentBlocks(principlesSection).map((b) => ({ title: valueOr(b.title), text: valueOr(b.body) })),
    frameworkEyebrow: valueOr(frameworkSection.subtitle),
    frameworkTitle: valueOr(frameworkSection.title),
    frameworkCols: contentBlocks(frameworkSection).map((b) => ({
      label: valueOr(b.title),
      items: valueOr(b.body).split("\n").map((s) => s.trim()).filter(Boolean),
    })),
    processEyebrow: valueOr(processSection.subtitle),
    processTitle: valueOr(processSection.title),
    processSteps: contentBlocks(processSection).map((b) => [valueOr(b.title), valueOr(b.body)]),
    ctaEyebrow: valueOr(ctaSection.subtitle),
    ctaTitle: valueOr(ctaSection.title),
    ctaText: valueOr(ctaSection.summary, valueOr(ctaSection.body)),
    ctaButton: actionBlocks(ctaSection)?.[0]?.title || "",
    ctaHref: actionBlocks(ctaSection)?.[0]?.href || "/contact",
  };
}

function adaptGroupPage(sections) {
  const sm = sectionMap(sections);
  const unitsSection = sm.units || {};
  const flowSection = sm.flow || {};
  const holdingSection = sm.holding || {};
  const ctaSection = sm.cta || {};
  return {
    unitsEyebrow: valueOr(unitsSection.subtitle),
    unitsTitle: valueOr(unitsSection.title),
    units: contentBlocks(unitsSection).map((b) => {
      const [mainText, areasRaw] = valueOr(b.body).split("\n---\n");
      return {
        title: valueOr(b.title),
        scope: valueOr(b.subtitle),
        text: (mainText || "").trim(),
        areas: areasRaw ? areasRaw.split("\n").map((s) => s.trim()).filter(Boolean) : [],
      };
    }),
    flowEyebrow: valueOr(flowSection.subtitle),
    flowTitle: valueOr(flowSection.title),
    flowSteps: contentBlocks(flowSection).map((b) => [valueOr(b.title), valueOr(b.body)]),
    holdingEyebrow: valueOr(holdingSection.subtitle),
    holdingTitle: valueOr(holdingSection.title),
    holdingItems: contentBlocks(holdingSection).map((b) => ({ title: valueOr(b.title), text: valueOr(b.body) })),
    ctaEyebrow: valueOr(ctaSection.subtitle),
    ctaTitle: valueOr(ctaSection.title),
    ctaText: valueOr(ctaSection.summary, valueOr(ctaSection.body)),
    ctaButton: actionBlocks(ctaSection)?.[0]?.title || "",
    ctaHref: actionBlocks(ctaSection)?.[0]?.href || "/contact",
  };
}

function adaptAbout(sections) {
  const sm = sectionMap(sections);
  const overviewSection = sm.overview || {};
  const businessesSection = sm.businesses || {};
  const processSection = sm.process || {};
  const ctaSection = sm.cta || {};
  return {
    overviewEyebrow: valueOr(overviewSection.subtitle),
    overviewTitle: valueOr(overviewSection.title),
    overviewText: valueOr(overviewSection.summary, overviewSection.body),
    overviewPoints: contentBlocks(overviewSection).map((b) => valueOr(b.title)).filter(Boolean),
    businessesEyebrow: valueOr(businessesSection.subtitle),
    businessesTitle: valueOr(businessesSection.title),
    groupUnits: contentBlocks(businessesSection).map((b) => ({
      title: valueOr(b.title),
      text: valueOr(b.body),
      href: valueOr(b.href),
    })),
    processEyebrow: valueOr(processSection.subtitle),
    processTitle: valueOr(processSection.title),
    processSummary: valueOr(processSection.summary, processSection.body),
    processSteps: contentBlocks(processSection).map((b) => [valueOr(b.title), valueOr(b.body)]),
    ctaEyebrow: valueOr(ctaSection.subtitle),
    ctaTitle: valueOr(ctaSection.title),
    ctaText: valueOr(ctaSection.summary, ctaSection.body),
    ctaButton: actionBlocks(ctaSection)?.[0]?.title || "",
    ctaHref: actionBlocks(ctaSection)?.[0]?.href || "/contact",
  };
}

function adaptTeam(sections) {
  const sm = sectionMap(sections);
  const rosterSection = sm.roster || {};
  const ctaSection = sm.cta || {};
  return {
    rosterEyebrow: valueOr(rosterSection.subtitle),
    rosterTitle: valueOr(rosterSection.title),
    rosterSummary: valueOr(rosterSection.summary),
    quote: valueOr(rosterSection.body),
    members: contentBlocks(rosterSection).map((b) => ({
      title: valueOr(b.title),
      role: valueOr(b.subtitle),
      bio: valueOr(b.body),
      imageUrl: valueOr(b.image_url),
    })),
    ctaEyebrow: valueOr(ctaSection.subtitle),
    ctaTitle: valueOr(ctaSection.title),
    ctaText: valueOr(ctaSection.summary, ctaSection.body),
    ctaButton: actionBlocks(ctaSection)?.[0]?.title || "",
    ctaHref: actionBlocks(ctaSection)?.[0]?.href || "/contact",
  };
}

function adaptContactPage(sections) {
  const sm = sectionMap(sections);
  const heroSection = sm.hero || sortByOrder(sections).find((s) => s.type === "hero") || {};
  const helpSection = sm.help || sm.support || {};
  const prepSection = sm.prepare || sm.preparation || {};
  const contactSection = sm.contact || {};
  const contactRows = sortByOrder(contactSection.blocks || []).filter((block) => block.type === "contact_row");
  const helpItemsFromContact = contactRows.map((block) => ({ title: valueOr(block.title), text: valueOr(block.body) }));
  const helpItemsFromHelp = contentBlocks(helpSection).map((block) => ({ title: valueOr(block.title), text: valueOr(block.body) }));
  const prepItemsFromPrep = contentBlocks(prepSection).map((block) => valueOr(block.title)).filter(Boolean);
  const prepItemsFromContactBody = valueOr(contactSection.body)
    ? valueOr(contactSection.body).split(/,\s+/).map((part) => part.trim()).filter(Boolean)
    : [];

  return {
    heroEyebrow: valueOr(heroSection.subtitle),
    heroTitle: valueOr(heroSection.title),
    heroLead: valueOr(heroSection.summary),
    heroBody: valueOr(heroSection.body),
    formTitle: valueOr(contactSection.subtitle, "Message the group"),
    formHeading: valueOr(contactSection.title, "Tell us what you need."),
    helpTitle: valueOr(helpSection.title, "Contact Routes"),
    helpItems: helpItemsFromHelp.length ? helpItemsFromHelp : helpItemsFromContact,
    prepTitle: valueOr(prepSection.title, "What to include"),
    prepItems: prepItemsFromPrep.length ? prepItemsFromPrep : prepItemsFromContactBody,
  };
}

function pickUiString(uiStrings, key, locale) {
  if (!uiStrings || typeof uiStrings !== "object") return "";
  const entry = uiStrings[key];
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  return entry[locale] || entry.en || "";
}

function buildUiStringsLookup(uiStrings, locale) {
  const out = {};
  if (!uiStrings || typeof uiStrings !== "object") return out;
  for (const [key, value] of Object.entries(uiStrings)) {
    if (typeof value === "string") out[key] = value;
    else if (value && typeof value === "object") out[key] = value[locale] || value.en || "";
  }
  return out;
}

function adaptBrand(extra) {
  return {
    logoWide: valueOr(extra.brand_logo_wide, ""),
    logoStacked: valueOr(extra.brand_logo_stacked, ""),
    favicon: valueOr(extra.favicon_url, ""),
    color: valueOr(extra.brand_color, "#00357f"),
    accent: valueOr(extra.accent_color, "#f97316"),
  };
}

function adaptHeroMedia(extra, sectionsByKey) {
  const hero = sectionsByKey?.home || {};
  const heroSettings = hero.settings || {};
  return {
    video: heroSettings.video || extra.hero_video || "",
    poster: heroSettings.poster_url || heroSettings.poster || extra.hero_poster || "",
    backgroundImage: heroSettings.background_image || "",
  };
}

function adaptContent(payload, pathname, source, locale = "en") {
  if (!payload?.site || !payload?.page || !Array.isArray(payload.sections)) {
    throw new Error("CMS page payload is incomplete");
  }

  const path = normalizePath(pathname);
  const settings = payload.settings || {};
  const extra = settings.settings && typeof settings.settings === "object" ? settings.settings : {};
  const seo = payload.page.seo || {};
  const pages = payload.navigation
    .filter((item) => {
      const sectionKey = String(item.section_key || "").toLowerCase();
      const href = String(item.href || "").toLowerCase();
      return sectionKey !== "partners" && !href.includes("/partners");
    })
    .map((item) => [
      item.section_key || item.href.replace(/^\/+/, "") || "home",
      normalizePath(item.href),
      item.label,
      item.label,
      item.label,
    ]);

  const isFaq = path === "/faq";
  const isPrivacy = path === "/privacy";
  const isTerms = path === "/terms";
  const isGovernance = path === "/governance";
  const isGroupPage = path === "/how-we-work";
  const isAbout = path === "/about";
  const isTeam = path === "/team";
  const isContact = path === "/contact";

  const sectionsByKey = Object.fromEntries(payload.sections.map((section) => [section.section_key, section]));
  const uiStrings = buildUiStringsLookup(extra.ui_strings, locale);
  const brand = adaptBrand(extra);
  const heroMedia = adaptHeroMedia(extra, sectionsByKey);
  const groupSiteUrls = extra.group_site_urls && typeof extra.group_site_urls === "object" ? extra.group_site_urls : {};
  const groupLinks = Array.isArray(extra.group_links) ? extra.group_links : [];
  const footerTextByLocale =
    extra.footer_text_by_locale && typeof extra.footer_text_by_locale === "object" ? extra.footer_text_by_locale : {};
  const footerText = footerTextByLocale[locale] || settings.footer_text || "";

  return {
    source,
    siteName: payload.site.name,
    settings,
    extra,
    uiStrings,
    brand,
    heroMedia,
    groupSiteUrls,
    groupLinks,
    footerText,
    areaServed: Array.isArray(extra.area_served) ? extra.area_served : [],
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
      settings: section.settings || {},
      cards: contentBlocks(section).map((block) => [valueOr(block.title), valueOr(block.body), valueOr(block.href)]),
      buttons: actionBlocks(section).map((block) => ({ label: valueOr(block.title), href: valueOr(block.href, "/") })),
    })),
    cmsHero: adaptHero(payload.sections),
    faqGroups: isFaq ? adaptFaqGroups(payload.sections) : null,
    privacyGroups: isPrivacy ? adaptGroupedItems(payload.sections) : null,
    privacyNote: isPrivacy ? adaptNote(payload.sections, "privacy-note") : null,
    termsGroups: isTerms ? adaptGroupedItems(payload.sections) : null,
    termsNote: isTerms ? adaptNote(payload.sections, "terms-note") : null,
    governance: isGovernance ? adaptGovernance(payload.sections) : null,
    groupPage: isGroupPage ? adaptGroupPage(payload.sections) : null,
    about: isAbout ? adaptAbout(payload.sections) : null,
    team: isTeam ? adaptTeam(payload.sections) : null,
    contactPage: isContact ? adaptContactPage(payload.sections) : null,
    pageTitle: payload.page.title,
    pageDescription: valueOr(seo.description, payload.page.title),
    pageKeywords: valueOr(seo.keywords),
    ogImageUrl: valueOr(seo.og_image_url, brand.logoWide || ""),
  };
}

export function getUiString(content, key, fallback = "") {
  if (!content || !content.uiStrings) return fallback;
  return content.uiStrings[key] || fallback;
}

export function getUiStringByLocale(content, key, locale, fallback = "") {
  if (!content || !content.extra || !content.extra.ui_strings) return fallback;
  return pickUiString(content.extra.ui_strings, key, locale) || fallback;
}

export function getFallbackContent(pathname, locale = currentLocale()) {
  const path = normalizePath(pathname);
  try {
    return adaptContent(pageFromSeed(fallbackSeed, path, locale), path, "fallback", locale);
  } catch {
    return adaptContent(pageFromSeed(fallbackSeed, "/", locale), "/", "fallback", locale);
  }
}

const EN_NAV_HOME_LABELS = new Set(["Home", "Company", "Contact"]);

function isLikelyEnglishNav(navPages) {
  const label = navPages?.[0]?.[2];
  return EN_NAV_HOME_LABELS.has(label);
}

function mergeLocalizedShell(cmsContent, fallbackContent, requestedLocale) {
  if (requestedLocale === "en") return cmsContent;
  const merged = { ...cmsContent };
  if (isLikelyEnglishNav(cmsContent.navPages) && fallbackContent.navPages?.length) {
    merged.navPages = fallbackContent.navPages;
  }
  if (!String(cmsContent.footerText || "").trim() && fallbackContent.footerText) {
    merged.footerText = fallbackContent.footerText;
  }
  return merged;
}

export function getPageContent(pathname, cmsPayload, locale = currentLocale()) {
  const path = normalizePath(pathname);
  const requestedLocale = currentLocale(locale);
  const fallbackContent = getFallbackContent(path, requestedLocale);
  if (!cmsPayload) return fallbackContent;
  try {
    const normalized = normalizePayload(cmsPayload, path, requestedLocale);
    const pageLocale = currentLocale(normalized.page?.locale);
    // CMS API locale-falls back to English when a translation is missing. Keep the
    // offline locale copy instead of flashing English over the initial render.
    if (pageLocale !== requestedLocale) {
      return fallbackContent;
    }
    const cmsContent = adaptContent(normalized, path, "cms", requestedLocale);
    return mergeLocalizedShell(cmsContent, fallbackContent, requestedLocale);
  } catch {
    return fallbackContent;
  }
}
