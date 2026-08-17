# Rute — perencana itinerary

Perencana perjalanan yang menjawab pertanyaan yang biasanya baru ketahuan di
lapangan: **dari sini ke sana berapa jauh, berapa lama, dan habis berapa.**

Berjalan sepenuhnya di browser. Tanpa akun, tanpa server, tanpa build step.

---

## Menjalankannya

**Paling gampang** — buka `index.html` dengan klik dua kali. Selesai.

**Kalau ingin di-hosting** (supaya bisa dibuka dari HP saat traveling):
Settings → Pages → Source: `Deploy from a branch` → pilih branch ini, folder
`/ (root)`. Beberapa menit kemudian situsnya hidup di
`https://<username>.github.io/<nama-repo>/`.

**Untuk mengembangkan**, jalankan server statis apa pun:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Trip tersimpan otomatis di browser (`localStorage`). Untuk memindahkannya ke
perangkat lain, pakai **Pengaturan → Simpan / muat**.

---

## Yang dijawab aplikasi ini

### 1. Jarak dan waktu tempuh antar tempat

Setiap ruas antar perhentian menampilkan jarak (km) dan estimasi waktu tempuh.
Ada dua sumber angka, dan aplikasi selalu menandai mana yang dipakai:

| Sumber | Cara kerja | Butuh internet |
|---|---|---|
| **Estimasi** (bawaan) | Jarak garis lurus (haversine) × faktor jalan per destinasi, dibagi kecepatan rata-rata moda, ditambah waktu parkir dan pengali jam sibuk | Tidak |
| **Rute asli** (opsional) | Jarak & durasi mengemudi sebenarnya dari layanan rute OpenStreetMap (OSRM), di-cache supaya tidak diminta berulang | Ya |

Aktifkan lewat **Pengaturan → Hitung rute jalan sebenarnya**. Kalau layanannya
tidak bisa dihubungi, aplikasi diam-diam kembali ke estimasi dan bilang begitu
di legenda peta — bukan menampilkan angka palsu.

Model estimasinya memperhitungkan:

- **Jam sibuk** — 07.00–09.00 dikali 1,28; 16.00–18.30 dikali 1,32; tengah malam
  dikali 0,86.
- **Moda** — motor 33 km/jam, mobil 30, ojol 32, taksi 29, jalan kaki 4,6.
- **Waktu hilang** yang biasanya lupa dihitung: parkir, pakai helm, cari pintu
  masuk. 6–10 menit per perpindahan tergantung kendaraan.
- **Kelokan jalan** — jarak lurus dikali 1,32 (Jogja) sampai 1,48 (Bandung).

Tiap ruas juga punya tautan **buka rute** langsung ke Google Maps kalau ingin
angka resminya.

### 2. Rekomendasi tempat dan penyusun itinerary otomatis

Empat destinasi siap pakai, Yogyakarta paling dalam:

| Destinasi | Jumlah tempat |
|---|---|
| Yogyakarta (+ Magelang, Klaten, Gunungkidul) | 50 |
| Bali | 15 |
| Bandung | 14 |
| Malang & Bromo | 12 |

Tombol **Susun otomatis** membangun itinerary lengkap dalam empat langkah:

1. **Skor** — tiap tempat dinilai dari kecocokan minat yang kamu pilih, rating,
   status ikonik, dan kepatuhan pada batas anggaran.
2. **Kelompokkan** — tempat terpilih dikelompokkan secara geografis dengan
   k-means berimbang, supaya satu hari tidak melompat dari pantai Gunungkidul
   ke Borobudur. Pengelompokannya diseimbangkan agar tidak ada hari yang
   kebagian satu tempat sementara hari lain kebagian tujuh.
3. **Urutkan** — nearest-neighbour lalu diperbaiki 2-opt, dan tiap kelompok
   waktu (sunrise / siang / sunset) dirutekan dari posisi terakhir kelompok
   sebelumnya, bukan dari penginapan.
4. **Isi** — tempat dimasukkan sampai jatah waktu habis, dengan menghormati jam
   buka dan waktu terbaik tiap tempat.

Hasilnya deterministik: masukan yang sama selalu memberi susunan yang sama.

Belum ada di daftar? **Jelajah → Tempat sendiri** menerima tempat apa pun asal
punya koordinat (klik kanan di Google Maps untuk menyalinnya).

### 3. Biaya

Tiap tempat membawa perkiraan tiket per orang plus biaya rombongan (parkir dan
sejenisnya). Tab **Biaya** menjumlahkannya menjadi:

- Total trip dan total per orang
- Rincian per kategori: tiket, makan, transport, aktivitas, oleh-oleh, penginapan
- Perbandingan antar hari
- Tabel per tempat — **setiap angka bisa diubah**

Ongkos transport dihitung dari jarak (Rp700/km motor sampai Rp4.500/km taksi)
dan dibulatkan ke Rp500 terdekat, karena itu perkiraan, bukan struk.

Kalau kamu mengisi target anggaran, aplikasi memberi tahu saat terlewati dan
menyebutkan kategori mana yang paling besar.

> **Harga adalah estimasi**, disegarkan Agustus 2026 dari sumber publik. Tiket
> di Indonesia sering berubah dan beda weekday/weekend. Perlakukan sebagai titik
> awal dan ubah sesuai harga yang kamu temukan.

### 4. Pengatur waktu dan Google Calendar

Semua jam mengalir dari satu jam berangkat. Ubah urutan atau durasi, dan sisa
hari bergeser sendiri.

Aplikasi memperingatkan hal-hal yang biasanya baru ketahuan setelah sampai:

- Tiba setelah tempatnya tutup, atau cuma kebagian sisa waktu sebelum tutup
- Tiba sebelum buka (jadwal otomatis digeser ke jam buka)
- Spot sunrise dijadwalkan jam sembilan pagi, atau spot sunset ditinggal jam tiga
- Hari yang isinya lebih dari 13 jam, atau selesai lewat tengah malam
- Waktu di jalan melebihi waktu menikmati tempatnya

Tab **Hari ini** aktif otomatis pada tanggal yang cocok: menampilkan kamu
sedang di mana, berapa lama lagi harus berangkat, dan seberapa jauh menyimpang
dari rencana. Kalau telat, satu tombol menggeser sisa jadwal.

Untuk kalender, ada dua jalur dan keduanya tanpa login:

- **Tautan per aktivitas** — tombol "Tambah ke Google Calendar" di detail tiap
  perhentian.
- **Berkas .ics untuk seluruh trip** — impor sekali jalan lewat Google Calendar
  → Setelan → Impor & ekspor. Tiap acara membawa lokasi, koordinat, perkiraan
  biaya, dan pengingat 30 menit sebelumnya.

Zona waktu ditulis eksplisit (WIB untuk Jogja/Bandung/Malang, WITA untuk Bali),
jadi jamnya tetap benar walau ponselmu sedang di zona lain.

---

## Peta

Peta memakai Leaflet dengan ubin OpenStreetMap. Ada dua tingkat cadangan supaya
visualisasinya tidak pernah hilang total:

1. Leaflet dibundel di dalam repo, bukan diambil dari CDN — jadi ia tetap ada
   walau jaringan bermasalah.
2. Kalau Leaflet sendiri gagal dimuat, aplikasi menggambar **peta skematik SVG**
   buatan sendiri: posisi relatif dan urutan rute tetap benar, hanya latar
   jalannya yang tidak ada. Aplikasi mengatakan apa adanya bahwa itu skematik.

**Warna hari memakai tangga ordinal, bukan warna kategorikal.** Hari dalam satu
trip adalah urutan, bukan kategori terpisah, jadi kanal yang jujur adalah
tingkat kegelapan satu warna — bukan pelangi. Tangga ini lolos validator
ordinal (monoton, jarak antar langkah ≥ 0,06, ujung terang lolos 2:1) di tema
terang maupun gelap. Selain itu tiap penanda membawa **nomor urutannya**, jadi
identitas perhentian tidak pernah bergantung pada warna saja.

---

## Struktur berkas

```
index.html                     kerangka semantik; semua tampilan dirender JS
assets/css/tokens.css          token desain OKLCH, tema terang & gelap
assets/css/app.css             tata letak & komponen
assets/js/data/destinations.js pustaka destinasi & tempat
assets/js/lib/util.js          format, tanggal, ikon, pembantu DOM
assets/js/lib/geo.js           haversine, model waktu tempuh, klien OSRM
assets/js/lib/store.js         state trip, localStorage, riwayat urungkan
assets/js/lib/schedule.js      mesin jadwal & deteksi bentrok
assets/js/lib/planner.js       penyusun itinerary otomatis
assets/js/lib/calendar.js      pembuat .ics & tautan Google Calendar
assets/js/lib/charts.js        grafik biaya
assets/js/lib/map.js           Leaflet + peta skematik cadangan
assets/js/ui/*.js              tampilan: shell, rencana, jelajah, biaya, hari ini
assets/js/app.js               orkestrasi
assets/vendor/leaflet/         Leaflet 1.9.4 (BSD-2-Clause)
```

Tanpa dependensi runtime selain Leaflet yang sudah dibundel. Tanpa build step —
apa yang ada di repo adalah apa yang dijalankan browser.

## Pintasan papan ketik

| Tombol | Fungsi |
|---|---|
| `1`–`4` | Pindah tampilan |
| `M` | Buka/tutup peta |
| `Ctrl`/`Cmd` + `Z` | Urungkan |
| `?` | Daftar pintasan |

## Catatan

- **Peta dan rute** © kontributor [OpenStreetMap](https://www.openstreetmap.org/copyright),
  lisensi ODbL. Rute asli memakai [OSRM](https://project-osrm.org/) demo server
  — layanan gratis dengan batas wajar, jangan dipakai untuk beban berat.
- **Leaflet** 1.9.4, BSD-2-Clause.
- Aplikasi tidak mengirim data trip ke mana pun. Semuanya tetap di browser.
