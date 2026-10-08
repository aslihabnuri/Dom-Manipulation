# Nomukita 10.10 promo banner (revisi 4, final)

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

Hierarki tipografi (kanvas 1080x1350)
1. 45% : All Round Gothic Bold 345 px, elemen terbesar
2. 10.10 : All Round Gothic Bold 190 px
3. DISC UP TO, SEMUA PRODUK : All Round Gothic Demi 34 px, tracking 9
4. GRATIS ONGKIR, VOUCHER HINGGA 15RB : pill tinggi 86 px, teks Demi 32 px

Warna
- Teks deep violet (58,40,104), label charcoal (28,28,28)
- Pill Ube Purple (104,85,158) disampel dari tetes ungu pouch, teks bone white (241,240,235)
- Veil gradien bone white tipis di atas dan bawah foto untuk keterbacaan teks

Catatan produksi
- Font All Round Gothic di Drive masih DEMO: karakter 4, %, dan - terkunci. Angka 4 dan % digambar vektor
  dengan tebal stroke 0.135 em. Beli lisensi resmi sebelum produksi massal.
- Periode promo belum dicantumkan karena belum ditentukan.
