const pptxgen = require("pptxgenjs");
const path = require("path");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Kelompok 3";
pres.title = "AirAsia: The World's Lowest Cost Airline";

const IMG = (n) => path.join(__dirname, "img", "bw_" + n + ".png");
const W = 13.33, H = 7.5;

// Bauhaus palette
const CREAM = "F3E2CF";
const RED = "E63E2C";
const BLUE = "2C7BB8";
const YELLOW = "F4C430";
const BLACK = "1B1B1B";
const WHITE = "FFFFFF";
const GREY = "6B6B6B";
const AMBER = "C98A00";
const HF = "Bebas Neue";
const BF = "Manrope";
const BODY = 24;

const STEPS = ["Problem", "External environment", "Cost position", "Choice"];
const STEPCOL = [RED, BLUE, YELLOW, BLACK];
let slideNo = 0;

function base(slide) { slide.background = { color: CREAM }; }
function pageNo(slide) {
  slideNo += 1;
  slide.addText(String(slideNo), { x: 12.3, y: 6.95, w: 0.6, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: BLACK, align: "right", valign: "middle", margin: 0, isTextBox: true });
}
function circle(slide, x, y, d, color, opts) {
  slide.addShape(pres.ShapeType.ellipse, Object.assign({ x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } }, opts || {}));
}
function rect(slide, x, y, w, h, color) {
  slide.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color }, line: { color, width: 0 } });
}
// dotted arc: hollow circle with dotted outline (partly hidden by other shapes or the edge)
function dots(slide, x, y, d) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { type: "none" }, line: { color: BLACK, width: 1.5, dashType: "sysDot" } });
}
// half circle: circle plus a cream cover on one side ("l","r","t","b" = which half is kept)
function half(slide, x, y, d, color, keep) {
  circle(slide, x, y, d, color);
  if (keep === "l") rect(slide, x + d / 2, y - 0.02, d / 2 + 0.05, d + 0.04, CREAM);
  if (keep === "r") rect(slide, x - 0.05, y - 0.02, d / 2 + 0.05, d + 0.04, CREAM);
  if (keep === "t") rect(slide, x - 0.02, y + d / 2, d + 0.04, d / 2 + 0.05, CREAM);
  if (keep === "b") rect(slide, x - 0.02, y - 0.05, d + 0.04, d / 2 + 0.05, CREAM);
}
function pic(slide, name, x, y, w, h, opts) {
  slide.addImage(Object.assign({ path: IMG(name), x, y, w, h }, opts || {}));
}
function title(slide, text, step, opts) {
  opts = opts || {};
  if (opts.bar) {
    rect(slide, 0.6, 0.45, Math.min(11.5, 0.9 + text.length * 0.33), 0.95, opts.bar);
    slide.addText(text, { x: 0.6, y: 0.45, w: Math.min(11.5, 0.9 + text.length * 0.33), h: 0.95, fontFace: HF, fontSize: 44, color: opts.bar === YELLOW ? BLACK : WHITE, valign: "middle", margin: [0, 0.3, 0, 0.3], isTextBox: true });
  } else {
    slide.addText(text, { x: 0.6, y: 0.45, w: 11.5, h: 0.95, fontFace: HF, fontSize: 54, color: BLACK, valign: "middle", margin: 0, isTextBox: true });
  }
  if (step) {
    const runs = [];
    STEPS.forEach((st, i) => {
      const cur = i + 1 === step;
      runs.push({ text: "■ ", options: { color: cur ? STEPCOL[i] : "C9B9A6", fontSize: 12 } });
      runs.push({ text: st.toUpperCase() + "     ", options: { bold: cur, color: cur ? BLACK : "8E7F6E" } });
    });
    slide.addText(runs, { x: 0.6, y: 1.42, w: 11, h: 0.35, fontFace: BF, fontSize: 13, charSpacing: 1.5, valign: "middle", margin: 0, isTextBox: true });
  }
}
function next(slide, text) {
  slide.addText([
    { text: "■  ", options: { color: RED, fontSize: 12 } },
    { text: "Selanjutnya  ", options: { bold: true, color: BLACK } },
    { text, options: { color: "4A4A4A" } },
  ], { x: 0.6, y: 6.75, w: 11.4, h: 0.5, fontFace: BF, fontSize: 18, valign: "middle", margin: 0, isTextBox: true });
}
function txt(slide, content, x, y, w, h, opts) {
  opts = opts || {};
  slide.addText(content, Object.assign({ x, y, w, h, fontFace: BF, fontSize: opts.size || BODY, color: opts.color || BLACK, margin: 0, isTextBox: true, valign: opts.valign || "top", paraSpaceAfter: opts.para }, opts.extra || {}));
}
function bullets(items, size, color, bul) {
  return items.map((t, i) => ({ text: t, options: { bullet: { code: bul || "25A0" }, breakLine: i < items.length - 1, paraSpaceAfter: 8, fontSize: size || BODY, color: color || BLACK } }));
}
function heading(slide, text, x, y, w, color, size) {
  slide.addText(text, { x, y, w, h: 0.6, fontFace: HF, fontSize: size || 34, color: color || BLACK, margin: 0, isTextBox: true, valign: "middle" });
}
function tag(slide, x, y, w, h, word, color) {
  rect(slide, x, y, w, h, color);
  slide.addText(word, { x, y, w, h, fontFace: BF, fontSize: 16, bold: true, color: color === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true, charSpacing: 1 });
}
function numCircle(slide, x, y, d, n, color) {
  circle(slide, x, y, d, color);
  slide.addText(String(n), { x, y, w: d, h: d, fontFace: HF, fontSize: d * 44, color: color === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

const NAMES = "Tifani Puspita  |  Dara Astrini Rahayu K  |  Happy Dinithasari  |  Aslih Abnuri";

// ================================================================ 1. Title
{
  const s = pres.addSlide(); base(s);
  circle(s, 7.3, 0.6, 5.2, YELLOW);
  half(s, 9.9, 3.3, 4.2, RED, "l");
  dots(s, 6.6, 4.6, 3.2);
  rect(s, 12.6, 0, 0.73, 7.5, BLUE);
  pic(s, "a320", 6.3, 2.2, 6.4, 2.7);
  s.addText("AIRASIA", { x: 0.6, y: 0.8, w: 6.5, h: 1.9, fontFace: HF, fontSize: 120, color: BLACK, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("THE WORLD'S LOWEST COST AIRLINE", { x: 0.6, y: 2.65, w: 6.5, h: 0.8, fontFace: HF, fontSize: 40, color: RED, margin: 0, isTextBox: true, valign: "middle" });
  txt(s, "Sejauh mana keunggulan biaya yang dibangun di rute pendek dapat dibawa ke pasar penerbangan jarak jauh?", 0.6, 3.7, 5.9, 1.6);
  rect(s, 0.6, 5.55, 0.9, 0.08, BLACK);
  txt(s, [{ text: "KELOMPOK 3", options: { bold: true, breakLine: true, fontSize: 20 } }, { text: NAMES, options: { fontSize: 18, color: "4A4A4A" } }], 0.6, 5.75, 8.5, 1.2);
  pageNo(s);
  s.addNotes("Pembuka. Satu pertanyaan strategis: apakah keunggulan biaya AirAsia yang dibangun di rute pendek dapat dipindahkan ke rute jarak jauh melalui AirAsia X. Kasus Robert M. Grant (2010), data 2008 sampai pertengahan 2009.");
}

// ================================================================ 2. Roadmap
{
  const s = pres.addSlide(); base(s);
  title(s, "HOW WE READ THE CASE");
  txt(s, "Lowest cost sering dibaca sebagai kelemahan. Dibaca dengan tepat, murah adalah hasil disiplin biaya (cost discipline) yang sistematis. Apakah sistem itu dapat dipindahkan (transferable) ke rute jauh?", 0.6, 1.6, 8.6, 1.9);
  dots(s, 10.2, 0.9, 2.6);
  const steps = [["Problem", "tujuan dan hambatan"], ["External environment", "PESTEL, Five Forces, peta"], ["Cost position", "benchmarking, transfer"], ["Choice", "isu, alternatif, rekomendasi"]];
  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    numCircle(s, x, 3.6, 1.2, i + 1, STEPCOL[i]);
    heading(s, st[0].toUpperCase(), x, 4.9, 2.9, BLACK, 26);
    txt(s, st[1], x, 5.5, 2.9, 1.1, { color: "4A4A4A" });
  });
  next(s, "Tahap 1 dimulai dengan mengenal AirAsia lebih dulu.");
  pageNo(s);
  s.addNotes("Urutan analisis mengikuti logika Structure Conduct Performance: struktur industri dibaca lebih dulu, baru posisi perusahaan, baru pilihan strategi. Kerangka dari Thompson dan Strickland Bab 3 serta panduan analisis kasus RPKPS. Seluruh angka bersumber dari tabel dalam kasus.");
}

// ================================================================ 3. At a glance
{
  const s = pres.addSlide(); base(s);
  title(s, "AIRASIA AT A GLANCE", 1, { bar: RED });
  const stats = [["79", "pesawat 2009", BLACK], ["11,8 JT", "penumpang", RED], ["10", "negara", BLUE], ["RM 1", "harga beli", BLACK]];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 2.4;
    s.addText(st[0], { x, y: 1.95, w: 2.3, h: 1.0, fontFace: HF, fontSize: 60, color: st[2], margin: 0, isTextBox: true, valign: "middle" });
    txt(s, st[1], x, 2.95, 2.3, 0.5, { color: "4A4A4A" });
  });
  heading(s, "MILESTONES", 0.6, 3.6, 5);
  txt(s, [
    { text: "2001   ", options: { bold: true, color: RED } }, { text: "Diambil alih Fernandes dan McCarthy seharga RM 1", options: { breakLine: true } },
    { text: "2002   ", options: { bold: true, color: RED } }, { text: "Relaunch: model Ryanair, Southwest, easyJet", options: { breakLine: true } },
    { text: "2004   ", options: { bold: true, color: RED } }, { text: "Rute internasional pertama; IPO RM 717 juta", options: { breakLine: true } },
    { text: "2007   ", options: { bold: true, color: RED } }, { text: "AirAsia X mulai terbang jarak jauh", options: { breakLine: true } },
    { text: "2009   ", options: { bold: true, color: RED } }, { text: "Skytrax: World's Best Low Cost Airline" },
  ], 0.6, 4.2, 9.4, 2.5, { para: 3 });
  rect(s, 10.9, 1.9, 1.8, 4.8, BLUE);
  circle(s, 9.9, 4.9, 1.6, YELLOW);
  pic(s, "petronas", 10.35, 2.1, 2.5, 4.55);
  next(s, "Dibangun di rute pendek. Rute jauh memunculkan masalah baru.");
  pageNo(s);
  s.addNotes("Dari 2 pesawat dan 200 ribu penumpang (Januari 2002) menjadi 79 pesawat dan 11,8 juta penumpang (Maret 2009). Hub di KL, Bangkok, dan Jakarta. Akuisisi 2001 seharga RM 1 dengan warisan utang RM 40 juta. Riset UBS 2007: biaya per ASK terendah di dunia. ROA 2008 sebesar 4 persen ketika hampir semua maskapai dunia merugi.");
}

// ================================================================ 4. Strategic problem
{
  const s = pres.addSlide(); base(s);
  title(s, "THE STRATEGIC PROBLEM", 1);
  half(s, 11.3, -0.2, 3.0, YELLOW, "b");
  heading(s, "TUJUAN (GOALS)", 0.6, 1.95, 5.6, RED);
  txt(s, bullets([
    "Menjadi maskapai internasional, bukan hanya regional",
    "Tetap berbiaya terendah di setiap rute",
    "Tumbuh lewat rute gemuk (trunk routes) jarak jauh",
  ]), 0.6, 2.6, 5.6, 3.9);
  rect(s, 6.55, 1.95, 0.1, 4.55, BLACK);
  heading(s, "HAMBATAN (BARRIERS)", 7.0, 1.95, 5.8, BLUE);
  txt(s, bullets([
    "Model LCC bertumpu pada rute pendek, satu tipe pesawat, layanan minimal",
    "Pesaing jarak jauh punya feeder, tiket terusan, subsidi silang",
    "Neraca 2008 lemah: utang RM 6,69 miliar, kas RM 153,8 juta",
  ]), 7.0, 2.6, 5.8, 3.9);
  next(s, "Tujuan yang terhalang. Pertanyaannya dirumuskan di slide berikutnya.");
  pageNo(s);
  s.addNotes("Mengikuti panduan RPKPS: masalah adalah tujuan yang terhalang. Angka neraca dari Tabel 9.1: rugi bersih RM 496,6 juta, utang RM 6,69 miliar berbanding ekuitas RM 1,61 miliar, kas RM 153,8 juta. Azran Osman-Rani (CEO AirAsia X): rute gemuk jarak jauh adalah sumber lalu lintas berikutnya.");
}

// ================================================================ 5. Strategic question
{
  const s = pres.addSlide(); base(s);
  title(s, "THE STRATEGIC QUESTION", 1);
  circle(s, 8.3, 1.7, 4.6, BLUE);
  dots(s, 7.4, 4.9, 2.4);
  pic(s, "widebody", 7.2, 3.4, 6.0, 2.4);
  txt(s, "Apakah keunggulan biaya AirAsia dapat ditransfer ke rute jauh, dan bagaimana menata hubungan dengan AirAsia X agar eksplorasi (exploration) tidak mengganggu eksploitasi (exploitation)?", 0.6, 1.9, 6.4, 2.6, { size: 24, extra: { bold: true } });
  txt(s, [
    { text: "Tiga pilihan manajemen (2009):", options: { color: RED, bold: true, breakLine: true } },
    { text: "Merger AirAsia X ke dalam AirAsia", options: { bullet: { code: "25A0" }, breakLine: true } },
    { text: "Tetap terpisah dengan kontrak layanan", options: { bullet: { code: "25A0" }, breakLine: true } },
    { text: "Kembali fokus ke pasar regional", options: { bullet: { code: "25A0" } } },
  ], 0.6, 4.65, 6.4, 1.95, { para: 2 });
  next(s, "Tahap 2: membaca lingkungan eksternal lebih dulu.");
  pageNo(s);
  s.addNotes("Istilah exploration dan exploitation mengacu pada March (1991): perusahaan perlu menyeimbangkan pendalaman kompetensi yang ada dengan pencarian peluang baru.");
}

// ================================================================ 6. PESTEL
{
  const s = pres.addSlide(); base(s);
  title(s, "PESTEL ANALYSIS", 2, { bar: BLUE });
  const rows = [
    ["P", "Politik", "Dukungan pemerintah; rute jauh berhadapan dengan MAS", RED],
    ["E", "Ekonomi", "500 juta penduduk dalam 3,5 jam terbang; BBM 47% biaya", BLUE],
    ["S", "Sosial", "Segmen menengah kurang terlayani; pasar diperluas", YELLOW],
    ["T", "Teknologi", "Navitaire, yield management, ponsel; tanpa agen", BLACK],
    ["E", "Lingkungan", "A320 baru hemat BBM; A340 boros di rute jauh", RED],
    ["L", "Legal", "Deregulasi rute lintas negara; kepemilikan asing dibatasi", BLUE],
  ];
  rows.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.95 + row * 2.4;
    // geometric icon: circle + small square accent
    circle(s, x, y, 0.75, r[3]);
    rect(s, x + 0.55, y + 0.45, 0.35, 0.35, r[3] === BLACK ? YELLOW : BLACK);
    s.addText(r[0], { x, y, w: 0.75, h: 0.75, fontFace: HF, fontSize: 30, color: r[3] === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    heading(s, r[1].toUpperCase(), x + 1.1, y + 0.05, 2.8, BLACK, 30);
    txt(s, r[2], x, y + 0.95, 3.8, 1.35, { size: BODY });
  });
  next(s, "Peluang makro terbuka. Bisakah menjadi laba? Lihat struktur industrinya.");
  pageNo(s);
  s.addNotes("Angka 47 persen dihitung dari Tabel 9.1: bahan bakar RM 1.389,8 juta dari biaya operasi RM 2.966 juta. Simpulan PESTEL: faktor politik dan legal adalah pembentuk struktur paling kuat. Joint venture Thai AirAsia dan Indonesia AirAsia mengontrakkan operasinya kembali ke AirAsia dengan imbalan fee bulanan. Distribusi langsung memangkas komisi agen dan sulit ditiru maskapai lama.");
}

// ================================================================ 7. Five Forces
{
  const s = pres.addSlide(); base(s);
  title(s, "FIVE FORCES ANALYSIS", 2);
  const cx = 3.75, cy = 4.2;
  const ring = (x, y, d, color, lines) => {
    circle(s, x, y, d, color);
    s.addText(lines, { x: x + 0.1, y: y + 0.1, w: d - 0.2, h: d - 0.2, fontFace: BF, color: color === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
  };
  ring(2.5, 3.2, 2.1, BLACK, [{ text: "RIVALITAS", options: { fontFace: HF, fontSize: 28, breakLine: true } }, { text: "TINGGI", options: { bold: true, fontSize: 20 } }]);
  ring(0.6, 1.95, 1.8, RED, [{ text: "PEMASOK", options: { fontFace: HF, fontSize: 26, breakLine: true } }, { text: "TINGGI", options: { bold: true, fontSize: 18 } }]);
  ring(4.7, 1.95, 1.8, BLUE, [{ text: "PEMBELI", options: { fontFace: HF, fontSize: 26, breakLine: true } }, { text: "TINGGI", options: { bold: true, fontSize: 18 } }]);
  ring(0.6, 4.65, 1.8, YELLOW, [{ text: "PENDATANG", options: { fontFace: HF, fontSize: 26, breakLine: true } }, { text: "SEDANG", options: { bold: true, fontSize: 18 } }]);
  ring(4.7, 4.65, 1.8, GREY, [{ text: "SUBSTITUSI", options: { fontFace: HF, fontSize: 26, breakLine: true } }, { text: "SEDANG / RENDAH", options: { bold: true, fontSize: 15 } }]);
  txt(s, [
    { text: "Industri kurang atraktif. ", options: { bold: true } },
    { text: "Laba lahir dari posisi biaya perusahaan, sesuai logika Structure Conduct Performance." },
  ], 7.6, 2.2, 5.2, 2.2);
  txt(s, "Yang tidak bisa dikendalikan: pemasok dan pembeli. Yang bisa dikendalikan: struktur biaya sendiri.", 7.6, 4.5, 5.2, 1.6, { color: "4A4A4A" });
  dots(s, 11.2, 5.4, 2.0);
  next(s, "Laba langka. Apa yang mengubah struktur ini, dan siapa yang menang?");
  pageNo(s);
  s.addNotes("Rivalitas: banyak peniru model Southwest, MAS menekan di rute domestik. Pemasok: duopoli Airbus dan Boeing, bahan bakar mengikuti harga minyak, tarif bandara tanpa negosiasi. Pembeli: sangat peka harga, biaya berpindah nol. Pendatang baru: deregulasi dan pesawat sewaan menurunkan hambatan; penahan slot, merek, skala. Substitusi: bus, kereta, feri di rute pendek; tidak ada pengganti setara di rute antarbenua. Tahun 2008 hampir seluruh maskapai dunia merugi.");
}

// ================================================================ 8. Driving forces and KSF
{
  const s = pres.addSlide(); base(s);
  title(s, "DRIVING FORCES AND KEY SUCCESS FACTORS", 2);
  heading(s, "KEKUATAN PENDORONG", 0.6, 1.95, 4.2, RED);
  txt(s, bullets(["Deregulasi regional", "Distribusi langsung", "Harga bahan bakar", "Kelas menengah Asia", "LCC ke rute jauh"], BODY, BLACK, "25CF"), 0.6, 2.6, 4.0, 3.9);
  heading(s, "FAKTOR KUNCI", 4.9, 1.95, 4.0, BLUE);
  txt(s, bullets(["Biaya per ASK terendah", "Utilisasi tinggi", "Load factor tinggi", "Operasi sederhana", "Merek dipercaya", "SDM produktif"], BODY, BLACK, "25CF"), 4.9, 2.6, 4.0, 3.9);
  half(s, 9.3, 1.9, 4.6, YELLOW, "l");
  pic(s, "engine", 9.4, 2.3, 3.5, 3.5);
  next(s, "Tolok ukur siap. Di kelompok pesaing mana AirAsia dan AirAsia X berada?");
  pageNo(s);
  s.addNotes("Driving forces: deregulasi memungkinkan hub di Bangkok dan Jakarta lewat usaha patungan; internet dan ponsel menghapus komisi agen; kenaikan lalu penurunan tajam harga minyak 2008 merugikan maskapai yang salah posisi lindung nilai, termasuk AirAsia; kelas menengah Asia tumbuh sehingga pasar membesar; AirAsia X dan Jetstar menguji batas model di rute jauh. KSF diturunkan dari struktur industri: kalau pembeli peka harga dan pemasok kuat, penentu kemenangan adalah biaya, utilisasi, dan load factor. Merek yang dipercaya: murah, bukan murahan.");
}

// ================================================================ 9. Strategic group map
{
  const s = pres.addSlide(); base(s);
  title(s, "STRATEGIC GROUP MAP", 2);
  const ax = 0.6, ay = 2.25, aw = 7.4, ah = 4.2;
  rect(s, ax, ay + ah / 2, aw, 0.05, BLACK);
  rect(s, ax + aw / 2, ay, 0.05, ah, BLACK);
  const lab = (t, x, y, w, al) => s.addText(t, { x, y, w, h: 0.35, fontFace: BF, fontSize: 14, bold: true, color: BLACK, align: al || "left", margin: 0, isTextBox: true, charSpacing: 1 });
  lab("REGIONAL", ax, ay + ah + 0.05, 3); lab("JARAK JAUH", ax + aw - 3, ay + ah + 0.05, 3, "right"); lab("LAYANAN DAN BIAYA TINGGI", ax, ay - 0.38, 5);
  const groups = [
    { x: 4.6, y: 2.4, d: 1.8, fill: BLACK, title: "NETWORK CARRIERS", body: "Emirates, BA, MAS" },
    { x: 1.2, y: 2.45, d: 1.7, fill: BLUE, title: "FULL SERVICE", body: "MAS domestik, SIA" },
    { x: 1.2, y: 4.5, d: 1.8, fill: RED, title: "LCC REGIONAL", body: "AirAsia, Tiger, Cebu" },
    { x: 4.7, y: 4.55, d: 1.7, fill: YELLOW, title: "LCC JARAK JAUH", body: "AirAsia X" },
  ];
  groups.forEach((g) => {
    circle(s, g.x, g.y, g.d, g.fill);
    s.addText([{ text: g.title, options: { fontFace: HF, fontSize: 22, breakLine: true } }, { text: g.body, options: { fontSize: 15, bold: true } }], { x: g.x, y: g.y, w: g.d, h: g.d, fontFace: BF, color: g.fill === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: [0, 0.1, 0, 0.1], isTextBox: true });
  });
  s.addShape(pres.ShapeType.rightArrow, { x: 3.2, y: 5.15, w: 1.4, h: 0.4, fill: { color: BLACK }, line: { color: BLACK, width: 0 } });
  txt(s, [
    { text: "AirAsia X pindah kelompok. ", options: { bold: true } },
    { text: "Lawannya bukan LCC lain, melainkan network carriers yang mampu mensubsidi harga ekonomi dari kelas premium." },
  ], 8.5, 2.0, 4.3, 3.2);
  dots(s, 10.6, 4.9, 2.0);
  next(s, "Tahap 2 selesai. Tahap 3: seberapa kuat posisi biaya AirAsia sendiri?");
  pageNo(s);
  s.addNotes("Hambatan mobilitas antar kelompok bukan hanya modal; yang sulit ditiru adalah budaya biaya rendah dan sistem operasi sederhana. Ruang LCC jarak jauh nyaris kosong karena rute jauh butuh pesawat berbadan lebar, kru bermalam, dan penumpang transit dari jaringan pengumpan. AirAsia X masuk membawa merek, sistem reservasi, SDM, dan disiplin biaya dari kelompok asal.");
}

// ================================================================ 10. Cost benchmarking
{
  const s = pres.addSlide(); base(s);
  title(s, "COST BENCHMARKING", 3, { bar: YELLOW });
  rect(s, 0.6, 1.95, 7.2, 4.55, WHITE);
  s.addChart(pres.ChartType.bar, [
    { name: "AirAsia", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [11.66, 14.11] },
    { name: "Malaysia Airlines", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [22.80, 20.60] },
  ], {
    x: 0.8, y: 2.05, w: 6.8, h: 4.35, barDir: "col", barGapWidthPct: 55,
    chartColors: [RED, BLUE], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 16, dataLabelFontFace: BF, dataLabelColor: BLACK, dataLabelFormatCode: "0.00",
    catAxisLabelFontSize: 16, catAxisLabelFontFace: BF, catAxisLabelColor: BLACK,
    valAxisLabelFontSize: 14, valAxisLabelColor: GREY, valAxisMinVal: 0, valAxisMaxVal: 25, valAxisMajorUnit: 5, valGridLine: { color: "E5DED4", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 16, legendFontFace: BF, legendColor: BLACK,
    showTitle: true, title: "Sen ringgit per available seat kilometer, 2008", titleFontSize: 18, titleFontFace: BF, titleColor: BLACK,
  });
  const tiles = [["49 VS 175", "karyawan per pesawat", RED], ["75% VS 67,8%", "load factor 2008", BLUE]];
  tiles.forEach((t, i) => {
    const y = 2.1 + i * 2.2;
    s.addText(t[0], { x: 8.3, y, w: 4.6, h: 1.0, fontFace: HF, fontSize: 56, color: t[2], margin: 0, isTextBox: true, valign: "middle" });
    txt(s, t[1], 8.3, y + 1.0, 4.6, 0.6, { color: "4A4A4A" });
  });
  half(s, 11.0, 5.6, 2.2, YELLOW, "t");
  next(s, "Separuh biaya MAS. Dari mana keunggulan itu berasal?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.1. Utilisasi 11,8 vs 11,1 jam per hari; turnaround 25 menit. Karyawan per pesawat: 3.799/78 vs 19.094/109. Catatan: rugi 2008 (RM 496,6 juta) bukan karena operasi, melainkan keputusan melepas kontrak berjangka bahan bakar (rugi RM 830,2 juta). Tanpa pos itu operasi tetap laba, tetapi neraca yang sarat utang pesawat membuat ruang untuk kesalahan berikutnya sempit.");
}

// ================================================================ 11. Sources of cost advantage
{
  const s = pres.addSlide(); base(s);
  title(s, "SOURCES OF COST ADVANTAGE", 3);
  const cols = [
    ["OPERASI ALA RYANAIR", RED, ["Satu tipe pesawat", "Satu kelas, no frills", "Titik ke titik, 25 menit"]],
    ["SDM ALA SOUTHWEST", BLUE, ["Karyawan multi-skill", "Insentif produktivitas", "Budaya tanpa hierarki"]],
    ["MEREK ALA EASYJET", YELLOW, ["Iklan kontra-siklus", "Co-branding, sponsor", "Distribusi langsung, IT"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.6 + i * 4.1;
    rect(s, x, 1.95, 3.9, 0.7, c[1]);
    s.addText(c[0], { x, y: 1.95, w: 3.9, h: 0.7, fontFace: HF, fontSize: 28, color: c[1] === YELLOW ? BLACK : WHITE, valign: "middle", margin: [0, 0.2, 0, 0.2], isTextBox: true });
    txt(s, bullets(c[2]), x, 2.8, 3.9, 1.8);
  });
  pic(s, "hangar", 0.6, 4.85, 8.2, 1.7, { sizing: { type: "cover", w: 8.2, h: 1.7 } });
  txt(s, "Ketiganya saling menopang: sebuah sistem, bukan satu kebijakan tunggal.", 9.1, 4.75, 3.7, 1.85, { extra: { bold: true }, valign: "middle" });
  next(s, "Mana yang ikut ke rute jauh, mana yang tertinggal?");
  pageNo(s);
  s.addNotes("Formula Conor McCarthy: strategi operasi ala Ryanair, strategi SDM ala Southwest, strategi merek ala easyJet. Satu kelas: 148 kursi di 737 vs 132 pada dua kelas. ESOS untuk semua karyawan. Iklan ditingkatkan saat SARS dan bom Bali. Sponsorship Williams F1, Manchester United, wasit Premier League. CRS Navitaire terhubung ke yield management. Karena saling menopang, sistem ini sulit ditiru pesaing tetapi juga tidak mudah dipindahkan sebagian.");
}

// ================================================================ 12. Transferability
{
  const s = pres.addSlide(); base(s);
  title(s, "TRANSFERABILITY TEST", 3);
  heading(s, "IKUT TERBAWA", 0.6, 1.95, 5.6, BLUE);
  const left = [["PENUH", BLUE, "Merek dan reputasi"], ["PENUH", BLUE, "Distribusi langsung dan IT"], ["PENUH", BLUE, "SDM dan budaya biaya"], ["PENUH", BLUE, "Bandara sekunder"], ["PENUH", BLUE, "Outsourcing perawatan"], ["SEBAGIAN", YELLOW, "Pesawat hemat BBM"]];
  left.forEach((r, i) => {
    const y = 2.65 + i * 0.6;
    tag(s, 0.6, y + 0.07, 1.5, 0.44, r[0], r[1]);
    txt(s, r[2], 2.3, y, 4.0, 0.58, { valign: "middle" });
  });
  heading(s, "TIDAK TERBAWA", 6.9, 1.95, 5.6, RED);
  const right = [["TIDAK", RED, "Satu tipe pesawat"], ["TIDAK", RED, "Turnaround 25 menit"], ["TIDAK", RED, "Satu kelas tanpa layanan"], ["TIDAK", RED, "Jaringan titik ke titik"]];
  right.forEach((r, i) => {
    const y = 2.65 + i * 0.6;
    tag(s, 6.9, y + 0.07, 1.5, 0.44, r[0], r[1]);
    txt(s, r[2], 8.6, y, 4.2, 0.58, { valign: "middle" });
  });
  txt(s, "Yang hilang justru inti model LCC klasik.", 6.9, 5.15, 3.6, 1.2, { extra: { bold: true } });
  pic(s, "groundcrew", 10.2, 4.7, 2.7, 1.85);
  next(s, "Yang terbawa bersifat organisasional. Apa kata angka di rute KL London?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.2 dan 9.4. Merek memberi kredibilitas langsung; situs web, call center, dan CRS dipakai bersama; Stansted jauh lebih murah dari Heathrow; kontrak perawatan lelang kompetitif tetap berlaku; A330 efisien tetapi A340 untuk London boros. Tidak terbawa: A320 tak mampu terbang jauh dan armada kedua menambah kompleksitas; penerbangan 12 jam dibatasi jam kerja kru dan slot; rute jauh butuh kursi premium dan makanan; rute jauh bergantung pada penumpang transit dan feeder. Maka AirAsia X harus membangun sumber biaya rendah baru, tidak cukup mewarisi.");
}

// ================================================================ 13. Evidence KL London
{
  const s = pres.addSlide(); base(s);
  title(s, "EVIDENCE FROM KL TO LONDON", 3);
  rect(s, 0.6, 1.95, 7.2, 4.55, WHITE);
  s.addChart(pres.ChartType.bar, [
    { name: "Biaya per penumpang (US$)", labels: ["AirAsia X", "BA", "MAS", "Emirates"], values: [373.14, 553.37, 589.50, 609.56] },
  ], {
    x: 0.8, y: 2.05, w: 6.8, h: 4.35, barDir: "bar", barGapWidthPct: 40,
    chartColors: [RED], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 16, dataLabelFontFace: BF, dataLabelColor: BLACK, dataLabelFormatCode: "#,##0",
    catAxisLabelFontSize: 16, catAxisLabelFontFace: BF, catAxisLabelColor: BLACK, catAxisOrientation: "maxMin",
    valAxisLabelFontSize: 14, valAxisLabelColor: GREY, valAxisMinVal: 0, valAxisMaxVal: 700, valAxisMajorUnit: 100, valGridLine: { color: "E5DED4", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, showTitle: true, title: "Biaya per penumpang (US$), Tabel 9.4", titleFontSize: 18, titleFontFace: BF, titleColor: BLACK,
  });
  circle(s, 10.6, 1.6, 2.3, RED);
  pic(s, "bigben", 11.05, 1.95, 1.75, 4.55);
  const tiles = [["36,5%", "lebih murah dari pesaing", BLUE], ["> 90%", "load factor AirAsia X", BLACK]];
  tiles.forEach((t, i) => {
    const y = 3.2 + i * 1.65;
    s.addText(t[0], { x: 8.2, y, w: 2.8, h: 0.9, fontFace: HF, fontSize: 56, color: t[2], margin: 0, isTextBox: true, valign: "middle" });
    txt(s, t[1], 8.2, y + 0.9, 2.9, 0.7, { color: "4A4A4A", size: 20 });
  });
  next(s, "Selisih nyata, tetapi lebih tipis: tabel belum memuat kru, perawatan, katering.");
  pageNo(s);
  s.addNotes("Tabel 9.4 tidak termasuk perawatan, depresiasi, katering, dan gaji kru; pos itu justru membesar di rute jauh. AirAsia X membawa 286 penumpang per penerbangan, pesaing 337 sampai 360. Bahan bakar per penerbangan US$79.299 vs US$159.522 untuk B747. Tarif pulang pergi KL London AirAsia X US$433,96 vs rata-rata tarif terendah pesaing US$683,68 (Tabel 9.3). Load factor jaringan lima periode (Tabel 9.5): AirAsia 77, 75, 78, 80, 75,5; Emirates 73,4 sampai 79,8; BA 67,6 sampai 71,2; MAS 69 sampai 67,8.");
}

// ================================================================ 14. Key issues
{
  const s = pres.addSlide(); base(s);
  title(s, "KEY ISSUES", 4, { bar: BLACK });
  const qs = [
    "Apakah pasar LCC jarak jauh cukup besar dan benar-benar kurang terlayani?",
    "Bagaimana network carriers akan membalas?",
    "Seberapa besar toleransi finansial AirAsia terhadap kegagalan?",
    "Bisakah eksploitasi dan eksplorasi berjalan dalam satu organisasi?",
    "Apakah tata kelola AirAsia X selaras dengan kepentingan AirAsia?",
  ];
  qs.forEach((q, i) => {
    const y = 1.95 + i * 0.78;
    numCircle(s, 0.6, y + 0.05, 0.6, i + 1, [RED, BLUE, YELLOW, BLACK, RED][i]);
    txt(s, q, 1.4, y, 11.4, 0.75, { valign: "middle" });
  });
  txt(s, [{ text: "Intisari.  ", options: { bold: true, color: RED } }, { text: "Isu 1 dan 2 dari lingkungan eksternal, isu 3 dari posisi biaya, isu 4 dan 5 soal organisasi dan tata kelola.", options: { color: "4A4A4A" } }], 0.6, 5.95, 12.2, 0.7, { size: 20 });
  half(s, 11.6, -1.0, 2.4, YELLOW, "b");
  next(s, "Lima pertanyaan ini menjadi kriteria untuk menilai tiga alternatif.");
  pageNo(s);
  s.addNotes("Isu 1: di rute regional AirAsia menciptakan pasar baru; di KL London ia merebut penumpang dari enam maskapai mapan; elastisitas permintaan belum terbukti. Isu 2: Emirates, BA, dan MAS memperoleh laba dari kelas premium dan mampu menurunkan tarif ekonomi tanpa mengorbankan laba total. Isu 3: utang RM 6,69 miliar, ekuitas RM 1,61 miliar, kas RM 153,8 juta, pesanan 10 A350. Isu 4: literatur ambidexterity (O'Reilly dan Tushman) menyebut dua jalan, pemisahan struktural atau paduan kontekstual. Isu 5: AirAsia 16 persen (opsi 30 persen), Aero Ventures 48 persen, Virgin 16 persen, Manara dan Orix 20 persen; tata kelola hibrida khas portofolio aliansi. Azran membantah kritik dengan laba bersih RM 18 juta pada kuartal pertama 2009.");
}

// ================================================================ 15. Alternatives
{
  const s = pres.addSlide(); base(s);
  title(s, "STRATEGIC ALTERNATIVES", 4);
  const alts = [
    ["A", "FOKUS REGIONAL", RED, ["AirAsia X tetap terpisah", "Fokus pasar 3,5 jam"], "eksploitasi murni"],
    ["B", "INTEGRASI PENUH", BLUE, ["Merger AirAsia X ke AirAsia", "Feeder KL, ekspansi"], "ambidexterity kontekstual"],
    ["C", "INTEGRASI BERTAHAP", YELLOW, ["Kendali 30 persen", "Rute 4 sampai 8 jam", "Merger menunggu bukti"], "ambidexterity struktural, tata kelola hibrida"],
  ];
  alts.forEach((a, i) => {
    const x = 0.6 + i * 4.15;
    rect(s, x, 1.95, 3.95, 4.55, WHITE);
    circle(s, x + 0.25, 2.2, 0.75, a[2]);
    s.addText(a[0], { x: x + 0.25, y: 2.2, w: 0.75, h: 0.75, fontFace: HF, fontSize: 32, color: a[2] === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    heading(s, a[1], x + 1.15, 2.28, 2.7, BLACK, 28);
    txt(s, bullets(a[3]), x + 0.25, 3.2, 3.5, 2.0);
    txt(s, [{ text: "Sudut pandang. ", options: { bold: true, color: a[2] === YELLOW ? AMBER : a[2] } }, { text: a[4] }], x + 0.25, 5.25, 3.5, 1.15, { size: 20, valign: "bottom" });
  });
  next(s, "Ketiganya diuji dengan lima kriteria dari isu kunci.");
  pageNo(s);
  s.addNotes("Sesuai panduan RPKPS, alternatif dideskripsikan tanpa argumen pro dan kontra. A: AirAsia hanya penyedia jasa berbayar; modal ke Indonesia, Thailand, Vietnam, Filipina; opsi 30 persen tidak dieksekusi. B: satu perusahaan, satu neraca, satu jaringan; tiket terusan dan transfer bagasi; ekspansi Abu Dhabi, India, Seoul, Sydney. C: eksekusi opsi 30 persen dan tempatkan kendali operasional; rute 4 sampai 8 jam dengan A330, Eropa menunggu A350; merger hanya setelah empat kuartal laba dan load factor sesuai target. Sudut pandang: March (1991); O'Reilly dan Tushman (2004); Williamson (1991).");
}

// ================================================================ 16. Scorecard
{
  const s = pres.addSlide(); base(s);
  title(s, "SCORECARD", 4);
  const rows = [
    ["Kriteria", "A. Regional", "B. Penuh", "C. Bertahap"],
    ["Peluang pasar jarak jauh", ["Lemah", RED], ["Kuat", BLUE], ["Cukup", AMBER]],
    ["Daya tahan vs network carriers", ["Kuat", BLUE], ["Lemah", RED], ["Cukup", AMBER]],
    ["Keamanan finansial", ["Kuat", BLUE], ["Lemah", RED], ["Cukup", AMBER]],
    ["Eksploitasi dan eksplorasi", ["Lemah", RED], ["Cukup", AMBER], ["Kuat", BLUE]],
    ["Tata kelola dan pemegang saham", ["Cukup", AMBER], ["Cukup", AMBER], ["Kuat", BLUE]],
  ];
  const tableRows = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return { text: c, options: { bold: true, color: WHITE, fill: { color: j === 3 ? BLUE : BLACK }, fontSize: 22, align: j === 0 ? "left" : "center" } };
    if (j === 0) return { text: c, options: { bold: true, fontSize: 22, color: BLACK, fill: { color: WHITE } } };
    return { text: c[0], options: { bold: true, fontSize: 22, color: c[1], align: "center", fill: { color: j === 3 ? "E4EEF7" : WHITE } } };
  }));
  s.addTable(tableRows, { x: 0.6, y: 1.95, w: 12.1, colW: [5.0, 2.4, 2.3, 2.4], fontFace: BF, border: { type: "solid", color: CREAM, pt: 2 }, rowH: 0.62, margin: [0.04, 0.15, 0.04, 0.15], valign: "middle" });
  circle(s, 11.8, 0.55, 0.85, RED); circle(s, 10.75, 0.55, 0.85, YELLOW); circle(s, 9.7, 0.55, 0.85, BLUE);
  next(s, "Alternatif C tanpa satu pun kriteria lemah. Itulah rekomendasi kami.");
  pageNo(s);
  s.addNotes("Penilaian kualitatif dari data kasus. A: aman tetapi melepas sumber pertumbuhan dan tidak pernah membangun kompetensi rute jauh. B: menangkap seluruh peluang tetapi berhadapan langsung dengan pesaing yang bersubsidi silang dan menggabungkan armada lebar ke neraca yang sarat utang. C: menangkap rute 4 sampai 8 jam, neraca terpisah, unit eksplorasi terpisah dengan kendali dan pembelajaran mengalir ke induk, kendali sepadan dengan kepemilikan.");
}

// ================================================================ 17. Recommendation
{
  const s = pres.addSlide(); base(s);
  title(s, "RECOMMENDATION", 4, { bar: RED });
  circle(s, 0.3, 2.3, 3.4, BLUE);
  pic(s, "pilot", 0.7, 1.9, 3.6, 4.6);
  rect(s, 0.6, 6.3, 4.2, 0.12, BLACK);
  s.addText("INTEGRASI BERTAHAP: KENDALIKAN AIRASIA X, BATASI RUTE, BUKTIKAN DULU, BARU MERGER.", { x: 5.2, y: 1.95, w: 7.6, h: 1.7, fontFace: HF, fontSize: 34, color: BLACK, margin: 0, isTextBox: true, valign: "top" });
  txt(s, bullets([
    "Eksekusi opsi 30 persen dan tempatkan manajemen AirAsia",
    "Rute 4 sampai 8 jam dengan A330 sampai A350 tiba",
    "Merger hanya setelah empat kuartal laba dan arus kas positif",
  ]), 5.2, 3.9, 7.6, 2.7);
  next(s, "Rencana implementasinya: KPI, waktu, penanggung jawab.");
  pageNo(s);
  s.addNotes("Merger penuh ditetapkan sebagai keputusan berbasis bukti kinerja (evidence based), bukan sekadar keyakinan manajemen.");
}

// ================================================================ 18. Implementation plan
{
  const s = pres.addSlide(); base(s);
  title(s, "IMPLEMENTATION PLAN", 4);
  const items = [
    ["Opsi 30 persen dan tim gabungan", "Q4 2009", "CEO dan Dewan"],
    ["Rute 4 sampai 8 jam; load factor > 85%", "2010 s.d. 2011", "CEO AirAsia X"],
    ["Feeder KL; penumpang transit > 25%", "2010", "Direktur Komersial"],
    ["Hedging BBM 30 sampai 50 persen", "Segera", "CFO, Komite Risiko"],
    ["Utang/ekuitas < 3 kali sebelum A350", "2010 s.d. 2015", "CFO"],
    ["Gerbang merger: 4 kuartal laba positif", "Evaluasi 2011", "Dewan Komisaris"],
  ];
  const hdr = (t, x, w) => s.addText(t, { x, y: 1.95, w, h: 0.4, fontFace: BF, fontSize: 14, bold: true, color: "8E7F6E", charSpacing: 1.5, margin: 0, isTextBox: true, valign: "middle" });
  hdr("INISIATIF DAN KPI", 1.3, 6.2); hdr("WAKTU", 7.6, 2.4); hdr("PENANGGUNG JAWAB", 10.1, 2.7);
  items.forEach((it, i) => {
    const y = 2.45 + i * 0.68;
    rect(s, 0.6, y + 0.14, 0.42, 0.42, [RED, BLUE, YELLOW, BLACK, RED, BLUE][i]);
    s.addText(String(i + 1), { x: 0.6, y: y + 0.14, w: 0.42, h: 0.42, fontFace: HF, fontSize: 20, color: i === 2 ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    txt(s, it[0], 1.3, y, 6.2, 0.68, { size: 22, valign: "middle" });
    txt(s, it[1], 7.6, y, 2.4, 0.68, { size: 22, valign: "middle" });
    txt(s, it[2], 10.1, y, 2.7, 0.68, { size: 22, valign: "middle" });
    rect(s, 0.6, y + 0.68, 12.1, 0.02, "D9CBB8");
  });
  next(s, "Rekomendasi ini menjawab pertanyaan di slide 5. Apa pelajarannya?");
  pageNo(s);
  s.addNotes("Risiko dan mitigasi. 1: konflik kepentingan Aero Ventures, mitigasi komite independen untuk transaksi afiliasi. 2: balasan harga Emirates dan MAS, mitigasi bandara sekunder dan rute yang belum padat pesaing premium; target biaya per ASK AirAsia X di bawah 60 persen pesaing per rute. 3: kompleksitas operasi, mitigasi uji coba di tiga rute sebelum diperluas. 4: terulangnya kerugian 2008, mitigasi mandat tertulis yang disetujui dewan dan batas rugi derivatif. 5: ketergantungan sewa pesawat, mitigasi sale and leaseback dan penerbitan saham bila valuasi mendukung; kas minimal tiga bulan biaya operasi. 6: tekanan untuk mempercepat, mitigasi kriteria yang dipublikasikan ke pemegang saham. Angka target adalah usulan kelompok, bukan angka kasus.");
}

// ================================================================ 19. Lessons and discussion
{
  const s = pres.addSlide(); base(s);
  title(s, "LESSONS FOR CHAPTER 3", 4);
  const lessons = [
    "Struktur industri menjelaskan mengapa laba langka, bukan siapa yang meraihnya.",
    "Keunggulan biaya adalah sistem yang saling menopang.",
    "Pindah kelompok strategis berarti melawan model laba yang berbeda.",
    "Eksplorasi butuh unit terpisah yang tetap dikendalikan induk.",
  ];
  lessons.forEach((l, i) => {
    const y = 1.95 + i * 0.95;
    numCircle(s, 0.6, y + 0.1, 0.6, i + 1, [RED, BLUE, YELLOW, BLACK][i]);
    txt(s, l, 1.4, y, 6.4, 0.95, { valign: "middle" });
  });
  s.addText("DALAM SATU KATA: TRANSFERABILITAS.", { x: 0.6, y: 5.85, w: 7.2, h: 0.7, fontFace: HF, fontSize: 32, color: RED, margin: 0, isTextBox: true, valign: "middle" });
  rect(s, 8.4, 1.95, 4.4, 4.6, BLACK);
  pic(s, "meeting", 9.9, 0.5, 2.6, 1.95);
  txt(s, [
    { text: "UNTUK DIDISKUSIKAN", options: { fontFace: HF, fontSize: 28, color: YELLOW, breakLine: true } },
    { text: "Jika Anda Tony Fernandes pada Juli 2009 dengan kas RM 153,8 juta, setujui merger sekarang, atau tunggu bukti empat kuartal? Apa yang hilang jika menunggu?", options: { color: WHITE, fontSize: 22 } },
  ], 8.7, 2.2, 3.8, 4.1, { valign: "middle" });
  pageNo(s);
  s.addNotes("Kaitkan kembali ke Bab 3. Five Forces menunjukkan industri tidak atraktif; laba AirAsia lahir dari posisi biaya relatif. Operasi, SDM, dan merek bekerja bersama. Di rute jauh lawan AirAsia X mampu mensubsidi harga ekonomi. Lingkungan yang berubah cepat dan neraca yang lemah membuat integrasi bertahap lebih aman daripada merger penuh. Minta kelompok lain merespons pertanyaan diskusi dengan argumen berbasis data kasus.");
}

// ================================================================ 20. Thank you
{
  const s = pres.addSlide(); base(s);
  half(s, -1.6, 1.2, 4.2, RED, "r");
  circle(s, 8.6, 0.5, 3.6, YELLOW);
  rect(s, 11.9, 3.4, 1.43, 4.1, BLUE);
  dots(s, 9.9, 4.5, 2.2);
  pic(s, "a320", 6.4, 2.6, 6.4, 2.7);
  s.addText("TERIMA KASIH", { x: 3.0, y: 1.3, w: 9, h: 1.6, fontFace: HF, fontSize: 100, color: BLACK, margin: 0, isTextBox: true, valign: "middle" });
  txt(s, "thanks for watching. Kami terbuka untuk pertanyaan dan diskusi.", 3.0, 3.0, 5.5, 1.0, { color: "4A4A4A" });
  rect(s, 3.0, 5.35, 0.9, 0.08, BLACK);
  txt(s, [{ text: "KELOMPOK 3", options: { bold: true, breakLine: true, fontSize: 20 } }, { text: NAMES, options: { fontSize: 18, color: "4A4A4A" } }], 3.0, 5.55, 8.8, 1.2);
  pageNo(s);
  s.addNotes("Referensi: Grant (2010) Contemporary Strategy Analysis, Case 9, Tabel 9.1 sampai 9.5. Thompson dan Strickland (2019) Bab 3. Porter (1980). March (1991) Organization Science 2(1). O'Reilly dan Tushman (2004) Harvard Business Review 82(4). Williamson (1991) Administrative Science Quarterly 36(2). Handoko, Indarti, dan Almahendra (2014) Manajemen dalam Berbagai Perspektif. RPKPS MAN 5422 FEB UGM (2026), Lampiran 3.");
}

const out = process.argv[2] || "AirAsia_bauhaus.pptx";
pres.writeFile({ fileName: out }).then((f) => console.log("written", f));
