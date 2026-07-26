import {
  ClipboardCheck,
  FileText,
  Globe2,
  ShieldCheck,
  Truck,
} from "lucide-react";

export const financeServices = [
  {
    title: "Import & Export",
    meta: "Sourcing, shipping, and trade flow",
    text: "Commercial coordination for suppliers, buyers, product movement, and trade documentation from inquiry to shipment readiness.",
    guidance: "Use this service when the request involves product sourcing, supplier contact, cross-border goods movement, or an import or export document question.",
    scenario: "A supplier in Turkey has confirmed a textile shipment for Muscat. The buyer needs the desk to coordinate customs paperwork, supplier communication, and the payment path before the cargo moves.",
    href: "/import-export",
    Icon: Truck,
  },
  {
    title: "Shipping Documents",
    meta: "Paperwork that keeps cargo moving",
    text: "Invoice, packing list, certificate, bill of lading, and customs document follow-up for cross-border operations.",
    guidance: "Use this service when the shipment is ready but the paperwork is missing, incomplete, or needs official follow-up before customs clearance.",
    scenario: "A bill of lading has been issued but the packing list carries the wrong HS code. The cargo is at port, customs will not release it, and the consignee's deadline is in 48 hours.",
    href: "/shipping",
    Icon: FileText,
  },
  {
    title: "FX & Payment Coordination",
    meta: "Currency timing and transfer support",
    text: "Practical coordination for currency needs, payment references, settlement timing, and trade-linked transfers.",
    guidance: "Use this service when currency conversion, a trade-linked payment, an invoice settlement, or an international money transfer is part of the commercial move.",
    scenario: "An invoice for EUR 140,000 needs to settle before a supplier releases a consignment. The buyer is in the Gulf, the seller is in Germany, and a compliant payment reference is required.",
    href: "/currency-transfer",
    Icon: ShieldCheck,
  },
];

export const financeHeroStats = [
  ["3", "Service lines", "Import-export coordination, shipping document follow-up, and FX payment support — each with its own inquiry path."],
  ["24h", "Document triage", "Trade file review starts within the business day for requests with clear cargo and payment context."],
  ["Multi", "Market coverage", "Operational coordination across Gulf, Turkey, Iran, and international sourcing and shipping routes."],
];

export const tradeWhyPoints = [
  ["Trade files cross service lines", "A single shipment can involve sourcing, customs papers, and a currency transfer. One coordinated path avoids handoff gaps."],
  ["Document timing drives everything", "Invoices, certificates, and customs papers all have deadlines. The desk keeps follow-up anchored to the trade file."],
  ["Currency and cargo move together", "FX timing, payment references, and settlement milestones are coordinated alongside the shipment, not after."],
];

export const tradeStructureItems = [
  [Globe2, "Trade Desk Coordination", "The trade desk is the central entry point — it maps the full request across goods origin, destination, document status, and payment needs before routing to the right service line."],
  [Truck, "Import & Export", "Sourcing, supplier communication, buyer coordination, and cross-border product movement for import and export requests."],
  [FileText, "Shipping Documents", "Commercial invoices, packing lists, certificates of origin, bills of lading, and customs papers — all followed up inside one file."],
  [ShieldCheck, "FX & Payment", "Currency pair coordination, transfer timing, invoice settlement, and payment references connected directly to the trade file."],
  [ClipboardCheck, "Complex File Oversight", "Requests that combine goods, documents, currency, and multiple counterparties are escalated to a full coordination review before any commitment is made."],
];

export const tradeWorkFlow = [
  ["Request", "The buyer, seller, or coordinator describes the goods, origin, destination, timeline, and the paperwork or payment question that needs handling."],
  ["Assessment", "The desk maps what documents are ready, what currency or payment is needed, and which service line owns the most urgent next step."],
  ["Routing", "The request is assigned to import-export, shipping, or FX coordination based on what is missing or time-sensitive."],
  ["Coordination", "The specialist team follows up on documents, shipment status, supplier contact, or payment timing until the file is clear."],
  ["Completion", "The trade file is handed back with documents confirmed, payments settled, and the next request logged if needed."],
];

export const tradeStandards = [
  [ShieldCheck, "Document Discipline", "Every shipment request should include the invoice, packing list, certificate, and customs reference before the file is considered ready for movement."],
  [ClipboardCheck, "Payment Clarity", "Currency transfer and FX requests must include amount, currency pair, counterparty, and settlement deadline before any timing is committed."],
  [Truck, "Route Accountability", "Origin, destination, carrier, and delivery expectation are confirmed at intake — not discovered mid-shipment."],
  [FileText, "Consistent Follow-up", "The desk tracks each open file through a defined path so no document or payment step is left unaccounted before the case closes."],
];

export const financeHomeNavItems = [
  ["Home", "home"],
  ["About", "about"],
  ["Services", "services"],
  ["Process", "process"],
  ["Standards", "standards"],
  ["Countries", "countries"],
  ["Contact", "contact"],
];
