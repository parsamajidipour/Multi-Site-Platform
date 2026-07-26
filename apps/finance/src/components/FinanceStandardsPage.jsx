import { ArrowRight } from "lucide-react";
import { tradeStandards } from "../financeData.js";

function sectionByKey(cmsSections, key) {
  return cmsSections?.find((section) => section.key === key);
}

export function FinanceStandardsPage({ navigate, cmsSections }) {
  const hero = sectionByKey(cmsSections, "hero");
  const standardsSection = sectionByKey(cmsSections, "standards");
  const standardsCards = standardsSection?.cards?.length
    ? standardsSection.cards.map(([title, text], index) => {
        const fallback = tradeStandards[index] || tradeStandards[0];
        return [fallback[0], title, text];
      })
    : tradeStandards;

  return (
    <div className="financeDetailPage">
      <section className="detailHero">
        <div className="detailHeroInner">
          <p className="eyebrow">{hero?.eyebrow ?? "Operating Standards"}</p>
          <h1>{hero?.title ?? "Trade coordination built on document discipline and timing clarity."}</h1>
          <p className="lead">
            {hero?.text ??
              "Each request moves through a defined set of checks before the desk commits to a timeline, a payment path, or a shipment confirmation."}
          </p>
        </div>
      </section>

      <section className="detailSection detailLight">
        <div className="sectionInner">
          <div className="holdingSectionHeader">
            <div>
              <p className="eyebrow">{standardsSection?.eyebrow ?? "The Four Standards"}</p>
              <h2>{standardsSection?.title ?? "What the desk checks before committing to any file."}</h2>
            </div>
            <p>{standardsSection?.text || "These are operational requirements, not preferences. They apply to every inquiry regardless of goods type, origin, or payment method."}</p>
          </div>
          <div className="governanceGrid detailGovernanceGrid">
            {standardsCards.map(([Icon, title, text]) => (
              <article key={title}>
                <Icon size={28} aria-hidden="true" />
                <h3>{title}</h3>
                <p className="governanceDetailText">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detailSection detailDark">
        <div className="sectionGrid">
          <div>
            <p className="eyebrow">Why Standards Matter</p>
            <h2>Commitment without information creates risk.</h2>
          </div>
          <div className="missionCopy">
            <p>
              Cross-border trade files involve multiple parties, currencies, and document deadlines. A commitment made without full document context or confirmed payment terms creates downstream problems that cannot be corrected without cost.
            </p>
            <p>
              The desk will not confirm a shipment timeline until origin, carrier, and document status are verified. It will not commit to a payment transfer until currency pair, amount, and settlement deadline are clear.
            </p>
            <p>
              This discipline protects both parties — the desk does not overpromise, and the counterparty knows exactly what is needed before the file can move.
            </p>
            <p>
              A common example: a goods shipment is confirmed and the carrier is ready, but the invoice references a currency that cannot be settled in the destination country. Without a confirmed payment path, the carrier will not release. The importer faces demurrage charges and the supplier faces a dispute. The desk does not allow a file to reach that stage without both the document thread and the payment thread being resolved first.
            </p>
          </div>
        </div>
      </section>

      <section className="detailSection detailLight">
        <div className="sectionGrid">
          <div>
            <p className="eyebrow">Before You Submit</p>
            <h2>What to include in your request.</h2>
          </div>
          <div className="missionCopy">
            <p>
              For import or export requests: goods type, origin country, destination country, supplier or buyer contact, current document status, and preferred delivery timeline.
            </p>
            <p>
              For shipping document requests: which documents are in place, which are missing, the customs reference number if applicable, and the cargo release deadline.
            </p>
            <p>
              For FX and payment requests: currency pair, amount, counterparty name and bank, invoice reference, and settlement deadline.
            </p>
          </div>
        </div>
      </section>

      <section className="detailCta">
        <div className="detailCtaInner">
          <h2>Submit a request that is ready to move.</h2>
          <p>When you have the key details prepared, the desk can assess and route your file within the business day.</p>
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
