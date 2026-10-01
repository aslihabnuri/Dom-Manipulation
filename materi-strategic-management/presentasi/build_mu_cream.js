const pptxgen = require('pptxgenjs');
const fs = require('fs');
const { execSync } = require('child_process');
const NOTES = JSON.parse(fs.readFileSync('mu_cream/notes_v3.json', 'utf8'));
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Kelompok 4';
pptx.title = 'Chapter 4 · Manchester United';
const W = 13.333, H = 7.5, MINPT = 10;
const BG = 'mu_cream/img/bg_paper.jpg';
fs.mkdirSync('mu_cream/img8', { recursive: true });

// ---------- design tokens ----------
const C = { cream: 'F4ECDC', cream2: 'EBE1CC', beige: 'E2D4BB', red: 'A6121B', mu: 'DA291C', gold: 'C9A24A', gold2: 'E6CF93', ink: '2B1A14', ink2: '6B5243', white: 'FFFFFF', line: 'D6C7A8' };
const F = { x: 'Poppins ExtraBold', s: 'Poppins SemiBold', m: 'Poppins Medium', r: 'Poppins' };
// type scale (pt): 10 label · 10.5/11 body · 12.5 head · 14 subhead · 26 title · 34 big number · 54 display
const T = { label: 10, body: 10.5, body2: 11, head: 12.5, sub: 14, title: 26, num: 30, display: 54 };
// grid: 12 columns, margin 0.6, gutter 0.2
const M = 0.6, G = 0.2, CW = W - 2 * M, COL = (CW - 11 * G) / 12;
const gx = i => M + i * (COL + G);
const gw = n => n * COL + (n - 1) * G;
const BOT = 6.85; // content bottom
const RW = 9.3 - M; // content width beside a right-bleed photo
let pageNo = 0;
const LAYOUT = [];
function rec(kind, x, y, w, h, extra) { LAYOUT.push(Object.assign({ slide: pageNo, kind, x, y, w, h }, extra || {})); }
const clean = t => t.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '\n');
function notes(s, key) { if (key && NOTES[key]) s.addNotes(clean(NOTES[key])); }

// ---------- text measurement ----------
const KW = { 'Poppins ExtraBold': 0.66, 'Poppins SemiBold': 0.61, 'Poppins Medium': 0.59, 'Poppins': 0.57 };
function estH(text, o, w, scale = 1) {
  const runs = typeof text === 'string' ? [{ text, options: {} }] : text;
  const paras = [[]];
  for (const r of runs) {
    const parts = r.text.split('\n');
    parts.forEach((pt, i) => { if (i > 0) paras.push([]); paras[paras.length - 1].push({ t: pt, o: r.options || {} }); });
    if (r.options && r.options.breakLine) paras.push([]);
  }
  let total = 0;
  for (const p of paras) {
    if (!p.some(r => r.t)) continue;
    let width = 0, size = 0, psa = 0, bullet = false;
    for (const r of p) {
      const face = r.o.fontFace || o.fontFace || 'Poppins'; const sz = (r.o.fontSize || o.fontSize || 11) * scale;
      const cs = (r.o.charSpacing || o.charSpacing || 0);
      width += r.t.length * (sz * KW[face] + cs) / 72; size = Math.max(size, sz);
      psa = Math.max(psa, r.o.paraSpaceAfter || 0); if (r.o.bullet) bullet = true;
    }
    const avail = w - (bullet ? 14 / 72 : 0) - 0.03;
    const lines = Math.max(1, Math.ceil(width * 1.06 / avail));
    total += lines * size * 1.2 * (o.lineSpacingMultiple || 1) / 72 + psa / 72;
  }
  return total;
}
const PAD = 0.16;
function txt(s, text, x, y, w, h, o = {}) {
  if (o.clamp !== false) {
    const conts = LAYOUT.filter(r => r.slide === pageNo && r.kind === 'container');
    const cx = x + w / 2, cy = y + h / 2; let c = null;
    for (const r of conts) if (r.x <= cx && cx <= r.x + r.w && r.y <= cy && cy <= r.y + r.h) c = r;
    if (c) {
      const ix = c.x + PAD, iy = c.y + PAD * 0.7, ix2 = c.x + c.w - PAD, iy2 = c.y + c.h - PAD * 0.7;
      if (x < ix) { w -= ix - x; x = ix; } if (x + w > ix2) w = ix2 - x;
      if (y < iy) { h -= iy - y; y = iy; } if (y + h > iy2) h = iy2 - y;
    }
  }
  if (o.fit !== false) {
    const base = o.fontSize || 11; const floor = Math.min(1, Math.max(MINPT / base, 0.6));
    let scale = 1;
    while (scale - 0.04 >= floor - 1e-6 && estH(text, o, w, scale) > h) scale -= 0.04;
    if (scale < 1) {
      const sc = r => Object.assign({}, r, { options: Object.assign({}, r.options, r.options && r.options.fontSize ? { fontSize: Math.max(MINPT, Math.round(r.options.fontSize * scale * 2) / 2) } : {}) });
      if (typeof text !== 'string') text = text.map(sc);
      o = Object.assign({}, o, { fontSize: Math.max(MINPT, Math.round(base * scale * 2) / 2) });
    }
  }
  rec('text', x, y, w, h, { text, o });
  s.addText(text, Object.assign({ x, y, w, h, fontFace: F.r, fontSize: 11, color: C.ink, margin: 0, valign: 'top', paraSpaceAfter: 0 }, o));
}
function rect(s, x, y, w, h, fill, o = {}) {
  rec('container', x, y, w, h, { path: 'rect' });
  s.addShape(pptx.ShapeType.rect, Object.assign({ x, y, w, h, fill: { color: fill }, line: o.line ? { color: o.line, width: o.lw || 0.75 } : { color: fill, width: 0 } }, o.extra || {}));
}
function rule(s, x, y, w, color = C.gold, t = 0.012) { s.addShape(pptx.ShapeType.rect, { x, y, w, h: t, fill: { color }, line: { color, width: 0 } }); }
function vrule(s, x, y, h, color = C.gold, t = 0.012) { s.addShape(pptx.ShapeType.rect, { x, y, w: t, h, fill: { color }, line: { color, width: 0 } }); }
// photo: cropped to the exact box ratio by pic.py; optional fades into the paper; optional gold frame
function pic(s, name, x, y, w, h, o = {}) {
  const fades = o.fade || '-', fx = o.fx === undefined ? 0.5 : o.fx, fy = o.fy === undefined ? 0.5 : o.fy, ff = o.ff || 0.25;
  const key = `${name}_${Math.round(x * 100)}_${Math.round(y * 100)}_${Math.round(w * 100)}x${Math.round(h * 100)}_${fades}_${fx}_${fy}_${ff}`;
  const out = `mu_cream/img8/${key}.jpg`;
  const src = fs.existsSync(`mu_cream/img/${name}.jpg`) ? `mu_cream/img/${name}.jpg` : `mu_cream/img/${name}.png`;
  if (!fs.existsSync(out)) execSync(`python3 mu_cream/pic.py "${src}" ${x} ${y} ${w} ${h} ${fades} ${BG} "${out}" ${fx} ${fy} ${ff}`);
  if (o.frame) s.addShape(pptx.ShapeType.rect, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: C.white }, line: { color: C.gold, width: 1.5 } });
  rec('image', x, y, w, h, { path: out });
  s.addImage({ path: out, x, y, w, h });
}
// right-bleed photo column: x 9.6 → edge, from the content top to the bottom edge, fading in from the left and top
function bleedRight(s, name, top, o = {}) { pic(s, name, 9.6, 1.7, W - 9.6, H - 1.7, Object.assign({ fade: 'lt' }, o)); }
function card(s, x, y, w, h, o = {}) { rect(s, x, y, w, h, o.fill || C.white, { line: o.line || C.gold, lw: 0.75 }); }
function redcard(s, x, y, w, h) { rect(s, x, y, w, h, C.red); }
function tag(s, text, x, y, w, color = C.red, o = {}) {
  s.addShape(pptx.ShapeType.rect, { x, y: y + 0.06, w: 0.18, h: 0.18, fill: { color }, line: { color, width: 0 } });
  txt(s, text, x + 0.28, y, w - 0.28, 0.3, Object.assign({ fontFace: F.s, fontSize: T.label, color, charSpacing: 1.5, valign: 'middle', clamp: false }, o));
}
function label(s, text, x, y, w, color = C.red, o = {}) { const lo = Object.assign({ fontFace: F.s, fontSize: T.label, color, charSpacing: 1.5 }, o); const h = estH(text, lo, w) > 0.22 ? 0.44 : 0.24; txt(s, text, x, y, w, h, lo); return h; }
// headed card: optional label, head, body
function note(s, x, y, w, h, o = {}) {
  card(s, x, y, w, h, o);
  let cy = y + 0.18;
  if (o.tag) { label(s, o.tag, x + PAD, cy, w - 2 * PAD, o.tagColor || C.red); cy += 0.28; }
  if (o.head) { const hh = o.headH || 0.3; txt(s, o.head, x + PAD, cy, w - 2 * PAD, hh, { fontFace: F.x, fontSize: o.headSize || T.head, color: o.headColor || C.red, lineSpacingMultiple: 0.95 }); cy += hh + 0.06; }
  if (o.body) txt(s, o.body, x + PAD, cy, w - 2 * PAD, y + h - cy - 0.14, { fontFace: F.r, fontSize: o.bodySize || T.body, color: C.ink, lineSpacingMultiple: 1.12 });
}
// open (box-less) block: head with gold rule, then body
function block(s, x, y, w, h, o = {}) {
  let cy = y;
  if (o.tag) { label(s, o.tag, x, cy, w, o.tagColor || C.red); cy += 0.28; }
  if (o.head) { const hh = o.headH || 0.32; txt(s, o.head, x, cy, w, hh, { fontFace: F.x, fontSize: o.headSize || T.head, color: o.headColor || C.red, lineSpacingMultiple: 0.95, clamp: false }); cy += hh; rule(s, x, cy + 0.04, w); cy += 0.14; }
  if (o.body) txt(s, o.body, x, cy, w, y + h - cy, { fontFace: F.r, fontSize: o.bodySize || T.body, color: o.bodyColor || C.ink, lineSpacingMultiple: 1.12, clamp: false });
}
// red banner: label + body in white; grows if needed
function banner(s, x, y, w, h, lab, body, o = {}) {
  const px = x + 0.3, pw = w - 0.6;
  const pad = o.tight ? 0.12 : 0.18;
  const bo = { fontFace: F.m, fontSize: o.size || T.body2, color: C.white, lineSpacingMultiple: o.tight ? 1.0 : 1.1 };
  const lo = { fontFace: F.s, fontSize: T.label, charSpacing: 1.5 };
  const lh = lab ? (estH(lab, lo, pw) > 0.22 ? 0.48 : 0.28) : 0;
  const need = pad + lh + estH(body, bo, pw) + pad;
  if (need > h && y + need <= BOT + 0.02) h = need;
  redcard(s, x, y, w, h);
  if (lab) label(s, lab, px, y + pad - 0.02, pw, C.gold2);
  txt(s, body, px, y + pad - 0.02 + lh, pw, h - 2 * pad + 0.04 - lh, bo);
  return h;
}
function bullets(items, size = T.body, color = C.ink, psa = 3) {
  return items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, fontFace: F.r, fontSize: size, color, paraSpaceAfter: psa } }));
}
function numTag(s, n, x, y, d = 0.46, fill = C.red) {
  s.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
  txt(s, String(n), x, y, d, d, { fontFace: F.x, fontSize: Math.max(10, d * 24), color: C.white, align: 'center', valign: 'middle', fit: false, clamp: false });
}
function sq(s, n, x, y, d = 0.5, fill = C.red) {
  s.addShape(pptx.ShapeType.rect, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
  txt(s, String(n), x, y, d, d, { fontFace: F.x, fontSize: Math.max(10, d * 26), color: C.white, align: 'center', valign: 'middle', fit: false, clamp: false, skip: true });
}
function hbars(s, x, y, w, h, items, o = {}) {
  const labW = o.labW || 2.0, valW = 0.8;
  const n = items.length, rowH = h / n, barH = Math.min(rowH * 0.62, 0.34);
  const maxV = Math.max(...items.map(i => Math.abs(i.v))); const minV = Math.min(0, ...items.map(i => i.v)); const span = maxV - minV;
  const plotW = w - labW - valW - 0.1; const zeroX = x + labW + (-minV / span) * plotW;
  items.forEach((it, i) => {
    const cy = y + i * rowH + (rowH - barH) / 2;
    txt(s, it.label, x, y + i * rowH, labW - 0.15, rowH, { fontFace: it.hi ? F.x : F.r, fontSize: o.fs || T.body, color: C.ink, align: 'right', valign: 'middle', lineSpacingMultiple: 0.95, fit: false, clamp: false });
    const bw = Math.abs(it.v) / span * plotW; const bx = it.v >= 0 ? zeroX : zeroX - bw;
    s.addShape(pptx.ShapeType.rect, { x: bx, y: cy, w: Math.max(bw, 0.02), h: barH, fill: { color: it.hi ? C.red : C.beige }, line: { color: it.hi ? C.red : C.gold, width: 0.5 } });
    txt(s, it.fmt || String(it.v), it.v >= 0 ? bx + bw + 0.08 : zeroX + 0.08, cy - 0.05, valW, barH + 0.1, { fontFace: F.s, fontSize: T.body, color: it.hi ? C.red : C.ink, valign: 'middle', fit: false, clamp: false });
  });
  vrule(s, zeroX, y, h, C.ink2);
}
function vbars(s, x, y, w, h, items) {
  const n = items.length, slot = w / n, bw = slot * 0.6; const maxV = Math.max(...items.map(i => i.v));
  const labH = 0.28, valH = 0.28, plotH = h - labH - valH;
  items.forEach((it, i) => {
    const bh = it.v / maxV * plotH; const bx = x + i * slot + (slot - bw) / 2; const by = y + valH + (plotH - bh);
    s.addShape(pptx.ShapeType.rect, { x: bx, y: by, w: bw, h: bh, fill: { color: it.hi ? C.red : C.beige }, line: { color: it.hi ? C.red : C.gold, width: 0.5 } });
    txt(s, it.fmt || String(it.v), x + i * slot, by - valH, slot, valH, { fontFace: F.s, fontSize: T.label, color: it.hi ? C.red : C.ink, align: 'center', valign: 'bottom', fit: false, clamp: false });
    txt(s, it.label, x + i * slot, y + h - labH + 0.04, slot, labH, { fontFace: F.r, fontSize: T.label, color: C.ink, align: 'center', fit: false, clamp: false });
  });
  rule(s, x, y + valH + plotH, w, C.ink2);
}
function tableStyle(rows, o = {}) {
  return rows.map((r, ri) => r.map((c, ci) => {
    const isHead = ri === 0, isTotal = o.totalRow && ri === rows.length - 1; const hiCol = o.hiCol !== undefined && ci === o.hiCol && !isHead;
    let fill = isHead ? C.red : (ri % 2 ? C.white : C.cream2); if (isTotal) fill = C.ink; if (hiCol && !isTotal) fill = 'F6DCD3';
    return { text: c, options: { fill: { color: fill }, color: isHead || isTotal ? C.white : C.ink, fontFace: isHead || isTotal || ci === 0 ? F.s : F.r, fontSize: o.fs || 10, align: ci === 0 || (o.leftCols && o.leftCols.includes(ci)) ? 'left' : 'center', valign: 'middle', margin: [3, 6, 3, 6], border: { type: 'solid', color: C.line, pt: 0.5 } } };
  }));
}
function pageNum(s, color = C.red) { txt(s, String(pageNo).padStart(2, '0'), M, 7.02, 1, 0.3, { fontFace: F.s, fontSize: T.label, color, valign: 'middle', clamp: false, skip: true }); }

// content page: kicker tag, title, optional lede. o.x0 shifts the title block (left photo rail)
function page(kicker, title, lede, o = {}) {
  const s = pptx.addSlide(); pageNo += 1;
  s.background = { path: BG };
  const x0 = o.x0 || M, tw = W - M - x0;
  tag(s, kicker, x0, 0.48, tw);
  let size = T.title; const est = sz => title.length * 0.0093 * sz;
  if (est(size) > tw) size = Math.max(20, tw / (title.length * 0.0093));
  txt(s, title, x0, 0.82, tw, 0.6, { fontFace: F.x, fontSize: size, color: C.red, valign: 'top', fit: false, clamp: false });
  const ly = 1.48;
  if (lede) txt(s, lede, x0, ly, Math.min(tw, 8.6), 0.6, { fontFace: F.r, fontSize: 12, color: C.ink2, lineSpacingMultiple: 1.15, clamp: false });
  pageNum(s, o.pn || C.red);
  notes(s, o.notes || String(pageNo));
  return { s, top: lede ? 2.15 : 1.65 };
}

// =============== 1. COVER ===============
{
  const s = pptx.addSlide(); pageNo += 1; s.background = { path: BG }; notes(s, '1');
  pic(s, 'cover_trinity', 0, 2.65, W, H - 2.65, { fade: 't', fx: 0.5, fy: 0.2, ff: 0.13 });
  tag(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', M, 0.42, 8);
  txt(s, "EVALUATING A COMPANY'S RESOURCES, CAPABILITIES, AND COMPETITIVENESS", M, 0.78, 8.4, 0.62, { fontFace: F.s, fontSize: 15, color: C.ink, lineSpacingMultiple: 1.05, fit: false, clamp: false });
  txt(s, [{ text: 'STUDI KASUS', options: { fontFace: F.s, fontSize: T.label, color: C.gold, charSpacing: 1.5 } }, { text: '    Preparing for Life without Ferguson', options: { fontFace: F.m, fontSize: 13, color: C.ink2 } }], M, 1.45, 8.4, 0.3, { valign: 'middle', fit: false, clamp: false });
  txt(s, 'MANCHESTER UNITED', M, 1.78, 12.1, 0.95, { fontFace: F.x, fontSize: T.display, color: C.red, lineSpacingMultiple: 0.9, fit: false, clamp: false, skip: true });
  label(s, 'DOSEN PENGAMPU', 9.9, 0.45, 2.9, C.gold);
  txt(s, 'Dr. Rangga Almahendra, S.T., M.M.', 9.9, 0.7, 2.9, 0.5, { fontFace: F.s, fontSize: T.body2, color: C.ink, clamp: false });
  rect(s, 0, 6.72, W, 0.78, C.red);
  txt(s, [{ text: 'KELOMPOK 4', options: { fontFace: F.s, fontSize: T.label, color: C.gold2, charSpacing: 1.5 } }, { text: '      Fitra Aidila  ·  Aulia Sisca Rahmadiyanti  ·  Bagaskoro  ·  Imam Prayudha  ·  Tegar Awanto', options: { fontFace: F.s, fontSize: T.body2, color: C.white } }], M, 6.72, W - 2 * M, 0.78, { valign: 'middle', align: 'center', fit: false, clamp: false, skip: true });
}

// =============== 2. AGENDA ===============
{
  const { s, top } = page('ALUR PRESENTASI', 'AGENDA', null, { pn: C.white });
  const items = [['01', 'Framework Chapter 4', 'Enam pertanyaan analisis internal perusahaan dan alat untuk menjawabnya: Rasio Keuangan, SWOT, VRIN test, Value Chain, Competitive Strength Assessment, priority list'], ['02', 'Penerapan pada Manchester United', 'Kinerja, SWOT, resource dan capability, Uji VRIN, Value Chain, Benchmarking, dan Competitive Strength Assessment MU pada Juli 2009.'], ['03', 'Daftar prioritas isu strategis', 'Isu apa yang harus segera ditangani?'], ['04', 'Diskusi', '']];
  items.forEach((it, i) => {
    const x = gx(i * 3), w = gw(3), y = top + 0.1;
    sq(s, it[0], x, y, 0.5, i === 0 ? C.red : C.ink);
    rule(s, x + 0.65, y + 0.49, w - 0.65);
    txt(s, it[1], x + 0.65, y + 0.02, w - 0.65, 0.45, { fontFace: F.x, fontSize: T.head, color: C.red, valign: 'middle', lineSpacingMultiple: 0.95, clamp: false });
    if (it[2]) txt(s, it[2], x, y + 0.72, w, 1.3, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.15, clamp: false });
  });
  pic(s, 'p_stand_tifo', 0, 3.75, W, H - 3.75, { fade: 't', fy: 0.5 });
}

// =============== 3. ENAM PERTANYAAN ===============
{
  const { s, top } = page('BAGIAN 1  ·  FRAMEWORK CHAPTER 4', 'ENAM PERTANYAAN', null);
  const q = [['Seberapa baik strategi yang ada saat ini?', 'Indikator kinerja & rasio keuangan'], ['Apa kekuatan dan kelemahan dibandingkan dengan peluang dan ancaman?', 'SWOT Analysis & Performance Indicator'], ['Resource dan capability apa yang paling penting, dan apakah tahan lama?', 'VRIN Test'], ['Bagaimana aktivitas rantai nilai mempengaruhi biaya dan nilai pelanggan?', 'Value Chain + Benchmarking'], ['Lebih kuat atau lebih lemah dari pesaing utama?', 'Competitive Strength Assessment'], ['Isu strategis apa yang harus ditangani lebih dulu?', 'Daftar prioritas isu strategis']];
  pic(s, 'p_pitch_tunnel', 9.6, top - 0.05, W - 9.6, H - top + 0.05, { fade: 'lt', fx: 0.5 });
  const w = gw(3), h = 2.5;
  q.forEach((it, i) => {
    const x = gx((i % 3) * 3), y = top + Math.floor(i / 3) * (h + 0.1);
    rule(s, x, y, w, i === 5 ? C.gold : C.red, 0.04);
    txt(s, String(i + 1), x, y + 0.14, 1, 0.6, { fontFace: F.x, fontSize: T.num, color: C.red, fit: false, clamp: false });
    txt(s, it[0], x, y + 0.85, w - 0.1, 1.0, { fontFace: F.s, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.05, clamp: false });
    txt(s, it[1], x, y + h - 0.6, w - 0.1, 0.5, { fontFace: F.s, fontSize: T.body, color: C.red, lineSpacingMultiple: 1.05, clamp: false });
  });
}

// =============== 4. FIGURE 4.1 ===============
{
  const { s, top } = page('PERTANYAAN 1', 'KENALI DULU STRATEGI YANG SEDANG DIJALANKAN', 'Komponen strategi perusahaan');
  const fw = 5.9, fh = fw / 1.359;
  card(s, M, top, fw + 0.3, fh + 0.3, { fill: C.white });
  s.addImage({ path: 'mu_cream/fig4_1.png', x: M + 0.15, y: top + 0.15, w: fw, h: fh });
  rec('image', M, top, fw + 0.3, fh + 0.3, { path: 'mu_cream/fig4_1.png' });
  const x = M + fw + 0.55, w = W - M - x;
  const h1 = banner(s, x, top, w, 1.25, 'CONTOH KAMI: AIRASIA', 'Strategi biaya rendah terlihat konsisten di setiap fungsi. Satu tipe pesawat (A320) dioperasikan dan penjualan tiket langsung secara online di pemasaran.');
  block(s, x, top + h1 + 0.3, w, 1.5, { head: 'Setelah strategi dikenali', body: 'Pengukuran kinerja dengan melihat tren penjualan dan laba, harga saham, kekuatan keuangan, retensi pelanggan, pelanggan baru, dan perbaikan proses internal.' });
  block(s, x, top + h1 + 2.0, w, 1.2, { tag: 'CARA PAKAI', body: 'Isi setiap kotak dengan tindakan nyata perusahaan, lalu periksa apakah semuanya saling mendukung.' });
}

// =============== 5. FINANCIAL RATIOS ===============
{
  const { s, top } = page('PERTANYAAN 1', 'FINANCIAL RATIOS: ALAT UKURNYA', 'Pengukuran kinerja strategi dengan angka yang dituangkan dalam alat ukur berupa rasio keuangan sebagai berikut :');
  bleedRight(s, 'p_boardroom', top);
  const g = [['Profitability', 'Seberapa besar laba yang dihasilkan', ['Gross profit margin', 'Operating profit margin', 'Net profit margin', 'Total return on assets', 'Net return on assets (ROA)', 'Return on equity (ROE)', 'Return on invested capital']], ['Liquidity', 'Sanggup bayar kewajiban jangka pendek?', ['Current ratio', 'Working capital']], ['Leverage', 'Seberapa berat beban utangnya', ['Total debt-to-assets', 'Long-term debt-to-capital', 'Debt-to-equity', 'Long-term debt-to-equity', 'Times-interest-earned']], ['Activity', 'Seberapa efisien aset dikelola', ['Days of inventory', 'Inventory turnover', 'Average collection period']]];
  const cw = RW, w = (cw - 3 * G) / 4, h = 3.2;
  g.forEach((it, i) => {
    const x = M + i * (w + G);
    txt(s, it[0], x, top, w, 0.34, { fontFace: F.x, fontSize: T.sub, color: C.red, clamp: false });
    txt(s, it[1], x, top + 0.36, w, 0.5, { fontFace: F.r, fontSize: T.body, color: C.ink2, lineSpacingMultiple: 1.1, clamp: false });
    rule(s, x, top + 0.92, w);
    txt(s, bullets(it[2]), x, top + 1.04, w, h - 1.1, { clamp: false });
  });
  banner(s, M, top + h + 0.2, cw, 1.0, 'UKURAN TAMBAHAN', 'Dividend yield, price-to-earnings ratio, dividend payout ratio, internal cash flow, dan free cash flow. Free cash flow paling penting karena menunjukkan kas yang tersisa untuk membiayai langkah strategis baru.');
}

// =============== 6. SWOT ===============
{
  const { s, top } = page('PERTANYAAN 2', 'SWOT ANALYSIS: KENAPA STRATEGI BERHASIL ATAU GAGAL', 'Q1 menunjukkan apakah strategi bekerja, tetapi belum menjelaskan penyebabnya. SWOT adalah alat paling sederhana untuk mencarinya.');
  const q = [['S', 'Strengths', 'Yang perusahaan kuasai atau miliki, yang membuatnya lebih mampu bersaing', true], ['W', 'Weaknesses', 'Yang tidak dimiliki atau dikerjakan kurang baik dibanding pesaing', false], ['O', 'Opportunities', 'Peluang pasar: apa yang bisa diambil dari luar', false], ['T', 'Threats', 'Ancaman dari luar yang bisa menggerus laba dan posisi', true]];
  const cw = gw(8), w = (cw - G) / 2, h = 1.55;
  q.forEach((it, i) => {
    const x = M + (i % 2) * (w + G), y = top + Math.floor(i / 2) * (h + 0.12);
    if (it[3]) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    txt(s, it[0], x + PAD, y + 0.1, 0.8, 0.7, { fontFace: F.x, fontSize: 34, color: it[3] ? C.gold2 : C.red, fit: false });
    txt(s, it[1], x + 1.0, y + 0.18, w - 1.15, 0.32, { fontFace: F.x, fontSize: T.sub, color: it[3] ? C.white : C.red });
    txt(s, it[2], x + 1.0, y + 0.55, w - 1.15, h - 0.65, { fontFace: F.r, fontSize: T.body, color: it[3] ? C.white : C.ink, lineSpacingMultiple: 1.12 });
  });
  banner(s, M, top + 2 * h + 0.3, cw, 1.1, 'KENAPA SWOT POPULER', 'Karena mudah digunakan, baik untuk menilai strategi yang sedang berjalan maupun menyusun strategi baru. Penggunanya mulai dari perusahaan besar sampai perusahaan dengan skala kecil.');
  const x = gx(8) + 0.1, w2 = W - M - x;
  block(s, x, top, w2, 2.3, { tag: 'KEY POINT', body: [{ text: 'Apakah kekuatan perusahaan cukup untuk mengatasi kelemahannya, menangkap peluang, dan menghadapi ancaman.', options: { fontFace: F.s, color: C.ink, breakLine: true } }, { text: '', options: { breakLine: true } }, { text: 'Apakah kekuatan cukup menutup kelemahan? Apakah strategi sudah bertumpu pada kekuatan itu? Apakah kekuatan kita melampaui pesaing? Apakah strategi berhasil menangkal ancaman', options: { fontFace: F.r, color: C.ink } }] });
  pic(s, 'p_scarves', x, top + 2.45, w2, BOT - top - 2.45, { frame: true, fy: 0.5 });
}

// =============== 7. COMPETENCE ===============
{
  const { s, top } = page('PERTANYAAN 2  ·  KONSEP INTI', 'COMPETENCE, DISTINCTIVE COMPETENCE, CORE COMPETENCE', 'Buku membedakan tiga tingkatan kompetensi. Tingkat ketiga adalah yang paling berharga bagi perusahaan.');
  bleedRight(s, 'p_youth_trophy', top);
  const tiers = [['1', 'Competence', 'Aktivitas yang sudah dikuasai perusahaan, dikerjakan konsisten baik dan dengan biaya wajar.', 'Kemampuan biasa. Banyak perusahaan punya.'], ['2', 'Distinctive Competence', 'Kemampuan yang membuat perusahaan mengerjakan aktivitas itu LEBIH BAIK dari pesaingnya.', 'Sudah membedakan, tapi belum tentu inti strategi.'], ['3', 'Core Competence', 'Aktivitas yang dikuasai dengan baik dan berada di jantung strategi perusahaan.', 'Paling berharga. Sering jadi mesin pertumbuhan.']];
  const cw = RW, w = (cw - 2 * G) / 3, h = 2.55;
  tiers.forEach((it, i) => {
    const x = M + i * (w + G), hi = i === 2;
    if (hi) redcard(s, x, top, w, h); else card(s, x, top, w, h);
    txt(s, it[0], x + PAD, top + 0.1, 1, 0.6, { fontFace: F.x, fontSize: T.num, color: hi ? C.gold2 : C.red, fit: false });
    txt(s, it[1], x + PAD, top + 0.72, w - 2 * PAD, 0.32, { fontFace: F.x, fontSize: T.head, color: hi ? C.white : C.red });
    txt(s, it[2], x + PAD, top + 1.08, w - 2 * PAD, 0.9, { fontFace: F.r, fontSize: T.body, color: hi ? C.white : C.ink, lineSpacingMultiple: 1.12 });
    txt(s, it[3], x + PAD, top + h - 0.6, w - 2 * PAD, 0.5, { fontFace: F.s, fontSize: T.body, color: hi ? C.gold2 : C.red, lineSpacingMultiple: 1.05 });
  });
  const y2 = top + h + 0.2;
  tag(s, 'CONTOH DARI BUKU', M, y2, 4);
  const ex = [['Procter & Gamble', 'Core competence di manajemen merek, melahirkan Tide, Crest, Pampers, Olay, Febreze.'], ['Nike', 'Core competence di desain dan pemasaran sepatu serta apparel olahraga.'], ['Kellogg', 'Core competence di pengembangan, produksi, dan pemasaran sereal sarapan.']];
  ex.forEach((it, i) => { const x = M + i * (w + G); block(s, x, y2 + 0.38, w, BOT - y2 - 0.38, { head: it[0], body: it[1], headSize: T.head, bodySize: T.body }); });
}

// =============== 8. SWOT STEPS ===============
{
  const { s, top } = page('PERTANYAAN 2', 'SWOT TIDAK HANYA MEMBUAT KELOMPOK TEMUAN', 'Nilai SWOT ada pada kesimpulan yang ditarik dari daftarnya, bukan pada daftarnya. Buku menggambarkannya sebagai tiga langkah.');
  bleedRight(s, 'p_dugout', top);
  const steps = [['Identifikasi', 'Susun keempat temuan berdasarkan bukti, bukan opini.'], ['Tarik kesimpulan', 'Apa sebab berhasil atau gagalnya suatu strategi? Sisi mana dari situasi perusahaan yang menarik? Sisi mana yang tidak?'], ['Terjemahkan jadi tindakan', 'Ubah kesimpulan menjadi langkah strategis yang nyata.']];
  const cw = RW, w = (cw - G) / 2, h = 2.7;
  steps.forEach((it, i) => {
    const y = top + i * 0.9;
    numTag(s, i + 1, M, y + 0.02, 0.4);
    txt(s, it[0], M + 0.55, y, w - 0.55, 0.3, { fontFace: F.x, fontSize: T.head, color: C.red, clamp: false });
    txt(s, it[1], M + 0.55, y + 0.3, w - 0.55, 0.55, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.1, clamp: false });
  });
  const x = M + w + G;
  redcard(s, x, top, w, h);
  label(s, 'TINDAKAN YANG DAPAT DILAKUKAN :', x + PAD, top + 0.18, w - 2 * PAD, C.gold2);
  txt(s, bullets(['Jadikan kekuatan sebagai fondasi strategi', 'Perbaiki kelemahan yang menghambat strategi', 'Pakai kekuatan untuk meredam ancaman besar', 'Kejar peluang yang paling cocok dengan kekuatan', 'Benahi kelemahan yang menghalangi peluang penting', 'Tutup kelemahan yang membuat rentan pada ancaman'], T.body, C.white), x + PAD, top + 0.5, w - 2 * PAD, h - 0.6);
  banner(s, M, top + h + 0.25, cw, 1.0, 'KETERBATASAN SWOT', 'Kekuatannya ada pada kesederhanaan, namun terdapat keterbatasan. Untuk pemahaman yang lebih dalam dibutuhkan alat yang lebih canggih, yaitu Q3 sampai Q5 berikutnya.');
}

// =============== 9. RESOURCE VS CAPABILITY ===============
{
  const { s, top } = page('PERTANYAAN 3', 'RESOURCE DAN CAPABILITY: DUA HAL BERBEDA', 'Resource adalah sesuatu yang dimiliki perusahaan, sedangkan capability adalah sesuatu yang bisa dikerjakan oleh perusahaan. Capability dibangun dengan mengerahkan resource.');
  const cw = gw(8), w = (cw - G) / 2;
  block(s, M, top, w, 1.2, { head: 'Resource', body: 'Aset yang dimiliki atau dikendalikan perusahaan.\nContoh: merek, pabrik, kas, paten, tim R&D.' });
  block(s, M + w + G, top, w, 1.2, { head: 'Capability', body: 'Kemampuan perusahaan mengerjakan suatu aktivitas internal dengan baik. Disebut juga competence.\nContoh: kemampuan Starbucks mengelola dan melatih karyawan.' });
  const y = top + 1.45;
  tag(s, 'TIPE RESOURCE', M, y, 4);
  const tb = [['Tangible', 'bisa disentuh atau dihitung', C.red, [['Fisik', 'tanah, pabrik, peralatan, lokasi, sumber daya alam'], ['Finansial', 'kas, surat berharga, peringkat kredit'], ['Teknologi', 'paten, hak cipta, teknologi produksi dan inovasi'], ['Organisasional', 'sistem IT, sistem kendali, struktur organisasi']]], ['Intangible', 'tidak berwujud', C.gold, [['Human assets', 'pendidikan, pengalaman, bakat, pengetahuan'], ['Merek & reputasi', 'nama merek, citra, loyalitas, reputasi mutu'], ['Relasi', 'aliansi, joint venture, jaringan dealer'], ['Budaya & insentif', 'norma perilaku, keyakinan bersama, kompensasi']]]];
  const ty = y + 0.4, th = BOT - ty, rh = (th - 0.38) / 4;
  tb.forEach((t, i) => {
    const x = M + i * (w + G);
    card(s, x, ty, w, th);
    rect(s, x, ty, w, 0.38, t[2]);
    txt(s, [{ text: t[0] + '   ', options: { fontFace: F.x, fontSize: T.head, color: C.white } }, { text: t[1], options: { fontFace: F.r, fontSize: T.body, color: C.white } }], x + PAD, ty, w - 2 * PAD, 0.38, { valign: 'middle', clamp: false });
    t[3].forEach((r, j) => {
      const yy = ty + 0.38 + j * rh;
      if (j) rule(s, x + PAD, yy, w - 2 * PAD, C.line);
      txt(s, r[0], x + PAD, yy, 1.3, rh, { fontFace: F.s, fontSize: T.body, color: C.ink, valign: 'middle' });
      txt(s, r[1], x + PAD + 1.35, yy, w - 2 * PAD - 1.35, rh, { fontFace: F.r, fontSize: T.body, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.08 });
    });
  });
  const px = gx(8) + 0.15, pw = W - M - px;
  pic(s, 'p_shirt', px, top, pw, BOT - top, { frame: true, fx: 0.5, fy: 0.45 });
}

// =============== 10. FINDING CAPABILITIES ===============
{
  const { s, top } = page('PERTANYAAN 3', 'CARA MENEMUKAN CAPABILITY PERUSAHAAN', 'Capability lebih sulit ditemukan daripada resource, karena wujudnya tidak kelihatan. Terdapat 2 cara yang dapat dilakukan :');
  bleedRight(s, 'p_training', top);
  const cw = RW, w = (cw - G) / 2;
  note(s, M, top, w, 1.72, { tag: 'CARA 1', head: 'Berangkat dari daftar resource', body: 'Lihat daftar resource, lalu tanya: kemampuan apa yang mungkin tumbuh dari sini? Armada truk dan pusat distribusi otomatis menandakan kemampuan logistik yang matang.' });
  note(s, M + w + G, top, w, 1.72, { tag: 'CARA 2', head: 'Berangkat dari fungsi perusahaan', body: 'Telusuri tiap fungsi. Injection molding dan metal stamping di produksi; direct selling dan database marketing di penjualan; riset dasar dan pengembangan produk baru di R&D.' });
  block(s, M, top + 1.9, cw, 1.05, { head: 'Masalahnya: capability terpenting justru lintas fungsi', body: 'Cara 2 gagal menangkap kemampuan yang lahir dari kerja sama antar bagian. Kemampuan desain Warby Parker bukan cuma karena desainernya, tapi juga riset pasar, rekayasa, dan relasi dengan pemasok serta pabrik.' });
  txt(s, 'Capability yang lolos semua saringan adalah yang membawa gelar. Alat ujinya di slide berikutnya: VRIN Test.', M, top + 3.0, cw, 0.3, { fontFace: F.s, fontSize: T.body, color: C.red, clamp: false });
  banner(s, M, top + 3.35, cw, BOT - top - 3.35, 'RESOURCE BUNDLE', 'Kumpulan aset bersaing yang saling terkait erat di sekitar satu atau beberapa kemampuan lintas fungsi. Bundle bisa lolos Uji VRIN Test meski komponen-komponennya sendiri tidak. Paket Nike (keahlian styling, riset pasar, endorsement atlet, nama merek, kecakapan manajerial) membuatnya nomor satu di sepatu olahraga lebih dari 20 tahun.', { size: T.body });
}

// =============== 11. VRIN ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  FRAMEWORK INTI', 'VRIN TEST', 'Punya sumber daya yang kuat belum tentu membuat perusahaan unggul. VRIN Test membantu melihat apakah sumber daya itu benar-benar menjadi pembeda dan sulit disaingi.', { x0: 3.9, pn: C.white });
  pic(s, 'p_european_cup', 0, 0, 3.4, H, { fade: 'r', fx: 0.45 });
  const v = [['V', 'Valuable', 'Bernilai untuk bersaing?', 'Harus langsung menopang strategi dan membuat perusahaan lebih efektif bersaing. Google Wallet gagal meski memakai resource teknologi yang membuat Google nomor satu di mesin pencari.'], ['R', 'Rare', 'Langka, tidak dimiliki pesaing?', 'Apakah pesaing juga memilikinya? Kalau semua perusahaan punya kemampuan yang sama, itu bukan lagi pembeda.\nSemua produsen sereal punya kemampuan pemasaran; kekuatan merek Oreo tidak umum.'], ['I', 'Inimitable', 'Sulit ditiru?', 'Sulit ditiru kalau unik, harus dibangun bertahun-tahun, butuh biaya sangat besar, atau melibatkan social complexity dan causal ambiguity.'], ['N', 'Nonsubstitutable', 'Pesaing tak punya jalan lain?', 'Kalau pesaing tidak bisa meniru, apakah mereka bisa mencapai hasil yang sama dengan cara lain? Misalnya, keunggulan dari otomatisasi bisa disaingi lewat biaya tenaga kerja yang lebih murah']];
  const x0 = 3.9, cw = W - M - x0, w = (cw - 3 * G) / 4, h = 3.42;
  v.forEach((it, i) => {
    const x = x0 + i * (w + G);
    rule(s, x, top, w, i < 2 ? C.red : C.gold, 0.04);
    txt(s, it[0], x, top + 0.12, 1, 0.65, { fontFace: F.x, fontSize: 34, color: C.red, fit: false, clamp: false });
    txt(s, it[1], x, top + 0.82, w, 0.3, { fontFace: F.x, fontSize: T.head, color: C.ink, clamp: false });
    txt(s, it[2], x, top + 1.12, w, 0.5, { fontFace: F.s, fontSize: T.body, color: C.red, lineSpacingMultiple: 1.0, clamp: false });
    txt(s, it[3], x, top + 1.68, w, h - 1.68, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.12, clamp: false });
  });
  const bw = (cw - G) / 2, by = top + h + 0.2;
  banner(s, x0, by, bw, BOT - by, 'V + R', 'Menunjukkan apakah sumber daya bisa MENCIPTAKAN keunggulan bersaing.');
  banner(s, x0 + bw + G, by, bw, BOT - by, 'I + N', 'Menunjukkan apakah keunggulan itu BISA BERTAHAN menghadapi serangan pesaing.');
}

// =============== 12. DYNAMIC CAPABILITY ===============
{
  const { s, top } = page('PERTANYAAN 3', 'RESOURCE HARUS DIKELOLA SECARA DINAMIS', 'Lolos VRIN Test bukan berarti sebuah keunggulan akan bertahan selamanya. Pesaing bisa menyusul, sementara kebutuhan pasar terus berubah.');
  bleedRight(s, 'p_floodlights', top);
  const cw = RW, w = (cw - 2 * G) / 3, h = 1.45;
  [['Pesaing menyusul', 'Cara yang dulu sulit ditiru bisa dipelajari. Pesaing juga bisa menemukan cara lain yang hasilnya sama.'], ['Aset Melemah', 'Keahlian, sistem, dan teknologi bisa kehilangan nilainya kalau tidak terus dikembangkan.'], ['Pasar berubah', 'Teknologi baru, selera pelanggan, atau cara menjual produk bisa membuat kekuatan lama tidak lagi relevan.']].forEach((it, i) => note(s, M + i * (w + G), top, w, h, { head: it[0], body: it[1] }));
  const y = top + h + 0.2, lw = 5.3;
  redcard(s, M, y, lw, BOT - y);
  label(s, 'DYNAMIC CAPABILITY', M + PAD, y + 0.18, lw - 2 * PAD, C.gold2);
  txt(s, 'Kemampuan perusahaan untuk memperbaiki, memperdalam, atau menambah resource dan capability yang sudah ada.', M + PAD, y + 0.48, lw - 2 * PAD, 0.75, { fontFace: F.s, fontSize: T.body2, color: C.white, lineSpacingMultiple: 1.1 });
  label(s, 'DUA CARA', M + PAD, y + 1.3, lw - 2 * PAD, C.gold2);
  txt(s, bullets(['Memperbaiki yang ada sedikit demi sedikit. Toyota terus menyempurnakan mesin hibrida dan Toyota Production System.', 'Menambah yang baru lewat aliansi atau akuisisi. GM bermitra dengan LG dan mendahului Tesla meluncurkan Chevy Bolt EV.'], T.body, C.white), M + PAD, y + 1.6, lw - 2 * PAD, BOT - y - 1.75);
  note(s, M + lw + G, y, cw - lw - G, BOT - y, { head: 'Inti dynamic capability', body: 'Ketika kegiatan memperbarui aset dilakukan terus-menerus, kemampuan memperbarui itu sendiri berubah menjadi sebuah capability. Di titik itulah ia disebut dynamic capability.' });
}

// =============== 13. VALUE CHAIN ===============
{
  const { s, top } = page('PERTANYAAN 4', 'VALUE CHAIN PERUSAHAAN', 'Sebuah produk sampai ke pelanggan melalui beberapa kegiatan. Value chain membantu kita melihat kegiatan mana yang menambah nilai dan mana yang paling banyak menghabiskan biaya.');
  tag(s, 'PRIMARY ACTIVITIES  ·  aktivitas utama pencipta nilai', M, top - 0.05, 8);
  const prim = [['Supply Chain Management', 'Membeli, menerima, menyimpan, dan menyalurkan bahan baku produksi'], ['Operations', 'Mengubah bahan baku jadi produk jadi'], ['Distribution', 'Menyimpan dan mengirim produk ke pembeli'], ['Sales & Marketing', 'mengenalkan serta menjual produk melalui tenaga penjualan, iklan, promosi, dan dealer.'], ['Service', 'membantu pelanggan setelah pembelian, termasuk pemasangan, perbaikan, dan suku cadang.']];
  const y1 = top + 0.3, pw = 1.3, w = (CW - pw - 5 * G) / 5, h1 = 1.92;
  prim.forEach((it, i) => { note(s, M + i * (w + G), y1, w, h1, { head: it[0], body: it[1], headSize: T.body2, headH: 0.42, bodySize: T.label }); });
  const xp = M + 5 * (w + G);
  redcard(s, xp, y1, pw, h1);
  txt(s, 'Profit Margin', xp + 0.1, y1 + 0.3, pw - 0.2, 0.3, { fontFace: F.s, fontSize: T.label, color: C.gold2, align: 'center' });
  txt(s, 'P − C', xp + 0.1, y1 + 0.7, pw - 0.2, 0.6, { fontFace: F.x, fontSize: 22, color: C.white, align: 'center', valign: 'middle', fit: false });
  const y2 = y1 + h1 + 0.18;
  tag(s, 'SUPPORT ACTIVITIES  ·  aktivitas pendukung', M, y2, 8);
  const w2 = (CW - 2 * G) / 3, y3 = y2 + 0.35, h2 = 1.05;
  [['Product R&D, Technology & Systems Development', 'Riset produk dan proses, desain, otomasi'], ['Human Resource Management', 'Rekrutmen, pelatihan, kompensasi'], ['General Administration', 'mengelola keuangan, hukum, akuntansi, dan informasi perusahaan.']].forEach((it, i) => note(s, M + i * (w2 + G), y3, w2, h2, { head: it[0], body: it[1], headSize: T.body2, headH: 0.3, bodySize: T.label }));
  banner(s, M, y3 + h2 + 0.18, CW, BOT - y3 - h2 - 0.18, null, [{ text: 'TIGA SELISIH YANG HARUS DIBEDAKAN   ', options: { fontFace: F.s, color: C.gold2, charSpacing: 1 } }, { text: 'V − P = nilai yang diterima pelanggan (customer value proposition).   P − C = margin laba perusahaan.   V − C = Total Economic Value, seluruh nilai ekonomi yang diciptakan perusahaan.', options: { fontFace: F.m, color: C.white } }], { size: T.label });
}

// =============== 14. VALUE CHAIN SYSTEM ===============
{
  const { s, top } = page('PERTANYAAN 4', 'VALUE CHAIN SYSTEM DAN BENCHMARKING', 'Biaya dan mutu produk tidak hanya ditentukan oleh perusahaan. Pemasok dan mitra yang menyalurkan produk juga ikut memengaruhi apa yang diterima pelanggan.');
  const lw = gw(4);
  pic(s, 'p_handshake', M, top, lw, lw / 1.5, { frame: true });
  banner(s, M, top + lw / 1.5 + 0.25, lw, BOT - top - lw / 1.5 - 0.25, 'TANTANGANNYA ADALAH MENDAPATKAN DATA PEMBANDING', 'Data bisa dicari dari laporan publik, asosiasi, riset, kunjungan lapangan, atau konsultan yang menjaga kerahasiaan perusahaan. Pengumpulan data tetap harus dilakukan secara sah.', { size: T.body });
  const x0 = gx(4), cw = W - M - x0, fw = (cw - 3 * 0.35) / 4, fh = 1.25;
  [['Value chain PEMASOK', 'Pemasok menyediakan input'], ['Value chain PERUSAHAAN', 'Perusahaan mengolahnya'], ['Value chain MITRA HILIR', 'Mitra hilir menyalurkannya'], ['PEMBELI / PENGGUNA AKHIR', 'Nilai yang dirasakan pelanggan']].forEach((it, i) => {
    const x = x0 + i * (fw + 0.35), last = i === 3;
    if (last) redcard(s, x, top, fw, fh); else card(s, x, top, fw, fh);
    txt(s, it[0], x + PAD, top + 0.12, fw - 2 * PAD, 0.42, { fontFace: F.x, fontSize: T.label, color: last ? C.white : C.red, lineSpacingMultiple: 1.0 });
    txt(s, it[1], x + PAD, top + 0.58, fw - 2 * PAD, 0.5, { fontFace: F.r, fontSize: T.label, color: last ? C.white : C.ink, lineSpacingMultiple: 1.05 });
    if (!last) s.addShape(pptx.ShapeType.triangle, { x: x + fw + 0.08, y: top + fh / 2 - 0.1, w: 0.2, h: 0.2, rotate: 90, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  });
  const y = top + fh + 0.3, bw = 3.9;
  block(s, x0, y, bw, BOT - y, { head: 'Benchmarking', body: [{ text: 'Perusahaan membandingkan cara kerjanya dengan perusahaan lain yang lebih baik dalam kegiatan tertentu. Pembandingnya bisa berasal dari industri yang sama ataupun industri lain. Cara yang terbukti memberi hasil lebih baik disebut best practice.', options: { fontFace: F.r, color: C.ink, breakLine: true } }, { text: '', options: { breakLine: true } }, { text: 'Best practice', options: { fontFace: F.x, color: C.red } }, { text: ' = cara mengerjakan suatu aktivitas yang terbukti konsisten memberi hasil lebih baik dibanding cara lain. Harus sudah dibuktikan minimal oleh satu perusahaan.', options: { fontFace: F.r, color: C.ink } }] });
  const x2 = x0 + bw + 0.3, w2 = W - M - x2;
  label(s, 'TIGA CONTOH YANG TERKENAL', x2, y, w2);
  const ex = [['Xerox', 'Pelopornya. Tidak membatasi diri pada pesaing mesin kantor, tapi ke perusahaan mana pun yang kelas dunia.'], ['Toyota', 'Ide just-in-time datang dari mengamati cara supermarket Amerika mengisi ulang raknya.'], ['Southwest Airlines', 'Memangkas waktu parkir pesawat dengan mempelajari kru pit balap mobil.']];
  const rh = (BOT - y - 0.35) / 3;
  ex.forEach((it, i) => {
    const yy = y + 0.35 + i * rh;
    rule(s, x2, yy, w2, C.line);
    txt(s, it[0], x2, yy + 0.08, 1.5, rh - 0.1, { fontFace: F.x, fontSize: T.body2, color: C.ink, clamp: false });
    txt(s, it[1], x2 + 1.6, yy + 0.08, w2 - 1.6, rh - 0.1, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.1, clamp: false });
  });
}

// =============== 15. REMEDIES ===============
{
  const { s, top } = page('PERTANYAAN 4  ·  TINDAKAN', 'KALAU BIAYA ATAU NILAINYA KALAH, APA YANG DILAKUKAN', 'Analisis value chain dan benchmarking bisa menunjukkan kegiatan mana yang terlalu mahal atau belum memberi cukup nilai bagi pelanggan. Perbaikannya bisa dimulai dari tiga bagian.');
  bleedRight(s, 'p_boots', top, { fx: 0.5 });
  const cols = [['1. Aktivitas internal sendiri', ['Terapkan best practice, terutama di aktivitas mahal', 'Hapus aktivitas yang tidak perlu dengan merombak value chain', 'Pindahkan aktivitas mahal ke wilayah berbiaya lebih rendah', 'Serahkan ke pihak luar (outsourcing) jika mereka lebih murah', 'Investasi teknologi yang menaikkan produktivitas', 'Rancang ulang produk agar lebih murah dibuat']], ['2. Bagian pemasok', ['Tekan harga beli ke pemasok', 'Ganti ke input substitusi yang lebih murah', 'Kerja sama dengan pemasok untuk penghematan', 'Jika perlu, pertimbangkan memproduksi input sendiri.', 'Untuk menaikkan nilai, pilih pemasok bermutu tinggi dan libatkan mereka sejak tahap desain']], ['3. Bagian mitra hilir (Distributor/ Dealer)', ['Tekan biaya dan markup distributor serta dealer', 'Kerja sama mencari penghematan yang saling menguntungkan', 'Ubah jalur distribusi, termasuk jual langsung lewat internet', 'Integrasi ke depan: buka gerai sendiri', 'Untuk menaikkan nilai: iklan bersama, perjanjian eksklusif, dan pelatihan mitra']]];
  const cw = RW, w = (cw - 2 * G) / 3, h = 3.35;
  cols.forEach((it, i) => {
    const x = M + i * (w + G);
    txt(s, it[0], x, top, w, 0.5, { fontFace: F.x, fontSize: T.head, color: C.red, lineSpacingMultiple: 0.95, valign: 'bottom', clamp: false });
    rule(s, x, top + 0.56, w);
    txt(s, bullets(it[1], T.body), x, top + 0.68, w, h - 0.68, { clamp: false });
  });
  banner(s, M, top + h + 0.2, cw, BOT - top - h - 0.2, 'DUA CARA MENGUBAH KERJA VALUE CHAIN JADI KEUNGGULAN BERSAING', '(1) Lebih efisien sehingga biayanya lebih rendah dari pesaing seperti Ryanair, Nucor, TJX.   (2) Menjadi dasar diferensiasi sehingga pelanggan mau membayar lebih: Rolex (status), Braun (desain), L.L. Bean (layanan), FedEx (keandalan).', { size: T.body });
}

// =============== 16. TABLE 4.4 ===============
{
  const { s, top } = page('PERTANYAAN 5', 'COMPETITIVE STRENGTH ASSESSMENT', 'Alat untuk mengubah penilaian yang kualitatif menjadi satu angka yang bisa langsung dibandingkan dengan pesaing.');
  const steps = [['Daftar KSF', 'Susun key success factor industri'], ['Beri bobot', 'Sesuai tingkat kepentingan; total harus 1,00'], ['Beri rating', 'Skala 1–10. 1 sangat lemah, 10 sangat kuat'], ['Kalikan', 'Rating × bobot = skor tertimbang'], ['Jumlahkan', 'Totalnya jadi ukuran kekuatan keseluruhan']];
  const sw = (CW - 4 * G) / 5;
  steps.forEach((it, i) => {
    const x = M + i * (sw + G);
    numTag(s, i + 1, x, top, 0.38);
    txt(s, it[0], x + 0.5, top - 0.02, sw - 0.5, 0.3, { fontFace: F.x, fontSize: T.body2, color: C.red, valign: 'middle', clamp: false });
    txt(s, it[1], x + 0.5, top + 0.3, sw - 0.5, 0.5, { fontFace: F.r, fontSize: T.label, color: C.ink, lineSpacingMultiple: 1.05, clamp: false });
  });
  const rows = [['Key Success Factor', 'Bobot', 'ABC Co.', 'Rival 1', 'Rival 2'], ['Mutu / performa produk', '0,10', '8 / 0,80', '5 / 0,50', '1 / 0,10'], ['Reputasi dan citra', '0,10', '8 / 0,80', '7 / 0,70', '1 / 0,10'], ['Kemampuan produksi', '0,10', '2 / 0,20', '10 / 1,00', '5 / 0,50'], ['Sumber daya keuangan', '0,10', '5 / 0,50', '10 / 1,00', '3 / 0,30'], ['Posisi biaya relatif', '0,30', '5 / 1,50', '10 / 3,00', '1 / 0,30'], ['Layanan pelanggan', '0,15', '5 / 0,75', '7 / 1,05', '1 / 0,15'], ['Faktor lain (tiga baris)', '0,15', '1,40', '0,45', '0,65'], ['TOTAL SKOR TERTIMBANG', '1,00', '5,95', '7,70', '2,10']];
  const ty = top + 1.05, tw = gw(7), rh = 0.3;
  s.addTable(tableStyle(rows, { totalRow: true }), { x: M, y: ty, w: tw, colW: [2.9, 0.9, (tw - 3.8) / 3, (tw - 3.8) / 3, (tw - 3.8) / 3], rowH: rh });
  rec('container', M, ty, tw, rh * rows.length, { path: 'rect' });
  txt(s, 'Contoh dari Table 4.4 buku. Isi sel: rating / skor tertimbang.', M, ty + rh * rows.length + 0.1, tw, 0.3, { fontFace: F.r, fontSize: T.label, color: C.ink2, clamp: false });
  const x = gx(7) + 0.15, w = W - M - x;
  label(s, 'APA YANG BISA DIBACA DARI ANGKANYA', x, ty, w);
  const rd = [['Bandingkan Skor total', 'Besarnya net competitive advantage. Rival 1 (7,70) unggul jauh atas Rival 2 (2,10).'], ['Cari peluang bersaing', 'Lihat faktor yang menjadi kekuatan kita, tetapi masih lemah pada pesaing.'], ['Tentukan yang perlu dibenahi', 'Jika lemah di faktor tempat pesaing kuat, siapkan langkah bertahan lebih dulu.']];
  const rh2 = (BOT - ty - 0.4) / 3;
  rd.forEach((it, i) => {
    const yy = ty + 0.4 + i * rh2;
    rule(s, x, yy, w, C.line);
    txt(s, it[0], x, yy + 0.1, w, 0.3, { fontFace: F.x, fontSize: T.body2, color: C.red, clamp: false });
    txt(s, it[1], x, yy + 0.4, w, rh2 - 0.5, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.1, clamp: false });
  });
}

// =============== 17. PRIORITY LIST ===============
{
  const { s, top } = page('PERTANYAAN 6', 'ISU APA YANG HARUS DITANGANI LEBIH DULU?', 'Setelah menjawab pertanyaan 1 sampai 5 dan melihat kondisi industri, kita bisa menyusun masalah yang paling mendesak bagi perusahaan.');
  bleedRight(s, 'p_clock', top, { fx: 0.5 });
  const cw = RW, w = (cw - G) / 2, h = 2.85;
  redcard(s, M, top, w, h);
  label(s, 'PRIORITY LIST', M + PAD, top + 0.18, w - 2 * PAD, C.gold2);
  txt(s, 'Berisi isu yang perlu ditangani manajemen agar perusahaan tetap kuat, baik sekarang maupun beberapa tahun ke depan', M + PAD, top + 0.5, w - 2 * PAD, 0.9, { fontFace: F.s, fontSize: T.body2, color: C.white, lineSpacingMultiple: 1.1 });
  txt(s, 'Biasanya ditulis sebagai pertanyaan, misalnya: “Bagaimana kita mengurangi ketergantungan pada satu orang?” atau “Perlukah kita mengubah cara bersaing?”', M + PAD, top + 1.5, w - 2 * PAD, h - 1.6, { fontFace: F.r, fontSize: T.body, color: C.white, lineSpacingMultiple: 1.1 });
  const x = M + w + G;
  label(s, 'DUA HAL YANG SERING KELIRU', x, top, w);
  block(s, x, top + 0.32, w, 1.2, { head: 'Priority List belum memberi solusi', body: 'Tujuannya mengidentifikasi ISU yang harus ditangani, bukan memutuskan tindakan apa yang diambil. Keputusan tindakan datang belakangan, saat menyusun strategi.' });
  block(s, x, top + 1.6, w, 1.25, { head: 'Banyaknya isu memberi petunjuk', body: 'Jika hanya ada beberapa masalah kecil, strategi saat ini mungkin cukup disesuaikan. Jika masalahnya banyak dan serius, perusahaan mungkin perlu meninjau ulang strateginya.' });
  banner(s, M, top + h + 0.25, cw, 1.0, 'UJI AKHIR CHAPTER 4', 'Strategi yang baik wajib memuat cara menangani SEMUA isu dan hambatan pada daftar prioritas itu. Di sinilah analisis berhenti dan penyusunan strategi dimulai.');
}

// =============== 18. SECTION 2 ===============
{
  const s = pptx.addSlide(); pageNo += 1; s.background = { path: BG }; notes(s, '18');
  sq(s, '2', W / 2 - 0.4, 0.75, 0.8);
  txt(s, 'BAGIAN 2  ·  STUDI KASUS', 0, 1.75, W, 0.3, { fontFace: F.s, fontSize: T.label, color: C.red, charSpacing: 2, align: 'center', clamp: false });
  txt(s, 'MANCHESTER UNITED', 0, 2.05, W, 0.95, { fontFace: F.x, fontSize: T.display, color: C.red, align: 'center', fit: false, clamp: false });
  txt(s, 'Preparing for Life without Ferguson', 0, 3.0, W, 0.4, { fontFace: F.m, fontSize: 18, color: C.ink, align: 'center', clamp: false });
  pic(s, 'hero_crowd', 0, 3.75, W, H - 3.75, { fade: 't', fy: 0.55 });
  pageNum(s, C.white);
}

// =============== 19. SITUASI ===============
{
  const { s, top } = page('KASUS  ·  SITUASI', 'JULI 2009: KEPUTUSAN YANG DIHADAPI DAVID GILL', null, { x0: 3.9, pn: C.white });
  pic(s, 'p_statue', 0, 0, 3.4, H, { fade: 'r', fx: 0.42 });
  const x0 = 3.9, cw = W - M - x0, w = (cw - 2 * G) / 3, h = 2.1;
  [['Waktu', 'Juli 2009, tur pramusim ke Malaysia, Indonesia, Korea, dan China. Skuad pulang 28 Juli 2009.'], ['Pengambil keputusan', 'David Gill, Chief Executive Manchester United Football Club Limited.'], ['Keputusan', 'Menyiapkan pengganti Sir Alex Ferguson. Kasus: "at the end of 2009 Ferguson would be 68 years old". Gill memperkirakan ia pensiun akhir musim 2009–10.']].forEach((it, i) => note(s, x0 + i * (w + G), top, w, h, { head: it[0], body: it[1] }));
  const y = top + h + 0.25;
  card(s, x0, y, cw, BOT - y);
  label(s, 'DILEMA INTI', x0 + PAD, y + 0.18, 4);
  const hw = (cw - 2 * PAD - 0.3) / 2;
  txt(s, [{ text: 'Pilih orang dalam ', options: { fontFace: F.x, color: C.red } }, { text: '(Queiroz, Phelan, Solskjær, McClair): sistem latihan, pemanduan bakat, dan pengembangan tim tetap jalan. Tetapi apakah mereka cukup berwibawa di depan pemain bintang?', options: { fontFace: F.r, color: C.ink } }], x0 + PAD, y + 0.5, hw, 1.1, { fontSize: T.body, lineSpacingMultiple: 1.12 });
  txt(s, [{ text: 'Pilih orang luar berwibawa ', options: { fontFace: F.x, color: C.red } }, { text: 'seperti Mourinho: kasus menyebut ini "a revolutionary change in coaching strategy in which much of Ferguson\'s infrastructure would be taken down and rebuilt".', options: { fontFace: F.r, color: C.ink } }], x0 + PAD + hw + 0.3, y + 0.5, hw, 1.1, { fontSize: T.body, lineSpacingMultiple: 1.12 });
  rect(s, x0 + 0.3, BOT - 0.75, cw - 0.6, 0.55, C.red);
  txt(s, 'Pertanyaan Chapter 4 di baliknya: aset mana yang milik klub, dan aset mana yang milik satu orang?', x0 + 0.5, BOT - 0.75, cw - 1.0, 0.55, { fontFace: F.s, fontSize: T.body2, color: C.white, valign: 'middle', clamp: false });
}

// =============== 20. INDUSTRY ===============
{
  const { s, top } = page('KONTEKS', 'SEPAKBOLA EROPA SEBAGAI INDUSTRI', 'Q1 menuntut perbandingan dengan pesaing. Jadi kita perlu tahu dulu industrinya seperti apa.');
  bleedRight(s, 'p_tv_studio', top);
  const cw = RW, w = (cw - 2 * G) / 3;
  [['€2,4 M', 'Pendapatan Premier League 2007–08', 'Terbesar di Eropa. Serie A, La Liga dan Bundesliga masing-masing sekitar €1,4 miliar.'], ['62%', 'Porsi gaji terhadap pendapatan', 'Premier League. Serie A 68%, La Liga 63%. Gaji adalah pos biaya terbesar klub Eropa.'], ['6 dari 10', 'Klub besar merugi', 'Selama 2000–2006. Industri ini tumbuh pesat, tapi sangat tidak menguntungkan.']].forEach((it, i) => {
    const x = M + i * (w + G);
    txt(s, it[0], x, top, w, 0.6, { fontFace: F.x, fontSize: T.num, color: C.red, fit: false, clamp: false });
    txt(s, it[1], x, top + 0.62, w, 0.28, { fontFace: F.s, fontSize: T.body, color: C.ink, clamp: false });
    txt(s, it[2], x, top + 0.92, w, 0.6, { fontFace: F.r, fontSize: T.label, color: C.ink2, lineSpacingMultiple: 1.1, clamp: false });
  });
  const y = top + 1.7, hw = (cw - G) / 2;
  rule(s, M, y - 0.1, cw);
  const lh20 = label(s, 'TIGA SUMBER PENDAPATAN KLUB  ·  PREMIER LEAGUE 2007–08', M, y, hw);
  const rev = [['Matchday', '£554 jt', 'Tiket dan hospitality. Dibatasi kapasitas stadion; itu sebabnya klub besar merenovasi atau membangun stadion baru.'], ['Broadcasting', '£931 jt', 'Hak siar dinegosiasikan Premier League. Kontrak 2006 bernilai £2,7 miliar; tiap klub dapat rata-rata £45 juta per tahun.'], ['Commercial', '£447 jt', 'Sponsor, lisensi merchandise, iklan. Terpusat di sedikit klub; Real Madrid dan Barcelona meraup lebih dari 60% sponsor La Liga.']];
  const rh = (BOT - y - lh20 - 0.1) / 3;
  rev.forEach((it, i) => {
    const yy = y + lh20 + 0.1 + i * rh;
    txt(s, it[0], M, yy, 1.3, 0.28, { fontFace: F.s, fontSize: T.body, color: C.ink, clamp: false });
    txt(s, it[1], M, yy + 0.3, 1.3, 0.35, { fontFace: F.x, fontSize: T.sub, color: C.red, clamp: false });
    txt(s, it[2], M + 1.4, yy, hw - 1.4, rh - 0.08, { fontFace: F.r, fontSize: T.label, color: C.ink, lineSpacingMultiple: 1.1, clamp: false });
  });
  const x2 = M + hw + G;
  label(s, 'ATURAN MAIN DAN LOGIKA EKONOMINYA', x2, y, hw);
  [['Struktur kompetisi', '20 klub Premier League, tiga terbawah turun kasta. Empat teratas lolos Champions League, kompetisi 32 klub terbaik Eropa.'], ['Yang kaya makin kaya', 'Sejak UCL dimulai 1992, muncul jurang keuangan antara MU, Chelsea, Liverpool, Arsenal dan sisanya. Uang Eropa membeli pemain bagus.'], ['Harga pemain meledak', 'Rekor transfer baru tercipta musim panas 2009 meski resesi. Pendorongnya: Real Madrid, lalu Chelsea, lalu Manchester City.']].forEach((it, i) => {
    const yy = y + lh20 + 0.1 + i * rh;
    txt(s, it[0], x2, yy, hw, 0.26, { fontFace: F.x, fontSize: T.body2, color: C.red, clamp: false });
    txt(s, it[1], x2, yy + 0.27, hw, rh - 0.3, { fontFace: F.r, fontSize: T.label, color: C.ink, lineSpacingMultiple: 1.08, clamp: false });
  });
}

// =============== 21. ON PITCH ===============
{
  const { s, top } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI LAPANGAN: JELAS DI ATAS RATA-RATA', 'Indikator kedua : apakah posisi bersaing MU membaik? Data kompetisi di kasus menjawabnya.');
  bleedRight(s, 'p_celebration', top);
  const sw = gw(3);
  [['1.460', 'Poin Eropa 2000–2009, tertinggi  ·  Table 6.2', 'Barcelona 1.411  ·  Real Madrid 1.314  ·  Arsenal 1.310'], ['3', 'Gelar liga beruntun 2007, 2008, 2009  ·  Table 6.1', 'Total 11 gelar liga sejak 1993 dalam rentang kasus'], ['2008', 'Liga Champions kedua di era Ferguson  ·  hlm. 584', 'Yang pertama 1999, bersama gelar liga dan FA Cup']].forEach((it, i) => {
    const y = top + i * 1.58;
    rule(s, M, y, sw, i ? C.line : C.red, i ? 0.012 : 0.04);
    txt(s, it[0], M, y + 0.1, sw, 0.6, { fontFace: F.x, fontSize: T.num, color: C.red, fit: false, clamp: false });
    txt(s, it[1], M, y + 0.72, sw, 0.45, { fontFace: F.s, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.05, clamp: false });
    txt(s, it[2], M, y + 1.12, sw, 0.42, { fontFace: F.r, fontSize: T.label, color: C.ink2, lineSpacingMultiple: 1.05, clamp: false });
  });
  const x = gx(3) + 0.1, w = M + RW - x;
  card(s, x, top, w, BOT - top);
  label(s, 'TOTAL POIN EROPA 2000–09  ·  TABLE 6.2', x + PAD, top + 0.18, w - 2 * PAD);
  hbars(s, x + 0.3, top + 0.55, w - 0.6, 2.8, [{ label: 'Man United', v: 1460, fmt: '1.460', hi: true }, { label: 'Barcelona', v: 1411, fmt: '1.411' }, { label: 'Real Madrid', v: 1314, fmt: '1.314' }, { label: 'Bayern', v: 1314, fmt: '1.314' }, { label: 'Arsenal', v: 1310, fmt: '1.310' }, { label: 'Chelsea', v: 1276, fmt: '1.276' }], { labW: 1.5 });
  txt(s, 'Di antara enam klub ini, skuad MU paling besar (34 pemain) dan termuda kedua (25,6 tahun) setelah Arsenal (Table 6.7). Cocok dengan strategi memadukan pemain muda dan pemain berpengalaman (hlm. 583).', x + 0.3, top + 3.5, w - 0.6, BOT - top - 3.65, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.12 });
}

// =============== 22. FINANCE ===============
{
  const { s, top } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI KEUANGAN: PALING UNTUNG DI ANTARA KLUB BESAR', 'Indikator pertama Thompson: apakah kekuatan keuangan dan laba MU membaik?');
  bleedRight(s, 'p_pitch_aerial', top);
  const lw = 4.9, ph = 3.25;
  card(s, M, top, lw, ph);
  const lh = label(s, 'PENDAPATAN MU, £ JUTA  ·  NAIK 53% DARI 2006 KE 2008', M + PAD, top + 0.18, lw - 2 * PAD);
  vbars(s, M + 0.15, top + 0.25 + lh, lw - 0.3, 1.5, [{ label: '2000', v: 116.0, fmt: '116,0' }, { label: '2001', v: 129.6, fmt: '129,6' }, { label: '2002', v: 146.1, fmt: '146,1' }, { label: '2003', v: 173.0, fmt: '173,0' }, { label: '2004', v: 169.1, fmt: '169,1' }, { label: '2005', v: 157.2, fmt: '157,2' }, { label: '2006', v: 167.8, fmt: '167,8' }, { label: '2007', v: 212.2, fmt: '212,2', hi: true }, { label: '2008', v: 257.1, fmt: '257,1', hi: true }]);
  txt(s, 'Entitas: plc untuk 2000–2005, Limited untuk 2006–2008. Tahun buku 2000–04 sampai 31 Juli, 2005–08 sampai 30 Juni. Kasus: data 2000–04 tidak sebanding dengan 2005–08 karena perubahan akuntansi.', M + 0.15, top + ph - 0.9, lw - 0.3, 0.8, { fontFace: F.r, fontSize: T.label, color: C.ink2, lineSpacingMultiple: 1.05 });
  banner(s, M, top + ph + 0.2, lw, BOT - top - ph - 0.2, 'SATU ANGKA YANG ANOMALI', 'Utang £616 juta, tertinggi kedua di Table 6.5 setelah Arsenal (£896 juta). Kasus mencatat akuisisi Glazer 2005 dibiayai terutama dengan utang.', { size: T.body });
  const x = M + lw + 0.3, w = RW - lw - 0.3;
  label(s, 'BUKTI PENDUKUNG', x, top, w);
  const ev = [['×2,2', 'Laba bersih naik dari £21,6 jt (2006) ke £46,8 jt (2008). Margin bersih 2008: 18,2%'], ['12,6%', 'Return on sales 2000–2006 (Table 6.6), tertinggi dari 10 klub; Real Madrid hanya 0,4%'], ['€101,9 jt', 'EBITDA tertinggi di Table 6.5 (data Forbes 2009). Margin 31,4% vs Barcelona 22,3%, Real Madrid 14,1%'], ['£1,14 M', 'Nilai klub tertinggi di Table 6.5, di atas Barcelona £960 jt dan Real Madrid £850 jt']];
  const rh = (BOT - top - 0.35) / 4;
  ev.forEach((it, i) => {
    const yy = top + 0.35 + i * rh;
    rule(s, x, yy, w, C.line);
    txt(s, it[0], x, yy + 0.08, w, 0.34, { fontFace: F.x, fontSize: 16, color: C.red, clamp: false });
    txt(s, it[1], x, yy + 0.44, w, rh - 0.5, { fontFace: F.r, fontSize: T.label, color: C.ink, lineSpacingMultiple: 1.08, clamp: false });
  });
}

// =============== 23. TRANSFER (+ Chelsea) ===============
{
  const { s, top } = page('PERTANYAAN 1  ·  KESIMPULAN', 'PRESTASI PUNCAK, BELANJA RELATIF HEMAT', 'Dari empat klub berprestasi tertinggi, belanja bersih MU yang paling kecil.');
  bleedRight(s, 'p_transfer', top);
  const lw = 4.9, ph = 3.1;
  card(s, M, top, lw, ph);
  const lh = label(s, 'BELANJA TRANSFER BERSIH 2003–09, £ JUTA  ·  EMPAT KLUB POIN TERTINGGI + CHELSEA', M + PAD, top + 0.18, lw - 2 * PAD);
  hbars(s, M + 0.15, top + 0.3 + lh, lw - 0.3, 1.65, [{ label: 'Real Madrid (183,0 poin)', v: 438 }, { label: 'Chelsea (144,5 poin)', v: 430 }, { label: 'Barcelona (200,0 poin)', v: 249 }, { label: 'Bayern München (179,5 poin)', v: 122 }, { label: 'Manchester United\n(192,5 poin)', v: 100, hi: true }], { labW: 2.3, fs: 10 });
  txt(s, 'Klub lain ada yang belanja lebih sedikit: Arsenal £22 jt, AC Milan justru penjual bersih (−£66 jt). Tapi poinnya 162,0 dan 169,0, di bawah MU.', M + 0.15, top + ph - 0.62, lw - 0.3, 0.5, { fontFace: F.r, fontSize: T.label, color: C.ink2, lineSpacingMultiple: 1.05 });
  banner(s, M, top + ph + 0.2, lw, BOT - top - ph - 0.2, 'JAWABAN Q1', 'Strategi MU bekerja sangat baik. Kedua indikator terpenuhi sekaligus, di industri yang mayoritas pelakunya merugi. Yang harus dijelaskan pertanyaan berikutnya: kenapa bisa begitu.', { size: T.body });
  const x = M + lw + 0.3, w = RW - lw - 0.3;
  redcard(s, x, top, w, 1.5);
  txt(s, '4,4×', x + PAD, top + 0.08, 2, 0.55, { fontFace: F.x, fontSize: 26, color: C.gold2, fit: false });
  txt(s, 'Real Madrid membelanjakan 4,4 kali lipat belanja bersih MU (£438 jt vs £100 jt), tapi poin performanya lebih rendah: 183,0 vs 192,5.', x + PAD, top + 0.64, w - 2 * PAD, 0.8, { fontFace: F.m, fontSize: T.label, color: C.white, lineSpacingMultiple: 1.05 });
  const mini = [['Chelsea', '£430 jt belanja bersih, hanya 144,5 poin.'], ['Barcelona', 'Satu-satunya yang mengungguli MU, dengan belanja 2,5× lipat.'], ['Kata kasus sendiri', 'Belanja bersih MU "relatif sederhana"']];
  const rh = (BOT - top - 1.7) / 3;
  mini.forEach((it, i) => {
    const yy = top + 1.7 + i * rh;
    rule(s, x, yy, w, C.line);
    txt(s, it[0], x, yy + 0.1, w, 0.28, { fontFace: F.x, fontSize: T.body2, color: C.red, clamp: false });
    txt(s, it[1], x, yy + 0.4, w, rh - 0.45, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.08, clamp: false });
  });
}

// =============== 24. SWOT MU ===============
{
  const { s, top } = page('PERTANYAAN 2  ·  DITERAPKAN', 'SWOT MANCHESTER UNITED, JULI 2009', 'Semua temuan Q1 dirangkum, lalu ditarik kesimpulan sesuai langkah 2 dan 3, bukan berhenti di daftar.');
  pic(s, 'p_night_stadium', 10.3, 1.7, W - 10.3, H - 1.7, { fade: 'lt' });
  const q = [['S', 'Strengths', ['Merek global dengan 80 juta pendukung di Asia', 'Laba tertinggi di antara klub besar: EBITDA €101,9 jt, RoS 12,6%', 'Akademi dan jaringan pemandu bakat yang matang', 'Disiplin transfer: belanja bersih hanya £100 jt'], true], ['W', 'Weaknesses', ['Bergantung pada satu orang yang akhir 2009 berusia 68 tahun', 'Belum ada keputusan suksesi; Ferguson belum menyatakan niat pensiun', 'Ronaldo, satu-satunya pemain MU di peringkat FIFA, baru dijual', 'Utang £616 jt; akuisisi Glazer 2005 dibiayai utang'], false], ['O', 'Opportunities', ['Pasar Asia: India dan Cina disebut Aon sebagai target utama', 'Sponsor khusus per negara masih bisa diperbanyak', 'Pendapatan siaran Premier League naik 43% dalam setahun', 'Kanal digital: MUTV, MU Mobile, toko online'], false], ['T', 'Threats', ['Harga pemain meledak, didorong Manchester City (£185 jt)', 'Pesaing berpemilik sangat kaya: Abramovich, Sheikh Mansour', 'MU tak dapat suntikan dana pemilik seperti Chelsea dan City', 'Barcelona unggul poin performa (200,0 vs 192,5)'], true]];
  const cw = 10.0 - M, w = (cw - G) / 2, h = 1.8;
  q.forEach((it, i) => {
    const x = M + (i % 2) * (w + G), y = top + Math.floor(i / 2) * (h + 0.08);
    if (it[3]) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    txt(s, [{ text: it[0] + '  ', options: { fontFace: F.x, fontSize: 20, color: it[3] ? C.gold2 : C.red } }, { text: it[1], options: { fontFace: F.x, fontSize: T.head, color: it[3] ? C.white : C.red } }], x + PAD, y + 0.08, w - 2 * PAD, 0.4, { valign: 'middle', fit: false });
    txt(s, bullets(it[2], T.label, it[3] ? C.white : C.ink, 1), x + PAD, y + 0.42, w - 2 * PAD, h - 0.46);
  });
  banner(s, M, top + 2 * h + 0.22, cw, BOT - top - 2 * h - 0.22, null, [{ text: 'KESIMPULAN · LANGKAH 2   ', options: { fontFace: F.s, color: C.gold2, charSpacing: 1 } }, { text: 'Kekuatan MU cukup untuk menangkap peluang komersial di Asia. Tapi kelemahan terbesarnya, ketergantungan pada Ferguson, menyerang sisi lapangan, padahal bagi Gill sisi lapangan adalah syarat mengalirnya pendapatan komersial.', options: { fontFace: F.m, color: C.white } }], { size: T.label, tight: true });
}

// =============== 25. RESOURCE INVENTORY ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  DITERAPKAN', 'INVENTARISASI RESOURCE MANCHESTER UNITED', 'Langkah pertama Q3: mendaftar aset bersaing klub memakai delapan kategori, semuanya berdasarkan bukti dari kasus.');
  bleedRight(s, 'p_museum', top);
  const cw = RW, w = (cw - G) / 2, th = 3.55;
  const tb = [['TANGIBLE', C.red, [['Finansial', 'EBITDA €101,9 jt, tertinggi di Table 6.5; laba bersih 2008 £46,8 jt; ekuitas £294 jt.'], ['Fisik', 'Old Trafford, diperluas 2006 dengan tambahan 7.500 kursi; museum, tur stadion, suite dan ballroom.'], ['Teknologi', 'MUTV (siaran web), MU Mobile (SMS dan video), toko online store.manutd.com.'], ['Organisasional', 'Urusan tim (Ferguson) terpisah dari komersial (Gill; direktur komersial Richard Arnold); MU International.']]], ['INTANGIBLE', C.gold, [['Human assets', 'Ferguson sejak 1986; skuad 34 pemain; lebih dari 20 pemandu bakat. Ronaldo, peringkat 1 FIFA, dijual 2009.'], ['Merek & reputasi', '80 juta pendukung di Asia; sub-merek Fred the Red, MUFC, Red Devil. Menurut Aon, tak tertandingi di dunia olahraga.'], ['Relasi', 'Nike dan AIG (diganti Aon, £80 jt/4 tahun), ditambah 13 sponsor lain, termasuk Tri Indonesia dan Bharti Airtel.'], ['Budaya & insentif', 'Disiplin latihan ketat, perang terhadap alkohol, prinsip "tidak ada pemain yang lebih besar dari klub".']]]];
  tb.forEach((t, i) => {
    const x = M + i * (w + G);
    card(s, x, top, w, th);
    rect(s, x, top, w, 0.36, t[1]);
    txt(s, t[0], x + PAD, top, w - 2 * PAD, 0.36, { fontFace: F.s, fontSize: T.label, color: C.white, charSpacing: 2, valign: 'middle', clamp: false });
    const rh = (th - 0.36) / 4;
    t[2].forEach((r, j) => {
      const yy = top + 0.36 + j * rh;
      if (j) rule(s, x + PAD, yy, w - 2 * PAD, C.line);
      txt(s, r[0], x + PAD, yy, 1.25, rh, { fontFace: F.s, fontSize: T.body, color: C.ink, valign: 'middle' });
      txt(s, r[1], x + PAD + 1.3, yy, w - 2 * PAD - 1.3, rh, { fontFace: F.r, fontSize: T.label, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.05 });
    });
  });
  banner(s, M, top + th + 0.2, cw, BOT - top - th - 0.2, 'PERBANDINGAN KOMPOSISI', 'Aset yang paling membedakan MU ada di kolom kanan, yang tidak berwujud. Hal tersebut yang membuat unggul, dan sekaligus rapuh, karena sebagian aset tak berwujud melekat pada orang, dan orang bisa pergi.', { size: T.body });
}

// =============== 26. CAPABILITIES ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  DITERAPKAN', 'CAPABILITY MU, DAN MANA YANG CORE COMPETENCE', null);
  bleedRight(s, 'p_manager', top);
  const caps = [['CORE COMPETENCE', 'Mengenali dan mengembangkan bakat', 'Pemandu bakat dari 5 jadi lebih dari 20 orang; Youth Academy; dua pemandu bakat penuh waktu di Brasil sejak 2008.', true], ['CORE COMPETENCE', 'Membentuk dan merotasi tim', 'Memadukan pemain muda dengan pemain berpengalaman. Kasus menyebut Ferguson pelopor rotasi skuad.', true], ['CORE COMPETENCE', 'Mengubah merek jadi uang', 'Sponsor khusus Indonesia dan India, sub-merek per usia, MU Finance, MU Mobile, MUTV, Soccer Schools, tur Asia.', true], ['DISTINCTIVE COMPETENCE', 'Disiplin di pasar transfer', 'Belanja kotor £322 jt, bersih £100 jt. Mau menjual pemain yang dihargai lebih tinggi klub lain, seperti Ronaldo (£80 jt).', false], ['DISTINCTIVE COMPETENCE', 'Tata kelola klub', 'Kasus: klub Inggris "paling berhasil membangun tata kelola yang efektif". Glazer memilih peran pasif.', false], ['COMPETENCE', 'Mengelola stadion dan acara', 'Old Trafford disewakan untuk konferensi dan pernikahan; museum dan tur. Dikerjakan baik, tapi klub besar lain juga melakukannya.', false]];
  const cw = RW, w = (cw - 2 * G) / 3, h = 2.0;
  caps.forEach((it, i) => {
    const x = M + (i % 3) * (w + G), y = top + Math.floor(i / 3) * (h + 0.15);
    if (it[3]) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    label(s, it[0], x + PAD, y + 0.18, w - 2 * PAD, it[3] ? C.gold2 : (i === 5 ? C.ink2 : C.red));
    txt(s, it[1], x + PAD, y + 0.46, w - 2 * PAD, 0.5, { fontFace: F.x, fontSize: T.head, color: it[3] ? C.white : C.red, lineSpacingMultiple: 0.95 });
    txt(s, it[2], x + PAD, y + 0.98, w - 2 * PAD, h - 1.08, { fontFace: F.r, fontSize: T.label, color: it[3] ? C.white : C.ink, lineSpacingMultiple: 1.08 });
  });
  banner(s, M, top + 2 * h + 0.3, cw, BOT - top - 2 * h - 0.3, null, [{ text: 'YANG PERLU DIPERHATIKAN   ', options: { fontFace: F.s, color: C.gold2, charSpacing: 1 } }, { text: 'Tiga capability yang langsung menentukan prestasi lapangan (bakat, tim, dan transfer) dibangun dan diarahkan oleh Ferguson. Tiga lainnya berdiri di luar dirinya.', options: { fontFace: F.m, color: C.white } }], { size: T.body });
}

// =============== 27. VRIN MU ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  VRIN TEST', 'DUA KEUNGGULAN, SAMA-SAMA LOLOS VRIN TEST', 'Dilakukan uji antara sistem Ferguson dan merek beserta mesin komersialnya.');
  const rows = [['Tes', 'Sistem Ferguson', 'Merek & mesin komersial'], ['Valuable', 'LOLOS. Poin Eropa tertinggi, tiga gelar liga beruntun, Liga Champions 2008. Ferguson memenangi lebih banyak gelar daripada seluruh sejarah klub sebelumnya.', 'LOLOS. Aon membayar £80 jt untuk 4 tahun, atau £20 jt per tahun, dua kali lipat Chelsea dan Samsung (£10 jt per tahun).'], ['Rare', 'LOLOS. Table 6.8 hanya memuat 15 pelatih paling dihormati dunia; Ferguson paling lama di satu klub, sejak 1986.', 'LOLOS. Kasus hanya menyebut MU dan Real Madrid sebagai pemimpin eksploitasi merek global. MU punya 80 juta pendukung di Asia.'], ['Inimitable', 'LOLOS. Kasus sendiri menyebut penentu performa tim "tetap misteri … menentang analisis": causal ambiguity. Ditambah 23 tahun akumulasi dan social complexity.', 'LOLOS. Dibangun sejak 1878 lewat sejarah dan prestasi panjang. Chelsea, meski belanja besar, pendapatannya masih di bawah MU: €268,9 jt vs €324,8 jt.'], ['Nonsubstitutable', 'LOLOS. Jalan lain pesaing, membeli bintang dengan uang besar, tidak menyamai hasilnya: tim bertabur bintang Real Madrid dan Chelsea "gagal mencapai kejayaan".', 'LOLOS. Superstar bisa mendongkrak penjualan merchandise, tapi pemain datang dan pergi. Basis fan tetap: Aon menyebut fan Asia MU faktor kunci kontraknya.']];
  const rh = 0.72;
  s.addTable(tableStyle(rows, { leftCols: [1, 2], fs: T.label }), { x: M, y: top, w: CW, colW: [1.6, (CW - 1.6) / 2, (CW - 1.6) / 2], rowH: [0.34, rh, rh, rh, rh] });
  rec('container', M, top, CW, 0.34 + 4 * rh, { path: 'rect' });
  const y = top + 0.34 + 4 * rh + 0.25;
  banner(s, M, y, CW, BOT - y, 'KESIMPULAN Q3', 'Keduanya lolos VRIN Test, jadi keduanya tahan terhadap serangan PESAING. Bedanya ada di luar VRIN: merek melekat pada klub, sedangkan sistem Ferguson dibangun dan dipimpin satu orang yang akan segera pensiun.', { size: T.body2 });
}

// =============== 28. DYNAMIC CAPABILITY MU ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  DYNAMIC CAPABILITY', 'TIGA KALI MEMBANGUN ULANG TIM JUARA', 'Inilah yang tidak diukur VRIN Test: apakah kemampuan memperbarui diri ini milik klub, atau milik satu orang.');
  const cw = RW, w = (cw - 2 * G) / 3, h = 3.3;
  rule(s, M, top + 0.12, cw, C.red, 0.03);
  [['1986 – 1993', 'Membersihkan dan membangun fondasi', 'Ferguson menyingkirkan pemain yang dinilai kurang berbakat atau kurang berkomitmen, mempertahankan Bryan Robson, mendatangkan Hughes, Ince, Cantona, Keane. Ia juga menegakkan disiplin latihan.', 'FA Cup 1990  ·  Piala Winners 1991  ·  liga pertama era Ferguson 1993'], ['1994 – 2003', 'Generasi akademi', 'Juara liga junior 1990 menghasilkan Giggs, Beckham, Butt, Gary dan Phil Neville, serta Scholes. Mereka jadi inti tim yang mendominasi sepakbola Inggris.', 'Puncaknya 1999: liga, FA Cup, European Cup, Intercontinental Cup'], ['2003 – 2008', 'Regenerasi kedua', 'Kasus mencatat Beckham, Keane, Schmeichel, Cole, Sheringham, Stam dijual. Penggantinya antara lain Ferdinand, Ronaldo, Rooney, van der Sar, Evra, Vidić, Carrick.', 'Liga Champions 2008  ·  tiga gelar liga beruntun 2007–2009']].forEach((it, i) => {
    const x = M + i * (w + G);
    s.addShape(pptx.ShapeType.ellipse, { x: x - 0.02, y: top + 0.03, w: 0.21, h: 0.21, fill: { color: C.gold }, line: { color: C.red, width: 1 } });
    txt(s, it[0], x, top + 0.35, w, 0.4, { fontFace: F.x, fontSize: 18, color: C.red, clamp: false });
    txt(s, it[1], x, top + 0.78, w, 0.6, { fontFace: F.x, fontSize: T.head, color: C.ink, lineSpacingMultiple: 0.95, clamp: false });
    txt(s, it[2], x, top + 1.42, w, h - 1.97, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.12, clamp: false });
    txt(s, it[3], x, top + h - 0.5, w, 0.5, { fontFace: F.s, fontSize: T.body, color: C.red, lineSpacingMultiple: 1.05, valign: 'bottom', clamp: false });
  });
  banner(s, M, top + h + 0.2, cw, BOT - top - h - 0.2, 'PRESEDEN DARI KASUS SENDIRI', 'Setelah Matt Busby pensiun 1969, MU merosot. Selama 18 tahun sebelum Ferguson datang, MU tidak memenangi satu pun gelar liga dan hanya sekali jadi runner-up.', { size: T.body });
  const px = M + RW + 0.3;
  pic(s, 'p_bus_parade', px, top, W - M - px, BOT - top, { frame: true, fx: 0.55 });
}

// =============== 29. VALUE CHAIN MU ===============
{
  const { s, top } = page('PERTANYAAN 4  ·  DITERAPKAN', 'VALUE CHAIN DAN STRUKTUR BIAYA MU', 'Keunggulan biaya MU ada di HULU, di cara mendapatkan pemain.');
  const lw = gw(8), w = (lw - 4 * G) / 5, h1 = 1.8;
  tag(s, 'PRIMARY ACTIVITIES', M, top - 0.05, lw);
  [['Supply Chain', 'Mendapatkan pemain', 'Akademi, 20+ pemandu bakat, pasar transfer', true], ['Operations', 'Latihan dan bertanding', 'Disiplin latihan, rotasi skuad, taktik'], ['Distribution', 'Menyalurkan tontonan', 'Hak siar liga dan UEFA, MUTV, Old Trafford'], ['Sales & Marketing', 'Menjual merek', 'Nike, AIG/Aon, 13 sponsor lain, tur Asia'], ['Service', 'Melayani pendukung', 'Superstore, museum, Soccer Schools, MU Mobile']].forEach((it, i) => {
    const x = M + i * (w + G), y = top + 0.3, hi = it[3];
    if (hi) redcard(s, x, y, w, h1); else card(s, x, y, w, h1);
    txt(s, it[0], x + 0.1, y + 0.1, w - 0.2, 0.42, { fontFace: F.s, fontSize: T.label, color: hi ? C.gold2 : C.red, lineSpacingMultiple: 1.0 });
    txt(s, it[1], x + 0.1, y + 0.54, w - 0.2, 0.42, { fontFace: F.x, fontSize: T.body, color: hi ? C.white : C.ink, lineSpacingMultiple: 0.98 });
    txt(s, it[2], x + 0.1, y + 1.0, w - 0.2, h1 - 1.08, { fontFace: F.r, fontSize: T.label, color: hi ? C.white : C.ink, lineSpacingMultiple: 1.05 });
  });
  const y2 = top + h1 + 0.72, w2 = (lw - 2 * G) / 3, h2 = 1.05;
  tag(s, 'SUPPORT ACTIVITIES', M, y2 - 0.34, lw);
  [['Product R&D & Systems', 'Metodologi akademi, inovasi rotasi skuad, MUTV'], ['Human Resource Management', 'Rekrutmen, struktur gaji, penegakan disiplin'], ['General Administration', 'Pemisahan peran Gill dan Ferguson; MU International']].forEach((it, i) => note(s, M + i * (w2 + G), y2, w2, h2, { head: it[0], body: it[1], headSize: T.body2, headH: 0.32, bodySize: T.label }));
  banner(s, M, y2 + h2 + 0.18, lw, BOT - y2 - h2 - 0.18, null, [{ text: 'NILAI BAGI DUA PIHAK BERBEDA   ', options: { fontFace: F.s, color: C.gold2, charSpacing: 1 } }, { text: 'Bagi pendukung: prestasi, sejarah, dan pengalaman Old Trafford. Bagi sponsor: akses ke 80 juta pendukung Asia, ditambah bukti bahwa akses itu bekerja, yaitu lompatan AIG ke peringkat 47 merek dunia dalam satu tahun.', options: { fontFace: F.m, color: C.white } }], { size: T.label });
  const x = gx(8) + 0.1, rw = W - M - x;
  label(s, 'DI MANA LETAK KEUNGGULAN BIAYANYA', x, top - 0.05, rw);
  const adv = [['Gaji hanya ± 50% pendapatan', 'Rata-rata Premier League 62%, Serie A 68%, Chelsea 81%. Selisih 31 poin dengan Chelsea.'], ['Akademi: pemain tanpa biaya transfer', 'Giggs, Beckham, Butt, Neville bersaudara, Scholes: inti tim 1994–2003.'], ['Menjual pemain yang dihargai tinggi', 'Kotor £322 jt, bersih hanya £100 jt (2003–09). Ronaldo dilepas £80 jt, rekor dunia.'], ['Yang melawan arah', 'Amortisasi pemain naik dari £24,2 jt (2005) ke £35,5 jt (2008).']];
  const rh = (BOT - top - 0.3) / 4;
  adv.forEach((it, i) => {
    const yy = top + 0.3 + i * rh;
    rule(s, x, yy, rw, i === 3 ? C.red : C.line);
    txt(s, it[0], x, yy + 0.1, rw, 0.3, { fontFace: F.x, fontSize: T.body2, color: i === 3 ? C.ink : C.red, clamp: false });
    txt(s, it[1], x, yy + 0.42, rw, rh - 0.5, { fontFace: F.r, fontSize: T.body, color: C.ink, lineSpacingMultiple: 1.1, clamp: false });
  });
}

// =============== 30. BENCHMARKING ===============
{
  const { s, top } = page('PERTANYAAN 4  ·  BENCHMARKING DITERAPKAN', 'YANG DIBANDINGKAN BUKAN PENDAPATAN, TETAPI MARGIN', 'Benchmarking untuk Q4: seberapa kompetitif struktur biaya MU? Ukurannya bukan besar pendapatan, tapi berapa yang tersisa sebagai laba.');
  bleedRight(s, 'p_fans_asia', top);
  const cw = RW, lw = 4.8;
  card(s, M, top, lw, BOT - top);
  const lh = label(s, 'MARGIN EBITDA, %  ·  10 KLUB BERPENDAPATAN TERBESAR DI TABLE 6.5', M + PAD, top + 0.18, lw - 2 * PAD);
  hbars(s, M + 0.2, top + 0.35 + lh, lw - 0.4, BOT - top - 0.55 - lh, [{ label: 'Man United', v: 31.4, fmt: '31,4', hi: true }, { label: 'Roma', v: 25.0, fmt: '25,0' }, { label: 'Barcelona', v: 22.3, fmt: '22,3' }, { label: 'Arsenal', v: 19.3, fmt: '19,3' }, { label: 'AC Milan', v: 17.6, fmt: '17,6' }, { label: 'Liverpool', v: 15.8, fmt: '15,8' }, { label: 'Real Madrid', v: 14.1, fmt: '14,1' }, { label: 'Bayern', v: 12.7, fmt: '12,7' }, { label: 'Inter', v: 9.9, fmt: '9,9' }, { label: 'Chelsea', v: -3.1, fmt: '−3,1' }], { labW: 1.3 });
  const x = M + lw + 0.3, w = cw - lw - 0.3;
  block(s, x, top, w, 2.3, { head: 'Dua jalan mendapat pemain', body: 'Membeli bintang: Real Madrid, Chelsea. Return on sales 0,4% dan −60,4%. Mengembangkan sendiri: Bayern, Barcelona, Arsenal, Valencia. Bayern 4,7%, Arsenal 5,6%.\nMU memadukan keduanya: bakat akademi dipadukan pemain berpengalaman, lalu pemain dijual saat klub lain menilai lebih tinggi. Return on sales 12,6%, tertinggi.', bodySize: T.label });
  banner(s, x, top + 2.4, w, BOT - top - 2.4, 'BATAS KLAIM INI', 'Margin MU tertinggi di antara klub besar. Dari 15 klub, hanya Lyon (38,5%) yang lebih tinggi, dengan pendapatan kurang dari separuh MU.\n\nBenchmarking menguji biaya dan hasil aktivitas (Q4). VRIN Test menguji resource (Q3). Dua alat, dua pertanyaan berbeda.', { size: T.label });
}

// =============== 31. COMPETITIVE STRENGTH MU ===============
{
  const { s, top } = page('PERTANYAAN 5  ·  DITERAPKAN', 'COMPETITIVE STRENGTH ASSESSMENT MANCHESTER UNITED', null);
  bleedRight(s, 'p_press_box', top);
  const rows = [['Key Success Factor', 'Bobot', 'Man United', 'Real Madrid', 'Barcelona', 'Chelsea', 'Arsenal'], ['Kualitas skuad', '0,15', '6 / 0,90', '9 / 1,35', '10 / 1,50', '9 / 1,35', '6 / 0,90'], ['Kemampuan manajer', '0,15', '10 / 1,50', '5 / 0,75', '8 / 1,20', '6 / 0,90', '8 / 1,20'], ['Akademi & pemandu bakat', '0,10', '9 / 0,90', '3 / 0,30', '9 / 0,90', '3 / 0,30', '8 / 0,80'], ['Merek & basis pendukung', '0,15', '10 / 1,50', '9 / 1,35', '7 / 1,05', '5 / 0,75', '6 / 0,90'], ['Kemampuan komersial', '0,10', '10 / 1,00', '9 / 0,90', '7 / 0,70', '5 / 0,50', '6 / 0,60'], ['Profitabilitas', '0,10', '10 / 1,00', '5 / 0,50', '7 / 0,70', '1 / 0,10', '6 / 0,60'], ['Keleluasaan finansial (utang)', '0,10', '4 / 0,40', '7 / 0,70', '9 / 0,90', '5 / 0,50', '2 / 0,20'], ['Stadion & matchday', '0,05', '9 / 0,45', '8 / 0,40', '9 / 0,45', '5 / 0,25', '9 / 0,45'], ['Rekam jejak prestasi', '0,10', '10 / 1,00', '9 / 0,90', '10 / 1,00', '9 / 0,90', '9 / 0,90'], ['TOTAL SKOR TERTIMBANG', '1,00', '8,65', '7,15', '8,40', '5,55', '6,55']];
  const tbl = tableStyle(rows, { totalRow: true, hiCol: 2 }); tbl[tbl.length - 1][2].options.color = C.gold2;
  const cw = RW, rh = 0.31, cc = (cw - 2.4 - 0.7) / 5;
  s.addTable(tbl, { x: M, y: top, w: cw, colW: [2.4, 0.7, cc, cc, cc, cc, cc], rowH: rh });
  rec('container', M, top, cw, rh * 11, { path: 'rect' });
  const y = top + 11 * rh + 0.25, w = (cw - 2 * G) / 3;
  [['Unggul 0,25 poin', 'MU 8,65 vs Barcelona 8,40. Tipis: cukup satu baris turun untuk menghapusnya.', true], ['Turun ke 7,90', 'Kalau rating manajer jatuh dari 10 ke 5 karena ganti pelatih, MU langsung di bawah Barcelona.', false], ['Butuh minimal 8,3', 'Rating yang harus dicapai pengganti Ferguson supaya MU sekadar bertahan sejajar Barcelona.', false]].forEach((it, i) => {
    const x = M + i * (w + G), h = BOT - y;
    if (it[2]) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    txt(s, it[0], x + PAD, y + 0.14, w - 2 * PAD, 0.3, { fontFace: F.x, fontSize: T.head, color: it[2] ? C.gold2 : C.red });
    txt(s, it[1], x + PAD, y + 0.46, w - 2 * PAD, h - 0.56, { fontFace: F.r, fontSize: T.label, color: it[2] ? C.white : C.ink, lineSpacingMultiple: 1.05 });
  });
}

// =============== 32. PRIORITY LIST MU ===============
{
  const { s, top } = page('PERTANYAAN 6  ·  PRIORITY LIST DITERAPKAN', 'ENAM ISU UNTUK DAVID GILL', null);
  pic(s, 'p_asia_tour', 10.3, 1.7, W - 10.3, H - 1.7, { fade: 'lt' });
  const iss = [['Bagaimana mengganti Ferguson tanpa merusak sistemnya?', 'Gill belum memutuskan; Ferguson belum mengumumkan pensiun.'], ['Bagaimana bersaing di bursa transfer tanpa dana pemilik?', "Utang £616 jt tidak menghambat belanja pemain ('proved groundless'), tapi MU tak dapat dana pemilik seperti City yang belanja £185 jt."], ['Bagaimana menambal skuad setelah Ronaldo pergi?', 'Tidak ada lagi pemain MU di peringkat FIFA. Media menunggu apakah kas Ronaldo dipakai membeli Ribéry.'], ['Apakah perlu director of football untuk menopang sistem?', 'Seluruh sistem pemanduan bakat, latihan, dan taktik dibangun satu orang. Di Inggris posisi ini sering memicu konflik dengan manajer.'], ['Bagaimana menjaga pendapatan komersial kalau prestasi turun?', 'Gill: "So long as the team kept winning games … the commercial revenues … would continue to flow".'], ['Apakah pemilik tetap pasif setelah Ferguson pergi?', 'Peran pasif Glazer berjalan karena Ferguson dan Gill diberi kebebasan. Di Chelsea, campur tangan pemilik memicu kepergian Mourinho.']];
  const cw = 10.0 - M, w = (cw - G) / 2, h = 1.3;
  iss.forEach((it, i) => {
    const x = M + (i % 2) * (w + G), y = top + Math.floor(i / 2) * (h + 0.1);
    const serious = i === 0 || i === 3;
    if (serious) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    numTag(s, i + 1, x + 0.2, y + 0.45, 0.46, serious ? C.gold : C.red);
    txt(s, it[0], x + 0.85, y + 0.14, w - 1.0, 0.5, { fontFace: F.x, fontSize: T.body2, color: serious ? C.white : C.red, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.85, y + 0.66, w - 1.0, h - 0.76, { fontFace: F.r, fontSize: T.label, color: serious ? C.white : C.ink, lineSpacingMultiple: 1.05 });
  });
  banner(s, M, top + 3 * h + 0.4, cw, BOT - top - 3 * h - 0.4, 'HIGHLIGHT', 'Isu 1 dan 4 (merah) serius dan butuh strategi baru. Isu 2, 3, 5, 6 bisa ditangani dengan menyempurnakan strategi yang ada.', { size: T.body });
}

// =============== 33. THANKS ===============
{
  const s = pptx.addSlide(); pageNo += 1; s.background = { path: BG }; notes(s, '33');
  txt(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', 0, 1.0, W, 0.3, { fontFace: F.s, fontSize: T.label, color: C.red, charSpacing: 2, align: 'center', clamp: false });
  txt(s, 'TERIMA KASIH', 0, 1.3, W, 1.0, { fontFace: F.x, fontSize: 60, color: C.red, align: 'center', fit: false, clamp: false });
  txt(s, 'KELOMPOK 4', 0, 2.45, W, 0.3, { fontFace: F.s, fontSize: T.label, color: C.gold, charSpacing: 2, align: 'center', clamp: false });
  txt(s, 'Fitra Aidila  ·  Aulia Sisca Rahmadiyanti  ·  Bagaskoro  ·  Imam Prayudha  ·  Tegar Awanto', 0, 2.75, W, 0.4, { fontFace: F.s, fontSize: 13, color: C.ink, align: 'center', clamp: false });
  pic(s, 'hero_trophies', 0, 3.6, W, H - 3.6, { fade: 't', fy: 0.5 });
}

fs.writeFileSync('mu_cream/layout.json', JSON.stringify(LAYOUT));
pptx.writeFile({ fileName: 'mu_cream/deck.pptx' }).then(f => console.log('wrote', f, 'slides', pageNo));
