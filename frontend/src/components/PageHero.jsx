import React from 'react';

/**
 * Shared hero shell for the main section pages: dark gradient field, copy on the left, a themed
 * interactive visual on the right. `variant` sets the colour pair (see theme.css, "Section heroes").
 */
export default function PageHero({ variant, eyebrow, title, text, visual, children }) {
  return <section className={`wwd-hero hero-${variant}`}>
    <div className="wwd-grid" aria-hidden="true"/>
    <div className="wwd-orb wwd-orb-a" aria-hidden="true"/>
    <div className="wwd-orb wwd-orb-b" aria-hidden="true"/>
    <div className="container wwd-inner">
      <div className="wwd-copy">
        <span className="wwd-eyebrow"><i/>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
      <div className="ph-visual">{visual}</div>
    </div>
  </section>;
}
