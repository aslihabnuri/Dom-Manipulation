/* ============================================================
   BEfS Study Hub — Data Mata Kuliah
   Business Ethics for Sustainability (MAN5522)
   Master of Business Administration — Universitas Gadjah Mada

   Sumber: RPKPS "MAN5522 Business Ethics for Sustainability"
   (disahkan 13 Juli 2023, Koordinator: Amin Wibowo, Ph.D.)

   Struktur materi ada di chapters.js (CM1–CM12), kartu & soal
   ada di flashcards.js dan quizzes.js.
   ============================================================ */

window.BEFS_DATA = {
  course: {
    code: "MAN5522",
    title: "Business Ethics for Sustainability",
    titleId: "Etika Bisnis untuk Keberlanjutan",
    program: "Master of Business Administration — Faculty of Economics and Business, Universitas Gadjah Mada",
    credit: "3 SKS",
    status: "Mata kuliah wajib (compulsory)",
    prerequisite: "Tanpa prasyarat",
    folder: "Semester 2 · MBA UGM",
    coordinator: "Amin Wibowo, Ph.D.",
    authorized: "13 Juli 2023",

    description:
      "Mata kuliah ini memperkenalkan prinsip etika deskriptif dan normatif serta penerapannya pada perilaku individu " +
      "dan lingkungan bisnis. Kuliah ini membahas berbagai faktor yang memengaruhi pengambilan keputusan manajerial " +
      "yang mengandung isu etis, membekali mahasiswa memahami prinsip atau norma etika, dan memberi wawasan tentang " +
      "alternatif yang dapat diterima secara sosial dan moral atas persoalan bisnis.",

    /* Course Objectives (CO) dari RPKPS */
    objectives: [
      { code: "CO1", text: "Menunjukkan pemahaman atas prinsip etika dan standar moral untuk menjamin keberlanjutan bisnis." },
      { code: "CO2", text: "Menunjukkan kompetensi mengadopsi kesadaran etis dan berkelanjutan dalam mengambil keputusan dan tindakan bermakna untuk mengembangkan komunitas sekitar dan profesi." },
      { code: "CO3", text: "Menunjukkan kompetensi menyediakan beragam solusi yang mungkin atas persoalan bisnis." },
      { code: "CO4", text: "Menunjukkan kompetensi komunikasi lisan dan interpersonal: satu-lawan-satu, kelompok kecil, dan presentasi publik." }
    ],

    /* Competency Goal 3 — satu-satunya CG yang dipetakan ke seluruh CO */
    competencyGoal: {
      code: "CG3",
      text: "Demonstrate the ability to make ethical and responsible decisions",
      items: [
        { code: "3.1", text: "Mampu mengidentifikasi dilema etis secara akurat", measure: "Exam / Assignment" },
        { code: "3.2", text: "Mampu menganalisis isu bisnis memakai prinsip etika atau standar moral yang relevan", measure: "Exam / Assignment" },
        { code: "3.3", text: "Mampu menarik penilaian etis (ethical judgment) atas isu bisnis", measure: "Exam / Assignment" },
        { code: "3.4", text: "Mampu menyediakan beragam solusi yang mungkin atas isu bisnis", measure: "Exam / Assignment" }
      ]
    },

    assessment: [
      { label: "Discussion & Participation", weight: 30, co: "CO4", note: "Kehadiran, kontribusi diskusi, feedback untuk kelompok penyaji." },
      { label: "Mid-term exam", weight: 25, co: "CO1, CO2", note: "Materi sesi 1–6 (CM1–CM6)." },
      { label: "Final exam", weight: 25, co: "CO1, CO2", note: "Materi sesi 8–13 (CM7–CM12)." },
      { label: "Assignment (individu & kelompok)", weight: 20, co: "CO1–CO4", note: "Ringkasan bab 1 halaman + jawaban kasus maks. 2 halaman; presentasi kelompok 15 menit." }
    ],

    assignments: [
      {
        type: "Individual Assignment",
        detail: "Ringkasan bab sepanjang <strong>satu halaman</strong>, ditambah jawaban atas kasus/artikel terpilih maksimal <strong>dua halaman</strong>."
      },
      {
        type: "Group Assignment",
        detail: "Diskusi kasus. Tiap kelompok menyiapkan analisis masalah pada kasus dan mengusulkan solusi terbaik, dibahas pada sesi terkait. Kelompok penyaji menyiapkan <strong>presentasi kreatif 15 menit</strong>; kelompok non-penyaji memberi umpan balik dan pertanyaan konstruktif. Nilai presentasi diberikan per individu."
      },
      {
        type: "Mid-term & Final Exam",
        detail: "Menguji pengetahuan, pemahaman, dan kemampuan menerapkan materi kuliah untuk menyelesaikan isu etis."
      }
    ],

    grading: [
      { grade: "A", range: "90–100", gpa: "4,00" },
      { grade: "A-", range: "85–89,99", gpa: "3,75" },
      { grade: "A/B", range: "80–84,99", gpa: "3,50" },
      { grade: "B+", range: "75–79,99", gpa: "3,25" },
      { grade: "B", range: "70–74,99", gpa: "3,00" },
      { grade: "B-", range: "65–69,99", gpa: "2,75" },
      { grade: "B/C", range: "60–64,99", gpa: "2,50" },
      { grade: "C+", range: "55–59,99", gpa: "2,25" },
      { grade: "C", range: "50–54,99", gpa: "2,00" },
      { grade: "C-", range: "45–49,99", gpa: "1,75" },
      { grade: "C/D", range: "40–44,99", gpa: "1,50" },
      { grade: "D+", range: "35–39,99", gpa: "1,25" },
      { grade: "D", range: "30–34,99", gpa: "1,00" },
      { grade: "E", range: "< 30", gpa: "0" }
    ],

    references: [
      {
        code: "CM",
        main: true,
        text: "Crane, A. & Matten, D. (2019). <em>Business Ethics: Managing corporate citizenship and sustainability in the age of globalization</em>. Oxford: Oxford University Press."
      },
      { code: "FFF", text: "Ferrell, O.C., Fraedrich, J. & Ferrell, L. (2022). <em>Business Ethics: Ethical Decision Making and Cases</em>, 11th edn. Boston, MA: Cengage Learning." },
      { code: "CB", text: "Carroll, A. B. & Brown, J. (2022). <em>Business &amp; Society: Ethics, Sustainability &amp; Stakeholder Management</em>. Cengage Learning." },
      { code: "V", text: "Velasquez, M.G. (2014). <em>Business Ethics: Concepts and Cases</em>, 7th edn. Prentice Hall." },
      { code: "LC", text: "Laasch, O. & Conaway, R. (2016). <em>Responsible Business: The Textbook for Management Learning, Competence, and Innovation</em>. Routledge." },
      { code: "+", text: "Kasus praktis dan artikel akademik." }
    ],

    driveLinks: [
      { label: "Folder Business Ethics For Sustainability", url: "https://drive.google.com/drive/folders/1Vtc18Q6GmmB-VnlBKs0R-yiQvbpm0iLR" },
      { label: "Silabus / RPKPS MAN5522 (PDF)", url: "https://drive.google.com/file/d/15PdSy_1MhZ2gTpuwUvG2VPDGrJwJKwZd/view" },
      { label: "Folder Semester 2 - MBA UGM", url: "https://drive.google.com/drive/folders/15qUTfHdRAi-x3eaxfZEapQHXArC-RY2R" }
    ],

    responsibilities: [
      "Hadir di kelas dengan persiapan: baca materi yang diminta tiap sesi.",
      "Berkontribusi aktif dalam diskusi yang dipandu fasilitator.",
      "Menyimak kuliah, meringkas, dan mencatat hal penting untuk didiskusikan lebih lanjut.",
      "Mengerjakan seluruh tugas mata kuliah.",
      "Mengikuti ujian tengah dan akhir semester sesuai jadwal — tidak ada ujian susulan kecuali kondisi force majeure."
    ],

    integrity:
      "UGM tidak menoleransi plagiarisme dalam bentuk apa pun. Plagiarisme mencakup menyajikan kata, karya, pendapat, " +
      "atau informasi faktual orang lain sebagai milik sendiri tanpa pengakuan yang layak — termasuk copy-paste paragraf, " +
      "diagram, tabel, dan kalimat. Seluruh pelanggaran yang ditemukan berakibat nilai negatif pada tugas dan " +
      "<strong>kegagalan mata kuliah (nilai E)</strong>. Pada kerja kelompok, seluruh anggota tim gagal (nilai E)."
  },

  /* ==========================================================
     WEEKLY LEARNING ACTIVITY PLAN — 14 sesi
     Mengikuti tabel "Weekly Learning Activity Plan" pada RPKPS,
     yang merupakan versi paling konsisten di dokumen tersebut.
     ========================================================== */
  sessions: [
    {
      id: 1, chapter: 1, ref: "CM1",
      topic: "Introducing Business Ethics",
      topicId: "Pengantar Etika Bisnis",
      subObjective: "Mampu menjelaskan konsep dasar Business Ethics",
      subtopics: ["Silabus & manajemen kelas", "Definisi etika bisnis", "Globalisasi", "Sustainability"],
      assignment: null
    },
    {
      id: 2, chapter: 2, ref: "CM2",
      topic: "Framing Business Ethics",
      topicId: "Membingkai Etika Bisnis",
      subObjective: "Mampu mengontekstualisasikan etika bisnis dan para pemangku kepentingannya",
      subtopics: ["Corporate responsibility", "Stakeholder theory", "Corporate citizenship"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 3, chapter: 3, ref: "CM3",
      topic: "Evaluating Business Ethics",
      topicId: "Mengevaluasi Etika Bisnis",
      subObjective: "Mampu mengevaluasi konsep etika bisnis, termasuk teori-teorinya",
      subtopics: ["Teori normatif", "Consequentialist", "Non-consequentialist", "Teori kontemporer"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 4, chapter: 4, ref: "CM4",
      topic: "Making Decisions in Business Ethics",
      topicId: "Mengambil Keputusan dalam Etika Bisnis",
      subObjective: "Mampu memahami apa itu ethical leadership dan mengambil keputusan etis dalam bisnis",
      subtopics: ["Teori deskriptif", "Faktor individual", "Faktor situasional", "Ethical leadership"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 5, chapter: 5, ref: "CM5",
      topic: "Managing Business Ethics",
      topicId: "Mengelola Etika Bisnis",
      subObjective: "Mampu memahami manajemen etika bisnis dan mengadopsi alat serta tekniknya",
      subtopics: ["Codes of ethics", "Whistleblowing", "Social auditing", "Stakeholder dialogue"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 6, chapter: 6, ref: "CM6",
      topic: "Shareholders and Business Ethics",
      topicId: "Pemegang Saham dan Etika Bisnis",
      subObjective: "Mampu menarik hubungan antara pemegang saham dan etika bisnis",
      subtopics: ["Corporate governance", "Executive pay", "Insider trading", "SRI & ESG"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 7, chapter: null, ref: null,
      topic: "Guest Lecturer — Ethical Leadership",
      topicId: "Kuliah Tamu — Kepemimpinan Etis",
      subObjective: "Menyadari isu terkini dalam Business Ethics dan Sustainability",
      subtopics: ["Guest lecture", "Project", "Review"],
      assignment: null,
      exam: "MID-TERM EXAM · materi sesi 1–6 (CM1–CM6)"
    },
    {
      id: 8, chapter: 7, ref: "CM7",
      topic: "Employees and Business Ethics",
      topicId: "Karyawan dan Etika Bisnis",
      subObjective: "Menyadari keterkaitan antara karyawan dan etika bisnis",
      subtopics: ["Hak & kewajiban karyawan", "Diskriminasi", "Privasi", "Kondisi kerja"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 9, chapter: 8, ref: "CM8",
      topic: "Consumers and Business Ethics",
      topicId: "Konsumen dan Etika Bisnis",
      subObjective: "Menyadari keterkaitan antara konsumen dan etika bisnis",
      subtopics: ["Product safety", "Etika pemasaran", "Privasi data", "Sustainable consumption"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 10, chapter: 9, ref: "CM9",
      topic: "Suppliers, Competitors, and Business Ethics",
      topicId: "Pemasok, Pesaing, dan Etika Bisnis",
      subObjective: "Menyadari keterkaitan antara pemasok, pesaing, dan etika bisnis",
      subtopics: ["Suap & korupsi", "Fair trade", "Kartel", "Circular economy"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 11, chapter: 10, ref: "CM10",
      topic: "Civil Society and Business Ethics",
      topicId: "Masyarakat Sipil dan Etika Bisnis",
      subObjective: "Menyadari keterkaitan antara masyarakat sipil dan etika bisnis",
      subtopics: ["CSO & NGO", "Konflik vs kolaborasi", "Filantropi", "Social enterprise"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 12, chapter: 11, ref: "CM11",
      topic: "Government, Regulation, and Business Ethics",
      topicId: "Pemerintah, Regulasi, dan Etika Bisnis",
      subObjective: "Menyadari keterkaitan antara pemerintah dan regulasi terhadap etika bisnis",
      subtopics: ["Lobi", "State capture", "Self-regulation", "Political CSR"],
      assignment: "Diskusi kasus & presentasi kelompok"
    },
    {
      id: 13, chapter: 12, ref: "CM12",
      topic: "Future Perspectives, Corporate Governance, and Business Ethics",
      topicId: "Perspektif Masa Depan, Tata Kelola, dan Etika Bisnis",
      subObjective: "Mampu merangkum konsep dan perspektif masa depan etika bisnis, termasuk kemajuan teknologi",
      subtopics: ["Masa depan etika bisnis", "Etika & teknologi", "AI ethics", "ESG"],
      assignment: "Diskusi kasus & presentasi kelompok",
      extraRef: "CM12 + modul/handout"
    },
    {
      id: 14, chapter: null, ref: null,
      topic: "Guest Lecturer",
      topicId: "Kuliah Tamu",
      subObjective: "Menyadari isu terkini dalam Business Ethics dan Sustainability",
      subtopics: ["Guest lecture", "Project", "Review"],
      assignment: null,
      exam: "FINAL EXAM · materi sesi 8–13 (CM7–CM12)"
    }
  ]
};
