# Banner 8.8 — nomukita.

Banner promo 8.8: **Disc up to 50%** + **Gratis Ongkir**. Format 1080×1350 (4:5).

| File | Gaya | Output |
|---|---|---|
| `banner.html` | **Versi aktif.** Ornamen Jepang, `8.8` dan Gratis Ongkir di-highlight, kemasan asli | `nomukita-88.png` / `.jpg` |
| `banner-plush35.html` | Versi sebelumnya — disc 35%, ornamen umum, produk generik | `nomukita-88-plush35.*` |
| `banner-photo.html` | Versi pertama — fotografi kebun teh, tipografi flat | `nomukita-88-photo.*` |

```bash
npm i
node design/8.8/render.mjs                    # versi aktif
node design/8.8/render.mjs design/8.8/banner-plush35.html design/8.8/nomukita-88-plush35
```

Tiap render menghasilkan `*.png` (1080×1350) dan `*@2x.png` (2160×2700, gitignored).

## Font

Wordmark memakai **file logo asli** (`assets/logo.png`, diekstrak dari
`Nomukita - Logo Design-01.jpg` dengan latar putih dijadikan transparan) — jadi
logonya persis, bukan tiruan.

Sisa tipografi memakai **Poppins**, geometric sans yang paling dekat dengan
huruf wordmark nomukita di antara font gratis. Ini **pendekatan, bukan font
brand yang sebenarnya** — wordmark nomukita tampak custom (perhatikan potongan
diagonal pada `k` dan titik daun cyan). Kalau file font brand-nya ada, ganti
`--brand-font` dan pasang di sistem; layout tidak perlu diubah.

```bash
mkdir -p ~/.fonts/nomukita
for n in Regular Medium SemiBold Bold ExtraBold Black; do
  curl -sSL -o ~/.fonts/nomukita/Poppins-$n.ttf \
    https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-$n.ttf
done
fc-cache -f
```

Aksara Jepang (八月八日) memakai **IPAGothic**.

## Warna brand

Diambil dari aset asli, bukan dikarang:

| Token | Nilai | Asal |
|---|---|---|
| `--cyan` | `#3FA9D4` | titik daun pada wordmark, aksen zip kemasan |
| `--green-dk` / `--green` / `--green-lt` | `#365B1F` / `#4C7C2F` / `#8CBB4A` | matcha |
| `--ink` | `#111111` | kemasan |

## Cara ubah isi

Semua teks dirender browser, jadi bisa diganti tanpa generate ulang.

| Yang diubah | Di mana |
|---|---|
| `8.8` | `.eight` — teksnya ada **4 kali** (bayangan, outline hijau, outline putih, isi gradasi); ubah keempatnya |
| Nama kampanye | `.name` |
| Subheadline | `.sub` |
| Label diskon | `.upto` |
| Badge ongkir | `.ongkir` |

Angka **50%** adalah gambar (`assets/num50.png`), bukan teks — untuk angka lain
perlu generate ulang lewat KIE.

### Jaga angka tetap terbaca

Kesalahan yang sudah dua kali terjadi: produk menutupi digit. Pada layout aktif
angka ditempatkan di `left:56px width:800px top:560px`, dan kemasan di
`right:38px top:796px` sehingga hanya menimpa sudut kanan-bawah `%`. Kalau
menggeser kemasan ke kiri melewati x≈790, tanda `%` mulai tertutup.

## Aset

Semua digenerate lewat `bin/kie.mjs` dengan `nano-banana-pro`, latar dipotong
dengan `recraft/remove-background`:

| File | Isi |
|---|---|
| `assets/scene-jp.jpg` | Scene 3D pastel: awan kumo, bangau origami, kipas bermotif seigaiha, bambu, tali mizuhiki, dango, lampion, sakura |
| `assets/num50.png` | Angka `50%` bertekstur bulu matcha dengan sakura dan daun teh |
| `assets/pack.png` | **Kemasan asli** Pure Matcha Uji Kyoto 500 gram, dari `Mockup nomukita-Pure Matcha Uji Kyoto.png` di Drive — bukan hasil generate |
| `assets/logo.png` | Wordmark asli dari file logo brand |

`num50.png` dan `num35.png` dikuantisasi ke palet 220 warna; tekstur bulunya
tidak terlihat berubah tapi ukurannya turun dari ~3MB ke ~0,6MB.

Aset versi lama: `scene.jpg`, `num35.png`, `tin.png`, `latte.png`, `bowl.png`
(untuk `banner-plush35.html`); `bg.jpg`, `product.png` (untuk `banner-photo.html`).

## Catatan

Teks dirender browser, bukan model gambar. Model generatif masih sering merusak
huruf kecil, dan angka diskon tidak boleh salah. Model hanya dipakai untuk
ilustrasi dan angka plush — hal yang justru tidak bisa dibuat dengan CSS.
