'use strict';
// DECK 1 — Evaluating Business Ethics: pembahasan materi + pembahasan kasus
const T = require('./theme');
const {
  BG, INK, SLATE, LINE, ORNG, LAV, LIME, AMBR, TEAL, W, F, MONO,
  M, SW, SH, CW,
  bg, card, rect, pills, pillsRight, head, sub, chip, tile, stat, quote,
  banner, numRow, wave, corners, foot, brand, report, mix
} = T;

const pres = T.newDeck('Evaluating Business Ethics', 'Business Ethics Chapter 3');
let page = 0;

// slide standar: latar, pill, hiasan sudut, nomor halaman
function S(pillItems, opt) {
  const s = pres.addSlide();
  bg(s, (opt && opt.bg) || BG);
  if (!opt || !opt.plain) rect(pres, s, SW - 0.62, 0, 0.62, 0.58, (opt && opt.corner) || ORNG);
  if (pillItems) pills(pres, s, pillItems);
  page++;
  if (!opt || opt.foot !== false) foot(s, page, (opt && opt.footColor) || SLATE);
  return s;
}

const CO = { ORNG, LAV, LIME, AMBR, TEAL, INK, W };
const w3 = (CW - 2 * 0.24) / 3;
const w4 = (CW - 3 * 0.2) / 4;
const w2 = (CW - 0.28) / 2;

// ============================================================ 01 sampul
{
  const s = pres.addSlide();
  bg(s);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, ORNG);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, LIME);
  wave(pres, s, 7.0, 1.15, 5.9, 0.42);
  page++;

  s.addText('Business Ethics', { isTextBox: true, x: M, y: 0.5, w: 4, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
  pillsRight(pres, s, [
    { t: 'MBA · UGM', fill: ORNG },
    { t: 'Chapter 3', outline: true }
  ], 0.46);

  sub(s, 'Crane, Matten, Glozer & Spence (2019) · Business Ethics, edisi kelima', 1.62, 7.4);
  s.addText('Pembahasan Materi & Kasus —', { isTextBox: true, x: M, y: 1.95, w: 7.4, h: 0.34, fontFace: F, fontSize: 16, bold: true, color: ORNG, margin: 0 });

  s.addText([
    { text: 'Evaluating Business', options: { color: INK, breakLine: true } },
    { text: 'Ethics', options: { color: INK } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 2.48, w: 8.2, h: 1.72, fontFace: F, fontSize: 52, bold: true, margin: 0, lineSpacing: 58 });

  sub(s, 'Sembilan teori etika normatif dan bagaimana kesembilannya membaca satu kasus yang sama: Canada’s Oil Sands.', 4.5, 7.3, SLATE, 14, 0.86);

  card(pres, s, M, 5.72, 4.5, 0.78, W);
  rect(pres, s, M, 5.78, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.87, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 6.14, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: SLATE, margin: 0 });

  s.addText('Case 3 · Canada’s Oil Sands · halaman 129–134', {
    isTextBox: true, x: M, y: 6.86, w: CW, h: 0.28, fontFace: F, fontSize: 10.5, color: SLATE, margin: 0
  });
  s.addNotes('Buka dengan pertanyaan cepat ke kelas: menurut Anda, apakah minyak bisa disebut etis? Simpan jawabannya, kita ulang di akhir sesi.');
}

// ============================================================ 02 index
{
  const s = S(null);
  head(s, 'Index', 0.62, 40);
  pills(pres, s, [
    { t: 'Teori', fill: ORNG },
    { t: 'Teori Barat', fill: LAV, color: INK },
    { t: 'Alternatif', fill: LIME, color: INK },
    { t: 'Kasus', fill: INK }
  ], 1.42);

  const idx = [
    ['01', 'Urgensi Teori Etika', 'Dasar penalaran bagi keputusan bisnis'],
    ['02', 'Tiga Posisi Moral', 'Absolutism, relativism, pluralism'],
    ['03', 'Taksonomi Teori', 'Consequentialist dan principle-based'],
    ['04', 'Ethical Dilemma 3', 'Kasus penguji yang dipakai sepanjang bab'],
    ['05', 'Teori Consequentialist', 'Ethical egoism dan utilitarianism'],
    ['06', 'Teori Principle-based', 'Duty, rights, dan justice'],
    ['07', 'Kritik dan Keterbatasan', 'Batas teori Barat modern'],
    ['08', 'Perspektif Alternatif', 'Virtue, care, discourse, postmodern'],
    ['09', 'Dari Lensa ke Prisma', 'Pesan utama Chapter 3'],
    ['10', 'Canada’s Oil Sands', 'Sembilan teori diuji pada satu kasus']
  ];
  const colW = CW / 2 - 0.2;
  idx.forEach((it, i) => {
    const x = M + (i > 4 ? CW / 2 + 0.2 : 0), y = 2.16 + (i % 5) * 0.88;
    s.addText(it[0] + '.', { isTextBox: true, x, y, w: 0.62, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(it[1], { isTextBox: true, x: x + 0.78, y: y - 0.02, w: colW - 0.78, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(it[2], { isTextBox: true, x: x + 0.78, y: y + 0.27, w: colW - 0.78, h: 0.28, fontFace: F, fontSize: 11.5, color: SLATE, margin: 0 });
    rect(pres, s, x, y + 0.66, colW, 0.011, LINE);
  });
  s.addNotes('Sepuluh bagian, tiga puluh menit. Bagian 1 sampai 9 membahas materi, bagian 10 menerapkannya pada kasus.');
}

// ============================================================ 03 kenapa teori etika
{
  const s = S([{ t: 'Peran Teori', fill: ORNG }, { t: 'Halaman 86–88', outline: true }]);
  head(s, 'Urgensi Teori Etika Normatif', 0.96);
  sub(s, 'Keputusan bisnis harus bisa dipertahankan di hadapan pihak yang menanggung akibatnya.', 1.62);

  const items = [
    [ORNG, 'Kompleksitas Konteks', 'Perusahaan yang masuk ke negara berkembang menghadapi suap, standar kerja rendah, dan diskriminasi.'],
    [LAV, 'Kewajiban Justifikasi', 'Manajer perlu membenarkan pilihannya kepada pemegang saham, karyawan, dan masyarakat luas.'],
    [INK, 'Kritik Menuntut Landasan', 'Pihak yang menyebut sebuah perusahaan tidak etis memerlukan landasan yang sama kuatnya.']
  ];
  items.forEach((it, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.16, w: w3, h: 2.34, fill: it[0], n: '0' + (i + 1), t: it[1], b: it[2]
  }));

  quote(pres, s, M, 4.7, CW, 1.66,
    'Normative ethical theories adalah aturan, prinsip, dan pendekatan yang menentukan mana yang benar dan mana yang salah.',
    'Crane et al. (2019) · halaman 87');
  s.addNotes('Tiga manfaat teori etika menurut buku: merasionalisasi firasat, memungkinkan wacana antara orang dengan nilai berbeda, dan memperjelas praanggapan moral para pihak.');
}

// ============================================================ 04 tiga sikap moral
{
  const s = S([{ t: 'Posisi Moral', fill: ORNG }, { t: 'Halaman 89–91', outline: true }]);
  head(s, 'Absolutism, Relativism, Pluralism', 0.96);
  sub(s, 'Buku ini berdiri di posisi yang ketiga.', 1.62);

  const pos = [
    [AMBR, 'Absolutism', 'Ada prinsip moral abadi yang berlaku universal. Benar dan salah adalah kualitas objektif yang dapat ditentukan secara rasional.'],
    [TEAL, 'Relativism', 'Moralitas bergantung pada konteks dan bersifat subjektif. Tidak ada benar dan salah yang berlaku di mana saja.'],
    [LAV, 'Pluralism', 'Nilai yang tidak sepadan dapat sama-sama sah dan perlu ditoleransi, tanpa menyamakan seluruh perspektif.']
  ];
  pos.forEach((it, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.16, w: w3, h: 2.42, fill: it[0], n: '0' + (i + 1), t: it[1], b: it[2]
  }));

  banner(pres, s, M, 4.78, CW, 0.78, 'Pluralism bukan berarti semua pendapat sama benar. Konflik antarperspektif tetap harus dihadapi, bukan didiamkan.', LIME, INK);
  quote(pres, s, M, 5.74, CW, 0.94,
    'Kelemahannya: pluralism dikhawatirkan terlalu toleran. Sebagian praktik memang keliru dan tidak layak ditoleransi.',
    'Liu (2018)', LAV);
  s.addNotes('Absolutism dituduh kaku, relativism dituduh membiarkan apa saja. Pluralism mencoba mengambil jalan tengah dan itulah posisi buku ini.');
}

// ============================================================ 05 dua keluarga teori
{
  const s = S([{ t: 'Teori Barat Modern', fill: ORNG }, { t: 'Tabel 3.1', outline: true }]);
  head(s, 'Taksonomi Teori Barat Modern', 0.96);
  sub(s, 'Lahir dari Pencerahan abad ke-18, menawarkan satu aturan untuk segala situasi.', 1.62);

  tile(pres, s, { x: M, y: 2.16, w: w2, h: 1.9, fill: ORNG, t: 'Consequentialist', ts: 18, b: 'Menilai moralitas dari hasil sebuah tindakan. Hasil yang diinginkan berarti tindakannya benar.' });
  tile(pres, s, { x: M + w2 + 0.28, y: 2.16, w: w2, h: 1.9, fill: INK, t: 'Principle-based', ts: 18, b: 'Menilai moralitas dari prinsip dan prosedur memperolehnya. Mengutamakan apa yang benar, bukan yang diinginkan.' });

  const fam = [
    [ORNG, 'Ethical Egoism', 'Hobbes · Rand'],
    [ORNG, 'Utilitarianism', 'Bentham · Mill'],
    [INK, 'Ethics of Duties', 'Immanuel Kant'],
    [INK, 'Rights & Justice', 'Locke · Rousseau · Rawls']
  ];
  fam.forEach((it, i) => {
    const x = M + i * (w4 + 0.2);
    card(pres, s, x, 4.24, w4, 1.14, W);
    rect(pres, s, x, 4.24, w4, 0.07, it[0]);
    s.addText(it[1], { isTextBox: true, x: x + 0.24, y: 4.52, w: w4 - 0.48, h: 0.3, fontFace: F, fontSize: 13.5, bold: true, color: INK, margin: 0 });
    s.addText(it[2], { isTextBox: true, x: x + 0.24, y: 4.86, w: w4 - 0.48, h: 0.3, fontFace: F, fontSize: 11, color: SLATE, margin: 0 });
  });

  banner(pres, s, M, 5.58, CW, 1.08, 'Konsep manusianya berbeda. Consequentialist memandang manusia digerakkan hasrat dan kesejahteraan; principle-based memandang manusia sebagai aktor moral rasional yang punya martabat.', INK, W, 13.5);
  s.addNotes('Tabel 3.1 halaman 92 membandingkan keduanya pada kontributor, fokus, dan konsep manusia. Tekankan kolom konsep manusia karena itulah akar perbedaannya.');
}

// ============================================================ 06 ethical dilemma 3
{
  const s = S([{ t: 'Producing Toys', fill: ORNG }, { t: 'Halaman 94', outline: true }]);
  head(s, 'Ethical Dilemma 3', 0.96);
  sub(s, 'Satu kasus dipakai untuk menguji seluruh teori sepanjang bab ini.', 1.62);

  const lw = 7.0;
  card(pres, s, M, 2.16, lw, 3.36, INK);
  s.addText('Situasinya', { isTextBox: true, x: M + 0.32, y: 2.4, w: lw - 0.64, h: 0.3, fontFace: F, fontSize: 11, bold: true, charSpacing: 1, color: LIME, margin: 0 });
  s.addText([
    { text: 'Anda product manager perusahaan kembang gula yang menyertakan mainan plastik. Di Thailand Anda memperoleh harga sepertiga dari pemasok Portugal dengan kualitas setara.', options: { breakLine: true } },
    { text: 'Saat meninjau produksi, tidak ada bengkel kerja. Komponen dibawa pulang oleh sekitar 30 pria. Di sebuah bangunan seperti garasi, satu keluarga merakit mainan: ayah, ibu, dan enam anak berusia 5 sampai 14 tahun.', options: { breakLine: true } },
    { text: 'Ketika membeli suvenir untuk keponakan Anda yang berusia 5 dan 7 tahun, Anda mulai mempertanyakan semuanya.' }
  ], { isTextBox: true, x: M + 0.32, y: 2.76, w: lw - 0.68, h: 2.5, fontFace: F, fontSize: 12.5, color: 'E8E4DC', margin: 0, lineSpacing: 19, paraSpaceAfter: 8 });

  const rx = M + lw + 0.28, rw = CW - lw - 0.28;
  card(pres, s, rx, 2.16, rw, 1.62, W);
  s.addText('Dua Pertanyaan Buku', { isTextBox: true, x: rx + 0.3, y: 2.38, w: rw - 0.6, h: 0.3, fontFace: F, fontSize: 13.5, bold: true, color: INK, margin: 0 });
  s.addText([
    { text: 'Apa reaksi spontan Anda sebagai product manager?', options: { bullet: true, breakLine: true } },
    { text: 'Nilai atau prinsip apa yang membuat Anda bereaksi begitu?', options: { bullet: true } }
  ], { isTextBox: true, x: rx + 0.34, y: 2.74, w: rw - 0.7, h: 0.9, fontFace: F, fontSize: 12, color: '2A3243', margin: 0, lineSpacing: 17, paraSpaceAfter: 6 });

  card(pres, s, rx, 3.92, rw, 1.6, LIME);
  s.addText([
    { text: '9', options: { fontSize: 42, bold: true, color: INK } },
    { text: '  teori', options: { fontSize: 16, bold: true, color: INK } }
  ], { isTextBox: true, x: rx + 0.3, y: 4.12, w: rw - 0.6, h: 0.7, fontFace: F, margin: 0 });
  s.addText('menghasilkan sembilan jawaban berbeda atas rangkaian fakta yang persis sama.', {
    isTextBox: true, x: rx + 0.3, y: 4.86, w: rw - 0.6, h: 0.56, fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0, lineSpacing: 15
  });

  banner(pres, s, M, 5.7, CW, 0.82, 'Simpan reaksi pertama Anda. Di akhir sesi kita bandingkan dengan hasil setelah kesembilan teori dijalankan.', ORNG, W);
  s.addNotes('Minta dua sampai tiga mahasiswa menyebutkan reaksi spontan mereka. Catat di papan, jangan dikomentari dulu.');
}

// ============================================================ 07 ethical egoism
{
  const s = S([{ t: 'Teori 01', fill: ORNG }, { t: 'Consequentialist', outline: true }]);
  head(s, 'Ethical Egoism', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Sebuah tindakan benar secara moral apabila mendorong kepentingan diri jangka panjang pelakunya.');

  const it = [
    [ORNG, 'Invisible Hand', 'Adam Smith: kepentingan diri yang dikejar bersama dianggap menghasilkan kesejahteraan kolektif lewat mekanisme pasar.'],
    [LAV, 'Horizon Jangka Panjang', 'Kepentingan jangka panjang justru menuntut kejujuran dan reputasi, bukan keuntungan yang habis dalam semalam.'],
    [INK, 'Batas: Market Failure', 'Pasar gagal ketika ada monopoli, informasi timpang, dan dampak yang tidak pernah masuk ke dalam harga.']
  ];
  it.forEach((t, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.66, w: w3, h: 2.5, fill: t[0], n: '0' + (i + 1), t: t[1], b: t[2]
  }));

  banner(pres, s, M, 5.38, CW, 0.98, 'Pada Ethical Dilemma 3, melanjutkan kesepakatan menguntungkan Anda. Risiko reputasi membuat jawabannya tidak selugas itu.', AMBR, INK);
  s.addNotes('Kritik utama: egoism sering dianggap bukan teori etika sama sekali, karena membenarkan tindakan yang merugikan orang lain selama menguntungkan pelakunya.');
}

// ============================================================ 08 utilitarianism
{
  const s = S([{ t: 'Teori 02', fill: ORNG }, { t: 'Consequentialist', outline: true }]);
  head(s, 'Utilitarianism', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Sebuah tindakan benar apabila menghasilkan kebaikan terbesar untuk jumlah orang terbesar yang terdampak.');

  const ch = [
    [ORNG, 'Consequentialism', 'Akibat sebuah tindakan yang menentukan benar salahnya.'],
    [LAV, 'Hedonism', 'Utility diukur lewat pleasure, dikurangi pain, menjadi net pleasure.'],
    [TEAL, 'Maximalism', 'Bukan sebagian akibat baik, melainkan jumlah terbesar yang mungkin.'],
    [INK, 'Universalism', 'Akibat untuk setiap orang wajib ikut dipertimbangkan.']
  ];
  ch.forEach((t, i) => tile(pres, s, {
    x: M + i * (w4 + 0.2), y: 2.66, w: w4, h: 2.5, fill: t[0], n: '0' + (i + 1), t: t[1], ts: 13.5, b: t[2]
  }));

  banner(pres, s, M, 5.38, CW, 0.98, 'Neraca pleasure dan pain pada Ethical Dilemma 3 condong ke melanjutkan kesepakatan. Hasil yang tidak nyaman itulah yang memunculkan empat masalah berikut.', LIME, INK);
  s.addNotes('Bentham dan Mill. Bedanya dengan egoism: bukan hasrat setiap individu yang dihitung, melainkan besarnya kesejahteraan kolektif.');
}

// ============================================================ 09 empat masalah + dua jenis
{
  const s = S([{ t: 'Teori 02', fill: ORNG }, { t: 'Kritik Internal', outline: true }]);
  head(s, 'Keterbatasan Utilitarianism', 0.96);
  sub(s, 'Empat masalah pokok, lalu penyempurnaan Mill menjadi dua jenis penilaian.', 1.62);

  const pr = [
    [AMBR, 'Subjectivity', 'Ukuran pleasure dan pain bergantung pada siapa yang menganalisis.'],
    [LAV, 'Equal Weighting', 'Setiap pihak berbobot sama. Diri sendiri tidak boleh diistimewakan.'],
    [TEAL, 'Kuantifikasi', 'Sulit memberi nilai uang pada penderitaan dan kesempatan yang hilang.'],
    [INK, 'Distribusi Utility', 'Kepentingan minoritas mudah terabaikan oleh jumlah mayoritas.']
  ];
  pr.forEach((t, i) => tile(pres, s, {
    x: M + i * (w4 + 0.2), y: 2.12, w: w4, h: 2.0, fill: t[0], n: i + 1, t: t[1], ts: 13.5, b: t[2], bs: 11
  }));

  tile(pres, s, { x: M, y: 4.28, w: w2, h: 1.6, fill: ORNG, t: 'Act Utilitarianism', ts: 16, b: 'Menilai tindakan tunggal. Pada dilema ini dapat menyimpulkan tindakan tersebut benar, karena pain anak dianggap kecil.' });
  tile(pres, s, { x: M + w2 + 0.28, y: 4.28, w: w2, h: 1.6, fill: INK, t: 'Rule Utilitarianism', ts: 16, b: 'Menilai kelas tindakan. Pada dilema ini menolak, karena penderitaan pekerja anak melampaui manfaat ekonominya.' });

  banner(pres, s, M, 6.04, CW, 0.7, 'Dua jenis, dua kesimpulan berlawanan, atas kasus yang sama. Perbedaan ini akan muncul lagi pada kasus oil sands.', LIME, INK);
  s.addNotes('Inilah alasan utilitarianism tidak bisa dipakai sendirian. Kesimpulannya berubah hanya karena unit analisisnya digeser.');
}

// ============================================================ 10 ethics of duties
{
  const s = S([{ t: 'Teori 03', fill: LAV, color: INK }, { t: 'Immanuel Kant', outline: true }]);
  head(s, 'Ethics of Duties', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Bertindak hanya menurut maksim yang pada saat bersamaan dapat dikehendaki menjadi hukum universal.', null, LAV);

  tile(pres, s, {
    x: M, y: 2.66, w: w2, h: 1.96, fill: LAV, n: '01', t: 'Universal Acceptability', ts: 16,
    b: 'Terima sebuah hukum moral hanya bila semua makhluk rasional dapat menerimanya. Anda tidak menghendaki prinsip mempekerjakan anak berlaku pada keluarga Anda sendiri.'
  });
  tile(pres, s, {
    x: M + w2 + 0.28, y: 2.66, w: w2, h: 1.96, fill: INK, n: '02', t: 'Respect for Persons', ts: 16,
    b: 'Perlakukan kemanusiaan sebagai tujuan, tidak pernah hanya sebagai sarana. Anak-anak itu diperlakukan semata sebagai tenaga kerja murah.'
  });

  const kr = [
    ['Kurang Menghargai Motivasi', 'Menaikkan upah karena kasihan dinilai tidak bermoral, karena menalar kewajiban dinilai bermoral.'],
    ['Kurang Menghargai Akibat', 'Tidak ada ruang ketika sedikit pelenturan aturan menghasilkan hasil yang jauh lebih baik.'],
    ['Asumsi Rasionalitas', 'Manusia yang selalu menalar kewajibannya lebih merupakan ideal daripada realitas.']
  ];
  kr.forEach((k, i) => {
    const x = M + i * (w3 + 0.24);
    card(pres, s, x, 4.8, w3, 1.3, W);
    rect(pres, s, x, 4.8, w3, 0.07, AMBR);
    s.addText(k[0], { isTextBox: true, x: x + 0.24, y: 5.02, w: w3 - 0.48, h: 0.28, fontFace: F, fontSize: 12.5, bold: true, color: INK, margin: 0 });
    s.addText(k[1], { isTextBox: true, x: x + 0.24, y: 5.32, w: w3 - 0.48, h: 0.66, fontFace: F, fontSize: 10.5, color: SLATE, margin: 0, lineSpacing: 14 });
  });

  banner(pres, s, M, 6.24, CW, 0.62, 'Kant mendasari stakeholder theory: martabatnya yang jadi alasan etis, bukan manfaat ekonominya.', LIME, INK);
  s.addNotes('Evan dan Freeman (1993): dasar etis konsep pemangku kepentingan diturunkan dari pemikiran Kantian.');
}

// ============================================================ 11 ethics of rights
{
  const s = S([{ t: 'Teori 04', fill: LAV, color: INK }, { t: 'Hak Asasi Manusia', outline: true }]);
  head(s, 'Ethics of Rights', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Hak dasar yang tidak dapat dicabut dan melekat pada seluruh manusia tanpa kecuali. Hak selalu melahirkan kewajiban bagi pihak lain.', null, LAV);

  const ung = [
    [TEAL, 'Protect', 'Negara', 'Kewajiban negara melindungi hak asasi dari pelanggaran pihak ketiga.'],
    [ORNG, 'Respect', 'Bisnis', 'Tanggung jawab perusahaan menghormati hak asasi lewat seluruh relasi bisnisnya.'],
    [INK, 'Remedy', 'Peradilan', 'Akses pemulihan bagi korban pelanggaran yang terkait aktivitas bisnis.']
  ];
  ung.forEach((u, i) => {
    const x = M + i * (w3 + 0.24);
    tile(pres, s, { x, y: 2.66, w: w3, h: 1.92, fill: u[0], t: u[1], ts: 17, b: u[3] });
    s.addText(u[2].toUpperCase(), {
      isTextBox: true, x: x + w3 - 1.5, y: 2.86, w: 1.26, h: 0.26, align: 'right',
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: [ORNG, INK, TEAL].indexOf(u[0]) >= 0 ? mix(u[0], W, 0.55) : SLATE, margin: 0
    });
  });
  s.addText('UN Guiding Principles atau Prinsip Ruggie (2011)', {
    isTextBox: true, x: M, y: 4.74, w: CW, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: SLATE, margin: 0
  });

  const ps = [
    [ORNG, '12', 'Privasi pekerja dan pelanggan'],
    [LAV, '20', 'Kebebasan berkumpul dan berserikat, dasar hukum serikat pekerja'],
    [LIME, '23', 'Hak atas pekerjaan, kondisi kerja yang adil, dan upah yang setara']
  ];
  ps.forEach((p, i) => {
    const x = M + i * (w3 + 0.24);
    card(pres, s, x, 5.1, w3, 1.42, W);
    chip(pres, s, x + 0.24, 5.32, p[1], p[0], [LIME, LAV, AMBR].indexOf(p[0]) >= 0 ? INK : W, 0.36);
    s.addText('Pasal ' + p[1] + ' UDHR', { isTextBox: true, x: x + 0.7, y: 5.35, w: w3 - 0.94, h: 0.28, fontFace: F, fontSize: 12.5, bold: true, color: INK, margin: 0 });
    s.addText(p[2], { isTextBox: true, x: x + 0.24, y: 5.82, w: w3 - 0.48, h: 0.56, fontFace: F, fontSize: 11, color: SLATE, margin: 0, lineSpacing: 15 });
  });
  s.addNotes('Perspektif hak memberi jawaban paling lugas pada Ethical Dilemma 3: mempekerjakan anak melanggar hak atas pendidikan dan hak memberi persetujuan.');
}

// ============================================================ 12 justice / rawls
{
  const s = S([{ t: 'Teori 05', fill: LAV, color: INK }, { t: 'John Rawls', outline: true }]);
  head(s, 'Theory of Justice', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Aturan apa yang akan Anda pilih bila Anda tidak tahu akan terlahir sebagai siapa di dalam masyarakat itu?', null, LAV);

  tile(pres, s, {
    x: M, y: 2.66, w: w2, h: 2.56, fill: ORNG, t: 'Veil of Ignorance', ts: 17,
    b: 'Bayangkan orang yang setara, bebas, dan rasional, namun tidak tahu peran apa yang akan mereka tempati. Mereka bisa menjadi petugas kebersihan, seorang ratu, pengidap penyakit terminal, orang kaya, atau orang miskin.\n\nKetidaktahuan itulah yang memaksa mereka bersikap adil.'
  });

  const kx = M + w2 + 0.28;
  card(pres, s, kx, 2.66, w2, 2.56, INK);
  s.addText('Dua Kriteria Masyarakat Adil', { isTextBox: true, x: kx + 0.26, y: 2.92, w: w2 - 0.52, h: 0.32, fontFace: F, fontSize: 17, bold: true, color: W, margin: 0 });
  const kri = [
    [LIME, 'Kebebasan Dasar yang Setara', 'Setiap orang memiliki hak setara atas sistem kebebasan dasar terluas yang kompatibel untuk semua.'],
    [AMBR, 'Difference Principle', 'Ketimpangan hanya sah bila memberi manfaat terbesar bagi pihak yang paling tidak beruntung.']
  ];
  kri.forEach((k, i) => {
    const y = 3.42 + i * 0.9;
    card(pres, s, kx + 0.26, y, w2 - 0.52, 0.78, '1B2233');
    rect(pres, s, kx + 0.26, y + 0.08, 0.05, 0.62, k[0]);
    s.addText(k[1], { isTextBox: true, x: kx + 0.5, y: y + 0.08, w: w2 - 1.0, h: 0.26, fontFace: F, fontSize: 12, bold: true, color: W, margin: 0 });
    s.addText(k[2], { isTextBox: true, x: kx + 0.5, y: y + 0.34, w: w2 - 1.0, h: 0.4, fontFace: F, fontSize: 10.5, color: 'B9C0CE', margin: 0, lineSpacing: 13.5 });
  });

  banner(pres, s, M, 5.42, CW, 1.06, 'Kriteria pertama didahulukan. Kebebasan dasar harus terwujud sama rata sebelum ketimpangan apa pun boleh dibenarkan. Inilah alat paling tajam untuk membedah kasus oil sands nanti.', LIME, INK);
  s.addNotes('Rawls adalah teori yang paling sering dipakai untuk menilai distribusi manfaat dan beban dalam proyek besar. Ingat urutan kriterianya.');
}

// ============================================================ 13 enam kritik
{
  const s = S([{ t: 'Enam Kritik', fill: INK }, { t: 'Halaman 108', outline: true }]);
  head(s, 'Kritik atas Teori Barat Modern', 0.96);

  const kr = [
    [ORNG, 'Too Abstract', 'Stark (1994), Brenkert (2010)', 'Terlalu teoretis untuk keprihatinan sehari-hari seorang manajer.'],
    [LAV, 'Too Narrow', 'Crane et al. (2019)', 'Setiap teori memaksa memilih satu aspek moralitas, padahal seluruhnya penting.'],
    [TEAL, 'Too Objective', 'Parker (1998)', 'Etikawan memvonis tindakan orang lain tanpa mengalami situasinya.'],
    [AMBR, 'Too Impersonal', 'Held (2006)', 'Prinsip abstrak mengabaikan ikatan personal yang membentuk perasaan moral.'],
    [LIME, 'Too Codified', 'Bauman (1993), Rorty (2006)', 'Aturan terkodifikasi menekan otonomi dan merendahkan emosi moral.'],
    [INK, 'Too Imperialist', 'Naude (2017)', 'Tidak ada alasan mengasumsikan teori Barat cocok untuk seluruh dunia.']
  ];
  const wk = (CW - 2 * 0.22) / 3;
  kr.forEach((k, i) => {
    const x = M + (i % 3) * (wk + 0.22), y = 1.96 + Math.floor(i / 3) * 2.34;
    card(pres, s, x, y, wk, 2.14, k[0]);
    const dark = [ORNG, INK, TEAL].indexOf(k[0]) >= 0;
    chip(pres, s, x + 0.26, y + 0.22, '0' + (i + 1), mix(k[0], dark ? W : INK, 0.16), dark ? W : INK, 0.31);
    s.addText(k[1], { isTextBox: true, x: x + 0.26, y: y + 0.7, w: wk - 0.52, h: 0.3, fontFace: F, fontSize: 15, bold: true, color: dark ? W : INK, margin: 0 });
    s.addText(k[2], { isTextBox: true, x: x + 0.26, y: y + 1.0, w: wk - 0.52, h: 0.26, fontFace: F, fontSize: 10, italic: true, color: mix(k[0], dark ? W : INK, 0.5), margin: 0 });
    s.addText(k[3], { isTextBox: true, x: x + 0.26, y: y + 1.3, w: wk - 0.52, h: 0.7, fontFace: F, fontSize: 11, color: dark ? 'E8E4DC' : '2A3243', margin: 0, lineSpacing: 15 });
  });
  s.addNotes('Keenam kritik ini yang membuka jalan bagi empat teori alternatif pada bagian berikutnya.');
}

// ============================================================ 14 empat alternatif
{
  const s = S([{ t: 'Empat Alternatif', fill: LIME, color: INK }, { t: 'Halaman 110–118', outline: true }]);
  head(s, 'Perspektif Alternatif', 0.96);
  sub(s, 'Menekankan fleksibilitas serta konteks dan relasi pengambil keputusan.', 1.62);

  const al = [
    [TEAL, 'Virtue Ethics', 'Karakter', 'Fokus penilaian berpindah dari tindakan kepada pelakunya. Tindakan yang baik berasal dari orang yang baik.'],
    [LAV, 'Ethic of Care', 'Relasi', 'Masalah moral dipahami sebagai konflik tanggung jawab dalam relasi, bukan konflik hak.'],
    [AMBR, 'Discourse Ethics', 'Proses', 'Norma dihasilkan lewat dialog terbuka. Keputusan benar bila dicapai lewat cara yang benar.'],
    [INK, 'Postmodern Ethics', 'Dorongan Moral', 'Moralitas terletak pada perasaan spontan terhadap orang lain, di luar wilayah rasionalitas.']
  ];
  al.forEach((a, i) => {
    const x = M + i * (w4 + 0.2);
    tile(pres, s, { x, y: 2.16, w: w4, h: 2.6, fill: a[0], n: 0 + (i + 6), t: a[1], ts: 14, b: a[3] });
    s.addText(a[2].toUpperCase(), {
      isTextBox: true, x: x + w4 - 1.42, y: 2.34, w: 1.16, h: 0.26, align: 'right',
      fontFace: F, fontSize: 8.5, bold: true, charSpacing: 1, color: mix(a[0], [ORNG, INK, TEAL].indexOf(a[0]) >= 0 ? W : INK, 0.55), margin: 0
    });
  });

  banner(pres, s, M, 4.96, CW, 1.0, 'Keempatnya menuntut hal yang tidak diminta teori Barat modern: melihat siapa yang memutuskan, dalam relasi apa, dan lewat proses seperti apa keputusan itu lahir.', LIME, INK);
  s.addNotes('Discourse ethics paling sering dipakai untuk menyelesaikan sengketa dampak lingkungan korporasi. Simpan itu untuk bagian kasus.');
}

// ============================================================ 15 lensa ke prisma
{
  const s = S([{ t: 'Pesan Utama', fill: ORNG }, { t: 'Figure 3.1 & 3.2', outline: true }]);
  head(s, 'Dari Lensa ke Prisma', 0.96);
  sub(s, 'Buku ini tidak menyarankan satu teori sebagai pandangan yang paling benar.', 1.62);

  card(pres, s, M, 2.16, w2, 3.06, W, { line: { color: LINE, width: 1, dashType: 'dash' } });
  s.addText('FIGURE 3.1', { isTextBox: true, x: M + 0.32, y: 2.42, w: w2 - 0.64, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: SLATE, margin: 0 });
  s.addText('Lensa Satu Teori', { isTextBox: true, x: M + 0.32, y: 2.72, w: w2 - 0.64, h: 0.36, fontFace: F, fontSize: 20, bold: true, color: INK, margin: 0 });
  s.addText('Dilema etis dipusatkan menjadi satu pertimbangan normatif tunggal. Keputusan terlihat rapi, tetapi seluruh pertimbangan lain hilang dari pandangan.', {
    isTextBox: true, x: M + 0.32, y: 3.2, w: w2 - 0.68, h: 0.9, fontFace: F, fontSize: 12.5, color: '2A3243', margin: 0, lineSpacing: 18
  });
  rect(pres, s, M + 0.32, 4.3, 1.5, 0.16, TEAL);
  s.addText('satu berkas cahaya, satu jawaban', { isTextBox: true, x: M + 0.32, y: 4.6, w: w2 - 0.68, h: 0.3, fontFace: F, fontSize: 11, italic: true, color: SLATE, margin: 0 });

  const px = M + w2 + 0.28;
  card(pres, s, px, 2.16, w2, 3.06, INK);
  s.addText('FIGURE 3.2', { isTextBox: true, x: px + 0.32, y: 2.42, w: w2 - 0.64, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: LIME, margin: 0 });
  s.addText('Prisma Banyak Teori', { isTextBox: true, x: px + 0.32, y: 2.72, w: w2 - 0.64, h: 0.36, fontFace: F, fontSize: 20, bold: true, color: W, margin: 0 });
  s.addText('Dilema yang sama dipecah menjadi spektrum pertimbangan. Setiap teori menyinari sisi yang tidak terlihat oleh teori lainnya.', {
    isTextBox: true, x: px + 0.32, y: 3.2, w: w2 - 0.68, h: 0.9, fontFace: F, fontSize: 12.5, color: 'E8E4DC', margin: 0, lineSpacing: 18
  });
  const spec = ['AB463C', 'FF5A2D', 'F5B722', 'C6F04A', '0FA98E', '4EA8DE', '6C7BE0', 'B8A6F5', 'E86A9B'];
  spec.forEach((c, i) => rect(pres, s, px + 0.32 + i * 0.6, 4.3, 0.46, 0.16, c));
  s.addText('satu kasus, sembilan sorotan', { isTextBox: true, x: px + 0.32, y: 4.6, w: w2 - 0.68, h: 0.3, fontFace: F, fontSize: 11, italic: true, color: 'B9C0CE', margin: 0 });

  banner(pres, s, M, 5.42, CW, 1.1, 'Keputusan yang baik bukan keputusan yang menemukan teori paling benar, melainkan keputusan yang menyadari seluruh spektrum itu dan dapat dipertanggungjawabkan kepada semua pihak yang terdampak.', LIME, INK);
  s.addNotes('Analoginya harfiah: lensa mengumpulkan cahaya menjadi satu titik, prisma memecah cahaya putih menjadi spektrum warna.');
}

// ============================================================ 16 pembatas kasus
{
  const s = pres.addSlide();
  bg(s, INK);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, ORNG);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, LIME);
  wave(pres, s, 6.6, 1.5, 6.2, 0.45, '2A3243');
  page++;
  foot(s, page, '6B7A90');

  pills(pres, s, [{ t: 'Bagian 10', fill: ORNG }, { t: 'Case 3 · Halaman 129–134', fill: '1B2233', color: 'B9C0CE' }], 2.2);
  s.addText([
    { text: 'Canada’s Oil Sands', options: { color: W } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 2.72, w: 9.4, h: 1.2, fontFace: F, fontSize: 46, bold: true, margin: 0, lineSpacing: 52 });
  s.addText('Most Destructive Project on Earth atau Ethical Oil? Perdebatannya berlangsung puluhan tahun tanpa kesimpulan yang konklusif.', {
    isTextBox: true, x: M, y: 4.1, w: 7.6, h: 0.9, fontFace: F, fontSize: 15, color: 'B9C0CE', margin: 0, lineSpacing: 24
  });
  const spec = ['AB463C', 'FF5A2D', 'F5B722', 'C6F04A', '0FA98E', '4EA8DE', '6C7BE0', 'B8A6F5', 'E86A9B'];
  spec.forEach((c, i) => rect(pres, s, M + i * 0.42, 5.6, 0.3, 0.3, c));
  s.addNotes('Kasus ini dipilih sebagai penutup karena tidak memiliki jawaban tunggal, persis seperti pesan Figure 3.2.');
}

// ============================================================ 17 angka dua sisi
{
  const s = S([{ t: 'Kasus', fill: ORNG }, { t: 'Halaman 130–131', outline: true }]);
  head(s, 'Manfaat Ekonomi dan Biaya Ekologis', 0.96);

  const st = [
    { v: '2,77', u: 'juta', l: 'Barel per hari pada 2017, naik dari 0,5 juta barel pada 1997', fill: ORNG },
    { v: 'CAD 1,6', u: 'T', l: 'Kontribusi ke ekonomi Kanada sepanjang 2017 sampai 2027', fill: LAV },
    { v: '20', u: '%', l: 'Emisi gas rumah kaca lebih tinggi daripada minyak konvensional', fill: INK, numColor: LIME },
    { v: '11', u: '%', l: 'Jejak tambang aktif yang sudah direklamasi sampai hari ini', fill: LIME }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 1.9, w: w4, h: 2.0, vs: 30 }, o)));

  tile(pres, s, {
    x: M, y: 4.06, w: w2, h: 2.16, fill: TEAL, t: 'Perhitungan Pendukung', ts: 16,
    b: '206.000 lapangan kerja pada 2017, menuju 461.000 pada 2027\n3.400 perusahaan pemasok di luar Alberta\nCAD 3,3 miliar untuk 399 perusahaan masyarakat adat\nCAD 139 miliar pajak federal dan provinsi'
  });
  tile(pres, s, {
    x: M + w2 + 0.28, y: 4.06, w: w2, h: 2.16, fill: INK, t: 'Perhitungan Penentang', ts: 16,
    b: 'Kolam limbah beracun 220 kilometer persegi berisi 1 triliun liter\nHutan boreal seluas Kota New York telah hancur\nTambahan 50 sampai 150 juta ton emisi per tahun pada 2030\n10 persen emisi Kanada dari satu industri saja'
  });

  banner(pres, s, M, 6.34, CW, 0.58, 'Kedua sisi memakai data resmi. Perbedaannya bukan pada fakta, melainkan pada apa yang layak dihitung.', LIME, INK, 12);
  s.addNotes('Tekankan kalimat penutup: sengketa ini bukan sengketa data, melainkan sengketa kerangka nilai.');
}

// ============================================================ 18 ethical oil
{
  const s = S([{ t: 'Kasus', fill: ORNG }, { t: 'Klaim dan Bantahan', outline: true }]);
  head(s, 'Klaim Ethical Oil', 0.96);

  card(pres, s, M, 1.9, w2, 3.86, ORNG);
  pills(pres, s, [{ t: 'Klaim', fill: INK }], 2.14, M + 0.3);
  s.addText('Ethical Oil', { isTextBox: true, x: M + 0.3, y: 2.6, w: w2 - 0.6, h: 0.4, fontFace: F, fontSize: 22, bold: true, color: W, margin: 0 });
  s.addText('Ezra Levant: membeli minyak Kanada lebih bertanggung jawab karena diatur demokratis dan tidak korup.', {
    isTextBox: true, x: M + 0.3, y: 3.06, w: w2 - 0.66, h: 0.56, fontFace: F, fontSize: 12.5, color: 'FFE8DF', margin: 0, lineSpacing: 18
  });
  const cad = [['Venezuela', '301'], ['Arab Saudi', '267'], ['Kanada', '170'], ['Iran', '158']];
  cad.forEach((c, i) => {
    const y = 3.86 + i * 0.4;
    s.addText(c[0], { isTextBox: true, x: M + 0.3, y, w: w2 - 1.6, h: 0.3, fontFace: F, fontSize: 12, bold: c[0] === 'Kanada', color: c[0] === 'Kanada' ? W : 'FFD9CB', margin: 0 });
    s.addText(c[1], { isTextBox: true, x: M + w2 - 1.6, y, w: 1.3, h: 0.3, align: 'right', fontFace: MONO, fontSize: 12, bold: c[0] === 'Kanada', color: c[0] === 'Kanada' ? W : 'FFD9CB', margin: 0 });
  });
  s.addText('Cadangan terbukti terbesar 2017, miliar barel · Tabel 3.9', {
    isTextBox: true, x: M + 0.3, y: 5.44, w: w2 - 0.6, h: 0.26, fontFace: F, fontSize: 9.5, color: 'FFC9B4', margin: 0
  });

  const bx = M + w2 + 0.28;
  card(pres, s, bx, 1.9, w2, 3.86, INK);
  pills(pres, s, [{ t: 'Bantahan', fill: LIME, color: INK }], 2.14, bx + 0.3);
  const bant = [
    ['John Bennett, Sierra Club', 'Fakta bahwa negara lain lebih buruk tidak relevan. Kanada dapat menangani oil sands miliknya dan tidak melakukannya.'],
    ['David Suzuki, environmentalis', 'Di dunia saat ini seluruh bahan bakar fosil tidak etis. Tidak ada yang namanya minyak yang etis.'],
    ['Greenpeace', 'Ethicaloil.org diyakini memperoleh dana dari industri minyak dan disebut kelompok kedok.']
  ];
  bant.forEach((b, i) => {
    const y = 2.66 + i * 1.02;
    card(pres, s, bx + 0.3, y, w2 - 0.6, 0.9, '1B2233');
    rect(pres, s, bx + 0.3, y + 0.08, 0.05, 0.74, [LIME, AMBR, LAV][i]);
    s.addText(b[0], { isTextBox: true, x: bx + 0.54, y: y + 0.09, w: w2 - 1.06, h: 0.26, fontFace: F, fontSize: 11.5, bold: true, color: W, margin: 0 });
    s.addText(b[1], { isTextBox: true, x: bx + 0.54, y: y + 0.35, w: w2 - 1.06, h: 0.5, fontFace: F, fontSize: 10.5, color: 'B9C0CE', margin: 0, lineSpacing: 14 });
  });

  banner(pres, s, M, 5.92, CW, 0.78, 'Klaim ethical oil membandingkan diri dengan negara terburuk. Itu perbandingan ke bawah, bukan argumen moral.', AMBR, INK);
  s.addNotes('Perhatikan bentuk argumennya: whataboutism. Bahwa pihak lain lebih buruk tidak membuat tindakan sendiri menjadi benar.');
}

// ============================================================ 19 sembilan putusan
{
  const s = S([{ t: 'Sintesis', fill: ORNG }, { t: 'Sembilan Lensa', outline: true }]);
  head(s, 'Matriks Sembilan Teori', 0.96);

  const rows = [
    ['AB463C', 'Egoism', 'Generasi mendatang tidak hadir di pasar, jadi biayanya tidak pernah masuk harga', 'Netral'],
    ['FF5A2D', 'Utilitarianism', 'Act cenderung mendukung, rule menolak karena target Paris menjadi mustahil', 'Terbelah'],
    ['F5B722', 'Ethics of Duty', 'Bila seluruh negara pemilik cadangan berbuat sama, prinsipnya tidak dapat diuniversalkan', 'Menolak'],
    ['C6F04A', 'Ethics of Rights', 'Pasal 23 mendukung lapangan kerja, hak atas kesehatan dan tanah adat menentang', 'Bersyarat'],
    ['0FA98E', 'Justice', 'Manfaat tersebar nasional, beban terkonsentrasi. Kriteria pertama Rawls tidak terpenuhi', 'Menolak'],
    ['4EA8DE', 'Virtue Ethics', 'Mengukur diri terhadap negara terburuk adalah perbandingan ke bawah', 'Menolak'],
    ['6C7BE0', 'Ethic of Care', 'Komunitas hilir dan generasi mendatang adalah relasi, bukan variabel biaya', 'Transisi adil'],
    ['B8A6F5', 'Discourse Ethics', 'Label ethical oil lahir dari kampanye berdana industri, melanggar imparsialitas', 'Menolak proses'],
    ['E86A9B', 'Postmodern Ethics', 'Perebutan istilah oil sands dan tar sands menunjukkan bahasa membentuk moralitas', 'Anti absolut']
  ];
  rows.forEach((r, i) => {
    const y = 1.88 + i * 0.54;
    card(pres, s, M, y, CW, 0.46, W, { r: 0.08 });
    rect(pres, s, M, y, 0.14, 0.46, r[0]);
    s.addText(r[1], { isTextBox: true, x: M + 0.34, y, w: 2.0, h: 0.46, valign: 'middle', fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(r[2], { isTextBox: true, x: M + 2.44, y, w: 7.2, h: 0.46, valign: 'middle', fontFace: F, fontSize: 11, color: '2A3243', margin: 0 });
    const vc = ['C6F04A', 'F5B722', 'B8A6F5', '4EA8DE', 'E86A9B'].indexOf(r[0]) >= 0 ? mix(r[0], INK, 0.42) : r[0];
    s.addText(r[3], { isTextBox: true, x: M + 9.74, y, w: CW - 9.94, h: 0.46, valign: 'middle', align: 'right', fontFace: F, fontSize: 11.5, bold: true, color: vc, margin: 0 });
  });
  s.addText('Tidak satu pun kolom kanan berbunyi mendukung tanpa syarat, namun kolom itu juga tidak seragam. Perbedaan itulah bahan diskusinya.', {
    isTextBox: true, x: M, y: 6.78, w: CW, h: 0.32, fontFace: F, fontSize: 11.5, italic: true, color: SLATE, margin: 0
  });
  s.addNotes('Inilah prisma Figure 3.2 yang bekerja pada kasus nyata. Sembilan sorotan berbeda atas satu rangkaian fakta yang sama.');
}

// ============================================================ 20 pertanyaan diskusi
{
  const s = S([{ t: 'Penerapan', fill: ORNG }, { t: 'Pilih Dua', outline: true }]);
  head(s, 'Agenda Diskusi', 0.96);
  sub(s, 'Empat pertanyaan pemandu, masing-masing menguji satu teori.', 1.62);

  const q = [
    [ORNG, 'Uji Kant', 'Bila prinsip Kanada diterapkan oleh seluruh negara pemilik cadangan terbesar, apa yang tersisa dari target Paris?'],
    [LAV, 'Uji Rawls', 'Aturan apa yang Anda pilih bila tidak tahu akan terlahir sebagai pekerja tambang, warga adat hilir, atau anak yang lahir 2060?'],
    [TEAL, 'Uji Bennett', 'Apakah pernyataan bahwa pihak lain lebih buruk merupakan argumen moral atau sekadar pengalihan perhatian?'],
    [LIME, 'Uji Bahasa', 'Siapa yang diuntungkan ketika istilah oil sands atau tar sands yang dipakai untuk menyebut hal yang sama?']
  ];
  q.forEach((it, i) => numRow(pres, s, {
    x: M, y: 2.12 + i * 1.02, w: CW, h: 0.92, n: i + 1, fill: it[0], t: it[1], b: it[2]
  }));

  banner(pres, s, M, 6.14, CW, 0.66, 'Simulasi discourse ethics: enam kelompok, dua menit per posisi, lalu satu norma bersama.', INK, W, 12.5);
  s.addNotes('Enam kelompok: Pemerintah Alberta, konsorsium perusahaan minyak, Sierra Club, masyarakat adat hilir Athabasca, serikat pekerja Fort McMurray, dan perwakilan generasi 2060.');
}

// ============================================================ 21 penutup
{
  const s = pres.addSlide();
  bg(s);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, ORNG);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, LAV);
  wave(pres, s, 7.7, 2.4, 5.2, 0.46);
  page++;

  s.addText([
    { text: 'Terima Kasih', options: { color: INK } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 1.9, w: 10, h: 1.5, fontFace: F, fontSize: 62, bold: true, margin: 0, lineSpacing: 68 });

  s.addText('Setelah sembilan teori, kita tetap tidak memiliki satu jawaban. Buku ini memang tidak menjanjikannya, dan itulah pesan Figure 3.2.', {
    isTextBox: true, x: M, y: 3.7, w: 8.2, h: 0.9, fontFace: F, fontSize: 15, color: SLATE, margin: 0, lineSpacing: 24
  });

  card(pres, s, M, 5.5, 4.5, 0.78, W);
  rect(pres, s, M, 5.56, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.65, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 5.92, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: SLATE, margin: 0 });

  rect(pres, s, M, 6.62, CW, 0.011, LINE);
  s.addText('Business Ethics · Chapter 3 Evaluating Business Ethics', {
    isTextBox: true, x: M, y: 6.78, w: 6.4, h: 0.28, fontFace: F, fontSize: 10.5, bold: true, color: INK, margin: 0
  });
  s.addText('Crane, Matten, Glozer & Spence (2019) · Oxford University Press', {
    isTextBox: true, x: SW - M - 6.0, y: 6.78, w: 6.0, h: 0.28, align: 'right', fontFace: F, fontSize: 10.5, color: SLATE, margin: 0
  });
  s.addNotes('Tutup dengan mengulang pertanyaan pembuka mengenai ethical oil, lalu bandingkan dengan jawaban di awal sesi.');
}

report('deck 1');
pres.writeFile({ fileName: 'Deck-1-Evaluating-Business-Ethics.pptx' })
  .then(f => console.log('selesai:', f, '·', page, 'slide'));
