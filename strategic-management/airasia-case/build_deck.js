const pptxgen = require("pptxgenjs");
const path = require("path");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.author = "Kelompok 3";
pres.title = "AirAsia: The World's Lowest Cost Airline";

const IMG = (n) => path.join(__dirname, "img", n);
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
const HL = "FFE066"; // highlighter
const HF = "Bebas Neue";
const BF = "Manrope";
const BODY = 21;

let slideNo = 0;

function base(slide) { slide.background = { color: CREAM }; }
function pageNo(slide) {
  slideNo += 1;
  slide.addText(String(slideNo), { x: 12.3, y: 6.95, w: 0.6, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: BLACK, align: "right", valign: "middle", margin: 0, isTextBox: true });
}
function circle(slide, x, y, d, color) { slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } }); }
function rect(slide, x, y, w, h, color) { slide.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color }, line: { color, width: 0 } }); }
function dots(slide, x, y, d) { slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { type: "none" }, line: { color: BLACK, width: 1.5, dashType: "sysDot" } }); }
function half(slide, x, y, d, color, keep) {
  circle(slide, x, y, d, color);
  if (keep === "l") rect(slide, x + d / 2, y - 0.02, d / 2 + 0.05, d + 0.04, CREAM);
  if (keep === "r") rect(slide, x - 0.05, y - 0.02, d / 2 + 0.05, d + 0.04, CREAM);
  if (keep === "t") rect(slide, x - 0.02, y + d / 2, d + 0.04, d / 2 + 0.05, CREAM);
  if (keep === "b") rect(slide, x - 0.02, y - 0.05, d + 0.04, d / 2 + 0.05, CREAM);
}
function slide_pic_contain(slide, file, x, y, w, h) { slide.addImage({ path: IMG(file), x, y, w, h, sizing: { type: "contain", w, h } }); }
function pic(slide, file, x, y, w, h, opts) { slide.addImage(Object.assign({ path: IMG(file), x, y, w, h }, opts || {})); }
// rectangular photo block with cover sizing and a thin black frame line offset (Bauhaus feel)
function photo(slide, file, x, y, w, h, accent) {
  if (accent) rect(slide, x + 0.18, y + 0.18, w, h, accent);
  slide.addImage({ path: IMG(file), x, y, w, h, sizing: { type: "cover", w, h } });
}
function title(slide, text, opts) {
  opts = opts || {};
  if (opts.bar) {
    const w = Math.min(11.5, 0.9 + text.length * 0.34);
    rect(slide, 0.6, 0.5, w, 1.0, opts.bar);
    slide.addText(text, { x: 0.6, y: 0.5, w, h: 1.0, fontFace: HF, fontSize: 46, color: opts.bar === YELLOW ? BLACK : WHITE, valign: "middle", margin: [0, 0.3, 0, 0.3], isTextBox: true });
  } else {
    slide.addText(text, { x: 0.6, y: 0.5, w: 11.5, h: 1.0, fontFace: HF, fontSize: 58, color: BLACK, valign: "middle", margin: 0, isTextBox: true });
  }
}
function next(slide, text) {
  slide.addText([
    { text: "■  ", options: { color: RED, fontSize: 11 } },
    { text: "Selanjutnya  ", options: { bold: true, color: BLACK } },
    { text, options: { color: "4A4A4A" } },
  ], { x: 0.6, y: 6.8, w: 11.4, h: 0.45, fontFace: BF, fontSize: 16, valign: "middle", margin: 0, isTextBox: true });
}
// "**text**" => bold + yellow highlight
function rich(str, base, hlColor) {
  const runs = [];
  str.split("**").forEach((seg, i) => {
    if (!seg) return;
    runs.push({ text: seg, options: Object.assign({}, base || {}, i % 2 === 1 ? { bold: true, highlight: HL, color: hlColor || (base && base.color) || BLACK } : {}) });
  });
  return runs;
}
function txt(slide, content, x, y, w, h, opts) {
  opts = opts || {};
  const c = typeof content === "string" ? rich(content) : content;
  slide.addText(c, Object.assign({ x, y, w, h, fontFace: BF, fontSize: opts.size || BODY, color: opts.color || BLACK, margin: 0, isTextBox: true, valign: opts.valign || "top", paraSpaceAfter: opts.para }, opts.extra || {}));
}
function bl(items, opts) {
  opts = opts || {};
  const runs = [];
  items.forEach((it, i) => {
    const r = rich(it, { fontSize: opts.size || BODY, color: opts.color || BLACK });
    r[0].options.bullet = { code: opts.bul || "25A0" }; r[0].options.paraSpaceAfter = 7;
    if (i < items.length - 1) r[r.length - 1].options.breakLine = true;
    runs.push(...r);
  });
  return runs;
}
function heading(slide, text, x, y, w, color, size) {
  slide.addText(text, { x, y, w, h: 0.6, fontFace: HF, fontSize: size || 32, color: color || BLACK, margin: 0, isTextBox: true, valign: "middle" });
}
function tag(slide, x, y, w, h, word, color) {
  rect(slide, x, y, w, h, color);
  slide.addText(word, { x, y, w, h, fontFace: BF, fontSize: 14, bold: true, color: color === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true, charSpacing: 1 });
}
function numCircle(slide, x, y, d, n, color) {
  circle(slide, x, y, d, color);
  slide.addText(String(n), { x, y, w: d, h: d, fontFace: HF, fontSize: d * 44, color: color === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
function big(slide, text, x, y, w, h, color, size) {
  slide.addText(text, { x, y, w, h, fontFace: HF, fontSize: size || 60, color: color || BLACK, margin: 0, isTextBox: true, valign: "middle" });
}

const NAMES = "Tifani Puspita  |  Dara Astrini Rahayu K  |  Happy Dinithasari  |  Aslih Abnuri";

// ================================================================ 1. Title
{
  const s = pres.addSlide(); base(s);
  circle(s, 7.3, 0.5, 5.3, YELLOW);
  half(s, 9.9, 3.3, 4.2, BLUE, "l");
  dots(s, 6.5, 4.5, 3.2);
  rect(s, 12.6, 0, 0.73, 7.5, RED);
  pic(s, "aa_a320.png", 6.2, 2.3, 6.5, 2.6);
  big(s, "AIRASIA", 0.6, 0.7, 6.5, 2.0, BLACK, 124);
  big(s, "THE WORLD'S LOWEST COST AIRLINE", 0.6, 2.6, 6.5, 0.8, RED, 40);
  txt(s, "Sejauh mana **keunggulan biaya** yang dibangun di rute pendek dapat dibawa ke pasar penerbangan **jarak jauh**?", 0.6, 3.7, 5.9, 1.5);
  rect(s, 0.6, 5.5, 0.9, 0.08, BLACK);
  txt(s, [{ text: "KELOMPOK 3", options: { bold: true, breakLine: true, fontSize: 18 } }, { text: NAMES, options: { fontSize: 16, color: "4A4A4A" } }], 0.6, 5.7, 8.5, 1.1);
  pageNo(s);
  s.addNotes("Pembuka. Satu pertanyaan strategis: apakah keunggulan biaya AirAsia yang dibangun di rute pendek dapat dipindahkan ke rute jarak jauh melalui AirAsia X. Kasus Robert M. Grant (2010), data 2008 sampai pertengahan 2009.");
}

// ================================================================ 2. Roadmap
{
  const s = pres.addSlide(); base(s);
  title(s, "HOW WE READ THE CASE");
  txt(s, "Lowest cost sering dibaca sebagai kelemahan. Dibaca dengan tepat, murah adalah hasil **disiplin biaya (cost discipline)** yang sistematis. Pertanyaannya: apakah sistem itu **dapat dipindahkan (transferable)** ke rute jauh?", 0.6, 1.7, 7.4, 2.0);
  photo(s, "aa_board.jpg", 8.5, 1.65, 4.1, 2.45, YELLOW);
  const steps = [["MASALAH", "tujuan dan hambatan"], ["LINGKUNGAN", "PESTEL, Five Forces, peta pesaing"], ["POSISI BIAYA", "benchmarking, transferabilitas"], ["PILIHAN", "isu, alternatif, rekomendasi"]];
  const cols = [RED, BLUE, YELLOW, BLACK];
  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    numCircle(s, x, 4.15, 1.05, i + 1, cols[i]);
    heading(s, st[0], x, 5.3, 2.9, BLACK, 28);
    txt(s, st[1], x, 5.85, 2.9, 0.9, { color: "4A4A4A", size: 18 });
  });
  next(s, "Tahap 1 dimulai dengan mengenal AirAsia lebih dulu.");
  pageNo(s);
  s.addNotes("Urutan analisis mengikuti logika Structure Conduct Performance: struktur industri dibaca lebih dulu, baru posisi perusahaan, baru pilihan strategi. Kerangka dari Thompson dan Strickland Bab 3 serta panduan analisis kasus RPKPS. Seluruh angka bersumber dari tabel dalam kasus.");
}

// ================================================================ 3. At a glance
{
  const s = pres.addSlide(); base(s);
  title(s, "AIRASIA AT A GLANCE", { bar: RED });
  const stats = [["79", "pesawat (2009)", BLACK], ["11,8 JT", "penumpang", RED], ["10", "negara dilayani", BLUE], ["RM 1", "harga akuisisi", BLACK]];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 1.95;
    big(s, st[0], x, 1.8, 1.9, 0.9, st[2], 54);
    txt(s, st[1], x, 2.7, 1.9, 0.5, { color: "4A4A4A", size: 16 });
  });
  heading(s, "MILESTONES", 0.6, 3.4, 5);
  txt(s, [
    ...rich("**2001**   Diambil alih Fernandes dan McCarthy: **RM 1**"), { text: "", options: { breakLine: true } },
    ...rich("**2002**   Relaunch: model **Ryanair, Southwest, easyJet**"), { text: "", options: { breakLine: true } },
    ...rich("**2004**   Rute internasional pertama; IPO RM 717 juta"), { text: "", options: { breakLine: true } },
    ...rich("**2007**   AirAsia X mulai terbang **jarak jauh**"), { text: "", options: { breakLine: true } },
    ...rich("**2009**   Skytrax: **World's Best Low Cost Airline**"),
  ], 0.6, 4.0, 7.7, 2.7, { para: 4 });
  photo(s, "aa_fleet.jpg", 8.5, 1.7, 4.1, 4.6, BLUE);
  next(s, "Dibangun di rute pendek. Rute jauh memunculkan masalah baru.");
  pageNo(s);
  s.addNotes("Dari 2 pesawat dan 200 ribu penumpang (Januari 2002) menjadi 79 pesawat dan 11,8 juta penumpang (Maret 2009). Hub di KL, Bangkok, dan Jakarta. Akuisisi 2001 seharga RM 1 dengan warisan utang RM 40 juta. Riset UBS 2007: biaya per ASK terendah di dunia. ROA 2008 sebesar 4 persen ketika hampir semua maskapai dunia merugi. Foto: deretan armada AirAsia di terminal LCC.");
}

// ================================================================ 4. Strategic problem
{
  const s = pres.addSlide(); base(s);
  title(s, "THE STRATEGIC PROBLEM");
  heading(s, "TUJUAN (GOALS)", 0.6, 1.75, 3.9, RED, 30);
  txt(s, bl([
    "Menjadi maskapai **internasional**, bukan hanya regional",
    "Tetap **berbiaya terendah** di setiap rute",
    "Tumbuh lewat **rute gemuk (trunk routes)** jarak jauh",
  ]), 0.6, 2.4, 3.9, 4.0);
  rect(s, 4.75, 1.8, 0.08, 4.5, BLACK);
  heading(s, "HAMBATAN (BARRIERS)", 5.1, 1.75, 3.9, BLUE, 30);
  txt(s, bl([
    "Model LCC bertumpu pada **rute pendek, satu tipe pesawat, layanan minimal**",
    "Pesaing jarak jauh punya feeder, tiket terusan, **subsidi silang**",
    "Neraca 2008 lemah: utang **RM 6,69 miliar**, kas **RM 153,8 juta**",
  ]), 5.1, 2.4, 3.9, 4.0);
  rect(s, 9.3, 1.9, 3.4, 2.3, YELLOW);
  slide_pic_contain(s, "aa_pair.png", 9.3, 1.8, 3.4, 2.5);
  txt(s, "A320 rute pendek dan A330 rute jauh: dua pesawat, dua model bisnis.", 9.3, 4.55, 3.4, 1.3, { size: 16, color: "4A4A4A", extra: { italic: true } });
  next(s, "Tujuan yang terhalang. Pertanyaannya dirumuskan di slide berikutnya.");
  pageNo(s);
  s.addNotes("Mengikuti panduan RPKPS: masalah adalah tujuan yang terhalang. Angka neraca dari Tabel 9.1: rugi bersih RM 496,6 juta, utang RM 6,69 miliar berbanding ekuitas RM 1,61 miliar, kas RM 153,8 juta. Azran Osman-Rani (CEO AirAsia X): rute gemuk jarak jauh adalah sumber lalu lintas berikutnya.");
}

// ================================================================ 5. Strategic question
{
  const s = pres.addSlide(); base(s);
  title(s, "THE STRATEGIC QUESTION");
  txt(s, "Apakah **keunggulan biaya AirAsia dapat ditransfer** ke rute jauh, dan bagaimana menata hubungan dengan AirAsia X agar **eksplorasi (exploration)** tidak mengganggu **eksploitasi (exploitation)**?", 0.6, 1.75, 6.4, 2.6, { size: 23, extra: { bold: false } });
  txt(s, [
    { text: "Tiga pilihan manajemen, pertengahan 2009:", options: { color: RED, bold: true, breakLine: true } },
    ...bl(["Merger AirAsia X ke dalam AirAsia", "Tetap terpisah dengan kontrak layanan", "Kembali fokus ke pasar regional"]),
  ], 0.6, 4.45, 6.4, 2.2, { para: 2 });
  circle(s, 8.0, 1.5, 2.2, BLUE);
  rect(s, 7.6, 2.6, 5.3, 3.4, RED);
  slide_pic_contain(s, "aa_a330.png", 7.4, 2.4, 5.3, 3.4);
  dots(s, 11.3, 5.6, 1.6);
  next(s, "Tahap 2: membaca lingkungan eksternal lebih dulu.");
  pageNo(s);
  s.addNotes("Istilah exploration dan exploitation mengacu pada March (1991): perusahaan perlu menyeimbangkan pendalaman kompetensi yang ada dengan pencarian peluang baru. Foto: AirAsia X A330, pesawat berbadan lebar untuk rute jauh.");
}

// ================================================================ 6. PESTEL
{
  const s = pres.addSlide(); base(s);
  title(s, "PESTEL ANALYSIS", { bar: BLUE });
  const rows = [
    ["P", "Politik", "Dukungan pemerintah; rute jauh **berhadapan dengan MAS**", RED],
    ["E", "Ekonomi", "500 juta penduduk dalam 3,5 jam terbang; **BBM 47% biaya**", BLUE],
    ["S", "Sosial", "Segmen menengah **kurang terlayani**; pasar diperluas", YELLOW],
    ["T", "Teknologi", "Navitaire, yield management, ponsel; **tanpa komisi agen**", BLACK],
    ["E", "Lingkungan", "A320 baru hemat BBM; **A340 boros** di rute jauh", RED],
    ["L", "Legal", "Deregulasi rute lintas negara; **kepemilikan asing dibatasi**", BLUE],
  ];
  rows.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.85 + row * 2.4;
    circle(s, x, y, 0.72, r[3]);
    rect(s, x + 0.52, y + 0.42, 0.32, 0.32, r[3] === BLACK ? YELLOW : BLACK);
    s.addText(r[0], { x, y, w: 0.72, h: 0.72, fontFace: HF, fontSize: 28, color: r[3] === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    heading(s, r[1].toUpperCase(), x + 1.05, y + 0.05, 2.9, BLACK, 28);
    txt(s, r[2], x, y + 0.95, 3.8, 1.3);
  });
  next(s, "Peluang makro terbuka. Bisakah menjadi laba? Lihat struktur industrinya.");
  pageNo(s);
  s.addNotes("Angka 47 persen dihitung dari Tabel 9.1: bahan bakar RM 1.389,8 juta dari biaya operasi RM 2.966 juta. Simpulan PESTEL: faktor politik dan legal adalah pembentuk struktur paling kuat. Joint venture Thai AirAsia dan Indonesia AirAsia mengontrakkan operasinya kembali ke AirAsia dengan imbalan fee bulanan. Distribusi langsung memangkas komisi agen dan sulit ditiru maskapai lama.");
}

// ================================================================ 7. Five Forces
{
  const s = pres.addSlide(); base(s);
  title(s, "FIVE FORCES ANALYSIS");
  const ring = (x, y, d, color, name, level, fs) => {
    circle(s, x, y, d, color);
    s.addText([{ text: name, options: { fontFace: HF, fontSize: fs || 24, breakLine: true } }, { text: level, options: { bold: true, fontSize: 15 } }], { x: x + 0.1, y: y + 0.1, w: d - 0.2, h: d - 0.2, fontFace: BF, color: color === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
  };
  ring(2.55, 3.15, 2.0, BLACK, "RIVALITAS", "TINGGI", 28);
  ring(0.6, 1.75, 1.75, RED, "PEMASOK", "TINGGI");
  ring(4.75, 1.75, 1.75, BLUE, "PEMBELI", "TINGGI");
  ring(0.6, 4.6, 1.75, YELLOW, "PENDATANG", "SEDANG");
  ring(4.75, 4.6, 1.75, GREY, "SUBSTITUSI", "SEDANG / RENDAH", 22);
  photo(s, "aa_fuel.jpg", 7.4, 1.7, 5.3, 2.6, RED);
  txt(s, "**Industri kurang atraktif.** Laba lahir dari **posisi biaya perusahaan**, sesuai logika Structure Conduct Performance. Bahan bakar dan pesawat tidak bisa dikendalikan; yang bisa dikendalikan hanya **struktur biaya sendiri**.", 7.4, 4.6, 5.3, 2.1);
  next(s, "Laba langka. Apa yang mengubah struktur ini, dan siapa yang menang?");
  pageNo(s);
  s.addNotes("Rivalitas: banyak peniru model Southwest, MAS menekan di rute domestik. Pemasok: duopoli Airbus dan Boeing, bahan bakar mengikuti harga minyak, tarif bandara tanpa negosiasi. Pembeli: sangat peka harga, biaya berpindah nol. Pendatang baru: deregulasi dan pesawat sewaan menurunkan hambatan; penahan slot, merek, skala. Substitusi: bus, kereta, feri di rute pendek; tidak ada pengganti setara di rute antarbenua. Tahun 2008 hampir seluruh maskapai dunia merugi. Foto: pengisian bahan bakar, pos biaya terbesar dan daya tawar pemasok.");
}

// ================================================================ 8. Driving forces and KSF
{
  const s = pres.addSlide(); base(s);
  title(s, "DRIVING FORCES AND KEY SUCCESS FACTORS");
  heading(s, "KEKUATAN PENDORONG", 0.6, 1.75, 3.9, RED, 30);
  txt(s, bl(["**Deregulasi** regional", "**Distribusi langsung**", "Harga **bahan bakar**", "Kelas menengah Asia", "LCC ke rute jauh"], { bul: "25CF" }), 0.6, 2.4, 3.6, 3.9);
  heading(s, "FAKTOR KUNCI", 4.5, 1.75, 3.6, BLUE, 30);
  txt(s, bl(["**Biaya per ASK** terendah", "**Utilisasi** tinggi", "**Load factor** tinggi", "Operasi sederhana", "Merek dipercaya", "SDM produktif"], { bul: "25CF" }), 4.5, 2.4, 3.6, 3.9);
  photo(s, "aa_turnaround.jpg", 8.5, 1.75, 4.2, 3.2, YELLOW);
  txt(s, "Turnaround 25 menit: utilisasi tinggi dimulai dari kesibukan di gate.", 8.5, 5.2, 4.2, 1.2, { size: 16, color: "4A4A4A", extra: { italic: true } });
  next(s, "Tolok ukur siap. Di kelompok pesaing mana AirAsia dan AirAsia X berada?");
  pageNo(s);
  s.addNotes("Driving forces: deregulasi memungkinkan hub di Bangkok dan Jakarta lewat usaha patungan; internet dan ponsel menghapus komisi agen; kenaikan lalu penurunan tajam harga minyak 2008 merugikan maskapai yang salah posisi lindung nilai, termasuk AirAsia; kelas menengah Asia tumbuh sehingga pasar membesar; AirAsia X dan Jetstar menguji batas model di rute jauh. KSF diturunkan dari struktur industri: kalau pembeli peka harga dan pemasok kuat, penentu kemenangan adalah biaya, utilisasi, dan load factor.");
}

// ================================================================ 9. Strategic group map
{
  const s = pres.addSlide(); base(s);
  title(s, "STRATEGIC GROUP MAP");
  const ax = 0.6, ay = 2.1, aw = 7.4, ah = 4.3;
  rect(s, ax, ay + ah / 2, aw, 0.05, BLACK);
  rect(s, ax + aw / 2, ay, 0.05, ah, BLACK);
  const lab = (t, x, y, w, al) => s.addText(t, { x, y, w, h: 0.35, fontFace: BF, fontSize: 13, bold: true, color: BLACK, align: al || "left", margin: 0, isTextBox: true, charSpacing: 1 });
  lab("REGIONAL", ax, ay + ah + 0.05, 3); lab("JARAK JAUH", ax + aw - 3, ay + ah + 0.05, 3, "right"); lab("LAYANAN DAN BIAYA TINGGI", ax, ay - 0.4, 5);
  const groups = [
    { x: 4.6, y: 2.3, d: 1.85, fill: BLACK, title: "NETWORK CARRIERS", body: "Emirates, BA, MAS" },
    { x: 1.2, y: 2.4, d: 1.65, fill: BLUE, title: "FULL SERVICE", body: "MAS domestik, SIA" },
    { x: 1.2, y: 4.5, d: 1.8, fill: RED, title: "LCC REGIONAL", body: "AirAsia, Tiger, Cebu" },
    { x: 4.7, y: 4.5, d: 1.75, fill: YELLOW, title: "LCC JARAK JAUH", body: "AirAsia X" },
  ];
  groups.forEach((g) => {
    circle(s, g.x, g.y, g.d, g.fill);
    s.addText([{ text: g.title, options: { fontFace: HF, fontSize: 21, breakLine: true } }, { text: g.body, options: { fontSize: 13, bold: true } }], { x: g.x, y: g.y, w: g.d, h: g.d, fontFace: BF, color: g.fill === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: [0, 0.1, 0, 0.1], isTextBox: true });
  });
  s.addShape(pres.ShapeType.rightArrow, { x: 3.15, y: 5.2, w: 1.4, h: 0.4, fill: { color: BLACK }, line: { color: BLACK, width: 0 } });
  txt(s, "**AirAsia X pindah kelompok.** Lawannya bukan LCC lain, melainkan **network carriers** yang mampu **mensubsidi harga ekonomi** dari kelas premium.", 8.5, 1.9, 4.3, 3.0);
  dots(s, 10.6, 4.9, 2.0);
  next(s, "Tahap 2 selesai. Tahap 3: seberapa kuat posisi biaya AirAsia sendiri?");
  pageNo(s);
  s.addNotes("Hambatan mobilitas antar kelompok bukan hanya modal; yang sulit ditiru adalah budaya biaya rendah dan sistem operasi sederhana. Ruang LCC jarak jauh nyaris kosong karena rute jauh butuh pesawat berbadan lebar, kru bermalam, dan penumpang transit dari jaringan pengumpan. AirAsia X masuk membawa merek, sistem reservasi, SDM, dan disiplin biaya dari kelompok asal.");
}

// ================================================================ 10. Cost benchmarking
{
  const s = pres.addSlide(); base(s);
  title(s, "COST BENCHMARKING", { bar: YELLOW });
  rect(s, 0.6, 1.8, 6.6, 4.6, WHITE);
  s.addChart(pres.ChartType.bar, [
    { name: "AirAsia", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [11.66, 14.11] },
    { name: "Malaysia Airlines", labels: ["Biaya per ASK", "Pendapatan per ASK"], values: [22.80, 20.60] },
  ], {
    x: 0.75, y: 1.9, w: 6.3, h: 4.4, barDir: "col", barGapWidthPct: 55,
    chartColors: [RED, BLUE], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 14, dataLabelFontFace: BF, dataLabelColor: BLACK, dataLabelFormatCode: "0.00",
    catAxisLabelFontSize: 14, catAxisLabelFontFace: BF, catAxisLabelColor: BLACK,
    valAxisLabelFontSize: 12, valAxisLabelColor: GREY, valAxisMinVal: 0, valAxisMaxVal: 25, valAxisMajorUnit: 5, valGridLine: { color: "E5DED4", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "b", legendFontSize: 14, legendFontFace: BF, legendColor: BLACK,
    showTitle: true, title: "Sen ringgit per available seat kilometer, 2008", titleFontSize: 15, titleFontFace: BF, titleColor: BLACK,
  });
  big(s, "49 VS 175", 7.6, 1.8, 3.0, 0.9, RED, 42);
  txt(s, "**karyawan per pesawat** (AirAsia vs MAS)", 7.6, 2.7, 3.2, 0.8, { size: 17 });
  big(s, "75% VS 67,8%", 7.6, 3.55, 3.0, 0.9, BLUE, 42);
  txt(s, "**load factor** 2008", 7.6, 4.45, 3.2, 0.5, { size: 17 });
  pic(s, "aa_crew.png", 10.3, 2.0, 2.5, 4.4);
  txt(s, "**Separuh biaya MAS** dengan tenaga kerja yang jauh lebih ramping.", 7.6, 5.2, 2.6, 1.3, { size: 16, color: "4A4A4A", extra: { italic: true } });
  next(s, "Separuh biaya MAS. Dari mana keunggulan itu berasal?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.1. Utilisasi 11,8 vs 11,1 jam per hari; turnaround 25 menit. Karyawan per pesawat: 3.799/78 vs 19.094/109. Catatan: rugi 2008 (RM 496,6 juta) bukan karena operasi, melainkan keputusan melepas kontrak berjangka bahan bakar (rugi RM 830,2 juta). Tanpa pos itu operasi tetap laba, tetapi neraca yang sarat utang pesawat membuat ruang untuk kesalahan berikutnya sempit.");
}

// ================================================================ 11. Sources of cost advantage
{
  const s = pres.addSlide(); base(s);
  title(s, "SOURCES OF COST ADVANTAGE");
  const cols = [
    ["OPERASI ALA RYANAIR", RED, ["**Satu tipe pesawat** (A320)", "Satu kelas, **no frills**", "Titik ke titik, **25 menit**"]],
    ["SDM ALA SOUTHWEST", BLUE, ["Karyawan **multi-skill**", "Insentif **produktivitas**", "Budaya tanpa hierarki"]],
    ["MEREK ALA EASYJET", YELLOW, ["Iklan **kontra-siklus**", "Co-branding, sponsorship", "**Distribusi langsung**, IT"]],
  ];
  cols.forEach((c, i) => {
    const x = 0.6 + i * 4.1;
    rect(s, x, 1.75, 3.9, 0.65, c[1]);
    s.addText(c[0], { x, y: 1.75, w: 3.9, h: 0.65, fontFace: HF, fontSize: 26, color: c[1] === YELLOW ? BLACK : WHITE, valign: "middle", margin: [0, 0.2, 0, 0.2], isTextBox: true });
    txt(s, bl(c[2]), x, 2.55, 3.9, 1.7);
  });
  photo(s, "bw_hangar.png", 0.6, 4.5, 7.6, 1.95, BLUE);
  txt(s, "Ketiganya **saling menopang**: sebuah **sistem**, bukan satu kebijakan tunggal. Sulit ditiru, tetapi juga sulit dipindahkan sebagian.", 8.6, 4.5, 4.1, 1.95, { valign: "middle" });
  next(s, "Mana yang ikut ke rute jauh, mana yang tertinggal?");
  pageNo(s);
  s.addNotes("Formula Conor McCarthy: strategi operasi ala Ryanair, strategi SDM ala Southwest, strategi merek ala easyJet. Satu kelas: 148 kursi di 737 vs 132 pada dua kelas. ESOS untuk semua karyawan. Iklan ditingkatkan saat SARS dan bom Bali. Sponsorship Williams F1, Manchester United, wasit Premier League. CRS Navitaire terhubung ke yield management.");
}

// ================================================================ 12. Transferability
{
  const s = pres.addSlide(); base(s);
  title(s, "TRANSFERABILITY TEST");
  heading(s, "IKUT TERBAWA", 0.6, 1.75, 5.6, BLUE, 30);
  const left = [["PENUH", BLUE, "**Merek** dan reputasi"], ["PENUH", BLUE, "**Distribusi langsung** dan IT"], ["PENUH", BLUE, "**SDM** dan budaya biaya"], ["PENUH", BLUE, "Bandara sekunder (Stansted)"], ["PENUH", BLUE, "Outsourcing perawatan"], ["SEBAGIAN", YELLOW, "Pesawat hemat BBM"]];
  left.forEach((r, i) => {
    const y = 2.45 + i * 0.58;
    tag(s, 0.6, y + 0.08, 1.35, 0.4, r[0], r[1]);
    txt(s, r[2], 2.1, y, 4.0, 0.56, { valign: "middle" });
  });
  heading(s, "TIDAK TERBAWA", 6.6, 1.75, 5.6, RED, 30);
  const right = [["TIDAK", RED, "**Satu tipe pesawat**"], ["TIDAK", RED, "**Turnaround 25 menit**"], ["TIDAK", RED, "Satu kelas tanpa layanan"], ["TIDAK", RED, "Jaringan titik ke titik"]];
  right.forEach((r, i) => {
    const y = 2.45 + i * 0.58;
    tag(s, 6.6, y + 0.08, 1.35, 0.4, r[0], r[1]);
    txt(s, r[2], 8.1, y, 4.6, 0.56, { valign: "middle" });
  });
  txt(s, "Yang hilang justru **inti model LCC klasik**.", 6.6, 4.85, 2.9, 1.2);
  photo(s, "aa_transfer.jpg", 9.6, 4.75, 3.1, 1.7, YELLOW);
  next(s, "Yang terbawa bersifat organisasional. Apa kata angka di rute KL London?");
  pageNo(s);
  s.addNotes("Sumber Tabel 9.2 dan 9.4. Merek memberi kredibilitas langsung; situs web, call center, dan CRS dipakai bersama; Stansted jauh lebih murah dari Heathrow; kontrak perawatan lelang kompetitif tetap berlaku; A330 efisien tetapi A340 untuk London boros. Tidak terbawa: A320 tak mampu terbang jauh dan armada kedua menambah kompleksitas; penerbangan 12 jam dibatasi jam kerja kru dan slot; rute jauh butuh kursi premium dan makanan; rute jauh bergantung pada penumpang transit dan feeder. Foto: kru memindahkan bagasi dari A320 ke A330.");
}

// ================================================================ 13. Evidence KL London
{
  const s = pres.addSlide(); base(s);
  title(s, "EVIDENCE FROM KL TO LONDON");
  rect(s, 0.6, 1.8, 6.6, 4.6, WHITE);
  s.addChart(pres.ChartType.bar, [
    { name: "Biaya per penumpang (US$)", labels: ["AirAsia X", "BA", "MAS", "Emirates"], values: [373.14, 553.37, 589.50, 609.56] },
  ], {
    x: 0.75, y: 1.9, w: 6.3, h: 4.4, barDir: "bar", barGapWidthPct: 40,
    chartColors: [RED], showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 14, dataLabelFontFace: BF, dataLabelColor: BLACK, dataLabelFormatCode: "#,##0",
    catAxisLabelFontSize: 14, catAxisLabelFontFace: BF, catAxisLabelColor: BLACK, catAxisOrientation: "maxMin",
    valAxisLabelFontSize: 12, valAxisLabelColor: GREY, valAxisMinVal: 0, valAxisMaxVal: 700, valAxisMajorUnit: 100, valGridLine: { color: "E5DED4", size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, showTitle: true, title: "Biaya per penumpang satu arah (US$), Tabel 9.4", titleFontSize: 15, titleFontFace: BF, titleColor: BLACK,
  });
  photo(s, "aa_london.jpg", 7.6, 1.8, 5.1, 2.6, BLUE);
  big(s, "36,5%", 7.6, 4.6, 2.5, 0.8, RED, 48);
  txt(s, "**lebih murah** dari tarif pesaing", 7.6, 5.4, 2.5, 0.9, { size: 16 });
  big(s, "> 90%", 10.3, 4.6, 2.4, 0.8, BLUE, 48);
  txt(s, "**load factor** AirAsia X", 10.3, 5.4, 2.4, 0.9, { size: 16 });
  next(s, "Selisih nyata, tetapi lebih tipis: tabel belum memuat kru, perawatan, katering.");
  pageNo(s);
  s.addNotes("Tabel 9.4 tidak termasuk perawatan, depresiasi, katering, dan gaji kru; pos itu justru membesar di rute jauh. AirAsia X membawa 286 penumpang per penerbangan, pesaing 337 sampai 360. Bahan bakar per penerbangan US$79.299 vs US$159.522 untuk B747. Tarif pulang pergi KL London AirAsia X US$433,96 vs rata-rata tarif terendah pesaing US$683,68 (Tabel 9.3). Load factor jaringan lima periode (Tabel 9.5): AirAsia 77, 75, 78, 80, 75,5; Emirates 73,4 sampai 79,8; BA 67,6 sampai 71,2; MAS 69 sampai 67,8.");
}

// ================================================================ 14. Key issues
{
  const s = pres.addSlide(); base(s);
  title(s, "KEY ISSUES", { bar: BLACK });
  const qs = [
    "Apakah pasar LCC jarak jauh **cukup besar** dan kurang terlayani?",
    "Bagaimana **network carriers** akan membalas?",
    "Seberapa besar **toleransi finansial** AirAsia terhadap kegagalan?",
    "Bisakah **eksploitasi dan eksplorasi** berjalan dalam satu organisasi?",
    "Apakah **tata kelola** AirAsia X selaras dengan kepentingan AirAsia?",
  ];
  qs.forEach((q, i) => {
    const y = 1.8 + i * 0.72;
    numCircle(s, 0.6, y + 0.07, 0.52, i + 1, [RED, BLUE, YELLOW, BLACK, RED][i]);
    txt(s, q, 1.3, y, 7.0, 0.68, { valign: "middle" });
  });
  txt(s, [{ text: "Intisari.  ", options: { bold: true, color: RED } }, ...rich("Isu 1 dan 2 dari **lingkungan eksternal**, isu 3 dari **posisi biaya**, isu 4 dan 5 soal **organisasi dan tata kelola**.")], 0.6, 5.5, 7.7, 1.1, { size: 17 });
  photo(s, "aa_board.jpg", 8.7, 1.8, 4.0, 2.6, RED);
  txt(s, "Lima pertanyaan yang harus dijawab manajemen sebelum memilih.", 8.7, 4.7, 4.0, 1.2, { size: 16, color: "4A4A4A", extra: { italic: true } });
  next(s, "Lima pertanyaan ini menjadi kriteria untuk menilai tiga alternatif.");
  pageNo(s);
  s.addNotes("Isu 1: di rute regional AirAsia menciptakan pasar baru; di KL London ia merebut penumpang dari enam maskapai mapan; elastisitas permintaan belum terbukti. Isu 2: Emirates, BA, dan MAS memperoleh laba dari kelas premium dan mampu menurunkan tarif ekonomi tanpa mengorbankan laba total. Isu 3: utang RM 6,69 miliar, ekuitas RM 1,61 miliar, kas RM 153,8 juta, pesanan 10 A350. Isu 4: literatur ambidexterity (O'Reilly dan Tushman) menyebut dua jalan, pemisahan struktural atau paduan kontekstual. Isu 5: AirAsia 16 persen (opsi 30 persen), Aero Ventures 48 persen, Virgin 16 persen, Manara dan Orix 20 persen; tata kelola hibrida khas portofolio aliansi.");
}

// ================================================================ 15. Alternatives
{
  const s = pres.addSlide(); base(s);
  title(s, "STRATEGIC ALTERNATIVES");
  const alts = [
    ["A", "FOKUS REGIONAL", RED, ["AirAsia X **tetap terpisah**", "Fokus pasar **3,5 jam** terbang"], "eksploitasi murni"],
    ["B", "INTEGRASI PENUH", BLUE, ["**Merger** AirAsia X ke AirAsia", "Feeder KL, ekspansi sesuai rencana"], "ambidexterity kontekstual"],
    ["C", "INTEGRASI BERTAHAP", YELLOW, ["Kendali **30 persen**, neraca terpisah", "Rute **4 sampai 8 jam**", "Merger **menunggu bukti**"], "ambidexterity struktural, tata kelola hibrida"],
  ];
  alts.forEach((a, i) => {
    const x = 0.6 + i * 4.15;
    rect(s, x, 1.75, 3.95, 4.7, WHITE);
    circle(s, x + 0.25, 1.95, 0.7, a[2]);
    s.addText(a[0], { x: x + 0.25, y: 1.95, w: 0.7, h: 0.7, fontFace: HF, fontSize: 30, color: a[2] === YELLOW ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    heading(s, a[1], x + 1.1, 2.0, 2.8, BLACK, 26);
    txt(s, bl(a[3]), x + 0.25, 2.95, 3.5, 2.2);
    txt(s, [{ text: "Sudut pandang. ", options: { bold: true, color: a[2] === YELLOW ? AMBER : a[2] } }, { text: a[4] }], x + 0.25, 5.3, 3.5, 1.0, { size: 17, valign: "bottom" });
  });
  next(s, "Ketiganya diuji dengan lima kriteria dari isu kunci.");
  pageNo(s);
  s.addNotes("Sesuai panduan RPKPS, alternatif dideskripsikan tanpa argumen pro dan kontra. A: AirAsia hanya penyedia jasa berbayar; modal ke Indonesia, Thailand, Vietnam, Filipina; opsi 30 persen tidak dieksekusi. B: satu perusahaan, satu neraca, satu jaringan; tiket terusan dan transfer bagasi; ekspansi Abu Dhabi, India, Seoul, Sydney. C: eksekusi opsi 30 persen dan tempatkan kendali operasional; rute 4 sampai 8 jam dengan A330, Eropa menunggu A350; merger hanya setelah empat kuartal laba dan load factor sesuai target. Sudut pandang: March (1991); O'Reilly dan Tushman (2004); Williamson (1991).");
}

// ================================================================ 16. Scorecard
{
  const s = pres.addSlide(); base(s);
  title(s, "SCORECARD");
  circle(s, 9.6, 0.55, 0.9, BLUE); circle(s, 10.7, 0.55, 0.9, YELLOW); circle(s, 11.8, 0.55, 0.9, RED);
  const rows = [
    ["Kriteria", "A. Regional", "B. Penuh", "C. Bertahap"],
    ["Peluang pasar jarak jauh", ["Lemah", RED], ["Kuat", BLUE], ["Cukup", AMBER]],
    ["Daya tahan vs network carriers", ["Kuat", BLUE], ["Lemah", RED], ["Cukup", AMBER]],
    ["Keamanan finansial", ["Kuat", BLUE], ["Lemah", RED], ["Cukup", AMBER]],
    ["Eksploitasi dan eksplorasi", ["Lemah", RED], ["Cukup", AMBER], ["Kuat", BLUE]],
    ["Tata kelola dan pemegang saham", ["Cukup", AMBER], ["Cukup", AMBER], ["Kuat", BLUE]],
  ];
  const tableRows = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return { text: c, options: { bold: true, color: WHITE, fill: { color: j === 3 ? BLUE : BLACK }, fontSize: 20, align: j === 0 ? "left" : "center" } };
    if (j === 0) return { text: c, options: { bold: true, fontSize: 20, color: BLACK, fill: { color: WHITE } } };
    return { text: c[0], options: { bold: true, fontSize: 20, color: c[1], align: "center", fill: { color: j === 3 ? "E4EEF7" : WHITE } } };
  }));
  s.addTable(tableRows, { x: 0.6, y: 1.8, w: 12.1, colW: [5.0, 2.4, 2.3, 2.4], fontFace: BF, border: { type: "solid", color: CREAM, pt: 2 }, rowH: 0.6, margin: [0.04, 0.15, 0.04, 0.15], valign: "middle" });
  txt(s, "**Alternatif C** satu-satunya tanpa kriteria **lemah**: menangkap peluang tanpa mempertaruhkan neraca.", 0.6, 5.6, 12.1, 0.9, { size: 19 });
  next(s, "Alternatif C tanpa satu pun kriteria lemah. Itulah rekomendasi kami.");
  pageNo(s);
  s.addNotes("Penilaian kualitatif dari data kasus. A: aman tetapi melepas sumber pertumbuhan dan tidak pernah membangun kompetensi rute jauh. B: menangkap seluruh peluang tetapi berhadapan langsung dengan pesaing yang bersubsidi silang dan menggabungkan armada lebar ke neraca yang sarat utang. C: menangkap rute 4 sampai 8 jam, neraca terpisah, unit eksplorasi terpisah dengan kendali dan pembelajaran mengalir ke induk, kendali sepadan dengan kepemilikan.");
}

// ================================================================ 17. Recommendation
{
  const s = pres.addSlide(); base(s);
  title(s, "RECOMMENDATION", { bar: RED });
  circle(s, 0.4, 2.3, 3.4, BLUE);
  pic(s, "aa_captain.png", 0.5, 1.95, 4.2, 4.45);
  rect(s, 0.6, 6.35, 4.2, 0.1, BLACK);
  big(s, "INTEGRASI BERTAHAP: KENDALIKAN AIRASIA X, BATASI RUTE, BUKTIKAN DULU, BARU MERGER.", 5.2, 1.75, 7.6, 1.6, BLACK, 36);
  txt(s, bl([
    "Eksekusi **opsi 30 persen** dan tempatkan manajemen AirAsia",
    "Rute **4 sampai 8 jam** dengan A330 sampai A350 tiba",
    "Merger hanya setelah **empat kuartal laba** dan arus kas positif",
  ]), 5.2, 3.6, 7.6, 2.8);
  next(s, "Rencana implementasinya: KPI, waktu, penanggung jawab.");
  pageNo(s);
  s.addNotes("Merger penuh ditetapkan sebagai keputusan berbasis bukti kinerja (evidence based), bukan sekadar keyakinan manajemen.");
}

// ================================================================ 18. Implementation plan
{
  const s = pres.addSlide(); base(s);
  title(s, "IMPLEMENTATION PLAN");
  const items = [
    ["Opsi 30 persen dan tim gabungan", "Q4 2009", "CEO dan Dewan"],
    ["Rute 4 s.d. 8 jam; **load factor > 85%**", "2010 s.d. 2011", "CEO AirAsia X"],
    ["Feeder KL; transit > 25%", "2010", "Dir. Komersial"],
    ["**Hedging BBM** 30 sampai 50 persen", "Segera", "CFO, Komite Risiko"],
    ["Utang/ekuitas < 3 kali sebelum A350", "2010 s.d. 2015", "CFO"],
    ["**Gerbang merger**: 4 kuartal laba positif", "Evaluasi 2011", "Dewan Komisaris"],
  ];
  const hdr = (t, x, w) => s.addText(t, { x, y: 1.75, w, h: 0.35, fontFace: BF, fontSize: 12, bold: true, color: "8E7F6E", charSpacing: 1.5, margin: 0, isTextBox: true, valign: "middle" });
  hdr("INISIATIF DAN KPI", 1.2, 4.6); hdr("WAKTU", 5.9, 1.9); hdr("PENANGGUNG JAWAB", 7.9, 2.4);
  items.forEach((it, i) => {
    const y = 2.2 + i * 0.68;
    rect(s, 0.6, y + 0.15, 0.4, 0.4, [RED, BLUE, YELLOW, BLACK, RED, BLUE][i]);
    s.addText(String(i + 1), { x: 0.6, y: y + 0.15, w: 0.4, h: 0.4, fontFace: HF, fontSize: 19, color: i === 2 ? BLACK : WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true });
    txt(s, it[0], 1.2, y, 4.6, 0.68, { size: 18, valign: "middle" });
    txt(s, it[1], 5.9, y, 1.9, 0.68, { size: 18, valign: "middle" });
    txt(s, it[2], 7.9, y, 2.4, 0.68, { size: 18, valign: "middle" });
    rect(s, 0.6, y + 0.68, 9.7, 0.02, "D9CBB8");
  });
  photo(s, "aa_tower.jpg", 10.6, 1.75, 2.1, 4.55, BLUE);
  next(s, "Rekomendasi ini menjawab pertanyaan di slide 5. Apa pelajarannya?");
  pageNo(s);
  s.addNotes("Risiko dan mitigasi. 1: konflik kepentingan Aero Ventures, mitigasi komite independen untuk transaksi afiliasi. 2: balasan harga Emirates dan MAS, mitigasi bandara sekunder dan rute yang belum padat pesaing premium; target biaya per ASK AirAsia X di bawah 60 persen pesaing per rute. 3: kompleksitas operasi, mitigasi uji coba di tiga rute sebelum diperluas. 4: terulangnya kerugian 2008, mitigasi mandat tertulis yang disetujui dewan dan batas rugi derivatif. 5: ketergantungan sewa pesawat, mitigasi sale and leaseback dan penerbitan saham bila valuasi mendukung; kas minimal tiga bulan biaya operasi. 6: tekanan untuk mempercepat, mitigasi kriteria yang dipublikasikan ke pemegang saham. Angka target adalah usulan kelompok, bukan angka kasus.");
}

// ================================================================ 19. Lessons and discussion
{
  const s = pres.addSlide(); base(s);
  title(s, "LESSONS FOR CHAPTER 3");
  const lessons = [
    "**Struktur industri** menjelaskan mengapa laba langka, bukan siapa yang meraihnya.",
    "Keunggulan biaya adalah **sistem yang saling menopang**.",
    "Pindah kelompok strategis berarti melawan **model laba yang berbeda**.",
    "Eksplorasi butuh **unit terpisah** yang tetap dikendalikan induk.",
  ];
  lessons.forEach((l, i) => {
    const y = 1.8 + i * 0.95;
    numCircle(s, 0.6, y + 0.12, 0.55, i + 1, [RED, BLUE, YELLOW, BLACK][i]);
    txt(s, l, 1.35, y, 6.5, 0.95, { valign: "middle" });
  });
  big(s, "DALAM SATU KATA: TRANSFERABILITAS.", 0.6, 5.7, 7.2, 0.7, RED, 32);
  rect(s, 8.4, 1.8, 4.3, 4.6, BLACK);
  pic(s, "bw_meeting.png", 9.9, 0.4, 2.6, 1.9);
  txt(s, [
    { text: "UNTUK DIDISKUSIKAN", options: { fontFace: HF, fontSize: 26, color: YELLOW, breakLine: true } },
    ...rich("Jika Anda Tony Fernandes pada Juli 2009 dengan **kas RM 153,8 juta**, setujui merger sekarang, atau **tunggu bukti empat kuartal**? Apa yang hilang jika menunggu?", { color: WHITE, fontSize: 19 }, BLACK),
  ], 8.7, 2.05, 3.8, 4.1, { valign: "middle" });
  pageNo(s);
  s.addNotes("Kaitkan kembali ke Bab 3. Five Forces menunjukkan industri tidak atraktif; laba AirAsia lahir dari posisi biaya relatif. Operasi, SDM, dan merek bekerja bersama. Di rute jauh lawan AirAsia X mampu mensubsidi harga ekonomi. Lingkungan yang berubah cepat dan neraca yang lemah membuat integrasi bertahap lebih aman daripada merger penuh.");
}

// ================================================================ 20. Thank you
{
  const s = pres.addSlide(); base(s);
  half(s, -1.6, 1.2, 4.2, RED, "r");
  circle(s, 8.6, 0.5, 3.6, YELLOW);
  rect(s, 11.9, 3.4, 1.43, 4.1, BLUE);
  dots(s, 9.6, 4.0, 2.4);
  pic(s, "aa_a320.png", 6.4, 2.6, 6.4, 2.55);
  big(s, "TERIMA KASIH", 3.0, 1.3, 9, 1.6, BLACK, 100);
  txt(s, "thanks for watching. Kami terbuka untuk pertanyaan dan diskusi.", 3.0, 3.0, 5.2, 1.0, { color: "4A4A4A" });
  rect(s, 3.0, 5.35, 0.9, 0.08, BLACK);
  txt(s, [{ text: "KELOMPOK 3", options: { bold: true, breakLine: true, fontSize: 18 } }, { text: NAMES, options: { fontSize: 16, color: "4A4A4A" } }], 3.0, 5.55, 8.8, 1.1);
  pageNo(s);
  s.addNotes("Referensi: Grant (2010) Contemporary Strategy Analysis, Case 9, Tabel 9.1 sampai 9.5. Thompson dan Strickland (2019) Bab 3. Porter (1980). March (1991) Organization Science 2(1). O'Reilly dan Tushman (2004) Harvard Business Review 82(4). Williamson (1991) Administrative Science Quarterly 36(2). Handoko, Indarti, dan Almahendra (2014) Manajemen dalam Berbagai Perspektif. RPKPS MAN 5422 FEB UGM (2026), Lampiran 3.");
}

const out = process.argv[2] || "AirAsia_bauhaus2.pptx";
pres.writeFile({ fileName: out }).then((f) => console.log("written", f));
