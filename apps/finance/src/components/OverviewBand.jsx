import { RevealScrub, RevealStagger, RevealItem } from "./Reveal.jsx";

export function OverviewBand({ labels, pageTitle, detail, detailCards, iconMap }) {
  return (
    <section className="overviewBand layoutSection">
      <div className="sectionGrid">
        <RevealScrub from="left">
          <div>
            <p className="eyebrow">{labels.overview}</p>
            <h2>{pageTitle}</h2>
            <p>{detail.overview}</p>
          </div>
        </RevealScrub>

        <RevealStagger className="overviewCardGrid" staggerChildren={0.10} from="scale">
          {detailCards.map(([cardTitle, cardText], index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <RevealItem key={cardTitle}>
                <article className="overviewCard">
                  <div className="overviewCardIcon">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3>{cardTitle}</h3>
                  <p>{cardText}</p>
                </article>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
