import React from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import WhatWeDoPage from './pages/WhatWeDoPage.jsx';
import IndustriesPage from './pages/IndustriesPage.jsx';
import InsightsPage, { InsightArticlePage } from './pages/InsightsPage.jsx';
import ImpactPage from './pages/ImpactPage.jsx';
import CompanyPage from './pages/CompanyPage.jsx';
import { RoleDetailPage } from './pages/CompanyCareersPages.jsx';
import OpeningsPage from './pages/OpeningsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminApp from './admin/AdminApp.jsx';
import LifePage from './pages/LifePage.jsx';
import { usePathname, scrollToAnchor } from './lib/router.js';
import { autoReveal } from './lib/autoReveal.js';
import { Eyebrow, Link, Arrow } from './components/UI.jsx';

const pages = {
  '/': { title: 'Scalric — Engineering the Difference', component: <HomePage/> },
  '/what-we-do': { title: 'What We Do — Scalric', component: <WhatWeDoPage/> },
  '/industries': { title: 'Industries — Scalric', component: <IndustriesPage/> },
  '/insights': { title: 'Insights — Scalric', component: <InsightsPage/> },
  '/impact': { title: 'Impact — Scalric', component: <ImpactPage/> },
  '/company': { title: 'Company — Scalric', component: <CompanyPage/> },
  '/careers': { title: 'Open roles — Careers at Scalric', component: <OpeningsPage/> },
  '/careers/openings': { title: 'Open roles — Careers at Scalric', component: <OpeningsPage/> },
  '/careers/life': { title: 'Life at Scalric — Careers', component: <LifePage/> },
  '/contact': { title: 'Contact — Scalric', component: <ContactPage/> },
};

function NotFoundPage() {
  return <main className="not-found"><Eyebrow>PAGE NOT FOUND</Eyebrow><h1>That path is still taking shape</h1><p>The page may have moved or may not be available yet.</p><Link href="/" className="button button-green">Back to the homepage <Arrow/></Link></main>;
}

function resolveRoute(pathname) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  if (pages[normalized]) return pages[normalized];
  const insight = normalized.match(/^\/insights\/([^/]+)$/);
  if (insight) return { title: 'Insight — Scalric', component: <InsightArticlePage slug={decodeURIComponent(insight[1])}/> };
  const role = normalized.match(/^\/careers\/([^/]+)$/);
  if (role) return { title: 'Role — Careers at Scalric', component: <RoleDetailPage slug={decodeURIComponent(role[1])}/> };
  return { title: 'Page not found — Scalric', component: <NotFoundPage/> };
}

function SiteApp({ pathname }) {
  const route = resolveRoute(pathname);
  React.useEffect(() => {
    document.title = route.title;
    window.scrollTo({ top: 0, behavior: 'instant' });
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = route.title.startsWith('Scalric —')
      ? 'Scalric studies complex problems and builds technology and consulting solutions for measurable business and social impact.'
      : `${route.title.replace(' — Scalric', '')}. Explore Scalric’s technology, consulting, insights and impact.`;
  }, [pathname, route.title]);
  React.useEffect(() => {
    let stop = () => {};
    const timer = window.setTimeout(() => { stop = autoReveal(); }, 250);
    return () => { window.clearTimeout(timer); stop(); };
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
  return <div className="app-shell" id="top"><Header currentPath={pathname}/>{route.component}<Footer/></div>;
}

export default function App() {
  const pathname = usePathname();
  return pathname === '/admin' || pathname.startsWith('/admin/') ? <AdminApp/> : <SiteApp pathname={pathname}/>;
}
