const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Aslih Abnuri";
pres.title = "Evaluating Business Ethics: Normative Ethical Theories";

const W = 13.333, H = 7.5, M = 0.62, CW = W - 2 * M;
const INK = "16202A", INK2 = "22303D";
const WHITE = "FFFFFF";
const SURF = "F1F3F5", SURF2 = "E6EAEE";
const MUTED = "6B7684", MUTED_D = "97A3AE";
const BODY = "2C3540";
const EMBER = "B8542A", EMBER_S = "F6EAE3", EMBER_L = "E8A87C";
const TEAL = "2E6F63", TEAL_S = "E3EDEA";
const GOLD = "9A7420";
const PALE = "D5DDE4", PALE2 = "C6CFD8";
const HF = "Cambria", BF = "Calibri";

function bg(slide, dark) { slide.background = { color: dark ? INK : WHITE }; }
function card(slide, x, y, w, h, fill, radius) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 },
    rectRadius: radius === undefined ? 0.09 : radius });
}
function numChip(slide, x, y, n, fill, size) {
  const s = size === undefined ? 0.4 : size;
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w: s, h: s, fill: { color: fill }, line: { color: fill, width: 0 }, rectRadius: 0.07 });
  slide.addText(String(n), { x, y, w: s, h: s, isTextBox: true, margin: 0, align: "center", valign: "middle",
    fontFace: HF, fontSize: s > 0.45 ? 15 : 13, bold: true, color: WHITE });
}
function verdictChip(slide, x, y, w, label, fill) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: 0.3, fill: { color: fill }, line: { color: fill, width: 0 }, rectRadius: 0.15 });
  slide.addText(label, { x, y, w, h: 0.3, isTextBox: true, margin: 0, align: "center", valign: "middle",
    fontFace: BF, fontSize: 9, bold: true, color: WHITE, charSpacing: 0.6 });
}
function head(slide, eyebrow, title, dek, dark) {
  slide.addText(eyebrow, { x: M, y: 0.38, w: CW, h: 0.24, isTextBox: true, margin: 0, valign: "middle",
    fontFace: BF, fontSize: 10, bold: true, color: dark ? MUTED_D : EMBER, charSpacing: 1.6 });
  slide.addText(title, { x: M, y: 0.64, w: CW, h: 0.60, isTextBox: true, margin: 0, valign: "middle",
    fontFace: HF, fontSize: 28, bold: true, color: dark ? WHITE : INK });
  if (dek) slide.addText(dek, { x: M, y: 1.28, w: CW, h: 0.34, isTextBox: true, margin: 0, valign: "top",
    fontFace: BF, fontSize: 12.5, color: dark ? MUTED_D : MUTED, lineSpacingMultiple: 1.1 });
}
function foot(slide, left, num, dark) {
  if (left) slide.addText(left, { x: M, y: 7.02, w: CW - 1.0, h: 0.26, isTextBox: true, margin: 0, valign: "middle",
    fontFace: BF, fontSize: 9, color: dark ? MUTED_D : MUTED, italic: true });
  slide.addText(String(num), { x: W - M - 0.8, y: 7.02, w: 0.8, h: 0.26, isTextBox: true, margin: 0,
    align: "right", valign: "middle", fontFace: HF, fontSize: 11, bold: true, color: dark ? MUTED_D : MUTED });
}
function label(slide, x, y, w, text, color) {
  slide.addText(text, { x, y, w, h: 0.24, isTextBox: true, margin: 0, valign: "middle",
    fontFace: BF, fontSize: 9.5, bold: true, color: color || EMBER, charSpacing: 1.2 });
}
function para(slide, x, y, w, h, text, size, color, lh) {
  slide.addText(text, { x, y, w, h, isTextBox: true, margin: 0, valign: "top",
    fontFace: BF, fontSize: size || 12, color: color || BODY, lineSpacingMultiple: lh || 1.14 });
}
function heading(slide, x, y, w, text, size, color) {
  slide.addText(text, { x, y, w, h: 0.30, isTextBox: true, margin: 0, valign: "middle",
    fontFace: HF, fontSize: size || 15, bold: true, color: color || INK });
}

/* ============ 1 JUDUL ============ */
let s = pres.addSlide(); bg(s, true);
s.addShape(pres.ShapeType.roundRect, { x: 8.75, y: 1.30, w: 4.0, h: 4.0, fill: { color: INK2 }, line: { color: INK2, width: 0 }, rectRadius: 0.12 });
["Egoism", "Utilitarianism", "Ethics of duty", "Ethics of rights", "Justice", "Virtue ethics", "Ethic of care", "Discourse ethics", "Postmodern ethics"].forEach((t, i) => {
  const yy = 1.62 + i * 0.40;
  numChip(s, 9.10, yy, i + 1, i < 5 ? EMBER : TEAL, 0.28);
  s.addText(t, { x: 9.52, y: yy, w: 3.0, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11.5, color: WHITE });
});
s.addText("BUSINESS ETHICS FOR SUSTAINABILITY   |   MAN5522   |   MBA UGM", {
  x: M, y: 1.35, w: 7.6, h: 0.26, isTextBox: true, margin: 0, valign: "middle",
  fontFace: BF, fontSize: 10.5, bold: true, color: EMBER, charSpacing: 1.4 });
s.addText("Evaluating\nBusiness Ethics", { x: M, y: 1.75, w: 7.8, h: 1.75, isTextBox: true, margin: 0, valign: "top",
  fontFace: HF, fontSize: 48, bold: true, color: WHITE, lineSpacingMultiple: 0.98 });
s.addText("Normative Ethical Theories", { x: M, y: 3.55, w: 7.8, h: 0.42, isTextBox: true, margin: 0, valign: "middle",
  fontFace: HF, fontSize: 22, color: MUTED_D, italic: true });
s.addText("Sembilan teori etika normatif dari Bab 3, lalu diuji pada satu kebijakan yang masih berjalan: hilirisasi nikel Indonesia.", {
  x: M, y: 4.15, w: 7.5, h: 0.7, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 13.5, color: PALE2, lineSpacingMultiple: 1.2 });
s.addText([
  { text: "Aslih Abnuri", options: { fontFace: HF, fontSize: 15, bold: true, color: WHITE, breakLine: true } },
  { text: "25/574338/PEK/31801", options: { fontFace: BF, fontSize: 11.5, color: MUTED_D } }
], { x: M, y: 5.35, w: 5.0, h: 0.75, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
s.addText("Rujukan: Crane, Matten, Glozer, dan Spence (2019), Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization, edisi kelima, Oxford University Press, Bab 3.", {
  x: M, y: 6.45, w: 7.6, h: 0.6, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 9.5, color: MUTED, italic: true, lineSpacingMultiple: 1.15 });
s.addNotes("Pembuka 1 menit. Sampaikan dua hal: Bab 3 memberi sembilan kriteria penilaian, dan kita akan memakainya pada kasus nyata yang belum selesai. Alokasi 30 menit: sekitar 17 menit teori, 11 menit kasus, 2 menit penutup.");

/* ============ 2 PETA BAHASAN ============ */
s = pres.addSlide(); bg(s);
head(s, "PETA BAHASAN", "Dua bagian, satu alur argumen", "Teori dibangun lebih dahulu supaya kasusnya punya alat ukur, bukan sekadar punya opini.");
card(s, M, 1.88, 5.82, 4.22, SURF);
card(s, M + 6.27, 1.88, 5.82, 4.22, SURF);
label(s, M + 0.34, 2.12, 5.1, "BAGIAN SATU   |   TEORI   |   SLIDE 3 SAMPAI 14", EMBER);
label(s, M + 6.61, 2.12, 5.1, "BAGIAN DUA   |   KASUS   |   SLIDE 15 SAMPAI 20", TEAL);
heading(s, M + 0.34, 2.42, 5.1, "Kerangka penilaian", 16);
heading(s, M + 6.61, 2.42, 5.1, "Hilirisasi nikel Indonesia", 16);
const agL = [["01", "Peran teori etika normatif"], ["02", "Absolutisme, relativisme, pluralisme"], ["03", "Peta sembilan teori"], ["04", "Lima teori modernis Barat"], ["05", "Batas teori modernis Barat"], ["06", "Empat teori alternatif"]];
const agR = [["07", "Anatomi kebijakan dan sengketanya"], ["08", "Dua narasi atas fakta yang sama"], ["09", "Uji lima lensa modernis"], ["10", "Uji empat lensa alternatif"], ["11", "Matriks putusan dan klaim nikel hijau"], ["12", "Simpulan dan implikasi manajerial"]];
agL.forEach((it, i) => { const yy = 2.92 + i * 0.49;
  s.addText(it[0], { x: M + 0.34, y: yy, w: 0.44, h: 0.30, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13, bold: true, color: EMBER });
  s.addText(it[1], { x: M + 0.82, y: yy, w: 4.7, h: 0.30, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 12.5, color: BODY }); });
agR.forEach((it, i) => { const yy = 2.92 + i * 0.49;
  s.addText(it[0], { x: M + 6.61, y: yy, w: 0.44, h: 0.30, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13, bold: true, color: TEAL });
  s.addText(it[1], { x: M + 7.09, y: yy, w: 4.7, h: 0.30, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 12.5, color: BODY }); });
card(s, M, 6.32, CW, 0.53, EMBER_S);
s.addText("Satu pesan yang dibawa sepanjang presentasi: sengketa etis pada kasus ini bukan sengketa fakta, melainkan sengketa kriteria penilaian.", {
  x: M + 0.34, y: 6.32, w: CW - 0.68, h: 0.53, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 12, color: "7A3A1C", italic: true });
foot(s, null, 2);
s.addNotes("30 detik. Tekankan bahwa urutannya sengaja: kalau kasus dibahas lebih dulu, diskusi berhenti di adu data. Teori memberi alat untuk menilai data yang sama secara berbeda.");

/* ============ 3 PERAN TEORI ============ */
s = pres.addSlide(); bg(s);
head(s, "01   PERAN TEORI ETIKA NORMATIF", "Mengapa teori normatif diperlukan", "Di ruang pribadi kita cukup mengandalkan intuisi. Di dunia bisnis, penilaian harus bisa dipertahankan di hadapan pemangku kepentingan.");
card(s, M, 1.96, 5.6, 2.32, INK);
label(s, M + 0.34, 2.20, 5.0, "DEFINISI BUKU", MUTED_D);
s.addText("Teori etika normatif adalah aturan, pedoman, prinsip, dan pendekatan yang menentukan benar dan salah.", {
  x: M + 0.34, y: 2.52, w: 4.95, h: 1.05, isTextBox: true, margin: 0, valign: "top", fontFace: HF, fontSize: 16.5, color: WHITE, lineSpacingMultiple: 1.14 });
s.addText("Crane dan Matten (2019: 87)", { x: M + 0.34, y: 3.74, w: 4.95, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10, color: MUTED_D, italic: true });
card(s, M, 4.48, 5.6, 2.06, SURF);
label(s, M + 0.34, 4.72, 5.0, "NORMATIF DAN DESKRIPTIF", EMBER);
para(s, M + 0.34, 5.02, 4.95, 1.35, "Normatif menjawab bagaimana kita seharusnya bertindak, dan berlaku bagi semua pelaku yang berakal budi. Deskriptif menjelaskan aturan yang sebenarnya dianut satu kelompok atau masyarakat tertentu, termasuk ajaran agama. Bab 4 mengambil jalur deskriptif itu.", 12);
const fungsi = [
  ["Merapikan intuisi", "Nilai utama teori etika terletak pada kemampuannya merasionalkan, menjelaskan, dan memahami firasat moral yang sudah kita punya soal benar dan salah."],
  ["Membuka percakapan", "Teori memungkinkan diskusi rasional antara orang yang nilai moralnya berbeda, sehingga perbedaan tidak berhenti sebagai selera."],
  ["Menopang keputusan", "Keputusan bisnis perlu alasan sistematis dan argumen yang bisa dipahami umum, supaya dapat dibela, dibenarkan, dan dijelaskan kepada pemangku kepentingan."]];
fungsi.forEach((f, i) => { const yy = 1.96 + i * 1.55;
  card(s, M + 6.05, yy, 6.04, 1.36, i === 1 ? SURF : SURF2);
  numChip(s, M + 6.35, yy + 0.24, i + 1, EMBER, 0.32);
  heading(s, M + 6.80, yy + 0.22, 4.9, f[0], 14.5);
  para(s, M + 6.80, yy + 0.58, 5.0, 0.72, f[1], 11.5, BODY, 1.12); });
foot(s, "Crane dan Matten (2019), Bab 3, halaman 86 sampai 88.", 3);
s.addNotes("2 menit. Poin kunci: teori tidak menggantikan intuisi, tetapi merapikannya. Contoh pemantik: perbedaan antara mengatakan praktik di negara lain itu berbeda dan mengatakan praktik itu salah.");

/* ============ 4 POSISI DASAR ============ */
s = pres.addSlide(); bg(s);
head(s, "02   POSISI DASAR", "Absolutisme, relativisme, dan pluralisme", "Sebelum memakai teori, kita perlu tahu seberapa jauh satu teori mengklaim dirinya berlaku.");
const spek = [
  ["ABSOLUTISME ETIS", "Ada prinsip moral yang universal dan abadi", "Benar dan salah adalah kualitas objektif yang bisa ditentukan lewat nalar, terlepas dari keadaan.\n\nHampir semua teori modernis Barat berdiri di sini. Kekuatannya jelas: ia memberi jawaban yang tegas.", SURF, INK, EMBER],
  ["RELATIVISME ETIS", "Moralitas bergantung konteks dan bersifat subjektif", "Tidak ada benar dan salah universal. Semuanya bergantung pada tradisi, keyakinan, dan praktik pihak yang memutuskan.\n\nSering muncul pada isu bisnis internasional, ketika perilaku di budaya lain dinilai tidak bisa dihakimi dari luar.", SURF, INK, EMBER],
  ["PLURALISME ETIS", "Posisi yang diambil Crane dan Matten", "Nilai yang saling bertentangan bisa sama sahnya dan perlu ditoleransi. Pluralisme tidak menyamaratakan semua perspektif, tetapi juga tidak mengunggulkan satu di atas yang lain.\n\nKonflik antar teori bukan kegagalan, melainkan bagian yang harus dikelola.", TEAL_S, TEAL, TEAL]];
const cw3 = (CW - 0.8) / 3;
spek.forEach((c, i) => { const xx = M + i * (cw3 + 0.4);
  card(s, xx, 1.96, cw3, 3.62, c[3]);
  label(s, xx + 0.3, 2.18, cw3 - 0.6, c[0], c[5]);
  s.addText(c[1], { x: xx + 0.3, y: 2.46, w: cw3 - 0.6, h: 0.78, isTextBox: true, margin: 0, valign: "top", fontFace: HF, fontSize: 15, bold: true, color: c[4], lineSpacingMultiple: 1.08 });
  para(s, xx + 0.3, 3.32, cw3 - 0.6, 2.0, c[2], 11.5, BODY, 1.14); });
card(s, M, 5.92, CW, 0.84, SURF2);
s.addText([
  { text: "Dua rambu dari buku.   ", options: { fontFace: BF, fontSize: 12, bold: true, color: INK } },
  { text: "Amartya Sen (2000) menilai pluralisme membuka kepekaan pada kenyataan baru, sesuatu yang tidak diberikan satu teori umum. Sebaliknya Irene Liu (2018) mengingatkan bahwa pluralisme berisiko terlalu toleran, karena sebagian praktik dan tradisi memang keliru dan tidak layak ditoleransi.", options: { fontFace: BF, fontSize: 12, color: BODY } }
], { x: M + 0.34, y: 5.92, w: CW - 0.68, h: 0.84, isTextBox: true, margin: 0, valign: "middle", lineSpacingMultiple: 1.14 });
foot(s, "Crane dan Matten (2019), Bab 3, halaman 87 sampai 88.", 4);
s.addNotes("1,5 menit. Pertanyaan pemantik ke kelas: suap. Absolutis bilang selalu salah. Relativis bilang tergantung negaranya. Pluralis bertanya kriteria mana yang paling kuat menanggung beban argumen di situasi ini.");

/* ============ 5 PETA TEORI ============ */
s = pres.addSlide(); bg(s);
head(s, "03   PETA TEORI", "Sembilan teori dalam dua keluarga besar", "Keluarga pertama menilai tindakan. Keluarga kedua menilai pelaku, relasi, prosedur, dan bahasa.");
card(s, M, 1.96, 7.55, 4.38, SURF);
label(s, M + 0.34, 2.18, 6.9, "KELUARGA SATU   |   TEORI MODERNIS BARAT", EMBER);
para(s, M + 0.34, 2.48, 6.9, 0.66, "Berakar pada Pencerahan abad ke-18, bersifat absolutis, dan menawarkan aturan yang bisa diterapkan pada situasi apa pun. Keunggulannya: memberi solusi yang tidak mendua.", 11.5, BODY, 1.1);
card(s, M + 0.34, 3.22, 3.4, 1.78, WHITE);
card(s, M + 3.94, 3.22, 3.27, 1.78, WHITE);
s.addText("Konsekuensialis", { x: M + 0.6, y: 3.38, w: 3.0, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10, bold: true, color: MUTED, charSpacing: 0.8 });
s.addText("Teleologis, menilai akibat tindakan", { x: M + 0.6, y: 3.64, w: 3.0, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10.5, color: MUTED, italic: true });
s.addText("Berbasis prinsip", { x: M + 4.2, y: 3.38, w: 2.9, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10, bold: true, color: MUTED, charSpacing: 0.8 });
s.addText("Deontologis, menilai kewajiban", { x: M + 4.2, y: 3.64, w: 2.9, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10.5, color: MUTED, italic: true });
[["Egoism", 1], ["Utilitarianism", 2]].forEach((t, i) => { const yy = 4.00 + i * 0.32;
  numChip(s, M + 0.6, yy, t[1], EMBER, 0.26);
  s.addText(t[0], { x: M + 0.95, y: yy, w: 2.6, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11.5, bold: true, color: INK }); });
[["Ethics of duty", 3], ["Ethics of rights", 4], ["Justice dan social contract", 5]].forEach((t, i) => { const yy = 4.00 + i * 0.32;
  numChip(s, M + 4.2, yy, t[1], EMBER, 0.26);
  s.addText(t[0], { x: M + 4.55, y: yy, w: 2.6, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11.5, bold: true, color: INK }); });
para(s, M + 0.34, 5.14, 6.9, 1.05, "Semua teori ini normatif karena berangkat dari asumsi tentang hakikat dunia dan hakikat manusia. Sejauh mana kita bisa menerima kesimpulannya bergantung pada sejauh mana kita berbagi asumsi itu.", 11.5, BODY, 1.14);
card(s, M + 7.95, 1.96, 4.14, 4.38, INK);
label(s, M + 8.29, 2.18, 3.5, "KELUARGA DUA   |   ALTERNATIF", MUTED_D);
s.addText("Teori kontemporer", { x: M + 8.29, y: 2.46, w: 3.5, h: 0.34, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 16, bold: true, color: WHITE });
s.addText("Cenderung relativis. Lahir dari keberatan atas keluarga pertama, dan menyoroti dimensi yang tidak tertangkap aturan universal.", { x: M + 8.29, y: 2.84, w: 3.5, h: 0.92, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11.5, color: PALE2, lineSpacingMultiple: 1.14 });
[["Virtue ethics", 6, "Karakter pelaku"], ["Ethic of care", 7, "Relasi dan tanggung jawab"], ["Discourse ethics", 8, "Prosedur perumusan norma"], ["Postmodern ethics", 9, "Bahasa dan dorongan moral"]].forEach((t, i) => { const yy = 3.86 + i * 0.60;
  numChip(s, M + 8.29, yy, t[1], TEAL, 0.3);
  s.addText(t[0], { x: M + 8.68, y: yy - 0.02, w: 3.1, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 12.5, bold: true, color: WHITE });
  s.addText(t[2], { x: M + 8.68, y: yy + 0.24, w: 3.1, h: 0.24, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10.5, color: MUTED_D, italic: true }); });
foot(s, "Crane dan Matten (2019), Tabel 3.1 dan Tabel 3.5.", 5);
s.addNotes("1,5 menit. Ini peta jalan sisa presentasi. Minta kelas mengingat nomor urutnya, karena matriks di bagian kasus memakai nomor yang sama.");

/* ---- pola halaman teori tunggal ---- */
function theorySlide(o) {
  const sl = pres.addSlide(); bg(sl);
  head(sl, o.eyebrow, o.title, o.dek);
  card(sl, M, 1.96, 5.6, 1.64, INK);
  numChip(sl, M + 0.34, 2.16, o.no, EMBER, 0.4);
  sl.addText(o.term, { x: M + 0.84, y: 2.16, w: 4.5, h: 0.4, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 17, bold: true, color: WHITE });
  sl.addText(o.def, { x: M + 0.34, y: 2.62, w: 4.95, h: 0.88, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 12, color: PALE, lineSpacingMultiple: 1.14, italic: true });
  card(sl, M, 3.90, 5.6, 2.64, SURF);
  label(sl, M + 0.34, 4.12, 5.0, o.leftLabel, EMBER);
  para(sl, M + 0.34, 4.42, 4.95, 2.0, o.leftBody, 11.5, BODY, 1.16);
  o.blocks.forEach((b, i) => { const yy = 1.96 + i * 1.64;
    card(sl, M + 6.05, yy, 6.04, 1.30, i === 1 ? SURF : SURF2);
    heading(sl, M + 6.39, yy + 0.16, 5.4, b[0], 14.5);
    para(sl, M + 6.39, yy + 0.52, 5.4, 0.64, b[1], 11.5, BODY, 1.12); });
  foot(sl, o.src, o.num);
  sl.addNotes(o.notes);
  return sl;
}

/* ============ 6 EGOISM ============ */
theorySlide({
  eyebrow: "04   TEORI MODERNIS BARAT   |   KONSEKUENSIALIS",
  title: "Etika kepentingan diri: ethical egoism",
  dek: "Teori tertua sekaligus paling diperdebatkan. Sebagian penulis bahkan menolak memasukkannya sebagai teori moral.",
  no: 1, term: "Ethical egoism",
  def: "Sebuah tindakan benar secara moral jika dalam situasi tersebut semua pengambil keputusan secara bebas memilih mengejar keinginan jangka pendek atau kepentingan jangka panjangnya.",
  leftLabel: "PEMBEDAAN YANG MENENTUKAN",
  leftBody: "Egoisme tidak sama dengan keserakahan. Orang egois masih bisa tergerak oleh rasa iba, sedangkan orang serakah tidak peka pada yang lain.\n\nEgoisme berbasis kepentingan jangka panjang lebih kuat daripada egoisme berbasis keinginan, karena hanya yang pertama bisa membedakan mahasiswa yang mabuk setiap malam dari mahasiswa yang belajar keras.",
  blocks: [
    ["Tokoh dan karya", "Thomas Hobbes dalam Leviathan, yang menyebut keadaan alamiah sebagai perang semua melawan semua, dan Ayn Rand dalam The Virtue of Selfishness."],
    ["Enlightened egoism", "Perusahaan menyokong sekolah atau layanan kesehatan setempat bukan karena altruisme, melainkan karena lingkungan sosial yang membaik menguntungkan retensi tenaga kerjanya."],
    ["Batas teorinya", "Teori ini hanya bekerja bila pasar mencegah satu egois merugikan egois lain. Ia gugur pada kegagalan pasar dan pada isu keberlanjutan, karena korban penipisan sumber daya adalah generasi yang belum hadir."]],
  src: "Crane dan Matten (2019), Bab 3, halaman 93 sampai 96.", num: 6,
  notes: "2 menit. Jangan buru-buru menolak egoisme. Justru versi jangka panjangnya yang nanti memberi kritik paling tajam pada kasus nikel, karena biaya tertunda belum masuk perhitungan. Catatan tambahan: Adam Smith dan Milton Friedman kerap dikaitkan dengan egoisme, meski keduanya tidak pernah menganjurkan egoisme tanpa simpati."
});

/* ============ 7 UTILITARIANISM ============ */
s = pres.addSlide(); bg(s);
head(s, "04   TEORI MODERNIS BARAT   |   KONSEKUENSIALIS", "Etika hasil: utilitarianism", "Teori paling lazim dipakai di dunia bisnis, karena paling dekat dengan cara ekonomi berpikir.");
card(s, M, 1.96, 7.55, 1.50, INK);
numChip(s, M + 0.34, 2.16, 2, EMBER, 0.4);
s.addText("Utilitarianism", { x: M + 0.84, y: 2.16, w: 4.5, h: 0.4, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 17, bold: true, color: WHITE });
s.addText("Sebuah tindakan benar secara moral jika menghasilkan kebaikan terbesar bagi jumlah orang terbesar yang terkena dampaknya. Inilah greatest happiness principle dari Jeremy Bentham dan John Stuart Mill.", {
  x: M + 0.34, y: 2.62, w: 6.9, h: 0.72, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 12, color: PALE, lineSpacingMultiple: 1.14, italic: true });
const ciri = [["Consequentialism", "Yang dinilai akibatnya"], ["Hedonism", "Utilitas sebagai pleasure dikurangi pain"], ["Maximalism", "Jumlah terbesar, bukan sekadar baik"], ["Universalism", "Akibat bagi semua pihak dihitung"]];
const cwc = (7.55 - 0.33) / 4;
ciri.forEach((c, i) => { const xx = M + i * (cwc + 0.11);
  card(s, xx, 3.62, cwc, 1.12, SURF2);
  s.addText(c[0], { x: xx + 0.12, y: 3.76, w: cwc - 0.24, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 10.5, bold: true, color: EMBER });
  s.addText(c[1], { x: xx + 0.12, y: 4.04, w: cwc - 0.24, h: 0.60, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 10.5, color: BODY, lineSpacingMultiple: 1.1 }); });
card(s, M, 4.94, 3.72, 1.60, SURF);
label(s, M + 0.26, 5.12, 3.2, "ACT UTILITARIANISM", EMBER);
para(s, M + 0.26, 5.40, 3.2, 1.0, "Menilai satu tindakan tunggal berdasar jumlah pleasure dan pain yang ditimbulkannya dalam situasi itu saja.", 11.5, BODY, 1.12);
card(s, M + 3.83, 4.94, 3.72, 1.60, SURF);
label(s, M + 4.09, 5.12, 3.2, "RULE UTILITARIANISM", EMBER);
para(s, M + 4.09, 5.40, 3.2, 1.0, "Menilai kelas tindakan, dan bertanya apakah prinsip di baliknya menghasilkan lebih banyak pleasure daripada pain bagi masyarakat dalam jangka panjang.", 11, BODY, 1.1);
card(s, M + 7.95, 1.96, 4.14, 4.58, SURF2);
label(s, M + 8.29, 2.18, 3.5, "EMPAT MASALAH KLASIK", EMBER);
const masalah = [
  ["Subjektivitas", "Penilaian pleasure dan pain bergantung pada siapa yang menghitung, dan siapa yang layak masuk hitungan."],
  ["Pembobotan setara", "Kepentingan kita sendiri dan orang terdekat harus diberi bobot sama dengan warga jauh di rantai pasok."],
  ["Kuantifikasi", "Sulit memberi nilai pada hal yang bernilai intrinsik. Berapa nilai uang yang pantas untuk masa kanak-kanak?"],
  ["Distribusi utilitas", "Mengejar kebaikan terbesar bagi jumlah terbesar membuat minoritas dan generasi mendatang mudah terlewat."]];
masalah.forEach((m, i) => { const yy = 2.54 + i * 0.98;
  s.addText(m[0], { x: M + 8.29, y: yy, w: 3.5, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13, bold: true, color: INK });
  s.addText(m[1], { x: M + 8.29, y: yy + 0.26, w: 3.5, h: 0.60, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 10.5, color: BODY, lineSpacingMultiple: 1.1 }); });
foot(s, "Crane dan Matten (2019), Tabel 3.2, halaman 96 sampai 100.", 7);
s.addNotes("2,5 menit. Titik terpenting: act dan rule bisa menghasilkan kesimpulan berlawanan atas fakta yang sama. Ini yang nanti terjadi pada kasus nikel, jadi tanam dulu di sini. Utilitarianism dalam praktik mendekati cost benefit analysis, dan lazim dipakai pada analisis dampak sosial dan lingkungan proyek tambang.");

/* ============ 8 KANT ============ */
s = pres.addSlide(); bg(s);
head(s, "04   TEORI MODERNIS BARAT   |   BERBASIS PRINSIP", "Etika kewajiban: Immanuel Kant", "Yang dinilai bukan akibat, melainkan prinsip di balik tindakan dan motivasi pelakunya.");
card(s, M, 1.96, 5.6, 2.72, INK);
numChip(s, M + 0.34, 2.16, 3, EMBER, 0.4);
s.addText("Ethics of duty", { x: M + 0.84, y: 2.16, w: 4.5, h: 0.4, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 17, bold: true, color: WHITE });
s.addText("Kewajiban yang abstrak dan tidak berubah, dirumuskan lewat aturan moral a priori yang dideduksi secara rasional, dan berlaku pada semua persoalan etis yang relevan.", {
  x: M + 0.34, y: 2.62, w: 4.95, h: 0.82, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 12, color: PALE, lineSpacingMultiple: 1.14, italic: true });
label(s, M + 0.34, 3.50, 4.95, "CATEGORICAL IMPERATIVE", EMBER);
s.addText("Bertindaklah hanya menurut maksim yang sekaligus dapat Anda kehendaki menjadi hukum universal.", {
  x: M + 0.34, y: 3.80, w: 4.95, h: 0.72, isTextBox: true, margin: 0, valign: "top", fontFace: HF, fontSize: 13.5, color: WHITE, lineSpacingMultiple: 1.1 });
card(s, M, 4.98, 5.6, 1.56, TEAL_S);
label(s, M + 0.34, 5.16, 5.0, "RELEVANSINYA BAGI BISNIS", TEAL);
para(s, M + 0.34, 5.44, 4.95, 1.0, "Evan dan Freeman (1993) menunjukkan bahwa dasar etis stakeholder theory berasal dari Kant. Supaya karyawan, komunitas, dan pemasok tidak diperlakukan semata sebagai faktor produksi, perusahaan wajib memberi mereka pengaruh atas keputusan.", 11.5, BODY, 1.14);
card(s, M + 6.05, 1.96, 6.04, 1.42, SURF);
heading(s, M + 6.39, 2.14, 5.4, "Formulasi satu: universal acceptability", 14);
para(s, M + 6.39, 2.48, 5.4, 0.82, "Terima sebuah hukum moral hanya bila semua makhluk berakal budi juga bisa menerimanya. Mengingkari utang tidak lolos, sebab bila menjadi kelaziman tidak akan ada lagi yang meminjamkan uang.", 11.5, BODY, 1.12);
card(s, M + 6.05, 3.56, 6.04, 1.42, SURF);
heading(s, M + 6.39, 3.74, 5.4, "Formulasi dua: respect for persons", 14);
para(s, M + 6.39, 4.08, 5.4, 0.82, "Perlakukan manusia sebagai tujuan, jangan pernah sekadar sebagai sarana. Bisnis memang memakai orang, tetapi tidak boleh melupakan kesehatan, pendidikan, dan pilihan hidup mereka sendiri.", 11.5, BODY, 1.12);
card(s, M + 6.05, 5.16, 6.04, 1.38, SURF2);
label(s, M + 6.39, 5.34, 5.4, "TIGA KRITIK", EMBER);
para(s, M + 6.39, 5.62, 5.4, 0.82, "Pertama, motivasi dinilai terlalu sempit: perawat yang menemani pasien sekarat karena iba tidak dianggap bermoral. Kedua, akibat diabaikan sama sekali. Ketiga, asumsinya bahwa semua orang mampu bernalar tenang terlalu optimistis.", 11.5, BODY, 1.12);
foot(s, "Crane dan Matten (2019), Tabel 3.4, halaman 100 sampai 103.", 8);
s.addNotes("2 menit. Cara cepat memakai Kant di kelas: sebutkan maksim tindakannya dalam satu kalimat, lalu universalkan. Kalau maksimnya membatalkan dirinya sendiri saat diuniversalkan, tindakan itu gagal.");

/* ============ 9 RIGHTS ============ */
s = pres.addSlide(); bg(s);
head(s, "04   TEORI MODERNIS BARAT   |   BERBASIS PRINSIP", "Etika hak dan hak asasi manusia", "Pendekatan yang paling banyak dipakai secara praktis, karena sudah melembaga dalam instrumen internasional.");
card(s, M, 1.96, 5.6, 1.64, INK);
numChip(s, M + 0.34, 2.16, 4, EMBER, 0.4);
s.addText("Human rights", { x: M + 0.84, y: 2.16, w: 4.5, h: 0.4, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 17, bold: true, color: WHITE });
s.addText("Hak dasar yang melekat, tidak dapat dicabut, dan tidak bersyarat, yang dimiliki semua manusia tanpa kecuali.", {
  x: M + 0.34, y: 2.62, w: 4.95, h: 0.82, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 12, color: PALE, lineSpacingMultiple: 1.14, italic: true });
card(s, M, 3.90, 5.6, 2.64, SURF);
label(s, M + 0.34, 4.12, 5.0, "HAK DAN KEWAJIBAN, DUA SISI SATU KEPING", EMBER);
para(s, M + 0.34, 4.42, 4.95, 2.0, "John Locke merumuskan natural rights atas hidup, kebebasan, dan milik, yang kemudian meluas ke kebebasan berpendapat, hati nurani, persetujuan, privasi, dan proses hukum yang adil.\n\nHak seseorang menimbulkan kewajiban pada pihak lain. Hak saya atas privasi mewajibkan orang lain menahan diri mengumpulkan informasi pribadi saya tanpa persetujuan.", 11.5, BODY, 1.16);
card(s, M + 6.05, 1.96, 6.04, 2.12, INK);
label(s, M + 6.39, 2.16, 5.4, "UN GUIDING PRINCIPLES 2011   |   RUGGIE PRINCIPLES", MUTED_D);
[["NEGARA", "protect", "kewajiban melindungi hak asasi"], ["BISNIS", "respect", "tanggung jawab menghormati hak asasi"], ["PERADILAN", "remedy", "akses pemulihan bagi korban"]].forEach((p, i) => {
  const yy = 2.50 + i * 0.50;
  s.addText(p[0], { x: M + 6.39, y: yy, w: 1.2, h: 0.32, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 9.5, bold: true, color: MUTED_D, charSpacing: 0.8 });
  s.addText(p[1], { x: M + 7.62, y: yy, w: 1.15, h: 0.32, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 14, bold: true, color: EMBER });
  s.addText(p[2], { x: M + 8.80, y: yy, w: 2.99, h: 0.32, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11, color: PALE }); });
card(s, M + 6.05, 4.38, 6.04, 1.04, EMBER_S);
para(s, M + 6.39, 4.54, 5.4, 0.76, "Cakupan yang menentukan: perusahaan wajib mencegah dan meredakan dampak buruk yang terkait langsung lewat relasi bisnisnya, sekalipun ia tidak ikut menyebabkannya. Pemasok termasuk di dalamnya.", 11.5, "7A3A1C", 1.12);
card(s, M + 6.05, 5.72, 6.04, 0.82, SURF2);
label(s, M + 6.39, 5.88, 5.4, "PASAL YANG PALING SERING TERSENTUH BISNIS", EMBER);
para(s, M + 6.39, 6.14, 5.4, 0.36, "Pasal 12 privasi pekerja dan konsumen, Pasal 20 kebebasan berserikat, dan Pasal 23 kondisi kerja yang adil serta upah yang layak.", 11, BODY, 1.1);
foot(s, "Crane dan Matten (2019), halaman 103 sampai 107. Universal Declaration of Human Rights (1948) dan UN Global Compact prinsip 1 dan 2.", 9);
s.addNotes("2 menit. Ini teori yang paling siap dipakai auditor dan investor. Tekankan cakupan relasi bisnis, karena itu yang menghubungkan pembeli kendaraan listrik di Eropa dengan Halmahera.");

/* ============ 10 JUSTICE ============ */
s = pres.addSlide(); bg(s);
head(s, "04   TEORI MODERNIS BARAT   |   BERBASIS PRINSIP", "Keadilan: Rawls dan kontrak sosial", "Pertanyaannya bergeser dari benar atau salah menjadi susunan seperti apa yang pantas kita sepakati bersama.");
card(s, M, 1.96, 5.6, 2.72, INK);
numChip(s, M + 0.34, 2.16, 5, EMBER, 0.4);
s.addText("Justice", { x: M + 0.84, y: 2.16, w: 4.5, h: 0.4, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 17, bold: true, color: WHITE });
s.addText("Perlakuan yang adil terhadap setiap orang dalam satu situasi, sehingga semua pihak memperoleh apa yang memang menjadi haknya.", {
  x: M + 0.34, y: 2.62, w: 4.95, h: 0.66, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 12, color: PALE, lineSpacingMultiple: 1.14, italic: true });
label(s, M + 0.34, 3.36, 4.95, "VEIL OF IGNORANCE", EMBER);
s.addText("Susunan apa yang akan Anda pilih bila Anda belum tahu posisi yang akan Anda tempati di dalamnya?", {
  x: M + 0.34, y: 3.66, w: 4.95, h: 0.86, isTextBox: true, margin: 0, valign: "top", fontFace: HF, fontSize: 13.5, color: WHITE, lineSpacingMultiple: 1.1 });
card(s, M, 4.98, 2.72, 1.56, SURF);
label(s, M + 0.26, 5.16, 2.2, "PROSEDURAL", EMBER);
para(s, M + 0.26, 5.44, 2.24, 1.0, "Adil pada prosesnya. Siapa yang boleh ikut memutuskan dan dengan cara apa.", 11.5, BODY, 1.12);
card(s, M + 2.88, 4.98, 2.72, 1.56, SURF);
label(s, M + 3.14, 5.16, 2.2, "DISTRIBUTIF", EMBER);
para(s, M + 3.14, 5.44, 2.24, 1.0, "Adil pada hasilnya. Ke mana manfaat mengalir dan siapa menanggung bebannya.", 11.5, BODY, 1.12);
card(s, M + 6.05, 1.96, 6.04, 2.86, SURF);
label(s, M + 6.39, 2.16, 5.4, "DUA PRINSIP KEADILAN JOHN RAWLS", EMBER);
numChip(s, M + 6.39, 2.52, 1, EMBER, 0.32);
s.addText("Prinsip kebebasan", { x: M + 6.80, y: 2.50, w: 5.0, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13.5, bold: true, color: INK });
para(s, M + 6.80, 2.82, 5.0, 0.5, "Setiap orang berhak atas kebebasan dasar seluas mungkin yang tetap sejalan dengan kebebasan serupa bagi orang lain.", 11.5, BODY, 1.1);
numChip(s, M + 6.39, 3.48, 2, EMBER, 0.32);
s.addText("Prinsip perbedaan", { x: M + 6.80, y: 3.46, w: 5.0, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13.5, bold: true, color: INK });
para(s, M + 6.80, 3.78, 5.0, 0.94, "Ketimpangan hanya dibenarkan bila posisi yang menghasilkannya terbuka bagi semua dalam kesetaraan kesempatan yang adil, dan bila ketimpangan itu paling menguntungkan pihak yang paling tidak diuntungkan.", 11.5, BODY, 1.1);
card(s, M + 6.05, 5.00, 6.04, 1.54, SURF2);
label(s, M + 6.39, 5.18, 5.4, "TEORI KONTRAK SOSIAL", EMBER);
para(s, M + 6.39, 5.46, 5.4, 0.96, "Berakar pada Hobbes, Locke, dan Rousseau. Versi bisnisnya adalah Integrative Social Contracts Theory dari Donaldson dan Dunfee, yang memadukan hypernorms yang berlaku universal dengan kontrak mikro tingkat komunitas di dalam ruang yang mereka sebut moral free space.", 11.5, BODY, 1.12);
foot(s, "Crane dan Matten (2019), halaman 108 sampai 113. Rawls, A Theory of Justice (1971).", 10);
s.addNotes("2 menit. Veil of ignorance adalah alat paling mudah dipakai mahasiswa. Latihan singkat: bila Anda tidak tahu akan lahir sebagai pemegang saham atau warga hilir sungai, kebijakan mana yang Anda pilih?");

/* ============ 11 BATAS TEORI MODERNIS ============ */
s = pres.addSlide(); bg(s);
head(s, "05   TITIK BALIK", "Enam keberatan atas teori modernis", "Keberatan inilah yang melahirkan empat teori alternatif pada bagian berikutnya.");
const batas = [
  ["Terlalu abstrak", "Prinsipnya melayang jauh di atas persoalan yang benar-benar dihadapi manajer setiap hari."],
  ["Terlalu reduksionis", "Setiap teori memusatkan perhatian pada satu aspek moralitas, lalu memperlakukannya seolah itu keseluruhan."],
  ["Terlalu objektif dan elitis", "Kebenaran moral ditentukan para ahli lewat deduksi, bukan oleh orang yang menjalani situasinya."],
  ["Terlalu impersonal", "Ikatan pribadi dan tanggung jawab pada orang tertentu justru dianggap mengganggu penilaian."],
  ["Terlalu rasional dan terkodifikasi", "Perasaan, empati, dan dorongan moral dipandang rendah, padahal itu yang sering menggerakkan tindakan."],
  ["Terlalu imperialis", "Pengalaman dan tradisi berpikir Barat diangkat menjadi ukuran yang seolah berlaku bagi semua kebudayaan."]];
const cw6 = (CW - 0.8) / 3;
batas.forEach((b, i) => { const col = i % 3, row = Math.floor(i / 3);
  const xx = M + col * (cw6 + 0.4), yy = 1.94 + row * 2.18;
  card(s, xx, yy, cw6, 2.02, row === 0 ? SURF : SURF2);
  numChip(s, xx + 0.3, yy + 0.22, i + 1, INK, 0.32);
  s.addText(b[0], { x: xx + 0.3, y: yy + 0.64, w: cw6 - 0.6, h: 0.52, isTextBox: true, margin: 0, valign: "top", fontFace: HF, fontSize: 15, bold: true, color: INK, lineSpacingMultiple: 1.05 });
  para(s, xx + 0.3, yy + 1.20, cw6 - 0.6, 0.74, b[1], 11.5, BODY, 1.12); });
card(s, M, 6.36, CW, 0.55, TEAL_S);
s.addText("Teori alternatif tidak menggantikan teori modernis. Ia menambahkan pertanyaan yang tidak pernah diajukan, yaitu tentang karakter pelaku, relasi yang terlibat, prosedur perumusan norma, dan pilihan kata yang dipakai.", {
  x: M + 0.34, y: 6.36, w: CW - 0.68, h: 0.55, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11.5, color: "1F4F46", italic: true });
foot(s, null, 11);
s.addNotes("1 menit. Slide transisi. Sampaikan bahwa keberatan nomor 3 sampai 5 yang paling menentukan bagi kasus nikel, karena warga terdampak tidak pernah jadi pihak dalam perumusan.");

/* ---- pola halaman dua teori alternatif ---- */
function altCard(sl, x, no, name, question, contributors, rows, dark) {
  card(sl, x, 1.96, 5.82, 4.74, dark ? INK : SURF);
  numChip(sl, x + 0.34, 2.18, no, TEAL, 0.4);
  sl.addText(name, { x: x + 0.84, y: 2.18, w: 4.6, h: 0.4, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 18, bold: true, color: dark ? WHITE : INK });
  sl.addText(question, { x: x + 0.34, y: 2.68, w: 5.14, h: 0.56, isTextBox: true, margin: 0, valign: "top", fontFace: HF, fontSize: 13.5, italic: true, color: dark ? PALE : TEAL, lineSpacingMultiple: 1.1 });
  sl.addText(contributors, { x: x + 0.34, y: 3.30, w: 5.14, h: 0.46, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 10.5, color: dark ? MUTED_D : MUTED, lineSpacingMultiple: 1.1 });
  rows.forEach((r, i) => { const yy = 3.84 + i * 0.98;
    sl.addText(r[0], { x: x + 0.34, y: yy, w: 5.14, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 9.5, bold: true, color: dark ? TEAL_S : TEAL, charSpacing: 1.1 });
    sl.addText(r[1], { x: x + 0.34, y: yy + 0.26, w: 5.14, h: 0.66, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11.5, color: dark ? PALE : BODY, lineSpacingMultiple: 1.12 }); });
}

/* ============ 12 VIRTUE DAN CARE ============ */
s = pres.addSlide(); bg(s);
head(s, "06   TEORI ALTERNATIF", "Virtue ethics dan ethic of care", "Yang dinilai bergeser dari tindakan ke karakter pelaku dan ke relasi di antara pihak yang terlibat.");
altCard(s, M, 6, "Virtue ethics", "Pelaku seperti apa yang pantas disebut baik pada posisi ini?",
  "Aristoteles dalam Nicomachean Ethics, Alasdair MacIntyre dalam After Virtue, dan Robert Solomon dalam Ethics and Excellence.", [
  ["GAGASAN INTI", "Moralitas tidak lahir dari aturan, melainkan dari karakter yang dibentuk lewat pembiasaan. Tujuannya eudaimonia, yaitu hidup yang baik dan berkembang penuh."],
  ["DALAM KONTEKS BISNIS", "Solomon menempatkan perusahaan sebagai komunitas praktik, dengan keutamaan berupa kejujuran, keadilan, kepercayaan, dan ketangguhan."],
  ["BATASNYA", "Keutamaan selalu ditentukan komunitas tertentu, sehingga sulit dijadikan ukuran yang berlaku lintas budaya dan lintas industri."]], false);
altCard(s, M + 6.27, 7, "Ethic of care", "Solusi mana yang memelihara relasi dengan pihak terdampak?",
  "Carol Gilligan dalam In a Different Voice dan Nel Noddings dalam Caring. Berakar pada etika feminis.", [
  ["GAGASAN INTI", "Manusia dipahami sebagai makhluk yang saling bergantung dan terjalin dalam relasi, bukan sebagai individu rasional yang terpisah."],
  ["YANG DITUNTUT", "Empati, keselarasan, menghindari kerugian, dan tanggung jawab konkret pada orang tertentu, bukan penerapan aturan yang seragam."],
  ["BATASNYA", "Mendahulukan yang dekat berisiko mengabaikan pihak jauh, dan kriteria kepedulian sulit diaudit dengan cara yang sama."]], true);
foot(s, "Crane dan Matten (2019), Tabel 3.5, halaman 114 sampai 121.", 12);
s.addNotes("2,5 menit. Virtue ethics sering disalahpahami sebagai imbauan moral. Tekankan pertanyaan pembandingnya: dibandingkan dengan apa kita menyebut sesuatu sudah cukup baik? Itu yang jadi kunci di bagian kasus.");

/* ============ 13 DISCOURSE DAN POSTMODERN ============ */
s = pres.addSlide(); bg(s);
head(s, "06   TEORI ALTERNATIF", "Discourse ethics dan postmodern ethics", "Yang dinilai bergeser lagi, kali ini ke prosedur perumusan norma dan ke bahasa yang dipakai membenarkannya.");
altCard(s, M, 8, "Discourse ethics", "Norma apa yang bisa lahir dari deliberasi yang terbuka?",
  "Jurgen Habermas dalam Moral Consciousness and Communicative Action, bersama Karl Otto Apel.", [
  ["GAGASAN INTI", "Norma tidak ditetapkan filsuf dari luar, melainkan dihasilkan oleh dialog rasional di antara semua pihak yang terkena dampaknya."],
  ["SYARAT IDEAL SPEECH SITUATION", "Semua pihak terdampak boleh ikut, bebas dari paksaan, dan argumen dinilai dari kekuatannya sendiri, bukan dari kekuasaan pengusulnya."],
  ["TUJUANNYA", "Penyelesaian konflik secara damai, bukan pembuktian satu kebenaran tunggal. Prosedur yang cacat cukup untuk membatalkan hasilnya."]], false);
altCard(s, M + 6.27, 9, "Postmodern ethics", "Kepentingan siapa yang dilayani oleh pilihan istilah?",
  "Zygmunt Bauman dalam Postmodern Ethics, dengan latar pemikiran Derrida dan Lyotard.", [
  ["GAGASAN INTI", "Mendahulukan dorongan moral dan perasaan daripada perhitungan rasional. Yang menggerakkan orang berbuat benar sering firasat."],
  ["KRITIK PADA ORGANISASI", "Prosedur, pembagian tugas, dan jarak birokratis menciptakan jarak moral yang menumpulkan dorongan itu."],
  ["SIKAP YANG DIANJURKAN", "Mempertanyakan bahasa dan asumsi yang sudah dianggap wajar, lalu bertindak pada skala lokal tempat akibatnya terasa."]], true);
foot(s, "Crane dan Matten (2019), Tabel 3.5, halaman 121 sampai 125.", 13);
s.addNotes("2,5 menit. Discourse ethics menilai proses, jadi ia bisa membatalkan kebijakan yang hasilnya bagus sekalipun. Postmodern ethics menilai bahasa, dan itu yang akan membongkar istilah nikel hijau nanti.");

/* ============ 14 DAFTAR PERIKSA ============ */
s = pres.addSlide(); bg(s);
head(s, "07   JEMBATAN KE KASUS", "Sembilan pertanyaan, satu daftar periksa", "Tidak ada teori yang memberi jawaban lengkap. Yang dicari bukan jawaban tunggal, melainkan pertimbangan yang paling kuat menanggung beban argumen.");
const tanya = [
  [1, "Egoism", "Apakah semua pihak bebas mengejar kepentingan jangka panjangnya, dan sudahkah biaya tertunda dihitung?", EMBER],
  [2, "Utilitarianism", "Bila seluruh akibat diagregasi, apakah hasilnya positif? Apakah act dan rule sepakat?", EMBER],
  [3, "Ethics of duty", "Dapatkah maksim tindakan ini diuniversalkan, dan adakah pihak yang diperlakukan sekadar sarana?", EMBER],
  [4, "Ethics of rights", "Hak siapa yang terpenuhi, hak siapa yang terlanggar, dan sampai mana relasi bisnisnya menjangkau?", EMBER],
  [5, "Justice", "Susunan apa yang akan dipilih orang yang belum tahu posisi yang akan ditempatinya?", EMBER],
  [6, "Virtue ethics", "Bagaimana pelaku berkarakter baik bertindak di posisi ini, dan dibandingkan dengan standar mana?", TEAL],
  [7, "Ethic of care", "Solusi mana yang memelihara relasi dengan pihak terdampak, bukan sekadar mengganti kerugiannya?", TEAL],
  [8, "Discourse ethics", "Siapa yang hadir dan siapa yang absen ketika norma dan izinnya dirumuskan?", TEAL],
  [9, "Postmodern ethics", "Kepentingan siapa yang dilayani oleh istilah yang dipakai menamai kebijakan ini?", TEAL]];
const colw = (CW - 0.45) / 2;
tanya.forEach((t, i) => { const col = i < 5 ? 0 : 1, row = i < 5 ? i : i - 5;
  const xx = M + col * (colw + 0.45), yy = 1.94 + row * 0.98;
  card(s, xx, yy, colw, 0.88, i % 2 === 0 ? SURF : SURF2);
  numChip(s, xx + 0.26, yy + 0.19, t[0], t[3], 0.3);
  s.addText(t[1], { x: xx + 0.65, y: yy + 0.12, w: colw - 0.95, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13.5, bold: true, color: INK });
  s.addText(t[2], { x: xx + 0.65, y: yy + 0.40, w: colw - 0.95, h: 0.40, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11, color: BODY, lineSpacingMultiple: 1.08 }); });
card(s, M + colw + 0.45, 5.86, colw, 0.88, INK);
s.addText("Inilah pendekatan pluralis yang dianjurkan Bab 3. Sembilan penilaian atas satu rangkaian fakta yang identik, lalu kita lihat ke mana mayoritasnya bermuara.", {
  x: M + colw + 0.79, y: 5.86, w: colw - 0.68, h: 0.88, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11.5, color: PALE, italic: true, lineSpacingMultiple: 1.14 });
foot(s, null, 14);
s.addNotes("1 menit. Minta kelas memotret slide ini. Selama bagian kasus, mereka bisa menandai sendiri jawaban tiap pertanyaan sebelum kita bahas.");

/* ============ 15 ANATOMI KEBIJAKAN ============ */
s = pres.addSlide(); bg(s, true);
head(s, "BAGIAN DUA   |   STUDI KASUS INDONESIA", "Anatomi kebijakan hilirisasi nikel", "Satu instrumen regulasi yang mengubah struktur industri nikel nasional, dan menimbulkan sengketa di dua arah sekaligus.", true);
const cwa = (CW - 0.8) / 3;
[["INSTRUMEN", "Peraturan Menteri ESDM Nomor 11 Tahun 2019 melarang ekspor bijih nikel dan berlaku efektif 1 Januari 2020, lebih awal dari jadwal semula."],
 ["MEKANISME", "Bijih wajib diolah di dalam negeri dan kepemilikan smelter menjadi syarat, sehingga modal pengolahan mengalir ke kawasan industri terpadu Morowali dan Weda Bay."],
 ["SENGKETA", "Panel WTO memutus kebijakan ini melanggar aturan perdagangan pada November 2022. Bandingnya menggantung karena Badan Banding tidak berfungsi."]
].forEach((a, i) => { const xx = M + i * (cwa + 0.4);
  card(s, xx, 1.96, cwa, 1.86, INK2);
  numChip(s, xx + 0.3, 2.18, i + 1, EMBER, 0.32);
  s.addText(a[0], { x: xx + 0.72, y: 2.18, w: cwa - 1.0, h: 0.32, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10, bold: true, color: EMBER, charSpacing: 1.3 });
  s.addText(a[1], { x: xx + 0.3, y: 2.64, w: cwa - 0.6, h: 1.0, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11.5, color: PALE, lineSpacingMultiple: 1.14 }); });
s.addText("KRONOLOGI", { x: M, y: 4.10, w: 4.0, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10, bold: true, color: MUTED_D, charSpacing: 1.3 });
const cwk = (CW - 0.6) / 5;
[["2014", "Larangan ekspor bijih diberlakukan, lalu direlaksasi bagi kadar rendah"],
 ["2019", "Larangan ditegakkan kembali lewat Permen ESDM Nomor 11"],
 ["2020", "Larangan berlaku efektif dan arus modal smelter masuk"],
 ["2022", "Panel WTO memenangkan gugatan Uni Eropa"],
 ["2025", "Ekspor produk nikel olahan mencapai 40 miliar dolar Amerika"]
].forEach((k, i) => { const xx = M + i * (cwk + 0.15);
  card(s, xx, 4.44, cwk, 1.32, INK2);
  s.addText(k[0], { x: xx + 0.22, y: 4.58, w: cwk - 0.44, h: 0.38, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 20, bold: true, color: EMBER });
  s.addText(k[1], { x: xx + 0.22, y: 4.98, w: cwk - 0.44, h: 0.68, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 10, color: PALE2, lineSpacingMultiple: 1.1 }); });
card(s, M, 5.98, CW, 0.72, EMBER);
s.addText("Kasus ini dipilih karena strukturnya khas: manfaatnya besar, terukur, dan terkonsentrasi, sedangkan bebannya tersebar, tertunda, dan sulit dikuantifikasi. Persis jenis persoalan yang tidak selesai dengan satu kriteria penilaian.", {
  x: M + 0.34, y: 5.98, w: CW - 0.68, h: 0.72, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 12, color: WHITE, italic: true, lineSpacingMultiple: 1.14 });
foot(s, "Data ditelusuri Agustus 2026 dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, Kementerian Perindustrian, dan dokumen putusan panel WTO.", 15, true);
s.addNotes("2 menit. Sebutkan bahwa kebijakannya masih berjalan dan sengketa dagangnya belum tuntas. Kasus yang belum selesai justru paling layak didiskusikan di kelas.");

/* ============ 16 DUA NARASI ============ */
s = pres.addSlide(); bg(s);
head(s, "08   FAKTA", "Dua narasi atas fakta yang sama", "Kedua kolom bersandar pada data resmi yang sama sahnya. Yang disengketakan bukan faktanya, melainkan kriteria penilaiannya.");
card(s, M, 1.94, 5.82, 4.12, SURF);
card(s, M + 6.27, 1.94, 5.82, 4.12, INK);
label(s, M + 0.34, 2.14, 5.2, "PENDUKUNG   |   HILIRISASI BERDAULAT", EMBER);
s.addText("PENENTANG   |   EKSTRAKSI BERBIAYA SOSIAL", { x: M + 6.61, y: 2.14, w: 5.2, h: 0.24, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 9.5, bold: true, color: EMBER_L, charSpacing: 1.2 });
[["40 miliar dolar", "Nilai ekspor produk nikel olahan pada 2025, naik dari 3 miliar dolar pada 2020"],
 ["41,5 miliar dolar", "Investasi terkumpul di kawasan IMIP Morowali sampai Desember 2025"],
 ["166 ribu pekerja", "Terserap di IMIP dan IWIP, dari 35.952 orang pada 2020 di Morowali saja"],
 ["Pemasok terbesar", "Indonesia menjadi simpul utama rantai pasok baterai kendaraan listrik dunia"]
].forEach((p, i) => { const yy = 2.48 + i * 0.88;
  s.addText(p[0], { x: M + 0.34, y: yy, w: 5.2, h: 0.34, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 18, bold: true, color: INK });
  s.addText(p[1], { x: M + 0.34, y: yy + 0.34, w: 5.2, h: 0.48, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11, color: BODY, lineSpacingMultiple: 1.1 }); });
[["3 sampai 3,6 juta", "Upah pokok per bulan, di bawah upah minimum Morowali 2025 sebesar 3,7 juta, dengan biaya hidup sekitar 7,5 juta"],
 ["107 pekerja meninggal", "Beserta 155 pekerja luka pada 104 kecelakaan smelter nikel sepanjang 2019 sampai 2025"],
 ["163 ribu hektare", "Tutupan pohon hilang di Halmahera, sementara industri nikel memegang 76 persen PLTU captive nasional"],
 ["4,35 persen", "Nilai tambah yang tinggal di Morowali, yang kemiskinannya 12,58 persen dan di atas rata-rata provinsi"]
].forEach((p, i) => { const yy = 2.48 + i * 0.88;
  s.addText(p[0], { x: M + 6.61, y: yy, w: 5.2, h: 0.34, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 18, bold: true, color: EMBER_L });
  s.addText(p[1], { x: M + 6.61, y: yy + 0.34, w: 5.2, h: 0.48, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11, color: PALE2, lineSpacingMultiple: 1.1 }); });
card(s, M, 6.32, CW, 0.52, SURF2);
s.addText("Beban yang tidak masuk neraca ekspor: sungai Ake Jira tidak lagi layak dipakai warga, kadar amonia di Kobe 0,3752 terhadap ambang 0,1 miligram per liter, dan 40 persen wilayah adat O Hongana Manyawa sudah berizin tambang.", {
  x: M + 0.34, y: 6.32, w: CW - 0.68, h: 0.52, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11, color: BODY });
foot(s, null, 16);
s.addNotes("2 menit. Jangan berdebat soal angka. Tegaskan kedua kolom benar. Justru itu yang membuat kasus ini butuh sembilan kriteria, bukan satu.");

/* ============ 17 LIMA LENSA MODERNIS ============ */
s = pres.addSlide(); bg(s);
head(s, "09   PENERAPAN", "Lima lensa modernis atas kebijakan ini", "Penilaian berbasis akibat dan berbasis prinsip, dengan putusan yang ternyata tidak seragam.");
[[1, "Egoism", "NETRAL", MUTED, "Pada horizon pendek jelas melayani kepentingan Indonesia. Pada horizon panjang, biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit batu bara belum diinternalisasi. Kepentingan diri yang dihitung cermat justru menuntut biaya tertunda itu masuk sejak awal."],
 [2, "Utilitarianism", "TERBELAH", GOLD, "Act utilitarianism cenderung mendukung, sebab manfaat 166 ribu lapangan kerja nyata dan terukur sedangkan kerugiannya tersebar. Rule utilitarianism menolak, sebab bila setiap negara pemilik cadangan menempuh pengolahan bertenaga batu bara, tambahan emisinya membatalkan manfaat transisi energi yang justru menjadi pembenar kebijakan ini."],
 [3, "Ethics of duty", "MENOLAK", EMBER, "Maksimnya berbunyi: pengolahan boleh dipercepat sambil menunda standar upah, keselamatan, dan lingkungan. Diuniversalkan, standar itu kehilangan daya ikat. Formulasi kedua juga gagal, sebab upah di bawah minimum dan lembur sampai 13 jam menjadikan pekerja sarana semata."],
 [4, "Ethics of rights", "BERSYARAT", GOLD, "Hak atas pekerjaan terpenuhi bagi 166 ribu pekerja, dan sampai titik itu kebijakan ini dapat dipertahankan. Namun hak atas kondisi kerja yang adil, kesehatan, air bersih, dan tanah leluhur terlanggar bersamaan. UNGP menuntut penghormatan pada seluruh relasi bisnis, termasuk pemasok."],
 [5, "Justice", "MENOLAK", EMBER, "Manfaat mengalir ke penerimaan nasional dan pemodal, sedangkan beban terkonsentrasi pada pekerja kawasan, warga hilir sungai, dan masyarakat adat. Kabupaten penghasil justru lebih miskin daripada rata-rata provinsinya dan hanya 4,35 persen nilai tambah tinggal di daerah."]
].forEach((l, i) => { const yy = 1.94 + i * 0.98;
  card(s, M, yy, CW, 0.88, i % 2 === 0 ? SURF : SURF2);
  numChip(s, M + 0.28, yy + 0.19, l[0], EMBER, 0.3);
  s.addText(l[1], { x: M + 0.68, y: yy + 0.12, w: 2.0, h: 0.28, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 14, bold: true, color: INK });
  verdictChip(s, M + 0.68, yy + 0.44, 1.72, l[2], l[3]);
  s.addText(l[4], { x: M + 2.86, y: yy + 0.10, w: CW - 3.2, h: 0.68, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 11, color: BODY, lineSpacingMultiple: 1.1 }); });
foot(s, "Dua teori sekeluarga menghasilkan kesimpulan berbeda, dan pemisahnya semata unit analisis: satu tindakan, atau kelas tindakan.", 17);
s.addNotes("3 menit. Bagian terpenting: utilitarianism terbelah. Tunjukkan bahwa perbedaan act dan rule bukan detail teknis, melainkan yang menentukan putusan.");

/* ============ 18 EMPAT LENSA ALTERNATIF ============ */
s = pres.addSlide(); bg(s);
head(s, "10   PENERAPAN", "Empat lensa alternatif atas kasus sama", "Penilaian bergeser ke karakter pelaku, relasi, prosedur, dan bahasa. Tidak satu pun mengubah faktanya.");
const cw4 = (CW - 0.45) / 2;
[[6, "Virtue ethics", "MENOLAK FRAMING", EMBER, "Berkarakter baik diukur dari standar yang mana?", "Pembandingnya selama ini adalah keadaan sebelum hilirisasi, bukan standar industri terbaik yang tersedia hari ini. Aktor berkarakter baik mengukur diri pada standar tertinggi yang dapat dicapai, bukan pada titik berangkatnya sendiri."],
 [7, "Ethic of care", "MENUNTUT PEMULIHAN", GOLD, "Relasi dengan pihak terdampak dipelihara atau tidak?", "Warga hilir sungai dan sekitar 300 sampai 500 jiwa O Hongana Manyawa adalah pihak yang berelasi, bukan variabel biaya dalam neraca. Yang dituntut pemulihan sungai dan wilayah lindung, bukan penghentian mendadak yang mencabut penghidupan pekerja."],
 [8, "Discourse ethics", "MENOLAK PROSES", EMBER, "Siapa yang hadir dan siapa yang absen?", "Warga terdampak bukan pihak dalam perumusan kebijakan maupun perizinan kawasan. Syarat keterlibatan setara dan bebas paksaan tidak terpenuhi sejak awal, dan cacat prosedur sudah cukup untuk membatalkan keabsahan hasilnya."],
 [9, "Postmodern ethics", "ANTI ABSOLUT", MUTED, "Kepentingan siapa yang dilayani pilihan istilah?", "Hilirisasi berkonotasi kemajuan, ekstraksi berkonotasi pengurasan, dan keduanya menamai peristiwa yang sama. Istilah nikel hijau dipakai bagi pengolahan yang listriknya bertumpu pada batu bara, sehingga ia mendahului penilaian atas fakta."]
].forEach((l, i) => { const col = i % 2, row = Math.floor(i / 2);
  const xx = M + col * (cw4 + 0.45), yy = 1.96 + row * 2.48;
  card(s, xx, yy, cw4, 2.30, row === 0 ? SURF : SURF2);
  numChip(s, xx + 0.3, yy + 0.22, l[0], TEAL, 0.34);
  s.addText(l[1], { x: xx + 0.74, y: yy + 0.20, w: 2.9, h: 0.34, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 15.5, bold: true, color: INK });
  verdictChip(s, xx + cw4 - 2.16, yy + 0.24, 1.86, l[2], l[3]);
  s.addText(l[4], { x: xx + 0.3, y: yy + 0.64, w: cw4 - 0.6, h: 0.32, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 12, italic: true, color: TEAL });
  para(s, xx + 0.3, yy + 1.02, cw4 - 0.6, 1.12, l[5], 11.5, BODY, 1.14); });
foot(s, "Keempat lensa ini menyoroti apa yang luput dari lima lensa sebelumnya: pembanding, relasi, pihak yang absen, dan pilihan kata.", 18);
s.addNotes("2,5 menit. Perhatikan bahwa ethic of care tidak menolak kebijakan. Ia menuntut pemulihan. Ini contoh bagus bahwa pluralisme bukan berarti semua teori berkata sama.");

/* ============ 19 MATRIKS DAN KLAIM ============ */
s = pres.addSlide(); bg(s);
head(s, "11   SINTESIS", "Matriks putusan dan klaim nikel hijau", "Tidak satu pun dari sembilan lensa berbunyi mendukung tanpa syarat.");
card(s, M, 1.94, 5.6, 4.88, SURF);
label(s, M + 0.34, 2.16, 5.0, "SEMBILAN PUTUSAN", EMBER);
[[1, "Egoism", "Netral", MUTED], [2, "Utilitarianism", "Terbelah", GOLD], [3, "Ethics of duty", "Menolak", EMBER],
 [4, "Ethics of rights", "Bersyarat", GOLD], [5, "Justice", "Menolak", EMBER], [6, "Virtue ethics", "Menolak framing", EMBER],
 [7, "Ethic of care", "Menuntut pemulihan", GOLD], [8, "Discourse ethics", "Menolak proses", EMBER], [9, "Postmodern ethics", "Anti absolut", MUTED]
].forEach((m, i) => { const yy = 2.52 + i * 0.40;
  numChip(s, M + 0.34, yy + 0.03, m[0], i < 5 ? EMBER : TEAL, 0.26);
  s.addText(m[1], { x: M + 0.69, y: yy, w: 2.5, h: 0.32, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 12, bold: true, color: INK });
  s.addText(m[2], { x: M + 3.24, y: yy, w: 2.05, h: 0.32, isTextBox: true, margin: 0, valign: "middle", align: "right", fontFace: BF, fontSize: 11.5, bold: true, color: m[3] }); });
card(s, M + 0.34, 6.14, 4.95, 0.50, INK);
s.addText("Enam menolak, satu bersyarat, satu terbelah, satu netral karena mengakui batas teorinya sendiri.", {
  x: M + 0.56, y: 6.14, w: 4.51, h: 0.50, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10.5, color: PALE });
label(s, M + 6.05, 2.16, 6.0, "EMPAT PROPOSISI YANG DITURUNKAN DARI KESEMBILAN LENSA", EMBER);
[["Perbandingan masa lalu tidak bernilai normatif", "Keadaan yang lebih baik daripada ekspor bijih mentah tidak dengan sendirinya memadai. Virtue ethics menuntut pembanding pada standar tertinggi."],
 ["Klaim hijau gugur pada sumber energinya", "Pengolahan yang bertumpu pada pembangkit batu bara di dalam kawasan tidak dapat disebut hijau. Postmodern ethics membacanya sebagai alat pembenar."],
 ["Distribusi manfaat dan beban tidak simetris", "Hanya 4,35 persen nilai tambah tinggal di daerah, sementara kabupaten penghasil lebih miskin daripada rata-rata provinsinya. Rawls menolaknya."],
 ["Prosesnya cacat sejak perumusan", "Warga terdampak tidak menjadi pihak dalam perizinan dan perencanaan kawasan. Discourse ethics membatalkan hasil dari proses semacam itu."]
].forEach((p, i) => { const yy = 2.52 + i * 1.10;
  card(s, M + 6.05, yy, 6.04, 1.0, i % 2 === 0 ? SURF : SURF2);
  numChip(s, M + 6.31, yy + 0.18, i + 1, INK, 0.3);
  s.addText(p[0], { x: M + 6.71, y: yy + 0.14, w: 5.14, h: 0.3, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13.5, bold: true, color: INK });
  s.addText(p[1], { x: M + 6.71, y: yy + 0.44, w: 5.14, h: 0.48, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11, color: BODY, lineSpacingMultiple: 1.08 }); });
foot(s, "Penolakan atas klaim nikel hijau tidak setara dengan penolakan atas hilirisasi. Keduanya persoalan yang terpisah.", 19);
s.addNotes("2,5 menit. Ini inti kontribusi analisis. Tekankan proposisi keempat: yang gugur adalah klaim etisnya, bukan kebijakan hilirisasinya.");

/* ============ 20 SIMPULAN ============ */
s = pres.addSlide(); bg(s, true);
head(s, "PENUTUP", "Simpulan dan implikasi manajerial", "Tiga temuan dari pengujian, lalu tiga tindak lanjut yang bisa langsung dikerjakan manajemen.", true);
[["Konvergensi, bukan kesepakatan", "Sembilan teori berangkat dari premis berbeda, namun mayoritasnya bermuara pada arah yang sama. Konvergensi dari titik masuk berbeda inilah bukti terkuat pluralisme."],
 ["Yang gugur adalah klaimnya", "Yang gugur bukan kebijakan hilirisasinya, melainkan klaim bahwa kebijakan ini sudah etis. Upah, keselamatan, lingkungan, dan sumber energinya tetap terbuka diperbaiki."],
 ["Kasusnya belum selesai", "Kebijakannya masih berjalan, sengketa dagangnya belum tuntas, dan angkanya berubah tiap tahun. Kasus yang belum selesai justru paling layak didiskusikan."]
].forEach((t, i) => { const xx = M + i * (cwa + 0.4);
  card(s, xx, 1.94, cwa, 2.46, INK2);
  numChip(s, xx + 0.3, 2.14, i + 1, EMBER, 0.34);
  s.addText(t[0], { x: xx + 0.3, y: 2.56, w: cwa - 0.6, h: 0.54, isTextBox: true, margin: 0, valign: "top", fontFace: HF, fontSize: 15.5, bold: true, color: WHITE, lineSpacingMultiple: 1.05 });
  s.addText(t[1], { x: xx + 0.3, y: 3.16, w: cwa - 0.6, h: 1.0, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11.5, color: PALE2, lineSpacingMultiple: 1.14 }); });
s.addText("IMPLIKASI MANAJERIAL", { x: M, y: 4.56, w: 5.0, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 10, bold: true, color: MUTED_D, charSpacing: 1.3 });
[["Internalisasi biaya tertunda", "Biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit masuk neraca sejak perencanaan, bukan diwariskan ke anggaran publik."],
 ["Hadirkan pihak yang absen", "Pekerja, warga hilir, dan masyarakat adat diberi keterwakilan formal dalam panitia keselamatan kerja, pemantauan lingkungan, dan perizinan."],
 ["Uji dengan banyak teori", "Klaim yang lolos utilitarianism kerap gugur pada keadilan distributif dan discourse ethics. Sembilan pertimbangan tadi jadi daftar periksa."]
].forEach((t, i) => { const xx = M + i * (cwa + 0.4);
  card(s, xx, 4.84, cwa, 1.40, INK2);
  s.addText(t[0], { x: xx + 0.3, y: 4.98, w: cwa - 0.6, h: 0.30, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13.5, bold: true, color: EMBER });
  s.addText(t[1], { x: xx + 0.3, y: 5.30, w: cwa - 0.6, h: 0.80, isTextBox: true, margin: 0, valign: "top", fontFace: BF, fontSize: 11, color: PALE2, lineSpacingMultiple: 1.12 }); });
card(s, M, 6.44, CW, 0.54, EMBER);
s.addText("Manfaat yang terukur selalu lebih mudah dipertahankan daripada beban yang tersebar. Justru karena itu beban yang tersebar perlu dihitung lebih dahulu.", {
  x: M + 0.34, y: 6.44, w: CW - 0.68, h: 0.54, isTextBox: true, margin: 0, valign: "middle", fontFace: HF, fontSize: 13.5, color: WHITE, italic: true });
s.addText("Aslih Abnuri   |   25/574338/PEK/31801   |   Business Ethics for Sustainability, MBA Universitas Gadjah Mada", {
  x: M, y: 7.06, w: CW, h: 0.26, isTextBox: true, margin: 0, valign: "middle", fontFace: BF, fontSize: 9.5, color: MUTED });
s.addNotes("2 menit. Tutup dengan pertanyaan untuk diskusi: struktur dilema yang sama akan berulang pada bauksit, tembaga, dan timah. Siapa menikmati manfaatnya, siapa menanggung bebannya, dan apakah keduanya pihak yang sama?");

pres.writeFile({ fileName: "Evaluating-Business-Ethics-Hilirisasi-Nikel.pptx" }).then(f => console.log("WROTE " + f));
