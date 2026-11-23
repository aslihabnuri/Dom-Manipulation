# PAY LATTE, banner payday (Ube & Matcha Latte 1000 g, Ube Matcha Latte)

File
- `pay-latte-payday-1080x1620.jpg` (2:3, 0,51 MB)
- `pay-latte-payday-1080x1080.jpg` (1:1, 0,34 MB)

Copy
- Header: PAY LATTE (plesetan PayLater; "LATTE" berwarna ungu). Label kecil PAYDAY SALE di samping logo supaya jelas ini
  promo gajian, bukan cicilan.
- DISC UP TO 35%, Free ongkir (ikon truk), Voucher 15rb (ikon tiket), tombol SHOP NOW.
- Ikon digambar sebagai vektor datar di skrip (bukan emoji, bukan AI). Angka 3 dan 5 dari font, % vektor.
- Semua teks rata kiri pada satu sumbu; teks terkecil 38 px. Tinggi angka 35 = 237 px (21,94% lebar) di kedua ukuran.

Visual
- Gaya "Referensi UBE.jpeg": tas jaring katun krem tergantung di latar lilac polos, cahaya lembut dari kiri atas.
  Isi tas: dua pouch 1000 g, cup Ube Matcha Latte bertutup kubah dengan sedotan hitam (tanpa logo), ube utuh dan
  terbelah, daun teh.
- Kemasan = file mockup ASLI dari Drive (folder prod-new): `Mockup nomukita-Premium series-Ube.png` dan
  `Mockup nomukita-Exclusive series-matcha latte.png`. AI menggambar scene dengan kedua mockup sebagai acuan
  (`source/scene-ai-raw.jpg`), lalu mockup asli ditempel di atas pouch versi AI (`scripts/repouch_1000.py`):
  skala seragam tanpa distorsi, semua cetakan (logo, ウベ / 抹茶ラテ, Ube / Matcha Latte, 1000 gram, panel samping)
  berasal dari file asli. Sedotan, tutup cup, ube, dan daun tetap di depan pouch. Di bawah garis ube pouch
  dilanjutkan oleh versi AI (bagian yang memang tertutup).
- Scene diperkecil (0,88 untuk 2:3; 0,66 untuk 1:1) dan ditaruh di kanan bawah tanpa AI (`scripts/build_bg.py`):
  latar lilac dilanjutkan dengan tekstur aslinya, tali tas diperpanjang lurus sampai tepi atas.
- Percobaan pertama dengan pouch putih 250 g (`source/scene-250g-unused.jpg`) tidak dipakai.

Keterbacaan (kontras terburuk terhadap latar di bawah tiap blok, `scripts/verify.py`)
- 2:3: label 8,1:1, PAY 7,8:1, LATTE ungu 4,7:1, DISC UP TO 8,0:1, 35% 8,4:1, manfaat 8,9:1, tombol 8,7:1.
- 1:1: label 8,1:1, PAY 8,6:1, LATTE ungu 5,2:1, DISC UP TO 8,9:1, 35% 8,5:1, manfaat 8,0:1, tombol 7,6:1.
- Tidak ada objek foto di bawah blok teks (0%).

Kredit kie.ai: 20 (scene pouch 250 g yang tidak dipakai + scene pouch 1000 g). Saldo akhir 13,69.
