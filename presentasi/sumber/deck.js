// Deck v3 — Studi kasus Alaska Airlines, desain mengikuti referensi "Klyro" (oranye, limau, hitam, foto bersudut bulat, judul kondensasi kapital)
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');
const path = require('path');
const { spawnSync } = require('child_process');
const { applyTheme } = require(process.env.SKILL_DIR + '/scripts/apply_theme.js');

const OUT = process.argv[2] || 'deck3.pptx';
const IMG = path.join(__dirname, 'img4');

// Palet (disampel dari referensi Klyro)
const ORANGE = 'F1681D', LIME = '9CC506', LIME_D = '86A90A', BLACK = '1A1C14', OFF = 'F4F4F2', WHITE = 'FFFFFF', GREY = '6B6B66';
const HEAD = 'Barlow Condensed ExtraBold', HEAD2 = 'Barlow Condensed', BODY = 'Barlow';
const THEME = { name: 'Alaska Klyro', headFontFace: HEAD, bodyFontFace: BODY, colors: { dk1: BLACK, lt1: WHITE, dk2: GREY, lt2: OFF, accent1: ORANGE, accent2: LIME, accent3: LIME_D, accent4: BLACK, accent5: 'F39D6A', accent6: 'C9E36A', hlink: ORANGE, folHlink: LIME_D } };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };
pres.title = 'Planning and Control di Alaska Airlines — MRP dan ERP, Sequencing and Scheduling';
const W = 13.333, H = 7.5, M = 0.6, CW = W - 2 * M;

pres.defineSlideMaster({ title: 'NUM', background: { color: OFF }, objects: [], slideNumber: { x: 12.2, y: 7.0, w: 0.53, h: 0.32, fontSize: 12, fontFace: BODY, color: BLACK, align: 'right' } });
pres.defineSlideMaster({ title: 'PLAIN', background: { color: OFF }, objects: [] });

// ---------- text measurement (PIL) ----------
const measCache = {};
function measure(font, size, text) {
  const k = font + '|' + size + '|' + text; if (measCache[k] !== undefined) return measCache[k];
  const r = spawnSync('python3', ['-I', path.join(__dirname, 'measure.py')], { input: JSON.stringify([[font, size, text]]) });
  return (measCache[k] = JSON.parse(r.stdout.toString())[0]);
}

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
function P(s, text, x, y, w, h, o = {}) {
  s.addText(typeof text === 'string' ? runs(text) : text, { x, y, w, h, fontFace: o.font || BODY, fontSize: o.fs || 16, color: o.color || BLACK, bold: !!o.bold, italic: !!o.italic, align: o.align || 'left', valign: o.valign || 'top', margin: o.margin ?? 0, isTextBox: true, paraSpaceAfter: o.psa, charSpacing: o.cs, objectName: o.name || 'text' });
}
function HT(s, text, x, y, w, h, o = {}) { // condensed heading text
  s.addText(text, { x, y, w, h, fontFace: o.font || HEAD, fontSize: o.fs || 28, color: o.color || BLACK, bold: !!o.bold, align: o.align || 'left', valign: o.valign || 'top', margin: 0, isTextBox: true, charSpacing: o.cs, lineSpacingMultiple: o.lsm || 0.9, objectName: o.name || 'heading' });
}
function bullets(s, items, x, y, w, h, o = {}) {
  const arr = [];
  items.forEach((it, i) => {
    const r = runs(it);
    r.forEach((run, j) => { if (j === 0) { run.options.bullet = o.numbered ? { type: 'number' } : true; run.options.paraSpaceAfter = o.psa ?? 8; } if (j === r.length - 1 && i < items.length - 1) run.options.breakLine = true; });
    arr.push(...r);
  });
  s.addText(arr, { x, y, w, h, fontFace: BODY, fontSize: o.fs || 16, color: o.color || BLACK, margin: 0, isTextBox: true, valign: 'top', objectName: o.name || 'bullets' });
}
function card(s, x, y, w, h, o = {}) {
  const fill = o.fill || WHITE;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: o.line ? 1.5 : 0.25 }, rectRadius: o.r ?? 0.22, objectName: o.name || 'card' });
}
function tag(s, text, x, y, w, h, o = {}) {
  const fill = o.fill || BLACK;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0.25 }, rectRadius: h / 2, objectName: 'tag' });
  s.addText(text, { x, y, w, h, fontFace: HEAD2, bold: true, fontSize: o.fs || 14, color: o.color || WHITE, align: 'center', valign: 'middle', margin: 0, isTextBox: true, charSpacing: 1, objectName: 'tag label' });
}
// Judul besar dengan kata yang disorot kotak warna (motif referensi). lines: [[{t, hl?}], ...]
function headline(s, lines, x, y, size, o = {}) {
  const lh = size / 72 * 1.02; let cy = y;
  lines.forEach(parts => {
    let cx = x;
    parts.forEach((p, i) => {
      const tw = measure('head', size, p.t), pad = size / 72 * 0.18;
      if (p.hl) {
        if (i > 0) cx += pad;
        s.addShape(pres.ShapeType.roundRect, { x: cx - pad, y: cy + lh * 0.04, w: tw + 2 * pad, h: lh * 0.92, fill: { color: p.hl }, line: { color: p.hl, width: 0.25 }, rectRadius: 0.08, objectName: 'highlight' });
      }
      s.addText(p.t, { x: cx, y: cy, w: tw + 0.3, h: lh, fontFace: HEAD, fontSize: size, color: p.color || o.color || BLACK, align: 'left', valign: 'middle', margin: 0, isTextBox: true, objectName: 'headline' });
      cx += tw + measure('head', size, ' ') + (p.hl ? pad : 0);
    });
    cy += lh + (o.gap ?? 0.04);
  });
  return cy;
}
const ICONS = {};
async function iconData(name, color) {
  const key = name + color; if (ICONS[key]) return ICONS[key];
  const Icon = fa[name]; if (!Icon) throw new Error('icon missing ' + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Icon, { color: '#' + color, size: 256 }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return (ICONS[key] = 'image/png;base64,' + buf.toString('base64'));
}
function icon(s, name, x, y, d, color) { s.addImage({ data: ICONS[name + color], x, y, w: d, h: d, objectName: 'icon ' + name }); }
function burst(s, x, y, d, o = {}) { // ornamen asterisk dalam lingkaran (motif referensi)
  const bg = o.bg || ORANGE, fg = o.fg || WHITE;
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg, width: 0.25 }, objectName: 'burst' });
  icon(s, 'FaAsterisk', x + d * 0.22, y + d * 0.22, d * 0.56, fg);
}
function photo(s, file, x, y, w, h, name) { s.addImage({ path: path.join(IMG, file), x, y, w, h, objectName: name || file }); }
function line(s, x1, y1, x2, y2, o = {}) { s.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: o.color || BLACK, width: o.w || 1.5 }, flipH: (x2 < x1) !== (y2 < y1), objectName: 'line' }); }
function arrow(s, x, y, w, h, color = BLACK) { s.addShape(pres.ShapeType.rightArrow, { x, y, w, h, fill: { color }, line: { color, width: 0.25 }, objectName: 'arrow' }); }
function tableRows(header, rows, o = {}) {
  const hd = header.map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: BLACK }, align: 'center', valign: 'middle', fontSize: o.fs || 14, fontFace: BODY } }));
  const body = rows.map((r, i) => r.map((c, j) => {
    const cell = typeof c === 'object' ? c : { text: String(c) };
    return { text: cell.text, options: { fontSize: o.fs || 14, fontFace: BODY, color: BLACK, fill: { color: cell.fill || (i % 2 ? OFF : WHITE) }, align: cell.align || (j === 0 ? 'left' : 'center'), valign: 'middle', bold: !!cell.bold } };
  }));
  return [hd, ...body];
}
function addTable(s, rows, x, y, w, colW, o = {}) { s.addTable(rows, { x, y, w, colW, rowH: o.rowH, border: { type: 'solid', color: 'DADAD5', pt: 0.75 }, margin: 0.06, fontFace: BODY, objectName: o.name || 'table', autoPage: false }); }
function slide(section, bgColor, notes, plain) { const s = pres.addSlide({ masterName: plain ? 'PLAIN' : 'NUM', sectionTitle: section }); if (bgColor) s.background = { color: bgColor }; if (notes) s.addNotes(notes); return s; }
function source(s, text, color) { P(s, text, M, 6.96, 11.0, 0.38, { fs: 13, color: color || GREY, italic: true }); }

const PRESENTERS = [['Aslih Abnuri', '25/574338/PEK/31801'], ['Happy Dinithasari', '25/574400/PEK/31831'], ['Juan Bagas Prayogo', '25/573847/PEK/31678'], ['Riska Novalita', '25/574037/PEK/31724']];
const REFS = 'Referensi: Heizer, J., Render, B., & Munson, C. (2017). Operations Management (12th ed.), Bab 14–15, Global Company Profile Alaska Airlines hlm. 600–602. Pearson. | Slack, N., Brandon-Jones, A., & Burgess, N. (2022). Operations Management (10th ed.), Bab 10 & 14. Pearson. | Alaska Airlines (2026, 16 April). Alaska Airlines and Tailsight launch AI-powered maintenance planning solution. | Alaska Airlines (2025, 29 Oktober). Alaska Airlines and Hawaiian Airlines reach major integration milestone: a single operating certificate. | Alaska Air Group fact sheet. | Cirium (2025). 2024 On-Time Performance Review (via Fox Business). | GeekWire (Okt 2025); CBS News (Jul 2025) tentang outage. | CNBC (25 Jan 2024); Anchorage Daily News (6 Jan 2024) tentang grounding 737 MAX 9. | Aviacionline (2025) armada akhir 2024. | Halldale (2024) Fox TMS.';

(async () => {
  for (const n of ['FaAsterisk', 'FaDatabase', 'FaTicketAlt', 'FaUserClock', 'FaCloudSun', 'FaTools', 'FaMoneyCheckAlt']) { await iconData(n, WHITE); await iconData(n, BLACK); }
  ['Pembuka', 'Profil', 'MRP dan ERP', 'Sequencing and Scheduling', 'Penutup'].forEach(t => pres.addSection({ title: t }));

  // 1. COVER
  {
    const s = slide('Pembuka', OFF, 'Slide judul dengan presenter dan NIM. Studi kasus 5 Alaska Airlines, Sesi 7 Planning and Control: subtopik MRP dan ERP serta Sequencing and Scheduling.');
    tag(s, 'STUDI KASUS 5  ·  OPERATIONS & TECHNOLOGY MANAGEMENT  ·  SESI 7', M, 0.6, 6.6, 0.42, { fs: 14 });
    headline(s, [[{ t: 'PLANNING AND' }], [{ t: 'CONTROL DI' }], [{ t: 'ALASKA AIRLINES', hl: LIME }]], M, 1.2, 60);
    P(s, 'MRP dan ERP  ·  Sequencing and Scheduling', M, 4.0, 7.3, 0.45, { fs: 22, bold: true });
    burst(s, M + 7.0, 4.02, 0.4);
    card(s, M, 4.65, 7.5, 2.1, { fill: BLACK });
    HT(s, 'PRESENTER', M + 0.3, 4.8, 3, 0.4, { fs: 20, color: LIME });
    PRESENTERS.forEach((p, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      P(s, p[0], M + 0.3 + col * 3.65, 5.25 + row * 0.7, 3.5, 0.32, { fs: 16, bold: true, color: WHITE });
      P(s, 'NIM ' + p[1], M + 0.3 + col * 3.65, 5.57 + row * 0.7, 3.5, 0.3, { fs: 14, color: 'C9E36A' });
    });
    P(s, 'Dosen Pengampu: Prof. Nur Aini Masruroh, S.T., M.Sc., Ph.D.', M, 6.9, 7.5, 0.35, { fs: 14, color: BLACK });
    photo(s, 'cover.png', 8.45, 0.55, 4.28, 5.71, 'foto pesawat di gate malam hari');
    P(s, 'Operasi darat Alaska Airlines di Seattle–Tacoma', 8.45, 6.4, 4.28, 0.35, { fs: 13, color: GREY, italic: true, align: 'center' });
  }
  // 2. ALUR PEMBAHASAN (limau)
  {
    const s = slide('Pembuka', LIME, 'Alur pembahasan empat langkah, mengikuti dua subtopik sesi.');
    headline(s, [[{ t: 'ALUR' }, { t: 'PEMBAHASAN', hl: WHITE }]], M, 0.55, 48);
    P(s, 'Langsung pada kasus, mengikuti dua subtopik sesi. Setiap langkah memakai temuan langkah sebelumnya.', M, 1.45, 9.5, 0.5, { fs: 18 });
    const steps = [['01', 'PROFIL &\nPERMASALAHAN', 'Skala operasi Alaska Airlines dan empat sumber gangguan terhadap rencana.'], ['02', 'MRP DAN ERP', 'Dari jadwal penerbangan ke suku cadang, lalu ke satu basis data operasi.'], ['03', 'SEQUENCING &\nSCHEDULING', 'Mengurutkan pesawat, kru, hangar, dan staf darat, termasuk saat badai.'], ['04', 'EVALUASI &\nREKOMENDASI', 'Apa yang kuat, apa yang lemah, dan apa yang perlu dibenahi.']];
    const gap = 0.25, cw = (CW - 3 * gap) / 4, y = 2.2, h = 3.9;
    steps.forEach((st, i) => {
      const x = M + i * (cw + gap);
      card(s, x, y, cw, h);
      s.addShape(pres.ShapeType.ellipse, { x: x + cw - 0.55, y: y + 0.25, w: 0.3, h: 0.3, fill: { color: ORANGE }, line: { color: ORANGE, width: 0.25 }, objectName: 'dot' });
      HT(s, st[0], x + 0.3, y + 0.2, 1.5, 0.75, { fs: 44, color: ORANGE });
      HT(s, st[1], x + 0.3, y + 1.05, cw - 0.6, 0.95, { fs: 26 });
      P(s, st[2], x + 0.3, y + 2.1, cw - 0.6, 1.7, { fs: 16 });
    });
    P(s, 'Bacaan pendukung: Heizer, Render & Munson (2017) Bab 14–15  ·  Slack, Brandon-Jones & Burgess (2022) Bab 10 & 14', M, 6.45, CW, 0.4, { fs: 14 });
  }
  // 3. TENTANG
  {
    const s = slide('Profil', OFF, 'Profil Alaska Airlines: Alaska Air Group fact sheet; Heizer et al. (2017); rilis SOC 29 Oktober 2025.');
    headline(s, [[{ t: 'TENTANG' }, { t: 'ALASKA AIRLINES', hl: ORANGE, color: WHITE }]], M, 0.55, 48);
    card(s, M, 1.55, 7.1, 5.25);
    P(s, 'Maskapai berbasis Seattle–Tacoma (SEA) di bawah Alaska Air Group bersama Horizon Air dan, sejak 2024, Hawaiian Airlines: lebih dari 140 destinasi, 30.000 karyawan, dan 392 pesawat pada akhir 2024.', M + 0.35, 1.8, 6.4, 1.3, { fs: 16 });
    P(s, 'SEA adalah bandara tersibuk ke-15 di AS dengan hujan sekitar 5 inci per bulan saat musim dingin, namun memiliki *on-time departures* tertinggi di AS (85,8%). Alaska mengoperasikan lebih dari separuh penerbangan domestik di sana (Heizer et al., 2017).', M + 0.35, 3.15, 6.4, 1.7, { fs: 16 });
    P(s, '29 Oktober 2025: FAA memberikan *single operating certificate* bagi Alaska dan Hawaiian. Dua merek, satu sistem operasi.', M + 0.35, 4.9, 6.4, 1.0, { fs: 16 });
    tag(s, 'HUB: SEATTLE–TACOMA', M + 0.35, 6.1, 2.6, 0.4, { fill: LIME, color: BLACK, fs: 13 });
    tag(s, 'ALASKA · HORIZON · HAWAIIAN', M + 3.1, 6.1, 3.5, 0.4, { fill: LIME, color: BLACK, fs: 13 });
    photo(s, 'apron.png', 7.95, 1.55, 4.78, 3.58, 'foto apron bandara saat matahari terbit');
    card(s, 7.95, 5.3, 4.78, 1.5, { fill: BLACK });
    P(s, '"Alaska menemukan keunggulan kompetitif pada kemampuannya melakukan penyesuaian menit terakhir." — Heizer et al. (2017)', 8.2, 5.3, 4.3, 1.5, { fs: 15, color: WHITE, italic: true, valign: 'middle' });
  }
  // 4. SKALA (oranye)
  {
    const s = slide('Profil', ORANGE, 'Skala operasi dan ketepatan waktu (Cirium 2024). Sumber angka: Alaska Air Group fact sheet; Aviacionline (2025); Heizer et al. (2017).');
    headline(s, [[{ t: 'SKALA OPERASI DAN' }, { t: 'KETEPATAN WAKTU', hl: BLACK, color: WHITE }]], M, 0.55, 48, { color: WHITE });
    const stats = [['392', 'PESAWAT (AKHIR 2024)'], ['4.500+', 'PILOT & AWAK KABIN DIJADWALKAN/HARI'], ['140+', 'DESTINASI'], ['30.000+', 'KARYAWAN GRUP'], ['>50%', 'PENERBANGAN DOMESTIK SEA'], ['US$18 JUTA', 'HEMAT PER TAHUN DARI PENJADWALAN ULANG']];
    const sw = (6.7 - 0.2) / 2, sh = (5.25 - 2 * 0.2) / 3;
    stats.forEach((st, i) => {
      const x = M + (i % 2) * (sw + 0.2), y = 1.55 + Math.floor(i / 2) * (sh + 0.2);
      card(s, x, y, sw, sh, { fill: i % 2 ? LIME : WHITE });
      HT(s, st[0], x + 0.25, y + 0.15, sw - 0.5, 0.8, { fs: 40 });
      HT(s, st[1], x + 0.25, y + 0.95, sw - 0.5, 0.6, { fs: 17, font: HEAD2, bold: true, cs: 1 });
    });
    card(s, M + 6.95, 1.55, CW - 6.95, 5.25);
    s.addChart(pres.ChartType.bar, [{ name: 'Ketepatan waktu kedatangan 2024 (%)', labels: ['Delta', 'United', 'Alaska', 'American', 'Southwest'], values: [83.46, 80.93, 79.25, 77.78, 77.77] }], {
      x: M + 7.1, y: 1.65, w: CW - 7.25, h: 4.5, barDir: 'bar', catAxisOrientation: 'maxMin', chartColors: ['DADAD5', 'DADAD5', ORANGE, 'DADAD5', 'DADAD5'], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.00', dataLabelFontSize: 14, dataLabelColor: BLACK, dataLabelFontFace: '+mn-lt',
      catAxisLabelFontSize: 15, catAxisLabelColor: BLACK, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false,
      showTitle: true, title: 'Ketepatan waktu kedatangan 2024 (%), lima besar Amerika Utara', titleFontSize: 15, titleColor: BLACK, titleFontFace: '+mn-lt', valAxisMinVal: 70, valAxisMaxVal: 90, barGapWidthPct: 40, objectName: 'chart ketepatan waktu',
    });
    P(s, 'Sumber: Cirium 2024 On-Time Performance Review (Jan 2025). Alaska peringkat ke-3.', M + 7.1, 6.2, CW - 7.25, 0.5, { fs: 13, color: GREY, italic: true, align: 'center' });
    source(s, 'Sumber angka: Alaska Air Group fact sheet; Aviacionline (2025); Heizer et al. (2017).', 'FBE3D3');
  }
  // 5. EMPAT SUMBER GANGGUAN
  {
    const s = slide('Profil', OFF, 'Empat sumber gangguan rencana: cuaca, geografi, kegagalan sistem 2025, grounding MAX 9 2024.');
    headline(s, [[{ t: 'EMPAT' }, { t: 'SUMBER GANGGUAN', hl: LIME }, { t: 'TERHADAP RENCANA' }]], M, 0.55, 44);
    const probs = [
      ['01', 'CUACA SEATTLE', 'Satu badai Desember memaksa rencana pembatalan 50–80% penerbangan; keputusan direvisi setiap beberapa jam (Heizer et al., 2017).', 'SCHEDULING'],
      ['02', 'GEOGRAFI ALASKA', 'Juneau (*wind shear*), Sitka (landasan tunggal di tanah sempit), Kodiak (hanya kapten boleh mendarat): pesawat dan kru tidak bebas ditugaskan.', 'SCHEDULING KRU'],
      ['03', 'KEGAGALAN SISTEM 2025', '20 Juli: perangkat keras pusat data gagal, *ground stop* ±3 jam, >150 pembatalan. 23 Oktober: pusat data utama gagal, ±8 jam, >400 pembatalan, ±49.000 penumpang.', 'ERP'],
      ['04', 'GROUNDING 737 MAX 9', 'Januari 2024: 65 pesawat diinspeksi serentak, sekitar 3.000 pembatalan dalam sebulan, dampak sekitar US$150 juta.', 'MRP PERAWATAN'],
    ];
    const cw = (CW - 0.25) / 2, ch = 2.55;
    probs.forEach((p, i) => {
      const x = M + (i % 2) * (cw + 0.25), y = 1.5 + Math.floor(i / 2) * (ch + 0.2);
      card(s, x, y, cw, ch, { fill: i === 1 || i === 2 ? WHITE : WHITE });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: i % 2 ? LIME : ORANGE }, line: { color: i % 2 ? LIME : ORANGE, width: 0.25 }, objectName: 'number circle' });
      HT(s, p[0], x + 0.3, y + 0.3, 0.7, 0.7, { fs: 26, align: 'center', valign: 'middle', color: i % 2 ? BLACK : WHITE });
      HT(s, p[1], x + 1.2, y + 0.3, cw - 1.5, 0.7, { fs: 28, valign: 'middle' });
      P(s, p[2], x + 0.3, y + 1.15, cw - 0.6, 1.05, { fs: 15 });
      tag(s, 'DIMENSI: ' + p[3], x + 0.3, y + ch - 0.5, 2.6, 0.34, { fill: OFF, color: BLACK, fs: 12 });
    });
  }
  // 6. DIVIDER 1
  {
    const s = slide('MRP dan ERP', BLACK, 'Pembuka subtopik 1.');
    photo(s, 'div_hangar.jpg', 0, 0, W, H, 'foto hangar perawatan malam hari');
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: BLACK, transparency: 42 }, line: { color: BLACK, width: 0, transparency: 100 }, objectName: 'overlay' });
    tag(s, 'SUBTOPIK 1', M, 2.1, 1.9, 0.45, { fill: LIME, color: BLACK, fs: 15 });
    headline(s, [[{ t: 'MRP DAN ERP' }], [{ t: 'DI ALASKA AIRLINES', hl: ORANGE, color: WHITE }]], M, 2.75, 60, { color: WHITE });
    P(s, 'Dari jadwal penerbangan menjadi kebutuhan perawatan dan suku cadang, lalu menjadi satu basis data operasi.', M, 5.15, 8.5, 0.9, { fs: 20, color: WHITE });
  }
  // 7. JADWAL -> SUKU CADANG (limau)
  {
    const s = slide('MRP dan ERP', LIME, 'Rantai turunan: flight timetable → rencana perawatan → work package → kebutuhan bersih.');
    headline(s, [[{ t: 'DARI JADWAL PENERBANGAN KE' }, { t: 'SUKU CADANG', hl: BLACK, color: WHITE }]], M, 0.55, 44);
    P(s, 'Permintaan suku cadang dihitung dari jadwal, bukan diramalkan (*dependent demand*). Rantainya berjalan dalam empat langkah.', M, 1.45, 11, 0.5, { fs: 18 });
    const steps = [['01', 'FLIGHT\nTIMETABLE', 'Jadwal terpublikasi berfungsi sebagai *master schedule*: pesawat, rute, jam, dan siklus.'], ['02', 'RENCANA\nPERAWATAN', 'Jam terbang dan siklus per *tail number* menentukan kapan setiap *check* jatuh tempo.'], ['03', 'WORK\nPACKAGE', 'Setiap *check* diurai menjadi *task card*: daftar komponen dan jam kerja.'], ['04', 'KEBUTUHAN\nBERSIH', 'Dikurangi stok dan pesanan berjalan, lalu digeser mundur sebesar *lead time*.']];
    const gap = 0.25, cw = (CW - 3 * gap) / 4, y = 2.15, h = 3.5;
    steps.forEach((st, i) => {
      const x = M + i * (cw + gap);
      card(s, x, y, cw, h);
      HT(s, st[0], x + 0.3, y + 0.2, 1.5, 0.75, { fs: 44, color: ORANGE });
      HT(s, st[1], x + 0.3, y + 1.0, cw - 0.6, 0.95, { fs: 26 });
      P(s, st[2], x + 0.3, y + 2.0, cw - 0.6, 1.4, { fs: 15 });
      if (i < 3) arrow(s, x + cw + 0.03, y + 1.3, 0.19, 0.34);
    });
    card(s, M, 5.9, CW, 0.95, { fill: BLACK });
    P(s, 'Perubahan jadwal penerbangan merambat ke jatuh tempo perawatan, dan jatuh tempo yang bergeser mengubah kapan suku cadang harus dipesan.', M + 0.35, 5.9, CW - 0.7, 0.95, { fs: 16, color: WHITE, valign: 'middle' });
  }
  // 8. CONTOH PERHITUNGAN
  {
    const s = slide('MRP dan ERP', OFF, 'Contoh net requirements plan brake assembly untuk heavy check (lot-for-lot, lead time 2 minggu).');
    headline(s, [[{ t: 'CONTOH:' }, { t: 'BRAKE ASSEMBLY', hl: ORANGE, color: WHITE }, { t: 'UNTUK HEAVY CHECK' }]], M, 0.55, 44);
    P(s, '4 unit per paket *heavy check*; *lead time* pemasok 2 minggu; stok awal 6 unit; 4 unit tiba pada minggu 2; kebijakan *lot-for-lot*. Rencana perawatan: 2 paket (minggu 5), 1 paket (minggu 7), 2 paket (minggu 8).', M, 1.45, CW, 0.85, { fs: 16 });
    const data = [['Gross requirements', [0, 0, 0, 0, 8, 0, 4, 8]], ['Scheduled receipts', [0, 4, 0, 0, 0, 0, 0, 0]], ['Projected on hand (awal 6)', [6, 10, 10, 10, 2, 2, 0, 0]], ['Net requirements', [0, 0, 0, 0, 0, 0, 2, 8]], ['Planned order receipts', [0, 0, 0, 0, 0, 0, 2, 8]], ['Planned order releases', [0, 0, 0, 0, 2, 8, 0, 0]]];
    const rows = tableRows(['Minggu', '1', '2', '3', '4', '5', '6', '7', '8'], data.map((d, ri) => [{ text: d[0], bold: true }, ...d[1].map(v => ({ text: v === 0 ? '–' : String(v), bold: v !== 0 && ri === 5, fill: v !== 0 && ri === 5 ? LIME : undefined }))]), { fs: 15 });
    addTable(s, rows, M, 2.45, CW, [3.3, ...Array(8).fill((CW - 3.3) / 8)], { rowH: 0.42 });
    card(s, M, 5.65, CW, 1.2, { fill: ORANGE });
    P(s, '**Pembacaan:** pesanan 2 unit dirilis minggu 5 dan 8 unit minggu 6 agar tiba tepat pada minggu 7 dan 8. Terlambat berarti pesawat menganggur (*aircraft-on-ground*); terlalu awal berarti stok menumpuk. Pada 392 pesawat, logika ini berjalan untuk ribuan komponen.', M + 0.35, 5.65, CW - 0.7, 1.2, { fs: 16, color: WHITE, valign: 'middle' });
  }
  // 9. 2024 vs 2026
  {
    const s = slide('MRP dan ERP', OFF, 'Grounding MAX 9 (Januari 2024) sebagai lonjakan kebutuhan; Tailsight (April 2026) sebagai perencanaan berbasis kapasitas. Sumber: CNBC, ADN (2024); Alaska Airlines newsroom (2026).');
    headline(s, [[{ t: 'PERENCANAAN PERAWATAN:' }, { t: '2024 VS 2026', hl: LIME }]], M, 0.55, 44);
    const cw = (CW - 0.3) / 2;
    [['JANUARI 2024', 'GROUNDING 737 MAX 9', 'Setelah insiden 5 Januari 2024, 65 pesawat MAX 9 dikandangkan dan diinspeksi serentak. Kebutuhan melonjak pada satu periode: kapasitas hangar dan teknisi dijadwalkan ulang, sekitar 150 penerbangan per hari dibatalkan selama tiga minggu, dampak sekitar US$150 juta. Pesawat pertama kembali terbang 26 Januari.', ORANGE, WHITE],
     ['APRIL 2026', 'KEMITRAAN TAILSIGHT', 'Platform optimasi perencanaan perawatan: menggabungkan data sistem perawatan, jadwal penerbangan, staf, *station capability rules*, dan ketersediaan suku cadang menjadi rencana yang memperhitungkan tenaga kerja dan kesiapan pesawat. Target: utilisasi naik, waktu *aircraft-on-ground* turun.', LIME, BLACK]].forEach((c, i) => {
      const x = M + i * (cw + 0.3);
      card(s, x, 1.5, cw, 4.3, { fill: c[3] });
      tag(s, c[0], x + 0.35, 1.8, 2.1, 0.4, { fill: c[4] === WHITE ? WHITE : BLACK, color: c[4] === WHITE ? ORANGE : WHITE, fs: 14 });
      HT(s, c[1], x + 0.35, 2.35, cw - 0.7, 0.6, { fs: 30, color: c[4] });
      P(s, c[2], x + 0.35, 3.05, cw - 0.7, 2.6, { fs: 15.5, color: c[4] });
    });
    card(s, M, 6.0, CW, 0.85, { fill: BLACK });
    P(s, '**Pergeseran:** dari perencanaan yang mengabaikan kapasitas (*infinite loading*) menuju perencanaan tertutup berkapasitas berhingga (*closed-loop*).', M + 0.35, 6.0, CW - 0.7, 0.85, { fs: 16, color: WHITE, valign: 'middle' });
  }
  // 10. INTEGRASI SISTEM
  {
    const s = slide('MRP dan ERP', OFF, 'Sistem operasi terintegrasi Alaska dan nilai integrasi yang terbukti.');
    headline(s, [[{ t: 'INTEGRASI SISTEM ALA ERP:' }, { t: 'SATU BASIS DATA', hl: ORANGE, color: WHITE }]], M, 0.55, 44);
    card(s, M, 1.5, 5.6, 5.35);
    const nodes = [['Reservasi & check-in', 'FaTicketAlt'], ['Penjadwalan kru', 'FaUserClock'], ['Flight dispatch & cuaca', 'FaCloudSun'], ['Perawatan & suku cadang', 'FaTools'], ['Keuangan & SDM', 'FaMoneyCheckAlt']];
    const cx = M + 2.8, cy = 4.2;
    const pos = nodes.map((n, i) => { const a = -Math.PI / 2 + i * (2 * Math.PI / 5); return [cx + 1.9 * Math.cos(a), cy + 1.5 * Math.sin(a)]; });
    pos.forEach(p => line(s, cx, cy, p[0], p[1], { color: 'DADAD5', w: 2 }));
    nodes.forEach((n, i) => {
      const [nx, ny] = pos[i]; const col = i % 2 ? LIME : ORANGE;
      s.addShape(pres.ShapeType.ellipse, { x: nx - 0.36, y: ny - 0.36, w: 0.72, h: 0.72, fill: { color: col }, line: { color: col, width: 0.25 }, objectName: 'node' });
      icon(s, n[1], nx - 0.18, ny - 0.18, 0.36, i % 2 ? BLACK : WHITE);
      P(s, n[0], nx - 0.95, ny + 0.4, 1.9, 0.5, { fs: 14, bold: true, align: 'center' });
    });
    s.addShape(pres.ShapeType.ellipse, { x: cx - 1.0, y: cy - 0.62, w: 2.0, h: 1.24, fill: { color: BLACK }, line: { color: BLACK, width: 0.25 }, objectName: 'hub' });
    icon(s, 'FaDatabase', cx - 0.18, cy - 0.5, 0.36, WHITE);
    HT(s, 'BASIS DATA\nOPERASI BERSAMA', cx - 0.95, cy - 0.12, 1.9, 0.7, { fs: 16, color: WHITE, align: 'center', font: HEAD2, bold: true });
    const rx = M + 5.85, rw = CW - 5.85;
    card(s, rx, 1.5, rw, 5.35, { fill: LIME });
    HT(s, 'NILAI INTEGRASI YANG TERBUKTI', rx + 0.35, 1.75, rw - 0.7, 0.5, { fs: 28 });
    bullets(s, ['**Penjadwalan ulang lintas fungsi dalam hitungan jam** saat cuaca memburuk; taksiran penghematan US$18 juta per tahun (Heizer et al., 2017).', '**Integrasi Hawaiian Airlines:** *single operating certificate* 29 Oktober 2025 setelah setahun kerja multidepartemen; sistem layanan penumpang tunggal menyusul pada 2026.', '**Tailsight** memakai data perawatan, jadwal, staf, dan suku cadang sekaligus; nilainya bergantung pada konsistensi data di seluruh sistem.'], rx + 0.35, 2.4, rw - 0.7, 4.3, { fs: 15.5, psa: 10 });
    source(s, 'Infrastruktur hibrida: pusat data sendiri untuk beban kritis ditambah layanan cloud (GeekWire, 2025).');
  }
  // 11. DUA OUTAGE
  {
    const s = slide('MRP dan ERP', OFF, 'Dua outage 2025 sebagai bukti risiko integrasi. Sumber: CBS News (Juli 2025); GeekWire (Oktober 2025).');
    headline(s, [[{ t: 'RISIKO INTEGRASI:' }, { t: 'DUA OUTAGE 2025', hl: LIME }]], M, 0.55, 44);
    const cw = (CW - 4.3 - 0.5) / 2;
    [['20 JULI 2025', 'PERANGKAT KERAS PUSAT DATA GAGAL', 'Satu perangkat keras multiredundan gagal; beberapa sistem operasional lumpuh. *Ground stop* ±3 jam agar pesawat tetap di posisi; >150 pembatalan. Alaska menyatakan telah "mengeraskan" sistemnya.'],
     ['23 OKTOBER 2025', 'PUSAT DATA UTAMA GAGAL', '*Ground stop* ±8 jam, >400 pembatalan, ±49.000 penumpang terdampak. Bukan serangan siber. Audit seluruh infrastruktur IT oleh pakar eksternal; perangkat keras pusat data diganti.']].forEach((c, i) => {
      const x = M + i * (cw + 0.25);
      card(s, x, 1.5, cw, 4.3);
      tag(s, c[0], x + 0.3, 1.75, 2.2, 0.4, { fill: ORANGE, fs: 14 });
      HT(s, c[1], x + 0.3, 2.3, cw - 0.6, 0.95, { fs: 26 });
      P(s, c[2], x + 0.3, 3.3, cw - 0.6, 2.4, { fs: 15.5 });
    });
    photo(s, 'ground_stop.png', M + 2 * (cw + 0.25), 1.5, 4.3, 3.22, 'foto apron sepi saat ground stop');
    P(s, 'Ground stop: seluruh pesawat tertahan di gate sampai sistem pulih.', M + 2 * (cw + 0.25), 4.8, 4.3, 0.8, { fs: 14, color: GREY, italic: true, align: 'center' });
    card(s, M, 6.0, CW, 0.85, { fill: BLACK });
    P(s, '**Pelajaran:** semakin terintegrasi sistem, semakin besar dampak satu titik kegagalan (*single point of failure*). Nilai integrasi hanya terwujud bila sistemnya tetap hidup.', M + 0.35, 6.0, CW - 0.7, 0.85, { fs: 16, color: WHITE, valign: 'middle' });
  }
  // 12. DIVIDER 2
  {
    const s = slide('Sequencing and Scheduling', BLACK, 'Pembuka subtopik 2.');
    photo(s, 'div_marshaller.jpg', 0, 0, W, H, 'foto marshaller malam hari');
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: BLACK, transparency: 42 }, line: { color: BLACK, width: 0, transparency: 100 }, objectName: 'overlay' });
    tag(s, 'SUBTOPIK 2', M, 2.1, 1.9, 0.45, { fill: ORANGE, fs: 15 });
    headline(s, [[{ t: 'SEQUENCING AND SCHEDULING' }], [{ t: 'DI ALASKA AIRLINES', hl: LIME, color: BLACK }]], M, 2.75, 60, { color: WHITE });
    P(s, 'Mengurutkan dan menjadwalkan pesawat, kru, hangar, dan staf darat dalam horizon hari dan jam, termasuk ketika cuaca menjadi musuh.', M, 5.15, 9.0, 0.9, { fs: 20, color: WHITE });
  }
  // 13. APA YANG DIJADWALKAN (limau) — kartu foto gaya "our team"
  {
    const s = slide('Sequencing and Scheduling', LIME, 'Tiga objek penjadwalan harian Alaska (Heizer et al., 2017, Tabel 15.1).');
    headline(s, [[{ t: 'APA YANG' }, { t: 'DIJADWALKAN', hl: WHITE }, { t: 'ALASKA SETIAP HARI' }]], M, 0.55, 44);
    const items = [['r43_tech.png', 'PESAWAT &\nPERAWATAN', 'Sekitar 150 pesawat per hari (Heizer et al., 2017), kini 392 pesawat grup; slot hangar dan *line maintenance* di setiap basis.'], ['r43_pilots.png', 'KRU & JADWAL\nKEBERANGKATAN', 'Lebih dari 4.500 pilot dan awak kabin; batas jam tugas FAA, kontrak serikat, *preferential bidding system*.'], ['r43_baggage.png', 'GATE, TIKET &\nKATERING', 'Kebutuhan staf berubah menurut hari, jam, dan cuaca, termasuk *deicing* saat musim dingin.']];
    const gap = 0.3, cw = (CW - 2 * gap) / 3, y = 1.5, h = 5.25, pw = cw - 0.5, ph = pw * 0.75;
    items.forEach((it, i) => {
      const x = M + i * (cw + gap);
      card(s, x, y, cw, h);
      photo(s, it[0], x + 0.25, y + 0.25, pw, ph, it[1]);
      HT(s, it[1], x + 0.25, y + ph + 0.4, cw - 0.5, 0.85, { fs: 26 });
      P(s, it[2], x + 0.25, y + ph + 1.3, cw - 0.5, h - ph - 1.4, { fs: 15 });
    });
    source(s, 'Perubahan satu jadwal merambat ke yang lain (ripple effect). Sumber: Heizer et al. (2017), Tabel 15.1.', BLACK);
  }
  // 14. SATU HARI BADAI
  {
    const s = slide('Sequencing and Scheduling', OFF, 'Satu hari badai Desember di Seattle: lima titik waktu (Heizer et al., 2017, hlm. 600).');
    headline(s, [[{ t: 'SATU HARI BADAI DI SEATTLE:' }, { t: 'JADWAL DIREVISI 5 KALI', hl: ORANGE, color: WHITE }]], M, 0.55, 42);
    const tl = [['04.00', 'Hujan, kemungkinan salju ringan.', 'Bahas status pesawat dan kemungkinan pembatalan.'], ['10.00', 'Hujan beku setelah pukul 17.00.', 'Siapkan truk *deicing*; rencanakan pembatalan 50–80% penerbangan setelah 18.00.'], ['13.30', 'Hujan menjadi salju.', 'Batalkan separuh penerbangan 18.00–10.00; beri tahu penumpang; alihkan rute.'], ['17.00', 'Salju lebih sedikit dari perkiraan.', 'Terus hubungi penumpang; atur penerbangan alternatif.'], ['22.00', 'Salju mereda.', 'Carikan hotel untuk 600 penumpang yang terdampar.']];
    const cw = (CW - 4 * 0.2) / 5;
    line(s, M + cw / 2, 1.78, M + 4 * (cw + 0.2) + cw / 2, 1.78, { color: BLACK, w: 2.5 });
    tl.forEach((t, i) => {
      const x = M + i * (cw + 0.2), y = 2.1, h = 3.55;
      s.addShape(pres.ShapeType.ellipse, { x: x + cw / 2 - 0.12, y: 1.66, w: 0.24, h: 0.24, fill: { color: ORANGE }, line: { color: ORANGE, width: 0.25 }, objectName: 'dot' });
      card(s, x, y, cw, h);
      tag(s, t[0], x + cw / 2 - 0.6, y - 0.2, 1.2, 0.4, { fs: 15 });
      HT(s, 'PRAKIRAAN', x + 0.2, y + 0.4, cw - 0.4, 0.3, { fs: 16, font: HEAD2, bold: true, color: LIME_D, cs: 1 });
      P(s, t[1], x + 0.2, y + 0.72, cw - 0.4, 0.95, { fs: 14.5 });
      HT(s, 'TINDAKAN', x + 0.2, y + 1.7, cw - 0.4, 0.3, { fs: 16, font: HEAD2, bold: true, color: ORANGE, cs: 1 });
      P(s, t[2], x + 0.2, y + 2.02, cw - 0.4, 1.5, { fs: 14.5 });
    });
    card(s, M, 5.9, CW, 0.95, { fill: BLACK });
    P(s, 'Lima revisi dalam 18 jam; setiap revisi memicu tindakan baru. Teknologi penjadwalan ulang Alaska menghemat sekitar US$18 juta per tahun (Heizer et al., 2017).', M + 0.35, 5.9, CW - 0.7, 0.95, { fs: 16, color: WHITE, valign: 'middle' });
  }
  // 15. PUSAT OPERASI & KRU
  {
    const s = slide('Sequencing and Scheduling', OFF, 'Flight Operations Department (lampu andon) dan penjadwalan kru dengan kendala legalitas. Sumber: Heizer et al. (2017); Halldale (2024).');
    headline(s, [[{ t: 'PUSAT OPERASI DAN' }, { t: 'PENJADWALAN KRU', hl: LIME }]], M, 0.55, 44);
    photo(s, 'ops.png', M, 1.5, 4.6, 3.45, 'foto pusat operasi');
    card(s, M, 5.15, 4.6, 1.7, { fill: ORANGE });
    HT(s, 'US$18 JUTA', M + 0.3, 5.25, 4.0, 0.7, { fs: 36, color: WHITE });
    P(s, 'hemat per tahun dari teknologi yang menekan pembatalan dan keterlambatan.', M + 0.3, 5.95, 4.0, 0.85, { fs: 14.5, color: WHITE });
    const rx = M + 4.85, rw = CW - 4.85;
    card(s, rx, 1.5, rw, 2.55);
    HT(s, 'FLIGHT OPERATIONS DEPARTMENT, SEATTLE', rx + 0.35, 1.7, rw - 0.7, 0.5, { fs: 26 });
    P(s, 'Puluhan layar memantau penerbangan dan cuaca; lampu *andon* hijau, kuning, merah menandai status. Model penjadwalan matematis menyusun jadwal alternatif, mengalihkan rute, memastikan kru tersedia, dan memberi tahu penumpang.', rx + 0.35, 2.25, rw - 0.7, 1.7, { fs: 15.5 });
    card(s, rx, 4.3, rw, 2.55);
    HT(s, 'PENJADWALAN 4.500+ PILOT DAN AWAK KABIN', rx + 0.35, 4.5, rw - 0.7, 0.5, { fs: 26 });
    P(s, '*Preferential bidding system* di bawah batas jam tugas FAA dan kontrak serikat: kapasitas berhingga dengan kendala legalitas. Kodiak: hanya kapten boleh mendarat, sehingga *pairing* kru tidak bebas. Data kualifikasi kru dijaga oleh sistem pelatihan (Fox TMS, 2024).', rx + 0.35, 5.05, rw - 0.7, 1.75, { fs: 15.5 });
  }
  // 16. MENGURUTKAN PEKERJAAN DI HANGAR
  {
    const s = slide('Sequencing and Scheduling', OFF, 'Aturan prioritas pada lima paket pekerjaan hangar (data HRM Contoh 15.4) dan critical ratio untuk AOG.');
    headline(s, [[{ t: 'MENGURUTKAN' }, { t: 'PEKERJAAN DI HANGAR', hl: ORANGE, color: WHITE }]], M, 0.55, 44);
    card(s, M, 1.5, 5.0, 5.35);
    P(s, 'Lima paket pekerjaan A–E: waktu proses 6, 2, 8, 3, 9 hari; *due date* 8, 6, 18, 15, 23 hari (HRM Contoh 15.4).', M + 0.3, 1.7, 4.4, 0.9, { fs: 15 });
    s.addChart(pres.ChartType.bar, [{ name: 'Waktu penyelesaian rata-rata (hari)', labels: ['FCFS', 'SPT', 'EDD', 'LPT'], values: [15.4, 13.0, 13.6, 20.6] }], {
      x: M + 0.15, y: 2.6, w: 4.7, h: 3.0, barDir: 'col', chartColors: ['DADAD5', LIME, 'DADAD5', ORANGE], showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '0.0', dataLabelFontSize: 14, dataLabelColor: BLACK, dataLabelFontFace: '+mn-lt',
      catAxisLabelFontSize: 14, catAxisLabelColor: BLACK, catAxisLabelFontFace: '+mn-lt', valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' }, showLegend: false,
      showTitle: true, title: 'Waktu penyelesaian rata-rata (hari)', titleFontSize: 14, titleColor: BLACK, titleFontFace: '+mn-lt', valAxisMinVal: 0, valAxisMaxVal: 25, barGapWidthPct: 55, objectName: 'chart aturan prioritas',
    });
    P(s, 'FCFS = urutan kedatangan · SPT = terpendek dahulu · EDD = tenggat terdekat dahulu · LPT = terpanjang dahulu', M + 0.3, 5.7, 4.4, 1.0, { fs: 13, color: GREY, italic: true });
    const rx = M + 5.25, rw = CW - 5.25, tw = rw - 0.5;
    card(s, rx, 1.5, rw, 5.35);
    const rows = tableRows(['Aturan', 'Urutan', 'Waktu selesai (hari)', 'Utilisasi', 'Pekerjaan rata-rata', 'Terlambat (hari)'], [
      [{ text: 'FCFS', bold: true }, 'A–B–C–D–E', '15,4', '36,4%', '2,75', '2,2'],
      [{ text: 'SPT', bold: true }, 'B–D–A–C–E', { text: '13,0', bold: true, fill: LIME }, { text: '43,1%', bold: true, fill: LIME }, { text: '2,32', bold: true, fill: LIME }, '1,8'],
      [{ text: 'EDD', bold: true }, 'B–A–D–C–E', '13,6', '41,2%', '2,43', { text: '1,2', bold: true, fill: LIME }],
      [{ text: 'LPT', bold: true }, 'E–C–A–D–B', '20,6', '27,2%', '3,68', '9,6'],
    ], { fs: 13.5 });
    addTable(s, rows, rx + 0.25, 1.65, tw, [0.8, 1.25, 1.15, 0.95, 1.15, tw - 5.3], { rowH: 0.46 });
    card(s, rx + 0.25, 4.85, tw, 1.85, { fill: LIME });
    P(s, '**Pembacaan untuk Alaska:** SPT memaksimalkan *throughput* hangar; EDD meminimalkan keterlambatan terhadap tenggat kelaikan udara; LPT terburuk. Untuk pesawat AOG dipakai *critical ratio* (sisa waktu ÷ sisa pekerjaan) yang diperbarui setiap hari. Tidak ada satu aturan yang unggul di semua kriteria.', rx + 0.5, 4.85, tw - 0.5, 1.85, { fs: 14, valign: 'middle' });
  }
  // 17. ALUR DUA TAHAP & STAF DARAT
  {
    const s = slide('Sequencing and Scheduling', OFF, 'Johnson\'s rule pada alur inspeksi lalu perbaikan (HRM Contoh 15.6) dan jadwal siklis petugas gate (HRM Contoh 15.8).');
    headline(s, [[{ t: 'ALUR DUA TAHAP DI HANGAR DAN' }, { t: 'STAF DARAT', hl: LIME }]], M, 0.55, 44);
    const lw = 6.3;
    card(s, M, 1.5, lw, 5.35);
    HT(s, 'INSPEKSI LALU PERBAIKAN', M + 0.3, 1.7, lw - 0.6, 0.5, { fs: 26 });
    P(s, 'Lima komponen melewati dua pusat kerja berurutan (jam inspeksi/perbaikan): A 5/2, B 3/6, C 8/4, D 10/7, E 7/12. Dengan *Johnson\'s rule*, urutan **B–E–D–C–A** selesai dalam **35 jam**; urutan A–B–C–D–E butuh 45 jam.', M + 0.3, 2.25, lw - 0.6, 1.6, { fs: 15 });
    const gx = M + 1.45, gy = 4.05, gw = lw - 1.85, scale = gw / 35, rh = 0.5;
    const g1 = [['B', 0, 3], ['E', 3, 10], ['D', 10, 20], ['C', 20, 28], ['A', 28, 33]], g2 = [['B', 3, 9], ['E', 10, 22], ['D', 22, 29], ['C', 29, 33], ['A', 33, 35]];
    P(s, 'Inspeksi', M + 0.3, gy, 1.1, rh, { fs: 14, bold: true, valign: 'middle' });
    P(s, 'Perbaikan', M + 0.3, gy + rh + 0.1, 1.1, rh, { fs: 14, bold: true, valign: 'middle' });
    [[g1, 0, ORANGE, WHITE], [g2, 1, LIME, BLACK]].forEach(([g, r, col, tc]) => g.forEach(b => {
      const bx = gx + b[1] * scale, bw = (b[2] - b[1]) * scale, by = gy + r * (rh + 0.1);
      s.addShape(pres.ShapeType.roundRect, { x: bx + 0.02, y: by, w: bw - 0.04, h: rh, fill: { color: col }, line: { color: col, width: 0.25 }, rectRadius: 0.08, objectName: 'gantt bar' });
      P(s, b[0], bx, by, bw, rh, { fs: 14, bold: true, color: tc, align: 'center', valign: 'middle' });
    }));
    [0, 10, 20, 30].forEach(t => P(s, String(t), gx + t * scale - 0.3, gy + 2 * rh + 0.18, 0.6, 0.3, { fs: 12, align: 'center', color: GREY }));
    P(s, '35 jam', gx + gw - 0.6, gy + 2 * rh + 0.18, 0.8, 0.3, { fs: 12, color: GREY, align: 'right' });
    P(s, 'Pusat kerja kedua menganggur hanya saat menunggu pekerjaan pertama.', M + 0.3, 5.75, lw - 0.6, 0.9, { fs: 14, color: GREY, italic: true });
    const rx = M + lw + 0.3, rw = CW - lw - 0.3;
    card(s, rx, 1.5, rw, 5.35);
    HT(s, 'STAF GATE DENGAN JADWAL SIKLIS', rx + 0.3, 1.7, rw - 0.6, 0.5, { fs: 26 });
    P(s, 'Kebutuhan petugas *gate* Senin–Minggu: 5, 5, 6, 5, 4, 3, 3. Pola lima hari kerja dan dua hari libur berurutan: tujuh petugas mencukupi.', rx + 0.3, 2.25, rw - 0.6, 1.0, { fs: 15 });
    const cyc = [['Kebutuhan', ['5', '5', '6', '5', '4', '3', '3']], ['Kapasitas', ['6', '6', '7', '5', '5', '3', '3']], ['Kelebihan', ['1', '1', '1', '0', '1', '0', '0']]];
    const cRows = tableRows(['', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], cyc.map((r, i) => [{ text: r[0], bold: true }, ...r[1].map(v => ({ text: v, fill: i === 1 ? LIME : undefined }))]), { fs: 12.5 });
    addTable(s, cRows, rx + 0.3, 3.3, rw - 0.6, [1.25, ...Array(7).fill((rw - 0.6 - 1.25) / 7)], { rowH: 0.42 });
    P(s, '**Hari libur:** P1, P2, P4 Sabtu–Minggu; P3, P6 Kamis–Jumat; P5, P7 Senin–Selasa (P = petugas).', rx + 0.3, 5.15, rw - 0.6, 0.6, { fs: 14 });
    P(s, 'Kapasitas *deicing* disiapkan delapan jam sebelum hujan beku tiba (10.00 untuk 18.00): staf darat musim dingin dijadwalkan dari prakiraan, bukan dari kejadian.', rx + 0.3, 5.82, rw - 0.6, 0.98, { fs: 13.5, color: GREY, italic: true });
  }
  // 18. EVALUASI & REKOMENDASI (oranye)
  {
    const s = slide('Penutup', ORANGE, 'Evaluasi dan empat rekomendasi dengan indikator.');
    headline(s, [[{ t: 'EVALUASI DAN' }, { t: 'REKOMENDASI', hl: BLACK, color: WHITE }]], M, 0.55, 48, { color: WHITE });
    P(s, 'Alaska kuat pada penjadwalan ulang jangka pendek dan sedang memperkuat perencanaan perawatan berbasis kapasitas; titik lemah yang terbukti adalah ketahanan infrastruktur terintegrasi.', M, 1.45, CW, 0.75, { fs: 17, color: WHITE });
    const recs = [['01', 'KETAHANAN INFRASTRUKTUR TERINTEGRASI', 'Redundansi aktif-aktif pusat data dan cloud, uji *failover* berkala, prosedur manual *degraded mode* untuk *dispatch* dan kru.', 'Waktu pemulihan; *ground stop* akibat IT.'], ['02', 'PERAWATAN BERKAPASITAS BERHINGGA', 'Operasionalkan Tailsight dengan *load report* hangar dan suku cadang; masukkan *lead time* OEM sebagai kendala.', 'Jam AOG; *fill rate*; utilisasi teknisi.'], ['03', 'ATURAN PRIORITAS HIBRIDA', '*Critical ratio* untuk AOG, SPT untuk antrean rutin, *Johnson\'s rule* untuk alur dua tahap.', 'Keterlambatan rata-rata; *makespan*.'], ['04', 'PROSES DULU, SISTEM KEMUDIAN', 'Standarkan proses kru, perawatan, dan layanan penumpang sebelum migrasi Hawaiian ke sistem tunggal; batasi kustomisasi.', 'Biaya kustomisasi; insiden *cut-over*.']];
    const cw = (CW - 0.25) / 2, ch = 2.2;
    recs.forEach((r, i) => {
      const x = M + (i % 2) * (cw + 0.25), y = 2.35 + Math.floor(i / 2) * (ch + 0.2);
      card(s, x, y, cw, ch, { fill: i % 3 === 0 ? WHITE : (i === 1 ? LIME : WHITE) });
      HT(s, r[0], x + 0.3, y + 0.2, 1.0, 0.6, { fs: 34, color: ORANGE });
      HT(s, r[1], x + 1.2, y + 0.22, cw - 1.5, 0.6, { fs: 24, valign: 'middle' });
      P(s, r[2], x + 0.3, y + 0.95, cw - 0.6, 0.85, { fs: 14.5 });
      P(s, [{ text: 'Indikator: ', options: { bold: true } }, ...runs(r[3])], x + 0.3, y + 1.75, cw - 0.6, 0.4, { fs: 14 });
    });
  }
  // 19. KESIMPULAN
  {
    const s = slide('Penutup', OFF, 'Tiga kesimpulan dan angka kunci. ' + REFS);
    headline(s, [[{ t: 'KESIMPULAN', hl: LIME }]], M, 0.55, 48);
    const con = [['JADWAL PENERBANGAN ADALAH MASTER SCHEDULE', 'Kebutuhan perawatan, suku cadang, dan kru diturunkan darinya (logika MRP); satu basis data operasi menyatukannya (logika ERP).'], ['KETEPATAN WAKTU DIJAGA JAM DEMI JAM', 'Aturan prioritas di hangar, penjadwalan kru berkapasitas berhingga, jadwal siklis staf darat, dan penjadwalan ulang saat badai.'], ['INTEGRASI: KEUNGGULAN SEKALIGUS RISIKO', 'Hemat US$18 juta per tahun, tetapi dua *outage* 2025 menghentikan seluruh operasi. Ketahanan infrastruktur harus direncanakan sekeras jadwalnya.']];
    con.forEach((c, i) => {
      const y = 1.5 + i * 1.8;
      card(s, M, y, 8.5, 1.62);
      s.addShape(pres.ShapeType.ellipse, { x: M + 0.3, y: y + 0.45, w: 0.7, h: 0.7, fill: { color: i === 1 ? LIME : ORANGE }, line: { color: i === 1 ? LIME : ORANGE, width: 0.25 }, objectName: 'number circle' });
      HT(s, String(i + 1), M + 0.3, y + 0.45, 0.7, 0.7, { fs: 26, align: 'center', valign: 'middle', color: i === 1 ? BLACK : WHITE });
      HT(s, c[0], M + 1.2, y + 0.2, 7.0, 0.5, { fs: 25 });
      P(s, c[1], M + 1.2, y + 0.72, 7.0, 0.85, { fs: 15 });
    });
    const rx = M + 8.75, rw = CW - 8.75;
    card(s, rx, 1.5, rw, 5.35, { fill: BLACK });
    HT(s, 'ANGKA KUNCI', rx + 0.3, 1.7, rw - 0.6, 0.45, { fs: 22, color: LIME });
    [['US$18 JUTA', 'penghematan per tahun dari penjadwalan ulang'], ['85,8%', '*on-time departures* SEA, tertinggi di AS (Heizer et al., 2017)'], ['79,25%', 'ketepatan kedatangan 2024, peringkat ke-3 Amerika Utara (Cirium)']].forEach((k, i) => {
      const y = 2.3 + i * 1.5;
      HT(s, k[0], rx + 0.3, y, rw - 0.6, 0.6, { fs: 34, color: WHITE });
      P(s, k[1], rx + 0.3, y + 0.62, rw - 0.6, 0.8, { fs: 13.5, color: 'C9E36A' });
    });
    source(s, 'Referensi lengkap tercantum pada catatan pembicara slide ini.');
  }
  // 20. TERIMA KASIH (hanya teks)
  {
    const s = slide('Penutup', LIME, 'Penutup.', true);
    HT(s, 'TERIMA KASIH', 0, 2.6, W, 2.3, { fs: 120, align: 'center', valign: 'middle' });
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('written', OUT);
})().catch(e => { console.error(e); process.exit(1); });
