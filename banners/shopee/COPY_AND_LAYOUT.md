# Banner Shopee Toni Black — Copy & Layout (FINAL)

Hasil akhir ada di `banners/shopee/final/`. Semua dalam batas Shopee: **maks. 2000 × 2000 px, maks. 2 MB.**

| Banner | File | Ukuran | Berkas |
|---|---|---|---|
| Brand Story | `1-brand-story.jpg` | 1600 × 2000 | 464 KB |
| Value — Boxer | `2-value-boxer.jpg` | 1600 × 2000 | 535 KB |
| Value — Brief | `2-value-brief.jpg` | 1600 × 2000 | 559 KB |
| Value — Crewneck | `2-value-crewneck.jpg` | 1600 × 2000 | 686 KB |
| Value — Tanktop | `2-value-tanktop.jpg` | 1600 × 2000 | 685 KB |
| Banner Toko 2 Area Klik | `3-banner-toko.jpg` | 2000 × 2000 | 511 KB |

---

## Sumber copy & tipografi

Seluruh copy bersumber dari brand guideline, tidak ada yang dikarang:

| Elemen | Sumber |
|---|---|
| Narasi brand story | **hal. 33** (Story) |
| Kicker di banner value | **hal. 34** (Values) |
| Gaya bahasa | **hal. 35** (Tone of Voice) |
| Label fitur produk | **hal. 15** (icon set) |
| CTA | **hal. 29** (daftar CTA resmi) |

**Font:** file resmi dari folder `Font` di Drive Anda — `Arimo.zip` dan `Zalando_Sans_Expanded.zip`, bukan unduhan pihak ketiga. Terpasang di `brand/assets/fonts/`:

| Peran | Font | Weight yang dipakai |
|---|---|---|
| Headline & label | Zalando Sans Expanded | Regular · SemiBold · Bold · ExtraBold · Black |
| Body & deskripsi | Arimo | Regular · Medium · Bold |

**Audit tone of voice (hal. 35):** tidak ada satu pun kata terlarang (*best, amazing, super, ultimate, trendy, bold, sexy, wild, bro, vibe, passion, soul, dream, heart*). Semua kalimat ringkas, aktif, langsung ke poin. Tanpa em dash.

---

## 1. BANNER BRAND STORY

Eyebrow `WE ARE` dihapus. Kalimatnya menggantung dan tidak terbaca sebagai unit yang utuh — kalau dibaca cepat, orang bertanya "we are apa?" Diganti `OUR STORY`, yang lengkap sebagai label dan langsung menandai isinya.

| Slot | Teks | Sumber |
|---|---|---|
| Logo | lockup horizontal hitam, kiri atas | aset asli |
| Eyebrow | `OUR STORY` | — |
| Headline | `TAILORED FOR` / `COMFORT.` | hal. 33 |
| Sub-copy | `Defined by originality, driven by innovation.` / `Every detail is created with purpose.` | hal. 33 |
| CTA | `Discover Toni Black →` | hal. 27 |

Kalimat lengkap hal. 33 berbunyi *"Tailored for comfort, defined by originality, driven by innovation."* Dipecah jadi headline dan sub-copy supaya tetap satu kalimat utuh saat dibaca berurutan, tapi punya hierarki visual.

**Foto:** pria duduk di kursi bar melepas **crewneck putih Toni Black**, mengenakan **boxer hitam** dengan waistband `TONI BLACK` terbaca. Figur di sepertiga kanan, kolom teks di kiri.

---

## 2. BANNER VALUE PRODUCT — 4 VARIAN

**Tipografi label sekarang seragam: 28px untuk keenam label di keempat banner.** Sebelumnya tiap label dikecilkan sendiri-sendiri agar muat, jadi ukurannya tidak rata. Sekarang satu ukuran dihitung sekali untuk semua, dari label terpanjang di varian tersempit.

Di bawah nama produk ditambahkan **brand value dari hal. 34**:

| Produk | Brand value (hal. 34) | Kiri | Kanan |
|---|---|---|---|
| **BOXER** | `PRECISION & FIT` | Durable Waistband · Soft Fabric · Anti Ride-Up | Tagless · 4-Way Stretch · Breathable |
| **BRIEF** | `PRECISION & FIT` | Durable Waistband · Soft Fabric · Ergonomic Fit | Tagless · Breathable · Shape Retention |
| **CREWNECK** | `AUTHENTIC SIMPLICITY` | Soft Fabric · Breathable · Easy Care | Tagless · Shape Retention · Color Retention |
| **TANKTOP** | `CONTINUOUS INNOVATION` | Soft Fabric · Breathable · Lightweight | Moisture Wicking · Shape Retention · Easy Care |

Enam label tetap memakai kosakata icon set hal. 15, karena label-label inilah yang ditunjuk garis penunjuk ke bagian fisik garmen. Brand value hal. 34 bersifat abstrak (*Confidence*, *Modern Masculinity*), jadi tidak bisa menunjuk ke waistband atau jahitan — makanya ditempatkan sebagai kicker di bawah, bukan sebagai callout.

Kalau Anda memang ingin kelima brand value hal. 34 yang jadi callout utama menggantikan fitur produk, bilang saja — tinggal ditukar.

Warna: semua underwear hitam, crewneck dan tanktop putih.

---

## 3. BANNER TOKO — 2 AREA KLIK

**Blok hitam di header dihapus.** Sekarang header putih bersih dengan logo hitam dan garis rambut `#DCDCDC` di bawahnya. Bar label bawah juga putih dengan teks hitam, plus garis rambut di atasnya. Satu garis vertikal tipis memisahkan dua area klik.

Hasilnya jauh lebih ringan dan sesuai karakter brand: *Clean White* adalah warna primer, dan guideline meminta "clarity over decoration".

| Slot | Teks |
|---|---|
| Header | logo horizontal hitam, tengah, latar putih |
| Panel kiri | `MEN` · `Brief · Boxer · Singlet` · `Explore The Collection →` |
| Panel kanan | `KIDS` · `Brief · Boxer` · `Explore The Collection →` |

### Koordinat area klik

| Area | Koordinat (px) | Tautkan ke |
|---|---|---|
| 1 — MEN | x `0–993`, y `230–2000` | etalase Men |
| 2 — KIDS | x `1007–2000`, y `230–2000` | etalase Kids |

---

## Cara membuat ulang

```bash
python3 tools/gen_photos.py                 # semua foto
python3 tools/gen_photos.py value-brief     # satu foto saja
python3 tools/build_banners.py              # susun banner final
```

`tools/kie.py` — klien Kie (upload → createTask → poll → download).
Model `nano-banana-pro`, resolusi 2K. Foto produk asli dan foto kategori toni.black dikirim sebagai `image_input`.

Catatan: filter keamanan Kie kadang menolak prompt underwear secara acak. Kalau sebuah job gagal dengan *"flagged as sensitive"*, jalankan ulang job itu saja.

## Yang masih terbuka

1. **Harga / promo** belum ada di banner manapun.
2. **Nama produk** memakai `BOXER`, `BRIEF`, `CREWNECK`, `TANKTOP`. Kirim daftar nama resmi di Shopee kalau berbeda.
3. **Varian Kids** untuk banner value product belum dibuat — copy-nya siap: Soft Fabric · Tagless · Breathable · Anti Ride-Up · Easy Care · Made For Movement.
