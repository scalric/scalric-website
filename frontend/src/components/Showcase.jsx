import React from 'react';
import { dashboardKpis, dashboardMilestones, dashboardNav, dashboardTrend, workstreams } from '../data/siteContent.js';

export function ArtImage({ name, alt = '', className = '' }) {
  return <img className={`art-img ${className}`} src={`/assets/art/${name}.svg`} alt={alt} loading="lazy" decoding="async" />;
}

export function Ticker({ items }) {
  return <div className="ticker" aria-hidden="true">
    <div className="ticker-track">{[...items, ...items].map((item, i) => <span key={`${item}-${i}`}>{item}<i>✳</i></span>)}</div>
  </div>;
}

export function Tabs({ tabs }) {
  const [active, setActive] = React.useState(tabs[0].id);
  const current = tabs.find((tab) => tab.id === active) || tabs[0];
  return <div className="tabs">
    <div className="tab-list" role="tablist" aria-label="Preview views">
      {tabs.map((tab) => <button key={tab.id} type="button" role="tab" id={`tab-${tab.id}`} aria-selected={current.id === tab.id} aria-controls={`panel-${tab.id}`} className={`tab${current.id === tab.id ? ' is-active' : ''}`} onClick={() => setActive(tab.id)}>{tab.label}</button>)}
    </div>
    <div className="tab-panel" role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>{current.content}</div>
  </div>;
}

/** Area sparkline. Values are normalised to the box; the gradient id is unique per instance. */
export function Sparkline({ values, width = 640, height = 160 }) {
  const gid = `spark-${React.useId().replace(/:/g, '')}`;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const step = width / (values.length - 1);
  const points = values.map((value, i) => `${(i * step).toFixed(1)},${(height - 10 - ((value - min) / (max - min || 1)) * (height - 20)).toFixed(1)}`);
  return <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0645E5" stopOpacity=".32" /><stop offset="1" stopColor="#0645E5" stopOpacity="0" /></linearGradient></defs>
    <path d={`M0,${height} L${points.join(' L')} L${width},${height} Z`} fill={`url(#${gid})`} />
    <polyline points={points.join(' ')} fill="none" stroke="#0645E5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
  </svg>;
}

/** Compact bar chart built from divs, so it inherits theme colors. */
export function MiniBars({ values }) {
  const max = Math.max(...values);
  return <div className="mini-bars" aria-hidden="true">{values.map((value, i) => <i key={i} style={{ '--h': `${Math.round((value / max) * 100)}%` }} className={i === values.length - 1 ? 'is-hot' : ''} />)}</div>;
}

export function DashboardPreview() {
  return <figure className="product" aria-label="Sample engagement dashboard with illustrative data">
    <div className="product-chrome"><span /><span /><span /><b>Engagement overview</b><em>Illustrative sample data</em></div>
    <div className="product-body">
      <aside className="product-nav" aria-hidden="true">{dashboardNav.map((name, i) => <span key={name} className={i === 0 ? 'is-on' : ''}>{name}</span>)}</aside>
      <div className="product-main">
        <div className="kpi-row">{dashboardKpis.map(([label, value, note]) => <div className="kpi" key={label}><small>{label}</small><strong>{value}</strong><span>{note}</span></div>)}</div>
        <div className="chart-card"><div className="chart-head"><span>Outcome progress</span><span>Last 12 weeks</span></div><Sparkline values={dashboardTrend} /></div>
        <div className="milestones">{dashboardMilestones.map(([name, status, tone]) => <div className="milestone-row" key={name}><span>{name}</span><span className={`pill pill-${tone}`}>{status}</span></div>)}</div>
      </div>
    </div>
  </figure>;
}

export function WorkstreamList() {
  return <ul className="workstreams">{workstreams.map(([name, pct]) => <li key={name}>
    <div className="ws-head"><b>{name}</b><span>{pct}%</span></div>
    <div className="ws-bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
  </li>)}</ul>;
}
