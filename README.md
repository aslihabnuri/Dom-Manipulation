# Editor Video Anti Duplikat

Aplikasi untuk mengolah ulang video (mis. hasil unduhan TikTok) supaya **jejak
teknisnya berbeda** dari video sumber, dengan tampilan yang **bersih dan
seragam**: satu jenis font, satu ukuran, satu posisi teks untuk semua video.

Dibuat untuk dipakai orang yang bukan programmer. Ada dua cara memakainya:
lewat **halaman browser** (klik-klik saja) atau lewat **satu baris perintah**.

---

## 1. Cara tercepat: minta lewat chat

Kirim videonya ke Claude di sesi ini, lalu bilang mau diedit seperti apa.
Contoh: *"edit video ini, judulnya 'Jangan skip', preset kuat"*.
Video hasil akan dikirim balik siap unggah.

---

## 2. Pakai di komputer sendiri

### Langkah 1 - Pasang ffmpeg (sekali seumur hidup)

| Sistem  | Perintah                          |
|---------|-----------------------------------|
| Windows | `winget install Gyan.FFmpeg`      |
| macOS   | `brew install ffmpeg`             |
| Linux   | `sudo apt install ffmpeg`         |

Cek berhasil atau belum: ketik `ffmpeg -version` di terminal/CMD.
Kalau muncul tulisan panjang, berarti sudah beres.

### Langkah 2 - Buka aplikasinya

```bash
python3 app.py
```

Browser akan terbuka sendiri di `http://127.0.0.1:7860`.
Tinggal tarik videonya ke kotak, isi teks kalau perlu, klik **Edit Video Sekarang**,
lalu unduh hasilnya.

> Semua proses berjalan di komputer sendiri. Video tidak dikirim ke server mana pun.

### Langkah 3 (opsional) - Lewat baris perintah

```bash
# satu video
python3 edit.py video.mp4

# dengan teks
python3 edit.py video.mp4 --judul "Jangan skip, ini penting" --handle "@akunku"

# semua video di folder input/ sekaligus
python3 edit.py --semua --preset kuat

# bikin 3 versi berbeda dari satu video
python3 edit.py video.mp4 --varian 3

# subtitle otomatis dari suara video
python3 edit.py video.mp4 --auto-teks

# lihat semua pilihan yang tersedia
python3 edit.py --info
python3 edit.py --help
```

Hasil tersimpan di folder `output/`.

---

## 2b. Racik: menjahit ulang beberapa video jadi editan baru

Kalau satu video tetap kena flag "Unoriginal content", artinya sistemnya
mengenali ADEGANNYA - dan itu tidak bisa dilawan dengan filter. Jawabannya
adalah membuat urutan adegan yang memang belum pernah ada:

```bash
python3 racik.py video1.mp4 video2.mp4 video3.mp4 --judul "Tas viral itu"
python3 racik.py folder_video/ --durasi 25 --potong-atas 0.08 --varian 3
```

Yang terjadi:
1. tiap video dipecah menjadi shot (deteksi pergantian adegan)
2. shot dipilih bergantian antar sumber, 1,6-3,4 detik per shot,
   dan pembukanya diambil dari TENGAH video - bukan detik-detik pertama
   yang paling mudah dikenali
3. dijahit jadi satu video master, lalu diproses mesin anti duplikat v2

`--varian 3` menghasilkan tiga racikan dengan urutan berbeda dari bahan
yang sama (sumber cukup dipindai sekali).

### Musik latar

```bash
python3 racik.py folder_video/ --lagu otomatis          # lagu lo-fi orisinal dibuatkan
python3 racik.py folder_video/ --lagu laguku.mp3        # pakai lagu sendiri
```

`--lagu otomatis` mensintesis lagu lo-fi chill yang benar-benar orisinal
(bukan diambil dari mana pun), jadi bebas klaim hak cipta audio dan aman
untuk konten komersial. Tiap racikan mendapat lagu berbeda - tempo, nada
dasar, dan progresinya diundi. Suara asli video tetap terdengar pelan di
bawah musik (`--volume-asli`, bawaan 0.25; `--volume-lagu`, bawaan 1.0).

Untuk jangkauan maksimal, menambah lagu tren dari library TikTok saat
mengunggah tetap lebih baik - lagu tren ikut mendorong distribusi. Fitur
ini untuk video yang memang butuh musik tertanam di berkasnya.

### Editan estetik

Racik memoles hasil jahitan seperti editor manusia: teks tertanam di
footage dideteksi (OCR tiap 0,7 detik) dan shot-nya dihindari, tiap shot
diberi gerakan Ken Burns bergantian, sebagian sambungan memakai dissolve,
ritme potongan diatur (pendek di awal sebagai hook), ditutup fade pelan,
dan diberi grading warna seragam (`--look bersih / hangat / sinematik`).

## 3. Tiga tingkat perubahan (preset)

| Preset       | Yang dilakukan                                                                 | Cocok untuk |
|--------------|--------------------------------------------------------------------------------|-------------|
| `aman`       | Perubahan sangat halus, mata hampir tidak bisa membedakan                        | Video yang tampilannya tidak boleh berubah |
| `seimbang`   | **Bawaan.** Semua teknik dinamis dengan takaran sedang                            | Pemakaian harian |
| `kuat`       | Takaran lebih besar + **balik gambar kiri-kanan** + potongan tepi lebih besar     | Video tanpa teks tertanam |
| `maksimal`   | Takaran terbesar + potongan zoom, TANPA membalik gambar                            | Video yang sering kena flag tapi ada teks/logo |

Ditambah opsi **Bingkai** (`--bingkai 0.90`): gambar dikecilkan di atas latar blur.
Ini mengubah komposisi gambar secara menyeluruh, jadi **paling ampuh** melawan
pencocokan konten — sekaligus terlihat rapi.

### Mesin dinamis (v2)

Perubahan yang konstan (zoom tetap, warna tetap, kecepatan tetap) mudah
dinormalkan oleh sistem pencocok konten. Karena itu mesin v2 membuat
perubahan yang BERGERAK:

- **Gerak dinamis** — bingkai berayun sangat pelan (putaran ±0,3°, geseran
  ±0,5%, periode belasan detik). Mata tidak melihatnya, tapi tiap frame punya
  geometri unik.
- **Kecepatan berlapis** — video dibagi 2–4 babak dengan kecepatan berbeda
  (misal 0,97 / 1,03 / 0,98), jadi penyelarasan waktu antar video menjadi
  non-linear dan tidak bisa dikoreksi dengan satu angka.
- **Grading kurva warna** — histogram warna digeser non-linear per kanal,
  bukan sekadar terang/gelap rata.
- **EQ audio acak** — 1–3 pita frekuensi digeser maksimal ±1,2 dB; tidak
  terdengar, tapi spektrum sidik jari audionya berubah.
- **Edit ulang otomatis** — hasil diukur dengan pengukur adversarial; kalau
  skornya di bawah target (`target_skor`, bawaan 80), video otomatis diedit
  ulang dengan takaran lebih kuat (sampai 3 percobaan), lalu dipilih yang
  terbaik. Percobaan terakhir menambah **cold-open**: cuplikan menarik dari
  tengah video diulang 1,6 detik di awal, menggeser seluruh lini masa.
- **Cold-open manual** — `--hook 12.5,1.8` mengulang cuplikan detik 12,5
  sepanjang 1,8 detik di pembuka. Gaya edit yang lazim di TikTok sekaligus
  perubahan struktural yang paling kuat.
- **Potongan zoom (jump-cut)** — babak selang-seling ditampilkan lebih dekat
  (+6–14%), jadi tiap pergantian babak framingnya berganti seperti editan
  potong-sambung manual. Ini yang membuat video terbaca sebagai "editan
  kreatif baru", bukan unggahan ulang. Matikan dengan `--tanpa-potongan-zoom`.
- **Buang watermark** — `--potong-atas 0.09` membuang 9% bagian atas layar.
  Penting: pesan "Unoriginal content" TikTok secara eksplisit menyebut video
  bisa dianggap tidak orisinal *kalau ada watermark atau logo di atasnya*.

Matikan semua ini dengan `--tanpa-dinamis` (kembali ke perilaku lama) atau
`--target-skor 0` (tanpa edit ulang otomatis).

### Apa saja yang diubah di setiap video

- Zoom mikro dan pergeseran bingkai (angkanya beda-beda tiap video)
- Perputaran gambar sangat halus (di bawah satu derajat)
- Pemangkasan tepi layar — sekaligus membuang watermark yang menempel di pinggir
- Perubahan kecepatan beberapa persen, jadi durasinya tidak lagi sama
- Pergeseran kecerahan, kontras, saturasi, gamma, dan rona warna
- Butiran halus (grain) + penajaman
- Pemotongan beberapa frame di awal dan akhir
- Pergeseran nada suara, supaya sidik jari audio ikut berubah
- Penyeragaman tingkat kekerasan suara
- Pengodean ulang dengan frame rate, kualitas, dan jarak keyframe yang berbeda
- Penghapusan seluruh metadata bawaan video sumber
- Opsional: balik gambar kiri-kanan, bingkai latar blur, dan sisipan produk

Angka-angkanya diacak per video, tapi tetap bisa diulang: video yang sama
dengan varian yang sama selalu menghasilkan angka yang sama.

---

## 4. Menyeragamkan font di semua video

Semua teks digambar lewat satu berkas gaya, dengan font yang ikut dibawa di
folder `assets/fonts/`. Jadi hasilnya **identik di komputer mana pun**, dan video
720p maupun 1080p menghasilkan ukuran teks yang terlihat sama besar.

Font bawaan: **Montserrat**, **Poppins**, **Anton**, **Bebas Neue**.

Untuk mengubah gaya tetap (berlaku untuk semua video), buka `config.json`:

```jsonc
{
  "gaya": {
    "font": "Montserrat",       // ganti ke Poppins / Anton / Bebas Neue
    "warna_teks": "#FFFFFF",
    "warna_garis": "#000000",   // garis tepi supaya terbaca di latar terang
    "tebal_garis": 4,
    "kotak_latar": false,       // true = teks diberi kotak gelap
    "ukuran_judul": 68,         // ukuran untuk layar setinggi 1920px
    "ukuran_caption": 52,
    "posisi_judul": 0.13,       // 0 = paling atas, 1 = paling bawah
    "posisi_caption": 0.80,
    "maks_karakter_baris": 22,  // pemenggalan baris otomatis
    "handle": "@akunku"         // watermark tetap untuk semua video
  }
}
```

Mau pakai font sendiri? Taruh berkas `.ttf` di `assets/fonts/`, lalu tulis
namanya di `config.json`. Cek terbaca atau tidak dengan `python3 edit.py --daftar-font`.

Posisi bawaan sudah dihitung agar tidak tertutup tombol-tombol TikTok:
teks atas di 13% dari atas, teks bawah di 80% dari atas.

---

## 5. Skor anti duplikat

Setiap hasil edit diberi skor 0-100. Cara menghitungnya meniru cara kasar sistem
pendeteksi duplikat bekerja: mengambil 8 cuplikan gambar, mengubahnya menjadi
sidik jari 64 bit, lalu menghitung berapa bit yang berbeda dari video asli.
Ditambah poin dari perubahan durasi, resolusi, frame rate, audio, dan metadata.

| Skor    | Artinya |
|---------|---------|
| 80-100  | Sangat aman |
| 60-79   | Aman |
| 40-59   | Cukup — sebaiknya naikkan ke preset `kuat` |
| 0-39    | Kurang — pakai preset `kuat`, nyalakan cermin, atau pakai bingkai |

Sejak v2, skor dihitung dengan **pencocokan adversarial**: tiap cuplikan
video asli dibandingkan dengan beberapa titik waktu di video hasil, lalu
diambil yang paling mirip — meniru pencocok yang tahan pergeseran waktu.
Akibatnya angka skor v2 lebih rendah dari v1 untuk video yang sama; itu
disengaja, karena skor lama terbukti terlalu murah hati.

Kalau skornya rendah, mesin sudah otomatis mengedit ulang lebih kuat
(lihat `target_skor`). Yang paling menaikkan skor: `racik.py` (jahit ulang
antar video) dan `--hook` (cold-open).

---

## 6. Menyisipkan produk

Untuk mengganti produk di dalam video tanpa rekam ulang. Ada tiga cara,
dan semua labelnya memakai font yang sama dengan teks lain.

| Cara | Yang terjadi | Paling cocok untuk |
|------|--------------|--------------------|
| **sisip** | Gambar dipotong ke foto produk sepenuh layar, suara aslinya tetap jalan | Produk yang dipegang tangan dan bergerak |
| **tempel** | Foto produk muncul sebagai kartu kecil di sudut, gambar asli tetap terlihat | Menyebut produk sambil tetap terlihat wajahnya |
| **endcard** | Foto produk sepenuh layar di akhir, video jadi lebih panjang | Ajakan beli di penutup |

```bash
# potong ke foto produk di detik ke-5 selama 2,5 detik
python3 edit.py video.mp4 --sisip "produk.jpg,5,2.5,Serum Vitamin C"

# kartu kecil di sudut kiri bawah
python3 edit.py video.mp4 --tempel "produk.jpg,3,4,Rp 89.000" --tempel-posisi kiri-bawah

# ajakan beli di akhir video selama 3 detik
python3 edit.py video.mp4 --endcard "produk.jpg,3,Cek keranjang kuning"

# ketiganya sekaligus
python3 edit.py video.mp4 \
  --sisip "produk.jpg,5,2.5,Serum Vitamin C" \
  --tempel "produk.jpg,9,3,Rp 89.000" \
  --endcard "produk.jpg,3,Cek keranjang kuning"
```

Urutan isian: `foto, mulai, lama, label` — kecuali endcard yang cukup
`foto, lama, label` karena selalu di akhir.

Waktu `mulai` dihitung dari **video aslinya**, bukan hasil editnya. Jadi
tinggal lihat videonya, catat detik ke berapa produknya disebut, dan tulis
angka itu. Penyesuaiannya diurus otomatis walaupun videonya dipotong dan
diubah kecepatannya.

Di halaman browser, semua ini ada di bagian **3. Sisipan produk** — tinggal
tarik foto produknya dan isi detiknya.

### Kenapa produknya tidak diganti langsung di dalam gambar?

Mengganti barang yang dipegang tangan dan ikut bergerak butuh rotoscoping per
frame: bentuk, sudut, bayangan, dan pantulan cahayanya berubah terus. Yang
otomatis hasilnya terlihat menempel dan bergoyang. Cutaway justru lebih rapi,
lebih cepat, dan produknya bisa diganti kapan saja tanpa menyentuh rekaman asli.

---

## 7. Membuat foto produk dengan AI (opsional)

Kalau punya kunci API [kie.ai](https://kie.ai), foto produknya bisa dibuat atau
dipercantik langsung dari sini, lalu disisipkan ke video.

### Mengisi kunci API

Jangan pernah menempelkan kunci API ke dalam percakapan atau ke berkas yang
ikut ter-commit. Pilih salah satu:

1. **Paling aman** — isi environment variable `KIE_API_KEY` di pengaturan
   environment Claude Code ([dokumentasinya di sini](https://code.claude.com/docs/en/claude-code-on-the-web)).
2. Buat berkas `.env` di folder aplikasi:
   ```
   KIE_API_KEY=kunci_anda_di_sini
   ```
   Contohnya ada di `.env.contoh`. Berkas `.env` sudah masuk daftar abaikan git.

### Memakainya

```bash
# percantik foto produk yang sudah ada
python3 aset.py foto_produk.jpg --perintah "foto produk di atas meja marmer,
    cahaya studio lembut, latar bersih, format tegak"

# lalu sisipkan ke video
python3 edit.py video.mp4 --sisip "assets/produk/foto_produk_ai.png,5,2.5,Serum Vitamin C"
```

Daftar model terbaru dan harganya ada di [kie.ai/market](https://kie.ai/market).
Model bawaan untuk mengolah foto adalah `qwen/image-to-image`; model lain
dipilih lewat `--model`.

### Yang TIDAK bisa dilakukan lewat API ini

kie.ai menyediakan model **pembuat** gambar dan video baru. Tidak ada model
face swap, dan tidak ada model yang mengubah video yang sudah ada. Jadi kunci
API ini tidak bisa dipakai untuk mengganti wajah atau produk di dalam rekaman.
Kegunaannya adalah membuat bahan yang nanti disisipkan — foto produk, klip
produk, dan gambar endcard.

---

## 8. Subtitle otomatis (opsional)

```bash
pip install faster-whisper
python3 edit.py video.mp4 --auto-teks --bahasa id
```

Suara video ditranskrip, lalu dipecah jadi baris-baris pendek dengan font yang
sama seperti teks lainnya. Model diunduh otomatis saat pertama kali dipakai
(butuh internet sekali saja). Prosesnya menambah waktu kira-kira selama durasi videonya.

---

## 9. Isi folder

```
edit.py           <- jalankan lewat baris perintah
app.py            <- jalankan lewat browser
aset.py           <- buat foto produk dengan AI (butuh kunci kie.ai)
.env              <- kunci API (dibuat sendiri, tidak ikut ter-commit)
config.json       <- setelan gaya tetap (silakan diubah)
input/            <- taruh video yang mau diedit di sini
output/           <- hasil edit muncul di sini
assets/fonts/     <- font yang dipakai
assets/produk/    <- foto produk hasil AI
assets/ui.html    <- tampilan halaman browser
vidclean/         <- mesin di baliknya
```

---

## 10. Kalau ada masalah

| Masalah | Penyebab & solusi |
|---------|-------------------|
| `ffmpeg tidak ditemukan` | ffmpeg belum terpasang — lihat Langkah 1 |
| Teks kepotong di tepi | Perpendek teksnya, atau kecilkan `maks_karakter_baris` di `config.json` |
| Teks terlalu kecil/besar | Ubah `ukuran_judul` di `config.json` |
| Skor rendah terus | Preset `kuat` + Bingkai 90% + nyalakan cermin |
| Foto produk kepotong | Foto dipotong agar menutup layar penuh. Pakai foto tegak (9:16) atau mode `tempel` |
| Prosesnya lama | Wajar: video 1 menit butuh sekitar 1-3 menit. Ubah `preset_encode` jadi `"veryfast"` di `config.json` untuk mempercepat |
| Suara hilang | Video sumber memang tidak punya audio — otomatis diberi audio senyap |
| Halaman browser tidak terbuka | Buka manual `http://127.0.0.1:7860` |

---

## 11. Yang perlu diketahui

Aplikasi ini mengubah **jejak teknis** video: piksel, durasi, warna, audio, dan
metadata. Itu memang yang dipakai sistem pencocokan konten untuk mengenali video
yang sama. Tapi tidak ada alat mana pun yang bisa **menjamin** lolos dari sistem
deteksi sebuah platform — cara kerjanya tertutup dan terus berubah.

Perlu diingat juga: mengunggah ulang karya orang lain bisa melanggar hak cipta
dan aturan platform, terlepas dari seberapa banyak videonya diubah. Paling aman
dipakai untuk video milik sendiri, video berlisensi bebas, atau materi yang sudah
diizinkan pemiliknya.

Font bawaan berlisensi SIL Open Font License 1.1 — lihat `assets/fonts/LISENSI.md`.
