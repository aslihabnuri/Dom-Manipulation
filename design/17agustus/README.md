# Banner 17 Agustus — nomukita.

Banner kemerdekaan **"Diskon Semangat 45"**: disc up to **45%** + **voucher gratis
ongkir**, periode **16–18 Agustus**. Format 1080×1350 (4:5), mengikuti
`Referensi Banner 17 Agustus.jpg` (Drive → Banner Referensi/Agustus).

```bash
npm i
./design/8.8/install-fonts.sh      # font brand, sekali saja (lihat design/8.8/README.md)
node design/17agustus/render.mjs
```

## Struktur (dipetakan dari referensi)

| Referensi (Y.O.U) | Banner ini |
|---|---|
| Logo di atas | Logo nomukita 300px, y=52 (aturan design system) |
| Pill `10 - 16 AUGUSTUS` | Pill `16 – 18 AGUSTUS` (ejaan dibetulkan) |
| Script "Diskon" oranye | "Diskon" merah, ARG Demi dimiringkan |
| Headline putih "SEMANGAT 45" outline biru | Sama — dua lapis: stroke biru muda di belakang, isi putih di depan |
| Band biru `DISC UP TO 50% + VOUCHER UP TO 45K` | Band merah `DISC UP TO 45% + VOUCHER GRATIS ONGKIR` |
| 3 produk di lintasan lari + pita merah putih | 3 kemasan ditata sebagai lomba lari (lihat bawah) |
| `100% ORI + BPOM APPROVED` | — (footer dihapus atas permintaan) |

"Semangat 45" sekaligus pun angka diskonnya — 45%.

## Produk (file asli dari Drive, bukan hasil generate)

| Produk | File sumber |
|---|---|
| Matcha Premix 250 gram | `nomukita-matcha japanese.png` (Packaging 250) — pouch yang sama persis dengan foto di slide PDP Premix |
| Pure Matcha Shizouka 500 gram | `Mockup nomukita-Pure Matcha Shizouka.png` |
| Taro 250 gram | `nomukita-taro-250g.png` (Packaging 250) |

Ketiganya cutout transparan asli yang dikomposit di HTML — **label tidak melewati
model gambar sama sekali**, jadi tidak ada risiko aksara rusak dan tidak perlu
pass perbaikan (pelajaran dari banner 8.8). Background digenerate `nano-banana-pro`
tanpa produk dan tanpa teks.

## Penataan lomba lari

Produk ditata sebagai pelari di lintasan:

- **Semua produk tegak menghadap depan, tanpa rotasi**, dan kaki ketiganya
  tertanam **di dalam permukaan merah lintasan** (tepi belakang lintasan ada di
  ~y1085 kiri sampai ~y1010 kanan — kaki produk harus di bawah garis itu,
  jangan ditaruh tepat di tepinya karena akan terbaca "di luar lintasan").
- **Shizouka memimpin** — terdepan (kaki y1300, terbesar), menembus **pita
  finis** (`assets/tape.png`) yang melintang di depan kakinya.
- **Premix & Taro menyusul** — kaki y1195 / y1178, lebih kecil (350px vs
  420px), di lajur masing-masing.
- Pita finis digenerate terpisah (pita satin merah-putih di latar putih, lalu
  `recraft/remove-background`) supaya bisa ditaruh *di depan* produk; pita di
  background tetap di belakang sebagai lapisan kedalaman.
- Posisi pita dijaga agar tidak menutupi teks label: `top:1192` membiarkan
  `500 gram` pada Shizouka terbaca penuh — kalau menggeser pita ke atas,
  periksa lagi zoom labelnya.

## Karakter terkunci (font DEMO)

Kampanye ini menabrak hampir semua glyph yang terkunci di All Round Gothic DEMO:

| Teks | Glyph terkunci | Solusi |
|---|---|---|
| `45` (headline & band) | angka `4` | Kedua digit diset **Comfortaa Bold** supaya konsisten satu pasangan |
| `45%` | `%` | Vektor SVG, stroke disamakan dengan digit |
| `16 – 18` | tanda hubung | Bar CSS (`.pill i`) |
| `+` di band | belum teruji di DEMO | Vektor SVG, tidak ambil risiko |

Comfortaa sebagai pengganti digit adalah solusi yang ditetapkan design system §3
sendiri. Setelah lisensi ARG dibeli, kembalikan dengan mengganti `--brand-body`
pada `.hero .num` dan `.big b` ke `--brand-display`.

## Warna

Merah bendera `#C8102E` (band, aksen, pill) di atas langit dan lintasan dari
background. Teks band bone white `#F1F0EB`. Logo dipakai warna aslinya
(charcoal + titik cyan) karena langitnya terang.

## QC yang sudah dilakukan

Sesuai design system §7.6: zoom pada ketiga label kemasan (tajam, teks utuh),
angka `45%`, dan tanggal. Tidak ada elemen teks yang dirender model gambar.
