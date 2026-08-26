# Toni Black — Product Knowledge

14 slide, 16:9, isinya diambil dari **toni.black**. Ada `.pptx` (bisa diedit) dan
`.pdf` (siap kirim, teksnya masih bisa diseleksi, font brand ikut tertanam).

## Isi

| # | Slide | Isi |
|---|---|---|
| 01 | Cover | Engineered for Every Body |
| 02 | Brand | Tailored essentials, aturan black-first, 5 market |
| 03 | Numbers | 91% Modal · 9% Elastane · S–3XL · 1 warna, Fit Lab, First Pair Guarantee |
| 04 | Fabric | ModalCloud™ — komposisi, moisture, dipakai di produk apa saja |
| 05 | Build | ModalCloud™, FlowLite™, Soft Elastic Waistband |
| 06 | Range | 5 style pria, kain, potongan, harga satuan |
| 07 | Packs & Kids | Harga multipack + lini anak |
| 08 | Fit Lab | Dua input, satu jawaban |
| 09 | Sizing | Tiga langkah cara customer menemukan ukurannya |
| 10 | Waistband | Lima poin dari halaman Technology |
| 11 | Use | Work, workout, rest |
| 12 | Markets | Lima market Asia-Pacific |
| 13 | Channels | toni.black, Shopee, TikTok Shop, BLACKLIST, sosial |
| 14 | Care | Cuci, retur, First Pair Guarantee |

## Sumber data

Semua angka dan klaim diambil langsung dari toni.black — halaman produk,
`/pages/technology`, `/pages/sizing-guide`, `/pages/about-us`,
`/collections/mens-underwear`, `/collections/boys`. Tidak ada angka karangan.

Harga yang dipakai harga list Indonesia. Komposisi kain (Modal 91% / Elastane 9%
untuk ModalCloud™, Viscose 91% / Elastane 9% untuk FlowLite™) dikutip apa adanya
dari halaman produk.

## Soal layout dan warna

Layout-nya mengikuti deck referensi yang Anda kirim, slide per slide: hero dengan
gambar besar dan blok warna, baris empat angka, tiga kartu bernomor, gambar tinggi
diapit dua kartu, banner full-bleed dengan tiga kartu di bawahnya, grid channel,
dan seterusnya.

**Warnanya tidak diikuti.** Referensinya biru terang; brand guideline Toni Black
hanya punya Dark Charcoal `#282828`, Clean White `#FFFFFF`, Davi's Grey `#4F5052`,
Grey `#818284`, Steel Grey `#CCCCCC`. Dua instruksi itu berbenturan di warna, dan
brand guideline yang menang. Yang diambil dari referensi adalah struktur dan bahasa
bentuknya, bukan paletnya. Fontnya juga font brand: Zalando Sans Expanded untuk
display, Arimo untuk teks.

## Bentuk gambar

Gambar di deck ini bukan kotak atau bulat biasa. PowerPoint sendiri cuma punya
persegi, persegi-rounded, dan elips, jadi tiap gambar dipotong dulu di
`shapes.py` dan disimpan sebagai PNG beralpha:

- **notch** — persegi rounded dengan gigitan cekung di satu sudut (cover, slide 11)
- **arch** — bagian atas jadi setengah lingkaran penuh (slide 04, 10)
- **asym** — radius besar di satu diagonal, rapat di diagonal lain (slide 02, 07, 08)
- **soft** — persegi rounded biasa, untuk baris kartu yang harus seragam

Mask-nya digambar 4× lalu diperkecil; itu yang bikin lengkungnya bersih.

Fotonya memakai plate hitam-putih dari kampanye September, jadi talent-nya sama
dengan set banner yang sudah ada.

## Pemeriksaan

Empat pemeriksaan dijalankan pada file `.pptx` yang jadi, bukan pada mock-up:

| Script | Yang diperiksa |
|---|---|
| `qa_geometry.py` | Tiap teks dibungkus ulang memakai metrik font aslinya, lalu tingginya dicek terhadap kotaknya; kata yang lebih lebar dari kotaknya ditandai; tumpang-tindih antar teks dan teks di atas gambar |
| `qa_tables.py` | Tabel dirender setinggi `rowH × jumlah baris`, bukan setinggi nilai tersimpan (yang cuma placeholder 1,00 inci) |
| `qa_contrast.py` | Kontras WCAG tiap potong teks terhadap warna yang benar-benar ada di belakangnya |
| `qa_pdf.py` | Tiap potong teks di `.pptx` harus muncul di `.pdf`, halaman per halaman |

Hasil akhir: 14 slide, nol masalah geometri, 187 potong teks semuanya lolos WCAG AA,
tabel bersih, seluruh teks tembus ke PDF.

Beberapa cacat yang ketangkap dan sudah diperbaiki:

- **Teks abu-abu di bawah standar.** `#818284` cuma 3,44:1 di atas kartu abu muda dan
  3,85:1 di atas putih — dua-duanya gagal AA untuk teks kecil. Label kanan atas malah
  1,61:1, nyaris tidak terbaca. Sekarang aturannya satu: alas terang pakai Davi's Grey,
  alas gelap pakai Steel Grey.
- **Tag "CONSTRUCTION" jebol dari pill-nya.** Lebar pill diambil dari hasil pengukuran
  font, tapi string yang masuk lewat variabel tidak ikut terukur dan jatuh ke tebakan
  1,2 inci. Pemeriksanya sendiri juga melewatkan ini karena mengabaikan letter-spacing.
  Dua-duanya diperbaiki; sekarang seluruh string literal diukur.
- **Regex pemasangan kutip yang salah.** Saat mengukur string pendek saja, kutip penutup
  string panjang berpasangan dengan kutip pembuka string berikutnya, jadi pasangannya
  meleset dan sebagian string tidak terukur diam-diam. Sekarang literal-nya ditokenisasi
  penuh dulu, baru difilter.
- **Teks isi mengambang di tengah kotaknya.** pptxgenjs menyetel anchor ke tengah secara
  default, jadi paragraf di kotak tinggi tidak mulai dari `y`-nya. Sekarang teks isi
  selalu rata atas.
- **Body copy nabrak foto di cover.** Ketangkap setelah `qa_geometry.py` diperluas untuk
  membandingkan teks dengan gambar, bukan cuma teks dengan teks.

## Regenerate

```bash
cd source
npm install                 # pptxgenjs
python3 shapes.py           # tidak wajib — make_images.py memanggilnya
python3 make_images.py      # potong ulang gambar dari plate September
python3 measure.py          # ukur lebar pill dan tag dari font aslinya
node build_pk.js
python3 qa_geometry.py  ToniBlack_Product_Knowledge.pptx
python3 qa_tables.py    ToniBlack_Product_Knowledge.pptx
python3 qa_contrast.py  ToniBlack_Product_Knowledge.pptx
python3 pdf_export.py   ToniBlack_Product_Knowledge.pptx ToniBlack_Product_Knowledge.pdf
python3 qa_pdf.py       ToniBlack_Product_Knowledge.pptx ToniBlack_Product_Knowledge.pdf
```

Font dan plate fotonya dibaca dari `../../september-nine-to-nine/source/`, jadi
tidak ada file yang digandakan. `source/img/` sengaja tidak ikut disimpan — isinya
hasil generate dan sudah tertanam di dalam `.pptx`.

## Sebelum membuka: pasang fontnya

Deck ini memakai **Zalando Sans Expanded** dan **Arimo**. Kalau belum terpasang,
PowerPoint akan menggantinya dan tata letaknya meleset. File font-nya ada di
`toni-black/september-nine-to-nine/source/fonts`. PDF-nya tidak butuh ini — fontnya
sudah tertanam di dalam file.
