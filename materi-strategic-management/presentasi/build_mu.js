const pptxgen = require('pptxgenjs');
const fs = require('fs');
const NOTES = JSON.parse(fs.readFileSync('mu_assets/notes.json', 'utf8'));
const SZ = JSON.parse(fs.readFileSync('mu_assets/sizes.json', 'utf8'));
const SAFE = JSON.parse(fs.readFileSync('mu_assets/safe.json', 'utf8'));

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Kelompok 4';
pptx.title = 'Chapter 4 · Manchester United';
const W = 13.333, H = 7.5;
const MINPT = 12;

const C = { bg: '1A0809', red: 'DA291C', red2: 'A81D14', gold: 'FBE122', white: 'FFFFFF', grey: 'E9DDD8', mute: 'B8A5A0', ink: '160809', ink2: '4A2E2A', cream: 'F1E9D8', cream2: 'E6DCC8', line: '4C2226', black: '0E0505' };
const F = { x: 'Poppins ExtraBold', s: 'Poppins SemiBold', m: 'Poppins Medium', r: 'Poppins', l: 'Poppins Light' };
const SRC_BOOK = 'Sumber: Thompson dkk., Crafting & Executing Strategy (2024), Chapter 4.';
const SRC_CASE = 'Sumber: Grant (2010), Case 6, Manchester United.';
const SRC_C = 'Sumber: Grant (2010), Case 6. ';
let pageNo = 0;
const LAYOUT = [];
function rec(kind, x, y, w, h, extra) { LAYOUT.push(Object.assign({ slide: pageNo, kind, x, y, w, h }, extra || {})); }
const clean = t => t.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '\n');
function notes(s, key) { if (key && NOTES[key]) s.addNotes(clean(NOTES[key])); }

// ---------- text metrics (estimate) ----------
const KW = { 'Poppins ExtraBold': 0.66, 'Poppins SemiBold': 0.61, 'Poppins Medium': 0.59, 'Poppins': 0.57, 'Poppins Light': 0.55 };
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
      const face = r.o.fontFace || o.fontFace || 'Poppins'; const sz = (r.o.fontSize || o.fontSize || 12) * scale;
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
// ---------- primitives ----------
function txt(s, text, x, y, w, h, o = {}) {
  if (o.clamp !== false) {
    const conts = LAYOUT.filter(r => r.slide === pageNo && r.kind === 'container');
    const cx = x + w / 2, cy = y + h / 2; let c = null;
    for (const r of conts) if (r.x <= cx && cx <= r.x + r.w && r.y <= cy && cy <= r.y + r.h) c = r;
    if (c) {
      const nm = c.path.split('/').pop().replace('.png', ''); const [l, t, rr, b] = SAFE[nm];
      const ix = c.x + c.w * l + 0.05, iy = c.y + c.h * t + 0.03, ix2 = c.x + c.w * (1 - rr) - 0.05, iy2 = c.y + c.h * (1 - b) - 0.03;
      if (x < ix) { w -= ix - x; x = ix; } if (x + w > ix2) w = ix2 - x;
      if (y < iy) { h -= iy - y; y = iy; } if (y + h > iy2) h = iy2 - y;
    }
  }
  if (o.fit !== false) {
    const base = o.fontSize || 12;
    const floor = Math.min(1, Math.max(MINPT / base, 0.6));
    let scale = 1;
    while (scale - 0.04 >= floor - 1e-6 && estH(text, o, w, scale) > h) scale -= 0.04;
    if (scale < 1) {
      const sc = r => Object.assign({}, r, { options: Object.assign({}, r.options, r.options && r.options.fontSize ? { fontSize: Math.max(MINPT, Math.round(r.options.fontSize * scale * 2) / 2) } : {}) });
      if (typeof text !== 'string') text = text.map(sc);
      o = Object.assign({}, o, { fontSize: Math.max(MINPT, Math.round(base * scale * 2) / 2) });
    }
  }
  rec('text', x, y, w, h, { text, o });
  s.addText(text, Object.assign({ x, y, w, h, fontFace: F.r, fontSize: 12, color: C.ink, margin: 0, valign: 'top', paraSpaceAfter: 0 }, o));
}
function img(s, path, x, y, w, h, o = {}) { rec(path.startsWith('mu_assets/opt/') ? 'container' : 'image', x, y, w, h, { path, rot: o.rotate || 0 }); s.addImage(Object.assign({ path, x, y, w, h }, o)); }
function rect(s, x, y, w, h, fill, o = {}) { s.addShape(pptx.ShapeType.rect, Object.assign({ x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 } }, o)); }
const PAPERS = { 'paper_43.png': 1.333, 'paper_32.png': 1.5, 'paper_169.png': 1.778 };
function paper(s, x, y, w, h, o = {}) {
  const r = w / h; let best = null, bd = 1e9;
  for (const [n, pr] of Object.entries(PAPERS)) { const d = Math.abs(Math.log(r / pr)) + (r < pr ? 0.25 : 0); if (d < bd) { bd = d; best = n; } }
  img(s, 'mu_assets/opt/' + (o.src || best), x, y, w, h, o.rotate ? { rotate: o.rotate } : {});
}
function red(s, x, y, w, h, o = {}) { img(s, w / h > 1.9 ? 'mu_assets/opt/red_219.png' : 'mu_assets/opt/red_32.png', x, y, w, h, o.rotate ? { rotate: o.rotate } : {}); }
function tape(s, x, y, w, h, o = {}) { img(s, 'mu_assets/opt/black_219.png', x, y, w, h, o.rotate ? { rotate: o.rotate } : {}); }
function sticker(s, name, x, y, w, rot = 0) {
  const [iw, ih] = SZ[name]; const h = w * ih / iw;
  rec('sticker', x, y, w, h, { path: name, rot });
  s.addImage({ path: 'mu_assets/opt/' + name + '.png', x, y, w, h, rotate: rot });
  return h;
}
const PADX = w => Math.max(0.36, 0.045 * w);
// note card on cream paper
function note(s, x, y, w, h, o = {}) {
  paper(s, x, y, w, h, o);
  const padX = o.padX || PADX(w); const px = x + padX, pw = w - 2 * padX;
  let cy = y + (o.padY || Math.max(0.28, 0.085 * h));
  if (o.tag) { txt(s, o.tag, px, cy, pw, 0.24, { fontFace: F.s, fontSize: 12, color: o.tagColor || C.red, charSpacing: 1 }); cy += 0.28; }
  if (o.head) { const hh = o.headH || 0.3; txt(s, o.head, px, cy, pw, hh, { fontFace: F.x, fontSize: o.headSize || 14, color: o.headColor || C.ink, lineSpacingMultiple: 0.95 }); cy += hh + 0.06; }
  if (o.body) txt(s, o.body, px, cy, pw, y + h - cy - Math.max(0.2, 0.06 * h), { fontFace: F.r, fontSize: o.bodySize || 12, color: o.bodyColor || C.ink, lineSpacingMultiple: 1.06 });
}
// red torn banner; grows downward if needed and room allows
function banner(s, x, y, w, h, label, body, o = {}) {
  const px = x + PADX(w), pw = w - 2 * PADX(w);
  const padY = o.padY === undefined ? Math.min(0.4, Math.max(0.26, 0.13 * h)) : o.padY;
  const bo = { fontFace: F.m, fontSize: o.size || 12, color: C.white, lineSpacingMultiple: 1.06, valign: o.valign || 'top' };
  const bot = Math.min(0.45, Math.max(0.3, 0.14 * h));
  const need = padY + (label ? 0.28 : 0) + estH(body, bo, pw) + bot;
  if (need > h && y + need <= 6.9) h = need;
  red(s, x, y, w, h, o);
  if (label) txt(s, label, px, y + padY, pw, 0.24, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, body, px, y + padY + (label ? 0.28 : 0), pw, h - padY - bot - (label ? 0.28 : 0), bo);
  return h;
}
function label(s, text, x, y, w, h = 0.44, o = {}) {
  tape(s, x, y, w, h);
  txt(s, text, x + 0.25, y, w - 0.5, h, { fontFace: F.s, fontSize: o.size || 12, color: o.color || C.white, charSpacing: 1, valign: 'middle', align: o.align || 'left' });
}
const LW = t => t.length * 0.125 + 0.9;
function bullets(items, size = 12, color = C.ink) {
  return items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, fontFace: F.r, fontSize: size, color, paraSpaceAfter: 3 } }));
}
function numTag(s, n, x, y, d = 0.5, fill = C.red) {
  s.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
  txt(s, String(n), x, y, d, d, { fontFace: F.x, fontSize: Math.max(12, d * 26), color: C.white, align: 'center', valign: 'middle', fit: false });
}
function hbars(s, x, y, w, h, items, o = {}) {
  const labW = o.labW || 2.0, valW = 0.8;
  const n = items.length, rowH = h / n, barH = Math.min(rowH * 0.62, 0.36);
  const maxV = Math.max(...items.map(i => Math.abs(i.v))); const minV = Math.min(0, ...items.map(i => i.v)); const span = maxV - minV;
  const plotW = w - labW - valW - 0.1; const zeroX = x + labW + (-minV / span) * plotW;
  items.forEach((it, i) => {
    const cy = y + i * rowH + (rowH - barH) / 2;
    txt(s, it.label, x, cy - 0.04, labW - 0.15, barH + 0.08, { fontFace: it.hi ? F.x : F.r, fontSize: 12, color: C.ink, align: 'right', valign: 'middle', fit: false });
    const bw = Math.abs(it.v) / span * plotW; const bx = it.v >= 0 ? zeroX : zeroX - bw;
    rect(s, bx, cy, Math.max(bw, 0.02), barH, it.hi ? C.red : C.ink2);
    txt(s, it.fmt || String(it.v), it.v >= 0 ? bx + bw + 0.08 : zeroX + 0.08, cy - 0.04, valW, barH + 0.08, { fontFace: F.s, fontSize: 12, color: it.hi ? C.red : C.ink, valign: 'middle', fit: false });
  });
  rect(s, zeroX, y, 0.01, h, C.ink2);
}
function vbars(s, x, y, w, h, items) {
  const n = items.length, slot = w / n, bw = slot * 0.62; const maxV = Math.max(...items.map(i => i.v));
  const labH = 0.3, valH = 0.3, plotH = h - labH - valH;
  items.forEach((it, i) => {
    const bh = it.v / maxV * plotH; const bx = x + i * slot + (slot - bw) / 2; const by = y + valH + (plotH - bh);
    rect(s, bx, by, bw, bh, it.hi ? C.red : C.ink2);
    txt(s, it.fmt || String(it.v), x + i * slot, by - valH, slot, valH, { fontFace: F.s, fontSize: 12, color: it.hi ? C.red : C.ink, align: 'center', valign: 'bottom', fit: false });
    txt(s, it.label, x + i * slot, y + h - labH + 0.05, slot, labH, { fontFace: F.r, fontSize: 12, color: C.ink, align: 'center', fit: false });
  });
  rect(s, x, y + valH + plotH, w, 0.01, C.ink2);
}
function tableStyle(rows, o = {}) {
  return rows.map((r, ri) => r.map((c, ci) => {
    const isHead = ri === 0, isTotal = o.totalRow && ri === rows.length - 1; const hiCol = o.hiCol !== undefined && ci === o.hiCol && !isHead;
    let fill = isHead ? C.red : (ri % 2 ? C.cream : C.cream2); if (isTotal) fill = C.ink; if (hiCol && !isTotal) fill = 'F6D5D0';
    return { text: c, options: { fill: { color: fill }, color: isHead || isTotal ? C.white : C.ink, fontFace: isHead || isTotal || ci === 0 ? F.s : F.r, fontSize: o.fs || 12, align: ci === 0 || (o.leftCols && o.leftCols.includes(ci)) ? 'left' : 'center', valign: 'middle', margin: [3, 6, 3, 6], border: { type: 'solid', color: 'D8CDB8', pt: 0.5 } } };
  }));
}
let pendingOrn = null;
function flushOrn() { if (pendingOrn) { pendingOrn(); pendingOrn = null; } }
const ORN = { 4: 'st_programme', 5: 'st_badges', 6: 'st_shirt99', 7: 'st_trophy', 8: 'st_devil', 9: 'st_boots', 11: 'st_crest', 12: 'st_clock', 13: 'st_floodlight', 14: 'st_pennant', 15: 'st_scarf', 16: 'st_facup', 20: 'st_flare_crowd', 21: 'st_bus', 22: 'st_ball_vintage', 23: 'st_shirt68', 24: 'st_stretford', 25: 'st_players', 26: 'st_trinity', 27: 'st_treble3', 28: 'st_busby', 29: 'st_stadium', 30: 'st_captain', 31: 'st_glory', 32: 'st_plcup', 33: 'st_manager' };
function page(kicker, title, lede, o = {}) {
  flushOrn();
  const s = pptx.addSlide(); pageNo += 1;
  s.background = { path: pageNo % 2 ? 'mu_assets/bg_p1.jpg' : 'mu_assets/bg_p2.jpg' };
  const orn = ORN[pageNo];
  if (orn) {
    const [iw, ih] = SZ[orn]; const r = iw / ih; let w = r > 1.3 ? 2.2 : (r < 0.85 ? 1.55 : 1.7);
    w = Math.min(w, 1.85 * r);
    const rot = pageNo % 2 ? 7 : -7;
    pendingOrn = () => sticker(s, orn, W - 0.55 - w, 0.2, w, rot);
  }
  const cw = 11.93, tw = orn ? 9.4 : 11.6, lw = orn ? 9.6 : 11.4;
  label(s, kicker, 0.7, 0.36, Math.min(6.5, LW(kicker)), 0.44, { color: C.gold });
  let size = 24; const est = sz => title.length * 0.0093 * sz;
  let two = false;
  if (est(size) > tw) { size = Math.max(19, tw / (title.length * 0.0093)); if (est(size) > tw + 0.05) { two = true; size = 20; } }
  txt(s, title, 0.7, two ? 0.88 : 0.94, tw, two ? 0.72 : 0.5, { fontFace: F.x, fontSize: size, color: C.white, lineSpacingMultiple: 0.9, valign: 'top', fit: false });
  const ly = two ? 1.64 : 1.5;
  if (lede) txt(s, lede, 0.7, ly, lw, 0.5, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.05 });
  const fw = 9.6;
  tape(s, 0.7, 6.96, fw, 0.4);
  txt(s, o.src || SRC_BOOK, 1.05, 6.96, fw - 1.6, 0.4, { fontFace: F.r, fontSize: 12, color: C.grey, valign: 'middle' });
  txt(s, String(pageNo).padStart(2, '0'), 0.7 + fw - 1.0, 6.96, 0.6, 0.4, { fontFace: F.s, fontSize: 12, color: C.gold, align: 'right', valign: 'middle' });
  notes(s, o.notes);
  return { s, top: lede ? ly + 0.6 : ly + 0.05, cw };
}

// =============== 1. TITLE ===============
{
  flushOrn(); const s = pptx.addSlide(); pageNo += 1; s.background = { path: 'mu_assets/c_cover.jpg' }; notes(s, '1');
  label(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', 0.7, 0.55, 5.4, 0.44, { color: C.gold });
  txt(s, "EVALUATING A COMPANY'S RESOURCES, CAPABILITIES, AND COMPETITIVENESS", 0.7, 1.15, 5.7, 2.5, { fontFace: F.x, fontSize: 32, color: C.white, lineSpacingMultiple: 0.92, fit: false });
  txt(s, 'Thompson  ·  Peteraf  ·  Gamble  ·  Strickland\nCrafting & Executing Strategy, 2024 Release ISE', 0.7, 3.62, 5.7, 0.6, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.15 });
  red(s, 0.55, 4.0, 5.8, 1.6, { rotate: -1.5 });
  txt(s, 'STUDI KASUS', 0.95, 4.28, 3, 0.25, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, 'Manchester United: Preparing for Life without Ferguson', 0.95, 4.54, 5.0, 0.62, { fontFace: F.x, fontSize: 14, color: C.white, lineSpacingMultiple: 0.98 });
  txt(s, 'Robert M. Grant (2010)   ·   setting Juli 2009', 0.95, 5.14, 5.0, 0.3, { fontFace: F.r, fontSize: 12, color: C.white });
  txt(s, 'DOSEN PENGAMPU', 0.7, 5.75, 3, 0.25, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, 'Dr. Rangga Almahendra, S.T., M.M.', 0.7, 5.99, 5.7, 0.3, { fontFace: F.m, fontSize: 12, color: C.white });
  txt(s, 'KELOMPOK 4', 0.7, 6.38, 3, 0.25, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, 'Fitra Aidila · Aulia Sisca Rahmadiyanti · Bagaskoro\nImam Prayudha · Tegar Awanto', 0.7, 6.62, 5.7, 0.55, { fontFace: F.m, fontSize: 12, color: C.white, lineSpacingMultiple: 1.1 });
}

// =============== 2. AGENDA ===============
{
  const { s, top } = page('ALUR PRESENTASI', 'AGENDA', 'Teori Chapter 4 dibahas lebih dulu, lalu diterapkan pada kasus Manchester United. Urutannya sengaja sama, supaya terlihat framework mana dipakai untuk menjawab apa.', { notes: '2' });
  const items = [
    ['01', 'Framework Chapter 4', 'SLIDE 3 – 17', 'Enam pertanyaan analisis internal dan alatnya: Table 4.1, SWOT, VRIN Test, Value Chain, Competitive Strength Assessment, Priority List.'],
    ['02', 'Penerapan pada Manchester United', 'SLIDE 18 – 32', 'Kinerja, SWOT, resource dan capability, VRIN Test, Value Chain, Benchmarking, dan Competitive Strength Assessment MU pada Juli 2009.'],
    ['03', 'Priority List', 'SLIDE 33', 'Enam isu untuk David Gill, ditulis sebagai pertanyaan sesuai aturan buku.'],
    ['04', 'Diskusi', 'SLIDE 34', 'Tanya jawab dan diskusi kelas.'],
  ];
  const lw = 8.4, rh = 1.12;
  items.forEach((it, i) => {
    const y = top + i * (rh + 0.06);
    txt(s, it[0], 0.7, y, 1.2, 0.8, { fontFace: F.x, fontSize: 30, color: i === 0 ? C.gold : C.red, fit: false });
    txt(s, it[1], 1.95, y + 0.02, lw - 1.3, 0.3, { fontFace: F.s, fontSize: 14, color: C.white });
    txt(s, it[2], 1.95, y + 0.34, 3, 0.24, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
    txt(s, it[3], 1.95, y + 0.6, lw - 1.3, 0.5, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.04 });
    red(s, 0.7, y + rh - 0.02, 0.9, 0.1);
  });
  const iw = 3.25; img(s, 'mu_assets/c_sq_b.jpg', W - 0.7 - iw, top - 0.05, iw, iw, { rotate: 2 });
  sticker(s, 'st_ticket', 9.95, 5.55, 1.6, -12);
}

// =============== 3. ENAM PERTANYAAN ===============
{
  const { s, top } = page('BAGIAN A', 'ENAM PERTANYAAN', 'Chapter 4 adalah satu alur pemeriksaan dalam enam pertanyaan berurutan. Jawaban pertanyaan sebelumnya jadi bahan pertanyaan berikutnya.', { notes: '3' });
  const q = [
    ['Seberapa baik strategi yang sekarang bekerja?', 'Performance indicators + Table 4.1'],
    ['Apa kekuatan dan kelemahan kita, dihadapkan pada peluang dan ancaman?', 'SWOT Analysis'],
    ['Resource dan capability apa yang paling penting, dan apakah tahan lama?', 'Table 4.3 + VRIN Test'],
    ['Bagaimana aktivitas value chain memengaruhi biaya dan nilai pelanggan?', 'Value Chain + Benchmarking'],
    ['Kita lebih kuat atau lebih lemah dari pesaing utama?', 'Competitive Strength Assessment'],
    ['Isu strategis apa yang harus ditangani lebih dulu?', 'Priority List'],
  ];
  const ph = 4.55, pw = ph * 768 / 1376; img(s, 'mu_assets/c_tall_a.jpg', W - 0.75 - pw, top - 0.1, pw, ph, { rotate: 1.5 });
  const w = 2.95, h = 2.2;
  q.forEach((it, i) => {
    const x = 0.7 + (i % 3) * (w + 0.18), y = top + Math.floor(i / 3) * (h + 0.15);
    paper(s, x, y, w, h);
    txt(s, String(i + 1), x + 0.32, y + 0.2, 1, 0.6, { fontFace: F.x, fontSize: 28, color: C.red, fit: false });
    txt(s, it[0], x + 0.32, y + 0.8, w - 0.64, 0.85, { fontFace: F.s, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.0 });
    txt(s, it[1], x + 0.32, y + h - 0.6, w - 0.64, 0.45, { fontFace: F.s, fontSize: 12, color: C.red, lineSpacingMultiple: 1.0 });
  });
}

// =============== 4. FIGURE 4.1 ===============
{
  const { s, top } = page('PERTANYAAN 1', 'KENALI DULU STRATEGI YANG SEDANG DIJALANKAN', 'Sebelum menilai kinerja, pahami dulu komponen strategi perusahaan seperti dipetakan pada Figure 4.1.', { notes: '4', src: 'Sumber: Thompson dkk. (2024), Figure 4.1, hlm. 90.' });
  const fw = 6.1, fh = fw / 1.359;
  paper(s, 0.6, top - 0.1, fw + 0.5, fh + 0.5);
  img(s, 'mu_assets/fig4_1.png', 0.85, top + 0.15, fw, fh);
  const x = 7.45, w = 5.2;
  const h1 = banner(s, x, top, w, 1.5, 'CONTOH: AIRASIA', 'Strategi biaya rendah terlihat konsisten di tiap fungsi: satu tipe pesawat (A320) di operasi, tiket dijual langsung secara online di pemasaran.');
  note(s, x, top + h1 + 0.15, w, 1.55, { head: 'Setelah strategi dikenali', body: 'Kinerja diukur lewat tren penjualan dan laba, harga saham, kekuatan keuangan, retensi pelanggan, pelanggan baru, dan perbaikan proses internal.' });
  note(s, x, top + h1 + 1.85, w, 1.3, { tag: 'CARA PAKAI', body: 'Isi tiap kotak dengan tindakan nyata perusahaan, lalu periksa apakah semuanya saling mendukung.' });
}

// =============== 5. TABLE 4.1 ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  TABLE 4.1', 'FINANCIAL RATIOS: ALAT UKURNYA', 'Penilaian tadi perlu bukti angka. Buku mengelompokkan rasio ke dalam empat kategori, plus satu kelompok ukuran tambahan.', { notes: '6' });
  const g = [
    ['Profitability', 'Seberapa besar laba dihasilkan', ['Gross profit margin', 'Operating profit margin', 'Net profit margin', 'Total return on assets', 'Net return on assets', 'Return on equity', 'Return on invested capital']],
    ['Liquidity', 'Sanggup bayar utang jangka pendek?', ['Current ratio', 'Working capital']],
    ['Leverage', 'Seberapa berat beban utang', ['Total debt-to-assets', 'Long-term debt-to-capital', 'Debt-to-equity', 'Long-term debt-to-equity', 'Times-interest-earned']],
    ['Activity', 'Seberapa efisien aset dikelola', ['Days of inventory', 'Inventory turnover', 'Average collection period']],
  ];
  const w = (cw - 0.6) / 4, h = 3.3;
  g.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    paper(s, x, top, w, h);
    txt(s, it[0], x + 0.32, top + 0.28, w - 0.64, 0.35, { fontFace: F.x, fontSize: 15, color: C.red });
    txt(s, it[1], x + 0.32, top + 0.66, w - 0.64, 0.5, { fontFace: F.r, fontSize: 12, color: C.ink2, lineSpacingMultiple: 1.02 });
    txt(s, bullets(it[2]), x + 0.32, top + 1.22, w - 0.64, h - 1.42);
  });
  banner(s, 0.7, top + 3.45, cw, 0.95, 'UKURAN TAMBAHAN', 'Dividend yield, price-to-earnings ratio, dividend payout ratio, internal cash flow, dan free cash flow. Free cash flow paling penting: sisa kas untuk membiayai langkah strategis baru.');
}

// =============== 6. SWOT ===============
{
  const { s, top, cw } = page('PERTANYAAN 2', 'SWOT ANALYSIS: KENAPA STRATEGI BERHASIL ATAU GAGAL', 'Q1 memberi tahu apakah strategi bekerja, tapi tidak kenapa. SWOT adalah alat paling sederhana untuk mencari sebabnya.', { notes: '7' });
  const sw = [['S', 'Strengths', 'Yang dikuasai atau dimiliki, membuat lebih mampu bersaing', true], ['W', 'Weaknesses', 'Yang tidak dimiliki atau dikerjakan kurang baik dibanding pesaing', false], ['O', 'Opportunities', 'Peluang pasar: apa yang bisa diambil dari luar', false], ['T', 'Threats', 'Ancaman luar yang bisa menggerus laba dan posisi', true]];
  const w = 3.2, h = 1.7;
  sw.forEach((it, i) => {
    const x = 0.7 + (i % 2) * (w + 0.15), y = top + Math.floor(i / 2) * (h + 0.15);
    if (it[3]) red(s, x, y, w, h); else paper(s, x, y, w, h);
    txt(s, it[0], x + 0.36, y + 0.22, 0.75, 0.8, { fontFace: F.x, fontSize: 36, color: it[3] ? C.gold : C.red, fit: false });
    txt(s, it[1], x + 1.1, y + 0.28, w - 1.45, 0.35, { fontFace: F.x, fontSize: 14, color: it[3] ? C.white : C.ink });
    txt(s, it[2], x + 1.1, y + 0.62, w - 1.45, 0.82, { fontFace: F.r, fontSize: 12, color: it[3] ? C.white : C.ink, lineSpacingMultiple: 1.04 });
  });
  const x = 7.4, cwid = 5.25;
  paper(s, x, top, cwid, 3.55);
  txt(s, [
    { text: 'CARA MEMBACANYA\n', options: { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 } },
    { text: 'Nama lain SWOT\n', options: { fontFace: F.x, fontSize: 13, color: C.ink } },
    { text: 'Situational Analysis, analisis situasi.\n\n', options: { fontFace: F.r, fontSize: 12, color: C.ink } },
    { text: 'Neraca strategis\n', options: { fontFace: F.x, fontSize: 13, color: C.ink } },
    { text: 'Kekuatan = aset bersaing. Kelemahan = kewajiban bersaing. Idealnya asetnya jauh lebih berat.\n\n', options: { fontFace: F.r, fontSize: 12, color: C.ink } },
    { text: 'Empat pertanyaan pemandu\n', options: { fontFace: F.x, fontSize: 13, color: C.ink } },
    { text: 'Apakah kekuatan menutup kelemahan? Apakah strategi bertumpu pada kekuatan? Apakah kekuatan kita melampaui pesaing? Apakah strategi menangkal ancaman?', options: { fontFace: F.r, fontSize: 12, color: C.ink } },
  ], x + 0.36, top + 0.36, cwid - 0.72, 2.95, { lineSpacingMultiple: 1.04 });
  banner(s, 0.7, top + 3.7, cw, 0.75, null, [{ text: 'Kenapa SWOT populer: ', options: { fontFace: F.s, color: C.gold } }, { text: 'mudah dipakai dan bisa dipakai dua arah, menilai strategi yang berjalan dan menyusun strategi baru dari nol. Dipakai perusahaan besar sampai sekolah dan lembaga nirlaba.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 7. COMPETENCE LADDER ===============
{
  const { s, top, cw } = page('PERTANYAAN 2  ·  KONSEP INTI', 'TIGA TINGKAT: COMPETENCE SAMPAI CORE COMPETENCE', 'Buku memakai tiga tingkatan yang berbeda. Jangan disamakan: hanya tingkat ketiga yang benar-benar berharga.', { notes: '8' });
  const steps = [['1', 'Competence', 'Aktivitas yang dikuasai dan dikerjakan konsisten baik dengan biaya wajar.', 'Kemampuan biasa. Banyak perusahaan punya.'], ['2', 'Distinctive Competence', 'Kemampuan mengerjakan aktivitas itu LEBIH BAIK dari pesaing.', 'Sudah membedakan, tapi belum tentu inti strategi.'], ['3', 'Core Competence', 'Aktivitas yang dikuasai dengan baik DAN berada di jantung strategi perusahaan.', 'Paling berharga. Sering jadi mesin pertumbuhan.']];
  const w = (cw - 0.4) / 3, base = top + 3.35;
  steps.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2), h = 2.6 + i * 0.35, y = base - h;
    if (i === 2) red(s, x, y, w, h); else paper(s, x, y, w, h);
    const ink = i === 2 ? C.white : C.ink;
    txt(s, it[0], x + 0.32, y + 0.36, 1, 0.65, { fontFace: F.x, fontSize: 32, color: i === 2 ? C.gold : C.red, fit: false });
    txt(s, it[1], x + 0.32, y + 0.96, w - 0.64, 0.35, { fontFace: F.x, fontSize: 14, color: ink });
    txt(s, it[2], x + 0.32, y + 1.3, w - 0.64, 0.62, { fontFace: F.r, fontSize: 12, color: ink, lineSpacingMultiple: 1.0 });
    txt(s, it[3], x + 0.32, y + h - 0.6, w - 0.64, 0.5, { fontFace: F.s, fontSize: 12, color: i === 2 ? C.gold : C.red, lineSpacingMultiple: 1.0 });
  });
  label(s, 'CONTOH DARI BUKU', 0.7, base + 0.12, LW('CONTOH DARI BUKU'), 0.4);
  const ex = [['Procter & Gamble', 'Manajemen merek: Tide, Crest, Pampers, Olay, Febreze.'], ['Nike', 'Desain dan pemasaran sepatu serta apparel olahraga.'], ['Kellogg', 'Pengembangan, produksi, dan pemasaran sereal sarapan.']];
  ex.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2), y = base + 0.6;
    txt(s, [{ text: it[0] + '\n', options: { fontFace: F.s, fontSize: 13, color: C.gold } }, { text: it[1], options: { fontFace: F.r, fontSize: 12, color: C.grey } }], x, y, w, 0.85, { lineSpacingMultiple: 1.04 });
  });
}

// =============== 8. FIGURE 4.2 ===============
{
  const { s, top } = page('PERTANYAAN 2  ·  FIGURE 4.2', 'SWOT BUKAN BIKIN EMPAT DAFTAR', 'Nilai SWOT ada pada kesimpulan yang ditarik dari daftarnya, bukan pada daftarnya. Buku menggambarkannya sebagai tiga langkah.', { notes: '9' });
  const st = [['Identifikasi', 'Susun keempat daftar berdasarkan bukti, bukan opini. Table 4.2 memberi contoh isinya.'], ['Tarik kesimpulan', 'Apa sebab berhasil atau gagalnya strategi? Sisi mana dari situasi perusahaan yang menarik, mana yang tidak?'], ['Terjemahkan jadi tindakan', 'Ubah kesimpulan itu menjadi langkah strategis yang konkret.']];
  paper(s, 0.7, top, 5.8, 3.55);
  st.forEach((it, i) => {
    const y = top + 0.32 + i * 1.05;
    numTag(s, i + 1, 1.05, y + 0.05, 0.5);
    txt(s, it[0], 1.7, y, 4.5, 0.3, { fontFace: F.x, fontSize: 14, color: C.ink });
    txt(s, it[1], 1.7, y + 0.33, 4.45, 0.7, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.04 });
  });
  const x = 6.7, w = 5.95;
  red(s, x, top, w, 3.55);
  txt(s, 'ENAM TINDAKAN DARI LANGKAH 3', x + 0.38, top + 0.36, w - 0.76, 0.3, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, bullets(['Jadikan kekuatan sebagai fondasi strategi', 'Perbaiki kelemahan yang menghambat strategi', 'Pakai kekuatan untuk meredam ancaman besar', 'Kejar peluang yang paling cocok dengan kekuatan', 'Benahi kelemahan yang menghalangi peluang penting', 'Tutup kelemahan yang membuat rentan pada ancaman'], 12, C.white), x + 0.38, top + 0.76, w - 0.76, 2.6, { lineSpacingMultiple: 1.06 });
  txt(s, [{ text: 'Keterbatasan SWOT, diakui bukunya sendiri: ', options: { fontFace: F.s, color: C.gold } }, { text: 'kekuatannya ada pada kesederhanaan, dan itu juga batasnya. Pemahaman lebih dalam butuh alat yang lebih canggih, yaitu Q3 sampai Q5 berikutnya.', options: { fontFace: F.r, color: C.grey } }], 0.7, top + 3.75, 11.9, 0.7, { fontSize: 12, lineSpacingMultiple: 1.06 });
}

// =============== 9. RESOURCE VS CAPABILITY + TABLE 4.3 ===============
{
  const { s, top, cw } = page('PERTANYAAN 3', 'RESOURCE DAN CAPABILITY: DUA HAL BERBEDA', 'Resource itu sesuatu yang perusahaan PUNYA. Capability itu sesuatu yang perusahaan BISA KERJAKAN, dibangun dengan mengerahkan resource.', { notes: '10' });
  const hw = (cw - 0.25) / 2;
  const h1 = banner(s, 0.7, top, hw, 1.0, null, [{ text: 'Resource  ', options: { fontFace: F.x, fontSize: 14, color: C.gold } }, { text: 'Aset bersaing yang dimiliki atau dikendalikan perusahaan. Contoh: merek, pabrik, kas, paten, tim R&D.', options: { fontFace: F.r, fontSize: 12, color: C.white } }], { padY: 0.24 });
  banner(s, 0.7 + hw + 0.25, top, hw, h1, null, [{ text: 'Capability  ', options: { fontFace: F.x, fontSize: 14, color: C.gold } }, { text: 'Kemampuan mengerjakan aktivitas internal dengan baik; disebut juga competence. Contoh: Starbucks melatih karyawan.', options: { fontFace: F.r, fontSize: 12, color: C.white } }], { padY: 0.24 });
  const ty = top + h1 + 0.15;
  label(s, 'TABLE 4.3  ·  TIPE RESOURCE', 0.7, ty, LW('TABLE 4.3  ·  TIPE RESOURCE'), 0.4);
  const tan = [['Fisik', 'tanah, pabrik, peralatan, lokasi, sumber daya alam'], ['Finansial', 'kas, surat berharga, peringkat kredit'], ['Teknologi', 'paten, hak cipta, teknologi produksi dan inovasi'], ['Organisasional', 'sistem IT, sistem kendali, struktur organisasi']];
  const intan = [['Human assets', 'pendidikan, pengalaman, bakat, pengetahuan'], ['Merek & reputasi', 'nama merek, citra, loyalitas, reputasi mutu'], ['Relasi', 'aliansi, joint venture, jaringan dealer'], ['Budaya & insentif', 'norma perilaku, keyakinan bersama, kompensasi']];
  const ph = 6.85 - (ty + 0.5) - 0.02;
  [['TANGIBLE', 'bisa disentuh atau dihitung', tan], ['INTANGIBLE', 'tidak berwujud', intan]].forEach((col, ci) => {
    const x = 0.7 + ci * (hw + 0.25), y0 = ty + 0.5;
    paper(s, x, y0, hw, ph);
    txt(s, [{ text: col[0] + '  ', options: { fontFace: F.x, fontSize: 14, color: C.red } }, { text: col[1], options: { fontFace: F.r, fontSize: 12, color: C.ink2 } }], x + 0.35, y0 + 0.28, hw - 0.7, 0.35);
    rect(s, x + 0.35, y0 + 0.66, hw - 0.7, 0.015, C.red);
    const rh = (ph - 0.95) / 4;
    col[2].forEach((r, ri) => {
      const y = y0 + 0.78 + ri * rh;
      txt(s, r[0], x + 0.35, y, 1.9, rh - 0.05, { fontFace: F.s, fontSize: 12, color: C.ink, valign: 'middle' });
      txt(s, r[1], x + 2.3, y, hw - 2.65, rh - 0.05, { fontFace: F.r, fontSize: 12, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.02 });
    });
  });
}

// =============== 10. FINDING CAPABILITIES ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  LANJUTAN', 'CARA MENEMUKAN CAPABILITY PERUSAHAAN', 'Capability lebih sulit ditemukan daripada resource, karena wujudnya tidak kelihatan. Buku memberi dua cara.', { notes: '11' });
  const cw = 8.7, hw = (cw - 0.2) / 2;
  img(s, 'mu_assets/c_sq_a.jpg', 9.75, top - 0.05, 2.4, 2.4, { rotate: -2 });
  txt(s, 'Capability yang lolos semua saringan adalah yang membawa gelar. Alat ujinya: VRIN Test.', 9.65, top + 2.5, 2.6, 1.4, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.06, align: 'center' });
  note(s, 0.7, top, hw, 1.9, { tag: 'CARA 1', head: 'Dari daftar resource', body: 'Lihat daftar resource, lalu tanya: kemampuan apa yang tumbuh dari sini? Contoh: armada truk, gudang otomatis.' });
  note(s, 0.7 + hw + 0.2, top, hw, 1.9, { tag: 'CARA 2', head: 'Dari fungsi perusahaan', body: 'Telusuri tiap fungsi: injection molding di produksi, direct selling di penjualan, pengembangan produk baru di R&D.' });
  note(s, 0.7, top + 2.0, cw, 1.2, { head: 'Masalahnya: capability terpenting justru lintas fungsi', body: 'Kemampuan desain Warby Parker bukan cuma desainernya, tapi juga riset pasar, rekayasa, dan relasi dengan pemasok serta pabrik.', padY: 0.22 });
  banner(s, 0.7, top + 3.3, cw, 1.45, 'RESOURCE BUNDLE', 'Kumpulan aset bersaing yang terkait erat di sekitar kemampuan lintas fungsi. Bundle bisa lolos VRIN Test meski komponennya tidak. Contoh: paket Nike (styling, riset pasar, endorsement atlet, merek) membuatnya nomor satu lebih dari 20 tahun.');
}

// =============== 11. VRIN ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  FRAMEWORK INTI', 'VRIN TEST: EMPAT SARINGAN', 'Punya resource saja belum berarti unggul. VRIN Test menguji apakah resource benar-benar memberi keunggulan, dan apakah keunggulan itu bertahan.', { notes: '12' });
  const v = [['V', 'Valuable', 'Bernilai untuk bersaing?', 'Harus menopang strategi. Google Wallet gagal meski memakai teknologi yang membuat Google nomor satu di pencarian.'], ['R', 'Rare', 'Langka, tidak dimiliki pesaing?', 'Kalau semua pesaing punya, itu syarat ikut bermain. Kekuatan merek Oreo tidak umum.'], ['I', 'Inimitable', 'Sulit ditiru?', 'Unik, butuh bertahun-tahun, biaya sangat besar, atau melibatkan social complexity dan causal ambiguity.'], ['N', 'Nonsubstitutable', 'Pesaing tak punya jalan lain?', 'Pesaing memakai resource JENIS LAIN untuk hasil sama: otomasi vs tenaga kerja murah.']];
  const w = (cw - 0.6) / 4, h = 3.35;
  v.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    paper(s, x, top, w, h);
    txt(s, it[0], x + 0.32, top + 0.18, 1.2, 0.8, { fontFace: F.x, fontSize: 40, color: C.red, fit: false });
    txt(s, it[1], x + 0.32, top + 1.0, w - 0.64, 0.32, { fontFace: F.x, fontSize: 14, color: C.ink });
    txt(s, it[2], x + 0.32, top + 1.32, w - 0.64, 0.5, { fontFace: F.s, fontSize: 12, color: C.red, lineSpacingMultiple: 1.0 });
    txt(s, it[3], x + 0.32, top + 1.82, w - 0.64, h - 2.0, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.04 });
  });
  const hw = (cw - 0.25) / 2;
  banner(s, 0.7, top + 3.5, hw, 0.9, 'V + R', 'Apakah resource bisa MENCIPTAKAN keunggulan bersaing.');
  banner(s, 0.7 + hw + 0.25, top + 3.5, hw, 0.9, 'I + N', 'Apakah keunggulan itu BISA BERTAHAN menghadapi serangan pesaing.');
}

// =============== 12. DYNAMIC CAPABILITY ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  LANJUTAN', 'RESOURCE HARUS DIKELOLA SECARA DINAMIS', 'VRIN Test menguji serangan dari pesaing. Tapi resource juga bisa menyusut, bahkan hilang, dari dalam perusahaan sendiri.', { notes: '13' });
  const t = [['Pesaing menyusul', 'Yang awalnya tidak bisa meniru, lama-lama menemukan pengganti yang makin baik.'], ['Aset menyusut sendiri', 'Resource terdepresiasi seperti aset lain kalau dibiarkan tanpa perhatian.'], ['Pasar berubah', 'Teknologi, selera, atau jalur distribusi bisa mengubah aset strategis "dari berlian jadi karat".']];
  const w = (cw - 0.4) / 3;
  t.forEach((it, i) => note(s, 0.7 + i * (w + 0.2), top, w, 1.5, { head: it[0], body: it[1] }));
  const y = top + 1.65, rh = 6.85 - y;
  red(s, 0.7, y, 7.4, rh);
  txt(s, 'DYNAMIC CAPABILITY', 1.08, y + 0.34, 5, 0.3, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, 'Kemampuan yang terus berjalan untuk memperbaiki, memperdalam, atau menambah resource dan capability yang sudah ada.', 1.08, y + 0.64, 6.6, 0.75, { fontFace: F.x, fontSize: 14, color: C.white, lineSpacingMultiple: 1.02 });
  txt(s, 'DUA BENTUKNYA', 1.08, y + 1.36, 5, 0.25, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, bullets(['Memperbaiki yang ada sedikit demi sedikit: Toyota terus menyempurnakan mesin hibrida dan Toyota Production System.', 'Menambah yang baru lewat aliansi atau akuisisi: GM bermitra dengan LG dan mendahului Tesla dengan Chevy Bolt EV.'], 12, C.white), 1.08, y + 1.62, 6.6, rh - 2.05, { lineSpacingMultiple: 1.02 });
  note(s, 8.35, y, 4.3, rh, { head: 'Inti dynamic capability', body: 'Ketika memperbarui aset dilakukan terus-menerus sampai jadi rutinitas manajemen, kemampuan memperbarui itu sendiri berubah menjadi capability. Di situlah ia disebut dynamic capability.' });
}

// =============== 13. VALUE CHAIN FIG 4.3 ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  FIGURE 4.3', 'VALUE CHAIN PERUSAHAAN', 'Setiap bisnis adalah kumpulan aktivitas. Value chain memecahnya supaya biaya dan nilai bisa dilacak satu per satu.', { notes: '14' });
  label(s, 'PRIMARY ACTIVITIES  ·  pencipta nilai utama', 0.7, top, LW('PRIMARY ACTIVITIES  ·  pencipta nilai utama'), 0.4);
  const p = [['Supply Chain Management', 'Membeli, menerima, menyimpan input'], ['Operations', 'Mengubah input jadi produk jadi'], ['Distribution', 'Menyimpan dan mengirim ke pembeli'], ['Sales & Marketing', 'Tenaga jual, iklan, promosi, dealer'], ['Service', 'Pemasangan, perbaikan, layanan']];
  const mw = 1.5, w = (cw - mw - 0.12 * 5) / 5, y = top + 0.5, h = 1.6;
  p.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.12);
    paper(s, x, y, w, h);
    txt(s, it[0], x + 0.22, y + 0.24, w - 0.44, 0.6, { fontFace: F.x, fontSize: 12, color: C.ink, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.22, y + 0.86, w - 0.44, 0.8, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.02 });
  });
  const mx = 0.7 + 5 * (w + 0.12);
  red(s, mx, y, mw, h);
  txt(s, 'Profit Margin', mx + 0.12, y + 0.3, mw - 0.24, 0.55, { fontFace: F.s, fontSize: 12, color: C.white, align: 'center', lineSpacingMultiple: 0.98 });
  txt(s, 'P − C', mx + 0.12, y + 0.85, mw - 0.24, 0.5, { fontFace: F.x, fontSize: 18, color: C.gold, align: 'center', fit: false });
  const y2 = y + h + 0.15;
  label(s, 'SUPPORT ACTIVITIES  ·  pendukung', 0.7, y2, LW('SUPPORT ACTIVITIES  ·  pendukung'), 0.4);
  const sp = [['Product R&D, Technology & Systems', 'Riset produk dan proses, desain, otomasi'], ['Human Resource Management', 'Rekrutmen, pelatihan, kompensasi'], ['General Administration', 'Akuntansi, keuangan, hukum, sistem informasi']];
  const sw = (cw - 0.4) / 3;
  sp.forEach((it, i) => {
    const x = 0.7 + i * (sw + 0.2);
    paper(s, x, y2 + 0.48, sw, 0.95);
    txt(s, it[0], x + 0.32, y2 + 0.64, sw - 0.64, 0.3, { fontFace: F.x, fontSize: 12, color: C.ink });
    txt(s, it[1], x + 0.32, y2 + 0.95, sw - 0.64, 0.4, { fontFace: F.r, fontSize: 12, color: C.ink });
  });
  banner(s, 0.7, y2 + 1.55, cw, 0.75, null, [{ text: 'Tiga selisih yang harus dibedakan: ', options: { fontFace: F.s, color: C.gold } }, { text: 'V − P = nilai pelanggan.  P − C = margin laba.  V − C = Total Economic Value, seluruh nilai ekonomi yang diciptakan.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 14. VALUE CHAIN SYSTEM + BENCHMARKING ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  FIGURE 4.4', 'VALUE CHAIN SYSTEM DAN BENCHMARKING', 'Biaya dan mutu yang sampai ke pembeli ditentukan seluruh rantai dari pemasok sampai penjual akhir, bukan perusahaan sendiri saja.', { notes: '15' });
  const ch = [['Value chain PEMASOK', 'Biaya dan mutu input'], ['Value chain PERUSAHAAN', 'Aktivitas internal sendiri'], ['Value chain MITRA HILIR', 'Distributor, dealer, mitra'], ['PEMBELI / PENGGUNA AKHIR', 'Nilai yang dirasakan']];
  const w = (cw - 0.9) / 4;
  ch.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.3);
    if (i === 3) red(s, x, top, w, 1.15); else paper(s, x, top, w, 1.15);
    txt(s, it[0], x + 0.25, top + 0.22, w - 0.45, 0.5, { fontFace: F.x, fontSize: 12, color: i === 3 ? C.white : C.ink, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.25, top + 0.72, w - 0.45, 0.35, { fontFace: F.r, fontSize: 12, color: i === 3 ? C.white : C.ink });
    if (i < 3) s.addShape(pptx.ShapeType.triangle, { x: x + w + 0.07, y: top + 0.44, w: 0.16, h: 0.18, rotate: 90, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  });
  const y = top + 1.32, lw = 5.75, ph = 2.3;
  paper(s, 0.7, y, lw, ph);
  txt(s, 'Benchmarking', 1.05, y + 0.24, lw - 0.7, 0.35, { fontFace: F.x, fontSize: 15, color: C.red });
  txt(s, 'Membandingkan cara perusahaan lain mengerjakan aktivitas yang sama, lalu menirukan cara terbaiknya. Bisa dengan pesaing seindustri, bisa dengan industri lain.', 1.05, y + 0.6, lw - 0.7, 0.9, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.04 });
  txt(s, [{ text: 'Best practice ', options: { fontFace: F.s, color: C.red } }, { text: '= cara yang terbukti konsisten memberi hasil lebih baik, sudah dibuktikan minimal oleh satu perusahaan.', options: { fontFace: F.r, color: C.ink } }], 1.05, y + 1.52, lw - 0.7, 0.7, { fontSize: 12, lineSpacingMultiple: 1.04 });
  const x2 = 0.7 + lw + 0.25, w2 = cw - lw - 0.25;
  paper(s, x2, y, w2, ph);
  txt(s, 'TIGA CONTOH TERKENAL', x2 + 0.35, y + 0.26, w2 - 0.7, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  const ex = [['Xerox', 'Pelopornya. Belajar dari perusahaan kelas dunia mana pun.'], ['Toyota', 'Just-in-time lahir dari mengamati supermarket Amerika.'], ['Southwest', 'Memangkas waktu parkir pesawat dari kru pit balap mobil.']];
  ex.forEach((it, i) => {
    const yy = y + 0.56 + i * 0.56;
    txt(s, it[0], x2 + 0.35, yy, 1.5, 0.52, { fontFace: F.x, fontSize: 12, color: C.ink, valign: 'middle' });
    txt(s, it[1], x2 + 1.85, yy, w2 - 2.25, 0.52, { fontFace: F.r, fontSize: 12, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.02 });
  });
  banner(s, 0.7, y + ph + 0.12, cw, 0.75, null, [{ text: 'Bagian sulitnya bukan memutuskan, tapi mendapat datanya. ', options: { fontFace: F.s, color: C.gold } }, { text: 'Sumber yang sah: laporan publik, asosiasi dagang, firma riset, kunjungan lapangan, konsultan pihak ketiga yang mengumpulkan data secara anonim.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 15. REMEDIES ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  TINDAKAN', 'KALAU BIAYA ATAU NILAINYA KALAH, APA YANG DILAKUKAN', 'Analisis value chain dan benchmarking bisa menunjukkan kita kalah biaya atau kalah nilai. Buku menunjuk tiga area perbaikan.', { notes: '16' });
  const cols = [
    ['1. Aktivitas internal', ['Terapkan best practice di aktivitas mahal', 'Hapus aktivitas yang tidak perlu', 'Pindahkan aktivitas ke wilayah berbiaya rendah', 'Outsourcing jika pihak luar lebih murah', 'Investasi teknologi penaik produktivitas', 'Rancang ulang produk agar murah dibuat']],
    ['2. Bagian pemasok', ['Tekan harga beli ke pemasok', 'Ganti ke input substitusi yang lebih murah', 'Kerja sama mencari penghematan bersama', 'Integrasi ke belakang: produksi sendiri', 'Untuk nilai: pilih pemasok bermutu, libatkan sejak desain']],
    ['3. Bagian mitra hilir', ['Tekan biaya dan markup distributor', 'Kerja sama penghematan yang saling untung', 'Ubah jalur distribusi, termasuk jualan online', 'Integrasi ke depan: buka gerai sendiri', 'Untuk nilai: iklan bersama, eksklusivitas, pelatihan mitra']],
  ];
  const w = (cw - 0.4) / 3, h = 3.45;
  cols.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    paper(s, x, top, w, h);
    txt(s, it[0], x + 0.32, top + 0.28, w - 0.64, 0.35, { fontFace: F.x, fontSize: 14, color: C.red });
    txt(s, bullets(it[1]), x + 0.32, top + 0.7, w - 0.64, h - 0.9, { lineSpacingMultiple: 1.02 });
  });
  banner(s, 0.7, top + 3.58, cw, 0.75, null, [{ text: 'Hanya dua jalan menjadikan value chain keunggulan bersaing: ', options: { fontFace: F.s, color: C.gold } }, { text: '(1) lebih efisien sehingga biaya lebih rendah: Ryanair, Nucor, TJX; (2) jadi dasar diferensiasi sehingga pelanggan mau bayar lebih: Rolex, Braun, L.L. Bean, FedEx.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 16. TABLE 4.4 ===============
{
  const { s, top, cw } = page('PERTANYAAN 5  ·  TABLE 4.4', 'COMPETITIVE STRENGTH ASSESSMENT', 'Alat untuk mengubah penilaian kualitatif menjadi satu angka yang bisa langsung dibandingkan dengan pesaing.', { notes: '17' });
  const steps = [['Daftar KSF', 'Key success factor industri'], ['Beri bobot', 'Total harus 1,00'], ['Beri rating', 'Skala 1 (lemah) sampai 10 (kuat)'], ['Kalikan', 'Rating × bobot = skor'], ['Jumlahkan', 'Ukuran kekuatan keseluruhan']];
  const w = (cw - 0.6) / 5;
  steps.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.15);
    numTag(s, i + 1, x, top + 0.02, 0.46);
    txt(s, it[0], x + 0.58, top, w - 0.6, 0.3, { fontFace: F.x, fontSize: 12, color: C.white });
    txt(s, it[1], x + 0.58, top + 0.3, w - 0.6, 0.55, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.0 });
  });
  const rows = [['Key Success Factor', 'Bobot', 'ABC Co.', 'Rival 1', 'Rival 2'], ['Mutu / performa produk', '0,10', '8 / 0,80', '5 / 0,50', '1 / 0,10'], ['Reputasi dan citra', '0,10', '8 / 0,80', '7 / 0,70', '1 / 0,10'], ['Kemampuan produksi', '0,10', '2 / 0,20', '10 / 1,00', '5 / 0,50'], ['Sumber daya keuangan', '0,10', '5 / 0,50', '10 / 1,00', '3 / 0,30'], ['Posisi biaya relatif', '0,30', '5 / 1,50', '10 / 3,00', '1 / 0,30'], ['Layanan pelanggan', '0,15', '5 / 0,75', '7 / 1,05', '1 / 0,15'], ['Faktor lain (tiga baris)', '0,15', '1,40', '0,45', '0,65'], ['TOTAL SKOR TERTIMBANG', '1,00', '5,95', '7,70', '2,10']];
  const ty = top + 1.05, tw = 7.7, rh = 0.34;
  paper(s, 0.55, ty - 0.22, tw + 0.3, 9 * rh + 0.8);
  s.addTable(tableStyle(rows, { totalRow: true }), { x: 0.7, y: ty, w: tw, colW: [2.9, 0.9, 1.3, 1.3, 1.3], rowH: rh });
  txt(s, 'Contoh Table 4.4 buku. Isi sel: rating / skor tertimbang.', 0.95, ty + 9 * rh + 0.1, tw - 0.5, 0.3, { fontFace: F.r, fontSize: 12, color: C.ink2 });
  const x2 = 0.7 + tw + 0.4, w2 = cw - tw - 0.4;
  const r = [['Selisih total skor', 'Rival 1 (7,70) jauh di atas Rival 2 (2,10): net competitive advantage.'], ['Serang di mana', 'Serang pesaing berskor rendah di faktor tempat kita kuat.'], ['Bertahan di mana', 'Kalau lemah di faktor tempat pesaing kuat, siapkan pertahanan.']];
  banner(s, x2, ty - 0.22, w2, 9 * rh + 0.8, 'CARA MEMBACA ANGKANYA', r.map((it, i) => [{ text: it[0] + '\n', options: { fontFace: F.x, fontSize: 13, color: C.white } }, { text: it[1] + (i < 2 ? '\n' : ''), options: { fontFace: F.r, fontSize: 12, color: C.white, paraSpaceAfter: 6 } }]).flat());
}

// =============== 17. PRIORITY LIST ===============
{
  const { s, top } = page('PERTANYAAN 6', 'ISU APA YANG HARUS DITANGANI LEBIH DULU?', 'Langkah terakhir dan paling penting. Semua temuan Q1 sampai Q5, ditambah analisis industri Chapter 3, dikerucutkan jadi satu daftar prioritas.', { notes: '18' });
  const ph = 3.3, pw = ph * 768 / 1376;
  img(s, 'mu_assets/c_tall_b.jpg', W - 0.75 - pw, top, pw, ph, { rotate: 2 });
  red(s, 0.7, top, 4.9, ph);
  txt(s, 'PRIORITY LIST', 1.08, top + 0.38, 4, 0.3, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, 'Daftar isu dan masalah yang harus dituntaskan manajemen agar perusahaan lebih berhasil, secara keuangan maupun bersaing, di tahun-tahun mendatang.', 1.08, top + 0.72, 4.15, 1.45, { fontFace: F.x, fontSize: 13, color: C.white, lineSpacingMultiple: 1.02 });
  txt(s, 'Isinya selalu berbentuk "bagaimana caranya…", "apa yang harus dilakukan soal…", dan "apakah perlu…".', 1.08, top + 2.2, 4.15, 1.05, { fontFace: F.r, fontSize: 12, color: C.white, lineSpacingMultiple: 1.04 });
  const x = 5.8, w = W - 0.75 - pw - 0.25 - x;
  paper(s, x, top, w, ph);
  txt(s, [
    { text: 'DUA HAL YANG SERING KELIRU\n', options: { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 } },
    { text: 'Ini bukan daftar solusi\n', options: { fontFace: F.x, fontSize: 13, color: C.ink } },
    { text: 'Tujuannya mengidentifikasi ISU, bukan memutuskan tindakan. Keputusan tindakan datang saat menyusun strategi.\n\n', options: { fontFace: F.r, fontSize: 12, color: C.ink } },
    { text: 'Panjang daftar itu diagnosis\n', options: { fontFace: F.x, fontSize: 13, color: C.ink } },
    { text: 'Isinya ringan: strategi sekarang cukup, tinggal disetel. Isinya berat: strategi baru jadi agenda nomor satu.', options: { fontFace: F.r, fontSize: 12, color: C.ink } },
  ], x + 0.35, top + 0.3, w - 0.7, ph - 0.5, { lineSpacingMultiple: 1.04 });
  banner(s, 0.7, top + ph + 0.15, 11.93, 0.9, 'UJI AKHIR CHAPTER 4', 'Strategi yang baik wajib memuat cara menangani SEMUA isu pada daftar prioritas itu. Di sinilah analisis berhenti dan penyusunan strategi dimulai.');
}

// =============== 18. SECTION B ===============
{
  flushOrn(); const s = pptx.addSlide(); pageNo += 1; s.background = { path: 'mu_assets/c_section.jpg' }; notes(s, '20');
  red(s, -0.3, 4.15, 9.2, 1.5, { rotate: -1 });
  txt(s, 'BAGIAN B  ·  STUDI KASUS', 0.7, 4.38, 6, 0.3, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 2 });
  txt(s, 'MANCHESTER UNITED', 0.7, 4.65, 7.6, 0.65, { fontFace: F.x, fontSize: 32, color: C.white, fit: false });
  txt(s, 'Preparing for Life without Ferguson', 0.7, 5.22, 7.6, 0.35, { fontFace: F.m, fontSize: 14, color: C.white });
  tape(s, 0.5, 0.35, 6.4, 0.95);
  txt(s, 'Ditulis Robert M. Grant, dibantu Simon I. Peck, Christopher Carr dan Timothy Smith (2010). Kasus ini bukan dari buku Thompson; kami pakai kerangka Chapter 4 untuk membedahnya.', 0.85, 0.42, 5.75, 0.8, { fontFace: F.r, fontSize: 12, color: C.white, lineSpacingMultiple: 1.04, valign: 'middle' });
}

// =============== 19. SITUASI JULI 2009 ===============
{
  const { s, top } = page('KASUS  ·  SITUASI', 'JULI 2009: KEPUTUSAN YANG DIHADAPI DAVID GILL', null, { notes: '21', src: 'Sumber: Grant (2010), Case 6, hlm. 573 dan 588.' });
  const cards = [['Waktu', 'Juli 2009, tur pramusim ke Malaysia, Indonesia, Korea, dan China. Skuad pulang 28 Juli 2009.'], ['Pengambil keputusan', 'David Gill, Chief Executive Manchester United Football Club Limited.'], ['Keputusan', 'Menyiapkan pengganti Ferguson, yang akhir 2009 berusia 68 tahun. Gill memperkirakan ia pensiun akhir musim 2009–10.']];
  const w = 2.8, ch = 2.35;
  cards.forEach((it, i) => note(s, 0.7 + i * (w + 0.15), top, w, ch, { head: it[0], body: it[1] }));
  img(s, 'mu_assets/c_land.jpg', 9.6, top - 0.05, 3.05, 2.05, { rotate: 2 });
  txt(s, 'Old Trafford, Theatre of Dreams', 9.6, top + 2.08, 3.05, 0.3, { fontFace: F.r, fontSize: 12, color: C.mute });
  const y = top + ch + 0.15, ph = 6.85 - y;
  paper(s, 0.7, y, 11.95, ph);
  txt(s, 'DILEMA INTI  ·  KASUS HLM. 588', 1.3, y + 0.3, 6, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  txt(s, [{ text: 'Pilih orang dalam ', options: { fontFace: F.x, color: C.ink } }, { text: '(Queiroz, Phelan, Solskjær, McClair): sistem latihan, pemanduan bakat, dan pengembangan tim tetap jalan. Tapi cukup berwibawakah mereka di depan pemain bintang?', options: { fontFace: F.r, color: C.ink } }], 1.3, y + 0.62, 5.25, 1.0, { fontSize: 12, lineSpacingMultiple: 1.04 });
  txt(s, [{ text: 'Pilih orang luar berwibawa ', options: { fontFace: F.x, color: C.ink } }, { text: 'seperti Mourinho: "a revolutionary change in coaching strategy in which much of Ferguson\'s infrastructure would be taken down and rebuilt".', options: { fontFace: F.r, color: C.ink } }], 6.85, y + 0.62, 5.2, 1.0, { fontSize: 12, lineSpacingMultiple: 1.04 });
  red(s, 1.15, y + ph - 0.9, 11.05, 0.55);
  txt(s, 'Pertanyaan Chapter 4 di baliknya: aset mana yang milik klub, dan aset mana yang milik satu orang?', 1.5, y + ph - 0.9, 10.4, 0.55, { fontFace: F.s, fontSize: 12, color: C.white, valign: 'middle' });
}

// =============== 20. INDUSTRY ===============
{
  const { s, top, cw } = page('KONTEKS', 'SEPAKBOLA EROPA SEBAGAI INDUSTRI', 'Q1 menuntut perbandingan dengan pesaing. Jadi kita perlu tahu dulu industrinya seperti apa.', { notes: '22', src: SRC_C + 'Table 6.6 dan teks kasus.' });
  const w = (cw - 0.5) / 3;
  [['€2,4 M', 'Pendapatan Premier League 2007–08', 'Terbesar di Eropa. Serie A, La Liga, Bundesliga masing-masing sekitar €1,4 miliar.'], ['62%', 'Porsi gaji terhadap pendapatan', 'Premier League. Serie A 68%, La Liga 63%. Gaji adalah pos biaya terbesar klub Eropa.'], ['6 dari 10', 'Klub besar di Table 6.6 merugi', 'Selama 2000–2006. Industri ini tumbuh pesat, tapi sangat tidak menguntungkan.']].forEach((it, i) => {
    const x = 0.7 + i * (w + 0.25);
    txt(s, it[0], x, top - 0.05, w, 0.6, { fontFace: F.x, fontSize: 26, color: i === 2 ? C.gold : C.white, fit: false });
    red(s, x, top + 0.6, 1.6, 0.1);
    txt(s, it[1], x, top + 0.78, w, 0.3, { fontFace: F.s, fontSize: 12, color: C.gold });
    txt(s, it[2], x, top + 1.08, w - 0.2, 0.7, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.02 });
  });
  const y = top + 1.85, lw = 6.4, ph = 6.85 - y;
  paper(s, 0.7, y, lw, ph);
  txt(s, 'TIGA SUMBER PENDAPATAN  ·  PREMIER LEAGUE 2007–08', 1.15, y + 0.34, lw - 0.8, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  const rev = [['Matchday', '£554 jt', 'Tiket dan hospitality. Dibatasi kapasitas stadion, sebabnya klub besar membangun stadion baru.'], ['Broadcasting', '£931 jt', 'Hak siar dinegosiasikan liga. Kontrak 2006 £2,7 miliar; tiap klub rata-rata £45 juta per tahun.'], ['Commercial', '£447 jt', 'Sponsor, merchandise, iklan. Terpusat di sedikit klub: Real Madrid dan Barcelona 60% sponsor La Liga.']];
  const rh = (ph - 0.84) / 3;
  rev.forEach((it, i) => {
    const yy = y + 0.68 + i * rh;
    txt(s, it[0], 1.15, yy, 1.5, 0.3, { fontFace: F.x, fontSize: 12, color: C.ink });
    txt(s, it[1], 1.15, yy + 0.3, 1.5, 0.3, { fontFace: F.x, fontSize: 13, color: C.red });
    txt(s, it[2], 2.7, yy, lw - 2.4, rh - 0.05, { fontFace: F.r, fontSize: 12, color: C.ink, valign: 'top', lineSpacingMultiple: 1.02 });
  });
  const x2 = 0.7 + lw + 0.3, w2 = cw - lw - 0.3;
  paper(s, x2, y, w2, ph);
  txt(s, 'ATURAN MAIN DAN LOGIKA EKONOMINYA', x2 + 0.36, y + 0.34, w2 - 0.72, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  const rules = [['Struktur kompetisi', 'Tiga terbawah turun kasta; empat teratas lolos Champions League (32 klub terbaik Eropa).'], ['Yang kaya makin kaya', 'Sejak UCL 1992, muncul jurang keuangan antara MU, Chelsea, Liverpool, Arsenal dan sisanya.'], ['Harga pemain meledak', 'Rekor transfer baru musim panas 2009 meski resesi: Real Madrid, Chelsea, Manchester City.']];
  rules.forEach((it, i) => {
    const yy = y + 0.68 + i * rh;
    txt(s, it[0], x2 + 0.35, yy, w2 - 0.7, 0.26, { fontFace: F.x, fontSize: 12, color: C.ink });
    txt(s, it[1], x2 + 0.35, yy + 0.27, w2 - 0.7, rh - 0.3, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.02 });
  });
}

// =============== 21. ON PITCH ===============
{
  const { s, top } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI LAPANGAN: JELAS DI ATAS RATA-RATA', 'Indikator kedua Thompson, apakah posisi dan kekuatan bersaingnya membaik, dijawab data kompetisi kasus.', { notes: '23', src: SRC_C + 'Table 6.1, 6.2 dan 6.7.' });
  const stats = [['1.460', 'Poin Eropa 2000–2009, tertinggi  ·  Table 6.2', 'Barcelona 1.411 · Real Madrid 1.314 · Arsenal 1.310'], ['3', 'Gelar liga beruntun 2007–2009  ·  Table 6.1', 'Total 11 gelar liga sejak 1993 dalam rentang kasus'], ['2008', 'Liga Champions kedua era Ferguson  ·  hlm. 584', 'Yang pertama 1999, bersama gelar liga dan FA Cup']];
  stats.forEach((it, i) => {
    const y = top + i * 1.55;
    txt(s, it[0], 0.7, y - 0.05, 4.3, 0.6, { fontFace: F.x, fontSize: 26, color: C.white, fit: false });
    red(s, 0.7, y + 0.6, 1.4, 0.1);
    txt(s, it[1], 0.7, y + 0.76, 4.3, 0.3, { fontFace: F.s, fontSize: 12, color: C.gold });
    txt(s, it[2], 0.7, y + 1.04, 4.3, 0.45, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.02 });
  });
  const x = 5.3, cw2 = 7.35;
  paper(s, x, top - 0.05, cw2, 4.7);
  txt(s, 'POIN PERFORMA EROPA 2000–09  ·  TABLE 6.2', x + 0.4, top + 0.4, cw2 - 0.8, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  hbars(s, x + 0.4, top + 0.75, cw2 - 0.8, 2.65, [{ label: 'Man United', v: 1460, fmt: '1.460', hi: true }, { label: 'Barcelona', v: 1411, fmt: '1.411' }, { label: 'Real Madrid', v: 1314, fmt: '1.314' }, { label: 'Bayern', v: 1314, fmt: '1.314' }, { label: 'Arsenal', v: 1310, fmt: '1.310' }, { label: 'Chelsea', v: 1276, fmt: '1.276' }], { labW: 1.7 });
  txt(s, 'Di antara enam klub ini, skuad MU paling besar (34 pemain) dan termuda kedua (25,6 tahun) setelah Arsenal. Cocok dengan strategi memadukan pemain muda dan berpengalaman (Table 6.7).', x + 0.35, top + 3.5, cw2 - 0.7, 0.95, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.04 });
}

// =============== 22. FINANCE ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI KEUANGAN: PALING UNTUNG DI ANTARA KLUB BESAR', 'Indikator pertama Thompson, apakah kekuatan keuangan dan labanya membaik, dijawab Appendix kasus serta Table 6.5 dan 6.6.', { notes: '24', src: SRC_C + 'Appendix hlm. 589, Table 6.5 dan 6.6.' });
  const lw = 7.3, ph = 3.6;
  paper(s, 0.7, top, lw, ph);
  txt(s, 'PENDAPATAN MU, £ JUTA  ·  NAIK 53% DARI 2006 KE 2008', 1.1, y0 = top + 0.36, lw - 0.8, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  vbars(s, 1.1, top + 0.66, lw - 0.8, 2.0, [{ label: '2000', v: 116.0, fmt: '116,0' }, { label: '2001', v: 129.6, fmt: '129,6' }, { label: '2002', v: 146.1, fmt: '146,1' }, { label: '2003', v: 173.0, fmt: '173,0' }, { label: '2004', v: 169.1, fmt: '169,1' }, { label: '2005', v: 157.2, fmt: '157,2' }, { label: '2006', v: 167.8, fmt: '167,8' }, { label: '2007', v: 212.2, fmt: '212,2', hi: true }, { label: '2008', v: 257.1, fmt: '257,1', hi: true }]);
  txt(s, 'Entitas plc 2000–2005, Limited 2006–2008. Tahun buku 2000–04 sampai 31 Juli, 2005–08 sampai 30 Juni; kasus menyebut data 2000–04 tidak sebanding dengan 2005–08.', 1.05, top + 2.72, lw - 0.7, 0.7, { fontFace: F.r, fontSize: 12, color: C.ink2, lineSpacingMultiple: 1.02 });
  const x = 0.7 + lw + 0.25, w = cw - lw - 0.25;
  paper(s, x, top, w, ph);
  txt(s, 'BUKTI PENDUKUNG', x + 0.36, top + 0.36, w - 0.72, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  const ev = [['×2,2', 'Laba bersih £21,6 jt (2006) ke £46,8 jt (2008). Margin bersih 18,2%'], ['12,6%', 'Return on sales 2000–06, tertinggi dari 10 klub. Real Madrid 0,4%'], ['€101,9 jt', 'EBITDA tertinggi Table 6.5. Margin 31,4% vs Barcelona 22,3%'], ['£1,14 M', 'Nilai klub tertinggi Table 6.5, di atas Barcelona £960 jt']];
  const rh = (ph - 0.9) / 4;
  ev.forEach((it, i) => {
    const yy = top + 0.68 + i * rh;
    txt(s, it[0], x + 0.36, yy, 1.3, rh - 0.05, { fontFace: F.x, fontSize: 14, color: C.red, valign: 'middle' });
    txt(s, it[1], x + 1.7, yy, w - 2.05, rh - 0.05, { fontFace: F.r, fontSize: 12, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + ph + 0.12, cw, 0.75, null, [{ text: 'Satu angka yang merusak gambaran ini: ', options: { fontFace: F.s, color: C.gold } }, { text: 'utang £616 juta, tertinggi kedua di Table 6.5 setelah Arsenal (£896 juta). Akuisisi Glazer 2005 dibiayai terutama dengan utang (hlm. 584).', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}
var y0;

// =============== 23. TRANSFER ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  KESIMPULAN', 'PRESTASI PUNCAK, BELANJA RELATIF HEMAT', 'Analisis turunan kami dari Table 6.7: dari empat klub berprestasi tertinggi, belanja bersih MU yang paling kecil.', { notes: '25', src: SRC_C + 'Table 6.7; perbandingan disusun kelompok.' });
  const lw = 7.3, ph = 3.6;
  paper(s, 0.7, top, lw, ph);
  txt(s, 'BELANJA TRANSFER BERSIH 2003–09, £ JUTA', 1.1, top + 0.36, lw - 0.8, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  hbars(s, 1.1, top + 0.72, lw - 0.8, 1.9, [{ label: 'Real Madrid (183,0 poin)', v: 438 }, { label: 'Barcelona (200,0 poin)', v: 249 }, { label: 'Bayern (179,5 poin)', v: 122 }, { label: 'Man United (192,5 poin)', v: 100, hi: true }], { labW: 2.75 });
  txt(s, 'Arsenal belanja lebih sedikit (£22 jt) dan AC Milan penjual bersih (−£66 jt), tapi poinnya 162,0 dan 169,0, di bawah MU.', 1.05, top + 2.75, lw - 0.7, 0.7, { fontFace: F.r, fontSize: 12, color: C.ink2, lineSpacingMultiple: 1.02 });
  const x = 0.7 + lw + 0.25, w = cw - lw - 0.25;
  red(s, x, top, w, 1.55);
  txt(s, '4,4×', x + 0.32, top + 0.16, 2, 0.55, { fontFace: F.x, fontSize: 26, color: C.gold, fit: false });
  txt(s, 'Real Madrid belanja 4,4 kali lipat MU (£438 jt vs £100 jt), tapi poin performanya lebih rendah: 183,0 vs 192,5.', x + 0.32, top + 0.7, w - 0.64, 0.8, { fontFace: F.m, fontSize: 12, color: C.white, lineSpacingMultiple: 1.02 });
  paper(s, x, top + 1.65, w, ph - 1.65);
  const mini = [['Chelsea', '£430 jt belanja bersih, hanya 144,5 poin.'], ['Barcelona', 'Satu-satunya di atas MU, belanja 2,5× lipat.'], ['Kata kasus', 'Belanja bersih MU "relatif sederhana" (hlm. 586).']];
  mini.forEach((it, i) => {
    const yy = top + 1.9 + i * 0.55;
    txt(s, it[0], x + 0.32, yy, 1.3, 0.5, { fontFace: F.x, fontSize: 12, color: C.ink, valign: 'middle' });
    txt(s, it[1], x + 1.65, yy, w - 2.0, 0.5, { fontFace: F.r, fontSize: 12, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + ph + 0.12, cw, 0.75, null, [{ text: 'Jawaban Q1: ', options: { fontFace: F.s, color: C.gold } }, { text: 'strategi MU bekerja sangat baik. Kedua indikator Thompson terpenuhi, di industri yang mayoritas pelakunya merugi. Pertanyaan berikutnya: kenapa bisa begitu.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 24. SWOT MU ===============
{
  const { s, top } = page('PERTANYAAN 2  ·  DITERAPKAN', 'SWOT MANCHESTER UNITED, JULI 2009', 'Temuan Q1 dirangkum, lalu ditarik kesimpulan sesuai langkah 2 dan 3 Figure 4.2, bukan berhenti di daftar.', { notes: '26', src: SRC_CASE });
  const q = [
    ['S', 'Strengths', ['Merek global, 80 juta pendukung di Asia', 'Laba tertinggi: EBITDA €101,9 jt, RoS 12,6%', 'Akademi dan pemandu bakat yang matang', 'Disiplin transfer: belanja bersih £100 jt'], true],
    ['W', 'Weaknesses', ['Bergantung pada Ferguson, 68 tahun akhir 2009', 'Belum ada keputusan suksesi', 'Ronaldo, pemain peringkat FIFA, baru dijual', 'Utang £616 jt dari akuisisi Glazer 2005'], false],
    ['O', 'Opportunities', ['Pasar Asia: India dan Cina target Aon', 'Sponsor per negara bisa diperbanyak', 'Hak siar Premier League naik 43% setahun', 'Kanal digital: MUTV, MU Mobile, toko online'], false],
    ['T', 'Threats', ['Harga pemain meledak; City belanja £185 jt', 'Pemilik super kaya: Abramovich, Mansour', 'MU tak dapat suntikan dana pemilik', 'Barcelona unggul poin 200,0 vs 192,5'], true],
  ];
  const cw = 11.93, w = (cw - 0.2) / 2, h = 1.72;
  q.forEach((it, i) => {
    const x = 0.7 + (i % 2) * (w + 0.2), y = top + Math.floor(i / 2) * (h + 0.06);
    if (it[3]) red(s, x, y, w, h); else paper(s, x, y, w, h);
    txt(s, it[0], x + 0.32, y + 0.2, 0.78, 0.8, { fontFace: F.x, fontSize: 34, color: it[3] ? C.gold : C.red, fit: false });
    txt(s, it[1], x + 1.15, y + 0.24, 3, 0.3, { fontFace: F.x, fontSize: 14, color: it[3] ? C.white : C.ink });
    txt(s, bullets(it[2], 12, it[3] ? C.white : C.ink), x + 1.15, y + 0.5, w - 1.5, 1.0, { lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + 2 * h + 0.16, cw, 0.75, null, [{ text: 'Kesimpulan (langkah 2): ', options: { fontFace: F.s, color: C.gold } }, { text: 'kekuatan MU cukup untuk menangkap peluang komersial Asia. Tapi kelemahan terbesarnya, ketergantungan pada Ferguson, menyerang sisi lapangan, syarat mengalirnya pendapatan komersial.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 25. RESOURCE INVENTORY ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DITERAPKAN', 'INVENTARISASI RESOURCE MANCHESTER UNITED', 'Langkah pertama Q3: mendaftar aset bersaing klub memakai delapan kategori Table 4.3, semuanya dari bukti kasus.', { notes: '27', src: SRC_CASE });
  const tan = [['Finansial', 'EBITDA €101,9 jt, tertinggi Table 6.5; laba bersih 2008 £46,8 jt; ekuitas £294 jt.'], ['Fisik', 'Old Trafford, diperluas 2006 (+7.500 kursi); museum, tur stadion, suite, ballroom.'], ['Teknologi', 'MUTV (siaran web), MU Mobile (SMS dan video), toko online store.manutd.com.'], ['Organisasional', 'Urusan tim (Ferguson) terpisah dari komersial (Gill, Richard Arnold); MU International.']];
  const intan = [['Human assets', 'Ferguson sejak 1986; skuad 34 pemain; 20+ pemandu bakat. Ronaldo, peringkat 1 FIFA, dijual 2009.'], ['Merek & reputasi', '80 juta pendukung di Asia; sub-merek Fred the Red, MUFC, Red Devil. Aon: tak tertandingi.'], ['Relasi', 'Nike dan AIG (diganti Aon, £80 jt/4 tahun), 13 sponsor lain termasuk Tri Indonesia, Bharti Airtel.'], ['Budaya & insentif', 'Disiplin latihan ketat, perang terhadap alkohol, "tidak ada pemain lebih besar dari klub".']];
  const hw = (cw - 0.25) / 2, ph = 3.5;
  [['TANGIBLE', tan], ['INTANGIBLE', intan]].forEach((col, ci) => {
    const x = 0.7 + ci * (hw + 0.25);
    paper(s, x, top, hw, ph);
    txt(s, col[0], x + 0.35, top + 0.26, hw - 0.7, 0.3, { fontFace: F.x, fontSize: 13, color: C.red, charSpacing: 2 });
    rect(s, x + 0.35, top + 0.6, hw - 0.7, 0.015, C.red);
    const rh = (ph - 0.95) / 4;
    col[1].forEach((r, ri) => {
      const y = top + 0.72 + ri * rh;
      txt(s, r[0], x + 0.35, y, 1.55, rh - 0.05, { fontFace: F.x, fontSize: 12, color: C.ink, valign: 'middle' });
      txt(s, r[1], x + 1.95, y, hw - 2.3, rh - 0.05, { fontFace: F.r, fontSize: 12, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.0 });
    });
  });
  banner(s, 0.7, top + ph + 0.12, cw, 0.75, null, [{ text: 'Perhatikan komposisinya: ', options: { fontFace: F.s, color: C.gold } }, { text: 'aset yang paling membedakan MU ada di kolom kanan, yang tak berwujud. Itu yang membuat klub unggul sekaligus rapuh: sebagian melekat pada orang, dan orang bisa pergi.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 26. CAPABILITIES ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DITERAPKAN', 'CAPABILITY MU, DAN MANA YANG CORE COMPETENCE', 'Kami pakai tingkatan di slide 7: mana yang competence, mana distinctive, dan mana yang benar-benar core competence.', { notes: '28', src: SRC_CASE });
  const c = [['CORE COMPETENCE', 'Mengenali dan membina bakat', 'Pemandu bakat dari 5 jadi 20+; Youth Academy; dua pemandu di Brasil.'], ['CORE COMPETENCE', 'Membentuk dan merotasi tim', 'Memadukan pemain muda dan berpengalaman; pelopor rotasi skuad.'], ['CORE COMPETENCE', 'Mengubah merek jadi uang', 'Sponsor per negara, sub-merek per usia, MU Finance, MUTV, tur Asia.'], ['DISTINCTIVE', 'Disiplin di pasar transfer', 'Belanja kotor £322 jt, bersih £100 jt. Mau menjual pemain yang dihargai tinggi: Ronaldo £80 jt.'], ['DISTINCTIVE', 'Tata kelola klub', 'Klub Inggris "paling berhasil membangun tata kelola efektif". Glazer memilih peran pasif.'], ['COMPETENCE', 'Mengelola stadion dan acara', 'Old Trafford disewakan untuk konferensi dan pernikahan; museum dan tur. Klub besar lain juga bisa.']];
  const w = (cw - 0.4) / 3, h = 1.75;
  c.forEach((it, i) => {
    const x = 0.7 + (i % 3) * (w + 0.2), y = top + Math.floor(i / 3) * (h + 0.12);
    const core = it[0] === 'CORE COMPETENCE';
    if (core) { red(s, x, y, w, h); txt(s, it[0], x + 0.32, y + 0.24, w - 0.64, 0.24, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 }); txt(s, it[1], x + 0.32, y + 0.52, w - 0.64, 0.3, { fontFace: F.x, fontSize: 12, color: C.white }); txt(s, it[2], x + 0.32, y + 0.86, w - 0.64, h - 1.02, { fontFace: F.r, fontSize: 12, color: C.white, lineSpacingMultiple: 1.0 }); }
    else note(s, x, y, w, h, { tag: it[0], tagColor: it[0] === 'COMPETENCE' ? C.ink2 : C.red, head: it[1], headSize: 12, body: it[2], padY: 0.24 });
  });
  banner(s, 0.7, top + 2 * h + 0.24, cw, 0.75, null, [{ text: 'Yang perlu disadari: ', options: { fontFace: F.s, color: C.gold } }, { text: 'tiga capability penentu prestasi lapangan (bakat, tim, transfer) dibangun dan diarahkan Ferguson. Tiga lainnya berdiri di luar dirinya.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 27. VRIN MU ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  VRIN TEST', 'DUA KEUNGGULAN, SAMA-SAMA LOLOS VRIN TEST', 'Dua hal diuji dengan empat saringan yang sama: sistem Ferguson, dan merek beserta mesin komersialnya.', { notes: '29', src: SRC_C + 'Table 6.5, 6.8; hlm. 573–588.' });
  const cw = 11.0;
  const rows = [['Tes', 'Sistem Ferguson', 'Merek & mesin komersial'],
    ['Valuable', 'LOLOS. Poin Eropa tertinggi, tiga liga beruntun, UCL 2008. Ferguson memenangi lebih banyak gelar dari seluruh sejarah klub.', 'LOLOS. Aon membayar £80 jt untuk 4 tahun (£20 jt per tahun), dua kali lipat Chelsea dan Samsung (£10 jt).'],
    ['Rare', 'LOLOS. Table 6.8 hanya memuat 15 pelatih paling dihormati dunia; Ferguson paling lama di satu klub, sejak 1986.', 'LOLOS. Kasus hanya menyebut MU dan Real Madrid sebagai pemimpin merek global. 80 juta pendukung di Asia.'],
    ['Inimitable', 'LOLOS. Penentu performa tim "tetap misteri, menentang analisis": causal ambiguity, plus 23 tahun akumulasi.', 'LOLOS. Dibangun sejak 1878. Chelsea, meski belanja besar, pendapatannya masih di bawah MU (Table 6.5).'],
    ['Nonsubstitutable', 'LOLOS. Jalan lain, membeli bintang dengan uang besar, tidak menyamai hasilnya: Real Madrid dan Chelsea "gagal".', 'LOLOS. Superstar datang dan pergi; basis fan tetap. Aon menyebut fan Asia MU faktor kunci kontraknya.']];
  const rh = [0.4, 0.78, 0.78, 0.78, 0.78];
  paper(s, 0.55, top - 0.22, cw + 0.3, 3.9);
  s.addTable(tableStyle(rows, { leftCols: [1, 2] }), { x: 0.7, y: top, w: cw, colW: [1.7, 4.65, 4.65], rowH: rh });
  banner(s, 0.7, top + 3.8, cw, 0.75, null, [{ text: 'Kesimpulan Q3: ', options: { fontFace: F.s, color: C.gold } }, { text: 'keduanya lolos VRIN Test, jadi tahan terhadap serangan PESAING. Bedanya di luar VRIN: merek melekat pada klub, sistem Ferguson dipimpin satu orang yang akan pensiun.', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 28. DYNAMIC CAPABILITY MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DYNAMIC CAPABILITY', 'TIGA KALI MEMBANGUN ULANG TIM JUARA', 'Inilah yang tidak diukur VRIN Test: apakah kemampuan memperbarui diri ini milik klub, atau milik satu orang.', { notes: '30', src: SRC_C + 'hlm. 583 dan 584.' });
  const cyc = [['1986 – 1993', 'Membersihkan dan membangun fondasi', 'Ferguson menyingkirkan pemain kurang berbakat atau berkomitmen, mempertahankan Robson, mendatangkan Hughes, Ince, Cantona, Keane, dan menegakkan disiplin.', 'FA Cup 1990 · Piala Winners 1991 · liga 1993'], ['1994 – 2003', 'Generasi akademi', 'Juara liga junior 1990 menghasilkan Giggs, Beckham, Butt, Neville bersaudara, Scholes: inti tim yang mendominasi sepakbola Inggris.', 'Puncak 1999: liga, FA Cup, European Cup, Intercontinental'], ['2003 – 2008', 'Regenerasi kedua', 'Beckham, Keane, Schmeichel, Cole, Sheringham, Stam dijual. Pengganti: Ferdinand, Ronaldo, Rooney, van der Sar, Evra, Vidić, Carrick.', 'UCL 2008 · tiga liga beruntun 2007–2009']];
  const w = (cw - 0.4) / 3, h = 3.25;
  red(s, 0.7, top + 0.06, cw, 0.12);
  cyc.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    s.addShape(pptx.ShapeType.ellipse, { x: x + 0.15, y: top, w: 0.24, h: 0.24, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
    paper(s, x, top + 0.4, w, h);
    txt(s, it[0], x + 0.32, top + 0.64, w - 0.64, 0.42, { fontFace: F.x, fontSize: 18, color: C.red, fit: false });
    txt(s, it[1], x + 0.32, top + 1.08, w - 0.64, 0.6, { fontFace: F.x, fontSize: 13, color: C.ink, lineSpacingMultiple: 0.95 });
    txt(s, it[2], x + 0.32, top + 1.68, w - 0.64, 1.35, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.02 });
    txt(s, it[3], x + 0.32, top + 3.03, w - 0.64, 0.45, { fontFace: F.s, fontSize: 12, color: C.red, lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + 3.78, cw, 0.85, null, [{ text: 'Preseden dari kasus: ', options: { fontFace: F.s, color: C.gold } }, { text: 'setelah Matt Busby pensiun 1969, MU merosot. Selama 18 tahun sebelum Ferguson, MU tanpa satu pun gelar liga dan hanya sekali runner-up (hlm. 583).', options: { fontFace: F.m, color: C.white } }], { padY: 0.22 });
}

// =============== 29. VALUE CHAIN MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  DITERAPKAN', 'VALUE CHAIN DAN STRUKTUR BIAYA MU', 'Figure 4.3 dipetakan ke aktivitas nyata klub. Hasilnya: keunggulan biaya MU ada di HULU, di cara mendapatkan pemain.', { notes: '31', src: SRC_C + 'hlm. 580, 583, 584, 586.' });
  const lw = 7.5;
  label(s, 'PRIMARY ACTIVITIES', 0.7, top, LW('PRIMARY ACTIVITIES'), 0.38);
  const p = [['Supply Chain', 'Merekrut pemain', 'Akademi dan transfer'], ['Operations', 'Latihan dan laga', 'Disiplin, rotasi, taktik'], ['Distribution', 'Siaran laga', 'Hak siar, MUTV, stadion'], ['Sales & Marketing', 'Menjual merek', 'Nike, Aon, tur Asia'], ['Service', 'Layanan fan', 'Toko, museum, MU Mobile']];
  const w = (lw - 0.4) / 5, ph1 = 2.0;
  p.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.1), y = top + 0.46;
    if (i === 0) red(s, x, y, w, ph1); else paper(s, x, y, w, ph1);
    const ink = i === 0 ? C.white : C.ink;
    txt(s, it[0], x + 0.14, y + 0.24, w - 0.28, 0.5, { fontFace: F.s, fontSize: 12, color: i === 0 ? C.gold : C.red, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.14, y + 0.76, w - 0.28, 0.55, { fontFace: F.x, fontSize: 12, color: ink, lineSpacingMultiple: 0.98 });
    txt(s, it[2], x + 0.14, y + 1.28, w - 0.28, 0.62, { fontFace: F.r, fontSize: 12, color: ink, lineSpacingMultiple: 1.0 });
  });
  label(s, 'SUPPORT ACTIVITIES', 0.7, top + 2.58, LW('SUPPORT ACTIVITIES'), 0.38);
  const sp = [['Product R&D & Systems', 'Metodologi akademi, rotasi skuad, MUTV'], ['Human Resource Mgmt', 'Rekrutmen, struktur gaji, disiplin'], ['General Administration', 'Pemisahan peran Gill dan Ferguson']];
  const sw = (lw - 0.2) / 3;
  sp.forEach((it, i) => {
    const x = 0.7 + i * (sw + 0.1), y = top + 3.02;
    paper(s, x, y, sw, 1.3);
    txt(s, it[0], x + 0.24, y + 0.2, sw - 0.48, 0.5, { fontFace: F.x, fontSize: 12, color: C.ink, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.24, y + 0.72, sw - 0.48, 0.5, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 1.0 });
  });
  const x2 = 0.7 + lw + 0.3, w2 = cw - lw - 0.3, ph2 = 4.72;
  paper(s, x2, top, w2, ph2);
  txt(s, 'LETAK KEUNGGULAN BIAYA', x2 + 0.36, top + 0.4, w2 - 0.72, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  const adv = [['Gaji hanya ± 50% pendapatan', 'Premier League 62%, Serie A 68%, Chelsea 81%.'], ['Akademi: pemain tanpa biaya transfer', 'Giggs, Beckham, Butt, Neville, Scholes: inti tim 1994–2003.'], ['Menjual pemain yang dihargai tinggi', 'Kotor £322 jt, bersih £100 jt (2003–09). Ronaldo £80 jt.'], ['Yang melawan arah', 'Amortisasi pemain naik £24,2 jt (2005) ke £35,5 jt (2008).'], ['Nilai bagi dua pihak', 'Fan: prestasi, Old Trafford. Sponsor: 80 juta fan Asia; AIG ke peringkat 47.']];
  const rh = (ph2 - 0.95) / 5;
  adv.forEach((it, i) => {
    const y = top + 0.7 + i * rh;
    txt(s, it[0], x2 + 0.36, y, w2 - 0.72, 0.26, { fontFace: F.x, fontSize: 12, color: i === 3 ? C.red : C.ink });
    txt(s, it[1], x2 + 0.36, y + 0.26, w2 - 0.72, rh - 0.27, { fontFace: F.r, fontSize: 12, color: C.ink, lineSpacingMultiple: 0.98 });
  });
}

// =============== 30. BENCHMARKING MU ===============
{
  const { s, top } = page('PERTANYAAN 4  ·  BENCHMARKING DITERAPKAN', 'YANG DIBANDINGKAN BUKAN PENDAPATAN, TETAPI MARGIN', 'Benchmarking mengubah dugaan VRIN Test menjadi bukti: sistem pengembangan dan penjualan pemain MU memang lebih unggul.', { src: SRC_C + 'Table 6.5 (Forbes 2009) dan Table 6.6.' });
  s.addNotes('Slide ini benchmarking. Yang dibandingkan bukan besarnya pendapatan, tapi margin: EBITDA dibagi pendapatan (Table 6.5) dan return on sales (Table 6.6).\n\nTiga cara mendapat pemain: membeli bintang (Real Madrid, Chelsea) menghasilkan pendapatan tinggi tapi laba rendah atau rugi; mengembangkan sendiri (Barcelona, Arsenal, Bayern) laba positif dengan pendapatan lebih rendah; MU menggabungkan keduanya, membeli lalu menjual saat klub lain menilai lebih tinggi (hlm. 580, 583).\n\nAngka return on sales 2000–2006 (Table 6.6): MU 12,6%, Arsenal 5,6%, Bayern 4,7%, Real Madrid 0,4%, Chelsea −60,4%, Inter −78,4%.');
  const cw = 11.93, lw = 6.4, ph = 4.7;
  paper(s, 0.7, top - 0.05, lw, ph);
  txt(s, 'MARGIN EBITDA KLUB EROPA, %  ·  DARI TABLE 6.5', 1.1, top + 0.4, lw - 0.8, 0.25, { fontFace: F.s, fontSize: 12, color: C.red, charSpacing: 1 });
  hbars(s, 1.1, top + 0.75, lw - 0.8, 3.7, [{ label: 'Man United', v: 31.4, fmt: '31,4', hi: true }, { label: 'Barcelona', v: 22.3, fmt: '22,3' }, { label: 'Arsenal', v: 19.3, fmt: '19,3' }, { label: 'AC Milan', v: 17.6, fmt: '17,6' }, { label: 'Juventus', v: 17.5, fmt: '17,5' }, { label: 'Liverpool', v: 15.8, fmt: '15,8' }, { label: 'Real Madrid', v: 14.1, fmt: '14,1' }, { label: 'Bayern', v: 12.7, fmt: '12,7' }, { label: 'Inter', v: 9.9, fmt: '9,9' }, { label: 'Chelsea', v: -3.1, fmt: '−3,1' }], { labW: 1.6 });
  const x = 0.7 + lw + 0.25, w = cw - lw - 0.25;
  note(s, x, top - 0.05, w, 2.35, { head: 'Tiga cara mendapat pemain', body: 'Membeli bintang (Real Madrid, Chelsea): pendapatan tinggi, laba rendah atau rugi. Mengembangkan sendiri (Barcelona, Arsenal, Bayern): laba positif. Gabungan (MU): membeli, lalu menjual saat klub lain menilai lebih tinggi.' });
  banner(s, x, top + 2.45, w, 2.2, 'BUKTI MANA YANG PALING UNTUNG', 'Return on sales 2000–06 (Table 6.6): MU 12,6%, Arsenal 5,6%, Bayern 4,7%, Real Madrid 0,4%, Chelsea −60,4%, Inter −78,4%. Sistem pengembangan dan penjualan pemain MU terbukti lebih unggul.');
}

// =============== 31. COMPETITIVE STRENGTH MU (TABLE) ===============
{
  const { s, top, cw } = page('PERTANYAAN 5  ·  DITERAPKAN', 'COMPETITIVE STRENGTH ASSESSMENT MANCHESTER UNITED', 'Bobot dan rating disusun kelompok kami dari Table 6.2, 6.3, 6.5, 6.6 dan 6.7 kasus. Isi sel: rating (1–10) / skor tertimbang.', { notes: '33', src: SRC_C + 'Bobot dan rating adalah penilaian kelompok.' });
  const rows = [['Key Success Factor', 'Bobot', 'Man United', 'Real Madrid', 'Barcelona', 'Chelsea', 'Arsenal'], ['Kualitas skuad', '0,15', '6 / 0,90', '9 / 1,35', '10 / 1,50', '9 / 1,35', '6 / 0,90'], ['Kemampuan manajer', '0,15', '10 / 1,50', '5 / 0,75', '8 / 1,20', '6 / 0,90', '8 / 1,20'], ['Akademi & pemandu bakat', '0,10', '9 / 0,90', '3 / 0,30', '9 / 0,90', '3 / 0,30', '8 / 0,80'], ['Merek & basis pendukung', '0,15', '10 / 1,50', '9 / 1,35', '7 / 1,05', '5 / 0,75', '6 / 0,90'], ['Kemampuan komersial', '0,10', '10 / 1,00', '9 / 0,90', '7 / 0,70', '5 / 0,50', '6 / 0,60'], ['Profitabilitas', '0,10', '10 / 1,00', '5 / 0,50', '7 / 0,70', '1 / 0,10', '6 / 0,60'], ['Keleluasaan finansial (utang)', '0,10', '4 / 0,40', '7 / 0,70', '9 / 0,90', '5 / 0,50', '2 / 0,20'], ['Stadion & matchday', '0,05', '9 / 0,45', '8 / 0,40', '9 / 0,45', '5 / 0,25', '9 / 0,45'], ['Rekam jejak prestasi', '0,10', '10 / 1,00', '9 / 0,90', '10 / 1,00', '9 / 0,90', '9 / 0,90'], ['TOTAL SKOR TERTIMBANG', '1,00', '8,65', '7,15', '8,40', '5,55', '6,55']];
  const tbl = tableStyle(rows, { totalRow: true, hiCol: 2 }); tbl[tbl.length - 1][2].options.color = C.gold;
  const rh = 0.38;
  paper(s, 0.55, top - 0.22, cw + 0.3, 11 * rh + 0.5);
  s.addTable(tbl, { x: 0.7, y: top, w: cw, colW: [3.05, 0.9, 1.6, 1.6, 1.6, 1.59, 1.59], rowH: rh });
}

// =============== 32. COMPETITIVE STRENGTH MU (READING) ===============
{
  const { s, top, cw } = page('PERTANYAAN 5  ·  PEMBACAAN', 'SELISIH TIPIS, DAN SEMUANYA BERTUMPU PADA MANAJER', 'Tiga angka dari matriks di slide sebelumnya yang menentukan jawaban Q5.', { src: SRC_C + 'Perhitungan kelompok dari matriks slide 31.' });
  s.addNotes('Tiga pembacaan dari matriks. Pertama, MU unggul tipis: 8,65 vs Barcelona 8,40, selisih 0,25. Cukup satu baris turun untuk menghapusnya.\n\nKedua, kalau rating manajer jatuh dari 10 ke 5 karena ganti pelatih, skor MU turun ke 7,90 dan langsung di bawah Barcelona.\n\nKetiga, pengganti Ferguson harus mendapat rating minimal 8,3 supaya MU sekadar sejajar Barcelona. Itu standar yang sangat tinggi untuk pelatih baru.');
  const w = (cw - 0.4) / 3, h = 4.3;
  [['0,25', 'Unggul tipis', 'MU 8,65 vs Barcelona 8,40. Cukup satu baris turun untuk menghapus selisih ini.', true], ['7,90', 'Kalau manajer diganti', 'Rating manajer jatuh dari 10 ke 5 karena ganti pelatih: MU langsung di bawah Barcelona.', false], ['≥ 8,3', 'Syarat pengganti', 'Rating yang harus dicapai pengganti Ferguson supaya MU sekadar bertahan sejajar Barcelona.', false]].forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    if (it[3]) red(s, x, top, w, h); else paper(s, x, top, w, h);
    const ink = it[3] ? C.white : C.ink;
    txt(s, it[0], x + 0.32, top + 0.45, w - 0.64, 1.0, { fontFace: F.x, fontSize: 48, color: it[3] ? C.gold : C.red, fit: false });
    txt(s, it[1], x + 0.32, top + 1.5, w - 0.64, 0.4, { fontFace: F.x, fontSize: 16, color: ink });
    txt(s, it[2], x + 0.32, top + 1.95, w - 0.64, h - 2.2, { fontFace: F.r, fontSize: 13, color: ink, lineSpacingMultiple: 1.06 });
  });
}

// =============== 33. PRIORITY LIST MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 6  ·  PRIORITY LIST DITERAPKAN', 'ENAM ISU UNTUK DAVID GILL, DITULIS SEBAGAI PERTANYAAN', 'Rumusan mengikuti aturan buku (hlm. 118): priority list berisi pertanyaan, bukan jawaban. Bukti tiap isu dari kasus.', { notes: '34', src: SRC_C + 'Rumusan mengikuti Thompson dkk. (2024) hlm. 118.' });
  const iss = [['Bagaimana mengganti Ferguson tanpa merusak sistemnya?', 'Gill belum memutuskan; Ferguson belum mengumumkan pensiun (hlm. 573, 588).'], ['Apa yang harus dilakukan soal utang £616 juta?', 'Utang membatasi daya beli, justru saat City belanja £185 juta (hlm. 579).'], ['Bagaimana menambal skuad setelah Ronaldo pergi?', 'Tak ada lagi pemain MU di peringkat FIFA; kas Ronaldo untuk Ribery? (hlm. 588).'], ['Apakah perlu membangun penyangga organisasi?', 'Sistem pemanduan, latihan, dan taktik dibangun oleh satu orang (hlm. 573).'], ['Bagaimana menjaga pendapatan komersial kalau prestasi turun?', 'Gill: "So long as the team kept winning… revenues would continue to flow" (hlm. 573).'], ['Apakah tata kelola tetap aman tanpa Ferguson dan Gill?', 'Dewan hanya enam anak Glazer; peran pasif pemilik bergantung dua orang ini (hlm. 584).']];
  const w = (cw - 0.25) / 2, h = 1.25;
  iss.forEach((it, i) => {
    const x = 0.7 + (i % 2) * (w + 0.25), y = top + Math.floor(i / 2) * (h + 0.08);
    const serious = i === 0 || i === 3;
    if (serious) red(s, x, y, w, h); else paper(s, x, y, w, h);
    numTag(s, i + 1, x + 0.38, y + 0.35, 0.5, serious ? C.gold : C.red);
    txt(s, it[0], x + 1.05, y + 0.18, w - 1.4, 0.5, { fontFace: F.x, fontSize: 12, color: serious ? C.white : C.ink, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 1.05, y + 0.64, w - 1.4, 0.48, { fontFace: F.r, fontSize: 12, color: serious ? C.white : C.ink, lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + 3 * h + 0.3, cw, 0.7, null, [{ text: 'Pembacaan: ', options: { fontFace: F.s, color: C.gold } }, { text: 'isu 1 dan 4 (merah) butuh strategi baru; isu 2, 3, 5, 6 cukup dengan menyempurnakan strategi.', options: { fontFace: F.m, color: C.white } }], { padY: 0.2 });
}

// =============== 34. THANKS ===============
{
  flushOrn(); const s = pptx.addSlide(); pageNo += 1; s.background = { path: 'mu_assets/c_thanks.jpg' }; notes(s, '35');
  label(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', 0.7, 1.6, 5.4, 0.44, { color: C.gold });
  txt(s, 'TERIMA KASIH', 0.7, 2.15, 6.2, 1.2, { fontFace: F.x, fontSize: 48, color: C.white, fit: false });
  txt(s, 'Kami membuka sesi tanya jawab dan diskusi', 0.7, 3.35, 6.2, 0.5, { fontFace: F.m, fontSize: 17, color: C.grey });
  red(s, 0.55, 4.25, 6.1, 1.55, { rotate: -1.5 });
  txt(s, 'KELOMPOK 4', 0.95, 4.5, 3, 0.25, { fontFace: F.s, fontSize: 12, color: C.gold, charSpacing: 1 });
  txt(s, 'Fitra Aidila · Aulia Sisca Rahmadiyanti · Bagaskoro · Imam Prayudha · Tegar Awanto', 0.95, 4.78, 5.3, 0.85, { fontFace: F.s, fontSize: 12, color: C.white, lineSpacingMultiple: 1.1 });
  txt(s, 'Strategic Management  ·  Dr. Rangga Almahendra, S.T., M.M.\nChapter 4: Thompson dkk. (2024)   |   Kasus: Manchester United, Robert M. Grant (2010)', 0.7, 5.98, 5.9, 0.85, { fontFace: F.r, fontSize: 12, color: C.grey, lineSpacingMultiple: 1.12 });
}

flushOrn();
fs.writeFileSync('layout.json', JSON.stringify(LAYOUT));
pptx.writeFile({ fileName: 'deck.pptx' }).then(f => console.log('wrote', f, 'slides', pageNo));
