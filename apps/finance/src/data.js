import {
  Building2,
  ClipboardCheck,
  FileText,
  PackageCheck,
  Truck,
  ShieldCheck,
} from "lucide-react";

export const site = {
  kind: import.meta.env.VITE_SITE_KIND || "holding",
  name: import.meta.env.VITE_SITE_NAME || "REZAEI GLOBAL LLC",
  description: import.meta.env.VITE_SITE_DESCRIPTION || "REZAEI GLOBAL LLC corporate website.",
  publicUrl: import.meta.env.VITE_PUBLIC_URL || "http://localhost",
};

export const siteUrls = {
  mainSite: import.meta.env.VITE_MAIN_SITE_URL || "https://example.com",
  realEstate: import.meta.env.VITE_REAL_ESTATE_URL || "https://real-estate.example.com",
  finance: import.meta.env.VITE_FINANCE_URL || "https://finance.example.com",
  visa: import.meta.env.VITE_VISA_URL || "https://visa.example.com",
};

export const brand = {
  displayName: "REZAEI GLOBAL LLC",
  logoWide: "/brand/rezaei-global-logo-wide-web.png",
  logoStacked: "/brand/rezaei-global-logo-stacked-web.png",
  color: "#060d1a",
};

export const heroMedia = {
  holding: {
    video: "/media/hero/holding-hero.mp4",
    poster: brand.logoStacked,
  },
  residency: {
    video: "/media/hero/residency-hero.mp4",
    poster: brand.logoStacked,
  },
  realEstate: {
    video: "/media/hero/real-estate-hero.mp4",
    poster: brand.logoStacked,
  },
  trade: {
    video: "/media/hero/finance-hero.mp4",
    poster: brand.logoStacked,
  },
};

export const languages = [
  { code: "en", label: "EN", name: "English", dir: "ltr" },
  { code: "tr", label: "TR", name: "Türkçe", dir: "ltr" },
  { code: "fa", label: "FA", name: "فارسی", dir: "rtl" },
  { code: "ar", label: "AR", name: "العربية", dir: "rtl" },
];

export const groupSites = [
  { title: "Residency, Visa & Translation", href: siteUrls.visa, text: "Residency, visas, corporate setup, attestation, legalization, and translation services." },
  { title: "Real Estate, Construction & Materials", href: siteUrls.realEstate, text: "Property, construction projects, building materials, and industrial goods supply." },
  { title: "Import, Export & Currency Transfer", href: siteUrls.finance, text: "Trade, shipment coordination, currency transfer, and foreign exchange services." },
];

export const localizedGroupSites = {
  en: groupSites,
  tr: [
    { title: "Oturum, Vize ve Tercume", href: siteUrls.visa, text: "Oturum, vize, sirket kurulumu, tasdik, legalizasyon ve tercume hizmetleri." },
    { title: "Gayrimenkul, Insaat ve Malzemeler", href: siteUrls.realEstate, text: "Emlak, proje gelistirme, insaat, yapi malzemeleri ve endustriyel urun tedariki." },
    { title: "Ithalat, Ihracat ve Doviz Transferi", href: siteUrls.finance, text: "Ticaret, sevkiyat koordinasyonu, doviz transferi ve kambiyo hizmetleri." },
  ],
  fa: [
    { title: "اقامت، ویزا و ترجمه", href: siteUrls.visa, text: "خدمات اقامت، ویزا، ثبت شرکت، تایید مدارک، قانونی سازی و ترجمه." },
    { title: "املاک، ساخت و مصالح", href: siteUrls.realEstate, text: "املاک، توسعه پروژه، ساخت و ساز، مصالح ساختمانی و تامین کالاهای صنعتی." },
    { title: "واردات، صادرات و انتقال ارز", href: siteUrls.finance, text: "تجارت، هماهنگی حمل، انتقال ارز و خدمات تبادل ارز." },
  ],
  ar: [
    { title: "الإقامة والتأشيرات والترجمة", href: siteUrls.visa, text: "خدمات الإقامة والتأشيرات وتأسيس الشركات والتصديق والترجمة." },
    { title: "العقارات والبناء والمواد", href: siteUrls.realEstate, text: "العقارات وتطوير المشاريع والبناء ومواد البناء والسلع الصناعية." },
    { title: "الاستيراد والتصدير وتحويل العملات", href: siteUrls.finance, text: "التجارة وتنسيق الشحن وتحويل العملات وخدمات الصرف." },
  ],
};

export const supportPages = {
  en: [
    ["faq", "/faq", "FAQ", "Frequently asked questions", "Answers about service scope, inquiry handling, and next steps for REZAEI GLOBAL LLC trade and finance services."],
    ["privacy", "/privacy", "Privacy", "Privacy and data handling", "How inquiry form data, contact details, and trade file information are handled responsibly."],
    ["terms", "/terms", "Terms", "Website terms", "General website terms for service information, inquiry submission, and content use."],
  ],
  tr: [
    ["faq", "/faq", "SSS", "Sık sorulan sorular", "Hizmet kapsamı, talep yönetimi ve ticaret hizmetleri için sonraki adımlar hakkında cevaplar."],
    ["privacy", "/privacy", "Gizlilik", "Gizlilik ve veri kullanımı", "Talep formu verileri, iletişim bilgileri ve ticaret dosyası bilgilerinin sorumlu şekilde işlenmesi."],
    ["terms", "/terms", "Koşullar", "Web sitesi koşulları", "Hizmet bilgileri, talep gönderimi ve içerik kullanımı için genel web sitesi koşulları."],
  ],
  fa: [
    ["faq", "/faq", "پرسش ها", "پرسش های متداول", "پاسخ‌هایی درباره دامنه خدمات، مدیریت درخواست و گام‌های بعدی خدمات تجاری."],
    ["privacy", "/privacy", "حریم خصوصی", "حریم خصوصی و مدیریت داده", "نحوه مدیریت مسئولانه داده‌های فرم درخواست، تماس و پرونده تجاری."],
    ["terms", "/terms", "شرایط", "شرایط وب سایت", "شرایط عمومی برای اطلاعات خدمات، ارسال درخواست و استفاده از محتوا."],
  ],
  ar: [
    ["faq", "/faq", "الأسئلة", "الأسئلة الشائعة", "إجابات حول نطاق الخدمات ومعالجة الاستفسارات والخطوات التالية لخدمات التجارة."],
    ["privacy", "/privacy", "الخصوصية", "الخصوصية ومعالجة البيانات", "كيفية التعامل بمسؤولية مع بيانات النماذج والتواصل وملفات التجارة."],
    ["terms", "/terms", "الشروط", "شروط الموقع", "شروط عامة لمعلومات الخدمات وإرسال الاستفسارات واستخدام المحتوى."],
  ],
};

export const ui = {
  en: { home: "Home", about: "About", services: "Services", inquiry: "Inquiry", contact: "Contact", pages: "Pages", countryCoverage: "View Country Coverage", overview: "Overview", process: "Process", highlights: "Highlights", group: "Group Websites", name: "Name", email: "Email", phone: "Phone", message: "Message", submit: "Send Inquiry", sent: "Inquiry received.", required: "Please complete name and message.", visit: "Visit website", backHome: "Back to home", coverage: "coverage", situations: "Common situations", faq: "FAQ", languages: "Languages", platforms: "Platforms", registered: "Registered", support: "Support", footerTagline: "Import-export coordination, shipping documents, currency transfer, and FX support.", followUp: "Expected follow-up", prepare: "What to prepare", focus: "focus" },
  tr: { home: "Ana Sayfa", about: "Hakkimizda", services: "Hizmetler", inquiry: "Talep", contact: "Iletisim", pages: "Sayfalar", countryCoverage: "Ulke Kapsamini Gor", overview: "Genel Bakis", process: "Surec", highlights: "Basliklar", group: "Grup Siteleri", name: "Ad", email: "E-posta", phone: "Telefon", message: "Mesaj", submit: "Talep Gonder", sent: "Talep alindi.", required: "Lutfen ad ve mesaj alanlarini doldurun.", visit: "Web sitesine git", backHome: "Ana sayfaya don", coverage: "kapsami", situations: "Yaygin durumlar", faq: "SSS", languages: "Diller", platforms: "Platformlar", registered: "Kayitli", support: "Destek", footerTagline: "Ithalat-ihracat koordinasyonu, sevkiyat belgeleri, doviz transferi ve FX destegi.", followUp: "Beklenen takip", prepare: "Hazirlanacak bilgiler", focus: "odagi" },
  fa: { home: "خانه", about: "درباره", services: "خدمات", inquiry: "درخواست", contact: "تماس", pages: "صفحه ها", countryCoverage: "مشاهده پوشش کشورها", overview: "معرفی", process: "فرآیند", highlights: "نکات اصلی", group: "وب سایت های گروه", name: "نام", email: "ایمیل", phone: "تلفن", message: "پیام", submit: "ارسال درخواست", sent: "درخواست دریافت شد.", required: "لطفا نام و پیام را وارد کنید.", visit: "مشاهده وب سایت", backHome: "بازگشت به خانه", coverage: "پوشش", situations: "موقعیت های رایج", faq: "پرسش ها", languages: "زبان", platforms: "پلتفرم", registered: "ثبت شده", support: "پشتیبانی", footerTagline: "هماهنگی واردات و صادرات، اسناد حمل، انتقال ارز و پشتیبانی FX.", followUp: "پیگیری مورد انتظار", prepare: "موارد لازم برای آماده سازی", focus: "تمرکز" },
  ar: { home: "الرئيسية", about: "من نحن", services: "الخدمات", inquiry: "استفسار", contact: "تواصل", pages: "الصفحات", countryCoverage: "عرض تغطية الدول", overview: "نظرة عامة", process: "الخطوات", highlights: "أبرز النقاط", group: "مواقع المجموعة", name: "الاسم", email: "البريد", phone: "الهاتف", message: "الرسالة", submit: "إرسال الاستفسار", sent: "تم استلام الاستفسار.", required: "يرجى إدخال الاسم والرسالة.", visit: "زيارة الموقع", backHome: "العودة للرئيسية", coverage: "التغطية", situations: "حالات شائعة", faq: "الأسئلة", languages: "اللغات", platforms: "المنصات", registered: "مسجل", support: "الدعم", footerTagline: "تنسيق الاستيراد والتصدير ومستندات الشحن وتحويل العملات ودعم الصرف.", followUp: "المتابعة المتوقعة", prepare: "ما يجب تحضيره", focus: "التركيز" },
};

export const pageCopy = {
  holding: {
    en: {
      hero: ["International Business Group", "REZAEI GLOBAL LLC", "A central corporate identity presenting the company, group structure, service platforms, and inquiry channels for international clients."],
      pages: [
        ["home", "/", "Home", "Corporate overview", "Company introduction, group structure, and quick links to every REZAEI GLOBAL LLC service platform."],
        ["about", "/about", "Company Overview", "About REZAEI GLOBAL LLC", "A professional profile for the holding company, its market focus, service categories, and regional business presence."],
        ["group", "/group", "Group Structure", "Connected service platforms", "Central navigation to residency, real estate, construction, building materials, import, export, and currency transfer websites."],
        ["governance", "/governance", "Governance", "Responsible operating model", "A clear structure for inquiries, multilingual content management, lead capture, and future VPS deployment by subdomain."],
        ["contact", "/contact", "Contact", "Corporate inquiry", "Send a group-level request and route the lead to the correct business area."],
      ],
      cards: ["Corporate identity and company overview", "Subdomain-ready group structure", "Manual English, Turkish, Farsi, and Arabic content", "SEO, sitemap, robots, and inquiry foundation"],
      process: ["Discover the visitor need", "Route to the right group website", "Capture inquiry details", "Follow up through the relevant service team"],
    },
    tr: {
      hero: ["Uluslararasi Is Grubu", "REZAEI GLOBAL LLC", "Sirketi, grup yapisini, hizmet platformlarini ve uluslararasi musteri talep kanallarini sunan merkezi kurumsal kimlik."],
      pages: [
        ["home", "/", "Ana Sayfa", "Kurumsal genel bakis", "Sirket tanitimi, grup yapisi ve tum hizmet platformlarina hizli baglantilar."],
        ["about", "/about", "Sirket Genel Bakisi", "REZAEI GLOBAL LLC hakkinda", "Holding sirketi, pazar odagi, hizmet kategorileri ve bolgesel is varligi icin profesyonel profil."],
        ["group", "/group", "Grup Yapisi", "Bagli hizmet platformlari", "Oturum, emlak, insaat, malzeme, ithalat, ihracat ve doviz transferi sitelerine merkezi yonlendirme."],
        ["governance", "/governance", "Yonetim", "Sorumlu operasyon modeli", "Talepler, cok dilli icerik, potansiyel musteri toplama ve subdomain dagitimi icin net yapi."],
        ["contact", "/contact", "Iletisim", "Kurumsal talep", "Grup seviyesinde talep gonderin ve ilgili is alanina yonlendirin."],
      ],
      cards: ["Kurumsal kimlik ve sirket tanitimi", "Subdomain uyumlu grup yapisi", "Manuel EN, TR, FA, AR icerik", "SEO, sitemap, robots ve talep altyapisi"],
      process: ["Ziyaretci ihtiyacini belirle", "Dogru grup sitesine yonlendir", "Talep detaylarini al", "Ilgili hizmet ekibi takip etsin"],
    },
    fa: {
      hero: ["گروه کسب و کار بین المللی", "رضائی گلوبال م.م.", "هویت مرکزی برای معرفی شرکت، ساختار گروه، پلتفرم های خدماتی و مسیرهای دریافت درخواست از مشتریان بین المللی."],
      pages: [
        ["home", "/", "خانه", "معرفی شرکتی", "معرفی شرکت، ساختار گروه و لینک سریع به همه پلتفرم های خدماتی."],
        ["about", "/about", "معرفی شرکت", "درباره رضائی گلوبال م.م.", "پروفایل حرفه ای هلدینگ، حوزه های بازار، دسته های خدمات و حضور منطقه ای."],
        ["group", "/group", "ساختار گروه", "پلتفرم های خدماتی متصل", "هدایت مرکزی به وب سایت های اقامت، املاک، ساخت، مصالح، واردات، صادرات و انتقال ارز."],
        ["governance", "/governance", "مدیریت", "مدل عملیاتی شفاف", "ساختار روشن برای درخواست ها، محتوای چندزبانه، جذب سرنخ و استقرار روی ساب دامنه."],
        ["contact", "/contact", "تماس", "درخواست شرکتی", "درخواست سطح گروه را ارسال کنید تا به بخش مناسب هدایت شود."],
      ],
      cards: ["هویت شرکتی و معرفی شرکت", "ساختار آماده برای ساب دامنه", "محتوای دستی انگلیسی، ترکی، فارسی و عربی", "پایه SEO، نقشه سایت، robots و فرم درخواست"],
      process: ["تشخیص نیاز بازدیدکننده", "هدایت به سایت مناسب گروه", "ثبت جزئیات درخواست", "پیگیری توسط تیم مربوطه"],
    },
    ar: {
      hero: ["مجموعة أعمال دولية", "رضائي العالمية ذ.م.م.", "هوية مركزية للتعريف بالشركة وهيكل المجموعة ومنصات الخدمات وقنوات الاستفسار للعملاء الدوليين."],
      pages: [
        ["home", "/", "الرئيسية", "نظرة مؤسسية", "تعريف الشركة وهيكل المجموعة وروابط سريعة لكل منصات الخدمات."],
        ["about", "/about", "نبذة عن الشركة", "حول رضائي العالمية ذ.م.م.", "ملف مهني للشركة القابضة وتركيز السوق وفئات الخدمات والحضور الإقليمي."],
        ["group", "/group", "هيكل المجموعة", "منصات خدمات متصلة", "توجيه مركزي إلى مواقع الإقامة والعقار والبناء والمواد والاستيراد والتصدير وتحويل العملات."],
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
      hero: ["Finance, Trade & Currency Services", "Import, export, shipment coordination, currency transfer, and foreign exchange support", "A focused platform for companies, suppliers, buyers, and payment teams coordinating cross-border goods, documents, shipping, and business currency needs."],
      pages: [
        ["home", "/", "Home", "Trade and finance overview", "A cross-border service hub for import, export, logistics coordination, payment timing, currency transfer, and FX inquiries."],
        ["import-export", "/import-export", "Import & Export", "Sourcing and trade operations", "Service pages for product sourcing, supplier communication, buyer requests, export planning, and import coordination."],
        ["shipping", "/shipping", "Shipping", "Shipment documents and logistics coordination", "Shipment coordination, cargo details, document follow-up, route planning, and logistics inquiry support."],
        ["currency-transfer", "/currency-transfer", "Currency Transfer", "Business payment coordination", "Request path for currency transfer, supplier payment timing, invoice settlement, and international money movement."],
        ["foreign-exchange", "/foreign-exchange", "Foreign Exchange", "FX inquiry support", "Foreign exchange request support for business clients with currency pair, amount, timing, and trade context."],
        ["countries", "/countries", "Countries", "Country and route coverage", "Country pages for origin, destination, supplier market, buyer country, documents, and payment-route context."],
        ["contact", "/contact", "Contact", "Start a finance or trade inquiry", "Send import, export, shipment, payment, currency transfer, or foreign exchange details."],
      ],
      cards: ["Import and export coordination", "Shipment and document follow-up", "Currency transfer planning", "Foreign exchange inquiry support"],
      process: ["Choose trade, shipment, or payment need", "Share goods, route, amount, and timing", "Review documents and requirements", "Coordinate next steps"],
    },
    tr: {
      hero: ["Ithalat, Ihracat ve Doviz Transfer Hizmetleri", "Uluslararasi ticaret, sevkiyat koordinasyonu ve doviz transferi", "Ithalat, ihracat, uluslararasi ticaret, sevkiyat koordinasyonu, para transferi ve doviz hizmetleri icin profesyonel site."],
      pages: [
        ["home", "/", "Ana Sayfa", "Ticaret hizmetleri", "Sinir otesi ticaret, sevkiyat, para transferi ve doviz talepleri icin tam platform."],
        ["import-export", "/import-export", "Ithalat & Ihracat", "Ithalat ve ihracat operasyonlari", "Tedarik, ticaret koordinasyonu, tedarikci iletisimleri ve ithalat/ihracat talepleri."],
        ["shipping", "/shipping", "Sevkiyat", "Uluslararasi sevkiyat koordinasyonu", "Sevkiyat koordinasyonu, belge takibi, ticari iletisim ve lojistik talep destegi."],
        ["currency-transfer", "/currency-transfer", "Para Transferi", "Para transfer hizmetleri", "Para transferi, odeme koordinasyonu ve uluslararasi para hareketi talepleri."],
        ["foreign-exchange", "/foreign-exchange", "Doviz", "Doviz hizmet talepleri", "Is musterileri icin acik formlar ve hizmet aciklamalariyla doviz talep destegi."],
        ["countries", "/countries", "Ulkeler", "Ulke ve rota kapsami", "Cikis, varis, tedarikci pazari, alici ulkesi, belgeler ve odeme rotasi icin ulke sayfalari."],
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
        ["countries", "/countries", "کشورها", "پوشش کشور و مسیر", "صفحات کشور برای مبدا، مقصد، بازار تامین کننده، کشور خریدار، مدارک و مسیر پرداخت."],
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
        ["countries", "/countries", "الدول", "تغطية الدول والمسارات", "صفحات للدول حسب المصدر والوجهة وسوق المورد وبلد المشتري والمستندات ومسار الدفع."],
        ["contact", "/contact", "تواصل", "ابدأ استفسار تجارة", "أرسل تفاصيل الاستيراد أو التصدير أو الشحن أو التحويل أو الصرف."],
      ],
      cards: ["صفحات الاستيراد والتصدير", "تنسيق الشحن الدولي", "مسار استفسار تحويل العملات", "عرض خدمات الصرف الأجنبي"],
      process: ["اختيار حاجة التجارة أو التحويل", "إرسال التفاصيل", "مراجعة المسار والمتطلبات", "تنسيق الخطوات التالية"],
    },
  },
};

export const kindMap = {
  holding: "holding",
  residency: "residency",
  "real-estate": "realEstate",
  trade: "trade",
};

export const iconMap = [Building2, ClipboardCheck, FileText, PackageCheck, Truck, ShieldCheck];

export const newPages = {
  holding: ["leadership", "/leadership", "Leadership", "Leadership and operating standards", "How REZAEI GLOBAL LLC keeps group communication, service routing, and client follow-up consistent across every business unit."],
  residency: ["case-review", "/case-review", "Case Review", "Document readiness and case review", "A focused page for checking document readiness, translation needs, attestation steps, and the right service path before work begins."],
  realEstate: ["market-insights", "/market-insights", "Market Insights", "Property, construction, and materials intelligence", "Practical market notes for buyers, investors, contractors, and procurement teams comparing opportunities and supply options."],
  trade: ["trade-desk", "/trade-desk", "Trade Desk", "Shipment and payment coordination desk", "A coordination page for trade requests that need sourcing, shipping documents, currency transfer timing, and follow-up in one workflow."],
};

export const localizedNewPages = {
  en: newPages,
  tr: {
    holding: ["leadership", "/leadership", "Liderlik", "Liderlik ve operasyon standartlari", "REZAEI GLOBAL LLC'nin grup iletisimini, hizmet yonlendirmesini ve musteri takibini nasil tutarli tuttugunu aciklar."],
    residency: ["case-review", "/case-review", "Dosya Inceleme", "Belge hazirligi ve dosya inceleme", "Calisma baslamadan once belge hazirligi, tercume ihtiyaci, tasdik adimlari ve dogru hizmet yolunu kontrol eden sayfa."],
    realEstate: ["market-insights", "/market-insights", "Pazar Notlari", "Emlak, insaat ve malzeme bilgisi", "Alicilar, yatirimcilar, yukleniciler ve satin alma ekipleri icin pratik pazar notlari."],
    trade: ["trade-desk", "/trade-desk", "Ticaret Masasi", "Sevkiyat ve odeme koordinasyonu", "Tedarik, sevkiyat belgeleri, doviz transferi zamanlamasi ve takip gerektiren ticaret talepleri icin koordinasyon sayfasi."],
  },
  fa: {
    holding: ["leadership", "/leadership", "رهبری", "رهبری و استانداردهای عملیاتی", "نحوه حفظ ارتباطات گروه، هدایت خدمات و پیگیری مشتری در همه واحدهای کسب و کار رضائی گلوبال م.م.."],
    residency: ["case-review", "/case-review", "بررسی پرونده", "آمادگی مدارک و بررسی پرونده", "صفحه ای برای بررسی آمادگی مدارک، نیاز ترجمه، مراحل تایید و مسیر درست خدمات قبل از شروع کار."],
    realEstate: ["market-insights", "/market-insights", "بینش بازار", "اطلاعات املاک، ساخت و مصالح", "نکات کاربردی بازار برای خریداران، سرمایه گذاران، پیمانکاران و تیم های خرید."],
    trade: ["trade-desk", "/trade-desk", "میز تجارت", "هماهنگی حمل و پرداخت", "صفحه هماهنگی برای درخواست های تجاری که تامین، اسناد حمل، زمان انتقال ارز و پیگیری را یکجا نیاز دارند."],
  },
  ar: {
    holding: ["leadership", "/leadership", "القيادة", "القيادة ومعايير التشغيل", "كيف تحافظ رضائي العالمية ذ.م.م. على اتساق التواصل وتوجيه الخدمات ومتابعة العملاء في كل وحدة عمل."],
    residency: ["case-review", "/case-review", "مراجعة الملف", "جاهزية المستندات ومراجعة الملف", "صفحة لفحص جاهزية المستندات واحتياجات الترجمة وخطوات التصديق ومسار الخدمة الصحيح قبل بدء العمل."],
    realEstate: ["market-insights", "/market-insights", "رؤى السوق", "معلومات العقار والبناء والمواد", "ملاحظات عملية للمشترين والمستثمرين والمقاولين وفرق المشتريات عند مقارنة الفرص وخيارات التوريد."],
    trade: ["trade-desk", "/trade-desk", "مكتب التجارة", "تنسيق الشحن والمدفوعات", "صفحة تنسيق لطلبات التجارة التي تحتاج إلى توريد ومستندات شحن وتوقيت تحويل العملات والمتابعة."],
  },
};

export const supportDetails = {
  faq: {
    overview: "This page answers practical questions visitors ask before sending a request, including what information to prepare, how inquiries are routed, and what happens after submission.",
    cards: [
      ["Service scope", "Clear answers separate general website information from the services that require direct review by the relevant REZAEI GLOBAL LLC team."],
      ["Inquiry handling", "Forms collect route, goods, documents, amount, and timing so the trade desk can respond with useful context."],
      ["Trade desk routing", "Requests are classified across import-export, shipping, currency transfer, and FX coordination."],
      ["Next steps", "Visitors are guided toward a contact path with clear preparation guidance."],
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
      ["Content use", "Brand, text, and media are part of the REZAEI GLOBAL LLC trade platform and should be treated accordingly."],
      ["Service confirmation", "Final trade, shipment, or payment terms are confirmed only through direct written agreement."],
    ],
    process: ["Read service information", "Submit relevant details", "Wait for team confirmation", "Proceed with agreed next steps"],
    contact: "Use the contact form to clarify terms for a specific request.",
  },
};

export const pageDetails = {
  holding: {
    home: { overview: "The holding homepage introduces REZAEI GLOBAL LLC as the central identity behind connected service platforms, giving visitors a fast route to the right business area.", cards: [["Corporate identity", "The page establishes one recognizable brand system for all REZAEI GLOBAL LLC websites and future subdomains."], ["Service map", "Visitors can move from the group website to residency, real estate, construction, materials, trade, and currency services."], ["Lead routing", "The content is designed to move broad inquiries toward the team that can act on them."], ["Launch foundation", "SEO metadata, structured pages, video hero media, and inquiry paths are already prepared for deployment."]], process: ["Identify the business need", "Choose the matching service platform", "Submit the inquiry", "Route follow-up to the right team"], contact: "Send a group-level message when the correct service platform is not obvious yet." },
    about: { overview: "The company overview page explains the role of REZAEI GLOBAL LLC as a coordinated business group with multilingual websites and service-specific inquiry channels.", cards: [["Group profile", "The page positions the company as a central business identity rather than a single-service landing page."], ["Regional presence", "Copy highlights international clients and markets connected through Oman, Turkey, Iran, and Arabic-speaking audiences."], ["Service categories", "Visitors can see how separate business lines connect under one operating brand."], ["Professional tone", "The page keeps the brand formal, direct, and suitable for corporate introductions."]], process: ["Introduce the company", "Clarify the operating areas", "Present the regional context", "Guide visitors toward action"], contact: "Use this page for general company questions and partnership introductions." },
    group: { overview: "The group structure page acts as a switchboard for the business, explaining how each service website fits into the wider REZAEI GLOBAL LLC ecosystem.", cards: [["Residency platform", "Visa, corporate setup, attestation, legalization, and translation inquiries are separated into their own path."], ["Real estate platform", "Property, development, construction, materials, and quotation requests are directed to a specialized website."], ["Trade platform", "Import, export, shipping, currency transfer, and foreign exchange requests move through a trade-focused workflow."], ["Central navigation", "The holding site keeps the group understandable for visitors who arrive without knowing the correct subdomain."]], process: ["Review the business areas", "Open the matching platform", "Compare page-level services", "Start a focused inquiry"], contact: "Ask the group team to route a request when it spans more than one platform." },
    governance: { overview: "The governance page describes the operating logic behind the websites: consistent branding, multilingual structure, responsible inquiry handling, and subdomain-ready deployment.", cards: [["Content governance", "Each website follows the same page model while keeping service-specific titles, summaries, and actions."], ["Lead accountability", "Inquiry forms capture enough detail for routing without creating unnecessary user accounts or workflow complexity."], ["Deployment model", "The sites are built for Docker, nginx routing, and local hostnames that can map cleanly to production domains."], ["Brand consistency", "Logo, color, typography, video, and card systems are shared so every platform feels connected."]], process: ["Keep structure consistent", "Separate service content", "Route inquiries responsibly", "Deploy under clear hostnames"], contact: "Use this page for operational, deployment, or website management questions." },
    contact: { overview: "The corporate contact page is for group-level questions, partnership introductions, and requests that need help choosing the right service platform.", cards: [["General inquiries", "Visitors can introduce a business need before selecting a specific service website."], ["Partnership contact", "The form supports introductions from companies, consultants, suppliers, and regional contacts."], ["Routing support", "Broad messages can be passed toward residency, real estate, construction, materials, trade, or finance workflows."], ["Follow-up clarity", "The message field gives the team enough context to respond with the correct next step."]], process: ["Submit group inquiry", "Review the business category", "Route to the correct team", "Continue with focused follow-up"], contact: "Include the service area, country, timeline, and preferred contact method." },
    leadership: { overview: "The leadership page defines the standards used across the REZAEI GLOBAL LLC websites.", cards: [["Client communication", "Every page should make it clear what the visitor can ask for and what information helps the team respond."], ["Operating discipline", "The group structure keeps each business line focused while preserving one recognizable corporate identity."], ["Quality standards", "Content avoids vague claims and instead explains practical service paths, document needs, inquiry scope, and follow-up expectations."], ["Growth readiness", "The website system is prepared for more business units, richer case pages, and production domain rollout."]], process: ["Set brand standards", "Align service pages", "Measure inquiry quality", "Improve content with real client needs"], contact: "Use this page for executive, partnership, or operating-standard conversations." },
  },
  residency: {
    home: { overview: "The residency homepage gives individuals, investors, and companies a clear starting point for visa, setup, attestation, legalization, and translation requests.", cards: [["Service triage", "Visitors can understand whether their need belongs to residency, corporate setup, legalization, or translation."], ["Document focus", "The page prepares visitors to think about passports, certificates, company papers, and official translations."], ["Multilingual support", "Language options make the service path easier for clients communicating across regions."], ["Inquiry readiness", "The form gathers enough context to begin review without overloading the visitor."]], process: ["Choose the service area", "Share the document context", "Confirm the likely path", "Coordinate next steps"], contact: "Mention the country, document type, deadline, and whether translation or attestation is needed." },
    "corporate-setup": { overview: "The corporate setup page focuses on company formation guidance, consulting, document preparation, and coordination.", cards: [["Formation guidance", "The page explains setup support for visitors who need a structured business path."], ["Document preparation", "Clients are encouraged to identify existing company papers and personal documents early."], ["Consultancy scope", "The content separates general guidance from the specific review needed for each case."], ["Follow-up planning", "The inquiry form helps collect business activity, jurisdiction, and timeline details."]], process: ["Describe the business goal", "Review document needs", "Confirm setup direction", "Coordinate the case"], contact: "Include business activity, owner details, target country or sultanate, and timing." },
    "residency-visa": { overview: "The residency and visa page is built for case preparation, renewal questions, status changes, family or investor needs, and structured follow-up.", cards: [["Case type", "The page helps distinguish new applications, renewals, family cases, investor paths, and work-related requests."], ["Eligibility context", "Visitors can share nationality, location, existing status, and timeline without exposing unnecessary details."], ["Document review", "The service path depends on passports, IDs, photos, sponsor details, and supporting papers."], ["Clear next step", "The goal is to move from broad visa questions to a reviewed, practical action path."]], process: ["Identify visa need", "List current status", "Check document readiness", "Plan the application path"], contact: "Mention current visa status, nationality, location, and preferred timeline." },
    legalization: { overview: "The legalization page covers attestation, official coordination, document status follow-up, and the steps needed before documents can be used abroad.", cards: [["Document origin", "The process starts by understanding where the document was issued and where it will be used."], ["Attestation path", "Different documents may require ministry, embassy, consulate, or other official handling."], ["Status tracking", "The page sets expectations that document movement and approval steps may need staged follow-up."], ["Use case clarity", "Knowing the final purpose helps determine the correct legalization route."]], process: ["Identify document origin", "Confirm destination use", "Review attestation steps", "Coordinate official handling"], contact: "Include document type, issuing country, destination country, and intended use." },
    translation: { overview: "The translation page focuses on official, legal, commercial, and business document translation.", cards: [["Document category", "Contracts, certificates, IDs, company papers, and legal documents require different handling."], ["Language pair", "The page encourages visitors to specify source and target languages clearly."], ["Official use", "Certified or official translation may depend on where the document will be submitted."], ["Connected services", "Translation can be paired with attestation or legalization when the case requires it."]], process: ["Share document type", "Confirm language pair", "State official use", "Prepare translation quote"], contact: "Mention source language, target language, page count, and deadline." },
    contact: { overview: "The contact page collects the first details needed to route residency, visa, setup, attestation, legalization, and translation inquiries.", cards: [["Service routing", "The message can be directed to the correct specialist based on the selected topic."], ["Document summary", "A short description of documents helps the team understand the case quickly."], ["Timeline signal", "Urgent deadlines should be stated early so the response can be realistic."], ["Multilingual reply", "Visitors can indicate their preferred language for follow-up."]], process: ["Send case summary", "Review service category", "Confirm missing details", "Continue with the right team"], contact: "Include the document type, service needed, country, and deadline." },
    "case-review": { overview: "The case review page gives clients a practical checklist before starting work.", cards: [["Readiness check", "The page asks visitors to think through document availability, validity, translations, and official-use requirements."], ["Service matching", "A case may need more than one service, such as translation plus attestation or visa plus corporate setup."], ["Risk reduction", "Early review helps identify missing papers, timing issues, and unclear submission destinations."], ["Better handoff", "A cleaner first message helps the team respond with a more accurate next step."]], process: ["List documents", "Identify final use", "Check deadline", "Request review"], contact: "Send a case summary with document names, issuing country, destination country, and target date." },
  },
  realEstate: {
    home: { overview: "The real estate homepage connects property, development, construction, materials, and quotation requests in one professional entry point.", cards: [["Property direction", "Visitors can move toward buying, investment, listing, or project-related conversations."], ["Construction scope", "The platform supports construction and development inquiries alongside property services."], ["Material sourcing", "Procurement visitors can ask about building materials and industrial goods."], ["Quote readiness", "The inquiry path is designed to collect location, quantity, project type, and timeline."]], process: ["Choose property or material need", "Share project context", "Review options", "Coordinate quotation or follow-up"], contact: "Mention location, property type, material type, budget range, and timeline." },
    properties: { overview: "The properties page is for buyer, investor, seller, and tenant inquiries.", cards: [["Buyer criteria", "Visitors can share property type, location, size, budget, and investment intent."], ["Investor context", "The page supports requests comparing income potential, development fit, or market positioning."], ["Listing support", "Owners can introduce properties that may need structured presentation or inquiry routing."], ["Follow-up quality", "Clear criteria help the team respond with relevant options instead of broad suggestions."]], process: ["Define property need", "Share location and budget", "Review matching options", "Arrange follow-up"], contact: "Include property type, preferred area, budget, and buying or leasing intent." },
    projects: { overview: "The projects page presents construction and development capability.", cards: [["Development context", "Project inquiries can include land, concept, stage, budget, and intended use."], ["Construction capability", "The page supports conversations about contractor needs, scope, and delivery expectations."], ["Portfolio framing", "Project content can later expand into case studies, milestones, and visual progress updates."], ["Partnership route", "Investors and owners can start a structured discussion without forcing a property listing format."]], process: ["Describe the project", "Share stage and location", "Review scope", "Plan next discussion"], contact: "Mention project location, stage, size, and required role." },
    materials: { overview: "The materials page is for building materials, industrial goods, and procurement requests.", cards: [["Material category", "Requests can cover construction materials, industrial goods, fixtures, or project-specific supply items."], ["Quantity detail", "The team needs quantities, specifications, grade, and delivery destination to prepare a useful response."], ["Supplier coordination", "The page supports procurement conversations that may involve sourcing and logistics."], ["Quote preparation", "Clear item descriptions reduce delays and help move toward pricing."]], process: ["List materials", "Share specifications", "Confirm delivery needs", "Prepare quotation path"], contact: "Include item names, quantity, specs, destination, and expected delivery date." },
    quotation: { overview: "The quotation page is built for structured requests where visitors already know they need pricing.", cards: [["Request structure", "The page encourages visitors to send measurable requirements instead of a vague price question."], ["Scope clarity", "Construction and material quotes depend on location, dimensions, quantity, and required standard."], ["Response planning", "A clear first request helps the team decide whether pricing, consultation, or inspection is the next step."], ["Procurement fit", "The page can support both local project needs and supply-related inquiries."]], process: ["Write the requirement", "Add quantities and location", "Review feasibility", "Follow up with quote details"], contact: "Attach or describe the scope, quantities, site location, and deadline." },
    contact: { overview: "The contact page routes property, development, construction, materials, and quotation inquiries.", cards: [["Property contact", "Buyer, investor, seller, and tenant messages can start with basic criteria."], ["Project contact", "Construction or development messages can focus on stage, site, and role needed."], ["Material contact", "Procurement messages can list items, specs, quantities, and delivery target."], ["Team routing", "The message content determines whether follow-up should focus on property, project, or supply."]], process: ["Submit inquiry", "Classify request", "Ask for missing details", "Coordinate follow-up"], contact: "Include the category, location, budget or quantity, and timeline." },
    "market-insights": { overview: "The market insights page gives visitors a more informed starting point.", cards: [["Property signals", "The page can frame area demand, buyer intent, project stage, and investment criteria."], ["Construction planning", "Visitors can think through scope, timing, contractor needs, and material availability before contacting the team."], ["Procurement awareness", "Material requests work better when specifications, quantity, and delivery expectations are clear."], ["Decision support", "The page supports comparison and planning rather than only a direct sales pitch."]], process: ["Review market context", "Define the opportunity", "Prepare key details", "Request focused guidance"], contact: "Send the market, property type, project stage, and decision timeline." },
  },
  trade: {
    home: { overview: "The finance and trade homepage connects import, export, shipping documents, supplier coordination, currency transfer, and foreign exchange questions in one operational workflow.", cards: [["Trade request", "Visitors can start with product sourcing, supplier communication, buyer requests, import planning, export planning, or shipment questions."], ["Logistics context", "Shipment requests work better when origin, destination, cargo type, Incoterms, and available documents are clear."], ["Payment timing", "Currency transfer and FX questions can be reviewed alongside invoices, supplier deadlines, shipment milestones, and settlement dates."], ["Business follow-up", "The page moves broad trade and finance questions toward a concrete operational path."]], process: ["Choose trade, shipment, or payment need", "Share route, goods, documents, and amount", "Review requirements", "Coordinate next step"], contact: "Include origin, destination, cargo details, invoice or payment amount, currency pair, and required timeline." },
    "import-export": { overview: "The import and export page supports sourcing, supplier communication, buyer requests, product movement, documentation, and cross-border business coordination.", cards: [["Product sourcing", "Visitors can describe product type, target supplier, volume, specifications, and destination market."], ["Export planning", "The page supports conversations around buyer requirements, product readiness, documentation, and shipment route."], ["Supplier communication", "Trade requests often require coordination across language, documentation, payment expectations, and delivery terms."], ["Requirement capture", "A clearer first message helps determine whether sourcing, logistics, documentation, or payment is the main issue."]], process: ["Describe goods", "Confirm origin and destination", "Review trade requirements", "Coordinate supplier or buyer follow-up"], contact: "Mention product, quantity, specifications, origin, destination, and buyer or supplier status." },
    shipping: { overview: "The shipping page focuses on logistics coordination, cargo details, document follow-up, route planning, and communication around international movement.", cards: [["Cargo profile", "Cargo type, size, weight, packaging, value, and destination shape the shipment path."], ["Document follow-up", "Commercial invoices, packing lists, certificates, customs papers, and shipping documents may be required."], ["Route planning", "The page helps capture origin, destination, urgency, transport preference, and delivery expectations."], ["Operational clarity", "Good shipment inquiries reduce confusion between sourcing, export, freight, customs, and delivery."]], process: ["Share cargo details", "Confirm route and urgency", "Review documents", "Coordinate shipment follow-up"], contact: "Include cargo type, dimensions or weight, origin, destination, transport preference, and deadline." },
    "currency-transfer": { overview: "The currency transfer page is for supplier payments, invoice settlement, business transfers, and international money movement connected to trade or service needs.", cards: [["Transfer purpose", "The reason for the transfer helps frame timing, supporting documents, and responsible follow-up."], ["Currency pair", "Visitors should identify sending and receiving currencies along with approximate amount and countries involved."], ["Timing needs", "Trade payments often depend on supplier deadlines, shipment milestones, invoice due dates, or contract stages."], ["Follow-up path", "The form collects enough information for a responsible conversation without publishing rates or unsupported promises."]], process: ["State transfer purpose", "Share amount and currency pair", "Review timing and documents", "Coordinate next step"], contact: "Mention amount, currency pair, countries involved, invoice or payment purpose, and target transfer date." },
    "foreign-exchange": { overview: "The foreign exchange page supports business clients who need a structured conversation around conversion needs, currency pair, timing, and trade context.", cards: [["FX requirement", "Visitors can explain whether the need is one-time, trade-related, invoice-related, or part of repeated business payments."], ["Currency context", "The page asks for currency pair, approximate value, timing, and country context rather than vague exchange questions."], ["Business connection", "FX requests may relate to import invoices, export proceeds, supplier payments, or service settlements."], ["Clear communication", "The page avoids unsupported promises and focuses on collecting the details needed for follow-up."]], process: ["Identify currency pair", "Share amount and timing", "Explain business purpose", "Request FX follow-up"], contact: "Include currency pair, approximate amount, country, timing, and business purpose." },
    contact: { overview: "The finance and trade contact page routes import, export, shipping, currency transfer, and foreign exchange inquiries to the correct operational conversation.", cards: [["Trade routing", "Messages can be classified as goods sourcing, supplier coordination, shipment, documentation, transfer, or FX."], ["Document context", "Trade and shipping messages should mention available paperwork, missing documents, cargo details, and route."], ["Payment context", "Currency and FX messages should include amount, currency pair, purpose, countries involved, and deadline."], ["Operational follow-up", "The team can respond more usefully when the request includes goods, route, documents, timing, and contact preference."]], process: ["Submit finance or trade inquiry", "Classify request type", "Review missing details", "Coordinate the correct workflow"], contact: "Include goods, route, documents, currency, amount, and timeline when relevant." },
    "trade-desk": { overview: "The trade desk page brings sourcing, shipping, documentation, supplier deadlines, payment timing, currency transfer, and FX questions into one coordination workflow.", cards: [["Single workflow", "Complex trade requests often combine goods, supplier communication, documents, shipping, and payment needs."], ["Coordination view", "The page helps visitors explain what has already been arranged and what still needs operational support."], ["Timing alignment", "Shipment dates, supplier deadlines, invoice due dates, and transfer timing can affect each other."], ["Cleaner handoff", "A structured request helps the team decide whether the next step is sourcing, logistics, payment, FX, or documentation."]], process: ["Describe the full trade case", "List goods, route, and documents", "Add payment timing", "Coordinate the desk response"], contact: "Send the full trade context, including supplier or buyer status, documents, route, amount, currency pair, and payment timing." },
  },
};

export function buildPageContent({ siteKey, pageId, pageLabel, pageTitle, pageText, detail, detailCards, detailProcess, lang = "en" }) {
  const siteVoice = {
    en: {
      holding: { noun: "group", audience: "directors, partners, regional clients, and visitors who need the right business unit", outcome: "a clear route through the REZAEI GLOBAL LLC group instead of a generic company introduction", record: "business area, country, timeline, decision owner, and preferred follow-up language" },
      residency: { noun: "case", audience: "individuals, investors, families, and companies preparing official documents or mobility requests", outcome: "a practical service path for documents, residency, visa, setup, attestation, or translation work", record: "document type, issuing country, destination country, deadline, and current status" },
      realEstate: { noun: "project", audience: "buyers, investors, owners, contractors, procurement teams, and development partners", outcome: "a better property, construction, materials, or quotation conversation with fewer missing details", record: "location, property or material type, quantity or size, budget range, and target date" },
      trade: { noun: "trade request", audience: "importers, exporters, suppliers, buyers, logistics coordinators, and business payment teams", outcome: "a coordinated route for goods, documents, shipment timing, payment needs, or currency exchange", record: "origin, destination, cargo or amount, currency pair, documents available, and required timing" },
    },
    tr: {
      holding: { noun: "grup", audience: "dogru is birimini arayan yoneticiler, ortaklar, bolgesel musteriler ve ziyaretciler", outcome: "genel bir sirket tanitimindan cok REZAEI GLOBAL LLC grubu icinde net bir yonlendirme", record: "is alani, ulke, zamanlama, karar sahibi ve tercih edilen takip dili" },
      residency: { noun: "dosya", audience: "resmi belge veya hareketlilik talebi hazirlayan bireyler, yatirimcilar, aileler ve sirketler", outcome: "belge, oturum, vize, kurulum, tasdik veya tercume icin pratik bir hizmet yolu", record: "belge turu, duzenleyen ulke, hedef ulke, son tarih ve mevcut durum" },
      realEstate: { noun: "proje", audience: "alicilar, yatirimcilar, mulk sahipleri, yukleniciler, satin alma ekipleri ve gelistirme ortaklari", outcome: "daha az eksik bilgiyle daha iyi emlak, insaat, malzeme veya teklif gorusmesi", record: "konum, emlak veya malzeme turu, miktar veya olcu, butce araligi ve hedef tarih" },
      trade: { noun: "ticaret talebi", audience: "ithalatcilar, ihracatcilar, tedarikciler, alicilar, lojistik ekipleri ve odeme ekipleri", outcome: "mallar, belgeler, sevkiyat zamanlamasi, odeme veya doviz ihtiyaci icin koordine bir yol", record: "cikis, varis, yuk veya tutar, doviz cifti, mevcut belgeler ve gerekli zamanlama" },
    },
    fa: {
      holding: { noun: "گروه", audience: "مدیران، شرکا، مشتریان منطقه ای و بازدیدکنندگانی که به دنبال واحد درست کسب و کار هستند", outcome: "مسیر روشن در گروه رضائی گلوبال م.م. به جای معرفی کلی شرکت", record: "حوزه کسب و کار، کشور، زمان بندی، تصمیم گیرنده و زبان ترجیحی پیگیری" },
      residency: { noun: "پرونده", audience: "افراد، سرمایه گذاران، خانواده ها و شرکت هایی که مدارک رسمی یا درخواست اقامت و جابه جایی آماده می کنند", outcome: "مسیر عملی برای مدارک، اقامت، ویزا، ثبت شرکت، تایید یا ترجمه", record: "نوع مدرک، کشور صادرکننده، کشور مقصد، مهلت و وضعیت فعلی" },
      realEstate: { noun: "پروژه", audience: "خریداران، سرمایه گذاران، مالکان، پیمانکاران، تیم های خرید و شرکای توسعه", outcome: "گفت وگوی بهتر درباره ملک، ساخت، مصالح یا قیمت با اطلاعات ناقص کمتر", record: "موقعیت، نوع ملک یا مصالح، مقدار یا اندازه، محدوده بودجه و تاریخ هدف" },
      trade: { noun: "درخواست تجاری", audience: "واردکنندگان، صادرکنندگان، تامین کنندگان، خریداران، هماهنگ کنندگان حمل و تیم های پرداخت", outcome: "مسیر هماهنگ برای کالا، مدارک، زمان حمل، پرداخت یا نیاز ارزی", record: "مبدا، مقصد، محموله یا مبلغ، جفت ارز، مدارک موجود و زمان مورد نیاز" },
    },
    ar: {
      holding: { noun: "المجموعة", audience: "المديرين والشركاء والعملاء الإقليميين والزوار الذين يحتاجون إلى وحدة العمل المناسبة", outcome: "مسار واضح داخل مجموعة رضائي العالمية ذ.م.م. بدلا من تعريف عام بالشركة", record: "مجال العمل والبلد والجدول الزمني وصاحب القرار ولغة المتابعة المفضلة" },
      residency: { noun: "الملف", audience: "الأفراد والمستثمرين والعائلات والشركات التي تجهز مستندات رسمية أو طلبات تنقل", outcome: "مسار عملي للمستندات أو الإقامة أو التأشيرة أو التأسيس أو التصديق أو الترجمة", record: "نوع المستند وبلد الإصدار وبلد الوجهة والموعد والحالة الحالية" },
      realEstate: { noun: "المشروع", audience: "المشترين والمستثمرين والمالكين والمقاولين وفرق المشتريات وشركاء التطوير", outcome: "محادثة أفضل حول العقار أو البناء أو المواد أو عروض الأسعار مع تفاصيل ناقصة أقل", record: "الموقع ونوع العقار أو المادة والكمية أو الحجم ونطاق الميزانية والتاريخ المستهدف" },
      trade: { noun: "طلب التجارة", audience: "المستوردين والمصدرين والموردين والمشترين ومنسقي الشحن وفرق الدفع", outcome: "مسار منسق للبضائع والمستندات وتوقيت الشحن واحتياجات الدفع أو الصرف", record: "المصدر والوجهة والشحنة أو المبلغ وزوج العملات والمستندات المتاحة والتوقيت المطلوب" },
    },
  };
  const voiceSet = siteVoice[lang] || siteVoice.en;
  const voice = voiceSet[siteKey] || voiceSet.holding;
  const contentText = {
    en: {
      who: (label) => `Who uses ${label}`,
      whoText: () => `This page is written for ${voice.audience}. It explains ${pageTitle.toLowerCase()} in plain business terms and helps visitors understand whether this is the correct place to start.`,
      decide: "What the page should decide",
      decideText: () => `The goal is ${voice.outcome}. Visitors should leave with enough confidence to send a focused inquiry instead of a broad message that needs several rounds of clarification.`,
      include: "What to include in the first message",
      includeText: () => `For this ${voice.noun}, the most useful first message includes ${voice.record}. ${detail.contact}`,
      deliverableText: (cardText) => `${cardText} The page turns this into a concrete discussion point so the team can classify the request quickly.`,
      meta: ["Scope", "Details", "Routing", "Follow-up"],
      scenario: (title) => `${title} request`,
      scenarioText: (title) => `Use this page when the main question is about ${title.toLowerCase()}. Add the current situation, target outcome, and timing.`,
      plan: (title) => `${title} planning`,
      planText: (title) => `This scenario helps visitors prepare details before the team reviews ${title.toLowerCase()}.`,
      coord: (title) => `${title} coordination`,
      coordText: (title) => `This page keeps ${title.toLowerCase()} connected to the wider process.`,
      follow: (title) => `${title} follow-up`,
      followText: () => `When the request is ready to move forward, the follow-up path is: ${pathText}.`,
      checklist: [`Confirm the exact purpose of the ${voice.noun}.`, "Write the destination, country, market, or location clearly.", "Add quantities, document names, budget, amount, or timeline where relevant.", "Mention the preferred language and best contact method for follow-up."],
      q1: () => `Is ${pageTitle} the right page for my request?`,
      a1: () => `Yes, if your request matches this page. If it crosses into another business area, the inquiry can still be routed from here.`,
      q2: "What happens after I send the form?",
      a2: () => `The request is reviewed, classified, and followed up according to this path: ${pathText}.`,
      q3: "Can I send a short message first?",
      a3: "Yes. A concise message is fine as long as it includes the main purpose, timing, and enough context for the team to understand the request.",
    },
    tr: {
      who: (label) => `${label} kimler icin?`, whoText: () => `Bu sayfa ${voice.audience} icin hazirlandi. ${pageTitle} konusunu sade is diliyle anlatir ve ziyaretcinin dogru yerden baslayip baslamadigini anlamasina yardim eder.`,
      decide: "Sayfa neyi netlestirmeli?", decideText: () => `Amac ${voice.outcome}. Ziyaretci, cok tur aciklama gerektiren genis bir mesaj yerine odakli bir talep gonderebilmelidir.`,
      include: "Ilk mesaja ne eklenmeli?", includeText: () => `Bu ${voice.noun} icin en yararli ilk mesaj ${voice.record} bilgilerini icermelidir. ${detail.contact}`,
      deliverableText: (cardText) => `${cardText} Bu baslik, ekibin talebi hizli siniflandirmasi icin somut bir gorusme noktasina donusur.`, meta: ["Kapsam", "Detaylar", "Yonlendirme", "Takip"],
      scenario: (title) => `${title} talebi`, scenarioText: (title) => `Ana soru ${title.toLowerCase()} hakkindaysa bu sayfa kullanilir. Mevcut durum, hedef sonuc ve zamanlama eklenmelidir.`,
      plan: (title) => `${title} planlama`, planText: (title) => `Bu durum, ekip ${title.toLowerCase()} konusunu incelemeden once bilgileri hazirlamaya yardim eder.`,
      coord: (title) => `${title} koordinasyonu`, coordText: (title) => `Bu sayfa ${title.toLowerCase()} konusunu daha genis surece bagli tutar.`,
      follow: (title) => `${title} takibi`, followText: () => `Talep ilerlemeye hazir oldugunda takip yolu: ${pathText}.`,
      checklist: [`${voice.noun} icin tam amaci netlestirin.`, "Hedefi, ulkeyi, pazari veya konumu acik yazin.", "Gerekiyorsa miktar, belge adi, butce, tutar veya zamanlama ekleyin.", "Tercih edilen dili ve en iyi iletisim yontemini belirtin."],
      q1: () => `${pageTitle} talebim icin dogru sayfa mi?`, a1: () => "Evet, talebiniz bu sayfayla uyusuyorsa. Baska bir is alanina girerse talep buradan yine yonlendirilebilir.", q2: "Formu gonderdikten sonra ne olur?", a2: () => `Talep incelenir, siniflandirilir ve su yola gore takip edilir: ${pathText}.`, q3: "Once kisa bir mesaj gonderebilir miyim?", a3: "Evet. Ana amac, zamanlama ve yeterli baglam oldugu surece kisa bir mesaj yeterlidir.",
    },
    fa: {
      who: (label) => `چه کسانی از ${label} استفاده می کنند؟`, whoText: () => `این صفحه برای ${voice.audience} نوشته شده است. موضوع ${pageTitle} را با زبان ساده تجاری توضیح می دهد و کمک می کند بازدیدکننده بداند از جای درست شروع کرده است یا نه.`,
      decide: "این صفحه چه چیزی را باید روشن کند؟", decideText: () => `هدف، ${voice.outcome} است. بازدیدکننده باید بتواند به جای پیام کلی، یک درخواست دقیق و قابل پیگیری ارسال کند.`,
      include: "در پیام اول چه چیزهایی نوشته شود؟", includeText: () => `برای این ${voice.noun}، پیام اول بهتر است شامل ${voice.record} باشد. ${detail.contact}`,
      deliverableText: (cardText) => `${cardText} این بخش به یک نقطه گفت وگوی مشخص تبدیل می شود تا تیم بتواند درخواست را سریع دسته بندی کند.`, meta: ["دامنه", "جزئیات", "هدایت", "پیگیری"],
      scenario: (title) => `درخواست ${title}`, scenarioText: (title) => `وقتی سوال اصلی درباره ${title} است از این صفحه استفاده کنید. وضعیت فعلی، نتیجه مورد نظر و زمان بندی را اضافه کنید.`,
      plan: (title) => `برنامه ریزی ${title}`, planText: (title) => `این حالت کمک می کند قبل از بررسی تیم، جزئیات مربوط به ${title} آماده شود.`,
      coord: (title) => `هماهنگی ${title}`, coordText: (title) => `این صفحه ${title} را به فرآیند کلی متصل نگه می دارد.`,
      follow: (title) => `پیگیری ${title}`, followText: () => `وقتی درخواست آماده ادامه باشد، مسیر پیگیری این است: ${pathText}.`,
      checklist: [`هدف دقیق ${voice.noun} را مشخص کنید.`, "مقصد، کشور، بازار یا موقعیت را روشن بنویسید.", "در صورت نیاز مقدار، نام مدارک، بودجه، مبلغ یا زمان بندی را اضافه کنید.", "زبان ترجیحی و بهترین روش تماس برای پیگیری را ذکر کنید."],
      q1: () => `آیا ${pageTitle} صفحه درست برای درخواست من است؟`, a1: () => "بله، اگر درخواست شما با این صفحه مرتبط باشد. اگر به حوزه دیگری مربوط شود، درخواست همچنان از اینجا هدایت می شود.", q2: "بعد از ارسال فرم چه اتفاقی می افتد؟", a2: () => `درخواست بررسی، دسته بندی و طبق این مسیر پیگیری می شود: ${pathText}.`, q3: "آیا می توانم اول یک پیام کوتاه بفرستم؟", a3: "بله. اگر هدف اصلی، زمان بندی و زمینه کافی را توضیح دهد، پیام کوتاه هم مناسب است.",
    },
    ar: {
      who: (label) => `من يستخدم ${label}؟`, whoText: () => `هذه الصفحة مخصصة لـ ${voice.audience}. تشرح ${pageTitle} بلغة أعمال واضحة وتساعد الزائر على معرفة ما إذا كان هذا هو المكان الصحيح للبدء.`,
      decide: "ما الذي يجب أن توضحه الصفحة؟", decideText: () => `الهدف هو ${voice.outcome}. يجب أن يستطيع الزائر إرسال استفسار مركز بدلا من رسالة عامة تحتاج إلى توضيحات كثيرة.`,
      include: "ماذا يضاف في الرسالة الأولى؟", includeText: () => `لهذا ${voice.noun}، من الأفضل أن تتضمن الرسالة الأولى ${voice.record}. ${detail.contact}`,
      deliverableText: (cardText) => `${cardText} يتحول هذا الجزء إلى نقطة نقاش واضحة حتى يتمكن الفريق من تصنيف الطلب بسرعة.`, meta: ["النطاق", "التفاصيل", "التوجيه", "المتابعة"],
      scenario: (title) => `طلب ${title}`, scenarioText: (title) => `استخدم هذه الصفحة عندما يكون السؤال الرئيسي حول ${title}. أضف الوضع الحالي والنتيجة المطلوبة والتوقيت.`,
      plan: (title) => `تخطيط ${title}`, planText: (title) => `تساعد هذه الحالة الزائر على تجهيز التفاصيل قبل مراجعة الفريق لموضوع ${title}.`,
      coord: (title) => `تنسيق ${title}`, coordText: (title) => `تحافظ هذه الصفحة على ارتباط ${title} بالمسار الأوسع.`,
      follow: (title) => `متابعة ${title}`, followText: () => `عندما يصبح الطلب جاهزا للمتابعة، يكون المسار: ${pathText}.`,
      checklist: [`أكد الغرض الدقيق من ${voice.noun}.`, "اكتب الوجهة أو البلد أو السوق أو الموقع بوضوح.", "أضف الكميات أو أسماء المستندات أو الميزانية أو المبلغ أو التوقيت عند الحاجة.", "اذكر اللغة المفضلة وأفضل وسيلة تواصل للمتابعة."],
      q1: () => `هل ${pageTitle} هي الصفحة المناسبة لطلبي؟`, a1: () => "نعم، إذا كان طلبك مطابقا لهذه الصفحة. وإذا كان مرتبطا بمجال آخر فيمكن توجيهه من هنا.", q2: "ماذا يحدث بعد إرسال النموذج؟", a2: () => `تتم مراجعة الطلب وتصنيفه ومتابعته حسب هذا المسار: ${pathText}.`, q3: "هل يمكنني إرسال رسالة قصيرة أولا؟", a3: "نعم. تكفي رسالة مختصرة إذا تضمنت الغرض الرئيسي والتوقيت والسياق الكافي لفهم الطلب.",
    },
  };
  const text = contentText[lang] || contentText.en;
  const primaryCards = detailCards.length ? detailCards : [[pageTitle, pageText]];
  const firstCard = primaryCards[0] || [pageTitle, pageText];
  const secondCard = primaryCards[1] || firstCard;
  const thirdCard = primaryCards[2] || secondCard;
  const fourthCard = primaryCards[3] || thirdCard;
  const pathText = detailProcess.join(" -> ");

  return {
    narrative: [
      { title: text.who(pageLabel), text: text.whoText() },
      { title: text.decide, text: text.decideText() },
      { title: text.include, text: text.includeText() },
    ],
    deliverables: primaryCards.map(([cardTitle, cardText], index) => ({
      title: cardTitle,
      text: text.deliverableText(cardText),
      meta: text.meta[index % 4],
    })),
    scenarios: [
      { title: text.scenario(firstCard[0]), text: text.scenarioText(firstCard[0]) },
      { title: text.plan(secondCard[0]), text: text.planText(secondCard[0]) },
      { title: text.coord(thirdCard[0]), text: text.coordText(thirdCard[0]) },
      { title: text.follow(fourthCard[0]), text: text.followText() },
    ],
    checklist: text.checklist,
    questions: [
      { title: text.q1(), text: text.a1() },
      { title: text.q2, text: text.a2() },
      { title: text.q3, text: text.a3 },
    ],
  };
}

export function getLayoutVariant(siteKey, pageId) {
  if (["faq", "privacy", "terms"].includes(pageId)) return "support";
  if (["home", "about", "leadership", "governance"].includes(pageId)) return "editorial";
  if (["properties", "projects", "materials", "market-insights"].includes(pageId)) return "showcase";
  if (["import-export", "shipping", "currency-transfer", "foreign-exchange", "trade-desk"].includes(pageId)) return "operations";
  if (["corporate-setup", "residency-visa", "legalization", "translation", "case-review"].includes(pageId)) return "casework";
  if (pageId === "contact") return "contactFirst";
  return siteKey === "holding" ? "editorial" : "showcase";
}

export function buildSignatureContent({ layoutVariant, pageTitle, detailCards, detailProcess, contentDepth, lang = "en" }) {
  const cards = detailCards.length ? detailCards : contentDepth.deliverables.map((item) => [item.title, item.text]);
  const fallback = {
    en: "Focused request handling",
    tr: "Odakli talep yonetimi",
    fa: "مدیریت دقیق درخواست",
    ar: "معالجة مركزة للطلب",
  }[lang] || "Focused request handling";
  const first = cards[0] || [pageTitle, fallback];
  const second = cards[1] || first;
  const third = cards[2] || second;
  const fourth = cards[3] || third;
  const t = {
    en: { operating: "Operating model", view: "operating view", intro: "This view turns the page into a clear model of responsibilities, standards, and follow-up.", m1: "Brand clarity", m2: "Service routing", m3: "Follow-up standard", l1: "Position", l2: "Govern", l3: "Route", l4: "Improve", stage: "Stage" },
    tr: { operating: "Operasyon modeli", view: "operasyon gorunumu", intro: "Bu gorunum sayfayi sorumluluklar, standartlar ve takip icin net bir modele donusturur.", m1: "Marka netligi", m2: "Hizmet yonlendirme", m3: "Takip standardi", l1: "Konumlandir", l2: "Yonet", l3: "Yonlendir", l4: "Iyilestir", stage: "Asama" },
    fa: { operating: "مدل عملیاتی", view: "نمای عملیاتی", intro: "این بخش صفحه را به مدل روشنی از مسئولیت ها، استانداردها و پیگیری تبدیل می کند.", m1: "شفافیت برند", m2: "هدایت خدمات", m3: "استاندارد پیگیری", l1: "جایگاه", l2: "مدیریت", l3: "هدایت", l4: "بهبود", stage: "مرحله" },
    ar: { operating: "نموذج التشغيل", view: "عرض التشغيل", intro: "يحول هذا العرض الصفحة إلى نموذج واضح للمسؤوليات والمعايير والمتابعة.", m1: "وضوح العلامة", m2: "توجيه الخدمة", m3: "معيار المتابعة", l1: "التموضع", l2: "الإدارة", l3: "التوجيه", l4: "التحسين", stage: "مرحلة" },
  }[lang] || {
    operating: "Operating model", view: "operating view", intro: "This view turns the page into a clear model of responsibilities, standards, and follow-up.", m1: "Brand clarity", m2: "Service routing", m3: "Follow-up standard", l1: "Position", l2: "Govern", l3: "Route", l4: "Improve", stage: "Stage",
  };
  const signature = {
    eyebrow: t.operating,
    title: `${pageTitle} ${t.view}`,
    intro: t.intro,
    metrics: [["01", first[0]], ["02", second[0]], ["03", third[0]]],
    lanes: [[first[0], first[1]], [second[0], second[1]], [third[0], third[1]], [fourth[0], fourth[1]]],
  };
  return { ...signature, steps: detailProcess.map((step, index) => ({ title: `${t.stage} ${index + 1}`, text: step })) };
}
