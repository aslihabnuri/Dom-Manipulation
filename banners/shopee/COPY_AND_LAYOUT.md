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

**Layout mengikuti referensi.** Sebelumnya hanya posenya yang sama; sekarang susunannya juga: foto full-bleed, headline besar melintang **menimpa model**, dan hurufnya berganti hitam-putih mengikuti apa yang ada di belakangnya.

**Tanpa eyebrow.** `WE ARE` dihapus karena menggantung, `OUR STORY` juga dihapus karena tidak menambah apa pun.

| Slot | Teks | Sumber |
|---|---|---|
| Logo | lockup horizontal hitam, kiri atas | aset asli |
| Headline | `TAILORED FOR` / `COMFORT.` (di tengah, menimpa model) | hal. 33 |
| Sub-copy | `Defined by originality, driven by innovation.` / `Every detail is created with purpose.` | hal. 33 |
| CTA | `Discover Toni Black →` | hal. 27 |

### Cara teks dua warna itu bekerja

Warna tiap huruf ditentukan dari **luminansi foto di belakang huruf itu sendiri**, bukan disetel manual. Boxer hitam terbaca 26–99, latar studio 195, jadi ambang 132 memisahkannya dengan bersih.

Dua hal yang perlu dibereskan supaya hasilnya tidak terlihat seperti cacat cetak:

1. **Keputusan diambil per huruf, bukan per piksel.** Kalau per piksel, satu huruf bisa terbelah separuh hitam separuh putih — terbaca sebagai salah cetak, bukan desain.
2. **Kotak sampelnya setinggi huruf kapital saja.** Memakai seluruh kotak ascender ikut merata-ratakan ruang kosong di atas huruf, dan hasilnya condong ke warna latar.

### Kenapa sub-copy dan CTA tidak ikut menimpa model

Kalau ditaruh di tengah seperti headline, keduanya melintasi kaki model dan kaki kursi yang bernilai abu tengah — di situ teks hitam maupun putih sama-sama lemah kontrasnya. Kata "Black" pada CTA sempat nyaris hilang di atas kaki kursi.

Jadi keduanya dipindah ke kolom kiri. Area x 100–700 sudah diukur: nilai tergelapnya 148, jadi teks hitam aman terbaca di semua ketinggian. Headline tetap dapat perlakuan dramatis, teks pendukung tetap terbaca.

**Foto:** pria duduk di kursi bar melepas crewneck putih Toni Black, mengenakan boxer hitam dengan waistband `TONI BLACK` terbaca.

---

## 2. BANNER VALUE PRODUCT — CAROUSEL 4 SLIDE

### Values sebagai acuan point (hal. 34)

Kelima brand value **menjadi point-nya**, bukan hiasan di atas nama produk. Kicker di atas nama produk sudah dihapus.

Setiap slide membawa **lima value yang sama, di posisi yang sama**. Yang berubah cuma bukti fisiknya di garmen itu — inilah yang membuat carousel terasa satu rangkaian, bukan empat gambar terpisah.

| Brand value (hal. 34) | Boxer | Brief | Crewneck | Tanktop |
|---|---|---|---|---|
| CONFIDENCE | Durable waistband | Durable waistband | Shape retention | Shape retention |
| PRECISION & FIT | Ergonomic cut | Ergonomic fit | Tailored cut | Ergonomic cut |
| MODERN MASCULINITY | Refined silhouette | Refined silhouette | Clean silhouette | Refined silhouette |
| AUTHENTIC SIMPLICITY | Tagless finish | Tagless finish | Tagless collar | Clean seams |
| CONTINUOUS INNOVATION | 4-way stretch | Shape retention | Breathable cotton | Moisture wicking |

Baris pendukung di bawah tiap value memakai kosakata icon set hal. 15, jadi value yang abstrak tetap punya bukti yang bisa ditunjuk garis ke bagian fisik garmen.

### Foto: satu pemotretan, empat slide

Keempat foto digenerate sebagai **satu seri berkelanjutan**. Foto boxer dibuat lebih dulu, lalu dipakai sebagai referensi untuk tiga sisanya — hasilnya model, studio, arah cahaya, jarak kamera, dan framing identik di keempat slide. Di slide crewneck dan tanktop, model tetap memakai boxer hitam yang sama, jadi carousel terbaca sebagai satu look yang berkembang.

Framing seragam: bahu sampai atas lutut, model di tengah, ruang gelap di kiri-kanan untuk anotasi.

### Filter

Gradasi tepi lama memakai kurva yang dipotong, jadi ada garis mendatar yang kelihatan di dekat atas. Sekarang memakai **smoothstep** — kemiringannya nol di kedua ujung — plus blur halus, jadi gradasinya habis tanpa batas yang terlihat.

### QA otomatis

Ada dua cacat yang lolos sampai slide jadi, keduanya sekarang dicek otomatis tiap build:

1. **Garis penunjuk menembus tulisannya sendiri.** `CONTINUOUS INNOVATION` adalah label terpanjang, jadi blok teksnya melebar sampai x=934 sementara titik anchor-nya ada di x=915–976 — di dalam blok itu sendiri. Akibatnya garis diagonal naik memotong huruf C. Terjadi di **keempat slide**, bukan cuma slide 1.
2. **Garis penunjuk menembus logo.** Di slide crewneck, titik `Tagless collar` justru berada persis di belakang logo.

`check_calls()` di `tools/build_banners.py` sekarang menolak build kalau ada garis yang memotong blok teksnya sendiri atau melewati kotak logo. Kalau nanti ada value atau produk baru, cacat yang sama tidak bisa lolos lagi.

Selain itu semua titik anchor dicek ulang satu per satu supaya mendarat di garmen yang disebut — sebelumnya ada yang jatuh di paha telanjang pada slide brief.

### Layout

Logo di tengah atas, nama produk di tengah bawah. Tiga value di kolom kiri, dua di kanan, diselang-seling supaya ritmenya rapi. Garis penunjuk setipis mungkin, titik kecil, semua dengan casing gelap agar terbaca di atas garmen putih maupun latar gelap.

Warna: underwear hitam, crewneck dan tanktop putih.

---

## 2b. VERSI ALL-IN-ONE (opsional, pengganti carousel)

`4-value-all-in-one.jpg` — 2000 × 2000, 690 KB.

Menempel keempat slide jadi satu grid tidak bisa dipakai. Banner Shopee tampil sekitar 430 px di layar HP, jadi:

| Susunan | Tinggi huruf label di HP | |
|---|---|---|
| 1 slide carousel | 8,1 px | terbaca |
| 4 produk di-tile 2×2 | 4,1 px | tidak terbaca |
| 4 produk berjajar | 2,1 px | tidak terbaca |
| **1 banner, value ditulis sekali** | **7,7 px** | **terbaca** |

Jadi versi all-in-one disusun ulang, bukan ditempel:

- **Kelima brand value ditulis sekali** di atas satu foto hero yang memakai full look (crewneck putih + boxer hitam). Ukuran labelnya setara satu slide carousel, jadi tetap terbaca.
- **Keempat produk berjajar di bawah** sebagai line-up dengan namanya masing-masing.

Bagian atas foto sengaja dilebur ke hitam. Frame sumbernya mulai dari dagu model, jadi kalau dipotong begitu saja akan menyisakan potongan dagu di tepi.

**Kapan pakai yang mana:**

| | Carousel 4 slide | All-in-one |
|---|---|---|
| Detail per produk | tiap produk dapat 5 value yang menunjuk ke bagiannya sendiri | value hanya ditunjukkan di satu produk |
| Slot Shopee | butuh 4 | butuh 1 |
| Paling cocok untuk | halaman produk, konten yang di-scroll | banner utama toko |

Keduanya bisa dipakai bersamaan: all-in-one untuk banner toko, carousel untuk halaman produk.

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
