# Banner 8.8 — nomukita.

Banner promo 8.8: **8.8**, **Hemat hingga 50%**, **Gratis Ongkir**. Format 1080×1350 (4:5).

| File | Konsep | Output |
|---|---|---|
| `banner.html` | **Versi aktif.** Font brand asli, diskon sebagai elemen terbesar, doodle garis (orang + kucing), fotografi bayangan daun | `nomukita-88.*` |
| `banner-55.html` | Identik, angka 55% | — |
| `banner-serif.html` | Versi sebelumnya, tipografi Poppins + Cormorant | `nomukita-88-serif.*` |
| `banner-plush50.html` · `banner-plush35.html` · `banner-photo.html` | Arah ilustrasi 3D dan fotografi awal | `nomukita-88-plush50.*` dll |

```bash
npm i
./design/8.8/install-fonts.sh     # sekali saja, lihat "Font" di bawah
node design/8.8/render.mjs
```

## Font — baca ini dulu

Mengikuti **"NOMUKITA - DESIGN SYSTEM CAROUSEL MARKETPLACE"** (dikunci 24 Juli 2026,
ada di Drive root folder Nomukita):

| Peran | Font |
|---|---|
| Headline / angka | All Round Gothic **Bold** |
| Label letterspaced | All Round Gothic **Demi**, tracking 5–7 |
| Body | **Comfortaa**, huruf kecil |
| Kanji | **Shippori Mincho** |

File fontnya **tidak ada di repo ini**. All Round Gothic beredar sebagai
Fontspring DEMO dan lisensinya per-seat, jadi tidak boleh ikut di-commit.
Ambil `All Round Gothic.zip` dan `Comforta.zip` dari Drive, taruh di
`design/8.8/fonts/`, lalu jalankan `install-fonts.sh`.

### Karakter yang terkunci di font DEMO

Design system mencatat `-`, `–`, `°`, dan angka `4` terkunci. **Pengujian
menunjukkan `%` juga terkunci** — ini belum tercatat di dokumen. Semua karakter
itu muncul sebagai tanda daun "DEMO" saat dirender.

Karena itu `%` pada banner ini **digambar sebagai vektor SVG**, bukan teks, dengan
`stroke-width` disamakan dengan bobot angkanya. Lihat `.pct svg` di `banner.html`.

Konsekuensi untuk banner berikutnya: **hindari angka diskon yang mengandung 4**
(45%, 40%, 24%…) selama masih memakai font DEMO, atau gambar digit itu sebagai
vektor juga. Beli lisensi resmi sebelum produksi massal.

Setelah lisensi dibeli, ganti `--brand-display` dan `--brand-label` di `:root` —
tidak ada bagian lain yang perlu diubah, dan `%` bisa dikembalikan jadi teks.

## Warna

Dari design system: matcha `#7A9A3F`, charcoal `#1C1C1C`, bone white `#F1F0EB`,
Nomu Blue `#A8C4D8`.

Di banner ini teks memakai bone white di area teduh atas dan charcoal di beton
terang bawah — kontras diambil dari tonalitas fotonya. Aturan "headline warna
kategori (matcha)" berlaku untuk slide carousel berlatar bone white; di atas
foto, matcha green tidak cukup terbaca.

## Copy

Design system §6: tanpa kata promosi berlebihan, tanpa tanda seru, tanpa klaim
kesehatan. Headline & info teknis Inggris, boleh campur Indonesia.

Copy di banner ini memakai frasa brand yang sudah ada: **"HEMAT HINGGA"** (dari
`Diskon Banner_BAU`) dan **"GRATIS ONGKIR"**, ditambah satu baris pendukung
**"ceremonial grade untuk hari matcha-mu"** — memakai istilah produk mereka
sendiri, tanpa kata promosi berlebihan. Tagline "bring the cafe home" sempat
dipakai lalu dihapus atas permintaan.

**Gratis Ongkir memakai pill hijau matcha** (`#7A9A3F`, warna headline design
system) dengan teks bone white. Sebelumnya berupa teks charcoal bergaris tipis
dan kurang menonjol; pill berlatar solid terbaca di bagian foto mana pun.

## Aset

| File | Asal |
|---|---|
| `assets/photo.jpg` | `nano-banana-pro`, dengan mockup kaleng asli sebagai `image_input` |
| `assets/girl.png`, `cat-reach.png` | `nano-banana-pro` line art, latar putih dikeykan jadi transparan |
| `assets/logo.png` | file logo brand asli |

**Label kaleng wajib diperiksa kalau foto digenerate ulang.** Generate pertama
menulis `銘有錄・むレモニアルグレード`; yang benar `純有機・セレモニアルグレード`.
Diperbaiki dengan pass kedua yang mengirim foto hasil *dan* mockup asli sekaligus.

## Cara ubah isi

| Yang diubah | Di mana |
|---|---|
| `8.8`, `MATCHA DAY` | `.top` |
| Label & angka diskon | `.save` dan `.pct` |
| Gratis ongkir | `.foot` |
| Posisi doodle | `.girl`, `.cat`, dan `svg.doodle` |

## Doodle

Skalanya diambil dari referensi: figur mengisi **~41% tinggi kanvas** (554 px di
kanvas 1350) dan tangannya menyentuh produk. Ukuran awal 24% terlalu kecil dan
tidak terbaca.

Posisi tangan dihitung, bukan dikira-kira. Ujung jari pada `assets/girl.png` ada
di **62,3% lebar** dan **47,3% tinggi** artwork, jadi pada tinggi 554 px:

```
left = x_target − 0,623 × lebar     top = y_target − 0,473 × tinggi
```

Dengan target ujung jari di tepi kiri-atas kaleng, hasilnya `left:97 top:583
width:446`. Kaki dan badannya berhenti di 57,7% lebar, jadi tidak menutupi
kaleng — hanya lengannya yang melintas.

Kucingnya memakai rumus yang sama. Cakar terangkatnya ada di **33,8% lebar** dan
**9,4% tinggi** artwork, jadi jarak cakar-ke-kaki adalah 90,6% tingginya. Supaya
kakinya menapak garis tanah gelas (y 1075) dan cakarnya menyentuh bibir gelas
strawberry (y 700), tingginya harus 414 px:

```
tinggi = (y_kaki − y_cakar) / 0,906     left = x_cakar − 0,338 × lebar
```

Hasilnya `left:752 top:661 width:334`. Pose berdiri-menggapai ini digenerate
khusus — pose berjalan sebelumnya hanya bisa diperbesar, tidak bisa berinteraksi
dengan produk seperti pada referensi.

Warna garisnya hitam, jadi posisinya harus jatuh di beton terang. Untuk kotak
sebesar kucing ini seluruh area bawah setara (rata-rata ~176–182), jadi posisi
dipilih berdasarkan komposisi. Untuk elemen kecil bedanya nyata: `x 596, y 1016`
bernilai ~222 sedangkan `x 120, y 1078` hanya ~150 — di situ kucing sempat hilang.
