import React from 'react';

const routeEvent = new Event('scalric:navigate');

/** Scrolls to an element id, retrying while lazy images and reveals above it settle and shift the layout. */
export function scrollToAnchor(id) {
  const find = () => document.getElementById(decodeURIComponent(id));
  [100, 800, 1700, 2800].forEach((delay, i) => window.setTimeout(() => {
    const el = find();
    if (!el) return;
    if (i === 0) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const top = el.getBoundingClientRect().top;
    if (Math.abs(top - 110) > 40) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, delay));
}

export function navigate(path) {
  const target = new URL(path, window.location.origin);
  window.history.pushState({}, '', `${target.pathname}${target.search}${target.hash}`);
  window.dispatchEvent(routeEvent);
  if (target.hash) {
    scrollToAnchor(target.hash.slice(1));
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function usePathname() {
  const [pathname, setPathname] = React.useState(window.location.pathname);
  React.useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', update);
    window.addEventListener('scalric:navigate', update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('scalric:navigate', update);
    };
  }, []);
  return pathname;
}
