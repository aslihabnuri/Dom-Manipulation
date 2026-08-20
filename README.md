# Affiliate Dashboard

File utama: `Affiliate_Dashboard.xlsx`

Dashboard sederhana untuk mengelola database affiliate beserta ringkasan performanya. Semua angka ringkasan dihitung otomatis dengan rumus Excel, jadi begitu data ditambahkan, dashboard ikut ter-update.

## Isi file

| Sheet | Fungsi |
| --- | --- |
| `Dashboard` | Ringkasan otomatis: KPI utama, breakdown channel komunikasi, segmentasi followers, dan legenda. Seluruh isinya rumus, tidak perlu diketik manual. |
| `Data Affiliate` | Tempat input data. Kapasitas 200 baris (baris 6 sampai 205). |
| `Referensi` | Daftar pilihan channel komunikasi dan batas tier followers. Boleh diubah sesuai kebutuhan. |

## Kolom pada sheet Data Affiliate

| Kolom | Header | Catatan pengisian |
| --- | --- | --- |
| A | No | Rumus penomoran otomatis, jangan diketik |
| B | Nama | Nama lengkap affiliate |
| C | Nama Akun | Username sosial media, contoh `@rinakartika.id` |
| D | Nomor Whatsapp | Diformat sebagai teks, angka 0 di depan tidak hilang |
| E | Dihubungi Lewat Apa? | Dropdown, sumbernya sheet Referensi |
| F | GMV Histori (Rp) | Ketik angka polos tanpa titik dan tanpa tulisan Rp |
| G | Product yang Dikirim | Nama produk beserta jumlahnya |
| H | Jumlah Followers | Ketik angka polos, dipakai untuk segmentasi tier |

## Metrik yang dihitung di sheet Dashboard

Ringkasan utama: total affiliate terdata, total GMV histori, rata-rata GMV per affiliate, GMV tertinggi, nama pemilik GMV tertinggi, total followers, rata-rata followers, jumlah yang sudah dan belum dikirim produk, serta jumlah yang belum dihubungi.

Breakdown channel komunikasi: jumlah affiliate, total GMV, rata-rata GMV, total followers, dan persentase kontribusi GMV per channel.

Segmentasi followers: pembagian Nano, Micro, Mid, Macro, dan Mega lengkap dengan jumlah affiliate, total GMV, rata-rata GMV, dan kontribusi GMV tiap tier.

## Cara pakai singkat

1. Buka `Affiliate_Dashboard.xlsx`, masuk ke sheet `Data Affiliate`.
2. Timpa baris contoh berwarna kuning (baris 6) dengan data asli, lalu lanjutkan ke baris berikutnya.
3. Buka sheet `Dashboard` untuk melihat ringkasannya.
4. Kalau butuh channel baru atau batas tier yang berbeda, ubah di sheet `Referensi`.

## Membangun ulang file

```bash
pip install openpyxl
python tools/build_dashboard.py
```

Script akan menimpa `Affiliate_Dashboard.xlsx` dengan versi kosong (hanya berisi baris contoh), jadi backup dulu kalau file sudah berisi data asli.
