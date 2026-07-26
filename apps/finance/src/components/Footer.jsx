export function Footer({ footerPages, navigate, site, brand, labels, footerText, siteUrls }) {
  const serviceLinks = (footerPages || []).filter((item) => item && item[1] && item[1] !== "/");

  return (
    <footer className="footer">
      <div className="footerIdentity">
        <span className="footerBrand">
          <img src={brand.logoStacked} alt="" aria-hidden="true" />
          {brand.displayName}
        </span>
        <span className="footerTagline">{labels.footerTagline}</span>
        {footerText ? <span className="footerDesc">{footerText}</span> : null}
      </div>

      <nav className="footerColumn footerLinks" aria-label={labels.pages}>
        <span className="footerColumnTitle">{labels.pages}</span>
        {(footerPages || []).map((item) => (
          <a
            href={item[1]}
            key={item[1]}
            onClick={(e) => { e.preventDefault(); navigate(item[1]); }}
          >
            {item[2]}
          </a>
        ))}
      </nav>

      <nav className="footerColumn footerServices" aria-label="Finance services">
        <span className="footerColumnTitle">Services</span>
        {serviceLinks.map((item) => (
          <a
            href={item[1]}
            key={item[1]}
            onClick={(e) => { e.preventDefault(); navigate(item[1]); }}
          >
            {item[2]}
          </a>
        ))}
      </nav>

      <div className="footerColumn footerMeta">
        <span className="footerColumnTitle">Trade Desk</span>
        <span>{footerText || "Import, export, shipping documents, and currency coordination."}</span>
        {siteUrls?.mainSite ? (
          <a href={siteUrls.mainSite} rel="noreferrer">
            {labels?.group || "Rezaei Global"}
          </a>
        ) : null}
        <a
          href="/contact"
          onClick={(e) => { e.preventDefault(); navigate("/contact"); }}
        >
          Start an inquiry
        </a>
      </div>
    </footer>
  );
}
