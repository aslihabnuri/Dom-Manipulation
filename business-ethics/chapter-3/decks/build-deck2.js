'use strict';
// DECK 2 — Canada's Oil Sands: kasus dibedah dengan kerangka Chapter 3
const T = require('./theme');
const {
  BG, INK, SLATE, LINE, ORNG, LAV, LIME, AMBR, TEAL, W, F, MONO,
  M, SW, SH, CW,
  bg, card, rect, pills, pillsRight, head, sub, chip, tile, stat, quote,
  banner, numRow, wave, foot, report, mix
} = T;

const pres = T.newDeck('Canada’s Oil Sands', 'Business Ethics Chapter 3 · Analisis Kasus');
let page = 0;

function S(pillItems, opt) {
  const s = pres.addSlide();
  bg(s, (opt && opt.bg) || BG);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, (opt && opt.corner) || TEAL);
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
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, ORNG);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, LIME);
  wave(pres, s, 7.4, 1.2, 5.5, 0.42, '283044');
  page++;

  s.addText('Business Ethics', { isTextBox: true, x: M, y: 0.5, w: 4, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: W, margin: 0 });
  pillsRight(pres, s, [{ t: 'MBA · UGM', fill: ORNG }, { t: 'Case Analysis', fill: '1B2233', color: 'B9C0CE' }], 0.46);

  s.addText('Chapter 3 · Evaluating Business Ethics', { isTextBox: true, x: M, y: 1.62, w: 7.4, h: 0.32, fontFace: F, fontSize: 13.5, color: 'B9C0CE', margin: 0 });
  s.addText('Analisis Kasus —', { isTextBox: true, x: M, y: 1.98, w: 7.4, h: 0.34, fontFace: F, fontSize: 16, bold: true, color: ORNG, margin: 0 });

  s.addText([
    { text: 'Canada’s', options: { color: W, breakLine: true } },
    { text: 'Oil Sands', options: { color: W } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 2.5, w: 8.2, h: 1.74, fontFace: F, fontSize: 54, bold: true, margin: 0, lineSpacing: 60 });

  s.addText('Most Destructive Project on Earth atau Ethical Oil? Satu kasus dibedah dengan sembilan teori etika normatif dari Chapter 3.', {
    isTextBox: true, x: M, y: 4.5, w: 7.3, h: 0.9, fontFace: F, fontSize: 14, color: 'B9C0CE', margin: 0, lineSpacing: 22
  });

  card(pres, s, M, 5.72, 4.5, 0.78, '1B2233');
  rect(pres, s, M, 5.78, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.87, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: W, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 6.14, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: '8C93A3', margin: 0 });

  SPEC.forEach((c, i) => rect(pres, s, M + 5.5 + i * 0.42, 5.94, 0.3, 0.3, c));
  s.addText('Case 3 · Crane, Matten, Glozer & Spence (2019), halaman 129–134', {
    isTextBox: true, x: M, y: 6.86, w: CW, h: 0.28, fontFace: F, fontSize: 10.5, color: '8C93A3', margin: 0
  });
  s.addNotes('Deck ini kebalikan dari deck materi. Di sini kasusnya yang jadi tulang punggung, teorinya dipakai sebagai alat bedah.');
}

// ============================================================ 02 index
{
  const s = S(null);
  head(s, 'Index', 0.62, 40);
  pills(pres, s, [
    { t: 'Kerangka', fill: TEAL },
    { t: 'Kasus', fill: ORNG },
    { t: 'Sembilan Lensa', fill: LAV, color: INK },
    { t: 'Putusan', fill: INK }
  ], 1.42);

  const idx = [
    ['01', 'Kerangka Analisis', 'Kenapa satu teori tidak cukup untuk kasus ini'],
    ['02', 'Profil Oil Sands', 'Apa yang ditambang, seberapa besar, siapa pemainnya'],
    ['03', 'Peta Pemangku Kepentingan', 'Enam pihak dengan kepentingan yang berbenturan'],
    ['04', 'Dua Narasi', 'Most destructive project versus ethical oil'],
    ['05', 'Penilaian Akibat', 'Egoism dan utilitarianism pada kasus'],
    ['06', 'Penilaian Prinsip', 'Duty, rights, dan justice pada kasus'],
    ['07', 'Penilaian Konteks', 'Virtue, care, discourse, postmodern'],
    ['08', 'Matriks Putusan', 'Sembilan sorotan atas fakta yang sama'],
    ['09', 'Evaluasi Klaim', 'Empat proposisi dari hasil analisis'],
    ['10', 'Implikasi Manajerial', 'Pelajaran kasus dan konteks Indonesia']
  ];
  const colW = CW / 2 - 0.2;
  idx.forEach((it, i) => {
    const x = M + (i > 4 ? CW / 2 + 0.2 : 0), y = 2.16 + (i % 5) * 0.88;
    s.addText(it[0] + '.', { isTextBox: true, x, y, w: 0.62, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(it[1], { isTextBox: true, x: x + 0.78, y: y - 0.02, w: colW - 0.78, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(it[2], { isTextBox: true, x: x + 0.78, y: y + 0.27, w: colW - 0.78, h: 0.28, fontFace: F, fontSize: 11.5, color: SLATE, margin: 0 });
    rect(pres, s, x, y + 0.66, colW, 0.011, LINE);
  });
  s.addNotes('Sepuluh bagian. Bagian 5 sampai 7 adalah inti analisisnya, masing-masing memakai teori yang berbeda.');
}

// ============================================================ 03 kerangka analisis
{
  const s = S([{ t: 'Metode', fill: TEAL }, { t: 'Figure 3.2', outline: true }]);
  head(s, 'Kerangka Analisis Pluralis', 0.96);
  sub(s, 'Kasus ini tidak memiliki jawaban tunggal, sehingga dibedah dengan sembilan teori.', 1.62);

  card(pres, s, M, 2.16, w2, 2.5, W, { line: { color: LINE, width: 1, dashType: 'dash' } });
  s.addText('CARA YANG BIASA', { isTextBox: true, x: M + 0.3, y: 2.4, w: w2 - 0.6, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: SLATE, margin: 0 });
  s.addText('Pendekatan Teori Tunggal', { isTextBox: true, x: M + 0.3, y: 2.7, w: w2 - 0.6, h: 0.36, fontFace: F, fontSize: 18, bold: true, color: INK, margin: 0 });
  s.addText('Kasus dipusatkan menjadi satu pertimbangan tunggal. Kesimpulannya rapi, tetapi seluruh keberatan pihak lain hilang dari pandangan dan tidak pernah terjawab.', {
    isTextBox: true, x: M + 0.3, y: 3.18, w: w2 - 0.66, h: 1.16, fontFace: F, fontSize: 12.5, color: '2A3243', margin: 0, lineSpacing: 18
  });

  const px = M + w2 + 0.28;
  card(pres, s, px, 2.16, w2, 2.5, INK);
  s.addText('CARA CHAPTER 3', { isTextBox: true, x: px + 0.3, y: 2.4, w: w2 - 0.6, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: LIME, margin: 0 });
  s.addText('Pendekatan Pluralis', { isTextBox: true, x: px + 0.3, y: 2.7, w: w2 - 0.6, h: 0.36, fontFace: F, fontSize: 18, bold: true, color: W, margin: 0 });
  s.addText('Setiap teori menyinari sisi yang tidak terlihat teori lain. Yang dicari bukan jawaban tunggal, melainkan pertimbangan mana yang paling berat menanggung beban argumen.', {
    isTextBox: true, x: px + 0.3, y: 3.18, w: w2 - 0.66, h: 1.16, fontFace: F, fontSize: 12.5, color: 'E8E4DC', margin: 0, lineSpacing: 18
  });

  s.addText('Sembilan lensa yang akan dijalankan', { isTextBox: true, x: M, y: 4.82, w: CW, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: SLATE, margin: 0 });
  const PENDEK = ['Egoism', 'Utilitarianism', 'Duty', 'Rights', 'Justice', 'Virtue', 'Care', 'Discourse', 'Postmodern'];
  PENDEK.forEach((n, i) => {
    const x = M + (i % 5) * (CW / 5), y = 5.2 + Math.floor(i / 5) * 0.62;
    rect(pres, s, x, y + 0.07, 0.2, 0.2, SPEC[i]);
    s.addText((i + 1) + '. ' + n, { isTextBox: true, x: x + 0.32, y, w: CW / 5 - 0.4, h: 0.32, fontFace: F, fontSize: 12, bold: true, color: INK, margin: 0 });
  });

  banner(pres, s, M, 6.42, CW, 0.52, 'Sembilan sorotan atas satu rangkaian fakta yang sama. Itulah prisma pada Figure 3.2.', LIME, INK, 11.5);
  s.addNotes('Tegaskan sejak awal: tujuan analisis ini bukan memenangkan satu pihak, melainkan memetakan seluruh pertimbangan.');
}

// ============================================================ 04 profil kasus
{
  const s = S([{ t: 'Konteks Kasus', fill: ORNG }, { t: 'Halaman 129–130', outline: true }]);
  head(s, 'Profil Industri Oil Sands', 0.96);
  sub(s, 'Campuran pasir, lempung, air, dan bitumen yang berat dan sangat kental.', 1.62);

  const st = [
    { v: '140', u: 'rb km²', l: 'Luas deposit di Alberta, dengan Fort McMurray sebagai pusat industrinya', fill: ORNG },
    { v: '2,77', u: 'juta', l: 'Barel per hari pada 2017, naik dari 0,5 juta barel pada 1997', fill: LAV },
    { v: '170', u: 'M barel', l: 'Cadangan terbukti Kanada, terbesar ketiga di dunia setelah Venezuela', fill: TEAL },
    { v: '99', u: '%', l: 'Ekspor minyak Kanada yang mengalir ke Amerika Serikat', fill: LIME }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.0, vs: 30 }, o)));

  const tl = [
    ['1920-an', 'Paten pertama untuk proses pemisahan komersial'],
    ['1960-an', 'Operasi komersial dimulai serius, tetapi lambat karena biaya ekstraksi tinggi'],
    ['2000-an', 'Harga minyak melonjak. Shell, Chevron, Total, Exxon, dan CNOOC masuk'],
    ['2012', 'Investasi tahunan memuncak di atas 30 miliar dolar Amerika'],
    ['2018', 'Investasi turun sampai dua pertiga menjadi sekitar 10 miliar dolar per tahun']
  ];
  s.addText('Perjalanan pengembangannya', { isTextBox: true, x: M, y: 4.4, w: CW, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: SLATE, margin: 0 });
  tl.forEach((t, i) => {
    const y = 4.76 + i * 0.42;
    s.addText(t[0], { isTextBox: true, x: M, y, w: 1.3, h: 0.32, fontFace: MONO, fontSize: 11.5, bold: true, color: mix(SPEC[i + 1], INK, 0.34), margin: 0 });
    s.addText(t[1], { isTextBox: true, x: M + 1.5, y, w: CW - 1.5, h: 0.32, fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0 });
    if (i < tl.length - 1) rect(pres, s, M, y + 0.35, CW, 0.011, LINE);
  });
  s.addNotes('Perhatikan paradoksnya: investasi turun sejak 2018, tetapi produksinya terus naik setiap tahun. Ketegangan itulah yang membuat kasus ini belum selesai.');
}

// ============================================================ 05 pemangku kepentingan
{
  const s = S([{ t: 'Aktor', fill: ORNG }, { t: 'Enam Pihak', outline: true }]);
  head(s, 'Peta Pemangku Kepentingan', 0.96);
  sub(s, 'Setiap teori berikutnya memberi bobot berbeda pada keenam pihak ini.', 1.62);

  const pk = [
    [ORNG, 'Pemerintah Alberta', 'Pendapatan pajak, lapangan kerja, dan kedaulatan energi provinsi.'],
    [LAV, 'Perusahaan Minyak', 'Suncor, Syncrude, Shell, Chevron, Total, Exxon, dan CNOOC.'],
    [TEAL, 'Pekerja Fort McMurray', 'Penghidupan langsung 206.000 orang beserta keluarganya.'],
    [AMBR, 'Masyarakat Adat Hilir', 'Air, ikan, dan tanah adat di sepanjang Sungai Athabasca.'],
    [INK, 'Organisasi Lingkungan', 'Sierra Club, Greenpeace, Environmental Defence, Pembina Institute.'],
    ['6C7BE0', 'Generasi Mendatang', 'Menanggung akibat iklim tanpa pernah hadir di meja perundingan.']
  ];
  const wk = (CW - 2 * 0.22) / 3;
  pk.forEach((p, i) => {
    const x = M + (i % 3) * (wk + 0.22), y = 2.16 + Math.floor(i / 3) * 2.1;
    tile(pres, s, { x, y, w: wk, h: 1.9, fill: p[0], n: '0' + (i + 1), t: p[1], ts: 14, b: p[2] });
  });

  banner(pres, s, M, 6.34, CW, 0.5, 'Dua pihak terakhir tidak punya kursi di meja perundingan. Itu titik lemah paling serius dalam kasus ini.', AMBR, INK, 11.5);
  s.addNotes('Tanyakan ke kelas: dari enam pihak ini, siapa yang paling menentukan keputusan, dan siapa yang paling menanggung akibat? Jawabannya tidak sama.');
}

// ============================================================ 06 dua narasi
{
  const s = S([{ t: 'Kasus', fill: ORNG }, { t: 'Halaman 131–133', outline: true }]);
  head(s, 'Dua Narasi Berlawanan', 0.96);

  card(pres, s, M, 1.9, w2, 4.0, INK);
  pills(pres, s, [{ t: 'Penentang', fill: LIME, color: INK }], 2.14, M + 0.3);
  s.addText('Most Destructive Project on Earth', { isTextBox: true, x: M + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  const neg = [
    ['Emisi', '20 persen lebih tinggi daripada minyak konvensional, 10 persen emisi nasional Kanada'],
    ['Limbah', 'Kolam beracun 220 kilometer persegi berisi sekitar 1 triliun liter yang bocor'],
    ['Habitat', 'Hutan boreal seluas Kota New York telah hancur, hanya 11 persen direklamasi'],
    ['Proyeksi', 'Tambahan 50 sampai 150 juta ton emisi per tahun pada 2030']
  ];
  neg.forEach((n, i) => {
    const y = 3.42 + i * 0.62;
    s.addText(n[0], { isTextBox: true, x: M + 0.3, y, w: 1.24, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: LIME, margin: 0 });
    s.addText(n[1], { isTextBox: true, x: M + 1.6, y: y - 0.03, w: w2 - 1.94, h: 0.56, fontFace: F, fontSize: 11, color: 'B9C0CE', margin: 0, lineSpacing: 14.5 });
  });

  const px = M + w2 + 0.28;
  card(pres, s, px, 1.9, w2, 4.0, ORNG);
  pills(pres, s, [{ t: 'Pendukung', fill: INK }], 2.14, px + 0.3);
  s.addText('Ethical Oil', { isTextBox: true, x: px + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  const pos = [
    ['Kerja', '206.000 orang pada 2017, diproyeksikan menjadi 461.000 pada 2027'],
    ['Ekonomi', 'CAD 1,6 triliun sepanjang 2017 sampai 2027, pajak CAD 139 miliar'],
    ['Adat', 'CAD 3,3 miliar mengalir ke 399 perusahaan dari 65 komunitas adat'],
    ['Tata Kelola', 'Diatur secara demokratis, tidak terjerat korupsi seperti produsen lain']
  ];
  pos.forEach((n, i) => {
    const y = 3.42 + i * 0.62;
    s.addText(n[0], { isTextBox: true, x: px + 0.3, y, w: 1.24, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(n[1], { isTextBox: true, x: px + 1.6, y: y - 0.03, w: w2 - 1.94, h: 0.56, fontFace: F, fontSize: 11, color: 'FFE0D4', margin: 0, lineSpacing: 14.5 });
  });

  banner(pres, s, M, 6.06, CW, 0.78, 'Kedua kolom memakai data resmi yang sama sahnya. Sengketa ini bukan sengketa fakta, melainkan sengketa tentang apa yang layak dihitung.', INK, W, 12.5);
  s.addNotes('Kalimat penutup ini yang menjustifikasi seluruh analisis berikutnya. Kalau sengketanya soal nilai, maka teori nilailah alat yang tepat.');
}

// ============================================================ 07 lensa akibat
{
  const s = S([{ t: 'Lensa 1–2', fill: ORNG }, { t: 'Egoism · Utilitarianism', outline: true }]);
  head(s, 'Penilaian Berbasis Akibat', 0.96);
  sub(s, 'Yang dinilai adalah hasil, bukan niat atau prosedurnya.', 1.62);

  lens(s, {
    i: 1, x: M, y: 2.16, w: w2, h: 3.86,
    q: 'Apakah ini kepentingan jangka panjang terbaik bagi Kanada dan perusahaannya?',
    b: 'Jangka pendek, jawabannya iya. Pajak, lapangan kerja, dan kedaulatan energi seluruhnya bertambah.\n\nMasalahnya ada pada kata jangka panjang. Biaya iklim tidak pernah masuk ke dalam harga, karena generasi yang menanggungnya tidak hadir di pasar untuk menawar. Inilah market failure yang diakui egoism sendiri sebagai batas teorinya.',
    v: 'Netral, batasnya terbuka'
  });
  lens(s, {
    i: 2, x: M + w2 + 0.28, y: 2.16, w: w2, h: 3.86,
    q: 'Bila seluruh akibat untuk semua pihak dihitung, apakah kita lebih baik?',
    b: 'Act utilitarianism cenderung mendukung. Manfaat 206.000 pekerjaan hari ini nyata dan terukur, sedangkan kerugiannya tersebar dan sulit dikuantifikasi.\n\nRule utilitarianism menolak. Bila kelas tindakan ini menjadi aturan umum, target Paris menjadi mustahil dan kerugiannya melampaui manfaat mana pun.',
    v: 'Terbelah'
  });
  banner(pres, s, M, 6.2, CW, 0.5, 'Dua teori dari keluarga yang sama, dua kesimpulan berbeda. Yang memisahkan hanya unit analisisnya.', LIME, INK, 11.5);
  s.addNotes('Tekankan bahwa kedua kesimpulan sama-sama sah secara internal. Yang membedakan hanya unit analisisnya: tindakan tunggal atau kelas tindakan.');
}

// ============================================================ 08 lensa prinsip
{
  const s = S([{ t: 'Lensa 3–5', fill: LAV, color: INK }, { t: 'Duty · Rights · Justice', outline: true }]);
  head(s, 'Penilaian Berbasis Prinsip', 0.96);
  sub(s, 'Yang dinilai adalah kewajiban, hak, dan keadilan distribusinya.', 1.62);

  lens(s, {
    i: 3, x: M, y: 2.16, w: w3, h: 4.3,
    q: 'Apa yang terjadi bila setiap negara bertindak seperti Kanada?',
    b: 'Kanada memegang cadangan terbukti terbesar ketiga. Bila Venezuela, Arab Saudi, Iran, dan Irak menerapkan prinsip yang sama, tidak ada anggaran karbon yang tersisa.\n\nMaksim ini gagal diuniversalkan. Itu cukup untuk membatalkannya menurut Kant.',
    v: 'Menolak'
  });
  lens(s, {
    i: 4, x: M + w3 + 0.24, y: 2.16, w: w3, h: 4.3,
    q: 'Hak siapa yang perlu dipertimbangkan, dan apakah martabatnya dihormati?',
    b: 'Pasal 23 UDHR mendukung: hak atas pekerjaan dan kondisi kerja yang adil terpenuhi bagi 206.000 orang.\n\nNamun hak atas kesehatan komunitas hilir Athabasca dan hak atas tanah adat menentang. Prinsip Ruggie menuntut perusahaan menghormati hak lewat seluruh relasi bisnisnya.',
    v: 'Mendukung bersyarat'
  });
  lens(s, {
    i: 5, x: M + 2 * (w3 + 0.24), y: 2.16, w: w3, h: 4.3,
    q: 'Aturan apa yang Anda pilih bila tidak tahu akan terlahir sebagai siapa?',
    b: 'Manfaatnya tersebar secara nasional, bebannya terkonsentrasi pada komunitas hilir dan generasi mendatang.\n\nKriteria pertama Rawls tidak terpenuhi: kebebasan dasar atas air bersih dan kesehatan tidak terwujud sama rata, sehingga ketimpangan berikutnya tidak boleh dibenarkan.',
    v: 'Menolak'
  });
  s.addNotes('Rawls adalah lensa paling tajam di sini. Ingat urutan kriterianya: kebebasan dasar dulu, baru difference principle.');
}

// ============================================================ 09 lensa alternatif
{
  const s = S([{ t: 'Lensa 6–9', fill: LIME, color: INK }, { t: 'Empat Teori Alternatif', outline: true }]);
  head(s, 'Penilaian Berbasis Konteks', 0.96);
  sub(s, 'Yang dinilai adalah karakter pelaku, relasi, proses, dan bahasanya.', 1.62);

  const q = [
    'Apa yang akan dilakukan orang yang layak dan jujur dalam posisi ini?',
    'Bagaimana perasaan pihak lain, dan solusi mana yang memelihara relasi?',
    'Norma apa yang dapat disusun bersama lewat komunikasi yang terbuka?',
    'Siapa yang diuntungkan oleh istilah yang dipakai untuk menyebut hal ini?'
  ];
  const b = [
    'Mengukur diri terhadap negara terburuk adalah perbandingan ke bawah. Orang yang berbudi mengukur diri terhadap yang terbaik.',
    'Komunitas hilir dan generasi mendatang adalah pihak yang berelasi, bukan variabel biaya. Yang dituntut adalah transisi yang adil, bukan penghentian mendadak.',
    'Label ethical oil lahir dari kampanye berdana industri. Syarat imparsialitas dan tanpa manipulasi persuasif gagal dipenuhi sejak awal.',
    'Oil sands terdengar netral, tar sands terdengar kotor. Perebutan istilah ini membuktikan bahasa ikut membentuk penilaian moral.'
  ];
  const v = ['Menolak framing', 'Transisi adil', 'Menolak proses', 'Anti absolut'];
  [6, 7, 8, 9].forEach((n, i) => lens(s, {
    i: n, x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 4.3, q: q[i], b: b[i], v: v[i]
  }));
  s.addNotes('Discourse ethics adalah lensa yang paling praktis untuk sengketa lingkungan korporasi, karena menyerang cara keputusan dibuat, bukan isinya.');
}

// ============================================================ 10 matriks putusan
{
  const s = S([{ t: 'Sintesis', fill: ORNG }, { t: 'Sembilan Putusan', outline: true }]);
  head(s, 'Matriks Sembilan Lensa', 0.96);

  const rows = [
    ['Egoism', 'Biaya iklim tidak pernah masuk harga karena generasi mendatang tidak hadir di pasar', 'Netral'],
    ['Utilitarianism', 'Act mendukung manfaat hari ini, rule menolak karena target Paris menjadi mustahil', 'Terbelah'],
    ['Ethics of Duty', 'Prinsipnya gagal diuniversalkan ke seluruh negara pemilik cadangan terbesar', 'Menolak'],
    ['Ethics of Rights', 'Hak atas pekerjaan terpenuhi, hak atas kesehatan dan tanah adat dilanggar', 'Bersyarat'],
    ['Justice', 'Manfaat tersebar, beban terkonsentrasi. Kriteria pertama Rawls tidak terpenuhi', 'Menolak'],
    ['Virtue Ethics', 'Mengukur diri terhadap negara terburuk adalah perbandingan ke bawah', 'Menolak framing'],
    ['Ethic of Care', 'Komunitas hilir dan generasi mendatang adalah relasi, bukan variabel biaya', 'Transisi adil'],
    ['Discourse Ethics', 'Label ethical oil lahir dari kampanye berdana industri, imparsialitas gagal', 'Menolak proses'],
    ['Postmodern Ethics', 'Perebutan istilah oil sands dan tar sands membuktikan bahasa membentuk moral', 'Anti absolut']
  ];
  rows.forEach((r, i) => {
    const y = 1.88 + i * 0.54;
    card(pres, s, M, y, CW, 0.46, W, { r: 0.08 });
    rect(pres, s, M, y, 0.14, 0.46, SPEC[i]);
    s.addText((i + 1) + '.  ' + r[0], { isTextBox: true, x: M + 0.34, y, w: 2.2, h: 0.46, valign: 'middle', fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(r[1], { isTextBox: true, x: M + 2.64, y, w: 7.0, h: 0.46, valign: 'middle', fontFace: F, fontSize: 11, color: '2A3243', margin: 0 });
    const vc = ['C6F04A', 'F5B722', 'B8A6F5', '4EA8DE', 'E86A9B'].indexOf(SPEC[i]) >= 0 ? mix(SPEC[i], INK, 0.42) : SPEC[i];
    s.addText(r[2], { isTextBox: true, x: M + 9.74, y, w: CW - 9.94, h: 0.46, valign: 'middle', align: 'right', fontFace: F, fontSize: 11.5, bold: true, color: vc, margin: 0 });
  });
  s.addText('Tidak satu pun berbunyi mendukung tanpa syarat. Enam dari sembilan menolak, dua bersyarat, satu netral karena mengakui batasnya sendiri.', {
    isTextBox: true, x: M, y: 6.78, w: CW, h: 0.32, fontFace: F, fontSize: 11.5, italic: true, color: SLATE, margin: 0
  });
  s.addNotes('Pola inilah temuannya. Bukan satu putusan, melainkan konvergensi: sembilan pintu masuk berbeda menghasilkan arah yang mirip.');
}

// ============================================================ 11 menguji ethical oil
{
  const s = S([{ t: 'Argumen', fill: ORNG }, { t: 'Empat Proposisi', outline: true }]);
  head(s, 'Evaluasi Klaim Ethical Oil', 0.96);
  sub(s, 'Empat proposisi yang lahir dari kesembilan lensa di atas.', 1.62);

  const pr = [
    [ORNG, 'Perbandingan ke Bawah Bukan Argumen Moral', 'Bahwa Venezuela dan Arab Saudi lebih buruk tidak membuat tindakan Kanada menjadi benar. Virtue ethics menyebutnya mengukur diri pada standar terendah.'],
    [LAV, 'Cacat Prosedural Sejak Awal', 'Label ethical oil lahir dari kampanye berdana industri. Discourse ethics membatalkannya karena syarat imparsialitas gagal sejak awal.'],
    [TEAL, 'Beban dan Manfaat Jatuh pada Pihak Berbeda', 'Manfaat tersebar nasional, beban terkonsentrasi pada komunitas hilir dan generasi mendatang. Rawls menolak susunan seperti ini.'],
    [INK, 'Prinsipnya Runtuh Ketika Diuniversalkan', 'Bila seluruh pemilik cadangan terbesar berbuat sama, tidak ada anggaran karbon yang tersisa. Uji Kant gagal di titik ini.']
  ];
  pr.forEach((p, i) => numRow(pres, s, {
    x: M, y: 2.16 + i * 1.06, w: CW, h: 0.96, n: i + 1, fill: p[0], t: p[1], b: p[2]
  }));

  banner(pres, s, M, 6.44, CW, 0.5, 'Menolak klaim ethical oil bukan berarti menuntut penghentian mendadak. Itu pertanyaan yang berbeda.', LIME, INK, 11.5);
  s.addNotes('Penting: analisis ini menolak klaimnya, bukan menuntut penutupan industrinya. Bedakan dua hal itu di depan kelas.');
}

// ============================================================ 12 implikasi
{
  const s = S([{ t: 'Penerapan', fill: TEAL }, { t: 'Pelajaran Kasus', outline: true }]);
  head(s, 'Implikasi Manajerial', 0.96);

  const im = [
    [ORNG, 'Uji dengan Beberapa Teori', 'Klaim yang lolos satu teori sering runtuh pada teori kedua. Sembilan pertimbangan pada Tabel 3.8 adalah daftar periksa, bukan rencana sepuluh langkah.'],
    [LAV, 'Identifikasi Pihak Absen', 'Generasi mendatang dan komunitas hilir tidak punya kursi. Keputusan yang mengabaikan mereka rapuh secara moral sekaligus secara reputasi.'],
    [TEAL, 'Cermati Pilihan Istilah', 'Oil sands atau tar sands, hilirisasi atau ekstraksi. Pilihan kata menentukan penilaian sebelum datanya sempat dibaca.']
  ];
  im.forEach((p, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.02, w: w3, h: 2.36, fill: p[0], n: '0' + (i + 1), t: p[1], ts: 13.5, b: p[2], bs: 11
  }));

  card(pres, s, M, 4.6, CW, 2.06, INK);
  pills(pres, s, [{ t: 'Konteks Indonesia', fill: LIME, color: INK }], 4.8, M + 0.32);
  s.addText('Hilirisasi Nikel di Morowali dan Weda Bay', { isTextBox: true, x: M + 0.32, y: 5.24, w: CW - 0.64, h: 0.34, fontFace: F, fontSize: 17, bold: true, color: W, margin: 0 });
  s.addText('Strukturnya nyaris identik. Manfaat ekonominya besar dan terukur, biaya lingkungan dan sosialnya tersebar dan sulit dikuantifikasi. Narasi pembenarnya pun sama: nikel Indonesia dibutuhkan untuk transisi energi dunia.', {
    isTextBox: true, x: M + 0.32, y: 5.64, w: CW - 0.68, h: 0.52, fontFace: F, fontSize: 12, color: 'B9C0CE', margin: 0, lineSpacing: 17
  });
  s.addText('Apakah narasi nikel yang etis lolos dari uji yang baru saja kita jalankan?', {
    isTextBox: true, x: M + 0.32, y: 6.24, w: CW - 0.68, h: 0.3, fontFace: F, fontSize: 12.5, bold: true, italic: true, color: LIME, margin: 0
  });
  s.addNotes('Tutup bagian ini dengan pertanyaan Rawls versi Indonesia: siapa yang menikmati manfaatnya, siapa yang menanggung bebannya, dan apakah keduanya pihak yang sama?');
}

// ============================================================ 13 kesimpulan
{
  const s = S([{ t: 'Penutup', fill: ORNG }, { t: 'Tiga Temuan', outline: true }]);
  head(s, 'Simpulan Analisis', 0.96);

  const tm = [
    [ORNG, 'Konvergensi, Bukan Kesepakatan', 'Sembilan teori berangkat dari premis yang berbeda, namun enam di antaranya tiba pada arah yang sama. Konvergensi dari pintu masuk yang berbeda itulah bukti terkuat yang bisa dihasilkan pluralism.'],
    [LAV, 'Klaimnya yang Gugur', 'Yang runtuh bukan industrinya, melainkan klaim bahwa industri ini etis. Pertanyaan tentang transisi, kompensasi, dan reklamasi masih terbuka dan tetap perlu dijawab.'],
    [INK, 'Prisma Bekerja pada Kasus Nyata', 'Satu lensa akan memberi jawaban yang rapi dan menyesatkan. Prisma memberi spektrum yang tidak nyaman, tetapi dapat dipertanggungjawabkan kepada seluruh pihak yang terdampak.']
  ];
  tm.forEach((t, i) => numRow(pres, s, {
    x: M, y: 2.02 + i * 1.28, w: CW, h: 1.16, n: i + 1, fill: t[0], t: t[1], b: t[2]
  }));

  quote(pres, s, M, 5.9, CW, 0.92,
    'Keputusan yang baik bukan yang menemukan teori paling benar, melainkan yang menyadari seluruh spektrum pertimbangan.',
    'Pesan utama Figure 3.2 · Crane et al. (2019)');
  s.addNotes('Ini jawaban atas pertanyaan pembuka. Setelah sembilan teori kita tetap tidak punya satu jawaban, dan itu memang yang dijanjikan bab ini.');
}

// ============================================================ 14 penutup
{
  const s = pres.addSlide();
  bg(s, INK);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, ORNG);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, LIME);
  wave(pres, s, 7.7, 2.4, 5.2, 0.46, '283044');
  page++;

  s.addText([
    { text: 'Terima Kasih', options: { color: W } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 1.9, w: 10, h: 1.5, fontFace: F, fontSize: 62, bold: true, margin: 0, lineSpacing: 68 });

  s.addText('Sembilan lensa, satu kasus, dan tidak ada satu jawaban. Itulah yang membuat kasus ini layak didiskusikan.', {
    isTextBox: true, x: M, y: 3.7, w: 7.6, h: 0.9, fontFace: F, fontSize: 15, color: 'B9C0CE', margin: 0, lineSpacing: 24
  });
  SPEC.forEach((c, i) => rect(pres, s, M + i * 0.42, 4.76, 0.3, 0.3, c));

  card(pres, s, M, 5.5, 4.5, 0.78, '1B2233');
  rect(pres, s, M, 5.56, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.65, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: W, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 5.92, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: '8C93A3', margin: 0 });

  rect(pres, s, M, 6.62, CW, 0.011, '283044');
  s.addText('Business Ethics · Analisis Kasus Canada’s Oil Sands', {
    isTextBox: true, x: M, y: 6.78, w: 6.4, h: 0.28, fontFace: F, fontSize: 10.5, bold: true, color: W, margin: 0
  });
  s.addText('Crane, Matten, Glozer & Spence (2019) · Case 3, halaman 129–134', {
    isTextBox: true, x: SW - M - 6.0, y: 6.78, w: 6.0, h: 0.28, align: 'right', fontFace: F, fontSize: 10.5, color: '8C93A3', margin: 0
  });
  s.addNotes('Buka sesi tanya jawab dengan pertanyaan Rawls: aturan apa yang Anda pilih bila tidak tahu akan terlahir sebagai siapa?');
}

report('deck 2');
pres.writeFile({ fileName: 'Deck-2-Analisis-Kasus-Oil-Sands.pptx' })
  .then(f => console.log('selesai:', f, '·', page, 'slide'));
