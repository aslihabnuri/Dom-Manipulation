# Toni Black — 9 to 9 (Set Kampanye September)

Bukan satu key visual, tapi **satu sistem**: satu talent, satu grid tipografi,
tiga momen berbeda dalam satu hari. Ide dasarnya mengubah 9.9 dari angka tanggal
jadi klaim produk — nyaman dari jam sembilan pagi sampai jam sembilan malam.

## Set

| Jam | Momen | Kunci tonal | Tinta |
|---|---|---|---|
| **09:00** | Kamar tidur, memakai kemeja. *"The first thing you put on."* | High key, L=215 | Charcoal |
| **18:00** | Ruang loker, selesai latihan. *"Nine hours in. A workout later."* | Low key, L=28 | Putih |
| **21:00** | Pulang ke rumah, kemeja di tangan. *"Twelve hours in the same pair."* | Low key | Putih |
| **9.9** | Lapisan promo di atas frame 21:00 | Low key | Putih |

Terang ke gelap mengikuti perjalanan harinya, jadi variasi tonalnya bekerja
sebagai cerita, bukan sekadar biar tidak membosankan.

Tiap momen tersedia 16:9 dan 2:1, masing-masing `@2x` (3840px) dan 1x (1920px).

## Sistem layout

Keluhan sebelumnya benar: teks cuma menempel di sudut atas dan bawah, tengahnya
kosong. Grid sekarang mengisi **tiga zona vertikal** di kolom kiri, plus satu
elemen di kanan:

| Posisi | Isi |
|---|---|
| Kiri atas | Logo |
| Kanan atas | Jam momen ini |
| **Kiri tengah** | Headline `9 to 9` + kalimat penjelas |
| Kiri bawah | CTA |

**Headline dikunci ke garis waistband.** Rel horizontal blok tengah tidak
ditentukan dengan perasaan — posisinya diukur dari foto: tepi atas celana
dideteksi lewat gradien vertikal, lalu headline diletakkan tepat di ketinggian
itu. Karena tiap foto berbeda (47.0%, 48.5%, 52.5%), tiap banner dapat posisi
sendiri, tapi aturannya satu. Hasilnya tipografi terasa dikomposisi bersama
fotonya, bukan ditempel di atasnya — dan garis besar tipografinya menunjuk
langsung ke produk.

**Tinta mengikuti terang foto.** Frame terang dapat tipografi charcoal dengan CTA
pil gelap; frame gelap dapat tipografi putih dengan CTA pil putih. Keduanya
diizinkan guideline: *"white on black, or black on white"*.

## Kepatuhan brand guideline

Diaudit dengan mengukur pixel di delapan komposisi.

| Item | Hasil |
|---|---|
| Warna | **Semua selisih 0** ke token brand di seluruh set |
| Kontras terburuk se-set | **9.2:1** — di atas ambang AAA (7:1) |
| Foto | Chroma **0.00–0.01**, hitam-putih murni |
| Tepi frame | Bersih, tanpa band hitam |

Tipografi memakai Zalando Sans Expanded (headline, jam, CTA) dan Arimo (kalimat
penjelas). Logo versi charcoal atau putih sesuai latar, solid, tanpa efek.

Pencahayaan tiap frame mengikuti *Imagery Style*: satu sumber keras, kontras
tajam, latar minimalis, model *"natural confidence, not overly posed"*.

### Catatan terbuka: product focus

Guideline menulis "The product is the main focus". Dalam framing full-figure ini
garmen mengisi sekitar 2% frame. Ini konsekuensi sadar: figur utuh dibutuhkan
supaya momennya terbaca sebagai cerita, dan sudut-sudut gelap dibutuhkan supaya
tipografi bisa menyebar. Detail produk ditangani banner Product Value dengan
treatment makro, sesuai rekomendasi awal.

## Produksi

Tiga plate digenerate dengan Nano Banana 2 via kie.ai, 16:9 resolusi 4K.

Konsistensi talent dijaga dengan mengirim frame 21:00 sebagai image input pada
dua generate berikutnya, disertai instruksi eksplisit bahwa wajah, rambut,
postur dan wardrobe harus identik. Semua plate lalu didesaturasi ke greyscale
murni. Tidak ada teks yang digenerate AI.

Format keluaran JPEG kualitas 95 4:4:4 untuk master, bukan PNG — untuk banner
fotografis ini visually lossless dan seperempat ukurannya.

Untuk regenerate:

```bash
cd source && python3 build.py     # butuh playwright + chromium
```

`marks.json` menyimpan titik waistband dan pusat figur hasil pengukuran tiap
plate. Kalau foto diganti, jalankan ulang deteksinya agar rel tipografinya ikut
menyesuaikan.
