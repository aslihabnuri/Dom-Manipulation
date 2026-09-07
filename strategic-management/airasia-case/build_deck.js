const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Kelompok 3";
pres.title = "AirAsia: The World's Lowest Cost Airline";

// Palette: AirAsia red dominant, charcoal, white, soft grey
const RED = "C8102E";
const DARKRED = "8E0B20";
const INK = "1C1C1C";
const MUTED = "6E6E6E";
const LIGHT = "F4F4F4";
const TINT = "FBE9EC";
const WHITE = "FFFFFF";
const LINE = "DDDDDD";
const PINK = "F1C7CF";
const GREEN = "2E7D32";
const AMBER = "B26A00";
const HFONT = "Cambria";
const BFONT = "Calibri";

let slideNo = 0;

function footer(slide, dark) {
  slideNo += 1;
  slide.addText("Kelompok 3  |  Strategic Management MAN 5422  |  Kasus AirAsia", {
    x: 0.6, y: 7.05, w: 8, h: 0.3, fontFace: BFONT, fontSize: 9,
    color: dark ? PINK : MUTED, margin: 0, isTextBox: true,
  });
  slide.addText(String(slideNo), {
    x: 12.1, y: 7.05, w: 0.63, h: 0.3, fontFace: BFONT, fontSize: 9, align: "right",
    color: dark ? PINK : MUTED, margin: 0, isTextBox: true,
  });
}

function header(slide, kicker, title) {
  slide.background = { color: WHITE };
  if (kicker) {
    slide.addText(kicker.toUpperCase(), {
      x: 0.6, y: 0.35, w: 12, h: 0.3, fontFace: BFONT, fontSize: 11, bold: true,
      color: RED, charSpacing: 2, margin: 0, isTextBox: true,
    });
  }
  slide.addText(title, {
    x: 0.6, y: 0.62, w: 12.1, h: 0.8, fontFace: HFONT, fontSize: 26, bold: true,
    color: INK, margin: 0, isTextBox: true, valign: "middle",
  });
}

function numCircle(slide, x, y, n, d, fill, txtColor) {
  d = d || 0.45;
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill || RED }, line: { color: fill || RED } });
  slide.addText(String(n), {
    x, y, w: d, h: d, fontFace: BFONT, fontSize: d >= 0.5 ? 16 : 13, bold: true,
    color: txtColor || WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true,
  });
}

function box(slide, x, y, w, h, fill) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill } });
}

function bullets(items, size, color) {
  return items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 5, fontSize: size || 12, color: color || INK } }));
}

function strip(slide, y, h, lead, body, fill, leadColor, textColor) {
  box(slide, 0.6, y, 12.1, h, fill || TINT);
  slide.addText([
    { text: lead + " ", options: { bold: true, color: leadColor || RED } },
    { text: body, options: { color: textColor || INK } },
  ], { x: 0.85, y: y + 0.06, w: 11.6, h: h - 0.12, fontFace: BFONT, fontSize: 11.5, margin: 0, isTextBox: true, valign: "middle" });
}

// ---------------------------------------------------------------- 1. Title
{
  const s = pres.addSlide();
  s.background = { color: DARKRED };
  s.addShape(pres.ShapeType.ellipse, { x: 9.2, y: -1.6, w: 6.2, h: 6.2, fill: { color: RED }, line: { color: RED } });
  s.addText("CASE ANALYSIS  |  SESSION 4: EVALUATING A COMPANY'S EXTERNAL ENVIRONMENT", {
    x: 0.7, y: 1.1, w: 9, h: 0.35, fontFace: BFONT, fontSize: 12, bold: true, color: PINK, charSpacing: 2, margin: 0, isTextBox: true,
  });
  s.addText("AirAsia", { x: 0.7, y: 1.55, w: 9, h: 1.2, fontFace: HFONT, fontSize: 60, bold: true, color: WHITE, margin: 0, isTextBox: true });
  s.addText("The World's Lowest Cost Airline", { x: 0.7, y: 2.7, w: 9, h: 0.7, fontFace: HFONT, fontSize: 30, color: WHITE, margin: 0, isTextBox: true });
  s.addText("Sejauh mana keunggulan biaya (cost advantage) yang dibangun di rute pendek dapat dibawa ke pasar penerbangan jarak jauh?", {
    x: 0.7, y: 3.5, w: 8.5, h: 0.8, fontFace: BFONT, fontSize: 16, italic: true, color: PINK, margin: 0, isTextBox: true,
  });
  s.addText([
    { text: "Kelompok 3", options: { bold: true, breakLine: true, fontSize: 14 } },
    { text: "Tifani Puspita  |  Dara Astrini Rahayu K  |  Happy Dinithasari  |  Aslih Abnuri", options: { breakLine: true, fontSize: 12 } },
    { text: " ", options: { breakLine: true, fontSize: 6 } },
    { text: "Strategic Management (MAN 5422), Program Magister Manajemen, Fakultas Ekonomika dan Bisnis, Universitas Gadjah Mada", options: { breakLine: true, fontSize: 11 } },
    { text: "Dosen: Dr. Rangga Almahendra, S.T., M.M.", options: { fontSize: 11 } },
  ], { x: 0.7, y: 5.0, w: 11, h: 1.6, fontFace: BFONT, color: WHITE, margin: 0, isTextBox: true, valign: "top" });
  footer(s, true);
  s.addNotes("Pembuka. Sampaikan satu pertanyaan strategis: apakah keunggulan biaya AirAsia yang dibangun di rute pendek dapat dipindahkan ke rute jarak jauh melalui AirAsia X. Kasus ditulis Robert M. Grant (2010), data per 2008 sampai pertengahan 2009.");
}

// ---------------------------------------------------------------- 2. Kerangka analisis
{
  const s = pres.addSlide();
  header(s, "Analytical framework", "Reading the word 'lowest cost' through a different lens");
  strip(s, 1.55, 1.0, "Reframing.", "Predikat lowest cost airline sering dibaca sebagai kelemahan, seolah AirAsia sekadar menjual murah. Dengan kacamata yang lebih tepat, murah adalah buah dari disiplin biaya (cost discipline) yang sistematis. Pertanyaannya bukan mengapa AirAsia murah, melainkan apakah sistem yang membuatnya murah dapat dipindahkan (transferable) ke medan yang berbeda.", LIGHT);
  const steps = [
    ["Rumusan masalah", "Tujuan (goals) yang ingin dicapai AirAsia dan hambatan (barriers) yang menghalanginya.", "Panduan analisis kasus RPKPS"],
    ["Lingkungan eksternal", "PESTEL, Five Forces dalam logika Structure Conduct Performance, kekuatan pendorong (driving forces), peta kelompok strategis, faktor kunci keberhasilan.", "Thompson dan Strickland Bab 3"],
    ["Posisi biaya AirAsia", "Benchmarking terhadap Malaysia Airlines dan pesaing jarak jauh untuk menguji seberapa nyata keunggulan biaya itu, lalu uji transferabilitas.", "Grant Bab 4, Tabel 9.1 sampai 9.5"],
    ["Isu, alternatif, rekomendasi", "Isu sebagai pertanyaan, alternatif dinilai dengan kriteria yang sama, satu rekomendasi dengan KPI, waktu, penanggung jawab, dan mitigasi risiko.", "Lensa exploration dan exploitation"],
  ];
  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    box(s, x, 2.8, 2.9, 3.15, LIGHT);
    numCircle(s, x + 0.2, 2.98, i + 1, 0.42);
    s.addText(st[0], { x: x + 0.75, y: 2.95, w: 2.0, h: 0.5, fontFace: BFONT, fontSize: 13.5, bold: true, color: INK, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(st[1], { x: x + 0.22, y: 3.55, w: 2.5, h: 1.75, fontFace: BFONT, fontSize: 11, color: INK, margin: 0, isTextBox: true, valign: "top" });
    s.addText(st[2], { x: x + 0.22, y: 5.35, w: 2.5, h: 0.5, fontFace: BFONT, fontSize: 9.5, italic: true, color: RED, margin: 0, isTextBox: true, valign: "bottom" });
  });
  s.addText("Pemahaman konseptual dari buku teks dilengkapi pemahaman kontekstual dari data kasus. Seluruh angka bersumber dari tabel dalam kasus, tanpa data tambahan dari luar.", {
    x: 0.6, y: 6.15, w: 12.1, h: 0.6, fontFace: BFONT, fontSize: 11, italic: true, color: MUTED, margin: 0, isTextBox: true, valign: "middle",
  });
  footer(s);
  s.addNotes("Jelaskan bahwa urutan analisis mengikuti logika SCP: struktur industri menentukan perilaku perusahaan dan pada akhirnya kinerja. Analisis eksternal dulu, baru posisi perusahaan, baru pilihan. Lensa exploration dan exploitation dipakai untuk membaca hubungan AirAsia dan AirAsia X.");
}

// ---------------------------------------------------------------- 3. Fakta kunci
{
  const s = pres.addSlide();
  header(s, "Company context", "Seven years after the relaunch, AirAsia is Asia's most successful LCC");
  const stats = [
    ["79", "pesawat pada Maret 2009, dari 2 pesawat pada Januari 2002"],
    ["11,8 juta", "penumpang per tahun, dari 200 ribu pada periode yang sama"],
    ["10 negara", "jangkauan jaringan rute di Asia Tenggara, dengan hub KL, Bangkok, dan Jakarta"],
    ["RM 1", "harga akuisisi tahun 2001, dengan warisan utang RM 40 juta"],
  ];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    box(s, x, 1.65, 2.9, 1.75, LIGHT);
    s.addText(st[0], { x: x + 0.2, y: 1.75, w: 2.5, h: 0.75, fontFace: HFONT, fontSize: 30, bold: true, color: RED, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(st[1], { x: x + 0.2, y: 2.55, w: 2.5, h: 0.75, fontFace: BFONT, fontSize: 11, color: MUTED, margin: 0, isTextBox: true, valign: "top" });
  });
  s.addText("Tonggak penting", { x: 0.6, y: 3.7, w: 5, h: 0.4, fontFace: BFONT, fontSize: 14, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText(bullets([
    "2001: Tony Fernandes dan Conor McCarthy (mantan direktur operasi Ryanair) mengambil alih AirAsia atas dorongan PM Mahathir.",
    "2002: relaunch dengan tiga pesawat. Formula bisnisnya: strategi operasi ala Ryanair, strategi SDM ala Southwest, strategi merek ala easyJet.",
    "2004: rute internasional pertama (KL ke Phuket); IPO menghimpun RM 717 juta; usaha patungan (joint venture) Thai AirAsia dan Indonesia AirAsia.",
    "2007: AirAsia X mulai terbang jarak jauh ke Australia dan Cina; 2009 ke London, dengan rencana ke India dan hub kedua di Abu Dhabi.",
  ], 12), { x: 0.6, y: 4.1, w: 7.4, h: 2.8, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  box(s, 8.4, 3.7, 4.3, 3.15, TINT);
  s.addText("Pengakuan kinerja", { x: 8.65, y: 3.8, w: 3.9, h: 0.4, fontFace: BFONT, fontSize: 14, bold: true, color: RED, margin: 0, isTextBox: true });
  s.addText(bullets([
    "Riset UBS 2007: biaya per available seat kilometer (ASK) terendah di dunia, di bawah Southwest, JetBlue, Ryanair, dan Virgin Blue.",
    "2008: imbal hasil aset (return on assets) 4 persen ketika hampir semua maskapai dunia merugi.",
    "2009: Skytrax Award sebagai The World's Best Low Cost Airline.",
  ], 12), { x: 8.65, y: 4.25, w: 3.85, h: 2.5, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  footer(s);
  s.addNotes("Tekankan skala pertumbuhan dan pengakuan eksternal. Angka ROA 4 persen mengacu pada laba operasi sebelum depresiasi, amortisasi, dan bunga terhadap rata-rata total aset (catatan kaki kasus).");
}

// ---------------------------------------------------------------- 4. Rumusan masalah
{
  const s = pres.addSlide();
  header(s, "Problem statement", "Two wings to keep in balance: exploiting short haul, exploring long haul");
  box(s, 0.6, 1.65, 5.9, 2.75, LIGHT);
  s.addText("TUJUAN (GOALS)", { x: 0.85, y: 1.78, w: 5.4, h: 0.35, fontFace: BFONT, fontSize: 11, bold: true, color: RED, charSpacing: 1, margin: 0, isTextBox: true });
  s.addText(bullets([
    "Bertransformasi dari maskapai regional (radius 3,5 jam terbang dari hub) menjadi maskapai internasional.",
    "Mempertahankan posisi sebagai operator berbiaya terendah (lowest cost operator) di setiap rute yang dilayani.",
    "Menjaga pertumbuhan volume; rute gemuk (trunk routes) jarak jauh adalah sumber lalu lintas berikutnya (Azran Osman-Rani, CEO AirAsia X).",
  ], 12), { x: 0.85, y: 2.15, w: 5.45, h: 2.2, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  box(s, 6.8, 1.65, 5.9, 2.75, TINT);
  s.addText("HAMBATAN (BARRIERS)", { x: 7.05, y: 1.78, w: 5.4, h: 0.35, fontFace: BFONT, fontSize: 11, bold: true, color: RED, charSpacing: 1, margin: 0, isTextBox: true });
  s.addText(bullets([
    "Efisiensi model LCC bertumpu pada rute pendek, satu tipe pesawat, dan layanan minimal. Rute antarbenua melanggar ketiganya.",
    "Pesaing jarak jauh adalah maskapai jaringan (network carriers) dengan rute pengumpan (feeder), tiket terusan, dan subsidi silang dari kelas premium.",
    "Neraca 2008 rapuh: rugi bersih RM 496,6 juta, utang RM 6,69 miliar berbanding ekuitas RM 1,61 miliar, kas hanya RM 153,8 juta (Tabel 9.1).",
  ], 12), { x: 7.05, y: 2.15, w: 5.45, h: 2.2, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  box(s, 0.6, 4.7, 12.1, 2.1, INK);
  s.addText("PERTANYAAN STRATEGIS", { x: 0.9, y: 4.85, w: 6, h: 0.35, fontFace: BFONT, fontSize: 11, bold: true, color: PINK, charSpacing: 1, margin: 0, isTextBox: true });
  s.addText([
    { text: "Apakah sumber keunggulan biaya AirAsia dapat ditransfer ke pasar jarak jauh, dan bagaimana AirAsia sebaiknya menata hubungan dengan AirAsia X agar eksplorasi (exploration) pasar baru tidak menggerus eksploitasi (exploitation) model yang sudah terbukti?", options: { fontSize: 16, color: WHITE, breakLine: true } },
    { text: " ", options: { fontSize: 6, breakLine: true } },
    { text: "Keputusan yang menunggu manajemen pada pertengahan 2009: merger AirAsia X ke dalam AirAsia, tetap terpisah dengan kontrak layanan, atau kembali fokus ke pasar regional.", options: { fontSize: 12, color: PINK } },
  ], { x: 0.9, y: 5.2, w: 11.5, h: 1.5, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  footer(s);
  s.addNotes("Mengikuti panduan RPKPS: masalah dirumuskan sebagai tujuan yang terhalang. Kata kuncinya goals dan barrier. Istilah exploration dan exploitation mengacu pada March (1991): perusahaan harus menyeimbangkan pendalaman kompetensi yang ada dengan pencarian peluang baru.");
}

// ---------------------------------------------------------------- 5. PESTEL
{
  const s = pres.addSlide();
  header(s, "Macro environment analysis", "PESTEL: Southeast Asia opens more opportunities than it poses threats");
  const items = [
    ["P", "Politik", "Dukungan pemerintah Malaysia sejak akuisisi 2001. Namun rute jarak jauh menempatkan AirAsia berhadapan langsung dengan Malaysia Airlines, maskapai nasional (flag carrier). Itulah alasan AirAsia X didirikan sebagai entitas terpisah, agar relasi politik tetap terjaga."],
    ["E", "Ekonomi", "Kemakmuran Malaysia dan kawasan meningkat; 500 juta penduduk dalam radius 3,5 jam terbang, sebagian besar belum pernah naik pesawat. Harga minyak 2008 sangat fluktuatif; bahan bakar adalah 47 persen biaya operasi AirAsia (RM 1,39 miliar dari RM 2,97 miliar)."],
    ["S", "Sosial", "Segmen wisatawan dan pebisnis berpendapatan menengah yang selama ini kurang terlayani (underserved). Slogan Now Everyone Can Fly sejatinya adalah strategi memperluas pasar (market expansion), bukan sekadar merebut pangsa."],
    ["T", "Teknologi", "Sistem reservasi Navitaire Open Skies, yield management system, boarding pass cetak sendiri, pemesanan lewat ponsel (2006), ERP dan advanced planning system. Distribusi langsung memangkas komisi agen dan menjadi sumber biaya rendah yang sulit ditiru maskapai lama."],
    ["E", "Lingkungan", "Efisiensi bahan bakar menentukan jejak biaya sekaligus jejak karbon. Armada A320 baru yang hemat bahan bakar menjadi keharusan, bukan pilihan. Di rute jauh, A340 empat mesin justru boros dibanding pesaing bermesin dua."],
    ["L", "Legal", "Deregulasi penerbangan Asia Tenggara membuka rute lintas negara. Kepemilikan asing masih dibatasi, sehingga ekspansi ke Thailand dan Indonesia harus lewat usaha patungan (joint venture) yang operasinya dikontrakkan kembali ke AirAsia dengan imbalan fee bulanan."],
  ];
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.05, y = 1.65 + row * 2.65;
    box(s, x, y, 3.85, 2.45, LIGHT);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.2, y: y + 0.18, w: 0.5, h: 0.5, fill: { color: RED }, line: { color: RED } });
    s.addText(it[0], { x: x + 0.2, y: y + 0.18, w: 0.5, h: 0.5, fontFace: HFONT, fontSize: 16, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[1], { x: x + 0.85, y: y + 0.18, w: 2.8, h: 0.5, fontFace: BFONT, fontSize: 14, bold: true, color: INK, valign: "middle", margin: 0, isTextBox: true });
    s.addText(it[2], { x: x + 0.22, y: y + 0.78, w: 3.45, h: 1.6, fontFace: BFONT, fontSize: 10.5, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  footer(s);
  s.addNotes("Simpulan PESTEL: faktor politik dan legal adalah pembentuk struktur paling kuat. Deregulasi menciptakan peluang, tetapi pembatasan kepemilikan asing dan relasi dengan maskapai nasional memaksa AirAsia memilih struktur joint venture dan entitas terpisah untuk AirAsia X. Angka 47 persen dihitung dari Tabel 9.1: 1.389,8 dibagi 2.966.");
}

// ---------------------------------------------------------------- 6. Five Forces
{
  const s = pres.addSlide();
  header(s, "Industry and competitive analysis", "Five Forces: industry structure squeezes margins, only the lowest cost operator survives");
  const cx = 4.35, cy = 3.35, cw = 2.7, ch = 1.5;
  box(s, cx, cy, cw, ch, RED);
  s.addText([
    { text: "Persaingan antar pemain (rivalry)", options: { bold: true, fontSize: 12, breakLine: true } },
    { text: "TINGGI", options: { bold: true, fontSize: 16, breakLine: true } },
    { text: "Banyak peniru model Southwest; MAS menekan di rute domestik; produk mudah dibandingkan lewat harga.", options: { fontSize: 9.5 } },
  ], { x: cx + 0.12, y: cy + 0.08, w: cw - 0.24, h: ch - 0.16, fontFace: BFONT, color: WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
  const forces = [
    { x: 4.35, y: 1.6, title: "Ancaman pendatang baru", level: "SEDANG", body: "Deregulasi dan pesawat sewaan menurunkan hambatan masuk (entry barriers). Penahan: slot bandara, merek, dan skala armada." },
    { x: 4.35, y: 5.1, title: "Produk substitusi", level: "SEDANG di rute pendek, RENDAH di rute jauh", body: "Bus, kereta, dan feri bersaing di rute domestik. Untuk lintas laut dan antarbenua, tidak ada pengganti yang setara." },
    { x: 0.6, y: 3.35, title: "Daya tawar pemasok", level: "TINGGI", body: "Airbus dan Boeing berduopoli; bahan bakar mengikuti harga minyak dunia; bandara dan navigasi menetapkan tarif tanpa ruang negosiasi." },
    { x: 8.1, y: 3.35, title: "Daya tawar pembeli", level: "TINGGI", body: "Penumpang sangat peka harga (price sensitive), biaya berpindah nol, perbandingan harga di internet terbuka. Penahan: pembeli terfragmentasi." },
  ];
  forces.forEach((f) => {
    const w = 3.5, h = 1.5;
    box(s, f.x, f.y, w, h, LIGHT);
    s.addText([
      { text: f.title + ": ", options: { bold: true, fontSize: 11.5 } },
      { text: f.level, options: { bold: true, fontSize: 11.5, color: RED, breakLine: true } },
      { text: f.body, options: { fontSize: 9.5 } },
    ], { x: f.x + 0.15, y: f.y + 0.08, w: w - 0.3, h: h - 0.16, fontFace: BFONT, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });
  s.addShape(pres.ShapeType.line, { x: 5.7, y: 3.1, w: 0, h: 0.25, line: { color: MUTED, width: 1.25 } });
  s.addShape(pres.ShapeType.line, { x: 5.7, y: 4.85, w: 0, h: 0.25, line: { color: MUTED, width: 1.25 } });
  s.addShape(pres.ShapeType.line, { x: 4.1, y: 4.1, w: 0.25, h: 0, line: { color: MUTED, width: 1.25 } });
  s.addShape(pres.ShapeType.line, { x: 7.05, y: 4.1, w: 1.05, h: 0, line: { color: MUTED, width: 1.25 } });
  const side = [
    { x: 8.1, y: 1.6, w: 4.6, title: "Logika Structure Conduct Performance", body: "Struktur industri yang keras (pemasok dan pembeli kuat, rivalitas tinggi) memaksa perilaku (conduct) berupa disiplin biaya ekstrem. Kinerja (performance) unggul hanya lahir dari posisi biaya terendah, bukan dari diferensiasi." },
    { x: 8.1, y: 5.1, w: 4.6, title: "Simpulan daya tarik industri", body: "Secara struktural industri kurang atraktif. Tahun 2008 hampir seluruh maskapai dunia merugi. Laba bukan berasal dari industri, melainkan dari posisi relatif perusahaan di dalamnya." },
    { x: 0.6, y: 1.6, w: 3.5, title: "Implikasi untuk rute jarak jauh", body: "Pembeli di rute KL London tetap peka harga, tetapi pesaingnya (Emirates, BA, MAS) mampu mensubsidi kelas ekonomi dari kelas premium." },
    { x: 0.6, y: 5.1, w: 3.5, title: "Kekuatan paling menentukan", body: "Daya tawar pemasok (bahan bakar dan pesawat) dan pembeli. Keduanya tidak dapat dikendalikan; yang bisa dikendalikan hanya struktur biaya sendiri." },
  ];
  side.forEach((b) => {
    box(s, b.x, b.y, b.w, 1.5, TINT);
    s.addText([
      { text: b.title, options: { bold: true, fontSize: 11.5, color: RED, breakLine: true } },
      { text: b.body, options: { fontSize: 10 } },
    ], { x: b.x + 0.2, y: b.y + 0.08, w: b.w - 0.4, h: 1.34, fontFace: BFONT, color: INK, valign: "middle", margin: 0, isTextBox: true });
  });
  footer(s);
  s.addNotes("Kaitkan dengan kerangka SCP yang dipresentasikan Kelompok 2 dan Porter (1980). Poin utamanya: profitabilitas AirAsia bukan karena industri menarik, tetapi karena posisi biaya relatifnya. Ini menjadi dasar pertanyaan transferabilitas ke rute jauh.");
}

// ---------------------------------------------------------------- 7. Driving forces & KSF
{
  const s = pres.addSlide();
  header(s, "Industry dynamics", "Driving forces change the rules of the game; key success factors decide who wins");
  s.addText("Kekuatan pendorong perubahan (driving forces)", { x: 0.6, y: 1.6, w: 6, h: 0.4, fontFace: BFONT, fontSize: 14, bold: true, color: INK, margin: 0, isTextBox: true });
  const dfs = [
    ["Deregulasi penerbangan regional", "Membuka rute lintas negara dan memungkinkan hub baru di Bangkok dan Jakarta melalui usaha patungan."],
    ["Internet dan distribusi langsung", "Penjualan lewat situs web dan call center menghapus komisi agen; ponsel menjadi kanal pemesanan utama di Asia."],
    ["Volatilitas harga bahan bakar", "Kenaikan lalu penurunan tajam pada 2008 menghukum maskapai yang salah posisi lindung nilai (hedging), termasuk AirAsia."],
    ["Pertumbuhan kelas menengah Asia", "Permintaan baru dari penumpang yang sebelumnya tidak terbang; pasar membesar, bukan sekadar berpindah."],
    ["Masuknya LCC ke jarak jauh", "AirAsia X, Jetstar, dan pemain lain menguji batas model; sangat sedikit yang berhasil sejauh ini."],
  ];
  dfs.forEach((d, i) => {
    const y = 2.05 + i * 0.86;
    numCircle(s, 0.6, y + 0.05, i + 1, 0.4);
    s.addText([
      { text: d[0], options: { bold: true, fontSize: 12, breakLine: true } },
      { text: d[1], options: { fontSize: 10.5, color: MUTED } },
    ], { x: 1.15, y, w: 5.2, h: 0.8, fontFace: BFONT, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  box(s, 6.9, 1.6, 5.8, 4.7, LIGHT);
  s.addText("Faktor kunci keberhasilan (key success factors) industri LCC", { x: 7.15, y: 1.72, w: 5.3, h: 0.4, fontFace: BFONT, fontSize: 13, bold: true, color: RED, margin: 0, isTextBox: true });
  const ksf = [
    ["Biaya per ASK terendah", "Satu-satunya sumber laba ketika harga menjadi dasar persaingan."],
    ["Utilisasi pesawat tinggi", "Turnaround cepat dan jam terbang panjang menyebar biaya tetap ke lebih banyak kursi."],
    ["Load factor tinggi", "Yield management yang disiplin; kursi kosong adalah biaya yang tidak kembali."],
    ["Kesederhanaan operasi", "Satu tipe pesawat, satu kelas, titik ke titik (point to point), tanpa transfer bagasi."],
    ["Merek yang dipercaya", "Persepsi aman dan andal agar harga murah tidak dibaca sebagai murahan."],
    ["Produktivitas SDM", "Karyawan multi-skill, insentif berbasis produktivitas, retensi tinggi."],
  ];
  ksf.forEach((k, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 7.15 + col * 2.75, y = 2.3 + row * 1.3;
    s.addText([
      { text: k[0], options: { bold: true, fontSize: 11.5, breakLine: true } },
      { text: k[1], options: { fontSize: 10, color: MUTED } },
    ], { x, y, w: 2.55, h: 1.2, fontFace: BFONT, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  s.addText([
    { text: "Benang merah. ", options: { bold: true, color: RED } },
    { text: "Apabila pembeli peka harga dan pemasok kuat, maka faktor penentu kemenangan adalah biaya, utilisasi, dan load factor. Slide berikutnya menguji apakah AirAsia memenuhi ketiganya dibanding Malaysia Airlines.", options: { color: INK } },
  ], { x: 6.9, y: 6.4, w: 5.8, h: 0.5, fontFace: BFONT, fontSize: 10.5, margin: 0, isTextBox: true, valign: "middle" });
  footer(s);
  s.addNotes("KSF diturunkan dari struktur industri, bukan dari daftar generik. Kalau pembeli peka harga dan pemasok kuat, faktor penentu kemenangan adalah biaya, utilisasi, dan load factor.");
}

// ---------------------------------------------------------------- 8. Strategic group map
{
  const s = pres.addSlide();
  header(s, "Strategic group map", "AirAsia X enters a nearly empty space: low cost on long haul routes");
  const ax = 1.2, ay = 1.7, aw = 7.3, ah = 4.9;
  s.addShape(pres.ShapeType.rect, { x: ax, y: ay, w: aw, h: ah, fill: { color: WHITE }, line: { color: LINE, width: 1 } });
  s.addShape(pres.ShapeType.line, { x: ax, y: ay + ah / 2, w: aw, h: 0, line: { color: LINE, width: 0.75, dashType: "dash" } });
  s.addShape(pres.ShapeType.line, { x: ax + aw / 2, y: ay, w: 0, h: ah, line: { color: LINE, width: 0.75, dashType: "dash" } });
  s.addText("Cakupan geografis: regional (kurang dari 4 jam)  ke  jarak jauh (lebih dari 4 jam)", { x: ax, y: ay + ah + 0.05, w: aw, h: 0.3, fontFace: BFONT, fontSize: 10, color: MUTED, align: "center", margin: 0, isTextBox: true });
  s.addText("Layanan dan biaya: tinggi", { x: 0.55, y: ay, w: 0.6, h: 0.9, fontFace: BFONT, fontSize: 9, color: MUTED, margin: 0, isTextBox: true, valign: "top" });
  s.addText("Layanan dan biaya: rendah", { x: 0.55, y: ay + ah - 0.9, w: 0.6, h: 0.9, fontFace: BFONT, fontSize: 9, color: MUTED, margin: 0, isTextBox: true, valign: "bottom" });
  const groups = [
    { x: 5.4, y: 1.95, w: 2.8, h: 1.5, fill: "9E9E9E", txt: WHITE, title: "Network carriers jarak jauh", body: "Emirates, British Airways, Malaysia Airlines, Etihad, Qatar. Layanan penuh, hub and spoke, subsidi silang dari kelas premium." },
    { x: 1.45, y: 2.4, w: 2.7, h: 1.25, fill: "C4C4C4", txt: INK, title: "Full service regional", body: "Malaysia Airlines domestik, Singapore Airlines rute pendek, Thai Airways." },
    { x: 1.45, y: 4.9, w: 2.7, h: 1.4, fill: RED, txt: WHITE, title: "LCC regional", body: "AirAsia, Thai AirAsia, Indonesia AirAsia, Tiger, Cebu Pacific, Jetstar Asia. Titik ke titik, satu tipe pesawat." },
    { x: 5.4, y: 4.75, w: 2.8, h: 1.55, fill: DARKRED, txt: WHITE, title: "LCC jarak jauh", body: "AirAsia X (A330 dan A340, kursi ekonomi dan premium, makanan pesan di muka). Kelompok baru dengan sedikit penghuni." },
  ];
  groups.forEach((g) => {
    s.addShape(pres.ShapeType.ellipse, { x: g.x, y: g.y, w: g.w, h: g.h, fill: { color: g.fill }, line: { color: g.fill } });
    s.addText([
      { text: g.title, options: { bold: true, fontSize: 11.5, breakLine: true } },
      { text: g.body, options: { fontSize: 9 } },
    ], { x: g.x + 0.3, y: g.y + 0.1, w: g.w - 0.6, h: g.h - 0.2, fontFace: BFONT, color: g.txt, align: "center", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addShape(pres.ShapeType.rightArrow, { x: 4.25, y: 5.35, w: 1.05, h: 0.4, fill: { color: INK }, line: { color: INK } });
  box(s, 8.9, 1.7, 3.8, 4.9, LIGHT);
  s.addText("Cara membaca peta", { x: 9.15, y: 1.85, w: 3.3, h: 0.4, fontFace: BFONT, fontSize: 14, bold: true, color: RED, margin: 0, isTextBox: true });
  s.addText(bullets([
    "Hambatan mobilitas (mobility barriers) antar kelompok bukan hanya modal. Yang lebih sulit ditiru adalah budaya biaya rendah dan sistem operasi yang sederhana.",
    "Ruang kanan bawah kosong karena alasan struktural: rute jauh butuh pesawat berbadan lebar, kru bermalam, dan penumpang transit yang biasanya dipasok jaringan pengumpan.",
    "AirAsia X mencoba masuk dengan membawa aset dari kelompok asal: merek, sistem reservasi, SDM, dan disiplin biaya. Pertanyaannya, cukupkah itu.",
    "Pesaing terdekat AirAsia X bukan LCC lain, melainkan network carriers yang punya alasan kuat untuk membalas dengan harga.",
  ], 11), { x: 9.15, y: 2.3, w: 3.35, h: 4.2, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  footer(s);
  s.addNotes("Peta ini adalah alat Bab 3 yang paling relevan untuk kasus ini. Tunjukkan bahwa AirAsia X pindah kelompok strategis, dan pesaing di kelompok tujuan memiliki model laba yang berbeda.");
}

// ---------------------------------------------------------------- 9. Benchmark AirAsia vs MAS
{
  const s = pres.addSlide();
  header(s, "Company cost position", "Benchmarking 2008: AirAsia's cost per ASK is half of Malaysia Airlines'");
  s.addChart(pres.ChartType.bar, [
    { name: "AirAsia", labels: ["Biaya per ASK (sen)", "Pendapatan per ASK (sen)"], values: [11.66, 14.11] },
    { name: "Malaysia Airlines", labels: ["Biaya per ASK (sen)", "Pendapatan per ASK (sen)"], values: [22.80, 20.60] },
  ], {
    x: 0.6, y: 1.6, w: 6.6, h: 4.2, barDir: "col", barGapWidthPct: 60,
    chartColors: [RED, "9E9E9E"], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelFontFace: BFONT, dataLabelColor: INK, dataLabelFormatCode: "0.00",
    catAxisLabelFontSize: 11, catAxisLabelFontFace: BFONT, catAxisLabelColor: INK,
    valAxisLabelFontSize: 9, valAxisLabelColor: MUTED, valAxisMinVal: 0, valAxisMaxVal: 25, valAxisMajorUnit: 5, valGridLine: { color: "E6E6E6", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 11, legendFontFace: BFONT,
    showTitle: true, title: "Biaya dan pendapatan per available seat kilometer, 2008 (sen ringgit)", titleFontSize: 12, titleFontFace: BFONT, titleColor: INK,
  });
  s.addText("Sumber: Tabel 9.1 kasus. Pendapatan per ASK AirAsia melampaui biayanya (margin positif per kursi), sedangkan MAS menjual di bawah biaya.", { x: 0.6, y: 5.85, w: 6.6, h: 0.5, fontFace: BFONT, fontSize: 9.5, color: MUTED, margin: 0, isTextBox: true });
  const tiles = [
    ["11,8 vs 11,1", "jam utilisasi pesawat per hari (AirAsia vs MAS)"],
    ["75% vs 67,8%", "seat load factor 2008"],
    ["49 vs 175", "karyawan per pesawat (3.799/78 vs 19.094/109)"],
    ["25 menit", "turnaround time, tercepat di kawasan"],
  ];
  tiles.forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 7.5 + col * 2.65, y = 1.6 + row * 1.55;
    box(s, x, y, 2.5, 1.4, LIGHT);
    s.addText(t[0], { x: x + 0.15, y: y + 0.1, w: 2.2, h: 0.55, fontFace: HFONT, fontSize: 20, bold: true, color: RED, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(t[1], { x: x + 0.15, y: y + 0.68, w: 2.2, h: 0.65, fontFace: BFONT, fontSize: 10, color: MUTED, margin: 0, isTextBox: true, valign: "top" });
  });
  box(s, 7.5, 4.8, 5.15, 2.0, TINT);
  s.addText([
    { text: "Catatan kritis. ", options: { bold: true, color: RED } },
    { text: "Rugi 2008 (RM 496,6 juta) bukan karena operasi, melainkan karena keputusan Fernandes melepas kontrak berjangka bahan bakar (rugi RM 830,2 juta). Tanpa pos itu, operasi tetap menghasilkan laba. Namun neraca yang sarat utang pesawat (RM 6,69 miliar) membuat ruang untuk kesalahan berikutnya sangat sempit." },
  ], { x: 7.7, y: 4.9, w: 4.8, h: 1.8, fontFace: BFONT, fontSize: 11, color: INK, margin: 0, isTextBox: true, valign: "middle" });
  footer(s);
  s.addNotes("Jaringan MAS memang berbeda (lebih banyak rute menengah dan jauh), tetapi kondisi biaya input sama. Selisih dua kali lipat pada biaya per ASK adalah bukti keunggulan biaya yang nyata, bukan sekadar klaim.");
}

// ---------------------------------------------------------------- 10. Sumber keunggulan biaya
{
  const s = pres.addSlide();
  header(s, "Sources of cost advantage", "McCarthy's formula: Ryanair operations, Southwest people, easyJet branding");
  const groups = [
    { title: "Strategi operasi ala Ryanair", items: [
      ["Satu tipe pesawat (A320, 180 kursi)", "Hemat di pembelian, perawatan, pelatihan pilot, dan penjadwalan."],
      ["Satu kelas, tanpa embel-embel (no frills)", "148 kursi di 737 vs 132 pada konfigurasi dua kelas; makanan dan bagasi berbayar; tanpa aerobridge."],
      ["Titik ke titik, tanpa transfer bagasi", "Turnaround 25 menit; jadwal padat; kru dan pesawat lebih produktif."],
    ] },
    { title: "Strategi SDM ala Southwest", items: [
      ["Karyawan multi-skill", "Fleksibilitas tugas hingga tingkat administrasi; retensi sangat tinggi menekan biaya pelatihan ulang."],
      ["Insentif berbasis produktivitas", "Bonus per kontribusi, kepemilikan saham karyawan (ESOS) untuk semua, review hasil bersama tiap kuartal."],
      ["Budaya tanpa hierarki", "Fernandes rutin bekerja sebagai porter dan awak kabin; departemen budaya menjaga semangat."],
    ] },
    { title: "Strategi merek ala easyJet", items: [
      ["Belanja iklan besar dan kontra-siklus", "Ditingkatkan saat SARS dan bom Bali ketika pesaing menahan diri."],
      ["Co-branding dan sponsorship", "Williams F1, Manchester United, wasit Premier League, majalah Time, Tune Hotels, Tune Money."],
      ["Distribusi langsung dan IT", "Situs web dan call center tanpa komisi agen; CRS Navitaire terhubung ke yield management."],
    ] },
  ];
  groups.forEach((g, i) => {
    const x = 0.6 + i * 4.05;
    box(s, x, 1.6, 3.85, 4.3, i === 1 ? TINT : LIGHT);
    s.addText(g.title, { x: x + 0.22, y: 1.72, w: 3.4, h: 0.45, fontFace: BFONT, fontSize: 13.5, bold: true, color: RED, margin: 0, isTextBox: true, valign: "middle" });
    g.items.forEach((it, j) => {
      const y = 2.3 + j * 1.2;
      numCircle(s, x + 0.22, y + 0.02, j + 1, 0.36);
      s.addText([
        { text: it[0], options: { bold: true, fontSize: 11, breakLine: true } },
        { text: it[1], options: { fontSize: 10, color: MUTED } },
      ], { x: x + 0.7, y, w: 2.95, h: 1.15, fontFace: BFONT, color: INK, margin: 0, isTextBox: true, valign: "top" });
    });
  });
  strip(s, 6.1, 0.8, "Ibarat sebuah pesawat,", "operasi adalah mesinnya, SDM adalah awaknya, dan merek adalah sayapnya. Ketiganya saling mengunci (mutually reinforcing): mencabut satu bagian membuat sistem tidak lagi terbang seefisien semula. Itulah sebabnya keunggulan biaya AirAsia sulit ditiru, tetapi juga sulit dipindahkan sebagian.", INK, PINK, WHITE);
  footer(s);
  s.addNotes("Poin analitis: keunggulan biaya AirAsia adalah sistem, bukan satu trik. Tiga pilar ini saling mengunci. Itulah sebabnya sulit ditiru, tetapi juga sulit dipindahkan sebagian.");
}

// ---------------------------------------------------------------- 11. Transferabilitas
{
  const s = pres.addSlide();
  header(s, "Transferability test", "Some sources of cost advantage travel to long haul, others are lost on the way");
  const rows = [
    ["Sumber keunggulan biaya", "Transfer ke AirAsia X", "Penjelasan"],
    ["Merek dan reputasi", "PENUH", "Kredibilitas langsung di setiap rute baru; iklan dan sponsorship sudah berskala internasional."],
    ["Distribusi langsung dan sistem IT", "PENUH", "Situs web, call center, dan CRS dipakai bersama; biaya administrasi dibagi dua maskapai."],
    ["Praktik SDM dan budaya biaya", "PENUH", "Manajemen dan budaya yang sama; AirAsia X dijalankan dalam ekosistem AirAsia."],
    ["Bandara sekunder dan tarif rendah", "PENUH", "Stansted, bukan Heathrow: biaya bandara dan navigasi jauh lebih rendah (Tabel 9.4)."],
    ["Outsourcing perawatan", "PENUH", "Kontrak lelang kompetitif tetap berlaku untuk armada berbadan lebar."],
    ["Pesawat baru hemat bahan bakar", "SEBAGIAN", "A330 baru efisien, tetapi A340 untuk London boros: biaya bahan bakar per kursi lebih tinggi."],
    ["Satu tipe pesawat", "TIDAK", "A320 tidak mampu terbang jauh; armada kedua (A330 dan A340) menambah kompleksitas perawatan dan pelatihan."],
    ["Turnaround 25 menit dan utilisasi", "TIDAK", "Penerbangan 12 jam dibatasi jam kerja kru dan slot; keuntungan turnaround cepat menjadi kecil."],
    ["Satu kelas, tanpa layanan", "TIDAK", "AirAsia X terpaksa menyediakan kursi premium, kursi bernomor, dan makanan pesan di muka."],
    ["Jaringan titik ke titik", "TIDAK", "Rute jauh bergantung pada penumpang transit; tanpa tiket terusan dan transfer bagasi, pengumpan lemah."],
  ];
  const colors = { PENUH: GREEN, SEBAGIAN: AMBER, TIDAK: RED };
  const tableRows = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return { text: c, options: { bold: true, color: WHITE, fill: { color: INK }, fontSize: 11, align: j === 1 ? "center" : "left" } };
    const base = { fontSize: 10.5, color: INK, fill: { color: i % 2 === 0 ? LIGHT : WHITE } };
    if (j === 1) return { text: c, options: { ...base, bold: true, color: colors[c], align: "center" } };
    if (j === 0) return { text: c, options: { ...base, bold: true } };
    return { text: c, options: base };
  }));
  s.addTable(tableRows, {
    x: 0.6, y: 1.6, w: 12.1, colW: [3.2, 1.7, 7.2], fontFace: BFONT, border: { type: "solid", color: WHITE, pt: 1 },
    rowH: 0.42, margin: [0.04, 0.1, 0.04, 0.1], valign: "middle",
  });
  s.addText("Penilaian disusun dari Tabel 9.2 dan 9.4 kasus. Yang terbawa adalah keunggulan yang bersifat organisasional (merek, sistem, SDM, budaya); yang hilang adalah keunggulan yang bersifat operasional khas rute pendek, dan itulah inti model LCC klasik.", { x: 0.6, y: 6.35, w: 12.1, h: 0.55, fontFace: BFONT, fontSize: 10.5, color: MUTED, margin: 0, isTextBox: true, valign: "middle" });
  footer(s);
  s.addNotes("Ini slide inti. Kesimpulannya: yang terbawa adalah keunggulan organisasional, yang hilang adalah keunggulan operasional khas rute pendek. Maka AirAsia X harus membangun sumber biaya rendah baru, tidak cukup mewarisi.");
}

// ---------------------------------------------------------------- 12. Bukti awal long haul
{
  const s = pres.addSlide();
  header(s, "Early evidence on the KL to London route", "AirAsia X's cost per passenger is about a third lower, and it shows in the fare");
  s.addChart(pres.ChartType.bar, [
    { name: "Biaya per penumpang (US$)", labels: ["AirAsia X (A340, Stansted)", "British Airways (B747, Heathrow)", "Malaysia Airlines (B747, Heathrow)", "Emirates (B777 via Dubai)"], values: [373.14, 553.37, 589.50, 609.56] },
  ], {
    x: 0.6, y: 1.6, w: 6.5, h: 3.6, barDir: "bar", barGapWidthPct: 45,
    chartColors: [RED], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 10, dataLabelFontFace: BFONT, dataLabelColor: INK, dataLabelFormatCode: "#,##0",
    catAxisLabelFontSize: 10, catAxisLabelFontFace: BFONT, catAxisLabelColor: INK, catAxisOrientation: "maxMin",
    valAxisLabelFontSize: 9, valAxisLabelColor: MUTED, valAxisMinVal: 0, valAxisMaxVal: 700, valAxisMajorUnit: 100, valGridLine: { color: "E6E6E6", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, showTitle: true, title: "Biaya per penumpang satu arah, KL ke London (US$)", titleFontSize: 12, titleFontFace: BFONT, titleColor: INK,
  });
  s.addText("Sumber: Tabel 9.4. Tidak termasuk perawatan, depresiasi, katering, dan gaji kru; belum memperhitungkan perbedaan load factor.", { x: 0.6, y: 5.2, w: 6.5, h: 0.4, fontFace: BFONT, fontSize: 9, color: MUTED, margin: 0, isTextBox: true });
  const lbl = ["Periode 1", "Periode 2", "Periode 3", "Periode 4", "Periode 5"];
  s.addChart(pres.ChartType.line, [
    { name: "AirAsia", labels: lbl, values: [77.0, 75.0, 78.0, 80.0, 75.5] },
    { name: "Emirates", labels: lbl, values: [73.4, 74.6, 75.9, 76.2, 79.8] },
    { name: "British Airways", labels: lbl, values: [67.6, 69.7, 70.0, 70.4, 71.2] },
    { name: "Malaysia Airlines", labels: lbl, values: [69.0, 71.5, 69.8, 71.4, 67.8] },
  ], {
    x: 7.3, y: 1.6, w: 5.4, h: 2.7, chartColors: [RED, "6E6E6E", "B0B0B0", "D9A5AE"], lineSize: 2, lineDataSymbol: "circle", lineDataSymbolSize: 5,
    catAxisLabelFontSize: 9, catAxisLabelColor: MUTED, valAxisLabelFontSize: 9, valAxisLabelColor: MUTED, valAxisMinVal: 60, valAxisMaxVal: 85, valAxisMajorUnit: 5,
    valGridLine: { color: "E6E6E6", size: 0.5 }, catGridLine: { style: "none" }, showLegend: true, legendPos: "b", legendFontSize: 9, legendFontFace: BFONT,
    showTitle: true, title: "Load factor seluruh jaringan (%), Tabel 9.5", titleFontSize: 11, titleFontFace: BFONT, titleColor: INK,
  });
  const tiles = [
    ["36,5%", "lebih murah: tarif pulang pergi KL London US$433,96 vs rata-rata tarif terendah pesaing US$683,68 (Tabel 9.3)"],
    ["Lebih dari 90%", "load factor yang dilaporkan AirAsia X di rute KL London, jauh di atas rata-rata industri"],
  ];
  tiles.forEach((t, i) => {
    const x = 7.3 + i * 2.75;
    box(s, x, 4.45, 2.65, 1.6, TINT);
    s.addText(t[0], { x: x + 0.15, y: 4.52, w: 2.4, h: 0.5, fontFace: HFONT, fontSize: 20, bold: true, color: RED, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(t[1], { x: x + 0.15, y: 5.02, w: 2.4, h: 1.0, fontFace: BFONT, fontSize: 9.5, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  strip(s, 5.7, 1.15, "Pembacaan kritis.", "Selisih biaya terlihat besar, tetapi tabel mengecualikan pos yang justru membengkak di rute jauh: gaji kru yang bermalam, perawatan pesawat berbadan lebar, dan katering. AirAsia X juga hanya membawa 286 penumpang per penerbangan dibanding 337 sampai 360 pada pesaing. Keunggulan biaya per penumpang bersifat nyata, namun lebih tipis daripada yang tampak.", LIGHT);
  footer(s);
  s.addNotes("Bahan bakar AirAsia X per penerbangan US$79.299 vs US$159.522 untuk B747 BA dan MAS. Tetapi biaya sewa pesawat US$5.952 hanya muncul di AirAsia X karena pesaing memiliki pesawatnya sendiri. Periode pada grafik load factor mengikuti urutan kolom Tabel 9.5; tahun tidak disebutkan eksplisit dalam kasus.");
}

// ---------------------------------------------------------------- 13. Isu kunci
{
  const s = pres.addSlide();
  header(s, "Key issues", "Five questions that decide the choice among alternatives");
  const issues = [
    ["Apakah pasar LCC jarak jauh cukup besar dan benar-benar kurang terlayani?", "Di rute regional AirAsia menciptakan pasar baru. Di rute KL London, ia harus merebut penumpang dari enam maskapai mapan. Tarif 36,5 persen lebih murah menjadi daya tarik, tetapi elastisitas permintaan jarak jauh belum terbukti."],
    ["Bagaimana network carriers akan merespons?", "Emirates, BA, dan MAS memperoleh laba dari kelas premium. Mereka mampu menurunkan tarif ekonomi ke tingkat yang merugikan AirAsia X tanpa mengorbankan laba total. Perang harga di rute jauh berpihak pada yang punya subsidi silang."],
    ["Seberapa besar toleransi finansial AirAsia terhadap kegagalan?", "Utang RM 6,69 miliar berbanding ekuitas RM 1,61 miliar, kas RM 153,8 juta, dan pesanan 10 A350 untuk 2016. Satu kesalahan lindung nilai pada 2008 sudah menghapus laba. Tidak ada bantalan untuk eksperimen yang lama merugi."],
    ["Dapatkah eksploitasi dan eksplorasi hidup dalam satu organisasi tanpa saling mengganggu?", "Dua armada, dua pola kru, dua tingkat layanan. Literatur ambidexterity (O'Reilly dan Tushman) menyebut dua jalan: dipisahkan secara struktural atau dipadukan dalam satu konteks. Berbagi merek, IT, dan administrasi memberi efisiensi yang tidak dimiliki start-up mandiri, tetapi juga membawa kompleksitas."],
    ["Apakah tata kelola AirAsia X selaras dengan kepentingan AirAsia?", "AirAsia hanya memegang 16 persen (opsi hingga 30 persen); Aero Ventures milik Fernandes 48 persen, Virgin 16 persen, Manara dan Orix 20 persen. Ini tata kelola hibrida (hybrid governance) khas portofolio aliansi. Kritik publik menyebut merger sebagai cara membiayai kerugian AirAsia X; Azran membantah dengan laba bersih RM 18 juta pada kuartal pertama 2009."],
  ];
  issues.forEach((it, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const x = 0.6 + col * 6.2;
    const y = 1.6 + row * 1.75;
    const w = 5.95, h = 1.6;
    box(s, x, y, w, h, LIGHT);
    numCircle(s, x + 0.18, y + 0.18, i + 1, 0.42);
    s.addText([
      { text: it[0], options: { bold: true, fontSize: 11.5, breakLine: true } },
      { text: it[1], options: { fontSize: 9.5, color: MUTED } },
    ], { x: x + 0.72, y: y + 0.1, w: w - 0.9, h: h - 0.2, fontFace: BFONT, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  box(s, 6.8, 5.1, 5.95, 1.6, INK);
  s.addText([
    { text: "Benang merah", options: { bold: true, fontSize: 12, color: PINK, breakLine: true } },
    { text: "Isu 1 dan 2 adalah soal lingkungan eksternal; isu 3 sampai 5 soal kesiapan internal dan tata kelola. Alternatif yang baik harus menjawab keduanya, bukan hanya salah satu.", options: { fontSize: 11.5, color: WHITE } },
  ], { x: 7.0, y: 5.2, w: 5.55, h: 1.4, fontFace: BFONT, margin: 0, isTextBox: true, valign: "middle" });
  footer(s);
  s.addNotes("Sesuai panduan kasus, isu dirumuskan sebagai pertanyaan eksplisit. Setiap alternatif di slide berikut akan diuji terhadap lima pertanyaan ini. Isu 4 dan 5 memakai lensa ambidexterity dan tata kelola hibrida.");
}

// ---------------------------------------------------------------- 14. Alternatif strategi
{
  const s = pres.addSlide();
  header(s, "Strategic alternatives", "Three options open to AirAsia's management in mid 2009");
  const alts = [
    { code: "A", title: "Kembali ke Regional", sub: "Fokus penuh pada pasar 3,5 jam terbang", fill: LIGHT, lens: "Lensa: eksploitasi murni (pure exploitation). Mendalami model yang sudah terbukti, menyerahkan eksplorasi kepada pihak lain.", body: [
      "AirAsia X tetap entitas terpisah dengan pemegang saham sendiri; AirAsia hanya penyedia jasa berbayar (merek, IT, administrasi).",
      "Modal dan perhatian manajemen diarahkan ke pendalaman pasar Indonesia, Thailand, Vietnam, dan Filipina.",
      "Opsi kepemilikan 30 persen tidak dieksekusi; risiko rute jauh ditanggung investor lain.",
    ] },
    { code: "B", title: "Integrasi Penuh", sub: "Merger AirAsia X ke dalam AirAsia", fill: TINT, lens: "Lensa: ambidexterity kontekstual. Eksploitasi dan eksplorasi dipadukan dalam satu organisasi, satu neraca, satu budaya.", body: [
      "Satu perusahaan, satu neraca, satu jaringan. Rute regional menjadi pengumpan untuk rute gemuk jarak jauh melalui hub KL.",
      "Membangun tiket terusan (through ticketing) dan transfer bagasi antar penerbangan AirAsia dan AirAsia X.",
      "Ekspansi agresif: Abu Dhabi sebagai hub kedua, India, Seoul, Sydney, New York sesuai rencana.",
    ] },
    { code: "C", title: "Integrasi Bertahap", sub: "Kendali naik ke 30 persen, rute dibatasi, merger menunggu bukti", fill: LIGHT, lens: "Lensa: ambidexterity struktural dengan tata kelola hibrida. Unit eksplorasi dipisahkan, tetapi dikendalikan lewat kepemilikan dan kontrak.", body: [
      "AirAsia mengeksekusi opsi 30 persen dan menempatkan kendali operasional, tetapi neraca tetap terpisah.",
      "Rute dibatasi pada 4 sampai 8 jam terbang (Australia, Cina, India, Timur Tengah) dengan A330; rute 12 jam ke Eropa ditunda sampai A350 tiba.",
      "Merger penuh hanya jika AirAsia X mencapai target laba dan load factor selama empat kuartal berturut-turut.",
    ] },
  ];
  alts.forEach((a, i) => {
    const x = 0.6 + i * 4.05;
    box(s, x, 1.6, 3.85, 5.25, a.fill);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.22, y: 1.78, w: 0.6, h: 0.6, fill: { color: i === 2 ? RED : INK }, line: { color: i === 2 ? RED : INK } });
    s.addText(a.code, { x: x + 0.22, y: 1.78, w: 0.6, h: 0.6, fontFace: HFONT, fontSize: 20, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText([
      { text: a.title, options: { bold: true, fontSize: 15, breakLine: true } },
      { text: a.sub, options: { fontSize: 10.5, color: MUTED } },
    ], { x: x + 0.95, y: 1.7, w: 2.75, h: 0.85, fontFace: BFONT, color: INK, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(bullets(a.body, 11), { x: x + 0.25, y: 2.75, w: 3.4, h: 2.9, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
    box(s, x + 0.2, 5.65, 3.45, 1.05, i === 1 ? WHITE : TINT);
    s.addText(a.lens, { x: x + 0.35, y: 5.7, w: 3.15, h: 0.95, fontFace: BFONT, fontSize: 9.5, italic: true, color: INK, margin: 0, isTextBox: true, valign: "middle" });
  });
  footer(s);
  s.addNotes("Sesuai panduan RPKPS, alternatif dideskripsikan ringkas tanpa argumen pro dan kontra. Penilaian dilakukan di slide berikutnya dengan kriteria yang sama untuk ketiganya. Lensa ambidexterity: March (1991), O'Reilly dan Tushman (2004). Tata kelola hibrida: Williamson (1991).");
}

// ---------------------------------------------------------------- 15. Evaluasi alternatif
{
  const s = pres.addSlide();
  header(s, "Evaluation of alternatives", "Tested against the five issues: alternative C balances opportunity and risk best");
  const rows = [
    ["Kriteria (dari isu kunci)", "A. Kembali ke Regional", "B. Integrasi Penuh", "C. Integrasi Bertahap"],
    ["Menangkap peluang pasar jarak jauh", ["Lemah", RED, "Melepas rute gemuk yang menjadi sumber pertumbuhan berikutnya."], ["Kuat", GREEN, "Menangkap seluruh peluang, termasuk rute jauh ke Eropa."], ["Cukup", AMBER, "Menangkap rute 4 sampai 8 jam yang paling sesuai dengan A330."]],
    ["Daya tahan terhadap balasan network carriers", ["Kuat", GREEN, "Tidak berhadapan langsung di rute jauh."], ["Lemah", RED, "Berhadapan langsung di rute yang pesaing subsidi silang."], ["Cukup", AMBER, "Menghindari rute yang paling padat pesaing premium."]],
    ["Keamanan finansial (utang, kas, pesanan A350)", ["Kuat", GREEN, "Risiko rute jauh berada di neraca investor lain."], ["Lemah", RED, "Menggabungkan armada berbadan lebar ke neraca yang sudah sarat utang."], ["Cukup", AMBER, "Neraca tetap terpisah; komitmen bertahap sesuai bukti kinerja."]],
    ["Keseimbangan eksploitasi dan eksplorasi", ["Lemah", RED, "Eksploitasi murni; kompetensi rute jauh tidak pernah terbangun."], ["Cukup", AMBER, "Eksplorasi berjalan, tetapi berisiko mengganggu disiplin rute pendek."], ["Kuat", GREEN, "Unit eksplorasi terpisah, kendali dan pembelajaran tetap mengalir ke induk."]],
    ["Keselarasan tata kelola dan pemegang saham", ["Cukup", AMBER, "Konflik kepentingan Fernandes tetap ada meski tersembunyi."], ["Cukup", AMBER, "Transparan, tetapi minoritas AirAsia menanggung kerugian AirAsia X."], ["Kuat", GREEN, "Kendali sepadan dengan kepemilikan; merger diputuskan berdasar bukti."]],
  ];
  const tableRows = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return { text: c, options: { bold: true, color: WHITE, fill: { color: j === 3 ? RED : INK }, fontSize: 11, align: j === 0 ? "left" : "center" } };
    const fill = j === 3 ? TINT : (i % 2 === 0 ? LIGHT : WHITE);
    if (j === 0) return { text: c, options: { bold: true, fontSize: 10.5, color: INK, fill: { color: fill } } };
    return { text: [
      { text: c[0], options: { bold: true, color: c[1], fontSize: 11, breakLine: true } },
      { text: c[2], options: { fontSize: 9, color: MUTED } },
    ], options: { fill: { color: fill }, align: "left" } };
  }));
  s.addTable(tableRows, {
    x: 0.6, y: 1.6, w: 12.1, colW: [2.9, 3.0, 3.0, 3.2], fontFace: BFONT, border: { type: "solid", color: WHITE, pt: 1 },
    rowH: [0.42, 0.85, 0.85, 0.85, 0.85, 0.85], margin: [0.05, 0.1, 0.05, 0.1], valign: "middle",
  });
  s.addText("Skala: Kuat, Cukup, Lemah. Penilaian kualitatif berdasarkan data kasus; tidak ada pembobotan numerik agar diskusi kelas tetap terbuka.", { x: 0.6, y: 6.45, w: 12.1, h: 0.4, fontFace: BFONT, fontSize: 10, color: MUTED, margin: 0, isTextBox: true, valign: "middle" });
  footer(s);
  s.addNotes("Alternatif A aman tetapi mengabaikan sumber pertumbuhan. Alternatif B menangkap peluang tetapi memindahkan seluruh risiko ke neraca yang rapuh. Alternatif C mengunci kendali tanpa mengunci risiko.");
}

// ---------------------------------------------------------------- 16. Rekomendasi
{
  const s = pres.addSlide();
  header(s, "Recommendation and implementation plan", "Staged integration: control AirAsia X, limit the routes, prove it first, then merge");
  box(s, 0.6, 1.6, 12.1, 1.05, INK);
  s.addText("Eksekusi opsi kepemilikan 30 persen pada AirAsia X, ambil kendali operasional dan komersial, batasi jaringan pada rute 4 sampai 8 jam sampai armada A350 tersedia, dan tetapkan merger penuh sebagai keputusan berbasis bukti kinerja (evidence based), bukan keyakinan pendiri.", {
    x: 0.85, y: 1.65, w: 11.6, h: 0.95, fontFace: BFONT, fontSize: 13, color: WHITE, margin: 0, isTextBox: true, valign: "middle",
  });
  const rows = [
    ["Inisiatif", "KPI dan target", "Waktu", "Penanggung jawab", "Risiko dan mitigasi"],
    ["Eksekusi opsi 30 persen dan tempatkan manajemen AirAsia di AirAsia X", "Kepemilikan 30 persen; satu tim komersial gabungan", "Kuartal 4 2009", "CEO Group dan Dewan Komisaris", "Konflik kepentingan Aero Ventures; mitigasi lewat komite independen untuk transaksi afiliasi"],
    ["Disiplin rute: hanya 4 sampai 8 jam dengan A330; tunda penambahan rute Eropa", "Load factor di atas 85 persen; biaya per ASK AirAsia X di bawah 60 persen pesaing per rute", "2010 sampai 2011", "CEO AirAsia X", "Balasan harga Emirates dan MAS; mitigasi dengan bandara sekunder dan rute yang belum padat pesaing premium"],
    ["Bangun pengumpan terbatas: tiket terusan dan transfer bagasi antar AirAsia dan AirAsia X di KL", "Porsi penumpang transit di atas 25 persen pada rute jauh", "2010", "Direktur Komersial Group", "Kompleksitas operasi; mitigasi dengan uji coba di tiga rute sebelum diperluas"],
    ["Kebijakan lindung nilai bahan bakar berbasis aturan, bukan keputusan pribadi", "Rasio hedging 30 sampai 50 persen kebutuhan 12 bulan; batas rugi derivatif", "Segera", "CFO dan Komite Risiko", "Terulangnya kerugian 2008; mitigasi dengan mandat tertulis yang disetujui dewan"],
    ["Perkuat neraca sebelum A350 tiba", "Utang terhadap ekuitas turun ke bawah 3 kali; kas minimal tiga bulan biaya operasi", "2010 sampai 2015", "CFO", "Ketergantungan sewa pesawat; mitigasi lewat sale and leaseback dan penerbitan saham bila valuasi mendukung"],
    ["Gerbang keputusan merger (stage gate)", "Empat kuartal berturut laba bersih positif dan arus kas operasi positif di AirAsia X", "Evaluasi 2011", "Dewan Komisaris", "Tekanan pendiri untuk mempercepat; mitigasi dengan kriteria yang dipublikasikan ke pemegang saham"],
  ];
  const tableRows = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return { text: c, options: { bold: true, color: WHITE, fill: { color: RED }, fontSize: 10 } };
    return { text: c, options: { fontSize: 9, color: INK, fill: { color: i % 2 === 0 ? LIGHT : WHITE }, bold: j === 0 } };
  }));
  s.addTable(tableRows, {
    x: 0.6, y: 2.85, w: 12.1, colW: [3.2, 2.6, 1.2, 1.7, 3.4], fontFace: BFONT, border: { type: "solid", color: WHITE, pt: 1 },
    rowH: [0.35, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6], margin: [0.04, 0.08, 0.04, 0.08], valign: "middle",
  });
  footer(s);
  s.addNotes("Rencana implementasi mengikuti tuntutan CO 2 dalam RPKPS: KPI, waktu, penanggung jawab, sumber daya, dan mitigasi risiko. Angka target adalah usulan kelompok, bukan angka dari kasus.");
}

// ---------------------------------------------------------------- 17. Penutup
{
  const s = pres.addSlide();
  s.background = { color: DARKRED };
  s.addShape(pres.ShapeType.ellipse, { x: -2.2, y: 4.2, w: 6, h: 6, fill: { color: RED }, line: { color: RED } });
  s.addText("LESSONS FOR CHAPTER 3", { x: 0.7, y: 0.5, w: 8, h: 0.35, fontFace: BFONT, fontSize: 12, bold: true, color: PINK, charSpacing: 2, margin: 0, isTextBox: true });
  s.addText("Same industry, different advantage", { x: 0.7, y: 0.9, w: 11.5, h: 0.9, fontFace: HFONT, fontSize: 32, bold: true, color: WHITE, margin: 0, isTextBox: true, valign: "middle" });
  const lessons = [
    ["Struktur industri menjelaskan mengapa laba langka, bukan siapa yang meraihnya.", "Five Forces menunjukkan industri penerbangan tidak atraktif. Laba AirAsia lahir dari posisi biaya relatif, sesuai logika SCP."],
    ["Keunggulan biaya adalah sistem yang saling mengunci.", "Operasi, SDM, dan merek bekerja bersama. Memindahkan sebagian tanpa yang lain menghasilkan keunggulan yang lebih tipis."],
    ["Pindah kelompok strategis berarti menghadapi pesaing dengan model laba berbeda.", "Peta kelompok strategis memperingatkan: di rute jauh, lawan AirAsia X mampu mensubsidi harga ekonomi."],
    ["Eksplorasi butuh rumah sendiri, tetapi tetap satu atap dengan eksploitasi.", "Lingkungan yang bergejolak dan neraca yang rapuh membuat integrasi bertahap lebih bijak daripada lompatan penuh."],
  ];
  lessons.forEach((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.7 + col * 6.1, y = 2.0 + row * 1.75;
    numCircle(s, x, y + 0.05, i + 1, 0.42, WHITE, RED);
    s.addText([
      { text: l[0], options: { bold: true, fontSize: 13, color: WHITE, breakLine: true } },
      { text: l[1], options: { fontSize: 11, color: PINK } },
    ], { x: x + 0.6, y, w: 5.3, h: 1.6, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  });
  s.addText("Apabila dirangkum dalam satu kata, kasus AirAsia adalah tentang transferabilitas: bukan semata seberapa murah, tetapi seberapa jauh kemurahan itu dapat dibawa.", {
    x: 0.7, y: 5.3, w: 11.9, h: 0.65, fontFace: BFONT, fontSize: 12.5, italic: true, color: WHITE, margin: 0, isTextBox: true, valign: "middle",
  });
  box(s, 0.7, 6.05, 11.9, 0.85, WHITE);
  s.addText([
    { text: "Pertanyaan untuk diskusi kelas: ", options: { bold: true, color: RED } },
    { text: "Jika Anda Tony Fernandes pada Juli 2009 dengan kas RM 153,8 juta, apakah Anda menyetujui merger sekarang, atau menunggu bukti empat kuartal? Apa yang hilang jika menunggu?", options: { color: INK } },
  ], { x: 0.95, y: 6.08, w: 11.4, h: 0.79, fontFace: BFONT, fontSize: 12, margin: 0, isTextBox: true, valign: "middle" });
  footer(s, true);
  s.addNotes("Tutup dengan mengaitkan kembali ke Bab 3. Ajukan pertanyaan diskusi ke kelas dan minta kelompok lain merespons dengan argumen berbasis data kasus.");
}

// ---------------------------------------------------------------- 18. Referensi
{
  const s = pres.addSlide();
  header(s, "References", "Data sources and frameworks");
  s.addText(bullets([
    "Grant, R. M. (2010). AirAsia: The World's Lowest Cost Airline. Dalam Contemporary Strategy Analysis: Concepts, Techniques, Applications (Case 9). Blackwell. Seluruh angka dalam presentasi ini bersumber dari Tabel 9.1 sampai 9.5 kasus tersebut.",
    "Thompson, A. A., dan Strickland, A. J. (2019). Strategic Management: Concepts and Cases (edisi ke-22), Bab 3: Evaluating a Company's External Environment. McGraw-Hill.",
    "Porter, M. E. (1980). Competitive Strategy: Techniques for Analyzing Industries and Competitors. The Free Press.",
    "March, J. G. (1991). Exploration and Exploitation in Organizational Learning. Organization Science, 2(1), 71 sampai 87.",
    "O'Reilly, C. A., dan Tushman, M. L. (2004). The Ambidextrous Organization. Harvard Business Review, 82(4), 74 sampai 81.",
    "Williamson, O. E. (1991). Comparative Economic Organization: The Analysis of Discrete Structural Alternatives. Administrative Science Quarterly, 36(2), 269 sampai 296.",
    "Handoko, T. H., Indarti, N., dan Almahendra, R. (2014). Manajemen dalam Berbagai Perspektif. Erlangga.",
    "Buchholz, S., Fabio, N., Ileyassoff, A., Mang, L., dan Visentin, D. (2009). AirAsia: Tales from a Long-haul Low Cost Carrier. Bocconi University (sebagaimana dikutip dalam kasus).",
    "RPKPS Strategic Management MAN 5422, FEB UGM (2026), Lampiran 3: A Guide to Teaching Case Analysis.",
  ], 12), { x: 0.6, y: 1.6, w: 12.1, h: 4.6, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  s.addText("Batasan analisis: seluruh data berhenti pada pertengahan 2009 sesuai kasus. Perkembangan AirAsia X setelah itu sengaja tidak dimasukkan agar analisis konsisten dengan informasi yang tersedia bagi manajemen saat keputusan harus diambil.", { x: 0.6, y: 6.25, w: 12.1, h: 0.6, fontFace: BFONT, fontSize: 10.5, italic: true, color: MUTED, margin: 0, isTextBox: true, valign: "top" });
  footer(s);
  s.addNotes("Referensi dan batasan analisis.");
}

const out = process.argv[2] || "AirAsia_Kelompok3.pptx";
pres.writeFile({ fileName: out }).then((f) => console.log("written", f));
