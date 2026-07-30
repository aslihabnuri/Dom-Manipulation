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

Warna tiap huruf ditentukan dari **luminansi foto di belakang huruf itu sendiri**, bukan disetel manual.

Tiga hal yang menentukan hasilnya terbaca sebagai desain atau sebagai cacat:

1. **Keputusan per huruf, bukan per piksel.** Kalau per piksel, satu huruf bisa terbelah separuh hitam separuh putih — terbaca sebagai salah cetak.
2. **Kotak sampelnya setinggi huruf kapital saja.** Memakai seluruh kotak ascender ikut merata-ratakan ruang kosong di atas huruf, dan hasilnya condong ke warna latar.
3. **Ambangnya di titik tengah kedua tinta, (40+255)/2 = 148.** Ini titik yang memaksimalkan kontras terlemah: di bawahnya putih lebih jauh jaraknya dari latar, di atasnya hitam. Ambang yang lebih rendah menyerahkan latar abu tengah ke hitam padahal putih lebih terbaca di situ.

### Isian penuh, bukan garis luar

Sempat saya pasang halo berwarna kebalikan untuk menolong huruf di atas latar abu tengah. Hasilnya salah: hurufnya jadi terbaca sebagai **teks outline** — bagian putihnya cuma garis tepi, bukan isian. Itu bahasa visual yang berbeda dari referensi, yang memakai isian solid tegas.

Halo dihapus. Akar masalahnya ternyata di tempat lain: teks kecil dulu memakai blur yang jauh lebih lembut untuk mencegah kaki kursi tipis membalik huruf satu-satu. Tapi pelembutan itu juga membuat huruf yang menumpuk tepat di tepi kaki kursi merata-rata ke warna yang salah, lalu hilang di dalamnya. Sekarang semua ukuran memakai blur yang sama sehingga mengikuti tepi sebenarnya, dan setiap huruf jadi satu warna solid.

**CTA tetap di kiri bawah.** Kalau ikut ditaruh di tengah paling bawah, ia mendarat di kaki kursi dan tulang kering — persis ground abu tengah yang sama, tapi tanpa cukup ruang bersih di sekitarnya untuk diselamatkan.

**Foto:** pria duduk di kursi bar melepas crewneck putih Toni Black, mengenakan boxer hitam dengan waistband `TONI BLACK` terbaca.

---

## 1b. SLIDE 2 — PRODUCT VALUE

`5-product-value.jpg` — 1600 × 2000, ukuran sama dengan slide 1.

Mengikuti referensi `Banner Product Value_Referensi`, tapi **tanpa blok panel**. Teks duduk langsung di atas latar foto sendiri.

| Slot | Teks | Sumber |
|---|---|---|
| Logo | lockup horizontal hitam, tengah atas | aset asli |
| Headline | `BUILT FOR EVERYDAY` / `PERFORMANCE` | hal. 29 (daftar CTA) |
| Sub-copy | `Refined for lasting comfort.` / `Available in M, L and XL.` | hal. 35 kosakata |
| Ikon fitur | `BREATHABLE` · `TAGLESS` · `DURABLE WAISTBAND` · `4-WAY STRETCH` | hal. 15 |

### Kenapa tidak butuh blok putih

Fotonya sengaja digenerate dengan **sepertiga atas dan seperenam bawah kosong**. Zona itu diukur: titik tergelapnya 228 dan 239 dari 255, jadi teks hitam kontrasnya jauh melebihi cukup. Blok putih hanya diperlukan kalau latar fotonya ramai — di sini tidak.

### Penataan produk: cutout asli, bukan hasil generate

Versi generate sempat mengarang produk yang tidak ada. Saya menyimpulkan lini produknya dari icon set guideline hal. 15 (yang mencantumkan Trunks), bukan dari foto produk Anda — hasilnya muncul trunk yang tidak Anda jual, dan boxer berkaki panjang padahal boxer Anda berkaki pendek.

Sekarang **tidak ada foto produk yang digenerate sama sekali**. Ketiganya adalah file ghost mannequin asli dari Drive, PNG berlatar transparan, disusun langsung:

| Posisi | File asli | Bentuk |
|---|---|---|
| Kiri | `Brief dewasa/6.png` | brief dewasa |
| Tengah (hero) | `Boxer dewasa/6a.png` | boxer dewasa, **kaki pendek** |
| Kanan | `Boxer anak/6.png` | boxer anak |

Tersimpan di `brand/assets/products/`. Ketiganya menampilkan lini Men dan Kids sekaligus, sejalan dengan dua kategori di banner toko.

Panggungnya digambar oleh `tools/compose_stilllife.py`: silinder pucat dengan permukaan atas, badan berbayang (cahaya dari kiri atas), dan lengkung depan alasnya. Tinggi panggung berbeda-beda, hero di tengah paling tinggi dan paling depan. Garmen didudukkan sedikit melewati garis tengah elips — kalau tepat di garis tengah, ia terbaca melayang di atas bagian belakang panggung, bukan bertumpu di atasnya.

Boxer anak sengaja jauh lebih kecil karena memang ukurannya begitu; skalanya bukan disamakan.

Skalanya disamakan berdasarkan **lebar terlebar (pinggul)**. Waistband sebenarnya datum yang lebih tepat karena ketiganya satu ukuran pinggang, tapi brief-nya difoto menyudut sehingga waistband-nya memendek secara perspektif dan brief jadi terlalu kecil.

### Ikonnya bukan gambar baru

Keempat ikon **diambil langsung dari icon set resmi guideline hal. 15**, bukan digambar ulang atau digenerate. Diekstrak sebagai PNG transparan memakai geometri vektor halaman itu sendiri.

Ukurannya disamakan berdasarkan **tinggi**, bukan kotak pembatas — ikon waistband bentuknya lebar dan pendek, jadi kalau dipaskan ke kotak ia terlihat lebih kecil dari yang lain.

### Yang sengaja tidak diikuti dari referensi

1. **Pita sudut "NEW ELASTIC WAIST".** Guideline hal. 35 melarang gaya promosi hiperbolik. Bisa ditambahkan kalau Anda mau.
2. **Tiga titik warna produk.** Underwear Toni Black hanya hitam, jadi swatch tiga warna akan menyesatkan. Ruangnya diisi informasi ukuran.
3. **Kode produk** (`FM 3056 N` di referensi) belum ada karena kode aslinya belum saya terima.

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
