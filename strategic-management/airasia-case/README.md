# AirAsia Case Deck (Strategic Management MAN 5422)

Kelompok 3: Tifani Puspita, Dara Astrini Rahayu K, Happy Dinithasari, Aslih Abnuri.

Deliverables:
- `SMJKT_Group 3_Aslih_Case AirAsia.pptx` (20 slide, gaya Bauhaus, judul Bebas Neue, isi Manrope)
- `SMJKT_Group 3_Aslih_Case AirAsia.pdf` (versi PDF, font sudah tertanam)

Sebelum membuka PPTX, pasang font di folder `fonts/` (Bebas Neue dan Manrope) agar tampilan sama dengan PDF.

Cara build ulang:

```
npm install pptxgenjs
node build_deck.js "SMJKT_Group 3_Aslih_Case AirAsia.pptx"
python3 fix_bullets.py "SMJKT_Group 3_Aslih_Case AirAsia.pptx"
soffice --headless --convert-to pdf "SMJKT_Group 3_Aslih_Case AirAsia.pptx"
```

Ukuran font isi diatur lewat satu konstanta `BODY` di `build_deck.js`.

Gambar di `img/` dibuat lewat kie.ai (`gen_aa.py`, `gen_bw.py`). Skrip membaca kunci API dari variabel lingkungan `KIE_KEY`; jangan menaruh kunci di dalam repo.
