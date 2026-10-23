import React from 'react';
import { tickerServices } from '../data/siteContent.js';
import { Link } from './UI.jsx';

/* Minimal 24px line icons, drawn with currentColor so CSS controls the blue. */
const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false' };
const icons = {
  ai: <svg {...iconProps}><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M10 3.5V7M14 3.5V7M10 17v3.5M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5" /><path d="M12 9.8l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" /></svg>,
  data: <svg {...iconProps}><path d="M4 20h16M7 16v-4M12 16V6M17 16v-7" /></svg>,
  cloud: <svg {...iconProps}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>,
  software: <svg {...iconProps}><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" /></svg>,
  automation: <svg {...iconProps}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M10 6.5h3.5a3 3 0 0 1 3 3V14M14.5 11.5l2 2.5 2-2.5" /></svg>,
};

/* The track holds an even number of identical sets. Animating it by -50% then lands on a visually
   identical frame, so the loop is seamless at any viewport width. Only the first set is exposed to
   assistive tech and the keyboard; the rest are decorative copies. */
const SETS = 6;
const track = (service) => window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'service_ticker_click', slug: service.id } }));

export default function ServicesTicker() {
  const [paused, setPaused] = React.useState(false);
  const items = [];
  for (let set = 0; set < SETS; set += 1) {
    tickerServices.forEach((service) => {
      const copy = set > 0;
      items.push(<li key={`${set}-${service.id}`} className="svc-item" aria-hidden={copy || undefined}>
        <Link href={service.href} className="svc-link" tabIndex={copy ? -1 : undefined} onClick={() => track(service)}>
          <span className="svc-icon">{icons[service.id]}</span>
          <span className="svc-label">{service.label}</span>
        </Link>
      </li>);
    });
  }
  return <section className={`svc-ticker${paused ? ' is-paused' : ''}`} aria-label="Our services">
    <div className="svc-viewport">
      <ul className="svc-track">{items}</ul>
    </div>
    <button type="button" className="svc-toggle" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? 'Resume services animation' : 'Pause services animation'}>
      {paused
        ? <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M5 3.2v9.6L12.6 8z" /></svg>
        : <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><rect x="4" y="3" width="2.8" height="10" rx=".8" /><rect x="9.2" y="3" width="2.8" height="10" rx=".8" /></svg>}
    </button>
  </section>;
}
