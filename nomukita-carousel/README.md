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

`kategori/`. Untuk komponen Kategori di dekorasi toko Shopee. **Nol kredit.**

Dua bentuk, karena Shopee memakainya untuk dua keperluan: komponen Kategori
memakai gambar persegi 1024 x 1024, banner toko memanjang 1200 x 600.

### Matcha Series berisi lima, bukan dua

Anggotanya **Uji Kyoto, Shizouka, Nishio, Matcha Latte, dan Premix Matcha** -
tiga Pure Matcha asal tunggal dan dua racikan. Ketiga Pure Matcha itu tidak ada
di tabel dua belas produk `build_slides.py`; mockup-nya diambil dari Drive dan
disimpan di `prod-matcha/`.

Dua kenyataan menentukan bentuk gambarnya, dan keduanya baru terlihat setelah
mockup-nya dibuka:

1. **Ketiga pouch Pure Matcha identik** kecuali satu baris teks nama. Warna,
   tetes, katakana, dan tata letak labelnya sama persis. Dijejer apa adanya pada
   ukuran thumbnail, ketiganya membentuk pita hitam tanpa informasi. Jadi nama
   asalnya dinaikkan menjadi tipografi di bawah tiap pouch, bukan dibiarkan
   sebagai cetakan 4 px di labelnya.
2. **Pure Matcha 500 gram, dua racikannya 1000 gram**, dan bentuk kantongnya pun
   berbeda perbandingannya. Disamakan tingginya, perbedaan itu hilang - jadi
   beratnya ditulis di bawah tiap nama, dinyatakan dengan kata alih-alih
   disiratkan lewat ukuran yang skalanya belum bisa dipastikan.

Label nama mengecil sendiri sampai dua nama bertetangga tidak bersentuhan.
"MATCHA LATTE" dan "PREMIX MATCHA" kebetulan berdampingan dan itulah pasangan
terpanjangnya.

Sub-baris "three origins . two blends" **menunggu konfirmasi**: ia menyatakan
ketiga Pure Matcha berasal dari satu daerah masing-masing dan kedua sisanya
racikan. Dasarnya kata "Pure" dan nama daerah yang tercetak di kemasan, bukan
dokumen produk.

**Ejaan "Shizouka" mengikuti kemasan.** Nama daerahnya di Jepang dieja
*Shizuoka*. Untuk produk yang menjual asal-usul Jepang, salah eja di kemasan
adalah hal yang layak diperbaiki di sumbernya - sama seperti katakana Avocado.

### Versi dua anggota

`render_series.py` masih memuat `build()` dan `build_banner()`, yang menyusun
gelas-pouch-pouch-gelas untuk seri beranggota dua. Susunan itu tidak dipakai
untuk Matcha Series lagi karena lima anggota tidak muat, tapi tetap ada untuk
seri lain yang beranggota sedikit.

### Tiga kesalahan tata letak yang tertangkap saat membangunnya

Ketiganya sejenis: menyusun tata letak dari ukuran yang salah.

1. **Gelas diukur dari kotak penuhnya.** Kotak penuh gelas Matcha Latte 569 x 706
   karena bayangan dan caustic-nya menjulur jauh ke samping; badannya sendiri
   hanya 327 px. Dipakai apa adanya, gelasnya terhitung 242 px dan mendorong
   kelompoknya keluar kanvas.
2. **Bayangan lempar tidak ikut terukur.** `photo.box()` mengembalikan kotak
   SILUET, dan bayangan bukan bagian dari siluet. Setelah perbaikan pertama,
   tintanya masih berhenti empat piksel dari tepi meski marginnya empat puluh.
3. **Rentang yang dipusatkan salah tanda.** Menjulurnya ditambahkan, bukan
   dikurangi, sehingga kelompoknya bergeser separuh total julurannya ke kanan:
   margin kiri 100 px, margin kanan 2 px.

Kelompok yang tidak muat dikecilkan **sekali** dengan satu faktor yang dihitung
langsung, bukan dikecilkan berulang lalu dipusatkan ulang - cara itu pernah
berputar 985 kali tanpa pernah selesai waktu membangun slide 250 gram.

### Menambah seri lain

Tambahkan entri di `LINEUPS` pada `render_series.py`: headline, katakana,
sub-baris, dan daftar (nama, berat, berkas mockup). Susunannya menyesuaikan
sendiri dan mengecil otomatis kalau anggotanya bertambah.

### Halaman panjang seri

`kategori/MatchaSeries_longform_1200x3364.png`, dari
`ref-matcha-series-sproutliving.webp` yang dikirim pelanggan. Bentuknya untuk
area **deskripsi produk**, bukan carousel: Shopee dan TikTok Shop sama-sama
membatasi carousel di sembilan gambar persegi, sedangkan deskripsi menerima
gambar panjang.

Yang diukur dari acuan:

| | |
|---|---|
| kanvas | 1200 x 2377, empat pita |
| tinggi pita | 588 px |
| kemiringan batas | 0,2 px per px, arahnya **bergantian** tiap batas |
| susunan | teks kiri, teks kanan, teks kiri, teks kanan |

Versi Nomukita memakai lima pita untuk lima anggota, ditambah kepala halaman
karena acuannya potongan dari halaman yang lebih panjang dan tidak menyatakan
miliknya siapa.

**Warnanya tidak diambil dari acuan.** Acuan memakai empat pastel - biru
(169,224,249), salmon (252,204,190), krem (247,219,167), mint (179,221,191) -
dan tidak satu pun ada di palet Nomukita. Menyalinnya berarti mengarang empat
warna merek baru. Jadi pitanya berselang-seling antara bone white dan satu tint
matcha green 18%, keduanya sudah ada di palet, dan headline-nya tetap matcha
green seperti di seluruh slide yang sudah disetujui.

Acuan juga memakai teks putih miring. Comfortaa maupun All Round Gothic tidak
punya potongan miring, dan teks putih di atas tint terang tidak terbaca, jadi
teksnya charcoal - warna teks merek ini sejak slide pertama.

Baris berat memakai charcoal, bukan kanji grey. Kanji grey (219,218,213) dipakai
untuk watermark di atas bone white; di atas tint pita (220,226,205) selisihnya
tinggal satu level dan barisnya hilang. Tingkatannya dibawa ukuran huruf.

**Tidak ada dokumen brand guideline di Drive.** Palet dan font yang dipakai di
sini adalah yang sudah tayang dan disetujui di slide 1, 2, dan 5: bone white
(241,240,235), matcha green (127,162,67), steel blue (94,152,189), charcoal
(29,29,30), kanji grey (219,218,213); All Round Gothic Bold untuk headline,
Comfortaa untuk badan, Shippori Mincho untuk katakana.

Tiga baris tentang asal - Uji, Shizouka, Nishio - menyatakan apa daerah itu,
bukan mutu atau kultivar produknya, dan **masih menunggu konfirmasi** seperti
sub-baris "three origins . two blends".

### Versi 1:1

Marketplace meminta 1:1, jadi ada tiga bentuk yang berbagi satu geometri:

| berkas | untuk |
|---|---|
| `kategori/MatchaSeries_longform_1200x3364.png` | deskripsi produk |
| `kategori/MatchaSeries_1to1_semua.png` | satu bidang persegi, kelima anggota |
| `kategori/matcha-1to1/` | lima bidang persegi, satu per anggota |

**Kemiringan diagonal terikat pada tinggi pita, bukan angka mutlak.** Acuannya
0,2 px per px pada pita 588 di kanvas 1200, artinya diagonalnya naik-turun 240 px
sepanjang kanvas, atau **0,408 kali tinggi pitanya**. Yang tetap adalah
perbandingan itu.

Ini bukan kerapian belaka. Angka 0,2 dipakai apa adanya di kanvas 1:1 yang
pitanya cuma 170 px menghasilkan diagonal naik-turun 205 px - lebih tinggi
daripada pitanya sendiri - sehingga batas atas dan batas bawah saling menyeberang
dan pitanya pecah menjadi baji. Dengan perbandingan yang benar, kemiringannya
jadi 0,068 dan pitanya utuh.

**Yang satu bidang tetap membawa naskahnya.** Percobaan pertama menyisakan 170 px
per pita dan naskahnya terpaksa dibuang, tinggal nama produk - padahal keterangan
itulah isi halaman panjangnya. Yang mengembalikannya: kepala halaman dipangkas
dari 176 px jadi 118 px, dan seluruh tipografinya diperkecil sesuai pita 181 px.
Blok teksnya jadi setinggi 110 px, menyisakan 35 px lapang di atas dan bawahnya.
Pouch-nya tidak ikut dikecilkan supaya labelnya masih terbaca.

Pouch dipusatkan pada pitanya, kecuali kalau itu membuatnya menembus tepi. Pusat
pita terakhir jatuh di y 933, dan pouch setinggi 158 yang dipusatkan di sana
berakhir 12 px dari dasar kanvas sementara sisi kiri-kanannya bermargin 62.

Karena Shopee dan TikTok Shop sama-sama menerima sembilan gambar, versi lima
bidang memberi tiap anggota satu kanvas penuh: pita diagonal, naskah, berat, dan
pouch pada ukuran yang terbaca. Arah miringnya bergantian antar anggota supaya
lima kotak yang dilihat berurutan tetap terasa satu deret.

### Kategori Premium, Exclusive, dan 250 gram

`kategori/Kategori_*.png`, dari `ref-kategori-goodprotein.jpg`. Semuanya 1:1,
**nol kredit**.

Diukur dari acuan: kanvas praktis 1:1, latar krem di bidang atas, pita berwarna
di 14% terbawah dengan tepi atas **mendatar**, enam pouch menumpuk sebagian dan
membesar dari kiri ke kanan (yang terkanan 1,27 kali yang terkiri), dan **pitanya
digambar di atas pouch** sehingga kakinya terpotong.

Naskah acuannya promo diskon, "50% off" dan "LIMITED TIME OFFER". Itu tidak
disalin: potongan harga bukan sesuatu yang boleh dikarang. Yang dipinjam susunan
tiga tingkatnya - baris kecil, baris besar sebagai jangkar, baris di dalam pita -
lalu diisi nama kategori dan ukuran kemasan, yang keduanya sudah tercetak di
kemasannya sendiri. Warnanya juga tidak disalin: krem dan biru acuan tidak ada di
palet, jadi yang dipakai bone white dan steel blue.

**Keanggotaannya dibaca dari kata seri yang TERCETAK di kemasan**, bukan dari nama
berkas mockup. Labelnya berbunyi: Premium untuk sepuluh produk (biru muda),
Exclusive untuk dua - Premix Matcha dan Chocolate Signature (emas). Empat berkas
mockup bernama "Exclusive series" padahal labelnya sendiri Premium, jadi nama
berkas tidak dipakai sama sekali. Frappe Base tidak mencetak kata seri apa pun;
`build_slides.py` menempatkannya di premium.

Kemasan membedakan kedua seri dengan **warna**: Premium biru muda, Exclusive
emas. Emas tidak ada di palet slide, jadi kedua kategori memakai steel blue. Kalau
pembedaan warna itu penting, ia perlu ditambahkan ke palet lebih dulu.

### Tiga hal yang tidak bisa disalin mentah dari acuan

1. **Jumlah yang dipajang, bukan jumlah yang ada.** Acuan memajang enam. Dipaksa
   memajang kedua belas anggota 250 gram, tiap kemasan tinggal 122 px dan tidak
   ada yang terbaca. Enam yang dipajang, jumlah sebenarnya dinyatakan di baris
   kecil - dan itu memang konvensi marketplace: penjual multi-varian menampilkan
   empat sampai tujuh kemasan lalu menyebut totalnya dengan angka.
2. **Kedalaman pita mengikuti tinggi pouch.** Versi pertama memakai garis pijak
   tetap di y 998; kemasan 250 gram yang cuma setinggi 125 px lalu terbenam
   seluruhnya di balik pita dan kategori itu terbit **tanpa satu pun produk
   terlihat**. Sekarang pita menutupi 18% bagian bawah pouch, berapa pun tingginya.
3. **Jarak antar pouch mengikuti bentuk kemasannya.** Langkah 0,58 milik acuan
   hanya cocok untuk kemasan yang lebih tinggi daripada lebar. Kantong 250 gram
   1,24 kali lebih lebar daripada tinggi, dan pada langkah itu ia hanya bisa
   setinggi 237 px, menggantung di dasar dengan lubang 400 px di atasnya.
   Langkahnya dirapatkan dulu sampai 0,34, baru tingginya yang dikorbankan.

## Kategori gaya flat-lay (`kategori/flatlay/`)

Acuan: `ref-kategori-flatlay-oatsovernight.jpg` - Oats Overnight, "Have a Healthy
Start to 2020". Skrip: `render_flatlay.py`. Satu gambar per kategori, bukan
carousel. Exclusive ditahan atas permintaan pelanggan.

| Berkas | Ukuran | Isi |
| --- | --- | --- |
| `Kategori_premium_flatlay_1000x1500.png` | 1000 x 1500 | lima pouch 1000 gram |
| `Kategori_premium_flatlay_1024.png` | 1024 x 1024 | empat pouch 1000 gram |
| `Kategori_250gr_flatlay_1000x1500.png` | 1000 x 1500 | lima kantong 250 gram |
| `Kategori_250gr_flatlay_1024.png` | 1024 x 1024 | empat kantong 250 gram |

Dua ukuran karena acuannya 2:3 sementara syarat gambar kategori Shopee yang
berlaku di repo ini 1:1. Keduanya memakai satu tata letak: seluruh angka posisi
disimpan sebagai pecahan lebar/tinggi kanvas, bukan piksel.

### Yang diukur dari acuan

Kemiringan pita 0,379 pada tepi atas ungu dan 0,425 pada hijau muda, dipakai
0,40. Tangga tiga tingkat, tiap tingkat satu atau dua slab bertumpuk, ujung
kanannya berbeda-beda. Pouch terbaring miring dengan bayangan lembut. Judul
pendek rata kanan, tepi kirinya bergerigi. Tiga langkah berikon dengan garis
bawah. Tombol ajakan di kiri bawah.

### Yang tidak disalin

**Warnanya.** Acuan memakai enam warna jenuh; palet Nomukita hanya matcha green,
steel blue, bone white, charcoal. Tangganya disusun dari campuran dua hue merek
itu dengan bone white - gradasi, bukan hue baru.

**Naskah musimannya.** "Have a Healthy Start to 2020" adalah kampanye tahun baru.
Yang dipinjam bentuknya; isinya nama kategori dan jumlah rasa, dua hal yang
tercetak di kemasannya sendiri.

**Mix / Sleep / Eat** diganti Scoop / Pour / Stir, karena produknya bubuk
minuman. Ikonnya digambar garis di dalam skrip, bukan dihasilkan model: nol
kredit dan bisa diulang persis.

### Naskah tidak pernah menempel apa pun

Ujung tiap pita, posisi tiap kemasan dan lebar tombol **dihitung dari kotak
naskahnya**, bukan ditebak dengan angka tetap. Kotak judul dan kotak kolom kanan
diukur lebih dulu, lalu:

- tiap slab dipotong pada `x` terakhir sebelum ia masuk ke kotak mana pun, dengan
  jarak bebas 0,026 lebar kanvas. Karena pita menurun, slab bawah sebuah tingkat
  kadang boleh lebih panjang daripada slab atasnya - tepi atasnya sudah lewat di
  bawah judul. Satu tingkat tetap memakai satu ujung, yang terpendek, karena tepi
  kanan bertakik terbaca sebagai cacat;
- kemasan yang menyentuh kotak naskah digeser ke kiri secukupnya;
- kotak tombol diturunkan dari lebar tulisannya.

`render_flatlay.check()` memeriksa hasilnya: kontras tiap tinta terhadap latar
persis di bawahnya, **halo** selebar jarak bebas di sekeliling tiap tinta (yang
harus polos - huruf yang hampir menyentuh pita sama cacatnya dengan huruf yang
tenggelam di dalamnya), kontras kotak tombol terhadap apa yang ditutupinya,
tumpang tindih tiap kemasan dengan kotak naskah dan dengan tombol, kemasan yang
terpotong tepi kanvas, dan tinta yang menyentuh tepi kanvas. Keempat berkas lolos.

### Empat hal yang muncul saat membangun

1. **Terang pita harus melawan terang pouch.** Pouch 1000 gram hampir hitam
   (rata-rata 59,64,69), kantong 250 gram putih (228,230,227). Satu skema warna
   tidak bisa melayani keduanya: Premium dapat bidang steel blue dengan pita
   terang, 250 gram dibalik - bidang bone white dengan pita jenuh.
2. **Kolom kanan milik naskah.** Percobaan pertama memanjangkan pita sampai 0,80
   lebar seperti acuan, dan ikon serta label bone white mendarat penuh di atas
   slab bone white - hilang, dan kata "Scoop" terpotong tepi pita. Acuan bisa
   begitu karena ikonnya hitam di atas hijau. Sekarang tiap pita berhenti sebelum
   kolom kanan.
3. **Kanvas 1:1 memuat empat pouch, bukan lima.** Tingginya sepertiga lebih
   pendek daripada acuan sementara isinya sama. Dipaksa lima, pouch kelima
   terpotong tepi bawah dan yang keempat menabrak tombol.
4. **Tombolnya charcoal, bukan bone white.** Versi bone white pada kanvas 1:1
   mendarat penuh di atas slab bone white: 25.636 piksel tanpa kontras sama
   sekali. `render_flatlay.check()` sekarang membandingkan tiap unsur lapisan atas
   dengan apa yang persis ada di bawahnya, dan kotak tombol diperiksa tersendiri.

### Yang tidak dipajang

Mockup Avocado mencetak レモンティー, bukan アボカド. Di gambar kategori kemasannya
tampil cukup besar untuk terbaca, jadi produk itu tidak ikut dipajang sampai
mockup-nya diperbaiki; ia tetap terhitung dalam "ten flavours".


### Cacat yang diperbaiki setelah tinjauan pelanggan

1. **Huruf F pada "Flavours" menyatu dengan slab bone white.** Ujung pita pertama
   berhenti 15 px dari batang hurufnya. Diperbaiki dengan menurunkan ujung pita
   dari kotak judul, bukan dengan menggeser angkanya.
2. **"See All Flavours" menonjol keluar dari kotaknya.** Kotaknya berukuran tetap
   sementara tulisannya tidak. Sekarang kotaknya diturunkan dari lebar tulisan
   ditambah panah dan padding.
3. **Ikon sendok terbaca sebagai kaca pembesar.** Lingkaran sempurna dengan gagang
   lurus. Mangkuknya sekarang lonjong dan miring.
4. **Ikon tuang tidak terbaca.** Kemasannya miring ke arah yang salah sehingga
   mulutnya menjauhi gelas, dan tetesannya tiga garis yang tidak berasal dari mana
   pun. Sekarang satu aliran menyambung dari mulut kemasan ke mulut gelas.
5. **Garis di bawah label menggantung.** Ia mulai setelah kata dan tidak menempel
   pada apa pun. Sekarang garis bawah penuh dari tepi kiri label sampai sejajar
   tepi kanan judul.
6. **Diagonal tandingan memotong kolom naskah.** Batasnya lewat tepat di belakang
   ikon sendok. Sekarang ia berhenti tegak di batas kolom, sama seperti pita.
7. **Kantong 250 gram menutupi label tetangganya.** Anggota kedua masuk ke kotak
   judul; digeser keluar, ia menutup setengah nama rasa anggota pertama. Kategori
   250 gram sekarang punya susunan slotnya sendiri, yang menaruh anggota jauh ke
   kanan jauh ke bawah juga.

## Kategori gaya poster (`kategori/poster/`)

Acuan: `ref-kategori-poster-icedmango.jpg` - "Iced Mango Matcha Latte". Skrip:
`render_poster.py`. Lima kategori, dua ukuran, sepuluh berkas. Menggantikan gaya
flat-lay atas permintaan pelanggan; berkas flat-lay tetap disimpan.

| Kategori | Kata | Kanji | Baris kaki | Kemasan |
| --- | --- | --- | --- | --- |
| matcha | MATCHA | 抹茶 | five packs | Pure Matcha Uji Kyoto 500 gram |
| premium | PREMIUM | 飲む | ten flavours | Cookies & Cream 1000 gram |
| exclusive | EXCLUSIVE | 飲む | two flavours | Chocolate Signature 1000 gram |
| 250gram | 250 GRAM | 飲む | twelve flavours | Matcha Latte 250 gram |
| 1000gram | 1000 GRAM | 飲む | twelve flavours | Teh Tarik 1000 gram |

Ukurannya 1024 x 1024 dan 1080 x 1440. Acuannya 1086 x 1448; syarat 1:1 untuk
gambar kategori Shopee tetap berlaku, jadi keduanya dibuat dari satu tata letak
yang seluruh angkanya pecahan kanvas.

### Yang diukur dari acuan

Bidang rata tanpa pita. Satu baris kecil di atas. Judul yang DIULANG, produk
digambar DI ATASnya sehingga salinan di bawah tertutup sebagian, alas produk di
0,918 tinggi kanvas. Lebar tinta dijaga tetap sehingga tepi baloknya rata
kiri-kanan.

### Versi pertama terlalu padat

Versi pertama menyalin kepadatan acuan apa adanya: dua baris berisi tiga kata,
diulang tiga kali, selebar 0,851 kanvas. Enam baris huruf tebal setinggi 122 px
memenuhi hampir seluruh bidang. Pada acuan itu berhasil karena naskahnya nama
satu minuman yang memang panjang dan hurufnya serif tipis-tebal, jadi baloknya
terbaca sebagai tekstur. Dengan All Round Gothic yang tebal merata dan nama
kategori yang pendek, yang tersisa hanya kata bertumpuk - dan pelanggan benar,
itu bukan minimalis Jepang.

Yang dikurangi jumlah katanya, bukan gagasannya:

- yang diulang **satu kata**, bukan dua baris berisi tiga kata;
- lebarnya turun dari 0,851 ke 0,52 kanvas;
- salinannya **memudar** 0,62 kali tiap tingkat. Ketiga salinan pada kekuatan
  penuh membuat serpihan di kiri dan kanan kemasan sama beratnya dengan kata
  pertama, dan yang terbaca tiga kata, bukan satu kata yang bergema;
- jumlah anggota turun ke satu baris kecil berjarak huruf di kaki;
- ditambah satu tanda kanji, dan **hanya yang tercetak pada kemasan Nomukita
  sendiri** - 抹茶 pada kemasan matcha, 飲む pada kemasan 250 gram - supaya tidak
  ada satu pun kata Jepang yang dikarang.

### Tiga hal yang tidak bisa disalin

1. **Acuan memilih dua baris yang kebetulan hampir sama lebar** ("Iced Mango" 924,
   "Matcha Latte" 927) pada satu ukuran huruf. Nama kategori tidak begitu, jadi
   lebarnya yang dijaga tetap dan tinggi hurufnya yang dibiarkan berbeda - cara
   yang sama yang dipakai pada keterangan slide 5. Ukuran huruf bilangan bulat
   tidak pernah mendarat tepat, jadi sisanya diselesaikan dengan meregangkan
   potongannya sendiri, di bawah setengah persen.
2. **Banyaknya salinan tidak bisa jadi angka tetap.** Tinggi huruf turun dari
   lebar yang dijaga tetap, jadi kata panjang menghasilkan potongan pendek:
   "250 GRAM" hanya setinggi 82 px dan tiga salinannya berakhir 17 px DI ATAS
   puncak kemasan - tidak ada yang tertindih, dan susunan berlapis yang jadi inti
   acuan itu hilang. Salinan ditambah sampai baloknya benar-benar masuk ke
   belakang kemasan.
3. **Balok naskah harus lebih lebar daripada kemasan.** Serpihan di kiri dan
   kanan kemasan adalah seluruh isi gagasan ini. Kantong 250 gram 1,24 kali lebih
   lebar daripada tinggi, dan pada batas lebar 0,72 ia jadi lebih lebar daripada
   baloknya yang 0,52: setiap salinan di bawah yang pertama tertelan bulat-bulat
   dan yang tersisa cuma satu sayatan tipis di tepi atas kemasan, terbaca sebagai
   cacat cetak. Lebar balok sekarang diturunkan dari lebar kemasan, dan batas
   lebar kemasan dirapatkan ke 0,64.
4. **Sayatan tipis dilarang.** Kalau puncak sebuah salinan jatuh sedikit saja di
   atas puncak kemasan - pada Exclusive 1:1 selisihnya satu piksel - yang tampak
   cuma seiris huruf. Salinan itu digeser turun sampai persis mulai di puncak
   kemasan, sehingga ia sepenuhnya di belakang dan hanya ujung kiri-kanannya yang
   muncul. `check()` menolak salinan yang tersayat kurang dari 30 persen
   tingginya, dan menolak kemasan yang lebih lebar daripada baloknya.

Logo diukur dari lebarnya, bukan tingginya: wordmark ini 6,9 kali lebih lebar
daripada tinggi, dan menyamakan tingginya dengan baris kecil acuan membuatnya
0,435 kanvas - ia berhenti terbaca sebagai baris kecil.

`render_poster.check()` memeriksa kontras judul terhadap bidang, lebar tiap
salinan (harus sama persis), tinta menyentuh tepi kanvas, kemasan terpotong tepi
kanvas, kemasan menutupi logo, kanji atau baris kaki, dan kemasan yang tidak
menindih naskah sama sekali. Kesepuluh berkas lolos.

### Yang perlu keputusan pelanggan

Kemasan 1000 gram tampil setinggi 56 persen kanvas, dan pada ukuran itu **panel
kontak di sisi kirinya terbaca**: alamat web, nomor Customer Service, nomor
WhatsApp dan tiga akun media sosial. Shopee melarang informasi kontak di dalam
gambar produk. Panel itu tercetak pada mockup-nya sendiri, jadi menghapusnya
berarti mengubah kemasan pelanggan - saya tidak melakukannya tanpa persetujuan.

## Empat produk baru: Pure Dark Cocoa, Dark Cocoa, Cappuccino, Taro

Slide 1 untuk keempatnya, tiga varian per produk, memakai pipeline yang sudah ada.

| Produk | Seri | Katakana | Kemasan kecil | Berkas |
| --- | --- | --- | --- | --- |
| Pure Dark Cocoa | exclusive | ピュアダークココア | 300 gram | `PureDarkCocoa_S1_{300gr,1000gr,300&1000gr}.png` |
| Dark Cocoa | exclusive | ダークココア | 250 gram | `DarkCocoa_S1_{250gr,1000gr,250&1000gr}.png` |
| Cappuccino | premium | カプチーノ | 250 gram | `Cappuccino_S1_{250gr,1000gr,250&1000gr}.png` |
| Taro | premium | タロイモ | 250 gram | `Taro_S1_{250gr,1000gr,250&1000gr}.png` |

Tiga gaya, sama seperti dua belas produk pertama: `slide-1/` pouch saja (ketiga
varian, termasuk kombinasi), `slide-1-1000gr/` dan `slide-1-250gr/` dengan gelas
berisi minuman dan prop bahan. Kombinasi hanya ada dalam gaya pouch saja, sama
seperti sebelumnya.

Seri dan katakananya dibaca dari label yang TERCETAK pada tiap kemasan, lalu
diperiksa ulang oleh dua pembaca yang bekerja terpisah. Keduanya sepakat, dan
kali ini nama berkas mockup-nya memang cocok dengan labelnya - tidak seperti
empat mockup pada dua belas produk pertama yang bernama "Exclusive series"
padahal labelnya Premium.

Pelanggan menulis "Cappucino"; kemasannya mencetak "Cappuccino". Yang dipakai
ejaan kemasannya.

### Yang perlu keputusan pelanggan

1. **Kemasan 300 gram itu mencetak nama yang berbeda.** Pure Dark Cocoa tidak
   punya kemasan 250 gram; yang ada 300 gram, dan bentuknya lain sama sekali:
   kotak karton putih, bukan pouch hitam. Yang tercetak di atasnya **"PURE
   BELGIAN COCOA"**, dengan lencana "100% COCOA" dan "Net. 300 gr". Tidak ada
   kata seri Premium atau Exclusive, dan tidak ada satu pun baris katakana. Kata
   "Dark" tidak muncul di mana pun pada kemasan itu.

   Slide-nya tetap saya buat seperti yang diminta - berjudul PURE DARK COCOA
   dengan ピュアダークココア - tapi judul itu tidak sama dengan yang tercetak pada
   kemasan yang dipajangnya. Perlu dipastikan dulu apakah keduanya SKU yang sama
   sebelum slide ini terbit.

2. **Tinggi kotak 300 gram itu tebakan mata.** Semua ukuran di slide 1 diturunkan
   dari tinggi sebenarnya - pouch 1000 gram 24 cm, pouch 250 gram 12 cm, alpukat
   11 cm - pada skala 18,2 px/cm. Untuk kotak 300 gram tidak ada angka yang bisa
   saya periksa, hanya berkas artworknya. Dipakai 15 cm. Kalau ukuran
   sebenarnya diketahui, satu angka di `build_slides.SMALL` cukup.

3. **Acuan Pure Dark Cocoa dan Dark Cocoa dua-duanya milkshake cokelat** dengan
   krim kocok dan siraman saus, jadi kedua slide tampak sangat mirip, dan
   keduanya juga dekat dengan Chocolate Signature yang sudah ada. Pure Dark Cocoa
   sendiri kemasannya bertuliskan 100% cocoa, yang tidak sejalan dengan sajian
   bergula seperti itu. Keduanya acuan pilihan pelanggan, jadi tidak saya ubah.

4. **Daun pada acuan Taro bukan daun talas.** Yang tampak daun sempit mengkilap
   bertepi rata, mirip daun jeruk; daun talas besar dan berbentuk hati.
   Dipertahankan supaya sama dengan acuannya.

5. **Lisensi stok.** Acuan biji kopi dan acuan irisan talas keduanya unduhan
   komp stok berukuran kecil (728x353 dan 626x469) tanpa cap air. Lisensinya
   belum diperiksa - pertanyaan terbuka yang sama dengan acuan teh hitam.

### Tiga hal yang muncul saat membangunnya

1. **Perintah prop kakao ditolak penyaring kebijakan Google, dua kali.** Bunyinya
   "one whole cocoa pod lying beside a second pod split open lengthways and
   filled with cocoa beans". Ditulis ulang jadi "two cocoa pods, one whole and
   one cut in half to show the beans inside" dan langsung lolos. Yang ditolak
   kalimatnya, bukan gambarnya - acuannya sendiri tidak pernah bermasalah.
2. **Acuan biji kopi berlatar kotak-kotak transparansi yang sudah menyatu ke
   dalam piksel** - petak putih 255 berselang abu 204 di seluruh bingkai. Itu
   bukan latar yang bisa diminta hilang; modelnya akan menyalin kotak-kotaknya.
   Diratakan jadi putih sebelum dikirim (`flatten_checker`), dengan ambang terang
   190, bukan 225 seperti `strip_watermark`: petak abunya sendiri bernilai 204,
   jadi pada 225 ia ikut terhitung sebagai subjek dan tidak ada yang diputihkan.
3. **Kemasan kecil tidak lagi selalu "250 gram".** Berkas, kata beratnya, tinggi
   relatifnya dan tinggi fisiknya sekarang datang dari satu tempat,
   `build_slides.small_pack`, dan `render_250.py` membacanya dari situ alih-alih
   menulis "250 gram" langsung di badan kode.

### Biaya

Delapan gambar dihasilkan: empat gelas berisi minuman dan empat prop bahan,
32 kredit. Dua percobaan prop kakao yang ditolak penyaring tidak menghasilkan
berkas.

### Menjalankan

    KIE_API_KEY=... python3 batch.py puredarkcocoa darkcocoa cappuccino taro
    python3 build_all.py puredarkcocoa darkcocoa cappuccino taro
    python3 build_all_250.py puredarkcocoa darkcocoa cappuccino taro

Kedua driver itu sekarang menerima daftar slug; tanpa argumen keduanya
mengerjakan semua produk seperti sebelumnya.
