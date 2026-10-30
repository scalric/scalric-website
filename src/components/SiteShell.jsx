'use client';
import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { usePathname, scrollToAnchor, registerRouter } from '../lib/router.js';
import { autoReveal } from '../lib/autoReveal.js';

/** Header, footer and the per-navigation behaviour (scroll reset, reveals, article scroll analytics) around every public page. */
export default function SiteShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  registerRouter(router);
  React.useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  React.useEffect(() => {
    // autoReveal edits server-rendered elements directly, so it waits until the page has loaded and hydrated.
    let stop = () => {};
    let timer = 0;
    const start = () => { timer = window.setTimeout(() => { stop = autoReveal(); }, 600); };
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
    return () => { window.removeEventListener('load', start); window.clearTimeout(timer); stop(); };
  }, [pathname]);
  React.useEffect(() => {
    if (window.location.hash) scrollToAnchor(window.location.hash.slice(1));
  }, []);
  React.useEffect(() => {
    if (!pathname.startsWith('/insights/')) return undefined;
    const sent = new Set();
    const reportDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const depth = Math.floor((window.scrollY / scrollable) * 100);
      [25, 50, 75, 90].forEach((threshold) => {
        if (depth >= threshold && !sent.has(threshold)) {
          sent.add(threshold);
          window.dispatchEvent(new CustomEvent('scalric:analytics', { detail: { event: 'article_scroll_depth', depth: threshold } }));
        }
      });
    };
    window.addEventListener('scroll', reportDepth, { passive: true });
    reportDepth();
    return () => window.removeEventListener('scroll', reportDepth);
  }, [pathname]);
  return <div className="app-shell" id="top"><Header currentPath={pathname} /><Suspense fallback={null}>{children}</Suspense><Footer /></div>;
}
