import React from 'react';
import { capabilities } from '../data/siteContent.js';
import { Arrow, Link, TypedText } from './UI.jsx';
import ArtHero from './ArtHero.jsx';

/** What We Do hero: the wave banner with a chip for each of the four disciplines. */
export default function WhatWeDoHero() {
  return <ArtHero
    art="wave"
    title={<>Make complexity<TypedText phrases={['move forward', 'become clear', 'scale with confidence', 'turn into advantage']} /></>}
    text="Scalric brings technology, consulting and innovation together to help organizations make progress on consequential challenges."
    chips={capabilities.map((item) => [item.title, item.href])}
  >
    <a href="#capability-overview" className="button button-green">Explore capabilities <Arrow diagonal /></a>
    <Link href="/contact" className="btn-talk"><span>Talk to us</span><i aria-hidden="true">→</i></Link>
  </ArtHero>;
}
