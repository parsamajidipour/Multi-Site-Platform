import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Droplet,
  FileText,
  Globe,
  Home,
  Languages,
  Layers,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  PackageCheck,
  Phone,
  Ruler,
  Search,
  Send,
  TrendingUp,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LanguageSelector } from "@/components/LanguageSelector";
import { fetchCmsPage, submitInquiry } from "./lib/cmsClient";
import { getFallbackContent, getPageContent, sectionIdForHref } from "./lib/contentAdapter";
import { getPropertiesPageCopy } from "./lib/propertiesPageCopy";
import { getContactPageCopy } from "./lib/contactPageCopy";
import { getInsightsPageCopy } from "./lib/insightsPageCopy";
import { getMaterialsPageCopy } from "./lib/materialsPageCopy";
import { getProjectsPageCopy } from "./lib/projectsPageCopy";

const site = {
  kind: import.meta.env.VITE_SITE_KIND || "real-estate",
  name: import.meta.env.VITE_SITE_NAME || "REZAEI GLOBAL LLC",
  description:
    import.meta.env.VITE_SITE_DESCRIPTION ||
    "Premium real estate, construction, property investment, project coordination, and building materials support.",
  publicUrl: import.meta.env.VITE_PUBLIC_URL || "http://localhost",
};

const siteUrls = {
  mainSite: import.meta.env.VITE_MAIN_SITE_URL || "https://example.com",
  realEstate: import.meta.env.VITE_REAL_ESTATE_URL || "https://real-estate.example.com",
  finance: import.meta.env.VITE_FINANCE_URL || "https://finance.example.com",
  visa: import.meta.env.VITE_VISA_URL || "https://visa.example.com",
};

const inquirySuccessMessage = "Your message has been received. We will contact you soon.";
const inquiryErrorMessage = "Unable to send your message. Please try again later.";

function uiOr(content, key, fallback) {
  const value = content?.uiStrings?.[key];
  return value && String(value).trim() ? value : fallback;
}

const brand = {
  displayName: "REZAEI GLOBAL LLC",
  logoWide: "/brand/rezaei-global-logo-wide-web.png",
  logoStacked: "/brand/rezaei-global-logo-stacked-web.png",
  color: "#00357f",
};

const heroMedia = {
  video: "/media/hero/real-estate-hero-v2.mp4",
  poster: "/brand/rezaei-global-logo-stacked-web.png",
};
const languages = [
  { code: "en", label: "EN", name: "English", dir: "ltr" },
  { code: "tr", label: "TR", name: "Türkçe", dir: "ltr" },
  { code: "fa", label: "FA", name: "فارسی", dir: "rtl" },
  { code: "ar", label: "AR", name: "العربية", dir: "rtl" },
];
const LANGUAGE_STORAGE_KEY = "rezaei-locale";
const supportedLanguageCodes = new Set(languages.map((item) => item.code));

function withSiteUrl(pathOrUrl, fallbackPath = "/") {
  const value = pathOrUrl || fallbackPath;
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${site.publicUrl}${normalized}`;
}

function resolveBrandLogo(pathOrUrl, fallbackPath) {
  const logoMap = {
    "/brand/rezaei-global-logo-wide-transparent.png": "/brand/rezaei-global-logo-wide-web.png",
    "/brand/rezaei-global-logo-stacked-transparent.png": "/brand/rezaei-global-logo-stacked-web.png",
  };
  const value = pathOrUrl || fallbackPath;
  return logoMap[value] || value;
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

const iconMap = {
  properties: Building2,
  projects: ClipboardCheck,
  materials: PackageCheck,
  insights: BarChart3,
  contact: Mail,
  home: Home,
};

function resolveIcon(iconKey) {
  return iconMap[iconKey] || Building2;
}

function resolveContactIcon(label, channel) {
  if (channel === "phone") return Phone;
  if (channel === "location") return Home;
  if (channel === "email") return Mail;
  const value = String(label || "").toLowerCase();
  if (value.includes("phone") || value.includes("whatsapp") || value.includes("تلفن") || value.includes("هاتف")) return Phone;
  if (value.includes("location") || value.includes("address") || value.includes("موقعیت") || value.includes("الموقع")) return Home;
  return Mail;
}

function renderHeroTitle(title) {
  if (title !== "Property and project opportunities shaped for serious decisions.") {
    return title;
  }

  return (
    <>
      <span className="heroTitleFocus">Property</span>
      <span className="heroTitleSmall"> and </span>
      <span className="heroTitleFocus">project opportunities</span>
      <span className="heroTitleSmall"> shaped for </span>
      <span className="heroTitleAccent">serious decisions.</span>
    </>
  );
}

const navItems = [
  { label: "Home", sectionId: "home", href: "/" },
  { label: "Construction", sectionId: "properties", href: "/properties" },
  { label: "Projects", sectionId: "projects", href: "/projects" },
  { label: "Building Materials", sectionId: "materials", href: "/materials" },
  { label: "Market Insights", sectionId: "insights", href: "/insights" },
  { label: "Contact", sectionId: "contact", href: "/contact" },
];

const supportPages = [
  { label: "FAQ", href: "/faq", title: "Frequently Asked Questions" },
  { label: "Privacy", href: "/privacy", title: "Privacy and Data Handling" },
  { label: "Terms", href: "/terms", title: "Website Terms" },
];

const uiCopy = {
  en: {
    contactDetail: "Contact detail page", openPage: "Open page", contactForm: "Contact Form", nextStep: "Next Step",
    fullName: "Full Name", namePlaceholder: "Your full name", email: "Email", emailPlaceholder: "your@email.com",
    phone: "Phone / WhatsApp", phonePlaceholder: "+968...", requestType: "Request Type", selectRequest: "Select a request...",
    properties: "Construction", projects: "Projects", materials: "Building Materials", insights: "Market Insights",
    location: "Location", locationPlaceholder: "City, area, or delivery location", message: "Message",
    messagePlaceholder: "Describe the construction, renovation, project, material, pricing, or site requirement.", send: "Send Inquiry",
    footerText: "Construction, project execution, renovation, and material coordination.",
    siteName: "REZAEI CONSTRUCTION & BUILDING MATERIALS",
    ctaTitle: "",
    ctaText: "Send the key location, scope, drawings, budget, quantity, or timing details so the request can be routed to the right construction path.",
    faq: "FAQ", privacy: "Privacy", terms: "Terms", group: "Group", visa: "Visa", finance: "Finance",
    address: "Muscat, Sultanate of Oman",
  },
  tr: {
    contactDetail: "İletişim detay sayfası", openPage: "Sayfayı aç", contactForm: "İletişim Formu", nextStep: "Sonraki adım",
    fullName: "Ad Soyad", namePlaceholder: "Adınız ve soyadınız", email: "E-posta", emailPlaceholder: "eposta@ornek.com",
    phone: "Telefon / WhatsApp", phonePlaceholder: "+968...", requestType: "Talep Türü", selectRequest: "Bir talep seçin...",
    properties: "İnşaat", projects: "Projeler", materials: "Yapı Malzemeleri", insights: "Pazar Görüşleri",
    location: "Konum", locationPlaceholder: "Şehir, bölge veya teslimat konumu", message: "Mesaj",
    messagePlaceholder: "İnşaat, tadilat, proje, malzeme, teklif veya saha gereksinimini açıklayın.", send: "Talep gönder",
    footerText: "İnşaat, proje uygulama, tadilat ve malzeme koordinasyonu.",
    siteName: "REZAEI İNŞAAT VE YAPI MALZEMELERİ",
    ctaTitle: "Görüşmeyi ilerletmeye hazır mısınız?",
    ctaText: "Talebin doğru inşaat yoluna yönlendirilmesi için konum, kapsam, çizimler, bütçe, miktar veya zamanlama detaylarını gönderin.",
    faq: "SSS", privacy: "Gizlilik", terms: "Şartlar", group: "Grup", visa: "Vize", finance: "Finans",
    address: "Muscat, Umman Sultanlığı",
  },
  fa: {
    contactDetail: "صفحه جزئیات تماس", openPage: "باز کردن صفحه", contactForm: "فرم تماس", nextStep: "مرحله بعد",
    fullName: "نام کامل", namePlaceholder: "نام کامل شما", email: "ایمیل", emailPlaceholder: "you@example.com",
    phone: "تلفن / واتساپ", phonePlaceholder: "+968...", requestType: "نوع درخواست", selectRequest: "یک درخواست انتخاب کنید...",
    properties: "ساخت‌وساز", projects: "پروژه‌ها", materials: "مصالح ساختمانی", insights: "دیدگاه‌های بازار",
    location: "موقعیت", locationPlaceholder: "شهر، منطقه یا محل تحویل", message: "پیام",
    messagePlaceholder: "نیاز مربوط به ساخت، بازسازی، پروژه، مصالح، قیمت یا سایت را توضیح دهید.", send: "ارسال درخواست",
    footerText: "هماهنگی ساخت‌وساز، اجرای پروژه، بازسازی و مصالح ساختمانی.",
    siteName: "ساخت‌وساز و مصالح ساختمانی رضایی",
    ctaTitle: "آماده‌اید گفتگو را جلو ببرید؟",
    ctaText: "موقعیت، محدوده، نقشه‌ها، بودجه، مقدار یا زمان‌بندی را ارسال کنید تا درخواست به مسیر درست ساخت‌وساز هدایت شود.",
    faq: "پرسش‌ها", privacy: "حریم خصوصی", terms: "شرایط", group: "گروه", visa: "ویزا", finance: "مالی",
    address: "مسقط، سلطنت عُمان",
  },
  ar: {
    contactDetail: "صفحة تفاصيل التواصل", openPage: "فتح الصفحة", contactForm: "نموذج التواصل", nextStep: "الخطوة التالية",
    fullName: "الاسم الكامل", namePlaceholder: "اسمك الكامل", email: "البريد الإلكتروني", emailPlaceholder: "you@example.com",
    phone: "الهاتف / واتساب", phonePlaceholder: "+968...", requestType: "نوع الطلب", selectRequest: "اختر طلباً...",
    properties: "البناء", projects: "المشاريع", materials: "مواد البناء", insights: "رؤى السوق",
    location: "الموقع", locationPlaceholder: "المدينة أو المنطقة أو موقع التسليم", message: "الرسالة",
    messagePlaceholder: "اشرح متطلبات البناء أو التجديد أو المشروع أو المواد أو التسعير أو الموقع.", send: "إرسال الطلب",
    footerText: "تنسيق البناء وتنفيذ المشاريع والتجديد ومواد البناء.",
    siteName: "رضائي للبناء ومواد البناء",
    ctaTitle: "هل أنت جاهز لنقل المحادثة إلى الخطوة التالية؟",
    ctaText: "أرسل الموقع والنطاق والرسومات والميزانية والكمية أو تفاصيل التوقيت ليتم توجيه الطلب إلى مسار البناء الصحيح.",
    faq: "الأسئلة", privacy: "الخصوصية", terms: "الشروط", group: "المجموعة", visa: "التأشيرات", finance: "التمويل",
    address: "مسقط، سلطنة عُمان",
  },
};

const sections = [
  {
    id: "properties",
    eyebrow: "Construction",
    title: "Building, renovation, and site-ready construction support.",
    text: "A structured path for owners, developers, and project teams that need construction execution, renovation planning, contractor coordination, and material-linked site work.",
    href: "/properties",
    Icon: Building2,
    items: [
      ["New Builds", "Villa, residential, commercial, and mixed-use construction needs reviewed around drawings, site readiness, and delivery stages."],
      ["Renovation", "Existing spaces assessed for repairs, finishing, fit-out, sequencing, and practical handover requirements."],
      ["Site Works", "Preparation, access, utilities, early works, and material timing shaped around the realities of the site."],
    ],
  },
  {
    id: "projects",
    eyebrow: "Projects",
    title: "Development projects, land opportunities, and construction coordination.",
    text: "Project sourcing support for owners, developers, investors, and contractors who need a practical route from land or concept to staged delivery.",
    href: "/projects",
    Icon: ClipboardCheck,
    items: [
      ["Development Projects", "Concept, location, intended use, and investment fit organized before partner or contractor discussions."],
      ["Construction Coordination", "Scope, drawings, contractors, materials, and site expectations brought into one clear project file."],
      ["Land & Sourcing", "Development land and project opportunities reviewed through access, zoning, demand, and feasibility signals."],
    ],
  },
  {
    id: "materials",
    eyebrow: "Building Materials",
    title: "Material sourcing with quantity, specification, and supplier clarity.",
    text: "Procurement support for construction materials, project-specific supply needs, industrial goods, supplier coordination, and delivery planning.",
    href: "/materials",
    Icon: PackageCheck,
    items: [
      ["Construction Materials", "Core project inputs reviewed by category, grade, specification, and intended construction stage."],
      ["Supplier Coordination", "Supplier conversations stay tied to quantity, delivery point, quality expectations, and project urgency."],
      ["Project Needs", "Material lists are shaped around drawings, site timing, budget pressure, and substitution decisions."],
    ],
  },
  {
    id: "insights",
    eyebrow: "Market Insights",
    title: "Practical market notes for buyers and investors.",
    text: "Guidance that helps clients read location quality, demand signals, development context, and investment considerations before requesting options.",
    href: "/insights",
    Icon: BarChart3,
    items: [
      ["Market Notes", "Area positioning, asset type, demand pattern, and pricing context translated into decision-ready language."],
      ["Investment Considerations", "Yield, exit potential, holding period, project stage, and buyer profile reviewed together."],
      ["Location Signals", "Access, surrounding development, tenant demand, infrastructure, and project pipeline shape opportunity quality."],
    ],
  },
];

const detailPages = {
  "/properties": {
    eyebrow: "Construction",
    title: "Construction services and project execution support.",
    lead:
      "A dedicated route for owners, developers, and project teams who need building, renovation, site preparation, contractor coordination, or material-linked execution support.",
    Icon: Building2,
    cta: "Request construction support",
    alternate: "Contact team",
    alternateHref: "/contact",
    blocks: [
      {
        title: "Project scope review",
        text: "Construction requests begin with drawings, site condition, intended use, finish level, budget range, and timing. The team can then separate design clarification, pricing, procurement, and execution needs.",
      },
      {
        title: "Contractor and site coordination",
        text: "Requests can include contractor discussions, site readiness, sequencing, access constraints, inspection points, and daily execution expectations.",
      },
      {
        title: "Material-linked execution",
        text: "Material choices, quantities, grades, supplier timing, and delivery plans are connected with the actual construction stage instead of being treated separately.",
      },
    ],
  },
  "/projects": {
    eyebrow: "Projects",
    title: "Development, construction, and project sourcing.",
    lead:
      "Project support for land, development concepts, construction coordination, contractor discussions, and partnership opportunities.",
    Icon: ClipboardCheck,
    cta: "Discuss a project",
    alternate: "Contact team",
    alternateHref: "/contact",
    blocks: [
      {
        title: "Development opportunities",
        text: "Land and development requests are reviewed by location, access, permitted use, surrounding demand, investor profile, and intended exit. This frames the opportunity before drawings, contractor budgets, or partner conversations begin.",
      },
      {
        title: "Construction coordination",
        text: "Construction support connects scope, stage, drawings, site conditions, contractor role, material expectations, and delivery milestones. The objective is a clear project file before commitments are made.",
      },
      {
        title: "Project sourcing",
        text: "For investors and developers, project sourcing can include land, partially developed assets, renovation opportunities, and partner-led construction proposals. Each opportunity is screened for practical fit and follow-up readiness.",
      },
      {
        title: "Land and feasibility signals",
        text: "Land conversations depend on access, zoning, utilities, neighborhood demand, and construction assumptions. Early feasibility signals help decide whether the next step is due diligence, pricing review, or a site discussion.",
      },
    ],
  },
  "/materials": {
    eyebrow: "Building Materials",
    title: "Construction materials and supplier coordination.",
    lead:
      "A procurement-focused page for material needs tied to construction projects, renovation work, industrial supply, and staged delivery planning.",
    Icon: PackageCheck,
    cta: "Send material list",
    alternate: "Contact team",
    alternateHref: "/contact",
    blocks: [
      {
        title: "Material specification",
        text: "Useful material requests include category, grade, dimensions, quantity, acceptable alternatives, project stage, and delivery destination. Clear specifications reduce pricing delays and supplier mismatch.",
      },
      {
        title: "Supplier coordination",
        text: "Supplier communication is handled around availability, lead time, quantity tolerance, quality expectations, and delivery planning. The goal is a practical supply path, not a vague product search.",
      },
      {
        title: "Project material needs",
        text: "Project-led procurement connects material lists with site timing, drawings, budget pressure, and construction sequence so the response fits the actual job.",
      },
    ],
  },
  "/insights": {
    eyebrow: "Market Insights",
    title: "Market context for real-estate and development decisions.",
    lead:
      "Practical notes for buyers, investors, owners, and developers comparing location, demand, asset class, project stage, and timing.",
    Icon: BarChart3,
    cta: "Ask for guidance",
    alternate: "View properties",
    alternateHref: "/properties",
    blocks: [
      {
        title: "Property market notes",
        text: "Market review starts with location, asset type, demand pattern, infrastructure, comparable positioning, and intended buyer or tenant profile. These signals help filter opportunities before pricing discussion.",
      },
      {
        title: "Investment considerations",
        text: "Investment guidance looks at yield expectations, holding period, resale potential, development pipeline, liquidity, and the strength of the surrounding area. The aim is practical decision support.",
      },
      {
        title: "Location and demand signals",
        text: "Access, nearby commercial activity, residential demand, project pipeline, amenities, and infrastructure changes can all shift the quality of an opportunity. These signals are reviewed together rather than in isolation.",
      },
      {
        title: "Buyer and investor preparation",
        text: "Clients get better options when they prepare budget range, target location, preferred asset class, investment purpose, timeline, and risk tolerance before requesting recommendations.",
      },
    ],
  },
  "/contact": {
    eyebrow: "Contact",
    title: "Contact the real-estate team.",
    lead:
      "Send property, project, construction, material, pricing, or market guidance requests with the key details needed for routing.",
    Icon: Mail,
    cta: "Send inquiry",
    alternate: "Market insights",
    alternateHref: "/insights",
    blocks: [
      {
        title: "Property inquiries",
        text: "Mention residential, commercial, or investment intent; preferred area; budget; size; and buying, selling, or leasing timeline.",
      },
      {
        title: "Project and construction inquiries",
        text: "Include location, project stage, land or building type, required role, drawings or scope notes, and timing expectations.",
      },
      {
        title: "Material and pricing inquiries",
        text: "List material categories, quantities, specifications, delivery destination, and quote deadline where available.",
      },
    ],
    contact: true,
  },
};

function normalizeProjectItem(project) {
  const slug = project.slug || project.id || String(project.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const image = project.image || "/media/sections/projects.jpg";
  return {
    slug,
    title: project.title || project.label || "Project",
    category: project.category || "Project",
    status: project.status || "Active Project",
    image,
    imagePosition: project.imagePosition || "center",
    gallery: project.gallery?.length ? project.gallery : [image, "/media/sections/projects.jpg", "/media/sections/materials.jpg"],
    location: project.location || "Muscat, Oman",
    projectType: project.projectType || project.category || "Project",
    area: project.area || "Project area",
    completionYear: project.completionYear || "2025",
    developmentType: project.developmentType || project.category || "Project",
    market: project.market || "Oman",
    description: project.description || project.text || "",
    overview: project.overview || project.text || project.description || "",
    scope: project.scope?.length ? project.scope : ["Project review", "Coordination support", "Next-step preparation"],
    highlights: project.highlights?.length ? project.highlights : [],
  };
}

function projectContentPath(pathname) {
  return String(pathname || "").startsWith("/projects/") ? "/projects" : pathname;
}

const supportContent = {
  "/faq": {
    title: "Frequently Asked Questions",
    lead: "Short answers about real-estate inquiries, project coordination, materials requests, and follow-up expectations.",
    blocks: [
      ["Can I send an early property idea?", "Yes. Include the location, budget range, asset type, and decision timeline so the first response can be useful."],
      ["Can material requests include alternatives?", "Yes. Mention preferred brands or grades, plus acceptable substitutions if the project allows flexibility."],
      ["Does the form submit to an API?", "Yes. The form sends the inquiry to the CMS for admin follow-up."],
    ],
  },
  "/privacy": {
    title: "Privacy and Data Handling",
    lead: "Inquiry details are used to understand and route messages. The current static site does not submit form data to an API.",
    blocks: [
      ["Inquiry details", "Only share the details needed to understand your property, project, material, or pricing request."],
      ["Contact information", "Email and phone details help the team respond with the right context."],
      ["CMS submission", "The form stores inquiry details in the CMS so an admin can review and update follow-up status."],
    ],
  },
  "/terms": {
    title: "Website Terms",
    lead: "Website content is for service orientation. Final scope, pricing, and commitments require direct review and confirmation.",
    blocks: [
      ["Service information", "Page content explains service categories and does not replace a specific project or property review."],
      ["Inquiry submission", "Sending a message starts a conversation and does not create a confirmed engagement."],
      ["Pricing", "Pricing depends on requirements, location, availability, quantities, and follow-up verification."],
    ],
  },
};

function getCurrentPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const [path, setPath] = useState(getCurrentPath());
  const [content, setContent] = useState(() => getFallbackContent(getCurrentPath(), lang));
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [pendingSection, setPendingSection] = useState(null);
  const activeLang = languages.find((item) => item.code === lang) || languages[0];
  const copy = uiCopy[lang] || uiCopy.en;

  const isHome = path === "/";
  const isProjectsShowcase = path === "/projects";
  const propertyListings = content.propertyListings || [];
  const marketplaceProperty = getMarketplaceProperty(path, propertyListings);
  const isStaticAppPage = ["/", "/contact", "/insights", "/materials", "/properties", "/projects", "/faq", "/terms", "/privacy"].includes(path) || Boolean(marketplaceProperty);
  const currentNavItems = content.navItems.filter((item) => item.href !== "/quotation" && item.sectionId !== "quotation");
  const homeContent = {
    ...content.home,
    sections: content.home.sections
      .filter((section) => section.href !== "/quotation" && section.id !== "quotation")
      .map((section) => ({
        ...section,
        Icon: resolveIcon(section.iconKey || section.id),
      })),
  };
  const detail = content.detail
    ? {
        ...content.detail,
        Icon: resolveIcon(content.detail.iconKey),
      }
    : null;
  const projects = (content.projects || []).map(normalizeProjectItem);
  const requestedProjectSlug = String(path || "").match(/^\/projects\/([^/?#]+)/)?.[1];
  const isProjectDetailPath = Boolean(requestedProjectSlug);
  const showcaseProject = requestedProjectSlug
    ? projects.find((project) => project.slug === decodeURIComponent(requestedProjectSlug)) || null
    : null;
  const isNotFoundPage = path === "/404" || (isProjectDetailPath && !showcaseProject) || (!showcaseProject && !isStaticAppPage && Boolean(content.notFound));
  const support = isNotFoundPage ? null : supportContent[path];
  const currentSiteName = content.siteName || site.name;
  const settings = content.settings || {};
  const nestedSettings = settings.settings || {};
  const currentBrand = {
    ...brand,
    displayName: lang === "en" ? currentSiteName || brand.displayName : copy.siteName,
    logoWide: resolveBrandLogo(nestedSettings.brand_logo_wide, brand.logoWide),
    logoStacked: resolveBrandLogo(nestedSettings.brand_logo_stacked, brand.logoStacked),
  };
  const currentHeroMedia = {
    video: nestedSettings.hero_video || heroMedia.video,
    poster: nestedSettings.hero_poster || heroMedia.poster,
  };
  const cmsGroupSiteUrls = content.groupSiteUrls || nestedSettings.group_site_urls || {};
  const activeSiteUrls = {
    mainSite: cmsGroupSiteUrls.mainSite || siteUrls.mainSite,
    realEstate: cmsGroupSiteUrls.realEstate || siteUrls.realEstate,
    finance: cmsGroupSiteUrls.finance || siteUrls.finance,
    visa: cmsGroupSiteUrls.visa || siteUrls.visa,
  };
  const footerText = content.footerText || settings.footer_text || copy.footerText;
  const contactPageCopy = getContactPageCopy(lang);
  const contactRows = [
    { label: contactPageCopy.emailLabel, value: settings.contact_email || "info@example.com", channel: "email" },
    { label: contactPageCopy.phoneLabel, value: settings.contact_phone || "+968 00 000 0000", channel: "phone" },
    { label: copy.location, value: copy.address, channel: "location" },
  ];
  const pageTitle = marketplaceProperty?.title || showcaseProject?.title || (isProjectsShowcase ? "Projects" : isNotFoundPage ? "404 Page Not Found" : support?.title || content.pageTitle || "Real Estate");
  const pageDescription = marketplaceProperty
    ? `${marketplaceProperty.title} in ${marketplaceProperty.location}. View property specifications, pricing, and inquiry details.`
    : showcaseProject?.description || (isProjectsShowcase
    ? "Explore selected projects, developments, and business initiatives managed or supported by REZAEI GLOBAL LLC."
    : isNotFoundPage
    ? "That real-estate page is not available."
    : support?.lead || content.pageDescription || site.description);
  const pageKeywords = isNotFoundPage
    ? ""
    : content.pageKeywords || "real estate, properties, construction, development projects, building materials, pricing, investment property";
  const helmetTitle = marketplaceProperty || showcaseProject || isProjectsShowcase ? `${pageTitle} | ${currentSiteName}` : content.seo?.title || `${pageTitle} | ${currentSiteName}`;
  const finalHelmetTitle = helmetTitle.includes(currentSiteName) ? helmetTitle : `${helmetTitle} | ${currentSiteName}`;
  const ogImageUrl = marketplaceProperty?.image || content.ogImageUrl || currentBrand.logoWide;
  const pageUrlPath = isNotFoundPage ? "/404" : path === "/" ? "/" : path;
  const canonicalUrl = withSiteUrl(pageUrlPath);
  const brandLogoUrl = withSiteUrl(currentBrand.logoStacked);
  const brandImageUrl = withSiteUrl(currentBrand.logoWide);
  const ogImageAbsoluteUrl = withSiteUrl(ogImageUrl || currentBrand.logoWide);
  const alternateLinks = buildAlternateLinks(pageUrlPath);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: currentSiteName,
      url: canonicalUrl,
      logo: brandLogoUrl,
      image: brandImageUrl,
      description: pageDescription,
      areaServed: Array.isArray(content.areaServed) && content.areaServed.length ? content.areaServed : ["Sultanate of Oman", "Turkey", "Iran", "International investors"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: settings.contact_email || "info@example.com",
        telephone: settings.contact_phone || "+968000000000",
      },
    }),
    [brandImageUrl, brandLogoUrl, canonicalUrl, currentSiteName, pageDescription, settings.contact_email, settings.contact_phone],
  );

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    let isCurrent = true;
    const contentPath = projectContentPath(path);
    const fallbackContent = getFallbackContent(contentPath, lang);

    setContent(fallbackContent);

    fetchCmsPage(contentPath, lang)
      .then((payload) => {
        if (isCurrent) {
          setContent(getPageContent(contentPath, payload, lang));
        }
      })
      .catch(() => {
        if (isCurrent) {
          setContent(fallbackContent);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [path, lang]);

  useEffect(() => {
    function handlePopState() {
      setPath(getCurrentPath());
      setMenuOpen(false);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isHome) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-30% 0px -54% 0px", threshold: [0.08, 0.24, 0.48] },
    );

    currentNavItems.forEach(({ sectionId }) => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [currentNavItems, isHome]);

  useEffect(() => {
    if (!pendingSection || !isHome) return;
    const section = document.getElementById(pendingSection);
    if (section) {
      requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: "smooth" });
      });
    }
    setPendingSection(null);
  }, [isHome, pendingSection, path]);

  useEffect(() => {
    if (isHome && pendingSection) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [isHome, path, pendingSection]);

  function navigate(href) {
    window.history.pushState({}, "", href);
    setPath(getCurrentPath());
    setMenuOpen(false);
    setStatus("");
  }

  function navigateToSection(sectionId) {
    if (path !== "/") {
      setPendingSection(sectionId);
      navigate("/");
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
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

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    if (!data.get("name") || !data.get("email") || !data.get("message")) {
      setStatus("Please complete name, email, and message.");
      return;
    }
    try {
      await submitInquiry({
        site_key: "real-estate",
        page_slug: path,
        locale: lang,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        company: String(data.get("company") || ""),
        country: String(data.get("country") || ""),
        subject: String(data.get("service") || "Real estate inquiry"),
        message: String(data.get("message") || ""),
      });
      form.reset();
      setStatus(uiOr(content, "inquiry_success", inquirySuccessMessage));
    } catch {
      setStatus(uiOr(content, "inquiry_error", inquiryErrorMessage));
    }
  }

  return (
    <div className="siteShell theme-realEstate" data-content-source={content.source} dir={activeLang.dir} lang={lang}>
      <Helmet>
        <html lang={lang} dir={activeLang.dir} />
        <title>{finalHelmetTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        {isNotFoundPage && <meta name="robots" content="noindex, nofollow" />}
        <link rel="canonical" href={canonicalUrl} />
        {alternateLinks.map((item) => (
          <link key={item.code} rel="alternate" hrefLang={item.code} href={item.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={finalHelmetTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageAbsoluteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalHelmetTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageAbsoluteUrl} />
        <meta name="theme-color" content={currentBrand.color} />
        <link rel="icon" href={nestedSettings.favicon_url || currentBrand.logoStacked} />
        <link rel="apple-touch-icon" href={currentBrand.logoStacked} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header
        activeSection={activeSection}
        brand={currentBrand}
        isHome={isHome}
        menuOpen={menuOpen}
        navigate={navigate}
        navigateToSection={navigateToSection}
        navItems={currentNavItems}
        path={path}
        lang={lang}
        languages={languages}
        setLang={changeLanguage}
        setMenuOpen={setMenuOpen}
      />

      <main className={isHome ? "pageMain realEstateLanding" : "pageMain detailMain"}>
        {isHome && (
          <HomePage
            brand={currentBrand}
            contactRows={contactRows}
            copy={copy}
            content={homeContent}
            handleSubmit={handleSubmit}
            heroMedia={currentHeroMedia}
            navigate={navigate}
            navigateToSection={navigateToSection}
            status={status}
          />
        )}
        {!isHome && path === "/contact" && (
          <ContactPage
            contactPageCopy={contactPageCopy}
            contactRows={contactRows}
            copy={copy}
            detail={detail}
            handleSubmit={handleSubmit}
            status={status}
          />
        )}
        {!isHome && path === "/insights" && (
          <InsightsPage
            detail={detail}
            heroMedia={currentHeroMedia}
            insightsCopy={getInsightsPageCopy(lang)}
            navigate={navigate}
          />
        )}
        {!isHome && path === "/materials" && (
          <MaterialsPage
            detail={detail}
            materialsCopy={getMaterialsPageCopy(lang)}
            navigate={navigate}
          />
        )}
        {!isHome && path === "/properties" && (
          <PropertiesPage
            navigate={navigate}
            pageHero={detail}
            properties={propertyListings}
            propertiesCopy={getPropertiesPageCopy(lang)}
          />
        )}
        {!isHome && marketplaceProperty && (
          <PropertyListingDetail
            navigate={navigate}
            propertiesCopy={getPropertiesPageCopy(lang)}
            property={marketplaceProperty}
          />
        )}
        {!isHome && path === "/projects" && (
          <ProjectsShowcasePage
            detail={detail}
            navigate={navigate}
            projects={projects}
            projectsCopy={getProjectsPageCopy(lang)}
          />
        )}
        {!isHome && showcaseProject && (
          <ProjectDetailShowcasePage
            navigate={navigate}
            project={showcaseProject}
            projects={projects}
            projectsCopy={getProjectsPageCopy(lang)}
          />
        )}
        {!isHome && !marketplaceProperty && path !== "/contact" && path !== "/insights" && path !== "/properties" && detail?.propertyTabs?.length > 0 && (
          <PropertyTabbedPage
            copy={copy}
            detail={detail}
            heroMedia={currentHeroMedia}
            navigate={navigate}
          />
        )}
        {!isHome && !marketplaceProperty && !showcaseProject && path !== "/projects" && path !== "/contact" && path !== "/insights" && detail?.projectTabs?.length > 0 && (
          <ProjectTabbedPage
            copy={copy}
            detail={detail}
            heroMedia={currentHeroMedia}
            navigate={navigate}
          />
        )}
        {!isHome && !marketplaceProperty && path !== "/projects" && !showcaseProject && path !== "/contact" && path !== "/insights" && path !== "/materials" && detail && !detail.propertyTabs?.length && !detail.projectTabs?.length && (
          <DetailPage
            contactRows={contactRows}
            copy={copy}
            detail={detail}
            handleSubmit={handleSubmit}
            heroMedia={currentHeroMedia}
            navigate={navigate}
            status={status}
          />
        )}
        {!isHome && !isNotFoundPage && path === "/faq" && <FaqPage cmsSections={content.pageSections} cmsHero={content.detail} />}
        {!isHome && !isNotFoundPage && path === "/terms" && <TermsPage cmsSections={content.pageSections} cmsHero={content.detail} />}
        {!isHome && !isNotFoundPage && path === "/privacy" && <PrivacyPage cmsSections={content.pageSections} cmsHero={content.detail} />}
        {!isHome && path !== "/faq" && path !== "/terms" && path !== "/privacy" && !detail && support && <SupportPage support={support} navigate={navigate} />}
        {!isHome && isNotFoundPage && <NotFoundPage navigate={navigate} />}
        {!isHome && !marketplaceProperty && !showcaseProject && !isNotFoundPage && !detail && !support && <NotFoundPage navigate={navigate} />}
      </main>

      <Footer brand={currentBrand} copy={copy} footerText={footerText} navigate={navigate} navItems={currentNavItems} siteName={currentBrand.displayName} siteUrls={activeSiteUrls} />
    </div>
  );
}

function Header({ activeSection, brand, isHome, lang, languages, menuOpen, navigate, navigateToSection, navItems, path, setLang, setMenuOpen }) {
  return (
    <header className="siteHeader">
      <a
        className="brand"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          navigate("/");
        }}
      >
        <img src={brand.logoWide} alt={brand.displayName} />
      </a>

      <div className="navDivider" aria-hidden="true" />

      <button className="iconButton" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={menuOpen ? "navLinks open" : "navLinks"} aria-label="Main navigation">
        {navItems.map((item) => {
          const active = path === item.href || (item.href === "/projects" && path.startsWith("/projects/"));
          return (
            <a
              className={active ? "active" : ""}
              href={item.href}
              key={item.label}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.href);
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="navDivider" aria-hidden="true" />

      <LanguageSelector lang={lang} languages={languages} onChange={setLang} />
    </header>
  );
}

function HomePage({ brand, contactRows, content, copy, handleSubmit, heroMedia, navigate, navigateToSection, status }) {
  const hero = content.hero;
  const [primaryAction, secondaryAction] = hero.actions || [];

  function runHeroAction(action) {
    const targetSection = sectionIdForHref(action?.href);
    if (targetSection && targetSection !== "home") {
      navigateToSection(targetSection);
      return;
    }
    navigate(action?.href || "/contact");
  }

  return (
    <>
      <section className="landingSection realEstateHero" id="home">
        <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="heroBackdrop" aria-hidden="true" />
        <div className="heroContent heroSplit">
          <div className="heroCopy">
            <div className="heroLogoPanel" aria-label={brand.displayName}>
              <img src={brand.logoStacked} alt={brand.displayName} />
            </div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{renderHeroTitle(hero.title)}</h1>
            <p className="lead">{hero.lead}</p>
            <div className="actions">
              {primaryAction && (
                <button type="button" className="primaryButton" onClick={() => runHeroAction(primaryAction)}>
                  {primaryAction.label} <ArrowRight size={17} aria-hidden="true" />
                </button>
              )}
              {secondaryAction && (
                <button type="button" className="secondaryButton" onClick={() => runHeroAction(secondaryAction)}>
                  {secondaryAction.label}
                </button>
              )}
            </div>
          </div>

          <div className="heroPanel" aria-label="Real estate coordination highlights">
            {hero.cards.map(({ title, text }) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {content.sections.map((section, index) => (
        <HomeSection key={section.id} index={index} navigate={navigate} section={section} />
      ))}

      <section className="landingSection contactSection" id="contact">
        <div className="sectionContent contactGrid">
          <div>
            <p className="eyebrow">{content.contact.eyebrow}</p>
            <h2>{content.contact.title}</h2>
            <p className="sectionIntro">{content.contact.text}</p>
            <div className="contactRows">
              {(content.contact.rows.length ? content.contact.rows : contactRows).map((row) => {
                const Icon = resolveContactIcon(row.label, row.channel);
                return (
                  <span key={`${row.label}-${row.value}`}>
                    <Icon size={18} aria-hidden="true" /> {row.value}
                  </span>
                );
              })}
            </div>
            <button type="button" className="secondaryButton detailLinkButton" onClick={() => navigate("/contact")}>
              {copy.contactDetail} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
          <ContactForm copy={copy} handleSubmit={handleSubmit} status={status} compact={false} />
        </div>
      </section>
    </>
  );
}

function HomeSection({ index, navigate, section }) {
  const Icon = section.Icon;
  const isDark = index % 2 === 1;

  if (section.id === "projects") {
    return <ProjectsSection Icon={Icon} navigate={navigate} section={section} />;
  }

  return (
    <section className={isDark ? "landingSection serviceSection darkSection" : "landingSection serviceSection lightSection"} id={section.id}>
      <div className="sectionContent">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">{section.eyebrow}</p>
            <h2>{section.title}</h2>
            <button type="button" className={isDark ? "secondaryButton" : "primaryButton"} onClick={() => navigate(section.href)}>
              {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
          <div>
            <p className="sectionIntro">{section.text}</p>
          </div>
        </div>

        <div className="summaryGrid">
          {section.items.map(([title, text]) => (
            <article className="summaryCard" key={title}>
              <Icon size={28} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ Icon, navigate, section }) {
  return (
    <section className="landingSection serviceSection darkSection projectsSection" id={section.id}>
      <div className="sectionContent projectsLayout">
        <div className="projectsEditorial">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <p className="sectionIntro">{section.text}</p>
          <button type="button" className="secondaryButton" onClick={() => navigate(section.href)}>
            {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="projectsStack" aria-label={`${section.eyebrow} highlights`}>
          {section.items.map(([title, text], itemIndex) => (
            <article className="projectStepCard" key={title}>
              <span className="projectStepNumber">{String(itemIndex + 1).padStart(2, "0")}</span>
              <div className="projectStepIcon">
                <Icon size={24} aria-hidden="true" />
              </div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailPage({ contactRows, copy, detail, handleSubmit, heroMedia, navigate, status }) {
  return (
    <>
      <section className="detailHero">
        <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="heroBackdrop" aria-hidden="true" />
        <div className="detailHeroInner">
          <p className="eyebrow">{detail.eyebrow}</p>
          <h1>{detail.title}</h1>
          <p className="lead">{detail.lead}</p>
        </div>
      </section>

      <section className="detailSection">
        <div className="detailGrid">
          {detail.blocks.map((block, index) => (
            <article className={index === 0 ? "detailBlock featured" : "detailBlock"} key={block.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{block.title}</h2>
              <p>{block.text}</p>
              {block.href && (
                <button type="button" className="secondaryButton detailBlockLink" onClick={() => navigate(block.href)}>
                  {copy.openPage} <ArrowRight size={14} aria-hidden="true" />
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      {detail.contact && (
        <section className="detailSection contactDetailPanel">
          <div className="contactGrid">
          <div>
            <p className="eyebrow">{copy.contactForm}</p>
              <h2>{detail.contactTitle}</h2>
              <p className="sectionIntro">{detail.contactLead}</p>
              <div className="contactRows">
                {contactRows.map((row) => {
                  const RowIcon = resolveContactIcon(row.label, row.channel);
                  return (
                    <span key={`${row.label}-${row.value}`}>
                      <RowIcon size={18} aria-hidden="true" /> {row.value}
                    </span>
                  );
                })}
              </div>
            </div>
            <ContactForm copy={copy} handleSubmit={handleSubmit} status={status} compact />
          </div>
        </section>
      )}

    </>
  );
}

function PropertyTabbedPage({ copy, detail, heroMedia, navigate }) {
  const [activeTab, setActiveTab] = useState(detail.propertyTabs[0]?.id || "");
  const currentTab = detail.propertyTabs.find((tab) => tab.id === activeTab) || detail.propertyTabs[0];

  useEffect(() => {
    setActiveTab(detail.propertyTabs[0]?.id || "");
  }, [detail.propertyTabs]);

  return (
    <>
      <section className="detailHero propertiesTabbedHero">
        <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="heroBackdrop" aria-hidden="true" />
        <div className="detailHeroInner propertyHeroInner">
          <div className="propertyHeroCopy">
            <p className="eyebrow">{detail.eyebrow}</p>
            <h1>{detail.title}</h1>
            <p className="lead">{detail.lead}</p>
          </div>
          <aside className="propertyHeroPanel" aria-label="Property request paths">
            <div className="propertyHeroPanelHead">
              <span>Property Desk</span>
              <strong>Clear routes for serious property conversations.</strong>
            </div>
            <div className="propertyHeroRoutes">
              {detail.propertyTabs.map((tab, index) => {
                const RouteIcon = index === 0 ? Home : index === 1 ? Building2 : BarChart3;
                return (
                  <button
                    className={tab.id === currentTab.id ? "propertyHeroRoute active" : "propertyHeroRoute"}
                    key={`hero-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    <RouteIcon size={18} aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="detailSection propertyTabsSection">
        <div className="propertyTabsShell">
          <div className="propertyTabList" role="tablist" aria-label="Property categories">
            {detail.propertyTabs.map((tab, index) => (
              <button
                aria-selected={tab.id === currentTab.id}
                className={tab.id === currentTab.id ? "propertyTab active" : "propertyTab"}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{tab.label}</strong>
              </button>
            ))}
          </div>

          <div className="propertyTabPanel" role="tabpanel">
            <div className="propertyTabIntro">
              <p className="eyebrow">{currentTab.label}</p>
              <h2>{currentTab.title}</h2>
              <p>{currentTab.text}</p>
              <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
                {copy.send} <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
            <div className="propertyTabGrid">
              {currentTab.cards.map((card, index) => (
                <article className="propertyTabCard" key={`${currentTab.id}-${card.title}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

function ProjectTabbedPage({ copy, detail, heroMedia, navigate }) {
  function getRequestedProjectId() {
    return new URLSearchParams(window.location.search).get("project") || "";
  }

  const requestedProjectId = getRequestedProjectId();
  const initialProject = detail.projectTabs.find((tab) => tab.id === requestedProjectId) || detail.projectTabs[0];
  const [activeTab, setActiveTab] = useState(initialProject?.id || "");
  const currentTab = detail.projectTabs.find((tab) => tab.id === activeTab) || detail.projectTabs[0];
  const projectProcess = [
    ["01", "Define the project", "Clarify site, concept, ownership position, and intended outcome."],
    ["02", "Review the file", "Check available documents, drawings, budget, timeline, and constraints."],
    ["03", "Match the route", "Connect the request with the relevant project, construction, or sourcing path."],
    ["04", "Prepare next step", "Summarize what is ready, what is missing, and who should respond."],
  ];
  const projectStats = [
    ["3", "Project routes"],
    ["4", "Review stages"],
    ["1", "Clear handoff"],
  ];

  useEffect(() => {
    const nextRequestedProjectId = getRequestedProjectId();
    const nextProject = detail.projectTabs.find((tab) => tab.id === nextRequestedProjectId) || detail.projectTabs[0];
    setActiveTab(nextProject?.id || "");
  }, [detail.projectTabs]);

  function projectHref(tab) {
    return `/projects?project=${encodeURIComponent(tab.id)}`;
  }

  function selectProject(tab, scrollToPanel = true) {
    setActiveTab(tab.id);
    window.history.pushState({}, "", projectHref(tab));
    if (scrollToPanel) {
      requestAnimationFrame(() => {
        document.getElementById("project-view")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  return (
    <>
      <section className="projectsProHero">
        <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="projectsProBackdrop" aria-hidden="true" />
        <div className="projectsProHeroInner">
          <div className="projectsProHeroCopy">
            <p className="eyebrow">{detail.eyebrow}</p>
            <h1>{detail.title}</h1>
            <p className="lead">{detail.lead}</p>
            <div className="projectsHeroLine" aria-hidden="true" />
            <div className="projectsHeroStats" aria-label="Project coordination highlights">
              {projectStats.map(([value, label]) => (
                <span key={label}>
                  <strong>{value}</strong>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="projectTabsSection" id="project-view">
        <div className="projectTabsIntro">
          <p className="eyebrow">Project paths</p>
          <h2>Choose the project conversation that matches the requirement.</h2>
          <p>
            Each route keeps the first review focused on the project type, documents, site context,
            and the next decision needed.
          </p>
        </div>

        <div className="projectLinkStrip" aria-label="Project links">
          {detail.projectTabs.map((tab, index) => (
            <a
              aria-current={tab.id === currentTab.id ? "true" : undefined}
              href={projectHref(tab)}
              key={tab.id}
              onClick={(event) => {
                event.preventDefault();
                selectProject(tab, false);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{tab.label}</strong>
              <small>View project</small>
            </a>
          ))}
        </div>

        <div className="projectTabsShell">
          <div className="projectTabsNav" role="tablist" aria-label="Project categories">
            {detail.projectTabs.map((tab, index) => (
              <button
                aria-selected={tab.id === currentTab.id}
                className={tab.id === currentTab.id ? "projectTrackTab active" : "projectTrackTab"}
                key={tab.id}
                onClick={() => selectProject(tab, false)}
                role="tab"
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{tab.label}</strong>
                <small>Review route</small>
              </button>
            ))}
          </div>

          <div className="projectFocusPanel" role="tabpanel">
            <div className="projectFocusCopy">
              <span className="projectFocusKicker">Active route</span>
              <h2>{currentTab.title}</h2>
              <p>{currentTab.text}</p>
              <ul className="projectFocusChecks">
                <li><ClipboardCheck size={16} aria-hidden="true" /> Project type, location, and role are clarified.</li>
                <li><FileText size={16} aria-hidden="true" /> Documents and missing information are listed before handoff.</li>
                <li><Building2 size={16} aria-hidden="true" /> The right specialist path is selected for follow-up.</li>
              </ul>
              <div className="projectFocusActions">
                <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
                  {copy.send} <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="projectsProcessSection">
        <div className="projectsProcessInner">
          <div className="projectsProcessHead">
            <p className="eyebrow">Coordination flow</p>
            <h2>A cleaner path before project discussions begin.</h2>
          </div>
          <div className="projectsProcessList">
            {projectProcess.map(([number, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="projectsCtaSection">
        <div className="projectsCtaBand">
          <div>
            <p className="eyebrow">Next step</p>
            <h2>Send the project details and we will route the request clearly.</h2>
          </div>
          <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
            {copy.send} <Send size={15} aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  );
}

function ProjectsShowcasePage({ detail, navigate, projects, projectsCopy: copy }) {
  const statusCounts = [
    [String(projects.length), copy.statSelectedProjects],
    ["4", copy.statBusinessAreas],
    ["1", copy.statCoordinatedGroup],
  ];

  const heroEyebrow = detail?.eyebrow || copy.heroEyebrow;
  const heroTitle = detail?.title || copy.heroTitle;
  const heroLead = detail?.lead || copy.heroLead;

  return (
    <>
      <section className="projectsShowHero">
        <div className="projectsShowHeroInner">
          <div className="projectsShowCopy">
            <p className="eyebrow">{heroEyebrow}</p>
            <h1>{heroTitle}</h1>
            <p className="projectsShowSubtitle">{heroLead}</p>
            <p className="projectsShowLead">{copy.heroSecondary}</p>
            <div className="projectsShowStats" aria-label={copy.statsAria}>
              {statusCounts.map(([value, label]) => (
                <span key={label}>
                  <strong>{value}</strong>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <aside className="projectsCoverageCard" aria-label={copy.coverageAria}>
            <span>{copy.coverageLabel}</span>
            <h2>{copy.coverageTitle}</h2>
            <div className="projectsCoverageList">
              {copy.coverageItems.map((item) => (
                <p key={item}>
                  <BadgeCheck size={16} aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>
            <button type="button" onClick={() => document.getElementById("projects-grid")?.scrollIntoView({ behavior: "smooth" })}>
              {copy.viewProjects} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </aside>
        </div>
      </section>

      <section className="projectsGridSection" id="projects-grid">
        <div className="projectsGridHead">
          <p className="eyebrow">{copy.gridEyebrow}</p>
          <h2>{copy.gridTitle}</h2>
          <p>{copy.gridLead}</p>
        </div>

        <div className="projectsGrid">
          {projects.map((project) => (
            <article className="projectShowCard" key={project.slug}>
              <div className="projectShowImage">
                <img src={project.image} alt="" loading="lazy" style={{ objectPosition: project.imagePosition || "center" }} />
              </div>
              <div className="projectShowBody">
                <h3>{project.title}</h3>
                <span>{project.description}</span>
                <button type="button" className="projectShowLink" onClick={() => navigate(`/projects/${project.slug}`)}>
                  {copy.viewProject} <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projectsShowCta">
        <div>
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaLead}</p>
        </div>
        <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
          {copy.contactUs} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </section>
    </>
  );
}

function ProjectDetailShowcasePage({ navigate, project, projects, projectsCopy: copy }) {
  const gallery = project.gallery || [project.image, "/media/sections/projects.jpg", "/media/sections/materials.jpg"];
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const heroFacts = [
    [copy.area, project.area || copy.defaultProjectArea],
    [copy.completionYear, project.completionYear || "2025"],
    [copy.projectCategory, project.developmentType || project.category],
  ];
  const projectFacts = [
    [copy.location, project.location || copy.defaultLocation],
    [copy.projectType, project.projectType || project.category],
    [copy.status, project.status],
    [copy.area, project.area || copy.defaultProjectArea],
    [copy.completionYear, project.completionYear || "2025"],
    [copy.developmentType, project.developmentType || project.category],
    [copy.market, project.market || copy.defaultMarket],
  ];
  const relatedProjects = projects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const overviewNotes = [
    [copy.projectSetting, `${project.location} · ${project.market || copy.defaultMarket}`],
    [copy.developmentFocus, project.description],
    [copy.rezaeiRole, project.scope.slice(0, 2).join(" + ")],
  ];
  const activeGalleryImage = activeGalleryIndex === null ? null : gallery[activeGalleryIndex];
  const showPreviousImage = () => {
    setActiveGalleryIndex((current) => (current === null ? 0 : (current - 1 + gallery.length) % gallery.length));
  };
  const showNextImage = () => {
    setActiveGalleryIndex((current) => (current === null ? 0 : (current + 1) % gallery.length));
  };

  return (
    <>
      <section className="projectDetailHero">
        <div className="projectDetailHeroMedia">
          <img src={project.image} alt="" style={{ objectPosition: project.imagePosition || "center" }} />
        </div>
        <div className="projectDetailHeroCopy">
          <p className="eyebrow">{project.projectType || project.category}</p>
          <h1>{project.title}</h1>
          <p className="projectHeroLocation">{project.location}</p>
          <div className="projectHeroTypeLine">
            <span>{project.projectType}</span>
            <span>{project.status}</span>
          </div>
          <div className="projectHeroFacts">
            {heroFacts.map(([label, value]) => (
              <span key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="projectDetailContent">
        <section className="projectOverviewBlock">
          <p className="eyebrow">{copy.projectOverview}</p>
          <h2>{project.title}</h2>
          <div className="projectOverviewStory">
            <p>{project.overview}</p>
            <div className="projectOverviewNotes">
              {overviewNotes.map(([label, value]) => (
                <span key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="projectGalleryBlock">
          <div className="projectSectionHead">
            <p className="eyebrow">{copy.gallery}</p>
            <h2>{copy.projectVisuals}</h2>
          </div>
          <div className="projectGalleryGrid">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className={index === 0 ? "featured" : ""}>
                <button
                  type="button"
                  className="projectGalleryTrigger"
                  onClick={() => setActiveGalleryIndex(index)}
                  aria-label={copy.openGalleryImage(project.title, index + 1)}
                >
                  <img
                    src={image}
                    alt=""
                    style={{ objectPosition: index === 0 ? project.imagePosition || "center" : "center" }}
                  />
                  <span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    {copy.viewImage}
                  </span>
                </button>
              </figure>
            ))}
          </div>
        </section>

        <section className="projectFactsBlock">
          <div className="projectSectionHead">
            <p className="eyebrow">{copy.projectFacts}</p>
            <h2>{copy.keyInformation}</h2>
          </div>
          <div className="projectFactsGrid">
            {projectFacts.map(([label, value]) => (
              <span key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
            ))}
          </div>
        </section>

        <section className="projectInvolvementBlock">
          <div className="projectSectionHead">
            <p className="eyebrow">{copy.scopeEyebrow}</p>
            <h2>{copy.scopeTitle}</h2>
          </div>
          <ul>
            {project.scope.map((item) => (
              <li key={item}>
                <BadgeCheck size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="projectRelatedBlock">
          <div className="projectSectionHead">
            <p className="eyebrow">{copy.relatedEyebrow}</p>
            <h2>{copy.relatedTitle}</h2>
          </div>
          <div className="projectRelatedGrid">
            {relatedProjects.map((item) => (
              <article key={item.slug}>
                <button
                  type="button"
                  className="projectRelatedImageButton"
                  onClick={() => navigate(`/projects/${item.slug}`)}
                  aria-label={copy.viewProjectAria(item.title)}
                >
                  <img src={item.image} alt="" style={{ objectPosition: item.imagePosition || "center" }} />
                </button>
                <div>
                  <button
                    type="button"
                    className="projectRelatedTitleButton"
                    onClick={() => navigate(`/projects/${item.slug}`)}
                  >
                    {item.title}
                  </button>
                  <p>{item.description}</p>
                  <span>{item.location}</span>
                  <button type="button" onClick={() => navigate(`/projects/${item.slug}`)}>
                    {copy.viewProject} <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="projectDetailCta">
          <div>
            <h2>{copy.detailCtaTitle}</h2>
            <p>{copy.detailCtaLead}</p>
          </div>
          <div>
            <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
              {copy.contactUs} <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button type="button" className="secondaryButton" onClick={() => navigate("/projects")}>
              {copy.exploreProjects}
            </button>
          </div>
        </section>
      </section>

      {activeGalleryImage && (
        <div className="projectGalleryLightbox" role="dialog" aria-modal="true" aria-label={copy.galleryAria(project.title)}>
          <button
            type="button"
            className="projectGalleryBackdrop"
            onClick={() => setActiveGalleryIndex(null)}
            aria-label={copy.closeGallery}
          />
          <div className="projectGalleryLightboxPanel">
            <div className="projectGalleryLightboxTop">
              <div>
                <span>{copy.projectGallery}</span>
                <strong>{project.title}</strong>
              </div>
              <button type="button" onClick={() => setActiveGalleryIndex(null)} aria-label={copy.closeGallery}>
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="projectGalleryLightboxImage">
              <img src={activeGalleryImage} alt="" />
              <button type="button" className="projectGalleryNav previous" onClick={showPreviousImage} aria-label={copy.previousImage}>
                <ChevronLeft size={24} aria-hidden="true" />
              </button>
              <button type="button" className="projectGalleryNav next" onClick={showNextImage} aria-label={copy.nextImage}>
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </div>
            <div className="projectGalleryThumbs">
              {gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-thumb-${index}`}
                  className={index === activeGalleryIndex ? "active" : ""}
                  onClick={() => setActiveGalleryIndex(index)}
                  aria-label={copy.showGalleryImage(index + 1)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ContactPage({ contactRows, copy, contactPageCopy: pageCopy, detail, handleSubmit, status }) {
  const heroEyebrow = detail?.eyebrow || pageCopy.heroEyebrow;
  const heroTitle = detail?.title || pageCopy.heroTitle;
  const heroLead = detail?.lead || pageCopy.heroLead;

  return (
    <>
      <section className="reContactHero">
        <div className="reContactHeroBackdrop" aria-hidden="true" />
        <div className="reContactHeroInner">
          <div className="reContactHeroCopy">
            <p className="reContactEyebrow">{heroEyebrow}</p>
            <h2>{heroTitle}</h2>
            <p>{heroLead}</p>
          </div>

          <aside className="reContactHeroCard" aria-label={pageCopy.cardAria}>
            <span className="reContactCardLabel">{pageCopy.cardLabel}</span>
            <div className="reContactChannelList">
              {contactRows.map((row) => {
                const Icon = resolveContactIcon(row.label, row.channel);
                const isEmail = row.channel === "email";
                return (
                  <a className="reContactChannel" href={isEmail ? `mailto:${row.value}` : "#contact-form"} key={row.label}>
                    <Icon size={18} aria-hidden="true" />
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </a>
                );
              })}
            </div>
            <div className="reContactChecklist">
              {pageCopy.quickChecklist.map((item) => (
                <span key={item}>
                  <BadgeCheck size={15} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="reContactMain" id="contact-form">
        <div className="reContactMainInner">
          <div className="reContactGuide">
            <p className="reContactEyebrow">{pageCopy.routingEyebrow}</p>
            <h2>{pageCopy.routingTitle}</h2>
            <div className="reContactRouteGrid">
              {pageCopy.requestTypes.map(({ iconKey, label, tip }) => {
                const Icon = resolveIcon(iconKey);
                return (
                  <article className="reContactRouteCard" key={label}>
                    <Icon size={20} aria-hidden="true" />
                    <h3>{label}</h3>
                    <p>{tip}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="reContactFormWrap">
            <div className="reContactFormCard">
              <div className="reContactFormHead">
                <p className="reContactEyebrow">{copy.contactForm}</p>
                <h2>{pageCopy.formTitle}</h2>
                <p>{pageCopy.formLead}</p>
              </div>
              <p className="reContactResponseNote">
                <BadgeCheck size={16} aria-hidden="true" />
                {pageCopy.responseNote}
              </p>
              <ContactForm copy={copy} handleSubmit={handleSubmit} status={status} compact={false} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const featuredProperties = [
  { image: "/media/sections/properties.jpg", imagePos: "center 45%", title: "Luxury Villa, Muscat Hills", location: "Muscat Hills, Oman", type: "Villa", size: "8,400 sq ft", status: "Available", badge: "Featured" },
  { image: "/media/sections/insights.jpg", imagePos: "center 22%", title: "Residential Land Plot", location: "Muscat Growth Corridor, Oman", type: "Development Land", size: "12,500 sq ft", status: "Investment Ready", badge: "High Yield" },
  { image: "/media/sections/projects.jpg", imagePos: "center 38%", title: "Mixed-Use Investment", location: "Downtown Muscat, Oman", type: "Mixed-Use", size: "42,000 sq ft", status: "Off-Plan", badge: "New" },
  { image: "/media/sections/contact.jpg", imagePos: "center 42%", title: "Corporate Office Suite", location: "Madinat Sultan Qaboos, Muscat", type: "Commercial", size: "5,200 sq ft", status: "Available", badge: null },
  { image: "/media/sections/materials.jpg", imagePos: "center 48%", title: "Prime Retail Unit", location: "Downtown Muscat, Oman", type: "Retail", size: "2,150 sq ft", status: "Available", badge: "Prime" },
  { image: "/media/sections/quotation.jpg", imagePos: "center 46%", title: "Residential Tower Units", location: "Salalah, Oman", type: "Residential", size: "From 850 sq ft", status: "Under Construction", badge: null },
];

const propertyCategories = [
  { label: "Residential", desc: "Villas, apartments, and townhouses across premium Oman and regional locations.", image: "/media/sections/properties.jpg", imagePos: "center 45%", sub: "Villas · Apartments · Townhouses" },
  { label: "Commercial", desc: "Office spaces, retail units, and mixed-use assets for business and investment income.", image: "/media/sections/contact.jpg", imagePos: "center 42%", sub: "Offices · Retail · Mixed-Use" },
  { label: "Development Land", desc: "Land parcels with residential and commercial development potential across growth corridors.", image: "/media/sections/insights.jpg", imagePos: "center 22%", sub: "Plots · Development · Investment" },
];

const investmentHighlights = [
  {
    image: "/media/sections/insights.jpg", imagePos: "center 22%",
    eyebrow: "Investment Opportunity",
    title: "Residential Growth Corridor Land",
    location: "Muscat, Oman", type: "Development Land", area: "12,500 sq ft",
    highlight: "High-growth area with strong infrastructure pipeline and residential demand outlook. Well-positioned for medium-term capital appreciation.",
    tags: ["Off-Plan", "High Yield", "Development Potential"],
  },
  {
    image: "/media/sections/projects.jpg", imagePos: "center 38%",
    eyebrow: "Featured Investment",
    title: "Mixed-Use Commercial Asset",
    location: "Downtown Muscat, Oman", type: "Mixed-Use", area: "42,000 sq ft",
    highlight: "Commercial ground floor with residential upper floors. Structured for dual revenue streams and strong long-term market positioning.",
    tags: ["Income Producing", "Dual Revenue", "Prime Location"],
  },
];

const propWhyWorkItems = [
  { Icon: Search, label: "Property Search", desc: "We shortlist properties based on your specific budget, area, type, and investment goals — not just what is available." },
  { Icon: TrendingUp, label: "Investment Evaluation", desc: "Yield analysis, market comparables, and location signals reviewed before you commit." },
  { Icon: MapPin, label: "Local Market Knowledge", desc: "On-the-ground expertise across Oman and regional markets, covering residential and commercial segments." },
  { Icon: ClipboardCheck, label: "Acquisition Support", desc: "From initial interest through offer, negotiation, and handover — end-to-end client representation." },
];

const latestOpportunities = [
  { image: "/media/sections/properties.jpg", imagePos: "center 45%", title: "Muscat Hills Luxury Villa", location: "Muscat Hills", type: "Villa", size: "8,400 sq ft", status: "Available" },
  { image: "/media/sections/projects.jpg", imagePos: "center 38%", title: "Mixed-Use Investment Asset", location: "Downtown Muscat", type: "Mixed-Use", size: "42,000 sq ft", status: "Off-Plan" },
  { image: "/media/sections/contact.jpg", imagePos: "center 42%", title: "Madinat Sultan Qaboos Office Suite", location: "Madinat Sultan Qaboos, Muscat", type: "Commercial", size: "5,200 sq ft", status: "Available" },
  { image: "/media/sections/insights.jpg", imagePos: "center 22%", title: "Development Land Plot", location: "Muscat Growth Corridor", type: "Land", size: "12,500 sq ft", status: "Investment Ready" },
  { image: "/media/sections/quotation.jpg", imagePos: "center 46%", title: "Residential Tower Units", location: "Salalah, Oman", type: "Residential", size: "From 850 sq ft", status: "Under Construction" },
];

function InsightsPage({ detail, heroMedia, insightsCopy: copy, navigate }) {
  const heroEyebrow = detail?.eyebrow || copy.heroEyebrow;
  const heroTitle = detail?.title || copy.heroTitle;
  const heroLead = detail?.lead || copy.heroLead;
  const panelIcons = [MapPin, TrendingUp, ClipboardCheck];

  return (
    <>
      <section className="insHero">
        <video
          className="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroMedia.poster}
          aria-hidden="true"
        >
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="heroBackdrop insHeroBackdrop" aria-hidden="true" />
        <div className="insHeroInner">
          <div className="insHeroCopy">
            <p className="insHeroEyebrow">{heroEyebrow}</p>
            <h1 className="insHeroTitle">{heroTitle}</h1>
            <p className="insHeroLead">{heroLead}</p>
            <div className="insStatStrip">
              <div className="insStat"><strong>{copy.categories.length}</strong><span>{copy.statAssetClasses}</span></div>
              <div className="insStat"><strong>{copy.marketSignals.length}</strong><span>{copy.statMarketSignals}</span></div>
              <div className="insStat"><strong>{copy.focusMarkets.length}</strong><span>{copy.statFocusMarkets}</span></div>
              <div className="insStat"><strong>{copy.evaluationSteps.length}</strong><span>{copy.statEvaluationSteps}</span></div>
            </div>
          </div>
          <aside className="insHeroPanel" aria-label={copy.panelAria}>
            <span>{copy.panelLabel}</span>
            <h2>{copy.panelTitle}</h2>
            <div className="insHeroBriefList">
              {copy.panelItems.map((item, index) => {
                const Icon = panelIcons[index] || MapPin;
                return (
                  <p key={item}><Icon size={16} aria-hidden="true" /> {item}</p>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="insSection insCategorySection">
        <div className="insSectionInner">
          <div className="insSectionHead">
            <p className="insEyebrowDark">{copy.categoriesEyebrow}</p>
            <h2>{copy.categoriesTitle}</h2>
            <p>{copy.categoriesLead}</p>
          </div>
          <div className="insCategoryGrid">
            {copy.categories.map(({ iconKey, label, desc }) => {
              const Icon = resolveIcon(iconKey);
              return (
                <article className="insCategoryCard" key={label}>
                  <div className="insCategoryCardAccent" aria-hidden="true" />
                  <div className="insCategoryIcon" aria-hidden="true">
                    <Icon size={20} />
                  </div>
                  <h3>{label}</h3>
                  <p>{desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="insSection insMarketsSection">
        <div className="insSectionInner insMarketsInner">
          <div className="insMarketsEditorial">
            <p className="insEyebrowLight">{copy.marketsEyebrow}</p>
            <h2>{copy.marketsTitle}</h2>
            <p>{copy.marketsLead}</p>
          </div>
          <div className="insMarketGrid">
            {copy.focusMarkets.map(({ name, note }) => (
              <article className="insMarketCard" key={name}>
                <div className="insMarketCardIcon" aria-hidden="true">
                  <MapPin size={18} />
                </div>
                <strong>{name}</strong>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="insSection insStepsSection">
        <div className="insSectionInner">
          <div className="insSectionHead insStepsHead">
            <p className="insEyebrowLight">{copy.stepsEyebrow}</p>
            <h2>{copy.stepsTitle}</h2>
            <p>{copy.stepsLead}</p>
          </div>
          <div className="insStepsGrid">
            {copy.evaluationSteps.map(({ label, desc }, index) => (
              <article className="insStepCard" key={label}>
                <span className="insStepNum" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="insSection insSignalsSection">
        <div className="insSectionInner">
          <div className="insSectionHead">
            <p className="insEyebrowDark">{copy.signalsEyebrow}</p>
            <h2>{copy.signalsTitle}</h2>
            <p>{copy.signalsLead}</p>
          </div>
          <div className="insSignalGrid">
            {copy.marketSignals.map(({ label, desc }, index) => (
              <article className="insSignalCard" key={label}>
                <span className="insSignalNum" aria-hidden="true">S{String(index + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="insSection insPrepSection">
        <div className="insSectionInner insPrepInner">
          <div className="insPrepCopy">
            <p className="insEyebrowLight">{copy.prepEyebrow}</p>
            <h2>{copy.prepTitle}</h2>
            <p>{copy.prepLead}</p>
            <ul className="insPrepList">
              {copy.investmentPrepItems.map((item) => (
                <li className="insPrepListItem" key={item}>
                  <BadgeCheck size={16} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="insPrepAside">
            <div className="insPrepCard">
              <div className="insPrepCardTop" aria-hidden="true" />
              <p className="insPrepCardLabel">{copy.prepCardLabel}</p>
              <div className="insPrepCardItems">
                {copy.prepCardItems.map((item) => (
                  <div className="insPrepCardItem" key={item}>
                    <BadgeCheck size={14} aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="insPrepCardFooter">{copy.prepCardFooter}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="insSection insCtaSection">
        <div className="insSectionInner insCtaInner">
          <p className="insEyebrowDark">{copy.ctaEyebrow}</p>
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaLead}</p>
          <div className="insCtaActions">
            <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
              {copy.contactUs} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function MaterialsPage({ detail, materialsCopy: copy, navigate }) {
  const heroEyebrow = detail?.eyebrow || copy.heroEyebrow;
  const heroTitle = detail?.title || copy.heroTitle;
  const heroLead = detail?.lead || copy.heroLead;
  const infoCardIcons = [PackageCheck, ClipboardCheck, Truck, BadgeCheck];

  return (
    <>
      <section className="matHero">
        <div className="matHeroLeft">
          <p className="matHeroEyebrow">{heroEyebrow}</p>
          <h1 className="matHeroTitle">{heroTitle}</h1>
          <p className="matHeroLead">{heroLead}</p>
          <div className="matHeroStatsBar">
            <div className="matHeroStat"><strong>{copy.categories.length}</strong><span>{copy.statCategories}</span></div>
            <div className="matHeroStat"><strong>{copy.processSteps.length}</strong><span>{copy.statSteps}</span></div>
            <div className="matHeroStat"><strong>{copy.supplyAreas.length}</strong><span>{copy.statProjectTypes}</span></div>
          </div>
        </div>
        <div className="matHeroRight">
          <div
            className="matHeroImg"
            style={{ backgroundImage: 'url("/media/sections/materials-hero-generated.png")' }}
            aria-hidden="true"
          />
          <div className="matHeroImgOverlay" aria-hidden="true" />
          <div className="matHeroInfoCard">
            <p className="matHeroInfoCardLabel">{copy.infoCardLabel}</p>
            <div className="matHeroInfoCardItems">
              {copy.infoCardItems.map((item, index) => {
                const Icon = infoCardIcons[index] || PackageCheck;
                return (
                  <div key={item}>
                    <Icon size={15} aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="matSection matCategorySection">
        <div className="matSectionInner">
          <div className="matSectionHead">
            <p className="matEyebrowDark">{copy.categoriesEyebrow}</p>
            <h2>{copy.categoriesTitle}</h2>
            <p>{copy.categoriesLead}</p>
          </div>
          <div className="matCategoryGrid">
            {copy.categories.map(({ iconKey, label, desc }) => {
              const Icon = resolveIcon(iconKey);
              return (
                <article className="matCategoryCard" key={label}>
                  <div className="matCategoryCardAccent" aria-hidden="true" />
                  <div className="matCategoryIcon" aria-hidden="true">
                    <Icon size={22} />
                  </div>
                  <h3>{label}</h3>
                  <p>{desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="matSection matProcessSection">
        <div className="matSectionInner">
          <div className="matProcessHead">
            <p className="matEyebrowLight">{copy.processEyebrow}</p>
            <h2>{copy.processTitle}</h2>
            <p>{copy.processLead}</p>
          </div>
          <div className="matProcessTimeline">
            {copy.processSteps.map(({ label, desc }, index) => (
              <article className="matProcessStep" key={label}>
                <div className="matProcessStepNum" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
                <h3>{label}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="matSection matAreasSection">
        <div className="matSectionInner">
          <div className="matSectionHead">
            <p className="matEyebrowDark">{copy.areasEyebrow}</p>
            <h2>{copy.areasTitle}</h2>
            <p>{copy.areasLead}</p>
          </div>
          <div className="matAreasGrid">
            {copy.supplyAreas.map(({ iconKey, label, desc, tags }) => {
              const Icon = resolveIcon(iconKey);
              return (
                <article className="matAreaCard" key={label}>
                  <div className="matAreaCardIcon" aria-hidden="true"><Icon size={26} /></div>
                  <h3>{label}</h3>
                  <p>{desc}</p>
                  <div className="matAreaTags">
                    {tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="matSection matTrustSection">
        <div className="matSectionInner matTrustInner">
          <div className="matTrustEditorial">
            <p className="matEyebrowLight">{copy.trustEyebrow}</p>
            <h2>{copy.trustTitle}</h2>
            <p>{copy.trustLead}</p>
          </div>
          <div className="matTrustGrid">
            {copy.trustIndicators.map(({ iconKey, label, desc }) => {
              const Icon = resolveIcon(iconKey);
              return (
                <article className="matTrustCard" key={label}>
                  <div className="matTrustIcon" aria-hidden="true"><Icon size={18} /></div>
                  <h3>{label}</h3>
                  <p>{desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="matSection matCtaSection">
        <div className="matSectionInner matCtaInner">
          <p className="matEyebrowDark">{copy.ctaEyebrow}</p>
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaLead}</p>
          <div className="matCtaActions">
            <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
              {copy.contactUs} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function getMarketplaceProperty(pathname, listings = []) {
  const match = String(pathname || "").match(/^\/properties\/([^/?#]+)$/i);
  if (!match) return null;
  return listings.find((property) => property.id.toLowerCase() === decodeURIComponent(match[1]).toLowerCase()) || null;
}

function PropertiesPage({ navigate, properties = [], pageHero, propertiesCopy: copy }) {
  const [filters, setFilters] = useState({ query: "", city: "All", type: "All", purpose: "All", budget: "All" });
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const heroEyebrow = pageHero?.eyebrow || copy.heroEyebrow;
  const heroTitle = pageHero?.title || copy.heroTitle;
  const heroLead = pageHero?.lead || copy.heroLead;

  const labelType = (value) => copy.typeLabels?.[value] || value;
  const labelPurpose = (value) => copy.purposeLabels?.[value] || value;
  const labelCity = (value) => copy.cityLabels?.[value] || value;

  const filteredProperties = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const budget = filters.budget === "All" ? Infinity : Number(filters.budget);
    const results = properties.filter((property) => {
      const matchesQuery = !query || `${property.title} ${property.location} ${property.id}`.toLowerCase().includes(query);
      return matchesQuery
        && (filters.city === "All" || property.city === filters.city)
        && (filters.type === "All" || property.type === filters.type)
        && (filters.purpose === "All" || property.purpose === filters.purpose)
        && property.priceValue <= budget;
    });

    if (sort === "price-low") return [...results].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "price-high") return [...results].sort((a, b) => b.priceValue - a.priceValue);
    return results;
  }, [filters, sort, properties]);

  const propertiesPerPage = 9;
  const pageCount = Math.max(1, Math.ceil(filteredProperties.length / propertiesPerPage));
  const visibleProperties = filteredProperties.slice((page - 1) * propertiesPerPage, page * propertiesPerPage);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function changePage(nextPage) {
    setPage(nextPage);
    window.setTimeout(() => document.getElementById("property-inventory")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <div className="listingPage">
      <section className="listingHero">
        <div className="listingHeroShade" aria-hidden="true" />
        <div className="listingHeroInner">
          <div className="listingHeroCopy">
            <p className="listingEyebrow light">{heroEyebrow}</p>
            <h1>{heroTitle}</h1>
            <p className="listingHeroLead">{heroLead}</p>
          </div>
        </div>
      </section>

      <section className="listingSearch" aria-label={copy.searchAria}>
        <div className="listingSearchInner">
          <div className="listingKeyword">
            <Search size={19} aria-hidden="true" />
            <input value={filters.query} onChange={(event) => updateFilter("query", event.target.value)} placeholder={copy.searchPlaceholder} aria-label={copy.searchPlaceholder} />
          </div>
          <label><span>{copy.filterLocation}</span><select value={filters.city} onChange={(event) => updateFilter("city", event.target.value)}><option value="All">{copy.filterAll}</option>{copy.cityOptions.map((city) => <option key={city} value={city}>{labelCity(city)}</option>)}</select></label>
          <label><span>{copy.filterType}</span><select value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}><option value="All">{copy.filterAll}</option>{copy.typeOptions.map((type) => <option key={type} value={type}>{labelType(type)}</option>)}</select></label>
          <label><span>{copy.filterPurpose}</span><select value={filters.purpose} onChange={(event) => updateFilter("purpose", event.target.value)}><option value="All">{copy.filterAll}</option>{copy.purposeOptions.map((purpose) => <option key={purpose} value={purpose}>{labelPurpose(purpose)}</option>)}</select></label>
          <label><span>{copy.filterBudget}</span><select value={filters.budget} onChange={(event) => updateFilter("budget", event.target.value)}><option value="All">{copy.filterAnyBudget}</option>{copy.budgetOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
      </section>

      <section className="listingInventory" id="property-inventory">
        <div className="listingSectionHead">
          <div>
            <p className="listingEyebrow">{copy.inventoryEyebrow}</p>
            <h2>{copy.inventoryTitle}</h2>
            <p>{copy.inventoryLead}</p>
          </div>
          <div className="listingResultTools">
            <span><strong>{filteredProperties.length}</strong> {copy.propertiesLabel}</span>
            <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label={copy.sortAria}>
              <option value="featured">{copy.sortFeatured}</option>
              <option value="price-low">{copy.sortPriceLow}</option>
              <option value="price-high">{copy.sortPriceHigh}</option>
            </select>
          </div>
        </div>

        {filteredProperties.length ? (
          <div className="listingGrid">
            {visibleProperties.map((property) => (
              <article
                className="listingCard"
                key={property.id}
                onClick={() => navigate(`/properties/${property.id.toLowerCase()}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") navigate(`/properties/${property.id.toLowerCase()}`);
                }}
                role="link"
                tabIndex={0}
              >
                <div className="listingCardMedia">
                  <img src={property.image} alt={property.title} />
                  {property.badge && <span className="listingCardBadge">{property.badge}</span>}
                  <span className="listingCardPurpose">{copy.forPurposePrefix} {labelPurpose(property.purpose)}</span>
                </div>
                <div className="listingCardBody">
                  <div className="listingCardRef"><span>{labelType(property.type)}</span><small>{property.id}</small></div>
                  <h3>{property.title}</h3>
                  <p className="listingCardLocation"><MapPin size={15} /> {property.location}</p>
                  <div className="listingCardSpecs">
                    {property.beds && <span><BedDouble size={16} /> {property.beds} {copy.bedsLabel}</span>}
                    {property.baths && <span><Bath size={16} /> {property.baths} {copy.bathsLabel}</span>}
                    <span><Ruler size={16} /> {property.area}</span>
                  </div>
                  <div className="listingCardFooter">
                    <div><small>{property.status}</small><strong>{property.price}</strong></div>
                    <span className="listingCardArrow" aria-hidden="true"><ArrowRight size={18} /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="listingEmpty">
            <Search size={28} />
            <h3>{copy.emptyTitle}</h3>
            <p>{copy.emptyLead}</p>
            <button type="button" onClick={() => setFilters({ query: "", city: "All", type: "All", purpose: "All", budget: "All" })}>{copy.resetFilters}</button>
          </div>
        )}

        {filteredProperties.length > propertiesPerPage && (
          <nav className="listingPagination" aria-label={copy.paginationAria}>
            <button type="button" disabled={page === 1} onClick={() => changePage(page - 1)} aria-label={copy.prevPage}><ChevronLeft size={18} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button type="button" className={page === pageNumber ? "active" : ""} onClick={() => changePage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} key={pageNumber}>{pageNumber}</button>
            ))}
            <button type="button" disabled={page === pageCount} onClick={() => changePage(page + 1)} aria-label={copy.nextPage}><ChevronRight size={18} /></button>
          </nav>
        )}
      </section>

    </div>
  );
}

function PropertyListingDetail({ navigate, property, propertiesCopy: copy }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const gallery = useMemo(() => Array.from(new Set([
    property.image,
    "/media/sections/properties.jpg",
    "/media/sections/projects.jpg",
    "/media/sections/contact.jpg",
    "/media/sections/quotation.jpg",
  ])), [property.image]);

  const labelType = (value) => copy.typeLabels?.[value] || value;
  const labelPurpose = (value) => copy.purposeLabels?.[value] || value;
  const labelCity = (value) => copy.cityLabels?.[value] || value;

  useEffect(() => {
    if (!galleryOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") setGalleryOpen(false);
      if (event.key === "ArrowLeft") setActiveImage((current) => (current - 1 + gallery.length) % gallery.length);
      if (event.key === "ArrowRight") setActiveImage((current) => (current + 1) % gallery.length);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery.length, galleryOpen]);

  function showPreviousImage() {
    setActiveImage((current) => (current - 1 + gallery.length) % gallery.length);
  }

  function showNextImage() {
    setActiveImage((current) => (current + 1) % gallery.length);
  }

  return (
    <div className="assetDetailPage">
      <section className="assetDetailHero">
        <div className="assetDetailHeroInner">
          <button className="assetBackLink" type="button" onClick={() => navigate("/properties")}>
            <ChevronLeft size={17} /> {copy.backToProperties}
          </button>
          <div className="assetDetailGrid">
            <button className="assetDetailMedia" type="button" onClick={() => { setActiveImage(0); setGalleryOpen(true); }} aria-label={copy.galleryAria(property.title)}>
              <img src={property.image} alt={property.title} />
              {property.badge && <span>{property.badge}</span>}
              <span className="assetGalleryHint"><Maximize2 size={17} /> {copy.viewGallery(gallery.length)}</span>
            </button>
            <div className="assetDetailSummary">
              <div className="assetDetailFlags"><span>{copy.forPurposePrefix} {labelPurpose(property.purpose)}</span><span>{property.status}</span></div>
              <p className="assetDetailRef">{labelType(property.type)} · {property.id}</p>
              <h1>{property.title}</h1>
              <p className="assetDetailLocation"><MapPin size={17} /> {property.location}</p>
              <div className="assetDetailPrice"><small>{copy.askingPrice}</small><strong>{property.price}</strong></div>
              <div className="assetDetailSpecs">
                {property.beds && <div><BedDouble size={19} /><strong>{property.beds}</strong><span>{copy.bedrooms}</span></div>}
                {property.baths && <div><Bath size={19} /><strong>{property.baths}</strong><span>{copy.bathrooms}</span></div>}
                <div><Ruler size={19} /><strong>{property.area}</strong><span>{copy.builtUpArea}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="assetDetailContent">
        <div className="assetDetailMain">
          <p className="listingEyebrow">{copy.overviewEyebrow}</p>
          <h2>{copy.overviewTitle(property.title)}</h2>
          <p className="assetDetailLead">
            {copy.overviewLead(labelType(property.type), property.location)}
          </p>
          <div className="assetDetailProse">
            {copy.overviewParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <div className="assetDetailSimpleCta">
            <p><strong>{copy.inquiryTitle}</strong><span>{copy.inquiryLead}</span></p>
            <button type="button" onClick={() => navigate(`/contact?property=${property.id}`)}>{copy.makeInquiry} <ArrowRight size={16} /></button>
          </div>
        </div>
        <aside className="assetDetailAside">
          <div className="assetDetailAsideHead"><span>{property.id}</span><small>{copy.verifiedRecord}</small></div>
          <dl>
            <div><dt>{copy.reference}</dt><dd>{property.id}</dd></div>
            <div><dt>{copy.assetType}</dt><dd>{labelType(property.type)}</dd></div>
            <div><dt>{copy.market}</dt><dd>{labelCity(property.city)}</dd></div>
            <div><dt>{copy.purpose}</dt><dd>{copy.forPurposePrefix} {labelPurpose(property.purpose)}</dd></div>
            <div><dt>{copy.status}</dt><dd>{property.status}</dd></div>
          </dl>
        </aside>
      </section>

      {galleryOpen && (
        <div className="assetGalleryLightbox" role="dialog" aria-modal="true" aria-label={copy.galleryAria(property.title)} onClick={() => setGalleryOpen(false)}>
          <button className="assetGalleryClose" type="button" onClick={() => setGalleryOpen(false)} aria-label={copy.closeGallery}><X size={24} /></button>
          <div className="assetGalleryStage" onClick={(event) => event.stopPropagation()}>
            <img src={gallery[activeImage]} alt={`${property.title} — ${activeImage + 1}`} />
            <button className="assetGalleryNav previous" type="button" onClick={showPreviousImage} aria-label={copy.previousImage}><ChevronLeft size={28} /></button>
            <button className="assetGalleryNav next" type="button" onClick={showNextImage} aria-label={copy.nextImage}><ChevronRight size={28} /></button>
            <span className="assetGalleryCounter">{activeImage + 1} / {gallery.length}</span>
          </div>
          <div className="assetGalleryThumbs" onClick={(event) => event.stopPropagation()}>
            {gallery.map((image, index) => (
              <button className={index === activeImage ? "active" : ""} type="button" onClick={() => setActiveImage(index)} aria-label={`${copy.previousImage} ${index + 1}`} key={`${image}-${index}`}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const faqSections = [
  {
    category: "Properties & Acquisitions",
    items: [
      { q: "What types of properties do you work with?", a: "Residential villas, apartments, and townhouses, as well as commercial offices, retail units, and mixed-use assets. Development land and investment-focused properties are also covered." },
      { q: "What locations do you cover?", a: "The primary focus is Oman — Muscat, Nizwa, and Salalah — along with broader GCC markets for clients with regional requirements." },
      { q: "How do I start a property search?", a: "Submit an inquiry through the contact page with your target area, property type, budget range, and intended use. The team will review and respond with relevant options." },
      { q: "Can you help with both residential and commercial properties?", a: "Yes. Residential searches focus on lifestyle and investment fit. Commercial inquiries are reviewed around footfall, tenant profile, lease assumptions, and business use." },
      { q: "Do you work with off-plan and ready properties?", a: "Both. Off-plan opportunities are reviewed for developer credibility, delivery timeline, and exit potential. Ready properties are assessed for immediate use or rental readiness." },
    ],
  },
  {
    category: "Investment",
    items: [
      { q: "What information helps when asking about investment properties?", a: "Target return expectation, preferred holding period, location preference, risk tolerance, and whether financing is being considered. This narrows the focus to options with a credible investment case." },
      { q: "Do you provide yield or return estimates?", a: "Context-based comparables and location signals are shared to support the conversation. Final yield estimates depend on the specific property, lease terms, and market conditions at the time of review." },
      { q: "Can I search for development land?", a: "Yes. Land inquiries are reviewed by location, access, permitted use, infrastructure, demand signals, and intended development or exit strategy." },
      { q: "How is an investment property evaluated?", a: "Location quality, comparable demand, surrounding infrastructure, rental market context, and exit positioning are all considered. The goal is practical decision support before commitment." },
    ],
  },
  {
    category: "Building Materials",
    items: [
      { q: "What material categories do you source?", a: "Concrete and cement, steel and rebar, blocks and bricks, electrical materials, plumbing materials, and finishing materials including tiles, paints, and gypsum board." },
      { q: "How do I submit a material request?", a: "Use the contact form with your material category, grade or specification, quantity, project location, and delivery timeline. Clear specifications reduce back-and-forth and speed up supplier matching." },
      { q: "Can you source materials internationally?", a: "Yes. Supplier networks cover Oman, Turkey, and international markets. Sourcing location depends on availability, delivery requirements, and project budget." },
      { q: "What makes a material request more useful?", a: "Including the material grade, acceptable alternatives, quantity, project stage, and any delivery constraints. This allows supplier matching to begin with the right products rather than a broad search." },
    ],
  },
  {
    category: "Process & Response",
    items: [
      { q: "How quickly do you respond to inquiries?", a: "Responses are typically within one to two business days. Complex or multi-part requests may take slightly longer to review properly before a useful first reply is sent." },
      { q: "What happens after I submit an inquiry?", a: "The inquiry is reviewed for completeness and routed to the relevant service area. The first response will either clarify requirements or begin matching the request with relevant options or suppliers." },
      { q: "Is there a minimum project or order size?", a: "There is no fixed minimum. The focus is on whether the request is clear enough to respond to usefully. Very early-stage ideas are welcome as long as the key parameters — location, type, budget — are outlined." },
      { q: "Do you work with clients outside Oman?", a: "Yes. Many inquiries come from buyers, investors, and project teams based outside Oman. Remote coordination works well for property searches, investment reviews, and material procurement planning." },
    ],
  },
];

function FaqPage({ cmsSections, cmsHero }) {
  const activeSections = cmsSections?.length ? cmsSections : faqSections;
  const questionCount = activeSections.reduce((total, section) => total + section.items.length, 0);

  return (
    <>
      <section className="faqHeader">
        <div className="faqHeaderInner">
          <div className="faqHeaderCopy">
            <p className="faqHeaderEyebrow">{cmsHero?.eyebrow || "Knowledge center"}</p>
            <h1 className="faqHeaderTitle">{cmsHero?.title || "Frequently Asked Questions"}</h1>
            <p className="faqHeaderLead">{cmsHero?.lead || "Answers about properties, investment, building materials, and how the team works."}</p>
          </div>
          <div className="faqHeaderSummary" aria-label={`${questionCount} questions across ${activeSections.length} topics`}>
            <strong>{questionCount}</strong>
            <span>practical answers</span>
            <small>Across {activeSections.length} service topics</small>
          </div>
        </div>
      </section>
      <section className="faqBody">
        <div className="faqBodyInner">
          <aside className="faqNav" aria-label="FAQ topics">
            <p>Browse by topic</p>
            {activeSections.map(({ category, items }, index) => (
              <a href={`#faq-${index + 1}`} key={category}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {category}
                <small>{items.length}</small>
              </a>
            ))}
          </aside>
          <div className="faqSections">
            {activeSections.map(({ category, items }, sectionIndex) => (
              <section className="faqSection" id={`faq-${sectionIndex + 1}`} key={category}>
                <header className="faqCategoryLabel">
                  <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{category}</h2>
                    <p>{items.length} questions</p>
                  </div>
                </header>
                <div className="faqItems">
                  {items.map(({ q, a }, itemIndex) => (
                    <details className="faqItem" key={q} open={sectionIndex === 0 && itemIndex === 0}>
                      <summary className="faqQ">
                        <span>{q}</span>
                        <ChevronDown size={20} aria-hidden="true" />
                      </summary>
                      <div className="faqA"><p>{a}</p></div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const privacySections = [
  {
    category: "What We Collect",
    items: [
      {
        heading: "Inquiry information",
        body: "When you submit a contact or inquiry form, the information you provide — including your name, email address, phone number, and the details of your request — is collected for the sole purpose of responding to that inquiry.",
      },
      {
        heading: "Property and project details",
        body: "Details you share about your property search, project requirements, budget range, or material needs are used to understand your request and provide a relevant, specific response. This information is not used for any other purpose.",
      },
      {
        heading: "Communication history",
        body: "Records of inquiries submitted through this website may be retained internally to allow the team to track follow-up status and maintain continuity across a conversation. These records are accessible only to authorised team members.",
      },
    ],
  },
  {
    category: "How We Use It",
    items: [
      {
        heading: "Responding to your inquiry",
        body: "The primary use of any information you submit is to review, route, and respond to your specific request. Your contact details are used only to reach you in connection with the inquiry you submitted.",
      },
      {
        heading: "Service coordination",
        body: "Where your inquiry involves a third party — such as a property developer, supplier, or logistics provider — only the minimum information necessary to facilitate your request will be shared, and only with your knowledge.",
      },
      {
        heading: "No marketing use",
        body: "Information submitted through inquiry forms is not used for marketing, advertising, profiling, or any purpose unrelated to your specific request. You will not receive unsolicited communications as a result of submitting a form.",
      },
    ],
  },
  {
    category: "Data Storage",
    items: [
      {
        heading: "CMS storage",
        body: "Inquiry submissions are stored in the site's content management system so that authorised administrators can review the request, update its status, and manage follow-up. Access to this data is restricted to the team.",
      },
      {
        heading: "Retention",
        body: "Inquiry data is retained for as long as is reasonably necessary to manage the request and any resulting engagement. Data that is no longer needed for an active conversation may be removed at the team's discretion.",
      },
      {
        heading: "Third-party services",
        body: "This website does not use third-party analytics, advertising trackers, or data brokers. Any third-party infrastructure used to host or operate the site is selected for its data handling standards and is not given access to inquiry content.",
      },
    ],
  },
  {
    category: "Your Information",
    items: [
      {
        heading: "Access and correction",
        body: "If you would like to know what information has been recorded in connection with an inquiry you submitted, or if you would like it corrected or removed, you can request this through the contact page. The team will respond promptly.",
      },
      {
        heading: "Accuracy",
        body: "The accuracy of the information the team holds depends on what you provided at the time of submission. If your details change after an inquiry is submitted, you can reach out to update them.",
      },
      {
        heading: "No obligation to share",
        body: "You are not required to provide any specific information to submit an inquiry. However, sharing relevant details about your needs allows the team to give a more useful and specific response.",
      },
    ],
  },
  {
    category: "General",
    items: [
      {
        heading: "Cookies",
        body: "This website does not use tracking cookies or persistent identifiers for advertising or analytics purposes. Any cookies set are strictly functional and limited to what is necessary for the site to operate correctly.",
      },
      {
        heading: "Changes to this policy",
        body: "This privacy policy may be updated from time to time. Any changes take effect immediately upon publication to this page. Continued use of the website following an update constitutes acceptance of the revised policy.",
      },
      {
        heading: "Questions",
        body: "If you have questions about how your information is handled, the contact page is the appropriate channel. The team is available to clarify any aspect of this policy on request.",
      },
    ],
  },
];

function PrivacyPage({ cmsSections, cmsHero }) {
  const activeSections = cmsSections?.length ? cmsSections : privacySections;
  return (
    <>
      <section className="privacyHeader">
        <div className="privacyHeaderInner">
          <div className="privacyHeaderCopy">
            <p className="privacyHeaderEyebrow">{cmsHero?.eyebrow || "Your information"}</p>
            <h1 className="privacyHeaderTitle">{cmsHero?.title || "Privacy & Data Handling"}</h1>
            <p className="privacyHeaderLead">{cmsHero?.lead || "How information you share through this website is collected, used, and stored."}</p>
          </div>
          <div className="privacyPromise">
            <BadgeCheck size={30} aria-hidden="true" />
            <div>
              <strong>Clear by design</strong>
              <span>No advertising trackers. No unrelated marketing use.</span>
            </div>
          </div>
        </div>
      </section>
      <section className="privacyBody">
        <div className="privacyBodyInner">
          <aside className="privacyNav" aria-label="Privacy policy sections">
            <FileText size={22} aria-hidden="true" />
            <p>Policy sections</p>
            {activeSections.map(({ category }, index) => (
              <a href={`#privacy-${index + 1}`} key={category}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {category}
              </a>
            ))}
          </aside>
          <div className="privacySections">
            {activeSections.map(({ category, items }, sectionIndex) => (
              <section className="privacySection" id={`privacy-${sectionIndex + 1}`} key={category}>
                <header className="privacyCategoryLabel">
                  <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{category}</h2>
                    <p>{items.length} policy points</p>
                  </div>
                </header>
                <div className="privacyItems">
                  {items.map(({ heading, body }, itemIndex) => (
                    <article className="privacyItem" key={heading}>
                      <span className="privacyItemNumber">{String(itemIndex + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="privacyItemHeading">{heading}</h3>
                        <p className="privacyItemBody">{body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const termsSections = [
  {
    category: "Service Scope",
    items: [
      {
        heading: "What this website covers",
        body: "This website presents an overview of services across real estate advisory, property acquisition support, and building materials coordination. Content is intended for general orientation and does not constitute a binding offer, contract, or commitment of any kind.",
      },
      {
        heading: "Information accuracy",
        body: "Property details, availability, pricing indications, and material specifications displayed on this site are provided for illustrative purposes. All figures, descriptions, and availability are subject to change without notice and must be verified through direct communication before any decision is made.",
      },
      {
        heading: "No financial or legal advice",
        body: "Nothing on this website constitutes financial, investment, legal, or tax advice. Users should seek qualified independent advice before making any investment or purchasing decision.",
      },
    ],
  },
  {
    category: "Properties",
    items: [
      {
        heading: "Property listings",
        body: "Properties shown on this site represent examples of the types of opportunities the team works with. They are not guaranteed to be currently available. Availability, pricing, and transaction terms are confirmed only through direct engagement.",
      },
      {
        heading: "Off-plan projects",
        body: "Information about off-plan or under-construction developments is based on developer-provided data and is subject to change. Timelines, floor plans, and specifications may be revised by the developer. Verification is required before any commitment.",
      },
      {
        heading: "Market information",
        body: "Market commentary, location descriptions, and investment context provided on this site reflect general observations and not personalized analysis. Actual market conditions vary and past performance of any location or asset type does not guarantee future results.",
      },
    ],
  },
  {
    category: "Building Materials",
    items: [
      {
        heading: "Supplier coordination",
        body: "The building materials service involves coordination and facilitation between clients and suppliers. It does not constitute a direct sale of goods. Final pricing, lead times, and product specifications are determined by the relevant supplier and confirmed through separate documentation.",
      },
      {
        heading: "Quotations",
        body: "Any pricing indication or quotation discussed during the inquiry process is preliminary and non-binding until formally confirmed in writing by both parties. Quotations are subject to material availability, exchange rates, and supplier terms at the time of order.",
      },
      {
        heading: "Quality and delivery",
        body: "While coordination support includes quality-check assistance and delivery follow-up, responsibility for product quality, compliance with local standards, and final delivery rests with the supplier and the relevant logistics provider.",
      },
    ],
  },
  {
    category: "Inquiries & Process",
    items: [
      {
        heading: "Contact and inquiry",
        body: "Submitting an inquiry through the contact page initiates a conversation and does not create a confirmed engagement, reservation, or transaction. No obligation arises on either side until terms are explicitly agreed in writing.",
      },
      {
        heading: "Response times",
        body: "The team aims to respond to inquiries promptly during business hours. Response times may vary depending on inquiry volume, complexity, and time zone differences. Submission of a contact form does not guarantee a specific response time.",
      },
      {
        heading: "Confidentiality",
        body: "Information shared through inquiry forms is used solely to respond to and manage the relevant request. It is not shared with third parties except where necessary to facilitate the service requested, and only with the client's knowledge.",
      },
    ],
  },
  {
    category: "General",
    items: [
      {
        heading: "Intellectual property",
        body: "All content on this website — including text, images, layouts, and branding — is the property of the company or its licensors. Reproduction, distribution, or use of any content without prior written permission is not permitted.",
      },
      {
        heading: "Third-party content",
        body: "Where third-party images, references, or data appear on this site, they are used for illustrative purposes only. Inclusion does not imply endorsement or affiliation with any third party.",
      },
      {
        heading: "Changes to these terms",
        body: "These terms may be updated at any time without prior notice. Continued use of the website following any update constitutes acceptance of the revised terms. Users are encouraged to review this page periodically.",
      },
    ],
  },
];

function TermsPage({ cmsSections, cmsHero }) {
  const activeSections = cmsSections?.length ? cmsSections : termsSections;
  const clauseCount = activeSections.reduce((total, section) => total + section.items.length, 0);

  return (
    <>
      <section className="termsHeader">
        <div className="termsHeaderInner">
          <div className="termsHeaderCopy">
            <p className="termsHeaderEyebrow">{cmsHero?.eyebrow || "Legal overview"}</p>
            <h1 className="termsHeaderTitle">{cmsHero?.title || "Website Terms"}</h1>
            <p className="termsHeaderLead">{cmsHero?.lead || "How this website and its services operate. Please read before using the site or submitting an inquiry."}</p>
          </div>
          <div className="termsHeaderSummary">
            <ClipboardCheck size={30} aria-hidden="true" />
            <div>
              <strong>{clauseCount} clear terms</strong>
              <span>Organized across {activeSections.length} practical sections.</span>
            </div>
          </div>
        </div>
      </section>
      <section className="termsBody">
        <div className="termsBodyInner">
          <aside className="termsNav" aria-label="Website terms sections">
            <ClipboardCheck size={22} aria-hidden="true" />
            <p>Terms sections</p>
            {activeSections.map(({ category }, index) => (
              <a href={`#terms-${index + 1}`} key={category}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {category}
              </a>
            ))}
          </aside>
          <div className="termsSections">
            {activeSections.map(({ category, items }, sectionIndex) => (
              <section className="termsSection" id={`terms-${sectionIndex + 1}`} key={category}>
                <header className="termsCategoryLabel">
                  <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{category}</h2>
                    <p>{items.length} terms</p>
                  </div>
                </header>
                <div className="termsItems">
                  {items.map(({ heading, body }, itemIndex) => (
                    <article className="termsItem" key={heading}>
                      <span className="termsItemNumber">{String(sectionIndex * 3 + itemIndex + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="termsItemHeading">{heading}</h3>
                        <p className="termsItemBody">{body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SupportPage({ navigate, support }) {
  return (
    <>
      <section className="detailHero supportHero">
        <div className="heroBackdrop" aria-hidden="true" />
        <div className="detailHeroInner">
          <p className="eyebrow">Support</p>
          <h1>{support.title}</h1>
          <p className="lead">{support.lead}</p>
        </div>
      </section>
      <section className="detailSection">
        <div className="detailGrid supportGrid">
          {support.blocks.map(([title, text], index) => (
            <article className="detailBlock" key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function NotFoundPage({ navigate }) {
  return (
    <section className="detailHero supportHero notFoundHero">
      <div className="heroBackdrop" aria-hidden="true" />
      <div className="detailHeroInner">
        <p className="notFoundCode" aria-label="404">
          404
        </p>
        <p className="eyebrow">Page Not Found</p>
        <h1>That real-estate page is not available.</h1>
        <p className="lead">Return to the homepage or contact the team to choose a property, project, materials, pricing, or insights path.</p>
        <div className="actions">
          <button type="button" className="primaryButton" onClick={() => navigate("/")}>
            Back to home <ArrowRight size={15} aria-hidden="true" />
          </button>
          <button type="button" className="secondaryButton" onClick={() => navigate("/contact")}>
            Contact team
          </button>
        </div>
      </div>
    </section>
  );
}

function ContactForm({ compact, copy, handleSubmit, status }) {
  return (
    <form className={compact ? "inquiryForm compact" : "inquiryForm"} onSubmit={handleSubmit}>
      <div className="formField">
        <label htmlFor={compact ? "detail-name" : "home-name"}>{copy.fullName}</label>
        <input id={compact ? "detail-name" : "home-name"} name="name" type="text" placeholder={copy.namePlaceholder} required />
      </div>
      <div className="formRow">
        <div className="formField">
          <label htmlFor={compact ? "detail-email" : "home-email"}>{copy.email}</label>
          <input id={compact ? "detail-email" : "home-email"} name="email" type="email" placeholder={copy.emailPlaceholder} />
        </div>
        <div className="formField">
          <label htmlFor={compact ? "detail-phone" : "home-phone"}>{copy.phone}</label>
          <input id={compact ? "detail-phone" : "home-phone"} name="phone" type="tel" placeholder={copy.phonePlaceholder} />
        </div>
      </div>
      <div className="formRow">
        <div className="formField">
          <label htmlFor={compact ? "detail-service" : "home-service"}>{copy.requestType}</label>
          <select id={compact ? "detail-service" : "home-service"} name="service">
            <option value="">{copy.selectRequest}</option>
            <option value="properties">{copy.properties}</option>
            <option value="projects">{copy.projects}</option>
            <option value="materials">{copy.materials}</option>
            <option value="insights">{copy.insights}</option>
          </select>
        </div>
        <div className="formField">
          <label htmlFor={compact ? "detail-location" : "home-location"}>{copy.location}</label>
          <input id={compact ? "detail-location" : "home-location"} name="location" type="text" placeholder={copy.locationPlaceholder} />
        </div>
      </div>
      <div className="formField">
        <label htmlFor={compact ? "detail-message" : "home-message"}>{copy.message}</label>
        <textarea
          id={compact ? "detail-message" : "home-message"}
          name="message"
          rows={5}
          placeholder={copy.messagePlaceholder}
          required
        />
      </div>
      <button className="primaryButton contactSubmitBtn" type="submit">
        <Send size={18} aria-hidden="true" /> {copy.send}
      </button>
      {status && <p className="formStatus">{status}</p>}
    </form>
  );
}

function Footer({ brand, copy, footerText, navigate, navItems = [], siteName, siteUrls: activeSiteUrls = siteUrls }) {
  const mainPages = navItems.filter((item) => item.href !== "/");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerBrandBlock">
          <span className="footerBrand">
            <img src={brand.logoStacked} alt="" aria-hidden="true" />
            <span>{siteName}</span>
          </span>
          <p className="footerDesc">{footerText || "Premium real estate, construction, investment, and material coordination."}</p>
          <p className="footerMetaLine">
            Real estate, construction, materials, and project coordination across Oman, Turkey, GCC, and international client routes.
          </p>
          <nav className="groupLinksFooter" aria-label="Group websites">
            <a href={activeSiteUrls.mainSite}>{copy.group}</a>
            <a href={activeSiteUrls.visa}>{copy.visa}</a>
            <a href={activeSiteUrls.finance}>{copy.finance}</a>
          </nav>
        </div>

        <nav className="footerMainNav" aria-label="Main navigation">
          <span className="footerNavLabel">Pages</span>
          {mainPages.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="footerLinks" aria-label="Support navigation">
          <span className="footerNavLabel">Legal</span>
          {supportPages.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={(event) => {
                event.preventDefault();
                navigate(item.href);
              }}
            >
              {item.href === "/faq" ? copy.faq : item.href === "/privacy" ? copy.privacy : copy.terms}
            </a>
          ))}
        </nav>
      </div>
      <div className="footerBottom">
        <span>© {currentYear} {siteName}</span>
        <span>Client inquiries are reviewed before routing to the relevant specialist path.</span>
      </div>
    </footer>
  );
}

export default App;
