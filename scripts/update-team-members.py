import json
from pathlib import Path

MEMBERS = [
    {
        "key": "member-1",
        "slug": "hosein-rezaei",
        "name": "Hosein Rezaei",
        "en": {
            "role": "Group Managing Director",
            "bio": "Sets group direction, oversees corporate conversations, and keeps every request moving toward the right business unit.",
        },
        "tr": {
            "role": "Grup Genel Muduru",
            "bio": "Grup yonunu belirler, kurumsal gorusmeleri yonetir ve her talebi dogru is birimine yonlendirir.",
        },
        "fa": {
            "role": "مدیرعامل گروه",
            "bio": "جهت‌گیری گروه را تعیین می‌کند، گفت‌وگوهای شرکتی را هدایت می‌کند و هر درخواست را به واحد تجاری درست هدایت می‌کند.",
        },
        "ar": {
            "role": "المدير العام للمجموعة",
            "bio": "يحدد اتجاه المجموعة ويشرف على المحادثات المؤسسية ويوجه كل طلب إلى وحدة الأعمال المناسبة.",
        },
    },
    {
        "key": "member-2",
        "slug": "ali-rezaei",
        "name": "Ali Rezaei",
        "en": {
            "role": "Operations Director",
            "bio": "Reviews intake quality, clarifies missing information, and ensures specialist teams receive usable context.",
        },
        "tr": {
            "role": "Operasyon Direktoru",
            "bio": "Talep kalitesini inceler, eksik bilgileri netlestirir ve uzman ekiplerin kullanilabilir baglam almasini saglar.",
        },
        "fa": {
            "role": "مدیر عملیات",
            "bio": "کیفیت دریافت را بررسی می‌کند، اطلاعات ناقص را روشن می‌کند و زمینه قابل استفاده را به تیم‌های تخصصی می‌رساند.",
        },
        "ar": {
            "role": "مدير العمليات",
            "bio": "يراجع جودة الاستقبال ويوضح المعلومات الناقصة ويضمن وصول سياق قابل للاستخدام إلى الفرق المتخصصة.",
        },
    },
    {
        "key": "member-3",
        "slug": "mohammad-rezaei",
        "name": "Mohammad Rezaei",
        "en": {
            "role": "Real Estate Desk Lead",
            "bio": "Leads property, construction, materials, and quotation conversations across the real estate platform.",
        },
        "tr": {
            "role": "Gayrimenkul Masasi Lideri",
            "bio": "Gayrimenkul platformunda emlak, insaat, malzeme ve teklif gorusmelerini yonetir.",
        },
        "fa": {
            "role": "رئیس میز املاک",
            "bio": "گفت‌وگوهای املاک، ساخت‌وساز، مصالح و استعلام قیمت را در بستر املاک هدایت می‌کند.",
        },
        "ar": {
            "role": "قائد مكتب العقارات",
            "bio": "يقود محادثات العقارات والبناء والمواد وعروض الأسعار عبر منصة العقارات.",
        },
    },
    {
        "key": "member-4",
        "slug": "reza-rezaei",
        "name": "Reza Rezaei",
        "en": {
            "role": "Trade & Finance Desk Lead",
            "bio": "Handles trade, shipment, currency transfer, and commercial finance requests through the finance platform.",
        },
        "tr": {
            "role": "Ticaret ve Finans Masasi Lideri",
            "bio": "Finans platformu uzerinden ticaret, sevkiyat, para transferi ve ticari finans taleplerini yonetir.",
        },
        "fa": {
            "role": "رئیس میز تجارت و مالی",
            "bio": "درخواست‌های تجارت، حمل، انتقال ارز و امور مالی تجاری را از طریق بستر مالی مدیریت می‌کند.",
        },
        "ar": {
            "role": "قائد مكتب التجارة والتمويل",
            "bio": "يتولى طلبات التجارة والشحن وتحويل العملات والتمويل التجاري عبر منصة التمويل.",
        },
    },
]


def member_block(member, locale, order):
    copy = member[locale]
    return {
        "block_key": member["key"],
        "type": "card",
        "title": member["name"],
        "subtitle": copy["role"],
        "body": copy["bio"],
        "image_url": f"/media/team/{member['slug']}.svg",
        "order": order,
    }


def update_roster_blocks(blocks, locale):
    updated = [member_block(member, locale, index) for index, member in enumerate(MEMBERS)]
    others = [block for block in blocks if not block.get("block_key", "").startswith("member-")]
    return sorted(updated + others, key=lambda block: int(block.get("order", 0)))


def patch_file(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    changed = 0
    for page in data["site"]["pages"]:
        locale = page.get("locale", "en")
        if locale not in {"en", "tr", "fa", "ar"}:
            continue
        for section in page.get("sections", []):
            if section.get("section_key") in ("team", "roster") and section.get("type") == "cards":
                section["blocks"] = update_roster_blocks(section.get("blocks", []), locale)
                changed += 1
    Path(path).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {changed} team/roster sections in {path}")


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    for relative in [
        "services/cms-api/content/seed_data/main-site.json",
        "apps/main-site/src/content/fallback.json",
    ]:
        patch_file(root / relative)
