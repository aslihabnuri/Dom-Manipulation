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

## Floating Banner: dua versi

| File | Isi | Status guideline |
|---|---|---|
| `out/floating_banner_360x360.png` | SKU + **"Disc Up To 45% OFF"** | ⚠️ berisiko di-reject |
| `out/alt-no-promo/floating_banner_360x360.png` | SKU saja | ✅ aman |

Guideline mencantumkan **"Do not use promotional messages"** sebagai contoh Floating
Banner yang di-reject, sejajar dengan larangan menghapus close button dan menampilkan
brand ambassador. Versi promo karena itu **opt-in** — dihasilkan dengan `--promo`, dan
script mencetak peringatan setiap kali dipakai.

Teks diskonnya **diambil langsung dari KV**, bukan di-render ulang. Fontnya didone
kontras-tinggi yang tidak terpasang di sistem ini, dan tidak ada serif lokal yang mendekati
(kecocokan bentuk terbaik hanya 0,71 IoU terhadap digit asli). Memakai piksel aslinya
menjaga huruf yang benar alih-alih menirunya.

## Revisi copy pada KV 9:16 dan 1:1 (`retext_kv.py`)

```bash
python3 retext_kv.py --new ./assets_v2 --old ./assets --out ./kv_revised
```

Menghasilkan `kv_revised/square_1x1.jpg` (1080x1080) dan `kv_revised/igs_9x16.jpg`
(1080x1920) dengan dua perubahan: **45% → 60%** dan **"Free Shipping | Voucher Up to
20RB" → "Disc Product 15RB"**.

### Soal font

Font yang disertakan di brief, **Milden Serif, bukan font yang dipakai di KV.**
Terverifikasi:

| Elemen KV | Font sebenarnya | Milden cocok? |
|---|---|:---:|
| Angka diskon "45" | didone kontras-tinggi | ❌ IoU 0,33 (digit 4) / 0,61 (digit 5) |
| Copy di dalam pill | sans geometris | ❌ Milden serif |
| Headline "FREE TO BE" | didone condensed | ❌ Milden lebih lebar & ringan |

Karena itu angka diskonnya **tidak** di-render ulang dengan font pengganti:

- Angka **"6" diambil dari revisi KV sebelumnya** yang berbunyi "65%" — face, ukuran,
  warna, dan rasterisasinya identik, jadi hasilnya sempurna.
- Angka **"0" dikonstruksi** sebagai cincin elips memakai bobot goresan yang diukur
  dari "6" itu sendiri (sisi 23px / atas-bawah 7px untuk 1:1; 32px / 9px untuk 9:16).
  Itulah sebabnya ia duduk serasi di sebelahnya.

Hanya copy pill yang memakai font pengganti (**FreeSans**, sans lokal terdekat), dan
script mencetak peringatan setiap dijalankan. Kalau kamu punya file font sans aslinya,
ganti `SANS_REGULAR`/`SANS_BOLD` di `retext_kv.py` dan hasilnya jadi presisi.

## Ketajaman

Dua hal yang bikin hasil terlihat blur, keduanya sudah diperbaiki:

**1. Sumber Floating Banner salah pilih.** Sebelumnya tas diambil dari Banner Card
(531px) lalu di-*upscale* 1,32x — otomatis lembek. Sekarang diambil dari **KV square
(1080x1080)**, jadi semua penempatan menjadi *downscale*. Logo dan blok diskon juga
diambil dari sana; teks diskonnya bahkan duduk di background bersih, bukan menimpa
baju model, jadi hasil key-nya lebih rapi.

**2. Tidak ada kompensasi resample.** Setiap resize LANCZOS menghilangkan acutance, dan
banner ini di-resample dua kali (fitting + encode JPEG). Sekarang ada unsharp mask
(`sharpen()`, amount 0.55 / radius 1.1) setelah setiap resample.

Hasil terukur (variance of Laplacian, makin tinggi makin tajam):

| Format | sebelum | sesudah |
|---|---:|---:|
| Skinny App | 1127 | 1856 (+65%) |
| Banner Card | 1583 | 2566 (+62%) |
| Skinny Web | 1594 | 2631 (+65%) |
| Floating (dalam lingkaran) | 2482 | 4911 (+98%) |

Crop SKU diposisikan manual, bukan auto-fit, karena area KV yang bisa dipakai terkepung
tiga sisi: rok model di kiri, angka diskon di atas, frame di bawah. Offsetnya menempatkan
model di luar masking lingkaran sambil menjaga tas tetap terpusat. Batas cropnya juga
dipilih pada baris/kolom yang bersih — kalau memotong di tengah handle tas, peregangan
tepi akan menyeretnya jadi garis vertikal.

## Yang tetap butuh file berlapis dari desainer

- **Jumlah KSP.** KV memuat 3 blok teks — tagline "FREE TO BE Me", "Free Shipping |
  Voucher Up to 20RB", dan "Disc Up To 65% OFF". Guideline membatasi **maksimal 2 KSP**.
  Teks ini sudah menyatu di JPEG, jadi tidak bisa dikurangi tanpa file sumbernya.
- **Ukuran font KSP.** Karena artwork digeser untuk memberi ruang tag, teks pada Skinny
  App jadi lebih kecil dari rekomendasi ±47pt. Kalau ingin teks tetap penuh, KV perlu
  di-layout ulang di dalam safe area template.
- Konsistensi key visual dan messaging antar keempat format.
- Copy KSP tidak menyentuh restricted content (lihat `SYARAT_KETENTUAN.md`).
