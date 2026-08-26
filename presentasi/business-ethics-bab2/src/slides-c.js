const L = require('./lib.js');
const { C, HEAD, BODY, M, W } = L;

module.exports = function (pres, ctx) {
  const n = ctx.n;

  // ------------------------------------ 28. DIVIDER: BAGIAN 2 STUDI KASUS
  {
    const s = pres.addSlide(); L.bg(s, C.darker);
    L.rect(pres, s, { x: 0, y: 0, w: 13.34, h: 7.5, fill: C.dark });
    L.circle(pres, s, { x: 9.7, y: 1.1, d: 5.6, fill: C.brick });
    L.circle(pres, s, { x: 8.5, y: -1.8, d: 3.0, fill: C.gold });
    L.txt(s, 'BAGIAN 2', { x: M, y: 2.06, w: 8, h: 0.34, fontSize: 13, bold: true, color: C.gold2, charSpacing: 2.2, valign: 'middle' });
    L.txt(s, 'Implementasi:\nStudi Kasus PT Djarum', { x: M, y: 2.46, w: 8.6, h: 1.7, fontSize: 40, bold: true, fontFace: HEAD, color: C.paper, valign: 'middle', lineSpacingMultiple: 0.94 });
    L.txt(s, 'Satu kasus riil Indonesia, dibaca berturut-turut dengan tiga kerangka yang sama: CSR — apa tanggung jawabnya · Stakeholder — kepada siapa · Corporate Citizenship — dengan kuasa apa.', {
      x: M, y: 4.30, w: 8.4, h: 1.05, fontSize: 15, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.15,
    });
    L.rect(pres, s, { x: M, y: 5.58, w: 1.5, h: 0.035, fill: C.gold });
    L.txt(s, 'Mengapa Djarum? Karena kasus ini menempatkan setiap lapis teori Bab 2 dalam kondisi tertekan.', {
      x: M, y: 5.82, w: 8.4, h: 0.44, fontSize: 13, italic: true, color: C.gold2, valign: 'middle',
    });
    L.foot(s, 'Framing Business Ethics · Bab 2', n(), true);
  }

  // ------------------------------------------------ 29. PROFIL & PARADOKS
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Profil perusahaan', 'PT Djarum: Raksasa Kretek dari Kudus', {
      lead: 'Berdiri 1951 di Kudus, Jawa Tengah. Salah satu dari tiga besar industri rokok Indonesia. Djarum Foundation didirikan 30 April 1986.',
      leadW: 11.6,
    });

    const stats = [
      { v: '1951', l: 'Tahun berdiri di Kudus,\nJawa Tengah', c: C.brick },
      { v: '56.000+', l: 'Tenaga kerja yang diserap\nlangsung', c: C.clay },
      { v: 'Rp35 T', l: 'Setoran cukai dan pajak ke\nnegara (2017)', c: C.sage },
      { v: '5 Bakti', l: 'Pilar program Djarum\nFoundation sejak 1986', c: C.gold },
    ];
    let x = M;
    stats.forEach((st) => {
      L.stat(pres, s, { x, y: 2.26, w: 2.875, h: 1.72, value: st.v, label: st.l, valueColor: st.c, size: 30 });
      x += 3.075;
    });

    L.txt(s, 'Paradoks yang membuat kasus ini layak dibedah', { x: M, y: 4.14, w: W, h: 0.34, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const par = [
      { t: 'Legal, tetapi produknya berisiko', d: 'Rokok adalah produk yang sah diproduksi dan dijual, sekaligus produk yang diatur ketat karena dampak kesehatannya. Kepatuhan hukum di sini tidak otomatis berarti diterima secara etis.' },
      { t: 'Kontributor ekonomi yang sangat besar', d: 'Puluhan ribu pekerja, rantai petani tembakau dan cengkeh, serta penerimaan negara dari cukai. Kudus adalah penyumbang Cukai Hasil Tembakau terbesar secara nasional.' },
      { t: 'CSR intensif, tetapi dipersoalkan', d: 'Program sosialnya luas dan berumur puluhan tahun, namun justru program itulah yang menjadi titik sengketa publik pada 2019 — bukan produknya.' },
    ];
    x = M;
    par.forEach((p, i) => {
      L.card(pres, s, { x, y: 4.54, w: 3.83, h: 1.88, fill: i === 2 ? C.tint2 : C.tint });
      L.txt(s, p.t, { x: x + 0.28, y: 4.72, w: 3.3, h: 0.5, fontSize: 13.5, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.0 });
      L.txt(s, p.d, { x: x + 0.28, y: 5.26, w: 3.3, h: 1.02, fontSize: 11, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 4.135;
    });
    L.source(s, 'Sumber: Medcom (2017); Liputan6 (2017); Djarum Foundation; DJPb Kemenkeu (2023).', 6.52);
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
  }

  // -------------------------------- 30. LENSA 1: PIRAMIDA CARROLL PADA DJARUM
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Lensa 1 · CSR', 'Piramida Carroll Diterapkan pada PT Djarum', { size: 30 });

    const rows = [
      [{ text: 'LAPIS', options: { bold: true, color: C.paper, fill: { color: C.dark }, fontSize: 11, charSpacing: 1 } },
       { text: 'TUNTUTAN MASYARAKAT', options: { bold: true, color: C.paper, fill: { color: C.dark }, fontSize: 11, charSpacing: 1 } },
       { text: 'BUKTI PADA PT DJARUM', options: { bold: true, color: C.paper, fill: { color: C.dark }, fontSize: 11, charSpacing: 1 } },
       { text: 'PENILAIAN', options: { bold: true, color: C.paper, fill: { color: C.dark }, fontSize: 11, charSpacing: 1, align: 'center' } }],
      [{ text: 'Filantropis', options: { bold: true, color: C.gold } },
       { text: 'Desired', options: { italic: true, color: C.muted } },
       { text: 'Djarum Foundation dan lima pilar Bakti sejak 1986: pendidikan, olahraga, lingkungan, budaya, dan sosial.' },
       { text: 'KUAT', options: { bold: true, color: C.sage, align: 'center' } }],
      [{ text: 'Etis', options: { bold: true, color: C.clay } },
       { text: 'Expected', options: { italic: true, color: C.muted } },
       { text: 'Titik paling dipersoalkan: produk berdampak kesehatan, dan paparan merek kepada anak melalui kegiatan sosial — meski semuanya legal.' },
       { text: 'RAPUH', options: { bold: true, color: C.brick, align: 'center' } }],
      [{ text: 'Hukum', options: { bold: true, color: C.brick2 } },
       { text: 'Required', options: { italic: true, color: C.muted } },
       { text: 'Tunduk pada ketentuan cukai dan PP No. 109/2012: peringatan kesehatan, pembatasan iklan, larangan penjualan kepada anak.' },
       { text: 'PATUH', options: { bold: true, color: C.sage, align: 'center' } }],
      [{ text: 'Ekonomi', options: { bold: true, color: C.dark } },
       { text: 'Required', options: { italic: true, color: C.muted } },
       { text: 'Lebih dari 56.000 pekerja, setoran cukai dan pajak sekitar Rp35 triliun (2017), serta rantai pasok petani tembakau dan cengkeh.' },
       { text: 'KUAT', options: { bold: true, color: C.sage, align: 'center' } }],
    ];
    s.addTable(rows, {
      x: M, y: 1.90, w: W, colW: [1.5, 1.65, 7.25, 1.7], rowH: [0.38, 0.82, 0.9, 0.9, 0.9],
      fontFace: BODY, fontSize: 11.5, color: C.ink, valign: 'middle',
      border: { type: 'solid', color: C.line, pt: 1 }, fill: { color: C.paper }, margin: [6, 10, 6, 10],
    });

    L.card(pres, s, { x: M, y: 5.90, w: W, h: 0.86, fill: C.tint2 });
    L.txt(s, [
      { text: 'Temuan analisis:  ', options: { bold: true, color: C.brick } },
      { text: 'Djarum kokoh di lapis yang ', options: { color: C.ink } },
      { text: 'required', options: { italic: true, color: C.ink } },
      { text: ' dan di lapis yang ', options: { color: C.ink } },
      { text: 'desired', options: { italic: true, color: C.ink } },
      { text: ', tetapi paling lemah justru di lapis ', options: { color: C.ink } },
      { text: 'expected', options: { italic: true, color: C.ink } },
      { text: '. Inilah persis keterbatasan model Carroll yang disebut buku: ia tidak menjelaskan apa yang harus terjadi ketika dua lapis tanggung jawab saling bertentangan.', options: { color: C.ink } },
    ], { x: M + 0.32, y: 5.90, w: 11.4, h: 0.86, fontSize: 12, valign: 'middle', lineSpacingMultiple: 1.05 });
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
    s.addNotes('Tekankan: mengisi lapis filantropis dengan sangat baik tidak menutup kekosongan di lapis etis. Carroll menyebut keempatnya harus dipenuhi berurutan.');
  }

  // ------------------------------------------- 31. LENSA 1: LIMA BAKTI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Lensa 1 · CSR', 'Lima Bakti Djarum Foundation: Bolt-on atau Built-in?', { size: 28 });

    const bakti = [
      { t: 'Bakti Pendidikan', d: 'Djarum Beasiswa Plus untuk mahasiswa S1/D4 dengan pelatihan character building, leadership development, dan nation building; peningkatan mutu pendidikan dasar, menengah, dan vokasi di Kudus (2018-2030).', c: C.brick },
      { t: 'Bakti Olahraga', d: 'PB Djarum sejak 1974; telah membina 11 atlet peraih medali Olimpiade, di antaranya Liem Swie King, Alan Budikusuma, Tontowi Ahmad/Liliyana Natsir, dan Kevin Sanjaya.', c: C.clay },
      { t: 'Bakti Lingkungan', d: 'Djarum Trees for Life: sekitar 2,3 juta pohon trembesi di jalur Pantura dan Tol Trans-Jawa, 1,1 juta mangrove, serta Pusat Pembibitan Tanaman di Kudus dan gerakan Siap Darling.', c: C.sage },
      { t: 'Bakti Budaya', d: 'Apresiasi dan pengembangan seni budaya Indonesia, dengan sasaran utama generasi muda.', c: C.gold },
      { t: 'Bakti Sosial', d: 'Donor darah, penanggulangan bencana, operasi katarak gratis, peningkatan mutu layanan kesehatan, dan perbaikan kondisi panti asuhan.', c: C.dark },
    ];
    let y = 1.86;
    bakti.forEach((b, i) => {
      L.card(pres, s, { x: M, y, w: 7.55, h: 0.86, fill: C.tint });
      L.badge(pres, s, { x: M + 0.24, y: y + 0.22, d: 0.44, text: i + 1, fill: b.c, size: 13, color: i === 3 ? C.ink : C.paper });
      L.txt(s, b.t, { x: M + 0.82, y: y + 0.10, w: 2.55, h: 0.68, fontSize: 13.5, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, b.d, { x: M + 3.42, y: y + 0.08, w: 4.05, h: 0.70, fontSize: 10, color: C.muted, valign: 'middle', lineSpacingMultiple: 1.0 });
      y += 0.94;
    });

    L.card(pres, s, { x: 8.42, y: 1.86, w: 4.28, h: 2.26, fill: C.tint2 });
    L.txt(s, 'DIBACA SEBAGAI TRADITIONAL CSR', { x: 8.70, y: 2.06, w: 3.72, h: 0.28, fontSize: 10, bold: true, color: C.brick, charSpacing: 1, valign: 'middle' });
    L.txt(s, '"CSR is bolt-on"', { x: 8.70, y: 2.36, w: 3.72, h: 0.34, fontSize: 17, bold: true, italic: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Sebagian besar program adalah distribusi nilai setelah laba dihasilkan, tidak terhubung dengan inti bisnis. Pendorongnya citra, merek, dan penerimaan publik — persis kolom "Traditional CSR" pada Tabel 2.2.', {
      x: 8.70, y: 2.76, w: 3.72, h: 1.20, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06 });

    L.card(pres, s, { x: 8.42, y: 4.24, w: 4.28, h: 2.26, fill: C.dark });
    L.txt(s, 'UNSUR CONTEMPORARY CSR', { x: 8.70, y: 4.44, w: 3.72, h: 0.28, fontSize: 10, bold: true, color: C.gold2, charSpacing: 1, valign: 'middle' });
    L.txt(s, '"CSR is built-in"', { x: 8.70, y: 4.74, w: 3.72, h: 0.34, fontSize: 17, bold: true, italic: true, color: C.paper, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Sebagian program mendekati kategori ini: pendidikan vokasi di Kudus memperkuat basis tenaga kerja daerah operasi, dan penghijauan menjaga social licence to operate. Keduanya menciptakan nilai, bukan sekadar membagikannya.', {
      x: 8.70, y: 5.14, w: 3.72, h: 1.20, fontSize: 11.5, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.06 });

    L.source(s, 'Sumber: Djarum Foundation; PB Djarum; Kompas Lestari (2024); ANTARA (2024).', 6.60);
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
  }

  // ------------------------------- 32. LENSA 1: KRITIK CSR SEBAGAI LEGITIMASI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Lensa 1 · CSR', 'Kritik: CSR sebagai Alat Legitimasi?', {
      lead: 'Bagian ini menerapkan kritik CSR dari buku (Friedman, Banerjee, Fleming & Jones) langsung pada kasus.',
      leadW: 11.6,
    });

    L.card(pres, s, { x: M, y: 2.28, w: 6.2, h: 3.34, fill: C.tint });
    L.txt(s, 'FAKTA YANG DIPERSOALKAN', { x: M + 0.28, y: 2.48, w: 5.64, h: 0.28, fontSize: 10.5, bold: true, color: C.brick, charSpacing: 1.3, valign: 'middle' });
    const facts = [
      'PP No. 109/2012 dinilai longgar dalam membatasi promosi dan sponsor yang dijalankan atas nama CSR perusahaan tembakau — sebuah celah regulasi.',
      'Yayasan Lentera Anak mencatat bahwa pada 2015-2018 peserta audisi diwajibkan mengenakan kaos ber-brand "Djarum", yang merupakan brand image produk tembakau.',
      'Survei yang dirujuk KPAI menemukan 4 dari 5 anak mengasosiasikan "Djarum" dengan rokok.',
      'Kegiatan sosial menjangkau anak-anak — kelompok yang secara hukum justru dilindungi dari paparan promosi produk tembakau.',
    ];
    let fy = 2.82;
    facts.forEach((f) => {
      L.circle(pres, s, { x: M + 0.30, y: fy + 0.14, d: 0.13, fill: C.brick });
      L.txt(s, f, { x: M + 0.58, y: fy, w: 5.34, h: 0.62, fontSize: 11.5, color: C.ink, valign: 'top', lineSpacingMultiple: 1.05 });
      fy += 0.70;
    });

    L.txt(s, 'Dibaca lewat teori Bab 2', { x: 7.25, y: 2.28, w: 5.45, h: 0.32, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const reads = [
      { a: 'Friedman (1970)', d: 'Bila motif utamanya promosi, ini bukan CSR melainkan maksimalisasi laba "under the cloak of social responsibility".' },
      { a: 'Banerjee (2007)', d: 'CSR di sini berfungsi melegitimasi aktivitas korporasi dan mengonsolidasi kekuasaannya — bukan mengoreksinya.' },
      { a: 'Fleming & Jones (2012)', d: 'CSR menopang, bukan menantang, model bisnis yang ada. Tidak ada transformasi nyata dalam peran bisnis di masyarakat.' },
    ];
    let ry = 2.70;
    reads.forEach((r) => {
      L.card(pres, s, { x: 7.25, y: ry, w: 5.45, h: 0.94, fill: C.tint2 });
      L.txt(s, r.a, { x: 7.51, y: ry + 0.12, w: 4.95, h: 0.26, fontSize: 12, bold: true, color: C.brick, valign: 'middle' });
      L.txt(s, r.d, { x: 7.51, y: ry + 0.38, w: 4.95, h: 0.48, fontSize: 10.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.02 });
      ry += 1.02;
    });

    L.card(pres, s, { x: 7.25, y: 5.76, w: 5.45, h: 0.94, fill: C.dark });
    L.txt(s, 'Argumen tandingan', { x: 7.51, y: 5.88, w: 4.95, h: 0.26, fontSize: 12, bold: true, color: C.gold2, valign: 'middle' });
    L.txt(s, 'Manfaat bagi penerima — beasiswa, pembinaan atlet, penghijauan — tetap nyata dan terukur. Inilah dilema klasik buku: menilai motif, atau menilai dampak?', {
      x: 7.51, y: 6.14, w: 4.95, h: 0.48, fontSize: 10.5, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.02 });

    L.source(s, 'Sumber: KPAI (2019); Yayasan Lentera Anak; PSHK/Jentera; PP No. 109 Tahun 2012.', 5.78);
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
  }

  // ------------------------------------- 33. LENSA 2: PETA STAKEHOLDER
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Lensa 2 · Stakeholder', 'Peta Stakeholder PT Djarum', {
      lead: 'Disusun dengan dua prinsip Evan & Freeman: siapa yang haknya dapat dilanggar, dan siapa yang terkena dampak tindakan perusahaan.',
      leadW: 11.6,
    });

    const quad = [
      { t: 'Stakeholder primer', d: 'Karyawan (56.000+) · Petani tembakau dan cengkeh · Konsumen dewasa · Pemasok dan distributor · Pemilik dan pemegang saham', c: C.brick },
      { t: 'Pemerintah dan regulator', d: 'Kemenkeu dan Bea Cukai (penerimaan cukai) · Kemenkes (pengendalian tembakau) · Kemenpora dan PBSI (olahraga) · Pemkab Kudus dan Pemprov Jawa Tengah', c: C.clay },
      { t: 'Masyarakat sipil', d: 'KPAI · Yayasan Lentera Anak · Komnas Pengendalian Tembakau dan LSM kesehatan · Media massa · Akademisi dan peneliti', c: C.sage },
      { t: 'Penerima manfaat dan komunitas', d: 'Beswan Djarum · Atlet binaan dan peserta audisi (anak-anak) · Orang tua peserta · Masyarakat Kudus · Pengguna jalan Pantura', c: C.gold },
    ];
    quad.forEach((q, i) => {
      const cx = M + (i % 2) * 6.15;
      const cy = 2.28 + Math.floor(i / 2) * 1.66;
      L.card(pres, s, { x: cx, y: cy, w: 5.95, h: 1.48, fill: C.tint });
      L.circle(pres, s, { x: cx + 0.3, y: cy + 0.28, d: 0.16, fill: q.c });
      L.txt(s, q.t, { x: cx + 0.58, y: cy + 0.16, w: 5.1, h: 0.34, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, q.d, { x: cx + 0.3, y: cy + 0.56, w: 5.35, h: 0.78, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06 });
    });

    L.card(pres, s, { x: M, y: 5.50, w: W, h: 1.30, fill: C.dark });
    L.txt(s, 'Mengapa anak-anak peserta audisi adalah stakeholder', { x: M + 0.32, y: 5.64, w: 11.4, h: 0.3, fontSize: 13.5, bold: true, color: C.gold2, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Mereka tidak punya hubungan kontraktual dengan PT Djarum. Namun lewat principle of corporate effect, perusahaan bertanggung jawab atas dampak tindakannya terhadap pihak lain — dan lewat principle of corporate rights, ia wajib tidak melanggar hak anak. Model jejaring Rowley (1997) menjelaskan jalurnya: Djarum terhubung ke anak-anak itu melalui klub, federasi, dan orang tua mereka.', {
      x: M + 0.32, y: 5.94, w: 11.4, h: 0.80, fontSize: 11.5, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.06 });
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
  }

  // -------------------------------------- 34. LENSA 2: BENTURAN KLAIM
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Lensa 2 · Stakeholder', 'Klaim yang Tidak Bisa Dipuaskan Sekaligus', { size: 30,
      lead: 'Freeman menyebut penyeimbangan ekspektasi stakeholder sebagai tantangan besar manajemen. Kasus ini memperlihatkan alasannya.' });

    const rows = [
      [{ text: 'STAKEHOLDER', options: { bold: true, color: C.paper, fill: { color: C.dark }, fontSize: 11, charSpacing: 1 } },
       { text: 'KLAIM YANG DIAJUKAN', options: { bold: true, color: C.paper, fill: { color: C.dark }, fontSize: 11, charSpacing: 1 } },
       { text: 'BERBENTURAN DENGAN', options: { bold: true, color: C.paper, fill: { color: C.dark }, fontSize: 11, charSpacing: 1 } }],
      [{ text: 'Karyawan dan petani tembakau', options: { bold: true } },
       { text: 'Penghidupan dan kelangsungan pekerjaan' },
       { text: 'Agenda pengendalian tembakau dan penurunan prevalensi merokok' }],
      [{ text: 'Kemenkeu dan Bea Cukai', options: { bold: true } },
       { text: 'Penerimaan cukai yang stabil dan besar' },
       { text: 'Kemenkes: target kesehatan publik — dua organ negara, dua kepentingan' }],
      [{ text: 'Konsumen dewasa', options: { bold: true } },
       { text: 'Kebebasan memilih produk yang legal' },
       { text: 'Hak anak dan remaja atas perlindungan dari paparan merek' }],
      [{ text: 'Atlet binaan dan beswan', options: { bold: true } },
       { text: 'Akses pembinaan dan beasiswa yang sulit didapat di tempat lain' },
       { text: 'Masyarakat sipil: penolakan normalisasi merek rokok di ruang anak' }],
      [{ text: 'Pemilik dan pemegang saham', options: { bold: true } },
       { text: 'Laba dan keberlanjutan bisnis jangka panjang' },
       { text: 'Tuntutan etis publik yang menekan legitimasi industri' }],
    ];
    s.addTable(rows, {
      x: M, y: 2.44, w: W, colW: [3.1, 4.5, 4.5], rowH: [0.38, 0.62, 0.62, 0.62, 0.66, 0.62],
      fontFace: BODY, fontSize: 11.5, color: C.ink, valign: 'middle',
      border: { type: 'solid', color: C.line, pt: 1 }, fill: { color: C.paper }, margin: [6, 10, 6, 10],
    });

    L.card(pres, s, { x: M, y: 6.06, w: W, h: 0.7, fill: C.tint2 });
    L.txt(s, [
      { text: 'Konsekuensi teoretis:  ', options: { bold: true, color: C.brick } },
      { text: 'tidak ada keputusan yang memuaskan semua pihak. Karena itu pendekatan Carroll saja tidak cukup — dibutuhkan stakeholder democracy dan dialog terlembaga untuk memutuskan klaim mana yang didahulukan, dan dengan alasan apa.', options: { color: C.ink } },
    ], { x: M + 0.32, y: 6.06, w: 11.4, h: 0.7, fontSize: 12, valign: 'middle', lineSpacingMultiple: 1.04 });
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
  }

  // -------------------------- 35. LENSA 3: HAK KEWARGANEGARAAN PADA DJARUM
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Lensa 3 · Corporate Citizenship', 'Djarum dan Tiga Hak Kewarganegaraan', { size: 30 });

    const rights = [
      { t: 'Hak sosial', role: 'PROVIDER', c: C.sage,
        d: 'Beasiswa pendidikan tinggi, peningkatan mutu SMK dan pendidikan dasar di Kudus, operasi katarak gratis dan layanan kesehatan, penghijauan, serta infrastruktur olahraga.',
        note: 'Persis skenario "pemerintah tidak mampu atau tidak sepenuhnya menjangkau" dalam Bab 2 — perusahaan mengisi ruang layanan publik.' },
      { t: 'Hak sipil', role: 'ENABLER  &  DISABLER', c: C.clay,
        d: 'Membuka akses ekonomi dan mobilitas sosial bagi puluhan ribu pekerja dan penerima program. Pada saat yang sama dipersoalkan karena paparan merek produk tembakau kepada anak.',
        note: 'Peran ganda inilah yang membuat penilaiannya tidak bisa hitam-putih: memampukan sebagian hak, membatasi hak lain.' },
      { t: 'Hak politik', role: 'CHANNEL  &  BLOCKAGE', c: C.brick,
        d: 'Industri tembakau adalah aktor berpengaruh dalam perdebatan regulasi, termasuk revisi PP No. 109/2012. Sebaliknya, publik dan LSM menyalurkan tekanan politik lewat korporasi, bukan hanya lewat negara.',
        note: 'Sesuai pengamatan Hertz (2001): warga makin mengarahkan aksi politik kepada perusahaan, bukan kepada pemerintah.' },
    ];
    let x = M;
    rights.forEach((r) => {
      L.card(pres, s, { x, y: 1.90, w: 3.83, h: 3.90, fill: C.tint });
      L.txt(s, r.t, { x: x + 0.28, y: 2.10, w: 3.3, h: 0.38, fontSize: 19, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.rect(pres, s, { x: x + 0.28, y: 2.54, w: 3.3, h: 0.42, fill: r.c, radius: 0.08 });
      L.txt(s, r.role, { x: x + 0.28, y: 2.54, w: 3.3, h: 0.42, fontSize: 10, bold: true, color: C.paper, align: 'center', valign: 'middle', charSpacing: 0.6 });
      L.txt(s, r.d, { x: x + 0.28, y: 3.08, w: 3.3, h: 1.44, fontSize: 11.5, color: C.ink, valign: 'top', lineSpacingMultiple: 1.06 });
      L.txt(s, r.note, { x: x + 0.28, y: 4.58, w: 3.3, h: 1.06, fontSize: 10.5, italic: true, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 4.135;
    });

    L.card(pres, s, { x: M, y: 5.98, w: W, h: 0.84, fill: C.dark });
    L.txt(s, 'Dalam extended view, PT Djarum adalah aktor politik de facto — terlepas dari motifnya, karena konsep ini bersifat deskriptif, bukan normatif. Konsekuensinya: tuntutan akuntabilitas dan transparansi setara aktor publik menjadi wajar, bukan berlebihan.', {
      x: M + 0.32, y: 5.98, w: 11.4, h: 0.84, fontSize: 12.5, bold: true, color: C.paper, valign: 'middle', lineSpacingMultiple: 1.05 });
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
  }

  // ------------------------- 36. LENSA 3: KRONOLOGI KASUS KPAI 2019
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Lensa 3 · Akuntabilitas diuji', 'Kronologi Polemik Audisi Bulu Tangkis, 2019', { size: 29 });

    const events = [
      { y: '2006– 18', t: 'Audisi Umum PB Djarum berjalan terbuka', d: 'Yayasan Lentera Anak mencatat peserta diwajibkan mengenakan kaos ber-brand "Djarum" sepanjang 2015-2018.', c: C.muted },
      { y: 'Jul 2019', t: 'Audisi di GOR KONI Bandung memicu polemik', d: 'KPAI menilai terdapat unsur eksploitasi terselubung oleh industri tembakau: tubuh anak dipakai sebagai media promosi gratis.', c: C.brick },
      { y: 'Sep 2019', t: 'PB Djarum menyatakan menghentikan audisi mulai 2020', d: 'Polemik meluas ke ruang publik; dukungan dan kritik datang dari berbagai pihak, termasuk terhadap sikap KPAI sendiri.', c: C.brick },
      { y: '12 Sep 2019', t: 'Mediasi di Kemenpora menghasilkan tiga kesepakatan', d: '(1) KPAI mencabut surat permintaan penghentian; (2) nama diubah menjadi "Audisi Umum Beasiswa Bulutangkis" tanpa logo, merek, dan brand image Djarum; (3) audisi dilanjutkan setelah konsolidasi internal.', c: C.sage },
      { y: '2020– 25', t: 'Audisi berlanjut', d: 'Pada 2024, 11 dari 1.966 peserta memperoleh beasiswa; pada 2025, 9 atlet terpilih dari 1.729 peserta di GOR Djarum, Kudus.', c: C.gold },
    ];
    const axisX = 1.62;
    L.rect(pres, s, { x: axisX - 0.01, y: 2.02, w: 0.022, h: 3.44, fill: C.line });
    let ey = 1.90;
    events.forEach((e) => {
      L.txt(s, e.y, { x: M, y: ey + 0.02, w: 0.84, h: 0.3, fontSize: 10.5, bold: true, color: e.c, align: 'right', valign: 'middle' });
      L.circle(pres, s, { x: axisX - 0.11, y: ey + 0.06, d: 0.22, fill: e.c });
      L.txt(s, e.t, { x: axisX + 0.28, y: ey, w: 10.8, h: 0.32, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, e.d, { x: axisX + 0.28, y: ey + 0.32, w: 10.8, h: 0.46, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.03 });
      ey += 0.82;
    });

    L.card(pres, s, { x: M, y: 6.06, w: W, h: 0.74, fill: C.tint2 });
    L.txt(s, [
      { text: 'Dibaca lewat teori:  ', options: { bold: true, color: C.brick } },
      { text: 'inilah corporate accountability yang bekerja — tekanan masyarakat sipil memaksa korporasi merespons, tanpa melewati satu pun kotak suara. Isi kesepakatannya sendiri adalah soal transparansi: memisahkan secara terlihat mana pembinaan dan mana promosi.', options: { color: C.ink } },
    ], { x: M + 0.32, y: 6.06, w: 11.4, h: 0.74, fontSize: 11.5, valign: 'middle', lineSpacingMultiple: 1.03 });
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
    s.addNotes('Sumber kronologi: KPAI (2019); CNN Indonesia (12/9/2019); Kompas; Tempo; Tirto; ANTARA (2025); PB Djarum (2024).');
  }

  // ------------------------------------------------------ 37. SINTESIS
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Sintesis', 'Tiga Kerangka, Satu Kasus', {
      lead: 'Ketiganya tidak saling menggantikan. Masing-masing menjawab pertanyaan yang berbeda, dan baru bersama-sama membentuk gambar utuh.',
      leadW: 11.6,
    });
    const syn = [
      { k: 'CSR', q: 'APA tanggung jawabnya?', d: 'Djarum memenuhi lapis ekonomi, hukum, dan filantropis dengan kuat; lapis etis adalah titik paling rapuh. Program yang ada sebagian besar bolt-on, belum built-in.', c: C.brick },
      { k: 'STAKEHOLDER', q: 'KEPADA SIAPA?', d: 'Klaim antar-stakeholder saling bertentangan dan tidak dapat dipuaskan sekaligus. Anak-anak peserta audisi adalah stakeholder sah berdasarkan principle of corporate effect, meski tanpa hubungan kontraktual.', c: C.clay },
      { k: 'CORPORATE CITIZENSHIP', q: 'DENGAN KUASA APA?', d: 'Djarum mengambil peran kuasi-pemerintah di bidang pendidikan, kesehatan, olahraga, dan lingkungan. Karena itu tuntutan akuntabilitas dan transparansi setara aktor publik menjadi konsekuensi logis.', c: C.sage },
    ];
    let y = 2.20;
    syn.forEach((sy) => {
      L.card(pres, s, { x: M, y, w: W, h: 1.24, fill: C.tint });
      L.txt(s, sy.k, { x: M + 0.32, y: y + 0.20, w: 3.0, h: 0.36, fontSize: 15, bold: true, color: sy.c, fontFace: HEAD, valign: 'middle' });
      L.txt(s, sy.q, { x: M + 0.32, y: y + 0.58, w: 3.0, h: 0.3, fontSize: 11, italic: true, color: C.muted, valign: 'middle' });
      L.txt(s, sy.d, { x: M + 3.62, y: y + 0.20, w: 8.16, h: 0.86, fontSize: 12.5, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.06 });
      y += 1.34;
    });

    L.card(pres, s, { x: M, y: 6.26, w: W, h: 0.7, fill: C.dark });
    L.txt(s, 'Nilai tambah corporate citizenship menurut buku: memperjelas peran politik korporasi, mempertajam tuntutan akuntabilitas, membantu memahami tantangan globalisasi, dan membuka perspektif yang lebih kritis atas peran sosial bisnis.', {
      x: M + 0.32, y: 6.26, w: 11.4, h: 0.7, fontSize: 11.5, color: C.paper, valign: 'middle', lineSpacingMultiple: 1.04 });
    L.foot(s, 'Bagian 2 · Studi Kasus PT Djarum', n());
  }

  // ----------------------------------------------------- 38. KESIMPULAN
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Penutup', 'Kesimpulan');
    const con = [
      'Korporasi memiliki tanggung jawab moral yang melampaui tanggung jawab individu di dalamnya — melalui legal identity, agency, budaya organisasi, dan identitas fungsionalnya. Inilah dasar untuk menuntut PT Djarum sebagai entitas, bukan hanya manajernya.',
      'CSR Djarum kuat di lapis yang required dan desired, tetapi rapuh di lapis yang expected. Kasus ini memperlihatkan keterbatasan piramida Carroll: model itu diam ketika dua lapis tanggung jawab berbenturan.',
      'Sebagian besar program masih berkarakter bolt-on. Bergeser ke built-in menuntut integrasi dengan inti bisnis dan rantai nilai, bukan sekadar mendistribusikan sebagian laba.',
      'Melalui principle of corporate effect, anak-anak peserta audisi adalah stakeholder yang sah meski tidak terikat kontrak apa pun dengan perusahaan.',
      'Dalam extended view of corporate citizenship, Djarum adalah aktor politik de facto. Karena itu tuntutan akuntabilitas dan transparansi bukan tuntutan yang berlebihan, melainkan konsekuensi logis dari peran yang sudah diambilnya.',
    ];
    let y = 1.82;
    con.forEach((c, i) => {
      L.card(pres, s, { x: M, y, w: W, h: 0.94, fill: i % 2 === 0 ? C.tint : C.tint2 });
      L.badge(pres, s, { x: M + 0.28, y: y + 0.25, d: 0.44, text: i + 1, fill: [C.dark, C.brick, C.brick2, C.clay, C.sage][i], size: 13 });
      L.txt(s, c, { x: M + 0.88, y: y + 0.10, w: 10.9, h: 0.74, fontSize: 12, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.05 });
      y += 1.02;
    });
    L.foot(s, 'Penutup', n());
  }

  // ---------------------------------------------------- 39. REKOMENDASI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Penutup', 'Rekomendasi', {
      lead: 'Empat untuk perusahaan, satu untuk pembuat kebijakan — semuanya diturunkan langsung dari kerangka Bab 2.',
    });
    const rec = [
      { t: 'Pisahkan identitas program dari merek', d: 'Lanjutkan dan perluas prinsip kesepakatan 2019: kegiatan sosial dijalankan tanpa logo, merek, dan brand image yang beririsan dengan produk tembakau — terutama pada kegiatan yang melibatkan anak.', c: C.brick, tag: 'DARI KRITIK CSR' },
      { t: 'Geser CSR dari bolt-on menjadi built-in', d: 'Prioritaskan program yang terhubung dengan rantai nilai: kesejahteraan dan produktivitas petani tembakau dan cengkeh, keselamatan kerja, serta penyiapan transisi ekonomi Kudus.', c: C.clay, tag: 'DARI TABEL 2.2' },
      { t: 'Perkuat transparansi pelaporan', d: 'Susun laporan keberlanjutan yang memenuhi disclosure, clarity, dan accuracy — termasuk mengungkapkan belanja program sosial dan belanja pemasaran secara terpisah, agar batas keduanya dapat dinilai publik.', c: C.sage, tag: 'DARI TRANSPARANSI' },
      { t: 'Lembagakan dialog stakeholder', d: 'Bangun forum reguler dengan regulator, masyarakat sipil, dan komunitas terdampak — bukan hanya mediasi ketika krisis sudah terjadi. Ini wujud praktis stakeholder democracy.', c: C.gold, tag: 'DARI STAKEHOLDER' },
    ];
    rec.forEach((r, i) => {
      const cx = M + (i % 2) * 6.15;
      const cy = 2.14 + Math.floor(i / 2) * 1.96;
      L.card(pres, s, { x: cx, y: cy, w: 5.95, h: 1.8, fill: C.tint });
      L.badge(pres, s, { x: cx + 0.28, y: cy + 0.24, d: 0.44, text: i + 1, fill: r.c, size: 13, color: i === 3 ? C.ink : C.paper });
      L.txt(s, r.tag, { x: cx + 0.86, y: cy + 0.24, w: 4.8, h: 0.2, fontSize: 8.5, bold: true, color: r.c, charSpacing: 1, valign: 'middle' });
      L.txt(s, r.t, { x: cx + 0.86, y: cy + 0.44, w: 4.8, h: 0.28, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, r.d, { x: cx + 0.3, y: cy + 0.82, w: 5.35, h: 0.84, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06 });
    });

    L.card(pres, s, { x: M, y: 6.06, w: W, h: 0.78, fill: C.dark });
    L.txt(s, [
      { text: 'Bagi pembuat kebijakan:  ', options: { bold: true, color: C.gold2 } },
      { text: 'tutup celah CSR dalam revisi PP No. 109/2012, sehingga batas antara filantropi dan promosi produk tembakau menjadi tegas dan dapat ditegakkan — bukan diserahkan pada mediasi kasus per kasus.', options: { color: C.paper } },
    ], { x: M + 0.32, y: 6.06, w: 11.4, h: 0.78, fontSize: 12, valign: 'middle', lineSpacingMultiple: 1.04 });
    L.foot(s, 'Penutup', n());
  }

  // ----------------------------------------------------- 40. REFERENSI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Penutup', 'Referensi');

    L.card(pres, s, { x: M, y: 1.80, w: W, h: 1.02, fill: C.dark });
    L.txt(s, 'SUMBER UTAMA', { x: M + 0.32, y: 1.94, w: 5, h: 0.26, fontSize: 10, bold: true, color: C.gold2, charSpacing: 1.4, valign: 'middle' });
    L.txt(s, 'Crane, A., Matten, D., Glozer, S., & Spence, L. (2019). Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization (5th ed.). Oxford University Press — Bab 2: Framing Business Ethics, hlm. 44-78.', {
      x: M + 0.32, y: 2.20, w: 11.4, h: 0.52, fontSize: 12, color: C.paper, valign: 'top', lineSpacingMultiple: 1.05 });

    L.txt(s, 'Rujukan teori di dalam bab', { x: M, y: 3.00, w: 5.95, h: 0.3, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const theory = [
      'Friedman, M. (1970). The social responsibility of business is to increase its profits.',
      'Carroll, A. B. (1991). The pyramid of corporate social responsibility. Business Horizons.',
      'Freeman, R. E. (1984). Strategic Management: A Stakeholder Approach.',
      'Evan, W. & Freeman, R. E. (1993); Donaldson, T. & Preston, L. (1995).',
      'Matten, D. & Crane, A. (2005); Matten, D. & Moon, J. (2008).',
      'Wood, D. (1991); Rowley, T. (1997); Marshall, T. H. (1965).',
      'Porter, M. & Kramer, M. (2006); Crane et al. (2014).',
      'Schnackenberg, A. & Tomlinson, E. (2014); Fleming, P. & Jones, M. (2012).',
    ];
    let y = 3.36;
    theory.forEach((t) => {
      L.circle(pres, s, { x: M + 0.02, y: y + 0.11, d: 0.1, fill: C.brick });
      L.txt(s, t, { x: M + 0.26, y: y, w: 5.69, h: 0.38, fontSize: 10.5, color: C.ink, valign: 'top', lineSpacingMultiple: 1.0 });
      y += 0.42;
    });

    L.txt(s, 'Sumber data kasus PT Djarum', { x: 6.75, y: 3.00, w: 5.95, h: 0.3, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const cases = [
      'Peraturan Pemerintah No. 109 Tahun 2012 tentang Pengamanan Bahan yang Mengandung Zat Adiktif berupa Produk Tembakau bagi Kesehatan.',
      'KPAI (2019), "Audisi Djarum Beasiswa Bulutangkis: Hentikan Penggunaan Anak untuk Promosi".',
      'CNN Indonesia (12 September 2019), "3 Kesepakatan Hasil Mediasi PB Djarum dan KPAI".',
      'Tempo, Kompas, Tirto (2019) — liputan polemik audisi PB Djarum.',
      'Medcom (2017); Liputan6 (2017) — setoran cukai dan pajak PT Djarum.',
      'Kompas Lestari (2024); ANTARA (2024) — Bakti Lingkungan Djarum Foundation.',
      'ANTARA (2025); PB Djarum (2024) — hasil Audisi Umum Beasiswa Bulutangkis.',
      'djarumfoundation.org; pbdjarum.org; djarumbeasiswaplus.org.',
    ];
    y = 3.36;
    cases.forEach((t) => {
      L.circle(pres, s, { x: 6.77, y: y + 0.11, d: 0.1, fill: C.sage });
      L.txt(s, t, { x: 7.01, y: y, w: 5.69, h: 0.38, fontSize: 10.5, color: C.ink, valign: 'top', lineSpacingMultiple: 1.0 });
      y += 0.42;
    });
    L.foot(s, 'Penutup', n());
  }

  // ------------------------------------------------- 41. TERIMA KASIH
  {
    const s = pres.addSlide(); L.bg(s, C.dark);
    L.circle(pres, s, { x: 9.9, y: 1.6, d: 5.2, fill: C.brick });
    L.circle(pres, s, { x: 11.4, y: -1.0, d: 2.6, fill: C.gold });
    L.txt(s, 'SESI DISKUSI', { x: M, y: 2.42, w: 8, h: 0.34, fontSize: 13, bold: true, color: C.gold2, charSpacing: 2.2, valign: 'middle' });
    L.txt(s, 'Terima kasih', { x: M, y: 2.82, w: 8.4, h: 1.1, fontSize: 48, bold: true, fontFace: HEAD, color: C.paper, valign: 'middle' });
    L.txt(s, 'Pertanyaan pemantik untuk diskusi kelas:', { x: M, y: 4.06, w: 8.4, h: 0.32, fontSize: 13, color: C.onDarkMuted, valign: 'middle' });
    const qs = [
      'Jika manfaat programnya nyata, apakah motif di baliknya masih relevan untuk dinilai?',
      'Bolehkah perusahaan dengan produk berisiko mengambil peran kuasi-pemerintah di ruang anak?',
      'Siapa yang seharusnya mengisi kekosongan itu jika program semacam ini dihentikan?',
    ];
    let y = 4.44;
    qs.forEach((q, i) => {
      L.badge(pres, s, { x: M, y: y + 0.02, d: 0.4, text: i + 1, fill: C.gold, size: 12, color: C.ink });
      L.txt(s, q, { x: M + 0.56, y, w: 7.9, h: 0.44, fontSize: 13, color: C.paper, valign: 'middle' });
      y += 0.62;
    });
    L.foot(s, 'Framing Business Ethics · Bab 2 · Studi Kasus PT Djarum', n(), true);
  }
};
