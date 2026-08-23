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
- Offer (highlight utama): **Disc up to 30%**
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

Foto talent digenerate dengan **Nano Banana 2 (Gemini 3 Pro Image)** via kie.ai,
memakai foto produk `Boxer dewasa/2.png` + `1a.png` sebagai referensi wardrobe dan
`Referensi Payday_Aug.jpeg` sebagai referensi framing kamera. Tidak ada teks yang
digenerate AI — seluruh tipografi di-set memakai file font brand asli.

Logo di-vectorkan (SVG) dari artwork banner Toni Black yang sudah ada, tersedia
dalam versi putih dan charcoal di `source/`.

Untuk regenerate banner:

```bash
cd source && python3 build.py     # butuh playwright + chromium
```

Ubah `VARIANTS` di `build.py` untuk menyesuaikan ukuran, dan blok copy di fungsi
`html()` untuk menyesuaikan teks.
