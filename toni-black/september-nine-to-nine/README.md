# Toni Black — Nine to Nine (Key Visual September)

Key visual untuk kampanye September, arah **A: Nine to Nine**. Ide dasarnya
mengubah 9.9 dari angka tanggal jadi kebenaran produk — nyaman dari jam sembilan
pagi sampai jam sembilan malam. Satu pria, satu hari, dua jam berbeda.

## File

| File | Ukuran | Pemakaian |
|---|---|---|
| `..._KeyVisual_16x9@2x.png` | 3840 × 2160 | KV master, retina |
| `..._KeyVisual_16x9.jpg` | 1920 × 1080 | KV, web |
| `..._KeyVisual_2x1@2x.png` | 3840 × 1920 | KV master, retina |
| `..._KeyVisual_2x1.jpg` | 1920 × 960 | KV, web |
| `..._9.9_*` | sama | Turunan 9.9, bukti tema membawa penawaran |

## Cara komposisinya bekerja

Banner dibaca kiri ke kanan sebagai satu hari: panel copy **Clean White**, lalu
foto **09:00** yang high key, lalu foto **21:00** yang low key. Ramp tonalnya
turun terus — jadi bingkai banner itu sendiri yang menjadi perjalanan harinya,
bukan cuma isinya.

Kedua foto memakai badan, wardrobe, crop dan skala yang sama. Yang berubah hanya
cahaya. Baris waistband kedua panel diverifikasi berada di 45.97% dan 45.93%
tinggi frame — meleset satu pixel dari 2160.

## Kepatuhan brand guideline

Diaudit dengan mengukur pixel hasil render.

**Warna** — setiap elemen grafis memetakan tepat (selisih 0) ke token brand:

| Elemen | Terukur | Token |
|---|---|---|
| Panel copy | `#FFFFFF` | Clean White |
| Logo, headline, angka, fill CTA | `#282828` | Dark Charcoal |
| Support copy, eyebrow, catatan tanggal | `#4F5052` | Davi's Grey |
| Garis pemisah panel | `#CCCCCC` | Steel Grey |

**Foto** — chroma terukur `0.00`, hitam-putih murni. Ini meneruskan sistem
Agustus, yang empat dari lima banner-nya sudah B&W.

**Kontras** — Dark Charcoal di putih 14.74:1, Davi's Grey di putih 8.07:1.
Keduanya AAA. Grey `#818284` sempat dipakai untuk eyebrow tapi hanya
mencapai 3.85:1, di bawah AA, jadi diganti Davi's Grey.

**Tipografi** — Zalando Sans Expanded untuk headline, angka dan CTA; Arimo untuk
support copy. Setiap baris display dapat koreksi side bearing sendiri, karena
"N" dan "T" punya bearing berbeda. Sebaran tepi kiri kolom copy 1.0px.

**Logo** — versi charcoal solid di panel putih, tanpa efek. Exclusion zone
X ≈ 19px; clearance aktual kiri 68px, atas 69px, bawah 217px.

**Product focus** — ini menutup temuan terbuka dari banner Payday. Guideline
menulis "The product is the main focus" dan "use tight framing on products".
Dengan crop dada-ke-paha, garmen kini mengisi **12.5% frame**, naik dari
**3.9%** di banner Payday.

**Tone of voice** — "Comfort that holds from morning to night" dan
"Discover Toni Black" (CTA yang dipakai guideline sendiri di mock-up brand story).
Nol kata dari daftar *we don't like*.

## Produksi

Dua plate digenerate dengan Nano Banana 2 via kie.ai di resolusi **2K**
(12 credit per gambar, bukan 18 seperti 4K):

1. **09:00** — prompt teks penuh, tanpa referensi.
2. **21:00** — plate 09:00 dikirim balik sebagai image input, dengan instruksi
   mempertahankan badan, garmen dan crop, dan hanya mengubah cahaya jadi malam.

Total 24 credit untuk key visual ini. Tidak ada teks yang digenerate AI.

Untuk regenerate:

```bash
cd source && python3 build.py     # butuh playwright + chromium
```

## Kalau tema ini diteruskan

Busur waktu bisa diperluas ke empat titik — 09:00, 13:00, 17:00, 21:00 — untuk
mengisi Category, Product Value dan Payday. Layout Payday Agustus, empat ikon
fitur, dan split MEN / KIDS semuanya masih bisa dipakai ulang.
