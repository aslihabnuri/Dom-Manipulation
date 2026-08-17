/* ============================================================
   Strategic Management (MAN 5422)
   Dr. Rangga Almahendra / Dr. Claudius Budi Santoso — 3 SKS (team teaching)
   Materi PPT belum tersedia; bagian "Bahan Bacaan" disusun dari
   silabus + buku teks utama TPGS agar bisa dibaca sebelum kelas.
   ============================================================ */

window.MBA_COURSES = window.MBA_COURSES || {};
window.MBA_COURSES.sm = {
  meta: {
    id: "sm",
    code: "MAN 5422",
    name: "Strategic Management",
    short: "SM",
    icon: "♟️",
    accent: "#2f5d7c",
    lecturer: "Dr. Rangga Almahendra, S.T., M.M. / Dr. Claudius Budi Santoso, S.E., M.Bus.",
    lecturerNote: "Team teaching",
    sks: 3,
    sessionsTotal: 12,
    hasBook: true,
    tools: [],
    driveFolder: "https://drive.google.com/drive/folders/1vr9J0e6D9maIlZvmf4cIz8bAQ6irH7GX",
    status: "PPT belum ada — bahan bacaan sudah disiapkan"
  },
  course: {
    title: "Strategic Management",
    codes: "MAN 5422",
    program: "Magister Business Administration — Universitas Gadjah Mada",
    semester: "Semester 2 · Kelas S51A",
    classCode: "—",
    lecturer: {
      name: "Dr. Rangga Almahendra, S.T., M.M. / Dr. Claudius Budi Santoso, S.E., M.Bus.",
      dept: "Faculty of Economics and Business, Universitas Gadjah Mada",
      education: "Team teaching · metode Student-Centered Learning (SCL) dengan metode kasus"
    },
    driveLinks: [
      { label: "Folder Strategic Management", url: "https://drive.google.com/drive/folders/1vr9J0e6D9maIlZvmf4cIz8bAQ6irH7GX" },
      { label: "Silabus SM", url: "https://drive.google.com/file/d/1bn3sq7rlj9wWtPUPwv51DsK5F_onM8AI/view" },
      { label: "Buku TPGS — Crafting & Executing Strategy (23rd Ed.)", url: "https://drive.google.com/file/d/1YyeB9ZHeppWGwj6N9t1w1RsUEWFpSb0S/view" }
    ],
    assessment: [
      { label: "Partisipasi & diskusi", weight: 30 },
      { label: "Ujian tengah semester", weight: 25 },
      { label: "Ujian akhir semester", weight: 25 },
      { label: "Tugas (makalah, kuis, dll.)", weight: 20 }
    ],
    references: [
      { code: "TPGS", text: "Thompson, Peteraf, Gamble & Strickland (2022), Crafting and Executing Strategy: The Quest for Competitive Advantage — Concepts and Cases, 23rd Ed., McGraw-Hill. — BUKU UTAMA (ada di Drive)" },
      { code: "PM", text: "Porter, M.E. (1980), Competitive Strategy: Techniques for Analyzing Industries and Competitors, The Free Press. — PENDUKUNG" },
      { code: "+", text: "Bahan bacaan tambahan & kasus akan didistribusikan saat perkuliahan." }
    ],
    objectives: [
      "Berpikir strategik tentang perusahaan, posisi bisnisnya, dan bagaimana meraih keunggulan kompetitif berkelanjutan.",
      "Melakukan analisis strategik pada berbagai industri dan situasi kompetitif.",
      "Mengelola proses organisasi tempat strategi dirumuskan, dibentuk, dan dieksekusi.",
      "Mengintegrasikan pengetahuan dari pemasaran, keuangan, operasi, SDM, dan perilaku organisasi.",
      "Mengintegrasikan isu lingkungan dan sosial ke dalam proses manajemen strategik.",
      "Menerapkan teori & teknik manajemen strategik pada situasi bisnis nyata lewat metode kasus."
    ]
  },

  sessions: [
    {
      id: 1, date: "2026-08-21", dateLabel: "21 Agustus 2026",
      topic: "Introduction to Strategic Management",
      subtopics: ["Course overview", "The concept of strategy"],
      readings: ["TPGS bab 1"], caseStudy: null,
      summary: [
        {
          heading: "Bahan Bacaan Sesi 1 — What Is Strategy and Why Is It Important?",
          source: { kind: "book", label: "TPGS bab 1" },
          body: `<p>Materi PPT dosen belum tersedia (Anda belum masuk kelas), jadi bagian ini disusun sebagai
            <strong>panduan bacaan mandiri</strong> dari buku utama <em>TPGS bab 1</em> yang sudah ada di Drive Anda.
            Tujuannya: masuk kelas pertama tanggal 21 Agustus dengan konsep dasarnya sudah di kepala.</p>
          <h4 class="sub-h">Tiga pertanyaan yang mendefinisikan strategi</h4>
          <p>Strategi sebuah perusahaan adalah <strong>rangkaian pilihan dan tindakan yang dipakai manajer untuk
            bersaing dan mencapai kinerja superior</strong>. Intinya menjawab tiga pertanyaan: <em>Di mana kita akan
            bersaing?</em> (pasar, segmen, geografi), <em>Bagaimana kita akan menciptakan nilai untuk pelanggan?</em>
            (proposisi nilai), dan <em>Bagaimana kita akan mengalahkan pesaing?</em></p>
          <p>Perhatikan kata kuncinya: strategi selalu soal <strong>pilihan yang berbeda dari pesaing</strong> —
            "doing things differently, or doing different things". Kalau strategi Anda bisa disalin persis oleh
            kompetitor besok pagi, itu bukan strategi, itu praktik operasional biasa.</p>
          <h4 class="sub-h">Competitive advantage & sustainability</h4>
          <p><strong>Competitive advantage</strong> muncul saat perusahaan memenuhi kebutuhan pelanggan lebih efisien
            atau lebih efektif daripada pesaing, sehingga bisa mengenakan harga premium atau beroperasi berbiaya lebih
            rendah. Disebut <strong>sustainable</strong> bila keunggulan itu bertahan meski pesaing berusaha meniru.
            Buku menekankan: keunggulan bertahan bila didukung sumber daya & kapabilitas yang sulit ditiru — konsep
            ini akan diperdalam di sesi 4 (resource-based view, VRIO).</p>
          <h4 class="sub-h">Lima pendekatan strategi kompetitif (kenali dari awal)</h4>
          <ul>
            <li><strong>Low-cost provider</strong> — biaya keseluruhan lebih rendah dari pesaing.</li>
            <li><strong>Broad differentiation</strong> — menawarkan atribut yang membedakan bagi pasar luas.</li>
            <li><strong>Focused low-cost</strong> — biaya rendah untuk ceruk pasar sempit.</li>
            <li><strong>Focused differentiation</strong> — diferensiasi untuk ceruk pasar sempit.</li>
            <li><strong>Best-cost provider</strong> — kombinasi: atribut lebih baik dengan biaya lebih rendah.</li>
          </ul>
          <h4 class="sub-h">Strategy vs business model</h4>
          <p>Satu bedaan yang sering ditanyakan di kelas: <strong>strategi</strong> menjawab <em>bagaimana bersaing</em>,
            sedangkan <strong>business model</strong> menjawab <em>apakah strategi itu menghasilkan uang</em> —
            terdiri dari <em>customer value proposition</em> (nilai bagi pelanggan) dan <em>profit formula</em>
            (bagaimana perusahaan untung dari menyampaikan nilai itu).</p>
          <p>Strategi juga <strong>berevolusi</strong>: sebagian direncanakan (<em>deliberate strategy</em>) dan
            sebagian muncul dari respons terhadap kejadian tak terduga (<em>emergent strategy</em>). Terakhir,
            strategi yang menang harus lolos <strong>tiga tes</strong>: <em>fit test</em> (cocok dengan situasi
            internal & eksternal), <em>competitive advantage test</em>, dan <em>performance test</em>.</p>
          <div class="key-box"><strong>💡 Siapkan untuk kelas:</strong> pahami definisi strategi, competitive advantage
            (dan apa yang membuatnya sustainable), lima pendekatan strategi kompetitif, beda strategi vs business model,
            serta tiga tes strategi yang menang. Siapkan satu contoh perusahaan Indonesia yang Anda kenal untuk dibahas —
            metode kelas ini SCL (student-centered), jadi partisipasi bernilai 30%.</div>`
        },
        {
          heading: "Cara membaca buku TPGS secara efisien",
          source: { kind: "book", label: "Tips belajar" },
          body: `<p>Buku TPGS tebal (23rd edition, ±45MB di Drive). Supaya efisien untuk kelas eksekutif:</p>
          <ul>
            <li><strong>Baca "Key Points" di akhir bab lebih dulu</strong> — itu ringkasan resmi penulis; baru masuk
              ke isi bab untuk bagian yang belum jelas.</li>
            <li><strong>Perhatikan kotak "Illustration Capsule"</strong> — berisi contoh perusahaan nyata yang sering
              dijadikan bahan diskusi kelas dan soal ujian.</li>
            <li><strong>Kerjakan "Assurance of Learning Exercises"</strong> di akhir bab bila ingin menguji pemahaman.</li>
            <li><strong>Kasus (cases)</strong> ada di bagian belakang buku — silabus menunjuk Kasus 3, 12, 21, 22, 25,
              dan 31 pada sesi-sesi tertentu. Baca kasusnya <em>sebelum</em> sesi terkait.</li>
          </ul>
          <p>Buku pendukung <strong>Porter (1980)</strong> dipakai pada sesi analisis eksternal & internal
            (bab 1, 3, 4, 7, 8 untuk sesi 3; bab 2, 5, 6 untuk sesi 4; bab 9–12 untuk sesi 6; bab 13 untuk sesi 7;
            bab 14–16 untuk sesi 8).</p>`
        }
      ]
    },
    {
      id: 2, date: "2026-08-22", dateLabel: "22 Agustus 2026",
      topic: "Charting a Company's Direction",
      subtopics: ["Strategic management process", "Visi, misi & nilai", "Menetapkan tujuan & sasaran", "Crafting a strategy"],
      readings: ["TPGS bab 2", "TPGS Kasus 3"], caseStudy: "TPGS Kasus 3",
      summary: [
        {
          heading: "Bahan Bacaan Sesi 2 — Charting a Company's Direction",
          source: { kind: "book", label: "TPGS bab 2" },
          body: `<p>Sesi ini membahas <strong>proses manajemen strategik</strong> — lima tahap yang menjadi kerangka
            seluruh mata kuliah:</p>
          <ul>
            <li><strong>1. Mengembangkan visi strategis, misi, dan nilai.</strong> <em>Visi</em> menggambarkan ke mana
              perusahaan hendak menuju (masa depan); <em>misi</em> menggambarkan siapa kita dan apa yang kita kerjakan
              sekarang; <em>nilai</em> adalah keyakinan yang memandu perilaku. Visi yang efektif: grafis, terarah,
              fokus, fleksibel, layak, diinginkan, dan mudah dikomunikasikan.</li>
            <li><strong>2. Menetapkan tujuan (objectives).</strong> Bedakan <em>financial objectives</em> (target
              keuangan) dan <em>strategic objectives</em> (posisi pasar & daya saing). Gunakan kerangka
              <strong>balanced scorecard</strong> agar keduanya seimbang, dan buat tujuan yang <em>stretch</em> —
              menantang tapi masuk akal — dengan horizon jangka pendek dan panjang.</li>
            <li><strong>3. Merumuskan strategi (crafting).</strong> Strategi disusun di beberapa level:
              <em>corporate</em> (perusahaan multi-bisnis), <em>business</em>, <em>functional</em>, dan
              <em>operating</em>. Semua level harus selaras — konsep yang akan Anda kenali mirip hierarki strategi
              di mata kuliah OTM.</li>
            <li><strong>4. Mengeksekusi strategi</strong> — dibahas mendalam di sesi 11–13.</li>
            <li><strong>5. Memantau, mengevaluasi, dan mengoreksi</strong> — strategi bukan dokumen sekali jadi.</li>
          </ul>
          <p>Bagian penutup bab membahas <strong>corporate governance</strong>: peran dewan direksi mengawasi agar
            manajemen menjalankan strategi demi kepentingan pemegang saham — termasuk kegagalan tata kelola yang
            memicu skandal korporasi (nyambung dengan mata kuliah Business Ethics Anda).</p>
          <div class="key-box"><strong>💡 Siapkan untuk kelas:</strong> hafalkan lima tahap proses manajemen strategik,
            beda visi–misi–nilai, dan beda financial vs strategic objectives. Baca juga <strong>TPGS Kasus 3</strong>
            yang ditunjuk silabus untuk sesi ini.</div>`
        }
      ]
    },
    { id: 3, date: "2026-09-12", dateLabel: "12 September 2026", topic: "External Environment Analysis",
      subtopics: ["Analisis PESTEL", "Porter's Five Forces", "Industry value chain & strategic groups", "SWOT: peluang & ancaman", "Key success factors"],
      readings: ["TPGS bab 3", "PM bab 1, 3, 4, 7, 8"], caseStudy: "Kasus akan didistribusikan", summary: null },
    { id: 4, date: "2026-09-12", dateLabel: "12 September 2026", topic: "Internal Analysis",
      subtopics: ["SWOT: kekuatan & kelemahan", "Competitive advantage & core competence", "Resource-based view (RBV)", "Value-chain analysis & VRIO"],
      readings: ["TPGS bab 4", "PM bab 2, 5, 6"], caseStudy: "Kasus akan didistribusikan", summary: null },
    { id: 5, date: "2026-10-02", dateLabel: "2 Oktober 2026", topic: "Business-Level Strategy",
      subtopics: ["Merumuskan strategi bisnis", "Porter's generic strategies", "Beyond competitive strategy"],
      readings: ["TPGS bab 5"], caseStudy: "Kasus akan didistribusikan", summary: null },
    { id: 6, date: "2026-10-03", dateLabel: "3 Oktober 2026", topic: "Strengthening a Company's Competitive Position",
      subtopics: ["Strategic moves, timing & scope of operations", "Strategi di industri terfragmentasi", "Strategi & evolusi industri"],
      readings: ["TPGS bab 6", "PM bab 9–12", "TPGS Kasus 12"], caseStudy: "TPGS Kasus 12", summary: null },
    { id: 7, date: "2026-10-23", dateLabel: "23 Oktober 2026", topic: "Strategies for Competing in Foreign Markets",
      subtopics: ["Multi-domestic strategy", "Global strategy"],
      readings: ["TPGS bab 7", "PM bab 13"], caseStudy: "Kasus akan didistribusikan", summary: null },
    { id: 8, date: "2026-10-24", dateLabel: "24 Oktober 2026", topic: "Corporate-Level Strategy",
      subtopics: ["Diversifikasi", "Corporate advantage & parenting advantage", "Growth-share matrix"],
      readings: ["TPGS bab 8", "PM bab 14–16", "TPGS Kasus 21"], caseStudy: "TPGS Kasus 21", summary: null },
    { id: 9, date: "2026-11-07", dateLabel: "7 November 2026", topic: "Corporate-Level Strategy (lanjutan)",
      subtopics: ["Analisis strategi perusahaan terdiversifikasi"], readings: ["TPGS Kasus 22"], caseStudy: "TPGS Kasus 22", summary: null },
    { id: 10, date: "2026-11-07", dateLabel: "7 November 2026", topic: "Strategy, Ethics, Social Responsibility & Sustainability",
      subtopics: ["Menghubungkan strategi dengan etika, CSR, dan keberlanjutan lingkungan"],
      readings: ["TPGS bab 9", "TPGS Kasus 31"], caseStudy: "TPGS Kasus 31", summary: null },
    { id: 11, date: "2026-11-20", dateLabel: "20 November 2026", topic: "Strategy Implementation",
      subtopics: ["Kerangka 7S", "Membangun kapabilitas organisasi", "Pendekatan 8S = 7S + Sustainability"],
      readings: ["TPGS bab 10"], caseStudy: "Kasus akan didistribusikan", summary: null },
    { id: 12, date: "2026-11-21", dateLabel: "21 November 2026", topic: "Strategy Implementation (lanjutan) & Evaluasi",
      subtopics: ["Mengelola operasi internal", "Evaluasi & kontrol strategik", "Budaya korporat & kepemimpinan"],
      readings: ["TPGS bab 12", "TPGS Kasus 25"], caseStudy: "TPGS Kasus 25", summary: null }
  ],
  flashcards: [
    { session: 1, front: "Tiga pertanyaan yang didefinisikan oleh strategi perusahaan?", back: "1) Di mana kita bersaing (pasar, segmen, geografi)? 2) Bagaimana kita menciptakan nilai bagi pelanggan? 3) Bagaimana kita mengalahkan pesaing?" },
    { session: 1, front: "Kapan competitive advantage disebut 'sustainable'?", back: "Ketika keunggulan itu bertahan meskipun pesaing berusaha menirunya — biasanya karena ditopang sumber daya & kapabilitas yang sulit ditiru (RBV/VRIO)." },
    { session: 1, front: "Sebutkan lima pendekatan strategi kompetitif (TPGS).", back: "Low-cost provider, broad differentiation, focused low-cost, focused differentiation, dan best-cost provider." },
    { session: 1, front: "Apa beda strategi dan business model?", back: "Strategi menjawab BAGAIMANA bersaing; business model menjawab apakah strategi itu menghasilkan uang — terdiri dari customer value proposition dan profit formula." },
    { session: 1, front: "Apa itu deliberate vs emergent strategy?", back: "Deliberate: bagian strategi yang direncanakan sengaja. Emergent: bagian yang muncul sebagai respons adaptif terhadap kondisi tak terduga. Strategi aktual = gabungan keduanya." },
    { session: 1, front: "Tiga tes untuk strategi yang menang?", back: "1) Fit test — cocok dengan situasi internal & eksternal. 2) Competitive advantage test — menghasilkan keunggulan berkelanjutan. 3) Performance test — meningkatkan kinerja perusahaan." },
    { session: 2, front: "Sebutkan lima tahap proses manajemen strategik.", back: "1) Mengembangkan visi strategis, misi & nilai; 2) menetapkan tujuan; 3) merumuskan strategi; 4) mengeksekusi strategi; 5) memantau, mengevaluasi & mengoreksi." },
    { session: 2, front: "Bedakan visi, misi, dan nilai.", back: "Visi: ke mana perusahaan hendak menuju (masa depan). Misi: siapa kita dan apa yang kita kerjakan sekarang. Nilai: keyakinan & prinsip yang memandu perilaku." },
    { session: 2, front: "Bedakan financial objectives dan strategic objectives.", back: "Financial: target kinerja keuangan (laba, ROI, arus kas). Strategic: target posisi pasar & daya saing (pangsa pasar, kualitas, kepuasan pelanggan). Balanced scorecard menyeimbangkan keduanya." },
    { session: 2, front: "Empat level penyusunan strategi dalam perusahaan?", back: "Corporate strategy (perusahaan multi-bisnis), business strategy, functional strategy, dan operating strategy — semuanya harus selaras." }
  ],
  quizzes: []
};
