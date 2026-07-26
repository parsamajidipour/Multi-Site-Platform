import { ArrowRight, CheckCircle2, ClipboardCheck, FileText, Globe2, ShieldCheck, Truck } from "lucide-react";

const servicePages = {
  "import-export": {
    eyebrow: "Import & Export",
    title: "Commercial movement planned before cargo starts moving.",
    lead: "A focused route for product sourcing, supplier communication, buyer coordination, export readiness, and import follow-up when the request is still forming or already time-sensitive.",
    badge: "Trade flow",
    metric: "01",
    accent: "Sourcing to shipment readiness",
    Icon: Truck,
    outcomes: ["Supplier and buyer context mapped", "Origin, destination, and goods profile clarified", "Document and payment dependencies flagged"],
    steps: [
      ["Request mapping", "The desk starts by separating the product, supplier, buyer, destination, quantity, specification, and timing. This prevents the conversation from becoming a vague import or export request and turns it into a trade file with a clear commercial route."],
      ["Counterparty coordination", "Supplier or buyer communication is framed around what is ready, what is missing, and what has to be confirmed before cargo movement. If the request involves a new supplier, the desk keeps the first exchange focused on product readiness, documents, payment expectations, and delivery terms."],
      ["Readiness review", "Before cargo moves, the file is reviewed for document dependencies, route expectations, and payment timing. The goal is to avoid a situation where goods are technically ready but the commercial paperwork, buyer instructions, or settlement path is still unclear."],
    ],
    briefs: [
      ["When this service is the right fit", "Use this service when the core question is commercial movement: finding or communicating with a supplier, preparing an export, planning an import, matching a buyer request with a product source, or understanding which documents and payment steps must be settled before goods move."],
      ["What makes the first message useful", "A strong request includes the product name, specifications, quantity, origin, destination, target delivery window, supplier or buyer status, and any available invoice, quotation, catalogue, packing detail, or draft contract. Even partial information helps the desk separate sourcing work from logistics or payment work."],
      ["How the desk reads the case", "The request is not treated as a single question. It is read as an operational chain: what is being bought or sold, who is responsible, where the goods start, where they must arrive, what papers exist, what money movement is attached, and which deadline controls the next step."],
    ],
  },
  shipping: {
    eyebrow: "Shipping Documents",
    title: "Documents arranged around the actual shipment deadline.",
    lead: "A document-first page for invoices, packing lists, certificates, bills of lading, customs papers, and follow-up when cargo is ready but paperwork is blocking movement.",
    badge: "Document control",
    metric: "02",
    accent: "Paperwork that keeps cargo moving",
    Icon: FileText,
    outcomes: ["Missing papers identified", "Customs and release context organized", "Document corrections routed before delay grows"],
    steps: [
      ["Document audit", "Available papers are checked against the cargo, route, consignee, and destination authority requirements. The review looks for mismatched names, quantities, HS codes, dates, certificate references, and missing supporting papers that may block customs or carrier release."],
      ["Gap handling", "Missing, inconsistent, or outdated documents are separated by urgency so follow-up can happen in the right order. A wrong packing list, a missing certificate, and a carrier instruction do not carry the same risk, so the desk identifies what can wait and what must be corrected immediately."],
      ["Release support", "The document thread stays connected to cargo status, port timing, customs questions, and carrier requirements. The purpose is to keep paperwork from becoming a separate conversation that no longer matches the shipment deadline."],
    ],
    briefs: [
      ["When this service is the right fit", "Use this service when cargo, customs, or carrier movement depends on paperwork. Typical cases include missing invoices, inconsistent packing lists, certificate of origin requests, bill of lading follow-up, wrong consignee data, HS code issues, or documents that need to be corrected before release."],
      ["What makes the first message useful", "Send the invoice, packing list, bill of lading or draft, certificate references, HS code if known, origin, destination, carrier status, port or warehouse location, and the release deadline. If a customs broker, supplier, or consignee has already raised a question, include the exact wording."],
      ["How the desk reads the case", "A shipping document is not just an attachment. It is part of the movement of the cargo. The desk checks whether the paper matches the goods, the route, the party receiving the cargo, and the authority or carrier that controls the next release step."],
    ],
  },
  "currency-transfer": {
    eyebrow: "FX & Payment Coordination",
    title: "Payment timing connected to the trade file.",
    lead: "A coordination route for trade-linked payments, supplier settlement, currency transfer timing, payment references, invoice context, and foreign-exchange questions tied to commercial movement.",
    badge: "Payment route",
    metric: "03",
    accent: "Currency timing and settlement support",
    Icon: ShieldCheck,
    outcomes: ["Invoice and payment purpose clarified", "Currency pair and deadline recorded", "Settlement timing aligned with supplier or shipment milestones"],
    steps: [
      ["Payment context", "The amount, currency pair, invoice purpose, counterparty, and country context are collected before any follow-up begins. This keeps the request tied to a real commercial reason instead of a general exchange-rate or transfer question."],
      ["Trade link review", "The desk checks whether the payment depends on supplier release, shipment movement, document approval, service settlement, or another business deadline. If the payment is part of a shipment, it is reviewed alongside the cargo and paperwork rather than as an isolated transfer."],
      ["Timing coordination", "Payment references, settlement expectations, and next-step communication are aligned with the commercial deadline. The focus is on making the request understandable for follow-up: who pays, who receives, why the transfer is needed, and when the payment must be confirmed."],
    ],
    briefs: [
      ["When this service is the right fit", "Use this service for supplier payments, invoice settlements, trade-linked transfers, foreign-exchange questions, and business payments where timing matters. It is especially useful when a shipment, document release, supplier instruction, or contract milestone depends on settlement."],
      ["What makes the first message useful", "Include the amount, currency pair, sender country, receiver country, invoice or payment purpose, beneficiary context, target date, and whether the payment is connected to cargo, services, documents, or a supplier deadline."],
      ["How the desk reads the case", "A payment request becomes much clearer when the commercial reason is visible. The desk looks at the transfer purpose, the parties involved, the timing pressure, the currency need, and the document or shipment event that depends on the payment."],
    ],
  },
};

export function FinanceServiceDetailPage({ navigate, serviceId }) {
  const page = servicePages[serviceId] || servicePages["import-export"];
  const Icon = page.Icon;

  return (
    <div className={`financeServicePage financeServicePage-${serviceId}`}>
      <section className="fsdHero">
        <div className="fsdHeroInner">
          <div className="fsdHeroCopy">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.lead}</p>
            <div className="actions">
              <button type="button" className="primaryButton" onClick={() => navigate("/contact")}>
                Start this request <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button type="button" className="secondaryButton" onClick={() => navigate("/services")}>
                Back to services
              </button>
            </div>
          </div>
          <aside className="fsdHeroPanel" aria-label={`${page.eyebrow} service summary`}>
            <div className="fsdPanelTop">
              <span>{page.badge}</span>
              <strong>{page.metric}</strong>
            </div>
            <div className="fsdIconSeal" aria-hidden="true">
              <Icon size={32} />
            </div>
            <h2>{page.accent}</h2>
            <div className="fsdOutcomeList">
              {page.outcomes.map((item) => (
                <span key={item}><CheckCircle2 size={16} aria-hidden="true" /> {item}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="fsdBriefSection">
        <div className="fsdBriefLayout">
          <div className="fsdEditorial">
            {page.briefs.map(([title, text]) => (
              <article key={title}>
                <span>{title}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fsdProcessSection">
        <div className="fsdProcessInner">
          <div className="fsdProcessHead">
            <p className="eyebrow">Service workflow</p>
            <h2>A cleaner path from first message to coordinated follow-up.</h2>
            <p>The page is built to help the visitor send a usable request: enough context to route the file, without forcing them to know every operational answer in advance.</p>
          </div>
          <div className="fsdStepList">
            {page.steps.map(([title, text], index) => (
              <article key={title}>
                <div>
                  {index === 0 && <Globe2 size={22} aria-hidden="true" />}
                  {index === 1 && <ClipboardCheck size={22} aria-hidden="true" />}
                  {index === 2 && <ShieldCheck size={22} aria-hidden="true" />}
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
