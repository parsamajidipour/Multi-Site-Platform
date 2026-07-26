import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";

export function LanguageSelector({ lang, languages, onChange, className = "" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef(null);
  const active = languages.find((item) => item.code === lang) || languages[0];

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  function selectLanguage(code) {
    onChange(code);
    setMobileOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={`languageSelector${mobileOpen ? " is-open" : ""} ${className}`.trim()}
      data-language={lang}
    >
      <span className="languageSelectorIcon" aria-hidden="true">
        <Languages size={16} strokeWidth={2.2} />
      </span>

      <div className="languageOptions languageOptionsDesktop" role="group" aria-label="Choose language">
        {languages.map((item) => (
          <button
            key={item.code}
            type="button"
            className={lang === item.code ? "languageOption is-active" : "languageOption"}
            onClick={() => selectLanguage(item.code)}
            aria-pressed={lang === item.code}
            aria-label={item.name || item.label}
            title={item.name || item.label}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="languageMobileMenu">
        <button
          type="button"
          className="languageMobileTrigger"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-haspopup="listbox"
          aria-label="Select language"
        >
          <Languages size={15} aria-hidden="true" />
          <span className="languageMobileValue">{active.name || active.label}</span>
          <span className="languageMobileValueCompact">{active.label}</span>
          <ChevronDown size={14} className="languageMobileChevron" aria-hidden="true" />
        </button>

        {mobileOpen ? (
          <>
            <button
              type="button"
              className="languageMobileBackdrop"
              aria-label="Close language menu"
              tabIndex={-1}
              onClick={() => setMobileOpen(false)}
            />
            <ul className="languageMobilePanel" role="listbox" aria-label="Languages">
              {languages.map((item) => (
                <li key={item.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={lang === item.code}
                    className={lang === item.code ? "languageMobileOption is-active" : "languageMobileOption"}
                    onClick={() => selectLanguage(item.code)}
                  >
                    <span className="languageMobileOptionCode">{item.label}</span>
                    <span className="languageMobileOptionName">{item.name || item.label}</span>
                    {lang === item.code ? <Check size={15} aria-hidden="true" /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
