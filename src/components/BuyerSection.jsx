import React from 'react';
import { buyerCountries, buyerMarkets, buyerPersonas } from '../data/research.js';
import { Eyebrow, Link, Reveal } from './UI.jsx';
import { Count, Ring } from './ResearchViz.jsx';

// One glyph per row of buyerMarkets, in the same order.
const rowIcons = ['◎', '▦', '⌕', '§', '★'];

/** Industries page: who buys, plus a per-country go-to-market view. */
export default function BuyerSection() {
  const [country, setCountry] = React.useState(0);
  return <section className="section rs-buyers" id="who-buys"><div className="container">
    <Reveal className="rs-head">
      <Eyebrow>WHO WE HELP</Eyebrow>
      <h2>Owner-led businesses that already invest in growth</h2>
      <p>Teams of 5–200 who pay for ads, delivery apps or booking sites and still lose leads.</p>
    </Reveal>
    <div className="rs-personas">{buyerPersonas.map(([role, markets, quote, stat, label, offer], i) => <Reveal key={role} delay={i * 70}>
      <article className="rs-persona">
        <header><span className="rs-persona-no">0{i + 1}</span><b>{role}</b><span>{markets}</span></header>
        <div className="rs-persona-body">
          <q>{quote}</q>
          <div className="rs-persona-stat"><Ring percent={parseFloat(stat)} size={92}><strong><Count value={stat} /></strong></Ring><small>{label}</small></div>
          <Link className="rs-offer" href="/contact"><em>First offer</em><span>{offer}</span><i aria-hidden="true">→</i></Link>
        </div>
      </article>
    </Reveal>)}</div>
    <Reveal className="rs-markets">
      <h3>How we approach each market</h3>
      <div className="rs-tabs" role="tablist" aria-label="Country">{buyerCountries.map((name, i) => <button key={name} type="button" role="tab" aria-selected={country === i} className="rs-tab" onClick={() => { setCountry(i); window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'market_tab', country: name } })); }}>{name}</button>)}</div>
      <dl className="rs-market-list" role="tabpanel" key={country}>{buyerMarkets.map((row, i) => <div key={row[0]} style={{ '--i': i }}>
        <dt><span aria-hidden="true">{rowIcons[i]}</span>{row[0]}</dt><dd>{row[country + 1]}</dd>
      </div>)}</dl>
      <p className="rs-note">Law names are pointers only, not legal advice.</p>
    </Reveal>
  </div></section>;
}
