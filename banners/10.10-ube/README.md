# Nomukita 10.10 promo banner (revisi 8, final): tiga produk

File utama
- `nomukita-1010-feed-1080x1350.jpg/png` : feed / marketplace 4:5, plus `nomukita-1010-feed-2K.jpg`
- `nomukita-1010-toko-2000x1000.png`, `nomukita-1010-toko-1200x600.jpg` : banner toko 2:1
- `nomukita-1010-feed-ALT-lift-1080x1350.jpg` : alternatif feed (tangan mengangkat gelas)
- `raw_visual_*_no_text.jpg` : foto AI tanpa teks, untuk revisi layout tanpa generate ulang
- `compose3.py` (+ helper `compose.py`, `compose2.py`) : seluruh teks dirender dari file font asli

Visual
- Scene digenerate dengan GPT Image 2 (2K, kie.ai) meniru referensi BIRU: backdrop off-white bertekstur, kubus putih
  dilihat dari sudut depan, cahaya keras dari kanan atas, tiga cup takeaway transparan bertutup dengan sedotan hitam
  (Ube, Charcoal, Matcha Latte) tersusun diagonal. Prompt lengkap di `prompt_feed.txt`, `prompt_toko.txt`.
- Feed dan story: pouch dirender DI DALAM set oleh GPT Image 2 (edit image-to-image atas scene cup, dengan tiga
  mockup asli sebagai referensi ketat), sehingga cahaya, perspektif dan bayangan satu kesatuan dengan cup.
  Prompt di `prompt_feed_pouch_edit.txt`. Cetakan pouch diverifikasi pada zoom penuh.
- Toko: pouch mockup asli dikomposit dengan `pouch_comp2.py` (tone match ke putih scene, keystone, grain,
  ambient occlusion, bayangan ke kiri bawah). Render in-scene untuk toko butuh 10 kredit tambahan.
- `raw_visual_feed_in_scene_no_text.jpg` : scene feed final tanpa teks; `raw_visual_toko_composited_no_text.jpg` : scene toko tanpa teks.
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
