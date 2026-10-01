const pptxgen = require('pptxgenjs');
const fs = require('fs');
const NOTES = JSON.parse(fs.readFileSync('mu_cream/notes_v3.json', 'utf8'));
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Kelompok 4';
pptx.title = 'Chapter 4 · Manchester United';
const W = 13.333, H = 7.5, MINPT = 10;

// palette: cream parchment, deep red, gold, dark brown ink
const C = { cream: 'F3EBDD', cream2: 'EADFCB', beige: 'E2D4BB', red: 'A6121B', red2: 'C8102E', mu: 'DA291C', gold: 'C9A24A', gold2: 'E6CF93', ink: '2B1A14', ink2: '6B5243', white: 'FFFFFF', line: 'D6C7A8' };
const F = { x: 'Poppins ExtraBold', s: 'Poppins SemiBold', m: 'Poppins Medium', r: 'Poppins' };
const SRC_BOOK = 'Sumber: Thompson dkk., Crafting & Executing Strategy (2024), Chapter 4.';
const SRC_C = 'Sumber: Grant (2010), Case 6. ';
let pageNo = 0;
const LAYOUT = [];
function rec(kind, x, y, w, h, extra) { LAYOUT.push(Object.assign({ slide: pageNo, kind, x, y, w, h }, extra || {})); }
const clean = t => t.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '\n');
function notes(s, key) { if (key && NOTES[key]) s.addNotes(clean(NOTES[key])); }

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
const PAD = 0.14;
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
function img(s, path, x, y, w, h, o = {}) { rec('image', x, y, w, h, { path }); s.addImage(Object.assign({ path, x, y, w, h, sizing: { type: 'cover', w, h } }, o)); }
// framed photo with gold border
function photo(s, name, x, y, w, h) {
  s.addShape(pptx.ShapeType.rect, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: C.white }, line: { color: C.gold, width: 1.5 } });
  img(s, 'mu_cream/img/' + name + '.jpg', x, y, w, h);
}
// cream card with gold hairline
function card(s, x, y, w, h, o = {}) { rect(s, x, y, w, h, o.fill || C.white, { line: o.line || C.gold, lw: 0.75 }); }
function redcard(s, x, y, w, h) { rect(s, x, y, w, h, C.red); }
function tag(s, text, x, y, w, color = C.red) {
  s.addShape(pptx.ShapeType.rect, { x, y: y + 0.05, w: 0.22, h: 0.22, fill: { color }, line: { color, width: 0 } });
  txt(s, text, x + 0.32, y, w - 0.32, 0.32, { fontFace: F.s, fontSize: 10, color, charSpacing: 1, valign: 'middle', clamp: false });
}
// headed card: head + body
function note(s, x, y, w, h, o = {}) {
  card(s, x, y, w, h, o);
  let cy = y + 0.16;
  if (o.tag) { txt(s, o.tag, x + PAD, cy, w - 2 * PAD, 0.22, { fontFace: F.s, fontSize: 10, color: o.tagColor || C.red, charSpacing: 1 }); cy += 0.26; }
  if (o.head) { const hh = o.headH || 0.3; txt(s, o.head, x + PAD, cy, w - 2 * PAD, hh, { fontFace: F.x, fontSize: o.headSize || 12.5, color: o.headColor || C.red, lineSpacingMultiple: 0.95 }); cy += hh + 0.05; }
  if (o.body) txt(s, o.body, x + PAD, cy, w - 2 * PAD, y + h - cy - 0.12, { fontFace: F.r, fontSize: o.bodySize || 11, color: C.ink, lineSpacingMultiple: 1.06 });
}
// red banner: label + body in white; grows if needed
function banner(s, x, y, w, h, label, body, o = {}) {
  const px = x + 0.3, pw = w - 0.6;
  const bo = { fontFace: F.m, fontSize: o.size || 11, color: C.white, lineSpacingMultiple: 1.06 };
  const need = 0.16 + (label ? 0.26 : 0) + estH(body, bo, pw) + 0.16;
  if (need > h && y + need <= 6.95) h = need;
  redcard(s, x, y, w, h);
  if (label) txt(s, label, px, y + 0.14, pw, 0.22, { fontFace: F.s, fontSize: 10, color: C.gold2, charSpacing: 1 });
  txt(s, body, px, y + 0.14 + (label ? 0.26 : 0), pw, h - 0.3 - (label ? 0.26 : 0), bo);
  return h;
}
function bullets(items, size = 11, color = C.ink) {
  return items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, fontFace: F.r, fontSize: size, color, paraSpaceAfter: 3 } }));
}
function numTag(s, n, x, y, d = 0.46, fill = C.red) {
  s.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
  txt(s, String(n), x, y, d, d, { fontFace: F.x, fontSize: Math.max(10, d * 24), color: C.white, align: 'center', valign: 'middle', fit: false, clamp: false });
}
function hbars(s, x, y, w, h, items, o = {}) {
  const labW = o.labW || 2.0, valW = 0.8;
  const n = items.length, rowH = h / n, barH = Math.min(rowH * 0.62, 0.34);
  const maxV = Math.max(...items.map(i => Math.abs(i.v))); const minV = Math.min(0, ...items.map(i => i.v)); const span = maxV - minV;
  const plotW = w - labW - valW - 0.1; const zeroX = x + labW + (-minV / span) * plotW;
  items.forEach((it, i) => {
    const cy = y + i * rowH + (rowH - barH) / 2;
    txt(s, it.label, x, cy - 0.05, labW - 0.15, barH + 0.1, { fontFace: it.hi ? F.x : F.r, fontSize: 10.5, color: C.ink, align: 'right', valign: 'middle', fit: false, clamp: false });
    const bw = Math.abs(it.v) / span * plotW; const bx = it.v >= 0 ? zeroX : zeroX - bw;
    s.addShape(pptx.ShapeType.rect, { x: bx, y: cy, w: Math.max(bw, 0.02), h: barH, fill: { color: it.hi ? C.red : C.beige }, line: { color: it.hi ? C.red : C.gold, width: 0.5 } });
    txt(s, it.fmt || String(it.v), it.v >= 0 ? bx + bw + 0.08 : zeroX + 0.08, cy - 0.05, valW, barH + 0.1, { fontFace: F.s, fontSize: 10.5, color: it.hi ? C.red : C.ink, valign: 'middle', fit: false, clamp: false });
  });
  s.addShape(pptx.ShapeType.rect, { x: zeroX, y, w: 0.01, h, fill: { color: C.ink2 }, line: { color: C.ink2, width: 0 } });
}
function vbars(s, x, y, w, h, items) {
  const n = items.length, slot = w / n, bw = slot * 0.6; const maxV = Math.max(...items.map(i => i.v));
  const labH = 0.28, valH = 0.28, plotH = h - labH - valH;
  items.forEach((it, i) => {
    const bh = it.v / maxV * plotH; const bx = x + i * slot + (slot - bw) / 2; const by = y + valH + (plotH - bh);
    s.addShape(pptx.ShapeType.rect, { x: bx, y: by, w: bw, h: bh, fill: { color: it.hi ? C.red : C.beige }, line: { color: it.hi ? C.red : C.gold, width: 0.5 } });
    txt(s, it.fmt || String(it.v), x + i * slot, by - valH, slot, valH, { fontFace: F.s, fontSize: 10, color: it.hi ? C.red : C.ink, align: 'center', valign: 'bottom', fit: false, clamp: false });
    txt(s, it.label, x + i * slot, y + h - labH + 0.04, slot, labH, { fontFace: F.r, fontSize: 10, color: C.ink, align: 'center', fit: false, clamp: false });
  });
  s.addShape(pptx.ShapeType.rect, { x, y: y + valH + plotH, w, h: 0.01, fill: { color: C.ink2 }, line: { color: C.ink2, width: 0 } });
}
function tableStyle(rows, o = {}) {
  return rows.map((r, ri) => r.map((c, ci) => {
    const isHead = ri === 0, isTotal = o.totalRow && ri === rows.length - 1; const hiCol = o.hiCol !== undefined && ci === o.hiCol && !isHead;
    let fill = isHead ? C.red : (ri % 2 ? C.white : C.cream2); if (isTotal) fill = C.ink; if (hiCol && !isTotal) fill = 'F6DCD3';
    return { text: c, options: { fill: { color: fill }, color: isHead || isTotal ? C.white : C.ink, fontFace: isHead || isTotal || ci === 0 ? F.s : F.r, fontSize: o.fs || 10, align: ci === 0 || (o.leftCols && o.leftCols.includes(ci)) ? 'left' : 'center', valign: 'middle', margin: [3, 6, 3, 6], border: { type: 'solid', color: C.line, pt: 0.5 } } };
  }));
}
const PH = { 2: 'p_pitch_tunnel', 3: 'p_stand_tifo', 4: 'p_ticket', 5: 'p_boardroom', 6: 'p_scarves', 7: 'p_youth_trophy', 8: 'p_dugout', 9: 'p_shirt', 10: 'p_training', 11: 'p_european_cup', 12: 'p_floodlights', 13: 'p_megastore', 14: 'p_handshake', 15: 'p_boots', 16: 'p_ball', 17: 'p_clock', 19: 'p_manager', 20: 'p_tv_studio', 21: 'p_celebration', 22: 'p_pitch_aerial', 23: 'p_transfer', 24: 'p_night_stadium', 25: 'p_museum', 26: 'p_statue', 27: 'p_trinity', 28: 'p_bus_parade', 29: 'p_asia_tour', 30: 'p_fans_asia', 31: 'p_press_box', 32: 'p_armband' };
let pendingPhoto = null;
function flush() { if (pendingPhoto) { pendingPhoto(); pendingPhoto = null; } }
// content page: cream bg, red tag + dark red title, medallion photo top right, footer
function page(kicker, title, lede, o = {}) {
  flush();
  const s = pptx.addSlide(); pageNo += 1;
  s.background = { path: pageNo % 2 ? 'mu_cream/img/bg_cream.jpg' : 'mu_cream/img/bg_cream_fade.jpg' };
  const ph = PH[pageNo];
  const medW = 1.35;
  if (ph && !o.noMed) { const p = ph; pendingPhoto = () => photo(s, p, W - 0.7 - medW, 0.42, medW, medW); }
  const tw = (ph && !o.noMed) ? W - 1.4 - medW - 0.3 : W - 1.4;
  tag(s, kicker, 0.7, 0.42, tw);
  let size = 24; const est = sz => title.length * 0.0093 * sz;
  if (est(size) > tw) size = Math.max(18, tw / (title.length * 0.0093));
  txt(s, title, 0.7, 0.8, tw, 0.55, { fontFace: F.x, fontSize: size, color: C.red, valign: 'top', fit: false, clamp: false });
  const ly = 1.4;
  if (lede) txt(s, lede, 0.7, ly, tw, 0.5, { fontFace: F.r, fontSize: 11, color: C.ink2, lineSpacingMultiple: 1.05, clamp: false });
  // footer rule
  s.addShape(pptx.ShapeType.rect, { x: 0.7, y: 7.0, w: W - 1.4, h: 0.012, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  txt(s, o.src || SRC_BOOK, 0.7, 7.06, 9.5, 0.3, { fontFace: F.r, fontSize: 10, color: C.ink2, valign: 'middle', clamp: false });
  txt(s, String(pageNo).padStart(2, '0'), W - 1.5, 7.06, 0.8, 0.3, { fontFace: F.s, fontSize: 10, color: C.red, align: 'right', valign: 'middle', clamp: false });
  notes(s, o.notes || String(pageNo));
  return { s, top: lede ? ly + 0.62 : ly + 0.05, cw: W - 1.4 };
}

// =============== 1. TITLE ===============
{
  flush(); const s = pptx.addSlide(); pageNo += 1; s.background = { path: 'mu_cream/img/bg_cream.jpg' }; notes(s, '1');
  // photo panel bottom with red/gold frame (like reference)
  s.addShape(pptx.ShapeType.rect, { x: 0.55, y: 3.3, w: W - 1.1, h: 3.65, fill: { color: C.red }, line: { color: C.gold, width: 2 } });
  img(s, 'mu_cream/img/hero_stadium.jpg', 0.7, 3.45, W - 1.4, 2.8);
  s.addShape(pptx.ShapeType.rect, { x: 0.7, y: 6.25, w: W - 1.4, h: 0.65, fill: { color: C.red }, line: { color: C.red, width: 0 } });
  txt(s, 'KELOMPOK 4  ·  Fitra Aidila  ·  Aulia Sisca Rahmadiyanti  ·  Bagaskoro  ·  Imam Prayudha  ·  Tegar Awanto', 0.9, 6.25, W - 1.8, 0.65, { fontFace: F.s, fontSize: 11, color: C.white, align: 'center', valign: 'middle', clamp: false });
  tag(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', 0.7, 0.45, 7);
  txt(s, "EVALUATING A COMPANY'S RESOURCES, CAPABILITIES, AND COMPETITIVENESS", 0.7, 0.85, 8.6, 1.6, { fontFace: F.x, fontSize: 30, color: C.red, lineSpacingMultiple: 0.92, fit: false, clamp: false });
  txt(s, 'STUDI KASUS', 0.7, 2.5, 4, 0.25, { fontFace: F.s, fontSize: 10, color: C.gold, charSpacing: 1, clamp: false });
  txt(s, 'Manchester United: Preparing for Life without Ferguson', 0.7, 2.75, 8.6, 0.4, { fontFace: F.s, fontSize: 15, color: C.ink, clamp: false });
  txt(s, 'DOSEN PENGAMPU', 9.75, 0.5, 3, 0.25, { fontFace: F.s, fontSize: 10, color: C.gold, charSpacing: 1, clamp: false });
  txt(s, 'Dr. Rangga Almahendra, S.T., M.M.', 9.75, 0.75, 3.1, 0.6, { fontFace: F.s, fontSize: 11, color: C.ink, clamp: false });
  txt(s, 'Thompson · Peteraf · Gamble · Strickland\nCrafting & Executing Strategy, 2024 Release ISE', 9.75, 1.5, 3.1, 0.9, { fontFace: F.r, fontSize: 10, color: C.ink2, lineSpacingMultiple: 1.1, clamp: false });
}

// =============== 2. AGENDA ===============
{
  const { s, top } = page('ALUR PRESENTASI', 'AGENDA', null, { noMed: true });
  const items = [['01', 'Framework Chapter 4', 'Enam pertanyaan analisis internal perusahaan dan alat untuk menjawabnya: Rasio Keuangan, SWOT, VRIN test, Value Chain, Competitive Strength Assessment, priority list'], ['02', 'Penerapan pada Manchester United', 'Kinerja, SWOT, resource dan capability, Uji VRIN, Value Chain, Benchmarking, dan Competitive Strength Assessment MU pada Juli 2009.'], ['03', 'Daftar prioritas isu strategis', 'Isu apa yang harus segera ditangani?'], ['04', 'Diskusi', 'Tanya jawab dan diskusi kelas.']];
  const lw = 6.6, rh = 1.15;
  items.forEach((it, i) => {
    const y = top + i * (rh + 0.1);
    card(s, 0.7, y, lw, rh);
    s.addShape(pptx.ShapeType.rect, { x: 0.7, y, w: 1.0, h: rh, fill: { color: i === 0 ? C.red : C.cream2 }, line: { color: C.gold, width: 0.75 } });
    txt(s, it[0], 0.7, y, 1.0, rh, { fontFace: F.x, fontSize: 22, color: i === 0 ? C.white : C.red, align: 'center', valign: 'middle', fit: false, clamp: false, skip: true });
    txt(s, it[1], 1.9, y + 0.14, lw - 1.35, 0.3, { fontFace: F.x, fontSize: 13, color: C.red });
    txt(s, it[2], 1.9, y + 0.46, lw - 1.35, rh - 0.56, { fontFace: F.r, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.04 });
  });
  photo(s, 'p_pitch_tunnel', 7.75, top, 4.88, 4.9);
}

// =============== 3. ENAM PERTANYAAN ===============
{
  const { s, top } = page('BAGIAN 1  ·  FRAMEWORK CHAPTER 4', 'ENAM PERTANYAAN', null, { noMed: true });
  const q = [['Seberapa baik strategi yang ada saat ini?', 'Indikator kinerja & rasio keuangan'], ['Apa kekuatan dan kelemahan dibandingkan dengan peluang dan ancaman?', 'SWOT Analysis & Performance Indicator'], ['Resource dan capability apa yang paling penting, dan apakah tahan lama?', 'VRIN Test'], ['Bagaimana aktivitas rantai nilai mempengaruhi biaya dan nilai pelanggan?', 'Value Chain + Benchmarking'], ['Lebih kuat atau lebih lemah dari pesaing utama?', 'Competitive Strength Assessment'], ['Isu strategis apa yang harus ditangani lebih dulu?', 'Daftar prioritas isu strategis']];
  const pw = 2.6; photo(s, 'p_stand_tifo', W - 0.7 - pw, top, pw, 4.74);
  const w = 2.95, h = 2.3;
  q.forEach((it, i) => {
    const x = 0.7 + (i % 3) * (w + 0.18), y = top + Math.floor(i / 3) * (h + 0.14);
    card(s, x, y, w, h);
    s.addShape(pptx.ShapeType.rect, { x, y, w, h: 0.08, fill: { color: i === 5 ? C.gold : C.red }, line: { color: i === 5 ? C.gold : C.red, width: 0 } });
    txt(s, String(i + 1), x + PAD, y + 0.2, 1, 0.55, { fontFace: F.x, fontSize: 26, color: C.red, fit: false });
    txt(s, it[0], x + PAD, y + 0.8, w - 2 * PAD, 0.95, { fontFace: F.s, fontSize: 11.5, color: C.ink, lineSpacingMultiple: 1.0 });
    txt(s, it[1], x + PAD, y + h - 0.6, w - 2 * PAD, 0.45, { fontFace: F.s, fontSize: 10.5, color: C.red, lineSpacingMultiple: 1.0 });
  });
}

// =============== 4. FIGURE 4.1 ===============
{
  const { s, top } = page('PERTANYAAN 1', 'KENALI DULU STRATEGI YANG SEDANG DIJALANKAN', 'Komponen strategi perusahaan', { src: 'Sumber: Thompson dkk. (2024), Figure 4.1, hlm. 90.' });
  const fw = 6.4, fh = fw / 1.359;
  card(s, 0.7, top, fw + 0.3, fh + 0.3, { fill: C.white });
  s.addImage({ path: 'mu_cream/fig4_1.png', x: 0.85, y: top + 0.15, w: fw, h: fh });
  const x = 7.65, w = 5.0;
  const h1 = banner(s, x, top, w, 1.45, 'CONTOH KAMI: AIRASIA', 'Strategi biaya rendah terlihat konsisten di setiap fungsi. Satu tipe pesawat (A320) dioperasikan dan penjualan tiket langsung secara online di pemasaran.');
  note(s, x, top + h1 + 0.15, w, 1.75, { head: 'Setelah strategi dikenali', body: 'Pengukuran kinerja dengan melihat tren penjualan dan laba, harga saham, kekuatan keuangan, retensi pelanggan, pelanggan baru, dan perbaikan proses internal.' });
  note(s, x, top + h1 + 2.05, w, 1.2, { tag: 'CARA PAKAI', body: 'Isi setiap kotak dengan tindakan nyata perusahaan, lalu periksa apakah semuanya saling mendukung.' });
}

// =============== 5. TABLE 4.1 ===============
{
  const { s, top, cw } = page('PERTANYAAN 1', 'FINANCIAL RATIOS: ALAT UKURNYA', 'Pengukuran kinerja strategi dengan angka yang dituangkan dalam alat ukur berupa rasio keuangan sebagai berikut:');
  const g = [['Profitability', 'Seberapa besar laba yang dihasilkan', ['Gross profit margin', 'Operating profit margin', 'Net profit margin', 'Total return on assets', 'Net return on assets (ROA)', 'Return on equity (ROE)', 'Return on invested capital']], ['Liquidity', 'Sanggup bayar kewajiban jangka pendek?', ['Current ratio', 'Working capital']], ['Leverage', 'Seberapa berat beban utangnya', ['Total debt-to-assets', 'Long-term debt-to-capital', 'Debt-to-equity', 'Long-term debt-to-equity', 'Times-interest-earned']], ['Activity', 'Seberapa efisien aset dikelola', ['Days of inventory', 'Inventory turnover', 'Average collection period']]];
  const w = (cw - 0.6) / 4, h = 3.3;
  g.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    card(s, x, top, w, h);
    txt(s, it[0], x + PAD, top + 0.16, w - 2 * PAD, 0.32, { fontFace: F.x, fontSize: 14, color: C.red });
    txt(s, it[1], x + PAD, top + 0.5, w - 2 * PAD, 0.45, { fontFace: F.r, fontSize: 10.5, color: C.ink2, lineSpacingMultiple: 1.02 });
    s.addShape(pptx.ShapeType.rect, { x: x + PAD, y: top + 0.98, w: w - 2 * PAD, h: 0.012, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
    txt(s, bullets(it[2], 10.5), x + PAD, top + 1.08, w - 2 * PAD, h - 1.2);
  });
  banner(s, 0.7, top + 3.45, cw, 0.9, 'UKURAN TAMBAHAN', 'Dividend yield, price-to-earnings ratio, dividend payout ratio, internal cash flow, dan free cash flow. Free cash flow paling penting karena menunjukkan kas yang tersisa untuk membiayai langkah strategis baru.');
}

// =============== 6. SWOT ===============
{
  const { s, top, cw } = page('PERTANYAAN 2', 'SWOT ANALYSIS: KENAPA STRATEGI BERHASIL ATAU GAGAL', 'Q1 menunjukkan apakah strategi bekerja, tetapi belum menjelaskan penyebabnya. SWOT adalah alat paling sederhana untuk mencarinya.');
  const sw = [['S', 'Strengths', 'Yang perusahaan kuasai atau miliki, yang membuatnya lebih mampu bersaing', true], ['W', 'Weaknesses', 'Yang tidak dimiliki atau dikerjakan kurang baik dibanding pesaing', false], ['O', 'Opportunities', 'Peluang pasar: apa yang bisa diambil dari luar', false], ['T', 'Threats', 'Ancaman dari luar yang bisa menggerus laba dan posisi', true]];
  const w = 3.3, h = 1.6;
  sw.forEach((it, i) => {
    const x = 0.7 + (i % 2) * (w + 0.15), y = top + Math.floor(i / 2) * (h + 0.15);
    if (it[3]) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    txt(s, it[0], x + PAD, y + 0.15, 0.75, 0.8, { fontFace: F.x, fontSize: 36, color: it[3] ? C.gold2 : C.red, fit: false });
    txt(s, it[1], x + 1.0, y + 0.22, w - 1.15, 0.32, { fontFace: F.x, fontSize: 13, color: it[3] ? C.white : C.red });
    txt(s, it[2], x + 1.0, y + 0.56, w - 1.15, 0.95, { fontFace: F.r, fontSize: 10.5, color: it[3] ? C.white : C.ink, lineSpacingMultiple: 1.04 });
  });
  const x = 7.6, cwid = 5.05;
  note(s, x, top, cwid, 3.35, { tag: 'KEY POINT', body: [{ text: 'Apakah kekuatan perusahaan cukup untuk mengatasi kelemahannya, menangkap peluang, dan menghadapi ancaman.\n\n', options: { fontFace: F.s, fontSize: 11, color: C.ink } }, { text: 'Apakah kekuatan cukup menutup kelemahan? Apakah strategi sudah bertumpu pada kekuatan itu? Apakah kekuatan kita melampaui pesaing? Apakah strategi berhasil menangkal ancaman?', options: { fontFace: F.r, fontSize: 11, color: C.ink } }] });
  banner(s, 0.7, top + 3.55, cw, 0.85, 'KENAPA SWOT POPULER', 'Karena mudah digunakan, baik untuk menilai strategi yang sedang berjalan maupun menyusun strategi baru. Penggunanya mulai dari perusahaan besar sampai perusahaan dengan skala kecil.');
}

// =============== 7. COMPETENCE ===============
{
  const { s, top, cw } = page('PERTANYAAN 2  ·  KONSEP INTI', 'COMPETENCE, DISTINCTIVE COMPETENCE, CORE COMPETENCE', 'Buku membedakan tiga tingkatan kompetensi. Tingkat ketiga adalah yang paling berharga bagi perusahaan.');
  const steps = [['1', 'Competence', 'Aktivitas yang sudah dikuasai perusahaan, dikerjakan konsisten baik dan dengan biaya wajar.', 'Kemampuan biasa. Banyak perusahaan punya.'], ['2', 'Distinctive Competence', 'Kemampuan yang membuat perusahaan mengerjakan aktivitas itu LEBIH BAIK dari pesaingnya.', 'Sudah membedakan, tapi belum tentu inti strategi.'], ['3', 'Core Competence', 'Aktivitas yang dikuasai dengan baik dan berada di jantung strategi perusahaan.', 'Paling berharga. Sering jadi mesin pertumbuhan.']];
  const w = (cw - 0.4) / 3, base = top + 3.05;
  steps.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2), h = 2.3 + i * 0.35, y = base - h;
    if (i === 2) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    const ink = i === 2 ? C.white : C.ink;
    txt(s, it[0], x + PAD, y + 0.12, 1, 0.6, { fontFace: F.x, fontSize: 28, color: i === 2 ? C.gold2 : C.red, fit: false });
    txt(s, it[1], x + PAD, y + 0.75, w - 2 * PAD, 0.32, { fontFace: F.x, fontSize: 13, color: i === 2 ? C.white : C.red });
    txt(s, it[2], x + PAD, y + 1.1, w - 2 * PAD, 0.7, { fontFace: F.r, fontSize: 10.5, color: ink, lineSpacingMultiple: 1.02 });
    txt(s, it[3], x + PAD, y + h - 0.6, w - 2 * PAD, 0.5, { fontFace: F.s, fontSize: 10.5, color: i === 2 ? C.gold2 : C.red, lineSpacingMultiple: 1.0 });
  });
  tag(s, 'CONTOH DARI BUKU', 0.7, base + 0.12, 4);
  const ex = [['Procter & Gamble', 'Core competence di manajemen merek, melahirkan Tide, Crest, Pampers, Olay, Febreze.'], ['Nike', 'Core competence di desain dan pemasaran sepatu serta apparel olahraga.'], ['Kellogg', 'Core competence di pengembangan, produksi, dan pemasaran sereal sarapan.']];
  ex.forEach((it, i) => note(s, 0.7 + i * (w + 0.2), base + 0.5, w, 1.15, { head: it[0], headSize: 11.5, body: it[1], bodySize: 10 }));
}

// =============== 8. FIGURE 4.2 ===============
{
  const { s, top } = page('PERTANYAAN 2', 'SWOT TIDAK HANYA MEMBUAT KELOMPOK TEMUAN', 'Nilai SWOT ada pada kesimpulan yang ditarik dari daftarnya, bukan pada daftarnya. Buku menggambarkannya sebagai tiga langkah.');
  const st = [['Identifikasi', 'Susun keempat temuan berdasarkan bukti, bukan opini.'], ['Tarik kesimpulan', 'Apa sebab berhasil atau gagalnya suatu strategi? Sisi mana dari situasi perusahaan yang menarik? Sisi mana yang tidak?'], ['Terjemahkan jadi tindakan', 'Ubah kesimpulan menjadi langkah strategis yang nyata.']];
  card(s, 0.7, top, 5.9, 3.4);
  st.forEach((it, i) => {
    const y = top + 0.22 + i * 1.05;
    numTag(s, i + 1, 0.95, y + 0.05, 0.46);
    txt(s, it[0], 1.6, y, 4.8, 0.3, { fontFace: F.x, fontSize: 12.5, color: C.red });
    txt(s, it[1], 1.6, y + 0.32, 4.8, 0.7, { fontFace: F.r, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.04 });
  });
  const x = 6.8, w = 5.85;
  redcard(s, x, top, w, 3.4);
  txt(s, 'TINDAKAN YANG DAPAT DILAKUKAN', x + 0.3, top + 0.2, w - 0.6, 0.25, { fontFace: F.s, fontSize: 10, color: C.gold2, charSpacing: 1 });
  txt(s, bullets(['Jadikan kekuatan sebagai fondasi strategi', 'Perbaiki kelemahan yang menghambat strategi', 'Pakai kekuatan untuk meredam ancaman besar', 'Kejar peluang yang paling cocok dengan kekuatan', 'Benahi kelemahan yang menghalangi peluang penting', 'Tutup kelemahan yang membuat rentan pada ancaman'], 11, C.white), x + 0.3, top + 0.55, w - 0.6, 2.7, { lineSpacingMultiple: 1.06 });
  note(s, 0.7, top + 3.55, 11.95, 1.0, { tag: 'KETERBATASAN SWOT', body: 'Kekuatannya ada pada kesederhanaan, namun terdapat keterbatasan. Untuk pemahaman yang lebih dalam dibutuhkan alat yang lebih canggih, yaitu Q3 sampai Q5 berikutnya.', bodySize: 10.5 });
}

// =============== 9. RESOURCE VS CAPABILITY ===============
{
  const { s, top, cw } = page('PERTANYAAN 3', 'RESOURCE DAN CAPABILITY: DUA HAL BERBEDA', 'Resource adalah sesuatu yang dimiliki perusahaan, sedangkan capability adalah sesuatu yang bisa dikerjakan oleh perusahaan. Capability dibangun dengan mengerahkan resource.');
  const hw = (cw - 0.25) / 2;
  note(s, 0.7, top, hw, 1.25, { head: 'Resource', body: 'Aset yang dimiliki atau dikendalikan perusahaan. Contoh: merek, pabrik, kas, paten, tim R&D.', bodySize: 10.5 });
  note(s, 0.7 + hw + 0.25, top, hw, 1.25, { head: 'Capability', body: 'Kemampuan perusahaan mengerjakan suatu aktivitas internal dengan baik. Disebut juga competence. Contoh: kemampuan Starbucks mengelola dan melatih karyawan.', bodySize: 10.5 });
  const ty = top + 1.38;
  tag(s, 'TIPE RESOURCE', 0.7, ty, 4);
  const tan = [['Fisik', 'tanah, pabrik, peralatan, lokasi, sumber daya alam'], ['Finansial', 'kas, surat berharga, peringkat kredit'], ['Teknologi', 'paten, hak cipta, teknologi produksi dan inovasi'], ['Organisasional', 'sistem IT, sistem kendali, struktur organisasi']];
  const intan = [['Human assets', 'pendidikan, pengalaman, bakat, pengetahuan'], ['Merek & reputasi', 'nama merek, citra, loyalitas, reputasi mutu'], ['Relasi', 'aliansi, joint venture, jaringan dealer'], ['Budaya & insentif', 'norma perilaku, keyakinan bersama, kompensasi']];
  const ph = 6.9 - (ty + 0.4);
  [['Tangible', 'bisa disentuh atau dihitung', tan, C.red, C.white], ['Intangible', 'tidak berwujud', intan, C.gold, C.ink]].forEach((col, ci) => {
    const x = 0.7 + ci * (hw + 0.25), y0 = ty + 0.4;
    card(s, x, y0, hw, ph);
    s.addShape(pptx.ShapeType.rect, { x, y: y0, w: hw, h: 0.42, fill: { color: col[3] }, line: { color: col[3], width: 0 } });
    txt(s, [{ text: col[0] + '   ', options: { fontFace: F.x, fontSize: 12.5, color: col[4] } }, { text: col[1], options: { fontFace: F.r, fontSize: 10.5, color: col[4] } }], x + PAD, y0, hw - 2 * PAD, 0.42, { valign: 'middle', clamp: false });
    const rh = (ph - 0.55) / 4;
    col[2].forEach((r, ri) => {
      const y = y0 + 0.5 + ri * rh;
      txt(s, r[0], x + PAD, y, 1.75, rh - 0.05, { fontFace: F.s, fontSize: 11, color: C.ink, valign: 'middle' });
      txt(s, r[1], x + 2.0, y, hw - 2.2, rh - 0.05, { fontFace: F.r, fontSize: 10.5, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.02 });
    });
  });
}

// =============== 10. FINDING CAPABILITIES ===============
{
  const { s, top } = page('PERTANYAAN 3', 'CARA MENEMUKAN CAPABILITY PERUSAHAAN', 'Capability lebih sulit ditemukan daripada resource, karena wujudnya tidak kelihatan. Terdapat 2 cara yang dapat dilakukan:');
  const cw = 11.95, hw = (cw - 0.2) / 2;
  note(s, 0.7, top, hw, 1.75, { tag: 'CARA 1', head: 'Berangkat dari daftar resource', body: 'Lihat daftar resource, lalu tanya: kemampuan apa yang mungkin tumbuh dari sini? Armada truk dan pusat distribusi otomatis menandakan kemampuan logistik yang matang.', bodySize: 10.5 });
  note(s, 0.7 + hw + 0.2, top, hw, 1.75, { tag: 'CARA 2', head: 'Berangkat dari fungsi perusahaan', body: 'Telusuri tiap fungsi. Injection molding dan metal stamping di produksi; direct selling dan database marketing di penjualan; riset dasar dan pengembangan produk baru di R&D.', bodySize: 10.5 });
  note(s, 0.7, top + 1.9, cw, 1.15, { head: 'Masalahnya: capability terpenting justru lintas fungsi', headSize: 12, body: 'Cara 2 gagal menangkap kemampuan yang lahir dari kerja sama antar bagian. Kemampuan desain Warby Parker bukan cuma karena desainernya, tapi juga riset pasar, rekayasa, dan relasi dengan pemasok serta pabrik.', bodySize: 10.5 });
  banner(s, 0.7, top + 3.2, cw, 1.3, 'RESOURCE BUNDLE', 'Kumpulan aset bersaing yang saling terkait erat di sekitar satu atau beberapa kemampuan lintas fungsi. Bundle bisa lolos VRIN Test meski komponen-komponennya sendiri tidak. Paket Nike (keahlian styling, riset pasar, endorsement atlet, nama merek, kecakapan manajerial) membuatnya nomor satu di sepatu olahraga lebih dari 20 tahun.');
}

// =============== 11. VRIN ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  FRAMEWORK INTI', 'VRIN TEST', 'Punya sumber daya yang kuat belum tentu membuat perusahaan unggul. VRIN Test membantu melihat apakah sumber daya itu benar-benar menjadi pembeda dan sulit disaingi.');
  const v = [['V', 'Valuable', 'Bernilai untuk bersaing?', 'Harus langsung menopang strategi dan membuat perusahaan lebih efektif bersaing. Google Wallet gagal meski memakai resource teknologi yang membuat Google nomor satu di mesin pencari.'], ['R', 'Rare', 'Langka, tidak dimiliki pesaing?', 'Apakah pesaing juga memilikinya? Kalau semua perusahaan punya kemampuan yang sama, itu bukan lagi pembeda. Semua produsen sereal punya kemampuan pemasaran; kekuatan merek Oreo tidak umum.'], ['I', 'Inimitable', 'Sulit ditiru?', 'Sulit ditiru kalau unik, harus dibangun bertahun-tahun, butuh biaya sangat besar, atau melibatkan social complexity dan causal ambiguity.'], ['N', 'Nonsubstitutable', 'Pesaing tak punya jalan lain?', 'Kalau pesaing tidak bisa meniru, apakah mereka bisa mencapai hasil yang sama dengan cara lain? Misalnya, keunggulan dari otomatisasi bisa disaingi lewat biaya tenaga kerja yang lebih murah.']];
  const w = (cw - 0.6) / 4, h = 3.35;
  v.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    card(s, x, top, w, h);
    s.addShape(pptx.ShapeType.rect, { x, y: top, w, h: 0.08, fill: { color: i < 2 ? C.red : C.gold }, line: { color: i < 2 ? C.red : C.gold, width: 0 } });
    txt(s, it[0], x + PAD, top + 0.15, 1.2, 0.75, { fontFace: F.x, fontSize: 36, color: C.red, fit: false });
    txt(s, it[1], x + PAD, top + 0.92, w - 2 * PAD, 0.3, { fontFace: F.x, fontSize: 13, color: C.ink });
    txt(s, it[2], x + PAD, top + 1.22, w - 2 * PAD, 0.45, { fontFace: F.s, fontSize: 10.5, color: C.red, lineSpacingMultiple: 1.0 });
    txt(s, it[3], x + PAD, top + 1.7, w - 2 * PAD, h - 1.85, { fontFace: F.r, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.03 });
  });
  const hw = (cw - 0.25) / 2;
  banner(s, 0.7, top + 3.5, hw, 0.85, 'V + R', 'Menunjukkan apakah sumber daya bisa MENCIPTAKAN keunggulan bersaing.');
  banner(s, 0.7 + hw + 0.25, top + 3.5, hw, 0.85, 'I + N', 'Menunjukkan apakah keunggulan itu BISA BERTAHAN menghadapi serangan pesaing.');
}

// =============== 12. DYNAMIC CAPABILITY ===============
{
  const { s, top, cw } = page('PERTANYAAN 3', 'RESOURCE HARUS DIKELOLA SECARA DINAMIS', 'Lolos VRIN Test bukan berarti sebuah keunggulan akan bertahan selamanya. Pesaing bisa menyusul, sementara kebutuhan pasar terus berubah.');
  const t = [['Pesaing menyusul', 'Cara yang dulu sulit ditiru bisa dipelajari. Pesaing juga bisa menemukan cara lain yang hasilnya sama.'], ['Aset melemah', 'Keahlian, sistem, dan teknologi bisa kehilangan nilainya kalau tidak terus dikembangkan.'], ['Pasar berubah', 'Teknologi baru, selera pelanggan, atau cara menjual produk bisa membuat kekuatan lama tidak lagi relevan.']];
  const w = (cw - 0.4) / 3;
  t.forEach((it, i) => note(s, 0.7 + i * (w + 0.2), top, w, 1.4, { head: it[0], body: it[1], bodySize: 10.5 }));
  const y = top + 1.55, rh = 6.9 - y;
  redcard(s, 0.7, y, 7.4, rh);
  txt(s, 'DYNAMIC CAPABILITY', 1.0, y + 0.2, 5, 0.25, { fontFace: F.s, fontSize: 10, color: C.gold2, charSpacing: 1 });
  txt(s, 'Kemampuan perusahaan untuk memperbaiki, memperdalam, atau menambah resource dan capability yang sudah ada.', 1.0, y + 0.5, 6.8, 0.7, { fontFace: F.x, fontSize: 13, color: C.white, lineSpacingMultiple: 1.02 });
  txt(s, 'DUA CARA', 1.0, y + 1.3, 5, 0.25, { fontFace: F.s, fontSize: 10, color: C.gold2, charSpacing: 1 });
  txt(s, bullets(['Memperbaiki yang ada sedikit demi sedikit. Toyota terus menyempurnakan mesin hibrida dan Toyota Production System.', 'Menambah yang baru lewat aliansi atau akuisisi. GM bermitra dengan LG dan mendahului Tesla meluncurkan Chevy Bolt EV.'], 11, C.white), 1.0, y + 1.6, 6.8, rh - 1.8, { lineSpacingMultiple: 1.04 });
  note(s, 8.35, y, 4.3, rh, { head: 'Inti dynamic capability', body: 'Ketika kegiatan memperbarui aset dilakukan terus-menerus, kemampuan memperbarui itu sendiri berubah menjadi sebuah capability. Di titik itulah ia disebut dynamic capability.' });
}

// =============== 13. VALUE CHAIN ===============
{
  const { s, top, cw } = page('PERTANYAAN 4', 'VALUE CHAIN PERUSAHAAN', 'Sebuah produk sampai ke pelanggan melalui beberapa kegiatan. Value chain membantu kita melihat kegiatan mana yang menambah nilai dan mana yang paling banyak menghabiskan biaya.');
  tag(s, 'PRIMARY ACTIVITIES  ·  aktivitas utama pencipta nilai', 0.7, top - 0.05, 7);
  const p = [['Supply Chain Management', 'Membeli, menerima, menyimpan, dan menyalurkan bahan baku produksi'], ['Operations', 'Mengubah bahan baku jadi produk jadi'], ['Distribution', 'Menyimpan dan mengirim produk ke pembeli'], ['Sales & Marketing', 'Mengenalkan dan menjual produk lewat tenaga penjualan, iklan, promosi, dealer.'], ['Service', 'Membantu pelanggan setelah pembelian: pemasangan, perbaikan, suku cadang.']];
  const mw = 1.45, w = (cw - mw - 0.12 * 5) / 5, y = top + 0.35, h = 1.85;
  p.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.12);
    card(s, x, y, w, h);
    txt(s, it[0], x + PAD, y + 0.14, w - 2 * PAD, 0.55, { fontFace: F.x, fontSize: 11, color: C.red, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + PAD, y + 0.72, w - 2 * PAD, h - 0.85, { fontFace: F.r, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.02 });
  });
  const mx = 0.7 + 5 * (w + 0.12);
  redcard(s, mx, y, mw, h);
  txt(s, 'Profit Margin', mx + 0.1, y + 0.3, mw - 0.2, 0.5, { fontFace: F.s, fontSize: 11, color: C.white, align: 'center' });
  txt(s, 'P − C', mx + 0.1, y + 0.85, mw - 0.2, 0.5, { fontFace: F.x, fontSize: 18, color: C.gold2, align: 'center', fit: false });
  const y2 = y + h + 0.15;
  tag(s, 'SUPPORT ACTIVITIES  ·  aktivitas pendukung', 0.7, y2, 6);
  const sp = [['Product R&D, Technology & Systems Development', 'Riset produk dan proses, desain, otomasi'], ['Human Resource Management', 'Rekrutmen, pelatihan, kompensasi'], ['General Administration', 'Mengelola keuangan, hukum, akuntansi, dan informasi perusahaan.']];
  const sw = (cw - 0.4) / 3;
  sp.forEach((it, i) => note(s, 0.7 + i * (sw + 0.2), y2 + 0.4, sw, 1.05, { head: it[0], headSize: 11, body: it[1], bodySize: 10 }));
  banner(s, 0.7, y2 + 1.55, cw, 0.8, 'TIGA SELISIH YANG HARUS DIBEDAKAN', 'V − P = nilai yang diterima pelanggan (customer value proposition).   P − C = margin laba perusahaan.   V − C = Total Economic Value, seluruh nilai ekonomi yang diciptakan perusahaan.', { size: 10.5 });
}

// =============== 14. VALUE CHAIN SYSTEM ===============
{
  const { s, top, cw } = page('PERTANYAAN 4', 'VALUE CHAIN SYSTEM DAN BENCHMARKING', 'Biaya dan mutu produk tidak hanya ditentukan oleh perusahaan. Pemasok dan mitra yang menyalurkan produk juga ikut memengaruhi apa yang diterima pelanggan.');
  const ch = [['Value chain PEMASOK', 'Pemasok menyediakan input'], ['Value chain PERUSAHAAN', 'Perusahaan mengolahnya'], ['Value chain MITRA HILIR', 'Mitra hilir menyalurkannya'], ['PEMBELI / PENGGUNA AKHIR', 'Nilai yang dirasakan pelanggan']];
  const w = (cw - 0.9) / 4;
  ch.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.3);
    if (i === 3) redcard(s, x, top, w, 1.0); else card(s, x, top, w, 1.0);
    txt(s, it[0], x + PAD, top + 0.16, w - 2 * PAD, 0.5, { fontFace: F.x, fontSize: 11, color: i === 3 ? C.white : C.red, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + PAD, top + 0.62, w - 2 * PAD, 0.3, { fontFace: F.r, fontSize: 10.5, color: i === 3 ? C.white : C.ink });
    if (i < 3) s.addShape(pptx.ShapeType.triangle, { x: x + w + 0.07, y: top + 0.41, w: 0.16, h: 0.18, rotate: 90, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  });
  const y = top + 1.15, lw = 5.85, ph = 2.45;
  note(s, 0.7, y, lw, ph, { head: 'Benchmarking', headSize: 13, body: [{ text: 'Perusahaan membandingkan cara kerjanya dengan perusahaan lain yang lebih baik dalam kegiatan tertentu. Pembandingnya bisa berasal dari industri yang sama ataupun industri lain.\n\n', options: { fontFace: F.r, fontSize: 10.5, color: C.ink } }, { text: 'Best practice ', options: { fontFace: F.s, fontSize: 10.5, color: C.red } }, { text: '= cara mengerjakan suatu aktivitas yang terbukti konsisten memberi hasil lebih baik dibanding cara lain. Harus sudah dibuktikan minimal oleh satu perusahaan.', options: { fontFace: F.r, fontSize: 10.5, color: C.ink } }] });
  const x2 = 0.7 + lw + 0.25, w2 = cw - lw - 0.25;
  card(s, x2, y, w2, ph);
  txt(s, 'TIGA CONTOH YANG TERKENAL', x2 + PAD, y + 0.16, w2 - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  const ex = [['Xerox', 'Pelopornya. Tidak membatasi diri pada pesaing mesin kantor, tapi ke perusahaan mana pun yang kelas dunia.'], ['Toyota', 'Ide just-in-time datang dari mengamati cara supermarket Amerika mengisi ulang raknya.'], ['Southwest Airlines', 'Memangkas waktu parkir pesawat dengan mempelajari kru pit balap mobil.']];
  ex.forEach((it, i) => {
    const yy = y + 0.5 + i * 0.62;
    txt(s, it[0], x2 + PAD, yy, 1.6, 0.58, { fontFace: F.x, fontSize: 11, color: C.ink, valign: 'middle' });
    txt(s, it[1], x2 + 1.8, yy, w2 - 1.95, 0.58, { fontFace: F.r, fontSize: 10, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.02 });
  });
  banner(s, 0.7, y + ph + 0.15, cw, 0.85, 'TANTANGANNYA ADALAH MENDAPATKAN DATA PEMBANDING', 'Data bisa dicari dari laporan publik, asosiasi, riset, kunjungan lapangan, atau konsultan yang menjaga kerahasiaan perusahaan. Pengumpulan data tetap harus dilakukan secara sah.', { size: 10.5 });
}

// =============== 15. REMEDIES ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  TINDAKAN', 'KALAU BIAYA ATAU NILAINYA KALAH, APA YANG DILAKUKAN', 'Analisis value chain dan benchmarking bisa menunjukkan kegiatan mana yang terlalu mahal atau belum memberi cukup nilai bagi pelanggan. Perbaikannya bisa dimulai dari tiga bagian.');
  const cols = [['1. Aktivitas internal sendiri', ['Terapkan best practice, terutama di aktivitas mahal', 'Hapus aktivitas yang tidak perlu dengan merombak value chain', 'Pindahkan aktivitas mahal ke wilayah berbiaya lebih rendah', 'Serahkan ke pihak luar (outsourcing) jika mereka lebih murah', 'Investasi teknologi yang menaikkan produktivitas', 'Rancang ulang produk agar lebih murah dibuat']], ['2. Bagian pemasok', ['Tekan harga beli ke pemasok', 'Ganti ke input substitusi yang lebih murah', 'Kerja sama dengan pemasok untuk penghematan', 'Jika perlu, pertimbangkan memproduksi input sendiri', 'Untuk menaikkan nilai, pilih pemasok bermutu tinggi dan libatkan mereka sejak tahap desain']], ['3. Bagian mitra hilir (Distributor/Dealer)', ['Tekan biaya dan markup distributor serta dealer', 'Kerja sama mencari penghematan yang saling menguntungkan', 'Ubah jalur distribusi, termasuk jual langsung lewat internet', 'Integrasi ke depan: buka gerai sendiri', 'Untuk menaikkan nilai: iklan bersama, perjanjian eksklusif, dan pelatihan mitra']]];
  const w = (cw - 0.4) / 3, h = 3.45;
  cols.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    card(s, x, top, w, h);
    txt(s, it[0], x + PAD, top + 0.16, w - 2 * PAD, 0.35, { fontFace: F.x, fontSize: 12, color: C.red });
    txt(s, bullets(it[1], 10.5), x + PAD, top + 0.58, w - 2 * PAD, h - 0.72, { lineSpacingMultiple: 1.02 });
  });
  banner(s, 0.7, top + 3.6, cw, 0.85, 'DUA CARA MENGUBAH KERJA VALUE CHAIN JADI KEUNGGULAN BERSAING', '(1) Lebih efisien sehingga biayanya lebih rendah dari pesaing seperti Ryanair, Nucor, TJX.   (2) Menjadi dasar diferensiasi sehingga pelanggan mau membayar lebih: Rolex (status), Braun (desain), L.L. Bean (layanan), FedEx (keandalan).', { size: 10.5 });
}

// =============== 16. TABLE 4.4 ===============
{
  const { s, top, cw } = page('PERTANYAAN 5', 'COMPETITIVE STRENGTH ASSESSMENT', 'Alat untuk mengubah penilaian yang kualitatif menjadi satu angka yang bisa langsung dibandingkan dengan pesaing.');
  const steps = [['Daftar KSF', 'Susun key success factor industri'], ['Beri bobot', 'Sesuai tingkat kepentingan; total harus 1,00'], ['Beri rating', 'Skala 1–10. 1 sangat lemah, 10 sangat kuat'], ['Kalikan', 'Rating × bobot = skor tertimbang'], ['Jumlahkan', 'Totalnya jadi ukuran kekuatan keseluruhan']];
  const w = (cw - 0.6) / 5;
  steps.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.15);
    numTag(s, i + 1, x, top + 0.02, 0.42);
    txt(s, it[0], x + 0.52, top, w - 0.55, 0.28, { fontFace: F.x, fontSize: 11, color: C.red, clamp: false });
    txt(s, it[1], x + 0.52, top + 0.28, w - 0.55, 0.5, { fontFace: F.r, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.0, clamp: false });
  });
  const rows = [['Key Success Factor', 'Bobot', 'ABC Co.', 'Rival 1', 'Rival 2'], ['Mutu / performa produk', '0,10', '8 / 0,80', '5 / 0,50', '1 / 0,10'], ['Reputasi dan citra', '0,10', '8 / 0,80', '7 / 0,70', '1 / 0,10'], ['Kemampuan produksi', '0,10', '2 / 0,20', '10 / 1,00', '5 / 0,50'], ['Sumber daya keuangan', '0,10', '5 / 0,50', '10 / 1,00', '3 / 0,30'], ['Posisi biaya relatif', '0,30', '5 / 1,50', '10 / 3,00', '1 / 0,30'], ['Layanan pelanggan', '0,15', '5 / 0,75', '7 / 1,05', '1 / 0,15'], ['Faktor lain (tiga baris)', '0,15', '1,40', '0,45', '0,65'], ['TOTAL SKOR TERTIMBANG', '1,00', '5,95', '7,70', '2,10']];
  const ty = top + 0.95, tw = 7.7, rh = 0.33;
  s.addTable(tableStyle(rows, { totalRow: true }), { x: 0.7, y: ty, w: tw, colW: [2.9, 0.9, 1.3, 1.3, 1.3], rowH: rh });
  txt(s, 'Contoh dari Table 4.4 buku. Isi sel: rating / skor tertimbang.', 0.7, ty + 9 * rh + 0.08, tw, 0.3, { fontFace: F.r, fontSize: 10, color: C.ink2, clamp: false });
  const x2 = 0.7 + tw + 0.35, w2 = cw - tw - 0.35;
  card(s, x2, ty, w2, 9 * rh + 0.4);
  txt(s, 'APA YANG BISA DIBACA DARI ANGKANYA', x2 + PAD, ty + 0.16, w2 - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  const r = [['Bandingkan skor total', 'Besarnya net competitive advantage. Rival 1 (7,70) unggul jauh atas Rival 2 (2,10).'], ['Cari peluang bersaing', 'Lihat faktor yang menjadi kekuatan kita, tetapi masih lemah pada pesaing.'], ['Tentukan yang perlu dibenahi', 'Jika lemah di faktor tempat pesaing kuat, siapkan langkah bertahan lebih dulu.']];
  txt(s, r.map((it, i) => [{ text: it[0] + '\n', options: { fontFace: F.x, fontSize: 11.5, color: C.ink } }, { text: it[1] + (i < 2 ? '\n' : ''), options: { fontFace: F.r, fontSize: 10.5, color: C.ink, paraSpaceAfter: 6 } }]).flat(), x2 + PAD, ty + 0.5, w2 - 2 * PAD, 9 * rh - 0.2, { lineSpacingMultiple: 1.04 });
}

// =============== 17. PRIORITY LIST ===============
{
  const { s, top } = page('PERTANYAAN 6', 'ISU APA YANG HARUS DITANGANI LEBIH DULU?', 'Setelah menjawab pertanyaan 1 sampai 5 dan melihat kondisi industri, kita bisa menyusun masalah yang paling mendesak bagi perusahaan.');
  const cw = 11.95;
  redcard(s, 0.7, top, 5.6, 3.3);
  txt(s, 'PRIORITY LIST', 1.0, top + 0.2, 4, 0.25, { fontFace: F.s, fontSize: 10, color: C.gold2, charSpacing: 1 });
  txt(s, 'Berisi isu yang perlu ditangani manajemen agar perusahaan tetap kuat, baik sekarang maupun beberapa tahun ke depan.', 1.0, top + 0.5, 5.0, 1.1, { fontFace: F.x, fontSize: 13, color: C.white, lineSpacingMultiple: 1.02 });
  txt(s, 'Biasanya ditulis sebagai pertanyaan, misalnya: "Bagaimana kita mengurangi ketergantungan pada satu orang?" atau "Perlukah kita mengubah cara bersaing?"', 1.0, top + 1.75, 5.0, 1.4, { fontFace: F.r, fontSize: 11, color: C.white, lineSpacingMultiple: 1.05 });
  const x = 6.5, w = cw - 5.8;
  note(s, x, top, w, 1.55, { tag: 'DUA HAL YANG SERING KELIRU', head: 'Priority List belum memberi solusi', headSize: 12, body: 'Tujuannya mengidentifikasi ISU yang harus ditangani, bukan memutuskan tindakan apa yang diambil. Keputusan tindakan datang belakangan, saat menyusun strategi.', bodySize: 10.5 });
  note(s, x, top + 1.7, w, 1.6, { head: 'Banyaknya isu memberi petunjuk', headSize: 12, body: 'Jika hanya ada beberapa masalah kecil, strategi saat ini mungkin cukup disesuaikan. Jika masalahnya banyak dan serius, perusahaan mungkin perlu meninjau ulang strateginya.', bodySize: 10.5 });
  banner(s, 0.7, top + 3.45, cw, 0.9, 'UJI AKHIR CHAPTER 4', 'Strategi yang baik wajib memuat cara menangani SEMUA isu dan hambatan pada daftar prioritas itu. Di sinilah analisis berhenti dan penyusunan strategi dimulai.');
}

// =============== 18. SECTION B ===============
{
  flush(); const s = pptx.addSlide(); pageNo += 1; s.background = { path: 'mu_cream/img/bg_cream.jpg' }; notes(s, '18');
  // seal number
  s.addShape(pptx.ShapeType.rect, { x: W / 2 - 0.35, y: 0.75, w: 0.7, h: 0.7, fill: { color: C.red }, line: { color: C.gold, width: 1.5 } });
  txt(s, '2', W / 2 - 0.35, 0.75, 0.7, 0.7, { fontFace: F.x, fontSize: 24, color: C.white, align: 'center', valign: 'middle', fit: false, clamp: false });
  txt(s, 'BAGIAN 2  ·  STUDI KASUS', 0.7, 1.65, W - 1.4, 0.3, { fontFace: F.s, fontSize: 11, color: C.gold, charSpacing: 2, align: 'center', clamp: false });
  txt(s, 'MANCHESTER UNITED', 0.7, 2.0, W - 1.4, 0.9, { fontFace: F.x, fontSize: 44, color: C.red, align: 'center', fit: false, clamp: false });
  txt(s, 'Preparing for Life without Ferguson', 0.7, 2.9, W - 1.4, 0.45, { fontFace: F.m, fontSize: 16, color: C.ink, align: 'center', clamp: false });
  s.addShape(pptx.ShapeType.rect, { x: 0.55, y: 3.65, w: W - 1.1, h: 3.3, fill: { color: C.red }, line: { color: C.gold, width: 2 } });
  img(s, 'mu_cream/img/hero_crowd.jpg', 0.7, 3.8, W - 1.4, 3.0);
}

// =============== 19. SITUASI ===============
{
  const { s, top } = page('KASUS  ·  SITUASI', 'JULI 2009: KEPUTUSAN YANG DIHADAPI DAVID GILL', null, { src: SRC_C + 'hlm. 573 dan 588.', noMed: true });
  const cards = [['Waktu', 'Juli 2009, tur pramusim ke Malaysia, Indonesia, Korea, dan China. Skuad pulang 28 Juli 2009.'], ['Pengambil keputusan', 'David Gill, Chief Executive Manchester United Football Club Limited.'], ['Keputusan', 'Menyiapkan pengganti Sir Alex Ferguson. Kasus: "at the end of 2009 Ferguson would be 68 years old". Gill memperkirakan ia pensiun akhir musim 2009–10.']];
  const w = 2.85, ch = 2.1;
  cards.forEach((it, i) => note(s, 0.7 + i * (w + 0.15), top, w, ch, { head: it[0], body: it[1], bodySize: 10.5 }));
  photo(s, 'p_manager', 9.75, top, 2.9, 1.95);
  const y = top + ch + 0.2, ph = 2.3;
  card(s, 0.7, y, 11.95, ph);
  txt(s, 'DILEMA INTI', 0.7 + PAD, y + 0.16, 5, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  txt(s, [{ text: 'Pilih orang dalam ', options: { fontFace: F.x, color: C.red } }, { text: '(Queiroz, Phelan, Solskjær, McClair): sistem latihan, pemanduan bakat, dan pengembangan tim tetap jalan. Tetapi apakah mereka cukup berwibawa di depan pemain bintang?', options: { fontFace: F.r, color: C.ink } }], 0.7 + PAD, y + 0.46, 5.6, 1.0, { fontSize: 10.5, lineSpacingMultiple: 1.04 });
  txt(s, [{ text: 'Pilih orang luar berwibawa ', options: { fontFace: F.x, color: C.red } }, { text: 'seperti Mourinho: kasus menyebut ini "a revolutionary change in coaching strategy in which much of Ferguson\'s infrastructure would be taken down and rebuilt".', options: { fontFace: F.r, color: C.ink } }], 6.75, y + 0.46, 5.75, 1.0, { fontSize: 10.5, lineSpacingMultiple: 1.04 });
  s.addShape(pptx.ShapeType.rect, { x: 0.95, y: y + ph - 0.72, w: 11.45, h: 0.5, fill: { color: C.red }, line: { color: C.red, width: 0 } });
  txt(s, 'Pertanyaan Chapter 4 di baliknya: aset mana yang milik klub, dan aset mana yang milik satu orang?', 1.15, y + ph - 0.72, 11.1, 0.5, { fontFace: F.s, fontSize: 11, color: C.white, valign: 'middle', clamp: false });
}

// =============== 20. INDUSTRY ===============
{
  const { s, top, cw } = page('KONTEKS', 'SEPAKBOLA EROPA SEBAGAI INDUSTRI', 'Q1 menuntut perbandingan dengan pesaing. Jadi kita perlu tahu dulu industrinya seperti apa.', { src: SRC_C + 'Table 6.6 dan teks kasus.' });
  const w = (cw - 0.5) / 3;
  [['€2,4 M', 'Pendapatan Premier League 2007–08', 'Terbesar di Eropa. Serie A, La Liga dan Bundesliga masing-masing sekitar €1,4 miliar.'], ['62%', 'Porsi gaji terhadap pendapatan', 'Premier League. Serie A 68%, La Liga 63%. Gaji adalah pos biaya terbesar klub Eropa.'], ['6 dari 10', 'Klub besar merugi', 'Selama 2000–2006. Industri ini tumbuh pesat, tapi sangat tidak menguntungkan.']].forEach((it, i) => {
    const x = 0.7 + i * (w + 0.25);
    card(s, x, top, w, 1.5);
    txt(s, it[0], x + PAD, top + 0.1, w - 2 * PAD, 0.55, { fontFace: F.x, fontSize: 24, color: C.red, fit: false });
    txt(s, it[1], x + PAD, top + 0.66, w - 2 * PAD, 0.28, { fontFace: F.s, fontSize: 11, color: C.ink });
    txt(s, it[2], x + PAD, top + 0.94, w - 2 * PAD, 0.55, { fontFace: F.r, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.0 });
  });
  const y = top + 1.65, lw = 6.4, ph = 6.9 - y;
  card(s, 0.7, y, lw, ph);
  txt(s, 'TIGA SUMBER PENDAPATAN KLUB  ·  PREMIER LEAGUE 2007–08', 0.7 + PAD, y + 0.16, lw - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  const rev = [['Matchday', '£554 jt', 'Tiket dan hospitality. Dibatasi kapasitas stadion; itu sebabnya klub besar merenovasi atau membangun stadion baru.'], ['Broadcasting', '£931 jt', 'Hak siar dinegosiasikan Premier League. Kontrak 2006 bernilai £2,7 miliar; tiap klub dapat rata-rata £45 juta per tahun.'], ['Commercial', '£447 jt', 'Sponsor, lisensi merchandise, iklan. Terpusat di sedikit klub; Real Madrid dan Barcelona meraup lebih dari 60% sponsor La Liga.']];
  const rh = (ph - 0.6) / 3;
  rev.forEach((it, i) => {
    const yy = y + 0.5 + i * rh;
    txt(s, it[0], 0.7 + PAD, yy, 1.5, 0.28, { fontFace: F.x, fontSize: 11, color: C.ink });
    txt(s, it[1], 0.7 + PAD, yy + 0.3, 1.5, 0.3, { fontFace: F.x, fontSize: 12, color: C.red });
    txt(s, it[2], 2.35, yy, lw - 1.85, rh - 0.05, { fontFace: F.r, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.02 });
  });
  const x2 = 0.7 + lw + 0.3, w2 = cw - lw - 0.3;
  card(s, x2, y, w2, ph);
  txt(s, 'ATURAN MAIN DAN LOGIKA EKONOMINYA', x2 + PAD, y + 0.16, w2 - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  const rules = [['Struktur kompetisi', '20 klub Premier League, tiga terbawah turun kasta. Empat teratas lolos Champions League, kompetisi 32 klub terbaik Eropa.'], ['Yang kaya makin kaya', 'Sejak UCL dimulai 1992, muncul jurang keuangan antara MU, Chelsea, Liverpool, Arsenal dan sisanya. Uang Eropa membeli pemain bagus.'], ['Harga pemain meledak', 'Rekor transfer baru tercipta musim panas 2009 meski resesi. Pendorongnya: Real Madrid, lalu Chelsea, lalu Manchester City.']];
  rules.forEach((it, i) => {
    const yy = y + 0.5 + i * rh;
    txt(s, it[0], x2 + PAD, yy, w2 - 2 * PAD, 0.26, { fontFace: F.x, fontSize: 11, color: C.ink });
    txt(s, it[1], x2 + PAD, yy + 0.28, w2 - 2 * PAD, rh - 0.32, { fontFace: F.r, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.02 });
  });
}

// =============== 21. ON PITCH ===============
{
  const { s, top } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI LAPANGAN: JELAS DI ATAS RATA-RATA', 'Indikator kedua: apakah posisi bersaing MU membaik? Data kompetisi di kasus menjawabnya.', { src: SRC_C + 'Table 6.1, 6.2 dan 6.7.' });
  const stats = [['1.460', 'Poin Eropa 2000–2009, tertinggi  ·  Table 6.2', 'Barcelona 1.411  ·  Real Madrid 1.314  ·  Arsenal 1.310'], ['3', 'Gelar liga beruntun 2007, 2008, 2009  ·  Table 6.1', 'Total 11 gelar liga sejak 1993 dalam rentang kasus'], ['2008', 'Liga Champions kedua di era Ferguson  ·  hlm. 584', 'Yang pertama 1999, bersama gelar liga dan FA Cup']];
  stats.forEach((it, i) => {
    const y = top + i * 1.5;
    card(s, 0.7, y, 4.5, 1.35);
    txt(s, it[0], 0.7 + PAD, y + 0.08, 4.2, 0.55, { fontFace: F.x, fontSize: 24, color: C.red, fit: false });
    txt(s, it[1], 0.7 + PAD, y + 0.65, 4.2, 0.3, { fontFace: F.s, fontSize: 10.5, color: C.ink });
    txt(s, it[2], 0.7 + PAD, y + 0.95, 4.2, 0.35, { fontFace: F.r, fontSize: 10, color: C.ink2 });
  });
  const x = 5.45, cw2 = 7.2;
  card(s, x, top, cw2, 4.35);
  txt(s, 'TOTAL POIN EROPA 2000–09  ·  TABLE 6.2', x + PAD, top + 0.16, cw2 - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  hbars(s, x + 0.3, top + 0.5, cw2 - 0.6, 2.75, [{ label: 'Man United', v: 1460, fmt: '1.460', hi: true }, { label: 'Barcelona', v: 1411, fmt: '1.411' }, { label: 'Real Madrid', v: 1314, fmt: '1.314' }, { label: 'Bayern', v: 1314, fmt: '1.314' }, { label: 'Arsenal', v: 1310, fmt: '1.310' }, { label: 'Chelsea', v: 1276, fmt: '1.276' }], { labW: 1.6 });
  txt(s, 'Di antara enam klub ini, skuad MU paling besar (34 pemain) dan termuda kedua (25,6 tahun) setelah Arsenal (Table 6.7). Cocok dengan strategi memadukan pemain muda dan pemain berpengalaman (hlm. 583).', x + 0.3, top + 3.35, cw2 - 0.6, 0.9, { fontFace: F.r, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.04 });
}

// =============== 22. FINANCE ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI KEUANGAN: PALING UNTUNG DI ANTARA KLUB BESAR', 'Indikator pertama Thompson: apakah kekuatan keuangan dan laba MU membaik?', { src: SRC_C + 'Appendix hlm. 589, Table 6.5 dan 6.6.' });
  const lw = 7.4, ph = 3.5;
  card(s, 0.7, top, lw, ph);
  txt(s, 'PENDAPATAN MU, £ JUTA  ·  NAIK 53% DARI 2006 KE 2008', 0.7 + PAD, top + 0.16, lw - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  vbars(s, 0.9, top + 0.5, lw - 0.4, 2.15, [{ label: '2000', v: 116.0, fmt: '116,0' }, { label: '2001', v: 129.6, fmt: '129,6' }, { label: '2002', v: 146.1, fmt: '146,1' }, { label: '2003', v: 173.0, fmt: '173,0' }, { label: '2004', v: 169.1, fmt: '169,1' }, { label: '2005', v: 157.2, fmt: '157,2' }, { label: '2006', v: 167.8, fmt: '167,8' }, { label: '2007', v: 212.2, fmt: '212,2', hi: true }, { label: '2008', v: 257.1, fmt: '257,1', hi: true }]);
  txt(s, 'Entitas: plc untuk 2000–2005, Limited untuk 2006–2008. Tahun buku 2000–04 sampai 31 Juli, 2005–08 sampai 30 Juni. Kasus: data 2000–04 tidak sebanding dengan 2005–08 karena perubahan akuntansi.', 0.9, top + 2.72, lw - 0.4, 0.7, { fontFace: F.r, fontSize: 10, color: C.ink2, lineSpacingMultiple: 1.02 });
  const x = 0.7 + lw + 0.25, w = cw - lw - 0.25;
  card(s, x, top, w, ph);
  txt(s, 'BUKTI PENDUKUNG', x + PAD, top + 0.16, w - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  const ev = [['×2,2', 'Laba bersih naik dari £21,6 jt (2006) ke £46,8 jt (2008). Margin bersih 2008: 18,2%'], ['12,6%', 'Return on sales 2000–2006 (Table 6.6), tertinggi dari 10 klub; Real Madrid hanya 0,4%'], ['€101,9 jt', 'EBITDA tertinggi di Table 6.5 (data Forbes 2009). Margin 31,4% vs Barcelona 22,3%, Real Madrid 14,1%'], ['£1,14 M', 'Nilai klub tertinggi di Table 6.5, di atas Barcelona £960 jt dan Real Madrid £850 jt']];
  const rh = (ph - 0.6) / 4;
  ev.forEach((it, i) => {
    const yy = top + 0.5 + i * rh;
    txt(s, it[0], x + PAD, yy, 1.25, rh - 0.05, { fontFace: F.x, fontSize: 13, color: C.red, valign: 'middle' });
    txt(s, it[1], x + 1.5, yy, w - 1.65, rh - 0.05, { fontFace: F.r, fontSize: 10, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + ph + 0.15, cw, 0.75, 'SATU ANGKA YANG ANOMALI', 'Utang £616 juta, tertinggi kedua di Table 6.5 setelah Arsenal (£896 juta). Kasus mencatat akuisisi Glazer 2005 dibiayai terutama dengan utang.', { size: 10.5 });
}

// =============== 23. TRANSFER (+ Chelsea) ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  KESIMPULAN', 'PRESTASI PUNCAK, BELANJA RELATIF HEMAT', 'Dari lima klub besar, belanja bersih MU yang paling kecil, dengan poin performa tertinggi kedua.', { src: SRC_C + 'Table 6.7; perbandingan disusun kelompok.' });
  const lw = 7.4, ph = 3.5;
  card(s, 0.7, top, lw, ph);
  txt(s, 'BELANJA TRANSFER BERSIH 2003–09, £ JUTA  ·  LIMA KLUB BESAR', 0.7 + PAD, top + 0.16, lw - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  hbars(s, 0.9, top + 0.5, lw - 0.4, 2.25, [{ label: 'Real Madrid (183,0 poin)', v: 438 }, { label: 'Chelsea (144,5 poin)', v: 430 }, { label: 'Barcelona (200,0 poin)', v: 249 }, { label: 'Bayern München (179,5 poin)', v: 122 }, { label: 'Manchester United (192,5 poin)', v: 100, hi: true }], { labW: 2.75 });
  txt(s, 'Klub lain ada yang belanja lebih sedikit: Arsenal £22 jt, AC Milan justru penjual bersih (−£66 jt). Tapi poinnya 162,0 dan 169,0, di bawah MU.', 0.9, top + 2.82, lw - 0.4, 0.6, { fontFace: F.r, fontSize: 10, color: C.ink2, lineSpacingMultiple: 1.02 });
  const x = 0.7 + lw + 0.25, w = cw - lw - 0.25;
  redcard(s, x, top, w, 1.5);
  txt(s, '4,4×', x + PAD, top + 0.1, 2, 0.55, { fontFace: F.x, fontSize: 24, color: C.gold2, fit: false });
  txt(s, 'Real Madrid membelanjakan 4,4 kali lipat belanja bersih MU (£438 jt vs £100 jt), tapi poin performanya lebih rendah: 183,0 vs 192,5.', x + PAD, top + 0.65, w - 2 * PAD, 0.8, { fontFace: F.m, fontSize: 10.5, color: C.white, lineSpacingMultiple: 1.02 });
  card(s, x, top + 1.6, w, ph - 1.6);
  const mini = [['Chelsea', '£430 jt belanja bersih, hanya 144,5 poin.'], ['Barcelona', 'Satu-satunya yang mengungguli MU, dengan belanja 2,5× lipat.'], ['Kata kasus', 'Belanja bersih MU "relatif sederhana".']];
  mini.forEach((it, i) => {
    const yy = top + 1.75 + i * 0.58;
    txt(s, it[0], x + PAD, yy, 1.2, 0.55, { fontFace: F.x, fontSize: 10.5, color: C.red, valign: 'middle' });
    txt(s, it[1], x + 1.45, yy, w - 1.6, 0.55, { fontFace: F.r, fontSize: 10, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + ph + 0.15, cw, 0.75, 'JAWABAN Q1', 'Strategi MU bekerja sangat baik. Kedua indikator terpenuhi sekaligus, di industri yang mayoritas pelakunya merugi. Yang harus dijelaskan pertanyaan berikutnya: kenapa bisa begitu.', { size: 10.5 });
}

// =============== 24. SWOT MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 2  ·  DITERAPKAN', 'SWOT MANCHESTER UNITED, JULI 2009', 'Semua temuan Q1 dirangkum, lalu ditarik kesimpulan sesuai langkah 2 dan 3, bukan berhenti di daftar.', { src: SRC_C.trim() });
  const q = [['S', 'Strengths', ['Merek global dengan 80 juta pendukung di Asia', 'Laba tertinggi di antara klub besar: EBITDA €101,9 jt, RoS 12,6%', 'Akademi dan jaringan pemandu bakat yang matang', 'Disiplin transfer: belanja bersih hanya £100 jt'], true], ['W', 'Weaknesses', ['Bergantung pada satu orang yang akhir 2009 berusia 68 tahun', 'Belum ada keputusan suksesi; Ferguson belum menyatakan niat pensiun', 'Ronaldo, satu-satunya pemain MU di peringkat FIFA, baru dijual', 'Utang £616 jt; akuisisi Glazer 2005 dibiayai utang'], false], ['O', 'Opportunities', ['Pasar Asia: India dan Cina disebut Aon sebagai target utama', 'Sponsor khusus per negara masih bisa diperbanyak', 'Pendapatan siaran Premier League naik 43% dalam setahun', 'Kanal digital: MUTV, MU Mobile, toko online'], false], ['T', 'Threats', ['Harga pemain meledak, didorong Manchester City (£185 jt)', 'Pesaing berpemilik sangat kaya: Abramovich, Sheikh Mansour', 'MU tak dapat suntikan dana pemilik seperti Chelsea dan City', 'Barcelona unggul poin performa (200,0 vs 192,5)'], true]];
  const w = (cw - 0.2) / 2, h = 1.72;
  q.forEach((it, i) => {
    const x = 0.7 + (i % 2) * (w + 0.2), y = top + Math.floor(i / 2) * (h + 0.08);
    if (it[3]) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    txt(s, it[0], x + PAD, y + 0.15, 0.75, 0.8, { fontFace: F.x, fontSize: 32, color: it[3] ? C.gold2 : C.red, fit: false });
    txt(s, it[1], x + 1.0, y + 0.18, 3, 0.3, { fontFace: F.x, fontSize: 13, color: it[3] ? C.white : C.red });
    txt(s, bullets(it[2], 10.5, it[3] ? C.white : C.ink), x + 1.0, y + 0.5, w - 1.2, h - 0.6, { lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + 2 * h + 0.2, cw, 0.8, 'KESIMPULAN  ·  LANGKAH 2', 'Kekuatan MU cukup untuk menangkap peluang komersial di Asia. Tapi kelemahan terbesarnya, ketergantungan pada Ferguson, menyerang sisi lapangan, padahal bagi Gill sisi lapangan adalah syarat mengalirnya pendapatan komersial.', { size: 10.5 });
}

// =============== 25. RESOURCE INVENTORY ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DITERAPKAN', 'INVENTARISASI RESOURCE MANCHESTER UNITED', 'Langkah pertama Q3: mendaftar aset bersaing klub memakai delapan kategori, semuanya berdasarkan bukti dari kasus.', { src: SRC_C.trim() });
  const tan = [['Finansial', 'EBITDA €101,9 jt, tertinggi di Table 6.5; laba bersih 2008 £46,8 jt; ekuitas £294 jt.'], ['Fisik', 'Old Trafford, diperluas 2006 dengan tambahan 7.500 kursi; museum, tur stadion, suite dan ballroom.'], ['Teknologi', 'MUTV (siaran web), MU Mobile (SMS dan video), toko online store.manutd.com.'], ['Organisasional', 'Urusan tim (Ferguson) terpisah dari komersial (Gill; direktur komersial Richard Arnold); MU International.']];
  const intan = [['Human assets', 'Ferguson sejak 1986; skuad 34 pemain; lebih dari 20 pemandu bakat. Ronaldo, peringkat 1 FIFA, dijual 2009.'], ['Merek & reputasi', '80 juta pendukung di Asia; sub-merek Fred the Red, MUFC, Red Devil. Menurut Aon, tak tertandingi di dunia olahraga.'], ['Relasi', 'Nike dan AIG (diganti Aon, £80 jt/4 tahun), ditambah 13 sponsor lain, termasuk Tri Indonesia dan Bharti Airtel.'], ['Budaya & insentif', 'Disiplin latihan ketat, perang terhadap alkohol, prinsip "tidak ada pemain yang lebih besar dari klub".']];
  const hw = (cw - 0.25) / 2, ph = 3.5;
  [['TANGIBLE', tan, C.red, C.white], ['INTANGIBLE', intan, C.gold, C.ink]].forEach((col, ci) => {
    const x = 0.7 + ci * (hw + 0.25);
    card(s, x, top, hw, ph);
    s.addShape(pptx.ShapeType.rect, { x, y: top, w: hw, h: 0.4, fill: { color: col[2] }, line: { color: col[2], width: 0 } });
    txt(s, col[0], x + PAD, top, hw - 2 * PAD, 0.4, { fontFace: F.x, fontSize: 12, color: col[3], charSpacing: 2, valign: 'middle', clamp: false });
    const rh = (ph - 0.55) / 4;
    col[1].forEach((r, ri) => {
      const y = top + 0.48 + ri * rh;
      txt(s, r[0], x + PAD, y, 1.45, rh - 0.05, { fontFace: F.x, fontSize: 10.5, color: C.ink, valign: 'middle' });
      txt(s, r[1], x + 1.7, y, hw - 1.85, rh - 0.05, { fontFace: F.r, fontSize: 10, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.0 });
    });
  });
  banner(s, 0.7, top + ph + 0.15, cw, 0.8, 'PERBANDINGAN KOMPOSISI', 'Aset yang paling membedakan MU ada di kolom kanan, yang tidak berwujud. Hal tersebut yang membuat unggul, dan sekaligus rapuh, karena sebagian aset tak berwujud melekat pada orang, dan orang bisa pergi.', { size: 10.5 });
}

// =============== 26. CAPABILITIES ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DITERAPKAN', 'CAPABILITY MU: MANA YANG CORE COMPETENCE', null, { src: SRC_C.trim() });
  const c = [['CORE COMPETENCE', 'Mengenali dan mengembangkan bakat', 'Pemandu bakat dari 5 jadi lebih dari 20 orang; Youth Academy; dua pemandu bakat penuh waktu di Brasil sejak 2008.'], ['CORE COMPETENCE', 'Membentuk dan merotasi tim', 'Memadukan pemain muda dengan pemain berpengalaman. Kasus menyebut Ferguson pelopor rotasi skuad.'], ['CORE COMPETENCE', 'Mengubah merek jadi uang', 'Sponsor khusus Indonesia dan India, sub-merek per usia, MU Finance, MU Mobile, MUTV, Soccer Schools, tur Asia.'], ['DISTINCTIVE COMPETENCE', 'Disiplin di pasar transfer', 'Belanja kotor £322 jt, bersih £100 jt. Mau menjual pemain yang dihargai lebih tinggi klub lain, seperti Ronaldo (£80 jt).'], ['DISTINCTIVE COMPETENCE', 'Tata kelola klub', 'Kasus: klub Inggris "paling berhasil membangun tata kelola yang efektif". Glazer memilih peran pasif.'], ['COMPETENCE', 'Mengelola stadion dan acara', 'Old Trafford disewakan untuk konferensi dan pernikahan; museum dan tur. Dikerjakan baik, tapi klub besar lain juga melakukannya.']];
  const w = (cw - 0.4) / 3, h = 1.95;
  c.forEach((it, i) => {
    const x = 0.7 + (i % 3) * (w + 0.2), y = top + 0.35 + Math.floor(i / 3) * (h + 0.15);
    const core = it[0] === 'CORE COMPETENCE';
    if (core) { redcard(s, x, y, w, h); txt(s, it[0], x + PAD, y + 0.16, w - 2 * PAD, 0.22, { fontFace: F.s, fontSize: 10, color: C.gold2, charSpacing: 1 }); txt(s, it[1], x + PAD, y + 0.42, w - 2 * PAD, 0.3, { fontFace: F.x, fontSize: 12, color: C.white }); txt(s, it[2], x + PAD, y + 0.76, w - 2 * PAD, h - 0.9, { fontFace: F.r, fontSize: 10.5, color: C.white, lineSpacingMultiple: 1.02 }); }
    else note(s, x, y, w, h, { tag: it[0], tagColor: it[0] === 'COMPETENCE' ? C.ink2 : C.red, head: it[1], headSize: 12, body: it[2], bodySize: 10.5 });
  });
  banner(s, 0.7, top + 2 * h + 0.6, cw, 0.85, 'YANG PERLU DIPERHATIKAN', 'Tiga capability yang langsung menentukan prestasi lapangan (bakat, tim, dan transfer) dibangun dan diarahkan oleh Ferguson. Tiga lainnya berdiri di luar dirinya.', { size: 10.5 });
}

// =============== 27. VRIN MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  VRIN TEST', 'DUA KEUNGGULAN, SAMA-SAMA LOLOS VRIN TEST', 'Dilakukan uji antara sistem Ferguson dan merek beserta mesin komersialnya.', { src: SRC_C + 'Table 6.5, 6.8; hlm. 573–588.' });
  const rows = [['Tes', 'Sistem Ferguson', 'Merek & mesin komersial'],
    ['Valuable', 'LOLOS. Poin Eropa tertinggi, tiga gelar liga beruntun, Liga Champions 2008. Ferguson memenangi lebih banyak gelar daripada seluruh sejarah klub sebelumnya.', 'LOLOS. Aon membayar £80 jt untuk 4 tahun, atau £20 jt per tahun, dua kali lipat Chelsea dan Samsung (£10 jt per tahun).'],
    ['Rare', 'LOLOS. Table 6.8 hanya memuat 15 pelatih paling dihormati dunia; Ferguson paling lama di satu klub, sejak 1986.', 'LOLOS. Kasus hanya menyebut MU dan Real Madrid sebagai pemimpin eksploitasi merek global. MU punya 80 juta pendukung di Asia.'],
    ['Inimitable', 'LOLOS. Kasus sendiri menyebut penentu performa tim "tetap misteri … menentang analisis": causal ambiguity. Ditambah 23 tahun akumulasi dan social complexity.', 'LOLOS. Dibangun sejak 1878 lewat sejarah dan prestasi panjang. Chelsea, meski belanja besar, pendapatannya masih di bawah MU: €268,9 jt vs €324,8 jt.'],
    ['Nonsubstitutable', 'LOLOS. Jalan lain pesaing, membeli bintang dengan uang besar, tidak menyamai hasilnya: tim bertabur bintang Real Madrid dan Chelsea "gagal mencapai kejayaan".', 'LOLOS. Superstar bisa mendongkrak penjualan merchandise, tapi pemain datang dan pergi. Basis fan tetap: Aon menyebut fan Asia MU faktor kunci kontraknya.']];
  s.addTable(tableStyle(rows, { leftCols: [1, 2], fs: 10 }), { x: 0.7, y: top, w: cw, colW: [1.6, 5.18, 5.17], rowH: [0.36, 0.8, 0.8, 0.8, 0.8] });
  banner(s, 0.7, top + 3.75, cw, 0.8, 'KESIMPULAN Q3', 'Keduanya lolos VRIN Test, jadi keduanya tahan terhadap serangan PESAING. Bedanya ada di luar VRIN: merek melekat pada klub, sedangkan sistem Ferguson dibangun dan dipimpin satu orang yang akan segera pensiun.', { size: 10.5 });
}

// =============== 28. DYNAMIC CAPABILITY MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DYNAMIC CAPABILITY', 'TIGA KALI MEMBANGUN ULANG TIM JUARA', 'Inilah yang tidak diukur VRIN Test: apakah kemampuan memperbarui diri ini milik klub, atau milik satu orang.', { src: SRC_C + 'hlm. 583 dan 584.' });
  const cyc = [['1986 – 1993', 'Membersihkan dan membangun fondasi', 'Ferguson menyingkirkan pemain yang dinilai kurang berbakat atau kurang berkomitmen, mempertahankan Bryan Robson, mendatangkan Hughes, Ince, Cantona, Keane. Ia juga menegakkan disiplin latihan.', 'FA Cup 1990  ·  Piala Winners 1991  ·  liga pertama era Ferguson 1993'], ['1994 – 2003', 'Generasi akademi', 'Juara liga junior 1990 menghasilkan Giggs, Beckham, Butt, Gary dan Phil Neville, serta Scholes. Mereka jadi inti tim yang mendominasi sepakbola Inggris.', 'Puncaknya 1999: liga, FA Cup, European Cup, Intercontinental Cup'], ['2003 – 2008', 'Regenerasi kedua', 'Kasus mencatat Beckham, Keane, Schmeichel, Cole, Sheringham, Stam dijual. Penggantinya antara lain Ferdinand, Ronaldo, Rooney, van der Sar, Evra, Vidić, Carrick.', 'Liga Champions 2008  ·  tiga gelar liga beruntun 2007–2009']];
  const w = (cw - 0.4) / 3, h = 3.25;
  s.addShape(pptx.ShapeType.rect, { x: 0.7, y: top + 0.08, w: cw, h: 0.06, fill: { color: C.red }, line: { color: C.red, width: 0 } });
  cyc.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    s.addShape(pptx.ShapeType.ellipse, { x: x + 0.15, y: top, w: 0.22, h: 0.22, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
    card(s, x, top + 0.4, w, h);
    txt(s, it[0], x + PAD, top + 0.55, w - 2 * PAD, 0.4, { fontFace: F.x, fontSize: 17, color: C.red, fit: false });
    txt(s, it[1], x + PAD, top + 0.98, w - 2 * PAD, 0.55, { fontFace: F.x, fontSize: 12, color: C.ink, lineSpacingMultiple: 0.95 });
    txt(s, it[2], x + PAD, top + 1.55, w - 2 * PAD, 1.5, { fontFace: F.r, fontSize: 10.5, color: C.ink, lineSpacingMultiple: 1.02 });
    txt(s, it[3], x + PAD, top + 3.05, w - 2 * PAD, 0.5, { fontFace: F.s, fontSize: 10, color: C.red, lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + 3.8, cw, 0.75, 'PRESEDEN DARI KASUS SENDIRI', 'Setelah Matt Busby pensiun 1969, MU merosot. Selama 18 tahun sebelum Ferguson datang, MU tidak memenangi satu pun gelar liga dan hanya sekali jadi runner-up.', { size: 10.5 });
}

// =============== 29. VALUE CHAIN MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  DITERAPKAN', 'VALUE CHAIN DAN STRUKTUR BIAYA MU', 'Keunggulan biaya MU ada di HULU, di cara mendapatkan pemain.', { src: SRC_C + 'hlm. 580, 583, 584, 586.' });
  const lw = 7.6;
  tag(s, 'PRIMARY ACTIVITIES', 0.7, top - 0.05, 4);
  const p = [['Supply Chain', 'Mendapatkan pemain', 'Akademi, 20+ pemandu bakat, pasar transfer'], ['Operations', 'Latihan dan bertanding', 'Disiplin latihan, rotasi skuad, taktik'], ['Distribution', 'Menyalurkan tontonan', 'Hak siar liga dan UEFA, MUTV, Old Trafford'], ['Sales & Marketing', 'Menjual merek', 'Nike, AIG/Aon, 13 sponsor lain, tur Asia'], ['Service', 'Melayani pendukung', 'Superstore, museum, Soccer Schools, MU Mobile']];
  const w = (lw - 0.4) / 5, ph1 = 1.95;
  p.forEach((it, i) => {
    const x = 0.7 + i * (w + 0.1), y = top + 0.35;
    if (i === 0) redcard(s, x, y, w, ph1); else card(s, x, y, w, ph1);
    const ink = i === 0 ? C.white : C.ink;
    txt(s, it[0], x + 0.1, y + 0.14, w - 0.2, 0.45, { fontFace: F.s, fontSize: 10, color: i === 0 ? C.gold2 : C.red, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.1, y + 0.62, w - 0.2, 0.55, { fontFace: F.x, fontSize: 10.5, color: ink, lineSpacingMultiple: 0.98 });
    txt(s, it[2], x + 0.1, y + 1.18, w - 0.2, 0.72, { fontFace: F.r, fontSize: 10, color: ink, lineSpacingMultiple: 1.0 });
  });
  tag(s, 'SUPPORT ACTIVITIES', 0.7, top + 2.42, 4);
  const sp = [['Product R&D & Systems', 'Metodologi akademi, inovasi rotasi skuad, MUTV'], ['Human Resource Management', 'Rekrutmen, struktur gaji, penegakan disiplin'], ['General Administration', 'Pemisahan peran Gill dan Ferguson; MU International']];
  const sw = (lw - 0.2) / 3;
  sp.forEach((it, i) => note(s, 0.7 + i * (sw + 0.1), top + 2.82, sw, 1.08, { head: it[0], headSize: 10.5, headH: 0.42, body: it[1], bodySize: 10 }));
  const x2 = 0.7 + lw + 0.3, w2 = cw - lw - 0.3, ph2 = 3.85;
  card(s, x2, top, w2, ph2);
  txt(s, 'DI MANA LETAK KEUNGGULAN BIAYANYA', x2 + PAD, top + 0.16, w2 - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  const adv = [['Gaji hanya ± 50% pendapatan', 'Rata-rata Premier League 62%, Serie A 68%, Chelsea 81%. Selisih 31 poin dengan Chelsea.'], ['Akademi: pemain tanpa biaya transfer', 'Giggs, Beckham, Butt, Neville bersaudara, Scholes: inti tim 1994–2003.'], ['Menjual pemain yang dihargai tinggi', 'Kotor £322 jt, bersih hanya £100 jt (2003–09). Ronaldo dilepas £80 jt, rekor dunia.'], ['Yang melawan arah', 'Amortisasi pemain naik dari £24,2 jt (2005) ke £35,5 jt (2008).']];
  const rh = (ph2 - 0.6) / 4;
  adv.forEach((it, i) => {
    const y = top + 0.5 + i * rh;
    txt(s, it[0], x2 + PAD, y, w2 - 2 * PAD, 0.26, { fontFace: F.x, fontSize: 10.5, color: i === 3 ? C.red : C.ink });
    txt(s, it[1], x2 + PAD, y + 0.27, w2 - 2 * PAD, rh - 0.3, { fontFace: F.r, fontSize: 10, color: C.ink, lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + 4.0, cw, 0.95, 'NILAI BAGI DUA PIHAK BERBEDA', 'Bagi pendukung: prestasi, sejarah, dan pengalaman Old Trafford. Bagi sponsor: akses ke 80 juta pendukung Asia, ditambah bukti bahwa akses itu bekerja, yaitu lompatan AIG ke peringkat 47 merek dunia dalam satu tahun.', { size: 10.5 });
}

// =============== 30. BENCHMARKING ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  BENCHMARKING DITERAPKAN', 'YANG DIBANDINGKAN BUKAN PENDAPATAN, TETAPI MARGIN', 'Benchmarking untuk Q4: seberapa kompetitif struktur biaya MU? Ukurannya bukan besar pendapatan, tapi berapa yang tersisa sebagai laba.', { src: SRC_C + 'Table 6.5 (Forbes 2009) dan Table 6.6.' });
  const lw = 6.3, ph = 4.65;
  card(s, 0.7, top, lw, ph);
  txt(s, 'MARGIN EBITDA, %  ·  10 KLUB BERPENDAPATAN TERBESAR DI TABLE 6.5', 0.7 + PAD, top + 0.16, lw - 2 * PAD, 0.25, { fontFace: F.s, fontSize: 10, color: C.red, charSpacing: 1 });
  hbars(s, 0.9, top + 0.5, lw - 0.4, 4.0, [{ label: 'Man United', v: 31.4, fmt: '31,4', hi: true }, { label: 'Roma', v: 25.0, fmt: '25,0' }, { label: 'Barcelona', v: 22.3, fmt: '22,3' }, { label: 'Arsenal', v: 19.3, fmt: '19,3' }, { label: 'AC Milan', v: 17.6, fmt: '17,6' }, { label: 'Liverpool', v: 15.8, fmt: '15,8' }, { label: 'Real Madrid', v: 14.1, fmt: '14,1' }, { label: 'Bayern', v: 12.7, fmt: '12,7' }, { label: 'Inter', v: 9.9, fmt: '9,9' }, { label: 'Chelsea', v: -3.1, fmt: '−3,1' }], { labW: 1.5 });
  const x = 0.7 + lw + 0.25, w = cw - lw - 0.25;
  note(s, x, top, w, 2.35, { head: 'Dua jalan mendapat pemain', body: 'Membeli bintang: Real Madrid, Chelsea. Return on sales 0,4% dan −60,4%. Mengembangkan sendiri: Bayern, Barcelona, Arsenal, Valencia. Bayern 4,7%, Arsenal 5,6%. MU memadukan keduanya: bakat akademi dipadukan pemain berpengalaman, lalu pemain dijual saat klub lain menilai lebih tinggi. Return on sales 12,6%, tertinggi.', bodySize: 10.5 });
  banner(s, x, top + 2.5, w, 2.15, 'BATAS KLAIM INI', 'Margin MU tertinggi di antara klub besar. Dari 15 klub, hanya Lyon (38,5%) yang lebih tinggi, dengan pendapatan kurang dari separuh MU.\n\nBenchmarking menguji biaya dan hasil aktivitas (Q4). VRIN Test menguji resource (Q3). Dua alat, dua pertanyaan berbeda.', { size: 10.5 });
}

// =============== 31. COMPETITIVE STRENGTH MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 5  ·  DITERAPKAN', 'COMPETITIVE STRENGTH ASSESSMENT MANCHESTER UNITED', null, { src: SRC_C + 'Bobot dan rating adalah penilaian kelompok.' });
  const rows = [['Key Success Factor', 'Bobot', 'Man United', 'Real Madrid', 'Barcelona', 'Chelsea', 'Arsenal'], ['Kualitas skuad', '0,15', '6 / 0,90', '9 / 1,35', '10 / 1,50', '9 / 1,35', '6 / 0,90'], ['Kemampuan manajer', '0,15', '10 / 1,50', '5 / 0,75', '8 / 1,20', '6 / 0,90', '8 / 1,20'], ['Akademi & pemandu bakat', '0,10', '9 / 0,90', '3 / 0,30', '9 / 0,90', '3 / 0,30', '8 / 0,80'], ['Merek & basis pendukung', '0,15', '10 / 1,50', '9 / 1,35', '7 / 1,05', '5 / 0,75', '6 / 0,90'], ['Kemampuan komersial', '0,10', '10 / 1,00', '9 / 0,90', '7 / 0,70', '5 / 0,50', '6 / 0,60'], ['Profitabilitas', '0,10', '10 / 1,00', '5 / 0,50', '7 / 0,70', '1 / 0,10', '6 / 0,60'], ['Keleluasaan finansial (utang)', '0,10', '4 / 0,40', '7 / 0,70', '9 / 0,90', '5 / 0,50', '2 / 0,20'], ['Stadion & matchday', '0,05', '9 / 0,45', '8 / 0,40', '9 / 0,45', '5 / 0,25', '9 / 0,45'], ['Rekam jejak prestasi', '0,10', '10 / 1,00', '9 / 0,90', '10 / 1,00', '9 / 0,90', '9 / 0,90'], ['TOTAL SKOR TERTIMBANG', '1,00', '8,65', '7,15', '8,40', '5,55', '6,55']];
  const tbl = tableStyle(rows, { totalRow: true, hiCol: 2 }); tbl[tbl.length - 1][2].options.color = C.gold2;
  const rh = 0.31, ty = 1.95;
  s.addTable(tbl, { x: 0.7, y: ty, w: cw, colW: [3.0, 0.9, 1.61, 1.61, 1.61, 1.61, 1.61], rowH: rh });
  const y = ty + 11 * rh + 0.2, w = (cw - 0.4) / 3;
  [['Unggul 0,25 poin', 'MU 8,65 vs Barcelona 8,40. Tipis: cukup satu baris turun untuk menghapusnya.', true], ['Turun ke 7,90', 'Kalau rating manajer jatuh dari 10 ke 5 karena ganti pelatih, MU langsung di bawah Barcelona.', false], ['Butuh minimal 8,3', 'Rating yang harus dicapai pengganti Ferguson supaya MU sekadar bertahan sejajar Barcelona.', false]].forEach((it, i) => {
    const x = 0.7 + i * (w + 0.2);
    if (it[2]) redcard(s, x, y, w, 1.0); else card(s, x, y, w, 1.0);
    txt(s, it[0], x + PAD, y + 0.12, w - 2 * PAD, 0.3, { fontFace: F.x, fontSize: 12.5, color: it[2] ? C.gold2 : C.red });
    txt(s, it[1], x + PAD, y + 0.44, w - 2 * PAD, 0.5, { fontFace: F.r, fontSize: 10, color: it[2] ? C.white : C.ink, lineSpacingMultiple: 1.0 });
  });
}

// =============== 32. PRIORITY LIST MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 6  ·  PRIORITY LIST DITERAPKAN', 'ENAM ISU UNTUK DAVID GILL', null, { src: SRC_C + 'Rumusan mengikuti Thompson dkk. (2024) hlm. 118.' });
  const iss = [['Bagaimana mengganti Ferguson tanpa merusak sistemnya?', 'Gill belum memutuskan; Ferguson belum mengumumkan pensiun.'], ['Bagaimana bersaing di bursa transfer tanpa dana pemilik?', 'Utang £616 jt tidak menghambat belanja pemain ("proved groundless"), tapi MU tak dapat dana pemilik seperti City yang belanja £185 jt.'], ['Bagaimana menambal skuad setelah Ronaldo pergi?', 'Tidak ada lagi pemain MU di peringkat FIFA. Media menunggu apakah kas Ronaldo dipakai membeli Ribéry.'], ['Apakah perlu director of football untuk menopang sistem?', 'Seluruh sistem pemanduan bakat, latihan, dan taktik dibangun satu orang. Di Inggris posisi ini sering memicu konflik dengan manajer.'], ['Bagaimana menjaga pendapatan komersial kalau prestasi turun?', 'Gill: "So long as the team kept winning games … the commercial revenues … would continue to flow".'], ['Apakah pemilik tetap pasif setelah Ferguson pergi?', 'Peran pasif Glazer berjalan karena Ferguson dan Gill diberi kebebasan. Di Chelsea, campur tangan pemilik memicu kepergian Mourinho.']];
  const w = (cw - 0.25) / 2, h = 1.32;
  iss.forEach((it, i) => {
    const x = 0.7 + (i % 2) * (w + 0.25), y = top + 0.4 + Math.floor(i / 2) * (h + 0.1);
    const serious = i === 0 || i === 3;
    if (serious) redcard(s, x, y, w, h); else card(s, x, y, w, h);
    numTag(s, i + 1, x + 0.2, y + 0.42, 0.46, serious ? C.gold : C.red);
    txt(s, it[0], x + 0.85, y + 0.14, w - 1.0, 0.5, { fontFace: F.x, fontSize: 11.5, color: serious ? C.white : C.red, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.85, y + 0.64, w - 1.0, h - 0.74, { fontFace: F.r, fontSize: 10, color: serious ? C.white : C.ink, lineSpacingMultiple: 1.0 });
  });
  banner(s, 0.7, top + 3 * h + 0.75, cw, 0.7, 'HIGHLIGHT', 'Isu 1 dan 4 (merah) serius dan butuh strategi baru. Isu 2, 3, 5, 6 bisa ditangani dengan menyempurnakan strategi yang ada.', { size: 10.5 });
}

// =============== 33. THANKS ===============
{
  flush(); const s = pptx.addSlide(); pageNo += 1; s.background = { path: 'mu_cream/img/bg_cream.jpg' }; notes(s, '33');
  s.addShape(pptx.ShapeType.rect, { x: 6.9, y: 0.55, w: 5.9, h: 6.4, fill: { color: C.red }, line: { color: C.gold, width: 2 } });
  img(s, 'mu_cream/img/hero_trophies.jpg', 7.05, 0.7, 5.6, 6.1);
  tag(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', 0.7, 1.6, 6);
  txt(s, 'TERIMA KASIH', 0.7, 2.05, 6.0, 1.3, { fontFace: F.x, fontSize: 44, color: C.red, fit: false, clamp: false });
  txt(s, 'Kami membuka sesi tanya jawab dan diskusi', 0.7, 3.3, 6.0, 0.5, { fontFace: F.m, fontSize: 16, color: C.ink, clamp: false });
  s.addShape(pptx.ShapeType.rect, { x: 0.7, y: 4.3, w: 5.9, h: 1.5, fill: { color: C.red }, line: { color: C.red, width: 0 } });
  txt(s, 'KELOMPOK 4', 0.95, 4.45, 3, 0.25, { fontFace: F.s, fontSize: 10, color: C.gold2, charSpacing: 2, clamp: false });
  txt(s, 'Fitra Aidila  ·  Aulia Sisca Rahmadiyanti  ·  Bagaskoro\nImam Prayudha  ·  Tegar Awanto', 0.95, 4.75, 5.4, 0.9, { fontFace: F.s, fontSize: 12, color: C.white, lineSpacingMultiple: 1.15, clamp: false });
  txt(s, 'Strategic Management  ·  Dr. Rangga Almahendra, S.T., M.M.\nChapter 4: Thompson dkk. (2024)   |   Kasus: Manchester United, Robert M. Grant (2010)', 0.7, 6.05, 6.0, 0.8, { fontFace: F.r, fontSize: 10, color: C.ink2, lineSpacingMultiple: 1.12, clamp: false });
}

flush();
fs.writeFileSync('mu_cream/layout.json', JSON.stringify(LAYOUT));
pptx.writeFile({ fileName: 'deck6.pptx' }).then(f => console.log('wrote', f, 'slides', pageNo));
