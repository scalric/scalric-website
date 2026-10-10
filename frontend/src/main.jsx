import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './premium.css';
import './theme.css';

window.dataLayer = window.dataLayer || [];
window.addEventListener('scalric:analytics', (event) => {
  const detail = event.detail || {};
  const record = { event: detail.event, ...detail };
  window.dataLayer.push(record);
});

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
