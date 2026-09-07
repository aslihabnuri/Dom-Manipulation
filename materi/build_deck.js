// Membangun deck PPTX: Studi Kasus 4 - Inventory Management di Amazon.com
// Gaya: kolase foto hitam-putih dengan aksen oranye Amazon, kartu putih di atas latar peta.
// Jalankan:  IMG=/path/ke/img node build_deck.js
const pptxgen = require("pptxgenjs");
const path = require("path");

const IMG = process.env.IMG || path.join(__dirname, "img");
const OUT = path.join(__dirname, "Presentasi_Studi_Kasus_4_Amazon_Kelompok_4.pptx");

const BLACK = "111111", ORANGE = "FF9900", DARK = "232F3E", GRAY = "555555", MUTED = "8A8A8A", WHITE = "FFFFFF", LIGHT = "F3F3F3";
const HF = "Arial", BF = "Calibri";
const SW = 13.333, SH = 7.5;
// rasio lebar/tinggi hasil crop
const AR = { hero: 1.88, robots: 1.76, scanner: 1.47, totes: 1.68, packing: 1.38, delivery: 0.71, shelves: 1.93, sortation: 1.6, dock: 1.69, giftwrap: 1.45 };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Kelompok 4";
pres.title = "Studi Kasus 4: Inventory Management di Amazon.com";

let slideNo = 0;
function newSlide(opts = {}) {
  const s = pres.addSlide();
  slideNo += 1;
  s.background = { color: WHITE };
  s.addImage({ path: path.join(IMG, "map_bg.jpg"), x: 0, y: 0, w: SW, h: SH, transparency: opts.mapT ?? 55 });
  if (!opts.noFooter) {
    s.addText("Studi Kasus 4  |  Inventory Management di Amazon.com  |  Kelompok 4", {
      x: 0.5, y: SH - 0.42, w: 9, h: 0.3, fontFace: BF, fontSize: 9, color: MUTED, isTextBox: true, margin: 0,
    });
    s.addText(String(slideNo), { x: SW - 1.0, y: SH - 0.42, w: 0.5, h: 0.3, fontFace: HF, fontSize: 9, bold: true, color: ORANGE, align: "right", isTextBox: true, margin: 0 });
  }
  return s;
}
function card(s, x, y, w, h, opts = {}) {
  if (opts.offset !== false) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.09, y: y - 0.09, w, h, fill: { color: opts.offsetColor || ORANGE }, line: { color: opts.offsetColor || ORANGE, width: 0 }, rectRadius: 0.12 });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, fill: { color: opts.fill || WHITE }, line: { color: opts.fill || WHITE, width: 0 }, rectRadius: 0.12,
    shadow: { type: "outer", blur: 6, offset: 2, angle: 45, color: "000000", opacity: 0.16 },
  });
}
function pic(s, name, x, y, w, opts = {}) {
  const h = opts.h || w / AR[name];
  const ww = opts.h ? opts.h * AR[name] : w;
  s.addImage({ path: path.join(IMG, "crop", name + ".jpg"), x, y, w: ww, h });
  return { w: ww, h };
}
function H1(s, text, x, y, w, h, size = 30, color = BLACK) {
  s.addText(text.toUpperCase(), { x, y, w, h, fontFace: HF, fontSize: size, bold: true, color, charSpacing: -1, isTextBox: true, margin: 0, valign: "top" });
}
function H2(s, text, x, y, w, h, size = 16, color = BLACK) {
  s.addText(text.toUpperCase(), { x, y, w, h, fontFace: HF, fontSize: size, bold: true, color, isTextBox: true, margin: 0, valign: "top" });
}
function T(s, text, x, y, w, h, opts = {}) {
  s.addText(text, { x, y, w, h, fontFace: BF, fontSize: opts.size || 12, color: opts.color || GRAY, isTextBox: true, margin: 0, valign: opts.valign || "top", align: opts.align || "left", bold: opts.bold || false, italic: opts.italic || false, lineSpacingMultiple: 1.05 });
}
function NUM(s, n, x, y, size = 26) {
  s.addText("//" + n, { x, y, w: 1.4, h: 0.5, fontFace: HF, fontSize: size, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
}
function KICKER(s, text, x, y, w) {
  s.addText(text.toUpperCase(), { x, y, w, h: 0.3, fontFace: HF, fontSize: 10, bold: true, color: ORANGE, charSpacing: 2, isTextBox: true, margin: 0 });
}
function bullets(s, items, x, y, w, h, size = 12) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { code: "25A0" }, breakLine: i < items.length - 1, paraSpaceAfter: 5 } })), {
    x, y, w, h, fontFace: BF, fontSize: size, color: GRAY, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.05,
  });
}
function table(s, rows, x, y, w, colW, opts = {}) {
  const fs = opts.size || 10.5;
  const data = rows.map((r, ri) => r.map((c, ci) => ({
    text: c,
    options: ri === 0
      ? { bold: true, color: WHITE, fill: { color: DARK }, fontFace: HF, fontSize: fs - 0.5 }
      : { color: ci === 0 && opts.boldFirst !== false ? BLACK : GRAY, bold: ci === 0 && opts.boldFirst !== false, fill: { color: ri % 2 ? WHITE : "FAFAFA" }, fontFace: BF, fontSize: fs },
  })));
  s.addTable(data, { x, y, w, colW, border: { type: "solid", pt: 0.5, color: "D9D9D9" }, margin: 0.06, valign: "top", autoPage: false });
}

// ============================================================ 1. COVER
{
  const s = newSlide({ noFooter: true, mapT: 40 });
  KICKER(s, "Studi Kasus 4  ·  Operations & Technology Management  ·  Sesi 6", 0.6, 0.55, 9);
  s.addText("INVENTORY\nMANAGEMENT\nDI AMAZON.COM", { x: 0.6, y: 0.95, w: 6.4, h: 2.9, fontFace: HF, fontSize: 46, bold: true, color: BLACK, charSpacing: -2, lineSpacingMultiple: 0.92, isTextBox: true, margin: 0, valign: "top" });
  T(s, "Inventory Management Provides Competitive Advantage at Amazon.com\nHeizer, Render & Munson (2017), Operations Management 12th ed., Bab 12, hlm. 487–489", 0.6, 3.95, 6.2, 0.9, { size: 12, italic: true, color: GRAY });
  pic(s, "hero", 6.55, 1.0, 6.4);
  // kartu kelompok
  card(s, 0.6, 5.1, 5.9, 1.75);
  H2(s, "Kelompok 4", 0.85, 5.3, 3, 0.35, 15);
  T(s, "Bagaskoro  ·  Aulia Sisca Rahmadiyanti  ·  Fitra Aidila", 0.85, 5.7, 5.5, 0.35, { size: 12, color: BLACK, bold: true });
  T(s, "Dosen: Prof. Nur Aini Masruroh, ST., M.Sc., Ph.D.\nProgram Magister Manajemen, Universitas Gadjah Mada  ·  12 September 2026", 0.85, 6.05, 5.5, 0.7, { size: 11 });
  // kartu kecil kanan bawah
  card(s, 7.3, 5.3, 5.5, 1.55, { offsetColor: DARK });
  T(s, "Kasus dibaca dari strategi Amazon ke bawah, bukan dari gudang ke atas. Fokus pada kasus; teori disinggung secukupnya sebagai pintu masuk.", 7.55, 5.5, 5.05, 1.2, { size: 12, color: BLACK });
}

// ============================================================ 2. ANGGOTA & RUJUKAN
{
  const s = newSlide();
  KICKER(s, "Kelompok 4", 0.6, 0.5, 5);
  H1(s, "Anggota dan rujukan", 0.6, 0.8, 7, 0.7, 26);
  const members = [["Bagaskoro", "25/574280/PEK/31778"], ["Aulia Sisca Rahmadiyanti", "25/574305/PEK/31789"], ["Fitra Aidila", "25/574309/PEK/31791"]];
  members.forEach((m, i) => {
    const y = 1.75 + i * 1.25;
    card(s, 0.6, y, 5.6, 1.0);
    NUM(s, "0" + (i + 1), 0.85, y + 0.25, 22);
    T(s, m[0], 1.95, y + 0.2, 4.1, 0.35, { size: 15, bold: true, color: BLACK });
    T(s, "NIM " + m[1], 1.95, y + 0.56, 4.1, 0.3, { size: 11.5 });
  });
  card(s, 0.6, 5.55, 5.6, 1.25, { offsetColor: DARK });
  T(s, "Dosen pengampu", 0.85, 5.7, 5, 0.3, { size: 10, bold: true, color: ORANGE });
  T(s, "Prof. Nur Aini Masruroh, ST., M.Sc., Ph.D.", 0.85, 5.98, 5.2, 0.35, { size: 14, bold: true, color: BLACK });
  T(s, "Operations & Technology Management · Sesi 6 · Inventory Management", 0.85, 6.35, 5.2, 0.35, { size: 10.5 });
  // kanan: gambar + rujukan
  pic(s, "scanner", 6.7, 0.7, 6.0);
  card(s, 6.7, 5.0, 6.0, 1.85);
  H2(s, "Rujukan yang dipakai", 6.95, 5.15, 5.5, 0.3, 12);
  bullets(s, [
    "HRM Bab 12, hlm. 487–489: Global Company Profile Amazon.com (kasus utama)",
    "HRM Bab 12, hlm. 490–514 dan Suplemen 11: teori pendukung",
    "HRM Bab 9, hlm. 376: OM in Action, Amazon Lets Loose the Robots",
    "The OM Blog by Heizer, Render & Munson (2023, 2025): perkembangan terbaru",
  ], 6.95, 5.5, 5.55, 1.3, 10.5);
}

// ============================================================ 3. ALUR PEMBAHASAN
{
  const s = newSlide();
  KICKER(s, "Alur pembahasan", 0.6, 0.5, 5);
  H1(s, "Dari kisah sukses ke lesson learned", 0.6, 0.8, 9, 0.7, 26);
  T(s, "Urutan yang dipakai di kelas: kisah sukses, apa yang dilakukan perusahaan, mengapa berhasil, lalu apa yang bisa dan tidak bisa ditiru.", 0.6, 1.5, 8.5, 0.6, { size: 12.5 });
  const items = [
    ["A", "Kerangka berpikir", "Strategi dulu, baru keputusan teknis; dilema persediaan dan aturan keputusannya"],
    ["B", "Kisah sukses", "Dari pengecer virtual (1995) menjadi pengelola persediaan"],
    ["C", "Delapan langkah", "Apa yang dilakukan Amazon pada satu pesanan, dan kuantifikasinya"],
    ["D", "Analisis trade-off", "Mengapa berhasil; mana trade-off nyata, mana yang searah"],
    ["E", "Pintu masuk teori", "Konsep Bab 12 yang terlihat bekerja"],
    ["F", "Perkembangan", "Setelah buku terbit: 2023 dan 2025"],
    ["G", "Lesson learned", "Apa yang bisa dan tidak bisa ditiru"],
  ];
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 4.35, y = 2.3 + row * 1.15;
    card(s, x, y, 4.1, 0.95, { offset: i % 3 === 0 });
    s.addText("//" + it[0], { x: x + 0.2, y: y + 0.22, w: 0.9, h: 0.5, fontFace: HF, fontSize: 22, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
    T(s, it[1], x + 1.05, y + 0.14, 3.0, 0.3, { size: 13, bold: true, color: BLACK });
    T(s, it[2], x + 1.05, y + 0.45, 2.95, 0.5, { size: 9.5 });
  });
  pic(s, "delivery", 9.55, 1.55, 0, { h: 5.2 });
}

// ============================================================ 4. A.1 STRATEGI DULU
{
  const s = newSlide();
  KICKER(s, "Bagian A  ·  Kerangka berpikir", 0.6, 0.5, 6);
  H1(s, "Strategi dulu, baru teknis", 0.6, 0.8, 7.5, 0.7, 26);
  T(s, "Tentukan dulu apa yang mau dicapai (strategi dan value proposition), baru turunkan ke keputusan teknis. Inventory management ada di lapisan teknis itu, satu kelompok dengan MRP, sequencing, dan scheduling. Dalam sepuluh keputusan OM (Heizer), persediaan adalah keputusan ke-8.", 0.6, 1.55, 6.3, 1.5, { size: 12.5 });
  const q = [["How much", "Berapa banyak persediaan setiap item yang harus dimiliki?"], ["When", "Kapan harus memesan kembali?"], ["Where", "Item mana disimpan di gudang mana. Pertanyaan ketiga khusus Amazon, karena stok tersebar di lebih dari 150 gudang."]];
  q.forEach((it, i) => {
    const y = 3.25 + i * 1.15;
    card(s, 0.6, y, 6.3, 0.98, { offset: i === 2 });
    NUM(s, "0" + (i + 1), 0.85, y + 0.25, 22);
    T(s, it[0], 1.95, y + 0.14, 4.7, 0.32, { size: 14, bold: true, color: BLACK });
    T(s, it[1], 1.95, y + 0.47, 4.75, 0.5, { size: 10.5 });
  });
  pic(s, "shelves", 7.3, 1.2, 5.5);
  card(s, 7.3, 4.35, 5.5, 2.35, { offsetColor: DARK });
  H2(s, "Tiga pertanyaan ini yang dicari jawabannya di sepanjang kasus", 7.55, 4.55, 5.05, 0.6, 12);
  T(s, "How much dan when dijawab oleh model persediaan klasik. Where adalah keputusan yang membuat kasus Amazon berbeda dari toko tunggal: stok harus diletakkan dekat pelanggan sebelum pesanan datang.", 7.55, 5.2, 5.05, 1.4, { size: 11.5 });
}

// ============================================================ 5. A.2 PERSOALAN KEPUTUSAN
{
  const s = newSlide();
  KICKER(s, "Bagian A  ·  A.2", 0.6, 0.5, 6);
  H1(s, "Persediaan sebagai keputusan", 0.6, 0.8, 9, 0.7, 26);
  T(s, "Kalau kita modelkan, persoalan persediaan selalu punya struktur yang sama: ada tujuan, ada variabel yang bisa diatur, dan ada batasan.", 0.6, 1.5, 8.3, 0.7, { size: 12.5 });
  table(s, [
    ["Unsur model", "Isi umum", "Bentuknya di Amazon"],
    ["Objective", "Meminimalkan total biaya persediaan: biaya simpan (holding) + biaya pesan (ordering) + biaya kekurangan (shortage)", "Ditambah satu komponen yang oleh buku disebut sangat mahal: biaya kesalahan pemenuhan (returns)"],
    ["Decision variables", "Jumlah pesan (Q), titik pesan ulang (ROP), stok pengaman", "Ditambah alokasi: item apa di gudang mana, dan pesanan mana dipenuhi dari gudang mana"],
    ["Constraints", "Service level yang dijanjikan, kapasitas gudang, lead time pemasok", "Janji ke pelanggan: harga terendah, kirim tercepat, bebas kesalahan"],
  ], 0.6, 2.15, 8.3, [1.8, 3.25, 3.25], { size: 11 });
  card(s, 0.6, 5.35, 8.3, 1.4, { offsetColor: DARK });
  T(s, "Intuisinya: service level adalah constraint, bukan objective.", 0.85, 5.5, 7.9, 0.35, { size: 13.5, bold: true, color: BLACK });
  T(s, "Perusahaan tidak meminimalkan stok; perusahaan meminimalkan biaya pada tingkat layanan yang sudah dijanjikan. Perbedaan ini kecil kelihatannya, tetapi menentukan cara membaca Amazon di Bagian D.", 0.85, 5.88, 7.9, 0.8, { size: 11.5 });
  pic(s, "totes", 9.25, 1.3, 3.6);
  pic(s, "giftwrap", 9.25, 3.75, 3.6);
}

// ============================================================ 6. A.3 DILEMA + ATURAN
{
  const s = newSlide();
  KICKER(s, "Bagian A  ·  A.3", 0.6, 0.5, 6);
  H1(s, "Dilema dan aturan keputusan", 0.6, 0.8, 9, 0.7, 26);
  card(s, 0.6, 1.7, 3.9, 2.3);
  H2(s, "Stok terlalu banyak", 0.85, 1.9, 3.5, 0.35, 14);
  bullets(s, ["Biaya simpan dan biaya penanganan naik", "Modal tertahan di gudang", "Risiko barang usang (obsolescence)"], 0.85, 2.35, 3.45, 1.5, 11.5);
  card(s, 4.75, 1.7, 3.9, 2.3);
  H2(s, "Stok terlalu sedikit", 5.0, 1.9, 3.5, 0.35, 14);
  bullets(s, ["Stock out, permintaan tidak terpenuhi", "Kalau terjadi di produksi, produksinya berhenti", "Untuk ritel daring: pelanggan berpindah ke penjual lain dalam hitungan detik"], 5.0, 2.35, 3.45, 1.6, 11.5);
  card(s, 0.6, 4.3, 8.05, 2.45, { fill: DARK, offsetColor: ORANGE });
  T(s, "ATURAN KEPUTUSAN", 0.9, 4.5, 7.5, 0.3, { size: 10, bold: true, color: ORANGE });
  T(s, "Kalau dampak gangguan (kekosongan stok) tidak signifikan, tidak perlu menyimpan stok banyak. Kalau dampaknya signifikan, misalnya lead time pemesanan panjang atau biaya kehilangan penjualan besar, stok cadangan harus dinaikkan untuk menekan risiko.", 0.9, 4.85, 7.5, 1.2, { size: 13, color: WHITE });
  T(s, "Aturan ini yang dipakai untuk menilai apakah stok Amazon yang sangat besar itu pemborosan atau justru keputusan yang benar.", 0.9, 6.05, 7.5, 0.6, { size: 11, color: "D9D9D9", italic: true });
  pic(s, "sortation", 9.0, 1.6, 3.9);
  pic(s, "dock", 9.0, 4.35, 3.9);
}

// ============================================================ 7. B.1-B.2 KISAH SUKSES
{
  const s = newSlide();
  KICKER(s, "Bagian B  ·  Kisah sukses", 0.6, 0.5, 6);
  H1(s, "Dari virtual ke pengelola stok", 0.6, 0.8, 9.5, 0.7, 26);
  card(s, 0.6, 1.65, 4.2, 2.45);
  NUM(s, "1995", 0.85, 1.85, 22);
  T(s, "Rencana awal: pengecer “virtual”. Tanpa persediaan, tanpa gudang, tanpa overhead. Hanya komputer yang menerima pesanan buku dan meneruskan pemenuhannya ke pihak lain (HRM, hlm. 488). Secara default rencana yang menarik: modal kecil, tidak ada risiko stok.", 0.85, 2.4, 3.75, 1.65, { size: 11 });
  card(s, 0.6, 4.35, 4.2, 2.4, { offsetColor: DARK });
  T(s, "“Things clearly didn’t work out that way.”", 0.85, 4.55, 3.75, 0.6, { size: 13, bold: true, color: BLACK, italic: true });
  T(s, "Buku hanya memberi satu kalimat itu. Yang tercatat sekarang adalah perusahaan dengan jaringan gudang terbesar di dunia dan perangkat lunak pesanan yang begitu baik sehingga keahlian order taking, processing, dan billing dijual ke pihak lain (HRM, hlm. 489).", 0.85, 5.15, 3.75, 1.55, { size: 10.5 });
  const stats = [["150+", "gudang di seluruh dunia"], ["200 juta", "item tersedia di situs"], ["200.000", "pieces per hari, kapasitas kirim satu gudang"], ["600", "pekerja terlibat pemindaian di satu gudang"]];
  stats.forEach((st, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 5.15 + col * 3.9, y = 1.65 + row * 1.5;
    card(s, x, y, 3.65, 1.3, { offset: i === 0 || i === 3 });
    s.addText(st[0], { x: x + 0.2, y: y + 0.12, w: 3.3, h: 0.6, fontFace: HF, fontSize: 28, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
    T(s, st[1], x + 0.2, y + 0.78, 3.3, 0.45, { size: 10.5, color: BLACK });
  });
  pic(s, "hero", 5.15, 4.7, 7.6, { h: 2.05 });
  T(s, "Kondisi yang dilaporkan buku: jutaan item dalam ratusan ribu bin (HRM, hlm. 488–489)", 5.15, 6.85, 7.6, 0.25, { size: 8.5, color: MUTED, italic: true });
}

// ============================================================ 8. B.3 TARGET BEZOS
{
  const s = newSlide();
  KICKER(s, "Bagian B  ·  B.3", 0.6, 0.5, 6);
  H1(s, "Apakah rencana awalnya salah?", 0.6, 0.8, 9, 0.7, 26);
  T(s, "Bukan salah, tetapi asumsinya tidak bisa dipertahankan begitu value proposition ditetapkan. Bezos menetapkan pengalaman pelanggan harus menghasilkan tiga hal sekaligus (HRM, hlm. 489):", 0.6, 1.5, 8.2, 0.7, { size: 12.5 });
  const tg = [["Lowest price", "harga terendah"], ["Fastest delivery", "pengiriman tercepat"], ["Error-free", "pemenuhan pesanan bebas kesalahan"]];
  tg.forEach((t, i) => {
    const x = 0.6 + i * 2.85;
    card(s, x, 2.35, 2.6, 1.05, { offset: i === 1 });
    NUM(s, "0" + (i + 1), x + 0.2, 2.5, 18);
    T(s, t[0], x + 1.05, 2.48, 1.55, 0.3, { size: 12.5, bold: true, color: BLACK });
    T(s, t[1], x + 1.05, 2.8, 1.55, 0.5, { size: 9.5 });
  });
  T(s, "Kalimat kunci dari buku: exchanges and returns are very expensive. Kesalahan bukan sekadar masalah mutu, tetapi biaya.", 0.6, 3.55, 8.2, 0.5, { size: 11.5, italic: true, color: BLACK });
  table(s, [
    ["Target", "Kalau pemenuhan dititipkan ke pihak ketiga", "Kalau dikelola sendiri"],
    ["Fastest delivery", "Kecepatan bergantung stok dan proses orang lain; janji waktu kirim tidak bisa dibuat", "Stok diletakkan di gudang terdekat pelanggan; waktu proses internal bisa ditekan"],
    ["Error-free", "Kesalahan pihak lain menjadi biaya return Amazon, tetapi tidak bisa dikendalikan", "Titik kontrol (pemindaian, penimbangan) dirancang sendiri"],
    ["Lowest price", "Margin pihak ketiga masuk ke harga", "Biaya per pesanan ditekan lewat volume dan otomasi"],
  ], 0.6, 4.15, 8.2, [1.7, 3.25, 3.25], { size: 10.5 });
  pic(s, "packing", 9.2, 1.3, 3.7);
  card(s, 9.2, 4.2, 3.7, 2.55, { offsetColor: DARK });
  T(s, "KESIMPULAN", 9.45, 4.38, 3.2, 0.3, { size: 10, bold: true, color: ORANGE });
  T(s, "Menyimpan persediaan sendiri bukan penyimpangan dari strategi Amazon, melainkan konsekuensinya. Sama dengan logika Hard Rock Cafe: begitu keunikan ditetapkan, lokasi mengikuti. Value proposition men-direct keputusan di belakangnya.", 9.45, 4.7, 3.25, 1.95, { size: 11, color: BLACK });
}

// ============================================================ 9. B.4 4V
{
  const s = newSlide();
  KICKER(s, "Bagian B  ·  B.4 dan B.5", 0.6, 0.5, 6);
  H1(s, "Karakter operasi dengan 4V", 0.6, 0.8, 9, 0.7, 26);
  T(s, "Karakter operasi menentukan cara mengelolanya, meskipun industrinya sama. Bukti dari buku; posisi pada skala adalah penilaian penyusun.", 0.6, 1.5, 8.6, 0.5, { size: 12 });
  table(s, [
    ["Dimensi", "Posisi", "Bukti", "Konsekuensi pada persediaan"],
    ["Volume", "Sangat tinggi", "200.000 pieces/hari per gudang; 150+ gudang", "Economies of scale: otomasi dan standardisasi ekonomis, biaya per unit turun"],
    ["Variety", "Sangat tinggi", "200 juta item; 70% pesanan berisi lebih dari satu produk", "Kesalahan pengambilan mudah terjadi; akurasi catatan per item menjadi persoalan utama"],
    ["Variation", "Tinggi (buku tidak memberi angka)", "Ritel daring dengan musim puncak; gudang dirancang untuk kapasitas harian maksimum", "Perlu stok pengaman dan kapasitas yang bisa menyerap lonjakan"],
    ["Visibility", "Rendah", "Pelanggan hanya melihat hasil: harga, waktu tiba, ketepatan isi paket", "Proses gudang bebas dirancang untuk efisiensi"],
  ], 0.6, 2.1, 8.6, [1.3, 1.7, 2.8, 2.8], { size: 10.5 });
  card(s, 0.6, 5.3, 8.6, 1.45, { offsetColor: DARK });
  T(s, "Insight: secara natural volume tinggi berpasangan dengan variety rendah. Amazon punya keduanya tinggi.", 0.85, 5.45, 8.1, 0.35, { size: 12.5, bold: true, color: BLACK });
  T(s, "Kombinasi ini tidak otomatis berarti tidak efisien, asalkan ada strategi yang membuat kustomisasi (komposisi pesanan yang berbeda-beda) bisa dilayani dengan proses massal: pengambilan massal dalam batch, penyusunan per pesanan di ujung proses. Strateginya menuntut cost dan response sekaligus; apakah keduanya benar bertentangan diperiksa di Bagian D. Jangan disimpulkan dulu.", 0.85, 5.82, 8.1, 0.9, { size: 10.5 });
  pic(s, "delivery", 9.6, 1.35, 0, { h: 5.4 });
}

// ============================================================ 10. C LANGKAH 1-4
const STEPS = [
  ["Pesanan masuk, komputer di Seattle mengambil alih", "Komputer menugaskan pesanan (buku, permainan, kamera digital) ke salah satu pusat distribusi (DC) besar di AS.", "Jawaban atas where. Syaratnya catatan stok tiap DC benar saat itu juga (perpetual inventory)."],
  ["“Flow meister” di DC menerima pesanan", "Ia menentukan pekerja mana pergi ke mana untuk memenuhi pesanan.", "Pengendalian aliran kerja: pesanan diubah menjadi penugasan picking. Masih ada manusia sebagai pengatur beban."],
  ["Picking", "Sistem Amazon menggandakan kecepatan picking operator manual dan menurunkan tingkat kesalahan mendekati nol.", "Produktivitas dan akurasi pengambilan. Mekanismenya robot Kiva (Bab 9)."],
  ["Barang masuk crate di ban berjalan", "Crate kuning berisi pesanan banyak pelanggan; conveyor >10 mil, 2,9 kaki/detik; bar code dipindai 15 kali oleh mesin dan pekerja. Return sangat mahal.", "Batch picking supaya perjalanan efisien; identitas item diverifikasi berulang: record accuracy paling konkret."],
  ["Ketiga barang bertemu di chute, lalu masuk kotak", "Bar code dicocokkan dengan nomor pesanan; chute selebar 3 kaki (ribuan); kotak diberi bar code baru. Picking diurutkan untuk mengurangi perjalanan operator.", "Konsolidasi (sortation): dari batch kembali ke pesanan individual. Sequencing adalah keputusan penjadwalan."],
  ["Hadiah dibungkus dengan tangan", "Kelompok pembungkus kado terlatih, masing-masing 30 paket per jam.", "Sengaja tidak diotomasi: variasi tinggi, volume kecil. Dikelola dengan standard time."],
  ["Kotak dikemas, dilakban, ditimbang, dilabeli", "Gudang tipikal mengirim sampai 200.000 pieces/hari. Sekitar 60% lewat USPS, sisanya UPS.", "Penimbangan adalah verifikasi akhir isi paket (bandingkan Milton Bradley, hlm. 493). Moda kirim mayoritas berbiaya rendah."],
  ["Pesanan tiba di pelanggan", "Dalam 1 atau 2 hari.", "Ukuran yang dilihat pelanggan: speed dan dependability."],
];
function stepsSlide(from, imgs, title) {
  const s = newSlide();
  KICKER(s, "Bagian C  ·  Delapan langkah pemenuhan pesanan (HRM, hlm. 488–489)", 0.6, 0.5, 8);
  H1(s, title, 0.6, 0.8, 9, 0.7, 26);
  for (let i = 0; i < 4; i++) {
    const st = STEPS[from + i];
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 4.45, y = 1.6 + row * 2.6;
    card(s, x, y, 4.2, 2.4, { offset: i === 0 || i === 3 });
    s.addText("//0" + (from + i + 1), { x: x + 0.2, y: y + 0.15, w: 1.2, h: 0.45, fontFace: HF, fontSize: 20, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
    T(s, st[0], x + 1.2, y + 0.18, 2.85, 0.55, { size: 11.5, bold: true, color: BLACK });
    T(s, st[1], x + 0.2, y + 0.8, 3.8, 0.85, { size: 9.5 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: y + 1.62, w: 3.8, h: 0.62, fill: { color: LIGHT }, line: { color: LIGHT, width: 0 } });
    T(s, st[2], x + 0.3, y + 1.66, 3.62, 0.56, { size: 8.5, color: DARK });
  }
  pic(s, imgs[0], 9.55, 1.35, 3.3);
  const h1 = 3.3 / AR[imgs[0]];
  pic(s, imgs[1], 9.55, 1.35 + h1 + 0.3, 3.3);
  return s;
}
stepsSlide(0, ["scanner", "totes"], "Langkah 1–4: dari klik ke conveyor");
// ============================================================ 11. C LANGKAH 5-8
stepsSlide(4, ["sortation", "giftwrap"], "Langkah 5–8: dari chute ke pelanggan");

// ============================================================ 12. C.1 DUA ANGKA
{
  const s = newSlide();
  KICKER(s, "Bagian C  ·  C.1 Ukuran hasil", 0.6, 0.5, 6);
  H1(s, "Dua angka yang harus dibedakan", 0.6, 0.8, 9, 0.7, 26);
  T(s, "Menerima, memproses, menempatkan stok, lalu mengambil dan mengemas satu pesanan secara akurat memerlukan investasi tenaga kerja kurang dari 3 menit; 70% pesanan adalah pesanan multiproduk; buku menyebutnya world-class performance (HRM, hlm. 489).", 0.6, 1.5, 8.3, 0.85, { size: 12 });
  card(s, 0.6, 2.55, 4.0, 2.6, { offsetColor: DARK });
  s.addText("< 3 menit", { x: 0.85, y: 2.7, w: 3.5, h: 0.8, fontFace: HF, fontSize: 38, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  T(s, "Ukuran INPUT", 0.85, 3.5, 3.5, 0.3, { size: 11, bold: true, color: BLACK });
  T(s, "Jam kerja yang dipakai per pesanan. Ini ukuran biaya, hasil dari efisiensi proses di dalam gudang.", 0.85, 3.82, 3.5, 1.2, { size: 11 });
  card(s, 4.9, 2.55, 4.0, 2.6);
  s.addText("1–2 hari", { x: 5.15, y: 2.7, w: 3.5, h: 0.8, fontFace: HF, fontSize: 38, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  T(s, "Ukuran OUTPUT (speed)", 5.15, 3.5, 3.5, 0.3, { size: 11, bold: true, color: BLACK });
  T(s, "Yang dirasakan pelanggan. Hasil dari posisi stok yang dekat pelanggan, bukan dari proses gudang saja.", 5.15, 3.82, 3.5, 1.2, { size: 11 });
  card(s, 0.6, 5.4, 8.3, 1.35, { fill: DARK, offset: false });
  T(s, "Yang perlu dicermati: dua angka ini jangan dicampur saat presentasi. Amazon unggul di keduanya, tetapi mekanismenya berbeda. Angka 70% pesanan multiproduk menunjukkan bahwa kecepatan itu dicapai pada pesanan yang komposisinya berbeda-beda, bukan pada pesanan seragam.", 0.9, 5.58, 7.7, 1.05, { size: 11.5, color: WHITE });
  pic(s, "packing", 9.25, 1.4, 3.65);
  s.addText("70%", { x: 9.25, y: 4.3, w: 3.65, h: 0.9, fontFace: HF, fontSize: 54, bold: true, color: BLACK, isTextBox: true, margin: 0, align: "center" });
  T(s, "pesanan Amazon berisi lebih dari satu produk (HRM, hlm. 489)", 9.25, 5.2, 3.65, 0.6, { size: 11, align: "center", color: GRAY });
}

// ============================================================ 13. C.2 ROBOT KIVA
{
  const s = newSlide();
  KICKER(s, "Bagian C  ·  C.2 Mekanisme picking (HRM Bab 9, hlm. 376)", 0.6, 0.5, 8);
  H1(s, "Robot Kiva: barang yang bergerak", 0.6, 0.8, 9.5, 0.7, 26);
  pic(s, "robots", 0.6, 1.55, 6.6);
  const facts = [
    ["10.000+", "robot Kiva dipasang di beberapa gudang AS. Robot membawa rak berisi stok ke pekerja; buku menyamakannya dengan lini perakitan bergerak."],
    ["20 mil", "jalan kaki per hari per pekerja yang dihemat di gudang Tracy, California (1,2 juta kaki persegi); picker berdiri di satu tempat."],
    ["100 → 300", "item per jam: standar pick and scan per pekerja naik tiga kali lipat."],
    ["20–40%", "dipangkas dari biaya US$3,50–3,75 per pesanan untuk sort, pick, pack; setara US$400–900 juta per tahun."],
  ];
  facts.forEach((f, i) => {
    const y = 1.55 + i * 1.3;
    card(s, 7.55, y, 5.25, 1.12, { offset: i === 0 });
    s.addText(f[0], { x: 7.75, y: y + 0.14, w: 1.6, h: 0.5, fontFace: HF, fontSize: 17, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
    T(s, f[1], 9.4, y + 0.12, 3.3, 0.95, { size: 9.5 });
  });
  card(s, 0.6, 5.5, 6.6, 1.25, { offsetColor: DARK });
  T(s, "Dari sisi persediaan, robot mengubah dua hal: lokasi fisik stok tidak lagi harus tetap (slotting bisa diatur perangkat lunak), dan setiap pengambilan langsung dipindai sehingga catatan stok diperbarui bersamaan dengan pengambilan fisik. Ini yang membuat langkah 1 bisa mengandalkan data stok per DC.", 0.85, 5.62, 6.15, 1.05, { size: 10.5, color: BLACK });
}

// ============================================================ 14. C.3 JANGAN OVER-CLAIM
{
  const s = newSlide();
  KICKER(s, "Bagian C  ·  C.3 Kuantifikasi produktivitas", 0.6, 0.5, 6);
  H1(s, "Jangan over-claim produktivitas", 0.6, 0.8, 9.5, 0.7, 26);
  T(s, "Angka 100 menjadi 300 item per jam mudah dibaca sebagai kenaikan produktivitas 200%. Itu single-factor productivity, hanya menghitung tenaga kerja. Ukurannya not fair, karena kenaikan itu dicapai dengan menambah resource lain (robot) yang biayanya tidak ikut dihitung. Yang adil adalah multi-factor productivity: semua resource diuangkan lalu dijumlahkan.", 0.6, 1.5, 8.4, 1.15, { size: 12 });
  table(s, [
    ["Ukuran", "Angka dari buku", "Cara membacanya"],
    ["Labor productivity (single-factor)", "100 → 300 item/jam per pekerja (HRM, hlm. 376)", "Naik 200%. Benar, tetapi belum memperhitungkan investasi robot"],
    ["Biaya per pesanan (multi-factor, sudah termasuk robot)", "Turun 20–40% dari US$3,50–3,75 per pesanan (HRM, hlm. 376)", "Penghematan bersih sekitar US$0,70–1,50 per pesanan. Jauh di bawah 200%, tetapi tetap positif"],
    ["Dampak tahunan", "US$400–900 juta per tahun (HRM, hlm. 376)", "Angka kecil per pesanan menjadi besar karena volume"],
  ], 0.6, 2.8, 8.4, [2.5, 2.8, 3.1], { size: 10.5 });
  card(s, 0.6, 5.35, 8.4, 1.4, { offsetColor: DARK });
  T(s, "Kesimpulan: investasi robot terbukti menaikkan produktivitas, tetapi klaimnya harus dikoreksi dengan ukuran multi-faktor. Pola ini sama dengan contoh Collins Title di kelas: 75% pada ukuran tenaga kerja, 26% pada ukuran multi-faktor. Yang dipresentasikan sebaiknya angka biaya per pesanan, bukan angka 200%.", 0.85, 5.5, 7.9, 1.15, { size: 11.5, color: BLACK });
  card(s, 9.35, 1.5, 3.5, 2.3, { offset: false });
  s.addText("+200%", { x: 9.55, y: 1.65, w: 3.1, h: 0.75, fontFace: HF, fontSize: 34, bold: true, color: MUTED, isTextBox: true, margin: 0 });
  T(s, "single-factor (tenaga kerja saja)", 9.55, 2.4, 3.1, 0.3, { size: 10.5, color: MUTED });
  T(s, "Menarik, tetapi tidak adil untuk dilaporkan sendirian.", 9.55, 2.75, 3.1, 0.9, { size: 10.5 });
  card(s, 9.35, 4.05, 3.5, 2.7);
  s.addText("−20–40%", { x: 9.55, y: 4.2, w: 3.1, h: 0.75, fontFace: HF, fontSize: 34, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  T(s, "biaya per pesanan (multi-factor)", 9.55, 4.95, 3.1, 0.3, { size: 10.5, color: BLACK, bold: true });
  T(s, "Ukuran yang layak dipresentasikan: sudah menanggung biaya robot, dan tetap positif.", 9.55, 5.3, 3.1, 1.3, { size: 10.5 });
}

// ============================================================ 15. D.1-D.2
{
  const s = newSlide();
  KICKER(s, "Bagian D  ·  Mengapa berhasil", 0.6, 0.5, 6);
  H1(s, "Stok besar, tidak efisien?", 0.6, 0.8, 9.5, 0.7, 26);
  card(s, 0.6, 1.6, 4.6, 5.15, { offsetColor: DARK });
  T(s, "JAWABAN HARUS DIKEMBALIKAN KE OBJECTIVE", 0.85, 1.78, 4.1, 0.3, { size: 10, bold: true, color: ORANGE });
  T(s, "Buku merumuskan tujuan inventory management sebagai keseimbangan antara investasi persediaan dan layanan pelanggan; persediaan bisa mencapai 50% dari total modal (HRM, hlm. 490). Amazon jelas di sisi investasi besar.\n\nAmazon tidak meminimalkan stok. Amazon meminimalkan total biaya pada tingkat layanan yang sudah dijanjikan. Pada tingkat itu, kekosongan stok berarti penjualan hilang dan janji fastest delivery rusak: dampaknya signifikan, sehingga stok besar konsisten dengan tujuannya, bukan pemborosan.\n\nYang diminimalkan Amazon adalah dua komponen lain: tenaga kerja per pesanan (< 3 menit) dan kesalahan (mendekati nol). Judul profil harus dibaca dengan makna ini: bukan stok sedikit, tetapi stok besar yang dikelola presisi.", 0.85, 2.1, 4.1, 4.5, { size: 10.5, color: BLACK });
  H2(s, "D.2 Pemetaan ke lima tujuan kinerja operasi", 5.55, 1.6, 7.2, 0.35, 13);
  table(s, [
    ["Tujuan kinerja", "Wujud di Amazon (fakta buku)", "Mekanisme yang menghasilkannya"],
    ["Speed", "Tiba 1–2 hari; tenaga kerja < 3 menit per pesanan", "Alokasi ke DC yang punya stok; conveyor konstan; picking diurutkan; robot membawa rak"],
    ["Quality (bebas kesalahan)", "Kesalahan picking mendekati nol; bar code dipindai 15 kali", "Verifikasi di setiap perpindahan; penimbangan sebelum keluar"],
    ["Dependability", "Janji 1–2 hari terpenuhi; tidak perlu kontak lanjutan", "Ketersediaan stok dan proses terstandar. As promised, bukan sekadar cepat"],
    ["Flexibility", "70% pesanan multiproduk dari 200 juta item dilayani satu sistem", "Batch picking ke crate bersama, lalu konsolidasi per pesanan di chute"],
    ["Cost", "Harga terendah; 60% kiriman lewat USPS; biaya sort-pick-pack turun 20–40%", "Volume menyerap biaya tetap otomasi; moda kirim murah untuk mayoritas pesanan"],
  ], 5.55, 2.05, 7.2, [1.5, 2.75, 2.95], { size: 9.5 });
  pic(s, "totes", 5.55, 4.75, 0, { h: 2.0 });
  card(s, 9.2, 4.75, 3.55, 2.0, { offsetColor: ORANGE });
  T(s, "JUDUL PROFIL DI BUKU", 9.45, 4.9, 3.1, 0.3, { size: 9, bold: true, color: ORANGE });
  T(s, "“Inventory management provides competitive advantage.” Dibaca sebagai: stok besar yang dikelola presisi, bukan stok sedikit.", 9.45, 5.2, 3.1, 1.45, { size: 10.5, color: BLACK });
}

// ============================================================ 16. D.3 TIGA TRADE-OFF
{
  const s = newSlide();
  KICKER(s, "Bagian D  ·  D.3", 0.6, 0.5, 6);
  H1(s, "Tiga trade-off dan aturan keputusannya", 0.6, 0.8, 9.5, 0.7, 26);
  T(s, "Setiap pilihan operasi punya biaya di sisi lain. Keputusan yang baik bukan yang tanpa biaya, tetapi yang sadar biayanya dan bisa menunjukkan mana yang less loss.", 0.6, 1.5, 12.1, 0.5, { size: 12 });
  const tos = [
    ["Holding cost vs service level", "Carrying cost sekitar 26% dari nilai persediaan per tahun (HRM Tabel 12.1, hlm. 496), dan biaya kebijakan naik eksponensial ketika service level dinaikkan (hlm. 510). Stok Amazon mahal, dan makin mahal di tingkat layanan tinggi.", "Bandingkan biaya simpan tambahan dengan biaya kekosongan. Kalau biaya kekosongan (penjualan hilang + janji rusak) lebih besar, naikkan stok. Untuk ritel daring biaya kekosongan tinggi: pilihan Amazon konsisten."],
    ["Otomasi (biaya tetap) vs kesalahan dan tenaga kerja (biaya variabel)", "Pemindaian 15 kali, penimbangan, dan robot adalah biaya tetap plus biaya per transaksi kecil. Kesalahan menimbulkan biaya return, kirim ulang, dan hilangnya kepercayaan.", "Otomasi layak kalau (penghematan per pesanan) × (pesanan per tahun) > biaya tahunan otomasi. Penghematan hanya US$0,70–1,50 per pesanan; baru berarti pada volume Amazon. Penentunya volume, bukan teknologinya."],
    ["Kecepatan kirim vs biaya kirim", "Suplemen 11 (hlm. 477): kirim lebih cepat biasanya lebih mahal; barang lebih lama di jalan menahan modal lebih lama. Amazon mengirim 60% pesanan lewat USPS, moda yang murah.", "Kecepatan 1–2 hari tidak dibeli dari moda mahal; dibangun dari dalam: stok sudah di DC dekat pelanggan dan proses gudang pendek. Target harga terendah dan tercepat bisa dipegang bersamaan."],
  ];
  tos.forEach((t, i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.2, 3.9, 4.55, { offset: i === 1 });
    NUM(s, "0" + (i + 1), x + 0.2, 2.35, 20);
    T(s, t[0], x + 1.1, 2.38, 2.65, 0.75, { size: 11.5, bold: true, color: BLACK });
    T(s, t[1], x + 0.2, 3.2, 3.5, 1.55, { size: 9.5 });
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: 4.8, w: 3.5, h: 1.8, fill: { color: DARK }, line: { color: DARK, width: 0 } });
    T(s, "ATURAN KEPUTUSAN", x + 0.32, 4.88, 3.3, 0.25, { size: 8, bold: true, color: ORANGE });
    T(s, t[2], x + 0.32, 5.12, 3.28, 1.45, { size: 9, color: WHITE });
  });
}

// ============================================================ 17. D.4 VERIFIKASI + D.5 FRONTIER
{
  const s = newSlide();
  KICKER(s, "Bagian D  ·  D.4 dan D.5", 0.6, 0.5, 6);
  H1(s, "Trade-off nyata, atau searah?", 0.6, 0.8, 9.5, 0.7, 26);
  T(s, "Sebelum menyimpulkan ada trade-off, periksa dulu apakah dua tujuan itu benar bertentangan atau justru complementary. Kalau searah, tidak perlu ditimbang; kerjakan saja.", 0.6, 1.5, 7.6, 0.6, { size: 11.5 });
  table(s, [
    ["Pasangan tujuan", "Hubungan", "Alasan"],
    ["Akurasi (kesalahan nol) vs biaya", "Searah", "Setiap kesalahan yang dicegah menghilangkan biaya return. Tidak ada yang perlu dikorbankan."],
    ["Kecepatan proses internal vs biaya", "Searah", "< 3 menit per pesanan sekaligus menekan biaya dan mempercepat; robot menghemat jalan kaki dan biaya sort-pick-pack bersamaan."],
    ["Ketersediaan stok vs holding cost", "Trade-off nyata", "Stok pengaman menaikkan biaya simpan; tidak ada mekanisme yang menghilangkannya. Amazon memilih sadar di sisi service level tinggi."],
    ["Kecepatan kirim vs biaya kirim", "Trade-off nyata, dihindari", "Sumber kecepatan dipindahkan dari moda kirim ke posisi stok dan proses gudang, sehingga moda murah tetap bisa dipakai."],
  ], 0.6, 2.2, 7.6, [2.2, 1.45, 3.95], { size: 9.5 });
  card(s, 0.6, 5.55, 7.6, 1.2, { offsetColor: DARK });
  T(s, "Kesimpulan: dari tiga target Bezos, hanya ketersediaan stok yang benar-benar menuntut pengorbanan biaya. Dua target lain justru menurunkan biaya. Karena itu Amazon bisa menuntut ketiganya sekaligus tanpa terjebak memilih satu strategi generik.", 0.85, 5.7, 7.1, 0.95, { size: 10.5, color: BLACK });
  H2(s, "D.5 Efficient frontier", 8.6, 1.5, 4.2, 0.35, 13);
  T(s, "Alternatif yang didominasi (lebih mahal dan lebih lambat sekaligus) dicoret; sisanya membentuk frontier, pilihannya diserahkan ke preferensi.", 8.6, 1.85, 4.2, 0.7, { size: 9.5 });
  const alt = [
    ["A", "Pengecer virtual (1995)", "Modal paling rendah, tetapi tidak memenuhi constraint bebas kesalahan dan tercepat.", false, false],
    ["B", "Gudang sendiri, manual", "US$3,50–3,75 per pesanan, risiko kesalahan manusia. Didominasi C pada volume Amazon: dicoret.", true, false],
    ["C", "Gudang sendiri, terotomasi", "Biaya turun 20–40%, kesalahan mendekati nol, 1–2 hari. Di frontier; dipilih sesuai value proposition.", false, true],
  ];
  alt.forEach((a, i) => {
    const y = 2.65 + i * 1.15;
    card(s, 8.6, y, 4.2, 1.0, { offset: a[4], fill: a[3] ? LIGHT : WHITE });
    s.addText(a[0], { x: 8.8, y: y + 0.2, w: 0.6, h: 0.6, fontFace: HF, fontSize: 24, bold: true, color: a[3] ? MUTED : ORANGE, isTextBox: true, margin: 0, strike: a[3] });
    T(s, a[1], 9.45, y + 0.1, 3.25, 0.3, { size: 11, bold: true, color: a[3] ? MUTED : BLACK });
    T(s, a[2], 9.45, y + 0.38, 3.25, 0.6, { size: 8.5, color: a[3] ? MUTED : GRAY });
  });
  T(s, "Catatan: dominasi C atas B hanya berlaku pada volume Amazon. Pada volume kecil, biaya tetap robot tidak terserap dan B kembali ke frontier. Tidak ada jawaban pasti untuk semua perusahaan.", 8.6, 6.1, 4.2, 0.7, { size: 9, italic: true, color: DARK });
}

// ============================================================ 18. E PINTU MASUK TEORI
{
  const s = newSlide();
  KICKER(s, "Bagian E", 0.6, 0.5, 6);
  H1(s, "Pintu masuk ke teori Bab 12", 0.6, 0.8, 11, 0.7, 26);
  T(s, "Sengaja ringkas. Kolom status menyatakan apakah kaitan itu disebut buku secara eksplisit atau merupakan inferensi, supaya di kelas jelas mana yang bisa dipegang.", 0.6, 1.45, 8.6, 0.55, { size: 11.5 });
  table(s, [
    ["Konsep (HRM Bab 12)", "Wujud di Amazon", "Status"],
    ["Fungsi persediaan no. 1: pilihan barang untuk permintaan yang diantisipasi (hlm. 490)", "Jutaan item di 150+ gudang; buku menyebut fungsi ini tipikal ritel", "Eksplisit"],
    ["Record accuracy: sistem perpetual dengan bar code (hlm. 493)", "Bar code dipindai 15 kali; alokasi dari Seattle mengandalkan catatan stok per DC", "Eksplisit (pindai); inferensi (alokasi)"],
    ["Cycle counting (hlm. 493–494)", "Tidak disebut; verifikasi berkala tetap diperlukan untuk kesalahan fisik", "Tidak disebut; asumsi"],
    ["ABC analysis / Pareto (hlm. 491–492)", "Tidak disebut di profil; praktik 2023: same-day facility menyimpan 100.000 item terlaris per wilayah", "Sumber lain"],
    ["Kontrol persediaan ritel: barang masuk dan keluar dengan bar code (hlm. 494–495)", "Setiap item dan kotak diberi bar code; penimbangan sebelum keluar gudang", "Eksplisit"],
    ["Independent demand; ROP = permintaan selama lead time + Zσ (hlm. 495, 510)", "Service level tinggi menuntut safety stock besar, sejalan dengan investasi persediaan Amazon", "Inferensi"],
    ["Penempatan di gudang: rasio trip/blok tertinggi paling dekat dock (Supl. 11, hlm. 478)", "“Picking is sequenced to reduce operator travel”; robot membuat slotting bisa diatur perangkat lunak", "Eksplisit; inferensi (slotting)"],
  ], 0.6, 2.1, 8.6, [3.3, 3.6, 1.7], { size: 9 });
  pic(s, "shelves", 9.55, 1.5, 3.3);
  card(s, 9.55, 3.5, 3.3, 3.25, { offsetColor: DARK });
  T(s, "INSIGHT", 9.8, 3.68, 2.9, 0.3, { size: 10, bold: true, color: ORANGE });
  T(s, "Profil Amazon menekankan sisi pengendalian (akurasi catatan, kontrol barang keluar, aliran kerja), bukan sisi model kuantitatif (EOQ, ROP). Ini masuk akal: model berapa dan kapan hanya berguna kalau angka stok yang menjadi masukannya benar.\n\nUrutannya: akurasi dulu, model kemudian.", 9.8, 4.0, 2.85, 2.7, { size: 10.5, color: BLACK });
}

// ============================================================ 19. F PERKEMBANGAN
{
  const s = newSlide();
  KICKER(s, "Bagian F  ·  Perkembangan setelah buku terbit", 0.6, 0.5, 7);
  H1(s, "Arah tetap, alatnya berubah", 0.6, 0.8, 9.5, 0.7, 26);
  T(s, "Buku menggambarkan kondisi sekitar 2017. Sumber berikut dari blog resmi para penulis buku (The OM Blog by Heizer, Render & Munson), sehingga sejalan dengan rujukan kelas.", 0.6, 1.5, 8.2, 0.6, { size: 11.5 });
  card(s, 0.6, 2.3, 4.0, 4.45, { offsetColor: DARK });
  s.addText("2023", { x: 0.85, y: 2.45, w: 3.5, h: 0.6, fontFace: HF, fontSize: 30, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  T(s, "OM Blog, 18 Nov 2023 (video Wall Street Journal)", 0.85, 3.05, 3.5, 0.3, { size: 9, color: MUTED, italic: true });
  bullets(s, ["Jaringan AS dibagi 8 wilayah dengan stok lengkap per wilayah; >76% permintaan dipenuhi dari dalam wilayahnya", "Same-day facility menyimpan 100.000 item terlaris per wilayah, dipilih dengan machine learning", "Rata-rata picking sampai paket di dock keluar: 11 menit"], 0.85, 3.4, 3.5, 2.2, 10.5);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 5.65, w: 3.5, h: 0.95, fill: { color: LIGHT }, line: { color: LIGHT, width: 0 } });
  T(s, "Melanjutkan langkah 1 (alokasi ke DC) menjadi keputusan where per wilayah. Pemilihan 100.000 item terlaris adalah Pareto/ABC pada penempatan stok.", 0.95, 5.7, 3.3, 0.9, { size: 8.5, color: DARK });
  card(s, 4.85, 2.3, 4.0, 4.45);
  s.addText("2025", { x: 5.1, y: 2.45, w: 3.5, h: 0.6, fontFace: HF, fontSize: 30, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  T(s, "OM Blog, 7 Jul 2025", 5.1, 3.05, 3.5, 0.3, { size: 9, color: MUTED, italic: true });
  bullets(s, ["Lebih dari satu juta robot beroperasi; sekitar 75% pengiriman global melibatkan bantuan robot", "Paket terkirim per karyawan per tahun naik dari 175 menjadi 3.870 dalam satu dekade"], 5.1, 3.4, 3.5, 2.2, 10.5);
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 5.65, w: 3.5, h: 0.95, fill: { color: LIGHT }, line: { color: LIGHT, width: 0 } });
  T(s, "Melanjutkan langkah 3 (picking terotomasi). Ingat C.3: angka per karyawan adalah ukuran single-factor; jangan dibaca sebagai efisiensi total.", 5.2, 5.7, 3.3, 0.9, { size: 8.5, color: DARK });
  pic(s, "robots", 9.15, 1.5, 3.7);
  card(s, 9.15, 3.85, 3.7, 2.9, { offsetColor: DARK });
  T(s, "Kecepatan tetap dicapai lewat posisi stok yang mendekat ke pelanggan; akurasi dan biaya lewat otomasi. Yang berubah adalah alatnya: pembagian wilayah, prediksi permintaan per wilayah, dan skala robot.", 9.4, 4.05, 3.2, 2.5, { size: 11, color: BLACK });
}

// ============================================================ 20. G LESSON LEARNED + PENUTUP
{
  const s = newSlide({ mapT: 40 });
  KICKER(s, "Bagian G  ·  Lesson learned", 0.6, 0.5, 6);
  H1(s, "Apa yang bisa dan tidak bisa ditiru", 0.6, 0.8, 9.5, 0.7, 26);
  const L = [
    ["Persediaan bisa menjadi keunggulan bersaing, syaratnya dikelola presisi", "Bukan stok sedikit; stok besar yang diketahui lokasinya, diambil benar, diproses cepat."],
    ["Akurasi catatan adalah prasyarat, bukan pelengkap", "Delapan langkah runtuh kalau catatan stok per DC salah. Akurasi dulu, model kemudian."],
    ["Kecepatan dibangun dari dalam, bukan dibeli dari luar", "Posisi stok dan proses pendek memungkinkan moda kirim murah untuk 60% pesanan."],
    ["Kesalahan dikendalikan di banyak titik karena biaya kesalahan > biaya kontrol", "Bukan trade-off; keduanya searah. Kerjakan saja."],
    ["Otomasi dibenarkan oleh volume, bukan oleh teknologinya", "US$0,70–1,50 per pesanan hanya berarti pada ratusan ribu pieces per hari. Hitung dengan aturan keputusan."],
    ["Trade-off yang tersisa dipilih secara sadar", "Holding cost tinggi diterima karena dampak kekosongan di ritel daring signifikan; tidak semua bagian diotomasi (kado tetap manual)."],
  ];
  L.forEach((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 4.2, y = 1.6 + row * 1.35;
    card(s, x, y, 3.95, 1.15, { offset: i === 0 || i === 5 });
    s.addText("//0" + (i + 1), { x: x + 0.15, y: y + 0.15, w: 0.85, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
    T(s, l[0], x + 1.0, y + 0.12, 2.85, 0.5, { size: 10, bold: true, color: BLACK });
    T(s, l[1], x + 1.0, y + 0.62, 2.85, 0.5, { size: 8.5 });
  });
  card(s, 0.6, 5.7, 8.15, 1.05, { fill: DARK, offset: false });
  T(s, "Yang bisa dibawa ke perusahaan lain bukan tingkat otomasinya, melainkan urutan berpikirnya: tetapkan target kinerja, pastikan akurasi catatan, periksa mana trade-off dan mana yang searah, hitung dengan ukuran yang adil, baru putuskan investasi persediaan dan teknologinya.", 0.85, 5.82, 7.7, 0.85, { size: 10.5, color: WHITE });
  pic(s, "dock", 9.1, 1.45, 3.75);
  card(s, 9.1, 3.9, 3.75, 2.85, { offsetColor: ORANGE });
  s.addText("TERIMA KASIH", { x: 9.3, y: 4.1, w: 3.4, h: 0.6, fontFace: HF, fontSize: 24, bold: true, color: BLACK, charSpacing: -1, isTextBox: true, margin: 0 });
  T(s, "Kelompok 4\nBagaskoro · Aulia Sisca Rahmadiyanti · Fitra Aidila", 9.3, 4.75, 3.4, 0.75, { size: 10.5, color: BLACK });
  T(s, "Rujukan utama: Heizer, Render & Munson (2017), Operations Management, 12th ed., Bab 12 hlm. 487–514; Bab 9 hlm. 376; Suplemen 11. The OM Blog (2023, 2025).", 9.3, 5.55, 3.4, 1.1, { size: 8.5, color: MUTED });
}

pres.writeFile({ fileName: OUT }).then(() => console.log("ditulis:", OUT, "| slide:", slideNo));
