/* ============================================================
   Jadwal Semester 2: SEMBA Batch 51-A, MBA UGM
   Sumber: "Semba 51-A - Schedule.pdf" (Agustus 2026 – Januari 2027)

   Pola kelas: Jumat malam (19.00–21.30) & Sabtu (09.00, 12.30, 15.30),
   masing-masing 2,5 jam. GBE diselenggarakan blok di MM Jogja.
   ============================================================ */

window.MBA_SCHEDULE = {
  semester: "Semester 2 · Agustus 2026 – Januari 2027",
  program: "Senior Executive MBA Class, Batch 51 A",
  slots: {
    "09:00": "09.00–11.30",
    "12:30": "12.30–15.00",
    "15:30": "15.30–18.00",
    "19:00": "19.00–21.30"
  },
  /* type: class | exam | presentation | holiday | block */
  events: [
    { date: "2026-08-14", time: "19:00", course: "otm", session: 1, type: "class" },
    { date: "2026-08-15", time: "09:00", course: "otm", session: 2, type: "class" },
    { date: "2026-08-15", time: "12:30", course: "bes", session: 1, type: "class" },
    { date: "2026-08-15", time: "15:30", course: "bes", session: 2, type: "class" },

    { date: "2026-08-21", time: "19:00", course: "sm", session: 1, type: "class" },
    { date: "2026-08-22", time: "09:00", course: "sm", session: 2, type: "class" },

    { date: "2026-08-28", time: "19:00", course: "bes", session: 3, type: "class" },
    { date: "2026-08-29", time: "09:00", course: "bes", session: 4, type: "class" },
    { date: "2026-08-29", time: "12:30", course: "otm", session: 3, type: "class" },
    { date: "2026-08-29", time: "15:30", course: "otm", session: 4, type: "class" },

    { date: "2026-08-31", time: "09:00", course: "gbe", session: 1, type: "block",
      note: "Hari 1, kuliah blok GBE di MM Jogja" },
    { date: "2026-09-01", time: "09:00", course: "gbe", session: 2, type: "block",
      note: "Hari 2, kuliah blok GBE di MM Jogja" },
    { date: "2026-09-02", time: "09:00", course: "gbe", session: 3, type: "block",
      note: "Hari 3, kuliah blok GBE di MM Jogja" },
    { date: "2026-09-03", time: "09:00", course: "gbe", session: 4, type: "block",
      note: "Hari 4, kuliah blok GBE di MM Jogja" },

    { date: "2026-09-11", time: "19:00", course: "otm", session: 5, type: "class" },
    { date: "2026-09-12", time: "09:00", course: "otm", session: 6, type: "class" },
    { date: "2026-09-12", time: "12:30", course: "sm", session: 3, type: "class" },
    { date: "2026-09-12", time: "15:30", course: "sm", session: 4, type: "class" },

    { date: "2026-09-19", time: "12:30", course: "bes", session: 5, type: "class" },
    { date: "2026-09-19", time: "15:30", course: "bes", session: 6, type: "class" },

    { date: "2026-10-02", time: "19:00", course: "sm", session: 5, type: "class" },
    { date: "2026-10-03", time: "09:00", course: "sm", session: 6, type: "class" },

    { date: "2026-10-09", time: "19:00", course: "otm", type: "exam", label: "Ujian Tengah Semester" },
    { date: "2026-10-10", time: "09:00", course: "bes", type: "exam", label: "Ujian Tengah Semester" },
    { date: "2026-10-16", time: "19:00", course: "sm", type: "exam", label: "Ujian Tengah Semester" },

    { date: "2026-10-23", time: "19:00", course: "sm", session: 7, type: "class" },
    { date: "2026-10-24", time: "09:00", course: "sm", session: 8, type: "class" },
    { date: "2026-10-24", time: "12:30", course: "bes", session: 7, type: "class" },
    { date: "2026-10-24", time: "15:30", course: "bes", session: 8, type: "class" },

    { date: "2026-10-30", time: "19:00", course: "otm", session: 7, type: "class" },
    { date: "2026-10-31", time: "09:00", course: "otm", session: 8, type: "class" },

    { date: "2026-11-06", time: "19:00", course: "bes", session: 9, type: "class" },
    { date: "2026-11-07", time: "09:00", course: "bes", session: 10, type: "class" },
    { date: "2026-11-07", time: "12:30", course: "sm", session: 9, type: "class" },
    { date: "2026-11-07", time: "15:30", course: "sm", session: 10, type: "class" },

    { date: "2026-11-14", time: "12:30", course: "otm", session: 9, type: "class" },
    { date: "2026-11-14", time: "15:30", course: "otm", session: 10, type: "class" },

    { date: "2026-11-20", time: "19:00", course: "sm", session: 11, type: "class" },
    { date: "2026-11-21", time: "09:00", course: "sm", session: 12, type: "class" },
    { date: "2026-11-21", time: "12:30", course: "bes", session: 11, type: "class" },
    { date: "2026-11-21", time: "15:30", course: "bes", session: 12, type: "class" },

    { date: "2026-11-27", time: "19:00", course: "otm", session: 11, type: "class" },
    { date: "2026-11-28", time: "09:00", course: "otm", session: 12, type: "class" },

    { date: "2026-12-04", time: "19:00", course: "gbe", type: "presentation", label: "Presentasi Makalah GBE" },
    { date: "2026-12-05", time: "09:00", course: "gbe", type: "presentation", label: "Presentasi Makalah GBE" },
    { date: "2026-12-05", time: "12:30", course: "gbe", type: "presentation", label: "Presentasi Makalah GBE" },
    { date: "2026-12-05", time: "15:30", course: "gbe", type: "presentation", label: "Presentasi Makalah GBE" },

    { date: "2026-12-12", time: "09:00", course: "sm", type: "exam", label: "Ujian Akhir Semester" },
    { date: "2026-12-18", time: "19:00", course: "otm", type: "exam", label: "Ujian Akhir Semester" },
    { date: "2026-12-19", time: "09:00", course: "bes", type: "exam", label: "Ujian Akhir Semester" },

    { date: "2026-12-25", time: "00:00", type: "holiday", label: "Hari Natal" },
    { date: "2026-12-26", time: "00:00", type: "holiday", label: "Libur Natal" }
  ],

  /* Tugas & tenggat bawaan dari silabus, bisa ditambah sendiri lewat menu Tugas */
  defaultTasks: [
    { id: "t-gbe-paper", course: "gbe", title: "Makalah akhir GBE (40%), analisis lingkungan bisnis suatu industri",
      due: "2026-12-04", note: "Rancangan dipresentasikan pada sesi presentasi 4–5 Des. Gaya penulisan mengikuti Gadjah Mada International Journal of Business; sertakan 1 lembar ringkasan eksekutif." },
    { id: "t-otm-team1", course: "otm", title: "Presentasi proyek tim OTM I (20%)",
      due: "2026-11-14", note: "Jadwal presentasi menyusul dari dosen, perkirakan setelah UTS." },
    { id: "t-otm-team2", course: "otm", title: "Presentasi proyek tim OTM II (20%)",
      due: "2026-11-28", note: "Sesi 12 dijadwalkan sebagai Team Final Project Presentation." },
    { id: "t-otm-final", course: "otm", title: "Laporan proyek individu OTM (UAS, 25%)",
      due: "2026-12-18", note: "Take-home individual project report." },
    { id: "t-bes-ind", course: "bes", title: "Tugas individu BES, ringkasan bab 1 halaman + jawaban kasus maks. 2 halaman",
      due: "2026-08-28", note: "Berulang tiap sesi; sesuaikan tanggalnya dengan sesi berikutnya." },
    { id: "t-bes-group", course: "bes", title: "Presentasi kelompok BES (diskusi kasus, 15 menit)",
      due: "2026-08-29", note: "Kelompok non-presenter wajib memberi pertanyaan & masukan konstruktif." },

    { id: "t-sm-diary-1", course: "sm", title: "Learning Diary SM Sesi 1 (esai reflektif, posting ke grup WA)",
      due: "2026-08-21", note: "Wajib dikerjakan setiap sesi. Bukan catatan mentah: esai reflektif berisi argumen utama + interpretasi & pertanyaan sendiri." },
    { id: "t-sm-diary-2", course: "sm", title: "Learning Diary SM Sesi 2 (esai reflektif, posting ke grup WA)",
      due: "2026-08-22", note: "Isi menu Catatan Kelas dulu, lalu ubah kolom 'Poin utama' + 'Pertanyaan saya' jadi paragraf reflektif." },
    { id: "t-sm-case-airasia", course: "sm", title: "⭐ Kelompok 3: Case Presentation AirAsia + Chapter Presentation Bab 3",
      due: "2026-09-12", note: "Laporan tertulis min. 1000 kata (A4, spasi 1,5, Times 12) dipublikasikan ke kelas sebelum presentasi. Email: SMJKT_Group 3_Aslih_Case AirAsia." },
    { id: "t-sm-4dx", course: "sm", title: "⭐ Kelompok 3: Framework Presentation 4DX + Chapter Presentation Bab 10",
      due: "2026-11-07", note: "Laporan tertulis 2 halaman + slide 15 menit. Jelaskan dimensi, definisi, dan manfaat dalam konteks bisnis internasional." },
    { id: "t-sm-termpaper", course: "sm", title: "Term Paper SM (40% nilai): 10–15 halaman, organisasi nyata",
      due: "2026-12-12", note: "Struktur wajib 7 bagian: Executive Summary · Company & Industry Context · Strategic Diagnosis · Holistic Strategic Recommendation · Strategic Implementation · Strategic Impact Evaluation · References. Tentukan perusahaannya sejak awal semester." },
    { id: "t-sm-framework-report", course: "sm", title: "Kumpulkan laporan Strategic Framework (2 halaman)",
      due: "2026-12-12", note: "Silabus: framework report is due on the final exam session." }
  ]
};
