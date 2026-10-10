import React from 'react';
import { Link, Arrow, useScrolled } from './UI.jsx';
import { insights, pagesForSearch } from '../data/siteContent.js';

const menus = {
  'What We Do': [
    ['Overview', '/what-we-do', 'Find the right path from problem to outcome.'],
    ['SaaS & software', '/what-we-do#saas', 'Shape digital products around real needs.'],
    ['Artificial intelligence', '/what-we-do#ai', 'Apply AI with a clear purpose.'],
    ['Data & automation', '/what-we-do#data-automation', 'Make information and operations work together.'],
    ['Consulting', '/what-we-do#consulting', 'Connect strategy to meaningful delivery.'],
  ],
  Industries: [
    ['Explore industries', '/industries', 'A starting point for sector-specific perspectives.'],
    ['Financial services', '/industries#financial-services', 'Digital services, data and operations.'],
    ['Healthcare & life sciences', '/industries#healthcare', 'Connected information and experiences.'],
    ['Manufacturing', '/industries#manufacturing', 'Intelligence for complex operations.'],
  ],
  Insights: [
    ['View all insights', '/insights', 'Ideas on technology, business and transformation.'],
    ['Artificial Intelligence', '/insights?topic=Artificial%20Intelligence', 'Perspectives on responsible, useful AI.'],
    ['Data & Analytics', '/insights?topic=Data%20%26%20Analytics', 'Turning information into better decisions.'],
    ['Automation', '/insights?topic=Automation', 'Reimagining work and customer journeys.'],
  ],
  Company: [
    ['About Scalric', '/company', 'Why we exist and how we work.'],
    ['Our approach', '/company#approach', 'From discovery to measurable outcomes.'],
  ],
  Careers: [
    ['Open roles', '/careers', 'Explore opportunities at Scalric.'],
    ['Life at Scalric', '/careers#life', 'Build meaningful work with thoughtful teams.'],
    ['How we hire', '/careers#how-we-hire', 'A clear view of the hiring process.'],
  ],
};

const navItems = ['What We Do', 'Industries', 'Insights', 'Impact', 'Company', 'Careers'];

function SearchPanel({ onClose }) {
  const [query, setQuery] = React.useState('');
  
  const results = query.trim() ? [
    ...pagesForSearch.filter(([title]) => title.toLowerCase().includes(query.toLowerCase())).map(([title, href]) => ({ title, href, kind: 'Page' })),
    ...insights.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase())).map((item) => ({ title: item.title, href: `/insights/${item.slug}`, kind: 'Insight' })),
  ].slice(0, 6) : [];
  return <div className="search-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <div className="search-top"><span id="search-title">Search Scalric</span><button className="icon-button" onClick={onClose} aria-label="Close search">×</button></div>
      <label className="search-input-wrap"><span className="search-glass" aria-hidden="true">⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you exploring?" /></label>
      <div className="search-results" aria-live="polite">{!query.trim() ? <p className="search-hint">Try “AI”, “careers” or “impact”.</p> : results.length ? results.map((result) => <Link key={`${result.kind}-${result.href}`} href={result.href} className="search-result" onClick={onClose}><span><small>{result.kind}</small><b>{result.title}</b></span><Arrow diagonal /></Link>) : <p className="search-hint">No results found. Try another search.</p>}</div>
    </section>
  </div>;
}

export default function Header({ currentPath }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(null);
  const hoverTimer = React.useRef(null);
  const scrolled = useScrolled(24);
  const overlay = currentPath === '/' && !scrolled && !openMenu && !mobileOpen;
  const close = React.useCallback(() => { clearTimeout(hoverTimer.current); setOpenMenu(null); setMobileOpen(false); setExpanded(null); }, []);
  const queueMenu = (item) => { clearTimeout(hoverTimer.current); hoverTimer.current = window.setTimeout(() => setOpenMenu(item), 150); };

  React.useEffect(() => { close(); }, [currentPath, close]);
  React.useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { close(); setSearchOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return <>
    <header className={`site-header${overlay ? ' is-overlay' : ''}${scrolled ? ' is-scrolled' : ''}`} onMouseLeave={() => { clearTimeout(hoverTimer.current); setOpenMenu(null); }}>
      <div className="header-utility"><div className="container utility-inner"><span className="region-label">India <span>(EN)</span></span><span className="utility-note">Technology · Consulting · Innovation</span></div></div>
      <div className="container header-main">
        <Link href="/" className="brand" aria-label="Scalric home" onClick={close}><img className="logo-green" src="/assets/scalric-wordmark-green.png" alt="Scalric" width="135" height="34" /><img className="logo-white" src="/assets/scalric-wordmark-white.png" alt="" width="135" height="34" aria-hidden="true" /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => item === 'Impact' ? <Link key={item} href="/impact" className={`nav-link${currentPath.startsWith('/impact') ? ' active' : ''}`}>Impact</Link> :
            <button key={item} className={`nav-link nav-menu-trigger${openMenu === item ? ' active' : ''}`} aria-expanded={openMenu === item} aria-controls="mega-menu" onMouseEnter={() => queueMenu(item)} onFocus={() => setOpenMenu(item)} onClick={() => setOpenMenu(openMenu === item ? null : item)}>{item}<span className="nav-chevron">⌄</span></button>)}
        </nav>
        <div className="header-actions"><button className="search-trigger" aria-label="Open search" onClick={() => setSearchOpen(true)}><span className="search-glass">⌕</span></button><Link href="/contact" className="button button-dark header-cta">Talk to us <Arrow diagonal /></Link><button className={`mobile-menu-trigger${mobileOpen ? ' is-open' : ''}`} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><i /><i /></button></div>
      </div>
      {openMenu && <div className="mega-scrim" onMouseEnter={() => setOpenMenu(null)}><section className="mega-menu" id="mega-menu" aria-label={`${openMenu} menu`} onMouseEnter={() => setOpenMenu(openMenu)}>
        <div className="mega-lead"><span className="eyebrow"><i />EXPLORE SCALRIC</span><h2>{openMenu}</h2><p>{openMenu === 'What We Do' ? 'We connect strategic thinking and technology to help solve complex business problems.' : openMenu === 'Industries' ? 'Explore the opportunities and questions shaping different sectors.' : openMenu === 'Insights' ? 'Ideas for a world where technology and business keep moving.' : openMenu === 'Company' ? 'A technology and consulting organization built around meaningful outcomes.' : 'Do work that moves important ideas forward.'}</p><Link href={openMenu === 'Careers' ? '/careers' : `/${openMenu.toLowerCase().replaceAll(' ', '-')}`} className="text-link" onClick={close}>Explore {openMenu} <Arrow diagonal /></Link></div>
        <div className="mega-links">{(menus[openMenu] || []).map(([label, href, desc], index) => <Link key={label} href={href} className={`mega-link${index === 0 ? ' mega-featured' : ''}`} onClick={close}><span className="mega-link-copy"><b>{label}</b><small>{desc}</small></span><Arrow diagonal /></Link>)}</div>
        <button className="mega-close icon-button" onClick={() => setOpenMenu(null)} aria-label="Close menu">×</button>
      </section></div>}
    </header>
    {mobileOpen && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Main navigation"><div className="mobile-menu-head"><span>Explore Scalric</span><button className="icon-button" onClick={close} aria-label="Close menu">×</button></div><div className="mobile-menu-links">{navItems.map((item) => item === 'Impact' ? <Link key={item} href="/impact" onClick={close}>{item}<Arrow diagonal /></Link> : <section key={item} className="mobile-nav-group"><button className="mobile-nav-toggle" aria-expanded={expanded === item} onClick={() => setExpanded(expanded === item ? null : item)}>{item}<span>{expanded === item ? '−' : '+'}</span></button>{expanded === item && <div className="mobile-subnav">{menus[item].map(([label, href]) => <Link key={label} href={href} onClick={close}>{label}<Arrow diagonal /></Link>)}</div>}</section>)}</div><div className="mobile-menu-bottom"><Link href="/contact" className="button button-green" onClick={close}>Talk to us <Arrow diagonal /></Link><span>India (EN)</span></div></div>}
    {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
  </>;
}

