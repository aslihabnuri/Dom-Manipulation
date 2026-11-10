# UBELIEVABLE 11.11, banner toko (Ube Matcha Latte, Ube & Matcha Latte 250 g)

File: `ubelievable-1111-ube-matcha-latte-1080x1620.jpg` (1080 x 1620 px, sama dengan NOMUVEMBER / himhim7_23, JPG 0,65 MB)

Copy
- Header: UBELIEVABLE 11.11 (plesetan "unbelievable": bunyi "un-be" = "u-be"). Huruf UBE diberi warna ungu ube agar
  permainan katanya terbaca; 11.11 di baris kedua sebagai lockup.
- Promo: DISC UP TO 45%, Gratis ongkir, Voucher 15rb, SHOP NOW. Tanpa "Anda/Kami/saya".
- Hierarki: 45% > UBELIEVABLE 11.11 > penawaran > CTA.
- Angka 45: tinggi blok 237 px = 21,94% lebar (aturan dari himhim7_23), diukur ulang pada piksel hasil render.
  Font DEMO mengunci "4" dan "%", jadi keduanya digambar sebagai vektor (vector_45pct dari banner 10.10).

Revisi v3: teks besar dan terbaca di aplikasi (scripts/compose_1111_v3.py)
- Patokan: banner 1080 px tampil sekitar 360-400 pt di Shopee/TikTok (kira-kira 1/3). Teks terkecil dibuat >= 38 px
  (setara sekitar 12 pt di layar). Tinggi huruf kapital: header 75 px, DISC UP TO 30 px, body 28 px, tombol 25 px.
- Header UBELIEVABLE 11.11 satu baris selebar banner (font 115, sebelumnya 58); DISC UP TO 46 (sebelumnya 24);
  Gratis ongkir / Voucher 15rb 42 (sebelumnya 28); tombol SHOP NOW tinggi 84 px.
- Urutan atas ke bawah pada satu sumbu kiri: logo, header, DISC UP TO, 45% (237 px = 21,94%), manfaat, tombol.
- Agar muat, scene diperkecil ke 80% dan digeser ke kanan bawah; strip kiri bawah diisi AI (outpaint, 10 kredit),
  lalu scene asli ditempel kembali di atasnya sehingga pouch dan tulisannya tidak berubah.
- Kontras terburuk: UBE 5,7:1, LIEVABLE 11.11 9,9:1, DISC UP TO 10,3:1, 45% 11,0:1, body 11,5:1, tombol 12,5:1.
- Versi sebelumnya di archive-clean-v1/. Sisa saldo kie.ai 55,69.

Revisi: tipografi clean (scripts/compose_1111_clean.py)
- Satu sumbu rata kiri (x=58) untuk semua teks; sebelumnya campuran rata tengah (atas) dan rata kiri (tengah).
- Dua kelompok saja: penawaran (logo, DISC UP TO, 45%, UBELIEVABLE 11.11) di atas, manfaat + tombol di atas garis air.
- UBELIEVABLE 11.11 jadi satu baris dengan satu ukuran (58) alih-alih dua baris dua ukuran; hanya UBE yang berwarna.
- Empat ukuran teks: 45% (237 px = 21,94%), headline 58, body 28, label/tombol 24. Versi sebelumnya di archive-cup-v1/.
- Kontras terburuk: 45% 12,1:1, UBE 4,8:1, LIEVABLE 11.11 12,7:1, body 12,8:1. Tanpa kredit tambahan.

Revisi: botol diganti cup
- Minuman memakai cup plastik bening seperti banner NOMUVEMBER (lapisan ube, susu dengan es, matcha, cipratan mahkota
  ungu-putih). Edit image-to-image dari scene lama dengan crop cup NOMUVEMBER sebagai acuan; pouch dan teks pouch dicek
  ulang dan tetap sesuai mockup. Versi botol disimpan di `archive-bottle/`.
- Scene digeser turun 95 px dan UBELIEVABLE diperkecil (90 -> 84) supaya bibir cup tidak menyentuh teks.
  Angka 45 tetap 237 px (21,94%). Kredit tambahan: 10 (sisa saldo 65,69).

Visual
- Gaya Referensi "Premium Apple Juice Label Design _ Liva Packaging": produk menembus garis air, objek di bawah air
  dipenuhi gelembung kecil, latar terang lembut. Padanan Nomukita: latar krem-lavender, umbi ube utuh dan terbelah,
  daun teh segar, botol kaca Ube Matcha Latte (ungu, susu, matcha) dan dua pouch 250 g di bawah air.
- Atas izin, kemasan digambar ulang oleh AI (GPT Image 2 image-to-image) dengan mockup asli sebagai acuan:
  nomukita-ube-250g.png dan nomukita-matcha latte japanese.png. Semua tulisan dicek pada resolusi penuh:
  飲む, nomukita, Premium, ウベ / 抹茶ラテ, Ube / Matcha Latte, 250 gram — sesuai mockup.
- Scene digeser turun 45 px (atas diisi warna latar polos) supaya tutup botol tidak menyentuh angka 45%.

Keterbacaan (kontras terburuk terhadap latar): logo/DISC UP TO 12,7:1, 45% 12,8:1, UBE ungu 5,1:1,
LIEVABLE 13,6:1, 11.11 13,2:1, penawaran 13,3:1, tombol 13,5:1 (teks putih di tombol 18:1).

Kredit kie.ai: 20 (dua varian scene 2K; varian A dipakai, varian B di source/).
