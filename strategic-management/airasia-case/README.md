# AirAsia Case Deck (Strategic Management MAN 5422)

Kelompok 3: Aslih Abnuri, Tifani Puspita, Happy Dinithasari, Dara Astrini Rahayu K.

Deliverables:
- `SMJKT_Group 3_Aslih_Case AirAsia.pptx` (20 slide, tata letak Bauhaus mengikuti referensi, font Poppins)
- `SMJKT_Group 3_Aslih_Case AirAsia.pdf` (versi PDF, font sudah tertanam)

Sebelum membuka PPTX, pasang font Poppins dari folder `fonts/` agar tampilan sama dengan PDF.

Cara build ulang:

```
npm install pptxgenjs
node build_deck.js "SMJKT_Group 3_Aslih_Case AirAsia.pptx"
python3 fix_bullets.py "SMJKT_Group 3_Aslih_Case AirAsia.pptx"
soffice --headless --convert-to pdf "SMJKT_Group 3_Aslih_Case AirAsia.pptx"
```

Skala tipografi seragam: `TITLE` 24, `SUB` 12, `BODY` 14, `NUM` 40, `HERO` 60 di `build_deck.js`. Foto dipotong ke rasio kotak oleh `crop.py` saat build (folder `img/crops` dibuat otomatis) sehingga tidak pernah diregangkan.

Gambar di `img/` dibuat lewat kie.ai (`gen_aa.py`, `gen_one.py`) lalu dikonversi hitam putih. Skrip membaca kunci API dari variabel lingkungan `KIE_KEY`; jangan menaruh kunci di dalam repo.

Naskah presentasi per presenter: `SMJKT_Group 3_Naskah Presentasi AirAsia.pdf` (A4), sumber `naskah_presentasi.html`.
Versi naratif satu cerita: `SMJKT_Group 3_Naskah Cerita Presentasi AirAsia.pdf` (A4), sumber `naskah_cerita.html`.
Lampiran konversi RM dan US$ ke rupiah (waktu itu dan nilai 2026): `SMJKT_Group 3_Lampiran Konversi Rupiah.pdf`, sumber `lampiran_konversi.html`.
Antisipasi tanya jawab (26 pertanyaan, jawaban, sumber): `SMJKT_Group 3_Antisipasi Tanya Jawab AirAsia.pdf`, sumber `antisipasi_tanya_jawab.html`.
Tanya jawab dengan sudut pandang dosen (12 pertanyaan, jawaban sederhana dan lengkap): `SMJKT_Group 3_Tanya Jawab Sudut Pandang Dosen.pdf`, sumber `tanya_jawab_sudut_pandang_dosen.html`.
