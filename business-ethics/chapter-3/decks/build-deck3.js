'use strict';
// DECK 3 — Berkas fakta lima kandidat kasus Indonesia, dengan data hasil penelusuran
const T = require('./theme');
const {
  BG, INK, SLATE, LINE, ORNG, LAV, LIME, AMBR, TEAL, W, F, MONO,
  M, SW, SH, CW,
  bg, card, rect, pills, pillsRight, head, sub, chip, tile, stat, quote,
  banner, numRow, wave, foot, report, mix
} = T;

const pres = T.newDeck('Lima Kandidat Kasus Indonesia', 'Berkas fakta untuk Chapter 3');
let page = 0;

function S(pillItems, opt) {
  const s = pres.addSlide();
  bg(s, (opt && opt.bg) || BG);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, (opt && opt.corner) || LAV);
  if (pillItems) pills(pres, s, pillItems);
  page++;
  foot(s, page, (opt && opt.footColor) || SLATE);
  return s;
}

const w3 = (CW - 2 * 0.24) / 3;
const w4 = (CW - 3 * 0.2) / 4;
const w2 = (CW - 0.28) / 2;
const KAS = [ORNG, TEAL, AMBR, INK, LAV];

// baris sumber di kaki slide
function src(s, y, text) {
  s.addText(text, {
    isTextBox: true, x: M, y, w: CW, h: 0.28,
    fontFace: F, fontSize: 10, italic: true, color: SLATE, margin: 0
  });
  T.chk('sumber', text, CW, 0.28, 10, 13);
}

// daftar fakta berlabel
function fakta(s, x, y, w, items, warna, pitch) {
  const p = pitch || 0.56;
  items.forEach((it, i) => {
    const yy = y + i * p;
    rect(pres, s, x, yy + 0.12, 0.16, 0.16, warna);
    s.addText(it[0], { isTextBox: true, x: x + 0.32, y: yy, w: 1.6, h: 0.36, fontFace: MONO, fontSize: 10.5, bold: true, color: mix(warna, INK, 0.35), margin: 0 });
    s.addText(it[1], { isTextBox: true, x: x + 2.06, y: yy, w: w - 2.06, h: p - 0.06, fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0, lineSpacing: 15 });
    T.chk('fakta ' + it[0], it[1], w - 2.06, p - 0.06, 11.5, 15);
  });
}

// ============================================================ 01 sampul
{
  const s = pres.addSlide();
  bg(s);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, LAV);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, ORNG);
  wave(pres, s, 7.4, 1.2, 5.5, 0.42);
  page++;

  s.addText('Business Ethics', { isTextBox: true, x: M, y: 0.5, w: 4, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
  pillsRight(pres, s, [{ t: 'MBA · UGM', fill: LAV, color: INK }, { t: 'Berkas Fakta', outline: true }], 0.46);

  sub(s, 'Bahan Kajian Mandiri', 1.62, 7.4);
  s.addText('Lima Kandidat Kasus —', { isTextBox: true, x: M, y: 1.95, w: 7.4, h: 0.34, fontFace: F, fontSize: 16, bold: true, color: ORNG, margin: 0 });

  s.addText([
    { text: 'Fakta Kasus', options: { color: INK, breakLine: true } },
    { text: 'Indonesia', options: { color: INK } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 2.48, w: 8.2, h: 1.72, fontFace: F, fontSize: 52, bold: true, margin: 0, lineSpacing: 58 });

  sub(s, 'Data terverifikasi dari sumber publik, disusun tanpa analisis, untuk dikonseptualisasikan sendiri dengan kerangka sembilan teori.', 4.5, 7.3, SLATE, 14, 0.86);

  KAS.forEach((c, i) => rect(pres, s, M + i * 0.42, 5.72, 0.3, 0.3, c));

  card(pres, s, M, 6.26, 4.5, 0.78, W);
  rect(pres, s, M, 6.32, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 6.41, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: INK, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 6.68, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: SLATE, margin: 0 });

  s.addText('Data ditelusuri Agustus 2026', {
    isTextBox: true, x: SW - M - 4.0, y: 6.68, w: 4.0, h: 0.28, align: 'right',
    fontFace: F, fontSize: 10.5, color: SLATE, margin: 0
  });
  s.addNotes('Deck ini bukan untuk dipresentasikan. Isinya bahan mentah agar Aslih bisa memilih kasus dan menyusun analisisnya sendiri.');
}

// ============================================================ 02 daftar kasus
{
  const s = S(null);
  head(s, 'Lima Kandidat', 0.62, 40);
  pills(pres, s, [
    { t: 'Industri', fill: ORNG },
    { t: 'Ketenagakerjaan', fill: TEAL },
    { t: 'Konsumsi', fill: AMBR, color: INK },
    { t: 'Perkara Hukum', fill: INK }
  ], 1.42);

  const idx = [
    ['01', 'Hilirisasi Nikel', 'Morowali dan Weda Bay, tambang sampai smelter'],
    ['02', 'Kemitraan Ojek Online', 'Status mitra, potongan aplikasi, dan Perpres 27/2026'],
    ['03', 'Industri Rokok', 'Cukai dan lapangan kerja versus beban kesehatan'],
    ['04', 'Impor Minyak Pertamina', 'Dua perkara, tersangka masih buron'],
    ['05', 'Pengadaan Chromebook', 'Sudah divonis tingkat pertama, dalam proses banding'],
    ['', 'Matriks Kesesuaian', 'Kelima kasus diuji terhadap kriteria bab'],
    ['', 'Peta Lensa', 'Teori mana yang tajam untuk kasus mana'],
    ['', 'Sumber Data', 'Rujukan lengkap untuk penelusuran lanjutan']
  ];
  const colW = CW / 2 - 0.2;
  idx.forEach((it, i) => {
    const x = M + (i > 3 ? CW / 2 + 0.2 : 0), y = 2.16 + (i % 4) * 1.06;
    if (it[0]) s.addText(it[0] + '.', { isTextBox: true, x, y, w: 0.62, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: KAS[i], margin: 0 });
    s.addText(it[1], { isTextBox: true, x: x + 0.78, y: y - 0.02, w: colW - 0.78, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: INK, margin: 0 });
    s.addText(it[2], { isTextBox: true, x: x + 0.78, y: y + 0.27, w: colW - 0.78, h: 0.28, fontFace: F, fontSize: 11.5, color: SLATE, margin: 0 });
    rect(pres, s, x, y + 0.76, colW, 0.011, LINE);
  });
  s.addNotes('Tiga bagian terakhir adalah alat bantu memilih, bukan kasus.');
}

// ============================================================ 03 cara memakai
{
  const s = S([{ t: 'Petunjuk', fill: LAV, color: INK }, { t: 'Baca Dahulu', outline: true }]);
  head(s, 'Cara Memakai Berkas Ini', 0.96);
  sub(s, 'Tiga hal yang menentukan apakah bahan ini aman dipakai.', 1.62);

  const it = [
    [ORNG, 'Fakta, Bukan Analisis', 'Berkas ini berhenti pada data dan narasi yang diperdebatkan. Penilaian moral dan penerapan sembilan teori dikerjakan sendiri, karena di situlah nilai tugasnya berada.'],
    [AMBR, 'Angka Punya Tanggal', 'Setiap angka disertai periodenya. Angka industri dan penerimaan negara berubah tiap tahun, jadi periksa ulang bila presentasi mundur beberapa bulan.'],
    [INK, 'Perkara Hukum Berbeda Statusnya', 'Kasus 04 belum masuk persidangan. Kasus 05 sudah divonis tingkat pertama namun sedang banding, sehingga belum berkekuatan hukum tetap.']
  ];
  it.forEach((t, i) => tile(pres, s, {
    x: M + i * (w3 + 0.24), y: 2.16, w: w3, h: 2.62, fill: t[0], n: '0' + (i + 1), t: t[1], ts: 14, b: t[2]
  }));

  banner(pres, s, M, 5.02, CW, 1.06, 'Kriteria kelayakan sebuah kasus untuk bab ini: apakah kesembilan teori menghasilkan putusan yang berbeda. Kasus yang seluruh teorinya menolak justru membatalkan pesan bab.', LIME, INK);
  s.addNotes('Kalau hanya satu hal yang diingat dari slide ini: kasus yang bagus adalah kasus yang jawabannya belum selesai.');
}

// ============================================================ 04 nikel skala
{
  const s = S([{ t: 'Kasus 01', fill: ORNG }, { t: 'Skala Industri', outline: true }], { corner: ORNG });
  head(s, 'Nikel: Angka Manfaat', 0.96);
  sub(s, 'Dua kawasan industri terintegrasi, dari tambang sampai produk turunan.', 1.62);

  const st = [
    { v: 'USD 41,5', u: 'M', l: 'Investasi kumulatif kawasan IMIP Morowali per Desember 2025, setara Rp 697 triliun', fill: ORNG, vs: 26 },
    { v: '85.520', u: '', l: 'Pekerja IMIP per Juni 2025, naik dari 35.952 pekerja pada 2020', fill: LAV, vs: 26 },
    { v: '81.000', u: '', l: 'Pekerja terserap di kawasan IWIP Weda Bay, dari target 100.000', fill: TEAL, vs: 26 },
    { v: 'USD 40', u: 'M', l: 'Nilai ekspor produk olahan nikel 2025, dari USD 3 miliar pada 2020', fill: INK, numColor: LIME, vs: 30 }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.14 }, o)));

  fakta(s, M, 4.52, CW, [
    ['Kebijakan', 'Larangan ekspor bijih nikel berlaku 1 Januari 2020 melalui Permen ESDM Nomor 11 Tahun 2019'],
    ['Ekspor', 'Ekspor lewat Pelabuhan Bahodopi dan Morowali 2025 mencapai USD 18,08 miliar, sekitar 81 persen ekspor Sulawesi Tengah'],
    ['Komposisi', 'Besi dan baja menyumbang 61,31 persen ekspor kawasan, nikel 16,59 persen']
  ], ORNG, 0.6);

  src(s, 6.44, 'detikFinance dan nikel.co.id atas data PT IMIP dan BPS Sulawesi Tengah, 2025 sampai 2026.');
  s.addNotes('Angka pekerja IMIP naik lebih dari dua kali lipat dalam lima tahun. Itu inti argumen pendukung.');
}

// ============================================================ 05 nikel dampak
{
  const s = S([{ t: 'Kasus 01', fill: ORNG }, { t: 'Dampak Terukur', outline: true }], { corner: ORNG });
  head(s, 'Nikel: Angka Beban', 0.96);
  sub(s, 'Biaya yang tersebar dan tidak masuk ke dalam harga produk.', 1.62);

  const st = [
    { v: '76', u: '%', l: 'Kapasitas PLTU captive nasional yang berasal dari industri nikel', fill: INK, numColor: LIME },
    { v: '22', u: '%', l: 'Kontribusi pengolahan nikel 2023 pada emisi nasional sektor energi dan proses industri', fill: AMBR, ls: 10 },
    { v: '163', u: 'rb ha', l: 'Tutupan pohon hilang di tiga kabupaten Halmahera, 2001 sampai 2023', fill: TEAL },
    { v: '21', u: 'jiwa', l: 'Korban meninggal ledakan tungku PT ITSS di IMIP, 24 Desember 2023', fill: ORNG }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.14, vs: 30 }, o)));

  fakta(s, M, 4.52, CW, [
    ['Energi', 'Kapasitas PLTU captive nasional naik dari 5,5 GW pada 2019 menjadi 16,6 GW pada 2024'],
    ['Masyarakat Adat', 'Survival International mencatat sekitar 19 perusahaan tambang beririsan dengan sekitar 40 persen wilayah hidup suku O Hongana Manyawa'],
    ['Investor', 'Dana pensiun pemerintah Norwegia mengeluarkan Eramet dari portofolionya pada September 2025 atas alasan lingkungan dan hak asasi manusia']
  ], INK, 0.6);

  src(s, 6.44, 'Greenpeace, AEER, Climate Action Tracker, Global Forest Watch, Survival International, NBIM, Mongabay, Tempo.');
  s.addNotes('Angka 163 ribu hektare adalah penjumlahan Halmahera Tengah 27.900, Halmahera Timur 56.300, dan Halmahera Selatan 79.000 hektare.');
}

// ============================================================ 06 nikel kronologi
{
  const s = S([{ t: 'Kasus 01', fill: ORNG }, { t: 'Kronologi', outline: true }], { corner: ORNG });
  head(s, 'Nikel: Urutan Peristiwa', 0.96);

  const tl = [
    ['2019', 'Permen ESDM Nomor 11 Tahun 2019 menetapkan larangan ekspor bijih nikel'],
    ['2020', 'Larangan berlaku 1 Januari, memaksa pembangunan smelter di dalam negeri'],
    ['2021', 'Uni Eropa menggugat kebijakan tersebut ke Organisasi Perdagangan Dunia'],
    ['2022', 'November, panel WTO memutus Indonesia melanggar GATT Pasal XI ayat 1. Indonesia menyatakan banding'],
    ['2023', '24 Desember, ledakan tungku PT ITSS di kawasan IMIP menewaskan 21 pekerja, 13 warga negara Indonesia dan 8 warga negara asing'],
    ['2025', 'September, dana pensiun Norwegia mengeluarkan Eramet dari portofolionya'],
    ['2026', 'Banding Indonesia di WTO belum diputus karena Badan Banding tidak berfungsi']
  ];
  tl.forEach((t, i) => {
    const y = 1.9 + i * 0.6;
    rect(pres, s, M, y + 0.12, 0.18, 0.18, KAS[i % 5]);
    s.addText(t[0], { isTextBox: true, x: M + 0.36, y, w: 1.0, h: 0.34, fontFace: MONO, fontSize: 12, bold: true, color: mix(KAS[i % 5], INK, 0.35), margin: 0 });
    s.addText(t[1], { isTextBox: true, x: M + 1.56, y, w: CW - 1.56, h: 0.5, fontFace: F, fontSize: 12, color: '2A3243', margin: 0, lineSpacing: 15.5 });
    T.chk('tl' + i, t[1], CW - 1.56, 0.5, 12, 15.5);
    if (i < tl.length - 1) rect(pres, s, M, y + 0.46, CW, 0.011, LINE);
  });

  banner(pres, s, M, 6.18, CW, 0.5, 'Larangan ekspor adalah titik balik yang membuat seluruh manfaat dan seluruh beban berikutnya mungkin terjadi.', LIME, INK, 11.5);
  src(s, 6.82, 'Wikipedia, ADCO Law, CNBC Indonesia, Kompas, Mongabay.');
  s.addNotes('Perhatikan bahwa dampaknya bukan kecelakaan, melainkan konsekuensi kebijakan yang disengaja.');
}

// ============================================================ 07 nikel narasi
{
  const s = S([{ t: 'Kasus 01', fill: ORNG }, { t: 'Titik Sengketa', outline: true }], { corner: ORNG });
  head(s, 'Nikel: Dua Narasi', 0.96);

  card(pres, s, M, 1.9, w2, 3.86, ORNG);
  pills(pres, s, [{ t: 'Pembenar', fill: INK }], 2.14, M + 0.3);
  s.addText('Nikel untuk Transisi Energi Dunia', { isTextBox: true, x: M + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  const pos = [
    ['Nilai Tambah', 'Ekspor olahan naik dari USD 3 miliar menjadi USD 40 miliar dalam lima tahun'],
    ['Kerja', 'Lebih dari 166 ribu pekerja terserap di dua kawasan industri'],
    ['Daerah', 'Ekonomi Sulawesi Tengah bergeser dari komoditas mentah ke manufaktur'],
    ['Iklim', 'Baterai kendaraan listrik dunia membutuhkan pasokan nikel']
  ];
  pos.forEach((n, i) => {
    const y = 3.42 + i * 0.58;
    s.addText(n[0], { isTextBox: true, x: M + 0.3, y, w: 1.3, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(n[1], { isTextBox: true, x: M + 1.66, y: y - 0.03, w: w2 - 2.0, h: 0.52, fontFace: F, fontSize: 11, color: 'FFE0D4', margin: 0, lineSpacing: 14.5 });
  });

  const px = M + w2 + 0.28;
  card(pres, s, px, 1.9, w2, 3.86, INK);
  pills(pres, s, [{ t: 'Bantahan', fill: LIME, color: INK }], 2.14, px + 0.3);
  s.addText('Logam Hijau dari Listrik Kotor', { isTextBox: true, x: px + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  const neg = [
    ['Energi', 'Industri nikel menyumbang 76 persen kapasitas PLTU captive nasional'],
    ['Hutan', '163 ribu hektare tutupan pohon hilang di tiga kabupaten Halmahera'],
    ['Kerja', '21 pekerja meninggal dalam satu insiden ledakan tungku pada 2023'],
    ['Air', 'Sungai Ake Jira dan Ake Sagea dilaporkan tercemar logam berat']
  ];
  neg.forEach((n, i) => {
    const y = 3.42 + i * 0.58;
    s.addText(n[0], { isTextBox: true, x: px + 0.3, y, w: 1.3, h: 0.3, fontFace: F, fontSize: 11.5, bold: true, color: LIME, margin: 0 });
    s.addText(n[1], { isTextBox: true, x: px + 1.66, y: y - 0.03, w: w2 - 2.0, h: 0.52, fontFace: F, fontSize: 11, color: 'B9C0CE', margin: 0, lineSpacing: 14.5 });
  });

  banner(pres, s, M, 5.92, CW, 0.62, 'Istilah yang diperebutkan: hilirisasi berkonotasi kemajuan, ekstraksi berkonotasi pengurasan.', AMBR, INK, 12);
  src(s, 6.68, 'Laporan Ongoing Harms, Limited Accountability 2025 untuk data pencemaran sungai.');
  s.addNotes('Paradoks logam hijau dari listrik kotor adalah pintu masuk paling kuat untuk kelas.');
}

// ============================================================ 08 ojol
{
  const s = S([{ t: 'Kasus 02', fill: TEAL }, { t: 'Aturan Main', outline: true }], { corner: TEAL });
  head(s, 'Ojol: Angka dan Regulasi', 0.96);
  sub(s, 'Status mitra dipertahankan, namun negara mulai mengatur isinya.', 1.62);

  const st = [
    { v: '850.000', u: '', l: 'Pengemudi penerima bonus hari raya 2026 dari empat aplikator', fill: TEAL, vs: 26 },
    { v: '20 ke 8', u: '%', l: 'Pemangkasan batas potongan aplikasi menurut Perpres 27 Tahun 2026', fill: LAV, vs: 26 },
    { v: '1 Juli', u: '2026', l: 'Tanggal berlakunya batas potongan 8 persen bagi aplikator', fill: AMBR, vs: 26 },
    { v: 'Mitra', u: '', l: 'Status hukum pengemudi tidak berubah, tetap bukan hubungan kerja', fill: INK, numColor: LIME, vs: 26 }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.14 }, o)));

  fakta(s, M, 4.52, CW, [
    ['Sebaran', 'Grab sekitar 400 ribu pengemudi, Gojek sekitar 400 ribu, Maxim sekitar 51 ribu, inDrive sekitar 500'],
    ['Bantahan', 'Serikat Pekerja Angkutan Indonesia menyatakan potongan efektif di lapangan masih di atas 20 persen'],
    ['Contoh', 'Dari tarif Rp 15.500, pengemudi dipotong Rp 3.500 berupa biaya aplikasi Rp 2.500 dan biaya asuransi Rp 1.000, sebelum potongan 8 persen dihitung']
  ], TEAL, 0.62);

  src(s, 6.5, 'Perpres Nomor 27 Tahun 2026, Hukumonline, detikFinance, Espos, pernyataan SPAI.');
  s.addNotes('Perpres 27/2026 memperlihatkan negara mengatur isi hubungan tanpa mengubah statusnya. Itu titik analisis yang menarik.');
}

// ============================================================ 09 ojol narasi
{
  const s = S([{ t: 'Kasus 02', fill: TEAL }, { t: 'Titik Sengketa', outline: true }], { corner: TEAL });
  head(s, 'Ojol: Dua Narasi', 0.96);

  card(pres, s, M, 1.9, w2, 3.62, TEAL);
  pills(pres, s, [{ t: 'Pembenar', fill: INK }], 2.14, M + 0.3);
  s.addText('Kemitraan dan Fleksibilitas', { isTextBox: true, x: M + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  s.addText('Platform membuka akses pendapatan bagi ratusan ribu orang tanpa syarat pendidikan atau pengalaman. Status mitra memungkinkan pengemudi menentukan sendiri jam kerjanya dan bekerja pada lebih dari satu aplikasi.\n\nPemangkasan potongan menjadi 8 persen disebut sudah menjawab keberatan utama tanpa perlu mengubah status hukum.', {
    isTextBox: true, x: M + 0.3, y: 3.4, w: w2 - 0.66, h: 1.9, fontFace: F, fontSize: 12, color: 'D8F2EC', margin: 0, lineSpacing: 17
  });

  const px = M + w2 + 0.28;
  card(pres, s, px, 1.9, w2, 3.62, INK);
  pills(pres, s, [{ t: 'Bantahan', fill: LIME, color: INK }], 2.14, px + 0.3);
  s.addText('Kendali Ada, Perlindungan Tidak', { isTextBox: true, x: px + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  s.addText('Platform menetapkan tarif, membagi order lewat algoritma, memberi sanksi, dan memutus akun secara sepihak. Ciri itu disebut menyerupai hubungan kerja, bukan kemitraan setara.\n\nSerikat pengemudi menyatakan potongan efektif tetap di atas 20 persen karena biaya aplikasi dan asuransi dihitung terpisah.', {
    isTextBox: true, x: px + 0.3, y: 3.4, w: w2 - 0.66, h: 1.9, fontFace: F, fontSize: 12, color: 'B9C0CE', margin: 0, lineSpacing: 17
  });

  banner(pres, s, M, 5.68, CW, 0.72, 'Istilah yang diperebutkan: mitra menyiratkan kedudukan setara, pekerja menyiratkan kewajiban perlindungan. Satu kata menentukan seluruh hak yang melekat.', AMBR, INK, 12.5);
  src(s, 6.56, 'Perpres Nomor 27 Tahun 2026, pernyataan Serikat Pekerja Angkutan Indonesia, pemberitaan Agustus 2026.');
  s.addNotes('Sengketanya benar-benar berhenti pada satu kata. Bahan sempurna untuk lensa postmodern.');
}

// ============================================================ 10 rokok
{
  const s = S([{ t: 'Kasus 03', fill: AMBR, color: INK }, { t: 'Angka Kunci', outline: true }], { corner: AMBR });
  head(s, 'Rokok: Angka Dua Sisi', 0.96);
  sub(s, 'Penerimaan negara dan penyerapan tenaga kerja berhadapan dengan beban kesehatan.', 1.62);

  const st = [
    { v: 'Rp 122', u: 'T', l: 'Penerimaan cukai hasil tembakau sampai Juli 2025, naik 9,6 persen', fill: AMBR, vs: 28 },
    { v: '70', u: 'juta', l: 'Perokok aktif menurut Survei Kesehatan Indonesia 2023', fill: ORNG, vs: 30 },
    { v: '74,5', u: '%', l: 'Prevalensi merokok pada laki-laki, perempuan 3 persen', fill: TEAL, vs: 30 },
    { v: '10,8', u: '%', l: 'Sumbangan rokok kretek filter pada garis kemiskinan perkotaan', fill: INK, numColor: LIME, vs: 30 }
  ];
  st.forEach((o, i) => stat(pres, s, Object.assign({ x: M + i * (w4 + 0.2), y: 2.16, w: w4, h: 2.14 }, o)));

  fakta(s, M, 4.52, CW, [
    ['Peringkat', 'Indonesia berada di posisi kelima dunia untuk persentase perokok, yaitu 38,7 persen penduduk'],
    ['Usia Muda', '7,4 persen perokok berada pada rentang usia 10 sampai 18 tahun menurut survei 2023'],
    ['Kemiskinan', 'Rokok kretek filter adalah penyumbang garis kemiskinan terbesar kedua setelah beras, 10,83 persen di kota dan 10,18 persen di desa']
  ], AMBR, 0.62);

  src(s, 6.5, 'Kementerian Kesehatan, Survei Kesehatan Indonesia 2023, Badan Pusat Statistik Maret 2025, Kementerian Keuangan.');
  s.addNotes('Angka kemiskinan itu yang paling kuat untuk lensa Rawls. Beban jatuh pada rumah tangga paling tidak beruntung.');
}

// ============================================================ 11 rokok narasi
{
  const s = S([{ t: 'Kasus 03', fill: AMBR, color: INK }, { t: 'Titik Sengketa', outline: true }], { corner: AMBR });
  head(s, 'Rokok: Dua Narasi', 0.96);

  card(pres, s, M, 1.9, w2, 3.62, AMBR);
  pills(pres, s, [{ t: 'Pembenar', fill: INK }], 2.14, M + 0.3);
  s.addText('Industri Legal dan Padat Karya', { isTextBox: true, x: M + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: INK, margin: 0, lineSpacing: 25 });
  s.addText('Produk ini legal, dikenai cukai, dan diatur ketat. Konsumsinya merupakan pilihan orang dewasa yang mengetahui risikonya, karena peringatan kesehatan tercetak pada setiap bungkus.\n\nSigaret kretek tangan menyerap tenaga kerja besar, mayoritas perempuan, di Kudus, Malang, dan Blitar. Pengetatan mendadak disebut akan memindahkan pasar ke rokok ilegal.', {
    isTextBox: true, x: M + 0.3, y: 3.4, w: w2 - 0.66, h: 1.9, fontFace: F, fontSize: 12, color: '3A2E10', margin: 0, lineSpacing: 17
  });

  const px = M + w2 + 0.28;
  card(pres, s, px, 1.9, w2, 3.62, INK);
  pills(pres, s, [{ t: 'Bantahan', fill: LIME, color: INK }], 2.14, px + 0.3);
  s.addText('Pilihan yang Tidak Sepenuhnya Bebas', { isTextBox: true, x: px + 0.3, y: 2.6, w: w2 - 0.6, h: 0.72, fontFace: F, fontSize: 19, bold: true, color: W, margin: 0, lineSpacing: 25 });
  s.addText('Sebagian besar perokok mulai pada usia remaja, ketika kapasitas menimbang risiko jangka panjang belum penuh. Ketergantungan nikotin membuat pilihan berhenti tidak sebebas pilihan memulai.\n\nBebannya jatuh pada rumah tangga berpenghasilan rendah, karena rokok adalah penyumbang garis kemiskinan terbesar kedua setelah beras.', {
    isTextBox: true, x: px + 0.3, y: 3.4, w: w2 - 0.66, h: 1.9, fontFace: F, fontSize: 12, color: 'B9C0CE', margin: 0, lineSpacing: 17
  });

  banner(pres, s, M, 5.68, CW, 0.72, 'Istilah yang diperebutkan: industri hasil tembakau berkonotasi pertanian dan manufaktur, industri rokok menyebut produk akhirnya secara langsung.', AMBR, INK, 12.5);
  src(s, 6.56, 'Tarif cukai hasil tembakau tidak dinaikkan pada 2025, penerimaan tetap tumbuh lewat penyesuaian harga dasar.');
  s.addNotes('Argumen pilihan bebas adalah titik paling menarik. Kant dan ethic of care menjawabnya sangat berbeda.');
}

// ============================================================ 12 pertamina
{
  const s = S([{ t: 'Kasus 04', fill: INK }, { t: 'Belum Disidangkan', outline: true }], { corner: INK });
  head(s, 'Impor Minyak Pertamina', 0.96);
  sub(s, 'Dua perkara terpisah dengan satu nama tersangka yang sama.', 1.62);

  fakta(s, M, 2.12, CW, [
    ['Perkara I', 'Tata kelola minyak mentah dan produk kilang periode 2018 sampai 2023, sembilan tersangka, dugaan kerugian negara Rp 193,7 triliun'],
    ['Perkara II', 'Pengadaan minyak mentah dan produk kilang di Petral periode 2008 sampai 2015, status tersangka diumumkan 9 April 2026'],
    ['Kerugian', 'Nilai kerugian perkara Petral belum ditetapkan, penyidik masih menghitung bersama auditor BPKP'],
    ['Status', 'Tersangka berada di luar negeri, masuk daftar pencarian orang, dan belum tertangkap sampai Agustus 2026'],
    ['Sengketa', 'Metode penghitungan Rp 193,7 triliun dipersoalkan karena melampaui kerugian keuangan negara secara langsung'],
    ['Latar', 'Petral, lengan dagang Pertamina di Singapura, dibubarkan pada 2015']
  ], INK, 0.62);

  card(pres, s, M, 5.92, CW, 0.86, W);
  rect(pres, s, M, 6.0, 0.055, 0.7, ORNG);
  s.addText('Catatan Hukum', { isTextBox: true, x: M + 0.3, y: 6.04, w: 1.8, h: 0.28, fontFace: F, fontSize: 12, bold: true, color: ORNG, margin: 0 });
  s.addText('Perkara belum bergulir ke persidangan. Asas praduga tak bersalah berlaku penuh, dan seluruh pernyataan wajib memakai kata diduga.', {
    isTextBox: true, x: M + 2.2, y: 5.92, w: CW - 2.5, h: 0.86, valign: 'middle', fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0, lineSpacing: 15
  });

  src(s, 6.9, 'Tempo, CNBC Indonesia, detikNews, Narasi, Monitor Indonesia, April sampai Agustus 2026.');
  s.addNotes('Satu-satunya sudut yang relevan untuk bab ini: perdebatan tentang apa yang layak dihitung sebagai kerugian.');
}

// ============================================================ 13 chromebook
{
  const s = S([{ t: 'Kasus 05', fill: LAV, color: INK }, { t: 'Sudah Divonis', outline: true }]);
  head(s, 'Pengadaan Chromebook', 0.96);
  sub(s, 'Sudah diputus pada tingkat pertama, terdakwa menyatakan banding.', 1.62);

  fakta(s, M, 2.12, CW, [
    ['Program', 'Pengadaan perangkat belajar berbasis sistem operasi Chrome untuk sekolah dalam program digitalisasi pendidikan'],
    ['Kerugian', 'Majelis hakim menetapkan kerugian keuangan negara sebesar Rp 2,1 triliun'],
    ['Tuntutan', 'Jaksa menuntut 18 tahun penjara, denda Rp 1 miliar, dan uang pengganti Rp 5,6 triliun'],
    ['Vonis', '30 Juni 2026, Pengadilan Tipikor Jakarta Pusat menjatuhkan 10 tahun penjara, denda Rp 1 miliar, dan uang pengganti Rp 809,59 miliar'],
    ['Sikap', 'Terdakwa menolak putusan dan langsung menyatakan mengajukan banding'],
    ['Status', 'Putusan belum berkekuatan hukum tetap selama proses banding berjalan']
  ], LAV, 0.62);

  card(pres, s, M, 5.92, CW, 0.86, W);
  rect(pres, s, M, 6.0, 0.055, 0.7, ORNG);
  s.addText('Catatan Hukum', { isTextBox: true, x: M + 0.3, y: 6.04, w: 1.8, h: 0.28, fontFace: F, fontSize: 12, bold: true, color: ORNG, margin: 0 });
  s.addText('Putusan tingkat pertama bukan putusan akhir. Sebutkan bahwa perkara masih dalam proses banding bila kasus ini dipakai di kelas.', {
    isTextBox: true, x: M + 2.2, y: 5.92, w: CW - 2.5, h: 0.86, valign: 'middle', fontFace: F, fontSize: 11.5, color: '2A3243', margin: 0, lineSpacing: 15
  });

  src(s, 6.9, 'Kompas, ANTARA, Media Justitia, Juni sampai Agustus 2026.');
  s.addNotes('Vonis membuat kasus ini makin tidak cocok sebagai kasus prisma, karena pertanyaan moralnya sudah dijawab pengadilan.');
}

// ============================================================ 14 kenapa dua perkara tidak bekerja
{
  const s = S([{ t: 'Peringatan', fill: ORNG }, { t: 'Kasus 04 dan 05', outline: true }], { corner: ORNG });
  head(s, 'Ketika Prisma Runtuh Jadi Lensa', 0.96);
  sub(s, 'Sembilan teori diuji pada perkara korupsi menghasilkan sembilan putusan yang sama.', 1.62);

  const NAMA = ['Egoism', 'Utilitarianism', 'Ethics of Duty', 'Ethics of Rights', 'Justice', 'Virtue Ethics', 'Ethic of Care', 'Discourse Ethics', 'Postmodern'];
  const SPEC = ['AB463C', 'FF5A2D', 'F5B722', 'C6F04A', '0FA98E', '4EA8DE', '6C7BE0', 'B8A6F5', 'E86A9B'];
  const wk = (CW - 2 * 0.2) / 3;
  NAMA.forEach((n, i) => {
    const x = M + (i % 3) * (wk + 0.2), y = 2.16 + Math.floor(i / 3) * 0.68;
    card(pres, s, x, y, wk, 0.56, W, { r: 0.1 });
    rect(pres, s, x, y, 0.13, 0.56, SPEC[i]);
    s.addText(n, { isTextBox: true, x: x + 0.3, y, w: wk - 1.6, h: 0.56, valign: 'middle', fontFace: F, fontSize: 12, bold: true, color: INK, margin: 0 });
    s.addText('MENOLAK', { isTextBox: true, x: x + wk - 1.4, y, w: 1.2, h: 0.56, valign: 'middle', align: 'right', fontFace: F, fontSize: 10, bold: true, charSpacing: 0.8, color: mix(SPEC[i], INK, 0.4), margin: 0 });
  });

  banner(pres, s, M, 4.4, CW, 1.06, 'Kolom kanan seragam. Tidak ada yang bisa didiskusikan, karena tidak ada perbedaan pandangan yang perlu dijembatani. Bab ini justru dibangun untuk menunjukkan perbedaan itu.', INK, W);

  tile(pres, s, {
    x: M, y: 5.6, w: w2, h: 1.34, fill: LIME, t: 'Kasus yang Bekerja', ts: 14,
    b: 'Manfaat dan beban jatuh ke pihak berbeda, kedua sisi punya data resmi, dan ada label pembenar yang dapat diuji.', bs: 11
  });
  tile(pres, s, {
    x: M + w2 + 0.28, y: 5.6, w: w2, h: 1.34, fill: INK, t: 'Kasus yang Tidak Bekerja', ts: 14,
    b: 'Perbuatannya sudah jelas salah menurut seluruh kerangka, sehingga sembilan teori hanya mengulang kesimpulan yang sama.', bs: 11
  });
  s.addNotes('Slide ini menjelaskan kenapa kasus 04 dan 05 tidak disarankan dalam bentuk aslinya.');
}

// ============================================================ 15 matriks
{
  const s = S([{ t: 'Alat Bantu', fill: LAV, color: INK }, { t: 'Kriteria Bab', outline: true }]);
  head(s, 'Matriks Kesesuaian', 0.96);
  sub(s, 'Kelima kasus diuji terhadap lima syarat yang membuat sebuah kasus cocok untuk bab ini.', 1.62);

  const kol = ['Jawaban Terbuka', 'Label Pembenar', 'Beban Asimetris', 'Pihak Absen', 'Aman di Kelas'];
  const cw1 = 2.5, cwn = 1.32, cwv = CW - cw1 - 5 * cwn;
  kol.forEach((k, i) => {
    s.addText(k, {
      isTextBox: true, x: M + cw1 + i * cwn + 0.05, y: 2.24, w: cwn - 0.1, h: 0.42, align: 'center',
      fontFace: F, fontSize: 9, bold: true, color: SLATE, margin: 0, lineSpacing: 12
    });
  });
  s.addText('KECOCOKAN', {
    isTextBox: true, x: M + cw1 + 5 * cwn, y: 2.24, w: cwv - 0.24, h: 0.42, align: 'right',
    fontFace: F, fontSize: 9, bold: true, charSpacing: 0.9, color: SLATE, margin: 0
  });

  const baris = [
    ['Hilirisasi Nikel', ['Ya', 'Ya', 'Ya', 'Ya', 'Ya'], 'Sangat cocok'],
    ['Kemitraan Ojol', ['Ya', 'Ya', 'Ya', 'Sebagian', 'Ya'], 'Cocok'],
    ['Industri Rokok', ['Ya', 'Ya', 'Ya', 'Sebagian', 'Ya'], 'Cocok'],
    ['Impor Minyak', ['Tidak', 'Tidak', 'Sebagian', 'Tidak', 'Tidak'], 'Tidak cocok'],
    ['Chromebook', ['Tidak', 'Ya', 'Ya', 'Sebagian', 'Tidak'], 'Tidak cocok']
  ];
  const warna = { 'Ya': TEAL, 'Sebagian': AMBR, 'Tidak': 'AB463C' };
  baris.forEach((b, i) => {
    const y = 2.78 + i * 0.7;
    card(pres, s, M, y, CW, 0.6, W, { r: 0.1 });
    rect(pres, s, M, y, 0.14, 0.6, KAS[i]);
    s.addText(b[0], { isTextBox: true, x: M + 0.34, y, w: cw1 - 0.4, h: 0.6, valign: 'middle', fontFace: F, fontSize: 12, bold: true, color: INK, margin: 0 });
    b[1].forEach((v, j) => s.addText(v, {
      isTextBox: true, x: M + cw1 + j * cwn, y, w: cwn, h: 0.6, align: 'center', valign: 'middle',
      fontFace: F, fontSize: 10.5, bold: true, color: mix(warna[v], INK, 0.25), margin: 0
    }));
    s.addText(b[2], {
      isTextBox: true, x: M + cw1 + 5 * cwn, y, w: cwv - 0.24, h: 0.6, align: 'right', valign: 'middle',
      fontFace: F, fontSize: 11.5, bold: true, color: mix(KAS[i], INK, 0.2), margin: 0
    });
  });

  s.addText('Chromebook turun peringkat setelah vonis 30 Juni 2026, karena pertanyaan moralnya sudah dijawab pengadilan pada tingkat pertama.', {
    isTextBox: true, x: M, y: 6.42, w: CW, h: 0.32, fontFace: F, fontSize: 11, italic: true, color: SLATE, margin: 0
  });
  s.addNotes('Kalau harus memilih cepat, baris pertama adalah jawabannya.');
}

// ============================================================ 16 peta lensa
{
  const s = S([{ t: 'Alat Bantu', fill: LAV, color: INK }, { t: 'Sembilan Teori', outline: true }]);
  head(s, 'Peta Lensa per Kasus', 0.96);
  sub(s, 'Teori mana yang paling tajam untuk kasus mana, sebagai titik awal penyusunan analisis.', 1.62);

  const SPEC = ['AB463C', 'FF5A2D', 'F5B722', 'C6F04A', '0FA98E', '4EA8DE', '6C7BE0', 'B8A6F5', 'E86A9B'];
  const rows = [
    ['Egoism', 'Nikel: biaya iklim tidak masuk harga karena penanggungnya belum lahir'],
    ['Utilitarianism', 'Rokok: Rp 122 triliun cukai berhadapan dengan 70 juta perokok aktif'],
    ['Ethics of Duty', 'Nikel: apakah prinsipnya bertahan bila seluruh pemilik cadangan berbuat sama'],
    ['Ethics of Rights', 'Ojol: hak atas jaminan sosial dan hak berserikat versus hak atas fleksibilitas'],
    ['Justice', 'Rokok: penyumbang garis kemiskinan kedua. Nikel: beban di Sulteng dan Halmahera'],
    ['Virtue Ethics', 'Rokok: apa yang dilakukan pelaku usaha berkarakter baik atas produk ini'],
    ['Ethic of Care', 'Ojol: manajemen algoritmik menghapus relasi perusahaan dengan pengemudi'],
    ['Discourse Ethics', 'Nikel: apakah masyarakat adat Halmahera ikut dalam proses keputusan'],
    ['Postmodern', 'Ojol: mitra atau pekerja. Nikel: hilirisasi atau ekstraksi']
  ];
  rows.forEach((r, i) => {
    const y = 2.16 + i * 0.52;
    card(pres, s, M, y, CW, 0.44, W, { r: 0.08 });
    rect(pres, s, M, y, 0.13, 0.44, SPEC[i]);
    s.addText((i + 1) + '.  ' + r[0], { isTextBox: true, x: M + 0.32, y, w: 2.4, h: 0.44, valign: 'middle', fontFace: F, fontSize: 11.5, bold: true, color: INK, margin: 0 });
    s.addText(r[1], { isTextBox: true, x: M + 2.86, y, w: CW - 3.1, h: 0.44, valign: 'middle', fontFace: F, fontSize: 11, color: '2A3243', margin: 0 });
  });

  s.addText('Kolom kanan hanya titik masuk, bukan kesimpulan. Setiap teori tetap perlu dijalankan penuh pada kasus yang dipilih.', {
    isTextBox: true, x: M, y: 6.86, w: CW, h: 0.32, fontFace: F, fontSize: 11, italic: true, color: SLATE, margin: 0
  });
  s.addNotes('Nikel muncul di lima baris. Itu indikator bahwa kasusnya paling kaya.');
}

// ============================================================ 17 sumber
{
  const s = S([{ t: 'Rujukan', fill: AMBR, color: INK }, { t: 'Penelusuran Lanjutan', outline: true }], { corner: AMBR });
  head(s, 'Sumber Data', 0.96);
  sub(s, 'Data ditelusuri pada Agustus 2026. Periksa ulang bila presentasi mundur beberapa bulan.', 1.62);

  const sr = [
    [ORNG, 'Nikel', 'PT IMIP dan PT IWIP untuk investasi dan tenaga kerja\nBPS Sulawesi Tengah untuk nilai ekspor\nGreenpeace, AEER, dan Climate Action Tracker untuk PLTU captive\nGlobal Forest Watch dan Survival International untuk hutan\nNorges Bank Investment Management untuk keputusan divestasi Eramet'],
    [TEAL, 'Ojol', 'Peraturan Presiden Nomor 27 Tahun 2026\nKementerian Ketenagakerjaan untuk data penerima bonus hari raya\nSerikat Pekerja Angkutan Indonesia untuk kondisi lapangan\nLaporan tahunan GoTo dan Grab untuk jumlah mitra'],
    [AMBR, 'Rokok', 'Kementerian Keuangan untuk penerimaan cukai hasil tembakau\nSurvei Kesehatan Indonesia 2023 untuk prevalensi dan jumlah perokok\nBadan Pusat Statistik Maret 2025 untuk komposisi garis kemiskinan\nCISDI dan CHED ITB Ahmad Dahlan untuk analisis kebijakan cukai'],
    [INK, 'Dua Perkara Hukum', 'Rilis resmi Kejaksaan Agung untuk status perkara dan tersangka\nSalinan putusan Pengadilan Tipikor untuk perkara Chromebook\nPeriksa perkembangan banding sebelum kasus dipakai\nHindari mengutip angka kerugian yang masih disengketakan']
  ];
  sr.forEach((p, i) => tile(pres, s, {
    x: M + (i % 2) * (w2 + 0.28), y: 2.16 + Math.floor(i / 2) * 2.1, w: w2, h: 1.9,
    fill: p[0], t: p[1], ts: 15, b: p[2], bs: 10.5
  }));

  banner(pres, s, M, 6.34, CW, 0.44, 'Angka berasal dari pemberitaan dan laporan lembaga, bukan dari basis data resmi yang diakses langsung.', LIME, INK, 10.5);
  s.addNotes('Untuk keperluan akademis, sebaiknya turunkan sekali lagi ke publikasi resmi lembaganya, bukan berhenti pada pemberitaan.');
}

// ============================================================ 18 penutup
{
  const s = pres.addSlide();
  bg(s, INK);
  rect(pres, s, SW - 0.62, 0, 0.62, 0.58, LAV);
  rect(pres, s, 0, SH - 0.58, 0.58, 0.58, ORNG);
  wave(pres, s, 7.7, 2.4, 5.2, 0.46, '283044');
  page++;

  s.addText([
    { text: 'Tinggal Dipilih', options: { color: W } },
    { text: '.', options: { color: ORNG } }
  ], { isTextBox: true, x: M, y: 1.9, w: 11, h: 1.5, fontFace: F, fontSize: 58, bold: true, margin: 0, lineSpacing: 64 });

  s.addText('Tiga kasus pertama siap dijalankan dengan sembilan teori. Dua perkara hukum sebaiknya ditinggalkan, karena pertanyaan moralnya sudah tertutup.', {
    isTextBox: true, x: M, y: 3.62, w: 8.4, h: 0.9, fontFace: F, fontSize: 15, color: 'B9C0CE', margin: 0, lineSpacing: 24
  });
  KAS.forEach((c, i) => rect(pres, s, M + i * 0.42, 4.72, 0.3, 0.3, c));

  card(pres, s, M, 5.5, 4.5, 0.78, '1B2233');
  rect(pres, s, M, 5.56, 0.06, 0.66, ORNG);
  s.addText('Aslih Abnuri', { isTextBox: true, x: M + 0.28, y: 5.65, w: 4, h: 0.28, fontFace: F, fontSize: 13, bold: true, color: W, margin: 0 });
  s.addText('25/574338/PEK/31801', { isTextBox: true, x: M + 0.28, y: 5.92, w: 4, h: 0.26, fontFace: MONO, fontSize: 10.5, color: '8C93A3', margin: 0 });

  rect(pres, s, M, 6.62, CW, 0.011, '283044');
  s.addText('Business Ethics · Berkas Fakta Lima Kandidat Kasus', {
    isTextBox: true, x: M, y: 6.78, w: 6.4, h: 0.28, fontFace: F, fontSize: 10.5, bold: true, color: W, margin: 0
  });
  s.addText('Data ditelusuri Agustus 2026', {
    isTextBox: true, x: SW - M - 6.0, y: 6.78, w: 6.0, h: 0.28, align: 'right', fontFace: F, fontSize: 10.5, color: '8C93A3', margin: 0
  });
  s.addNotes('Setelah kasus dipilih, deck analisis lengkapnya bisa dibangun terpisah.');
}

report('deck 3');
pres.writeFile({ fileName: 'Deck-3-Berkas-Fakta-Kasus-Indonesia.pptx' })
  .then(f => console.log('selesai:', f, '·', page, 'slide'));
