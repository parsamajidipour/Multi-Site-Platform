import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, Globe2, Home, Mail, Phone, Send } from "lucide-react";
import { fetchCmsPage, submitInquiry } from "./lib/cmsClient";
import { getFallbackContent, getPageContent } from "./lib/contentAdapter";

import {
  site,
  brand,
  heroMedia,
  languages,
  groupSites,
  localizedGroupSites,
  supportPages,
  ui,
  pageCopy,
  kindMap,
  iconMap,
  newPages,
  localizedNewPages,
  supportDetails,
  pageDetails,
  buildPageContent,
  getLayoutVariant,
  buildSignatureContent,
} from "./data.js";

import {
  financeServices,
  financeHeroStats,
  tradeWhyPoints,
  tradeWorkFlow,
  tradeStandards,
  financeHomeNavItems,
} from "./financeData.js";

import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { HeroSection } from "./components/HeroSection.jsx";
import { SignatureBand } from "./components/SignatureBand.jsx";
import { OverviewBand } from "./components/OverviewBand.jsx";
import { DetailBand } from "./components/DetailBand.jsx";
import { ContentBand } from "./components/ContentBand.jsx";
import { DeliverablesBand } from "./components/DeliverablesBand.jsx";
import { ScenarioBand } from "./components/ScenarioBand.jsx";
import { PagesBand } from "./components/PagesBand.jsx";
import { FaqBand } from "./components/FaqBand.jsx";
import { GroupBand } from "./components/GroupBand.jsx";
import { ProcessBand } from "./components/ProcessBand.jsx";
import { ContactBand } from "./components/ContactBand.jsx";
import { FinanceAboutPage } from "./components/FinanceAboutPage.jsx";
import { FinanceServicesPage } from "./components/FinanceServicesPage.jsx";
import { FinanceProcessPage } from "./components/FinanceProcessPage.jsx";
import { FinanceStandardsPage } from "./components/FinanceStandardsPage.jsx";
import { FinanceContactPage } from "./components/FinanceContactPage.jsx";
import { FinanceCountriesPage } from "./components/FinanceCountriesPage.jsx";
import { FinanceServiceDetailPage } from "./components/FinanceServiceDetailPage.jsx";

const inquirySuccessMessage = "Your message has been received. We will contact you soon.";
const inquiryErrorMessage = "Unable to send your message. Please try again later.";

function uiOr(content, key, fallback) {
  const value = content?.uiStrings?.[key];
  return value && String(value).trim() ? value : fallback;
}

const FINANCE_DETAIL_PATHS = ["/about", "/services", "/import-export", "/shipping", "/currency-transfer", "/process", "/standards", "/countries", "/contact"];
const LANGUAGE_STORAGE_KEY = "rezaei-locale";
const supportedLanguageCodes = new Set(languages.map((item) => item.code));
const financeFormCopy = {
  en: {
    fullName: "Full Name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+968...",
    serviceType: "Service Type",
    selectService: "Select a service...",
    importExport: "Import & Export",
    shipping: "Shipping Documents",
    currency: "Currency Transfer",
    fx: "Foreign Exchange",
    general: "General Trade Inquiry",
    country: "Country",
    countryPlaceholder: "Your country",
    message: "Message",
    messagePlaceholder: "Describe your trade request: cargo type, origin, destination, document status, payment need, and timeline.",
    send: "Send Trade Request",
    startTrade: "Start a trade request",
    exploreServices: "Explore services",
    readAbout: "Read about the trade desk",
    viewAllServices: "View all services",
    seeProcess: "See our process",
    viewStandards: "View operating standards",
    viewCountries: "View country coverage",
    routeContext: "Trade route context",
    address: "Muscat, Sultanate of Oman",
  },
  tr: {
    fullName: "Ad Soyad",
    namePlaceholder: "Adınız ve soyadınız",
    email: "E-posta",
    emailPlaceholder: "eposta@ornek.com",
    phone: "Telefon / WhatsApp",
    phonePlaceholder: "+968...",
    serviceType: "Hizmet Türü",
    selectService: "Bir hizmet seçin...",
    importExport: "İthalat ve İhracat",
    shipping: "Sevkiyat Belgeleri",
    currency: "Para Transferi",
    fx: "Döviz",
    general: "Genel Ticaret Talebi",
    country: "Ülke",
    countryPlaceholder: "Ülkeniz",
    message: "Mesaj",
    messagePlaceholder: "Ticaret talebinizi açıklayın: yük türü, çıkış, varış, belge durumu, ödeme ihtiyacı ve zamanlama.",
    send: "Ticaret talebi gönder",
    startTrade: "Ticaret talebi başlat",
    exploreServices: "Hizmetleri incele",
    readAbout: "Ticaret masasını okuyun",
    viewAllServices: "Tüm hizmetleri gör",
    seeProcess: "Süreci gör",
    viewStandards: "Operasyon standartlarını gör",
    viewCountries: "Ülke kapsamını gör",
    routeContext: "Ticaret rotası bağlamı",
    address: "Muscat, Umman Sultanlığı",
  },
  fa: {
    fullName: "نام کامل",
    namePlaceholder: "نام کامل شما",
    email: "ایمیل",
    emailPlaceholder: "you@example.com",
    phone: "تلفن / واتساپ",
    phonePlaceholder: "+968...",
    serviceType: "نوع خدمات",
    selectService: "یک خدمت انتخاب کنید...",
    importExport: "واردات و صادرات",
    shipping: "اسناد حمل و نقل",
    currency: "انتقال ارز",
    fx: "تبدیل ارز",
    general: "درخواست عمومی تجارت",
    country: "کشور",
    countryPlaceholder: "کشور شما",
    message: "پیام",
    messagePlaceholder: "درخواست تجاری خود را توضیح دهید: نوع کالا، مبدا، مقصد، وضعیت اسناد، نیاز پرداخت و زمان‌بندی.",
    send: "ارسال درخواست تجاری",
    startTrade: "شروع درخواست تجاری",
    exploreServices: "مشاهده خدمات",
    readAbout: "درباره میز تجارت بخوانید",
    viewAllServices: "مشاهده همه خدمات",
    seeProcess: "مشاهده فرآیند",
    viewStandards: "مشاهده استانداردهای عملیاتی",
    viewCountries: "مشاهده پوشش کشورها",
    routeContext: "زمینه مسیر تجاری",
    address: "مسقط، سلطنت عُمان",
  },
  ar: {
    fullName: "الاسم الكامل",
    namePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    phone: "الهاتف / واتساب",
    phonePlaceholder: "+968...",
    serviceType: "نوع الخدمة",
    selectService: "اختر خدمة...",
    importExport: "الاستيراد والتصدير",
    shipping: "وثائق الشحن",
    currency: "تحويل العملات",
    fx: "صرف العملات",
    general: "استفسار تجاري عام",
    country: "الدولة",
    countryPlaceholder: "دولتك",
    message: "الرسالة",
    messagePlaceholder: "اشرح طلب التجارة: نوع الشحنة، المنشأ، الوجهة، حالة المستندات، حاجة الدفع، والجدول الزمني.",
    send: "إرسال طلب تجاري",
    startTrade: "بدء طلب تجاري",
    exploreServices: "استكشاف الخدمات",
    readAbout: "اقرأ عن مكتب التجارة",
    viewAllServices: "عرض جميع الخدمات",
    seeProcess: "عرض العملية",
    viewStandards: "عرض معايير التشغيل",
    viewCountries: "عرض تغطية الدول",
    routeContext: "سياق مسار التجارة",
    address: "مسقط، سلطنة عُمان",
  },
};

function withSiteUrl(pathOrUrl, fallbackPath = "/") {
  const value = pathOrUrl || fallbackPath;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${site.publicUrl}${normalized}`;
}

function buildAlternateLinks(pathname) {
  const canonicalPath = pathname === "/" ? "/" : pathname;
  const canonicalUrl = withSiteUrl(canonicalPath);
  return languages.map(({ code }) => ({
    code,
    href: code === "en" ? canonicalUrl : `${canonicalUrl}?locale=${code}`,
  }));
}

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = (params.get("locale") || window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en").toLowerCase();
  return supportedLanguageCodes.has(requested) ? requested : "en";
}

function getCurrentPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function uniquePagesByHref(items) {
  const seen = new Set();
  return items.filter((item) => {
    const href = item?.[1];
    if (!href || seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const [path, setPath] = useState(getCurrentPath());
  const [content, setContent] = useState(() => getFallbackContent(getCurrentPath(), lang));
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [pendingSection, setPendingSection] = useState(null);

  const activeLang = languages.find((item) => item.code === lang) || languages[0];
  const siteKey = kindMap[site.kind] || "holding";
  const cmsExtra = content.extra || content.settings?.settings || {};
  const cmsBrand = content.brand || {};
  const cmsHeroMediaExtra = content.heroMedia || {};
  const baseHeroMedia = heroMedia[siteKey] || heroMedia.holding;
  const activeHeroMedia = {
    video: cmsHeroMediaExtra.video || cmsExtra.hero_video || baseHeroMedia.video,
    poster: cmsHeroMediaExtra.poster || cmsExtra.hero_poster || baseHeroMedia.poster,
  };
  const copy = pageCopy[siteKey][lang];
  const localizedBrand = {
    ...brand,
    ...cmsBrand,
    displayName:
      content.siteName ||
      (lang === "fa"
        ? "رضائی گلوبال م.م."
        : lang === "ar"
          ? "رضائي العالمية ذ.م.م."
          : brand.displayName),
    logoWide: cmsBrand.logoWide || brand.logoWide,
    logoStacked: cmsBrand.logoStacked || brand.logoStacked,
    favicon: cmsBrand.favicon || brand.logoStacked,
    color: cmsBrand.color || brand.color,
  };
  const cmsGroupSiteUrls = content.groupSiteUrls || cmsExtra.group_site_urls || {};
  const activeSiteUrls = {
    mainSite: cmsGroupSiteUrls.mainSite || groupSites.mainSite,
    realEstate: cmsGroupSiteUrls.realEstate || groupSites.realEstate,
    finance: cmsGroupSiteUrls.finance || groupSites.finance,
    visa: cmsGroupSiteUrls.visa || groupSites.visa,
  };
  const extraPage = localizedNewPages[lang]?.[siteKey] || newPages[siteKey];
  const fallbackNavPages = siteKey === "trade" ? copy.pages : [...copy.pages, extraPage];
  const navPages = content.navPages?.length ? content.navPages : fallbackNavPages;
  const footerPages = supportPages[lang];
  const pages = uniquePagesByHref([...navPages, extraPage, ...fallbackNavPages, ...footerPages]);
  const financeNavItems = useMemo(
    () => (navPages.length ? navPages.map(([sectionId, , label]) => [label, sectionId]) : financeHomeNavItems),
    [navPages],
  );
  const labels = ui[lang];
  const cmsPage = content.pageTuple?.[1] === path ? content.pageTuple : null;
  const page = cmsPage || pages.find((item) => item[1] === path) || copy.pages[0];
  const [pageId, pageHref, pageLabel, pageTitle, pageText] = page;

  const defaultDetail = {
      overview: pageText,
      cards: [
        [pageTitle, pageText],
        [labels.overview, pageText],
        [labels.prepare, pageText],
        [labels.followUp, pageText],
      ],
      process: copy.process,
      contact: pageText,
    };
  const englishDetail = pageDetails[siteKey]?.[pageId] || supportDetails[pageId] || defaultDetail;
  const detail = lang === "en" ? englishDetail : defaultDetail;

  const detailCards = detail.cards || [];
  const detailProcess = detail.process || copy.process;

  const detailSummary = [
    { title: `${pageTitle} ${labels.focus}`, text: detail.overview },
    { title: labels.prepare, text: detail.contact },
    { title: labels.followUp, text: detailProcess.join(" -> ") },
  ];

  const contentDepth = buildPageContent({ siteKey, pageId, pageLabel, pageTitle, pageText, detail, detailCards, detailProcess, lang });
  const siteDisplayName = localizedBrand.displayName;
  const cmsHome = content.home || {};
  const cmsHomeSections = cmsHome.sections || {};
  const cmsHero = cmsHome.hero || {};
  const financeHeroCards = cmsHero.cards?.length ? cmsHero.cards : financeHeroStats;
  const baseFinanceForm = financeFormCopy[lang] || financeFormCopy.en;
  const financeForm = {
    ...baseFinanceForm,
    fullName: uiOr(content, "form_full_name", baseFinanceForm.fullName),
    namePlaceholder: uiOr(content, "form_full_name_placeholder", baseFinanceForm.namePlaceholder),
    email: uiOr(content, "form_email", baseFinanceForm.email),
    emailPlaceholder: uiOr(content, "form_email_placeholder", baseFinanceForm.emailPlaceholder),
    phone: uiOr(content, "form_phone", baseFinanceForm.phone),
    phonePlaceholder: uiOr(content, "form_phone_placeholder", baseFinanceForm.phonePlaceholder),
    serviceType: uiOr(content, "form_service_type", baseFinanceForm.serviceType),
    selectService: uiOr(content, "form_select_service", baseFinanceForm.selectService),
    importExport: uiOr(content, "form_option_import_export", baseFinanceForm.importExport),
    shipping: uiOr(content, "form_option_shipping", baseFinanceForm.shipping),
    currency: uiOr(content, "form_option_currency", baseFinanceForm.currency),
    fx: uiOr(content, "form_option_fx", baseFinanceForm.fx),
    general: uiOr(content, "form_option_general", baseFinanceForm.general),
    country: uiOr(content, "form_country", baseFinanceForm.country),
    countryPlaceholder: uiOr(content, "form_country_placeholder", baseFinanceForm.countryPlaceholder),
    message: uiOr(content, "form_message", baseFinanceForm.message),
    messagePlaceholder: uiOr(content, "form_message_placeholder", baseFinanceForm.messagePlaceholder),
    send: uiOr(content, "form_send", baseFinanceForm.send),
    startTrade: uiOr(content, "form_start_trade", baseFinanceForm.startTrade),
    exploreServices: uiOr(content, "form_explore_services", baseFinanceForm.exploreServices),
    readAbout: uiOr(content, "form_read_about", baseFinanceForm.readAbout),
    viewAllServices: uiOr(content, "form_view_all_services", baseFinanceForm.viewAllServices),
    seeProcess: uiOr(content, "form_see_process", baseFinanceForm.seeProcess),
    viewStandards: uiOr(content, "form_view_standards", baseFinanceForm.viewStandards),
    viewCountries: uiOr(content, "form_view_countries", baseFinanceForm.viewCountries),
    routeContext: uiOr(content, "form_route_context", baseFinanceForm.routeContext),
    address: content.settings?.contact_address || uiOr(content, "form_address", baseFinanceForm.address),
  };
  const serviceCards = cmsHomeSections.services?.cards?.length
    ? cmsHomeSections.services.cards
    : financeServices.map(({ title: cardTitle, text, meta }) => [cardTitle, text, "", meta]);
  const processCards = cmsHomeSections.process?.cards?.length
    ? cmsHomeSections.process.cards
    : tradeWorkFlow.map(([step, text]) => [step, text]);
  const standardsCards = cmsHomeSections.standards?.cards?.length
    ? cmsHomeSections.standards.cards
    : tradeStandards.map(([, cardTitle]) => [cardTitle, ""]);
  const cmsContactRows = [
    content.settings?.contact_email || "info@example.com",
    content.settings?.contact_phone || "+968 00 000 0000",
    financeForm.address,
  ];

  const title =
    pageHref === "/" && pageTitle === site.name
      ? `${siteDisplayName} | International Business Group`
      : `${pageTitle} | ${siteDisplayName}`;

  const isHome = path === "/";
  const isHolding = siteKey === "holding";
  const isPremiumFinanceHome = isHome && siteKey === "trade";
  const isFinanceDetailPage = lang === "en" && siteKey === "trade" && FINANCE_DETAIL_PATHS.includes(path);
  const useCmsDetailLayout = !isHome && lang !== "en";
  const isFaqPage = pageId === "faq";
  const isContactPage = pageId === "contact";
  const usesRtlFont = lang === "fa" || lang === "ar";
  const showCoreSections = !isFaqPage && !isContactPage;
  const layoutVariant = getLayoutVariant(siteKey, pageId);
  const signature = buildSignatureContent({ layoutVariant, pageTitle, detailCards, detailProcess, contentDepth, lang });
  const pageUrlPath = pageHref === "/" ? "/" : pageHref;
  const canonicalUrl = withSiteUrl(pageUrlPath);
  const brandLogoUrl = withSiteUrl(localizedBrand.logoStacked);
  const brandImageUrl = withSiteUrl(localizedBrand.logoWide);
  const alternateLinks = buildAlternateLinks(pageUrlPath);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": isHolding ? "Organization" : "LocalBusiness",
    name: siteDisplayName,
    url: canonicalUrl,
    logo: brandLogoUrl,
    image: brandImageUrl,
    description: pageText,
    areaServed:
      Array.isArray(content.areaServed) && content.areaServed.length
        ? content.areaServed
        : ["Sultanate of Oman", "Turkey", "Iran", "Arabic-speaking markets"],
    availableLanguage: ["English", "Turkish", "Farsi", "Arabic"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: content.settings?.contact_email || "",
      telephone: content.settings?.contact_phone || "",
    },
  };

  const serviceValue = useMemo(() => {
    if (siteKey === "residency") return pageId === "translation" ? "translation" : "residency";
    if (siteKey === "realEstate") return pageId === "materials" ? "materials" : "real_estate";
    if (siteKey === "trade") return pageId === "currency-transfer" ? "currency" : "trade";
    return "general";
  }, [pageId, siteKey]);

  useEffect(() => {
    function handlePopState() {
      setPath(getCurrentPath());
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    let isCurrent = true;
    const fallbackContent = getFallbackContent(path, lang);
    setContent(fallbackContent);
    fetchCmsPage(path, lang)
      .then((payload) => {
        if (isCurrent) setContent(getPageContent(path, payload, lang));
      })
      .catch(() => {
        if (isCurrent) setContent(fallbackContent);
      });
    return () => {
      isCurrent = false;
    };
  }, [path, lang]);

  useEffect(() => {
    if (!isPremiumFinanceHome) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0.08, 0.24, 0.48] },
    );

    financeHomeNavItems.forEach(([, sectionId]) => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [isPremiumFinanceHome]);

  // After navigating back to homepage from a detail page, scroll to the pending section
  useEffect(() => {
    if (!pendingSection || !isPremiumFinanceHome) return;
    const el = document.getElementById(pendingSection);
    if (el) {
      requestAnimationFrame(() => {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 80);
      });
    }
    setPendingSection(null);
  }, [pendingSection, isPremiumFinanceHome, path]);

  function navigate(href) {
    window.history.pushState({}, "", href);
    setPath(getCurrentPath());
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function navigateToHomeAnchor(sectionId) {
    navigate("/");
    setPendingSection(sectionId);
  }

  function changeLanguage(nextLang) {
    setLang(nextLang);
    const url = new URL(window.location.href);
    if (nextLang === "en") {
      url.searchParams.delete("locale");
    } else {
      url.searchParams.set("locale", nextLang);
    }
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  useEffect(() => {
    let secondFrame = 0;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const firstFrame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      secondFrame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        ScrollTrigger.refresh();
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [path, lang]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [path]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    if (!data.get("name") || !data.get("email") || !data.get("message")) {
      setStatus(labels.required);
      return;
    }
    try {
      await submitInquiry({
        site_key: "finance",
        page_slug: pageHref,
        locale: lang,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        company: String(data.get("company") || ""),
        country: String(data.get("country") || ""),
        subject: String(data.get("service") || labels.inquiry || ""),
        message: String(data.get("message") || ""),
      });
      form.reset();
      setStatus(uiOr(content, "inquiry_success", inquirySuccessMessage));
    } catch {
      setStatus(uiOr(content, "inquiry_error", inquiryErrorMessage));
    }
  }

  return (
    <div className={`siteShell theme-${siteKey}`} data-content-source={content.source} dir={activeLang.dir} lang={lang}>
      <Helmet>
        <html lang={lang} dir={activeLang.dir} />
        <title>{title}</title>
        <meta name="description" content={pageText} />
        <meta name="keywords" content={`${siteDisplayName}, ${copy.cards.join(", ")}`} />
        <link rel="canonical" href={canonicalUrl} />
        {alternateLinks.map((item) => (
          <link key={item.code} rel="alternate" hrefLang={item.code} href={item.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={pageText} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={brandImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={pageText} />
        <meta name="twitter:image" content={brandImageUrl} />
        <meta name="theme-color" content={localizedBrand.color || "#060d1a"} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet" />
        {usesRtlFont && (
          <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        )}
        <link rel="icon" href={localizedBrand.favicon || localizedBrand.logoStacked} />
        <link rel="apple-touch-icon" href={localizedBrand.logoStacked} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header
        lang={lang}
        setLang={changeLanguage}
        languages={languages}
        pages={navPages}
        pageHref={pageHref}
        navigate={navigate}
        labels={labels}
        brand={localizedBrand}
        site={site}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isPremiumFinanceHome={isPremiumFinanceHome}
        isFinanceDetailPage={isFinanceDetailPage}
        activeSection={activeSection}
        homeNavItems={financeNavItems}
        navigateToHomeAnchor={navigateToHomeAnchor}
      />

      <main
        key={`${path}-${lang}`}
        className={
          isPremiumFinanceHome
            ? "pageMain financeLanding page-home"
            : isFinanceDetailPage
            ? `pageMain financeDetail page-${path.slice(1)}`
            : `pageMain layout-${layoutVariant} page-${pageId}`
        }
      >
        {isPremiumFinanceHome ? (
          <>
            {/* 1 — Hero */}
            <section className="financeHero" id="home">
              <video className="heroVideo" autoPlay muted loop playsInline poster={activeHeroMedia.poster}>
                <source src={activeHeroMedia.video} type="video/mp4" />
              </video>
              <div className="heroBackdrop" />
              <div className="financeHeroInner">
                <div className="financeHeroCopy">
                  <div className="heroLogoPanel" aria-label={localizedBrand.displayName}>
                    <img src={localizedBrand.logoStacked} alt={localizedBrand.displayName} />
                  </div>
                  <p className="eyebrow">{cmsHero.eyebrow ?? "Finance, Trade & Cross-Border Operations"}</p>
                  <h1>{cmsHero.title ?? "Premium coordination for import, export, FX, and trade payments."}</h1>
                  <p className="lead">
                    {cmsHero.lead ?? "Rezaei Finance connects commercial teams, suppliers, shipment files, and currency needs with a clear operating path for international trade."}
                  </p>
                  <div className="actions">
	                    <button
	                      type="button"
	                      className="primaryButton"
	                      onClick={() => navigate("/contact")}
	                    >
                      {cmsHero.buttons?.[0]?.label ?? financeForm.startTrade}
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
	                    <button
	                      type="button"
	                      className="secondaryButton"
	                      onClick={() => navigate("/countries")}
	                    >
	                      Country Coverage
	                    </button>
                  </div>
                </div>
                <div className="financeHeroPanel" aria-label="Trade desk highlights">
                  {financeHeroCards.map(([value, label, text]) => (
                    <article key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                      <p>{text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            {/* 2 — About (dark) */}
            <section className="tradeMission layoutSection" id="about">
              <div className="sectionGrid">
                <div>
                  <p className="eyebrow">{cmsHomeSections.about?.eyebrow ?? "About the Trade Desk"}</p>
                  <h2>{cmsHomeSections.about?.title ?? "Operational coordination built for cross-border business."}</h2>
                  <p className="sectionIntro">
                    {cmsHomeSections.about?.summary ?? "Rezaei Finance is the trade coordination arm of REZAEI GLOBAL LLC — one desk for import-export, shipping documents, and currency transfer."}
                  </p>
                </div>
                <div className="missionCopy">
                  <p>{cmsHomeSections.about?.summary ?? "Operational coordination keeps sourcing, customs papers, and payment transfers connected inside one workflow."}</p>
                  {lang === "en" && (
                    <ul className="tradeAboutPoints">
                      {tradeWhyPoints.map(([title]) => (
                        <li key={title}>
                          <CheckCircle2 size={20} aria-hidden="true" />
                          {title}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button type="button" className="secondaryButton" onClick={() => navigate("/about")}>
                    {cmsHomeSections.about?.buttons?.[0]?.label ?? financeForm.readAbout} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            {/* 3 — Services (light) */}
            <section className="tradeUnits layoutSection" id="services">
              <div className="sectionInner">
                <div className="holdingSectionHeader">
                  <div>
                    <p className="eyebrow">{cmsHomeSections.services?.eyebrow ?? "Service Lines"}</p>
                    <h2>{cmsHomeSections.services?.title ?? "Three focused paths for trade coordination."}</h2>
                  </div>
                  <p>{cmsHomeSections.services?.summary ?? "Import & export, shipping document follow-up, and FX payment support — each with its own inquiry path."}</p>
                </div>
                <div className="serviceSummaryGrid">
                  {serviceCards.map(([cardTitle, cardText, , cardMeta], index) => {
                    const Icon = financeServices[index]?.Icon || Globe2;
                    return (
                    <article className="serviceSummaryCard" key={cardTitle}>
                      <Icon size={32} aria-hidden="true" />
                      <h3>{cardTitle}</h3>
                      <span>{cardMeta}</span>
                      <p>{cardText}</p>
                    </article>
                  );
                  })}
                </div>
                <div className="sectionCtaRow">
                  <button type="button" className="primaryButton" onClick={() => navigate("/services")}>
                    {cmsHomeSections.services?.buttons?.[0]?.label ?? financeForm.viewAllServices} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            {/* 4 — Process (light) */}
            <section className="tradeProcess layoutSection" id="process">
              <div className="sectionInner">
                <div className="holdingSectionHeader">
                  <div>
                    <p className="eyebrow">{cmsHomeSections.process?.eyebrow ?? "How We Work"}</p>
                    <h2>{cmsHomeSections.process?.title ?? "From trade request to file completion."}</h2>
                  </div>
                  <p>{cmsHomeSections.process?.summary ?? "Each request follows a defined path — assessed, routed, and tracked until documents and payments are confirmed."}</p>
                </div>
                <div className="tradeProcessGrid">
                  {processCards.map(([step, text], index) => (
                    <div className="tradeProcessCard" key={step}>
                      <span className="processStepBadge">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{step}</h3>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
                <div className="sectionCtaRow">
                  <button type="button" className="secondaryButton" onClick={() => navigate("/process")}>
                    {cmsHomeSections.process?.buttons?.[0]?.label ?? financeForm.seeProcess} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            {/* 5 — Standards (light, two-column) */}
            <section className="tradeGovernance layoutSection" id="standards">
              <div className="sectionGrid">
                <div>
                  <p className="eyebrow">{cmsHomeSections.standards?.eyebrow ?? "Operating Standards"}</p>
                  <h2>{cmsHomeSections.standards?.title ?? "Trade coordination built on document discipline."}</h2>
                  <p className="sectionIntro">
                    {cmsHomeSections.standards?.summary ?? "Each request moves through defined checks before the desk commits to a timeline or payment path."}
                  </p>
                  <button type="button" className="secondaryButton" onClick={() => navigate("/standards")}>
                    {cmsHomeSections.standards?.buttons?.[0]?.label ?? financeForm.viewStandards} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
                <div className="governanceGrid">
                  {standardsCards.map(([cardTitle], index) => {
                    const Icon = tradeStandards[index]?.[0] || CheckCircle2;
                    return (
                    <article key={cardTitle}>
                      <Icon size={24} aria-hidden="true" />
                      <h3>{cardTitle}</h3>
                    </article>
                  );
                  })}
                </div>
              </div>
            </section>

            {/* 6 — Countries / routes (light) */}
            <section className="tradeUnits layoutSection" id="countries">
              <div className="sectionInner">
                <div className="holdingSectionHeader">
                  <div>
                    <p className="eyebrow">{cmsHomeSections.countries?.eyebrow ?? "Countries"}</p>
                    <h2>{cmsHomeSections.countries?.title ?? "Country and route coverage."}</h2>
                  </div>
                  <p>{cmsHomeSections.countries?.summary ?? "Trade requests are reviewed through origin, destination, supplier country, buyer country, documents, and payment route."}</p>
                </div>
                <div className="serviceSummaryGrid">
                  {(cmsHomeSections.countries?.cards || [
                    ["Sultanate of Oman", "A regional coordination base for trade, documents, payment timing, and business follow-up."],
                    ["Turkey", "Supplier communication, export coordination, and shipment documentation for Turkey-linked requests."],
                    ["Iran", "Practical routing for inquiries involving Iranian suppliers, buyers, documents, or market context."],
                    ["China", "Sourcing and shipment coordination where product origin, supplier readiness, and documents need clarity."],
                  ]).map(([countryTitle, countryText]) => (
                    <article className="serviceSummaryCard" key={countryTitle}>
                      <Globe2 size={32} aria-hidden="true" />
                      <h3>{countryTitle}</h3>
                      <span>{financeForm.routeContext}</span>
                      <p>{countryText}</p>
                    </article>
                  ))}
                </div>
                <div className="sectionCtaRow">
                  <button type="button" className="primaryButton" onClick={() => navigate("/countries")}>
                    {cmsHomeSections.countries?.buttons?.[0]?.label ?? financeForm.viewCountries} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            {/* 7 — Contact (dark, two-column with form) */}
            <section className="tradeContact layoutSection" id="contact">
              <div className="holdingContactInner">
                <div className="holdingContactInfo">
                  <p className="eyebrow">{cmsHomeSections.contact?.eyebrow ?? "Contact"}</p>
                  <h2>{cmsHomeSections.contact?.title ?? "Send a trade request."}</h2>
                  <p className="sectionIntro">
                    {cmsHomeSections.contact?.summary ?? "Use this form for import, export, shipping, currency transfer, or FX inquiries. Include goods type, origin, destination, document status, and payment deadline where relevant."}
                  </p>
                  <div className="contactDetails">
                    <span><Mail size={18} aria-hidden="true" /> {cmsContactRows[0]}</span>
                    <span><Phone size={18} aria-hidden="true" /> {cmsContactRows[1]}</span>
                    <span><Home size={18} aria-hidden="true" /> {cmsContactRows[2]}</span>
                  </div>
                </div>
                <div className="holdingFormWrapper">
                  <form className="holdingContactForm" onSubmit={handleSubmit}>
                    <div className="formField">
                      <label htmlFor="tc-name">{financeForm.fullName}</label>
                      <input id="tc-name" name="name" type="text" placeholder={financeForm.namePlaceholder} required />
                    </div>
                    <div className="formRow2">
                      <div className="formField">
                        <label htmlFor="tc-email">{financeForm.email}</label>
                        <input id="tc-email" name="email" type="email" placeholder={financeForm.emailPlaceholder} />
                      </div>
                      <div className="formField">
                        <label htmlFor="tc-phone">{financeForm.phone}</label>
                        <input id="tc-phone" name="phone" type="tel" placeholder={financeForm.phonePlaceholder} />
                      </div>
                    </div>
                    <div className="formRow2">
                      <div className="formField">
                        <label htmlFor="tc-service">{financeForm.serviceType}</label>
                        <select id="tc-service" name="service">
                          <option value="">{financeForm.selectService}</option>
                          <option value="trade">{financeForm.importExport}</option>
                          <option value="shipping">{financeForm.shipping}</option>
                          <option value="currency">{financeForm.currency}</option>
                          <option value="fx">{financeForm.fx}</option>
                          <option value="general">{financeForm.general}</option>
                        </select>
                      </div>
                      <div className="formField">
                        <label htmlFor="tc-country">{financeForm.country}</label>
                        <input id="tc-country" name="country" type="text" placeholder={financeForm.countryPlaceholder} />
                      </div>
                    </div>
                    <div className="formField">
                      <label htmlFor="tc-message">{financeForm.message}</label>
                      <textarea id="tc-message" name="message" rows={5} placeholder={financeForm.messagePlaceholder} required />
                    </div>
                    <button className="primaryButton contactSubmitBtn" type="submit">
                      <Send size={18} aria-hidden="true" />
                      {financeForm.send}
                    </button>
                    {status && <p className="formStatus holdingFormStatus">{status}</p>}
                  </form>
                </div>
              </div>
            </section>
          </>
        ) : useCmsDetailLayout ? (
          <LocalizedFinanceCmsPage
            content={content}
            financeForm={financeForm}
            handleSubmit={handleSubmit}
            navigate={navigate}
            pageLabel={pageLabel}
            pageText={pageText}
            pageTitle={pageTitle}
            status={status}
          />
        ) : isFinanceDetailPage ? (
          <>
	            {path === "/about" && <FinanceAboutPage navigate={navigate} cmsSections={content.sections} />}
	            {path === "/services" && <FinanceServicesPage navigate={navigate} cmsSections={content.sections} />}
	            {path === "/import-export" && <FinanceServiceDetailPage navigate={navigate} serviceId="import-export" />}
	            {path === "/shipping" && <FinanceServiceDetailPage navigate={navigate} serviceId="shipping" />}
	            {path === "/currency-transfer" && <FinanceServiceDetailPage navigate={navigate} serviceId="currency-transfer" />}
	            {path === "/process" && <FinanceProcessPage navigate={navigate} cmsSections={content.sections} />}
            {path === "/standards" && <FinanceStandardsPage navigate={navigate} cmsSections={content.sections} />}
            {path === "/countries" && <FinanceCountriesPage navigate={navigate} />}
            {path === "/contact" && <FinanceContactPage navigate={navigate} handleSubmit={handleSubmit} status={status} />}
          </>
        ) : (
          <>
            <HeroSection
              isHome={isHome}
              activeHeroMedia={activeHeroMedia}
              copy={copy}
              labels={labels}
              lang={lang}
              brand={localizedBrand}
              pageLabel={pageLabel}
              pageTitle={pageTitle}
              pageText={pageText}
              navigate={navigate}
              pages={pages}
            />

            {showCoreSections && (
              <>
                <SignatureBand signature={signature} />

                <OverviewBand
                  labels={labels}
                  pageTitle={pageTitle}
                  detail={detail}
                  detailCards={detailCards}
                  iconMap={iconMap}
                />

                <DetailBand
                  labels={labels}
                  pageTitle={pageTitle}
                  detailSummary={detailSummary}
                  iconMap={iconMap}
                />

                <ContentBand
                  labels={labels}
                  pageLabel={pageLabel}
                  contentDepth={contentDepth}
                />

                <DeliverablesBand
                  labels={labels}
                  pageTitle={pageTitle}
                  contentDepth={contentDepth}
                  iconMap={iconMap}
                />

                <ScenarioBand
                  labels={labels}
                  pageTitle={pageTitle}
                  contentDepth={contentDepth}
                  iconMap={iconMap}
                />
              </>
            )}

            {isFaqPage && <FaqBand pageTitle={pageTitle} contentDepth={contentDepth} labels={labels} brand={localizedBrand} cmsQuestions={content.faqQuestions} />}

            {pageId === "group" && isHolding && (
              <GroupBand labels={labels} groupSites={{ ...(localizedGroupSites[lang] || groupSites), ...activeSiteUrls }} />
            )}

            {pageId === "governance" && (
              <ProcessBand labels={labels} detailProcess={detailProcess} />
            )}

            {isContactPage && (
              <ContactBand
                labels={labels}
                detail={detail}
                pageHref={pageHref}
                pageTitle={pageTitle}
                handleSubmit={handleSubmit}
                status={status}
              />
            )}
          </>
        )}
      </main>

      <Footer
        footerPages={footerPages}
        navigate={navigate}
        site={site}
        brand={localizedBrand}
        labels={labels}
        footerText={content.footerText || content.settings?.footer_text}
        siteUrls={activeSiteUrls}
      />
    </div>
  );
}

function LocalizedFinanceCmsPage({ content, financeForm, handleSubmit, navigate, pageLabel, pageText, pageTitle, status }) {
  const sections = (content.sections || []).filter((section) => section.key !== "hero");
  const isContact = sections.some((section) => section.type === "contact" || section.key === "contact");

  return (
    <>
      <section className="pageHero">
        <div className="heroBackdrop" aria-hidden="true" />
        <div className="heroInner">
          <p className="eyebrow">{pageLabel}</p>
          <h1>{pageTitle}</h1>
          <p className="lead">{pageText}</p>
        </div>
      </section>

      <section className="contentSection">
        <div className="sectionInner">
          {sections.map((section) => (
            <article className="contentBlock" key={section.key}>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              {section.text && <p>{section.text}</p>}
              {section.cards?.length > 0 && (
                <div className="serviceSummaryGrid">
                  {section.cards.map(([title, text, href], index) => (
                    <article className="serviceSummaryCard" key={`${section.key}-${index}`}>
                      <CheckCircle2 size={24} aria-hidden="true" />
                      <h3>{title}</h3>
                      <p>{text}</p>
                      {href && (
                        <button type="button" className="secondaryButton" onClick={() => navigate(href)}>
                          {title} <ArrowRight size={14} aria-hidden="true" />
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {isContact && (
        <section className="tradeContact layoutSection">
          <div className="holdingFormWrapper">
            <form className="holdingContactForm" onSubmit={handleSubmit}>
              <div className="formField">
                <label htmlFor="localized-finance-name">{financeForm.fullName}</label>
                <input id="localized-finance-name" name="name" type="text" placeholder={financeForm.namePlaceholder} required />
              </div>
              <div className="formRow2">
                <div className="formField">
                  <label htmlFor="localized-finance-email">{financeForm.email}</label>
                  <input id="localized-finance-email" name="email" type="email" placeholder={financeForm.emailPlaceholder} />
                </div>
                <div className="formField">
                  <label htmlFor="localized-finance-phone">{financeForm.phone}</label>
                  <input id="localized-finance-phone" name="phone" type="tel" placeholder={financeForm.phonePlaceholder} />
                </div>
              </div>
              <div className="formField">
                <label htmlFor="localized-finance-message">{financeForm.message}</label>
                <textarea id="localized-finance-message" name="message" rows={5} placeholder={financeForm.messagePlaceholder} required />
              </div>
              <button className="primaryButton contactSubmitBtn" type="submit">
                <Send size={18} aria-hidden="true" />
                {financeForm.send}
              </button>
              {status && <p className="formStatus holdingFormStatus">{status}</p>}
            </form>
          </div>
        </section>
      )}
    </>
  );
}
