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
    { t: 'Presentasi Materi', outline: true }
  ], 0.46);

  sub(s, 'Teori Etika Normatif dan Penerapannya', 1.62, 7.4);
  s.addText('Pembahasan Materi dan Kasus —', { isTextBox: true, x: M, y: 1.95, w: 7.4, h: 0.34, fontFace: F, fontSize: 16, bold: true, color: ORNG, margin: 0 });

  s.addText([
    { text: 'Evaluating Business', options: { color: INK, breakLine: true } },
    { text: 'Ethics', options: { color: INK } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 2.48, w: 8.2, h: 1.72, fontFace: F, fontSize: 52, bold: true, margin: 0, lineSpacing: 58 });

  sub(s, 'Sembilan teori etika normatif dan penerapannya pada satu kasus: Canada’s Oil Sands.', 4.5, 7.3, SLATE, 14, 0.86);

  card(pres, s, M, 5.72, 4.5, 0.78, W);
  rect(pres, s, M, 5.78, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.87, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 6.14, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: SLATE, margin: 0 });

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
    ['04', 'Ethical Dilemma 3', 'Kasus penguji sepanjang bab'],
    ['05', 'Teori Consequentialist', 'Ethical egoism dan utilitarianism'],
    ['06', 'Teori Principle-based', 'Duty, rights, dan justice'],
    ['07', 'Kritik dan Keterbatasan', 'Batas teori Barat modern'],
    ['08', 'Perspektif Alternatif', 'Virtue, care, discourse, postmodern'],
    ['09', 'Dari Lensa ke Prisma', 'Pendekatan pluralis yang dianjurkan'],
    ['10', 'Canada’s Oil Sands', 'Penerapan sembilan teori pada satu kasus']
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
  const s = S([{ t: 'Fondasi', fill: ORNG }, { t: 'Dasar Penalaran Etis', outline: true }]);
  head(s, 'Urgensi Teori Etika Normatif', 0.96);
  sub(s, 'Keputusan bisnis menuntut justifikasi yang dapat diuji secara rasional.', 1.62);

  const items = [
    [ORNG, 'Kompleksitas Konteks', 'Operasi lintas negara menghadirkan suap, standar ketenagakerjaan rendah, dan praktik diskriminatif.'],
    [LAV, 'Kewajiban Justifikasi', 'Pilihan manajerial wajib dipertanggungjawabkan kepada pemegang saham, karyawan, dan masyarakat.'],
    [INK, 'Kritik Menuntut Landasan', 'Penilaian bahwa suatu korporasi tidak etis menuntut landasan argumentatif yang setara.']
  ];
  items.forEach((it, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.16, w: w3, h: 2.68, fill: it[0], n: '0' + (i + 1), t: it[1], b: it[2]
  }));

  quote(pres, s, M, 5.16, CW, 1.06,
    'Normative ethical theories adalah aturan, prinsip, dan pendekatan yang menetapkan benar dan salahnya suatu tindakan.');
  s.addNotes('Tiga manfaat teori etika menurut buku: merasionalisasi firasat, memungkinkan wacana antara orang dengan nilai berbeda, dan memperjelas praanggapan moral para pihak.');
}

// ============================================================ 04 tiga sikap moral
{
  const s = S([{ t: 'Posisi Moral', fill: ORNG }, { t: 'Tiga Pendirian', outline: true }]);
  head(s, 'Absolutism, Relativism, Pluralism', 0.96);
  sub(s, 'Etika bisnis kontemporer berdiri pada posisi ketiga.', 1.62);

  const pos = [
    [AMBR, 'Absolutism', 'Prinsip moral bersifat abadi dan universal. Benar dan salah merupakan kualitas objektif yang ditentukan secara rasional.'],
    [TEAL, 'Relativism', 'Moralitas bersifat kontekstual dan subjektif. Tidak terdapat kategori benar dan salah yang berlaku universal.'],
    [LAV, 'Pluralism', 'Nilai yang tidak sepadan dapat sama-sama sah dan menuntut toleransi, tanpa menyetarakan seluruh perspektif.']
  ];
  pos.forEach((it, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.16, w: w3, h: 2.42, fill: it[0], n: '0' + (i + 1), t: it[1], b: it[2]
  }));

  banner(pres, s, M, 4.78, CW, 0.78, 'Pluralism tidak menyetarakan validitas seluruh pendapat. Konflik antarperspektif tetap menuntut penyelesaian.', LIME, INK);
  quote(pres, s, M, 5.8, CW, 0.76,
    'Kritik utamanya: pluralism berisiko terlalu permisif. Sebagian praktik keliru mendasar dan tidak layak ditoleransi.',
    null, LAV);
  s.addNotes('Absolutism dituduh kaku, relativism dituduh membiarkan apa saja. Pluralism mencoba mengambil jalan tengah dan itulah posisi buku ini.');
}

// ============================================================ 05 dua keluarga teori
{
  const s = S([{ t: 'Teori Barat Modern', fill: ORNG }, { t: 'Dua Keluarga Besar', outline: true }]);
  head(s, 'Taksonomi Teori Barat Modern', 0.96);
  sub(s, 'Berakar pada Pencerahan abad ke-18 dan bersifat absolutis.', 1.62);

  tile(pres, s, { x: M, y: 2.16, w: w2, h: 1.9, fill: ORNG, t: 'Consequentialist', ts: 18, b: 'Moralitas ditentukan oleh hasil tindakan. Hasil yang diinginkan menjadi dasar pembenaran.' });
  tile(pres, s, { x: M + w2 + 0.28, y: 2.16, w: w2, h: 1.9, fill: INK, t: 'Principle-based', ts: 18, b: 'Moralitas ditentukan oleh prinsip dan prosedur. Yang benar didahulukan atas yang diinginkan.' });

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

  banner(pres, s, M, 5.58, CW, 1.08, 'Perbedaan mendasarnya terletak pada konsep manusia. Consequentialist: penggerak hasrat dan kesejahteraan. Principle-based: aktor moral rasional yang bermartabat.', INK, W, 13.5);
  s.addNotes('Tabel 3.1 halaman 92 membandingkan keduanya pada kontributor, fokus, dan konsep manusia. Tekankan kolom konsep manusia karena itulah akar perbedaannya.');
}

// ============================================================ 06 ethical dilemma 3
{
  const s = S([{ t: 'Kasus Penguji', fill: ORNG }, { t: 'Producing Toys', outline: true }]);
  head(s, 'Ethical Dilemma 3', 0.96);
  sub(s, 'Kasus penguji tunggal yang digunakan sepanjang bab.', 1.62);

  const lw = 7.0;
  card(pres, s, M, 2.16, lw, 3.36, INK);
  s.addText('Ringkasan Kasus', { isTextBox: true, x: M + 0.32, y: 2.4, w: lw - 0.64, h: 0.3, fontFace: F, fontSize: 11, bold: true, charSpacing: 1, color: LIME, margin: 0 });
  s.addText([
    { text: 'Seorang product manager perusahaan kembang gula memperoleh pemasok mainan plastik di Thailand pada harga sepertiga dari pemasok Portugal, dengan kualitas setara.', options: { breakLine: true } },
    { text: 'Peninjauan produksi tidak menemukan fasilitas kerja. Komponen dikerjakan di rumah oleh sekitar 30 pekerja. Satu keluarga merakit mainan: ayah, ibu, dan enam anak berusia 5 sampai 14 tahun.', options: { breakLine: true } },
    { text: 'Temuan tersebut memunculkan keraguan atas kelayakan etis kesepakatan yang telah dicapai.' }
  ], { isTextBox: true, x: M + 0.32, y: 2.76, w: lw - 0.68, h: 2.5, fontFace: F, fontSize: 12.5, color: 'E8E4DC', margin: 0, lineSpacing: 19, paraSpaceAfter: 8 });

  const rx = M + lw + 0.28, rw = CW - lw - 0.28;
  card(pres, s, rx, 2.16, rw, 1.62, W);
  s.addText('Pertanyaan Kasus', { isTextBox: true, x: rx + 0.3, y: 2.38, w: rw - 0.6, h: 0.3, fontFace: F, fontSize: 13.5, bold: true, color: INK, margin: 0 });
  s.addText([
    { text: 'Bagaimana respons awal seorang product manager atas temuan ini?', options: { bullet: true, breakLine: true } },
    { text: 'Nilai atau prinsip apa yang mendasari respons tersebut?', options: { bullet: true } }
  ], { isTextBox: true, x: rx + 0.34, y: 2.74, w: rw - 0.7, h: 0.9, fontFace: F, fontSize: 12, color: '2A3243', margin: 0, lineSpacing: 17, paraSpaceAfter: 6 });

  card(pres, s, rx, 3.92, rw, 1.6, LIME);
  s.addText([
    { text: '9', options: { fontSize: 42, bold: true, color: INK } },
    { text: '  teori', options: { fontSize: 16, bold: true, color: INK } }
  ], { isTextBox: true, x: rx + 0.3, y: 4.12, w: rw - 0.6, h: 0.7, fontFace: F, margin: 0 });
  s.addText('menghasilkan sembilan penilaian berbeda atas rangkaian fakta yang identik.', {
    isTextBox: true, x: rx + 0.3, y: 4.86, w: rw - 0.6, h: 0.56, fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0, lineSpacing: 15
  });

  banner(pres, s, M, 5.7, CW, 0.82, 'Respons intuitif akan dibandingkan dengan hasil penerapan kesembilan teori pada akhir pembahasan.', ORNG, W);
  s.addNotes('Minta dua sampai tiga mahasiswa menyebutkan reaksi spontan mereka. Catat di papan, jangan dikomentari dulu.');
}

// ============================================================ 07 ethical egoism
{
  const s = S([{ t: 'Teori 01', fill: ORNG }, { t: 'Consequentialist', outline: true }]);
  head(s, 'Ethical Egoism', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Sebuah tindakan benar secara moral apabila mendorong kepentingan diri jangka panjang pelakunya.');

  const it = [
    [ORNG, 'Invisible Hand', 'Agregasi kepentingan diri menghasilkan kesejahteraan kolektif melalui mekanisme pasar.'],
    [LAV, 'Horizon Jangka Panjang', 'Orientasi jangka panjang menuntut kejujuran dan reputasi, bukan maksimasi keuntungan sesaat.'],
    [INK, 'Batas: Market Failure', 'Mekanisme pasar gagal pada kondisi monopoli, asimetri informasi, dan eksternalitas yang tidak terinternalisasi.']
  ];
  it.forEach((t, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.66, w: w3, h: 2.5, fill: t[0], n: '0' + (i + 1), t: t[1], b: t[2]
  }));

  banner(pres, s, M, 5.38, CW, 0.98, 'Penerapan pada Ethical Dilemma 3: kesepakatan menguntungkan pelaku, namun risiko reputasi menahan kesimpulannya.', AMBR, INK);
  s.addNotes('Kritik utama: egoism sering dianggap bukan teori etika sama sekali, karena membenarkan tindakan yang merugikan orang lain selama menguntungkan pelakunya.');
}

// ============================================================ 08 utilitarianism
{
  const s = S([{ t: 'Teori 02', fill: ORNG }, { t: 'Consequentialist', outline: true }]);
  head(s, 'Utilitarianism', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Sebuah tindakan benar apabila menghasilkan kebaikan terbesar untuk jumlah orang terbesar yang terdampak.');

  const ch = [
    [ORNG, 'Consequentialism', 'Akibat tindakan menjadi penentu benar dan salahnya.'],
    [LAV, 'Hedonism', 'Utilitas diukur sebagai pleasure dikurangi pain, menghasilkan net pleasure.'],
    [TEAL, 'Maximalism', 'Bukan sebagian akibat baik, melainkan agregat terbesar yang mungkin.'],
    [INK, 'Universalism', 'Akibat bagi seluruh pihak wajib dipertimbangkan.']
  ];
  ch.forEach((t, i) => tile(pres, s, {
    x: M + i * (w4 + 0.2), y: 2.66, w: w4, h: 2.5, fill: t[0], n: '0' + (i + 1), t: t[1], ts: 13.5, b: t[2]
  }));

  banner(pres, s, M, 5.38, CW, 0.98, 'Neraca utilitas pada Ethical Dilemma 3 condong pada kelanjutan kesepakatan. Kesimpulan inilah yang memunculkan empat keberatan berikut.', LIME, INK);
  s.addNotes('Bentham dan Mill. Bedanya dengan egoism: bukan hasrat setiap individu yang dihitung, melainkan besarnya kesejahteraan kolektif.');
}

// ============================================================ 09 empat masalah + dua jenis
{
  const s = S([{ t: 'Teori 02', fill: ORNG }, { t: 'Kritik Internal', outline: true }]);
  head(s, 'Keterbatasan Utilitarianism', 0.96);
  sub(s, 'Empat keberatan pokok dan penyempurnaan Mill menjadi dua varian.', 1.62);

  const pr = [
    [AMBR, 'Subjectivity', 'Ukuran pleasure dan pain bergantung pada perspektif penganalisis.'],
    [LAV, 'Equal Weighting', 'Seluruh pihak berbobot setara. Pengistimewaan diri tidak dibenarkan.'],
    [TEAL, 'Kuantifikasi', 'Penderitaan dan kesempatan yang hilang sulit dinyatakan dalam satuan moneter.'],
    [INK, 'Distribusi Utility', 'Agregasi mayoritas berpotensi meniadakan kepentingan minoritas.']
  ];
  pr.forEach((t, i) => tile(pres, s, {
    x: M + i * (w4 + 0.2), y: 2.12, w: w4, h: 2.0, fill: t[0], n: i + 1, t: t[1], ts: 13.5, b: t[2], bs: 11
  }));

  tile(pres, s, { x: M, y: 4.28, w: w2, h: 1.6, fill: ORNG, t: 'Act Utilitarianism', ts: 16, b: 'Unit analisisnya tindakan tunggal. Pada dilema ini dapat membenarkan kesepakatan, karena pain dinilai kecil.' });
  tile(pres, s, { x: M + w2 + 0.28, y: 4.28, w: w2, h: 1.6, fill: INK, t: 'Rule Utilitarianism', ts: 16, b: 'Unit analisisnya kelas tindakan. Pada dilema ini menolak, karena penderitaan pekerja anak melampaui manfaat ekonominya.' });

  banner(pres, s, M, 6.04, CW, 0.7, 'Dua varian menghasilkan kesimpulan berlawanan atas kasus identik. Divergensi ini berulang pada kasus oil sands.', LIME, INK);
  s.addNotes('Inilah alasan utilitarianism tidak bisa dipakai sendirian. Kesimpulannya berubah hanya karena unit analisisnya digeser.');
}

// ============================================================ 10 ethics of duties
{
  const s = S([{ t: 'Teori 03', fill: LAV, color: INK }, { t: 'Immanuel Kant', outline: true }]);
  head(s, 'Ethics of Duties', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Bertindak hanya menurut maksim yang pada saat bersamaan dapat dikehendaki menjadi hukum universal.', null, LAV);

  tile(pres, s, {
    x: M, y: 2.66, w: w2, h: 1.96, fill: LAV, n: '01', t: 'Universal Acceptability', ts: 16,
    b: 'Hukum moral sah hanya bila seluruh makhluk rasional dapat menerimanya. Prinsip mempekerjakan anak tidak dikehendaki berlaku universal.'
  });
  tile(pres, s, {
    x: M + w2 + 0.28, y: 2.66, w: w2, h: 1.96, fill: INK, n: '02', t: 'Respect for Persons', ts: 16,
    b: 'Kemanusiaan diperlakukan sebagai tujuan, tidak semata sebagai sarana. Pekerja anak direduksi menjadi faktor biaya.'
  });

  const kr = [
    ['Kurang Menghargai Motivasi', 'Motif belas kasih tidak bernilai moral, motif penalaran kewajiban bernilai moral.'],
    ['Kurang Menghargai Akibat', 'Tidak tersedia ruang bagi pengecualian yang menghasilkan akibat lebih baik.'],
    ['Asumsi Rasionalitas', 'Rasionalitas moral yang konsisten merupakan ideal, bukan deskripsi realitas.']
  ];
  kr.forEach((k, i) => {
    const x = M + i * (w3 + 0.24);
    card(pres, s, x, 4.8, w3, 1.3, W);
    rect(pres, s, x, 4.8, w3, 0.07, AMBR);
    s.addText(k[0], { isTextBox: true, x: x + 0.24, y: 5.02, w: w3 - 0.48, h: 0.28, fontFace: F, fontSize: 12.5, bold: true, color: INK, margin: 0 });
    s.addText(k[1], { isTextBox: true, x: x + 0.24, y: 5.32, w: w3 - 0.48, h: 0.66, fontFace: F, fontSize: 10.5, color: SLATE, margin: 0, lineSpacing: 14 });
  });

  banner(pres, s, M, 6.24, CW, 0.62, 'Kant menjadi dasar stakeholder theory: martabat sebagai alasan etis, bukan manfaat ekonomi.', LIME, INK);
  s.addNotes('Evan dan Freeman (1993): dasar etis konsep pemangku kepentingan diturunkan dari pemikiran Kantian.');
}

// ============================================================ 11 ethics of rights
{
  const s = S([{ t: 'Teori 04', fill: LAV, color: INK }, { t: 'Hak Asasi Manusia', outline: true }]);
  head(s, 'Ethics of Rights', 0.96);
  quote(pres, s, M, 1.66, CW, 0.82, 'Hak dasar yang tidak dapat dicabut dan melekat pada seluruh manusia tanpa kecuali. Hak selalu melahirkan kewajiban bagi pihak lain.', null, LAV);

  const ung = [
    [TEAL, 'Protect', 'Negara', 'Kewajiban negara melindungi hak asasi dari pelanggaran pihak ketiga.'],
    [ORNG, 'Respect', 'Bisnis', 'Tanggung jawab korporasi menghormati hak asasi pada seluruh relasi bisnisnya.'],
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
  s.addText('UN Guiding Principles on Business and Human Rights', {
    isTextBox: true, x: M, y: 4.74, w: CW, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: SLATE, margin: 0
  });

  const ps = [
    [ORNG, '12', 'Privasi pekerja dan pelanggan'],
    [LAV, '20', 'Kebebasan berkumpul dan berserikat, landasan hukum serikat pekerja'],
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
  quote(pres, s, M, 1.66, CW, 0.82, 'Prinsip keadilan adalah prinsip yang dipilih pihak rasional tanpa mengetahui posisi sosial yang akan ditempatinya.', null, LAV);

  tile(pres, s, {
    x: M, y: 2.66, w: w2, h: 2.56, fill: ORNG, t: 'Veil of Ignorance', ts: 17,
    b: 'Pihak yang setara, bebas, dan rasional memilih prinsip tanpa mengetahui posisi yang akan ditempatinya: petugas kebersihan, kepala negara, pengidap penyakit terminal, atau warga miskin.\n\nKetidaktahuan inilah yang menghasilkan imparsialitas.'
  });

  const kx = M + w2 + 0.28;
  card(pres, s, kx, 2.66, w2, 2.56, INK);
  s.addText('Dua Kriteria Masyarakat Adil', { isTextBox: true, x: kx + 0.26, y: 2.92, w: w2 - 0.52, h: 0.32, fontFace: F, fontSize: 17, bold: true, color: W, margin: 0 });
  const kri = [
    [LIME, 'Kebebasan Dasar yang Setara', 'Setiap orang berhak setara atas sistem kebebasan dasar terluas yang kompatibel bagi semua.'],
    [AMBR, 'Difference Principle', 'Ketimpangan sah hanya bila memberi manfaat terbesar bagi pihak paling tidak beruntung.']
  ];
  kri.forEach((k, i) => {
    const y = 3.42 + i * 0.9;
    card(pres, s, kx + 0.26, y, w2 - 0.52, 0.78, '1B2233');
    rect(pres, s, kx + 0.26, y + 0.08, 0.05, 0.62, k[0]);
    s.addText(k[1], { isTextBox: true, x: kx + 0.5, y: y + 0.08, w: w2 - 1.0, h: 0.26, fontFace: F, fontSize: 12, bold: true, color: W, margin: 0 });
    s.addText(k[2], { isTextBox: true, x: kx + 0.5, y: y + 0.34, w: w2 - 1.0, h: 0.4, fontFace: F, fontSize: 10.5, color: 'B9C0CE', margin: 0, lineSpacing: 13.5 });
  });

  banner(pres, s, M, 5.42, CW, 1.06, 'Kriteria pertama bersifat leksikal: kebebasan dasar harus terwujud merata sebelum ketimpangan dibenarkan. Kriteria inilah yang paling menentukan pada kasus oil sands.', LIME, INK);
  s.addNotes('Rawls adalah teori yang paling sering dipakai untuk menilai distribusi manfaat dan beban dalam proyek besar. Ingat urutan kriterianya.');
}

// ============================================================ 13 enam kritik
{
  const s = S([{ t: 'Batas Teori', fill: INK }, { t: 'Enam Kritik', outline: true }]);
  head(s, 'Kritik atas Teori Barat Modern', 0.96);

  const kr = [
    [ORNG, 'Too Abstract', 'Terlalu teoretis untuk keprihatinan sehari-hari seorang manajer.'],
    [LAV, 'Too Narrow', 'Setiap teori memaksa pemilihan satu aspek moralitas, padahal seluruhnya relevan.'],
    [TEAL, 'Too Objective', 'Etikawan memvonis tindakan orang lain tanpa mengalami situasinya.'],
    [AMBR, 'Too Impersonal', 'Prinsip abstrak mengabaikan ikatan personal yang membentuk perasaan moral.'],
    [LIME, 'Too Codified', 'Aturan terkodifikasi menekan otonomi dan merendahkan emosi moral.'],
    [INK, 'Too Imperialist', 'Tidak terdapat dasar untuk mengasumsikan universalitas teori Barat.']
  ];
  const wk = (CW - 2 * 0.22) / 3;
  kr.forEach((k, i) => {
    const x = M + (i % 3) * (wk + 0.22), y = 1.96 + Math.floor(i / 3) * 2.34;
    card(pres, s, x, y, wk, 2.14, k[0]);
    const dark = [ORNG, INK, TEAL].indexOf(k[0]) >= 0;
    chip(pres, s, x + 0.26, y + 0.22, '0' + (i + 1), mix(k[0], dark ? W : INK, 0.16), dark ? W : INK, 0.31);
    s.addText(k[1], { isTextBox: true, x: x + 0.26, y: y + 0.72, w: wk - 0.52, h: 0.32, fontFace: F, fontSize: 16, bold: true, color: dark ? W : INK, margin: 0 });
    s.addText(k[2], { isTextBox: true, x: x + 0.26, y: y + 1.16, w: wk - 0.52, h: 0.84, fontFace: F, fontSize: 11.5, color: dark ? 'E8E4DC' : '2A3243', margin: 0, lineSpacing: 16 });
  });
  s.addNotes('Keenam kritik ini yang membuka jalan bagi empat teori alternatif pada bagian berikutnya.');
}

// ============================================================ 14 empat alternatif
{
  const s = S([{ t: 'Alternatif', fill: LIME, color: INK }, { t: 'Empat Perspektif', outline: true }]);
  head(s, 'Perspektif Alternatif', 0.96);
  sub(s, 'Menekankan fleksibilitas serta konteks dan relasi pengambil keputusan.', 1.62);

  const al = [
    [TEAL, 'Virtue Ethics', 'Karakter', 'Fokus penilaian bergeser dari tindakan ke pelakunya. Tindakan baik bersumber dari karakter yang baik.'],
    [LAV, 'Ethic of Care', 'Relasi', 'Masalah moral dipahami sebagai konflik tanggung jawab dalam relasi, bukan konflik hak.'],
    [AMBR, 'Discourse Ethics', 'Proses', 'Norma dihasilkan melalui deliberasi terbuka. Keputusan sah bila prosedurnya sah.'],
    [INK, 'Postmodern Ethics', 'Dorongan Moral', 'Moralitas berlandas dorongan spontan terhadap sesama, di luar wilayah rasionalitas.']
  ];
  al.forEach((a, i) => {
    const x = M + i * (w4 + 0.2);
    tile(pres, s, { x, y: 2.16, w: w4, h: 2.6, fill: a[0], n: 0 + (i + 6), t: a[1], ts: 14, b: a[3] });
    s.addText(a[2].toUpperCase(), {
      isTextBox: true, x: x + w4 - 1.42, y: 2.34, w: 1.16, h: 0.26, align: 'right',
      fontFace: F, fontSize: 8.5, bold: true, charSpacing: 1, color: mix(a[0], [ORNG, INK, TEAL].indexOf(a[0]) >= 0 ? W : INK, 0.55), margin: 0
    });
  });

  banner(pres, s, M, 4.96, CW, 1.0, 'Keempatnya menambahkan variabel yang diabaikan teori Barat modern: identitas pengambil keputusan, relasi, dan prosedur.', LIME, INK);
  s.addNotes('Discourse ethics paling sering dipakai untuk menyelesaikan sengketa dampak lingkungan korporasi. Simpan itu untuk bagian kasus.');
}

// ============================================================ 15 lensa ke prisma
{
  const s = S([{ t: 'Pesan Utama', fill: ORNG }, { t: 'Lensa dan Prisma', outline: true }]);
  head(s, 'Dari Lensa ke Prisma', 0.96);
  sub(s, 'Tidak ada satu teori yang ditetapkan sebagai pandangan paling sahih.', 1.62);

  card(pres, s, M, 2.16, w2, 3.06, W, { line: { color: LINE, width: 1, dashType: 'dash' } });
  s.addText('PENDEKATAN TUNGGAL', { isTextBox: true, x: M + 0.32, y: 2.42, w: w2 - 0.64, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: SLATE, margin: 0 });
  s.addText('Lensa Satu Teori', { isTextBox: true, x: M + 0.32, y: 2.72, w: w2 - 0.64, h: 0.36, fontFace: F, fontSize: 20, bold: true, color: INK, margin: 0 });
  s.addText('Dilema direduksi menjadi satu pertimbangan normatif. Kesimpulannya tegas, namun pertimbangan lain tidak terlihat.', {
    isTextBox: true, x: M + 0.32, y: 3.2, w: w2 - 0.68, h: 0.9, fontFace: F, fontSize: 12.5, color: '2A3243', margin: 0, lineSpacing: 18
  });
  rect(pres, s, M + 0.32, 4.3, 1.5, 0.16, TEAL);
  s.addText('reduksi menjadi satu kesimpulan', { isTextBox: true, x: M + 0.32, y: 4.6, w: w2 - 0.68, h: 0.3, fontFace: F, fontSize: 11, italic: true, color: SLATE, margin: 0 });

  const px = M + w2 + 0.28;
  card(pres, s, px, 2.16, w2, 3.06, INK);
  s.addText('PENDEKATAN JAMAK', { isTextBox: true, x: px + 0.32, y: 2.42, w: w2 - 0.64, h: 0.26, fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1, color: LIME, margin: 0 });
  s.addText('Prisma Banyak Teori', { isTextBox: true, x: px + 0.32, y: 2.72, w: w2 - 0.64, h: 0.36, fontFace: F, fontSize: 20, bold: true, color: W, margin: 0 });
  s.addText('Dilema yang sama diuraikan menjadi spektrum pertimbangan. Setiap teori menyoroti dimensi yang luput dari teori lain.', {
    isTextBox: true, x: px + 0.32, y: 3.2, w: w2 - 0.68, h: 0.9, fontFace: F, fontSize: 12.5, color: 'E8E4DC', margin: 0, lineSpacing: 18
  });
  const spec = ['AB463C', 'FF5A2D', 'F5B722', 'C6F04A', '0FA98E', '4EA8DE', '6C7BE0', 'B8A6F5', 'E86A9B'];
  spec.forEach((c, i) => rect(pres, s, px + 0.32 + i * 0.6, 4.3, 0.46, 0.16, c));
  s.addText('spektrum sembilan pertimbangan', { isTextBox: true, x: px + 0.32, y: 4.6, w: w2 - 0.68, h: 0.3, fontFace: F, fontSize: 11, italic: true, color: 'B9C0CE', margin: 0 });

  banner(pres, s, M, 5.42, CW, 1.1, 'Keputusan yang baik bukan yang menemukan teori paling sahih, melainkan yang menyadari seluruh spektrum pertimbangan dan dapat dipertanggungjawabkan kepada pihak terdampak.', LIME, INK);
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

  pills(pres, s, [{ t: 'Bagian 10', fill: ORNG }, { t: 'Studi Kasus', fill: '1B2233', color: 'B9C0CE' }], 2.2);
  s.addText([
    { text: 'Canada’s Oil Sands', options: { color: W } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 2.72, w: 9.4, h: 1.2, fontFace: F, fontSize: 46, bold: true, margin: 0, lineSpacing: 52 });
  s.addText('Most Destructive Project on Earth atau Ethical Oil? Perdebatan berlangsung dua dekade tanpa kesimpulan konklusif.', {
    isTextBox: true, x: M, y: 4.1, w: 7.6, h: 0.9, fontFace: F, fontSize: 15, color: 'B9C0CE', margin: 0, lineSpacing: 24
  });
  const spec = ['AB463C', 'FF5A2D', 'F5B722', 'C6F04A', '0FA98E', '4EA8DE', '6C7BE0', 'B8A6F5', 'E86A9B'];
  spec.forEach((c, i) => rect(pres, s, M + i * 0.42, 5.6, 0.3, 0.3, c));
  s.addNotes('Kasus ini dipilih sebagai penutup karena tidak memiliki jawaban tunggal, persis seperti pesan Figure 3.2.');
}

// ============================================================ 17 angka dua sisi
{
  const s = S([{ t: 'Kasus', fill: ORNG }, { t: 'Data Dua Sisi', outline: true }]);
  head(s, 'Manfaat Ekonomi dan Biaya Ekologis', 0.96);

  const st = [
    { v: '2,77', u: 'juta', l: 'Barel per hari pada 2017, naik dari 0,5 juta barel pada 1997', fill: ORNG },
    { v: 'CAD 1,6', u: 'T', l: 'Kontribusi terhadap perekonomian Kanada, 2017 sampai 2027', fill: LAV },
    { v: '20', u: '%', l: 'Emisi gas rumah kaca lebih tinggi daripada minyak konvensional', fill: INK, numColor: LIME },
    { v: '11', u: '%', l: 'Jejak tambang aktif yang telah direklamasi', fill: LIME }
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

  banner(pres, s, M, 6.34, CW, 0.58, 'Kedua sisi merujuk data resmi. Perbedaannya pada kriteria apa yang layak diperhitungkan.', LIME, INK, 12);
  s.addNotes('Tekankan kalimat penutup: sengketa ini bukan sengketa data, melainkan sengketa kerangka nilai.');
}

// ============================================================ 18 ethical oil
{
  const s = S([{ t: 'Kasus', fill: ORNG }, { t: 'Klaim dan Bantahan', outline: true }]);
  head(s, 'Klaim Ethical Oil', 0.96);

  card(pres, s, M, 1.9, w2, 3.86, ORNG);
  pills(pres, s, [{ t: 'Klaim', fill: INK }], 2.14, M + 0.3);
  s.addText('Ethical Oil', { isTextBox: true, x: M + 0.3, y: 2.6, w: w2 - 0.6, h: 0.4, fontFace: F, fontSize: 22, bold: true, color: W, margin: 0 });
  s.addText('Levant: konsumsi minyak Kanada lebih bertanggung jawab karena tata kelolanya demokratis dan bebas korupsi.', {
    isTextBox: true, x: M + 0.3, y: 3.06, w: w2 - 0.66, h: 0.56, fontFace: F, fontSize: 12.5, color: 'FFE8DF', margin: 0, lineSpacing: 18
  });
  const cad = [['Venezuela', '301'], ['Arab Saudi', '267'], ['Kanada', '170'], ['Iran', '158']];
  cad.forEach((c, i) => {
    const y = 3.86 + i * 0.4;
    s.addText(c[0], { isTextBox: true, x: M + 0.3, y, w: w2 - 1.6, h: 0.3, fontFace: F, fontSize: 12, bold: c[0] === 'Kanada', color: c[0] === 'Kanada' ? W : 'FFD9CB', margin: 0 });
    s.addText(c[1], { isTextBox: true, x: M + w2 - 1.6, y, w: 1.3, h: 0.3, align: 'right', fontFace: MONO, fontSize: 12, bold: c[0] === 'Kanada', color: c[0] === 'Kanada' ? W : 'FFD9CB', margin: 0 });
  });
  s.addText('Cadangan minyak terbukti terbesar, miliar barel, 2017', {
    isTextBox: true, x: M + 0.3, y: 5.44, w: w2 - 0.6, h: 0.26, fontFace: F, fontSize: 9.5, color: 'FFC9B4', margin: 0
  });

  const bx = M + w2 + 0.28;
  card(pres, s, bx, 1.9, w2, 3.86, INK);
  pills(pres, s, [{ t: 'Bantahan', fill: LIME, color: INK }], 2.14, bx + 0.3);
  const bant = [
    ['John Bennett, Sierra Club', 'Keburukan negara lain tidak relevan. Kanada memiliki kapasitas mengatur oil sands miliknya dan tidak melakukannya.'],
    ['David Suzuki, environmentalis', 'Seluruh bahan bakar fosil tidak etis pada kondisi saat ini. Kategori minyak yang etis tidak eksis.'],
    ['Greenpeace', 'Ethicaloil.org diindikasikan memperoleh pendanaan industri dan berfungsi sebagai organisasi kedok.']
  ];
  bant.forEach((b, i) => {
    const y = 2.66 + i * 1.02;
    card(pres, s, bx + 0.3, y, w2 - 0.6, 0.9, '1B2233');
    rect(pres, s, bx + 0.3, y + 0.08, 0.05, 0.74, [LIME, AMBR, LAV][i]);
    s.addText(b[0], { isTextBox: true, x: bx + 0.54, y: y + 0.09, w: w2 - 1.06, h: 0.26, fontFace: F, fontSize: 11.5, bold: true, color: W, margin: 0 });
    s.addText(b[1], { isTextBox: true, x: bx + 0.54, y: y + 0.35, w: w2 - 1.06, h: 0.5, fontFace: F, fontSize: 10.5, color: 'B9C0CE', margin: 0, lineSpacing: 14 });
  });

  banner(pres, s, M, 5.92, CW, 0.78, 'Klaim ethical oil berpijak pada perbandingan dengan produsen terburuk. Konstruksi ini bersifat relatif, bukan normatif.', AMBR, INK);
  s.addNotes('Perhatikan bentuk argumennya: whataboutism. Bahwa pihak lain lebih buruk tidak membuat tindakan sendiri menjadi benar.');
}

// ============================================================ 19 sembilan putusan
{
  const s = S([{ t: 'Sintesis', fill: ORNG }, { t: 'Sembilan Lensa', outline: true }]);
  head(s, 'Matriks Sembilan Teori', 0.96);

  const rows = [
    ['AB463C', 'Egoism', 'Generasi mendatang absen dari pasar sehingga biayanya tidak terinternalisasi', 'Netral'],
    ['FF5A2D', 'Utilitarianism', 'Act cenderung mendukung, rule menolak karena target Paris menjadi mustahil', 'Terbelah'],
    ['F5B722', 'Ethics of Duty', 'Bila seluruh negara pemilik cadangan berbuat sama, prinsipnya tidak dapat diuniversalkan', 'Menolak'],
    ['C6F04A', 'Ethics of Rights', 'Pasal 23 mendukung lapangan kerja, hak atas kesehatan dan tanah adat menentang', 'Bersyarat'],
    ['0FA98E', 'Justice', 'Manfaat tersebar nasional, beban terkonsentrasi. Kriteria pertama Rawls tidak terpenuhi', 'Menolak'],
    ['4EA8DE', 'Virtue Ethics', 'Pengukuran diri terhadap produsen terburuk merupakan standar terendah', 'Menolak'],
    ['6C7BE0', 'Ethic of Care', 'Komunitas hilir dan generasi mendatang adalah relasi, bukan variabel biaya', 'Transisi adil'],
    ['B8A6F5', 'Discourse Ethics', 'Label ethical oil lahir dari kampanye berdana industri, melanggar imparsialitas', 'Menolak proses'],
    ['E86A9B', 'Postmodern Ethics', 'Perebutan istilah oil sands dan tar sands menunjukkan bahasa membentuk penilaian moral', 'Anti absolut']
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
  s.addText('Tidak satu pun putusan berbunyi mendukung tanpa syarat, namun kesembilannya juga tidak seragam.', {
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
    [ORNG, 'Uji Kant', 'Apa yang tersisa dari target Paris bila prinsip Kanada diterapkan seluruh pemilik cadangan terbesar?'],
    [LAV, 'Uji Rawls', 'Prinsip apa yang dipilih tanpa mengetahui posisi sebagai pekerja tambang, warga adat hilir, atau generasi 2060?'],
    [TEAL, 'Uji Bennett', 'Apakah argumen keburukan komparatif memiliki daya normatif?'],
    [LIME, 'Uji Bahasa', 'Kepentingan siapa yang dilayani oleh pemilihan istilah oil sands atau tar sands?']
  ];
  q.forEach((it, i) => numRow(pres, s, {
    x: M, y: 2.12 + i * 1.02, w: CW, h: 0.92, n: i + 1, fill: it[0], t: it[1], b: it[2]
  }));

  banner(pres, s, M, 6.14, CW, 0.66, 'Simulasi discourse ethics: enam kelompok, dua menit per posisi, diakhiri perumusan norma bersama.', INK, W, 12.5);
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

  s.addText('Kesembilan teori tidak menghasilkan satu jawaban tunggal. Ketiadaan jawaban tunggal itulah pesan utamanya.', {
    isTextBox: true, x: M, y: 3.7, w: 8.2, h: 0.9, fontFace: F, fontSize: 15, color: SLATE, margin: 0, lineSpacing: 24
  });

  card(pres, s, M, 5.5, 4.5, 0.78, W);
  rect(pres, s, M, 5.56, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.65, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 5.92, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: SLATE, margin: 0 });

  rect(pres, s, M, 6.62, CW, 0.011, LINE);
  s.addText('Business Ethics · Evaluating Business Ethics', {
    isTextBox: true, x: M, y: 6.78, w: 6.4, h: 0.28, fontFace: F, fontSize: 10.5, bold: true, color: INK, margin: 0
  });
  s.addText('MBA · Universitas Gadjah Mada', {
    isTextBox: true, x: SW - M - 6.0, y: 6.78, w: 6.0, h: 0.28, align: 'right', fontFace: F, fontSize: 10.5, color: SLATE, margin: 0
  });
  s.addNotes('Tutup dengan mengulang pertanyaan pembuka mengenai ethical oil, lalu bandingkan dengan jawaban di awal sesi.');
}

report('deck 1');
pres.writeFile({ fileName: 'Deck-1-Evaluating-Business-Ethics.pptx' })
  .then(f => console.log('selesai:', f, '·', page, 'slide'));
