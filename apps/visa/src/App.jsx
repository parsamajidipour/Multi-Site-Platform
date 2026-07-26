import {
  ArrowRight,
  AtSign,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  FileText,
  Home,
  Landmark,
  Languages,
  Mail,
  MapPin,
  Menu,
  Phone,
  PlaneLanding,
  SearchCheck,
  Send,
  Stamp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LanguageSelector } from "@/components/LanguageSelector";
import { fetchCmsBlogPosts, fetchCmsPage, submitInquiry } from "./lib/cmsClient";
import { getFallbackBlogPosts, getFallbackContent, getPageContent } from "./lib/contentAdapter";

const site = {
  kind: import.meta.env.VITE_SITE_KIND || "visa",
  name: import.meta.env.VITE_SITE_NAME || "REZAEI GLOBAL LLC",
  description:
    import.meta.env.VITE_SITE_DESCRIPTION ||
    "Premium residency, visa, corporate setup, translation, attestation, and document coordination services.",
  publicUrl: import.meta.env.VITE_PUBLIC_URL || "http://localhost",
};

const siteUrls = {
  mainSite: import.meta.env.VITE_MAIN_SITE_URL || "http://example.localhost:8080",
  realEstate: import.meta.env.VITE_REAL_ESTATE_URL || "http://real-estate.example.localhost:8080",
  finance: import.meta.env.VITE_FINANCE_URL || "http://finance.example.localhost:8080",
  visa: import.meta.env.VITE_VISA_URL || "http://visa.example.localhost:8080",
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
  video: "/media/hero/visa-hero.mp4",
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
  "residency-visa": PlaneLanding,
  "corporate-setup": BriefcaseBusiness,
  translation: Languages,
  legalization: Landmark,
  attestation: Stamp,
  contact: Mail,
  home: Home,
  faq: SearchCheck,
  privacy: FileText,
  terms: FileText,
};

function resolveIcon(iconKey) {
  return iconMap[iconKey] || FileText;
}

function resolveContactIcon(label) {
  const value = String(label || "").toLowerCase();
  if (value.includes("phone") || value.includes("whatsapp")) return Phone;
  if (value.includes("location") || value.includes("address") || value.includes("authority")) return MapPin;
  if (value.includes("email")) return AtSign;
  return Mail;
}

function isDisplayableContactValue(value) {
  const normalized = String(value || "").trim();
  return Boolean(normalized) && !/(\+968\s*00\s*000\s*0000|000\s*0000|example\.com)/i.test(normalized);
}

const supportPages = [
  { key: "contact", href: "/contact" },
  { key: "legal", href: "/legal" },
];

const visaHeaderNavItems = [
  { label: "Home", href: "/", sectionId: "home" },
  { label: "Services", href: "/services", sectionId: "services" },
  { label: "Blog", href: "/blog", sectionId: "blog" },
  { label: "FAQ", href: "/faq", sectionId: "faq" },
  { label: "Contact Us", href: "/contact", sectionId: "contact" },
];

const uiCopy = {
  en: {
    home: "Home",
    support: "Support",
    notFound: "Not Found",
    notFoundTitle: "That visa service page is not available.",
    notFoundLead: "Return to the homepage and choose a residency, corporate setup, translation, legalization, attestation, or contact path.",
    backHome: "Back to home",
    contactDetail: "Contact detail page",
    contact: "Contact",
    contactUs: "Contact Us",
    openPage: "Open page",
    contactForm: "Contact Form",
    contactTitle: "Share the requirement clearly.",
    contactLead: "Share the service type, country, authority, deadline, and document context so the team can route the request correctly.",
    fullName: "Full Name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+968...",
    service: "Service",
    selectService: "Select a service...",
    countryAuthority: "Country / Authority",
    countryPlaceholder: "Country / authority",
    message: "Message",
    messagePlaceholder: "Describe the visa, residency, company setup, translation, attestation, legalization, or document requirement.",
    send: "Send Inquiry",
    residencyVisa: "Residency & Visa",
    corporateSetup: "Corporate Setup",
    translation: "Translation",
    legalization: "Legalization",
    attestation: "Attestation",
    footerText: "Premium residency, visa, corporate setup, and official document coordination.",
    footerPages: "Pages",
    footerSites: "Sites",
    footerLegal: "Legal",
    footerMetaLine: "Residency, visa, corporate setup, translation, legalization, and attestation coordination across Oman, Turkey, GCC, and international client routes.",
    footerBottomNote: "Client inquiries are reviewed before routing to the relevant visa or document service path.",
    address: "Muscat, Sultanate of Oman",
    siteName: "REZAEI RESIDENCY, VISA & TRANSLATION SERVICES",
    nextStep: "Next Step",
    ctaTitle: "Ready to prepare the right document path?",
    ctaText: "Send the country, document type, authority use, timeline, and service goal so the request can be routed to the right visa or document service.",
    faq: "FAQ",
    privacy: "Privacy",
    terms: "Terms",
    legal: "Privacy & Terms",
    group: "Group",
    realEstate: "Real Estate",
    finance: "Finance",
    blog: "Blog",
    readMore: "Read article",
    backToBlog: "Back to blog",
    publishedOn: "Published",
    noBlogPosts: "No articles published yet. Check back soon.",
  },
  tr: {
    home: "Ana sayfa",
    support: "Destek",
    notFound: "Bulunamadı",
    notFoundTitle: "Bu vize hizmet sayfası mevcut değil.",
    notFoundLead: "Ana sayfaya dönün ve ikamet, şirket kurulumu, çeviri, yasallaştırma, tasdik veya iletişim yolunu seçin.",
    backHome: "Ana sayfaya dön",
    contactDetail: "İletişim detay sayfası",
    contact: "İletişim",
    contactUs: "Bize Ulaşın",
    openPage: "Sayfayı aç",
    contactForm: "İletişim Formu",
    contactTitle: "Gereksinimi net paylaşın.",
    contactLead: "Form, ekibin incelemesi ve yönetim panelinden takip etmesi için talebi CMS'e gönderir.",
    fullName: "Ad Soyad",
    namePlaceholder: "Adınız ve soyadınız",
    email: "E-posta",
    emailPlaceholder: "eposta@ornek.com",
    phone: "Telefon / WhatsApp",
    phonePlaceholder: "+968...",
    service: "Hizmet",
    selectService: "Bir hizmet seçin...",
    countryAuthority: "Ülke / Yetkili Kurum",
    countryPlaceholder: "Ülke, elçilik, bakanlık veya kurum",
    message: "Mesaj",
    messagePlaceholder: "Vize, ikamet, şirket kurulumu, çeviri, tasdik, yasallaştırma veya belge gereksinimini açıklayın.",
    send: "Talep gönder",
    residencyVisa: "İkamet ve Vize",
    corporateSetup: "Kurumsal Kurulum",
    translation: "Çeviri",
    legalization: "Yasallaştırma",
    attestation: "Tasdik",
    footerText: "Premium ikamet, vize, şirket kurulumu ve resmi belge koordinasyonu.",
    footerPages: "Sayfalar",
    footerSites: "Siteler",
    footerLegal: "Yasal",
    footerMetaLine: "Umman, Türkiye, Körfez ve uluslararası müşteri rotalarında ikamet, vize, şirket kurulumu, çeviri, yasallaştırma ve tasdik koordinasyonu.",
    footerBottomNote: "Müşteri talepleri, ilgili vize veya belge hizmet yoluna yönlendirilmeden önce incelenir.",
    address: "Muscat, Umman Sultanlığı",
    siteName: "REZAEI İKAMET, VİZE VE TERCÜME HİZMETLERİ",
    nextStep: "Sonraki adım",
    ctaTitle: "Doğru belge yolunu hazırlamaya hazır mısınız?",
    ctaText: "Talebin doğru vize veya belge hizmetine yönlendirilmesi için ülke, belge türü, yetkili kurum, zamanlama ve hizmet hedefini gönderin.",
    faq: "SSS",
    privacy: "Gizlilik",
    terms: "Şartlar",
    legal: "Gizlilik ve Şartlar",
    group: "Grup",
    realEstate: "Gayrimenkul",
    finance: "Finans",
    blog: "Blog",
    readMore: "Yazıyı oku",
    backToBlog: "Bloga dön",
    publishedOn: "Yayınlandı",
    noBlogPosts: "Henüz yayınlanmış yazı yok. Yakında tekrar kontrol edin.",
  },
  fa: {
    home: "صفحه اصلی",
    support: "پشتیبانی",
    notFound: "پیدا نشد",
    notFoundTitle: "این صفحه خدمات ویزا در دسترس نیست.",
    notFoundLead: "به صفحه اصلی برگردید و مسیر اقامت، راه‌اندازی شرکت، ترجمه، قانونی‌سازی، تصدیق یا تماس را انتخاب کنید.",
    backHome: "بازگشت به صفحه اصلی",
    contactDetail: "صفحه جزئیات تماس",
    contact: "تماس",
    contactUs: "تماس با ما",
    openPage: "باز کردن صفحه",
    contactForm: "فرم تماس",
    contactTitle: "نیازمندی را شفاف ارسال کنید.",
    contactLead: "فرم درخواست را به CMS می‌فرستد تا تیم آن را بررسی و از پنل مدیریت پیگیری کند.",
    fullName: "نام کامل",
    namePlaceholder: "نام کامل شما",
    email: "ایمیل",
    emailPlaceholder: "you@example.com",
    phone: "تلفن / واتساپ",
    phonePlaceholder: "+968...",
    service: "خدمت",
    selectService: "یک خدمت انتخاب کنید...",
    countryAuthority: "کشور / مرجع",
    countryPlaceholder: "کشور، سفارت، وزارتخانه یا مرجع",
    message: "پیام",
    messagePlaceholder: "نیاز مربوط به ویزا، اقامت، راه‌اندازی شرکت، ترجمه، تصدیق، قانونی‌سازی یا سند را توضیح دهید.",
    send: "ارسال درخواست",
    residencyVisa: "اقامت و ویزا",
    corporateSetup: "راه‌اندازی شرکتی",
    translation: "ترجمه",
    legalization: "قانونی‌سازی",
    attestation: "تصدیق",
    footerText: "هماهنگی حرفه‌ای اقامت، ویزا، راه‌اندازی شرکت و اسناد رسمی.",
    footerPages: "صفحات",
    footerSites: "سایت‌ها",
    footerLegal: "حقوقی",
    footerMetaLine: "هماهنگی اقامت، ویزا، راه‌اندازی شرکت، ترجمه، قانونی‌سازی و تصدیق در عُمان، ترکیه، کشورهای حاشیه خلیج و مسیرهای بین‌المللی.",
    footerBottomNote: "درخواست‌های مشتریان پیش از ارجاع به مسیر خدمات ویزا یا اسناد مربوطه بررسی می‌شوند.",
    address: "مسقط، سلطنت عُمان",
    siteName: "خدمات اقامت، ویزا و ترجمه رضایی",
    nextStep: "مرحله بعد",
    ctaTitle: "آماده‌اید مسیر درست سند را آماده کنید؟",
    ctaText: "کشور، نوع سند، مرجع استفاده، زمان‌بندی و هدف خدمت را ارسال کنید تا درخواست به مسیر درست ویزا یا خدمات اسناد هدایت شود.",
    faq: "پرسش‌ها",
    privacy: "حریم خصوصی",
    terms: "شرایط",
    legal: "حریم خصوصی و شرایط",
    group: "گروه",
    realEstate: "املاک",
    finance: "مالی",
    blog: "بلاگ",
    readMore: "مطالعه مقاله",
    backToBlog: "بازگشت به بلاگ",
    publishedOn: "منتشر شده",
    noBlogPosts: "هنوز مقاله‌ای منتشر نشده است. به‌زودی دوباره سر بزنید.",
  },
  ar: {
    home: "الرئيسية",
    support: "الدعم",
    notFound: "غير موجود",
    notFoundTitle: "صفحة خدمة التأشيرة هذه غير متاحة.",
    notFoundLead: "ارجع إلى الصفحة الرئيسية واختر مسار الإقامة أو تأسيس الشركات أو الترجمة أو التصديق أو التواصل.",
    backHome: "العودة إلى الرئيسية",
    contactDetail: "صفحة تفاصيل التواصل",
    contact: "التواصل",
    contactUs: "اتصل بنا",
    openPage: "فتح الصفحة",
    contactForm: "نموذج التواصل",
    contactTitle: "شارك المتطلبات بوضوح.",
    contactLead: "يرسل النموذج طلبك إلى نظام إدارة المحتوى حتى يراجعه الفريق ويتابعه من لوحة الإدارة.",
    fullName: "الاسم الكامل",
    namePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    phone: "الهاتف / واتساب",
    phonePlaceholder: "+968...",
    service: "الخدمة",
    selectService: "اختر خدمة...",
    countryAuthority: "الدولة / الجهة",
    countryPlaceholder: "الدولة أو السفارة أو الوزارة أو الجهة",
    message: "الرسالة",
    messagePlaceholder: "اشرح متطلبات التأشيرة أو الإقامة أو تأسيس الشركة أو الترجمة أو التصديق أو المستند.",
    send: "إرسال الطلب",
    residencyVisa: "الإقامة والتأشيرة",
    corporateSetup: "تأسيس الشركات",
    translation: "الترجمة",
    legalization: "التصديق القانوني",
    attestation: "التوثيق",
    footerText: "تنسيق متميز للإقامة والتأشيرات وتأسيس الشركات والمستندات الرسمية.",
    footerPages: "الصفحات",
    footerSites: "المواقع",
    footerLegal: "قانوني",
    footerMetaLine: "تنسيق الإقامة والتأشيرات وتأسيس الشركات والترجمة والتصديق والتفويض عبر عُمان وتركيا ودول الخليج والمسارات الدولية.",
    footerBottomNote: "تتم مراجعة استفسارات العملاء قبل توجيهها إلى مسار خدمة التأشيرة أو المستندات المناسب.",
    address: "مسقط، سلطنة عُمان",
    siteName: "خدمات رضائي للإقامة والتأشيرات والترجمة",
    nextStep: "الخطوة التالية",
    ctaTitle: "هل أنت جاهز لتحضير مسار المستند الصحيح؟",
    ctaText: "أرسل الدولة ونوع المستند والجهة المستخدمة والجدول الزمني وهدف الخدمة ليتم توجيه الطلب إلى المسار الصحيح.",
    faq: "الأسئلة",
    privacy: "الخصوصية",
    terms: "الشروط",
    legal: "الخصوصية والشروط",
    group: "المجموعة",
    realEstate: "العقارات",
    finance: "التمويل",
    blog: "المدونة",
    readMore: "اقرأ المقال",
    backToBlog: "العودة إلى المدونة",
    publishedOn: "نُشر في",
    noBlogPosts: "لا توجد مقالات منشورة بعد. تحقق مرة أخرى قريبًا.",
  },
};

const sections = [
  {
    id: "residency-visa",
    eyebrow: "Residency & Visa",
    title: "Residency, visa, renewal, and mobility cases prepared with document clarity.",
    text: "A structured intake path for individuals, families, investors, employees, and business owners who need residency or visa support with a clear document sequence.",
    href: "/residency-visa",
    Icon: PlaneLanding,
    items: [
      ["Applicant Profile", "Family, investor, employment, renewal, visitor, and status-change needs are separated from the first review."],
      ["Document Readiness", "Passports, IDs, certificates, company papers, and supporting files are checked before next steps."],
      ["Follow-Up Path", "The response explains missing items, likely sequence, and the practical route to continue the case."],
    ],
  },
  {
    id: "corporate-setup",
    eyebrow: "Corporate Setup",
    title: "Company formation support for founders, investors, and operating teams.",
    text: "Business setup coordination that connects activity details, shareholder documents, licensing needs, and residency-related requirements.",
    href: "/corporate-setup",
    Icon: BriefcaseBusiness,
    items: [
      ["Business Activity", "Commercial activity, ownership structure, and operating purpose are organized before setup guidance."],
      ["Owner Documents", "Shareholder passports, IDs, addresses, and authorization papers are reviewed for readiness."],
      ["Setup Coordination", "Formation steps, licensing conversations, and related residency needs are kept in one track."],
    ],
  },
  {
    id: "translation",
    eyebrow: "Translation",
    title: "Official, legal, and business translation for documents that need authority use.",
    text: "Translation support for certificates, contracts, identity documents, corporate papers, legal files, and records used across official processes.",
    href: "/translation",
    Icon: Languages,
    items: [
      ["Personal Documents", "Birth, marriage, education, ID, passport, and family documents prepared for formal use."],
      ["Business Documents", "Licenses, contracts, powers of attorney, invoices, and company records handled with context."],
      ["Authority Context", "Translation is reviewed with the destination authority, country, and attestation needs in mind."],
    ],
  },
  {
    id: "legalization",
    eyebrow: "Legalization",
    title: "Document legalization paths for cross-border official use.",
    text: "A practical route for documents that must be accepted outside their issuing country, with source, destination, and authority requirements reviewed together.",
    href: "/legalization",
    Icon: Landmark,
    items: [
      ["Issuing Country", "The origin of the document is identified because each document path can change by country."],
      ["Destination Use", "Embassy, ministry, immigration, court, bank, or corporate use shapes the sequence."],
      ["Status Tracking", "The request is organized around what is missing, what is submitted, and what comes next."],
    ],
  },
  {
    id: "attestation",
    eyebrow: "Attestation",
    title: "Attestation coordination for certificates, company files, and legal documents.",
    text: "Attestation support keeps the document type, authority chain, translation need, and deadline visible from the first inquiry.",
    href: "/attestation",
    Icon: Stamp,
    items: [
      ["Certificates", "Education, civil, family, and identity-related certificates prepared for official acceptance."],
      ["Company Papers", "Commercial licenses, contracts, board documents, and authorization files reviewed by use case."],
      ["Authority Chain", "Notary, ministry, embassy, and destination authority steps are mapped before commitment."],
    ],
  },
];

const detailPages = {
  "/residency-visa": {
    eyebrow: "Residency & Visa",
    title: "Residency and visa support built around the applicant's real case.",
    lead:
      "A dedicated path for new applications, renewals, family cases, investor routes, business owners, and status-change inquiries.",
    Icon: PlaneLanding,
    cta: "Contact team",
    alternate: "Contact team",
    alternateHref: "/contact",
    blocks: [
      {
        title: "Applicant and purpose review",
        text: "The first step is understanding who is applying, why the visa or residency is needed, the destination or local authority, and whether the case is personal, family, investor, employment, or company-related.",
      },
      {
        title: "Document preparation",
        text: "Passports, IDs, photos, certificates, company papers, address details, and supporting records are checked for completeness before a route is recommended.",
      },
      {
        title: "Renewal and status changes",
        text: "Renewals and status-change cases need timing, current status, expiry dates, dependent details, and any previous application history to avoid unnecessary delays.",
      },
    ],
  },
  "/corporate-setup": {
    eyebrow: "Corporate Setup",
    title: "Company formation and founder documentation coordination.",
    lead:
      "Corporate setup support for investors, founders, and operating teams that need business formation, licensing context, and related residency preparation.",
    Icon: BriefcaseBusiness,
    cta: "Discuss company setup",
    alternate: "Contact team",
    alternateHref: "/contact",
    blocks: [
      {
        title: "Business profile",
        text: "The setup path starts with business activity, market, ownership, shareholder role, intended operation, and whether residency or bank-facing documentation is part of the plan.",
      },
      {
        title: "Shareholder documentation",
        text: "Owner passports, IDs, addresses, authorizations, existing company papers, and translated or attested documents are organized before formation conversations move forward.",
      },
      {
        title: "Formation coordination",
        text: "The process can involve activity selection, authority requirements, license preparation, office or address needs, and connected immigration or translation work.",
      },
      {
        title: "Follow-up readiness",
        text: "A complete inquiry should include desired business activity, number of owners, nationality, timeline, and whether the company is for local operations, investment, or mobility planning.",
      },
    ],
  },
  "/translation": {
    eyebrow: "Translation",
    title: "Official translation for documents that need to be accepted.",
    lead:
      "Translation support for personal, corporate, legal, educational, and commercial documents used in visa, residency, company, and authority processes.",
    Icon: Languages,
    cta: "Send document details",
    alternate: "Check legalization",
    alternateHref: "/legalization",
    blocks: [
      {
        title: "Personal document translation",
        text: "Civil certificates, education papers, IDs, passports, family records, and personal declarations should be described with language pair, issuing country, and intended use.",
      },
      {
        title: "Corporate and legal files",
        text: "Contracts, licenses, powers of attorney, company records, invoices, and legal papers are reviewed with terminology, deadlines, and authority requirements in mind.",
      },
      {
        title: "Connected attestation needs",
        text: "Some translations require attestation or legalization before use. The translation request is checked against destination authority expectations where possible.",
      },
    ],
  },
  "/legalization": {
    eyebrow: "Legalization",
    title: "Legalization routes for documents moving between authorities and countries.",
    lead:
      "A structured path for cross-border document acceptance, including source country, destination country, document type, and intended authority use.",
    Icon: Landmark,
    cta: "Review legalization path",
    alternate: "Ask for attestation",
    alternateHref: "/attestation",
    blocks: [
      {
        title: "Document origin and destination",
        text: "Legalization depends on where the document was issued, where it will be used, and whether embassy, ministry, notary, or destination authority steps are involved.",
      },
      {
        title: "Personal and business documents",
        text: "Civil certificates, education records, company licenses, board documents, contracts, and powers of attorney can require different sequences and supporting copies.",
      },
      {
        title: "Sequence and timing",
        text: "A practical response needs the deadline, current document status, original availability, translation requirements, and any previous stamps or submissions.",
      },
    ],
  },
  "/attestation": {
    eyebrow: "Attestation",
    title: "Attestation coordination for official document confidence.",
    lead:
      "Attestation support for documents that need formal recognition before visa, residency, corporate, banking, court, or authority use.",
    Icon: Stamp,
    cta: "Start attestation review",
    alternate: "Request translation",
    alternateHref: "/translation",
    blocks: [
      {
        title: "Authority chain mapping",
        text: "The attestation path may involve notary, ministry, embassy, consulate, foreign affairs, or local destination authority steps depending on the country and document type.",
      },
      {
        title: "Document condition",
        text: "Original availability, scanned copies, prior stamps, translation language, and certificate age can all affect whether the document is ready for processing.",
      },
      {
        title: "Use-case alignment",
        text: "Documents for immigration, university, court, company registration, banking, employment, or family matters are reviewed with different acceptance expectations.",
      },
    ],
  },
  "/contact": {
    eyebrow: "Contact",
    title: "Contact the residency and document team.",
    lead:
      "Send residency, visa, corporate setup, translation, legalization, or attestation details with enough context for routing.",
    Icon: Mail,
    cta: "Send inquiry",
    alternate: "Contact team",
    alternateHref: "/contact",
    contact: true,
    blocks: [
      {
        title: "Mobility inquiries",
        text: "Mention applicant type, nationality, current location, destination, visa or residency goal, deadline, and dependent details where relevant.",
      },
      {
        title: "Document inquiries",
        text: "Share document type, issuing country, language, destination country, intended authority, original availability, and whether translation is needed.",
      },
      {
        title: "Corporate inquiries",
        text: "Include business activity, number of shareholders, nationality, timeline, and whether the setup connects to residency, banking, or document attestation.",
      },
    ],
  },
};

const supportContent = {
  "/services": {
    title: "Residency, Visa & Document Services",
    lead: "Explore specialist service paths for residency, corporate setup, translation, legalization, and official document attestation.",
    blocks: [
      ["Residency & Visa", "Application, renewal, investor, family, employment-linked, and status-change case preparation."],
      ["Corporate Setup", "Company formation, licensing direction, shareholder files, and connected mobility requirements."],
      ["Official Translation", "Personal, legal, educational, corporate, and commercial documents prepared for authority use."],
      ["Legalization & Attestation", "Cross-border document recognition coordinated by issuing country, destination, and authority."],
    ],
  },
  "/blog": {
    title: "Residency & Document Insights",
    lead: "Practical updates about residency routes, visa preparation, translation, attestation, and cross-border document requirements.",
    blocks: [
      ["Residency planning", "Preparing applicant profiles, timelines, dependent details, and document checklists before starting a case."],
      ["Document readiness", "Translation, attestation, legalization, and authority-specific preparation for international use."],
      ["Corporate mobility", "Company setup, shareholder documentation, licensing, and connected residency requirements."],
    ],
  },
  "/legal": {
    title: "Privacy & Terms",
    lead: "How inquiry details are handled and how website service information should be used before a confirmed engagement.",
    blocks: [
      ["Inquiry data", "Share only the personal, document, country, authority, and timeline details needed to review and route your request."],
      ["Contact details", "Email and phone information are used for follow-up, clarification, and service coordination."],
      ["Service information", "Website content is for orientation and does not replace case-specific legal, immigration, authority, or compliance advice."],
      ["Engagement scope", "Submitting an inquiry starts a review conversation and does not create a confirmed engagement, quotation, or timeline."],
    ],
  },
};

const servicePageContent = {
  "residency-visa": {
    label: "Case Architecture",
    title: "A complete route from applicant profile to authority-ready submission.",
    text: "The residency desk separates personal, family, investor, employment, renewal, and status-change cases before any document path is recommended. This keeps the request realistic, prevents missing-file delays, and gives the team enough context to route the case correctly.",
    checklistTitle: "Prepare before contact",
    checklist: ["Applicant nationality and current location", "Target country or authority", "Current visa or residency status", "Family/dependent details if relevant", "Deadline, expiry date, or travel window"],
    processTitle: "How the page works",
    process: ["Profile review", "Document gap check", "Route recommendation", "Follow-up file"],
    situations: ["New residency applications", "Renewals and expiry-sensitive cases", "Investor, family, visitor, and employment-linked files"],
  },
  "corporate-setup": {
    label: "Founder File",
    title: "Business setup planned together with shareholder and mobility requirements.",
    text: "Corporate setup requests are reviewed through activity, ownership, shareholder documents, licensing direction, and connected residency needs. The goal is to avoid treating company formation, bank-facing papers, and immigration support as disconnected tasks.",
    checklistTitle: "Prepare before contact",
    checklist: ["Business activity and operating country", "Number of shareholders and roles", "Passport/ID availability", "Expected launch timeline", "Whether residency or document attestation is connected"],
    processTitle: "How the page works",
    process: ["Activity mapping", "Owner document review", "Setup route planning", "Connected service routing"],
    situations: ["New company formation", "Founder residency planning", "Shareholder document preparation"],
  },
  translation: {
    label: "Document Language",
    title: "Official translation shaped around the authority that will use it.",
    text: "Translation requests are checked by document type, language pair, issuing country, destination authority, deadline, and whether attestation or legalization is required before use. This keeps translations aligned with the real submission context.",
    checklistTitle: "Prepare before contact",
    checklist: ["Document type and scan quality", "Source and target language", "Issuing country", "Destination authority or use case", "Deadline and original-document availability"],
    processTitle: "How the page works",
    process: ["Document review", "Language pair confirmation", "Authority context check", "Delivery coordination"],
    situations: ["Civil certificates", "Contracts and powers of attorney", "Corporate, legal, educational, and commercial files"],
  },
  legalization: {
    label: "Cross-Border Acceptance",
    title: "Legalization routes organized by source country, destination, and authority use.",
    text: "Legalization is not one fixed step. The route changes based on issuing country, destination country, document type, embassy or ministry requirements, translation needs, and existing stamps. The page turns those variables into a clear next action.",
    checklistTitle: "Prepare before contact",
    checklist: ["Issuing country and destination country", "Document type and current status", "Existing stamps or prior submissions", "Translation requirement if known", "Authority where the document will be used"],
    processTitle: "How the page works",
    process: ["Origin check", "Authority sequence", "Missing-step review", "Submission follow-up"],
    situations: ["Embassy and ministry legalization", "Cross-border personal documents", "Business documents for foreign use"],
  },
  attestation: {
    label: "Authority Chain",
    title: "Attestation coordination for documents that must be formally recognized.",
    text: "Attestation requests are organized around the document category, authority chain, original availability, translation requirement, and deadline. This helps identify whether notary, ministry, embassy, foreign affairs, or destination authority steps are needed.",
    checklistTitle: "Prepare before contact",
    checklist: ["Original or certified copy status", "Document age and issuing authority", "Target use case", "Required country or authority", "Urgency and delivery constraints"],
    processTitle: "How the page works",
    process: ["Document condition check", "Authority chain mapping", "Translation dependency review", "Status tracking"],
    situations: ["Education and civil certificates", "Company papers and board documents", "Banking, court, employment, and immigration files"],
  },
};

const pageContentOverrides = {
  "residency-visa": {
    eyebrow: "Residency & Visa",
    title: "Residency and visa cases, prepared without guesswork.",
    lead: "A focused route for new applications, renewals, family files, investor paths, employment-linked cases, and status changes — built around document readiness and realistic timing.",
  },
  "corporate-setup": {
    eyebrow: "Corporate Setup",
    title: "Company setup with founder documents, licensing, and mobility aligned.",
    lead: "A practical formation path for founders and investors who need business activity, shareholder files, licensing direction, and connected residency requirements handled together.",
  },
  translation: {
    eyebrow: "Translation & Documents",
    title: "Official translation and document preparation for authority use.",
    lead: "Translation support for personal, legal, corporate, educational, and commercial files — reviewed by destination authority, language pair, deadline, and attestation needs.",
  },
  legalization: {
    eyebrow: "Legalization",
    title: "Legalization paths for documents crossing countries and authorities.",
    lead: "A clear route for documents that need recognition outside their issuing country, including embassy, ministry, notary, translation, and destination-authority requirements.",
  },
  attestation: {
    eyebrow: "Attestation",
    title: "Attestation coordination for certificates and official records.",
    lead: "A structured process for education, civil, company, legal, banking, court, employment, and immigration documents that must be formally recognized.",
  },
  contact: {
    eyebrow: "Contact Us",
    title: "Send the case details. We will route the request.",
    lead: "Use the form for residency, visa, corporate setup, translation, legalization, or attestation inquiries. The more complete the context, the faster the first review.",
    contactTitle: "Share the requirement clearly.",
    contactLead: "Send the country, document type, authority use, timeline, and service goal so the request can be routed to the right desk.",
  },
};

function getCurrentPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function formatBlogDate(value, locale) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localeCode = locale === "fa" ? "fa-IR" : locale === "ar" ? "ar-AE" : locale === "tr" ? "tr-TR" : "en-GB";
  return new Intl.DateTimeFormat(localeCode, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function normalizeBlogPosts(items = []) {
  return items.map((item) => ({
    slug: item.slug,
    title: item.title,
    category: item.category || "",
    excerpt: item.excerpt || "",
    imageUrl: item.image_url || item.imageUrl || "",
    publishedAt: item.published_at || item.publishedAt || null,
  }));
}

function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const [path, setPath] = useState(getCurrentPath());
  const [content, setContent] = useState(() => getFallbackContent(getCurrentPath(), lang));
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [blogPosts, setBlogPosts] = useState(() => getFallbackBlogPosts(getInitialLanguage()));
  const activeLang = languages.find((item) => item.code === lang) || languages[0];
  const copy = uiCopy[lang] || uiCopy.en;

  const isHome = path === "/";
  const isBlogList = path === "/blog";
  const isBlogPost = path.startsWith("/blog/") && path.length > 6;
  const activeServicePage = serviceDetails.find((service) => service.href === path) || null;
  const combinedBlogPosts = useMemo(() => {
    const seen = new Set();
    return blogPosts.filter((post) => {
      if (!post.slug || seen.has(post.slug)) return false;
      seen.add(post.slug);
      return true;
    });
  }, [blogPosts]);
  const activeBlogPost = content.blogPost || null;
  const headerNavItems = content.navItems?.length ? content.navItems : visaHeaderNavItems;
  const homeContent = {
    ...content.home,
    sections: content.home.sections.map((section) => ({
      ...section,
      Icon: resolveIcon(section.iconKey || section.id),
    })),
  };
  const detail = content.detail
    ? {
        ...content.detail,
        ...(lang === "en" ? pageContentOverrides[content.detail.iconKey] || {} : {}),
        Icon: resolveIcon(content.detail.iconKey),
      }
    : null;
  const support = supportContent[path];
  const settings = content.settings || {};
  const nestedSettings = content.extra || settings.settings || {};
  const cmsBrand = content.brand || {};
  const cmsHeroMediaExtra = content.heroMedia || {};
  const currentSiteName = content.siteName || site.name;
  const currentBrand = {
    ...brand,
    displayName: lang === "en" ? currentSiteName || brand.displayName : copy.siteName,
    logoWide: resolveBrandLogo(cmsBrand.logoWide || nestedSettings.brand_logo_wide, brand.logoWide),
    logoStacked: resolveBrandLogo(cmsBrand.logoStacked || nestedSettings.brand_logo_stacked, brand.logoStacked),
    color: cmsBrand.color || nestedSettings.brand_color || brand.color,
    favicon: cmsBrand.favicon || nestedSettings.favicon_url || brand.logoStacked,
  };
  const currentHeroMedia = {
    video: cmsHeroMediaExtra.video || nestedSettings.hero_video || heroMedia.video,
    poster: cmsHeroMediaExtra.poster || nestedSettings.hero_poster || heroMedia.poster,
  };
  const cmsGroupSiteUrls = content.groupSiteUrls || nestedSettings.group_site_urls || {};
  const activeSiteUrls = {
    mainSite: cmsGroupSiteUrls.mainSite || siteUrls.mainSite,
    realEstate: cmsGroupSiteUrls.realEstate || siteUrls.realEstate,
    finance: cmsGroupSiteUrls.finance || siteUrls.finance,
    visa: cmsGroupSiteUrls.visa || siteUrls.visa,
  };
  const footerText = content.footerText || settings.footer_text || "";
  const contactRows = [
    { label: "Email", value: settings.contact_email || "info@rezaeiglobal.com" },
    { label: "Phone", value: settings.contact_phone || "" },
    { label: copy.countryAuthority, value: copy.address },
  ].filter((row) => isDisplayableContactValue(row.value));
  const pageTitle = isBlogPost && activeBlogPost
    ? activeBlogPost.title
    : isBlogList && content.blogIndex
      ? content.blogIndex.title
      : support?.title || content.pageTitle || copy.siteName;
  const pageDescription = isBlogPost && activeBlogPost
    ? activeBlogPost.excerpt
    : isBlogList && content.blogIndex
      ? content.blogIndex.lead
      : support?.lead || content.pageDescription || site.description;
  const pageKeywords = content.pageKeywords || "visa, residency, corporate setup, translation, legalization, attestation, document services";
  const helmetTitle = content.seo?.title || `${pageTitle} | ${currentSiteName}`;
  const finalHelmetTitle = helmetTitle.includes(currentSiteName) ? helmetTitle : `${helmetTitle} | ${currentSiteName}`;
  const ogImageUrl = content.ogImageUrl || currentBrand.logoWide;
  const pageUrlPath = path === "/" ? "/" : path;
  const canonicalUrl = withSiteUrl(pageUrlPath);
  const brandLogoUrl = withSiteUrl(currentBrand.logoStacked);
  const brandImageUrl = withSiteUrl(currentBrand.logoWide);
  const ogImageAbsoluteUrl = withSiteUrl(ogImageUrl || currentBrand.logoWide);
  const alternateLinks = buildAlternateLinks(pageUrlPath);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: currentBrand.displayName,
      url: canonicalUrl,
      logo: brandLogoUrl,
      image: brandImageUrl,
      description: pageDescription,
      areaServed:
        Array.isArray(content.areaServed) && content.areaServed.length
          ? content.areaServed
          : ["Sultanate of Oman", "Turkey", "Iran", "International clients"],
      serviceType: ["Residency", "Visa", "Corporate setup", "Translation", "Legalization", "Attestation"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: settings.contact_email || "info@rezaeiglobal.com",
        telephone: settings.contact_phone || undefined,
      },
    }),
    [brandImageUrl, brandLogoUrl, canonicalUrl, currentSiteName, pageDescription, settings.contact_email, settings.contact_phone],
  );

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
    if (!isBlogList && !isBlogPost) return undefined;
    let isCurrent = true;
    const fallbackPosts = getFallbackBlogPosts(lang);
    setBlogPosts(fallbackPosts);
    fetchCmsBlogPosts(lang)
      .then((items) => {
        if (isCurrent && Array.isArray(items) && items.length) {
          setBlogPosts(normalizeBlogPosts(items));
        }
      })
      .catch(() => {
        if (isCurrent) setBlogPosts(fallbackPosts);
      });
    return () => {
      isCurrent = false;
    };
  }, [isBlogList, isBlogPost, lang]);

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

    headerNavItems.forEach(({ sectionId }) => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [headerNavItems, isHome]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [path]);

  function navigate(href) {
    window.history.pushState({}, "", href);
    setPath(getCurrentPath());
    setMenuOpen(false);
    setStatus("");
    if (href.includes("#")) {
      const targetId = href.split("#").pop();
      window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
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
        site_key: "visa",
        page_slug: path,
        locale: lang,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        company: String(data.get("company") || ""),
        country: String(data.get("country") || ""),
        subject: String(data.get("service") || "Visa inquiry"),
        message: String(data.get("message") || ""),
      });
      form.reset();
      setStatus(uiOr(content, "inquiry_success", inquirySuccessMessage));
    } catch {
      setStatus(uiOr(content, "inquiry_error", inquiryErrorMessage));
    }
  }

  return (
    <div className="siteShell theme-visa" data-content-source={content.source} dir={activeLang.dir} lang={lang}>
      <Helmet>
        <html lang={lang} dir={activeLang.dir} />
        <title>{finalHelmetTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
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
        <link rel="icon" href={currentBrand.favicon || currentBrand.logoStacked} />
        <link rel="apple-touch-icon" href={currentBrand.logoStacked} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header
        activeSection={activeSection}
        brand={currentBrand}
        isHome={isHome}
        menuOpen={menuOpen}
        navigate={navigate}
        navItems={headerNavItems}
        path={path}
        lang={lang}
        languages={languages}
        setLang={changeLanguage}
        setMenuOpen={setMenuOpen}
      />

      <main className={isHome ? "pageMain visaLanding" : `pageMain detailMain detailPage-${detail?.iconKey || "support"}`}>
        {isHome && (
          <HomePage
            brand={currentBrand}
            content={homeContent}
            copy={copy}
            heroMedia={currentHeroMedia}
            navigate={navigate}
          />
        )}
        {!isHome && isBlogList && (
          <VisaBlogPage
            blogIndex={content.blogIndex}
            copy={copy}
            heroMedia={currentHeroMedia}
            lang={lang}
            navigate={navigate}
            posts={combinedBlogPosts}
          />
        )}
        {!isHome && isBlogPost && activeBlogPost && (
          <VisaBlogPostPage copy={copy} lang={lang} navigate={navigate} post={activeBlogPost} />
        )}
        {!isHome && isBlogPost && !activeBlogPost && <NotFoundPage copy={copy} navigate={navigate} />}
        {!isHome && !isBlogList && !isBlogPost && path === "/faq" && <VisaFaqPage copy={copy} navigate={navigate} cmsFaqSections={content.faqSections} />}
        {!isHome && !isBlogList && !isBlogPost && path === "/services" && <VisaServicesPage navigate={navigate} />}
        {!isHome && !isBlogList && !isBlogPost && activeServicePage && (
          <PremiumServiceDetailPage copy={copy} navigate={navigate} service={activeServicePage} />
        )}
        {!isHome && !isBlogList && !isBlogPost && !activeServicePage && path !== "/faq" && path !== "/services" && detail && (
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
        {!isHome && !isBlogList && !isBlogPost && !activeServicePage && path !== "/faq" && path !== "/services" && !detail && support && <SupportPage copy={copy} support={support} navigate={navigate} />}
        {!isHome && !isBlogList && !isBlogPost && !activeServicePage && path !== "/faq" && path !== "/services" && !detail && !support && <NotFoundPage copy={copy} navigate={navigate} />}
      </main>

      <Footer
        brand={currentBrand}
        copy={copy}
        footerText={footerText || copy.footerText}
        navigate={navigate}
        navItems={headerNavItems}
        siteName={currentBrand.displayName}
        siteUrls={activeSiteUrls}
      />
    </div>
  );
}

function Header({ activeSection, brand, isHome, lang, languages, menuOpen, navigate, navItems, path, setLang, setMenuOpen }) {
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);

  useEffect(() => {
    const menu = document.querySelector(".premiumHeader .navLinks");

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      menu?.scrollTo({ top: 0 });
    } else {
      document.body.style.overflow = "";
      setServicesMenuOpen(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!servicesMenuOpen) return undefined;

    function handlePointerDown(event) {
      if (!event.target.closest(".navMegaItem")) {
        setServicesMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setServicesMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [servicesMenuOpen]);

  return (
    <header className="siteHeader premiumHeader">
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

      <nav className={`${menuOpen ? "navLinks open" : "navLinks"}${servicesMenuOpen ? " servicesOpen" : ""}`} aria-label="Main navigation">
        <div className="navList">
          {navItems.map((item) => {
            const isServices = item.href === "/services";
            const active = path === item.href || (isServices && serviceDetails.some((service) => service.href === path));

            if (isServices) {
              return (
                <div className={`navMegaItem${servicesMenuOpen ? " open" : ""}`} key={item.label}>
                  <button
                    className={active ? "active" : ""}
                    type="button"
                    onClick={() => setServicesMenuOpen((value) => !value)}
                    aria-expanded={servicesMenuOpen}
                    aria-haspopup="true"
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={13} aria-hidden="true" />
                  </button>
                  <div className="navMegaMenu">
                    <button
                      className="navMegaBack"
                      type="button"
                      onClick={() => setServicesMenuOpen(false)}
                    >
                      <ChevronLeft size={15} aria-hidden="true" />
                      <span>Back</span>
                    </button>
                    <div className="navMegaIntro">
                      <span>Our services</span>
                      <strong>Choose the service desk for your case.</strong>
                      <p>Direct access to the same detailed service pages available from the Services overview.</p>
                    </div>
                    <div className="navMegaLinks">
                      {serviceDetails.map(({ href, Icon, eyebrow, title }) => (
                        <a
                          className={path === href ? "active" : ""}
                          href={href}
                          key={href}
                          onClick={(event) => {
                            event.preventDefault();
                            navigate(href);
                            setServicesMenuOpen(false);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="navMegaIcon"><Icon size={18} aria-hidden="true" /></span>
                          <span>
                            <strong>{eyebrow}</strong>
                            <small>{title}</small>
                          </span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </a>
                      ))}
                      <a
                        className={`navMegaAllServices${path === item.href ? " active" : ""}`}
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate(item.href);
                          setServicesMenuOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        <span className="navMegaAllServicesIcon">
                          <BriefcaseBusiness size={17} aria-hidden="true" />
                        </span>
                        <span>
                          <strong>All Services</strong>
                          <small>Complete overview</small>
                        </span>
                        <span className="navMegaAllServicesArrow">
                          <ArrowRight size={15} aria-hidden="true" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                className={active ? "active" : ""}
                href={item.href}
                key={item.label}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(item.href);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      <LanguageSelector lang={lang} languages={languages} onChange={setLang} />

      <button className="iconButton" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu" aria-expanded={menuOpen}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function copyLabel(key, navItems) {
  return navItems.find((item) => item.key === key || item.href === `/${key}`)?.label || "Contact";
}

function HomePage({ brand, content, copy, heroMedia, navigate }) {
  const hero = content.hero;
  const [primaryAction, secondaryAction] = hero.actions || [];
  const homeNavSections = [
    {
      id: "home-residency",
      label: copy.residencyVisa,
      href: "/residency-visa",
      Icon: PlaneLanding,
      title: "Residency and visa files with a clear route.",
      text: "Use this path for new residency, renewals, family sponsorship, investor cases, employment-linked status, and deadline-sensitive mobility questions.",
      points: ["Applicant profile", "Document checklist", "Authority sequence"],
      badge: "Mobility",
      metric: "01",
      metricLabel: "case route",
      note: "Built for personal, family, investor, and employment-linked residency files.",
      panelText: "Residency cases with document order.",
      copyCards: [
        ["Best for", "Visa cases"],
        ["Next move", "Check eligibility"],
      ],
    },
    {
      id: "home-blog",
      label: copy.blog,
      href: "/blog",
      Icon: FileText,
      title: "Practical articles for residency and document planning.",
      text: "The blog collects guidance on visa preparation, translation, attestation, legalization, company setup, and cross-border document requirements.",
      points: ["Checklists", "Process notes", "Document insights"],
      badge: "Insights",
      metric: "12",
      metricLabel: "published briefs",
      note: "Use it to understand the process before preparing documents.",
      panelText: "Guides before you prepare files.",
      copyCards: [
        ["Best for", "Research"],
        ["Next move", "Read brief"],
      ],
    },
    {
      id: "home-services",
      label: "Services",
      href: "/services",
      Icon: BriefcaseBusiness,
      title: "All service routes in one coordinated index.",
      text: "The services page compares residency, corporate setup, translation, legalization, and attestation so you can choose the right path before sending a case.",
      points: ["Five service areas", "Detailed pages", "Connected workflows"],
      badge: "Index",
      metric: "05",
      metricLabel: "service desks",
      note: "The fastest way to choose between residency, company, and document services.",
      panelText: "One index for every service desk.",
      copyCards: [
        ["Best for", "Choosing service"],
        ["Next move", "Open details"],
      ],
    },
    {
      id: "home-faq",
      label: copy.faq,
      href: "/faq",
      Icon: SearchCheck,
      title: "Answers before you send documents.",
      text: "The FAQ explains timelines, required context, document handling, translation questions, and how inquiries are reviewed by the team.",
      points: ["Common questions", "Timing context", "Submission basics"],
      badge: "Clarity",
      metric: "24h",
      metricLabel: "review mindset",
      note: "Good for removing uncertainty before opening a service request.",
      panelText: "Quick answers before submission.",
      copyCards: [
        ["Best for", "Questions"],
        ["Next move", "Clear doubts"],
      ],
    },
    {
      id: "home-contact",
      label: copy.contactUs,
      href: "/contact",
      Icon: Mail,
      title: "Send the requirement to the right desk.",
      text: "Use contact when you already know the country, document type, authority, deadline, or service goal and want the team to route it correctly.",
      points: ["Case intake", "Document context", "Team response"],
      badge: "Intake",
      metric: "1:1",
      metricLabel: "request routing",
      note: "Send the core facts and the team can identify the next document path.",
      panelText: "Send facts to the right desk.",
      copyCards: [
        ["Best for", "Ready cases"],
        ["Next move", "Send inquiry"],
      ],
    },
  ];

  function runHeroAction(action) {
    navigate(action?.href || "/contact");
  }

  return (
    <>
      <section className="hpHero" id="home">
        <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="hpHeroScrim" aria-hidden="true" />
        <div className="hpHeroBody">
          <div className="hpHeroCopy">
            <div className="hpHeroTag" aria-label="Location and service type">
              <span className="hpHeroTagDot" aria-hidden="true" />
              Muscat, Oman · Immigration &amp; Document Services
            </div>
            <h1 className="hpHeroH1">
              We organize the papers behind your next move.
            </h1>
            <p className="hpHeroLead">
              Residency, company setup, certified translation, legalization, and attestation handled as one clean document path.
            </p>
            <div className="hpHeroActions">
              <button type="button" className="hpHeroPrimary" onClick={() => navigate("/services")}>
                View our services <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button type="button" className="hpHeroSecondary" onClick={() => navigate("/contact")}>
                Send an inquiry
              </button>
            </div>
            <div className="hpHeroServices" aria-label="Service areas">
              {[
                { Icon: PlaneLanding, label: "Residency & Visa" },
                { Icon: BriefcaseBusiness, label: "Corporate Setup" },
                { Icon: Languages, label: "Translation" },
                { Icon: Stamp, label: "Legalization" },
                { Icon: Landmark, label: "Attestation" },
              ].map(({ Icon, label }) => (
                <div className="hpHeroService" key={label}>
                  <Icon size={13} aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="hpHeroVisual" aria-label="Document coordination preview">
            <div className="hpHeroVisualTop">
              <span>Case Route</span>
              <strong>01</strong>
            </div>
            <div className="hpHeroDocument">
              <div className="hpHeroDocSeal">
                <FileText size={24} aria-hidden="true" />
              </div>
              <div>
                <span>Document readiness</span>
                <h2>Clear file before submission.</h2>
              </div>
            </div>
            <div className="hpHeroRouteList">
              {[
                ["Profile", "Applicant, family, company, or authority context."],
                ["Files", "Passports, certificates, translations, and attestations."],
                ["Timing", "Expiry dates, travel plans, and submission deadlines."],
              ].map(([title, text]) => (
                <article key={title}>
                  <CircleCheck size={17} aria-hidden="true" />
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
        <div className="hpHeroFoot" aria-label="Service highlights">
          <div className="hpHeroFootItem"><strong>5</strong><span>Service Desks</span></div>
          <div className="hpHeroFootSep" aria-hidden="true" />
          <div className="hpHeroFootItem"><strong>10+</strong><span>Years Experience</span></div>
          <div className="hpHeroFootSep" aria-hidden="true" />
          <div className="hpHeroFootItem"><strong>Oman</strong><span>Based Team</span></div>
        </div>
      </section>

      <section className="homeNavGuide" aria-label="Homepage navigation guide">
        <div className="homeNavGuideIntro">
          <p className="eyebrow">Site guide</p>
          <h2>Choose the page that matches your next step.</h2>
          <p>Quick paths to each page.</p>
        </div>
        <div className="homeNavSections">
          {homeNavSections.map(({ Icon, badge, copyCards, href, id, label, metric, metricLabel, panelText, points, text, title }, index) => (
            <section className="homeNavSection" id={id} key={id}>
              <div className="homeNavSectionInner">
                <div className="homeNavSectionCopy">
                  <p className="homeNavRouteLabel">{String(index + 1).padStart(2, "0")} / {label}</p>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <div className="homeNavCopyDeck" aria-label={`${label} route highlights`}>
                    {copyCards.map(([cardLabel, cardValue]) => (
                      <article key={`${cardLabel}-${cardValue}`}>
                        <span>{cardLabel}</span>
                        <strong>{cardValue}</strong>
                      </article>
                    ))}
                  </div>
                  <button type="button" onClick={() => navigate(href)}>
                    Open {label} <ArrowRight size={15} aria-hidden="true" />
                  </button>
              </div>
              <div className="homeNavSectionPanel">
                  <div className="homeNavPanelTop">
                    <div className="homeNavRouteIcon" aria-hidden="true">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span>{badge}</span>
                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                    </div>
                  </div>
	                  <div className="homeNavPanelBody">
	                    <div>
	                      <strong>{label}</strong>
	                      <p>{panelText}</p>
	                    </div>
                    <div className="homeNavMetric" aria-label={`${metric} ${metricLabel}`}>
                      <strong>{metric}</strong>
                      <span>{metricLabel}</span>
                    </div>
                  </div>
                  <div className="homeNavRoutePoints">
                    {points.map((point, pointIndex) => (
                      <article key={point}>
                        <span>{String(pointIndex + 1).padStart(2, "0")}</span>
                        <strong>{point}</strong>
                        <CircleCheck size={15} aria-hidden="true" />
                      </article>
                    ))}
                  </div>
	              </div>
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

function formatHeroTitle(title) {
  if (title === "Document-led mobility support for serious personal and corporate cases.") {
    return (
      <>
        <span className="heroTitleKicker">Document-led</span>
        <span className="heroTitleFocus">mobility advisory.</span>
      </>
    );
  }

  return title;
}

function HomeSection({ index, navigate, section }) {
  const Icon = section.Icon;
  const number = String(index + 1).padStart(2, "0");

  if (section.id === "residency-visa") {
    return (
      <section className="serviceJourney serviceJourney-residency" id={section.id}>
        <div className="journeyIntro">
          <Icon size={26} aria-hidden="true" />
          <span>{number}</span>
          <p className="eyebrow">{section.eyebrow}</p>
          <h2>{homeShortTitle(section)}</h2>
          <p>{homeShortText(section)}</p>
        </div>
        <div className="journeyRoute">
          <ol>
            {section.items.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
          <button type="button" className="textButton" onClick={() => navigate(section.href)}>
            {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  if (section.id === "corporate-setup") {
    return (
      <section className="founderDesk" id={section.id}>
        <div className="founderRail" aria-hidden="true">
          <Icon size={28} />
          <span>{number}</span>
        </div>
        <div className="founderLead">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2>{homeShortTitle(section)}</h2>
          <p>{homeShortText(section)}</p>
          <button type="button" className="textButton" onClick={() => navigate(section.href)}>
            {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="founderStack">
          {section.items.map(([title, text], itemIndex) => (
            <article key={title}>
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.id === "translation") {
    return (
      <section className="documentDesk documentAsFounder" id={section.id}>
        <div className="documentRail founderRail" aria-hidden="true">
          <Icon size={24} />
          <span>{number}</span>
        </div>
        <div className="documentCopy founderLead">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2>{homeShortTitle(section)}</h2>
          <p>{section.text}</p>
          <button type="button" className="textButton" onClick={() => navigate(section.href)}>
            {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div className="documentLeaves founderStack">
          {section.items.map(([title, text], itemIndex) => (
            <article key={title}>
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (section.id === "legalization") {
    return (
      <section className="borderRoute" id={section.id}>
        <aside>
          <div className="borderRouteMark">
            <Icon size={28} aria-hidden="true" />
            <span>{number}</span>
          </div>
          <div className="borderRouteHead">
            <p className="eyebrow">{section.eyebrow}</p>
            <h2>{homeShortTitle(section)}</h2>
            <button type="button" className="textButton" onClick={() => navigate(section.href)}>
              {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </aside>
        <div>
          <p>{section.text}</p>
        </div>
        <ul>
          {section.items.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (section.id === "attestation") {
    return (
      <section className="sealReview" id={section.id}>
        <aside>
          <div className="borderRouteMark">
            <Icon size={28} aria-hidden="true" />
            <span>{number}</span>
          </div>
          <div className="borderRouteHead">
            <p className="eyebrow">{section.eyebrow}</p>
            <h2>{homeShortTitle(section)}</h2>
            <button type="button" className="textButton" onClick={() => navigate(section.href)}>
              {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </aside>
        <div>
          <p>{section.text}</p>
        </div>
        <ul>
          {section.items.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <article className={`homeServiceModule homeServiceModule-${section.id} homeEditorialPanel-${index + 1}`} id={section.id}>
      <div className="homePanelMarker" aria-hidden="true">
        <Icon size={24} />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="homePanelTitle">
        <p className="eyebrow">{section.eyebrow}</p>
        <h2>{homeShortTitle(section)}</h2>
      </div>
      <div className="homePanelBody">
        <p>{section.text}</p>
        <div className="homePanelProofs" data-count={section.items.length}>
          {section.items.map(([title, text]) => (
            <span key={title}>
              <strong>{title}</strong>
              {text}
            </span>
          ))}
        </div>
        <button type="button" className="textButton" onClick={() => navigate(section.href)}>
          {section.eyebrow} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function homeShortTitle(section) {
  const titles = {
    "residency-visa": "Residency cases, clearly prepared.",
    "corporate-setup": "Company setup for founders.",
    translation: "Translation for official use.",
    legalization: "Legalization across borders.",
    attestation: "Attestation for trusted records.",
  };
  return titles[section.id] || section.title;
}

function homeShortText(section) {
  const texts = {
    translation: "Certified translation for official records.",
  };
  return texts[section.id] || section.text;
}

function HomeContactCta({ copy, navigate }) {
  return (
    <section className="homeContactCta closingBand">
      <div className="closingBandInner">
        <div>
          <p className="eyebrow">{copy.contactUs}</p>
          <h2>Ready to prepare the right document path?</h2>
          <p>
            Send the country, document type, authority use, timeline, and service goal. The request will be reviewed and routed to the right visa, setup, translation, legalization, or attestation path.
          </p>
        </div>
        <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
          {copy.contactUs} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function DetailPage({ contactRows, copy, detail, handleSubmit, heroMedia, navigate, status }) {
  const isContactPage = detail.pageType === "contact" || detail.contact;

  if (isContactPage) {
    return <VisaContactPage contactRows={contactRows} copy={copy} detail={detail} handleSubmit={handleSubmit} status={status} />;
  }

  return (
    <>
      <section className={`serviceMasthead serviceMasthead-${detail.iconKey}`}>
        <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="serviceMastheadVeil" aria-hidden="true" />
        <div className="serviceMastheadInner">
          <p className="eyebrow">{detail.eyebrow}</p>
          <h1>{detail.title}</h1>
          <p className="lead">{detail.lead}</p>
        </div>
      </section>

      <DetailBody detail={detail} navigate={navigate} />
      <ContactCta copy={copy} navigate={navigate} />
    </>
  );
}

function VisaContactPage({ contactRows, copy, detail, handleSubmit, status }) {
  const contactRoutes = [
    [Send, "Send your case", "Best for new residency, visa, setup, translation, legalization, or attestation requests."],
    [Mail, "Email documents", "Use email when you already have scans, authority instructions, or a written case summary."],
    [Phone, "Call or WhatsApp", "Useful when timing is urgent or you need quick direction before preparing the full file."],
  ];
  const prepItems = [
    "Service type and destination country",
    "Applicant profile or document type",
    "Authority, deadline, and current status",
  ];

  return (
    <div className="visaContactPage">
      <section className="visaContactHero">
        <div className="visaContactShell visaContactHeroGrid">
          <div className="visaContactHeroCopy">
            <p className="eyebrow">Contact the visa & document team</p>
            <h1>{detail.title}</h1>
            <p>{detail.lead}</p>
          </div>
          <aside className="visaContactRoutes" aria-label="Contact options">
            <header><span>Contact routes</span><strong>One clear entry for every case.</strong></header>
            <div>
              {contactRoutes.map(([Icon, title, text]) => (
                <article key={title}>
                  <span><Icon size={19} aria-hidden="true" /></span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="visaContactMain">
        <div className="visaContactShell visaContactMainGrid">
          <div className="visaContactFormCard" id="contact-form">
            <header><span>Message the team</span><h2>Tell us what you need.</h2></header>
            <ConsultationForm copy={copy} handleSubmit={handleSubmit} status={status} />
          </div>
          <aside className="visaContactInfo">
            <p className="eyebrow">Helpful context</p>
            <h2>What to include</h2>
            <div className="visaContactPrep">
              {prepItems.map((item) => <span key={item}><CircleCheck size={17} /> {item}</span>)}
            </div>
            <div className="visaContactDirect">
              {contactRows.map((row) => {
                const Icon = resolveContactIcon(row.label);
                return <span key={`${row.label}-${row.value}`}><Icon size={18} /> {row.value}</span>;
              })}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function DetailBody({ detail, navigate }) {
  const content = servicePageContent[detail.iconKey];
  if (detail.iconKey === "corporate-setup") return <CorporateBody content={content} detail={detail} navigate={navigate} />;
  if (["translation", "legalization", "attestation"].includes(detail.iconKey)) return <DocumentBody content={content} detail={detail} />;

  return (
    <section className="residencyJourney">
      <div className="residencyRouteGrid">
        <aside className="journeyCompass">
          <span>{content.label}</span>
          <h2>{content.title}</h2>
          <p>{content.text}</p>
        </aside>
        <div className="mobilityMap">
          <div className="mobilityStops">
            {detail.blocks.map((block, index) => (
              <article key={block.title} className="mobilityStop">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{block.title}</h2>
                  <p>{residencyMobilityText(block, index)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="residencyInsightGrid">
        <InsightPanel title={content.processTitle} items={content.process} tone="route" />
        <InsightPanel title="Common situations" items={content.situations} tone="case" />
      </div>
      <ChecklistStrip title={content.checklistTitle} items={content.checklist} />
    </section>
  );
}

function residencyMobilityText(block, index) {
  const texts = [
    "The review starts by identifying the applicant profile, purpose, destination authority, current location, family or business context, and any timing pressure that may affect the available route.",
    "Passports, IDs, photos, certificates, company papers, address details, and supporting records are checked together so missing items, formatting issues, and authority-specific requirements are clear before the next step.",
    "Renewal, expiry-sensitive, and status-change cases are mapped around current status, deadlines, dependents, previous submissions, and the practical sequence needed to keep the case moving without avoidable delays.",
  ];
  return texts[index] || block.text;
}

function CorporateBody({ content, detail, navigate }) {
  const blocks = corporateBlocks(detail.blocks);
  return (
    <section className="corporateCommand">
      <header className="commandBrief">
        <div>
          <p className="eyebrow">{content.label}</p>
          <h2>Founder launch file.</h2>
        </div>
        <p>Business setup is organized as a founder decision file: activity, ownership, licensing, bank-facing papers, and connected residency needs are reviewed together.</p>
        <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
          {detail.cta} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </header>
      <div className="commandBoard">
        {blocks.map((block, index) => (
          <article key={block.title}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <h2>{block.title}</h2>
            <p>{block.text}</p>
            <strong>{block.signal}</strong>
          </article>
        ))}
      </div>
      <ChecklistStrip title={content.checklistTitle} items={content.checklist} />
    </section>
  );
}

function corporateBlocks(blocks = []) {
  const signals = ["Activity fit", "Owner readiness", "Launch sequence", "Follow-up file"];
  const texts = blocks.map((block, index) => ({
    title: block.title,
    text:
      [
        "Commercial activity, operating market, shareholder role, and licensing direction are clarified before a setup route is proposed.",
        "Passport, ID, address, authorization, and ownership records are checked together so shareholder requirements are visible early.",
        "Formation steps, licensing conversations, bank-facing papers, and connected residency needs are coordinated as one operating file.",
        "The response explains the missing information, practical next action, and what should be prepared before commitment.",
      ][index] || block.text,
    signal: signals[index] || "Setup input",
  }));

  return texts.length
    ? texts
    : [
        { title: "Business model", text: "Activity, market, ownership, and commercial purpose are clarified before setup guidance.", signal: "Activity fit" },
        { title: "Founder file", text: "Shareholder documents and authorization records are checked for readiness.", signal: "Owner readiness" },
        { title: "Launch path", text: "Licensing, formation, residency, and banking context are kept in one sequence.", signal: "Launch sequence" },
      ];
}

function DocumentBody({ content, detail }) {
  if (detail.iconKey === "translation") return <TranslationDetailBody content={content} detail={detail} />;
  if (detail.iconKey === "legalization") return <LegalizationDetailBody content={content} detail={detail} />;
  if (detail.iconKey === "attestation") return <AttestationDetailBody content={content} detail={detail} />;
  return null;
}

function TranslationDetailBody({ content, detail }) {
  return (
    <section className="translationCompact">
      <header className="translationCompactHead">
        <div>
          <p className="eyebrow">{content.label}</p>
          <h2>Official translation workflow.</h2>
        </div>
        <p>Official translations prepared for authority use.</p>
      </header>

      <div className="translationCardGrid">
        {detail.blocks.map((block, index) => (
          <article key={block.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{block.title}</h2>
            <p>{block.text}</p>
          </article>
        ))}
      </div>

      <div className="translationProcessStrip">
        {content.process.map((item, index) => (
          <span key={item}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            {item}
          </span>
        ))}
      </div>

      <footer className="translationReadyList">
        <h3>{content.checklistTitle}</h3>
        <div>
          {content.checklist.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </footer>
    </section>
  );
}

function LegalizationDetailBody({ content, detail }) {
  return (
    <section className="legalRouteMap">
      <header className="routeMapIntro">
        <div>
          <p className="eyebrow">{content.label}</p>
          <h2>Border-ready documents.</h2>
        </div>
        <p>{content.text}</p>
      </header>
      <div className="routeMapCanvas">
        {detail.blocks.map((block, index) => (
          <article key={block.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{block.title}</h2>
              <p>{block.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="routeMapFooter">
        <InsightPanel title="Route sequence" items={content.process} tone="route" />
        <InsightPanel title="Document situations" items={content.situations} tone="case" />
      </div>
    </section>
  );
}

function AttestationDetailBody({ content, detail }) {
  return (
    <section className="attestationProtocol">
      <header className="protocolIntro">
        <div>
          <p className="eyebrow">{content.label}</p>
          <h2>Verified record chain.</h2>
        </div>
      </header>
      <div className="protocolRail">
        {detail.blocks.map((block, index) => (
          <article key={block.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{block.title}</h2>
              <p>{block.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="protocolSummary">
        <InsightPanel title="Verification steps" items={content.process} tone="route" />
        <ChecklistStrip title={content.checklistTitle} items={content.checklist} />
      </div>
    </section>
  );
}

function InsightPanel({ items = [], title, tone }) {
  if (!items.length) return null;
  return (
    <aside className={`insightPanel insightPanel-${tone}`}>
      <h3>{title}</h3>
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </aside>
  );
}

function ChecklistStrip({ items, title }) {
  return (
    <div className="checklistStrip">
      <h3>{title}</h3>
      {items.map((item) => (
        <span key={item}>
          <CircleCheck size={16} aria-hidden="true" /> {item}
        </span>
      ))}
    </div>
  );
}

function ResidencyDetailPage({ copy, detail, heroMedia, navigate }) {
  const content = servicePageContent["residency-visa"];

  const caseTypes = [
    { Icon: PlaneLanding, label: "New Application", desc: "First-time residency or visa in the target country or authority." },
    { Icon: FileText, label: "Renewal", desc: "Extending or renewing before the current status expires." },
    { Icon: Home, label: "Family & Dependents", desc: "Sponsor-linked cases for family members or dependents." },
    { Icon: Landmark, label: "Investor Route", desc: "Residency tied to investment, property, or company ownership." },
    { Icon: BriefcaseBusiness, label: "Employment-Linked", desc: "Visa or residency connected to employment or company role." },
  ];

  const stepTexts = [
    "The review starts by identifying the applicant profile, purpose, destination authority, current location, family or business context, and any timing pressure that may affect the available route.",
    "Passports, IDs, photos, certificates, company papers, address details, and supporting records are checked together so missing items, formatting issues, and authority-specific requirements are visible before the next step.",
    "Renewal, expiry-sensitive, and status-change cases are mapped around current status, deadlines, dependents, previous submissions, and the practical sequence needed to keep the case moving.",
  ];

  return (
    <>
      <section className="rvHero">
        <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="rvHeroVeil" aria-hidden="true" />
        <div className="rvHeroInner">
          <div className="rvHeroCopy">
            <p className="eyebrow">{detail.eyebrow}</p>
            <h1>{detail.title}</h1>
            <p className="rvHeroLead">{detail.lead}</p>
            <button className="primaryButton" type="button" onClick={() => navigate("/contact")}>
              {detail.cta} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
          <aside className="rvHeroPanel" aria-label="Service coverage">
            <p className="rvHeroPanelLabel">What this desk covers</p>
            {content.situations.map((item) => (
              <span key={item}>
                <CircleCheck size={14} aria-hidden="true" /> {item}
              </span>
            ))}
          </aside>
        </div>
      </section>

      <section className="rvTypes">
        <div className="rvTypesWrap">
          <p className="rvTypesEyebrow">Case types handled</p>
          <div className="rvTypeGrid">
            {caseTypes.map(({ Icon, label, desc }) => (
              <div key={label} className="rvTypeCard">
                <div className="rvTypeIcon"><Icon size={18} aria-hidden="true" /></div>
                <strong>{label}</strong>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rvProcess">
        <div className="rvProcessWrap">
          <aside className="rvCompass">
            <span className="rvCompassLabel">{content.label}</span>
            <h2>{content.title}</h2>
            <p>{content.text}</p>
            <div className="rvCompassChecklist">
              <strong>{content.checklistTitle}</strong>
              {content.checklist.map((item) => (
                <span key={item}>
                  <CircleCheck size={13} aria-hidden="true" /> {item}
                </span>
              ))}
            </div>
          </aside>

          <div className="rvSteps">
            {detail.blocks.map((block, index) => (
              <article key={block.title} className="rvStep">
                <div className="rvStepNum">{String(index + 1).padStart(2, "0")}</div>
                <div className="rvStepBody">
                  <h2>{block.title}</h2>
                  <p>{stepTexts[index] || block.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rvInsights">
        <div className="rvInsightsWrap">
          <InsightPanel title={content.processTitle} items={content.process} tone="route" />
          <InsightPanel title="Common situations" items={content.situations} tone="case" />
        </div>
      </section>

      <ContactCta copy={copy} navigate={navigate} />
    </>
  );
}

const serviceDetails = [
  {
    id: "residency-visa",
    Icon: PlaneLanding,
    eyebrow: "Residency & Visa",
    title: "Residency, Visa & Mobility Cases",
    lead: "First-time applications, renewals, family sponsorship, investor routes, and employment-linked cases — each prepared with a clear document sequence and authority-specific requirements identified before any step is taken.",
    features: [
      { label: "New Applications", desc: "First-time residency or visa submissions across destination countries and multiple authority types, with requirements mapped from the start." },
      { label: "Renewals & Extensions", desc: "Timed around expiry dates, current status, dependent details, and any previous application history to avoid unnecessary gaps." },
      { label: "Family & Dependents", desc: "Sponsor-linked cases with coordinated document preparation for all family members in one organized sequence." },
      { label: "Investor & Business Routes", desc: "Residency linked to investment thresholds, property ownership, company shareholding, or employment contracts." },
    ],
    included: ["Applicant profile review", "Document completeness check", "Route identification", "Authority requirement mapping", "Timeline and deadline guidance", "Follow-up path clarification"],
    forWhom: ["Individuals", "Families", "Investors", "Business owners", "Employees", "Status-change cases"],
    href: "/residency-visa",
  },
  {
    id: "corporate-setup",
    Icon: BriefcaseBusiness,
    eyebrow: "Corporate Setup",
    title: "Company Formation & Founder Documentation",
    lead: "Business registration across Oman free zones and mainland authorities — from activity classification and shareholder documentation to licensing coordination and residency linkage for founders, investors, and operating teams.",
    features: [
      { label: "Free Zone Formation", desc: "Setup in OMCC, MFC, Salalah Free Zone, Sohar Free Zone, Salalah, and other authorities based on business activity and ownership goals." },
      { label: "Mainland Licensing", desc: "Muscat Municipality commercial licenses with full Oman market access and compatible local ownership structures." },
      { label: "Document Preparation", desc: "Shareholder passports, memorandums, powers of attorney, and activity documentation reviewed together before submission." },
      { label: "Residency Linkage", desc: "Investor and employment visas coordinated alongside company formation so nothing falls between the steps." },
    ],
    included: ["Activity classification", "Jurisdiction selection", "Ownership structure review", "Formation document preparation", "License coordination", "Bank account preparation guidance"],
    forWhom: ["Founders", "Investors", "International companies", "Holding structures", "Operating teams"],
    href: "/corporate-setup",
  },
  {
    id: "translation",
    Icon: Languages,
    eyebrow: "Translation",
    title: "Official & Legal Document Translation",
    lead: "Certified translation for documents submitted to embassies, ministries, courts, banks, and immigration authorities — in Arabic, English, Persian, Turkish, French, and German, reviewed with attestation needs and destination authority in mind.",
    features: [
      { label: "Personal Documents", desc: "Birth, marriage, divorce, education, and identity documents prepared for formal official use with correct formatting." },
      { label: "Legal & Corporate", desc: "Contracts, powers of attorney, corporate records, and court documents translated with context for the destination authority." },
      { label: "Financial Records", desc: "Bank statements, audit reports, invoices, and financial statements handled with the accuracy official submissions require." },
      { label: "Medical & Technical", desc: "Medical records, clinical reports, technical specifications, and compliance documents prepared for regulated environments." },
    ],
    included: ["Document type review", "Language pair confirmation", "Destination authority context", "Certified translation output", "Formatting for authority use", "Attestation coordination"],
    forWhom: ["Individuals", "Law firms", "Companies", "Healthcare providers", "Government entities"],
    href: "/translation",
  },
  {
    id: "legalization",
    Icon: Landmark,
    eyebrow: "Legalization",
    title: "Cross-Border Document Legalization",
    lead: "A practical route for documents that must be accepted outside their issuing country — from notarization through ministry and embassy stamps, with the full chain identified and tracked before any step is committed to.",
    features: [
      { label: "Apostille Documents", desc: "Simplified single-authority stamps for Hague Convention member countries across Europe, Americas, and Asia." },
      { label: "Embassy Legalization", desc: "Full multi-step chain for non-Apostille countries including ministry stamps, foreign affairs certification, and embassy authentication." },
      { label: "Source Country Tracking", desc: "Documents from any origin country traced through their local legalization chain without losing the thread." },
      { label: "Multi-Destination Preparation", desc: "The same document prepared simultaneously for use in multiple countries where the chain allows it." },
    ],
    included: ["Source country identification", "Legalization chain mapping", "Notarization coordination", "Ministry submission", "Embassy stamping", "Real-time status tracking"],
    forWhom: ["Relocating individuals", "Expanding businesses", "Legal professionals", "Academic institutions"],
    href: "/legalization",
  },
  {
    id: "attestation",
    Icon: Stamp,
    eyebrow: "Attestation",
    title: "Document Attestation Coordination",
    lead: "Attestation for education, civil, and corporate documents — managing the notary, ministry, and embassy chain with your deadline, translation need, and destination use case kept visible at every stage.",
    features: [
      { label: "Education Certificates", desc: "Degrees, diplomas, and transcripts prepared for foreign authority submission, employment use, or academic recognition." },
      { label: "Civil Documents", desc: "Birth, marriage, death, and family status certificates coordinated for international acceptance with correct sequence." },
      { label: "Corporate Papers", desc: "Commercial licenses, board resolutions, and authorization documents attested for cross-border legal and commercial use." },
      { label: "Identity Documents", desc: "Passports, national IDs, and official identity records processed with authority submission requirements confirmed first." },
    ],
    included: ["Document type classification", "Authority chain identification", "Notary coordination", "Translation linkage", "Embassy submission", "Completion confirmation"],
    forWhom: ["Job seekers", "Students abroad", "Companies", "Relocating individuals", "Healthcare workers"],
    href: "/attestation",
  },
];

function VisaServicesPage({ navigate }) {
  const [activeService, setActiveService] = useState("residency-visa");

  useEffect(() => {
    const sections = serviceDetails
      .map(({ id }) => document.getElementById(`service-section-${id}`))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveService(visibleSection.target.dataset.serviceId);
        }
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function scrollToService(id) {
    setActiveService(id);
    document.getElementById(`service-section-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <section className="vsvcHero">
        <div className="vsvcHeroInner">
          <div className="vsvcHeroCopy">
            <p className="vsvcHeroEyebrow">Our Services</p>
            <h1 className="vsvcHeroTitle">Everything You Need,<br />In One <em className="vsvcHeroAccent">Coordinated</em> Path.</h1>
            <p className="vsvcHeroLead">From residency and visas to business setup, translation, and document legalization — we handle every detail so you can focus on what matters most.</p>
            <div className="vsvcHeroActions">
              <button className="vsvcBtnPrimary" type="button" onClick={() => document.querySelector(".vsvcSection")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Services <ArrowRight size={14} aria-hidden="true" />
              </button>
              <button className="vsvcBtnSecondary" type="button" onClick={() => navigate("/contact")}>
                Get Consultation <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="vsvcHeroTrust">
              <div className="vsvcTrustItem">
                <strong>10+</strong>
                <span>Years Experience</span>
              </div>
              <div className="vsvcTrustDivider" aria-hidden="true" />
              <div className="vsvcTrustItem">
                <strong>1,000+</strong>
                <span>Applications Assisted</span>
              </div>
              <div className="vsvcTrustDivider" aria-hidden="true" />
              <div className="vsvcTrustItem">
                <strong>Multi-Country</strong>
                <span>Expertise</span>
              </div>
            </div>
          </div>

          <div className="vsvcHeroVisual" aria-hidden="true">
            <div className="vsvcVisualOrbit vsvcVisualOrbit-1" />
            <div className="vsvcVisualOrbit vsvcVisualOrbit-2" />
            <div className="vsvcVisualOrbit vsvcVisualOrbit-3" />
            <div className="vsvcVisualGlow" />
            <div className="vsvcPassportDoc">
              <div className="vsvcStamp">
                <span>VISA</span>
                <span>APPROVED</span>
              </div>
              <div className="vsvcDocLines">
                <div /><div /><div /><div />
              </div>
            </div>
            <div className="vsvcPassport">
              <div className="vsvcPassportInner">
                <div className="vsvcPassportTop">
                  <span className="vsvcPassportCountry">International</span>
                  <div className="vsvcPassportEmblem">⬡</div>
                  <span className="vsvcPassportWord">Passport</span>
                </div>
                <div className="vsvcPassportChip" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service detail tabs ── */}
      <section className="svtabSection vsvcSection">
        <div className="svtabWrap">
          <div className="svtabIntro">
            <p className="svtabEyebrow">What We Handle</p>
            <h2 className="svtabTitle">Five service areas, one coordinated team.</h2>
            <p className="svtabLead">Each service is handled end-to-end — from first document review to final submission. No handoffs to third parties, no information lost between teams.</p>
          </div>

          <div className="svtabInterface">
            <nav className="svtabNav" aria-label="Service categories">
              {serviceDetails.map(({ id, Icon, eyebrow }) => (
                <button
                  key={id}
                  className={`svtabBtn${activeService === id ? " svtabBtnActive" : ""}`}
                  onClick={() => scrollToService(id)}
                  type="button"
                  aria-pressed={activeService === id}
                >
                  <div className="svtabBtnIcon"><Icon size={17} aria-hidden="true" /></div>
                  <span className="svtabBtnLabel">{eyebrow}</span>
                  <ChevronRight size={13} className="svtabBtnArrow" aria-hidden="true" />
                </button>
              ))}
            </nav>

            <div className="svtabPanels">
              {serviceDetails.map((service) => (
                <article
                  className="svtabPanel"
                  data-service-id={service.id}
                  id={`service-section-${service.id}`}
                  key={service.id}
                >
                  <div className="svtabPanelHeader">
                    <div className="svtabPanelIcon"><service.Icon size={22} aria-hidden="true" /></div>
                    <div>
                      <p className="svtabPanelEyebrow">{service.eyebrow}</p>
                      <h2 className="svtabPanelTitle">{service.title}</h2>
                    </div>
                  </div>

                  <p className="svtabPanelLead">{service.lead}</p>

                  <div className="svtabFeatures">
                    {service.features.map(({ label, desc }) => (
                      <div key={label} className="svtabFeature">
                        <strong>{label}</strong>
                        <p>{desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="svtabBottom">
                    <div className="svtabIncluded">
                      <p className="svtabSubLabel">What&rsquo;s included</p>
                      <ul>
                        {service.included.map((item) => (
                          <li key={item}>
                            <CircleCheck size={12} aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="svtabForWhom">
                      <p className="svtabSubLabel">Who this is for</p>
                      <div className="svtabPills">
                        {service.forWhom.map((who) => (
                          <span key={who} className="svtabPill">{who}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="svtabPanelCta" type="button" onClick={() => navigate(service.href)}>
                    Full service details <ArrowRight size={13} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="svprocSection">
        <div className="svprocWrap">
          <div className="svprocIntro">
            <p className="svprocEyebrow">How It Works</p>
            <h2 className="svprocTitle">From first message to case completion.</h2>
            <p className="svprocLead">The process is straightforward by design — no unnecessary back-and-forth, no ambiguity about what comes next.</p>
          </div>
          <div className="svprocSteps">
            {[
              { n: "01", title: "Send an inquiry", desc: "Share the document type, country, authority, and goal. A rough description is enough — the team will ask the right questions to fill in what is needed." },
              { n: "02", title: "Document review", desc: "Your documents, applicable authority requirements, and realistic timelines are reviewed together before any commitment is made or step is taken." },
              { n: "03", title: "Coordinated preparation", desc: "Translation, legalization, attestation, and filing are handled in one track. Nothing is siloed to a separate team or sent to a third party without review." },
              { n: "04", title: "Submission & follow-up", desc: "The case moves to the authority with all required documentation prepared correctly. Status and next steps are communicated clearly throughout." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="svprocStep">
                <span className="svprocNum">{n}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

const serviceDetailContent = {
  "residency-visa": {
    promise: "A guided file path for people who need clarity before submitting a visa, renewal, or residency case.",
    overview: "This service starts by separating the applicant profile, status, destination authority, family details, and deadline. The goal is to identify the right route before documents are translated, attested, or submitted.",
    outcomes: ["Clear case route", "Document gap list", "Deadline-aware sequence"],
    process: [
      ["Profile review", "Nationality, current status, sponsor details, dependents, and intended route are reviewed together."],
      ["Requirement map", "The authority path is translated into a practical checklist with timing and supporting files."],
      ["File preparation", "Identity, civil, corporate, and supporting records are organized before submission."],
      ["Submission support", "The case moves forward with next steps and follow-up points kept visible."],
    ],
    documents: ["Passport and ID copies", "Current visa or status proof", "Photos and civil certificates", "Sponsor or company documents", "Deadline or authority instructions"],
    bestFor: ["New Oman residency applications", "Visa renewals and extensions", "Family sponsorship files", "Investor or employment-linked routes"],
  },
  "corporate-setup": {
    promise: "Company setup coordinated with founder documents, licensing choices, and residency planning in one track.",
    overview: "Corporate setup is handled as a business and mobility file, not just a license form. Activity, jurisdiction, shareholder documents, signing authority, and visa linkage are reviewed before the setup route is selected.",
    outcomes: ["Jurisdiction direction", "Founder document plan", "License-ready file"],
    process: [
      ["Business intake", "Activity, ownership, location, banking goals, and operating needs are gathered first."],
      ["Structure review", "Free zone, mainland, shareholder, and management options are compared against the business goal."],
      ["Document build", "Passports, powers of attorney, corporate records, and translations are prepared in order."],
      ["Formation coordination", "Licensing, registration, and connected residency requirements are kept aligned."],
    ],
    documents: ["Shareholder passports", "Proposed activity details", "Company name options", "Address and contact details", "Corporate records for entity shareholders"],
    bestFor: ["New founders", "Foreign shareholders", "Holding structures", "Teams needing residency after setup"],
  },
  translation: {
    promise: "Official translations prepared around the authority that will receive the document.",
    overview: "Translation quality is not only language accuracy. The receiving authority, document format, names, dates, stamps, and certification route all matter. This service prepares translations with destination use in mind.",
    outcomes: ["Authority-ready wording", "Consistent names and dates", "Translation plus attestation path"],
    process: [
      ["Document review", "The source file, language pair, seals, and receiving authority are checked before translation starts."],
      ["Terminology control", "Legal, civil, corporate, and technical terms are translated with context."],
      ["Certification prep", "Formatting, certification, and any required supporting copies are prepared for formal use."],
      ["Linked services", "If attestation or legalization is needed, the translation is aligned with that sequence."],
    ],
    documents: ["Clear scan of the source document", "Destination authority name", "Required language pair", "Existing stamps or notarization", "Submission deadline"],
    bestFor: ["Immigration files", "Embassy submissions", "Court or legal documents", "Corporate and financial records"],
  },
  legalization: {
    promise: "Cross-border document recognition mapped from issuing country to destination authority.",
    overview: "Legalization depends on where a document was issued, where it will be used, and the exact authority receiving it. This service maps the chain before the document enters the process.",
    outcomes: ["Country-specific chain", "Embassy or Apostille route", "Tracked document movement"],
    process: [
      ["Route confirmation", "Issuing country, destination country, document type, and intended use are confirmed."],
      ["Chain mapping", "Notary, ministry, foreign affairs, embassy, or Apostille steps are ordered correctly."],
      ["Document movement", "The file is prepared and moved through each required authority."],
      ["Final readiness", "Completed stamps, translations, and supporting copies are checked before delivery."],
    ],
    documents: ["Original or certified copy", "Issuing country details", "Destination country and authority", "Translation requirements", "Any previous stamps"],
    bestFor: ["International relocation", "Company expansion", "Foreign court or bank use", "Education or civil documents abroad"],
  },
  attestation: {
    promise: "Attestation handled as a controlled chain, with translation and destination use kept in view.",
    overview: "Attestation confirms signatures, seals, and issuing authorities. The correct sequence depends on document type, country, and purpose, so the chain is reviewed before any step begins.",
    outcomes: ["Correct authority order", "Reduced rejection risk", "Completion confirmation"],
    process: [
      ["Document classification", "Civil, educational, corporate, identity, or legal documents are classified by use case."],
      ["Authority sequence", "Notary, ministry, embassy, and foreign affairs steps are placed in the correct order."],
      ["Translation link", "If certified translation is required, it is coordinated at the right stage."],
      ["Completion check", "Final stamps and document condition are reviewed before return or next submission."],
    ],
    documents: ["Original certificate or corporate paper", "Passport or applicant details", "Destination authority instructions", "Existing translations", "Deadline and use case"],
    bestFor: ["Employment abroad", "University applications", "Family residency files", "Corporate authorization documents"],
  },
};

function PremiumServiceDetailPage({ copy, navigate, service }) {
  const detail = serviceDetailContent[service.id] || serviceDetailContent["residency-visa"];
  const Icon = service.Icon;

  return (
    <div className="svcDetailPage">
      <section className="svcDetailHero">
        <div className="svcDetailHeroInner">
          <div className="svcDetailHeroGrid">
            <div className="svcDetailHeroCopy">
              <p className="svcDetailEyebrow">{service.eyebrow}</p>
              <h1>{service.title}</h1>
              <p>{detail.promise}</p>
            </div>
            <aside className="svcDetailHeroCard" aria-label={`${service.eyebrow} summary`}>
              <span><Icon size={24} aria-hidden="true" /></span>
              <h2>Service outcome</h2>
              <div>
                {detail.outcomes.map((item) => <strong key={item}>{item}</strong>)}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="svcDetailMain">
        <div className="svcDetailMainInner">
          <article className="svcDetailOverview">
            <p className="svcDetailKicker">Overview</p>
            <h2>Designed for files where the details matter.</h2>
            <p>{detail.overview}</p>
          </article>

          <div className="svcDetailFeatureGrid">
            {service.features.map(({ label, desc }) => (
              <article key={label}>
                <span><CircleCheck size={16} aria-hidden="true" /></span>
                <h3>{label}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>

          <div className="svcDetailSplit">
            <section className="svcDetailProcess">
              <p className="svcDetailKicker">How it works</p>
              <h2>A clear path from intake to next step.</h2>
              <div>
                {detail.process.map(([title, text], index) => (
                  <article key={title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="svcDetailAside">
              <div>
                <p className="svcDetailKicker">Prepare first</p>
                {detail.documents.map((item) => <span key={item}><FileText size={15} aria-hidden="true" /> {item}</span>)}
              </div>
              <div>
                <p className="svcDetailKicker">Best for</p>
                <div className="svcDetailPills">
                  {detail.bestFor.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </aside>
          </div>

          <section className="svcDetailCta">
            <div>
              <p className="svcDetailKicker">Next step</p>
              <h2>Send the case details and we will route the file correctly.</h2>
              <p>{copy.ctaText}</p>
            </div>
            <button type="button" onClick={() => navigate("/contact")}>
              {copy.contactUs} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </section>
        </div>
      </section>
    </div>
  );
}

const visaFaqSections = [
  {
    category: "Residency & Visa",
    items: [
      {
        q: "What types of residency and visa cases do you handle?",
        a: "The desk covers new residency applications, visa renewals, expiry-sensitive cases, family and dependent files, investor routes, employment-linked residency, and status-change requests. Each case is reviewed individually before any document path is recommended.",
      },
      {
        q: "Which countries do you work with?",
        a: "The primary focus is Oman residency and visa processes, including Muscat, Nizwa, and Salalah authorities. The team also handles cross-border cases involving other GCC countries, European authorities, and cases that connect an overseas issuing country with a Oman destination.",
      },
      {
        q: "How do I start a residency or visa inquiry?",
        a: "Submit a contact message that includes your nationality, current location, target country or authority, current visa or residency status, and the goal of the application. If family or dependent details are relevant, include those as well. The more context you provide, the more specific the initial guidance can be.",
      },
      {
        q: "Can you help with renewals and expiring documents?",
        a: "Yes. Renewal cases are handled as a separate intake category. Share the expiry date or upcoming deadline, current status, and any changes since the last application. Timing is reviewed as part of the case assessment.",
      },
      {
        q: "What is the difference between a visa and residency support case?",
        a: "A visa case typically covers entry permission tied to a specific purpose and duration. Residency support involves longer-term status, document requirements specific to a local authority, and often connects to employment, property ownership, or company structure. Both are handled here but reviewed through different intake paths.",
      },
    ],
  },
  {
    category: "Translation",
    items: [
      {
        q: "What documents can be translated?",
        a: "The translation service covers civil certificates (birth, marriage, death, divorce), passports and identity documents, powers of attorney, contracts, corporate documents, court papers, educational certificates, and commercial files. The document type, issuing country, and destination authority are reviewed before translation begins.",
      },
      {
        q: "How is the target authority taken into account?",
        a: "Translation is not treated as a generic language task. The destination authority — whether an embassy, immigration office, ministry, notary, court, or bank — shapes how the translation must be formatted, certified, and whether attestation is required alongside it.",
      },
      {
        q: "Do I need to send original documents?",
        a: "In most cases, a clear scan or high-resolution image is sufficient to begin. Whether the original is required depends on the authority's acceptance standards and whether a certified or notarised copy is acceptable. This is confirmed during the initial document review.",
      },
      {
        q: "Can you handle urgent translation requests?",
        a: "Urgent cases are accepted depending on document type and language pair. Share the document, the destination authority, and the specific deadline so the team can confirm whether the timeline is achievable and what may affect it.",
      },
    ],
  },
  {
    category: "Legalization & Attestation",
    items: [
      {
        q: "What is the difference between legalization and attestation?",
        a: "Attestation involves a formal chain of verification — notary, ministry, embassy, foreign affairs — confirming that a signature or seal is genuine. Legalization is the broader process of making a document valid for use in another country, which may include attestation steps as well as Apostille or consular endorsement depending on the countries involved.",
      },
      {
        q: "How do I know which steps are needed for my document?",
        a: "The required steps depend on the issuing country, the destination country, the document type, and the authority where it will be used. There is no single fixed path. Submit the document details and the intended use, and the team will map the correct sequence.",
      },
      {
        q: "Does my document need to be translated before legalization?",
        a: "In many cases, yes — the destination authority requires a translated version alongside the legalized original. Whether translation must happen before or after legalization depends on the specific authority and country. This is reviewed as part of the document intake.",
      },
      {
        q: "Can you handle documents that were issued in one country and need to be used in another?",
        a: "Yes. Cross-border document paths are a core part of the service. The issuing country and the destination country are both reviewed together, since both sides of the equation affect which steps apply and in which order.",
      },
    ],
  },
  {
    category: "Corporate Setup",
    items: [
      {
        q: "What does corporate setup support cover?",
        a: "The service covers new company formation, activity selection, licensing direction, shareholder document preparation, and connected residency or translation requirements. The goal is to treat business setup and individual mobility as one coordinated process rather than separate tasks.",
      },
      {
        q: "Do you handle both free zone and mainland company formation?",
        a: "Both paths are within scope. The appropriate structure depends on the business activity, ownership requirements, office or address needs, banking expectations, and whether residency for shareholders or employees is part of the plan. These factors are reviewed during intake.",
      },
      {
        q: "Can you help with the documents required for shareholders who are based overseas?",
        a: "Yes. Shareholder documents for non-resident or overseas-based founders are a common part of setup cases. This often involves passport certification, power of attorney, and attestation or legalization of specific documents before they can be used for company registration.",
      },
    ],
  },
  {
    category: "Process & Timing",
    items: [
      {
        q: "How quickly will I receive a response after submitting an inquiry?",
        a: "The team responds to all inquiries during business hours. Response time depends on inquiry complexity and current volume. Submitting a detailed message with the relevant service, country, document type, and timeline helps the team provide a specific and useful first response without back-and-forth.",
      },
      {
        q: "Does submitting an inquiry confirm a booking or engagement?",
        a: "No. An inquiry starts a review conversation. No engagement, timeline, or commitment is confirmed until terms are explicitly agreed between both parties.",
      },
      {
        q: "What information should I include when contacting the team?",
        a: "For residency and visa cases: nationality, current location, target country or authority, current status, and deadline. For document cases: document type, issuing country, language pair, destination authority, and intended use. For company setup: activity, jurisdiction preference, number of shareholders, and connected residency or document needs. The more specific your message, the faster the team can respond with relevant guidance.",
      },
      {
        q: "Is the information I share kept confidential?",
        a: "Yes. Information submitted through the contact form is used solely to review and respond to your request. It is not shared with third parties except where necessary to facilitate the service you have requested, and only with your knowledge.",
      },
    ],
  },
];

const visaFaqCategoryIcons = {
  "Residency & Visa": PlaneLanding,
  Translation: Languages,
  "Legalization & Attestation": Stamp,
  "Corporate Setup": BriefcaseBusiness,
  "Process & Timing": SearchCheck,
};

function VisaBlogPage({ blogIndex, copy, heroMedia, lang, navigate, posts }) {
  const [page, setPage] = useState(1);
  const postsPerPage = 9;
  const pageCount = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const visiblePosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const index = blogIndex || {
    eyebrow: copy.blog,
    title: "Residency & Document Insights",
    lead: "Practical updates about residency routes, visa preparation, official documents, translation, attestation, and cross-border requirements.",
  };

  useEffect(() => setPage(1), [lang, posts.length]);

  function changePage(nextPage) {
    setPage(nextPage);
    window.setTimeout(() => document.getElementById("blog-articles")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  return (
    <>
      <section className="visaBlogHeader" aria-label="Blog and resources hero">
        <video className="visaBlogHeroVideo" autoPlay muted loop playsInline preload="metadata" poster={heroMedia.poster} aria-hidden="true">
          <source src={heroMedia.video} type="video/mp4" />
        </video>
        <div className="visaBlogHeaderInner">
          <div className="visaBlogHeaderCopy">
            <p className="visaBlogEyebrow">{index.eyebrow || "Blog & resources"}</p>
            <h1 className="visaBlogTitle">{index.title}</h1>
            <p className="visaBlogLead">{index.lead}</p>
            <div className="visaBlogHeroActions">
              <button type="button" onClick={() => document.getElementById("blog-articles")?.scrollIntoView({ behavior: "smooth" })}>
                Explore articles <ArrowRight size={17} />
              </button>
              <button type="button" className="secondary" onClick={() => navigate("/services")}>
                Our services <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <div className="visaBlogHeroFeature">
            <span className="visaBlogFeatureLabel">Research desk</span>
            <div className="visaBlogFeatureMeta">
              <span>Residency</span>
              <span>Documents</span>
              <span>Authority Review</span>
            </div>
            <h2>Clear notes for visa, residency, and official document decisions.</h2>
            <p>
              Practical guidance on application timing, required records, translation, attestation,
              legalization, and cross-border file preparation.
            </p>
          </div>
          <div className="visaBlogHeroStats" aria-label="Blog statistics">
            <span><PlaneLanding size={20} aria-hidden="true" /><strong>Residency</strong><small>Visa route explainers</small></span>
            <span><Languages size={20} aria-hidden="true" /><strong>Translation</strong><small>Authority-ready files</small></span>
            <span><Stamp size={20} aria-hidden="true" /><strong>Attestation</strong><small>Cross-border document chains</small></span>
            <span><CircleCheck size={20} aria-hidden="true" /><strong>{posts.length}</strong><small>Published insights</small></span>
          </div>
        </div>
      </section>
      <section className="visaBlogBody" id="blog-articles">
        <div className="visaBlogBodyInner">
          <div className="visaBlogToolbar"><div><span>Latest articles</span><strong>{posts.length} insights</strong></div><small>Page {page} of {pageCount}</small></div>
          {posts.length ? (
            <div className="visaBlogGrid">
              {visiblePosts.map((post) => (
                <article className="visaBlogCard" key={post.slug}>
                  <a
                    className="visaBlogCardMedia"
                    href={post.slug}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(post.slug);
                    }}
                  >
                    <img src={post.imageUrl || brand.logoStacked} alt="" loading="lazy" onError={(event) => { event.currentTarget.src = brand.logoStacked; }} />
                  </a>
                  <div className="visaBlogCardBody">
                    <div className="visaBlogCardMeta">
                      {post.category ? <span className="visaBlogCategory">{post.category}</span> : null}
                      {post.publishedAt ? (
                        <time className="visaBlogDate" dateTime={post.publishedAt}>
                          {formatBlogDate(post.publishedAt, lang)}
                        </time>
                      ) : null}
                    </div>
                    <h2>
                      <a
                        href={post.slug}
                        onClick={(event) => {
                          event.preventDefault();
                          navigate(post.slug);
                        }}
                      >
                        {post.title}
                      </a>
                    </h2>
                    <p>{post.excerpt}</p>
                    <a
                      className="visaBlogReadMore"
                      href={post.slug}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(post.slug);
                      }}
                    >
                      {copy.readMore} <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="visaBlogEmpty">{copy.noBlogPosts}</p>
          )}
          {posts.length > postsPerPage && (
            <nav className="visaBlogPagination" aria-label="Blog pages">
              <button type="button" disabled={page === 1} onClick={() => changePage(page - 1)} aria-label="Previous page"><ChevronLeft size={18} /></button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button type="button" className={page === pageNumber ? "active" : ""} onClick={() => changePage(pageNumber)} aria-current={page === pageNumber ? "page" : undefined} key={pageNumber}>{pageNumber}</button>
              ))}
              <button type="button" disabled={page === pageCount} onClick={() => changePage(page + 1)} aria-label="Next page"><ChevronRight size={18} /></button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

function VisaBlogPostPage({ copy, lang, navigate, post }) {
  const paragraphs = String(post.body || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const coverImage = post.imageUrl || brand.logoStacked;
  const readingMinutes = Math.max(3, Math.ceil(String(post.body || "").split(/\s+/).filter(Boolean).length / 180));

  return (
    <>
      <section className="visaBlogArticleHero">
        <div className="visaBlogArticleHeroInner">
          <div className="visaBlogArticleHeroCopy">
            <button type="button" className="visaBlogBackLink" onClick={() => navigate("/blog")}>
              <ArrowRight size={15} aria-hidden="true" style={{ transform: "rotate(180deg)" }} /> {copy.backToBlog}
            </button>
            <div className="visaBlogArticleMeta">
              {post.category ? <span className="visaBlogCategory">{post.category}</span> : null}
              {post.publishedAt ? (
                <time className="visaBlogDate" dateTime={post.publishedAt}>
                  {copy.publishedOn} {formatBlogDate(post.publishedAt, lang)}
                </time>
              ) : null}
              <span className="visaBlogReadTime">{readingMinutes} min read</span>
            </div>
            <h1>{post.title}</h1>
            {post.excerpt ? <p className="visaBlogArticleLead">{post.excerpt}</p> : null}
          </div>
          <figure className="visaBlogArticleHeroMedia" style={{ backgroundImage: `url("${coverImage}")` }}>
            <figcaption><span>Featured article</span><strong>{post.category || "Visa insights"}</strong></figcaption>
          </figure>
        </div>
      </section>
      <section className="visaBlogArticleBody">
        <div className="visaBlogArticleLayout">
          <article className="visaBlogArticleBodyInner">
            {paragraphs[0] && <p className="articleOpening">{paragraphs[0]}</p>}
            {paragraphs.slice(1).map((paragraph, index) => {
              const paragraphNumber = index + 1;
              const heading = paragraphNumber === 1
                ? "What this means in practice"
                : paragraphNumber === paragraphs.length - 1
                  ? "Before you move forward"
                  : null;
              return (
                <section className="visaBlogTextSection" key={paragraph.slice(0, 48)}>
                  {heading && <h2>{heading}</h2>}
                  <p>{paragraph}</p>
                </section>
              );
            })}
            <div className="visaBlogArticleCta">
              <div><span>Need case-specific guidance?</span><p>Share your country, timeline, and document context with the specialist team.</p></div>
              <button type="button" onClick={() => navigate("/contact")}>Contact the team <ArrowRight size={15} /></button>
            </div>
          </article>
          <aside className="visaBlogArticleAside">
            <p>Article details</p>
            <dl>
              <div><dt>Topic</dt><dd>{post.category || "Visa insights"}</dd></div>
              <div><dt>Reading time</dt><dd>{readingMinutes} minutes</dd></div>
              {post.publishedAt && <div><dt>Published</dt><dd>{formatBlogDate(post.publishedAt, lang)}</dd></div>}
            </dl>
            <button type="button" onClick={() => navigate("/blog")}>Browse all insights</button>
          </aside>
        </div>
      </section>
    </>
  );
}

function VisaFaqPage({ copy, navigate, cmsFaqSections }) {
  const activeSections = cmsFaqSections?.length ? cmsFaqSections : visaFaqSections;
  const questionCount = activeSections.reduce((total, section) => total + section.items.length, 0);

  return (
    <>
      <section className="visaFaqHeader">
        <div className="visaFaqHeaderGrid" aria-hidden="true" />
        <div className="visaFaqHeaderInner">
          <div className="visaFaqHeaderCopy">
            <p className="visaFaqEyebrow">Knowledge desk</p>
            <h1 className="visaFaqTitle">Frequently Asked Questions</h1>
            <p className="visaFaqLead">Answers about residency, visa, translation, legalization, attestation, and corporate setup.</p>
          </div>
          <div className="visaFaqSummary" aria-label={`${questionCount} questions across ${activeSections.length} topics`}>
            <strong>{questionCount}</strong>
            <span>practical answers</span>
            <small>Across {activeSections.length} service topics</small>
          </div>
        </div>
      </section>
      <section className="visaFaqBody">
        <div className="visaFaqBodyInner">
          <div className="visaFaqNavWrap">
            <nav className="visaFaqNav" aria-label="FAQ topics">
              <p>Topics</p>
              {activeSections.map(({ category, items }, sectionIndex) => (
                <a href={`#visa-faq-${sectionIndex + 1}`} key={category}>
                  <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                  <strong>{category}</strong>
                  <small>{items.length}</small>
                </a>
              ))}
            </nav>
          </div>
          <div className="visaFaqSections">
            {activeSections.map(({ category, items }, sectionIndex) => {
              const CategoryIcon = visaFaqCategoryIcons[category] || FileText;
              return (
                <section className="visaFaqSection" id={`visa-faq-${sectionIndex + 1}`} key={category}>
                  <header className="visaFaqCategoryLabel">
                    <span className="visaFaqCategoryIcon" aria-hidden="true">
                      <CategoryIcon size={18} />
                    </span>
                    <div>
                      <h2>{category}</h2>
                      <p>{items.length} questions</p>
                    </div>
                  </header>
                  <div className="visaFaqItems">
                    {items.map(({ q, a }, itemIndex) => (
                      <details className="visaFaqItem" key={q} open={sectionIndex === 0 && itemIndex === 0}>
                        <summary className="visaFaqQ">
                          <span className="visaFaqQIndex">{String(itemIndex + 1).padStart(2, "0")}</span>
                          <span className="visaFaqQText">{q}</span>
                          <ChevronDown size={19} aria-hidden="true" />
                        </summary>
                        <div className="visaFaqA">
                          <p>{a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
      <section className="visaFaqCta">
        <div className="visaFaqCtaInner">
          <div>
            <p className="visaFaqCtaEyebrow">Still have a question?</p>
            <h2>Send the case details and get a clearer next step.</h2>
            <p>Share the country, document type, authority, and timeline so the team can route your request correctly.</p>
          </div>
          <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
            {copy.contactUs} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  );
}

function SupportPage({ copy, navigate, support }) {
  return (
    <>
      <section className="serviceMasthead supportHero">
        <div className="serviceMastheadVeil" aria-hidden="true" />
        <div className="serviceMastheadInner">
          <p className="eyebrow">{copy.support}</p>
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
      <ContactCta copy={copy} navigate={navigate} />
    </>
  );
}

function ContactCta({ copy, navigate }) {
  return <HomeContactCta copy={copy} navigate={navigate} />;
}

function NotFoundPage({ copy, navigate }) {
  return (
    <section className="serviceMasthead supportHero">
      <div className="serviceMastheadVeil" aria-hidden="true" />
      <div className="serviceMastheadInner">
        <p className="eyebrow">{copy.notFound}</p>
        <h1>{copy.notFoundTitle}</h1>
        <p className="lead">{copy.notFoundLead}</p>
        <button type="button" className="primaryButton" onClick={() => navigate("/")}>
          {copy.backHome} <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function ConsultationForm({ copy, handleSubmit, status }) {
  return (
    <form className="consultationForm" onSubmit={handleSubmit}>
      <ContactForm compact copy={copy} handleSubmit={handleSubmit} status={status} selectedService="" />
    </form>
  );
}

function ContactForm({ compact, copy, selectedService = "", status }) {
  return (
    <div className={compact ? "inquiryForm compact" : "inquiryForm"}>
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
        {selectedService ? (
          <input type="hidden" name="service" value={selectedService} />
        ) : (
          <div className="formField">
            <label htmlFor={compact ? "detail-service" : "home-service"}>{copy.service}</label>
            <select id={compact ? "detail-service" : "home-service"} name="service">
              <option value="">{copy.selectService}</option>
              <option value="residency-visa">{copy.residencyVisa}</option>
              <option value="corporate-setup">{copy.corporateSetup}</option>
              <option value="translation">{copy.translation}</option>
              <option value="legalization">{copy.legalization}</option>
              <option value="attestation">{copy.attestation}</option>
            </select>
          </div>
        )}
        <div className="formField">
          <label htmlFor={compact ? "detail-country" : "home-country"}>{copy.countryAuthority}</label>
          <input id={compact ? "detail-country" : "home-country"} name="country" type="text" placeholder={copy.countryPlaceholder} />
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
    </div>
  );
}

function Footer({ brand, copy, footerText, navigate, navItems, siteName, siteUrls: activeSiteUrls = siteUrls }) {
  const mainPages = navItems.filter((item) => item.href !== "/" && !item.href.startsWith("/#"));
  const currentYear = new Date().getFullYear();
  const resolvedFooterText = footerText || copy.footerText;

  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerBrandBlock">
          <span className="footerBrand">
            <img src={brand.logoStacked} alt="" aria-hidden="true" />
            <span>{siteName}</span>
          </span>
          <p className="footerDesc">{resolvedFooterText}</p>
        </div>

        <nav className="footerGroupNav" aria-label="Group websites">
          <span className="footerNavLabel">{copy.footerSites}</span>
          <a href={activeSiteUrls.mainSite}>{copy.group}</a>
          <a href={activeSiteUrls.realEstate}>{copy.realEstate}</a>
          <a href={activeSiteUrls.finance}>{copy.finance}</a>
        </nav>

        <nav className="footerMainNav" aria-label="Main navigation">
          <span className="footerNavLabel">{copy.footerPages}</span>
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
      </div>

      <div className="footerBottom">
        <span>© {currentYear} {siteName}</span>
      </div>
    </footer>
  );
}

export default App;
