# Banner 8.8 — nomukita.

Banner promo 8.8: **Disc up to 35%** + **Gratis Ongkir**. Format 1080×1350 (4:5).

Ada dua versi:

| File | Gaya | Output |
|---|---|---|
| `banner.html` | Mengikuti "Referensi Banner 8.8.jpg" — scene pastel 3D, angka plush berbulu, elemen dekoratif melayang, tipografi tebal ber-outline | `nomukita-88.png` / `.jpg` |
| `banner-photo.html` | Versi awal — fotografi kebun teh, tipografi flat geometric | `nomukita-88-photo.png` / `.jpg` |

```bash
npm i
node design/8.8/render.mjs                                  # versi utama
node design/8.8/render.mjs design/8.8/banner-photo.html design/8.8/nomukita-88-photo
```

Tiap render menghasilkan `*.png` (1080×1350) dan `*@2x.png` (2160×2700, gitignored).

## Cara ubah isi

Semua teks dirender browser — tidak ada teks yang menyatu ke dalam gambar, jadi
angka diskon dan copy bisa diganti tanpa generate ulang apa pun.

| Yang diubah | Di mana |
|---|---|
| Tanggal | `.pill` |
| Headline | `.head` — teksnya ada **4 kali** (bayangan, outline hijau, outline putih, isi); ubah keempatnya |
| Subheadline | `.sub` |
| Label diskon | `.upto` |
| Badge ongkir | `.ongkir` |
| Warna | `--green`, `--green-dk`, `--green-lt`, `--cream` di `:root` |

Angka **35%** adalah gambar (`assets/num35.png`), bukan teks. Untuk angka lain
perlu generate ulang lewat KIE — prompt-nya ada di bagian Aset di bawah.

### Kalau produk menutupi angka

Posisi tiap digit pada `num35.png` sudah diukur dari alpha channel-nya:
`3` di x 100–408, `5` di x 408–678, `%` di x 678–980, semuanya pada y 600–1070.
Produk (`.tin`, `.latte`, `.bowl`) sengaja ditempatkan di pita bawah angka supaya
tidak ada wajah digit yang tertutup. Kalau menggeser produk, jaga agar tidak naik
ke atas y≈790.

## Aset

Semuanya digenerate lewat KIE (`bin/kie.mjs`), lalu latarnya dipotong dengan
`recraft/remove-background`:

| File | Model | Isi |
|---|---|---|
| `assets/scene.jpg` | `nano-banana-pro` | Scene pastel 3D: langit gradasi, padang teh, garis air, pita, daun, daisy, dango |
| `assets/num35.png` | `nano-banana-pro` | Angka `35%` bertekstur bulu matcha dengan daisy dan daun |
| `assets/tin.png`, `latte.png`, `bowl.png` | `nano-banana-pro` | Tiga produk difoto terpisah dalam satu baris, dipisah otomatis per objek lewat analisis komponen alpha |

`assets/` untuk `banner-photo.html`: `bg.jpg` (kebun teh Uji, memakai foto
referensi user sebagai acuan komposisi) dan `product.png`.

Font: **Baloo 2** (headline), **Poppins** (wordmark), **IPAGothic** (aksara Jepang).
Perlu terpasang di sistem sebelum render:

```bash
mkdir -p ~/.fonts/nomukita
curl -sSL -o ~/.fonts/nomukita/Baloo2.ttf \
  'https://raw.githubusercontent.com/google/fonts/main/ofl/baloo2/Baloo2%5Bwght%5D.ttf'
for n in Regular Medium SemiBold Bold ExtraBold Black; do
  curl -sSL -o ~/.fonts/nomukita/Poppins-$n.ttf \
    https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-$n.ttf
done
fc-cache -f
```

## Catatan

Teks dirender browser, bukan model gambar. Ini disengaja: model generatif masih
sering merusak huruf kecil, dan angka diskon tidak boleh salah. Model hanya
dipakai untuk ilustrasi, angka plush, dan fotografi produk — hal-hal yang justru
tidak bisa dibuat dengan CSS.
