import React from 'react';
import { Arrow, Link, Reveal } from './UI.jsx';

const icons = {
  dining: <path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v8a2 2 0 0 1-2 2M17 21V3c-2 1-3 4-3 7s1 4 3 4" />,
  care: <path d="M12 21s-7-4.4-9-9.2C1.8 8 4 5 7 5c2 0 3.4 1.2 5 3 1.6-1.8 3-3 5-3 3 0 5.2 3 4 6.8C19 16.6 12 21 12 21z" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />,
  studio: <><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>,
  sport: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M5.5 5.5c3 3 3 10 0 13M18.5 5.5c-3 3-3 10 0 13" /></>,
  beauty: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.5 8l11 10M8.5 16L19.5 6" /></>,
};

const industries = [
  { title: 'Healthcare & clinics', slug: 'unanswered-clinic-calls', stat: '32%', label: 'of clinic calls go unanswered', fix: 'AI phone agent + reminders', video: '/assets/videos/impact-dental.mp4', poster: '/assets/photos/impact-dental.jpg', icon: 'care', tone: '#f08aa0' },
  { title: 'Home services', slug: 'booking-more-calls-in-home-services', stat: '50→80%', label: 'calls booked after adding an AI agent', fix: 'AI phone agent', video: '/assets/videos/impact-electrical.mp4', poster: '/assets/photos/impact-electrical.jpg', icon: 'home', tone: '#1155d9' },
  { title: 'Restaurants & cafés', slug: 'the-app-behind-the-order', stat: '33%', label: 'of Starbucks US orders come through its app', fix: 'Ordering app + loyalty', video: '/assets/videos/impact-cafes.mp4', poster: '/assets/photos/impact-cafes.jpg', icon: 'dining', tone: '#ffba49' },
  { title: 'Gyms & studios', slug: 'branded-apps-for-gyms-and-studios', stat: '62%', label: 'of bookings came through a branded app', fix: 'Booking app', video: '/assets/videos/impact-gyms.mp4', poster: '/assets/photos/impact-gyms.jpg', icon: 'sport', tone: '#2fb67c' },
  { title: 'Salons & spas', slug: 'replying-to-every-review', stat: '80%', label: 'pick businesses that reply to every review', fix: 'Booking + review replies', video: '/assets/videos/impact-salons.mp4', poster: '/assets/photos/impact-salons.jpg', icon: 'beauty', tone: '#8a6cf0' },
];

/** Plays a clip only while it is on screen, so five videos don't all decode at once. */
function ArchVideo({ src, poster }) {
  const ref = React.useRef(null);
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const video = ref.current;
    if (!video || !('IntersectionObserver' in window)) { setNear(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); video.play?.().catch(() => {}); } else video.pause?.();
    }, { rootMargin: '0px 200px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <video ref={ref} src={near ? src : undefined} poster={poster} autoPlay muted loop playsInline preload="none" aria-hidden="true" />;
}

// Poster layout, traced from the reference poster (a 495 x 708 canvas, every edge at 45 degrees): a blue arrow panel
// carries the title, and five video panels sit around it. Each polygon gets its own box
// and clip-path so a video fills its whole facet.
const W = 495;
const H = 708;
const panel = [[0, 105], [255, 360], [0, 615]];
// Five equal diamonds on a 45-degree grid wrap the arrow in a chevron: two run along each edge of the arrow and one
// sits on its tip, so every panel shares a straight edge with its neighbour. Top to bottom they follow the list.
const HALF = 116; // half-width and half-height of each diamond
const centers = [[139, 128], [255, 244], [371, 360], [255, 476], [139, 592]];
const diamond = ([cx, cy]) => [[cx, cy - HALF], [cx + HALF, cy], [cx, cy + HALF], [cx - HALF, cy]];
const photos = centers.map(diamond);
const GAP = 3.5; // clear space between neighbouring panels, in canvas units
const onEdge = ([ax, ay], [bx, by]) => (ax === 0 && bx === 0) || (ay === 0 && by === 0) || (ay === H && by === H) || (ax === W && bx === W);
/** Pulls every edge of a convex polygon inwards by GAP (edges lying on the poster border stay put), so panels never touch or overlap. */
const inset = (poly) => {
  const n = poly.length;
  let area = 0;
  poly.forEach(([x, y], i) => { const [x2, y2] = poly[(i + 1) % n]; area += x * y2 - x2 * y; });
  const sign = area > 0 ? 1 : -1; // winding, so the offset always points inwards
  const lines = poly.map((a, i) => {
    const b = poly[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = (-(b[1] - a[1]) / len) * sign; const ny = ((b[0] - a[0]) / len) * sign;
    const d = onEdge(a, b) ? 0 : GAP;
    return { px: a[0] + nx * d, py: a[1] + ny * d, dx: (b[0] - a[0]) / len, dy: (b[1] - a[1]) / len };
  });
  return lines.map((l2, i) => {
    const l1 = lines[(i + n - 1) % n];
    const cross = l1.dx * l2.dy - l1.dy * l2.dx;
    const t = ((l2.px - l1.px) * l2.dy - (l2.py - l1.py) * l2.dx) / cross;
    return [l1.px + l1.dx * t, l1.py + l1.dy * t];
  });
};
const shape = (rawPoly, gap = true) => {
  const poly = gap ? inset(rawPoly) : rawPoly;
  const xs = poly.map((p) => p[0]); const ys = poly.map((p) => p[1]);
  const x0 = Math.min(...xs); const x1 = Math.max(...xs); const y0 = Math.min(...ys); const y1 = Math.max(...ys);
  return {
    box: { left: `${(x0 / W) * 100}%`, top: `${(y0 / H) * 100}%`, width: `${((x1 - x0) / W) * 100}%`, height: `${((y1 - y0) / H) * 100}%` },
    clipPath: `polygon(${poly.map(([x, y]) => `${(((x - x0) / (x1 - x0)) * 100).toFixed(2)}% ${(((y - y0) / (y1 - y0)) * 100).toFixed(2)}%`).join(',')})`,
  };
};
const panelShape = shape(panel);
const photoShapes = photos.map((poly) => shape(poly));

export default function IndustriesTarget() {
  const [active, setActive] = React.useState(1);
  return <section className="section it-section" id="industries-we-target" aria-labelledby="it-title"><div className="container it-wrap">
    <Reveal className="it-poster-wrap"><div className="it-poster" role="group" aria-label="Industry videos" style={{ aspectRatio: `${W} / ${H}` }}>
      {industries.map((item, i) => <Link key={item.title} href={`/insights/${item.slug}`} aria-label={`${item.title}: read the insight`} className={`it-photo${active === i ? ' is-active' : ''}`} style={{ ...photoShapes[i].box, clipPath: photoShapes[i].clipPath }} onMouseEnter={() => setActive(i)}>
        <ArchVideo src={item.video} poster={item.poster} />
      </Link>)}
      <div className="it-panel" style={{ ...panelShape.box, clipPath: panelShape.clipPath }} />
      <div className="it-title"><span>Industries we</span><strong>TARGET</strong></div>
    </div></Reveal>
    <Reveal className="it-stats" delay={80}>
      <h2 className="it-heading" id="it-title">Industries we<br />TARGET</h2>
      <p className="it-lede">Each industry comes with one real number that shows the problem, or the gain from fixing it.</p>
      <ul className="it-list">{industries.map((item, i) => <li key={item.title}>
        <Link href={`/insights/${item.slug}`} className={`it-row${active === i ? ' is-active' : ''}`} style={{ '--tone': item.tone }} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
          <span className="it-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icons[item.icon]}</svg></span>
          <strong className="it-stat">{item.stat}</strong>
          <span className="it-row-copy"><b>{item.title}</b><span>{item.label}</span><small>{item.fix}</small></span>
          <span className="it-go" aria-hidden="true"><Arrow diagonal /></span>
        </Link>
      </li>)}</ul>
    </Reveal>
  </div></section>;
}
