import { ArrowRight } from "lucide-react";
import { tradeWorkFlow } from "../financeData.js";

function sectionByKey(cmsSections, key) {
  return cmsSections?.find((section) => section.key === key);
}

export function FinanceProcessPage({ navigate, cmsSections }) {
  const hero = sectionByKey(cmsSections, "hero");
  const stepsSection = sectionByKey(cmsSections, "steps");
  const processSteps = stepsSection?.cards?.length
    ? stepsSection.cards.map(([step, text]) => [step, text])
    : tradeWorkFlow;

  return (
    <div className="financeDetailPage">
      <section className="detailHero">
        <div className="detailHeroInner">
          <p className="eyebrow">{hero?.eyebrow ?? "How We Work"}</p>
          <h1>{hero?.title ?? "A coordinated path from trade request to file completion."}</h1>
          <p className="lead">
            {hero?.text ??
              "Each request follows a defined workflow — assessed, routed, and tracked until documents and payments are confirmed."}
          </p>
        </div>
      </section>

      <section className="detailSection detailLight">
        <div className="sectionInner">
          <div className="holdingSectionHeader">
            <div>
              <p className="eyebrow">{stepsSection?.eyebrow ?? "The Five Steps"}</p>
              <h2>{stepsSection?.title ?? "How a broad trade question becomes a tracked coordination task."}</h2>
            </div>
            <p>{stepsSection?.text || "The desk does not forward requests — it maps them. Every incoming file is assessed before being assigned to the right service line."}</p>
          </div>
          <div className="holdingFlow">
            {processSteps.map(([step, text], index) => (
              <article key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="detailSection detailDark">
        <div className="sectionGrid">
          <div>
            <p className="eyebrow">After You Submit</p>
            <h2>What happens once the desk receives your request.</h2>
          </div>
          <div className="missionCopy">
            <p>
              After the request is submitted, the desk begins with Assessment — reviewing what documents are in place, what payment or currency question exists, and which service line should take the first step.
            </p>
            <p>
              You will receive a follow-up once the file has been mapped. The desk does not commit to timelines before understanding the full scope of the request.
            </p>
            <p>
              For complex files that span goods, documents, and payments, the desk escalates to a full coordination review before routing to specialist teams.
            </p>
            <p>
              For requests submitted with complete context — goods type, origin, destination, document status, and payment timeline — the desk typically completes Assessment and Routing within the first business day.
            </p>
          </div>
        </div>
      </section>

      <section className="detailSection detailLight">
        <div className="sectionGrid">
          <div>
            <p className="eyebrow">File Tracking</p>
            <h2>Every open file stays tracked through to completion.</h2>
          </div>
          <div className="missionCopy">
            <p>
              The desk maintains a follow-up path for every active file — monitoring document status, payment confirmation, and shipment milestones in one place.
            </p>
            <p>
              No handoff without context. When a file moves between service lines, the coordination notes travel with it so the next team knows the status before starting.
            </p>
            <p>
              Supplier or carrier delays are flagged when they affect document or payment deadlines. The desk escalates to the relevant party — carrier, customs broker, or payment counterparty — without waiting for the client to report the blockage.
            </p>
            <p>
              When a file closes, the summary is retained: confirmed documents, settled payments, final timeline. If a follow-on request arrives for the same trade route or counterparty, the desk has context from the prior file.
            </p>
          </div>
        </div>
      </section>

      <section className="detailSection detailDark">
        <div className="sectionInner">
          <div className="holdingSectionHeader">
            <div>
              <p className="eyebrow">What to Include</p>
              <h2>Faster assessment starts with a complete request.</h2>
            </div>
            <p>You do not need every document before submitting. The more context you include at intake, the faster the desk can move from Assessment to Routing.</p>
          </div>
          <div className="needsGrid">
            <div className="needsItem">
              <h3>Import or export</h3>
              <ul className="needsList">
                <li>Goods type and HS code, if known</li>
                <li>Origin and destination country</li>
                <li>Supplier or buyer name and contact</li>
                <li>Current document status</li>
                <li>Preferred delivery or clearance timeline</li>
              </ul>
            </div>
            <div className="needsItem">
              <h3>Shipping documents</h3>
              <ul className="needsList">
                <li>Documents already in place</li>
                <li>Documents missing or incorrect</li>
                <li>Customs reference or cargo release number</li>
                <li>Cargo release deadline</li>
                <li>Port and carrier details</li>
              </ul>
            </div>
            <div className="needsItem">
              <h3>FX and payments</h3>
              <ul className="needsList">
                <li>Currency pair and amount</li>
                <li>Counterparty name and bank</li>
                <li>Invoice or trade reference</li>
                <li>Settlement deadline</li>
                <li>Purpose of payment or goods connection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="detailCta">
        <div className="detailCtaInner">
          <h2>Start a trade request today.</h2>
          <p>Describe your goods, origin, destination, document status, and payment need. The desk will assess and route.</p>
          <div className="actions">
            <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
              Send a Trade Request <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button type="button" className="secondaryButton" onClick={() => navigate("/standards")}>
              View Operating Standards
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
