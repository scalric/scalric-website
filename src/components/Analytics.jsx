'use client';
import React from 'react';

// Build marker: bump to force a new bundle URL when a deploy must not reuse a cached asset.
const BUILD = '2026-10-30-next';

/** Collects the site's `scalric:analytics` events into window.dataLayer. */
export default function Analytics() {
  React.useEffect(() => {
    window.__SCALRIC_BUILD__ = BUILD;
    window.dataLayer = window.dataLayer || [];
    const collect = (event) => {
      const detail = event.detail || {};
      window.dataLayer.push({ event: detail.event, ...detail });
    };
    window.addEventListener('scalric:analytics', collect);
    return () => window.removeEventListener('scalric:analytics', collect);
  }, []);
  return null;
}
