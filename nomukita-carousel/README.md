# Nomukita — Carousel Slide 1 (Premium & Exclusive series)

36 slides: 12 products × 3 packaging variants (250 gram, 1000 gram, 250 gram & 1000 gram),
1024 × 1024, background bone white (241, 240, 235).

Built to **Nomukita - Design System Carousel Marketplace**, calibrated pixel-for-pixel
against the approved `Uji_S1_500gr.png` and `Uji_S1_500&30.png`.

## Layout (identical on every slide, measured off the reference)

| element | position |
|---|---|
| logo nomukita | x 362–662 (width 300), y 52 |
| katakana watermark | ink top y 165, centred, Shippori Mincho 44, (219, 218, 213) |
| headline | cap top y 232, cap height 50, centred, All Round Gothic Bold 74 |
| sub-line | ink top y 304, centred, Comfortaa Regular 32, (29, 29, 30) |
| product | stands on y 855, height 440 |
| Halal Indonesia | height 110, top y 881, centred |

## Rules applied

- **Headline colour** — green (127, 162, 67) for the two products whose name contains
  "Matcha"; steel blue (94, 152, 189) for the other ten. The blue is sampled from the
  rating drops on Uji slide 1.
- **No origin products** — the JAS and USDA seals, the ORIGIN badge and the taste
  criteria (Bitter / Umami / Sweetness / Creaminess) are dropped. Only Halal Indonesia
  remains. Those belong to Uji, Nishio and Shizouka only.
- **Combination slides** follow `Uji_S1_500&30`: both products bottom-aligned, the large
  pouch left, the small one in front on the right, sized to the real 250 g : 1000 g
  height ratio.
- **Sub-line** mirrors "ceremonial grade · 500 gram" from the reference, with the series
  in the grade slot: `premium grade · 250 gram`, `exclusive grade · 1000 gram`.

## White pouch on bone white

The 250 gram pouch is white and renders almost flat — its paper sits at 238–252,
*brighter* than the background, with only ~14 points of shading. On bone white it
reads as a pasted rectangle instead of an object.

Reference `Refrensi/Referensi Matchamu` solves the same white-on-white case the
other way round: background pure white (255), pouch paper kept **below** it at
217–238 (about 27 points down, sides falling to 150), so the form is carried by a
wide gradient rather than by brightness.

`model_white()` reproduces that on our background: paper down to 215 — 26 points
under the bone white — with the shading stretched 1.7×, plus a soft contact
shadow at the base. The curve is smoothstepped above luminance 175, so the
printed kanji, the blue mark and the label text keep their full strength, the way
the Matchamu label stays fully saturated.

Applied to the 250 gram slides and to the small pouch on the combination slides.
The 1000 gram pouch is black and is left untouched.

## Font licence

All Round Gothic is the Fontspring DEMO build: `-`, `–`, `°`, `4` and `&` are locked and
render as a "DEMO" mark. `build_slides.py` detects those characters and draws them in
Comfortaa Bold, scaled to match the cap height — this affects `COOKIES & CREAM`.
Buy the retail licence before mass production.

## Regenerating

`build_slides.py` expects, next to itself:

- `fonts/` — All Round Gothic + Comfortaa (Drive: `Nomukita/`), Shippori Mincho (Google Fonts)
- `prod/` — the pouch mockups from Drive `Nomukita/Packaging 250` and `Nomukita/Packaging 1000`
- `assets/` — `logo_nomukita.png` and `halal.png` (in this repo)

```
python3 build_slides.py      # writes out/<Product>_S1_<variant>.png
```

## Note on artwork

Both Avocado pouch mockups — 250 gram and 1000 gram — print レモンティー (lemon tea)
instead of アボカド. The slides use the correct アボカド in the watermark; the pouch
artwork itself needs fixing separately, at the source.

`Black tea_refrensi.jpg` is a watermarked stock comp. `batch.py` strips the
watermark before sending it so the model stops copying it back, but the licence
still has to be bought before this goes to print — the same as for the All Round
Gothic demo font.

## Slide 250 gram: gelas berisi minuman + prop bahan

12 slide di `slide-1-250gr/`, memakai aset minuman dan prop yang sama dengan
varian 1000 gram - tidak ada generate baru sama sekali.

250 gram bukan sekadar mengecilkan yang 1000 gram. Pouch-nya sachet datar yang
lebih lebar daripada tinggi dan tingginya separuh, jadi **gelas minum lebih
tinggi daripada pouch-nya**. Dua akibatnya:

- **Pouch digambar di depan**, bukan di belakang. Percobaan pertama menaruh
  fotonya di atas pouch dan produknya - yang justru hero - terkubur di antara
  propnya dan gelas.
- **Pouch-nya sendiri dibesarkan 30%** di luar skala fisiknya, di atas grup yang
  sudah dikomposisikan 1,35x skala slide 1000 gram. Itu memang melanggar skala:
  sachet 250 gram tidak setinggi gelas minum. Tapi pouch itu barang yang dijual,
  dan di marketplace produknya harus memimpin - keputusan dagang, bukan
  keputusan fotografi. Angkanya dipilih pelanggan dari empat tingkat.

Grupnya dipusatkan pada **rentang sesungguhnya** - termasuk garnis dan bayangan
yang menjulur keluar badan gelas - lalu dikecilkan kalau masih tidak muat dalam
margin 60 px. Memusatkan pada badan gelas saja membuat polong vanili menembus
tepi kanan kanvas, dan serai menyentuhnya lewat bayangannya.

## Slide 1000 gram: gelas berisi minuman + prop bahan

12 slide di `slide-1-1000gr/`. Gambar minuman dan prop digenerate lewat kie.ai
`google/nano-banana-edit`, lalu dikomposit dengan `photo.py` dan diperiksa satu
per satu — 12 dari 12 lolos.

**Tiap minuman dipentaskan ulang dari referensinya sendiri, jadi gelasnya ikut
gelas di referensi itu.** Versi sebelumnya menuangkan kedua belas minuman ke satu
gelas acuan bersama; hasilnya tidak lagi mirip minuman yang dipilih pelanggan.

**Prop diukur dari ukuran aslinya**, dikunci pada alpukat utuh 11 cm = 200 px
(18,2 px/cm), dengan batas lebar 92% lebar pouch. Sebelumnya semua prop dipaksa
200 px, sehingga biskuit 4,5 cm tampil setinggi 11 cm.

Alur, pemetaan referensi, dan tiap jebakan keying yang pernah merusak hasil ada
di `BRIEF-gelas-dan-prop.md`.

`batch.py` melewati file yang sudah ada, jadi menjalankan ulang tidak membakar
kredit untuk hal yang sudah berhasil. Butuh `KIE_API_KEY` dari environment;
jangan menaruh kunci di dalam repo.

## Slide 5: serving suggestions

12 slide di `slide-5/` — satu produk, tiga cara menyajikan. Tata letaknya diukur
dari `ref-Uji_S5.png` piksel demi piksel, bukan dikira-kira.

| elemen | posisi |
|---|---|
| judul `SERVING SUGGESTIONS` | tinta atas y 162, rata tengah, All Round Gothic Bold 54 |
| sub-judul `one <produk>, three ways to enjoy` | tinta atas y 226, Comfortaa 24 |
| sumbu ketiga kolom | x 226, 516, 791 |
| nama kreasi | tinta atas y 316 / **440** / 316, Comfortaa 24 huruf besar |
| baris resep | 34 px di bawah nama, jarak antar baris 28 px, Comfortaa 20 |
| tepi rata | kiri x 95, kanan x 944, tengah rata tengah |
| ketiga wadah berdiri di | y 915 |
| penanda tetes | 13 × 13, steel blue (94, 152, 189) |

Tata letaknya **tidak simetris, dan itu memang begitu di acuannya**: kolom kiri
rata kiri, kolom kanan rata kanan, kolom tengah rata tengah dan turun 124 px.
Garis penunjuk tipis yang menjembatani jarak yang berbeda-beda itu.

### Gaya penulisan

Mengikuti Uji apa adanya: takaran menempel pada huruf g (`25g`), volume dipisah
spasi (`200 ml`), spasi di kiri-kanan `+`, baris pertama diakhiri koma, tidak ada
titik di akhir, `&` untuk bahan terakhir.

Satu hal yang mudah terlewat: acuannya menyebut isinya dengan **satu kata
pendek** — `2g matcha`, bukan `2g exclusive matcha`. Nama panjang produknya sudah
ada di sub-judul, jadi mengulangnya di tiap baris resep hanya melebarkan barisnya
sampai menabrak kolom sebelah. Versi pertama menu ini memakai nama penuh dan
**40 dari 72 barisnya tidak muat** — `20g lemongrass + 150 ml sparkling water,`
selebar 414 px untuk jatah 284 px. Seperti acuannya, kreasi yang barisnya masih
kepanjangan boleh membuang volumenya (`+ cold water,`).

`fit_s5.py` mengukur lebar tinta tiap baris **sebelum satu kredit pun dipakai** —
itulah gunanya. Jalankan sampai nol pelanggaran, baru generate.

### Wadah

Dipotong langsung dari `ref-Uji_S5.png`, jadi kedua belas slide memakai bahasa
wadah yang sama dengan acuannya: mug batu untuk sajian panas, gelas tinggi untuk
dua sisanya. Tingginya diukur **utuh** — mug 244 px, gelas 365 px — bukan badan
gelasnya saja. Sekali percobaan menskalakan pada badan 370 px, lalu es dan busa
di atas bibir gelas menambah tinggi totalnya jadi ~475 px dan gelas tengah naik
menabrak keterangannya sendiri sedalam 84 px.

Wadahnya juga dipusatkan pada **bentuk utuhnya**, bukan badannya. Di acuan, mug
utuh berpusat di x 232,5 sementara badannya di x 263,5, dan penandanya ada di
x 226 — jadi acuannya memang memusatkan pada bentuk utuh termasuk gagangnya.

### Lempeng beige di bawah wadahnya

Sebagian frame hasil generate datang dengan wadahnya berdiri di atas **lempeng
beige lebar**, bukan bayangan. Terukur 190/173/149 — empat puluh level merah di
atas biru — sedangkan bayangan sejati menskalakan ketiga kanal sama rata.
`photo._key` benar menolak menyebutnya bayangan, tapi justru karena itu
lempengnya terhitung sebagai bagian dari subjek.

Akibatnya bukan sekadar bayangan yang kelebaran. Slide Vanilla mencetak **dua
persegi pucat bertepi lurus**: lempeng si mug menjulur sampai x 390, persegi
lapisan minuman berikutnya mulai di x 317, dan di daerah tumpangnya lapisan
kedua mengecat ulang lempeng lapisan pertama dengan `ratio × bone`.

Perbaikannya: **`photo.place(..., replace=False)` untuk slide 5**. Jalur alpha
hanya ada untuk satu keperluan — minuman yang berdiri di depan pouch hitam di
slide 1, di mana perkalian akan menyeret alpukat ke nyaris hitam sehingga
terbaca seolah di belakang kemasan. Ketiga wadah di slide 5 berdiri terpisah di
atas bone white dan tidak menumpuk apa pun, jadi alpha di sana tidak membeli
apa-apa dan justru merusak. Dengan perkalian saja, 172 menjadi 158 dan tidak ada
sambungan yang kelihatan.

Slide 1 tidak ikut berubah sama sekali — kedua puluh empat berkasnya diperiksa
byte demi byte setelah perubahan ini dan identik dengan yang sudah disetujui.

`verify.flare()` tetap menandainya, lewat bentuknya: gelas minum kira-kira sama
lebar di kakinya dan di badannya. Kedua belas minuman slide 1 yang sudah
disetujui terukur 0,67–1,10; frame yang membawa lempeng 1,26–2,11. Peringatan itu
sekarang soal **bayangan yang lebih lebar daripada di acuan**, bukan lagi cacat
yang tercetak — dan sengaja dibiarkan menyala supaya keadaan bahannya tetap
terlihat.

Yang sudah dicoba dan **tidak** menyelesaikan:

- melunakkan tepi bayangan di compositor — masalahnya bentuk lempengnya, bukan
  ketajaman tepinya; diblur seberapa pun tetap lempeng;
- menaikkan `SHADOW_CHROMA` — menyembuhkan satu frame, tidak menyentuh yang lain;
- memperkeras perintahnya, menyebut satu per satu "no beige patch, panel, mat,
  pool or halo" — 4 kredit, lempengnya tetap muncul, hanya bentuk minumannya yang
  berubah. Perintahnya dikembalikan ke versi yang slide Matcha Latte-nya sudah
  disetujui, supaya kedua belas slide tetap satu gaya.

### Satu frame digenerate ulang

`s5-cookiescream-hot.png` yang pertama datang dengan **gagang mugnya putus** —
tinggal bayangan samar di kiri bawah. `verify.frame()` menangkapnya sebagai 857
px detail di atas sweep di luar subjek. Digenerate ulang sekali, 4 kredit, dan
yang kedua lolos semua pemeriksaan.

### Menjalankan

```
python3 fit_s5.py         # nol kredit: pastikan tiap baris muat
python3 -c "import batch; batch.serving()"    # 4 kredit per gambar, melewati yang sudah ada
python3 build_all_s5.py   # susun dan periksa kedua belas slide
```

## Slide 2: manfaat produk

24 slide di `slide-2/`, dua belas produk x dua ukuran. **Nol kredit** - pouch-nya
memakai mockup yang sudah ada, sisanya tipografi.

Tata letaknya mengikuti `ref-slide-2-matchamu.webp` yang dikirim pelanggan
(Matchamu "Pure Sakura"), diukur piksel demi piksel:

| elemen | tinta atas | catatan |
|---|---|---|
| nama baris 1 | y 68 | dipaskan ke lebar 620 px, tinggi huruf 60-127 |
| nama baris 2 | y 206 | 0,6x baris pertama |
| judul manfaat 1 | y 398 | All Round Gothic Bold, tinggi huruf 28, warna aksen |
| badan | 21 px di bawah judulnya | Comfortaa 23, jarak baris 29 |
| judul manfaat 2 | 18 px di bawah dasar badan pertama | **mengalir**, tidak dipaku |
| baris penutup | y 778 | dipaku, seperti acuan |
| logo nomukita | y 953 | pojok kiri bawah, bukan tengah atas |
| pouch | garis alas y 884 | berpusat x 799, lebar maksimal 390 |

Semua teks rata kiri di x = 65. Badan dan penutup dibatasi lebar 490 px, judul
560 px, nama 620 px.

### Tiga angka yang sengaja tidak disalin mentah dari acuan

- **Jarak baris badan.** Acuan memakai 22 px untuk badan setinggi 19 px. Fontnya berbadan pendek; Comfortaa bundar dan tinggi, jadi pada 22 px
  ekor huruf g menyentuh kepala baris di bawahnya. Perbandingannya yang dijaga.
- **Lebar pouch.** Acuan memberi 298 px karena kantong Matchamu datar dan
  langsing (0,53). Standing pouch Nomukita jauh lebih gempal (0,73) dan menyusut
  jadi 407 px kalau dipaksa masuk. Yang ditiru pusat dan garis alasnya.
- **Tinggi huruf nama.** Nama acuan pendek ("Pure", empat huruf). Nomukita punya
  "TEH" sampai "CHOCOLATE". Disamakan tingginya, CHOCOLATE butuh 1143 px. Jadi
  yang dijaga tetap sama lebarnya (620 px), dan tinggi hurufnya bergerak 69 px
  (CHOCOLATE) sampai 127 px (TEH, MILK).

### Kemasan 250 gram punya geometri sendiri

Bukan versi kecil yang 1000 gram melainkan format lain: kantong datar bertali
gantung, lebih lebar daripada tinggi. Berdiri di garis alas yang sama ia cuma
setinggi 355 px dan meninggalkan lubang kosong 300 px di atasnya, jadi
garis alasnya dinaikkan ke y 785 supaya berpusat di tengah kolom kanan.

### Naskah

`s2_copy.py`. Judul dan badan berbahasa Inggris, tanpa tanda pisah panjang, atas
permintaan pelanggan - dan itu konsisten dengan slide yang sudah tayang
("SERVING SUGGESTIONS", "premium grade . 1000 gram").

**Semua manfaat adalah sifat BAHANNYA, bukan hasil uji atas bubuk jadinya.** Itu
bedanya dengan acuan: Matchamu "Pure" itu produk murni, bahannya memang
produknya. Kalau bubuk Nomukita didominasi gula dan krimer, klaim katekin dan
flavanol harus diturunkan jadi kalimat rasa. **Pertanyaan ini belum dijawab
pelanggan.**

Tiga baris penutup menyatakan fakta produk dan masih menunggu konfirmasi:
Avocado ("Thick because of the fruit"), Vanilla ("the aroma came from the pod"),
Frappe Base ("stays thick instead of separating"). Ditandai `NEEDS_OK`.

**Klaim detoks untuk Charcoal sengaja tidak ditulis.** Arang aktif mengikat obat
dan nutrisi, dan detoks masuk kategori klaim pengobatan yang dilarang Shopee
untuk makanan-minuman; TikTok Shop juga menolak klaim berlebihan.

### Dua hal yang perlu keputusan pelanggan

**Panel kontak di pouch 1000 gram.** Terbaca jelas pada ukuran slide 2:
`www.nomukita`, `+62 818-025...`, dan dua blok `Find Us on Social Media` berisi
handle Instagram dan TikTok. Aturan Shopee melarang informasi kontak pribadi dan
tautan media sosial di luar Shopee muncul di foto produk, sanksinya produk
diblokir lalu dihapus. Wilayah abu-abu karena itu foto kemasan asli, bukan
tempelan penjual - tapi slide 2 memperbesar pouch dua kali lipat dibanding
slide 1.

**Katakana Avocado masih salah.** Mockup-nya mencetak レモンティー (lemon tea).
Sudah tercatat sejak slide 1; di slide 2 pouch-nya lebih besar, jadi lebih
terbaca.

### Menjalankan

```
python3 fit_s2.py         # nol kredit: pastikan tiap baris muat
python3 build_all_s2.py   # susun dan periksa 24 slide
```

## Gambar kategori toko

`kategori/`. Untuk komponen Kategori di dekorasi toko Shopee, yang mengelompokkan
produk di luar halaman produk itu sendiri. **Nol kredit.**

Dua bentuk, karena Shopee memakainya untuk dua keperluan: komponen Kategori
memakai gambar persegi 1024 x 1024, banner toko memanjang 1200 x 600.

Bahasa visualnya dipinjam utuh dari slide 1 - logo, watermark katakana, headline,
sub-baris, garis alas y 855, seal Halal y 881 - supaya halaman kategori dan
halaman produk terbaca sebagai satu toko. Yang berbeda hanya isinya: seluruh
anggota seri berdiri berdampingan, masing-masing dengan minumannya, disusun
cermin (gelas, pouch, pouch, gelas) sehingga kedua pouch bertemu di tengah.

Versi memanjang tidak bisa memakai susunan yang sama. Pada tinggi 600 px,
tumpukan tengah menyisakan kurang dari 400 px untuk produk dan pouch-nya
mengecil sampai tidak terbaca, jadi perangkat mereknya pindah ke kolom kiri.

### Tiga kesalahan tata letak yang tertangkap saat membangunnya

Ketiganya sejenis: menyusun tata letak dari ukuran yang salah.

1. **Gelas diukur dari kotak penuhnya.** Kotak penuh gelas Matcha Latte 569 x 706
   karena bayangan dan caustic-nya menjulur jauh ke samping; badannya sendiri
   hanya 327 px. Dipakai apa adanya, gelasnya terhitung 242 px dan mendorong
   kelompoknya keluar kanvas. Ukur badannya.
2. **Bayangan lempar tidak ikut terukur.** `photo.box()` mengembalikan kotak
   SILUET, dan bayangan bukan bagian dari siluet. Setelah perbaikan pertama,
   tintanya masih berhenti empat piksel dari tepi meski marginnya empat puluh.
   Yang benar diukur adalah setiap piksel yang rasionya menyimpang dari satu.
3. **Rentang yang dipusatkan salah tanda.** Menjulurnya ditambahkan, bukan
   dikurangi, sehingga kelompoknya bergeser separuh total julurannya ke kanan:
   margin kiri 100 px, margin kanan 2 px.

Kelompok yang tidak muat dikecilkan **sekali** dengan satu faktor yang dihitung
langsung, bukan dikecilkan berulang lalu dipusatkan ulang - cara itu pernah
berputar 985 kali tanpa pernah selesai waktu membangun slide 250 gram.

### Menambah seri lain

Tambahkan entri di `SERIES` pada `render_series.py`: headline, katakana,
sub-baris, dan daftar anggotanya. Susunannya menyesuaikan sendiri.
