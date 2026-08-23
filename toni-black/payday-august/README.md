# Toni Black — Payday Sale Banner (24–31 August)

Banner promo payday untuk Toni Black, mengadopsi gaya framing dari
`Referensi Payday_Aug.jpeg` (POV dari dalam drum mesin cuci), diadaptasi ke
palet monokrom sesuai Brand Guideline Toni Black.

## File final

| File | Ukuran | Rasio | Pemakaian |
|---|---|---|---|
| `ToniBlack_PaydaySale_16x9@2x.png` | 3840 × 2160 | 16:9 | master / retina |
| `ToniBlack_PaydaySale_16x9.jpg` | 1920 × 1080 | 16:9 | web / hero banner |
| `ToniBlack_PaydaySale_2x1@2x.png` | 3840 × 1920 | 2:1 | master / retina |
| `ToniBlack_PaydaySale_2x1.jpg` | 1920 × 960 | 2:1 | web / marketplace |

## Copy

- Headline: **Payday Sale**
- Offer (highlight utama): **Save up to 30%**
- Benefit (highlight): **Extra IDR 5K for new buyers** · **Free shipping**
- CTA: **Shop Now**
- Periode: **24 – 31 August**

## Brand compliance

**Warna** — hanya palet primer/sekunder brand:

| Token | Hex |
|---|---|
| Dark Charcoal Black | `#282828` |
| Clean White | `#FFFFFF` |
| Steel Grey | `#CCCCCC` |

**Tipografi** — persis dari folder `Toni Black/Font`:

- `Zalando Sans Expanded` — headline, angka diskon, CTA (assertive & edgy)
- `Arimo` — benefit chip & periode (clear, easy to read)

**Layout** — rule of thirds: talent + framing drum di kanan, copy di kiri di atas
negative space. Tidak ada elemen dekoratif tambahan; hirarki dibuat lewat skala
dan spasi, bukan ornamen.

**Imagery** — kontras tajam, background gelap minimalis, model direction natural
dan maskulin sesuai arahan *Imagery Style* di brand guideline.

## Sumber & reproduksi

Foto talent digenerate dengan **Nano Banana 2 (Gemini 3 Pro Image)** via kie.ai
dalam dua tahap:

1. **Base plate** — prompt teks penuh, dengan foto produk `Boxer dewasa/2.png` +
   `1a.png` sebagai referensi wardrobe dan `Referensi Payday_Aug.jpeg` sebagai
   referensi framing kamera.
2. **Recolour pass** — plate hasil tahap 1 dikirim balik sebagai image input
   dengan instruksi mengubah warna boxer dari charcoal ke hitam solid, sambil
   mempertahankan lipatan, seam, sheen dan tekstur katunnya.

Tidak ada teks yang digenerate AI — seluruh tipografi di-set memakai file font
brand asli.

Logo di-vectorkan (SVG) dari artwork banner Toni Black yang sudah ada, tersedia
dalam versi putih dan charcoal di `source/`.

Total pemakaian kie.ai: **54 credit** (3 generate @ 4K, 18 credit per gambar).

Untuk regenerate banner:

```bash
cd source && python3 build.py     # butuh playwright + chromium
```

Ubah `VARIANTS` di `build.py` untuk menyesuaikan ukuran, dan blok copy di fungsi
`html()` untuk menyesuaikan teks.

---

## Audit brand guideline

Diaudit dengan mengukur pixel hasil render, bukan penilaian mata.

### Warna — setiap elemen grafis dipetakan ke token brand

| Elemen | Terukur | Token brand |
|---|---|---|
| Panel copy | `#262626` | Dark Charcoal `#282828` |
| Logo, headline, `30%`, teks chip, CTA fill | `#FFFFFF` | Clean White |
| `SAVE UP TO`, tanggal | `#CCCCCC` | Steel Grey |
| Fill chip, divider | `#4F5052` | Davi's Grey |
| Label CTA | `#2A2A2A` | Dark Charcoal |

Tidak ada warna di luar palet. Foto dibiarkan full colour, diizinkan guideline
selama mood, lighting dan tone-nya benar.

### Kontras (WCAG 2.1)

| Kombinasi | Rasio | |
|---|---|---|
| Clean White di panel charcoal | 14.6:1 | AAA |
| Steel Grey di panel charcoal | 9.1:1 | AAA |
| Charcoal di CTA putih | 14.7:1 | AAA |

### Logo

- Versi rectangle horizontal, konsisten dengan `Banner_Brand Story` milik brand
- Warna solid Clean White, tanpa shadow, efek, gradient atau outline
- Proporsi asli, spacing icon–typeface tidak diubah
- Exclusion zone: X (cap height "TONI BLACK") = 23px. Clearance aktual
  kiri 118px / atas 94px / bawah 214px — aman di atas syarat

### Tipografi & tone

- Zalando Sans Expanded untuk title/angka/CTA, Arimo untuk chip dan tanggal
- Seluruh copy uppercase, bold, kontras tinggi sesuai *Headline & CTA Tone*
- "Shop Now" ada di daftar CTA General; "Save up to 30%" sejalan dengan contoh
  promosi "Save 20% This Weekend"
- Bebas dari kata yang masuk daftar *we don't like* (best, amazing, sexy, bold, dsb)

### Catatan terbuka

**Product focus.** *Layout & Composition* menulis "The product is the main focus"
dan *Imagery Style* menyarankan "tight framing on products". Banner ini
offer-led: boxer hanya ~3.9% dari frame. Detail material tetap terbaca di ukuran
kirim (waistband, seam tengah, panel kontur, sheen), dan *Promotional Banner*
memang bertujuan "communicating seasonal promotions". Jadi ini keputusan desain
yang sadar, bukan kelalaian — tapi kalau mau lebih patuh ke huruf guideline,
opsinya crop lebih ketat ke pinggang-ke-paha atau tambah packshot kecil.
