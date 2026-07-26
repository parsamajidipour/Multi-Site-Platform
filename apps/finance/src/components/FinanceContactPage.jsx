import { Home, Mail, Phone, Send } from "lucide-react";

export function FinanceContactPage({ navigate, handleSubmit, status }) {
  return (
    <div className="financeDetailPage">
      <section className="detailHero">
        <div className="detailHeroInner">
          <p className="eyebrow">Contact</p>
          <h1>Send a trade request.</h1>
          <p className="lead">
            Use this form for import, export, shipping, currency transfer, or FX inquiries. Include goods type, origin, destination, document status, and payment deadline where relevant.
          </p>
        </div>
      </section>

      <section className="tradeContact detailContactSection">
        <div className="holdingContactInner">
          <div className="holdingContactInfo">
            <p className="eyebrow">Get in Touch</p>
            <h2>Trade desk contact.</h2>
            <p className="sectionIntro">
              The desk handles import-export inquiries, shipping document follow-up, and currency transfer requests. Include as much context as possible.
            </p>
            <div className="contactDetails">
              <span><Mail size={18} aria-hidden="true" /> info@example.com</span>
              <span><Phone size={18} aria-hidden="true" /> +968 00 000 0000</span>
              <span><Home size={18} aria-hidden="true" /> Muscat, Sultanate of Oman</span>
            </div>
          </div>
          <div className="holdingFormWrapper">
            <form className="holdingContactForm" onSubmit={handleSubmit}>
              <div className="formField">
                <label htmlFor="cp-name">Full Name</label>
                <input id="cp-name" name="name" type="text" placeholder="Your full name" required />
              </div>
              <div className="formRow2">
                <div className="formField">
                  <label htmlFor="cp-email">Email</label>
                  <input id="cp-email" name="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="formField">
                  <label htmlFor="cp-phone">Phone / WhatsApp</label>
                  <input id="cp-phone" name="phone" type="tel" placeholder="+968..." />
                </div>
              </div>
              <div className="formRow2">
                <div className="formField">
                  <label htmlFor="cp-service">Service Type</label>
                  <select id="cp-service" name="service">
                    <option value="">Select a service...</option>
                    <option value="trade">Import &amp; Export</option>
                    <option value="shipping">Shipping Documents</option>
                    <option value="currency">Currency Transfer</option>
                    <option value="fx">Foreign Exchange</option>
                    <option value="general">General Trade Inquiry</option>
                  </select>
                </div>
                <div className="formField">
                  <label htmlFor="cp-country">Country</label>
                  <input id="cp-country" name="country" type="text" placeholder="Your country" />
                </div>
              </div>
              <div className="formField">
                <label htmlFor="cp-message">Message</label>
                <textarea
                  id="cp-message"
                  name="message"
                  rows={5}
                  placeholder="Describe your trade request: cargo type, origin, destination, document status, payment need, and timeline."
                  required
                />
              </div>
              <button className="primaryButton contactSubmitBtn" type="submit">
                <Send size={18} aria-hidden="true" />
                Send Trade Request
              </button>
              {status && <p className="formStatus holdingFormStatus">{status}</p>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
