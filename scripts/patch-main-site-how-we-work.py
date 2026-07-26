#!/usr/bin/env python3
"""Replace /leadership pages with /how-we-work pages in main-site seed + fallback JSON."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

GROUP_COPY = {
    "en": {
        "title": "How We Work",
        "seo_title": "How We Work | REZAEI GLOBAL LLC",
        "seo_desc": "How REZAEI GLOBAL LLC reviews, classifies, routes, and follows up on requests across the group.",
        "hero_subtitle": "How We Work",
        "hero_title": "A clear path from first contact to specialist delivery",
        "hero_summary": "REZAEI GLOBAL LLC reviews each request first, identifies the right business context, and then routes the conversation to the team that can handle it with the right documents, timing, and follow-up.",
        "units_eyebrow": "Request Handling",
        "units_title": "What happens before a request is assigned.",
        "units": [
            ("Intake quality check", "Message · Context · Contact", "Before assigning a request, we check whether the first message includes enough business context for a useful response instead of a generic reply.", ["Identify the decision owner", "Confirm country and preferred language", "Capture timeline and urgency", "Separate service requests from introductions"]),
            ("Information gap review", "Details · Evidence · Risk", "The holding team looks for missing details that would slow the specialist team down, then prepares a cleaner handoff path.", ["List missing documents or figures", "Check whether more than one unit is involved", "Flag unclear commercial assumptions", "Define the first useful follow-up question"]),
            ("Ownership handoff", "Owner · Next Step · Follow-up", "Once the request is understandable, it is assigned with a clear owner, practical next step, and enough background to avoid restarting the conversation.", ["Choose the responsible team", "Share the request summary", "Set the first response direction", "Keep group-level visibility when needed"]),
        ],
        "flow_eyebrow": "Working Flow",
        "flow_title": "How we move a request from message to next step.",
        "flow_steps": [
            ("Receive the request", "We start with the visitor's message, service area, country, timeline, and preferred follow-up language."),
            ("Clarify the context", "The holding team checks what information is missing and whether the request is simple, specialist, or multi-unit."),
            ("Choose the owner", "The request is assigned to the platform that owns the service category and can respond with practical next steps."),
            ("Continue with specialists", "The specialist team takes over with the right document list, commercial context, quotation path, or coordination workflow."),
            ("Keep follow-up clear", "The conversation continues with one responsible path, while the holding stays available when more than one unit is involved."),
        ],
        "holding_eyebrow": "Operating Standards",
        "holding_title": "What keeps the work clear.",
        "holding_items": [
            ("Clear Intake", "Every request starts with enough context to understand the goal, market, documents, timeline, and preferred communication path."),
            ("Responsible Routing", "The holding team avoids vague handoffs by assigning each inquiry to the team that owns the service category."),
            ("Specialist Follow-Up", "After routing, the relevant platform continues with service-specific questions, evidence, quotation details, or document steps."),
            ("Multi-Unit Coordination", "When one request touches more than one platform, the holding keeps the conversation organized instead of splitting responsibility."),
        ],
        "cta_eyebrow": "Start With Context",
        "cta_title": "Send the request with enough detail to route it well.",
        "cta_text": "Include the service area, country, timeline, documents or quantities, and the best way to follow up. The holding team will direct it to the right path.",
        "cta_button": "Send Your Request",
    },
    "tr": {
        "title": "Nasıl Çalışıyoruz",
        "seo_title": "Nasıl Çalışıyoruz | REZAEI GLOBAL LLC",
        "seo_desc": "REZAEI GLOBAL LLC'nin talepleri nasıl incelediğini, sınıflandırdığını, yönlendirdiğini ve takip ettiğini açıklar.",
        "hero_subtitle": "Nasıl Çalışıyoruz",
        "hero_title": "İlk temastan uzman teslimatına kadar net bir yol",
        "hero_summary": "REZAEI GLOBAL LLC her talebi önce inceler, doğru iş bağlamını belirler ve konuşmayı doğru belgeler, zamanlama ve takip ile yönetebilecek ekibe yönlendirir.",
        "units_eyebrow": "Talep Yönetimi",
        "units_title": "Talep atanmadan önce ne olur.",
        "units": [
            ("İlk mesaj kalite kontrolü", "Mesaj · Bağlam · İletişim", "Talebi atamadan önce ilk mesajın faydalı bir yanıt için yeterli iş bağlamı taşıyıp taşımadığını kontrol ederiz.", ["Karar sahibini belirleme", "Ülke ve tercih edilen dili doğrulama", "Zamanlama ve aciliyeti alma", "Hizmet taleplerini tanıtımlardan ayırma"]),
            ("Eksik bilgi incelemesi", "Detay · Kanıt · Risk", "Holding ekibi uzman ekibi yavaşlatacak eksik bilgileri kontrol eder ve daha temiz bir devir yolu hazırlar.", ["Eksik belge veya rakamları listeleme", "Birden fazla birim gerekip gerekmediğini kontrol etme", "Belirsiz ticari varsayımları işaretleme", "İlk faydalı takip sorusunu belirleme"]),
            ("Sorumluluk devri", "Sahip · Sonraki Adım · Takip", "Talep anlaşılır hale geldiğinde net bir sahip, pratik sonraki adım ve konuşmayı yeniden başlatmayacak kadar arka plan ile atanır.", ["Sorumlu ekibi seçme", "Talep özetini paylaşma", "İlk yanıt yönünü belirleme", "Gerektiğinde grup görünürlüğünü koruma"]),
        ],
        "flow_eyebrow": "Çalışma Akışı",
        "flow_title": "Bir mesajı nasıl net bir sonraki adıma taşırız.",
        "flow_steps": [
            ("Talebi alırız", "Mesaj, hizmet alanı, ülke, zamanlama ve tercih edilen takip dilinden başlarız."),
            ("Bağlamı netleştiririz", "Eksik bilgileri ve talebin basit, uzmanlık gerektiren ya da çok birimli olup olmadığını kontrol ederiz."),
            ("Sahibi seçeriz", "Talep, hizmet kategorisinin sahibi olan ve pratik adımlarla yanıt verebilecek platforma atanır."),
            ("Uzmanlarla devam ederiz", "Uzman ekip belge listesi, ticari bağlam, teklif yolu veya koordinasyon akışıyla devreye girer."),
            ("Takibi net tutarız", "Konuşma tek bir sorumlu yolda ilerler; birden fazla birim gerektiğinde holding koordinasyonu korur."),
        ],
        "holding_eyebrow": "Çalışma Standartları",
        "holding_title": "İşi net tutan şeyler.",
        "holding_items": [
            ("Net İlk Değerlendirme", "Her talep hedef, pazar, belgeler, zamanlama ve iletişim yolu anlaşılacak kadar bağlamla başlar."),
            ("Sorumlu Yönlendirme", "Holding ekibi belirsiz aktarımlar yerine her talebi hizmet kategorisinin sahibi olan ekibe atar."),
            ("Uzman Takibi", "Yönlendirmeden sonra ilgili platform hizmete özel sorular, kanıtlar, teklif detayları veya belge adımlarıyla devam eder."),
            ("Çok Birimli Koordinasyon", "Talep birden fazla platforma dokunduğunda holding sorumluluğu bölmeden konuşmayı düzenli tutar."),
        ],
        "cta_eyebrow": "Bağlamla Başlayın",
        "cta_title": "Talebinizi doğru yönlendirebilmemiz için yeterli detayla gönderin.",
        "cta_text": "Hizmet alanını, ülkeyi, zamanlamayı, belgeleri veya miktarları ve en iyi takip yolunu ekleyin.",
        "cta_button": "Talebinizi Gönderin",
    },
    "fa": {
        "title": "نحوه کار ما",
        "seo_title": "نحوه کار ما | REZAEI GLOBAL LLC",
        "seo_desc": "نحوه بررسی، دسته‌بندی، مسیریابی و پیگیری درخواست‌ها در REZAEI GLOBAL LLC.",
        "hero_subtitle": "نحوه کار ما",
        "hero_title": "مسیر روشن از اولین پیام تا پیگیری تخصصی",
        "hero_summary": "REZAEI GLOBAL LLC ابتدا هر درخواست را بررسی می‌کند، زمینه تجاری درست را تشخیص می‌دهد و سپس گفتگو را به تیمی هدایت می‌کند که بتواند با مدارک، زمان‌بندی و پیگیری مناسب پاسخ دهد.",
        "units_eyebrow": "مدیریت درخواست",
        "units_title": "قبل از سپردن درخواست چه اتفاقی می‌افتد.",
        "units": [
            ("بررسی کیفیت پیام اولیه", "پیام · زمینه · تماس", "پیش از سپردن درخواست، بررسی می‌کنیم پیام اولیه زمینه تجاری کافی برای پاسخ مفید داشته باشد، نه یک جواب کلی.", ["تشخیص مسئول تصمیم‌گیر", "تایید کشور و زبان ترجیحی", "ثبت زمان‌بندی و فوریت", "تفکیک درخواست خدمات از معرفی همکاری"]),
            ("بررسی کمبود اطلاعات", "جزئیات · مدارک · ریسک", "تیم هلدینگ موارد ناقصی را که می‌تواند تیم تخصصی را کند کند بررسی می‌کند و مسیر تحویل روشن‌تری آماده می‌سازد.", ["فهرست مدارک یا اعداد ناقص", "بررسی دخالت بیش از یک واحد", "علامت‌گذاری فرضیات تجاری مبهم", "تعیین اولین سؤال پیگیری مفید"]),
            ("تحویل مسئولیت", "مالک · گام بعد · پیگیری", "وقتی درخواست قابل فهم شد، با مالک مشخص، گام عملی بعدی و زمینه کافی برای جلوگیری از شروع دوباره گفتگو سپرده می‌شود.", ["انتخاب تیم مسئول", "اشتراک خلاصه درخواست", "تعیین جهت پاسخ اول", "حفظ دید گروهی در صورت نیاز"]),
        ],
        "flow_eyebrow": "جریان کار",
        "flow_title": "چگونه یک پیام را به گام بعدی روشن تبدیل می‌کنیم.",
        "flow_steps": [
            ("دریافت درخواست", "با پیام، حوزه خدمات، کشور، زمان‌بندی و زبان پیگیری ترجیحی شروع می‌کنیم."),
            ("روشن‌سازی زمینه", "اطلاعات ناقص و ساده یا تخصصی بودن درخواست را بررسی می‌کنیم."),
            ("انتخاب مالک", "درخواست به پلتفرمی سپرده می‌شود که مالک آن دسته خدمات است."),
            ("ادامه با متخصصان", "تیم تخصصی با فهرست مدارک، زمینه تجاری یا مسیر پیشنهاد قیمت ادامه می‌دهد."),
            ("پیگیری روشن", "گفتگو در یک مسیر مسئول ادامه می‌یابد و هلدینگ در موارد چندواحدی هماهنگ می‌ماند."),
        ],
        "holding_eyebrow": "استانداردهای عملیاتی",
        "holding_title": "آنچه کار را روشن نگه می‌دارد.",
        "holding_items": [
            ("دریافت روشن", "هر درخواست با زمینه کافی درباره هدف، بازار، مدارک و زمان‌بندی آغاز می‌شود."),
            ("مسیریابی مسئول", "تیم هلدینگ به جای ارجاع مبهم، هر درخواست را به تیم مالک دسته خدمات می‌سپارد."),
            ("پیگیری تخصصی", "پس از مسیریابی، پلتفرم مربوط با سؤالات تخصصی و مدارک ادامه می‌دهد."),
            ("هماهنگی چندواحدی", "وقتی درخواست بیش از یک پلتفرم را دربرمی‌گیرد، هلدینگ گفتگو را منظم نگه می‌دارد."),
        ],
        "cta_eyebrow": "با زمینه شروع کنید",
        "cta_title": "درخواست را با جزئیات کافی بفرستید تا درست هدایت شود.",
        "cta_text": "حوزه خدمات، کشور، زمان‌بندی، مدارک یا مقدارها و بهترین روش پیگیری را در پیام اول بنویسید.",
        "cta_button": "ارسال درخواست",
    },
    "ar": {
        "title": "كيف نعمل",
        "seo_title": "كيف نعمل | REZAEI GLOBAL LLC",
        "seo_desc": "كيف تراجع REZAEI GLOBAL LLC الطلبات وتصنفها وتوجهها وتتابعها عبر المجموعة.",
        "hero_subtitle": "كيف نعمل",
        "hero_title": "مسار واضح من أول رسالة إلى متابعة متخصصة",
        "hero_summary": "تراجع REZAEI GLOBAL LLC كل طلب أولاً، وتحدد السياق التجاري الصحيح، ثم توجه المحادثة إلى الفريق القادر على التعامل معها بالوثائق والتوقيت والمتابعة المناسبة.",
        "units_eyebrow": "إدارة الطلب",
        "units_title": "ما الذي يحدث قبل إسناد الطلب.",
        "units": [
            ("فحص جودة الرسالة الأولى", "الرسالة · السياق · التواصل", "قبل إسناد الطلب، نتحقق من أن الرسالة الأولى تحمل سياقاً عملياً كافياً لرد مفيد بدلاً من رد عام.", ["تحديد صاحب القرار", "تأكيد الدولة واللغة المفضلة", "تسجيل التوقيت والاستعجال", "فصل طلبات الخدمة عن التعارف التجاري"]),
            ("مراجعة نقص المعلومات", "التفاصيل · الأدلة · المخاطر", "يراجع فريق القابضة التفاصيل الناقصة التي قد تبطئ الفريق المتخصص، ثم يجهز مسار تسليم أوضح.", ["حصر الوثائق أو الأرقام الناقصة", "فحص ما إذا كان أكثر من فريق معني", "تمييز الافتراضات التجارية غير الواضحة", "تحديد أول سؤال متابعة مفيد"]),
            ("تسليم المسؤولية", "المالك · الخطوة التالية · المتابعة", "عندما يصبح الطلب واضحاً، يُسند إلى مالك محدد مع خطوة عملية تالية وخلفية كافية حتى لا تبدأ المحادثة من جديد.", ["اختيار الفريق المسؤول", "مشاركة ملخص الطلب", "تحديد اتجاه الرد الأول", "الحفاظ على رؤية المجموعة عند الحاجة"]),
        ],
        "flow_eyebrow": "سير العمل",
        "flow_title": "كيف نحول الرسالة إلى خطوة تالية واضحة.",
        "flow_steps": [
            ("استلام الطلب", "نبدأ برسالة الزائر ومجال الخدمة والدولة والتوقيت ولغة المتابعة المفضلة."),
            ("توضيح السياق", "نراجع المعلومات الناقصة وما إذا كان الطلب بسيطاً أو متخصصاً أو متعدد الوحدات."),
            ("اختيار المالك", "يُسند الطلب إلى المنصة المالكة لفئة الخدمة والقادرة على تقديم خطوات عملية."),
            ("المتابعة مع المتخصصين", "يتولى الفريق المتخصص قائمة الوثائق أو السياق التجاري أو مسار عرض السعر أو التنسيق."),
            ("إبقاء المتابعة واضحة", "تستمر المحادثة في مسار مسؤول واحد، مع بقاء القابضة للتنسيق عند تعدد الوحدات."),
        ],
        "holding_eyebrow": "معايير العمل",
        "holding_title": "ما يحافظ على وضوح العمل.",
        "holding_items": [
            ("استقبال واضح", "يبدأ كل طلب بسياق كافٍ حول الهدف والسوق والوثائق والتوقيت ومسار التواصل."),
            ("توجيه مسؤول", "يتجنب فريق القابضة الإحالات الغامضة ويسند كل طلب إلى الفريق المالك لفئة الخدمة."),
            ("متابعة متخصصة", "بعد التوجيه، تتابع المنصة المعنية بأسئلة الخدمة والأدلة وتفاصيل السعر أو خطوات الوثائق."),
            ("تنسيق متعدد الوحدات", "عندما يلمس طلب واحد أكثر من منصة، تحافظ القابضة على تنظيم المحادثة."),
        ],
        "cta_eyebrow": "ابدأ بالسياق",
        "cta_title": "أرسل الطلب بتفاصيل كافية حتى نوجهه بشكل صحيح.",
        "cta_text": "اذكر مجال الخدمة والدولة والتوقيت والوثائق أو الكميات وأفضل طريقة للمتابعة في الرسالة الأولى.",
        "cta_button": "أرسل طلبك",
    },
}


def build_page(locale, copy):
    unit_blocks = []
    for idx, (title, scope, text, areas) in enumerate(copy["units"]):
        unit_blocks.append({
            "block_key": f"unit-{idx + 1}",
            "type": "card",
            "title": title,
            "subtitle": scope,
            "body": text + "\n---\n" + "\n".join(areas),
            "order": idx,
        })

    flow_blocks = [
        {"block_key": f"flow-{idx + 1}", "type": "process_step", "title": title, "body": body, "order": idx}
        for idx, (title, body) in enumerate(copy["flow_steps"])
    ]

    holding_blocks = [
        {"block_key": f"holding-{idx + 1}", "type": "card", "title": title, "body": body, "order": idx}
        for idx, (title, body) in enumerate(copy["holding_items"])
    ]

    return {
        "slug": "/how-we-work",
        "title": copy["title"],
        "locale": locale,
        "page_type": "detail",
        "status": "published",
        "seo": {
            "title": copy["seo_title"],
            "description": copy["seo_desc"],
            "keywords": "how we work, request routing, REZAEI GLOBAL LLC, group process",
            "og_image_url": "/brand/rezaei-global-logo-wide-web.png",
        },
        "sections": [
            {
                "section_key": "hero",
                "type": "hero",
                "subtitle": copy["hero_subtitle"],
                "title": copy["hero_title"],
                "summary": copy["hero_summary"],
                "order": 0,
                "blocks": [],
            },
            {
                "section_key": "units",
                "type": "cards",
                "subtitle": copy["units_eyebrow"],
                "title": copy["units_title"],
                "order": 1,
                "blocks": unit_blocks,
            },
            {
                "section_key": "flow",
                "type": "process",
                "subtitle": copy["flow_eyebrow"],
                "title": copy["flow_title"],
                "order": 2,
                "blocks": flow_blocks,
            },
            {
                "section_key": "holding",
                "type": "cards",
                "subtitle": copy["holding_eyebrow"],
                "title": copy["holding_title"],
                "order": 3,
                "blocks": holding_blocks,
            },
            {
                "section_key": "cta",
                "type": "cta",
                "subtitle": copy["cta_eyebrow"],
                "title": copy["cta_title"],
                "summary": copy["cta_text"],
                "order": 4,
                "blocks": [
                    {
                        "block_key": "cta-button",
                        "type": "button",
                        "title": copy["cta_button"],
                        "href": "/contact",
                        "order": 0,
                    }
                ],
            },
        ],
    }


def patch_file(path: Path):
    data = json.loads(path.read_text(encoding="utf-8"))
    pages = data["site"]["pages"]
    pages = [p for p in pages if p.get("slug") != "/leadership"]
    how_we_work = [build_page(locale, GROUP_COPY[locale]) for locale in ("en", "tr", "fa", "ar")]
    # Insert before /team pages if present, else append
    team_idx = next((i for i, p in enumerate(pages) if p.get("slug") == "/team"), len(pages))
    for offset, page in enumerate(how_we_work):
        pages.insert(team_idx + offset, page)
    data["site"]["pages"] = pages
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Patched {path} — removed /leadership, added /how-we-work x4")


def main():
    for rel in (
        "services/cms-api/content/seed_data/main-site.json",
        "apps/main-site/src/content/fallback.json",
    ):
        patch_file(ROOT / rel)


if __name__ == "__main__":
    main()
