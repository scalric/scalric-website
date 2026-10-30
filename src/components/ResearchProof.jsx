import React from 'react';
import { marketSizes, researchKpis, researchSources } from '../data/research.js';
import { Eyebrow, Reveal } from './UI.jsx';
import { Count } from './ResearchViz.jsx';

/** Home proof band: one headline market size with a country split, then five sourced numbers beside it. */
export default function ResearchProof() {
  const [lead, ...rest] = researchKpis;
  const total = marketSizes.reduce((sum, [, size]) => sum + size, 0);
  return <section className="section rs-proof" id="market-proof"><div className="container">
    <Reveal className="rs-head">
      <Eyebrow>MARKET RESEARCH</Eyebrow>
      <h2>How software, marketing and AI help businesses grow</h2>
      <p>Real numbers on what works, what fails, and who we can help across India, the US, the UK and Canada. Every number links to its source.</p>
    </Reveal>
    <div className="rs-proof-grid">
      <Reveal className="rs-lead">
        <b><Count value={lead[0]} duration={2000} /></b>
        <span>{lead[1]}</span>
        <div className="rs-split" role="img" aria-label={marketSizes.map(([n, s]) => `${n} ${s} million`).join(', ')}>
          {marketSizes.map(([name, size], i) => <i key={name} className={`rs-seg rs-seg-${i}`} style={{ flexGrow: size, '--i': i }} />)}
        </div>
        <ul className="rs-legend">{marketSizes.map(([name, size], i) => <li key={name}><i className={`rs-seg-${i}`} /><span>{name}</span><b>{size}M</b><small>{Math.round(size / total * 100)}%</small></li>)}</ul>
        <a href={researchSources[lead[2]]} target="_blank" rel="noopener noreferrer">{lead[3]} ↗</a>
      </Reveal>
      <div className="rs-kpis">{rest.map(([value, text, key, source], i) => <Reveal key={value} delay={i * 70}>
        <div className="rs-kpi"><b><Count value={value} /></b><span>{text}</span><a href={researchSources[key]} target="_blank" rel="noopener noreferrer">{source} ↗</a></div>
      </Reveal>)}</div>
    </div>
    <p className="rs-note">Industry results from public research and filings, not Scalric’s own results. October 2026.</p>
  </div></section>;
}
