import React from 'react';
import TopicChips from './TopicChips.jsx';
import { numberGroups, numberSummaries, numberViz, researchNumbers, researchSources } from '../data/research.js';
import { Eyebrow, Reveal } from './UI.jsx';
import { Count, Gauge, Ring } from './ResearchViz.jsx';

const COLUMNS = 3;

function Stat({ entry, large, order }) {
  const [group, topic, value, text, key, source] = entry.row;
  const viz = numberViz[entry.index];
  const share = viz?.kind === 'share';
  return <article className={`rs-stat rs-${group}${large ? ' rs-stat-lg' : ''}`} style={{ '--i': order }}>
    <span className="rs-stat-topic">{topic}</span>
    {large && share ? <div className="rs-stat-hero"><Ring percent={viz.v}><b><Count value={value} /></b></Ring><p>{text}</p></div>
      : <><b><Count value={value} /></b><p>{text}</p></>}
    {viz && !(large && share) && <Gauge percent={viz.v} from={viz.from} down={viz.kind === 'down'} />}
    <a className="rs-src" href={researchSources[key]} target="_blank" rel="noopener noreferrer" aria-label={`Source: ${source}`}><span>Source ↗</span><em>{source}</em></a>
  </article>;
}

/** "All 18" view: one tile per topic with its headline number, opening that topic's full list. */
function Summary({ group, name, order, onOpen }) {
  const [headline, line] = numberSummaries[group];
  const [, topic, value, text] = researchNumbers[headline];
  const count = researchNumbers.filter(([g]) => g === group).length;
  return <button type="button" className={`rs-stat rs-sum rs-${group}`} style={{ '--i': order }} onClick={() => onOpen(name)}>
    <span className="rs-stat-topic">{name} · {count} numbers</span>
    <b><Count value={value} /></b>
    <p>{text}</p>
    <span className="rs-sum-line">{line}</span>
    <span className="rs-sum-go">See all {count} <i aria-hidden="true">→</i></span>
  </button>;
}

/** Filterable grid of sourced statistics for the Insights page: big tiles lead, each number drawn to suit it. */
export default function NumbersGrid() {
  const [label, setLabel] = React.useState(numberGroups[0][1]);
  const group = numberGroups.find(([, name]) => name === label)[0];
  const entries = researchNumbers.map((row, index) => ({ row, index })).filter(({ row }) => row[0] === group);
  // Enlarge just enough leading tiles (each spans two columns) that the last row of the grid is full.
  // Gauge-backed numbers get the big tiles, since they have the most to show.
  const larges = (COLUMNS - (entries.length % COLUMNS)) % COLUMNS;
  const bigOnes = [...new Set(entries.filter(({ index }) => numberViz[index]?.kind === 'share').concat(entries).map(({ index }) => index))].slice(0, larges);
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
    {group === 'all'
      ? <div className="rs-stats rs-sums" key="all">{numberGroups.slice(1).map(([g, name], i) => <Summary key={g} group={g} name={name} order={i} onOpen={select} />)}</div>
      : <div className="rs-stats" key={group}>{entries.map((entry, i) => <Stat key={entry.index} entry={entry} large={bigOnes.includes(entry.index)} order={i} />)}</div>}
    <p className="rs-note">Industry results, not Scalric’s own. Some figures are older than five years but remain the standard in their field, so the year is always shown.</p>
  </div></section>;
}
