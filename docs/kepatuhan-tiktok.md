# Kepatuhan TikTok untuk Klip Rekaman LIVE

Ringkasan riset yang menjadi dasar desain aplikasi ini. Dibuat Agustus 2026.

---

## Kesimpulan utama, tanpa basa-basi

**Tidak ada trik untuk "lolos" dari deteksi TikTok, dan Anda tidak membutuhkannya.**

Aturan TikTok soal ini tertulis eksplisit di Seller Center:

> "Don't re-upload the same video or livestream recording. Each post should bring new value."

Perhatikan kalimatnya. TikTok **tidak** melarang Anda memotong rekaman live sendiri
menjadi klip. Yang dilarang adalah **mengunggah ulang tanpa nilai baru**.

Dan tentang apa yang dihitung sebagai nilai baru, TikTok menyebutkan secara harfiah:

> "Add distinctive original contributions verbally or via text"

Artinya: **teks adalah bentuk kontribusi yang diakui TikTok sendiri.** Rencana Anda —
menambahkan teks tanpa mengubah isi video — bukan celah, melainkan justru jalur yang
disebutkan aturannya. Itu kabar baiknya.

Yang perlu diluruskan: teks itu harus **membawa informasi**, bukan sekadar hiasan.
"Part 2" atau watermark tidak dihitung. Caption yang membuat klip bisa ditonton tanpa
suara, plus baris info produk/harga, dihitung.

## Kenapa "trik" teknis tidak berguna

Beberapa hal yang sering dijual sebagai cara lolos, dan mengapa aplikasi ini tidak
melakukannya:

| Trik | Kenapa tidak dipakai |
|---|---|
| Ubah kecepatan 1.01x, mirror, zoom pelan | Pencocokan konten TikTok berbasis fingerprint audio-visual, tahan terhadap perubahan kecil. Yang rusak justru kualitas momen jualan Anda. |
| Hapus/palsukan metadata | Deteksi duplikat tidak membaca metadata. Ini tidak berpengaruh apa pun. |
| Tambah noise / ubah pitch suara | Sama seperti di atas, plus merusak kejelasan suara host. |
| Tumpuk border, blur pinggir | Dianggap "few creative modifications" — justru contoh yang TikTok sebut sebagai konten tidak orisinal. |

Aplikasi ini **tidak mengubah isi video sama sekali**: tidak ada perubahan kecepatan,
zoom, mirror, atau pitch. Persis seperti permintaan Anda, dan kebetulan itu juga
posisi yang paling aman.

## Risiko sebenarnya, yang sering terlewat

Berdasarkan riset, penyebab pelanggaran pada klip live biasanya bukan "unoriginal
content", melainkan hal-hal berikut:

### 1. Momen yang sama diunggah dua kali

Ini risiko terbesar dan paling sering tidak disadari. Kalau dua klip diambil dari
rentang waktu yang beririsan, secara substansi itu unggahan yang sama. Aplikasi ini
menyimpan **ledger** setiap klip yang sudah dirender dan memblokir kandidat yang
beririsan lebih dari ambang tertentu (bawaan 25%), termasuk lintas hari.

### 2. Musik berhak cipta di latar live

Rekaman live sering memuat musik yang diputar di studio. Saat live berlangsung
biasanya aman; begitu dijadikan video unggahan, statusnya berubah dan bisa kena klaim
hak cipta. Aplikasi ini menjalankan heuristik: mengukur energi audio di sela kalimat.
Kalau suara latar tetap kuat saat host berhenti bicara, kemungkinan ada bed musik dan
Anda diberi peringatan. Ini pengingat untuk mendengarkan, bukan vonis.

### 3. Klaim berlebihan yang terbawa dari ucapan live

Ini penyebab paling umum pelanggaran TikTok Shop di Indonesia — dan yang paling mudah
lolos dari perhatian, karena saat live Anda tidak sempat menyaring kata. Begitu ucapan
itu masuk ke klip, ia jadi bukti permanen.

Aplikasi ini memindai transkrip terhadap 22 aturan, di antaranya:

- **Klaim medis** — "menyembuhkan", "mengobati", nama penyakit spesifik
- **Jaminan absolut** — "100% ampuh", "dijamin sembuh", "tanpa efek samping"
- **Hasil instan** — "auto putih", "cerah dalam semalam"
- **Superlatif** — "termurah", "nomor satu", "satu-satunya"
- **Mengarahkan ke luar platform** — WhatsApp, marketplace lain, transfer rekening
- **Barang tiruan** — "KW super", "mirror quality"

Aturan sengaja dibuat peka konteks. "100% katun" aman, "100% ampuh" diblokir.
"Gratis ongkir" aman, "gratis" tanpa objek diperingatkan.

### 4. Memutar klip ke dalam sesi LIVE

Aturan yang terpisah dan tegas:

> "Don't stream pre-recorded content or insert clips into a livestream. Livestreams must be real-time."

Klip dari aplikasi ini adalah untuk **diunggah sebagai video biasa**. Jangan pernah
diputar kembali ke dalam sesi live — itu pelanggaran tersendiri, dan justru inilah
yang paling sering memicu notifikasi "unoriginal content on LIVE".

## Cara aplikasi ini menempatkan diri

| Kebutuhan TikTok | Yang dilakukan aplikasi |
|---|---|
| Setiap unggahan membawa nilai baru | Caption terbakar + overlay hook/info; diverifikasi tidak kosong dan tidak sekadar "Part 2" |
| Jangan unggah ulang rekaman yang sama | Ledger lintas sesi, memblokir irisan >25% |
| Kontribusi lewat teks | Subtitle per kata dari transkrip, plus baris informasi produk |
| Jangan klaim berlebihan | 22 aturan peka konteks atas transkrip, caption, dan overlay |
| Format sesuai feed | Kanvas 9:16, safe zone atas 12% dan bawah 22% dikosongkan dari teks |

## Yang tetap harus Anda lakukan sendiri

Aplikasi ini memeriksa teks dan audio. Ia **tidak** bisa memeriksa gambar. Jadi tetap:

1. **Tonton tiap klip sampai habis** sebelum diunggah.
2. Pastikan tidak ada merek pihak ketiga, wajah orang lain tanpa izin, atau tampilan
   produk yang tidak sesuai deskripsi di keranjang.
3. Pastikan produk yang ditunjukkan sama dengan yang ditautkan — ketidaksesuaian
   produk adalah salah satu pelanggaran TikTok Shop yang paling sering kena sanksi.
4. Simpan bukti izin dari brand. Aplikasi ini tidak memverifikasi hak Anda atas materi.

## Sumber

- [TikTok Seller Center — Unoriginal Content](https://seller-sg.tiktok.com/university/essay?knowledge_id=7651420422211329&lang=en)
- [TikTok Seller Center (UK) — Reproduced & Unoriginal Content](https://seller-uk.tiktok.com/university/essay?knowledge_id=7841352058554114)
- [TikTok Community Guidelines — For You Feed Eligibility Standards](https://www.tiktok.com/community-guidelines/en/fyf-standards)
- [TikTok Community Guidelines — Integrity and Authenticity](https://www.tiktok.com/community-guidelines/en/integrity-authenticity)
- [TikTok Creator Academy — Originality Policy](https://www.tiktok.com/creator-academy/article/tiktok-originality-policy)
- [MEA Agency — 15 Jenis Pelanggaran Live TikTok Shop](https://www.meagency.co.id/pelanggaran-live-tiktok-shop/)
- [Ordal — Cara Agar Tidak Kena Pelanggaran TikTok](https://ordal.co.id/cara-agar-tidak-kena-pelanggaran-tiktok/)

---

*Dokumen ini rangkuman kebijakan publik per Agustus 2026, bukan nasihat hukum.
Kebijakan TikTok berubah; periksa ulang tautan di atas secara berkala.*
