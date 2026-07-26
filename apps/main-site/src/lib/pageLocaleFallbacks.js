/** Locale-aware fallbacks when CMS fields are missing (offline or partial content). */

export function pickCms(cms, fallback) {
  if (cms && (Array.isArray(cms) ? cms.length : String(cms).trim())) return cms;
  return fallback;
}

export const aboutPageUi = {
  en: { heroEyebrow: "Company Profile", overviewEyebrow: "Company Overview", structureLabel: "Holding Structure" },
  tr: { heroEyebrow: "Şirket Profili", overviewEyebrow: "Şirket Özeti", structureLabel: "Holding Yapısı" },
  fa: { heroEyebrow: "پروفایل شرکت", overviewEyebrow: "بررسی اجمالی شرکت", structureLabel: "ساختار هولدینگ" },
  ar: { heroEyebrow: "ملف الشركة", overviewEyebrow: "نظرة عامة على الشركة", structureLabel: "هيكل القابضة" },
};

export function buildAboutPageFallback(aboutPageCopy, lang, groupHrefs) {
  const copy = aboutPageCopy[lang] || aboutPageCopy.en;
  const ui = aboutPageUi[lang] || aboutPageUi.en;
  return {
    heroEyebrow: ui.heroEyebrow,
    heroTitle: copy.heroTitle,
    heroLead: copy.heroSub,
    heroBody: copy.heroTrust,
    overviewEyebrow: ui.overviewEyebrow,
    overviewTitle: copy.identityTitle,
    overviewText: copy.identityText,
    overviewPoints: copy.identityCards.map((card) => card.label),
    businessesEyebrow: copy.groupEyebrow,
    businessesTitle: copy.groupTitle,
    groupUnits: copy.groupUnits.map((unit, index) => ({
      title: unit.title,
      text: unit.text,
      href: groupHrefs[index] || "#",
    })),
    processEyebrow: copy.processEyebrow,
    processTitle: copy.processTitle,
    processSummary: copy.groupSub,
    processSteps: copy.processSteps,
    structureLabel: ui.structureLabel,
    visitWebsite: copy.groupCta,
    ctaEyebrow: copy.ctaEyebrow,
    ctaTitle: copy.ctaTitle,
    ctaButton: copy.ctaCorporate,
  };
}

export const supportHeroCopy = {
  faq: {
    en: { eyebrow: "FAQ", title: "Frequently asked questions.", lead: "Short answers about request routing, business units, documents, and follow-up with REZAEI GLOBAL LLC." },
    tr: { eyebrow: "SSS", title: "Sık sorulan sorular.", lead: "REZAEI GLOBAL LLC ile talep yönlendirme, iş birimleri, belgeler ve takip hakkında kısa yanıtlar." },
    fa: { eyebrow: "سوالات متداول", title: "پرسش‌های پرتکرار.", lead: "پاسخ‌های کوتاه درباره مسیریابی درخواست، واحدهای تجاری، مدارک و پیگیری با REZAEI GLOBAL LLC." },
    ar: { eyebrow: "الأسئلة الشائعة", title: "أسئلة شائعة.", lead: "إجابات مختصرة حول توجيه الطلبات ووحدات الأعمال والمستندات والمتابعة مع REZAEI GLOBAL LLC." },
  },
  privacy: {
    en: { eyebrow: "Privacy", title: "Privacy and data handling.", lead: "A simple explanation of how REZAEI GLOBAL LLC handles inquiry details sent through this website.", noteTitle: "Important note", noteText: "This page is provided for general website transparency. For a specific legal, contractual, or regulatory question, contact the company directly before submitting sensitive information." },
    tr: { eyebrow: "Gizlilik", title: "Gizlilik ve veri yönetimi.", lead: "REZAEI GLOBAL LLC'nin bu web sitesi üzerinden gönderilen talep bilgilerini nasıl yönettiğine dair basit bir açıklama.", noteTitle: "Önemli not", noteText: "Bu sayfa genel web sitesi şeffaflığı içindir. Belirli bir hukuki veya düzenleyici soru için hassas bilgi göndermeden önce doğrudan şirketle iletişime geçin." },
    fa: { eyebrow: "حریم خصوصی", title: "حریم خصوصی و مدیریت داده.", lead: "توضیح ساده درباره نحوه مدیریت جزئیات درخواست‌های ارسالی از طریق این وب‌سایت توسط REZAEI GLOBAL LLC.", noteTitle: "نکته مهم", noteText: "این صفحه برای شفافیت عمومی وب‌سایت ارائه شده است. برای سوالات حقوقی یا قراردادی خاص، قبل از ارسال اطلاعات حساس مستقیماً با شرکت تماس بگیرید." },
    ar: { eyebrow: "الخصوصية", title: "الخصوصية ومعالجة البيانات.", lead: "شرح بسيط لكيفية تعامل REZAEI GLOBAL LLC مع تفاصيل الاستفسارات المرسلة عبر هذا الموقع.", noteTitle: "ملاحظة مهمة", noteText: "تُقدَّم هذه الصفحة لشفافية الموقع العامة. لأي سؤال قانوني أو تعاقدي محدد، تواصل مع الشركة مباشرةً قبل إرسال معلومات حساسة." },
  },
  terms: {
    en: { eyebrow: "Terms", title: "Terms of website use.", lead: "Clear expectations for using this website, reading service information, and submitting inquiries to REZAEI GLOBAL LLC.", noteTitle: "Practical note", noteText: "If your request depends on deadlines, documents, market conditions, or official requirements, wait for direct confirmation from the relevant team before making decisions." },
    tr: { eyebrow: "Şartlar", title: "Web sitesi kullanım şartları.", lead: "Bu web sitesini kullanma, hizmet bilgilerini okuma ve REZAEI GLOBAL LLC'ye talep gönderme konusunda net beklentiler.", noteTitle: "Pratik not", noteText: "Talebiniz son tarihlere, belgelere, piyasa koşullarına veya resmi gerekliliklere bağlıysa, karar vermeden önce ilgili ekipten doğrudan onay bekleyin." },
    fa: { eyebrow: "شرایط", title: "شرایط استفاده از وب‌سایت.", lead: "انتظارات روشن برای استفاده از این وب‌سایت، خواندن اطلاعات خدمات و ارسال درخواست به REZAEI GLOBAL LLC.", noteTitle: "نکته عملی", noteText: "اگر درخواست شما به مهلت‌ها، مدارک، شرایط بازار یا الزامات رسمی بستگی دارد، قبل از تصمیم‌گیری تأیید مستقیم از تیم مربوط را دریافت کنید." },
    ar: { eyebrow: "الشروط", title: "شروط استخدام الموقع.", lead: "توقعات واضحة لاستخدام هذا الموقع وقراءة معلومات الخدمة وإرسال الاستفسارات إلى REZAEI GLOBAL LLC.", noteTitle: "ملاحظة عملية", noteText: "إذا كان طلبك يعتمد على مواعيد نهائية أو مستندات أو ظروف السوق أو متطلبات رسمية، انتظر تأكيداً مباشراً من الفريق المعني قبل اتخاذ القرارات." },
  },
  team: {
    en: { eyebrow: "Team", title: "Meet the leadership group behind REZAEI GLOBAL LLC.", lead: "REZAEI GLOBAL LLC is led by a compact leadership group that keeps group-level communication clear and connects clients to the right specialist desk.", rosterEyebrow: "Leadership Team", ctaEyebrow: "Contact", ctaButton: "Contact the group" },
    tr: { eyebrow: "Ekip", title: "REZAEI GLOBAL LLC'nin arkasındaki liderlik grubuyla tanışın.", lead: "REZAEI GLOBAL LLC, grup düzeyinde iletişimi net tutan ve müşterileri doğru uzman masaya bağlayan kompakt bir liderlik grubu tarafından yönetilir.", rosterEyebrow: "Liderlik Ekibi", ctaEyebrow: "İletişim", ctaButton: "Grupla iletişime geçin" },
    fa: { eyebrow: "تیم", title: "با گروه رهبری پشت REZAEI GLOBAL LLC آشنا شوید.", lead: "REZAEI GLOBAL LLC توسط گروه رهبری فشرده‌ای اداره می‌شود که ارتباطات سطح گروه را روشن نگه می‌دارد و مشتریان را به میز تخصصی درست متصل می‌کند.", rosterEyebrow: "تیم رهبری", ctaEyebrow: "تماس", ctaButton: "تماس با گروه" },
    ar: { eyebrow: "الفريق", title: "تعرف على فريق القيادة خلف REZAEI GLOBAL LLC.", lead: "تقود REZAEI GLOBAL LLC مجموعة قيادة مدمجة تحافظ على وضوح التواصل على مستوى المجموعة وتوصل العملاء إلى المكتب المتخصص المناسب.", rosterEyebrow: "فريق القيادة", ctaEyebrow: "التواصل", ctaButton: "التواصل مع المجموعة" },
  },
  contact: {
    en: {
      heroEyebrow: "Contact REZAEI GLOBAL LLC",
      heroTitle: "The easiest way to reach the right team.",
      heroLead: "Send one clear message for corporate inquiries, partnership introductions, real estate, trade, residency, documents, or any request that needs the right business unit.",
      helpTitle: "Contact Routes",
      signalHeading: "One group entry. Three practical ways in.",
      formTitle: "Message the group",
      formHeading: "Tell us what you need.",
      prepEyebrow: "Helpful Context",
      prepTitle: "What to include",
      prepItems: ["Business area or service category", "Country, timeline, and preferred language", "Decision owner and best follow-up route"],
      helpItems: [
        { title: "Send a message", text: "Best for new inquiries, partnerships, documents, property, trade, and multi-unit requests." },
        { title: "Email the group", text: "Use email when you already have files, context, or a written introduction to share." },
        { title: "Call or WhatsApp", text: "Use phone contact when timing is urgent or you need a quick first direction." },
      ],
      sendInquiry: "Send Inquiry",
    },
    tr: {
      heroEyebrow: "REZAEI GLOBAL LLC ile İletişim",
      heroTitle: "Doğru ekibe ulaşmanın en kolay yolu.",
      heroLead: "Kurumsal talepler, ortaklık tanıtımları, emlak, ticaret, oturum, belgeler veya doğru iş birimini gerektiren her talep için tek net mesaj gönderin.",
      helpTitle: "İletişim Yolları",
      signalHeading: "Tek grup girişi. Üç pratik yol.",
      formTitle: "Gruba mesaj gönderin",
      formHeading: "Ne ihtiyacınız olduğunu anlatın.",
      prepEyebrow: "Faydalı Bağlam",
      prepTitle: "Neleri eklemelisiniz",
      prepItems: ["İş alanı veya hizmet kategorisi", "Ülke, zamanlama ve tercih edilen dil", "Karar sahibi ve en iyi takip yolu"],
      helpItems: [
        { title: "Mesaj gönderin", text: "Yeni talepler, ortaklıklar, belgeler, emlak, ticaret ve çok birimli istekler için en uygun yol." },
        { title: "Gruba e-posta", text: "Dosya, bağlam veya yazılı tanıtımınız varsa e-posta kullanın." },
        { title: "Ara veya WhatsApp", text: "Zamanlama acilse veya hızlı ilk yön gerekiyorsa telefon kullanın." },
      ],
      sendInquiry: "Talep Gönder",
    },
    fa: {
      heroEyebrow: "تماس با REZAEI GLOBAL LLC",
      heroTitle: "ساده‌ترین راه برای رسیدن به تیم درست.",
      heroLead: "یک پیام روشن برای درخواست‌های شرکتی، معرفی مشارکت، املاک، تجارت، اقامت، مدارک یا هر درخواستی که به واحد تجاری درست نیاز دارد ارسال کنید.",
      helpTitle: "مسیرهای تماس",
      signalHeading: "یک ورودی گروه. سه راه عملی.",
      formTitle: "پیام به گروه",
      formHeading: "نیاز خود را بگویید.",
      prepEyebrow: "زمینه مفید",
      prepTitle: "چه چیزهایی را بنویسید",
      prepItems: ["حوزه کسب‌وکار یا دسته خدمات", "کشور، زمان‌بندی و زبان ترجیحی", "مسئول تصمیم و بهترین مسیر پیگیری"],
      helpItems: [
        { title: "ارسال پیام", text: "مناسب برای درخواست‌های جدید، مشارکت، مدارک، املاک، تجارت و درخواست‌های چند واحدی." },
        { title: "ایمیل به گروه", text: "وقتی فایل، زمینه یا معرفی کتبی دارید از ایمیل استفاده کنید." },
        { title: "تماس یا واتساپ", text: "وقتی زمان‌بندی فوری است یا به جهت‌گیری سریع اول نیاز دارید از تلفن استفاده کنید." },
      ],
      sendInquiry: "ارسال درخواست",
    },
    ar: {
      heroEyebrow: "التواصل مع REZAEI GLOBAL LLC",
      heroTitle: "أسهل طريقة للوصول إلى الفريق المناسب.",
      heroLead: "أرسل رسالة واحدة واضحة للاستفسارات المؤسسية أو تقديمات الشراكة أو العقارات أو التجارة أو الإقامة أو المستندات أو أي طلب يحتاج إلى وحدة الأعمال المناسبة.",
      helpTitle: "مسارات التواصل",
      signalHeading: "مدخل واحد للمجموعة. ثلاث طرق عملية.",
      formTitle: "راسل المجموعة",
      formHeading: "أخبرنا بما تحتاج.",
      prepEyebrow: "سياق مفيد",
      prepTitle: "ما يجب تضمينه",
      prepItems: ["مجال العمل أو فئة الخدمة", "البلد والجدول الزمني واللغة المفضلة", "صاحب القرار وأفضل مسار للمتابعة"],
      helpItems: [
        { title: "أرسل رسالة", text: "الأفضل للاستفسارات الجديدة والشراكات والمستندات والعقارات والتجارة والطلبات متعددة الوحدات." },
        { title: "راسل المجموعة بالبريد", text: "استخدم البريد الإلكتروني عندما تكون لديك ملفات أو سياق أو مقدمة مكتوبة." },
        { title: "اتصل أو واتساب", text: "استخدم الهاتف عندما يكون التوقيت عاجلاً أو تحتاج إلى توجيه أولي سريع." },
      ],
      sendInquiry: "إرسال استفسار",
    },
  },
};

export const homeSectionDefaults = {
  en: {
    companyEyebrow: "Company",
    companyTitle: "Built to route every request clearly.",
    companyIntro: "REZAEI GLOBAL LLC is the central identity behind specialist platforms for property, trade, finance, residency, visa, and official document work.",
    featureLabels: ["Corporate layer", "Routing system", "Operating standard"],
    defaultCompanyCards: [
      ["Clear group identity", "A single parent brand connects the group and keeps every service path understandable."],
      ["Less confusion for clients", "Requests are sorted by business area, country, urgency, and the team best placed to respond."],
      ["Consistent communication", "Brand standards, partner conversations, and cross-unit messages stay aligned."],
    ],
    businessUnitsEyebrow: "Business Units",
    businessUnitsTitle: "our service area",
    groupStructureEyebrow: "Group Structure",
    groupStructureTitle: "How the group is structured",
    panelTitle: "Request routing",
    panelSubtitle: "Choose the path. We route the request.",
    proofItems: ["3 service paths", "Regional coordination", "Focused follow-up"],
    howWeWorkEyebrow: "How We Work",
    howWeWorkTitle: "A simple path from group-level inquiry to specialist delivery.",
    processSteps: [
      ["Request Intake", "The visitor sends a general inquiry or chooses a service area, with basic context such as country, timeline, and request type."],
      ["Internal Review", "The holding team checks which platform should own the conversation and whether documents, project details, or payment context are needed."],
      ["Specialist Routing", "The inquiry is passed to the right operating team: real estate, finance and trade, or residency, visa, and translation services."],
      ["Focused Follow-up", "The specialist team continues with clear next steps, required information, and a practical route toward service delivery."],
    ],
    viewCtaPrefix: "View",
    governanceEyebrow: "Governance",
    governanceTitle: "Responsible coordination now, future-ready structure later.",
  },
  tr: {
    companyEyebrow: "Şirket",
    companyTitle: "Her talebi net yönlendirmek için kuruldu.",
    companyIntro: "REZAEI GLOBAL LLC; emlak, ticaret, finans, oturum, vize ve resmi belge işleri için uzman platformların merkezi kimliğidir.",
    featureLabels: ["Kurumsal katman", "Yönlendirme sistemi", "Operasyon standardı"],
    defaultCompanyCards: [
      ["Net grup kimliği", "Tek ana marka grubu birleştirir ve her hizmet yolunu anlaşılır tutar."],
      ["Müşteriler için daha az karmaşa", "Talepler iş alanı, ülke, aciliyet ve en uygun ekibe göre ayrılır."],
      ["Tutarlı iletişim", "Marka standartları, ortak görüşmeleri ve birimler arası mesajlar uyumlu kalır."],
    ],
    businessUnitsEyebrow: "İş Birimleri",
    businessUnitsTitle: "hizmet alanımız",
    groupStructureEyebrow: "Grup Yapısı",
    groupStructureTitle: "Grup nasıl yapılandırılmış",
    panelTitle: "Talep yönlendirme",
    panelSubtitle: "Yolu seçin. Talebi yönlendiririz.",
    proofItems: ["3 hizmet yolu", "Bölgesel koordinasyon", "Odaklı takip"],
    howWeWorkEyebrow: "Nasıl Çalışıyoruz",
    howWeWorkTitle: "Grup düzeyindeki talepten uzman teslimatına giden basit bir yol.",
    processSteps: [
      ["Talep Alımı", "Ziyaretçi genel bir talep gönderir veya ülke, zamanlama ve talep türü gibi temel bağlamla bir hizmet alanı seçer."],
      ["İç İnceleme", "Holding ekibi hangi platformun görüşmeye sahip olması gerektiğini ve belge, proje detayı veya ödeme bağlamının gerekli olup olmadığını kontrol eder."],
      ["Uzman Yönlendirme", "Talep doğru operasyon ekibine aktarılır: gayrimenkul, finans ve ticaret veya oturum, vize ve tercüme hizmetleri."],
      ["Odaklı Takip", "Uzman ekip net sonraki adımlar, gerekli bilgiler ve hizmet sunumuna giden pratik bir rota ile devam eder."],
    ],
    viewCtaPrefix: "İncele",
    governanceEyebrow: "Yönetişim",
    governanceTitle: "Şimdi sorumlu koordinasyon, geleceğe hazır yapı.",
  },
  fa: {
    companyEyebrow: "شرکت",
    companyTitle: "برای مسیریابی روشن هر درخواست ساخته شده است.",
    companyIntro: "REZAEI GLOBAL LLC هویت مرکزی پشت پلتفرم‌های تخصصی املاک، تجارت، مالی، اقامت، ویزا و امور رسمی مدارک است.",
    featureLabels: ["لایه شرکتی", "سامانه مسیریابی", "استاندارد عملیاتی"],
    defaultCompanyCards: [
      ["هویت گروه روشن", "یک برند مادر گروه را متصل می‌کند و هر مسیر خدماتی را قابل فهم نگه می‌دارد."],
      ["ابهام کمتر برای مشتری", "درخواست‌ها بر اساس حوزه کسب‌وکار، کشور، فوریت و تیم مناسب مرتب می‌شوند."],
      ["ارتباط یکپارچه", "استانداردهای برند، گفت‌وگوهای شراکتی و پیام‌های بین واحدی همسو می‌مانند."],
    ],
    businessUnitsEyebrow: "واحدهای تجاری",
    businessUnitsTitle: "حوزه خدمات ما",
    groupStructureEyebrow: "ساختار گروه",
    groupStructureTitle: "چگونه گروه ساختار یافته است",
    panelTitle: "مسیریابی درخواست",
    panelSubtitle: "مسیر را انتخاب کنید. ما درخواست را هدایت می‌کنیم.",
    proofItems: ["۳ مسیر خدمات", "هماهنگی منطقه‌ای", "پیگیری متمرکز"],
    howWeWorkEyebrow: "نحوه کار ما",
    howWeWorkTitle: "مسیر ساده از درخواست سطح گروه تا تحویل تخصصی.",
    processSteps: [
      ["دریافت درخواست", "بازدیدکننده یک درخواست کلی ارسال می‌کند یا حوزه خدمات را با زمینه اولیه مانند کشور، زمان‌بندی و نوع درخواست انتخاب می‌کند."],
      ["بررسی داخلی", "تیم هلدینگ بررسی می‌کند کدام پلتفرم باید مالک گفتگو باشد و آیا به مدارک، جزئیات پروژه یا زمینه پرداخت نیاز است."],
      ["مسیریابی تخصصی", "درخواست به تیم عملیاتی درست منتقل می‌شود: املاک، مالی و تجارت، یا اقامت، ویزا و ترجمه."],
      ["پیگیری متمرکز", "تیم متخصص با گام‌های بعدی روشن، اطلاعات لازم و مسیر عملی به سمت ارائه خدمت ادامه می‌دهد."],
    ],
    viewCtaPrefix: "مشاهده",
    governanceEyebrow: "حاکمیت",
    governanceTitle: "هماهنگی مسئولانه اکنون، ساختار آماده آینده.",
  },
  ar: {
    companyEyebrow: "الشركة",
    companyTitle: "مبنية لتوجيه كل طلب بوضوح.",
    companyIntro: "REZAEI GLOBAL LLC هي الهوية المركزية خلف المنصات المتخصصة للعقارات والتجارة والتمويل والإقامة والتأشيرة والعمل الرسمي للمستندات.",
    featureLabels: ["الطبقة المؤسسية", "نظام التوجيه", "معيار التشغيل"],
    defaultCompanyCards: [
      ["هوية مجموعة واضحة", "علامة أم واحدة تربط المجموعة وتبقي كل مسار خدمة مفهوماً."],
      ["أقل ارتباكاً للعملاء", "تُفرز الطلبات حسب مجال العمل والبلد والإلحاح والفريق الأنسب للرد."],
      ["تواصل متسق", "تبقى معايير العلامة ومحادثات الشركاء والرسائل بين الوحدات متوافقة."],
    ],
    businessUnitsEyebrow: "وحدات الأعمال",
    businessUnitsTitle: "مجال خدماتنا",
    groupStructureEyebrow: "هيكل المجموعة",
    groupStructureTitle: "كيف تُهيكل المجموعة",
    panelTitle: "توجيه الطلب",
    panelSubtitle: "اختر المسار. نوجه الطلب.",
    proofItems: ["٣ مسارات خدمة", "تنسيق إقليمي", "متابعة مركزة"],
    howWeWorkEyebrow: "كيف نعمل",
    howWeWorkTitle: "مسار بسيط من استفسار على مستوى المجموعة إلى تسليم متخصص.",
    processSteps: [
      ["استقبال الطلب", "يرسل الزائر استفساراً عاماً أو يختار مجال خدمة مع سياق أساسي مثل البلد والجدول الزمني ونوع الطلب."],
      ["المراجعة الداخلية", "يتحقق فريق القابضة من المنصة التي يجب أن تمتلك المحادثة وما إذا كانت المستندات أو تفاصيل المشروع أو سياق الدفع مطلوباً."],
      ["التوجيه المتخصص", "يُمرَّر الاستفسار إلى فريق التشغيل المناسب: العقارات، أو التمويل والتجارة، أو الإقامة والتأشيرة والترجمة."],
      ["متابعة مركزة", "يواصل الفريق المتخصص بخطوات تالية واضحة والمعلومات المطلوبة ومسار عملي نحو تقديم الخدمة."],
    ],
    viewCtaPrefix: "عرض",
    governanceEyebrow: "الحوكمة",
    governanceTitle: "تنسيق مسؤول الآن، وهيكل جاهز للمستقبل.",
  },
};

const ENGLISH_HOME_PROCESS_FIRST_STEP = "Request Intake";
const ENGLISH_HOME_HOW_WE_WORK_EYEBROW = "How We Work";
const ENGLISH_HOME_HOW_WE_WORK_TITLE = "A simple path from group-level inquiry to specialist delivery.";

export function resolveLocalizedHomeText(cmsValue, localizedFallback, lang, englishMarker = "") {
  if (!cmsValue || !String(cmsValue).trim()) return localizedFallback;
  if (lang !== "en" && englishMarker && cmsValue === englishMarker) return localizedFallback;
  return cmsValue;
}

export function resolveHomeProcessSteps(processCards, homeFb, lang) {
  if (!processCards?.length) return homeFb.processSteps;
  const steps = processCards.map(([stepTitle, stepText]) => [stepTitle, stepText]);
  if (lang !== "en" && steps[0]?.[0] === ENGLISH_HOME_PROCESS_FIRST_STEP) return homeFb.processSteps;
  return steps;
}

export function sectionCtaLabel(title, lang = "en") {
  const homeFb = homeSectionDefaults[lang] || homeSectionDefaults.en;
  return `${homeFb.viewCtaPrefix} ${title}`;
}

export const groupPageHeroCopy = {
  en: {
    eyebrow: "How We Work",
    hero: "A clear path from first contact to specialist delivery",
    heroSub: "REZAEI GLOBAL LLC reviews each request first, identifies the right business context, and then routes the conversation to the team that can handle it with the right documents, timing, and follow-up.",
    ctaButton: "Send your request",
  },
  tr: {
    eyebrow: "Nasıl Çalışıyoruz",
    hero: "İlk temastan uzman teslimatına net bir yol",
    heroSub: "REZAEI GLOBAL LLC her talebi önce inceler, doğru iş bağlamını belirler ve ardından görüşmeyi doğru belgeler, zamanlama ve takiple yanıtlayabilecek ekibe yönlendirir.",
    ctaButton: "Talebinizi gönderin",
  },
  fa: {
    eyebrow: "نحوه کار ما",
    hero: "مسیر روشن از اولین پیام تا پیگیری تخصصی",
    heroSub: "REZAEI GLOBAL LLC ابتدا هر درخواست را بررسی می‌کند، زمینه تجاری درست را تشخیص می‌دهد و سپس گفتگو را به تیمی هدایت می‌کند که بتواند با مدارک، زمان‌بندی و پیگیری مناسب پاسخ دهد.",
    ctaButton: "ارسال درخواست",
  },
  ar: {
    eyebrow: "كيف نعمل",
    hero: "مسار واضح من أول رسالة إلى متابعة متخصصة",
    heroSub: "تراجع REZAEI GLOBAL LLC كل طلب أولاً، وتحدد السياق التجاري الصحيح، ثم توجه المحادثة إلى الفريق القادر على التعامل معها بالوثائق والتوقيت والمتابعة المناسبة.",
    ctaButton: "أرسل طلبك",
  },
};

export function supportHero(page, lang) {
  const copy = supportHeroCopy[page]?.[lang] || supportHeroCopy[page]?.en || {};
  return copy;
}

export function homeDefaults(lang) {
  return homeSectionDefaults[lang] || homeSectionDefaults.en;
}
