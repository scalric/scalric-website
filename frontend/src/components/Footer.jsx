import React from 'react';
import { Link, Arrow } from './UI.jsx';

const footerGroups = [
  ['Explore', ['What We Do', '/what-we-do'], ['Industries', '/industries'], ['Insights', '/insights']],
  ['Scalric', ['Company', '/company'], ['Careers', '/careers'], ['Impact', '/impact']],
  ['Connect', ['Talk to us', '/contact'], ['India (EN)', '/']],
];

export default function Footer() {
  return <footer className="site-footer">
    <div className="container footer-top"><div className="footer-brand"><Link href="/" className="brand footer-logo" aria-label="Scalric home"><img src="/assets/scalric-wordmark-green.png" alt="Scalric" width="134" height="33" loading="lazy" /></Link><p>We study complex problems and build technology and consulting solutions for meaningful impact.</p><Link href="/contact" className="footer-talk">Start a conversation <Arrow diagonal /></Link></div>
      <div className="footer-columns">{footerGroups.map(([title, ...links]) => <div className="footer-column" key={title}><h3>{title}</h3>{links.map(([label, href]) => <Link href={href} key={label}>{label}<Arrow diagonal /></Link>)}</div>)}</div></div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Scalric</span><span>Technology · Consulting · Innovation</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a></div>
  </footer>;
}
