# Banner 8.8 — nomukita.

Banner promo 8.8: **Disc up to 35%** + **Gratis Ongkir**.
Format 1080×1350 (4:5), nuansa matcha / Japanese minimalist.

```bash
npm i                      # playwright (browser sudah tersedia di environment)
node design/8.8/render.mjs # → nomukita-88.png (1080×1350) + nomukita-88@2x.png
```

## Cara ubah isi

Semua teks ada di `banner.html`, tidak ada teks yang "terbakar" ke dalam gambar —
jadi angka diskon, tanggal, dan copy bisa diganti tanpa generate ulang apa pun.

| Yang diubah | Di mana |
|---|---|
| Angka diskon | `<div class="num">35<u>%</u></div>` |
| Tanggal | `<div class="pill-date">` |
| Headline | `<h1 class="head">MATCHA<em>DAY</em></h1>` |
| Subheadline | `<p class="sub">` |
| Tombol & badge | `.cta` dan `.ongkir` di bagian `.bottom` |
| Warna aksen | `--matcha` di `:root` |

Ukuran lain (mis. 1:1 untuk feed, atau 9:16 untuk story) bisa dirender dengan
mengoper width/height — tapi posisi elemen perlu disesuaikan karena layout ini
dikunci untuk 4:5:

```bash
node design/8.8/render.mjs design/8.8/banner.html design/8.8/out-1x1 1080 1080
```

## Aset

| File | Asal |
|---|---|
| `assets/bg.jpg` | Kebun teh Uji — digenerate `nano-banana-pro` via KIE, memakai foto referensi user sebagai acuan komposisi |
| `assets/product.png` | Still life matcha — digenerate `nano-banana-pro`, latar dipotong dengan `recraft/remove-background` |

Font: **Poppins** (SIL Open Font License) — perlu terpasang di sistem sebelum render.
Tanpa Poppins, browser jatuh ke sans-serif bawaan dan proporsi tipografi berubah.

```bash
mkdir -p ~/.fonts/poppins
for n in Regular Medium SemiBold Bold ExtraBold Black; do
  curl -sSL -o ~/.fonts/poppins/Poppins-$n.ttf \
    https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-$n.ttf
done
fc-cache -f
```

## Catatan

Teks dirender oleh browser, bukan oleh model gambar. Ini disengaja: model
generatif masih sering merusak huruf kecil dan angka, sementara banner promo
tidak boleh salah di angka diskon. Model hanya dipakai untuk fotografinya.
