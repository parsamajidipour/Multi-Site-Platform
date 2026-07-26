import { Reveal, RevealStagger, RevealItem } from "./Reveal.jsx";

export function PagesBand({ labels, pages, pageHref, navigate, iconMap }) {
  return (
    <section className="pagesBand layoutSection">
      <div className="sectionInner">
        <Reveal>
          <p className="eyebrow">{labels.pages}</p>
          <h2>{labels.pages}</h2>
        </Reveal>

        <RevealStagger className="pageCards" staggerChildren={0.06}>
          {pages.map((item, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <RevealItem key={item[1]}>
                <a
                  className={item[1] === pageHref ? "pageCard active" : "pageCard"}
                  href={item[1]}
                  onClick={(e) => { e.preventDefault(); navigate(item[1]); }}
                >
                  <Icon size={22} aria-hidden="true" />
                  <h3>{item[3]}</h3>
                  <p>{item[4]}</p>
                </a>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
