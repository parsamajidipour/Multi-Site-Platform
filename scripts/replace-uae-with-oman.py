"""
Global content migration: replace every Dubai / UAE / Emirates reference with
Muscat / Oman / Sultanate equivalents across all REZAEI GLOBAL apps and CMS
seed data. Handles English, Turkish, Persian, and Arabic copy plus phone
prefixes, AED prices, slugs, and flag URLs.

Run from the repo root:
    python scripts/replace-uae-with-oman.py
"""

from __future__ import annotations

import io
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

TARGET_FILES = [
    "apps/admin-panel/src/App.jsx",
    "apps/finance/src/App.jsx",
    "apps/finance/src/data.js",
    "apps/finance/src/financeData.js",
    "apps/finance/src/components/FinanceCountriesPage.jsx",
    "apps/finance/src/components/FinanceContactPage.jsx",
    "apps/finance/src/components/ContactBand.jsx",
    "apps/finance/src/components/HeroSection.jsx",
    "apps/finance/src/content/fallback.json",
    "apps/finance/public/sitemap.xml",
    "apps/main-site/src/App.jsx",
    "apps/main-site/src/content/fallback.json",
    "apps/real-estate/src/App.jsx",
    "apps/real-estate/src/content/fallback.json",
    "apps/real-estate/src/lib/contentAdapter.js",
    "apps/real-estate/src/lib/insightsPageCopy.js",
    "apps/real-estate/src/lib/materialsPageCopy.js",
    "apps/real-estate/src/lib/projectsPageCopy.js",
    "apps/real-estate/src/lib/propertiesPageCopy.js",
    "apps/real-estate/src/lib/projectContentLocales.js",
    "apps/visa/src/App.jsx",
    "apps/visa/src/lib/contentAdapter.js",
    "apps/visa/src/content/fallback.json",
    "services/cms-api/content/seed_data/finance.json",
    "services/cms-api/content/seed_data/main-site.json",
    "services/cms-api/content/seed_data/real-estate.json",
    "services/cms-api/content/seed_data/visa.json",
]

# Ordered list of (old, new) literal string replacements.
# Longest / most-specific patterns come first so they swallow context before
# shorter generic terms (e.g. "Dubai, UAE" before "Dubai" / "UAE").
REPLACEMENTS: list[tuple[str, str]] = [
    # ---- Full country phrases ----
    ("الإمارات العربية المتحدة", "سلطنة عُمان"),
    ("امارات متحده عربی", "سلطنت عُمان"),
    ("Birleşik Arap Emirlikleri", "Umman Sultanlığı"),
    ("Birleşik Arap", "Umman"),
    ("United Arab Emirates", "Sultanate of Oman"),
    ("U.A.E.", "Oman"),

    # ---- Composite city + country labels ----
    ("Dubai, United Arab Emirates", "Muscat, Sultanate of Oman"),
    ("Dubai, UAE", "Muscat, Oman"),
    ("Dubai, BAE", "Maskat, Umman"),
    ("Sharjah, BAE", "Salalah, Umman"),
    ("Sharjah, UAE", "Salalah, Oman"),
    ("Umman ve BAE", "Umman"),
    ("Oman and UAE", "Oman"),
    ("UAE and Oman", "Oman"),
    ("Oman and Emirates", "Oman"),

    # ---- Specific neighborhoods / districts ----
    ("Dubai Hills Estate", "Muscat Hills"),
    ("Dubai Hills", "Muscat Hills"),
    ("Dubai Marina", "Al Mouj Marina"),
    ("Downtown Dubai", "Downtown Muscat"),
    ("Dubai Growth Corridor", "Muscat Growth Corridor"),
    ("Dubai International Financial Centre", "Muscat Financial Centre"),
    ("Dubai Büyüme Koridoru", "Maskat Büyüme Koridoru"),
    ("Business Bay", "Madinat Sultan Qaboos"),
    ("Palm Jumeirah", "Al Mouj"),
    ("Palm Jebel Ali", "Al Mouj"),
    ("Saadiyat Island", "Al Mouj"),
    ("Saadiyat", "Al Mouj"),
    ("Jumeirah", "Shatti Al Qurum"),
    ("DIFC", "MFC"),
    ("DMCC", "OMCC"),
    ("RAK ICC", "Sohar Free Zone"),
    ("IFZA", "Salalah Free Zone"),
    ("RAK", "Sohar"),
    ("JBR", "Al Mouj Boulevard"),
    ("JLT", "Madinat Sultan Qaboos"),
    ("DED", "Muscat Municipality"),

    # ---- Other UAE emirates → Oman cities ----
    ("Abu Dhabi", "Nizwa"),
    ("Sharjah", "Salalah"),
    ("Ras Al Khaimah", "Sohar"),
    ("Ajman", "Sur"),
    ("Fujairah", "Khasab"),
    ("Umm Al Quwain", "Duqm"),

    # ---- Country abbreviations / general ----
    ("UAE", "Oman"),
    ("BAE", "Umman"),

    # ---- "Emirati" / "Emirate" / "Emirates" ----
    ("Emirati", "Omani"),
    ("emirati", "omani"),
    ("Emirates", "Oman"),
    ("emirates", "oman"),
    ("Emirate", "Sultanate"),
    ("emirate", "sultanate"),
    # Turkish derivatives
    ("Emirlikleri", "Sultanlıkları"),
    ("Emirlik", "Sultanlık"),

    # ---- City: Dubai ----
    ("Dubai'de", "Maskat'ta"),
    ("Dubai'ye", "Maskat'a"),
    ("Dubai'nin", "Maskat'ın"),
    ("Dubai'den", "Maskat'tan"),
    ("Dubai", "Muscat"),
    ("DUBAI", "MUSCAT"),
    ("dubai", "muscat"),

    # ---- Arabic toponyms ----
    ("الإمارات الشمالية", "ظفار الشمالية"),
    ("الإمارات", "عُمان"),
    ("إماراتي", "عُماني"),
    ("الإماراتي", "العُماني"),
    ("أبو ظبي", "نزوى"),
    ("أبوظبي", "نزوى"),
    ("الشارقة", "صلالة"),
    ("رأس الخيمة", "صحار"),
    ("الفجيرة", "خصب"),
    ("عجمان", "صور"),
    ("أم القيوين", "الدقم"),
    ("جميرا", "شاطئ القرم"),
    ("وسط دبي", "وسط مسقط"),
    ("ممر نمو دبي", "ممر نمو مسقط"),
    ("دبي هيلز", "مسقط هيلز"),
    ("دبي", "مسقط"),

    # ---- Persian toponyms ----
    ("امارات شمالی", "ظفار شمالی"),
    ("امارات", "عُمان"),
    ("اماراتی", "عُمانی"),
    ("ابوظبی", "نزوا"),
    ("ابو ظبی", "نزوا"),
    ("شارجه", "صلاله"),
    ("جمیرا", "شاطی القرم"),
    ("مرکز شهر دبی", "مرکز شهر مسقط"),
    ("کوریدور رشد دبی", "کوریدور رشد مسقط"),
    ("دبی هیلز", "مسقط هیلز"),
    ("دبی", "مسقط"),

    # ---- Phone prefix ----
    ("+971", "+968"),

    # ---- Currency: AED → OMR (1 AED ≈ 0.103 OMR) ----
    ("AED 12.5M", "OMR 1.3M"),
    ("AED 3.2M", "OMR 330K"),
    ("AED 280K", "OMR 29K"),
    ("AED 8.9M", "OMR 920K"),
    ("AED 6.4M", "OMR 660K"),
    ("AED 1.2M", "OMR 125K"),
    ("AED 500K", "OMR 50K"),
    ("AED 5M", "OMR 500K"),
    ("AED 1M", "OMR 100K"),
    ("500K – 5M AED", "50K – 500K OMR"),
    ("500K – AED 5M", "50K – OMR 500K"),
    ("AED", "OMR"),
    # Arabic / Persian currency word "درهم" → ریال عمانی / ريال عماني
    ("۵۰۰ هزار تا ۵ میلیون درهم", "۵۰ هزار تا ۵۰۰ هزار ریال عمانی"),
    ("500K – 5M درهم", "50K – 500K ريال عماني"),
    ("درهم", "ریال عمانی"),

    # ---- Slugs / URL paths / block keys ----
    ("dubai-residential-acquisition-support", "muscat-residential-acquisition-support"),
    ("/countries/uae", "/countries/oman"),
    ("\"block_key\": \"uae\"", "\"block_key\": \"oman\""),
    ("\"id\": \"uae\"", "\"id\": \"oman\""),
    ("\"slug\": \"uae\"", "\"slug\": \"oman\""),
    # Flag image country code
    ("flagcdn.com/w640/ae.png", "flagcdn.com/w640/om.png"),
    ("flagcdn.com/w320/ae.png", "flagcdn.com/w320/om.png"),
    ("flagcdn.com/w160/ae.png", "flagcdn.com/w160/om.png"),
]


def apply_replacements(text: str, replacements: list[tuple[str, str]]):
    """Apply each replacement to `text`, returning the new text and a count map."""
    counts: dict[str, int] = {}
    for old, new in replacements:
        if old == new or old not in text:
            continue
        n = text.count(old)
        if n:
            text = text.replace(old, new)
            counts[old] = counts.get(old, 0) + n
    return text, counts


def main() -> int:
    total_replacements = 0
    files_changed = 0
    missing_files: list[str] = []

    for rel in TARGET_FILES:
        path = REPO_ROOT / rel
        if not path.exists():
            missing_files.append(rel)
            continue
        original = path.read_text(encoding="utf-8")
        updated, counts = apply_replacements(original, REPLACEMENTS)
        if not counts:
            continue
        path.write_text(updated, encoding="utf-8", newline="\n")
        files_changed += 1
        file_total = sum(counts.values())
        total_replacements += file_total
        print(f"[OK] {rel}: {file_total} replacement(s)")
        for old, count in sorted(counts.items(), key=lambda kv: -kv[1]):
            preview = old.replace("\n", "\\n")
            if len(preview) > 60:
                preview = preview[:60] + "..."
            print(f"     {count:>4}x  {preview}")

    print()
    print(f"Files changed: {files_changed} / {len(TARGET_FILES)}")
    print(f"Total replacements: {total_replacements}")
    if missing_files:
        print(f"Missing files: {len(missing_files)}")
        for rel in missing_files:
            print(f"  - {rel}")
    return 0


if __name__ == "__main__":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    raise SystemExit(main())
