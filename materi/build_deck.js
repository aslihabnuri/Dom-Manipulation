// Membangun deck PPTX: Studi Kasus 4 - Inventory Management di Amazon.com
// Tata letak mengikuti referensi: satu kartu putih besar per slide di atas latar peta,
// teks di kolom kiri, gambar kolase menempel di sisi kanan; sebagian slide gambar penuh
// dengan judul bernomor di atas strip putih; kalimat kunci diberi blok warna.
// Jalankan:  IMG=/path/ke/img node build_deck.js
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const IMG = process.env.IMG || path.join(__dirname, "img");
const OUT = path.join(__dirname, "Presentasi_Studi_Kasus_4_Amazon_Kelompok_4.pptx");
const AR = JSON.parse(fs.readFileSync(path.join(IMG, "crop", "ar.json"), "utf8"));

const BLACK = "111111", ORANGE = "FF9900", PALE = "FFE2B8", DARK = "232F3E", GRAY = "4A4A4A", MUTED = "8A8A8A", WHITE = "FFFFFF";
const HF = "Arial", BF = "Calibri";
const SW = 13.333, SH = 7.5;
// bingkai kartu utama
const FX = 0.35, FY = 0.35, FW = SW - 0.7, FH = SH - 0.7;
const PAD = 0.5;                 // padding dalam kartu
const TX = FX + PAD;             // kolom teks
const TW = 5.9;
const IMGX = TX + TW + 0.35;     // kolom gambar
const IMGW = FX + FW - 0.15 - IMGX;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Kelompok 4";
pres.title = "Inventory Management sebagai Keunggulan Kompetitif Amazon.com";

let slideNo = 0;
function shadow() { return { type: "outer", blur: 8, offset: 3, angle: 60, color: "000000", opacity: 0.18 }; }

// ---------- kerangka slide: latar peta + kartu putih besar ----------
function frame(opts = {}) {
  const s = pres.addSlide();
  slideNo += 1;
  s.background = { color: "F6F6F6" };
  s.addImage({ path: path.join(IMG, "map_bg.jpg"), x: 0, y: 0, w: SW, h: SH, transparency: 45 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: FX, y: FY, w: FW, h: FH, fill: { color: WHITE }, line: { color: WHITE, width: 0 }, rectRadius: 0.18, shadow: shadow() });
  if (!opts.plain) s.addImage({ path: path.join(IMG, "map_bg.jpg"), x: FX + 0.05, y: FY + 0.05, w: FW - 0.1, h: FH - 0.1, transparency: 68 });
  s.addText(String(slideNo), { x: SW - 1.0, y: SH - 0.33, w: 0.55, h: 0.25, fontFace: HF, fontSize: 9, bold: true, color: ORANGE, align: "right", isTextBox: true, margin: 0 });
  return s;
}
// gambar menempel di kanan-bawah kartu (kolom gambar), dibatasi lebar/tinggi kolom
function picRight(s, name, opts = {}) {
  const maxW = opts.w || IMGW, maxH = opts.h || (FH - 0.6);
  let w = maxW, h = w / AR[name];
  if (h > maxH) { h = maxH; w = h * AR[name]; }
  const x = opts.x ?? (FX + FW - 0.15 - w);
  const y = opts.y ?? (FY + FH - 0.15 - h);
  s.addImage({ path: path.join(IMG, "crop", name + ".jpg"), x, y, w, h });
  return { x, y, w, h };
}
// gambar penuh menutup kartu (slide bertipe gambar penuh)
function picFull(s, name) {
  const inner = { x: FX + 0.12, y: FY + 0.12, w: FW - 0.24, h: FH - 0.24 };
  const ar = AR[name];
  let w = inner.w, h = w / ar, x = inner.x, y = inner.y;
  if (h < inner.h) { h = inner.h; w = h * ar; x = inner.x - (w - inner.w) / 2; }
  // gunakan cropping pptxgenjs agar tepat memenuhi kartu
  const cropW = inner.w / w, cropH = inner.h / h;
  s.addImage({ path: path.join(IMG, "crop", name + ".jpg"), x: inner.x, y: inner.y, w: inner.w, h: inner.h,
    sizing: { type: "cover", w: inner.w, h: inner.h } });
  // lapisan putih tipis agar teks terbaca
  s.addShape(pres.shapes.RECTANGLE, { x: inner.x, y: inner.y, w: inner.w, h: inner.h, fill: { color: WHITE, transparency: 78 }, line: { color: WHITE, width: 0 } });
}
// ---------- teks ----------
function H(s, text, x, y, w, size = 28, opts = {}) {
  s.addText(text.toUpperCase(), { x, y, w, h: opts.h || (size / 72) * 1.35 * (opts.lines || 1) + 0.1, fontFace: HF, fontSize: size, bold: true, color: opts.color || BLACK, charSpacing: -1, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 0.95 });
}
function T(s, text, x, y, w, h, opts = {}) {
  s.addText(text, { x, y, w, h, fontFace: BF, fontSize: opts.size || 11.5, color: opts.color || GRAY, isTextBox: true, margin: 0, valign: opts.valign || "top", align: opts.align || "left", bold: !!opts.bold, italic: !!opts.italic, lineSpacingMultiple: 1.05 });
}
// strip berwarna di belakang teks (seperti sorotan pada referensi)
function HL(s, text, x, y, w, h, opts = {}) {
  s.addText(text, { x, y, w, h, fontFace: opts.font || BF, fontSize: opts.size || 11.5, bold: opts.bold ?? true, color: opts.color || BLACK, fill: { color: opts.fill || ORANGE }, isTextBox: true, margin: [0.04, 0.1, 0.04, 0.1], valign: "middle", align: opts.align || "left", lineSpacingMultiple: 1.05 });
}
// daftar bernomor: angka oranye besar + teks bersorot
function numList(s, items, x, y, w, opts = {}) {
  const rowH = opts.rowH || 0.62, gap = opts.gap || 0.14, size = opts.size || 11;
  items.forEach((it, i) => {
    const yy = y + i * (rowH + gap);
    s.addText(String(i + 1).padStart(2, "0"), { x, y: yy, w: 0.7, h: rowH, fontFace: HF, fontSize: opts.numSize || 20, bold: true, color: ORANGE, isTextBox: true, margin: 0, valign: "middle" });
    if (Array.isArray(it)) {
      HL(s, it[0], x + 0.75, yy, w - 0.75, rowH * 0.5, { size: size + 0.5, fill: PALE });
      T(s, it[1], x + 0.75, yy + rowH * 0.52, w - 0.75, rowH * 0.5, { size: size - 1 });
    } else {
      HL(s, it, x + 0.75, yy, w - 0.75, rowH, { size, fill: PALE, bold: false });
    }
  });
  return y + items.length * (rowH + gap);
}
function bullets(s, items, x, y, w, h, size = 11) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { code: "25A0" }, breakLine: i < items.length - 1, paraSpaceAfter: 4 } })), {
    x, y, w, h, fontFace: BF, fontSize: size, color: GRAY, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.05,
  });
}
function table(s, rows, x, y, w, colW, opts = {}) {
  const fs_ = opts.size || 10;
  const data = rows.map((r, ri) => r.map((c, ci) => ({
    text: c,
    options: ri === 0
      ? { bold: true, color: WHITE, fill: { color: DARK }, fontFace: HF, fontSize: fs_ - 0.5 }
      : { color: ci === 0 ? BLACK : GRAY, bold: ci === 0, fill: { color: ri % 2 ? WHITE : "FBFBFB" }, fontFace: BF, fontSize: fs_ },
  })));
  s.addTable(data, { x, y, w, colW, border: { type: "solid", pt: 0.5, color: "D9D9D9" }, margin: 0.05, valign: "top", autoPage: false });
}
// blok bernomor pada slide gambar penuh: angka besar + judul di strip putih + isi di strip putih
function numBlock(s, n, title, body, x, y, w, opts = {}) {
  const bodyH = body ? (opts.bodyH || 0.95) : 0;
  const h = 0.72 + bodyH + 0.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: WHITE, transparency: 6 }, line: { color: WHITE, width: 0 }, rectRadius: 0.1, shadow: shadow() });
  s.addText(String(n).padStart(2, "0"), { x: x + 0.15, y: y + 0.08, w: 1.0, h: 0.62, fontFace: HF, fontSize: 32, bold: true, color: ORANGE, isTextBox: true, margin: 0, valign: "middle" });
  HL(s, title.toUpperCase(), x + 1.15, y + 0.14, w - 1.3, 0.5, { font: HF, size: opts.titleSize || 14, fill: PALE, bold: true });
  if (body) T(s, body, x + 1.25, y + 0.78, w - 1.45, bodyH, { size: opts.bodySize || 10.5 });
}

// ============================================================ 1. SAMPUL
{
  const s = frame();
  const p = picRight(s, "hero", { w: FW - 0.4, h: 4.5, x: FX + 0.2, y: FY + FH - 0.2 - 4.5 });
  // judul di kanan atas, di atas area putih
  s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: FY + 0.35, w: 7.2, h: 2.1, fill: { color: WHITE, transparency: 12 }, line: { color: WHITE, width: 0 } });
  s.addText("INVENTORY MANAGEMENT\nSEBAGAI KEUNGGULAN\nKOMPETITIF AMAZON.COM", { x: 5.75, y: FY + 0.4, w: 7.0, h: 2.0, fontFace: HF, fontSize: 30, bold: true, color: BLACK, charSpacing: -1, lineSpacingMultiple: 0.95, isTextBox: true, margin: 0, valign: "middle", align: "right" });
  // nama kelompok kecil di kiri atas
  HL(s, "KELOMPOK 4", TX, FY + 0.45, 1.6, 0.36, { font: HF, size: 12, fill: ORANGE });
  T(s, "Bagaskoro  ·  25/574280/PEK/31778\nAulia Sisca Rahmadiyanti  ·  25/574305/PEK/31789\nFitra Aidila  ·  25/574309/PEK/31791", TX, FY + 0.9, 4.6, 1.1, { size: 10.5, color: BLACK });
}

// ============================================================ 2. ALUR PEMBAHASAN
{
  const s = frame();
  H(s, "Alur pembahasan", TX, FY + 0.45, TW, 30);
  T(s, "Urutan yang dipakai di kelas: kisah sukses, apa yang dilakukan perusahaan, mengapa berhasil, lalu apa yang bisa dan tidak bisa ditiru.", TX, FY + 1.15, TW, 0.6, { size: 11.5 });
  const items = [
    ["Kerangka berpikir", "Strategi dulu, baru keputusan teknis; dilema persediaan dan aturan keputusannya"],
    ["Kisah sukses", "Transformasi Amazon dari pengecer virtual menjadi pengelola persediaan"],
    ["Proses pemenuhan pesanan", "Delapan langkah pada satu pesanan, dan kuantifikasinya"],
    ["Analisis trade-off", "Mengapa berhasil; mana trade-off nyata, mana yang searah"],
    ["Kaitan dengan teori persediaan", "Konsep Bab 12 yang terlihat bekerja"],
    ["Perkembangan terbaru", "Setelah buku terbit: 2023 dan 2025"],
    ["Lesson learned", "Apa yang bisa dan tidak bisa ditiru"],
  ];
  numList(s, items, TX, FY + 1.85, TW, { rowH: 0.56, gap: 0.09, size: 10.5, numSize: 16 });
  picRight(s, "delivery", { h: 5.9 });
}

// ============================================================ 3. KERANGKA BERPIKIR
{
  const s = frame();
  H(s, "Kerangka berpikir persediaan", TX, FY + 0.45, TW + 0.6, 28);
  T(s, "Tentukan dulu apa yang mau dicapai (strategi dan value proposition), baru turunkan ke keputusan teknis. Inventory management ada di lapisan teknis itu, satu kelompok dengan MRP, sequencing, dan scheduling. Dalam sepuluh keputusan OM (Heizer), persediaan adalah keputusan ke-8 dengan dua pertanyaan dasar, ditambah satu pertanyaan khusus Amazon.", TX, FY + 1.15, TW, 1.5, { size: 11.5 });
  const items = [
    ["How much", "Berapa banyak persediaan setiap item yang harus dimiliki?"],
    ["When", "Kapan harus memesan kembali?"],
    ["Where", "Item mana disimpan di gudang mana; stok Amazon tersebar di lebih dari 150 gudang."],
  ];
  const yEnd = numList(s, items, TX, FY + 2.8, TW, { rowH: 0.7, gap: 0.16, size: 11.5, numSize: 20 });
  HL(s, "Tiga pertanyaan ini yang dicari jawabannya di sepanjang kasus. Where adalah keputusan yang membuat Amazon berbeda dari toko tunggal: stok harus berada dekat pelanggan sebelum pesanan datang.", TX, yEnd + 0.15, TW, 0.95, { size: 11, bold: false, fill: ORANGE });
  picRight(s, "shelves");
}

// ============================================================ 4. STRUKTUR KEPUTUSAN
{
  const s = frame();
  H(s, "Struktur keputusan persediaan", TX, FY + 0.45, TW + 1.2, 28);
  T(s, "Kalau kita modelkan, persoalan persediaan selalu punya struktur yang sama: ada tujuan, ada variabel yang bisa diatur, dan ada batasan.", TX, FY + 1.15, TW + 1.0, 0.6, { size: 11.5 });
  table(s, [
    ["Unsur model", "Isi umum", "Bentuknya di Amazon"],
    ["Objective", "Meminimalkan total biaya persediaan: biaya simpan (holding) + biaya pesan (ordering) + biaya kekurangan (shortage)", "Ditambah satu komponen yang oleh buku disebut sangat mahal: biaya kesalahan pemenuhan (returns)"],
    ["Decision variables", "Jumlah pesan (Q), titik pesan ulang (ROP), stok pengaman", "Ditambah alokasi: item apa di gudang mana, dan pesanan mana dipenuhi dari gudang mana"],
    ["Constraints", "Service level yang dijanjikan, kapasitas gudang, lead time pemasok", "Janji ke pelanggan: harga terendah, kirim tercepat, bebas kesalahan"],
  ], TX, FY + 1.9, TW + 1.0, [1.5, 2.7, 2.7], { size: 10 });
  HL(s, "Intuisinya: service level adalah constraint, bukan objective.", TX, FY + 4.85, TW + 1.0, 0.42, { size: 12.5 });
  T(s, "Perusahaan tidak meminimalkan stok; perusahaan meminimalkan biaya pada tingkat layanan yang sudah dijanjikan. Perbedaan ini kecil kelihatannya, tetapi menentukan cara membaca Amazon di bagian analisis trade-off.", TX, FY + 5.4, TW + 1.0, 0.9, { size: 11 });
  picRight(s, "totes", { w: 4.9, h: 3.4 });
}

// ============================================================ 5. DILEMA + ATURAN
{
  const s = frame();
  H(s, "Dilema dan aturan keputusan", TX, FY + 0.45, TW + 0.6, 28);
  H(s, "Stok terlalu banyak", TX, FY + 1.25, TW, 14);
  bullets(s, ["Biaya simpan dan biaya penanganan naik", "Modal tertahan di gudang", "Risiko barang usang (obsolescence)"], TX, FY + 1.62, TW, 0.95, 11);
  H(s, "Stok terlalu sedikit", TX, FY + 2.6, TW, 14);
  bullets(s, ["Stock out, permintaan tidak terpenuhi", "Kalau terjadi di produksi, produksinya berhenti", "Pada ritel daring, pelanggan berpindah ke penjual lain dalam hitungan detik"], TX, FY + 2.97, TW, 1.05, 11);
  H(s, "Aturan keputusan", TX, FY + 4.15, TW, 14);
  HL(s, "Kalau dampak gangguan (kekosongan stok) tidak signifikan, tidak perlu menyimpan stok banyak. Kalau dampaknya signifikan, misalnya lead time pemesanan panjang atau biaya kehilangan penjualan besar, stok cadangan harus dinaikkan untuk menekan risiko.", TX, FY + 4.55, TW, 1.15, { size: 11.5, bold: false });
  T(s, "Aturan ini yang dipakai untuk menilai apakah stok Amazon yang sangat besar itu pemborosan atau justru keputusan yang benar.", TX, FY + 5.85, TW, 0.6, { size: 10.5, italic: true });
  picRight(s, "sortation");
}

// ============================================================ 6. TRANSFORMASI (gambar penuh)
{
  const s = frame({ plain: true });
  picFull(s, "hero");
  H(s, "Transformasi model bisnis Amazon", FX + 0.5, FY + 0.4, 9, 28);
  numBlock(s, 1, "Rencana 1995: pengecer virtual", "Tanpa persediaan, tanpa gudang, tanpa overhead. Hanya komputer yang menerima pesanan buku dan meneruskan pemenuhannya ke pihak lain. Secara default rencana yang menarik: modal kecil, tidak ada risiko stok.", FX + 0.5, FY + 1.35, 5.9, { bodyH: 1.25 });
  numBlock(s, 2, "Kenyataan: “things clearly didn’t work out that way”", "Buku hanya memberi satu kalimat itu. Yang tercatat sekarang adalah jaringan gudang terbesar di dunia dan perangkat lunak pesanan yang begitu baik sehingga keahlian order taking, processing, dan billing dijual ke pihak lain.", FX + 0.5, FY + 3.7, 5.9, { bodyH: 1.25, titleSize: 13 });
  // angka kunci di kanan
  const stats = [["150+", "gudang di seluruh dunia"], ["200 juta", "item tersedia di situs"], ["200.000", "pieces per hari dari satu gudang"], ["< 3 menit", "tenaga kerja per pesanan"]];
  stats.forEach((st, i) => {
    const y = FY + 1.35 + i * 1.3;
    s.addShape(pres.shapes.RECTANGLE, { x: 7.6, y, w: 4.9, h: 1.1, fill: { color: WHITE }, line: { color: WHITE, width: 0 } });
    s.addText(st[0], { x: 7.75, y: y + 0.08, w: 4.6, h: 0.6, fontFace: HF, fontSize: 26, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
    T(s, st[1], 7.75, y + 0.68, 4.6, 0.35, { size: 10.5, color: BLACK });
  });
}

// ============================================================ 7. APAKAH RENCANA AWALNYA SALAH
{
  const s = frame();
  H(s, "Apakah rencana awalnya salah?", TX, FY + 0.45, TW + 1.5, 28);
  T(s, "Bukan salah, tetapi asumsinya tidak bisa dipertahankan begitu value proposition ditetapkan. Bezos menetapkan pengalaman pelanggan harus menghasilkan tiga hal sekaligus:", TX, FY + 1.15, TW + 1.0, 0.7, { size: 11.5 });
  numList(s, ["Lowest price: harga terendah", "Fastest delivery: pengiriman tercepat", "Error-free: pemenuhan pesanan bebas kesalahan"], TX, FY + 1.9, TW + 1.0, { rowH: 0.4, gap: 0.08, size: 11, numSize: 15 });
  T(s, "Kalimat kunci dari buku: exchanges and returns are very expensive. Kesalahan bukan sekadar masalah mutu, tetapi biaya.", TX, FY + 3.4, TW + 1.0, 0.5, { size: 11, italic: true, color: BLACK });
  table(s, [
    ["Target", "Pemenuhan oleh pihak ketiga", "Pemenuhan dikelola sendiri"],
    ["Fastest delivery", "Kecepatan bergantung stok dan proses orang lain; janji waktu kirim tidak bisa dibuat", "Stok diletakkan di gudang terdekat pelanggan; waktu proses internal bisa ditekan"],
    ["Error-free", "Kesalahan pihak lain menjadi biaya return Amazon, tetapi tidak bisa dikendalikan", "Titik kontrol (pemindaian, penimbangan) dirancang sendiri"],
    ["Lowest price", "Margin pihak ketiga masuk ke harga", "Biaya per pesanan ditekan lewat volume dan otomasi"],
  ], TX, FY + 3.95, TW + 1.0, [1.4, 2.75, 2.75], { size: 9.5 });
  picRight(s, "packing", { w: 4.9, h: 3.0 });
  HL(s, "Menyimpan persediaan sendiri bukan penyimpangan dari strategi Amazon, melainkan konsekuensinya. Value proposition men-direct keputusan di belakangnya.", IMGX + 0.9, FY + 0.5, IMGW - 0.9, 1.3, { size: 11, bold: false });
}

// ============================================================ 8. 4V
{
  const s = frame();
  H(s, "Karakter operasi Amazon dengan 4V", TX, FY + 0.45, TW + 2.0, 28);
  T(s, "Karakter operasi menentukan cara mengelolanya, meskipun industrinya sama. Bukti dari buku; posisi pada skala adalah penilaian penyusun.", TX, FY + 1.15, TW + 2.0, 0.55, { size: 11.5 });
  table(s, [
    ["Dimensi", "Posisi", "Bukti", "Konsekuensi pada persediaan"],
    ["Volume", "Sangat tinggi", "200.000 pieces/hari per gudang; 150+ gudang", "Economies of scale: otomasi dan standardisasi ekonomis, biaya per unit turun"],
    ["Variety", "Sangat tinggi", "200 juta item; 70% pesanan berisi lebih dari satu produk", "Kesalahan pengambilan mudah terjadi; akurasi catatan per item menjadi persoalan utama"],
    ["Variation", "Tinggi", "Ritel daring dengan musim puncak; gudang dirancang untuk kapasitas harian maksimum", "Perlu stok pengaman dan kapasitas yang bisa menyerap lonjakan"],
    ["Visibility", "Rendah", "Pelanggan hanya melihat hasil: harga, waktu tiba, ketepatan isi paket", "Proses gudang bebas dirancang untuk efisiensi"],
  ], TX, FY + 1.8, TW + 2.0, [1.1, 1.2, 2.8, 2.8], { size: 9.5 });
  HL(s, "Secara natural volume tinggi berpasangan dengan variety rendah. Amazon punya keduanya tinggi.", TX, FY + 5.0, TW + 2.0, 0.42, { size: 11.5 });
  T(s, "Kombinasi ini tidak otomatis berarti tidak efisien, asalkan kustomisasi (komposisi pesanan yang berbeda-beda) bisa dilayani dengan proses massal: pengambilan massal dalam batch, penyusunan per pesanan di ujung proses. Strateginya menuntut cost dan response sekaligus; apakah keduanya benar bertentangan diperiksa pada analisis trade-off.", TX, FY + 5.5, TW + 2.0, 1.1, { size: 10.5 });
  picRight(s, "delivery", { w: 3.6, h: 6.0 });
}

// ============================================================ 9-10. DELAPAN LANGKAH (gambar penuh)
const STEPS = [
  ["Pesanan masuk, komputer di Seattle mengambil alih", "Komputer menugaskan pesanan (buku, permainan, kamera digital) ke salah satu pusat distribusi besar di AS. Ini jawaban atas where; syaratnya catatan stok tiap DC benar saat itu juga (perpetual inventory)."],
  ["Flow meister di DC menerima pesanan", "Ia menentukan pekerja mana pergi ke mana. Pesanan diubah menjadi penugasan picking; masih ada manusia sebagai pengatur beban kerja."],
  ["Picking", "Sistem Amazon menggandakan kecepatan picking operator manual dan menurunkan tingkat kesalahan mendekati nol. Mekanismenya robot Kiva."],
  ["Barang masuk crate di ban berjalan", "Crate kuning berisi pesanan banyak pelanggan; conveyor lebih dari 10 mil, 2,9 kaki/detik; bar code dipindai 15 kali oleh mesin dan pekerja. Batch picking dan verifikasi berulang: record accuracy paling konkret."],
  ["Ketiga barang bertemu di chute, lalu masuk kotak", "Bar code dicocokkan dengan nomor pesanan; chute selebar 3 kaki (ribuan); kotak diberi bar code baru. Picking diurutkan untuk mengurangi perjalanan operator (sortation dan sequencing)."],
  ["Pembungkusan kado manual", "Dilakukan tim pembungkus terlatih dengan standar 30 paket per jam. Sengaja tidak diotomasi: variasi tinggi, volume kecil; dikelola dengan standard time."],
  ["Kotak dikemas, dilakban, ditimbang, dilabeli", "Gudang tipikal mengirim sampai 200.000 pieces per hari; sekitar 60% lewat USPS, sisanya UPS. Penimbangan adalah verifikasi akhir isi paket; moda kirim mayoritas berbiaya rendah."],
  ["Pesanan tiba di pelanggan", "Dalam 1 atau 2 hari. Inilah ukuran yang dilihat pelanggan: speed dan dependability."],
];
function stepsSlide(from, img, title) {
  const s = frame({ plain: true });
  picFull(s, img);
  H(s, title, FX + 0.5, FY + 0.4, 11, 26);
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const x = FX + 0.5 + col * 6.1, y = FY + 1.3 + row * 2.6;
    numBlock(s, from + i + 1, STEPS[from + i][0], STEPS[from + i][1], x, y, 5.8, { titleSize: 12.5, bodyH: 1.35, bodySize: 10 });
  }
}
stepsSlide(0, "totes", "Proses pemenuhan pesanan: langkah 1 sampai 4");
stepsSlide(4, "sortation", "Proses pemenuhan pesanan: langkah 5 sampai 8");

// ============================================================ 11. DUA ANGKA
{
  const s = frame();
  H(s, "Dua angka yang berbeda", TX, FY + 0.45, TW + 1.0, 28);
  T(s, "Menerima, memproses, menempatkan stok, lalu mengambil dan mengemas satu pesanan secara akurat memerlukan investasi tenaga kerja kurang dari 3 menit; 70% pesanan adalah pesanan multiproduk; buku menyebutnya world-class performance.", TX, FY + 1.15, TW, 1.0, { size: 11.5 });
  s.addText("< 3 menit", { x: TX, y: FY + 2.2, w: 2.9, h: 0.7, fontFace: HF, fontSize: 30, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  HL(s, "Ukuran input (biaya)", TX, FY + 2.9, 2.7, 0.34, { size: 11 });
  T(s, "Jam kerja yang dipakai per pesanan, hasil dari efisiensi proses di dalam gudang.", TX, FY + 3.3, 2.75, 0.9, { size: 10.5 });
  s.addText("1–2 hari", { x: TX + 3.1, y: FY + 2.2, w: 2.9, h: 0.7, fontFace: HF, fontSize: 30, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  HL(s, "Ukuran output (speed)", TX + 3.1, FY + 2.9, 2.7, 0.34, { size: 11 });
  T(s, "Yang dirasakan pelanggan, hasil dari posisi stok yang dekat pelanggan, bukan dari proses gudang saja.", TX + 3.1, FY + 3.3, 2.75, 0.9, { size: 10.5 });
  HL(s, "Dua angka ini jangan dicampur saat presentasi. Amazon unggul di keduanya, tetapi mekanismenya berbeda. Angka 70% pesanan multiproduk menunjukkan kecepatan itu dicapai pada pesanan yang komposisinya berbeda-beda, bukan pada pesanan seragam.", TX, FY + 4.4, TW, 1.2, { size: 11, bold: false });
  picRight(s, "packing");
}

// ============================================================ 12. ROBOT KIVA
{
  const s = frame();
  H(s, "Mekanisme robot Kiva", TX, FY + 0.45, TW + 1.0, 28);
  T(s, "Langkah picking hanya menyebut hasilnya. Mekanismenya dijelaskan pada bab tata letak, dan dari sinilah angka kecepatan dan akurasi itu berasal.", TX, FY + 1.15, TW, 0.6, { size: 11.5 });
  numList(s, [
    ["10.000+ robot Kiva", "Robot membawa rak berisi stok ke pekerja; buku menyamakannya dengan lini perakitan bergerak: barangnya yang bergerak, bukan orangnya."],
    ["20 mil jalan kaki per hari dihemat", "Di gudang Tracy, California (1,2 juta kaki persegi), picker berdiri di satu tempat dan robot membawa rak kepadanya."],
    ["100 menjadi 300 item per jam", "Standar pick and scan per pekerja naik tiga kali lipat."],
    ["20–40% biaya per pesanan dipangkas", "Dari biaya US$3,50–3,75 untuk sort, pick, pack; setara US$400–900 juta per tahun."],
  ], TX, FY + 1.85, TW, { rowH: 0.8, gap: 0.12, size: 10.5, numSize: 18 });
  HL(s, "Dari sisi persediaan, robot mengubah dua hal: lokasi fisik stok tidak lagi harus tetap (slotting diatur perangkat lunak), dan setiap pengambilan langsung dipindai sehingga catatan stok diperbarui bersamaan dengan pengambilan fisik.", TX, FY + 5.6, TW, 0.95, { size: 10.5, bold: false });
  picRight(s, "robots");
}

// ============================================================ 13. PRODUKTIVITAS
{
  const s = frame();
  H(s, "Produktivitas yang adil", TX, FY + 0.45, TW + 1.5, 28);
  T(s, "Angka 100 menjadi 300 item per jam mudah dibaca sebagai kenaikan produktivitas 200%. Itu single-factor productivity, hanya menghitung tenaga kerja. Ukurannya not fair, karena kenaikan itu dicapai dengan menambah resource lain (robot) yang biayanya tidak ikut dihitung. Yang adil adalah multi-factor productivity: semua resource diuangkan lalu dijumlahkan.", TX, FY + 1.15, TW + 1.2, 1.3, { size: 11.5 });
  table(s, [
    ["Ukuran", "Angka dari buku", "Cara membacanya"],
    ["Labor productivity (single-factor)", "100 menjadi 300 item/jam per pekerja", "Naik 200%. Benar, tetapi belum memperhitungkan investasi robot"],
    ["Biaya per pesanan (multi-factor, termasuk robot)", "Turun 20–40% dari US$3,50–3,75 per pesanan", "Penghematan bersih sekitar US$0,70–1,50 per pesanan. Jauh di bawah 200%, tetapi tetap positif"],
    ["Dampak tahunan", "US$400–900 juta per tahun", "Angka kecil per pesanan menjadi besar karena volume"],
  ], TX, FY + 2.55, TW + 1.2, [2.2, 2.3, 2.6], { size: 9.5 });
  HL(s, "Investasi robot terbukti menaikkan produktivitas, tetapi klaimnya harus dikoreksi dengan ukuran multi-faktor. Yang dipresentasikan sebaiknya angka biaya per pesanan, bukan angka 200%.", TX, FY + 5.3, TW + 1.2, 0.95, { size: 11, bold: false });
  picRight(s, "scanner", { w: 4.6, h: 3.6 });
}

// ============================================================ 14. STOK BESAR, TIDAK EFISIEN?
{
  const s = frame();
  H(s, "Stok besar, tidak efisien?", TX, FY + 0.45, TW, 28);
  T(s, "Buku merumuskan tujuan inventory management sebagai keseimbangan antara investasi persediaan dan layanan pelanggan; persediaan bisa mencapai 50% dari total modal. Amazon jelas di sisi investasi besar: jutaan item di lebih dari 150 gudang.", TX, FY + 1.15, TW, 1.0, { size: 11.5 });
  HL(s, "Jawabannya harus dikembalikan ke objective.", TX, FY + 2.25, TW, 0.42, { size: 12.5 });
  T(s, "Amazon tidak meminimalkan stok. Amazon meminimalkan total biaya pada tingkat layanan yang sudah dijanjikan (tercepat, bebas kesalahan). Pada tingkat itu, kekosongan stok berarti penjualan hilang dan janji fastest delivery rusak: dampaknya signifikan, sehingga stok besar konsisten dengan tujuannya, bukan pemborosan.\n\nYang diminimalkan Amazon adalah dua komponen lain: tenaga kerja per pesanan (kurang dari 3 menit) dan kesalahan (mendekati nol).", TX, FY + 2.8, TW, 2.4, { size: 11 });
  HL(s, "Bukan stok sedikit, tetapi stok besar yang dikelola presisi.", TX, FY + 5.35, TW, 0.42, { size: 12.5 });
  picRight(s, "shelves");
}

// ============================================================ 15. LIMA TUJUAN KINERJA
{
  const s = frame();
  H(s, "Lima tujuan kinerja operasi", TX, FY + 0.45, TW + 2.5, 28);
  table(s, [
    ["Tujuan kinerja", "Wujud di Amazon", "Mekanisme yang menghasilkannya"],
    ["Speed", "Tiba 1–2 hari; tenaga kerja < 3 menit per pesanan", "Alokasi ke DC yang punya stok; conveyor konstan; picking diurutkan; robot membawa rak"],
    ["Quality (bebas kesalahan)", "Kesalahan picking mendekati nol; bar code dipindai 15 kali", "Verifikasi di setiap perpindahan; penimbangan sebelum keluar"],
    ["Dependability", "Janji 1–2 hari terpenuhi; tidak perlu kontak lanjutan", "Ketersediaan stok dan proses terstandar. As promised, bukan sekadar cepat"],
    ["Flexibility", "70% pesanan multiproduk dari 200 juta item dilayani satu sistem", "Batch picking ke crate bersama, lalu konsolidasi per pesanan di chute"],
    ["Cost", "Harga terendah; 60% kiriman lewat USPS; biaya sort-pick-pack turun 20–40%", "Volume menyerap biaya tetap otomasi; moda kirim murah untuk mayoritas pesanan"],
  ], TX, FY + 1.25, TW + 1.4, [1.5, 2.8, 3.0], { size: 9.5 });
  HL(s, "Kelima tujuan kinerja dipenuhi oleh satu sistem yang sama: stok yang akurat lokasinya, proses yang pendek, dan kontrol berlapis.", TX, FY + 5.3, TW + 1.4, 0.75, { size: 11, bold: false });
  picRight(s, "dock", { w: 4.4 });
}

// ============================================================ 16. TIGA TRADE-OFF
{
  const s = frame();
  H(s, "Tiga trade-off utama", TX, FY + 0.45, TW + 2.5, 28);
  const tos = [
    ["Holding cost vs service level", "Carrying cost sekitar 26% dari nilai persediaan per tahun, dan biaya kebijakan naik eksponensial ketika service level dinaikkan.", "Aturan: bandingkan biaya simpan tambahan dengan biaya kekosongan. Untuk ritel daring biaya kekosongan tinggi, sehingga pilihan Amazon di sisi stok tinggi konsisten."],
    ["Otomasi (biaya tetap) vs kesalahan dan tenaga kerja (biaya variabel)", "Pemindaian 15 kali, penimbangan, dan robot adalah biaya tetap. Kesalahan menimbulkan biaya return, kirim ulang, dan hilangnya kepercayaan.", "Aturan: otomasi layak kalau penghematan per pesanan dikali jumlah pesanan per tahun lebih besar dari biaya tahunan otomasi. Penentunya volume, bukan teknologinya."],
    ["Kecepatan kirim vs biaya kirim", "Kirim lebih cepat biasanya lebih mahal; barang lebih lama di jalan menahan modal. Amazon mengirim 60% pesanan lewat USPS, moda yang murah.", "Aturan: kecepatan dibangun dari dalam (stok dekat pelanggan, proses gudang pendek), sehingga moda kirim murah tetap bisa dipakai."],
  ];
  tos.forEach((t, i) => {
    const y = FY + 1.25 + i * 1.75;
    s.addText(String(i + 1).padStart(2, "0"), { x: TX, y, w: 0.7, h: 0.5, fontFace: HF, fontSize: 20, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
    HL(s, t[0], TX + 0.75, y, TW + 1.6, 0.42, { size: 11.5, fill: PALE });
    T(s, t[1], TX + 0.75, y + 0.5, TW + 1.6, 0.6, { size: 10 });
    HL(s, t[2], TX + 0.75, y + 1.1, TW + 1.6, 0.55, { size: 9.5, bold: false });
  });
  picRight(s, "giftwrap", { w: 3.3, h: 5.0 });
}

// ============================================================ 17. VERIFIKASI TRADE-OFF
{
  const s = frame();
  H(s, "Verifikasi trade-off", TX, FY + 0.45, TW, 28);
  T(s, "Sebelum menyimpulkan ada trade-off, periksa dulu apakah dua tujuan itu benar bertentangan atau justru complementary. Kalau searah, tidak perlu ditimbang; kerjakan saja.", TX, FY + 1.15, TW + 1.6, 0.6, { size: 11.5 });
  table(s, [
    ["Pasangan tujuan", "Hubungan", "Alasan"],
    ["Akurasi (kesalahan nol) vs biaya", "Searah", "Setiap kesalahan yang dicegah menghilangkan biaya return. Tidak ada yang perlu dikorbankan."],
    ["Kecepatan proses internal vs biaya", "Searah", "Kurang dari 3 menit per pesanan sekaligus menekan biaya dan mempercepat."],
    ["Ketersediaan stok vs holding cost", "Trade-off nyata", "Stok pengaman menaikkan biaya simpan. Amazon memilih sadar di sisi service level tinggi."],
    ["Kecepatan kirim vs biaya kirim", "Trade-off nyata, dihindari", "Sumber kecepatan dipindahkan dari moda kirim ke posisi stok dan proses gudang."],
  ], TX, FY + 1.85, TW + 1.6, [2.2, 1.4, 3.9], { size: 9.5 });
  HL(s, "Dari tiga target Bezos, hanya ketersediaan stok yang benar-benar menuntut pengorbanan biaya. Dua target lain justru menurunkan biaya.", TX, FY + 4.7, TW + 1.6, 0.7, { size: 11, bold: false });
  H(s, "Efficient frontier", TX, FY + 5.55, TW, 13);
  numList(s, ["Pengecer virtual (1995): modal paling rendah, tetapi tidak memenuhi constraint bebas kesalahan dan tercepat", "Gudang sendiri, manual: didominasi alternatif otomasi pada volume Amazon; dicoret", "Gudang sendiri, terotomasi: di frontier; dipilih sesuai value proposition"], TX, FY + 5.9, TW + 1.6, { rowH: 0.26, gap: 0.04, size: 8.5, numSize: 10 });
  picRight(s, "dock", { w: 3.6, h: 3.6, y: FY + 0.5 });
  T(s, "Catatan: dominasi otomasi atas manual hanya berlaku pada volume Amazon. Pada volume kecil, biaya tetap robot tidak terserap dan alternatif manual kembali ke frontier.", FX + FW - 0.15 - 3.6, FY + 3.7, 3.6, 1.2, { size: 9.5, italic: true, color: DARK });
}

// ============================================================ 18. KAITAN TEORI
{
  const s = frame();
  H(s, "Kaitan dengan teori persediaan", TX, FY + 0.45, TW + 1.5, 28);
  table(s, [
    ["Konsep Bab 12", "Wujud di Amazon", "Status"],
    ["Fungsi persediaan: pilihan barang untuk permintaan yang diantisipasi", "Jutaan item di 150+ gudang; buku menyebut fungsi ini tipikal ritel", "Eksplisit"],
    ["Record accuracy: sistem perpetual dengan bar code", "Bar code dipindai 15 kali; alokasi dari Seattle mengandalkan catatan stok per DC", "Eksplisit; inferensi (alokasi)"],
    ["Cycle counting", "Tidak disebut; verifikasi berkala tetap diperlukan untuk kesalahan fisik", "Asumsi"],
    ["ABC analysis / Pareto", "Praktik 2023: same-day facility menyimpan 100.000 item terlaris per wilayah", "Sumber lain"],
    ["Kontrol persediaan ritel: barang masuk dan keluar dengan bar code", "Setiap item dan kotak diberi bar code; penimbangan sebelum keluar gudang", "Eksplisit"],
    ["Independent demand; ROP = permintaan selama lead time + Zσ", "Service level tinggi menuntut safety stock besar, sejalan dengan investasi persediaan Amazon", "Inferensi"],
    ["Penempatan di gudang: rasio trip/blok tertinggi paling dekat dock", "Picking is sequenced to reduce operator travel; robot membuat slotting bisa diatur perangkat lunak", "Eksplisit; inferensi"],
  ], TX, FY + 1.2, TW + 1.6, [2.8, 3.3, 1.4], { size: 9 });
  HL(s, "Profil Amazon menekankan sisi pengendalian (akurasi catatan, kontrol barang keluar, aliran kerja), bukan model kuantitatif. Urutannya: akurasi dulu, model kemudian.", TX, FY + 5.65, TW + 1.6, 0.7, { size: 10.5, bold: false });
  picRight(s, "scanner", { w: 3.6, h: 6.0 });
}

// ============================================================ 19. PERKEMBANGAN
{
  const s = frame();
  H(s, "Perkembangan terbaru", TX, FY + 0.45, TW + 1.0, 28);
  T(s, "Buku menggambarkan kondisi sekitar 2017. Sumber berikut dari blog resmi para penulis buku, sehingga sejalan dengan rujukan kelas.", TX, FY + 1.15, TW, 0.6, { size: 11.5 });
  s.addText("2023", { x: TX, y: FY + 1.8, w: 2, h: 0.55, fontFace: HF, fontSize: 26, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  bullets(s, ["Jaringan AS dibagi 8 wilayah dengan stok lengkap per wilayah; lebih dari 76% permintaan dipenuhi dari dalam wilayahnya", "Same-day facility menyimpan 100.000 item terlaris per wilayah, dipilih dengan machine learning", "Rata-rata picking sampai paket di dock keluar: 11 menit"], TX, FY + 2.4, TW, 1.3, 10.5);
  HL(s, "Melanjutkan langkah alokasi ke DC menjadi keputusan where per wilayah; pemilihan 100.000 item terlaris adalah Pareto/ABC pada penempatan stok.", TX, FY + 3.7, TW, 0.55, { size: 9.5, bold: false, fill: PALE });
  s.addText("2025", { x: TX, y: FY + 4.4, w: 2, h: 0.55, fontFace: HF, fontSize: 26, bold: true, color: ORANGE, isTextBox: true, margin: 0 });
  bullets(s, ["Lebih dari satu juta robot beroperasi; sekitar 75% pengiriman global melibatkan bantuan robot", "Paket terkirim per karyawan per tahun naik dari 175 menjadi 3.870 dalam satu dekade"], TX, FY + 5.0, TW, 0.9, 10.5);
  HL(s, "Angka per karyawan adalah ukuran single-factor; jangan dibaca sebagai efisiensi total.", TX, FY + 5.95, TW, 0.42, { size: 9.5, bold: false, fill: PALE });
  picRight(s, "robots");
}

// ============================================================ 20. LESSON LEARNED (gambar penuh)
{
  const s = frame({ plain: true });
  picFull(s, "dock");
  H(s, "Lesson learned: apa yang bisa dan tidak bisa ditiru", FX + 0.5, FY + 0.4, 11.5, 26);
  const L = [
    ["Persediaan bisa menjadi keunggulan bersaing", "Syaratnya dikelola presisi: stok besar yang diketahui lokasinya, diambil benar, diproses cepat."],
    ["Akurasi catatan adalah prasyarat", "Delapan langkah runtuh kalau catatan stok per DC salah. Akurasi dulu, model kemudian."],
    ["Kecepatan dibangun dari dalam", "Posisi stok dan proses pendek memungkinkan moda kirim murah untuk 60% pesanan."],
    ["Kontrol berlapis karena biaya kesalahan lebih besar", "Bukan trade-off; keduanya searah. Kerjakan saja."],
    ["Otomasi dibenarkan oleh volume", "Penghematan US$0,70–1,50 per pesanan hanya berarti pada ratusan ribu pieces per hari."],
    ["Trade-off yang tersisa dipilih secara sadar", "Holding cost tinggi diterima karena dampak kekosongan di ritel daring signifikan."],
  ];
  L.forEach((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    numBlock(s, i + 1, l[0], l[1], FX + 0.5 + col * 6.1, FY + 1.3 + row * 1.75, 5.8, { titleSize: 12, bodyH: 0.62, bodySize: 9.5 });
  });
}

pres.writeFile({ fileName: OUT }).then(() => console.log("ditulis:", OUT, "| slide:", slideNo));
