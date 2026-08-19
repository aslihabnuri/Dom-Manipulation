# TikTok LIVE Clipper

Mesin clipper untuk rekaman TikTok LIVE. Anda memberi rekaman live dan laporan
performa jam-per-jam; aplikasi ini mencari momen yang penontonnya ramai **dan**
sales-nya tinggi, memotongnya jadi klip 9:16, menambahkan teks, lalu memeriksa
risiko kepatuhan sebelum Anda mengunggahnya.

**Isi video tidak diubah sama sekali.** Tidak ada perubahan kecepatan, zoom, mirror,
atau pitch suara. Yang ditambahkan hanya framing, subtitle, dan teks informasi —
persis bentuk kontribusi yang disebut aturan TikTok sendiri. Alasan lengkapnya ada di
[docs/kepatuhan-tiktok.md](docs/kepatuhan-tiktok.md); baca itu dulu kalau kekhawatiran
utama Anda soal pelanggaran.

---

## Bukan programmer?

Jangan baca halaman ini. Buka **[PANDUAN.md](PANDUAN.md)** — panduan klik-klik
tanpa satu pun perintah yang perlu diketik.

Ada dua cara pakai tanpa menyentuh terminal:

- **[Buka di Google Colab](https://colab.research.google.com/github/aslihabnuri/Dom-Manipulation/blob/claude/tiktok-live-clipper-app-1c0qai/Clipper_TikTok_LIVE.ipynb)**
  — tanpa pasang apa pun, membaca Google Drive langsung tanpa unduh video.
- **Klik dua kali** `Buka Aplikasi (Mac).command` atau `Buka Aplikasi (Windows).bat`
  — aplikasi terbuka di browser komputer Anda.

Sisa dokumen ini untuk penggunaan lewat baris perintah.

---

## Instalasi

Butuh Python 3.10+ dan ffmpeg.

```bash
# ffmpeg
brew install ffmpeg          # macOS
sudo apt install ffmpeg      # Ubuntu/Debian

git clone <repo> && cd Dom-Manipulation
pip install -e .             # inti saja
pip install -e ".[all]"      # + xlsx, transkripsi, Google Drive
```

Paket opsional dan gunanya:

| Extra | Untuk apa | Tanpa ini |
|---|---|---|
| `transcribe` | subtitle terbakar, caption dari isi video, pemindaian klaim lisan | klip tetap jadi, tapi tanpa teks — dan itu melemahkan sisi originalitasnya |
| `xlsx` | membaca laporan `.xlsx` | ekspor laporan sebagai CSV |
| `drive` | tarik berkas langsung dari Google Drive | unduh manual, atau pakai `rclone` |

Cek kesiapan lingkungan kapan saja:

```bash
clipper doctor
```

## Alur kerja

### 1. Siapkan berkas

Susun di Google Drive (atau folder lokal) per tanggal live:

```
Live/
  2026-08-18/
    live_2026-08-18.mp4
    performa_2026-08-18.csv
```

Nama berkas atau nama folder boleh memuat tanggal dalam format apa pun yang umum:
`2026-08-18`, `18-08-2026`, atau `20260818`.

Berkas subtitle `.srt` yang diletakkan di folder yang sama akan dipakai langsung,
sehingga tidak perlu transkripsi ulang.

### 2. Laporan performa

Ekspor dari Seller Center apa adanya. Kolom dicocokkan otomatis, dalam bahasa
Indonesia maupun Inggris, dan baris judul di atas header diabaikan:

```csv
Laporan Performa LIVE - Toko Contoh
Periode: 18 Agustus 2026

Rentang Waktu,Total Penonton,Pendapatan (Rp),Jumlah Pesanan
19:00 - 20:00,"12.400","Rp24.500.000",120
20:00 - 21:00,"38.500","Rp117.000.000",640
```

Format angka Indonesia (`Rp1.234.567`, `1.234,56`, `12rb`, `1,2jt`) dan Inggris
(`1,234.56`) sama-sama terbaca. Kalau ragu kolomnya kebaca benar:

```bash
clipper doctor --performance performa.csv
```

### 3. Jalankan

```bash
# dari folder lokal atau Drive, dipilih berdasarkan tanggal
clipper run --source ./Live --date 2026-08-18

# atau tunjuk berkasnya langsung
clipper run --video live.mp4 --performance performa.csv \
            --live-start "2026-08-18 19:00"
```

`--live-start` adalah **waktu detik ke-0 rekaman**. Ini satu-satunya bagian yang perlu
Anda perhatikan: kalau rekaman mulai jam 19:00 tetapi laporan dimulai 20:00, tanpa
flag ini jam-jamnya akan meleset satu jam. Bila tidak diisi, aplikasi menganggap
rekaman dimulai bersamaan dengan baris pertama laporan.

Lihat pilihannya dulu tanpa merender:

```bash
clipper analyze --video live.mp4 --performance performa.csv
```

### 4. Hasil

```
output/2026-08-18/
  2026-08-18_002015.mp4   # klip siap unggah
  2026-08-18_014230.mp4
  report.md               # alasan tiap klip dipilih + catatan kepatuhan
  report.json             # data yang sama, untuk diolah lebih lanjut
```

Baca `report.md` sebelum mengunggah. Di situ ada caption siap pakai dan daftar hal
yang perlu Anda periksa manual.

## Cara momen dipilih

**Langkah 1 — jam mana.** Penonton dan sales dinormalisasi ke rentang 0–1, lalu
digabung memakai **rata-rata geometrik**, bukan penjumlahan berbobot. Bedanya nyata:

| Jam | Penonton | Sales | Rata-rata berbobot | Rata-rata geometrik |
|---|---|---|---|---|
| A | 1.00 | 0.00 | **0.50** | **0.09** |
| B | 0.60 | 0.60 | 0.60 | 0.60 |

Jam A ramai tapi tidak menjual apa pun. Dengan penjumlahan berbobot ia nyaris
menyaingi jam B; dengan rata-rata geometrik ia jatuh jauh. Karena Anda bilang penonton
banyak **dan** sales tinggi adalah satu metrik, geometrik yang dipakai secara bawaan.

**Langkah 2 — detik mana.** Data jam-per-jam hanya memberi tahu *jam* mana, tidak
pernah *45 detik* mana. Jendela digeser sepanjang jam terpilih dan dinilai dari tiga
sinyal:

- **energi audio** (0.30) — host sedang bersemangat, bukan sedang menunggu
- **kepadatan bicara** (0.25) — ada isi, bukan jeda
- **sinyal jualan** (0.45) — frasa CTA benar-benar jatuh di dalam jendela
  ("keranjang kuning", "checkout", "flash sale", "stok terbatas")

**Langkah 3 — rapikan.** Titik potong digeser ke batas kalimat terdekat dari
transkrip, sehingga klip tidak pernah dibuka di tengah kata.

## Caption yang mengikuti isi video

Caption tidak disusun dari template yang cuma berganti tanggal — enam klip akan
terbaca seperti unggahan borongan, dan itu justru melawan aturan "setiap unggahan
membawa nilai baru".

Sebagai gantinya, fakta diambil dari transkrip klip itu sendiri:

| Yang diambil | Contoh |
|---|---|
| Harga yang benar-benar dibayar | "dari Rp129.000 **jadi Rp89.000**" → `Rp89.000`, bukan harga jangkar |
| Bahan | `katun combed`, `linen` — frasa dua kata tetap utuh |
| Ukuran & warna | `S, M, L, XL` · `hitam, navy, maroon` |
| Penawaran | `gratis ongkir`, `flash sale`, `bundling` |
| Jenis momen | CTA / harga / promo / demo — menentukan kalimat penutup |
| Kategori produk | menentukan hashtag: `#fashionmurah`, `#skincareroutine`, … |

Tiga varian gaya dibuat untuk tiap klip supaya satu batch tidak seragam.
Tidak ada yang dikarang: kalau transkrip tipis, caption tetap pendek dan jujur
alih-alih diisi klaim yang tidak didukung videonya.

```bash
clipper run --video live.mp4 --performance performa.csv   # caption ada di report.md
```

## Yang diperiksa sebelum render

| Pemeriksaan | Tindakan |
|---|---|
| Momen sudah pernah diklip (ledger lintas sesi) | **blokir** |
| Klip tanpa caption maupun overlay | **blokir** |
| Klaim medis, jaminan absolut, barang tiruan, arahan ke luar platform | **blokir** |
| Overlay terlalu pendek atau sekadar "Part 2" | peringatan |
| Suara latar konstan di sela kalimat (kemungkinan musik) | peringatan |
| Superlatif tanpa pembanding | peringatan |

Uji satu kalimat kapan saja:

```bash
clipper check --text "dijamin putih dalam semalam"
```

## Konfigurasi

```bash
clipper init     # tulis clipper.yaml berisi semua opsi beserta nilai bawaannya
```

Yang paling sering disetel:

```yaml
scoring:
  method: geometric        # atau weighted, bila satu metrik lebih penting
  sales_metric: gmv        # atau orders, gmv_per_viewer
  max_clips_per_session: 6

clip:
  target_seconds: 45
  min_seconds: 21
  max_seconds: 60

render:
  reframe: blur            # blur = frame utuh + latar buram; cover = crop tengah
  crop_bias_x: 0.5         # untuk mode cover: 0.0 kiri, 1.0 kanan

compliance:
  max_overlap_with_published: 0.25   # ambang klip dianggap duplikat
```

Aturan kepatuhan bisa ditambah atau dimatikan lewat berkas sendiri:

```yaml
compliance:
  rules_file: ./aturan-saya.yaml
```

Memakai `id` yang sama dengan aturan bawaan akan menimpanya — itu cara mematikan
aturan yang kebetulan salah tangkap untuk katalog Anda.

## Perintah

| Perintah | Fungsi |
|---|---|
| `clipper web` | buka aplikasi klik-klik di browser |
| `clipper run` | seluruh alur, sampai klip jadi |
| `clipper analyze` | skor dan pilih momen, tanpa render |
| `clipper doctor` | cek lingkungan dan pemetaan kolom |
| `clipper check` | uji teks terhadap aturan kepatuhan |
| `clipper ledger` | riwayat klip yang sudah dibuat |
| `clipper init` | tulis berkas konfigurasi |

## Google Drive

Tiga jalan, dicoba berurutan:

1. **Folder lokal** — termasuk Drive yang sudah di-mount. Tidak perlu setelan apa pun.
2. **rclone** — `clipper run --source "gdrive:Live" --date 2026-08-18`. Paling andal
   untuk berkas besar karena bisa melanjutkan unduhan yang terputus.
3. **Drive API** — `clipper run --source "https://drive.google.com/drive/folders/..."`.
   Perlu OAuth client (tipe Desktop) dari Google Cloud Console, disimpan di
   `~/.config/tiktok-clipper/credentials.json`.

## Menjalankan tes

```bash
python -m unittest discover -s tests -v
```

Tes yang butuh render dilewati otomatis bila ffmpeg tidak terpasang.

## Batasan

- Pemeriksaan kepatuhan bekerja pada **teks dan audio**, bukan gambar. Tonton tiap
  klip sebelum diunggah.
- Deteksi musik adalah heuristik energi audio, bukan pencocokan fingerprint. Ia
  mengingatkan Anda untuk mendengarkan, bukan memberi vonis.
- Hook yang disarankan otomatis diambil dari kalimat yang benar-benar diucapkan, dan
  tetap perlu Anda sunting. Tidak ada yang dikarang.
- Aplikasi ini tidak memverifikasi hak Anda atas materi. Simpan sendiri bukti izin
  dari brand.
