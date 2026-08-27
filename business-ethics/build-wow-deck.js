const pptxgen = require("pptxgenjs");
const fsx = require("fs");
const AS = fsx.existsSync("assets/dims.json") ? "assets/" : "";
const GD = fsx.existsSync(AS + "grid-dark.png") ? AS : "img/";
const DIM = JSON.parse(fsx.readFileSync(AS + "dims.json", "utf8"));
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Aslih Abnuri, Arfinal Diputra, Rohana Dwi Hardianti";
pres.title = "Evaluating Business Ethics: Normative Ethical Theories";

/* ================= PALET ================= */
const BLUE = "1D1B84", PINK = "EC4899", GREEN = "00A11E";
const BLUE_D = "12105E", PINK_D = "C2185B", GREEN_D = "00761A";
const WHITE = "FFFFFF", NEAR = "13060D";
const W = 13.333, H = 7.5, M = 0.55, CW = W - 2 * M;
const HF = "Arial", BF = "Arial";
const TIM = [["Aslih Abnuri", "25/574338/PEK/31801"], ["Arfinal Diputra", "25/574664/PEK/31914"],
             ["Rohana Dwi Hardianti", "25/574077/PEK/31728"]];

/* ================= TEMA ================= */
let BG, INK, BODY, MUTE, PANEL, PANEL2, FEAT, FEATINK, FEATBODY, ACC, ACC2, HLC, GRIDF;
function theme(name) {
  if (name === "pink") {
    BG = PINK; INK = NEAR; BODY = "26060F"; MUTE = "72123F";
    PANEL = "F06CB0"; PANEL2 = "F58CC4"; FEAT = BLUE; FEATINK = WHITE; FEATBODY = "CFCEF0";
    ACC = BLUE; ACC2 = GREEN; HLC = BLUE; GRIDF = GD + "grid-ink.png";
  } else {
    BG = BLUE; INK = WHITE; BODY = "D8D7F2"; MUTE = "A5A3E0";
    PANEL = "2A278F"; PANEL2 = "15136B"; FEAT = PINK_D; FEATINK = WHITE; FEATBODY = "FBD9E8";
    ACC = PINK; ACC2 = GREEN; HLC = PINK; GRIDF = GD + "grid-dark.png";
  }
}
function slide(name) {
  theme(name || "blue");
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addImage({ path: GRIDF, x: 0, y: 0, w: W, h: H });
  return s;
}

/* ================= UTILITAS ================= */
function sizeH(n, h) { const [a, b] = DIM[n]; return [h * a / b, h]; }
function sizeW(n, w) { const [a, b] = DIM[n]; return [w, w * b / a]; }
function img(s, n, x, y, opt) {
  const o = opt || {}; let w, h;
  if (o.h) [w, h] = sizeH(n, o.h); else [w, h] = sizeW(n, o.w);
  const p = { path: `${AS}cut/${n}.png`, x, y, w, h };
  if (o.rotate) p.rotate = o.rotate;
  s.addImage(p); return [w, h];
}
function rect(s, x, y, w, h, fill, opt) {
  const o = opt || {};
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: fill },
    line: { color: o.line || fill, width: o.lw === undefined ? 0 : o.lw }, rotate: o.rotate || 0 });
}
function burst(s, x, y, w, h, fill, opt) {
  const o = opt || {};
  s.addShape(pres.ShapeType[o.shape || "irregularSeal2"], { x, y, w, h,
    fill: { color: fill }, line: { color: fill, width: 0 }, rotate: o.rotate || 0 });
}
function star(s, x, y, w, h, fill, pts, rot) {
  s.addShape(pres.ShapeType["star" + (pts || 24)], { x, y, w, h,
    fill: { color: fill }, line: { color: fill, width: 0 }, rotate: rot || 0 });
}
function sticker(s, x, y, w, h, text, opt) {
  const o = opt || {};
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: o.fill || WHITE },
    line: { color: o.border || NEAR, width: o.lw || 1.75 }, rotate: o.rotate || 0 });
  if (text) s.addText(text, { x, y, w, h, isTextBox: true, margin: 0, align: o.align || "center", valign: "middle",
    fontFace: HF, fontSize: o.size || 12, bold: true, color: o.color || NEAR,
    charSpacing: o.cs === undefined ? 0.7 : o.cs, rotate: o.rotate || 0 });
}
function tag(s, x, y, w, h, text, fill, opt) {
  const o = opt || {};
  s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, rotate: o.rotate || 0 });
  s.addText(text, { x, y, w, h, isTextBox: true, margin: 0, align: o.align || "center", valign: "middle",
    fontFace: HF, fontSize: o.size || 12, bold: true, color: o.color || WHITE,
    charSpacing: o.cs === undefined ? 1.0 : o.cs, rotate: o.rotate || 0 });
}
function txt(s, text, x, y, w, h, opt) {
  const o = opt || {};
  s.addText(text, { x, y, w, h, isTextBox: true, margin: 0, valign: o.valign || "top",
    align: o.align || "left", fontFace: o.face || BF, fontSize: o.size || 12,
    bold: !!o.bold, italic: !!o.italic, color: o.color || INK,
    charSpacing: o.cs || 0, lineSpacingMultiple: o.lh || 1.16, rotate: o.rotate || 0 });
}
/* teks kaya: "biasa" | ["tebal aksen","a"] | ["stabilo","h"] | ["hijau","g"] */
function runs(list, base) {
  return list.map(function (r) {
    if (typeof r === "string") return { text: r, options: Object.assign({}, base) };
    const o = Object.assign({}, base), st = r[1];
    if (st === "a") { o.bold = true; o.color = ACC; }
    if (st === "g") { o.bold = true; o.color = ACC2; }
    if (st === "h") { o.bold = true; o.color = WHITE; o.highlight = HLC; }
    if (st === "hg") { o.bold = true; o.color = WHITE; o.highlight = GREEN_D; }
    if (st === "w") { o.bold = true; o.color = INK; }
    if (st === "fw") { o.bold = true; o.color = WHITE; }
    return { text: r[0], options: o };
  });
}
function rich(s, list, x, y, w, h, base) {
  const b = base || {};
  s.addText(runs(list, b), { x, y, w, h, isTextBox: true, margin: 0, valign: "top",
    fontFace: BF, fontSize: b.fontSize || 10.5, color: b.color || BODY,
    lineSpacingMultiple: b.lineSpacingMultiple || 1.14 });
}
function head(s, o) {
  txt(s, o.eyebrow, M, 0.40, CW - 1.0, 0.26, { size: 10, bold: true, color: ACC, cs: 2.2, valign: "middle" });
  txt(s, o.title.toUpperCase(), M, 0.68, o.tw || CW, 0.70,
    { size: o.tsize || 29, bold: true, color: INK, cs: -0.3, valign: "middle", face: HF });
  if (o.dek) txt(s, o.dek, M, 1.44, o.dw || CW, 0.38, { size: 12, color: MUTE, lh: 1.12 });
}
function pageno(s, n) {
  s.addShape(pres.ShapeType.ellipse, { x: W - M - 0.42, y: H - 0.72, w: 0.42, h: 0.42,
    fill: { color: ACC }, line: { color: ACC, width: 0 } });
  txt(s, String(n), W - M - 0.42, H - 0.72, 0.42, 0.42,
    { size: 12, bold: true, color: WHITE, align: "center", valign: "middle", face: HF });
}
function src(s, text) {
  txt(s, text, M, H - 0.66, CW - 0.7, 0.30, { size: 8.5, italic: true, color: MUTE, valign: "middle" });
}

/* ================= 1  JUDUL ================= */
let s = slide("blue");
burst(s, 5.95, 0.45, 7.35, 5.70, PINK, { rotate: 8 });
img(s, "c-hero", 6.12, 1.10, { w: 7.15 });
txt(s, "BUSINESS ETHICS FOR SUSTAINABILITY", M, 0.86, 6.0, 0.28, { size: 11, bold: true, color: PINK, cs: 2.4, valign: "middle" });
txt(s, "EVALUATING", M, 1.20, 6.0, 0.86, { size: 46, bold: true, color: WHITE, cs: -1, valign: "middle", face: HF });
txt(s, "BUSINESS ETHICS", M, 2.00, 6.0, 0.86, { size: 46, bold: true, color: WHITE, cs: -1, valign: "middle", face: HF });
tag(s, M, 2.96, 5.15, 0.54, "NORMATIVE ETHICAL THEORIES", GREEN, { size: 15, cs: 1.4 });
rect(s, M, 3.86, 5.45, 1.86, PANEL);
tag(s, M + 0.30, 4.08, 1.75, 0.32, "DISUSUN OLEH", PINK, { size: 9.5 });
TIM.forEach(function (m, i) {
  const yy = 4.52 + i * 0.40;
  s.addText([{ text: m[0] + "   ", options: { bold: true, color: WHITE } },
             { text: m[1], options: { color: "A5A3E0" } }],
    { x: M + 0.30, y: yy, w: 4.9, h: 0.30, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10.5 });
});
star(s, 5.32, 6.02, 1.10, 1.10, GREEN, 16, 14);
txt(s, "Crane, A., Matten, D., Glozer, S., dan Spence, L. (2019). Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization. Edisi kelima. Oxford University Press, Bab 3.",
  M, 5.96, 4.60, 0.75, { size: 8.5, color: MUTE, italic: true, lh: 1.15 });
s.addNotes("Pembuka 1 menit. Bab 3 memberi sembilan kriteria penilaian, lalu kita pakai pada kasus nyata yang belum selesai. Alokasi 30 menit: 17 menit teori, 11 menit kasus, 2 menit penutup.");

/* ================= 2  SISTEMATIKA ================= */
s = slide("blue");
head(s, { eyebrow: "PETA BAHASAN", title: "Sistematika pembahasan",
  dek: "Kerangka teoretis dibangun lebih dahulu agar analisis kasus memiliki dasar penilaian yang eksplisit." });
rect(s, M, 1.98, 5.30, 4.55, PANEL);
rect(s, M + 6.95, 1.98, 5.28, 4.55, GREEN_D);
tag(s, M + 0.30, 2.22, 1.75, 0.34, "BAGIAN SATU", PINK, { size: 10 });
tag(s, M + 7.25, 2.22, 1.75, 0.34, "BAGIAN DUA", NEAR, { size: 10 });
txt(s, "KERANGKA PENILAIAN", M + 0.30, 2.66, 4.7, 0.34, { size: 17, bold: true, color: WHITE, face: HF, cs: -0.2, valign: "middle" });
txt(s, "HILIRISASI NIKEL INDONESIA", M + 7.25, 2.66, 4.7, 0.34, { size: 17, bold: true, color: WHITE, face: HF, cs: -0.2, valign: "middle" });
[["01", "Peran teori etika normatif"], ["02", "Absolutisme, relativisme, pluralisme"], ["03", "Klasifikasi sembilan teori"],
 ["04", "Lima teori modernis Barat"], ["05", "Keterbatasan teori modernis"], ["06", "Empat teori alternatif"]
].forEach(function (it, i) {
  const yy = 3.18 + i * 0.52;
  txt(s, it[0], M + 0.30, yy, 0.44, 0.30, { size: 13, bold: true, color: PINK, face: HF, valign: "middle" });
  txt(s, it[1], M + 0.80, yy, 4.3, 0.30, { size: 11.5, color: WHITE, valign: "middle" });
});
[["07", "Anatomi kebijakan dan sengketanya"], ["08", "Dua narasi atas fakta yang sama"], ["09", "Penilaian lima teori modernis"],
 ["10", "Penilaian empat teori alternatif"], ["11", "Sintesis penilaian dan evaluasi klaim"], ["12", "Simpulan dan implikasi manajerial"]
].forEach(function (it, i) {
  const yy = 3.18 + i * 0.52;
  txt(s, it[0], M + 7.25, yy, 0.44, 0.30, { size: 13, bold: true, color: "9BE8AB", face: HF, valign: "middle" });
  txt(s, it[1], M + 7.75, yy, 4.3, 0.30, { size: 11.5, color: WHITE, valign: "middle" });
});
burst(s, 5.98, 3.55, 1.55, 1.55, PINK, { rotate: 14 });
img(s, "accent-hand", 5.92, 3.95, { w: 1.68 });
pageno(s, 2);
s.addNotes("30 detik. Urutannya sengaja: kalau kasus dibahas lebih dulu, diskusi berhenti di adu data. Teori memberi alat menilai data yang sama secara berbeda.");

/* ================= 3  PERAN TEORI ================= */
s = slide("blue");
head(s, { eyebrow: "01   PERAN TEORI ETIKA NORMATIF", title: "Mengapa teori normatif diperlukan",
  dek: "Dalam ranah personal intuisi memadai. Dalam konteks bisnis, penilaian etis harus dapat dipertahankan di hadapan pemangku kepentingan." });
burst(s, 0.20, 2.20, 4.75, 4.45, GREEN, { rotate: -6 });
img(s, "accent-megaphone", 0.62, 2.70, { w: 3.95 });
sticker(s, 0.62, 2.05, 3.55, 0.46, "BUKAN SEKADAR FIRASAT", { size: 11, rotate: -3 });
rect(s, 5.05, 1.95, 7.73, 1.70, FEAT);
txt(s, "DEFINISI KONSEP", 5.35, 2.13, 7.1, 0.24, { size: 9, bold: true, color: "FBD9E8", cs: 2.0, valign: "middle" });
txt(s, "Teori etika normatif adalah aturan, pedoman, prinsip, dan pendekatan yang menentukan benar dan salah.",
  5.35, 2.44, 7.13, 0.80, { size: 16, bold: true, color: WHITE, face: HF, lh: 1.12 });
txt(s, "Crane dan Matten (2019: 87)", 5.35, 3.24, 7.13, 0.26, { size: 9.5, color: "FBD9E8", italic: true, valign: "middle" });
[["Rasionalisasi intuisi moral", ["Teori etika berfungsi ", ["merasionalkan, menjelaskan, dan memahami intuisi moral", "g"], " yang telah dimiliki mengenai benar dan salah."]],
 ["Dasar diskusi rasional", ["Teori memungkinkan ", ["diskursus rasional antarpihak yang berbeda nilai moral", "g"], ", sehingga perbedaan tidak berhenti pada tataran preferensi."]],
 ["Justifikasi keputusan bisnis", ["Keputusan bisnis menuntut ", ["dasar rasional yang sistematis", "g"], " dan dapat dipertanggungjawabkan kepada pemangku kepentingan."]]
].forEach(function (b, i) {
  const yy = 3.85 + i * 0.90;
  rect(s, 5.05, yy, 7.73, 0.82, i % 2 ? PANEL2 : PANEL);
  tag(s, 5.05, yy, 0.42, 0.82, String(i + 1), PINK, { size: 15 });
  txt(s, b[0].toUpperCase(), 5.62, yy + 0.02, 7.0, 0.28, { size: 13, bold: true, color: WHITE, face: HF, cs: -0.2, valign: "middle" });
  rich(s, b[1], 5.62, yy + 0.32, 7.0, 0.46, { fontSize: 10.5 });
});
src(s, "Crane dan Matten (2019), Bab 3, halaman 86 sampai 88."); pageno(s, 3);
s.addNotes("2 menit. Teori tidak menggantikan intuisi, ia merapikannya. Pemantik: beda antara mengatakan praktik di negara lain itu berbeda dan mengatakan praktik itu salah.");

/* ================= 4  POSISI DASAR ================= */
s = slide("pink");
head(s, { eyebrow: "02   POSISI DASAR", title: "Absolutisme, relativisme, pluralisme",
  dek: "Sebelum menerapkan teori, perlu ditetapkan seberapa luas klaim keberlakuan yang diajukan teori tersebut." });
const c3w = (CW - 0.7) / 3;
[["ABSOLUTISME ETIS", "c-spec1", "Ada prinsip moral yang universal dan abadi",
  "Benar dan salah adalah kualitas objektif yang ditentukan lewat nalar, terlepas dari keadaan. Hampir seluruh teori modernis Barat berada di sini.", 0],
 ["RELATIVISME ETIS", "c-spec2", "Moralitas bergantung konteks dan subjektif",
  "Tidak ada benar dan salah universal. Semuanya bergantung pada tradisi, keyakinan, dan praktik pihak yang memutuskan.", 0],
 ["PLURALISME ETIS", "c-spec3", "Nilai yang bertentangan dapat sama sahnya",
  "Posisi yang diambil Crane dan Matten. Pluralisme tidak menyamaratakan seluruh perspektif, tetapi juga tidak mengunggulkan satu di atasnya.", 1]
].forEach(function (c, i) {
  const x = M + i * (c3w + 0.35), dark = !!c[4];
  rect(s, x, 1.92, c3w, 4.60, dark ? BLUE : PANEL2);
  burst(s, x + c3w / 2 - 1.35, 1.98, 2.70, 2.55, dark ? GREEN : BLUE, { rotate: i * 11 });
  const iw = sizeH(c[1], 2.30)[0];
  img(s, c[1], x + c3w / 2 - iw / 2, 2.10, { h: 2.30 });
  tag(s, x + 0.28, 4.52, c3w - 0.56, 0.32, c[0], dark ? GREEN : NEAR, { size: 9.5 });
  txt(s, c[2], x + 0.28, 4.94, c3w - 0.56, 0.62, { size: 14, bold: true, face: HF, color: dark ? WHITE : NEAR, lh: 1.05, cs: -0.2 });
  txt(s, c[3], x + 0.28, 5.62, c3w - 0.56, 0.80, { size: 10.5, color: dark ? "CFCEF0" : "3A0C1F", lh: 1.14 });
});
src(s, "Crane dan Matten (2019), Bab 3, halaman 87 sampai 88. Sen (2000) dan Liu (2018)."); pageno(s, 4);
s.addNotes("1,5 menit. Pemantik: suap. Absolutis bilang selalu salah, relativis bilang tergantung negaranya, pluralis bertanya kriteria mana yang paling kuat menanggung beban argumen.");

/* ================= 5  KLASIFIKASI ================= */
s = slide("blue");
head(s, { eyebrow: "03   KLASIFIKASI TEORI", title: "Klasifikasi sembilan teori etika normatif",
  dek: "Klasifikasi pertama menilai tindakan. Klasifikasi kedua menilai pelaku, relasi, prosedur, dan bahasa." });
rect(s, M, 1.95, 7.55, 4.55, PANEL);
tag(s, M + 0.30, 2.18, 2.55, 0.34, "KLASIFIKASI I", PINK, { size: 10 });
txt(s, "TEORI MODERNIS BARAT", M + 3.00, 2.18, 4.4, 0.34, { size: 14, bold: true, face: HF, color: WHITE, valign: "middle", cs: -0.2 });
txt(s, "Berakar pada Pencerahan abad ke-18, bersifat absolutis, dan menawarkan aturan yang dapat diterapkan pada situasi apa pun.",
  M + 0.30, 2.62, 7.0, 0.50, { size: 10.5, color: BODY, lh: 1.12 });
[["KONSEKUENSIALIS", "Teleologis, menilai akibat tindakan", [["Egoism", 1], ["Utilitarianism", 2]], M + 0.30],
 ["BERBASIS PRINSIP", "Deontologis, menilai kewajiban", [["Ethics of duty", 3], ["Ethics of rights", 4], ["Justice dan social contract", 5]], M + 3.95]
].forEach(function (g) {
  rect(s, g[3], 3.24, 3.45, 1.95, PANEL2);
  txt(s, g[0], g[3] + 0.22, 3.40, 3.0, 0.26, { size: 9.5, bold: true, color: PINK, cs: 1.4, valign: "middle" });
  txt(s, g[1], g[3] + 0.22, 3.66, 3.0, 0.26, { size: 9.5, italic: true, color: MUTE, valign: "middle" });
  g[2].forEach(function (t, i) {
    const yy = 4.00 + i * 0.36;
    tag(s, g[3] + 0.22, yy, 0.28, 0.28, String(t[1]), PINK, { size: 11, cs: 0 });
    txt(s, t[0], g[3] + 0.58, yy, 2.8, 0.28, { size: 11, bold: true, color: WHITE, valign: "middle" });
  });
});
txt(s, "Seluruh teori ini bersifat normatif karena berangkat dari asumsi tentang hakikat dunia dan hakikat manusia. Penerimaan atas kesimpulannya bergantung pada penerimaan atas asumsi tersebut.",
  M + 0.30, 5.42, 5.55, 0.85, { size: 10.5, color: BODY, lh: 1.14 });
rect(s, M + 8.10, 1.95, 4.68, 4.55, GREEN_D);
tag(s, M + 8.40, 2.18, 2.55, 0.34, "KLASIFIKASI II", NEAR, { size: 10 });
txt(s, "TEORI ALTERNATIF", M + 8.40, 2.62, 4.1, 0.34, { size: 16, bold: true, face: HF, color: WHITE, valign: "middle", cs: -0.2 });
txt(s, "Cenderung relativis. Lahir dari keberatan atas klasifikasi pertama.", M + 8.40, 2.98, 4.1, 0.44, { size: 10.5, color: "C7EFD0", lh: 1.12 });
[["Virtue ethics", 6, "Karakter pelaku"], ["Ethic of care", 7, "Relasi dan tanggung jawab"],
 ["Discourse ethics", 8, "Prosedur perumusan norma"], ["Postmodern ethics", 9, "Bahasa dan dorongan moral"]
].forEach(function (t, i) {
  const yy = 3.62 + i * 0.68;
  tag(s, M + 8.40, yy, 0.32, 0.32, String(t[1]), NEAR, { size: 12, cs: 0 });
  txt(s, t[0], M + 8.82, yy - 0.02, 3.7, 0.30, { size: 12.5, bold: true, color: WHITE, valign: "middle" });
  txt(s, t[2], M + 8.82, yy + 0.28, 3.7, 0.26, { size: 10, italic: true, color: "C7EFD0", valign: "middle" });
});
burst(s, 6.45, 4.55, 2.10, 2.10, PINK, { rotate: 20 });
img(s, "accent-tv", 6.76, 4.90, { w: 1.50 });
src(s, "Crane dan Matten (2019), Tabel 3.1 dan Tabel 3.5."); pageno(s, 5);
s.addNotes("1,5 menit. Peta jalan sisa presentasi. Minta kelas mengingat nomor urutnya, matriks di bagian kasus memakai nomor yang sama.");

/* ---------- pola halaman teori tunggal: gambar besar satu kolom penuh ---------- */
function theory(o) {
  const sl = slide(o.bg || "blue");
  head(sl, { eyebrow: o.eyebrow, title: o.title, dek: o.dek });
  const BC = o.bg === "pink" ? BLUE : GREEN;
  const NC = o.bg === "pink" ? GREEN : PINK, NT = o.bg === "pink" ? NEAR : WHITE;
  if (o.layout === "panels") {
    /* pita definisi di atas, dua panel tinggi seperti piring timbangan mengapit kucing */
    rect(sl, M, 1.92, CW, 1.26, FEAT);
    tag(sl, M, 1.92, 0.62, 1.26, String(o.no), NC, { size: 30, cs: 0, color: NT });
    txt(sl, "DEFINISI", M + 0.85, 2.02, 3.0, 0.22, { size: 9, bold: true, color: FEATBODY, cs: 2.0, valign: "middle" });
    txt(sl, o.term.toUpperCase(), M + 0.85, 2.24, CW - 1.15, 0.30, { size: 16, bold: true, color: FEATINK, face: HF, cs: -0.2, valign: "middle" });
    txt(sl, o.def, M + 0.85, 2.58, CW - 1.15, 0.54, { size: 11, color: FEATBODY, lh: 1.14 });
    const bw = 4.30, RXc = W - M - bw;
    rect(sl, M, 3.42, bw, 2.98, PANEL);
    rect(sl, RXc, 3.42, bw, 2.98, PANEL2);
    txt(sl, o.blocks[0][0], M + 0.24, 3.56, bw - 0.48, 0.24, { size: 10, bold: true, color: ACC2, cs: 1.3, valign: "middle" });
    rich(sl, o.blocks[0][1], M + 0.24, 3.82, bw - 0.48, 0.94, { fontSize: 10.5 });
    rect(sl, M + 0.24, 4.92, bw - 0.48, 0.025, ACC2);
    txt(sl, o.blocks[1][0], M + 0.24, 5.06, bw - 0.48, 0.24, { size: 10, bold: true, color: ACC2, cs: 1.3, valign: "middle" });
    rich(sl, o.blocks[1][1], M + 0.24, 5.32, bw - 0.48, 0.98, { fontSize: 10.5 });
    txt(sl, o.blocks[2][0], RXc + 0.24, 3.56, bw - 0.48, 0.24, { size: 10, bold: true, color: ACC2, cs: 1.3, valign: "middle" });
    rich(sl, o.blocks[2][1], RXc + 0.24, 3.82, bw - 0.48, 0.94, { fontSize: 10.5 });
    rect(sl, RXc + 0.24, 4.92, bw - 0.48, 0.025, ACC2);
    star(sl, RXc + 3.35, 5.10, 0.62, 0.62, ACC2, 16, 12);
    if (o.bubble) sticker(sl, RXc + 0.36, 5.48, 3.05, 0.50, o.bubble, { size: 10, rotate: -2 });
    burst(sl, 4.90, 3.18, 3.55, 3.55, BC, { rotate: o.brot || 0 });
    const ih = 3.38, iw = sizeH(o.img, ih)[0];
    img(sl, o.img, W / 2 - iw / 2, 3.26, { h: ih });
  } else if (o.layout === "third") {
    /* kucing di garis sepertiga: zona stiker di kiri, kucing, lalu blok lebar di kanan */
    rect(sl, M, 1.92, CW, 1.26, FEAT);
    tag(sl, M, 1.92, 0.62, 1.26, String(o.no), NC, { size: 30, cs: 0, color: NT });
    txt(sl, "DEFINISI", M + 0.85, 2.02, 3.0, 0.22, { size: 9, bold: true, color: FEATBODY, cs: 2.0, valign: "middle" });
    txt(sl, o.term.toUpperCase(), M + 0.85, 2.24, CW - 1.15, 0.30, { size: 16, bold: true, color: FEATINK, face: HF, cs: -0.2, valign: "middle" });
    txt(sl, o.def, M + 0.85, 2.58, CW - 1.15, 0.54, { size: 11, color: FEATBODY, lh: 1.14 });
    star(sl, 0.92, 3.48, 1.05, 1.05, ACC2, 16, 12);
    if (o.bubble) sticker(sl, 0.60, 4.46, 2.80, 0.50, o.bubble, { size: 10, rotate: -5 });
    star(sl, 1.98, 5.38, 0.70, 0.70, ACC, 24, -8);
    burst(sl, 3.45, 3.15, 3.30, 3.60, BC, { rotate: o.brot || 0 });
    const ih = 3.38, iw = sizeH(o.img, ih)[0];
    img(sl, o.img, 5.05 - iw / 2, 3.26, { h: ih });
    o.blocks.forEach(function (b, i) {
      const by = 3.40 + i * 1.06;
      rect(sl, 6.90, by, 5.88, 1.00, i % 2 ? PANEL2 : PANEL);
      txt(sl, b[0], 7.14, by + 0.06, 5.4, 0.24, { size: 10, bold: true, color: ACC2, cs: 1.3, valign: "middle" });
      rich(sl, b[1], 7.14, by + 0.30, 5.4, 0.64, { fontSize: 10.5 });
    });
  } else {
    /* kolom gambar di kiri (bawaan) atau di kanan (cermin) */
    const flip = o.layout === "right";
    const IZ = flip ? 7.98 : M, TX = flip ? M : 5.75, RW = 7.03;
    burst(sl, IZ - 0.28, 2.02, 5.40, 4.50, BC, { rotate: o.brot || 0 });
    const ih = 4.55, iw = sizeH(o.img, ih)[0];
    img(sl, o.img, IZ + 2.40 - iw / 2, 1.95, { h: ih });
    if (o.bubble) sticker(sl, IZ + 0.62, 5.92, 3.35, 0.50, o.bubble, { size: 10.5, rotate: -2 });
    rect(sl, TX, 1.92, RW, 1.58, FEAT);
    tag(sl, TX, 1.92, 0.62, 1.58, String(o.no), NC, { size: 32, cs: 0, color: NT });
    txt(sl, "DEFINISI", TX + 0.85, 2.08, 3.0, 0.24, { size: 9, bold: true, color: FEATBODY, cs: 2.0, valign: "middle" });
    txt(sl, o.term.toUpperCase(), TX + 0.85, 2.32, RW - 1.15, 0.32, { size: 17, bold: true, color: FEATINK, face: HF, cs: -0.2, valign: "middle" });
    txt(sl, o.def, TX + 0.85, 2.70, RW - 1.15, 0.72, { size: 11, color: FEATBODY, lh: 1.14 });
    o.blocks.forEach(function (b, i) {
      const yy = 3.58 + i * 0.98;
      rect(sl, TX, yy, RW, 0.92, i % 2 ? PANEL2 : PANEL);
      txt(sl, b[0], TX + 0.26, yy + 0.06, RW - 0.5, 0.24, { size: 10, bold: true, color: ACC2, cs: 1.3, valign: "middle" });
      rich(sl, b[1], TX + 0.26, yy + 0.30, RW - 0.5, 0.60, { fontSize: 10.5 });
    });
  }
  src(sl, o.src); pageno(sl, o.num); sl.addNotes(o.notes);
}

theory({ no: 1, num: 6, img: "c-egoism", brot: 6,
  eyebrow: "04   TEORI MODERNIS BARAT   |   KONSEKUENSIALIS",
  title: "Etika kepentingan diri: ethical egoism",
  dek: "Teori tertua sekaligus paling diperdebatkan. Sebagian penulis menolak mengategorikannya sebagai teori moral.",
  term: "Ethical egoism", bubble: "BUKAN KESERAKAHAN",
  def: "Sebuah tindakan benar secara moral jika dalam situasi tersebut semua pengambil keputusan secara bebas memilih mengejar keinginan jangka pendek atau kepentingan jangka panjangnya.",
  blocks: [
    ["PEMBEDAAN KONSEPTUAL", ["Pelaku egois masih dapat tergerak oleh rasa iba, sedangkan ", ["pelaku serakah tidak peka pada kepentingan pihak lain", "h"], "."]],
    ["TOKOH DAN KARYA UTAMA", [["Thomas Hobbes", "g"], " dalam Leviathan yang menyebut keadaan alamiah sebagai perang semua melawan semua, dan ", ["Ayn Rand", "g"], " dalam The Virtue of Selfishness."]],
    ["KETERBATASAN TEORI", ["Teori ini hanya berlaku bila pasar mencegah satu pelaku merugikan pelaku lain. Ia ", ["gugur pada kegagalan pasar dan isu keberlanjutan", "g"], ", sebab korban penipisan sumber daya adalah generasi mendatang."]]],
  src: "Crane dan Matten (2019), Bab 3, halaman 93 sampai 96.",
  notes: "2 menit. Jangan buru-buru menolak egoisme. Versi jangka panjangnya justru memberi kritik paling tajam pada kasus nikel. Enlightened egoism: perusahaan menyokong lingkungan sosial karena itu menguntungkan dirinya sendiri." });

theory({ no: 2, num: 7, img: "c-utilitarian", brot: -8, layout: "panels",
  eyebrow: "04   TEORI MODERNIS BARAT   |   KONSEKUENSIALIS",
  title: "Etika hasil: utilitarianism",
  dek: "Teori yang paling lazim diterapkan dalam bisnis karena kompatibel dengan metodologi kuantitatif ekonomi.",
  term: "Utilitarianism", bubble: "GREATEST HAPPINESS",
  def: "Sebuah tindakan benar secara moral jika menghasilkan kebaikan terbesar bagi jumlah orang terbesar yang terkena dampaknya. Bentham dan Mill.",
  blocks: [
    ["EMPAT CIRI POKOK", ["Consequentialism, hedonism, maximalism, universalism. ", ["Utilitas diukur sebagai pleasure dikurangi pain", "g"], ", dan akibat bagi semua pihak wajib ikut dihitung."]],
    ["ACT DAN RULE", [["Act utilitarianism", "g"], " menilai satu tindakan tunggal. ", ["Rule utilitarianism", "g"], " menilai kelas tindakan dan prinsip di baliknya dalam jangka panjang."]],
    ["EMPAT KEBERATAN", ["Subjektivitas, pembobotan setara, kesulitan kuantifikasi, dan ", ["distribusi utilitas yang mengabaikan minoritas serta generasi mendatang", "h"], "."]]],
  src: "Crane dan Matten (2019), Tabel 3.2, halaman 96 sampai 100.",
  notes: "2,5 menit. Titik terpenting: act dan rule bisa menghasilkan kesimpulan berlawanan atas fakta yang sama. Tanam di sini, karena itu yang terjadi pada kasus nikel." });

theory({ no: 3, num: 8, img: "c-kant", brot: 4, bg: "pink", layout: "right",
  eyebrow: "04   TEORI MODERNIS BARAT   |   BERBASIS PRINSIP",
  title: "Etika kewajiban: Immanuel Kant",
  dek: "Yang dinilai bukan akibat, melainkan prinsip di balik tindakan dan motivasi pelakunya.",
  term: "Ethics of duty", bubble: "CATEGORICAL IMPERATIVE",
  def: "Kewajiban yang abstrak dan tidak berubah, dirumuskan lewat aturan moral a priori yang dideduksi secara rasional dan berlaku pada semua persoalan etis.",
  blocks: [
    ["FORMULASI SATU", [["Universal acceptability. ", "a"], "Terima sebuah hukum moral hanya bila semua makhluk berakal budi juga bisa menerimanya. Mengingkari utang tidak lolos uji ini."]],
    ["FORMULASI DUA", [["Respect for persons. ", "a"], "Perlakukan manusia sebagai tujuan, ", ["jangan pernah sekadar sebagai sarana", "h"], ". Inilah dasar etis stakeholder theory."]],
    ["TIGA KEBERATAN", ["Kriteria motivasinya terlalu sempit, ", ["akibat diabaikan sepenuhnya", "a"], ", dan asumsi rasionalitas penuh bersifat idealistis."]]],
  src: "Crane dan Matten (2019), Tabel 3.4, halaman 100 sampai 103.",
  notes: "2 menit. Cara cepat memakai Kant: sebutkan maksim tindakannya dalam satu kalimat, lalu universalkan. Kalau maksimnya membatalkan dirinya sendiri, tindakan itu gagal." });

theory({ no: 4, num: 9, img: "c-rights", brot: -5,
  eyebrow: "04   TEORI MODERNIS BARAT   |   BERBASIS PRINSIP",
  title: "Etika hak dan hak asasi manusia",
  dek: "Pendekatan yang paling banyak dipakai secara praktis karena sudah melembaga dalam instrumen internasional.",
  term: "Human rights", bubble: "PROTECT RESPECT REMEDY",
  def: "Hak dasar yang melekat, tidak dapat dicabut, dan tidak bersyarat, yang dimiliki semua manusia tanpa kecuali.",
  blocks: [
    ["KORELASI HAK DAN KEWAJIBAN", [["John Locke", "g"], " merumuskan natural rights atas hidup, kebebasan, dan milik. Hak seseorang selalu menimbulkan kewajiban pada pihak lain."]],
    ["UN GUIDING PRINCIPLES 2011", ["Negara ", ["melindungi", "g"], ", bisnis ", ["menghormati", "g"], ", dan peradilan menyediakan ", ["pemulihan", "g"], " bagi korban."]],
    ["CAKUPAN YANG MENENTUKAN", ["Perusahaan wajib meredakan dampak buruk yang terkait lewat relasi bisnisnya, ", ["sekalipun ia tidak ikut menyebabkannya", "h"], ". Pemasok termasuk di dalamnya."]]],
  src: "Crane dan Matten (2019), halaman 103 sampai 107. Universal Declaration of Human Rights (1948).",
  notes: "2 menit. Teori yang paling siap dipakai auditor dan investor. Tekankan cakupan relasi bisnis, itu yang menghubungkan pembeli kendaraan listrik di Eropa dengan Halmahera." });

theory({ no: 5, num: 10, img: "c-justice", brot: 9, layout: "third",
  eyebrow: "04   TEORI MODERNIS BARAT   |   BERBASIS PRINSIP",
  title: "Keadilan: Rawls dan kontrak sosial",
  dek: "Pertanyaannya bergeser dari benar atau salah menjadi susunan seperti apa yang layak disepakati bersama.",
  term: "Justice", bubble: "VEIL OF IGNORANCE",
  def: "Perlakuan yang adil terhadap setiap orang dalam satu situasi, sehingga semua pihak memperoleh apa yang memang menjadi haknya.",
  blocks: [
    ["DUA DIMENSI KEADILAN", [["Keadilan prosedural", "g"], " menilai siapa yang berhak turut memutuskan. ", ["Keadilan distributif", "g"], " menilai ke mana manfaat mengalir dan siapa menanggung bebannya."]],
    ["DUA PRINSIP JOHN RAWLS", ["Kebebasan dasar yang setara bagi semua, lalu ketimpangan hanya dibenarkan bila ", ["paling menguntungkan pihak yang paling tidak diuntungkan", "h"], "."]],
    ["TEORI KONTRAK SOSIAL", ["Hobbes, Locke, dan Rousseau. Versi bisnisnya ", ["Integrative Social Contracts Theory", "g"], " dari Donaldson dan Dunfee, memadukan hypernorms dengan kontrak mikro komunitas."]]],
  src: "Crane dan Matten (2019), halaman 108 sampai 113. Rawls, A Theory of Justice (1971).",
  notes: "2 menit. Veil of ignorance paling mudah dipakai. Latihan: bila Anda tidak tahu akan lahir sebagai pemegang saham atau warga hilir sungai, kebijakan mana yang Anda pilih?" });

/* ================= 11  KETERBATASAN ================= */
s = slide("pink");
head(s, { eyebrow: "05   EVALUASI KRITIS", title: "Enam keterbatasan teori modernis",
  dek: "Keberatan ini menjadi dasar kemunculan empat teori alternatif yang dibahas berikutnya." });
burst(s, 4.38, 1.82, 4.60, 4.55, BLUE, { rotate: 8 });
const b6w = 3.85;
[["Abstraksi berlebih", "Prinsipnya beroperasi pada tataran yang jauh dari persoalan konkret yang dihadapi manajer."],
 ["Reduksionisme", "Setiap teori menonjolkan satu dimensi moralitas dan memperlakukannya sebagai keseluruhan."],
 ["Objektivisme elitis", "Kebenaran moral ditentukan melalui deduksi ahli, bukan melalui pengalaman pihak yang terlibat."],
 ["Impersonalitas", "Ikatan personal dan tanggung jawab pada pihak tertentu diposisikan sebagai pengganggu penilaian."],
 ["Rasionalisme terkodifikasi", "Peran perasaan, empati, dan dorongan moral diabaikan dalam perumusan penilaian etis."],
 ["Imperialisme kultural", "Pengalaman dan tradisi intelektual Barat diposisikan sebagai ukuran yang berlaku universal."]
].forEach(function (b, i) {
  const col = i % 2, row = (i / 2) | 0;
  const x = col === 0 ? M : W - M - b6w, y = 1.95 + row * 1.44, dark = col === 1;
  rect(s, x, y, b6w, 1.34, dark ? BLUE : PANEL2);
  tag(s, x + 0.22, y + 0.16, 0.32, 0.32, String(i + 1), dark ? GREEN : BLUE, { size: 12, cs: 0 });
  txt(s, b[0].toUpperCase(), x + 0.62, y + 0.16, b6w - 0.86, 0.32,
    { size: 12, bold: true, color: dark ? WHITE : NEAR, face: HF, cs: -0.2, valign: "middle" });
  txt(s, b[1], x + 0.22, y + 0.58, b6w - 0.44, 0.64, { size: 9.5, color: dark ? "CFCEF0" : "3A0C1F", lh: 1.14 });
});
img(s, "c-limits", 4.58, 2.00, { h: 4.15 });
rect(s, M, 6.28, CW, 0.50, GREEN_D);
rich(s, ["Teori alternatif tidak menggantikan teori modernis, melainkan ", ["menambahkan dimensi penilaian yang belum tercakup", "fw"],
  ": karakter pelaku, relasi antarpihak, prosedur perumusan norma, dan pilihan istilah."],
  M + 0.26, 6.40, CW - 0.52, 0.32, { fontSize: 9.5, color: "D8F3DE" });
pageno(s, 11);
s.addNotes("1 menit. Slide transisi. Keberatan nomor 3 sampai 5 paling menentukan bagi kasus nikel, karena warga terdampak tidak pernah jadi pihak dalam perumusan.");

/* ---------- pola dua teori alternatif: kartu ramping plus kolom gambar ---------- */
function altPair(o) {
  const sl = slide("blue");
  head(sl, { eyebrow: o.eyebrow, title: o.title, dek: o.dek, tw: o.tw || CW, dw: o.dw || CW });
  const cw = o.cw, gx = o.gx;
  o.imgs.forEach(function (im) {
    burst(sl, im[1] - 0.30, im[2] - 0.16, im[3] + 0.60, im[4] + 0.42, im[5] || GREEN, { rotate: im[6] || 0 });
    img(sl, im[0], im[1], im[2], { w: im[3] });
  });
  o.cards.forEach(function (c, i) {
    const x = o.cardX ? o.cardX[i] : M + i * (cw + gx), g = i === 1;
    rect(sl, x, 1.92, cw, 4.58, g ? GREEN_D : PANEL);
    tag(sl, x + 0.28, 2.14, 0.40, 0.40, String(c.no), g ? NEAR : GREEN, { size: 15, cs: 0 });
    txt(sl, c.name.toUpperCase(), x + 0.80, 2.14, cw - 1.1, 0.40,
      { size: 17, bold: true, face: HF, color: WHITE, cs: -0.4, valign: "middle" });
    txt(sl, c.q, x + 0.28, 2.66, cw - 0.56, 0.52,
      { size: 12, italic: true, bold: true, color: g ? "9BE8AB" : PINK, lh: 1.1 });
    txt(sl, c.who, x + 0.28, 3.22, cw - 0.56, 0.44, { size: 9.5, color: g ? "C7EFD0" : MUTE, lh: 1.1 });
    c.rows.forEach(function (r, j) {
      const yy = 3.76 + j * 0.90;
      txt(sl, r[0], x + 0.28, yy, cw - 0.56, 0.24, { size: 9, bold: true, color: g ? "9BE8AB" : PINK, cs: 1.3, valign: "middle" });
      rich(sl, r[1], x + 0.28, yy + 0.26, cw - 0.56, 0.58, { fontSize: 10, color: g ? "E2F7E7" : BODY });
    });
  });
  src(sl, o.src); pageno(sl, o.num); sl.addNotes(o.notes);
}

altPair({ num: 12, cw: 4.00, gx: 0.30, cardX: [M, 8.78], eyebrow: "06   TEORI ALTERNATIF", title: "Virtue ethics dan ethic of care",
  dek: "Objek penilaian bergeser dari tindakan ke karakter pelaku dan ke relasi antarpihak yang terlibat.",
  imgs: [["c-vc2", 4.82, 1.98, 3.70, 4.37, PINK, -5]],
  src: "Crane dan Matten (2019), Tabel 3.5, halaman 114 sampai 121.",
  notes: "2,5 menit. Virtue ethics sering disalahpahami sebagai imbauan moral. Tekankan pertanyaan pembandingnya: dibandingkan dengan apa kita menyebut sesuatu sudah cukup baik?",
  cards: [
   { no: 6, name: "Virtue ethics", q: "Pelaku seperti apa yang layak disebut baik pada posisi ini?",
     who: "Aristoteles dalam Nicomachean Ethics, MacIntyre dalam After Virtue, dan Solomon dalam Ethics and Excellence.",
     rows: [["GAGASAN INTI", ["Moralitas lahir dari ", ["karakter yang dibentuk lewat pembiasaan", "g"], ", bukan dari aturan. Tujuannya eudaimonia, hidup yang baik."]],
            ["PENERAPAN DALAM BISNIS", ["Perusahaan adalah komunitas praktik, dengan keutamaan berupa ", ["kejujuran, keadilan, kepercayaan, dan ketangguhan", "h"], "."]],
            ["KETERBATASAN", ["Keutamaan selalu ditentukan komunitas tertentu, sehingga sulit dijadikan ukuran lintas budaya dan lintas industri."]]] },
   { no: 7, name: "Ethic of care", q: "Solusi mana yang memelihara relasi dengan pihak terdampak?",
     who: "Carol Gilligan dalam In a Different Voice dan Nel Noddings dalam Caring. Berakar pada etika feminis.",
     rows: [["GAGASAN INTI", ["Manusia adalah ", ["makhluk yang saling bergantung", "fw"], " dan terjalin dalam relasi, bukan individu rasional yang terpisah."]],
            ["TUNTUTAN NORMATIF", ["Empati, keselarasan, menghindari kerugian, dan ", ["tanggung jawab konkret pada orang tertentu", "fw"], ", bukan aturan seragam."]],
            ["KETERBATASAN", ["Prioritas pada pihak terdekat berisiko mengabaikan pihak jauh, dan kriteria kepedulian sulit diaudit secara seragam."]]] }] });

altPair({ num: 13, cw: 3.95, gx: 0.30, cardX: [4.48, 8.83], eyebrow: "06   TEORI ALTERNATIF", title: "Discourse dan postmodern ethics",
  dek: "Objek penilaian bergeser ke prosedur perumusan norma dan ke bahasa yang dipakai untuk membenarkannya.", tw: 8.5, dw: 7.9,
  imgs: [["c2-discourse", 0.70, 1.92, 3.14, 4.55, GREEN, 5]],
  src: "Crane dan Matten (2019), Tabel 3.5, halaman 121 sampai 125.",
  notes: "2,5 menit. Discourse ethics menilai proses, jadi ia bisa membatalkan kebijakan yang hasilnya bagus sekalipun. Postmodern ethics menilai bahasa, dan itu yang membongkar istilah nikel hijau.",
  cards: [
   { no: 8, name: "Discourse ethics", q: "Norma apa yang bisa lahir dari deliberasi yang terbuka?",
     who: "Jurgen Habermas dalam Moral Consciousness and Communicative Action, bersama Karl Otto Apel.",
     rows: [["GAGASAN INTI", ["Norma tidak ditetapkan filsuf dari luar, melainkan ", ["dihasilkan dialog rasional antara semua pihak terdampak", "g"], "."]],
            ["SYARAT IDEAL SPEECH SITUATION", ["Semua pihak boleh ikut, bebas paksaan, dan argumen dinilai dari kekuatannya sendiri, ", ["bukan dari kekuasaan pengusulnya", "h"], "."]],
            ["ORIENTASI", ["Penyelesaian konflik secara damai, bukan pembuktian satu kebenaran. Prosedur yang cacat cukup untuk membatalkan hasilnya."]]] },
   { no: 9, name: "Postmodern ethics", q: "Kepentingan siapa yang dilayani oleh pilihan istilah?",
     who: "Zygmunt Bauman dalam Postmodern Ethics, dengan latar pemikiran Derrida dan Lyotard.",
     rows: [["GAGASAN INTI", [["Dorongan moral dan perasaan didahulukan", "fw"], " atas perhitungan rasional. Tindakan etis kerap digerakkan intuisi, bukan kalkulasi."]],
            ["KRITIK TERHADAP ORGANISASI", ["Prosedur, pembagian tugas, dan jarak birokratis menciptakan ", ["jarak moral", "fw"], " yang menumpulkan dorongan itu."]],
            ["IMPLIKASI SIKAP", ["Mempertanyakan bahasa dan asumsi yang telah dianggap wajar, lalu bertindak pada skala lokal tempat akibatnya dirasakan."]]] }] });

/* ================= 14  SEMBILAN PERTANYAAN ================= */
s = slide("blue");
head(s, { eyebrow: "07   SINTESIS KERANGKA", title: "Sembilan pertanyaan penilaian",
  dek: "Tidak ada teori yang memberikan jawaban lengkap. Yang dicari pertimbangan yang paling kuat menanggung beban argumen.", tw: 9.2, dw: 9.2 });
burst(s, 4.80, 1.85, 3.75, 4.85, GREEN, { rotate: -8 });
img(s, "c-vc1", 4.89, 1.98, { h: 4.54 });
const qw = 4.30;
[[1, "Egoism", "Apakah semua pihak bebas mengejar kepentingan jangka panjangnya, dan sudahkah biaya tertunda dihitung?", PINK],
 [2, "Utilitarianism", "Bila seluruh akibat diagregasi, apakah hasilnya positif, dan apakah act dan rule sejalan?", PINK],
 [3, "Ethics of duty", "Dapatkah maksim tindakan ini diuniversalkan, dan adakah pihak yang diperlakukan sekadar sarana?", PINK],
 [4, "Ethics of rights", "Hak siapa yang terpenuhi, hak siapa yang terlanggar, dan sampai mana relasi bisnisnya menjangkau?", PINK],
 [5, "Justice", "Susunan apa yang akan dipilih orang yang belum tahu posisi yang akan ditempatinya?", PINK],
 [6, "Virtue ethics", "Bagaimana pelaku berkarakter baik bertindak di posisi ini, dan diukur terhadap standar yang mana?", GREEN],
 [7, "Ethic of care", "Solusi mana yang memelihara relasi dengan pihak terdampak, bukan sekadar mengganti kerugiannya?", GREEN],
 [8, "Discourse ethics", "Siapa yang hadir dan siapa yang absen ketika norma dan izinnya dirumuskan?", GREEN],
 [9, "Postmodern ethics", "Kepentingan siapa yang dilayani oleh istilah yang dipakai menamai kebijakan ini?", GREEN]
].forEach(function (q, i) {
  const col = i < 5 ? 0 : 1, row = i < 5 ? i : i - 5;
  const x = col === 0 ? M : 8.48, y = 1.92 + row * 0.94;
  rect(s, x, y, qw, 0.84, i % 2 ? PANEL2 : PANEL);
  tag(s, x, y, 0.34, 0.84, String(q[0]), q[3], { size: 13, cs: 0 });
  txt(s, q[1], x + 0.50, y + 0.08, qw - 0.70, 0.28, { size: 12, bold: true, color: WHITE, face: HF, valign: "middle" });
  txt(s, q[2], x + 0.50, y + 0.36, qw - 0.70, 0.42, { size: 9, color: BODY, lh: 1.1 });
});
rect(s, 8.48, 5.68, qw, 0.84, PINK_D);
rich(s, ["Pendekatan pluralis Bab 3 menghasilkan ", ["sembilan penilaian atas rangkaian fakta yang identik", "fw"],
  ", untuk kemudian dilihat arah konvergensinya."],
  8.70, 5.84, qw - 0.44, 0.56, { fontSize: 10, color: "FBD9E8" });
pageno(s, 14);
s.addNotes("1 menit. Minta kelas memotret slide ini. Selama bagian kasus mereka bisa menandai sendiri jawaban tiap pertanyaan sebelum kita bahas.");

/* ================= 15  ANATOMI KEBIJAKAN ================= */
s = slide("blue");
head(s, { eyebrow: "BAGIAN DUA   |   STUDI KASUS INDONESIA", title: "Anatomi kebijakan hilirisasi nikel",
  dek: "Satu instrumen regulasi yang mengubah struktur industri nikel nasional.", tw: 12.23, dw: 7.6 });
burst(s, 7.80, 1.62, 5.15, 4.55, GREEN, { rotate: 7 });
img(s, "c-nickel", 8.08, 1.92, { w: 4.68 });
[["INSTRUMEN", "Permen ESDM Nomor 11 Tahun 2019 melarang ekspor bijih nikel, berlaku efektif 1 Januari 2020."],
 ["MEKANISME", "Bijih wajib diolah di dalam negeri dan kepemilikan smelter menjadi syarat masuk kawasan industri."],
 ["SENGKETA", "Panel WTO memutus kebijakan ini melanggar aturan perdagangan pada November 2022."]
].forEach(function (a, i) {
  const x = M + i * 2.50;
  rect(s, x, 1.92, 2.27, 1.90, PANEL);
  tag(s, x, 1.92, 0.34, 1.90, String(i + 1), PINK, { size: 14, cs: 0 });
  txt(s, a[0], x + 0.50, 2.06, 1.65, 0.30, { size: 9.5, bold: true, color: PINK, cs: 1.3, valign: "middle" });
  txt(s, a[1], x + 0.50, 2.42, 1.61, 1.28, { size: 10, color: BODY, lh: 1.16 });
});
txt(s, "KRONOLOGI", M, 4.02, 3.0, 0.26, { size: 9.5, bold: true, color: MUTE, cs: 1.8, valign: "middle" });
[["2014", "Larangan pertama, lalu direlaksasi"], ["2019", "Permen ESDM Nomor 11 terbit"],
 ["2020", "Larangan berlaku efektif"], ["2022", "Panel WTO memenangkan Uni Eropa"], ["2025", "Ekspor olahan 40 miliar dolar"]
].forEach(function (k, i) {
  const x = M + i * 1.50;
  rect(s, x, 4.34, 1.35, 1.02, i % 2 ? PANEL2 : PANEL);
  txt(s, k[0], x + 0.16, 4.44, 1.05, 0.32, { size: 16, bold: true, color: GREEN, face: HF, valign: "middle" });
  txt(s, k[1], x + 0.16, 4.78, 1.05, 0.50, { size: 7.5, color: BODY, lh: 1.1 });
});
rect(s, M, 5.56, 7.27, 0.86, PINK_D);
rich(s, ["Manfaatnya besar, terukur, dan terkonsentrasi, sedangkan bebannya tersebar, tertunda, dan sulit dikuantifikasi. Persoalan dengan struktur demikian ",
  ["tidak dapat diselesaikan melalui kriteria penilaian tunggal", "fw"], "."],
  M + 0.26, 5.70, 6.75, 0.62, { fontSize: 10, color: "FBD9E8" });
src(s, "Data ditelusuri Agustus 2026 dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, dan dokumen putusan panel WTO.");
pageno(s, 15);
s.addNotes("2 menit. Kebijakannya masih berjalan dan sengketa dagangnya belum tuntas. Kasus yang belum selesai justru paling layak didiskusikan di kelas.");

/* ================= 16  DUA NARASI ================= */
s = slide("blue");
head(s, { eyebrow: "08   FAKTA", title: "Dua narasi atas fakta yang sama",
  dek: "Kedua kolom bersandar pada data resmi yang sama sahnya. Yang disengketakan kriteria penilaiannya." });
const nw = (CW - 0.35) / 2;
rect(s, M, 1.92, nw, 4.55, GREEN_D);
rect(s, M + nw + 0.35, 1.92, nw, 4.55, PINK_D);
tag(s, M + 0.28, 2.12, 3.55, 0.34, "PENDUKUNG   HILIRISASI BERDAULAT", NEAR, { size: 9.5 });
tag(s, M + nw + 0.63, 2.12, 3.85, 0.34, "PENENTANG   EKSTRAKSI BERBIAYA SOSIAL", NEAR, { size: 9.5 });
[[M, ["40 miliar dolar", "41,5 miliar dolar", "166 ribu pekerja", "Pemasok terbesar"],
  ["Nilai ekspor produk nikel olahan pada 2025, naik dari 3 miliar dolar pada 2020",
   "Investasi terkumpul di kawasan IMIP Morowali sampai Desember 2025",
   "Terserap di IMIP dan IWIP, dari 35.952 orang pada 2020",
   "Indonesia menjadi simpul utama rantai pasok baterai dunia"], "C7EFD0", "c-narr1", 2.40, PINK],
 [M + nw + 0.35, ["3 sampai 3,6 juta", "107 pekerja meninggal", "163 ribu hektare", "4,35 persen"],
  ["Upah pokok per bulan, di bawah upah minimum Morowali 2025 sebesar 3,7 juta",
   "Beserta 155 pekerja luka pada 104 kecelakaan smelter sepanjang 2019 sampai 2025",
   "Tutupan pohon hilang di Halmahera, industri nikel memegang 76 persen PLTU",
   "Nilai tambah yang tinggal di Morowali, kemiskinannya 12,58 persen"], "FBD9E8", "c-narr2", 2.40, GREEN]
].forEach(function (c) {
  const cx = c[0];
  burst(s, cx + 3.22, 3.35, 2.80, 3.05, c[6], { rotate: 10 });
  img(s, c[4], cx + 3.35, 3.55, { w: c[5] });
  c[1].forEach(function (num, i) {
    const y = 2.55 + i * 0.82, wide = i === 0 ? nw - 0.56 : 2.82;
    txt(s, num, cx + 0.28, y, wide, 0.32, { size: 18, bold: true, color: WHITE, face: HF, cs: -0.4, valign: "middle" });
    txt(s, c[2][i], cx + 0.28, y + 0.32, wide, 0.44, { size: 9.5, color: c[3], lh: 1.1 });
  });
});
src(s, "Beban yang tidak masuk neraca ekspor: sungai Ake Jira tidak lagi layak dipakai warga, dan 40 persen wilayah adat O Hongana Manyawa sudah berizin tambang.");
pageno(s, 16);
s.addNotes("2 menit. Jangan berdebat soal angka. Tegaskan kedua kolom benar. Justru itu yang membuat kasus ini butuh sembilan kriteria, bukan satu.");

/* ================= 17  LIMA LENSA MODERNIS ================= */
s = slide("blue");
head(s, { eyebrow: "09   PENERAPAN", title: "Penilaian lima teori modernis",
  dek: "Penilaian berbasis akibat dan berbasis prinsip menghasilkan kesimpulan yang tidak seragam.", tw: 9.6, dw: 9.6 });
burst(s, 0.30, 1.80, 3.60, 5.20, PINK, { rotate: 10 });
img(s, "c2-verdict", 0.45, 2.20, { h: 5.30 });
const RX17 = 3.85;
[[1, "Egoism", "NETRAL", "5B58C4", ["Pada horizon pendek jelas melayani kepentingan Indonesia. Pada horizon panjang, biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit batu bara belum diinternalisasi. ", ["Kepentingan diri yang dihitung cermat justru menuntut biaya tertunda itu masuk sejak awal", "g"], "."]],
 [2, "Utilitarianism", "AMBIVALEN", "B08018", ["Act utilitarianism cenderung mendukung, sebab manfaat 166 ribu lapangan kerja nyata dan terukur sedangkan kerugiannya tersebar. ", ["Rule utilitarianism menolak", "h"], ", sebab bila setiap negara pemilik cadangan menempuh pengolahan bertenaga batu bara, tambahan emisinya membatalkan manfaat transisi energi yang justru menjadi pembenarnya."]],
 [3, "Ethics of duty", "MENOLAK", PINK, ["Maksimnya berbunyi: pengolahan boleh dipercepat sambil menunda standar upah, keselamatan, dan lingkungan. Diuniversalkan, standar itu kehilangan daya ikat. Formulasi kedua juga gagal, sebab ", ["upah di bawah minimum dan lembur sampai 13 jam menjadikan pekerja sarana semata", "g"], "."]],
 [4, "Ethics of rights", "BERSYARAT", "B08018", ["Hak atas pekerjaan terpenuhi bagi 166 ribu pekerja, dan sampai titik itu kebijakan ini dapat dipertahankan. Namun ", ["hak atas kondisi kerja yang adil, kesehatan, air bersih, dan tanah leluhur terlanggar bersamaan", "h"], ". UNGP menuntut penghormatan pada seluruh relasi bisnis."]],
 [5, "Justice", "MENOLAK", PINK, ["Manfaat mengalir ke penerimaan nasional dan pemodal, sedangkan beban terkonsentrasi pada pekerja kawasan, warga hilir sungai, dan masyarakat adat. ", ["Kabupaten penghasil justru lebih miskin daripada rata-rata provinsinya", "g"], " dan hanya 4,35 persen nilai tambah tinggal di daerah."]]
].forEach(function (l, i) {
  const y = 1.90 + i * 0.96;
  const xr = RX17 + (i % 2 ? 0 : 0.16), wr = 12.78 - xr;
  rect(s, xr, y, wr, 0.90, i % 2 ? PANEL2 : PANEL);
  tag(s, xr, y, 0.34, 0.90, String(l[0]), l[3], { size: 13, cs: 0 });
  txt(s, l[1], xr + 0.50, y + 0.08, 1.95, 0.28, { size: 12, bold: true, color: WHITE, face: HF, valign: "middle" });
  sticker(s, xr + 0.50, y + 0.45, 1.72, 0.31, l[2], { fill: WHITE, border: l[3], color: l[3], lw: 1.5, size: 8.5, rotate: i % 2 ? 2 : -2 });
  rich(s, l[4], xr + 2.45, y + 0.12, wr - 2.65, 0.70, { fontSize: 10, lineSpacingMultiple: 1.12 });
});
txt(s, "Dua teori dalam klasifikasi yang sama menghasilkan kesimpulan berbeda, dan pembedanya terletak pada unit analisis: tindakan tunggal atau kelas tindakan.",
  4.01, H - 0.66, 8.2, 0.30, { size: 8.5, italic: true, color: MUTE, valign: "middle" });
pageno(s, 17);
s.addNotes("3 menit. Bagian terpenting: utilitarianism terbelah. Perbedaan act dan rule bukan detail teknis, melainkan yang menentukan putusan.");

/* ================= 18  EMPAT LENSA ALTERNATIF ================= */
s = slide("pink");
head(s, { eyebrow: "10   PENERAPAN", title: "Penilaian empat teori alternatif",
  dek: "Penilaian bergeser ke karakter pelaku, relasi, prosedur, dan bahasa, tanpa mengubah rangkaian faktanya." });
burst(s, 9.18, 2.02, 3.66, 4.95, BLUE, { rotate: -7 });
img(s, "c2-alt", 9.35, 2.34, { h: 5.16 });
const aw = 4.20;
[[6, "Virtue ethics", "MENOLAK PEMBANDING", BLUE, "Standar pembanding mana yang seharusnya dipakai?",
  ["Pembandingnya selama ini adalah keadaan sebelum hilirisasi, bukan standar industri terbaik yang tersedia hari ini. ", ["Aktor berkarakter baik mengukur diri pada standar tertinggi yang dapat dicapai", "h"], "."]],
 [7, "Ethic of care", "MENUNTUT PEMULIHAN", GREEN_D, "Sejauh mana relasi dengan pihak terdampak dipelihara?",
  ["Warga hilir sungai dan sekitar 300 sampai 500 jiwa O Hongana Manyawa adalah ", ["pihak yang berelasi, bukan variabel biaya", "hg"], ". Yang dituntut pemulihan sungai dan wilayah lindung, bukan penghentian mendadak."]],
 [8, "Discourse ethics", "MENOLAK PROSEDUR", BLUE, "Siapa yang hadir dan siapa yang absen dalam perumusan?",
  ["Warga terdampak bukan pihak dalam perumusan kebijakan maupun perizinan kawasan. Syarat keterlibatan setara tidak terpenuhi, dan ", ["cacat prosedur sudah cukup untuk membatalkan keabsahan hasilnya", "h"], "."]],
 [9, "Postmodern ethics", "RELATIVISTIK", "5B58C4", "Kepentingan siapa yang dilayani oleh pilihan istilah?",
  ["Hilirisasi berkonotasi kemajuan, ekstraksi berkonotasi pengurasan, dan keduanya menamai peristiwa yang sama. ", ["Istilah nikel hijau dipakai bagi pengolahan yang listriknya bertumpu pada batu bara", "h"], "."]]
].forEach(function (l, i) {
  const col = i % 2, row = (i / 2) | 0;
  const x = M + col * (aw + 0.30), y = 1.88 + row * 2.50;
  rect(s, x, y, aw, 2.30, (row + col) % 2 ? "F58CC4" : PANEL2);
  tag(s, x + 0.24, y + 0.16, 0.34, 0.34, String(l[0]), l[3], { size: 13, cs: 0 });
  txt(s, l[1].toUpperCase(), x + 0.66, y + 0.16, aw - 0.90, 0.34, { size: 14, bold: true, color: NEAR, face: HF, cs: -0.3, valign: "middle" });
  txt(s, l[4], x + 0.24, y + 0.58, aw - 0.48, 0.38, { size: 10.5, bold: true, italic: true, color: BLUE, lh: 1.06 });
  rich(s, l[5], x + 0.24, y + 1.02, aw - 0.48, 1.06, { fontSize: 10, color: "2B0812", lineSpacingMultiple: 1.12 });
  sticker(s, x + aw - 2.30, y + 2.06, 2.10, 0.34, l[2], { border: l[3], color: l[3], lw: 1.75, size: 8, rotate: i % 2 ? 3 : -3 });
});
src(s, "Keempat teori ini menyoroti dimensi yang luput dari lima teori sebelumnya: pembanding, relasi, keterwakilan, dan pilihan istilah.");
pageno(s, 18);
s.addNotes("2,5 menit. Ethic of care tidak menolak kebijakan, ia menuntut pemulihan. Contoh bagus bahwa pluralisme bukan berarti semua teori berkata sama.");

/* ================= 19  SINTESIS ================= */
s = slide("blue");
head(s, { eyebrow: "11   SINTESIS", title: "Sintesis penilaian dan evaluasi klaim",
  dek: "Tidak satu pun dari sembilan teori memberikan dukungan tanpa syarat.", tw: 11.4, dw: 11.4 });
burst(s, 4.96, 1.88, 3.45, 4.75, GREEN, { rotate: -8 });
img(s, "c2-synth", 5.19, 2.00, { h: 4.40 });
rect(s, M, 1.90, 4.30, 4.62, PANEL);
tag(s, M + 0.24, 2.06, 2.45, 0.30, "SEMBILAN PENILAIAN", PINK, { size: 9.5 });
[[1, "Egoism", "Netral", "9C9AD8"], [2, "Utilitarianism", "Ambivalen", "F0C24A"], [3, "Ethics of duty", "Menolak", PINK],
 [4, "Ethics of rights", "Bersyarat", "F0C24A"], [5, "Justice", "Menolak", PINK], [6, "Virtue ethics", "Menolak pembanding", PINK],
 [7, "Ethic of care", "Menuntut pemulihan", "F0C24A"], [8, "Discourse ethics", "Menolak prosedur", PINK], [9, "Postmodern ethics", "Relativistik", "9C9AD8"]
].forEach(function (m, i) {
  const y = 2.50 + i * 0.37;
  tag(s, M + 0.24, y + 0.02, 0.26, 0.26, String(m[0]), i < 5 ? PINK : GREEN, { size: 10, cs: 0 });
  txt(s, m[1], M + 0.58, y, 1.62, 0.30, { size: 11, bold: true, color: WHITE, valign: "middle" });
  txt(s, m[2], M + 2.24, y, 1.82, 0.30, { size: 10.5, bold: true, color: m[3], align: "right", valign: "middle" });
});
rect(s, M + 0.24, 5.92, 3.82, 0.48, PINK_D);
txt(s, "Enam menolak, satu bersyarat, satu ambivalen, dan satu netral karena mengakui keterbatasan teorinya.",
  M + 0.38, 5.92, 3.54, 0.48, { size: 9, color: WHITE, valign: "middle", lh: 1.05 });
tag(s, 8.48, 2.06, 4.30, 0.30, "EMPAT PROPOSISI DARI KESEMBILAN TEORI", GREEN, { size: 9.5, color: NEAR });
[["Perbandingan masa lalu tidak normatif", ["Kondisi yang lebih baik daripada ekspor bijih mentah tidak dengan sendirinya memadai. ", ["Virtue ethics menuntut pembanding pada standar tertinggi", "g"], "."]],
 ["Klaim hijau gugur pada sumber energi", ["Pengolahan yang bertumpu pada pembangkit batu bara di dalam kawasan ", ["tidak dapat disebut hijau", "h"], ". Postmodern ethics membacanya sebagai alat pembenar."]],
 ["Distribusi manfaat dan beban timpang", ["Hanya 4,35 persen nilai tambah tinggal di daerah, sementara ", ["kabupaten penghasil lebih miskin daripada rata-rata provinsinya", "g"], ". Rawls menolaknya."]],
 ["Prosesnya cacat sejak perumusan", ["Warga terdampak tidak menjadi pihak dalam perizinan dan perencanaan kawasan. Discourse ethics membatalkan hasil dari proses semacam itu."]]
].forEach(function (p, i) {
  const y = 2.50 + i * 1.04;
  rect(s, 8.48, y, 4.30, 0.96, i % 2 ? PANEL2 : PANEL);
  tag(s, 8.48, y, 0.34, 0.96, String(i + 1), GREEN, { size: 13, cs: 0, color: NEAR });
  txt(s, p[0].toUpperCase(), 8.94, y + 0.08, 3.70, 0.26, { size: 11, bold: true, color: WHITE, face: HF, cs: -0.2, valign: "middle" });
  rich(s, p[1], 8.94, y + 0.36, 3.70, 0.56, { fontSize: 9.5, lineSpacingMultiple: 1.1 });
});
src(s, "Penolakan atas klaim nikel hijau tidak setara dengan penolakan atas hilirisasi. Keduanya persoalan yang terpisah.");
pageno(s, 19);
s.addNotes("2,5 menit. Inti kontribusi analisis. Tekankan proposisi keempat: yang gugur adalah klaim etisnya, bukan kebijakan hilirisasinya.");

/* ================= 20  SIMPULAN ================= */
s = slide("blue");
head(s, { eyebrow: "PENUTUP", title: "Simpulan dan implikasi manajerial",
  dek: "Tiga temuan dari pengujian, diikuti tiga tindak lanjut yang dapat dijalankan manajemen.", tw: 8.3, dw: 7.4 });
burst(s, 8.28, 1.72, 4.48, 5.30, GREEN, { rotate: 10 });
img(s, "c2-close", 8.55, 1.98, { h: 5.52 });
[["Konvergensi, bukan kesepakatan", ["Sembilan teori berangkat dari premis berbeda, namun mayoritasnya bermuara pada arah yang sama. ", ["Inilah bukti terkuat pluralisme", "fw"], "."]],
 ["Klaim etis yang gugur", ["Yang gugur bukan kebijakan hilirisasinya, melainkan ", ["klaim bahwa kebijakan ini sudah etis", "fw"], ". Upah, keselamatan, lingkungan, dan sumber energinya tetap terbuka diperbaiki."]],
 ["Kasus yang masih berlangsung", ["Kebijakannya masih berjalan, sengketa dagangnya belum tuntas, dan angkanya berubah tiap tahun. Kasus yang belum selesai justru paling layak didiskusikan."]]
].forEach(function (t, i) {
  const x = M + i * 2.50;
  rect(s, x, 1.92, 2.27, 2.32, PANEL);
  tag(s, x + 0.20, 2.10, 0.36, 0.36, String(i + 1), PINK, { size: 14, cs: 0 });
  txt(s, t[0].toUpperCase(), x + 0.20, 2.56, 1.90, 0.54, { size: 12, bold: true, color: WHITE, face: HF, lh: 1.02, cs: -0.2 });
  rich(s, t[1], x + 0.20, 3.14, 1.90, 1.02, { fontSize: 9 });
});
txt(s, "IMPLIKASI MANAJERIAL", M, 4.42, 4.0, 0.26, { size: 9.5, bold: true, color: MUTE, cs: 1.8, valign: "middle" });
[["Internalisasi biaya tertunda", "Biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit masuk neraca sejak perencanaan."],
 ["Pelibatan pihak yang absen", "Pekerja, warga hilir, dan masyarakat adat diberi keterwakilan formal dalam panitia keselamatan dan perizinan."],
 ["Pengujian multiteori", "Klaim yang lolos utilitarianism kerap gugur pada keadilan distributif dan discourse ethics."]
].forEach(function (t, i) {
  const x = M + i * 2.50;
  rect(s, x, 4.74, 2.27, 1.35, GREEN_D);
  txt(s, t[0].toUpperCase(), x + 0.20, 4.84, 1.90, 0.44, { size: 10.5, bold: true, color: WHITE, face: HF, cs: -0.2, lh: 1.0 });
  txt(s, t[1], x + 0.20, 5.32, 1.90, 0.70, { size: 8.5, color: "C7EFD0", lh: 1.14 });
});
rect(s, M, 6.24, 7.27, 0.62, PINK);
txt(s, "Manfaat yang terukur selalu lebih mudah dipertahankan daripada beban yang tersebar. Justru karena itu beban yang tersebar perlu dihitung lebih dahulu.",
  M + 0.24, 6.24, 6.79, 0.62, { size: 10.5, bold: true, color: NEAR, valign: "middle", lh: 1.1 });
pageno(s, 20);
s.addNotes("2 menit. Sampaikan ketiga temuan, lalu ketiga tindak lanjutnya, dan tutup dengan kalimat penutup di bawah.");

/* ================= 21  TERIMA KASIH ================= */
s = slide("blue");
burst(s, 6.10, 0.70, 6.90, 6.10, PINK, { rotate: -6 });
star(s, 0.75, 1.15, 1.45, 1.45, GREEN, 16, 12);
star(s, 1.35, 5.75, 1.05, 1.05, GREEN, 24, -8);
img(s, "c-thanks", 6.35, 1.35, { w: 6.55 });
txt(s, "PENUTUP", M + 0.35, 2.60, 5.4, 0.28, { size: 11, bold: true, color: PINK, cs: 2.4, valign: "middle" });
txt(s, "TERIMA", M + 0.35, 2.94, 5.6, 1.05, { size: 62, bold: true, color: WHITE, face: HF, cs: -2, valign: "middle" });
txt(s, "KASIH", M + 0.35, 3.92, 5.6, 1.05, { size: 62, bold: true, color: WHITE, face: HF, cs: -2, valign: "middle" });
tag(s, M + 0.35, 5.10, 4.25, 0.52, "BUSINESS ETHICS FOR SUSTAINABILITY", GREEN, { size: 12, cs: 1.2, color: NEAR });
s.addNotes("Slide penutup. Buka forum tanya jawab. Tidak perlu alokasi waktu tersendiri.");

pres.writeFile({ fileName: "WOW-Business-Ethics-Hilirisasi-Nikel.pptx" }).then(function (f) { console.log("WROTE " + f); });
