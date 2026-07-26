import { RevealScrub, RevealStagger, RevealItem, Parallax } from "./Reveal.jsx";

export function SignatureBand({ signature }) {
  return (
    <section className="signatureBand layoutSection">
      <div className="sectionInner">
        <RevealScrub from="left">
          <div className="signatureHeader">
            <div>
              <p className="eyebrow">{signature.eyebrow}</p>
              <h2>{signature.title}</h2>
            </div>
            <p>{signature.intro}</p>
          </div>
        </RevealScrub>

        <RevealStagger className="metricRail" staggerChildren={0.12} from="scale">
          {signature.metrics.map(([value, label]) => (
            <RevealItem key={`${value}-${label}`}>
              <article className="metricCard">
                <Parallax speed={-0.08} className="metricParallax">
                  <strong>{value}</strong>
                </Parallax>
                <span>{label}</span>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>

        <RevealStagger className="laneGrid" staggerChildren={0.09} from="up">
          {signature.lanes.map(([laneTitle, laneText], index) => (
            <RevealItem key={laneTitle}>
              <article className="laneCard">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{laneTitle}</h3>
                <p>{laneText}</p>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
