# Strategic Management — Chapter 4 & Manchester United

Deck presentasi 32 slide (16:9) untuk mata kuliah Strategic Management.

- **Materi:** Chapter 4 — *Evaluating a Company's Resources and Competitive Position*
  (Thompson, Peteraf, Gamble & Strickland, *Crafting & Executing Strategy*)
- **Studi kasus:** *Manchester United: Preparing for Life without Ferguson*,
  Robert M. Grant (2010). Setting kasus: Juli 2009.
- **Dosen pengampu:** Dr. Rangga Almahendra, S.T., M.M.
- **Kelompok 4:** Fitra Aidila · Aulia Sisca Rahmadiyanti · Bagaskoro ·
  Imam Prayudha · Tegar Awanto

## Output

`Kelompok 4 - Strategic Management - Chapter 4 & Manchester United.pptx`

## Struktur

| Slide | Isi |
|---|---|
| 1–2 | Cover, agenda |
| 3–15 | Bagian A: kerangka Chapter 4 (lima pertanyaan, VRIN, dynamic capabilities, SWOT, value chain, weighted competitive strength assessment, worry list) |
| 16–31 | Bagian B: penerapan ke kasus Manchester United, mengikuti urutan kelima pertanyaan |
| 32 | Penutup |

## Sumber angka

Seluruh angka pada Bagian B berasal dari kasus Grant (Tabel 6.1–6.8 dan
Appendix laporan keuangan Manchester United 2000–2008), kecuali:

- **Slide 20** — rasio poin performa terhadap belanja transfer bersih adalah
  analisis turunan kelompok dari Tabel 6.7, bukan angka yang tercetak di kasus.
- **Slide 29** — bobot dan rating pada matriks kekuatan kompetitif disusun
  kelompok berdasarkan Tabel 6.2, 6.3, 6.5, 6.6 dan 6.7. Nilainya judgment,
  dan slide menyatakan hal itu secara eksplisit.
- **Slide 31** — epilog 2013–2024 berada di luar cakupan kasus dan diberi label
  demikian pada slide.

## Membangun ulang

```bash
pip install python-pptx
python3 build.py          # menulis file .pptx
python3 check_layout.py   # verifikasi layout, harus melaporkan 0 issue
```

`check_layout.py` memeriksa enam hal: shape yang melewati area aman, shape yang
keluar batas kanan, lebar shape yang tidak valid, teks yang tidak muat pada
kotaknya, teks yang tertutup shape yang digambar belakangan, dan tabrakan antar
teks. Jalankan setiap kali isi slide diubah — kotak teks di PowerPoint tidak
memotong isinya, jadi teks yang kepanjangan akan meluber tanpa peringatan.

## File

| File | Isi |
|---|---|
| `deck_lib.py` | Token desain (warna, font, grid) dan helper slide |
| `part_a.py` | Slide 1–15 |
| `part_b.py` | Slide 16–32 |
| `build.py` | Merangkai dan menyimpan file .pptx |
| `check_layout.py` | Pemeriksa layout |
