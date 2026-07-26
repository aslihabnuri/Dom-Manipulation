# Slide 1, varian 1000 gram — gelas berisi minuman + prop bahan

Susunan mengikuti `Refrensi/Referensi Matchamu`: pouch di tengah, gelas berisi
minuman di kanan, prop bahan di kiri, ketiganya dipusatkan sebagai satu grup.

## Produksi

Gambar minuman dan prop digenerate lewat kie.ai `google/nano-banana-edit`
(image-to-image), lalu dikomposit dengan `photo.py`. Acuan gelas dikirim di
setiap job supaya 12 produk memakai gelas yang sama; kalau digenerate dari teks,
12 gelasnya beda bentuk dan carousel-nya pecah.

- `batch.py` — generate. Melewati file yang sudah ada, jadi menjalankan ulang
  tidak membakar kredit untuk hal yang sudah berhasil. Sekitar 4 kredit/gambar.
- `build_all.py` — komposit 12 slide dan verifikasi tiap hasilnya.
- `verify.py` — pemeriksaan mekanis, dijalankan pada setiap slide.

Butuh `KIE_API_KEY` dari environment. Semua trafik lewat curl: proxy menolak
urllib dengan 403, baik di host upload maupun di CDN hasil.

## Pemetaan referensi

| produk | minuman | prop |
|---|---|---|
| Matcha Latte | Matcha_Referensi | Matcha Powder |
| Premix Matcha | Matcha_Referensi | Matcha Powder |
| Teh Tarik | **tanpa acuan** | Black tea *(aturan: pengganti alpukat)* |
| Chocolate Signature | Chocolate | Chocolate chunks |
| Cookies & Cream | **file rusak** | cookies and cream |
| Charcoal | Charcoal | Charcoal_Aestetic |
| Avocado | Avocado Mint Green Smoothie | Avocado |
| Vanilla | **tanpa acuan** | Referensi Vanilla |
| Milk Tea | Milk Tea | Black tea *(aturan: pengganti alpukat)* |
| Lemon Tea | Lemon tea | lemon |
| Frappe Base | Frappe Base | — *(aturan: minuman saja)* |
| Lemon Grass | Lemon grass | Lemon Grass |

`Cream & Cookies_referensi.png` berukuran 1152 × 2048 tapi kosong total — alpha 0
di seluruh piksel. Minuman Cookies & Cream, Teh Tarik, dan Vanilla digenerate
dari gelas acuan plus deskripsi tertulis, tanpa acuan visual minumannya.

## Ukuran di slide (1024 × 1024)

| elemen | tinggi | dasar |
|---|---|---|
| pouch 1000 gram | 440 | y 829 |
| gelas | 330 | y 855 |
| prop bahan | 200 | y 855 |

## Yang harus dijaga di `photo.py`

Empat hal ini masing-masing pernah merusak hasil:

- **Estimasi latar** dikalibrasi ke putih sweep di sekeliling subjek. Frame hasil
  generate ber-vignette — sweep di belakang gelas ~240 sementara tepi frame 213 —
  jadi pembagian per piksel meledakkan kaca abu 186 menjadi 250 dan highlight
  mentok putih.
- **Mask subjek diisi per baris.** Mask tepi itu berongga untuk gelas; isinya
  bocor lewat mulut gelas sehingga `fill_holes` hanya mengisi 19% dan sisanya
  tercetak sebagai goresan vertikal di minuman.
- **Kotak gelas diukur terhadap lebar median, bukan lebar maksimum.** Bayangan
  yang melebar di dasar jauh lebih lebar dari gelasnya; dengan patokan maksimum,
  bibir gelas Matcha Latte terbaca di y 808 alih-alih 240 dan gelasnya membesar
  empat kali. Kalau proporsinya tetap meleset >12% dari rasio gelas 0.472,
  bibirnya dibangun ulang dari dasar — itu yang menyelamatkan Charcoal, yang
  bagian atas minumannya menyatu dengan sweep.
- **Subjek di-alpha-composite, bukan dikalikan.** Layer rasio itu perkalian; di
  atas pouch hitam alpukat ikut menggelap sampai terbaca seperti di belakang
  pouch. Perkalian tetap dipakai di luar subjek, karena bayangan memang butuh itu.

## Pemeriksaan tiap slide (`verify.py`)

Ukuran 1024 × 1024; keempat tepi persis bone white (2 px ke dalam diberi toleransi
2 level, karena bayangan lembut memang sampai situ); kotak logo (362, 52, 662, 88);
posisi katakana, headline, dan sub-line; **logo Halal wajib ada** — dideteksi lewat
warna ungunya, bukan sembarang tinta, karena bayangan gelas masuk ke sudut itu;
dan deteksi bercak putih pecah yang dulu ditimbulkan frame ber-vignette.

12 dari 12 lolos.
