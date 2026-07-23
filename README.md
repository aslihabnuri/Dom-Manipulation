# LARISIN · Generator Listing Shopee & TikTok Shop

Mesin (100% berjalan di browser, tanpa server) untuk merakit tiga bahan utama listing produk:

1. **Nama produk** — 5 variasi untuk Shopee dan 3 untuk TikTok Shop, dirangkai dengan formula SEO: keyword utama (jenis produk) di awal judul, lalu kata-kata yang paling banyak dicari pembeli di industri kamu (bank keyword tersedia untuk 10 industri). Ada penghitung karakter dengan zona ideal per platform.
2. **Deskripsi produk** — struktur hook → bullet keunggulan → spesifikasi → cara order → paragraf keyword → hashtag, dengan versi berbeda untuk Shopee dan TikTok Shop.
3. **Prompt gambar untuk ChatGPT** — 3 prompt (thumbnail katalog, lifestyle, banner promo) dalam bahasa Inggris yang sudah menanam warna, tone, dan brand guideline kamu. Banner promo dilengkapi **copy text** siap render (headline, subheadline, badge promo, CTA).

## Cara pakai

1. Buka `index.html` di browser (klik dua kali saja).
2. Isi identitas brand: nama, industri, tone, warna, target audiens, keunggulan (USP), dan tempel brand guideline tambahan bila ada.
3. Isi data produk, lalu klik **Generate**.
4. Salin hasil dengan tombol **SALIN** di tiap kartu. Tombol **Racik Ulang** mengacak variasi baru tanpa mengubah isian.
5. Untuk gambar: tempel prompt ke ChatGPT, minta rasio 1:1 untuk thumbnail. Kalau teks pada banner typo, minta ChatGPT "perbaiki teksnya, tulis persis seperti ini".

Isian form tersimpan otomatis di browser (localStorage), jadi tidak hilang saat halaman ditutup.

## Berkas

- `index.html` — struktur halaman & form
- `style.css` — tampilan (tema "poster pasar digital")
- `script.js` — mesin generator: bank keyword per industri, formula judul, template deskripsi, dan pembangkit prompt gambar
