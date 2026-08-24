# Toni Black — Template Presentasi: Timeline & Budget

Template PowerPoint 12 slide, 16:9 (13,3 × 7,5 inci). Isi konten Anda sendiri —
struktur, warna, dan tipografinya sudah dikunci ke brand guideline Toni Black.

## Isi slide

| # | Slide | Untuk diisi |
|---|---|---|
| 1 | Cover | Nama tim, tanggal |
| 2 | Agenda | Kalimat pengantar dua bagian |
| 3 | Pembatas — Timeline | Satu kalimat ringkasan |
| 4 | Four phases | 4 kartu fase: nama, rentang tanggal, dua deliverable |
| 5 | Week by week | Tabel jadwal, 5 workstream × 4 minggu + owner |
| 6 | Three dates that matter | 3 milestone: tanggal, nama, keterangan |
| 7 | Pembatas — Budget | Satu kalimat ringkasan |
| 8 | The headline numbers | 3 angka utama; kartu pertama sengaja gelap |
| 9 | Line by line | Tabel rincian + baris Total |
| 10 | Where it goes | Doughnut chart native + legenda |
| 11 | Assumptions | 4 kartu asumsi |
| 12 | Next steps | 3 langkah tindak lanjut |

Tiap slide punya catatan di Speaker Notes yang menjelaskan cara mengisinya.

## Sebelum membuka: pasang fontnya

Deck ini memakai **Zalando Sans Expanded** dan **Arimo**. Kalau belum terpasang di
komputer, PowerPoint akan menggantinya dan tampilannya meleset. File font-nya ada
di Drive Anda: `Toni Black / Font`, atau di repo ini pada
`toni-black/september-nine-to-nine/source/fonts`.

## Kepatuhan brand

- **Warna** — hanya palet brand: Dark Charcoal `#282828`, Clean White `#FFFFFF`,
  Davi's Grey `#4F5052`, Grey `#818284`, Steel Grey `#CCCCCC`. Tidak ada warna lain.
- **Tipografi** — Zalando Sans Expanded untuk judul dan angka, Arimo untuk isi.
  Diverifikasi: hanya dua nama font ini yang muncul di seluruh file.
- **Struktur terang–gelap** — cover, dua pembatas, dan penutup memakai charcoal;
  slide isi memakai putih. Ini mengikuti cara brand memakai kedua kutub palet.
- **Motif** — label huruf kapital berjarak lebar di tiap slide, sama seperti yang
  dipakai di set banner September. Tanpa garis aksen atau bar dekoratif.
- **Tone of voice** — judul pendek dan langsung, kalimat aktif, tanpa hiperbola.

## Grafik

Slide 10 memakai chart doughnut **native PowerPoint**, bukan gambar. Klik kanan >
*Edit Data* untuk mengganti angkanya. Legenda di sebelah kanan diketik manual,
jadi ikut disesuaikan kalau angkanya berubah.

## Catatan verifikasi

Validator OOXML lolos penuh. Pemeriksaan geometri dijalankan langsung pada file
`.pptx` memakai metrik font aslinya — lebar tiap teks dihitung dan dibandingkan
dengan kotaknya, posisi tiap shape dicek terhadap margin aman 0,5 inci, dan
tumpang-tindih antar kotak teks diperiksa. Hasil akhir: tidak ada temuan.

Pemeriksaan ini menemukan dan memperbaiki dua masalah nyata: grid kartu di empat
slide melewati margin kanan (lebar kolom dihitung untuk kanvas 13,3 inci padahal
area isi hanya 11,9 inci), dan angka `Rp 000.000.000` tidak muat di kartunya pada
ukuran 23pt.

`preview_all_slides.jpg` adalah render dua belas slide, dibuat dengan membaca
kembali isi file `.pptx`-nya.

## Regenerate

```bash
cd source && node build_deck.js
python3 qa_geometry.py ../ToniBlack_Timeline_Budget_Template.pptx
```
