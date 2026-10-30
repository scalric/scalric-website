'use client';
import React from 'react';
import { apiUrl } from '../lib/api.js';

const STATUSES = ['new', 'read', 'replied', 'archived'];
const TYPE_LABELS = { business: 'Business inquiry', partnership: 'Partnership', impact: 'Impact program', careers: 'Careers', other: 'Something else' };
const REFRESH_MS = 15_000;

async function call(path, options = {}) {
  const response = await fetch(apiUrl(`/api/admin${path}`), {
    credentials: 'include',
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Something went wrong.');
    error.status = response.status;
    throw error;
  }
  return data;
}

const formatDate = (value) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function timeAgo(value) {
  const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Re-runs `load` every few seconds while the tab is visible, so new enquiries show up without a refresh. */
function useAutoRefresh(load) {
  React.useEffect(() => {
    load();
    const timer = setInterval(() => { if (!document.hidden) load(); }, REFRESH_MS);
    const onVisible = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [load]);
}

function Login({ onSignedIn }) {
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      await call('/login', { method: 'POST', body: { username: form.get('username'), password: form.get('password') } });
      onSignedIn();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <div className="adm-login">
    <form className="adm-login-card" onSubmit={submit}>
      <h1>Scalric admin</h1>
      <p>Sign in to view enquiries from the website.</p>
      <label>Username<input name="username" autoComplete="username" required autoFocus /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
      <button className="adm-btn adm-btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <p className="adm-error" role="alert">{error}</p>
    </form>
  </div>;
}

function StatusBadge({ status }) {
  return <span className={`adm-badge adm-badge-${status}`}>{status}</span>;
}

function Chart({ data }) {
  const max = Math.max(1, ...data.map((point) => point.n));
  const total = data.reduce((sum, point) => sum + point.n, 0);
  return <div className="adm-chart" role="img" aria-label={`${total} enquiries in the last 14 days`}>
    {data.map((point) => <div key={point.day} className="adm-chart-col" title={`${point.day}: ${point.n}`}>
      <span className="adm-chart-n">{point.n || ''}</span>
      <i style={{ height: `${point.n ? Math.max(6, (point.n / max) * 100) : 2}%` }} className={point.n ? '' : 'zero'} />
      <small>{new Date(`${point.day}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric' })}</small>
    </div>)}
  </div>;
}

function Overview({ stats, go, open }) {
  if (!stats) return <p className="adm-muted">Loading…</p>;
  const sum = (tally) => Object.values(tally || {}).reduce((a, b) => a + b, 0);
  const careers = stats.contactByType.find((row) => row.type === 'careers') || { n: 0, unread: 0 };
  const last14 = stats.daily.reduce((total, point) => total + point.n, 0);
  const cards = [
    { label: 'Contact enquiries', total: sum(stats.contact), unread: stats.contact.new || 0, view: 'contact', hint: 'Talk to us + Start a conversation' },
    { label: 'Careers enquiries', total: careers.n, unread: careers.unread, view: 'careers', hint: 'Sent from the Careers page' },
    { label: 'Open roles', total: stats.roles.published, unread: 0, view: 'roles', hint: stats.roles.draft ? `${stats.roles.draft} draft` : 'Published on the Careers page' },
  ];
  return <>
    <div className="adm-cards">{cards.map((card) => <button key={card.view} className="adm-card" onClick={() => go(card.view)}>
      <span className="adm-card-label">{card.label}</span>
      <b>{card.total}</b>
      <span className="adm-card-foot">{card.unread ? <span className="adm-badge adm-badge-new">{card.unread} new</span> : null}<small>{card.hint}</small></span>
    </button>)}</div>
    <div className="adm-panels">
      <section className="adm-panel">
        <div className="adm-panel-head"><h2>Last 14 days</h2><span className="adm-muted">{last14} enquiries</span></div>
        <Chart data={stats.daily} />
      </section>
      <section className="adm-panel">
        <div className="adm-panel-head"><h2>Latest activity</h2><span className="adm-live"><i />Live</span></div>
        {stats.recent.length ? <ul className="adm-feed">{stats.recent.map((item) => <li key={item.id}>
          <button onClick={() => open(item)}><b>{item.name}</b> <span className="adm-muted">· {TYPE_LABELS[item.inquiry_type] || item.inquiry_type}</span>
            <small>{item.message}</small></button>
          <span className="adm-feed-meta"><StatusBadge status={item.status} /><small>{timeAgo(item.created_at)}</small></span>
        </li>)}</ul> : <p className="adm-muted">No enquiries yet.</p>}
      </section>
      <section className="adm-panel">
        <div className="adm-panel-head"><h2>By reason</h2></div>
        <div className="adm-bars">{stats.contactByType.some((row) => row.type !== 'careers') ? stats.contactByType.filter((row) => row.type !== 'careers').map((row) => <div key={row.type} className="adm-bar-row">
          <span>{TYPE_LABELS[row.type] || row.type}</span>
          <div className="adm-bar"><i style={{ width: `${Math.max(4, (row.n / Math.max(...stats.contactByType.map((r) => r.n))) * 100)}%` }} /></div>
          <b>{row.n}</b>
        </div>) : <p className="adm-muted">No enquiries yet.</p>}</div>
      </section>
    </div>
  </>;
}

function Detail({ item, onClose, onChanged }) {
  const [notes, setNotes] = React.useState(item.notes || '');
  const [busy, setBusy] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [error, setError] = React.useState('');
  let history = [];
  try { history = item.experience ? JSON.parse(item.experience) : []; } catch { history = []; }
  const rows = [['Name', item.name], ['Email', item.email], ['Organization', item.organization || '—'], ['Reason', TYPE_LABELS[item.inquiry_type] || item.inquiry_type], ...(item.role ? [['Role', item.role]] : []), ...(item.phone ? [['Phone', <a key="p" href={`tel:${item.phone}`}>{item.phone}</a>]] : []), ...(item.experience_years ? [['Experience', `${item.experience_years} ${Number(item.experience_years) === 1 ? 'year' : 'years'}`]] : []), ...(item.link ? [['Link', <a key="l" href={item.link} target="_blank" rel="noreferrer noopener">{item.link}</a>]] : [])];

  async function patch(changes) {
    setBusy(true); setError('');
    try { onChanged(await call(`/contact/${item.id}`, { method: 'PATCH', body: changes })); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true); setError('');
    try { await call(`/contact/${item.id}`, { method: 'DELETE' }); onChanged(null); } catch (err) { setError(err.message); setBusy(false); }
  }
  return <div className="adm-drawer-wrap" onClick={onClose}>
    <aside className="adm-drawer" onClick={(event) => event.stopPropagation()} aria-label="Enquiry details">
      <div className="adm-drawer-head"><div><small>#{item.id} · {formatDate(item.created_at)}</small><h2>{item.name}</h2></div><button className="adm-icon" onClick={onClose} aria-label="Close">×</button></div>
      <dl className="adm-dl">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      {history.length > 0 && <><h3>Work history</h3><ul className="adm-history">{history.map((job, index) => <li key={index}><b>{job.title}</b> · {job.company}<small>{job.from} → {job.current ? 'Present' : job.to}</small></li>)}</ul></>}
      {item.has_resume && <a className="adm-btn adm-resume" href={apiUrl(`/api/admin/contact/${item.id}/resume`)}>⬇ Download resume{item.resume_name ? ` (${item.resume_name})` : ''}</a>}
      <h3>{item.role ? 'Why they are a fit' : 'Message'}</h3>
      <p className="adm-message">{item.message}</p>
      <a className="adm-btn adm-btn-primary" href={`mailto:${item.email}?subject=${encodeURIComponent('Re: your message to Scalric')}`} onClick={() => item.status === 'new' && patch({ status: 'replied' })}>Reply by email</a>
      <h3>Status</h3>
      <div className="adm-seg">{STATUSES.map((status) => <button key={status} className={item.status === status ? 'on' : ''} disabled={busy} onClick={() => patch({ status })}>{status}</button>)}</div>
      <h3>Internal notes</h3>
      <textarea className="adm-notes" rows="4" maxLength="4000" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Only visible in this admin." />
      <div className="adm-row">
        <button className="adm-btn" disabled={busy || notes === (item.notes || '')} onClick={() => patch({ notes })}>Save notes</button>
        {confirming
          ? <><button className="adm-btn adm-btn-danger" disabled={busy} onClick={remove}>Confirm delete</button><button className="adm-btn" onClick={() => setConfirming(false)}>Cancel</button></>
          : <button className="adm-btn adm-btn-ghost-danger" onClick={() => setConfirming(true)}>Delete</button>}
      </div>
      <p className="adm-error" role="alert">{error}</p>
    </aside>
  </div>;
}

function Inbox({ view, initialOpen, onSeen }) {
  const [filters, setFilters] = React.useState({ q: '', status: '', type: view === 'careers' ? 'careers' : '', exclude: view === 'contact' ? 'careers' : '', page: 1 });
  const [search, setSearch] = React.useState('');
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState('');
  const [selected, setSelected] = React.useState(initialOpen || null);
  const [checked, setChecked] = React.useState(() => new Set());
  const [busy, setBusy] = React.useState(false);
  const [confirmBulk, setConfirmBulk] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setFilters((f) => (f.q === search ? f : { ...f, q: search, page: 1 })), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== '' && v !== 1)).toString();
  const load = React.useCallback(() => call(`/contact?${query}`).then((d) => { setData(d); setError(''); onSeen?.(); }).catch((err) => setError(err.message)), [query, onSeen]);
  useAutoRefresh(load);

  function changed(updated) {
    if (!updated) { setSelected(null); return load(); }
    setSelected(updated);
    setData((d) => d && { ...d, items: d.items.map((item) => (item.id === updated.id ? updated : item)) });
    onSeen?.();
  }
  async function bulk(body) {
    setBusy(true); setError('');
    try { await call('/contact/bulk', { method: 'POST', body: { ids: [...checked], ...body } }); setChecked(new Set()); setConfirmBulk(false); await load(); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const toggle = (id) => setChecked((set) => { const next = new Set(set); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const allChecked = data && data.items.length > 0 && data.items.every((item) => checked.has(item.id));
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return <>
    <div className="adm-toolbar">
      <input type="search" placeholder="Search name, email, message…" value={search} onChange={(event) => setSearch(event.target.value)} />
      <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })} aria-label="Status"><option value="">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
      {view === 'contact' && <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value, page: 1 })} aria-label="Reason"><option value="">All reasons</option>{Object.entries(TYPE_LABELS).filter(([k]) => k !== 'careers').map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>}
      <a className="adm-btn" href={apiUrl(`/api/admin/contact/export?${query.replace(/(^|&)page=\d+/, '')}`)}>Export CSV</a>
    </div>
    {checked.size > 0 && <div className="adm-bulk" role="toolbar" aria-label="Bulk actions">
      <b>{checked.size} selected</b>
      <button className="adm-btn" disabled={busy} onClick={() => bulk({ action: 'status', status: 'read' })}>Mark read</button>
      <button className="adm-btn" disabled={busy} onClick={() => bulk({ action: 'status', status: 'replied' })}>Mark replied</button>
      <button className="adm-btn" disabled={busy} onClick={() => bulk({ action: 'status', status: 'archived' })}>Archive</button>
      {confirmBulk
        ? <><button className="adm-btn adm-btn-danger" disabled={busy} onClick={() => bulk({ action: 'delete' })}>Confirm delete</button><button className="adm-btn" onClick={() => setConfirmBulk(false)}>Cancel</button></>
        : <button className="adm-btn adm-btn-ghost-danger" onClick={() => setConfirmBulk(true)}>Delete</button>}
      <button className="adm-btn" onClick={() => { setChecked(new Set()); setConfirmBulk(false); }}>Clear</button>
    </div>}
    {error && <p className="adm-error">{error}</p>}
    {!data ? <p className="adm-muted">Loading…</p> : !data.items.length ? <div className="adm-empty"><b>Nothing here yet.</b><span>New submissions from the website will appear in this list automatically.</span></div> :
      <div className="adm-table-wrap"><table className="adm-table">
        <thead><tr><th className="adm-check"><input type="checkbox" aria-label="Select all" checked={allChecked} onChange={() => setChecked(allChecked ? new Set() : new Set(data.items.map((item) => item.id)))} /></th><th>Received</th><th>Name</th><th>Email</th><th>Reason</th><th>Message</th><th>Status</th></tr></thead>
        <tbody>{data.items.map((item) => <tr key={item.id} className={item.status === 'new' ? 'is-new' : ''} onClick={() => setSelected(item)} tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setSelected(item)}>
          <td className="adm-check" onClick={(event) => event.stopPropagation()}><input type="checkbox" aria-label={`Select ${item.name}`} checked={checked.has(item.id)} onChange={() => toggle(item.id)} /></td>
          <td title={formatDate(item.created_at)}>{timeAgo(item.created_at)}</td>
          <td><b>{item.name}</b>{item.organization ? <small>{item.organization}</small> : null}</td>
          <td>{item.email}</td>
          <td>{TYPE_LABELS[item.inquiry_type] || item.inquiry_type}{item.role ? <small>{item.role}</small> : null}</td>
          <td className="adm-snippet">{item.message}</td>
          <td><StatusBadge status={item.status} /></td>
        </tr>)}</tbody>
      </table></div>}
    {data && data.total > data.pageSize && <div className="adm-pager"><button className="adm-btn" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Previous</button><span>Page {filters.page} of {pages} · {data.total} total</span><button className="adm-btn" disabled={filters.page >= pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button></div>}
    {selected && <Detail item={selected} onClose={() => setSelected(null)} onChanged={changed} />}
  </>;
}

const EMPTY_ROLE = { title: '', team: '', location: '', workMode: '', description: '', published: true };

function RoleEditor({ role, onClose, onSaved }) {
  const [form, setForm] = React.useState(role ? { title: role.title, team: role.team, location: role.location, workMode: role.work_mode, description: role.description, published: role.published } : EMPTY_ROLE);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });
  async function save(event) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      await call(role ? `/roles/${role.id}` : '/roles', { method: role ? 'PATCH' : 'POST', body: form });
      onSaved();
    } catch (err) { setError(err.message); setBusy(false); }
  }
  return <div className="adm-drawer-wrap" onClick={onClose}>
    <form className="adm-drawer adm-form" onClick={(event) => event.stopPropagation()} onSubmit={save} aria-label="Role editor">
      <div className="adm-drawer-head"><h2>{role ? 'Edit role' : 'New role'}</h2><button type="button" className="adm-icon" onClick={onClose} aria-label="Close">×</button></div>
      <label>Title<input value={form.title} onChange={set('title')} required maxLength="120" placeholder="Senior Product Engineer" autoFocus /></label>
      <div className="adm-two"><label>Team<input value={form.team} onChange={set('team')} maxLength="80" placeholder="Engineering" /></label><label>Location<input value={form.location} onChange={set('location')} maxLength="80" placeholder="Remote · India" /></label></div>
      <label>Work mode<input value={form.workMode} onChange={set('workMode')} maxLength="40" placeholder="Remote, hybrid or on-site" /></label>
      <label>Description<textarea rows="8" value={form.description} onChange={set('description')} maxLength="5000" placeholder="What the role involves and who it suits." /></label>
      <label className="adm-inline"><input type="checkbox" checked={form.published} onChange={set('published')} /> Published on the Careers page</label>
      <div className="adm-row"><button className="adm-btn adm-btn-primary" disabled={busy}>{busy ? 'Saving…' : role ? 'Save changes' : 'Create role'}</button><button type="button" className="adm-btn" onClick={onClose}>Cancel</button></div>
      <p className="adm-error" role="alert">{error}</p>
    </form>
  </div>;
}

function Roles() {
  const [items, setItems] = React.useState(null);
  const [editing, setEditing] = React.useState(undefined); // undefined = closed, null = new, object = existing
  const [confirmId, setConfirmId] = React.useState(null);
  const [error, setError] = React.useState('');
  const load = React.useCallback(() => call('/roles').then((d) => setItems(d.items)).catch((err) => setError(err.message)), []);
  useAutoRefresh(load);

  async function act(work) {
    setError('');
    try { await work(); setConfirmId(null); await load(); } catch (err) { setError(err.message); }
  }
  return <>
    <div className="adm-toolbar"><p className="adm-muted adm-grow">Published roles appear on the Careers page and home page straight away. Applicants reach you through the Careers enquiries list.</p><button className="adm-btn adm-btn-primary" onClick={() => setEditing(null)}>+ New role</button></div>
    {error && <p className="adm-error">{error}</p>}
    {!items ? <p className="adm-muted">Loading…</p> : !items.length ? <div className="adm-empty"><b>No roles yet.</b><span>Create one and it will show up on the Careers page when published.</span></div> :
      <div className="adm-table-wrap"><table className="adm-table adm-roles">
        <thead><tr><th>Role</th><th>Team</th><th>Location</th><th>Status</th><th /></tr></thead>
        <tbody>{items.map((role) => <tr key={role.id} onClick={() => setEditing(role)}>
          <td><b>{role.title}</b><small>/careers/{role.slug}</small></td>
          <td>{role.team || '—'}</td>
          <td>{[role.location, role.work_mode].filter(Boolean).join(' · ') || '—'}</td>
          <td><span className={`adm-badge ${role.published ? 'adm-badge-replied' : 'adm-badge-archived'}`}>{role.published ? 'Published' : 'Draft'}</span></td>
          <td className="adm-actions" onClick={(event) => event.stopPropagation()}>
            <button className="adm-btn" onClick={() => act(() => call(`/roles/${role.id}`, { method: 'PATCH', body: { published: !role.published } }))}>{role.published ? 'Unpublish' : 'Publish'}</button>
            {confirmId === role.id
              ? <><button className="adm-btn adm-btn-danger" onClick={() => act(() => call(`/roles/${role.id}`, { method: 'DELETE' }))}>Confirm</button><button className="adm-btn" onClick={() => setConfirmId(null)}>Cancel</button></>
              : <button className="adm-btn adm-btn-ghost-danger" onClick={() => setConfirmId(role.id)}>Delete</button>}
          </td>
        </tr>)}</tbody>
      </table></div>}
    {editing !== undefined && <RoleEditor role={editing} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); load(); }} />}
  </>;
}

function BellIcon() {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 20a2 2 0 0 0 3.4 0" /></svg>;
}

function Notifications({ stats, onOpen, onViewAll, onChanged }) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef(null);
  const total = (stats?.contact.new || 0) + (stats?.contactByType.find((row) => row.type === 'careers')?.unread || 0);
  const items = (stats?.recent || []).filter((item) => item.status === 'new');

  React.useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (event.type === 'keydown' ? event.key === 'Escape' : !ref.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  async function markAllRead() {
    setBusy(true);
    try { await call('/contact/bulk', { method: 'POST', body: { ids: items.map((item) => item.id), action: 'status', status: 'read' } }); await onChanged(); } finally { setBusy(false); }
  }
  return <div className="adm-notif" ref={ref}>
    <button className={`adm-bell ${total ? 'has-new' : ''}`} onClick={() => setOpen(!open)} aria-label={`Notifications${total ? `, ${total} new` : ''}`} aria-expanded={open} aria-haspopup="true">
      <BellIcon />{total > 0 && <span className="adm-bell-count">{total > 99 ? '99+' : total}</span>}
    </button>
    {open && <div className="adm-notif-panel" role="menu">
      <div className="adm-notif-head"><b>Notifications</b>{items.length > 0 && <button disabled={busy} onClick={markAllRead}>Mark all as read</button>}</div>
      {items.length ? <ul>{items.map((item) => <li key={item.id}><button role="menuitem" onClick={() => { setOpen(false); onOpen(item); }}>
        <span className="adm-notif-dot" /><span className="adm-notif-body"><b>{item.name}</b><small>{TYPE_LABELS[item.inquiry_type] || item.inquiry_type} · {timeAgo(item.created_at)}</small><em>{item.message}</em></span>
      </button></li>)}</ul> : <p className="adm-notif-empty">{total ? `${total} older new enquiries` : 'You’re all caught up.'}</p>}
      <button className="adm-notif-all" onClick={() => { setOpen(false); onViewAll(); }}>View all enquiries</button>
    </div>}
  </div>;
}

const NAV = [['overview', 'Overview'], ['contact', 'Contact enquiries'], ['careers', 'Careers enquiries'], ['roles', 'Open roles']];

export default function AdminApp() {
  const [user, setUser] = React.useState(undefined);
  const [view, setView] = React.useState('overview');
  const [stats, setStats] = React.useState(null);
  const [opened, setOpened] = React.useState(null);

  React.useEffect(() => { document.title = 'Admin — Scalric'; }, []);
  const check = React.useCallback(() => call('/me').then((d) => setUser(d.user)).catch(() => setUser(null)), []);
  React.useEffect(() => { check(); }, [check]);

  const loadStats = React.useCallback(() => call('/stats').then(setStats).catch((err) => { if (err.status === 401) setUser(null); }), []);
  React.useEffect(() => { if (user) loadStats(); }, [user, loadStats]);
  // Stats feed the sidebar counts, the overview and the notification bell, so they poll in every view.
  useAutoRefresh(React.useCallback(() => { if (user) loadStats(); }, [user, loadStats]));

  if (user === undefined) return <div className="adm-root"><p className="adm-muted adm-pad">Loading…</p></div>;
  if (!user) return <div className="adm-root"><Login onSignedIn={check} /></div>;

  const unread = { contact: stats?.contact.new || 0, careers: stats?.contactByType.find((row) => row.type === 'careers')?.unread || 0 };
  const title = NAV.find(([key]) => key === view)[1];
  const go = (key) => { setOpened(null); setView(key); };
  const openItem = (item) => { setOpened(item); setView(item.inquiry_type === 'careers' ? 'careers' : 'contact'); };
  return <div className="adm-root adm-shell">
    <nav className="adm-side">
      <div className="adm-brand">Scalric <span>admin</span></div>
      {NAV.map(([key, label]) => <button key={key} className={view === key ? 'on' : ''} onClick={() => go(key)}>{label}{unread[key] ? <span className="adm-count">{unread[key]}</span> : null}</button>)}
      <div className="adm-side-foot">
        <small>Signed in as {user}</small>
        <button onClick={async () => { await call('/logout', { method: 'POST' }); setUser(null); }}>Sign out</button>
        <a href="/">View website ↗</a>
      </div>
    </nav>
    <main className="adm-main">
      <div className="adm-topbar"><h1>{title}</h1><Notifications stats={stats} onChanged={loadStats} onViewAll={() => go('contact')} onOpen={openItem} /></div>
      {view === 'overview' ? <Overview stats={stats} go={go} open={openItem} />
        : view === 'roles' ? <Roles />
        : <Inbox key={`${view}-${opened?.id || ''}`} view={view} initialOpen={opened} onSeen={loadStats} />}
    </main>
  </div>;
}
