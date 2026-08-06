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
`Diskon Banner_BAU`), **"GRATIS ONGKIR"**, dan tagline resmi
**"bring the cafe home"** (design system §8 slide 9).

## Aset

| File | Asal |
|---|---|
| `assets/photo.jpg` | `nano-banana-pro`, dengan mockup kaleng asli sebagai `image_input` |
| `assets/girl.png`, `cat.png` | `nano-banana-pro` line art, latar putih dikeykan jadi transparan |
| `assets/logo.png` | file logo brand asli |

**Label kaleng wajib diperiksa kalau foto digenerate ulang.** Generate pertama
menulis `銘有錄・むレモニアルグレード`; yang benar `純有機・セレモニアルグレード`.
Diperbaiki dengan pass kedua yang mengirim foto hasil *dan* mockup asli sekaligus.

## Cara ubah isi

| Yang diubah | Di mana |
|---|---|
| `8.8`, `MATCHA DAY` | `.top` |
| Label & angka diskon | `.save` dan `.pct` |
| Gratis ongkir, tagline | `.foot`, `.tagline` |
| Posisi doodle | `.girl`, `.cat`, dan `svg.doodle` |

Posisi doodle dipilih dengan mengukur kecerahan foto (garis hitam hilang di area
bayangan). Titik terang yang terukur: sekitar `x 560–600, y 1080–1120` dan
`x 280–320, y 1020–1060`.
