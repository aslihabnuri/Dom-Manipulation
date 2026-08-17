/* ============================================================
   BAHAN BACAAN PERSIAPAN (PREP)
   Untuk setiap sesi yang BELUM diajarkan di kelas: apa yang akan
   dipelajari, konsep yang perlu dikuasai lebih dulu, apa yang
   dibaca, dan pertanyaan yang dibawa ke kelas.

   Ditampilkan otomatis di menu Materi selama sesi itu belum punya
   rangkuman materi (field `summary`). Begitu materi asli dari
   dosen masuk, bagian ini tetap tersedia sebagai pengantar.
   ============================================================ */

window.MBA_PREP = {

  /* =================== OPERATIONS & TECHNOLOGY MANAGEMENT =================== */
  otm: {
    3: { intro: "Sesi ini masuk ke keputusan OM pertama: merancang apa yang dijual. Desain produk menentukan biaya, kualitas, dan fleksibilitas seluruh operasi sesudahnya — sekitar 70–80% biaya produk terkunci di tahap desain.",
      concepts: [
        ["Product life cycle & strategi", "Tiap fase (introduction–growth–maturity–decline) menuntut prioritas operasi berbeda; Anda sudah mempelajarinya di Sesi 1."],
        ["Product development stages", "Dari ide → seleksi → desain awal → prototipe → uji → produksi. Perhatikan gerbang keputusan di tiap tahap."],
        ["QFD & House of Quality", "Menerjemahkan 'suara pelanggan' menjadi persyaratan teknis yang terukur."],
        ["Design for manufacture (DFM)", "Merancang agar mudah dan murah diproduksi; termasuk value engineering."],
        ["Modular design & standardisasi", "Komponen modular memberi variasi bagi pelanggan tanpa meledakkan kompleksitas operasi — ingat pelajaran 4V."],
        ["Robust design & konkuren engineering", "Desain tahan variasi proses; tim lintas fungsi bekerja paralel, bukan berurutan."]
      ],
      read: ["SBB bab 4 (Product & service design)", "HRM bab 5 (Design of goods and services)", "TPW bab 6"],
      questions: ["Kalau 70–80% biaya terkunci saat desain, mengapa perusahaan justru menghabiskan energi terbesar untuk menekan biaya di tahap produksi?",
        "Bagaimana Regal Marine (studi kasus sesi ini) menjaga kecepatan pengembangan produk di industri yang selera pelanggannya cepat berubah?"] },

    4: { intro: "Setelah tahu APA yang dibuat, sesi ini membahas BAGAIMANA membuatnya: pemilihan tipe proses, teknologi yang dipakai, dan peran manusia di dalamnya.",
      concepts: [
        ["Empat strategi proses", "Process focus (variasi tinggi–volume rendah), repetitive focus (lini perakitan), product focus (volume tinggi–variasi rendah), dan mass customization."],
        ["Product–process matrix", "Kecocokan antara tipe proses dan posisi 4V produk; ketidakcocokan = biaya tinggi tanpa manfaat."],
        ["Crossover analysis", "Menghitung titik volume di mana satu pilihan proses menjadi lebih murah dari yang lain."],
        ["Process technology", "Otomasi, robot, AGV, CAD/CAM, FMS; di jasa: teknologi swalayan dan digital."],
        ["Job design & work measurement", "Spesialisasi vs job enlargement/enrichment, ergonomika, standar waktu kerja."],
        ["Layout dasar", "Process layout, product layout, cellular, fixed-position — mengikuti pilihan tipe proses."]
      ],
      read: ["SBB bab 6 (Process design)", "HRM bab 7 (Process strategy)", "TPW bab 9 & 11"],
      questions: ["Harley-Davidson (kasus sesi ini) memproduksi motor bervariasi tinggi di lini yang efisien — bagaimana mereka menyiasati trade-off volume vs variety?",
        "Kapan otomasi justru menurunkan fleksibilitas sampai merugikan?"] },

    5: { intro: "Kapasitas adalah janji perusahaan kepada pasar: berapa banyak yang sanggup kita layani. Salah menetapkannya berarti kehilangan penjualan (kurang) atau menanggung aset menganggur (lebih).",
      concepts: [
        ["Design vs effective capacity", "Kapasitas teoretis vs yang realistis setelah dikurangi perawatan, setup, dan istirahat."],
        ["Utilization & efficiency", "Utilization = output aktual ÷ design capacity; Efficiency = output aktual ÷ effective capacity. Bedakan keduanya — sering keluar di ujian."],
        ["Bottleneck & throughput", "Kapasitas sistem = kapasitas stasiun paling lambat. Memperbaiki yang bukan bottleneck tidak menambah output."],
        ["Break-even analysis", "Titik impas untuk memutuskan penambahan kapasitas."],
        ["Strategi ekspansi kapasitas", "Leading (mendahului permintaan), lagging (mengikuti), atau incremental."],
        ["Mengelola permintaan", "Bila kapasitas sulit diubah: dynamic pricing, reservasi, promo off-peak — penting untuk jasa yang kapasitasnya tak bisa disimpan."]
      ],
      read: ["SBB bab 11 (Capacity management)", "HRM bab 13"],
      questions: ["Frito-Lay (kasus sesi ini) menghadapi permintaan yang sangat musiman — strategi kapasitas mana yang mereka pakai dan mengapa?",
        "Untuk bisnis jasa di Indonesia yang Anda kenal, mana yang lebih murah: menambah kapasitas atau meratakan permintaan?"] },

    6: { intro: "Persediaan adalah uang yang berbentuk barang. Sesi ini mengajarkan berapa banyak yang harus disimpan dan kapan memesan ulang — dua pertanyaan yang menentukan modal kerja perusahaan.",
      concepts: [
        ["Fungsi & jenis persediaan", "Raw material, WIP, MRO, finished goods; persediaan sebagai penyangga ketidakpastian."],
        ["Analisis ABC", "Aturan Pareto: ±20% item menyumbang ±80% nilai; kendalikan ketat item A."],
        ["EOQ (Economic Order Quantity)", "Menyeimbangkan biaya pesan dan biaya simpan. Kuasai rumus dan asumsinya — ini soal hitungan favorit ujian."],
        ["Reorder point & safety stock", "ROP = permintaan selama lead time + safety stock; safety stock ditentukan service level yang diinginkan."],
        ["Production order quantity & quantity discount", "Varian EOQ untuk produksi bertahap dan untuk diskon volume."],
        ["Biaya persediaan tersembunyi", "Keusangan, kerusakan, ruang, asuransi, dan modal yang terikat."]
      ],
      read: ["SBB bab 13 (Inventory management)", "HRM bab 12"],
      questions: ["Amazon (kasus sesi ini) menyimpan jutaan SKU tapi tetap efisien — bagaimana mereka menyiasati trade-off klasik persediaan?",
        "Kapan menyimpan persediaan LEBIH banyak justru menurunkan total biaya?"] },

    7: { intro: "MRP menjawab pertanyaan: untuk membuat 1.000 unit produk jadi bulan depan, komponen apa saja yang harus dipesan hari ini? Ini jantung perencanaan manufaktur — dan cikal bakal sistem ERP.",
      concepts: [
        ["Master Production Schedule (MPS)", "Rencana produksi produk jadi per periode; input utama MRP."],
        ["Bill of Materials (BOM)", "Struktur produk bertingkat; berapa unit tiap komponen per produk jadi."],
        ["Dependent vs independent demand", "MRP dipakai untuk permintaan dependen (komponen), EOQ untuk independen (produk jadi)."],
        ["Gross vs net requirements", "Kebutuhan kotor dikurangi persediaan di tangan dan penerimaan terjadwal."],
        ["Lead time offsetting", "Menggeser jadwal pemesanan mundur sesuai lead time tiap level."],
        ["Dari MRP ke ERP", "Integrasi lintas fungsi: keuangan, SDM, penjualan — kaitkan dengan TPW."]
      ],
      read: ["SBB bab 14", "HRM bab 14 (MRP & ERP)", "SBB bab 10"],
      questions: ["Apa yang terjadi pada seluruh rencana MRP bila data BOM atau persediaan tidak akurat?",
        "Mengapa banyak implementasi ERP gagal padahal perangkat lunaknya canggih? (kaitkan dengan pelajaran transformasi digital di Sesi 1)"] },

    8: { intro: "Sesi ini turun ke keputusan harian: pekerjaan mana dikerjakan lebih dulu, siapa mengerjakan apa, dan kapan. Keputusan kecil yang berdampak besar pada dependability.",
      concepts: [
        ["Loading & sequencing", "Membagi beban ke pusat kerja, lalu menentukan urutan pengerjaan."],
        ["Aturan prioritas", "FCFS, SPT (shortest processing time), EDD (earliest due date), LPT — masing-masing mengoptimalkan kriteria berbeda."],
        ["Ukuran kinerja jadwal", "Average completion time, utilization, average number of jobs in system, average lateness."],
        ["Johnson's rule", "Mengurutkan N pekerjaan pada 2 mesin untuk meminimalkan makespan."],
        ["Finite vs infinite loading", "Menjadwalkan dengan atau tanpa memperhatikan batas kapasitas nyata."],
        ["Penjadwalan jasa", "Berbasis permintaan & tenaga kerja: shift, staggered schedule, appointment system."]
      ],
      read: ["SBB bab 10 & 14", "HRM bab 15 (Short-term scheduling)"],
      questions: ["Alaska Airlines (kasus sesi ini) menjadwalkan awak, pesawat, dan gate sekaligus — mana batasan yang paling mengikat?",
        "Aturan SPT meminimalkan waktu tunggu rata-rata, tapi apa kerugian etisnya bagi pesanan besar yang terus tergeser?"] },

    9: { intro: "Operasi tidak berhenti di pagar pabrik. Supply chain management mengelola seluruh jaringan dari pemasoknya pemasok sampai pelanggannya pelanggan.",
      concepts: [
        ["Make-or-buy & outsourcing", "Keputusan mana yang dikerjakan sendiri — Anda sudah menemuinya di materi strategi operasi."],
        ["Bullwhip effect", "Fluktuasi permintaan membesar makin ke hulu; disebabkan batching, promosi, dan informasi yang tidak dibagikan."],
        ["Strategi supply chain", "Banyak pemasok, sedikit pemasok, integrasi vertikal, joint venture, jaringan keiretsu."],
        ["Vendor selection & evaluation", "Factor-rating method untuk memilih pemasok secara objektif."],
        ["Logistik & distribusi", "Pergudangan, transportasi, cross-docking, drop shipping."],
        ["Supply chain risk & resilience", "Sourcing ganda, buffer strategis, visibilitas rantai pasok."]
      ],
      read: ["SBB bab 12", "HRM bab 11", "TPW bab 10 & 12"],
      questions: ["Red Lobster (kasus sesi ini) mengelola pasokan seafood segar lintas negara — bagaimana mereka menyeimbangkan biaya, kesegaran, dan keberlanjutan?",
        "Apa penawar bullwhip effect yang paling murah bagi perusahaan menengah di Indonesia?"] },

    10: { intro: "Lean adalah filosofi menghilangkan segala yang tidak menambah nilai bagi pelanggan. Lahir dari Toyota, kini dipakai rumah sakit sampai bank.",
      concepts: [
        ["Tujuh pemborosan (muda)", "Overproduction, waiting, transport, over-processing, inventory, motion, defects."],
        ["Just-in-Time & kanban", "Sistem tarik: produksi dipicu permintaan nyata, bukan ramalan."],
        ["5S & visual management", "Seiri, seiton, seiso, seiketsu, shitsuke — fondasi disiplin operasional."],
        ["Kaizen & gemba walk", "Perbaikan berkelanjutan berbasis pengamatan langsung di tempat kerja."],
        ["Jidoka & poka-yoke", "Otomasi yang berhenti sendiri saat ada cacat; alat pencegah salah."],
        ["Value stream mapping", "Memetakan aliran nilai untuk melihat di mana pemborosan bersembunyi."]
      ],
      read: ["SBB bab 15 & 16", "HRM bab 16 (Lean operations)"],
      questions: ["Toyota (kasus sesi ini) memangkas persediaan drastis — apa risikonya, dan bagaimana itu terbukti saat pandemi & krisis chip?",
        "Bisakah lean diterapkan di operasi jasa Indonesia yang permintaannya sangat fluktuatif?"] },

    11: { intro: "Kualitas adalah performance objective yang mendukung semuanya. Sesi ini membahas cara mendefinisikan, mengukur, dan mengendalikannya secara sistematis.",
      concepts: [
        ["Definisi kualitas & biaya kualitas", "Prevention, appraisal, internal failure, external failure — biaya mencegah selalu lebih murah daripada memperbaiki."],
        ["TQM & tokoh-tokohnya", "Deming (PDCA, 14 poin), Juran (fitness for use), Crosby (zero defects)."],
        ["Tujuh alat kualitas", "Check sheet, histogram, Pareto, fishbone (Ishikawa), scatter, flowchart, control chart."],
        ["SPC & control chart", "x̄-R chart untuk variabel; p/c chart untuk atribut; membedakan variasi common cause vs special cause."],
        ["Process capability", "Cp dan Cpk — apakah proses sanggup memenuhi spesifikasi."],
        ["Six Sigma & ISO 9000", "DMAIC dan standar sistem manajemen mutu internasional."]
      ],
      read: ["SBB bab 17", "HRM bab 6 (Managing quality)"],
      questions: ["Arnold Palmer Hospital (kasus sesi ini) mengukur kualitas layanan yang sebagian besar subjektif — ukuran apa yang mereka pakai?",
        "Mengapa 'zero defects' realistis di manufaktur tapi sulit didefinisikan di jasa?"] },

    12: { intro: "Sesi penutup: menjaga operasi tetap andal dan pulih cepat ketika terganggu, plus manajemen proyek untuk perubahan besar. Sesi ini juga jadwal presentasi proyek tim final.",
      concepts: [
        ["Reliability & redundancy", "Keandalan sistem seri = perkalian keandalan komponen; redundansi menaikkannya."],
        ["Preventive vs breakdown maintenance", "Menyeimbangkan biaya pencegahan dengan biaya kerusakan; TPM."],
        ["Risk identification & mitigation", "Menilai probabilitas × dampak; strategi pencegahan dan mitigasi."],
        ["Business continuity & recovery", "Rencana pemulihan setelah gangguan besar; service recovery bagi pelanggan."],
        ["Project management: PERT/CPM", "Jalur kritis, slack, crashing; estimasi waktu optimis-realistis-pesimis."],
        ["Gantt chart & alokasi sumber daya", "Menjadwalkan dan memantau kemajuan proyek."]
      ],
      read: ["SBB bab 18 & 19", "HRM bab 3 (Project management) & bab 17", "TPW bab 13"],
      questions: ["Bechtel Group (kasus sesi ini) mengelola proyek raksasa lintas negara — teknik pengendalian apa yang paling menentukan?",
        "Untuk presentasi proyek tim: operasi mana yang akan tim Anda analisis, dan performance objective mana yang jadi fokusnya?"] }
  },

  /* =================== BUSINESS ETHICS =================== */
  bes: {
    3: { intro: "Sesi paling teoretis sekaligus paling penting: alat-alat berpikir untuk menilai apakah suatu keputusan bisnis dapat dibenarkan secara moral. Semua analisis kasus sesudahnya memakai teori-teori ini.",
      concepts: [
        ["Consequentialist vs non-consequentialist", "Menilai dari akibatnya vs menilai dari sifat tindakannya sendiri."],
        ["Utilitarianism", "Tindakan benar bila menghasilkan kebaikan terbesar untuk jumlah terbanyak. Kelemahan yang dibahas dosen: bisa membenarkan pelanggaran hak individu (kasus 'uncle', kasus Pinto)."],
        ["Ethics of duty (Kant)", "Categorical imperative: bertindaklah hanya menurut prinsip yang Anda kehendaki menjadi hukum universal; jangan pernah memperlakukan orang semata sebagai alat."],
        ["Rights & justice", "Hak legal vs hak moral; negative rights (orang lain tidak boleh mengganggu) vs positive rights (orang lain wajib menyediakan sarana). Locke: hak alamiah atas kebebasan & properti."],
        ["Virtue ethics & ethics of care", "Fokus pada karakter pelakunya, dan pada relasi serta tanggung jawab merawat."],
        ["Keterbatasan pengukuran", "Deck dosen menyorot: sulit mengkuantifikasi manfaat & biaya, sulit meramal masa depan, dan tidak semua kebaikan bisa diperdagangkan setara."]
      ],
      read: ["CM bab 3 (Evaluating business ethics)", "Deck Prof. Eko bagian rights, Locke, Adam Smith, Kant, dan utilitarian"],
      questions: ["Kasus Ford Pinto: perhitungan biaya-manfaat menyimpulkan tidak memperbaiki tangki bensin lebih murah daripada menanggung tuntutan. Di mana letak kesalahan moral penalaran itu?",
        "Adakah keputusan bisnis yang dibenarkan utilitarianisme tapi dilarang oleh teori hak? Siapkan satu contoh."] },

    4: { intro: "Dari teori ke praktik: bagaimana orang sungguhan mengambil keputusan etis di organisasi, dan mengapa orang baik kadang melakukan hal buruk. Termasuk pembahasan ethical leadership.",
      concepts: [
        ["Model pengambilan keputusan etis", "Tahapan: mengenali isu etis → membuat penilaian moral → membentuk niat → berperilaku."],
        ["Faktor individual", "Usia, gender, pendidikan, nilai pribadi, locus of control, dan tahap perkembangan moral (Kohlberg)."],
        ["Faktor situasional", "Intensitas moral isu, budaya organisasi, sistem insentif, tekanan atasan & rekan kerja."],
        ["Rasionalisasi & moral disengagement", "Bagaimana orang membenarkan tindakan tidak etis: 'semua juga begitu', 'bukan urusan saya', 'toh tidak ada yang dirugikan'."],
        ["Ethical leadership", "Pemimpin sebagai moral person (jujur, adil) sekaligus moral manager (menetapkan standar, memberi contoh, menegakkan konsekuensi)."],
        ["Whistleblowing", "Kapan mengungkap pelanggaran ke luar dapat dibenarkan, dan bagaimana melindungi pelapor."]
      ],
      read: ["CM bab 4 (Making decisions in business ethics)"],
      questions: ["Mengapa sistem insentif yang agresif sering menghasilkan pelanggaran etis meskipun perusahaan punya kode etik yang bagus?",
        "Sebagai manajer, langkah konkret apa yang membuat karyawan berani menyampaikan kabar buruk kepada Anda?"] },

    5: { intro: "Bagaimana etika dikelola secara sistematis di organisasi — dari kode etik sampai audit sosial. Sesi ini menjawab: apa yang benar-benar berfungsi dan apa yang sekadar pajangan.",
      concepts: [
        ["Kode etik", "Isi, jenis (organisasi, profesi, industri), dan syarat agar tidak sekadar dokumen dinding."],
        ["Struktur & program etika", "Ethics officer, komite etika, pelatihan, saluran pelaporan (hotline)."],
        ["Manajemen stakeholder", "Dari sekadar mengelola persepsi menuju keterlibatan (engagement) dan kemitraan."],
        ["Sustainability reporting & assurance", "GRI, laporan ESG, dan audit sosial; risiko greenwashing."],
        ["Budaya organisasi", "Nilai yang dianut vs nilai yang dijalankan; keselarasan sistem imbalan dengan nilai."],
        ["Alat & standar", "ISO 26000, UN Global Compact, due diligence HAM."]
      ],
      read: ["CM bab 5 (Managing business ethics)"],
      questions: ["Apa tanda paling jelas bahwa kode etik sebuah perusahaan benar-benar hidup, bukan pajangan?",
        "Kalau laporan keberlanjutan tidak diaudit independen, apa nilainya bagi stakeholder?"] },

    6: { intro: "Mulai sesi ini, tiap pertemuan membahas satu kelompok stakeholder. Dimulai dari yang secara hukum paling kuat klaimnya: pemegang saham — dan pertanyaan tata kelola yang menyertainya.",
      concepts: [
        ["Hak & klaim pemegang saham", "Imbal hasil, informasi yang benar, dan hak suara."],
        ["Agency problem", "Konflik kepentingan antara pemilik dan manajer; asimetri informasi."],
        ["Corporate governance", "Peran dewan komisaris/direksi, komite audit, independensi, remunerasi eksekutif."],
        ["Etika pasar modal", "Insider trading, manipulasi pasar, kualitas pengungkapan."],
        ["Kecurangan laporan keuangan", "Enron, Jiwasraya, Asabri — kaitkan dengan daftar kasus di Sesi 1."],
        ["Shareholder activism & ESG investing", "Investor mendorong perubahan perilaku perusahaan."]
      ],
      read: ["CM bab 6 (Shareholders and business ethics)"],
      questions: ["Skema bonus berbasis harga saham mendorong manajer mengejar kinerja jangka pendek — bagaimana merancang insentif yang lebih etis?",
        "Dalam kasus Jiwasraya/Asabri, di titik mana tata kelola gagal lebih dulu: pengawasan, transparansi, atau insentif?"] },

    7: { intro: "Karyawan adalah stakeholder yang paling bergantung pada perusahaan sekaligus paling rentan. Sesi ini membahas hak, kewajiban, dan dilema di tempat kerja.",
      concepts: [
        ["Hak karyawan", "Upah layak, kondisi kerja aman, privasi, kebebasan berserikat, dan proses yang adil."],
        ["Diskriminasi kerja", "Bentuknya (langsung/tidak langsung), affirmative action, dan perdebatannya — bagian eksplisit dalam deck dosen."],
        ["Privasi & pengawasan", "Pemantauan email, CCTV, data karyawan, dan pengujian (tes narkoba, kesehatan)."],
        ["Kesehatan & keselamatan kerja", "Kewajiban perusahaan atas risiko yang diketahui."],
        ["Whistleblowing & loyalitas", "Batas kesetiaan pada perusahaan versus kepentingan publik."],
        ["Isu kontemporer", "Gig economy, PHK etis, kerja jarak jauh, dan penggunaan AI dalam rekrutmen."]
      ],
      read: ["CM bab 7 (Employees and business ethics)"],
      questions: ["Apakah perusahaan berhak memantau media sosial pribadi karyawannya? Di mana batas etisnya?",
        "PHK massal yang legal — syarat apa yang membuatnya juga etis?"] },

    8: { intro: "Konsumen membeli dengan informasi yang jauh lebih sedikit daripada produsen. Sesi ini membahas kewajiban etis yang lahir dari ketimpangan itu.",
      concepts: [
        ["Contract view", "Kewajiban produsen dari perjanjian jual-beli: memenuhi janji, mengungkap, tidak menyesatkan, tidak memaksa."],
        ["Due care theory", "Produsen wajib berhati-hati karena konsumen berada pada posisi yang tidak setara — kaitkan dengan kasus sirop obat batuk."],
        ["Social cost view", "Produsen menanggung biaya kerugian akibat produk cacat meski sudah berhati-hati; beserta kritiknya."],
        ["Etika periklanan", "Iklan menyesatkan, penciptaan keinginan, iklan kepada anak-anak."],
        ["Keamanan produk & penarikan", "Kapan recall wajib dilakukan; bandingkan Johnson & Johnson dengan kasus lain."],
        ["Privasi konsumen & data", "Pengumpulan data, personalisasi, dan UU Perlindungan Data Pribadi."]
      ],
      read: ["CM bab 8 (Consumers and business ethics)", "Deck Prof. Eko bagian Ethics of Consumer Production and Marketing"],
      questions: ["Dalam kasus gagal ginjal akut, siapa yang paling bertanggung jawab menurut due care theory: produsen, regulator, atau distributor?",
        "Apakah iklan yang menciptakan keinginan baru (bukan memenuhi kebutuhan) secara moral bermasalah?"] },

    9: { intro: "Etika di sepanjang rantai pasok dan dalam persaingan: dua wilayah tempat perusahaan Indonesia paling sering menghadapi dilema nyata.",
      concepts: [
        ["Kekuatan tawar & keadilan harga", "Perusahaan besar vs pemasok kecil; keterlambatan pembayaran sebagai isu etis."],
        ["Etika pengadaan", "Suap, gratifikasi, konflik kepentingan, dan transparansi tender."],
        ["Tanggung jawab rantai pasok", "Sejauh mana perusahaan bertanggung jawab atas praktik pemasoknya (kerja anak, keselamatan, lingkungan)."],
        ["Fair trade & sourcing berkelanjutan", "Sertifikasi dan keterbatasannya."],
        ["Etika persaingan", "Kartel, penetapan harga, predatory pricing, intelijen kompetitif yang melanggar batas."],
        ["Kolaborasi kompetitor", "Kapan kerja sama antar-pesaing menguntungkan publik dan kapan merugikan."]
      ],
      read: ["CM bab 9 (Suppliers, competitors, and business ethics)"],
      questions: ["Jika pemasok Anda mempekerjakan anak tanpa sepengetahuan Anda, apakah memutus kontrak adalah tindakan paling etis?",
        "Di industri yang semua pesaing memberi 'uang pelicin', apa strategi realistis bagi perusahaan yang menolak?"] },

    10: { intro: "Masyarakat sipil — LSM, komunitas, media, akademisi — kini menjadi kekuatan yang menuntut pertanggungjawaban perusahaan. Sesi ini membahas relasi yang sering bermusuhan tapi bisa menjadi kemitraan.",
      concepts: [
        ["Aktor masyarakat sipil", "LSM, gerakan sosial, komunitas adat, serikat, media."],
        ["Taktik pengaruh", "Kampanye, boikot, litigasi, shareholder resolution, dan advokasi."],
        ["Dari konfrontasi ke kemitraan", "Bentuk kolaborasi bisnis–LSM beserta risikonya bagi kedua pihak."],
        ["Akuntabilitas & legitimasi LSM", "Siapa yang mengawasi pengawas — isu penting yang sering dilupakan."],
        ["Komunitas lokal", "Persetujuan berbasis informasi (FPIC), kompensasi, dan dampak sosial proyek."],
        ["Konteks Indonesia", "Konflik lahan, tambang, dan perkebunan — kaitkan dengan daftar kasus Sesi 1."]
      ],
      read: ["CM bab 10 (Civil society and business ethics)"],
      questions: ["Kapan kemitraan bisnis–LSM berubah menjadi pembungkaman kritik?",
        "Bagaimana perusahaan menilai apakah sebuah kelompok masyarakat benar-benar mewakili komunitas yang terdampak?"] },

    11: { intro: "Pemerintah adalah pembuat aturan main sekaligus aktor ekonomi. Sesi ini membahas relasi bisnis–negara yang penuh godaan etis.",
      concepts: [
        ["Peran negara", "Regulator, pembeli, pemilik BUMN, dan pemberi izin."],
        ["Lobi & pengaruh politik", "Batas antara advokasi yang sah dan state capture."],
        ["Korupsi & suap", "Bentuk, dampak ekonominya, serta UU antikorupsi nasional dan lintas negara (FCPA, UK Bribery Act)."],
        ["Etika perpajakan", "Penghindaran pajak yang legal vs tanggung jawab fiskal — contoh klasik 'legal tapi tidak etis'."],
        ["Deregulasi & self-regulation", "Kapan pengaturan mandiri industri memadai, kapan gagal."],
        ["Privatisasi & BUMN", "Isu tata kelola khas perusahaan milik negara di Indonesia."]
      ],
      read: ["CM bab 11 (Government, regulation, and business ethics)"],
      questions: ["Di mana batas antara lobi yang sah dan mempengaruhi regulasi demi kepentingan sempit?",
        "Perusahaan multinasional membayar pajak sangat kecil di Indonesia melalui skema yang sah — apakah itu masalah etis atau masalah hukum?"] },

    12: { intro: "Sesi penutup: ke mana arah etika bisnis, dan bagaimana teknologi mengubah pertanyaannya. Termasuk sintesis seluruh mata kuliah.",
      concepts: [
        ["Etika teknologi", "AI, otomasi, privasi data, algoritma yang bias — deck dosen menyoroti pentingnya integritas pengguna AI."],
        ["Empat revolusi teknologi", "Pertanian, industri, bioteknologi, informasi — tiga pertanyaan tetap: apakah risikonya bisa diramal, apakah manfaatnya sepadan risikonya, dan apakah manfaat & risiko terdistribusi adil?"],
        ["Corporate governance ke depan", "Tuntutan transparansi, keberagaman dewan, dan akuntabilitas iklim."],
        ["Etika iklim & transisi energi", "Tanggung jawab antar-generasi atas sumber daya yang terbatas."],
        ["Globalisasi & tata kelola global", "Peran standar internasional ketika regulasi nasional tidak memadai."],
        ["Sintesis mata kuliah", "Menghubungkan teori (Sesi 3) → keputusan (Sesi 4) → pengelolaan (Sesi 5) → tiap stakeholder (Sesi 6–11)."]
      ],
      read: ["CM bab 12", "Modul/handout dari dosen", "Deck Prof. Eko bagian Isu Teknologi"],
      questions: ["Apakah kita punya kewajiban moral kepada generasi yang belum lahir atas sumber daya yang kita habiskan sekarang?",
        "Jika AI mengambil keputusan yang merugikan pelanggan, siapa yang bertanggung jawab: pembuat algoritma, perusahaan pengguna, atau tidak seorang pun?"] }
  },

  /* =================== GENERAL BUSINESS ENVIRONMENT =================== */
  gbe: {
    1: { intro: "Kuliah blok GBE dibuka dengan penjelasan mata kuliah. Datang sudah paham kerangka besarnya akan sangat membantu karena empat hari ke depan padat dan tiap topik dibawakan dosen berbeda.",
      concepts: [
        ["Sembilan lingkungan bisnis", "Ekonomi, hukum bisnis Indonesia, hukum bisnis internasional, demografi, sosial-budaya, politik, teknologi, alam, dan pemerintahan."],
        ["Perspektif CEO", "Silabus menegaskan setiap topik dibahas dari sudut pandang visioner seorang CEO — bukan sudut pandang akademis semata."],
        ["Environmental scanning", "Memindai tren, menilai probabilitasnya, lalu menilai dampaknya pada industri dan perusahaan."],
        ["Dari tren menjadi peluang/ancaman", "Analisis faktor lingkungan → tren & arah → peluang & ancaman → key success factors → strategi."],
        ["Bobot penilaian", "Partisipasi 9 topik @5% = 45% · makalah akhir 40% · presentasi makalah 15%. Kehadiran wajib 100%; di bawah 75% tidak boleh mengumpulkan tugas akhir."]
      ],
      read: ["Silabus GBE (MAN 6521)", "Modul kompilasi bahan bacaan tiap topik"],
      questions: ["Industri apa yang akan saya pilih untuk makalah akhir? (Pilih sejak hari pertama — semua topik bisa langsung dikaitkan ke sana.)",
        "Lingkungan mana yang paling menentukan nasib industri pilihan saya?"] },

    2: { intro: "Lingkungan ekonomi: variabel makro yang menentukan daya beli, biaya modal, dan iklim investasi. Dibawakan Gumilang Aryo Sahadewo.",
      concepts: [
        ["Struktur & perubahan kondisi ekonomi", "Pertumbuhan, inflasi, nilai tukar, suku bunga, dan pengangguran."],
        ["Kebijakan moneter & fiskal", "Bagaimana BI dan pemerintah memengaruhi biaya modal dan permintaan agregat."],
        ["Pembangunan & ekonomi regional", "Ketimpangan antar-daerah, otonomi ekonomi, dan pusat pertumbuhan baru."],
        ["Kebijakan industri & sektoral", "Hilirisasi, insentif, proteksi, dan dampaknya pada struktur biaya industri."],
        ["Perdagangan, investasi & keuangan", "Neraca perdagangan, FDI, dan akses pembiayaan."],
        ["Dampak ke peluang & ancaman bisnis", "Menerjemahkan indikator makro menjadi keputusan bisnis konkret."]
      ],
      read: ["Modul: economic environment (PPT Sahadewo)", "Data BPS & laporan BI terbaru sebagai bahan diskusi"],
      questions: ["Bagaimana pelemahan rupiah memengaruhi industri pilihan saya — lewat jalur biaya impor, utang valas, atau daya saing ekspor?",
        "Kebijakan hilirisasi menguntungkan sektor mana dan merugikan siapa?"] },

    3: { intro: "Lingkungan alam: hubungan timbal balik antara bisnis dan ekosistem. Dibawakan Pak Andhika. Bersinggungan langsung dengan mata kuliah Business Ethics Anda.",
      concepts: [
        ["Hubungan timbal balik bisnis–ekologi", "Bisnis mengambil dari alam dan mengembalikan limbah; keduanya saling bergantung."],
        ["Polusi & eksternalitas", "Private cost vs social cost; siapa menanggung biaya kerusakan."],
        ["Perubahan iklim & risiko fisik", "Banjir, kekeringan, cuaca ekstrem sebagai risiko operasional dan rantai pasok."],
        ["Tuntutan publik & konsumen", "Permintaan produk ramah lingkungan dan tekanan reputasi."],
        ["Regulasi lingkungan", "AMDAL, izin lingkungan, dan standar emisi di Indonesia."],
        ["Ekonomi sirkular", "Model bisnis yang mengurangi ekstraksi dan limbah."]
      ],
      read: ["Modul: natural environment (PDF Pak Andhika)"],
      questions: ["Risiko iklim mana yang paling nyata bagi industri pilihan saya dalam 10 tahun ke depan?",
        "Apakah kepatuhan lingkungan di Indonesia lebih ditentukan regulasi atau tekanan pasar?"] },

    4: { intro: "Lingkungan sosial & budaya: nilai, gaya hidup, dan struktur sosial yang membentuk perilaku konsumen dan karyawan. Dibawakan Desideria Cempaka.",
      concepts: [
        ["Nilai lokal & tren", "Keyakinan, nilai, persepsi, sikap, dan opini individu maupun kolektif."],
        ["Interaksi global & modernisasi", "Bagaimana budaya global berinteraksi dengan nilai lokal."],
        ["Perubahan sosial-budaya", "Pergeseran struktur dan pola interaksi masyarakat."],
        ["Dampak pada tempat kerja", "Pola kerja & waktu luang, dinamika karier, ekspektasi dan komposisi karyawan."],
        ["Konsumen Indonesia", "Religiusitas, komunalitas, dan pengaruh media sosial pada keputusan beli."],
        ["Implikasi pemasaran & SDM", "Menyesuaikan produk, komunikasi, dan kebijakan kerja pada nilai setempat."]
      ],
      read: ["Modul: social environment (PPT Desideria)"],
      questions: ["Pergeseran nilai generasi mana yang paling mengubah industri pilihan saya?",
        "Kapan adaptasi budaya berubah menjadi eksploitasi sentimen?"] },

    5: { intro: "Lingkungan politik nasional & internasional: stabilitas, relasi kekuasaan, dan geopolitik yang menentukan kepastian berusaha. Dibawakan Hempri Suyatna.",
      concepts: [
        ["Relasi eksekutif–legislatif–yudikatif", "Bagaimana pembagian kekuasaan memengaruhi kepastian hukum bisnis."],
        ["Struktur & perubahan kekuatan politik", "Relasi antar-kelompok politik, arah dan stabilitas politik."],
        ["Relasi pemerintah–swasta", "Parameter hukum & regulasi, perencanaan nasional, dan peran bisnis."],
        ["Geopolitik dunia", "Aliansi berbasis kepentingan ekonomi, relasi Utara–Selatan dan Timur–Barat."],
        ["Institusi ekonomi global", "Peran WTO, IMF, Bank Dunia, dan blok regional."],
        ["Dampak ke ekonomi & bisnis Indonesia", "Bagaimana politik global menjalar ke peluang dan ancaman lokal."]
      ],
      read: ["Modul: political environment (PPT Hempri Suyatna)"],
      questions: ["Bagaimana siklus pemilu memengaruhi keputusan investasi di industri pilihan saya?",
        "Ketegangan geopolitik mana yang paling berisiko bagi rantai pasok Indonesia?"] },

    6: { intro: "Lingkungan demografi: struktur penduduk yang menentukan pasar dan tenaga kerja untuk dekade mendatang. Dibawakan Ibu Amelia.",
      concepts: [
        ["Variabel demografi", "Struktur menurut usia, gender, etnis, pendidikan, pendapatan, pekerjaan, dan wilayah."],
        ["Bonus demografi Indonesia", "Peluang dan syaratnya; risiko bila kualitas SDM tidak menyusul."],
        ["Urbanisasi & migrasi", "Perpindahan penduduk dan dampaknya pada pasar serta tenaga kerja."],
        ["Dampak pada tenaga kerja", "Ketersediaan, keterampilan, dan biaya tenaga kerja."],
        ["Dampak pada permintaan", "Perubahan struktur penduduk mengubah komposisi permintaan barang & jasa."],
        ["Penuaan penduduk", "Tren jangka panjang yang mengubah pasar kesehatan, keuangan, dan konsumsi."]
      ],
      read: ["Modul: demographical environment (PDF Ibu Amelia)", "Data sensus & proyeksi penduduk BPS"],
      questions: ["Segmen demografi mana yang tumbuh paling cepat di pasar industri pilihan saya?",
        "Apakah bonus demografi Indonesia akan menjadi peluang atau beban bagi industri saya?"] },

    7: { intro: "Lingkungan teknologi: laju perubahan yang paling cepat mengubah aturan main industri. Dibawakan Pak Wirawan.",
      concepts: [
        ["Tren & kemajuan teknologi", "Arah perkembangan dan kecepatan adopsinya."],
        ["Pengembangan produk & proses", "Bagaimana teknologi mengubah apa yang dijual dan cara memproduksinya."],
        ["Disrupsi digital", "Model bisnis baru yang menggeser petahana — kaitkan dengan 8 model bisnis digital di OTM Anda."],
        ["AI & otomasi", "Dampak pada produktivitas dan komposisi pekerjaan."],
        ["Kesiapan adopsi", "Infrastruktur, keterampilan, dan budaya organisasi sebagai prasyarat."],
        ["Risiko teknologi", "Keamanan siber, ketergantungan vendor, dan keusangan cepat."]
      ],
      read: ["Modul: technology environment (PDF Pak Wirawan)"],
      questions: ["Teknologi apa yang paling mungkin mendisrupsi industri pilihan saya dalam 5 tahun?",
        "Apakah perusahaan di industri saya siap secara budaya, bukan hanya secara alat?"] },

    8: { intro: "Lingkungan hukum bisnis Indonesia: aturan main formal yang membatasi dan melindungi kegiatan usaha. Dibawakan Pak Ferry.",
      concepts: [
        ["Hukum kontrak", "Syarat sah, wanprestasi, dan penyelesaian sengketa."],
        ["Hukum investasi", "Daftar bidang usaha, perizinan berusaha, dan kepemilikan asing."],
        ["Hukum persaingan usaha", "Larangan kartel, monopoli, dan peran KPPU."],
        ["Perlindungan konsumen", "Kewajiban pelaku usaha dan hak konsumen — bersinggungan dengan BES sesi 8."],
        ["Perbankan & pasar modal", "Aturan pembiayaan dan keterbukaan informasi emiten."],
        ["Ketenagakerjaan & HKI", "Aturan hubungan kerja serta perlindungan kekayaan intelektual."]
      ],
      read: ["Modul: hukum dan hukum bisnis (PPT Pak Ferry)"],
      questions: ["Risiko hukum apa yang paling sering diremehkan perusahaan di industri pilihan saya?",
        "Bagaimana perubahan regulasi terbaru mengubah struktur biaya kepatuhan?"] },

    9: { intro: "Lingkungan hukum bisnis internasional: aturan yang berlaku ketika transaksi melewati batas negara. (Materi dan dosen menyusul.)",
      concepts: [
        ["Kontrak internasional", "Pilihan hukum, pilihan forum, dan klausul penting."],
        ["Arbitrase internasional", "Mengapa sengketa lintas negara umumnya diselesaikan lewat arbitrase."],
        ["Foreign direct investment", "Perlindungan investasi dan perjanjian bilateral."],
        ["Hak kekayaan intelektual internasional", "Perlindungan lintas yurisdiksi."],
        ["Regionalisasi", "AEC/ASEAN, EU, dan blok perdagangan lain beserta implikasinya."],
        ["Kepatuhan lintas negara", "Aturan antisuap ekstrateritorial dan sanksi perdagangan."]
      ],
      read: ["Modul (menyusul dari koordinator)"],
      questions: ["Jika industri saya mengekspor, hukum negara mana yang paling menentukan kontraknya?",
        "Apa manfaat nyata AEC bagi industri pilihan saya sejauh ini?"] },

    10: { intro: "Lingkungan pemerintahan: struktur, perilaku, dan agenda pemerintah sebagai penentu aturan main. (Materi dan dosen menyusul.)",
      concepts: [
        ["Struktur & perilaku pemerintah", "Bagaimana keputusan publik dibuat dan dijalankan."],
        ["Regulasi & deregulasi", "Siklus pengetatan dan pelonggaran aturan."],
        ["Relasi pusat–daerah", "Otonomi daerah dan implikasinya pada perizinan serta pajak daerah."],
        ["Privatisasi BUMN", "Perubahan peran negara sebagai pemilik usaha."],
        ["Agenda politik & tekanan isu", "Bagaimana isu publik menjadi kebijakan."],
        ["Aturan main bagi bisnis", "Cakupan dan sifat relasi pemerintah dengan dunia usaha."]
      ],
      read: ["Modul (menyusul dari koordinator)"],
      questions: ["Level pemerintahan mana yang paling menentukan izin usaha di industri pilihan saya?",
        "Bagaimana perusahaan membangun relasi dengan pemerintah tanpa melanggar batas etis? (kaitkan dengan BES sesi 11)"] }
  },

  /* =================== STRATEGIC MANAGEMENT =================== */
  sm: {
    3: { intro: "Setelah tahu ke mana perusahaan menuju (Sesi 2), sesi ini menganalisis medannya: seberapa menarik industri kita dan kekuatan apa yang menekan profitabilitas.",
      concepts: [
        ["PESTEL", "Analisis lingkungan makro: politik, ekonomi, sosial-budaya, teknologi, ekologi, legal — bersinggungan langsung dengan mata kuliah GBE Anda."],
        ["Porter's Five Forces", "Rivalitas, pendatang potensial, produk substitusi, daya tawar pemasok, daya tawar pembeli. Kuasai cara menilai kuat-lemahnya tiap kekuatan."],
        ["Driving forces", "Kekuatan yang mengubah struktur industri: teknologi, regulasi, perubahan preferensi."],
        ["Industry value chain", "Di mana nilai tercipta sepanjang rantai industri, dan di mana marginnya menumpuk."],
        ["Strategic group mapping", "Memetakan pesaing berdasarkan dua dimensi strategis untuk melihat siapa lawan langsung Anda."],
        ["Key success factors (KSF)", "Faktor yang menentukan menang-kalah di industri tersebut."]
      ],
      read: ["TPGS bab 3", "Porter (1980) bab 1, 3, 4, 7, 8"],
      questions: ["Untuk industri yang saya kenal, kekuatan mana dari lima forces yang paling menekan laba — dan apa yang bisa dilakukan manajemen terhadapnya?",
        "Apakah analisis five forces masih memadai untuk industri platform digital? Apa yang terlewat?"] },

    4: { intro: "Kebalikan dari Sesi 3: alih-alih melihat ke luar, sesi ini melihat ke dalam — sumber daya dan kapabilitas apa yang benar-benar membuat perusahaan unggul.",
      concepts: [
        ["SWOT yang benar", "Kekuatan/kelemahan bersifat internal dan relatif terhadap pesaing, bukan daftar keinginan."],
        ["Resource-based view (RBV)", "Keunggulan berasal dari sumber daya yang bernilai dan sulit ditiru, bukan dari posisi pasar semata."],
        ["Uji VRIO", "Valuable, Rare, costly to Imitate, Organized to capture value — kerangka wajib hafal."],
        ["Core competence", "Kapabilitas lintas fungsi yang menjadi akar banyak produk sekaligus."],
        ["Value chain analysis (Porter)", "Aktivitas primer dan pendukung; di mana perusahaan menambah nilah unik."],
        ["Benchmarking & analisis biaya", "Membandingkan biaya aktivitas dengan pesaing untuk menemukan sumber ketidakunggulan."]
      ],
      read: ["TPGS bab 4", "Porter (1980) bab 2, 5, 6"],
      questions: ["Sumber daya perusahaan saya yang mana yang benar-benar lolos keempat uji VRIO?",
        "Apa beda 'kami punya karyawan bagus' dengan core competence yang sesungguhnya?"] },

    5: { intro: "Dari analisis ke pilihan: bagaimana perusahaan memutuskan cara bersaing di satu bisnis tertentu.",
      concepts: [
        ["Lima strategi generik", "Low-cost provider, broad differentiation, focused low-cost, focused differentiation, best-cost provider."],
        ["Syarat keberhasilan tiap strategi", "Kondisi pasar dan kapabilitas yang harus dimiliki agar strategi itu berhasil."],
        ["Risiko tiap strategi", "Kapan diferensiasi menjadi mahal tanpa dihargai pasar; kapan kepemimpinan biaya terkejar."],
        ["Stuck in the middle", "Bahaya mencoba semua strategi sekaligus tanpa sistem aktivitas yang koheren."],
        ["Sumber keunggulan biaya", "Skala, pengalaman, efisiensi rantai nilai, dan desain ulang proses."],
        ["Sumber diferensiasi", "Atribut produk, layanan, merek, dan pengalaman pelanggan."]
      ],
      read: ["TPGS bab 5"],
      questions: ["Perusahaan Indonesia mana yang menurut Anda berhasil menjalankan best-cost provider strategy? Apa buktinya?",
        "Bagaimana membedakan diferensiasi yang bernilai dari sekadar biaya tambahan?"] },

    6: { intro: "Setelah memilih strategi dasar, sesi ini membahas manuver untuk memperkuat posisi: kapan menyerang, kapan bertahan, seberapa luas bermain.",
      concepts: [
        ["Strategic offensives & defenses", "Serangan pada kelemahan pesaing, blue ocean, dan langkah bertahan."],
        ["Timing", "Keunggulan dan kerugian menjadi first mover versus fast follower."],
        ["Scope of operations", "Integrasi vertikal, outsourcing, aliansi strategis, dan merger-akuisisi."],
        ["Industri terfragmentasi", "Strategi bersaing ketika tidak ada pemain dominan."],
        ["Evolusi industri", "Menyesuaikan strategi saat industri tumbuh, matang, atau menurun."],
        ["Aliansi & kemitraan", "Kapan bermitra lebih baik daripada membangun atau membeli."]
      ],
      read: ["TPGS bab 6", "Porter (1980) bab 9–12", "TPGS Kasus 12"],
      questions: ["Kapan menjadi first mover justru merugikan? Beri contoh dari industri teknologi.",
        "Untuk industri terfragmentasi seperti kuliner Indonesia, strategi konsolidasi seperti apa yang masuk akal?"] },

    7: { intro: "Sesi terakhir sebelum UTS: bagaimana bersaing ketika melewati batas negara. Bersinggungan langsung dengan materi operasi global OTM Anda.",
      concepts: [
        ["Mengapa go international", "Akses pasar, biaya lebih rendah, sumber daya, dan penyebaran risiko."],
        ["Perbedaan antar-negara", "Biaya, budaya, regulasi, dan nilai tukar sebagai penentu strategi."],
        ["Opsi masuk pasar", "Ekspor, lisensi, waralaba, aliansi, joint venture, dan anak perusahaan penuh."],
        ["Multi-domestic vs global strategy", "Adaptasi lokal versus standardisasi global — persis matriks yang Anda pelajari di OTM."],
        ["Transnational strategy", "Menggabungkan efisiensi global dengan responsivitas lokal."],
        ["Bersaing di pasar berkembang", "Strategi menghadapi pemain lokal dan kondisi institusi yang berbeda."]
      ],
      read: ["TPGS bab 7", "Porter (1980) bab 13"],
      questions: ["Untuk merek Indonesia yang ekspansi regional, opsi masuk pasar mana yang paling masuk akal dan mengapa?",
        "Apa yang membuat strategi transnasional begitu sulit dieksekusi?"] },

    8: { intro: "Naik satu level: dari strategi satu bisnis ke strategi perusahaan multi-bisnis. Pertanyaan intinya — apakah induk perusahaan benar-benar menambah nilai?",
      concepts: [
        ["Kapan diversifikasi masuk akal", "Uji daya tarik industri, uji biaya masuk, dan uji better-off."],
        ["Diversifikasi terkait vs tak terkait", "Strategic fit lintas rantai nilai versus konglomerasi murni."],
        ["Corporate & parenting advantage", "Nilai tambah yang hanya bisa diberikan induk perusahaan."],
        ["Growth-share matrix (BCG)", "Star, cash cow, question mark, dog — beserta keterbatasannya."],
        ["Sembilan langkah evaluasi", "Prosedur TPGS mengevaluasi strategi perusahaan terdiversifikasi."],
        ["Restrukturisasi portofolio", "Divestasi, spin-off, dan retrenchment."]
      ],
      read: ["TPGS bab 8", "Porter (1980) bab 14–16", "TPGS Kasus 21"],
      questions: ["Konglomerat Indonesia yang Anda kenal: apakah induknya benar-benar menambah nilai, atau anak usahanya akan lebih baik berdiri sendiri?",
        "Mengapa banyak diversifikasi tak terkait gagal menciptakan nilai?"] },

    9: { intro: "Lanjutan strategi korporat dengan penekanan pada analisis portofolio dan pengambilan keputusan alokasi sumber daya lintas unit bisnis.",
      concepts: [
        ["Menilai strategic fit", "Kecocokan rantai nilai, teknologi, merek, dan distribusi antar unit bisnis."],
        ["Kecukupan sumber daya", "Apakah induk sanggup mendanai seluruh portofolio."],
        ["Prioritas alokasi modal", "Unit mana yang didanai, dipertahankan, atau dilepas."],
        ["Sinergi nyata vs sinergi di atas kertas", "Mengapa sinergi sering gagal terwujud setelah akuisisi."],
        ["Strategi masuk & keluar", "Akuisisi, pengembangan internal, joint venture; serta kapan keluar."],
        ["Kinerja portofolio", "Mengukur apakah keseluruhan lebih bernilai daripada jumlah bagiannya."]
      ],
      read: ["TPGS bab 8 (lanjutan)", "TPGS Kasus 22"],
      questions: ["Apa indikator paling awal bahwa sebuah akuisisi tidak akan menghasilkan sinergi yang dijanjikan?",
        "Bagaimana induk perusahaan memutuskan melepas unit bisnis yang masih menguntungkan?"] },

    10: { intro: "Sesi yang paling bersinggungan dengan mata kuliah Business Ethics Anda: menghubungkan strategi dengan etika, tanggung jawab sosial, dan keberlanjutan lingkungan.",
      concepts: [
        ["Strategi & standar etika", "Etika sebagai bagian strategi, bukan pelengkap; biaya nyata dari kegagalan etis."],
        ["Universalisme vs relativisme etika", "Perdebatan yang sama persis dengan yang Anda temui di BES Sesi 1."],
        ["CSR & shared value", "Dari filantropi menuju penciptaan nilai bersama (Porter & Kramer)."],
        ["Sustainability strategy", "Menyusun strategi yang layak secara lingkungan dan sosial dalam jangka panjang."],
        ["Triple bottom line", "Kerangka yang juga Anda pelajari di BES — perhatikan bagaimana SM memakainya untuk keputusan strategis."],
        ["Business case keberlanjutan", "Kapan keberlanjutan meningkatkan laba dan kapan menuntut trade-off nyata."]
      ],
      read: ["TPGS bab 9", "TPGS Kasus 31"],
      questions: ["Apakah ada bukti bahwa perusahaan yang lebih etis berkinerja finansial lebih baik — atau sebaliknya?",
        "Bagaimana menyusun strategi keberlanjutan yang bukan sekadar greenwashing?"] },

    11: { intro: "Strategi yang bagus gagal karena eksekusi yang buruk. Sesi ini membahas cara menerjemahkan strategi menjadi struktur, kapabilitas, dan tindakan.",
      concepts: [
        ["Kerangka 7S McKinsey", "Strategy, structure, systems, staff, skills, style, shared values — semua harus saling cocok."],
        ["Pendekatan 8S", "Silabus menyebut 7S + Sustainability sebagai pendekatan terintegrasi."],
        ["Membangun kapabilitas organisasi", "Mengembangkan, mengakuisisi, atau bermitra untuk kapabilitas yang dibutuhkan strategi."],
        ["Desain struktur organisasi", "Menyelaraskan struktur dengan aktivitas kritis strategi."],
        ["Alokasi sumber daya & kebijakan", "Anggaran dan prosedur sebagai alat implementasi."],
        ["Manajemen perubahan", "Mengatasi resistensi saat strategi menuntut cara kerja baru."]
      ],
      read: ["TPGS bab 10"],
      questions: ["Dari tujuh elemen 7S, mana yang paling sering diabaikan saat perusahaan menjalankan strategi baru?",
        "Apakah struktur mengikuti strategi, atau justru struktur yang membatasi strategi yang mungkin?"] },

    12: { intro: "Sesi penutup: mengelola operasi internal, mengevaluasi hasil strategi, serta peran budaya dan kepemimpinan — sekaligus persiapan UAS.",
      concepts: [
        ["Mengelola operasi internal", "Sistem informasi, praktik terbaik, perbaikan berkelanjutan, dan sistem imbalan."],
        ["Evaluasi & kontrol strategik", "Menetapkan ukuran, membandingkan hasil, dan mengoreksi arah."],
        ["Balanced scorecard", "Empat perspektif untuk memantau eksekusi strategi."],
        ["Budaya korporat", "Budaya yang sehat vs tidak sehat; menyelaraskan budaya dengan strategi."],
        ["Kepemimpinan strategik", "Peran pemimpin dalam mendorong eksekusi dan perubahan."],
        ["Sintesis mata kuliah", "Merangkai analisis (bab 3–4) → pilihan (bab 5–8) → eksekusi (bab 10–12)."]
      ],
      read: ["TPGS bab 12", "TPGS Kasus 25", "Untuk UAS: TPGS bab 8–12"],
      questions: ["Mengapa budaya sering disebut 'memakan strategi untuk sarapan'? Setujukah Anda?",
        "Ukuran apa yang paling awal menunjukkan bahwa eksekusi strategi sedang melenceng?"] }
  }
};
