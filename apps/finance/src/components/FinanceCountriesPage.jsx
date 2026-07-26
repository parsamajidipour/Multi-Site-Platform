import { ArrowRight, Banknote, CheckCircle2, FileCheck2, MapPinned, Route, ShipWheel, Truck } from "lucide-react";

const countryCards = [
  {
    title: "Sultanate of Oman",
    meta: "Coordination base",
    flagImage: "https://flagcdn.com/w640/om.png",
    text: "Customs context, delivery timing, business follow-up, and payment coordination for Gulf-linked trade files.",
  },
  {
    title: "Turkey",
    meta: "Supplier route",
    flagImage: "https://flagcdn.com/w640/tr.png",
    text: "Supplier communication, export readiness, shipment documents, and commercial follow-up for Turkey-linked requests.",
  },
  {
    title: "Iran",
    meta: "Market context",
    flagImage: "https://flagcdn.com/w640/ir.png",
    text: "Practical routing for inquiries involving Iranian suppliers, buyers, paperwork, or cross-border market context.",
  },
  {
    title: "China",
    meta: "Sourcing origin",
    flagImage: "https://flagcdn.com/w640/cn.png",
    text: "Sourcing and shipment coordination where product origin, supplier readiness, and export documents need clarity.",
  },
];

const routeChecks = [
  [MapPinned, "Origin and destination", "The desk starts by confirming where goods, documents, and payments begin and where they need to land."],
  [Truck, "Shipment route", "Cargo movement, carrier expectations, delivery timing, and customs handoffs are reviewed as one file."],
  [FileCheck2, "Document status", "Invoices, packing lists, certificates, customs references, and missing papers are checked before commitments."],
  [Banknote, "Payment route", "Currency, amount, counterparty, settlement deadline, and payment reference are mapped with the trade context."],
];

const routeSteps = [
  ["01", "Origin", "Supplier, goods, and source papers."],
  ["02", "Transit", "Carrier, port, and customs timing."],
  ["03", "Destination", "Buyer, clearance, and delivery context."],
  ["04", "Payment", "Currency, invoice, and settlement date."],
];

const requestChecklist = [
  "Goods or product category",
  "Origin and destination countries",
  "Supplier / buyer contact context",
  "Available invoices or shipping papers",
  "Currency pair, amount, and payment deadline",
];

export function FinanceCountriesPage({ navigate }) {
  return (
    <div className="financeDetailPage countriesPage">
      <section className="countriesHero">
        <div className="countriesHeroInner">
          <div className="countriesHeroCopy">
            <p className="eyebrow">Countries</p>
            <h1>Country coverage designed around live trade routes.</h1>
            <p className="lead">
              Origin, destination, supplier country, buyer country, documents, and payment route are reviewed together before a request is routed.
            </p>
            <div className="countriesHeroActions">
              <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
                Map My Route <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button type="button" className="secondaryButton" onClick={() => navigate("/services")}>
                View Services
              </button>
            </div>
          </div>

          <div className="countriesRoutePanel" aria-label="Trade route model">
            <div className="routePanelHeader">
              <Route size={22} aria-hidden="true" />
              <span>Route-first review</span>
            </div>
            <div className="routeTimeline">
              {routeSteps.map(([number, title, text]) => (
                <article key={title}>
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="countriesCoverageSection">
        <div className="sectionInner">
          <div className="countriesSectionHeader">
            <div>
              <p className="eyebrow">Route Context</p>
              <h2>Country support is organized by the actual commercial movement.</h2>
            </div>
            <p>
              The desk does not treat a country as a simple label. It checks the route, documents, counterparties, timing, and settlement context as one operational file.
            </p>
          </div>

          <ul className="countryAccordion" aria-label="Country coverage accordion">
            {countryCards.map(({ title, meta, flagImage, text }) => (
              <li className="countryAccordionItem" key={title} tabIndex={0}>
                <img className="countryFlagImage" src={flagImage} alt={`${title} flag`} loading="lazy" />
                <div className="countryAccordionCopy">
                  <span className="countryAccordionMeta">{meta}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="countriesOpsSection">
        <div className="sectionInner">
          <div className="countriesSectionHeader countriesSectionHeaderDark">
            <div>
              <p className="eyebrow">What We Check</p>
              <h2>Country coverage depends on documents, route, and payment clarity.</h2>
            </div>
            <p>Good country inquiries include enough detail to understand the actual commercial movement.</p>
          </div>

          <div className="countryOpsGrid">
            {routeChecks.map(([Icon, title, text]) => (
              <article key={title}>
                <span><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="countriesSubmitSection">
        <div className="countriesSubmitCard">
          <div className="countriesSubmitCopy">
            <p className="eyebrow">Before You Submit</p>
            <h2>Send the route, goods, documents, and timing in one message.</h2>
            <p>
              If more than one country is involved, describe each side clearly so the desk can separate supplier, buyer, shipping, and settlement responsibilities.
            </p>
          </div>
          <div className="countriesChecklist">
            {requestChecklist.map((item) => (
              <div key={item}>
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detailCta">
        <div className="detailCtaInner">
          <h2>Start with the country context.</h2>
          <p>Share the route and current file status, and the desk will map the right follow-up path.</p>
          <div className="actions">
            <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
              Send a Trade Request <ShipWheel size={15} aria-hidden="true" />
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
