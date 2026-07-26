# Brief gambar gelas + prop bahan — slide 1, varian 1000 gram

Slide 1000 gram sekarang hanya berisi pouch, terlalu polos. Rencananya mengikuti
referensi `Refrensi/Referensi Matchamu`: pouch di kiri, gelas berisi minuman di
kanan agak turun dan sedikit di depan pouch, plus satu prop bahan sesuai nama
produk di kiri bawah.

**Status:** gelas dan referensi bahan sudah tersedia di Drive `Nomukita/Refrensi`.
Gelasnya diisi minuman secara programatik oleh `glass.py`, jadi tidak perlu
generate 12 foto gelas — cukup satu gelas kosong, isinya diganti per produk.
Referensi bahan tinggal di-key dari checkerboard-nya.

## Komposisi (sudah dikunci, diukur dari referensi Matchamu)

Di referensi, tinggi gelas 0.617× tinggi pouch, dasar gelas 40/681 lebih rendah
dari dasar pouch, dan keduanya bertumpuk 15/336 lebar pouch. Proporsi itu
dipertahankan pada kanvas 1024 × 1024:

| elemen | posisi | ukuran |
|---|---|---|
| pouch 1000 gram | x 274–580, dasar y 829 | tinggi 440 |
| gelas | x 566–749, dasar y 855 | **183 × 271** |
| prop bahan | x 96–254, dasar y 855 | **158 × 120** |

Gelas menutup sebagian sisi kanan bawah pouch — itu disengaja, memberi kedalaman.

## Spesifikasi teknis (berlaku untuk semua file)

- PNG **latar transparan**. Kalau tidak bisa, latar rata bone white (241, 240, 235)
  — nanti saya key out.
- Resolusi minimal 3× ukuran tabel di atas (gelas ≥ 550 × 815 px) supaya tajam
  setelah diperkecil.
- **Tanpa teks, tanpa logo, tanpa watermark** apa pun di dalam gambar.
- Soft studio light dari kiri atas, bayangan lembut, Japanese minimalism.
- Sudut pandang setinggi mata produk (eye level), sama untuk 12 produk.
- **Gelas yang sama persis untuk 12 produk** — hanya isinya yang berganti. Ini yang
  menjaga carousel terbaca satu set.
- Tanpa sedotan, tanpa hiasan berlebihan, tanpa tetesan air di meja.

## Gelasnya

Satu jenis untuk semua: gelas kaca bening tanpa kaki (stemless), badan melengkung
sedikit membesar ke atas seperti pada referensi Matchamu, dinding tipis, bening
sempurna. Isi minuman sampai sekitar 85% tinggi gelas.

## Prompt per produk

Awali setiap prompt dengan:
`clear stemless curved glass tumbler, thin wall, filled 85%, soft studio light from
upper left, bone white seamless background, japanese minimalism, product
photography, eye level, no text, no logo —`

| produk | isi gelas | prop bahan (file terpisah) |
|---|---|---|
| Matcha Latte | iced matcha latte berlapis, susu putih di bawah, hijau matcha di atas | bubuk matcha di piring kecil + chasen bambu |
| Premix Matcha | matcha murni, hijau pekat, buih halus tipis di permukaan | bubuk matcha menggunung + sendok kayu |
| Teh Tarik | teh tarik cokelat susu, buih tebal di permukaan | daun teh kering di kain linen |
| Chocolate Signature | cokelat panas kental, warna cokelat gelap, buih tipis | potongan cokelat pekat + biji kakao |
| Cookies & Cream | milkshake krem dengan remah biskuit cokelat, whipped cream di atas | biskuit cokelat isi krim, satu utuh satu patah |
| Charcoal | charcoal latte abu gelap bergradasi ke susu di bawah | bubuk charcoal hitam di mangkuk keramik kecil |
| Avocado | jus alpukat hijau lembut, garis cokelat di dinding gelas | **alpukat utuh + satu belah dengan biji** |
| Vanilla | vanilla latte krem pucat, buih halus | batang vanilla + bunga vanilla kecil |
| Milk Tea | milk tea cokelat susu, warna rata | daun teh kering + sedikit susu di kendi kecil |
| Lemon Tea | iced lemon tea kuning keemasan, es batu, irisan lemon | irisan lemon segar + satu lemon utuh |
| Frappe Base | frappe es blender putih krem, whipped cream tebal | es batu bening bertumpuk |
| Lemon Grass | minuman lemongrass kuning kehijauan bening, hangat | batang serai diikat |

## Setelah file diterima

Taruh di Drive `Nomukita/Cup` (atau folder baru), beri nama
`glass-<produk>.png` dan `prop-<produk>.png`. Sebutkan ke saya, lalu komposit
12 slide 1000 gram dijalankan sekali dan hasilnya masuk ke `slide-1/`.

Slide 250 gram dan kombinasi tidak ikut berubah — keduanya sudah penuh.
