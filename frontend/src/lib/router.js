import React from 'react';

const routeEvent = new Event('scalric:navigate');

export function navigate(path) {
  const target = new URL(path, window.location.origin);
  window.history.pushState({}, '', `${target.pathname}${target.search}${target.hash}`);
  window.dispatchEvent(routeEvent);
  if (target.hash) {
    window.setTimeout(() => document.getElementById(decodeURIComponent(target.hash.slice(1)))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
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
