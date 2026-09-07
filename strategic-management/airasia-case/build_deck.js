const pptxgen = require("pptxgenjs");
const path = require("path");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Kelompok 3";
pres.title = "AirAsia: The World's Lowest Cost Airline";

const IMG = (n) => path.join(__dirname, "img", n + ".jpg");
const W = 13.33, H = 7.5;

// palette: aged fresco
const PARCH = "F3E8D2";
const INK = "2A1E14";
const CRIMSON = "9E1B1B";
const GOLD = "C69C4A";
const DARK = "1B1410";
const GREEN = "2F6B2F";
const AMBER = "9C6410";
const MUTED = "5C4A3A";
const HFONT = "Cambria";
const BFONT = "Calibri";
const BODY = 24;

const STEPS = ["Problem", "External environment", "Cost position", "Choice"];
let slideNo = 0;

function bg(slide, name) {
  slide.background = { color: DARK };
  slide.addImage({ path: IMG(name), x: 0, y: 0, w: W, h: H });
}

function pageNo(slide) {
  slideNo += 1;
  slide.addShape(pres.ShapeType.ellipse, { x: 12.35, y: 6.85, w: 0.5, h: 0.5, fill: { color: DARK, transparency: 25 }, line: { color: DARK, transparency: 25 } });
  slide.addText(String(slideNo), { x: 12.35, y: 6.85, w: 0.5, h: 0.5, fontFace: BFONT, fontSize: 14, bold: true, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

// torn-paper style title band (slightly rotated parchment) + step tracker pill
function title(slide, text, step, size) {
  const w = Math.min(10.4, 0.9 + text.length * 0.27);
  slide.addShape(pres.ShapeType.rect, { x: 0.45, y: 0.4, w, h: 0.95, fill: { color: PARCH }, line: { color: PARCH }, rotate: -1.2, shadow: { type: "outer", color: "000000", blur: 6, offset: 3, angle: 60, opacity: 0.45 } });
  slide.addText(text, { x: 0.45, y: 0.4, w, h: 0.95, rotate: -1.2, fontFace: HFONT, fontSize: size || 38, bold: true, color: CRIMSON, valign: "middle", margin: [0, 0.3, 0, 0.3], isTextBox: true });
  if (step) {
    const runs = [];
    STEPS.forEach((st, i) => {
      const cur = i + 1 === step;
      runs.push({ text: (i + 1) + " " + st, options: { bold: cur, color: cur ? GOLD : "B8A98F" } });
      if (i < STEPS.length - 1) runs.push({ text: "   ·   ", options: { color: "8A7A64" } });
    });
    slide.addShape(pres.ShapeType.roundRect, { x: 0.45, y: 1.42, w: 8.6, h: 0.42, rectRadius: 0.21, fill: { color: DARK, transparency: 25 }, line: { color: DARK, transparency: 25 } });
    slide.addText(runs, { x: 0.65, y: 1.42, w: 8.3, h: 0.42, fontFace: BFONT, fontSize: 14, valign: "middle", margin: 0, isTextBox: true });
  }
}

function panel(slide, x, y, w, h, opts) {
  opts = opts || {};
  const dark = opts.dark;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: dark ? DARK : PARCH, transparency: opts.transparency !== undefined ? opts.transparency : (dark ? 18 : 8) },
    line: { color: dark ? DARK : PARCH, transparency: 100 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 60, opacity: 0.4 },
  });
}

// "Selanjutnya" link strip at the bottom
function next(slide, text) {
  slide.addShape(pres.ShapeType.rect, { x: 0, y: 6.62, w: W, h: 0.62, fill: { color: DARK, transparency: 22 }, line: { color: DARK, transparency: 100 } });
  slide.addText([
    { text: "Selanjutnya  ", options: { bold: true, color: GOLD } },
    { text, options: { color: PARCH, italic: true } },
  ], { x: 0.5, y: 6.62, w: 11.6, h: 0.62, fontFace: BFONT, fontSize: 22, valign: "middle", margin: 0, isTextBox: true });
}

function bullets(items, size, color) {
  return items.map((t, i) => ({ text: t, options: { bullet: { code: "25AA" }, breakLine: i < items.length - 1, paraSpaceAfter: 8, fontSize: size || BODY, color: color || INK } }));
}

function numbered(items, size, color) {
  return items.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < items.length - 1, paraSpaceAfter: 8, fontSize: size || BODY, color: color || INK } }));
}

function heading(slide, text, x, y, w, color) {
  slide.addText(text, { x, y, w, h: 0.55, fontFace: HFONT, fontSize: 28, bold: true, color: color || CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
}

function tag(slide, x, y, w, h, word, color) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color }, line: { color } });
  slide.addText(word, { x, y, w, h, fontFace: BFONT, fontSize: 20, bold: true, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

const NAMES = "Tifani Puspita  |  Dara Astrini Rahayu K  |  Happy Dinithasari  |  Aslih Abnuri";

// ================================================================ 1. Title
{
  const s = pres.addSlide();
  bg(s, "title");
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 7.6, h: H, fill: { color: DARK, transparency: 28 }, line: { color: DARK, transparency: 100 } });
  s.addText("AirAsia", { x: 0.7, y: 1.2, w: 6.6, h: 1.5, fontFace: HFONT, fontSize: 72, bold: true, color: PARCH, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("The World's Lowest Cost Airline", { x: 0.7, y: 2.65, w: 6.6, h: 0.8, fontFace: HFONT, fontSize: 32, color: GOLD, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("Sejauh mana keunggulan biaya yang dibangun di rute pendek dapat dibawa ke pasar penerbangan jarak jauh?", { x: 0.7, y: 3.55, w: 6.4, h: 1.5, fontFace: BFONT, fontSize: BODY, italic: true, color: PARCH, margin: 0, isTextBox: true, valign: "top" });
  s.addText([
    { text: "Kelompok 3", options: { bold: true, fontSize: 26, color: GOLD, breakLine: true } },
    { text: NAMES, options: { fontSize: 20, color: PARCH } },
  ], { x: 0.7, y: 5.4, w: 6.6, h: 1.4, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  pageNo(s);
  s.addNotes("Pembuka. Satu pertanyaan strategis: apakah keunggulan biaya AirAsia yang dibangun di rute pendek dapat dipindahkan ke rute jarak jauh melalui AirAsia X. Kasus Robert M. Grant (2010), data 2008 sampai pertengahan 2009.");
}

// ================================================================ 2. Roadmap
{
  const s = pres.addSlide();
  bg(s, "roadmap");
  title(s, "How we read the case");
  panel(s, 0.5, 1.5, 7.6, 4.95);
  heading(s, "Titik berangkat", 0.8, 1.6, 7.0);
  s.addText("Lowest cost sering dibaca sebagai kelemahan. Dibaca dengan tepat, murah adalah hasil disiplin biaya (cost discipline) yang sistematis. Apakah sistem itu dapat dipindahkan (transferable) ke rute jauh?", { x: 0.8, y: 2.2, w: 7.0, h: 2.1, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "top" });
  s.addText([
    { text: "1  Problem", options: { bold: true, color: CRIMSON } }, { text: "   tujuan dan hambatan", options: { color: INK, breakLine: true } },
    { text: "2  External environment", options: { bold: true, color: CRIMSON } }, { text: "   PESTEL, Five Forces, peta", options: { color: INK, breakLine: true } },
    { text: "3  Cost position", options: { bold: true, color: CRIMSON } }, { text: "   benchmarking, transferabilitas", options: { color: INK, breakLine: true } },
    { text: "4  Choice", options: { bold: true, color: CRIMSON } }, { text: "   isu, alternatif, rekomendasi", options: { color: INK } },
  ], { x: 0.8, y: 4.35, w: 7.0, h: 2.0, fontFace: BFONT, fontSize: BODY, margin: 0, isTextBox: true, valign: "top", paraSpaceAfter: 4 });
  next(s, "Tahap 1 dimulai dengan mengenal AirAsia lebih dulu.");
  pageNo(s);
  s.addNotes("Urutan analisis mengikuti logika Structure Conduct Performance: struktur industri dibaca lebih dulu, baru posisi perusahaan, baru pilihan strategi. Kerangka dari Thompson dan Strickland Bab 3 serta panduan analisis kasus RPKPS. Seluruh angka bersumber dari tabel dalam kasus.");
}

// ================================================================ 3. At a glance
{
  const s = pres.addSlide();
  bg(s, "glance");
  title(s, "AirAsia at a glance", 1);
  const stats = [["79", "pesawat (2009)"], ["11,8 juta", "penumpang"], ["10 negara", "dilayani"], ["RM 1", "harga akuisisi"]];
  stats.forEach((st, i) => {
    const x = 0.5 + i * 3.1;
    panel(s, x, 2.0, 2.9, 1.4);
    s.addText(st[0], { x: x + 0.2, y: 2.05, w: 2.5, h: 0.75, fontFace: HFONT, fontSize: 40, bold: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(st[1], { x: x + 0.2, y: 2.78, w: 2.5, h: 0.55, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  panel(s, 0.5, 3.55, 12.3, 2.9);
  heading(s, "Milestones", 0.8, 3.62, 6);
  s.addText([
    { text: "2001   ", options: { bold: true, color: CRIMSON } }, { text: "Fernandes dan McCarthy mengambil alih AirAsia seharga RM 1", options: { breakLine: true } },
    { text: "2002   ", options: { bold: true, color: CRIMSON } }, { text: "Relaunch: operasi ala Ryanair, SDM ala Southwest, merek ala easyJet", options: { breakLine: true } },
    { text: "2004   ", options: { bold: true, color: CRIMSON } }, { text: "Rute internasional pertama, IPO RM 717 juta, JV Thailand dan Indonesia", options: { breakLine: true } },
    { text: "2007   ", options: { bold: true, color: CRIMSON } }, { text: "AirAsia X mulai terbang jarak jauh; 2009 membuka rute London", options: { breakLine: true } },
    { text: "2009   ", options: { bold: true, color: CRIMSON } }, { text: "Skytrax: World's Best Low Cost Airline; biaya per ASK terendah di dunia (UBS)" },
  ], { x: 0.8, y: 4.15, w: 11.8, h: 2.25, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "top", paraSpaceAfter: 3 });
  next(s, "Dibangun di rute pendek. Rute jauh memunculkan masalah baru.");
  pageNo(s);
  s.addNotes("Dari 2 pesawat dan 200 ribu penumpang (Januari 2002) menjadi 79 pesawat dan 11,8 juta penumpang (Maret 2009). Hub di KL, Bangkok, dan Jakarta. Akuisisi 2001 seharga RM 1 dengan warisan utang RM 40 juta. Riset UBS 2007: biaya per ASK terendah di dunia, di bawah Southwest, Ryanair, JetBlue, Virgin Blue. ROA 2008 sebesar 4 persen ketika hampir semua maskapai dunia merugi.");
}

// ================================================================ 4. Strategic problem
{
  const s = pres.addSlide();
  bg(s, "problem");
  title(s, "The strategic problem", 1);
  panel(s, 0.5, 2.5, 6.0, 3.95);
  heading(s, "Tujuan (goals)", 0.8, 2.6, 5.4);
  s.addText(bullets([
    "Menjadi maskapai internasional, bukan hanya regional",
    "Tetap berbiaya terendah di setiap rute",
    "Tumbuh lewat rute gemuk (trunk routes) jarak jauh",
  ]), { x: 0.8, y: 3.2, w: 5.5, h: 3.2, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  panel(s, 6.8, 2.5, 6.0, 3.95);
  heading(s, "Hambatan (barriers)", 7.1, 2.6, 5.4);
  s.addText(bullets([
    "Model LCC bertumpu pada rute pendek, satu tipe pesawat, layanan minimal",
    "Pesaing jarak jauh punya feeder, tiket terusan, subsidi silang",
    "Neraca 2008 lemah: utang RM 6,69 miliar, kas RM 153,8 juta",
  ]), { x: 7.1, y: 3.2, w: 5.5, h: 3.2, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  next(s, "Tujuan yang terhalang. Pertanyaannya dirumuskan di slide berikutnya.");
  pageNo(s);
  s.addNotes("Mengikuti panduan RPKPS: masalah adalah tujuan yang terhalang. Angka neraca dari Tabel 9.1: rugi bersih RM 496,6 juta, utang RM 6,69 miliar berbanding ekuitas RM 1,61 miliar, kas RM 153,8 juta. Azran Osman-Rani (CEO AirAsia X): rute gemuk jarak jauh adalah sumber lalu lintas berikutnya.");
}

// ================================================================ 5. Strategic question
{
  const s = pres.addSlide();
  bg(s, "question");
  title(s, "The strategic question", 1);
  panel(s, 0.5, 1.95, 7.4, 4.5, { dark: true });
  s.addText("Apakah keunggulan biaya AirAsia dapat ditransfer ke rute jauh, dan bagaimana menata hubungan dengan AirAsia X agar eksplorasi (exploration) tidak mengganggu eksploitasi (exploitation)?", { x: 0.8, y: 2.05, w: 6.8, h: 2.3, fontFace: BFONT, fontSize: 24, bold: true, color: PARCH, margin: 0, isTextBox: true, valign: "top" });
  s.addText([
    { text: "Tiga pilihan manajemen, pertengahan 2009:", options: { color: GOLD, breakLine: true } },
    { text: "Merger AirAsia X ke dalam AirAsia", options: { bullet: { code: "25AA" }, color: PARCH, breakLine: true } },
    { text: "Tetap terpisah dengan kontrak layanan", options: { bullet: { code: "25AA" }, color: PARCH, breakLine: true } },
    { text: "Kembali fokus ke pasar regional", options: { bullet: { code: "25AA" }, color: PARCH } },
  ], { x: 0.8, y: 4.4, w: 6.8, h: 1.95, fontFace: BFONT, fontSize: BODY, margin: 0, isTextBox: true, valign: "top", paraSpaceAfter: 2 });
  next(s, "Tahap 2: membaca lingkungan eksternal lebih dulu.");
  pageNo(s);
  s.addNotes("Istilah exploration dan exploitation mengacu pada March (1991): perusahaan perlu menyeimbangkan pendalaman kompetensi yang ada dengan pencarian peluang baru.");
}

// ================================================================ 6. PESTEL
{
  const s = pres.addSlide();
  bg(s, "pestel1");
  title(s, "PESTEL analysis", 2);
  panel(s, 0.5, 2.0, 12.3, 4.45);
  const rows = [
    ["P", "Politik", "Dukungan pemerintah; rute jauh berhadapan dengan MAS"],
    ["E", "Ekonomi", "500 juta penduduk dalam 3,5 jam terbang; BBM 47% biaya"],
    ["S", "Sosial", "Segmen menengah kurang terlayani; pasar diperluas"],
    ["T", "Teknologi", "Navitaire, yield management, ponsel; tanpa agen"],
    ["E", "Lingkungan", "A320 baru hemat BBM; A340 boros di rute jauh"],
    ["L", "Legal", "Deregulasi rute lintas negara; kepemilikan asing dibatasi"],
  ];
  rows.forEach((r, i) => {
    const y = 2.12 + i * 0.72;
    s.addShape(pres.ShapeType.ellipse, { x: 0.8, y: y + 0.08, w: 0.52, h: 0.52, fill: { color: CRIMSON }, line: { color: CRIMSON } });
    s.addText(r[0], { x: 0.8, y: y + 0.08, w: 0.52, h: 0.52, fontFace: HFONT, fontSize: 22, bold: true, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText([
      { text: r[1] + "   ", options: { bold: true, color: CRIMSON } },
      { text: r[2], options: { color: INK } },
    ], { x: 1.5, y, w: 11.1, h: 0.68, fontFace: BFONT, fontSize: BODY, margin: 0, isTextBox: true, valign: "middle" });
  });
  next(s, "Peluang makro terbuka. Bisakah menjadi laba? Lihat struktur industrinya.");
  pageNo(s);
  s.addNotes("Angka 47 persen dihitung dari Tabel 9.1: bahan bakar RM 1.389,8 juta dari biaya operasi RM 2.966 juta. Simpulan PESTEL: faktor politik dan legal adalah pembentuk struktur paling kuat. Joint venture Thai AirAsia dan Indonesia AirAsia mengontrakkan operasinya kembali ke AirAsia dengan imbalan fee bulanan. Distribusi langsung memangkas komisi agen dan sulit ditiru maskapai lama.");
}

// ================================================================ 7. Five Forces
{
  const s = pres.addSlide();
  bg(s, "fiveforces");
  title(s, "Five Forces analysis", 2);
  panel(s, 0.5, 2.0, 6.4, 4.45);
  const forces = [["Rivalitas antar pemain", "TINGGI", CRIMSON], ["Daya tawar pemasok", "TINGGI", CRIMSON], ["Daya tawar pembeli", "TINGGI", CRIMSON], ["Pendatang baru", "SEDANG", AMBER], ["Substitusi (pendek/jauh)", "SEDANG / RENDAH", AMBER]];
  forces.forEach((f, i) => {
    const y = 2.15 + i * 0.84;
    s.addText(f[0], { x: 0.8, y, w: 3.4, h: 0.7, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "middle" });
    tag(s, 4.2, y + 0.1, 2.5, 0.5, f[1], f[2]);
  });
  panel(s, 7.3, 4.05, 5.5, 2.4, { dark: true });
  s.addText("Industri kurang atraktif. Laba lahir dari posisi biaya perusahaan, sesuai logika Structure Conduct Performance.", { x: 7.55, y: 4.15, w: 5.0, h: 2.2, fontFace: BFONT, fontSize: BODY, color: PARCH, margin: 0, isTextBox: true, valign: "middle" });
  next(s, "Laba langka. Apa yang mengubah struktur ini, dan siapa yang menang?");
  pageNo(s);
  s.addNotes("Rivalitas: banyak peniru model Southwest, MAS menekan di rute domestik. Pemasok: duopoli Airbus dan Boeing, bahan bakar mengikuti harga minyak, tarif bandara tanpa negosiasi. Pembeli: sangat peka harga, biaya berpindah nol. Pendatang baru: deregulasi dan pesawat sewaan menurunkan hambatan; penahan slot, merek, skala. Substitusi: bus, kereta, feri di rute pendek; tidak ada pengganti setara di rute antarbenua. Tahun 2008 hampir seluruh maskapai dunia merugi.");
}

// ================================================================ 8. Driving forces and KSF
{
  const s = pres.addSlide();
  bg(s, "driving");
  title(s, "Driving forces and key success factors", 2, 34);
  panel(s, 0.5, 2.0, 6.0, 4.45, { transparency: 12 });
  heading(s, "Kekuatan pendorong", 0.8, 2.1, 5.4);
  s.addText(numbered([
    "Deregulasi penerbangan regional",
    "Internet dan distribusi langsung",
    "Volatilitas harga bahan bakar",
    "Kelas menengah Asia tumbuh",
    "LCC masuk rute jarak jauh",
  ]), { x: 0.8, y: 2.7, w: 5.5, h: 3.6, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  panel(s, 6.8, 2.0, 6.0, 4.45, { transparency: 12 });
  heading(s, "Faktor kunci keberhasilan", 7.1, 2.1, 5.4);
  s.addText(bullets([
    "Biaya per ASK terendah",
    "Utilisasi pesawat tinggi",
    "Load factor tinggi",
    "Kesederhanaan operasi",
    "Merek yang dipercaya",
    "Produktivitas SDM",
  ]), { x: 7.1, y: 2.7, w: 5.5, h: 3.6, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  next(s, "Tolok ukur siap. Di kelompok pesaing mana AirAsia dan AirAsia X berada?");
  pageNo(s);
  s.addNotes("Driving forces: deregulasi memungkinkan hub di Bangkok dan Jakarta lewat usaha patungan; ponsel menjadi kanal pemesanan utama di Asia; kenaikan lalu penurunan tajam harga minyak 2008 merugikan maskapai yang salah posisi lindung nilai, termasuk AirAsia; pasar membesar, bukan sekadar berpindah; AirAsia X dan Jetstar menguji batas model. KSF diturunkan dari struktur industri: kalau pembeli peka harga dan pemasok kuat, penentu kemenangan adalah biaya, utilisasi, dan load factor. Merek yang dipercaya: murah, bukan murahan.");
}

// ================================================================ 9. Strategic group map
{
  const s = pres.addSlide();
  bg(s, "groupmap");
  title(s, "Strategic group map", 2);
  const ax = 0.5, ay = 2.0, aw = 7.6, ah = 4.45;
  s.addShape(pres.ShapeType.rect, { x: ax, y: ay, w: aw, h: ah, fill: { color: PARCH, transparency: 45 }, line: { color: INK, width: 1 } });
  s.addShape(pres.ShapeType.line, { x: ax, y: ay + ah / 2, w: aw, h: 0, line: { color: INK, width: 0.75, dashType: "dash" } });
  s.addShape(pres.ShapeType.line, { x: ax + aw / 2, y: ay, w: 0, h: ah, line: { color: INK, width: 0.75, dashType: "dash" } });
  s.addText("Regional", { x: ax + 0.1, y: ay + ah - 0.45, w: 3, h: 0.4, fontFace: BFONT, fontSize: 18, bold: true, color: INK, margin: 0, isTextBox: true });
  s.addText("Jarak jauh", { x: ax + aw - 3.1, y: ay + ah - 0.45, w: 3, h: 0.4, fontFace: BFONT, fontSize: 18, bold: true, color: INK, align: "right", margin: 0, isTextBox: true });
  s.addText("Layanan dan biaya tinggi", { x: ax + 0.1, y: ay + 0.05, w: 3.5, h: 0.4, fontFace: BFONT, fontSize: 18, bold: true, color: INK, margin: 0, isTextBox: true });
  const groups = [
    { x: 4.6, y: 2.45, w: 3.2, h: 1.3, fill: "6E6259", title: "Network carriers", body: "Emirates, BA, MAS" },
    { x: 0.8, y: 2.6, w: 3.2, h: 1.2, fill: "A69B8C", title: "Full service regional", body: "MAS domestik, SIA" },
    { x: 0.8, y: 4.75, w: 3.2, h: 1.3, fill: CRIMSON, title: "LCC regional", body: "AirAsia, Tiger, Cebu" },
    { x: 4.6, y: 4.65, w: 3.2, h: 1.3, fill: "6B1414", title: "LCC jarak jauh", body: "AirAsia X" },
  ];
  groups.forEach((g) => {
    s.addShape(pres.ShapeType.ellipse, { x: g.x, y: g.y, w: g.w, h: g.h, fill: { color: g.fill }, line: { color: PARCH, width: 1.5 } });
    s.addText([
      { text: g.title, options: { bold: true, fontSize: 22, breakLine: true } },
      { text: g.body, options: { fontSize: 20 } },
    ], { x: g.x + 0.15, y: g.y + 0.05, w: g.w - 0.3, h: g.h - 0.1, fontFace: BFONT, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addShape(pres.ShapeType.rightArrow, { x: 4.05, y: 5.1, w: 0.5, h: 0.4, fill: { color: INK }, line: { color: INK } });
  panel(s, 8.4, 2.0, 4.4, 4.45, { dark: true });
  s.addText("AirAsia X pindah kelompok. Lawannya bukan LCC lain, melainkan network carriers yang mampu mensubsidi harga ekonomi dari kelas premium.", { x: 8.65, y: 2.15, w: 3.9, h: 4.2, fontFace: BFONT, fontSize: BODY, color: PARCH, margin: 0, isTextBox: true, valign: "middle" });
  next(s, "Tahap 2 selesai. Tahap 3: seberapa kuat posisi biaya AirAsia sendiri?");
  pageNo(s);
  s.addNotes("Hambatan mobilitas antar kelompok bukan hanya modal; yang sulit ditiru adalah budaya biaya rendah dan sistem operasi sederhana. Ruang LCC jarak jauh nyaris kosong karena rute jauh butuh pesawat berbadan lebar, kru bermalam, dan penumpang transit dari jaringan pengumpan. AirAsia X masuk membawa merek, sistem reservasi, SDM, dan disiplin biaya dari kelompok asal.");
}

// ================================================================ 10. Cost benchmarking
{
  const s = pres.addSlide();
  bg(s, "benchmark");
  title(s, "Cost benchmarking", 3);
  panel(s, 0.5, 2.0, 7.0, 4.45);
  s.addChart(pres.ChartType.bar, [
    { name: "AirAsia", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [11.66, 14.11] },
    { name: "Malaysia Airlines", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [22.80, 20.60] },
  ], {
    x: 0.7, y: 2.1, w: 6.6, h: 4.25, barDir: "col", barGapWidthPct: 55,
    chartColors: [CRIMSON, "8C7B68"], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 16, dataLabelFontFace: BFONT, dataLabelColor: INK, dataLabelFormatCode: "0.00",
    catAxisLabelFontSize: 16, catAxisLabelFontFace: BFONT, catAxisLabelColor: INK,
    valAxisLabelFontSize: 14, valAxisLabelColor: MUTED, valAxisMinVal: 0, valAxisMaxVal: 25, valAxisMajorUnit: 5, valGridLine: { color: "C9BBA3", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 16, legendFontFace: BFONT, legendColor: INK,
    showTitle: true, title: "Sen ringgit per available seat kilometer, 2008", titleFontSize: 18, titleFontFace: BFONT, titleColor: INK,
  });
  const tiles = [["49 vs 175", "karyawan per pesawat"], ["75% vs 67,8%", "load factor 2008"]];
  tiles.forEach((t, i) => {
    const x = 7.7 + i * 2.6;
    panel(s, x, 4.35, 2.5, 2.1);
    s.addText(t[0], { x: x + 0.12, y: 4.4, w: 2.3, h: 0.8, fontFace: HFONT, fontSize: 25, bold: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(t[1], { x: x + 0.15, y: 5.2, w: 2.15, h: 1.2, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  next(s, "Separuh biaya MAS. Dari mana keunggulan itu berasal?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.1. Utilisasi 11,8 vs 11,1 jam per hari; turnaround 25 menit. Karyawan per pesawat: 3.799/78 vs 19.094/109. Catatan: rugi 2008 (RM 496,6 juta) bukan karena operasi, melainkan keputusan melepas kontrak berjangka bahan bakar (rugi RM 830,2 juta). Tanpa pos itu operasi tetap laba, tetapi neraca yang sarat utang pesawat membuat ruang untuk kesalahan berikutnya sempit.");
}

// ================================================================ 11. Sources of cost advantage
{
  const s = pres.addSlide();
  bg(s, "sources");
  title(s, "Sources of cost advantage", 3);
  panel(s, 0.5, 2.0, 12.3, 4.45);
  const cols = [
    ["Operasi ala Ryanair", ["Satu tipe pesawat (A320)", "Satu kelas, no frills", "Titik ke titik, 25 menit"]],
    ["SDM ala Southwest", ["Karyawan multi-skill", "Insentif produktivitas", "Budaya tanpa hierarki"]],
    ["Merek ala easyJet", ["Iklan kontra-siklus", "Co-branding, sponsorship", "Distribusi langsung, IT"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.8 + i * 4.05;
    heading(s, c[0], x, 2.1, 3.8);
    s.addText(bullets(c[1]), { x, y: 2.7, w: 3.8, h: 2.9, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  });
  s.addText("Ketiganya saling menopang: sebuah sistem, bukan satu kebijakan tunggal.", { x: 0.8, y: 5.7, w: 11.8, h: 0.6, fontFace: BFONT, fontSize: BODY, italic: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
  next(s, "Mana yang ikut ke rute jauh, mana yang tertinggal?");
  pageNo(s);
  s.addNotes("Formula Conor McCarthy: strategi operasi ala Ryanair, strategi SDM ala Southwest, strategi merek ala easyJet. Satu kelas: 148 kursi di 737 vs 132 pada dua kelas. ESOS untuk semua karyawan. Iklan ditingkatkan saat SARS dan bom Bali. Sponsorship Williams F1, Manchester United, wasit Premier League. CRS Navitaire terhubung ke yield management. Karena saling menopang, sistem ini sulit ditiru pesaing tetapi juga tidak mudah dipindahkan sebagian.");
}

// ================================================================ 12. Transferability
{
  const s = pres.addSlide();
  bg(s, "transfers");
  title(s, "Transferability test", 3);
  panel(s, 0.5, 2.0, 6.0, 4.45, { transparency: 12 });
  heading(s, "Ikut terbawa", 0.8, 2.1, 5.4, GREEN);
  const left = [["PENUH", GREEN, "Merek dan reputasi"], ["PENUH", GREEN, "Distribusi langsung dan IT"], ["PENUH", GREEN, "SDM dan budaya biaya"], ["PENUH", GREEN, "Bandara sekunder (Stansted)"], ["PENUH", GREEN, "Outsourcing perawatan"], ["SEBAGIAN", AMBER, "Pesawat hemat bahan bakar"]];
  left.forEach((r, i) => {
    const y = 2.72 + i * 0.6;
    tag(s, 0.8, y + 0.06, 1.55, 0.46, r[0], r[1]);
    s.addText(r[2], { x: 2.5, y, w: 3.9, h: 0.58, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "middle" });
  });
  panel(s, 6.8, 2.0, 6.0, 4.45, { transparency: 12 });
  heading(s, "Tidak terbawa", 7.1, 2.1, 5.4);
  const right = [["TIDAK", CRIMSON, "Satu tipe pesawat"], ["TIDAK", CRIMSON, "Turnaround 25 menit"], ["TIDAK", CRIMSON, "Satu kelas tanpa layanan"], ["TIDAK", CRIMSON, "Jaringan titik ke titik"]];
  right.forEach((r, i) => {
    const y = 2.72 + i * 0.6;
    tag(s, 7.1, y + 0.06, 1.55, 0.46, r[0], r[1]);
    s.addText(r[2], { x: 8.8, y, w: 3.9, h: 0.58, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "middle" });
  });
  s.addText("Yang hilang justru inti model LCC klasik.", { x: 7.1, y: 5.2, w: 5.5, h: 1.1, fontFace: BFONT, fontSize: BODY, italic: true, color: INK, margin: 0, isTextBox: true, valign: "middle" });
  next(s, "Yang terbawa bersifat organisasional. Apa kata angka di rute KL London?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.2 dan 9.4. Merek memberi kredibilitas langsung; situs web, call center, dan CRS dipakai bersama; Stansted jauh lebih murah dari Heathrow; kontrak perawatan lelang kompetitif tetap berlaku; A330 efisien tetapi A340 untuk London boros. Tidak terbawa: A320 tak mampu terbang jauh dan armada kedua menambah kompleksitas; penerbangan 12 jam dibatasi jam kerja kru dan slot; rute jauh butuh kursi premium dan makanan; rute jauh bergantung pada penumpang transit dan feeder. Maka AirAsia X harus membangun sumber biaya rendah baru, tidak cukup mewarisi.");
}

// ================================================================ 13. Evidence KL London
{
  const s = pres.addSlide();
  bg(s, "london");
  title(s, "Evidence from KL to London", 3);
  panel(s, 0.5, 2.0, 7.2, 4.45);
  s.addChart(pres.ChartType.bar, [
    { name: "Biaya per penumpang (US$)", labels: ["AirAsia X", "British Airways", "Malaysia Airlines", "Emirates"], values: [373.14, 553.37, 589.50, 609.56] },
  ], {
    x: 0.7, y: 2.1, w: 6.8, h: 4.25, barDir: "bar", barGapWidthPct: 40,
    chartColors: [CRIMSON], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 16, dataLabelFontFace: BFONT, dataLabelColor: INK, dataLabelFormatCode: "#,##0",
    catAxisLabelFontSize: 16, catAxisLabelFontFace: BFONT, catAxisLabelColor: INK, catAxisOrientation: "maxMin",
    valAxisLabelFontSize: 14, valAxisLabelColor: MUTED, valAxisMinVal: 0, valAxisMaxVal: 700, valAxisMajorUnit: 100, valGridLine: { color: "C9BBA3", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, showTitle: true, title: "Biaya per penumpang satu arah (US$), Tabel 9.4", titleFontSize: 18, titleFontFace: BFONT, titleColor: INK,
  });
  const tiles = [["36,5%", "lebih murah dari pesaing"], ["> 90%", "load factor AirAsia X"]];
  tiles.forEach((t, i) => {
    const x = 7.95 + i * 2.5;
    panel(s, x, 4.1, 2.4, 2.35);
    s.addText(t[0], { x: x + 0.15, y: 4.15, w: 2.1, h: 0.8, fontFace: HFONT, fontSize: 32, bold: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(t[1], { x: x + 0.15, y: 4.95, w: 2.1, h: 1.45, fontFace: BFONT, fontSize: BODY, color: INK, margin: 0, isTextBox: true, valign: "top" });
  });
  next(s, "Selisih nyata, tetapi lebih tipis: tabel belum memuat kru, perawatan, katering.");
  pageNo(s);
  s.addNotes("Tabel 9.4 tidak termasuk perawatan, depresiasi, katering, dan gaji kru; pos itu justru membesar di rute jauh. AirAsia X membawa 286 penumpang per penerbangan, pesaing 337 sampai 360. Bahan bakar per penerbangan US$79.299 vs US$159.522 untuk B747. Tarif pulang pergi KL London AirAsia X US$433,96 vs rata-rata tarif terendah pesaing US$683,68 (Tabel 9.3). Load factor jaringan lima periode (Tabel 9.5): AirAsia 77, 75, 78, 80, 75,5; Emirates 73,4 sampai 79,8; BA 67,6 sampai 71,2; MAS 69 sampai 67,8. Keunggulan biaya per penumpang nyata, tetapi lebih tipis daripada yang tampak.");
}

// ================================================================ 14. Key issues
{
  const s = pres.addSlide();
  bg(s, "issues");
  title(s, "Key issues", 4);
  panel(s, 0.5, 2.0, 12.3, 3.9);
  s.addText(numbered([
    "Apakah pasar LCC jarak jauh cukup besar dan benar-benar kurang terlayani?",
    "Bagaimana network carriers akan membalas?",
    "Seberapa besar toleransi finansial AirAsia terhadap kegagalan?",
    "Bisakah eksploitasi dan eksplorasi berjalan dalam satu organisasi?",
    "Apakah tata kelola AirAsia X selaras dengan kepentingan AirAsia?",
  ]), { x: 0.8, y: 2.1, w: 11.8, h: 2.6, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  s.addText([
    { text: "Intisari.  ", options: { bold: true, color: CRIMSON } },
    { text: "Isu 1 dan 2 dari lingkungan eksternal, isu 3 dari posisi biaya, isu 4 dan 5 soal organisasi dan tata kelola.", options: { color: INK, italic: true } },
  ], { x: 0.8, y: 4.75, w: 11.8, h: 1.05, fontFace: BFONT, fontSize: BODY, margin: 0, isTextBox: true, valign: "middle" });
  next(s, "Lima pertanyaan ini menjadi kriteria untuk menilai tiga alternatif.");
  pageNo(s);
  s.addNotes("Isu 1: di rute regional AirAsia menciptakan pasar baru; di KL London ia merebut penumpang dari enam maskapai mapan; elastisitas permintaan belum terbukti. Isu 2: Emirates, BA, dan MAS memperoleh laba dari kelas premium dan mampu menurunkan tarif ekonomi tanpa mengorbankan laba total. Isu 3: utang RM 6,69 miliar, ekuitas RM 1,61 miliar, kas RM 153,8 juta, pesanan 10 A350. Isu 4: literatur ambidexterity (O'Reilly dan Tushman) menyebut dua jalan, pemisahan struktural atau paduan kontekstual. Isu 5: AirAsia 16 persen (opsi 30 persen), Aero Ventures 48 persen, Virgin 16 persen, Manara dan Orix 20 persen; tata kelola hibrida khas portofolio aliansi. Azran membantah kritik dengan laba bersih RM 18 juta pada kuartal pertama 2009.");
}

// ================================================================ 15. Alternatives
{
  const s = pres.addSlide();
  bg(s, "altC");
  title(s, "Strategic alternatives", 4);
  const alts = [
    ["A", "Fokus Regional", ["AirAsia X tetap terpisah", "Fokus pasar 3,5 jam terbang"], "eksploitasi murni"],
    ["B", "Integrasi Penuh", ["Merger AirAsia X ke AirAsia", "Feeder KL, ekspansi sesuai rencana"], "ambidexterity kontekstual"],
    ["C", "Integrasi Bertahap", ["Kendali 30 persen, neraca terpisah", "Rute 4 sampai 8 jam, merger menunggu bukti"], "ambidexterity struktural, tata kelola hibrida"],
  ];
  alts.forEach((a, i) => {
    const x = 0.5 + i * 4.15;
    panel(s, x, 2.0, 3.95, 4.45, { transparency: 10 });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: 2.15, w: 0.6, h: 0.6, fill: { color: i === 2 ? CRIMSON : INK }, line: { color: i === 2 ? CRIMSON : INK } });
    s.addText(a[0], { x: x + 0.25, y: 2.15, w: 0.6, h: 0.6, fontFace: HFONT, fontSize: 24, bold: true, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: x + 1.0, y: 2.1, w: 2.9, h: 0.7, fontFace: HFONT, fontSize: 24, bold: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(bullets(a[2]), { x: x + 0.25, y: 2.95, w: 3.5, h: 2.2, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
    s.addText([
      { text: "Sudut pandang.  ", options: { bold: true, color: CRIMSON } },
      { text: a[3], options: { italic: true, color: INK } },
    ], { x: x + 0.25, y: 5.15, w: 3.5, h: 1.2, fontFace: BFONT, fontSize: BODY, margin: 0, isTextBox: true, valign: "middle" });
  });
  next(s, "Ketiganya diuji dengan lima kriteria dari isu kunci.");
  pageNo(s);
  s.addNotes("Sesuai panduan RPKPS, alternatif dideskripsikan tanpa argumen pro dan kontra. A: AirAsia hanya penyedia jasa berbayar; modal ke Indonesia, Thailand, Vietnam, Filipina; opsi 30 persen tidak dieksekusi. B: satu perusahaan, satu neraca, satu jaringan; tiket terusan dan transfer bagasi; ekspansi Abu Dhabi, India, Seoul, Sydney. C: eksekusi opsi 30 persen dan tempatkan kendali operasional; rute 4 sampai 8 jam dengan A330, Eropa menunggu A350; merger hanya setelah empat kuartal laba dan load factor sesuai target. Sudut pandang: March (1991); O'Reilly dan Tushman (2004); Williamson (1991).");
}

// ================================================================ 16. Scorecard
{
  const s = pres.addSlide();
  bg(s, "scorecard");
  title(s, "Scorecard", 4);
  const rows = [
    ["Kriteria", "A. Regional", "B. Penuh", "C. Bertahap"],
    ["Peluang pasar jarak jauh", ["Lemah", CRIMSON], ["Kuat", GREEN], ["Cukup", AMBER]],
    ["Daya tahan vs network carriers", ["Kuat", GREEN], ["Lemah", CRIMSON], ["Cukup", AMBER]],
    ["Keamanan finansial", ["Kuat", GREEN], ["Lemah", CRIMSON], ["Cukup", AMBER]],
    ["Eksploitasi dan eksplorasi", ["Lemah", CRIMSON], ["Cukup", AMBER], ["Kuat", GREEN]],
    ["Tata kelola dan pemegang saham", ["Cukup", AMBER], ["Cukup", AMBER], ["Kuat", GREEN]],
  ];
  const tableRows = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return { text: c, options: { bold: true, color: PARCH, fill: { color: j === 3 ? CRIMSON : INK }, fontSize: 22, align: j === 0 ? "left" : "center" } };
    if (j === 0) return { text: c, options: { bold: true, fontSize: 22, color: INK, fill: { color: PARCH } } };
    return { text: c[0], options: { bold: true, fontSize: 22, color: c[1], fill: { color: j === 3 ? "F6E0D6" : PARCH }, align: "center" } };
  }));
  s.addTable(tableRows, { x: 0.5, y: 2.0, w: 12.3, colW: [5.1, 2.4, 2.4, 2.4], fontFace: BFONT, border: { type: "solid", color: "C9BBA3", pt: 1 }, rowH: 0.56, margin: [0.04, 0.12, 0.04, 0.12], valign: "middle" });
  next(s, "Alternatif C tanpa satu pun kriteria lemah. Itulah rekomendasi kami.");
  pageNo(s);
  s.addNotes("Penilaian kualitatif dari data kasus. A: aman tetapi melepas sumber pertumbuhan dan tidak pernah membangun kompetensi rute jauh. B: menangkap seluruh peluang tetapi berhadapan langsung dengan pesaing yang bersubsidi silang dan menggabungkan armada lebar ke neraca yang sarat utang. C: menangkap rute 4 sampai 8 jam, neraca terpisah, unit eksplorasi terpisah dengan kendali dan pembelajaran mengalir ke induk, kendali sepadan dengan kepemilikan.");
}

// ================================================================ 17. Recommendation
{
  const s = pres.addSlide();
  bg(s, "recommendation");
  title(s, "Recommendation", 4);
  panel(s, 0.5, 1.95, 7.4, 4.5, { dark: true });
  s.addText("Integrasi bertahap: kendalikan AirAsia X, batasi rute, buktikan dulu, baru merger.", { x: 0.8, y: 2.05, w: 6.8, h: 1.35, fontFace: BFONT, fontSize: 26, bold: true, color: PARCH, margin: 0, isTextBox: true, valign: "top" });
  s.addText(bullets([
    "Eksekusi opsi 30 persen dan tempatkan manajemen AirAsia",
    "Rute 4 sampai 8 jam dengan A330 sampai A350 tiba",
    "Merger hanya setelah empat kuartal laba dan arus kas positif",
  ], BODY, PARCH), { x: 0.8, y: 3.5, w: 6.8, h: 2.9, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  next(s, "Rencana implementasinya: KPI, waktu, penanggung jawab.");
  pageNo(s);
  s.addNotes("Merger penuh ditetapkan sebagai keputusan berbasis bukti kinerja (evidence based), bukan sekadar keyakinan manajemen.");
}

// ================================================================ 18. Implementation plan
{
  const s = pres.addSlide();
  bg(s, "implementation");
  title(s, "Implementation plan", 4);
  panel(s, 0.5, 2.0, 12.3, 4.45, { transparency: 10 });
  const items = [
    ["Opsi 30 persen dan tim manajemen gabungan", "Q4 2009", "CEO dan Dewan"],
    ["Rute 4 sampai 8 jam; load factor di atas 85 persen", "2010 sampai 2011", "CEO AirAsia X"],
    ["Feeder terbatas di KL; transit di atas 25 persen", "2010", "Direktur Komersial"],
    ["Hedging bahan bakar 30 sampai 50 persen", "Segera", "CFO, Komite Risiko"],
    ["Utang/ekuitas di bawah 3 kali sebelum A350", "2010 sampai 2015", "CFO"],
    ["Gerbang merger: empat kuartal laba positif", "Evaluasi 2011", "Dewan Komisaris"],
  ];
  s.addText([
    { text: "Inisiatif dan KPI", options: { bold: true, color: CRIMSON } },
  ], { x: 0.8, y: 2.08, w: 6.6, h: 0.5, fontFace: BFONT, fontSize: 22, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("Waktu", { x: 7.5, y: 2.08, w: 2.5, h: 0.5, fontFace: BFONT, fontSize: 22, bold: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("Penanggung jawab", { x: 10.1, y: 2.08, w: 2.6, h: 0.5, fontFace: BFONT, fontSize: 22, bold: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
  items.forEach((it, i) => {
    const y = 2.62 + i * 0.63;
    if (i % 2 === 0) s.addShape(pres.ShapeType.rect, { x: 0.7, y, w: 11.9, h: 0.6, fill: { color: "E6D8BE", transparency: 30 }, line: { color: "E6D8BE", transparency: 100 } });
    s.addText((i + 1) + "  " + it[0], { x: 0.8, y, w: 6.6, h: 0.6, fontFace: BFONT, fontSize: 22, color: INK, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(it[1], { x: 7.5, y, w: 2.5, h: 0.6, fontFace: BFONT, fontSize: 22, color: INK, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(it[2], { x: 10.1, y, w: 2.6, h: 0.6, fontFace: BFONT, fontSize: 22, color: INK, margin: 0, isTextBox: true, valign: "middle" });
  });
  next(s, "Rekomendasi ini menjawab pertanyaan di slide 5. Apa pelajarannya?");
  pageNo(s);
  s.addNotes("Risiko dan mitigasi. 1: konflik kepentingan Aero Ventures, mitigasi komite independen untuk transaksi afiliasi. 2: balasan harga Emirates dan MAS, mitigasi bandara sekunder dan rute yang belum padat pesaing premium; target biaya per ASK AirAsia X di bawah 60 persen pesaing per rute. 3: kompleksitas operasi, mitigasi uji coba di tiga rute sebelum diperluas. 4: terulangnya kerugian 2008, mitigasi mandat tertulis yang disetujui dewan dan batas rugi derivatif. 5: ketergantungan sewa pesawat, mitigasi sale and leaseback dan penerbitan saham bila valuasi mendukung; kas minimal tiga bulan biaya operasi. 6: tekanan untuk mempercepat, mitigasi kriteria yang dipublikasikan ke pemegang saham. Angka target adalah usulan kelompok, bukan angka kasus.");
}

// ================================================================ 19. Lessons and discussion
{
  const s = pres.addSlide();
  bg(s, "lessons");
  title(s, "Lessons for Chapter 3", 4);
  panel(s, 0.5, 2.0, 7.3, 4.45);
  s.addText(numbered([
    "Struktur industri menjelaskan mengapa laba langka, bukan siapa yang meraihnya.",
    "Keunggulan biaya adalah sistem yang saling menopang.",
    "Pindah kelompok strategis berarti melawan model laba yang berbeda.",
    "Eksplorasi butuh unit terpisah yang tetap dikendalikan induk.",
  ]), { x: 0.8, y: 2.12, w: 6.7, h: 3.55, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  s.addText("Dalam satu kata: transferabilitas.", { x: 0.8, y: 5.7, w: 6.7, h: 0.65, fontFace: HFONT, fontSize: 26, italic: true, bold: true, color: CRIMSON, margin: 0, isTextBox: true, valign: "middle" });
  panel(s, 8.1, 2.0, 4.7, 4.45, { dark: true });
  s.addText([
    { text: "Untuk didiskusikan", options: { bold: true, color: GOLD, breakLine: true } },
    { text: "Jika Anda Tony Fernandes pada Juli 2009 dengan kas RM 153,8 juta, setujui merger sekarang, atau tunggu bukti empat kuartal? Apa yang hilang jika menunggu?", options: { color: PARCH } },
  ], { x: 8.35, y: 2.15, w: 4.2, h: 4.2, fontFace: BFONT, fontSize: BODY, margin: 0, isTextBox: true, valign: "middle" });
  pageNo(s);
  s.addNotes("Kaitkan kembali ke Bab 3. Five Forces menunjukkan industri tidak atraktif; laba AirAsia lahir dari posisi biaya relatif. Operasi, SDM, dan merek bekerja bersama. Di rute jauh lawan AirAsia X mampu mensubsidi harga ekonomi. Lingkungan yang berubah cepat dan neraca yang lemah membuat integrasi bertahap lebih aman daripada merger penuh. Minta kelompok lain merespons pertanyaan diskusi dengan argumen berbasis data kasus.");
}

// ================================================================ 20. Thank you
{
  const s = pres.addSlide();
  bg(s, "thanks");
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 6.8, h: H, fill: { color: DARK, transparency: 30 }, line: { color: DARK, transparency: 100 } });
  s.addText("Thank you", { x: 0.7, y: 2.0, w: 6.0, h: 1.4, fontFace: HFONT, fontSize: 64, bold: true, color: PARCH, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("Terima kasih. Kami terbuka untuk pertanyaan dan diskusi.", { x: 0.7, y: 3.4, w: 5.8, h: 1.0, fontFace: BFONT, fontSize: BODY, color: GOLD, margin: 0, isTextBox: true, valign: "top" });
  s.addText([
    { text: "Kelompok 3", options: { bold: true, fontSize: 26, color: GOLD, breakLine: true } },
    { text: NAMES, options: { fontSize: 20, color: PARCH } },
  ], { x: 0.7, y: 5.2, w: 6.0, h: 1.4, fontFace: BFONT, margin: 0, isTextBox: true, valign: "top" });
  pageNo(s);
  s.addNotes("Referensi: Grant (2010) Contemporary Strategy Analysis, Case 9, Tabel 9.1 sampai 9.5. Thompson dan Strickland (2019) Bab 3. Porter (1980). March (1991) Organization Science 2(1). O'Reilly dan Tushman (2004) Harvard Business Review 82(4). Williamson (1991) Administrative Science Quarterly 36(2). Handoko, Indarti, dan Almahendra (2014) Manajemen dalam Berbagai Perspektif. RPKPS MAN 5422 FEB UGM (2026), Lampiran 3.");
}

const out = process.argv[2] || "AirAsia_visual.pptx";
pres.writeFile({ fileName: out }).then((f) => console.log("written", f));
