// Generates topic-specific card illustrations (insights, industries, impact, capabilities).
// Deterministic, dependency-free SVG written to public/assets/cards.
// Palette matches scripts/generate-art.mjs: white/mint base, Scalric green, blue and gold accents.
// Re-run with: node scripts/generate-card-art.mjs [outDir]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(dirname(fileURLToPath(import.meta.url)), '../public/assets/cards');
mkdirSync(out, { recursive: true });

const W = 800;
const H = 500;
const GREEN = '#2950ad';
const DEEP = '#133075';
const MINT = '#6e94ed';
const BLUE = '#1543ae';
const SKY = '#dae2f4';
const GOLD = '#f2b53a';
const INK = '#0e162a';
const PANE = '#ffffff';
const SOFT = '#f3f5fa';
const r1 = (n) => Math.round(n * 10) / 10;

function frame(id, body, { glowX = 30, glowY = 75, glow = GREEN } = {}) {
  let g = '';
  for (let x = 0; x <= W; x += 50) g += `M${x} 0V${H}`;
  for (let y = 0; y <= H; y += 50) g += `M0 ${y}H${W}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
<defs>
<radialGradient id="${id}-glow" cx="${glowX}%" cy="${glowY}%" r="65%"><stop offset="0" stop-color="${glow}" stop-opacity=".38"/><stop offset=".45" stop-color="${BLUE}" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${MINT}"/><stop offset="1" stop-color="${GREEN}"/></linearGradient>
<linearGradient id="${id}-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${SKY}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient>
<filter id="${id}-sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="11" flood-color="${DEEP}" flood-opacity=".2"/></filter>
<filter id="${id}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="${SOFT}"/>
<rect width="${W}" height="${H}" fill="url(#${id}-glow)"/>
<path d="${g}" stroke="${INK}" stroke-opacity=".05" fill="none"/>
${body}
</svg>
`;
}

// ---------- primitives ----------
const panel = (id, x, y, w, h, { r = 14, fill = PANE, so = 0.12, shadow = true } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${INK}" stroke-opacity="${so}"${shadow ? ` filter="url(#${id}-sh)"` : ''}/>`;
const line = (x1, y1, x2, y2, c = INK, o = 0.25, w = 2, cap = 'round') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="${cap}"/>`;
const circ = (cx, cy, r, fill, o = 1, stroke = 'none', sw = 0) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="${o}" stroke="${stroke}" stroke-width="${sw}"/>`;
const glowBlob = (id, cx, cy, r, c = GREEN, o = 0.3) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity="${o}" filter="url(#${id}-blur)"/>`;
const path = (d, stroke, { w = 2, o = 1, fill = 'none', dash = '' } = {}) =>
  `<path d="${d}" stroke="${stroke}" stroke-opacity="${o}" stroke-width="${w}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const star4 = (cx, cy, r, fill = GOLD, o = 1) =>
  `<path d="M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z" fill="${fill}" fill-opacity="${o}"/>`;
const check = (cx, cy, s = 1, c = '#fff') =>
  `<polyline points="${cx - 9 * s},${cy} ${cx - 3 * s},${cy + 7 * s} ${cx + 10 * s},${cy - 8 * s}" fill="none" stroke="${c}" stroke-width="${4 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
function gear(cx, cy, r, teeth, fill, { stroke = DEEP, o = 1, hole = 0.38 } = {}) {
  const pts = [];
  const n = teeth * 4;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 4 < 2 ? r : r * 0.8;
    pts.push(`${r1(cx + Math.cos(a) * rad)},${r1(cy + Math.sin(a) * rad)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" fill-opacity="${o}" stroke="${stroke}" stroke-opacity=".55" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="${cx}" cy="${cy}" r="${r * hole}" fill="${SOFT}" stroke="${stroke}" stroke-opacity=".4"/>`;
}
const person = (cx, cy, s = 1, c = DEEP, bg = PANE) =>
  `<circle cx="${cx}" cy="${cy - 9 * s}" r="${7 * s}" fill="${c}"/><path d="M${cx - 13 * s} ${cy + 14 * s}a${13 * s} ${13 * s} 0 0 1 ${26 * s} 0z" fill="${c}"/>`;
const heartPath = (cx, cy, s) =>
  `M${cx} ${cy + 28 * s}C${cx - 60 * s} ${cy - 5 * s} ${cx - 34 * s} ${cy - 48 * s} ${cx} ${cy - 20 * s}C${cx + 34 * s} ${cy - 48 * s} ${cx + 60 * s} ${cy - 5 * s} ${cx} ${cy + 28 * s}Z`;
const rows = (x, y, n, w, gap = 14, c = INK, o = 0.14) =>
  Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${i % 2 ? w * 0.7 : w}" height="6" rx="3" fill="${c}" fill-opacity="${o}"/>`).join('');

// ---------- INSIGHTS ----------
function insightData() {
  const id = 'idata';
  let body = '';
  for (let k = 0; k < 3; k++) {
    const y = 80 + k * 115;
    body += panel(id, 60, y, 160, 90, { r: 12 });
    body += `<rect x="72" y="${y + 12}" width="50" height="8" rx="4" fill="${k === 1 ? BLUE : GREEN}" fill-opacity=".8"/>${rows(72, y + 32, 3, 136, 16)}`;
    body += path(`M220 ${y + 45}C290 ${y + 45} 300 250 350 250`, k === 1 ? BLUE : GREEN, { w: 2, o: 0.7 });
    body += circ(220, y + 45, 5, k === 1 ? BLUE : GREEN);
  }
  body += glowBlob(id, 400, 250, 70, GOLD, 0.35);
  body += circ(400, 250, 52, `url(#${id}-g)`) + circ(400, 250, 52, 'none', 1, DEEP, 1.5) + star4(400, 250, 24, '#fff');
  body += path('M452 250H520', GREEN, { w: 3 }) + `<polygon points="520,240 540,250 520,260" fill="${GREEN}"/>`;
  body += panel(id, 545, 90, 195, 320, { r: 16 });
  body += `<rect x="565" y="112" width="70" height="10" rx="5" fill="${INK}" fill-opacity=".2"/>`;
  [60, 100, 80, 150, 190].forEach((h, i) => {
    body += `<rect x="${566 + i * 32}" y="${340 - h}" width="22" height="${h}" rx="5" fill="${i === 4 ? GREEN : GREEN}" fill-opacity="${i === 4 ? 1 : 0.28}"/>`;
  });
  body += path('M572 300L604 262L636 276L668 218L700 160', BLUE, { w: 2.5, o: 0.8 }) + circ(700, 160, 6, BLUE);
  body += circ(690, 372, 20, GOLD) + check(690, 372, 0.75, INK) + rows(565, 362, 2, 85, 14, INK, 0.16);
  return frame(id, body, { glowX: 80, glowY: 30 });
}

function insightAi() {
  const id = 'iai';
  let body = '';
  const cx = 400, cy = 250;
  const pins = [-68, -34, 0, 34, 68];
  const nodes = [[110, 120], [110, 250], [110, 380], [690, 120], [690, 250], [690, 380]];
  nodes.forEach(([x, y], i) => {
    const left = x < 400;
    const py = cy + pins[[0, 2, 4, 0, 2, 4][i]];
    body += path(`M${x} ${y}C${left ? x + 100 : x - 100} ${y} ${left ? 250 : 550} ${py} ${left ? 290 : 510} ${py}`, i % 2 ? BLUE : GREEN, { w: 1.6, o: 0.55 });
    body += circ(x, y, 14, PANE, 1, i % 2 ? BLUE : GREEN, 2) + circ(x, y, 5, i % 2 ? BLUE : GREEN);
  });
  pins.forEach((p) => {
    body += line(290, cy + p, 262, cy + p, DEEP, 0.5, 4) + line(510, cy + p, 538, cy + p, DEEP, 0.5, 4);
    body += line(cx + p, 140, cx + p, 112, DEEP, 0.5, 4) + line(cx + p, 360, cx + p, 388, DEEP, 0.5, 4);
  });
  body += glowBlob(id, cx, cy, 90, GOLD, 0.4);
  body += panel(id, 290, 140, 220, 220, { r: 34 });
  body += `<rect x="318" y="168" width="164" height="164" rx="22" fill="url(#${id}-g)" fill-opacity=".55" stroke="${DEEP}" stroke-opacity=".35"/>`;
  body += star4(cx, cy, 58, '#fff') + star4(cx + 46, cy - 46, 16, GOLD) + star4(cx - 50, cy + 44, 11, GOLD, 0.8);
  return frame(id, body, { glowX: 50, glowY: 50, glow: GOLD });
}

function insightProcess() {
  const id = 'iproc';
  const pts = [[80, 340], [240, 270], [400, 250], [560, 200], [720, 280]];
  let body = path('M80 340C160 340 160 270 240 270S330 250 400 250S490 200 560 200S650 280 720 280', GREEN, { w: 4, o: 0.55, dash: '2 10' });
  body += path('M80 340C160 340 160 270 240 270S330 250 400 250S490 200 560 200S650 280 720 280', BLUE, { w: 1.5, o: 0.3 });
  pts.forEach(([x, y], i) => {
    body += glowBlob(id, x, y, 34, i === 3 ? GOLD : GREEN, 0.22);
    body += `<circle cx="${x}" cy="${y}" r="34" fill="${PANE}" stroke="${i === 3 ? GOLD : GREEN}" stroke-width="3" filter="url(#${id}-sh)"/>`;
  });
  // glyphs
  body += `<rect x="64" y="328" width="32" height="22" rx="4" fill="none" stroke="${DEEP}" stroke-width="2.5"/><polyline points="64,330 80,342 96,330" fill="none" stroke="${DEEP}" stroke-width="2.5" stroke-linejoin="round"/>`;
  body += gear(240, 270, 17, 8, MINT, { hole: 0.35 });
  body += `<rect x="386" y="236" width="28" height="30" rx="4" fill="none" stroke="${DEEP}" stroke-width="2.5"/>${rows(391, 244, 3, 18, 7, DEEP, 0.7)}`;
  body += circ(560, 200, 15, GOLD) + check(560, 200, 0.7, INK);
  body += path('M708 276Q720 296 732 276', DEEP, { w: 2.5 }) + circ(710, 268, 2.5, DEEP) + circ(730, 268, 2.5, DEEP) + circ(720, 280, 17, 'none', 1, DEEP, 2.5);
  // human in the loop
  body += circ(400, 130, 28, PANE, 1, BLUE, 2) + person(400, 134, 0.9, BLUE);
  body += path('M400 160V214', BLUE, { w: 2, o: 0.6, dash: '4 6' });
  body += path('M372 130A30 30 0 0 1 425 108', BLUE, { w: 2, o: 0.5 }) + `<polygon points="425,100 433,114 418,114" fill="${BLUE}" fill-opacity=".6"/>`;
  return frame(id, body, { glowX: 50, glowY: 70 });
}

// ---------- INDUSTRIES ----------
function indFinance() {
  const id = 'ifin';
  let body = '';
  [[40, 270, 60, 230], [110, 220, 50, 280], [170, 300, 70, 200], [560, 250, 60, 250], [630, 190, 55, 310], [695, 280, 65, 220]].forEach(([x, y, w, h], i) => {
    body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i % 2 ? BLUE : GREEN}" fill-opacity=".1"/>`;
  });
  body += panel(id, 150, 70, 440, 300, { r: 18 });
  for (let i = 0; i < 5; i++) body += line(180, 120 + i * 50, 560, 120 + i * 50, INK, 0.07, 1);
  const candles = [[300, 330, 270, 310], [280, 320, 255, 295], [260, 300, 235, 275], [270, 310, 230, 240], [225, 290, 200, 215], [215, 260, 175, 240], [195, 240, 160, 180], [175, 205, 140, 190], [150, 190, 115, 135]];
  candles.forEach(([lo, op, hi, cl], i) => {
    const x = 185 + i * 43;
    const up = cl < op;
    const col = up ? GREEN : BLUE;
    body += line(x, hi, x, lo, col, 0.8, 2.5);
    body += `<rect x="${x - 11}" y="${Math.min(op, cl)}" width="22" height="${Math.abs(op - cl) + 4}" rx="4" fill="${col}" fill-opacity="${up ? 0.9 : 0.55}"/>`;
  });
  body += path('M185 330L228 305L271 282L314 262L357 244L400 226L443 190L486 160L529 130', GOLD, { w: 3, o: 0.9 });
  [0, 1, 2].forEach((k) => {
    for (let j = 0; j < 4 - k; j++) {
      body += `<ellipse cx="${660 + k * 46}" cy="${420 - j * 14}" rx="34" ry="12" fill="${GOLD}" stroke="${INK}" stroke-opacity=".25"/>`;
    }
    body += `<ellipse cx="${660 + k * 46}" cy="${420 - (3 - k) * 14}" rx="22" ry="7" fill="none" stroke="${INK}" stroke-opacity=".25"/>`;
  });
  return frame(id, body, { glowX: 25, glowY: 80, glow: GOLD });
}

function indHealth() {
  const id = 'ihealth';
  let body = '';
  for (let i = 0; i < 14; i++) {
    const y = 70 + i * 28;
    const x1 = 110 + Math.sin(i * 0.7) * 38;
    const x2 = 110 - Math.sin(i * 0.7) * 38;
    body += line(x1, y, x2, y, INK, 0.12, 2);
    body += circ(x1, y, 6, i % 2 ? BLUE : GREEN) + circ(x2, y, 6, i % 2 ? GREEN : BLUE);
  }
  body += glowBlob(id, 400, 230, 100, GREEN, 0.4);
  body += panel(id, 290, 100, 220, 220, { r: 44 });
  body += `<rect x="312" y="122" width="176" height="176" rx="32" fill="url(#${id}-g)"/>`;
  body += `<rect x="378" y="150" width="44" height="120" rx="10" fill="#fff"/><rect x="340" y="188" width="120" height="44" rx="10" fill="#fff"/>`;
  body += path('M60 420H250L280 420L300 360L330 470L360 395L380 420H740', BLUE, { w: 4, o: 0.85 });
  body += circ(380, 420, 7, BLUE);
  body += `<path d="${heartPath(640, 190, 1.25)}" fill="${GREEN}" fill-opacity=".22" stroke="${DEEP}" stroke-opacity=".5" stroke-width="2"/>`;
  body += panel(id, 585, 270, 110, 56, { r: 12 }) + rows(600, 285, 2, 80, 14, INK, 0.18) + circ(680, 262, 14, GOLD) + `<rect x="676" y="254" width="8" height="16" rx="2" fill="#fff"/><rect x="672" y="258" width="16" height="8" rx="2" fill="#fff"/>`;
  return frame(id, body, { glowX: 50, glowY: 40 });
}

function indManufacturing() {
  const id = 'iman';
  let body = '';
  // factory
  body += `<path d="M540 380V250L590 220V250L640 220V250L690 220V250L740 220V380Z" fill="${INK}" fill-opacity=".08" stroke="${INK}" stroke-opacity=".15"/>`;
  body += `<rect x="700" y="130" width="26" height="100" fill="${INK}" fill-opacity=".1"/>`;
  [[713, 110, 14], [722, 80, 20], [735, 48, 26]].forEach(([x, y, r], i) => { body += circ(x, y, r, GREEN, 0.28 - i * 0.05); });
  for (let i = 0; i < 4; i++) body += `<rect x="${558 + i * 45}" y="300" width="28" height="30" rx="4" fill="${i % 2 ? SKY : MINT}" stroke="${INK}" stroke-opacity=".15"/>`;
  body += gear(290, 215, 115, 12, `url(#${id}-g)`, { hole: 0.3 });
  body += gear(450, 125, 62, 8, `url(#${id}-b)`, { stroke: BLUE, hole: 0.32 });
  body += circ(290, 215, 22, DEEP, 0.7) + circ(450, 125, 14, BLUE, 0.8);
  // conveyor
  body += panel(id, 60, 395, 680, 34, { r: 17, fill: '#fff' });
  for (let i = 0; i < 12; i++) body += circ(90 + i * 56, 412, 8, INK, 0.12, INK, 0);
  [[130, GREEN], [260, BLUE], [390, GOLD], [500, GREEN]].forEach(([x, c], i) => {
    body += `<rect x="${x}" y="352" width="56" height="43" rx="6" fill="${c}" fill-opacity="${i === 2 ? 0.8 : 0.6}" stroke="${INK}" stroke-opacity=".2"/><line x1="${x}" y1="368" x2="${x + 56}" y2="368" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>`;
  });
  body += path('M450 190V250', BLUE, { w: 2, o: 0.4, dash: '3 6' });
  return frame(id, body, { glowX: 35, glowY: 40 });
}

function indRetail() {
  const id = 'iret';
  let body = glowBlob(id, 400, 260, 120, GREEN, 0.28);
  // awning
  for (let i = 0; i < 8; i++) {
    const x = 190 + i * 52;
    body += `<path d="M${x} 120h52v46a26 26 0 0 1-52 0z" fill="${i % 2 ? '#fff' : GREEN}" stroke="${INK}" stroke-opacity=".15"/>`;
  }
  body += `<rect x="190" y="95" width="416" height="30" rx="8" fill="${DEEP}"/>`;
  body += panel(id, 205, 195, 386, 190, { r: 6 });
  body += panel(id, 225, 215, 190, 120, { r: 8, fill: SOFT, shadow: false });
  [[245, 'M0 0'], [305, ''], [365, '']].forEach(([x], i) => {
    body += `<rect x="${x}" y="${290 - i * 14}" width="42" height="${44 + i * 14}" rx="6" fill="${[GREEN, BLUE, GOLD][i]}" fill-opacity=".55"/>`;
  });
  body += panel(id, 450, 225, 110, 160, { r: 6, fill: SOFT, shadow: false }) + circ(540, 310, 5, DEEP);
  body += `<rect x="205" y="385" width="386" height="10" rx="5" fill="${INK}" fill-opacity=".12"/>`;
  // bag
  body += `<path d="M590 270h100l12 170h-124z" fill="${GREEN}" stroke="${DEEP}" stroke-opacity=".5" filter="url(#${id}-sh)"/>`;
  body += path('M620 270v-22a20 20 0 0 1 40 0v22', DEEP, { w: 5, o: 0.8 });
  body += circ(640, 345, 20, '#fff', 0.9) + `<text x="640" y="353" text-anchor="middle" font-family="Georgia,serif" font-size="24" font-weight="700" fill="${DEEP}">%</text>`;
  // tag
  body += `<g transform="rotate(-18 120 270)"><path d="M70 235h90l25 35-25 35H70z" fill="${GOLD}" stroke="${INK}" stroke-opacity=".25"/><circle cx="90" cy="270" r="6" fill="#fff"/><rect x="108" y="262" width="52" height="7" rx="3.5" fill="#fff" fill-opacity=".85"/><rect x="108" y="275" width="34" height="7" rx="3.5" fill="#fff" fill-opacity=".6"/></g>`;
  return frame(id, body, { glowX: 50, glowY: 60 });
}

function indPublic() {
  const id = 'ipub';
  let body = glowBlob(id, 330, 250, 130, BLUE, 0.2);
  // building
  body += `<polygon points="120,185 330,95 540,185" fill="${PANE}" stroke="${INK}" stroke-opacity=".18" filter="url(#${id}-sh)"/><polygon points="170,180 330,115 490,180" fill="${MINT}" fill-opacity=".6"/>`;
  body += circ(330, 160, 14, 'none', 1, DEEP, 2.5) + star4(330, 160, 8, GOLD);
  body += panel(id, 130, 190, 400, 22, { r: 4 });
  for (let i = 0; i < 6; i++) body += `<rect x="${150 + i * 66}" y="214" width="26" height="130" rx="5" fill="#fff" stroke="${INK}" stroke-opacity=".18"/><rect x="${156 + i * 66}" y="218" width="5" height="122" rx="2" fill="${GREEN}" fill-opacity=".35"/>`;
  [0, 1, 2].forEach((k) => { body += `<rect x="${110 - k * 10}" y="${344 + k * 18}" width="${440 + k * 20}" height="18" rx="4" fill="#fff" stroke="${INK}" stroke-opacity=".15"/>`; });
  // flag
  body += line(330, 95, 330, 50, INK, 0.5, 3) + `<path d="M330 50h44l-10 12 10 12h-44z" fill="${BLUE}"/>`;
  // document
  body += panel(id, 585, 130, 150, 200, { r: 14 });
  body += `<rect x="603" y="150" width="60" height="9" rx="4.5" fill="${INK}" fill-opacity=".22"/>${rows(603, 176, 5, 114, 18)}`;
  body += circ(700, 305, 24, GREEN) + check(700, 305, 0.9);
  body += person(610, 400, 0.9, BLUE) + person(650, 400, 0.9, GREEN) + person(690, 400, 0.9, DEEP);
  return frame(id, body, { glowX: 40, glowY: 50, glow: BLUE });
}

function indEmerging() {
  const id = 'iem';
  let body = '';
  [60, 110, 160, 215, 280, 350].forEach((h, i) => {
    body += `<rect x="${90 + i * 62}" y="${440 - h}" width="40" height="${h}" rx="8" fill="${i > 3 ? GREEN : MINT}" fill-opacity="${0.35 + i * 0.1}"/>`;
  });
  body += path('M110 360L172 330L234 285L296 245L358 190L420 130', BLUE, { w: 3, o: 0.55, dash: '2 9' });
  body += glowBlob(id, 520, 230, 90, GOLD, 0.45);
  body += `<g transform="rotate(40 520 250)">
<path d="M520 90C568 130 580 200 570 290H470C460 200 472 130 520 90Z" fill="#fff" stroke="${DEEP}" stroke-opacity=".5" stroke-width="2" filter="url(#${id}-sh)"/>
<path d="M520 90C548 112 562 140 566 170H474C478 140 492 112 520 90Z" fill="${GREEN}"/>
<circle cx="520" cy="215" r="26" fill="${SKY}" stroke="${DEEP}" stroke-width="3"/><circle cx="520" cy="215" r="12" fill="${BLUE}" fill-opacity=".55"/>
<path d="M470 250L430 320L470 300Z" fill="${BLUE}"/><path d="M570 250L610 320L570 300Z" fill="${BLUE}"/>
<path d="M495 290H545L520 380Z" fill="${GOLD}"/><path d="M507 290H533L520 342Z" fill="#fff" fill-opacity=".8"/>
</g>`;
  [[640, 110, 14], [700, 190, 9], [250, 120, 11], [330, 70, 8], [690, 330, 10]].forEach(([x, y, r], i) => { body += star4(x, y, r, i % 2 ? GOLD : GREEN, 0.85); });
  return frame(id, body, { glowX: 60, glowY: 40, glow: GOLD });
}

// ---------- IMPACT: JOURNEY ----------
function jListen() {
  const id = 'jlisten';
  let body = glowBlob(id, 400, 250, 110, GREEN, 0.28);
  body += `<path d="M90 110h250a20 20 0 0 1 20 20v100a20 20 0 0 1-20 20H190l-50 40v-40H90a20 20 0 0 1-20-20V130a20 20 0 0 1 20-20z" fill="#fff" stroke="${INK}" stroke-opacity=".12" filter="url(#${id}-sh)"/>`;
  body += circ(130, 180, 9, BLUE) + circ(165, 180, 9, BLUE, 0.6) + circ(200, 180, 9, BLUE, 0.3);
  body += rows(230, 160, 2, 90, 18, INK, 0.15);
  body += `<path d="M460 230h250a20 20 0 0 1 20 20v100a20 20 0 0 1-20 20h-50v40l-50-40H460a20 20 0 0 1-20-20V250a20 20 0 0 1 20-20z" fill="${GREEN}" filter="url(#${id}-sh)"/>`;
  body += rows(480, 275, 3, 200, 18, '#fff', 0.8) + check(675, 330, 0.8, '#fff');
  // sound waves
  [28, 56, 90, 60, 100, 44, 70, 30].forEach((h, i) => { body += `<rect x="${355 + i * 12}" y="${300 - h / 2 - 40}" width="6" height="${h}" rx="3" fill="${i % 2 ? GREEN : BLUE}" fill-opacity=".75"/>`; });
  // ear-ish: concentric arcs
  [30, 50, 70].forEach((r, i) => { body += path(`M${400 + r * 0.3} ${420 - r}A${r} ${r} 0 0 1 ${400 + r * 0.3} ${420 + r}`, DEEP, { w: 3, o: 0.55 - i * 0.14 }); });
  body += circ(385, 420, 12, DEEP) + person(250, 415, 1.1, BLUE) + person(570, 105, 1.1, GREEN);
  return frame(id, body, { glowX: 50, glowY: 55 });
}

function jBuild() {
  const id = 'jbuild';
  let body = glowBlob(id, 380, 300, 110, GREEN, 0.3);
  const blk = (x, y, c, o = 1, dash = false) =>
    `<rect x="${x}" y="${y}" width="96" height="76" rx="12" fill="${dash ? 'none' : c}" fill-opacity="${o}" stroke="${dash ? DEEP : INK}" stroke-opacity="${dash ? 0.6 : 0.2}" stroke-width="${dash ? 2.5 : 1.5}"${dash ? ' stroke-dasharray="8 8"' : ''}${dash ? '' : ` filter="url(#${id}-sh)"`}/>${dash ? '' : `<rect x="${x + 14}" y="${y + 12}" width="30" height="8" rx="4" fill="#fff" fill-opacity=".7"/>`}`;
  body += blk(150, 330, GREEN) + blk(254, 330, BLUE, 0.8) + blk(358, 330, GREEN, 0.7);
  body += blk(202, 246, MINT) + blk(306, 246, GREEN, 0.9);
  body += blk(254, 162, GOLD, 0.9);
  body += blk(358, 162, GREEN, 1, true);
  body += `<g transform="translate(470 60)">${`<rect x="0" y="0" width="96" height="76" rx="12" fill="${SKY}" stroke="${BLUE}" stroke-opacity=".5" filter="url(#${id}-sh)"/>`}</g>`;
  body += path('M518 138V188', BLUE, { w: 2.5, o: 0.6, dash: '3 6' }) + `<polygon points="509,184 518,200 527,184" fill="${BLUE}" fill-opacity=".7"/>`;
  // wrench
  body += `<g transform="rotate(-40 630 340)"><rect x="619" y="330" width="22" height="130" rx="11" fill="${DEEP}" fill-opacity=".85"/><circle cx="630" cy="320" r="38" fill="${DEEP}" fill-opacity=".85"/><rect x="618" y="270" width="24" height="42" rx="4" fill="${SOFT}"/></g>`;
  body += person(95, 420, 1.1, DEEP);
  return frame(id, body, { glowX: 40, glowY: 70 });
}

function jLearn() {
  const id = 'jlearn';
  let body = glowBlob(id, 330, 280, 110, GREEN, 0.3);
  body += panel(id, 90, 110, 430, 310, { r: 18 });
  [70, 110, 100, 170, 215].forEach((h, i) => {
    body += `<rect x="${130 + i * 76}" y="${380 - h}" width="46" height="${h}" rx="9" fill="${i === 4 ? GREEN : MINT}" fill-opacity="${i === 4 ? 1 : 0.7}"/>`;
  });
  body += path('M153 290L229 262L305 280L381 220L457 168', BLUE, { w: 3, o: 0.9 }) + `<polygon points="446,150 474,160 452,182" fill="${BLUE}"/>`;
  [153, 229, 305, 381].forEach((x, i) => { body += circ(x, [290, 262, 280, 220][i], 5, BLUE); });
  // loop arrow
  body += path('M640 360A80 80 0 1 1 690 250', GREEN, { w: 6, o: 0.8 }) + `<polygon points="672,225 712,255 665,275" fill="${GREEN}"/>`;
  // bulb
  body += glowBlob(id, 640, 160, 60, GOLD, 0.5);
  body += circ(640, 150, 38, GOLD) + `<rect x="624" y="186" width="32" height="26" rx="6" fill="#fff" stroke="${INK}" stroke-opacity=".2"/><rect x="628" y="212" width="24" height="9" rx="4.5" fill="${INK}" fill-opacity=".25"/>`;
  body += path('M626 150Q640 120 654 150', '#fff', { w: 3, o: 0.9 });
  [[-62, -2], [-48, -44], [0, -62], [48, -44], [62, -2]].forEach(([dx, dy]) => { body += line(640 + dx * 0.78, 150 + dy * 0.78, 640 + dx, 150 + dy, GOLD, 0.9, 4); });
  body += check(640, 360, 1, DEEP).replace('fill="none"', 'fill="none"');
  return frame(id, body, { glowX: 35, glowY: 70 });
}

// ---------- IMPACT: METRICS ----------
function mBusiness() {
  const id = 'mbus';
  let body = glowBlob(id, 380, 260, 110, GREEN, 0.3);
  for (let i = 0; i < 5; i++) body += `<path d="M${190 + i * 52} 140h52v38a26 26 0 0 1-52 0z" fill="${i % 2 ? '#fff' : GREEN}" stroke="${INK}" stroke-opacity=".15"/>`;
  body += `<rect x="190" y="116" width="260" height="26" rx="7" fill="${DEEP}"/>`;
  body += panel(id, 200, 205, 240, 150, { r: 6 }) + `<rect x="222" y="228" width="110" height="70" rx="8" fill="${SOFT}"/><rect x="352" y="228" width="68" height="127" rx="6" fill="${SOFT}"/>`;
  body += `<rect x="232" y="250" width="22" height="48" rx="5" fill="${GREEN}" fill-opacity=".6"/><rect x="262" y="236" width="22" height="62" rx="5" fill="${BLUE}" fill-opacity=".5"/><rect x="292" y="262" width="22" height="36" rx="5" fill="${GOLD}" fill-opacity=".7"/>`;
  body += panel(id, 500, 130, 200, 220, { r: 16 });
  [50, 85, 70, 120, 150].forEach((h, i) => { body += `<rect x="${522 + i * 34}" y="${320 - h}" width="22" height="${h}" rx="5" fill="${GREEN}" fill-opacity="${0.3 + i * 0.15}"/>`; });
  body += path('M530 280L564 244L598 256L632 206L666 172', BLUE, { w: 3, o: 0.9 }) + `<polygon points="656,160 680,166 668,186" fill="${BLUE}"/>`;
  body += circ(700, 360, 26, GOLD) + `<text x="700" y="370" text-anchor="middle" font-family="Georgia,serif" font-size="28" font-weight="700" fill="${INK}">%</text>`;
  return frame(id, body, { glowX: 40, glowY: 70 });
}

function mNgo() {
  const id = 'mngo';
  let body = glowBlob(id, 400, 250, 120, GREEN, 0.35);
  const around = [[170, 120], [400, 70], [630, 120], [170, 380], [400, 430], [630, 380]];
  around.forEach(([x, y], i) => {
    body += path(`M${x} ${y}L400 250`, i % 2 ? BLUE : GREEN, { w: 1.8, o: 0.4, dash: '4 7' });
    body += circ(x, y, 34, '#fff', 1, i % 2 ? BLUE : GREEN, 2.5) + person(x, y + 4, 1.05, i % 2 ? BLUE : DEEP);
  });
  body += circ(400, 250, 100, '#fff', 1, 'none', 0).replace('/>', ` filter="url(#${id}-sh)"/>`);
  body += circ(400, 250, 100, 'none', 1, MINT, 6);
  body += `<path d="${heartPath(400, 250, 1.45)}" fill="${GREEN}" stroke="${DEEP}" stroke-opacity=".5" stroke-width="2.5"/>`;
  body += star4(445, 205, 14, '#fff', 0.9);
  return frame(id, body, { glowX: 50, glowY: 50 });
}

function mTech() {
  const id = 'mtech';
  let body = glowBlob(id, 400, 250, 120, BLUE, 0.22);
  body += panel(id, 190, 100, 420, 270, { r: 20 });
  body += `<rect x="208" y="118" width="384" height="234" rx="12" fill="${INK}" fill-opacity=".92"/>`;
  [0, 1, 2].forEach((i) => { body += circ(228 + i * 16, 134, 4, [GREEN, GOLD, BLUE][i]); });
  body += path('M300 215L262 240L300 265', GREEN, { w: 6 }) + path('M500 215L538 240L500 265', GREEN, { w: 6 });
  body += path('M366 275L434 205', GOLD, { w: 6 });
  body += rows(250, 300, 2, 120, 16, '#fff', 0.2) + rows(400, 300, 2, 150, 16, GREEN, 0.4);
  body += `<path d="M150 395h500l-30 -25H180z" fill="#fff" stroke="${INK}" stroke-opacity=".15"/><rect x="340" y="378" width="120" height="7" rx="3.5" fill="${INK}" fill-opacity=".15"/>`;
  body += gear(660, 150, 46, 8, `url(#${id}-g)`, { hole: 0.32 });
  body += path('M640 300A40 40 0 0 1 700 300', DEEP, { w: 4, o: 0.5 }) + path('M625 285A62 62 0 0 1 715 285', DEEP, { w: 4, o: 0.3 }) + circ(670, 318, 6, DEEP, 0.8);
  body += circ(130, 150, 18, GOLD, 0.9) + star4(130, 150, 10, '#fff');
  return frame(id, body, { glowX: 50, glowY: 40, glow: BLUE });
}

// ---------- CAPABILITIES ----------
function capSaas() {
  const id = 'csaas';
  let body = glowBlob(id, 400, 260, 130, GREEN, 0.28);
  body += panel(id, 120, 80, 560, 340, { r: 20 });
  body += `<rect x="120" y="80" width="560" height="42" rx="20" fill="${SOFT}"/><rect x="120" y="102" width="560" height="20" fill="${SOFT}"/>`;
  [0, 1, 2].forEach((i) => { body += circ(148 + i * 20, 101, 5, [GREEN, GOLD, BLUE][i], 0.8); });
  body += `<rect x="300" y="93" width="200" height="16" rx="8" fill="#fff" stroke="${INK}" stroke-opacity=".1"/>`;
  body += `<rect x="136" y="138" width="110" height="266" rx="12" fill="${SOFT}"/>`;
  [0, 1, 2, 3].forEach((i) => { body += `<rect x="150" y="${158 + i * 36}" width="${i === 0 ? 82 : 70}" height="22" rx="7" fill="${i === 0 ? GREEN : INK}" fill-opacity="${i === 0 ? 0.85 : 0.1}"/>`; });
  [[262, 138, GREEN], [402, 138, BLUE], [542, 138, GOLD]].forEach(([x, y, c]) => {
    body += `<rect x="${x}" y="${y}" width="124" height="80" rx="12" fill="#fff" stroke="${INK}" stroke-opacity=".1"/><rect x="${x + 12}" y="${y + 12}" width="40" height="8" rx="4" fill="${c}"/><text x="${x + 12}" y="${y + 56}" font-family="Georgia,serif" font-size="26" font-weight="700" fill="${INK}" fill-opacity=".75">${c === GREEN ? '24' : c === BLUE ? '92%' : '8'}</text>`;
  });
  body += `<rect x="262" y="236" width="404" height="168" rx="12" fill="#fff" stroke="${INK}" stroke-opacity=".1"/>`;
  body += `<path d="M280 380L340 340L400 358L470 296L540 312L610 262L650 250V390H280Z" fill="${GREEN}" fill-opacity=".18"/>` + path('M280 380L340 340L400 358L470 296L540 312L610 262L650 250', GREEN, { w: 3 });
  body += `<path d="M640 330l0 52 14-12 12 26 10-5-12-25 18-2z" fill="${GOLD}" stroke="${INK}" stroke-opacity=".5" stroke-width="2" stroke-linejoin="round"/>`;
  body += circ(690, 90, 16, BLUE) + `<text x="690" y="96" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="700" fill="#fff">3</text>`;
  return frame(id, body, { glowX: 30, glowY: 80 });
}

function capAi() {
  const id = 'cai';
  const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i - Math.PI / 6; return `${r1(cx + Math.cos(a) * r)},${r1(cy + Math.sin(a) * r)}`; }).join(' ');
  let body = glowBlob(id, 400, 250, 130, GOLD, 0.35);
  const ring = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i; return [r1(400 + Math.cos(a) * 190), r1(250 + Math.sin(a) * 150)]; });
  ring.forEach(([x, y], i) => {
    body += path(`M400 250L${x} ${y}`, i % 2 ? BLUE : GREEN, { w: 2, o: 0.5 });
    body += `<polygon points="${hex(x, y, 46)}" fill="#fff" stroke="${i % 2 ? BLUE : GREEN}" stroke-width="2.5" filter="url(#${id}-sh)"/>`;
    body += [circ(x, y - 8, 6, i % 2 ? BLUE : GREEN), `<path d="M${x - 14} ${y + 16}a14 12 0 0 1 28 0z" fill="${i % 2 ? BLUE : GREEN}" fill-opacity=".7"/>`].join('');
  });
  ring.forEach(([x, y], i) => { const [nx, ny] = ring[(i + 1) % 6]; body += path(`M${x} ${y}L${nx} ${ny}`, INK, { w: 1.2, o: 0.12, dash: '3 6' }); });
  body += `<polygon points="${hex(400, 250, 92)}" fill="url(#${id}-g)" stroke="${DEEP}" stroke-opacity=".5" stroke-width="2.5" filter="url(#${id}-sh)"/>`;
  body += star4(400, 250, 50, '#fff') + star4(448, 200, 14, GOLD) + star4(352, 300, 10, GOLD, 0.9);
  return frame(id, body, { glowX: 50, glowY: 50, glow: GOLD });
}

function capData() {
  const id = 'cdata';
  let body = glowBlob(id, 400, 250, 120, BLUE, 0.2);
  // database
  const db = (cx, cy) => `<path d="M${cx - 70} ${cy - 70}v130a70 24 0 0 0 140 0V${cy - 70}z" fill="${MINT}" stroke="${DEEP}" stroke-opacity=".5" stroke-width="2" filter="url(#${id}-sh)"/>
<ellipse cx="${cx}" cy="${cy - 70}" rx="70" ry="24" fill="#fff" stroke="${DEEP}" stroke-opacity=".5" stroke-width="2"/>
<path d="M${cx - 70} ${cy - 22}a70 24 0 0 0 140 0M${cx - 70} ${cy + 18}a70 24 0 0 0 140 0" fill="none" stroke="${DEEP}" stroke-opacity=".4" stroke-width="2"/>`;
  body += db(150, 255);
  for (let i = 0; i < 4; i++) body += circ(110 + i * 26, 215 + (i % 2) * 38, 4, i % 2 ? BLUE : GREEN);
  body += path('M240 255H300', GREEN, { w: 3.5 }) + `<polygon points="300,245 320,255 300,265" fill="${GREEN}"/>`;
  body += gear(400, 255, 78, 10, `url(#${id}-g)`, { hole: 0.34 }) + gear(472, 168, 38, 7, `url(#${id}-b)`, { stroke: BLUE, hole: 0.3 });
  body += path('M490 255H555', GREEN, { w: 3.5 }) + `<polygon points="555,245 575,255 555,265" fill="${GREEN}"/>`;
  body += panel(id, 585, 150, 170, 200, { r: 16 });
  body += `<circle cx="670" cy="225" r="36" fill="none" stroke="${GREEN}" stroke-opacity=".25" stroke-width="16"/><path d="M670 189A36 36 0 1 1 636 237" fill="none" stroke="${GREEN}" stroke-width="16" stroke-linecap="round"/><path d="M636 237A36 36 0 0 1 645 205" fill="none" stroke="${BLUE}" stroke-width="16" stroke-linecap="round"/>`;
  body += rows(605, 290, 3, 130, 15, INK, 0.16) + circ(730, 175, 7, GOLD);
  return frame(id, body, { glowX: 55, glowY: 55, glow: BLUE });
}

function capConsulting() {
  const id = 'ccon';
  let body = glowBlob(id, 280, 250, 130, GREEN, 0.3);
  [150, 108, 66].forEach((r, i) => { body += circ(280, 250, r, i % 2 ? '#fff' : MINT, i % 2 ? 1 : 0.65, DEEP, 1.5); });
  body += circ(280, 250, 22, GREEN, 1, DEEP, 2);
  body += `<g transform="rotate(-35 280 250)"><line x1="280" y1="250" x2="280" y2="60" stroke="${INK}" stroke-opacity=".65" stroke-width="5" stroke-linecap="round"/><path d="M280 60l-26 -26 M280 60l26 -26 M280 90l-18 -18 M280 90l18 -18" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/></g>`;
  body += path('M440 400C520 400 520 320 580 330S660 260 640 210S580 150 640 110', BLUE, { w: 3.5, o: 0.7, dash: '2 10' });
  [[440, 400], [580, 330], [640, 210]].forEach(([x, y]) => { body += circ(x, y, 14, '#fff', 1, BLUE, 3) + circ(x, y, 5, BLUE); });
  body += line(640, 110, 640, 60, INK, 0.5, 3) + `<path d="M640 60h56l-12 14 12 14h-56z" fill="${GOLD}" stroke="${INK}" stroke-opacity=".3"/>`;
  body += panel(id, 560, 380, 170, 70, { r: 14 }) + rows(578, 398, 3, 130, 14, INK, 0.16);
  return frame(id, body, { glowX: 30, glowY: 50 });
}

const files = {
  'insight-data.svg': insightData, 'insight-ai.svg': insightAi, 'insight-process.svg': insightProcess,
  'ind-finance.svg': indFinance, 'ind-healthcare.svg': indHealth, 'ind-manufacturing.svg': indManufacturing,
  'ind-retail.svg': indRetail, 'ind-public.svg': indPublic, 'ind-emerging.svg': indEmerging,
  'impact-listen.svg': jListen, 'impact-build.svg': jBuild, 'impact-learn.svg': jLearn,
  'metric-businesses.svg': mBusiness, 'metric-ngos.svg': mNgo, 'metric-tech.svg': mTech,
  'cap-saas.svg': capSaas, 'cap-ai.svg': capAi, 'cap-data.svg': capData, 'cap-consulting.svg': capConsulting,
};

for (const [name, build] of Object.entries(files)) {
  writeFileSync(resolve(out, name), build());
  console.log(`wrote ${name}`);
}
