# Shopee Brand Max — Banner Builder (Sophie Martin)

Tools untuk membuat 4 aset banner Shopee Brand Max 2026 (BAU) yang sudah sesuai
guideline. Aturan lengkapnya ada di [`SYARAT_KETENTUAN.md`](./SYARAT_KETENTUAN.md).

## Output yang dihasilkan

| File | Dimensi | Format | Batas |
|---|---|---|---|
| `banner_card_531x792.jpg` | 531 x 792 | JPG | ≤ 500 kb |
| `floating_banner_360x360.png` | 360 x 360 | PNG transparan | ≤ 250 kb |
| `skinny_app_1200x360.jpg` | 1200 x 360 | JPG | ≤ 500 kb |
| `skinny_web_1200x110.jpg` | 1200 x 110 | JPG | ≤ 500 kb |

## Cara pakai

```bash
pip install Pillow

# 1. taruh aset di ./assets  (lihat daftar di bawah)
# 2. cek dulu apa yang belum sesuai guideline
python3 build_banners.py audit --assets ./assets

# 3. isi copy kampanye
cp config.example.json config.json

# 4. build
python3 build_banners.py build --assets ./assets --out ./out --config config.json
```

## Aset yang dibutuhkan di `./assets`

Key visual — dari Drive `Sophie Martin / Banner / Agustus`:

- `KV Banner_Halaman Rekomendasi Banner.jpg`
- `KV Banner_Floating Banner.jpg`
- `KV Banner_Skinny Banner App.jpg`
- `KV Banner_Skinny Banner PC.jpg`

Template resmi Shopee — dari Drive `Sophie Martin / Banner / Banner Guideline`:

- `BRAND-MAX-BANNER-CARD-Red.png` / `BRAND-MAX-BANNER-CARD-White.png`
- `BRAND-MAX-Floating-Icon-1.png`
- `BRAND-MAX-Skinny-App.png`
- `BRAND-MAX-Skinny-Web-Red.png` / `BRAND-MAX-Skinny-Web-White.png`

Opsional: `sophie-martin-logo.png` (PNG transparan) untuk penempatan logo di atas.

## Yang otomatis dikerjakan script

- **Resize + center-crop** KV ke dimensi persis tiap format, tanpa merusak aspect ratio.
- **Pasang template resmi Shopee** di atas KV — jadi masking, white outline, dan
  Shopee Mall tag otomatis benar dan berada di posisi yang seharusnya.
- **Pilih warna Shopee Mall tag otomatis** — versi PUTIH kalau background merah/gelap,
  versi MERAH kalau background terang. Ini kesalahan yang paling sering kena reject.
- **Tolak background terlarang** — kalau background mendekati `#FFFFFF` atau `#F1F1F1`,
  gambar digelapkan sedikit supaya lolos aturan kontras.
- **Logo brand ditempatkan di atas**, sesuai alur baca yang diminta guideline.
- **KSP dibatasi maksimal 2** dan dirender di ukuran font yang diminta tiap format
  (25pt / 47pt / 40pt).
- **Floating Banner dibuat tanpa teks promo sama sekali** dan tetap transparan, dengan
  close button dari template dipertahankan utuh.
- **Ukuran file ditekan otomatis** sampai di bawah batas tiap format.

## Yang tetap harus dicek manual

- SKU produk harus terlihat jelas dan tidak tertutup masking/teks.
- Konsistensi key visual, pesan, dan arah desain antar keempat format.
- Copy KSP tidak menyentuh restricted content (lihat `SYARAT_KETENTUAN.md`).
