import React from 'react';
import TopicChips from './TopicChips.jsx';
import { numberGroups, numberReads, numberSummaries, numberViz, researchNumbers, researchSources } from '../data/research.js';
import { Eyebrow, Reveal } from './UI.jsx';
import { Count, Gauge, ReadLink, Ring } from './ResearchViz.jsx';

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
    <ReadLink slug={numberReads[entry.index]} from="numbers" />
    <a className="rs-src" href={researchSources[key]} target="_blank" rel="noopener noreferrer" aria-label={`Source: ${source}`}><span>Source ↗</span><em>{source}</em></a>
  </article>;
}

/** One row of the "All 18" list: the topic's headline number and takeaway; opens that topic's full list. */
function SummaryRow({ group, name, order, onOpen }) {
  const [headline, line] = numberSummaries[group];
  const [, , value, text] = researchNumbers[headline];
  const count = researchNumbers.filter(([g]) => g === group).length;
  return <button type="button" className={`rs-row rs-${group}`} style={{ '--i': order }} onClick={() => onOpen(name)}>
    <b><Count value={value} /></b>
    <span className="rs-row-copy"><strong>{name}<small>{count} numbers</small></strong><span>{text}</span><em>{line}</em></span>
    <i aria-hidden="true">→</i>
  </button>;
}

/** "All 18" view: a topic-split overview beside a compact list, one row per topic. */
function Overview({ onOpen }) {
  const topics = numberGroups.slice(1);
  const counts = topics.map(([g]) => researchNumbers.filter(([x]) => x === g).length);
  const sources = new Set(researchNumbers.map((row) => row[4])).size;
  return <div className="rs-overview" key="all">
    <div className="rs-glance">
      <b><Count value={String(researchNumbers.length)} duration={1400} /></b>
      <p>sourced figures from {sources} public sources across {topics.length} topics: {topics.map(([, n], i) => `${n} ${counts[i]}`).join(' · ')}.</p>
      <div className="rs-split" role="img" aria-label={topics.map(([, n], i) => `${n} ${counts[i]}`).join(', ')}>
        {counts.map((n, i) => <i key={topics[i][0]} className={`rs-seg rs-seg-${i}`} style={{ flexGrow: n, '--i': i }} />)}
      </div>
    </div>
    <div className="rs-rows">{topics.map(([g, name], i) => <SummaryRow key={g} group={g} name={name} order={i} onOpen={onOpen} />)}</div>
  </div>;
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
      ? <Overview onOpen={select} />
      : <div className="rs-stats" key={group}>{entries.map((entry, i) => <Stat key={entry.index} entry={entry} large={bigOnes.includes(entry.index)} order={i} />)}</div>}
    <p className="rs-note">Industry results, not Scalric’s own. Some figures are older than five years but remain the standard in their field, so the year is always shown.</p>
  </div></section>;
}
