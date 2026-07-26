import { RevealScrub, RevealStagger, RevealItem, Parallax } from "./Reveal.jsx";

export function ProcessBand({ labels, detailProcess }) {
  return (
    <section className="processBand layoutSection">
      <div className="sectionInner">
        <RevealScrub from="up">
          <div className="processBandHeader">
            <p className="eyebrow">{labels.process}</p>
            <h2>{labels.process}</h2>
          </div>
        </RevealScrub>

        <RevealStagger className="processTimeline" staggerChildren={0.13} from="left">
          {detailProcess.map((step, index) => (
            <RevealItem key={step}>
              <div className="processStep">
                <Parallax speed={-0.15}>
                  <div className="processStepNum">{String(index + 1).padStart(2, "0")}</div>
                </Parallax>
                <p className="processStepText">{step}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
