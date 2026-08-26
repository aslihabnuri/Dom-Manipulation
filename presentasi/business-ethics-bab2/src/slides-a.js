const L = require('./lib.js');
const { C, HEAD, BODY, M, W } = L;

module.exports = function (pres, ctx) {
  const n = ctx.n;

  // ---------------------------------------------------------------- 1. COVER
  {
    const s = pres.addSlide(); L.bg(s, C.darker);
    L.rect(pres, s, { x: 0, y: 0, w: 13.34, h: 7.5, fill: C.dark });
    L.circle(pres, s, { x: 9.4, y: -1.6, d: 6.2, fill: C.brick, });
    L.circle(pres, s, { x: 10.9, y: 4.3, d: 3.4, fill: C.gold });
    L.rect(pres, s, { x: 0, y: 0, w: 8.6, h: 7.5, fill: C.dark });

    L.txt(s, 'BUSINESS ETHICS FOR BUSINESS SUSTAINABILITY  ·  BAB 2', {
      x: M, y: 1.30, w: 7.6, h: 0.3, fontSize: 11.5, bold: true, color: C.gold2, charSpacing: 1.8, valign: 'middle',
    });
    L.txt(s, 'Framing\nBusiness Ethics', {
      x: M, y: 1.72, w: 7.8, h: 1.85, fontSize: 50, bold: true, fontFace: HEAD,
      color: C.paper, valign: 'middle', lineSpacingMultiple: 0.92,
    });
    L.txt(s, 'Corporate Responsibility, Stakeholders, and Citizenship', {
      x: M, y: 3.62, w: 7.6, h: 0.4, fontSize: 17, italic: true, color: C.onDarkMuted, valign: 'middle',
    });
    L.rect(pres, s, { x: M, y: 4.28, w: 1.5, h: 0.035, fill: C.gold });
    L.txt(s, 'Studi Kasus: PT DJARUM', {
      x: M, y: 4.52, w: 7.6, h: 0.42, fontSize: 21, bold: true, color: C.gold2, fontFace: HEAD, valign: 'middle',
    });
    L.txt(s, 'CSR  ·  Stakeholder  ·  Corporate Citizenship', {
      x: M, y: 4.96, w: 7.6, h: 0.32, fontSize: 13, color: C.onDarkMuted, valign: 'middle',
    });
    L.txt(s, [
      { text: 'Disusun oleh', options: { fontSize: 10.5, color: C.onDarkMuted, breakLine: true, charSpacing: 1.2 } },
      { text: 'Nama Anggota Kelompok', options: { fontSize: 15, bold: true, color: C.paper, fontFace: HEAD } },
    ], { x: M, y: 5.75, w: 7.6, h: 0.8, valign: 'top' });
    L.txt(s, 'Sumber teori: Crane, Matten, Glozer & Spence (2019), Business Ethics, 5th ed., Bab 2', {
      x: M, y: 6.72, w: 7.8, h: 0.3, fontSize: 9.5, italic: true, color: C.onDarkMuted, valign: 'middle',
    });
    s.addNotes('Slide pembuka. Ganti "Nama Anggota Kelompok" dengan nama-nama anggota kelompok Anda.');
  }

  // ------------------------------------------------------ 2. ALUR PRESENTASI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Peta jalan', 'Alur Presentasi', {
      lead: 'Kami membaca teori Bab 2 lebih dulu, lalu menurunkannya ke kasus PT Djarum melalui tiga kerangka yang sama.',
      leadW: 11.0,
    });

    const rows = [
      { t: 'Landasan', d: 'Apa itu korporasi, dan bisakah ia memikul tanggung jawab moral?', c: C.ink },
      { t: 'Kerangka 1 — CSR', d: 'Apa isi tanggung jawab perusahaan? Piramida Carroll, strategi, dan kritiknya.', c: C.brick },
      { t: 'Kerangka 2 — Stakeholder', d: 'Kepada siapa perusahaan bertanggung jawab? Teori Freeman dan turunannya.', c: C.clay },
      { t: 'Kerangka 3 — Corporate Citizenship', d: 'Dengan kuasa apa? Perusahaan sebagai aktor politik, akuntabilitas, transparansi.', c: C.gold },
      { t: 'Implementasi — PT Djarum', d: 'Kasus riil Indonesia dibedah dengan ketiga kerangka di atas, lalu disintesis.', c: C.sage },
    ];
    let y = 2.05;
    rows.forEach((r, i) => {
      L.card(pres, s, { x: M, y, w: W, h: 0.86, fill: i === 4 ? C.tint2 : C.tint });
      L.badge(pres, s, { x: M + 0.32, y: y + 0.19, d: 0.48, text: i + 1, fill: r.c, size: 15, color: i === 3 ? C.ink : C.paper });
      L.txt(s, r.t, { x: M + 1.02, y: y + 0.14, w: 3.9, h: 0.58, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, r.d, { x: M + 5.05, y: y + 0.14, w: 6.75, h: 0.58, fontSize: 12, color: C.muted, valign: 'middle' });
      y += 0.98;
    });
    L.foot(s, 'Framing Business Ethics · Bab 2', n());
    s.addNotes('Jelaskan bahwa tiga kerangka teori ini dipakai ulang sebagai tiga lensa analisis kasus Djarum di bagian kedua.');
  }

  // ------------------------------------------------- 3. TUJUAN PEMBELAJARAN
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Learning objectives', 'Tujuan Pembelajaran Bab 2', {
      lead: 'Lima kemampuan yang ditargetkan buku setelah menyelesaikan bab ini.',
    });
    const items = [
      'Menjelaskan mengapa korporasi memiliki tanggung jawab sosial.',
      'Menjelaskan CSR dari sisi level, strategi, dan outcome-nya.',
      'Menjelaskan stakeholder theory of the firm.',
      'Menerapkan konsep corporate citizenship, akuntabilitas, shared value, dan transparansi pada peran politik korporasi.',
      'Mengevaluasi secara kritis penerapan teori-teori ini di berbagai konteks internasional.',
    ];
    let y = 2.02;
    items.forEach((t, i) => {
      L.badge(pres, s, { x: M, y: y + 0.05, d: 0.5, text: i + 1, fill: C.brick, size: 15 });
      L.txt(s, t, { x: M + 0.78, y: y, w: 6.55, h: 0.6, fontSize: 13.5, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.0 });
      y += 0.74;
    });

    L.card(pres, s, { x: 8.35, y: 1.98, w: 4.35, h: 3.9, fill: C.dark });
    L.txt(s, 'KEY CONCEPTS', { x: 8.65, y: 2.22, w: 3.75, h: 0.3, fontSize: 11, bold: true, color: C.gold2, charSpacing: 1.6, valign: 'middle' });
    const keys = ['Corporate social responsibility (CSR)', 'Stakeholders', 'Corporate citizenship', 'Corporate accountability', 'Corporate transparency'];
    let ky = 2.66;
    keys.forEach((k) => {
      L.circle(pres, s, { x: 8.68, y: ky + 0.16, d: 0.13, fill: C.gold });
      L.txt(s, k, { x: 8.98, y: ky, w: 3.5, h: 0.46, fontSize: 12.5, color: C.paper, valign: 'middle' });
      ky += 0.60;
    });
    L.source(s, 'Crane, Matten, Glozer & Spence (2019), Business Ethics, 5th ed., Bab 2, hlm. 44.', 6.12);
    L.foot(s, 'Framing Business Ethics · Bab 2', n());
  }

  // ----------------------------------------------- 4. DIVIDER: BAGIAN 1
  {
    const s = pres.addSlide(); L.bg(s, C.dark);
    L.circle(pres, s, { x: 10.2, y: -1.2, d: 4.6, fill: C.brick });
    L.txt(s, 'BAGIAN 1', { x: M, y: 2.28, w: 8, h: 0.34, fontSize: 13, bold: true, color: C.gold2, charSpacing: 2.2, valign: 'middle' });
    L.txt(s, 'Landasan Teori', { x: M, y: 2.68, w: 9.2, h: 1.0, fontSize: 44, bold: true, fontFace: HEAD, color: C.paper, valign: 'middle' });
    L.txt(s, 'Sebelum bertanya apa tanggung jawab perusahaan, kita harus lebih dulu bertanya:\nentitas macam apa perusahaan itu, dan bisakah ia dimintai pertanggungjawaban moral?', {
      x: M, y: 3.80, w: 8.6, h: 0.9, fontSize: 15, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.15,
    });
    L.foot(s, 'Framing Business Ethics · Bab 2', n(), true);
  }

  // ------------------------------------------- 5. MENGAPA PERLU FRAMING
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Towards a framework for business ethics', 'Mengapa Business Ethics Perlu "Di-frame"?', { size: 30 });

    L.card(pres, s, { x: M, y: 1.72, w: 5.75, h: 1.62, fill: C.tint2 });
    L.txt(s, 'Definisi business ethics (Bab 1)', { x: M + 0.28, y: 1.92, w: 5.2, h: 0.3, fontSize: 12, bold: true, color: C.brick, valign: 'middle' });
    L.txt(s, '"Studi tentang situasi, aktivitas, dan keputusan bisnis di mana persoalan benar dan salah dibahas."', {
      x: M + 0.28, y: 2.24, w: 5.2, h: 0.9, fontSize: 14.5, italic: true, color: C.ink, valign: 'top', fontFace: HEAD, lineSpacingMultiple: 1.05,
    });

    L.txt(s, 'Titik awalnya adalah satu pertanyaan:', { x: 6.72, y: 1.80, w: 5.98, h: 0.3, fontSize: 12, color: C.muted, valign: 'middle' });
    L.txt(s, 'Apakah perusahaan adalah aktor yang harus mengambil keputusan melampaui sekadar memproduksi barang dan jasa secara menguntungkan?', {
      x: 6.72, y: 2.12, w: 5.98, h: 1.2, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.05,
    });

    L.txt(s, 'Bab 2 menjawabnya lewat tiga kerangka yang saling melengkapi:', {
      x: M, y: 3.62, w: W, h: 0.32, fontSize: 13, color: C.muted, valign: 'middle',
    });

    const cols = [
      { t: 'CSR', q: 'APA?', d: 'Apa isi tanggung jawab perusahaan di luar mencari laba — dan sampai lapisan mana?', c: C.brick },
      { t: 'Stakeholder', q: 'KEPADA SIAPA?', d: 'Kepada kelompok mana perusahaan berutang tanggung jawab, dan atas dasar apa?', c: C.clay },
      { t: 'Corporate Citizenship', q: 'DENGAN KUASA APA?', d: 'Apa jadinya ketika perusahaan mengambil peran yang biasanya dipegang negara?', c: C.gold },
    ];
    let x = M;
    cols.forEach((col) => {
      L.card(pres, s, { x, y: 4.02, w: 3.83, h: 2.32, fill: C.tint });
      L.txt(s, col.q, { x: x + 0.28, y: 4.24, w: 3.3, h: 0.28, fontSize: 10.5, bold: true, color: col.c, charSpacing: 1.5, valign: 'middle' });
      L.txt(s, col.t, { x: x + 0.28, y: 4.54, w: 3.3, h: 0.72, fontSize: 20, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 0.95 });
      L.txt(s, col.d, { x: x + 0.28, y: 5.34, w: 3.3, h: 0.86, fontSize: 12, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 4.135;
    });
    L.foot(s, 'Bagian 1 · Landasan Teori', n());
  }

  // ---------------------------------------------- 6. APA ITU KORPORASI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'What is a corporation?', 'Apa Itu Korporasi?', {
      lead: 'Identifikasi hukum sebuah korporasi menentukan tanggung jawab apa yang bisa dibebankan kepadanya.',
    });

    L.card(pres, s, { x: M, y: 1.98, w: 5.75, h: 2.34, fill: C.dark });
    L.txt(s, 'DUA CIRI PENDEFINISI', { x: M + 0.3, y: 2.18, w: 5.15, h: 0.28, fontSize: 10.5, bold: true, color: C.gold2, charSpacing: 1.5, valign: 'middle' });
    L.txt(s, [
      { text: 'Status hukum terpisah — ', options: { bold: true, color: C.paper } },
      { text: 'korporasi independen dari pemilik, pengelola, dan pekerjanya, sehingga memiliki perpetual succession.', options: { color: C.onDarkMuted } },
    ], { x: M + 0.3, y: 2.50, w: 5.15, h: 0.72, fontSize: 12.5, valign: 'top', lineSpacingMultiple: 1.05 });
    L.txt(s, [
      { text: 'Korporasi memiliki asetnya sendiri — ', options: { bold: true, color: C.paper } },
      { text: 'pabrik dan kantor adalah milik perusahaan, bukan milik pemegang saham.', options: { color: C.onDarkMuted } },
    ], { x: M + 0.3, y: 3.26, w: 5.15, h: 0.72, fontSize: 12.5, valign: 'top', lineSpacingMultiple: 1.05 });

    L.txt(s, 'Tiga implikasi bagi tanggung jawab', { x: 6.72, y: 1.98, w: 5.98, h: 0.32, fontSize: 14, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const imps = [
      ['"Artificial person" di mata hukum', 'Punya hak dan kewajiban layaknya warga negara.'],
      ['Dimiliki pemegang saham, tapi eksis independen', 'Pemegang saham tidak menanggung utang atau kerugian perusahaan — limited liability.'],
      ['Manajer punya fiduciary responsibility', 'Wajib menjaga dan bertindak demi kepentingan investasi pemegang saham.'],
    ];
    let y = 2.42;
    imps.forEach((it, i) => {
      L.badge(pres, s, { x: 6.72, y: y + 0.04, d: 0.4, text: i + 1, fill: C.brick, size: 12 });
      L.txt(s, it[0], { x: 7.28, y: y, w: 5.42, h: 0.3, fontSize: 13, bold: true, color: C.ink, valign: 'middle' });
      L.txt(s, it[1], { x: 7.28, y: y + 0.30, w: 5.42, h: 0.5, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.02 });
      y += 0.88;
    });

    L.card(pres, s, { x: M, y: 5.08, w: W, h: 1.28, fill: C.tint2 });
    L.txt(s, 'Tetapi tanggung jawab hukum belum sama dengan tanggung jawab moral.', {
      x: M + 0.32, y: 5.28, w: 11.4, h: 0.34, fontSize: 15, bold: true, color: C.brick, fontFace: HEAD, valign: 'middle',
    });
    L.txt(s, 'Seseorang bisa merasa bangga atau malu atas perbuatannya. Kita tidak bisa mengatakan hal yang sama tentang entitas tak bernyawa. Karena itu pertanyaannya harus dipertajam: bisakah korporasi bertanggung jawab secara moral?', {
      x: M + 0.32, y: 5.62, w: 11.4, h: 0.6, fontSize: 12.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05,
    });
    L.source(s, 'Crane et al. (2019), Bab 2, hlm. 45-46.', 6.48);
    L.foot(s, 'Bagian 1 · Landasan Teori', n());
  }

  // --------------------------------------------------- 7. FRIEDMAN
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Milton Friedman (1970)', 'Tiga Keberatan Klasik terhadap CSR', {
      lead: '"The social responsibility of business is to increase its profits" — argumen yang masih terus diulang.',
      leadW: 11.4,
    });
    const args = [
      { t: 'Hanya manusia yang punya tanggung jawab moral', d: 'Korporasi bukan manusia, sehingga tidak dapat memikul tanggung jawab moral yang sesungguhnya. Yang bertanggung jawab adalah individu-individu yang mendirikannya.', tag: 'Dijawab di slide berikutnya' },
      { t: 'Manajer wajib bertindak semata demi pemegang saham', d: 'Selama perusahaan patuh hukum, satu-satunya tanggung jawab manajer adalah mencari laba. Bertindak untuk tujuan lain adalah pengkhianatan — dan pada dasarnya "pencurian" dari kantong pemegang saham.', tag: 'Dijawab oleh CSR & Stakeholder' },
      { t: 'Masalah sosial adalah wilayah negara, bukan manajer', d: 'Manajer tidak dilatih untuk menetapkan tujuan sosial dan tidak dipilih secara demokratis untuk melakukannya. Itu tugas pemerintah.', tag: 'Dijawab oleh Corporate Citizenship' },
    ];
    let x = M;
    args.forEach((a, i) => {
      L.card(pres, s, { x, y: 2.10, w: 3.83, h: 3.72, fill: C.tint });
      L.badge(pres, s, { x: x + 0.28, y: 2.36, d: 0.56, text: i + 1, fill: C.brick, size: 17 });
      L.txt(s, a.t, { x: x + 0.28, y: 3.06, w: 3.3, h: 1.0, fontSize: 15.5, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.0 });
      L.txt(s, a.d, { x: x + 0.28, y: 4.06, w: 3.3, h: 1.30, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      L.txt(s, a.tag.toUpperCase(), { x: x + 0.28, y: 5.42, w: 3.3, h: 0.28, fontSize: 9, bold: true, color: C.clay, charSpacing: 0.8, valign: 'middle' });
      x += 4.135;
    });
    L.card(pres, s, { x: M, y: 6.02, w: W, h: 0.66, fill: C.tint2 });
    L.txt(s, 'Seluruh Bab 2 pada dasarnya adalah jawaban berurutan atas ketiga keberatan ini.', {
      x: M + 0.32, y: 6.02, w: 11.4, h: 0.66, fontSize: 13.5, bold: true, color: C.ink, valign: 'middle',
    });
    L.foot(s, 'Bagian 1 · Landasan Teori', n());
  }

  // ------------------------------------- 8. TANGGUNG JAWAB MORAL KORPORASI
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Tabel 2.1 · Menjawab keberatan pertama', 'Bisakah Korporasi Bertanggung Jawab Moral?', { size: 30 });
    const four = [
      { t: 'Legal Identity', d: 'Korporasi membuat kontrak, membayar pajak, menjamin keamanan produk, menuntut dan dituntut, serta mengklaim sejumlah hak.', b: 'A' },
      { t: 'Agency', d: 'Korporasi dapat memutuskan dan bertindak lepas dari anggotanya, melalui struktur pengambilan keputusan internal berupa kebijakan dan prosedur (French 1979; Moore 1999).', b: 'B' },
      { t: 'Organizational Culture', d: 'Korporasi memiliki seperangkat nilai dan keyakinan tentang apa yang benar dan salah, yang memengaruhi pengambilan keputusan etis individu di dalamnya.', b: 'C' },
      { t: 'Functional Identity', d: 'Korporasi tampil dan berinteraksi dengan konsumen serta stakeholder seolah-olah ia pribadi tersendiri, bahkan membangun identitas sebagai "warga" yang baik.', b: 'D' },
    ];
    let x = M, y = 1.95;
    four.forEach((f, i) => {
      const cx = M + (i % 2) * 6.15;
      const cy = 1.95 + Math.floor(i / 2) * 2.02;
      L.infoCard(pres, s, {
        x: cx, y: cy, w: 5.95, h: 1.84, title: f.t, body: f.d, badge: f.b,
        badgeFill: [C.brick, C.clay, C.sage, C.gold][i],
        titleSize: 16, bodySize: 12,
      });
    });
    L.card(pres, s, { x: M, y: 6.02, w: W, h: 0.72, fill: C.dark });
    L.txt(s, 'Kesimpulan buku: korporasi memang memiliki tanggung jawab moral, dan tanggung jawab itu lebih dari sekadar penjumlahan tanggung jawab individu di dalamnya.', {
      x: M + 0.32, y: 6.02, w: 11.4, h: 0.72, fontSize: 13, bold: true, color: C.paper, valign: 'middle',
    });
    L.foot(s, 'Bagian 1 · Landasan Teori', n());
    s.addNotes('Poin kunci: karena korporasi punya agency dan budaya organisasi sendiri, ia bisa dimintai tanggung jawab sebagai entitas — bukan hanya orang-orang di dalamnya. Ini dasar untuk menuntut PT Djarum sebagai perusahaan, bukan hanya manajernya.');
  }

  // ------------------------------------------- 9. DIVIDER: KERANGKA 1 CSR
  {
    const s = pres.addSlide(); L.bg(s, C.dark);
    L.circle(pres, s, { x: 10.4, y: 2.4, d: 4.0, fill: C.brick });
    L.txt(s, 'KERANGKA 1', { x: M, y: 2.28, w: 8, h: 0.34, fontSize: 13, bold: true, color: C.gold2, charSpacing: 2.2, valign: 'middle' });
    L.txt(s, 'Corporate Social\nResponsibility', { x: M, y: 2.68, w: 9.2, h: 1.7, fontSize: 42, bold: true, fontFace: HEAD, color: C.paper, valign: 'middle', lineSpacingMultiple: 0.94 });
    L.txt(s, 'Dua pertanyaan yang memandu seluruh literatur CSR:\nMengapa perusahaan punya tanggung jawab sosial — dan apa sebenarnya isi tanggung jawab itu?', {
      x: M, y: 4.52, w: 8.6, h: 0.9, fontSize: 15, color: C.onDarkMuted, valign: 'top', lineSpacingMultiple: 1.15,
    });
    L.foot(s, 'Framing Business Ethics · Bab 2', n(), true);
  }

  // --------------------------------------------- 10. DEFINISI CSR
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Corporate social responsibility', 'Definisi dan Dua Pertanyaan Kunci');

    L.card(pres, s, { x: M, y: 1.92, w: W, h: 1.55, fill: C.dark });
    L.txt(s, 'DEFINISI DALAM BUKU', { x: M + 0.36, y: 2.12, w: 5, h: 0.28, fontSize: 10.5, bold: true, color: C.gold2, charSpacing: 1.5, valign: 'middle' });
    L.txt(s, '"Upaya perusahaan untuk memenuhi tuntutan ekonomi, hukum, etis, dan filantropis dari suatu masyarakat pada suatu titik waktu tertentu."', {
      x: M + 0.36, y: 2.44, w: 11.3, h: 0.86, fontSize: 18, italic: true, color: C.paper, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.05,
    });

    const qs = [
      { n: '01', t: 'Mengapa perusahaan punya tanggung jawab sosial, bukan hanya finansial?', d: 'Dijawab lewat argumen bisnis (enlightened self-interest) dan argumen moral.', c: C.brick },
      { n: '02', t: 'Apa sifat dan bentuk tanggung jawab sosial itu?', d: 'Dijawab lewat model empat lapis Carroll, strategi CSR, dan pengukuran outcome.', c: C.clay },
    ];
    let x = M;
    qs.forEach((q) => {
      L.card(pres, s, { x, y: 3.72, w: 5.95, h: 2.42, fill: C.tint });
      L.txt(s, q.n, { x: x + 0.32, y: 3.94, w: 1.2, h: 0.6, fontSize: 32, bold: true, color: q.c, fontFace: HEAD, valign: 'middle' });
      L.txt(s, q.t, { x: x + 0.32, y: 4.62, w: 5.3, h: 0.86, fontSize: 16, bold: true, color: C.ink, fontFace: HEAD, valign: 'top', lineSpacingMultiple: 1.0 });
      L.txt(s, q.d, { x: x + 0.32, y: 5.50, w: 5.3, h: 0.5, fontSize: 12, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 6.15;
    });
    L.source(s, 'Carroll (1979, 1991); Crane et al. (2019), Bab 2, hlm. 48-51.', 6.34);
    L.foot(s, 'Kerangka 1 · CSR', n());
  }

  // ------------------------------------------- 11. BUSINESS CASE FOR CSR
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Figure 2.1 · Argumen bisnis', 'The Business Case for CSR', {
      lead: 'Sebagian besar argumen dibingkai sebagai enlightened self-interest: perusahaan memikul tanggung jawab sosial sejauh hal itu memajukan kepentingannya sendiri.',
      leadW: 11.6,
    });
    const bc = [
      { t: 'Meningkatkan pendapatan jangka panjang', d: 'Pelanggan lebih puas, karyawan lebih tertarik dan berkomitmen. CSR jadi motivator utama generasi milenial dalam memilih tempat kerja.', c: C.brick },
      { t: 'Mengelola risiko dan ketidakpastian', d: 'Komitmen sosial sukarela dapat mendahului regulasi dan menjaga independensi dari pemerintah. Contoh: desakan pengaturan keselamatan pekerja setelah runtuhnya Rana Plaza (2013).', c: C.clay },
      { t: 'Menekan biaya', d: 'Dampak lingkungan dan sosial yang positif berarti energi terhemat, limbah berkurang, inefisiensi ditekan. Walmart diperkirakan menghemat US$1 miliar hingga 2020.', c: C.sage },
      { t: 'Menjaga social licence to operate', d: 'Perusahaan perlu memperoleh dan mempertahankan persetujuan komunitas lokal, karyawan, dan pemerintah — pihak-pihak yang dapat memberi maupun mencabut izin sosial itu.', c: C.gold },
    ];
    bc.forEach((b, i) => {
      const cx = M + (i % 2) * 6.15;
      const cy = 2.28 + Math.floor(i / 2) * 2.06;
      L.infoCard(pres, s, { x: cx, y: cy, w: 5.95, h: 1.88, title: b.t, body: b.d, badge: i + 1, badgeFill: b.c, titleSize: 15, bodySize: 11.5 });
    });
    L.source(s, 'Diadaptasi dari Davis (1973); Mintzberg (1983); Smith (2003); Kurucz et al. (2008), dalam Crane et al. (2019), Fig. 2.1.', 6.46);
    L.foot(s, 'Kerangka 1 · CSR', n());
  }

  // --------------------------------------------- 12. ARGUMEN MORAL CSR
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Di luar argumen bisnis', 'Tiga Argumen Moral untuk CSR', {
      lead: 'Hubungan langsung antara tanggung jawab sosial dan profitabilitas nyaris mustahil dibuktikan. Karena itu argumen moral tetap dibutuhkan.',
      leadW: 11.6,
    });
    const mor = [
      { t: 'Externalities', s: 'Argumen eksternalitas', d: 'Perusahaan menghasilkan eksternalitas — dampak yang ditanggung pihak di luar transaksi. Ada tanggung jawab moral untuk menangani eksternalitas negatif seperti polusi, deplesi sumber daya, dan masalah komunitas, sejauh negara belum menanganinya.', c: C.brick },
      { t: 'Power', s: 'Argumen kekuasaan', d: 'Sebagai aktor sosial yang berkuasa dengan sumber daya besar, perusahaan wajib memakai kuasanya secara bertanggung jawab. Sebagian korporasi terbesar dunia berpendapatan melebihi PDB banyak negara.', c: C.clay },
      { t: 'Dependency', s: 'Argumen kesalingtergantungan', d: 'Perusahaan dan masyarakat saling bergantung. Perusahaan menyandarkan diri pada konstituen yang jauh lebih luas daripada pemegang saham — konsumen, pemasok, komunitas lokal.', c: C.sage },
    ];
    let x = M;
    mor.forEach((m) => {
      L.card(pres, s, { x, y: 2.34, w: 3.83, h: 3.44, fill: C.tint });
      L.txt(s, m.t, { x: x + 0.3, y: 2.58, w: 3.26, h: 0.44, fontSize: 20, bold: true, color: m.c, fontFace: HEAD, valign: 'middle' });
      L.txt(s, m.s, { x: x + 0.3, y: 3.02, w: 3.26, h: 0.28, fontSize: 11, italic: true, color: C.muted, valign: 'middle' });
      L.txt(s, m.d, { x: x + 0.3, y: 3.44, w: 3.26, h: 2.06, fontSize: 12, color: C.ink, valign: 'top', lineSpacingMultiple: 1.08 });
      x += 4.135;
    });
    L.card(pres, s, { x: M, y: 5.98, w: W, h: 0.72, fill: C.tint2 });
    L.txt(s, [
      { text: 'Spiderman maxim:  ', options: { bold: true, color: C.brick } },
      { text: '"with great power comes great responsibility."', options: { italic: true, color: C.ink } },
    ], { x: M + 0.32, y: 5.98, w: 11.4, h: 0.72, fontSize: 14, valign: 'middle', fontFace: HEAD });
    L.foot(s, 'Kerangka 1 · CSR', n());
  }

  // ------------------------------------------------ 13. PIRAMIDA CARROLL
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Figure 2.2 · Four-part model of CSR', 'Piramida Carroll: Empat Lapis Tanggung Jawab', { size: 30 });

    const layers = [
      { w: 2.5, y: 2.05, t: 'FILANTROPIS', fill: C.gold, tc: C.ink },
      { w: 3.5, y: 3.07, t: 'ETIS', fill: C.clay, tc: C.paper },
      { w: 4.5, y: 4.09, t: 'HUKUM', fill: C.brick2, tc: C.paper },
      { w: 5.5, y: 5.11, t: 'EKONOMI', fill: C.dark, tc: C.paper },
    ];
    const cx = 3.45;
    layers.forEach((l) => {
      L.rect(pres, s, { x: cx - l.w / 2, y: l.y, w: l.w, h: 0.94, fill: l.fill });
      L.txt(s, l.t, { x: cx - l.w / 2, y: l.y, w: l.w, h: 0.94, fontSize: 13, bold: true, color: l.tc, align: 'center', valign: 'middle', charSpacing: 1.2 });
    });

    const desc = [
      { t: 'Filantropis', tag: 'DESIRED by society', d: 'Kegiatan diskresioner untuk memperbaiki kualitas hidup: donasi, fasilitas rekreasi karyawan, dukungan sekolah, sponsor seni dan olahraga.', c: C.gold },
      { t: 'Etis', tag: 'EXPECTED by society', d: 'Melakukan yang benar, adil, dan wajar bahkan ketika hukum tidak mewajibkannya. Contoh: kemarahan publik atas praktik penghindaran pajak yang legal.', c: C.clay },
      { t: 'Hukum', tag: 'REQUIRED by society', d: 'Mematuhi hukum, "play by the rules of the game". Hukum adalah kodifikasi pandangan moral masyarakat.', c: C.brick2 },
      { t: 'Ekonomi', tag: 'REQUIRED by society', d: 'Menjadi unit ekonomi yang berfungsi baik dan tetap bertahan: imbal hasil bagi investor, pekerjaan yang layak, produk yang memuaskan konsumen.', c: C.dark },
    ];
    let dy = 2.05;
    desc.forEach((d) => {
      L.txt(s, d.t, { x: 6.9, y: dy, w: 2.2, h: 0.3, fontSize: 15.5, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, d.tag, { x: 9.05, y: dy + 0.03, w: 2.9, h: 0.26, fontSize: 9.5, bold: true, color: d.c, charSpacing: 0.8, valign: 'middle' });
      L.txt(s, d.d, { x: 6.9, y: dy + 0.32, w: 5.8, h: 0.62, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.03 });
      dy += 1.02;
    });

    L.card(pres, s, { x: M, y: 6.15, w: W, h: 0.68, fill: C.tint2 });
    L.txt(s, [
      { text: 'Keterbatasan utama:  ', options: { bold: true, color: C.brick } },
      { text: 'model ini tidak menjelaskan apa yang harus terjadi ketika dua tanggung jawab saling bertentangan — dan ia menonjolkan sudut pandang manajerial.', options: { color: C.ink } },
    ], { x: M + 0.32, y: 6.15, w: 11.4, h: 0.68, fontSize: 12, valign: 'middle' });
    L.foot(s, 'Kerangka 1 · CSR', n());
    s.addNotes('Ingatkan keterbatasan ini — nanti persis inilah yang muncul di kasus Djarum: level ekonomi dan filantropis kuat, level etis bermasalah, dan Carroll tidak memberi jalan keluar.');
  }

  // ----------------------------------------------- 14. STRATEGI CSR
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Tabel 2.2 · Strategies of CSR', 'Dua Strategi: "Bolt-on" vs "Built-in"', {
      lead: 'Cara perusahaan memprioritaskan tiap lapis CSR bergantung pada strategi besarnya.',
    });
    const rows = [
      [{ text: '', options: { fill: { color: C.paper } } },
       { text: 'TRADITIONAL CSR', options: { bold: true, color: C.paper, fill: { color: C.brick2 }, align: 'center', fontSize: 12.5, charSpacing: 1 } },
       { text: 'CONTEMPORARY CSR', options: { bold: true, color: C.paper, fill: { color: C.sage }, align: 'center', fontSize: 12.5, charSpacing: 1 } }],
      [{ text: 'Fokus', options: { bold: true } }, { text: 'Risiko' }, { text: 'Imbalan' }],
      [{ text: 'Pendorong', options: { bold: true } }, { text: 'Citra, merek, penerimaan publik' }, { text: 'Kinerja, pasar, produk' }],
      [{ text: 'Hubungan dengan bottom line', options: { bold: true } }, { text: 'Tidak berkontribusi langsung: CSR adalah distribusi nilai' }, { text: 'Tujuan integral: CSR adalah penciptaan nilai' }],
      [{ text: 'Responsiveness', options: { bold: true } }, { text: 'Reaksi, defensif' }, { text: 'Akomodasi, proaktif' }],
      [{ text: 'Motto', options: { bold: true } },
       { text: '"CSR is bolt-on"', options: { bold: true, italic: true, color: C.brick } },
       { text: '"CSR is built-in"', options: { bold: true, italic: true, color: C.sage } }],
    ];
    s.addTable(rows, {
      x: M, y: 2.34, w: W, colW: [3.1, 4.5, 4.5], rowH: [0.42, 0.5, 0.5, 0.66, 0.5, 0.5],
      fontFace: BODY, fontSize: 12.5, color: C.ink, valign: 'middle',
      border: { type: 'solid', color: C.line, pt: 1 },
      fill: { color: C.paper }, margin: [6, 12, 6, 12],
    });
    L.card(pres, s, { x: M, y: 5.75, w: W, h: 0.94, fill: C.tint });
    L.txt(s, 'Pada strategi tradisional, laba dikejar lebih dulu tanpa banyak memperhatikan ekspektasi masyarakat; sebagian nilai lalu dibagikan ke berbagai kegiatan sosial demi citra. Pada strategi kontemporer, perusahaan bekerja bersama stakeholder dan mengintegrasikan ekspektasi sosial langsung ke dalam operasi intinya.', {
      x: M + 0.32, y: 5.75, w: 11.4, h: 0.94, fontSize: 12, color: C.ink, valign: 'middle', lineSpacingMultiple: 1.05,
    });
    L.foot(s, 'Kerangka 1 · CSR', n());
  }

  // -------------------------------------- 15. CSR KONTEKS INTERNASIONAL
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'CSR in an international context', 'CSR Tidak Berbunyi Sama di Semua Tempat', { size: 30,
      lead: 'Penting untuk kasus Indonesia: piramida Carroll lahir dari konteks Amerika Serikat.' });

    L.card(pres, s, { x: M, y: 2.24, w: 5.95, h: 1.5, fill: C.tint });
    L.txt(s, 'EXPLICIT CSR', { x: M + 0.3, y: 2.44, w: 5.35, h: 0.3, fontSize: 12, bold: true, color: C.brick, charSpacing: 1.2, valign: 'middle' });
    L.txt(s, 'CSR sebagai aktivitas perusahaan swasta yang berdiri sendiri dan diberi nama secara eksplisit. Khas Amerika Serikat, yang memberi banyak keleluasaan pada perusahaan.', {
      x: M + 0.3, y: 2.76, w: 5.35, h: 0.86, fontSize: 12, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });

    L.card(pres, s, { x: 6.75, y: 2.24, w: 5.95, h: 1.5, fill: C.tint });
    L.txt(s, 'IMPLICIT CSR', { x: 7.05, y: 2.44, w: 5.35, h: 0.3, fontSize: 12, bold: true, color: C.sage, charSpacing: 1.2, valign: 'middle' });
    L.txt(s, 'Tanggung jawab sosial tertanam erat dalam kerangka hukum dan institusi masyarakat — lewat regulasi di Eropa, dan lewat institusi lunak seperti tradisi keagamaan, adat, atau kesukuan di Asia dan Afrika.', {
      x: 7.05, y: 2.76, w: 5.35, h: 0.86, fontSize: 12, color: C.muted, valign: 'top', lineSpacingMultiple: 1.05 });

    L.txt(s, 'Yang berubah di konteks negara berkembang', { x: M, y: 4.02, w: W, h: 0.34, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const dev = [
      { t: 'Filantropis', d: 'Di tengah kemiskinan yang meluas, perusahaan makin diharapkan "berbagi" kekayaan dengan komunitas lokal.' },
      { t: 'Etis', d: 'Kepercayaan pada bisnis justru lebih tinggi, namun tanggung jawab ekonomi dan filantropis didahulukan atas ekspektasi etis (Visser 2008).' },
      { t: 'Hukum', d: 'Kepatuhan hukum sering bukan ukuran perilaku bertanggung jawab yang andal, karena pemerintahan lemah atau korup.' },
      { t: 'Ekonomi', d: 'Pendekatan Eropa dan Asia menekankan tanggung jawab ekonomi terhadap karyawan dan komunitas, bukan hanya pemegang saham.' },
    ];
    let x = M;
    dev.forEach((d, i) => {
      L.card(pres, s, { x, y: 4.44, w: 2.875, h: 1.72, fill: C.tint2 });
      L.txt(s, d.t, { x: x + 0.24, y: 4.62, w: 2.4, h: 0.3, fontSize: 13.5, bold: true, color: [C.gold, C.clay, C.brick2, C.dark][i], fontFace: HEAD, valign: 'middle' });
      L.txt(s, d.d, { x: x + 0.24, y: 4.94, w: 2.4, h: 1.08, fontSize: 11, color: C.ink, valign: 'top', lineSpacingMultiple: 1.05 });
      x += 3.075;
    });
    L.txt(s, [
      { text: 'Jamali et al. (2017): ', options: { bold: true, color: C.brick } },
      { text: 'pemahaman CSR arus utama harus di-translate agar bisa diterapkan di negara berkembang, lalu di-adapt dan dilokalkan agar bermakna — CSR sebagai alat pembangunan berkelanjutan selalu tertanam secara kultural.', options: { color: C.ink } },
    ], { x: M, y: 6.28, w: W, h: 0.6, fontSize: 12, valign: 'middle', lineSpacingMultiple: 1.02 });
    L.foot(s, 'Kerangka 1 · CSR', n());
  }

  // ---------------------------------------------------- 16. CSP
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Outcomes of CSR', 'Corporate Social Performance', {
      lead: 'Jika kinerja ekonomi bisa diukur dan diperingkat, mengapa kinerja sosial tidak? Model Donna Wood (1991) memecahnya menjadi tiga tahap.',
      leadW: 11.6,
    });
    const flow = [
      { t: 'Principles', d: 'Prinsip-prinsip CSR yang dianut perusahaan.', c: C.brick },
      { t: 'Processes', d: 'Proses social responsiveness — yaitu strategi CSR yang dipilih.', c: C.clay },
      { t: 'Outcomes', d: 'Hasil nyata dari perilaku korporasi, yang dipecah menjadi tiga bentuk di bawah.', c: C.sage },
    ];
    let x = M;
    flow.forEach((f, i) => {
      L.card(pres, s, { x, y: 2.36, w: 3.6, h: 1.2, fill: C.tint });
      L.txt(s, f.t, { x: x + 0.26, y: 2.54, w: 3.1, h: 0.34, fontSize: 16, bold: true, color: f.c, fontFace: HEAD, valign: 'middle' });
      L.txt(s, f.d, { x: x + 0.26, y: 2.88, w: 3.1, h: 0.56, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.03 });
      if (i < 2) {
        L.txt(s, '→', { x: x + 3.6, y: 2.36, w: 0.65, h: 1.2, fontSize: 22, bold: true, color: C.line, align: 'center', valign: 'middle' });
      }
      x += 4.25;
    });

    L.txt(s, 'Tiga bentuk outcome (Tabel 2.3)', { x: M, y: 3.86, w: W, h: 0.34, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    const out = [
      { t: 'Social Policies', d: 'Pernyataan nilai, keyakinan, dan tujuan perusahaan terhadap lingkungan sosialnya, biasanya termuat dalam pernyataan misi dan kebijakan korporat.', ex: 'Contoh: komitmen IKEA memakai 100% energi terbarukan dan kayu dari sumber lestari, dilaporkan tiap tahun.' },
      { t: 'Social Programmes', d: 'Aktivitas, langkah, dan instrumen yang dijalankan untuk mewujudkan kebijakan sosial tersebut.', ex: 'Contoh: sistem manajemen lingkungan ISO 14000 dan EMAS, atau standar CSR internasional ISO 26000.' },
      { t: 'Social Impacts', d: 'Perubahan nyata yang benar-benar terjadi pada masyarakat dan lingkungan sebagai akibat tindakan perusahaan.', ex: 'Ini bagian tersulit diukur — dan justru yang paling menentukan apakah CSR bermakna.' },
    ];
    x = M;
    out.forEach((o, i) => {
      L.card(pres, s, { x, y: 4.28, w: 3.83, h: 2.10, fill: i === 2 ? C.tint2 : C.tint });
      L.txt(s, o.t, { x: x + 0.28, y: 4.46, w: 3.3, h: 0.32, fontSize: 14.5, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
      L.txt(s, o.d, { x: x + 0.28, y: 4.80, w: 3.3, h: 1.00, fontSize: 11.5, color: C.muted, valign: 'top', lineSpacingMultiple: 1.03 });
      L.txt(s, o.ex, { x: x + 0.28, y: 5.84, w: 3.3, h: 0.48, fontSize: 10.5, italic: true, color: C.brick, valign: 'top', lineSpacingMultiple: 1.0 });
      x += 4.135;
    });
    L.source(s, 'Wood (1991); Gond & Crane (2010), dalam Crane et al. (2019), Bab 2, hlm. 55-57.', 6.48);
    L.foot(s, 'Kerangka 1 · CSR', n());
  }

  // ------------------------------------------------- 17. KRITIK CSR
  {
    const s = pres.addSlide(); L.bg(s, C.paper);
    L.head(s, 'Sisi gelap CSR', 'Kritik terhadap CSR — dan Satu Jawaban atasnya', { size: 29 });

    const crit = [
      { a: 'Friedman (1970)', d: 'Ketika CSR dijalankan demi kepentingan diri sendiri, itu bukan CSR sama sekali, melainkan maksimalisasi laba "under the cloak of social responsibility".' },
      { a: 'Banerjee (2007)', d: 'CSR hanya membantu melegitimasi aktivitas korporasi dan mengonsolidasikan kekuasaan perusahaan besar.' },
      { a: 'Fleming & Jones (2012)', d: 'Gagasan bahwa perusahaan bisa mengejar laba sekaligus bertanggung jawab sosial hanyalah mitos — CSR menopang, bukan menantang, sistem kapitalis yang ada. Mereka menyebutnya "the end of CSR".' },
      { a: 'Costas & Kärreman (2013)', d: 'Pada level mikro, CSR dipakai sebagai mekanisme mengendalikan karyawan dengan mengikat nurani etis mereka pada aktivitas organisasi.' },
    ];
    L.txt(s, 'Empat suara kritis', { x: M, y: 1.72, w: 6.2, h: 0.32, fontSize: 15, bold: true, color: C.ink, fontFace: HEAD, valign: 'middle' });
    let y = 2.14;
    crit.forEach((c) => {
      L.card(pres, s, { x: M, y, w: 6.2, h: 1.06, fill: C.tint });
      L.txt(s, c.a, { x: M + 0.26, y: y + 0.14, w: 5.7, h: 0.28, fontSize: 12.5, bold: true, color: C.brick, valign: 'middle' });
      L.txt(s, c.d, { x: M + 0.26, y: y + 0.42, w: 5.7, h: 0.54, fontSize: 11, color: C.muted, valign: 'top', lineSpacingMultiple: 1.02 });
      y += 1.16;
    });

    L.card(pres, s, { x: 7.25, y: 1.72, w: 5.45, h: 4.62, fill: C.dark });
    L.txt(s, 'SATU RESPONS', { x: 7.55, y: 1.94, w: 4.85, h: 0.28, fontSize: 10.5, bold: true, color: C.gold2, charSpacing: 1.5, valign: 'middle' });
    L.txt(s, 'Creating Shared Value', { x: 7.55, y: 2.24, w: 4.85, h: 0.44, fontSize: 22, bold: true, color: C.paper, fontFace: HEAD, valign: 'middle' });
    L.txt(s, 'Porter & Kramer (2006) menawarkan tiga jalan:', { x: 7.55, y: 2.72, w: 4.85, h: 0.3, fontSize: 12, color: C.onDarkMuted, valign: 'middle' });
    const csv = [
      'Menata ulang produk dan pasar — melayani konsumen sekaligus berkontribusi pada kebaikan bersama.',
      'Mendefinisikan ulang produktivitas rantai nilai — memperkuat kapabilitas sosial, lingkungan, dan ekonomi para pemasok.',
      'Memungkinkan pengembangan klaster lokal, sehingga berbagai tujuan pembangunan tercapai lewat kolaborasi setempat.',
    ];
    let cy = 3.10;
    csv.forEach((t, i) => {
      L.badge(pres, s, { x: 7.55, y: cy + 0.02, d: 0.36, text: String.fromCharCode(97 + i), fill: C.gold, size: 11, color: C.ink });
      L.txt(s, t, { x: 8.05, y: cy, w: 4.35, h: 0.78, fontSize: 11.5, color: C.paper, valign: 'top', lineSpacingMultiple: 1.05 });
      cy += 0.86;
    });
    L.txt(s, [
      { text: 'Kritik balik — Crane et al. (2014): ', options: { bold: true, color: C.gold2 } },
      { text: '"CSV dan kekurangannya adalah pengingat keras bahwa tugas memahami perusahaan sebagai usaha bermaksud jamak masih belum terselesaikan."', options: { italic: true, color: C.onDarkMuted } },
    ], { x: 7.55, y: 5.72, w: 4.85, h: 0.5, fontSize: 10.5, valign: 'top', lineSpacingMultiple: 1.02 });
    L.foot(s, 'Kerangka 1 · CSR', n());
    s.addNotes('Kritik ini akan dipakai langsung di slide analisis kasus Djarum — apakah CSR Djarum mengubah peran bisnis, atau justru melegitimasi produknya?');
  }
};
