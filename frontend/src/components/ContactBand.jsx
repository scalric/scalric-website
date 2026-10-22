import React from 'react';
import { Link, Arrow, Reveal } from './UI.jsx';

/** Closing call to action: copy on the left, the Insights banner artwork in a rounded box on the right, quiet text links at the edges. */
export default function ContactBand() {
  return <section className="cb-section"><div className="container cb-stage">
    <Reveal className="cb-copy">
      <span className="cb-eyebrow">START A CONVERSATION</span>
      <h2><span className="cb-lead">What could we</span><span className="cb-big">make possible?</span></h2>
      <p>Bring us the challenge you’re working through. We’ll bring curiosity and a clear point of view.</p>
      <Link href="/contact" className="btn-talk"><span>Talk to us</span><i aria-hidden="true">→</i></Link>
    </Reveal>
    <Reveal className="cb-box" delay={120}>
      <img src="/assets/photos/art-stripes.png" alt="" loading="lazy" decoding="async" />
    </Reveal>
    <nav className="cb-links cb-links-left" aria-label="Explore"><Link href="/what-we-do">OUR SERVICES</Link><Link href="/industries">INDUSTRIES</Link></nav>
    <nav className="cb-links cb-links-right" aria-label="More"><Link href="/insights">INSIGHTS</Link><Link href="/company">COMPANY</Link><Link href="/careers">CAREERS</Link></nav>
  </div></section>;
}
