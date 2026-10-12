# Nomukita CHILL SALE, banner promo marketplace (Matcha, Ube, Charcoal)

File utama (versi aktif)
- `nomukita-chill-sale-3x4-1200x1600.jpg/png` : master, poster tegak
- `nomukita-chill-sale-1x1-1200x1200.jpg/png` : slot foto produk marketplace
- `nomukita-chill-sale-2x1-2000x1000.png`, `-2x1-1200x600.jpg` : banner toko
- Arsip: `archive-no-promo/` (tanpa promo), `archive-promo-busy/` (promo, tipografi ramai),
  `archive-promo-plain/` (promo clean tanpa ornamen)

Versi aktif: ornamen segar + sistem tipografi tenang
- Headline promo CHILL SALE (chill = dingin dan santai, sale = sinyal promo), bukan nama minuman.
- Semua teks penawaran dalam satu tumpukan rata kiri di bawah headline: DISC UP TO 25%, lalu satu baris
  GRATIS ONGKIR • VOUCHER HINGGA 15RB (Demi). Tombol SHOP NOW rata tengah di bawah produk.
- Tiga tingkat ukuran saja: headline, angka 25%, huruf kapital kecil. Ornamen tidak pernah menyentuh teks.
- Ornamen: gelombang susu horizontal di belakang trio, bubuk matcha, daun teh, es batu, irisan ube di sudut.

Revisi clean (diarsipkan di archive-promo-plain)
- Semua dekorasi dihapus (cipratan susu, bubuk matcha, daun teh, es batu, irisan ube) dan subjudul
  BRING THE CAFE HOME dihapus. Dari sekitar 20 elemen tinggal 12.
- Susunan pita horizontal: logo dan headline, pita penawaran (DISC UP TO 25% kiri, dua pill kanan),
  tiga minuman (ube di tengah dan di depan, matcha kiri, charcoal kanan, miring 5 derajat),
  tiga pouch tepat di bawah minumannya masing-masing, tombol SHOP NOW rata tengah.
- Satu-satunya tumpang tindih yang disengaja: pouch di depan dasar gelasnya, sebagai pasangan produk dan hasil.
- Grain diturunkan dari 9,5 ke 7.

Struktur yang diambil dari referensi (versi kolase)
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
- Semua posisi ada di `layouts.py` (aktif: T4 = 3:4, U2 = 1:1, X2 = 2:1; clean polos: C2, S5, W7; promo ramai: P3, S4, W6; tanpa promo: V6, S3, W3). Jalankan `python3 poster.py V6 out`.
- Path di skrip mengarah ke scratchpad sesi; sesuaikan `ROOT` bila dijalankan di tempat lain.

Kredit kie.ai: 33 (3 render GPT Image 2 2K + 3 remove-background).
