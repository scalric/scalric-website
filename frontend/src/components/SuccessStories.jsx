import React from 'react';
import { Reveal } from './UI.jsx';
import { useCountTo } from '../lib/motion.js';

// Gains are percentages; `low`/`high` give a range when the source quotes one.
const gains = [
  { name: 'Bombay Shaving Co', note: 'sales rate, new store platform', low: 150 },
  { name: 'redBus', note: 'mobile sales, faster pages', low: 80, high: 100 },
  { name: 'Rakuten 24', note: 'money per visitor, speed only', low: 53 },
  { name: 'Rakuten 24', note: 'sales rate, speed only', low: 33 },
  { name: 'Nykaa', note: 'visitors from smaller cities', low: 28 },
  { name: 'Vodafone Italy', note: 'sales after faster pages', low: 8 },
].map((item) => ({ ...item, type: 'gain', size: item.high || item.low, label: `+${item.low}${item.high ? `–${item.high}` : ''}%` }));

// Rates before and after the fix, on a 0-100% scale. Ranges are drawn at their midpoint and labelled as given.
const shifts = [
  { name: 'Ispahani Tea', note: 'Sales rate · WhatsApp shop', beforeLabel: '5–10%', afterLabel: '40–50%', n: 37, sign: '+' },
  { name: 'Riley Plumbing', note: 'Calls booked · AI phone agent', beforeLabel: '<50%', afterLabel: '80%', n: 30, sign: '+' },
  { name: '6 US health systems', note: 'Doctor burnout · AI note-taker', beforeLabel: '52%', afterLabel: '39%', n: 13, sign: '−' },
  { name: '21 clinic studies', note: 'Missed visits · text reminders', beforeLabel: '21%', afterLabel: '15%', n: 6, sign: '−' },
].map((item) => ({ ...item, type: 'shift', label: `${item.sign}${item.n} pts` }));

const stories = [...gains, ...shifts];
const biggest = 150;
const tabs = [
  { key: 'all', label: 'All stories', title: 'Success stories', pick: () => true },
  { key: 'gain', label: 'Gains', title: 'Faster pages and better stores lifted results 8% to 150%', pick: (s) => s.type === 'gain' },
  { key: 'shift', label: 'Before & after', title: 'Every fix moved its number the right way', pick: (s) => s.type === 'shift' },
];
const tones = ['#2a72f0', '#ffba49', '#2fb67c', '#f08aa0', '#8a6cf0', '#26b5d6', '#f08a4b', '#5b8def', '#e0607e', '#3cc4a0'];
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Companies whose logo file is expected at /assets/logos/<slug>.svg (or .png); the rest show their initials.
const hasLogo = new Set(['Bombay Shaving Co', 'redBus', 'Rakuten 24', 'Nykaa', 'Vodafone Italy', 'Ispahani Tea', 'Riley Plumbing']);
const initials = (name) => name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
const metricOf = (story) => (story.type === 'gain' ? story.note.split(', ')[0] : story.note.split(' · ')[0]);

/** The company logo when its file exists, otherwise a coloured circle with initials. */
function Avatar({ story, tone }) {
  const [attempt, setAttempt] = React.useState(0);
  const sources = hasLogo.has(story.name) ? [`/assets/logos/${slug(story.name)}.svg`, `/assets/logos/${slug(story.name)}.png`] : [];
  if (attempt < sources.length) {
    return <span className="ss-avatar ss-avatar-logo" aria-hidden="true"><img src={sources[attempt]} alt="" loading="lazy" decoding="async" onError={() => setAttempt(attempt + 1)} /></span>;
  }
  return <span className="ss-avatar" style={{ '--tone': tone }} aria-hidden="true">{initials(story.name)}</span>;
}

/** Counts the figure up each time a different story is picked. */
function Figure({ story }) {
  const value = Math.round(useCountTo(story.type === 'gain' ? story.low : story.n, true, 1100));
  const high = Math.round(useCountTo(story.high || 0, true, 1100));
  if (story.type === 'gain') return <>+{value}{story.high ? `–${high}` : ''}%</>;
  return <>{story.sign}{value} pts</>;
}

/** "Success stories" dashboard: a list of results on the left, the selected story's details on the right. */
export default function SuccessStories() {
  const [tab, setTab] = React.useState('all');
  const [selected, setSelected] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const current = tabs.find((t) => t.key === tab);
  const list = stories.filter(current.pick);
  const position = Math.min(selected, list.length - 1);
  const story = list[position];
  const listRef = React.useRef(null);
  const go = React.useCallback((step) => setSelected((value) => (value + step + list.length) % list.length), [list.length]);

  // The selection moves on by itself until the visitor interacts with the panel.
  React.useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => go(1), 4500);
    return () => window.clearInterval(timer);
  }, [paused, go]);

  // Keep the picked row in view inside the list without scrolling the whole page.
  React.useEffect(() => {
    const box = listRef.current;
    const row = box?.querySelector('.ss-item.is-on');
    if (box && row) box.scrollTo({ top: row.offsetTop - box.clientHeight / 2 + row.offsetHeight / 2, behavior: 'smooth' });
  }, [position, tab]);

  const choose = (key) => { setTab(key); setSelected(0); };
  const bar = story.type === 'gain' ? Math.max(6, (story.size / biggest) * 100) : 0;

  return <section className="section ss-section" id="success-stories" aria-labelledby="ss-title"><div className="container">
    <Reveal className="ss-head">
      <h2 id="ss-title">Success stories:<br />what worked</h2>
      <p className="ss-lede">Small, specific fixes created large, measured results.</p>
    </Reveal>

    <Reveal><div className="ss-board" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="ss-tabs" role="tablist" aria-label="Story type">
        {tabs.map((t) => <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'is-on' : ''} onClick={() => choose(t.key)}>
          {t.label}<span>{stories.filter(t.pick).length}</span>
        </button>)}
      </div>

      <div className="ss-list">
        <h3 className="ss-list-title">{current.title}</h3>
        <ul ref={listRef}>{list.map((item, i) => <li key={item.name + item.note}>
          <button type="button" aria-pressed={i === position} className={`ss-item${i === position ? ' is-on' : ''}`} onClick={() => setSelected(i)}>
            <Avatar story={item} tone={tones[stories.indexOf(item) % tones.length]} />
            <span className="ss-item-copy"><b>{item.name}</b><small>{item.type === 'gain' ? item.note : metricOf(item)}</small></span>
            <span className="ss-pill">{item.type === 'gain' ? 'Gain' : 'Shift'}</span>
            <strong className="ss-item-value">{item.label}</strong>
          </button>
        </li>)}</ul>
      </div>

      <div className="ss-detail" key={story.name + story.note}>
        <div className="ss-detail-head">
          <div><small>Story</small><h3>{story.name}</h3></div>
          <div><small>Type</small><b>{story.type === 'gain' ? 'Measured gain' : 'Before & after'}</b></div>
          <div className="ss-big"><small>Result</small><b><Figure story={story} /></b></div>
        </div>

        <div className="ss-tiles">
          {story.type === 'gain' ? <>
            <div className="ss-tile"><b><Figure story={story} /></b><span>Improvement</span></div>
            <div className="ss-tile ss-tile-wide"><b>{metricOf(story)}</b><span>{story.note.includes(', ') ? story.note.split(', ').slice(1).join(', ') : 'what moved'}</span></div>
            <div className="ss-tile"><i className="ss-meter" style={{ '--w': `${bar}%` }}><em /></i><span>Size against the biggest gain</span></div>
          </> : <>
            <div className="ss-tile"><b>{story.beforeLabel}</b><span>Before</span></div>
            <div className="ss-tile ss-tile-accent"><b>{story.afterLabel}</b><span>After</span></div>
            <div className="ss-tile"><b>{metricOf(story)}</b><span>{story.note.split(' · ')[1]}</span></div>
          </>}
          <button type="button" className="ss-tile ss-tile-add" onClick={() => go(1)}><b>+</b><span>Next story</span></button>
        </div>

        <div className="ss-foot">
          <div><small>Story</small><b>{position + 1} of {list.length}</b></div>
          <div><small>Result</small><b>{story.label}</b></div>
          <div><small>Metric</small><b>{metricOf(story)}</b></div>
          <div className="ss-foot-actions">
            <button type="button" className="ss-round" aria-label="Previous story" onClick={() => go(-1)}>‹</button>
            <button type="button" className="ss-round" aria-label="Next story" onClick={() => go(1)}>›</button>
            <button type="button" className="ss-next" onClick={() => go(1)}>Next story</button>
          </div>
        </div>
      </div>
    </div></Reveal>
  </div></section>;
}
