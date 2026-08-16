# Pemeriksa Pelafalan — sumber artifact

Halaman web satu berkas yang menjalankan **mesin bahasa Naratif** sepenuhnya di
browser: tanpa server, tanpa jaringan, tanpa kunci API.

Gunanya: memeriksa naskah sebelum keluar biaya dubbing, dari perangkat apa pun,
tanpa perlu memasang aplikasinya.

## Kenapa dibangun, bukan ditulis tangan

`build.mjs` menyalin modul dari [`../src/lang/`](../src/lang) apa adanya —
`numbers`, `lexicon`, `normalize`, `lint`, `wer` — lalu membuang sintaks modulnya
dan menempelkannya ke dalam `<script>`.

Artinya alat ini dan pipeline **tidak mungkin berbeda pendapat** tentang apa yang
aman dikirim ke mesin suara. Kalau aturan lintingnya berubah di aplikasi, jalankan
ulang build-nya dan halaman ini ikut berubah. Kalau ditulis ulang dengan tangan,
keduanya akan menyimpang diam-diam — dan halaman ini akan meloloskan naskah yang
diblokir aplikasinya.

## Membangun ulang

Butuh lima berkas font TrueType di `artifact/fonts/` (atau arahkan
`NARATIF_FONTS` ke direktori lain):

| Berkas | Peran |
|---|---|
| `InstrumentSerif-Regular.ttf` | vonis dan judul |
| `InstrumentSerif-Italic.ttf` | penekanan |
| `InstrumentSans-Regular.ttf` | teks isi |
| `InstrumentSans-Bold.ttf` | penegasan |
| `DMMono-Regular.ttf` | keluaran mesin dan data |

Ketiganya berlisensi SIL Open Font License dan tersedia di Google Fonts.

```bash
NARATIF_FONTS=/path/ke/font node artifact/build.mjs
# → artifact/pemeriksa-naskah.html
```

Font di-*inline* sebagai data URI, bukan ditautkan, karena CSP artifact memblokir
CDN font. Kalau ditautkan, font-nya diam-diam jatuh ke fallback dan lapisan
penanda di belakang kotak teks tidak lagi sejajar dengan hurufnya — tanda koreksi
akan meleset satu baris.

## Yang tidak bisa masuk ke artifact

Perakitan video, dubbing, generasi gambar, dan riset topik tetap harus jalan di
mesin lokal: butuh ffmpeg dan panggilan ke API yang diblokir CSP halaman.
