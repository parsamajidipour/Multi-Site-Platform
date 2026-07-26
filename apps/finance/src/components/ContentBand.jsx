import { CheckCircle2 } from "lucide-react";
import { RevealScrub, RevealStagger, RevealItem } from "./Reveal.jsx";

export function ContentBand({ labels, pageLabel, contentDepth }) {
  return (
    <section className="contentBand layoutSection">
      <div className="sectionInner">
        <div className="contentBandLayout">
          <RevealScrub from="left">
            <div className="contentBandLeft">
              <p className="eyebrow">{pageLabel}</p>
              <h2>{contentDepth.narrative[0].title}</h2>
              <p className="contentBandDesc">{contentDepth.narrative[0].text}</p>
            </div>
          </RevealScrub>

          <RevealStagger className="checkGrid" staggerChildren={0.07} from="up">
            {contentDepth.checklist.map((item) => (
              <RevealItem key={item}>
                <div className="checkGridItem">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
