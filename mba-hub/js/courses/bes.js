/* ============================================================
   Business Ethics for Business Sustainability (MAN 5522)
   Prof. Dr. Eko Suwardi, M.Sc. — 3 SKS
   Sumber: RPKPS/Silabus MAN5522 + jadwal SEMBA 51-A
   ============================================================ */

window.MBA_COURSES = window.MBA_COURSES || {};
window.MBA_COURSES.bes = {
  meta: {
    id: "bes",
    code: "MAN 5522",
    name: "Business Ethics for Business Sustainability",
    short: "BES",
    icon: "⚖️",
    accent: "#3f6b4f",
    lecturer: "Prof. Dr. Eko Suwardi, M.Sc.",
    lecturerNote: "Koordinator RPKPS: Amin Wibowo, Ph.D.",
    sks: 3,
    sessionsTotal: 12,
    hasBook: true,
    tools: [],
    driveFolder: "https://drive.google.com/drive/folders/1Vtc18Q6GmmB-VnlBKs0R-yiQvbpm0iLR",
    status: "Silabus & materi bab 1–2 tersedia"
  },
  course: {
    title: "Business Ethics for Business Sustainability",
    codes: "MAN 5522",
    program: "Magister Business Administration — Universitas Gadjah Mada",
    semester: "Semester 2 · Kelas S51A",
    classCode: "—",
    lecturer: {
      name: "Prof. Dr. Eko Suwardi, M.Sc.",
      dept: "Faculty of Economics and Business, Universitas Gadjah Mada",
      education: "Course coordinator RPKPS: Amin Wibowo, Ph.D. (13 Juli 2023)"
    },
    driveLinks: [
      { label: "Folder Business Ethics", url: "https://drive.google.com/drive/folders/1Vtc18Q6GmmB-VnlBKs0R-yiQvbpm0iLR" },
      { label: "Silabus MAN5522", url: "https://drive.google.com/file/d/15PdSy_1MhZ2gTpuwUvG2VPDGrJwJKwZd/view" },
      { label: "Materi (Chapter 1 & 2 + Etika Bisnis)", url: "https://drive.google.com/drive/folders/1jC6B1y7I34jWCg4FlHfdv77a1ipcvJSQ" },
      { label: "Ringkasan Penjelasan Kelas", url: "https://drive.google.com/drive/folders/1iOORugMnxbz57QL5cVin3DX-a0AW4QLa" }
    ],
    assessment: [
      { label: "Diskusi & partisipasi", weight: 30 },
      { label: "Ujian tengah semester", weight: 25 },
      { label: "Ujian akhir semester", weight: 25 },
      { label: "Tugas (individu & kelompok)", weight: 20 }
    ],
    references: [
      { code: "CM", text: "Crane, A. & Matten, D. (2019), Business Ethics: Managing corporate citizenship and sustainability in the age of globalization, Oxford University Press. — BACAAN UTAMA" },
      { code: "FFF", text: "Ferrell, Fraedrich & Ferrell (2022), Business Ethics: Ethical Decision Making and Cases, 11th Ed., Cengage." },
      { code: "CB", text: "Carroll, A. B. & Brown, J. (2022), Business & Society: Ethics, Sustainability & Stakeholder Management, Cengage." },
      { code: "VEL", text: "Velasquez, M.G. (2014), Business Ethics: Concepts and Cases, 7th Ed., Prentice Hall." },
      { code: "LC", text: "Laasch, O. & Conaway, R. (2016), Responsible Business, Routledge." }
    ],
    objectives: [
      "Memahami prinsip etika dan standar moral untuk menjamin keberlanjutan bisnis (CO1).",
      "Mengadopsi kesadaran etis & berkelanjutan dalam mengambil keputusan yang bermakna bagi komunitas dan profesi (CO2).",
      "Menyediakan beragam alternatif solusi atas isu-isu bisnis (CO3).",
      "Menunjukkan kompetensi komunikasi lisan & interpersonal: satu-lawan-satu, kelompok kecil, dan presentasi publik (CO4)."
    ]
  },

  /* ---------- PEMETAAN FILE MATERI → PERTEMUAN ----------
     Keputusan berbasis silabus MAN5522 (kolom "Reference" tiap sesi).
     Deck Prof. Eko mengikuti struktur buku Velasquez (ada di daftar
     recommended readings), sehingga bagian-bagiannya tersebar ke
     beberapa pertemuan, bukan hanya satu. ---------- */
  materialMap: [
    {
      file: "Chapter_1_with_Explanatory_Notes.pptx",
      sessions: [1],
      part: "Seluruh deck (15 slide)",
      why: "Silabus Sesi 1 = \"Syllabus, class management, and introduction to business ethics · Introducing Business Ethics\" dengan referensi CM1. Deck ini memang berjudul \"Slide pointers for Chapter 1\" dan isinya persis: definisi BE, etika vs hukum, morality–ethics–theory, globalisasi, sustainability, kasus Global McEthics.",
      confidence: "pasti"
    },
    {
      file: "Chapter_2_Slides_and_Explanatory_Notes.pptx",
      sessions: [2],
      part: "Seluruh deck",
      why: "Silabus Sesi 2 = \"Framing Business Ethics\" dengan referensi CM2. File ini sempat ada di Drive tetapi kini tidak ditemukan — kalau diupload ulang, tempatnya di Pertemuan 2.",
      confidence: "pasti (file hilang dari Drive)"
    },
    {
      file: "Materi Etika Bisnis-Terbaru.pptx (deck Prof. Eko)",
      sessions: [1],
      part: "Bagian pembuka: isu domestik & internasional · stakeholder primer–sekunder · Triple Bottom Line (Savitz) · sebelas peran perusahaan (de Woot) · definisi ethics/morality/BE · why business ethics · contoh korporasi · relativisme etika · individu vs korporasi · systemic issues",
      why: "Semua topik ini adalah materi pengantar yang di silabus masuk Sesi 1 (CM1). Inilah bagian deck yang dipakai pada pertemuan pertama.",
      confidence: "pasti"
    },
    {
      file: "Materi Etika Bisnis-Terbaru.pptx (deck Prof. Eko)",
      sessions: [3],
      part: "Bagian teori: konsep hak (legal vs moral) · John Locke &amp; hak alamiah · Adam Smith &amp; pasar bebas beserta kritiknya · hak negatif vs positif · contractual rights &amp; duties · Kant's categorical imperative · masalah utilitarianisme (kasus Pinto) · keterbatasan pengukuran",
      why: "Silabus Sesi 3 = \"Evaluating Business Ethics\" (CM3) yang membahas teori-teori etika normatif. Seluruh bagian ini adalah teori etika, jadi tempatnya di Pertemuan 3 — bukan Pertemuan 1 atau 2.",
      confidence: "tinggi"
    },
    {
      file: "Materi Etika Bisnis-Terbaru.pptx (deck Prof. Eko)",
      sessions: [7],
      part: "Ethics of Job Discrimination: definisi · bentuk diskriminasi · affirmative action · diskriminasi dan hukum · analisis lewat utility, rights, dan justice",
      why: "Silabus Sesi 7 = \"Employees and Business Ethics\" (CM7). Diskriminasi kerja adalah isu ketenagakerjaan, jadi masuk pertemuan itu.",
      confidence: "tinggi"
    },
    {
      file: "Materi Etika Bisnis-Terbaru.pptx (deck Prof. Eko)",
      sessions: [8],
      part: "The Ethics of Consumer Production and Marketing: contract view · due care theory · social cost view · etika periklanan · privasi konsumen · kasus gagal ginjal akut (sirop obat)",
      why: "Silabus Sesi 8 = \"Consumers and Business Ethics\" (CM8). Seluruh bagian ini tentang kewajiban produsen terhadap konsumen.",
      confidence: "tinggi"
    },
    {
      file: "Materi Etika Bisnis-Terbaru.pptx (deck Prof. Eko)",
      sessions: [11],
      part: "Business System: kebijakan industri pemerintah · haruskah pemerintah mengatur atau melepas · market system vs command system · mixed system · perbandingan negara liberal dan tersentralisasi",
      why: "Silabus Sesi 11 = \"Government, Regulation, and Business Ethics\" (CM11). Pertanyaan sejauh mana negara mengatur pasar adalah inti pertemuan itu. (Sebagian bisa muncul lagi di Sesi 3 sebagai isu sistemik.)",
      confidence: "sedang"
    },
    {
      file: "Materi Etika Bisnis-Terbaru.pptx (deck Prof. Eko)",
      sessions: [12],
      part: "Ethics and the Environment (polusi, perubahan iklim, ecological ethics, environmental rights, private vs social cost, konservasi sumber daya, sustainability issues) + Isu Teknologi (AI, integritas pengguna)",
      why: "Silabus tidak punya sesi khusus lingkungan; Sesi 12 = \"Future Perspectives, Corporate Governance, and Business Ethics (including Ethics and Technology)\" (CM12) adalah tempat paling tepat untuk keberlanjutan jangka panjang dan teknologi. Pengantar ringkasnya tetap dipakai di Sesi 1 lewat Triple Bottom Line.",
      confidence: "sedang"
    }
  ],

  sessions: [
    { id: 1, date: "2026-08-15", dateLabel: "15 Agustus 2026", topic: "Pengantar & Introducing Business Ethics",
      subtopics: ["Silabus & manajemen kelas", "Introducing business ethics"], readings: ["Silabus", "CM bab 1"], caseStudy: "Global McEthics (McDonald's)",
      summary: [
        {
          heading: "Apa itu Business Ethics — dan mengapa penting?",
          source: { kind: "ppt", label: "Slide Chapter 1 + deck Prof. Eko" },
          body: `<p>Mata kuliah ini dibuka dengan satu pesan: <strong>keputusan bisnis bukan sekadar keputusan
ekonomi</strong>. Setiap keputusan juga mengandung pertanyaan benar–salah, adil–tidak adil, siapa yang menanggung
akibatnya. Itulah wilayah business ethics.</p>
<h4 class="sub-h">Definisi yang dipakai di kelas</h4>
<p><strong>Business ethics adalah studi tentang situasi, aktivitas, dan keputusan bisnis di mana persoalan benar dan
salah secara moral muncul</strong> (Crane &amp; Matten). Perhatikan tiga hal dari definisi ini:</p>
<ul>
<li>Bukan hanya soal <em>skandal besar</em> seperti korupsi atau fraud — isu etis muncul di keputusan sehari-hari:
penetapan harga, kampanye pemasaran, perlakuan terhadap karyawan, pilihan pemasok.</li>
<li>Bukan hanya untuk <em>perusahaan pencari laba</em> — berlaku juga bagi organisasi publik dan masyarakat sipil.</li>
<li>Yang dipersoalkan adalah benar-salah <em>moral</em>, bukan sekadar benar-salah komersial.</li>
</ul>
<h4 class="sub-h">Tiga istilah yang sering tertukar</h4>
[[visual:besMoralityStack]]
<p><strong>Morality</strong> = norma, nilai, dan keyakinan yang tertanam dalam proses sosial, yang mendefinisikan
benar–salah bagi individu atau komunitas. <strong>Ethics</strong> = studi tentang moralitas itu, penerapan nalar untuk
merumuskan aturan dan prinsip yang menentukan benar–salah dalam situasi tertentu. <strong>Ethical theory</strong> =
aturan dan prinsip terstruktur itu sendiri (utilitarianisme, hak, keadilan, virtue ethics, ethics of care) yang akan
dibahas mendalam di Sesi 3.</p>
<p>Pesan pentingnya: <em>penalaran etis bukan sekadar opini pribadi</em>. Teori etika membantu membangun penilaian
yang disiplin dan bisa dipertahankan argumennya.</p>
<h4 class="sub-h">Etika vs hukum — batas yang sering ditanyakan di ujian</h4>
<p>Ungkapan kunci dari deck dosen: <strong>"Business ethics begins where the law ends."</strong> Hukum menetapkan
<em>standar minimum</em> perilaku yang bisa diterima. Etika bertanya lebih jauh: apakah perilaku ini pantas secara
moral, <em>bahkan ketika hukum memperbolehkannya</em>?</p>
[[visual:besLawEthics]]
<p>Karena itu sebuah perusahaan bisa <strong>legal tapi tidak etis</strong> — misalnya mematuhi ambang batas emisi
tetapi tetap menghasilkan polusi yang sebenarnya bisa dihindari, atau memakai skema pajak yang sah menurut huruf
hukum tapi mempertanyakan tanggung jawab sosialnya. Sebaliknya, sebagian isu hukum bukan dilema moral sama sekali
(mis. aturan administratif). Dan perdebatan etis hari ini sering menjadi <em>hukum</em> besok.</p>
<h4 class="sub-h">Mengapa business ethics penting?</h4>
<p>Deck Prof. Eko memberi alasan yang lugas: bisnis adalah <strong>pemain utama ekonomi</strong>, <strong>penyedia
lapangan kerja utama</strong>, dan <strong>sumber pendapatan utama masyarakat</strong>. Lebih jauh, korporasi adalah
<em>institusi legal yang bertindak sebagai "pribadi fiktif yang tidak pernah mati"</em> dengan pengaruh besar pada
kehidupan sosial, budaya, dan politik. Kekuasaan sebesar itu menuntut pertanggungjawaban moral.</p>
<p>Dari sisi manajer: Anda rutin menghadapi situasi di mana kepentingan stakeholder saling bertabrakan — pemegang
saham ingin imbal hasil tinggi, karyawan ingin kondisi kerja lebih baik, pelanggan ingin harga murah, pemerintah
menuntut kepatuhan, masyarakat menuntut perlindungan lingkungan. <strong>Penilaian etis adalah alat untuk
menyeimbangkan klaim-klaim yang bersaing itu.</strong></p>
<div class="key-box"><strong>💡 Intinya:</strong> Business ethics = studi tentang benar-salah moral dalam situasi
bisnis. Hukum adalah lantai minimum; etika menuntut lebih. Bedakan morality (norma yang ada) → ethics (refleksi
sistematis atasnya) → ethical theory (kerangka analisisnya).</div>`
        },
        {
          heading: "Isu Etika Nyata: Indonesia & Internasional",
          source: { kind: "ppt", label: "Deck Prof. Eko Suwardi" },
          body: `<p>Dosen membuka kuliah dengan mendaftar kasus nyata — ini penting karena ujian dan diskusi kelas
banyak berangkat dari kasus. Kenali dan siapkan pendapat Anda atas masing-masing.</p>
[[visual:besIssues]]
<p>Perhatikan pola di balik daftar itu: hampir semua kasus melibatkan <strong>pihak yang menikmati manfaat berbeda
dari pihak yang menanggung biaya</strong> — pemegang saham menikmati laba, masyarakat menanggung polusi; produsen
menikmati efisiensi, anak-anak menanggung risiko sirup obat batuk. Pola inilah yang nanti diformalkan sebagai
<em>private cost vs social cost</em> pada bahasan etika lingkungan.</p>
<div class="case-box"><p><strong>📌 Kasus yang wajib Anda siapkan — Gagal Ginjal Akut pada Anak:</strong> per 18
Oktober 2022 dilaporkan 208 kasus gagal ginjal akut misterius di 20 provinsi, dengan <strong>118 anak meninggal
(56,7%)</strong>. Pada 99 pasien terdeteksi ethylene glycol (EG), diethylene glycol (DEG), dan EGBE pada ginjalnya.
Kemenkes &amp; BPOM menghentikan dan menarik obat sirop penurun panas.</p>
<p>Dosen secara eksplisit menyarankan <strong>membandingkannya dengan kasus Johnson &amp; Johnson</strong> yang menarik
produknya ketika terjadi kontaminasi pada proses pembungkusan — perbandingan klasik antara perusahaan yang menarik
produk secara proaktif versus penanganan yang lambat. Siapkan analisis: siapa yang bertanggung jawab (produsen,
regulator, distributor)? Apakah kepatuhan pada standar yang berlaku cukup secara moral?</p></div>`
        },
        {
          heading: "Stakeholder: Primer & Sekunder",
          source: { kind: "ppt", label: "Deck Prof. Eko Suwardi" },
          body: `<p>Kerangka utama untuk menganalisis kasus etika adalah <strong>peta stakeholder</strong>. Dosen
membedakan dua lingkaran:</p>
[[visual:besStakeholders]]
<p><strong>Stakeholder primer</strong> berhubungan langsung lewat transaksi ekonomi dengan perusahaan: karyawan
(dan serikat pekerja) menjual tenaga; pemegang saham dan kreditor menanamkan modal; pemasok menjual bahan;
pedagang besar &amp; pengecer mendistribusikan produk; pelanggan membeli produk; kompetitor bersaing.</p>
<p><strong>Stakeholder sekunder</strong> tidak bertransaksi langsung tapi memengaruhi dan dipengaruhi: pemerintah
(pusat/daerah maupun asing) lewat regulasi &amp; pajak; komunitas lokal lewat lapangan kerja &amp; lingkungan; media
lewat citra dan publisitas; kelompok aktivis sosial lewat tuntutan sosial; kelompok pendukung bisnis lewat nasihat
&amp; riset; serta masyarakat umum lewat opini positif atau negatif.</p>
<p><strong>Cara memakainya untuk menganalisis kasus:</strong> (1) petakan siapa saja yang terdampak, (2) tentukan apa
klaim/kepentingan tiap pihak, (3) identifikasi di mana klaim itu bertabrakan, (4) baru ambil keputusan dengan
menyebut secara eksplisit kepentingan siapa yang Anda dahulukan dan mengapa. Struktur inilah yang dicari dosen dalam
jawaban ujian esai.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Primer = terhubung lewat transaksi ekonomi langsung (karyawan,
pemegang saham, pemasok, pelanggan, kreditor, distributor, kompetitor). Sekunder = memengaruhi/dipengaruhi tanpa
transaksi langsung (pemerintah, komunitas, media, aktivis, publik). Analisis kasus selalu dimulai dari peta ini.</div>`
        },
        {
          heading: "Sustainability & Triple Bottom Line",
          source: { kind: "ppt", label: "Slide Chapter 1 + deck Prof. Eko" },
          body: `<p>Ini tema besar kedua mata kuliah (ada di judulnya: Business Ethics <em>for Business
Sustainability</em>). Definisi yang dipakai dosen, dari Savitz (2006):</p>
<p><em>"A sustainable corporation is one that creates profit for stockholders while protecting the environment and
improving the lives of those with whom it interacts."</em> — dan sustainability disebut sebagai
<em>"the art of doing business in an interdependent world"</em>.</p>
<h4 class="sub-h">Tiga dimensi triple bottom line</h4>
[[visual:besTBL]]
<p>Perhatikan ukuran konkret tiap dimensi yang dipakai di slide — ini yang membedakan konsep dari sekadar jargon:</p>
<ul>
<li><strong>Economics:</strong> penjualan, laba, ROI, pajak yang dibayar, aliran uang, lapangan kerja yang tercipta.</li>
<li><strong>Environment:</strong> kualitas udara, kualitas air, penggunaan energi, limbah yang dihasilkan.</li>
<li><strong>Social:</strong> praktik ketenagakerjaan, dampak pada komunitas, hak asasi manusia, tanggung jawab produk.</li>
</ul>
<p>Inti gagasannya: bisnis yang sukses menciptakan nilai jangka panjang <strong>tanpa merusak masyarakat dan
lingkungan alam</strong>. Ketiga dimensi ini sering menuntut <em>trade-off</em> — dan mengelola trade-off itulah
pekerjaan etis manajer.</p>
<h4 class="sub-h">Sebelas peran perusahaan (de Woot, 1982)</h4>
<p>Slide dosen menampilkan tipologi peran perusahaan di masyarakat. Empat yang disorot:</p>
<ul>
<li><strong>Profit maximiser:</strong> laba mendominasi; dimensi sosial dianggap penghambat laba; menghindari keterlibatan politik.</li>
<li><strong>Defender of free enterprise:</strong> "the business of business is business"; bereaksi menolak komponen sosial; membela perusahaan bebas.</li>
<li><strong>Socially progressive:</strong> tetap mengutamakan laba, tapi terlibat interaktif secara sosial dan positif dalam perumusan kebijakan industri.</li>
<li><strong>Global actor:</strong> mengutamakan laba, terlibat interaktif, dan memikul tanggung jawab menjaga keseimbangan antara kebijakan ekonomi nasional dan internasional.</li>
</ul>
<p>Gunakan tipologi ini untuk memposisikan perusahaan dalam studi kasus: perusahaan yang Anda analisis sedang berperan
sebagai yang mana?</p>
<div class="key-box"><strong>💡 Intinya:</strong> Sustainability = untung bagi pemegang saham <em>sambil</em> melindungi
lingkungan dan memperbaiki kehidupan pihak yang berinteraksi dengannya. Triple bottom line = economic + environmental
+ social, masing-masing dengan ukuran konkret. Peran perusahaan bergerak dari profit maximiser sampai global actor.</div>`
        },
        {
          heading: "Globalisasi & Perbedaan Pendekatan Antar-Kawasan",
          source: { kind: "ppt", label: "Slide Chapter 1" },
          body: `<p>Globalisasi membuat etika bisnis makin rumit karena organisasi beroperasi lintas negara. Sebuah
perusahaan multinasional bisa merancang produk di satu negara, memproduksinya di negara lain, mengambil bahan baku
dari beberapa negara, dan menjualnya ke seluruh dunia.</p>
<p>Pertanyaan etis yang lahir dari situ: <em>Standar ketenagakerjaan mana yang harus diikuti? Haruskah perusahaan
mengikuti praktik lokal bila bertentangan dengan prinsip HAM internasional? Siapa yang bertanggung jawab atas praktik
buruk di rantai pasok? Haruskah standar etika seragam di semua negara?</em></p>
<h4 class="sub-h">Tiga pendekatan kawasan (pola umum, bukan stereotip)</h4>
[[visual:besRegions]]
<p>Pelajarannya: etika dipengaruhi budaya, institusi politik, sistem ekonomi, dan ekspektasi sosial. Manajer global
perlu peka terhadap konteks <em>sambil</em> tetap memegang prinsip etis yang bisa dipertahankan.</p>
<h4 class="sub-h">Relativisme etika — perdebatan klasik</h4>
<p>Deck dosen mengangkat posisi relativisme: <em>"tidak ada standar etis yang mutlak benar dan berlaku untuk
perusahaan dan orang di semua masyarakat."</em> Tapi segera disandingkan dengan posisi tandingannya:
<strong>"standar etis bersifat universal, penerapannya yang bisa berbeda-beda."</strong> Perbedaan dua kalimat ini
adalah bahan diskusi yang sangat mungkin muncul di ujian — pastikan Anda punya posisi beserta alasannya.</p>
<div class="case-box"><p><strong>📌 Kasus Chapter 1 — "Global McEthics":</strong> haruskah standar etika distandarkan
secara global? McDonald's menghadapi kritik soal kesehatan &amp; gizi, ketenagakerjaan, kesejahteraan hewan, dan
globalisasi. Dilema intinya: <strong>konsistensi global vs adaptasi lokal</strong>. Tujuan diskusi bukan memutuskan
perusahaan ini baik atau buruk, melainkan menganalisis tanggung jawab, stakeholder, konsekuensi, dan alternatifnya.</p></div>
<div class="key-box"><strong>💡 Intinya:</strong> Globalisasi memperluas jangkauan bisnis sekaligus kompleksitas
tanggung jawabnya. Amerika Utara menekankan tanggung jawab individu &amp; kode etik; Eropa menekankan institusi,
regulasi, dan kontrol sosial kolektif; Asia menekankan tata kelola, relasi pemerintah–korporasi, dan diskresi
manajemen puncak.</div>`
        },
        {
          heading: "Siapa yang Bertanggung Jawab: Individu atau Korporasi?",
          source: { kind: "ppt", label: "Deck Prof. Eko Suwardi" },
          body: `<p>Pertanyaan yang tampak sederhana tapi menjadi perdebatan panjang: ketika sebuah perusahaan
melakukan pelanggaran etis, <strong>siapa yang bertanggung jawab secara moral?</strong> Deck dosen menyajikan tiga
posisi:</p>
<ul>
<li><strong>Korporasi bertanggung jawab secara moral atas tindakannya.</strong> Korporasi punya struktur pengambilan
keputusan, kebijakan, dan budaya sendiri yang melampaui individu di dalamnya.</li>
<li><strong>Hanya individu yang bertanggung jawab secara moral.</strong> Korporasi hanyalah fiksi hukum; yang
bertindak, memutuskan, dan bisa disalahkan hanyalah manusia.</li>
<li><strong>Posisi tengah:</strong> individu bertanggung jawab lebih dulu, baru korporasi — karena individulah yang
bertindak untuk perusahaan. Etika bisnis berlaku pada korporasi <em>jika anggota korporasi itu etis</em>.</li>
</ul>
<h4 class="sub-h">Isu sistemik</h4>
<p>Di atas level individu dan korporasi ada level ketiga: <strong>systemic issues</strong> — pertanyaan etis tentang
sistem ekonomi, politik, hukum, dan sosial tempat bisnis beroperasi. Misalnya: moralitas kapitalisme itu sendiri,
keadilan suatu undang-undang, struktur industri yang oligopolistik, atau praktik sosial yang diterima luas tapi
merugikan. Level ini penting karena sebagian masalah etika tidak bisa diselesaikan hanya dengan mengganti manajer
yang nakal.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Tiga level analisis etika bisnis — <strong>sistemik</strong>
(sistem ekonomi/hukum/sosial), <strong>korporasi</strong> (kebijakan &amp; budaya organisasi), dan
<strong>individu</strong> (keputusan orang per orang). Soal ujian sering meminta Anda mengidentifikasi kasus ada di
level yang mana.</div>`
        }
      ] },
    { id: 2, date: "2026-08-15", dateLabel: "15 Agustus 2026", topic: "Framing Business Ethics",
      subtopics: ["Kontekstualisasi etika bisnis & stakeholder-nya"], readings: ["CM bab 2"], caseStudy: "Diskusi kasus + presentasi kelompok",
      summary: [
        {
          heading: "Framing Business Ethics — Peta Sesi Ini",
          source: { kind: "book", label: "CM bab 2 · bahan persiapan" },
          body: `<p>Setelah Sesi 1 mendefinisikan <em>apa itu</em> business ethics, Sesi 2 menjawab
<strong>siapa aktornya dan atas dasar apa tanggung jawabnya</strong>. Ini bab yang memasok kerangka untuk seluruh
sisa mata kuliah, jadi kuasai kosakatanya.</p>
<h4 class="sub-h">Empat konsep inti yang dibingkai bab ini</h4>
<ul>
<li><strong>Corporate Social Responsibility (CSR)</strong> — gagasan bahwa perusahaan punya tanggung jawab melampaui
kewajiban ekonomi dan hukumnya. Kerangka paling terkenal: <em>piramida Carroll</em> dengan empat lapis tanggung
jawab — <em>economic</em> (menghasilkan laba, fondasinya), <em>legal</em> (patuh hukum), <em>ethical</em> (melakukan
yang benar meski tak diwajibkan), dan <em>philanthropic</em> (berkontribusi pada masyarakat).</li>
<li><strong>Stakeholder theory</strong> — perusahaan bertanggung jawab bukan hanya kepada pemegang saham
(<em>shareholder view</em> ala Milton Friedman: "the social responsibility of business is to increase its profits"),
melainkan kepada semua pihak yang memengaruhi atau dipengaruhi pencapaian tujuan perusahaan. Bandingkan dengan peta
stakeholder primer &amp; sekunder yang sudah Anda pelajari di Sesi 1.</li>
<li><strong>Corporate citizenship</strong> — memandang korporasi sebagai "warga negara" yang punya hak dan kewajiban
dalam masyarakat, bahkan kadang mengambil alih peran yang biasanya dijalankan pemerintah (menyediakan layanan sosial,
melindungi hak) — terutama ketika pemerintah lemah atau di negara berkembang.</li>
<li><strong>Corporate accountability &amp; sustainability</strong> — kewajiban perusahaan untuk transparan dan dapat
dimintai pertanggungjawaban atas dampaknya, dilaporkan lewat sustainability/ESG reporting.</li>
</ul>
<h4 class="sub-h">Pertanyaan yang membingkai perdebatan</h4>
<p>Bab ini pada dasarnya memperdebatkan dua pertanyaan besar: <em>(1) Apakah korporasi bisa memikul tanggung jawab
moral?</em> — menyambung langsung diskusi "individu vs korporasi" di Sesi 1. <em>(2) Kepada siapa perusahaan
bertanggung jawab?</em> — inilah perdebatan shareholder vs stakeholder yang menjadi tulang punggung mata kuliah.</p>
<div class="key-box"><strong>💡 Siapkan untuk kelas:</strong> hafalkan empat lapis piramida Carroll berurut, bisa
menjelaskan beda shareholder view (Friedman) vs stakeholder view, dan siapkan satu contoh perusahaan Indonesia yang
menurut Anda menjalankan corporate citizenship. Ingat: <strong>diskusi &amp; partisipasi bernilai 30%</strong> di mata
kuliah ini — bobot terbesar, lebih besar dari UTS maupun UAS.</div>`
        },
        {
          heading: "Cara Menganalisis Kasus & Aturan Main Penilaian",
          source: { kind: "ppt", label: "Silabus + praktik kelas" },
          body: `<p>Mulai Sesi 2, tiap pertemuan berisi <strong>diskusi kasus dan presentasi kelompok</strong>. Karena
formatnya berulang sampai akhir semester, kuasai polanya sekarang.</p>
<h4 class="sub-h">Aturan main dari silabus</h4>
<ul>
<li><strong>Tugas individu:</strong> ringkasan bab <em>satu halaman</em> + jawaban atas kasus/artikel terpilih
<em>maksimal dua halaman</em>.</li>
<li><strong>Tugas kelompok:</strong> analisis masalah dalam kasus + usulan solusi terbaik, disajikan dalam
<strong>presentasi kreatif 15 menit</strong>. Kelompok yang tidak presentasi <em>wajib</em> memberi umpan balik
konstruktif dan pertanyaan. <strong>Tiap mahasiswa mendapat nilai presentasi individual.</strong></li>
<li><strong>Bobot nilai:</strong> diskusi &amp; partisipasi 30% · UTS 25% · UAS 25% · tugas 20%.</li>
<li><strong>Kehadiran:</strong> ketepatan waktu dan kehadiran rutin sangat penting; jika ada keadaan darurat yang
membuat terlambat, hubungi dosen sebelumnya.</li>
</ul>
<h4 class="sub-h">Kerangka lima langkah menganalisis kasus etika</h4>
<p>Gabungan dari peta stakeholder (Sesi 1) dan teori etika (Sesi 3) menghasilkan alur yang bisa Anda pakai berulang:</p>
<ul>
<li><strong>1. Fakta.</strong> Apa yang sebenarnya terjadi? Pisahkan fakta dari asumsi dan opini.</li>
<li><strong>2. Isu etis.</strong> Rumuskan dilemanya sebagai pertanyaan benar–salah, bukan sekadar masalah bisnis.
Tanyakan juga: ini isu di level sistemik, korporasi, atau individu?</li>
<li><strong>3. Stakeholder.</strong> Siapa terdampak, apa klaim masing-masing, di mana klaim itu bertabrakan?</li>
<li><strong>4. Analisis dengan prinsip.</strong> Terapkan lebih dari satu lensa — konsekuensi (utilitarian), hak
(rights), keadilan (justice) — dan tunjukkan bila lensa yang berbeda memberi jawaban berbeda.</li>
<li><strong>5. Putusan &amp; alternatif.</strong> Ambil posisi, sebutkan alasannya, dan tunjukkan alternatif yang
Anda tolak beserta alasan penolakannya. Silabus secara eksplisit meminta kemampuan
<em>"provide a variety of possible solutions"</em> — jangan berhenti pada satu solusi.</li>
</ul>
<div class="key-box"><strong>💡 Intinya:</strong> Kualitas jawaban di mata kuliah ini diukur dari <em>struktur
penalaran</em>, bukan dari "menebak jawaban yang benar". Selalu: fakta → isu etis → stakeholder → analisis
multi-lensa → putusan + alternatif.</div>`
        }
      ] },
    { id: 3, date: "2026-08-28", dateLabel: "28 Agustus 2026", topic: "Evaluating Business Ethics",
      subtopics: ["Teori-teori etika normatif", "Mengevaluasi konsep etika bisnis"], readings: ["CM bab 3"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 4, date: "2026-08-29", dateLabel: "29 Agustus 2026", topic: "Making Decisions in Business Ethics",
      subtopics: ["Pengambilan keputusan etis", "Ethical leadership"], readings: ["CM bab 4"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 5, date: "2026-09-19", dateLabel: "19 September 2026", topic: "Managing Business Ethics",
      subtopics: ["Alat & teknik manajemen etika bisnis"], readings: ["CM bab 5"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 6, date: "2026-09-19", dateLabel: "19 September 2026", topic: "Shareholders and Business Ethics",
      subtopics: ["Hubungan pemegang saham & etika bisnis", "Corporate governance"], readings: ["CM bab 6"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 7, date: "2026-10-24", dateLabel: "24 Oktober 2026", topic: "Employees and Business Ethics",
      subtopics: ["Hak & kewajiban karyawan", "Diskriminasi, privasi, whistleblowing"], readings: ["CM bab 7"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 8, date: "2026-10-24", dateLabel: "24 Oktober 2026", topic: "Consumers and Business Ethics",
      subtopics: ["Etika pemasaran & perlindungan konsumen"], readings: ["CM bab 8"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 9, date: "2026-11-06", dateLabel: "6 November 2026", topic: "Suppliers, Competitors, and Business Ethics",
      subtopics: ["Etika rantai pasok", "Persaingan sehat"], readings: ["CM bab 9"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 10, date: "2026-11-07", dateLabel: "7 November 2026", topic: "Civil Society and Business Ethics",
      subtopics: ["LSM, komunitas, dan bisnis"], readings: ["CM bab 10"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 11, date: "2026-11-21", dateLabel: "21 November 2026", topic: "Government, Regulation, and Business Ethics",
      subtopics: ["Peran pemerintah & regulasi"], readings: ["CM bab 11"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null },
    { id: 12, date: "2026-11-21", dateLabel: "21 November 2026", topic: "Future Perspectives, Corporate Governance & Ethics of Technology",
      subtopics: ["Perspektif masa depan etika bisnis", "Etika & teknologi"], readings: ["CM bab 12", "Modul/handout"], caseStudy: "Diskusi kasus + presentasi kelompok", summary: null }
  ],
  flashcards: [
    { session: 1, front: "Definisi business ethics menurut Crane & Matten.", back: "Studi tentang situasi, aktivitas, dan keputusan bisnis di mana persoalan benar dan salah secara MORAL muncul — berlaku untuk organisasi swasta, publik, maupun masyarakat sipil." },
    { session: 1, front: "Lengkapi: \"Business ethics begins where ___ ends.\"", back: "…where the LAW ends. Hukum menetapkan standar minimum; etika menangani isu yang belum diatur hukum atau yang belum ada konsensus benar-salahnya." },
    { session: 1, front: "Bedakan morality, ethics, dan ethical theory.", back: "Morality = norma/nilai/keyakinan yang tertanam sosial tentang benar-salah. Ethics = studi sistematis atas moralitas dengan penalaran. Ethical theory = aturan & prinsip terstruktur hasilnya (utilitarianisme, hak, keadilan, virtue)." },
    { session: 1, front: "Beri contoh tindakan yang legal tetapi tidak etis.", back: "Mematuhi ambang batas emisi tapi tetap menghasilkan polusi yang bisa dihindari; skema penghindaran pajak agresif yang sah menurut huruf hukum; pemasaran yang legal tapi menyesatkan konsumen rentan." },
    { session: 1, front: "Mengapa business ethics penting? (4 alasan deck dosen)", back: "1) Bisnis pemain utama ekonomi; 2) penyedia lapangan kerja utama; 3) sumber pendapatan utama masyarakat; 4) korporasi adalah institusi legal 'pribadi fiktif yang tak pernah mati' dengan pengaruh besar pada sosial, budaya, dan politik." },
    { session: 1, front: "Sebutkan stakeholder PRIMER sebuah perusahaan.", back: "Karyawan (& serikat), pemegang saham, kreditor, pemasok, pelanggan, pedagang besar/pengecer, dan kompetitor — semuanya terhubung lewat transaksi ekonomi langsung." },
    { session: 1, front: "Sebutkan stakeholder SEKUNDER sebuah perusahaan.", back: "Pemerintah (pusat/daerah/asing), komunitas lokal, masyarakat umum, media, kelompok aktivis sosial, dan kelompok pendukung bisnis — memengaruhi/dipengaruhi tanpa transaksi langsung." },
    { session: 1, front: "Definisi sustainable corporation menurut Savitz (2006).", back: "Perusahaan yang menciptakan laba bagi pemegang saham SAMBIL melindungi lingkungan dan memperbaiki kehidupan pihak-pihak yang berinteraksi dengannya. Sustainability = 'the art of doing business in an interdependent world'." },
    { session: 1, front: "Sebutkan tiga dimensi triple bottom line beserta contoh ukurannya.", back: "Economics (penjualan, laba, ROI, pajak, lapangan kerja) · Environment (kualitas udara & air, penggunaan energi, limbah) · Social (praktik ketenagakerjaan, dampak komunitas, HAM, tanggung jawab produk)." },
    { session: 1, front: "Tiga level analisis etika bisnis?", back: "Sistemik (sistem ekonomi, politik, hukum, sosial) · Korporasi (kebijakan & budaya organisasi) · Individu (keputusan orang per orang)." },
    { session: 1, front: "Apa isi perdebatan relativisme etika di deck dosen?", back: "Posisi relativis: tidak ada standar etis yang mutlak berlaku untuk semua masyarakat. Posisi tandingan: standar etis bersifat universal, hanya PENERAPANNYA yang bisa berbeda-beda antar-konteks." },
    { session: 1, front: "Bandingkan pendekatan etika bisnis Eropa, Amerika Utara, dan Asia.", back: "Eropa: kontrol sosial kolektif, peran pemerintah & serikat, kerangka hukum hasil negosiasi. Amerika Utara: tanggung jawab individu, korporasi sebagai aktor kunci, kode etik. Asia: diskresi manajemen puncak, relasi pemerintah–korporasi, tata kelola & akuntabilitas." },
    { session: 2, front: "Sebutkan empat lapis piramida CSR Carroll dari bawah ke atas.", back: "1) Economic (menghasilkan laba — fondasi), 2) Legal (patuh hukum), 3) Ethical (melakukan yang benar meski tak diwajibkan), 4) Philanthropic (berkontribusi pada masyarakat)." },
    { session: 2, front: "Apa beda shareholder view (Friedman) dan stakeholder view?", back: "Shareholder view: tanggung jawab sosial bisnis adalah meningkatkan labanya untuk pemegang saham. Stakeholder view: perusahaan bertanggung jawab kepada semua pihak yang memengaruhi atau dipengaruhi pencapaian tujuannya." },
    { session: 2, front: "Apa itu corporate citizenship?", back: "Memandang korporasi sebagai 'warga negara' dengan hak dan kewajiban dalam masyarakat — kadang mengambil alih peran yang biasanya dijalankan pemerintah, terutama ketika negara lemah atau di negara berkembang." },
    { session: 2, front: "Lima langkah menganalisis kasus etika bisnis?", back: "1) Fakta (pisahkan dari asumsi), 2) rumuskan isu etisnya + tentukan levelnya, 3) petakan stakeholder & klaimnya, 4) analisis multi-lensa (konsekuensi, hak, keadilan), 5) ambil putusan + tunjukkan alternatif yang ditolak beserta alasannya." },
    { session: 2, front: "Bobot penilaian mata kuliah Business Ethics?", back: "Diskusi & partisipasi 30% (terbesar!) · UTS 25% · UAS 25% · Tugas individu & kelompok 20%." },
    { session: 2, front: "Format tugas individu dan kelompok BES?", back: "Individu: ringkasan bab 1 halaman + jawaban kasus/artikel maks. 2 halaman. Kelompok: analisis masalah + solusi terbaik dalam presentasi kreatif 15 menit; kelompok non-presenter wajib memberi pertanyaan & masukan; nilai presentasi bersifat individual." }
  ],
  quizzes: [
    {
      session: 1,
      questions: [
        { q: "Menurut Crane & Matten, business ethics adalah studi tentang…", options: ["Cara memaksimalkan laba secara legal", "Situasi, aktivitas, dan keputusan bisnis di mana persoalan benar dan salah secara moral muncul", "Peraturan perundang-undangan yang mengikat perusahaan", "Tata cara penyusunan laporan keberlanjutan"], answer: 1, explain: "Definisi resmi yang dipakai di kelas — perhatikan kata 'morally right and wrong', bukan sekadar legal atau komersial." },
        { q: "Pernyataan yang paling tepat tentang hubungan etika dan hukum adalah…", options: ["Semua yang legal pasti etis", "Etika dan hukum adalah dua hal yang identik", "Hukum menetapkan standar minimum; etika sering menuntut lebih dari itu", "Etika hanya berlaku ketika tidak ada hukum sama sekali"], answer: 2, explain: "'Business ethics begins where the law ends.' Perusahaan bisa legal tapi tidak etis — mis. patuh ambang emisi tapi tetap mencemari secara berlebihan." },
        { q: "Norma, nilai, dan keyakinan yang tertanam dalam proses sosial dan mendefinisikan benar-salah bagi suatu komunitas disebut…", options: ["Ethics", "Morality", "Ethical theory", "Corporate governance"], answer: 1, explain: "Morality = norma/nilai yang ADA. Ethics = refleksi sistematis atasnya. Ethical theory = kerangka terstruktur hasil refleksi itu." },
        { q: "Manakah yang termasuk stakeholder SEKUNDER?", options: ["Pemasok bahan baku", "Karyawan dan serikat pekerja", "Media dan kelompok aktivis sosial", "Pemegang saham"], answer: 2, explain: "Stakeholder sekunder memengaruhi/dipengaruhi tanpa transaksi ekonomi langsung: media, aktivis, pemerintah, komunitas, publik umum." },
        { q: "Menurut Savitz (2006), sustainable corporation adalah perusahaan yang…", options: ["Berfokus penuh pada pelestarian lingkungan meski merugi", "Menciptakan laba bagi pemegang saham sambil melindungi lingkungan dan memperbaiki kehidupan pihak yang berinteraksi dengannya", "Mematuhi seluruh regulasi lingkungan yang berlaku", "Menyisihkan sebagian laba untuk kegiatan filantropi"], answer: 1, explain: "Definisi Savitz menekankan ketiganya sekaligus — laba, lingkungan, dan kehidupan orang-orang di sekitarnya. Bukan memilih salah satu." },
        { q: "'Kualitas air, penggunaan energi, dan limbah yang dihasilkan' adalah ukuran dimensi triple bottom line yang mana?", options: ["Economics", "Environment", "Social", "Governance"], answer: 1, explain: "Environment. Dimensi Social diukur lewat praktik ketenagakerjaan, dampak komunitas, HAM, dan tanggung jawab produk." },
        { q: "Pertanyaan tentang moralitas kapitalisme, keadilan suatu undang-undang, dan struktur industri berada pada level analisis…", options: ["Individu", "Korporasi", "Sistemik", "Operasional"], answer: 2, explain: "Systemic issues = pertanyaan etis tentang sistem ekonomi, politik, hukum, dan sosial tempat bisnis beroperasi." },
        { q: "Kasus 'Global McEthics' pada bab 1 mengangkat dilema utama tentang…", options: ["Legal vs ilegal dalam pemasaran makanan", "Konsistensi standar etika global vs adaptasi terhadap ekspektasi lokal", "Tanggung jawab individu vs korporasi", "Laba jangka pendek vs jangka panjang"], answer: 1, explain: "Inti kasusnya: haruskah multinasional menerapkan standar etika yang sama di semua negara, atau menyesuaikannya dengan budaya lokal?" },
        { q: "Dalam kasus gagal ginjal akut pada anak (2022), dosen menyarankan membandingkannya dengan kasus…", options: ["Enron", "Johnson & Johnson (penarikan produk terkontaminasi)", "Lapindo", "Sub prime mortgage"], answer: 1, explain: "Perbandingan klasik: J&J menarik produknya secara proaktif saat terjadi kontaminasi pada proses pembungkusan — pembanding untuk menilai kecepatan dan tanggung jawab penanganan." },
        { q: "Peran perusahaan yang 'mengutamakan laba, terlibat interaktif secara sosial, dan positif dalam perumusan kebijakan industri' disebut (de Woot)…", options: ["Profit maximiser", "Defender of free enterprise", "Socially progressive", "Global actor"], answer: 2, explain: "Socially progressive. Global actor melangkah lebih jauh: memikul tanggung jawab menyeimbangkan kebijakan ekonomi nasional dan internasional." }
      ]
    }
  ]
};
