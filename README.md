# 📚 OTM Study Hub — MBA UGM

Aplikasi belajar untuk mata kuliah **Operations & Technology Management** (MAN 5322 / EBMY231001),
MBA Universitas Gadjah Mada, Semester 2. Dibangun dari materi kuliah di folder Google Drive
**"Semester 2 - MBA UGM"** (silabus S51A, slide Pertemuan 1, dan referensi SBB · HRM · TPW).

## Cara menjalankan

Tidak perlu install apa pun — cukup buka `index.html` di browser, atau jalankan server lokal:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Fitur

| Fitur | Deskripsi |
|---|---|
| **Dashboard** | Info kuliah, sesi berikutnya + hitung mundur, komponen penilaian, progres belajar, tautan ke Drive |
| **Silabus** | Garis waktu 12 sesi lengkap dengan bacaan (SBB/HRM/TPW) & case study; tandai sesi yang sudah dipelajari |
| **Materi** | Rangkuman terstruktur per pertemuan — Sesi 1 (OM, operations performance, operations strategy + pendalaman HRM bab 1) dan Sesi 2 (operations strategy in a global environment dari HRM bab 2) sudah lengkap |
| **Flashcards** | 51 kartu hafalan (29 kartu Sesi 1, 22 kartu Sesi 2) dengan pelacakan penguasaan |
| **Kuis** | 25 soal pilihan ganda (13 soal Sesi 1, 12 soal Sesi 2) dengan pembahasan & skor terbaik |
| **Kalkulator** | Kalkulator labor & multifactor productivity (contoh Collins Title dari slide) |
| **Catatan** | Jurnal pribadi per sesi, tersimpan otomatis |

Semua progres (sesi selesai, penguasaan kartu, skor kuis, catatan) disimpan di `localStorage` browser —
tidak butuh server maupun akun.

## Menambah materi pertemuan berikutnya

Semua konten ada di **`js/data.js`**:

1. Cari sesi yang dimaksud di array `sessions`, isi field `summary` dengan rangkuman
   (array `{ heading, body }`, body berupa HTML).
2. Tambahkan kartu baru di `flashcards` dengan `session: <nomor sesi>`.
3. Tambahkan paket soal di `quizzes` dengan `session: <nomor sesi>`.

Sesi yang sudah punya konten otomatis muncul di pemilih sesi (angka bergaris emas), tanpa perlu
mengubah HTML/CSS/logika aplikasi.

## Struktur proyek

```
index.html      — kerangka halaman & navigasi
css/style.css   — seluruh styling (tema "warm academic editorial")
js/data.js      — data kuliah: silabus, rangkuman, flashcards, kuis
js/app.js       — logika SPA (routing, flashcards, kuis, kalkulator, catatan)
```
