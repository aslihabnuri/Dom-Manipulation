# Brief gambar minuman + prop bahan — slide 1, varian 1000 gram

Slide 1000 gram terbaca terlalu polos kalau hanya berisi pouch. Susunannya
mengikuti `Refrensi/Referensi Matchamu`: pouch di kiri, gelas berisi minuman di
kanan agak turun dan sedikit di depan pouch, prop bahan di kiri bawah.

## Status: gambarnya harus digenerate di luar

Mengisi gelas secara programatik (`glass.py`) sudah dicoba dan **hasilnya tidak
dipakai**. Metodenya benar secara optik — gelas diperlakukan sebagai layer rasio
sehingga bibir, refraksi, highlight, dan bayangannya kembali utuh — tapi cairan
yang dilukis dengan kode tidak akan pernah terlihat seperti foto. Tidak ada tekstur
buih, tidak ada partikel, tidak ada pantulan cairan ke dinding kaca.

Sesi Claude ini tidak punya tool image generation, jadi gambarnya harus dibuat di
luar. `glass.py` tetap disimpan sebagai catatan metode, bukan sebagai jalur produksi.

## Yang perlu digenerate

Dua file per produk, total 24. Gunakan **image-to-image** dengan
`Refrensi/Referensi_Gelas.jpeg` sebagai acuan gelas — ini yang menjaga 12 produk
memakai gelas yang sama persis. Prop bahan sudah ada referensinya untuk 9 produk
di folder yang sama.

| file | isi | ukuran render minimal |
|---|---|---|
| `glass-<produk>.png` | gelas acuan, terisi minuman produk | 900 × 2100 |
| `prop-<produk>.png` | bahan sesuai nama produk | 1200 × 1300 |

## Ukuran akhir di slide (kanvas 1024 × 1024)

Proporsi diambil dari referensi Matchamu: tinggi gelas 0.617× tinggi pouch, dasar
gelas sedikit lebih rendah dari dasar pouch, keduanya bertumpuk tipis. Setelah
dinaikkan sesuai revisi:

| elemen | tinggi | dasar | catatan |
|---|---|---|---|
| pouch 1000 gram | 440 | y 829 | |
| gelas | 330 | y 855 | menutup tipis sisi kanan pouch |
| prop bahan | 200 | y 855 | menutup tipis sisi kiri pouch |

Ketiganya dihitung sebagai satu grup lalu dipusatkan bersama di x 512. Render
minimal 3× ukuran ini supaya tetap tajam setelah diperkecil.

## Spesifikasi teknis (semua file)

- PNG **latar transparan**. Kalau tidak bisa, latar rata bone white (241, 240, 235).
- **Tanpa teks, tanpa logo, tanpa watermark** di dalam gambar.
- Soft studio light dari kiri atas — arah yang sama dengan mockup pouch.
- Eye level, sama untuk 12 produk.
- Tanpa sedotan, tanpa tetesan air di meja, tanpa properti tambahan.
- Gelas terisi sekitar 85% tinggi.

## Prompt per produk

Awalan untuk semua gelas:

> using the reference glass exactly as-is, same shape and proportions, filled 85%
> with —, soft studio light from upper left, seamless off-white background,
> japanese minimalism, product photography, eye level, no text, no logo

| produk | isi gelas | prop bahan |
|---|---|---|
| Matcha Latte | iced matcha latte berlapis, susu putih di bawah, hijau matcha pekat di atas, batas lapisan lembut | bubuk matcha + chasen bambu *(ada referensi)* |
| Premix Matcha | matcha murni hijau pekat, buih halus tipis di permukaan | bubuk matcha menggunung *(ada referensi)* |
| Teh Tarik | teh tarik cokelat susu, buih tebal khas tarikan di permukaan | **belum ada referensi** |
| Chocolate Signature | cokelat kental, warna cokelat gelap, buih tipis | potongan cokelat + biji kakao *(ada referensi)* |
| Cookies & Cream | milkshake krem dengan remah biskuit cokelat tersebar, whipped cream tebal | biskuit cokelat isi krim *(ada referensi)* |
| Charcoal | charcoal latte abu gelap bergradasi ke susu di bawah | bubuk charcoal *(ada referensi)* |
| Avocado | **jus alpukat cokelat**: sirup cokelat meleleh di dinding dalam gelas, alpukat hijau krem, cokelat mengendap di dasar | alpukat utuh + belah berbiji *(ada referensi)* |
| Vanilla | vanilla latte krem pucat, buih halus | batang + bunga vanilla *(ada referensi)* |
| Milk Tea | milk tea cokelat susu, warna rata | **belum ada referensi** |
| Lemon Tea | iced lemon tea kuning keemasan, es batu, irisan lemon | irisan lemon *(ada referensi)* |
| Frappe Base | frappe blender putih krem, whipped cream tebal | **belum ada referensi** |
| Lemon Grass | minuman serai kuning kehijauan bening | batang serai *(ada referensi)* |

## Setelah file diterima

Taruh di Drive dengan nama sesuai tabel, lalu sebutkan ke saya. Komposit 12 slide
1000 gram dijalankan sekali; posisi dan ukurannya sudah terkunci di
`render_one.py`. Mulai dari satu produk dulu untuk validasi sebelum 11 sisanya.

Slide 250 gram dan kombinasi tidak ikut berubah — keduanya sudah penuh.
