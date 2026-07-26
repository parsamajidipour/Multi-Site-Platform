import { Reveal, RevealStagger, RevealItem } from "./Reveal.jsx";

export function DeliverablesBand({ labels, pageTitle, contentDepth, iconMap }) {
  return (
    <section className="deliverablesBand layoutSection">
      <div className="sectionInner">
        <Reveal from="up">
          <p className="eyebrow">{labels.highlights}</p>
          <h2>{pageTitle} {labels.coverage}</h2>
        </Reveal>

        <RevealStagger className="deliverablePills" staggerChildren={0.07} from="pop">
          {contentDepth.deliverables.map((item, index) => {
            const Icon = iconMap[(index + 1) % iconMap.length];
            return (
              <RevealItem key={`${item.meta}-${item.title}`}>
                <div className="deliverablePill">
                  <div className="deliverablePillIcon">
                    <Icon size={15} aria-hidden="true" />
                  </div>
                  <span>{item.title}</span>
                  <em>{item.meta}</em>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
