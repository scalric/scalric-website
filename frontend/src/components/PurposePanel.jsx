import React from 'react';
import { Reveal } from './UI.jsx';
import { useSeen, useCountTo } from '../lib/motion.js';

// Losses in millions of dollars.
const mistakes = [
  { company: 'Target Canada', note: '2015 · loss when it left Canada', cost: 5400 },
  { company: 'Southwest Airlines', note: '2022 · holiday system breakdown', cost: 1200 },
  { company: 'Knight Capital', note: '2012 · one morning of bad code', cost: 440 },
  { company: 'Zillow Offers', note: '2021 · pricing model loss (Q3)', cost: 422 },
  { company: 'Revlon', note: '2018 · orders it could not ship', cost: 64 },
  { company: 'Hertz', note: '2018 · paid for a site it threw away', cost: 32 },
];
const biggest = Math.max(...mistakes.map((m) => m.cost));

const format = (millions) => (millions >= 1000 ? `$${(millions / 1000).toFixed(1)}B` : `$${Math.round(millions)}M`);

function MistakeCard({ item, index }) {
  const [ref, seen] = useSeen();
  const amount = useCountTo(item.cost, seen, 1500 + index * 120);
  const width = Math.max(6, Math.sqrt(item.cost / biggest) * 100);
  return <li ref={ref} className={`pw-card${seen ? ' is-in' : ''}`} style={{ '--i': index, '--w': `${width}%` }} tabIndex={0}>
    <b aria-label={format(item.cost)}><span aria-hidden="true">{format(amount)}</span></b>
    <strong>{item.company}</strong>
    <span className="pw-note">{item.note}</span>
    <i className="pw-bar" aria-hidden="true"><em /></i>
  </li>;
}

/** "Costly mistakes" panel: a yellow block with an overlapping skyscraper photo on the left, the six losses on blue. */
export default function PurposePanel() {
  return <section className="pw-section" id="costly-mistakes">
    <div className="pw-block" aria-hidden="true" />
    <div className="pw-stage">
      <Reveal className="pw-photo"><img src="/assets/photos/purpose-skyscrapers.jpg" alt="" loading="lazy" decoding="async" /></Reveal>
      <Reveal className="pw-copy" delay={100}>
        <h2>Costly mistakes:<br />what went wrong</h2>
        <p className="pw-sub">Each loss came from a tech decision made without an independent check.</p>
        <h3 className="pw-total">Six tech mistakes cost $7.6 billion</h3>
        <ul className="pw-mistakes">{mistakes.map((item, i) => <MistakeCard key={item.company} item={item} index={i} />)}</ul>
      </Reveal>
    </div>
  </section>;
}
