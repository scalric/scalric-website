import React from 'react';
import { Link, Arrow, Reveal } from './UI.jsx';

// Folded ribbon "S" drawn in a 560x740 box: top bar, bottom bar and the diagonal fold between them.
// Bars are polygons with smooth rounded outer corners; the corners that meet the fold stay sharp so the pieces join.
function rounded(points, radii) {
  const n = points.length;
  return points.map((p, i) => {
    const a = points[(i + n - 1) % n]; const b = points[(i + 1) % n];
    const toward = (q) => { const dx = q[0] - p[0]; const dy = q[1] - p[1]; const d = Math.hypot(dx, dy); const k = Math.min(radii[i], d / 2) / d; return [p[0] + dx * k, p[1] + dy * k]; };
    const s = toward(a); const e = toward(b);
    return `${i ? 'L' : 'M'}${s[0].toFixed(1)} ${s[1].toFixed(1)} Q${p[0]} ${p[1]} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
  }).join(' ') + ' Z';
}
const TOP = rounded([[20, 215], [538, 18], [538, 175], [20, 370]], [34, 34, 34, 0]);
const BOTTOM = rounded([[538, 385], [538, 545], [20, 725], [20, 572]], [0, 34, 34, 34]);
const FOLD = 'M20 370 L300 265 L538 385 L258 486 Z';

/** Closing call to action: copy on the left, a hollow folded ribbon on the right that assembles on scroll to reveal the image behind it. */
export default function ContactBand() {
  const stage = React.useRef(null);
  React.useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.style.setProperty('--p', 1); return undefined; }
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const raw = (window.innerHeight * 0.95 - box.top) / (window.innerHeight * 0.65);
      const p = Math.max(0, Math.min(1, raw));
      el.style.setProperty('--p', (p * p * (3 - 2 * p)).toFixed(4));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);

  return <section className="cb-section"><div className="container cb-stage" ref={stage}>
    <Reveal className="cb-copy">
      <span className="cb-eyebrow">START A CONVERSATION</span>
      <h2><span className="cb-lead">What could we</span><span className="cb-big">make possible?</span></h2>
      <p>Bring us the challenge you’re working through. We’ll bring curiosity and a clear point of view.</p>
      <Link href="/contact" className="cb-btn">Talk to us <Arrow diagonal /></Link>
    </Reveal>
    <div className="cb-ribbon" aria-hidden="true">
      <svg viewBox="0 0 560 740" role="presentation">
        <defs>
          <clipPath id="cb-clip-top"><path className="cb-piece cb-piece-top" d={TOP} /></clipPath>
          <clipPath id="cb-clip-bottom"><path className="cb-piece cb-piece-bottom" d={BOTTOM} /></clipPath>
          <clipPath id="cb-clip-fold"><path className="cb-piece cb-piece-fold" d={FOLD} /></clipPath>
          <linearGradient id="cb-g-top" x1="0" y1="0" x2=".3333" y2="0" spreadMethod="repeat"><stop offset="0" stopColor="#1155d9" /><stop offset=".25" stopColor="#5aa2ff" /><stop offset=".5" stopColor="#0a2f93" /><stop offset=".75" stopColor="#3d86ff" /><stop offset="1" stopColor="#1155d9" /></linearGradient>
          <linearGradient id="cb-g-bottom" x1="0" y1="0" x2=".3333" y2="0" spreadMethod="repeat"><stop offset="0" stopColor="#0b3fb8" /><stop offset=".25" stopColor="#1155d9" /><stop offset=".5" stopColor="#4d8dff" /><stop offset=".75" stopColor="#1155d9" /><stop offset="1" stopColor="#0b3fb8" /></linearGradient>
          <linearGradient id="cb-g-fold" x1="0" y1="0" x2=".3333" y2="0" spreadMethod="repeat"><stop offset="0" stopColor="#dff0ff" /><stop offset=".25" stopColor="#6fb5ff" /><stop offset=".5" stopColor="#ffffff" /><stop offset=".75" stopColor="#6fb5ff" /><stop offset="1" stopColor="#dff0ff" /></linearGradient>
          <linearGradient id="cb-g-shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        </defs>
        <g className="cb-img-top" clipPath="url(#cb-clip-top)"><g className="cb-flow cb-flow-top"><rect x="-900" y="-100" width="2400" height="960" fill="url(#cb-g-top)" /></g><rect className="cb-shine" x="-200" y="-100" width="140" height="960" fill="url(#cb-g-shine)" /></g>
        <g className="cb-img-bottom" clipPath="url(#cb-clip-bottom)"><g className="cb-flow cb-flow-bottom"><rect x="-900" y="-100" width="2400" height="960" fill="url(#cb-g-bottom)" /></g><rect className="cb-shine" x="-200" y="-100" width="140" height="960" fill="url(#cb-g-shine)" /></g>
        <g className="cb-img-fold" clipPath="url(#cb-clip-fold)"><g className="cb-flow cb-flow-fold"><rect x="-900" y="-100" width="2400" height="960" fill="url(#cb-g-fold)" /></g><rect className="cb-shine" x="-200" y="-100" width="140" height="960" fill="url(#cb-g-shine)" /></g>
        <path className="cb-outline cb-outline-top" d={TOP} /><path className="cb-outline cb-outline-bottom" d={BOTTOM} /><path className="cb-outline cb-outline-fold" d={FOLD} />
      </svg>
    </div>
    <nav className="cb-links cb-links-left" aria-label="Explore"><Link href="/what-we-do">OUR SERVICES</Link><Link href="/industries">INDUSTRIES</Link></nav>
    <nav className="cb-links cb-links-right" aria-label="More"><Link href="/insights">INSIGHTS</Link><Link href="/company">COMPANY</Link><Link href="/careers">CAREERS</Link></nav>
  </div></section>;
}
