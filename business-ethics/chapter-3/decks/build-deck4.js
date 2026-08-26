'use strict';
// DECK 4 — Hilirisasi Nikel: fakta kasus dan konseptualisasinya dengan Chapter 3
const T = require('./theme');
const {
  BG, INK, SLATE, LINE, ORNG, LAV, LIME, AMBR, TEAL, W, F, MONO,
  M, SW, SH, CW,
  bg, card, rect, pills, pillsRight, head, sub, chip, tile, stat, quote,
  banner, numRow, wave, foot, report, mix
} = T;

const pres = T.newDeck('Hilirisasi Nikel', 'Business Ethics Chapter 3 · Analisis Kasus Indonesia');
let page = 0;

function S(pillItems, opt) {
  const s = pres.addSlide();
  bg(s, (opt && opt.bg) || BG);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, (opt && opt.corner) || LIME);
  if (pillItems) pills(pres, s, pillItems);
  page++;
  foot(s, page, (opt && opt.footColor) || SLATE);
  return s;
}

const w3 = (CW - 2 * 0.24) / 3;
const w4 = (CW - 3 * 0.2) / 4;
const w2 = (CW - 0.28) / 2;
const SPEC = ['AB463C', 'FF5A2D', 'F5B722', 'C6F04A', '0FA98E', '4EA8DE', '6C7BE0', 'B8A6F5', 'E86A9B'];
const NAMA = ['Egoism', 'Utilitarianism', 'Ethics of Duty', 'Ethics of Rights', 'Justice',
  'Virtue Ethics', 'Ethic of Care', 'Discourse Ethics', 'Postmodern Ethics'];

// baris sumber di kaki slide
function src(s, y, text) {
  s.addText(text, {
    isTextBox: true, x: M, y, w: CW, h: 0.28,
    fontFace: F, fontSize: 10, italic: true, color: SLATE, margin: 0
  });
  T.chk('sumber', text, CW, 0.28, 10, 13);
}

// daftar fakta berlabel
function fakta(s, x, y, w, items, warna, pitch, lw) {
  const p = pitch || 0.56;
  const lab = lw || 1.74;
  items.forEach((it, i) => {
    const yy = y + i * p;
    rect(pres, s, x, yy + 0.12, 0.16, 0.16, warna);
    s.addText(it[0], { isTextBox: true, x: x + 0.32, y: yy, w: lab, h: 0.36, fontFace: MONO, fontSize: 10.5, bold: true, color: mix(warna, INK, 0.35), margin: 0 });
    s.addText(it[1], { isTextBox: true, x: x + 0.32 + lab + 0.16, y: yy, w: w - 0.48 - lab, h: p - 0.06, fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0, lineSpacing: 15 });
    T.chk('fakta ' + it[0], it[1], w - 0.48 - lab, p - 0.06, 11.5, 15);
  });
}

// daftar fakta pada kartu gelap
function faktaGelap(s, x, y, w, items, aksen, pitch, lw) {
  const p = pitch || 0.6;
  const lab = lw || 1.4;
  items.forEach((it, i) => {
    const yy = y + i * p;
    s.addText(it[0], { isTextBox: true, x, y: yy, w: lab, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: aksen, margin: 0 });
    s.addText(it[1], { isTextBox: true, x: x + lab + 0.2, y: yy - 0.03, w: w - lab - 0.2, h: p - 0.04, fontFace: F, fontSize: 11, color: 'B9C0CE', margin: 0, lineSpacing: 14.5 });
    T.chk('faktaGelap ' + it[0], it[1], w - lab - 0.2, p - 0.04, 11, 14.5);
  });
}

// kartu satu lensa teori: nomor, nama, pertanyaan kunci, temuan, putusan
function lens(s, o) {
  const c = SPEC[o.i - 1];
  const dark = ['AB463C', 'FF5A2D', '0FA98E', '6C7BE0', 'E86A9B'].indexOf(c) >= 0;
  const fg = dark ? W : INK;
  card(pres, s, o.x, o.y, o.w, o.h, c);
  chip(pres, s, o.x + 0.26, o.y + 0.24, o.i, mix(c, dark ? W : INK, 0.18), fg, 0.33);

  const nama = NAMA[o.i - 1];
  const nh = Math.max(0.3, T.estLines(nama, o.w - 0.96, 15 * 1.07) * 15 * 1.22 / 72);
  s.addText(nama, {
    isTextBox: true, x: o.x + 0.7, y: o.y + 0.25, w: o.w - 0.96, h: nh,
    fontFace: F, fontSize: 15, bold: true, color: fg, margin: 0, lineSpacing: 18.3
  });

  const qy = o.y + 0.25 + nh + 0.18;
  const qh = T.estLines(o.q, o.w - 0.52, 11) * 14.5 / 72;
  s.addText(o.q, {
    isTextBox: true, x: o.x + 0.26, y: qy, w: o.w - 0.52, h: qh,
    fontFace: F, fontSize: 11, italic: true,
    color: dark ? mix(c, W, 0.74) : mix(c, INK, 0.7), margin: 0, lineSpacing: 14.5
  });

  const vt = o.v.toUpperCase();
  const vh = Math.max(0.38, T.estLines(vt, o.w - 0.8, 9.5 * 1.15) * 0.2 + 0.18);
  const bodyY = qy + qh + 0.18;
  const bodyH = o.y + o.h - bodyY - vh - 0.34;
  s.addText(o.b, {
    isTextBox: true, x: o.x + 0.26, y: bodyY, w: o.w - 0.52, h: bodyH,
    fontFace: F, fontSize: 11.5, color: dark ? 'F4F1EB' : '1E2534', margin: 0, lineSpacing: 16.5
  });
  T.chk('lens-b ' + o.i, o.b, o.w - 0.52, bodyH, 11.5, 16.5);

  card(pres, s, o.x + 0.26, o.y + o.h - vh - 0.2, o.w - 0.52, vh,
    dark ? mix(c, INK, 0.4) : mix(c, INK, 0.16), { r: 0.09 });
  s.addText(vt, {
    isTextBox: true, x: o.x + 0.34, y: o.y + o.h - vh - 0.2, w: o.w - 0.68, h: vh,
    align: 'center', valign: 'middle', fontFace: F, fontSize: 9.5, bold: true, charSpacing: 0.8,
    color: dark ? W : INK, margin: 0
  });
}

// ============================================================ 01 sampul
{
  const s = pres.addSlide();
  bg(s, INK);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, LIME);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, ORNG);
  wave(pres, s, 7.4, 1.2, 5.5, 0.42, '283044');
  page++;

  s.addText('Business Ethics', { isTextBox: true, x: M, y: 0.5, w: 4, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: W, margin: 0 });
  pillsRight(pres, s, [{ t: 'MBA · UGM', fill: LIME, color: INK }, { t: 'Studi Kasus Indonesia', fill: '1B2233', color: 'B9C0CE' }], 0.46);

  s.addText('Evaluating Business Ethics', { isTextBox: true, x: M, y: 1.62, w: 7.4, h: 0.32, fontFace: F, fontSize: 13.5, color: 'B9C0CE', margin: 0 });
  s.addText('Analisis Kasus —', { isTextBox: true, x: M, y: 1.98, w: 7.4, h: 0.34, fontFace: F, fontSize: 16, bold: true, color: LIME, margin: 0 });

  s.addText([
    { text: 'Hilirisasi', options: { color: W, breakLine: true } },
    { text: 'Nikel', options: { color: W } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 2.5, w: 8.2, h: 1.74, fontFace: F, fontSize: 54, bold: true, margin: 0, lineSpacing: 60 });

  s.addText('Lompatan industri nasional atau pemindahan beban ke Morowali dan Weda Bay? Satu kebijakan diuji dengan sembilan teori etika normatif.', {
    isTextBox: true, x: M, y: 4.5, w: 7.3, h: 0.9, fontFace: F, fontSize: 14, color: 'B9C0CE', margin: 0, lineSpacing: 22
  });

  card(pres, s, M, 5.72, 4.5, 0.78, '1B2233');
  rect(pres, s, M, 5.78, 0.06, 0.66, LIME);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.87, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: W, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 6.14, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: '8C93A3', margin: 0 });

  SPEC.forEach((c, i) => rect(pres, s, M + 5.5 + i * 0.42, 5.94, 0.3, 0.3, c));
  s.addNotes('Deck ini punya dua bagian. Separuh pertama fakta, separuh kedua penilaian. Jangan campur keduanya saat presentasi.');
}

// ============================================================ 02 index
{
  const s = S(null);
  head(s, 'Index', 0.62, 40);
  pills(pres, s, [
    { t: 'Fakta', fill: LIME, color: INK },
    { t: 'Narasi', fill: ORNG },
    { t: 'Sembilan Lensa', fill: LAV, color: INK },
    { t: 'Putusan', fill: INK }
  ], 1.42);

  const idx = [
    ['01', 'Anatomi Kebijakan', 'Larangan ekspor bijih dan sengketa yang menyertainya'],
    ['02', 'Skala Manfaat', 'Investasi, ekspor, dan penyerapan tenaga kerja'],
    ['03', 'Kondisi Ketenagakerjaan', 'Upah, jam kerja, dan keselamatan di kawasan'],
    ['04', 'Beban Ekologis', 'Emisi, listrik batu bara, dan tutupan hutan'],
    ['05', 'Beban Hidrologis', 'Air, udara, dan kesehatan warga Halmahera'],
    ['06', 'Paradoks Kesejahteraan', 'Pertumbuhan tertinggi di kabupaten yang tetap miskin'],
    ['07', 'Pihak Paling Rentan', 'Masyarakat adat dan rantai pasok kendaraan listrik'],
    ['08', 'Dua Narasi', 'Hilirisasi berhadapan dengan ekstraksi'],
    ['09', 'Sembilan Lensa', 'Penilaian akibat, prinsip, dan konteks'],
    ['10', 'Putusan dan Implikasi', 'Matriks, evaluasi klaim, dan simpulan']
  ];
  const colW = CW / 2 - 0.2;
  idx.forEach((it, i) => {
    const x = M + (i > 4 ? CW / 2 + 0.2 : 0), y = 2.16 + (i % 5) * 0.88;
    s.addText(it[0] + '.', { isTextBox: true, x, y, w: 0.62, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(it[1], { isTextBox: true, x: x + 0.78, y: y - 0.02, w: colW - 0.78, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(it[2], { isTextBox: true, x: x + 0.78, y: y + 0.27, w: colW - 0.78, h: 0.28, fontFace: F, fontSize: 11.5, color: SLATE, margin: 0 });
    rect(pres, s, x, y + 0.66, colW, 0.011, LINE);
  });
  s.addNotes('Bagian 01 sampai 08 adalah fakta. Bagian 09 dan 10 adalah penilaian. Batas itu perlu dijaga.');
}

// ============================================================ 03 anatomi kebijakan
{
  const s = S([{ t: 'Kebijakan', fill: LIME, color: INK }, { t: 'Instrumen dan Sengketa', outline: true }]);
  head(s, 'Anatomi Kebijakan Hilirisasi', 0.96);
  sub(s, 'Satu instrumen regulasi yang mengubah struktur industri nikel nasional.', 1.62);

  const kb = [
    [ORNG, 'Instrumen', 'Peraturan Menteri ESDM Nomor 11 Tahun 2019 melarang ekspor bijih nikel dan berlaku sejak 1 Januari 2020, lebih awal dari jadwal semula.'],
    [LAV, 'Mekanisme', 'Bijih wajib diolah di dalam negeri. Kepemilikan smelter menjadi syarat, sehingga modal pengolahan mengalir ke kawasan industri terpadu.'],
    [TEAL, 'Sengketa', 'Panel WTO memutus kebijakan ini melanggar aturan perdagangan pada November 2022. Bandingnya menggantung karena Badan Banding tidak berfungsi.']
  ];
  kb.forEach((p, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.16, w: w3, h: 2.2, fill: p[0], n: '0' + (i + 1), t: p[1], ts: 14, b: p[2]
  }));

  const tl = [
    ['2014', 'Larangan ekspor bijih diberlakukan, lalu direlaksasi bagi kadar rendah'],
    ['2019', 'Larangan ditegakkan kembali melalui Peraturan Menteri ESDM Nomor 11'],
    ['2020', 'Larangan berlaku efektif, arus modal smelter masuk ke Morowali dan Weda Bay'],
    ['2022', 'Panel WTO memenangkan gugatan Uni Eropa atas kebijakan larangan ekspor'],
    ['2025', 'Nilai ekspor produk nikel olahan mencapai 40 miliar dolar Amerika']
  ];
  s.addText('Kronologi kebijakan', { isTextBox: true, x: M, y: 4.56, w: CW, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: SLATE, margin: 0 });
  tl.forEach((t, i) => {
    const y = 4.92 + i * 0.42;
    s.addText(t[0], { isTextBox: true, x: M, y, w: 1.1, h: 0.32, fontFace: MONO, fontSize: 11.5, bold: true, color: mix(SPEC[i + 1], INK, 0.34), margin: 0 });
    s.addText(t[1], { isTextBox: true, x: M + 1.3, y, w: CW - 1.3, h: 0.32, fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0 });
    if (i < tl.length - 1) rect(pres, s, M, y + 0.35, CW, 0.011, LINE);
  });
  s.addNotes('Poin kunci: kebijakan ini berhasil secara ekonomi sekaligus kalah secara hukum dagang. Dua fakta itu berjalan bersamaan.');
}

// ============================================================ 04 skala manfaat
{
  const s = S([{ t: 'Fakta 01', fill: ORNG }, { t: 'Sisi Manfaat', outline: true }]);
  head(s, 'Skala Manfaat Ekonomi', 0.96);
  sub(s, 'Angka yang menjadi dasar pembenaran kebijakan.', 1.62);

  const st = [
    { v: '41,5', u: 'miliar USD', l: 'Investasi terkumpul di Kawasan IMIP Morowali sampai Desember 2025, setara sekitar Rp 697 triliun', fill: ORNG, vs: 30 },
    { v: '40', u: 'miliar USD', l: 'Nilai ekspor produk nikel olahan pada 2025, naik dari 3 miliar dolar pada 2020', fill: LAV, vs: 30 },
    { v: '85.520', u: 'pekerja', l: 'Tenaga kerja Kawasan IMIP per Juni 2025, dari 35.952 orang pada 2020', fill: TEAL, vs: 26 },
    { v: '81.000', u: 'pekerja', l: 'Tenaga kerja Kawasan IWIP Weda Bay, dari target sekitar 100.000 orang', fill: LIME, vs: 26 }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.16 }, o)));

  fakta(s, M, 4.56, CW, [
    ['Ekspor Daerah', 'Ekspor melalui Bahodopi dan Morowali mencapai 18,08 miliar dolar Amerika, setara 81 persen seluruh ekspor Sulawesi Tengah'],
    ['Pertumbuhan', 'Perekonomian Morowali tumbuh 16,24 persen pada 2024, dengan industri pengolahan nikel menyumbang 21 persen pertumbuhan'],
    ['Posisi Global', 'Indonesia menjadi pemasok nikel olahan terbesar dunia dan simpul utama rantai pasok baterai kendaraan listrik']
  ], ORNG, 0.6, 1.74);

  src(s, 6.44, 'Data pengelola kawasan industri, Badan Pusat Statistik Sulawesi Tengah, dan Kementerian Perindustrian, ditelusuri Agustus 2026.');
  s.addNotes('Sampaikan angka ini tanpa keberatan apa pun. Keberatannya menyusul di tiga slide berikutnya, dan justru itu yang membuat kasusnya menarik.');
}

// ============================================================ 05 ketenagakerjaan
{
  const s = S([{ t: 'Fakta 02', fill: ORNG }, { t: 'Kondisi Kerja', outline: true }]);
  head(s, 'Kondisi Ketenagakerjaan', 0.96);
  sub(s, 'Angka penyerapan kerja tidak identik dengan mutu pekerjaannya.', 1.62);

  card(pres, s, M, 2.16, w2, 3.6, INK);
  pills(pres, s, [{ t: 'Upah dan Jam Kerja', fill: LIME, color: INK }], 2.4, M + 0.3);
  faktaGelap(s, M + 0.3, 2.94, w2 - 0.6, [
    ['Upah pokok', 'Rp 3 juta sampai Rp 3,6 juta per bulan, di bawah upah minimum Morowali 2025 sebesar Rp 3,7 juta'],
    ['Biaya hidup', 'Diperkirakan Rp 7,5 juta sampai Rp 8 juta per bulan bagi pekerja di sekitar kawasan'],
    ['Jam kerja', 'Lembur tercatat sampai 13 jam sehari, dengan rata-rata 56 jam seminggu terhadap batas 40 jam'],
    ['Status', 'Sebagian besar pekerja berstatus kontrak dengan daya tawar terbatas atas perpanjangannya']
  ], LIME, 0.71, 1.36);

  const px = M + w2 + 0.28;
  card(pres, s, px, 2.16, w2, 3.6, AMBR);
  pills(pres, s, [{ t: 'Keselamatan Kerja', fill: INK }], 2.4, px + 0.3);
  const ks = [
    ['2019–2025', '104 kecelakaan kerja tercatat di seluruh smelter nikel Indonesia'],
    ['Korban', '107 pekerja meninggal dunia dan 155 pekerja mengalami luka'],
    ['24 Des 2023', 'Ledakan tungku di PT ITSS Morowali menewaskan 21 orang, terdiri atas 13 pekerja Indonesia dan 8 pekerja asing'],
    ['Tuntutan', 'Audit keselamatan menyeluruh, keterwakilan pekerja dalam panitia pembina K3, serta peninjauan upah dan jam kerja']
  ];
  ks.forEach((it, i) => {
    const y = 2.94 + i * 0.71;
    s.addText(it[0], { isTextBox: true, x: px + 0.3, y, w: 1.36, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(it[1], { isTextBox: true, x: px + 1.86, y: y - 0.03, w: w2 - 2.16, h: 0.67, fontFace: F, fontSize: 11, color: '4A3B0E', margin: 0, lineSpacing: 14.5 });
    T.chk('ks ' + it[0], it[1], w2 - 2.16, 0.67, 11, 14.5);
  });

  banner(pres, s, M, 5.96, CW, 0.5, 'Penyerapan tenaga kerja terbesar dan angka kecelakaan kerja tertinggi berlangsung di kawasan yang sama.', ORNG, W, 11.5);
  src(s, 6.62, 'Serikat pekerja nasional, organisasi pemantau keselamatan smelter, dan pemberitaan resmi kecelakaan kerja.');
  s.addNotes('Angka 107 kematian ini yang paling sering luput. Sandingkan dengan angka 166 ribu pekerja di slide sebelumnya.');
}

// ============================================================ 06 beban ekologis
{
  const s = S([{ t: 'Fakta 03', fill: ORNG }, { t: 'Energi dan Hutan', outline: true }]);
  head(s, 'Beban Ekologis Kawasan', 0.96);
  sub(s, 'Pengolahan nikel bertumpu pada pembangkit batu bara di dalam kawasan.', 1.62);

  const st = [
    { v: '16,6', u: 'GW', l: 'Kapasitas PLTU captive nasional pada 2024, dari 5,5 GW pada 2019', fill: INK, vs: 32 },
    { v: '76', u: '%', l: 'Porsi industri nikel dalam seluruh kapasitas PLTU captive nasional', fill: ORNG, vs: 32 },
    { v: '22', u: '%', l: 'Porsi pengolahan nikel 2023 dalam emisi energi dan proses industri nasional', fill: AMBR, vs: 32 },
    { v: '163', u: 'ribu ha', l: 'Tutupan pohon hilang di tiga kabupaten Halmahera sepanjang 2001 sampai 2023', fill: TEAL, vs: 32 }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.16 }, o)));

  fakta(s, M, 4.56, CW, [
    ['Rincian Hutan', 'Halmahera Selatan 79.000 hektare, Halmahera Timur 56.300 hektare, dan Halmahera Tengah 27.900 hektare'],
    ['Rencana Baru', 'Sebanyak 13 dari 18 gigawatt rencana pembangkit batu bara baru dirancang untuk melayani industri nikel'],
    ['Konsekuensi', 'Kapasitas batu bara yang dibangun hari ini mengunci emisi selama tiga dekade masa pakai pembangkitnya']
  ], TEAL, 0.6, 1.74);

  src(s, 6.44, 'Global Forest Watch, lembaga pemantau energi dan iklim, serta organisasi kajian energi dan lingkungan Indonesia.');
  s.addNotes('Ironinya di sini: nikel dijual sebagai bahan transisi energi, tetapi pengolahannya justru menjadi penopang terbesar batu bara captive.');
}

// ============================================================ 07 beban hidrologis
{
  const s = S([{ t: 'Fakta 04', fill: ORNG }, { t: 'Air dan Kesehatan', outline: true }]);
  head(s, 'Beban Hidrologis dan Kesehatan', 0.96);
  sub(s, 'Akibat yang tidak pernah masuk ke dalam neraca ekspor.', 1.62);

  card(pres, s, M, 2.16, w2, 3.5, W, { line: { color: LINE, width: 1 } });
  s.addText('KUALITAS AIR', { isTextBox: true, x: M + 0.32, y: 2.42, w: w2 - 0.64, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: SLATE, margin: 0 });
  s.addText('Sungai di Sekitar Kawasan Weda Bay', { isTextBox: true, x: M + 0.32, y: 2.72, w: w2 - 0.64, h: 0.36, fontFace: F, fontSize: 16, bold: true, color: INK, margin: 0 });
  fakta(s, M + 0.32, 3.2, w2 - 0.64, [
    ['Ake Jira', 'Dinyatakan tidak layak dipakai warga; parameter kualitasnya melampaui baku mutu sungai kelas satu'],
    ['Nikel terlarut', 'Terukur 0,0474 miligram per liter di Sungai Sagea pada pengujian 2024'],
    ['Amonia', 'Terukur 0,1652 di Sagea dan Boki Maruru serta 0,3752 di Kobe, terhadap ambang 0,1 miligram per liter']
  ], TEAL, 0.74, 1.32);

  const px = M + w2 + 0.28;
  card(pres, s, px, 2.16, w2, 3.5, TEAL);
  s.addText('DAMPAK PADA WARGA', { isTextBox: true, x: px + 0.32, y: 2.42, w: w2 - 0.64, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: 'BFEFE4', margin: 0 });
  s.addText('Kesehatan dan Penghidupan', { isTextBox: true, x: px + 0.32, y: 2.72, w: w2 - 0.64, h: 0.36, fontFace: F, fontSize: 16, bold: true, color: W, margin: 0 });
  const dm = [
    ['Kesehatan', 'Fasilitas kesehatan di sekitar kawasan mencatat kenaikan berarti pada infeksi saluran pernapasan'],
    ['Perikanan', 'Nelayan terdorong melaut lebih jauh karena karang, mangrove, dan padang lamun rusak sehingga tangkapan turun'],
    ['Pangan', 'Ketergantungan pangan warga bergeser dari hasil kebun dan laut setempat ke pasokan dari luar daerah']
  ];
  dm.forEach((it, i) => {
    const y = 3.2 + i * 0.74;
    s.addText(it[0], { isTextBox: true, x: px + 0.32, y, w: 1.32, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: 'C6F04A', margin: 0 });
    s.addText(it[1], { isTextBox: true, x: px + 1.8, y: y - 0.03, w: w2 - 2.12, h: 0.7, fontFace: F, fontSize: 11, color: 'DFF3EE', margin: 0, lineSpacing: 14.5 });
    T.chk('dm ' + it[0], it[1], w2 - 2.12, 0.7, 11, 14.5);
  });

  banner(pres, s, M, 5.86, CW, 0.5, 'Biaya kesehatan dan hilangnya penghidupan ditanggung warga, bukan oleh neraca perusahaan pengolah.', LIME, INK, 11.5);
  src(s, 6.52, 'Pengujian kualitas air oleh organisasi lingkungan setempat dan laporan lapangan mengenai kesehatan warga Halmahera Tengah.');
  s.addNotes('Perhatikan angka amonia di Kobe: hampir empat kali ambang batasnya. Itu bukan selisih kecil.');
}

// ============================================================ 08 paradoks kesejahteraan
{
  const s = S([{ t: 'Fakta 05', fill: ORNG }, { t: 'Distribusi Hasil', outline: true }]);
  head(s, 'Paradoks Kesejahteraan Daerah', 0.96);
  sub(s, 'Pertumbuhan tertinggi tidak berpindah menjadi kesejahteraan setempat.', 1.62);

  const st = [
    { v: '16,24', u: '%', l: 'Pertumbuhan ekonomi Kabupaten Morowali sepanjang 2024', fill: LIME, vs: 30 },
    { v: '4,35', u: '%', l: 'Porsi produk domestik regional bruto yang tinggal di Morowali; sisanya mengalir keluar daerah', fill: ORNG, vs: 30 },
    { v: '12,58', u: '%', l: 'Kemiskinan Morowali, di atas rata-rata Sulawesi Tengah sebesar 12,33 persen', fill: INK, vs: 30 },
    { v: '12', u: '%', l: 'Kemiskinan Halmahera Tengah, terhadap rata-rata Maluku Utara sebesar 6,46 persen', fill: TEAL, vs: 30 }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.3 }, o)));

  fakta(s, M, 4.66, CW, [
    ['Morowali Utara', 'Angka kemiskinannya 12,97 persen, juga berada di atas rata-rata provinsinya'],
    ['Arah Aliran', 'Nilai tambah mengalir ke pemodal, penerimaan pusat, dan pasar ekspor, bukan ke ekonomi kabupaten penghasil'],
    ['Ketimpangan', 'Kabupaten dengan pertumbuhan tertinggi di provinsinya sekaligus berada di atas rata-rata kemiskinan']
  ], INK, 0.6, 1.74);

  banner(pres, s, M, 6.44, CW, 0.5, 'Fakta inilah yang paling menekan ketika kasus ini diuji dengan teori keadilan distributif.', AMBR, INK, 11.5);
  s.addNotes('Kalau hanya satu angka yang diingat kelas dari deck ini, angka itu 4,35 persen. Sembilan puluh lima persen nilai tambahnya meninggalkan daerah.');
}

// ============================================================ 09 pihak paling rentan
{
  const s = S([{ t: 'Fakta 06', fill: ORNG }, { t: 'Hulu dan Hilir Rantai', outline: true }]);
  head(s, 'Pihak Paling Rentan', 0.96);
  sub(s, 'Ujung paling lemah dan ujung paling menguntungkan pada satu rantai yang sama.', 1.62);

  card(pres, s, M, 2.16, w2, 3.5, INK);
  pills(pres, s, [{ t: 'Masyarakat Adat', fill: LIME, color: INK }], 2.4, M + 0.3);
  s.addText('O Hongana Manyawa', { isTextBox: true, x: M + 0.3, y: 2.86, w: w2 - 0.6, h: 0.36, fontFace: F, fontSize: 17, bold: true, color: W, margin: 0 });
  faktaGelap(s, M + 0.3, 3.34, w2 - 0.6, [
    ['Populasi', 'Berjumlah sekitar 300 sampai 500 jiwa, hidup berpindah di dalam hutan Halmahera'],
    ['Wilayah', 'Sedikitnya 19 perusahaan tambang beroperasi di lebih dari 40 persen wilayah adat mereka'],
    ['Ancaman', 'Kerusakan habitat, pencemaran air dan tanah, serta penyakit menular yang belum dikenali sistem imun mereka']
  ], LIME, 0.71, 1.16);

  const px = M + w2 + 0.28;
  card(pres, s, px, 2.16, w2, 3.5, LAV);
  pills(pres, s, [{ t: 'Rantai Pasok', fill: INK }], 2.4, px + 0.3);
  s.addText('Konsumen Kendaraan Listrik', { isTextBox: true, x: px + 0.3, y: 2.86, w: w2 - 0.6, h: 0.36, fontFace: F, fontSize: 17, bold: true, color: INK, margin: 0 });
  const rp = [
    ['Jalur', 'Produsen baterai global terhubung secara tidak langsung dengan pengolah nikel di Weda Bay melalui pemasok antara'],
    ['Merek', 'Baterainya tercatat memasok sejumlah produsen kendaraan listrik terkemuka di Amerika, Eropa, dan Asia Timur'],
    ['Penilaian', 'Lembaga kajian ketenagakerjaan menilai hilirisasi nikel belum memenuhi syarat pekerjaan hijau']
  ];
  rp.forEach((it, i) => {
    const y = 3.34 + i * 0.71;
    s.addText(it[0], { isTextBox: true, x: px + 0.3, y, w: 1.16, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: '2E2158', margin: 0 });
    s.addText(it[1], { isTextBox: true, x: px + 1.66, y: y - 0.03, w: w2 - 1.96, h: 0.67, fontFace: F, fontSize: 11, color: '241A46', margin: 0, lineSpacing: 14.5 });
    T.chk('rp ' + it[0], it[1], w2 - 1.96, 0.67, 11, 14.5);
  });

  banner(pres, s, M, 5.86, CW, 0.5, 'Pembeli kendaraan listrik di Eropa dan Amerika berada pada rantai yang sama dengan hutan Halmahera.', ORNG, W, 11.5);
  src(s, 6.52, 'Organisasi advokasi masyarakat adat, laporan penelusuran rantai pasok baterai, dan lembaga kajian ketenagakerjaan hijau.');
  s.addNotes('Slide ini menutup bagian fakta. Dua ujung rantai: 300 sampai 500 jiwa di hulu, jutaan konsumen di hilir.');
}

// ============================================================ 10 dua narasi
{
  const s = S([{ t: 'Narasi', fill: ORNG }, { t: 'Klaim Berhadapan', outline: true }]);
  head(s, 'Dua Narasi Berlawanan', 0.96);

  card(pres, s, M, 1.9, w2, 4.0, ORNG);
  pills(pres, s, [{ t: 'Pendukung', fill: INK }], 2.14, M + 0.3);
  s.addText('Hilirisasi Berdaulat', { isTextBox: true, x: M + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  const pos = [
    ['Nilai Tambah', 'Ekspor produk olahan naik dari 3 menjadi 40 miliar dolar dalam lima tahun'],
    ['Kerja', 'Lebih dari 166 ribu pekerja terserap di dua kawasan industri terpadu'],
    ['Kedaulatan', 'Bijih tidak lagi diekspor mentah untuk diolah dan dinikmati negara lain'],
    ['Transisi', 'Nikel Indonesia disebut sebagai prasyarat rantai pasok baterai global']
  ];
  pos.forEach((n, i) => {
    const y = 3.42 + i * 0.62;
    s.addText(n[0], { isTextBox: true, x: M + 0.3, y, w: 1.44, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(n[1], { isTextBox: true, x: M + 1.86, y: y - 0.03, w: w2 - 2.16, h: 0.56, fontFace: F, fontSize: 11, color: 'FFE0D4', margin: 0, lineSpacing: 14.5 });
    T.chk('pos ' + n[0], n[1], w2 - 2.16, 0.56, 11, 14.5);
  });

  const px = M + w2 + 0.28;
  card(pres, s, px, 1.9, w2, 4.0, INK);
  pills(pres, s, [{ t: 'Penentang', fill: LIME, color: INK }], 2.14, px + 0.3);
  s.addText('Ekstraksi Berbiaya Sosial', { isTextBox: true, x: px + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  const neg = [
    ['Upah', 'Berada di bawah upah minimum setempat sementara biaya hidup dua kali lipat'],
    ['Keselamatan', '107 pekerja meninggal dunia di smelter nikel sepanjang 2019 sampai 2025'],
    ['Lingkungan', '163 ribu hektare tutupan pohon hilang dan sungai melampaui baku mutu'],
    ['Distribusi', 'Sekitar 95 persen nilai tambah regional mengalir keluar dari daerah penghasil']
  ];
  neg.forEach((n, i) => {
    const y = 3.42 + i * 0.62;
    s.addText(n[0], { isTextBox: true, x: px + 0.3, y, w: 1.44, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: LIME, margin: 0 });
    s.addText(n[1], { isTextBox: true, x: px + 1.86, y: y - 0.03, w: w2 - 2.16, h: 0.56, fontFace: F, fontSize: 11, color: 'B9C0CE', margin: 0, lineSpacing: 14.5 });
    T.chk('neg ' + n[0], n[1], w2 - 2.16, 0.56, 11, 14.5);
  });

  banner(pres, s, M, 6.06, CW, 0.78, 'Kedua kolom bersandar pada data resmi yang sama sahnya. Sengketanya bukan sengketa fakta, melainkan sengketa kriteria penilaian.', LIME, INK, 12.5);
  s.addNotes('Kalimat penutup ini yang menjustifikasi seluruh analisis berikutnya. Kalau sengketanya soal kriteria, maka teori nilailah alatnya.');
}

// ============================================================ 11 kerangka
{
  const s = S([{ t: 'Metode', fill: LIME, color: INK }, { t: 'Pendekatan Prisma', outline: true }]);
  head(s, 'Dari Fakta ke Penilaian', 0.96);
  sub(s, 'Kasus tanpa jawaban tunggal menuntut kerangka penilaian yang jamak.', 1.62);

  card(pres, s, M, 2.16, w2, 2.42, W, { line: { color: LINE, width: 1, dashType: 'dash' } });
  s.addText('CARA YANG BIASA', { isTextBox: true, x: M + 0.3, y: 2.4, w: w2 - 0.6, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: SLATE, margin: 0 });
  s.addText('Satu Kriteria Tunggal', { isTextBox: true, x: M + 0.3, y: 2.7, w: w2 - 0.6, h: 0.36, fontFace: F, fontSize: 18, bold: true, color: INK, margin: 0 });
  s.addText('Kasus direduksi menjadi neraca manfaat dan biaya. Kesimpulannya tegas, namun keberatan pihak yang kalah hitung tidak terakomodasi.', {
    isTextBox: true, x: M + 0.3, y: 3.18, w: w2 - 0.66, h: 1.1, fontFace: F, fontSize: 12.5, color: '2A3243', margin: 0, lineSpacing: 18
  });

  const px = M + w2 + 0.28;
  card(pres, s, px, 2.16, w2, 2.42, INK);
  s.addText('CARA CHAPTER 3', { isTextBox: true, x: px + 0.3, y: 2.4, w: w2 - 0.6, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: LIME, margin: 0 });
  s.addText('Sembilan Kriteria Sekaligus', { isTextBox: true, x: px + 0.3, y: 2.7, w: w2 - 0.6, h: 0.36, fontFace: F, fontSize: 18, bold: true, color: W, margin: 0 });
  s.addText('Setiap teori menyoroti dimensi yang luput dari teori lain. Yang dicari pertimbangan yang paling kuat menanggung beban argumen, bukan jawaban tunggal.', {
    isTextBox: true, x: px + 0.3, y: 3.18, w: w2 - 0.66, h: 1.1, fontFace: F, fontSize: 12.5, color: 'E8E4DC', margin: 0, lineSpacing: 18
  });

  s.addText('Sembilan lensa yang dipakai', { isTextBox: true, x: M, y: 4.76, w: CW, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: SLATE, margin: 0 });
  const PENDEK = ['Egoism', 'Utilitarianism', 'Duty', 'Rights', 'Justice', 'Virtue', 'Care', 'Discourse', 'Postmodern'];
  PENDEK.forEach((n, i) => {
    const x = M + (i % 5) * (CW / 5), y = 5.14 + Math.floor(i / 5) * 0.62;
    rect(pres, s, x, y + 0.07, 0.2, 0.2, SPEC[i]);
    s.addText((i + 1) + '. ' + n, { isTextBox: true, x: x + 0.32, y, w: CW / 5 - 0.4, h: 0.32, fontFace: F, fontSize: 12, bold: true, color: INK, margin: 0 });
  });

  banner(pres, s, M, 6.4, CW, 0.52, 'Sembilan penilaian atas satu rangkaian fakta yang identik. Inilah pendekatan prisma.', LIME, INK, 11.5);
  s.addNotes('Batas antara bagian fakta dan bagian penilaian ada di slide ini. Tegaskan bahwa faktanya tidak berubah, hanya kriterianya yang berganti.');
}

// ============================================================ 12 lensa akibat
{
  const s = S([{ t: 'Lensa 1–2', fill: ORNG }, { t: 'Egoism · Utilitarianism', outline: true }]);
  head(s, 'Penilaian Berbasis Akibat', 0.96);
  sub(s, 'Objek penilaiannya hasil tindakan, bukan niat atau prosedurnya.', 1.62);

  lens(s, {
    i: 1, x: M, y: 2.16, w: w2, h: 3.86,
    q: 'Apakah kebijakan ini melayani kepentingan jangka panjang Indonesia dan korporasinya?',
    b: 'Pada horizon pendek jawabannya afirmatif. Ekspor naik dari 3 menjadi 40 miliar dolar, investasi terkumpul 41,5 miliar dolar, dan posisi tawar Indonesia pada rantai pasok baterai menguat.\n\nPada horizon panjang, biaya kesehatan, pemulihan sungai, dan pensiun dini pembangkit batu bara belum terinternalisasi. Kepentingan diri yang dihitung dengan cermat justru menuntut biaya tertunda itu dimasukkan sejak awal.',
    v: 'Netral, batasnya terbuka'
  });
  lens(s, {
    i: 2, x: M + w2 + 0.28, y: 2.16, w: w2, h: 3.86,
    q: 'Bila seluruh akibat bagi semua pihak diagregasi, apakah hasilnya positif?',
    b: 'Act utilitarianism cenderung mendukung. Manfaat 166 ribu lapangan kerja dan penerimaan ekspor bersifat nyata dan terukur, sedangkan kerugiannya tersebar dan sulit dikuantifikasi.\n\nRule utilitarianism menolak. Bila setiap negara pemilik cadangan menempuh pengolahan bertenaga batu bara, tambahan emisinya membatalkan manfaat transisi energi yang justru menjadi pembenar kebijakan ini.',
    v: 'Terbelah'
  });
  banner(pres, s, M, 6.2, CW, 0.5, 'Dua teori sekeluarga menghasilkan kesimpulan berbeda. Pemisahnya semata unit analisis.', LIME, INK, 11.5);
  s.addNotes('Kedua kesimpulan sama sahnya secara internal. Yang membedakan hanya unit analisisnya: tindakan tunggal atau kelas tindakan.');
}

// ============================================================ 13 lensa prinsip
{
  const s = S([{ t: 'Lensa 3–5', fill: LAV, color: INK }, { t: 'Duty · Rights · Justice', outline: true }]);
  head(s, 'Penilaian Berbasis Prinsip', 0.96);
  sub(s, 'Objek penilaiannya kewajiban, hak, dan keadilan distributif.', 1.62);

  lens(s, {
    i: 3, x: M, y: 2.16, w: w3, h: 4.3,
    q: 'Dapatkah maksim kebijakan ini diuniversalkan ke seluruh negara?',
    b: 'Maksimnya: pengolahan boleh dipercepat sambil menunda standar upah, keselamatan, dan lingkungan. Diuniversalkan, standar itu kehilangan daya ikat.\n\nFormulasi kedua pun gagal. Upah di bawah minimum dan lembur 13 jam menjadikan pekerja sarana semata.',
    v: 'Menolak'
  });
  lens(s, {
    i: 4, x: M + w3 + 0.24, y: 2.16, w: w3, h: 4.3,
    q: 'Hak siapa yang terpenuhi, dan hak siapa yang justru terlanggar?',
    b: 'Hak atas pekerjaan terpenuhi bagi 166 ribu pekerja. Sampai titik ini kebijakan tersebut dapat dipertahankan.\n\nNamun hak atas kondisi kerja yang adil, hak atas kesehatan, hak atas air bersih, dan hak masyarakat adat atas tanah leluhur terlanggar bersamaan. Penghormatan hak dituntut pada seluruh relasi bisnis, termasuk pemasok.',
    v: 'Mendukung bersyarat'
  });
  lens(s, {
    i: 5, x: M + 2 * (w3 + 0.24), y: 2.16, w: w3, h: 4.3,
    q: 'Susunan apa yang dipilih tanpa mengetahui posisi yang akan ditempati?',
    b: 'Manfaat mengalir ke penerimaan nasional dan pemodal, sedangkan beban terkonsentrasi pada pekerja kawasan, warga hilir sungai, dan masyarakat adat.\n\nKabupaten penghasil justru lebih miskin daripada rata-rata provinsinya dan hanya 4,35 persen nilai tambah tinggal di daerah. Difference principle menuntut kebalikannya.',
    v: 'Menolak'
  });
  s.addNotes('Rawls adalah lensa paling tajam di sini. Angka 4,35 persen itu yang membuat difference principle langsung gugur.');
}

// ============================================================ 14 lensa konteks
{
  const s = S([{ t: 'Lensa 6–9', fill: LIME, color: INK }, { t: 'Empat Teori Alternatif', outline: true }]);
  head(s, 'Penilaian Berbasis Konteks', 0.96);
  sub(s, 'Objek penilaiannya karakter pelaku, relasi, prosedur, dan bahasa.', 1.62);

  const q = [
    'Bagaimana aktor berkarakter baik bertindak pada posisi ini?',
    'Solusi mana yang memelihara relasi dengan pihak terdampak?',
    'Norma apa yang dapat dirumuskan melalui deliberasi terbuka?',
    'Kepentingan siapa yang dilayani oleh pemilihan istilah?'
  ];
  const b = [
    'Pembandingnya adalah keadaan sebelum hilirisasi, bukan standar industri terbaik yang tersedia. Aktor berkarakter baik mengukur diri pada standar tertinggi yang dapat dicapai.',
    'Warga hilir sungai dan masyarakat adat berjumlah 300 sampai 500 jiwa merupakan pihak berelasi, bukan variabel biaya. Yang dituntut pemulihan dan wilayah lindung, bukan penghentian mendadak.',
    'Warga terdampak bukan pihak dalam perumusan kebijakan maupun perizinan kawasan. Syarat keterlibatan setara dan bebas paksaan tidak terpenuhi sejak awal.',
    'Hilirisasi berkonotasi kemajuan, ekstraksi berkonotasi pengurasan. Nikel hijau dipakai bagi pengolahan yang listriknya bertumpu pada batu bara.'
  ];
  const v = ['Menolak framing', 'Menuntut pemulihan', 'Menolak proses', 'Anti absolut'];
  [6, 7, 8, 9].forEach((n, i) => lens(s, {
    i: n, x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 4.3, q: q[i], b: b[i], v: v[i]
  }));
  s.addNotes('Discourse ethics paling praktis untuk kasus ini karena menyerang cara keputusan dibuat, bukan isinya.');
}

// ============================================================ 15 matriks
{
  const s = S([{ t: 'Sintesis', fill: ORNG }, { t: 'Sembilan Putusan', outline: true }]);
  head(s, 'Matriks Sembilan Lensa', 0.96);

  const rows = [
    ['Egoism', 'Biaya kesehatan, pemulihan sungai, dan pensiun pembangkit belum masuk perhitungan', 'Netral'],
    ['Utilitarianism', 'Act mendukung manfaat kini, rule menolak karena emisinya membatalkan pembenarnya', 'Terbelah'],
    ['Ethics of Duty', 'Menunda standar upah dan keselamatan gagal diuniversalkan ke seluruh negara', 'Menolak'],
    ['Ethics of Rights', 'Hak atas pekerjaan terpenuhi, hak atas kesehatan, air, dan tanah adat terlanggar', 'Bersyarat'],
    ['Justice', 'Kabupaten penghasil lebih miskin daripada provinsinya, 4,35 persen nilai tambah tinggal', 'Menolak'],
    ['Virtue Ethics', 'Pembandingnya keadaan sebelum hilirisasi, bukan standar industri terbaik', 'Menolak framing'],
    ['Ethic of Care', 'Warga hilir dan masyarakat adat merupakan pihak berelasi, bukan variabel biaya', 'Menuntut pemulihan'],
    ['Discourse Ethics', 'Warga terdampak bukan pihak dalam perumusan kebijakan dan perizinan kawasan', 'Menolak proses'],
    ['Postmodern Ethics', 'Istilah hilirisasi dan nikel hijau mendahului penilaian atas fakta di lapangan', 'Anti absolut']
  ];
  rows.forEach((r, i) => {
    const y = 1.88 + i * 0.54;
    card(pres, s, M, y, CW, 0.46, W, { r: 0.08 });
    rect(pres, s, M, y, 0.14, 0.46, SPEC[i]);
    s.addText((i + 1) + '.  ' + r[0], { isTextBox: true, x: M + 0.34, y, w: 2.2, h: 0.46, valign: 'middle', fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(r[1], { isTextBox: true, x: M + 2.64, y, w: 6.8, h: 0.46, valign: 'middle', fontFace: F, fontSize: 11, color: '2A3243', margin: 0 });
    const vc = ['C6F04A', 'F5B722', 'B8A6F5', '4EA8DE', 'E86A9B'].indexOf(SPEC[i]) >= 0 ? mix(SPEC[i], INK, 0.42) : SPEC[i];
    s.addText(r[2], { isTextBox: true, x: M + 9.54, y, w: CW - 9.74, h: 0.46, valign: 'middle', align: 'right', fontFace: F, fontSize: 11.5, bold: true, color: vc, margin: 0 });
  });
  s.addText('Tidak satu pun berbunyi mendukung tanpa syarat. Enam menolak, satu bersyarat, satu terbelah, satu netral karena mengakui batas teorinya sendiri.', {
    isTextBox: true, x: M, y: 6.78, w: CW, h: 0.32, fontFace: F, fontSize: 11.5, italic: true, color: SLATE, margin: 0
  });
  s.addNotes('Pola inilah temuannya. Bukan satu putusan, melainkan konvergensi dari sembilan pintu masuk yang berbeda.');
}

// ============================================================ 16 evaluasi klaim
{
  const s = S([{ t: 'Argumen', fill: ORNG }, { t: 'Empat Proposisi', outline: true }]);
  head(s, 'Evaluasi Klaim Nikel Hijau', 0.96);
  sub(s, 'Empat proposisi yang diturunkan dari kesembilan lensa.', 1.62);

  const pr = [
    [ORNG, 'Perbandingan dengan Masa Lalu Tidak Bernilai Normatif', 'Keadaan yang lebih baik daripada ekspor bijih mentah tidak dengan sendirinya memadai. Virtue ethics menuntut pembanding pada standar tertinggi, bukan pada titik berangkat.'],
    [LAV, 'Klaim Hijau Gugur pada Sumber Energinya', 'Pengolahan yang bertumpu pada pembangkit batu bara di dalam kawasan tidak dapat disebut hijau. Postmodern ethics membaca istilah ini sebagai alat pembenar, bukan deskripsi.'],
    [TEAL, 'Distribusi Manfaat dan Beban Tidak Simetris', 'Hanya 4,35 persen nilai tambah tinggal di daerah, sementara kabupaten penghasil lebih miskin daripada rata-rata provinsinya. Rawls menolak susunan semacam ini.'],
    [INK, 'Prosesnya Cacat Sejak Perumusan', 'Warga terdampak tidak menjadi pihak dalam perizinan dan perencanaan kawasan. Discourse ethics membatalkan hasil yang lahir dari proses semacam itu.']
  ];
  pr.forEach((p, i) => numRow(pres, s, {
    x: M, y: 2.16 + i * 1.06, w: CW, h: 0.96, n: i + 1, fill: p[0], t: p[1], b: p[2]
  }));

  banner(pres, s, M, 6.44, CW, 0.5, 'Penolakan atas klaim nikel hijau tidak setara dengan penolakan atas hilirisasi. Keduanya persoalan terpisah.', LIME, INK, 11.5);
  s.addNotes('Penting: analisis ini menolak klaimnya, bukan menuntut kebijakannya dicabut. Bedakan dua hal itu di depan kelas.');
}

// ============================================================ 17 implikasi
{
  const s = S([{ t: 'Penerapan', fill: LIME, color: INK }, { t: 'Tiga Tindak Lanjut', outline: true }]);
  head(s, 'Implikasi Manajerial', 0.96);

  const im = [
    [ORNG, 'Internalisasi Biaya Tertunda', 'Biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit dimasukkan ke dalam neraca sejak perencanaan, bukan diwariskan ke anggaran publik.'],
    [LAV, 'Hadirkan Pihak yang Absen', 'Pekerja, warga hilir, dan masyarakat adat diberi keterwakilan formal dalam panitia keselamatan, pemantauan lingkungan, dan perizinan kawasan.'],
    [TEAL, 'Uji Klaim dengan Beberapa Teori', 'Klaim yang lolos utilitarianism kerap gugur pada keadilan distributif dan discourse ethics. Sembilan pertimbangan berfungsi sebagai daftar periksa.']
  ];
  im.forEach((p, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.02, w: w3, h: 2.4, fill: p[0], n: '0' + (i + 1), t: p[1], ts: 13.5, b: p[2], bs: 11
  }));

  card(pres, s, M, 4.64, CW, 2.02, INK);
  pills(pres, s, [{ t: 'Kebijakan Berikutnya', fill: LIME, color: INK }], 4.84, M + 0.32);
  s.addText('Ujian yang Sama untuk Bauksit, Tembaga, dan Timah', { isTextBox: true, x: M + 0.32, y: 5.28, w: CW - 0.64, h: 0.34, fontFace: F, fontSize: 17, bold: true, color: W, margin: 0 });
  s.addText('Struktur dilemanya berulang pada setiap komoditas yang dihilirisasi. Manfaat ekonominya besar dan terukur, biaya sosial dan lingkungannya tersebar serta sulit dikuantifikasi, dan narasi pembenarnya selalu tersedia.', {
    isTextBox: true, x: M + 0.32, y: 5.68, w: CW - 0.68, h: 0.52, fontFace: F, fontSize: 12, color: 'B9C0CE', margin: 0, lineSpacing: 17
  });
  s.addText('Siapa menikmati manfaatnya, siapa menanggung bebannya, dan apakah keduanya pihak yang sama?', {
    isTextBox: true, x: M + 0.32, y: 6.26, w: CW - 0.68, h: 0.3, fontFace: F, fontSize: 12.5, bold: true, italic: true, color: LIME, margin: 0
  });
  s.addNotes('Tutup bagian ini dengan pertanyaan Rawls versi Indonesia pada baris terakhir. Itu pertanyaan yang bisa dilempar ke kelas.');
}

// ============================================================ 18 simpulan
{
  const s = S([{ t: 'Penutup', fill: ORNG }, { t: 'Tiga Temuan', outline: true }]);
  head(s, 'Simpulan Analisis', 0.96);

  const tm = [
    [ORNG, 'Konvergensi, Bukan Kesepakatan', 'Sembilan teori berangkat dari premis yang berbeda, namun mayoritasnya bertemu pada arah yang sama. Konvergensi dari titik masuk yang berbeda inilah bukti terkuat yang dapat dihasilkan pluralism.'],
    [LAV, 'Yang Gugur Adalah Klaimnya', 'Yang gugur bukan kebijakan hilirisasinya, melainkan klaim bahwa kebijakan ini sudah etis. Persoalan upah, keselamatan, pemulihan lingkungan, dan sumber energi tetap terbuka untuk diperbaiki.'],
    [INK, 'Kasusnya Belum Selesai', 'Kebijakannya masih berjalan, sengketa dagangnya belum tuntas, dan angkanya berubah setiap tahun. Kasus yang belum selesai justru kasus yang paling layak didiskusikan di kelas.']
  ];
  tm.forEach((t, i) => numRow(pres, s, {
    x: M, y: 2.02 + i * 1.28, w: CW, h: 1.16, n: i + 1, fill: t[0], t: t[1], b: t[2]
  }));

  quote(pres, s, M, 5.94, CW, 0.78,
    'Manfaat yang terukur selalu lebih mudah dipertahankan daripada beban yang tersebar. Justru karena itu beban tersebar perlu dihitung lebih dahulu.');
  s.addNotes('Kalimat penutup ini merangkum seluruh deck. Manfaatnya mudah dihitung, bebannya tidak, dan asimetri itu yang menyesatkan penilaian.');
}

// ============================================================ 19 sumber data
{
  const s = S([{ t: 'Lampiran', fill: LIME, color: INK }, { t: 'Rujukan Data', outline: true }]);
  head(s, 'Sumber Data', 0.96);
  sub(s, 'Data ditelusuri pada Agustus 2026. Periksa ulang bila presentasi mundur beberapa bulan.', 1.62);

  const sr = [
    [ORNG, 'Ekonomi dan Investasi', 'Pengelola Kawasan IMIP dan IWIP untuk investasi dan tenaga kerja\nBadan Pusat Statistik Sulawesi Tengah untuk nilai ekspor dan pertumbuhan\nBadan Pusat Statistik untuk angka kemiskinan kabupaten dan provinsi\nKementerian Perindustrian untuk nilai ekspor produk nikel olahan'],
    [TEAL, 'Lingkungan dan Energi', 'Global Forest Watch untuk kehilangan tutupan pohon Halmahera\nLembaga pemantau energi dan iklim untuk kapasitas PLTU captive\nPengujian kualitas air oleh organisasi lingkungan setempat\nKajian emisi sektor pengolahan logam nasional'],
    [AMBR, 'Ketenagakerjaan', 'Serikat pekerja nasional untuk upah, jam kerja, dan tuntutan pekerja\nOrganisasi pemantau keselamatan smelter untuk data kecelakaan kerja\nLembaga kajian ketenagakerjaan hijau untuk penilaian mutu pekerjaan\nPemberitaan resmi kecelakaan kerja untuk kronologi peristiwa'],
    [INK, 'Kebijakan dan Rantai Pasok', 'Peraturan Menteri ESDM Nomor 11 Tahun 2019 untuk dasar hukum\nDokumen putusan panel penyelesaian sengketa perdagangan\nLaporan penelusuran rantai pasok baterai kendaraan listrik\nOrganisasi advokasi masyarakat adat untuk data O Hongana Manyawa']
  ];
  sr.forEach((p, i) => tile(pres, s, {
    x: M + (i % 2) * (w2 + 0.28), y: 2.16 + Math.floor(i / 2) * 2.14, w: w2, h: 1.98,
    fill: p[0], t: p[1], ts: 15, b: p[2], bs: 10.5
  }));

  s.addNotes('Slide ini tidak perlu dibacakan. Fungsinya menjawab kalau ada yang menanyakan asal angkanya.');
}

// ============================================================ 20 penutup
{
  const s = pres.addSlide();
  bg(s, INK);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, LIME);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, ORNG);
  wave(pres, s, 7.7, 2.4, 5.2, 0.46, '283044');
  page++;

  s.addText([
    { text: 'Terima Kasih', options: { color: W } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 1.9, w: 10, h: 1.5, fontFace: F, fontSize: 62, bold: true, margin: 0, lineSpacing: 68 });

  s.addText('Sembilan lensa atas satu kebijakan yang masih berjalan. Kondisi inilah yang menjadikan kasus ini layak didiskusikan.', {
    isTextBox: true, x: M, y: 3.7, w: 7.6, h: 0.9, fontFace: F, fontSize: 15, color: 'B9C0CE', margin: 0, lineSpacing: 24
  });
  SPEC.forEach((c, i) => rect(pres, s, M + i * 0.42, 4.76, 0.3, 0.3, c));

  card(pres, s, M, 5.5, 4.5, 0.78, '1B2233');
  rect(pres, s, M, 5.56, 0.06, 0.66, LIME);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.65, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: W, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 5.92, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: '8C93A3', margin: 0 });

  rect(pres, s, M, 6.62, CW, 0.011, '283044');
  s.addText('Business Ethics · Analisis Kasus Hilirisasi Nikel', {
    isTextBox: true, x: M, y: 6.78, w: 6.4, h: 0.28, fontFace: F, fontSize: 10.5, bold: true, color: W, margin: 0
  });
  s.addText('MBA · Universitas Gadjah Mada', {
    isTextBox: true, x: SW - M - 6.0, y: 6.78, w: 6.0, h: 0.28, align: 'right', fontFace: F, fontSize: 10.5, color: '8C93A3', margin: 0
  });
  s.addNotes('Buka tanya jawab dengan pertanyaan pada slide implikasi: siapa menikmati manfaatnya, siapa menanggung bebannya.');
}

report('deck 4');
pres.writeFile({ fileName: 'Deck-4-Analisis-Hilirisasi-Nikel.pptx' })
  .then(f => console.log('selesai:', f, '·', page, 'slide'));
