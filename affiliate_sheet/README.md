# Daftar Affiliate TikTok (Toni Black)

Isi folder ini adalah alat bantu untuk Google Sheet **Daftar Affiliate TikTok - Toni Black**
yang tersimpan di Google Drive, folder `Toni Black > Daftar Affiliate`.

Aturan utama: **file lama tidak dihapus.** Setiap penambahan data dilakukan dengan
menempel baris baru ke sheet yang sudah ada, sehingga ID file, link, izin akses dan
riwayat versi tetap sama.

## Isi folder

| File | Fungsi |
| --- | --- |
| `data_batch1.py` | Data 5 file export Kalodata batch pertama plus fungsi `agregasi()` |
| `data_batch2.py` | Data 3 file export Kalodata batch kedua |
| `baris_tempel.py` | Membuat baris siap tempel (TSV) untuk sheet yang sudah ada |
| `build_sheet.py` | Membuat file xlsx dari nol. Hanya dipakai kalau memang butuh file baru |

## Cara menambah data tanpa menghapus file lama

1. Simpan file export Kalodata yang baru ke folder Drive `Toni Black`.
2. Tambahkan barisnya ke modul data baru, misalnya `data_batch3.py`, dengan format
   `(nama, handle, followers, gmv, unit_terjual, jumlah_live, jumlah_video)`,
   lalu sambungkan ke `data_batch1.py` seperti pola `data_batch2.py`.
3. Di Google Sheet, pilih `File > Download > Comma Separated Values`, simpan sebagai
   `sheet_sekarang.csv`.
4. Jalankan:

   ```
   python3 baris_tempel.py sheet_sekarang.csv > baris_baru.tsv
   ```

   Skrip membandingkan kolom Handle Kreator, jadi kreator yang sudah ada di sheet
   tidak akan muncul dua kali. Kreator yang datanya bertambah dari file baru
   digabung angkanya di dalam `agregasi()`.
5. Buka sheet yang sama, klik sel **B** di baris kosong pertama, lalu tempel isi
   `baris_baru.tsv`.
6. Kolom **A (No)** berisi rumus `=IF($B6<>"",ROW()-5,"")`. Tarik rumus itu ke bawah
   sejauh baris baru supaya penomoran ikut jalan.

## Hal yang perlu diperiksa setelah menempel

Validasi dropdown dan pewarnaan kolom Progress pada file awal berhenti di **baris 162**.
Kalau baris baru melewati baris tersebut:

- blok `L162:M162`, salin, lalu tempel ke seluruh baris baru supaya dropdown
  `Dihubungi Via Apa?` dan `Progress` ikut turun,
- atau ubah rentang lewat `Data > Validasi data` dan `Format > Pemformatan bersyarat`.

Kolom uang memakai format Rupiah (`"Rp" #,##0`), yaitu GMV (Penjualan),
Harga Jual Rata-Rata dan Komisi. Nomor Whatsapp diformat sebagai teks supaya angka 0
di depan tidak hilang.

## Kalau terpaksa membuat file baru

`build_sheet.py` menghasilkan file xlsx lengkap beserta dropdown, pemformatan bersyarat,
freeze panes dan filter. Kalau file itu harus diunggah, file lama **diganti nama menjadi
arsip**, bukan dihapus, contohnya `Daftar Affiliate TikTok - Toni Black (arsip 25 Agu 2026)`.

Batas ukuran unggahan konektor Google Drive ada di sekitar 25.000 karakter base64,
jadi file xlsx harus tetap di bawah kira-kira 18,5 KB.

## Sumber data

Delapan file export Kalodata, periode 26 Jul 2026 sampai 24 Agu 2026, dengan filter toko:
`uomolive`, `Rider_Underwear`, `Nosile`, `Sholadia`, `uncolive.underwear`,
`kasogiunderwear`, `Flyman Nathalie`, `APPartner`.

Hasil gabungan: 180 baris mentah menjadi 156 kreator unik, 18 di antaranya muncul di
lebih dari satu file. GMV, quantity terjual, jumlah video dan jumlah live dijumlahkan
karena filter tokonya tidak saling tumpang tindih. Followers diambil nilai tertinggi.
Harga jual rata-rata dihitung ulang sebagai total GMV dibagi total quantity.

Handle `riderofficialstore` dikecualikan karena sudah dihapus manual dari sheet.
