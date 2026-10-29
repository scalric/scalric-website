import React from 'react';
import { researchKpis, researchSources } from '../data/research.js';
import { Eyebrow, Reveal } from './UI.jsx';

/** Home proof strip: six sourced headline numbers from the market research. */
export default function ResearchProof() {
  return <section className="section rs-proof" id="market-proof"><div className="container">
    <Reveal className="rs-head">
      <Eyebrow>MARKET RESEARCH</Eyebrow>
      <h2>How software, marketing and AI help businesses grow</h2>
      <p>Real numbers on what works, what fails, and who we can help across India, the US, the UK and Canada. Every number links to its source.</p>
    </Reveal>
    <div className="rs-kpis">{researchKpis.map(([value, text, key, source], i) => <Reveal key={value} delay={i * 60}>
      <div className="rs-kpi"><b>{value}</b><span>{text}</span><a href={researchSources[key]} target="_blank" rel="noopener noreferrer">{source} ↗</a></div>
    </Reveal>)}</div>
    <p className="rs-note">Industry results from public research and filings, not Scalric’s own results. October 2026.</p>
  </div></section>;
}
