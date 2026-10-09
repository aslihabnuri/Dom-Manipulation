# Nomukita 10.10 promo banner (revisi 11, final): tiga produk, packaging asli, minuman layered

File utama
- `nomukita-1010-feed-1080x1350.jpg/png` : feed / marketplace 4:5, plus `nomukita-1010-feed-2K.jpg`
- `nomukita-1010-toko-2000x1000.png`, `nomukita-1010-toko-1200x600.jpg` : banner toko 2:1
- `nomukita-1010-feed-ALT-lift-1080x1350.jpg` : alternatif feed (tangan mengangkat gelas)
- `raw_visual_*_no_text.jpg` : foto AI tanpa teks, untuk revisi layout tanpa generate ulang
- `compose3.py` (+ helper `compose.py`, `compose2.py`) : seluruh teks dirender dari file font asli

Visual
- Feed dan story: scene baru (GPT Image 2, 2K) dengan tiga minuman layered masa kini di cup takeaway: Ube Matcha
  (ube ungu, susu, foam matcha), Charcoal (charcoal hitam, susu, vanilla cream foam, debu cocoa), Matcha Ube (matcha,
  susu, swirl ube cream). Prompt di `prompt_feed.txt`. Toko masih memakai scene minuman lama (`prompt_toko.txt`),
  render baru untuk toko butuh 10 kredit.
- Semua format memakai tiga mockup pouch ASLI 250 gram (bukan render AI), dikomposit dengan `pouch_comp2.py`
  ke scene cup. Kunci agar menapak, hasil mempelajari scene dan referensi: (1) bayangan pouch diproyeksikan ke arah
  yang sama dengan bayangan cup di scene ini, yaitu ke kiri dan ke belakang (naik di layar), tepi tajam, kegelapan
  dikalibrasi ke bayangan cup (sekitar 70 persen putih permukaan); (2) pouch berdiri tepat di belakang cup sehingga
  cup dan sedotan menutupi bagian bawah pouch (oklusi = petunjuk kedalaman terkuat); (3) putih pouch disamakan dengan
  putih scene secara global, keystone perspektif kamera dari atas, grain, dan penggelapan dasar; (4) pouch berdiri tepat di belakang cup tanpa
  bersinggungan dengan tutup transparan (seperti referensi, objek tidak saling tumpang tindih); cup dikembalikan
  sebagai siluet pejal bila ada tumpang tindih, dengan zona tutup transparan memakai multiply blend.
- `raw_visual_feed_no_text.jpg`, `raw_visual_toko_no_text.jpg` : scene + pouch tanpa teks.
- `nomukita-1010-story-1080x1920.jpg` : versi 9:16 (rasio referensi), teks disusun ulang untuk kanvas story.

Tipografi (struktur referensi BIRU: logo kecil, headline dua baris, satu subline)
1. Logo nomukita kecil di pojok kiri atas, lebar 170 px
2. Headline dua baris, All Round Gothic Bold 114 px (feed) / 96 px (toko), charcoal (tiga produk, bukan ube saja), sentence case:
   "10.10 Sale." / "Disc up to 45%."  (4 dan % digambar vektor)
3. Subline Comfortaa Regular 30 px, abu gelap: "gratis ongkir & voucher hingga 15rb, semua produk."
   Pill dan label SEMUA PRODUK dilebur ke subline ini. Skrip: `compose4.py`.

Warna
- Headline charcoal (28,28,28), subline abu (70,70,68)

Catatan produksi
- Font All Round Gothic di Drive masih DEMO: karakter 4, %, dan - terkunci. Angka 4 dan % digambar vektor
  dengan tebal stroke 0.135 em. Beli lisensi resmi sebelum produksi massal.
- Periode promo belum dicantumkan karena belum ditentukan.
