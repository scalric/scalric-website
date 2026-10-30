import React from 'react';
import { proposedIndustries, workingPrinciples } from '../data/siteContent.js';
import { useInsights } from '../lib/posts.js';
import { Link, Arrow } from './UI.jsx';

/** Industries: six sector tiles that light up in sequence; hover to lift one. */
export function IndustriesVisual() {
  return <div className="hv hv-industries" aria-label="Industry focus areas">
    {proposedIndustries.slice(0, 6).map((item, i) => <Link key={item.title} href="/industries" className="hv-tile">
      <span className="hv-tile-n">{String(i + 1).padStart(2, '0')}</span>
      <b>{item.title}</b>
      <Arrow diagonal/>
    </Link>)}
  </div>;
}

/** Insights: a stack of perspective cards that cycle; pauses while hovered. */
export function InsightsVisual() {
  const items = useInsights().insights.slice(0, 3);
  const [front, setFront] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setFront((f) => (f + 1) % Math.max(items.length, 1)), 3200);
    return () => clearInterval(id);
  }, [paused, items.length]);
  return <div className="hv hv-insights" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {items.map((item, i) => {
      const pos = (i - front + items.length) % items.length;
      return <Link key={item.slug} href={`/insights/${item.slug}`} className={`hv-card pos-${pos}`}>
        <span>{item.category}</span>
        <b>{item.title}</b>
      </Link>;
    })}
  </div>;
}

/** Impact: rings of ripples move out from a central core, with the three steps placed around it. */
export function ImpactVisual() {
  return <div className="hv hv-impact">
    <span className="hv-ripple r1"/><span className="hv-ripple r2"/><span className="hv-ripple r3"/>
    <div className="hv-core"><b>✳</b><span>Technology with purpose</span></div>
    <span className="hv-node n0">Listen</span>
    <span className="hv-node n1">Build</span>
    <span className="hv-node n2">Learn</span>
  </div>;
}

/** Careers: slowly turning orbits around the core; the three values sit at fixed points so they stay legible. */
export function CareersVisual() {
  return <div className="hv hv-careers">
    <span className="hv-orbit o1"/><span className="hv-orbit o2"/><span className="hv-orbit o3"/>
    <div className="hv-core"><b>Good work starts</b><span>with good questions</span></div>
    <span className="hv-tag t1">Curiosity</span>
    <span className="hv-tag t2">Craft</span>
    <span className="hv-tag t3">Care</span>
  </div>;
}

/** Company: four working principles around a ring. Pick one to read it in the centre. */
export function CompanyVisual() {
  const [active, setActive] = React.useState(0);
  const [title, text] = workingPrinciples[active];
  return <div className="hv hv-company">
    <div className="hv-ring" aria-hidden="true"/>
    {workingPrinciples.map(([label], i) => {
      const angle = (i / workingPrinciples.length) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + Math.cos(angle) * 36;
      const y = 50 + Math.sin(angle) * 43;
      return <button key={label} type="button" className={`hv-pill${active === i ? ' is-on' : ''}`}
        style={{ left: `${x}%`, top: `${y}%` }} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} aria-pressed={active === i}>
        {label}
      </button>;
    })}
    <div className="hv-core hv-core-text" aria-live="polite"><b>{title}</b><span>{text}</span></div>
  </div>;
}
