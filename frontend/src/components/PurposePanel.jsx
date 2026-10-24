import React from 'react';
import { proofStats } from '../data/siteContent.js';
import { Link, Reveal, CountUp } from './UI.jsx';

/** "Technology with purpose" panel: a yellow block with an overlapping skyscraper photo on the left, copy and proof stats on blue. */
export default function PurposePanel() {
  return <section className="pw-section" id="impact">
    <div className="pw-block" aria-hidden="true" />
    <div className="pw-stage">
      <Reveal className="pw-photo"><img src="/assets/photos/purpose-skyscrapers.jpg" alt="" loading="lazy" decoding="async" /></Reveal>
      <Reveal className="pw-copy" delay={100}>
        <span className="pw-eyebrow">TECHNOLOGY WITH PURPOSE</span>
        <h2>Progress should<br />reach further</h2>
        <p className="pw-sub">An initiative bringing discounted digital support to local businesses and pro-bono technology work to NGOs.</p>
        <div className="pw-stats">{proofStats.map((stat) => <div key={stat.label}><b><CountUp value={stat.value} suffix={stat.suffix} /></b><span>{stat.label}</span></div>)}</div>
        <Link href="/impact" className="pw-btn" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'impact_teaser_click' } }))}>Explore the Impact initiative</Link>
      </Reveal>
    </div>
  </section>;
}
