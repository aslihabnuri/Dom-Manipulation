# Toni Black — 9 to 9 (Set Banner September)

**9 to 9** bukan soal jam sembilan pagi sampai sembilan malam secara harfiah. Itu
tema: nyaman dipakai seharian, apa pun isi harinya. Tiap banner mengambil satu
**occasion berbeda** yang membuktikan hal yang sama, dengan talent yang sama.

## Peta banner

| Banner | Ukuran | Occasion | Pesan |
|---|---|---|---|
| **Brand Story** | 1600 × 2000 | Jeda sejenak di tengah hari | *Halfway through the day. Still not thinking about it.* |
| **Product Value** | 1600 × 2000 | Sembilan jam di meja kerja | *No riding up. No adjusting.* |
| **Category** | 2000 × 2000 | Akhir pekan yang santai | *Days off count too.* |
| **BAU Voucher** | 2000 × 1000 | Pagi, bersiap berangkat | *It starts the moment you put them on.* |
| **Payday** | 1920 × 1080 · 1920 × 960 | Pulang malam | *Twelve hours in the same pair.* |
| **9.9 Twindate** | 1920 × 1080 · 1920 × 960 | Selesai latihan | *Nine hours in. A workout later.* |

Ukurannya mengikuti banner Agustus Anda yang sudah jadi. Tiap file tersedia `@2x`
dan 1x.

Banner **Product Value** sengaja dibingkai duduk dan lebih rapat ke produk —
frame itu ada khusus untuk memperlihatkan celananya tidak naik atau menggumpal
saat dipakai duduk berjam-jam. Ini menjawab arahan guideline *"tight framing on
products"* yang selama ini jadi catatan terbuka.

## Sistem

**Satu talent.** Frame 21:00 dipakai sebagai image input untuk semua generate
berikutnya, dengan instruksi eksplisit mengunci wajah, rambut, postur dan wardrobe.

**Headline dikunci ke garis waistband.** Tepi atas celana dideteksi per foto lewat
gradien vertikal, lalu blok tipografi diletakkan di ketinggian itu. Tiap foto dapat
posisi sendiri (47,0% sampai 52,5%) di bawah satu aturan.

**Tipografi mengikuti ruang yang diberikan foto.** Zona bersih tiap plate diukur
dulu (mean dan standar deviasi per area), lalu blok copy ditempatkan di sisi yang
paling rata — kiri, atas, atau bawah. Karena itu set-nya tidak terasa mekanis.

**Tinta ditentukan per elemen, bukan per banner.** Luminansi latar diukur tepat di
posisi tiap elemen, lalu logo, headline, dan CTA masing-masing memilih putih atau
charcoal. Ini menutup bug di mana logo charcoal sempat mendarat di latar gelap.

**Tabrakan dicegah, bukan ditebak.** Setelah render, posisi blok tengah dan blok
bawah diperiksa; kalau bertabrakan (layout penawaran di format pendek), CTA
dialirkan masuk ke bawah copy. Ini memperbaiki tombol yang sempat menimpa teks di
dua banner promo 2:1.

## Kepatuhan brand guideline

| Item | Hasil |
|---|---|
| Warna | Semua memetakan ke token brand |
| Kontras teks | 9,9:1 sampai 21:1 — semua di atas AAA |
| Foto | Chroma 0.00–0.01, hitam-putih murni |
| Tipografi | Zalando Sans Expanded + Arimo |
| Logo | Putih atau charcoal sesuai latar, solid, tanpa efek |

## Produksi

Enam plate digenerate dengan Nano Banana 2 via kie.ai. Yang landscape di 16:9 4K,
yang portrait di 4:5 4K, yang persegi di 1:1 4K — digenerate di rasio aslinya,
bukan di-crop dari landscape. Semua plate didesaturasi ke greyscale murni. Tidak
ada teks yang digenerate AI.

Untuk regenerate:

```bash
cd source && python3 build.py     # butuh playwright + chromium
```

Tambah occasion baru dengan menambah entri di `BANNERS`, lalu jalankan ulang
deteksi zona (`zones.json`) supaya rel tipografinya menyesuaikan.
