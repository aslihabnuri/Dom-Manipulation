# Nomukita 10.10 promo banner (revisi 2)

Dua arah visual, keduanya dibangun dari layout yang sama.

A. `nomukita-1010-A-deep-*` : studio deep violet, cahaya key dari kiri atas, kabut bubuk ube. Rekomendasi utama.
B. `nomukita-1010-B-sun-*`  : cahaya matahari berbayang daun di dinding dan linen, lanjutan bahasa visual banner 8.8.

Format
- `*-feed-1080x1350.jpg/png` : feed / marketplace 4:5 (master), plus `*-feed-2K.jpg`
- `*-toko-2000x1000.png`, `*-toko-1200x600.jpg` : banner toko 2:1
- `raw_visual_*_no_text.jpg` : visual AI tanpa teks (kie.ai nano-banana-2, 2K) untuk revisi layout
- `compose2.py` (+ `archive-v1/compose.py` untuk helper) : semua teks dirender dari file font asli

Hierarki copy
1. 10.10 : All Round Gothic Bold 300 px (feed) / 270 px (toko), header utama
2. DISC UP TO | 45% | SEMUA PRODUK : lockup satu baris, label Demi 27 px tracking 6, angka Bold 150 px
3. GRATIS ONGKIR, VOUCHER HINGGA 15RB : pill tinggi 82 px, teks Demi 30 px tracking 5

Warna
- A: teks bone white (241,240,235), label lavender (214,206,232), pill bone white dengan teks deep violet (58,40,104)
- B: teks deep violet (58,40,104), label charcoal, pill Ube Purple (104,85,158) dengan teks bone white
- Ube Purple disampel dari tetes ungu pada pouch

Catatan produksi
- Font All Round Gothic masih DEMO: karakter 4, %, dan - terkunci. Angka 4 dan % digambar vektor
  dengan tebal stroke 0.135 em. Beli lisensi resmi sebelum produksi massal.
- Logo ditempel dari file asli (lebar 300 px, y=52, rata tengah pada feed). Versi putih untuk arah A.
- Periode promo belum dicantumkan karena belum ditentukan.
- Teks UBE DAY dihapus: ube hanya subjek visual, promo berlaku semua produk.
