import React from 'react';

/**
 * Topic filter: pills with live counts and a blue highlight that slides to whichever topic is selected.
 * The highlight is measured from the active button so it also works when the pills wrap onto several lines.
 */
export default function TopicChips({ items, topic, onSelect }) {
  const box = React.useRef(null);
  const [mark, setMark] = React.useState(null);

  const measure = React.useCallback(() => {
    const active = box.current?.querySelector('[aria-pressed="true"]');
    if (active) setMark({ left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight });
  }, []);

  React.useLayoutEffect(() => { measure(); }, [topic, measure]);
  React.useEffect(() => {
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return <div className="topic-chips tc" ref={box} role="group" aria-label="Filter insights by topic">
    {mark && <span className="tc-mark" style={{ transform: `translate(${mark.left}px, ${mark.top}px)`, width: mark.width, height: mark.height }} aria-hidden="true" />}
    {items.map((item, i) => <button key={item} type="button" className="tc-chip" style={{ '--i': i }} aria-pressed={topic === item} onClick={() => onSelect(item)}>
      <span>{item}</span>
    </button>)}
  </div>;
}
