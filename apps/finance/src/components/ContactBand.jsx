import { Home, Mail, Phone, Send } from "lucide-react";
import { Reveal } from "./Reveal.jsx";

export function ContactBand({ labels, detail, pageHref, pageTitle, handleSubmit, status }) {
  return (
    <section className="contactBand layoutSection" id="contact">
      <div className="contactInner">
        <Reveal>
          <div>
            <p className="eyebrow">{labels.contact}</p>
            <h2>{pageHref === "/contact" ? pageTitle : labels.inquiry}</h2>
            <p>{detail.contact}</p>
            <div className="contactRows">
              <span><Mail size={18} aria-hidden="true" /> info@example.com</span>
              <span><Phone size={18} aria-hidden="true" /> +968 00 000 0000</span>
              <span><Home size={18} aria-hidden="true" /> Muscat, Sultanate of Oman</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form className="inquiryForm" onSubmit={handleSubmit}>
            <input name="name" placeholder={labels.name} required />
            <input name="email" placeholder={labels.email} type="email" />
            <input name="phone" placeholder={labels.phone} />
            <textarea name="message" placeholder={labels.message} required rows="5" />
            <button className="primaryButton flex items-center justify-center" type="submit">
              <Send size={18} aria-hidden="true" />
              {labels.submit}
            </button>
            {status && <p className="formStatus">{status}</p>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
