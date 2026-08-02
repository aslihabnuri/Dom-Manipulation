# Filter "Clean & Warm" untuk Instagram

Grading untuk 3 foto trip (hiking, curug, hutan bambu) supaya konsisten
sebagai satu carousel.

## Cara pakai

```bash
pip install numpy pillow
python3 tools/warm_clean_filter.py
```

Hasil masuk ke `instagram/edited/`, dua look untuk tiap foto:

| File | Keterangan |
| --- | --- |
| `*-warm.jpg` | hangat, kontras normal |
| `*-clean.jpg` | lebih terang, warna lebih kalem |
| `*-nomukita.jpg` | dicocokkan ke banner brand Nomukita |
| `*-…-4x5.jpg` | 1080×1350, rasio potret terbesar yang diizinkan Instagram |

Untuk foto lain: taruh di `instagram/original/`, lalu daftarkan di
`SOURCES` pada `tools/warm_clean_filter.py` beserta resep yang dipakai.

## Dua look

`warm` memakai `BASE` apa adanya. `clean` menimpanya lewat `as_clean()`:
sebagian nilai diganti mutlak (`CLEAN_LOOK`) supaya karakternya seragam di
ketiga foto, sebagian lagi ditambahkan sebagai delta (`CLEAN_DELTAS`) supaya
perbedaan exposure antar foto tetap terjaga.

Bedanya: `clean` lebih terang, saturasi lebih rendah, kontras dan clarity
lebih lembut, dan hijaunya ditekan lebih jauh sehingga palet ketiga foto
menyatu jadi satu nada.

Yang sengaja **tidak** dilakukan di look `clean`: menaikkan black lift dan
menurunkan white point. Matte tebal memang terasa lembut, tapi terbacanya
"pudar", bukan "clean" — clean justru butuh putih yang benar-benar putih.
Kesan lapangnya diambil dari exposure dan dehaze, bukan dari kabut.

## Look `nomukita`

Dibaca langsung dari banner brand di Drive (Brand Story, Product Value,
Banner Juli), bukan dari tebakan. Yang menentukan:

- kontras kuat dengan hitam pekat — `black_lift` nol, `blacks` negatif
- langit biru tua dan tegas
- hijau ditarik ke sage, kuning ditahan supaya tidak neon
- basis warnanya **netral**, bukan hangat; krem brand-nya hanya muncul di
  highlight lewat split toning, dan shadow justru condong dingin
- clarity dan sharpening lebih tinggi — banner-nya renyah, bukan lembut

Dua penyetelan yang tidak terlihat jelas dari nilainya:

Pusat band aqua digeser dari 175 ke 168. Rentang langit foto ini ada di
sekitar 200–210, cukup dekat ke 175 sehingga penurunan saturasi aqua ikut
kena langit dan melawan penguatan biru — langitnya tetap pucat meski biru
sudah dinaikkan.

Penguatan biru sekuat langit membuat bagian gelap air terjun ikut kebiruan,
jadi nilai default ditahan sedang dan hanya foto hiking yang menimpanya
lewat `nomukita_bands`.

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
