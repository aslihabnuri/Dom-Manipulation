# Strategic Management — Chapter 4 & Manchester United

Deck presentasi 32 slide (16:9) untuk mata kuliah Strategic Management.

- **Materi:** Chapter 4 — *Evaluating a Company's Resources, Capabilities, and
  Competitiveness*, dari Thompson, Peteraf, Gamble & Strickland,
  *Crafting & Executing Strategy*, **2024 Release ISE**.
- **Studi kasus:** *Manchester United: Preparing for Life without Ferguson*,
  Robert M. Grant (2010). Setting kasus: Juli 2009. Kasus ini **bukan** dari
  buku Thompson; yang dipakai dari Thompson adalah kerangkanya.
- **Dosen pengampu:** Dr. Rangga Almahendra, S.T., M.M.
- **Kelompok 4:** Fitra Aidila · Aulia Sisca Rahmadiyanti · Bagaskoro ·
  Imam Prayudha · Tegar Awanto

## Output

`Kelompok 4 - Strategic Management - Chapter 4 & Manchester United.pptx`

Setiap slide punya **catatan presenter** (Notes Page di PowerPoint, ±4.400
kata total). Teks di slide sengaja dibuat pendek supaya terbaca sekilas oleh
audiens; penjelasan lengkapnya ada di catatan, termasuk kutipan buku, contoh
tambahan, dan jawaban untuk pertanyaan yang kemungkinan muncul.

## Struktur: enam pertanyaan, bukan lima

Edisi 2024 menyusun Chapter 4 sebagai **enam** pertanyaan berurutan. Edisi
lama memakai lima, dengan SWOT diselipkan ke dalam analisis resource. Deck ini
mengikuti edisi 2024.

| Q | Pertanyaan | Alat | Slide teori | Slide kasus |
|---|---|---|---|---|
| 1 | Seberapa baik strategi sekarang bekerja? | Indikator kinerja, Tabel 4.1 | 4–5 | 21–23 |
| 2 | Apa kekuatan & kelemahan vs peluang & ancaman? | SWOT, tangga competence | 6–8 | 24 |
| 3 | Resource & capability apa yang penting dan tahan lama? | Tabel 4.3, VRIN, dynamic capability | 9–12 | 25–28 |
| 4 | Bagaimana rantai nilai memengaruhi biaya & nilai? | Figure 4.3/4.4, benchmarking | 13–15 | 29 |
| 5 | Lebih kuat atau lebih lemah dari pesaing? | Matriks tertimbang, Tabel 4.4 | 16 | 30 |
| 6 | Isu apa yang ditangani lebih dulu? | Priority list | 17 | 31 |

Slide 1–3 pembuka dan peta, 18 ringkasan Bagian A, 19–20 profil kasus dan
industrinya, 32 penutup.

## Sumber angka

Angka Bagian B berasal dari kasus Grant (Tabel 6.1–6.8 dan Appendix laporan
keuangan Manchester United 2000–2008), kecuali dua hal yang **dinyatakan pada
slidenya sendiri**:

- **Slide 23** — perbandingan prestasi terhadap belanja transfer bersih adalah
  analisis turunan kelompok dari Tabel 6.7, bukan angka yang tercetak di kasus.
- **Slide 30** — bobot dan rating matriks disusun kelompok berdasarkan Tabel
  6.2, 6.3, 6.5, 6.6 dan 6.7. Nilainya judgment, sebagaimana Tabel 4.4 di buku
  juga memakai contoh hipotetis.

## Membangun ulang

```bash
pip install python-pptx
python3 build.py          # menulis file .pptx
python3 check_layout.py   # verifikasi layout, harus melaporkan 0 issue
```

`check_layout.py` memeriksa tujuh hal: shape yang melewati area aman, shape
yang keluar batas kanan, lebar shape tidak valid, teks yang tidak muat pada
kotaknya, teks yang tertutup shape yang digambar belakangan, tabrakan antar
teks, dan kotak berwarna yang tertimpa sebagian oleh kotak berikutnya.
Jalankan setiap kali isi slide diubah — PowerPoint tidak memotong teks yang
kepanjangan dan tidak memperingatkan saat elemen bertumpuk.

## File

| File | Isi |
|---|---|
| `deck_lib.py` | Token desain (warna, font, grid), helper slide, helper catatan presenter |
| `part_a.py` | Slide 1–18 — kerangka Chapter 4 |
| `part_b.py` | Slide 19–32 — penerapan ke kasus |
| `build.py` | Merangkai dan menyimpan file .pptx |
| `check_layout.py` | Pemeriksa layout |
