// Deck PPTX: Studi Kasus 4 - Inventory Management di Amazon.com
// Tata letak mengikuti referensi: kartu putih besar dengan garis peta di dalamnya, judul
// condensed hitam, teks kecil abu-abu, kalimat kunci di strip merah muda, gambar kolase
// menempel di sudut kanan-bawah kartu, dan slide gambar penuh dengan nomor besar merah muda.
// Jalankan:  IMG=/path/ke/img node build_deck.js
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const IMG = process.env.IMG || path.join(__dirname, "img");
const OUT = path.join(__dirname, "Presentasi_Studi_Kasus_4_Amazon_Kelompok_4.pptx");
const AR = JSON.parse(fs.readFileSync(path.join(IMG, "crop", "ar.json"), "utf8"));

const BLACK = "111111", PINK = "F3A6B9", PINK2 = "E4708F", GRAY = "5A5A5A", WHITE = "FFFFFF";
const HF = "Arial Narrow", BF = "Calibri";
const SW = 13.333, SH = 7.5;
const FX = 0.4, FY = 0.4, FW = SW - 0.8, FH = SH - 0.8;   // kartu utama
const PAD = 0.55, TX = FX + PAD, TW = 5.7;                 // kolom teks

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Kelompok 4";
pres.title = "Inventory Management sebagai Keunggulan Kompetitif Amazon.com";

let slideNo = 0;
const shadow = () => ({ type: "outer", blur: 10, offset: 3, angle: 60, color: "000000", opacity: 0.16 });

function frame(opts = {}) {
  const s = pres.addSlide();
  slideNo += 1;
  s.background = { color: WHITE };
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: FX, y: FY, w: FW, h: FH, fill: { color: WHITE }, line: { color: "E6E6E6", width: 0.5 }, rectRadius: 0.16, shadow: shadow() });
  if (!opts.plain) s.addImage({ path: path.join(IMG, "map_bg.jpg"), x: FX + 0.04, y: FY + 0.04, w: FW - 0.08, h: FH - 0.08, transparency: opts.mapT ?? 62 });
  s.addText(String(slideNo), { x: SW - 0.95, y: SH - 0.36, w: 0.5, h: 0.25, fontFace: HF, fontSize: 10, bold: true, color: PINK2, align: "right", isTextBox: true, margin: 0 });
  return s;
}
// gambar menempel ke sudut kanan-bawah kartu
function picRight(s, name, opts = {}) {
  const maxW = opts.w || (FX + FW - (TX + TW) - 0.25), maxH = opts.h || (FH - 0.5);
  let w = maxW, h = w / AR[name];
  if (h > maxH) { h = maxH; w = h * AR[name]; }
  const x = opts.x ?? (FX + FW - w - 0.02), y = opts.y ?? (FY + FH - h - 0.02);
  s.addImage({ path: path.join(IMG, "crop", name + ".jpg"), x, y, w, h });
  return { x, y, w, h };
}
function picFull(s, name) {
  const inner = { x: FX + 0.08, y: FY + 0.08, w: FW - 0.16, h: FH - 0.16 };
  s.addImage({ path: path.join(IMG, "crop", name + "_full.jpg"), x: inner.x, y: inner.y, w: inner.w, h: inner.h, sizing: { type: "cover", w: inner.w, h: inner.h } });
  s.addShape(pres.shapes.RECTANGLE, { x: inner.x, y: inner.y, w: inner.w, h: inner.h, fill: { color: WHITE, transparency: 70 }, line: { color: WHITE, width: 0 } });
}
// judul condensed hitam
function H(s, text, x, y, w, size = 30, opts = {}) {
  s.addText(text.toUpperCase(), { x, y, w, h: opts.h || (size / 72) * 1.25 * (opts.lines || 1) + 0.08, fontFace: HF, fontSize: size, bold: true, color: opts.color || BLACK, isTextBox: true, margin: 0, valign: "top", align: opts.align || "left", lineSpacingMultiple: 0.92 });
}
function T(s, text, x, y, w, h, opts = {}) {
  s.addText(text, { x, y, w, h, fontFace: BF, fontSize: opts.size || 10, color: opts.color || GRAY, isTextBox: true, margin: 0, valign: "top", align: opts.align || "left", bold: !!opts.bold, italic: !!opts.italic, lineSpacingMultiple: 1.05 });
}
// strip merah muda di belakang teks
function HL(s, text, x, y, w, h, opts = {}) {
  s.addText(text, { x, y, w, h, fontFace: opts.font || BF, fontSize: opts.size || 10.5, bold: !!opts.bold, color: opts.color || BLACK, fill: { color: opts.fill || PINK }, isTextBox: true, margin: [0.03, 0.08, 0.03, 0.08], valign: "middle", align: "left", lineSpacingMultiple: 1.05 });
}
// blok "judul kecil + teks" bertumpuk (pola ОБЪЕКТ / ПРЕДМЕТ)
function block(s, title, body, x, y, w, opts = {}) {
  H(s, title, x, y, w, opts.size || 18);
  T(s, body, x, y + (opts.size || 18) / 72 * 1.25 + 0.1, w, opts.h || 0.6, { size: opts.bodySize || 10 });
}
// daftar bernomor "1." dengan teks di strip merah muda (pola ЗАДАЧИ)
function numList(s, items, x, y, w, opts = {}) {
  const rowH = opts.rowH || 0.34, gap = opts.gap || 0.1;
  items.forEach((it, i) => {
    const yy = y + i * (rowH + gap);
    s.addText((i + 1) + ".", { x, y: yy, w: 0.35, h: rowH, fontFace: HF, fontSize: opts.numSize || 13, bold: true, color: BLACK, isTextBox: true, margin: 0, valign: "middle" });
    HL(s, it, x + 0.38, yy, w - 0.38, rowH, { size: opts.size || 10 });
  });
  return y + items.length * (rowH + gap);
}
// panah lengkung hitam kecil (coretan pada referensi)
function arrow(s, x, y) {
  s.addShape(pres.shapes.CURVED_RIGHT_ARROW, { x, y, w: 0.55, h: 0.75, fill: { color: BLACK }, line: { color: BLACK, width: 0 }, rotate: 200 });
}
// blok bernomor di atas gambar penuh (pola //01 //02): nomor besar merah muda + judul di strip putih + isi di strip putih
function numBlock(s, n, title, body, x, y, w, opts = {}) {
  s.addText(String(n).padStart(2, "0"), { x, y: y - 0.12, w: 1.3, h: 0.9, fontFace: HF, fontSize: opts.numSize || 44, bold: true, color: PINK2, isTextBox: true, margin: 0, valign: "middle" });
  HL(s, title.toUpperCase(), x + 1.25, y + 0.02, w - 1.25, 0.6, { font: HF, size: opts.titleSize || 17, fill: WHITE, bold: true });
  if (body) HL(s, body, x + 1.25, y + 0.72, w - 1.25, opts.bodyH || 0.9, { size: opts.bodySize || 9.5, fill: WHITE, color: GRAY });
}

// ============================================================ 1. SAMPUL
{
  const s = frame({ mapT: 55 });
  picRight(s, "hero", { w: 9.0, h: 4.4, x: FX + 0.15, y: FY + FH - 4.4 - 0.02 });
  s.addText("INVENTORY MANAGEMENT\nSEBAGAI KEUNGGULAN\nKOMPETITIF AMAZON.COM", { x: 6.6, y: FY + 0.35, w: 6.2, h: 2.1, fontFace: HF, fontSize: 36, bold: true, color: BLACK, lineSpacingMultiple: 0.9, isTextBox: true, margin: 0, valign: "top", align: "left" });
  H(s, "Kelompok 4", TX, FY + 0.4, 3, 20);
  T(s, "Bagaskoro  ·  25/574280/PEK/31778\nAulia Sisca Rahmadiyanti  ·  25/574305/PEK/31789\nFitra Aidila  ·  25/574309/PEK/31791", TX, FY + 0.85, 5.0, 0.9, { size: 10, color: BLACK });
}

// ============================================================ 2. ALUR PEMBAHASAN (pola ЦЕЛЬ / ЗАДАЧИ)
{
  const s = frame();
  s.addImage({ path: path.join(IMG, "map_bg.jpg"), x: 7.2, y: FY + 0.6, w: 5.5, h: 5.6, transparency: 25, sizing: { type: "cover", w: 5.5, h: 5.6 } });
  H(s, "Tujuan", TX, FY + 0.5, 8.0, 30);
  HL(s, "Membaca kasus Amazon dari strategi ke bawah: mengapa persediaan dipegang sendiri, bagaimana satu pesanan dipenuhi, dan trade-off apa yang diambil.", TX, FY + 1.15, TW, 0.62, { size: 10.5 });
  arrow(s, TX + 0.2, FY + 1.95);
  H(s, "Alur pembahasan", TX + 1.0, FY + 2.15, TW, 30);
  numList(s, [
    "Kerangka berpikir: strategi dulu, baru keputusan teknis",
    "Kisah sukses: dari pengecer virtual ke pengelola persediaan",
    "Proses pemenuhan pesanan: delapan langkah dan kuantifikasinya",
    "Analisis trade-off: mana trade-off nyata, mana yang searah",
    "Kaitan dengan teori persediaan",
    "Perkembangan terbaru: 2023 dan 2025",
    "Lesson learned: apa yang bisa dan tidak bisa ditiru",
  ], TX + 1.0, FY + 2.85, TW - 0.4, { rowH: 0.36, gap: 0.09 });
}

// ============================================================ 3. KERANGKA BERPIKIR (pola АКТУАЛЬНОСТЬ)
{
  const s = frame();
  H(s, "Kerangka berpikir persediaan", TX, FY + 0.5, 8.0, 30);
  T(s, "Tentukan dulu apa yang mau dicapai (strategi dan value proposition), baru turunkan ke keputusan teknis. Inventory management ada di lapisan teknis itu, satu kelompok dengan MRP, sequencing, dan scheduling. Dalam sepuluh keputusan OM (Heizer), persediaan adalah keputusan ke-8 dengan dua pertanyaan dasar, ditambah satu pertanyaan khusus Amazon.", TX, FY + 1.15, TW, 1.2, { size: 10 });
  block(s, "How much", "Berapa banyak persediaan setiap item yang harus dimiliki?", TX, FY + 2.55, TW, { h: 0.35 });
  block(s, "When", "Kapan harus memesan kembali?", TX, FY + 3.35, TW, { h: 0.35 });
  block(s, "Where", "Item mana disimpan di gudang mana; stok Amazon tersebar di lebih dari 150 gudang.", TX, FY + 4.15, TW, { h: 0.5 });
  HL(s, "Where adalah keputusan yang membuat Amazon berbeda dari toko tunggal: stok harus berada dekat pelanggan sebelum pesanan datang.", TX, FY + 5.15, TW, 0.62, { size: 10.5 });
  picRight(s, "shelves");
}

// ============================================================ 4. STRUKTUR KEPUTUSAN (pola ОБЪЕКТ / ПРЕДМЕТ)
{
  const s = frame();
  H(s, "Struktur keputusan persediaan", TX, FY + 0.5, 8.0, 30);
  T(s, "Kalau kita modelkan, persoalan persediaan selalu punya struktur yang sama: ada tujuan, ada variabel yang bisa diatur, dan ada batasan.", TX, FY + 1.15, TW, 0.5, { size: 10 });
  block(s, "Objective", "Umum: meminimalkan total biaya persediaan (biaya simpan + biaya pesan + biaya kekurangan).\nAmazon: ditambah satu komponen yang oleh buku disebut sangat mahal, biaya kesalahan pemenuhan (returns).", TX, FY + 1.85, TW, { h: 0.75 });
  block(s, "Decision variables", "Umum: jumlah pesan (Q), titik pesan ulang (ROP), stok pengaman.\nAmazon: ditambah alokasi, item apa di gudang mana dan pesanan mana dipenuhi dari gudang mana.", TX, FY + 3.0, TW, { h: 0.75 });
  block(s, "Constraints", "Umum: service level yang dijanjikan, kapasitas gudang, lead time pemasok.\nAmazon: janji ke pelanggan, harga terendah, kirim tercepat, bebas kesalahan.", TX, FY + 4.15, TW, { h: 0.75 });
  HL(s, "Service level adalah constraint, bukan objective. Perusahaan tidak meminimalkan stok; perusahaan meminimalkan biaya pada tingkat layanan yang sudah dijanjikan.", TX, FY + 5.35, TW, 0.62, { size: 10.5 });
  picRight(s, "totes", { w: 5.3 });
}

// ============================================================ 5. DILEMA DAN ATURAN KEPUTUSAN
{
  const s = frame();
  H(s, "Dilema persediaan", TX, FY + 0.5, 8.0, 30);
  block(s, "Stok terlalu banyak", "Biaya simpan dan biaya penanganan naik; modal tertahan di gudang; risiko barang usang (obsolescence).", TX, FY + 1.2, TW, { h: 0.5 });
  block(s, "Stok terlalu sedikit", "Stock out, permintaan tidak terpenuhi; kalau terjadi di produksi, produksinya berhenti. Pada ritel daring, pelanggan berpindah ke penjual lain dalam hitungan detik.", TX, FY + 2.2, TW, { h: 0.65 });
  arrow(s, TX + 0.1, FY + 3.25);
  H(s, "Aturan keputusan", TX + 0.9, FY + 3.45, TW, 30);
  HL(s, "Kalau dampak gangguan (kekosongan stok) tidak signifikan, tidak perlu menyimpan stok banyak. Kalau dampaknya signifikan, misalnya lead time pemesanan panjang atau biaya kehilangan penjualan besar, stok cadangan harus dinaikkan untuk menekan risiko.", TX + 0.9, FY + 4.1, TW - 0.9, 0.95, { size: 10.5 });
  T(s, "Aturan ini yang dipakai untuk menilai apakah stok Amazon yang sangat besar itu pemborosan atau justru keputusan yang benar.", TX + 0.9, FY + 5.15, TW - 0.9, 0.5, { size: 10, italic: true });
  picRight(s, "sortation");
}

// ============================================================ 6. TRANSFORMASI (pola //01 //02 di atas gambar)
{
  const s = frame({ plain: true });
  picFull(s, "hero");
  H(s, "Transformasi model bisnis Amazon", FX + 0.5, FY + 0.35, 9, 30);
  numBlock(s, 1, "Rencana 1995: pengecer virtual", "Tanpa persediaan, tanpa gudang, tanpa overhead. Hanya komputer yang menerima pesanan buku dan meneruskan pemenuhannya ke pihak lain. Secara default rencana yang menarik: modal kecil, tidak ada risiko stok.", FX + 0.5, FY + 1.4, 6.6, { bodyH: 1.0 });
  numBlock(s, 2, "Kenyataan: jaringan gudang terbesar di dunia", "Buku hanya memberi satu kalimat: things clearly didn’t work out that way. Perangkat lunak pesanan Amazon begitu baik sehingga keahlian order taking, processing, dan billing dijual ke pihak lain.", FX + 0.5, FY + 3.85, 6.6, { bodyH: 1.0, titleSize: 15 });
  const stats = [["150+", "gudang di seluruh dunia"], ["200 juta", "item tersedia di situs"], ["200.000", "pieces per hari dari satu gudang"], ["< 3 menit", "tenaga kerja per pesanan"]];
  stats.forEach((st, i) => {
    const x = FX + 8.0, y = FY + 1.5 + i * 1.25;
    s.addText(st[0], { x, y, w: 4.0, h: 0.55, fontFace: HF, fontSize: 28, bold: true, color: PINK2, fill: { color: WHITE }, isTextBox: true, margin: [0.02, 0.1, 0.02, 0.1], valign: "middle" });
    HL(s, st[1], x, y + 0.55, 4.0, 0.32, { size: 10, fill: WHITE, color: GRAY });
  });
}

// ============================================================ 7. APAKAH RENCANA AWALNYA SALAH (pola ЦЕЛЬ / ЗАДАЧИ + gambar)
{
  const s = frame();
  H(s, "Apakah rencana awalnya salah?", TX, FY + 0.5, 8.0, 30);
  HL(s, "Bukan salah, tetapi asumsinya tidak bisa dipertahankan begitu value proposition ditetapkan.", TX, FY + 1.15, TW, 0.5, { size: 10.5 });
  arrow(s, TX + 0.2, FY + 1.8);
  H(s, "Tiga target Bezos", TX + 1.0, FY + 2.0, TW, 24);
  numList(s, ["Lowest price: harga terendah", "Fastest delivery: pengiriman tercepat", "Error-free: pemenuhan pesanan bebas kesalahan"], TX + 1.0, FY + 2.55, TW - 1.0, { rowH: 0.32, gap: 0.08 });
  T(s, "Kalimat kunci dari buku: exchanges and returns are very expensive. Kesalahan bukan sekadar masalah mutu, tetapi biaya.", TX, FY + 3.9, TW, 0.45, { size: 10, italic: true, color: BLACK });
  block(s, "Pemenuhan oleh pihak ketiga", "Kecepatan bergantung stok dan proses orang lain; kesalahan pihak lain menjadi biaya return Amazon tetapi tidak bisa dikendalikan; margin pihak ketiga masuk ke harga.", TX, FY + 4.45, TW, { size: 16, h: 0.55 });
  block(s, "Pemenuhan dikelola sendiri", "Stok diletakkan di gudang terdekat pelanggan; titik kontrol dirancang sendiri; biaya per pesanan ditekan lewat volume dan otomasi. Value proposition men-direct keputusan di belakangnya.", TX, FY + 5.4, TW, { size: 16, h: 0.6 });
  picRight(s, "packing", { w: 5.2 });
}

// ============================================================ 8. 4V (pola ОБЪЕКТ / ПРЕДМЕТ, empat blok)
{
  const s = frame();
  H(s, "Karakter operasi Amazon dengan 4V", TX, FY + 0.5, 8.0, 30);
  block(s, "Volume: sangat tinggi", "200.000 pieces per hari per gudang, lebih dari 150 gudang. Economies of scale: otomasi dan standardisasi menjadi ekonomis.", TX, FY + 1.2, TW, { size: 16, h: 0.5 });
  block(s, "Variety: sangat tinggi", "200 juta item; 70% pesanan berisi lebih dari satu produk. Kesalahan pengambilan mudah terjadi; akurasi catatan per item menjadi persoalan utama.", TX, FY + 2.15, TW, { size: 16, h: 0.5 });
  block(s, "Variation: tinggi", "Ritel daring dengan musim puncak; gudang dirancang untuk kapasitas harian maksimum. Perlu stok pengaman dan kapasitas yang bisa menyerap lonjakan.", TX, FY + 3.1, TW, { size: 16, h: 0.5 });
  block(s, "Visibility: rendah", "Pelanggan hanya melihat hasil: harga, waktu tiba, ketepatan isi paket. Proses gudang bebas dirancang untuk efisiensi.", TX, FY + 4.05, TW, { size: 16, h: 0.5 });
  HL(s, "Secara natural volume tinggi berpasangan dengan variety rendah. Amazon punya keduanya tinggi, dan tetap efisien karena pengambilan dilakukan massal dalam batch, lalu disusun per pesanan di ujung proses.", TX, FY + 5.05, TW, 0.8, { size: 10.5 });
  picRight(s, "delivery", { h: 5.9 });
}

// ============================================================ 9-10. DELAPAN LANGKAH (pola //01 di atas gambar)
const STEPS = [
  ["Pesanan masuk, komputer di Seattle mengambil alih", "Komputer menugaskan pesanan (buku, permainan, kamera digital) ke salah satu pusat distribusi besar di AS. Ini jawaban atas where; syaratnya catatan stok tiap DC benar saat itu juga."],
  ["Flow meister di DC menerima pesanan", "Ia menentukan pekerja mana pergi ke mana. Pesanan diubah menjadi penugasan picking; masih ada manusia sebagai pengatur beban kerja."],
  ["Picking", "Sistem Amazon menggandakan kecepatan picking operator manual dan menurunkan tingkat kesalahan mendekati nol. Mekanismenya robot Kiva."],
  ["Barang masuk crate di ban berjalan", "Crate kuning berisi pesanan banyak pelanggan; conveyor lebih dari 10 mil, 2,9 kaki/detik; bar code dipindai 15 kali oleh mesin dan pekerja. Batch picking dan verifikasi berulang."],
  ["Ketiga barang bertemu di chute, lalu masuk kotak", "Bar code dicocokkan dengan nomor pesanan; chute selebar 3 kaki (ribuan); kotak diberi bar code baru. Picking diurutkan untuk mengurangi perjalanan operator."],
  ["Pembungkusan kado manual", "Dilakukan tim pembungkus terlatih dengan standar 30 paket per jam. Sengaja tidak diotomasi: variasi tinggi, volume kecil; dikelola dengan standard time."],
  ["Kotak dikemas, dilakban, ditimbang, dilabeli", "Gudang tipikal mengirim sampai 200.000 pieces per hari; sekitar 60% lewat USPS, sisanya UPS. Penimbangan adalah verifikasi akhir isi paket."],
  ["Pesanan tiba di pelanggan", "Dalam 1 atau 2 hari. Inilah ukuran yang dilihat pelanggan: speed dan dependability."],
];
function stepsSlide(from, img, title) {
  const s = frame({ plain: true });
  picFull(s, img);
  H(s, title, FX + 0.5, FY + 0.35, 11, 30);
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    numBlock(s, from + i + 1, STEPS[from + i][0], STEPS[from + i][1], FX + 0.5 + col * 6.1, FY + 1.45 + row * 2.6, 5.85, { titleSize: 14, bodyH: 1.15, bodySize: 9.5 });
  }
}
stepsSlide(0, "totes", "Proses pemenuhan pesanan: langkah 1 sampai 4");
stepsSlide(4, "sortation", "Proses pemenuhan pesanan: langkah 5 sampai 8");

// ============================================================ 11. DUA ANGKA
{
  const s = frame();
  H(s, "Dua angka yang berbeda", TX, FY + 0.5, 8.0, 30);
  T(s, "Menerima, memproses, menempatkan stok, lalu mengambil dan mengemas satu pesanan secara akurat memerlukan investasi tenaga kerja kurang dari 3 menit; 70% pesanan adalah pesanan multiproduk; buku menyebutnya world-class performance.", TX, FY + 1.15, TW, 0.85, { size: 10 });
  H(s, "< 3 menit", TX, FY + 2.2, 2.7, 34, { color: PINK2 });
  HL(s, "Ukuran input (biaya)", TX, FY + 2.9, 2.6, 0.3, { size: 10 });
  T(s, "Jam kerja yang dipakai per pesanan, hasil dari efisiensi proses di dalam gudang.", TX, FY + 3.28, 2.6, 0.7, { size: 10 });
  H(s, "1–2 hari", TX + 3.0, FY + 2.2, 2.7, 34, { color: PINK2 });
  HL(s, "Ukuran output (speed)", TX + 3.0, FY + 2.9, 2.6, 0.3, { size: 10 });
  T(s, "Yang dirasakan pelanggan, hasil dari posisi stok yang dekat pelanggan, bukan dari proses gudang saja.", TX + 3.0, FY + 3.28, 2.6, 0.7, { size: 10 });
  HL(s, "Dua angka ini jangan dicampur saat presentasi. Amazon unggul di keduanya, tetapi mekanismenya berbeda. Angka 70% pesanan multiproduk menunjukkan kecepatan itu dicapai pada pesanan yang komposisinya berbeda-beda.", TX, FY + 4.3, TW, 0.8, { size: 10.5 });
  picRight(s, "packing", { w: 5.3 });
}

// ============================================================ 12. ROBOT KIVA (pola ЗАДАЧИ + gambar)
{
  const s = frame();
  H(s, "Mekanisme robot Kiva", TX, FY + 0.5, 8.0, 30);
  T(s, "Langkah picking hanya menyebut hasilnya. Mekanismenya dijelaskan pada bab tata letak, dan dari sinilah angka kecepatan dan akurasi itu berasal.", TX, FY + 1.15, TW, 0.5, { size: 10 });
  numList(s, [
    "10.000+ robot Kiva membawa rak berisi stok ke pekerja: barangnya yang bergerak, bukan orangnya",
    "20 mil jalan kaki per hari per pekerja dihemat di gudang Tracy, California (1,2 juta kaki persegi)",
    "Standar pick and scan naik dari 100 menjadi 300 item per jam per pekerja",
    "20–40% biaya per pesanan dipangkas dari US$3,50–3,75; setara US$400–900 juta per tahun",
  ], TX, FY + 1.85, TW, { rowH: 0.5, gap: 0.12 });
  HL(s, "Dari sisi persediaan, robot mengubah dua hal: lokasi fisik stok tidak lagi harus tetap (slotting diatur perangkat lunak), dan setiap pengambilan langsung dipindai sehingga catatan stok diperbarui bersamaan dengan pengambilan fisik.", TX, FY + 4.5, TW, 0.8, { size: 10.5 });
  picRight(s, "robots", { w: 5.6 });
}

// ============================================================ 13. PRODUKTIVITAS YANG ADIL
{
  const s = frame();
  H(s, "Produktivitas yang adil", TX, FY + 0.5, 8.0, 30);
  T(s, "Angka 100 menjadi 300 item per jam mudah dibaca sebagai kenaikan produktivitas 200%. Itu single-factor productivity, hanya menghitung tenaga kerja. Ukurannya not fair, karena kenaikan itu dicapai dengan menambah resource lain (robot) yang biayanya tidak ikut dihitung.", TX, FY + 1.15, TW, 0.85, { size: 10 });
  block(s, "Single-factor: +200%", "Labor productivity naik dari 100 menjadi 300 item per jam per pekerja. Benar, tetapi belum memperhitungkan investasi robot.", TX, FY + 2.2, TW, { size: 16, h: 0.5 });
  block(s, "Multi-factor: biaya per pesanan turun 20–40%", "Dari US$3,50–3,75 per pesanan, sudah termasuk biaya robot. Penghematan bersih sekitar US$0,70–1,50 per pesanan: jauh di bawah 200%, tetapi tetap positif.", TX, FY + 3.15, TW, { size: 16, h: 0.55 });
  block(s, "Dampak tahunan: US$400–900 juta", "Angka kecil per pesanan menjadi besar karena volume.", TX, FY + 4.15, TW, { size: 16, h: 0.35 });
  HL(s, "Yang dipresentasikan sebaiknya angka biaya per pesanan, bukan angka 200%. Semua resource diuangkan lalu dijumlahkan.", TX, FY + 5.0, TW, 0.6, { size: 10.5 });
  picRight(s, "scanner", { h: 5.6 });
}

// ============================================================ 14. STOK BESAR, TIDAK EFISIEN?
{
  const s = frame();
  H(s, "Stok besar, tidak efisien?", TX, FY + 0.5, 8.0, 30);
  T(s, "Buku merumuskan tujuan inventory management sebagai keseimbangan antara investasi persediaan dan layanan pelanggan; persediaan bisa mencapai 50% dari total modal. Amazon jelas di sisi investasi besar: jutaan item di lebih dari 150 gudang.", TX, FY + 1.15, TW, 0.85, { size: 10 });
  HL(s, "Jawabannya harus dikembalikan ke objective.", TX, FY + 2.1, TW, 0.36, { size: 10.5 });
  T(s, "Amazon tidak meminimalkan stok. Amazon meminimalkan total biaya pada tingkat layanan yang sudah dijanjikan (tercepat, bebas kesalahan). Pada tingkat itu, kekosongan stok berarti penjualan hilang dan janji fastest delivery rusak: dampaknya signifikan, sehingga stok besar konsisten dengan tujuannya, bukan pemborosan.\n\nYang diminimalkan Amazon adalah dua komponen lain: tenaga kerja per pesanan (kurang dari 3 menit) dan kesalahan (mendekati nol).", TX, FY + 2.6, TW, 2.2, { size: 10 });
  HL(s, "Bukan stok sedikit, tetapi stok besar yang dikelola presisi.", TX, FY + 4.95, TW, 0.36, { size: 10.5 });
  picRight(s, "shelves");
}

// ============================================================ 15. LIMA TUJUAN KINERJA
{
  const s = frame();
  H(s, "Lima tujuan kinerja operasi", TX, FY + 0.5, 8.0, 30);
  const rows = [
    ["Speed", "Tiba 1–2 hari; tenaga kerja kurang dari 3 menit per pesanan. Alokasi ke DC yang punya stok, conveyor konstan, picking diurutkan, robot membawa rak."],
    ["Quality: bebas kesalahan", "Kesalahan picking mendekati nol; bar code dipindai 15 kali; penimbangan sebelum keluar."],
    ["Dependability", "Janji 1–2 hari terpenuhi; tidak perlu kontak lanjutan. As promised, bukan sekadar cepat."],
    ["Flexibility", "70% pesanan multiproduk dari 200 juta item dilayani satu sistem: batch picking, lalu konsolidasi per pesanan di chute."],
    ["Cost", "Harga terendah; 60% kiriman lewat USPS; biaya sort-pick-pack turun 20–40%. Volume menyerap biaya tetap otomasi."],
  ];
  rows.forEach((r, i) => block(s, r[0], r[1], TX, FY + 1.2 + i * 0.95, TW, { size: 15, h: 0.5, bodySize: 9.5 }));
  HL(s, "Kelima tujuan dipenuhi oleh satu sistem yang sama: stok yang akurat lokasinya, proses yang pendek, dan kontrol berlapis.", TX, FY + 6.0, TW, 0.5, { size: 10.5 });
  picRight(s, "dock", { w: 5.4 });
}

// ============================================================ 16. TIGA TRADE-OFF (pola ЗАДАЧИ + gambar)
{
  const s = frame();
  H(s, "Tiga trade-off utama", TX, FY + 0.5, 8.0, 30);
  const tos = [
    ["Holding cost vs service level", "Carrying cost sekitar 26% dari nilai persediaan per tahun, dan biaya kebijakan naik eksponensial ketika service level dinaikkan. Aturan: bandingkan biaya simpan tambahan dengan biaya kekosongan; untuk ritel daring biaya kekosongan tinggi, sehingga pilihan Amazon konsisten."],
    ["Otomasi vs kesalahan dan tenaga kerja", "Pemindaian 15 kali, penimbangan, dan robot adalah biaya tetap; kesalahan menimbulkan biaya return dan hilangnya kepercayaan. Aturan: otomasi layak kalau penghematan per pesanan dikali jumlah pesanan per tahun lebih besar dari biaya tahunan otomasi. Penentunya volume."],
    ["Kecepatan kirim vs biaya kirim", "Kirim lebih cepat biasanya lebih mahal. Amazon mengirim 60% pesanan lewat USPS, moda yang murah. Aturan: kecepatan dibangun dari dalam (stok dekat pelanggan, proses gudang pendek), sehingga moda kirim murah tetap bisa dipakai."],
  ];
  tos.forEach((t, i) => {
    const y = FY + 1.2 + i * 1.7;
    s.addText((i + 1) + ".", { x: TX, y, w: 0.35, h: 0.34, fontFace: HF, fontSize: 13, bold: true, color: BLACK, isTextBox: true, margin: 0, valign: "middle" });
    HL(s, t[0], TX + 0.38, y, TW - 0.38, 0.34, { size: 10.5 });
    T(s, t[1], TX + 0.38, y + 0.42, TW - 0.38, 1.2, { size: 9.5 });
  });
  picRight(s, "giftwrap", { h: 5.0 });
}

// ============================================================ 17. VERIFIKASI TRADE-OFF
{
  const s = frame();
  H(s, "Verifikasi trade-off", TX, FY + 0.5, 8.0, 30);
  T(s, "Sebelum menyimpulkan ada trade-off, periksa dulu apakah dua tujuan itu benar bertentangan atau justru complementary. Kalau searah, tidak perlu ditimbang; kerjakan saja.", TX, FY + 1.15, TW, 0.55, { size: 10 });
  numList(s, [
    "Akurasi vs biaya: searah. Setiap kesalahan yang dicegah menghilangkan biaya return.",
    "Kecepatan proses internal vs biaya: searah. Kurang dari 3 menit per pesanan menekan biaya sekaligus mempercepat.",
    "Ketersediaan stok vs holding cost: trade-off nyata. Amazon memilih sadar di sisi service level tinggi.",
    "Kecepatan kirim vs biaya kirim: trade-off nyata yang dihindari, kecepatan dipindahkan ke posisi stok dan proses gudang.",
  ], TX, FY + 1.85, TW, { rowH: 0.46, gap: 0.1, size: 9.5 });
  arrow(s, TX + 0.1, FY + 4.15);
  H(s, "Efficient frontier", TX + 0.9, FY + 4.35, TW, 24);
  T(s, "Pengecer virtual (1995): modal paling rendah, tetapi tidak memenuhi constraint bebas kesalahan dan tercepat.\nGudang sendiri, manual: didominasi alternatif otomasi pada volume Amazon; dicoret.\nGudang sendiri, terotomasi: berada di frontier; dipilih sesuai value proposition. Pada volume kecil, biaya tetap robot tidak terserap dan alternatif manual kembali ke frontier.", TX + 0.9, FY + 4.9, TW - 0.9, 1.5, { size: 9.5 });
  picRight(s, "dock", { w: 5.4 });
}

// ============================================================ 18. KAITAN TEORI (pola ЗАДАЧИ)
{
  const s = frame();
  H(s, "Kaitan dengan teori persediaan", TX, FY + 0.5, 8.0, 30);
  T(s, "Konsep Bab 12 yang terlihat bekerja di Amazon. Tanda dalam kurung menyatakan apakah kaitan itu disebut buku secara eksplisit atau merupakan inferensi.", TX, FY + 1.15, TW, 0.5, { size: 10 });
  numList(s, [
    "Fungsi persediaan: pilihan barang untuk permintaan yang diantisipasi; jutaan item di 150+ gudang (eksplisit)",
    "Record accuracy: sistem perpetual dengan bar code; dipindai 15 kali, alokasi mengandalkan catatan per DC (eksplisit)",
    "Cycle counting: tidak disebut; verifikasi berkala tetap diperlukan untuk kesalahan fisik (asumsi)",
    "ABC analysis: same-day facility menyimpan 100.000 item terlaris per wilayah (sumber lain, 2023)",
    "Kontrol persediaan ritel: barang masuk dan keluar dengan bar code; penimbangan sebelum keluar (eksplisit)",
    "Independent demand, ROP dengan safety stock: service level tinggi menuntut stok besar (inferensi)",
    "Penempatan di gudang: picking diurutkan untuk mengurangi perjalanan; slotting diatur perangkat lunak (eksplisit)",
  ], TX, FY + 1.8, TW, { rowH: 0.42, gap: 0.08, size: 9 });
  HL(s, "Urutannya: akurasi dulu, model kemudian.", TX, FY + 5.4, TW, 0.36, { size: 10.5 });
  picRight(s, "scanner", { h: 5.6 });
}

// ============================================================ 19. PERKEMBANGAN TERBARU
{
  const s = frame();
  H(s, "Perkembangan terbaru", TX, FY + 0.5, 8.0, 30);
  T(s, "Buku menggambarkan kondisi sekitar 2017. Sumber berikut dari blog resmi para penulis buku, sehingga sejalan dengan rujukan kelas.", TX, FY + 1.15, TW, 0.5, { size: 10 });
  block(s, "2023: regionalisasi jaringan", "Jaringan AS dibagi 8 wilayah dengan stok lengkap per wilayah; lebih dari 76% permintaan dipenuhi dari dalam wilayahnya. Same-day facility menyimpan 100.000 item terlaris per wilayah, dipilih dengan machine learning. Rata-rata picking sampai paket di dock keluar: 11 menit.", TX, FY + 1.8, TW, { size: 18, h: 1.0 });
  HL(s, "Keputusan where kini per wilayah; pemilihan 100.000 item terlaris adalah Pareto/ABC pada penempatan stok.", TX, FY + 3.3, TW, 0.5, { size: 10 });
  block(s, "2025: skala robot", "Lebih dari satu juta robot beroperasi; sekitar 75% pengiriman global melibatkan bantuan robot. Paket terkirim per karyawan per tahun naik dari 175 menjadi 3.870 dalam satu dekade.", TX, FY + 4.0, TW, { size: 18, h: 0.8 });
  HL(s, "Angka per karyawan adalah ukuran single-factor; jangan dibaca sebagai efisiensi total.", TX, FY + 5.3, TW, 0.36, { size: 10 });
  picRight(s, "robots", { w: 5.6 });
}

// ============================================================ 20. LESSON LEARNED (pola //01 di atas gambar)
{
  const s = frame({ plain: true });
  picFull(s, "dock");
  H(s, "Lesson learned: apa yang bisa dan tidak bisa ditiru", FX + 0.5, FY + 0.35, 11.5, 30);
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
    numBlock(s, i + 1, l[0], l[1], FX + 0.5 + col * 6.1, FY + 1.4 + row * 1.75, 5.85, { titleSize: 13, bodyH: 0.5, bodySize: 9.5, numSize: 38 });
  });
}

pres.writeFile({ fileName: OUT }).then(() => console.log("ditulis:", OUT, "| slide:", slideNo));
