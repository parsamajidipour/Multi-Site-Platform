import { Menu, X } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

export function Header({ lang, setLang, languages, pages, pageHref, navigate, labels, brand, menuOpen, setMenuOpen, isPremiumFinanceHome, isFinanceDetailPage, activeSection, homeNavItems, navigateToHomeAnchor }) {
  return (
    <header className="siteHeader">
      <a
        className="brand"
        href="/"
        onClick={(e) => { e.preventDefault(); navigate("/"); }}
      >
        <img src={brand.logoWide} alt={brand.displayName} />
      </a>

      <div className="navDivider" aria-hidden="true" />

      <button
        className="iconButton"
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <nav className={menuOpen ? "navLinks open" : "navLinks"} aria-label="Main navigation">
        {(isPremiumFinanceHome || isFinanceDetailPage) ? (
          homeNavItems.map(([label, sectionId]) => {
            const href = sectionId === "home" ? "/" : `/${sectionId}`;
            return (
              <a
                className={href === pageHref ? "active" : ""}
                href={href}
                key={sectionId}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(href);
                  setMenuOpen(false);
                }}
              >
                {label}
              </a>
            );
          })
        ) : (
          pages.map((item) => (
            <a
              className={item[1] === pageHref ? "active" : ""}
              href={item[1]}
              key={item[1]}
              onClick={(e) => { e.preventDefault(); navigate(item[1]); setMenuOpen(false); }}
            >
              {item[2]}
            </a>
          ))
        )}
      </nav>

      <div className="navDivider" aria-hidden="true" />

      <LanguageSelector lang={lang} languages={languages} onChange={setLang} />
    </header>
  );
}
