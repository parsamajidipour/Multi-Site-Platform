import { ArrowRight } from "lucide-react";
import { financeServices } from "../financeData.js";

function sectionByKey(cmsSections, key) {
  return cmsSections?.find((section) => section.key === key);
}

function resolveServiceCards(cmsSections) {
  const servicesSection = sectionByKey(cmsSections, "services");
  if (!servicesSection?.cards?.length) return financeServices;

  return servicesSection.cards.map(([title, text, href], index) => {
    const fallback = financeServices[index] || financeServices[0];
    return {
      title,
      meta: fallback.meta,
      text,
      guidance: fallback.guidance,
      scenario: fallback.scenario,
      href: href || fallback.href,
      Icon: fallback.Icon,
    };
  });
}

export function FinanceServicesPage({ navigate, cmsSections }) {
  const hero = sectionByKey(cmsSections, "hero");
  const servicesSection = sectionByKey(cmsSections, "services");
  const serviceCards = resolveServiceCards(cmsSections);

  return (
    <div className="financeDetailPage">
      <section className="detailHero">
        <div className="detailHeroInner">
          <p className="eyebrow">{hero?.eyebrow ?? "Service Lines"}</p>
          <h1>{hero?.title ?? "Three focused paths for trade coordination."}</h1>
          <p className="lead">
            {hero?.text ??
              "Each service is built around a specific type of commercial movement — goods, documents, or payments — with its own inquiry path and follow-up workflow."}
          </p>
        </div>
      </section>

      <section className="detailSection detailLight">
        <div className="sectionInner">
          <div className="holdingSectionHeader">
            <div>
              <p className="eyebrow">{servicesSection?.eyebrow ?? "All Services"}</p>
              <h2>{servicesSection?.title ?? "Choose the right path for your request."}</h2>
            </div>
            <p>
              {servicesSection?.text ||
                "If your request spans more than one service — for example, a shipment that also needs a payment transfer — start with a general inquiry. The desk will route it correctly."}
            </p>
          </div>
          <div className="premiumUnitGrid">
            {serviceCards.map(({ title, meta, text, guidance, href, Icon }) => (
              <article className="premiumUnitCard" key={title}>
                <span>{meta}</span>
                <Icon size={30} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
                <em>{guidance}</em>
                <button type="button" className="unitVisitLink" onClick={() => navigate(href)}>
                  View service <ArrowRight size={15} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detailSection detailDark">
        <div className="sectionGrid">
          <div>
            <p className="eyebrow">Request Examples</p>
            <h2>What a real request looks like for each service line.</h2>
            <p className="sectionIntro">
              Most requests have a clear primary service. When yours spans more than one — goods moving alongside a payment transfer, or documents needed alongside a currency settlement — submit a general inquiry. The desk will map it.
            </p>
          </div>
          <div className="serviceGuidanceList">
            {serviceCards.map(({ title, scenario, Icon }) => (
              <div className="serviceGuidanceItem" key={title}>
                <Icon size={24} aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <p>{scenario}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
