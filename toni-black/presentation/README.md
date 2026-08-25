# Toni Black — Template Presentasi: Timeline & Budget

Tiga slide, 16:9 (13,3 × 7,5 inci). Isi kontennya sendiri — struktur, warna, dan
tipografinya sudah dikunci ke brand guideline Toni Black.

## Isi

| # | Slide | Yang diisi |
|---|---|---|
| 1 | **Pembuka** | Kalimat pengantar, nama tim, tanggal |
| 2 | **Timeline** | Tiga tanggal kunci di kanan atas; tabel jadwal 5 workstream × 4 minggu + owner |
| 3 | **Budget** | Tabel rincian 5 baris + baris Total; angka total; doughnut alokasi + legenda |

Timeline dan Budget masing-masing muat penuh dalam satu slide — dipadatkan, bukan
sekadar dipotong. Slide pembuka juga memuat daftar dua bagian di bawah, jadi
audiens tahu apa yang akan dibahas tanpa perlu slide agenda terpisah.

Tiap slide punya catatan di Speaker Notes yang menjelaskan cara mengisinya.

## Sebelum membuka: pasang fontnya

Deck ini memakai **Zalando Sans Expanded** dan **Arimo**. Kalau belum terpasang,
PowerPoint akan menggantinya dan tampilannya meleset. File font-nya ada di Drive
Anda pada `Toni Black / Font`, atau di repo ini pada
`toni-black/september-nine-to-nine/source/fonts`.

## Kepatuhan brand

- **Warna** — hanya palet brand: Dark Charcoal `#282828`, Clean White `#FFFFFF`,
  Davi's Grey `#4F5052`, Grey `#818284`, Steel Grey `#CCCCCC`.
- **Tipografi** — Zalando Sans Expanded untuk judul, angka, dan header tabel;
  Arimo untuk isi. Diverifikasi: hanya dua nama font ini yang muncul di file.
- **Struktur terang–gelap** — pembuka charcoal, dua slide isi putih.
- **Motif** — label huruf kapital berjarak lebar di tiap slide, sama seperti yang
  dipakai di set banner September. Tanpa garis aksen atau bar dekoratif.
- **Tone of voice** — judul pendek, kalimat aktif, tanpa hiperbola.

## Grafik

Slide 3 memakai doughnut chart **native PowerPoint**, bukan gambar. Klik kanan >
*Edit Data* untuk mengganti angkanya. Legenda di sebelah kanannya diketik manual,
jadi ikut disesuaikan kalau angkanya berubah.

## Catatan verifikasi

Validator OOXML lolos penuh. Pemeriksaan geometri dijalankan langsung pada file
`.pptx` memakai metrik font aslinya: lebar tiap teks dihitung dan dibandingkan
dengan kotaknya, posisi tiap shape dicek terhadap margin, dan tumpang-tindih antar
kotak teks diperiksa. Hasil akhir bersih.

Tiga masalah nyata ditemukan dan diperbaiki lewat pemeriksaan ini:

1. Kotak judul di slide Timeline menabrak blok tanggal di kanan atas.
2. Blok tanggal terakhir melewati margin desain 0,7 inci.
3. **Yang paling tidak kelihatan:** pptxgenjs menyimpan tinggi tabel sebagai
   1,00 inci — angka placeholder. PowerPoint baru menumbuhkannya saat render.
   Tinggi sebenarnya 3,72 inci, yang berarti tabel akan menimpa catatan kaki di
   kedua slide. Tinggi baris dikecilkan sampai tabel selesai di 6,19 dan 6,17
   inci, dengan jarak 0,26 dan 0,28 inci ke catatan kaki.

`preview_all_slides.jpg` adalah render ketiga slide, dibuat dengan membaca kembali
isi file `.pptx`-nya.

## Regenerate

```bash
cd source && node build_deck.js
python3 qa_geometry.py ../ToniBlack_Timeline_Budget_Template.pptx
```

`build_deck_12slide.js` adalah versi panjang yang dibuat lebih dulu (12 slide,
dengan slide pembatas, fase, milestone, dan asumsi terpisah). Simpan kalau
sewaktu-waktu butuh deck yang lebih rinci.
