import { Reveal, RevealStagger, RevealItem } from "./Reveal.jsx";

export function DetailBand({ labels, pageTitle, detailSummary, iconMap }) {
  return (
    <section className="detailBand layoutSection">
      <div className="sectionInner">
        <Reveal from="right">
          <p className="eyebrow">{labels.highlights}</p>
          <h2>{pageTitle}</h2>
        </Reveal>

        <RevealStagger className="detailCards" staggerChildren={0.13} from="up">
          {detailSummary.map((item, index) => {
            const Icon = iconMap[(index + 2) % iconMap.length];
            return (
              <RevealItem key={item.title}>
                <article className="detailCard">
                  <Icon size={22} aria-hidden="true" />
                  <h3 style={{ marginTop: 14 }}>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
