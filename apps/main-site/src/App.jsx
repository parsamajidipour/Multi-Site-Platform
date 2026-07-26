import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  Building2,
  ClipboardCheck,
  FileText,
  Globe2,
  Home,
  Languages,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  Target,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { GridPatternCard, GridPatternCardBody } from "@/components/ui/card-with-grid-ellipsis-pattern";
import { TeamShowcase, resolveTeamImage } from "@/components/ui/team";
import { fetchCmsPage, submitInquiry } from "./lib/cmsClient";
import { getFallbackContent, getPageContent } from "./lib/contentAdapter";
import {
  buildAboutPageFallback,
  groupPageHeroCopy,
  homeDefaults,
  pickCms,
  resolveHomeProcessSteps,
  resolveLocalizedHomeText,
  sectionCtaLabel,
  supportHero,
} from "./lib/pageLocaleFallbacks";

function getRuntimeSiteKind() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.startsWith("real-estate.") || hostname.includes("real-estate.example.localhost")) return "real-estate";
    if (hostname.startsWith("finance.")) return "trade";
    if (hostname.startsWith("visa.")) return "residency";
  }
  return import.meta.env.VITE_SITE_KIND || "holding";
}

const site = {
  kind: getRuntimeSiteKind(),
  name: import.meta.env.VITE_SITE_NAME || "REZAEI GLOBAL LLC",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "REZAEI GLOBAL LLC corporate website.",
  publicUrl: import.meta.env.VITE_PUBLIC_URL || "http://localhost",
};

const siteUrls = {
  mainSite: import.meta.env.VITE_MAIN_SITE_URL || "https://example.com",
  realEstate: import.meta.env.VITE_REAL_ESTATE_URL || "https://real-estate.example.com",
  finance: import.meta.env.VITE_FINANCE_URL || "https://finance.example.com",
  visa: import.meta.env.VITE_VISA_URL || "https://visa.example.com",
};

const brand = {
  displayName: "REZAEI GLOBAL LLC",
  logoWide: "/brand/rezaei-global-logo-wide-web.png",
  logoStacked: "/brand/rezaei-global-logo-stacked-web.png",
  color: "#00357f",
};

const heroMedia = {
  holding: {
    video: "/media/hero/main-handshake-hero-20260701.mp4",
    poster: "/brand/rezaei-global-logo-stacked-web.png",
  },
  residency: {
    video: "/media/hero/residency-hero.mp4",
    poster: "/brand/rezaei-global-logo-stacked-web.png",
  },
  realEstate: {
    video: "/media/hero/real-estate-hero.mp4",
    poster: "/brand/rezaei-global-logo-stacked-web.png",
  },
  trade: {
    video: "/media/hero/trade-hero.mp4",
    poster: "/brand/rezaei-global-logo-stacked-web.png",
  },
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

function textOr(value, fallback) {
  const normalized = String(value ?? "").trim();
  return normalized || fallback;
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

const groupSitesByLang = {
  en: [
    { title: "Residency, Visa & Translation", href: siteUrls.visa, text: "Residency, visas, corporate setup, attestation, legalization, and translation services." },
    { title: "Real Estate, Construction & Materials", href: siteUrls.realEstate, text: "Property, construction projects, building materials, and industrial goods supply." },
    { title: "Import, Export & Currency Transfer", href: siteUrls.finance, text: "Trade, shipment coordination, currency transfer, and foreign exchange services." },
  ],
  tr: [
    { title: "Oturum, Vize ve Tercume", href: siteUrls.visa, text: "Oturum, vize, sirket kurulumu, tasdik, legalizasyon ve tercume hizmetleri." },
    { title: "Gayrimenkul, Insaat ve Malzemeler", href: siteUrls.realEstate, text: "Emlak, insaat projeleri, yapi malzemeleri ve endustriyel urun tedariki." },
    { title: "Ithalat, Ihracat ve Doviz Transferi", href: siteUrls.finance, text: "Ticaret, sevkiyat koordinasyonu, para transferi ve doviz hizmetleri." },
  ],
  fa: [
    { title: "اقامت، ویزا و ترجمه", href: siteUrls.visa, text: "خدمات اقامت، ویزا، ثبت شرکت، تایید مدارک، قانونی‌سازی و ترجمه." },
    { title: "املاک، ساخت‌وساز و مصالح", href: siteUrls.realEstate, text: "املاک، پروژه‌های ساختمانی، مصالح ساختمانی و تامین کالاهای صنعتی." },
    { title: "واردات، صادرات و انتقال ارز", href: siteUrls.finance, text: "تجارت، هماهنگی حمل، انتقال ارز و خدمات تبدیل ارز." },
  ],
  ar: [
    { title: "الإقامة والتأشيرة والترجمة", href: siteUrls.visa, text: "خدمات الإقامة والتأشيرات وتأسيس الشركات والتصديق والترجمة." },
    { title: "العقارات والبناء والمواد", href: siteUrls.realEstate, text: "العقارات ومشاريع البناء ومواد البناء وتوريد السلع الصناعية." },
    { title: "الاستيراد والتصدير وتحويل العملات", href: siteUrls.finance, text: "التجارة وتنسيق الشحن وتحويل العملات وخدمات الصرف." },
  ],
};

const businessUnitIcons = [Building2, Truck, FileText];
const structureIcons = [Globe2, ShieldCheck, Building2, BadgeCheck, ClipboardCheck];
const processIcons = [Mail, ClipboardCheck, ArrowRight, BadgeCheck];
const governanceIcons = [ShieldCheck, ClipboardCheck, BadgeCheck, FileText];

const formCopy = {
  en: {
    fullName: "Full Name",
    fullNamePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+968...",
    serviceInterest: "Service Interest",
    selectService: "Select a service area...",
    realEstate: "Real Estate",
    financeTrade: "Finance & Trade",
    residency: "Residency, Visa & Translation",
    general: "General Inquiry",
    country: "Country",
    countryPlaceholder: "Your country",
    message: "Message",
    messagePlaceholder: "Describe the request, timeline, country, and preferred follow-up method.",
    send: "Send message",
    footer: "Connecting clients and partners to the right business unit across property, trade, residency, documents, and group-level opportunities.",
    visitUnit: "Visit unit",
    address: "Muscat, Sultanate of Oman",
    corporateGroup: "Corporate Group",
  },
  tr: {
    fullName: "Ad Soyad",
    fullNamePlaceholder: "Adınız ve soyadınız",
    email: "E-posta",
    emailPlaceholder: "eposta@ornek.com",
    phone: "Telefon / WhatsApp",
    phonePlaceholder: "+968...",
    serviceInterest: "Hizmet Alanı",
    selectService: "Bir hizmet alanı seçin...",
    realEstate: "Gayrimenkul",
    financeTrade: "Finans ve Ticaret",
    residency: "İkamet, Vize ve Tercüme",
    general: "Genel Talep",
    country: "Ülke",
    countryPlaceholder: "Ülkeniz",
    message: "Mesaj",
    messagePlaceholder: "Talebi, zamanlamayı, ülkeyi ve tercih edilen iletişim yolunu açıklayın.",
    send: "Mesaj gönder",
    footer: "Müşterileri ve iş ortaklarını emlak, ticaret, ikamet, belgeler ve grup düzeyindeki fırsatlar için doğru iş birimine bağlar.",
    visitUnit: "Birimi ziyaret et",
    address: "Muscat, Umman Sultanlığı",
    corporateGroup: "Kurumsal Grup",
  },
  fa: {
    fullName: "نام کامل",
    fullNamePlaceholder: "نام کامل شما",
    email: "ایمیل",
    emailPlaceholder: "you@example.com",
    phone: "تلفن / واتساپ",
    phonePlaceholder: "+968...",
    serviceInterest: "حوزه خدمات",
    selectService: "یک حوزه خدمات انتخاب کنید...",
    realEstate: "املاک و مستغلات",
    financeTrade: "مالی و تجارت",
    residency: "اقامت، ویزا و ترجمه",
    general: "درخواست عمومی",
    country: "کشور",
    countryPlaceholder: "کشور شما",
    message: "پیام",
    messagePlaceholder: "درخواست، زمان‌بندی، کشور و روش تماس ترجیحی را توضیح دهید.",
    send: "ارسال پیام",
    footer: "اتصال مشتریان و شرکا به واحد مناسب در حوزه املاک، تجارت، اقامت، اسناد و فرصت‌های سطح گروه.",
    visitUnit: "مشاهده واحد",
    address: "مسقط، سلطنت عُمان",
    corporateGroup: "گروه شرکتی",
  },
  ar: {
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    phone: "الهاتف / واتساب",
    phonePlaceholder: "+968...",
    serviceInterest: "مجال الخدمة",
    selectService: "اختر مجال الخدمة...",
    realEstate: "العقارات",
    financeTrade: "التمويل والتجارة",
    residency: "الإقامة والتأشيرة والترجمة",
    general: "استفسار عام",
    country: "الدولة",
    countryPlaceholder: "دولتك",
    message: "الرسالة",
    messagePlaceholder: "اشرح الطلب والجدول الزمني والدولة وطريقة المتابعة المفضلة.",
    send: "إرسال الرسالة",
    footer: "ربط العملاء والشركاء بوحدة الأعمال المناسبة في العقار والتجارة والإقامة والمستندات والفرص على مستوى المجموعة.",
    visitUnit: "زيارة الوحدة",
    address: "مسقط، سلطنة عُمان",
    corporateGroup: "مجموعة شركات",
  },
};

const holdingHomeNavItems = [
  ["Home", "home", "/"],
  ["Company", "company", "/about"],
  ["Business Units", "business-units", "/#business-units"],
  ["Governance", "governance", "/governance"],
  ["Team", "team", "/team"],
  ["Contact", "contact", "/#contact"],
];

const supportPages = {
  en: [
    ["faq", "/faq", "FAQ", "Frequently asked questions", "Answers about service scope, inquiry handling, multilingual content, subdomain deployment, and next steps for REZAEI GLOBAL LLC websites."],
    ["privacy", "/privacy", "Privacy", "Privacy and data handling", "Information about inquiry form data, contact details, lead handling, and responsible follow-up for website visitors."],
    ["terms", "/terms", "Terms", "Website terms", "General website terms for service information, inquiry submission, content use, and future live deployment."],
  ],
  tr: [
    ["faq", "/faq", "SSS", "Sik sorulan sorular", "Hizmet kapsami, talep yonetimi, cok dilli icerik, subdomain yayini ve sonraki adimlar hakkinda cevaplar."],
    ["privacy", "/privacy", "Gizlilik", "Gizlilik ve veri kullanimi", "Talep formu verileri, iletisim bilgileri, potansiyel musteri takibi ve sorumlu geri donus hakkinda bilgi."],
    ["terms", "/terms", "Kosullar", "Web sitesi kosullari", "Hizmet bilgileri, talep gonderimi, icerik kullanimi ve canli yayin icin genel web sitesi kosullari."],
  ],
  fa: [
    ["faq", "/faq", "پرسش ها", "پرسش های متداول", "پاسخ هایی درباره دامنه خدمات، مدیریت درخواست، محتوای چندزبانه، استقرار ساب دامنه و مراحل بعدی."],
    ["privacy", "/privacy", "حریم خصوصی", "حریم خصوصی و مدیریت داده", "اطلاعات مربوط به داده های فرم درخواست، اطلاعات تماس، پیگیری سرنخ و پاسخگویی مسئولانه."],
    ["terms", "/terms", "شرایط", "شرایط وب سایت", "شرایط عمومی وب سایت برای اطلاعات خدمات، ارسال درخواست، استفاده از محتوا و استقرار نهایی."],
  ],
  ar: [
    ["faq", "/faq", "الأسئلة", "الأسئلة الشائعة", "إجابات حول نطاق الخدمات ومعالجة الاستفسارات والمحتوى متعدد اللغات والنشر عبر النطاقات الفرعية."],
    ["privacy", "/privacy", "الخصوصية", "الخصوصية ومعالجة البيانات", "معلومات حول بيانات نماذج الاستفسار وبيانات التواصل ومتابعة العملاء بطريقة مسؤولة."],
    ["terms", "/terms", "الشروط", "شروط الموقع", "شروط عامة لمعلومات الخدمات وإرسال الاستفسارات واستخدام المحتوى والنشر الحي مستقبلا."],
  ],
};

const ui = {
  en: { home: "Home", about: "About", services: "Services", inquiry: "Inquiry", contact: "Contact", pages: "Pages", overview: "Overview", process: "Process", highlights: "Highlights", group: "Group Websites", faq: "FAQ", name: "Name", email: "Email", phone: "Phone", message: "Message", submit: "Send Inquiry", sent: "Inquiry received.", required: "Please complete name and message.", visit: "Visit website", backHome: "Back to home" },
  tr: { home: "Ana Sayfa", about: "Hakkimizda", services: "Hizmetler", inquiry: "Talep", contact: "Iletisim", pages: "Sayfalar", overview: "Genel Bakis", process: "Surec", highlights: "Basliklar", group: "Grup Siteleri", faq: "SSS", name: "Ad", email: "E-posta", phone: "Telefon", message: "Mesaj", submit: "Talep Gonder", sent: "Talep alindi.", required: "Lutfen ad ve mesaj alanlarini doldurun.", visit: "Web sitesine git", backHome: "Ana sayfaya don" },
  fa: { home: "خانه", about: "درباره", services: "خدمات", inquiry: "درخواست", contact: "تماس", pages: "صفحه ها", overview: "معرفی", process: "فرآیند", highlights: "نکات اصلی", group: "وب سایت های گروه", faq: "سوالات متداول", name: "نام", email: "ایمیل", phone: "تلفن", message: "پیام", submit: "ارسال درخواست", sent: "درخواست دریافت شد.", required: "لطفا نام و پیام را وارد کنید.", visit: "مشاهده وب سایت", backHome: "بازگشت به خانه" },
  ar: { home: "الرئيسية", about: "من نحن", services: "الخدمات", inquiry: "استفسار", contact: "تواصل", pages: "الصفحات", overview: "نظرة عامة", process: "الخطوات", highlights: "أبرز النقاط", group: "مواقع المجموعة", faq: "الأسئلة الشائعة", name: "الاسم", email: "البريد", phone: "الهاتف", message: "الرسالة", submit: "إرسال الاستفسار", sent: "تم استلام الاستفسار.", required: "يرجى إدخال الاسم والرسالة.", visit: "زيارة الموقع", backHome: "العودة للرئيسية" },
};

const pageCopy = {
  holding: {
    en: {
      hero: ["Holding Company", "REZAEI GLOBAL LLC", "The central home for the Rezaei business group, connecting clients, partners, and investors to the right service company."],
      pages: [
        ["home", "/", "Home", "Group overview", "A clear introduction to REZAEI GLOBAL LLC, its operating companies, and the services available across the group."],
        ["about", "/about", "Company Overview", "About the holding company", "The company profile, business focus, operating regions, and role of the holding company behind each service platform."],
        ["group", "/how-we-work", "How We Work", "From first message to the right specialist path", "How REZAEI GLOBAL LLC reviews, classifies, routes, and follows up on requests across the group."],
        ["governance", "/governance", "Governance", "Group operating standards", "How the holding company keeps communication, brand standards, and request routing consistent across each business unit."],
        ["contact", "/contact", "Contact", "Corporate and partnership contact", "Send a group-level message for partnerships, investment conversations, or requests that span more than one business unit."],
      ],
      cards: ["Holding company profile", "Connected business units", "Regional client and partner routing", "Corporate contact path"],
      process: ["Understand the business need", "Select the right group company", "Share the request context", "Continue with the relevant team"],
    },
    tr: {
      hero: ["Grup Kurumsal Websitesi", "REZAEI GLOBAL LLC", "Sirketi, grup yapisini, hizmet platformlarini ve uluslararasi musteri talep kanallarini sunan merkezi kurumsal web sitesi."],
      pages: [
        ["home", "/", "Ana Sayfa", "Kurumsal genel bakis", "Sirket tanitimi, grup yapisi ve tum hizmet platformlarina hizli baglantilar."],
        ["about", "/about", "Sirket Genel Bakisi", "REZAEI GLOBAL LLC hakkinda", "Holding sirketi, pazar odagi, hizmet kategorileri ve bolgesel is varligi icin profesyonel profil."],
        ["group", "/how-we-work", "Nasıl Çalışıyoruz", "İlk mesajdan doğru uzman yola", "REZAEI GLOBAL LLC'nin talepleri nasıl incelediğini, sınıflandırdığını, yönlendirdiğini ve takip ettiğini açıklar."],
        ["governance", "/governance", "Yonetim", "Sorumlu operasyon modeli", "Talepler, cok dilli icerik, potansiyel musteri toplama ve subdomain dagitimi icin net yapi."],
        ["contact", "/contact", "Iletisim", "Kurumsal talep", "Grup seviyesinde talep gonderin ve ilgili is alanina yonlendirin."],
      ],
      cards: ["Kurumsal kimlik ve sirket tanitimi", "Subdomain uyumlu grup yapisi", "Manuel EN, TR, FA, AR icerik", "SEO, sitemap, robots ve talep altyapisi"],
      process: ["Ziyaretci ihtiyacini belirle", "Dogru grup sitesine yonlendir", "Talep detaylarini al", "Ilgili hizmet ekibi takip etsin"],
    },
    fa: {
      hero: ["وب سایت شرکتی گروه", "REZAEI GLOBAL LLC", "وب سایت مرکزی برای معرفی شرکت، ساختار گروه، پلتفرم های خدماتی و مسیرهای دریافت درخواست از مشتریان بین المللی."],
      pages: [
        ["home", "/", "خانه", "معرفی شرکتی", "معرفی شرکت، ساختار گروه و لینک سریع به همه پلتفرم های خدماتی."],
        ["about", "/about", "معرفی شرکت", "درباره REZAEI GLOBAL LLC", "پروفایل حرفه ای هلدینگ، حوزه های بازار، دسته های خدمات و حضور منطقه ای."],
        ["group", "/how-we-work", "نحوه کار ما", "از پیام اول تا مسیر تخصصی درست", "نحوه بررسی، دسته‌بندی، مسیریابی و پیگیری درخواست‌ها در REZAEI GLOBAL LLC."],
        ["governance", "/governance", "مدیریت", "مدل عملیاتی شفاف", "ساختار روشن برای درخواست ها، محتوای چندزبانه، جذب سرنخ و استقرار روی ساب دامنه."],
        ["contact", "/contact", "تماس", "درخواست شرکتی", "درخواست سطح گروه را ارسال کنید تا به بخش مناسب هدایت شود."],
      ],
      cards: ["هویت شرکتی و معرفی شرکت", "ساختار آماده برای ساب دامنه", "محتوای دستی انگلیسی، ترکی، فارسی و عربی", "پایه SEO، نقشه سایت، robots و فرم درخواست"],
      process: ["تشخیص نیاز بازدیدکننده", "هدایت به سایت مناسب گروه", "ثبت جزئیات درخواست", "پیگیری توسط تیم مربوطه"],
    },
    ar: {
      hero: ["الموقع المؤسسي للمجموعة", "REZAEI GLOBAL LLC", "موقع مركزي للتعريف بالشركة وهيكل المجموعة ومنصات الخدمات وقنوات الاستفسار للعملاء الدوليين."],
      pages: [
        ["home", "/", "الرئيسية", "نظرة مؤسسية", "تعريف الشركة وهيكل المجموعة وروابط سريعة لكل منصات الخدمات."],
        ["about", "/about", "نبذة عن الشركة", "حول REZAEI GLOBAL LLC", "ملف مهني للشركة القابضة وتركيز السوق وفئات الخدمات والحضور الإقليمي."],
        ["group", "/how-we-work", "كيف نعمل", "من الرسالة الأولى إلى المسار المتخصص الصحيح", "كيف تراجع REZAEI GLOBAL LLC الطلبات وتصنفها وتوجهها وتتابعها عبر المجموعة."],
        ["governance", "/governance", "الحوكمة", "نموذج تشغيل واضح", "هيكل للاستفسارات والمحتوى متعدد اللغات وجمع العملاء والنشر عبر النطاقات الفرعية."],
        ["contact", "/contact", "تواصل", "استفسار مؤسسي", "أرسل طلبا على مستوى المجموعة ليتم توجيهه إلى القسم المناسب."],
      ],
      cards: ["هوية مؤسسية وتعريف بالشركة", "هيكل جاهز للنطاقات الفرعية", "محتوى يدوي بالإنجليزية والتركية والفارسية والعربية", "أساس SEO وخريطة الموقع وrobots ونماذج الاستفسار"],
      process: ["فهم حاجة الزائر", "توجيهه إلى الموقع المناسب", "جمع تفاصيل الاستفسار", "متابعة من الفريق المختص"],
    },
  },
  residency: {
    en: {
      hero: ["Residency, Visa & Translation Services", "Residency, visa, corporate setup, and official translation support", "A complete service website for business setup, residency and visa processing, legalization, attestation, and official document translation."],
      pages: [
        ["home", "/", "Home", "Service overview", "Multilingual service introduction with inquiry paths for individuals, investors, and companies."],
        ["corporate-setup", "/corporate-setup", "Corporate Setup", "Business consultancy and setup", "Company formation guidance, business consultancy, document preparation, and coordination support."],
        ["residency-visa", "/residency-visa", "Residency & Visa", "Residency and visa processing", "Structured inquiry flow for residency, visa solutions, renewal support, and case preparation."],
        ["legalization", "/legalization", "Legalization", "Attestation and legalization", "Document legalization, attestation support, official coordination, and status follow-up."],
        ["translation", "/translation", "Translation", "Official and business translation", "Translation service pages for official, legal, commercial, and business documents."],
        ["contact", "/contact", "Contact", "Start a service request", "Send details for residency, visa, translation, corporate setup, or attestation support."],
      ],
      cards: ["Residency and visa inquiry forms", "Translation service pages", "Legalization and attestation support", "Business setup and consultancy"],
      process: ["Send inquiry", "Review documents", "Confirm service path", "Coordinate and follow up"],
    },
    tr: {
      hero: ["Oturum, Vize ve Tercume Hizmetleri", "Oturum, vize, sirket kurulumu ve resmi tercume destegi", "Sirket kurulumu, oturum ve vize islemleri, tasdik, legalizasyon ve resmi belge tercumesi icin tam hizmet sitesi."],
      pages: [
        ["home", "/", "Ana Sayfa", "Hizmet genel bakisi", "Bireyler, yatirimcilar ve sirketler icin cok dilli hizmet tanitimi ve talep yollari."],
        ["corporate-setup", "/corporate-setup", "Sirket Kurulumu", "Is danismanligi ve kurulum", "Sirket kurulus rehberligi, is danismanligi, belge hazirlama ve koordinasyon destegi."],
        ["residency-visa", "/residency-visa", "Oturum & Vize", "Oturum ve vize islemleri", "Oturum, vize cozumleri, yenileme destegi ve dosya hazirligi icin yapi."],
        ["legalization", "/legalization", "Legalizasyon", "Tasdik ve legalizasyon", "Belge tasdiki, resmi koordinasyon ve durum takibi."],
        ["translation", "/translation", "Tercume", "Resmi ve ticari tercume", "Resmi, hukuki, ticari ve is belgeleri icin tercume sayfalari."],
        ["contact", "/contact", "Iletisim", "Hizmet talebi baslat", "Oturum, vize, tercume, sirket kurulumu veya tasdik destegi icin bilgi gonderin."],
      ],
      cards: ["Oturum ve vize talep formlari", "Tercume hizmet sayfalari", "Tasdik ve legalizasyon destegi", "Sirket kurulumu ve danismanlik"],
      process: ["Talep gonder", "Belgeleri incele", "Hizmet yolunu onayla", "Koordine et ve takip et"],
    },
    fa: {
      hero: ["خدمات اقامت، ویزا و ترجمه", "پشتیبانی اقامت، ویزا، ثبت شرکت و ترجمه رسمی", "وب سایت کامل برای ثبت شرکت، اقامت و ویزا، قانونی سازی، تایید مدارک و ترجمه رسمی اسناد."],
      pages: [
        ["home", "/", "خانه", "معرفی خدمات", "معرفی چندزبانه خدمات و مسیر درخواست برای افراد، سرمایه گذاران و شرکت ها."],
        ["corporate-setup", "/corporate-setup", "ثبت شرکت", "مشاوره و راه اندازی کسب و کار", "راهنمای ثبت شرکت، مشاوره تجاری، آماده سازی مدارک و هماهنگی."],
        ["residency-visa", "/residency-visa", "اقامت و ویزا", "پردازش اقامت و ویزا", "مسیر درخواست برای اقامت، راهکارهای ویزا، تمدید و آماده سازی پرونده."],
        ["legalization", "/legalization", "قانونی سازی", "تایید و قانونی سازی", "پشتیبانی تایید مدارک، هماهنگی رسمی و پیگیری وضعیت."],
        ["translation", "/translation", "ترجمه", "ترجمه رسمی و تجاری", "صفحات ترجمه برای اسناد رسمی، حقوقی، تجاری و کسب و کار."],
        ["contact", "/contact", "تماس", "شروع درخواست خدمات", "جزئیات را برای اقامت، ویزا، ترجمه، ثبت شرکت یا تایید مدارک ارسال کنید."],
      ],
      cards: ["فرم های درخواست اقامت و ویزا", "صفحات خدمات ترجمه", "پشتیبانی تایید و قانونی سازی", "ثبت شرکت و مشاوره"],
      process: ["ارسال درخواست", "بررسی مدارک", "تایید مسیر خدمات", "هماهنگی و پیگیری"],
    },
    ar: {
      hero: ["خدمات الإقامة والتأشيرات والترجمة", "دعم الإقامة والتأشيرات وتأسيس الشركات والترجمة الرسمية", "موقع خدمات متكامل لتأسيس الشركات ومعاملات الإقامة والتأشيرات والتصديق والترجمة الرسمية."],
      pages: [
        ["home", "/", "الرئيسية", "نظرة على الخدمات", "تعريف متعدد اللغات ومسارات استفسار للأفراد والمستثمرين والشركات."],
        ["corporate-setup", "/corporate-setup", "تأسيس الشركات", "استشارات وتأسيس الأعمال", "إرشاد تأسيس الشركات والاستشارات وتجهيز المستندات والتنسيق."],
        ["residency-visa", "/residency-visa", "الإقامة والتأشيرات", "معاملات الإقامة والتأشيرة", "مسار واضح للاستفسارات والتجديد وإعداد الملفات."],
        ["legalization", "/legalization", "التصديق", "التصديق والتقنين", "دعم تصديق المستندات والتنسيق الرسمي ومتابعة الحالة."],
        ["translation", "/translation", "الترجمة", "الترجمة الرسمية والتجارية", "صفحات ترجمة للمستندات الرسمية والقانونية والتجارية."],
        ["contact", "/contact", "تواصل", "ابدأ طلب خدمة", "أرسل التفاصيل لخدمات الإقامة أو التأشيرة أو الترجمة أو التأسيس أو التصديق."],
      ],
      cards: ["نماذج إقامة وتأشيرات", "صفحات خدمات الترجمة", "دعم التصديق والتقنين", "تأسيس الشركات والاستشارات"],
      process: ["إرسال الاستفسار", "مراجعة المستندات", "تأكيد مسار الخدمة", "التنسيق والمتابعة"],
    },
  },
  realEstate: {
    en: {
      hero: ["Real Estate, Construction & Building Materials", "Property, development, construction, and supply services", "A professional website for property listings, project showcases, construction services, building materials, and industrial goods."],
      pages: [
        ["home", "/", "Home", "Sector overview", "A complete platform for property, construction, development, materials, and quotation requests."],
        ["properties", "/properties", "Properties", "Property listings and services", "Dedicated space for future property listings, investor inquiries, buyer leads, and real estate service content."],
        ["projects", "/projects", "Projects", "Construction and development showcase", "Project presentation pages for development work, construction capability, and portfolio highlights."],
        ["materials", "/materials", "Building Materials", "Materials and industrial goods", "Supply pages for building materials, industrial products, quotation requests, and procurement inquiries."],
        ["quotation", "/quotation", "Quotation", "Inquiry and quotation system", "Lead capture for property inquiries, contractor requests, material supply, and project quotation needs."],
        ["contact", "/contact", "Contact", "Speak with the team", "Route inquiries to property, construction, development, or materials support."],
      ],
      cards: ["Property and project showcase pages", "Building materials and industrial goods", "Inquiry and quotation request system", "Lead generation tools"],
      process: ["Select property or material need", "Submit inquiry or quotation request", "Review requirements", "Follow up with proposal"],
    },
    tr: {
      hero: ["Gayrimenkul, Insaat ve Yapi Malzemeleri", "Emlak, gelistirme, insaat ve tedarik hizmetleri", "Emlak ilanlari, proje vitrinleri, insaat hizmetleri, yapi malzemeleri ve endustriyel urunler icin profesyonel site."],
      pages: [
        ["home", "/", "Ana Sayfa", "Sektor genel bakisi", "Emlak, insaat, gelistirme, malzeme ve teklif talepleri icin tam platform."],
        ["properties", "/properties", "Emlak", "Emlak ilanlari ve hizmetleri", "Gelecek emlak ilanlari, yatirimci talepleri, alici potansiyelleri ve emlak hizmet icerigi."],
        ["projects", "/projects", "Projeler", "Insaat ve gelistirme vitrini", "Gelistirme calismalari, insaat kabiliyeti ve portfoy basliklari icin proje sayfalari."],
        ["materials", "/materials", "Yapi Malzemeleri", "Malzemeler ve endustriyel urunler", "Yapi malzemeleri, endustriyel urunler, teklif ve tedarik talepleri."],
        ["quotation", "/quotation", "Teklif", "Talep ve teklif sistemi", "Emlak, yuklenici, malzeme ve proje teklif talepleri icin lead toplama."],
        ["contact", "/contact", "Iletisim", "Ekiple gorusun", "Talepleri emlak, insaat, gelistirme veya malzeme destegine yonlendirin."],
      ],
      cards: ["Emlak ve proje vitrin sayfalari", "Yapi malzemeleri ve endustriyel urunler", "Talep ve teklif sistemi", "Potansiyel musteri araclari"],
      process: ["Emlak veya malzeme ihtiyacini sec", "Talep veya teklif gonder", "Gereksinimleri incele", "Teklifle takip et"],
    },
    fa: {
      hero: ["املاک، ساخت و ساز و مصالح ساختمانی", "خدمات ملک، توسعه، ساخت و تامین", "وب سایت حرفه ای برای املاک، نمایش پروژه، خدمات ساخت، مصالح ساختمانی و کالاهای صنعتی."],
      pages: [
        ["home", "/", "خانه", "معرفی حوزه", "پلتفرم کامل برای ملک، ساخت، توسعه، مصالح و درخواست قیمت."],
        ["properties", "/properties", "املاک", "فهرست ملک و خدمات", "فضای اختصاصی برای فهرست املاک، درخواست سرمایه گذار، سرنخ خریدار و خدمات ملکی."],
        ["projects", "/projects", "پروژه ها", "نمایش ساخت و توسعه", "صفحات معرفی پروژه برای توسعه، توان ساخت و نمونه کارها."],
        ["materials", "/materials", "مصالح ساختمانی", "مصالح و کالاهای صنعتی", "صفحات تامین مصالح، محصولات صنعتی، درخواست قیمت و خرید."],
        ["quotation", "/quotation", "درخواست قیمت", "سیستم استعلام و قیمت", "جذب سرنخ برای ملک، پیمانکار، تامین مصالح و قیمت پروژه."],
        ["contact", "/contact", "تماس", "ارتباط با تیم", "هدایت درخواست ها به تیم املاک، ساخت، توسعه یا مصالح."],
      ],
      cards: ["صفحات نمایش ملک و پروژه", "مصالح ساختمانی و کالاهای صنعتی", "سیستم درخواست و قیمت", "ابزارهای جذب سرنخ"],
      process: ["انتخاب نیاز ملک یا مصالح", "ارسال درخواست یا قیمت", "بررسی نیازها", "پیگیری با پیشنهاد"],
    },
    ar: {
      hero: ["العقارات والبناء ومواد البناء", "خدمات العقار والتطوير والبناء والتوريد", "موقع مهني للعقارات وعرض المشاريع وخدمات البناء ومواد البناء والسلع الصناعية."],
      pages: [
        ["home", "/", "الرئيسية", "نظرة على القطاع", "منصة كاملة للعقار والبناء والتطوير والمواد وطلبات العروض."],
        ["properties", "/properties", "العقارات", "قوائم وخدمات عقارية", "مساحة لقوائم العقارات واستفسارات المستثمرين والعملاء وخدمات العقار."],
        ["projects", "/projects", "المشاريع", "عرض مشاريع البناء والتطوير", "صفحات لعرض التطوير وقدرات البناء وأبرز الأعمال."],
        ["materials", "/materials", "مواد البناء", "مواد وسلع صناعية", "صفحات توريد مواد البناء والمنتجات الصناعية وطلبات الأسعار والمشتريات."],
        ["quotation", "/quotation", "عرض سعر", "نظام الاستفسار والعروض", "جمع طلبات العقار والمقاولين والمواد وتسعير المشاريع."],
        ["contact", "/contact", "تواصل", "تحدث مع الفريق", "توجيه الاستفسارات إلى العقار أو البناء أو التطوير أو المواد."],
      ],
      cards: ["صفحات عرض العقارات والمشاريع", "مواد البناء والسلع الصناعية", "نظام الاستفسار وطلب السعر", "أدوات توليد العملاء"],
      process: ["اختيار الحاجة", "إرسال الاستفسار أو العرض", "مراجعة المتطلبات", "متابعة بالاقتراح"],
    },
  },
  trade: {
    en: {
      hero: ["Import, Export & Currency Transfer Services", "International trade, shipment coordination, and currency transfer", "A professional website for import, export, international trade, shipment coordination, currency transfer, and foreign exchange services."],
      pages: [
        ["home", "/", "Home", "Trade services overview", "A complete platform for cross-border trade, shipment coordination, currency transfer, and FX service inquiries."],
        ["import-export", "/import-export", "Import & Export", "Import and export operations", "Service pages for sourcing, trade coordination, supplier communication, and export/import inquiries."],
        ["shipping", "/shipping", "Shipping", "International trade and shipment coordination", "Shipment coordination, document follow-up, trade communication, and logistics inquiry support."],
        ["currency-transfer", "/currency-transfer", "Currency Transfer", "Currency transfer services", "Lead capture for currency transfer, payment coordination, and international money movement inquiries."],
        ["foreign-exchange", "/foreign-exchange", "Foreign Exchange", "Foreign exchange service requests", "FX inquiry support with clear lead forms and service explanations for business clients."],
        ["contact", "/contact", "Contact", "Start a trade inquiry", "Send import, export, shipment, currency transfer, or foreign exchange details."],
      ],
      cards: ["Import and export service pages", "International shipment coordination", "Currency transfer inquiry flow", "Foreign exchange service presentation"],
      process: ["Choose trade or transfer need", "Submit details", "Review route and requirements", "Coordinate next steps"],
    },
    tr: {
      hero: ["Ithalat, Ihracat ve Doviz Transfer Hizmetleri", "Uluslararasi ticaret, sevkiyat koordinasyonu ve doviz transferi", "Ithalat, ihracat, uluslararasi ticaret, sevkiyat koordinasyonu, para transferi ve doviz hizmetleri icin profesyonel site."],
      pages: [
        ["home", "/", "Ana Sayfa", "Ticaret hizmetleri", "Sinir otesi ticaret, sevkiyat, para transferi ve doviz talepleri icin tam platform."],
        ["import-export", "/import-export", "Ithalat & Ihracat", "Ithalat ve ihracat operasyonlari", "Tedarik, ticaret koordinasyonu, tedarikci iletisimleri ve ithalat/ihracat talepleri."],
        ["shipping", "/shipping", "Sevkiyat", "Uluslararasi sevkiyat koordinasyonu", "Sevkiyat koordinasyonu, belge takibi, ticari iletisim ve lojistik talep destegi."],
        ["currency-transfer", "/currency-transfer", "Para Transferi", "Para transfer hizmetleri", "Para transferi, odeme koordinasyonu ve uluslararasi para hareketi talepleri."],
        ["foreign-exchange", "/foreign-exchange", "Doviz", "Doviz hizmet talepleri", "Is musterileri icin acik formlar ve hizmet aciklamalariyla doviz talep destegi."],
        ["contact", "/contact", "Iletisim", "Ticaret talebi baslat", "Ithalat, ihracat, sevkiyat, transfer veya doviz detaylarini gonderin."],
      ],
      cards: ["Ithalat ve ihracat sayfalari", "Uluslararasi sevkiyat koordinasyonu", "Para transferi talep akisi", "Doviz hizmet sunumu"],
      process: ["Ticaret veya transfer ihtiyacini sec", "Detaylari gonder", "Rota ve gereksinimleri incele", "Sonraki adimlari koordine et"],
    },
    fa: {
      hero: ["خدمات واردات، صادرات و انتقال ارز", "تجارت بین المللی، هماهنگی حمل و انتقال ارز", "وب سایت حرفه ای برای واردات، صادرات، تجارت بین المللی، هماهنگی حمل، انتقال ارز و خدمات تبدیل ارز."],
      pages: [
        ["home", "/", "خانه", "معرفی خدمات تجارت", "پلتفرم کامل برای تجارت فرامرزی، هماهنگی حمل، انتقال ارز و درخواست خدمات ارزی."],
        ["import-export", "/import-export", "واردات و صادرات", "عملیات واردات و صادرات", "صفحات خدمات برای تامین، هماهنگی تجارت، ارتباط با تامین کننده و درخواست واردات/صادرات."],
        ["shipping", "/shipping", "حمل و نقل", "هماهنگی تجارت و حمل بین المللی", "هماهنگی حمل، پیگیری مدارک، ارتباط تجاری و پشتیبانی لجستیک."],
        ["currency-transfer", "/currency-transfer", "انتقال ارز", "خدمات انتقال ارز", "ثبت درخواست برای انتقال ارز، هماهنگی پرداخت و جابجایی بین المللی پول."],
        ["foreign-exchange", "/foreign-exchange", "تبدیل ارز", "درخواست خدمات ارزی", "پشتیبانی درخواست تبدیل ارز با فرم های روشن و توضیح خدمات برای مشتریان تجاری."],
        ["contact", "/contact", "تماس", "شروع درخواست تجارت", "جزئیات واردات، صادرات، حمل، انتقال ارز یا خدمات ارزی را ارسال کنید."],
      ],
      cards: ["صفحات واردات و صادرات", "هماهنگی حمل بین المللی", "مسیر درخواست انتقال ارز", "معرفی خدمات تبدیل ارز"],
      process: ["انتخاب نیاز تجارت یا انتقال", "ارسال جزئیات", "بررسی مسیر و نیازها", "هماهنگی مراحل بعدی"],
    },
    ar: {
      hero: ["خدمات الاستيراد والتصدير وتحويل العملات", "التجارة الدولية وتنسيق الشحن وتحويل العملات", "موقع مهني للاستيراد والتصدير والتجارة الدولية وتنسيق الشحن وتحويل العملات وخدمات الصرف."],
      pages: [
        ["home", "/", "الرئيسية", "نظرة على خدمات التجارة", "منصة كاملة للتجارة العابرة للحدود وتنسيق الشحن وتحويل العملات واستفسارات الصرف."],
        ["import-export", "/import-export", "استيراد وتصدير", "عمليات الاستيراد والتصدير", "صفحات للتوريد وتنسيق التجارة والتواصل مع الموردين واستفسارات الاستيراد والتصدير."],
        ["shipping", "/shipping", "الشحن", "تنسيق التجارة والشحن الدولي", "تنسيق الشحن ومتابعة المستندات والتواصل التجاري ودعم اللوجستيات."],
        ["currency-transfer", "/currency-transfer", "تحويل العملات", "خدمات تحويل العملات", "جمع طلبات تحويل العملات وتنسيق المدفوعات وحركة الأموال الدولية."],
        ["foreign-exchange", "/foreign-exchange", "الصرف الأجنبي", "طلبات خدمات الصرف", "دعم استفسارات الصرف بنماذج واضحة وشرح خدمات للعملاء التجاريين."],
        ["contact", "/contact", "تواصل", "ابدأ استفسار تجارة", "أرسل تفاصيل الاستيراد أو التصدير أو الشحن أو التحويل أو الصرف."],
      ],
      cards: ["صفحات الاستيراد والتصدير", "تنسيق الشحن الدولي", "مسار استفسار تحويل العملات", "عرض خدمات الصرف الأجنبي"],
      process: ["اختيار حاجة التجارة أو التحويل", "إرسال التفاصيل", "مراجعة المسار والمتطلبات", "تنسيق الخطوات التالية"],
    },
  },
};

const kindMap = {
  holding: "holding",
  residency: "residency",
  "real-estate": "realEstate",
  trade: "trade",
};

const iconMap = [Building2, ClipboardCheck, FileText, PackageCheck, Truck, ShieldCheck];

const newPages = {
  en: {
    holding: ["leadership", "/leadership", "Leadership", "Leadership and operating standards", "How REZAEI GLOBAL LLC keeps group communication, service routing, and client follow-up consistent across every business unit."],
    residency: ["case-review", "/case-review", "Case Review", "Document readiness and case review", "A focused page for checking document readiness, translation needs, attestation steps, and the right service path before work begins."],
    realEstate: ["market-insights", "/market-insights", "Market Insights", "Property, construction, and materials intelligence", "Practical market notes for buyers, investors, contractors, and procurement teams comparing opportunities and supply options."],
    trade: ["trade-desk", "/trade-desk", "Trade Desk", "Shipment and payment coordination desk", "A coordination page for trade requests that need sourcing, shipping documents, currency transfer timing, and follow-up in one workflow."],
  },
  tr: {
    holding: ["leadership", "/leadership", "Liderlik", "Liderlik ve isletme standartlari", "REZAEI GLOBAL LLC'nin grup iletisimi, hizmet yonlendirmesi ve musteri takibini nasil tutarli tuttugunu aciklar."],
    residency: ["case-review", "/case-review", "Dosya Incelemesi", "Belge hazirligi ve dosya incelemesi", "Calisma baslamadan once belge hazirligi, tercume ihtiyaci, tasdik adimlari ve dogru hizmet yolu icin odakli sayfa."],
    realEstate: ["market-insights", "/market-insights", "Pazar Notlari", "Emlak, insaat ve malzeme bilgisi", "Firsat ve tedarik seceneklerini karsilastiran alicilar, yatirimcilar, yukleniciler ve tedarik ekipleri icin pratik notlar."],
    trade: ["trade-desk", "/trade-desk", "Ticaret Masasi", "Sevkiyat ve odeme koordinasyonu", "Tedarik, sevkiyat belgeleri, doviz transfer zamanlamasi ve takip gerektiren ticaret talepleri icin koordinasyon sayfasi."],
  },
  fa: {
    holding: ["leadership", "/leadership", "رهبری", "رهبری و استانداردهای عملیاتی", "نحوه حفظ ارتباطات گروهی، مسیریابی خدمات و پیگیری مشتری در REZAEI GLOBAL LLC را توضیح می‌دهد."],
    residency: ["case-review", "/case-review", "بررسی پرونده", "آمادگی اسناد و بررسی پرونده", "صفحه‌ای متمرکز برای بررسی آمادگی اسناد، نیاز ترجمه، مراحل تایید و مسیر درست خدمات پیش از شروع کار."],
    realEstate: ["market-insights", "/market-insights", "بینش بازار", "اطلاعات املاک، ساخت‌وساز و مصالح", "نکات کاربردی برای خریداران، سرمایه‌گذاران، پیمانکاران و تیم‌های تامین در مقایسه فرصت‌ها و گزینه‌ها."],
    trade: ["trade-desk", "/trade-desk", "میز تجارت", "هماهنگی حمل و پرداخت", "صفحه هماهنگی برای درخواست‌های تجاری که به تامین، اسناد حمل، زمان‌بندی انتقال ارز و پیگیری نیاز دارند."],
  },
  ar: {
    holding: ["leadership", "/leadership", "القيادة", "القيادة ومعايير التشغيل", "كيف تحافظ REZAEI GLOBAL LLC على اتساق تواصل المجموعة وتوجيه الخدمات ومتابعة العملاء."],
    residency: ["case-review", "/case-review", "مراجعة الحالة", "جاهزية المستندات ومراجعة الحالة", "صفحة مركزة لفحص جاهزية المستندات واحتياجات الترجمة وخطوات التصديق ومسار الخدمة الصحيح قبل بدء العمل."],
    realEstate: ["market-insights", "/market-insights", "رؤى السوق", "معلومات العقار والبناء والمواد", "ملاحظات عملية للمشترين والمستثمرين والمقاولين وفرق التوريد عند مقارنة الفرص وخيارات التوريد."],
    trade: ["trade-desk", "/trade-desk", "مكتب التجارة", "تنسيق الشحن والدفع", "صفحة تنسيق لطلبات التجارة التي تحتاج إلى توريد ومستندات شحن وتوقيت تحويل العملات والمتابعة."],
  },
};

const supportDetails = {
  faq: {
    overview: "This page answers practical questions visitors ask before sending a request, including what information to prepare, how inquiries are routed, and what happens after submission.",
    cards: [
      ["Service scope", "Clear answers separate general website information from the services that require direct review by the relevant REZAEI GLOBAL LLC team."],
      ["Inquiry handling", "Forms collect the core details needed to understand the visitor's goal, preferred language, and service category."],
      ["Website readiness", "The sites are structured for subdomain deployment, multilingual navigation, metadata, and future operational expansion."],
      ["Next steps", "Visitors are guided toward a contact path rather than left guessing which business area should receive the request."],
    ],
    process: ["Review common questions", "Choose the closest service area", "Prepare the basic details", "Send the inquiry for follow-up"],
    contact: "Use the inquiry form if the FAQ does not cover the exact service situation.",
  },
  privacy: {
    overview: "This page explains how contact form details are collected for inquiry follow-up and why the websites ask for name, contact information, service type, language, and message content.",
    cards: [
      ["Inquiry data", "Submitted information is used to understand the request and route it to the appropriate business area."],
      ["Contact details", "Email and phone fields help the team respond with the right level of context and urgency."],
      ["Responsible handling", "The sites avoid unnecessary public account features and focus on direct business communication."],
      ["Visitor choice", "Visitors control what they send and can keep the first message concise until a service path is confirmed."],
    ],
    process: ["Receive inquiry", "Review submitted context", "Route to the relevant team", "Respond through provided contact details"],
    contact: "Send only the details needed for the team to understand the request.",
  },
  terms: {
    overview: "This page sets expectations for using the websites, reading service information, submitting inquiries, and understanding that final service details are confirmed through direct communication.",
    cards: [
      ["Website information", "Service descriptions are presented for orientation and do not replace a direct review of the specific case."],
      ["Inquiry submission", "Forms are used to start a conversation and do not by themselves create a confirmed engagement."],
      ["Content use", "Brand, text, and media are part of the REZAEI GLOBAL LLC website experience and should be treated accordingly."],
      ["Future deployment", "The same structure supports local development now and production subdomain deployment later."],
    ],
    process: ["Read service information", "Submit relevant details", "Wait for team confirmation", "Proceed with agreed next steps"],
    contact: "Use the contact form to clarify terms for a specific request.",
  },
};

const pageDetails = {
  holding: {
    home: {
      overview: "The holding homepage introduces REZAEI GLOBAL LLC as the corporate home behind the group, helping visitors understand the company and choose the right business unit.",
      cards: [
        ["Corporate identity", "The page presents one recognizable company identity for the Rezaei group."],
        ["Business map", "Visitors can move from the holding company to residency, real estate, construction, finance, trade, and currency services."],
        ["Partner routing", "Broad partnership or investment messages can be directed to the right operating team."],
        ["Group clarity", "The content explains how separate service companies connect under one corporate umbrella."],
      ],
      process: ["Identify the business need", "Choose the matching business unit", "Share the request context", "Route follow-up to the right team"],
      contact: "Send a corporate message when the request spans more than one business area or the right service company is not obvious yet.",
    },
    about: {
      overview: "The company overview page explains REZAEI GLOBAL LLC as a holding company coordinating focused service businesses for regional and international clients.",
      cards: [
        ["Group profile", "The page positions the company as the central business identity behind several specialist service platforms."],
        ["Regional presence", "The copy speaks to clients, partners, and investors working across the Gulf, Turkey, Iran, and international markets."],
        ["Business categories", "Visitors can see how real estate, construction, trade, finance, residency, visa, and translation services fit together."],
        ["Corporate tone", "The page is written for formal introductions, partnership review, and group-level business conversations."],
      ],
      process: ["Introduce the company", "Clarify operating areas", "Present regional context", "Guide visitors to the right team"],
      contact: "Use this page for corporate questions, partnership introductions, and group-level opportunities.",
    },
    group: {
      overview: "The group structure page explains how each service company fits into the wider REZAEI GLOBAL LLC operating model.",
      cards: [
        ["Residency and documents", "Visa, residency, corporate setup, attestation, legalization, and translation requests have a dedicated service path."],
        ["Property and construction", "Real estate, development, construction, investment, and materials inquiries move through the property platform."],
        ["Trade and finance", "Import, export, shipping, currency transfer, and foreign exchange requests move through the finance and trade platform."],
        ["Central navigation", "The holding site keeps the group understandable for visitors who arrive with a broad business need."],
      ],
      process: ["Review the business areas", "Open the matching company site", "Compare page-level services", "Start a focused conversation"],
      contact: "Ask the group team to route a request when it spans multiple service companies.",
    },
    governance: {
      overview: "The governance page describes the operating standards behind the group: clear responsibility, consistent communication, and accountable request routing.",
      cards: [
        ["Business standards", "Each service company keeps its own focus while following the same corporate communication standard."],
        ["Request accountability", "Messages should include enough context to decide which team owns the follow-up."],
        ["Operating discipline", "The group site keeps broad corporate inquiries separate from service-specific requests."],
        ["Brand consistency", "Shared identity helps visitors recognize each platform as part of REZAEI GLOBAL LLC."],
      ],
      process: ["Keep structure clear", "Separate service ownership", "Route inquiries responsibly", "Improve with real client needs"],
      contact: "Use this page for corporate governance, operating standards, or partnership process questions.",
    },
    contact: {
      overview: "The corporate contact page is for partnership introductions, group-level business questions, and requests that need help reaching the correct company.",
      cards: [
        ["Corporate inquiries", "Visitors can introduce a business need before selecting a specific operating company."],
        ["Partnership contact", "The form supports introductions from companies, consultants, suppliers, investors, and regional contacts."],
        ["Routing support", "Broad messages can be passed toward residency, real estate, construction, finance, trade, or currency workflows."],
        ["Follow-up clarity", "The message field should explain the business area, country, timeline, and preferred contact route."],
      ],
      process: ["Submit corporate inquiry", "Review the business category", "Route to the correct team", "Continue with focused follow-up"],
      contact: "Include the business area, country, timeline, decision owner, and preferred contact method.",
    },
    leadership: {
      overview: "The leadership page defines the standards used across the REZAEI GLOBAL LLC websites: professional communication, clear routing, responsible service presentation, and consistent brand execution.",
      cards: [
        ["Client communication", "Every page should make it clear what the visitor can ask for and what information helps the team respond."],
        ["Operating discipline", "The group structure keeps each business line focused while preserving one recognizable corporate identity."],
        ["Quality standards", "Content avoids vague claims and instead explains practical service paths, document needs, inquiry scope, and follow-up expectations."],
        ["Growth readiness", "The website system is prepared for more business units, richer case pages, and production domain rollout."],
      ],
      process: ["Set brand standards", "Align service pages", "Measure inquiry quality", "Improve content with real client needs"],
      contact: "Use this page for executive, partnership, or operating-standard conversations.",
    },
  },
  residency: {
    home: {
      overview: "The residency homepage gives individuals, investors, and companies a clear starting point for visa, setup, attestation, legalization, and translation requests.",
      cards: [
        ["Service triage", "Visitors can understand whether their need belongs to residency, corporate setup, legalization, or translation."],
        ["Document focus", "The page prepares visitors to think about passports, certificates, company papers, and official translations."],
        ["Multilingual support", "Language options make the service path easier for clients communicating across regions."],
        ["Inquiry readiness", "The form gathers enough context to begin review without overloading the visitor."],
      ],
      process: ["Choose the service area", "Share the document context", "Confirm the likely path", "Coordinate next steps"],
      contact: "Mention the country, document type, deadline, and whether translation or attestation is needed.",
    },
    "corporate-setup": {
      overview: "The corporate setup page focuses on company formation guidance, consulting, document preparation, and coordination for clients starting or structuring business activity.",
      cards: [
        ["Formation guidance", "The page explains setup support for visitors who need a structured business path."],
        ["Document preparation", "Clients are encouraged to identify existing company papers and personal documents early."],
        ["Consultancy scope", "The content separates general guidance from the specific review needed for each case."],
        ["Follow-up planning", "The inquiry form helps collect business activity, jurisdiction, and timeline details."],
      ],
      process: ["Describe the business goal", "Review document needs", "Confirm setup direction", "Coordinate the case"],
      contact: "Include business activity, owner details, target country or sultanate, and timing.",
    },
    "residency-visa": {
      overview: "The residency and visa page is built for case preparation, renewal questions, status changes, family or investor needs, and structured follow-up.",
      cards: [
        ["Case type", "The page helps distinguish new applications, renewals, family cases, investor paths, and work-related requests."],
        ["Eligibility context", "Visitors can share nationality, location, existing status, and timeline without exposing unnecessary details."],
        ["Document review", "The service path depends on passports, IDs, photos, sponsor details, and supporting papers."],
        ["Clear next step", "The goal is to move from broad visa questions to a reviewed, practical action path."],
      ],
      process: ["Identify visa need", "List current status", "Check document readiness", "Plan the application path"],
      contact: "Mention current visa status, nationality, location, and preferred timeline.",
    },
    legalization: {
      overview: "The legalization page covers attestation, official coordination, document status follow-up, and the steps needed before documents can be used abroad.",
      cards: [
        ["Document origin", "The process starts by understanding where the document was issued and where it will be used."],
        ["Attestation path", "Different documents may require ministry, embassy, consulate, or other official handling."],
        ["Status tracking", "The page sets expectations that document movement and approval steps may need staged follow-up."],
        ["Use case clarity", "Knowing the final purpose helps determine the correct legalization route."],
      ],
      process: ["Identify document origin", "Confirm destination use", "Review attestation steps", "Coordinate official handling"],
      contact: "Include document type, issuing country, destination country, and intended use.",
    },
    translation: {
      overview: "The translation page focuses on official, legal, commercial, and business document translation with attention to accuracy, purpose, and supporting legalization needs.",
      cards: [
        ["Document category", "Contracts, certificates, IDs, company papers, and legal documents require different handling."],
        ["Language pair", "The page encourages visitors to specify source and target languages clearly."],
        ["Official use", "Certified or official translation may depend on where the document will be submitted."],
        ["Connected services", "Translation can be paired with attestation or legalization when the case requires it."],
      ],
      process: ["Share document type", "Confirm language pair", "State official use", "Prepare translation quote"],
      contact: "Mention source language, target language, page count, and deadline.",
    },
    contact: {
      overview: "The contact page collects the first details needed to route residency, visa, setup, attestation, legalization, and translation inquiries.",
      cards: [
        ["Service routing", "The message can be directed to the correct specialist based on the selected topic."],
        ["Document summary", "A short description of documents helps the team understand the case quickly."],
        ["Timeline signal", "Urgent deadlines should be stated early so the response can be realistic."],
        ["Multilingual reply", "Visitors can indicate their preferred language for follow-up."],
      ],
      process: ["Send case summary", "Review service category", "Confirm missing details", "Continue with the right team"],
      contact: "Include the document type, service needed, country, and deadline.",
    },
    "case-review": {
      overview: "The case review page gives clients a practical checklist before starting work, reducing back-and-forth around missing documents, unclear deadlines, or mixed service needs.",
      cards: [
        ["Readiness check", "The page asks visitors to think through document availability, validity, translations, and official-use requirements."],
        ["Service matching", "A case may need more than one service, such as translation plus attestation or visa plus corporate setup."],
        ["Risk reduction", "Early review helps identify missing papers, timing issues, and unclear submission destinations."],
        ["Better handoff", "A cleaner first message helps the team respond with a more accurate next step."],
      ],
      process: ["List documents", "Identify final use", "Check deadline", "Request review"],
      contact: "Send a case summary with document names, issuing country, destination country, and target date.",
    },
  },
  realEstate: {
    home: {
      overview: "The real estate homepage connects property, development, construction, materials, and quotation requests in one professional entry point.",
      cards: [
        ["Property direction", "Visitors can move toward buying, investment, listing, or project-related conversations."],
        ["Construction scope", "The platform supports construction and development inquiries alongside property services."],
        ["Material sourcing", "Procurement visitors can ask about building materials and industrial goods."],
        ["Quote readiness", "The inquiry path is designed to collect location, quantity, project type, and timeline."],
      ],
      process: ["Choose property or material need", "Share project context", "Review options", "Coordinate quotation or follow-up"],
      contact: "Mention location, property type, material type, budget range, and timeline.",
    },
    properties: {
      overview: "The properties page is for buyer, investor, seller, and tenant inquiries that need clearer property criteria before follow-up.",
      cards: [
        ["Buyer criteria", "Visitors can share property type, location, size, budget, and investment intent."],
        ["Investor context", "The page supports requests comparing income potential, development fit, or market positioning."],
        ["Listing support", "Owners can introduce properties that may need structured presentation or inquiry routing."],
        ["Follow-up quality", "Clear criteria help the team respond with relevant options instead of broad suggestions."],
      ],
      process: ["Define property need", "Share location and budget", "Review matching options", "Arrange follow-up"],
      contact: "Include property type, preferred area, budget, and buying or leasing intent.",
    },
    projects: {
      overview: "The projects page presents construction and development capability, helping visitors discuss active ideas, planned work, or project partnerships.",
      cards: [
        ["Development context", "Project inquiries can include land, concept, stage, budget, and intended use."],
        ["Construction capability", "The page supports conversations about contractor needs, scope, and delivery expectations."],
        ["Portfolio framing", "Project content can later expand into case studies, milestones, and visual progress updates."],
        ["Partnership route", "Investors and owners can start a structured discussion without forcing a property listing format."],
      ],
      process: ["Describe the project", "Share stage and location", "Review scope", "Plan next discussion"],
      contact: "Mention project location, stage, size, and required role.",
    },
    materials: {
      overview: "The materials page is for building materials, industrial goods, procurement requests, and supply coordination tied to construction or trade needs.",
      cards: [
        ["Material category", "Requests can cover construction materials, industrial goods, fixtures, or project-specific supply items."],
        ["Quantity detail", "The team needs quantities, specifications, grade, and delivery destination to prepare a useful response."],
        ["Supplier coordination", "The page supports procurement conversations that may involve sourcing and logistics."],
        ["Quote preparation", "Clear item descriptions reduce delays and help move toward pricing."],
      ],
      process: ["List materials", "Share specifications", "Confirm delivery needs", "Prepare quotation path"],
      contact: "Include item names, quantity, specs, destination, and expected delivery date.",
    },
    quotation: {
      overview: "The quotation page is built for structured requests where visitors already know they need pricing for property, construction, materials, or project services.",
      cards: [
        ["Request structure", "The page encourages visitors to send measurable requirements instead of a vague price question."],
        ["Scope clarity", "Construction and material quotes depend on location, dimensions, quantity, and required standard."],
        ["Response planning", "A clear first request helps the team decide whether pricing, consultation, or inspection is the next step."],
        ["Procurement fit", "The page can support both local project needs and supply-related inquiries."],
      ],
      process: ["Write the requirement", "Add quantities and location", "Review feasibility", "Follow up with quote details"],
      contact: "Attach or describe the scope, quantities, site location, and deadline.",
    },
    contact: {
      overview: "The contact page routes property, development, construction, materials, and quotation inquiries to the right conversation.",
      cards: [
        ["Property contact", "Buyer, investor, seller, and tenant messages can start with basic criteria."],
        ["Project contact", "Construction or development messages can focus on stage, site, and role needed."],
        ["Material contact", "Procurement messages can list items, specs, quantities, and delivery target."],
        ["Team routing", "The message content determines whether follow-up should focus on property, project, or supply."],
      ],
      process: ["Submit inquiry", "Classify request", "Ask for missing details", "Coordinate follow-up"],
      contact: "Include the category, location, budget or quantity, and timeline.",
    },
    "market-insights": {
      overview: "The market insights page gives visitors a more informed starting point before they ask about property, construction, materials, or project opportunities.",
      cards: [
        ["Property signals", "The page can frame area demand, buyer intent, project stage, and investment criteria."],
        ["Construction planning", "Visitors can think through scope, timing, contractor needs, and material availability before contacting the team."],
        ["Procurement awareness", "Material requests work better when specifications, quantity, and delivery expectations are clear."],
        ["Decision support", "The page supports comparison and planning rather than only a direct sales pitch."],
      ],
      process: ["Review market context", "Define the opportunity", "Prepare key details", "Request focused guidance"],
      contact: "Send the market, property type, project stage, and decision timeline.",
    },
  },
  trade: {
    home: {
      overview: "The trade homepage introduces import, export, shipping, currency transfer, and foreign exchange services as one coordinated business workflow.",
      cards: [
        ["Trade request", "Visitors can start with sourcing, supplier communication, import, export, or shipment questions."],
        ["Logistics context", "Shipment requests work better when origin, destination, cargo type, and documents are clear."],
        ["Payment timing", "Currency transfer and FX needs can be coordinated alongside trade movement."],
        ["Business follow-up", "The page moves broad trade questions toward a concrete operational path."],
      ],
      process: ["Choose trade need", "Share shipment or payment context", "Review requirements", "Coordinate next step"],
      contact: "Include origin, destination, cargo or payment amount, and required timeline.",
    },
    "import-export": {
      overview: "The import and export page supports sourcing, supplier communication, buyer requests, product movement, and cross-border business coordination.",
      cards: [
        ["Product sourcing", "Visitors can describe product type, target supplier, volume, and destination market."],
        ["Export planning", "The page supports conversations around buyer needs, product readiness, and shipment route."],
        ["Supplier communication", "Trade requests often require coordination across language, documentation, and payment expectations."],
        ["Requirement capture", "A clearer first message helps determine whether sourcing, logistics, or payment is the main issue."],
      ],
      process: ["Describe goods", "Confirm origin and destination", "Review trade requirements", "Coordinate supplier or buyer follow-up"],
      contact: "Mention product, quantity, origin, destination, and buyer or supplier status.",
    },
    shipping: {
      overview: "The shipping page focuses on logistics coordination, document follow-up, cargo details, routing, and communication around international movement.",
      cards: [
        ["Cargo profile", "Cargo type, size, weight, packaging, and destination shape the shipment path."],
        ["Document follow-up", "Commercial invoices, packing lists, certificates, and shipping papers may be required."],
        ["Route planning", "The page helps capture origin, destination, urgency, and transport preference."],
        ["Operational clarity", "Good shipment inquiries reduce confusion between sourcing, export, freight, and delivery."],
      ],
      process: ["Share cargo details", "Confirm route", "Review documents", "Coordinate shipment follow-up"],
      contact: "Include cargo type, dimensions or weight, origin, destination, and deadline.",
    },
    "currency-transfer": {
      overview: "The currency transfer page is for payment coordination and international money movement connected to business, trade, or service needs.",
      cards: [
        ["Transfer purpose", "The reason for the transfer helps frame compliance, timing, and supporting details."],
        ["Currency pair", "Visitors should identify sending and receiving currencies along with approximate amount."],
        ["Timing needs", "Trade payments often depend on supplier deadlines, shipment milestones, or invoice dates."],
        ["Follow-up path", "The form captures enough information for a responsible conversation without publishing rates or promises."],
      ],
      process: ["State transfer purpose", "Share amount and currency", "Review timing", "Coordinate next step"],
      contact: "Mention amount, currency pair, countries involved, and target transfer date.",
    },
    "foreign-exchange": {
      overview: "The foreign exchange page presents FX inquiry support for business clients who need clarity around currency conversion, timing, and payment coordination.",
      cards: [
        ["FX requirement", "Visitors can explain whether the need is one-time, trade-related, or part of repeated business payments."],
        ["Currency context", "The page asks for currency pair, approximate value, and timing rather than vague exchange questions."],
        ["Business connection", "FX requests may relate to import invoices, export proceeds, or service payments."],
        ["Clear communication", "The page avoids unsupported promises and focuses on collecting the details needed for follow-up."],
      ],
      process: ["Identify currency pair", "Share amount and timing", "Explain business purpose", "Request FX follow-up"],
      contact: "Include currency pair, approximate amount, country, and business purpose.",
    },
    contact: {
      overview: "The trade contact page routes import, export, shipping, currency transfer, and foreign exchange inquiries through one starting form.",
      cards: [
        ["Trade routing", "Messages can be classified as goods movement, supplier coordination, shipment, transfer, or FX."],
        ["Document context", "Trade and shipping messages should mention available paperwork and missing documents."],
        ["Payment context", "Currency and FX messages should include amount, currency pair, and deadline."],
        ["Operational follow-up", "The team can respond more usefully when the request includes route, goods, timing, and contact preference."],
      ],
      process: ["Submit trade inquiry", "Classify request type", "Review missing details", "Coordinate the correct workflow"],
      contact: "Include goods, route, currency, amount, and timeline when relevant.",
    },
    "trade-desk": {
      overview: "The trade desk page brings sourcing, shipping, documentation, payment timing, currency transfer, and FX questions into one coordination workflow.",
      cards: [
        ["Single workflow", "Complex trade requests often combine goods, documents, shipping, and payment needs."],
        ["Coordination view", "The page helps visitors explain what has already been arranged and what still needs support."],
        ["Timing alignment", "Shipment dates, supplier deadlines, and transfer timing can affect each other."],
        ["Cleaner handoff", "A structured request helps the team decide whether the next step is sourcing, logistics, payment, or documentation."],
      ],
      process: ["Describe the full trade case", "List goods and route", "Add payment timing", "Coordinate the desk response"],
      contact: "Send the full trade context, including supplier or buyer status, documents, route, and payment timing.",
    },
  },
};

const generatedCopy = {
  en: {
    whoUses: (label) => `Who uses ${label}`,
    whoText: ({ audience, pageTitle }) => `This page is written for ${audience}. It explains ${pageTitle.toLowerCase()} in plain business terms and helps visitors understand whether this is the correct place to start.`,
    decideTitle: "What the page should decide",
    decideText: ({ outcome }) => `The goal is ${outcome}. Visitors should leave with enough confidence to send a focused inquiry instead of a broad message that needs several rounds of clarification.`,
    firstMessageTitle: "What to include in the first message",
    firstMessageText: ({ noun, record, contact }) => `For this ${noun}, the most useful first message includes ${record}. ${contact}`,
    deliverableText: ({ cardText, pageTitle }) => `${cardText} The page turns this into a concrete discussion point for ${pageTitle.toLowerCase()}, so the team can classify the request quickly.`,
    meta: ["Scope", "Details", "Routing", "Follow-up"],
    scenarioRequest: (title) => `${title} request`,
    scenarioRequestText: ({ title }) => `Use this page when the main question is about ${title.toLowerCase()}. The first response can be more useful when the visitor explains the current situation, target outcome, and timing.`,
    scenarioPlanning: (title) => `${title} planning`,
    scenarioPlanningText: ({ title }) => `This scenario helps visitors prepare details before the team reviews ${title.toLowerCase()}. It reduces missing context and makes the next step easier to confirm.`,
    scenarioCoordination: (title) => `${title} coordination`,
    scenarioCoordinationText: ({ title }) => `Some requests need more than one step. This page keeps ${title.toLowerCase()} connected to the wider process instead of treating it as an isolated note.`,
    scenarioFollowUp: (title) => `${title} follow-up`,
    scenarioFollowUpText: ({ title, pathText }) => `When the request is ready to move forward, ${title.toLowerCase()} becomes part of the follow-up path: ${pathText}.`,
    checklist: ({ noun }) => [
      `Confirm the exact purpose of the ${noun}.`,
      "Write the destination, country, market, or location clearly.",
      "Add quantities, document names, budget, amount, or timeline where relevant.",
      "Mention the preferred language and best contact method for follow-up.",
    ],
    rightPage: (title) => `Is ${title} the right page for my request?`,
    rightPageText: ({ pageText }) => `Yes, if your request matches ${pageText} If it crosses into another business area, the inquiry can still be routed from here.`,
    afterForm: "What happens after I send the form?",
    afterFormText: ({ pathText }) => `The request is reviewed, classified, and followed up according to this path: ${pathText}.`,
    shortMessage: "Can I send a short message first?",
    shortMessageText: "Yes. A concise message is fine as long as it includes the main purpose, timing, and enough context for the team to understand the request.",
    coverage: (title) => `${title} coverage`,
    situations: (title) => `Common ${title.toLowerCase()} situations`,
    questions: (title) => `${title} questions`,
    stage: (index) => `Stage ${index + 1}`,
  },
  tr: {
    whoUses: (label) => `${label} kimler icin`,
    whoText: ({ audience, pageTitle }) => `Bu sayfa ${audience} icin hazirlandi. ${pageTitle} konusunu sade is diliyle aciklar ve ziyaretcinin dogru yerden baslayip baslamadigini anlamasina yardim eder.`,
    decideTitle: "Sayfanin netlestirdigi konu",
    decideText: ({ outcome }) => `Hedef ${outcome}. Ziyaretci, tekrar tekrar aciklama gerektiren genel bir mesaj yerine odakli bir talep gonderebilmelidir.`,
    firstMessageTitle: "Ilk mesaja eklenecek bilgiler",
    firstMessageText: ({ noun, record, contact }) => `Bu ${noun} icin en yararli ilk mesaj ${record} bilgilerini icerir. ${contact}`,
    deliverableText: ({ cardText, pageTitle }) => `${cardText} Sayfa bunu ${pageTitle} icin somut bir gorusme noktasina donusturur ve ekibin talebi hizlica siniflandirmasina yardim eder.`,
    meta: ["Kapsam", "Detaylar", "Yonlendirme", "Takip"],
    scenarioRequest: (title) => `${title} talebi`,
    scenarioRequestText: ({ title }) => `Ana konu ${title} ise bu sayfayi kullanin. Mevcut durum, hedef sonuc ve zamanlama aciklanirsa ilk yanit daha yararli olur.`,
    scenarioPlanning: (title) => `${title} planlama`,
    scenarioPlanningText: ({ title }) => `Bu senaryo, ekip ${title} konusunu incelemeden once ziyaretcinin detaylari hazirlamasina yardim eder.`,
    scenarioCoordination: (title) => `${title} koordinasyonu`,
    scenarioCoordinationText: ({ title }) => `Bazi talepler birden fazla adim gerektirir. Bu sayfa ${title} konusunu daha genis surecle baglantili tutar.`,
    scenarioFollowUp: (title) => `${title} takibi`,
    scenarioFollowUpText: ({ title, pathText }) => `Talep ilerlemeye hazir oldugunda ${title} takip yolunun parcasi olur: ${pathText}.`,
    checklist: ({ noun }) => [
      `${noun} icin tam amaci netlestirin.`,
      "Ulke, pazar, varis noktasi veya konumu acik yazin.",
      "Gerekliyse miktar, belge adi, butce, tutar veya zamanlama ekleyin.",
      "Tercih edilen dili ve takip iletisim yolunu belirtin.",
    ],
    rightPage: (title) => `${title} talebim icin dogru sayfa mi?`,
    rightPageText: ({ pageText }) => `Evet, talebiniz ${pageText} ile eslesiyorsa dogru yerdesiniz. Baska bir is alanina girerse talep yine buradan yonlendirilebilir.`,
    afterForm: "Formu gonderdikten sonra ne olur?",
    afterFormText: ({ pathText }) => `Talep incelenir, siniflandirilir ve su surece gore takip edilir: ${pathText}.`,
    shortMessage: "Once kisa bir mesaj gonderebilir miyim?",
    shortMessageText: "Evet. Ana amac, zamanlama ve ekibin talebi anlamasina yetecek baglam varsa kisa mesaj yeterlidir.",
    coverage: (title) => `${title} kapsami`,
    situations: (title) => `Yaygin ${title} durumlari`,
    questions: (title) => `${title} sorulari`,
    stage: (index) => `Asama ${index + 1}`,
  },
  fa: {
    whoUses: (label) => `${label} برای چه کسانی است`,
    whoText: ({ audience, pageTitle }) => `این صفحه برای ${audience} نوشته شده است. موضوع ${pageTitle} را با زبان تجاری روشن توضیح می‌دهد و کمک می‌کند بازدیدکننده بداند از جای درستی شروع کرده است یا نه.`,
    decideTitle: "این صفحه چه چیزی را مشخص می‌کند",
    decideText: ({ outcome }) => `هدف، ${outcome} است. بازدیدکننده باید بتواند به جای پیام کلی، یک درخواست دقیق و قابل پیگیری ارسال کند.`,
    firstMessageTitle: "در پیام اول چه چیزهایی بنویسید",
    firstMessageText: ({ noun, record, contact }) => `برای این ${noun}، پیام اول بهتر است شامل ${record} باشد. ${contact}`,
    deliverableText: ({ cardText, pageTitle }) => `${cardText} این صفحه این موضوع را برای ${pageTitle} به یک نقطه گفت‌وگوی مشخص تبدیل می‌کند تا تیم بتواند درخواست را سریع‌تر دسته‌بندی کند.`,
    meta: ["دامنه", "جزئیات", "مسیریابی", "پیگیری"],
    scenarioRequest: (title) => `درخواست ${title}`,
    scenarioRequestText: ({ title }) => `وقتی پرسش اصلی درباره ${title} است از این صفحه استفاده کنید. اگر وضعیت فعلی، نتیجه مورد نظر و زمان‌بندی مشخص باشد پاسخ اول کاربردی‌تر می‌شود.`,
    scenarioPlanning: (title) => `برنامه‌ریزی ${title}`,
    scenarioPlanningText: ({ title }) => `این سناریو کمک می‌کند قبل از بررسی تیم، جزئیات مربوط به ${title} آماده شود و مرحله بعد روشن‌تر باشد.`,
    scenarioCoordination: (title) => `هماهنگی ${title}`,
    scenarioCoordinationText: ({ title }) => `بعضی درخواست‌ها چند مرحله دارند. این صفحه ${title} را به فرایند کلی وصل نگه می‌دارد.`,
    scenarioFollowUp: (title) => `پیگیری ${title}`,
    scenarioFollowUpText: ({ title, pathText }) => `وقتی درخواست آماده ادامه باشد، ${title} بخشی از مسیر پیگیری می‌شود: ${pathText}.`,
    checklist: ({ noun }) => [
      `هدف دقیق ${noun} را مشخص کنید.`,
      "کشور، بازار، مقصد یا موقعیت را روشن بنویسید.",
      "در صورت نیاز مقدار، نام سند، بودجه، مبلغ یا زمان‌بندی را اضافه کنید.",
      "زبان ترجیحی و بهترین روش تماس برای پیگیری را ذکر کنید.",
    ],
    rightPage: (title) => `آیا ${title} صفحه درست برای درخواست من است؟`,
    rightPageText: ({ pageText }) => `بله، اگر درخواست شما با ${pageText} همخوانی دارد. اگر به حوزه دیگری مربوط باشد، از همین‌جا قابل مسیریابی است.`,
    afterForm: "بعد از ارسال فرم چه اتفاقی می‌افتد؟",
    afterFormText: ({ pathText }) => `درخواست بررسی، دسته‌بندی و بر اساس این مسیر پیگیری می‌شود: ${pathText}.`,
    shortMessage: "می‌توانم ابتدا پیام کوتاه بفرستم؟",
    shortMessageText: "بله. اگر هدف اصلی، زمان‌بندی و زمینه کافی برای فهم درخواست نوشته شود، پیام کوتاه هم کافی است.",
    coverage: (title) => `پوشش ${title}`,
    situations: (title) => `موقعیت‌های رایج ${title}`,
    questions: (title) => `پرسش‌های ${title}`,
    stage: (index) => `مرحله ${index + 1}`,
  },
  ar: {
    whoUses: (label) => `لمن صفحة ${label}`,
    whoText: ({ audience, pageTitle }) => `هذه الصفحة مخصصة لـ ${audience}. تشرح ${pageTitle} بلغة عملية واضحة وتساعد الزائر على معرفة ما إذا كان هذا هو المكان الصحيح للبدء.`,
    decideTitle: "ما الذي توضحه الصفحة",
    decideText: ({ outcome }) => `الهدف هو ${outcome}. يجب أن يتمكن الزائر من إرسال طلب واضح بدلاً من رسالة عامة تحتاج إلى توضيحات متكررة.`,
    firstMessageTitle: "ما الذي يجب تضمينه في الرسالة الأولى",
    firstMessageText: ({ noun, record, contact }) => `لهذا ${noun}، من الأفضل أن تتضمن الرسالة الأولى ${record}. ${contact}`,
    deliverableText: ({ cardText, pageTitle }) => `${cardText} تحول الصفحة ذلك إلى نقطة نقاش واضحة لـ ${pageTitle} حتى يتمكن الفريق من تصنيف الطلب بسرعة.`,
    meta: ["النطاق", "التفاصيل", "التوجيه", "المتابعة"],
    scenarioRequest: (title) => `طلب ${title}`,
    scenarioRequestText: ({ title }) => `استخدم هذه الصفحة عندما يكون السؤال الرئيسي حول ${title}. يصبح الرد الأول أكثر فائدة عندما يوضح الزائر الوضع الحالي والهدف والجدول الزمني.`,
    scenarioPlanning: (title) => `تخطيط ${title}`,
    scenarioPlanningText: ({ title }) => `يساعد هذا السيناريو الزائر على تجهيز التفاصيل قبل أن يراجع الفريق ${title}.`,
    scenarioCoordination: (title) => `تنسيق ${title}`,
    scenarioCoordinationText: ({ title }) => `بعض الطلبات تحتاج إلى أكثر من خطوة. تبقي هذه الصفحة ${title} مرتبطاً بالمسار الأوسع.`,
    scenarioFollowUp: (title) => `متابعة ${title}`,
    scenarioFollowUpText: ({ title, pathText }) => `عندما يصبح الطلب جاهزاً للمتابعة، يصبح ${title} جزءاً من المسار: ${pathText}.`,
    checklist: ({ noun }) => [
      `حدد الغرض الدقيق من ${noun}.`,
      "اكتب البلد أو السوق أو الوجهة أو الموقع بوضوح.",
      "أضف الكميات أو أسماء المستندات أو الميزانية أو المبلغ أو الجدول الزمني عند الحاجة.",
      "اذكر اللغة المفضلة وأفضل وسيلة للتواصل للمتابعة.",
    ],
    rightPage: (title) => `هل ${title} هي الصفحة المناسبة لطلبي؟`,
    rightPageText: ({ pageText }) => `نعم، إذا كان طلبك يطابق ${pageText}. وإذا كان مرتبطاً بمجال آخر فيمكن توجيهه من هنا.`,
    afterForm: "ماذا يحدث بعد إرسال النموذج؟",
    afterFormText: ({ pathText }) => `تتم مراجعة الطلب وتصنيفه ومتابعته وفق هذا المسار: ${pathText}.`,
    shortMessage: "هل يمكنني إرسال رسالة قصيرة أولاً؟",
    shortMessageText: "نعم. تكفي الرسالة القصيرة إذا تضمنت الهدف الرئيسي والجدول الزمني والسياق اللازم لفهم الطلب.",
    coverage: (title) => `نطاق ${title}`,
    situations: (title) => `حالات ${title} الشائعة`,
    questions: (title) => `أسئلة ${title}`,
    stage: (index) => `المرحلة ${index + 1}`,
  },
};

const localizedVoices = {
  en: {
    holding: {
      noun: "group",
      audience: "directors, partners, regional clients, and visitors who need the right business unit",
      outcome: "a clear route through the REZAEI GLOBAL LLC group instead of a generic company introduction",
      record: "business area, country, timeline, decision owner, and preferred follow-up language",
    },
    residency: {
      noun: "case",
      audience: "individuals, investors, families, and companies preparing official documents or mobility requests",
      outcome: "a practical service path for documents, residency, visa, setup, attestation, or translation work",
      record: "document type, issuing country, destination country, deadline, and current status",
    },
    realEstate: {
      noun: "project",
      audience: "buyers, investors, owners, contractors, procurement teams, and development partners",
      outcome: "a better property, construction, materials, or quotation conversation with fewer missing details",
      record: "location, property or material type, quantity or size, budget range, and target date",
    },
    trade: {
      noun: "trade request",
      audience: "importers, exporters, suppliers, buyers, logistics coordinators, and business payment teams",
      outcome: "a coordinated route for goods, documents, shipment timing, payment needs, or currency exchange",
      record: "origin, destination, cargo or amount, currency pair, documents available, and required timing",
    },
  },
  tr: {
    holding: { noun: "grup talebi", audience: "yoneticiler, is ortaklari, bolgesel musteriler ve dogru is birimini arayan ziyaretciler", outcome: "genel bir sirket tanitimi yerine REZAEI GLOBAL LLC grubu icinde net bir yonlendirme", record: "is alani, ulke, zamanlama, karar sahibi ve tercih edilen takip dili" },
    residency: { noun: "dosya", audience: "resmi belge veya hareketlilik talebi hazirlayan bireyler, yatirimcilar, aileler ve sirketler", outcome: "belgeler, oturum, vize, kurulum, tasdik veya tercume icin pratik bir hizmet yolu", record: "belge turu, duzenleyen ulke, hedef ulke, son tarih ve mevcut durum" },
    realEstate: { noun: "proje", audience: "alicilar, yatirimcilar, mulk sahipleri, yukleniciler, tedarik ekipleri ve gelistirme ortaklari", outcome: "daha az eksik bilgiyle daha iyi bir emlak, insaat, malzeme veya teklif gorusmesi", record: "konum, mulk veya malzeme turu, miktar veya boyut, butce araligi ve hedef tarih" },
    trade: { noun: "ticaret talebi", audience: "ithalatcilar, ihracatcilar, tedarikciler, alicilar, lojistik koordinatorleri ve odeme ekipleri", outcome: "mal, belge, sevkiyat zamanlamasi, odeme ihtiyaci veya doviz icin koordine bir yol", record: "cikis, varis, yuk veya tutar, doviz cifti, mevcut belgeler ve gerekli zamanlama" },
  },
  fa: {
    holding: { noun: "درخواست گروهی", audience: "مدیران، شرکا، مشتریان منطقه‌ای و بازدیدکنندگانی که به واحد تجاری درست نیاز دارند", outcome: "ایجاد مسیر روشن در گروه REZAEI GLOBAL LLC به جای معرفی کلی شرکت", record: "حوزه کسب‌وکار، کشور، زمان‌بندی، تصمیم‌گیرنده و زبان ترجیحی پیگیری" },
    residency: { noun: "پرونده", audience: "افراد، سرمایه‌گذاران، خانواده‌ها و شرکت‌هایی که اسناد رسمی یا درخواست اقامت و جابه‌جایی آماده می‌کنند", outcome: "مسیر خدماتی عملی برای اسناد، اقامت، ویزا، ثبت شرکت، تایید یا ترجمه", record: "نوع سند، کشور صادرکننده، کشور مقصد، مهلت و وضعیت فعلی" },
    realEstate: { noun: "پروژه", audience: "خریداران، سرمایه‌گذاران، مالکان، پیمانکاران، تیم‌های تامین و شرکای توسعه", outcome: "گفت‌وگوی بهتر درباره املاک، ساخت‌وساز، مصالح یا قیمت‌گذاری با اطلاعات ناقص کمتر", record: "موقعیت، نوع ملک یا مصالح، مقدار یا اندازه، بازه بودجه و تاریخ هدف" },
    trade: { noun: "درخواست تجاری", audience: "واردکنندگان، صادرکنندگان، تامین‌کنندگان، خریداران، هماهنگ‌کنندگان لجستیک و تیم‌های پرداخت تجاری", outcome: "مسیر هماهنگ برای کالا، اسناد، زمان‌بندی حمل، نیاز پرداخت یا تبادل ارز", record: "مبدا، مقصد، بار یا مبلغ، جفت ارز، اسناد موجود و زمان‌بندی مورد نیاز" },
  },
  ar: {
    holding: { noun: "طلب المجموعة", audience: "المديرين والشركاء والعملاء الإقليميين والزوار الذين يحتاجون إلى وحدة العمل المناسبة", outcome: "مسار واضح داخل مجموعة REZAEI GLOBAL LLC بدلاً من تعريف عام بالشركة", record: "مجال العمل والبلد والجدول الزمني وصاحب القرار ولغة المتابعة المفضلة" },
    residency: { noun: "الملف", audience: "الأفراد والمستثمرين والعائلات والشركات التي تجهز مستندات رسمية أو طلبات إقامة وتنقل", outcome: "مسار خدمة عملي للمستندات أو الإقامة أو التأشيرة أو التأسيس أو التصديق أو الترجمة", record: "نوع المستند وبلد الإصدار وبلد الوجهة والموعد النهائي والحالة الحالية" },
    realEstate: { noun: "المشروع", audience: "المشترين والمستثمرين والمالكين والمقاولين وفرق التوريد وشركاء التطوير", outcome: "محادثة أفضل حول العقار أو البناء أو المواد أو التسعير مع معلومات ناقصة أقل", record: "الموقع ونوع العقار أو المادة والكمية أو الحجم ونطاق الميزانية والتاريخ المستهدف" },
    trade: { noun: "طلب التجارة", audience: "المستوردين والمصدرين والموردين والمشترين ومنسقي الخدمات اللوجستية وفرق الدفع التجاري", outcome: "مسار منسق للبضائع أو المستندات أو توقيت الشحن أو احتياجات الدفع أو الصرف", record: "المنشأ والوجهة والبضاعة أو المبلغ وزوج العملات والمستندات المتاحة والتوقيت المطلوب" },
  },
};

const detailSummaryCopy = {
  en: {
    focus: (title) => `${title} focus`,
    prepare: "What to prepare",
    followUp: "Expected follow-up",
    followUpText: (steps) => `The usual flow is: ${steps}.`,
  },
  tr: {
    focus: (title) => `${title} odagi`,
    prepare: "Ne hazirlanmali",
    followUp: "Beklenen takip",
    followUpText: (steps) => `Genel akış: ${steps}.`,
  },
  fa: {
    focus: (title) => `تمرکز ${title}`,
    prepare: "چه چیزهایی آماده شود",
    followUp: "پیگیری مورد انتظار",
    followUpText: (steps) => `مسیر معمول این است: ${steps}.`,
  },
  ar: {
    focus: (title) => `تركيز ${title}`,
    prepare: "ما الذي يجب تجهيزه",
    followUp: "المتابعة المتوقعة",
    followUpText: (steps) => `المسار المعتاد هو: ${steps}.`,
  },
};

const homeFallbackCopy = {
  en: {
    heroEyebrow: "Parent Holding Company",
    heroTitle: "The strategic entry point",
    heroMuted: "for the Rezaei business group.",
    heroLead: "REZAEI GLOBAL LLC coordinates three specialized business units across real estate, finance and trade, and residency, visa, translation, and corporate setup services.",
    heroPrimary: "Choose a business unit",
    heroSecondary: "About the parent company",
    companySummary: "REZAEI GLOBAL LLC is the parent company behind three specialist business units. It exists to keep the group understandable, the client journey clear, and each service conversation in the right hands.",
    companyAlt: "REZAEI GLOBAL LLC exists because many serious business requests do not stay inside one category.",
    groupSummary: "REZAEI GLOBAL LLC operates as a parent entity with distinct internal functions — governance, partnerships, and business development — sitting above the three specialist business units.",
    workSummary: "This section explains how a broad request becomes a focused conversation with the right team.",
    governanceSummary: "This section describes how the group keeps communication professional while leaving room for future CMS, admin, and structured content workflows.",
    teamSummary: "Meet the leadership group that keeps group communication clear and connects clients to the right specialist desk.",
    teamButton: "Meet the team",
    teamCards: [
      ["Hosein Rezaei", "Sets group direction and keeps every request moving toward the right business unit.", "", "Group Managing Director"],
      ["Ali Rezaei", "Reviews intake quality and ensures specialist teams receive usable context.", "", "Operations Director"],
      ["Mohammad Rezaei", "Leads property, construction, materials, and quotation conversations.", "", "Real Estate Desk Lead"],
      ["Reza Rezaei", "Handles trade, shipment, currency transfer, and commercial finance requests.", "", "Trade & Finance Desk Lead"],
    ],
    exploreSummary: "This pattern will later be reusable across all group websites so visitors can always understand where they are inside the wider company structure.",
    exploreParentTitle: "Holding Company",
    exploreParentText: "Corporate identity, group routing, partnerships, and requests that span more than one business unit.",
    contactSummary: "Use this form for partnership introductions, group-level requests, or any inquiry that spans more than one business unit. Include the business area, country, timeline, and preferred contact method.",
  },
  tr: {
    heroEyebrow: "Ana Holding Sirketi",
    heroTitle: "Stratejik giris noktasi",
    heroMuted: "Rezaei is grubu icin.",
    heroLead: "REZAEI GLOBAL LLC gayrimenkul, finans ve ticaret, oturum, vize, tercume ve sirket kurulumu alanlarinda uc uzman is birimini koordine eder.",
    heroPrimary: "Is birimi sec",
    heroSecondary: "Ana sirket hakkinda",
    companySummary: "REZAEI GLOBAL LLC uc uzman is biriminin arkasindaki ana sirkettir. Grubu anlasilir, musteri yolunu net ve her hizmet gorusmesini dogru elde tutar.",
    companyAlt: "REZAEI GLOBAL LLC, ciddi is taleplerinin tek bir kategori icinde kalmamasindan dogdu.",
    groupSummary: "REZAEI GLOBAL LLC, uzman is birimlerinin uzerinde yonetisim, ortakliklar ve is gelistirme islevleriyle ana kurum olarak calisir.",
    workSummary: "Bu bolum genis bir talebin dogru ekiple odakli bir gorusmeye nasil donustugunu aciklar.",
    governanceSummary: "Bu bolum grubun gelecekte CMS, admin ve yapilandirilmis icerik is akislari icin yer birakirken iletisimi profesyonel tuttugunu aciklar.",
    teamSummary: "Grup iletisimini net tutan ve musterileri dogru uzman masaya baglayan liderlik grubuyla tanisin.",
    teamButton: "Ekiple tanisin",
    teamCards: [
      ["Hosein Rezaei", "Grup yonunu belirler ve her talebi dogru is birimine yonlendirir.", "", "Grup Genel Muduru"],
      ["Ali Rezaei", "Talep kalitesini inceler ve uzman ekiplerin kullanilabilir baglam almasini saglar.", "", "Operasyon Direktoru"],
      ["Mohammad Rezaei", "Emlak, insaat, malzeme ve teklif gorusmelerini yonetir.", "", "Gayrimenkul Masasi Lideri"],
      ["Reza Rezaei", "Ticaret, sevkiyat, para transferi ve ticari finans taleplerini yonetir.", "", "Ticaret ve Finans Masasi Lideri"],
    ],
    exploreSummary: "Bu kalip daha sonra tum grup sitelerinde yeniden kullanilabilir, boylece ziyaretciler genis sirket yapisi icindeki yerlerini anlar.",
    exploreParentTitle: "Holding Sirketi",
    exploreParentText: "Kurumsal kimlik, grup yonlendirmesi, ortakliklar ve birden fazla is birimini kapsayan talepler.",
    contactSummary: "Bu formu ortaklik tanitimlari, grup seviyesinde talepler veya birden fazla is birimini kapsayan sorular icin kullanin. Is alani, ulke, zamanlama ve tercih edilen iletisim yolunu ekleyin.",
  },
  fa: {
    heroEyebrow: "شرکت هلدینگ مادر",
    heroTitle: "نقطه ورود استراتژیک",
    heroMuted: "برای گروه کسب‌وکار رضایی.",
    heroLead: "REZAEI GLOBAL LLC سه واحد تخصصی در حوزه املاک، مالی و تجارت، اقامت، ویزا، ترجمه و ثبت شرکت را هماهنگ می‌کند.",
    heroPrimary: "انتخاب واحد تجاری",
    heroSecondary: "درباره شرکت مادر",
    companySummary: "REZAEI GLOBAL LLC شرکت مادر پشت سه واحد تخصصی است. هدف آن روشن نگه داشتن ساختار گروه، مسیر مشتری و رساندن هر گفت‌وگوی خدماتی به تیم درست است.",
    companyAlt: "REZAEI GLOBAL LLC به این دلیل شکل گرفته که بسیاری از درخواست‌های جدی تجاری فقط در یک دسته باقی نمی‌مانند.",
    groupSummary: "REZAEI GLOBAL LLC به عنوان نهاد مادر با کارکردهای داخلی حاکمیت، مشارکت و توسعه کسب‌وکار بالای سه واحد تخصصی فعالیت می‌کند.",
    workSummary: "این بخش توضیح می‌دهد که یک درخواست کلی چگونه به گفت‌وگوی متمرکز با تیم درست تبدیل می‌شود.",
    governanceSummary: "این بخش نشان می‌دهد گروه چگونه ارتباطات حرفه‌ای را حفظ می‌کند و برای CMS، پنل مدیریت و محتوای ساختاری آینده آماده می‌ماند.",
    teamSummary: "با گروه رهبری آشنا شوید که ارتباطات گروه را روشن نگه می‌دارد و مشتریان را به میز تخصصی درست متصل می‌کند.",
    teamButton: "آشنایی با تیم",
    teamCards: [
      ["Hosein Rezaei", "جهت‌گیری گروه را تعیین می‌کند و هر درخواست را به واحد تجاری درست هدایت می‌کند.", "", "مدیرعامل گروه"],
      ["Ali Rezaei", "کیفیت دریافت را بررسی می‌کند و زمینه قابل استفاده را به تیم‌های تخصصی می‌رساند.", "", "مدیر عملیات"],
      ["Mohammad Rezaei", "گفت‌وگوهای املاک، ساخت‌وساز، مصالح و استعلام قیمت را هدایت می‌کند.", "", "رئیس میز املاک"],
      ["Reza Rezaei", "درخواست‌های تجارت، حمل، انتقال ارز و امور مالی تجاری را مدیریت می‌کند.", "", "رئیس میز تجارت و مالی"],
    ],
    exploreSummary: "این الگو بعداً در همه وب‌سایت‌های گروه قابل استفاده است تا بازدیدکنندگان جایگاه خود را در ساختار گسترده شرکت بفهمند.",
    exploreParentTitle: "شرکت هلدینگ",
    exploreParentText: "هویت شرکتی، مسیریابی گروه، مشارکت‌ها و درخواست‌هایی که بیش از یک واحد تجاری را درگیر می‌کنند.",
    contactSummary: "از این فرم برای معرفی همکاری، درخواست‌های سطح گروه یا پرسش‌هایی که چند واحد تجاری را درگیر می‌کند استفاده کنید. حوزه کسب‌وکار، کشور، زمان‌بندی و روش تماس ترجیحی را بنویسید.",
  },
  ar: {
    heroEyebrow: "الشركة القابضة الأم",
    heroTitle: "نقطة الدخول الاستراتيجية",
    heroMuted: "لمجموعة أعمال رضائي.",
    heroLead: "تنسق REZAEI GLOBAL LLC ثلاث وحدات متخصصة في العقارات والتمويل والتجارة والإقامة والتأشيرة والترجمة وتأسيس الشركات.",
    heroPrimary: "اختر وحدة عمل",
    heroSecondary: "حول الشركة الأم",
    companySummary: "REZAEI GLOBAL LLC هي الشركة الأم خلف ثلاث وحدات متخصصة. هدفها إبقاء المجموعة مفهومة ومسار العميل واضحاً وكل محادثة خدمة مع الفريق المناسب.",
    companyAlt: "توجد REZAEI GLOBAL LLC لأن العديد من الطلبات التجارية الجادة لا تبقى داخل فئة واحدة.",
    groupSummary: "تعمل REZAEI GLOBAL LLC ككيان أم بوظائف داخلية للحكومة والشراكات وتطوير الأعمال فوق الوحدات الثلاث المتخصصة.",
    workSummary: "يوضح هذا القسم كيف يتحول الطلب الواسع إلى محادثة مركزة مع الفريق المناسب.",
    governanceSummary: "يوضح هذا القسم كيف تحافظ المجموعة على تواصل مهني مع ترك مساحة لأنظمة CMS والإدارة والمحتوى المنظم مستقبلاً.",
    teamSummary: "تعرف على فريق القيادة الذي يحافظ على وضوح تواصل المجموعة ويوصل العملاء إلى المكتب المتخصص المناسب.",
    teamButton: "تعرف على الفريق",
    teamCards: [
      ["Hosein Rezaei", "يحدد اتجاه المجموعة ويوجه كل طلب إلى وحدة الأعمال المناسبة.", "", "المدير العام للمجموعة"],
      ["Ali Rezaei", "يراجع جودة الاستقبال ويضمن وصول سياق قابل للاستخدام إلى الفرق المتخصصة.", "", "مدير العمليات"],
      ["Mohammad Rezaei", "يقود محادثات العقارات والبناء والمواد وعروض الأسعار.", "", "قائد مكتب العقارات"],
      ["Reza Rezaei", "يتولى طلبات التجارة والشحن وتحويل العملات والتمويل التجاري.", "", "قائد مكتب التجارة والتمويل"],
    ],
    exploreSummary: "يمكن إعادة استخدام هذا النمط لاحقاً عبر جميع مواقع المجموعة حتى يفهم الزوار موقعهم داخل هيكل الشركة الأوسع.",
    exploreParentTitle: "الشركة القابضة",
    exploreParentText: "الهوية المؤسسية وتوجيه المجموعة والشراكات والطلبات التي تمتد عبر أكثر من وحدة عمل.",
    contactSummary: "استخدم هذا النموذج للتعريف بالشراكات أو الطلبات على مستوى المجموعة أو أي استفسار يمتد عبر أكثر من وحدة عمل. اذكر مجال العمل والبلد والجدول الزمني وطريقة التواصل المفضلة.",
  },
};

function genericLocalizedDetail(lang, pageTitle, pageText) {
  const copy = {
    en: {
      cards: [
        ["Page focus", pageText],
        ["Visitor path", "This page helps visitors understand the right next step."],
        ["Request details", "The first message should include the core context needed for follow-up."],
        ["Next step", "The inquiry can be routed to the right team."],
      ],
      process: ["Read the page", "Prepare request details", "Send inquiry", "Continue with follow-up"],
      contact: pageText,
    },
    tr: {
      cards: [
        ["Sayfa odağı", pageText],
        ["Ziyaretçi yolu", "Bu sayfa ziyaretçinin doğru sonraki adımı anlamasına yardımcı olur."],
        ["Talep detayları", "İlk mesaj takip için gerekli temel bağlamı içermelidir."],
        ["Sonraki adım", "Talep doğru ekibe yönlendirilebilir."],
      ],
      process: ["Sayfayı inceleyin", "Talep detaylarını hazırlayın", "Talebi gönderin", "Doğru ekiple takip edin"],
      contact: pageText,
    },
    fa: {
      cards: [
        ["تمرکز صفحه", pageText],
        ["مسیر بازدیدکننده", "این صفحه کمک می‌کند بازدیدکننده مرحله بعدی درست را تشخیص دهد."],
        ["جزئیات درخواست", "پیام اول باید زمینه اصلی لازم برای پیگیری را داشته باشد."],
        ["مرحله بعد", "درخواست می‌تواند به تیم درست ارجاع شود."],
      ],
      process: ["صفحه را بررسی کنید", "جزئیات درخواست را آماده کنید", "درخواست را ارسال کنید", "با تیم درست پیگیری کنید"],
      contact: pageText,
    },
    ar: {
      cards: [
        ["تركيز الصفحة", pageText],
        ["مسار الزائر", "تساعد هذه الصفحة الزائر على فهم الخطوة التالية المناسبة."],
        ["تفاصيل الطلب", "يجب أن تتضمن الرسالة الأولى السياق الأساسي اللازم للمتابعة."],
        ["الخطوة التالية", "يمكن توجيه الطلب إلى الفريق المناسب."],
      ],
      process: ["راجع الصفحة", "جهز تفاصيل الطلب", "أرسل الاستفسار", "تابع مع الفريق المناسب"],
      contact: pageText,
    },
  };
  return copy[lang] || copy.en;
}

function localizedDetailFromContent(content, fallbackDetail, lang = "en", pageTitle = "", pageText = "") {
  const sections = content?.sections || [];
  const overviewSection = sections.find((section) => section.key === "overview") || sections.find((section) => section.key !== "hero" && section.text);
  const cardSection = sections.find((section) => section.cards?.length);
  const processSection = sections.find((section) => section.type === "process" || section.key === "process" || section.key === "standards");
  const contactSection = sections.find((section) => section.type === "contact" || section.key === "contact");
  const genericDetail = genericLocalizedDetail(lang, pageTitle, pageText);
  const baseDetail = lang === "en" ? fallbackDetail : { ...fallbackDetail, ...genericDetail };
  return {
    ...baseDetail,
    overview: overviewSection?.text || baseDetail.overview,
    cards: cardSection?.cards?.length ? cardSection.cards : baseDetail.cards,
    process: processSection?.cards?.length
      ? processSection.cards.map(([title, text]) => [title, text].filter(Boolean).join(": "))
      : baseDetail.process,
    contact: contactSection?.text || baseDetail.contact,
  };
}

function buildPageContent({ siteKey, pageId, pageLabel, pageTitle, pageText, detail, detailCards, detailProcess, lang = "en" }) {
  const text = generatedCopy[lang] || generatedCopy.en;
  const voices = localizedVoices[lang] || localizedVoices.en;
  const voice = voices[siteKey] || voices.holding;
  const primaryCards = detailCards.length ? detailCards : [[pageTitle, pageText]];
  const firstCard = primaryCards[0] || [pageTitle, pageText];
  const secondCard = primaryCards[1] || firstCard;
  const thirdCard = primaryCards[2] || secondCard;
  const fourthCard = primaryCards[3] || thirdCard;
  const pathText = detailProcess.join(" -> ");

  return {
    narrative: [
      {
        title: text.whoUses(pageLabel),
        text: text.whoText({ audience: voice.audience, pageTitle }),
      },
      {
        title: text.decideTitle,
        text: text.decideText({ outcome: voice.outcome }),
      },
      {
        title: text.firstMessageTitle,
        text: text.firstMessageText({ noun: voice.noun, record: voice.record, contact: detail.contact }),
      },
    ],
    deliverables: primaryCards.map(([cardTitle, cardText], index) => ({
      title: cardTitle,
      text: text.deliverableText({ cardText, pageTitle }),
      meta: text.meta[index % text.meta.length],
    })),
    scenarios: [
      {
        title: text.scenarioRequest(firstCard[0]),
        text: text.scenarioRequestText({ title: firstCard[0] }),
      },
      {
        title: text.scenarioPlanning(secondCard[0]),
        text: text.scenarioPlanningText({ title: secondCard[0] }),
      },
      {
        title: text.scenarioCoordination(thirdCard[0]),
        text: text.scenarioCoordinationText({ title: thirdCard[0] }),
      },
      {
        title: text.scenarioFollowUp(fourthCard[0]),
        text: text.scenarioFollowUpText({ title: fourthCard[0], pathText }),
      },
    ],
    checklist: text.checklist({ noun: voice.noun }),
    questions: [
      {
        title: text.rightPage(pageTitle),
        text: text.rightPageText({ pageText }),
      },
      {
        title: text.afterForm,
        text: text.afterFormText({ pathText }),
      },
      {
        title: text.shortMessage,
        text: text.shortMessageText,
      },
    ],
  };
}

function getLayoutVariant(siteKey, pageId) {
  if (["faq", "privacy", "terms"].includes(pageId)) return "support";
  if (["home", "about", "leadership", "governance", "team"].includes(pageId)) return "editorial";
  if (["properties", "projects", "materials", "market-insights"].includes(pageId)) return "showcase";
  if (["import-export", "shipping", "currency-transfer", "foreign-exchange", "trade-desk"].includes(pageId)) return "operations";
  if (["corporate-setup", "residency-visa", "legalization", "translation", "case-review"].includes(pageId)) return "casework";
  if (pageId === "contact") return "contactFirst";
  return siteKey === "holding" ? "editorial" : "showcase";
}

function buildSignatureContent({ layoutVariant, pageTitle, detailCards, detailProcess, contentDepth, lang = "en" }) {
  const fallbackHandling = {
    en: "Focused request handling",
    tr: "Odakli talep yonetimi",
    fa: "رسیدگی متمرکز به درخواست",
    ar: "معالجة طلب مركزة",
  };
  const cards = detailCards.length ? detailCards : contentDepth.deliverables.map((item) => [item.title, item.text]);
  const first = cards[0] || [pageTitle, fallbackHandling[lang] || fallbackHandling.en];
  const second = cards[1] || first;
  const third = cards[2] || second;
  const fourth = cards[3] || third;
  const variantCopy = {
    editorial: {
      eyebrow: { en: "Operating model", tr: "Isleyis modeli", fa: "مدل عملیاتی", ar: "نموذج التشغيل" },
      title: { en: `${pageTitle} operating view`, tr: `${pageTitle} isleyis gorunumu`, fa: `نمای عملیاتی ${pageTitle}`, ar: `عرض تشغيل ${pageTitle}` },
      intro: {
        en: "A corporate page should make the business easier to understand, not simply add more description. This view turns the page into a clear model of responsibilities, standards, and follow-up.",
        tr: "Kurumsal sayfa isi daha anlasilir kilmalidir. Bu gorunum sorumluluklari, standartlari ve takibi net bir modele donusturur.",
        fa: "صفحه شرکتی باید کسب‌وکار را قابل فهم‌تر کند، نه فقط توضیح بیشتری اضافه کند. این بخش مسئولیت‌ها، استانداردها و پیگیری را به یک مدل روشن تبدیل می‌کند.",
        ar: "يجب أن تجعل الصفحة المؤسسية العمل أوضح، لا أن تضيف وصفاً فقط. يحول هذا العرض المسؤوليات والمعايير والمتابعة إلى نموذج واضح.",
      },
      metrics: [
        ["01", { en: "Brand clarity", tr: "Marka netligi", fa: "شفافیت برند", ar: "وضوح العلامة" }, first[0]],
        ["02", { en: "Service routing", tr: "Hizmet yonlendirme", fa: "مسیریابی خدمات", ar: "توجيه الخدمة" }, second[0]],
        ["03", { en: "Follow-up standard", tr: "Takip standardi", fa: "استاندارد پیگیری", ar: "معيار المتابعة" }, third[0]],
      ],
      lanes: [
        [{ en: "Position", tr: "Konum", fa: "جایگاه", ar: "الموقع" }, first[1]],
        [{ en: "Govern", tr: "Yonet", fa: "حاکمیت", ar: "الحوكمة" }, second[1]],
        [{ en: "Route", tr: "Yonlendir", fa: "مسیریابی", ar: "التوجيه" }, third[1]],
        [{ en: "Improve", tr: "Iyilestir", fa: "بهبود", ar: "التحسين" }, fourth[1]],
      ],
    },
    showcase: {
      eyebrow: { en: "Showcase board", tr: "Vitrin panosu", fa: "برد نمایش", ar: "لوحة العرض" },
      title: { en: `${pageTitle} display logic`, tr: `${pageTitle} sunum mantigi`, fa: `منطق نمایش ${pageTitle}`, ar: `منطق عرض ${pageTitle}` },
      intro: {
        en: "Showcase pages need visible comparison points. This board separates opportunity, requirement, supply, and response so visitors can scan the page like a working portfolio instead of a brochure.",
        tr: "Vitrin sayfalari gorunur karsilastirma noktalarina ihtiyac duyar. Bu pano firsat, gereksinim, tedarik ve yaniti ayirir.",
        fa: "صفحات نمایشی به نقاط مقایسه روشن نیاز دارند. این بخش فرصت، نیاز، تامین و پاسخ را جدا می‌کند تا صفحه مثل یک نمونه‌کار قابل اسکن باشد.",
        ar: "تحتاج صفحات العرض إلى نقاط مقارنة واضحة. تفصل هذه اللوحة الفرصة والمتطلبات والتوريد والاستجابة.",
      },
      metrics: [
        [{ en: "Scope", tr: "Kapsam", fa: "دامنه", ar: "النطاق" }, { en: "Property or supply", tr: "Mulk veya tedarik", fa: "ملک یا تامین", ar: "عقار أو توريد" }, first[0]],
        [{ en: "Fit", tr: "Uyum", fa: "تناسب", ar: "الملاءمة" }, { en: "Project context", tr: "Proje baglami", fa: "زمینه پروژه", ar: "سياق المشروع" }, second[0]],
        [{ en: "Quote", tr: "Teklif", fa: "قیمت‌گذاری", ar: "عرض السعر" }, { en: "Decision details", tr: "Karar detaylari", fa: "جزئیات تصمیم", ar: "تفاصيل القرار" }, third[0]],
      ],
      lanes: [
        [{ en: "Opportunity", tr: "Firsat", fa: "فرصت", ar: "الفرصة" }, first[1]],
        [{ en: "Requirement", tr: "Gereksinim", fa: "نیاز", ar: "المتطلب" }, second[1]],
        [{ en: "Evidence", tr: "Kanıt", fa: "شواهد", ar: "الدليل" }, third[1]],
        [{ en: "Next action", tr: "Sonraki adim", fa: "اقدام بعدی", ar: "الإجراء التالي" }, fourth[1]],
      ],
    },
    operations: {
      eyebrow: { en: "Control desk", tr: "Kontrol masasi", fa: "میز کنترل", ar: "مكتب التحكم" },
      title: { en: `${pageTitle} workflow desk`, tr: `${pageTitle} is akisi masasi`, fa: `میز فرایند ${pageTitle}`, ar: `مكتب سير عمل ${pageTitle}` },
      intro: {
        en: "Operations pages work best when they feel like coordination tools. This desk separates the goods, route, documents, payment, and timing signals needed before a useful response can happen.",
        tr: "Operasyon sayfalari koordinasyon araci gibi hissettiginde daha iyi calisir. Bu masa mal, rota, belge, odeme ve zamanlama sinyallerini ayirir.",
        fa: "صفحات عملیاتی وقتی بهتر کار می‌کنند که مثل ابزار هماهنگی باشند. این بخش کالا، مسیر، اسناد، پرداخت و زمان‌بندی را از هم جدا می‌کند.",
        ar: "تعمل صفحات العمليات بشكل أفضل عندما تبدو كأدوات تنسيق. يفصل هذا المكتب البضائع والمسار والمستندات والدفع والتوقيت.",
      },
      metrics: [
        [{ en: "Route", tr: "Rota", fa: "مسیر", ar: "المسار" }, { en: "Origin to destination", tr: "Cikistan varisa", fa: "از مبدا تا مقصد", ar: "من المنشأ إلى الوجهة" }, first[0]],
        [{ en: "Docs", tr: "Belgeler", fa: "اسناد", ar: "المستندات" }, { en: "Papers and status", tr: "Evrak ve durum", fa: "مدارک و وضعیت", ar: "الأوراق والحالة" }, second[0]],
        [{ en: "Timing", tr: "Zamanlama", fa: "زمان‌بندی", ar: "التوقيت" }, { en: "Payment and movement", tr: "Odeme ve hareket", fa: "پرداخت و حرکت", ar: "الدفع والحركة" }, third[0]],
      ],
      lanes: [
        [{ en: "Request intake", tr: "Talep alimi", fa: "دریافت درخواست", ar: "استلام الطلب" }, first[1]],
        [{ en: "Document check", tr: "Belge kontrolu", fa: "بررسی اسناد", ar: "فحص المستندات" }, second[1]],
        [{ en: "Route planning", tr: "Rota planlama", fa: "برنامه‌ریزی مسیر", ar: "تخطيط المسار" }, third[1]],
        [{ en: "Coordination", tr: "Koordinasyon", fa: "هماهنگی", ar: "التنسيق" }, fourth[1]],
      ],
    },
    casework: {
      eyebrow: { en: "Case file", tr: "Dosya", fa: "پرونده", ar: "ملف الحالة" },
      title: { en: `${pageTitle} readiness file`, tr: `${pageTitle} hazirlik dosyasi`, fa: `پرونده آمادگی ${pageTitle}`, ar: `ملف جاهزية ${pageTitle}` },
      intro: {
        en: "Casework pages should feel calm and practical. This file view separates documents, official purpose, deadline, and service path so visitors know what to prepare before the team reviews the case.",
        tr: "Dosya sayfalari sakin ve pratik hissettirmelidir. Bu gorunum belgeleri, resmi amaci, son tarihi ve hizmet yolunu ayirir.",
        fa: "صفحات پرونده باید آرام و کاربردی باشند. این بخش اسناد، هدف رسمی، مهلت و مسیر خدمات را جدا می‌کند.",
        ar: "يجب أن تكون صفحات الحالات هادئة وعملية. يفصل هذا العرض المستندات والغرض الرسمي والموعد النهائي ومسار الخدمة.",
      },
      metrics: [
        [{ en: "Docs", tr: "Belgeler", fa: "اسناد", ar: "المستندات" }, { en: "Available papers", tr: "Mevcut evrak", fa: "مدارک موجود", ar: "الأوراق المتاحة" }, first[0]],
        [{ en: "Use", tr: "Kullanim", fa: "کاربرد", ar: "الاستخدام" }, { en: "Official purpose", tr: "Resmi amac", fa: "هدف رسمی", ar: "الغرض الرسمي" }, second[0]],
        [{ en: "Path", tr: "Yol", fa: "مسیر", ar: "المسار" }, { en: "Service sequence", tr: "Hizmet sirasi", fa: "ترتیب خدمات", ar: "تسلسل الخدمة" }, third[0]],
      ],
      lanes: [
        [{ en: "Document set", tr: "Belge seti", fa: "مجموعه اسناد", ar: "مجموعة المستندات" }, first[1]],
        [{ en: "Official use", tr: "Resmi kullanim", fa: "استفاده رسمی", ar: "الاستخدام الرسمي" }, second[1]],
        [{ en: "Timing", tr: "Zamanlama", fa: "زمان‌بندی", ar: "التوقيت" }, third[1]],
        [{ en: "Service path", tr: "Hizmet yolu", fa: "مسیر خدمات", ar: "مسار الخدمة" }, fourth[1]],
      ],
    },
    support: {
      eyebrow: { en: "Reference center", tr: "Referans merkezi", fa: "مرکز مرجع", ar: "مركز المرجع" },
      title: { en: `${pageTitle} reference map`, tr: `${pageTitle} referans haritasi`, fa: `نقشه مرجع ${pageTitle}`, ar: `خريطة مرجع ${pageTitle}` },
      intro: {
        en: "Support pages should be easy to skim and verify. This map separates expectations, visitor choice, responsible handling, and the next action.",
        tr: "Destek sayfalari kolay taranir ve dogrulanir olmalidir. Bu harita beklenti, ziyaretci secimi, sorumlu islem ve sonraki adimi ayirir.",
        fa: "صفحات پشتیبانی باید سریع قابل مرور و بررسی باشند. این نقشه انتظارها، انتخاب بازدیدکننده، رسیدگی مسئولانه و اقدام بعدی را جدا می‌کند.",
        ar: "يجب أن تكون صفحات الدعم سهلة الفحص والتحقق. تفصل هذه الخريطة التوقعات وخيار الزائر والمعالجة المسؤولة والخطوة التالية.",
      },
      metrics: [
        [{ en: "Read", tr: "Oku", fa: "مطالعه", ar: "اقرأ" }, { en: "Understand scope", tr: "Kapsami anla", fa: "درک دامنه", ar: "فهم النطاق" }, first[0]],
        [{ en: "Decide", tr: "Karar ver", fa: "تصمیم", ar: "قرر" }, { en: "Know what to send", tr: "Ne gonderecegini bil", fa: "دانستن موارد ارسال", ar: "معرفة ما يرسل" }, second[0]],
        [{ en: "Act", tr: "Harekete gec", fa: "اقدام", ar: "تصرف" }, { en: "Use the right form", tr: "Dogru formu kullan", fa: "استفاده از فرم درست", ar: "استخدم النموذج المناسب" }, third[0]],
      ],
      lanes: [
        [{ en: "What it covers", tr: "Neyi kapsar", fa: "چه چیزی را پوشش می‌دهد", ar: "ما الذي يغطيه" }, first[1]],
        [{ en: "What it does not replace", tr: "Neyin yerine gecmez", fa: "جایگزین چه چیزی نیست", ar: "ما لا يستبدله" }, second[1]],
        [{ en: "What visitors control", tr: "Ziyaretci neyi kontrol eder", fa: "کنترل بازدیدکننده", ar: "ما يتحكم به الزائر" }, third[1]],
        [{ en: "Where to go next", tr: "Sonraki yer", fa: "مرحله بعد", ar: "إلى أين بعد ذلك" }, fourth[1]],
      ],
    },
    contactFirst: {
      eyebrow: { en: "Inquiry route", tr: "Talep rotasi", fa: "مسیر درخواست", ar: "مسار الاستفسار" },
      title: { en: `${pageTitle} routing desk`, tr: `${pageTitle} yonlendirme masasi`, fa: `میز مسیریابی ${pageTitle}`, ar: `مكتب توجيه ${pageTitle}` },
      intro: {
        en: "Contact pages should help visitors write a useful message. This route view shows what the team needs in order to classify, prioritize, and answer the inquiry.",
        tr: "Iletisim sayfalari ziyaretcinin yararli bir mesaj yazmasina yardim etmelidir. Bu gorunum ekibin talebi siniflandirmak, onceliklendirmek ve yanitlamak icin neye ihtiyac duydugunu gosterir.",
        fa: "صفحات تماس باید کمک کنند بازدیدکننده پیام مفیدی بنویسد. این بخش نشان می‌دهد تیم برای دسته‌بندی، اولویت‌بندی و پاسخ به درخواست چه چیزهایی نیاز دارد.",
        ar: "يجب أن تساعد صفحات التواصل الزائر على كتابة رسالة مفيدة. يوضح هذا العرض ما يحتاجه الفريق لتصنيف الطلب وترتيبه والرد عليه.",
      },
      metrics: [
        [{ en: "Type", tr: "Tur", fa: "نوع", ar: "النوع" }, { en: "Request category", tr: "Talep kategorisi", fa: "دسته درخواست", ar: "فئة الطلب" }, first[0]],
        [{ en: "Context", tr: "Baglam", fa: "زمینه", ar: "السياق" }, { en: "Key details", tr: "Ana detaylar", fa: "جزئیات کلیدی", ar: "التفاصيل الرئيسية" }, second[0]],
        [{ en: "Reply", tr: "Yanit", fa: "پاسخ", ar: "الرد" }, { en: "Follow-up path", tr: "Takip yolu", fa: "مسیر پیگیری", ar: "مسار المتابعة" }, third[0]],
      ],
      lanes: [
        [{ en: "Classify", tr: "Siniflandir", fa: "دسته‌بندی", ar: "التصنيف" }, first[1]],
        [{ en: "Clarify", tr: "Netlestir", fa: "شفاف‌سازی", ar: "التوضيح" }, second[1]],
        [{ en: "Assign", tr: "Ata", fa: "ارجاع", ar: "الإسناد" }, third[1]],
        [{ en: "Respond", tr: "Yanitla", fa: "پاسخ", ar: "الرد" }, fourth[1]],
      ],
    },
  };
  const signature = variantCopy[layoutVariant] || variantCopy.editorial;
  const pick = (value) => (typeof value === "object" && value !== null ? value[lang] || value.en : value);

  return {
    eyebrow: pick(signature.eyebrow),
    title: pick(signature.title),
    intro: pick(signature.intro),
    metrics: signature.metrics.map(([value, label, text]) => [pick(value), pick(label), text]),
    lanes: signature.lanes.map(([title, text]) => [pick(title), text]),
    steps: detailProcess.map((step, index) => ({
      title: (generatedCopy[lang] || generatedCopy.en).stage(index),
      text: step,
    })),
  };
}

function getCurrentPath() {
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  return currentPath === "/group" ? "/how-we-work" : currentPath;
}

function getCanonicalPath(pathname) {
  const currentPath = pathname.replace(/\/$/, "") || "/";
  return currentPath === "/group" ? "/how-we-work" : currentPath;
}

function normalizePageHref(item) {
  if (!Array.isArray(item)) return item;
  const nextItem = [...item];
  if (nextItem[1] === "/group") nextItem[1] = "/how-we-work";
  if (nextItem[1] === "/how-we-work") nextItem[0] = "group";
  return nextItem;
}

function scrollToHashTarget(hash) {
  const targetId = hash.replace("#", "");
  if (!targetId) return;

  window.setTimeout(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
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

function isNewsNavItem(item) {
  const [sectionId, href, label] = item || [];
  return [sectionId, href, label].some((value) => String(value || "").toLowerCase().includes("news"));
}

function resolveHomeNavHref(sectionId, href) {
  if (href && href !== "/" && !href.startsWith("/#")) return href;
  if (sectionId === "home") return "/#home";
  return `/#${sectionId}`;
}

function buildTeamShowcaseMembers(cards, fallbackCards) {
  const source = cards?.length ? cards : fallbackCards;
  return source.map((card, index) => {
    const [name, bio, , role, , imageUrl] = card;
    return {
      name,
      role: role || "",
      bio,
      image: resolveTeamImage(imageUrl, index),
    };
  });
}

function isRemovedHomeNavItem(item) {
  const [sectionId, href, label] = item || [];
  return [sectionId, href, label].some((value) => {
    const normalized = String(value || "").toLowerCase();
    if (normalized.includes("group-structure") || normalized.includes("group structure")) return true;
    if (normalized === "partners" || normalized === "/partners" || normalized === "partner") return true;
    if (normalized.includes("/partners")) return true;
    return false;
  });
}

const governancePageCopy = {
  en: {
    eyebrow: "Group Standards",
    hero: "Governance & Operating Standards",
    heroSub: "REZAEI GLOBAL LLC maintains clear operating standards across every business unit — from client communication and inquiry routing to brand presentation and partner coordination.",
    principlesEyebrow: "Core Principles",
    principlesTitle: "How the group maintains consistency.",
    principles: [
      { title: "Accountability", text: "Every inquiry is treated as a routing decision first. The group ensures each message reaches the correct specialist team with enough context to respond effectively." },
      { title: "Operating Discipline", text: "Service boundaries between real estate, trade, and residency are maintained so clients always know which team handles their case and why." },
      { title: "Brand Consistency", text: "Each business unit presents the same corporate identity while operating with its own service language and specialist focus." },
      { title: "Communication Standards", text: "The group maintains professional, concise, and useful messaging for clients, partners, and international visitors across all platforms." },
    ],
    frameworkEyebrow: "Framework",
    frameworkTitle: "Group governance in practice.",
    frameworkCols: [
      { label: "Holding Level", items: ["Corporate communication", "Brand standards", "Partner introductions", "Group strategy"] },
      { label: "Business Units", items: ["Service-specific operations", "Specialist inquiry handling", "Platform-level content", "Client follow-up"] },
      { label: "Client Interaction", items: ["Clear entry points", "Informed routing", "Focused inquiry paths", "Professional response"] },
    ],
    processEyebrow: "Process",
    processTitle: "How standards are applied.",
    processSteps: [
      ["Keep structure clear", "Each page and platform has a defined role within the group structure."],
      ["Separate service ownership", "Inquiries are not shared across units — each request has one owning team."],
      ["Route inquiries responsibly", "The holding ensures every message reaches the right specialist without delay."],
      ["Improve with real needs", "Feedback from actual client interactions shapes how the group evolves its standards."],
    ],
    ctaEyebrow: "Corporate Contact",
    ctaTitle: "Corporate governance or partnership enquiries.",
    ctaText: "For governance questions, corporate introductions, or partnership-level conversations, contact the group directly.",
    ctaButton: "Send a corporate message",
  },
  tr: {
    eyebrow: "Grup Standartları",
    hero: "Yönetim & Operasyon Standartları",
    heroSub: "REZAEI GLOBAL LLC, müşteri iletişimi ve talep yönlendirmesinden marka sunumu ve ortak koordinasyonuna kadar her iş biriminde net operasyon standartlarını korur.",
    principlesEyebrow: "Temel Prensipler",
    principlesTitle: "Grup tutarlılığı nasıl sağlar.",
    principles: [
      { title: "Sorumluluk", text: "Her talep önce bir yönlendirme kararı olarak ele alınır. Grup, her mesajın yeterli bağlamla doğru uzman ekibe ulaşmasını sağlar." },
      { title: "Operasyonel Disiplin", text: "Gayrimenkul, ticaret ve oturum arasındaki hizmet sınırları korunur; müşteriler her zaman hangi ekibin davalarını yönettiğini bilir." },
      { title: "Marka Tutarlılığı", text: "Her iş birimi, kendi hizmet dili ve uzmanlık odağıyla çalışırken aynı kurumsal kimliği sunar." },
      { title: "İletişim Standartları", text: "Grup, tüm platformlarda müşteriler, ortaklar ve uluslararası ziyaretçiler için profesyonel ve özlü mesajlaşmayı sürdürür." },
    ],
    frameworkEyebrow: "Çerçeve",
    frameworkTitle: "Grup yönetimi pratikte.",
    frameworkCols: [
      { label: "Holding Seviyesi", items: ["Kurumsal iletişim", "Marka standartları", "Ortak tanıtımı", "Grup stratejisi"] },
      { label: "İş Birimleri", items: ["Hizmete özgü operasyonlar", "Uzman talep yönetimi", "Platform içeriği", "Müşteri takibi"] },
      { label: "Müşteri Etkileşimi", items: ["Net giriş noktaları", "Bilinçli yönlendirme", "Odaklı talep yolları", "Profesyonel yanıt"] },
    ],
    processEyebrow: "Süreç",
    processTitle: "Standartlar nasıl uygulanır.",
    processSteps: [
      ["Yapıyı açık tut", "Her sayfa ve platform, grup yapısı içinde tanımlı bir role sahiptir."],
      ["Hizmet sahipliğini ayır", "Talepler birimler arasında paylaşılmaz — her talebin bir sahibi olan ekibi vardır."],
      ["Talepleri sorumlu yönlendir", "Holding, her mesajın gecikmesiz doğru uzmana ulaşmasını sağlar."],
      ["Gerçek ihtiyaçlarla geliş", "Gerçek müşteri etkileşimlerinden gelen geri bildirimler grubun nasıl gelişeceğini şekillendirir."],
    ],
    ctaEyebrow: "Kurumsal İletişim",
    ctaTitle: "Kurumsal yönetim veya ortaklık sorgulamaları.",
    ctaText: "Yönetim soruları, kurumsal tanıtımlar veya ortaklık düzeyinde görüşmeler için doğrudan grupla iletişime geçin.",
    ctaButton: "Kurumsal mesaj gönder",
  },
  fa: {
    eyebrow: "استانداردهای گروه",
    hero: "حاکمیت و استانداردهای عملیاتی",
    heroSub: "REZAEI GLOBAL LLC استانداردهای عملیاتی روشنی را در تمام واحدهای کسب‌وکار حفظ می‌کند — از ارتباط با مشتری و مسیریابی درخواست تا ارائه برند و هماهنگی با شرکا.",
    principlesEyebrow: "اصول اصلی",
    principlesTitle: "چگونه گروه ثبات را حفظ می‌کند.",
    principles: [
      { title: "پاسخگویی", text: "هر درخواست ابتدا به‌عنوان یک تصمیم مسیریابی در نظر گرفته می‌شود. گروه اطمینان حاصل می‌کند که هر پیام با زمینه کافی به تیم متخصص مناسب برسد." },
      { title: "انضباط عملیاتی", text: "مرزهای خدماتی بین املاک، تجارت و اقامت به‌وضوح حفظ می‌شوند تا مشتریان همیشه بدانند کدام تیم پرونده آن‌ها را مدیریت می‌کند." },
      { title: "ثبات برند", text: "هر واحد کسب‌وکار هویت یکسان شرکتی را ارائه می‌دهد در حالی که با زبان خدماتی و تمرکز تخصصی خود کار می‌کند." },
      { title: "استانداردهای ارتباطی", text: "گروه پیام‌رسانی حرفه‌ای و مختصر را برای مشتریان، شرکا و بازدیدکنندگان بین‌المللی در تمام پلتفرم‌ها حفظ می‌کند." },
    ],
    frameworkEyebrow: "چارچوب",
    frameworkTitle: "حاکمیت گروه در عمل.",
    frameworkCols: [
      { label: "سطح هلدینگ", items: ["ارتباطات شرکتی", "استانداردهای برند", "معرفی شرکا", "استراتژی گروه"] },
      { label: "واحدهای کسب‌وکار", items: ["عملیات خاص خدمات", "رسیدگی تخصصی به درخواست", "محتوای پلتفرم", "پیگیری مشتری"] },
      { label: "تعامل با مشتری", items: ["نقاط ورود روشن", "مسیریابی آگاهانه", "مسیرهای درخواست متمرکز", "پاسخ حرفه‌ای"] },
    ],
    processEyebrow: "فرآیند",
    processTitle: "چگونه استانداردها اعمال می‌شوند.",
    processSteps: [
      ["ساختار را روشن نگه دارید", "هر صفحه و پلتفرم نقش مشخصی در ساختار گروه دارد."],
      ["مالکیت خدمات را جدا کنید", "درخواست‌ها بین واحدها به اشتراک گذاشته نمی‌شوند — هر درخواست یک تیم مالک دارد."],
      ["درخواست‌ها را مسئولانه هدایت کنید", "هلدینگ اطمینان می‌دهد هر پیام بدون تأخیر به متخصص مناسب برسد."],
      ["با نیازهای واقعی بهبود یابید", "بازخورد از تعاملات واقعی مشتری شکل می‌دهد که گروه چگونه تکامل می‌یابد."],
    ],
    ctaEyebrow: "تماس شرکتی",
    ctaTitle: "سوالات حاکمیت شرکتی یا مشارکت.",
    ctaText: "برای سوالات حاکمیتی، معرفی‌های شرکتی یا مکالمات در سطح مشارکت، مستقیماً با گروه تماس بگیرید.",
    ctaButton: "ارسال پیام شرکتی",
  },
  ar: {
    eyebrow: "معايير المجموعة",
    hero: "الحوكمة ومعايير التشغيل",
    heroSub: "تحافظ REZAEI GLOBAL LLC على معايير تشغيل واضحة عبر كل وحدة أعمال — من تواصل العملاء وتوجيه الاستفسارات إلى تقديم العلامة التجارية وتنسيق الشراكات.",
    principlesEyebrow: "المبادئ الأساسية",
    principlesTitle: "كيف تحافظ المجموعة على الاتساق.",
    principles: [
      { title: "المساءلة", text: "يُعامَل كل استفسار أولاً باعتباره قرار توجيه. تضمن المجموعة وصول كل رسالة إلى الفريق المتخصص المناسب بسياق كافٍ للتصرف." },
      { title: "الانضباط التشغيلي", text: "تُحفظ حدود الخدمة بين العقارات والتجارة والإقامة بوضوح حتى يعرف العملاء دائماً أي فريق يتعامل مع حالتهم." },
      { title: "اتساق العلامة التجارية", text: "تقدم كل وحدة أعمال نفس الهوية المؤسسية بينما تعمل بلغة خدماتها الخاصة وتركيزها المتخصص." },
      { title: "معايير التواصل", text: "تحافظ المجموعة على مراسلات مهنية وموجزة ومفيدة للعملاء والشركاء والزوار الدوليين عبر جميع المنصات." },
    ],
    frameworkEyebrow: "الإطار",
    frameworkTitle: "حوكمة المجموعة على أرض الواقع.",
    frameworkCols: [
      { label: "مستوى القابضة", items: ["التواصل المؤسسي", "معايير العلامة التجارية", "تقديمات الشركاء", "استراتيجية المجموعة"] },
      { label: "وحدات الأعمال", items: ["العمليات الخاصة بالخدمة", "معالجة الاستفسارات المتخصصة", "محتوى المنصة", "متابعة العملاء"] },
      { label: "تفاعل العملاء", items: ["نقاط دخول واضحة", "توجيه مستنير", "مسارات استفسار مركزة", "استجابة مهنية"] },
    ],
    processEyebrow: "العملية",
    processTitle: "كيف يتم تطبيق المعايير.",
    processSteps: [
      ["إبقاء الهيكل واضحاً", "كل صفحة ومنصة لها دور محدد ضمن هيكل المجموعة."],
      ["فصل ملكية الخدمة", "لا تُشارك الاستفسارات عبر الوحدات — لكل طلب فريق مالك واحد."],
      ["توجيه الاستفسارات بمسؤولية", "تضمن القابضة وصول كل رسالة إلى المتخصص المناسب دون تأخير."],
      ["التحسين مع الاحتياجات الحقيقية", "تشكّل ملاحظات التفاعلات الفعلية مع العملاء كيفية تطور المجموعة."],
    ],
    ctaEyebrow: "التواصل المؤسسي",
    ctaTitle: "استفسارات حوكمة الشركات أو الشراكات.",
    ctaText: "لأسئلة الحوكمة والتعريفات المؤسسية والمحادثات على مستوى الشراكة، تواصل مع المجموعة مباشرةً.",
    ctaButton: "إرسال رسالة مؤسسية",
  },
};

const governancePrincipleIcons = [ShieldCheck, ClipboardCheck, BadgeCheck, FileText];

function GovernancePage({ lang, navigate, cmsHero, cmsData }) {
  const fallback = governancePageCopy[lang] || governancePageCopy.en;
  const pick = pickCms;
  const c = {
    eyebrow: pick(cmsHero?.eyebrow, fallback.eyebrow),
    hero: pick(cmsHero?.title, fallback.hero),
    heroSub: pick(cmsHero?.lead, fallback.heroSub),
    principlesEyebrow: pick(cmsData?.principlesEyebrow, fallback.principlesEyebrow),
    principlesTitle: pick(cmsData?.principlesTitle, fallback.principlesTitle),
    principles: pick(cmsData?.principles, fallback.principles),
    frameworkEyebrow: pick(cmsData?.frameworkEyebrow, fallback.frameworkEyebrow),
    frameworkTitle: pick(cmsData?.frameworkTitle, fallback.frameworkTitle),
    frameworkCols: pick(cmsData?.frameworkCols, fallback.frameworkCols),
    processEyebrow: pick(cmsData?.processEyebrow, fallback.processEyebrow),
    processTitle: pick(cmsData?.processTitle, fallback.processTitle),
    processSteps: pick(cmsData?.processSteps, fallback.processSteps),
    ctaEyebrow: pick(cmsData?.ctaEyebrow, fallback.ctaEyebrow),
    ctaTitle: pick(cmsData?.ctaTitle, fallback.ctaTitle),
    ctaText: pick(cmsData?.ctaText, fallback.ctaText),
    ctaButton: pick(cmsData?.ctaButton, fallback.ctaButton),
  };

  return (
    <>
      <section className="govHero">
        <div className="govHeroBackdrop" aria-hidden="true" />
        <div className="govHeroInner">
          <p className="eyebrow govEyebrow">{c.eyebrow}</p>
          <h1>{c.hero}</h1>
          <p className="govHeroSub">{c.heroSub}</p>
        </div>
      </section>

      <section className="govPrinciples layoutSection">
        <div className="sectionInner">
          <div className="govSectionHeader">
            <p className="eyebrow">{c.principlesEyebrow}</p>
            <h2>{c.principlesTitle}</h2>
          </div>
          <div className="govPrinciplesGrid">
            {c.principles.map(({ title, text }, index) => {
              const Icon = governancePrincipleIcons[index] || ShieldCheck;
              return (
                <article className="govPrincipleCard" key={title}>
                  <div className="govPrincipleIconWrap">
                    <Icon size={26} aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="govFramework">
        <div className="sectionInner govFrameworkInner">
          <div className="govFrameworkHeader">
            <p className="eyebrow govEyebrow">{c.frameworkEyebrow}</p>
            <h2>{c.frameworkTitle}</h2>
          </div>
          <div className="govFrameworkGrid">
            {c.frameworkCols.map(({ label, items }, colIndex) => (
              <div className="govFrameworkCol" key={label}>
                <span className="govColIndex">{String(colIndex + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
                <ul className="govFrameworkList">
                  {items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="govProcess layoutSection">
        <div className="sectionInner">
          <div className="govSectionHeader">
            <p className="eyebrow">{c.processEyebrow}</p>
            <h2>{c.processTitle}</h2>
          </div>
          <div className="govProcessTrack">
            {c.processSteps.map(([title, text], index) => (
              <article className="govProcessStep" key={title}>
                <span className="govStepNum">{String(index + 1).padStart(2, "0")}</span>
                <div className="govStepBody">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="govCta">
        <div className="govCtaInner">
          <p className="eyebrow govEyebrow">{c.ctaEyebrow}</p>
          <h2>{c.ctaTitle}</h2>
          <p>{c.ctaText}</p>
          <button type="button" className="primaryButton govCtaBtn" onClick={() => navigate("/contact")}>
            {c.ctaButton}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  );
}

/* ─── Group Page ─────────────────────────────────────────────── */

const groupUnitIcons = [ClipboardCheck, Target, BadgeCheck];

function GroupPage({ lang, navigate, cmsHero, cmsData }) {
  const fallback = groupPageHeroCopy[lang] || groupPageHeroCopy.en;
  const pick = pickCms;
  const c = {
    eyebrow: pick(cmsHero?.eyebrow, fallback.eyebrow),
    hero: pick(cmsHero?.title, fallback.hero),
    heroSub: pick(cmsHero?.lead || cmsHero?.summary, fallback.heroSub),
    unitsEyebrow: pick(cmsData?.unitsEyebrow, ""),
    unitsTitle: pick(cmsData?.unitsTitle, ""),
    units: pick(cmsData?.units, []),
    flowEyebrow: pick(cmsData?.flowEyebrow, ""),
    flowTitle: pick(cmsData?.flowTitle, ""),
    flowSteps: pick(cmsData?.flowSteps, []),
    holdingEyebrow: pick(cmsData?.holdingEyebrow, ""),
    holdingTitle: pick(cmsData?.holdingTitle, ""),
    holdingItems: pick(cmsData?.holdingItems, []),
    ctaEyebrow: pick(cmsData?.ctaEyebrow, ""),
    ctaTitle: pick(cmsData?.ctaTitle, ""),
    ctaText: pick(cmsData?.ctaText, ""),
    ctaButton: pick(cmsData?.ctaButton, fallback.ctaButton),
  };
  return (
    <>
      <section className="grpHero">
        <div className="grpHeroBackdrop" aria-hidden="true" />
        <div className="grpHeroInner">
          <p className="eyebrow grpEyebrow">{c.eyebrow}</p>
          <h1>{c.hero}</h1>
          <p className="grpHeroSub">{c.heroSub}</p>
        </div>
      </section>

      <section className="grpUnits layoutSection">
        <div className="sectionInner">
          <div className="grpSectionHeader">
            <p className="eyebrow">{c.unitsEyebrow}</p>
            <h2>{c.unitsTitle}</h2>
          </div>
          <div className="grpUnitsGrid">
            {c.units.map(({ title, scope, text, areas }, index) => {
              const Icon = groupUnitIcons[index] || Globe2;
              return (
                <article className="grpUnitCard" key={title}>
                  <div className="grpUnitCardTop">
                    <div className="grpUnitIconWrap">
                      <Icon size={24} aria-hidden="true" />
                    </div>
                  </div>
                  <p className="grpUnitScope">{scope}</p>
                  <h3>{title}</h3>
                  <p className="grpUnitText">{text}</p>
                  <ul className="grpUnitAreas">
                    {areas.map((area) => (
                      <li key={area}>
                        <CheckCircle2 size={13} aria-hidden="true" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grpFlow">
        <div className="sectionInner grpFlowInner">
          <div className="grpFlowHeader">
            <p className="eyebrow grpEyebrow">{c.flowEyebrow}</p>
            <h2>{c.flowTitle}</h2>
          </div>
          <ol className="grpFlowTrack">
            {c.flowSteps.map(([title, text], index) => (
              <li className="grpFlowStep" key={title}>
                <span className="grpFlowNum">{String(index + 1).padStart(2, "0")}</span>
                <div className="grpFlowBody">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grpHolding layoutSection">
        <div className="sectionInner">
          <div className="grpSectionHeader">
            <p className="eyebrow">{c.holdingEyebrow}</p>
            <h2>{c.holdingTitle}</h2>
          </div>
          <div className="grpHoldingGrid">
            {c.holdingItems.map(({ title, text }, index) => {
              const Icon = [Globe2, BadgeCheck, ShieldCheck, ClipboardCheck][index] || Globe2;
              return (
                <article className="grpHoldingCard" key={title}>
                  <div className="grpHoldingIconWrap">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grpCta">
        <div className="grpCtaInner">
          <p className="eyebrow grpEyebrow">{c.ctaEyebrow}</p>
          <h2>{c.ctaTitle}</h2>
          <p>{c.ctaText}</p>
          <button type="button" className="primaryButton grpCtaBtn" onClick={() => navigate("/contact")}>
            {c.ctaButton}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  );
}

/* ─── About Page ─────────────────────────────────────────────── */

const aboutPageCopy = {
  en: {
    heroEyebrow: "REZAEI GLOBAL LLC",
    heroTitle: "About the Holding Company",
    heroSub: "A multi-sector holding company connecting business, investment, real estate, trade, and immigration services across Oman and international markets.",
    heroTrust: "Incorporated in the Sultanate of Oman, REZAEI GLOBAL LLC operates as the parent entity behind three specialist service platforms — each independently focused, collectively coordinated.",
    heroCta1: "Explore Group Websites",
    heroCta2: "Contact the Company",

    identityEyebrow: "Company Identity",
    identityTitle: "One holding company. Multiple specialist operations.",
    identityText: "REZAEI GLOBAL LLC exists to connect clients, investors, and partners with the right specialist platform. Rather than offering every service under a single brand, the company structures its operations through dedicated business units — each with its own focus, team, and service language.",
    identityCards: [
      { label: "Holding Company", text: "REZAEI GLOBAL LLC is the parent entity, not a direct service provider. It owns, coordinates, and represents the group." },
      { label: "Multi-Sector Operations", text: "Three specialist platforms independently cover real estate, trade, and residency — connected through one corporate structure." },
      { label: "Oman-Based, International Reach", text: "Incorporated in the Sultanate of Oman with active operations across the Gulf, Turkey, and international markets." },
      { label: "Business-Focused Services", text: "The group serves corporate clients, investors, entrepreneurs, and professionals with serious and practical business needs." },
    ],

    mvvEyebrow: "Purpose & Direction",
    mvvCards: [
      { label: "Mission", text: "To connect clients with the right service, business unit, or specialist team — without unnecessary complexity, delay, or misdirection." },
      { label: "Vision", text: "A recognized multi-sector holding group with a clear, trusted presence across the Gulf and international business community." },
      { label: "Values", items: ["Clear, direct communication", "Professional accountability", "Focused service delivery", "Long-term business relationships"] },
    ],

    groupEyebrow: "Group Websites",
    groupTitle: "Three specialist platforms. One corporate group.",
    groupSub: "Each business unit operates its own platform, team, and service workflow. The holding company coordinates across all three.",
    groupCta: "Visit Website",
    groupUnits: [
      { title: "Residency, Visa & Translation", text: "Residency permits, visa applications, corporate registration, attestation, legalization, and certified translation services.", scope: "Documents · Mobility · Setup" },
      { title: "Real Estate, Construction & Materials", text: "Property acquisition, construction project coordination, building materials sourcing, and industrial supply chains.", scope: "Property · Projects · Supply" },
      { title: "Import, Export & General Trading", text: "Trade documentation, shipment coordination, currency transfer, foreign exchange, and cross-border payment support.", scope: "Trade · Payments · FX" },
    ],

    servicesEyebrow: "What We Do",
    servicesTitle: "Service areas across the group.",
    services: [
      { label: "Company Formation & Business Support", text: "Corporate registration, licensing, and business setup for companies entering Omani and regional markets." },
      { label: "Residency, Visa & Attestation", text: "Residency permits, work visas, investor visas, document attestation, and official legalization paths." },
      { label: "Real Estate & Property", text: "Property search, acquisition support, investment coordination, and market assessment for residential and commercial assets." },
      { label: "Construction & Building Materials", text: "Construction project coordination, contractor sourcing, and supply of building materials and industrial goods." },
      { label: "Import, Export & Trading", text: "Trade documentation, customs support, cargo coordination, and logistics management across borders." },
      { label: "Partnership & Group Coordination", text: "Group-level introductions and multi-unit coordination for requests that span more than one specialist platform." },
    ],

    processEyebrow: "How We Work",
    processTitle: "A clear path from first contact to delivery.",
    processSteps: [
      ["Understand the Need", "Every engagement starts with understanding the business context, goals, and timeline — before recommending any service or platform."],
      ["Connect the Right Unit", "The holding routes the request to the appropriate specialist platform: real estate, trade, or residency and documents."],
      ["Coordinate Communication", "When a request touches more than one platform, the holding maintains oversight so nothing falls between teams."],
      ["Deliver Clear Next Steps", "The specialist team follows up with the practical information, document path, and timeline to move forward."],
    ],

    trustEyebrow: "Why Work With Us",
    trustTitle: "What clients and partners value.",
    trustItems: [
      { label: "Clear Communication", text: "Every response is specific, direct, and actionable — no vague language when a client needs a concrete next step." },
      { label: "Multi-Service Coordination", text: "When a need spans real estate, trade, and documents simultaneously, the group handles routing — the client does not." },
      { label: "Local Market Knowledge", text: "An Oman base and regional relationships give clients a practical advantage in market entry and business navigation." },
      { label: "Professional Network", text: "Access to established relationships with legal, logistics, property, and translation professionals across relevant markets." },
      { label: "Long-Term Relationships", text: "The company operates on repeat business, referrals, and sustained professional relationships — not one-off transactions." },
    ],

    ctaEyebrow: "Get in Touch",
    ctaTitle: "Looking to work with REZAEI GLOBAL LLC?",
    ctaText: "Whether you have a corporate inquiry, a partnership introduction, or a specific service request — contact the group directly or explore the specialist platforms.",
    ctaCorporate: "Contact the Company",
    ctaGroup: "Explore Group Websites",
  },
  tr: {
    heroEyebrow: "REZAEI GLOBAL LLC",
    heroTitle: "Holding Şirketi Hakkında",
    heroSub: "Umman ve uluslararası pazarlarda iş, yatırım, gayrimenkul, ticaret ve göçmenlik hizmetlerini bir araya getiren çok sektörlü holding şirketi.",
    heroTrust: "Umman Sultanlığı'nda kurulmuş olan REZAEI GLOBAL LLC, üç uzman hizmet platformunun arkasındaki ana kurum olarak faaliyet göstermektedir — her biri bağımsız odaklı, toplu koordineli.",
    heroCta1: "Grup Web Sitelerini Keşfet",
    heroCta2: "Şirketle İletişime Geç",

    identityEyebrow: "Şirket Kimliği",
    identityTitle: "Tek bir holding şirketi. Birden fazla uzman operasyon.",
    identityText: "REZAEI GLOBAL LLC, müşterileri, yatırımcıları ve ortakları doğru uzman platform ile buluşturmak için vardır. Tüm hizmetleri tek bir marka altında sunmak yerine, her biri kendi odağı, ekibi ve hizmet diliyle çalışan özel iş birimlerine sahiptir.",
    identityCards: [
      { label: "Holding Şirketi", text: "REZAEI GLOBAL LLC, doğrudan hizmet sağlayıcı değil, ana kurumdur. Grubu koordine eder ve temsil eder." },
      { label: "Çok Sektörlü Operasyonlar", text: "Üç uzman platform gayrimenkul, ticaret ve oturum alanlarını bağımsız olarak kapsıyor." },
      { label: "Umman Merkezli, Uluslararası Erişim", text: "Umman Sultanlığı'nda kurulmuş; Körfez, Türkiye ve uluslararası pazarlarda aktif operasyonlarla." },
      { label: "İş Odaklı Hizmetler", text: "Grup, ciddi iş ihtiyaçları olan kurumsal müşterilere, yatırımcılara, girişimcilere ve profesyonellere hizmet vermektedir." },
    ],

    mvvEyebrow: "Amaç ve Yön",
    mvvCards: [
      { label: "Misyon", text: "Müşterileri gereksiz karmaşıklık, gecikme veya yanlış yönlendirme olmaksızın doğru hizmet, iş birimi veya uzman ekiple buluşturmak." },
      { label: "Vizyon", text: "Körfez ve uluslararası iş topluluğunda net, güvenilir bir varlığa sahip tanınan çok sektörlü bir holding grubu." },
      { label: "Değerler", items: ["Net, doğrudan iletişim", "Profesyonel sorumluluk", "Odaklı hizmet sunumu", "Uzun vadeli iş ilişkileri"] },
    ],

    groupEyebrow: "Grup Web Siteleri",
    groupTitle: "Üç uzman platform. Tek kurumsal grup.",
    groupSub: "Her iş birimi kendi platformunu, ekibini ve hizmet iş akışını işletiyor. Holding şirketi üç platform arasında koordinasyonu sağlar.",
    groupCta: "Web Sitesini Ziyaret Et",
    groupUnits: [
      { title: "Oturum, Vize ve Tercüme", text: "Oturma izni, vize başvuruları, şirket tescili, tasdik, legalizasyon ve sertifikalı tercüme hizmetleri.", scope: "Belgeler · Mobilite · Kurulum" },
      { title: "Gayrimenkul, İnşaat ve Malzemeler", text: "Mülk edinimi, inşaat proje koordinasyonu, yapı malzemeleri temini ve endüstriyel tedarik zincirleri.", scope: "Mülk · Projeler · Tedarik" },
      { title: "İthalat, İhracat ve Genel Ticaret", text: "Ticaret belgeleri, sevkiyat koordinasyonu, döviz transferi, döviz ve sınır ötesi ödeme desteği.", scope: "Ticaret · Ödemeler · Döviz" },
    ],

    servicesEyebrow: "Neler Yapıyoruz",
    servicesTitle: "Grup genelinde hizmet alanları.",
    services: [
      { label: "Şirket Kuruluşu ve İş Desteği", text: "Umman ve bölgesel pazarlara giren şirketler için kurumsal tescil, lisanslama ve iş kurulum desteği." },
      { label: "Oturum, Vize ve Tasdik", text: "Oturma izni, çalışma vizesi, yatırımcı vizesi, belge tasdiki ve resmi legalizasyon yolları." },
      { label: "Gayrimenkul ve Mülk", text: "Konut ve ticari varlıklar için mülk araştırması, edinim desteği, yatırım koordinasyonu ve piyasa değerlendirmesi." },
      { label: "İnşaat ve Yapı Malzemeleri", text: "İnşaat proje koordinasyonu, yüklenici temini ve yapı malzemeleri ile endüstriyel ürünlerin temini." },
      { label: "İthalat, İhracat ve Ticaret", text: "Ticaret belgeleri, gümrük desteği, kargo koordinasyonu ve sınırlar ötesi lojistik yönetimi." },
      { label: "Ortaklık ve Grup Koordinasyonu", text: "Birden fazla uzman platformu kapsayan talepler için grup düzeyinde tanıtımlar ve çok birimli koordinasyon." },
    ],

    processEyebrow: "Nasıl Çalışıyoruz",
    processTitle: "İlk temastan teslimatına kadar net bir yol.",
    processSteps: [
      ["İhtiyacı Anlama", "Her iş birlikteliği, herhangi bir hizmet önermeden önce iş bağlamını, hedefleri ve zaman çizelgesini anlamakla başlar."],
      ["Doğru Birimi Bağlama", "Holding ekibi talebi uygun uzman platforma yönlendirir: gayrimenkul, ticaret veya oturum ve belgeler."],
      ["İletişimi Koordine Etme", "Talep birden fazla platformu etkilediğinde holding denetimi korur, hiçbir şeyin ekipler arasında kaybolmamasını sağlar."],
      ["Net Adımları Teslim Etme", "Her uzman ekip, müşterinin ilerlemek için ihtiyaç duyduğu pratik bilgileri ve zaman çizelgesini sağlar."],
    ],

    trustEyebrow: "Neden Bizimle Çalışmalı",
    trustTitle: "Müşterilerin ve ortakların değer verdikleri.",
    trustItems: [
      { label: "Net İletişim", text: "Her yanıt spesifik, doğrudan ve uygulanabilirdir — müşteri bir sonraki adıma ihtiyaç duyduğunda belirsiz dil kullanılmaz." },
      { label: "Çok Hizmet Koordinasyonu", text: "Bir iş ihtiyacı aynı anda gayrimenkul, ticaret ve belgeleri kapsadığında, yönlendirmeyi grup yapar — müşteri değil." },
      { label: "Yerel Piyasa Bilgisi", text: "Şirketin Umman tabanı ve bölgesel ilişkileri, müşterilere pazar girişi ve iş navigasyonunda pratik bir avantaj sağlar." },
      { label: "Profesyonel Ağ", text: "İlgili pazarlarda hukuk, lojistik, mülk ve tercüme profesyonelleriyle kurulmuş ilişkilere erişim." },
      { label: "Uzun Vadeli İlişkiler", text: "Şirket, tek seferlik işlemler değil, tekrar iş, tavsiye ve sürdürülen profesyonel ilişkiler temelinde faaliyet gösterir." },
    ],

    ctaEyebrow: "İletişime Geçin",
    ctaTitle: "REZAEI GLOBAL LLC ile çalışmak mı istiyorsunuz?",
    ctaText: "Kurumsal bir sorunuz, bir ortaklık tanıtımı veya belirli bir hizmet talebiniz olsun — doğrudan grupla iletişime geçin veya uzman web sitelerini keşfedin.",
    ctaCorporate: "Şirketle İletişime Geç",
    ctaGroup: "Grup Web Sitelerini Keşfet",
  },
  fa: {
    heroEyebrow: "REZAEI GLOBAL LLC",
    heroTitle: "درباره شرکت هولدینگ",
    heroSub: "یک شرکت هولدینگ چندبخشی که خدمات تجاری، سرمایه‌گذاری، املاک، تجارت و مهاجرت را در عمان و بازارهای بین‌المللی به هم متصل می‌کند.",
    heroTrust: "REZAEI GLOBAL LLC در سلطنت عمان ثبت شده و به‌عنوان نهاد مادر پشت سه پلتفرم خدماتی تخصصی فعالیت می‌کند — هر کدام با تمرکز مستقل، هماهنگ‌شده به‌صورت جمعی.",
    heroCta1: "وب‌سایت‌های گروه را کشف کنید",
    heroCta2: "تماس با شرکت",

    identityEyebrow: "هویت شرکت",
    identityTitle: "یک شرکت هولدینگ. چندین عملیات تخصصی.",
    identityText: "REZAEI GLOBAL LLC برای اتصال مشتریان، سرمایه‌گذاران و شرکا با پلتفرم تخصصی مناسب وجود دارد. به‌جای ارائه همه خدمات زیر یک برند، شرکت عملیات خود را از طریق واحدهای تجاری اختصاصی سازمان‌دهی کرده — هر کدام با تمرکز، تیم و زبان خدماتی خود.",
    identityCards: [
      { label: "شرکت هولدینگ", text: "REZAEI GLOBAL LLC نهاد مادر است، نه یک ارائه‌دهنده خدمات مستقیم. گروه را هماهنگ کرده و نمایندگی می‌کند." },
      { label: "عملیات چندبخشی", text: "سه پلتفرم تخصصی، حوزه‌های املاک، تجارت و اقامت را به‌طور مستقل پوشش می‌دهند." },
      { label: "مستقر در عمان، دسترسی بین‌المللی", text: "ثبت شده در سلطنت عمان با عملیات فعال در خلیج فارس، ترکیه و بازارهای بین‌المللی." },
      { label: "خدمات با محوریت کسب‌وکار", text: "گروه به مشتریان شرکتی، سرمایه‌گذاران، کارآفرینان و متخصصان با نیازهای جدی تجاری خدمت می‌کند." },
    ],

    mvvEyebrow: "هدف و جهت",
    mvvCards: [
      { label: "ماموریت", text: "اتصال مشتریان با خدمت، واحد تجاری یا تیم متخصص مناسب — بدون پیچیدگی، تأخیر یا هدایت اشتباه غیرضروری." },
      { label: "چشم‌انداز", text: "یک گروه هولدینگ چندبخشی شناخته‌شده با حضور واضح و مورد اعتماد در خلیج فارس و جامعه تجاری بین‌المللی." },
      { label: "ارزش‌ها", items: ["ارتباط شفاف و مستقیم", "پاسخگویی حرفه‌ای", "ارائه خدمات متمرکز", "روابط تجاری بلندمدت"] },
    ],

    groupEyebrow: "وب‌سایت‌های گروه",
    groupTitle: "سه پلتفرم تخصصی. یک گروه شرکتی.",
    groupSub: "هر واحد تجاری پلتفرم، تیم و فرآیند خدماتی خود را اداره می‌کند. شرکت هولدینگ در سه پلتفرم هماهنگی می‌کند.",
    groupCta: "مشاهده وب‌سایت",
    groupUnits: [
      { title: "اقامت، ویزا و ترجمه", text: "مجوزهای اقامت، درخواست‌های ویزا، ثبت شرکت، تایید مدارک، قانونی‌سازی و خدمات ترجمه رسمی.", scope: "مدارک · تحرک · راه‌اندازی" },
      { title: "املاک، ساخت‌وساز و مصالح", text: "خرید ملک، هماهنگی پروژه‌های ساختمانی، تامین مصالح ساختمانی و زنجیره‌های تامین صنعتی.", scope: "ملک · پروژه · تامین" },
      { title: "واردات، صادرات و تجارت عمومی", text: "مستندات تجاری، هماهنگی حمل‌ونقل، انتقال ارز، تبادل ارز و پشتیبانی پرداخت بین‌المللی.", scope: "تجارت · پرداخت · ارز" },
    ],

    servicesEyebrow: "چه می‌کنیم",
    servicesTitle: "حوزه‌های خدماتی در سراسر گروه.",
    services: [
      { label: "تاسیس شرکت و پشتیبانی کسب‌وکار", text: "ثبت شرکت، اخذ مجوز و پشتیبانی راه‌اندازی برای شرکت‌های ورودی به بازارهای عمان و منطقه." },
      { label: "اقامت، ویزا و تایید مدارک", text: "مجوز اقامت، ویزای کاری، ویزای سرمایه‌گذار، تایید اسناد و مسیرهای قانونی‌سازی رسمی." },
      { label: "خدمات املاک و مستغلات", text: "جستجوی ملک، پشتیبانی خرید، هماهنگی سرمایه‌گذاری و ارزیابی بازار برای دارایی‌های مسکونی و تجاری." },
      { label: "ساخت‌وساز و مصالح ساختمانی", text: "هماهنگی پروژه ساختمانی، تامین پیمانکار و تامین مصالح ساختمانی و کالاهای صنعتی." },
      { label: "واردات، صادرات و تجارت", text: "مستندات تجاری، پشتیبانی گمرکی، هماهنگی کارگو و مدیریت لجستیک در مرزها." },
      { label: "مشارکت و هماهنگی گروه", text: "معرفی‌های در سطح گروه و هماهنگی چند واحدی برای درخواست‌هایی که بیش از یک پلتفرم تخصصی را پوشش می‌دهند." },
    ],

    processEyebrow: "چگونه کار می‌کنیم",
    processTitle: "مسیری روشن از اولین تماس تا تحویل.",
    processSteps: [
      ["درک نیاز", "هر تعاملی با درک زمینه تجاری، اهداف و جدول زمانی شروع می‌شود — قبل از پیشنهاد هر خدمت یا پلتفرمی."],
      ["اتصال واحد مناسب", "تیم هولدینگ درخواست را به پلتفرم تخصصی مناسب هدایت می‌کند: املاک، تجارت یا اقامت و مدارک."],
      ["هماهنگی ارتباطات", "وقتی درخواستی بیش از یک پلتفرم را لمس می‌کند، هولدینگ نظارت را حفظ می‌کند تا هیچ چیزی گم نشود."],
      ["ارائه گام‌های بعدی روشن", "هر تیم متخصص با اطلاعات عملی، مسیر سند و جدول زمانی که مشتری برای پیشرفت نیاز دارد پیگیری می‌کند."],
    ],

    trustEyebrow: "چرا با ما کار کنید",
    trustTitle: "آنچه مشتریان و شرکا ارزش می‌گذارند.",
    trustItems: [
      { label: "ارتباط شفاف", text: "هر پاسخ مشخص، مستقیم و قابل اجرا است — از زبان مبهم استفاده نمی‌شود وقتی مشتری به گام بعدی روشن نیاز دارد." },
      { label: "هماهنگی چند خدمتی", text: "وقتی یک نیاز تجاری همزمان شامل املاک، تجارت و مدارک می‌شود، گروه مسیریابی را انجام می‌دهد — مشتری نه." },
      { label: "دانش بازار محلی", text: "پایگاه عمانی شرکت و روابط منطقه‌ای، به مشتریان در ورود به بازار و ناوبری کسب‌وکار مزیت عملی می‌دهد." },
      { label: "شبکه حرفه‌ای", text: "دسترسی به روابط تثبیت‌شده با متخصصان حقوقی، لجستیک، ملک و ترجمه در بازارهای مرتبط." },
      { label: "روابط بلندمدت", text: "شرکت بر اساس کسب‌وکار تکراری، ارجاع و روابط حرفه‌ای پایدار فعالیت می‌کند — نه معاملات یک‌باره." },
    ],

    ctaEyebrow: "تماس بگیرید",
    ctaTitle: "می‌خواهید با REZAEI GLOBAL LLC همکاری کنید؟",
    ctaText: "چه یک سوال شرکتی، یک معرفی مشارکت یا یک درخواست خدمت خاص داشته باشید — مستقیماً با گروه تماس بگیرید یا وب‌سایت‌های تخصصی را کشف کنید.",
    ctaCorporate: "تماس با شرکت",
    ctaGroup: "وب‌سایت‌های گروه را کشف کنید",
  },
  ar: {
    heroEyebrow: "REZAEI GLOBAL LLC",
    heroTitle: "نبذة عن الشركة القابضة",
    heroSub: "شركة قابضة متعددة القطاعات تربط خدمات الأعمال والاستثمار والعقارات والتجارة والهجرة عبر سلطنة عُمان والأسواق الدولية.",
    heroTrust: "تأسست REZAEI GLOBAL LLC في سلطنة عُمان وتعمل ككيان أم وراء ثلاث منصات خدمات متخصصة — كل منها مستقلة التركيز، منسقة بشكل جماعي.",
    heroCta1: "استكشاف مواقع المجموعة",
    heroCta2: "التواصل مع الشركة",

    identityEyebrow: "هوية الشركة",
    identityTitle: "شركة قابضة واحدة. عمليات متخصصة متعددة.",
    identityText: "تأتي REZAEI GLOBAL LLC لتربط العملاء والمستثمرين والشركاء بالمنصة المتخصصة الصحيحة. بدلاً من تقديم كل الخدمات تحت علامة تجارية واحدة، تهيكل الشركة عملياتها من خلال وحدات أعمال مخصصة — لكل منها تركيزها وفريقها ولغة خدماتها.",
    identityCards: [
      { label: "شركة قابضة", text: "REZAEI GLOBAL LLC هي الكيان الأم، وليست مزود خدمات مباشر. تنسق المجموعة وتمثلها." },
      { label: "عمليات متعددة القطاعات", text: "ثلاث منصات متخصصة تغطي العقارات والتجارة والإقامة بشكل مستقل — تحت هيكل مؤسسي واحد." },
      { label: "مقرها عُمان، انتشار دولي", text: "مسجلة في سلطنة عُمان مع عمليات نشطة عبر الخليج وتركيا والأسواق الدولية." },
      { label: "خدمات موجهة نحو الأعمال", text: "تخدم المجموعة العملاء المؤسسيين والمستثمرين ورجال الأعمال والمهنيين ذوي الاحتياجات التجارية الجادة." },
    ],

    mvvEyebrow: "الغرض والاتجاه",
    mvvCards: [
      { label: "المهمة", text: "ربط العملاء بالخدمة أو وحدة الأعمال أو الفريق المتخصص المناسب — دون تعقيد أو تأخير أو توجيه خاطئ غير ضروري." },
      { label: "الرؤية", text: "مجموعة قابضة متعددة القطاعات معترف بها بحضور واضح وموثوق عبر مجتمع الأعمال الخليجي والدولي." },
      { label: "القيم", items: ["تواصل واضح ومباشر", "مساءلة مهنية", "تقديم خدمة مركزة", "علاقات عمل طويلة الأمد"] },
    ],

    groupEyebrow: "مواقع المجموعة",
    groupTitle: "ثلاث منصات متخصصة. مجموعة شركات واحدة.",
    groupSub: "تدير كل وحدة أعمال منصتها وفريقها وسير عمل خدماتها الخاص. تنسق الشركة القابضة عبر الثلاثة.",
    groupCta: "زيارة الموقع",
    groupUnits: [
      { title: "الإقامة والتأشيرة والترجمة", text: "تصاريح الإقامة وطلبات التأشيرة وتسجيل الشركات والتصديق والتوثيق وخدمات الترجمة المعتمدة.", scope: "المستندات · التنقل · الإنشاء" },
      { title: "العقارات والبناء والمواد", text: "الاستحواذ على العقارات وتنسيق مشاريع البناء وتوريد مواد البناء وسلاسل التوريد الصناعية.", scope: "العقار · المشاريع · التوريد" },
      { title: "الاستيراد والتصدير والتجارة العامة", text: "وثائق التجارة وتنسيق الشحن وتحويل العملات والصرف الأجنبي ودعم المدفوعات عبر الحدود.", scope: "التجارة · المدفوعات · الصرف" },
    ],

    servicesEyebrow: "ما نقدمه",
    servicesTitle: "مجالات الخدمة عبر المجموعة.",
    services: [
      { label: "تأسيس الشركات ودعم الأعمال", text: "التسجيل المؤسسي والترخيص ودعم الإنشاء للشركات الداخلة إلى الأسواق العُمانية والإقليمية." },
      { label: "الإقامة والتأشيرة والتصديق", text: "تصاريح الإقامة وتأشيرات العمل وتأشيرات المستثمرين وتصديق المستندات ومسارات التوثيق الرسمية." },
      { label: "خدمات العقارات والملكية", text: "البحث عن العقارات ودعم الاستحواذ وتنسيق الاستثمار وتقييم السوق للأصول السكنية والتجارية." },
      { label: "البناء ومواد البناء", text: "تنسيق مشاريع البناء وتوريد المقاولين وتوريد مواد البناء والسلع الصناعية." },
      { label: "الاستيراد والتصدير والتجارة", text: "وثائق التجارة ودعم الجمارك وتنسيق البضائع وإدارة اللوجستيات عبر الحدود." },
      { label: "الشراكة والتنسيق الجماعي", text: "التقديمات على مستوى المجموعة والتنسيق متعدد الوحدات للطلبات الممتدة عبر أكثر من منصة متخصصة." },
    ],

    processEyebrow: "كيف نعمل",
    processTitle: "مسار واضح من أول اتصال حتى التسليم.",
    processSteps: [
      ["فهم الحاجة", "يبدأ كل تعاون بفهم السياق التجاري وأهدافه وجدوله الزمني — قبل التوصية بأي خدمة أو منصة."],
      ["ربط الوحدة المناسبة", "يوجه فريق القابضة الطلب إلى المنصة المتخصصة المناسبة: العقارات، أو التجارة، أو الإقامة والمستندات."],
      ["تنسيق التواصل", "عندما يمس طلب ما أكثر من منصة، تحافظ القابضة على الإشراف لضمان عدم ضياع أي شيء بين الفرق."],
      ["تسليم خطوات واضحة", "يتابع كل فريق متخصص بالمعلومات العملية ومسار الوثائق والجدول الزمني للمضي قدماً."],
    ],

    trustEyebrow: "لماذا العمل معنا",
    trustTitle: "ما يقدره العملاء والشركاء.",
    trustItems: [
      { label: "تواصل واضح", text: "كل رد محدد ومباشر وقابل للتنفيذ — لا لغة مبهمة عندما يحتاج العميل إلى خطوة واضحة تالية." },
      { label: "تنسيق متعدد الخدمات", text: "عندما تمتد حاجة تجارية لتشمل العقارات والتجارة والمستندات في آن واحد، تتولى المجموعة التوجيه — وليس العميل." },
      { label: "معرفة السوق المحلي", text: "قاعدة الشركة في عُمان وعلاقاتها الإقليمية تمنح العملاء ميزة عملية في دخول السوق والتنقل التجاري." },
      { label: "شبكة مهنية", text: "الوصول إلى علاقات راسخة مع متخصصين قانونيين ولوجستيين وعقاريين وترجمة عبر الأسواق ذات الصلة." },
      { label: "علاقات طويلة الأمد", text: "تعمل الشركة على أساس تكرار الأعمال والإحالات والعلاقات المهنية المستدامة — وليس معاملات لمرة واحدة." },
    ],

    ctaEyebrow: "تواصل معنا",
    ctaTitle: "تبحث عن العمل مع REZAEI GLOBAL LLC؟",
    ctaText: "سواء كان لديك استفسار مؤسسي أو تقديم شراكة أو طلب خدمة محدد — تواصل مع المجموعة مباشرةً أو استكشف المنصات المتخصصة.",
    ctaCorporate: "التواصل مع الشركة",
    ctaGroup: "استكشاف مواقع المجموعة",
  },
};

const aboutGroupHrefs = [siteUrls.visa, siteUrls.realEstate, siteUrls.finance];
const aboutGroupIcons = [FileText, Building2, Truck];

function AboutPage({ lang, navigate, cmsHero, cmsData }) {
  const fallback = buildAboutPageFallback(aboutPageCopy, lang, aboutGroupHrefs);
  const pick = pickCms;
  const heroEyebrow = pick(cmsHero?.eyebrow || cmsHero?.subtitle, fallback.heroEyebrow);
  const heroTitle = pick(cmsHero?.title, fallback.heroTitle);
  const heroLead = pick(cmsHero?.lead || cmsHero?.summary, fallback.heroLead);
  const heroBody = pick(cmsHero?.body, fallback.heroBody);
  const overviewEyebrow = pick(cmsData?.overviewEyebrow, fallback.overviewEyebrow);
  const overviewTitle = pick(cmsData?.overviewTitle, fallback.overviewTitle);
  const overviewText = pick(cmsData?.overviewText, fallback.overviewText);
  const overviewPoints = pick(cmsData?.overviewPoints?.length ? cmsData.overviewPoints : null, fallback.overviewPoints);
  const businessesEyebrow = pick(cmsData?.businessesEyebrow, fallback.businessesEyebrow);
  const businessesTitle = pick(cmsData?.businessesTitle, fallback.businessesTitle);
  const groupUnits = pick(
    cmsData?.groupUnits?.length ? cmsData.groupUnits.map((u, i) => ({ ...u, href: u.href || aboutGroupHrefs[i] || "#" })) : null,
    fallback.groupUnits,
  );
  const processEyebrow = pick(cmsData?.processEyebrow, fallback.processEyebrow);
  const processTitle = pick(cmsData?.processTitle, fallback.processTitle);
  const processSummary = pick(cmsData?.processSummary, fallback.processSummary);
  const processSteps = pick(cmsData?.processSteps?.length ? cmsData.processSteps : null, fallback.processSteps);
  const structureLabel = fallback.structureLabel;
  const visitWebsite = fallback.visitWebsite;
  const ctaEyebrow = pick(cmsData?.ctaEyebrow, fallback.ctaEyebrow);
  const ctaTitle = pick(cmsData?.ctaTitle, fallback.ctaTitle);
  const ctaButton = pick(cmsData?.ctaButton, fallback.ctaButton);

  return (
    <>
      <section className="aboutHero">
        <div className="aboutShell aboutHeroGrid">
          <div className="aboutHeroCopy">
            <p className="eyebrow">{heroEyebrow}</p>
            <h1>{heroTitle}</h1>
            <p className="aboutHeroLead">{heroLead}</p>
            <p className="aboutHeroText">{heroBody}</p>
          </div>

          <aside className="aboutStructureCard" aria-label="Company structure">
            <div className="aboutStructureHead">
              <span>{structureLabel}</span>
              <strong>REZAEI GLOBAL LLC</strong>
            </div>
            <div className="aboutStructureList">
              {groupUnits.map(({ title }, index) => {
                const Icon = aboutGroupIcons[index] || Building2;
                return (
                  <div className="aboutStructureItem" key={title}>
                    <div className="aboutStructureIcon">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span>{title}</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="aboutOverview">
        <div className="aboutShell aboutOverviewGrid">
          <div className="aboutOverviewCopy">
            <p className="eyebrow">{overviewEyebrow}</p>
            <h2>{overviewTitle}</h2>
            <p>{overviewText}</p>
          </div>
          <div className="aboutPointList">
            {overviewPoints.map((point) => (
              <div className="aboutPoint" key={point}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="aboutBusinesses" id="about-group-businesses">
        <div className="aboutShell">
          <div className="aboutSectionHeader">
            <p className="eyebrow">{businessesEyebrow}</p>
            <h2>{businessesTitle}</h2>
          </div>
          <div className="aboutBusinessGrid">
            {groupUnits.map(({ title, text, href }, index) => {
              const Icon = aboutGroupIcons[index] || Globe2;
              return (
                <article className="aboutBusinessCard" key={title}>
                  <div className="aboutBusinessIcon">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                  <a className="aboutVisitLink" href={href || "#"}>
                    {visitWebsite}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="aboutProcess">
        <div className="aboutShell">
          <div className="aboutSectionHeader aboutSectionHeaderSplit">
            <div>
              <p className="eyebrow">{processEyebrow}</p>
              <h2>{processTitle}</h2>
            </div>
            <p>{processSummary}</p>
          </div>
          <ol className="aboutTimeline">
            {processSteps.map(([title, text], index) => (
              <li className="aboutTimelineStep" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="aboutCta">
        <div className="aboutShell">
          <div className="aboutCtaBox">
            <p className="eyebrow">{ctaEyebrow}</p>
            <h2>{ctaTitle}</h2>
            <div className="aboutCtaActions">
              <button type="button" className="primaryButton aboutPrimary" onClick={() => navigate("/contact")}>
                {ctaButton}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


function ContactPage({ lang, cmsContact, handleSubmit, localizedContactRows, localizedForm, status, cmsHero }) {
  const fallback = supportHero("contact", lang);
  const pick = pickCms;
  const helpItems = pick(
    cmsContact?.helpItems?.length ? cmsContact.helpItems : null,
    fallback.helpItems,
  );
  const prepItems = pick(
    cmsContact?.prepItems?.length ? cmsContact.prepItems : null,
    fallback.prepItems,
  );
  const helpIcons = [Send, Mail, Phone];

  return (
    <>
      <section className="contactHeroPro">
        <div className="contactShell contactHeroGridPro">
          <div className="contactHeroCopyPro">
            <p className="eyebrow">{pick(cmsHero?.eyebrow || cmsContact?.heroEyebrow, fallback.heroEyebrow)}</p>
            <h1>{pick(cmsHero?.title || cmsContact?.heroTitle, fallback.heroTitle)}</h1>
            <p>{pick(cmsHero?.lead || cmsContact?.heroLead, fallback.heroLead)}</p>
          </div>
          <aside className="contactSignalPanel" aria-label="Contact options">
            <div className="contactSignalHeader">
              <span>{pick(cmsContact?.helpTitle, fallback.helpTitle)}</span>
              <strong>{fallback.signalHeading}</strong>
            </div>
            <div className="contactSignalMap">
              {helpItems.map(({ title, text }, index) => {
                const Icon = helpIcons[index] || Send;
                return (
                <article className="contactSignalItem" key={title}>
                  <span><Icon size={20} aria-hidden="true" /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="contactMainPro">
        <div className="contactShell contactMainGridPro">
          <div className="contactFormCardPro" id="contact-form">
            <div className="contactFormHeaderPro">
              <div>
                <span>{pick(cmsContact?.formTitle, fallback.formTitle)}</span>
                <h2>{pick(cmsContact?.formHeading, fallback.formHeading)}</h2>
              </div>
            </div>
            <form className="contactFormPro holdingContactForm" onSubmit={handleSubmit}>
              <div className="formField">
                <label htmlFor="contact-name">{localizedForm.fullName || "Full Name"}</label>
                <input id="contact-name" name="name" type="text" placeholder={localizedForm.fullNamePlaceholder} required />
              </div>
              <div className="formRow2">
                <div className="formField">
                  <label htmlFor="contact-email">{localizedForm.email}</label>
                  <input id="contact-email" name="email" type="email" placeholder={localizedForm.emailPlaceholder} required />
                </div>
                <div className="formField">
                  <label htmlFor="contact-phone">{localizedForm.phone}</label>
                  <input id="contact-phone" name="phone" type="tel" placeholder={localizedForm.phonePlaceholder} />
                </div>
              </div>
              <div className="formRow2">
                <div className="formField">
                  <label htmlFor="contact-service">{localizedForm.serviceInterest}</label>
                  <select id="contact-service" name="service">
                    <option value="">{localizedForm.selectService}</option>
                    <option value="real_estate">{localizedForm.realEstate}</option>
                    <option value="finance_trade">{localizedForm.financeTrade}</option>
                    <option value="residency">{localizedForm.residency}</option>
                    <option value="general">{localizedForm.general}</option>
                  </select>
                </div>
                <div className="formField">
                  <label htmlFor="contact-country">{localizedForm.country}</label>
                  <input id="contact-country" name="country" type="text" placeholder={localizedForm.countryPlaceholder} />
                </div>
              </div>
              <div className="formField">
                <label htmlFor="contact-message">{localizedForm.message}</label>
                <textarea id="contact-message" name="message" rows={6} placeholder={localizedForm.messagePlaceholder} required />
              </div>
              <button className="primaryButton contactSubmitBtn contactSubmitPro" type="submit">
                <Send size={18} aria-hidden="true" />
                {localizedForm.send || fallback.sendInquiry}
              </button>
              {status && <p className="formStatus holdingFormStatus">{status}</p>}
            </form>
          </div>

          <aside className="contactInfoPro">
            <p className="eyebrow">{fallback.prepEyebrow}</p>
            <h2>{pick(cmsContact?.prepTitle, fallback.prepTitle)}</h2>
            <div className="contactPrepList">
              {prepItems.map((item) => (
                <div className="contactPrepItem" key={item}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="contactDirectRows">
              <span><Mail size={18} aria-hidden="true" /> {localizedContactRows[0]}</span>
              <span><Phone size={18} aria-hidden="true" /> {localizedContactRows[1]}</span>
              <span><Home size={18} aria-hidden="true" /> {localizedContactRows[2]}</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function withRequiredHomeSections(items, lang = "en") {
  const teamLabels = { en: "Team", tr: "Ekip", fa: "تیم", ar: "الفريق" };
  const nextItems = [...items];
  const hasTeam = nextItems.some(([, sectionId, href]) => sectionId === "team" || href === "/team");
  if (!hasTeam) {
    const contactIndex = nextItems.findIndex(([, , href]) => href === "/contact" || href === "/#contact");
    const teamNav = [teamLabels[lang] || "Team", "team", "/team"];
    if (contactIndex >= 0) nextItems.splice(contactIndex, 0, teamNav);
    else nextItems.push(teamNav);
  }
  return nextItems;
}

function isHomeNavItemActive({ activeSection, href, isHome, path, sectionId }) {
  if (isHome) return activeSection === sectionId;

  // The CMS also routes broader sections such as Business Units to this page.
  // Keep the dedicated How We Work navigation item as the single active item.
  if (path === "/how-we-work") return sectionId === "how-we-work";

  const itemPath = href?.split("#")[0]?.replace(/\/$/, "") || "/";
  return itemPath !== "/" && path === getCanonicalPath(itemPath);
}

const businessUnitDetails = [
  "Property sourcing, real estate investment, construction coordination, material requests, and quotation conversations are handled through the real estate platform.",
  "Import, export, shipment documents, trade timing, supplier coordination, currency transfer, FX, and payment questions move through the finance and trade platform.",
  "Residency, visa, translation, attestation, legalization, and company setup document paths are routed through the residency and visa platform.",
];

const heroRouteCards = [
  ["01", "Property & Projects", "Real estate, construction, materials, and project quotation requests."],
  ["02", "Trade & Payments", "Import, export, shipment coordination, currency transfer, and FX support."],
  ["03", "Residency & Documents", "Residency, visa, translation, attestation, legalization, and company setup."],
];

function uiOr(content, key, fallback) {
  const value = content?.uiStrings?.[key];
  return value && String(value).trim() ? value : fallback;
}

function buildUiLabels(content, lang) {
  const base = ui[lang] || ui.en;
  return {
    ...base,
    home: uiOr(content, "nav_home", base.home),
    backHome: uiOr(content, "nav_back_home", base.backHome),
    inquiry: uiOr(content, "cta_contact", base.inquiry),
    contact: uiOr(content, "cta_contact", base.contact),
    visit: uiOr(content, "cta_visit_website", base.visit),
    submit: uiOr(content, "form_send", base.submit),
    sent: uiOr(content, "inquiry_success", base.sent),
    required: uiOr(content, "form_required", base.required),
    name: uiOr(content, "form_full_name", base.name),
    email: uiOr(content, "form_email", base.email),
    phone: uiOr(content, "form_phone", base.phone),
    message: uiOr(content, "form_message", base.message),
  };
}

function mapLocalizedGroupSites(content, businessCards, lang, siteUrlsMap) {
  const base = groupSitesByLang[lang] || groupSitesByLang.en;
  if (businessCards.length) {
    return businessCards.map(([title, text, href]) => ({
      title,
      text,
      href: href || "/",
    }));
  }
  const links = content.groupLinks || [];
  if (links.length) {
    return links.map((link) => {
      const fallback = base.find((entry) => entry.href === link.href)
        || base.find((entry) => String(link.href || "").includes(String(entry.href || "").replace(/^https?:\/\//, "")))
        || { text: link.label };
      return {
        title: link.label,
        text: fallback.text || link.label,
        href: link.href || "/",
      };
    });
  }
  return base.map((entry, index) => {
    const key = index === 0 ? "visa" : index === 1 ? "realEstate" : "finance";
    return {
      ...entry,
      href: (key && siteUrlsMap[key]) || entry.href,
    };
  });
}

function App() {
  const [lang, setLang] = useState(getInitialLanguage);
  const [path, setPath] = useState(getCurrentPath());
  const [content, setContent] = useState(() => getFallbackContent(getCurrentPath(), lang));
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const activeLang = languages.find((item) => item.code === lang) || languages[0];
  const siteKey = kindMap[site.kind] || "holding";
  const cmsHeroMedia = content.heroMedia || {};
  const activeHeroMedia = {
    video: cmsHeroMedia.video || heroMedia[siteKey]?.video || heroMedia.holding.video,
    poster: cmsHeroMedia.poster || heroMedia[siteKey]?.poster || heroMedia.holding.poster,
  };
  const cmsBrand = content.brand || {};
  const activeBrand = {
    displayName: content.siteName || brand.displayName,
    logoWide: cmsBrand.logoWide || brand.logoWide,
    logoStacked: cmsBrand.logoStacked || brand.logoStacked,
    favicon: cmsBrand.favicon || brand.logoStacked,
    color: cmsBrand.color || brand.color,
  };
  const cmsGroupSiteUrls = content.groupSiteUrls || {};
  const activeSiteUrls = {
    mainSite: cmsGroupSiteUrls.mainSite || siteUrls.mainSite,
    realEstate: cmsGroupSiteUrls.realEstate || siteUrls.realEstate,
    finance: cmsGroupSiteUrls.finance || siteUrls.finance,
    visa: cmsGroupSiteUrls.visa || siteUrls.visa,
  };
  const copy = pageCopy[siteKey][lang];
  const localizedNewPages = newPages[lang] || newPages.en;
  const fallbackNavPages = [localizedNewPages[siteKey], ...copy.pages].map(normalizePageHref);
  const sourceNavPages = content.navPages?.length ? content.navPages : fallbackNavPages;
  const navPages = sourceNavPages.map(normalizePageHref);
  const visibleHomeNavPages = useMemo(() => sourceNavPages.filter((item) => !isNewsNavItem(item) && !isRemovedHomeNavItem(item)), [sourceNavPages]);
  const usesPageNav = siteKey === "realEstate";
  const homeNavItems = useMemo(
    () => withRequiredHomeSections(visibleHomeNavPages.length
      ? visibleHomeNavPages.map(([sectionId, href, label]) => [label, sectionId, href])
      : holdingHomeNavItems, lang),
    [visibleHomeNavPages, lang],
  );
  const pageNavItems = useMemo(
    () => {
      const pageHrefById = Object.fromEntries(copy.pages.map(([itemId, itemHref]) => [itemId, itemHref || "/"]));
      return (visibleHomeNavPages.length ? visibleHomeNavPages : copy.pages).map(([pageNavId, pageNavHref, pageNavLabel]) => {
        let href = pageNavHref || "/";
        if (usesPageNav && href.includes("#")) {
          const targetId = href.split("#").pop() || pageNavId;
          href = pageHrefById[targetId] || (targetId === "home" ? "/" : `/${targetId}`);
        }
        return [pageNavLabel, href, pageNavId];
      });
    },
    [copy.pages, usesPageNav, visibleHomeNavPages],
  );
  const pages = uniquePagesByHref([...navPages, ...fallbackNavPages, ...supportPages[lang]].map(normalizePageHref));
  const labels = buildUiLabels(content, lang);
  const normalizedPageTuple = normalizePageHref(content.pageTuple);
  const cmsPage = normalizedPageTuple?.[1] === path ? normalizedPageTuple : null;
  const page = cmsPage || pages.find((item) => item[1] === path) || copy.pages[0];
  const [pageId, pageHref, pageLabel, pageTitle, pageText] = page;
  const fallbackDetail = pageDetails[siteKey]?.[pageId] || supportDetails[pageId] || {
    overview: pageText,
    cards: [
      [pageTitle, pageText],
      ["Visitor path", "This page gives visitors a focused route to understand the service area and send the right inquiry details."],
      ["Required context", "The first message should include enough practical information for the team to classify and respond to the request."],
      ["Next step", "The page turns broad interest into a clear follow-up path through the inquiry form."],
    ],
    process: ["Read the page", "Prepare request details", "Send inquiry", "Continue with follow-up"],
    contact: pageText,
  };
  const detail = localizedDetailFromContent(content, fallbackDetail, lang, pageTitle, pageText);
  const detailCards = detail.cards || [];
  const detailProcess = detail.process || copy.process;
  const summaryLabels = detailSummaryCopy[lang] || detailSummaryCopy.en;
  const detailSummary = [
    {
      title: summaryLabels.focus(pageTitle),
      text: detail.overview,
    },
    {
      title: summaryLabels.prepare,
      text: detail.contact,
    },
    {
      title: summaryLabels.followUp,
      text: summaryLabels.followUpText(detailProcess.join(" -> ")),
    },
  ];
  const contentDepth = buildPageContent({ siteKey, pageId, pageLabel, pageTitle, pageText, detail, detailCards, detailProcess, lang });
  const generatedLabels = generatedCopy[lang] || generatedCopy.en;
  const title = content.seo?.title
    || (pageHref === "/" && pageTitle === site.name ? `${site.name} | Corporate Group Website` : `${pageTitle} | ${site.name}`);
  const metaDescription = content.pageDescription || pageText;
  const metaKeywords = content.pageKeywords || `${site.name}, ${copy.cards.join(", ")}`;
  const ogImageUrl = withSiteUrl(content.ogImageUrl || activeBrand.logoWide);
  const isHome = pageHref === "/";
  const useCmsDetailLayout = false;
  const isHolding = siteKey === "holding";
  const isPremiumHoldingHome = isHome && isHolding;
  const isTeamPage = pageHref === "/team";
  const isSupportPage = supportPages[lang].some((item) => item[1] === pageHref);
  const layoutVariant = getLayoutVariant(siteKey, pageId);
  const signature = buildSignatureContent({ layoutVariant, pageTitle, detailCards, detailProcess, contentDepth, lang });
  const cmsHome = content.home || {};
  const cmsHomeSections = cmsHome.sections || {};
  const cmsHero = cmsHome.hero || {};
  const cmsHeroCards = cmsHero.cards?.length ? cmsHero.cards : [];
  const cmsContactRows = [
    content.settings?.contact_email || "",
    content.settings?.contact_phone || "",
    content.settings?.contact_address || "",
  ];
  const baseForm = formCopy[lang] || formCopy.en;
  const localizedForm = {
    ...baseForm,
    fullName: uiOr(content, "form_full_name", baseForm.fullName),
    fullNamePlaceholder: uiOr(content, "form_full_name_placeholder", baseForm.fullNamePlaceholder),
    email: uiOr(content, "form_email", baseForm.email),
    emailPlaceholder: uiOr(content, "form_email_placeholder", baseForm.emailPlaceholder),
    phone: uiOr(content, "form_phone", baseForm.phone),
    phonePlaceholder: uiOr(content, "form_phone_placeholder", baseForm.phonePlaceholder),
    serviceInterest: uiOr(content, "form_service_interest", baseForm.serviceInterest),
    selectService: uiOr(content, "form_select_service", baseForm.selectService),
    country: uiOr(content, "form_country", baseForm.country),
    countryPlaceholder: uiOr(content, "form_country_placeholder", baseForm.countryPlaceholder),
    message: uiOr(content, "form_message", baseForm.message),
    messagePlaceholder: uiOr(content, "form_message_placeholder", baseForm.messagePlaceholder),
    send: uiOr(content, "form_send", baseForm.send),
    footer: content.footerText || uiOr(content, "footer_tagline", baseForm.footer),
    visitUnit: uiOr(content, "form_visit_unit", baseForm.visitUnit),
    corporateGroup: uiOr(content, "form_corporate_group", baseForm.corporateGroup),
    address: content.settings?.contact_address || baseForm.address,
    realEstate: uiOr(content, "form_real_estate", baseForm.realEstate),
    financeTrade: uiOr(content, "form_finance_trade", baseForm.financeTrade),
    residency: uiOr(content, "form_residency", baseForm.residency),
    general: uiOr(content, "form_general", baseForm.general),
  };
  const localizedContactRows = [cmsContactRows[0], cmsContactRows[1], localizedForm.address || cmsContactRows[2]];
  const homeFallback = homeFallbackCopy[lang] || homeFallbackCopy.en;
  const teamShowcaseMembers = useMemo(
    () => buildTeamShowcaseMembers(cmsHomeSections.team?.cards, homeFallback.teamCards),
    [cmsHomeSections.team?.cards, homeFallback.teamCards],
  );
  const companyCards = cmsHomeSections.company?.cards?.length ? cmsHomeSections.company.cards : [];
  const businessCards = cmsHomeSections["business-units"]?.cards?.length ? cmsHomeSections["business-units"].cards : [];
  const structureCards = cmsHomeSections["group-structure"]?.cards?.length ? cmsHomeSections["group-structure"].cards : [];
  const processCards = cmsHomeSections["how-we-work"]?.cards?.length ? cmsHomeSections["how-we-work"].cards : [];
  const governanceSection = cmsHomeSections.governance || {};
  const governanceCards = governanceSection.cards?.length ? governanceSection.cards : [];
  const exploreSection = cmsHomeSections["explore-group"] || {};
  const howWeWorkSection = cmsHomeSections["how-we-work"] || {};
  const homeFb = homeDefaults(lang);
  const displayHeroCards = cmsHeroCards.length
    ? cmsHeroCards.map((card, index) => [String(index + 1).padStart(2, "0"), card[0] || "", card[2] || card[1] || ""])
    : heroRouteCards;
  const displayProcessSteps = resolveHomeProcessSteps(processCards, homeFb, lang);
  const howWeWorkEyebrow = resolveLocalizedHomeText(
    howWeWorkSection.eyebrow,
    homeFb.howWeWorkEyebrow,
    lang,
    "How We Work",
  );
  const howWeWorkTitle = resolveLocalizedHomeText(
    howWeWorkSection.title,
    homeFb.howWeWorkTitle,
    lang,
    "A simple path from group-level inquiry to specialist delivery.",
  );
  const companySection = cmsHomeSections.company || {};
  const groupStructureSection = cmsHomeSections["group-structure"] || {};
  const localizedGroupSites = mapLocalizedGroupSites(content, businessCards, lang, cmsGroupSiteUrls);
  const heroProofItems = Array.isArray(cmsHero.settings?.proof_items) && cmsHero.settings.proof_items.length
    ? cmsHero.settings.proof_items
    : displayHeroCards.map(([, label]) => label).filter(Boolean).slice(0, 3).length
      ? displayHeroCards.map(([, label]) => label).slice(0, 3)
      : homeFb.proofItems;
  const companyMetrics = Array.isArray(companySection.settings?.metrics) && companySection.settings.metrics.length
    ? companySection.settings.metrics
    : [
        [String(businessCards.length || 3), uiOr(content, "metric_platforms", "Service platforms")],
        [String(content.areaServed?.length || 4), uiOr(content, "metric_markets", "Regional markets")],
        ["1", uiOr(content, "metric_entry", "Group entry point")],
      ];
  const footerSupportPages = isHolding && content.navPages?.length
    ? content.navPages
        .filter(([, href]) => ["/faq", "/privacy", "/terms"].includes(href))
        .map(([id, href, , title]) => [id, href, title, title, ""])
    : supportPages[lang];
  const pageUrlPath = pageHref === "/" ? "/" : pageHref;
  const canonicalUrl = withSiteUrl(pageUrlPath);
  const brandLogoUrl = withSiteUrl(activeBrand.logoStacked);
  const brandImageUrl = withSiteUrl(activeBrand.logoWide);
  const alternateLinks = buildAlternateLinks(pageUrlPath);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": isHolding ? "Organization" : "LocalBusiness",
    name: site.name,
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
    const canonicalPath = getCanonicalPath(window.location.pathname);
    if (canonicalPath !== window.location.pathname.replace(/\/$/, "")) {
      window.history.replaceState({}, "", `${canonicalPath}${window.location.search}${window.location.hash}`);
    }

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
    if (!window.location.hash) return undefined;

    const timer = window.setTimeout(() => {
      scrollToHashTarget(window.location.hash);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [path]);

  useEffect(() => {
    if (!isPremiumHoldingHome) return undefined;

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

    homeNavItems.forEach(([, sectionId]) => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [homeNavItems, isPremiumHoldingHome]);

  function navigate(href) {
    window.history.pushState({}, "", href);
    setPath(getCurrentPath());
    setMenuOpen(false);
    if (href.includes("#")) {
      scrollToHashTarget(href.split("#")[1]);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      setStatus(labels.required);
      return;
    }
    try {
      await submitInquiry({
        site_key: "main-site",
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
      setStatus(uiOr(content, "inquiry_success", "Your message has been received. We will contact you soon."));
    } catch {
      setStatus(uiOr(content, "inquiry_error", "Unable to send your message. Please try again later."));
    }
  }

  return (
    <div className={`siteShell theme-${siteKey}`} data-content-source={content.source} dir={activeLang.dir} lang={lang}>
      <Helmet>
        <html lang={lang} dir={activeLang.dir} />
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={canonicalUrl} />
        {alternateLinks.map((item) => (
          <link key={item.code} rel="alternate" hrefLang={item.code} href={item.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="theme-color" content={activeBrand.color} />
        <link rel="icon" href={activeBrand.favicon} />
        <link rel="apple-touch-icon" href={activeBrand.logoStacked} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <header className="siteHeader">
        <a
          className="brand"
          href={usesPageNav ? "/" : "/#home"}
          onClick={(event) => {
            event.preventDefault();
            navigate(usesPageNav ? "/" : "/#home");
          }}
        >
          <img src={activeBrand.logoWide} alt={activeBrand.displayName} />
        </a>
        <button className="iconButton" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? "navLinks open" : "navLinks"} aria-label="Main navigation">
          {usesPageNav
            ? pageNavItems.map(([label, href, itemId]) => (
                <a
                  className={path === href ? "active" : ""}
                  href={href}
                  key={`${itemId}-${href}`}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(href);
                  }}
                >
                  {label}
                </a>
              ))
            : homeNavItems.map(([label, sectionId, href]) => {
                const targetHref = resolveHomeNavHref(sectionId, href);
                return (
                <a
                  className={isHomeNavItemActive({ activeSection, href: targetHref, isHome, path, sectionId }) ? "active" : ""}
                  href={targetHref}
                  key={sectionId}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(targetHref);
                  }}
                >
                  {label}
                </a>
                );
              })}
        </nav>
        <LanguageSelector lang={lang} languages={languages} onChange={changeLanguage} />
      </header>

      <main className={isPremiumHoldingHome ? "pageMain holdingLanding" : `pageMain layout-${layoutVariant}`} data-page-id={pageId}>
        {isPremiumHoldingHome ? (
          <>
            <section className="holdingHero" id="home">
              <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={activeHeroMedia.poster} aria-hidden="true">
                <source src={activeHeroMedia.video} type="video/mp4" />
              </video>
              <div className="heroBackdrop" aria-hidden="true" />
              <div className="holdingHeroInner">
                <Reveal className="holdingHeroCopy" y={18}>
                  <div className="heroLogoPanel" aria-label={activeBrand.displayName}>
                    <img src={activeBrand.logoStacked} alt={activeBrand.displayName} />
                  </div>
                  <p className="eyebrow">{textOr(cmsHero.eyebrow, "International Business Group")}</p>
                  <h1 className="holdingHeroTitle">
                    <span className="heroTitleFocus">{textOr(cmsHero.title, "Global business requests, routed clearly.")}</span>
                    <span className="heroTitleMuted">{textOr(cmsHero.lead, "One corporate entry point for property, trade, finance, residency, visa, and official document services.")}</span>
                  </h1>
                  <p className="lead">
                    {textOr(cmsHero.body, "REZAEI GLOBAL LLC helps clients, partners, and investors reach the correct specialist team without starting in the wrong place.")}
                  </p>
                  <div className="heroProofStrip" aria-label="Group coverage">
                    {heroProofItems.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="actions">
                    <a className="primaryButton heroContactButton" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>
                      {cmsHero.buttons?.[0]?.label || uiOr(content, "cta_contact", "Contact Us")}
                      <ArrowRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                </Reveal>
                <Stagger className="holdingHeroPanel" aria-label="Request routing paths">
                  <div className="heroPanelIntro">
                    <span>{cmsHero.settings?.panel_title || homeFb.panelTitle}</span>
                    <strong>{cmsHero.settings?.panel_subtitle || homeFb.panelSubtitle}</strong>
                  </div>
                  {displayHeroCards.map(([value, label, text]) => (
                    <StaggerItem as="article" key={label}>
                      <span className="heroCardIndex">{value}</span>
                      <div className="heroCardCopy">
                        <strong>{label}</strong>
                        <p>{text}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </section>

            <section className="holdingMission layoutSection" id="company">
              <div className="companyRedesign sectionInner">
                <Reveal className="companyLeadPanel">
                  <p className="eyebrow">{textOr(companySection.eyebrow, homeFb.companyEyebrow)}</p>
                  <h2>{textOr(companySection.title, homeFb.companyTitle)}</h2>
                  <p className="sectionIntro">
                    {textOr(companySection.summary || companySection.body, homeFb.companyIntro)}
                  </p>
                  <div className="companyMetricGrid">
                    {companyMetrics.map(([value, label]) => (
                      <span key={label}><strong>{value}</strong> {label}</span>
                    ))}
                  </div>
                  <div className="sectionCtaRow">
                    <button type="button" className="primaryButton" onClick={() => navigate("/about")}>
                      {sectionCtaLabel(textOr(cmsHomeSections.company?.eyebrow, homeFb.companyEyebrow), lang)}
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </div>
                </Reveal>
                <Stagger className="companyFeatureGrid">
                  {(companyCards.length ? companyCards : homeFb.defaultCompanyCards).map(([cardTitle, cardText], index) => {
                    const Icon = [Globe2, Building2, ShieldCheck][index] || Globe2;
                    const featureLabels = homeFb.featureLabels;
                    return (
                    <StaggerItem as="article" className={`companyFeatureCard${index === 0 ? " companyFeatureCardPrimary" : ""}`} key={`${cardTitle}-${index}`}>
                      <Icon size={24} aria-hidden="true" />
                      <span>{featureLabels[index] || "Feature"}</span>
                      <h3>{cardTitle}</h3>
                      <p>{cardText}</p>
                    </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            </section>

            <section className="holdingUnits layoutSection" id="business-units">
              <div className="sectionInner">
                <Reveal className="holdingSectionHeader">
                  <div>
                    <p className="eyebrow">{textOr(cmsHomeSections["business-units"]?.eyebrow, homeFb.businessUnitsEyebrow)}</p>
                    <h2>{textOr(cmsHomeSections["business-units"]?.title, homeFb.businessUnitsTitle)}</h2>
                  </div>
                </Reveal>
                <Stagger className="premiumUnitGrid">
                  {businessCards.map(([unitTitle, text, href, meta], index) => {
                    const Icon = businessUnitIcons[index] || Building2;
                    return (
                    <StaggerItem as="article" className="premiumUnitCard" key={`unit-${index}`}>
                      <span>{meta}</span>
                      <Icon size={30} aria-hidden="true" />
                      <h3>{unitTitle}</h3>
                      <p>{text}</p>
                      <a className="unitVisitLink" href={href || "/"}>
                        {localizedForm.visitUnit}
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    </StaggerItem>
                  );
                  })}
                </Stagger>
              </div>
            </section>

            {structureCards.length > 0 && (
            <section className="holdingStructure layoutSection" id="group-structure">
              <div className="sectionInner groupStructureRedesign">
                <Reveal className="holdingSectionHeader">
                  <div>
                    <p className="eyebrow">{textOr(groupStructureSection.eyebrow, homeFb.groupStructureEyebrow)}</p>
                    <h2>{textOr(groupStructureSection.title, homeFb.groupStructureTitle)}</h2>
                  </div>
                  {groupStructureSection.summary && <p>{groupStructureSection.summary}</p>}
                </Reveal>
                <Stagger className="orgStructureGrid">
                  {structureCards.map(([cardTitle, cardText], index) => (
                    <StaggerItem as="article" className={index === 0 ? "orgStructureParent" : undefined} key={`${cardTitle}-${index}`}>
                      <ShieldCheck size={22} aria-hidden="true" />
                      <h3>{cardTitle}</h3>
                      <p>{cardText}</p>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </section>
            )}

            <section className="holdingProcess layoutSection" id="how-we-work">
              <div className="sectionInner">
                <Reveal className="holdingSectionHeader">
                  <div>
                    <p className="eyebrow">{howWeWorkEyebrow}</p>
                    <h2>{howWeWorkTitle}</h2>
                  </div>
                  <p>
                    {cmsHomeSections["how-we-work"]?.summary ?? homeFallback.workSummary}
                  </p>
                </Reveal>
                <Stagger className="holdingFlow">
                  {displayProcessSteps.map(([step, text], index) => (
                    <StaggerItem as="article" key={step}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h3>{step}</h3>
                      <p>{text}</p>
                    </StaggerItem>
                  ))}
                </Stagger>
                <Reveal className="sectionCtaRow" delay={0.08} y={18}>
                  <button type="button" className="primaryButton" onClick={() => navigate("/how-we-work")}>
                    {sectionCtaLabel(howWeWorkEyebrow, lang)}
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </Reveal>
              </div>
            </section>

            <section className="holdingGovernance layoutSection" id="governance">
              <div className="sectionGrid">
                <Reveal>
                  <p className="eyebrow">{textOr(governanceSection.eyebrow, homeFb.governanceEyebrow)}</p>
                  <h2>{textOr(governanceSection.title, homeFb.governanceTitle)}</h2>
                  <p className="sectionIntro">
                    {governanceSection.summary ?? homeFallback.governanceSummary}
                  </p>
                  <div className="sectionCtaRow">
                    <button type="button" className="primaryButton" onClick={() => navigate("/governance")}>
                      {sectionCtaLabel(textOr(governanceSection.eyebrow, homeFb.governanceEyebrow), lang)}
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </div>
                </Reveal>
                <Stagger className="governanceGrid">
                  {governanceCards.map(([cardTitle, cardText], index) => {
                    const Icon = governanceIcons[index] || ShieldCheck;
                    return (
                      <StaggerItem as="article" key={`${cardTitle}-${index}`}>
                        <Icon size={22} aria-hidden="true" />
                        <h3>{cardTitle}</h3>
                        <p>{cardText}</p>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            </section>

            <section className="holdingUnits layoutSection" id="team">
              <TeamShowcase
                eyebrow={textOr(cmsHomeSections.team?.eyebrow, "Team")}
                title={textOr(cmsHomeSections.team?.title, "The people behind clear routing and specialist delivery.")}
                summary={cmsHomeSections.team?.summary ?? homeFallback.teamSummary}
                members={teamShowcaseMembers}
                quoteAuthor={teamShowcaseMembers[0]?.name || "Hosein Rezaei"}
                quoteRole={`${teamShowcaseMembers[0]?.role || "Group Managing Director"} · REZAEI GLOBAL LLC`}
                quoteImage={teamShowcaseMembers[0]?.image}
                variant="dark"
                showQuote={false}
              />
              <div className="sectionInner">
                <div className="sectionCtaRow">
                  <button type="button" className="primaryButton" onClick={() => navigate("/team")}>
                    {cmsHomeSections.team?.buttons?.[0]?.label ?? homeFallback.teamButton}
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>

            {(exploreSection.title || exploreSection.cards?.length > 0) && (
            <section className="holdingUnits layoutSection" id="explore-group">
              <div className="sectionInner">
                <Reveal className="holdingSectionHeader">
                  <div>
                    <p className="eyebrow">{textOr(exploreSection.eyebrow, "Explore Our Group")}</p>
                    <h2>{textOr(exploreSection.title, "Start with the holding, then move into the right platform.")}</h2>
                  </div>
                  {exploreSection.summary && <p>{exploreSection.summary}</p>}
                </Reveal>
                <Stagger className="premiumUnitGrid">
                  {(exploreSection.cards?.length ? exploreSection.cards : []).map(([cardTitle, cardText, href], index) => (
                    <StaggerItem as="article" className="premiumUnitCard" key={`explore-${index}`}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <Building2 size={30} aria-hidden="true" />
                      <h3>{cardTitle}</h3>
                      <p>{cardText}</p>
                      {href ? (
                        <a className="unitVisitLink" href={href}>
                          {localizedForm.visitUnit}
                          <ArrowRight size={15} aria-hidden="true" />
                        </a>
                      ) : null}
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </section>
            )}

            <section className="holdingContact layoutSection" id="contact">
              <div className="holdingContactInner">
                <Reveal className="holdingContactInfo">
                  <p className="eyebrow">{textOr(cmsHomeSections.contact?.eyebrow, "Contact")}</p>
                  <h2>{textOr(cmsHomeSections.contact?.title, "Send a group-level message.")}</h2>
                  <p className="sectionIntro">
                    {cmsHomeSections.contact?.summary ?? homeFallback.contactSummary}
                  </p>
                  <div className="contactDetails">
                    <span><Mail size={18} aria-hidden="true" /> {localizedContactRows[0]}</span>
                    <span><Phone size={18} aria-hidden="true" /> {localizedContactRows[1]}</span>
                    <span><Home size={18} aria-hidden="true" /> {localizedContactRows[2]}</span>
                  </div>
                </Reveal>
                <Reveal className="holdingFormWrapper" delay={0.08} y={20}>
                  <form className="holdingContactForm" onSubmit={handleSubmit}>
                    <div className="formField">
                      <label htmlFor="c-name">{localizedForm.fullName}</label>
                      <input id="c-name" name="name" type="text" placeholder={localizedForm.fullNamePlaceholder} required />
                    </div>
                    <div className="formRow2">
                      <div className="formField">
                        <label htmlFor="c-email">{localizedForm.email}</label>
                        <input id="c-email" name="email" type="email" placeholder={localizedForm.emailPlaceholder} />
                      </div>
                      <div className="formField">
                        <label htmlFor="c-phone">{localizedForm.phone}</label>
                        <input id="c-phone" name="phone" type="tel" placeholder={localizedForm.phonePlaceholder} />
                      </div>
                    </div>
                    <div className="formRow2">
                      <div className="formField">
                        <label htmlFor="c-service">{localizedForm.serviceInterest}</label>
                        <select id="c-service" name="service">
                          <option value="">{localizedForm.selectService}</option>
                          <option value="real_estate">{localizedForm.realEstate}</option>
                          <option value="finance_trade">{localizedForm.financeTrade}</option>
                          <option value="residency">{localizedForm.residency}</option>
                          <option value="general">{localizedForm.general}</option>
                        </select>
                      </div>
                      <div className="formField">
                        <label htmlFor="c-country">{localizedForm.country}</label>
                        <input id="c-country" name="country" type="text" placeholder={localizedForm.countryPlaceholder} />
                      </div>
                    </div>
                    <div className="formField">
                      <label htmlFor="c-message">{localizedForm.message}</label>
                      <textarea id="c-message" name="message" rows={5} placeholder={localizedForm.messagePlaceholder} required />
                    </div>
                    <button className="primaryButton contactSubmitBtn" type="submit">
                      <Send size={18} aria-hidden="true" />
                      {localizedForm.send}
                    </button>
                    {status && <p className="formStatus holdingFormStatus">{status}</p>}
                  </form>
                </Reveal>
              </div>
            </section>
          </>
        ) : useCmsDetailLayout ? (
          <LocalizedCmsPage
            content={content}
            handleSubmit={handleSubmit}
            localizedForm={localizedForm}
            navigate={navigate}
            pageLabel={pageLabel}
            pageText={pageText}
            pageTitle={pageTitle}
            status={status}
          />
        ) : isTeamPage ? (
          <TeamPage
            lang={lang}
            navigate={navigate}
            cmsHero={content.cmsHero}
            cmsData={content.team}
          />
        ) : isHolding && pageId === "contact" ? (
          <ContactPage
            lang={lang}
            cmsContact={content.contactPage}
            handleSubmit={handleSubmit}
            localizedContactRows={localizedContactRows}
            localizedForm={localizedForm}
            status={status}
            cmsHero={content.cmsHero}
          />
        ) : isHolding && pageId === "faq" ? (
          <FaqPage lang={lang} cmsHero={content.cmsHero} cmsFaqGroups={content.faqGroups} />
        ) : isHolding && pageId === "privacy" ? (
          <PrivacyPage lang={lang} cmsHero={content.cmsHero} cmsGroups={content.privacyGroups} cmsNote={content.privacyNote} />
        ) : isHolding && pageId === "terms" ? (
          <TermsPage lang={lang} cmsHero={content.cmsHero} cmsGroups={content.termsGroups} cmsNote={content.termsNote} />
        ) : isHolding && pageId === "about" ? (
          <AboutPage lang={lang} navigate={navigate} cmsHero={content.cmsHero} cmsData={content.about} />
        ) : isHolding && pageId === "governance" ? (
          <GovernancePage lang={lang} navigate={navigate} cmsHero={content.cmsHero} cmsData={content.governance} />
        ) : isHolding && (pageId === "group" || pageHref === "/how-we-work") ? (
          <GroupPage lang={lang} navigate={navigate} cmsHero={content.cmsHero} cmsData={content.groupPage} />
        ) : (
          <>
        <section className={isHome ? "hero" : "pageHero"}>
          {isHome && (
            <video className="heroVideo" autoPlay muted loop playsInline preload="metadata" poster={activeHeroMedia.poster} aria-hidden="true">
              <source src={activeHeroMedia.video} type="video/mp4" />
            </video>
          )}
          <div className="heroBackdrop" aria-hidden="true" />
          <div className="heroInner">
            {isHome && (
              <div className="heroLogoPanel" aria-label={activeBrand.displayName}>
                <img src={activeBrand.logoStacked} alt={activeBrand.displayName} />
              </div>
            )}
            <p className="eyebrow">{isHome ? copy.hero[0] : textOr(content.cmsHero?.eyebrow, pageLabel)}</p>
            <h1>{isHome ? copy.hero[1] : textOr(content.cmsHero?.title, pageTitle)}</h1>
            <p className="lead">{isHome ? copy.hero[2] : textOr(content.cmsHero?.lead, pageText)}</p>
            {!isTeamPage && (
              <div className="actions">
                <a className="primaryButton" href="/contact" onClick={(event) => { event.preventDefault(); navigate("/contact"); }}>
                  {labels.inquiry}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                  <a className="secondaryButton" href="/services" onClick={(event) => { event.preventDefault(); navigate(pages[1]?.[1] || "/"); }}>
                  {labels.pages}
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="signatureBand layoutSection">
          <div className="sectionInner">
            <div className="signatureHeader">
              <div>
                <p className="eyebrow">{signature.eyebrow}</p>
                <h2>{signature.title}</h2>
              </div>
              <p>{signature.intro}</p>
            </div>
            <div className="metricRail">
              {signature.metrics.map(([value, label, text]) => (
                <article className="metricCard" key={`${value}-${label}`}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="laneGrid">
              {signature.lanes.map(([laneTitle, laneText], index) => (
                <article className="laneCard" key={laneTitle}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{laneTitle}</h3>
                  <p>{laneText}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="overviewBand layoutSection">
          <div className="sectionGrid">
            <div>
              <p className="eyebrow">{labels.overview}</p>
              <h2>{pageTitle}</h2>
              <p>{detail.overview}</p>
            </div>
            <div className="featureGrid">
              {detailCards.map(([cardTitle, cardText], index) => {
                const Icon = iconMap[index % iconMap.length];
                return (
                  <GridPatternCard className="featureCard" key={cardTitle}>
                    <GridPatternCardBody className="featureCardBody">
                      <Icon size={24} aria-hidden="true" />
                      <h3>{cardTitle}</h3>
                      <p>{cardText}</p>
                    </GridPatternCardBody>
                  </GridPatternCard>
                );
              })}
            </div>
          </div>
        </section>

        <section className="detailBand layoutSection">
          <div className="sectionInner">
            <p className="eyebrow">{labels.highlights}</p>
            <h2>{pageTitle}</h2>
            <div className="detailCards">
              {detailSummary.map((item, index) => {
                const Icon = iconMap[(index + 2) % iconMap.length];
                return (
                  <article className="detailCard" key={item.title}>
                    <Icon size={22} aria-hidden="true" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contentBand layoutSection">
          <div className="sectionGrid">
            <div>
              <p className="eyebrow">{pageLabel}</p>
              <h2>{contentDepth.narrative[0].title}</h2>
              <p>{contentDepth.narrative[0].text}</p>
              <p>{contentDepth.narrative[1].text}</p>
            </div>
            <div className="contentPanel">
              <h3>{contentDepth.narrative[2].title}</h3>
              <p>{contentDepth.narrative[2].text}</p>
              <ul className="checkList">
                {contentDepth.checklist.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="deliverablesBand layoutSection">
          <div className="sectionInner">
            <p className="eyebrow">{labels.highlights}</p>
            <h2>{generatedLabels.coverage(pageTitle)}</h2>
            <div className="deliverableGrid">
              {contentDepth.deliverables.map((item, index) => {
                const Icon = iconMap[(index + 1) % iconMap.length];
                return (
                  <article className="deliverableCard" key={`${item.meta}-${item.title}`}>
                    <span>{item.meta}</span>
                    <Icon size={22} aria-hidden="true" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="scenarioBand layoutSection">
          <div className="sectionInner">
            <p className="eyebrow">{labels.overview}</p>
            <h2>{generatedLabels.situations(pageTitle)}</h2>
            <div className="scenarioGrid">
              {contentDepth.scenarios.map((item, index) => {
                const Icon = iconMap[(index + 3) % iconMap.length];
                return (
                  <article className="scenarioCard" key={item.title}>
                    <Icon size={20} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {!isTeamPage && (
          <section className="pagesBand layoutSection">
            <div className="sectionInner">
              <p className="eyebrow">{labels.pages}</p>
              <h2>{labels.pages}</h2>
              <div className="pageCards">
                {pages.map((item, index) => {
                  const Icon = iconMap[index % iconMap.length];
                  return (
                    <a
                      className={item[1] === pageHref ? "pageCard active" : "pageCard"}
                      href={item[1]}
                      key={item[1]}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(item[1]);
                      }}
                    >
                      <Icon size={22} aria-hidden="true" />
                      <h3>{item[3]}</h3>
                      <p>{item[4]}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="faqBand layoutSection">
          <div className="sectionInner">
            <p className="eyebrow">{labels.faq}</p>
            <h2>{generatedLabels.questions(pageTitle)}</h2>
            <div className="faqGrid">
              {contentDepth.questions.map((item) => (
                <article className="faqItem" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {isHolding && !isTeamPage && (
          <section className="groupBand layoutSection">
            <div className="sectionInner">
              <p className="eyebrow">{labels.group}</p>
              <h2>{labels.group}</h2>
              <div className="groupLinks">
                {localizedGroupSites.map((item, index) => {
                  const Icon = businessUnitIcons[index] || Globe2;
                  return (
                    <a className="groupServiceCard" href={item.href} key={`group-site-${index}-${item.href || item.title}`}>
                      <div className="groupCardTop">
                        <span className="groupCardNumber">{String(index + 1).padStart(2, "0")}</span>
                        <span className="groupCardIcon">
                          <Icon size={22} aria-hidden="true" />
                        </span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                      <span className="groupCardVisit">
                        {labels.visit}
                        <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="processBand layoutSection">
          <div className="sectionGrid">
            <div>
              <p className="eyebrow">{labels.process}</p>
              <h2>{labels.process}</h2>
            </div>
            <div className="steps">
              {detailProcess.map((step, index) => (
                <article className="step" key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contactBand layoutSection" id="contact">
          <div className="contactInner holdingContactInner pageContactInner">
            <div className="holdingContactInfo">
              <p className="eyebrow">{labels.contact}</p>
              <h2>{pageHref === "/contact" ? pageTitle : labels.inquiry}</h2>
              <p className="sectionIntro">{detail.contact}</p>
              <div className="contactRows contactDetails">
                <span><Mail size={18} aria-hidden="true" /> {localizedContactRows[0]}</span>
                <span><Phone size={18} aria-hidden="true" /> {localizedContactRows[1]}</span>
                <span><Home size={18} aria-hidden="true" /> {localizedContactRows[2]}</span>
              </div>
            </div>
            <div className="holdingFormWrapper">
              <form className="inquiryForm holdingContactForm" onSubmit={handleSubmit}>
                <div className="formField">
                  <label htmlFor="p-name">{labels.name}</label>
                  <input id="p-name" name="name" type="text" placeholder={localizedForm.fullNamePlaceholder} required />
                </div>
                <div className="formRow2">
                  <div className="formField">
                    <label htmlFor="p-email">{labels.email}</label>
                    <input id="p-email" name="email" type="email" placeholder={localizedForm.emailPlaceholder} />
                  </div>
                  <div className="formField">
                    <label htmlFor="p-phone">{labels.phone}</label>
                    <input id="p-phone" name="phone" type="tel" placeholder={localizedForm.phonePlaceholder} />
                  </div>
                </div>
                <div className="formRow2">
                  <div className="formField">
                    <label htmlFor="p-service">{localizedForm.serviceInterest}</label>
                    <select id="p-service" name="service">
                      <option value="">{localizedForm.selectService}</option>
                      <option value="real_estate">{localizedForm.realEstate}</option>
                      <option value="finance_trade">{localizedForm.financeTrade}</option>
                      <option value="residency">{localizedForm.residency}</option>
                      <option value="general">{localizedForm.general}</option>
                    </select>
                  </div>
                  <div className="formField">
                    <label htmlFor="p-country">{localizedForm.country}</label>
                    <input id="p-country" name="country" type="text" placeholder={localizedForm.countryPlaceholder} />
                  </div>
                </div>
                <div className="formField">
                  <label htmlFor="p-message">{labels.message}</label>
                  <textarea id="p-message" name="message" placeholder={localizedForm.messagePlaceholder} required rows="5" />
                </div>
                <button className="primaryButton contactSubmitBtn" type="submit">
                  <Send size={18} aria-hidden="true" />
                  {labels.submit}
                </button>
                {status && <p className="formStatus holdingFormStatus">{status}</p>}
              </form>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footerMain">
          <span className="footerBrand">
            <img src={activeBrand.logoStacked} alt="" aria-hidden="true" />
            <span>
              <strong>{site.name}</strong>
              <small>{localizedForm.corporateGroup}</small>
            </span>
          </span>
          <p>{localizedForm.footer}</p>
        </div>
        {!isTeamPage && (
          <nav className="footerLinks" aria-label="Footer navigation">
            {footerSupportPages.map((item) => (
              <a href={item[1]} key={item[1]} onClick={(event) => { event.preventDefault(); navigate(item[1]); }}>
                <BadgeCheck size={18} aria-hidden="true" />
                {item[2]}
              </a>
            ))}
          </nav>
        )}
      </footer>
    </div>
  );
}

function TeamPage({ lang, navigate, cmsHero, cmsData }) {
  const fallback = supportHero("team", lang);
  const pick = pickCms;
  const members = cmsData?.members?.length ? cmsData.members : [];
  const showcaseMembers = members.map((member, index) => ({
    name: member.title,
    role: member.role,
    bio: member.bio,
    image: resolveTeamImage(member.imageUrl, index),
  }));

  return (
    <>
      <section className="teamHero">
        <div className="teamHeroInner">
          <div className="teamHeroCopy">
            <p className="eyebrow">{pick(cmsHero?.eyebrow, fallback.eyebrow)}</p>
            <h1>{pick(cmsHero?.title, fallback.title)}</h1>
            <p>{pick(cmsHero?.lead || cmsHero?.summary, fallback.lead)}</p>
          </div>
          <div className="teamHeroPanel" aria-label="Leadership team overview">
            <div className="teamHeroPanelHeader">
              <Users size={22} aria-hidden="true" />
              <span>{pick(cmsData?.rosterEyebrow, fallback.rosterEyebrow)}</span>
            </div>
            <div className="teamHeroList">
              {showcaseMembers.slice(0, 4).map((member, index) => (
                <article key={`${member.name}-${index}`}>
                  <img src={member.image} alt="" aria-hidden="true" />
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TeamShowcase
        eyebrow={pick(cmsData?.rosterEyebrow, fallback.rosterEyebrow)}
        title={pick(cmsData?.rosterTitle, "")}
        summary={pick(cmsData?.rosterSummary, "")}
        members={showcaseMembers}
        quote={cmsData?.quote || ""}
        quoteAuthor={showcaseMembers[0]?.name || ""}
        quoteRole={showcaseMembers[0]?.role ? `${showcaseMembers[0].role} · REZAEI GLOBAL LLC` : ""}
        quoteImage={showcaseMembers[0]?.image}
        variant="light"
      />

      <section className="teamCta layoutSection">
        <div className="teamCtaInner">
          <div>
            <p className="eyebrow">{pick(cmsData?.ctaEyebrow, fallback.ctaEyebrow)}</p>
            <h2>{pick(cmsData?.ctaTitle, "")}</h2>
            <p>{pick(cmsData?.ctaText, "")}</p>
          </div>
          <button type="button" className="primaryButton" onClick={() => navigate(cmsData?.ctaHref || "/contact")}>
            {pick(cmsData?.ctaButton, fallback.ctaButton)}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
    </>
  );
}

function TermsPage({ lang, cmsHero, cmsGroups, cmsNote }) {
  const heroFallback = supportHero("terms", lang);
  const pick = pickCms;
  const termsGroupsFallback = [
    {
      title: "Website use",
      text: "The website is provided to explain the company, business units, and inquiry paths.",
      items: [
        ["Information only", "Service descriptions, page content, and business unit summaries are provided for general orientation and may change as the group updates its operations."],
        ["No automatic engagement", "Submitting a form or reading a service page does not create a confirmed service agreement, quotation, representation, or business commitment."],
      ],
    },
    {
      title: "Inquiry handling",
      text: "Requests are reviewed before any next step is confirmed.",
      items: [
        ["Direct review", "Each inquiry is assessed based on the details provided, the relevant country or market, timing, documents, and the responsible business unit."],
        ["Follow-up requirements", "The team may request more information before confirming whether a service path, timeline, quotation, or next step is available."],
      ],
    },
    {
      title: "Content and responsibility",
      text: "Use the website content responsibly and verify details directly.",
      items: [
        ["Brand and content", "The website name, structure, text, visuals, and brand materials belong to the REZAEI GLOBAL LLC website experience and should not be copied or reused without permission."],
        ["Final confirmation", "Important commercial, legal, document, property, trade, or residency decisions should be confirmed directly with the responsible team before you rely on them."],
      ],
    },
  ];
  const activeGroups = pick(cmsGroups?.length ? cmsGroups : null, termsGroupsFallback);
  const noteText = pick(cmsNote, heroFallback.noteText);

  return (
    <>
      <section className="termsHeroPro">
        <div className="termsHeroInner">
          <p className="eyebrow">{pick(cmsHero?.eyebrow, heroFallback.eyebrow)}</p>
          <h1>{pick(cmsHero?.title, heroFallback.title)}</h1>
          <p className="lead">{pick(cmsHero?.lead, heroFallback.lead)}</p>
        </div>
      </section>

      <section className="termsBodyPro">
        <div className="termsContentPro">
          {activeGroups.map((group, groupIndex) => (
            <section className="termsGroupPro" key={group.title}>
              <div className="termsGroupHeader">
                <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.text}</p>
                </div>
              </div>
              <div className="termsClauseListPro">
                {group.items.map(([title, text]) => (
                  <article className="termsClausePro" key={title}>
                    <span>{title}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className="termsNotePro">
            <h2>{heroFallback.noteTitle}</h2>
            <p>{noteText}</p>
          </section>
        </div>
      </section>
    </>
  );
}

function PrivacyPage({ lang, cmsHero, cmsGroups, cmsNote }) {
  const heroFallback = supportHero("privacy", lang);
  const pick = pickCms;
  const privacyGroupsFallback = [
    {
      title: "What we collect",
      text: "Only the details needed to understand and respond to an inquiry.",
      items: [
        ["Contact information", "When you use an inquiry form, we may receive your name, email address, phone number, company name, country, preferred service area, and message."],
        ["Request context", "Your message may include project details, document needs, property requirements, trade information, timelines, or other information you choose to provide."],
      ],
    },
    {
      title: "How we use it",
      text: "Information is used for direct business communication and request routing.",
      items: [
        ["Inquiry review", "We use submitted details to understand the request, identify the relevant business unit, and prepare a useful follow-up."],
        ["Specialist routing", "If the request belongs to a specific platform, the information may be shared internally with the team responsible for that service area."],
      ],
    },
    {
      title: "Your control",
      text: "You decide what to send in the first message.",
      items: [
        ["Keep it concise", "You do not need to send unnecessary personal or business documents in the first message. Share only what is needed to explain the request."],
        ["Follow-up choices", "You can ask for clarification, request a preferred contact method, or provide additional details after the correct service path is confirmed."],
      ],
    },
  ];
  const activeGroups = pick(cmsGroups?.length ? cmsGroups : null, privacyGroupsFallback);
  const noteText = pick(cmsNote, heroFallback.noteText);

  return (
    <>
      <section className="privacyHeroPro">
        <div className="privacyHeroInner">
          <p className="eyebrow">{pick(cmsHero?.eyebrow, heroFallback.eyebrow)}</p>
          <h1>{pick(cmsHero?.title, heroFallback.title)}</h1>
          <p className="lead">{pick(cmsHero?.lead, heroFallback.lead)}</p>
        </div>
      </section>

      <section className="privacyBodyPro">
        <div className="privacyContentPro">
          {activeGroups.map((group, groupIndex) => (
            <section className="privacyGroupPro" key={group.title}>
              <div className="privacyGroupHeader">
                <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.text}</p>
                </div>
              </div>
              <div className="privacyItemsPro">
                {group.items.map(([title, text]) => (
                  <article className="privacyItemPro" key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className="privacyNotePro">
            <h2>{heroFallback.noteTitle}</h2>
            <p>{noteText}</p>
          </section>
        </div>
      </section>
    </>
  );
}

function FaqPage({ lang, cmsHero, cmsFaqGroups }) {
  const heroFallback = supportHero("faq", lang);
  const pick = pickCms;
  const faqGroupsFallback = [
    {
      title: "Starting a request",
      text: "What to prepare before you contact the group.",
      questions: [
        ["What does REZAEI GLOBAL LLC do?", "REZAEI GLOBAL LLC is a holding company that connects clients and partners to focused business units across residency, documents, property, construction materials, import, export, and general trading."],
        ["Where should I send my request if I am not sure?", "Use the main contact page. The group team reviews the request first, then routes it to the right specialist business unit when the service area is clear."],
        ["What should I include in my first message?", "Include the service area, country, timeline, preferred language, and any documents, quantities, property details, or business context that may affect the next step."],
      ],
    },
    {
      title: "Routing and business units",
      text: "How the group directs requests to the right team.",
      questions: [
        ["Which requests go to Residency, Visa & Translation?", "Residency, visa, translation, attestation, legalization, and document-readiness requests are reviewed through the residency and visa platform."],
        ["Which requests go to Real Estate, Construction & Materials?", "Property, project, construction, building material, and quotation requests are routed to the real estate and materials team."],
        ["Which requests go to Import, Export & General Trading?", "Import, export, shipment coordination, product sourcing, payment context, and trade-related inquiries are routed to the trading platform."],
      ],
    },
    {
      title: "Follow-up and decisions",
      text: "What happens after your message is reviewed.",
      questions: [
        ["What happens after I submit an inquiry?", "The message is reviewed, the request type is identified, and the relevant team follows up with practical questions, required information, or a clear next action."],
        ["Can one request involve more than one business unit?", "Yes. If a request crosses more than one service area, the group keeps visibility and helps coordinate the handoff so the conversation does not restart from zero."],
        ["Are prices and timelines confirmed on the website?", "No. Pricing, timelines, and service feasibility depend on the exact request details and are confirmed only after direct review by the responsible team."],
      ],
    },
  ];
  const activeGroups = pick(cmsFaqGroups?.length ? cmsFaqGroups : null, faqGroupsFallback);
  const heroEyebrow = pick(cmsHero?.eyebrow, heroFallback.eyebrow);
  const heroTitle = pick(cmsHero?.title, heroFallback.title);
  const heroLead = pick(cmsHero?.lead, heroFallback.lead);

  return (
    <>
      <section className="faqHeroPro">
        <div className="faqHeroGrid">
          <p className="eyebrow">{heroEyebrow}</p>
          <h1>{heroTitle}</h1>
          <p className="lead">{heroLead}</p>
        </div>
      </section>

      <section className="faqBodyPro">
        <div className="faqQuestionsPro">
          {activeGroups.map((group, groupIndex) => (
            <section className="faqGroupPro" id={`faq-${groupIndex + 1}`} key={group.title}>
              <div className="faqGroupHeader">
                <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.text}</p>
                </div>
              </div>
              <div className="faqAccordionPro">
                {group.questions.map(([question, answer]) => (
                  <details className="faqQuestionPro" key={question}>
                    <summary>
                      <span>{question}</span>
                      <strong aria-hidden="true">+</strong>
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}

function LocalizedCmsPage({ content, handleSubmit, localizedForm, navigate, pageLabel, pageText, pageTitle, status }) {
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
                <div className="whyPointGrid">
                  {section.cards.map(([title, text, href], index) => (
                    <article key={`${section.key}-${index}`}>
                      <BadgeCheck size={20} aria-hidden="true" />
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
              {section.buttons?.length > 0 && (
                <div className="sectionCtaRow">
                  {section.buttons.map((button) => (
                    <button key={`${section.key}-${button.href}-${button.label}`} type="button" className="primaryButton" onClick={() => navigate(button.href)}>
                      {button.label} <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {isContact && (
        <section className="holdingContact layoutSection">
          <div className="holdingFormWrapper">
            <form className="holdingContactForm" onSubmit={handleSubmit}>
              <div className="formField">
                <label htmlFor="localized-name">{localizedForm.fullName}</label>
                <input id="localized-name" name="name" type="text" placeholder={localizedForm.fullNamePlaceholder} required />
              </div>
              <div className="formRow2">
                <div className="formField">
                  <label htmlFor="localized-email">{localizedForm.email}</label>
                  <input id="localized-email" name="email" type="email" placeholder={localizedForm.emailPlaceholder} />
                </div>
                <div className="formField">
                  <label htmlFor="localized-phone">{localizedForm.phone}</label>
                  <input id="localized-phone" name="phone" type="tel" placeholder={localizedForm.phonePlaceholder} />
                </div>
              </div>
              <div className="formField">
                <label htmlFor="localized-message">{localizedForm.message}</label>
                <textarea id="localized-message" name="message" rows={5} placeholder={localizedForm.messagePlaceholder} required />
              </div>
              <button className="primaryButton contactSubmitBtn" type="submit">
                <Send size={18} aria-hidden="true" />
                {localizedForm.send}
              </button>
              {status && <p className="formStatus holdingFormStatus">{status}</p>}
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default App;
