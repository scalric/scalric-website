import React from 'react';
import { Link, Reveal } from './UI.jsx';

/** Closing call to action in the KPMG "career" style: wide team photo with a solid blue card overlapping its bottom-right corner, quiet text links beneath. */
export default function ContactBand() {
  return <section className="contact-band"><div className="contact-band-wrap">
    <div className="contact-band-stage">
      <div className="contact-band-media"><img src="/assets/photos/contact-team.jpg" alt="Colleagues talking around a table" loading="lazy" decoding="async" /></div>
      <Reveal className="contact-band-card">
        <span className="contact-band-eyebrow">START A CONVERSATION</span>
        <h2>What could we make possible?</h2>
        <p>Bring us the challenge you’re working through. We’ll bring curiosity and a clear point of view.</p>
        <Link href="/contact" className="contact-band-btn">Talk to us</Link>
      </Reveal>
    </div>
    <nav className="contact-band-links" aria-label="Explore Scalric">
      <Link href="/what-we-do">OUR SERVICES</Link><Link href="/industries">INDUSTRIES</Link><Link href="/insights">INSIGHTS</Link><Link href="/company">COMPANY</Link><Link href="/careers">CAREERS</Link>
    </nav>
  </div></section>;
}
