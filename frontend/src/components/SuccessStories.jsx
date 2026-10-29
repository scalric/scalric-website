import React from 'react';
import { Reveal } from './UI.jsx';
import { useSeen, useCountTo } from '../lib/motion.js';

// `low`/`high` are percentage gains; a single gain leaves `high` unset.
const wins = [
  { name: 'Bombay Shaving Co', note: 'sales rate, new store platform', low: 150 },
  { name: 'redBus', note: 'mobile sales, faster pages', low: 80, high: 100 },
  { name: 'Rakuten 24', note: 'money per visitor, speed only', low: 53 },
  { name: 'Rakuten 24', note: 'sales rate, speed only', low: 33 },
  { name: 'Nykaa', note: 'visitors from smaller cities', low: 28 },
  { name: 'Vodafone Italy', note: 'sales after faster pages', low: 8 },
];
const biggest = 150;

// Rates before and after the fix, on a 0-100% scale. Ranges are drawn at their midpoint and labelled as given.
const shifts = [
  { name: 'Ispahani Tea', note: 'Sales rate · WhatsApp shop', before: 7.5, beforeLabel: '5–10%', after: 45, afterLabel: '40–50%' },
  { name: 'Riley Plumbing', note: 'Calls booked · AI phone agent', before: 50, beforeLabel: '<50%', after: 80, afterLabel: '80%' },
  { name: '6 US health systems', note: 'Doctor burnout · AI note-taker', before: 52, beforeLabel: '52%', after: 39, afterLabel: '39%' },
  { name: '21 clinic studies', note: 'Missed visits · text reminders', before: 21, beforeLabel: '21%', after: 15, afterLabel: '15%' },
];

function WinCard({ item, index }) {
  const [ref, seen] = useSeen();
  const low = Math.round(useCountTo(item.low, seen, 1500 + index * 120));
  const high = Math.round(useCountTo(item.high || 0, seen, 1500 + index * 120));
  const top = item.high || item.low;
  const label = `+${item.low}${item.high ? `–${item.high}` : ''}%`;
  return <li ref={ref} className={`ss-card${seen ? ' is-in' : ''}`} style={{ '--i': index, '--w': `${Math.max(6, (top / biggest) * 100)}%` }} tabIndex={0}>
    <b aria-label={label}><span aria-hidden="true">+{low}{item.high ? `–${high}` : ''}%</span></b>
    <strong>{item.name}</strong>
    <span className="ss-note">{item.note}</span>
    <i className="ss-bar" aria-hidden="true"><em /></i>
  </li>;
}

function ShiftRow({ item, index }) {
  const [ref, seen] = useSeen();
  return <li ref={ref} className={`ss-row${seen ? ' is-in' : ''}`} style={{ '--i': index }}>
    <div className="ss-row-label"><strong>{item.name}</strong><span>{item.note}</span></div>
    <div className="ss-row-bars">
      <div className="ss-track"><i className="ss-before" style={{ '--w': `${item.before}%` }}><em>{item.beforeLabel}</em></i></div>
      <div className="ss-track"><i className="ss-after" style={{ '--w': `${item.after}%` }}><em>{item.afterLabel}</em></i></div>
    </div>
  </li>;
}

/** "Success stories" panel: six measured gains, then before-and-after rates for four fixes. */
export default function SuccessStories() {
  return <section className="section ss-section" id="success-stories" aria-labelledby="ss-title"><div className="container">
    <Reveal className="ss-head">
      <h2 id="ss-title">Success stories:<br />what worked</h2>
      <p className="ss-lede">Small, specific fixes created large, measured results.</p>
    </Reveal>
    <h3 className="ss-sub">Faster pages and better stores lifted results 8% to 150%</h3>
    <ul className="ss-cards">{wins.map((item, i) => <WinCard key={item.name + item.note} item={item} index={i} />)}</ul>

    <h3 className="ss-sub ss-sub-gap">Every fix moved its number the right way</h3>
    <div className="ss-legend" aria-hidden="true"><span><i className="ss-dot ss-dot-before" />before</span><span><i className="ss-dot ss-dot-after" />after</span></div>
    <ul className="ss-rows">{shifts.map((item, i) => <ShiftRow key={item.name} item={item} index={i} />)}</ul>
    <div className="ss-axis" aria-hidden="true"><span />{/* same two columns as the rows, so the ticks line up with the bars */}<div className="ss-ticks">{['0%', '25%', '50%', '75%', '100%'].map((t) => <span key={t}>{t}</span>)}</div></div>
  </div></section>;
}
