# Toni Black — Nine to Nine (Key Visual September)

Key visual kampanye September, arah **A: Nine to Nine**. Ide dasarnya mengubah 9.9
dari angka tanggal jadi klaim produk — nyaman dari jam sembilan pagi sampai jam
sembilan malam.

## File

| File | Ukuran | Pemakaian |
|---|---|---|
| `..._KeyVisual_16x9@2x.png` | 3840 × 2160 | KV master, retina |
| `..._KeyVisual_16x9.jpg` | 1920 × 1080 | KV, web |
| `..._KeyVisual_2x1@2x.png` | 3840 × 1920 | KV master, retina |
| `..._KeyVisual_2x1.jpg` | 1920 × 960 | KV, web |
| `..._9.9_*` | sama | Turunan 9.9, bukti tema membawa penawaran |

## Keputusan desain

**Satu frame, bukan diptych.** Versi pertama memakai dua panel (09:00 dan 21:00)
berdampingan. Itu terbaca sebagai perbandingan before/after, bukan campaign image.
Versi ini memakai satu foto full-bleed. Konsep dua ujung hari sekarang dibawa oleh
momennya sendiri — pria menenteng kaosnya sambil berjalan, gestur yang sama
ambigunya antara berangkat pagi dan pulang malam — dan oleh eyebrow `09:00 — 21:00`.

**Tipografi di dalam foto, tanpa panel warna.** Separuh kiri frame sengaja
dijatuhkan ke nyaris hitam (rata-rata L=19) lewat pencahayaan, bukan lewat blok
atau scrim. Teks putih duduk langsung di atas foto, kontras terukur 20:1.

**Bloknya membentuk rentang.** `NINE` dan `NINE` diset besar menjepit `to` yang
kecil dan abu — susunannya berpinggang seperti jam pasir, jadi tipografinya sendiri
membaca sebagai rentang waktu, bukan sekadar tiga baris teks.

**Crop 2:1 sengaja berbeda.** Figur mengisi baris 0–3000 dari 3072px, jadi crop 2:1
penuh badan mustahil dari plate ini. Daripada memotong kepala atau kaki, 2:1 dibuat
sebagai framing tersendiri: kepala sampai paha, yang justru membuat produk lebih besar.

## Kepatuhan brand guideline

Diaudit dengan mengukur pixel hasil render.

| Item | Hasil |
|---|---|
| Warna elemen grafis | Semua memetakan **tepat (selisih 0)** ke Clean White dan Steel Grey |
| Foto | Chroma **0.00** — hitam-putih murni |
| Kontras teks putih | **20.1:1** (16:9), 17.9:1 (2:1) — AAA |
| Kontras Steel Grey | **12.5:1** (16:9), 11.2:1 (2:1) — AAA |
| Sebaran tepi kiri kolom | **0.5px** (16:9), 1.0px (2:1) |
| Tepi frame | Bersih, tanpa band hitam |

Tipografi memakai Zalando Sans Expanded (headline, angka, CTA) dan Arimo (support,
catatan). Setiap baris display dapat koreksi side bearing sendiri.

Logo versi putih solid, tanpa efek, di area foto yang gelap dan rata — sesuai
arahan guideline "place the logo on a suitable area of the photo background".

Pencahayaan mengikuti *Imagery Style*: "sharp contrast", latar minimalis, model
"natural confidence, not overly posed".

### Catatan terbuka: product focus

Guideline menulis "The product is the main focus". Di KV ini garmen hanya mengisi
**1.6%** frame (16:9) dan **2.1%** (2:1) — turun dari 12.5% versi diptych.

Ini konsekuensi sadar dari arahan full-figure dan full-bleed. Referensi yang
dipilih pun berkarakter sama: pada banner Under Armour itu produknya juga kecil,
karena tugas sebuah key visual adalah membangun dunia kampanye, bukan menjual detail
material. Detail produk ditangani di tempat lain dalam set — sesuai rekomendasi
awal, banner Product Value memakai treatment makro dari arah Second Skin.

Kalau prioritasnya dibalik dan produk harus dominan di KV, framing dada-ke-paha
seperti versi diptych mengembalikannya ke belasan persen.

## Produksi

Plate digenerate dengan Nano Banana 2 via kie.ai, 16:9 resolusi 4K.

Percobaan pertama gagal dan dibuang: cahayanya keluar lembut dan ambient, spread
tonal sempit, tanpa bayangan cor. Prompt kedua memaksa satu sumber cahaya keras
tanpa fill, dengan target separuh kiri frame jatuh ke nyaris hitam. Hasilnya spread
tonal 193 dan separuh kiri rata-rata L=19.

Plate lalu didesaturasi ke greyscale murni (chroma 1.94 → 0.00). Tidak ada teks
yang digenerate AI.

Untuk regenerate:

```bash
cd source && python3 build.py     # butuh playwright + chromium
```
