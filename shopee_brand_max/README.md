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

## Masalah utamanya bukan resize

KV Agustus dibuat tanpa memperhitungkan frame Shopee, jadi Shopee Mall tag yang
wajib itu jatuh persis di atas artwork:

| Format | Zona tag | Yang tertimpa |
|---|---|---|
| Skinny App | x392–807, y24–92 | wajah model + tas hitam di meja |
| Banner Card | x87–443, y0–56 | logo Sophie Martin |
| Skinny Web | x1078–1190, y14–64 | logo Sophie Martin |

Script menangani ini dengan menyediakan *clearance band* untuk tag lalu mengalirkan
ulang KV di bawah/di sampingnya. Karena background KV berupa gradasi cream yang halus,
area sisa diisi dengan **meregangkan pixel tepi KV itu sendiri** (`place_seamless`) —
bukan warna solid — sehingga pergeserannya tidak meninggalkan seam.

Tag lebar (Skinny App, Banner Card) hanya bisa dihindari secara vertikal, jadi artwork
digeser ke bawah. Tag sempit di pojok (Skinny Web) lebih murah dihindari secara
horizontal, jadi artwork dikecilkan sampai berhenti sebelum kolom tag.

## Yang otomatis dikerjakan script

- **Ukur geometri template** — posisi tag merah dan window transparan dibaca langsung
  dari file PNG resmi, tidak di-hardcode.
- **Pasang template resmi Shopee** di atas KV — masking, white outline, dan Shopee Mall
  tag otomatis benar dan di posisi yang seharusnya.
- **Pilih warna tag otomatis** — versi PUTIH kalau background merah/gelap, MERAH kalau
  terang. Ini kesalahan yang paling sering kena reject.
- **Tolak background terlarang** — kalau mendekati `#FFFFFF`/`#F1F1F1`, digelapkan sedikit.
- **Floating Banner dirombak total**: di-mask ke siluet lingkaran + tab, diisi **SKU saja**
  (model dibuang sesuai aturan), **tanpa teks promo**, logo di-key dari background cream
  lalu ditaruh di tab putih, close button dipertahankan utuh, output PNG transparan.
- **Ukuran file ditekan otomatis** sampai di bawah batas tiap format.

## Soal "background putih" di Skinny App

Ada dua area terang yang berbeda asalnya:

1. **Frame luar (`#F1F1F1`) + garis putih membulat** — ini datang dari template resmi
   Shopee, bukan tambahan. Guideline mencantumkan *"There is no white outline"* sebagai
   contoh yang **di-reject**, jadi outline ini wajib dan tidak boleh dihapus. Di aplikasi
   Shopee, area `#F1F1F1` menyatu dengan background halaman.
2. **Panel cream di kiri-kanan artwork** — ini konsekuensi artwork dikecilkan supaya
   bebas dari tag.

Kenapa artwork tidak bisa full-bleed? Karena tiga hal ini tidak bisa terpenuhi sekaligus:

| | tanpa background tambahan | wajah terlihat | tas (SKU) utuh |
|---|:---:|:---:|:---:|
| `--layout fullbleed` | ✅ | ❌ tertutup tag | ❌ terpotong di y302 |
| `--layout reflow` (default) | ❌ | ✅ | ✅ |

Model berada di tengah-atas KV (x600–750, y5–105) sedangkan tag ada di x392–807, y24–92 —
persis bertumpuk. Panning horizontal tidak menolong: agar kepala lolos ke kanan tag
dibutuhkan geser >680px, sedangkan slack yang tersedia hanya 178px. Tas ada di y255–352,
sementara full-bleed sudah memotong di y302.

Script memakai skala **maksimum** yang masih menjaga wajah dan tas: artwork 778x233
(bukan 727x218), panel cream 330px (bukan 381px). Itu batas matematisnya untuk KV ini.

**Solusi sebenarnya:** minta desainer me-layout ulang KV di dalam safe area — kanvas
1200x360, window aman x46–1153/y39–317, dan **zona larangan x392–807/y24–92** yang harus
bersih dari subjek. Model cukup digeser keluar dari tengah-atas, artwork langsung bisa
full-bleed tanpa kehilangan apa pun.

## Yang tetap butuh file berlapis dari desainer

- **Jumlah KSP.** KV memuat 3 blok teks — tagline "FREE TO BE Me", "Free Shipping |
  Voucher Up to 20RB", dan "Disc Up To 65% OFF". Guideline membatasi **maksimal 2 KSP**.
  Teks ini sudah menyatu di JPEG, jadi tidak bisa dikurangi tanpa file sumbernya.
- **Ukuran font KSP.** Karena artwork digeser untuk memberi ruang tag, teks pada Skinny
  App jadi lebih kecil dari rekomendasi ±47pt. Kalau ingin teks tetap penuh, KV perlu
  di-layout ulang di dalam safe area template.
- Konsistensi key visual dan messaging antar keempat format.
- Copy KSP tidak menyentuh restricted content (lihat `SYARAT_KETENTUAN.md`).
