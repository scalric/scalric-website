import React from 'react';
import { Link, Arrow, useScrolled } from './UI.jsx';

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
    ['Open roles', '/careers/openings', 'Explore opportunities at Scalric.'],
    ['Life at Scalric', '/careers#life', 'Build meaningful work with thoughtful teams.'],
    ['How we hire', '/careers#how-we-hire', 'A clear view of the hiring process.'],
  ],
};

const navItems = ['What We Do', 'Industries', 'Insights', 'Impact', 'Company', 'Careers'];

export default function Header({ currentPath }) {
  const [openMenu, setOpenMenu] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const searchIndex = React.useMemo(() => Object.entries(menus).flatMap(([group, items]) => items.map(([label, href, desc]) => ({ group, label, href, desc }))), []);
  const q = query.trim().toLowerCase();
  const results = (q ? searchIndex.filter((r) => `${r.group} ${r.label} ${r.desc}`.toLowerCase().includes(q)) : searchIndex.filter((r, i, a) => a.findIndex((x) => x.group === r.group) === i)).slice(0, 7);
  const hoverTimer = React.useRef(null);
  const scrolled = useScrolled(24);
  const [hidden, setHidden] = React.useState(false);
  const overlay = currentPath === '/' && !scrolled && !openMenu && !mobileOpen;
  const close = React.useCallback(() => { clearTimeout(hoverTimer.current); setOpenMenu(null); setMobileOpen(false); setExpanded(null); setSearchOpen(false); setQuery(''); }, []);
  const queueMenu = (item) => { clearTimeout(hoverTimer.current); hoverTimer.current = window.setTimeout(() => setOpenMenu(item), 150); };

  React.useEffect(() => { close(); }, [currentPath, close]);
  React.useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > 480 && y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  React.useEffect(() => {
    if (!openMenu) return undefined;
    const onDown = (event) => { if (!event.target.closest('.site-header')) setOpenMenu(null); };
    const startY = window.scrollY;
    const onScroll = () => { if (Math.abs(window.scrollY - startY) > 60) setOpenMenu(null); };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('scroll', onScroll); };
  }, [openMenu]);
  const isHidden = hidden && scrolled && !openMenu && !mobileOpen;
  React.useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { close(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return <>
    <header className={`site-header${overlay ? ' is-overlay' : ''}${scrolled ? ' is-scrolled' : ''}${isHidden ? ' is-hidden' : ''}`} onMouseLeave={() => { clearTimeout(hoverTimer.current); setOpenMenu(null); }}>
      <div className="header-utility"><div className="container utility-inner"><Link href="/careers/openings" className="utility-link" onClick={close}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>Open roles</Link><span className="utility-link region-label"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 4 5.7 4 9s-1.4 6.3-4 9c-2.6-2.7-4-5.7-4-9s1.4-6.3 4-9z"/></svg>India <span>(EN)</span></span></div></div>
      <div className="container header-main">
        <Link href="/" className="brand" aria-label="Scalric home" onClick={close}><img className="logo-green" src="/assets/scalric-wordmark-blue.png" alt="Scalric" width="135" height="34" /></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => item === 'Impact' ? <Link key={item} href="/impact" className={`nav-link${currentPath.startsWith('/impact') ? ' active' : ''}`}>Impact</Link> :
            <Link key={item} href={`/${item.toLowerCase().replaceAll(' ', '-')}`} className={`nav-link nav-menu-trigger${openMenu === item || currentPath.startsWith(`/${item.toLowerCase().replaceAll(' ', '-')}`) ? ' active' : ''}`} aria-haspopup="true" aria-expanded={openMenu === item} aria-controls="mega-menu" onMouseEnter={() => queueMenu(item)} onFocus={() => setOpenMenu(item)} onClick={close}>{item}</Link>)}
        </nav>
        <div className="header-actions"><button type="button" className="search-trigger header-search" aria-label="Search" onClick={() => { setOpenMenu(null); setSearchOpen(true); }}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg></button><Link href="/contact" className="button button-dark header-cta">Talk to us <Arrow diagonal /></Link><button className={`mobile-menu-trigger${mobileOpen ? ' is-open' : ''}`} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><i /><i /></button></div>
      </div>
      {openMenu && <div className="mega-scrim" onMouseEnter={() => setOpenMenu(null)}><section className="mega-menu" id="mega-menu" aria-label={`${openMenu} menu`} onMouseEnter={() => setOpenMenu(openMenu)}>
        <div className="mega-lead"><span className="eyebrow"><i />EXPLORE SCALRIC</span><h2>{openMenu}</h2><p>{openMenu === 'What We Do' ? 'We connect strategic thinking and technology to help solve complex business problems.' : openMenu === 'Industries' ? 'Explore the opportunities and questions shaping different sectors.' : openMenu === 'Insights' ? 'Ideas for a world where technology and business keep moving.' : openMenu === 'Company' ? 'A technology and consulting organization built around meaningful outcomes.' : 'Do work that moves important ideas forward.'}</p><Link href={openMenu === 'Careers' ? '/careers' : `/${openMenu.toLowerCase().replaceAll(' ', '-')}`} className="text-link" onClick={close}>Explore {openMenu} <Arrow diagonal /></Link></div>
        <div className="mega-links">{(menus[openMenu] || []).map(([label, href, desc], index) => <Link key={label} href={href} className={`mega-link${index === 0 ? ' mega-featured' : ''}`} onClick={close}><span className="mega-link-copy"><b>{label}</b><small>{desc}</small></span><Arrow diagonal /></Link>)}</div>
        <button className="mega-close icon-button" onClick={() => setOpenMenu(null)} aria-label="Close menu">×</button>
      </section></div>}
    </header>
    {searchOpen && <div className="search-scrim" role="dialog" aria-modal="true" aria-label="Search Scalric" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}><div className="search-dialog">
      <div className="search-top"><span>Search Scalric</span><button className="icon-button" onClick={close} aria-label="Close search">×</button></div>
      <label className="search-input-wrap"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg><input autoFocus type="search" placeholder="Search services, industries, insights…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      <div className="search-results">{results.length ? results.map((r) => <Link key={r.group + r.label} href={r.href} className="search-result" onClick={close}><span><small>{r.group}</small><b>{r.label}</b></span><Arrow diagonal /></Link>) : <p className="search-hint">No results for “{query}”. Try “AI”, “data” or “careers”.</p>}</div>
    </div></div>}
    {mobileOpen && <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Main navigation"><div className="mobile-menu-head"><span>Explore Scalric</span><button className="icon-button" onClick={close} aria-label="Close menu">×</button></div><div className="mobile-menu-links">{navItems.map((item) => item === 'Impact' ? <Link key={item} href="/impact" onClick={close}>{item}<Arrow diagonal /></Link> : <section key={item} className="mobile-nav-group"><button className="mobile-nav-toggle" aria-expanded={expanded === item} onClick={() => setExpanded(expanded === item ? null : item)}>{item}<span>{expanded === item ? '−' : '+'}</span></button>{expanded === item && <div className="mobile-subnav">{menus[item].map(([label, href]) => <Link key={label} href={href} onClick={close}>{label}<Arrow diagonal /></Link>)}</div>}</section>)}</div><div className="mobile-menu-bottom"><Link href="/contact" className="btn-talk" onClick={close}><span>Talk to us</span><i aria-hidden="true">→</i></Link><span>India (EN)</span></div></div>}
  </>;
}

