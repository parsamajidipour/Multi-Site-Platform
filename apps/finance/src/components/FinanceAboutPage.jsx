import { ArrowRight, CheckCircle2 } from "lucide-react";
import { tradeWhyPoints, tradeStructureItems } from "../financeData.js";

function sectionByKey(cmsSections, key) {
  return cmsSections?.find((section) => section.key === key);
}

export function FinanceAboutPage({ navigate, cmsSections }) {
  const hero = sectionByKey(cmsSections, "hero");
  const whySection = sectionByKey(cmsSections, "why");
  const whyCards = whySection?.cards?.length
    ? whySection.cards.map(([title, text]) => [title, text])
    : tradeWhyPoints;

  return (
    <div className="financeDetailPage">
      <section className="detailHero">
        <div className="detailHeroInner">
          <p className="eyebrow">{hero?.eyebrow ?? "About the Trade Desk"}</p>
          <h1>{hero?.title ?? "Operational coordination built for cross-border business."}</h1>
          <p className="lead">
            {hero?.text ??
              "Rezaei Finance is the trade and payment coordination arm of REZAEI GLOBAL LLC. Import-export, shipping documents, and FX — one desk, one file."}
          </p>
        </div>
      </section>

      <section className="detailSection detailLight">
        <div className="sectionGrid">
          <div>
            <p className="eyebrow">{sectionByKey(cmsSections, "what-we-do")?.eyebrow ?? "What We Do"}</p>
            <h2>{sectionByKey(cmsSections, "what-we-do")?.title ?? "One desk for goods, documents, and payments."}</h2>
          </div>
          <div className="missionCopy">
            {sectionByKey(cmsSections, "what-we-do")?.text ? (
              <p>{sectionByKey(cmsSections, "what-we-do").text}</p>
            ) : (
              <>
                <p>
                  Most commercial moves across borders do not stay in one category. A product shipment depends on sourcing, customs papers, and a payment transfer. The trade desk keeps those threads connected instead of handing them to separate teams.
                </p>
                <p>
                  Coordination is the core service: tracking documents, timing payments, and keeping suppliers, buyers, and carriers on the same operational path from first inquiry to file completion.
                </p>
                <p>
                  The desk operates across the Gulf Cooperation Council, Turkey, Iran, and international sourcing routes. Requests typically involve manufacturers, distributors, customs agents, freight forwarders, and payment counterparties — each with their own document deadlines and settlement requirements.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="detailSection detailDark">
        <div className="sectionInner">
          <div className="holdingSectionHeader">
            <div>
              <p className="eyebrow">{whySection?.eyebrow ?? "Why the Desk Exists"}</p>
              <h2>{whySection?.title ?? "Three operational realities that require coordination."}</h2>
            </div>
            <p>{whySection?.text || "These are not edge cases — they are the standard shape of cross-border commercial files."}</p>
          </div>
          <div className="whyPointGrid">
            {whyCards.map(([title, text]) => (
              <article key={title}>
                <CheckCircle2 size={26} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detailSection detailLight">
        <div className="sectionInner">
          <div className="holdingSectionHeader">
            <div>
              <p className="eyebrow">Operations Structure</p>
              <h2>How the trade desk is organized internally.</h2>
            </div>
            <p>Each incoming request is reviewed against the three service lines. Most route clearly — an import question to import-export, a document gap to shipping, a payment question to FX. Complex files that span two or more services are held at the desk level until the full scope is mapped before routing begins.</p>
          </div>
          <div className="orgStructureGrid">
            {tradeStructureItems.map(([Icon, title, text], index) => (
              <article className={index === 0 ? "orgStructureParent" : ""} key={title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detailCta">
        <div className="detailCtaInner">
          <h2>Ready to send a trade request?</h2>
          <p>Start with the desk — describe what you need and we will route it to the right service line.</p>
          <div className="actions">
            <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
              Send a Trade Request <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button type="button" className="secondaryButton" onClick={() => navigate("/services")}>
              View Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
