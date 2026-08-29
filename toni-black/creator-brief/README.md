# Toni Black — Content Creator Brief

14 slide, 16:9. Headline bahasa Inggris, isi Bahasa Indonesia, mengikuti Writing
Style Toni Black: kalimat aktif, langsung ke inti, tanpa jualan keras.
Ada `.pptx` dan `.pdf` (teks masih bisa diseleksi, font brand tertanam).

## Isi

| # | Slide | Isi |
|---|---|---|
| — | Cover | Content Creator Brief |
| 01 | Intro | Untuk apa brief ini, dan apa yang kami cari |
| 02 | The Customer | Siapa yang kita ajak bicara |
| 03 | The Problem | Dua kegagalan: ukuran berhenti di large, bahan sintetis murah |
| 04 | The Product | Modal, 4-way stretch, ukuran 60–150 kg |
| 05 | The Benefits | Breathable, lightweight, 4-way stretch, comfort first |
| 06 | The Objections | Dua keberatan dan cara menjawabnya |
| 07 | The Demonstrations | Tiga shot: waistband, close-up kain, momen gerak |
| 08 | The Hooks | Enam hook, apa adanya dari brief |
| 09 | Content Ideas | Lima ide TikTok |
| 10 | The Proof | Cara memberi review yang spesifik |
| 11 | The Call to Action | CTA lembut, tanpa hard sell |
| 12 | Deliverables | 30–45 detik, 9:16, satu revisi, usage 6 bulan |
| — | Thank You | Penutup |

## Soal desain

Mengikuti deck referensi yang Anda kirim: **tipografi langsung di atas foto**,
tanpa panel atau kotak sama sekali. Yang ada di deck ini cuma foto full-bleed,
teks, garis rambut, dan lingkaran nomor halaman.

Versi pertama sempat memakai layout foto-separuh dengan panel gelap di sebelahnya
untuk menaruh teks. Itu salah baca referensi dan sudah dibongkar total.

Warna tetap brand guideline: Dark Charcoal `#282828`, Clean White `#FFFFFF`,
Davi's Grey `#4F5052`, Grey `#818284`, Steel Grey `#CCCCCC`. Font Zalando Sans
Expanded (display, huruf besar berjarak lebar) dan Arimo (isi).

### Kenapa teks di atas foto tetap terbaca

Scrim gelapnya **dibakar langsung ke pikselnya** di `plates.py`, bukan ditumpuk
sebagai kotak semi-transparan di PowerPoint. Tiap slide punya scrim sendiri di
sisi yang benar-benar ditempati teks — kanan, kiri, atas, atau bawah. Karena
gelapnya sudah menyatu di file gambar, kontrasnya pasti dan bisa diukur.

`qa_photo_text.py` membuka gambar yang tertanam di `.pptx`, memotong bagian yang
tepat berada di belakang tiap potong teks, lalu menghitung kontras WCAG-nya.
Hasil akhir: **172 potong teks di atas foto, semuanya lolos AA.**

## Gambar

Sembilan foto dibuat lewat kie.ai (nano-banana-2, 2K) — **108 dari 150 kredit**
yang Anda berikan:

`fabric` (makro kain), `waistband` + `waistband2` (pinggang di atas celana),
`creator` (creator merekam diri), `commute` (jalanan Jakarta), `stretch` (kain
diregangkan), `drawer` (laci berisi lipatan), `heat` (gerah dan lembap),
`fold` (produk terlipat).

Sisanya memakai plate kampanye September, jadi talent-nya konsisten. Semua
dipaksa jadi hitam-putih murni (chroma 0.00) supaya sama dengan set yang sudah ada.

Percobaan pertama `waistband` gagal — pinggangnya sama sekali tidak terlihat,
padahal itu inti shot-nya. Diulang dengan prompt yang jauh lebih eksplisit.

## Pemeriksaan

| Script | Yang diperiksa |
|---|---|
| `qa_geometry.py` | Tiap teks dibungkus ulang dengan metrik font aslinya, tingginya dicek terhadap kotaknya, kata yang lebih lebar dari kotaknya ditandai, dan tumpang-tindih antar teks dicek |
| `qa_contrast.py` | Kontras WCAG untuk teks di atas warna solid |
| `qa_photo_text.py` | Kontras WCAG untuk teks di atas foto, diukur dari piksel aslinya |
| `qa_pdf.py` | Tiap potong teks di `.pptx` harus muncul di `.pdf`, halaman per halaman |

Hasil akhir bersih di keempatnya.

Cacat yang ketangkap dan sudah diperbaiki:

- **Headline "THE PRODUCT" hilang dari PDF.** Helper `block()` dipanggil tanpa
  lebar, jadi pptxgenjs memakai default 10 inci — kotaknya melar keluar halaman
  dan teks rata-kanannya terpotong. Helper-nya sekarang menolak dipanggil tanpa
  lebar, jadi tidak bisa terulang diam-diam.
- **Pemeriksa kontras foto sempat salah arah.** Untuk teks abu-abu tengah, dia
  cuma mengecek satu sisi (paling terang *atau* paling gelap). Abu-abu tengah
  kehilangan kontras di dua arah, jadi sekarang dua-duanya dihitung dan yang
  terburuk yang dipakai.
- **Kanvas di pemeriksa masih 13,3 inci** padahal LAYOUT_WIDE sebenarnya 13,333.
  Akibatnya elemen yang sebenarnya aman ikut ditandai. Sekarang ukurannya dibaca
  dari file, tidak diasumsikan.
- **Teks abu-abu `#818284` di bawah standar** — 3,83:1 di atas charcoal, gagal AA
  untuk teks kecil. Palet brand tidak punya abu tengah yang lolos, jadi teks
  fungsional pakai Steel Grey; Grey tinggal untuk garis.
- **Footer dan nomor halaman melewati batas aman**, dan caption tile terakhir
  keluar margin kanan.
- **PDF 16,5 MB.** Frame-nya PNG lossless padahal isinya foto. Diganti JPEG
  kualitas 90 tanpa subsampling: **turun ke 4,3 MB**, tanpa beda yang terlihat.

## Regenerate

```bash
cd source
npm install
python3 make_frames.py     # potong + bakar scrim
node build_brief.js
python3 qa_geometry.py   ToniBlack_Creator_Brief.pptx
python3 qa_contrast.py   ToniBlack_Creator_Brief.pptx
python3 qa_photo_text.py ToniBlack_Creator_Brief.pptx
python3 pdf_export.py    ToniBlack_Creator_Brief.pptx ToniBlack_Creator_Brief.pdf
python3 qa_pdf.py        ToniBlack_Creator_Brief.pptx ToniBlack_Creator_Brief.pdf
```

`gen.py` dan `gen2.py` menyimpan prompt kie yang dipakai. Jangan dijalankan ulang
kecuali memang mau bikin foto baru — tiap generate memakan 12 kredit.

Font dibaca dari `../../september-nine-to-nine/source/fonts`. `source/frames/`
tidak disimpan karena hasil generate dan sudah tertanam di `.pptx`.

## Sebelum membuka: pasang fontnya

Deck ini memakai **Zalando Sans Expanded** dan **Arimo**. Kalau belum terpasang,
PowerPoint akan menggantinya dan tata letaknya meleset. File font-nya ada di
`toni-black/september-nine-to-nine/source/fonts`. PDF-nya tidak butuh ini.
