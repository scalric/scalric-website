import React from 'react';

// Palette for the burst: warm gold at the origin, blue toward the tips, brand blue for travelling sparks.
const GOLD = [255, 186, 73];
const BLUE = [17, 85, 217];
const SKY = [191, 219, 254];
const GREEN = [41, 80, 173];

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

function makeRng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function makeRays(count) {
  const rand = makeRng(7);
  return Array.from({ length: count }, () => ({
    angle: -Math.PI * (0.03 + rand() * 0.94),
    length: 0.42 + Math.pow(rand(), 0.6) * 0.58,
    phase: rand() * Math.PI * 2,
    width: 0.6 + rand() * 1.1,
    dot: rand() > 0.3,
    speed: 0.12 + rand() * 0.3,
    spark: rand() < 0.22,
  }));
}

export default function RadialBurst({ rayCount = 240 }) {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rays = makeRays(rayCount);
    const state = { w: 0, h: 0, dpr: 1, ox: 0, oy: 0, R: 0, pointer: null, shocks: [], visible: true, raf: 0 };
    const start = performance.now();

    function resize() {
      const rect = wrap.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(state.w * state.dpr);
      canvas.height = Math.round(state.h * state.dpr);
      state.ox = state.w / 2;
      state.oy = state.h * 0.94;
      state.R = Math.hypot(state.w, state.h) * 0.62;
      if (reduced) draw(performance.now());
    }

    function draw(now) {
      const { w, h, dpr, ox, oy, R, pointer } = state;
      const t = (now - start) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);


      const mist = ctx.createRadialGradient(ox, oy, 0, ox, oy, R * 1.15);
      mist.addColorStop(0, rgba(GOLD, 0.6));
      mist.addColorStop(0.3, rgba(GOLD, 0.24));
      mist.addColorStop(0.62, rgba(SKY, 0.5));
      mist.addColorStop(1, rgba(SKY, 0));
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, w, h);

      const pointerAngle = pointer ? Math.atan2(pointer.y - oy, pointer.x - ox) : null;
      const r0 = R * 0.03;

      for (const ray of rays) {
        let boost = 0;
        if (pointerAngle !== null) {
          const d = Math.atan2(Math.sin(ray.angle - pointerAngle), Math.cos(ray.angle - pointerAngle));
          boost = Math.exp(-(d * d) / 0.025);
        }
        const cos = Math.cos(ray.angle);
        const sin = Math.sin(ray.angle);
        const len = R * ray.length * (1 + 0.035 * Math.sin(t * 0.8 + ray.phase) + 0.22 * boost);
        const x0 = ox + cos * r0;
        const y0 = oy + sin * r0;
        const x1 = ox + cos * len;
        const y1 = oy + sin * len;
        const alpha = 0.34 + boost * 0.55;

        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, rgba(GOLD, alpha * 0.95));
        grad.addColorStop(0.45, rgba(BLUE, alpha * 0.75));
        grad.addColorStop(1, rgba(BLUE, alpha));
        ctx.strokeStyle = grad;
        ctx.lineWidth = ray.width * (1 + boost * 0.7);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        if (ray.dot) {
          ctx.fillStyle = rgba(BLUE, 0.55 + boost * 0.4);
          ctx.beginPath();
          ctx.arc(x1, y1, 1.5 + boost * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }

        if (ray.spark) {
          const k = (t * ray.speed + ray.phase) % 1;
          const sx = ox + cos * R * ray.length * k;
          const sy = oy + sin * R * ray.length * k;
          ctx.fillStyle = rgba(GREEN, 0.9 * Math.sin(k * Math.PI));
          ctx.beginPath();
          ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }


      state.shocks = state.shocks.filter((s) => now - s.at < 1600);
      for (const shock of state.shocks) {
        const p = (now - shock.at) / 1600;
        ctx.strokeStyle = rgba(GREEN, 0.7 * (1 - p));
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(shock.x, shock.y, p * R * 0.7, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function loop(now) {
      draw(now);
      state.raf = state.visible ? requestAnimationFrame(loop) : 0;
    }

    function startLoop() {
      if (!state.raf && !reduced) state.raf = requestAnimationFrame(loop);
    }

    const onMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      state.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onLeave = () => { state.pointer = null; };
    const onClick = (event) => {
      const rect = wrap.getBoundingClientRect();
      state.shocks.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, at: performance.now() });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) startLoop();
    });
    io.observe(wrap);

    const target = wrap.parentElement;
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerleave', onLeave);
    target.addEventListener('click', onClick);
    startLoop();

    return () => {
      cancelAnimationFrame(state.raf);
      observer.disconnect();
      io.disconnect();
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerleave', onLeave);
      target.removeEventListener('click', onClick);
    };
  }, [rayCount]);

  return <div ref={wrapRef} className="burst" aria-hidden="true">
    <canvas ref={canvasRef} className="burst-canvas" />
  </div>;
}
