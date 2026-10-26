// Deck: Planning and Control — MRP & ERP, Sequencing and Scheduling — Studi Kasus Alaska Airlines
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');
const path = require('path');
const { applyTheme } = require(process.env.SKILL_DIR + '/scripts/apply_theme.js');

const OUT = process.argv[2] || 'deck.pptx';
const IMG = path.join(__dirname, 'img');

// ---------- Brand palette (Alaska Airlines Auro design tokens) ----------
const NAVY = '00274A', NAVY2 = '01426A', ATLAS = '0074C8', BREEZE = '00CFF0', BREEZE_D = '099DC5';
const GREEN = '91BE62', GREEN2 = '51AE8C', LIGHT = 'CDE6FF', LIGHT2 = 'C9E0F7', PALE = 'F0F7FD';
const WHITE = 'FFFFFF', CANYON = 'F26135', MUTED = '585E67', SOFT = 'C1DAF0', YELLOW = 'F9CE06';

const THEME = {
  name: 'Alaska Planning Control', headFontFace: 'Calibri', bodyFontFace: 'Calibri',
  colors: { dk1: NAVY, lt1: WHITE, dk2: NAVY2, lt2: LIGHT, accent1: ATLAS, accent2: BREEZE, accent3: GREEN, accent4: GREEN2, accent5: CANYON, accent6: BREEZE_D, hlink: ATLAS, folHlink: '2C67B5' },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = 'Operations & Technology Management';
pres.title = 'Planning and Control: MRP, ERP, Sequencing and Scheduling — Studi Kasus Alaska Airlines';
const C = pres.SchemeColor;
const W = 13.333, H = 7.5, M = 0.6, CW = W - 2 * M;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: 'LIGHT', background: { color: LIGHT },
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: M, y: 0.42, w: CW, h: 0.85, fontSize: 30, bold: true, color: NAVY, valign: 'middle', align: 'left', margin: 0 } } },
    { text: { text: 'Planning and Control  ·  MRP & ERP  ·  Sequencing and Scheduling  ·  Studi Kasus Alaska Airlines', options: { x: M, y: 7.03, w: 9.5, h: 0.28, fontSize: 9, color: NAVY2, margin: 0, valign: 'middle' } } },
  ],
  slideNumber: { x: 12.1, y: 7.03, w: 0.63, h: 0.28, fontSize: 9, color: NAVY2, align: 'right' },
});
pres.defineSlideMaster({ title: 'DARK', background: { color: NAVY }, objects: [] });

// ---------- Helpers ----------
const shadow = () => ({ type: 'outer', color: NAVY2, blur: 6, offset: 2, angle: 90, opacity: 0.13 });

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
  s.addText(typeof text === 'string' ? runs(text) : text, {
    x, y, w, h, fontSize: o.fs || 14, color: o.color || NAVY, bold: !!o.bold, italic: !!o.italic, align: o.align || 'left', valign: o.valign || 'top',
    margin: o.margin ?? 0, isTextBox: true, paraSpaceAfter: o.psa, lineSpacingMultiple: o.lsm, objectName: o.name || 'text', charSpacing: o.cs,
  });
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
  s.addText(arr, { x, y, w, h, fontSize: o.fs || 14, color: o.color || NAVY, margin: 0, isTextBox: true, valign: o.valign || 'top', objectName: o.name || 'bullets' });
}
function card(s, x, y, w, h, o = {}) {
  const fill = o.fill || WHITE;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: o.line ? 1 : 0.25 }, rectRadius: o.r ?? 0.14, shadow: o.flat ? undefined : shadow(), objectName: o.name || 'card' });
}
function pill(s, text, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: o.fill || BREEZE }, line: { color: o.fill || BREEZE, width: 0.25 }, rectRadius: h / 2, objectName: 'pill' });
  s.addText(text, { x, y, w, h, fontSize: o.fs || 10, bold: true, color: o.color || NAVY, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: 'pill label' });
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
  const bg = o.bg || BREEZE, fg = o.fg || NAVY;
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg, width: 0.25 }, objectName: 'icon circle' });
  const k = d * 0.5; s.addImage({ data: ICONS[name + fg], x: x + (d - k) / 2, y: y + (d - k) / 2, w: k, h: k, objectName: 'icon ' + name });
}
function arrowRight(s, x, y, w, h, color = ATLAS) { s.addShape(pres.ShapeType.rightArrow, { x, y, w, h, fill: { color }, line: { color, width: 0.25 }, objectName: 'arrow' }); }
function line(s, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: o.color || NAVY2, width: o.w || 1.25, dashType: o.dash || 'solid' }, flipH: (x2 < x1) !== (y2 < y1), objectName: 'line' });
}
function img(s, file, x, y, w, h, o = {}) { s.addImage({ path: path.join(IMG, file), x, y, w, h, sizing: { type: o.fit || 'cover', w, h }, rounding: !!o.round, objectName: o.name || file }); }
function tableRows(header, rows, o = {}) {
  const hd = header.map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: NAVY }, align: 'center', valign: 'middle', fontSize: o.fs || 12 } }));
  const body = rows.map((r, i) => r.map((c, j) => {
    const cell = typeof c === 'object' ? c : { text: String(c) };
    return { text: cell.text, options: { fontSize: o.fs || 12, color: NAVY, fill: { color: cell.fill || (i % 2 ? PALE : WHITE) }, align: cell.align || (j === 0 ? 'left' : 'center'), valign: 'middle', bold: !!cell.bold, italic: !!cell.italic } };
  }));
  return [hd, ...body];
}
function addTable(s, rows, x, y, w, colW, o = {}) {
  s.addTable(rows, { x, y, w, colW, rowH: o.rowH, border: { type: 'solid', color: LIGHT2, pt: 0.75 }, margin: o.margin ?? 0.05, fontFace: 'Calibri', objectName: o.name || 'table', autoPage: false });
}
function newSlide(section, notes) { const s = pres.addSlide({ masterName: 'LIGHT', sectionTitle: section }); if (notes) s.addNotes(notes); return s; }
function title(s, t) { s.addText(t, { placeholder: 'title' }); }

function divider(section, num, heading, sub, reading, file, notes) {
  const s = pres.addSlide({ masterName: 'DARK', sectionTitle: section }); if (notes) s.addNotes(notes);
  img(s, file, 6.3, 0, W - 6.3, H, { name: 'section image' });
  pill(s, num, 0.7, 2.25, 1.7, 0.4, { fill: BREEZE, color: NAVY, fs: 11 });
  T(s, heading, 0.7, 2.8, 5.2, 1.7, { fs: 34, bold: true, color: WHITE });
  T(s, sub, 0.7, 4.55, 5.2, 1.1, { fs: 15, color: SOFT });
  T(s, reading, 0.7, 5.75, 5.2, 0.5, { fs: 12, color: BREEZE, bold: true });
  return s;
}

(async () => {
  // Pre-render icons
  const need = [
    ['FaCompass', NAVY], ['FaDatabase', NAVY], ['FaStopwatch', NAVY], ['FaPlane', NAVY],
    ['FaLayerGroup', NAVY], ['FaSortNumericDown', NAVY], ['FaCalendarAlt', NAVY], ['FaEye', NAVY], ['FaLink', WHITE],
    ['FaClipboardList', NAVY], ['FaSitemap', NAVY], ['FaBoxes', NAVY], ['FaFileInvoice', NAVY], ['FaHourglassHalf', NAVY],
    ['FaCubes', NAVY], ['FaExclamationTriangle', NAVY], ['FaTachometerAlt', NAVY],
    ['FaDatabase', WHITE], ['FaMoneyBillWave', NAVY], ['FaBullhorn', NAVY], ['FaIndustry', NAVY], ['FaShoppingCart', NAVY], ['FaUsers', NAVY], ['FaWarehouse', NAVY],
    ['FaThumbsUp', WHITE], ['FaThumbsDown', WHITE], ['FaTicketAlt', NAVY], ['FaUserClock', NAVY], ['FaTools', NAVY], ['FaCloudSun', NAVY], ['FaMoneyCheckAlt', NAVY],
    ['FaBalanceScale', NAVY], ['FaListOl', NAVY], ['FaExchangeAlt', NAVY], ['FaChartBar', NAVY], ['FaProjectDiagram', NAVY], ['FaQuoteLeft', NAVY],
    ['FaRandom', NAVY], ['FaMicrochip', NAVY], ['FaSyncAlt', NAVY], ['FaSortAmountDown', NAVY],
    ['FaMapMarkedAlt', NAVY], ['FaPercentage', NAVY], ['FaUserTie', NAVY], ['FaDollarSign', NAVY],
    ['FaCloudRain', NAVY], ['FaMountain', NAVY], ['FaNetworkWired', NAVY], ['FaServer', NAVY], ['FaPlaneSlash', NAVY], ['FaClock', WHITE],
    ['FaWrench', NAVY], ['FaLightbulb', NAVY], ['FaCheckCircle', WHITE], ['FaExclamationCircle', WHITE], ['FaCheckCircle', NAVY],
    ['FaRoute', NAVY], ['FaSnowflake', NAVY], ['FaShieldAlt', NAVY], ['FaCogs', NAVY], ['FaHandshake', NAVY], ['FaQuestionCircle', NAVY], ['FaBookOpen', NAVY], ['FaArrowsAltH', NAVY],
  ];
  for (const [n, c] of need) await iconData(n, c);

  // ======================= PEMBUKA =======================
  pres.addSection({ title: 'Pembuka' });
  {
    const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Pembuka' });
    s.addNotes('Slide judul. Sesi 7 mata kuliah Operations & Technology Management: topik Planning and Control dengan subtopik MRP dan ERP serta Sequencing and Scheduling, diterapkan pada kasus Alaska Airlines (Case Study 5). Bacaan: Slack, Brandon-Jones & Burgess (2022) Bab 10 dan 14; Heizer, Render & Munson (2017) Bab 14 dan 15.');
    img(s, 'cover_hero.png', 6.4, 0, W - 6.4, H, { name: 'cover image' });
    pill(s, 'OPERATIONS & TECHNOLOGY MANAGEMENT  ·  SESI 7', 0.7, 1.15, 4.9, 0.42, { fill: BREEZE, color: NAVY, fs: 11 });
    T(s, 'Planning and Control', 0.7, 1.8, 5.5, 1.3, { fs: 44, bold: true, color: WHITE });
    T(s, 'MRP dan ERP  ·  Sequencing and Scheduling', 0.7, 3.12, 5.5, 0.55, { fs: 20, bold: true, color: BREEZE });
    T(s, 'Studi Kasus: Alaska Airlines', 0.7, 3.7, 5.5, 0.5, { fs: 18, color: WHITE });
    line(s, 0.7, 4.55, 2.2, 4.55, { color: GREEN, w: 2 });
    T(s, 'Dosen Pengampu\nProf. Nur Aini Masruroh, S.T., M.Sc., Ph.D.', 0.7, 4.8, 5.5, 0.8, { fs: 13, color: SOFT });
    T(s, 'Bacaan: Slack, Brandon-Jones & Burgess (2022) Bab 10 & 14  ·  Heizer, Render & Munson (2017) Bab 14 & 15', 0.7, 5.75, 5.5, 0.7, { fs: 11, color: SOFT });
  }
  // ---- Peta pembahasan
  {
    const s = newSlide('Pembuka', 'Peta pembahasan: empat bagian berurutan. Bagian 1 memberi kerangka (empat aktivitas planning and control dan hierarki perencanaan). Bagian 2 membahas sistem MRP dan ERP. Bagian 3 membahas teknik sequencing dan scheduling. Bagian 4 menerapkan seluruh kerangka pada Alaska Airlines. Tekankan bahwa setiap bagian memakai konsep bagian sebelumnya.');
    title(s, 'Peta Pembahasan: dari Konsep ke Kasus');
    T(s, 'Empat bagian disusun berurutan sehingga setiap bagian menjadi prasyarat bagi bagian berikutnya. Kerangka *planning and control* (Bagian 1) menjadi lensa untuk membaca sistem MRP dan ERP (Bagian 2) dan teknik *sequencing and scheduling* (Bagian 3); ketiganya kemudian dipakai utuh untuk menganalisis Alaska Airlines (Bagian 4).', M, 1.42, 9.3, 1.25, { fs: 14 });
    card(s, 10.55, 1.05, 2.18, 1.95);
    img(s, 'sticker_pilot.png', 10.75, 1.15, 1.78, 1.75, { fit: 'contain', name: 'ilustrasi pilot' });
    const steps = [
      ['Bagian 1', 'FaCompass', 'Landasan: Planning and Control', 'Hakikat perencanaan dan pengendalian, empat aktivitas inti, dan hierarki perencanaan.', 'SBB Bab 10  ·  HRM Bab 15 (Gambar 15.1)'],
      ['Bagian 2', 'FaDatabase', 'Sistem: MRP dan ERP', 'Dari *dependent demand* ke rencana kebutuhan material, lalu integrasi seluruh perusahaan.', 'HRM Bab 14  ·  SBB Bab 14'],
      ['Bagian 3', 'FaStopwatch', 'Eksekusi: Sequencing and Scheduling', '*Loading*, aturan prioritas, *Johnson\'s rule*, *finite capacity*, dan *cyclical scheduling*.', 'HRM Bab 15  ·  SBB Bab 10'],
      ['Bagian 4', 'FaPlane', 'Aplikasi: Alaska Airlines', 'Profil, permasalahan, analisis dengan kerangka Bagian 1–3, evaluasi, dan rekomendasi.', 'Case Study 5'],
    ];
    const cw = (CW - 3 * 0.25) / 4;
    steps.forEach((st, i) => {
      const x = M + i * (cw + 0.25), y = 3.0, h = 2.75;
      card(s, x, y, cw, h);
      pill(s, st[0], x + 0.25, y + 0.25, 1.1, 0.32, { fill: i === 3 ? GREEN : BREEZE });
      iconCircle(s, st[1], x + cw - 0.95, y + 0.2, 0.7, { bg: PALE });
      T(s, st[2], x + 0.25, y + 0.78, cw - 0.5, 0.7, { fs: 15, bold: true });
      T(s, st[3], x + 0.25, y + 1.48, cw - 0.5, 0.85, { fs: 12 });
      T(s, st[4], x + 0.25, y + 2.33, cw - 0.5, 0.3, { fs: 10, color: NAVY2, bold: true });
      if (i < 3) arrowRight(s, x + cw + 0.04, y + 1.2, 0.17, 0.32, ATLAS);
    });
    card(s, M, 6.0, CW, 0.82, { fill: NAVY, flat: true });
    T(s, '**Benang merah:** *planning* (MRP, ERP) menyediakan rencana yang layak; *control* (*sequencing*, *scheduling*, *monitoring*) mengeksekusi dan menyesuaikannya. Alaska Airlines diuji pada keduanya.', M + 0.3, 6.0, CW - 0.6, 0.82, { fs: 13, color: WHITE, valign: 'middle' });
  }

  // ======================= BAGIAN 1: LANDASAN =======================
  pres.addSection({ title: 'Bagian 1 – Landasan' });
  {
    const s = newSlide('Bagian 1 – Landasan', 'Definisi Slack et al.: planning and control merekonsiliasi supply dan demand dalam volume, timing, dan quality. Planning adalah formalisasi atas apa yang dimaksudkan terjadi; control adalah proses mengatasi perubahan. Keseimbangan keduanya bergeser menurut horizon waktu: jangka panjang dominan planning, jangka pendek dominan control.');
    title(s, 'Hakikat Planning and Control');
    card(s, M, 1.45, 5.95, 5.35);
    T(s, 'Rekonsiliasi supply dan demand', M + 0.3, 1.7, 5.4, 0.45, { fs: 17, bold: true });
    T(s, 'Menurut Slack, Brandon-Jones & Burgess (2022), *planning and control* adalah aktivitas yang merekonsiliasi kemampuan pasokan suatu operasi dengan permintaan pelanggan dalam tiga dimensi: *volume*, *timing*, dan *quality*. Rencana yang baik tidak menjamin hasil; karena itu perencanaan selalu dipasangkan dengan pengendalian.', M + 0.3, 2.2, 5.4, 1.55, { fs: 13 });
    card(s, M + 0.3, 3.85, 5.35, 1.3, { fill: PALE, flat: true });
    T(s, '**Planning**', M + 0.5, 3.95, 5.0, 0.35, { fs: 13 });
    T(s, 'Formalisasi atas apa yang dimaksudkan terjadi pada suatu waktu di masa depan: rencana adalah pernyataan niat, bukan jaminan.', M + 0.5, 4.3, 5.0, 0.8, { fs: 12 });
    card(s, M + 0.3, 5.3, 5.35, 1.3, { fill: PALE, flat: true });
    T(s, '**Control**', M + 0.5, 5.4, 5.0, 0.35, { fs: 13 });
    T(s, 'Proses mengatasi perubahan ketika rencana tidak berjalan: intervensi ulang, penjadwalan ulang, dan pengalihan sumber daya.', M + 0.5, 5.75, 5.0, 0.8, { fs: 12 });

    const rx = M + 6.2, rw = CW - 6.2;
    card(s, rx, 1.45, rw, 5.35);
    T(s, 'Keseimbangan bergeser menurut horizon waktu', rx + 0.3, 1.7, rw - 0.6, 0.45, { fs: 17, bold: true });
    const bands = [
      ['Jangka panjang', 'Permintaan agregat, kapasitas agregat, tujuan finansial; dominan *planning*.', 0.9],
      ['Jangka menengah', 'Permintaan sebagian terdisagregasi; kapasitas dan kontinjensi; MRP dan ERP bekerja di sini.', 0.6],
      ['Jangka pendek', 'Permintaan aktual, intervensi harian; dominan *control* (*sequencing*, *scheduling*).', 0.3],
    ];
    bands.forEach((b, i) => {
      const y = 2.3 + i * 1.2;
      s.addShape(pres.ShapeType.roundRect, { x: rx + 0.3, y, w: 1.9 + (rw - 0.6 - 1.9) * b[2], h: 0.36, fill: { color: ATLAS }, line: { color: ATLAS, width: 0.25 }, rectRadius: 0.18, objectName: 'band' });
      T(s, b[0], rx + 0.45, y, 3, 0.36, { fs: 12, bold: true, color: WHITE, valign: 'middle' });
      T(s, b[1], rx + 0.3, y + 0.42, rw - 0.6, 0.7, { fs: 12 });
    });
    T(s, 'Panjang batang menggambarkan porsi *planning* relatif terhadap *control*.', rx + 0.3, 5.75, rw - 0.6, 0.3, { fs: 10, color: MUTED, italic: true });
    card(s, rx + 0.3, 6.08, rw - 0.6, 0.55, { fill: NAVY, flat: true });
    T(s, 'Implikasi: MRP/ERP (Bagian 2) adalah perangkat horizon menengah; *sequencing and scheduling* (Bagian 3) perangkat horizon pendek.', rx + 0.45, 6.08, rw - 0.9, 0.55, { fs: 11, color: WHITE, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 1 – Landasan', 'Empat aktivitas planning and control menurut Slack et al.: loading, sequencing, scheduling, serta monitoring and control. Keempatnya menjadi kerangka analisis kasus. Dependent demand menjadi jembatan menuju MRP: kebutuhan komponen dihitung dari jadwal item induk, bukan diramalkan.');
    title(s, 'Empat Aktivitas Planning and Control sebagai Kerangka Analisis');
    const acts = [
      ['FaLayerGroup', 'Loading', 'Menentukan volume pekerjaan yang dialokasikan ke setiap pusat kerja. *Finite loading* membatasi beban sesuai kapasitas; *infinite loading* tidak membatasinya.'],
      ['FaSortNumericDown', 'Sequencing', 'Menentukan urutan pengerjaan berdasarkan prioritas pelanggan, *due date*, FIFO/LIFO, atau *longest/shortest operation time*.'],
      ['FaCalendarAlt', 'Scheduling', 'Menyusun jadwal rinci mulai–selesai setiap pekerjaan secara *forward* atau *backward*, divisualkan dengan *Gantt chart*.'],
      ['FaEye', 'Monitoring and control', 'Memantau realisasi terhadap rencana dan mengintervensi: sistem *push* versus *pull* serta *drum, buffer, rope* pada *bottleneck*.'],
    ];
    const cw = (CW - 3 * 0.25) / 4;
    acts.forEach((a, i) => {
      const x = M + i * (cw + 0.25), y = 1.45, h = 3.35;
      card(s, x, y, cw, h);
      iconCircle(s, a[0], x + 0.25, y + 0.25, 0.72, { bg: i % 2 ? BREEZE : GREEN });
      T(s, a[1], x + 0.25, y + 1.1, cw - 0.5, 0.5, { fs: 16, bold: true });
      T(s, a[2], x + 0.25, y + 1.62, cw - 0.5, 1.6, { fs: 12 });
    });
    card(s, M, 5.05, CW, 1.75, { fill: NAVY, flat: true });
    iconCircle(s, 'FaLink', M + 0.3, 5.45, 0.9, { bg: ATLAS, fg: WHITE });
    T(s, 'Dependent demand: jembatan menuju MRP', M + 1.45, 5.2, CW - 1.8, 0.4, { fs: 15, bold: true, color: WHITE });
    T(s, 'Permintaan atas komponen bersifat *dependent*: dapat diturunkan dari jadwal item induknya, sehingga tidak perlu diramalkan, melainkan dihitung. Pada maskapai, kebutuhan suku cadang bergantung pada jadwal perawatan, dan jadwal perawatan bergantung pada jadwal penerbangan. Inilah logika yang dioperasionalkan oleh MRP (Bagian 2).', M + 1.45, 5.62, CW - 1.8, 1.1, { fs: 12, color: WHITE });
  }
  {
    const s = newSlide('Bagian 1 – Landasan', 'Hierarki perencanaan menurut Heizer et al. (Gambar 15.1 dan 14.1): capacity planning, aggregate planning, master production schedule, MRP, dan short-term scheduling. Kolom kanan memberikan padanan setiap tingkat pada operasi maskapai. ERP mengintegrasikan basis data di seluruh tingkat.');
    title(s, 'Hierarki Perencanaan: Posisi MRP, ERP, dan Short-Term Scheduling');
    const rows = [
      ['Capacity planning', 'Jangka panjang; tahunan', 'Fasilitas, peralatan, dan kapasitas agregat yang tersedia.', 'Rencana armada, basis dan hangar, pemesanan pesawat baru.'],
      ['Aggregate planning (S&OP)', 'Jangka menengah; 3–18 bulan', 'Tingkat output agregat, tenaga kerja, subkontrak.', 'Rencana jaringan dan kapasitas musiman (kursi-km), rekrutmen kru.'],
      ['Master production schedule', 'Mingguan', 'Item spesifik dan waktunya; mendisagregasi rencana agregat.', '*Flight timetable* terpublikasi; rencana *heavy maintenance* per *tail number*.'],
      ['Material requirements planning', 'Mingguan–harian', 'Kebutuhan komponen: apa, berapa, dan kapan dipesan.', 'Kebutuhan suku cadang dan *tooling* per paket perawatan.'],
      ['Short-term scheduling', 'Hari, jam, menit', '*Loading*, *sequencing*, *dispatching* ke orang dan mesin.', 'Penugasan kru, *gate*, *bay* hangar; penanganan *irregular operations*.'],
    ];
    T(s, 'Tingkat perencanaan', M, 1.42, 2.75, 0.3, { fs: 11, bold: true, color: NAVY2 });
    T(s, 'Keputusan (Heizer et al., 2017)', M + 2.95, 1.42, 4.2, 0.3, { fs: 11, bold: true, color: NAVY2 });
    T(s, 'Padanan pada maskapai penerbangan', M + 7.35, 1.42, 4.0, 0.3, { fs: 11, bold: true, color: NAVY2 });
    rows.forEach((r, i) => {
      const y = 1.78 + i * 1.0, h = 0.9;
      s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 2.75, h, fill: { color: i === 3 ? GREEN : NAVY }, line: { color: NAVY, width: 0.25 }, rectRadius: 0.12, objectName: 'level' });
      T(s, r[0], M + 0.2, y + 0.1, 2.4, 0.42, { fs: 13, bold: true, color: i === 3 ? NAVY : WHITE, valign: 'middle' });
      T(s, r[1], M + 0.2, y + 0.52, 2.4, 0.3, { fs: 10, color: i === 3 ? NAVY : SOFT });
      card(s, M + 2.95, y, 4.2, h, { flat: true });
      T(s, r[2], M + 3.15, y, 3.8, h, { fs: 12, valign: 'middle' });
      card(s, M + 7.35, y, 4.0, h, { fill: PALE, flat: true });
      T(s, r[3], M + 7.55, y, 3.6, h, { fs: 12, valign: 'middle' });
      if (i < rows.length - 1) s.addShape(pres.ShapeType.downArrow, { x: M + 1.25, y: y + h - 0.02, w: 0.25, h: 0.14, fill: { color: ATLAS }, line: { color: ATLAS, width: 0.25 }, objectName: 'down arrow' });
    });
    s.addShape(pres.ShapeType.roundRect, { x: M + 11.55, y: 2.78, w: 0.58, h: 3.9, fill: { color: BREEZE }, line: { color: BREEZE, width: 0.25 }, rectRadius: 0.12, objectName: 'ERP bracket' });
    s.addText('ERP: basis data bersama yang mengintegrasikan seluruh tingkat', { x: M + 11.55, y: 2.78, w: 0.58, h: 3.9, fontSize: 10, bold: true, color: NAVY, align: 'center', valign: 'middle', vert: 'vert270', margin: 0, isTextBox: true, objectName: 'ERP label' });
  }

  // ======================= BAGIAN 2a: MRP =======================
  pres.addSection({ title: 'Bagian 2 – MRP' });
  divider('Bagian 2 – MRP', 'BAGIAN 2A', 'Material Requirements Planning (MRP)', 'Teknik *dependent demand* untuk menentukan apa, berapa, dan kapan material dibutuhkan agar jadwal induk terpenuhi.', 'HRM Bab 14  ·  SBB Bab 14 dan Suplemen MRP', 'hangar.png', 'Pembuka Bagian 2A: MRP.');
  {
    const s = newSlide('Bagian 2 – MRP', 'Definisi MRP menurut Heizer et al. dan lima prasyarat model persediaan dependen: master production schedule, bill of material, catatan persediaan, purchase orders outstanding, dan lead time. Empat manfaat MRP juga disebutkan.');
    title(s, 'MRP: Teknik Dependent Demand dan Lima Prasyaratnya');
    card(s, M, 1.45, 4.55, 5.35);
    T(s, 'Definisi', M + 0.3, 1.7, 4.0, 0.4, { fs: 16, bold: true });
    T(s, 'Heizer, Render & Munson (2017) mendefinisikan *material requirements planning* (MRP) sebagai teknik permintaan dependen yang memakai *bill of material*, catatan persediaan, penerimaan yang diharapkan, dan *master production schedule* untuk menentukan kebutuhan material.', M + 0.3, 2.12, 4.0, 1.75, { fs: 12.5 });
    T(s, 'Manfaat yang dijanjikan', M + 0.3, 3.95, 4.0, 0.4, { fs: 14, bold: true });
    bullets(s, ['Respons lebih baik terhadap pesanan pelanggan.', 'Respons lebih cepat terhadap perubahan pasar.', 'Utilisasi fasilitas dan tenaga kerja lebih tinggi.', 'Tingkat persediaan lebih rendah.'], M + 0.3, 4.4, 4.0, 2.3, { fs: 12.5, psa: 4 });
    const reqs = [
      ['1', 'FaClipboardList', 'Master production schedule', 'Apa yang dibuat dan kapan; selaras dengan rencana agregat.'],
      ['2', 'FaSitemap', 'Bill of material (spesifikasi)', 'Struktur produk, komponen, dan kuantitas per induk.'],
      ['3', 'FaBoxes', 'Ketersediaan persediaan', 'Catatan *on-hand* yang akurat untuk setiap item.'],
      ['4', 'FaFileInvoice', 'Purchase orders outstanding', 'Penerimaan terjadwal (*scheduled receipts*) yang masih berjalan.'],
      ['5', 'FaHourglassHalf', 'Lead time', 'Waktu pengadaan atau produksi setiap item untuk *offsetting*.'],
    ];
    const rx = M + 4.8, rw = CW - 4.8, cw = (rw - 2 * 0.2) / 3, ch = 2.45;
    reqs.forEach((r, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const x = rx + col * (cw + 0.2), y = 1.45 + row * (ch + 0.2);
      card(s, x, y, cw, ch);
      pill(s, r[0], x + 0.22, y + 0.22, 0.42, 0.42, { fill: GREEN, fs: 13 });
      iconCircle(s, r[1], x + cw - 0.85, y + 0.2, 0.62, { bg: PALE });
      T(s, r[2], x + 0.22, y + 0.82, cw - 0.44, 0.65, { fs: 13.5, bold: true });
      T(s, r[3], x + 0.22, y + 1.5, cw - 0.44, 0.9, { fs: 11.5 });
    });
    const x6 = rx + 2 * (cw + 0.2), y6 = 1.45 + ch + 0.2;
    card(s, x6, y6, cw, ch, { fill: NAVY, flat: true });
    T(s, 'Keluaran MRP', x6 + 0.22, y6 + 0.25, cw - 0.44, 0.4, { fs: 13.5, bold: true, color: BREEZE });
    T(s, 'Jadwal pesanan terencana (*planned order releases*), perubahan pesanan, laporan pengecualian, dan laporan perencanaan: dasar bagi pembelian dan penjadwalan produksi.', x6 + 0.22, y6 + 0.7, cw - 0.44, 1.7, { fs: 11.5, color: WHITE });
  }
  {
    const s = newSlide('Bagian 2 – MRP', 'Struktur MRP (input, pemrosesan, output) dan ilustrasi net requirements plan untuk suku cadang perawatan: brake assembly, 4 unit per heavy check, lead time 2 minggu, persediaan awal 6, scheduled receipt 4 unit pada minggu 2, kebijakan lot-for-lot. Pesanan harus dirilis pada minggu 5 (2 unit) dan minggu 6 (8 unit).');
    title(s, 'Struktur MRP dan Logika Gross-to-Net: Ilustrasi Suku Cadang');
    const boxes = [
      ['Input', 'MPS, *bill of material*, catatan persediaan, *lead time*, *purchase orders outstanding*', PALE],
      ['Pemrosesan MRP', '*Explosion* BOM, *netting* terhadap persediaan, *lead-time offsetting*, *lot sizing*', NAVY],
      ['Output', '*Planned order releases*, perubahan pesanan, *exception reports*, laporan perencanaan', PALE],
    ];
    const bw = (CW - 2 * 0.45) / 3;
    boxes.forEach((b, i) => {
      const x = M + i * (bw + 0.45);
      card(s, x, 1.45, bw, 1.05, { fill: b[2], flat: b[2] !== WHITE });
      T(s, b[0], x + 0.25, 1.52, bw - 0.5, 0.35, { fs: 13, bold: true, color: b[2] === NAVY ? BREEZE : NAVY });
      T(s, b[1], x + 0.25, 1.87, bw - 0.5, 0.6, { fs: 11.5, color: b[2] === NAVY ? WHITE : NAVY });
      if (i < 2) arrowRight(s, x + bw + 0.08, 1.82, 0.3, 0.32, ATLAS);
    });
    T(s, 'Ilustrasi *net requirements plan*: *brake assembly*, 4 unit per paket *heavy check*; *lead time* 2 minggu; persediaan awal 6 unit; *scheduled receipt* 4 unit pada minggu 2; kebijakan *lot-for-lot*. MPS perawatan: 2 paket pada minggu 5, 1 paket pada minggu 7, 2 paket pada minggu 8.', M, 2.7, CW, 0.62, { fs: 12 });
    const wk = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const data = [
      ['Gross requirements', [0, 0, 0, 0, 8, 0, 4, 8]],
      ['Scheduled receipts', [0, 4, 0, 0, 0, 0, 0, 0]],
      ['Projected on hand (awal 6)', [6, 10, 10, 10, 2, 2, 0, 0]],
      ['Net requirements', [0, 0, 0, 0, 0, 0, 2, 8]],
      ['Planned order receipts', [0, 0, 0, 0, 0, 0, 2, 8]],
      ['Planned order releases', [0, 0, 0, 0, 2, 8, 0, 0]],
    ];
    const rows = tableRows(['Minggu', ...wk], data.map((d, ri) => [{ text: d[0], bold: true }, ...d[1].map(v => ({ text: v === 0 ? '–' : String(v), bold: v !== 0 && ri === 5, fill: v !== 0 && ri === 5 ? LIGHT : undefined }))]), { fs: 12 });
    addTable(s, rows, M, 3.4, CW, [3.1, ...Array(8).fill((CW - 3.1) / 8)], { rowH: 0.36 });
    card(s, M, 6.05, CW, 0.78, { fill: NAVY, flat: true });
    T(s, '**Pembacaan:** pesanan 2 unit dirilis pada minggu 5 dan 8 unit pada minggu 6 agar tersedia tepat pada minggu 7 dan 8. MRP mengubah logika "kapan waktunya memesan" (*time-to-order*) menjadi "kapan perlu memesan" (*need-to-order*).', M + 0.3, 6.05, CW - 0.6, 0.78, { fs: 12, color: WHITE, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 2 – MRP', 'Pengelolaan MRP: lot sizing (lot-for-lot, EOQ, POQ), system nervousness dengan time fences dan pegging, serta validasi kapasitas melalui load report (closed-loop MRP). Perluasan: MRP II, MRP di sektor jasa, DRP, dan akhirnya ERP sebagai jembatan ke Bagian 2B.');
    title(s, 'Pengelolaan MRP dan Perluasannya menuju ERP');
    const left = [
      ['FaCubes', 'Lot sizing', 'Pilihan *lot-for-lot*, EOQ, atau *periodic order quantity* (POQ). Di bawah MRP, *lot-for-lot* sering menjadi opsi berbiaya terendah karena kebutuhan sudah diketahui.'],
      ['FaExclamationTriangle', 'System nervousness', 'Perubahan kecil pada MPS memicu perubahan besar di hilir. Diredam dengan *time fences* (membekukan jadwal dekat) dan *pegging* (menelusuri sumber kebutuhan).'],
      ['FaTachometerAlt', 'Validasi kapasitas', 'MRP pada dasarnya *infinite loading*; *load report* memeriksa kelayakan dan mengembalikan umpan balik ke MPS (*closed-loop MRP*).'],
    ];
    left.forEach((l, i) => {
      const y = 1.45 + i * 1.8;
      card(s, M, y, 5.95, 1.62);
      iconCircle(s, l[0], M + 0.25, y + 0.3, 0.68, { bg: i === 1 ? YELLOW : BREEZE });
      T(s, l[1], M + 1.15, y + 0.22, 4.5, 0.4, { fs: 15, bold: true });
      T(s, l[2], M + 1.15, y + 0.62, 4.55, 0.95, { fs: 11.5 });
    });
    const rx = M + 6.2, rw = CW - 6.2;
    card(s, rx, 1.45, rw, 5.35);
    T(s, 'Evolusi sistem perencanaan', rx + 0.3, 1.65, rw - 0.6, 0.4, { fs: 16, bold: true });
    const evo = [
      ['MRP', 'Kebutuhan material dari MPS dan BOM.'],
      ['Closed-loop MRP', 'Umpan balik kapasitas dan realisasi ke rencana.'],
      ['MRP II', '*Material resource planning*: jam kerja, jam mesin, dan biaya ikut direncanakan.'],
      ['ERP', 'Integrasi seluruh perusahaan: keuangan, SDM, SCM, CRM dalam satu basis data.'],
    ];
    evo.forEach((e, i) => {
      const y = 2.15 + i * 0.86;
      const last = i === 3;
      s.addShape(pres.ShapeType.roundRect, { x: rx + 0.3, y, w: 1.75, h: 0.62, fill: { color: last ? GREEN : NAVY }, line: { color: last ? GREEN : NAVY, width: 0.25 }, rectRadius: 0.1, objectName: 'evo' });
      T(s, e[0], rx + 0.3, y, 1.75, 0.62, { fs: 13, bold: true, color: last ? NAVY : WHITE, align: 'center', valign: 'middle' });
      T(s, e[1], rx + 2.2, y, rw - 2.6, 0.62, { fs: 12, valign: 'middle' });
      if (i < 3) s.addShape(pres.ShapeType.downArrow, { x: rx + 1.07, y: y + 0.63, w: 0.22, h: 0.2, fill: { color: ATLAS }, line: { color: ATLAS, width: 0.25 }, objectName: 'down arrow' });
    });
    card(s, rx + 0.3, 5.65, rw - 0.6, 0.98, { fill: PALE, flat: true });
    T(s, '**MRP di sektor jasa:** restoran (resep sebagai BOM), rumah sakit (bedah), hotel (Marriott: *bill of material* dan *bill of labor* renovasi). **DRP** menerapkan logika MRP pada rantai distribusi.', rx + 0.45, 5.65, rw - 0.9, 0.98, { fs: 11.5, valign: 'middle' });
  }

  // ======================= BAGIAN 2b: ERP =======================
  pres.addSection({ title: 'Bagian 2 – ERP' });
  divider('Bagian 2 – ERP', 'BAGIAN 2B', 'Enterprise Resource Planning (ERP)', 'Sistem informasi terintegrasi untuk mengidentifikasi dan merencanakan sumber daya seluruh perusahaan dalam satu basis data bersama.', 'HRM Bab 14  ·  SBB Bab 14', 'crew_gate.png', 'Pembuka Bagian 2B: ERP.');
  {
    const s = newSlide('Bagian 2 – ERP', 'Definisi ERP menurut Heizer et al. dan Slack et al.; tiga kemampuan ERP; prinsip data dimasukkan satu kali. Enam modul ERP mengikuti pengelompokan SAP pada Gambar 14.11 Heizer et al.');
    title(s, 'ERP: Satu Basis Data Bersama untuk Seluruh Proses Bisnis');
    card(s, M, 1.45, 5.3, 5.35);
    T(s, 'Definisi dan kemampuan', M + 0.3, 1.7, 4.8, 0.4, { fs: 16, bold: true });
    T(s, 'Heizer et al. (2017): sistem informasi untuk mengidentifikasi dan merencanakan sumber daya seluruh perusahaan yang dibutuhkan untuk menerima, membuat, mengirim, dan membukukan pesanan pelanggan. Slack et al. (2022): integrasi seluruh sistem perencanaan sumber daya organisasi dalam satu basis data.', M + 0.3, 2.12, 4.8, 1.6, { fs: 12 });
    bullets(s, ['Mengotomatisasi dan mengintegrasikan banyak proses bisnis.', 'Berbagi basis data dan praktik bisnis yang sama di seluruh perusahaan.', 'Menghasilkan informasi secara *real time*.'], M + 0.3, 3.8, 4.8, 1.5, { fs: 12.5, numbered: true, psa: 4 });
    card(s, M + 0.3, 5.45, 4.7, 1.15, { fill: PALE, flat: true });
    T(s, '**Prinsip:** data dimasukkan satu kali. Pesanan 20.000 pasang sepatu yang dientri wiraniaga Nike langsung terlihat di lantai produksi, penagihan, dan pengiriman.', M + 0.45, 5.45, 4.4, 1.15, { fs: 11.5, valign: 'middle' });
    // hub diagram
    const rx = M + 5.55, rw = CW - 5.55;
    card(s, rx, 1.45, rw, 5.35);
    const cx = rx + rw / 2, cy = 4.05, R = 1.5, RY = 1.25;
    const mods = [
      ['FaMoneyBillWave', 'Cash to cash', 'Keuangan'],
      ['FaBullhorn', 'Promote to deliver', 'Penjualan & layanan'],
      ['FaIndustry', 'Design to manufacture', 'Produksi, *plant maintenance*'],
      ['FaShoppingCart', 'Procure to pay', 'Pengadaan'],
      ['FaUsers', 'Recruit to retire', 'SDM & *payroll*'],
      ['FaWarehouse', 'Dock to dispatch', 'Persediaan & distribusi'],
    ];
    mods.forEach((m, i) => {
      const ang = -Math.PI / 2 + i * (2 * Math.PI / 6);
      const nx = cx + R * Math.cos(ang), ny = cy + RY * Math.sin(ang);
      line(s, cx, cy, nx, ny, { color: LIGHT2, w: 1.5 });
    });
    mods.forEach((m, i) => {
      const ang = -Math.PI / 2 + i * (2 * Math.PI / 6);
      const nx = cx + R * Math.cos(ang), ny = cy + RY * Math.sin(ang);
      iconCircle(s, m[0], nx - 0.3, ny - 0.3, 0.6, { bg: i % 2 ? BREEZE : GREEN });
      const side = Math.abs(Math.cos(ang)) > 0.3;
      if (side) {
        const lw = 1.35, lx = Math.cos(ang) > 0 ? nx + 0.38 : nx - 0.38 - lw, ly = ny - 0.42;
        T(s, m[1], lx, ly, lw, 0.5, { fs: 10.5, bold: true, align: Math.cos(ang) > 0 ? 'left' : 'right', valign: 'bottom' });
        T(s, m[2], lx, ly + 0.52, lw, 0.3, { fs: 9.5, align: Math.cos(ang) > 0 ? 'left' : 'right', color: NAVY2 });
      } else {
        const lw = 2.2, lx = nx - lw / 2, ly = Math.sin(ang) < 0 ? ny - 0.95 : ny + 0.35;
        T(s, m[1], lx, ly, lw, 0.3, { fs: 11, bold: true, align: 'center' });
        T(s, m[2], lx, ly + 0.28, lw, 0.3, { fs: 9.5, align: 'center', color: NAVY2 });
      }
    });
    s.addShape(pres.ShapeType.ellipse, { x: cx - 0.85, y: cy - 0.85, w: 1.7, h: 1.7, fill: { color: NAVY }, line: { color: NAVY, width: 0.25 }, shadow: shadow(), objectName: 'hub' });
    s.addImage({ data: ICONS['FaDatabase' + WHITE], x: cx - 0.25, y: cy - 0.6, w: 0.5, h: 0.5, objectName: 'icon FaDatabase' });
    T(s, 'Basis data bersama', cx - 0.8, cy - 0.05, 1.6, 0.6, { fs: 11, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, 'Modul mengikuti pengelompokan SAP (Heizer et al., 2017, Gambar 14.11); MRP menjadi inti modul produksi.', rx + 0.3, 6.35, rw - 0.6, 0.35, { fs: 10, color: MUTED, italic: true, align: 'center' });
  }
  {
    const s = newSlide('Bagian 2 – ERP', 'Keunggulan dan kelemahan ERP menurut Heizer et al.; pelajaran implementasi menurut Slack et al. Daftar ini menjadi dasar evaluasi kasus Alaska Airlines pada Bagian 4.');
    title(s, 'Keunggulan dan Kelemahan ERP: Dasar Evaluasi Kasus');
    const colw = (CW - 0.3) / 2;
    const adv = ['Mengintegrasikan rantai pasok, produksi, dan administrasi.', 'Menciptakan keseragaman basis data (*commonality of databases*).', 'Memuat proses terbaik hasil *reengineering*.', 'Meningkatkan komunikasi dan kolaborasi antarunit dan antarlokasi.', 'Perangkat lunak standar (*off-the-shelf*), bukan kode khusus.', 'Berpotensi memberi keunggulan strategis atas pesaing.'];
    const dis = ['Sangat mahal untuk dibeli dan jauh lebih mahal untuk dikustomisasi (hingga lima kali harga perangkat lunak).', 'Menuntut perubahan besar pada perusahaan dan prosesnya.', 'Begitu kompleks sehingga banyak perusahaan gagal beradaptasi.', 'Implementasi berkelanjutan yang mungkin tidak pernah selesai.', 'Keahlian ERP langka; masalah kepegawaian berkelanjutan.'];
    [[adv, 'Keunggulan', GREEN2, 'FaThumbsUp'], [dis, 'Kelemahan', CANYON, 'FaThumbsDown']].forEach((c, i) => {
      const x = M + i * (colw + 0.3);
      card(s, x, 1.45, colw, 4.45);
      iconCircle(s, c[3], x + 0.3, 1.7, 0.6, { bg: c[2], fg: WHITE });
      T(s, c[1], x + 1.05, 1.7, 3, 0.6, { fs: 17, bold: true, valign: 'middle' });
      bullets(s, c[0], x + 0.3, 2.5, colw - 0.6, 3.3, { fs: 13.5, numbered: true, psa: 9 });
    });
    card(s, M, 6.08, CW, 0.75, { fill: NAVY, flat: true });
    T(s, '**Pelajaran implementasi (Slack et al., 2022):** keberhasilan ERP lebih ditentukan oleh disiplin proses dan perubahan organisasi daripada oleh teknologinya; proses harus distandarkan sebelum diintegrasikan.', M + 0.3, 6.08, CW - 0.6, 0.75, { fs: 12, color: WHITE, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 2 – ERP', 'ERP di sektor jasa menurut Heizer et al. dan anatomi sistem terintegrasi maskapai: passenger service system, crew management, maintenance and engineering, flight operations, keuangan dan SDM. Nilai: satu kebenaran data; risiko: single point of failure. Jembatan ke Bagian 3.');
    title(s, 'ERP di Sektor Jasa dan Anatomi Sistem Terintegrasi Maskapai');
    card(s, M, 1.45, 4.3, 4.45);
    T(s, 'ERP di sektor jasa', M + 0.3, 1.7, 3.8, 0.4, { fs: 16, bold: true });
    T(s, 'Heizer et al. (2017) mencatat modul ERP untuk layanan kesehatan, pemerintahan, ritel, hotel, dan jasa keuangan. Contoh yang relevan: PeopleSoft/Oracle memadukan ERP dengan *supply chain management* untuk mengoordinasikan penyiapan makanan maskapai; Springer-Miller mengintegrasikan reservasi kamar, restoran, dan multiproperti hotel.', M + 0.3, 2.12, 3.8, 2.3, { fs: 12 });
    card(s, M + 0.3, 4.5, 3.7, 1.2, { fill: PALE, flat: true });
    T(s, 'Pada jasa, "produk" adalah kapasitas dan jadwal; integrasi data karenanya menyentuh langsung pelayanan pelanggan.', M + 0.45, 4.5, 3.4, 1.2, { fs: 11.5, valign: 'middle', italic: true });
    const rx = M + 4.55, rw = CW - 4.55;
    card(s, rx, 1.45, rw, 4.45);
    T(s, 'Sistem operasi terintegrasi maskapai', rx + 0.3, 1.65, rw - 0.6, 0.4, { fs: 16, bold: true });
    const nodes = [
      ['FaTicketAlt', 'Passenger service system', 'Reservasi, *check-in*, *rebooking*'],
      ['FaUserClock', 'Crew management', '*Bidding*, legalitas FAA, *pairing*'],
      ['FaTools', 'Maintenance & engineering', '*Work orders*, suku cadang (MRP)'],
      ['FaCloudSun', 'Flight operations', '*Dispatch*, cuaca, *slot*'],
      ['FaMoneyCheckAlt', 'Keuangan & SDM', 'Biaya, *payroll*, pelaporan'],
    ];
    const cx = rx + rw / 2, cy = 4.05;
    const pos = nodes.map((n, i) => { const ang = -Math.PI / 2 + i * (2 * Math.PI / 5); return [cx + 2.6 * Math.cos(ang), cy + 1.35 * Math.sin(ang)]; });
    pos.forEach(p => line(s, cx, cy, p[0], p[1], { color: LIGHT2, w: 1.5 }));
    nodes.forEach((n, i) => {
      const [nx, ny] = pos[i];
      const bw = 2.35, bh = 0.95, bx = nx - bw / 2, by = ny - bh / 2;
      card(s, bx, by, bw, bh, { flat: true, fill: PALE });
      iconCircle(s, n[0], bx + 0.1, by + 0.22, 0.5, { bg: i % 2 ? BREEZE : GREEN });
      T(s, n[1], bx + 0.7, by + 0.08, bw - 0.78, 0.5, { fs: 10.5, bold: true, valign: 'middle' });
      T(s, n[2], bx + 0.7, by + 0.58, bw - 0.78, 0.34, { fs: 9.5, color: NAVY2 });
    });
    s.addShape(pres.ShapeType.ellipse, { x: cx - 0.8, y: cy - 0.55, w: 1.6, h: 1.1, fill: { color: NAVY }, line: { color: NAVY, width: 0.25 }, shadow: shadow(), objectName: 'hub' });
    T(s, 'Basis data operasi bersama', cx - 0.75, cy - 0.5, 1.5, 1.0, { fs: 10.5, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    card(s, M, 6.08, CW, 0.75, { fill: NAVY, flat: true });
    T(s, '**Nilai:** satu kebenaran data untuk semua fungsi. **Risiko:** *single point of failure*. Sistem terintegrasi menyediakan rencana yang konsisten, tetapi keputusan jam-ke-jam tetap memerlukan teknik *sequencing and scheduling* (Bagian 3).', M + 0.3, 6.08, CW - 0.6, 0.75, { fs: 12, color: WHITE, valign: 'middle' });
  }

  // ======================= BAGIAN 3: SEQUENCING & SCHEDULING =======================
  pres.addSection({ title: 'Bagian 3 – Sequencing & Scheduling' });
  divider('Bagian 3 – Sequencing & Scheduling', 'BAGIAN 3', 'Sequencing and Scheduling', 'Mengalokasikan dan memprioritaskan permintaan ke fasilitas yang tersedia dalam horizon hari dan jam.', 'HRM Bab 15  ·  SBB Bab 10', 'deicing.png', 'Pembuka Bagian 3.');
  {
    const s = newSlide('Bagian 3 – Sequencing & Scheduling', 'Arti strategis short-term scheduling (internal dan eksternal) serta tiga isu pokok menurut Heizer et al.: forward versus backward scheduling, finite versus infinite loading, dan empat kriteria penjadwalan. Kutipan Heizer tentang Alaska Airlines menjadi jembatan ke kasus.');
    title(s, 'Short-Term Scheduling: Arti Strategis dan Tiga Isu Pokok');
    const colw = (CW - 0.3) / 2;
    [['Dampak internal', 'Aliran barang dan jasa lebih cepat serta pemakaian aset lebih besar, sehingga kapasitas per dolar investasi naik dan biaya turun.', GREEN], ['Dampak eksternal', '*Throughput* lebih cepat, fleksibilitas lebih tinggi, dan pengiriman lebih andal, sehingga layanan pelanggan membaik.', BREEZE]].forEach((c, i) => {
      const x = M + i * (colw + 0.3);
      card(s, x, 1.45, colw, 1.2);
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: 1.75, w: 0.6, h: 0.6, fill: { color: c[2] }, line: { color: c[2], width: 0.25 }, objectName: 'dot' });
      T(s, c[0], x + 1.1, 1.55, colw - 1.4, 0.35, { fs: 14, bold: true });
      T(s, c[1], x + 1.1, 1.9, colw - 1.4, 0.7, { fs: 11.5 });
    });
    const issues = [
      ['FaArrowsAltH', 'Forward vs backward scheduling', '*Forward*: mulai begitu kebutuhan diketahui (rumah sakit, restoran). *Backward*: mulai dari *due date* mundur (katering, bedah). Praktik biasanya memadukan keduanya.'],
      ['FaBalanceScale', 'Finite vs infinite loading', '*Finite loading* membebani hanya sampai kapasitas; *infinite loading* mengabaikannya. Kebanyakan sistem MRP bersifat *infinite loading*, sehingga kapasitas harus disesuaikan belakangan.'],
      ['FaListOl', 'Kriteria penjadwalan', 'Minimasi waktu penyelesaian, maksimasi utilisasi, minimasi persediaan *work-in-process*, dan minimasi waktu tunggu pelanggan. Teknik dipilih menurut kriteria yang diutamakan.'],
    ];
    const iw = (CW - 2 * 0.25) / 3;
    issues.forEach((it, i) => {
      const x = M + i * (iw + 0.25), y = 2.85, h = 2.75;
      card(s, x, y, iw, h);
      iconCircle(s, it[0], x + 0.25, y + 0.25, 0.62, { bg: PALE });
      T(s, it[1], x + 1.0, y + 0.25, iw - 1.2, 0.62, { fs: 13.5, bold: true, valign: 'middle' });
      T(s, it[2], x + 0.25, y + 1.0, iw - 0.5, 1.7, { fs: 11.5 });
    });
    card(s, M, 5.8, CW, 1.0, { fill: NAVY, flat: true });
    iconCircle(s, 'FaQuoteLeft', M + 0.3, 6.0, 0.6, { bg: BREEZE });
    T(s, '"Alaska Airlines tidak hanya menjadwalkan 150 pesawatnya setiap hari; ia juga menjadwalkan lebih dari 4.500 pilot dan awak kabin... Alaska menemukan keunggulan kompetitif pada kemampuannya melakukan penyesuaian menit terakhir terhadap fluktuasi permintaan dan gangguan cuaca." (Heizer et al., 2017, hlm. 602)', M + 1.1, 5.8, CW - 1.4, 1.0, { fs: 11.5, color: WHITE, valign: 'middle', italic: true });
  }
  {
    const s = newSlide('Bagian 3 – Sequencing & Scheduling', 'Loading: input-output control, Gantt chart (load chart dan schedule chart), dan assignment method. Gantt load chart diilustrasikan untuk tiga bay hangar selama satu minggu.');
    title(s, 'Loading: Input-Output Control, Gantt Chart, dan Assignment Method');
    const cw = (CW - 2 * 0.25) / 3;
    const cards = [
      ['FaExchangeAlt', 'Input-output control', 'Membandingkan input dan output terencana terhadap aktual per pusat kerja. Bila input melebihi output, antrean dan *lead time* membengkak; dikendalikan dengan menunda rilis pekerjaan, menambah kapasitas, atau mengalihkan beban.'],
      ['FaChartBar', 'Gantt chart', '*Load chart* memperlihatkan beban setiap pusat kerja; *schedule chart* memantau kemajuan pekerjaan terhadap waktu. Keduanya sederhana, tetapi tidak otomatis memperhitungkan variabilitas proses.'],
      ['FaProjectDiagram', 'Assignment method', 'Kasus khusus pemrograman linear: menugaskan satu pekerjaan ke satu sumber daya dengan total biaya atau waktu minimum melalui reduksi baris, reduksi kolom, uji garis minimum, lalu penugasan.'],
    ];
    cards.forEach((c, i) => {
      const x = M + i * (cw + 0.25), y = 1.45, h = 2.6;
      card(s, x, y, cw, h);
      iconCircle(s, c[0], x + 0.25, y + 0.25, 0.62, { bg: i === 1 ? GREEN : BREEZE });
      T(s, c[1], x + 1.0, y + 0.25, cw - 1.2, 0.62, { fs: 14, bold: true, valign: 'middle' });
      T(s, c[2], x + 0.25, y + 1.0, cw - 0.5, 1.55, { fs: 11.5 });
    });
    // Gantt load chart
    card(s, M, 4.25, CW, 2.58);
    T(s, 'Ilustrasi *Gantt load chart*: beban tiga *bay* hangar dalam satu minggu', M + 0.3, 4.38, CW - 0.6, 0.35, { fs: 13, bold: true });
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const gx = M + 1.6, gy = 4.8, gw = CW - 2.1, dw = gw / 6, rh = 0.46;
    days.forEach((d, i) => { T(s, d, gx + i * dw, gy, dw, 0.28, { fs: 10.5, bold: true, align: 'center', color: NAVY2 }); line(s, gx + i * dw, gy + 0.3, gx + i * dw, gy + 0.3 + 3 * rh, { color: LIGHT2, w: 0.75 }); });
    line(s, gx + 6 * dw, gy + 0.3, gx + 6 * dw, gy + 0.3 + 3 * rh, { color: LIGHT2, w: 0.75 });
    const bars = [[0, 0, 3, 'Pesawat 1 – C-check', ATLAS], [0, 3.5, 5, 'Pesawat 4', GREEN2], [1, 0, 2, 'Pesawat 2', GREEN2], [1, 2, 6, 'Pesawat 5 – mesin', ATLAS], [2, 1, 4, 'Pesawat 3', ATLAS], [2, 4.5, 6, 'Perawatan terjadwal bay', MUTED]];
    ['Bay 1', 'Bay 2', 'Bay 3'].forEach((b, i) => T(s, b, M + 0.3, gy + 0.3 + i * rh, 1.2, rh, { fs: 11.5, bold: true, valign: 'middle' }));
    bars.forEach(b => {
      const bx = gx + b[1] * dw, bw = (b[2] - b[1]) * dw, by = gy + 0.3 + b[0] * rh + 0.07;
      s.addShape(pres.ShapeType.roundRect, { x: bx + 0.03, y: by, w: bw - 0.06, h: rh - 0.14, fill: { color: b[4] }, line: { color: b[4], width: 0.25 }, rectRadius: 0.08, objectName: 'gantt bar' });
      T(s, b[3], bx + 0.1, by, bw - 0.2, rh - 0.14, { fs: 9.5, bold: true, color: WHITE, valign: 'middle' });
    });
  }
  {
    const s = newSlide('Bagian 3 – Sequencing & Scheduling', 'Empat aturan prioritas dan perbandingan kinerjanya pada data HRM Contoh 15.4 yang diadaptasi sebagai lima paket pekerjaan hangar. SPT unggul pada tiga kriteria; EDD meminimumkan keterlambatan; LPT terburuk. Tidak ada aturan yang unggul pada semua kriteria.');
    title(s, 'Sequencing: Aturan Prioritas dan Perbandingan Kinerjanya');
    card(s, M, 1.45, 4.9, 2.55);
    T(s, 'Aturan prioritas (*dispatching rules*)', M + 0.25, 1.6, 4.4, 0.35, { fs: 13.5, bold: true });
    bullets(s, ['**FCFS** (*first come, first served*): urutan kedatangan; adil, tetapi tidak optimal.', '**SPT** (*shortest processing time*): pekerjaan terpendek lebih dahulu.', '**EDD** (*earliest due date*): tenggat terdekat lebih dahulu.', '**LPT** (*longest processing time*): pekerjaan terpanjang lebih dahulu.'], M + 0.25, 2.0, 4.4, 1.95, { fs: 11.5, psa: 3 });
    card(s, M, 4.2, 4.9, 2.62);
    s.addChart(pres.ChartType.bar, [{ name: 'Rata-rata waktu penyelesaian (hari)', labels: ['FCFS', 'SPT', 'EDD', 'LPT'], values: [15.4, 13.0, 13.6, 20.6] }], {
      x: M + 0.15, y: 4.28, w: 4.6, h: 2.48, barDir: 'col', chartColors: [LIGHT2, ATLAS, GREEN2, CANYON], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0', dataLabelFontSize: 10, dataLabelColor: NAVY, dataLabelFontFace: '+mn-lt',
      catAxisLabelFontSize: 10, catAxisLabelColor: NAVY, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false,
      showTitle: true, title: 'Rata-rata waktu penyelesaian (hari) per aturan', titleFontSize: 11, titleColor: NAVY, titleFontFace: '+mn-lt', valAxisMinVal: 0, valAxisMaxVal: 25, barGapWidthPct: 60, objectName: 'chart waktu penyelesaian',
    });
    const rx = M + 5.15, rw = CW - 5.15;
    card(s, rx, 1.45, rw, 5.37);
    T(s, 'Data: lima paket pekerjaan hangar A–E dengan waktu proses 6, 2, 8, 3, 9 hari dan *due date* 8, 6, 18, 15, 23 hari (mengikuti HRM Contoh 15.4).', rx + 0.25, 1.58, rw - 0.5, 0.6, { fs: 11.5 });
    const rows = tableRows(['Aturan', 'Urutan', 'Waktu penyelesaian rata-rata (hari)', 'Utilisasi (%)', 'Jumlah pekerjaan rata-rata', 'Keterlambatan rata-rata (hari)'], [
      [{ text: 'FCFS', bold: true }, 'A–B–C–D–E', '15,4', '36,4', '2,75', '2,2'],
      [{ text: 'SPT', bold: true }, 'B–D–A–C–E', { text: '13,0', bold: true, fill: LIGHT }, { text: '43,1', bold: true, fill: LIGHT }, { text: '2,32', bold: true, fill: LIGHT }, '1,8'],
      [{ text: 'EDD', bold: true }, 'B–A–D–C–E', '13,6', '41,2', '2,43', { text: '1,2', bold: true, fill: LIGHT }],
      [{ text: 'LPT', bold: true }, 'E–C–A–D–B', '20,6', '27,2', '3,68', '9,6'],
    ], { fs: 10.5 });
    const tw = rw - 0.5;
    addTable(s, rows, rx + 0.25, 2.2, tw, [0.75, 1.2, 1.2, 0.95, 1.15, tw - 5.25], { rowH: 0.38 });
    T(s, 'Utilisasi = Σ waktu proses ÷ Σ waktu alir;  jumlah pekerjaan rata-rata = Σ waktu alir ÷ Σ waktu proses.', rx + 0.25, 4.78, tw, 0.3, { fs: 10, color: MUTED, italic: true });
    card(s, rx + 0.25, 5.2, tw, 1.45, { fill: PALE, flat: true });
    T(s, '**Pembacaan:** SPT unggul pada tiga kriteria, EDD meminimumkan keterlambatan, LPT terburuk pada semuanya. Tidak ada aturan yang unggul di semua kriteria; SPT juga menunda pekerjaan panjang terus-menerus. Inilah dasar aturan hibrida pada kasus.', rx + 0.4, 5.2, tw - 0.3, 1.45, { fs: 11.5, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 3 – Sequencing & Scheduling', 'Critical ratio sebagai aturan dinamis, dan Johnson\'s rule untuk N pekerjaan pada dua pusat kerja berurutan. Contoh mengikuti HRM Contoh 15.5 dan 15.6, diadaptasi ke alur inspeksi lalu perbaikan. Urutan B–E–D–C–A memberi makespan 35 jam dibanding 45 jam pada urutan A–E.');
    title(s, 'Critical Ratio dan Johnson\'s Rule untuk Dua Pusat Kerja Berurutan');
    card(s, M, 1.45, 4.6, 5.37);
    iconCircle(s, 'FaStopwatch', M + 0.25, 1.65, 0.6, { bg: BREEZE });
    T(s, 'Critical ratio (CR)', M + 1.0, 1.65, 3.4, 0.6, { fs: 15, bold: true, valign: 'middle' });
    card(s, M + 0.25, 2.45, 4.1, 0.75, { fill: NAVY, flat: true });
    T(s, 'CR = (waktu tersisa hingga *due date*) ÷ (hari kerja yang tersisa)', M + 0.4, 2.45, 3.8, 0.75, { fs: 12, color: WHITE, valign: 'middle', align: 'center' });
    T(s, 'CR < 1 berarti terlambat terhadap jadwal, CR = 1 tepat jadwal, CR > 1 masih longgar. Pekerjaan dengan CR terkecil dikerjakan lebih dahulu; nilainya diperbarui setiap hari, sehingga cocok untuk antrean *aircraft-on-ground* (AOG).', M + 0.25, 3.3, 4.1, 1.35, { fs: 11.5 });
    const crRows = tableRows(['Pekerjaan', 'Due date', 'Sisa kerja', 'CR', 'Prioritas'], [
      ['A', '30', '4 hari', '1,25', '3'], ['B', '28', '5 hari', { text: '0,60', bold: true, fill: LIGHT }, { text: '1', bold: true }], ['C', '27', '2 hari', '1,00', '2'],
    ], { fs: 11.5 });
    addTable(s, crRows, M + 0.25, 4.75, 4.1, [1.0, 0.8, 0.9, 0.7, 0.7], { rowH: 0.36 });
    T(s, 'Hari ini = hari ke-25 (HRM Contoh 15.5).', M + 0.25, 6.3, 4.1, 0.3, { fs: 10, color: MUTED, italic: true });
    const rx = M + 4.85, rw = CW - 4.85;
    card(s, rx, 1.45, rw, 5.37);
    iconCircle(s, 'FaRandom', rx + 0.25, 1.65, 0.6, { bg: GREEN });
    T(s, 'Johnson\'s rule: N pekerjaan, dua pusat kerja', rx + 1.0, 1.65, rw - 1.3, 0.6, { fs: 15, bold: true, valign: 'middle' });
    T(s, 'Langkah: (1) daftar waktu setiap pekerjaan di kedua pusat kerja; (2) pilih waktu terpendek; (3) bila di pusat kerja pertama, jadwalkan paling awal, bila di pusat kerja kedua, jadwalkan paling akhir; (4) coret dan ulangi.', rx + 0.25, 2.3, rw - 0.5, 0.9, { fs: 11.5 });
    const jRows = tableRows(['Pekerjaan', 'Inspeksi (jam)', 'Perbaikan & uji (jam)'], [['A', '5', '2'], ['B', '3', '6'], ['C', '8', '4'], ['D', '10', '7'], ['E', '7', '12']], { fs: 11 });
    addTable(s, jRows, rx + 0.25, 3.25, 3.0, [0.9, 1.0, 1.1], { rowH: 0.3 });
    card(s, rx + 3.5, 3.25, rw - 3.75, 1.8, { fill: PALE, flat: true });
    T(s, '**Hasil:** urutan **B–E–D–C–A**, *makespan* **35 jam**; urutan sembarang A–B–C–D–E memerlukan 45 jam. Pusat kerja kedua menganggur hanya saat menunggu pekerjaan pertama.', rx + 3.65, 3.25, rw - 4.05, 1.8, { fs: 11.5, valign: 'middle' });
    // Gantt 2 rows
    const gx = rx + 1.35, gy = 5.3, gw = rw - 1.65, scale = gw / 35, rh = 0.42;
    const g1 = [['B', 0, 3], ['E', 3, 10], ['D', 10, 20], ['C', 20, 28], ['A', 28, 33]];
    const g2 = [['B', 3, 9], ['E', 10, 22], ['D', 22, 29], ['C', 29, 33], ['A', 33, 35]];
    T(s, 'Inspeksi', rx + 0.25, gy, 1.05, rh, { fs: 10.5, bold: true, valign: 'middle' });
    T(s, 'Perbaikan', rx + 0.25, gy + rh + 0.06, 1.05, rh, { fs: 10.5, bold: true, valign: 'middle' });
    [[g1, 0, ATLAS], [g2, 1, GREEN2]].forEach(([g, r, col]) => g.forEach(b => {
      const bx = gx + b[1] * scale, bw = (b[2] - b[1]) * scale, by = gy + r * (rh + 0.06);
      s.addShape(pres.ShapeType.roundRect, { x: bx + 0.02, y: by, w: bw - 0.04, h: rh, fill: { color: col }, line: { color: col, width: 0.25 }, rectRadius: 0.06, objectName: 'gantt bar' });
      T(s, b[0], bx, by, bw, rh, { fs: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    }));
    [0, 10, 20, 30].forEach(t => T(s, String(t), gx + t * scale - 0.3, gy + 2 * rh + 0.1, 0.6, 0.25, { fs: 9, align: 'center', color: MUTED }));
    T(s, '35 jam', gx + gw - 0.55, gy + 2 * rh + 0.1, 0.75, 0.25, { fs: 9, color: MUTED, align: 'right' });
  }
  {
    const s = newSlide('Bagian 3 – Sequencing & Scheduling', 'Keterbatasan sistem penjadwalan berbasis aturan, finite capacity scheduling sebagai jawabannya, dan cyclical scheduling untuk jasa dengan kebutuhan harian yang bervariasi. Contoh petugas gate mengikuti data HRM Contoh 15.8 (kebutuhan 5-5-6-5-4-3-3) dengan hasil tujuh petugas.');
    title(s, 'Finite Capacity Scheduling dan Cyclical Scheduling untuk Jasa');
    card(s, M, 1.45, 5.6, 5.37);
    iconCircle(s, 'FaMicrochip', M + 0.25, 1.65, 0.6, { bg: BREEZE });
    T(s, 'Dari aturan prioritas ke finite capacity scheduling (FCS)', M + 1.0, 1.65, 4.4, 0.6, { fs: 14.5, bold: true, valign: 'middle' });
    T(s, 'Keterbatasan sistem berbasis aturan (Heizer et al., 2017):', M + 0.25, 2.4, 5.1, 0.3, { fs: 12, bold: true });
    bullets(s, ['Penjadwalan bersifat dinamis sehingga aturan harus terus direvisi.', 'Aturan tidak melihat ke hulu maupun ke hilir, sehingga *bottleneck* dan sumber daya menganggur luput.', 'Aturan mengabaikan faktor di luar *due date* dan waktu proses.'], M + 0.25, 2.75, 5.1, 1.5, { fs: 11.5, psa: 3 });
    card(s, M + 0.25, 4.35, 5.1, 2.3, { fill: PALE, flat: true });
    T(s, '**FCS** adalah penjadwalan interaktif terkomputerisasi dengan kapasitas berhingga: menerima data dari ERP/MRP, memperhitungkan *setup*, perawatan, dan lembur, menyajikan jadwal grafis yang dapat diubah secara *what-if*, serta memadukan *expert system* dan simulasi. Dalam istilah Slack et al. (2022), inilah *finite loading* yang terintegrasi dengan *monitoring and control*.', M + 0.4, 4.35, 4.8, 2.3, { fs: 11.5, valign: 'middle' });
    const rx = M + 5.85, rw = CW - 5.85;
    card(s, rx, 1.45, rw, 5.37);
    iconCircle(s, 'FaSyncAlt', rx + 0.25, 1.65, 0.6, { bg: GREEN });
    T(s, 'Cyclical scheduling: petugas *gate* dengan dua hari libur berurutan', rx + 1.0, 1.65, rw - 1.3, 0.6, { fs: 14.5, bold: true, valign: 'middle' });
    T(s, 'Lima langkah: tetapkan kebutuhan harian; lingkari dua hari berurutan berkebutuhan terendah sebagai hari libur petugas pertama; kurangi 1 pada hari yang dikerjakan; ulangi hingga seluruh kebutuhan terpenuhi (ikatan: dahulukan Sabtu–Minggu).', rx + 0.25, 2.3, rw - 0.5, 0.95, { fs: 11.5 });
    const dayH = ['', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const cyc = [
      ['Kebutuhan', ['5', '5', '6', '5', '4', '3', '3']],
      ['Petugas 1–7 (hari libur)', ['P5, P7', 'P5, P7', '–', 'P3, P6', 'P3, P6', 'P1, P2, P4', 'P1, P2, P4']],
      ['Kapasitas tersedia', ['6', '6', '7', '5', '5', '3', '3']],
      ['Kelebihan kapasitas', ['1', '1', '1', '0', '1', '0', '0']],
    ];
    const cRows = tableRows(dayH, cyc.map((r, i) => [{ text: r[0], bold: true }, ...r[1].map(v => ({ text: v, fill: i === 1 ? PALE : undefined }))]), { fs: 10.5 });
    addTable(s, cRows, rx + 0.25, 3.35, rw - 0.5, [1.9, ...Array(7).fill((rw - 0.5 - 1.9) / 7)], { rowH: 0.4 });
    card(s, rx + 0.25, 5.45, rw - 0.5, 1.2, { fill: NAVY, flat: true });
    T(s, '**Hasil:** tujuh petugas memenuhi kebutuhan 31 orang-hari dengan total kelebihan 4 orang-hari. Teknik ini dipakai luas untuk perawat, polisi, kasir, dan staf layanan bandara yang kebutuhannya bervariasi antarhari.', rx + 0.4, 5.45, rw - 0.8, 1.2, { fs: 11.5, color: WHITE, valign: 'middle' });
  }

  // ======================= BAGIAN 4: STUDI KASUS =======================
  pres.addSection({ title: 'Bagian 4 – Studi Kasus Alaska Airlines' });
  divider('Bagian 4 – Studi Kasus Alaska Airlines', 'BAGIAN 4', 'Studi Kasus: Alaska Airlines', 'Menerapkan kerangka Bagian 1–3: profil, permasalahan, analisis, evaluasi, dan rekomendasi.', 'Case Study 5  ·  HRM Bab 15 (Global Company Profile)', 'ops_center.png', 'Pembuka Bagian 4: studi kasus.');
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Profil Alaska Airlines: angka dari Alaska Air Group fact sheet, Aviacionline (armada akhir 2024), Heizer et al. (2017), dan Cirium 2024 On-Time Performance Review (dikutip Fox Business, Januari 2025). Merger dengan Hawaiian Airlines selesai 2024; single operating certificate FAA pada 29 Oktober 2025.');
    title(s, 'Profil Alaska Airlines: Skala Operasi yang Dijadwalkan Setiap Hari');
    const stats = [
      ['FaMapMarkedAlt', '140+', 'destinasi di Amerika Utara, Amerika Tengah, Asia, dan Pasifik', 'Alaska Air Group (fact sheet)'],
      ['FaUsers', '30.000+', 'karyawan Alaska Air Group (Alaska, Horizon, Hawaiian)', 'Alaska Air Group (fact sheet)'],
      ['FaPlane', '392', 'pesawat pada akhir 2024: 239 Alaska, 44 Horizon, 71 Hawaiian', 'Aviacionline (2025)'],
      ['FaPercentage', '>50%', 'penerbangan domestik di Seattle–Tacoma (SEA), hub utama', 'Heizer et al. (2017)'],
      ['FaUserTie', '4.500+', 'pilot dan awak kabin dijadwalkan setiap hari', 'Heizer et al. (2017)'],
      ['FaDollarSign', 'US$18 juta', 'penghematan per tahun dari teknologi penjadwalan ulang', 'Heizer et al. (2017)'],
    ];
    const sw = (7.0 - 2 * 0.2) / 3, shh = 2.1;
    stats.forEach((st, i) => {
      const col = i % 3, row = Math.floor(i / 3), x = M + col * (sw + 0.2), y = 1.45 + row * (shh + 0.2);
      card(s, x, y, sw, shh);
      iconCircle(s, st[0], x + 0.2, y + 0.2, 0.5, { bg: row ? GREEN : BREEZE });
      T(s, st[1], x + 0.2, y + 0.75, sw - 0.4, 0.5, { fs: 24, bold: true, color: ATLAS });
      T(s, st[2], x + 0.2, y + 1.25, sw - 0.4, 0.6, { fs: 10.5 });
      T(s, st[3], x + 0.2, y + 1.82, sw - 0.4, 0.25, { fs: 8.5, color: MUTED, italic: true });
    });
    const rx = M + 7.25, rw = CW - 7.25;
    card(s, rx, 1.45, rw, 4.4);
    s.addChart(pres.ChartType.bar, [{ name: 'Ketepatan waktu kedatangan 2024 (%)', labels: ['Delta', 'United', 'Alaska', 'American', 'Southwest'], values: [83.46, 80.93, 79.25, 77.78, 77.77] }], {
      x: rx + 0.15, y: 1.55, w: rw - 0.3, h: 3.85, barDir: 'bar', catAxisOrientation: 'maxMin', chartColors: [LIGHT2, LIGHT2, ATLAS, LIGHT2, LIGHT2], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00', dataLabelFontSize: 10, dataLabelColor: NAVY, dataLabelFontFace: '+mn-lt',
      catAxisLabelFontSize: 11, catAxisLabelColor: NAVY, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false,
      showTitle: true, title: 'Ketepatan waktu kedatangan 2024 (%), lima besar Amerika Utara', titleFontSize: 11, titleColor: NAVY, titleFontFace: '+mn-lt', valAxisMinVal: 70, valAxisMaxVal: 90, barGapWidthPct: 45, objectName: 'chart ketepatan waktu',
    });
    T(s, 'Sumber: Cirium, 2024 On-Time Performance Review (Januari 2025). Alaska peringkat ke-3 Amerika Utara.', rx + 0.3, 5.45, rw - 0.6, 0.35, { fs: 9, color: MUTED, italic: true, align: 'center' });
    card(s, M, 6.05, CW, 0.78, { fill: NAVY, flat: true });
    T(s, '**Konteks 2024–2025:** merger dengan Hawaiian Airlines rampung September 2024; FAA memberikan *single operating certificate* pada 29 Oktober 2025. Dua merek, satu sistem operasi: tantangan integrasi khas ERP.', M + 0.3, 6.05, CW - 0.6, 0.78, { fs: 12, color: WHITE, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Lima sumber gangguan terhadap rencana: cuaca di SEA, geografi Alaska, skala dan saling ketergantungan, kegagalan sistem terintegrasi (dua outage pada 2025), serta grounding 737 MAX 9 pada Januari 2024. Setiap masalah dipetakan ke dimensi teori yang relevan.');
    title(s, 'Permasalahan Operasional: Lima Sumber Gangguan Rencana');
    const probs = [
      ['FaCloudRain', 'Cuaca sebagai "musuh"', 'SEA menerima hujan sekitar 5 inci per bulan pada musim dingin. Satu badai Desember memaksa rencana pembatalan 50–80% penerbangan setelah pukul 18.00 (Heizer et al., 2017).', 'Control jangka pendek'],
      ['FaMountain', 'Geografi Alaska', 'Juneau dikepung gunung dengan *wind shear*; Sitka berlandasan tunggal di tanah sempit; di Kodiak landasan berujung di lereng gunung sehingga hanya kapten yang boleh mendarat.', 'Kendala sequencing kru'],
      ['FaNetworkWired', 'Skala dan saling ketergantungan', 'Pesawat, kru, perawatan, *gate*, dan katering harus serempak; satu perubahan jadwal menimbulkan *ripple effect* ke puluhan bandara.', 'Integrasi (ERP)'],
      ['FaServer', 'Kegagalan sistem terintegrasi', '20 Juli 2025: kegagalan perangkat keras pusat data, *ground stop* ±3 jam, >150 pembatalan. 23 Oktober 2025: kegagalan pusat data utama, ±8 jam, >400 pembatalan, ±49.000 penumpang terdampak.', 'Kelemahan ERP'],
      ['FaPlaneSlash', 'Grounding 737 MAX 9 (Jan 2024)', '65 pesawat dikandangkan untuk inspeksi; sekitar 3.000 pembatalan dalam sebulan; dampak finansial sekitar US$150 juta.', 'Lonjakan kebutuhan perawatan (MRP)'],
    ];
    const cw = (CW - 2 * 0.25) / 3, ch = 2.55;
    probs.forEach((p, i) => {
      const col = i % 3, row = Math.floor(i / 3), x = M + col * (cw + 0.25), y = 1.45 + row * (ch + 0.22);
      card(s, x, y, cw, ch);
      iconCircle(s, p[0], x + 0.25, y + 0.22, 0.6, { bg: row ? GREEN : BREEZE });
      T(s, p[1], x + 1.0, y + 0.22, cw - 1.2, 0.6, { fs: 13.5, bold: true, valign: 'middle' });
      T(s, p[2], x + 0.25, y + 0.95, cw - 0.5, 1.25, { fs: 11 });
      pill(s, p[3], x + 0.25, y + ch - 0.48, cw - 0.5, 0.3, { fill: PALE, fs: 9.5 });
    });
    const x5 = M + 2 * (cw + 0.25), y5 = 1.45 + ch + 0.22;
    card(s, x5, y5, cw, ch, { fill: NAVY, flat: true });
    T(s, 'Pertanyaan analisis', x5 + 0.25, y5 + 0.25, cw - 0.5, 0.4, { fs: 14, bold: true, color: BREEZE });
    T(s, 'Bagaimana MRP, ERP, serta *sequencing and scheduling* menjelaskan cara Alaska Airlines menjaga ketepatan waktu di tengah lima gangguan ini, dan di mana letak kelemahan yang masih harus dibenahi?', x5 + 0.25, y5 + 0.7, cw - 0.5, 1.7, { fs: 12, color: WHITE });
  }
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Analisis 1: satu hari badai Desember di Seattle menurut Heizer et al. (2017, hlm. 600). Lima titik waktu menunjukkan siklus prakiraan (planning) dan tindakan (control). Lampu andon di Flight Operations Department sebagai pengendalian visual.');
    title(s, 'Analisis 1 — Planning and Control dalam Satu Hari Badai di Seattle');
    const tl = [
      ['04.00', 'Hujan dengan kemungkinan salju ringan.', 'Membahas status pesawat dan kemungkinan kebutuhan pembatalan.'],
      ['10.00', 'Hujan beku setelah pukul 17.00.', 'Menyiapkan truk *deicing*; menyusun rencana pembatalan 50–80% penerbangan setelah pukul 18.00.'],
      ['13.30', 'Hujan berubah menjadi salju.', 'Membatalkan separuh penerbangan pukul 18.00–10.00; memberi tahu penumpang; mengalihkan rute pesawat.'],
      ['17.00', 'Salju lebih sedikit dari perkiraan.', 'Terus menghubungi penumpang dan mengatur penerbangan alternatif.'],
      ['22.00', 'Salju mereda.', 'Mencarikan hotel bagi 600 penumpang yang terdampar oleh badai.'],
    ];
    const cw = (CW - 4 * 0.2) / 5;
    line(s, M + cw / 2, 1.72, M + 4 * (cw + 0.2) + cw / 2, 1.72, { color: ATLAS, w: 2 });
    tl.forEach((t, i) => {
      const x = M + i * (cw + 0.2), y = 2.05, h = 3.0;
      s.addShape(pres.ShapeType.ellipse, { x: x + cw / 2 - 0.09, y: 1.63, w: 0.18, h: 0.18, fill: { color: ATLAS }, line: { color: ATLAS, width: 0.25 }, objectName: 'dot' });
      card(s, x, y, cw, h);
      pill(s, t[0], x + cw / 2 - 0.5, y - 0.17, 1.0, 0.34, { fill: NAVY, color: WHITE, fs: 11 });
      T(s, 'Prakiraan', x + 0.2, y + 0.35, cw - 0.4, 0.28, { fs: 10.5, bold: true, color: NAVY2 });
      T(s, t[1], x + 0.2, y + 0.63, cw - 0.4, 0.75, { fs: 11 });
      T(s, 'Tindakan', x + 0.2, y + 1.4, cw - 0.4, 0.28, { fs: 10.5, bold: true, color: GREEN2 });
      T(s, t[2], x + 0.2, y + 1.68, cw - 0.4, 1.25, { fs: 11 });
    });
    const bw = (CW - 0.3) / 2;
    card(s, M, 5.3, bw, 1.52, { fill: PALE, flat: true });
    T(s, '**Pembacaan teori:** setiap titik waktu adalah satu siklus *plan–monitor–replan*. Semakin pendek horizonnya, semakin dominan *control* atas *planning* (Slack et al., 2022, Bab 10): prakiraan direvisi lima kali dalam 18 jam, dan setiap revisi memicu intervensi baru.', M + 0.25, 5.3, bw - 0.5, 1.52, { fs: 11.5, valign: 'middle' });
    card(s, M + bw + 0.3, 5.3, bw, 1.52, { fill: NAVY, flat: true });
    T(s, '**Pengendalian visual:** Flight Operations Department di Seattle memantau penerbangan, peta meteorologi, dan pola cuaca pada banyak layar, dengan lampu *andon* hijau (normal), kuning (perlu perhatian), dan merah (darurat). Keunggulan kompetitif Alaska adalah kemampuan penyesuaian menit terakhir (Heizer et al., 2017).', M + bw + 0.55, 5.3, bw - 0.5, 1.52, { fs: 11.5, color: WHITE, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Analisis 2: pemetaan elemen MRP ke perencanaan perawatan dan suku cadang Alaska Airlines. Bukti: grounding MAX 9 (Januari 2024) sebagai lonjakan gross requirements inspeksi, dan kemitraan Tailsight (16 April 2026) sebagai perwujudan closed-loop MRP II dengan kapasitas berhingga.');
    title(s, 'Analisis 2 — Logika MRP pada Perawatan dan Suku Cadang');
    const rows = tableRows(['Elemen MRP (teori)', 'Padanan di Alaska Airlines', 'Implikasi'], [
      [{ text: 'Master production schedule', bold: true }, { text: 'Rencana perawatan per tail number, diturunkan dari flight timetable serta jam terbang dan siklus pesawat', align: 'left' }, { text: 'Kebutuhan suku cadang bersifat dependent: dihitung, bukan diramalkan', align: 'left' }],
      [{ text: 'Bill of material', bold: true }, { text: 'Work package dan task card: daftar komponen dan jam kerja (bill of material dan bill of labor)', align: 'left' }, { text: 'Explosion kebutuhan per paket perawatan', align: 'left' }],
      [{ text: 'Catatan persediaan dan scheduled receipts', bold: true }, { text: 'Stok suku cadang di SEA dan basis lain; pesanan OEM yang sedang berjalan', align: 'left' }, { text: 'Netting: hanya kekurangan bersih yang dipesan', align: 'left' }],
      [{ text: 'Lead time', bold: true }, { text: 'Waktu pengadaan komponen dan waktu perbaikan di shop', align: 'left' }, { text: 'Offsetting rilis pesanan agar tiba tepat saat check', align: 'left' }],
      [{ text: 'Kapasitas (closed-loop MRP II)', bold: true }, { text: 'Slot hangar, teknisi bersertifikat, station capability rules', align: 'left' }, { text: 'Load report mencegah rencana yang tidak layak dan AOG', align: 'left' }],
    ], { fs: 11 });
    addTable(s, rows, M, 1.45, 7.3, [2.0, 3.1, 2.2], { rowH: 0.62 });
    const rx = M + 7.55, rw = CW - 7.55;
    card(s, rx, 1.45, rw, 2.5);
    iconCircle(s, 'FaWrench', rx + 0.25, 1.65, 0.55, { bg: BREEZE });
    T(s, 'Bukti 2024: lonjakan gross requirements', rx + 0.95, 1.65, rw - 1.2, 0.55, { fs: 13, bold: true, valign: 'middle' });
    T(s, 'Grounding 737 MAX 9 (6–26 Januari 2024) memunculkan kebutuhan inspeksi 65 pesawat sekaligus: dalam istilah MRP, *gross requirements* melonjak pada satu periode sehingga kapasitas hangar dan teknisi harus dijadwalkan ulang, sementara 150 penerbangan per hari dibatalkan.', rx + 0.25, 2.3, rw - 0.5, 1.6, { fs: 11 });
    card(s, rx, 4.15, rw, 2.68, { fill: NAVY, flat: true });
    iconCircle(s, 'FaLightbulb', rx + 0.25, 4.35, 0.55, { bg: GREEN });
    T(s, 'Bukti 2026: Tailsight sebagai closed-loop MRP II', rx + 0.95, 4.35, rw - 1.2, 0.55, { fs: 13, bold: true, color: WHITE, valign: 'middle' });
    T(s, 'Pada 16 April 2026 Alaska mengumumkan investasi dan kemitraan multitahun dengan Tailsight, platform optimasi perencanaan perawatan yang menggabungkan data sistem perawatan, jadwal penerbangan, staf, *station capability rules*, dan ketersediaan suku cadang menjadi rencana yang memperhitungkan tenaga kerja, suku cadang, dan kesiapan pesawat. Tujuannya menaikkan utilisasi tenaga kerja dan suku cadang serta menekan waktu *aircraft-on-ground*: persis logika *closed-loop MRP II* dengan kapasitas berhingga.', rx + 0.25, 4.95, rw - 0.5, 1.85, { fs: 10.5, color: WHITE });
  }
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Analisis 3: sistem operasi terintegrasi Alaska dibaca dengan keunggulan dan kelemahan ERP. Keunggulan terbukti pada penyesuaian jadwal cepat dan integrasi Hawaiian (SOC 29 Oktober 2025). Kelemahan terbukti pada dua outage 2025 yang menghentikan seluruh operasi walau bukan serangan siber.');
    title(s, 'Analisis 3 — Integrasi Sistem ala ERP: Nilai dan Risikonya Terbukti');
    card(s, M, 1.45, 5.2, 5.37);
    T(s, 'Sistem terintegrasi Alaska Airlines', M + 0.3, 1.65, 4.6, 0.4, { fs: 15, bold: true });
    const nodes = [['Reservasi & check-in', 'FaTicketAlt'], ['Penjadwalan kru', 'FaUserClock'], ['Flight dispatch & cuaca', 'FaCloudSun'], ['Perawatan & suku cadang', 'FaTools'], ['Keuangan & SDM', 'FaMoneyCheckAlt']];
    const cx = M + 2.6, cy = 4.35;
    const pos = nodes.map((n, i) => { const a = -Math.PI / 2 + i * (2 * Math.PI / 5); return [cx + 1.75 * Math.cos(a), cy + 1.3 * Math.sin(a)]; });
    pos.forEach(p => line(s, cx, cy, p[0], p[1], { color: LIGHT2, w: 1.5 }));
    nodes.forEach((n, i) => {
      const [nx, ny] = pos[i];
      iconCircle(s, n[1], nx - 0.3, ny - 0.3, 0.6, { bg: i % 2 ? BREEZE : GREEN });
      T(s, n[0], nx - 0.8, ny + 0.33, 1.6, 0.34, { fs: 10.5, bold: true, align: 'center' });
    });
    s.addShape(pres.ShapeType.ellipse, { x: cx - 0.8, y: cy - 0.5, w: 1.6, h: 1.0, fill: { color: NAVY }, line: { color: NAVY, width: 0.25 }, shadow: shadow(), objectName: 'hub' });
    T(s, 'Pusat data & basis data operasi', cx - 0.75, cy - 0.45, 1.5, 0.9, { fs: 10.5, bold: true, color: WHITE, align: 'center', valign: 'middle' });
    T(s, 'Infrastruktur hibrida: pusat data sendiri untuk beban kritis, ditambah layanan cloud (GeekWire, 2025).', M + 0.3, 6.35, 4.6, 0.4, { fs: 9.5, color: MUTED, italic: true });
    const rx = M + 5.45, rw = CW - 5.45;
    card(s, rx, 1.45, rw, 2.55);
    iconCircle(s, 'FaCheckCircle', rx + 0.25, 1.65, 0.55, { bg: GREEN2, fg: WHITE });
    T(s, 'Keunggulan ERP yang terbukti', rx + 0.95, 1.65, rw - 1.2, 0.55, { fs: 14, bold: true, valign: 'middle' });
    bullets(s, ['Data bersama memungkinkan penjadwalan ulang cepat saat cuaca memburuk; Alaska menaksir penghematan US$18 juta per tahun (Heizer et al., 2017).', 'Integrasi Hawaiian: *single operating certificate* dicapai 29 Oktober 2025 setelah upaya multifase selama setahun di banyak departemen; sistem layanan penumpang tunggal menyusul pada 2026 (*commonality of databases*).'], rx + 0.25, 2.3, rw - 0.5, 1.65, { fs: 11, psa: 3 });
    card(s, rx, 4.2, rw, 2.62, { fill: NAVY, flat: true });
    iconCircle(s, 'FaExclamationCircle', rx + 0.25, 4.4, 0.55, { bg: CANYON, fg: WHITE });
    T(s, 'Kelemahan ERP yang terbukti', rx + 0.95, 4.4, rw - 1.2, 0.55, { fs: 14, bold: true, color: WHITE, valign: 'middle' });
    bullets(s, ['Juli 2025: satu perangkat keras multiredundan buatan pihak ketiga gagal dan melumpuhkan beberapa sistem operasional sekaligus; Oktober 2025: pusat data utama gagal selama ±8 jam. Keduanya bukan serangan siber, tetapi menghentikan seluruh operasi: *single point of failure*.', 'Setelah Juli, Alaska menyatakan telah "mengeraskan" sistemnya, namun kegagalan Oktober memaksa audit menyeluruh oleh pakar eksternal: ilustrasi "implementasi yang tidak pernah selesai" dan kompleksitas ERP.'], rx + 0.25, 5.05, rw - 0.5, 1.75, { fs: 10.5, color: WHITE, psa: 3 });
  }
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Analisis 4: penerapan teknik sequencing and scheduling pada empat arena di Alaska Airlines: kru, hangar, jadwal penerbangan dan irregular operations, serta operasi darat. Pola umumnya mengikuti kerangka loading, sequencing, scheduling, monitoring dari Bagian 1.');
    title(s, 'Analisis 4 — Scheduling Kru, Hangar, dan Operasi Darat');
    const arenas = [
      ['FaUserTie', 'Kru: 4.500+ pilot dan awak kabin', '*Preferential bidding system*, batas jam tugas FAA, dan kontrak serikat membuat penjadwalan kru menjadi *finite capacity scheduling* dengan kendala legalitas; pola kerja mengikuti *cyclical scheduling*. Di Kodiak, hanya kapten boleh mendarat: kendala *sequencing* tambahan.'],
      ['FaTools', 'Hangar dan line maintenance', 'Aturan prioritas hibrida: *critical ratio* untuk AOG dan batas *airworthiness*, SPT untuk antrean rutin agar *throughput* tinggi, dan *Johnson\'s rule* pada alur dua tahap inspeksi lalu perbaikan (ilustrasi: *makespan* turun dari 45 menjadi 35 jam).'],
      ['FaRoute', 'Jadwal penerbangan dan irregular operations', '*Flight timetable* berfungsi sebagai *master schedule*. Saat gangguan, keputusan batal–alihkan rute dijadwalkan secara *backward* dari *curfew* dan konektivitas; saat *ground stop* Juli 2025, pesawat dipertahankan "di posisi" agar jadwal pulih cepat.'],
      ['FaSnowflake', 'Operasi darat: gate, tiket, deicing', 'Kebutuhan staf harian yang bervariasi ditangani dengan *cyclical scheduling*; kapasitas *deicing* disiapkan delapan jam sebelum hujan beku tiba (10.00 untuk 18.00), contoh *forward scheduling* berbasis prakiraan.'],
    ];
    const cw = (CW - 0.25) / 2, ch = 2.3;
    arenas.forEach((a, i) => {
      const col = i % 2, row = Math.floor(i / 2), x = M + col * (cw + 0.25), y = 1.45 + row * (ch + 0.2);
      card(s, x, y, cw, ch);
      iconCircle(s, a[0], x + 0.25, y + 0.22, 0.6, { bg: (i === 0 || i === 3) ? BREEZE : GREEN });
      T(s, a[1], x + 1.0, y + 0.22, cw - 1.2, 0.6, { fs: 14, bold: true, valign: 'middle' });
      T(s, a[2], x + 0.25, y + 0.92, cw - 0.5, 1.3, { fs: 12 });
    });
    card(s, M, 6.15, CW, 0.68, { fill: NAVY, flat: true });
    T(s, '**Pola umum:** keputusan jangka pendek Alaska mengikuti urutan *loading → sequencing → scheduling → monitoring and control* (Bagian 1), bukan improvisasi; teknologinya hanya mempercepat siklus itu.', M + 0.3, 6.15, CW - 0.6, 0.68, { fs: 12, color: WHITE, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Sintesis: satu siklus kendali yang menghubungkan flight timetable (MPS), rencana perawatan dan kru, MRP suku cadang, ERP sebagai basis data bersama, short-term scheduling, dan monitoring and control, kembali ke penjadwalan ulang.');
    title(s, 'Sintesis: MRP, ERP, dan Scheduling dalam Satu Siklus Kendali');
    const nodes = [
      ['FaCalendarAlt', '1. Flight timetable', 'Master schedule: apa diterbangkan, kapan, dengan pesawat apa'],
      ['FaWrench', '2. Rencana perawatan & kru', 'Disagregasi ke tail number dan pairing kru'],
      ['FaBoxes', '3. MRP suku cadang', 'Kebutuhan dependen: apa, berapa, kapan dipesan'],
      ['FaDatabase', '4. ERP: basis data bersama', 'Satu kebenaran data untuk semua fungsi'],
      ['FaStopwatch', '5. Short-term scheduling', 'Kru, gate, bay hangar; aturan prioritas, FCS'],
      ['FaEye', '6. Monitoring & control', 'OCC, lampu andon, prakiraan cuaca; penjadwalan ulang'],
    ];
    const nw = (CW - 2 * 0.5) / 3, nh = 1.55;
    const place = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1]];
    nodes.forEach((n, i) => {
      const [col, row] = place[i], x = M + col * (nw + 0.5), y = 1.5 + row * (nh + 1.0);
      card(s, x, y, nw, nh, { fill: i === 3 ? NAVY : WHITE, flat: i === 3 });
      iconCircle(s, n[0], x + 0.22, y + 0.22, 0.55, { bg: i === 3 ? BREEZE : (i % 2 ? GREEN : BREEZE), fg: NAVY });
      T(s, n[1], x + 0.9, y + 0.22, nw - 1.1, 0.55, { fs: 13.5, bold: true, color: i === 3 ? WHITE : NAVY, valign: 'middle' });
      T(s, n[2], x + 0.22, y + 0.85, nw - 0.44, 0.65, { fs: 11, color: i === 3 ? WHITE : NAVY });
    });
    // arrows: 1->2, 2->3 (top row), 3->4 (down), 4->5, 5->6 (bottom row, leftwards), 6->1 (up)
    arrowRight(s, M + nw + 0.1, 1.5 + nh / 2 - 0.17, 0.3, 0.34);
    arrowRight(s, M + 2 * nw + 0.6, 1.5 + nh / 2 - 0.17, 0.3, 0.34);
    s.addShape(pres.ShapeType.downArrow, { x: M + 2 * (nw + 0.5) + nw / 2 - 0.17, y: 1.5 + nh + 0.12, w: 0.34, h: 0.76, fill: { color: ATLAS }, line: { color: ATLAS, width: 0.25 }, objectName: 'arrow' });
    s.addShape(pres.ShapeType.leftArrow, { x: M + 2 * nw + 0.6, y: 1.5 + nh + 1.0 + nh / 2 - 0.17, w: 0.3, h: 0.34, fill: { color: ATLAS }, line: { color: ATLAS, width: 0.25 }, objectName: 'arrow' });
    s.addShape(pres.ShapeType.leftArrow, { x: M + nw + 0.1, y: 1.5 + nh + 1.0 + nh / 2 - 0.17, w: 0.3, h: 0.34, fill: { color: ATLAS }, line: { color: ATLAS, width: 0.25 }, objectName: 'arrow' });
    s.addShape(pres.ShapeType.upArrow, { x: M + nw / 2 - 0.17, y: 1.5 + nh + 0.12, w: 0.34, h: 0.76, fill: { color: GREEN2 }, line: { color: GREEN2, width: 0.25 }, objectName: 'arrow' });
    T(s, 'umpan balik: penjadwalan ulang', M + nw / 2 + 0.25, 1.5 + nh + 0.3, 2.2, 0.4, { fs: 10, color: GREEN2, italic: true, bold: true });
    card(s, M + nw + 0.5, 1.5 + nh + 0.12, nw, 0.76, { fill: PALE, flat: true });
    T(s, '*Planning* menyediakan rencana yang layak; *control* menjaganya tetap berjalan.', M + nw + 0.6, 1.5 + nh + 0.12, nw - 0.2, 0.76, { fs: 11.5, align: 'center', valign: 'middle', bold: true });
    card(s, M, 5.85, CW, 0.98, { fill: NAVY, flat: true });
    T(s, '**Tiga keterkaitan kunci:** (1) MPS maskapai adalah *flight timetable*, sehingga MRP suku cadang dan jadwal kru sama-sama diturunkan darinya; (2) ERP menyatukan data agar penjadwalan ulang konsisten lintas fungsi; (3) *monitoring and control* menutup siklus dengan mengembalikan realisasi ke rencana.', M + 0.3, 5.85, CW - 0.6, 0.98, { fs: 12, color: WHITE, valign: 'middle' });
  }
  {
    const s = newSlide('Bagian 4 – Studi Kasus Alaska Airlines', 'Lima rekomendasi, masing-masing dengan dasar teori, tindakan, dan indikator: ketahanan infrastruktur, perencanaan perawatan closed-loop berkapasitas berhingga, aturan prioritas hibrida, proses dulu sistem kemudian untuk integrasi Hawaiian, serta jadwal siklis dan kapasitas cadangan musim dingin.');
    title(s, 'Evaluasi dan Rekomendasi Berbasis Teori');
    const recs = [
      ['FaShieldAlt', 'Ketahanan infrastruktur terintegrasi', 'Kelemahan ERP: kompleksitas dan *single point of failure*.', 'Redundansi aktif-aktif antarpusat data dan cloud, uji *failover* berkala, prosedur manual *degraded mode* untuk *dispatch* dan kru.', 'Waktu pemulihan; jumlah *ground stop* akibat IT.'],
      ['FaCogs', 'Perawatan closed-loop berkapasitas berhingga', 'MRP II dan *finite capacity scheduling*.', 'Operasionalkan Tailsight dengan *load report* hangar dan suku cadang; masukkan *lead time* OEM dan *station capability* sebagai kendala.', 'Jam AOG; *fill rate* suku cadang; utilisasi teknisi.'],
      ['FaSortAmountDown', 'Aturan prioritas hibrida di hangar', 'Tidak ada aturan prioritas yang unggul di semua kriteria.', '*Critical ratio* untuk AOG dan *airworthiness directive*; SPT untuk antrean rutin; *Johnson\'s rule* untuk alur dua tahap.', 'Rata-rata keterlambatan; *makespan* paket perawatan.'],
      ['FaHandshake', 'Proses dulu, sistem kemudian (integrasi Hawaiian)', 'Pelajaran implementasi ERP (Slack et al., 2022).', 'Standarkan proses kru, perawatan, dan layanan penumpang sebelum migrasi ke sistem tunggal; batasi kustomisasi.', 'Biaya kustomisasi; insiden *cut-over*.'],
      ['FaSnowflake', 'Jadwal siklis dan kapasitas cadangan musim dingin', '*Cyclical scheduling* dan *forward scheduling* berbasis prakiraan.', 'Pola libur siklis staf *gate* dan *deicing*; kru siaga (*reserve*) dipicu prakiraan hujan beku; *buffer* pesawat cadangan di SEA.', '*On-time departure* SEA pada hari cuaca buruk.'],
    ];
    const cw = (CW - 2 * 0.25) / 3, ch = 2.55;
    recs.forEach((r, i) => {
      const col = i % 3, row = Math.floor(i / 3), x = M + col * (cw + 0.25), y = 1.45 + row * (ch + 0.22);
      card(s, x, y, cw, ch);
      pill(s, String(i + 1), x + 0.22, y + 0.22, 0.42, 0.42, { fill: GREEN, fs: 13 });
      iconCircle(s, r[0], x + cw - 0.8, y + 0.18, 0.55, { bg: PALE });
      T(s, r[1], x + 0.75, y + 0.2, cw - 1.6, 0.5, { fs: 12.5, bold: true, valign: 'middle' });
      T(s, [{ text: 'Dasar teori: ', options: { bold: true, color: NAVY2 } }, ...runs(r[2])], x + 0.22, y + 0.82, cw - 0.44, 0.5, { fs: 10.5 });
      T(s, [{ text: 'Tindakan: ', options: { bold: true, color: NAVY2 } }, ...runs(r[3])], x + 0.22, y + 1.32, cw - 0.44, 0.85, { fs: 10.5 });
      T(s, [{ text: 'Indikator: ', options: { bold: true, color: NAVY2 } }, ...runs(r[4])], x + 0.22, y + 2.12, cw - 0.44, 0.4, { fs: 10.5 });
    });
    const x6 = M + 2 * (cw + 0.25), y6 = 1.45 + ch + 0.22;
    card(s, x6, y6, cw, ch, { fill: NAVY, flat: true });
    T(s, 'Evaluasi keseluruhan', x6 + 0.25, y6 + 0.25, cw - 0.5, 0.4, { fs: 14, bold: true, color: BREEZE });
    T(s, 'Alaska Airlines kuat pada *control* jangka pendek (penjadwalan ulang, pengendalian visual, teknologi) dan sedang memperkuat *planning* perawatan berbasis kapasitas. Titik lemah yang terbukti adalah ketahanan infrastruktur terintegrasi: nilai ERP hanya terwujud bila sistemnya tetap hidup.', x6 + 0.25, y6 + 0.7, cw - 0.5, 1.75, { fs: 11.5, color: WHITE });
  }

  // ======================= PENUTUP =======================
  pres.addSection({ title: 'Penutup' });
  {
    const s = newSlide('Penutup', 'Kesimpulan: tiga poin yang menjawab subtopik sesi. MRP dan ERP menjawab apa, berapa, kapan; sequencing and scheduling mengeksekusi; keunggulan kompetitif lahir dari control di atas planning yang baik, dengan catatan risiko integrasi.');
    title(s, 'Kesimpulan');
    const con = [
      ['MRP dan ERP menjawab apa, berapa, dan kapan', 'Pada Alaska Airlines, kebutuhan suku cadang dan kru diturunkan dari *flight timetable* sebagai *master schedule* melalui logika *dependent demand*; ERP menyatukan datanya sehingga rencana lintas fungsi konsisten.'],
      ['Sequencing and scheduling mengeksekusi rencana dalam hitungan jam', 'Aturan prioritas, *Johnson\'s rule*, *finite capacity scheduling*, dan *cyclical scheduling* menjelaskan bagaimana Alaska mempertahankan ketepatan waktu 79% (Cirium 2024) di tengah cuaca Seattle dan geografi Alaska.'],
      ['Keunggulan kompetitif lahir dari control, bukan planning semata', 'Kemampuan penyesuaian menit terakhir bernilai US$18 juta per tahun; namun integrasi sistem menuntut ketahanan, dan dua *outage* 2025 adalah peringatan bahwa kelemahan ERP bersifat nyata.'],
    ];
    con.forEach((c, i) => {
      const y = 1.45 + i * 1.8;
      card(s, M, y, 9.0, 1.62);
      pill(s, String(i + 1), M + 0.25, y + 0.3, 0.5, 0.5, { fill: i === 1 ? GREEN : BREEZE, fs: 15 });
      T(s, c[0], M + 1.0, y + 0.2, 7.75, 0.45, { fs: 15, bold: true, valign: 'middle' });
      T(s, c[1], M + 1.0, y + 0.68, 7.75, 0.9, { fs: 12 });
    });
    card(s, M + 9.25, 1.45, CW - 9.25, 5.37, { fill: WHITE });
    img(s, 'sticker_mechanic.png', M + 9.45, 1.75, CW - 9.65, CW - 9.65, { fit: 'contain', name: 'ilustrasi teknisi' });
    T(s, 'Planning menyediakan rencana yang layak; control menjaganya tetap berjalan.', M + 9.45, 4.85, CW - 9.65, 1.7, { fs: 13, bold: true, align: 'center', valign: 'middle', color: NAVY2, italic: true });
  }
  {
    const s = newSlide('Penutup', 'Daftar referensi.');
    title(s, 'Referensi');
    const refs = [
      'Slack, N., Brandon-Jones, A., & Burgess, N. (2022). *Operations management* (10th ed.). Pearson Education. (Bab 10 Planning and control; Bab 14 Planning and control systems/ERP; Suplemen MRP.)',
      'Heizer, J., Render, B., & Munson, C. (2017). *Operations management: Sustainability and supply chain management* (12th ed.). Pearson Education. (Bab 14 MRP and ERP; Bab 15 Short-term scheduling, Global Company Profile Alaska Airlines, hlm. 600–602.)',
      'Turban, E., Pollard, C., & Wood, G. (2025). *Information technology for management* (13th ed.). John Wiley & Sons.',
      'Alaska Airlines. (2026, 16 April). *Alaska Airlines and Tailsight launch AI-powered maintenance planning solution*. news.alaskaair.com.',
      'Alaska Airlines. (2025, 29 Oktober). *Alaska Airlines and Hawaiian Airlines reach major integration milestone: A single operating certificate*. news.alaskaair.com.',
      'Alaska Air Group. (t.t.). *Alaska Air Group fact sheet*. news.alaskaair.com.',
      'Cirium. (2025, Januari). *2024 On-Time Performance Review* (dikutip dalam Fox Business, "Delta, United, Alaska tops in North America for on-time performance").',
      'GeekWire. (2025, Oktober). *After latest outage disrupts 49,000 passengers, Alaska Airlines vows to diagnose "our entire IT infrastructure."*',
      'CBS News. (2025, 20 Juli). *Alaska Airlines requests system-wide ground stop due to IT outage*.',
      'Aviacionline. (2025). *Alaska Airlines ends 2024 with $395 million in profit following the integration of Hawaiian Airlines*.',
      'CNBC. (2024, 25 Januari). *Alaska Airlines says Boeing 737 Max 9 grounding will cost it $150 million*.',
      'Anchorage Daily News. (2024, 6 Januari). *Alaska Airlines cancels more than 90 flights after grounding Boeing Max 9s*.',
      'Alaska Airlines. (t.t.). *Auro Design System: design tokens* (palet warna identitas merek). auro.alaskaair.com.',
    ];
    const half = 7;
    card(s, M, 1.45, CW, 5.37);
    bullets(s, refs.slice(0, half), M + 0.3, 1.7, (CW - 0.9) / 2, 5.0, { fs: 11.5, psa: 8 });
    bullets(s, refs.slice(half), M + 0.6 + (CW - 0.9) / 2, 1.7, (CW - 0.9) / 2, 5.0, { fs: 11.5, psa: 8 });
  }
  {
    const s = pres.addSlide({ masterName: 'DARK', sectionTitle: 'Penutup' });
    s.addNotes('Penutup dan dua pertanyaan diskusi untuk kelas.');
    T(s, 'Terima kasih', 0.7, 1.1, 6.5, 1.0, { fs: 40, bold: true, color: WHITE });
    T(s, 'Planning and Control  ·  MRP dan ERP  ·  Sequencing and Scheduling  ·  Studi Kasus Alaska Airlines', 0.7, 2.1, 7.0, 0.5, { fs: 14, color: BREEZE, bold: true });
    card(s, 0.7, 3.0, 7.6, 3.6, { fill: NAVY2, flat: true });
    iconCircle(s, 'FaQuestionCircle', 1.0, 3.3, 0.6, { bg: BREEZE });
    T(s, 'Pertanyaan untuk diskusi', 1.8, 3.3, 6.0, 0.6, { fs: 17, bold: true, color: WHITE, valign: 'middle' });
    bullets(s, ['Sebagai manajer operasi Alaska, aturan prioritas mana yang Anda pilih untuk antrean hangar ketika 65 pesawat harus diinspeksi serentak, dan kriteria apa yang Anda korbankan?', 'Sejauh mana manfaat integrasi data ala ERP masih sepadan dengan risiko kegagalan tunggal yang ditunjukkan oleh dua *outage* pada 2025? Apa batas integrasi yang wajar?'], 1.0, 4.05, 7.0, 2.4, { fs: 13, color: WHITE, numbered: true, psa: 8 });
    card(s, 8.9, 1.5, 4.0, 4.0, { r: 0.3 });
    img(s, 'sticker_pilot.png', 9.15, 1.75, 3.5, 3.5, { fit: 'contain', name: 'ilustrasi pilot' });
    T(s, 'Dosen Pengampu: Prof. Nur Aini Masruroh, S.T., M.Sc., Ph.D.', 0.7, 6.85, 8, 0.4, { fs: 11, color: SOFT });
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('written', OUT);
})().catch(e => { console.error(e); process.exit(1); });
