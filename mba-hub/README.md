# 🎓 MBA UGM Study Hub: Semester 2 (SEMBA 51-A)

Aplikasi belajar **4 mata kuliah sekaligus** dalam satu tempat. Dibangun terpisah dari
aplikasi OTM lama (`../index.html`) yang tetap utuh dan tidak tersentuh.

## Mata kuliah

| Kode | Mata kuliah | Dosen | Catatan |
|---|---|---|---|
| MAN 5322 | Operations & Technology Management | Prof. Nur Aini Masruroh | Materi Sesi 1 & 2 lengkap (dipindahkan dari aplikasi lama) |
| MAN 5522 | Business Ethics for Business Sustainability | Prof. Dr. Eko Suwardi | Silabus 12 sesi + Crane & Matten |
| MAN 6521 | General Business Environment | Prof. Dr. Sony Warsono (koordinator) | Kuliah blok 31 Agu hingga 3 Sep, tiap lingkungan dosen berbeda, tanpa buku teks tunggal |
| MAN 5422 | Strategic Management | Dr. Rangga Almahendra, S.T., M.M. | Silabus baru 2026, materi Sesi 1 & 2 lengkap, 3 studi kasus gaya Harvard |

## Struktur

```
mba-hub/
  index.html
  css/style.css
  js/schedule.js        : jadwal semester + tugas bawaan dari silabus
  js/courses/otm.js     : data & materi OTM
  js/courses/bes.js     : data BES
  js/courses/gbe.js     : data GBE
  js/courses/sm.js      : data, materi, dan studi kasus SM
  js/book/<mk>-s<N>.js  : Materi Buku per sesi (43 berkas), uraian lengkap bab buku gaya karya ilmiah
  js/cases/otm.js       : 11 teaching case OTM (Sesi 1 sampai 11)
  js/cases/bes.js       : 12 teaching case BES (Sesi 1 sampai 12)
  js/cases/gbe.js       :  9 teaching case GBE (Sesi 2 sampai 10)
  js/cases/sm.js        :  9 teaching case SM tambahan (Sesi 3 sampai 12)
  js/app.js             : router multi-mata-kuliah & seluruh view
  img/                  : capture slide dosen
```

Rute: `#/` = pemilih mata kuliah, `#/<kode>/<view>` = view per mata kuliah
(`dashboard`, `silabus`, `materi`, `kasus`, `jadwal`, `tugas`, `kelas`, `flashcards`, `kuis`, `catatan`).

## Fitur

- **Beranda**: kartu 4 mata kuliah dengan progres & kelas berikutnya, agenda 10 hari, tugas terdekat
- **Dashboard per mata kuliah**: infrastruktur identik untuk keempatnya
- **Jadwal**: jadwal resmi SEMBA 51-A per mata kuliah + tombol "+ Kalender" (Google Calendar)
- **Tugas**: tugas bawaan silabus + tugas tambahan sendiri, dengan badge tenggat
- **Catatan Kelas**: enam kolom terstruktur untuk merekam pembahasan dosen
- **Studi Kasus**: 44 teaching case bergaya Harvard, satu per bab untuk keempat mata kuliah, lengkap dengan narasi, exhibit data, pertanyaan diskusi yang jawabannya tersimpan otomatis, dan panduan analisis empat komponen. Enam kasus resmi silabus SM tertaut langsung ke PDF aslinya di Google Drive.
- **Tampilan**: sistem visual "electric campus": kanvas indigo, lembar kerja putih mengambang, aksen lime dan magenta, tipografi Archivo lebar untuk display. Area baca sengaja dibiarkan tenang dan berkontras tinggi karena dipakai membaca ribuan kata.
- **Materi dua bagian**: tab **Materi PPT** (pembahasan slide dosen, tidak diubah) dan tab **Materi Buku** (uraian lengkap bab buku referensi per capaian pembelajaran, ditulis bergaya karya ilmiah dengan sub-bab bernomor, untuk dipelajari sebelum kelas). Stabilo dan catatan bekerja terpisah di tiap tab.
- **Materi / Flashcards / Kuis / Catatan / Kalkulator**: sama seperti aplikasi OTM lama

Semua progres tersimpan di `localStorage`, dipisah per mata kuliah (kunci `<kode>_*`),
tugas global memakai kunci `mba_*`.

## Kalender

File `MBA-UGM-Semester-2-SEMBA-51A.ics` berisi 50 sesi + 6 tugas, lengkap dengan
pengingat H-1 dan 2 jam sebelum kelas (serta H-3 untuk tugas). Impor sekali ke Google Calendar.
