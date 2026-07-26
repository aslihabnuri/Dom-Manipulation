# Gelas berisi minuman + prop bahan — slide 1, varian 1000 gram

Slide 1000 gram terbaca terlalu polos kalau hanya berisi pouch. Susunannya
mengikuti `Refrensi/Referensi Matchamu`: pouch di kiri, gelas berisi minuman di
kanan agak turun dan sedikit di depan pouch, prop bahan di kiri bawah.

## Cara produksi

Gambar minuman dan prop **digenerate lewat kie.ai** (`runjob.py`), sesuai design
system pasal 7. Mengisi gelas secara programatik sudah dicoba dan dibuang —
optiknya benar tapi cairan yang dilukis kode tidak punya tekstur buih, partikel,
maupun pantulan ke dinding kaca, jadi tidak pernah terbaca sebagai foto.

Yang dipakai:

- Model **`google/nano-banana-edit`** (image-to-image). Bukan text-to-image:
  acuan gelas dikirim tiap kali supaya 12 produk memakai gelas yang sama persis.
  Kalau digenerate dari teks, 12 gelasnya beda bentuk dan carousel-nya pecah.
- Referensi diunggah dulu ke `https://kieai.redpandaai.co/api/file-base64-upload`,
  karena API hanya menerima URL publik — link Google Drive tidak bisa dipakai.
- Alur: `POST /api/v1/jobs/createTask` → polling `/api/v1/jobs/recordInfo` →
  unduh `resultUrls`. Sekitar **4 kredit per gambar**. Unduhannya wajib lewat
  curl; urllib kena 403 di proxy.

Butuh `KIE_API_KEY`. Simpan sebagai environment variable, jangan ditulis di file
repo.

## Keying

Hasil generate datang di atas sweep putih, bukan latar transparan. Memotongnya
dengan alpha matte akan membuang bayangan dan membuat kaca jadi buram.

`photo.py` memakai pendekatan yang sama seperti pengisian gelas dulu: foto dibagi
estimasi sweep tempat ia difoto, lalu rasionya dikalikan ke slide. Piksel buram
membawa warnanya sendiri, kaca tetap tembus pandang, dan bayangannya menggelapkan
background asli alih-alih duduk di atas kotak pucat.

Tiga hal yang menentukan keberhasilannya:

- Yang dikosongkan untuk estimasi latar adalah **subjeknya**, bukan bounding
  box-nya. Gelas tinggi memenuhi frame, jadi memblokir kotaknya membuat estimasi
  kehabisan piksel dan hasilnya jadi kotak putih polos.
- Subjek dipisahkan dari bayangannya lewat **ketajaman tepi**, bukan kecerahan.
  Bibir gelas, garis cairan, dan siluet buah bertepi tajam; bayangan di sweep
  landai. Pakai ambang kecerahan, bayangan ikut terhitung sebagai subjek dan
  lebarnya melar sampai tepi frame.
- Di luar subjek, layer hanya boleh menggelapkan. Kalau boleh menerangkan, galat
  estimasi latar tercetak sebagai bercak terang.

## Ukuran di slide (kanvas 1024 × 1024)

Proporsi dari referensi Matchamu, dinaikkan sesuai revisi:

| elemen | tinggi | dasar |
|---|---|---|
| pouch 1000 gram | 440 | y 829 |
| gelas | 330 | y 855 |
| prop bahan | 200 | y 855 |

Ketiganya dihitung sebagai satu grup lalu dipusatkan bersama di x 512.

## Prompt

Awalan untuk semua gelas, dikirim bersama `Referensi_Gelas.jpeg`:

> Fill this exact glass with —. Keep the glass shape, proportions and camera
> angle identical to the reference. The glass stands upright and fills most of
> the frame. Pure white seamless background, soft studio light from upper left,
> soft contact shadow at the base, product photography, eye level, sharp focus,
> no text, no logo, no straw, no garnish.

Pakai `image_size: 3:4` untuk gelas dan `4:3` untuk prop.

| produk | isi gelas | prop bahan |
|---|---|---|
| Matcha Latte | iced matcha latte berlapis, susu di bawah, matcha pekat di atas | bubuk matcha + chasen *(ada referensi)* |
| Premix Matcha | matcha murni hijau pekat, buih halus | bubuk matcha menggunung *(ada referensi)* |
| Teh Tarik | teh tarik cokelat susu, buih tebal khas tarikan | **belum ada referensi** |
| Chocolate Signature | cokelat kental gelap, buih tipis | potongan cokelat + biji kakao *(ada referensi)* |
| Cookies & Cream | milkshake krem, remah biskuit, whipped cream | biskuit isi krim *(ada referensi)* |
| Charcoal | charcoal latte abu gelap bergradasi ke susu | bubuk charcoal *(ada referensi)* |
| Avocado | jus alpukat cokelat — **sudah jadi** | alpukat utuh + belah — **sudah jadi** |
| Vanilla | vanilla latte krem pucat, buih halus | batang + bunga vanilla *(ada referensi)* |
| Milk Tea | milk tea cokelat susu, warna rata | **belum ada referensi** |
| Lemon Tea | iced lemon tea keemasan, es batu, irisan lemon | irisan lemon *(ada referensi)* |
| Frappe Base | frappe blender krem, whipped cream tebal | **belum ada referensi** |
| Lemon Grass | minuman serai kuning kehijauan bening | batang serai *(ada referensi)* |

Slide 250 gram dan kombinasi tidak ikut berubah — keduanya sudah penuh.
