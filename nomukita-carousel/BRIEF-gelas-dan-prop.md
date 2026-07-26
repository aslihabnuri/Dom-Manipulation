# Slide 1, varian 1000 gram — gelas berisi minuman + prop bahan

Susunan mengikuti `Refrensi/Referensi Matchamu`: pouch di tengah, gelas berisi
minuman di kanan, prop bahan di kiri, ketiganya dipusatkan sebagai satu grup.

## Produksi

Gambar minuman dan prop digenerate lewat kie.ai `google/nano-banana-edit`
(image-to-image), lalu dikomposit dengan `photo.py`.

**Tiap minuman dipentaskan ulang dari referensinya sendiri, jadi gelasnya ikut
gelas di referensi itu.** Versi sebelumnya menuangkan kedua belas minuman ke
satu gelas acuan bersama demi keseragaman carousel; hasilnya tidak lagi mirip
minuman yang dipilih pelanggan, jadi sekarang gelas mengikuti minumannya.

- `batch.py` — generate. Melewati file yang sudah ada, jadi menjalankan ulang
  tidak membakar kredit untuk hal yang sudah berhasil. Sekitar 4 kredit/gambar.
- `build_all.py` — komposit 12 slide dan verifikasi tiap hasilnya.
- `verify.py` — pemeriksaan mekanis, dijalankan pada setiap slide.

Butuh `KIE_API_KEY` dari environment. Semua trafik lewat curl: proxy menolak
urllib dengan 403, baik di host upload maupun di CDN hasil.

## Pemetaan referensi

| produk | gelas + minuman diambil dari | prop |
|---|---|---|
| Matcha Latte | Matcha_Referensi | Matcha Powder |
| Premix Matcha | Exclusive Matcha_referensi | Matcha Powder |
| Teh Tarik | Milk Tea_referensi *(gelasnya saja)* | Black tea *(aturan: pengganti alpukat)* |
| Chocolate Signature | Chocolate_referensi | Chocolate chunks |
| Cookies & Cream | Chocolate_referensi *(gelasnya saja)* | Cookies & Cream_referensi |
| Charcoal | Charcoal_referensi | Charcoal_Aestetic |
| Avocado | *tidak digenerate ulang — sudah disetujui* | Avocado |
| Vanilla | Exclusive Matcha_referensi *(gelasnya saja)* | Referensi Vanilla |
| Milk Tea | Milk Tea_referensi | Black tea *(aturan: pengganti alpukat)* |
| Lemon Tea | Lemon tea_referensi | lemon |
| Frappe Base | Frappe Base_referensi | — *(aturan: minuman saja)* |
| Lemon Grass | Lemon grass_referensi | Lemon Grass |

Teh Tarik, Cookies & Cream dan Vanilla tidak punya referensi minuman sendiri.
Masing-masing meminjam gelas dari minuman yang disajikan dengan cara serupa,
lalu isinya ditulis di prompt.

Prop daun teh dipakai bersama Teh Tarik dan Milk Tea, jadi digenerate sekali
saja sebagai `prop-blacktea.png`.

Dua referensi prop terbaru tetap harus digenerate ulang, bukan dipakai langsung:
biskuitnya bermerek dan bertuliskan nama merek, gundukan daun tehnya penuh
watermark Adobe Stock, dan keduanya tidak punya bayangan kontak — tanpa itu
propnya melayang di atas slide.

Watermark itu **tidak bisa dihilangkan lewat prompt**. Dua kali diminta
menghapusnya, modelnya justru menyalin watermark-nya huruf demi huruf, termasuk
strip vertikal di tepi kiri. Jadi watermark-nya dibersihkan dulu secara lokal —
strip kirinya dipotong, lalu semua yang bukan gundukan daun dijadikan putih
murni — dan `Black tea_clean.png` itulah yang dikirim.

## Ukuran di slide (1024 × 1024)

Skalanya dikunci pada alpukat: alpukat utuh 11 cm digambar 200 px dan itu yang
disetujui, jadi **18,2 px/cm**. Dengan patokan yang sama pouch 1000 gram 440 px
= 24 cm dan gelas 330 px = 18 cm.

| elemen | tinggi | dasar |
|---|---|---|
| pouch 1000 gram | 440 | y 829 |
| gelas | 330 | y 855 |
| prop bahan | menurut ukuran aslinya, lihat `PROP_CM` | y 855 |

Sebelumnya semua prop dipaksa 200 px. Biskuit 4,5 cm jadi tampil setinggi
11 cm — itu keluhan "gambar cookies terlalu besar", dan hal yang sama terjadi
pada daun teh dan bunga vanili. Sekarang tiap prop punya tinggi aslinya sendiri
dalam sentimeter, dengan batas lebar 92% lebar pouch: begitu lewat, propnya
tidak lagi terbaca sebagai bahan di sebelah produk melainkan bersaing dengan
produknya. Tumpang tindihnya ikut mengecil bersama propnya — 48 px tetap di
alpukat, tapi pada biskuit 110 px itu akan menutup separuhnya.

## Yang harus dijaga di `photo.py`

Setiap poin di bawah ini pernah merusak hasil.

- **Estimasi latar dikalibrasi ke putih sweep di sekeliling subjek.** Frame hasil
  generate ber-vignette — sweep di belakang gelas ~240 sementara tepi frame 213 —
  jadi pembagian per piksel meledakkan kaca abu 186 menjadi 250 dan highlight
  mentok putih.

- **Bayangan dipisahkan lewat sifat fisiknya, bukan lewat kekuatan tepi.**
  Segmentasi berbasis tepi gagal di dua arah sekaligus. Minuman yang gradasinya
  halus — pita krim pada frappe, bagian atas charcoal yang menyusu — tidak punya
  gradien, jadi garis luarnya putus dan langkah "ambil komponen terbesar"
  membuang separuh gelasnya; itu yang tercetak sebagai pita mendatar, "gelasnya
  cacat" pada Frappe Base. Sebaliknya bayangan yang menjulur ke samping *punya*
  tepi, jadi ikut terbawa sebagai subjek lalu dikembangkan di atas bone white —
  itu goresan putih yang melintang di bawah packaging Matcha Latte. Sekarang
  yang diuji adalah definisi bayangan itu sendiri: netral, halus, dan hanya
  menggelapkan sweep.

- **Bayangan dan minuman dibedakan lewat topologi, bukan lewat tingkat terang.**
  Ini yang paling banyak memakan waktu. Bayangan studio yang keras punya batas
  tajam, jadi uji tepi per piksel menyebut batas itu objek; batasnya menutup jadi
  gelang, `fill_holes` mengisi bayangan di dalamnya, dan seluruhnya terkomposit
  sebagai lempeng bone white melintang di atas pouch. Tapi ambang apa pun cuma
  menukar satu kegagalan dengan kegagalan lain: minuman susu dan bayangan lembut
  duduk di tingkat terang dan chroma yang sama persis. Yang benar-benar
  membedakan adalah letaknya — bayangan tergeletak di sweep terbuka, bisa dicapai
  dari tepi frame tanpa melewati apa pun, sedangkan minuman terkurung di dalam
  dinding gelasnya. Jadi detail dan warna hanya dipakai untuk menggambar dinding
  itu, lalu banjir dari tepi frame yang memutuskan tiap piksel ada di sisi mana.

- **Bayangannya lalu ditumbuhkan kembali menembus tepinya sendiri.** Banjir tadi
  berhenti di batas bayangan, yang punya detail sehingga terhitung dinding —
  menyisakan gelang bayangan setebal ±20 px yang tercetak sebagai palang pucat di
  atas pouch. Pertumbuhannya menembus tinta netral, karena bayangan tidak berwarna
  di mana pun termasuk di tepinya, sementara minuman yang menghentikannya
  berwarna. **Pertumbuhannya dibatasi 25 langkah:** dibiarkan bebas, minuman yang
  gelap sekaligus netral akan ditelan seluruhnya — gelas charcoal sempat terukur
  selebar 151 px alih-alih 370 px. Kalaupun pertumbuhannya naik sedikit ke dinding
  gelas bening, itu bukan kerugian: kaca bening memang seharusnya menampilkan apa
  yang ada di belakangnya, dan itu persis yang terjadi begitu ia keluar dari mask
  subjek.

- **Bagian dalam siluet digerbangi oleh tinta.** Penutupan vertikal yang
  membangun ulang badan gelas juga menjembatani celah yang isinya tidak ada
  apa-apa; apa pun yang dibuat pekat di situ tercetak sebagai lempeng rata bone
  white di sebelah pouch.

- **Dua mask, bukan satu.** `obj` menentukan di mana subjek *menggantikan* pouch,
  jadi dibuat konservatif: terlalu murah hati berarti bone white tercetak di atas
  kemasan hitam. `sil` dipakai untuk mengukur gelas, jadi dibuat murah hati:
  harus mencakup bibir dan kaki gelas yang bening.

- **Kiri-kanan gelas diukur dari tinggi tiap kolom, bukan dari baris terlebar.**
  Kaustik itu cuma setinggi beberapa piksel tapi menjulur jauh, dan pernah
  membuat satu gelas terbaca selebar 588 px padahal aslinya 370 px.

- **Yang boleh tercetak hanya subjek dan bayangannya.** Dulu syaratnya piksel apa
  pun yang menyimpang 1,8% dari latar, dan itu ikut meloloskan kesalahan
  estimasinya sendiri. Sekarang bayangannya sudah dikenali atas dasarnya sendiri,
  jadi ambang longgar itu tidak diperlukan lagi untuk menangkapnya.

- **Di luar subjek, gelap beberapa persen bukan bayangan.** Itu yang meleset dari
  estimasi latarnya. Alpukat difoto di atas sweep abu-abu yang tidak sepenuhnya
  bisa diikuti estimasinya, dan sisa 4%-nya tercetak sebagai persegi lembut di
  sekeliling gelas, lengkap dengan tepi lurus yang kelihatan. Bayangan kontak
  sungguhan turun 20–50%, jadi lutut di `FLOOR`/`SPAN` ini cuma mengurangi sedikit
  kelembutan penumbra dan tidak lebih.

- **Lapisan hanya boleh mencetak di dekat subjek.** Bayangan menempel pada
  bendanya; sisa vignette di sudut frame tidak. Sisa itu sempat terbawa ke slide
  dan menggelapkan sub-line sebesar 6%. Sekarang lapisannya diredam sepanjang
  seperempat frame dari siluet.

- **Lapisan ditahan hanya di tempat ia benar-benar berpengaruh.** Persegi yang
  ditempel jauh lebih besar daripada minumannya, dan turun ke resolusi sumber
  lalu naik lagi berarti kanvasnya melewati dua kali Lanczos — yang berdering. Di
  atas sub-line itu mencetak sebaris piksel sembilan level lebih *terang* dari
  latar, menempel seperti halo di atas angkanya. Di mana pun rasionya tepat 1,
  lapisannya tidak punya apa-apa untuk ditambahkan, jadi kanvasnya dibiarkan utuh.

- **Subjek di-alpha-composite, bukan dikalikan.** Layer rasio itu perkalian; di
  atas pouch hitam alpukat ikut menggelap sampai terbaca seperti di belakang
  pouch. Perkalian tetap dipakai di luar subjek, karena bayangan memang butuh itu.

- **Tidak ada lagi rasio gelas tetap.** Dulu setiap produk memakai gelas yang
  sama, jadi siluet yang proporsinya meleset bisa dibangun ulang dari rasio yang
  diketahui. Sekarang tiap minuman memakai gelasnya sendiri, jadi pengukurannya
  harus berdiri sendiri — dan itu bisa, karena siluetnya tidak lagi mengandung
  bayangan.

## Pemeriksaan tiap slide

`verify.frame()` — memeriksa foto sumbernya *sebelum* dikomposit. Di luar subjek
dan bayangannya seharusnya cuma ada sweep kosong, jadi tidak boleh ada detail
apa pun di sana. Yang tercetak di situ pasti disalin modelnya dari referensi:
tepi meja, garis horizon, atau watermark stock yang ditiru huruf demi huruf.
Diukur sebagai kontras lokal, yang tidak dimiliki gradasi pencahayaan. Melacak
hal semacam ini dari slide jadi jauh lebih sulit daripada dari asetnya.

`verify.py` — ukuran 1024 × 1024; keempat tepi persis bone white (2 px ke dalam
diberi toleransi 2 level, karena bayangan lembut memang sampai situ); kotak logo
(362, 52, 662, 88); posisi katakana, headline, dan sub-line; **logo Halal wajib
ada** — dideteksi lewat warna ungunya, bukan sembarang tinta, karena bayangan
gelas masuk ke sudut itu; dan deteksi bercak putih pecah yang dulu ditimbulkan
frame ber-vignette.

`render_one.layers_intact()` — pouch digambar sebelum foto apa pun, jadi render
bersihnya adalah acuan persis tentang seperti apa slide itu seharusnya di
bawahnya. Menilai gambar jadinya sendirian tidak bisa memisahkan cacat dari
artwork kemasan; menilai selisihnya bisa.

Dua hal yang dicari. Di atas pouch, lapisan foto hanya boleh *menggelapkan*
(itulah bayangan); ia hanya boleh menerangkan di kolom sempit tempat gelas dan
prop memang berdiri di depan — pemeriksaan inilah yang menangkap goresan putih
Matcha Latte, yang lolos dari semua pemeriksaan lain karena warnanya bukan putih
murni. Lalu, tidak ada yang ditambahkan lapisan boleh mentok jadi putih murni.
Wordmark di pouch memang putih murni dan sah, jadi yang dihitung hanya putih
yang *ditambahkan* lapisannya.

12 dari 12 lolos.
