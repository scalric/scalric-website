import React from 'react';
import { proofStats } from '../data/siteContent.js';
import { Link, Reveal, CountUp } from './UI.jsx';

/** "Technology with purpose" panel: copy and proof stats on the left, layered translucent glass chevrons on the right. */
export default function PurposePanel() {
  return <section className="purpose-section" id="impact"><div className="container">
    <div className="purpose-card">
      <Reveal className="purpose-copy">
        <span className="purpose-eyebrow">TECHNOLOGY WITH PURPOSE</span>
        <h2>Progress should<br />reach further</h2>
        <p>An initiative bringing discounted digital support to local businesses and pro-bono technology work to NGOs.</p>
        <div className="purpose-stats">{proofStats.map((stat) => <div key={stat.label}><b><CountUp value={stat.value} suffix={stat.suffix} /></b><span>{stat.label}</span></div>)}</div>
        <div className="purpose-actions">
          <Link href="/impact" className="purpose-btn" onClick={() => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'impact_teaser_click' } }))}>Explore the Impact initiative</Link>
          <Link href="/impact" className="purpose-plus" aria-label="Explore the Impact initiative">+</Link>
        </div>
      </Reveal>
    </div>
  </div></section>;
}
