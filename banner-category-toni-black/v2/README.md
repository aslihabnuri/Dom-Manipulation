# Toni Black category banner v2 (2000x2000)

Boy seated on a white block (left), father seated on the floor leaning on the block (right), light-grey cyclorama, after "Referensi Kategori.jpeg"; the two people from the Him and Him banner. Father: black Toni Black boxer brief (`6a.png`) and white singlet. Son: white singlet and the black Toni Black kids boxer brief (`Boxer anak/2.png`, black). Set by one edit pass on the first photo (`prompts/prompt_cat2c.txt`). Colour: the same global grade as the Him and Him banner (the file the owner pointed to as the filter reference).

**Product note.** The brief asked for the grey kids brief (`Brief anak/6.png`). The image provider rejected that prompt as not allowed (a child in briefs) and no credits were charged; the same request with the grey kids boxer brief was accepted (`prompts/prompt_cat2b.txt`). The father's brief is the exact product.

## Layout (`scripts/compose_cat2.py`)
Photo at 94% width, bottom-aligned, the wall extended at the top and sides; figures fill 78% of the width and 75% of the height (the pair is nearly square, so 85% width and 65% height cannot both hold). Header band at the top: `KIDS` over two outlined capsules `BRIEF` `BOXER` top-left; logo (`#282828`, no box) centred; `MEN` over three capsules `BRIEF` `BOXER` `SINGLET` top-right. Labels Zalando Sans Expanded Bold 64, centred over their rows; capsules Zalando SemiBold 28, 3 px `#282828` outline, no fill, equal width (201 px) and gap (24 px), separate click areas. Margins 120 px (6%). Every glyph keeps 40 px from the figures (checked against the cutout); the boy's head is 168 px below the band. JPG 0.52 MB.

### Revision: singlet match and two-tier header
- The boy's singlet was slightly brighter and cooler than the father's (Lab L 82.5 vs 81.1, b -4.4 vs -5.4). Its pixels were matched to the father's singlet mean and spread in Lab, feathered (`final/photo_generated_singlet-matched.jpg`); no credits.
- Nothing sits level with the logo any more: tier one is the logo alone at the top centre; tier two, 72 px below it, holds `KIDS` + capsules on the left and `MEN` + capsules on the right. The gap between tiers (72) is larger than the gap inside each block (28), so the brand reads first and the navigation second. Photo at 92% width so the boy's head stays 120+ px below the capsules.

## Revisi: posisi copy KIDS / MEN

- Logo tidak dipindah (tetap sendirian di tengah atas, y 48).
- Blok KIDS (label + kapsul BRIEF, BOXER) diletakkan tepat di atas kepala anak, rata kiri margin.
- Blok MEN (label + kapsul BRIEF, BOXER, SINGLET) diletakkan tepat di atas kepala ayah, rata kanan margin.
- Kedua blok duduk 64 px di atas kepala masing-masing (diukur dari cutout), jadi tidak ada teks yang sejajar dengan logo dan tidak ada teks di baris atas.
- Foto diskalakan 0.88 agar ada ruang untuk blok KIDS di atas anak; 0 piksel teks dalam jarak 40 px dari figur.

## Ukuran Banner Category asli: 1200x990 (retina 2400x1980)

- `TONI-BLACK_Category-Banner_1200x990.jpg` (upload) dan `TONI-BLACK_Category-Banner_2400x1980.jpg` (retina), skrip `scripts/compose_cat2w.py`.
- Foto persegi diskalakan 0.89 tinggi kanvas dan duduk di lantai; dinding kiri/kanan diperpanjang per baris dengan warna tepi foto dan feather 220 px, jadi tanpa sambungan.
- Logo sendirian di tengah atas. KIDS + kapsul berpusat di atas kepala anak; MEN + kapsul rata margin kanan di atas kepala ayah. Nol piksel teks dalam 40 px dari figur.
