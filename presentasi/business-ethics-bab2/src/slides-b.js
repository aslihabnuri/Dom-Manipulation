const L = require('./lib.js');
const { C, HEAD, BODY, M, W } = L;

module.exports = function (pres, ctx) {
  const n = ctx.n;

  // ------------------------------------ 18. DIVIDER: KERANGKA 2 STAKEHOLDER
  {
    const s = pres.addSlide(); L.bg(s, C.dark);
    L.circle(pres, s, { x: 10.4, y: -1.4, d: 4.4, fill: C.clay });
    L.circle(pres, s, { x: 9.9, y: 3.9, d: 2.4, fill: C.brick });
    L.txt(s, 'KERANGKA 2', { x: M, y: 2.28, w: 8, h: 0.34, fontSize: 13, bold: true, color: C.gold2, charSpacing: 2.2, valign: 'middle' });
    L.txt(s, 'Stakeholder Theory\nof the Firm', { x: M, y: 2.68, w: 9.0, h: 1.7, fontSize: 42, bold: true, fontFace: HEAD, color: C.paper, valign: 'middle', lineSpacingMultiple: 0.94 });
    L.txt(s, 'Berbeda dari CSR yang berangkat dari perusahaan dan tanggung jawabnya,\npendekatan stakeholder berangkat dari kelompok-kelompok kepada siapa perusahaan bertanggung jawab.', {
      x: M, y: 4.52, w: 8.6, h: 0.9, fontSize: 15, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.15,
    });
    L.foot(s, 'Framing Business Ethics · Bab 2', n(), true);
  }

  // ---------------------------------------------- 19. DEFINISI STAKEHOLDER
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Edward Freeman (1984)', 'Siapa yang Disebut Stakeholder?');

    L.card(pres, s, { x: M, y: 1.90, w: W, h: 1.42, fill: C.dark });
    L.txt(s, 'DEFINISI DALAM BUKU', { x: M + 0.36, y: 2.08, w: 5, h: 0.28, fontSize: 10.5, bold: true, color: C.gold2, charSpacing: 1.5, valign: 'middle' });
    L.txt(s, '"Individu atau kelompok yang, dalam konteks situasi tertentu, dirugikan oleh atau memperoleh manfaat dari korporasi, atau yang haknya harus dihormati oleh korporasi."', {
      x: M + 0.36, y: 2.38, w: 11.3, h: 0.8, fontSize: 16.5, italic: true, color: C.paper, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.05,
    });

    L.txt(s, 'Dua prinsip penentu (Evan & Freeman 1993)', { x: M, y: 3.52, w: 6.2, h: 0.32, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const prin = [
      { t: 'Principle of corporate rights', d: 'Korporasi berkewajiban untuk tidak melanggar hak pihak lain.' },
      { t: 'Principle of corporate effect', d: 'Korporasi bertanggung jawab atas dampak tindakannya terhadap pihak lain.' },
    ];
    let y = 3.94;
    prin.forEach((p, i) => {
      L.card(pres, s, { x: M, y, w: 6.2, h: 1.0, fill: C.tint });
      L.badge(pres, s, { x: M + 0.26, y: y + 0.28, d: 0.44, text: i + 1, fill: [C.brick, C.clay][i], size: 13 });
      L.txt(s, p.t, { x: M + 0.86, y: y + 0.16, w: 5.1, h: 0.32, fontSize: 13.5, bold: true, color: C.ink, valign: 'middle' });
      L.txt(s, p.d, { x: M + 0.86, y: y + 0.48, w: 5.1, h: 0.42, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.02 });
      y += 1.10;
    });
    L.txt(s, 'Karena itu, cakupan stakeholder berbeda dari satu perusahaan ke perusahaan lain — bahkan berbeda bagi perusahaan yang sama dalam situasi, tugas, atau proyek yang berbeda.', {
      x: M, y: 6.16, w: 6.2, h: 0.6, fontSize: 11.5, italic: true, color: C.brick, valign: 'top', lineSpacingMultiple: 1.03,
    });

    L.txt(s, 'Perkembangan definisi (Tabel 2.4)', { x: 7.25, y: 3.52, w: 5.45, h: 0.32, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const defs = [
      ['Stanford memo (1963)', '"kelompok yang tanpa dukungannya organisasi akan berhenti eksis"'],
      ['Freeman (1984)', '"dapat memengaruhi atau dipengaruhi oleh pencapaian tujuan organisasi"'],
      ['Hill & Jones (1992)', '"konstituen dengan klaim sah atas perusahaan melalui hubungan pertukaran"'],
      ['Clarkson (1995)', '"memiliki, atau mengklaim, kepemilikan, hak, atau kepentingan atas korporasi dan aktivitasnya"'],
    ];
    let dy = 3.94;
    defs.forEach((d) => {
      L.txt(s, d[0], { x: 7.25, y: dy, w: 5.45, h: 0.26, fontSize: 11.5, bold: true, color: C.brick, valign: 'middle' });
      L.txt(s, d[1], { x: 7.25, y: dy + 0.26, w: 5.45, h: 0.42, fontSize: 11, italic: true, color: C.muted, valign: 'top', lineSpacingMultiple: 1.0 });
      dy += 0.76;
    });
    L.foot(s, 'Kerangka 2 · Stakeholder', n());
  }

  // ------------------------------------------------ 20. TIGA MODEL FIRM
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Figure 2.3 · Stakeholder theories of the firm', 'Dari Perusahaan Milik Pemegang Saham ke Jejaring', { size: 28 });

    // --- wheel (model b)
    const cx = 3.8, cy = 4.35;
    const nodes = [
      { t: 'Pemegang saham', x: 2.925, y: 2.58 },
      { t: 'Karyawan', x: 4.90, y: 3.40 },
      { t: 'Konsumen', x: 4.90, y: 4.86 },
      { t: 'Pemasok', x: 2.925, y: 5.66 },
      { t: 'Masyarakat sipil', x: 1.00, y: 4.86 },
      { t: 'Pemerintah', x: 1.00, y: 3.40 },
    ];
    nodes.forEach((nd) => L.connect(pres, s, cx, cy, nd.x + 0.875, nd.y + 0.225, C.line, 1.5));
    nodes.forEach((nd) => {
      L.rect(pres, s, { x: nd.x, y: nd.y, w: 1.75, h: 0.45, fill: C.tint2, radius: 0.2 });
      L.txt(s, nd.t, { x: nd.x, y: nd.y, w: 1.75, h: 0.45, fontSize: 10.5, bold: true, color: C.ink, align: 'center', valign: 'middle' });
    });
    L.circle(pres, s, { x: cx - 0.78, y: cy - 0.78, d: 1.56, fill: C.brick });
    L.txt(s, 'PERUSAHAAN', { x: cx - 0.78, y: cy - 0.78, w: 1.56, h: 1.56, fontSize: 11.5, bold: true, color: C.paper, align: 'center', valign: 'middle', fontFace: HEAD });
    L.txt(s, 'Model stakeholder (Freeman 1984): perusahaan berada di pusat serangkaian hubungan dua arah yang saling bergantung.', {
      x: 0.7, y: 6.24, w: 6.3, h: 0.56, fontSize: 11, italic: true, color: C.muted, align: 'center', valign: 'top', lineSpacingMultiple: 1.03,
    });

    // --- three models column
    const models = [
      { l: 'a', t: 'Model manajerial tradisional', d: 'Pemasok, karyawan, dan pemegang saham memasok sumber daya; perusahaan mengubahnya menjadi produk bagi konsumen. Pemegang saham adalah "pemilik", sehingga kepentingan merekalah yang diutamakan.', c: C.muted },
      { l: 'b', t: 'Model stakeholder', d: 'Pemegang saham hanyalah satu kelompok di antara banyak kelompok lain. Perusahaan berkewajiban kepada seluruh konstituen yang terpengaruh aktivitasnya. Inilah dasar pemahaman kita tentang CSR.', c: C.brick },
      { l: 'c', t: 'Model jejaring (Rowley 1997)', d: 'Setiap stakeholder juga punya stakeholder-nya sendiri, dan punya kewajiban terhadap stakeholder lain dari perusahaan yang sama. Hubungan menjadi berlapis dan tidak langsung.', c: C.clay },
    ];
    let my = 1.80;
    models.forEach((m) => {
      L.card(pres, s, { x: 7.25, y: my, w: 5.45, h: 1.54, fill: m.c === C.brick ? C.tint2 : C.tint });
      L.badge(pres, s, { x: 7.51, y: my + 0.22, d: 0.44, text: m.l, fill: m.c, size: 14 });
      L.txt(s, m.t, { x: 8.11, y: my + 0.22, w: 4.35, h: 0.44, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, m.d, { x: 7.51, y: my + 0.74, w: 4.95, h: 0.70, fontSize: 11, color: C.muted, valign: 'top', lineSpacingMultiple: 1.03 });
      my += 1.60;
    });
    L.foot(s, 'Kerangka 2 · Stakeholder', n());
    s.addNotes('Model jejaring inilah yang nanti menjelaskan mengapa anak-anak peserta audisi bulu tangkis bisa disebut stakeholder PT Djarum, meski tanpa hubungan kontraktual apa pun.');
  }

  // -------------------------------------- 21. MENGAPA STAKEHOLDER PENTING
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Why stakeholders matter', 'Dua Alasan Kelompok Lain Punya Klaim Sah', {
      lead: 'Teori stakeholder harus menjawab keberatan Friedman: mengapa kelompok selain pemegang saham berhak menuntut perusahaan?',
      leadW: 11.6,
    });

    L.card(pres, s, { x: M, y: 2.32, w: 5.95, h: 2.34, fill: C.tint });
    L.txt(s, 'PERSPEKTIF HUKUM', { x: M + 0.3, y: 2.54, w: 5.35, h: 0.3, fontSize: 11, bold: true, color: C.brick, charSpacing: 1.4, valign: 'middle' });
    L.txt(s, 'Klaim mereka sudah terlindungi', { x: M + 0.3, y: 2.86, w: 5.35, h: 0.34, fontSize: 16, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Secara faktual tidak benar bahwa hanya pemegang saham yang punya kepentingan sah. Ada kontrak yang mengikat, ditambah jaringan hukum dan regulasi yang makin rapat — misalnya perlindungan hak pekerja atas kondisi kerja dan upah. Dari sudut pandang etis, sudah disepakati bahwa korporasi memikul kewajiban terhadap mereka.', {
      x: M + 0.3, y: 3.26, w: 5.35, h: 1.26, fontSize: 12, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06,
    });

    L.card(pres, s, { x: 6.75, y: 2.32, w: 5.95, h: 2.34, fill: C.tint });
    L.txt(s, 'PERSPEKTIF EKONOMI', { x: 7.05, y: 2.54, w: 5.35, h: 0.3, fontSize: 11, bold: true, color: C.clay, charSpacing: 1.4, valign: 'middle' });
    L.txt(s, 'Masalah keagenan (agency problem)', { x: 7.05, y: 2.86, w: 5.35, h: 0.34, fontSize: 16, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Mayoritas pemegang saham tidak membeli saham untuk "memiliki" perusahaan. Banyak yang membeli untuk alasan spekulatif — yang mereka pedulikan adalah pergerakan harga saham. Maka tidak jelas mengapa kepentingan jangka pendek itu harus mengungguli kepentingan jangka panjang konsumen, karyawan, dan pemasok.', {
      x: 7.05, y: 3.26, w: 5.35, h: 1.26, fontSize: 12, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06,
    });

    L.card(pres, s, { x: M, y: 4.86, w: 5.95, h: 1.44, fill: C.dark });
    L.txt(s, '"Most shareholders can sell their stocks far more easily than most employees can find another job."', {
      x: M + 0.3, y: 5.06, w: 5.35, h: 0.8, fontSize: 13.5, italic: true, color: C.paper, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.05,
    });
    L.txt(s, 'Sumantra Ghoshal (2005: 80)', { x: M + 0.3, y: 5.88, w: 5.35, h: 0.28, fontSize: 11, bold: true, color: C.gold2, valign: 'middle' });

    L.card(pres, s, { x: 6.75, y: 4.86, w: 5.95, h: 1.44, fill: C.dark });
    L.txt(s, 'Maksimalisasi shareholder value sebagai strategi adalah "a dumb idea"; konstituen utama Anda adalah karyawan, konsumen, dan produk Anda.', {
      x: 7.05, y: 5.06, w: 5.35, h: 0.8, fontSize: 13.5, italic: true, color: C.paper, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.05,
    });
    L.txt(s, 'Jack Welch, eks-CEO General Electric (2009)', { x: 7.05, y: 6.02, w: 5.35, h: 0.28, fontSize: 11, bold: true, color: C.gold2, valign: 'middle' });
    L.foot(s, 'Kerangka 2 · Stakeholder', n());
  }

  // ------------------------- 22. PERAN BARU MANAJEMEN + 3 BENTUK TEORI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'A new role for management', 'Peran Baru Manajemen & Tiga Bentuk Teori', { size: 30 });

    L.card(pres, s, { x: M, y: 1.82, w: W, h: 1.80, fill: C.tint2 });
    L.txt(s, 'Manajemen bukan lagi sekadar agen pemegang saham', { x: M + 0.32, y: 2.02, w: 11.4, h: 0.34, fontSize: 16, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Manajer tetap memikul fiduciary responsibility terhadap pemegang saham, tetapi harus memadukannya dengan kepentingan seluruh stakeholder yang sah demi kelangsungan jangka panjang perusahaan — termasuk pihak yang tidak punya suara untuk membela dirinya sendiri, seperti lingkungan hidup. Dari sinilah muncul gagasan stakeholder democracy: memberi stakeholder kesempatan memengaruhi dan mengendalikan keputusan korporasi, serta corporate governance yang mengodifikasi hak-hak tiap kelompok.', {
      x: M + 0.32, y: 2.40, w: 11.4, h: 1.06, fontSize: 12.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06,
    });

    L.txt(s, 'Tiga bentuk stakeholder theory (Donaldson & Preston 1995)', { x: M, y: 3.84, w: W, h: 0.34, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const forms = [
      { t: 'Normatif', q: 'SEHARUSNYA', d: 'Teori yang berusaha memberi alasan mengapa korporasi seharusnya memperhitungkan kepentingan stakeholder.', c: C.brick },
      { t: 'Deskriptif', q: 'SESUNGGUHNYA', d: 'Teori yang berusaha memastikan apakah — dan bagaimana — korporasi sesungguhnya memperhitungkan kepentingan stakeholder.', c: C.clay },
      { t: 'Instrumental', q: 'MENGUNTUNGKAN?', d: 'Teori yang menjawab apakah memperhitungkan kepentingan stakeholder memang menguntungkan bagi korporasi. Serumpun dengan argumen enlightened self-interest.', c: C.sage },
    ];
    let x = M;
    forms.forEach((f) => {
      L.card(pres, s, { x, y: 4.26, w: 3.83, h: 2.00, fill: C.tint });
      L.txt(s, f.q, { x: x + 0.28, y: 4.44, w: 3.3, h: 0.28, fontSize: 10, bold: true, color: f.c, charSpacing: 1.4, valign: 'middle' });
      L.txt(s, f.t, { x: x + 0.28, y: 4.74, w: 3.3, h: 0.42, fontSize: 20, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, f.d, { x: x + 0.28, y: 5.22, w: 3.3, h: 0.96, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 4.135;
    });
    L.source(s, 'Freeman (1984); Matten & Crane (2005); Donaldson & Preston (1995), dalam Crane et al. (2019), Bab 2, hlm. 63-65.', 6.42);
    L.foot(s, 'Kerangka 2 · Stakeholder', n());
  }

  // --------------------------------- 23. DIVIDER: KERANGKA 3 CITIZENSHIP
  {
    const s = pres.addSlide(); L.bg(s, C.dark);
    L.circle(pres, s, { x: 10.5, y: 2.1, d: 4.4, fill: C.gold });
    L.circle(pres, s, { x: 9.2, y: -1.5, d: 3.4, fill: C.brick });
    L.txt(s, 'KERANGKA 3', { x: M, y: 2.28, w: 8, h: 0.34, fontSize: 13, bold: true, color: C.gold2, charSpacing: 2.2, valign: 'middle' });
    L.txt(s, 'Corporate Citizenship', { x: M, y: 2.68, w: 9.0, h: 1.0, fontSize: 42, bold: true, fontFace: HEAD, color: C.paper, valign: 'middle' });
    L.txt(s, 'The firm as a political actor', { x: M, y: 3.72, w: 8.6, h: 0.42, fontSize: 18, italic: true, color: C.gold2, valign: 'middle' });
    L.txt(s, 'Keberatan ketiga Friedman: urusan sosial adalah tugas negara, bukan manajer.\nTetapi bagaimana jika perusahaan sudah terlanjur mengambil peran yang dulu dipegang negara?', {
      x: M, y: 4.36, w: 8.4, h: 0.9, fontSize: 15, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.15,
    });
    L.foot(s, 'Framing Business Ethics · Bab 2', n(), true);
  }

  // ------------------------------------------ 24. FIRM AS POLITICAL ACTOR
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Mengapa batas bisnis dan negara mengabur', 'Tiga Perkembangan yang Menggeser Pembagian Kerja Politik', { size: 27 });
    const dev = [
      { t: 'Pemerintah mundur dari pemenuhan kebutuhan sosial', d: 'Sepanjang abad ke-20 air, listrik, pendidikan, layanan kesehatan, transportasi dasar, keamanan publik, dan telekomunikasi dipandang sebagai yang disediakan negara bagi warganya. Di banyak negara layanan itu kini diprivatisasi dan berada di tangan perusahaan.', k: 'PRIVATISASI' },
      { t: 'Pemerintah tidak mampu atau tidak mau memenuhinya', d: 'Terutama di negara berkembang, bisnis berhadapan dengan pemerintah yang kekurangan sumber daya. Perusahaan tambang membangun jalan, perumahan, sekolah, dan rumah sakit bagi komunitas tempatnya beroperasi — perusahaan pun "bermain sebagai pemerintah".', k: 'KEKOSONGAN NEGARA' },
      { t: 'Pemerintah hanya menjangkau yang ada dalam kuasanya', d: 'Pasar keuangan global, iklim planet, dan internet terlalu besar untuk dikendalikan satu pemerintah mana pun. Wilayah-wilayah itu dijalankan oleh bisnis — maka harapan publik pun beralih ke bisnis.', k: 'BATAS YURISDIKSI' },
    ];
    let x = M;
    dev.forEach((d, i) => {
      L.card(pres, s, { x, y: 2.02, w: 3.83, h: 3.66, fill: C.tint });
      L.badge(pres, s, { x: x + 0.28, y: 2.26, d: 0.54, text: i + 1, fill: [C.brick, C.clay, C.sage][i], size: 16 });
      L.txt(s, d.k, { x: x + 0.94, y: 2.26, w: 2.64, h: 0.54, fontSize: 9.5, bold: true, color: [C.brick, C.clay, C.sage][i], charSpacing: 1.1, valign: 'middle' });
      L.txt(s, d.t, { x: x + 0.28, y: 2.94, w: 3.3, h: 0.94, fontSize: 14.5, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.0 });
      L.txt(s, d.d, { x: x + 0.28, y: 3.94, w: 3.3, h: 1.54, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 4.135;
    });
    L.card(pres, s, { x: M, y: 5.88, w: W, h: 0.82, fill: C.dark });
    L.txt(s, 'Akibatnya, bisnis kini menghadapi banyak ekspektasi sosial yang biasanya hanya dialamatkan kepada otoritas politik. Konsep kunci untuk membaca pergeseran ini adalah corporate citizenship.', {
      x: M + 0.32, y: 5.88, w: 11.4, h: 0.82, fontSize: 13, bold: true, color: C.paper, valign: 'middle', lineSpacingMultiple: 1.05,
    });
    L.foot(s, 'Kerangka 3 · Corporate Citizenship', n());
  }

  // ---------------------------------------------- 25. TIGA PANDANGAN CC
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'The concept of corporate citizenship', 'Tiga Cara Orang Memakai Istilah "Corporate Citizenship"', { size: 27 });

    const views = [
      { t: 'Limited view', d: 'CC dipahami terutama sebagai filantropi: perusahaan yang berbudi luhur berbagi kekayaannya dengan "sesama warga".', tag: 'CC ≈ filantropi', c: C.muted, dark: false },
      { t: 'Equivalent view', d: 'CC dipakai nyaris sinonim dengan CSR — menyamakan perilaku bertetangga yang baik dengan peran bisnis yang bertanggung jawab.', tag: 'CC ≈ CSR', c: C.clay, dark: false },
      { t: 'Extended view', d: 'CC dibaca sebagai peran korporasi dalam mengelola hak-hak kewarganegaraan individu. Pandangan inilah yang dipakai buku, karena secara sengaja merangkul unsur politik dalam etika bisnis.', tag: 'CC = peran politik', c: C.brick, dark: true },
    ];
    let x = M;
    views.forEach((v) => {
      L.card(pres, s, { x, y: 2.00, w: 3.83, h: 2.52, fill: v.dark ? C.dark : C.tint });
      L.txt(s, v.tag.toUpperCase(), { x: x + 0.28, y: 2.22, w: 3.3, h: 0.28, fontSize: 10, bold: true, color: v.dark ? C.gold2 : v.c, charSpacing: 1.2, valign: 'middle' });
      L.txt(s, v.t, { x: x + 0.28, y: 2.52, w: 3.3, h: 0.44, fontSize: 19, bold: true, color: v.dark ? C.paper : C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, v.d, { x: x + 0.28, y: 3.04, w: 3.3, h: 1.30, fontSize: 12, color: v.dark ? C.onDarkMuted : C.muted, valign: 'top', lineSpacingMultiple: 1.06 });
      x += 4.135;
    });

    L.card(pres, s, { x: M, y: 4.76, w: 7.6, h: 1.92, fill: C.tint2 });
    L.txt(s, 'Titik berangkat extended view', { x: M + 0.3, y: 4.96, w: 7.0, h: 0.32, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Korporasi masuk ke arena kewarganegaraan bukan karena berhak atas hak-hak itu selayaknya warga "sungguhan", melainkan sebagai aktor publik berkuasa yang — untuk baik atau buruk — sangat memengaruhi hak warga yang sungguhan. Ketika pemerintah gagal menjalankan sebagian fungsinya, korporasi sebagian mengambil alih fungsi perlindungan, fasilitasi, dan pemungkinan hak-hak warga.', {
      x: M + 0.3, y: 5.32, w: 7.0, h: 1.24, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06,
    });

    L.card(pres, s, { x: 8.42, y: 4.76, w: 4.28, h: 1.92, fill: C.gold });
    L.txt(s, 'CC bersifat DESKRIPTIF', { x: 8.70, y: 4.96, w: 3.72, h: 0.3, fontSize: 12, bold: true, color: C.ink, charSpacing: 0.8, valign: 'middle' });
    L.txt(s, 'Kita tidak perlu tahu motifnya untuk menyebut sesuatu sebagai tindakan CC. Konsep ini menggambarkan apa yang memang terjadi, bukan apa yang seharusnya terjadi.', {
      x: 8.70, y: 5.32, w: 3.72, h: 1.24, fontSize: 11.5, color: '3A2A10', valign: 'top', lineSpacingMultiple: 1.06,
    });
    L.foot(s, 'Kerangka 3 · Corporate Citizenship', n());
    s.addNotes('Poin penting untuk kasus Djarum: karena extended view bersifat deskriptif, perdebatan "apakah Djarum tulus atau sekadar promosi" tidak menghalangi kita menyebutnya corporate citizen.');
  }

  // ---------------------------------------- 26. HAK MARSHALL & PERAN KORPORASI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Figure 2.4 · T.H. Marshall (1965), Matten & Crane (2005)', 'Tiga Hak Warga dan Peran Korporasi atasnya', { size: 29 });

    const rights = [
      { t: 'Hak sosial', s: 'freedom to · hak "positif"', d: 'Kebebasan untuk berpartisipasi dalam masyarakat: hak atas pendidikan, layanan kesehatan, dan berbagai aspek kesejahteraan.', role: 'PROVIDER  atau  IGNORER', ex: 'Perusahaan memberi makan tunawisma, meningkatkan keterampilan kerja penganggur, membangun sekolah dan pusat kesehatan.', c: C.brick },
      { t: 'Hak sipil', s: 'freedom from · hak "negatif"', d: 'Kebebasan dari penyalahgunaan dan campur tangan pihak ketiga: hak milik, hak berdagang di pasar bebas, kebebasan berbicara.', role: 'ENABLER  atau  DISABLER', ex: 'Perusahaan internet dapat melindungi atau justru melanggar privasi dan kebebasan berekspresi penggunanya.', c: C.clay },
      { t: 'Hak politik', s: 'partisipasi dalam tata kelola', d: 'Hak memilih, hak memegang jabatan, dan secara umum hak ikut serta dalam proses pemerintahan.', role: 'CHANNEL  atau  BLOCKAGE', ex: 'Warga makin mengarahkan aksi politiknya kepada korporasi, bukan kepada pemerintah — lewat kampanye isu, protes, dan boikot.', c: C.sage },
    ];
    let x = M;
    rights.forEach((r) => {
      L.card(pres, s, { x, y: 1.94, w: 3.83, h: 3.62, fill: C.tint });
      L.txt(s, r.t, { x: x + 0.28, y: 2.14, w: 3.3, h: 0.38, fontSize: 19, bold: true, color: r.c, fontFace: HEAD, valign: 'middle' });
      L.txt(s, r.s, { x: x + 0.28, y: 2.52, w: 3.3, h: 0.28, fontSize: 10.5, italic: true, color: C.muted, valign: 'middle' });
      L.txt(s, r.d, { x: x + 0.28, y: 2.88, w: 3.3, h: 0.94, fontSize: 11.5, color: C.ink, valign: 'top', lineSpacingMultiple: 1.05 });
      L.rect(pres, s, { x: x + 0.28, y: 3.86, w: 3.3, h: 0.44, fill: r.c, radius: 0.08 });
      L.txt(s, r.role, { x: x + 0.28, y: 3.86, w: 3.3, h: 0.44, fontSize: 10, bold: true, color: C.paper, align: 'center', valign: 'middle', charSpacing: 0.6 });
      L.txt(s, r.ex, { x: x + 0.28, y: 4.40, w: 3.3, h: 0.96, fontSize: 11, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 4.135;
    });

    L.card(pres, s, { x: M, y: 5.78, w: W, h: 0.92, fill: C.dark });
    L.txt(s, 'DEFINISI DALAM BUKU', { x: M + 0.32, y: 5.90, w: 4, h: 0.26, fontSize: 10, bold: true, color: C.gold2, charSpacing: 1.4, valign: 'middle' });
    L.txt(s, 'Corporate citizenship — peran korporasi dalam mengelola hak-hak kewarganegaraan individu.', {
      x: M + 0.32, y: 6.16, w: 11.4, h: 0.42, fontSize: 16, bold: true, italic: true, color: C.paper, fontFace: HEAD, valign: 'middle',
    });
    L.foot(s, 'Kerangka 3 · Corporate Citizenship', n());
  }

  // ------------------------------- 27. AKUNTABILITAS & TRANSPARANSI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Implications of corporate citizenship', 'Akuntabilitas dan Transparansi Korporasi', {
      lead: 'Pertanyaan pokoknya: apakah keterlibatan politik perusahaan merupakan ancaman bagi demokrasi?',
    });

    L.card(pres, s, { x: M, y: 2.22, w: 5.95, h: 2.4, fill: C.tint });
    L.txt(s, 'CORPORATE ACCOUNTABILITY', { x: M + 0.3, y: 2.42, w: 5.35, h: 0.3, fontSize: 11, bold: true, color: C.brick, charSpacing: 1.3, valign: 'middle' });
    L.txt(s, 'Siapa mengendalikan korporasi, dan kepada siapa korporasi akuntabel?', {
      x: M + 0.3, y: 2.74, w: 5.35, h: 0.6, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.0 });
    L.txt(s, 'Banyak keputusan penting kini tidak lagi diambil pemerintah — dan karenanya tidak lagi oleh pemilih — melainkan oleh korporasi yang tidak melalui pemungutan suara. Karena korporasi membentuk begitu banyak kehidupan publik dan privat, mereka sudah menjadi aktor politik de facto.', {
      x: M + 0.3, y: 3.40, w: 5.35, h: 1.06, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06 });

    L.card(pres, s, { x: 6.75, y: 2.22, w: 5.95, h: 2.4, fill: C.tint });
    L.txt(s, 'CORPORATE TRANSPARENCY', { x: 7.05, y: 2.42, w: 5.35, h: 0.3, fontSize: 11, bold: true, color: C.sage, charSpacing: 1.3, valign: 'middle' });
    L.txt(s, 'Sejauh mana keputusan, kebijakan, aktivitas, dan dampak korporasi diakui dan dibuat terlihat oleh stakeholder yang relevan.', {
      x: 7.05, y: 2.74, w: 5.35, h: 0.86, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.0 });
    L.txt(s, 'Hanya jika stakeholder tahu apa yang dilakukan perusahaan, mereka dapat berupaya mengubah perilakunya — atau berhenti mendukungnya. Transparansi bukan obat mujarab, tetapi kini menjadi keharusan.', {
      x: 7.05, y: 3.66, w: 5.35, h: 0.8, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.06 });

    L.txt(s, 'Tiga elemen kualitas transparansi (Schnackenberg & Tomlinson 2014)', { x: M, y: 4.82, w: W, h: 0.34, fontSize: 14.5, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const el = [
      { t: 'Disclosure', d: 'Apakah informasi yang relevan tersedia secara tepat waktu dan mudah diakses.' },
      { t: 'Clarity', d: 'Sejauh mana informasi itu dapat dipahami oleh stakeholder yang relevan.' },
      { t: 'Accuracy', d: 'Apakah informasi yang diungkapkan benar dan dapat diandalkan.' },
    ];
    let x = M;
    el.forEach((e, i) => {
      L.card(pres, s, { x, y: 5.24, w: 3.83, h: 1.14, fill: C.tint2 });
      L.badge(pres, s, { x: x + 0.28, y: 5.44, d: 0.4, text: i + 1, fill: [C.brick, C.clay, C.sage][i], size: 12 });
      L.txt(s, e.t, { x: x + 0.82, y: 5.44, w: 2.76, h: 0.4, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, e.d, { x: x + 0.28, y: 5.90, w: 3.3, h: 0.4, fontSize: 11, color: C.muted, valign: 'top', lineSpacingMultiple: 1.02 });
      x += 4.135;
    });
    L.source(s, 'Crane et al. (2019), Bab 2, hlm. 71-76.', 6.52);
    L.foot(s, 'Kerangka 3 · Corporate Citizenship', n());
  }
};
