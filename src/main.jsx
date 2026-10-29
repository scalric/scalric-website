import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/styles.css';
import './styles/premium.css';
import './styles/theme.css';
import './styles/impact.css';
import './styles/ngo.css';
import './styles/cta.css';
import './banners-fit.css';
import './industries-target.css';
import './costly-mistakes.css';
import './success-stories.css';
import './admin/admin.css';

// Build marker: bump to force a new bundle URL when a deploy must not reuse a cached asset.
window.__SCALRIC_BUILD__ = '2026-10-22-b';
window.dataLayer = window.dataLayer || [];
window.addEventListener('scalric:analytics', (event) => {
  const detail = event.detail || {};
  const record = { event: detail.event, ...detail };
  window.dataLayer.push(record);
});

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
