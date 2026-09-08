// AirAsia case deck. Bauhaus layout modelled on the reference "Presentation on Bauhaus school".
// Photos are pre-cropped with PIL to the exact box ratio (no stretching); cutouts keep their native ratio.
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
pres.author = "Kelompok 3";
pres.title = "AirAsia: The World's Lowest Cost Airline";

const IMGDIR = path.join(__dirname, "img");
const IMG = (n) => path.join(IMGDIR, n);
const SIZES = JSON.parse(fs.readFileSync(path.join(IMGDIR, "sizes.json"), "utf8"));

// palette: reference cream / yellow / blue / black, AirAsia red
const CREAM = "F6E4D0", RED = "E4002B", YELLOW = "FAD354", BLUE = "3B8DBD", BLACK = "1E1E1E", WHITE = "FFFFFF", INK = "2A2A2A", GREY = "7A7069", AMBER = "B8860B";
// one type scale for the whole deck
const TF = "Poppins SemiBold", BF = "Poppins";
const TITLE = 24, SUB = 12, BODY = 14, NUM = 40, HERO = 60, MARK = 24;
const W = 13.33, H = 7.5;

// ---------------------------------------------------------------- shapes
function base(s) { s.background = { color: CREAM }; }
function rect(s, x, y, w, h, color, opts) {
  s.addShape(pres.ShapeType.rect, Object.assign({ x, y, w, h, fill: { color }, line: { color, width: 0 } }, opts || {}));
}
function circle(s, x, y, d, color) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } });
}
function ring(s, x, y, d, color, width) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { type: "none" }, line: { color: color || BLACK, width: width || 1.5 } });
}
function pie(s, x, y, d, color, range) {
  s.addShape(pres.ShapeType.pie, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 }, angleRange: range });
}
function arcDots(s, x, y, w, h, range, color) {
  s.addShape(pres.ShapeType.arc, { x, y, w, h, fill: { type: "none" }, line: { color: color || BLACK, width: 2.25, dashType: "sysDot" }, angleRange: range });
}
function tri(s, x, y, w, h, color, rot) {
  s.addShape(pres.ShapeType.triangle, { x, y, w, h, fill: { color }, line: { color, width: 0 }, rotate: rot || 0 });
}
function stripes(s, x, y, w, h, color, n) {
  rect(s, x, y, w, h, color);
  const cnt = n || 7, sw = w / (cnt * 2 + 1);
  for (let i = 0; i < cnt; i++) rect(s, x + sw * (2 * i + 1), y, sw * 0.55, h, CREAM);
}
function dotLine(s, x, y, w, color) {
  s.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: { color: color || BLACK, width: 2, dashType: "sysDot" } });
}

// ---------------------------------------------------------------- images (never stretched)
function photo(s, file, x, y, w, h, anchor) {
  anchor = anchor || "0.5,0.5";
  const key = file.replace(/\.(png|jpg)$/, "") + "_" + w.toFixed(2) + "x" + h.toFixed(2) + "_" + anchor.replace(",", "-") + ".jpg";
  const dst = path.join(IMGDIR, "crops", key);
  if (!fs.existsSync(dst)) execSync(`python3 "${path.join(__dirname, "crop.py")}" "${IMG(file)}" "${dst}" ${w} ${h} ${anchor}`);
  s.addImage({ path: dst, x, y, w, h });
}
// fit a cutout inside a box, keeping its native ratio
function cut(s, file, x, y, w, h, align, rot) {
  const [iw, ih] = SIZES[file];
  const r = iw / ih;
  let cw = w, ch = w / r;
  if (ch > h) { ch = h; cw = h * r; }
  const cx = x + (w - cw) / 2;
  let cy = y + (h - ch) / 2;
  if (align === "bottom") cy = y + h - ch;
  if (align === "top") cy = y;
  s.addImage({ path: IMG(file), x: cx, y: cy, w: cw, h: ch, rotate: rot || 0 });
  return { x: cx, y: cy, w: cw, h: ch };
}
// AirAsia ornament: dotted flight path with a small aircraft silhouette on it
function flightPath(s, x, y, w, h, range, theta, opts) {
  opts = opts || {};
  arcDots(s, x, y, w, h, range, opts.line);
  const cx = x + w / 2, cy = y + h / 2, t = (theta * Math.PI) / 180;
  const px = cx + (w / 2) * Math.cos(t), py = cy + (h / 2) * Math.sin(t);
  const pw = opts.size || 0.9;
  const file = opts.file || "sil_red.png";
  const [iw, ih] = SIZES[file];
  const ph = pw * ih / iw;
  let rot = (theta - 90 + (opts.ccw ? 180 : 0)) % 360; if (rot < 0) rot += 360;
  s.addImage({ path: IMG(file), x: px - pw / 2, y: py - ph / 2, w: pw, h: ph, rotate: rot });
}
function plane(s, file, x, y, w, rot, flip) {
  const [iw, ih] = SIZES[file];
  s.addImage({ path: IMG(file), x, y, w, h: w * ih / iw, rotate: rot || 0, flipH: !!flip });
}

// ---------------------------------------------------------------- text
function rich(str, baseOpts) {
  const runs = [];
  str.split(/(\*\*[^*]+\*\*|\^\^[^^]+\^\^)/g).forEach((p) => {
    if (!p) return;
    const o = Object.assign({}, baseOpts || {});
    let t = p;
    if (p.startsWith("**")) { t = p.slice(2, -2); o.bold = true; }
    else if (p.startsWith("^^")) { t = p.slice(2, -2); o.bold = true; o.color = RED; }
    runs.push({ text: t, options: o });
  });
  return runs;
}
function para(s, content, x, y, w, h, o) {
  o = o || {};
  const runs = typeof content === "string" ? rich(content, { fontSize: BODY, color: o.color || INK }) : content;
  s.addText(runs, { x, y, w, h, fontFace: BF, fontSize: BODY, color: o.color || INK, margin: 0, isTextBox: true, valign: o.valign || "top", align: o.align || "left", lineSpacingMultiple: 1.2, paraSpaceAfter: o.para == null ? 6 : o.para });
}
function items(arr, o) {
  o = o || {};
  const out = [];
  arr.forEach((it, i) => {
    const r = rich(it, { fontSize: BODY, color: o.color || INK });
    r[0].options.paraSpaceAfter = o.gap == null ? 6 : o.gap;
    if (i < arr.length - 1) r[r.length - 1].options.breakLine = true;
    out.push(...r);
  });
  return out;
}
function sub(s, text, x, y, w, color, o) {
  o = o || {};
  s.addText(text, { x, y, w, h: o.h || 0.32, fontFace: TF, fontSize: SUB, color: color || BLACK, charSpacing: 1.5, margin: 0, isTextBox: true, valign: "middle", align: o.align || "left" });
}
function titleW(text) { return text.length * 0.25 + 0.5; }
function title(s, text, x, y, o) {
  o = o || {};
  const fill = o.fill || WHITE;
  s.addText(text, { x, y, w: o.w || titleW(text), h: 0.66, fontFace: TF, fontSize: TITLE, color: o.color || (fill === WHITE ? BLACK : WHITE), charSpacing: 2, fill: { color: fill }, margin: [0, 0.2, 0, 0.2], isTextBox: true, valign: "middle" });
}
function titlePlain(s, text, x, y, w) {
  s.addText(text, { x, y, w, h: 1.3, fontFace: TF, fontSize: TITLE, color: BLACK, charSpacing: 2, margin: 0, isTextBox: true, valign: "top", lineSpacingMultiple: 1.05 });
}
function num(s, text, x, y, w, h, color, size, o) {
  o = o || {};
  s.addText(text, { x, y, w, h, fontFace: TF, fontSize: size || NUM, color: color || BLACK, margin: 0, isTextBox: true, valign: o.valign || "middle", align: o.align || "left", charSpacing: o.cs || 0 });
}
function mark(s, text, x, y, d, color, size) {
  s.addText(text, { x, y, w: d, h: d, fontFace: TF, fontSize: size || SUB, color, align: "center", valign: "middle", margin: 0, isTextBox: true });
}
function numDisc(s, x, y, d, n, color) {
  circle(s, x, y, d, color);
  mark(s, String(n), x, y, d, color === YELLOW ? BLACK : WHITE);
}
// composite Bauhaus icon with a number or letter
function icon(s, x, y, kind, m, d) {
  d = d || 0.85;
  const k = kind % 6;
  let c = YELLOW, tx = x, ty = y, td = d;
  if (k === 0) { rect(s, x + 0.2, y, d, d, RED); tri(s, x, y + 0.05, d * 0.62, d * 0.62, BLACK, 300); tx = x + 0.2; }
  else if (k === 1) { rect(s, x + 0.45, y - 0.05, d * 0.75, d * 0.75, RED); circle(s, x, y + 0.15, d, BLUE); ty = y + 0.15; }
  else if (k === 2) { tri(s, x + 0.1, y, d, d, BLACK); tri(s, x, y + d * 0.55, d * 0.5, d * 0.45, YELLOW); tx = x + 0.1; }
  else if (k === 3) { circle(s, x, y, d, BLUE); circle(s, x + d * 0.55, y + d * 0.35, d * 0.65, RED); }
  else if (k === 4) { rect(s, x + 0.25, y - 0.05, d * 0.7, d * 0.7, WHITE); rect(s, x, y + d * 0.55, d * 0.9, d * 0.45, BLACK); tx = x + 0.25; ty = y - 0.05; c = BLACK; td = d * 0.7; }
  else { circle(s, x + 0.15, y + 0.25, d, YELLOW); circle(s, x + 0.55, y - 0.05, d * 0.55, BLUE); tx = x + 0.15; ty = y + 0.25; c = RED; }
  mark(s, m, tx, ty, td, c, MARK);
}

const TEAM = [
  "Aslih Abnuri (25/574338/PEK/31801)",
  "Tifani Puspita (25/574443/PEK/31851)",
  "Happy Dinithasari (25/574400/PEK/31831)",
  "Dara Astrini Rahayu K (25/574437/PEK/31847)",
];
function team(s, x, y, w) {
  sub(s, "KELOMPOK 3", x, y, w, BLACK);
  para(s, items(TEAM, { gap: 2 }), x, y + 0.38, w, 1.6);
}

let N = 0;
function slide() { const s = pres.addSlide(); base(s); N++; return s; }

// ================================================================ 1. Cover
{
  const s = slide();
  photo(s, "aa_fleet.jpg", 0, 0, 8.1, H, "0.45,0.5");
  pie(s, 0.7, 0.85, 3.3, RED, [180, 360]);
  circle(s, 3.35, 1.55, 2.7, YELLOW);
  num(s, "2001", 1.15, 0.55, 3.0, 1.0, BLACK, HERO);
  rect(s, 3.55, 1.55, 0.5, 0.07, BLACK);
  num(s, "2009", 4.2, 1.15, 3.2, 1.0, BLACK, HERO);
  // right column
  plane(s, "sil_red.png", 11.05, 0.55, 1.05, 0);
  dotLine(s, 12.15, 0.78, 1.2, BLACK);
  num(s, "AIRASIA", 8.6, 1.35, 4.5, 0.8, BLACK, 44, { cs: 3 });
  sub(s, "THE WORLD'S LOWEST COST AIRLINE", 8.6, 2.15, 4.5, RED);
  para(s, "Sejauh mana **keunggulan biaya** yang dibangun di rute pendek dapat dibawa ke pasar penerbangan **jarak jauh**?", 8.6, 2.75, 4.2, 1.6);
  rect(s, 8.6, 4.5, 0.6, 0.06, BLACK);
  team(s, 8.6, 4.75, 4.6);
  s.addNotes("Pembuka. Satu pertanyaan strategis: apakah keunggulan biaya AirAsia yang dibangun di rute pendek dapat dipindahkan ke rute jarak jauh melalui AirAsia X. Kasus Robert M. Grant (2010), Case 9, data 2008 sampai pertengahan 2009. Angka 2001 sampai 2009 adalah rentang waktu kasus: dari akuisisi RM 1 sampai keputusan tentang AirAsia X.");
}

// ================================================================ 2. How we read the case
{
  const s = slide();
  title(s, "HOW WE READ THE CASE", 0.7, 0.6);
  para(s, "Lowest cost sering dibaca sebagai kelemahan. Dibaca dengan tepat, murah adalah hasil **disiplin biaya (cost discipline)** yang sistematis. Pertanyaannya: apakah sistem itu ^^dapat dipindahkan (transferable)^^ ke rute jauh?", 0.7, 1.6, 7.6, 1.6);
  flightPath(s, 9.3, 0.5, 4.6, 3.4, [190, 340], 270, { size: 1.0 });
  const steps = [
    ["Masalah", "Tujuan yang terhalang dan pertanyaan strategis."],
    ["Lingkungan", "PESTEL, Five Forces, kekuatan pendorong, peta kelompok strategis."],
    ["Posisi biaya", "Benchmarking, sumber keunggulan, uji transferabilitas, bukti KL London."],
    ["Pilihan", "Isu kunci, alternatif, scorecard, rekomendasi, rencana implementasi."],
  ];
  steps.forEach((st, i) => {
    const x = 0.9 + i * 3.1;
    icon(s, x, 3.7, i, String(i + 1));
    sub(s, st[0].toUpperCase(), x, 5.0, 2.7, BLACK);
    para(s, st[1], x, 5.35, 2.6, 1.4);
  });
  s.addNotes("Kerangka dari Thompson dan Strickland Bab 3 serta panduan analisis kasus RPKPS: masalah, alternatif, isu, kesimpulan. Urutan mengikuti logika Structure Conduct Performance. Seluruh angka bersumber dari tabel dalam kasus.");
}

// ================================================================ 3. At a glance
{
  const s = slide();
  photo(s, "aa_tower.jpg", 0, 0, 4.45, 3.2, "0.5,0.55");
  photo(s, "aa_fuel.jpg", 4.45, 0, 4.44, 3.2, "0.5,0.5");
  photo(s, "aa_board.jpg", 8.89, 0, 4.44, 3.2, "0.5,0.5");
  title(s, "AIRASIA AT A GLANCE", 0.7, 3.45);
  const stats = [["79", "pesawat, 2009", BLACK], ["11,8 jt", "penumpang per tahun", RED], ["10", "negara dilayani", BLUE], ["RM 1", "harga akuisisi 2001", BLACK]];
  stats.forEach((st, i) => {
    const x = 0.7 + i * 3.1;
    num(s, st[0], x, 4.25, 2.9, 0.7, st[2]);
    para(s, st[1], x, 4.95, 2.9, 0.35, { color: GREY });
  });
  sub(s, "MILESTONES", 0.7, 5.45, 3, GREY);
  const ms = [["2001", "Diambil alih Fernandes dan McCarthy seharga **RM 1**"], ["2002", "Relaunch mengikuti **Ryanair, Southwest, easyJet**"], ["2004", "Rute internasional pertama; IPO RM 717 juta"], ["2007", "AirAsia X mulai terbang **jarak jauh**"], ["2009", "Skytrax: **World's Best Low Cost Airline**"]];
  ms.forEach((m, i) => {
    const x = 0.7 + i * 2.5;
    sub(s, m[0], x, 5.8, 1.2, RED);
    para(s, m[1], x, 6.12, 2.3, 1.2, { para: 0 });
  });
  s.addNotes("Dari 2 pesawat dan 200 ribu penumpang (Januari 2002) menjadi 79 pesawat dan 11,8 juta penumpang (Maret 2009). Hub di KL, Bangkok, dan Jakarta. Akuisisi 2001 seharga RM 1 dengan warisan utang RM 40 juta. Riset UBS 2007: biaya per ASK terendah di dunia. ROA 2008 sebesar 4 persen ketika hampir semua maskapai dunia merugi.");
}

// ================================================================ 4. Strategic problem
{
  const s = slide();
  rect(s, 5.3, 4.6, 3.3, 2.9, YELLOW);
  photo(s, "aa_transfer.jpg", 0, 0, 7.5, 5.4, "0.5,0.55");
  rect(s, W - 0.55, 0, 0.55, H, BLUE);
  title(s, "THE STRATEGIC PROBLEM", 8.05, 0.6);
  sub(s, "TUJUAN (GOALS)", 8.05, 1.55, 4, RED);
  para(s, items([
    "Menjadi maskapai **internasional**, bukan hanya regional",
    "Tetap **berbiaya terendah** di setiap rute",
    "Tumbuh lewat **rute gemuk (trunk routes)** jarak jauh",
  ]), 8.05, 1.9, 4.3, 1.9);
  sub(s, "HAMBATAN (BARRIERS)", 8.05, 3.9, 4, BLUE);
  para(s, items([
    "Model LCC bertumpu pada **rute pendek, satu tipe pesawat, layanan minimal**",
    "Pesaing jarak jauh punya feeder, tiket terusan, **subsidi silang**",
    "Neraca 2008 lemah: utang ^^RM 6,69 miliar^^, kas ^^RM 153,8 juta^^",
  ]), 8.05, 4.25, 4.3, 2.6);
  para(s, "A320 rute pendek dan A330 rute jauh: dua pesawat, dua model bisnis.", 0.7, 5.7, 4.4, 0.8, { color: GREY });
  s.addNotes("Mengikuti panduan RPKPS: masalah adalah tujuan yang terhalang. Angka neraca dari Tabel 9.1: rugi bersih RM 496,6 juta, utang RM 6,69 miliar berbanding ekuitas RM 1,61 miliar, kas RM 153,8 juta. Azran Osman-Rani (CEO AirAsia X): rute gemuk jarak jauh adalah sumber lalu lintas berikutnya.");
}

// ================================================================ 5. Strategic question
{
  const s = slide();
  circle(s, 0.2, 1.1, 3.9, BLUE);
  arcDots(s, 1.4, 2.3, 5.4, 3.4, [190, 350]);
  rect(s, 6.15, 1.3, 0.16, 4.9, BLACK);
  cut(s, "aa_a330.png", 0.3, 2.4, 5.9, 2.6);
  title(s, "THE STRATEGIC QUESTION", 6.9, 0.6);
  para(s, "Apakah **keunggulan biaya AirAsia dapat ditransfer** ke rute jauh, dan bagaimana menata hubungan dengan AirAsia X agar ^^eksplorasi (exploration)^^ tidak mengganggu ^^eksploitasi (exploitation)^^?", 6.9, 1.6, 5.7, 1.9);
  sub(s, "TIGA PILIHAN MANAJEMEN, PERTENGAHAN 2009", 6.9, 3.75, 5.7, RED);
  para(s, items(["**1**   Merger AirAsia X ke dalam AirAsia", "**2**   Tetap terpisah dengan kontrak layanan", "**3**   Kembali fokus ke pasar regional"]), 6.9, 4.15, 5.7, 1.8);
  para(s, "Eksplorasi dan eksploitasi mengacu pada March (1991): mendalami kompetensi yang ada sambil mencari peluang baru.", 6.9, 5.7, 5.7, 1.0, { color: GREY });
  s.addNotes("Istilah exploration dan exploitation mengacu pada March (1991): perusahaan perlu menyeimbangkan pendalaman kompetensi yang ada dengan pencarian peluang baru. Gambar: AirAsia X A330, pesawat berbadan lebar untuk rute jauh.");
}

// ================================================================ 6. PESTEL
{
  const s = slide();
  title(s, "PESTEL ANALYSIS", 0.7, 0.6);
  const rows = [
    ["P", "Politik", "Dukungan pemerintah; rute jauh **berhadapan dengan MAS**"],
    ["E", "Ekonomi", "500 juta penduduk dalam 3,5 jam terbang; ^^BBM 47% biaya^^"],
    ["S", "Sosial", "Segmen menengah **kurang terlayani**; pasar diperluas"],
    ["T", "Teknologi", "Navitaire, yield management, ponsel; **tanpa komisi agen**"],
    ["E", "Lingkungan", "A320 baru hemat BBM; **A340 boros** di rute jauh"],
    ["L", "Legal", "Deregulasi rute lintas negara; **kepemilikan asing dibatasi**"],
  ];
  rows.forEach((r, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.9 + col * 4.15, y = 1.7 + row * 2.7;
    icon(s, x, y, i, r[0]);
    sub(s, r[1].toUpperCase(), x, y + 1.25, 3.5, BLACK);
    para(s, r[2], x, y + 1.6, 3.5, 1.1);
  });
  flightPath(s, 10.6, -1.5, 3.2, 3.2, [40, 200], 90, { size: 0.9 });
  s.addNotes("Angka 47 persen dihitung dari Tabel 9.1: bahan bakar RM 1.389,8 juta dari biaya operasi RM 2.966 juta. Simpulan PESTEL: faktor politik dan legal adalah pembentuk struktur paling kuat. Joint venture Thai AirAsia dan Indonesia AirAsia mengontrakkan operasinya kembali ke AirAsia dengan imbalan fee bulanan. Distribusi langsung memangkas komisi agen dan sulit ditiru maskapai lama.");
}

// ================================================================ 7. Five forces
{
  const s = slide();
  s.addShape(pres.ShapeType.roundRect, { x: -0.6, y: 0.55, w: W + 0.6, h: 8.5, fill: { color: BLUE }, line: { color: BLUE, width: 0 }, rectRadius: 0.55 });
  rect(s, -0.6, 1.25, W - 0.55 + 0.6, 7.5, CREAM);
  s.addText("FIVE FORCES ANALYSIS", { x: 0.7, y: 0.55, w: 8.5, h: 0.7, fontFace: TF, fontSize: TITLE, color: WHITE, charSpacing: 2, margin: 0, isTextBox: true, valign: "middle" });
  circle(s, 0.7, 1.85, 4.4, YELLOW);
  para(s, "^^Industri kurang atraktif.^^ Laba lahir dari **posisi biaya perusahaan**, sesuai logika Structure Conduct Performance. Bahan bakar dan pesawat tidak bisa dikendalikan; yang bisa dikendalikan hanya **struktur biaya sendiri**.", 1.3, 2.55, 3.2, 3.0, { align: "center", valign: "middle" });
  const force = (x, y, d, color, name, level, tc) => {
    circle(s, x, y, d, color);
    s.addText([{ text: name, options: { fontFace: TF, fontSize: SUB, breakLine: true, charSpacing: 1 } }, { text: level, options: { fontSize: BODY } }], { x: x + 0.08, y: y + 0.08, w: d - 0.16, h: d - 0.16, fontFace: BF, color: tc || WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true, lineSpacingMultiple: 1.05 });
  };
  const cx = 8.6, cy = 3.7;
  force(cx - 1.0, cy - 1.0, 2.0, BLACK, "RIVALITAS", "tinggi");
  force(cx - 3.3, cy - 2.3, 1.75, RED, "PEMASOK", "tinggi");
  force(cx + 1.55, cy - 2.3, 1.75, BLUE, "PEMBELI", "tinggi");
  force(cx - 3.3, cy + 0.55, 1.75, YELLOW, "PENDATANG", "sedang", BLACK);
  ring(s, cx + 1.55, cy + 0.55, 1.75, BLACK, 1.5);
  s.addText([{ text: "SUBSTITUSI", options: { fontFace: TF, fontSize: SUB, breakLine: true, charSpacing: 1 } }, { text: "sedang / rendah", options: { fontSize: BODY } }], { x: cx + 1.63, y: cy + 0.63, w: 1.59, h: 1.59, fontFace: BF, color: BLACK, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addNotes("Rivalitas: banyak peniru model Southwest, MAS menekan di rute domestik. Pemasok: duopoli Airbus dan Boeing, bahan bakar mengikuti harga minyak, tarif bandara tanpa negosiasi. Pembeli: sangat peka harga, biaya berpindah nol. Pendatang baru: deregulasi dan pesawat sewaan menurunkan hambatan; penahan slot, merek, skala. Substitusi: bus, kereta, feri di rute pendek; tidak ada pengganti setara di rute antarbenua. Tahun 2008 hampir seluruh maskapai dunia merugi.");
}

// ================================================================ 8. Driving forces and KSF
{
  const s = slide();
  stripes(s, 6.4, 0, W - 6.4, 3.0, BLUE, 7);
  photo(s, "aa_turnaround.jpg", 6.4, 3.0, W - 6.4, 4.5, "0.5,0.6");
  titlePlain(s, "DRIVING FORCES\nAND KEY SUCCESS FACTORS", 0.7, 0.9, 5.5);
  sub(s, "KEKUATAN PENDORONG", 0.7, 2.55, 2.7, RED);
  para(s, items(["**Deregulasi** regional", "**Distribusi langsung**", "Harga **bahan bakar**", "Kelas menengah Asia", "LCC ke rute jauh"]), 0.7, 2.95, 2.6, 3.0);
  sub(s, "FAKTOR KUNCI", 3.6, 2.55, 2.7, BLUE);
  para(s, items(["**Biaya per ASK** terendah", "**Utilisasi** tinggi", "**Load factor** tinggi", "Operasi sederhana", "Merek dipercaya", "SDM produktif"]), 3.6, 2.95, 2.7, 3.4);
  para(s, "Turnaround 25 menit: utilisasi tinggi dimulai dari kesibukan di gate.", 0.7, 6.35, 5.5, 0.8, { color: GREY });
  s.addNotes("Driving forces: deregulasi memungkinkan hub di Bangkok dan Jakarta lewat usaha patungan; internet dan ponsel menghapus komisi agen; kenaikan lalu penurunan tajam harga minyak 2008 merugikan maskapai yang salah posisi lindung nilai, termasuk AirAsia; kelas menengah Asia tumbuh sehingga pasar membesar; AirAsia X dan Jetstar menguji batas model di rute jauh. KSF diturunkan dari struktur industri: kalau pembeli peka harga dan pemasok kuat, penentu kemenangan adalah biaya, utilisasi, dan load factor.");
}

// ================================================================ 9. Strategic group map
{
  const s = slide();
  title(s, "STRATEGIC GROUP MAP", 0.7, 0.6);
  const ax = 1.0, ay = 1.6, aw = 7.0, ah = 4.9;
  rect(s, ax, ay + ah, aw, 0.03, BLACK);
  rect(s, ax, ay, 0.03, ah, BLACK);
  sub(s, "REGIONAL", ax + 0.2, ay + ah + 0.1, 3, GREY);
  sub(s, "JARAK JAUH", ax + aw - 3.2, ay + ah + 0.1, 3, GREY, { align: "right" });
  s.addText("LAYANAN DAN BIAYA", { x: ax - 1.85, y: ay + 1.4, w: 3.4, h: 0.32, fontFace: TF, fontSize: SUB, color: GREY, charSpacing: 1.5, rotate: 270, margin: 0, isTextBox: true, align: "center" });
  const d = 2.15;
  const gx = [ax + aw * 0.27 - d / 2, ax + aw * 0.73 - d / 2], gy = [ay + ah * 0.27 - d / 2, ay + ah * 0.73 - d / 2];
  const g = (col, row, fill, name, body, tc) => {
    circle(s, gx[col], gy[row], d, fill);
    s.addText([{ text: name, options: { fontFace: TF, fontSize: SUB, breakLine: true, charSpacing: 1 } }, { text: body, options: { fontSize: BODY } }], { x: gx[col] + 0.12, y: gy[row] + 0.12, w: d - 0.24, h: d - 0.24, fontFace: BF, color: tc || WHITE, align: "center", valign: "middle", margin: 0, isTextBox: true, lineSpacingMultiple: 1.05 });
  };
  g(0, 0, BLUE, "FULL SERVICE", "MAS domestik, SIA");
  g(1, 0, BLACK, "NETWORK CARRIERS", "Emirates, BA, MAS");
  g(0, 1, RED, "LCC REGIONAL", "AirAsia, Tiger, Cebu");
  ring(s, gx[1] - 0.15, gy[1] - 0.15, d + 0.3, BLACK, 1.5);
  g(1, 1, YELLOW, "LCC JARAK JAUH", "AirAsia X", BLACK);
  // AirAsia X moves from the regional group to the long-haul group
  const cym = gy[1] + d / 2;
  dotLine(s, gx[0] + d + 0.05, cym, gx[1] - gx[0] - d - 0.1, BLACK);
  plane(s, "sil_red.png", gx[0] + d + 0.12, cym - 0.36, 0.85, 0, true);
  para(s, "^^AirAsia X pindah kelompok.^^ Lawannya bukan LCC lain, melainkan **network carriers** yang mampu **mensubsidi harga ekonomi** dari kelas premium.", 8.9, 1.7, 3.8, 2.4);
  para(s, "Hambatan mobilitas antar kelompok bukan hanya modal. Yang sulit ditiru adalah budaya biaya rendah dan sistem operasi sederhana.", 8.9, 4.2, 3.8, 1.8, { color: GREY });
  s.addNotes("Ruang LCC jarak jauh nyaris kosong karena rute jauh butuh pesawat berbadan lebar, kru bermalam, dan penumpang transit dari jaringan pengumpan. AirAsia X masuk membawa merek, sistem reservasi, SDM, dan disiplin biaya dari kelompok asal.");
}

// ================================================================ 10. Cost benchmarking
{
  const s = slide();
  arcDots(s, -2.7, 2.4, 3.2, 3.2, [300, 420]);
  title(s, "COST BENCHMARKING", 0.7, 0.6);
  sub(s, "AIRASIA BERBANDING MALAYSIA AIRLINES, 2008", 0.7, 1.5, 6, GREY);
  const stat = (y, a, b, cap) => {
    num(s, a, 0.7, y, 1.9, 0.7, RED);
    sub(s, "VS", 2.55, y + 0.2, 0.5, GREY);
    num(s, b, 3.0, y, 1.9, 0.7, BLUE);
    para(s, cap, 0.7, y + 0.7, 5.2, 0.35);
  };
  stat(1.95, "11,66", "22,80", "sen ringgit biaya per available seat kilometer");
  stat(3.2, "14,11", "20,60", "sen ringgit pendapatan per ASK");
  stat(4.45, "11,8", "11,1", "jam utilisasi pesawat per hari");
  para(s, "**Separuh biaya MAS** dengan tenaga kerja yang jauh lebih ramping. Rugi 2008 bukan dari operasi, melainkan dari pelepasan kontrak berjangka bahan bakar.", 0.7, 5.7, 5.4, 1.3);
  circle(s, 6.9, 1.15, 5.4, YELLOW);
  num(s, "49 vs 175", 7.3, 1.75, 3.6, 0.7, BLACK);
  para(s, "**karyawan per pesawat**", 7.3, 2.5, 3.6, 0.35);
  num(s, "75% vs 67,8%", 7.3, 3.1, 4.4, 0.7, BLACK);
  para(s, "**load factor** 2008", 7.3, 3.85, 3.6, 0.35);
  cut(s, "aa_crew.png", 8.5, 4.3, 4.7, 3.2, "bottom");
  s.addNotes("Sumber Tabel 9.1. Karyawan per pesawat: 3.799/78 vs 19.094/109. Turnaround 25 menit. Rugi 2008 (RM 496,6 juta) karena keputusan melepas kontrak berjangka bahan bakar (rugi RM 830,2 juta). Tanpa pos itu operasi tetap laba, tetapi neraca yang sarat utang pesawat membuat ruang untuk kesalahan berikutnya sempit.");
}

// ================================================================ 11. Sources of cost advantage
{
  const s = slide();
  title(s, "SOURCES OF", 0.7, 0.6);
  title(s, "COST ADVANTAGE", 0.7, 1.26, { fill: RED });
  para(s, items([
    "**Operasi ala Ryanair.** Satu tipe pesawat (A320), satu kelas, no frills, titik ke titik, turnaround 25 menit.",
    "**SDM ala Southwest.** Karyawan multi-skill, insentif produktivitas, budaya tanpa hierarki.",
    "**Merek ala easyJet.** Iklan kontra-siklus, co-branding, sponsorship, distribusi langsung dan IT.",
  ], { gap: 8 }), 0.7, 2.25, 4.5, 3.4);
  para(s, "Ketiganya ^^saling menopang^^: sebuah sistem, bukan satu kebijakan tunggal. Sulit ditiru, tetapi juga sulit dipindahkan sebagian.", 0.7, 5.7, 4.5, 1.3);
  // poster collage
  rect(s, 10.55, 4.35, 0.08, 2.4, RED); rect(s, 10.55, 6.67, 2.9, 0.08, RED);
  rect(s, 5.6, 2.75, 2.75, 3.55, WHITE); photo(s, "bw_hangar.png", 5.75, 2.9, 2.45, 2.85, "0.5,0.5"); sub(s, "OPERASI", 5.75, 5.82, 2.4, BLACK);
  rect(s, 7.75, 1.6, 3.1, 4.2, WHITE); rect(s, 7.9, 1.75, 2.8, 3.45, YELLOW); cut(s, "aa_crew.png", 7.95, 2.0, 2.7, 3.15, "bottom"); sub(s, "SDM", 7.9, 5.32, 2.5, BLACK);
  rect(s, 10.45, 1.05, 2.5, 3.4, WHITE); rect(s, 10.6, 1.2, 2.2, 2.7, RED); cut(s, "aa_a320.png", 10.25, 1.85, 3.0, 1.4); sub(s, "MEREK", 10.6, 3.97, 2.3, BLACK);
  s.addNotes("Formula Conor McCarthy: strategi operasi ala Ryanair, strategi SDM ala Southwest, strategi merek ala easyJet. Satu kelas: 148 kursi di 737 vs 132 pada dua kelas. ESOS untuk semua karyawan. Iklan ditingkatkan saat SARS dan bom Bali. Sponsorship Williams F1, Manchester United, wasit Premier League. CRS Navitaire terhubung ke yield management.");
}

// ================================================================ 12. Transferability
{
  const s = slide();
  pie(s, 0.7, 0.9, 2.3, BLACK, [180, 360]); rect(s, 0.7, 2.05, 1.15, 2.4, BLACK);
  pie(s, 1.85, 1.75, 1.7, RED, [180, 360]); rect(s, 1.85, 2.6, 0.85, 1.85, RED);
  pie(s, 2.7, 2.5, 1.2, YELLOW, [180, 360]); rect(s, 2.7, 3.1, 0.6, 1.35, YELLOW);
  rect(s, 0.7, 4.45, 3.2, 0.05, BLACK);
  cut(s, "aa_pair.png", 0.3, 4.6, 6.4, 2.7, "bottom");
  title(s, "TRANSFERABILITY TEST", 6.9, 0.6);
  sub(s, "IKUT TERBAWA", 6.9, 1.55, 3, BLUE);
  para(s, items(["**Merek** dan reputasi", "**Distribusi langsung** dan IT", "**SDM** dan budaya biaya", "Bandara sekunder (Stansted)", "Outsourcing perawatan", "Pesawat hemat BBM (sebagian)"]), 6.9, 1.95, 2.9, 3.4);
  sub(s, "TIDAK TERBAWA", 9.95, 1.55, 3, RED);
  para(s, items(["**Satu tipe pesawat**", "**Turnaround 25 menit**", "Satu kelas tanpa layanan", "Jaringan titik ke titik"]), 9.95, 1.95, 2.8, 2.6);
  para(s, "Yang hilang justru ^^inti model LCC klasik^^. Yang terbawa bersifat organisasional: merek, sistem, dan orang.", 6.9, 5.5, 5.7, 1.2);
  s.addNotes("Sumber Tabel 9.2 dan 9.4. Merek memberi kredibilitas langsung; situs web, call center, dan CRS dipakai bersama; Stansted jauh lebih murah dari Heathrow; kontrak perawatan lelang kompetitif tetap berlaku; A330 efisien tetapi A340 untuk London boros. Tidak terbawa: A320 tak mampu terbang jauh dan armada kedua menambah kompleksitas; penerbangan 12 jam dibatasi jam kerja kru dan slot; rute jauh butuh kursi premium dan makanan; rute jauh bergantung pada penumpang transit dan feeder.");
}

// ================================================================ 13. Evidence KL to London
{
  const s = slide();
  photo(s, "aa_london.jpg", 0, 0, 7.9, H, "0.5,0.5");
  circle(s, 4.1, 0.6, 3.1, YELLOW);
  pie(s, 0.9, 1.4, 2.9, RED, [180, 360]);
  num(s, "36,5%", 1.15, 1.35, 3.0, 0.8, BLACK);
  num(s, "> 90%", 4.55, 1.05, 2.8, 0.8, BLACK);
  para(s, "**lebih murah** dari pesaing", 1.15, 2.2, 2.6, 0.5, { color: BLACK });
  para(s, "**load factor** AirAsia X", 4.55, 1.9, 2.4, 0.5, { color: BLACK });
  title(s, "EVIDENCE", 8.35, 0.6);
  title(s, "KL TO LONDON", 8.35, 1.26, { fill: RED });
  // route ornament: KUL to STN
  sub(s, "KUL", 8.35, 2.15, 0.6, BLACK);
  dotLine(s, 9.0, 2.31, 3.3, BLACK);
  plane(s, "sil_red.png", 10.1, 1.97, 1.1, 0, true);
  sub(s, "STN", 12.4, 2.15, 0.6, BLACK, { align: "right" });
  sub(s, "BIAYA PER PENUMPANG SATU ARAH, US$", 8.35, 2.62, 4.7, GREY);
  const rows = [["AirAsia X", 373, RED], ["British Airways", 553, BLACK], ["MAS", 590, BLACK], ["Emirates", 610, BLACK]];
  rows.forEach((r, i) => {
    const y = 3.0 + i * 0.62;
    sub(s, r[0], 8.35, y, 2.6, INK);
    rect(s, 8.35, y + 0.34, 3.7 * r[1] / 610, 0.22, r[2]);
    num(s, String(r[1]), 8.35 + 3.7 * r[1] / 610 + 0.1, y + 0.26, 0.8, 0.38, r[2], BODY);
  });
  para(s, "Selisih nyata, tetapi lebih tipis dari yang terlihat: Tabel 9.4 belum memuat kru, perawatan, dan katering yang justru membesar di rute jauh.", 8.35, 5.6, 4.5, 1.5);
  s.addNotes("Tabel 9.4 tidak termasuk perawatan, depresiasi, katering, dan gaji kru. AirAsia X membawa 286 penumpang per penerbangan, pesaing 337 sampai 360. Bahan bakar per penerbangan US$79.299 vs US$159.522 untuk B747. Tarif pulang pergi KL London AirAsia X US$433,96 vs rata-rata tarif terendah pesaing US$683,68 (Tabel 9.3). Load factor jaringan lima periode (Tabel 9.5): AirAsia 77, 75, 78, 80, 75,5; Emirates 73,4 sampai 79,8; BA 67,6 sampai 71,2; MAS 69 sampai 67,8.");
}

// ================================================================ 14. Key issues
{
  const s = slide();
  photo(s, "aa_board.jpg", 0, 0, W, 3.1, "0.5,0.45");
  title(s, "KEY ISSUES", 0.7, 3.35);
  const qs = [
    "Apakah pasar LCC jarak jauh **cukup besar** dan kurang terlayani?",
    "Bagaimana **network carriers** akan membalas?",
    "Seberapa besar **toleransi finansial** AirAsia terhadap kegagalan?",
    "Bisakah **eksploitasi dan eksplorasi** berjalan dalam satu organisasi?",
    "Apakah **tata kelola** AirAsia X selaras dengan kepentingan AirAsia?",
  ];
  const cols = [RED, BLUE, YELLOW, BLACK, RED];
  qs.forEach((q, i) => {
    const x = 0.7 + i * 2.5;
    numDisc(s, x, 4.25, 0.5, i + 1, cols[i]);
    para(s, q, x, 4.9, 2.25, 1.6);
  });
  para(s, [{ text: "Intisari.  ", options: { bold: true, color: RED, fontSize: BODY } }, ...rich("Isu 1 dan 2 dari **lingkungan eksternal**, isu 3 dari **posisi biaya**, isu 4 dan 5 soal **organisasi dan tata kelola**.", { fontSize: BODY, color: INK })], 0.7, 6.5, 11.5, 0.6);
  s.addNotes("Isu 1: di rute regional AirAsia menciptakan pasar baru; di KL London ia merebut penumpang dari enam maskapai mapan. Isu 2: Emirates, BA, dan MAS memperoleh laba dari kelas premium dan mampu menurunkan tarif ekonomi. Isu 3: utang RM 6,69 miliar, ekuitas RM 1,61 miliar, kas RM 153,8 juta, pesanan 10 A350. Isu 4: literatur ambidexterity (O'Reilly dan Tushman) menyebut pemisahan struktural atau paduan kontekstual. Isu 5: AirAsia 16 persen (opsi 30 persen), Aero Ventures 48 persen, Virgin 16 persen, Manara dan Orix 20 persen; tata kelola hibrida khas portofolio aliansi.");
}

// ================================================================ 15. Strategic alternatives
{
  const s = slide();
  title(s, "STRATEGIC ALTERNATIVES", 0.7, 0.6);
  arcDots(s, 3.9, 1.05, 5.4, 5.4, [200, 340]);
  const alts = [
    ["A", "FOKUS REGIONAL", RED, "aa_a320.png", "AirAsia X **tetap terpisah**; fokus pasar **3,5 jam** terbang.", "Sudut pandang: eksploitasi murni.", WHITE, RED],
    ["B", "INTEGRASI PENUH", BLUE, "aa_pair.png", "**Merger** AirAsia X ke AirAsia; feeder KL, ekspansi sesuai rencana.", "Sudut pandang: ambidexterity kontekstual.", WHITE, BLUE],
    ["C", "INTEGRASI BERTAHAP", YELLOW, "aa_a330.png", "Kendali **30 persen**, neraca terpisah; rute **4 sampai 8 jam**; merger **menunggu bukti**.", "Sudut pandang: ambidexterity struktural, tata kelola hibrida.", BLACK, AMBER],
  ];
  alts.forEach((a, i) => {
    const x = 0.7 + i * 4.15, d = 2.9;
    circle(s, x + 0.45, 1.6, d, a[2]);
    mark(s, a[0], x + 0.8, 1.85, 0.8, a[6], MARK);
    cut(s, a[3], x + 0.4, 2.95, 3.2, 1.4);
    sub(s, a[1], x, 4.7, 3.8, BLACK);
    para(s, a[4], x, 5.05, 3.7, 1.2);
    para(s, a[5], x, 6.3, 3.7, 0.8, { color: a[7] });
  });
  s.addNotes("Sesuai panduan RPKPS, alternatif dideskripsikan tanpa argumen pro dan kontra. A: AirAsia hanya penyedia jasa berbayar; modal ke Indonesia, Thailand, Vietnam, Filipina; opsi 30 persen tidak dieksekusi. B: satu perusahaan, satu neraca, satu jaringan; tiket terusan dan transfer bagasi; ekspansi Abu Dhabi, India, Seoul, Sydney. C: eksekusi opsi 30 persen dan tempatkan kendali operasional; rute 4 sampai 8 jam dengan A330, Eropa menunggu A350; merger hanya setelah empat kuartal laba dan load factor sesuai target. Sudut pandang: March (1991); O'Reilly dan Tushman (2004); Williamson (1991).");
}

// ================================================================ 16. Scorecard
{
  const s = slide();
  s.addShape(pres.ShapeType.roundRect, { x: -0.6, y: 0.55, w: W + 0.6, h: 8.5, fill: { color: BLUE }, line: { color: BLUE, width: 0 }, rectRadius: 0.55 });
  rect(s, -0.6, 1.25, W - 0.55 + 0.6, 7.5, CREAM);
  s.addText("SCORECARD", { x: 0.7, y: 0.55, w: 8.5, h: 0.7, fontFace: TF, fontSize: TITLE, color: WHITE, charSpacing: 2, margin: 0, isTextBox: true, valign: "middle" });
  const rows = [
    ["Kriteria", "A. Regional", "B. Penuh", "C. Bertahap"],
    ["Peluang pasar jarak jauh", ["Lemah", RED], ["Kuat", BLUE], ["Cukup", AMBER]],
    ["Daya tahan vs network carriers", ["Kuat", BLUE], ["Lemah", RED], ["Cukup", AMBER]],
    ["Keamanan finansial", ["Kuat", BLUE], ["Lemah", RED], ["Cukup", AMBER]],
    ["Eksploitasi dan eksplorasi", ["Lemah", RED], ["Cukup", AMBER], ["Kuat", BLUE]],
    ["Tata kelola dan pemegang saham", ["Cukup", AMBER], ["Cukup", AMBER], ["Kuat", BLUE]],
  ];
  const tableRows = rows.map((r, i) => r.map((c, j) => {
    if (i === 0) return { text: c.toUpperCase(), options: { fontFace: TF, color: j === 3 ? BLACK : WHITE, fill: { color: j === 3 ? YELLOW : BLACK }, fontSize: SUB, align: j === 0 ? "left" : "center", charSpacing: 1 } };
    if (j === 0) return { text: c, options: { fontSize: BODY, color: INK, fill: { color: WHITE } } };
    return { text: c[0], options: { bold: true, fontSize: BODY, color: c[1], align: "center", fill: { color: j === 3 ? "FBF1D6" : WHITE } } };
  }));
  s.addTable(tableRows, { x: 0.7, y: 1.7, w: 11.4, colW: [4.8, 2.2, 2.2, 2.2], fontFace: BF, border: { type: "solid", color: CREAM, pt: 3 }, rowH: 0.6, margin: [0.04, 0.15, 0.04, 0.15], valign: "middle" });
  circle(s, 0.7, 5.6, 1.0, YELLOW);
  para(s, "^^Alternatif C^^ satu-satunya tanpa kriteria **lemah**: menangkap peluang tanpa mempertaruhkan neraca. Penilaian kualitatif dari data kasus.", 2.0, 5.6, 9.5, 1.0, { valign: "middle" });
  s.addNotes("A: aman tetapi melepas sumber pertumbuhan dan tidak pernah membangun kompetensi rute jauh. B: menangkap seluruh peluang tetapi berhadapan langsung dengan pesaing yang bersubsidi silang dan menggabungkan armada lebar ke neraca yang sarat utang. C: menangkap rute 4 sampai 8 jam, neraca terpisah, unit eksplorasi terpisah dengan kendali dan pembelajaran mengalir ke induk, kendali sepadan dengan kepemilikan.");
}

// ================================================================ 17. Recommendation
{
  const s = slide();
  circle(s, 0.3, 2.0, 3.8, BLUE);
  rect(s, 5.25, 1.2, 0.16, 5.4, BLACK);
  cut(s, "aa_captain.png", 0.6, 1.9, 4.5, 5.6, "bottom");
  title(s, "RECOMMENDATION", 6.1, 0.6, { fill: RED });
  s.addText("Integrasi bertahap: kendalikan AirAsia X, batasi rute, buktikan dulu, baru merger.", { x: 6.1, y: 1.5, w: 6.6, h: 1.6, fontFace: TF, fontSize: TITLE, color: BLACK, margin: 0, isTextBox: true, valign: "top", lineSpacingMultiple: 1.1 });
  para(s, items([
    "Eksekusi ^^opsi 30 persen^^ dan tempatkan manajemen AirAsia di AirAsia X.",
    "Rute **4 sampai 8 jam** dengan A330 sampai A350 tiba.",
    "Merger hanya setelah **empat kuartal laba** dan arus kas positif.",
  ], { gap: 8 }), 6.1, 3.4, 6.4, 2.4);
  para(s, "Merger penuh menjadi keputusan berbasis bukti kinerja (evidence based), bukan sekadar keyakinan manajemen.", 6.1, 5.9, 6.4, 0.9, { color: GREY });
  s.addNotes("Merger penuh ditetapkan sebagai keputusan berbasis bukti kinerja, bukan sekadar keyakinan manajemen.");
}

// ================================================================ 18. Implementation plan
{
  const s = slide();
  stripes(s, 0, 0, 4.6, 2.6, RED, 6);
  photo(s, "aa_tower.jpg", 0, 2.6, 4.6, 4.9, "0.45,0.5");
  title(s, "IMPLEMENTATION PLAN", 5.2, 0.6);
  const plan = [
    ["Opsi 30 persen dan tim manajemen gabungan", "Q4 2009", "CEO dan Dewan"],
    ["Rute 4 sampai 8 jam; **load factor di atas 85%**", "2010 sampai 2011", "CEO AirAsia X"],
    ["Feeder KL; penumpang transit di atas 25%", "2010", "Direktur Komersial"],
    ["**Hedging BBM** 30 sampai 50 persen", "Segera", "CFO, Komite Risiko"],
    ["Utang/ekuitas di bawah 3 kali sebelum A350", "2010 sampai 2015", "CFO"],
    ["**Gerbang merger**: 4 kuartal laba positif", "Evaluasi 2011", "Dewan Komisaris"],
  ];
  sub(s, "INISIATIF DAN KPI", 5.85, 1.5, 3.6, GREY);
  sub(s, "WAKTU", 9.5, 1.5, 1.35, GREY);
  sub(s, "PENANGGUNG JAWAB", 10.95, 1.5, 2.35, GREY);
  const cols = [RED, BLUE, YELLOW, BLACK, RED, BLUE];
  plan.forEach((it, i) => {
    const y = 1.95 + i * 0.8;
    numDisc(s, 5.2, y + 0.15, 0.42, i + 1, cols[i]);
    para(s, it[0], 5.85, y, 3.6, 0.72, { valign: "middle", para: 0 });
    para(s, it[1], 9.5, y, 1.35, 0.72, { valign: "middle", color: GREY, para: 0 });
    para(s, it[2], 10.95, y, 2.35, 0.72, { valign: "middle", color: GREY, para: 0 });
    rect(s, 5.2, y + 0.74, 7.95, 0.015, "D8C9B4");
  });
  s.addNotes("Risiko dan mitigasi. 1: konflik kepentingan Aero Ventures, mitigasi komite independen untuk transaksi afiliasi. 2: balasan harga Emirates dan MAS, mitigasi bandara sekunder dan rute yang belum padat pesaing premium; target biaya per ASK AirAsia X di bawah 60 persen pesaing per rute. 3: kompleksitas operasi, mitigasi uji coba di tiga rute sebelum diperluas. 4: terulangnya kerugian 2008, mitigasi mandat tertulis yang disetujui dewan dan batas rugi derivatif. 5: ketergantungan sewa pesawat, mitigasi sale and leaseback dan penerbitan saham bila valuasi mendukung; kas minimal tiga bulan biaya operasi. 6: tekanan untuk mempercepat, mitigasi kriteria yang dipublikasikan ke pemegang saham. Angka target adalah usulan kelompok, bukan angka kasus.");
}

// ================================================================ 19. Lessons
{
  const s = slide();
  title(s, "LESSONS FOR CHAPTER 3", 0.7, 0.6);
  const lessons = [
    "**Struktur industri** menjelaskan mengapa laba langka, bukan siapa yang meraihnya.",
    "Keunggulan biaya adalah **sistem yang saling menopang**.",
    "Pindah kelompok strategis berarti melawan **model laba yang berbeda**.",
    "Eksplorasi butuh **unit terpisah** yang tetap dikendalikan induk.",
  ];
  lessons.forEach((l, i) => {
    const y = 1.6 + i * 0.95;
    numDisc(s, 0.7, y + 0.05, 0.42, i + 1, [RED, BLUE, YELLOW, BLACK][i]);
    para(s, l, 1.3, y, 5.2, 0.9);
  });
  sub(s, "DALAM SATU KATA", 0.7, 5.55, 4, GREY);
  title(s, "TRANSFERABILITAS", 0.7, 5.9, { fill: RED });
  s.addShape(pres.ShapeType.blockArc, { x: 7.7, y: 1.1, w: 6.0, h: 6.0, fill: { color: YELLOW }, line: { color: YELLOW, width: 0 }, angleRange: [100, 380] });
  cut(s, "bw_meeting.png", 7.9, 2.3, 5.4, 5.2, "bottom");
  s.addNotes("Kaitkan kembali ke Bab 3. Five Forces menunjukkan industri tidak atraktif; laba AirAsia lahir dari posisi biaya relatif. Operasi, SDM, dan merek bekerja bersama. Di rute jauh lawan AirAsia X mampu mensubsidi harga ekonomi. Lingkungan yang berubah cepat dan neraca yang lemah membuat integrasi bertahap lebih aman daripada merger penuh. Pertanyaan diskusi: jika Anda Tony Fernandes pada Juli 2009 dengan kas RM 153,8 juta, setujui merger sekarang atau tunggu bukti empat kuartal?");
}

// ================================================================ 20. Thank you
{
  const s = slide();
  pie(s, -1.9, 1.3, 4.6, RED, [270, 450]);
  circle(s, 8.3, -0.9, 4.4, YELLOW);
  rect(s, 12.4, 3.6, 0.93, 3.9, BLUE);
  arcDots(s, 6.9, 2.5, 5.6, 5.2, [182, 268]);
  plane(s, "aa_a320.png", 1.5, 4.2, 5.8, 0);
  num(s, "thank you", 3.0, 1.5, 8.5, 1.4, BLACK, HERO);
  s.addNotes("Referensi: Grant (2010) Contemporary Strategy Analysis, Case 9, Tabel 9.1 sampai 9.5. Thompson dan Strickland (2019) Bab 3. Porter (1980). March (1991) Organization Science 2(1). O'Reilly dan Tushman (2004) Harvard Business Review 82(4). Williamson (1991) Administrative Science Quarterly 36(2). Handoko, Indarti, dan Almahendra (2014) Manajemen dalam Berbagai Perspektif. RPKPS MAN 5422 FEB UGM (2026), Lampiran 3.");
}

const out = process.argv[2] || "AirAsia_v7.pptx";
pres.writeFile({ fileName: out }).then((f) => console.log("written", f, "slides:", N));
