import React from 'react';
import { processSteps } from '../data/siteContent.js';

const AUTO_MS = 5200;
const LOGO = '/assets/scalric-wordmark-green.png';
const KEY_STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };


export default function ProcessExplorer() {
  const total = processSteps.length;
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [userPicked, setUserPicked] = React.useState(false);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const auto = !paused && !userPicked && !reduceMotion && active < total - 1;

  React.useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => setActive((i) => Math.min(i + 1, total - 1)), AUTO_MS);
    return () => clearInterval(id);
  }, [auto, total]);

  const choose = (index) => {
    setUserPicked(true);
    setActive(index);
  };

  const onKeyDown = (event) => {
    if (!(event.key in KEY_STEP)) return;
    event.preventDefault();
    const next = (active + KEY_STEP[event.key] + total) % total;
    choose(next);
    document.getElementById(`process-tab-${next}`)?.focus();
  };

  const [title, text] = processSteps[active];
  const fill = ((active + 1) / total) * 100;

  return <div className={`process-explorer${auto ? ' is-auto' : ''}${paused ? ' is-paused' : ''}`}
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="process-tabs" role="tablist" aria-label="Delivery steps" aria-orientation="vertical" onKeyDown={onKeyDown}>
      {processSteps.map(([name], i) => <button key={name} id={`process-tab-${i}`} type="button" role="tab"
        aria-selected={i === active} aria-controls="process-panel" tabIndex={i === active ? 0 : -1}
        className={`process-tab${i === active ? ' is-active' : ''}${i < active ? ' is-done' : ''}`}
        onClick={() => choose(i)}>
        <span className="process-tab-num">{String(i + 1).padStart(2, '0')}</span>
        <span className="process-tab-name">{name}</span>
        <span className="process-tab-bar" aria-hidden="true"><i /></span>
      </button>)}
    </div>
    <div className="process-stage" id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${active}`}>
      <div className="process-copy" key={active}>
        <span className="process-stage-num" aria-hidden="true">{String(active + 1).padStart(2, '0')}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <div className="process-logo" aria-hidden="true">
        <img className="process-logo-base" src={LOGO} alt="" />
        <img className="process-logo-fill" src={LOGO} alt="" style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }} />
      </div>
    </div>
  </div>;
}
