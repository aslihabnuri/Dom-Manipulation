# Nomukita 10.10 promo banner (revisi 5, final)

File utama
- `nomukita-1010-feed-1080x1350.jpg/png` : feed / marketplace 4:5, plus `nomukita-1010-feed-2K.jpg`
- `nomukita-1010-toko-2000x1000.png`, `nomukita-1010-toko-1200x600.jpg` : banner toko 2:1
- `nomukita-1010-feed-ALT-lift-1080x1350.jpg` : alternatif feed (tangan mengangkat gelas)
- `raw_visual_*_no_text.jpg` : foto AI tanpa teks, untuk revisi layout tanpa generate ulang
- `compose3.py` (+ helper `compose.py`, `compose2.py`) : seluruh teks dirender dari file font asli

Visual
- Scene digenerate TANPA pouch (GPT Image 2, 2K, via kie.ai) dengan referensi gaya banner BIRU: backdrop putih,
  pedestal kubus putih, matahari keras dari kiri atas, bayangan tajam. Gelas kaca tebal berembun, sedotan kaca,
  mangkuk keramik abu dengan bubuk ube dan chashaku bambu. Prompt lengkap di `prompt_feed.txt`, `prompt_toko.txt`.
- Pouch adalah file mockup asli `nomukita-ube-250g.png`, dikomposit dengan `pouch_comp.py`: relight arah cahaya,
  bayangan jatuh ke kanan bawah mengikuti matahari, contact shadow, mangkuk dikembalikan ke depan pouch.
- `raw_scene_*_no_pouch.jpg` : scene polos; `raw_visual_*_with_pouch_no_text.jpg` : scene + pouch tanpa teks.

Tipografi (struktur referensi BIRU: logo kecil, headline dua baris, satu subline)
1. Logo nomukita kecil di pojok kiri atas, lebar 170 px
2. Headline dua baris, All Round Gothic Bold 128 px (feed) / 96 px (toko), deep violet, sentence case:
   "10.10 Sale." / "Disc up to 45%."  (4 dan % digambar vektor)
3. Subline Comfortaa Regular 30 px, abu gelap: "gratis ongkir & voucher hingga 15rb, semua produk."
   Pill dan label SEMUA PRODUK dilebur ke subline ini. Skrip: `compose4.py`.
- Sedotan kaca dipendekkan secara digital agar tidak menabrak headline (`raw_visual_feed_with_pouch_no_text.jpg`).

Warna
- Teks deep violet (58,40,104), label charcoal (28,28,28)

Catatan produksi
- Font All Round Gothic di Drive masih DEMO: karakter 4, %, dan - terkunci. Angka 4 dan % digambar vektor
  dengan tebal stroke 0.135 em. Beli lisensi resmi sebelum produksi massal.
- Periode promo belum dicantumkan karena belum ditentukan.
