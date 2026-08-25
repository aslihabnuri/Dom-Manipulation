# Toni Black — Timeline & Budget (September)

Tiga slide, 16:9, sudah terisi materi. Bukan lagi template kosong.

## Isi

**1 — Pembuka.** Judul, kalimat pengantar, dan daftar dua bagian. Nama tim dan
tanggal masih perlu diisi.

**2 — Timeline.** Rencana per minggu menuju 30 affiliate, dengan target akhir
bulan, fokus produk, dan skema komisi di kolom kanan.

| Periode | Aktivitas |
|---|---|
| Akhir Agustus | Buat fake order bertahap, sembari menyusun list affiliate |
| Minggu 1 September | Pastikan semua orderan sudah sampai dan sudah direview. Targetkan menghubungi 30 affiliate |
| Minggu 2 September | Kirim barang ke minimal 10 affiliate, dan hubungi 30 affiliate berikutnya |
| Minggu 3 September | Kirim barang ke minimal 20 affiliate lainnya |
| Minggu 4 & seterusnya | Mencari dan menghubungi affiliator baru |

Target akhir bulan **30 affiliate**. Fokus produk: Brief Dewasa, Brief Boxer
Dewasa, Boxer Dewasa. Komisi affiliate **15% + ads**.

Label periode dirapikan dari catatan asli ("Week Akhir Agustus" jadi "Akhir
Agustus", dan seterusnya) supaya konsisten. Isi aktivitasnya tidak diubah.

**3 — Budget.**

| Pos | Alokasi | Share |
|---|---|---|
| TikTok Ads | Rp 7.000.000 | 29% |
| Shopee Ads | Rp 7.000.000 | 29% |
| TikTok Ads for Live Affiliate * | Rp 10.000.000 | 42% |
| **Total** | **Rp 24.000.000** | **100%** |

Target ROAS **3×**. Total dicek ulang: 7 + 7 + 10 = 24 juta, cocok.

**Target revenue Rp 72.000.000** adalah angka turunan, bukan input — hasil dari
ROAS 3 dikali budget 24 juta. Ditampilkan karena biasanya jadi pertanyaan pertama.
Hapus kalau tidak ingin dibahas.

Tanda bintang pada pos Live Affiliate masih perlu keterangan. Catatan kakinya
sudah disiapkan, tinggal diisi.

## Sebelum membuka: pasang fontnya

Deck ini memakai **Zalando Sans Expanded** dan **Arimo**. Kalau belum terpasang,
PowerPoint akan menggantinya dan tampilannya meleset. File font-nya ada di Drive
Anda pada `Toni Black / Font`, atau di repo ini pada
`toni-black/september-nine-to-nine/source/fonts`.

## Kepatuhan brand

**Warna dan tipografi.** Hanya palet brand: Dark Charcoal `#282828`, Clean White
`#FFFFFF`, Davi's Grey `#4F5052`, Grey `#818284`, Steel Grey `#CCCCCC`. Hanya dua
font brand. Pembuka charcoal, dua slide isi putih. Motifnya label kapital berjarak
lebar, sama seperti di set banner September. Tanpa garis aksen atau bar dekoratif.

**Tone of voice.** Bagian *Tone of Voice* di guideline sebagian besar berisi
kosakata brand ke konsumen — *tailored, refined, crafted*. Kosakata itu sengaja
tidak dipakai di sini, karena akan terdengar dipaksakan pada tabel jadwal dan
budget. Yang diterapkan adalah bagian **Writing Style**-nya: *"concise,
straightforward, using active sentences and getting straight to the main point"*,
ditambah *calm confidence* dan larangan membanggakan diri.

Wujudnya di deck:

| Sebelum | Sesudah | Alasan |
|---|---|---|
| "Rencana kerja menuju 30 affiliate, dan alokasi biaya iklan yang menopangnya." | "Thirty affiliates by the end of September. The plan, and the budget behind it." | Tujuan disebut lebih dulu, bukan disimpan di akhir kalimat |
| "Menuju 30 affiliate" | "Week by week to thirty" | Menyatakan cara dan tujuan sekaligus |
| "Alokasi budget" | "Where the budget goes" | Kalimat aktif, bukan label benda |

**Bahasa dibuat konsisten.** Sebelumnya label deck-nya campur: "Product focus"
bersebelahan dengan "Periode / Aktivitas". Sekarang seluruh label, header, dan
judul berbahasa Inggris, mengikuti brand guideline dan seluruh materi Toni Black
yang sudah ada. Isi aktivitas per minggu tetap Bahasa Indonesia, karena itu detail
operasional yang akan dikerjakan tim.

**Diverifikasi.** Seluruh teks dicek terhadap daftar *"we don't like"* di guideline
— *best, amazing, ultimate, bold, sexy, trendy, passion, soul, dream*, dan
seterusnya. Nol kemunculan. Kalimat terpanjang 14 kata dalam dua klausa.

## Grafik

Doughnut di slide 3 native PowerPoint, bukan gambar. Klik kanan > *Edit Data*
untuk mengubah angkanya. Legenda di kanannya diketik manual.

## Catatan verifikasi

Validator OOXML lolos. Pemeriksaan geometri dijalankan pada file `.pptx` memakai
metrik font aslinya: lebar tiap teks dihitung terhadap kotaknya, tinggi tabel
dihitung dari jumlah baris (bukan dari nilai tersimpan, yang cuma placeholder
1,00 inci), jumlah baris hasil pembungkusan teks tabel diperiksa terhadap tinggi
barisnya, dan tumpang-tindih antar elemen dicek. Hasil akhir bersih.

Pemeriksaan ini menangkap satu cacat pada versi terisi: `Rp 24.000.000` di baris
Total memakai Zalando Sans Expanded yang lebar dan tidak muat di kolom 1,8 inci —
akan patah jadi dua baris dan melewati tinggi barisnya. Kolom dilebarkan ke 2,2 inci.

## Regenerate

```bash
cd source && node build_deck.js
python3 qa_geometry.py ../ToniBlack_Timeline_Budget.pptx
```
