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

## 3. Tiga tingkat perubahan (preset)

| Preset       | Yang dilakukan                                                                 | Cocok untuk |
|--------------|--------------------------------------------------------------------------------|-------------|
| `aman`       | Perubahan sangat halus, mata hampir tidak bisa membedakan                        | Video yang tampilannya tidak boleh berubah |
| `seimbang`   | **Bawaan.** Zoom, geser bingkai, putar halus, geser warna, ubah kecepatan, butiran | Pemakaian harian |
| `kuat`       | Semua di atas + **balik gambar kiri-kanan** + potongan tepi lebih besar           | Video yang sering kena flag |

Ditambah opsi **Bingkai** (`--bingkai 0.90`): gambar dikecilkan di atas latar blur.
Ini mengubah komposisi gambar secara menyeluruh, jadi **paling ampuh** melawan
pencocokan konten — sekaligus terlihat rapi.

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

Kalau skornya rendah padahal sudah preset `kuat`, nyalakan **Bingkai 90%**.
Itu yang paling banyak menaikkan skor, karena komposisi gambarnya ikut berubah.

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

## 7. Subtitle otomatis (opsional)

```bash
pip install faster-whisper
python3 edit.py video.mp4 --auto-teks --bahasa id
```

Suara video ditranskrip, lalu dipecah jadi baris-baris pendek dengan font yang
sama seperti teks lainnya. Model diunduh otomatis saat pertama kali dipakai
(butuh internet sekali saja). Prosesnya menambah waktu kira-kira selama durasi videonya.

---

## 8. Isi folder

```
edit.py           <- jalankan lewat baris perintah
app.py            <- jalankan lewat browser
config.json       <- setelan gaya tetap (silakan diubah)
input/            <- taruh video yang mau diedit di sini
output/           <- hasil edit muncul di sini
assets/fonts/     <- font yang dipakai
assets/ui.html    <- tampilan halaman browser
vidclean/         <- mesin di baliknya
```

---

## 9. Kalau ada masalah

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

## 10. Yang perlu diketahui

Aplikasi ini mengubah **jejak teknis** video: piksel, durasi, warna, audio, dan
metadata. Itu memang yang dipakai sistem pencocokan konten untuk mengenali video
yang sama. Tapi tidak ada alat mana pun yang bisa **menjamin** lolos dari sistem
deteksi sebuah platform — cara kerjanya tertutup dan terus berubah.

Perlu diingat juga: mengunggah ulang karya orang lain bisa melanggar hak cipta
dan aturan platform, terlepas dari seberapa banyak videonya diubah. Paling aman
dipakai untuk video milik sendiri, video berlisensi bebas, atau materi yang sudah
diizinkan pemiliknya.

Font bawaan berlisensi SIL Open Font License 1.1 — lihat `assets/fonts/LISENSI.md`.
