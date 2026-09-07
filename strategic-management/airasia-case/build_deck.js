const pptxgen = require("pptxgenjs");
const path = require("path");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Kelompok 3";
pres.title = "AirAsia: The World's Lowest Cost Airline";

const IMG = (n, ext) => path.join(__dirname, "img", n + (ext || ".jpg"));
const W = 13.33, H = 7.5;

const PARCH = "F3E8D2";
const INK = "2A1E14";
const CRIMSON = "9E1B1B";
const GOLD = "D8B15E";
const DARK = "140E0A";
const GREEN = "3E8A3E";
const AMBER = "B8791A";
const HFONT = "Cambria";
const BFONT = "Calibri";
const BODY = 24;
const SH = { type: "outer", color: "000000", blur: 4, offset: 2, angle: 45, opacity: 0.7 };

const STEPS = ["Problem", "External environment", "Cost position", "Choice"];
let slideNo = 0;

function bg(slide, name, scrims) {
  slide.background = { color: DARK };
  slide.addImage({ path: IMG(name), x: 0, y: 0, w: W, h: H });
  (scrims || []).forEach((s) => slide.addImage({ path: IMG("scrim_" + s, ".png"), x: 0, y: 0, w: W, h: H }));
}

function pageNo(slide) {
  slideNo += 1;
  slide.addText(String(slideNo), { x: 12.3, y: 6.9, w: 0.6, h: 0.4, fontFace: BFONT, fontSize: 14, bold: true, color: PARCH, align: "right", valign: "middle", margin: 0, isTextBox: true, shadow: SH });
}

// torn paper title band (image) with the title on it, plus step tracker beneath
function title(slide, text, step, opts) {
  opts = opts || {};
  const red = opts.red;
  const w = Math.min(10.8, 1.4 + text.length * 0.3);
  const h = red ? 1.15 : 1.25;
  slide.addImage({ path: IMG(red ? "band_red" : "band_cream", ".png"), x: 0.3, y: 0.25, w, h, rotate: -1.5 });
  slide.addText(text, { x: 0.3, y: 0.25, w, h, rotate: -1.5, fontFace: HFONT, fontSize: opts.size || 38, bold: true, color: red ? PARCH : CRIMSON, valign: "middle", align: "center", margin: [0, 0.35, 0, 0.35], isTextBox: true });
  if (step) {
    const runs = [];
    STEPS.forEach((st, i) => {
      const cur = i + 1 === step;
      runs.push({ text: (i + 1) + " " + st, options: { bold: cur, color: cur ? GOLD : "CFC3AE" } });
      if (i < STEPS.length - 1) runs.push({ text: "   ·   ", options: { color: "CFC3AE" } });
    });
    slide.addText(runs, { x: 0.55, y: 1.5, w: 9, h: 0.4, fontFace: BFONT, fontSize: 15, valign: "middle", margin: 0, isTextBox: true, shadow: SH });
  }
}

function next(slide, text) {
  slide.addText([
    { text: "Selanjutnya  ", options: { bold: true, color: GOLD } },
    { text, options: { color: PARCH, italic: true } },
  ], { x: 0.55, y: 6.68, w: 11.5, h: 0.55, fontFace: BFONT, fontSize: 22, valign: "middle", margin: 0, isTextBox: true, shadow: SH });
}

// light text directly on the image (over a scrim)
function txt(slide, runsOrText, x, y, w, h, opts) {
  opts = opts || {};
  slide.addText(runsOrText, Object.assign({ x, y, w, h, fontFace: BFONT, fontSize: opts.size || BODY, color: opts.color || PARCH, margin: 0, isTextBox: true, valign: opts.valign || "top", shadow: SH, paraSpaceAfter: opts.para }, opts.extra || {}));
}

function bullets(items, size, color) {
  return items.map((t, i) => ({ text: t, options: { bullet: { code: "25AA" }, breakLine: i < items.length - 1, paraSpaceAfter: 8, fontSize: size || BODY, color: color || PARCH } }));
}
function numbered(items, size, color) {
  return items.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < items.length - 1, paraSpaceAfter: 8, fontSize: size || BODY, color: color || PARCH } }));
}
function heading(slide, text, x, y, w, color) {
  slide.addText(text, { x, y, w, h: 0.55, fontFace: HFONT, fontSize: 28, bold: true, color: color || GOLD, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
}
function tag(slide, x, y, w, h, word, color) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.1, fill: { color }, line: { color } });
  slide.addText(word, { x, y, w, h, fontFace: BFONT, fontSize: 20, bold: true, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
function sheet(slide, x, y, w, h, rot) {
  slide.addImage({ path: IMG("sheet", ".png"), x, y, w, h, rotate: rot || 0 });
}

const NAMES = "Tifani Puspita  |  Dara Astrini Rahayu K  |  Happy Dinithasari  |  Aslih Abnuri";

// ================================================================ 1. Title
{
  const s = pres.addSlide();
  bg(s, "title", ["left"]);
  s.addText("AirAsia", { x: 0.7, y: 1.2, w: 7, h: 1.5, fontFace: HFONT, fontSize: 76, bold: true, color: PARCH, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
  s.addImage({ path: IMG("band_red", ".png"), x: 0.55, y: 2.75, w: 7.2, h: 0.95, rotate: -1.5 });
  s.addText("The World's Lowest Cost Airline", { x: 0.55, y: 2.75, w: 7.2, h: 0.95, rotate: -1.5, fontFace: HFONT, fontSize: 30, bold: true, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
  txt(s, "Sejauh mana keunggulan biaya yang dibangun di rute pendek dapat dibawa ke pasar penerbangan jarak jauh?", 0.7, 3.95, 6.6, 1.5, { extra: { italic: true } });
  txt(s, [
    { text: "Kelompok 3", options: { bold: true, fontSize: 26, color: GOLD, breakLine: true } },
    { text: NAMES, options: { fontSize: 20, color: PARCH } },
  ], 0.7, 5.5, 9.0, 1.3);
  pageNo(s);
  s.addNotes("Pembuka. Satu pertanyaan strategis: apakah keunggulan biaya AirAsia yang dibangun di rute pendek dapat dipindahkan ke rute jarak jauh melalui AirAsia X. Kasus Robert M. Grant (2010), data 2008 sampai pertengahan 2009.");
}

// ================================================================ 2. Roadmap
{
  const s = pres.addSlide();
  bg(s, "roadmap", ["left", "bottom"]);
  title(s, "How we read the case");
  heading(s, "Titik berangkat", 0.6, 1.75, 7);
  txt(s, "Lowest cost sering dibaca sebagai kelemahan. Dibaca dengan tepat, murah adalah hasil disiplin biaya (cost discipline) yang sistematis. Apakah sistem itu dapat dipindahkan (transferable) ke rute jauh?", 0.6, 2.35, 7.0, 2.1);
  txt(s, [
    { text: "1  Problem", options: { bold: true, color: GOLD } }, { text: "   tujuan dan hambatan", options: { breakLine: true } },
    { text: "2  External environment", options: { bold: true, color: GOLD } }, { text: "   PESTEL, Five Forces, peta", options: { breakLine: true } },
    { text: "3  Cost position", options: { bold: true, color: GOLD } }, { text: "   benchmarking, transferabilitas", options: { breakLine: true } },
    { text: "4  Choice", options: { bold: true, color: GOLD } }, { text: "   isu, alternatif, rekomendasi" },
  ], 0.6, 4.5, 7.4, 2.0, { para: 4 });
  next(s, "Tahap 1 dimulai dengan mengenal AirAsia lebih dulu.");
  pageNo(s);
  s.addNotes("Urutan analisis mengikuti logika Structure Conduct Performance: struktur industri dibaca lebih dulu, baru posisi perusahaan, baru pilihan strategi. Kerangka dari Thompson dan Strickland Bab 3 serta panduan analisis kasus RPKPS. Seluruh angka bersumber dari tabel dalam kasus.");
}

// ================================================================ 3. At a glance
{
  const s = pres.addSlide();
  bg(s, "glance", ["top", "bottom"]);
  title(s, "AirAsia at a glance", 1, { red: true });
  const stats = [["79", "pesawat (2009)"], ["11,8 juta", "penumpang"], ["10 negara", "dilayani"], ["RM 1", "harga akuisisi"]];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    s.addText(st[0], { x, y: 2.0, w: 2.9, h: 0.8, fontFace: HFONT, fontSize: 44, bold: true, color: GOLD, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
    txt(s, st[1], x, 2.8, 2.9, 0.5);
  });
  heading(s, "Milestones", 0.6, 3.5, 6);
  txt(s, [
    { text: "2001   ", options: { bold: true, color: GOLD } }, { text: "Fernandes dan McCarthy mengambil alih AirAsia seharga RM 1", options: { breakLine: true } },
    { text: "2002   ", options: { bold: true, color: GOLD } }, { text: "Relaunch: operasi ala Ryanair, SDM ala Southwest, merek ala easyJet", options: { breakLine: true } },
    { text: "2004   ", options: { bold: true, color: GOLD } }, { text: "Rute internasional pertama, IPO RM 717 juta, JV Thailand dan Indonesia", options: { breakLine: true } },
    { text: "2007   ", options: { bold: true, color: GOLD } }, { text: "AirAsia X mulai terbang jarak jauh; 2009 membuka rute London", options: { breakLine: true } },
    { text: "2009   ", options: { bold: true, color: GOLD } }, { text: "Skytrax: World's Best Low Cost Airline; biaya per ASK terendah (UBS)" },
  ], 0.6, 4.05, 12.2, 2.5, { para: 3 });
  next(s, "Dibangun di rute pendek. Rute jauh memunculkan masalah baru.");
  pageNo(s);
  s.addNotes("Dari 2 pesawat dan 200 ribu penumpang (Januari 2002) menjadi 79 pesawat dan 11,8 juta penumpang (Maret 2009). Hub di KL, Bangkok, dan Jakarta. Akuisisi 2001 seharga RM 1 dengan warisan utang RM 40 juta. Riset UBS 2007: biaya per ASK terendah di dunia. ROA 2008 sebesar 4 persen ketika hampir semua maskapai dunia merugi.");
}

// ================================================================ 4. Strategic problem
{
  const s = pres.addSlide();
  bg(s, "problem", ["full", "bottom"]);
  title(s, "The strategic problem", 1);
  heading(s, "Tujuan (goals)", 0.6, 3.05, 5.6);
  txt(s, bullets([
    "Menjadi maskapai internasional, bukan hanya regional",
    "Tetap berbiaya terendah di setiap rute",
    "Tumbuh lewat rute gemuk (trunk routes) jarak jauh",
  ]), 0.6, 3.65, 5.8, 2.9);
  heading(s, "Hambatan (barriers)", 6.9, 3.05, 5.6);
  txt(s, bullets([
    "Model LCC bertumpu pada rute pendek, satu tipe pesawat, layanan minimal",
    "Pesaing jarak jauh punya feeder, tiket terusan, subsidi silang",
    "Neraca 2008 lemah: utang RM 6,69 miliar, kas RM 153,8 juta",
  ]), 6.9, 3.65, 5.9, 2.9);
  next(s, "Tujuan yang terhalang. Pertanyaannya dirumuskan di slide berikutnya.");
  pageNo(s);
  s.addNotes("Mengikuti panduan RPKPS: masalah adalah tujuan yang terhalang. Angka neraca dari Tabel 9.1: rugi bersih RM 496,6 juta, utang RM 6,69 miliar berbanding ekuitas RM 1,61 miliar, kas RM 153,8 juta. Azran Osman-Rani (CEO AirAsia X): rute gemuk jarak jauh adalah sumber lalu lintas berikutnya.");
}

// ================================================================ 5. Strategic question
{
  const s = pres.addSlide();
  bg(s, "question", ["left", "bottom"]);
  title(s, "The strategic question", 1);
  txt(s, "Apakah keunggulan biaya AirAsia dapat ditransfer ke rute jauh, dan bagaimana menata hubungan dengan AirAsia X agar eksplorasi (exploration) tidak mengganggu eksploitasi (exploitation)?", 0.6, 2.05, 7.2, 2.4, { size: 25, extra: { bold: true } });
  txt(s, [
    { text: "Tiga pilihan manajemen, pertengahan 2009:", options: { color: GOLD, breakLine: true } },
    { text: "Merger AirAsia X ke dalam AirAsia", options: { bullet: { code: "25AA" }, breakLine: true } },
    { text: "Tetap terpisah dengan kontrak layanan", options: { bullet: { code: "25AA" }, breakLine: true } },
    { text: "Kembali fokus ke pasar regional", options: { bullet: { code: "25AA" } } },
  ], 0.6, 4.5, 7.2, 2.0, { para: 2 });
  next(s, "Tahap 2: membaca lingkungan eksternal lebih dulu.");
  pageNo(s);
  s.addNotes("Istilah exploration dan exploitation mengacu pada March (1991): perusahaan perlu menyeimbangkan pendalaman kompetensi yang ada dengan pencarian peluang baru.");
}

// ================================================================ 6. PESTEL
{
  const s = pres.addSlide();
  bg(s, "pestel1", ["top", "bottom"]);
  title(s, "PESTEL analysis", 2, { red: true });
  const rows = [
    ["P", "Politik", "Dukungan pemerintah; rute jauh berhadapan dengan MAS"],
    ["E", "Ekonomi", "500 juta penduduk dalam 3,5 jam terbang; BBM 47% biaya"],
    ["S", "Sosial", "Segmen menengah kurang terlayani; pasar diperluas"],
    ["T", "Teknologi", "Navitaire, yield management, ponsel; tanpa agen"],
    ["E", "Lingkungan", "A320 baru hemat BBM; A340 boros di rute jauh"],
    ["L", "Legal", "Deregulasi rute lintas negara; kepemilikan asing dibatasi"],
  ];
  rows.forEach((r, i) => {
    const y = 2.05 + i * 0.73;
    s.addShape(pres.ShapeType.ellipse, { x: 0.6, y: y + 0.08, w: 0.55, h: 0.55, fill: { color: CRIMSON }, line: { color: PARCH, width: 1 } });
    s.addText(r[0], { x: 0.6, y: y + 0.08, w: 0.55, h: 0.55, fontFace: HFONT, fontSize: 22, bold: true, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
    txt(s, [{ text: r[1] + "   ", options: { bold: true, color: GOLD } }, { text: r[2] }], 1.35, y, 11.4, 0.7, { valign: "middle" });
  });
  next(s, "Peluang makro terbuka. Bisakah menjadi laba? Lihat struktur industrinya.");
  pageNo(s);
  s.addNotes("Angka 47 persen dihitung dari Tabel 9.1: bahan bakar RM 1.389,8 juta dari biaya operasi RM 2.966 juta. Simpulan PESTEL: faktor politik dan legal adalah pembentuk struktur paling kuat. Joint venture Thai AirAsia dan Indonesia AirAsia mengontrakkan operasinya kembali ke AirAsia dengan imbalan fee bulanan. Distribusi langsung memangkas komisi agen dan sulit ditiru maskapai lama.");
}

// ================================================================ 7. Five Forces
{
  const s = pres.addSlide();
  bg(s, "fiveforces", ["left", "bottom"]);
  title(s, "Five Forces analysis", 2);
  const forces = [["Rivalitas antar pemain", "TINGGI", CRIMSON], ["Daya tawar pemasok", "TINGGI", CRIMSON], ["Daya tawar pembeli", "TINGGI", CRIMSON], ["Pendatang baru", "SEDANG", AMBER], ["Substitusi (pendek/jauh)", "SEDANG / RENDAH", AMBER]];
  forces.forEach((f, i) => {
    const y = 2.05 + i * 0.78;
    txt(s, f[0], 0.6, y, 3.6, 0.7, { valign: "middle" });
    tag(s, 4.3, y + 0.1, 2.5, 0.5, f[1], f[2]);
  });
  txt(s, "Industri kurang atraktif. Laba lahir dari posisi biaya perusahaan, sesuai logika Structure Conduct Performance.", 7.4, 4.9, 5.4, 1.6, { valign: "bottom", extra: { italic: true } });
  next(s, "Laba langka. Apa yang mengubah struktur ini, dan siapa yang menang?");
  pageNo(s);
  s.addNotes("Rivalitas: banyak peniru model Southwest, MAS menekan di rute domestik. Pemasok: duopoli Airbus dan Boeing, bahan bakar mengikuti harga minyak, tarif bandara tanpa negosiasi. Pembeli: sangat peka harga, biaya berpindah nol. Pendatang baru: deregulasi dan pesawat sewaan menurunkan hambatan; penahan slot, merek, skala. Substitusi: bus, kereta, feri di rute pendek; tidak ada pengganti setara di rute antarbenua. Tahun 2008 hampir seluruh maskapai dunia merugi.");
}

// ================================================================ 8. Driving forces and KSF
{
  const s = pres.addSlide();
  bg(s, "driving", ["left", "bottom"]);
  title(s, "Driving forces and key success factors", 2, { size: 34 });
  heading(s, "Kekuatan pendorong", 0.6, 2.05, 3.8);
  txt(s, numbered(["Deregulasi regional", "Distribusi langsung", "Harga bahan bakar", "Kelas menengah Asia", "LCC ke rute jauh"]), 0.6, 2.65, 3.7, 3.8);
  heading(s, "Faktor kunci", 4.6, 2.05, 3.6);
  txt(s, bullets(["Biaya per ASK terendah", "Utilisasi tinggi", "Load factor tinggi", "Operasi sederhana", "Merek dipercaya", "SDM produktif"]), 4.6, 2.65, 3.6, 3.8);
  next(s, "Tolok ukur siap. Di kelompok pesaing mana AirAsia dan AirAsia X berada?");
  pageNo(s);
  s.addNotes("Driving forces: deregulasi memungkinkan hub di Bangkok dan Jakarta lewat usaha patungan; internet dan ponsel menghapus komisi agen; kenaikan lalu penurunan tajam harga minyak 2008 merugikan maskapai yang salah posisi lindung nilai, termasuk AirAsia; kelas menengah Asia tumbuh sehingga pasar membesar; AirAsia X dan Jetstar menguji batas model di rute jauh. KSF diturunkan dari struktur industri: kalau pembeli peka harga dan pemasok kuat, penentu kemenangan adalah biaya, utilisasi, dan load factor. Merek yang dipercaya: murah, bukan murahan.");
}

// ================================================================ 9. Strategic group map
{
  const s = pres.addSlide();
  bg(s, "groupmap", ["full", "right", "bottom"]);
  title(s, "Strategic group map", 2);
  const ax = 0.6, ay = 2.0, aw = 7.4, ah = 4.2;
  s.addShape(pres.ShapeType.line, { x: ax, y: ay + ah / 2, w: aw, h: 0, line: { color: PARCH, width: 1.25, dashType: "dash" } });
  s.addShape(pres.ShapeType.line, { x: ax + aw / 2, y: ay, w: 0, h: ah, line: { color: PARCH, width: 1.25, dashType: "dash" } });
  const lab = (t, x, y, w, al) => s.addText(t, { x, y, w, h: 0.4, fontFace: BFONT, fontSize: 18, bold: true, color: PARCH, align: al || "left", margin: 0, isTextBox: true, shadow: SH });
  lab("Regional", ax, ay + ah + 0.02, 3); lab("Jarak jauh", ax + aw - 3, ay + ah + 0.02, 3, "right"); lab("Layanan dan biaya tinggi", ax, ay + 0.02, 3.5);
  const groups = [
    { x: 4.5, y: 2.3, w: 3.2, h: 1.3, fill: "6E6259", title: "Network carriers", body: "Emirates, BA, MAS" },
    { x: 0.8, y: 2.5, w: 3.2, h: 1.2, fill: "A69B8C", title: "Full service regional", body: "MAS domestik, SIA" },
    { x: 0.8, y: 4.75, w: 3.2, h: 1.3, fill: CRIMSON, title: "LCC regional", body: "AirAsia, Tiger, Cebu" },
    { x: 4.5, y: 4.65, w: 3.2, h: 1.3, fill: "6B1414", title: "LCC jarak jauh", body: "AirAsia X" },
  ];
  groups.forEach((g) => {
    s.addShape(pres.ShapeType.ellipse, { x: g.x, y: g.y, w: g.w, h: g.h, fill: { color: g.fill }, line: { color: PARCH, width: 1.5 }, shadow: { type: "outer", color: "000000", blur: 6, offset: 3, angle: 45, opacity: 0.5 } });
    s.addText([{ text: g.title, options: { bold: true, fontSize: 22, breakLine: true } }, { text: g.body, options: { fontSize: 20 } }], { x: g.x + 0.15, y: g.y + 0.05, w: g.w - 0.3, h: g.h - 0.1, fontFace: BFONT, color: PARCH, align: "center", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addShape(pres.ShapeType.rightArrow, { x: 4.0, y: 5.1, w: 0.5, h: 0.4, fill: { color: INK }, line: { color: INK } });
  txt(s, "AirAsia X pindah kelompok. Lawannya bukan LCC lain, melainkan network carriers yang mampu mensubsidi harga ekonomi dari kelas premium.", 8.5, 2.2, 4.3, 4.2, { valign: "middle" });
  next(s, "Tahap 2 selesai. Tahap 3: seberapa kuat posisi biaya AirAsia sendiri?");
  pageNo(s);
  s.addNotes("Hambatan mobilitas antar kelompok bukan hanya modal; yang sulit ditiru adalah budaya biaya rendah dan sistem operasi sederhana. Ruang LCC jarak jauh nyaris kosong karena rute jauh butuh pesawat berbadan lebar, kru bermalam, dan penumpang transit dari jaringan pengumpan. AirAsia X masuk membawa merek, sistem reservasi, SDM, dan disiplin biaya dari kelompok asal.");
}

// ================================================================ 10. Cost benchmarking
{
  const s = pres.addSlide();
  bg(s, "benchmark", ["bottom"]);
  title(s, "Cost benchmarking", 3, { red: true });
  sheet(s, 0.35, 1.85, 7.3, 4.7, -1.5);
  s.addChart(pres.ChartType.bar, [
    { name: "AirAsia", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [11.66, 14.11] },
    { name: "Malaysia Airlines", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [22.80, 20.60] },
  ], {
    x: 0.8, y: 2.1, w: 6.4, h: 4.15, barDir: "col", barGapWidthPct: 55,
    chartColors: [CRIMSON, "8C7B68"], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 16, dataLabelFontFace: BFONT, dataLabelColor: INK, dataLabelFormatCode: "0.00",
    catAxisLabelFontSize: 16, catAxisLabelFontFace: BFONT, catAxisLabelColor: INK,
    valAxisLabelFontSize: 14, valAxisLabelColor: INK, valAxisMinVal: 0, valAxisMaxVal: 25, valAxisMajorUnit: 5, valGridLine: { color: "C9BBA3", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 16, legendFontFace: BFONT, legendColor: INK,
    showTitle: true, title: "Sen ringgit per available seat kilometer, 2008", titleFontSize: 18, titleFontFace: BFONT, titleColor: INK,
  });
  const tiles = [["49 vs 175", "karyawan per pesawat"], ["75% vs 67,8%", "load factor 2008"]];
  tiles.forEach((t, i) => {
    const y = 4.3 + i * 1.15;
    s.addText(t[0], { x: 8.1, y, w: 3.0, h: 0.6, fontFace: HFONT, fontSize: 30, bold: true, color: GOLD, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
    txt(s, t[1], 8.1, y + 0.6, 4.6, 0.5);
  });
  next(s, "Separuh biaya MAS. Dari mana keunggulan itu berasal?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.1. Utilisasi 11,8 vs 11,1 jam per hari; turnaround 25 menit. Karyawan per pesawat: 3.799/78 vs 19.094/109. Catatan: rugi 2008 (RM 496,6 juta) bukan karena operasi, melainkan keputusan melepas kontrak berjangka bahan bakar (rugi RM 830,2 juta). Tanpa pos itu operasi tetap laba, tetapi neraca yang sarat utang pesawat membuat ruang untuk kesalahan berikutnya sempit.");
}

// ================================================================ 11. Sources of cost advantage
{
  const s = pres.addSlide();
  bg(s, "sources", ["top", "bottom"]);
  title(s, "Sources of cost advantage", 3);
  const cols = [
    ["Operasi ala Ryanair", ["Satu tipe pesawat (A320)", "Satu kelas, no frills", "Titik ke titik, 25 menit"]],
    ["SDM ala Southwest", ["Karyawan multi-skill", "Insentif produktivitas", "Budaya tanpa hierarki"]],
    ["Merek ala easyJet", ["Iklan kontra-siklus", "Co-branding, sponsorship", "Distribusi langsung, IT"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.6 + i * 4.1;
    heading(s, c[0], x, 2.05, 3.9);
    txt(s, bullets(c[1]), x, 2.65, 3.9, 2.4);
  });
  txt(s, "Ketiganya saling menopang: sebuah sistem, bukan satu kebijakan tunggal.", 0.6, 5.7, 12.2, 0.7, { extra: { italic: true }, color: GOLD });
  next(s, "Mana yang ikut ke rute jauh, mana yang tertinggal?");
  pageNo(s);
  s.addNotes("Formula Conor McCarthy: strategi operasi ala Ryanair, strategi SDM ala Southwest, strategi merek ala easyJet. Satu kelas: 148 kursi di 737 vs 132 pada dua kelas. ESOS untuk semua karyawan. Iklan ditingkatkan saat SARS dan bom Bali. Sponsorship Williams F1, Manchester United, wasit Premier League. CRS Navitaire terhubung ke yield management. Karena saling menopang, sistem ini sulit ditiru pesaing tetapi juga tidak mudah dipindahkan sebagian.");
}

// ================================================================ 12. Transferability
{
  const s = pres.addSlide();
  bg(s, "transfers", ["full", "bottom"]);
  title(s, "Transferability test", 3);
  heading(s, "Ikut terbawa", 0.6, 2.55, 5.6, "7FC97F");
  const left = [["PENUH", GREEN, "Merek dan reputasi"], ["PENUH", GREEN, "Distribusi langsung dan IT"], ["PENUH", GREEN, "SDM dan budaya biaya"], ["PENUH", GREEN, "Bandara sekunder (Stansted)"], ["PENUH", GREEN, "Outsourcing perawatan"], ["SEBAGIAN", AMBER, "Pesawat hemat bahan bakar"]];
  left.forEach((r, i) => {
    const y = 3.15 + i * 0.57;
    tag(s, 0.6, y + 0.05, 1.55, 0.46, r[0], r[1]);
    txt(s, r[2], 2.3, y, 4.2, 0.56, { valign: "middle" });
  });
  heading(s, "Tidak terbawa", 6.9, 2.55, 5.6, "F0A0A0");
  const right = [["TIDAK", CRIMSON, "Satu tipe pesawat"], ["TIDAK", CRIMSON, "Turnaround 25 menit"], ["TIDAK", CRIMSON, "Satu kelas tanpa layanan"], ["TIDAK", CRIMSON, "Jaringan titik ke titik"]];
  right.forEach((r, i) => {
    const y = 3.15 + i * 0.57;
    tag(s, 6.9, y + 0.05, 1.55, 0.46, r[0], r[1]);
    txt(s, r[2], 8.6, y, 4.2, 0.56, { valign: "middle" });
  });
  txt(s, "Yang hilang justru inti model LCC klasik.", 6.9, 5.5, 5.9, 0.9, { valign: "middle", extra: { italic: true }, color: GOLD });
  next(s, "Yang terbawa bersifat organisasional. Apa kata angka di rute KL London?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.2 dan 9.4. Merek memberi kredibilitas langsung; situs web, call center, dan CRS dipakai bersama; Stansted jauh lebih murah dari Heathrow; kontrak perawatan lelang kompetitif tetap berlaku; A330 efisien tetapi A340 untuk London boros. Tidak terbawa: A320 tak mampu terbang jauh dan armada kedua menambah kompleksitas; penerbangan 12 jam dibatasi jam kerja kru dan slot; rute jauh butuh kursi premium dan makanan; rute jauh bergantung pada penumpang transit dan feeder. Maka AirAsia X harus membangun sumber biaya rendah baru, tidak cukup mewarisi.");
}

// ================================================================ 13. Evidence KL London
{
  const s = pres.addSlide();
  bg(s, "london", ["bottom"]);
  title(s, "Evidence from KL to London", 3);
  sheet(s, 0.35, 1.85, 7.5, 4.7, 1.2);
  s.addChart(pres.ChartType.bar, [
    { name: "Biaya per penumpang (US$)", labels: ["AirAsia X", "BA", "MAS", "Emirates"], values: [373.14, 553.37, 589.50, 609.56] },
  ], {
    x: 0.85, y: 2.15, w: 6.5, h: 4.1, barDir: "bar", barGapWidthPct: 40,
    chartColors: [CRIMSON], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 16, dataLabelFontFace: BFONT, dataLabelColor: INK, dataLabelFormatCode: "#,##0",
    catAxisLabelFontSize: 16, catAxisLabelFontFace: BFONT, catAxisLabelColor: INK, catAxisOrientation: "maxMin",
    valAxisLabelFontSize: 14, valAxisLabelColor: INK, valAxisMinVal: 0, valAxisMaxVal: 700, valAxisMajorUnit: 100, valGridLine: { color: "C9BBA3", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, showTitle: true, title: "Biaya per penumpang satu arah (US$), Tabel 9.4", titleFontSize: 18, titleFontFace: BFONT, titleColor: INK,
  });
  const tiles = [["36,5%", "lebih murah dari pesaing"], ["> 90%", "load factor AirAsia X"]];
  tiles.forEach((t, i) => {
    const y = 4.3 + i * 1.15;
    s.addText(t[0], { x: 8.3, y, w: 3.0, h: 0.6, fontFace: HFONT, fontSize: 32, bold: true, color: GOLD, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
    txt(s, t[1], 8.3, y + 0.6, 4.5, 0.5);
  });
  next(s, "Selisih nyata, tetapi lebih tipis: tabel belum memuat kru, perawatan, katering.");
  pageNo(s);
  s.addNotes("Tabel 9.4 tidak termasuk perawatan, depresiasi, katering, dan gaji kru; pos itu justru membesar di rute jauh. AirAsia X membawa 286 penumpang per penerbangan, pesaing 337 sampai 360. Bahan bakar per penerbangan US$79.299 vs US$159.522 untuk B747. Tarif pulang pergi KL London AirAsia X US$433,96 vs rata-rata tarif terendah pesaing US$683,68 (Tabel 9.3). Load factor jaringan lima periode (Tabel 9.5): AirAsia 77, 75, 78, 80, 75,5; Emirates 73,4 sampai 79,8; BA 67,6 sampai 71,2; MAS 69 sampai 67,8.");
}

// ================================================================ 14. Key issues
{
  const s = pres.addSlide();
  bg(s, "issues", ["top", "bottom"]);
  title(s, "Key issues", 4, { red: true });
  txt(s, numbered([
    "Apakah pasar LCC jarak jauh cukup besar dan benar-benar kurang terlayani?",
    "Bagaimana network carriers akan membalas?",
    "Seberapa besar toleransi finansial AirAsia terhadap kegagalan?",
    "Bisakah eksploitasi dan eksplorasi berjalan dalam satu organisasi?",
    "Apakah tata kelola AirAsia X selaras dengan kepentingan AirAsia?",
  ]), 0.6, 2.05, 12.2, 2.7);
  txt(s, [
    { text: "Intisari.  ", options: { bold: true, color: GOLD } },
    { text: "Isu 1 dan 2 dari lingkungan eksternal, isu 3 dari posisi biaya, isu 4 dan 5 soal organisasi dan tata kelola.", options: { italic: true } },
  ], 0.6, 5.3, 12.2, 1.1, { valign: "middle" });
  next(s, "Lima pertanyaan ini menjadi kriteria untuk menilai tiga alternatif.");
  pageNo(s);
  s.addNotes("Isu 1: di rute regional AirAsia menciptakan pasar baru; di KL London ia merebut penumpang dari enam maskapai mapan; elastisitas permintaan belum terbukti. Isu 2: Emirates, BA, dan MAS memperoleh laba dari kelas premium dan mampu menurunkan tarif ekonomi tanpa mengorbankan laba total. Isu 3: utang RM 6,69 miliar, ekuitas RM 1,61 miliar, kas RM 153,8 juta, pesanan 10 A350. Isu 4: literatur ambidexterity (O'Reilly dan Tushman) menyebut dua jalan, pemisahan struktural atau paduan kontekstual. Isu 5: AirAsia 16 persen (opsi 30 persen), Aero Ventures 48 persen, Virgin 16 persen, Manara dan Orix 20 persen; tata kelola hibrida khas portofolio aliansi. Azran membantah kritik dengan laba bersih RM 18 juta pada kuartal pertama 2009.");
}

// ================================================================ 15. Alternatives
{
  const s = pres.addSlide();
  bg(s, "altC", ["bottom"]);
  title(s, "Strategic alternatives", 4);
  const alts = [
    ["A", "Fokus Regional", ["AirAsia X tetap terpisah", "Fokus pasar 3,5 jam terbang"], "eksploitasi murni"],
    ["B", "Integrasi Penuh", ["Merger AirAsia X ke AirAsia", "Feeder KL, ekspansi sesuai rencana"], "ambidexterity kontekstual"],
    ["C", "Integrasi Bertahap", ["Kendali 30 persen, neraca terpisah", "Rute 4 sampai 8 jam, merger menunggu bukti"], "ambidexterity struktural, tata kelola hibrida"],
  ];
  alts.forEach((a, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.ShapeType.ellipse, { x, y: 2.9, w: 0.6, h: 0.6, fill: { color: i === 2 ? CRIMSON : PARCH }, line: { color: PARCH, width: 1 } });
    s.addText(a[0], { x, y: 2.9, w: 0.6, h: 0.6, fontFace: HFONT, fontSize: 24, bold: true, color: i === 2 ? PARCH : INK, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(a[1], { x: x + 0.75, y: 2.85, w: 3.2, h: 0.7, fontFace: HFONT, fontSize: 24, bold: true, color: GOLD, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
    txt(s, bullets(a[2]), x, 3.65, 3.8, 1.9);
    txt(s, [{ text: "Sudut pandang.  ", options: { bold: true, color: GOLD } }, { text: a[3], options: { italic: true } }], x, 5.45, 3.8, 1.1, { valign: "top" });
  });
  next(s, "Ketiganya diuji dengan lima kriteria dari isu kunci.");
  pageNo(s);
  s.addNotes("Sesuai panduan RPKPS, alternatif dideskripsikan tanpa argumen pro dan kontra. A: AirAsia hanya penyedia jasa berbayar; modal ke Indonesia, Thailand, Vietnam, Filipina; opsi 30 persen tidak dieksekusi. B: satu perusahaan, satu neraca, satu jaringan; tiket terusan dan transfer bagasi; ekspansi Abu Dhabi, India, Seoul, Sydney. C: eksekusi opsi 30 persen dan tempatkan kendali operasional; rute 4 sampai 8 jam dengan A330, Eropa menunggu A350; merger hanya setelah empat kuartal laba dan load factor sesuai target. Sudut pandang: March (1991); O'Reilly dan Tushman (2004); Williamson (1991).");
}

// ================================================================ 16. Scorecard
{
  const s = pres.addSlide();
  bg(s, "scorecard", ["bottom"]);
  title(s, "Scorecard", 4);
  sheet(s, -0.1, 1.7, 13.5, 4.3, -0.8);
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
    return { text: c[0], options: { bold: true, fontSize: 22, color: c[1], align: "center", fill: { color: PARCH } } };
  }));
  s.addTable(tableRows, { x: 0.9, y: 2.15, w: 11.5, colW: [4.7, 2.3, 2.2, 2.3], fontFace: BFONT, border: { type: "solid", color: "B9A98C", pt: 1 }, rowH: 0.56, margin: [0.04, 0.12, 0.04, 0.12], valign: "middle" });
  next(s, "Alternatif C tanpa satu pun kriteria lemah. Itulah rekomendasi kami.");
  pageNo(s);
  s.addNotes("Penilaian kualitatif dari data kasus. A: aman tetapi melepas sumber pertumbuhan dan tidak pernah membangun kompetensi rute jauh. B: menangkap seluruh peluang tetapi berhadapan langsung dengan pesaing yang bersubsidi silang dan menggabungkan armada lebar ke neraca yang sarat utang. C: menangkap rute 4 sampai 8 jam, neraca terpisah, unit eksplorasi terpisah dengan kendali dan pembelajaran mengalir ke induk, kendali sepadan dengan kepemilikan.");
}

// ================================================================ 17. Recommendation
{
  const s = pres.addSlide();
  bg(s, "recommendation", ["left", "bottom"]);
  title(s, "Recommendation", 4, { red: true });
  txt(s, "Integrasi bertahap: kendalikan AirAsia X, batasi rute, buktikan dulu, baru merger.", 0.6, 2.05, 7.0, 1.4, { size: 27, color: GOLD, extra: { bold: true } });
  txt(s, bullets([
    "Eksekusi opsi 30 persen dan tempatkan manajemen AirAsia",
    "Rute 4 sampai 8 jam dengan A330 sampai A350 tiba",
    "Merger hanya setelah empat kuartal laba dan arus kas positif",
  ]), 0.6, 3.55, 7.0, 2.9);
  next(s, "Rencana implementasinya: KPI, waktu, penanggung jawab.");
  pageNo(s);
  s.addNotes("Merger penuh ditetapkan sebagai keputusan berbasis bukti kinerja (evidence based), bukan sekadar keyakinan manajemen.");
}

// ================================================================ 18. Implementation plan
{
  const s = pres.addSlide();
  bg(s, "implementation", ["bottom", "full"]);
  title(s, "Implementation plan", 4);
  const items = [
    ["Opsi 30 persen dan tim manajemen gabungan", "Q4 2009", "CEO dan Dewan"],
    ["Rute 4 sampai 8 jam; load factor di atas 85 persen", "2010 sampai 2011", "CEO AirAsia X"],
    ["Feeder terbatas di KL; transit di atas 25 persen", "2010", "Direktur Komersial"],
    ["Hedging bahan bakar 30 sampai 50 persen", "Segera", "CFO, Komite Risiko"],
    ["Utang/ekuitas di bawah 3 kali sebelum A350", "2010 sampai 2015", "CFO"],
    ["Gerbang merger: empat kuartal laba positif", "Evaluasi 2011", "Dewan Komisaris"],
  ];
  txt(s, "Inisiatif dan KPI", 0.6, 2.05, 6.7, 0.5, { size: 22, color: GOLD, valign: "middle", extra: { bold: true } });
  txt(s, "Waktu", 7.5, 2.05, 2.5, 0.5, { size: 22, color: GOLD, valign: "middle", extra: { bold: true } });
  txt(s, "Penanggung jawab", 10.1, 2.05, 2.7, 0.5, { size: 22, color: GOLD, valign: "middle", extra: { bold: true } });
  items.forEach((it, i) => {
    const y = 2.62 + i * 0.64;
    s.addShape(pres.ShapeType.line, { x: 0.6, y: y, w: 12.2, h: 0, line: { color: PARCH, width: 0.5, transparency: 55 } });
    txt(s, (i + 1) + "  " + it[0], 0.6, y, 6.7, 0.62, { size: 22, valign: "middle" });
    txt(s, it[1], 7.5, y, 2.5, 0.62, { size: 22, valign: "middle" });
    txt(s, it[2], 10.1, y, 2.7, 0.62, { size: 22, valign: "middle" });
  });
  next(s, "Rekomendasi ini menjawab pertanyaan di slide 5. Apa pelajarannya?");
  pageNo(s);
  s.addNotes("Risiko dan mitigasi. 1: konflik kepentingan Aero Ventures, mitigasi komite independen untuk transaksi afiliasi. 2: balasan harga Emirates dan MAS, mitigasi bandara sekunder dan rute yang belum padat pesaing premium; target biaya per ASK AirAsia X di bawah 60 persen pesaing per rute. 3: kompleksitas operasi, mitigasi uji coba di tiga rute sebelum diperluas. 4: terulangnya kerugian 2008, mitigasi mandat tertulis yang disetujui dewan dan batas rugi derivatif. 5: ketergantungan sewa pesawat, mitigasi sale and leaseback dan penerbitan saham bila valuasi mendukung; kas minimal tiga bulan biaya operasi. 6: tekanan untuk mempercepat, mitigasi kriteria yang dipublikasikan ke pemegang saham. Angka target adalah usulan kelompok, bukan angka kasus.");
}

// ================================================================ 19. Lessons and discussion
{
  const s = pres.addSlide();
  bg(s, "lessons", ["left", "bottom"]);
  title(s, "Lessons for Chapter 3", 4);
  txt(s, numbered([
    "Struktur industri menjelaskan mengapa laba langka, bukan siapa yang meraihnya.",
    "Keunggulan biaya adalah sistem yang saling menopang.",
    "Pindah kelompok strategis berarti melawan model laba yang berbeda.",
    "Eksplorasi butuh unit terpisah yang tetap dikendalikan induk.",
  ]), 0.6, 2.05, 7.2, 3.6);
  s.addText("Dalam satu kata: transferabilitas.", { x: 0.6, y: 5.7, w: 7.2, h: 0.65, fontFace: HFONT, fontSize: 26, italic: true, bold: true, color: GOLD, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
  txt(s, [
    { text: "Untuk didiskusikan", options: { bold: true, color: GOLD, breakLine: true } },
    { text: "Jika Anda Tony Fernandes pada Juli 2009 dengan kas RM 153,8 juta, setujui merger sekarang, atau tunggu bukti empat kuartal? Apa yang hilang jika menunggu?" },
  ], 8.3, 3.3, 4.5, 3.2, { valign: "bottom" });
  pageNo(s);
  s.addNotes("Kaitkan kembali ke Bab 3. Five Forces menunjukkan industri tidak atraktif; laba AirAsia lahir dari posisi biaya relatif. Operasi, SDM, dan merek bekerja bersama. Di rute jauh lawan AirAsia X mampu mensubsidi harga ekonomi. Lingkungan yang berubah cepat dan neraca yang lemah membuat integrasi bertahap lebih aman daripada merger penuh. Minta kelompok lain merespons pertanyaan diskusi dengan argumen berbasis data kasus.");
}

// ================================================================ 20. Thank you
{
  const s = pres.addSlide();
  bg(s, "thanks", ["left"]);
  s.addText("Thank you", { x: 0.7, y: 2.0, w: 6.5, h: 1.4, fontFace: HFONT, fontSize: 66, bold: true, color: PARCH, margin: 0, isTextBox: true, valign: "middle", shadow: SH });
  txt(s, "Terima kasih. Kami terbuka untuk pertanyaan dan diskusi.", 0.7, 3.45, 6.0, 1.0, { color: GOLD });
  txt(s, [
    { text: "Kelompok 3", options: { bold: true, fontSize: 26, color: GOLD, breakLine: true } },
    { text: NAMES, options: { fontSize: 20 } },
  ], 0.7, 5.2, 6.2, 1.4);
  pageNo(s);
  s.addNotes("Referensi: Grant (2010) Contemporary Strategy Analysis, Case 9, Tabel 9.1 sampai 9.5. Thompson dan Strickland (2019) Bab 3. Porter (1980). March (1991) Organization Science 2(1). O'Reilly dan Tushman (2004) Harvard Business Review 82(4). Williamson (1991) Administrative Science Quarterly 36(2). Handoko, Indarti, dan Almahendra (2014) Manajemen dalam Berbagai Perspektif. RPKPS MAN 5422 FEB UGM (2026), Lampiran 3.");
}

const out = process.argv[2] || "AirAsia_visual.pptx";
pres.writeFile({ fileName: out }).then((f) => console.log("written", f));
