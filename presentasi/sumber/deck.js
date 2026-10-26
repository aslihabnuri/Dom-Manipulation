// Deck v2 — Studi kasus Alaska Airlines (20 slide), desain mengikuti referensi "Business Introduction"
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');
const path = require('path');
const fs = require('fs');
const { applyTheme } = require(process.env.SKILL_DIR + '/scripts/apply_theme.js');

const OUT = process.argv[2] || 'deck2.pptx';
const IMG = path.join(__dirname, 'img2');

// Palet referensi (disampel dari gambar referensi) + aksen biru
const BG = 'B3D9FE', CREAM = 'F5F2EB', DARK = '2E1616', DARK2 = '4F2D2C', MUTED = '6E5A5A', WHITE = 'FFFFFF';
const BLUE = '3B8BE0', BLUE_L = 'D7EAFD', BLUE_M = '8FC3F5', CORAL = 'E9815E';
const THEME = { name: 'Alaska Case Reference', headFontFace: 'Calibri', bodyFontFace: 'Calibri', colors: { dk1: DARK, lt1: WHITE, dk2: DARK2, lt2: BG, accent1: BLUE, accent2: BLUE_M, accent3: CREAM, accent4: CORAL, accent5: '91BE62', accent6: '0074C8', hlink: BLUE, folHlink: DARK2 } };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.theme = { headFontFace: 'Calibri', bodyFontFace: 'Calibri' };
pres.title = 'Planning and Control di Alaska Airlines — MRP dan ERP, Sequencing and Scheduling';
const W = 13.333, H = 7.5, M = 0.6, CW = W - 2 * M;

pres.defineSlideMaster({
  title: 'REF', background: { color: BG },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.45, w: CW, h: 0.8, fontSize: 28, bold: true, color: DARK, valign: 'middle', align: 'left', margin: 0 } } }],
  slideNumber: { x: 12.3, y: 7.05, w: 0.43, h: 0.28, fontSize: 9, color: DARK2, align: 'right' },
});

// ---------- helpers ----------
function runs(s, base = {}) {
  const out = []; const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g; let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index), options: { ...base } });
    const t = m[0];
    if (t.startsWith('**')) out.push({ text: t.slice(2, -2), options: { ...base, bold: true } });
    else out.push({ text: t.slice(1, -1), options: { ...base, italic: true } });
    last = m.index + t.length;
  }
  if (last < s.length) out.push({ text: s.slice(last), options: { ...base } });
  return out;
}
function T(s, text, x, y, w, h, o = {}) {
  s.addText(typeof text === 'string' ? runs(text) : text, { x, y, w, h, fontSize: o.fs || 14, color: o.color || DARK, bold: !!o.bold, italic: !!o.italic, align: o.align || 'left', valign: o.valign || 'top', margin: o.margin ?? 0, isTextBox: true, paraSpaceAfter: o.psa, objectName: o.name || 'text' });
}
function bullets(s, items, x, y, w, h, o = {}) {
  const arr = [];
  items.forEach((it, i) => {
    const r = runs(it);
    r.forEach((run, j) => {
      if (j === 0) { run.options.bullet = o.numbered ? { type: 'number' } : true; run.options.paraSpaceAfter = o.psa ?? 5; }
      if (j === r.length - 1 && i < items.length - 1) run.options.breakLine = true;
    });
    arr.push(...r);
  });
  s.addText(arr, { x, y, w, h, fontSize: o.fs || 14, color: o.color || DARK, margin: 0, isTextBox: true, valign: 'top', objectName: o.name || 'bullets' });
}
function card(s, x, y, w, h, o = {}) {
  const fill = o.fill || CREAM;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: o.line ? 1.25 : 0.25 }, rectRadius: o.r ?? 0.2, objectName: o.name || 'card' });
}
function pill(s, text, x, y, w, h, o = {}) {
  const fill = o.fill || DARK2;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: o.line ? 1 : 0.25 }, rectRadius: h / 2, objectName: 'pill' });
  s.addText(text, { x, y, w, h, fontSize: o.fs || 10, bold: true, color: o.color || WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: 'pill label' });
}
// lingkaran gambar-tangan di sekitar kata pertama judul (gaya referensi)
function title(s, text, circleChars) {
  s.addText(text, { placeholder: 'title' });
  const n = circleChars || text.split(' ')[0].length;
  const w = n * 0.205 + 0.5;
  s.addShape(pres.ShapeType.ellipse, { x: M - 0.22, y: 0.42, w, h: 0.86, fill: { color: BG, transparency: 100 }, line: { color: BLUE, width: 2.25 }, objectName: 'title circle' });
}
const ICONS = {};
async function iconData(name, color) {
  const key = name + color; if (ICONS[key]) return ICONS[key];
  const Icon = fa[name]; if (!Icon) throw new Error('icon missing ' + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Icon, { color: '#' + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return (ICONS[key] = 'image/png;base64,' + buf.toString('base64'));
}
function iconCircle(s, name, x, y, d, o = {}) {
  const bg = o.bg || BLUE_L, fg = o.fg || DARK;
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg, width: 0.25 }, objectName: 'icon circle' });
  const k = d * 0.5; s.addImage({ data: ICONS[name + fg], x: x + (d - k) / 2, y: y + (d - k) / 2, w: k, h: k, objectName: 'icon ' + name });
}
function img(s, file, x, y, w, h, name) { s.addImage({ path: path.join(IMG, file), x, y, w, h, objectName: name || file }); }
// stiker: pertahankan rasio asli di dalam kotak (x,y,w,h), rata tengah
function sticker(s, file, x, y, w, h, name) {
  const p = path.join(IMG, file); if (!fs.existsSync(p)) return;
  const b = fs.readFileSync(p); const iw = b.readUInt32BE(16), ih = b.readUInt32BE(20); const r = iw / ih;
  let dw = w, dh = w / r; if (dh > h) { dh = h; dw = h * r; }
  s.addImage({ path: p, x: x + (w - dw) / 2, y: y + (h - dh) / 2, w: dw, h: dh, objectName: name || file });
}
function line(s, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: o.color || DARK2, width: o.w || 1.25 }, flipH: (x2 < x1) !== (y2 < y1), objectName: 'line' });
}
function arrowRight(s, x, y, w, h, color = BLUE) { s.addShape(pres.ShapeType.rightArrow, { x, y, w, h, fill: { color }, line: { color, width: 0.25 }, objectName: 'arrow' }); }
function tableRows(header, rows, o = {}) {
  const hd = header.map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: DARK2 }, align: 'center', valign: 'middle', fontSize: o.fs || 12 } }));
  const body = rows.map((r, i) => r.map((c, j) => {
    const cell = typeof c === 'object' ? c : { text: String(c) };
    return { text: cell.text, options: { fontSize: o.fs || 12, color: DARK, fill: { color: cell.fill || (i % 2 ? CREAM : WHITE) }, align: cell.align || (j === 0 ? 'left' : 'center'), valign: 'middle', bold: !!cell.bold } };
  }));
  return [hd, ...body];
}
function addTable(s, rows, x, y, w, colW, o = {}) {
  s.addTable(rows, { x, y, w, colW, rowH: o.rowH, border: { type: 'solid', color: 'E3DCD0', pt: 0.75 }, margin: 0.05, fontFace: 'Calibri', objectName: o.name || 'table', autoPage: false });
}
function slide(section, notes) { const s = pres.addSlide({ masterName: 'REF', sectionTitle: section }); if (notes) s.addNotes(notes); return s; }
function stepCards(s, steps, y, h, o = {}) {
  const gap = 0.25, cw = (CW - 3 * gap) / 4;
  steps.forEach((st, i) => {
    const x = M + i * (cw + gap);
    card(s, x, y, cw, h);
    pill(s, st[0], x + 0.25, y + 0.25, 1.05, 0.32, { fs: 10 });
    iconCircle(s, st[1], x + cw - 0.95, y + 0.2, 0.7);
    T(s, st[2], x + 0.25, y + 0.8, cw - 0.5, 0.62, { fs: 15, bold: true, valign: 'middle' });
    T(s, st[3], x + 0.25, y + 1.5, cw - 0.5, h - 1.65, { fs: o.fs || 12 });
    if (i < 3) arrowRight(s, x + cw + 0.04, y + 1.0, 0.17, 0.3);
  });
}

(async () => {
  const need = ['FaUserTie', 'FaBoxes', 'FaStopwatch', 'FaClipboardCheck', 'FaCalendarAlt', 'FaWrench', 'FaSitemap', 'FaCubes', 'FaCloudRain', 'FaMountain', 'FaServer', 'FaPlaneSlash', 'FaTicketAlt', 'FaUserClock', 'FaCloudSun', 'FaTools', 'FaMoneyCheckAlt', 'FaDatabase', 'FaShieldAlt', 'FaCogs', 'FaSortAmountDown', 'FaHandshake', 'FaQuestionCircle', 'FaMapMarkedAlt', 'FaUsers', 'FaPlane', 'FaPercentage', 'FaDollarSign', 'FaCheckCircle', 'FaExclamationCircle', 'FaLightbulb', 'FaBroadcastTower'];
  for (const n of need) await iconData(n, DARK);
  await iconData('FaDatabase', WHITE);
  ['Pembuka', 'Profil', 'MRP dan ERP', 'Sequencing and Scheduling', 'Penutup'].forEach(t => pres.addSection({ title: t }));

  // 1. Judul
  {
    const s = pres.addSlide({ masterName: 'REF', sectionTitle: 'Pembuka' });
    s.addNotes('Slide judul. Studi kasus 5 (Alaska Airlines) untuk Sesi 7: Planning and Control, subtopik MRP dan ERP serta Sequencing and Scheduling.');
    sticker(s, 'st_plane_snow.png', 0.7, 1.0, 5.3, 5.3, 'ilustrasi pesawat');
    pill(s, 'STUDI KASUS 5  ·  OPERATIONS & TECHNOLOGY MANAGEMENT  ·  SESI 7', 6.5, 1.7, 5.9, 0.4, { fs: 10.5 });
    T(s, 'Planning and Control di Alaska Airlines', 6.5, 2.3, 6.2, 1.9, { fs: 44, bold: true });
    T(s, 'MRP dan ERP  ·  Sequencing and Scheduling', 6.5, 4.3, 6.2, 0.5, { fs: 20, bold: true, color: DARK2 });
    T(s, 'Bagaimana maskapai yang menguasai lebih dari separuh penerbangan di Seattle menjaga jadwal pesawat, kru, dan perawatannya di tengah cuaca, geografi, dan kegagalan sistem.', 6.5, 4.9, 6.2, 0.9, { fs: 13, color: DARK2 });
    T(s, 'Dosen Pengampu  |  Prof. Nur Aini Masruroh, S.T., M.Sc., Ph.D.', 6.5, 6.2, 6.2, 0.4, { fs: 12, bold: true, color: DARK2 });
  }
  // 2. Alur pembahasan
  {
    const s = slide('Pembuka', 'Alur pembahasan: empat langkah, mengikuti dua subtopik sesi.');
    title(s, 'Alur Pembahasan');
    T(s, 'Pembahasan langsung pada kasus dan disusun mengikuti dua subtopik sesi: MRP dan ERP, lalu *sequencing and scheduling*. Setiap langkah memakai temuan langkah sebelumnya.', M, 1.4, 9.0, 0.75, { fs: 14 });
    stepCards(s, [
      ['Langkah 01', 'FaPlane', 'Profil dan permasalahan', 'Skala operasi Alaska Airlines dan empat sumber gangguan terhadap rencana.'],
      ['Langkah 02', 'FaBoxes', 'MRP dan ERP', 'Bagaimana jadwal penerbangan diturunkan menjadi kebutuhan perawatan, suku cadang, dan satu basis data operasi.'],
      ['Langkah 03', 'FaStopwatch', 'Sequencing and scheduling', 'Bagaimana pesawat, kru, hangar, dan staf darat diurutkan dan dijadwalkan, termasuk saat badai.'],
      ['Langkah 04', 'FaClipboardCheck', 'Evaluasi dan rekomendasi', 'Apa yang terbukti kuat, apa yang terbukti lemah, dan apa yang perlu dibenahi.'],
    ], 2.4, 3.3);
    sticker(s, 'sticker_pilot.png', 9.9, 0.95, 2.6, 1.4, 'ilustrasi pilot');
    card(s, M, 6.0, CW, 0.75, { fill: DARK2 });
    T(s, 'Bacaan pendukung: Heizer, Render & Munson (2017) Bab 14–15 (Global Company Profile Alaska Airlines)  ·  Slack, Brandon-Jones & Burgess (2022) Bab 10 dan 14.', M + 0.3, 6.0, CW - 0.6, 0.75, { fs: 12, color: WHITE, valign: 'middle' });
  }
  // 3. Profil
  {
    const s = slide('Profil', 'Profil Alaska Airlines dari fact sheet Alaska Air Group, Heizer et al. (2017), dan rilis SOC 29 Oktober 2025.');
    title(s, 'Tentang Alaska Airlines');
    card(s, M, 1.45, 7.2, 5.35);
    T(s, 'Alaska Airlines adalah maskapai berbasis Seattle–Tacoma (SEA) di bawah Alaska Air Group bersama Horizon Air dan, sejak September 2024, Hawaiian Airlines. Grup ini melayani lebih dari 140 destinasi di Amerika Utara, Amerika Tengah, Asia, dan Pasifik dengan lebih dari 30.000 karyawan dan 392 pesawat pada akhir 2024.', M + 0.3, 1.7, 6.6, 1.55, { fs: 13 });
    T(s, 'SEA adalah bandara tersibuk ke-15 di Amerika Serikat dengan curah hujan sekitar 5 inci per bulan pada musim dingin, namun menjadi bandara AS dengan *on-time departures* tertinggi (85,8%). Sebagian besar kredit jatuh pada Alaska Airlines, yang menguasai lebih dari separuh penerbangan domestik di sana (Heizer et al., 2017).', M + 0.3, 3.3, 6.6, 1.55, { fs: 13 });
    T(s, 'Pada 29 Oktober 2025 FAA memberikan *single operating certificate* bagi Alaska dan Hawaiian: dua merek, satu sistem operasi. Basis kru: Seattle, Anchorage, Portland, San Francisco, Los Angeles, San Diego, dan Honolulu.', M + 0.3, 4.9, 6.6, 1.2, { fs: 13 });
    pill(s, 'Hub: SEA', M + 0.3, 6.15, 1.3, 0.36, { fill: BG, color: DARK, line: DARK2 });
    pill(s, 'Alaska · Horizon · Hawaiian', M + 1.75, 6.15, 2.6, 0.36, { fill: BG, color: DARK, line: DARK2 });
    pill(s, 'Armada inti: Boeing 737', M + 4.5, 6.15, 2.3, 0.36, { fill: BG, color: DARK, line: DARK2 });
    img(s, 'profil.jpg', 8.05, 1.45, 4.68, 4.1, 'foto pesawat Alaska di SEA');
    card(s, 8.05, 5.75, 4.68, 1.05);
    T(s, '"Alaska menemukan keunggulan kompetitif pada kemampuannya melakukan penyesuaian menit terakhir." (Heizer et al., 2017)', 8.25, 5.75, 4.28, 1.05, { fs: 11.5, italic: true, valign: 'middle' });
  }
  // 4. Skala & kinerja
  {
    const s = slide('Profil', 'Skala operasi harian dan kinerja ketepatan waktu (Cirium 2024).');
    title(s, 'Skala Operasi dan Kinerja Ketepatan Waktu');
    card(s, M, 1.45, 6.1, 5.35);
    s.addChart(pres.ChartType.bar, [{ name: 'Ketepatan waktu kedatangan 2024 (%)', labels: ['Delta', 'United', 'Alaska', 'American', 'Southwest'], values: [83.46, 80.93, 79.25, 77.78, 77.77] }], {
      x: M + 0.2, y: 1.6, w: 5.7, h: 4.55, barDir: 'bar', catAxisOrientation: 'maxMin', chartColors: [BLUE_M, BLUE_M, BLUE, BLUE_M, BLUE_M], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00', dataLabelFontSize: 11, dataLabelColor: DARK, dataLabelFontFace: '+mn-lt',
      catAxisLabelFontSize: 12, catAxisLabelColor: DARK, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false,
      showTitle: true, title: 'Ketepatan waktu kedatangan 2024 (%), lima besar Amerika Utara', titleFontSize: 12, titleColor: DARK, titleFontFace: '+mn-lt', valAxisMinVal: 70, valAxisMaxVal: 90, barGapWidthPct: 45, objectName: 'chart ketepatan waktu',
    });
    T(s, 'Sumber: Cirium, 2024 On-Time Performance Review (Januari 2025). Alaska peringkat ke-3 Amerika Utara.', M + 0.3, 6.25, 5.5, 0.4, { fs: 10, color: MUTED, italic: true, align: 'center' });
    const stats = [
      ['FaPlane', '392', 'pesawat pada akhir 2024 (239 Alaska, 44 Horizon, 71 Hawaiian)'],
      ['FaMapMarkedAlt', '140+', 'destinasi di empat kawasan'],
      ['FaUsers', '30.000+', 'karyawan Alaska Air Group'],
      ['FaUserTie', '4.500+', 'pilot dan awak kabin dijadwalkan setiap hari'],
      ['FaPercentage', '>50%', 'penerbangan domestik di SEA dioperasikan Alaska'],
      ['FaDollarSign', 'US$18 juta', 'penghematan per tahun dari teknologi penjadwalan ulang'],
    ];
    const sx = M + 6.35, sw = (CW - 6.35 - 0.2) / 2, sh = (5.35 - 2 * 0.2) / 3;
    stats.forEach((st, i) => {
      const x = sx + (i % 2) * (sw + 0.2), y = 1.45 + Math.floor(i / 2) * (sh + 0.2);
      card(s, x, y, sw, sh);
      iconCircle(s, st[0], x + 0.2, y + 0.2, 0.5);
      T(s, st[1], x + 0.85, y + 0.15, sw - 1.0, 0.6, { fs: 22, bold: true, valign: 'middle' });
      T(s, st[2], x + 0.2, y + 0.82, sw - 0.4, sh - 0.9, { fs: 11 });
    });
    T(s, 'Sumber angka: Alaska Air Group fact sheet; Aviacionline (2025); Heizer et al. (2017).', sx, 6.55, CW - 6.35, 0.3, { fs: 9, color: MUTED, italic: true });
  }
  // 5. Permasalahan
  {
    const s = slide('Profil', 'Empat sumber gangguan: cuaca, geografi, kegagalan IT 2025, grounding MAX 9 2024.');
    title(s, 'Empat Sumber Gangguan terhadap Rencana');
    T(s, 'Setiap gangguan memukul rencana pada titik yang berbeda: perencanaan material dan perawatan (MRP), integrasi sistem (ERP), atau penjadwalan jangka pendek (*scheduling*).', M, 1.4, 9.2, 0.7, { fs: 14 });
    sticker(s, 'st_plane_snow.png', 10.2, 0.9, 2.4, 1.6, 'ilustrasi pesawat salju');
    const probs = [
      ['01', 'FaCloudRain', 'Cuaca Seattle', 'Hujan beku dan salju memaksa rencana pembatalan 50–80% penerbangan pada satu hari badai Desember; keputusan harus direvisi setiap beberapa jam (Heizer et al., 2017).', 'Scheduling'],
      ['02', 'FaMountain', 'Geografi Alaska', 'Juneau (*wind shear*), Sitka (landasan tunggal di tanah sempit), dan Kodiak (landasan berujung gunung; hanya kapten boleh mendarat) membatasi pesawat dan kru yang dapat ditugaskan.', 'Scheduling kru'],
      ['03', 'FaServer', 'Kegagalan sistem terintegrasi', '20 Juli 2025: kegagalan perangkat keras pusat data, *ground stop* ±3 jam, >150 pembatalan. 23 Oktober 2025: kegagalan pusat data utama, ±8 jam, >400 pembatalan, ±49.000 penumpang.', 'ERP'],
      ['04', 'FaPlaneSlash', 'Grounding 737 MAX 9', 'Januari 2024: 65 pesawat dikandangkan untuk inspeksi serentak; sekitar 3.000 pembatalan dalam sebulan; dampak finansial sekitar US$150 juta.', 'MRP perawatan'],
    ];
    const cw = (CW - 0.25) / 2, ch = 2.2;
    probs.forEach((p, i) => {
      const x = M + (i % 2) * (cw + 0.25), y = 2.25 + Math.floor(i / 2) * (ch + 0.2);
      card(s, x, y, cw, ch);
      pill(s, p[0], x + 0.25, y + 0.25, 0.5, 0.5, { fs: 13 });
      iconCircle(s, p[1], x + cw - 0.9, y + 0.2, 0.6);
      T(s, p[2], x + 0.9, y + 0.25, cw - 2.0, 0.5, { fs: 15, bold: true, valign: 'middle' });
      T(s, p[3], x + 0.25, y + 0.9, cw - 0.5, 1.0, { fs: 11.5 });
      pill(s, 'Dimensi: ' + p[4], x + 0.25, y + ch - 0.45, 2.1, 0.3, { fill: BG, color: DARK, line: DARK2, fs: 9.5 });
    });
  }
  // 6. Divider subtopik 1
  {
    const s = slide('MRP dan ERP', 'Pembuka subtopik 1.');
    img(s, 'divider_mrp.png', M, 0.55, CW, 3.6, 'foto hangar perawatan');
    pill(s, 'SUBTOPIK 1', M, 4.45, 1.5, 0.38, { fs: 11 });
    T(s, 'MRP dan ERP di Alaska Airlines', M, 4.95, CW, 0.9, { fs: 36, bold: true });
    T(s, 'Dari jadwal penerbangan menjadi kebutuhan perawatan dan suku cadang, lalu menjadi satu basis data operasi yang menyatukan semua fungsi.', M, 5.9, 9.5, 0.9, { fs: 15, color: DARK2 });
  }
  // 7. Jadwal → kebutuhan suku cadang
  {
    const s = slide('MRP dan ERP', 'Rantai turunan: flight timetable → rencana perawatan → work package → kebutuhan bersih suku cadang dan teknisi.');
    title(s, 'Dari Jadwal Penerbangan ke Kebutuhan Suku Cadang');
    T(s, 'Permintaan suku cadang di Alaska bersifat *dependent*: dihitung dari jadwal, bukan diramalkan. Rantai turunannya berjalan dalam empat langkah.', M, 1.4, 9.5, 0.65, { fs: 14 });
    sticker(s, 'st_parts.png', 10.3, 0.85, 2.3, 1.5, 'ilustrasi suku cadang');
    stepCards(s, [
      ['Langkah 01', 'FaCalendarAlt', 'Flight timetable', 'Jadwal terpublikasi berfungsi sebagai *master schedule*: pesawat apa terbang ke mana, kapan, dengan berapa jam dan siklus.'],
      ['Langkah 02', 'FaWrench', 'Rencana perawatan', 'Jam terbang dan siklus per *tail number* menentukan kapan setiap *check* jatuh tempo; inilah jadwal induk bagi hangar.'],
      ['Langkah 03', 'FaSitemap', 'Work package', 'Setiap *check* diurai menjadi *task card*: daftar komponen dan jam kerja (*bill of material* dan *bill of labor*).'],
      ['Langkah 04', 'FaCubes', 'Kebutuhan bersih', 'Kebutuhan dikurangi stok dan pesanan berjalan, lalu digeser mundur sebesar *lead time*: pesanan suku cadang dan slot teknisi dirilis tepat waktu.'],
    ], 2.3, 3.45, { fs: 11.5 });
    card(s, M, 6.0, CW, 0.78, { fill: DARK2 });
    T(s, 'Akibatnya, kesalahan pada satu langkah merambat ke hilir: jadwal penerbangan yang berubah mengubah jatuh tempo perawatan, dan jatuh tempo yang bergeser mengubah kapan suku cadang harus dipesan.', M + 0.3, 6.0, CW - 0.6, 0.78, { fs: 12.5, color: WHITE, valign: 'middle' });
  }
  // 8. Contoh net requirements plan
  {
    const s = slide('MRP dan ERP', 'Contoh perhitungan kebutuhan bersih brake assembly untuk heavy check.');
    title(s, 'Contoh Perhitungan: Brake Assembly untuk Heavy Check');
    card(s, M, 1.45, CW, 1.1);
    T(s, 'Ilustrasi dengan data sederhana: 4 unit *brake assembly* per paket *heavy check*; *lead time* pemasok 2 minggu; stok awal 6 unit; pesanan 4 unit tiba pada minggu 2; kebijakan *lot-for-lot*. Rencana perawatan: 2 paket pada minggu 5, 1 paket pada minggu 7, dan 2 paket pada minggu 8.', M + 0.3, 1.45, CW - 0.6, 1.1, { fs: 13, valign: 'middle' });
    const data = [
      ['Gross requirements (4 × paket)', [0, 0, 0, 0, 8, 0, 4, 8]],
      ['Scheduled receipts', [0, 4, 0, 0, 0, 0, 0, 0]],
      ['Projected on hand (awal 6)', [6, 10, 10, 10, 2, 2, 0, 0]],
      ['Net requirements', [0, 0, 0, 0, 0, 0, 2, 8]],
      ['Planned order receipts', [0, 0, 0, 0, 0, 0, 2, 8]],
      ['Planned order releases', [0, 0, 0, 0, 2, 8, 0, 0]],
    ];
    const rows = tableRows(['Minggu', '1', '2', '3', '4', '5', '6', '7', '8'], data.map((d, ri) => [{ text: d[0], bold: true }, ...d[1].map(v => ({ text: v === 0 ? '–' : String(v), bold: v !== 0 && ri === 5, fill: v !== 0 && ri === 5 ? BLUE_L : undefined }))]), { fs: 12 });
    addTable(s, rows, M, 2.8, CW, [3.3, ...Array(8).fill((CW - 3.3) / 8)], { rowH: 0.37 });
    card(s, M, 5.55, CW, 1.25, { fill: DARK2 });
    T(s, '**Pembacaan:** pesanan 2 unit dirilis pada minggu 5 dan 8 unit pada minggu 6 agar tiba tepat pada minggu 7 dan 8. Tanpa perhitungan ini, suku cadang datang terlambat sehingga pesawat menganggur (*aircraft-on-ground*) atau datang terlalu awal sehingga menumpuk di gudang. Pada skala 392 pesawat, logika yang sama dijalankan oleh sistem perawatan untuk ribuan komponen.', M + 0.3, 5.55, CW - 0.6, 1.25, { fs: 12, color: WHITE, valign: 'middle' });
  }
  // 9. 2024 vs 2026
  {
    const s = slide('MRP dan ERP', 'Grounding MAX 9 (Januari 2024) sebagai lonjakan kebutuhan; Tailsight (April 2026) sebagai perencanaan berbasis kapasitas.');
    title(s, 'Perencanaan Perawatan: Januari 2024 versus April 2026');
    const cw = (CW - 0.3) / 2;
    [['Januari 2024', 'Grounding 737 MAX 9', 'Setelah insiden pintu *plug* pada 5 Januari 2024, FAA mengandangkan 737 MAX 9. Alaska harus menginspeksi 65 pesawat sekaligus: kebutuhan kotor melonjak pada satu periode, kapasitas hangar dan teknisi dijadwalkan ulang, hingga 150 penerbangan per hari dibatalkan selama tiga minggu (sekitar 3.000 dalam sebulan), dan dampak finansial mencapai sekitar US$150 juta. Pesawat pertama kembali terbang 26 Januari 2024.', 'FaPlaneSlash'],
     ['April 2026', 'Kemitraan dengan Tailsight', 'Alaska mengumumkan investasi dan kemitraan multitahun dengan Tailsight, platform optimasi perencanaan perawatan. Platform ini menggabungkan data sistem perawatan, jadwal penerbangan, staf, *station capability rules*, dan ketersediaan suku cadang menjadi rencana yang memperhitungkan tenaga kerja, suku cadang, dan kesiapan pesawat. Tujuannya: utilisasi tenaga kerja dan suku cadang naik, waktu *aircraft-on-ground* turun. Tim perawatan Alaska ikut merumuskan spesifikasinya selama dua tahun.', 'FaLightbulb']].forEach((c, i) => {
      const x = M + i * (cw + 0.3);
      card(s, x, 1.45, cw, 4.3);
      pill(s, c[0], x + 0.3, 1.7, 1.5, 0.34, { fs: 10.5 });
      iconCircle(s, c[3], x + cw - 0.95, 1.65, 0.65);
      T(s, c[1], x + 0.3, 2.15, cw - 1.4, 0.5, { fs: 17, bold: true, valign: 'middle' });
      T(s, c[2], x + 0.3, 2.75, cw - 0.6, 2.9, { fs: 13.5 });
    });
    card(s, M, 5.95, CW, 0.85, { fill: DARK2 });
    T(s, '**Pergeseran yang terjadi:** dari perencanaan kebutuhan yang mengabaikan kapasitas (*infinite loading*) menuju perencanaan tertutup yang memasukkan slot hangar, teknisi, dan suku cadang sebagai kendala (*closed-loop*, kapasitas berhingga).', M + 0.3, 5.95, CW - 0.6, 0.85, { fs: 12.5, color: WHITE, valign: 'middle' });
  }
  // 10. Integrasi sistem (ERP)
  {
    const s = slide('MRP dan ERP', 'Sistem operasi terintegrasi Alaska dan nilai integrasi yang terbukti, termasuk integrasi Hawaiian.');
    title(s, 'Integrasi Sistem ala ERP: Satu Basis Data Operasi');
    card(s, M, 1.45, 5.6, 5.35);
    const nodes = [['Reservasi & check-in', 'FaTicketAlt'], ['Penjadwalan kru', 'FaUserClock'], ['Flight dispatch & cuaca', 'FaCloudSun'], ['Perawatan & suku cadang', 'FaTools'], ['Keuangan & SDM', 'FaMoneyCheckAlt']];
    const cx = M + 2.8, cy = 4.2;
    const pos = nodes.map((n, i) => { const a = -Math.PI / 2 + i * (2 * Math.PI / 5); return [cx + 1.85 * Math.cos(a), cy + 1.45 * Math.sin(a)]; });
    pos.forEach(p => line(s, cx, cy, p[0], p[1], { color: BLUE_M, w: 1.5 }));
    nodes.forEach((n, i) => { const [nx, ny] = pos[i]; iconCircle(s, n[1], nx - 0.32, ny - 0.32, 0.64, { bg: BLUE_L }); T(s, n[0], nx - 0.85, ny + 0.36, 1.7, 0.34, { fs: 10.5, bold: true, align: 'center' }); });
    s.addShape(pres.ShapeType.ellipse, { x: cx - 1.05, y: cy - 0.6, w: 2.1, h: 1.2, fill: { color: DARK2 }, line: { color: DARK2, width: 0.25 }, objectName: 'hub' });
    s.addImage({ data: ICONS['FaDatabase' + WHITE], x: cx - 0.17, y: cy - 0.48, w: 0.34, h: 0.34, objectName: 'icon FaDatabase' });
    T(s, 'Basis data operasi bersama', cx - 0.95, cy - 0.1, 1.9, 0.6, { fs: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, 'Infrastruktur hibrida: pusat data sendiri untuk beban kritis ditambah layanan cloud (GeekWire, 2025).', M + 0.3, 6.3, 5.0, 0.45, { fs: 9.5, color: MUTED, italic: true });
    const rx = M + 5.85, rw = CW - 5.85;
    card(s, rx, 1.45, rw, 5.35);
    iconCircle(s, 'FaCheckCircle', rx + 0.3, 1.7, 0.6);
    T(s, 'Nilai integrasi yang terbukti', rx + 1.05, 1.7, rw - 1.3, 0.6, { fs: 17, bold: true, valign: 'middle' });
    bullets(s, [
      '**Penjadwalan ulang lintas fungsi dalam hitungan jam.** Saat cuaca memburuk, data pesawat, kru, dan penumpang yang sama dipakai untuk menyusun jadwal alternatif dan memberi tahu penumpang; Alaska menaksir penghematan US$18 juta per tahun (Heizer et al., 2017).',
      '**Integrasi Hawaiian Airlines.** *Single operating certificate* dicapai 29 Oktober 2025 setelah upaya multifase selama setahun di banyak departemen; sistem layanan penumpang tunggal menyusul pada 2026. Dua merek kini berbagi satu set proses dan data operasi.',
      '**Perencanaan perawatan berbasis data bersama.** Tailsight menarik data dari sistem perawatan, jadwal penerbangan, staf, dan suku cadang sekaligus; nilainya bergantung pada konsistensi data di seluruh sistem.',
    ], rx + 0.3, 2.5, rw - 0.6, 4.2, { fs: 12, psa: 8 });
  }
  // 11. Risiko integrasi: dua outage
  {
    const s = slide('MRP dan ERP', 'Dua outage 2025 sebagai bukti risiko integrasi (single point of failure).');
    title(s, 'Risiko Integrasi: Dua Outage pada 2025');
    const cw = (CW - 2.9 - 0.3 - 0.3) / 2;
    [['20 Juli 2025', 'Kegagalan perangkat keras pusat data', 'Satu perangkat keras multiredundan buatan pihak ketiga gagal secara tak terduga di pusat data dan melumpuhkan beberapa sistem operasional sekaligus. Alaska meminta *ground stop* sekitar tiga jam agar pesawat tetap berada di posisi, lalu membatalkan lebih dari 150 penerbangan pada hari-hari berikutnya. Alaska menyatakan telah "mengeraskan" sistemnya setelah kejadian ini.'],
     ['23 Oktober 2025', 'Kegagalan pusat data utama', 'Pusat data utama gagal; *ground stop* berlangsung sekitar delapan jam, lebih dari 400 penerbangan Alaska dan Horizon dibatalkan, dan sekitar 49.000 penumpang terdampak. Alaska menegaskan ini bukan serangan siber, mendatangkan pakar eksternal untuk mendiagnosis seluruh infrastruktur IT, dan mengganti perangkat keras pusat data bersama vendornya.']].forEach((c, i) => {
      const x = M + i * (cw + 0.3);
      card(s, x, 1.45, cw, 4.35);
      pill(s, c[0], x + 0.3, 1.7, 1.6, 0.34, { fs: 10.5 });
      iconCircle(s, 'FaServer', x + cw - 0.95, 1.65, 0.65);
      T(s, c[1], x + 0.3, 2.15, cw - 1.4, 0.55, { fs: 16, bold: true, valign: 'middle' });
      T(s, c[2], x + 0.3, 2.8, cw - 0.6, 2.9, { fs: 12 });
    });
    card(s, M + 2 * (cw + 0.3), 1.45, 2.9, 4.35);
    sticker(s, 'st_dispatcher.png', M + 2 * (cw + 0.3) + 0.2, 1.65, 2.5, 2.5, 'ilustrasi dispatcher');
    T(s, 'Sumber: CBS News (Juli 2025); GeekWire (Oktober 2025); pernyataan Alaska Airlines.', M + 2 * (cw + 0.3) + 0.2, 4.35, 2.5, 1.3, { fs: 10, color: MUTED, italic: true, align: 'center', valign: 'middle' });
    card(s, M, 5.95, CW, 0.85, { fill: DARK2 });
    T(s, '**Pelajaran:** semakin terintegrasi sistem, semakin besar dampak satu titik kegagalan (*single point of failure*). Nilai integrasi hanya terwujud bila sistemnya tetap hidup; ketahanan infrastruktur harus direncanakan sekeras jadwalnya.', M + 0.3, 5.95, CW - 0.6, 0.85, { fs: 12.5, color: WHITE, valign: 'middle' });
  }
  // 12. Divider subtopik 2
  {
    const s = slide('Sequencing and Scheduling', 'Pembuka subtopik 2.');
    img(s, 'divider_sched.png', M, 0.55, CW, 3.6, 'foto deicing');
    pill(s, 'SUBTOPIK 2', M, 4.45, 1.5, 0.38, { fs: 11 });
    T(s, 'Sequencing and Scheduling di Alaska Airlines', M, 4.95, CW, 0.9, { fs: 36, bold: true });
    T(s, 'Mengurutkan dan menjadwalkan pesawat, kru, hangar, dan staf darat dalam horizon hari dan jam, termasuk ketika cuaca menjadi musuh.', M, 5.9, 9.5, 0.9, { fs: 15, color: DARK2 });
  }
  // 13. Apa yang dijadwalkan setiap hari
  {
    const s = slide('Sequencing and Scheduling', 'Tiga objek penjadwalan harian Alaska (Heizer et al., Tabel 15.1).');
    title(s, 'Apa yang Dijadwalkan Alaska Setiap Hari');
    card(s, M, 1.45, CW, 5.35);
    const items = [
      ['Objek 01', 'c_hangar.png', 'Pesawat dan perawatan', 'Sekitar 150 pesawat per hari pada masa penulisan Heizer et al. (2017), kini 392 pesawat grup; slot hangar dan *line maintenance* di setiap basis harus dijadwalkan di sela rotasi pesawat.'],
      ['Objek 02', 'c_ops.png', 'Jadwal keberangkatan dan kru', 'Lebih dari 4.500 pilot dan awak kabin dijadwalkan dengan program komputer besar, tunduk pada batas jam tugas FAA, kontrak serikat, dan *preferential bidding system*.'],
      ['Objek 03', 'c_crew.png', 'Gate, tiket, dan katering', 'Personel *gate* dan tiket, katering, serta *deicing* yang kebutuhannya berubah menurut hari, jam, dan cuaca; dijadwalkan dengan pola siklis.'],
    ];
    const cw = (CW - 0.6 - 2 * 0.3) / 3;
    items.forEach((it, i) => {
      const x = M + 0.3 + i * (cw + 0.3);
      img(s, it[1], x + (cw - 2.0) / 2, 1.7, 2.0, 2.0, it[2]);
      pill(s, it[0], x + cw / 2 - 0.6, 3.85, 1.2, 0.32, { fs: 10 });
      T(s, it[2], x, 4.3, cw, 0.45, { fs: 15, bold: true, align: 'center', valign: 'middle' });
      T(s, it[3], x + 0.1, 4.8, cw - 0.2, 1.4, { fs: 11.5, align: 'center' });
    });
    T(s, 'Ketiganya saling terkait: perubahan satu jadwal merambat ke dua lainnya dan ke puluhan bandara (*ripple effect*). Sumber: Heizer et al. (2017), Tabel 15.1.', M + 0.3, 6.25, CW - 0.6, 0.45, { fs: 11, color: MUTED, italic: true, align: 'center' });
  }
  // 14. Satu hari badai
  {
    const s = slide('Sequencing and Scheduling', 'Lima titik waktu pada satu hari badai Desember di Seattle (Heizer et al., 2017, hlm. 600).');
    title(s, 'Satu Hari Badai di Seattle: Jadwal Direvisi Lima Kali');
    const tl = [
      ['04.00', 'Hujan dengan kemungkinan salju ringan.', 'Membahas status pesawat dan kemungkinan kebutuhan pembatalan.'],
      ['10.00', 'Hujan beku setelah pukul 17.00.', 'Menyiapkan truk *deicing*; menyusun rencana pembatalan 50–80% penerbangan setelah pukul 18.00.'],
      ['13.30', 'Hujan berubah menjadi salju.', 'Membatalkan separuh penerbangan pukul 18.00–10.00; memberi tahu penumpang; mengalihkan rute pesawat.'],
      ['17.00', 'Salju lebih sedikit dari perkiraan.', 'Terus menghubungi penumpang dan mengatur penerbangan alternatif.'],
      ['22.00', 'Salju mereda.', 'Mencarikan hotel bagi 600 penumpang yang terdampar oleh badai.'],
    ];
    const cw = (CW - 4 * 0.2) / 5;
    line(s, M + cw / 2, 1.72, M + 4 * (cw + 0.2) + cw / 2, 1.72, { color: BLUE, w: 2 });
    tl.forEach((t, i) => {
      const x = M + i * (cw + 0.2), y = 2.05, h = 3.0;
      s.addShape(pres.ShapeType.ellipse, { x: x + cw / 2 - 0.1, y: 1.62, w: 0.2, h: 0.2, fill: { color: BLUE }, line: { color: BLUE, width: 0.25 }, objectName: 'dot' });
      card(s, x, y, cw, h);
      pill(s, t[0], x + cw / 2 - 0.5, y - 0.17, 1.0, 0.34, { fs: 11 });
      T(s, 'Prakiraan', x + 0.2, y + 0.35, cw - 0.4, 0.28, { fs: 10.5, bold: true, color: BLUE });
      T(s, t[1], x + 0.2, y + 0.63, cw - 0.4, 0.75, { fs: 11 });
      T(s, 'Tindakan', x + 0.2, y + 1.4, cw - 0.4, 0.28, { fs: 10.5, bold: true, color: CORAL });
      T(s, t[2], x + 0.2, y + 1.68, cw - 0.4, 1.25, { fs: 11 });
    });
    card(s, M, 5.3, CW, 1.5, { fill: DARK2 });
    T(s, '**Pola:** prakiraan direvisi lima kali dalam 18 jam, dan setiap revisi memicu tindakan baru: menyiapkan kapasitas *deicing*, memangkas jadwal, mengalihkan rute pesawat, lalu mengurus penumpang. Alaska menaksir teknologi penjadwalan ulangnya menghemat US$18 juta per tahun dengan menekan pembatalan dan keterlambatan (Heizer et al., 2017).', M + 0.3, 5.3, CW - 0.6, 1.5, { fs: 12.5, color: WHITE, valign: 'middle' });
  }
  // 15. Pusat operasi & kru
  {
    const s = slide('Sequencing and Scheduling', 'Flight Operations Department (andon) dan penjadwalan kru dengan kendala legalitas.');
    title(s, 'Pusat Operasi Penerbangan dan Penjadwalan Kru');
    img(s, 'ops.png', M, 1.45, 4.4, 3.28, 'foto pusat operasi');
    card(s, M, 4.95, 4.4, 1.85);
    T(s, 'US$18 juta', M + 0.3, 5.05, 3.8, 0.6, { fs: 24, bold: true, valign: 'middle' });
    T(s, 'penghematan per tahun dari teknologi yang menekan pembatalan dan keterlambatan (Heizer et al., 2017).', M + 0.3, 5.7, 3.8, 1.0, { fs: 11.5 });
    const rx = M + 4.65, rw = CW - 4.65;
    card(s, rx, 1.45, rw, 2.6);
    iconCircle(s, 'FaBroadcastTower', rx + 0.3, 1.65, 0.6);
    T(s, 'Flight Operations Department, Seattle', rx + 1.05, 1.65, rw - 1.3, 0.6, { fs: 16, bold: true, valign: 'middle' });
    T(s, 'Puluhan layar memantau penerbangan yang sedang berlangsung, peta meteorologi, dan pola cuaca. Lampu *andon* menandai status: hijau normal, kuning perlu perhatian, merah darurat. Dengan model penjadwalan matematis, departemen ini menyusun jadwal alternatif, mengalihkan rute, memastikan kru tersedia, dan memberi tahu penumpang secepat mungkin.', rx + 0.3, 2.3, rw - 0.6, 1.7, { fs: 12 });
    card(s, rx, 4.25, rw, 2.55);
    iconCircle(s, 'FaUserTie', rx + 0.3, 4.45, 0.6);
    T(s, 'Penjadwalan 4.500+ pilot dan awak kabin', rx + 1.05, 4.45, rw - 1.3, 0.6, { fs: 16, bold: true, valign: 'middle' });
    T(s, 'Kru ditugaskan melalui *preferential bidding system* di bawah batas jam tugas FAA dan kontrak serikat: kapasitas berhingga dengan kendala legalitas yang diperiksa secara *real time*. Kodiak menambah kendala khusus karena hanya kapten yang boleh mendarat, sehingga *pairing* kru untuk rute Alaska tidak bebas. Sistem pelatihan dan kualifikasi kru (Fox TMS, 2024) menjaga data kualifikasi tetap selaras dengan jadwal.', rx + 0.3, 5.1, rw - 0.6, 1.65, { fs: 12 });
  }
  // 16. Urutan pekerjaan hangar
  {
    const s = slide('Sequencing and Scheduling', 'Aturan prioritas pada lima paket pekerjaan hangar (data HRM Contoh 15.4) dan critical ratio untuk AOG.');
    title(s, 'Mengurutkan Pekerjaan di Hangar');
    card(s, M, 1.45, 4.9, 5.35);
    T(s, 'Ilustrasi: lima paket pekerjaan perawatan A–E dengan waktu proses 6, 2, 8, 3, 9 hari dan *due date* 8, 6, 18, 15, 23 hari (data HRM Contoh 15.4), diurutkan dengan empat aturan prioritas.', M + 0.25, 1.6, 4.4, 1.0, { fs: 12 });
    s.addChart(pres.ChartType.bar, [{ name: 'Waktu penyelesaian rata-rata (hari)', labels: ['FCFS', 'SPT', 'EDD', 'LPT'], values: [15.4, 13.0, 13.6, 20.6] }], {
      x: M + 0.15, y: 2.65, w: 4.6, h: 2.7, barDir: 'col', chartColors: [BLUE_M, BLUE, BLUE_M, CORAL], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0', dataLabelFontSize: 10, dataLabelColor: DARK, dataLabelFontFace: '+mn-lt',
      catAxisLabelFontSize: 10.5, catAxisLabelColor: DARK, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false,
      showTitle: true, title: 'Waktu penyelesaian rata-rata (hari) per aturan', titleFontSize: 11, titleColor: DARK, titleFontFace: '+mn-lt', valAxisMinVal: 0, valAxisMaxVal: 25, barGapWidthPct: 60, objectName: 'chart aturan prioritas',
    });
    T(s, 'FCFS = urutan kedatangan; SPT = waktu proses terpendek dahulu; EDD = tenggat terdekat dahulu; LPT = waktu proses terpanjang dahulu.', M + 0.25, 5.45, 4.4, 1.2, { fs: 10.5, color: MUTED, italic: true });
    const rx = M + 5.15, rw = CW - 5.15, tw = rw - 0.5;
    card(s, rx, 1.45, rw, 5.35);
    const rows = tableRows(['Aturan', 'Urutan', 'Waktu penyelesaian rata-rata (hari)', 'Utilisasi (%)', 'Jumlah pekerjaan rata-rata', 'Keterlambatan rata-rata (hari)'], [
      [{ text: 'FCFS', bold: true }, 'A–B–C–D–E', '15,4', '36,4', '2,75', '2,2'],
      [{ text: 'SPT', bold: true }, 'B–D–A–C–E', { text: '13,0', bold: true, fill: BLUE_L }, { text: '43,1', bold: true, fill: BLUE_L }, { text: '2,32', bold: true, fill: BLUE_L }, '1,8'],
      [{ text: 'EDD', bold: true }, 'B–A–D–C–E', '13,6', '41,2', '2,43', { text: '1,2', bold: true, fill: BLUE_L }],
      [{ text: 'LPT', bold: true }, 'E–C–A–D–B', '20,6', '27,2', '3,68', '9,6'],
    ], { fs: 10.5 });
    addTable(s, rows, rx + 0.25, 1.65, tw, [0.75, 1.2, 1.2, 0.95, 1.15, tw - 5.25], { rowH: 0.38 });
    card(s, rx + 0.25, 4.3, tw, 2.3, { fill: WHITE });
    T(s, '**Pembacaan untuk Alaska:** SPT memaksimalkan *throughput* hangar (tiga kriteria terbaik), EDD meminimalkan keterlambatan terhadap tenggat kelaikan udara, LPT terburuk di semua kriteria. Untuk pesawat AOG dipakai *critical ratio* (sisa waktu ÷ sisa pekerjaan) yang diperbarui setiap hari: nilai di bawah 1 berarti sudah tertinggal dan didahulukan. Tidak ada satu aturan yang unggul di semua kriteria, sehingga aturan dipilih per situasi.', rx + 0.4, 4.3, tw - 0.3, 2.3, { fs: 11.5, valign: 'middle' });
  }
  // 17. Alur dua tahap & staf darat
  {
    const s = slide('Sequencing and Scheduling', 'Johnson\'s rule pada alur inspeksi lalu perbaikan (data HRM Contoh 15.6) dan jadwal siklis petugas gate (data HRM Contoh 15.8).');
    title(s, 'Alur Dua Tahap di Hangar dan Staf Darat Musim Dingin');
    const lw = 6.3;
    card(s, M, 1.45, lw, 5.35);
    T(s, 'Alur inspeksi lalu perbaikan', M + 0.3, 1.65, lw - 0.6, 0.4, { fs: 16, bold: true });
    T(s, 'Lima komponen melewati dua pusat kerja berurutan: inspeksi, lalu perbaikan dan uji (jam): A 5/2, B 3/6, C 8/4, D 10/7, E 7/12. Dengan *Johnson\'s rule* (waktu terpendek di tahap pertama dijadwalkan paling awal, di tahap kedua paling akhir), urutan **B–E–D–C–A** menyelesaikan semuanya dalam **35 jam**; urutan sembarang A–B–C–D–E memerlukan 45 jam.', M + 0.3, 2.1, lw - 0.6, 1.75, { fs: 12 });
    const gx = M + 1.4, gy = 4.1, gw = lw - 1.8, scale = gw / 35, rh = 0.46;
    const g1 = [['B', 0, 3], ['E', 3, 10], ['D', 10, 20], ['C', 20, 28], ['A', 28, 33]];
    const g2 = [['B', 3, 9], ['E', 10, 22], ['D', 22, 29], ['C', 29, 33], ['A', 33, 35]];
    T(s, 'Inspeksi', M + 0.3, gy, 1.05, rh, { fs: 11, bold: true, valign: 'middle' });
    T(s, 'Perbaikan', M + 0.3, gy + rh + 0.08, 1.05, rh, { fs: 11, bold: true, valign: 'middle' });
    [[g1, 0, BLUE], [g2, 1, BLUE_M]].forEach(([g, r, col]) => g.forEach(b => {
      const bx = gx + b[1] * scale, bw = (b[2] - b[1]) * scale, by = gy + r * (rh + 0.08);
      s.addShape(pres.ShapeType.roundRect, { x: bx + 0.02, y: by, w: bw - 0.04, h: rh, fill: { color: col }, line: { color: col, width: 0.25 }, rectRadius: 0.07, objectName: 'gantt bar' });
      T(s, b[0], bx, by, bw, rh, { fs: 10.5, bold: true, color: r ? DARK : WHITE, align: 'center', valign: 'middle' });
    }));
    [0, 10, 20, 30].forEach(t => T(s, String(t), gx + t * scale - 0.3, gy + 2 * rh + 0.14, 0.6, 0.25, { fs: 9.5, align: 'center', color: MUTED }));
    T(s, '35 jam', gx + gw - 0.55, gy + 2 * rh + 0.14, 0.75, 0.25, { fs: 9.5, color: MUTED, align: 'right' });
    T(s, 'Pusat kerja kedua menganggur hanya saat menunggu pekerjaan pertama; pola ini dipakai untuk *shop* komponen dua tahap.', M + 0.3, 5.55, lw - 0.6, 1.1, { fs: 11, color: MUTED, italic: true });
    const rx = M + lw + 0.3, rw = CW - lw - 0.3;
    card(s, rx, 1.45, rw, 5.35);
    T(s, 'Staf gate dengan jadwal siklis', rx + 0.3, 1.65, rw - 0.6, 0.4, { fs: 16, bold: true });
    T(s, 'Kebutuhan petugas *gate* per hari (Senin–Minggu): 5, 5, 6, 5, 4, 3, 3. Dengan pola lima hari kerja dan dua hari libur berurutan, tujuh petugas mencukupi:', rx + 0.3, 2.1, rw - 0.6, 0.95, { fs: 12 });
    const cyc = [['Kebutuhan', ['5', '5', '6', '5', '4', '3', '3']], ['Hari libur', ['P5, P7', 'P5, P7', '–', 'P3, P6', 'P3, P6', 'P1, P2, P4', 'P1, P2, P4']], ['Kapasitas', ['6', '6', '7', '5', '5', '3', '3']], ['Kelebihan', ['1', '1', '1', '0', '1', '0', '0']]];
    const cRows = tableRows(['', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], cyc.map((r, i) => [{ text: r[0], bold: true }, ...r[1].map(v => ({ text: v, fill: i === 1 ? BLUE_L : undefined }))]), { fs: 9.5 });
    addTable(s, cRows, rx + 0.3, 3.1, rw - 0.6, [1.1, ...Array(7).fill((rw - 0.6 - 1.1) / 7)], { rowH: 0.4 });
    T(s, 'P1–P7 = petugas 1–7. Kapasitas *deicing* disiapkan delapan jam sebelum hujan beku tiba (10.00 untuk 18.00), sehingga staf darat musim dingin dijadwalkan dari prakiraan, bukan dari kejadian.', rx + 0.3, 5.3, rw - 0.6, 1.4, { fs: 11, color: MUTED, italic: true });
  }
  // 18. Evaluasi & rekomendasi
  {
    const s = slide('Penutup', 'Evaluasi dan empat rekomendasi dengan indikator.');
    title(s, 'Evaluasi dan Rekomendasi');
    T(s, 'Alaska Airlines kuat pada penjadwalan ulang jangka pendek dan sedang memperkuat perencanaan perawatan berbasis kapasitas; titik lemah yang terbukti adalah ketahanan infrastruktur terintegrasi.', M, 1.4, 9.4, 0.7, { fs: 14 });
    sticker(s, 'sticker_mechanic.png', 10.3, 0.85, 2.3, 1.5, 'ilustrasi teknisi');
    const recs = [
      ['01', 'FaShieldAlt', 'Ketahanan infrastruktur terintegrasi', 'Redundansi aktif-aktif antarpusat data dan cloud, uji *failover* berkala, dan prosedur manual *degraded mode* untuk *dispatch* dan kru.', 'Waktu pemulihan; jumlah *ground stop* akibat IT.'],
      ['02', 'FaCogs', 'Perencanaan perawatan berkapasitas berhingga', 'Operasionalkan Tailsight dengan *load report* hangar dan suku cadang; masukkan *lead time* OEM dan *station capability* sebagai kendala.', 'Jam AOG; *fill rate* suku cadang; utilisasi teknisi.'],
      ['03', 'FaSortAmountDown', 'Aturan prioritas hibrida di hangar', '*Critical ratio* untuk AOG dan *airworthiness directive*, SPT untuk antrean rutin, *Johnson\'s rule* untuk alur dua tahap.', 'Keterlambatan rata-rata; *makespan* paket perawatan.'],
      ['04', 'FaHandshake', 'Proses dulu, sistem kemudian', 'Standarkan proses kru, perawatan, dan layanan penumpang sebelum migrasi Hawaiian ke sistem tunggal; batasi kustomisasi.', 'Biaya kustomisasi; insiden *cut-over*.'],
    ];
    const cw = (CW - 0.25) / 2, ch = 2.2;
    recs.forEach((r, i) => {
      const x = M + (i % 2) * (cw + 0.25), y = 2.25 + Math.floor(i / 2) * (ch + 0.2);
      card(s, x, y, cw, ch);
      pill(s, r[0], x + 0.25, y + 0.25, 0.5, 0.5, { fs: 13 });
      iconCircle(s, r[1], x + cw - 0.9, y + 0.2, 0.6);
      T(s, r[2], x + 0.9, y + 0.25, cw - 2.0, 0.5, { fs: 14.5, bold: true, valign: 'middle' });
      T(s, r[3], x + 0.25, y + 0.88, cw - 0.5, 0.85, { fs: 11.5 });
      T(s, [{ text: 'Indikator: ', options: { bold: true, color: BLUE } }, ...runs(r[4])], x + 0.25, y + 1.72, cw - 0.5, 0.4, { fs: 11 });
    });
  }
  // 19. Kesimpulan
  {
    const s = slide('Penutup', 'Tiga kesimpulan dan angka kunci.');
    title(s, 'Kesimpulan');
    const con = [
      ['Jadwal penerbangan adalah master schedule', 'Kebutuhan perawatan, suku cadang, dan kru diturunkan dari *flight timetable* (logika MRP), dan satu basis data operasi menyatukan semuanya (logika ERP). Tailsight adalah langkah berikutnya: perencanaan yang memperhitungkan kapasitas.'],
      ['Ketepatan waktu dijaga jam demi jam', 'Aturan prioritas di hangar, penjadwalan kru berkapasitas berhingga, jadwal siklis staf darat, dan penjadwalan ulang saat badai adalah *sequencing and scheduling* yang menjelaskan 79% ketepatan kedatangan di tengah cuaca Seattle.'],
      ['Integrasi adalah keunggulan sekaligus risiko', 'Data bersama menghemat US$18 juta per tahun, tetapi dua *outage* 2025 menghentikan seluruh operasi. Ketahanan infrastruktur harus direncanakan sekeras jadwalnya.'],
    ];
    con.forEach((c, i) => {
      const y = 1.45 + i * 1.8;
      card(s, M, y, 8.6, 1.62);
      pill(s, String(i + 1), M + 0.25, y + 0.3, 0.5, 0.5, { fs: 15 });
      T(s, c[0], M + 1.0, y + 0.2, 7.35, 0.45, { fs: 15.5, bold: true, valign: 'middle' });
      T(s, c[1], M + 1.0, y + 0.68, 7.35, 0.9, { fs: 12 });
    });
    const rx = M + 8.85, rw = CW - 8.85;
    card(s, rx, 1.45, rw, 5.37);
    T(s, 'Angka kunci', rx + 0.3, 1.65, rw - 0.6, 0.4, { fs: 15, bold: true });
    [['US$18 juta', 'per tahun, penghematan dari teknologi penjadwalan ulang'], ['85,8%', 'on-time departures di SEA, tertinggi di Amerika Serikat (Heizer et al., 2017)'], ['79,25%', 'ketepatan kedatangan 2024, peringkat ke-3 Amerika Utara (Cirium)']].forEach((k, i) => {
      const y = 2.15 + i * 1.5;
      T(s, k[0], rx + 0.3, y, rw - 0.6, 0.55, { fs: 24, bold: true, color: BLUE, valign: 'middle' });
      T(s, k[1], rx + 0.3, y + 0.57, rw - 0.6, 0.8, { fs: 11 });
    });
  }
  // 20. Penutup
  {
    const s = pres.addSlide({ masterName: 'REF', sectionTitle: 'Penutup' });
    s.addNotes('Penutup: pertanyaan diskusi dan sumber.');
    T(s, 'Terima Kasih', M, 0.9, 7.5, 1.1, { fs: 44, bold: true });
    T(s, 'Planning and Control di Alaska Airlines  ·  MRP dan ERP  ·  Sequencing and Scheduling', M, 2.0, 7.8, 0.5, { fs: 13, bold: true, color: DARK2 });
    card(s, M, 2.7, 7.8, 2.45);
    iconCircle(s, 'FaQuestionCircle', M + 0.3, 2.9, 0.55);
    T(s, 'Pertanyaan untuk diskusi', M + 1.0, 2.9, 6.5, 0.55, { fs: 16, bold: true, valign: 'middle' });
    bullets(s, ['Ketika 65 pesawat harus diinspeksi serentak, aturan prioritas mana yang Anda pilih untuk antrean hangar, dan kriteria apa yang Anda korbankan?', 'Sejauh mana manfaat integrasi data masih sepadan dengan risiko kegagalan tunggal yang ditunjukkan dua *outage* 2025? Di mana batas integrasi yang wajar?'], M + 0.3, 3.55, 7.2, 1.55, { fs: 12, numbered: true, psa: 6 });
    sticker(s, 'st_gate.png', 8.9, 0.8, 3.9, 4.4, 'ilustrasi petugas gate');
    card(s, M, 5.35, CW, 1.5);
    T(s, 'Sumber', M + 0.3, 5.42, 2, 0.3, { fs: 11, bold: true });
    const src = 'Heizer, J., Render, B., & Munson, C. (2017). Operations Management (12th ed.), Bab 14–15, Global Company Profile Alaska Airlines, hlm. 600–602. Pearson  ·  Slack, N., Brandon-Jones, A., & Burgess, N. (2022). Operations Management (10th ed.), Bab 10 dan 14. Pearson  ·  Alaska Airlines (2026, 16 April), Alaska Airlines and Tailsight launch AI-powered maintenance planning solution  ·  Alaska Airlines (2025, 29 Oktober), single operating certificate  ·  Alaska Air Group fact sheet  ·  Cirium (2025), 2024 On-Time Performance Review via Fox Business  ·  GeekWire (Okt 2025) dan CBS News (Jul 2025) tentang outage  ·  CNBC (25 Jan 2024) dan Anchorage Daily News (6 Jan 2024) tentang grounding 737 MAX 9  ·  Aviacionline (2025), armada akhir 2024  ·  Halldale (2024), Fox TMS  ·  Alaska Airlines Auro Design System (palet warna).';
    T(s, src, M + 0.3, 5.72, CW - 0.6, 1.1, { fs: 9, color: DARK2 });
    T(s, 'Dosen Pengampu: Prof. Nur Aini Masruroh, S.T., M.Sc., Ph.D.', M, 6.95, 8, 0.35, { fs: 10, color: DARK2 });
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('written', OUT);
})().catch(e => { console.error(e); process.exit(1); });
