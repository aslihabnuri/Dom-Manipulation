# Nomukita ICED LATTE, banner marketplace (gaya poster "SMOOTHIE")

File utama
- `nomukita-iced-latte-3x4-1200x1600.jpg/png` : master, poster tegak (rasio terdekat dengan referensi)
- `nomukita-iced-latte-1x1-1200x1200.jpg/png` : slot foto produk marketplace
- `nomukita-iced-latte-2x1-2000x1000.png`, `-2x1-1200x600.jpg` : banner toko

Struktur yang diambil dari referensi
- Headline putih raksasa satu baris, subjudul kecil rata kanan di bawahnya, teks melengkung mengikuti gelas
  depan, CTA dua baris di kiri bawah. Semua teks putih.
- Dua sampai tiga gelas miring berlawanan arah dalam diagonal kiri atas ke kanan bawah, gelas depan paling besar.
- Cipratan susu mengalir di belakang gelas.
- Irisan bahan besar terpotong tepi kanvas membingkai komposisi; satu irisan kecil menimpa headline untuk kedalaman.
- Latar gradasi jenuh dengan grain. Referensi pink ke oranye ke hijau; versi ini ungu ube ke biru ke hijau
  matcha (interpolasi OKLab agar tidak keruh), jalur dingin supaya terasa segar.

Copy
- Headline: ICED LATTE
- Sub: BRING THE CAFE HOME (tagline brand dari design system)
- Teks melengkung: MATCHA • UBE • CHARCOAL
- CTA: TINGGAL SEDUH, / LANGSUNG SEGAR
- Font All Round Gothic Bold (DEMO: titik tengah dan & terkunci, digambar vektor).

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
- Semua posisi ada di `layouts.py` (V6 = 3:4, S3 = 1:1, W3 = 2:1). Jalankan `python3 poster.py V6 out`.
- Path di skrip mengarah ke scratchpad sesi; sesuaikan `ROOT` bila dijalankan di tempat lain.

Kredit kie.ai: 33 (3 render GPT Image 2 2K + 3 remove-background).
