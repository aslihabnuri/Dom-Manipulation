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

**Angka lajur ("2", "3") bukan bagian background** — dilukis via CSS (`.lane`,
Comfortaa Bold putih 48%) supaya teks tetap programatik sesuai aturan produksi
design system. Kalau background digenerate ulang, angka lajur tidak ikut hilang.

Sudut & posisinya **diukur dari garis lajur asli**, bukan dikira. Scan kecerahan
menemukan garis putih pada background: garis kiri miring **~24° dari tegak**,
lajur melebar makin ke kanan sampai **~49°** di sisi kanan. Tiap angka `rotate`
sesuai sudut lajurnya + `scaleY(.57–.6)` untuk foreshortening, dan ditaruh di
**tengah channel** (bukan menindih garis): `2` di lajur terluar kiri
(`rotate(-24deg)`), `3` di channel kanan (`rotate(-49deg)`). Kalau background
diganti, ukur ulang sudut garisnya — percobaan pertama pakai −13° seragam dan
melenceng dari lajur.

Produk ditata sebagai pelari di lintasan:

- **Pose balapan referensi**: miring dinamis — Shizouka `-3°`, Premix `-8°`,
  Taro `+7°` — dengan kaki ketiganya tetap **di dalam permukaan merah lintasan**
  (tepi belakang lintasan ~y1085 kiri sampai ~y1010 kanan; kaki harus di bawah
  garis itu, jangan tepat di tepinya).
- **Shizouka memimpin** — tengah, terbesar, puncaknya menyelip di belakang band
  (persis produk tengah referensi), menembus **pita finis** (`assets/tape.png`).
- **Premix & Taro menyusul** — kaki ~y1188 / ~y1171, lebih kecil, di lajur
  masing-masing.

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
