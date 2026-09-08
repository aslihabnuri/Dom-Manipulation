// Deck PPTX: Studi Kasus 4 - Inventory Management di Amazon
// Bahasa visual mengikuti referensi: kartu putih dengan garis peta samar, judul Bebas Neue hitam,
// teks isi abu-abu, kalimat kunci di strip merah muda, objek cut-out hitam-putih dengan bayangan
// siluet merah muda yang berdiri di tepi kartu, dan slide "//01" di atas kolase sobek.
// Skala tipe: judul 38 / subjudul 24 / isi 12 / keterangan 10. Kolom teks menyesuaikan lebar gambar.
// Jalankan:  IMG=/path/ke/img node build_deck.js
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const { execFileSync } = require("child_process");
const crypto = require("crypto");

const IMG = process.env.IMG || path.join(__dirname, "img");
const CUT = path.join(IMG, "cut");
const OUT = path.join(__dirname, "Presentasi_Studi_Kasus_4_Amazon_Kelompok_4.pptx");
const AR = JSON.parse(fs.readFileSync(path.join(CUT, "ar.json"), "utf8"));
const TXT = path.join(IMG, "txt"); fs.mkdirSync(TXT, { recursive: true });
const RENDER = path.join(__dirname, "tools", "render_text.py");

const BLACK = "1A1A1A", PINK = "E8A0A8", MAGENTA = "C4185C", GRAY = "5F5F5F", WHITE = "FFFFFF";
const BF = "Calibri";
const SW = 13.333, SH = 7.5;
const FX = 0.45, FY = 0.45, FW = SW - 0.9, FH = SH - 0.9;   // kartu
const TX = FX + 0.6;                                          // tepi kiri kolom teks
const TOP = FY + 0.5, BOTTOM = FY + FH - 0.45;                // batas vertikal isi
// skala tipe
const TITLE = 38, SUB = 24, BODY = 12, CAP = 10.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Kelompok 4";
pres.title = "Inventory Management sebagai Keunggulan Kompetitif Amazon";

let slideNo = 0;
const shadow = () => ({ type: "outer", blur: 12, offset: 4, angle: 60, color: "000000", opacity: 0.14 });

// ---------- teks judul sebagai gambar (Bebas Neue) ----------
function label(s, text, x, y, pt, opts = {}) {
  const color = opts.color || BLACK, maxW = opts.maxW || 6.0;
  const key = crypto.createHash("md5").update([text, pt, color, maxW].join("|")).digest("hex").slice(0, 12);
  const file = path.join(TXT, key + ".png");
  let dims;
  if (fs.existsSync(file + ".txt")) dims = fs.readFileSync(file + ".txt", "utf8");
  else { dims = execFileSync("python3", [RENDER, file, String(pt), color, String(maxW), text]).toString().trim(); fs.writeFileSync(file + ".txt", dims); }
  const [w, h] = dims.split(" ").map(Number);
  s.addImage({ path: file, x: opts.align === "right" ? x - w : x, y, w, h });
  return { w, h };
}
function frame(opts = {}) {
  const s = pres.addSlide();
  slideNo += 1;
  s.background = { color: WHITE };
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: FX, y: FY, w: FW, h: FH, fill: { color: WHITE }, line: { color: "EBEBEB", width: 0.5 }, rectRadius: 0.2, shadow: shadow() });
  if (!opts.plain) s.addImage({ path: path.join(CUT, "map.jpg"), x: FX + 0.05, y: FY + 0.05, w: FW - 0.1, h: FH - 0.1, transparency: opts.mapT ?? 70 });
  s.addText(String(slideNo), { x: SW - 0.9, y: SH - 0.38, w: 0.45, h: 0.25, fontFace: BF, fontSize: 8, color: "B0B0B0", align: "right", isTextBox: true, margin: 0 });
  return s;
}
// cut-out berdiri di tepi bawah kartu, rata kanan; mengembalikan tepi kirinya agar kolom teks bisa menyesuaikan
function cut(s, name, opts = {}) {
  let h = opts.h || 5.9, w = h * AR[name];
  const maxW = opts.maxW || 6.6;
  if (w > maxW) { w = maxW; h = w / AR[name]; }
  const x = opts.x ?? (FX + FW - w - (opts.inset ?? 0.12)), y = opts.y ?? (FY + FH - h + 0.02);
  s.addImage({ path: path.join(CUT, name + ".png"), x, y, w, h });
  return { x, y, w, h, textW: Math.min(6.6, Math.max(4.8, x - TX - 0.35)) };
}
function bg(s, name) {
  s.addImage({ path: path.join(CUT, name + ".jpg"), x: FX + 0.06, y: FY + 0.06, w: FW - 0.12, h: FH - 0.12, sizing: { type: "cover", w: FW - 0.12, h: FH - 0.12 } });
}
function T(s, text, x, y, w, h, opts = {}) {
  s.addText(text, { x, y, w, h, fontFace: BF, fontSize: opts.size || BODY, color: opts.color || GRAY, isTextBox: true, margin: 0, valign: "top", align: "left", italic: !!opts.italic, bold: !!opts.bold, lineSpacingMultiple: 1.1 });
}
function HL(s, text, x, y, w, h, opts = {}) {
  s.addText(text, { x, y, w, h, fontFace: BF, fontSize: opts.size || BODY, color: opts.color || BLACK, fill: { color: opts.fill || PINK }, isTextBox: true, margin: [0.03, 0.1, 0.03, 0.1], valign: "middle", align: "left", lineSpacingMultiple: 1.08, bold: !!opts.bold });
}
// subjudul Bebas + isi
function block(s, title, body, x, y, w, opts = {}) {
  const t = label(s, title, x, y, opts.pt || SUB, { maxW: w });
  const bh = opts.h || 0.5;
  T(s, body, x, y + t.h + 0.08, w, bh, { size: opts.size || BODY });
  return y + t.h + 0.08 + bh;
}
// daftar bernomor "1 2 3" dengan strip merah muda
function numList(s, items, x, y, w, opts = {}) {
  const rowH = opts.rowH || 0.44, gap = opts.gap || 0.14;
  items.forEach((it, i) => {
    const yy = y + i * (rowH + gap);
    s.addText(String(i + 1), { x, y: yy, w: 0.35, h: rowH, fontFace: BF, fontSize: 13, color: GRAY, isTextBox: true, margin: 0, valign: "middle" });
    HL(s, it, x + 0.35, yy, w - 0.35, rowH, { size: opts.size || BODY });
  });
  return y + items.length * (rowH + gap) - gap;
}
function doodle(s, x, y, size = 1.0) { s.addImage({ path: path.join(CUT, "arrow.png"), x, y, w: size, h: size * AR.arrow_inv }); }

// ============================================================ 1. SAMPUL
{
  const s = frame({ mapT: 60 });
  // pita identitas di dasar kartu: kolase "berdiri" di atasnya, judul bebas di kanan atas
  const ribbonH = 0.5, ribbonY = FY + FH - ribbonH - 0.08;
  cut(s, "skyline", { h: 3.85, maxW: 12, x: FX + (FW - 3.85 * AR.skyline) / 2, y: ribbonY - 3.85 + 0.02 });
  s.addShape(pres.shapes.RECTANGLE, { x: FX + 0.08, y: ribbonY, w: FW - 0.16, h: ribbonH, fill: { color: WHITE }, line: { color: WHITE, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x: FX + 0.08, y: ribbonY, w: 1.6, h: ribbonH, fill: { color: PINK }, line: { color: PINK, width: 0 } });
  s.addText("KELOMPOK 4", { x: FX + 0.08, y: ribbonY, w: 1.6, h: ribbonH, fontFace: BF, fontSize: 12, bold: true, color: BLACK, align: "center", valign: "middle", isTextBox: true, margin: 0 });
  s.addText("Bagaskoro  ·  25/574280/PEK/31778          Aulia Sisca Rahmadiyanti  ·  25/574305/PEK/31789          Fitra Aidila  ·  25/574309/PEK/31791",
    { x: FX + 1.95, y: ribbonY, w: FW - 2.2, h: ribbonH, fontFace: BF, fontSize: 11, color: GRAY, valign: "middle", isTextBox: true, margin: 0 });
  // judul sebagai pita headline selebar kartu: dua baris, mengunci bidang atas
  label(s, "INVENTORY MANAGEMENT SEBAGAI\nKEUNGGULAN KOMPETITIF AMAZON", FX + 0.55, FY + 0.35, 66, { maxW: 11.6 });
}

// ============================================================ 2. TUJUAN & ALUR
{
  const s = frame();
  s.addImage({ path: path.join(CUT, "map_dense.png"), x: 7.4, y: FY + 0.06, w: FX + FW - 7.4 - 0.06, h: FH - 0.12 });
  label(s, "TUJUAN", TX, TOP, TITLE);
  HL(s, "Membaca kasus Amazon dari strategi ke bawah: mengapa persediaan dipegang sendiri, bagaimana satu pesanan dipenuhi, dan trade-off apa yang diambil.", TX, TOP + 0.8, 6.3, 0.62);
  doodle(s, TX, TOP + 1.65, 1.1);
  label(s, "ALUR PEMBAHASAN", TX + 1.35, TOP + 1.95, TITLE);
  numList(s, [
    "Kerangka berpikir: strategi dulu, baru keputusan teknis",
    "Kisah sukses: dari pengecer virtual ke pengelola persediaan",
    "Proses pemenuhan pesanan: delapan langkah dan kuantifikasinya",
    "Analisis trade-off: mana trade-off nyata, mana yang searah",
    "Kaitan dengan teori persediaan",
    "Perkembangan terbaru: 2023 dan 2025",
    "Lesson learned: apa yang bisa dan tidak bisa ditiru",
  ], TX + 1.35, TOP + 2.8, 5.6, { rowH: 0.36, gap: 0.1, size: 11.5 });
}

// ============================================================ 3. KERANGKA BERPIKIR
{
  const s = frame();
  const im = cut(s, "rack", { h: 5.9 }); const W = im.textW;
  label(s, "KERANGKA BERPIKIR", TX, TOP, TITLE);
  T(s, "Tentukan dulu apa yang mau dicapai (strategi dan value proposition), baru turunkan ke keputusan teknis. Persediaan adalah keputusan OM ke-8 dengan dua pertanyaan dasar, ditambah satu pertanyaan khusus Amazon.", TX, TOP + 0.85, W, 1.0);
  let y = TOP + 2.05;
  y = block(s, "HOW MUCH", "Berapa banyak persediaan setiap item yang harus dimiliki?", TX, y, W, { h: 0.35 }) + 0.2;
  y = block(s, "WHEN", "Kapan harus memesan kembali?", TX, y, W, { h: 0.35 }) + 0.2;
  y = block(s, "WHERE", "Item mana disimpan di gudang mana; stok Amazon tersebar di lebih dari 150 gudang.", TX, y, W, { h: 0.55 }) + 0.15;
  HL(s, "Where yang membuat Amazon berbeda: stok harus berada dekat pelanggan sebelum pesanan datang.", TX, y, W, 0.6);
  s.addNotes("Inventory management termasuk daily decision, satu kelompok dengan MRP, sequencing, dan scheduling. Arahnya ditentukan strategi operasi yang dipilih lebih dulu.");
}

// ============================================================ 4. STRUKTUR KEPUTUSAN
{
  const s = frame();
  const im = cut(s, "boxes", { h: 5.9 }); const W = im.textW;
  label(s, "STRUKTUR KEPUTUSAN", TX, TOP, TITLE);
  T(s, "Kalau kita modelkan, persoalan persediaan selalu punya struktur yang sama: tujuan, variabel yang bisa diatur, dan batasan.", TX, TOP + 0.85, W, 0.6);
  let y = TOP + 1.6;
  y = block(s, "OBJECTIVE", "Meminimalkan total biaya persediaan: biaya simpan, biaya pesan, biaya kekurangan. Amazon menambah biaya kesalahan pemenuhan (returns).", TX, y, W, { h: 0.6 }) + 0.18;
  y = block(s, "DECISION VARIABLES", "Jumlah pesan, titik pesan ulang, stok pengaman. Amazon menambah alokasi: item apa di gudang mana.", TX, y, W, { h: 0.6 }) + 0.18;
  y = block(s, "CONSTRAINTS", "Service level yang dijanjikan, kapasitas gudang, lead time. Bagi Amazon: harga terendah, kirim tercepat, bebas kesalahan.", TX, y, W, { h: 0.6 }) + 0.12;
  HL(s, "Service level adalah constraint, bukan objective: perusahaan meminimalkan biaya pada tingkat layanan yang sudah dijanjikan.", TX, y, W, 0.6);
}

// ============================================================ 5. DILEMA + ATURAN
{
  const s = frame();
  const im = cut(s, "conveyor", { h: 3.8, maxW: 6.4 }); const W = 6.2;
  label(s, "DILEMA PERSEDIAAN", TX, TOP, TITLE);
  let y = TOP + 0.9;
  y = block(s, "STOK TERLALU BANYAK", "Biaya simpan dan penanganan naik; modal tertahan; risiko barang usang.", TX, y, W, { pt: 22, h: 0.4 }) + 0.18;
  y = block(s, "STOK TERLALU SEDIKIT", "Stock out; produksi berhenti; pada ritel daring pelanggan berpindah ke penjual lain dalam hitungan detik.", TX, y, W, { pt: 22, h: 0.6 }) + 0.15;
  doodle(s, TX, y, 1.0);
  label(s, "ATURAN KEPUTUSAN", TX + 1.2, y + 0.3, TITLE);
  HL(s, "Kalau dampak kekosongan stok tidak signifikan, tidak perlu stok banyak. Kalau signifikan (lead time panjang, biaya kehilangan penjualan besar), stok cadangan dinaikkan.", TX + 1.2, y + 1.05, 5.0, 0.95);
  s.addNotes("Aturan ini dipakai untuk menilai apakah stok Amazon yang sangat besar itu pemborosan atau justru keputusan yang benar.");
}

// ============================================================ 6. TRANSFORMASI (//01 //02)
{
  const s = frame({ plain: true });
  bg(s, "bg_hero");
  label(s, "TRANSFORMASI MODEL BISNIS AMAZON", FX + 0.6, FY + 0.4, 34, { maxW: 9 });
  label(s, "//01", FX + 0.6, FY + 1.25, 58, { color: MAGENTA });
  HL(s, "RENCANA 1995: PENGECER VIRTUAL", FX + 1.25, FY + 2.1, 5.4, 0.46, { size: 16, bold: true });
  HL(s, "Tanpa persediaan, tanpa gudang, tanpa overhead: komputer menerima pesanan buku dan meneruskan pemenuhannya ke pihak lain.", FX + 1.25, FY + 2.64, 5.4, 0.62, { fill: WHITE, color: GRAY, size: 11 });
  label(s, "//02", FX + 6.2, FY + 3.55, 58, { color: MAGENTA });
  HL(s, "KENYATAAN: JARINGAN GUDANG TERBESAR DI DUNIA", FX + 6.85, FY + 4.4, 5.3, 0.46, { size: 16, bold: true });
  HL(s, "Things clearly didn’t work out that way: 150+ gudang, 200 juta item di situs, 200.000 pieces per hari dari satu gudang, tenaga kerja kurang dari 3 menit per pesanan.", FX + 6.85, FY + 4.94, 5.3, 0.8, { fill: WHITE, color: GRAY, size: 11 });
}

// ============================================================ 7. APAKAH RENCANA AWALNYA SALAH
{
  const s = frame();
  const im = cut(s, "van", { h: 3.1, maxW: 6.2 }); const W = 6.0;
  label(s, "APAKAH RENCANA AWALNYA SALAH?", TX, TOP, TITLE, { maxW: 8 });
  HL(s, "Bukan salah, tetapi asumsinya tidak bisa dipertahankan begitu value proposition ditetapkan.", TX, TOP + 0.85, W, 0.5);
  doodle(s, TX, TOP + 1.5, 1.0);
  label(s, "TIGA TARGET BEZOS", TX + 1.2, TOP + 1.8, 32);
  numList(s, ["Lowest price: harga terendah", "Fastest delivery: pengiriman tercepat", "Error-free: pemenuhan pesanan bebas kesalahan"], TX + 1.2, TOP + 2.5, 5.0, { rowH: 0.36, gap: 0.1 });
  let y = TOP + 4.05;
  y = block(s, "DIKELOLA SENDIRI", "Stok di gudang terdekat pelanggan, titik kontrol dirancang sendiri, biaya per pesanan ditekan lewat volume dan otomasi.", TX, y, 5.3, { pt: 22, h: 0.55 }) + 0.12;
  HL(s, "Menyimpan persediaan sendiri bukan penyimpangan dari strategi, melainkan konsekuensinya.", TX, y, 5.3, 0.5);
  s.addNotes("Kalau pemenuhan dititipkan ke pihak ketiga: kecepatan bergantung stok dan proses orang lain; kesalahan pihak lain menjadi biaya return Amazon tetapi tidak bisa dikendalikan; margin pihak ketiga masuk ke harga. Exchanges and returns are very expensive.");
}

// ============================================================ 8. 4V
{
  const s = frame();
  const im = cut(s, "worker", { h: 5.9 }); const W = im.textW;
  label(s, "KARAKTER OPERASI: 4V", TX, TOP, TITLE);
  let y = TOP + 0.95;
  y = block(s, "VOLUME · SANGAT TINGGI", "200.000 pieces per hari per gudang. Otomasi dan standardisasi menjadi ekonomis.", TX, y, W, { pt: 22, h: 0.4 }) + 0.15;
  y = block(s, "VARIETY · SANGAT TINGGI", "200 juta item; 70% pesanan multiproduk. Akurasi catatan per item menjadi persoalan utama.", TX, y, W, { pt: 22, h: 0.4 }) + 0.15;
  y = block(s, "VARIATION · TINGGI", "Musim puncak; gudang dirancang untuk kapasitas harian maksimum; perlu stok pengaman.", TX, y, W, { pt: 22, h: 0.4 }) + 0.15;
  y = block(s, "VISIBILITY · RENDAH", "Pelanggan hanya melihat harga, waktu tiba, dan ketepatan isi paket.", TX, y, W, { pt: 22, h: 0.4 }) + 0.1;
  HL(s, "Volume dan variety sama-sama tinggi, tetap efisien: pengambilan massal dalam batch, penyusunan per pesanan di ujung proses.", TX, y, W, 0.6);
}

// ============================================================ 9-10. DELAPAN LANGKAH (//01 ... //08)
const STEPS = [
  ["PESANAN MASUK, KOMPUTER SEATTLE MENGAMBIL ALIH", "Pesanan dialokasikan ke DC yang punya stok: jawaban atas where; catatan stok tiap DC harus benar saat itu juga."],
  ["FLOW MEISTER MENERIMA PESANAN", "Menentukan pekerja mana pergi ke mana; pesanan diubah menjadi penugasan picking."],
  ["PICKING", "Kecepatan dua kali operator manual, kesalahan mendekati nol. Mekanismenya robot Kiva."],
  ["CRATE DI BAN BERJALAN", "Conveyor lebih dari 10 mil, 2,9 kaki/detik; bar code dipindai 15 kali; batch picking dan verifikasi berulang."],
  ["BERTEMU DI CHUTE, MASUK KOTAK", "Bar code dicocokkan dengan nomor pesanan; ribuan chute; picking diurutkan untuk mengurangi perjalanan."],
  ["PEMBUNGKUSAN KADO MANUAL", "Tim terlatih, 30 paket per jam; sengaja tidak diotomasi karena variasi tinggi dan volume kecil."],
  ["DIKEMAS, DITIMBANG, DILABELI", "Sampai 200.000 pieces per hari; 60% lewat USPS; penimbangan adalah verifikasi akhir isi paket."],
  ["TIBA DI PELANGGAN", "Dalam 1 atau 2 hari: ukuran yang dilihat pelanggan, speed dan dependability."],
];
function stepsSlide(from, img, title) {
  const s = frame({ plain: true });
  bg(s, img);
  label(s, title, FX + 0.6, FY + 0.4, 34, { maxW: 9 });
  for (let i = 0; i < 4; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const x = FX + 0.6 + col * 6.1, y = FY + 1.35 + row * 2.6;
    label(s, "//" + String(from + i + 1).padStart(2, "0"), x, y, 52, { color: MAGENTA });
    HL(s, STEPS[from + i][0], x + 0.55, y + 0.75, 5.3, 0.44, { size: 14, bold: true });
    HL(s, STEPS[from + i][1], x + 0.55, y + 1.27, 5.3, 0.66, { fill: WHITE, color: GRAY, size: 11 });
  }
}
stepsSlide(0, "bg_totes", "PROSES PEMENUHAN PESANAN · LANGKAH 1–4");
stepsSlide(4, "bg_sortation", "PROSES PEMENUHAN PESANAN · LANGKAH 5–8");

// ============================================================ 11. DUA ANGKA
{
  const s = frame();
  const im = cut(s, "scanner", { h: 4.2, maxW: 6.2 }); const W = 5.3;
  label(s, "DUA ANGKA YANG BERBEDA", TX, TOP, TITLE);
  T(s, "Satu pesanan diproses dengan investasi tenaga kerja kurang dari 3 menit; 70% pesanan multiproduk; buku menyebutnya world-class performance.", TX, TOP + 0.85, W, 0.65);
  label(s, "< 3 MENIT", TX, TOP + 1.75, 46, { color: MAGENTA });
  HL(s, "Ukuran input (biaya)", TX, TOP + 2.65, 2.6, 0.36);
  T(s, "Jam kerja per pesanan, hasil efisiensi proses di dalam gudang.", TX, TOP + 3.1, 2.6, 0.8);
  label(s, "1–2 HARI", TX + 2.95, TOP + 1.75, 46, { color: MAGENTA });
  HL(s, "Ukuran output (speed)", TX + 2.95, TOP + 2.65, 2.6, 0.36);
  T(s, "Yang dirasakan pelanggan, hasil posisi stok yang dekat pelanggan.", TX + 2.95, TOP + 3.1, 2.6, 0.8);
  HL(s, "Dua angka ini jangan dicampur: Amazon unggul di keduanya, tetapi mekanismenya berbeda.", TX, TOP + 4.15, W, 0.55);
}

// ============================================================ 12. ROBOT KIVA
{
  const s = frame();
  const im = cut(s, "robot", { h: 5.9 }); const W = im.textW;
  label(s, "MEKANISME ROBOT KIVA", TX, TOP, TITLE);
  T(s, "Langkah picking hanya menyebut hasilnya. Mekanismenya dijelaskan pada bab tata letak, dan dari sinilah angka kecepatan dan akurasi picking berasal.", TX, TOP + 0.85, W, 0.65);
  let y = numList(s, [
    "10.000+ robot membawa rak ke pekerja: barangnya yang bergerak, bukan orangnya",
    "20 mil jalan kaki per hari per pekerja dihemat (gudang Tracy, California)",
    "Standar pick and scan naik dari 100 menjadi 300 item per jam",
    "Biaya per pesanan turun 20–40%; setara US$400–900 juta per tahun",
  ], TX, TOP + 1.7, W, { rowH: 0.5, gap: 0.14 });
  y += 0.3;
  y = block(s, "DAMPAK PADA PERSEDIAAN", "Lokasi fisik stok tidak lagi harus tetap (slotting diatur perangkat lunak), dan setiap pengambilan langsung dipindai sehingga catatan stok diperbarui bersamaan dengan pengambilan fisik.", TX, y, W, { pt: 22, h: 0.7 }) + 0.1;
  HL(s, "Inilah yang membuat alokasi pesanan dari Seattle bisa mengandalkan data stok per DC.", TX, y, W, 0.45);
}

// ============================================================ 13. PRODUKTIVITAS
{
  const s = frame();
  const im = cut(s, "forklift", { h: 3.7, maxW: 6.0 }); const W = 5.8;
  label(s, "PRODUKTIVITAS YANG ADIL", TX, TOP, TITLE);
  T(s, "100 menjadi 300 item per jam mudah dibaca sebagai kenaikan 200%. Itu single-factor, hanya menghitung tenaga kerja; biaya robot tidak ikut dihitung.", TX, TOP + 0.85, W, 0.65);
  let y = TOP + 1.7;
  y = block(s, "SINGLE-FACTOR · +200%", "Benar, tetapi belum memperhitungkan investasi robot.", TX, y, W, { pt: 22, h: 0.35 }) + 0.15;
  y = block(s, "MULTI-FACTOR · −20–40% BIAYA PER PESANAN", "Sudah termasuk biaya robot: hemat US$0,70–1,50 per pesanan. Jauh di bawah 200%, tetapi tetap positif.", TX, y, 5.4, { pt: 22, h: 0.55 }) + 0.15;
  y = block(s, "DAMPAK TAHUNAN · US$400–900 JUTA", "Angka kecil per pesanan menjadi besar karena volume.", TX, y, 5.4, { pt: 22, h: 0.35 }) + 0.12;
  HL(s, "Yang dipresentasikan sebaiknya angka biaya per pesanan, bukan angka 200%.", TX, y, 5.4, 0.45);
}

// ============================================================ 14. STOK BESAR, TIDAK EFISIEN?
{
  const s = frame();
  const im = cut(s, "boxes", { h: 5.9 }); const W = im.textW;
  label(s, "STOK BESAR, TIDAK EFISIEN?", TX, TOP, TITLE);
  T(s, "Persediaan bisa mencapai 50% dari total modal. Amazon jelas di sisi investasi besar: jutaan item di lebih dari 150 gudang.", TX, TOP + 0.85, W, 0.6);
  HL(s, "Jawabannya harus dikembalikan ke objective.", TX, TOP + 1.6, W, 0.42);
  T(s, "Amazon tidak meminimalkan stok. Amazon meminimalkan total biaya pada tingkat layanan yang dijanjikan. Pada tingkat itu, kekosongan stok berarti penjualan hilang dan janji fastest delivery rusak: dampaknya signifikan, sehingga stok besar konsisten dengan tujuannya, bukan pemborosan.", TX, TOP + 2.2, W, 1.5);
  let y = TOP + 3.75;
  y = block(s, "YANG DIMINIMALKAN AMAZON", "Dua komponen lain: tenaga kerja per pesanan (kurang dari 3 menit) dan kesalahan (mendekati nol).", TX, y, W, { pt: 22, h: 0.55 }) + 0.12;
  HL(s, "Bukan stok sedikit, tetapi stok besar yang dikelola presisi.", TX, y, W, 0.42);
}

// ============================================================ 15. LIMA TUJUAN KINERJA
{
  const s = frame();
  const im = cut(s, "truck", { h: 3.0, maxW: 6.0 }); const W = 6.0;
  label(s, "LIMA TUJUAN KINERJA OPERASI", TX, TOP, TITLE);
  const rows = [
    ["SPEED", "Tiba 1–2 hari; tenaga kerja kurang dari 3 menit per pesanan."],
    ["QUALITY", "Kesalahan picking mendekati nol; bar code dipindai 15 kali; penimbangan sebelum keluar."],
    ["DEPENDABILITY", "Janji 1–2 hari terpenuhi; as promised, bukan sekadar cepat."],
    ["FLEXIBILITY", "70% pesanan multiproduk dilayani satu sistem: batch picking lalu konsolidasi."],
    ["COST", "Harga terendah; 60% kiriman lewat USPS; biaya sort-pick-pack turun 20–40%."],
  ];
  let y = TOP + 0.95;
  rows.forEach((r, i) => { y = block(s, r[0], r[1], TX, y, i < 3 ? W : 5.3, { pt: 21, h: 0.36, size: 11.5 }) + 0.12; });
  HL(s, "Satu sistem yang sama: stok yang akurat lokasinya, proses pendek, kontrol berlapis.", TX, y, 5.3, 0.42);
}

// ============================================================ 16. TIGA TRADE-OFF
{
  const s = frame();
  const im = cut(s, "boxes", { h: 5.9 }); const W = im.textW;
  label(s, "TIGA TRADE-OFF UTAMA", TX, TOP, TITLE);
  T(s, "Setiap pilihan operasi punya biaya di sisi lain; keputusan yang baik sadar biayanya dan tahu mana yang less loss.", TX, TOP + 0.85, W, 0.6);
  const tos = [
    ["Holding cost vs service level", "Carrying cost sekitar 26% per tahun dan naik eksponensial di service level tinggi. Aturan: naikkan stok kalau biaya kekosongan lebih besar dari biaya simpan tambahan; untuk ritel daring, ini terpenuhi."],
    ["Otomasi vs kesalahan dan tenaga kerja", "Robot dan pemindaian berlapis adalah biaya tetap. Aturan: otomasi layak kalau penghematan per pesanan dikali volume tahunan lebih besar dari biaya otomasi. Penentunya volume."],
    ["Kecepatan kirim vs biaya kirim", "60% pesanan lewat USPS yang murah. Aturan: kecepatan dibangun dari dalam, stok dekat pelanggan dan proses gudang pendek."],
  ];
  let y = TOP + 1.6;
  tos.forEach((t, i) => {
    s.addText(String(i + 1), { x: TX, y, w: 0.35, h: 0.4, fontFace: BF, fontSize: 13, color: GRAY, isTextBox: true, margin: 0, valign: "middle" });
    HL(s, t[0], TX + 0.35, y, W - 0.35, 0.4, { bold: true });
    T(s, t[1], TX + 0.35, y + 0.48, W - 0.35, 0.95, { size: 11.5 });
    y += 1.5;
  });
}

// ============================================================ 17. VERIFIKASI TRADE-OFF
{
  const s = frame();
  const im = cut(s, "conveyor", { h: 3.2, maxW: 5.7 }); const W = 5.9;
  label(s, "VERIFIKASI TRADE-OFF", TX, TOP, TITLE);
  T(s, "Periksa dulu apakah dua tujuan benar bertentangan atau justru searah. Kalau searah, tidak perlu ditimbang; kerjakan saja.", TX, TOP + 0.85, W, 0.6);
  let y = numList(s, [
    "Akurasi vs biaya: searah, kesalahan yang dicegah menghilangkan biaya return",
    "Kecepatan proses vs biaya: searah, kurang dari 3 menit per pesanan",
    "Ketersediaan stok vs holding cost: trade-off nyata, dipilih sadar",
    "Kecepatan kirim vs biaya kirim: trade-off nyata yang dihindari",
  ], TX, TOP + 1.6, W, { rowH: 0.38, gap: 0.1, size: 11.5 });
  y += 0.25;
  doodle(s, TX, y, 0.9);
  label(s, "EFFICIENT FRONTIER", TX + 1.1, y + 0.25, 30);
  T(s, "Pengecer virtual: modal terendah, tetapi gagal memenuhi constraint bebas kesalahan dan tercepat. Gudang manual: didominasi otomasi pada volume Amazon. Gudang terotomasi: di frontier, dipilih sesuai value proposition. Pada volume kecil, alternatif manual kembali ke frontier.", TX + 1.1, y + 0.85, 5.1, 1.4, { size: 11 });
}

// ============================================================ 18. KAITAN TEORI
{
  const s = frame();
  const im = cut(s, "rack", { h: 5.9 }); const W = im.textW;
  label(s, "KAITAN DENGAN TEORI PERSEDIAAN", TX, TOP, TITLE, { maxW: 7.5 });
  T(s, "Konsep Bab 12 yang terlihat bekerja di Amazon. Tanda dalam kurung menyatakan apakah kaitan itu disebut buku secara eksplisit atau merupakan inferensi.", TX, TOP + 0.85, W, 0.6);
  let y = numList(s, [
    "Fungsi persediaan: pilihan barang untuk permintaan yang diantisipasi (eksplisit)",
    "Record accuracy: sistem perpetual dengan bar code, dipindai 15 kali (eksplisit)",
    "Cycle counting: tidak disebut, verifikasi berkala tetap diperlukan (asumsi)",
    "ABC analysis: 100.000 item terlaris per wilayah (sumber lain, 2023)",
    "Kontrol persediaan ritel: barang masuk dan keluar dengan bar code (eksplisit)",
    "Independent demand dan safety stock: service level tinggi menuntut stok besar (inferensi)",
    "Penempatan di gudang: picking diurutkan, slotting diatur perangkat lunak (eksplisit)",
  ], TX, TOP + 1.6, W, { rowH: 0.38, gap: 0.09, size: 11 });
  HL(s, "Profil Amazon menekankan pengendalian, bukan model kuantitatif. Urutannya: akurasi dulu, model kemudian.", TX, y + 0.25, W, 0.55);
}

// ============================================================ 19. PERKEMBANGAN TERBARU
{
  const s = frame();
  const im = cut(s, "robot", { h: 5.9 }); const W = im.textW;
  label(s, "PERKEMBANGAN TERBARU", TX, TOP, TITLE);
  T(s, "Buku menggambarkan kondisi 2017. Sumber berikut dari blog resmi para penulis buku, sehingga sejalan dengan rujukan kelas.", TX, TOP + 0.85, W, 0.6);
  let y = TOP + 1.6;
  y = block(s, "2023 · REGIONALISASI JARINGAN", "8 wilayah dengan stok lengkap; 76% permintaan dipenuhi dari dalam wilayah; same-day facility menyimpan 100.000 item terlaris per wilayah; picking sampai dock 11 menit.", TX, y, W, { h: 0.85 }) + 0.1;
  HL(s, "Keputusan where kini per wilayah; 100.000 item terlaris adalah Pareto/ABC pada penempatan stok.", TX, y, W, 0.55); y += 0.85;
  y = block(s, "2025 · SKALA ROBOT", "Lebih dari satu juta robot; 75% pengiriman melibatkan robot; paket per karyawan per tahun naik dari 175 menjadi 3.870.", TX, y, W, { h: 0.6 }) + 0.1;
  HL(s, "Angka per karyawan adalah single-factor; jangan dibaca sebagai efisiensi total.", TX, y, W, 0.42);
}

// ============================================================ 20. LESSON LEARNED (//01 ... //06)
{
  const s = frame({ plain: true });
  bg(s, "bg_dock");
  label(s, "LESSON LEARNED", FX + 0.6, FY + 0.4, 34);
  const L = [
    ["PERSEDIAAN BISA MENJADI KEUNGGULAN BERSAING", "Syaratnya dikelola presisi: stok besar yang diketahui lokasinya."],
    ["AKURASI CATATAN ADALAH PRASYARAT", "Akurasi dulu, model kemudian."],
    ["KECEPATAN DIBANGUN DARI DALAM", "Posisi stok dan proses pendek memungkinkan moda kirim murah."],
    ["KONTROL BERLAPIS, BUKAN TRADE-OFF", "Biaya kesalahan lebih besar dari biaya kontrol; kerjakan saja."],
    ["OTOMASI DIBENARKAN OLEH VOLUME", "Penghematan kecil per pesanan hanya berarti pada volume besar."],
    ["TRADE-OFF YANG TERSISA DIPILIH SADAR", "Holding cost tinggi diterima karena biaya kekosongan signifikan."],
  ];
  L.forEach((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = FX + 0.6 + col * 6.1, y = FY + 1.3 + row * 1.75;
    label(s, "//" + String(i + 1).padStart(2, "0"), x, y, 46, { color: MAGENTA });
    HL(s, l[0], x + 0.5, y + 0.66, 5.4, 0.42, { size: 13, bold: true });
    HL(s, l[1], x + 0.5, y + 1.12, 5.4, 0.36, { fill: WHITE, color: GRAY, size: 11 });
  });
}


// ============================================================ 21. PENUTUP
{
  const s = frame({ mapT: 60 });
  cut(s, "skyline", { h: 3.9, maxW: 12, x: FX + (FW - 3.9 * AR.skyline) / 2, y: FY + FH - 3.9 + 0.02 });
  // satu kata besar mengunci bidang atas: garis miring magenta + kata setinggi 150 pt
  const sl = label(s, "//", FX + 0.55, FY + 0.3, 150, { color: MAGENTA });
  label(s, "TERIMA KASIH", FX + 0.55 + sl.w - 0.15, FY + 0.3, 150, { maxW: 11.5 });
}

pres.writeFile({ fileName: OUT }).then(() => console.log("ditulis:", OUT, "| slide:", slideNo));
