# Nomukita ICED LATTE, banner marketplace (gaya poster "SMOOTHIE")

File utama (versi promo)
- `nomukita-iced-latte-promo-3x4-1200x1600.jpg/png` : master, poster tegak (rasio terdekat dengan referensi)
- `nomukita-iced-latte-promo-1x1-1200x1200.jpg/png` : slot foto produk marketplace
- `nomukita-iced-latte-promo-2x1-2000x1000.png`, `-promo-2x1-1200x600.jpg` : banner toko
- `archive-no-promo/` : versi pertama tanpa promo

Struktur yang diambil dari referensi
- Headline putih raksasa satu baris, subjudul kecil rata kanan di bawahnya, teks melengkung mengikuti gelas
  depan, CTA dua baris di kiri bawah. Semua teks putih.
- Dua sampai tiga gelas miring berlawanan arah dalam diagonal kiri atas ke kanan bawah, gelas depan paling besar.
- Cipratan susu mengalir di belakang gelas.
- Irisan bahan besar terpotong tepi kanvas membingkai komposisi; satu irisan kecil menimpa headline untuk kedalaman.
- Latar gradasi jenuh dengan grain. Referensi pink ke oranye ke hijau; versi ini ungu ube ke biru ke hijau
  matcha (interpolasi OKLab agar tidak keruh), jalur dingin supaya terasa segar.

Copy (versi promo)
- Headline: ICED LATTE
- Sub: BRING THE CAFE HOME (tagline brand dari design system)
- Penawaran: DISC UP TO 25% (angka besar, % digambar vektor), pill VOUCHER HINGGA 15RB dan GRATIS ONGKIR
- Tombol: SHOP NOW dengan panah vektor, posisi CTA referensi di kiri bawah
- Teks melengkung MATCHA • UBE • CHARCOAL dihapus di versi promo karena ruangnya dipakai blok penawaran;
  nama varian tetap terbaca di label pouch.
- Hierarki: ICED LATTE > 25% > benefit > SHOP NOW.
- Font All Round Gothic Bold (DEMO: 4, %, titik tengah, & terkunci; % dan titik digambar vektor).

Visual
- Tiga minuman dirender dalam SATU foto (GPT Image 2, 2K, via kie.ai) agar gelas, cahaya, dan embunnya seragam:
  Iced Matcha Latte (foam matcha), Iced Ube Latte (foam ube), Iced Charcoal Latte (vanilla cold foam).
- Dua lembar bahan: cipratan susu, es batu, bubuk matcha, daun teh, irisan ube bulat, ube terbelah.
- Latar dipotong dengan Recraft remove-background. Kaca di dasar gelas dikoreksi agar memperlihatkan latar poster,
  bukan latar studio. Semu kuning pada es charcoal dinetralkan.
- Tiga pouch adalah mockup ASLI 250 gram (matcha latte, ube, charcoal), ditumpuk seperti kipas dengan label tiap
  varian terlihat.
- Prompt di `source/`, potongan aset di `parts/`.

Mengubah layout tanpa kredit
- Semua posisi ada di `layouts.py` (promo: P3 = 3:4, S4 = 1:1, W6 = 2:1; tanpa promo: V6, S3, W3). Jalankan `python3 poster.py V6 out`.
- Path di skrip mengarah ke scratchpad sesi; sesuaikan `ROOT` bila dijalankan di tempat lain.

Kredit kie.ai: 33 (3 render GPT Image 2 2K + 3 remove-background).
