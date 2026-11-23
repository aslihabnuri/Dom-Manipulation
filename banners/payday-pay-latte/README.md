# PAY LATTE, banner payday (Ube & Matcha Latte 250 g, Ube Matcha Latte)

File (versi 7, aktif)
- `pay-latte-payday-1080x1620.jpg` (2:3, 0,61 MB)
- `pay-latte-payday-1080x1080.jpg` (1:1, 0,41 MB)
- Versi sebelumnya: `archive-v6/` (latar hijau seperti referensi), `archive-v5/`, `archive-v4/`, `archive-v3/`, `archive-v2/`, `archive-v1/`.

Versi 7: latar bergaya referensi, warna bertema Matcha Ube Latte
- Komposisi latar sama dengan "Referensi Payday_Nomu.jpeg" (langit berkabut dengan cahaya lembut, bintang halus,
  vignette, bulan di kiri, planet besar di kanan bawah, planet kecil di kiri bawah), tetapi diwarnai ulang:
  langit gradasi ungu ube (atas) ke krem susu ke hijau matcha (bawah); bulan kiri = planet ungu ube bertekstur
  seperti daging ubi; planet kanan bawah = planet hijau matcha dengan alur susu seperti latte art; planet kecil
  = campuran ube-matcha. Prompt: `source/prompt_v7_background_ube_matcha.txt`.
- Objek depan (cup, pita, irisan ube, es, daun, podium, pouch 250 g asli) sama dengan v5/v6, ditempel utuh.
- Tipografi clean v5; LATTE kembali ungu ube (78,30,146) karena latar terang di belakang teks.

Pengukuran v7 (`scripts/v7/verify3.py`)
- Tinggi angka 35 = 237 px (21,94% lebar).
- Kontras terburuk (2:3 / 1:1): PAY 8,7 / 9,3; LATTE ungu 6,1 / 4,9; DISC UP TO 10,6 / 11,3; 35% 11,9 / 9,1;
  manfaat 11,8-14,8 / 10,0-14,0; tombol 14,1 / 12,4. Tidak ada objek foto di bawah teks.

Kredit kie.ai v7: 60 (6 latar 2K). Saldo key baru 8.280.

---
Catatan versi 6
Versi 6: latar sama dengan "Referensi Payday_Nomu.jpeg"
- Latar dibuat ulang dari referensi (GPT Image 2, `source/prompt_v6_background.txt`): langit luar angkasa hijau sage
  berkabut dengan cahaya terang di tengah, bintang halus, bulan abu-abu berkawah di kiri, planet mint besar di kanan
  bawah, planet kecil di kiri bawah. Semua objek referensi (buah, karakter, cup, teks, logo) dihapus.
- Objek depan versi 5 (cup, pita ube-matcha, irisan ube, es, daun, podium, pouch 250 g asli) dipotong dengan Recraft
  remove-background lalu ditempel di atas latar baru (`scripts/v6/comp.py`); pouch tidak digambar ulang.
  Sisa planet lilac dari latar lama ikut terpotong dan dihapus.
- Tipografi clean versi 5 dipakai apa adanya (satu garis rata kiri: logo, PAY LATTE, DISC UP TO, 35%, satu baris
  manfaat, SHOP NOW). Warna LATTE diganti ungu tua (52,14,108): ungu ube lama hanya 2,7:1 di latar hijau.

Pengukuran v6 (`scripts/v6/verify3.py`)
- Tinggi angka 35 = 237 px (21,94% lebar).
- Kontras terburuk (2:3 / 1:1): PAY 4,7 / 4,5; LATTE 3,7 / 3,8; DISC UP TO 5,5 / 5,4; 35% 6,1 / 5,6;
  Free ongkir 12,1 / 11,0; Voucher 15rb 6,9 / 6,3; tombol 10,2 / 10,3. Lebih rendah dari v5 karena latar hijau
  lebih gelap, tetapi semua di atas 3:1 untuk teks besar.

Kredit kie.ai v6: 42 (4 latar 2K + 2 remove-background). Saldo key baru 8.340.

---
Catatan versi 5
Versi 5: revisi
1. Tipografi lebih lega: PAYDAY SALE dihapus, PAY LATTE satu baris dan lebih kecil (96 / 88), manfaat jadi
   satu baris (ikon truk + Free ongkir, ikon tiket + Voucher 15rb), tombol lebih kecil. Urutan pada satu garis
   rata kiri: logo, PAY LATTE, DISC UP TO, 35%, manfaat, SHOP NOW. Ukuran huruf: label/body 34, judul, 35%, tombol 30.
   Angka 35 tetap 237 px (21,94% lebar) sesuai aturan referensi.
2. Pouch tidak lagi melayang: foto baru (GPT Image 2) dengan podium batu lilac; kedua pouch berdiri di atas
   podium dengan bayangan kontak.
3. PAYDAY SALE dihapus.
4. Warna ube dan matcha dipekatkan lewat prompt (ube ungu tua #6A2FB0-#8B4FD0, matcha hijau giok #4E9A2E-#6FB43A),
   latar juga sedikit lebih dalam (lilac di atas, mint di bawah).
- Pouch: AI menggambar pouch lebih tinggi daripada aslinya, jadi seluruh area pouch AI diganti latar (per baris,
  campuran warna kiri-kanan) lalu mockup ASLI 250 g ditempel selebar badan pouch AI, alas di garis podium yang sama,
  ukuran keduanya identik (`scripts/v5/paste250c.py`). Semua cetakan dari file asli.
- Foto digeser ke kiri (2:3: 90 px, 1:1: 60 px) supaya pita cipratan tidak menyentuh teks.

Pengukuran v5 (`scripts/v5/verify3.py`)
- Kontras terburuk 8,7:1 sampai 13,2:1; LATTE ungu 5,3:1 (2:3) dan 5,9:1 (1:1).
- Tidak ada objek foto di bawah teks maupun dalam jarak 20 px.

Kredit kie.ai v5: 60 (3 varian 2:3 + 3 varian 1:1). Saldo key baru 8.436.

---
Catatan versi 4
Versi 4: tipografi lebih clean + pouch 250 g
- Pouch: foto mockup ASLI 250 g (nomukita-ube-250g.png, nomukita-matcha latte japanese.png), sudah tampak depan,
  ditempel apa adanya tanpa digambar ulang AI. Ukuran keduanya sama (2:3: 376 x 314 px; 1:1: 331 x 276 px,
  termasuk tali). Bayangan bawaan mockup dibuang, diganti bayangan melayang lembut seperti referensi.
- Pouch hitam 1000 g dikeluarkan dari foto v3 (`scripts/v4/plate.py`): kotaknya diisi gradasi langit
  dari sisi yang bersih, bukan AI. Planet di belakang kolom teks juga dihapus agar teks berdiri di latar polos.
  Foto digeser ke kiri (2:3: 80 px, 1:1: 100 px) supaya pita cipratan tidak menyentuh judul.
- Tipografi:
  - SATU garis rata kiri untuk semua teks (2:3: x 462; 1:1: x 456). Versi 3 rata kanan sehingga tepi kiri
    tiap baris bergerigi.
  - Tiga kelompok dengan jarak yang sama: [PAYDAY SALE / PAY LATTE] - [DISC UP TO / 35%] - [Free ongkir,
    Voucher 15rb / SHOP NOW]. Pouch di bawahnya.
  - Hanya empat ukuran: label kapital 36 (PAYDAY SALE, DISC UP TO, sama persis), judul, angka 35%, body 38.
  - 2:3 judul dua baris (PAY / LATTE), 1:1 satu baris.
- Copy sama: PAYDAY SALE, PAY LATTE, DISC UP TO 35%, Free ongkir, Voucher 15rb, SHOP NOW.

Pengukuran v4 (`scripts/v4/verify3.py`)
- Tinggi angka 35 = 237 px (21,94% lebar) di kedua ukuran.
- Kontras terburuk 10,2:1 sampai 13,5:1; LATTE ungu 6,6-6,7:1.
- Tidak ada pita, planet, atau objek di bawah teks (yang terdeteksi di dekat LATTE hanya bintik bintang).

Kredit kie.ai v4: 0 (memakai foto v3).

---
Catatan versi 3
Versi 3: gaya "Referensi Payday_Nomu.jpeg"
- Langit luar angkasa pastel dengan planet lembut, pita cairan yang melilit keluar dari produk, bahan melayang.
  Warna diganti ke palet Nomukita: lilac di atas, mint pucat di bawah.
- Cup Ube Matcha Latte besar di kiri bawah; dari cup keluar pita ube (ungu) dan matcha (hijau) yang saling
  melilit, dengan irisan ube, es batu, daun teh, dan bubuk matcha melayang di sekitarnya.
- Dua pouch 1000 g di kanan bawah, menghadap depan, UKURAN SAMA (2:3: 412 x 640 px; 1:1: 398 x 618 px pada foto 2K),
  rasio = panel depan mockup asli. Cetakan berasal dari mockup Drive yang diluruskan
  (`../v2/front_*.png`, lihat `scripts/v2/rectify.py`), ditempel di atas pouch AI (`scripts/v3/paste_real.py`).
- Tipografi satu kolom rata kanan seperti masthead referensi: PAY / LATTE (LATTE ungu), PAYDAY SALE,
  DISC UP TO, 35%, ikon truk + Free ongkir, ikon tiket + Voucher 15rb, tombol SHOP NOW. Logo kiri atas.
  Copy sama dengan versi sebelumnya.

Pengukuran v3 (`scripts/v3/verify3.py`)
- Tinggi angka 35 = 237 px (21,94% lebar) di kedua ukuran.
- Kontras terburuk 2:3: 9,5:1 sampai 12,6:1, LATTE ungu 6,4:1. 1:1: 10,8:1 sampai 13,2:1, LATTE ungu 6,6:1.
- Tidak ada objek foto di bawah teks (tombol di 1:1 berada di atas latar gradien, jarak ke pouch sekitar 45 px).

Kredit kie.ai v3: 90 (3 varian 2:3 + 3 varian 1:1 + 3 varian 1:1 ulang). Saldo key baru 8.496.

---
Catatan versi 2
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
