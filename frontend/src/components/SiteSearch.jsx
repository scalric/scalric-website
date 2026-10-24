import React from 'react';
import { createPortal } from 'react-dom';
import { navigate } from '../lib/router.js';
import { capabilities, insights, proposedIndustries } from '../data/siteContent.js';

const pageEntries = [
  ['What We Do', '/what-we-do', 'Technology and consulting services built around your outcome.', 'Page'],
  ['Industries', '/industries', 'Sector-specific perspectives and starting points.', 'Page'],
  ['Insights', '/insights', 'Ideas on technology, business and transformation.', 'Page'],
  ['Impact', '/impact', 'Discounted digital support for businesses and pro-bono work for NGOs.', 'Page'],
  ['Company', '/company', 'Why we exist and how we work.', 'Page'],
  ['Careers', '/careers/openings', 'Open roles and how to apply.', 'Page'],
  ['Life at Scalric', '/careers/life', 'What it is like to work at Scalric: culture, teams and what to expect.', 'Page'],
  ['Contact', '/contact', 'Talk to the Scalric team.', 'Page'],
];

const index = [
  ...pageEntries,
  ...capabilities.map((item) => [item.title, item.href, item.text, 'What we do']),
  ...proposedIndustries.map((item) => [item.title, '/industries', item.text, 'Industry']),
  ...insights.map((item) => [item.title, `/insights/${item.slug}`, `${item.category}. ${item.dek}`, 'Insight']),
].map(([title, href, text, kind]) => ({ title, href, text, kind, haystack: `${title} ${text} ${kind}`.toLowerCase() }));

function runSearch(query) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return index
    .filter((entry) => words.every((word) => entry.haystack.includes(word)))
    .map((entry) => ({ entry, score: words.reduce((sum, word) => sum + (entry.title.toLowerCase().includes(word) ? 2 : 1), 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ entry }) => entry);
}

/** Search button for the nav bar. Opens a panel that searches pages, services, industries and insights. */
export default function SiteSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);
  const results = React.useMemo(() => runSearch(query), [query]);

  const close = React.useCallback(() => { setOpen(false); setQuery(''); setActive(0); }, []);
  const go = (entry) => { close(); navigate(entry.href); };

  React.useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (event) => { if (event.key === 'Escape') close(); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', onKey); };
  }, [open, close]);

  const onInputKey = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
    else if (event.key === 'Enter' && results[active]) { event.preventDefault(); go(results[active]); }
  };

  return <>
    <button type="button" className="search-trigger" aria-label="Search the site" aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    </button>
    {open && createPortal(
      <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="search-panel">
          <div className="search-field">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input ref={inputRef} type="search" value={query} placeholder="Search services, industries, insights…" aria-label="Search" onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onInputKey} />
            <button type="button" className="search-close" aria-label="Close search" onClick={close}>×</button>
          </div>
          <ul className="search-results">
            {query.trim() && !results.length && <li className="search-empty">No results for “{query.trim()}”. Try a different word.</li>}
            {!query.trim() && <li className="search-empty">Type to search pages, services, industries and insights.</li>}
            {results.map((entry, i) => <li key={entry.href + entry.title}>
              <a href={entry.href} className={i === active ? 'is-active' : ''} onMouseEnter={() => setActive(i)} onClick={(event) => { event.preventDefault(); go(entry); }}>
                <span className="search-kind">{entry.kind}</span>
                <b>{entry.title}</b>
                <small>{entry.text}</small>
              </a>
            </li>)}
          </ul>
        </div>
      </div>, document.body)}
  </>;
}
