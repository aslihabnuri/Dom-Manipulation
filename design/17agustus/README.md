# Banner 17 Agustus — nomukita.

Banner kemerdekaan **"Diskon Special Merdeka Sale"**: disc up to **30%** +
**voucher gratis ongkir**, periode **16–18 Agustus**. Format 1080×1350 (4:5), mengikuti
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
| Headline putih "SEMANGAT 45" outline biru | "SPECIAL MERDEKA SALE" dua baris, dua lapis: stroke biru muda di belakang, isi putih di depan |
| Band biru `DISC UP TO 50% + VOUCHER UP TO 45K` | Band merah `DISC UP TO 30% + VOUCHER GRATIS ONGKIR` |
| 3 produk di lintasan lari + pita merah putih | 3 kemasan ditata sebagai lomba lari (lihat bawah) |
| `100% ORI + BPOM APPROVED` | — (footer dihapus atas permintaan) |

Headline dua baris: `SPECIAL` (88px) sebagai lead-in, `MERDEKA SALE` (124px)
sebagai hero. Aksen script "Diskon" dirapatkan ke sudut kiri-atas headline
supaya terbaca satu lockup seperti referensi.

## Produk (file asli dari Drive, bukan hasil generate)

| Produk | File sumber |
|---|---|
| Matcha Premix 250 gram | `nomukita-matcha japanese.png` (Packaging 250) — pouch yang sama persis dengan foto di slide PDP Premix |
| Pure Matcha Shizouka 500 gram | `assets/shizouka-front.png` — **tampak depan hasil generate** (lihat bawah) |
| Taro 250 gram | `nomukita-taro-250g.png` (Packaging 250) |

Ketiganya cutout transparan asli yang dikomposit di HTML — **label tidak melewati
model gambar sama sekali**, jadi tidak ada risiko aksara rusak dan tidak perlu
pass perbaikan (pelajaran dari banner 8.8). Background digenerate `nano-banana-pro`
tanpa produk dan tanpa teks.

## Penataan lomba lari

**Lintasan mengisi ~60% frame dilihat dari sudut atas** (generate kedua —
versi pertama hanya strip tipis di dasar frame, produk terbaca "dipajang di
depan langit", bukan balapan). Lajur melengkung dari kiri-bawah ke kanan,
produk berdiri *di tengah* permukaan merah, dikelilingi lajur.

**Angka lajur ("2", "3") kini bagian dari background** — digenerate bersama
scene-nya, dengan `Referensi Banner 17 Agustus.jpg` sebagai `image_input` dan
instruksi "recreate the scene as an empty stage": kamera, lajur, angka terlukis
(posisi/ukuran/perspektif referensi), pita, dan konfeti disalin; produk, logo,
dan semua teks promosi dihilangkan. Angka jadi punya tekstur karet dan
perspektif asli, hal yang tidak pernah tercapai lewat overlay CSS.

Empat percobaan overlay CSS sebelumnya (sudut seragam, sudut terukur, rotateX
rebah, spec besar-terang) semuanya gagal menyatu — angka tempelan tidak bisa
menyamai cat yang terlukis di scene. Kalau angka perlu diubah, generate ulang
background-nya, jangan kembali ke overlay.

Posisi angka pada background aktif (diukur dari alpha/kecerahan, kanvas 1080):
`2` di x95-255 y935-1150, `3` di x621-741 y960-1132. Produk diposisikan
terhadap angka ini: tepi kanan Shizouka memotong ~29% sisi kiri `3` (pola
oklusi referensi), kaki Premix menyentuh puncak `2` tanpa menutupinya.
Fragmen glyph terpotong di tepi kanan frame adalah bawaan scene, seperti
referensi yang juga punya tanda terpotong di tepinya.

Produk ditata sebagai pelari di lintasan:

- **Rasio ukuran disalin dari referensi**: produk tengah ~36% lebar kanvas
  (`w360`), produk samping ~23% (`w250`) — di referensi produk samping memang
  ±2/3 produk tengah.
- **Stagger referensi**: Taro kanan-atas (kaki ~y850), Premix kiri-tengah
  (kaki ~y972), Shizouka tengah-bawah terbesar (kaki ~y1230) menembus
  **pita finis** (`assets/tape.png`); puncaknya menyelip di belakang band.
- Miring dinamis referensi dipertahankan: Shizouka `-3°`, Premix `-8°`,
  Taro `+7°`.

### Pouch Shizouka tampak depan

Semua aset Shizouka di Drive memakai mockup 3/4 menyamping — tampak depannya
tidak ada, jadi digenerate: `nano-banana-pro` diberi dua gambar (mockup 3/4 +
pouch putih tampak depan sebagai acuan perspektif) dengan instruksi mereproduksi
label karakter demi karakter, lalu `recraft/remove-background`. Label sudah
di-zoom-verifikasi: `Pure / 抹茶 / Pure Matcha Shizouka / 500 gram` semuanya
tepat. Kalau digenerate ulang, ulangi verifikasi itu.

Geometri pouch depan lebih ramping (aspect 0,553): `w360 → h651`, `top:590`
menempatkan `500 gram` (91,9% tinggi pouch) di y1188 — tepat di atas pita
(y1192). Menggeser pouch atau pita = periksa ulang zoom label.
- Pita finis digenerate terpisah (pita satin merah-putih di latar putih, lalu
  `recraft/remove-background`) supaya bisa ditaruh *di depan* produk; pita di
  background tetap di belakang sebagai lapisan kedalaman.
- Posisi pita dijaga agar tidak menutupi teks label: `top:1192` membiarkan
  `500 gram` pada Shizouka terbaca penuh — kalau menggeser pita ke atas,
  periksa lagi zoom labelnya.

## Karakter terkunci (font DEMO)

Kampanye versi 45% dulu menabrak hampir semua glyph terkunci. Setelah diskon
jadi **30%** dan headline tidak lagi memuat angka, hanya `%` yang tersisa
bermasalah — jadi angka diskon sekarang memakai **All Round Gothic Bold asli**,
bukan Comfortaa pengganti. Kalau angka diskon nanti mengandung `4`
(45%, 40%, 24%…), digitnya harus kembali ke Comfortaa Bold.

| Teks | Glyph terkunci | Solusi |
|---|---|---|
| `30%` | `%` saja | Digit `3` dan `0` **aman di All Round Gothic Bold** — dipakai langsung; hanya `%` yang jadi vektor SVG |
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
