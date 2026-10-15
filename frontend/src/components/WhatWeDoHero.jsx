import React from 'react';
import { capabilities } from '../data/siteContent.js';
import { Link, Arrow, TypedText } from './UI.jsx';

/**
 * What We Do hero: dark grey split layout, copy on the left and a photo card on the right,
 * with a strip of the four disciplines underneath.
 */
export default function WhatWeDoHero() {
  return <section className="wwd-hero hero-whatwedo">
    <div className="wwd-grid" aria-hidden="true"/>
    <div className="container wwd-inner">
      <div className="wwd-copy">
        <span className="wwd-eyebrow"><i/>WHAT WE DO</span>
        <h1>Make complexity<TypedText phrases={["move forward.","become clear.","scale with confidence.","turn into advantage."]}/></h1>
        <p>Scalric brings technology, consulting and innovation together to help organizations make progress on consequential challenges.</p>
        <div className="wwd-actions">
          <a href="#capability-overview" className="button button-green">Explore capabilities <Arrow diagonal/></a>
          <Link href="/contact" className="button button-glass">Talk to us <Arrow diagonal/></Link>
        </div>
      </div>
      <figure className="wwd-photo">
        <img src="/assets/photos/whatwedo-hero.webp" alt="A dark, modern office with computer workstations" loading="eager" decoding="async"/>
      </figure>
    </div>
    <div className="wwd-strip">
      <div className="container wwd-strip-inner">
        {capabilities.map((item, i) => <Link key={item.title} href={item.href} className="wwd-chip"><span/>{item.title}</Link>)}
      </div>
    </div>
  </section>;
}
