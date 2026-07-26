import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

const ease = "power3.out";

export function HeroSection({ isHome, activeHeroMedia, copy, labels, brand, pageLabel, pageTitle, pageText, navigate, pages }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const cardRef = useRef(null);
  const countriesPath = pages.find(([key]) => key === "countries")?.[1] || "/countries";

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isHome) {
        gsap.fromTo(leftRef.current,
          { opacity: 0, x: -32 },
          { opacity: 1, x: 0, duration: 1.0, delay: 0.1, ease }
        );
        gsap.fromTo(rightRef.current,
          { opacity: 0, x: 32 },
          { opacity: 1, x: 0, duration: 1.0, delay: 0.25, ease }
        );
      } else {
        gsap.fromTo(cardRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.85, delay: 0.1, ease }
        );
      }
    });
    return () => ctx.revert();
  }, [isHome, pageTitle]);

  return (
    <section className={isHome ? "hero" : "pageHero"}>
      {isHome && (
        <video
          className="heroVideo"
          autoPlay muted loop playsInline preload="metadata"
          poster={activeHeroMedia.poster}
          aria-hidden="true"
        >
          <source src={activeHeroMedia.video} type="video/mp4" />
        </video>
      )}
      {!isHome && (
        <div
          className="heroVideo"
          style={{ backgroundImage: `url(${activeHeroMedia.poster})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden="true"
        />
      )}
      <div className="heroBackdrop" aria-hidden="true" />

      <div className="heroInner">
        {isHome ? (
          <div className="heroLayout">
            <div ref={leftRef} className="heroLeft" style={{ opacity: 0 }}>
              <div className="heroAccent">
                <div className="heroAccentLine" />
                <p className="eyebrow" style={{ margin: 0 }}>{copy.hero[0]}</p>
              </div>
              <h1>{copy.hero[1]}</h1>
              <p className="lead">{copy.hero[2]}</p>
              <div className="actions">
                <a className="primaryButton" href="/contact"
                  onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>
                  {labels.inquiry}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a className="secondaryButton" href={countriesPath}
                  onClick={(e) => { e.preventDefault(); navigate(countriesPath); }}>
                  {labels.countryCoverage || "View Country Coverage"}
                </a>
              </div>
            </div>

            <div ref={rightRef} className="heroRight" style={{ opacity: 0 }}>
              <div className="heroLogoPanel" aria-label={brand.displayName}>
                <img src={brand.logoStacked} alt={brand.displayName} />
              </div>
              <div className="heroInfoChips">
                {[["4", labels.languages], ["3", labels.platforms], ["Oman", labels.registered], ["24/7", labels.support]].map(([val, lbl]) => (
                  <div className="heroInfoChip" key={lbl}>
                    <strong>{val}</strong>
                    <span>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={cardRef} className="pageHeroCard" style={{ opacity: 0 }}>
            <p className="eyebrow">{pageLabel}</p>
            <h1>{pageTitle}</h1>
            <p className="lead">{pageText}</p>
          </div>
        )}
      </div>
    </section>
  );
}
