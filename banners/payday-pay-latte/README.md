# PAY LATTE, banner payday (Ube & Matcha Latte 1000 g, Ube Matcha Latte)

File (versi 2, aktif)
- `pay-latte-payday-1080x1620.jpg` (2:3, 0,52 MB)
- `pay-latte-payday-1080x1080.jpg` (1:1, 0,34 MB)
- Versi pertama (pouch miring, teks menumpuk di kiri atas, cup kecil) ada di `archive-v1/`.

Versi 2: apa yang diubah
- Pouch menghadap DEPAN. Di Drive tidak ada foto 1000 g tampak depan (semua file memakai mockup miring yang sama),
  jadi panel depan mockup asli diluruskan dengan transformasi perspektif (`scripts/v2/rectify.py`): cetakannya tetap
  piksel dari file asli, panel samping dibuang.
- Kedua pouch berukuran SAMA PERSIS: 486 x 730 px pada foto 1536 x 2304 (rasio 0,666 = rasio panel depan mockup).
  Varian AI pertama menggambar Matcha Latte lebih lebar dari Ube; sekarang dua panel depan asli ditempel dengan skala
  seragam yang sama (`scripts/v2/repouch2.py`). Cup, tutup kubah, sedotan, ube, dan daun tetap di depan pouch.
  Di balik tutup kubah yang bening dan di bawah garis ube, yang terlihat adalah pouch versi AI.
- Minuman jadi tokoh utama: cup Ube Matcha Latte besar di depan kanan, terlihat langsung (tidak di balik jaring).
- Struktur poster, teks tidak lagi menumpuk di satu sudut:
  - 2:3: judul PAY LATTE kiri atas, logo + PAYDAY SALE kanan atas, tas di tengah, lalu pita bawah:
    DISC UP TO 35% di kiri, Free ongkir / Voucher 15rb / SHOP NOW di kanan.
  - 1:1: judul + 35% kiri atas, tas kanan bawah, Free ongkir / Voucher 15rb / SHOP NOW kiri bawah.
- Tas ditaruh dan diperbesar tanpa AI (`scripts/v2/place_scene.py`): latar lilac dan tali tas dilanjutkan dari foto.

Alur foto v2
1. `source/v2-scene-ai-raw.jpg`: scene AI (GPT Image 2) dengan panel depan asli sebagai acuan.
2. `source/v2-guide-real-pouches.jpg`: dua panel depan asli ditempel dengan ukuran sama.
3. `source/v2-harmonized-ai.jpg`: AI merapikan sambungan, tutup kubah, dan area di kanan pouch.
4. `source/v2-scene-final-real-print.jpg`: cetakan asli ditempel ulang dengan skala seragam.

Pengukuran v2 (`scripts/v2/verify2.py`)
- Tinggi angka 35 = 237 px (21,94% lebar) di kedua ukuran.
- Kontras terburuk 2:3: PAY 7,7:1, LATTE 4,9:1, PAYDAY SALE 5,9:1, DISC UP TO 6,7:1, 35% 6,1:1, manfaat 4,7:1, tombol 4,7:1
  terhadap latar (teks putih di tombol 18:1). Pita bawah lebih rendah karena latar foto lebih gelap di bawah.
- Kontras terburuk 1:1: 7,0:1 sampai 8,0:1 untuk semua teks, LATTE 4,7:1.
- Tidak ada objek foto di bawah teks maupun dalam jarak 24 px dari blok teks.

Kredit kie.ai v2: 50 (3 varian scene + 2 varian perapian), dari key baru. Saldo key baru 8.586.

---
Catatan versi 1
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
