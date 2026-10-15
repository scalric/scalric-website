import React from 'react';
import { Link, Arrow } from './UI.jsx';

const footerGroups = [
  ['Explore', ['What We Do', '/what-we-do'], ['Industries', '/industries'], ['Insights', '/insights']],
  ['Scalric', ['Company', '/company'], ['Careers', '/careers'], ['Impact', '/impact']],
  ['Connect', ['Talk to us', '/contact'], ['India (EN)', '/']],
];

/** Placeholder profile URLs — replace with Scalric's confirmed accounts before launch. */
const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/scalric', path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.06c.53-1 1.84-2.07 3.78-2.07 4.04 0 4.78 2.66 4.78 6.12v5.88h-4v-5.21c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.3h-4V9.75Z' },
  { name: 'Instagram', href: 'https://www.instagram.com/scalric', path: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z' },
  { name: 'X', href: 'https://x.com/scalric', path: 'M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.48 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44Z' },
  { name: 'YouTube', href: 'https://www.youtube.com/@scalric', path: 'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.77 2 12 2 12s0 3.23.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.23 22 12 22 12s0-3.23-.4-4.8ZM10 15V9l5.2 3-5.2 3Z' },
];

/** Footer on an electric-blue field. A spotlight follows the pointer; links underline and slide on hover. */
export default function Footer() {
  const onPointerMove = (event) => {
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--gx', `${event.clientX - r.left}px`);
    event.currentTarget.style.setProperty('--gy', `${event.clientY - r.top}px`);
  };
  return <footer className="site-footer" onPointerMove={onPointerMove}>
    <div className="ft-spot" aria-hidden="true"/>
    <div className="ft-aurora" aria-hidden="true"><i/><i/></div>
    <div className="container ft-top">
      <div className="ft-brand">
        <Link href="/" className="ft-logo" aria-label="Scalric home"><img src="/assets/scalric-wordmark-white.png" alt="Scalric" width="150" height="37" loading="lazy" /></Link>
        <p>We study complex problems and build technology and consulting solutions for meaningful impact.</p>
        <Link href="/contact" className="button header-cta ft-cta-btn">Start a conversation</Link>
        <ul className="ft-social" aria-label="Scalric on social media">{socials.map((s) => <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Scalric on ${s.name}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.path} fill="currentColor"/></svg></a></li>)}</ul>
      </div>
      <nav className="ft-columns" aria-label="Footer">
        {footerGroups.map(([title, ...links]) => <div className="ft-col" key={title}><h3>{title}</h3><ul>{links.map(([label, href]) => <li key={label}><Link href={href}><span>{label}</span><Arrow diagonal /></Link></li>)}</ul></div>)}
      </nav>
    </div>
    <div className="container ft-bottom">
      <span>© {new Date().getFullYear()} Scalric</span>
      <span className="ft-tag">Technology · Consulting · Innovation</span>
      <button type="button" className="ft-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><span>Back to top</span><i aria-hidden="true">↑</i></button>
    </div>
  </footer>;
}
