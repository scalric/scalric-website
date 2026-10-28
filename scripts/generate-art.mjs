// Generates the on-brand illustration set used across the site.
// Output is deterministic (seeded), dependency-free SVG written to public/assets/art.
// Palette: white base, Scalric green (primary), blue and gold (secondary accents).
// Re-run with: node scripts/generate-art.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../public/assets/art');
mkdirSync(out, { recursive: true });

const W = 800;
const H = 500;
const GREEN = '#2950ad';
const DEEP = '#133075';
const MINT = '#6e94ed';
const BLUE = '#1543ae';
const GOLD = '#fffc49ff';
const INK = '#0e162a';
const PANE = '#ffffff';
const SOFT = '#f3f5fa';

function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

const round = (n) => Math.round(n * 10) / 10;

function frame(id, body, { glowX = 30, glowY = 75, glow = GREEN } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
<defs>
<radialGradient id="${id}-glow" cx="${glowX}%" cy="${glowY}%" r="65%"><stop offset="0" stop-color="${glow}" stop-opacity=".38"/><stop offset=".45" stop-color="${BLUE}" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}-orb" cx="35%" cy="32%" r="70%"><stop offset="0" stop-color="${MINT}"/><stop offset=".35" stop-color="${GREEN}"/><stop offset=".75" stop-color="${DEEP}" stop-opacity=".7"/><stop offset="1" stop-color="${DEEP}" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}-line" x1="0" x2="1"><stop offset="0" stop-color="${GREEN}" stop-opacity="0"/><stop offset=".5" stop-color="${BLUE}" stop-opacity=".8"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></linearGradient>
<filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="${SOFT}"/>
<rect width="${W}" height="${H}" fill="url(#${id}-glow)"/>
${grid()}
${body}
</svg>
`;
}

function grid() {
  const lines = [];
  for (let x = 0; x <= W; x += 50) lines.push(`M${x} 0V${H}`);
  for (let y = 0; y <= H; y += 50) lines.push(`M0 ${y}H${W}`);
  return `<path d="${lines.join('')}" stroke="${INK}" stroke-opacity=".05" fill="none"/>`;
}

function orb(id, cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r * 1.9}" fill="${GREEN}" opacity=".25" filter="url(#${id}-blur)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-orb)"/>`;
}

function ellipseRing(cx, cy, rx, ry, rot, color = GREEN, opacity = 0.4) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1.2"/>`;
}

function ai() {
  const id = 'ai';
  const r = rng(11);
  const layers = [3, 5, 6, 5, 2];
  const nodes = [];
  layers.forEach((n, li) => {
    for (let i = 0; i < n; i++) nodes.push({ x: 110 + li * 145, y: (H / (n + 1)) * (i + 1) + (r() - 0.5) * 16, li });
  });
  const byLayer = (li) => nodes.filter((node) => node.li === li);
  let edges = '';
  for (let li = 0; li < layers.length - 1; li++) {
    for (const a of byLayer(li)) {
      for (const b of byLayer(li + 1)) {
        const strong = r() > 0.72;
        const color = strong ? (r() > 0.5 ? GREEN : BLUE) : INK;
        edges += `<path d="M${round(a.x)} ${round(a.y)}C${round(a.x + 70)} ${round(a.y)} ${round(b.x - 70)} ${round(b.y)} ${round(b.x)} ${round(b.y)}" stroke="${color}" stroke-opacity="${strong ? 0.8 : 0.12}" stroke-width="${strong ? 1.4 : 1}" fill="none"/>`;
      }
    }
  }
  const dots = nodes.map((node) => `<circle cx="${round(node.x)}" cy="${round(node.y)}" r="${node.li === 4 ? 9 : 5}" fill="${node.li === 4 ? GREEN : PANE}" stroke="${node.li === 4 ? DEEP : GREEN}" stroke-width="1.5"/>`).join('');
  const glows = nodes.filter((n) => n.li === 4).map((n) => `<circle cx="${round(n.x)}" cy="${round(n.y)}" r="26" fill="${GOLD}" opacity=".3" filter="url(#${id}-blur)"/>`).join('');
  return frame(id, `${edges}${glows}${dots}`, { glowX: 75, glowY: 40, glow: GOLD });
}

function saas() {
  const id = 'saas';
  const panes = [
    { x: 150, y: 150, w: 470, h: 230, o: 0.35 },
    { x: 190, y: 120, w: 470, h: 230, o: 0.6 },
    { x: 230, y: 90, w: 470, h: 230, o: 1 },
  ];
  const body = panes.map((p, i) => {
    const bars = [0, 1, 2, 3, 4, 5, 6].map((k) => {
      const h = 30 + ((k * 37 + i * 19) % 90);
      const fill = k === 4 ? GREEN : k === 2 ? BLUE : GREEN;
      return `<rect x="${p.x + 30 + k * 56}" y="${p.y + p.h - 30 - h}" width="28" height="${h}" rx="4" fill="${fill}" fill-opacity="${k === 4 || k === 2 ? 0.9 : 0.22}"/>`;
    }).join('');
    return `<g opacity="${p.o}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="14" fill="${PANE}" stroke="${INK}" stroke-opacity=".12"/>
<rect x="${p.x}" y="${p.y}" width="${p.w}" height="34" rx="14" fill="${SOFT}"/><circle cx="${p.x + 20}" cy="${p.y + 17}" r="4" fill="${INK}" fill-opacity=".3"/><circle cx="${p.x + 36}" cy="${p.y + 17}" r="4" fill="${INK}" fill-opacity=".18"/>
${bars}</g>`;
  }).join('');
  return frame(id, body, { glowX: 20, glowY: 80 });
}

function data() {
  const id = 'data';
  const r = rng(29);
  let cells = '';
  for (let c = 0; c < 16; c++) {
    for (let rr = 0; rr < 8; rr++) {
      const v = r();
      if (v > 0.55) cells += `<rect x="${60 + c * 42}" y="${60 + rr * 46}" width="30" height="30" rx="6" fill="${GREEN}" fill-opacity="${round(v * 0.5)}"/>`;
    }
  }
  const flow = [0, 1, 2].map((k) => {
    const y0 = 160 + k * 80;
    return `<path d="M0 ${y0}C200 ${y0 - 120} 380 ${y0 + 140} 800 ${y0 - 40}" stroke="url(#${id}-line)" stroke-width="2" fill="none"/>`;
  }).join('');
  let particles = '';
  for (let i = 0; i < 26; i++) particles += `<circle cx="${round(r() * W)}" cy="${round(r() * H)}" r="${round(1 + r() * 2.2)}" fill="${i % 4 === 0 ? BLUE : DEEP}" fill-opacity="${round(0.3 + r() * 0.6)}"/>`;
  return frame(id, `${cells}${flow}${particles}`, { glowX: 50, glowY: 100, glow: BLUE });
}

function consulting() {
  const id = 'consulting';
  const rings = [ellipseRing(400, 250, 300, 110, -18, GREEN, 0.5), ellipseRing(400, 250, 220, 80, 22, BLUE, 0.3), ellipseRing(400, 250, 140, 140, 0, GREEN, 0.25)].join('');
  const road = `<path d="M120 380C250 330 300 300 400 250S600 150 700 120" stroke="${BLUE}" stroke-width="2" fill="none" stroke-dasharray="6 8" stroke-opacity=".6"/>`;
  const stops = [[120, 380], [400, 250], [700, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${PANE}" stroke="${GREEN}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="16" fill="${GOLD}" opacity=".2"/>`).join('');
  return frame(id, `${rings}${road}${stops}${orb(id, 400, 250, 58)}`, { glowX: 50, glowY: 50, glow: GOLD });
}


function insight1() {
  const id = 'insight1';
  const lines = [];
  for (let k = 0; k < 22; k++) {
    const base = 60 + k * 16;
    const amp = 30 + k * 1.5;
    let d = '';
    for (let x = -10; x <= W + 10; x += 20) {
      const y = base + amp * Math.sin((x / 130) + k * 0.25) * Math.cos(x / 260);
      d += `${d ? 'L' : 'M'}${x} ${round(y)}`;
    }
    lines.push(`<path d="${d}" stroke="${k % 5 === 0 ? BLUE : GREEN}" stroke-opacity="${round(0.15 + (k / 22) * 0.55)}" stroke-width="1" fill="none"/>`);
  }
  return frame(id, lines.join(''), { glowX: 85, glowY: 20 });
}

function insight2() {
  const id = 'insight2';
  const rings = [];
  for (let k = 1; k <= 9; k++) rings.push(`<circle cx="560" cy="250" r="${k * 34}" fill="none" stroke="${k % 3 === 0 ? GOLD : GREEN}" stroke-opacity="${round(0.6 - k * 0.055)}" stroke-width="1"/>`);
  return frame(id, `${rings.join('')}${orb(id, 560, 250, 70)}`, { glowX: 10, glowY: 90, glow: BLUE });
}

function insight3() {
  const id = 'insight3';
  const r = rng(77);
  let stripes = '';
  for (let k = -4; k < 20; k++) stripes += `<line x1="${k * 48}" y1="0" x2="${k * 48 + 380}" y2="${H}" stroke="${INK}" stroke-opacity=".05"/>`;
  let pts = '';
  for (let i = 0; i < 40; i++) pts += `<circle cx="${round(r() * W)}" cy="${round(r() * H)}" r="${round(1 + r() * 3)}" fill="${i % 6 === 0 ? BLUE : GREEN}" fill-opacity="${round(0.3 + r() * 0.6)}"/>`;
  return frame(id, `${stripes}${pts}${ellipseRing(400, 260, 340, 120, -12, BLUE, 0.3)}`, { glowX: 40, glowY: 60, glow: GREEN });
}

// Impact — green orb over a dotted field
function impact() {
  const id = 'impact';
  let dots = '';
  for (let x = 40; x < W; x += 32) for (let y = 40; y < H; y += 32) {
    const d = Math.hypot(x - 540, y - 240);
    const v = Math.max(0.08, 1 - d / 320);
    dots += `<circle cx="${x}" cy="${y}" r="${round(1 + v * 2.4)}" fill="${GREEN}" fill-opacity="${round(v)}"/>`;
  }
  return frame(id, `${dots}${orb(id, 540, 240, 120)}${ellipseRing(540, 240, 230, 90, -20, BLUE, 0.35)}`, { glowX: 65, glowY: 45, glow: GOLD });
}

function orbart() {
  const id = 'orb';
  return frame(id, `${ellipseRing(400, 250, 260, 110, -24, GREEN, 0.4)}${ellipseRing(400, 250, 260, 110, 36, BLUE, 0.25)}${orb(id, 400, 250, 96)}`, { glowX: 50, glowY: 50, glow: GOLD });
}

const files = {
  'ai.svg': ai, 'saas.svg': saas, 'data.svg': data, 'consulting.svg': consulting,
  'insight-1.svg': insight1, 'insight-2.svg': insight2, 'insight-3.svg': insight3,
  'impact.svg': impact, 'orb.svg': orbart,
};

for (const [name, build] of Object.entries(files)) {
  writeFileSync(resolve(out, name), build());
  console.log(`wrote assets/art/${name}`);
}
