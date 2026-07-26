import { applyProjectsLocale } from "./projectContentLocales.js";
import fallbackSeed from "../content/fallback.json";

const FALLBACK_SOURCE = "fallback";
const CMS_SOURCE = "cms";
const SUPPORTED_LOCALES = new Set(["en", "tr", "fa", "ar"]);
const REMOVED_PATHS = new Set(["/residential-properties", "/commercial-properties", "/development-land", "/quotation"]);

const fallbackSettings = {
  contact_email: "info@example.com",
  contact_phone: "+968 00 000 0000",
  contact_address: "Muscat, Sultanate of Oman",
  footer_text: "Premium real estate, construction, investment, and material coordination.",
  settings: {
    brand_logo_wide: "/brand/rezaei-global-logo-wide-web.png",
    brand_logo_stacked: "/brand/rezaei-global-logo-stacked-web.png",
    hero_video: "/media/hero/real-estate-hero-v2.mp4",
    hero_poster: "/brand/rezaei-global-logo-stacked-web.png",
  },
};

const sectionHref = {
  home: "/",
  properties: "/properties",
  projects: "/projects",
  materials: "/materials",
  insights: "/insights",
  contact: "/contact",
};

function normalizePath(pathname) {
  const normalized = String(pathname || "/").replace(/\/+$/, "");
  return normalized || "/";
}

function isRemovedPath(pathname) {
  return REMOVED_PATHS.has(normalizePath(pathname));
}

function sanitizeHref(href) {
  if (!href || !String(href).startsWith("/")) return valueOr(href);
  return isRemovedPath(href) ? "" : href;
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

function firstSection(sections, matcher) {
  return sortByOrder(sections).find(matcher);
}

function bodyText(...parts) {
  return parts.filter((part) => part !== undefined && part !== null && part !== "").join(" ");
}

function valueOr(value, fallback = "") {
  return value === undefined || value === null ? fallback : value;
}

function arrayFromSetting(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function contentSectionsOnly(sections) {
  return sortByOrder(sections).filter(
    (section) => !["hero", "cta", "contact"].includes(section.section_key) && section.type !== "cta",
  );
}

function isListingBlock(block) {
  const settings = block.settings || {};
  return (
    settings.price ||
    settings.beds !== undefined ||
    settings.baths !== undefined ||
    settings.status ||
    settings.location ||
    settings.gallery?.length
  );
}

function parsePriceValue(price) {
  if (typeof price !== "string") return 0;
  const match = price.replace(/,/g, "").match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

function mapProjectBlock(section) {
  return (block) => ({
    slug: block.block_key || valueOr(block.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    id: block.block_key || valueOr(block.title).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: valueOr(block.title),
    title: valueOr(block.title),
    text: valueOr(block.body),
    href: valueOr(block.href),
    image: valueOr(block.image_url, block.settings?.image),
    imagePosition: valueOr(block.settings?.imagePosition, "center"),
    gallery: arrayFromSetting(block.settings?.gallery),
    category: valueOr(block.settings?.category, section.title || "Project"),
    status: valueOr(block.settings?.status, block.subtitle || "Active Project"),
    location: valueOr(block.settings?.location, "Muscat, Oman"),
    projectType: valueOr(block.settings?.projectType, block.settings?.project_type || section.title || "Project"),
    area: valueOr(block.settings?.area, "Project area"),
    completionYear: valueOr(block.settings?.completionYear, block.settings?.completion_year || "2025"),
    developmentType: valueOr(block.settings?.developmentType, block.settings?.development_type || section.title || "Project"),
    market: valueOr(block.settings?.market, "Oman"),
    description: valueOr(block.subtitle, block.body),
    overview: valueOr(block.settings?.overview, block.body),
    scope: arrayFromSetting(block.settings?.scope),
    highlights: arrayFromSetting(block.settings?.highlights),
  });
}

function adaptProjects(sections, locale = "en") {
  const projects = contentSectionsOnly(sections).flatMap((section) => displayBlocks(section).map(mapProjectBlock(section)));
  return applyProjectsLocale(projects, locale);
}

function adaptPropertyListings(sections) {
  return contentSectionsOnly(sections).flatMap((section) => {
    const listingSection = section.section_key === "property-listings";
    return displayBlocks(section)
      .filter((block) => listingSection || isListingBlock(block))
      .map((block) => {
        const settings = block.settings || {};
        const priceValue = Number(settings.priceValue ?? settings.price_value ?? 0);
        const location = valueOr(settings.location, block.subtitle);
        return {
          id: valueOr(block.block_key, valueOr(block.title).replace(/\s+/g, "-")),
          title: valueOr(block.title),
          location,
          city: valueOr(settings.city, location.split(",")[0]?.trim() || "Muscat"),
          type: valueOr(settings.type, settings.property_type, "Property"),
          purpose: valueOr(settings.purpose, "Buy"),
          price: valueOr(settings.price, block.subtitle),
          priceValue: Number.isFinite(priceValue) && priceValue > 0 ? priceValue : parsePriceValue(settings.price),
          beds: settings.beds ?? null,
          baths: settings.baths ?? null,
          area: valueOr(settings.area, block.body),
          image: valueOr(block.image_url, settings.image, "/brand/rezaei-global-logo-stacked-web.png"),
          badge: valueOr(settings.badge),
          status: valueOr(settings.status, block.subtitle),
          gallery: arrayFromSetting(settings.gallery),
        };
      });
  });
}

function adaptCardSections(sections) {
  return contentSectionsOnly(sections).flatMap((section) =>
    displayBlocks(section).map((block) => ({
      id: block.block_key || valueOr(block.title).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: valueOr(block.title),
      text: valueOr(block.body),
      label: valueOr(block.title),
      desc: valueOr(block.body),
      category: valueOr(section.subtitle, section.title),
      sectionKey: section.section_key,
      iconKey: valueOr(block.settings?.iconKey, block.settings?.icon_key, section.section_key),
      href: sanitizeHref(block.href),
      image: valueOr(block.image_url, block.settings?.image),
      tags: arrayFromSetting(block.settings?.tags),
    })),
  );
}

function adaptInsights(sections) {
  return adaptCardSections(sections);
}

function adaptMaterials(sections) {
  return adaptCardSections(sections);
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

  if (!site || !page) {
    throw new Error("Fallback content is missing the requested page");
  }

  const navigation = (site.navigation || []).filter((item) => (item.locale || defaultLocale) === (page.locale || defaultLocale));

  return {
    site: {
      key: site.key,
      name: site.name,
      domain: site.domain,
      default_locale: site.default_locale,
    },
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

  if (payload?.site?.pages) {
    return pageFromSeed(payload, pathname, locale);
  }

  throw new Error("CMS content shape is not supported");
}

function assertPagePayload(payload) {
  if (!payload?.site || !payload?.page || !Array.isArray(payload.sections)) {
    throw new Error("CMS page payload is incomplete");
  }

  if (typeof payload.page.title !== "string" || !payload.page.title.trim()) {
    throw new Error("CMS page title is invalid");
  }
}

function adaptNavigation(navigation, locale = "en") {
  const fallbackNav = pageFromSeed(fallbackSeed, "/", locale).navigation;
  const items = navigation?.length ? navigation : fallbackNav;

  return sortByOrder(items)
    .filter((item) => !isRemovedPath(item.href))
    .map((item) => ({
      label: item.label,
      sectionId: item.section_key || item.href?.replace(/^\/+/, "") || "home",
      href: item.href || sectionHref[item.section_key] || "/",
    }));
}

function adaptHome(payload) {
  const sections = sortByOrder(payload.sections);
  const hero = firstSection(sections, (section) => section.section_key === "home" || section.type === "hero") || {};
  const contact = firstSection(sections, (section) => section.section_key === "contact" || section.type === "contact") || {};

  const homeSections = sections
    .filter((section) => !["home", "contact"].includes(section.section_key))
    .map((section) => {
      const cards = displayBlocks(section);
      const button = actionBlocks(section)[0];

      return {
        id: section.section_key,
        iconKey: section.section_key,
        eyebrow: valueOr(section.subtitle, section.title),
        title: valueOr(section.title),
        text: bodyText(section.summary, section.body),
        href: sanitizeHref(valueOr(button?.href, sectionHref[section.section_key] || "/contact")),
        items: cards.map((block) => [valueOr(block.title), valueOr(block.body)]),
      };
    });

  const heroButtons = actionBlocks(hero);

  return {
    hero: {
      eyebrow: valueOr(hero.subtitle, payload.page.title),
      title: valueOr(hero.title, payload.page.title),
      lead: valueOr(hero.summary, payload.page.seo?.description || ""),
      cards: displayBlocks(hero).map((block) => ({
        title: valueOr(block.title),
        text: valueOr(block.body),
      })),
      actions: heroButtons.map((block) => ({
        label: valueOr(block.title),
        href: sanitizeHref(valueOr(block.href, "/contact")),
      })),
    },
    sections: homeSections,
    contact: {
      eyebrow: valueOr(contact.subtitle, "Contact"),
      title: valueOr(contact.title, "Send a real-estate request."),
      text: bodyText(contact.summary, contact.body),
      rows: blocksOfType(contact, "contact_row").map((block) => ({
        label: valueOr(block.title),
        value: valueOr(block.body),
      })),
      detailHref: "/contact",
    },
  };
}

function adaptDetail(payload, pathname, locale = "en") {
  const path = normalizePath(pathname);
  const sections = sortByOrder(payload.sections);
  const hero = firstSection(sections, (section) => section.section_key === "hero" || section.type === "hero") || {};
  const contentSections = sections.filter((section) => !["hero", "cta"].includes(section.section_key) && section.type !== "cta");
  const cta = firstSection(sections, (section) => section.section_key === "cta" || section.type === "cta");
  const buttons = actionBlocks(cta);
  const slugKey = path.replace(/^\/+/, "") || "home";

  const blocks = contentSections.flatMap((section) =>
    displayBlocks(section).map((block) => ({
      title: valueOr(block.title),
      text: valueOr(block.body),
      href: sanitizeHref(block.href),
    })),
  );
  const propertyTabs = path === "/properties"
    ? contentSections
        .filter((section) => String(section.section_key || "").startsWith("property-category-"))
        .map((section) => ({
          id: section.settings?.tab_slug || section.section_key,
          label: valueOr(section.title, section.subtitle || "Property category"),
          title: valueOr(section.subtitle, section.title),
          text: bodyText(section.summary, section.body),
          cards: displayBlocks(section).map((block) => ({
            title: valueOr(block.title),
            text: valueOr(block.body),
          })),
        }))
    : [];
  const projectTabs = path === "/projects" ? adaptProjects(sections, locale) : [];

  return {
    eyebrow: valueOr(hero.subtitle, payload.page.title),
    title: valueOr(hero.title, payload.page.title),
    lead: valueOr(hero.summary, payload.page.seo?.description || ""),
    iconKey: slugKey,
    cta: valueOr(buttons[0]?.title, ""),
    alternate: valueOr(buttons[1]?.title, ""),
    alternateHref: sanitizeHref(valueOr(buttons[1]?.href, "/contact")) || "/contact",
    ctaEyebrow: valueOr(cta?.subtitle, "Next Step"),
    ctaTitle: valueOr(cta?.title),
    ctaText: bodyText(cta?.summary, cta?.body),
    blocks: propertyTabs.length
      ? blocks.filter((block) => !["Residential property criteria", "Commercial and income-producing assets", "Investment review"].includes(block.title))
      : blocks,
    propertyTabs,
    projectTabs,
    contact: payload.page.page_type === "contact" || path === "/contact",
    contactTitle: valueOr(contentSections[0]?.title, "Share the requirement clearly."),
    contactLead: valueOr(
      bodyText(contentSections[0]?.summary, contentSections[0]?.body),
      "The form sends your inquiry to the CMS so the team can review the requirement and follow up from the admin panel.",
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

function adaptPrivacyOrTermsSections(sections) {
  return sortByOrder(sections)
    .filter((section) => section.type === "cards" && section.section_key !== "hero")
    .map((section) => ({
      category: valueOr(section.subtitle, section.title),
      items: displayBlocks(section).map((block) => ({ heading: valueOr(block.title), body: valueOr(block.body) })),
    }))
    .filter((section) => section.items.length > 0);
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

function adaptHeroMedia(extra) {
  return {
    video: valueOr(extra.hero_video, ""),
    poster: valueOr(extra.hero_poster, ""),
    backgroundImage: valueOr(extra.hero_background, ""),
  };
}

function adaptContent(payload, pathname, source, locale = "en") {
  assertPagePayload(payload);

  const path = normalizePath(pathname);
  const isHome = path === "/";
  const settings = payload.settings || fallbackSettings;
  const extra = settings.settings && typeof settings.settings === "object" ? settings.settings : {};
  const pageSeo = payload.page.seo || {};
  const uiStrings = buildUiStringsLookup(extra.ui_strings, locale);
  const brand = adaptBrand(extra);
  const heroMedia = adaptHeroMedia(extra);
  const groupSiteUrls = extra.group_site_urls && typeof extra.group_site_urls === "object" ? extra.group_site_urls : {};
  const footerTextByLocale =
    extra.footer_text_by_locale && typeof extra.footer_text_by_locale === "object" ? extra.footer_text_by_locale : {};
  const footerText = footerTextByLocale[locale] || settings.footer_text || "";

  let pageSections = null;
  if (path === "/faq") pageSections = adaptFaqSections(payload.sections);
  else if (path === "/privacy" || path === "/terms") pageSections = adaptPrivacyOrTermsSections(payload.sections);

  const propertyListings =
    path === "/properties" || path.startsWith("/properties/") ? adaptPropertyListings(payload.sections) : [];
  const projects = path === "/projects" || path.startsWith("/projects/") ? adaptProjects(payload.sections, locale) : [];
  const insights = path === "/insights" ? adaptInsights(payload.sections) : [];
  const materials = path === "/materials" ? adaptMaterials(payload.sections) : [];

  return {
    source,
    siteName: payload.site.name,
    navItems: adaptNavigation(payload.navigation, locale),
    settings,
    extra,
    uiStrings,
    brand,
    heroMedia,
    groupSiteUrls,
    footerText,
    areaServed: Array.isArray(extra.area_served) ? extra.area_served : [],
    seo: pageSeo,
    pageTitle: payload.page.title,
    pageDescription: valueOr(pageSeo.description, payload.page.title),
    pageKeywords: valueOr(pageSeo.keywords),
    ogImageUrl: valueOr(pageSeo.og_image_url, settings.settings?.brand_logo_wide || ""),
    home: isHome ? adaptHome(payload) : adaptHome(pageFromSeed(fallbackSeed, "/", locale)),
    detail: isHome ? null : adaptDetail(payload, path, locale),
    pageSections,
    propertyListings,
    projects,
    insights,
    materials,
  };
}

function missingContent(pathname, locale = "en") {
  const content = adaptContent(pageFromSeed(fallbackSeed, "/", locale), "/", FALLBACK_SOURCE, locale);

  return {
    ...content,
    notFound: true,
    detail: null,
    pageTitle: "Page Not Found",
    pageDescription: "That real-estate page is not available.",
    pageKeywords: "",
    seo: {
      title: "Page Not Found",
      description: "That real-estate page is not available.",
      keywords: "",
      og_image_url: content.ogImageUrl,
    },
    missingPath: normalizePath(pathname),
  };
}

export function getFallbackContent(pathname, locale = currentLocale()) {
  const path = normalizePath(pathname);

  if (isRemovedPath(path)) {
    return missingContent(path, locale);
  }

  try {
    return adaptContent(pageFromSeed(fallbackSeed, path, locale), path, FALLBACK_SOURCE, locale);
  } catch {
    return missingContent(path, locale);
  }
}

export function getPageContent(pathname, cmsPayload, locale = currentLocale()) {
  const path = normalizePath(pathname);
  const requestedLocale = currentLocale(locale);
  const fallbackContent = getFallbackContent(path, requestedLocale);

  if (!cmsPayload) {
    return fallbackContent;
  }

  if (isRemovedPath(path)) {
    return missingContent(path, locale);
  }

  try {
    const normalizedPayload = normalizePayload(cmsPayload, path, requestedLocale);
    if (normalizePath(normalizedPayload.page?.slug) !== path) {
      return missingContent(path, locale);
    }
    const pageLocale = currentLocale(normalizedPayload.page?.locale);
    if (pageLocale !== requestedLocale) {
      return fallbackContent;
    }
    return adaptContent(normalizedPayload, path, CMS_SOURCE, requestedLocale);
  } catch {
    return fallbackContent;
  }
}

export function sectionIdForHref(href) {
  const path = normalizePath(href);
  const item = Object.entries(sectionHref).find(([, value]) => normalizePath(value) === path);
  return item?.[0] || null;
}
