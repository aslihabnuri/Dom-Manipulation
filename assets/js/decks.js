/* ============================================================
   BEfS Study Hub — Panduan Kuliah (slide dosen)
   Sumber: berkas PPT di folder Drive "Materi".
   Kode (1) = pertemuan pertama, (2) = pertemuan kedua.

   Deck ini menjadi PEDOMAN urutan pembelajaran: pada halaman
   materi ia tampil lebih dulu, baru diikuti rangkuman buku.

   Struktur tiap slide:
     n       nomor slide
     title   judul slide
     sub     subjudul
     lead    kalimat kunci yang ditonjolkan (opsional)
     points  daftar butir (opsional)
     groups  kelompok butir berkolom (opsional)
     table   tabel {cols, rows} (opsional)
     chain   alur bertahap (opsional)
     prompt  pertanyaan/instruksi untuk kelas (opsional)
     note    catatan penjelasan dosen di bawah slide
   ============================================================ */

window.BEFS_DECKS = [

/* ==========================================================
   PERTEMUAN 1 — Chapter 1
   ========================================================== */
{
  ch: 1,
  meeting: 1,
  title: "Introducing Business Ethics",
  subtitle: "Slide pointers for Chapter 1",
  themes: "Ethics · Law · Globalization · Sustainability",
  source: "Crane, Matten, Glozer &amp; Spence (2019), Chapter 1",
  file: "Chapter_1_with_Explanatory_Notes (1).pptx",
  fileUrl: "https://drive.google.com/file/d/1-8XGJkhx82VhHH1-6RIsAMuDozr-N1q0/view",
  intro: "Bab ini memperkenalkan makna dasar dan pentingnya etika bisnis. Keputusan bisnis bukan sekadar keputusan ekonomi — ia juga menyangkut benar dan salah, keadilan, tanggung jawab, dan dampaknya pada orang lain. Bab ini juga memperkenalkan dua tema besar yang berlanjut sepanjang buku: <strong>globalisasi</strong> dan <strong>sustainability</strong>.",

  slides: [
    {
      n: 2, title: "Learning objectives", sub: "Yang harus bisa kamu jelaskan setelah bab ini",
      points: [
        "<strong>Define</strong> business ethics sebagai bidang kajian",
        "<strong>Distinguish</strong> ethics, morality, dan ethical theory",
        "Menjelaskan hubungan <strong>ethics dan law</strong>",
        "Membahas mengapa etika bisnis penting bagi manajer dan masyarakat",
        "Mengenali <strong>globalisasi</strong> sebagai konteks kunci",
        "Memakai <strong>sustainability dan triple bottom line</strong> sebagai lensa"
      ],
      chain: ["Define", "Distinguish", "Apply", "Evaluate"],
      prompt: "Tujuannya: penilaian etis yang lebih baik — bukan sekadar “jawaban yang benar”.",
      note: "Penekanannya bukan menghafal definisi. Kamu diharapkan mulai mengembangkan kemampuan mengenali dan menalar persoalan etis."
    },
    {
      n: 3, title: "What is business ethics?", sub: "Definisi inti dan cakupannya",
      lead: "Business ethics studies business situations, activities, and decisions where questions of <strong>morally right and wrong</strong> arise.",
      points: [
        "Tidak terbatas pada perusahaan pencari laba",
        "Berlaku untuk organisasi <strong>publik, swasta, dan masyarakat sipil</strong>",
        "Menyangkut benar-salah <strong>moral</strong> — bukan sekadar komersial"
      ],
      prompt: "Teaching prompt: coba definisikan “etika bisnis sebuah organisasi” dalam satu kalimat.",
      note: "Definisi ini menempatkan etika di dalam aktivitas bisnis normal. Isu etis tidak terbatas pada skandal besar seperti korupsi atau penipuan. Ia muncul pada keputusan sehari-hari yang melibatkan karyawan, pelanggan, pemasok, pemegang saham, komunitas, atau lingkungan. Contohnya: keputusan harga bisa rasional secara ekonomi tetapi tetap menimbulkan pertanyaan keadilan; kampanye pemasaran bisa legal tetapi menyesatkan konsumen yang rentan."
    },
    {
      n: 4, title: "Ethics and law", sub: "Etika bisnis sering dimulai di titik aturan hukum tidak lengkap",
      points: [
        "Hukum menetapkan <strong>batas minimum</strong> perilaku yang dapat diterima",
        "Sebagian isu etis <strong>belum diatur</strong> secara hukum",
        "Sebagian persoalan hukum <strong>bukan dilema moral</strong>",
        "Perdebatan etis dapat <strong>membentuk hukum</strong> di kemudian hari"
      ],
      prompt: "Class question: bisakah suatu tindakan legal tetapi tetap tidak etis? Berikan satu contoh bisnis terkini.",
      note: "Sebuah perusahaan bisa saja memenuhi regulasi lingkungan secara teknis sambil tetap menghasilkan polusi yang tidak perlu, atau memakai skema pajak agresif yang memenuhi bunyi hukum tetapi mempertanyakan tanggung jawab sosialnya. Pelajarannya: kepatuhan hukum adalah syarat minimum; tanggung jawab etis bisa menuntut lebih."
    },
    {
      n: 5, title: "Morality, ethics, and ethical theory", sub: "Tiga gagasan yang terkait tetapi berbeda",
      groups: [
        { h: "1 · Morality", items: ["Norma, nilai, dan keyakinan tentang benar dan salah"] },
        { h: "2 · Ethics", items: ["Refleksi sistematis atas moralitas dan pilihan moral"] },
        { h: "3 · Ethical theory", items: ["Kerangka terstruktur untuk mengevaluasi dilema"] }
      ],
      prompt: "Teaching point: etika bisnis lebih sedikit soal kepastian, lebih banyak soal mengembangkan penilaian yang beralasan.",
      note: "Penalaran etis bukan sekadar pendapat pribadi. Teori etika membantu mengembangkan penilaian yang disiplin dan dapat dipertahankan. Bab-bab berikutnya membahas utilitarianism, rights, justice, virtue ethics, dan ethics of care."
    },
    {
      n: 6, title: "Why business ethics matters", sub: "Sebagai bidang akademik sekaligus persoalan manajerial",
      groups: [
        { h: "Alasan kemasyarakatan", items: [
          "Bisnis punya kekuatan dan pengaruh sosial yang besar",
          "Bisnis dapat menciptakan nilai dan memecahkan masalah",
          "Bisnis juga dapat menimbulkan kerugian",
          "Kegagalan etis merusak kepercayaan dan legitimasi"
        ]},
        { h: "Alasan manajerial", items: [
          "Manajer menghadapi tekanan nyata dan ambiguitas moral",
          "Media, LSM, konsumen, dan karyawan mengawasi perusahaan",
          "Perusahaan global melintasi batas hukum dan budaya",
          "Etika bisnis membantu menyusun keputusan yang lebih baik"
        ]}
      ],
      note: "Manajer rutin menghadapi situasi ketika kepentingan stakeholder bertabrakan: pemegang saham ingin imbal hasil lebih tinggi, karyawan menuntut kondisi kerja lebih baik, pelanggan ingin harga lebih murah, pemerintah menuntut kepatuhan, komunitas mengharapkan perlindungan lingkungan. Manajer memerlukan penilaian etis untuk menyeimbangkan klaim yang bersaing itu."
    },
    {
      n: 7, title: "Business ethics across organizational contexts", sub: "Isu etis berbeda menurut tujuan dan akuntabilitas organisasi",
      table: {
        cols: ["Konteks", "Akuntabilitas utama", "Fokus etis khas"],
        rows: [
          ["Private firms", "Pemilik/pemegang saham, pelanggan, karyawan", "Laba, kejujuran berdagang, rantai pasok"],
          ["Public sector", "Warga negara, hukum, pengawasan pemerintah", "Rule of law, korupsi, konflik kepentingan"],
          ["Civil society", "Penerima manfaat, donor, misi publik", "Akuntabilitas, legitimasi, mission drift"]
        ]
      },
      prompt: "Key point: etika bisnis berlaku melampaui korporasi komersial.",
      note: "Tanggung jawab etis ada di mana pun keputusan organisasi memengaruhi orang. Namun tantangan etis spesifiknya berbeda tergantung tujuan, struktur, dan stakeholder organisasi tersebut."
    },
    {
      n: 8, title: "Globalization as a key context", sub: "Pertanyaan etis kini melintasi batas negara",
      points: [
        "<strong>Markets</strong> · <strong>Supply chains</strong> · <strong>Culture</strong> · <strong>Climate</strong> · <strong>Technology</strong>",
        "Globalisasi meningkatkan saling ketergantungan",
        "Mempercepat risiko reputasi",
        "Memaparkan perusahaan pada ekspektasi moral yang berbeda-beda"
      ],
      note: "Sebuah perusahaan multinasional bisa merancang produk di satu negara, memproduksinya di negara lain, memperoleh bahan baku dari beberapa negara, dan menjualnya ke seluruh dunia. Ini memunculkan pertanyaan: standar ketenagakerjaan mana yang harus diikuti? Haruskah mengikuti praktik lokal bila bertentangan dengan prinsip HAM internasional? Siapa bertanggung jawab atas praktik berbahaya di rantai pasok? Haruskah standar etis seragam di semua negara?"
    },
    {
      n: 9, title: "International perspectives", sub: "Etika bisnis tidak ditafsirkan sama di mana-mana",
      groups: [
        { h: "Europe", items: [
          "Kontrol sosial kolektif",
          "Pemerintah dan serikat pekerja sentral",
          "Kerangka hukum hasil negosiasi",
          "Orientasi multi-stakeholder"
        ]},
        { h: "North America", items: [
          "Tanggung jawab individual",
          "Korporasi sebagai aktor kunci",
          "Codes of ethics",
          "Fokus pada misconduct dan situasi keputusan"
        ]},
        { h: "Asia", items: [
          "Diskresi manajemen puncak",
          "Pemerintah dan korporasi sebagai aktor kunci",
          "Corporate governance dan akuntabilitas",
          "Pendekatan stakeholder yang implisit"
        ]}
      ],
      prompt: "Pakai dengan hati-hati: ini pola perbandingan umum, bukan stereotip untuk setiap negara atau organisasi.",
      note: "Etika dipengaruhi budaya, institusi politik, sistem ekonomi, dan ekspektasi sosial. Manajer yang beroperasi secara global perlu peka terhadap konteks yang berbeda sambil tetap memegang prinsip etis yang dapat dipertahankan."
    },
    {
      n: 10, title: "Sustainability as a key goal", sub: "Etika bisnis melampaui laba jangka pendek",
      lead: "Triple Bottom Line: <strong>Environmental · Social · Economic</strong>",
      points: [
        "Pemeliharaan sistem dalam jangka panjang",
        "Mencakup pertimbangan lingkungan, ekonomi, dan sosial",
        "Menghubungkan etika bisnis dengan sustainable development",
        "Menuntut perhatian pada <strong>trade-off antardimensi</strong>"
      ],
      note: "Economic sustainability berarti organisasi harus tetap layak secara ekonomi. Environmental sustainability berarti bisnis melindungi sistem ekologi dan menghindari penipisan sumber daya alam berlebihan. Social sustainability berarti bisnis berkontribusi pada kesejahteraan manusia, keadilan, inklusi, dan komunitas yang sehat."
    },
    {
      n: 11, title: "Ethical impacts of globalization", sub: "Pertanyaan kunci per kelompok stakeholder",
      table: {
        cols: ["Stakeholder", "Isu etis utama"],
        rows: [
          ["Shareholders", "Governance, transparansi, short-termism"],
          ["Employees", "Standar ketenagakerjaan, migrasi, hak di tempat kerja"],
          ["Consumers", "Keamanan, privasi, harga, informasi"],
          ["Suppliers", "Sourcing, suap, kondisi kerja"],
          ["Society", "Iklim, pajak, ketimpangan, hak asasi manusia"]
        ]
      },
      prompt: "Class activity: pilih satu perusahaan multinasional dan petakan isu etis utamanya per stakeholder.",
      note: "Pesan utamanya: keputusan bisnis harus dievaluasi berdasarkan dampaknya pada banyak stakeholder sekaligus."
    },
    {
      n: 12, title: "Case pointer: Global McEthics", sub: "Haruskah standar etis diseragamkan di seluruh dunia?",
      groups: [
        { h: "Fokus kasus", items: [
          "Perusahaan makanan cepat saji dikritik soal kesehatan, gizi, ketenagakerjaan, kesejahteraan hewan, dan globalisasi",
          "Dilema sentral: <strong>konsistensi global vs adaptasi lokal</strong>",
          "Reputasi etis bisa menjadi isu global meski masalahnya bermula secara lokal"
        ]},
        { h: "Pertanyaan diskusi", items: [
          "Tanggung jawab etis apa yang ikut melintasi batas negara?",
          "Kapan perusahaan sebaiknya menyesuaikan diri dengan ekspektasi lokal?",
          "Bagaimana menyeimbangkan pilihan konsumen, kesehatan publik, dan pemasaran?",
          "Peran apa yang harus dimainkan stakeholder dalam menetapkan standar?"
        ]}
      ],
      note: "Tujuannya bukan sekadar memutuskan apakah perusahaan itu baik atau buruk, melainkan menganalisis tanggung jawab, stakeholder, konsekuensi, dan alternatifnya."
    }
  ],

  flow: [
    { h: "Warm-up", d: "legal vs ethical" },
    { h: "Mini-lecture", d: "definisi kunci" },
    { h: "Group task", d: "globalisasi" },
    { h: "Case discussion", d: "Global McEthics" },
    { h: "Reflection", d: "sustainability" }
  ],
  flowNote: "Sesi 75–90 menit. Tutup dengan satu takeaway: etika bisnis mengembangkan penilaian dalam ketidakpastian — lintas organisasi, lintas batas negara, dan di bawah tekanan keberlanjutan.",

  takeaways: [
    "Business ethics menyangkut benar dan salah secara <strong>moral</strong> dalam situasi bisnis",
    "Hukum menetapkan standar minimum, tetapi etika sering menuntut lebih jauh",
    "Ethics, morality, dan theory membantu <strong>menyusun penilaian</strong>",
    "Isu etis berbeda antar konteks organisasi dan kawasan",
    "Globalisasi membuat isu etis makin saling terkait dan diperdebatkan",
    "Sustainability membingkai ulang tujuan bisnis pada nilai ekonomi, sosial, dan lingkungan"
  ],

  closing: [
    "Bisakah perusahaan yang untung tetap gagal secara etis?",
    "Bisakah perusahaan bertindak legal tetapi tidak etis?",
    "Haruskah perusahaan multinasional menerapkan standar etis identik di setiap negara?",
    "Kelompok stakeholder mana yang paling sulit dipuaskan manajer?",
    "Dapatkah pertumbuhan ekonomi dan keberlanjutan lingkungan selalu didamaikan?",
    "Siapa yang seharusnya memutuskan apakah sebuah perusahaan berperilaku etis?"
  ],

  oneLine: "Etika bisnis menanyakan bukan hanya apakah keputusan bisnis itu menguntungkan atau legal, melainkan apakah ia <strong>dapat dipertahankan secara moral, adil bagi stakeholder terdampak, dan berkelanjutan dalam jangka panjang</strong>.",

  refs: [
    "Crane, A., Matten, D., Glozer, S. and Spence, L. (2019) <em>Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization</em>. 5th edn. Oxford: Oxford University Press. Chapter 1.",
    "World Commission on Environment and Development (1987) <em>Our Common Future</em>. Oxford: Oxford University Press.",
    "Elkington, J. (1999) <em>Cannibals with Forks: The Triple Bottom Line of 21st Century Business</em>. Oxford: Capstone."
  ]
},

/* ==========================================================
   PERTEMUAN 2 — Chapter 2
   ========================================================== */
{
  ch: 2,
  meeting: 2,
  title: "Framing Business Ethics",
  subtitle: "Corporate Responsibility, Stakeholders, and Citizenship",
  themes: "Responsibility · Stakeholders · Accountability · Citizenship",
  source: "Crane, Matten, Glozer &amp; Spence (2019), Chapter 2",
  file: "Chapter_2_Slides_and_Explanatory_Notes (2).pptx",
  fileUrl: "https://drive.google.com/file/d/18_E2wmIL6CECRD6sfb_4C8_nVOXa7wBR/view",
  intro: "Setelah Bab 1 memperkenalkan makna dan pentingnya etika bisnis, Bab 2 menjelaskan bagaimana etika bisnis dapat <strong>dibingkai</strong> melalui tiga konsep besar: corporate responsibility, stakeholder theory, dan corporate citizenship. Konsep-konsep ini memindahkan diskusi dari keputusan moral individual ke posisi korporasi di dalam masyarakat luas. Pertanyaannya: korporasi bertanggung jawab <em>atas apa</em>, <em>kepada siapa</em>, dan bagaimana tanggung jawab itu dipahami dalam ekonomi global.",

  slides: [
    {
      n: 2, title: "Learning objectives", sub: "Yang harus kamu pahami setelah Bab 2",
      points: [
        "Menjelaskan mengapa korporasi dipandang sebagai <strong>aktor sosial dan moral</strong>",
        "Membedakan pendekatan-pendekatan utama <strong>corporate social responsibility</strong>",
        "Menerapkan <strong>stakeholder theory</strong> pada pengambilan keputusan bisnis",
        "Menjelaskan <strong>corporate accountability</strong> dan transparansi",
        "Membahas secara kritis <strong>corporate citizenship</strong> dalam konteks global"
      ],
      chain: ["Corporation", "CSR", "Stakeholders", "Accountability", "Citizenship"],
      prompt: "Langkah belajar utama: dari pilihan individual menuju tanggung jawab organisasional.",
      note: "Bab 2 bukan terutama tentang memutuskan satu dilema; ia tentang membingkai korporasi itu sendiri sebagai bagian dari tatanan sosial dan politik yang lebih luas."
    },
    {
      n: 3, title: "Chapter map", sub: "Perjalanan konseptual Bab 2",
      chain: ["What is a corporation?", "Corporate moral responsibility", "CSR", "Stakeholder theory", "Corporate citizenship"],
      points: [
        "Tiap konsep menjawab pertanyaan berbeda: <strong>apa</strong> perusahaan itu, <strong>apa</strong> yang harus dilakukannya, <strong>siapa</strong> yang diperhitungkan, dan <strong>bagaimana</strong> ia dimintai pertanggungjawaban",
        "Bersama-sama membentuk kerangka analisis etika bisnis melampaui kepatuhan hukum"
      ],
      note: "Bab ini membangun kosakata untuk menganalisis tanggung jawab bisnis."
    },
    {
      n: 4, title: "Why frame business ethics?", sub: "Korporasi tidak terpisah dari masyarakat",
      groups: [
        { h: "Pandangan sempit tradisional", items: [
          "Perusahaan terutama institusi ekonomi",
          "Manajer fokus pada kepentingan pemegang saham",
          "Masalah sosial diserahkan pada pemerintah atau individu",
          "Etika diperlakukan sebagai kepatuhan atau perilaku pribadi"
        ]},
        { h: "Pandangan sosial yang lebih luas", items: [
          "Perusahaan tertanam dalam masyarakat",
          "Keputusan bisnis memengaruhi banyak kelompok",
          "Tanggung jawab mencakup dimensi ekonomi, hukum, etis, dan sosial",
          "Etika adalah bagian dari strategi, tata kelola, dan legitimasi"
        ]}
      ],
      note: "Bab 2 tidak menyangkal peran ekonomi bisnis, tetapi menanyakan apakah itu memadai. Karena korporasi memengaruhi banyak stakeholder dan dapat membentuk hasil sosial dan politik, etika bisnis memerlukan kerangka yang menghubungkan aktivitas ekonomi dengan tanggung jawab moral."
    },
    {
      n: 5, title: "What is a corporation?", sub: "Korporasi sebagai aktor hukum, ekonomi, dan sosial",
      groups: [
        { h: "Legal person", items: [
          "Diakui oleh hukum",
          "Terpisah dari pemiliknya",
          "Dapat memiliki properti, membuat kontrak, menggugat dan digugat"
        ]},
        { h: "Economic actor", items: [
          "Mengorganisasi modal, tenaga kerja, dan aset",
          "Memproduksi barang dan jasa",
          "Menciptakan nilai dan mendistribusikan imbalan"
        ]},
        { h: "Social actor", items: [
          "Memengaruhi komunitas, pekerja, konsumen, dan ekosistem",
          "Beroperasi dengan <strong>legitimasi yang diberikan masyarakat</strong>",
          "Menciptakan manfaat dan kemungkinan kerugian"
        ]}
      ],
      note: "Korporasi lebih dari sekadar kumpulan individu. Ia organisasi yang diakui hukum dengan kesinambungan, hak, dan tanggung jawab. Pemahaman luas ini membantu melihat mengapa etika bisnis tidak bisa direduksi menjadi moralitas individual atau nilai pemegang saham semata."
    },
    {
      n: 6, title: "Can corporations have moral responsibility?", sub: "Salah satu debat inti etika bisnis",
      groups: [
        { h: "Argumen menentang", items: [
          "Hanya manusia yang dapat berniat, memilih, dan merasa bersalah",
          "Manajer adalah agen pemilik",
          "Tanggung jawab korporasi dapat mengaburkan akuntabilitas individual",
          "Isu sosial dapat dipandang sebagai peran pemerintah"
        ]},
        { h: "Argumen mendukung", items: [
          "Korporasi punya sistem keputusan, budaya, dan kebijakan",
          "Tindakan korporasi berdampak kolektif",
          "Organisasi dapat dipuji, disalahkan, disanksi, atau dipercaya",
          "Tanggung jawab dapat <strong>dibagi</strong> antara individu dan korporasi"
        ]}
      ],
      note: "Poin pengajarannya bukan menghapus tanggung jawab individual, melainkan menunjukkan bahwa sistem organisasi dapat membentuk hasil dan karena itu memerlukan evaluasi etis."
    },
    {
      n: 7, title: "Shareholder view vs broader responsibility", sub: "Dua titik berangkat yang bersaing",
      groups: [
        { h: "Shareholder-centred view", items: [
          "Manajer berkewajiban melindungi investasi pemilik",
          "Maksimalisasi laba dipandang tanggung jawab utama bisnis",
          "Belanja sosial dapat dikritik bila memakai sumber daya pemegang saham",
          "Terkait posisi klasik <strong>Friedman</strong>"
        ]},
        { h: "Broader responsibility view", items: [
          "Korporasi bergantung pada banyak relasi stakeholder",
          "Bisnis memengaruhi masyarakat melampaui pemiliknya",
          "Legitimasi jangka panjang menuntut keadilan, kepercayaan, dan akuntabilitas",
          "Tanggung jawab mencakup kepedulian ekonomi, hukum, etis, dan sosial"
        ]}
      ],
      note: "Pandangan shareholder bukan sekadar tidak etis; ia posisi yang koheren tentang keagenan manajerial dan efisiensi ekonomi. Pandangan yang lebih luas menantangnya dengan menekankan dampak sosial, klaim stakeholder, dan legitimasi jangka panjang."
    },
    {
      n: 8, title: "Corporate Social Responsibility (CSR)", sub: "Cara sentral membingkai tanggung jawab bisnis",
      lead: "CSR menanyakan tanggung jawab apa yang dimiliki korporasi atas <strong>dampaknya terhadap masyarakat</strong>, dan bagaimana tanggung jawab itu dikelola.",
      groups: [
        { h: "CSR itu contested", items: ["Banyak definisi", "Debat sukarela vs wajib", "Bisa strategis, etis, defensif, atau simbolik"] },
        { h: "CSR itu relational", items: ["Melibatkan stakeholder", "Menuntut akuntabilitas", "Menghubungkan keputusan bisnis dengan ekspektasi sosial"] },
        { h: "CSR itu practical", items: ["Kebijakan dan program", "Pelaporan dan dialog stakeholder", "Risiko, reputasi, legitimasi, penciptaan nilai"] }
      ],
      note: "CSR bukan hanya filantropi. Ia dapat mencakup tata kelola, operasi, rantai pasok, tanggung jawab produk, praktik ketenagakerjaan, manajemen lingkungan, dan pelaporan."
    },
    {
      n: 9, title: "Carroll’s four-part CSR model", sub: "Economic, legal, ethical, philanthropic",
      table: {
        cols: ["Tingkat", "Status", "Isi"],
        rows: [
          ["Philanthropic", "desired", "Berkontribusi pada komunitas"],
          ["Ethical", "expected", "Melakukan apa yang benar dan adil"],
          ["Legal", "required", "Menaati hukum dan regulasi"],
          ["Economic", "required", "Menguntungkan dan layak secara ekonomi"]
        ]
      },
      prompt: "Teaching caution: model ini berguna, tetapi jangan dibaca sebagai hierarki kaku di semua konteks budaya atau institusional.",
      note: "Negara dan sektor yang berbeda dapat memprioritaskan keempat tanggung jawab ini secara berbeda."
    },
    {
      n: 10, title: "CSR strategies and outcomes", sub: "CSR bisa defensif, terintegrasi, atau transformatif",
      groups: [
        { h: "Defensive / compliance", items: ["Merespons tekanan atau risiko", "Fokus menghindari kerugian atau kritik", "Cenderung reaktif"] },
        { h: "Strategic / integrated", items: ["Menghubungkan CSR dengan bisnis inti", "Memakai wawasan stakeholder", "Mengejar manfaat reputasi, risiko, dan inovasi"] },
        { h: "Civil / transformative", items: ["Menggarap isu sosial atau lingkungan yang sistemik", "Sering melibatkan kemitraan", "Menuju nilai publik yang lebih luas"] }
      ],
      prompt: "Cara mengevaluasi CSR: apakah perusahaan sekadar bereaksi terhadap tekanan, mengintegrasikan tanggung jawab ke operasi inti, atau berkontribusi pada solusi masyarakat yang lebih luas?",
      note: "Pertanyaan evaluatif di atas adalah alat paling praktis dari slide ini — pakai saat menganalisis klaim CSR perusahaan mana pun."
    },
    {
      n: 11, title: "Stakeholder theory of the firm", sub: "Siapa yang diperhitungkan saat korporasi mengambil keputusan?",
      lead: "Korporasi seharusnya mempertimbangkan kepentingan dan klaim kelompok yang <strong>memengaruhi, atau dipengaruhi oleh</strong>, aktivitas korporasi.",
      points: [
        "Menggeser pertanyaan dari “bagaimana manajer melayani pemegang saham?” menjadi “<strong>kelompok mana yang punya klaim sah</strong> atas korporasi?”",
        "Mencakup shareholders, employees, customers, suppliers, communities, government, dan lainnya",
        "Tidak otomatis menyelesaikan konflik — tetapi memastikan kelompok terdampak <strong>terlihat</strong>"
      ],
      note: "Sumber: Freeman (1984); Crane et al. (2019), Chapter 2."
    },
    {
      n: 12, title: "Mapping stakeholder claims", sub: "Power, legitimacy, urgency, dan kualitas relasi",
      groups: [
        { h: "Identify stakeholders", items: ["Siapa yang terdampak?", "Siapa yang dapat memengaruhi perusahaan?", "Siapa yang punya klaim, hak, atau kepentingan?"] },
        { h: "Assess claims", items: ["Power dan pengaruh", "Legitimacy klaim", "Urgency isu", "<strong>Vulnerability dan dependency</strong>"] },
        { h: "Respond ethically", items: ["Libatkan dan dengarkan", "Seimbangkan kepentingan yang bersaing", "Jelaskan trade-off", "Bangun mekanisme akuntabilitas"] }
      ],
      prompt: "Analisis etika bisnis tidak boleh sekadar memprioritaskan stakeholder yang paling nyaring atau paling berkuasa.",
      note: "Sebagian stakeholder punya power kuat tetapi klaim moral lemah; sebagian lain punya sedikit power tetapi sangat rentan. Pertimbangkan legitimacy, urgency, dependency, dan keadilan. Perhatikan bahwa slide ini menambahkan <em>vulnerability</em> dan <em>dependency</em> di luar tiga atribut Mitchell yang klasik."
    },
    {
      n: 13, title: "Corporate accountability and transparency", sub: "Bertanggung jawab berarti juga dapat dimintai penjelasan",
      groups: [
        { h: "Responsibility", items: ["Siapa punya kewajiban?", "Kewajiban apa yang ada?", "Kerugian atau manfaat apa yang tercipta?"] },
        { h: "Accountability", items: ["Siapa harus menjelaskan keputusan?", "Kepada siapa penjelasan diberikan?", "Konsekuensi apa yang mengikuti?"] },
        { h: "Transparency", items: ["Informasi apa yang diungkap?", "Apakah dapat dipahami dan diandalkan?", "Dapatkah stakeholder memakainya?"] }
      ],
      prompt: "Transparansi saja tidak cukup.",
      note: "Informasi harus relevan, andal, dapat diakses, dan terhubung dengan mekanisme yang memungkinkan stakeholder mempertanyakan atau menantang perilaku korporasi."
    },
    {
      n: 14, title: "Corporate citizenship", sub: "Perusahaan sebagai aktor sosial dan politik",
      groups: [
        { h: "Pandangan tradisional", items: ["Kewargaan terutama milik individu", "Negara menyediakan hak dan barang publik", "Bisnis berpartisipasi lewat pasar"] },
        { h: "Pandangan corporate citizenship", items: ["Korporasi menyediakan atau membentuk barang publik", "Perusahaan dapat memengaruhi hak, kesejahteraan, dan regulasi", "Bisnis menjadi <strong>aktor politik</strong>"] },
        { h: "Tantangan etis", items: ["Siapa yang mengotorisasi kekuasaan korporasi?", "Bagaimana perusahaan dimintai pertanggungjawaban?", "Dapatkah kewargaan bersifat global?"] }
      ],
      note: "Perusahaan dapat berkontribusi pada kesejahteraan publik, tetapi kekuasaannya mungkin tidak diotorisasi secara demokratis. Pertanyaan etisnya: bagaimana corporate citizenship dapat dibuat akuntabel, sah, dan inklusif. Sumber: Matten dan Crane (2005)."
    },
    {
      n: 15, title: "Regional and global implications", sub: "CSR, stakeholder theory, dan citizenship menyebar tidak merata",
      groups: [
        { h: "North America", items: ["Menekankan tanggung jawab individual dan inisiatif korporasi", "Shareholder value tetap berpengaruh", "Kode etik, kepatuhan, dan filantropi menonjol"] },
        { h: "Europe", items: ["Menekankan peran institusional dan regulasi", "Tradisi tata kelola stakeholder lebih kuat", "CSR lebih menyatu dengan kebijakan sosial"] },
        { h: "Asia &amp; emerging", items: ["Relasi bisnis-pemerintah sering sentral", "Perusahaan keluarga, BUMN, dan konglomerat penting", "Norma lokal membentuk ekspektasi tanggung jawab"] }
      ],
      prompt: "Hindari stereotip, tetapi akui bahwa etika bisnis peka konteks.",
      note: "Konsep yang berkembang sebagian besar dalam debat Barat dapat berguna secara global, tetapi harus ditafsirkan dalam konteks institusional, budaya, dan politik lokal. Ini relevan langsung untuk analisis kasus Indonesia."
    },
    {
      n: 16, title: "Case pointer: American Apparel", sub: "Identitas CSR, ketenagakerjaan, branding, dan kontradiksi",
      groups: [
        { h: "Fokus kasus", items: [
          "Perusahaan dapat membangun merek di sekitar etika dan tanggung jawab sosial",
          "Identitas etis menciptakan ekspektasi stakeholder",
          "Kontradiksi antara citra publik dan praktik internal dapat merusak legitimasi",
          "Klaim CSR menuntut tata kelola dan akuntabilitas yang kredibel"
        ]},
        { h: "Pertanyaan diskusi", items: [
          "Dapatkah CSR menjadi bagian strategi bersaing sebuah merek fesyen?",
          "Kapan komunikasi CSR berubah menjadi manipulasi?",
          "Bagaimana menilai ketegangan antara praktik ketenagakerjaan, pemasaran, dan perilaku pimpinan?",
          "Stakeholder mana yang paling terdampak?"
        ]}
      ],
      note: "Poin pembelajaran kuncinya: CSR bukan soal pesan semata; ia menuntut konsistensi antara nilai, operasi, kepemimpinan, dan dampak stakeholder."
    }
  ],

  flow: [
    { h: "Opening question", d: "What is a corporation for?" },
    { h: "Mini-lecture", d: "CSR dan tanggung jawab" },
    { h: "Group work", d: "stakeholder mapping" },
    { h: "Case debate", d: "American Apparel" },
    { h: "Reflection", d: "corporate citizenship" }
  ],
  flowNote: "Sesi 75–90 menit. Instructor tip: akhiri dengan meminta mahasiswa memilih satu konsep — CSR, stakeholder theory, accountability, atau citizenship — dan menerapkannya pada perusahaan terkini.",

  takeaways: [
    "Korporasi adalah aktor <strong>hukum, ekonomi, dan sosial</strong>",
    "Tanggung jawab korporasi melampaui kepatuhan hukum sederhana",
    "CSR membingkai tanggung jawab pada dimensi ekonomi, hukum, etis, dan filantropis",
    "Stakeholder theory menanyakan siapa yang terdampak dan klaim siapa yang diperhitungkan",
    "Accountability dan transparency membuat tanggung jawab dapat dimintai penjelasan",
    "Corporate citizenship menyoroti peran publik dan politik perusahaan"
  ],

  closing: [
    "Untuk apa sebuah korporasi ada?",
    "Dapatkah korporasi benar-benar dimintai pertanggungjawaban secara moral, atau hanya individu di dalamnya?",
    "Kapan CSR menjadi strategi, dan kapan ia menjadi manipulasi?",
    "Jika korporasi kini memengaruhi barang publik, hak, dan regulasi — bagaimana kekuasaan itu seharusnya diatur?"
  ],

  oneLine: "CSR menanyakan tanggung jawab <strong>apa</strong> yang dimiliki bisnis; stakeholder theory menanyakan <strong>kepada siapa</strong> tanggung jawab itu terutang; accountability menanyakan <strong>bagaimana</strong> korporasi dapat dimintai penjelasan; corporate citizenship menanyakan bagaimana <strong>kekuasaan korporasi</strong> harus dipahami ketika perusahaan mengambil peran sosial atau politik.",

  refs: [
    "Crane, A., Matten, D., Glozer, S. and Spence, L.J. (2019) <em>Business Ethics</em>. 5th edn. Oxford: OUP. Ch. 2.",
    "Carroll, A.B. (1991) ‘The pyramid of corporate social responsibility’, <em>Business Horizons</em>, 34(4), pp. 39–48.",
    "Freeman, R.E. (1984) <em>Strategic Management: A Stakeholder Approach</em>. Boston: Pitman.",
    "Matten, D. and Crane, A. (2005) ‘Corporate citizenship’, <em>Academy of Management Review</em>, 30(1), pp. 166–179."
  ]
}

];
