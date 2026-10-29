import React from 'react';
import TopicChips from './TopicChips.jsx';
import { featuredNumbers, numberGroups, researchNumbers, researchSources } from '../data/research.js';
import { Eyebrow, Reveal } from './UI.jsx';

/** Filterable grid of sourced statistics for the Insights page. */
export default function NumbersGrid() {
  const [label, setLabel] = React.useState(numberGroups[0][1]);
  const group = numberGroups.find(([, name]) => name === label)[0];
  const [expanded, setExpanded] = React.useState(false);
  const rows = researchNumbers.filter(([g], i) => (group === 'all' || g === group) && (group !== 'all' || expanded || featuredNumbers.includes(i)));
  const select = (next) => {
    setLabel(next);
    window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'numbers_filter', group: next } }));
  };
  return <section className="section rs-numbers" id="numbers"><div className="container">
    <Reveal className="rs-head">
      <Eyebrow>18 NUMBERS THAT MATTER</Eyebrow>
      <h2>The evidence behind better digital</h2>
      <p>Industry figures on speed, sales, marketing, AI and security, each with its source and year.</p>
    </Reveal>
    <TopicChips items={numberGroups.map(([, name]) => name)} topic={label} onSelect={select} />
    <div className="rs-stats">{rows.map(([g, topic, value, text, key, source]) => <article key={`${topic}-${value}-${text}`} className={`rs-stat rs-${g}`}>
      <span className="rs-stat-topic">{topic}</span><b>{value}</b><p>{text}</p>
      <a href={researchSources[key]} target="_blank" rel="noopener noreferrer">{source} ↗</a>
    </article>)}</div>
    {group === 'all' && <div className="rs-more"><button type="button" className="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer' : `Show all ${researchNumbers.length}`}</button></div>}
    <p className="rs-note">Industry results, not Scalric’s own. Some figures are older than five years but remain the standard in their field, so the year is always shown.</p>
  </div></section>;
}
