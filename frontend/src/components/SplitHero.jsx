import React from 'react';

/**
 * Split page hero: a narrow image strip, a solid copy panel, and a large image.
 * `tone="blue"` / `"navy"` give white type on brand blue / dark blue (`solidStrip` makes the left strip a flat colour); `tone="light"` gives black type on a pale panel.
 */
export default function SplitHero({ tone = 'light', solidStrip = false, image, alt = '', title, text, children }) {
  return <section className={`split-hero split-hero-${tone}`}>
    <div className="split-hero-strip" style={solidStrip ? undefined : { backgroundImage: `url(${image})` }} aria-hidden="true"/>
    <div className="split-hero-panel">
      <div className="split-hero-copy">
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
    </div>
    <div className="split-hero-media"><img src={image} alt={alt} width="1024" height="576" fetchpriority="high" decoding="async"/></div>
  </section>;
}
