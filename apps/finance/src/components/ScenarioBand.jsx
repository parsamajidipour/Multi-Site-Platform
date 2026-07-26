import { Reveal, RevealStagger, RevealItem } from "./Reveal.jsx";

export function ScenarioBand({ labels, pageTitle, contentDepth, iconMap }) {
  return (
    <section className="scenarioBand layoutSection">
      <div className="sectionInner">
        <Reveal from="right">
          <p className="eyebrow">{labels.overview}</p>
          <h2>{labels.situations}</h2>
        </Reveal>

        <RevealStagger className="scenarioGrid" staggerChildren={0.12} from="up">
          {contentDepth.scenarios.map((item, index) => {
            const Icon = iconMap[(index + 3) % iconMap.length];
            return (
              <RevealItem key={item.title}>
                <article className="scenarioCard">
                  <Icon size={20} aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
