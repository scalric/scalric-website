import React from 'react';
import { Link } from './UI.jsx';
import { topics } from '../data/siteContent.js';

/** Per-page art: which abstract image to use, how it is framed, the default eyebrow and the glass chips that float beside the copy. */
const ART = {
  wave: { src: '/assets/photos/art-wave.png', eyebrow: 'WHAT WE DO' },
  ripple: { src: '/assets/photos/art-ripple.png', eyebrow: 'INDUSTRIES', tone: 'light', chips: [['Financial services', '/industries#financial-services'], ['Healthcare & life sciences', '/industries#healthcare'], ['Manufacturing', '/industries#manufacturing']] },
  teal: { src: '/assets/photos/art-teal.png', eyebrow: 'INDUSTRIES', chips: [['Financial services', '/industries#financial-services'], ['Healthcare & life sciences', '/industries#healthcare'], ['Manufacturing', '/industries#manufacturing']] },
  stripes: { src: '/assets/photos/art-stripes.png', eyebrow: 'INSIGHTS', chips: topics.slice(0, 4).map((topic) => [topic, `/insights?topic=${encodeURIComponent(topic)}`]) },
  glass: { src: '/assets/photos/art-glass.png', eyebrow: 'COMPANY', tone: 'light', chips: [['Our approach', '/company#approach'], ['Impact', '/impact'], ['Careers', '/careers']] },
  peach: { src: '/assets/photos/art-peach.png', eyebrow: 'COMPANY', tone: 'light', chips: [['Our approach', '/company#approach'], ['Impact', '/impact'], ['Careers', '/careers']] },
  arcs: { src: '/assets/photos/art-arcs.png', eyebrow: 'CAREERS', chips: [['Life at Scalric', '/careers#life'], ['How we hire', '/careers#how-we-hire'], ['Open roles', '/careers/openings']] },
  ribbon: { src: '/assets/photos/art-ribbon.png', eyebrow: 'CAREERS', tone: 'light', chips: [['Life at Scalric', '/careers#life'], ['How we hire', '/careers#how-we-hire'], ['Open roles', '/careers/openings']] },
  orbit: { src: '/assets/photos/art-orbit.png', eyebrow: 'THE IMPACT INITIATIVE', tone: 'light', chips: [['How the programme works', '#how'], ['Talk to us', '/contact']] },
  wave2: { src: '/assets/photos/art-wave.png', eyebrow: 'THE IMPACT INITIATIVE', chips: [['How the programme works', '#how'], ['Talk to us', '/contact']] },
};

/**
 * Page banner built on a full-bleed abstract image. The image stays still; only the copy and chips fade in once on load.
 */
export default function ArtHero({ art = 'wave', eyebrow, title, text, children, chips }) {
  const config = ART[art] || ART.wave;
  const list = chips || config.chips || [];
  return <section className={`ah ah-${art}${config.tone === 'light' ? ' ah-light' : ''}`}>
    <div className="ah-bg" aria-hidden="true"><img src={config.src} alt="" fetchpriority="high" decoding="async" /></div>
    <div className="ah-shade" aria-hidden="true" />
    <div className="container ah-inner">
      <div className="ah-copy">
        <span className="ah-eyebrow"><i />{eyebrow || config.eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
        {children && <div className="ah-actions">{children}</div>}
      </div>
      {list.length > 0 && <ul className="ah-chips" aria-label="Quick links">{list.map(([label, href], i) => <li key={label} style={{ '--d': i }}>
        {label === 'Talk to us' ? <Link href={href} className="ah-yellow"><span>{label}</span><i aria-hidden="true">→</i></Link> : href.startsWith('#') ? <a href={href}>{label}<span aria-hidden="true">↗</span></a> : <Link href={href}>{label}<span aria-hidden="true">↗</span></Link>}
      </li>)}</ul>}
    </div>
  </section>;
}
