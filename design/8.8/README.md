# Banner 8.8 — nomukita.

Banner promo 8.8: **8.8**, **Disc up to 50%**, **Gratis Ongkir**. Format 1080×1350 (4:5).

| File | Konsep | Output |
|---|---|---|
| `banner.html` | **Versi aktif.** Fotografi bayangan daun di beton, packaging can asli + matcha latte & matcha strawberry, doodle garis minimal — mengikuti `Banner 8.8` di Drive | `nomukita-88.*` |
| `banner-plush50.html` | Angka plush 50%, ornamen Jepang 3D | `nomukita-88-plush50.*` |
| `banner-plush35.html` | Angka plush 35%, ornamen umum | `nomukita-88-plush35.*` |
| `banner-photo.html` | Fotografi kebun teh, tipografi flat | `nomukita-88-photo.*` |

```bash
npm i
node design/8.8/render.mjs                    # versi aktif
node design/8.8/render.mjs design/8.8/banner-plush50.html design/8.8/nomukita-88-plush50
```

## Konsep aktif

Diambil dari `Banner 8.8` (Drive → Banner Referensi/Agustus): fotografi tenang,
cahaya matahari tersaring daun di permukaan beton, satu kelompok produk di
kolam cahaya, doodle garis putih tipis, tipografi minim.

Hierarki highlight: **8.8** paling besar → **50%** → **Gratis Ongkir** paling
tenang. Ketiganya tetap terbaca tanpa badge berwarna, memakai tonalitas foto —
teks krem di area teduh atas, teks gelap di beton terang bawah.

## Font

| Peran | Font |
|---|---|
| Wordmark | file logo asli (`assets/logo.png`) |
| Angka & judul | **Poppins** |
| Tagline | **Cormorant Garamond Italic** |
| Aksara Jepang | **IPAGothic** |

Poppins adalah **pendekatan** terhadap huruf wordmark nomukita yang custom,
bukan font brand sebenarnya. Kalau file font brand-nya ada, tinggal ganti
`font-family` di `body` — layout tidak perlu diubah.

```bash
mkdir -p ~/.fonts/nomukita
for n in Regular Medium SemiBold Bold ExtraBold Black; do
  curl -sSL -o ~/.fonts/nomukita/Poppins-$n.ttf \
    https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-$n.ttf
done
curl -sSL -o ~/.fonts/nomukita/CormorantGaramond-Italic.ttf \
  'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf'
fc-cache -f
```

## Cara ubah isi

Semua teks dirender browser, jadi bisa diganti tanpa generate ulang.

| Yang diubah | Di mana |
|---|---|
| `8.8`, `MATCHA DAY`, tagline | `.top` |
| Diskon | `.offer` |
| Gratis ongkir | `.foot` |
| Doodle (pita, sparkle) | `svg.doodle` — inline SVG, bebas digeser |
| Kepekatan bayangan atas | `.scrim` |

## Aset

`assets/photo.jpg` digenerate `nano-banana-pro` lewat `bin/kie.mjs`, dengan
mockup kaleng asli (`Mockup nomukita-Pure Matcha Uji_Can.png` dari Drive)
sebagai `image_input`.

**Label kaleng perlu satu pass perbaikan.** Hasil generate pertama merusak
aksara Jepangnya — tertulis `銘有錄・むレモニアルグレード`, seharusnya
`純有機・セレモニアルグレード`. Diperbaiki dengan pass kedua yang mengirim foto
hasil *dan* mockup asli sekaligus, dengan instruksi hanya mengubah label. Kalau
foto ini digenerate ulang, **periksa label kalengnya di ukuran penuh** sebelum
dipakai.

Aset versi lama: `scene-jp.jpg`, `num50.png`, `pack.png` (plush50);
`scene.jpg`, `num35.png`, `tin.png`, `latte.png`, `bowl.png` (plush35);
`bg.jpg`, `product.png` (photo).

## Catatan

Teks dirender browser, bukan model gambar. Model generatif masih sering merusak
huruf kecil — sebagaimana terbukti pada label kaleng di atas — dan angka diskon
tidak boleh salah. Model hanya dipakai untuk fotografinya.
