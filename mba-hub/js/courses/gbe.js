/* ============================================================
   General Business Environment (MAN 6521)
   Koordinator: Prof. Dr. Sony Warsono, MAFIS., Akt. — 3 SKS
   Kuliah blok di MM Jogja, 31 Agustus – 3 September 2026.
   Tanpa buku teks tunggal: tiap lingkungan dibawakan dosen berbeda
   dengan modul/PPT masing-masing.
   ============================================================ */

window.MBA_COURSES = window.MBA_COURSES || {};
window.MBA_COURSES.gbe = {
  meta: {
    id: "gbe",
    code: "MAN 6521",
    name: "General Business Environment",
    short: "GBE",
    icon: "🌐",
    accent: "#a4432f",
    lecturer: "Prof. Dr. Sony Warsono, MAFIS., Akt. (koordinator)",
    lecturerNote: "Team teaching — tiap lingkungan dibawakan dosen berbeda",
    sks: 3,
    sessionsTotal: 10,
    hasBook: false,
    bookNote: "Tidak memakai buku teks tunggal — materi berupa modul & PPT per dosen, dilengkapi bahan bacaan mandiri.",
    tools: [],
    driveFolder: "https://drive.google.com/drive/folders/1qnI_Atb36OZFTRX7W-XOGKnmAA550IaS",
    status: "Kuliah blok 31 Agu – 3 Sep · 8 PPT tersedia"
  },
  course: {
    title: "General Business Environment",
    codes: "MAN 6521",
    program: "Magister Business Administration — Universitas Gadjah Mada",
    semester: "Semester 2 · Kelas S51A · Kuliah blok di MM Jogja",
    classCode: "—",
    lecturer: {
      name: "Prof. Dr. Sony Warsono, MAFIS., Akt.",
      dept: "Koordinator mata kuliah · team teaching lintas bidang",
      education: "Tiap topik lingkungan dibawakan dosen spesialis bidangnya"
    },
    driveLinks: [
      { label: "Folder General Business Environment", url: "https://drive.google.com/drive/folders/1qnI_Atb36OZFTRX7W-XOGKnmAA550IaS" },
      { label: "Silabus GBE", url: "https://drive.google.com/file/d/1nqccNAnZX8j6gsI5_a5zynrg4R0JaMzU/view" },
      { label: "Materi presentasi GBE (8 file)", url: "https://drive.google.com/drive/folders/10g4gcQnbwbCQQrxiHB45TstWnbvdfEYR" }
    ],
    assessment: [
      { label: "Partisipasi 9 topik (@5%)", weight: 45 },
      { label: "Tugas akhir berupa makalah", weight: 40 },
      { label: "Presentasi makalah akhir", weight: 15 }
    ],
    references: [
      { code: "MOD", text: "Materi pembelajaran dikompilasi dalam modul berisi bahan bacaan & studi kasus tiap topik — tidak ada buku teks tunggal." },
      { code: "PPT", text: "Slide dari masing-masing dosen pengampu topik (tersedia di folder Presentasi GBE)." },
      { code: "MANDIRI", text: "Mahasiswa sangat didorong mengeksplorasi bahan bacaan tambahan untuk setiap topik." }
    ],
    objectives: [
      "Mendeskripsikan konsep dasar interaksi antara bisnis dengan lingkungannya.",
      "Mengidentifikasi faktor lingkungan penting, menganalisis pola & tren, serta menerjemahkannya menjadi peluang dan tantangan organisasi.",
      "Menganalisis bagaimana faktor lingkungan memengaruhi keputusan bisnis beserta implikasinya.",
      "Mengembangkan dan memformulasikan strategi bisnis yang lebih baik.",
      "Memiliki perspektif lebih lebar, visioner, dan sadar lingkungan dalam keputusan manajerial — setiap topik didiskusikan dari perspektif seorang CEO."
    ]
  },

  /* 9 lingkungan + sesi presentasi; PPT dipetakan ke hari kuliah blok */
  sessions: [
    { id: 1, date: "2026-08-31", dateLabel: "31 Agustus 2026 · Hari 1", topic: "Penjelasan Mata Kuliah & Silabus",
      subtopics: ["Pengantar GBE", "Aturan main & tugas akhir"], readings: ["Silabus GBE"],
      lecturerTopic: "Prof. Agus Sartono", caseStudy: null, summary: null },
    { id: 2, date: "2026-08-31", dateLabel: "31 Agustus 2026 · Hari 1", topic: "Lingkungan Ekonomi",
      subtopics: ["Struktur & perubahan kondisi ekonomi", "Kebijakan moneter & fiskal", "Perdagangan, investasi, kesejahteraan"],
      readings: ["Modul: economic environment"], lecturerTopic: "Gumilang Aryo Sahadewo", caseStudy: null, summary: null },
    { id: 3, date: "2026-08-31", dateLabel: "31 Agustus 2026 · Hari 1", topic: "Lingkungan Alami (Natural)",
      subtopics: ["Hubungan timbal balik bisnis & ekologi", "Polusi, tuntutan publik, permintaan konsumen"],
      readings: ["Modul: natural environment"], lecturerTopic: "Pak Andhika", caseStudy: null, summary: null },
    { id: 4, date: "2026-09-01", dateLabel: "1 September 2026 · Hari 2", topic: "Lingkungan Sosial & Budaya",
      subtopics: ["Nilai lokal & tren", "Interaksi global & modernisasi", "Pola kerja dan ekspektasi karyawan"],
      readings: ["Modul: social environment"], lecturerTopic: "Desideria Cempaka", caseStudy: null, summary: null },
    { id: 5, date: "2026-09-01", dateLabel: "1 September 2026 · Hari 2", topic: "Lingkungan Politik (Nasional & Internasional)",
      subtopics: ["Relasi eksekutif–legislatif–yudikatif", "Stabilitas politik & regulasi", "Geopolitik dunia"],
      readings: ["Modul: political environment"], lecturerTopic: "Hempri Suyatna", caseStudy: null, summary: null },
    { id: 6, date: "2026-09-02", dateLabel: "2 September 2026 · Hari 3", topic: "Lingkungan Demografi",
      subtopics: ["Struktur & perubahan variabel demografi", "Dampak pada tenaga kerja & permintaan barang/jasa"],
      readings: ["Modul: demographical environment"], lecturerTopic: "Ibu Amelia", caseStudy: null, summary: null },
    { id: 7, date: "2026-09-03", dateLabel: "3 September 2026 · Hari 4", topic: "Lingkungan Teknologi",
      subtopics: ["Tren & kemajuan teknologi", "Pengembangan produk dan proses"],
      readings: ["Modul: technology environment"], lecturerTopic: "Pak Wirawan", caseStudy: null, summary: null },
    { id: 8, date: "2026-09-03", dateLabel: "3 September 2026 · Hari 4", topic: "Lingkungan Hukum Bisnis Indonesia",
      subtopics: ["Hukum kontrak, investasi, persaingan usaha", "Perlindungan konsumen", "Perbankan & pasar modal"],
      readings: ["Modul: hukum dan hukum bisnis"], lecturerTopic: "Pak Ferry", caseStudy: null, summary: null },
    { id: 9, date: null, dateLabel: "Menyusul", topic: "Lingkungan Hukum Bisnis Internasional",
      subtopics: ["Kontrak internasional", "Arbitrase internasional", "HKI", "Regionalisasi (AEC, EU, NAFTA)"],
      readings: ["Modul"], lecturerTopic: "Menyusul", caseStudy: null, summary: null },
    { id: 10, date: null, dateLabel: "Menyusul", topic: "Lingkungan Pemerintahan",
      subtopics: ["Struktur & perilaku pemerintah", "Regulasi & deregulasi", "Otonomi daerah, privatisasi BUMN"],
      readings: ["Modul"], lecturerTopic: "Menyusul", caseStudy: null, summary: null },
    { id: 11, date: "2026-12-04", dateLabel: "4 Desember 2026", topic: "Presentasi & Diskusi Makalah Akhir",
      subtopics: ["Presentasi rancangan makalah", "Masukan dosen & mahasiswa"], readings: [],
      lecturerTopic: "Tim dosen GBE", caseStudy: null, summary: null },
    { id: 12, date: "2026-12-05", dateLabel: "5 Desember 2026", topic: "Presentasi & Diskusi Makalah Akhir (lanjutan)",
      subtopics: ["Presentasi rancangan makalah", "Penyempurnaan makalah final"], readings: [],
      lecturerTopic: "Tim dosen GBE", caseStudy: null, summary: null }
  ],
  flashcards: [],
  quizzes: []
};
