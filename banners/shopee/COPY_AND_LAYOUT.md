# Banner Shopee Toni Black — Copy & Layout (FINAL)

Hasil akhir ada di `banners/shopee/final/`. Semua dalam batas Shopee: **maks. 2000 × 2000 px, maks. 2 MB.**

| Banner | File | Ukuran | Berkas |
|---|---|---|---|
| Brand Story | `1-brand-story.jpg` | 1600 × 2000 | 475 KB |
| Value — Boxer | `2-value-boxer.jpg` | 1600 × 2000 | 535 KB |
| Value — Brief | `2-value-brief.jpg` | 1600 × 2000 | 559 KB |
| Value — Crewneck | `2-value-crewneck.jpg` | 1600 × 2000 | 685 KB |
| Value — Tanktop | `2-value-tanktop.jpg` | 1600 × 2000 | 682 KB |
| Banner Toko 2 Area Klik | `3-banner-toko.jpg` | 2000 × 2000 | 513 KB |

**Prinsip produksi:** logo dan seluruh teks ditempel dari aset brand asli (`brand/assets/`), tidak pernah digenerate AI. Kie hanya dipakai untuk fotografinya.

**Arah fotografi** mengikuti gaya asli di **toni.black**: hitam-putih penuh, latar studio abu polos, pose rileks dan candid — bukan berdiri simetris ala katalog. Foto kategori resmi mereka (pria bersandar di kursi lipat, anak memegang balon sambil tertawa) dipakai sebagai referensi gaya saat generasi.

**Warna produk:** semua underwear hitam; crewneck dan tanktop putih.

---

## 1. BANNER BRAND STORY

Copy diambil **persis dari brand guideline hal. 27**, seluruhnya bahasa Inggris. Tanpa URL, tanpa handle Instagram, tanpa em dash.

| Slot | Teks |
|---|---|
| Logo | lockup horizontal hitam, kiri atas |
| Eyebrow | `WE ARE` |
| Headline | `MADE TO` / `MOVE` |
| Sub-copy | `Simplicity meets performance. Maximum comfort in an elegant and understated design.` |
| CTA | `Discover Toni Black →` |

Em dash pada kalimat asli guideline ("performance — maximum comfort") diganti titik, jadi dua kalimat pendek. Artinya tidak berubah dan iramanya justru lebih tegas.

**Foto:** pria duduk di kursi bar kayu sambil melepas **crewneck putih Toni Black**, mengenakan **boxer hitam** — waistband `TONI BLACK` terbaca jelas. Pose mengikuti referensi: satu kaki bertumpu di palang kursi, kaki lain menjulur, badan memuntir, tertangkap di tengah gerakan.

**Layout:** figur di sepertiga kanan, kolom teks di kiri. Latar studio diperpanjang ke kiri secara mulus.

---

## 2. BANNER VALUE PRODUCT — 4 VARIAN

Tanpa kata "Series". Tanpa eyebrow "Value Per Product", tanpa baris material/warna, tanpa garis pemisah header-footer. **Logo di tengah atas**, nama produk di tengah bawah.

Semua value diambil **langsung dari icon set resmi Toni Black** (guideline hal. 15).

| Produk | Kiri (atas → bawah) | Kanan (atas → bawah) |
|---|---|---|
| **BOXER** | DURABLE WAISTBAND · SOFT FABRIC · ANTI RIDE-UP | TAGLESS · 4-WAY STRETCH · BREATHABLE |
| **BRIEF** | DURABLE WAISTBAND · SOFT FABRIC · ERGONOMIC FIT | TAGLESS · BREATHABLE · SHAPE RETENTION |
| **CREWNECK** | SOFT FABRIC · BREATHABLE · EASY CARE | TAGLESS · SHAPE RETENTION · COLOR RETENTION |
| **TANKTOP** | SOFT FABRIC · BREATHABLE · LIGHTWEIGHT | MOISTURE WICKING · SHAPE RETENTION · EASY CARE |

**Foto:** model atletis dengan pose dinamis tertangkap di tengah gerakan, latar beton gelap, pencahayaan directional keras yang memahat otot — mengikuti mood referensi. Foto produk asli dikirim sebagai referensi generasi supaya potongan, jahitan, dan waistband akurat.

**Layout:** foto full-bleed, gradasi gelap di tepi dan atas-bawah. Enam label dengan garis penunjuk ke titik spesifik di garmen.

> Detail teknis: label, garis, dan titik penunjuk diberi *casing* gelap. Tanpa ini, elemen putih hilang total di atas crewneck dan tanktop yang juga putih.

---

## 3. BANNER TOKO — 2 AREA KLIK

| Slot | Teks |
|---|---|
| Header | logo horizontal putih, tengah, di atas blok `#282828` |
| Panel kiri | `MEN` · `Brief · Boxer · Singlet` · `Explore The Collection →` |
| Panel kanan | `KIDS` · `Brief · Boxer` · `Explore The Collection →` |

**Foto:** mengikuti gaya kategori di toni.black. Pria bersandar santai di kursi lipat, kaki menyilang, senyum tipis — mengenakan tanktop putih dan boxer hitam. Anak tertangkap sedang tertawa dengan tangan terangkat, mengenakan kaos putih dan boxer hitam. Keduanya hitam-putih.

### Koordinat area klik

| Area | Koordinat (px) | Tautkan ke |
|---|---|---|
| 1 — MEN | x `0–994`, y `250–2000` | etalase Men |
| 2 — KIDS | x `1006–2000`, y `250–2000` | etalase Kids |

---

## Cara membuat ulang

```bash
python3 tools/gen_photos.py                 # semua foto
python3 tools/gen_photos.py value-brief     # satu foto saja
python3 tools/build_banners.py              # susun banner final
```

`tools/kie.py` — klien Kie (upload → createTask → poll → download).
Model `nano-banana-pro`, resolusi 2K. Foto produk asli dan foto kategori toni.black dikirim sebagai `image_input`.

Catatan: filter keamanan Kie kadang menolak prompt underwear secara acak. Kalau sebuah job gagal dengan *"flagged as sensitive"*, jalankan ulang job itu saja — biasanya lolos pada percobaan berikutnya.

## Yang masih terbuka

1. **Harga / promo** belum ada di banner manapun. Kalau perlu, saya tambahkan sebagai elemen sekunder yang bersih memakai CTA resmi (mis. `Save 20% This Weekend`).
2. **Nama produk** memakai `BOXER`, `BRIEF`, `CREWNECK`, `TANKTOP`. Kirim daftar nama resmi di Shopee kalau berbeda.
3. **Varian Kids** untuk banner value product belum dibuat — copy-nya siap: SOFT FABRIC · TAGLESS · BREATHABLE · ANTI RIDE-UP · EASY CARE · MADE FOR MOVEMENT.
