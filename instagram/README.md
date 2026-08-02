# Filter "Clean & Warm" untuk Instagram

Grading untuk 3 foto trip (hiking, curug, hutan bambu) supaya konsisten
sebagai satu carousel.

## Cara pakai

```bash
pip install numpy pillow
python3 tools/warm_clean_filter.py
```

Hasil masuk ke `instagram/edited/`:

| File | Keterangan |
| --- | --- |
| `*-warm.jpg` | full frame, resolusi asli |
| `*-warm-4x5.jpg` | 1080×1350, rasio potret terbesar yang diizinkan Instagram |

Untuk foto lain: taruh di `instagram/original/`, lalu daftarkan di
`SOURCES` pada `tools/warm_clean_filter.py` beserta resep yang dipakai.

## Isi grading-nya

Urutannya mengikuti alur Lightroom:

1. **Dehaze** — tarik black point untuk mengangkat kabut. Sebagian koreksi
   ditahan supaya tidak sekalian menetralkan warna aslinya.
2. **Exposure + white balance** — dikerjakan di ruang linear. `temp` positif
   menaikkan merah dan menurunkan biru.
3. **Shadow/highlight** — dipakai sebagai LUT per-channel. Menskalakan RGB
   dengan rasio luminance akan meledakkan chroma di piksel gelap: noise JPEG
   berubah jadi bintik biru dan merah. Kurva per-channel aman, dan efek
   sampingnya (shadow terangkat sedikit pudar) justru yang dicari.
4. **Tone curve** — kurva S lewat smoothstep, plus black lift tipis untuk
   kesan matte.
5. **HSL per warna** — bobot tiap band dinormalisasi jadi partition of unity
   supaya tidak dobel. Yang paling menentukan:
   - hijau diturunkan saturasinya dan digeser ke arah kuning; hijau hutan
     tropis di kamera HP cenderung neon dan itu yang bikin foto terlihat ramai
   - oranye (kulit) dinaikkan sedikit
   - biru langit dipekatkan tipis
6. **Split toning** — highlight ke amber, shadow ke biru netral.
7. **Clean shadows** — chroma di bagian tergelap dinetralkan. Ini sumber kesan
   "clean", sekaligus meredam noise warna.
8. **Vibrance** — hanya menaikkan warna yang masih pucat, dan digate oleh
   luminance supaya tidak menghidupkan noise di area gelap.
9. **Clarity + sharpening** — kontras lokal dibuat aditif, bukan rasio, dengan
   alasan yang sama seperti poin 3.

## Per foto

Semua berbagi `BASE`; yang beda cuma exposure, dehaze, dan sedikit HSL.

- **hiking** — dehaze paling ringan supaya langit tidak pudar, biru sedikit
  dipekatkan.
- **waterfall** — paling flat dan berkabut, jadi dehaze dan kontras paling
  tinggi; aqua diturunkan supaya airnya tidak kehijauan.
- **bamboo** — paling gelap, exposure dan shadow diangkat paling banyak, tapi
  ditahan supaya nuansa teduhnya tidak hilang.
