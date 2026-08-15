# BEfS Study Hub

Aplikasi belajar untuk mata kuliah **Business Ethics for Sustainability (MAN5522)** —
Master of Business Administration, Fakultas Ekonomika dan Bisnis, Universitas Gadjah Mada.

Aplikasi web statis tanpa dependensi: HTML, CSS, dan JavaScript murni. Seluruh progres belajar
disimpan di `localStorage` peramban, jadi tidak ada server, akun, maupun data yang dikirim ke mana pun.

## Isi

| Halaman | Isi |
|---|---|
| **Dashboard** | Ringkasan mata kuliah, course objectives, bobot penilaian, referensi, dan progres belajar. |
| **Silabus** | 14 sesi sesuai *Weekly Learning Activity Plan* pada RPKPS, penanda sesi selesai, skala nilai, aturan integritas akademik. Isi tanggal sesi pertama dan jadwal 14 minggu dihitung otomatis. |
| **Materi** | **Panduan slide dosen** lebih dulu (untuk bab yang tersedia), lalu rangkuman 12 bab (CM1–CM12) dalam Bahasa Indonesia dengan istilah kunci Bahasa Inggris, 58 bagian, 35 diagram, kotak "Fokus ujian", dan kasus nyata di tiap bab. |
| **Flashcards** | 127 kartu tanya-jawab, dapat disaring per bab, dengan penanda penguasaan dan pintasan keyboard. |
| **Kuis** | 97 soal pilihan ganda beserta penjelasan. Mode per bab, simulasi **mid-term** (CM1–CM6), dan simulasi **final** (CM7–CM12). |
| **Kasus** | Dua bagian. **Penganalisis** dilema etis lima langkah: rumusan dilema → peta stakeholder → lima lensa teori → penilaian → alternatif solusi, bisa menyimpan beberapa kasus dan menyalin ringkasannya sebagai teks. **Pustaka kasus** berisi 26 kasus nyata yang diliput media — dua per bab (satu internasional, satu Indonesia), plus dua kasus resmi buku pada CM1 dan CM2. |
| **Glosarium** | 126 istilah kunci yang dapat dicari dalam Bahasa Inggris maupun Indonesia. |
| **Catatan** | Catatan per sesi yang tersimpan otomatis, plus daftar sorotan yang kamu buat di halaman materi. |

Di halaman **Materi**, seleksi kalimat mana pun lalu klik **✎ Tandai** untuk menyorotinya dan
menambahkan catatan. Sorotan bertahan setelah halaman dimuat ulang dan muncul di halaman Catatan.

## Panduan kuliah (slide dosen)

Berkas PPT dari dosen di folder Drive **Materi** menjadi **pedoman urutan pembelajaran**. Kode
di belakang nama berkas menandai pertemuannya — `(1)` pertemuan pertama, `(2)` pertemuan kedua.

Pada halaman Materi, bab yang punya slide menampilkan panduannya **lebih dulu**, baru diikuti
rangkuman buku. Tiap slide ditampilkan sebagai kartu berisi judul, butir isi, tabel atau alur bila
ada, prompt untuk kelas, dan **catatan penjelasan dosen** yang bisa dibuka-tutup. Di bawahnya ada
alur kelas yang disarankan, key takeaways, pertanyaan penutup, rujukan slide, dan ringkasan satu
kalimat.

| Pertemuan | Bab | Slide | Berkas |
|---|---|---|---|
| 1 | CM1 — Introducing Business Ethics | 11 kartu inti dari 15 slide | `Chapter_1_with_Explanatory_Notes (1).pptx` |
| 2 | CM2 — Framing Business Ethics | 15 kartu inti dari 18 slide | `Chapter_2_Slides_and_Explanatory_Notes (2).pptx` |

Bab yang sudah punya slide ditandai titik emas pada pemilih bab. Menambahkan pertemuan berikutnya
cukup dengan menambah satu entri di `assets/js/decks.js` — tidak perlu menyentuh logika aplikasi.

Slide dosen menyebut sumbernya sebagai **Crane, Matten, Glozer & Spence (2019), edisi ke-5**.
Silabus menyingkatnya menjadi "Crane & Matten"; daftar referensi di aplikasi kini memakai kutipan
lengkap empat penulis dengan catatan penjelas.

## Pustaka kasus

Setiap bab dilengkapi **dua kasus nyata** yang benar-benar terjadi dan diliput media — satu
internasional, satu Indonesia — sehingga siap dipakai untuk diskusi kelas dan presentasi kelompok.
CM1 dan CM2 juga memuat **kasus resmi buku** yang ditunjuk slide dosen (Global McEthics dan
American Apparel), sehingga totalnya 26 kasus. Tiap kasus memuat:

- **Apa yang terjadi** — fakta, angka, dan tanggal kunci
- **Kaitannya dengan bab** — konsep mana yang sedang diuji kasus ini
- **Tiga pertanyaan diskusi** yang bisa langsung dibawa ke kelas
- **Rujukan berita** ke media seperti BBC, Reuters, Financial Times, Tempo, Katadata, serta
  dokumen resmi (OJK, BPK, KPK, KPPU, EPA, CFPB, Serious Fraud Office)

Kasusnya mencakup Volkswagen Dieselgate, karhutla 2015, Nike, Freeport, Ford Pinto, vaksin palsu,
Wells Fargo, Jiwasraya, Enron, SNP Finance, Wirecard, laporan keuangan Garuda, Rana Plaza, ojek
online, Boeing 737 MAX, kebocoran data BPJS, suap Rolls-Royce, kartel minyak goreng,
Greenpeace–Nestlé, APP–Sinar Mas, pajak Apple di Irlandia, korupsi e-KTP, bias AI rekrutmen Amazon,
dan JETP.

Tombol **Analisis kasus ini** memuat kasus tersebut ke Penganalisis dengan judul, fakta, dan
pertanyaan diskusi yang sudah terisi — tinggal mengerjakan analisis teorinya.

Rujukan berita dibuat sebagai **tautan pencarian**, bukan tautan artikel langsung, agar tetap
berfungsi meski alamat artikel aslinya berubah. Angka dan tanggal adalah yang dilaporkan saat
kejadian — sebagian kasus masih berjalan di pengadilan, jadi cek berita terbaru sebelum presentasi.

## Menjalankan

Buka `index.html` langsung di peramban — tidak perlu proses build atau server.

Untuk menyajikannya lewat HTTP (misalnya agar bisa dibuka dari ponsel di jaringan yang sama):

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Versi satu berkas

`dist/befs-study-hub.html` adalah bundel mandiri berisi seluruh CSS dan JavaScript dalam satu
berkas — praktis untuk dibagikan lewat chat atau disimpan luring. Bangun ulang setelah mengubah
sumbernya:

```bash
python3 build.py
```

## Struktur

```
index.html                 kerangka halaman dan navigasi
build.py                   membundel semuanya menjadi dist/befs-study-hub.html
assets/css/app.css         sistem desain: palet, tipografi, komponen, diagram, responsif
assets/js/data.js          metadata mata kuliah + 14 sesi (dari RPKPS)
assets/js/chapters.js      materi CM1–CM12 (58 bagian)
assets/js/visuals.js       35 diagram SVG/CSS
assets/js/decks.js         panduan slide dosen per pertemuan
assets/js/cases.js         26 kasus nyata beserta rujukan beritanya
assets/js/study-cards.js   127 flashcard + 126 istilah glosarium
assets/js/study-quiz.js    97 soal pilihan ganda beserta pembahasan
assets/js/app.js           routing, penyimpanan, dan seluruh logika tampilan
```

Menambah atau menyunting materi cukup dilakukan di berkas data — tidak perlu menyentuh `app.js`.
Diagram disisipkan ke dalam teks lewat penanda `{{viz:namaDiagram}}` yang dipetakan ke fungsi di
`visuals.js`.

## Sumber

- **RPKPS** MAN5522 *Business Ethics for Sustainability*, MBA FEB UGM (disahkan 13 Juli 2023) —
  dasar untuk silabus, course objectives, bobot penilaian, skala nilai, dan rencana 14 sesi.
  Dosen pengampu: **Prof. Dr. Eko Suwardi, M.Sc.**
- **Slide kuliah** dari folder Drive *Materi* — pedoman urutan pembelajaran per pertemuan.
- **Bacaan utama:** Crane, A., Matten, D., Glozer, S. & Spence, L.J. (2019). *Business Ethics:
  Managing corporate citizenship and sustainability in the age of globalization*, 5th edn. Oxford:
  Oxford University Press — dasar untuk struktur dan isi materi CM1–CM12.
- Bacaan pendukung sesuai RPKPS: Ferrell dkk. (2022), Carroll & Brown (2022), Velasquez (2014),
  Laasch & Conaway (2016).

Seluruh rangkuman ditulis ulang dengan kata sendiri dan **seluruh diagram digambar ulang secara
orisinal** — tidak ada teks atau gambar yang disalin dari buku. Aplikasi ini alat belajar, bukan
pengganti membaca bacaan wajib.
