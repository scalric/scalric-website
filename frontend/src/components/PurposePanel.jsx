import React from 'react';
import { proofStats } from '../data/siteContent.js';
import { Link, Reveal, CountUp } from './UI.jsx';

/** "Technology with purpose" banner in the KPMG "Subscribe" style: wide photo with a solid blue card overlapping its top-left corner. */
export default function PurposePanel() {
  return <section className="purpose-section" id="impact"><div className="purpose-wrap">
    <div className="purpose-media"><img src="/assets/photos/purpose-lobby.jpg" alt="" loading="lazy" decoding="async" /></div>
    <Reveal className="purpose-copy">
      <span className="purpose-eyebrow">TECHNOLOGY WITH PURPOSE</span>
      <h2>Progress should reach further</h2>
      <p>An initiative bringing discounted digital support to local businesses and pro-bono technology work to NGOs.</p>
      <div className="purpose-stats">{proofStats.map((stat) => <div key={stat.label}><b><CountUp value={stat.value} suffix={stat.suffix} /></b><span>{stat.label}</span></div>)}</div>
      <div className="purpose-actions">
        <Link href="/impact" className="purpose-btn" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'impact_teaser_click' } }))}>Explore the Impact initiative</Link>
      </div>
    </Reveal>
  </div></section>;
}
