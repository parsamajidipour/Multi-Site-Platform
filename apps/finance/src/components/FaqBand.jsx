import { Reveal, RevealStagger, RevealItem } from "./Reveal.jsx";
import { ChevronDown } from "lucide-react";

export function FaqBand({ pageTitle, contentDepth, labels, brand, cmsQuestions }) {
  const title = labels?.faq || "FAQ";
  const intro = contentDepth.narrative?.[0]?.text;
  const questions = cmsQuestions?.length ? cmsQuestions : contentDepth.questions;

  return (
    <section className="faqBand layoutSection">
      <div className="sectionInner">
        <div className="faqLayout">
          <Reveal from="up">
            <aside className="faqIntroPanel">
              <div className="faqIntroImage">
                <img className="filter brightness-[1.5] contrast-[.9] saturate-[2.08]" src={brand?.logoStacked} alt="" aria-hidden="true" />
              </div>
              <p className="eyebrow">{labels?.faq || "FAQ"}</p>
              <h2>{title}</h2>
              {intro && <p>{intro}</p>}
            </aside>
          </Reveal>

          <RevealStagger className="faqList" staggerChildren={0.10} from="scale">
            {questions.map((item) => (
              <RevealItem key={item.title}>
                <details className="faqItem" open>
                  <summary>
                    <h3>{item.title}</h3>
                    <ChevronDown size={18} aria-hidden="true" />
                  </summary>
                  <p>{item.text}</p>
                </details>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
