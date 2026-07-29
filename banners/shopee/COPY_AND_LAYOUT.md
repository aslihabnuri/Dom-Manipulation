# Banner Shopee Toni Black — Copy & Layout (FINAL)

Hasil akhir ada di `banners/shopee/final/`. Semua dalam batas Shopee: **maks. 2000 × 2000 px, maks. 2 MB.**

| Banner | File | Ukuran | Berkas |
|---|---|---|---|
| 1. Brand Story | `1-brand-story.jpg` | 1600 × 2000 (4:5) | 477 KB |
| 2. Value Product | `2-value-product.jpg` | 1600 × 2000 (4:5) | 608 KB |
| 3. Banner Toko 2 Area Klik | `3-banner-toko.jpg` | 2000 × 2000 (1:1) | 617 KB |

Prinsip produksi: **logo dan seluruh teks ditempel dari aset brand asli** (`brand/assets/`), tidak pernah digenerate AI — jadi bentuk logo dan tipografinya 100 % akurat. Kie hanya dipakai untuk fotografinya.

---

## 1. BANNER BRAND STORY

Copy diambil **persis dari brand guideline hal. 27**, seluruhnya bahasa Inggris. Tanpa URL dan tanpa handle Instagram.

| Slot | Teks | Font |
|---|---|---|
| Logo | lockup horizontal hitam, kiri atas | aset asli |
| Eyebrow | `WE ARE` | Zalando Sans Expanded 600, tracking lebar |
| Headline | `MADE TO` / `MOVE` | Zalando Sans Expanded 800 |
| Sub-copy | `Simplicity meets performance — maximum comfort in an elegant and understated design.` | Arimo 400 |
| CTA | `Discover Toni Black →` | Zalando Sans Expanded 700 |

**Foto:** dibuat ulang mengikuti referensi Anda — pria duduk di kursi bar kayu gelap sambil menarik crewneck ke atas kepala, mengenakan boxer Toni Black. Latar studio abu polos, monokrom, kontras tajam.

**Layout:** figur di sepertiga kanan, kolom teks di kiri di atas latar bersih (rule of thirds sesuai guideline). Latar studio diperpanjang ke kiri secara mulus karena latarnya polos.

> Catatan: crewneck di foto dibuat charcoal-hitam, bukan putih. Crewneck putih (produk yang fotonya ada di Drive) ditolak filter keamanan Kie, dan versi gelap juga lebih kontras terhadap latar abu terang — sekaligus lebih dekat ke referensi Anda. Kalau Anda tetap mau versi putih, bisa saya coba lagi dengan susunan prompt berbeda.

---

## 2. BANNER VALUE PRODUCT

Sesuai revisi: **tanpa** teks "Value Per Product", **tanpa** baris "Men · Cotton–Spandex · …", **tanpa** garis pemisah header/footer. **Logo di tengah atas.**

Seluruh value diambil **langsung dari icon set resmi Toni Black** (guideline hal. 15) — tanpa deskripsi tambahan, sama bersihnya dengan referensi Anda.

| Posisi | Value |
|---|---|
| Kiri atas | `DURABLE WAISTBAND` |
| Kiri tengah | `SOFT FABRIC` |
| Kiri bawah | `ANTI RIDE-UP` |
| Kanan atas | `TAGLESS` |
| Kanan tengah | `4-WAY STRETCH` |
| Kanan bawah | `BREATHABLE` |

Nama produk di bawah tengah: `BOXER SERIES`

**Foto:** pria mengenakan boxer Toni Black, dibingkai dari dada sampai bawah lutut, boxer sebagai fokus utama. Latar beton gelap, pencahayaan directional keras — mengikuti mood referensi. Foto produk asli dipakai sebagai referensi generasi supaya potongan dan waistband-nya akurat.

**Layout:** foto full-bleed, gradasi gelap di tepi kiri-kanan dan atas supaya label dan logo tetap terbaca. Enam label dengan garis penunjuk tipis ke titik spesifik di boxer.

### Value untuk produk lain (template siap pakai)

Layout-nya sama, tinggal ganti foto dan enam label ini:

| Produk | 6 Value |
|---|---|
| **BRIEF SERIES** | DURABLE WAISTBAND · SOFT FABRIC · TAGLESS · BREATHABLE · ERGONOMIC FIT · SHAPE RETENTION |
| **SINGLET SERIES** | SOFT FABRIC · MOISTURE WICKING · LIGHTWEIGHT · SHAPE RETENTION · BREATHABLE · EASY CARE |
| **CREWNECK SERIES** | SOFT FABRIC · BREATHABLE · SHAPE RETENTION · COLOR RETENTION · TAGLESS · EASY CARE |
| **KIDS SERIES** | SOFT FABRIC · TAGLESS · BREATHABLE · ANTI RIDE-UP · EASY CARE · MADE FOR MOVEMENT |

---

## 3. BANNER TOKO — 2 AREA KLIK

| Slot | Teks |
|---|---|
| Header | logo horizontal putih, tengah, di atas blok `#282828` |
| Panel kiri | `MEN` · `Brief · Boxer · Singlet` · `Explore The Collection →` |
| Panel kanan | `KIDS` · `Brief · Boxer` · `Explore The Collection →` |

**Foto:** kedua foto dibuat ulang agar lebih berkarakter — model pria dengan ekspresi tenang dan percaya diri, pencahayaan kontras; model anak dengan senyum natural dan pose santai. Keduanya dibingkai kepala sampai paha supaya skalanya setara.

### Koordinat area klik

| Area | Koordinat (px) | Tautkan ke |
|---|---|---|
| 1 — MEN | x `0–994`, y `250–2000` | etalase Men |
| 2 — KIDS | x `1006–2000`, y `250–2000` | etalase Kids |

---

## Cara membuat ulang

```bash
python3 tools/gen_photos.py     # generate fotografi via Kie (butuh KIE_API_KEY di .env)
python3 tools/build_banners.py  # susun banner final
```

`tools/kie.py` — klien Kie (upload → createTask → poll → download).
Model: `nano-banana-pro`, resolusi 2K, foto produk asli dikirim sebagai `image_input`.

## Yang masih terbuka

1. **Harga / promo** belum ada di banner manapun. Kalau perlu, saya tambahkan sebagai elemen sekunder yang bersih memakai CTA resmi (mis. `Save 20% This Weekend`) — bukan badge merah menyala.
2. **Nama produk** masih memakai pola "BOXER SERIES". Kirim daftar nama resmi di Shopee kalau berbeda.
3. **Varian value product lain** (Brief, Singlet, Crewneck, Kids) tinggal dijalankan — copy-nya sudah siap di tabel di atas.
