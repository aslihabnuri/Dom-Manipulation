const pptxgen = require('pptxgenjs');
const fs = require('fs');
const NOTES = JSON.parse(fs.readFileSync('mu_assets/notes.json', 'utf8'));

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Kelompok 4';
pptx.title = 'Chapter 4 · Manchester United';
const W = 13.333, H = 7.5;

const C = {
  bg: '1B0F10', card: '27161A', card2: '32191E', red: 'C8102E', red2: '8E0B20',
  gold: 'FBE122', white: 'FFFFFF', grey: 'D9CFC7', mute: 'A08F8B', line: '46292D', black: '120A0B'
};
const F = { x: 'Poppins ExtraBold', s: 'Poppins SemiBold', m: 'Poppins Medium', r: 'Poppins', l: 'Poppins Light' };

const SRC_BOOK = 'Sumber: Thompson, Peteraf, Gamble & Strickland, Crafting & Executing Strategy, 2024 Release ISE, Chapter 4.';
const SRC_CASE = 'Sumber: Grant (2010), Case 6 "Manchester United: Preparing for Life without Ferguson".';

let pageNo = 0;
function notes(s, key) { if (key && NOTES[key]) s.addNotes(NOTES[key].replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '\n')); }

// ---------- primitives ----------
function txt(s, text, x, y, w, h, o = {}) {
  s.addText(text, Object.assign({
    x, y, w, h, fontFace: F.r, fontSize: 10, color: C.grey, margin: 0, valign: 'top', paraSpaceAfter: 0
  }, o));
}
function rect(s, x, y, w, h, fill, o = {}) {
  s.addShape(pptx.ShapeType.rect, Object.assign({ x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 } }, o));
}
function img(s, path, x, y, w, h, o = {}) { s.addImage(Object.assign({ path, x, y, w, h }, o)); }

// content page skeleton. returns top y of content area
function page(kicker, title, lede, o = {}) {
  const s = pptx.addSlide();
  pageNo += 1;
  s.background = { color: C.bg };
  let cw = W - 1.2;
  rect(s, 0.6, 0.47, 0.32, 0.06, C.red);
  txt(s, kicker, 1.02, 0.33, cw - 0.4, 0.35, { fontFace: F.s, fontSize: 9.5, color: C.red, charSpacing: 2 });
  const two = o.two === true;
  txt(s, title, 0.6, 0.72, cw, two ? 0.95 : 0.55, {
    fontFace: F.x, fontSize: o.tsize || 26, color: C.white, lineSpacingMultiple: 0.92, valign: 'top'
  });
  const ly = two ? 1.72 : 1.3;
  if (lede) txt(s, lede, 0.6, ly, cw, 0.5, { fontFace: F.r, fontSize: 11.5, color: C.grey, lineSpacingMultiple: 1.05 });
  // footer
  rect(s, 0.6, 6.98, cw, 0.01, C.line);
  txt(s, o.src || SRC_BOOK, 0.6, 7.06, cw - 1.0, 0.3, { fontFace: F.r, fontSize: 7.5, color: C.mute });
  txt(s, String(pageNo).padStart(2, '0'), 0.6 + cw - 0.8, 7.03, 0.8, 0.3, { fontFace: F.s, fontSize: 9, color: C.red, align: 'right' });
  notes(s, o.notes);
  return { s, top: lede ? ly + 0.62 : ly + 0.05, cw };
}

// dark card with optional red accent bar, heading, body
function card(s, x, y, w, h, o = {}) {
  rect(s, x, y, w, h, o.fill || C.card);
  if (o.accent !== false) rect(s, x, y, 0.06, h, o.accent || C.red);
  let cy = y + 0.16;
  if (o.tag) { txt(s, o.tag, x + 0.24, cy, w - 0.4, 0.25, { fontFace: F.s, fontSize: 8, color: o.tagColor || C.gold, charSpacing: 1.5 }); cy += 0.27; }
  if (o.head) {
    txt(s, o.head, x + 0.24, cy, w - 0.4, o.headH || 0.3, { fontFace: F.s, fontSize: o.headSize || 12, color: C.white, lineSpacingMultiple: 0.95 });
    cy += (o.headH || 0.3) + 0.06;
  }
  if (o.body) {
    txt(s, o.body, x + 0.24, cy, w - 0.4, y + h - cy - 0.12, {
      fontFace: F.r, fontSize: o.bodySize || 9.5, color: o.bodyColor || C.grey, lineSpacingMultiple: 1.08
    });
  }
}
// red callout panel with label
function callout(s, x, y, w, h, label, body, o = {}) {
  rect(s, x, y, w, h, o.fill || C.red);
  txt(s, label, x + 0.25, y + 0.14, w - 0.5, 0.25, { fontFace: F.s, fontSize: 8, color: o.labelColor || C.gold, charSpacing: 1.5 });
  txt(s, body, x + 0.25, y + 0.4, w - 0.5, h - 0.5, { fontFace: F.m, fontSize: o.size || 10, color: C.white, lineSpacingMultiple: 1.08 });
}
// big number stat
function stat(s, x, y, w, h, val, label, sub, o = {}) {
  rect(s, x, y, w, h, o.fill || C.card);
  rect(s, x, y, w, 0.06, o.bar || C.red);
  txt(s, val, x + 0.24, y + 0.2, w - 0.4, 0.55, { fontFace: F.x, fontSize: o.vsize || 26, color: o.vcolor || C.white });
  txt(s, label, x + 0.24, y + 0.8, w - 0.4, 0.3, { fontFace: F.s, fontSize: 10, color: C.gold });
  if (sub) txt(s, sub, x + 0.24, y + 1.1, w - 0.4, h - 1.2, { fontFace: F.r, fontSize: 9, color: C.grey, lineSpacingMultiple: 1.06 });
}
function bullets(items, size = 9.5, color = C.grey) {
  return items.map((t, i) => ({ text: t, options: { bullet: { indent: 12 }, breakLine: i < items.length - 1, fontFace: F.r, fontSize: size, color, paraSpaceAfter: 3 } }));
}
function label(s, text, x, y, w, color = C.gold) {
  txt(s, text, x, y, w, 0.25, { fontFace: F.s, fontSize: 8.5, color, charSpacing: 1.5 });
}
function numCircle(s, n, x, y, d = 0.5, fill = C.red) {
  s.addShape(pptx.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
  txt(s, String(n), x, y, d, d, { fontFace: F.x, fontSize: d * 24, color: C.white, align: 'center', valign: 'middle' });
}
// hand-drawn horizontal bar chart
function hbars(s, x, y, w, h, items, o = {}) {
  const labW = o.labW || 1.9, valW = 0.75;
  const n = items.length, rowH = h / n, barH = Math.min(rowH * 0.62, 0.34);
  const maxV = Math.max(...items.map(i => Math.abs(i.v)));
  const minV = Math.min(0, ...items.map(i => i.v));
  const span = maxV - minV;
  const plotW = w - labW - valW - 0.1;
  const zeroX = x + labW + (-minV / span) * plotW;
  items.forEach((it, i) => {
    const cy = y + i * rowH + (rowH - barH) / 2;
    txt(s, it.label, x, cy - 0.02, labW - 0.15, barH + 0.04, { fontFace: it.hi ? F.s : F.r, fontSize: o.fs || 9, color: it.hi ? C.white : C.grey, align: 'right', valign: 'middle' });
    const bw = Math.abs(it.v) / span * plotW;
    const bx = it.v >= 0 ? zeroX : zeroX - bw;
    rect(s, bx, cy, Math.max(bw, 0.02), barH, it.hi ? C.red : (it.color || C.line));
    const vx = it.v >= 0 ? bx + bw + 0.08 : zeroX + 0.08;
    txt(s, it.fmt || String(it.v), vx, cy - 0.02, valW, barH + 0.04, { fontFace: F.s, fontSize: o.fs || 9, color: it.hi ? C.gold : C.grey, valign: 'middle', align: 'left' });
  });
  rect(s, zeroX, y, 0.01, h, C.mute);
}
// hand-drawn vertical bar chart
function vbars(s, x, y, w, h, items, o = {}) {
  const n = items.length, slot = w / n, bw = slot * 0.62;
  const maxV = Math.max(...items.map(i => i.v));
  const labH = 0.3, valH = 0.28, plotH = h - labH - valH;
  items.forEach((it, i) => {
    const bh = it.v / maxV * plotH;
    const bx = x + i * slot + (slot - bw) / 2;
    const by = y + valH + (plotH - bh);
    rect(s, bx, by, bw, bh, it.hi ? C.red : C.line);
    txt(s, it.fmt || String(it.v), bx - 0.2, by - valH, bw + 0.4, valH, { fontFace: F.s, fontSize: 8.5, color: it.hi ? C.gold : C.grey, align: 'center', valign: 'bottom' });
    txt(s, it.label, bx - 0.2, y + h - labH + 0.05, bw + 0.4, labH, { fontFace: F.r, fontSize: 8.5, color: C.grey, align: 'center' });
  });
  rect(s, x, y + valH + plotH, w, 0.01, C.mute);
}
function tableStyle(rows, o = {}) {
  return rows.map((r, ri) => r.map((c, ci) => {
    const isHead = ri === 0, isTotal = o.totalRow && ri === rows.length - 1;
    const hiCol = o.hiCol !== undefined && ci === o.hiCol && !isHead;
    let fill = isHead ? C.red : (ri % 2 ? C.card : C.card2);
    if (isTotal) fill = C.black;
    if (hiCol && !isTotal) fill = '3E1620';
    return {
      text: c, options: {
        fill: { color: fill }, color: isHead ? C.white : (isTotal || hiCol ? C.white : C.grey),
        fontFace: isHead || isTotal || ci === 0 ? F.s : F.r, fontSize: o.fs || 8.5,
        align: ci === 0 || (o.leftCols && o.leftCols.includes(ci)) ? 'left' : 'center', valign: 'middle',
        margin: [3, 5, 3, 5], border: { type: 'solid', color: C.bg, pt: 0.75 }
      }
    };
  }));
}
function fullBleed(image, o = {}) {
  const s = pptx.addSlide();
  pageNo += 1;
  s.background = { path: image };
  img(s, 'mu_assets/grad_left.png', 0, 0, W, H);
  notes(s, o.notes);
  return s;
}

// =============== 1. TITLE ===============
{
  const s = fullBleed('mu_assets/hero.jpg', { notes: '1' });
  rect(s, 0.7, 0.75, 0.4, 0.07, C.gold);
  txt(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', 1.25, 0.6, 7, 0.35, { fontFace: F.s, fontSize: 11, color: C.gold, charSpacing: 3 });
  txt(s, "EVALUATING A COMPANY'S RESOURCES, CAPABILITIES, AND COMPETITIVENESS", 0.7, 1.15, 7.5, 2.4, { fontFace: F.x, fontSize: 36, color: C.white, lineSpacingMultiple: 0.92 });
  txt(s, 'Thompson  ·  Peteraf  ·  Gamble  ·  Strickland      Crafting & Executing Strategy, 2024 Release ISE', 0.7, 3.62, 7.5, 0.35, { fontFace: F.r, fontSize: 10.5, color: C.grey });
  rect(s, 0.7, 4.2, 7.5, 1.45, C.red);
  txt(s, 'STUDI KASUS', 0.95, 4.35, 3, 0.25, { fontFace: F.s, fontSize: 8, color: C.gold, charSpacing: 2 });
  txt(s, 'Manchester United: Preparing for Life without Ferguson', 0.95, 4.62, 7.0, 0.5, { fontFace: F.x, fontSize: 17, color: C.white });
  txt(s, 'Robert M. Grant (2010)   ·   setting Juli 2009', 0.95, 5.18, 7.0, 0.3, { fontFace: F.r, fontSize: 10.5, color: C.white });
  txt(s, 'DOSEN PENGAMPU', 0.7, 5.95, 3, 0.25, { fontFace: F.s, fontSize: 8, color: C.gold, charSpacing: 2 });
  txt(s, 'Dr. Rangga Almahendra, S.T., M.M.', 0.7, 6.2, 4, 0.3, { fontFace: F.m, fontSize: 11, color: C.white });
  txt(s, 'KELOMPOK 4', 4.3, 5.95, 3, 0.25, { fontFace: F.s, fontSize: 8, color: C.gold, charSpacing: 2 });
  txt(s, 'Fitra Aidila  ·  Aulia Sisca Rahmadiyanti  ·  Bagaskoro\nImam Prayudha  ·  Tegar Awanto', 4.3, 6.2, 5.8, 0.7, { fontFace: F.m, fontSize: 11, color: C.white, lineSpacingMultiple: 1.15 });
}

// =============== 2. AGENDA ===============
{
  const { s, top } = page('ALUR PRESENTASI', 'AGENDA', 'Teori Chapter 4 dibahas lebih dulu, lalu diterapkan pada kasus Manchester United. Urutannya sengaja sama, supaya terlihat framework mana dipakai untuk menjawab apa.', { notes: '2' });
  const items = [
    ['01', 'Framework Chapter 4', 'SLIDE 3 – 17', 'Enam pertanyaan analisis internal dan alat untuk menjawabnya: Table 4.1, SWOT, VRIN Test, Value Chain, Competitive Strength Assessment, Priority List.'],
    ['02', 'Penerapan pada Manchester United', 'SLIDE 18 – 31', 'Kinerja, SWOT, resource dan capability, VRIN Test, Value Chain, Benchmarking, dan Competitive Strength Assessment MU pada Juli 2009.'],
    ['03', 'Priority List', 'SLIDE 32', 'Enam isu yang harus ditangani David Gill, ditulis sebagai pertanyaan sesuai aturan buku.'],
    ['04', 'Diskusi', 'SLIDE 33', 'Tanya jawab dan diskusi kelas.'],
  ];
  const lw = 6.9, rh = 1.05;
  items.forEach((it, i) => {
    const y = top + i * (rh + 0.12);
    rect(s, 0.6, y, lw, rh, i % 2 ? C.card2 : C.card);
    rect(s, 0.6, y, 0.06, rh, i === 0 ? C.gold : C.red);
    txt(s, it[0], 0.85, y + 0.12, 1.1, 0.8, { fontFace: F.x, fontSize: 30, color: i === 0 ? C.gold : C.red, valign: 'middle' });
    txt(s, it[1], 2.0, y + 0.13, lw - 2.2, 0.3, { fontFace: F.s, fontSize: 12.5, color: C.white });
    txt(s, it[2], 2.0, y + 0.43, 2.5, 0.22, { fontFace: F.s, fontSize: 7.5, color: C.gold, charSpacing: 1.5 });
    txt(s, it[3], 2.0, y + 0.64, lw - 2.2, 0.42, { fontFace: F.r, fontSize: 8.5, color: C.grey, lineSpacingMultiple: 1.04 });
  });
  const ix = 0.6 + lw + 0.3, iw = W - 0.6 - ix, ih = iw / 1.5;
  img(s, 'mu_assets/manager.jpg', ix, top, iw, ih);
  rect(s, ix, top + ih, iw, 0.06, C.red);
  txt(s, 'Juli 2009. Ferguson masih di pinggir lapangan. Pertanyaannya: aset mana yang milik klub, dan aset mana yang milik satu orang?', ix, top + ih + 0.18, iw, 0.7, { fontFace: F.r, fontSize: 9, color: C.grey, lineSpacingMultiple: 1.08 });
}

// =============== 3. ENAM PERTANYAAN ===============
{
  const { s, top, cw } = page('BAGIAN A', 'ENAM PERTANYAAN', 'Chapter 4 bukan kumpulan alat yang berdiri sendiri. Isinya satu alur pemeriksaan, disusun sebagai enam pertanyaan berurutan. Jawaban pertanyaan sebelumnya jadi bahan pertanyaan berikutnya.', { notes: '3' });
  const ph = 4.32, pw = ph * 768 / 1376;
  img(s, 'mu_assets/strip.jpg', W - 0.6 - pw, top, pw, ph);
  const q = [
    ['Seberapa baik strategi yang sekarang bekerja?', 'Performance indicators + Table 4.1'],
    ['Apa kekuatan dan kelemahan kita, dihadapkan pada peluang dan ancaman?', 'SWOT Analysis'],
    ['Resource dan capability apa yang paling penting, dan apakah tahan lama?', 'Table 4.3 + VRIN Test'],
    ['Bagaimana aktivitas value chain memengaruhi biaya dan nilai pelanggan?', 'Value Chain + Benchmarking'],
    ['Kita lebih kuat atau lebih lemah dari pesaing utama?', 'Competitive Strength Assessment (Table 4.4)'],
    ['Isu strategis apa yang harus ditangani lebih dulu?', 'Priority List'],
  ];
  const cw3 = cw - pw - 0.3;
  const w = (cw3 - 0.5) / 3, h = 2.05;
  q.forEach((it, i) => {
    const x = 0.6 + (i % 3) * (w + 0.25), y = top + Math.floor(i / 3) * (h + 0.22);
    rect(s, x, y, w, h, C.card);
    rect(s, x, y, w, 0.06, i === 5 ? C.gold : C.red);
    txt(s, String(i + 1), x + 0.22, y + 0.12, 1, 0.65, { fontFace: F.x, fontSize: 30, color: C.red });
    txt(s, it[0], x + 0.22, y + 0.8, w - 0.4, 0.8, { fontFace: F.s, fontSize: 11, color: C.white, lineSpacingMultiple: 1.0 });
    txt(s, it[1], x + 0.22, y + h - 0.42, w - 0.4, 0.3, { fontFace: F.m, fontSize: 8.5, color: C.gold });
  });
}

// =============== 4. FIGURE 4.1 ===============
{
  const { s, top } = page('PERTANYAAN 1', 'KENALI DULU STRATEGI YANG SEDANG DIJALANKAN', 'Sebelum menilai kinerja, pahami dulu komponen strategi perusahaan seperti dipetakan pada Figure 4.1.', { notes: '4', src: 'Sumber: Thompson, Peteraf, Gamble & Strickland (2024), Figure 4.1, hlm. 90.' });
  const fw = 6.55, fh = fw / 1.359;
  rect(s, 0.6, top, fw + 0.3, fh + 0.3, C.white);
  img(s, 'mu_assets/fig4_1.png', 0.75, top + 0.15, fw, fh);
  const x = 7.75, w = 4.95;
  card(s, x, top, w, 1.45, { fill: C.black, accent: C.red, tag: 'CONTOH: AIRASIA', tagColor: C.red, body: 'Strategi biaya rendah terlihat konsisten di setiap fungsi: satu tipe pesawat (keluarga A320) di operasi dan penjualan tiket langsung secara online di pemasaran.', bodySize: 10, bodyColor: C.white });
  card(s, x, top + 1.65, w, 1.65, { head: 'Setelah strategi dikenali', body: 'Kinerjanya diukur lewat tren penjualan dan laba, harga saham, kekuatan keuangan, retensi pelanggan, pelanggan baru, dan perbaikan proses internal.', bodySize: 10 });
  callout(s, x, top + 3.5, w, 1.3, 'CARA PAKAI', 'Isi setiap kotak dengan tindakan nyata perusahaan, lalu periksa apakah semuanya saling mendukung.');
}

// =============== 5. TABLE 4.1 ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  TABLE 4.1', 'FINANCIAL RATIOS: ALAT UKURNYA', 'Penilaian tadi perlu bukti angka. Buku mengelompokkan rasio ke dalam empat kategori, plus satu kelompok ukuran tambahan.', { notes: '6' });
  const g = [
    ['Profitability', 'Seberapa besar laba yang dihasilkan', ['Gross profit margin', 'Operating profit margin', 'Net profit margin', 'Total return on assets', 'Net return on assets (ROA)', 'Return on equity (ROE)', 'Return on invested capital']],
    ['Liquidity', 'Sanggup bayar kewajiban jangka pendek?', ['Current ratio', 'Working capital']],
    ['Leverage', 'Seberapa berat beban utangnya', ['Total debt-to-assets', 'Long-term debt-to-capital', 'Debt-to-equity', 'Long-term debt-to-equity', 'Times-interest-earned']],
    ['Activity', 'Seberapa efisien aset dikelola', ['Days of inventory', 'Inventory turnover', 'Average collection period']],
  ];
  const w = (cw - 0.75) / 4, h = 3.3;
  g.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.25);
    rect(s, x, top, w, h, C.card);
    rect(s, x, top, w, 0.06, C.red);
    txt(s, it[0], x + 0.22, top + 0.2, w - 0.4, 0.35, { fontFace: F.x, fontSize: 15, color: C.white });
    txt(s, it[1], x + 0.22, top + 0.58, w - 0.4, 0.45, { fontFace: F.r, fontSize: 9, color: C.gold, lineSpacingMultiple: 1.05 });
    rect(s, x + 0.22, top + 1.08, w - 0.44, 0.01, C.line);
    txt(s, bullets(it[2], 9.5, C.grey), x + 0.22, top + 1.2, w - 0.4, h - 1.3, { valign: 'top' });
  });
  callout(s, 0.6, top + 3.5, cw, 0.95, 'UKURAN TAMBAHAN', 'Dividend yield, price-to-earnings ratio, dividend payout ratio, internal cash flow, dan free cash flow. Free cash flow paling penting, karena menunjukkan sisa kas untuk membiayai langkah strategis baru.', { fill: C.card2, size: 10 });
}

// =============== 6. SWOT ===============
{
  const { s, top } = page('PERTANYAAN 2', 'SWOT ANALYSIS: KENAPA STRATEGI BERHASIL ATAU GAGAL', 'Q1 memberi tahu apakah strategi bekerja, tapi tidak kenapa. SWOT adalah alat paling sederhana untuk mencari sebabnya.', { notes: '7' });
  const sw = [
    ['S', 'Strengths', 'Yang perusahaan kuasai atau miliki, yang membuatnya lebih mampu bersaing', C.red],
    ['W', 'Weaknesses', 'Yang tidak dimiliki atau dikerjakan kurang baik dibanding pesaing', C.card],
    ['O', 'Opportunities', 'Peluang pasar: apa yang bisa diambil dari luar', C.card],
    ['T', 'Threats', 'Ancaman dari luar yang bisa menggerus laba dan posisi', C.red],
  ];
  const w = 3.1, h = 1.62;
  sw.forEach((it, i) => {
    const x = 0.6 + (i % 2) * (w + 0.2), y = top + Math.floor(i / 2) * (h + 0.2);
    rect(s, x, y, w, h, it[3]);
    txt(s, it[0], x + 0.22, y + 0.1, 0.9, 0.9, { fontFace: F.x, fontSize: 40, color: it[3] === C.red ? C.gold : C.red });
    txt(s, it[1], x + 1.1, y + 0.25, w - 1.3, 0.35, { fontFace: F.s, fontSize: 13, color: C.white });
    txt(s, it[2], x + 1.1, y + 0.62, w - 1.3, 0.95, { fontFace: F.r, fontSize: 9, color: it[3] === C.red ? C.white : C.grey, lineSpacingMultiple: 1.06 });
  });
  const x = 7.3, cwid = 5.4;
  label(s, 'CARA MEMBACANYA', x, top - 0.02, 4);
  card(s, x, top + 0.3, cwid, 0.78, { head: 'Nama lain SWOT', body: 'Situational Analysis, analisis situasi.', headSize: 11, bodySize: 9.5 });
  card(s, x, top + 1.2, cwid, 1.0, { head: 'Neraca strategis', body: 'Kekuatan = aset bersaing. Kelemahan = kewajiban bersaing. Idealnya asetnya jauh lebih berat.', headSize: 11, bodySize: 9.5 });
  card(s, x, top + 2.32, cwid, 1.12, { head: 'Empat pertanyaan pemandu', body: 'Apakah kekuatan cukup menutup kelemahan? Apakah strategi sudah bertumpu pada kekuatan itu? Apakah kekuatan kita melampaui pesaing? Apakah strategi berhasil menangkal ancaman?', headSize: 11, bodySize: 9 });
  callout(s, 0.6, top + 3.66, 12.1, 0.85, 'KENAPA SWOT POPULER', 'Mudah dipakai, dan bisa dipakai dua arah: menilai strategi yang sedang berjalan, dan menyusun strategi baru dari nol. Dipakai perusahaan besar sampai sekolah dan lembaga nirlaba.', { fill: C.card2, size: 10 });
}

// =============== 7. COMPETENCE LADDER ===============
{
  const { s, top, cw } = page('PERTANYAAN 2  ·  KONSEP INTI', 'COMPETENCE, DISTINCTIVE COMPETENCE, CORE COMPETENCE', 'Buku memakai tiga tingkatan yang berbeda. Jangan disamakan: hanya tingkat ketiga yang benar-benar berharga.', { notes: '8' });
  const steps = [
    ['1', 'Competence', 'Aktivitas yang sudah dikuasai perusahaan, dikerjakan konsisten baik dan dengan biaya wajar.', 'Kemampuan biasa. Banyak perusahaan punya.'],
    ['2', 'Distinctive Competence', 'Kemampuan yang membuat perusahaan mengerjakan aktivitas itu LEBIH BAIK dari pesaingnya.', 'Sudah membedakan, tapi belum tentu inti strategi.'],
    ['3', 'Core Competence', 'Aktivitas yang dikuasai dengan baik DAN berada di jantung strategi perusahaan.', 'Paling berharga. Sering jadi mesin pertumbuhan.'],
  ];
  const w = (cw - 0.5) / 3, base = top + 3.2;
  steps.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.25), h = 2.2 + i * 0.5, y = base - h;
    rect(s, x, y, w, h, i === 2 ? C.red : C.card);
    rect(s, x, y, w, 0.06, i === 2 ? C.gold : C.red);
    txt(s, it[0], x + 0.22, y + 0.12, 1, 0.7, { fontFace: F.x, fontSize: 34, color: i === 2 ? C.gold : C.red });
    txt(s, it[1], x + 0.22, y + 0.85, w - 0.4, 0.35, { fontFace: F.s, fontSize: 13, color: C.white });
    txt(s, it[2], x + 0.22, y + 1.22, w - 0.4, 0.75, { fontFace: F.r, fontSize: 9.5, color: i === 2 ? C.white : C.grey, lineSpacingMultiple: 1.06 });
    txt(s, it[3], x + 0.22, y + h - 0.42, w - 0.4, 0.35, { fontFace: F.m, fontSize: 8.5, color: i === 2 ? C.gold : C.gold });
  });
  label(s, 'CONTOH DARI BUKU', 0.6, base + 0.2, 4);
  const ex = [['Procter & Gamble', 'Core competence di manajemen merek, melahirkan Tide, Crest, Pampers, Olay, Febreze.'], ['Nike', 'Core competence di desain dan pemasaran sepatu serta apparel olahraga.'], ['Kellogg', 'Core competence di pengembangan, produksi, dan pemasaran sereal sarapan.']];
  ex.forEach((it, i) => card(s, 0.6 + i * (w + 0.25), base + 0.5, w, 0.95, { head: it[0], body: it[1], headSize: 11, bodySize: 9 }));
}

// =============== 8. FIGURE 4.2 ===============
{
  const { s, top } = page('PERTANYAAN 2  ·  FIGURE 4.2', 'SWOT BUKAN BIKIN EMPAT DAFTAR', 'Nilai SWOT ada pada kesimpulan yang ditarik dari daftarnya, bukan pada daftarnya. Buku menggambarkannya sebagai tiga langkah.', { notes: '9' });
  const st = [
    ['Identifikasi', 'Susun keempat daftar berdasarkan bukti, bukan opini. Table 4.2 di buku memberi contoh isi masing-masing.'],
    ['Tarik kesimpulan', 'Dua pertanyaan: apa sebab berhasil atau gagalnya strategi? Sisi mana dari situasi perusahaan yang menarik, sisi mana yang tidak?'],
    ['Terjemahkan jadi tindakan', 'Ubah kesimpulan itu menjadi langkah strategis yang konkret.'],
  ];
  st.forEach((it, i) => {
    const y = top + i * 1.2;
    rect(s, 0.6, y, 5.6, 1.05, C.card);
    numCircle(s, i + 1, 0.8, y + 0.27, 0.5);
    txt(s, it[0], 1.5, y + 0.15, 4.5, 0.3, { fontFace: F.s, fontSize: 12, color: C.white });
    txt(s, it[1], 1.5, y + 0.45, 4.5, 0.58, { fontFace: F.r, fontSize: 9, color: C.grey, lineSpacingMultiple: 1.06 });
  });
  const x = 6.5, w = 6.2;
  rect(s, x, top, w, 3.45, C.card2);
  rect(s, x, top, 0.06, 3.45, C.gold);
  txt(s, 'ENAM TINDAKAN YANG BISA LAHIR DARI LANGKAH 3', x + 0.28, top + 0.18, w - 0.5, 0.3, { fontFace: F.s, fontSize: 9, color: C.gold, charSpacing: 1.2 });
  txt(s, bullets(['Jadikan kekuatan sebagai fondasi strategi', 'Perbaiki kelemahan yang menghambat strategi', 'Pakai kekuatan untuk meredam ancaman besar', 'Kejar peluang yang paling cocok dengan kekuatan', 'Benahi kelemahan yang menghalangi peluang penting', 'Tutup kelemahan yang membuat rentan pada ancaman'], 10.5, C.white), x + 0.28, top + 0.6, w - 0.5, 2.8, { lineSpacingMultiple: 1.1 });
  callout(s, 0.6, top + 3.7, 12.1, 0.8, 'KETERBATASAN SWOT, DIAKUI BUKUNYA SENDIRI', 'Kekuatannya ada pada kesederhanaan, dan itu juga batasnya. Untuk pemahaman yang lebih dalam dibutuhkan alat yang lebih canggih, yaitu Q3 sampai Q5 berikutnya.', { size: 10 });
}

// =============== 9. RESOURCE VS CAPABILITY + TABLE 4.3 ===============
{
  const { s, top, cw } = page('PERTANYAAN 3', 'RESOURCE DAN CAPABILITY: DUA HAL BERBEDA', 'Resource itu sesuatu yang perusahaan PUNYA. Capability itu sesuatu yang perusahaan BISA KERJAKAN. Capability dibangun dengan mengerahkan resource.', { notes: '10' });
  const hw = (cw - 0.25) / 2;
  card(s, 0.6, top, hw, 1.05, { head: 'Resource', body: 'Aset bersaing yang dimiliki atau dikendalikan perusahaan. Contoh: merek, pabrik, kas, paten, tim R&D.', headSize: 13, bodySize: 9.5, accent: C.red });
  card(s, 0.6 + hw + 0.25, top, hw, 1.05, { head: 'Capability', body: 'Kemampuan perusahaan mengerjakan suatu aktivitas internal dengan baik. Disebut juga competence. Contoh: kemampuan Starbucks mengelola dan melatih karyawan.', headSize: 13, bodySize: 9.5, accent: C.gold });
  const ty = top + 1.3;
  label(s, 'TABLE 4.3  ·  TIPE RESOURCE', 0.6, ty, 6);
  const tan = [['Fisik', 'tanah, pabrik, peralatan, lokasi, sumber daya alam'], ['Finansial', 'kas, surat berharga, peringkat kredit'], ['Teknologi', 'paten, hak cipta, teknologi produksi dan inovasi'], ['Organisasional', 'sistem IT, sistem kendali, struktur organisasi']];
  const intan = [['Human assets', 'pendidikan, pengalaman, bakat, pengetahuan'], ['Merek & reputasi', 'nama merek, citra, loyalitas, reputasi mutu'], ['Relasi', 'aliansi, joint venture, jaringan dealer'], ['Budaya & insentif', 'norma perilaku, keyakinan bersama, kompensasi']];
  [['Tangible', 'bisa disentuh atau dihitung', tan, C.red], ['Intangible', 'tidak berwujud', intan, C.gold]].forEach((col, ci) => {
    const x = 0.6 + ci * (hw + 0.25), y0 = ty + 0.32;
    rect(s, x, y0, hw, 0.5, col[3]);
    txt(s, col[0], x + 0.24, y0 + 0.1, 2, 0.3, { fontFace: F.x, fontSize: 13, color: ci ? C.bg : C.white });
    txt(s, col[1], x + 2.0, y0 + 0.14, hw - 2.2, 0.3, { fontFace: F.r, fontSize: 9, color: ci ? C.bg : C.white });
    col[2].forEach((r, ri) => {
      const y = y0 + 0.5 + ri * 0.66;
      rect(s, x, y, hw, 0.62, ri % 2 ? C.card2 : C.card);
      txt(s, r[0], x + 0.24, y + 0.1, 1.9, 0.4, { fontFace: F.s, fontSize: 10, color: C.white, valign: 'middle' });
      txt(s, r[1], x + 2.1, y + 0.1, hw - 2.3, 0.45, { fontFace: F.r, fontSize: 9, color: C.grey, valign: 'middle', lineSpacingMultiple: 1.04 });
    });
  });
}

// =============== 10. FINDING CAPABILITIES ===============
{
  const { s, top } = page('PERTANYAAN 3  ·  LANJUTAN', 'CARA MENEMUKAN CAPABILITY PERUSAHAAN', 'Capability lebih sulit ditemukan daripada resource, karena wujudnya tidak kelihatan. Buku memberi dua cara.', { notes: '11' });
  const cw = 9.6, hw = (cw - 0.25) / 2;
  img(s, 'mu_assets/trophy_icon.jpg', 0.6 + cw + 0.25, top + 0.55, 2.35, 2.35);
  txt(s, 'Capability yang lolos semua saringan adalah yang membawa gelar. Alat ujinya di slide berikutnya: VRIN Test.', 0.6 + cw + 0.25, top + 3.05, 2.35, 1.3, { fontFace: F.r, fontSize: 8.5, color: C.mute, lineSpacingMultiple: 1.08, align: 'center' });
  card(s, 0.6, top, hw, 1.7, { tag: 'CARA 1', head: 'Berangkat dari daftar resource', body: 'Lihat daftar resource, lalu tanya: kemampuan apa yang mungkin tumbuh dari sini? Armada truk dan pusat distribusi otomatis menandakan kemampuan logistik yang matang.', headSize: 12, bodySize: 9.5 });
  card(s, 0.6 + hw + 0.25, top, hw, 1.7, { tag: 'CARA 2', head: 'Berangkat dari fungsi perusahaan', body: 'Telusuri tiap fungsi. Injection molding dan metal stamping di produksi; direct selling dan database marketing di penjualan; riset dasar dan pengembangan produk baru di R&D.', headSize: 12, bodySize: 9.5 });
  card(s, 0.6, top + 1.9, cw, 1.15, { head: 'Masalahnya: capability terpenting justru lintas fungsi', body: 'Cara 2 gagal menangkap kemampuan yang lahir dari kerja sama antarbagian. Kemampuan desain Warby Parker bukan cuma karena desainernya, tapi juga riset pasar, rekayasa, dan relasi dengan pemasok serta pabrik.', headSize: 12, bodySize: 9.5, accent: C.gold });
  callout(s, 0.6, top + 3.25, cw, 1.3, 'RESOURCE BUNDLE', 'Kumpulan aset bersaing yang saling terkait erat di sekitar satu atau beberapa kemampuan lintas fungsi. Bundle bisa lolos VRIN Test meski komponen-komponennya sendiri tidak. Paket Nike (keahlian styling, riset pasar, endorsement atlet, nama merek, kecakapan manajerial) membuatnya nomor satu di sepatu olahraga lebih dari 20 tahun.', { size: 10 });
}

// =============== 11. VRIN ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  FRAMEWORK INTI', 'VRIN TEST: EMPAT SARINGAN', 'Punya resource saja belum berarti unggul. VRIN Test menguji apakah sebuah resource atau capability benar-benar memberi keunggulan, dan apakah keunggulan itu bisa bertahan.', { notes: '12' });
  const v = [
    ['V', 'Valuable', 'Bernilai untuk bersaing?', 'Harus langsung menopang strategi dan membuat perusahaan lebih efektif bersaing. Google Wallet gagal meski memakai resource teknologi yang membuat Google nomor satu di mesin pencari.'],
    ['R', 'Rare', 'Langka, tidak dimiliki pesaing?', 'Kalau semua pesaing punya, itu syarat ikut bermain, bukan pembeda. Semua produsen sereal punya kemampuan pemasaran; kekuatan merek Oreo tidak umum.'],
    ['I', 'Inimitable', 'Sulit ditiru?', 'Sulit ditiru kalau unik, harus dibangun bertahun-tahun, butuh biaya sangat besar, atau melibatkan social complexity dan causal ambiguity.'],
    ['N', 'Nonsubstitutable', 'Pesaing tak punya jalan lain?', 'Pesaing tidak meniru, tapi memakai resource JENIS LAIN untuk hasil yang sama. Keunggulan otomasi bisa dibatalkan pesaing yang memakai tenaga kerja murah di luar negeri.'],
  ];
  const w = (cw - 0.75) / 4, h = 3.3;
  v.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.25);
    rect(s, x, top, w, h, i < 2 ? C.card : C.card2);
    rect(s, x, top, w, 0.06, i < 2 ? C.red : C.gold);
    txt(s, it[0], x + 0.22, top + 0.1, 1.2, 0.85, { fontFace: F.x, fontSize: 44, color: i < 2 ? C.red : C.gold });
    txt(s, it[1], x + 0.22, top + 1.0, w - 0.4, 0.32, { fontFace: F.s, fontSize: 13, color: C.white });
    txt(s, it[2], x + 0.22, top + 1.32, w - 0.4, 0.3, { fontFace: F.m, fontSize: 9, color: C.gold });
    txt(s, it[3], x + 0.22, top + 1.68, w - 0.4, h - 1.75, { fontFace: F.r, fontSize: 9, color: C.grey, lineSpacingMultiple: 1.06 });
  });
  const hw = (cw - 0.25) / 2;
  callout(s, 0.6, top + 3.5, hw, 0.95, 'V + R', 'Menjawab apakah resource bisa MENCIPTAKAN keunggulan bersaing.', { size: 10 });
  callout(s, 0.6 + hw + 0.25, top + 3.5, hw, 0.95, 'I + N', 'Menjawab apakah keunggulan itu BISA BERTAHAN menghadapi serangan pesaing.', { fill: C.card2, size: 10 });
}

// =============== 12. DYNAMIC CAPABILITY ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  LANJUTAN', 'RESOURCE HARUS DIKELOLA SECARA DINAMIS', 'VRIN Test menguji serangan dari pesaing. Tapi resource juga bisa menyusut, bahkan hilang, dari dalam perusahaan sendiri.', { notes: '13' });
  const t = [['Pesaing menyusul', 'Yang awalnya tidak bisa meniru, lama-lama menemukan pengganti yang makin baik.'], ['Aset menyusut sendiri', 'Resource bisa terdepresiasi seperti aset lain kalau dibiarkan tanpa perhatian.'], ['Pasar berubah', 'Perubahan teknologi, selera pelanggan, atau jalur distribusi bisa mengubah aset strategis "dari berlian jadi karat".']];
  const w = (cw - 0.5) / 3;
  t.forEach((it, i) => card(s, 0.6 + i * (w + 0.25), top, w, 1.35, { head: it[0], body: it[1], headSize: 12, bodySize: 9.5 }));
  const y = top + 1.6;
  rect(s, 0.6, y, 7.4, 2.9, C.red);
  txt(s, 'DYNAMIC CAPABILITY', 0.85, y + 0.18, 5, 0.3, { fontFace: F.s, fontSize: 9, color: C.gold, charSpacing: 2 });
  txt(s, 'Kemampuan yang terus berjalan untuk memperbaiki, memperdalam, atau menambah resource dan capability yang sudah ada.', 0.85, y + 0.5, 6.9, 0.75, { fontFace: F.s, fontSize: 13, color: C.white, lineSpacingMultiple: 1.02 });
  txt(s, 'DUA BENTUKNYA', 0.85, y + 1.35, 5, 0.25, { fontFace: F.s, fontSize: 8, color: C.gold, charSpacing: 1.5 });
  txt(s, bullets(['Memperbaiki yang ada sedikit demi sedikit. Toyota terus menyempurnakan mesin hibrida dan Toyota Production System.', 'Menambah yang baru lewat aliansi atau akuisisi. GM bermitra dengan LG dan mendahului Tesla meluncurkan Chevy Bolt EV.'], 10, C.white), 0.85, y + 1.62, 6.9, 1.2, { lineSpacingMultiple: 1.06 });
  card(s, 8.25, y, 4.45, 2.9, { head: 'Inti dynamic capability', body: 'Ketika kegiatan memperbarui aset dilakukan terus-menerus sampai menjadi rutinitas manajemen, kemampuan memperbarui itu sendiri berubah menjadi sebuah capability. Di titik itulah ia disebut dynamic capability.', headSize: 12, bodySize: 10, accent: C.gold });
}

// =============== 13. VALUE CHAIN FIG 4.3 ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  FIGURE 4.3', 'VALUE CHAIN PERUSAHAAN', 'Setiap bisnis adalah kumpulan aktivitas. Value chain memecah perusahaan menjadi aktivitas-aktivitas itu, supaya biaya dan nilai bisa dilacak satu per satu.', { notes: '14' });
  label(s, 'PRIMARY ACTIVITIES  ·  aktivitas utama pencipta nilai', 0.6, top, 8);
  const p = [['Supply Chain Management', 'Membeli, menerima, menyimpan, dan menyalurkan input'], ['Operations', 'Mengubah input jadi produk jadi'], ['Distribution', 'Menyimpan dan mengirim ke pembeli'], ['Sales & Marketing', 'Tenaga jual, iklan, promosi, dukungan dealer'], ['Service', 'Pemasangan, perbaikan, suku cadang, layanan pelanggan']];
  const mw = 1.5, w = (cw - mw - 0.15 * 5) / 5, y = top + 0.32, h = 1.55;
  p.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.15);
    rect(s, x, y, w, h, C.card);
    rect(s, x, y, w, 0.06, C.red);
    txt(s, it[0], x + 0.15, y + 0.15, w - 0.3, 0.55, { fontFace: F.s, fontSize: 10.5, color: C.white, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.15, y + 0.75, w - 0.3, 0.75, { fontFace: F.r, fontSize: 8.5, color: C.grey, lineSpacingMultiple: 1.05 });
  });
  const mx = 0.6 + 5 * (w + 0.15);
  rect(s, mx, y, mw, h, C.red);
  txt(s, 'Profit Margin', mx + 0.12, y + 0.2, mw - 0.24, 0.55, { fontFace: F.s, fontSize: 11, color: C.white, align: 'center', lineSpacingMultiple: 0.98 });
  txt(s, 'P − C', mx + 0.12, y + 0.8, mw - 0.24, 0.5, { fontFace: F.x, fontSize: 20, color: C.gold, align: 'center' });
  const y2 = y + h + 0.25;
  label(s, 'SUPPORT ACTIVITIES  ·  aktivitas pendukung', 0.6, y2, 8);
  const sp = [['Product R&D, Technology & Systems Development', 'Riset produk dan proses, desain, otomasi'], ['Human Resource Management', 'Rekrutmen, pelatihan, kompensasi'], ['General Administration', 'Akuntansi, keuangan, hukum, sistem informasi']];
  const sw = (cw - 0.5) / 3;
  sp.forEach((it, i) => {
    const x = 0.6 + i * (sw + 0.25);
    rect(s, x, y2 + 0.32, sw, 0.95, C.card2);
    rect(s, x, y2 + 0.32, 0.06, 0.95, C.gold);
    txt(s, it[0], x + 0.25, y2 + 0.44, sw - 0.4, 0.32, { fontFace: F.s, fontSize: 10.5, color: C.white });
    txt(s, it[1], x + 0.25, y2 + 0.8, sw - 0.4, 0.4, { fontFace: F.r, fontSize: 9, color: C.grey });
  });
  callout(s, 0.6, y2 + 1.5, cw, 0.9, 'TIGA SELISIH YANG HARUS DIBEDAKAN', 'V − P = nilai yang diterima pelanggan (customer value proposition).   P − C = margin laba perusahaan.   V − C = Total Economic Value, seluruh nilai ekonomi yang diciptakan perusahaan.', { size: 10 });
}

// =============== 14. VALUE CHAIN SYSTEM + BENCHMARKING ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  FIGURE 4.4', 'VALUE CHAIN SYSTEM DAN BENCHMARKING', 'Biaya dan mutu yang sampai ke pembeli tidak hanya ditentukan perusahaan sendiri, tapi oleh seluruh rantai dari pemasok sampai penjual akhir.', { notes: '15' });
  const ch = [['Value chain PEMASOK', 'Biaya dan mutu input yang masuk'], ['Value chain PERUSAHAAN', 'Aktivitas internal sendiri'], ['Value chain MITRA HILIR', 'Distributor, dealer, mitra strategis'], ['PEMBELI / PENGGUNA AKHIR', 'Nilai yang akhirnya dirasakan']];
  const w = (cw - 0.9) / 4;
  ch.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.3);
    rect(s, x, top, w, 1.0, i === 3 ? C.red : C.card);
    txt(s, it[0], x + 0.2, top + 0.14, w - 0.35, 0.3, { fontFace: F.s, fontSize: 10.5, color: C.white });
    txt(s, it[1], x + 0.2, top + 0.5, w - 0.35, 0.45, { fontFace: F.r, fontSize: 8.5, color: i === 3 ? C.white : C.grey });
    if (i < 3) s.addShape(pptx.ShapeType.triangle, { x: x + w + 0.07, y: top + 0.42, w: 0.16, h: 0.18, rotate: 90, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  });
  const y = top + 1.22, lw = 5.6;
  rect(s, 0.6, y, lw, 2.55, C.card);
  rect(s, 0.6, y, 0.06, 2.55, C.red);
  txt(s, 'Benchmarking', 0.88, y + 0.15, lw - 0.5, 0.35, { fontFace: F.x, fontSize: 14, color: C.white });
  txt(s, 'Membandingkan cara perusahaan lain mengerjakan aktivitas yang sama, lalu menirukan cara terbaiknya. Bisa dengan pesaing di industri yang sama, bisa juga dengan industri lain sama sekali.', 0.88, y + 0.55, lw - 0.5, 0.95, { fontFace: F.r, fontSize: 9.5, color: C.grey, lineSpacingMultiple: 1.06 });
  txt(s, [{ text: 'Best practice ', options: { fontFace: F.s, color: C.gold } }, { text: '= cara mengerjakan suatu aktivitas yang terbukti konsisten memberi hasil lebih baik dibanding cara lain. Harus sudah dibuktikan minimal oleh satu perusahaan.', options: { fontFace: F.r, color: C.grey } }], 0.88, y + 1.55, lw - 0.5, 0.95, { fontSize: 9.5, lineSpacingMultiple: 1.06 });
  const x2 = 0.6 + lw + 0.25, w2 = cw - lw - 0.25;
  label(s, 'TIGA CONTOH YANG TERKENAL', x2, y - 0.02, 4);
  const ex = [['Xerox', 'Pelopornya. Tidak membatasi diri pada pesaing mesin kantor, tapi ke perusahaan mana pun yang kelas dunia.'], ['Toyota', 'Ide just-in-time datang dari mengamati cara supermarket Amerika mengisi ulang raknya.'], ['Southwest Airlines', 'Memangkas waktu parkir pesawat dengan mempelajari kru pit balap mobil.']];
  ex.forEach((it, i) => {
    const yy = y + 0.3 + i * 0.78;
    rect(s, x2, yy, w2, 0.7, i % 2 ? C.card2 : C.card);
    txt(s, it[0], x2 + 0.2, yy + 0.08, 1.75, 0.55, { fontFace: F.s, fontSize: 10.5, color: C.white, valign: 'middle' });
    txt(s, it[1], x2 + 1.95, yy + 0.06, w2 - 2.1, 0.6, { fontFace: F.r, fontSize: 8.5, color: C.grey, valign: 'middle', lineSpacingMultiple: 1.04 });
  });
  callout(s, 0.6, y + 2.75, cw, 0.8, 'BAGIAN SULITNYA BUKAN MEMUTUSKAN, TAPI MENDAPAT DATANYA', 'Sumber yang sah: laporan publik, asosiasi dagang, firma riset, kunjungan lapangan, dan konsultan pihak ketiga yang mengumpulkan data secara anonim. Bukan pengumpulan intelijen yang melanggar hukum.', { fill: C.card2, size: 9.5 });
}

// =============== 15. REMEDIES ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  TINDAKAN', 'KALAU BIAYA ATAU NILAINYA KALAH, APA YANG DILAKUKAN', 'Analisis value chain dan benchmarking bisa menunjukkan kita kalah biaya atau kalah nilai. Buku menunjuk tiga area perbaikan.', { notes: '16' });
  const cols = [
    ['1. Aktivitas internal sendiri', ['Terapkan best practice, terutama di aktivitas mahal', 'Hapus aktivitas yang tidak perlu dengan merombak value chain', 'Pindahkan aktivitas mahal ke wilayah berbiaya lebih rendah', 'Serahkan ke pihak luar (outsourcing) jika mereka lebih murah', 'Investasi teknologi yang menaikkan produktivitas', 'Rancang ulang produk agar lebih murah dibuat']],
    ['2. Bagian pemasok', ['Tekan harga beli ke pemasok', 'Ganti ke input substitusi yang lebih murah', 'Kerja sama erat mencari penghematan bersama', 'Integrasi ke belakang: produksi sendiri', 'Untuk menaikkan nilai: pilih pemasok bermutu tinggi dan libatkan mereka sejak tahap desain']],
    ['3. Bagian mitra hilir', ['Tekan biaya dan markup distributor serta dealer', 'Kerja sama mencari penghematan yang saling menguntungkan', 'Ubah jalur distribusi, termasuk jualan langsung lewat internet', 'Integrasi ke depan: buka gerai sendiri', 'Untuk menaikkan nilai: iklan bersama, perjanjian eksklusif, dan pelatihan mitra']],
  ];
  const w = (cw - 0.5) / 3, h = 3.35;
  cols.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.25);
    rect(s, x, top, w, h, C.card);
    rect(s, x, top, w, 0.06, [C.red, C.gold, C.red][i]);
    txt(s, it[0], x + 0.22, top + 0.18, w - 0.4, 0.35, { fontFace: F.s, fontSize: 12, color: C.white });
    txt(s, bullets(it[1], 9.5, C.grey), x + 0.22, top + 0.62, w - 0.4, h - 0.7, { lineSpacingMultiple: 1.06 });
  });
  callout(s, 0.6, top + 3.55, cw, 0.95, 'HANYA ADA DUA JALAN MENGUBAH KERJA VALUE CHAIN JADI KEUNGGULAN BERSAING', '(1) Lebih efisien sehingga biayanya lebih rendah dari pesaing: Ryanair, Nucor, TJX.   (2) Menjadi dasar diferensiasi sehingga pelanggan mau membayar lebih: Rolex (status), Braun (desain), L.L. Bean (layanan), FedEx (keandalan).', { size: 10 });
}

// =============== 16. TABLE 4.4 ===============
{
  const { s, top, cw } = page('PERTANYAAN 5  ·  TABLE 4.4', 'COMPETITIVE STRENGTH ASSESSMENT', 'Alat untuk mengubah penilaian yang serba kualitatif menjadi satu angka yang bisa langsung dibandingkan dengan pesaing.', { notes: '17' });
  const steps = [['Daftar KSF', 'Susun key success factor industri'], ['Beri bobot', 'Sesuai tingkat kepentingan; total harus 1,00'], ['Beri rating', 'Skala 1–10. 1 sangat lemah, 10 sangat kuat'], ['Kalikan', 'Rating × bobot = skor tertimbang'], ['Jumlahkan', 'Totalnya jadi ukuran kekuatan keseluruhan']];
  const w = (cw - 0.6) / 5;
  steps.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.15);
    rect(s, x, top, w, 0.9, C.card);
    numCircle(s, i + 1, x + 0.15, top + 0.2, 0.46);
    txt(s, it[0], x + 0.72, top + 0.12, w - 0.8, 0.3, { fontFace: F.s, fontSize: 10.5, color: C.white });
    txt(s, it[1], x + 0.72, top + 0.4, w - 0.8, 0.5, { fontFace: F.r, fontSize: 8, color: C.grey, lineSpacingMultiple: 1.04 });
  });
  const rows = [
    ['Key Success Factor', 'Bobot', 'ABC Co.', 'Rival 1', 'Rival 2'],
    ['Mutu / performa produk', '0,10', '8 / 0,80', '5 / 0,50', '1 / 0,10'],
    ['Reputasi dan citra', '0,10', '8 / 0,80', '7 / 0,70', '1 / 0,10'],
    ['Kemampuan produksi', '0,10', '2 / 0,20', '10 / 1,00', '5 / 0,50'],
    ['Sumber daya keuangan', '0,10', '5 / 0,50', '10 / 1,00', '3 / 0,30'],
    ['Posisi biaya relatif', '0,30', '5 / 1,50', '10 / 3,00', '1 / 0,30'],
    ['Layanan pelanggan', '0,15', '5 / 0,75', '7 / 1,05', '1 / 0,15'],
    ['Faktor lain (tiga baris)', '0,15', '1,40', '0,45', '0,65'],
    ['TOTAL SKOR TERTIMBANG', '1,00', '5,95', '7,70', '2,10'],
  ];
  const ty = top + 1.1, tw = 7.9;
  s.addTable(tableStyle(rows, { totalRow: true, fs: 9 }), { x: 0.6, y: ty, w: tw, colW: [2.9, 0.9, 1.37, 1.37, 1.36], rowH: 0.33 });
  txt(s, 'Contoh dari Table 4.4 buku. Isi sel: rating / skor tertimbang.', 0.6, ty + 9 * 0.33 + 0.08, tw, 0.25, { fontFace: F.r, fontSize: 8, color: C.mute });
  const x2 = 0.6 + tw + 0.3, w2 = cw - tw - 0.3;
  label(s, 'APA YANG BISA DIBACA DARI ANGKANYA', x2, ty - 0.02, w2);
  const r = [['Selisih total skor', 'Besarnya net competitive advantage. Rival 1 (7,70) unggul jauh atas Rival 2 (2,10).'], ['Serang di mana', 'Serang pesaing yang skornya lebih rendah, di faktor tempat kita kuat dan dia lemah.'], ['Bertahan di mana', 'Kalau kita lemah di faktor tempat pesaing kuat, siapkan langkah bertahan lebih dulu.']];
  r.forEach((it, i) => card(s, x2, ty + 0.3 + i * 0.98, w2, 0.88, { head: it[0], body: it[1], headSize: 10.5, bodySize: 8.5, accent: i ? C.card : C.red, fill: i === 0 ? C.red2 : C.card }));
}

// =============== 17. PRIORITY LIST ===============
{
  const { s, top, cw } = page('PERTANYAAN 6', 'ISU APA YANG HARUS DITANGANI LEBIH DULU?', 'Langkah terakhir dan paling penting. Semua temuan dari Q1 sampai Q5, ditambah analisis industri dari Chapter 3, dikerucutkan jadi satu daftar prioritas.', { notes: '18' });
  rect(s, 0.6, top, 5.6, 3.3, C.red);
  txt(s, 'PRIORITY LIST', 0.85, top + 0.2, 4, 0.3, { fontFace: F.s, fontSize: 9, color: C.gold, charSpacing: 2 });
  txt(s, 'Daftar isu dan masalah yang harus dituntaskan manajemen agar perusahaan lebih berhasil, secara keuangan maupun secara bersaing, di tahun-tahun mendatang.', 0.85, top + 0.55, 5.1, 1.3, { fontFace: F.s, fontSize: 13, color: C.white, lineSpacingMultiple: 1.02 });
  txt(s, 'Isinya selalu berbentuk "bagaimana caranya…", "apa yang harus dilakukan soal…", dan "apakah perlu…".', 0.85, top + 2.0, 5.1, 1.1, { fontFace: F.r, fontSize: 11, color: C.white, lineSpacingMultiple: 1.06 });
  const x = 6.5, w = cw - 5.9;
  label(s, 'DUA HAL YANG SERING KELIRU', x, top - 0.02, 4);
  card(s, x, top + 0.3, w, 1.4, { head: 'Ini bukan daftar solusi', body: 'Tujuannya mengidentifikasi ISU yang harus ditangani, bukan memutuskan tindakan apa yang diambil. Keputusan tindakan datang belakangan, saat menyusun strategi.', headSize: 12, bodySize: 10 });
  card(s, x, top + 1.9, w, 1.4, { head: 'Panjang daftar itu diagnosis', body: 'Kalau isinya ringan, strategi sekarang sudah cukup dan tinggal disetel halus. Kalau isinya berat, menyusun strategi baru harus jadi agenda nomor satu manajemen.', headSize: 12, bodySize: 10, accent: C.gold });
  callout(s, 0.6, top + 3.55, cw, 0.9, 'UJI AKHIR CHAPTER 4', 'Strategi yang baik wajib memuat cara menangani SEMUA isu dan hambatan pada daftar prioritas itu. Di sinilah analisis berhenti dan penyusunan strategi dimulai.', { fill: C.card2, size: 10.5 });
}

// =============== 18. SECTION B ===============
{
  const s = pptx.addSlide();
  pageNo += 1;
  s.background = { color: C.bg };
  img(s, 'mu_assets/band.jpg', 0, 0, W, W * 1344 / 3168);
  const py = W * 1344 / 3168;
  rect(s, 0, py, W, H - py, C.red);
  rect(s, 0.7, py + 0.36, 0.4, 0.07, C.gold);
  txt(s, 'BAGIAN B  ·  STUDI KASUS', 1.25, py + 0.22, 6, 0.35, { fontFace: F.s, fontSize: 10, color: C.gold, charSpacing: 3 });
  txt(s, 'MANCHESTER UNITED', 0.7, py + 0.6, 8.5, 0.75, { fontFace: F.x, fontSize: 36, color: C.white });
  txt(s, 'Preparing for Life without Ferguson', 0.7, py + 1.3, 8.5, 0.4, { fontFace: F.m, fontSize: 15, color: C.white });
  txt(s, 'Ditulis Robert M. Grant, dibantu Simon I. Peck, Christopher Carr dan Timothy Smith. © 2010. Kasus ini bukan dari buku Thompson; kami pakai kerangka Chapter 4 untuk membedahnya.', 9.3, py + 0.35, 3.4, 1.4, { fontFace: F.r, fontSize: 8.5, color: C.white, lineSpacingMultiple: 1.08 });
  notes(s, '20');
}

// =============== 19. SITUASI JULI 2009 ===============
{
  const { s, top } = page('KASUS  ·  SITUASI', 'JULI 2009: KEPUTUSAN YANG DIHADAPI DAVID GILL', null, { src: 'Sumber: Grant (2010), Case 6 "Manchester United: Preparing for Life without Ferguson", hlm. 573 dan 588.' });
  s.addNotes('Tegaskan setting waktunya: Juli 2009, saat tur pramusim Asia. Ferguson masih menjabat; kasus hanya menyebut ia akan berusia 68 tahun pada akhir 2009 dan Gill memperkirakan pensiun akhir musim 2009-10.\n\nPengambil keputusannya David Gill, Chief Executive. Keputusan yang disiapkan: siapa pengganti Ferguson.\n\nDilema inti (hlm. 588): orang dalam menjaga sistem tetap jalan tapi wibawanya diragukan; orang luar seperti Mourinho berarti membongkar dan membangun ulang infrastruktur Ferguson.\n\nTutup dengan pertanyaan yang jadi benang merah Bagian B: aset mana yang milik klub, aset mana yang milik satu orang.');
  const cards = [['Waktu', 'Juli 2009, tur pramusim ke Malaysia, Indonesia, Korea, dan China. Skuad pulang 28 Juli 2009.'], ['Pengambil keputusan', 'David Gill, Chief Executive Manchester United Football Club Limited.'], ['Keputusan', 'Menyiapkan pengganti Sir Alex Ferguson. Kasus: "at the end of 2009 Ferguson would be 68 years old". Gill memperkirakan ia pensiun akhir musim 2009–10.']];
  const w = 2.75;
  cards.forEach((it, i) => card(s, 0.6 + i * (w + 0.2), top, w, 2.2, { head: it[0], body: it[1], headSize: 12, bodySize: 9.5, accent: i === 2 ? C.gold : C.red }));
  img(s, 'mu_assets/stadium.jpg', 9.55, top, 3.15, 2.1);
  txt(s, 'Old Trafford, diperluas 2006 (ilustrasi)', 9.55, top + 2.13, 3.15, 0.25, { fontFace: F.r, fontSize: 7.5, color: C.mute });
  const y = top + 2.45;
  rect(s, 0.6, y, 12.1, 2.55, C.card2);
  rect(s, 0.6, y, 0.06, 2.55, C.red);
  txt(s, 'DILEMA INTI  ·  KASUS HLM. 588', 0.88, y + 0.15, 5, 0.25, { fontFace: F.s, fontSize: 8.5, color: C.gold, charSpacing: 1.5 });
  txt(s, [{ text: 'Pilih orang dalam ', options: { fontFace: F.s, color: C.white } }, { text: '(Queiroz, Phelan, Solskjær, McClair): sistem latihan, pemanduan bakat, dan pengembangan tim tetap jalan. Tetapi apakah mereka cukup berwibawa di depan pemain bintang?', options: { fontFace: F.r, color: C.grey } }], 0.88, y + 0.48, 5.7, 1.2, { fontSize: 10, lineSpacingMultiple: 1.06 });
  txt(s, [{ text: 'Pilih orang luar berwibawa ', options: { fontFace: F.s, color: C.white } }, { text: 'seperti Mourinho: kasus menyebut ini "a revolutionary change in coaching strategy in which much of Ferguson\'s infrastructure would be taken down and rebuilt".', options: { fontFace: F.r, color: C.grey } }], 6.85, y + 0.48, 5.6, 1.2, { fontSize: 10, lineSpacingMultiple: 1.06 });
  rect(s, 0.88, y + 1.78, 11.5, 0.6, C.red);
  txt(s, 'Pertanyaan Chapter 4 di baliknya: aset mana yang milik klub, dan aset mana yang milik satu orang?', 1.08, y + 1.78, 11.2, 0.6, { fontFace: F.s, fontSize: 11, color: C.white, valign: 'middle' });
}

// =============== 20. INDUSTRY ===============
{
  const { s, top, cw } = page('KONTEKS', 'SEPAKBOLA EROPA SEBAGAI INDUSTRI', 'Q1 menuntut perbandingan dengan pesaing. Jadi kita perlu tahu dulu industrinya seperti apa.', { notes: '22', src: SRC_CASE });
  const w = (cw - 0.5) / 3;
  stat(s, 0.6, top, w, 1.55, '€2,4 M', 'Pendapatan Premier League 2007–08', 'Terbesar di Eropa. Serie A, La Liga dan Bundesliga masing-masing sekitar €1,4 miliar.');
  stat(s, 0.6 + w + 0.25, top, w, 1.55, '62%', 'Porsi gaji terhadap pendapatan', 'Premier League. Serie A 68%, La Liga 63%. Gaji adalah pos biaya terbesar klub Eropa.');
  stat(s, 0.6 + 2 * (w + 0.25), top, w, 1.55, '6 dari 10', 'Klub besar di Table 6.6 merugi', 'Selama 2000–2006. Industri ini tumbuh pesat, tapi sangat tidak menguntungkan.', { bar: C.gold });
  const y = top + 1.8, lw = 6.4;
  label(s, 'TIGA SUMBER PENDAPATAN KLUB  ·  PREMIER LEAGUE 2007–08', 0.6, y, lw);
  const rev = [['Matchday', '£554 jt', 'Tiket dan hospitality. Dibatasi kapasitas stadion; itu sebabnya klub besar merenovasi atau membangun stadion baru.'], ['Broadcasting', '£931 jt', 'Hak siar dinegosiasikan Premier League. Kontrak 2006 bernilai £2,7 miliar; tiap klub dapat rata-rata £45 juta per tahun.'], ['Commercial', '£447 jt', 'Sponsor, lisensi merchandise, iklan. Terpusat di sedikit klub; Real Madrid dan Barcelona meraup lebih dari 60% sponsor La Liga.']];
  rev.forEach((it, i) => {
    const yy = y + 0.3 + i * 0.83;
    rect(s, 0.6, yy, lw, 0.75, i % 2 ? C.card2 : C.card);
    txt(s, it[0], 0.8, yy + 0.08, 1.5, 0.3, { fontFace: F.s, fontSize: 10.5, color: C.white });
    txt(s, it[1], 0.8, yy + 0.36, 1.5, 0.3, { fontFace: F.x, fontSize: 12, color: C.gold });
    txt(s, it[2], 2.35, yy + 0.06, lw - 2.5, 0.65, { fontFace: F.r, fontSize: 8.5, color: C.grey, valign: 'middle', lineSpacingMultiple: 1.04 });
  });
  const x2 = 0.6 + lw + 0.3, w2 = cw - lw - 0.3;
  label(s, 'ATURAN MAIN DAN LOGIKA EKONOMINYA', x2, y, w2);
  const rules = [['Struktur kompetisi', '20 klub Premier League, tiga terbawah turun kasta. Empat teratas lolos Champions League, kompetisi 32 klub terbaik Eropa.'], ['Yang kaya makin kaya', 'Sejak UCL dimulai 1992, muncul jurang keuangan antara MU, Chelsea, Liverpool, Arsenal dan sisanya. Uang Eropa membeli pemain bagus.'], ['Harga pemain meledak', 'Rekor transfer baru tercipta musim panas 2009 meski resesi. Pendorongnya: Real Madrid, lalu Chelsea, lalu Manchester City.']];
  rules.forEach((it, i) => {
    const yy = y + 0.3 + i * 0.83;
    rect(s, x2, yy, w2, 0.75, i % 2 ? C.card2 : C.card);
    rect(s, x2, yy, 0.06, 0.75, C.red);
    txt(s, it[0], x2 + 0.25, yy + 0.08, w2 - 0.4, 0.25, { fontFace: F.s, fontSize: 10, color: C.white });
    txt(s, it[1], x2 + 0.25, yy + 0.33, w2 - 0.4, 0.42, { fontFace: F.r, fontSize: 8, color: C.grey, lineSpacingMultiple: 1.03 });
  });
}

// =============== 21. ON PITCH ===============
{
  const { s, top } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI LAPANGAN: JELAS DI ATAS RATA-RATA', 'Indikator kedua Thompson, apakah posisi dan kekuatan bersaingnya membaik, dijawab data kompetisi kasus.', { notes: '23', src: SRC_CASE + ' Table 6.1, 6.2 dan 6.7.' });
  const w = 4.5;
  stat(s, 0.6, top, w, 1.35, '1.460', 'Poin Eropa 2000–2009, tertinggi  ·  Table 6.2', 'Barcelona 1.411  ·  Real Madrid 1.314  ·  Arsenal 1.310', { vsize: 24 });
  stat(s, 0.6, top + 1.5, w, 1.35, '3', 'Gelar liga beruntun 2007, 2008, 2009  ·  Table 6.1', 'Total 11 gelar liga sejak 1993 dalam rentang kasus', { vsize: 24 });
  stat(s, 0.6, top + 3.0, w, 1.35, '2008', 'Liga Champions kedua di era Ferguson  ·  hlm. 584', 'Yang pertama 1999, bersama gelar liga dan FA Cup', { vsize: 24, bar: C.gold });
  const x = 5.4, cw2 = 7.3;
  rect(s, x, top, cw2, 4.35, C.card);
  txt(s, 'POIN PERFORMA EROPA 2000–09  ·  TABLE 6.2', x + 0.25, top + 0.15, cw2 - 0.5, 0.25, { fontFace: F.s, fontSize: 8.5, color: C.gold, charSpacing: 1.5 });
  hbars(s, x + 0.25, top + 0.5, cw2 - 0.5, 2.7, [
    { label: 'Man United', v: 1460, fmt: '1.460', hi: true }, { label: 'Barcelona', v: 1411, fmt: '1.411' }, { label: 'Real Madrid', v: 1314, fmt: '1.314' },
    { label: 'Bayern', v: 1314, fmt: '1.314' }, { label: 'Arsenal', v: 1310, fmt: '1.310' }, { label: 'Chelsea', v: 1276, fmt: '1.276' }], { labW: 1.4 });
  txt(s, 'Di antara enam klub ini, skuad MU paling besar (34 pemain) dan termuda kedua (25,6 tahun) setelah Arsenal. Cocok dengan strategi memadukan pemain muda dan pemain berpengalaman (Table 6.7).', x + 0.25, top + 3.35, cw2 - 0.5, 0.9, { fontFace: F.r, fontSize: 9, color: C.grey, lineSpacingMultiple: 1.06 });
}

// =============== 22. FINANCE ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  DITERAPKAN', 'DI KEUANGAN: PALING UNTUNG DI ANTARA KLUB BESAR', 'Indikator pertama Thompson, apakah kekuatan keuangan dan labanya membaik, dijawab Appendix kasus serta Table 6.5 dan 6.6.', { notes: '24', src: SRC_CASE + ' Appendix hlm. 589, Table 6.5 dan 6.6.' });
  const lw = 7.4;
  rect(s, 0.6, top, lw, 3.55, C.card);
  txt(s, 'PENDAPATAN MU, £ JUTA  ·  NAIK 53% DARI 2006 KE 2008', 0.85, top + 0.15, lw - 0.5, 0.25, { fontFace: F.s, fontSize: 8.5, color: C.gold, charSpacing: 1.5 });
  vbars(s, 0.85, top + 0.5, lw - 0.5, 2.35, [
    { label: '2000', v: 116.0, fmt: '116,0' }, { label: '2001', v: 129.6, fmt: '129,6' }, { label: '2002', v: 146.1, fmt: '146,1' }, { label: '2003', v: 173.0, fmt: '173,0' }, { label: '2004', v: 169.1, fmt: '169,1' },
    { label: '2005', v: 157.2, fmt: '157,2' }, { label: '2006', v: 167.8, fmt: '167,8' }, { label: '2007', v: 212.2, fmt: '212,2', hi: true }, { label: '2008', v: 257.1, fmt: '257,1', hi: true }]);
  txt(s, 'Entitas: plc untuk 2000–2005, Limited untuk 2006–2008. Tahun buku 2000–04 sampai 31 Juli, 2005–08 sampai 30 Juni. Kasus: data 2000–04 tidak sebanding dengan 2005–08 karena perubahan akuntansi.', 0.85, top + 2.95, lw - 0.5, 0.55, { fontFace: F.r, fontSize: 7.5, color: C.mute, lineSpacingMultiple: 1.04 });
  const x = 0.6 + lw + 0.25, w = cw - lw - 0.25;
  label(s, 'BUKTI PENDUKUNG', x, top - 0.02, w);
  const ev = [['×2,2', 'Laba bersih naik dari £21,6 jt (2006) ke £46,8 jt (2008). Margin bersih 2008: 18,2%'], ['12,6%', 'Return on sales 2000–2006 (Table 6.6), tertinggi dari 10 klub; Real Madrid hanya 0,4%'], ['€101,9 jt', 'EBITDA tertinggi di Table 6.5 (data Forbes 2009). Margin 31,4% vs Barcelona 22,3%, Real Madrid 14,1%'], ['£1,14 M', 'Nilai klub tertinggi di Table 6.5, di atas Barcelona £960 jt dan Real Madrid £850 jt']];
  ev.forEach((it, i) => {
    const yy = top + 0.3 + i * 0.82;
    rect(s, x, yy, w, 0.74, i % 2 ? C.card2 : C.card);
    txt(s, it[0], x + 0.2, yy + 0.05, 1.45, 0.64, { fontFace: F.x, fontSize: 14, color: C.gold, valign: 'middle' });
    txt(s, it[1], x + 1.7, yy + 0.05, w - 1.85, 0.64, { fontFace: F.r, fontSize: 8.5, color: C.grey, valign: 'middle', lineSpacingMultiple: 1.04 });
  });
  callout(s, 0.6, top + 3.75, cw, 0.8, 'SATU ANGKA YANG MERUSAK GAMBARAN INI', 'Utang £616 juta, tertinggi kedua di Table 6.5 setelah Arsenal (£896 juta). Kasus mencatat akuisisi Glazer 2005 dibiayai terutama dengan utang (hlm. 584).', { size: 10 });
}

// =============== 23. TRANSFER ===============
{
  const { s, top, cw } = page('PERTANYAAN 1  ·  KESIMPULAN', 'PRESTASI PUNCAK, BELANJA RELATIF HEMAT', 'Analisis turunan kami dari Table 6.7: dari empat klub berprestasi tertinggi, belanja bersih MU yang paling kecil.', { notes: '25', src: SRC_CASE + ' Table 6.7; perbandingan disusun kelompok.' });
  const lw = 7.4;
  rect(s, 0.6, top, lw, 3.55, C.card);
  txt(s, 'BELANJA TRANSFER BERSIH 2003–09, £ JUTA  ·  EMPAT KLUB DENGAN POIN PERFORMA TERTINGGI', 0.85, top + 0.15, lw - 0.5, 0.25, { fontFace: F.s, fontSize: 8.5, color: C.gold, charSpacing: 1.2 });
  hbars(s, 0.85, top + 0.55, lw - 0.5, 2.1, [
    { label: 'Real Madrid (183,0 poin)', v: 438 }, { label: 'Barcelona (200,0 poin)', v: 249 }, { label: 'Bayern München (179,5 poin)', v: 122 }, { label: 'Manchester United (192,5 poin)', v: 100, hi: true }], { labW: 2.6 });
  txt(s, 'Klub lain di Table 6.7 ada yang belanja lebih sedikit: Arsenal £22 jt, AC Milan justru penjual bersih (−£66 jt). Tapi poinnya 162,0 dan 169,0, di bawah MU.', 0.85, top + 2.8, lw - 0.5, 0.7, { fontFace: F.r, fontSize: 8.5, color: C.mute, lineSpacingMultiple: 1.04 });
  const x = 0.6 + lw + 0.25, w = cw - lw - 0.25;
  rect(s, x, top, w, 1.45, C.red);
  txt(s, '4,4×', x + 0.2, top + 0.1, 2, 0.6, { fontFace: F.x, fontSize: 28, color: C.gold });
  txt(s, 'Real Madrid membelanjakan 4,4 kali lipat belanja bersih MU (£438 jt vs £100 jt), tapi poin performanya lebih rendah: 183,0 vs 192,5.', x + 0.2, top + 0.68, w - 0.4, 0.75, { fontFace: F.m, fontSize: 9, color: C.white, lineSpacingMultiple: 1.05 });
  const mini = [['Chelsea', '£430 jt belanja bersih, hanya 144,5 poin.'], ['Barcelona', 'Satu-satunya yang mengungguli MU, dengan belanja 2,5× lipat.'], ['Kata kasus sendiri', 'Belanja bersih MU "relatif sederhana" (hlm. 586).']];
  mini.forEach((it, i) => {
    const yy = top + 1.6 + i * 0.67;
    rect(s, x, yy, w, 0.6, i % 2 ? C.card2 : C.card);
    txt(s, it[0], x + 0.2, yy + 0.05, 1.5, 0.5, { fontFace: F.s, fontSize: 9.5, color: C.white, valign: 'middle' });
    txt(s, it[1], x + 1.7, yy + 0.05, w - 1.85, 0.5, { fontFace: F.r, fontSize: 8.5, color: C.grey, valign: 'middle', lineSpacingMultiple: 1.03 });
  });
  callout(s, 0.6, top + 3.75, cw, 0.8, 'JAWABAN Q1', 'Strategi MU bekerja sangat baik. Kedua indikator Thompson terpenuhi sekaligus, di industri yang mayoritas pelakunya merugi. Yang harus dijelaskan pertanyaan berikutnya: kenapa bisa begitu.', { size: 10 });
}

// =============== 24. SWOT MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 2  ·  DITERAPKAN', 'SWOT MANCHESTER UNITED, JULI 2009', 'Semua temuan Q1 dirangkum, lalu ditarik kesimpulan sesuai langkah 2 dan 3 Figure 4.2, bukan berhenti di daftar.', { notes: '26', src: SRC_CASE });
  const q = [
    ['S', 'Strengths', ['Merek global dengan 80 juta pendukung di Asia', 'Laba tertinggi di antara klub besar: EBITDA €101,9 jt, RoS 12,6%', 'Akademi dan jaringan pemandu bakat yang matang', 'Disiplin transfer: belanja bersih hanya £100 jt'], C.red],
    ['W', 'Weaknesses', ['Bergantung pada satu orang yang akhir 2009 berusia 68 tahun', 'Belum ada keputusan suksesi; Ferguson belum menyatakan niat pensiun', 'Ronaldo, satu-satunya pemain MU di peringkat FIFA, baru dijual', 'Utang £616 jt; akuisisi Glazer 2005 dibiayai utang'], C.card],
    ['O', 'Opportunities', ['Pasar Asia: India dan Cina disebut Aon sebagai target utama', 'Sponsor khusus per negara masih bisa diperbanyak', 'Pendapatan siaran Premier League naik 43% dalam setahun', 'Kanal digital: MUTV, MU Mobile, toko online'], C.card],
    ['T', 'Threats', ['Harga pemain meledak, didorong Manchester City (£185 jt)', 'Pesaing berpemilik sangat kaya: Abramovich, Sheikh Mansour', 'MU tak dapat suntikan dana pemilik seperti Chelsea dan City', 'Barcelona unggul poin performa (200,0 vs 192,5)'], C.red],
  ];
  const w = (cw - 0.25) / 2, h = 1.72;
  q.forEach((it, i) => {
    const x = 0.6 + (i % 2) * (w + 0.25), y = top + Math.floor(i / 2) * (h + 0.2);
    rect(s, x, y, w, h, it[3]);
    txt(s, it[0], x + 0.2, y + 0.08, 0.9, 0.8, { fontFace: F.x, fontSize: 36, color: it[3] === C.red ? C.gold : C.red });
    txt(s, it[1], x + 1.05, y + 0.14, 3, 0.3, { fontFace: F.s, fontSize: 12, color: C.white });
    txt(s, bullets(it[2], 9, it[3] === C.red ? C.white : C.grey), x + 1.05, y + 0.45, w - 1.25, h - 0.5, { lineSpacingMultiple: 1.02 });
  });
  callout(s, 0.6, top + 2 * h + 0.4, cw, 0.85, 'KESIMPULAN  ·  LANGKAH 2', 'Kekuatan MU cukup untuk menangkap peluang komersial di Asia. Tapi kelemahan terbesarnya, ketergantungan pada Ferguson, menyerang sisi lapangan, padahal bagi Gill sisi lapangan adalah syarat mengalirnya pendapatan komersial.', { fill: C.card2, size: 10 });
}

// =============== 25. RESOURCE INVENTORY ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DITERAPKAN', 'INVENTARISASI RESOURCE MANCHESTER UNITED', 'Langkah pertama Q3: mendaftar aset bersaing klub memakai delapan kategori Table 4.3, semuanya berdasarkan bukti dari kasus.', { notes: '27', src: SRC_CASE });
  const tan = [['Finansial', 'EBITDA €101,9 jt, tertinggi di Table 6.5; laba bersih 2008 £46,8 jt; ekuitas £294 jt.'], ['Fisik', 'Old Trafford, diperluas 2006 dengan tambahan 7.500 kursi; museum, tur stadion, suite dan ballroom.'], ['Teknologi', 'MUTV (siaran web), MU Mobile (SMS dan video), toko online store.manutd.com.'], ['Organisasional', 'Urusan tim (Ferguson) terpisah dari komersial (Gill; direktur komersial Richard Arnold); MU International.']];
  const intan = [['Human assets', 'Ferguson sejak 1986; skuad 34 pemain; lebih dari 20 pemandu bakat. Ronaldo, peringkat 1 FIFA, dijual 2009.'], ['Merek & reputasi', '80 juta pendukung di Asia; sub-merek Fred the Red, MUFC, Red Devil. Menurut Aon, tak tertandingi di dunia olahraga.'], ['Relasi', 'Nike dan AIG (diganti Aon, £80 jt/4 tahun), ditambah 13 sponsor lain, termasuk Tri Indonesia dan Bharti Airtel.'], ['Budaya & insentif', 'Disiplin latihan ketat, perang terhadap alkohol, prinsip "tidak ada pemain yang lebih besar dari klub".']];
  const hw = (cw - 0.25) / 2;
  [['TANGIBLE', tan, C.red, C.white], ['INTANGIBLE', intan, C.gold, C.bg]].forEach((col, ci) => {
    const x = 0.6 + ci * (hw + 0.25);
    rect(s, x, top, hw, 0.42, col[2]);
    txt(s, col[0], x + 0.24, top, hw, 0.42, { fontFace: F.x, fontSize: 12, color: col[3], valign: 'middle', charSpacing: 2 });
    col[1].forEach((r, ri) => {
      const y = top + 0.42 + ri * 0.78;
      rect(s, x, y, hw, 0.76, ri % 2 ? C.card2 : C.card);
      txt(s, r[0], x + 0.24, y + 0.08, 1.7, 0.6, { fontFace: F.s, fontSize: 10, color: C.white, valign: 'middle' });
      txt(s, r[1], x + 1.95, y + 0.06, hw - 2.15, 0.65, { fontFace: F.r, fontSize: 8.5, color: C.grey, valign: 'middle', lineSpacingMultiple: 1.04 });
    });
  });
  callout(s, 0.6, top + 3.75, cw, 0.8, 'PERHATIKAN KOMPOSISINYA', 'Aset yang paling membedakan MU ada di kolom kanan, yang tidak berwujud. Itu yang membuat klub ini unggul, dan sekaligus rapuh, karena sebagian aset tak berwujud melekat pada orang, dan orang bisa pergi.', { size: 10 });
}

// =============== 26. CAPABILITIES ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DITERAPKAN', 'CAPABILITY MU, DAN MANA YANG CORE COMPETENCE', 'Kami pakai tingkatan di slide 7: mana yang sekadar competence, mana yang distinctive competence, dan mana yang benar-benar core competence.', { notes: '28', src: SRC_CASE });
  const c = [
    ['CORE COMPETENCE', 'Mengenali dan mengembangkan bakat', 'Pemandu bakat dari 5 jadi lebih dari 20 orang; Youth Academy; dua pemandu bakat penuh waktu di Brasil sejak 2008.'],
    ['CORE COMPETENCE', 'Membentuk dan merotasi tim', 'Memadukan pemain muda dengan pemain berpengalaman. Kasus menyebut Ferguson pelopor rotasi skuad.'],
    ['CORE COMPETENCE', 'Mengubah merek jadi uang', 'Sponsor khusus Indonesia dan India, sub-merek per usia, MU Finance, MU Mobile, MUTV, Soccer Schools, tur Asia.'],
    ['DISTINCTIVE COMPETENCE', 'Disiplin di pasar transfer', 'Belanja kotor £322 jt, bersih £100 jt. Mau menjual pemain yang dihargai lebih tinggi klub lain, seperti Ronaldo (£80 jt).'],
    ['DISTINCTIVE COMPETENCE', 'Tata kelola klub', 'Kasus: klub Inggris "paling berhasil membangun tata kelola yang efektif". Glazer memilih peran pasif.'],
    ['COMPETENCE', 'Mengelola stadion dan acara', 'Old Trafford disewakan untuk konferensi dan pernikahan; museum dan tur. Dikerjakan baik, tapi klub besar lain juga melakukannya.'],
  ];
  const w = (cw - 0.5) / 3, h = 1.62;
  c.forEach((it, i) => {
    const x = 0.6 + (i % 3) * (w + 0.25), y = top + Math.floor(i / 3) * (h + 0.2);
    const core = it[0] === 'CORE COMPETENCE';
    card(s, x, y, w, h, { fill: core ? C.red : C.card, accent: core ? C.gold : (it[0] === 'COMPETENCE' ? C.mute : C.red), tag: it[0], tagColor: core ? C.gold : (it[0] === 'COMPETENCE' ? C.mute : C.red), head: it[1], body: it[2], headSize: 11.5, bodySize: 8.5, bodyColor: core ? C.white : C.grey });
  });
  callout(s, 0.6, top + 2 * h + 0.4, cw, 0.85, 'YANG PERLU DISADARI', 'Tiga capability yang langsung menentukan prestasi lapangan (bakat, tim, dan transfer) dibangun dan diarahkan oleh Ferguson. Tiga lainnya berdiri di luar dirinya.', { fill: C.card2, size: 10.5 });
}

// =============== 27. VRIN MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  VRIN TEST', 'DUA KEUNGGULAN, SAMA-SAMA LOLOS VRIN TEST', 'Kami uji dua hal dengan empat saringan yang sama: sistem Ferguson, dan merek beserta mesin komersialnya.', { notes: '29', src: SRC_CASE + ' Table 6.5 dan 6.8; hlm. 573 sampai 588.' });
  const rows = [
    ['Tes', 'Sistem Ferguson', 'Merek & mesin komersial'],
    ['Valuable', 'LOLOS. Poin Eropa tertinggi, tiga gelar liga beruntun, Liga Champions 2008. Ferguson memenangi lebih banyak gelar daripada seluruh sejarah klub sebelumnya.', 'LOLOS. Aon membayar £80 jt untuk 4 tahun, atau £20 jt per tahun, dua kali lipat Chelsea dan Samsung (£10 jt per tahun).'],
    ['Rare', 'LOLOS. Table 6.8 hanya memuat 15 pelatih paling dihormati dunia; Ferguson paling lama di satu klub, sejak 1986.', 'LOLOS. Kasus hanya menyebut MU dan Real Madrid sebagai pemimpin eksploitasi merek global. MU punya 80 juta pendukung di Asia.'],
    ['Inimitable', 'LOLOS. Kasus sendiri menyebut penentu performa tim "tetap misteri … menentang analisis": causal ambiguity. Ditambah 23 tahun akumulasi dan social complexity.', 'LOLOS. Dibangun sejak 1878 lewat sejarah dan prestasi panjang. Chelsea, meski belanja besar, pendapatannya masih di bawah MU: €268,9 jt vs €324,8 jt (Table 6.5).'],
    ['Nonsubstitutable', 'LOLOS. Jalan lain pesaing, membeli bintang dengan uang besar, tidak menyamai hasilnya: tim bertabur bintang Real Madrid dan Chelsea "gagal mencapai kejayaan".', 'LOLOS. Superstar bisa mendongkrak penjualan merchandise, tapi pemain datang dan pergi. Basis fan tetap: Aon menyebut fan Asia MU faktor kunci kontraknya.'],
  ];
  s.addTable(tableStyle(rows, { fs: 9, leftCols: [1, 2] }), { x: 0.6, y: top, w: cw, colW: [1.7, 5.2, 5.2], rowH: [0.36, 0.78, 0.78, 0.78, 0.78] });
  callout(s, 0.6, top + 3.7, cw, 0.85, 'KESIMPULAN Q3', 'Keduanya lolos VRIN Test, jadi keduanya tahan terhadap serangan PESAING. Bedanya ada di luar VRIN: merek melekat pada klub, sedangkan sistem Ferguson dibangun dan dipimpin satu orang yang akan segera pensiun.', { size: 10 });
}

// =============== 28. DYNAMIC CAPABILITY MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 3  ·  DYNAMIC CAPABILITY', 'TIGA KALI MEMBANGUN ULANG TIM JUARA', 'Inilah yang tidak diukur VRIN Test: apakah kemampuan memperbarui diri ini milik klub, atau milik satu orang.', { notes: '30', src: SRC_CASE + ' hlm. 583 dan 584.' });
  const cyc = [
    ['1986 – 1993', 'Membersihkan dan membangun fondasi', 'Ferguson menyingkirkan pemain yang dinilai kurang berbakat atau kurang berkomitmen, mempertahankan Bryan Robson, mendatangkan Hughes, Ince, Cantona, Keane. Ia juga menegakkan disiplin latihan.', 'FA Cup 1990  ·  Piala Winners 1991  ·  liga pertama era Ferguson 1993'],
    ['1994 – 2003', 'Generasi akademi', 'Juara liga junior 1990 menghasilkan Giggs, Beckham, Butt, Gary dan Phil Neville, serta Scholes. Mereka jadi inti tim yang mendominasi sepakbola Inggris.', 'Puncaknya 1999: liga, FA Cup, European Cup, Intercontinental Cup'],
    ['2003 – 2008', 'Regenerasi kedua', 'Kasus mencatat Beckham, Keane, Schmeichel, Cole, Sheringham, Stam dijual. Penggantinya antara lain Ferdinand, Ronaldo, Rooney, van der Sar, Evra, Vidić, Carrick.', 'Liga Champions 2008  ·  tiga gelar liga beruntun 2007–2009'],
  ];
  const w = (cw - 0.5) / 3, h = 3.3;
  rect(s, 0.6, top + 0.12, cw, 0.03, C.red);
  cyc.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.25);
    s.addShape(pptx.ShapeType.ellipse, { x: x + 0.15, y: top + 0.02, w: 0.22, h: 0.22, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
    rect(s, x, top + 0.42, w, h, C.card);
    txt(s, it[0], x + 0.22, top + 0.58, w - 0.4, 0.45, { fontFace: F.x, fontSize: 20, color: C.red });
    txt(s, it[1], x + 0.22, top + 1.05, w - 0.4, 0.6, { fontFace: F.s, fontSize: 12, color: C.white, lineSpacingMultiple: 0.95 });
    txt(s, it[2], x + 0.22, top + 1.68, w - 0.4, 1.3, { fontFace: F.r, fontSize: 9, color: C.grey, lineSpacingMultiple: 1.06 });
    rect(s, x + 0.22, top + 2.95, w - 0.44, 0.01, C.line);
    txt(s, it[3], x + 0.22, top + 3.05, w - 0.4, 0.6, { fontFace: F.m, fontSize: 8.5, color: C.gold, lineSpacingMultiple: 1.04 });
  });
  callout(s, 0.6, top + 3.9, cw, 0.7, 'PRESEDEN DARI KASUS SENDIRI', 'Setelah Matt Busby pensiun 1969, MU merosot. Selama 18 tahun sebelum Ferguson datang, MU tidak memenangi satu pun gelar liga dan hanya sekali jadi runner-up (hlm. 583).', { size: 9.5 });
}

// =============== 29. VALUE CHAIN MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  DITERAPKAN', 'VALUE CHAIN DAN STRUKTUR BIAYA MU', 'Kerangka Figure 4.3 dipetakan ke aktivitas nyata sebuah klub. Hasilnya: keunggulan biaya MU ada di HULU, di cara mendapatkan pemain.', { notes: '31', src: SRC_CASE + ' hlm. 580, 583, 584, 586.' });
  const lw = 7.7;
  label(s, 'PRIMARY ACTIVITIES', 0.6, top, 4);
  const p = [['Supply Chain', 'Mendapatkan pemain', 'Akademi, 20+ pemandu bakat, pasar transfer'], ['Operations', 'Latihan dan bertanding', 'Disiplin latihan, rotasi skuad, taktik'], ['Distribution', 'Menyalurkan tontonan', 'Hak siar liga dan UEFA, MUTV, Old Trafford'], ['Sales & Marketing', 'Menjual merek', 'Nike, AIG/Aon, 13 sponsor lain, tur Asia'], ['Service', 'Melayani pendukung', 'Superstore, museum, Soccer Schools, MU Mobile']];
  const w = (lw - 0.4) / 5;
  p.forEach((it, i) => {
    const x = 0.6 + i * (w + 0.1), y = top + 0.3;
    rect(s, x, y, w, 1.6, i === 0 ? C.red : C.card);
    rect(s, x, y, w, 0.05, i === 0 ? C.gold : C.red);
    txt(s, it[0], x + 0.12, y + 0.12, w - 0.24, 0.3, { fontFace: F.s, fontSize: 8, color: i === 0 ? C.gold : C.gold });
    txt(s, it[1], x + 0.12, y + 0.42, w - 0.24, 0.55, { fontFace: F.s, fontSize: 9.5, color: C.white, lineSpacingMultiple: 0.98 });
    txt(s, it[2], x + 0.12, y + 0.98, w - 0.24, 0.6, { fontFace: F.r, fontSize: 7.5, color: i === 0 ? C.white : C.grey, lineSpacingMultiple: 1.03 });
  });
  label(s, 'SUPPORT ACTIVITIES', 0.6, top + 2.08, 4);
  const sp = [['Product R&D & Systems', 'Metodologi akademi, inovasi rotasi skuad, MUTV'], ['Human Resource Management', 'Rekrutmen, struktur gaji, penegakan disiplin'], ['General Administration', 'Pemisahan peran Gill dan Ferguson; MU International']];
  const sw = (lw - 0.2) / 3;
  sp.forEach((it, i) => {
    const x = 0.6 + i * (sw + 0.1), y = top + 2.38;
    rect(s, x, y, sw, 0.95, C.card2);
    rect(s, x, y, 0.05, 0.95, C.gold);
    txt(s, it[0], x + 0.2, y + 0.1, sw - 0.3, 0.3, { fontFace: F.s, fontSize: 9, color: C.white });
    txt(s, it[1], x + 0.2, y + 0.42, sw - 0.3, 0.5, { fontFace: F.r, fontSize: 7.5, color: C.grey, lineSpacingMultiple: 1.03 });
  });
  const x2 = 0.6 + lw + 0.3, w2 = cw - lw - 0.3;
  label(s, 'DI MANA LETAK KEUNGGULAN BIAYANYA', x2, top, w2);
  const adv = [['Gaji hanya ± 50% pendapatan', 'Rata-rata Premier League 62%, Serie A 68%, Chelsea 81%. Selisih 31 poin dengan Chelsea.', C.red], ['Akademi: pemain tanpa biaya transfer', 'Giggs, Beckham, Butt, Neville bersaudara, Scholes: inti tim 1994–2003 (hlm. 584).', C.red], ['Menjual pemain yang dihargai tinggi', 'Kotor £322 jt, bersih hanya £100 jt (2003–09). Ronaldo dilepas £80 jt, rekor dunia.', C.red], ['Yang melawan arah', 'Amortisasi pemain naik dari £24,2 jt (2005) ke £35,5 jt (2008).', C.gold]];
  adv.forEach((it, i) => {
    const y = top + 0.3 + i * 0.77;
    rect(s, x2, y, w2, 0.7, i % 2 ? C.card2 : C.card);
    rect(s, x2, y, 0.05, 0.7, it[2]);
    txt(s, it[0], x2 + 0.2, y + 0.07, w2 - 0.3, 0.25, { fontFace: F.s, fontSize: 9.5, color: C.white });
    txt(s, it[1], x2 + 0.2, y + 0.32, w2 - 0.3, 0.38, { fontFace: F.r, fontSize: 7.5, color: C.grey, lineSpacingMultiple: 1.03 });
  });
  callout(s, 0.6, top + 3.55, cw, 0.95, 'NILAI BAGI DUA PIHAK BERBEDA', 'Bagi pendukung: prestasi, sejarah, dan pengalaman Old Trafford. Bagi sponsor: akses ke 80 juta pendukung Asia, ditambah bukti bahwa akses itu bekerja, yaitu lompatan AIG ke peringkat 47 merek dunia dalam satu tahun.', { size: 9.5 });
}

// =============== 30. BENCHMARKING MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 4  ·  BENCHMARKING DITERAPKAN', 'YANG DIBANDINGKAN BUKAN PENDAPATAN, TETAPI MARGIN', 'Benchmarking mengubah dugaan VRIN Test menjadi bukti: sistem pengembangan dan penjualan pemain MU memang lebih unggul.', { src: SRC_CASE + ' Table 6.5 (Forbes 2009) dan Table 6.6; margin dihitung dari EBITDA dibagi pendapatan.' });
  s.addNotes('Slide ini benchmarking. Yang dibandingkan bukan besarnya pendapatan, tapi margin: EBITDA dibagi pendapatan (Table 6.5) dan return on sales (Table 6.6).\n\nTiga cara mendapat pemain: membeli bintang (Real Madrid, Chelsea) menghasilkan pendapatan tinggi tapi laba rendah atau rugi; mengembangkan sendiri (Barcelona, Arsenal, Bayern) laba positif dengan pendapatan lebih rendah; MU menggabungkan keduanya, membeli lalu menjual saat klub lain menilai lebih tinggi (hlm. 580, 583).\n\nAngka return on sales 2000–2006 (Table 6.6): MU 12,6%, Arsenal 5,6%, Bayern 4,7%, Real Madrid 0,4%, Chelsea −60,4%, Inter −78,4%.');
  const lw = 6.7;
  rect(s, 0.6, top, lw, 4.55, C.card);
  txt(s, 'MARGIN EBITDA KLUB EROPA, %  ·  DIHITUNG DARI TABLE 6.5', 0.85, top + 0.15, lw - 0.5, 0.25, { fontFace: F.s, fontSize: 8.5, color: C.gold, charSpacing: 1.5 });
  hbars(s, 0.85, top + 0.5, lw - 0.5, 3.9, [
    { label: 'Man United', v: 31.4, fmt: '31,4', hi: true }, { label: 'Barcelona', v: 22.3, fmt: '22,3' }, { label: 'Arsenal', v: 19.3, fmt: '19,3' }, { label: 'AC Milan', v: 17.6, fmt: '17,6' }, { label: 'Juventus', v: 17.5, fmt: '17,5' },
    { label: 'Liverpool', v: 15.8, fmt: '15,8' }, { label: 'Real Madrid', v: 14.1, fmt: '14,1' }, { label: 'Bayern', v: 12.7, fmt: '12,7' }, { label: 'Inter', v: 9.9, fmt: '9,9' }, { label: 'Chelsea', v: -3.1, fmt: '−3,1' }], { labW: 1.5 });
  const x = 0.6 + lw + 0.25, w = cw - lw - 0.25;
  card(s, x, top, w, 2.25, { head: 'Tiga cara mendapat pemain', body: 'Membeli bintang: Real Madrid, Chelsea. Pendapatan tinggi, laba rendah atau rugi.\nMengembangkan sendiri: Barcelona, Arsenal, Bayern. Laba positif dengan pendapatan lebih rendah.\nGabungan: MU membeli bintang, lalu menjual saat klub lain menilai lebih tinggi (hlm. 580, 583).', headSize: 12, bodySize: 9.5 });
  callout(s, x, top + 2.45, w, 2.1, 'BUKTI MANA YANG PALING UNTUNG', 'Return on sales 2000–2006 (Table 6.6): MU 12,6%, Arsenal 5,6%, Bayern 4,7%, Real Madrid 0,4%, Chelsea −60,4%, Inter −78,4%.\n\nBenchmarking mengubah dugaan VRIN Test menjadi bukti: sistem pengembangan dan penjualan pemain memang lebih unggul.', { size: 10 });
}

// =============== 31. COMPETITIVE STRENGTH MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 5  ·  DITERAPKAN', 'COMPETITIVE STRENGTH ASSESSMENT MANCHESTER UNITED', 'Bobot dan rating disusun kelompok kami berdasarkan Table 6.2, 6.3, 6.5, 6.6 dan 6.7 kasus. Isi sel: rating (1–10) / skor tertimbang.', { notes: '33', tsize: 25, src: SRC_CASE + ' Bobot dan rating adalah penilaian kelompok.' });
  const rows = [
    ['Key Success Factor', 'Bobot', 'Man United', 'Real Madrid', 'Barcelona', 'Chelsea', 'Arsenal'],
    ['Kualitas skuad', '0,15', '6 / 0,90', '9 / 1,35', '10 / 1,50', '9 / 1,35', '6 / 0,90'],
    ['Kemampuan manajer', '0,15', '10 / 1,50', '5 / 0,75', '8 / 1,20', '6 / 0,90', '8 / 1,20'],
    ['Akademi & pemandu bakat', '0,10', '9 / 0,90', '3 / 0,30', '9 / 0,90', '3 / 0,30', '8 / 0,80'],
    ['Merek & basis pendukung', '0,15', '10 / 1,50', '9 / 1,35', '7 / 1,05', '5 / 0,75', '6 / 0,90'],
    ['Kemampuan komersial', '0,10', '10 / 1,00', '9 / 0,90', '7 / 0,70', '5 / 0,50', '6 / 0,60'],
    ['Profitabilitas', '0,10', '10 / 1,00', '5 / 0,50', '7 / 0,70', '1 / 0,10', '6 / 0,60'],
    ['Keleluasaan finansial (utang)', '0,10', '4 / 0,40', '7 / 0,70', '9 / 0,90', '5 / 0,50', '2 / 0,20'],
    ['Stadion & matchday', '0,05', '9 / 0,45', '8 / 0,40', '9 / 0,45', '5 / 0,25', '9 / 0,45'],
    ['Rekam jejak prestasi', '0,10', '10 / 1,00', '9 / 0,90', '10 / 1,00', '9 / 0,90', '9 / 0,90'],
    ['TOTAL SKOR TERTIMBANG', '1,00', '8,65', '7,15', '8,40', '5,55', '6,55'],
  ];
  const tbl = tableStyle(rows, { totalRow: true, hiCol: 2, fs: 8.5 });
  tbl[tbl.length - 1][2].options.color = C.gold;
  s.addTable(tbl, { x: 0.6, y: top, w: cw, colW: [3.0, 0.9, 1.64, 1.64, 1.64, 1.64, 1.64], rowH: 0.29 });
  const y = top + 11 * 0.29 + 0.22, w = (cw - 0.5) / 3;
  [['Unggul 0,25 poin', 'MU 8,65 vs Barcelona 8,40. Tipis: cukup satu baris turun untuk menghapusnya.', C.red], ['Turun ke 7,90', 'Kalau rating manajer jatuh dari 10 ke 5 karena ganti pelatih, MU langsung di bawah Barcelona.', C.card], ['Butuh minimal 8,3', 'Rating yang harus dicapai pengganti Ferguson supaya MU sekadar bertahan sejajar Barcelona.', C.card]].forEach((it, i) => {
    const x = 0.6 + i * (w + 0.25);
    rect(s, x, y, w, 1.0, it[2]);
    txt(s, it[0], x + 0.22, y + 0.1, w - 0.4, 0.35, { fontFace: F.x, fontSize: 14, color: it[2] === C.red ? C.gold : C.white });
    txt(s, it[1], x + 0.22, y + 0.45, w - 0.4, 0.55, { fontFace: F.r, fontSize: 9, color: it[2] === C.red ? C.white : C.grey, lineSpacingMultiple: 1.04 });
  });
}

// =============== 32. PRIORITY LIST MU ===============
{
  const { s, top, cw } = page('PERTANYAAN 6  ·  PRIORITY LIST DITERAPKAN', 'ENAM ISU UNTUK DAVID GILL, DITULIS SEBAGAI PERTANYAAN', 'Rumusan mengikuti aturan buku (hlm. 118): priority list berisi pertanyaan, bukan jawaban. Bukti tiap isu dari kasus.', { notes: '34', src: SRC_CASE + ' Rumusan mengikuti Thompson dkk. (2024) hlm. 118.' });
  const iss = [
    ['Bagaimana mengganti Ferguson tanpa merusak sistemnya?', 'Gill belum memutuskan; Ferguson belum mengumumkan pensiun (hlm. 573, 588).'],
    ['Apa yang harus dilakukan soal utang £616 juta?', 'Utang membatasi daya beli, justru saat Manchester City belanja £185 juta (hlm. 579).'],
    ['Bagaimana menambal skuad setelah Ronaldo pergi?', 'Tidak ada lagi pemain MU di peringkat FIFA Table 6.3. Media menunggu apakah kas Ronaldo dipakai membeli Ribery (hlm. 588).'],
    ['Apakah perlu membangun penyangga organisasi?', 'Kasus: seluruh sistem pemanduan, latihan, dan taktik dibangun oleh satu orang (hlm. 573).'],
    ['Bagaimana menjaga pendapatan komersial kalau prestasi turun?', 'Gill: "So long as the team kept winning games … the commercial revenues … would continue to flow" (hlm. 573).'],
    ['Apakah tata kelola tetap aman tanpa Ferguson dan Gill?', 'Dewan hanya berisi enam anak Glazer; peran pasif pemilik berjalan karena dua orang ini diberi kebebasan (hlm. 584).'],
  ];
  const w = (cw - 0.25) / 2, h = 1.12;
  iss.forEach((it, i) => {
    const x = 0.6 + (i % 2) * (w + 0.25), y = top + Math.floor(i / 2) * (h + 0.15);
    const serious = i === 0 || i === 3;
    rect(s, x, y, w, h, serious ? C.red : C.card);
    numCircle(s, i + 1, x + 0.2, y + 0.3, 0.5, serious ? C.gold : C.red);
    txt(s, it[0], x + 0.9, y + 0.12, w - 1.1, 0.5, { fontFace: F.s, fontSize: 11, color: C.white, lineSpacingMultiple: 0.98 });
    txt(s, it[1], x + 0.9, y + 0.6, w - 1.1, 0.5, { fontFace: F.r, fontSize: 8.5, color: serious ? C.white : C.grey, lineSpacingMultiple: 1.03 });
  });
  callout(s, 0.6, top + 3 * h + 0.45, cw, 0.7, 'PEMBACAAN', 'Isu 1 dan 4 (merah) serius dan butuh strategi baru. Isu 2, 3, 5, 6 bisa ditangani dengan menyempurnakan strategi yang ada.', { fill: C.card2, size: 10.5 });
}

// =============== 33. THANKS ===============
{
  const s = fullBleed('mu_assets/trophies.jpg', { notes: '35' });
  rect(s, 0.7, 1.75, 0.4, 0.07, C.gold);
  txt(s, 'STRATEGIC MANAGEMENT  ·  CHAPTER 4', 1.25, 1.6, 7, 0.35, { fontFace: F.s, fontSize: 11, color: C.gold, charSpacing: 3 });
  txt(s, 'TERIMA KASIH', 0.7, 2.15, 7.7, 1.2, { fontFace: F.x, fontSize: 52, color: C.white });
  txt(s, 'Kami membuka sesi tanya jawab dan diskusi', 0.7, 3.35, 7.7, 0.5, { fontFace: F.m, fontSize: 18, color: C.grey });
  rect(s, 0.7, 4.3, 7.5, 1.35, C.red);
  txt(s, 'KELOMPOK 4', 0.95, 4.45, 3, 0.25, { fontFace: F.s, fontSize: 8, color: C.gold, charSpacing: 2 });
  txt(s, 'Fitra Aidila  ·  Aulia Sisca Rahmadiyanti  ·  Bagaskoro  ·  Imam Prayudha  ·  Tegar Awanto', 0.95, 4.72, 7.1, 0.8, { fontFace: F.s, fontSize: 11, color: C.white, lineSpacingMultiple: 1.1 });
  txt(s, 'Strategic Management  ·  Dr. Rangga Almahendra, S.T., M.M.\nChapter 4: Thompson, Peteraf, Gamble & Strickland, 2024 Release ISE   |   Kasus: Manchester United, Robert M. Grant (2010)', 0.7, 5.95, 7.8, 0.8, { fontFace: F.r, fontSize: 9, color: C.grey, lineSpacingMultiple: 1.15 });
}

pptx.writeFile({ fileName: 'deck.pptx' }).then(f => console.log('wrote', f, 'slides', pageNo));
