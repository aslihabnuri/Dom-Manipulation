# NOMUVEMBER, banner toko marketplace (Ube Matcha Latte)

File: `nomuvember-ube-matcha-latte.jpg` (1:1, 2000 x 2000 px, JPG, 1,12 MB). Versi pertama di `archive-v1/`.

Revisi v2
- Es dan ube mengikuti bentuk di Referensi N: tumpukan bongkahan es kristal bening bersegi, es melayang, dan potongan
  ube bulat besar dengan sisi potongan menghadap kamera, melayang seperti buah di referensi (kiri atas, kanan,
  kiri bawah). Cipratan di bibir gelas dibuat lebih besar dan bervolume.
- UBE MATCHA LATTE dihapus. Hierarki: 25% > NOMUVEMBER SALE (tiga baris NOMU / VEMBER / SALE, MU di atas penanda lime)
  > Gratis ongkir / Voucher hingga 15rb > SHOP NOW.
- Ujung cipratan menembus ke depan dasar angka 25 untuk kedalaman, seperti di referensi.
- Ube kiri atas digeser agar tidak menyentuh angka; dua bongkah es melayang di kolom teks dihapus.
- Pouch asli ditempel ulang (registrasi SIFT skala 1,00, rotasi 0,28 derajat), cipratan di depannya dipertahankan.
- Tinggi angka terukur 439 px (21,95%). Kontras terburuk: logo 5,2:1, DISC UP TO 4,7:1, 25% 3,5:1,
  NOMUVEMBER SALE 6,7:1, penawaran 7,4:1, tombol 8,4:1 terhadap latar.
- Kredit kie.ai v2: 10 (satu image-to-image dengan Referensi N sebagai acuan gaya).

Kenapa 1:1, bukan 2:1
- Tinggi angka "25" di referensi himhim7_23 diukur per piksel: 237 px pada lebar 1080 px = 21,94% lebar gambar
  (gabungan angka 2 dan 5, baris y 185-421).
- Di 2000 px lebar artinya 439 px. Pada 2:1 (tinggi 1000 px) angka itu memakan 44% tinggi banner dan tidak
  menyisakan ruang produk; pada 1:1 proporsinya sama dengan referensi. Hasil render diukur ulang: 438 px (21,90%).

Hierarki dan copy
- 25% (ungu tua, 439 px) > UBE MATCHA LATTE > Gratis ongkir / Voucher hingga 15rb > SHOP NOW.
- Label kampanye NOMUVEMBER SALE di atas nama produk, huruf MU diberi sorotan lime.
- Headline Inggris (DISC UP TO, UBE MATCHA LATTE, SHOP NOW), body Indonesia santai (Gratis ongkir, Voucher hingga 15rb).
  Tanpa "Anda", "Kami", "saya". Font DEMO mengunci "+" dan "!", jadi penawaran ditulis dua baris.
- Dua blok teks: blok diskon di tengah atas, blok produk dan penawaran di kiri, produk di kanan.

Versi 2:3 (ukuran himhim7_23.jpg): `nomuvember-ube-matcha-latte-1080x1620.jpg` (1080 x 1620 px, JPG, 0,58 MB)
- Folder Drive acuan hanya berisi himhim7_23.jpg (1080 x 1620), jadi ukuran itu yang dipakai.
- Tata letak mengikuti himhim: logo, DISC UP TO, 25% di tengah atas; NOMUVEMBER SALE besar di tengah kiri (posisi
  "MADE FOR HIM"); Gratis ongkir / Voucher hingga 15rb dan SHOP NOW di kiri bawah; produk di kanan bawah.
- Scene v2 diskalakan 0,64 dan ditaruh di bawah; gradasi latar diperpanjang ke atas; ube kiri atas dipindah ke
  pojok atas kanvas baru agar tidak terpotong di tengah.
- Tinggi blok angka 237 px = 21,94% dari 1080 (sama dengan referensi).
- Di format ini angka 25% dibuat PUTIH: di atas gradasi gelap bagian atas, ungu tua hanya 2,2:1, putih 5,2:1.
  Kontras lain: logo 8,0:1, DISC UP TO 7,2:1, NOMUVEMBER SALE ungu tua 3,5:1 (teks besar), penawaran 7,2:1, tombol 8,1:1.
- Tanpa kredit kie.ai tambahan.

Keterbacaan (rasio kontras terburuk terhadap latar di bawah tiap blok, persentil 5/95)
- Logo putih 5,6:1; DISC UP TO putih 5,1:1; 25% ungu tua 3,2:1 (teks sangat besar, batas AA teks besar 3:1);
  NOMUVEMBER SALE 6,7:1; UBE MATCHA LATTE 7,1:1; penawaran 8,3:1; tombol 9,7:1 terhadap latar, teks putih 18:1.
- Teks putih di kolom kiri hanya 1,9-2,4:1, karena itu kolom kiri memakai ungu tua.

Visual dan kemasan
- Tone mengikuti Referensi N: monokrom satu keluarga warna (lilac/ube), latar gradasi mulus, kabut tipis, es serut di
  bawah, cipratan dari bibir gelas. Tata letak dan teks referensi tidak diikuti.
- Gelas Ube Matcha Latte digenerate (GPT Image 2, kie.ai). Kemasan memakai foto mockup asli
  `prod-new/Mockup nomukita-Premium series-Ube.png` (Drive).
- Supaya pouch tidak terlihat tempelan: pouch asli diletakkan di komposisi, lalu satu pass image-to-image menyatukan
  cahaya, rim light lilac, dan bayangan kontak di es. Karena AI ikut menggambar ulang pouch, pouch ASLI ditempel
  kembali (registrasi SIFT, skala 0,96, rotasi 0,3 derajat) dengan cahaya hasil AI ditransfer sebagai lapisan
  bayangan halus; semua teks, logo, dan warna kemasan berasal dari mockup asli. Gelas berada di depan pouch dan
  menutupi panel samping, sehingga yang terlihat adalah sisi depan.
- Irisan ube buram di kiri dihapus karena berada di kolom teks.

Kredit kie.ai: 49 (saldo 154,69 -> 105,69): 2 render scene 2K, 1 image-to-image 2K untuk penyatuan, 1 remove-background.
Skrip: `scripts/repouch.py` (tempel ulang pouch asli), `scripts/nov_banner.py` (tipografi dan ekspor <= 2 MB).
