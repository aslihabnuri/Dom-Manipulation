# Monster Padel — Dokumen Payment Flow (Xendit Cards)

Dokumen alur pembayaran untuk pengajuan aktivasi kanal **Cards** (Visa, Mastercard,
JCB, American Express) di Xendit, disusun mengikuti format contoh yang diminta:
tangkapan layar berlabel yang memetakan perjalanan pelanggan dari awal sampai selesai.

**Hasil akhir:** [`docs/Monster-Padel-Payment-Flow-Cards.pdf`](docs/Monster-Padel-Payment-Flow-Cards.pdf)
— 10 halaman A4 landscape, 18 layar, teks vektor (bisa dicari dan disalin).

## Isi dokumen

| Hal. | Isi |
|-----|-----|
| 1 | Sampul — identitas merchant, kanal yang diajukan, daftar isi |
| 2 | Peta alur end-to-end (swimlane: pelanggan, merchant, Xendit, penerbit kartu) |
| 3 | Layar 01–03 — beranda, jenis booking, pemilihan tanggal/lapangan/jam |
| 4 | Layar 04–06 — rincian booking, data pemesan, ringkasan biaya |
| 5 | Layar 07–09 — pilih metode, formulir kartu Xendit, verifikasi 3D Secure |
| 6 | Layar 10–12 — status diproses, berhasil, dan gagal |
| 7 | Layar 13–15 — email konfirmasi, e-ticket QR, riwayat booking |
| 8 | Layar 16–18 — kelola booking, konfirmasi pembatalan, status refund |
| 9 | Rincian teknis — pemetaan endpoint, webhook, rekonsiliasi, keamanan |
| 10 | Kebijakan — daftar produk, pembatalan & refund, layanan pelanggan, ringkasan pengajuan |

## Data yang perlu dikonfirmasi sebelum dikirim ke Xendit

Angka berikut **belum tercantum publik di monsterpadel.id** dan dipakai sebagai
contoh yang masuk akal. Sesuaikan dengan ketentuan Monster Padel yang sebenarnya:

- Tarif lapangan non-member: Rp 350.000/jam (off peak) dan Rp 450.000/jam (peak 17.00–22.00)
- Harga add-on: raket Rp 50.000, tube bola Rp 60.000, handuk & air Rp 35.000
- Tarif sewa lapangan + pelatih: mulai Rp 650.000/jam
- Batas waktu pembayaran 15 menit dan penguncian slot selama periode itu
- Jenjang refund (100% / 50% / tidak ada) beserta ambang 24 jam dan 12 jam
- Batas 3 kali percobaan pembayaran, rekonsiliasi harian 02.00 WITA, retensi log 5 tahun
- Rentang dan rata-rata nilai transaksi pada halaman 10

Yang **sudah sesuai situs**: alamat, email, nomor telepon, jam operasional,
daily pass Rp 250.000, 7 days pass Rp 1.500.000, tarif member Rp 300.000/jam,
dan rentang keanggotaan Rp 2.500.000–Rp 18.000.000.

Data transaksi di dalam mockup (nama pemesan, nomor booking, nomor kartu, referensi
Xendit) adalah contoh. Nomor kartu memakai rentang uji, bukan kartu asli.

## Menyusun ulang PDF

```bash
cd payment-flow
node build.js              # tulis ulang PDF ke ../docs/
node build.js --preview    # PDF + PNG per halaman di payment-flow/preview/
```

Butuh Playwright (Chromium). Bila Playwright terpasang global, arahkan lewat env:

```bash
PLAYWRIGHT_MODULE=/path/ke/node_modules/playwright node build.js
```

Untuk menyunting isinya, ubah `payment-flow/index.html` lalu jalankan ulang perintah
di atas. Semua aset (font Inter & Source Serif 4, logo, QR) tertanam di
`payment-flow/assets/`, jadi render berjalan sepenuhnya offline dan hasilnya konsisten.

## Struktur

```
docs/Monster-Padel-Payment-Flow-Cards.pdf   hasil akhir untuk dikirim ke Xendit
payment-flow/index.html                     seluruh isi dokumen
payment-flow/assets/doc.css                 design system + mockup layar
payment-flow/assets/                        font tertanam, logo, QR code
payment-flow/build.js                       perender HTML → PDF
```
