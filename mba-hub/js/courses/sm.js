/* ============================================================
   Strategic Management (MAN 5422), SILABUS BARU 2026
   Dr. Rangga Almahendra, S.T., M.M., 3 SKS
   Sumber: "@2026 AOL Course Outline SM MM_JKT SEMBA.docx"
   (disahkan 9 Agustus 2026, Ketua Prodi: Prof. Eduardus Tandelilin)

   PERUBAHAN dari silabus lama:
   - Buku utama: Thompson & Strickland 22nd ed. (bukan TPGS 23rd)
   - Penilaian: UTS 40% · Term Paper 40% · Partisipasi 10% · Group Report 10%
   - Dosen tunggal (bukan team teaching)
   - 6 teaching case + 6 framework presentation, per kelompok
   - Wajib Learning Diary setiap sesi
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
    lecturer: "Dr. Rangga Almahendra, S.T., M.M.",
    lecturerNote: "Silabus baru 2026 · Anda di Kelompok 3",
    sks: 3,
    sessionsTotal: 12,
    hasBook: true,
    tools: [],
    myGroup: 3,
    driveFolder: "https://drive.google.com/drive/folders/1vr9J0e6D9maIlZvmf4cIz8bAQ6irH7GX",
    status: "Silabus baru · materi Sesi 1–2 & 3 kasus siap"
  },

  course: {
    title: "Strategic Management",
    codes: "MAN 5422",
    program: "Magister Business Administration, Universitas Gadjah Mada",
    semester: "Semester 2 · Kelas S51A (MM Jakarta – SEMBA)",
    classCode: "SMJKT",
    lecturer: {
      name: "Dr. Rangga Almahendra, S.T., M.M.",
      dept: "Faculty of Economics and Business, Universitas Gadjah Mada",
      education: "Disahkan 9 Agustus 2026 · Ketua Prodi: Prof. Dr. Eduardus Tandelilin, M.B.A."
    },
    driveLinks: [
      { label: "Folder Strategic Management", url: "https://drive.google.com/drive/folders/1vr9J0e6D9maIlZvmf4cIz8bAQ6irH7GX" },
      { label: "Silabus baru: AOL Course Outline 2026", url: "https://drive.google.com/file/d/1pcPjoar88-NqOwekd007cDOA9VX83p1G/view" },
      { label: "Buku Thompson & Strickland (Crafting & Executing Strategy)", url: "https://drive.google.com/file/d/1YyeB9ZHeppWGwj6N9t1w1RsUEWFpSb0S/view" }
    ],
    assessment: [
      { label: "Ujian tengah semester", weight: 40 },
      { label: "Term Paper (individu, 10–15 hal.)", weight: 40 },
      { label: "Partisipasi", weight: 10 },
      { label: "Group Report", weight: 10 }
    ],
    references: [
      { code: "TS", text: "Thompson, Jr., A.A. & Strickland III, A.J. (2019), Strategic Management: Concepts and Cases, 22nd Ed., McGraw-Hill/Irwin., BUKU UTAMA (ada di Drive)" },
      { code: "GRANT", text: "Grant, R.M. (2010), Contemporary Strategy Analysis, Blackwell., sumber kasus AirAsia (Ch.4) & Manchester United (Ch.6)" },
      { code: "HP", text: "Hamel, G. & Prahalad, C.K. (1994), Competing for the Future, Harvard Business School Press." },
      { code: "P80", text: "Porter, M. (1980), Competitive Strategy, The Free Press." },
      { code: "P85", text: "Porter, M. (1985), Competitive Advantage, The Free Press." },
      { code: "HIA", text: "Handoko, T. Hani, Indarti, N. & Almahendra, R. (2014), Manajemen dalam Berbagai Perspektif, Erlangga. Buku karya dosen pengampu" }
    ],
    objectives: [
      "CO1: Menerjemahkan pengetahuan bisnis menjadi tindakan: menerapkan kerangka strategik untuk menganalisis isu strategis organisasi, dan menyusun solusi holistik berbasis bukti.",
      "CO2: Menyusun strategi bisnis holistik: merancang rencana implementasi yang actionable dengan KPI, timeline, kepemilikan, sumber daya, dan mitigasi risiko.",
      "CO2: Mengevaluasi dampak strategis memakai metrik finansial & non-finansial serta logika risiko/skenario.",
      "Menganalisis masalah bisnis kompleks dan mengembangkan solusi inovatif yang dapat diterapkan (CG2: Critical Thinking).",
      "Menghasilkan dokumen tertulis yang terstruktur & persuasif serta mempresentasikan gagasan secara profesional (CG3).",
      "Menerapkan konsep keberlanjutan termasuk ESG dan SDGs untuk memperbaiki strategi organisasi (CG4: Sustainability Leadership)."
    ]
  },

  /* ---------- KELOMPOK & TUGAS SAYA ---------- */
  myGroupInfo: {
    number: 3,
    members: ["Tifani Puspita", "Dara Astrini Rahayu K", "Richy Fatma Salsabila", "Happy Dinithasari", "Aslih Abnuri (Anda)"],
    duties: [
      { session: 4, date: "2026-09-12", type: "Chapter Presentation", detail: "Bab 3: Evaluating a Company's External Environment" },
      { session: 4, date: "2026-09-12", type: "Case Presentation", detail: "AirAsia (Grant 2010, Ch.4), kasus kompetitif, 2 kelompok berhadapan" },
      { session: 9, date: "2026-11-07", type: "Chapter Presentation", detail: "Bab 10: Building an Organization Capable of Good Strategy Execution" },
      { session: 9, date: "2026-11-07", type: "Framework Presentation", detail: "4 Disciplines of Execution (4DX)" }
    ],
    emailFormat: "SMJKT_Group 3_Aslih_(nama tugas). Contoh: SMJKT_Group 3_Aslih_Case AirAsia",
    caseReportSpec: "Laporan kasus tertulis: .doc/.docx, minimal 1000 kata, A4, spasi 1,5, Times New Roman 12. Hardcopy dikumpulkan pada tanggal ujian.",
    slideSpec: "Teaching case: siapkan presentasi PowerPoint 5 slide berisi temuan kunci. Competing case: presentasi penuh + laporan tertulis yang dipublikasikan ke kelas sebelum presentasi."
  },

  /* ---------- PEMETAAN SILABUS BARU ---------- */
  materialMap: [
    { file: "@2026 AOL Course Outline SM MM_JKT SEMBA.docx", sessions: [1],
      part: "Course syllabus, aturan main, pembagian kelompok & penugasan",
      why: "Sesi 1 (21-08-2026) di silabus baru = \"Introduction · Course syllabus\". Pembagian kelompok dan sesi presentasi ditetapkan pada kuliah pertama ini.",
      confidence: "pasti" },
    { file: "Thompson & Strickland Bab 1", sessions: [2],
      part: "What is Strategy and Why is it Important",
      why: "Silabus baru Sesi 2 (22-08-2026) = Ch.01, dengan Group 1 Chapter Presentation + Framework Eisenhower Matrix.",
      confidence: "pasti" },
    { file: "Grant (2010) Ch.4: AirAsia", sessions: [4],
      part: "Teaching case AirAsia: Kelompok 3 (kelompok Anda) presentasi kasus",
      why: "Silabus baru Sesi 4 (12-09-2026): \"Group 3 Chapter Presentation · Group 3 Case Presentation: Air Asia\" bersama Bab 3 External Environment.",
      confidence: "pasti" },
    { file: "Grant (2010) Ch.6: Manchester United", sessions: [5],
      part: "Teaching case Manchester United: Preparing for Life without Ferguson (Kelompok 4)",
      why: "Silabus baru Sesi 5 (02-10-2026) bersama Bab 4 Resources & Competitive Position.",
      confidence: "pasti" },
    { file: "Kasus Apple iPhone", sessions: [7],
      part: "Case presentation: Kelompok 1, bersama Bab 7 Foreign Markets",
      why: "Silabus baru Sesi 7 mencakup dua tanggal (23 & 24 Okt): Bab 6 (Kelompok 6 + BCG) dan Bab 7 (Kelompok 1 + Case Apple iPhone).",
      confidence: "pasti" },
    { file: "Kasus New York Times", sessions: [8],
      part: "Case presentation: Kelompok 2, bersama Bab 8 Diversification",
      why: "Silabus baru Sesi 8 (07-11-2026).", confidence: "pasti" },
    { file: "Kasus Renault-Nissan", sessions: [11],
      part: "Case presentation: Kelompok 5, bersama Bab 12 Corporate Culture & Leadership",
      why: "Silabus baru Sesi 11 (21-11-2026).", confidence: "pasti" },
    { file: "Kasus Nike in Indonesia", sessions: [12],
      part: "Case presentation: Kelompok 6, bersama Bab 9 Ethics, CSR & Sustainability",
      why: "Silabus baru Sesi 12 (tertulis 23-10-2026. Kemungkinan salah ketik; kemungkinan besar digabung ke sesi terakhir/ujian akhir). Perlu konfirmasi ke dosen.",
      confidence: "sedang (tanggal janggal di silabus)" }
  ],

  sessions: [
    {
      id: 1, date: "2026-08-21", dateLabel: "21 Agustus 2026 · Jumat 19.00–21.30",
      topic: "Introduction & Course Syllabus",
      subtopics: ["Aturan main mata kuliah", "Pembagian kelompok & penugasan", "Metode analisis kasus"],
      readings: ["Silabus baru (AOL Course Outline 2026)"],
      caseStudy: null,
      groupDuty: "Pembagian kelompok & sesi presentasi ditetapkan malam ini",
      summary: [
        {
          heading: "Agenda Pertemuan Pertama dan Keputusan yang Perlu Anda Ambil",
          source: { kind: "ppt", label: "Silabus baru 2026" },
          body: `<p>Sesi pertama bukan sekadar formalitas. Silabus menyebut: <em>"Assignment to groups and sessions
will be done in the first lecture."</em> Artinya <strong>malam ini kelompok dan jadwal presentasi ditetapkan</strong>: keputusan yang mengikat sampai akhir semester. Datang sudah tahu peta jalannya.</p>
<h4 class="sub-h">Empat komponen penilaian dan pergeseran bobotnya</h4>
<p>Silabus baru mengubah bobot penilaian secara drastis dibanding versi lama. Perhatikan:</p>
[[visual:smAssessment]]
<p>Dua komponen menguasai 80% nilai: <strong>UTS (40%)</strong> dan <strong>Term Paper (40%)</strong>. Ini berbeda
dari mata kuliah lain Anda: di OTM partisipasi hanya 10% dan proyek tim 40%, sedangkan di Business Ethics
partisipasi justru 30%. Di SM, <em>partisipasi hanya 10%</em>, sehingga energi terbesar sebaiknya diarahkan ke
ujian dan makalah individu. Namun perlu diperhatikan, silabus juga menegaskan <em>"Students failing to participate in their teams will lose the marks for that
piece of work"</em>: tidak berkontribusi di kelompok berarti kehilangan nilai untuk bagian tersebut.</p>
<h4 class="sub-h">Tiga jenis penugasan yang harus dibedakan</h4>
<ul>
<li><strong>Teaching Case Assignment</strong>: setiap kelompok menyiapkan kasus yang ditentukan untuk sesi
bersangkutan. Kelompok bisa <em>dipanggil acak</em> untuk presentasi. Siapkan <strong>5 slide</strong> berisi temuan
kunci. Artinya: semua kelompok harus siap, bukan hanya yang dijadwalkan.</li>
<li><strong>Competing Case Assignment</strong>: ada <strong>tiga sesi kasus kompetitif</strong> di mana
<em>dua kelompok berhadapan</em> mempresentasikan analisis dan rekomendasi atas kasus yang sama. Wajib menyerahkan
laporan tertulis <em>sebelum</em> presentasi, dan laporan itu <strong>dipublikasikan ke seluruh kelas</strong> untuk
dikomentari dan dikritik. Mahasiswa yang tidak presentasi wajib mengajukan pertanyaan sebelum sesi, dan <em>pertanyaan itulah yang menjadi dasar nilai partisipasi</em>.</li>
<li><strong>Strategic Framework Presentation</strong>: tiap kelompok mencari <em>satu kerangka/model manajemen
strategik dari internet</em> yang relevan dengan bab yang sedang dibahas, lalu menjelaskan dimensi & ukurannya,
bagaimana dimensi itu didefinisikan, dan manfaatnya dalam konteks bisnis internasional. Laporan tertulis 2 halaman +
presentasi 15 menit, dimulai sejak Sesi 2. Laporan framework dikumpulkan pada sesi ujian akhir.</li>
</ul>
<h4 class="sub-h">Learning Diary: kewajiban yang paling mudah terlewat</h4>
<div class="case-box"><p><strong>📌 Wajib setiap sesi, tanpa kecuali.</strong> Silabus: <em>"All students are required
to create a learning diary at the end of each session."</em> Isinya <em>bukan</em> catatan kuliah mentah, melainkan
<strong>esai reflektif pendek</strong> berisi argumen utama dan poin penting diskusi, <em>ditambah interpretasi dan
pertanyaan Anda sendiri</em> atas topik itu. Dibagikan di <strong>grup WhatsApp kelas</strong>.</p>
<p>Praktisnya: sisihkan 15 menit tepat setelah kelas. Aplikasi ini punya menu <b>Catatan Kelas</b> dengan enam kolom
terstruktur, isi di sana, lalu ubah kolom "Poin utama" + "Pertanyaan saya" menjadi paragraf reflektif untuk
di-posting ke WhatsApp.</p></div>
<h4 class="sub-h">Term Paper: bobot 40% yang perlu direncanakan sejak awal</h4>
<p>Makalah individu 10–15 halaman (di luar referensi & lampiran) tentang <strong>organisasi nyata atau kasus industri
yang terdokumentasi baik</strong>. Harus: mendiagnosis masalah strategis memakai konsep mata kuliah, mengusulkan
strategi holistik, menerjemahkannya ke rencana implementasi yang actionable, dan mengevaluasi dampak strategisnya.
Struktur wajib (gunakan judul-judul ini persis):</p>
[[visual:smTermPaper]]
<p>Dikumpulkan pada <strong>sesi ujian akhir</strong>. Karena bobotnya 40% dan menuntut data nyata, memilih
perusahaan sejak sekarang jauh lebih aman daripada mencari di bulan Desember.</p>
<h4 class="sub-h">Format email & penamaan berkas</h4>
<p>Silabus mengatur ini secara spesifik, kesalahan format bisa membuat kiriman Anda tidak terbaca:</p>
<p><code>SMJKT_(nomor kelompok)_(nama depan)_(nama tugas)</code><br>
Contoh untuk Anda: <code>SMJKT_Group 3_Aslih_Case AirAsia</code></p>
<p>Nama <em>berkas lampiran</em> harus mengikuti pola yang sama:
<code>SMJKT_Group 3_Aslih_Case AirAsia.pptx</code></p>
<div class="key-box"><strong>💡 Bawa ke kelas malam ini:</strong> (1) preferensi sesi presentasi kelompok, semakin awal
semakin ringan bebannya di masa UTS; (2) 2–3 kandidat perusahaan untuk term paper; (3) pertanyaan tentang tanggal
Sesi 12 yang di silabus tertulis 23-10-2026 padahal berada setelah Sesi 11 (21-11). Kemungkinan salah ketik.</div>`
        },
        {
          heading: "Cara Menganalisis Kasus: Metode Resmi Dosen",
          source: { kind: "ppt", label: "Silabus Appendix 3" },
          body: `<p>Silabus melampirkan panduan analisis kasus milik dosen sendiri. Kuasai struktur ini sekarang karena
<strong>seluruh presentasi kasus, laporan tertulis, dan kemungkinan besar soal ujian akan dinilai dengan kerangka
ini</strong>.</p>
<p>Definisi kasus menurut silabus: <em>"a reportorial study of an organization under stress"</em>: laporan tentang
organisasi yang sedang tertekan, dilihat dari posisi orang di luar organisasi. Kasus yang baik berfokus pada
<em>ancaman atau peluang besar</em> yang dihadapi manajemen, dan memuat cukup data untuk dievaluasi.</p>
<h4 class="sub-h">Empat komponen wajib analisis kasus</h4>
[[visual:smCaseMethod]]
<ul>
<li><strong>1. The Problem.</strong> Masalah = <em>penghalang</em> yang menghambat organisasi mencapai
<em>tujuannya</em>. Dua kata kuncinya: <em>goals</em> (pangsa pasar, pergeseran sikap konsumen, posisi kanal
distribusi, pertumbuhan penjualan, citra, positioning produk, kadang hanya tersirat dalam kasus) dan
<em>barrier</em> (aksi kompetitor, perubahan lingkungan ekonomi/politik/sosial, atau lemahnya koordinasi internal
maupun di kanal distribusi).</li>
<li><strong>2. The Alternatives.</strong> Sekumpulan strategi yang bersaing untuk menyelesaikan masalah. Tiap
alternatif memuat: pernyataan tujuan strategis, total sumber daya yang dikerahkan, posisi produk/pasar perusahaan,
dan distribusi sumber daya ke elemen bauran pemasaran. Beri <strong>judul</strong> pada tiap alternatif agar
karakternya langsung tertangkap (mis. "Ekspansi Agresif Pangsa Pasar", "Retrenchment", "Repositioning").
<em>Peringatan dosen:</em> saat menjelaskan alternatif, <strong>jangan</strong> menyertakan argumen pro/kontra. Itu mengaburkan kejelasan dan akan berulang di bagian Issues.</li>
<li><strong>3. The Issues.</strong> Inilah tempat kekuatan-kekuatan penyebab dievaluasi. Rumuskan issues sebagai
<em>pertanyaan eksplisit</em>, dari area: total potensi pasar/penjualan dan penentunya; kekuatan & arah kompetitor
beserta efektivitas strateginya; area keunggulan diferensial perusahaan; kemungkinan respons konsumen terhadap
tindakan perusahaan; kemungkinan respons kompetitor; potensi konflik internal atau di kanal distribusi.</li>
<li><strong>4. The Conclusion.</strong> Mensintesis jawaban atas issues, menyusunnya bertingkat untuk menunjukkan
<em>mengapa satu alternatif unggul atas semua yang lain</em>. Bila data finansial memadai, <strong>bangun argumen
kuantitatif</strong>: jangan berhenti di narasi.</li>
</ul>
<div class="key-box"><strong>💡 Intinya:</strong> Problem (goals + barrier) → Alternatives (diberi judul, tanpa
argumen) → Issues (pertanyaan eksplisit) → Conclusion (deduksi + angka). Pakai persis empat judul ini di laporan
kasus Anda; dosen menulis panduannya sendiri, jadi ia akan mencarinya.</div>`
        }
      ]
    },
    {
      id: 2, date: "2026-08-22", dateLabel: "22 Agustus 2026 · Sabtu 09.00–11.30",
      topic: "What is Strategy and Why is it Important?",
      subtopics: ["Definisi strategi", "Competitive advantage", "Business model", "Tiga tes strategi yang menang"],
      readings: ["Thompson & Strickland Bab 1"],
      caseStudy: "Diskusi kasus pembuka, lihat menu Studi Kasus",
      groupDuty: "Kelompok 1: Chapter Presentation Bab 1 + Framework Presentation: Eisenhower Matrix",
      summary: [
        {
          heading: "Definisi Strategi dan Batasannya",
          source: { kind: "book", label: "Thompson & Strickland Bab 1" },
          body: `<p>Bab pembuka Thompson & Strickland dimulai dengan satu klaim: <strong>strategi sebuah perusahaan
adalah rangkaian langkah kompetitif dan pendekatan bisnis yang dipakai manajer untuk menarik dan memuaskan
pelanggan, bersaing secara efektif, memperkuat kinerja, dan mencapai tujuan organisasi.</strong></p>
<p>Namun definisi itu terlalu mudah dihafal tanpa dipahami. Yang penting adalah kalimat berikutnya:
<strong>strategi selalu tentang bersaing secara <em>berbeda</em></strong>: melakukan hal yang berbeda dari pesaing,
atau melakukan hal yang sama dengan cara yang berbeda. Kalau langkah Anda bisa disalin persis oleh kompetitor besok
pagi, itu bukan strategi; itu praktik operasional biasa.</p>
<h4 class="sub-h">Tiga pertanyaan yang dijawab sebuah strategi</h4>
[[visual:smThreeQuestions]]
<p>Perhatikan bahwa ketiganya adalah <em>pilihan</em>. Dan setiap pilihan berarti <strong>mengatakan tidak</strong>
pada sesuatu: memilih segmen berarti melepas segmen lain; memilih bersaing lewat kecepatan berarti menerima biaya
lebih tinggi. Perusahaan yang "melayani semua orang dengan segala cara" sebenarnya tidak punya strategi.</p>
<h4 class="sub-h">Lima pendekatan strategi kompetitif</h4>
<p>Buku memetakan pilihan strategi ke dalam lima kategori. Ini kerangka yang akan dibahas mendalam di Bab 5
(Sesi 6), tetapi diperkenalkan sejak Bab 1, dan sering menjadi soal ujian:</p>
[[visual:smFiveStrategies]]
<div class="key-box"><strong>💡 Intinya:</strong> Strategi = pilihan sadar untuk bersaing secara berbeda, menjawab
di mana bersaing, bagaimana menciptakan nilai, dan bagaimana mengalahkan pesaing. Lima pendekatannya: low-cost
provider, broad differentiation, focused low-cost, focused differentiation, best-cost provider.</div>`
        },
        {
          heading: "Competitive Advantage: Inti Seluruh Mata Kuliah",
          source: { kind: "book", label: "Thompson & Strickland Bab 1" },
          body: `<p>Kalau hanya satu konsep yang boleh Anda bawa dari mata kuliah ini, inilah konsepnya.</p>
<p><strong>Competitive advantage</strong> muncul ketika perusahaan memenuhi kebutuhan pelanggan <em>lebih efektif</em>
(pelanggan bersedia membayar lebih) atau <em>lebih efisien</em> (perusahaan bisa menawarkan harga lebih rendah pada
laba yang sama) dibanding pesaingnya.</p>
<p>Yang membuatnya bernilai bukan keunggulan itu sendiri, melainkan <strong>daya tahannya</strong>. Buku menyebut
<em>sustainable competitive advantage</em>: keunggulan yang bertahan <strong>meskipun pesaing berusaha keras
menirunya</strong>. Ini pembeda antara keberuntungan sesaat dan strategi sesungguhnya.</p>
<h4 class="sub-h">Mengapa sebuah keunggulan dapat bertahan</h4>
<p>Buku menunjukkan empat sumber daya tahan, dan tiap sumber akan diperdalam di bab berikutnya:</p>
<ul>
<li><strong>Sumber daya & kapabilitas yang sulit ditiru</strong>: reputasi, budaya, jaringan, data pelanggan
(diperdalam di Bab 4, Sesi 5).</li>
<li><strong>Sistem aktivitas yang saling mengunci</strong>: pesaing bisa meniru satu aktivitas, tetapi tidak seluruh
sistemnya sekaligus.</li>
<li><strong>Posisi yang menciptakan trade-off bagi peniru</strong>: meniru berarti pesaing harus mengorbankan
posisi yang sudah ia miliki.</li>
<li><strong>Perbaikan yang lebih cepat daripada laju peniruan</strong>: bergerak terus sehingga peniru selalu
tertinggal satu langkah.</li>
</ul>
<div class="case-box"><p><strong>📌 Uji cepat di kelas:</strong> ketika Kelompok 1 mempresentasikan Bab 1, ajukan
pertanyaan ini pada contoh perusahaan yang mereka pakai: <em>"Kalau pesaing terbesar mereka punya modal tak
terbatas, berapa lama keunggulan itu bisa disalin?"</em> Kalau jawabannya "beberapa bulan", itu bukan sustainable
competitive advantage. Pertanyaan seperti ini persis yang dicari untuk nilai partisipasi.</p></div>
<div class="key-box"><strong>💡 Intinya:</strong> Competitive advantage = memenuhi kebutuhan pelanggan lebih efektif
atau lebih efisien dari pesaing. Disebut <em>sustainable</em> bila bertahan meski ditiru. Sumbernya: sumber daya
sulit ditiru, sistem aktivitas terkunci, trade-off bagi peniru, dan kecepatan perbaikan.</div>`
        },
        {
          heading: "Strategi Selalu Berevolusi: Deliberate vs Emergent",
          source: { kind: "book", label: "Thompson & Strickland Bab 1" },
          body: `<p>Salah satu miskonsepsi terbesar tentang strategi: bahwa strategi adalah dokumen yang disusun sekali
setahun lalu dijalankan. Buku menegaskan sebaliknya: <strong>strategi sebuah perusahaan adalah sesuatu yang
berkembang (evolving)</strong>.</p>
[[visual:smDeliberateEmergent]]
<p><strong>Deliberate strategy</strong> (disebut juga <em>proactive strategy</em>) adalah bagian yang direncanakan
sengaja: hasil analisis, rapat, dan keputusan sadar manajemen. <strong>Emergent strategy</strong> (atau
<em>reactive/adaptive strategy</em>) adalah bagian yang muncul sebagai respons terhadap perkembangan tak terduga, teknologi baru, langkah pesaing, perubahan regulasi, krisis.</p>
<p>Strategi aktual perusahaan mana pun adalah <strong>gabungan keduanya</strong>. Manajer yang baik tidak berpegang
kaku pada rencana, tetapi juga tidak sekadar bereaksi. Ia mengenali kapan perkembangan baru menuntut perubahan
arah, dan kapan justru menuntut kesabaran.</p>
<div class="case-box"><p><strong>📌 Contoh untuk didiskusikan:</strong> Netflix. Rencana awalnya (deliberate)
adalah menyewakan DVD lewat pos untuk mengalahkan Blockbuster. Streaming muncul sebagai respons terhadap perubahan
bandwidth dan perilaku konsumen (emergent). Produksi konten orisinal muncul lagi sebagai respons ketika pemilik
konten mulai menarik lisensinya (emergent), dan kini menjadi inti strategi yang deliberate. Pertanyaan menarik:
<em>berapa persen keberhasilan Netflix hasil perencanaan, berapa persen hasil adaptasi?</em></p></div>
<div class="key-box"><strong>💡 Intinya:</strong> Strategi aktual = deliberate (direncanakan) + emergent (adaptif).
Strategi berevolusi karena kondisi berubah dan karena manajer belajar. Rencana yang tidak pernah berubah biasanya
tanda manajemen tidak memperhatikan pasar.</div>`
        },
        {
          heading: "Strategi dan Business Model: Perbedaan yang Sering Tertukar",
          source: { kind: "book", label: "Thompson & Strickland Bab 1" },
          body: `<p>Pertanyaan yang hampir pasti muncul di kelas atau ujian: <em>apa beda strategi dan business
model?</em></p>
<p><strong>Strategi</strong> menjawab: <em>bagaimana kita akan bersaing dan menang?</em><br>
<strong>Business model</strong> menjawab: <em>apakah strategi itu benar-benar menghasilkan uang?</em></p>
<p>Buku memecah business model menjadi dua bagian:</p>
[[visual:smBusinessModel]]
<ul>
<li><strong>Customer value proposition</strong>: nilai apa yang diberikan kepada pelanggan, dan mengapa mereka
memilih kita. Ini menjawab kebutuhan pelanggan pada harga yang mereka anggap sepadan.</li>
<li><strong>Profit formula</strong>: struktur biaya dan margin yang memungkinkan perusahaan menguntungkan sambil
menyampaikan proposisi nilai itu. Rumus dasarnya: <em>V − P</em> (nilai yang dirasakan dikurangi harga) adalah
nilai bagi pelanggan; <em>P − C</em> (harga dikurangi biaya) adalah margin bagi perusahaan.</li>
</ul>
<p>Implikasi pentingnya: <strong>sebuah perusahaan bisa punya strategi yang jelas tetapi business model yang
rusak</strong>: proposisi nilainya menarik, tetapi struktur biayanya tidak memungkinkan untung. Banyak startup
Indonesia yang tumbuh cepat lalu tumbang berada persis di posisi ini.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Strategi = bagaimana bersaing. Business model = apakah cara bersaing
itu menghasilkan uang, terdiri dari customer value proposition + profit formula. Strategi bagus + model rusak =
kebangkrutan yang terencana rapi.</div>`
        },
        {
          heading: "Tiga Tes Strategi yang Menang",
          source: { kind: "book", label: "Thompson & Strickland Bab 1" },
          body: `<p>Bagaimana menilai apakah sebuah strategi bagus atau tidak? Buku memberi <strong>tiga tes</strong>
yang harus dilewati semuanya, bukan salah satu. Ini kerangka evaluasi paling praktis di seluruh bab, dan sangat
mungkin menjadi soal ujian maupun alat menilai kasus.</p>
[[visual:smThreeTests]]
<ul>
<li><strong>1. The Fit Test. Apakah strategi ini cocok dengan situasi perusahaan?</strong> Ada tiga lapis kecocokan:
<em>external fit</em> (cocok dengan kondisi industri & persaingan, tren pasar, kebutuhan pelanggan);
<em>internal fit</em> (cocok dengan sumber daya dan kapabilitas yang dimiliki); dan <em>dynamic fit</em> (mampu
menyesuaikan diri saat kondisi berubah). Strategi yang cocok hanya di satu lapis biasanya gagal.</li>
<li><strong>2. The Competitive Advantage Test. Apakah strategi ini menghasilkan keunggulan kompetitif yang
berkelanjutan?</strong> Semakin besar dan semakin tahan lama keunggulan yang dihasilkan, semakin kuat strategi itu.
Strategi yang hanya menyamai pesaing tidak lulus tes ini.</li>
<li><strong>3. The Performance Test. Apakah strategi ini menghasilkan kinerja yang baik?</strong> Dua jenis
indikator: <em>profitabilitas & kekuatan finansial</em>, dan <em>kekuatan kompetitif serta posisi pasar</em>.
Strategi yang terdengar cerdas tetapi tidak memperbaiki angka bukan strategi yang menang.</li>
</ul>
<p>Gunakan tiga tes ini sebagai <strong>alat bantu bagian "Conclusion"</strong> pada analisis kasus: setelah
menimbang issues, tunjukkan alternatif mana yang lulus ketiga tes dan mengapa yang lain gagal di salah satunya.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Fit test (eksternal + internal + dinamis) · Competitive advantage
test (berkelanjutan?) · Performance test (angka membaik?). Strategi menang harus lulus <em>ketiganya</em>.</div>`
        },
        {
          heading: "Mengapa Merumuskan & Mengeksekusi Strategi Itu Penting",
          source: { kind: "book", label: "Thompson & Strickland Bab 1" },
          body: `<p>Bagian penutup bab menjawab pertanyaan "mengapa mata kuliah ini ada". Tiga alasannya:</p>
<ul>
<li><strong>Strategi yang jelas memberi arah.</strong> Tanpa strategi, keputusan harian diambil sendiri-sendiri oleh
tiap fungsi, dan organisasi bergerak ke arah yang saling meniadakan.</li>
<li><strong>Strategi menentukan kinerja.</strong> Buku menyatakan hubungan langsung: perusahaan dengan strategi yang
dirumuskan dan dieksekusi dengan baik secara konsisten mengungguli yang tidak. Kinerja bukan kebetulan.</li>
<li><strong>Perumusan dan eksekusi adalah tugas manajerial, bukan tugas konsultan.</strong> Buku menekankan
<em>crafting</em> dan <em>executing</em> sebagai dua sisi yang tak terpisahkan, dan eksekusi akan mengisi separuh
kedua mata kuliah ini (Bab 10, 11, 12 di Sesi 9, 10, 11).</li>
</ul>
<p>Perhatikan judul buku ini: <em>Crafting and Executing Strategy</em>. Strategi bagus yang dieksekusi buruk
menghasilkan kegagalan yang sama dengan strategi buruk. Inilah sebabnya silabus mengalokasikan tiga sesi penuh untuk
eksekusi.</p>
<h4 class="sub-h">Framework pendamping sesi ini: Eisenhower Matrix</h4>
<p>Kelompok 1 membawakan <strong>Eisenhower Matrix</strong> sebagai framework pendamping Bab 1. Matriks ini
mengklasifikasi pekerjaan pada dua sumbu, yaitu <em>penting</em> vs <em>mendesak</em>:</p>
[[visual:smEisenhower]]
<p>Relevansinya dengan strategi: <strong>pekerjaan strategis hampir selalu penting tetapi tidak mendesak</strong>
(kuadran 2), sehingga terus kalah oleh urusan mendesak yang tidak penting (kuadran 3). Inilah alasan struktural
mengapa banyak perusahaan tidak pernah sempat berstrategi. Pertanyaan bagus untuk Kelompok 1: <em>"bagaimana model
ini diterapkan pada level organisasi, bukan hanya individu, dan apa ukurannya?"</em> (silabus meminta tiap framework
dijelaskan dimensi, definisi, dan manfaatnya dalam konteks bisnis internasional).</p>
<div class="key-box"><strong>💡 Intinya:</strong> Strategi penting karena memberi arah, menentukan kinerja, dan
merupakan tugas manajer sendiri. Crafting tanpa executing = nol. Eisenhower Matrix menjelaskan mengapa pekerjaan
strategis (penting–tidak mendesak) selalu terancam tergeser.</div>`
        }
      ]
    },
    { id: 3, date: "2026-09-12", dateLabel: "12 September 2026", topic: "Leading the Process of Crafting and Executing Strategy",
      subtopics: ["Lima tahap proses manajemen strategik", "Visi, misi & nilai", "Tujuan & balanced scorecard", "Corporate governance"],
      readings: ["Thompson & Strickland Bab 2"], caseStudy: null,
      groupDuty: "Kelompok 2: Chapter Presentation Bab 2 + Framework: Structure-Conduct-Performance (SCP)", summary: null },
    { id: 4, date: "2026-09-12", dateLabel: "12 September 2026", topic: "Evaluating a Company's External Environment",
      subtopics: ["PESTEL", "Five Forces", "Driving forces", "Strategic group mapping", "Key success factors"],
      readings: ["Thompson & Strickland Bab 3", "Grant (2010) Ch.4: AirAsia"], caseStudy: "AirAsia (Kelompok 3, kelompok Anda)",
      groupDuty: "⭐ Kelompok 3 (kelompok Anda): Chapter Presentation Bab 3 + Case Presentation AirAsia", summary: null },
    { id: 5, date: "2026-10-02", dateLabel: "2 Oktober 2026", topic: "Evaluating a Company's Resources and Competitive Position",
      subtopics: ["SWOT", "Resource-based view", "VRIN/VRIO", "Value chain", "Competitive strength assessment"],
      readings: ["Thompson & Strickland Bab 4", "Grant (2010) Ch.6: Manchester United"], caseStudy: "Manchester United: Preparing for Life without Ferguson",
      groupDuty: "Kelompok 4: Chapter Presentation Bab 4 + Case Presentation Manchester United", summary: null },
    { id: 6, date: "2026-10-03", dateLabel: "3 Oktober 2026", topic: "The Five Generic Competitive Strategies",
      subtopics: ["Low-cost provider", "Broad differentiation", "Focused strategies", "Best-cost provider"],
      readings: ["Thompson & Strickland Bab 5"], caseStudy: null,
      groupDuty: "Kelompok 5: Chapter Presentation Bab 5 + Framework: Benchmarking Techniques", summary: null },
    { id: 7, date: "2026-10-23", dateLabel: "23–24 Oktober 2026", topic: "Supplementing the Chosen Competitive Strategy & Competing in Foreign Markets",
      subtopics: ["Strategic moves & timing", "Scope of operations", "Multidomestic vs global strategy", "Masuk pasar asing"],
      readings: ["Thompson & Strickland Bab 6", "Thompson & Strickland Bab 7"], caseStudy: "Apple iPhone",
      groupDuty: "Kelompok 6: Bab 6 + Framework BCG (23 Okt) · Kelompok 1: Bab 7 + Case Apple iPhone (24 Okt)", summary: null },
    { id: 8, date: "2026-11-07", dateLabel: "7 November 2026", topic: "Diversification Strategies for Managing a Group of Businesses",
      subtopics: ["Kapan diversifikasi masuk akal", "Related vs unrelated", "Evaluasi portofolio bisnis"],
      readings: ["Thompson & Strickland Bab 8"], caseStudy: "New York Times",
      groupDuty: "Kelompok 2: Chapter Presentation Bab 8 + Case Presentation New York Times", summary: null },
    { id: 9, date: "2026-11-07", dateLabel: "7 November 2026", topic: "Building an Organization Capable of Good Strategy Execution",
      subtopics: ["Staffing", "Membangun kapabilitas inti", "Struktur organisasi yang mendukung strategi"],
      readings: ["Thompson & Strickland Bab 10"], caseStudy: null,
      groupDuty: "⭐ Kelompok 3 (kelompok Anda): Chapter Presentation Bab 10 + Framework: 4 Disciplines of Execution (4DX)", summary: null },
    { id: 10, date: "2026-11-20", dateLabel: "20 November 2026", topic: "Managing Internal Operations",
      subtopics: ["Alokasi sumber daya", "Kebijakan & prosedur", "Process management tools", "Sistem informasi & imbalan"],
      readings: ["Thompson & Strickland Bab 11"], caseStudy: null,
      groupDuty: "Kelompok 4: Chapter Presentation Bab 11 + Framework: Agile Management & Lean Start Up", summary: null },
    { id: 11, date: "2026-11-21", dateLabel: "21 November 2026", topic: "Corporate Culture and Leadership",
      subtopics: ["Budaya yang mendukung strategi", "Budaya tidak sehat", "Kepemimpinan eksekusi strategi"],
      readings: ["Thompson & Strickland Bab 12"], caseStudy: "Renault-Nissan",
      groupDuty: "Kelompok 5: Chapter Presentation Bab 12 + Case Presentation Renault-Nissan", summary: null },
    { id: 12, date: null, dateLabel: "Tanggal perlu dikonfirmasi (silabus tertulis 23-10-2026)", topic: "Ethical Business Strategies, Social Responsibility & Environmental Sustainability",
      subtopics: ["Strategi & etika", "CSR", "Keberlanjutan lingkungan", "ESG & SDGs"],
      readings: ["Thompson & Strickland Bab 9"], caseStudy: "Nike in Indonesia",
      groupDuty: "Kelompok 6: Chapter Presentation Bab 9 + Case Presentation Nike Indonesia", summary: null }
  ],

  /* ============================================================
     STUDI KASUS, format teaching case ala HBS
     Ditulis sebagai case primer dari sumber publik untuk persiapan
     kelas. Untuk kasus yang ditugaskan silabus (AirAsia), bacaan
     resminya tetap Grant (2010) Ch.4: primer ini mempercepat
     pemahaman, bukan menggantikannya.
     ============================================================ */
  cases: [
    {
      id: "airasia",
      title: "AirAsia: \"Now Everyone Can Fly\"",
      subtitle: "Dapatkah maskapai berbiaya terendah di dunia mempertahankan keunggulannya?",
      forSession: 4,
      badge: "⭐ Kasus Kelompok 3",
      officialSource: "Bacaan resmi: Grant, R.M. (2010), Contemporary Strategy Analysis, Bab 4",
      decisionMaker: "Tony Fernandes, Group CEO AirAsia",
      decisionPoint: "Awal 2010, menjaga keunggulan biaya di tengah ekspansi regional dan taruhan long-haul AirAsia X",
      readingTime: 14,
      relevance: "Sesi 2 (apa itu strategi & competitive advantage) · Sesi 4 (analisis lingkungan eksternal) · Sesi 6 (low-cost provider strategy)",
      sections: [
        { heading: "Titik Awal: Satu Ringgit untuk Sebuah Maskapai",
          body: `<p>Pada Desember 2001, Tony Fernandes, mantan eksekutif Warner Music yang tidak pernah menjalankan
maskapai, membeli AirAsia dari konglomerat milik pemerintah Malaysia, DRB-HICOM, seharga <strong>satu ringgit</strong>
(sekitar 26 sen dolar AS). Harga simbolis itu datang dengan syarat: Fernandes dan mitranya lewat kendaraan investasi
Tune Air harus menanggung utang maskapai yang menumpuk sekitar <strong>RM40 juta</strong> (±US$11 juta).</p>
<p>Waktunya tidak bisa lebih buruk. Serangan 11 September baru berlalu tiga bulan; industri penerbangan global sedang
runtuh; maskapai-maskapai besar memangkas rute dan memberhentikan karyawan. AirAsia sendiri hanya mengoperasikan dua
pesawat Boeing 737-300 tua dan melayani segelintir rute domestik Malaysia dengan kinerja yang jauh dari
menguntungkan.</p>
<p>Fernandes tidak berencana memperbaiki maskapai lama itu. Ia berencana menggantinya dengan model bisnis yang sama
sekali berbeda, model yang telah terbukti di Amerika lewat Southwest Airlines dan di Eropa lewat Ryanair, tetapi
belum pernah dijalankan secara serius di Asia Tenggara: <strong>penerbangan berbiaya sangat rendah untuk orang yang
sebelumnya tidak pernah naik pesawat</strong>. Slogannya menjadi identitas perusahaan: <em>"Now Everyone Can
Fly."</em></p>
<p>Delapan tahun kemudian, pada 2009, AirAsia dinobatkan Skytrax sebagai <em>World's Best Low-Cost Airline</em>: gelar yang kemudian dipertahankannya bertahun-tahun berturut-turut. Maskapai yang dibeli seharga satu ringgit itu
telah menerbangkan puluhan juta penumpang setahun, mengoperasikan lebih dari 80 pesawat, dan memiliki afiliasi di
Thailand, Indonesia, dan Filipina. Yang lebih mencolok bagi para analis: <strong>biaya per kursi-kilometer
(CASK)-nya termasuk yang terendah yang pernah tercatat di industri penerbangan dunia.</strong></p>` },

        { heading: "Anatomi Keunggulan Biaya",
          body: `<p>Keunggulan biaya AirAsia bukan hasil satu keputusan besar, melainkan akumulasi puluhan pilihan
yang saling menguatkan. Grant (2010) memetakannya sebagai berikut:</p>
<h4 class="sub-h">1. Armada satu jenis</h4>
<p>Setelah sempat mengoperasikan Boeing 737, AirAsia melakukan pemesanan besar-besaran <strong>Airbus A320</strong>
pada 2005 dan menstandarkan seluruh armadanya pada satu tipe. Konsekuensinya berantai: satu jenis pelatihan pilot,
satu jenis pelatihan teknisi, satu stok suku cadang, satu prosedur perawatan. A320 juga lebih hemat bahan bakar
per kursi dan berkapasitas lebih besar daripada 737-300 yang digantikannya.</p>
<h4 class="sub-h">2. Utilisasi pesawat yang ekstrem</h4>
<p>Pesawat hanya menghasilkan uang ketika terbang. AirAsia menekan <em>turnaround time</em>: waktu antara mendarat
dan lepas landas kembali, hingga sekitar <strong>25 menit</strong>, jauh di bawah standar maskapai penuh layanan
yang biasanya 45–60 menit. Hasilnya, tiap pesawat terbang sekitar <strong>12 jam per hari</strong>, dibandingkan
sekitar 8 jam pada maskapai konvensional di kawasan yang sama. Biaya tetap pesawat tersebar ke lebih banyak
penerbangan.</p>
<h4 class="sub-h">3. Point-to-point, bukan hub-and-spoke</h4>
<p>AirAsia menolak model hub-and-spoke yang mengharuskan penumpang transit dan menuntut koordinasi jadwal yang rumit.
Tanpa koneksi antarpenerbangan, tidak ada bagasi yang harus dipindahkan, tidak ada penumpang yang harus ditunggu,
dan keterlambatan tidak menular ke penerbangan lain.</p>
<h4 class="sub-h">4. Tanpa layanan tambahan, tetapi dijual kembali</h4>
<p>Tidak ada makanan gratis, tidak ada hiburan dalam pesawat, tidak ada program frequent flyer di masa awal,
konfigurasi kursi kelas tunggal berkepadatan tinggi. Namun yang penting bukan sekadar penghapusan layanan itu:
setiap layanan yang dihapus <strong>dijual kembali sebagai pilihan berbayar</strong>: makanan, bagasi, pemilihan
kursi, asuransi. Pendapatan tambahan (<em>ancillary revenue</em>) ini menjadi penopang margin yang penting.</p>
<h4 class="sub-h">5. Distribusi langsung</h4>
<p>AirAsia menjual mayoritas tiketnya langsung lewat internet dan pusat panggilan sendiri, memangkas komisi agen
perjalanan dan biaya sistem reservasi global (GDS) yang menjadi beban besar maskapai konvensional. Ini juga
memberi AirAsia data pelanggan secara langsung.</p>
<h4 class="sub-h">6. Bandara sekunder & fasilitas murah</h4>
<p>AirAsia beroperasi dari terminal berbiaya rendah, mula-mula LCCT di Kuala Lumpur, kemudian klia2, dengan biaya
kebandarudaraan yang jauh lebih rendah daripada terminal utama, dan memanfaatkan bandara sekunder di banyak kota
tujuan.</p>
<h4 class="sub-h">7. Produktivitas karyawan</h4>
<p>Struktur organisasi yang datar, kru yang menjalankan beberapa peran (termasuk membersihkan kabin saat
turnaround), dan skema imbalan berbasis kinerja membuat rasio karyawan per pesawat AirAsia berada jauh di bawah
maskapai penuh layanan.</p>
<p>Grant menekankan poin penting: <strong>satu per satu, tidak ada praktik ini yang rahasia</strong>. Semuanya bisa
dibaca di laporan tahunan dan ditiru pesaing. Yang sulit ditiru adalah <em>keseluruhan sistemnya sekaligus</em>,
terutama bagi maskapai petahana yang sudah terikat armada campuran, kontrak serikat pekerja, jaringan hub, dan
merek yang menjanjikan layanan penuh.</p>` },

        { heading: "Ekspansi: Regional dan Jarak Jauh",
          body: `<p>Dengan model yang terbukti di Malaysia, AirAsia menghadapi pertanyaan klasik perusahaan yang
berhasil: <em>ke mana tumbuh berikutnya?</em> Jawabannya bergerak di dua arah sekaligus.</p>
<p><strong>Arah pertama: replikasi regional.</strong> Regulasi penerbangan Asia Tenggara umumnya mensyaratkan
kepemilikan mayoritas lokal, sehingga AirAsia tidak bisa sekadar membuka cabang. Solusinya adalah membentuk
<em>associate airlines</em>: Thai AirAsia (2003), Indonesia AirAsia (2004), kemudian Filipina, India, dan Jepang, dengan mitra lokal sebagai pemegang saham mayoritas, sementara AirAsia menyediakan merek, sistem, dan keahlian
operasional. Struktur ini memungkinkan pertumbuhan cepat dengan modal terbatas, tetapi menimbulkan pertanyaan
tentang pengendalian kualitas dan konsolidasi keuangan.</p>
<p><strong>Arah kedua: jarak jauh.</strong> Pada 2007 diluncurkan <strong>AirAsia X</strong>, upaya menerapkan model
berbiaya rendah pada penerbangan jarak jauh menuju Australia, Tiongkok, dan kemudian Eropa. Ini adalah taruhan yang
jauh lebih berani: sejarah industri penuh dengan kegagalan LCC jarak jauh (Laker Airways, Skytrain, dan lainnya).
Alasannya struktural, banyak sumber keunggulan biaya LCC melemah pada rute panjang. Utilisasi pesawat sudah tinggi
secara alamiah; turnaround cepat kehilangan artinya pada penerbangan 8 jam; penumpang jarak jauh menuntut layanan
yang tidak bisa dihapus sepenuhnya; dan biaya bahan bakar mendominasi struktur biaya sehingga penghematan lain
menjadi relatif kecil.</p>` },

        { heading: "Ancaman terhadap Posisi Kompetitif",
          body: `<p>Menjelang 2010, beberapa tekanan mengelilingi model AirAsia:</p>
<ul>
<li><strong>Peniru bermunculan.</strong> Lion Air di Indonesia, Cebu Pacific di Filipina, Nok Air dan Thai Lion di
Thailand, Tiger Airways dan Jetstar Asia dari Singapura. Semuanya menyerang segmen yang sama dengan model yang
mirip.</li>
<li><strong>Petahana melawan balik.</strong> Maskapai penuh layanan mendirikan anak usaha berbiaya rendah sendiri, Singapore Airlines lewat Scoot dan Tiger, Qantas lewat Jetstar, Malaysia Airlines lewat Firefly. Mereka membawa
modal besar dan slot bandara yang sudah dimiliki.</li>
<li><strong>Harga bahan bakar.</strong> Bahan bakar menyumbang porsi terbesar biaya operasi; lonjakannya menekan
maskapai berbiaya rendah secara proporsional lebih keras karena tiket murah menyisakan bantalan margin yang
tipis.</li>
<li><strong>Batas pertumbuhan bandara.</strong> Slot dan kapasitas terminal di kota-kota besar Asia semakin langka
dan mahal.</li>
<li><strong>Kompleksitas organisasi.</strong> Jaringan afiliasi lintas negara dengan struktur kepemilikan berbeda-beda
menyulitkan pengendalian biaya yang menjadi inti keunggulan.</li>
</ul>` },

        { heading: "Epilog: Perkembangan Sesudah Periode Kasus",
          body: `<p><em>Bagian ini melampaui periode kasus Grant (2010). Gunakan untuk menguji apakah analisis Anda
atas kasus 2010 terbukti, bukan sebagai bahan analisis utama.</em></p>
<p>AirAsia terus tumbuh menjadi maskapai berbiaya rendah terbesar di Asia dan mempertahankan gelar Skytrax selama
lebih dari satu dekade. Namun <strong>pandemi COVID-19 pada 2020</strong> menghantam model ini dengan telak:
armada yang menganggur tetap menanggung biaya sewa, sementara utilisasi tinggi, sumber keunggulan biaya. Berubah menjadi tidak relevan ketika pesawat tidak boleh terbang.</p>
<p>Grup ini kemudian melakukan restrukturisasi besar, berganti nama menjadi <strong>Capital A</strong> pada 2022,
dan bergeser memposisikan diri bukan lagi semata maskapai melainkan perusahaan berbasis digital dan logistik, dengan airasia Super App, layanan pembayaran BigPay, dan unit kargo Teleport. Pada saat yang sama, entitasnya masuk
kategori PN17 di Bursa Malaysia, status untuk perusahaan dengan kesulitan keuangan.</p>
<p>Pertanyaan strategis yang tersisa sangat relevan untuk kelas: <em>apakah keunggulan biaya yang dibangun
bertahun-tahun cukup untuk melindungi perusahaan dari guncangan yang meniadakan asumsi dasarnya?</em></p>` }
      ],
      exhibits: [
        { title: "Exhibit 1: Perbandingan Model Operasi (indikatif)",
          note: "Angka bersifat indikatif dari sumber publik untuk menggambarkan besaran perbedaan; verifikasi dengan data dalam kasus Grant (2010).",
          rows: [
            ["Dimensi", "AirAsia (LCC)", "Maskapai penuh layanan"],
            ["Jenis pesawat", "Satu tipe (Airbus A320)", "Beragam tipe"],
            ["Turnaround time", "± 25 menit", "± 45–60 menit"],
            ["Utilisasi pesawat", "± 12 jam/hari", "± 8 jam/hari"],
            ["Jaringan", "Point-to-point", "Hub-and-spoke"],
            ["Kelas kabin", "Kelas tunggal, kepadatan tinggi", "Beberapa kelas"],
            ["Makanan & hiburan", "Berbayar (ancillary)", "Termasuk tiket"],
            ["Kanal penjualan", "Langsung: web & call center", "Agen, GDS, korporat"],
            ["Terminal", "Terminal berbiaya rendah / bandara sekunder", "Terminal utama"]
          ] },
        { title: "Exhibit 2: Rantai Sebab Keunggulan Biaya",
          note: "Perhatikan bahwa tiap pilihan memperkuat pilihan lain. Inilah yang membuat sistemnya sulit ditiru sebagian.",
          rows: [
            ["Pilihan strategis", "Konsekuensi biaya langsung", "Penguatan silang"],
            ["Armada satu tipe", "Pelatihan, suku cadang, perawatan turun", "Memungkinkan turnaround cepat & jadwal fleksibel"],
            ["Turnaround 25 menit", "Utilisasi naik → biaya tetap per penerbangan turun", "Butuh point-to-point & tanpa bagasi transit"],
            ["Point-to-point", "Tanpa biaya transfer & keterlambatan menular", "Menyederhanakan operasi darat"],
            ["Tanpa embel-embel", "Biaya layanan turun", "Menciptakan lini ancillary revenue baru"],
            ["Penjualan langsung", "Komisi & biaya GDS hilang", "Memberi data pelanggan langsung"],
            ["Terminal murah", "Biaya kebandarudaraan turun", "Cocok dengan penumpang sensitif harga"]
          ] }
      ],
      questions: [
        "Rumuskan sumber keunggulan kompetitif AirAsia. Mana di antaranya yang benar-benar sulit ditiru, dan mana yang sebenarnya bisa disalin pesaing dalam satu-dua tahun?",
        "Gunakan Five Forces untuk industri penerbangan berbiaya rendah Asia Tenggara pada 2010. Kekuatan mana yang paling menekan profitabilitas, dan bagaimana model AirAsia meredamnya?",
        "Mengapa maskapai penuh layanan seperti Malaysia Airlines sulit meniru AirAsia meskipun mereka tahu persis apa yang dilakukan AirAsia? Kaitkan dengan konsep trade-off dan sistem aktivitas yang saling mengunci.",
        "Uji AirAsia X dengan tiga tes strategi yang menang (fit, competitive advantage, performance). Apakah strategi LCC jarak jauh lulus ketiganya?",
        "Struktur associate airlines memungkinkan ekspansi cepat dengan modal terbatas. Apa risiko strategisnya bagi pengendalian biaya, inti keunggulan AirAsia?",
        "Bila Anda Tony Fernandes pada awal 2010, alokasikan prioritas antara: (a) memperdalam pasar Malaysia, (b) mempercepat ekspansi associate regional, (c) mengembangkan AirAsia X. Pertahankan pilihan Anda dengan data."
      ],
      guide: {
        problem: "Rumuskan tujuannya (mempertahankan pertumbuhan tinggi sambil menjaga posisi biaya terendah) dan penghalangnya (peniru bermunculan, petahana melawan dengan anak usaha LCC, harga bahan bakar, keterbatasan slot, kompleksitas jaringan afiliasi). Hindari menulis 'masalahnya adalah persaingan ketat', terlalu umum untuk dinilai baik.",
        alternatives: "Beri judul pada tiap alternatif seperti diminta silabus, misalnya: \"Konsolidasi Inti\" (fokus rute pendek profitabel, tunda X), \"Ekspansi Regional Agresif\" (percepat associate), \"Taruhan Jarak Jauh\" (dorong AirAsia X sebagai mesin pertumbuhan berikutnya). Jangan masukkan argumen pro-kontra di bagian ini.",
        issues: "Susun sebagai pertanyaan eksplisit: Seberapa besar potensi pasar penumpang pertama-kali di kawasan? Seberapa cepat pesaing bisa menyamai CASK AirAsia? Apakah keunggulan biaya rute pendek benar-benar berpindah ke rute panjang? Bagaimana respons Singapore Airlines dan Qantas lewat anak usaha LCC mereka? Di mana titik impas AirAsia X terhadap harga bahan bakar?",
        conclusion: "Bangun argumen kuantitatif: hitung sensitivitas margin terhadap harga bahan bakar, bandingkan CASK rute pendek vs panjang, dan estimasi kebutuhan modal tiap alternatif. Tunjukkan alternatif terpilih lulus ketiga tes strategi, dan sebutkan secara eksplisit di tes mana alternatif lain gugur."
      }
    },
    {
      id: "gojek",
      title: "Gojek: Dari 20 Tukang Ojek ke Super-App",
      subtitle: "Apakah menjadi \"aplikasi untuk segalanya\" adalah strategi, atau justru ketiadaan strategi?",
      forSession: 2,
      badge: "Kasus diskusi Sesi 2",
      officialSource: "Case primer disusun dari sumber publik untuk latihan konsep Bab 1",
      decisionMaker: "Manajemen GoTo Group",
      decisionPoint: "Pasca-IPO, tekanan mencapai profitabilitas sambil mempertahankan luasnya ekosistem",
      readingTime: 9,
      relevance: "Sesi 2 (strategi vs business model, tiga tes) · Sesi 8 (diversifikasi)",
      sections: [
        { heading: "Titik Awal: Call Center dengan 20 Pengemudi",
          body: `<p>Pada 2010, Nadiem Makarim memulai Gojek bukan sebagai perusahaan teknologi, melainkan sebagai
<strong>pusat panggilan sederhana dengan sekitar 20 pengemudi ojek</strong>. Pelanggan menelepon, operator mencarikan
pengemudi. Masalah yang dipecahkannya sangat nyata: di Jakarta yang macet, ojek adalah moda tercepat, tetapi
menemukannya bergantung pada keberuntungan dan menawar harga adalah keharusan.</p>
<p>Titik balik datang pada 2015 ketika Gojek meluncurkan aplikasi. Dalam hitungan bulan, jumlah pengemudi melonjak
dari ratusan menjadi puluhan ribu. Aplikasi mengubah dua hal sekaligus: <em>pencocokan</em> (algoritma menggantikan
keberuntungan) dan <em>kepercayaan</em> (tarif transparan, identitas pengemudi terekam, penilaian dua arah).</p>
<p>Yang terjadi setelahnya adalah pola yang membedakan Gojek dari sekadar aplikasi transportasi. Perusahaan menyadari
bahwa jaringan pengemudi yang sudah bergerak ke mana-mana di kota dapat mengantar <em>apa saja</em>, bukan hanya
orang. Lahirlah GoSend (kurir), GoFood (pesan-antar makanan), GoMart, dan belasan layanan lain. Kemudian datang
GoPay, dompet digital yang awalnya sekadar mempermudah pembayaran perjalanan, lalu tumbuh menjadi salah satu sistem
pembayaran terbesar di Indonesia.</p>
<p>Pada 2021, Gojek bergabung dengan Tokopedia, marketplace terbesar Indonesia, membentuk <strong>GoTo Group</strong>,
dan mencatatkan saham di Bursa Efek Indonesia pada 2022.</p>` },
        { heading: "Logika di Balik Model Super-App",
          body: `<p>Argumen strategis di balik super-app cukup elegan. Biaya untuk mendapatkan pelanggan baru
(<em>customer acquisition cost</em>) di pasar digital sangat mahal. Namun begitu pelanggan ada di dalam aplikasi
untuk satu alasan (memesan ojek) menawarkan layanan kedua kepadanya nyaris tanpa biaya akuisisi tambahan.
Tiap layanan baru menurunkan biaya akuisisi efektif layanan lainnya.</p>
<p>Lebih jauh, tiap transaksi menghasilkan data: ke mana orang pergi, apa yang mereka makan, kapan mereka membayar.
Data itu memperbaiki algoritma pencocokan, penargetan promosi, dan penilaian risiko kredit. Dan GoPay mengikat
semuanya, semakin banyak layanan yang dibayar lewat GoPay, semakin mahal biaya psikologis pengguna untuk pindah ke
pesaing.</p>
<p>Namun logika yang sama bisa dibaca terbalik. Setiap layanan baru menuntut modal, tim, operasi, dan subsidi
promosi. Pesaing Gojek berbeda-beda di tiap lini: Grab di transportasi, ShopeeFood di pesan-antar, Dana dan OVO di
pembayaran, Shopee di e-commerce. Perusahaan yang bersaing di enam medan sekaligus melawan enam lawan yang
masing-masing hanya fokus pada satu medan menghadapi pertanyaan yang tidak nyaman: <strong>di medan mana ia benar-benar
lebih unggul?</strong></p>` },
        { heading: "Perang Subsidi dan Jalan Menuju Laba",
          body: `<p>Selama bertahun-tahun, pertumbuhan Gojek dan Grab ditopang subsidi besar-besaran, promo ongkos
kirim, potongan harga makanan, cashback pembayaran. Modal ventura global membiayai perang ini dengan asumsi bahwa
pemenang akhirnya akan menikmati pasar yang terkonsolidasi.</p>
<p>Asumsi itu diuji ketika iklim pendanaan global berbalik. Investor bergeser dari menuntut pertumbuhan menjadi
menuntut <em>profitabilitas</em>. Bagi perusahaan yang model bisnisnya bergantung pada subsidi untuk mempertahankan
pangsa pasar, pergeseran ini memaksa pertanyaan mendasar: apakah pelanggan setia pada layanannya, atau setia pada
promonya?</p>
<p>GoTo merespons dengan memangkas subsidi, merampingkan organisasi, dan menutup atau menciutkan sejumlah lini
layanan yang tidak menuju profitabilitas. Ini adalah keputusan strategis klasik: <strong>mempersempit cakupan demi
memperdalam keunggulan</strong>.</p>` }
      ],
      exhibits: [
        { title: "Exhibit 1: Lini Layanan dan Pesaing Utamanya",
          note: "Menggambarkan tantangan bersaing di banyak medan sekaligus melawan pemain yang terfokus.",
          rows: [
            ["Lini layanan", "Contoh layanan", "Pesaing utama"],
            ["Transportasi", "GoRide, GoCar", "Grab, Maxim, InDrive"],
            ["Pesan-antar makanan", "GoFood", "GrabFood, ShopeeFood"],
            ["Logistik & kurir", "GoSend", "Grab Express, JNE, SiCepat"],
            ["Pembayaran digital", "GoPay", "OVO, DANA, ShopeePay, QRIS bank"],
            ["E-commerce", "Tokopedia", "Shopee, Lazada, TikTok Shop"],
            ["Layanan finansial", "GoPayLater, pinjaman", "Kredivo, Akulaku, bank digital"]
          ] },
        { title: "Exhibit 2: Dua Pembacaan atas Strategi yang Sama",
          note: "Kerangka untuk memperdebatkan kasus ini di kelas.",
          rows: [
            ["Isu", "Bacaan optimistis", "Bacaan skeptis"],
            ["Banyak layanan", "Biaya akuisisi pelanggan turun drastis", "Fokus terpecah di enam medan"],
            ["Data lintas layanan", "Keunggulan algoritma & risiko kredit", "Nilai data sulit dimonetisasi langsung"],
            ["GoPay sebagai pengikat", "Biaya berpindah tinggi bagi pengguna", "Dompet digital nyaris komoditas"],
            ["Merger dengan Tokopedia", "Ekosistem lengkap dari pesan sampai belanja", "Sinergi lebih mudah dijanjikan daripada diwujudkan"],
            ["Subsidi", "Investasi merebut pasar", "Loyalitas semu yang hilang saat promo berhenti"]
          ] }
      ],
      questions: [
        "Apakah \"menjadi super-app\" memenuhi definisi strategi menurut Thompson & Strickland, yaitu pilihan untuk bersaing secara berbeda? Atau justru menghindari pilihan?",
        "Pisahkan strategi Gojek dari business model-nya. Apa customer value proposition-nya, dan apa profit formula-nya? Di bagian mana model itu paling rapuh?",
        "Uji strategi super-app dengan tiga tes: fit, competitive advantage, dan performance. Di tes mana ia paling lemah?",
        "Grab menjalankan strategi yang hampir identik di pasar yang sama. Jika dua pesaing menjalankan strategi yang sama, apakah salah satunya masih bisa memiliki keunggulan kompetitif? Atas dasar apa?",
        "Bagian mana dari strategi Gojek yang deliberate dan bagian mana yang emergent? Apa yang bisa dipelajari manajer dari proporsi keduanya?",
        "Jika Anda dewan direksi GoTo dan harus menutup dua lini layanan demi profitabilitas, lini mana yang Anda tutup dan dengan kriteria apa?"
      ],
      guide: {
        problem: "Tujuan: mencapai profitabilitas berkelanjutan tanpa kehilangan posisi ekosistem. Penghalang: subsidi yang mahal, pesaing terfokus di tiap lini, dan pergeseran ekspektasi investor dari pertumbuhan ke laba.",
        alternatives: "Contoh penamaan: \"Fokus Inti\" (transportasi + pesan-antar + pembayaran saja), \"Ekosistem Penuh\" (pertahankan semua lini, kejar sinergi data), \"Platform Terbuka\" (jadikan infrastruktur bagi pemain lain, tarik biaya platform).",
        issues: "Seberapa besar loyalitas pelanggan tanpa promo? Berapa biaya akuisisi pelanggan aktual per lini? Apakah data lintas layanan benar-benar meningkatkan margin, dan lewat mekanisme apa? Bagaimana respons Grab dan Shopee bila Gojek memangkas subsidi lebih dulu? Bagaimana regulasi pembayaran dan pinjaman digital memengaruhi lini finansial?",
        conclusion: "Bandingkan alternatif dengan angka: kontribusi margin per lini, kebutuhan modal, dan sensitivitas pangsa pasar terhadap pengurangan promo. Tunjukkan mengapa alternatif terpilih lulus ketiga tes strategi."
      }
    },
    {
      id: "kopikenangan",
      title: "Kopi Kenangan: Menemukan Ruang di Antara Dua Ekstrem",
      subtitle: "Apakah \"di tengah\" adalah posisi strategis, atau justru stuck in the middle?",
      forSession: 2,
      badge: "Mini-case Sesi 2",
      officialSource: "Case primer disusun dari sumber publik untuk latihan konsep Bab 1",
      decisionMaker: "Edward Tirtanata, Co-founder & CEO",
      decisionPoint: "Mempertahankan posisi ketika belasan pesaing menyalin format yang sama",
      readingTime: 6,
      relevance: "Sesi 2 (lima pendekatan strategi, tiga tes) · Sesi 6 (generic strategies)",
      sections: [
        { heading: "Celah Pasar di Antara Rp5.000 dan Rp50.000",
          body: `<p>Sampai pertengahan 2010-an, pasar kopi Indonesia terbelah tajam. Di satu ujung ada kopi warung dan
kopi saset seharga beberapa ribu rupiah. Di ujung lain ada gerai kopi internasional seperti Starbucks dengan harga
sekitar Rp50.000 per gelas, menjual bukan sekadar kopi melainkan tempat untuk duduk berjam-jam.</p>
<p>Ketika Edward Tirtanata dan James Prananto mendirikan <strong>Kopi Kenangan</strong> pada 2017, mereka menyasar
ruang kosong di antaranya: kopi susu berbahan baku layak dengan harga sekitar <strong>Rp18.000–25.000</strong>: terjangkau bagi kelas pekerja perkotaan yang ingin naik kelas dari kopi saset tetapi menganggap Starbucks terlalu
mahal untuk konsumsi harian.</p>
<p>Yang membuatnya berhasil bukan hanya titik harga, melainkan <strong>model gerainya</strong>. Kopi Kenangan tidak
menjual tempat duduk. Gerainya kecil, sebagian besar <em>grab-and-go</em>, ditempatkan di lalu lintas padat: lobi
gedung perkantoran, pusat perbelanjaan, stasiun. Biaya sewa per gerai jauh lebih rendah daripada kafe dengan ruang
duduk luas, dan perputaran pelanggan jauh lebih cepat. Pemesanan lewat aplikasi mengurangi antrean sekaligus
mengumpulkan data pelanggan.</p>
<p>Perusahaan tumbuh menjadi ratusan gerai dan pada 2021 disebut sebagai unicorn F&amp;B pertama Indonesia setelah
pendanaan Seri C.</p>` },
        { heading: "Ketika Format Bisnisnya Ditiru Pesaing",
          body: `<p>Keberhasilan itu memicu gelombang peniruan. Janji Jiwa, Fore Coffee, Tomoro, Kopi Soe, dan puluhan
merek lokal lain memasuki segmen yang sama dengan format yang nyaris identik: kopi susu gula aren, gerai kecil,
harga di kisaran dua puluh ribuan, pemesanan aplikasi, promo agresif.</p>
<p>Hambatan masuk ke bisnis ini rendah: menyewa gerai kecil, membeli mesin espresso, dan meniru resep bukan pekerjaan
sulit. Ketika format bisa disalin dalam hitungan bulan, pertanyaannya menjadi tajam: <em>apa sebenarnya keunggulan
kompetitif Kopi Kenangan, dan berapa lama ia bertahan?</em></p>
<p>Kandidat jawabannya beragam, skala pembelian bahan baku, kekuatan merek, data pelanggan dari aplikasi,
kemampuan memilih lokasi, disiplin operasi, atau akses modal untuk bertahan dalam perang harga lebih lama daripada
pesaing. Masing-masing punya daya tahan yang berbeda.</p>` }
      ],
      exhibits: [
        { title: "Exhibit 1: Posisi Tiga Model di Pasar Kopi Indonesia",
          note: "Perhatikan bahwa yang berbeda bukan hanya harga, melainkan seluruh sistem aktivitasnya.",
          rows: [
            ["Dimensi", "Kopi warung / saset", "Kopi Kenangan", "Gerai kopi premium"],
            ["Harga per gelas", "± Rp5.000", "± Rp18.000–25.000", "± Rp45.000–60.000"],
            ["Format gerai", "Warung / eceran", "Kecil, grab-and-go", "Kafe dengan ruang duduk luas"],
            ["Yang dijual", "Minuman", "Minuman + kecepatan", "Minuman + tempat + status"],
            ["Biaya sewa", "Sangat rendah", "Rendah–menengah", "Tinggi"],
            ["Perputaran pelanggan", "Cepat", "Sangat cepat", "Lambat"],
            ["Kanal pesanan", "Langsung", "Aplikasi + langsung + ojol", "Langsung + aplikasi"]
          ] }
      ],
      questions: [
        "Klasifikasikan strategi Kopi Kenangan ke dalam lima pendekatan Thompson & Strickland. Apakah ini best-cost provider, focused differentiation, atau sesuatu yang lain? Pertahankan klasifikasi Anda.",
        "Porter memperingatkan bahaya \"stuck in the middle\". Mengapa Kopi Kenangan tidak terjebak di tengah, atau apakah sebenarnya iya?",
        "Sebutkan kandidat sumber keunggulan kompetitifnya, lalu urutkan dari yang paling tahan ditiru sampai yang paling mudah disalin.",
        "Uji dengan performance test: indikator apa yang akan Anda pakai untuk menilai apakah strategi ini menang, mengingat perusahaan swasta tidak mempublikasikan laporan keuangannya?",
        "Jika Anda CEO dan harus memilih satu: memperbanyak gerai secepat mungkin, atau memperdalam loyalitas pelanggan yang ada, mana yang Anda pilih dan mengapa?"
      ],
      guide: {
        problem: "Tujuan: mempertahankan pertumbuhan dan margin di segmen yang baru diciptakannya. Penghalang: hambatan masuk rendah, belasan peniru dengan format identik, dan perang promo yang menekan margin.",
        alternatives: "Contoh penamaan: \"Dominasi Lokasi\" (rebut titik terbaik sebelum pesaing), \"Pendalaman Merek\" (bangun loyalitas lewat produk & pengalaman khas), \"Efisiensi Skala\" (tekan biaya bahan baku & operasi untuk menang perang harga).",
        issues: "Seberapa besar loyalitas pelanggan terhadap merek dibanding terhadap lokasi dan promo? Berapa lama pesaing bisa menyamai skala pembelian? Apakah data aplikasi menghasilkan margin nyata? Bagaimana perilaku pesaing bila Kopi Kenangan menaikkan harga lebih dulu?",
        conclusion: "Bangun argumen dengan ekonomi per gerai: perkirakan pendapatan harian, biaya sewa, bahan baku, dan tenaga kerja untuk membandingkan alternatif. Tunjukkan alternatif mana yang lulus fit, competitive advantage, dan performance test."
      }
    }
  ],

  flashcards: [
    { session: 1, front: "Bobot penilaian Strategic Management (silabus baru 2026)?", back: "UTS 40% · Term Paper 40% · Partisipasi 10% · Group Report 10%. Dua komponen (UTS + Term Paper) menguasai 80% nilai." },
    { session: 1, front: "Empat komponen wajib analisis kasus menurut Appendix 3 silabus?", back: "1) The Problem (goals + barrier), 2) The Alternatives (diberi judul, TANPA argumen pro-kontra), 3) The Issues (dirumuskan sebagai pertanyaan eksplisit), 4) The Conclusion (sintesis + argumen kuantitatif bila data memadai)." },
    { session: 1, front: "Apa definisi 'masalah' dalam analisis kasus menurut dosen?", back: "Penghalang (barrier) yang menghambat organisasi mencapai tujuannya (goals). Goals bisa berupa pangsa pasar, sikap konsumen, posisi kanal distribusi, pertumbuhan penjualan, citra, atau positioning produk. Sering hanya tersirat dalam kasus." },
    { session: 1, front: "Apa itu Learning Diary dan apa bedanya dengan catatan kuliah?", back: "Esai reflektif pendek berisi argumen utama & poin penting diskusi, serta interpretasi dan pertanyaan sendiri, bukan catatan kuliah mentah. Wajib dibuat setiap sesi dan dibagikan di grup WhatsApp kelas." },
    { session: 1, front: "Struktur wajib Term Paper (7 bagian)?", back: "1) Executive Summary, 2) Company and Industry Context, 3) Strategic Diagnosis, 4) Holistic Strategic Recommendation, 5) Strategic Implementation, 6) Strategic Impact Evaluation, 7) References and Data Appendices. 10–15 halaman, dikumpulkan saat ujian akhir." },
    { session: 1, front: "Format email & penamaan berkas untuk tugas SM?", back: "SMJKT_(nomor kelompok)_(nama depan)_(nama tugas). Contoh: SMJKT_Group 3_Aslih_Case AirAsia. Nama file lampiran harus mengikuti pola yang sama." },
    { session: 1, front: "Beda Teaching Case dan Competing Case Assignment?", back: "Teaching case: semua kelompok siapkan kasusnya, bisa dipanggil ACAK untuk presentasi, siapkan 5 slide. Competing case: dua kelompok berhadapan mempresentasikan kasus yang sama, wajib laporan tertulis dipublikasikan ke kelas sebelum presentasi; mahasiswa non-presenter wajib mengajukan pertanyaan (dasar nilai partisipasi)." },
    { session: 2, front: "Definisi strategi menurut Thompson & Strickland.", back: "Rangkaian langkah kompetitif dan pendekatan bisnis yang dipakai manajer untuk menarik & memuaskan pelanggan, bersaing efektif, memperkuat kinerja, dan mencapai tujuan organisasi. Intinya: bersaing secara BERBEDA." },
    { session: 2, front: "Tiga pertanyaan yang dijawab sebuah strategi?", back: "1) Di mana kita bersaing (pasar, segmen, geografi)? 2) Bagaimana kita menciptakan nilai bagi pelanggan? 3) Bagaimana kita mengalahkan pesaing? Setiap jawaban adalah pilihan, dan berarti mengatakan tidak pada yang lain." },
    { session: 2, front: "Sebutkan lima pendekatan strategi kompetitif.", back: "Low-cost provider, broad differentiation, focused low-cost, focused differentiation, dan best-cost provider." },
    { session: 2, front: "Kapan competitive advantage disebut 'sustainable'?", back: "Ketika keunggulan itu bertahan MESKIPUN pesaing berusaha keras menirunya. Sumbernya: sumber daya sulit ditiru, sistem aktivitas yang saling mengunci, trade-off yang mahal bagi peniru, dan kecepatan perbaikan melebihi laju peniruan." },
    { session: 2, front: "Bedakan deliberate strategy dan emergent strategy.", back: "Deliberate (proaktif): bagian strategi yang direncanakan sengaja. Emergent (reaktif/adaptif): bagian yang muncul sebagai respons terhadap perkembangan tak terduga. Strategi aktual = gabungan keduanya." },
    { session: 2, front: "Apa beda strategi dan business model?", back: "Strategi menjawab bagaimana perusahaan bersaing dan menang. Business model menjawab apakah cara itu menghasilkan uang, terdiri dari customer value proposition dan profit formula." },
    { session: 2, front: "Dua komponen business model?", back: "1) Customer value proposition, nilai bagi pelanggan dan mengapa mereka memilih kita (V − P). 2) Profit formula, struktur biaya & margin yang membuat perusahaan untung sambil menyampaikan nilai itu (P − C)." },
    { session: 2, front: "Sebutkan tiga tes strategi yang menang.", back: "1) Fit test (cocok secara eksternal, internal, dan dinamis), 2) Competitive advantage test (menghasilkan keunggulan berkelanjutan), 3) Performance test (kinerja finansial & posisi kompetitif membaik). Harus lulus KETIGANYA." },
    { session: 2, front: "Tiga lapis dalam fit test?", back: "External fit (cocok dengan industri, persaingan, tren pasar, kebutuhan pelanggan), internal fit (cocok dengan sumber daya & kapabilitas), dan dynamic fit (mampu menyesuaikan diri saat kondisi berubah)." },
    { session: 2, front: "Apa itu Eisenhower Matrix dan relevansinya dengan strategi?", back: "Matriks dua sumbu: penting vs mendesak. Relevansinya: pekerjaan strategis hampir selalu penting tetapi tidak mendesak (kuadran 2), sehingga terus kalah oleh urusan mendesak-tidak-penting, alasan struktural mengapa banyak perusahaan tak sempat berstrategi." }
  ],

  quizzes: [
    {
      session: 2,
      questions: [
        { q: "Menurut Thompson & Strickland, inti dari strategi adalah…", options: ["Menjalankan operasi seefisien mungkin", "Bersaing secara berbeda dari pesaing", "Memaksimalkan pangsa pasar dengan segala cara", "Mengikuti praktik terbaik industri"], answer: 1, explain: "Strategi selalu tentang competing differently, melakukan hal berbeda, atau hal yang sama dengan cara berbeda. Kalau bisa disalin besok pagi, itu praktik operasional biasa." },
        { q: "Competitive advantage disebut SUSTAINABLE ketika…", options: ["Perusahaan memimpin pangsa pasar", "Keunggulan bertahan meski pesaing berusaha menirunya", "Margin laba di atas rata-rata industri", "Perusahaan memiliki paten"], answer: 1, explain: "Daya tahan terhadap peniruan adalah pembeda antara keberuntungan sesaat dan strategi sesungguhnya." },
        { q: "Manakah yang BUKAN salah satu dari lima pendekatan strategi kompetitif?", options: ["Best-cost provider", "Focused differentiation", "Broad diversification", "Low-cost provider"], answer: 2, explain: "Kelimanya: low-cost provider, broad differentiation, focused low-cost, focused differentiation, best-cost provider. Diversification adalah strategi tingkat korporat (Bab 8), bukan strategi kompetitif tingkat bisnis." },
        { q: "Business model terdiri dari dua komponen, yaitu…", options: ["Visi dan misi", "Customer value proposition dan profit formula", "Strategi dan taktik", "Pendapatan dan biaya"], answer: 1, explain: "Customer value proposition (nilai bagi pelanggan, V − P) + profit formula (struktur biaya & margin, P − C)." },
        { q: "Bagian strategi yang muncul sebagai respons terhadap perkembangan tak terduga disebut…", options: ["Deliberate strategy", "Emergent strategy", "Corporate strategy", "Functional strategy"], answer: 1, explain: "Emergent (reaktif/adaptif). Deliberate adalah bagian yang direncanakan sengaja. Strategi aktual = gabungan keduanya." },
        { q: "Tiga tes strategi yang menang adalah…", options: ["Fit test, competitive advantage test, performance test", "Profit test, growth test, market test", "Internal test, external test, dynamic test", "Vision test, mission test, values test"], answer: 0, explain: "Ketiganya harus lulus. Internal/external/dynamic adalah tiga LAPIS di dalam fit test, bukan tiga tes terpisah." },
        { q: "Sebuah perusahaan punya proposisi nilai yang menarik pelanggan, tetapi struktur biayanya membuatnya tidak pernah untung. Masalahnya paling tepat digambarkan sebagai…", options: ["Strategi buruk", "Business model yang rusak pada sisi profit formula", "Kegagalan eksekusi", "Fit test yang gagal"], answer: 1, explain: "Strategi (bagaimana bersaing) bisa jelas, tetapi business model rusak bila profit formula tidak memungkinkan untung. Ini pola kegagalan banyak startup." },
        { q: "Dalam analisis kasus versi silabus, bagian 'The Alternatives' sebaiknya…", options: ["Memuat argumen pro dan kontra tiap alternatif", "Hanya memuat pernyataan singkat strategi beserta elemen utamanya, diberi judul", "Langsung menunjuk alternatif terbaik", "Berisi data kuantitatif lengkap"], answer: 1, explain: "Dosen secara eksplisit meminta argumen pro/kontra tidak dimasukkan di bagian ini. Itu mengaburkan kejelasan dan akan berulang di bagian Issues." },
        { q: "Pada Eisenhower Matrix, pekerjaan strategis umumnya berada di kuadran…", options: ["Penting dan mendesak", "Penting tetapi tidak mendesak", "Tidak penting tetapi mendesak", "Tidak penting dan tidak mendesak"], answer: 1, explain: "Kuadran 2. Inilah alasan struktural mengapa pekerjaan strategis terus tergeser oleh urusan mendesak yang sebenarnya tidak penting." },
        { q: "Mengapa maskapai penuh layanan sulit meniru model AirAsia meskipun tahu persis cara kerjanya?", options: ["Teknologinya dipatenkan", "Mereka terikat armada campuran, jaringan hub, kontrak kerja, dan janji merek. Meniru berarti mengorbankan posisi yang sudah dimiliki", "Regulasi melarang", "Biaya modalnya terlalu tinggi"], answer: 1, explain: "Inilah konsep trade-off bagi peniru dan sistem aktivitas yang saling mengunci, sumber keunggulan yang paling tahan lama." }
      ]
    }
  ]
};
