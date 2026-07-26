import { ArrowUpRight } from "lucide-react";
import { RevealScrub, RevealStagger, RevealItem, Parallax } from "./Reveal.jsx";

export function GroupBand({ labels, groupSites }) {
  return (
    <section className="groupBand layoutSection">
      <div className="sectionInner">
        <RevealScrub from="up">
          <div className="groupBandHeader">
            <p className="eyebrow">{labels.group}</p>
            <h2>{labels.group}</h2>
          </div>
        </RevealScrub>

        <RevealStagger className="groupCardGrid" staggerChildren={0.18} from="scale">
          {groupSites.map((item, index) => (
            <RevealItem key={item.href}>
              <a
                className="groupCard"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Parallax speed={-0.12}>
                  <div className="groupCardIndex">{String(index + 1).padStart(2, "0")}</div>
                </Parallax>
                <div className="groupCardBody">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <div className="groupCardVisit">
                  <span>{labels.visit}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </div>
              </a>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
