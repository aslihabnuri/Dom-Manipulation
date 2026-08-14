/* ============================================================
   OTM Study Hub — Data Mata Kuliah
   Operations & Technology Management (MAN 5322 / EBMY231001)
   MBA UGM — Semester 2

   Cara menambah materi pertemuan berikutnya:
   1. Cari sesi di array SESSIONS di bawah (id sesuai nomor sesi).
   2. Isi field `summary` (array of section) dengan rangkuman materi.
   3. Tambahkan kartu di FLASHCARDS dan soal di QUIZZES
      dengan `session` = nomor sesi tersebut.
   ============================================================ */

window.OTM_DATA = {
  course: {
    title: "Operations & Technology Management",
    codes: "MAN 5322 · EBMY231001",
    program: "Magister Business Administration — Universitas Gadjah Mada",
    semester: "Semester 2 · Kelas S51A",
    classCode: "dm3cpfej",
    lecturer: {
      name: "Nur Aini Masruroh",
      dept: "Industrial Engineering, Universitas Gadjah Mada",
      education: "ST (UGM) · M.Sc. (University of Manchester) · Ph.D (National University of Singapore)"
    },
    driveLinks: [
      { label: "Folder Semester 2 - MBA UGM", url: "https://drive.google.com/drive/folders/15qUTfHdRAi-x3eaxfZEapQHXArC-RY2R" },
      { label: "Materi PPT", url: "https://drive.google.com/drive/folders/1R3WoiIFFQOTY50GOH-CKDdrEOHXdu1kk" },
      { label: "Buku (Turban — IT for Management)", url: "https://drive.google.com/drive/folders/1b5_8m64PzZ4t9kTk-YWCoBAwtMzxXx1T" },
      { label: "Silabus (OTM Course Plan S51A)", url: "https://drive.google.com/drive/folders/1rxDRJPytT2b7Vyo2nHEtcfn6f3UZ_qJ2" }
    ],
    assessment: [
      { label: "Partisipasi di kelas", weight: 10 },
      { label: "Ujian tengah semester (individu)", weight: 25 },
      { label: "Presentasi proyek tim I", weight: 20 },
      { label: "Presentasi proyek tim II", weight: 20 },
      { label: "Laporan proyek individu (UAS)", weight: 25 }
    ],
    references: [
      { code: "SBB", text: "Slack, Brandon-Jones & Burgess (2022), Operations Management, 10th Ed., Pearson." },
      { code: "HRM", text: "Heizer, Render & Munson (2017), Operations Management, 12th Ed., Pearson." },
      { code: "TPW", text: "Turban, Pollard & Wood (2025), Information Technology for Management, 13th Ed., Wiley." }
    ],
    objectives: [
      "Memahami konsep dasar operations management sebagai bagian integral dari business value chain.",
      "Mampu menerapkan sepuluh keputusan utama (ten decisions) operations management.",
      "Memahami fundamental technology management.",
      "Mampu memanfaatkan teknologi sebagai enabler efektivitas dan efisiensi operasi bisnis.",
      "Memahami relevansi operations & technology management dalam lingkungan kontemporer."
    ]
  },

  /* ---------- 12 sesi sesuai OTM Course Plan S51A ---------- */
  sessions: [
    {
      id: 1, date: "2026-08-14", dateLabel: "14 Agustus 2026",
      topic: "Operations Management & Business Value Chain",
      subtopics: ["Operations Management", "Operations Performance", "Operations Strategy"],
      readings: ["SBB bab 1, 2", "HRM bab 1", "TPW bab 1"],
      caseStudy: null,
      summary: [
        {
          heading: "Apa itu Operations Management?",
          body: `<p><strong>Operations management (OM)</strong> adalah aktivitas mengelola sumber daya yang menciptakan dan
            menyampaikan produk & jasa (Slack, Brandon-Jones & Burgess, 2022) — atau serangkaian aktivitas yang menciptakan
            nilai dalam bentuk barang & jasa dengan <em>mentransformasi input menjadi output</em> (Heizer, Render & Munson).</p>
            <p><strong>Mengapa belajar OM?</strong> (1) OM adalah bagian paling mahal dari organisasi, (2) OM adalah salah satu
            fungsi utama organisasi, (3) kita perlu tahu bagaimana barang/jasa diproduksi, (4) kita perlu memahami apa yang
            dikerjakan operations manager.</p>
            <p>Semua operasi bekerja lewat proses <strong>input → transformation → output</strong>. Input yang ditransformasi
            (transformed resources) bisa dominan berupa: <strong>material</strong> (manufaktur, ritel, logistik),
            <strong>informasi</strong> (akuntan, bank, riset pasar), atau <strong>pelanggan</strong> (rumah sakit, hotel, transportasi).</p>
            <p>Bedakan dua makna "operations": sebagai <strong>fungsi</strong> (bagian organisasi yang menciptakan produk/jasa
            untuk pelanggan eksternal) dan sebagai <strong>aktivitas</strong> (pengelolaan proses di fungsi mana pun —
            artinya OM relevan untuk semua bagian bisnis).</p>`
        },
        {
          heading: "The Four Vs",
          body: `<p>Semua proses operasi sama-sama mentransformasi input, tetapi berbeda dalam empat dimensi (<strong>4 Vs</strong>):</p>
            <ul>
              <li><strong>Volume</strong> — seberapa banyak output dihasilkan.</li>
              <li><strong>Variety</strong> — seberapa beragam output-nya.</li>
              <li><strong>Variation</strong> — seberapa fluktuatif permintaannya.</li>
              <li><strong>Visibility</strong> — seberapa terlihat proses penciptaan output bagi pelanggan.</li>
            </ul>
            <p>Implikasi biaya: operasi dapat <strong>menurunkan biaya</strong> dengan volume <em>tinggi</em>, variety <em>rendah</em>,
            variation <em>rendah</em>, dan visibility <em>rendah</em>. Contoh kontras: Ski Verbier Exclusive (mewah, variety & visibility
            tinggi → biaya tinggi) vs hotelF1 (standar, kontak pelanggan minimal → biaya sangat rendah).</p>`
        },
        {
          heading: "Apa yang Dikerjakan Operations Manager?",
          body: `<p>Empat aktivitas inti: <strong>Directing</strong> strategi keseluruhan operasi, <strong>Designing</strong>
            produk/jasa & proses, <strong>Planning & controlling</strong> penyampaian proses, dan <strong>Developing</strong>
            kinerja proses (perbaikan berkelanjutan).</p>
            <p><strong>10 Keputusan Kritis OM</strong> (Heizer): (1) desain barang & jasa, (2) manajemen kualitas,
            (3) desain proses & kapasitas, (4) strategi lokasi, (5) strategi layout, (6) SDM & desain pekerjaan,
            (7) supply-chain management, (8) persediaan/MRP/JIT, (9) penjadwalan jangka menengah–pendek, (10) pemeliharaan.</p>
            <p><strong>Tantangan OM masa kini</strong> — pergeseran dari: fokus lokal → <em>global</em>; pengiriman batch →
            <em>just-in-time</em>; pembelian harga terendah → <em>kemitraan supply chain</em>; pengembangan produk lama →
            <em>cepat & beraliansi</em>; produk standar → <em>mass customization</em>; spesialisasi kerja →
            <em>karyawan berdaya & tim</em>.</p>`
        },
        {
          heading: "Digital Transformation & Digital Business Model",
          body: `<p><strong>Digital transformation</strong> adalah proses menggunakan teknologi digital untuk menciptakan atau
            memodifikasi proses bisnis, budaya, dan pengalaman pelanggan sesuai perubahan kebutuhan pasar. Pandemi COVID-19
            mempercepat adopsi digital 3–4 tahun.</p>
            <p><strong>Digital business model</strong> menentukan bagaimana perusahaan menghasilkan uang dan mencapai tujuannya
            menggunakan teknologi digital (website, media sosial, mobile). Model ini membuat perusahaan customer-centric, agile,
            data-driven, dan berjangkauan global. Model sering dipakai kombinasi — contoh Walmart: menjual produk sendiri
            secara online sekaligus menjadi marketplace bagi penjual lain.</p>
            <p>Digital business model harus: memberi customer experience luar biasa, menghasilkan profit, menaikkan market share,
            mengubah proses, dan melibatkan karyawan secara kreatif. Ingat: transformasi digital bukan sekadar memasang teknologi
            baru — perubahan proses, budaya, dan peran karyawan tidak boleh diabaikan.</p>`
        },
        {
          heading: "Operations Performance: 5 Performance Objectives",
          body: `<p>Kinerja operasi dinilai pada tiga level (societal, strategic, operational), dan operations manager wajib
            memahami tujuan para stakeholder yang kadang saling bertentangan. Di level operasional ada
            <strong>lima performance objectives</strong>:</p>
            <ul>
              <li><strong>Quality</strong> — kesesuaian dengan kebutuhan pelanggan; kualitas menurunkan biaya (rework, scrap,
                garansi turun) dan menaikkan dependability & penjualan.</li>
              <li><strong>Speed</strong> — waktu antara pelanggan meminta dan menerima produk/jasa; speed mengurangi persediaan dan risiko.</li>
              <li><strong>Dependability</strong> — menepati janji waktu penyampaian; menghemat waktu & uang, memberi stabilitas,
                dan dalam jangka panjang bisa mengalahkan semua kriteria lain.</li>
              <li><strong>Flexibility</strong> — kemampuan berubah: product/service flexibility, mix flexibility, volume flexibility,
                delivery flexibility. Flexibility mempercepat respons, menghemat waktu, menjaga dependability.</li>
              <li><strong>Cost</strong> — biaya serendah mungkin yang masih kompatibel dengan level 4 objective lainnya.
                Secara internal, cost dipengaruhi oleh keempat objective lain.</li>
            </ul>
            <p><strong>Polar diagram</strong> dipakai untuk menggambarkan kepentingan relatif tiap objective (mis. taksi vs bus).
            Ada <strong>trade-off</strong> antar objective — konsep <em>efficient frontier</em> menunjukkan batas kombinasi kinerja
            terbaik yang bisa dicapai.</p>`
        },
        {
          heading: "Produktivitas",
          body: `<p><strong>Produktivitas = Output ÷ Input.</strong> Ukuran perbaikan proses yang paling sering dipakai untuk cost.</p>
            <ul>
              <li><strong>Single-factor productivity</strong> — satu input, mis. labor productivity = unit yang diproduksi ÷ jam kerja.</li>
              <li><strong>Multifactor (total factor) productivity</strong> — Output ÷ (Labor + Material + Energy + Capital + Miscellaneous),
                biasanya dalam satuan uang. Memberi gambaran lebih lengkap karena mencakup semua biaya.</li>
            </ul>
            <p><strong>Contoh Collins Title:</strong> 4 staf × 8 jam (payroll $640/hari), overhead $400/hari, memproses 8 titel/hari.
            Labor productivity = 8 ÷ 32 = 0,25 titel/jam. Dengan sistem komputer: 14 titel/hari, overhead naik jadi $800.
            Labor productivity = 14 ÷ 32 = 0,4375 (naik 75%). Multifactor: 8 ÷ 1040 = 0,0077 → 14 ÷ 1440 = 0,0097 (naik 26%).</p>
            <p><strong>Contoh Starbucks:</strong> perbaikan kecil (hapus tanda tangan kartu kredit &lt;$25 = 8 detik; scoop es baru =
            14 detik; mesin espresso baru = 12 detik) → revenue per gerai naik $200.000 menjadi $940.000 dalam 6 tahun;
            produktivitas naik 27% (±4,5%/tahun).</p>`
        },
        {
          heading: "Operations Strategy: 4 Perspektif",
          body: `<p><strong>Operations strategy</strong> = pola keputusan dan aksi yang membentuk visi jangka panjang, tujuan, dan
            kapabilitas operasi serta kontribusinya terhadap strategi bisnis keseluruhan. Empat perspektif pembentuknya:</p>
            <ul>
              <li><strong>Top-down</strong> — strategi operasi mengikuti hierarki: corporate → business → functional strategy.
                Perlu <em>correspondence</em> & <em>coherence</em> antar keputusan.</li>
              <li><strong>Outside-in (market)</strong> — dibentuk kebutuhan pasar. Kenali <strong>order winners</strong> (faktor yang
                langsung memenangkan bisnis), <strong>order qualifiers</strong> (syarat minimum agar dipertimbangkan pelanggan),
                dan <em>less important factors</em>. Posisi product life cycle juga menggeser objective.</li>
              <li><strong>Bottom-up</strong> — arah strategis muncul dari pengalaman operasional sehari-hari.</li>
              <li><strong>Inside-out (operations resources)</strong> — keunggulan kompetitif jangka panjang berasal dari kapabilitas
                sumber daya & proses operasi yang dikembangkan jangka panjang.</li>
            </ul>
            <p><strong>Operations strategy matrix</strong> mencari "line of fit" antara market requirements dan operations capabilities.
            <strong>Importance–performance matrix</strong> membagi faktor kompetitif ke 4 zona: <em>appropriate</em> (memuaskan),
            <em>improve</em> (perlu perbaikan), <em>urgent-action</em> (penting bagi pelanggan tapi di bawah kompetitor — perbaiki segera),
            dan <em>excess?</em> (kinerja tinggi tapi tidak penting — mungkin sumber dayanya dialihkan).</p>`
        },
        {
          heading: "Competitive Advantage & Operasi Global",
          body: `<p>Tiga strategi keunggulan kompetitif melalui operasi:</p>
            <ul>
              <li><strong>Differentiation</strong> — lebih baik/berbeda (Disney: experience differentiation, Hard Rock Cafe: dining experience).</li>
              <li><strong>Cost leadership</strong> — nilai maksimum di mata pelanggan dengan biaya rendah, bukan kualitas rendah
                (Southwest Airlines, Walmart, Franz Colruyt).</li>
              <li><strong>Response</strong> — respons cepat: flexibility (HP), reliability (industri mesin Jerman), timeliness (Pizza Hut, Motorola).</li>
            </ul>
            <p><strong>Enam alasan go-global:</strong> (1) memperbaiki supply chain, (2) menekan biaya & risiko kurs
            (termasuk <em>operational hedging</em>), (3) memperbaiki operasi (belajar dari negara lain), (4) memahami pasar,
            (5) memperbaiki produk (aliansi R&D, mis. Toyota–BMW), (6) menarik & mempertahankan talenta global.
            Perhatikan juga isu budaya & etika: ketepatan waktu, kekayaan intelektual, suap, pekerja anak, dsb.</p>`
        },
        {
          heading: "Pendalaman dari Buku HRM Bab 1",
          body: `<p>Tambahan dari buku <strong>Heizer, Render & Munson bab 1</strong> yang tidak dibahas mendalam di slide:</p>
            <p><strong>Perbedaan barang (goods) vs jasa (services):</strong> jasa bersifat intangible (kursi pesawat vs
            pengalaman terbangnya), diproduksi & dikonsumsi bersamaan (potong rambut), unik per pelanggan, interaksi pelanggan
            tinggi, definisi produknya tidak konsisten (asuransi berubah sesuai usia), berbasis pengetahuan (hukum, pendidikan,
            medis — sulit diotomasi), tersebar lokasinya, kualitasnya sulit dievaluasi, dan tidak bisa dijual kembali —
            kebalikan dari barang yang tangible, bisa disimpan sebagai persediaan, terstandardisasi, dan mudah diotomasi.</p>
            <p><strong>Tiga variabel produktivitas</strong> — kenaikan produktivitas bergantung pada:</p>
            <ul>
              <li><strong>Labor</strong> — menyumbang ±10% kenaikan tahunan;</li>
              <li><strong>Capital</strong> — menyumbang ±38%;</li>
              <li><strong>Management</strong> — menyumbang ±52% (kontributor terbesar!).</li>
            </ul>
            <p>Ketiganya adalah area luas tempat manajer bisa bertindak untuk memperbaiki produktivitas. Latihan dari buku
            (lanjutan contoh Collins Title): jika overhead naik ke $960 (bukan $800), multifactor productivity = 14 ÷ (640+960)
            = <strong>0,00875</strong> — coba hitung sendiri di menu Kalkulator!</p>`
        }
      ]
    },
    {
      id: 2, date: "2026-08-15", dateLabel: "15 Agustus 2026",
      topic: "Operations Strategy",
      subtopics: ["Operations Strategy (lanjutan & pendalaman)"],
      readings: ["SBB bab 3", "HRM bab 2"],
      caseStudy: null,
      summary: [
        {
          heading: "Operations Strategy dalam Lingkungan Global (HRM Bab 2)",
          body: `<p>Rangkuman ini disusun dari buku <strong>Heizer, Render & Munson bab 2 — "Operations Strategy in a
            Global Environment"</strong> (bacaan wajib sesi ini) sebagai persiapan sebelum kuliah.</p>
            <p>Profil pembuka: <strong>Boeing 787 Dreamliner</strong>. Strategi Boeing unik karena desain produk canggih
            dipadukan <em>global supply chain</em> — komponen datang dari puluhan mitra di berbagai negara (kolaborasi dengan
            General Electric, mitra Jepang, Italia, dll.) lalu dirakit final di Everett. Rantai pasok global inilah yang
            menjadi sumber competitive advantage Boeing: penjualan dan rantai pasoknya mendunia.</p>
            <p>Contoh lain perusahaan multinasional (<strong>MNC</strong> — perusahaan dengan keterlibatan bisnis internasional
            ekstensif): <strong>IBM</strong> mengimpor komponen dari 50+ negara, mengekspor ke 130+ negara, punya fasilitas di
            45 negara, dan lebih dari separuh penjualan & labanya dari luar negeri.</p>`
        },
        {
          heading: "Mission & Strategy",
          body: `<p><strong>Mission</strong> = tujuan/alasan keberadaan organisasi — apa kontribusinya bagi masyarakat.
            Mission memberi batasan & fokus, dan menjadi konsep pemersatu perusahaan. Setelah mission perusahaan ditetapkan,
            tiap area fungsional (marketing, keuangan, operasi) menyusun <em>supporting mission</em>-nya sendiri secara hierarkis.</p>
            <p><strong>Strategy</strong> = rencana aksi organisasi untuk mencapai mission. Strategi mengeksploitasi peluang &
            kekuatan, menetralkan ancaman, dan menghindari kelemahan.</p>
            <p>Perusahaan mencapai mission melalui tiga jalan konseptual: <strong>(1) Differentiation</strong> (lebih baik/berbeda),
            <strong>(2) Cost leadership</strong> (lebih murah), <strong>(3) Response</strong> (lebih responsif).
            <strong>Competitive advantage</strong> = penciptaan sistem yang punya keunggulan unik atas kompetitor — menciptakan
            nilai pelanggan secara efisien dan berkelanjutan, biasanya lewat kombinasi ketiganya.</p>`
        },
        {
          heading: "Issues in Operations Strategy",
          body: `<p>Sebelum menetapkan dan menjalankan strategi, beberapa sudut pandang membantu:</p>
            <ul>
              <li><strong>Resources view</strong> — memastikan strategi kompatibel dengan sumber daya finansial, fisik, manusia,
                dan teknologi yang tersedia.</li>
              <li><strong>Value-chain analysis (Porter)</strong> — mengidentifikasi aktivitas yang menjadi kekuatan unik penambah
                nilai: riset produk, desain, SDM, supply chain, inovasi proses, manajemen kualitas.</li>
              <li><strong>Five forces model (Porter)</strong> — menganalisis lima kekuatan kompetitif: rival langsung, pendatang
                potensial, pelanggan, pemasok, dan produk substitusi.</li>
            </ul>
            <p>Strategi juga harus <strong>dinamis</strong>: lingkungan eksternal (ekonomi, hukum, budaya) dan internal
            (sumber daya, teknologi, product life cycle) terus berubah. Posisi produk pada siklus hidup
            (introduction → growth → maturity → decline) mengubah prioritas strategi operasi — mis. fase introduction:
            desain produk & perubahan proses masih sering, biaya produksi tinggi; fase maturity: kontrol biaya jadi kritis,
            mempertahankan posisi pasar. Contoh: strategi Microsoft bergeser dari operating system → office products →
            layanan internet → integrator cloud seiring perubahan teknologi.</p>`
        },
        {
          heading: "Strategy Development & Implementation",
          body: `<p><strong>SWOT analysis</strong> = tinjauan formal atas kekuatan & kelemahan internal serta peluang & ancaman
            eksternal. Dari SWOT, organisasi memposisikan diri untuk meraih competitive advantage; mission dan strategi
            dievaluasi ulang agar konsisten.</p>
            <p><strong>Key Success Factors (KSFs)</strong> = aktivitas yang <em>harus</em> dilakukan dengan baik agar perusahaan
            mencapai tujuannya. <strong>Core competencies</strong> = hal-hal yang dilakukan perusahaan setara atau lebih baik
            dari kompetitornya. Karena tidak ada perusahaan yang unggul di semua hal, strategi sukses menuntut identifikasi
            keduanya.</p>
            <p><strong>Activity mapping</strong> menghubungkan competitive advantage dengan KSF dan aktivitas pendukung.
            Contoh klasik: <strong>Southwest Airlines</strong> — keunggulan biaya rendah dibangun dari aktivitas yang saling
            menguatkan: rute pendek point-to-point ke bandara sekunder, armada seragam Boeing 737, utilisasi pesawat tinggi,
            karyawan lean & berdaya, layanan penumpang terbatas tapi ramah, tanpa nomor kursi, "bags fly free".</p>`
        },
        {
          heading: "Outsourcing & Theory of Comparative Advantage",
          body: `<p><strong>Outsourcing</strong> = memindahkan aktivitas yang biasanya internal ke pemasok eksternal. Kandidat
            terbaiknya adalah <em>non-core activities</em>; core competencies sebaiknya dipertahankan. Landasan ekonominya:
            <strong>theory of comparative advantage</strong> — negara diuntungkan bila berspesialisasi (dan mengekspor)
            barang/jasa yang keunggulan relatifnya tinggi, dan mengimpor yang keunggulan relatifnya rendah.</p>
            <p><strong>Risiko outsourcing:</strong> sekitar <strong>separuh perjanjian outsourcing gagal</strong> karena
            perencanaan & analisis yang kurang; masalah umum: ketepatan pengiriman, standar kualitas, serta biaya persediaan
            & logistik yang diremehkan. Outsourcing ke luar negeri menambah isu: daya tarik finansial, ketersediaan keterampilan,
            lingkungan bisnis, hingga reaksi politik atas hilangnya lapangan kerja → memicu <strong>reshoring</strong>
            (kembalinya aktivitas bisnis ke negara asal).</p>
            <p>Untuk memilih penyedia outsourcing secara objektif dipakai <strong>factor-rating method</strong>: beri bobot
            tiap kriteria, skor tiap kandidat, kalikan lalu jumlahkan (contoh buku: National Architects memilih provider IT).</p>`
        },
        {
          heading: "Empat Opsi Strategi Operasi Global",
          body: `<p>Manajer operasi memposisikan perusahaan pada matriks dua sumbu: <strong>cost reduction</strong> (vertikal)
            × <strong>local responsiveness</strong> (horizontal):</p>
            <ul>
              <li><strong>International strategy</strong> — penetrasi pasar global lewat ekspor & lisensi. Paling mudah tapi
                paling tidak menguntungkan: responsivitas lokal rendah, keunggulan biaya kecil.</li>
              <li><strong>Multidomestic strategy</strong> — wewenang terdesentralisasi (anak perusahaan, waralaba, joint venture
                yang otonom). Memaksimalkan respons pasar lokal, tapi hampir tanpa keunggulan biaya. Contoh: Heinz menyesuaikan
                selera lokal. Konsepnya: "ekspor talenta manajemen & proses, bukan produknya".</li>
              <li><strong>Global strategy</strong> — sentralisasi tinggi; kantor pusat mengoordinasi standardisasi & pembelajaran
                antar-pabrik → skala ekonomi. Cocok saat fokusnya penekanan biaya dan produk seragam di seluruh dunia.
                Contoh: Caterpillar, Texas Instruments ("alat berat di Nigeria sama dengan di Iowa").</li>
              <li><strong>Transnational strategy</strong> — menggabungkan efisiensi skala global <em>dan</em> responsivitas lokal
                sekaligus.</li>
            </ul>
            <p>Ilustrasi persaingan global: Komatsu vs Caterpillar saling berekspansi lintas benua, memindahkan produksi
            mengikuti pasar, risiko, dan nilai tukar.</p>`
        }
      ]
    },
    {
      id: 3, date: "2026-08-29", dateLabel: "29 Agustus 2026",
      topic: "Product Design",
      subtopics: ["Product design"],
      readings: ["SBB bab 4", "HRM bab 5", "TPW bab 6"],
      caseStudy: "Case Study 1: Regal Marine", summary: null
    },
    {
      id: 4, date: "2026-08-29", dateLabel: "29 Agustus 2026",
      topic: "Process Design, Process Technology & People in Operations",
      subtopics: ["Process design", "Process technology", "People in operations"],
      readings: ["SBB bab 6", "HRM bab 7", "TPW bab 9, 11"],
      caseStudy: "Case Study 2: Harley Davidson", summary: null
    },
    {
      id: 5, date: "2026-09-11", dateLabel: "11 September 2026",
      topic: "Capacity Management",
      subtopics: ["Measuring the capacity"],
      readings: ["SBB bab 11", "HRM bab 13"],
      caseStudy: "Case Study 3: Frito-Lay", summary: null
    },
    {
      id: 6, date: "2026-09-12", dateLabel: "12 September 2026",
      topic: "Inventory Management",
      subtopics: ["Inventory management"],
      readings: ["SBB bab 13", "HRM bab 12"],
      caseStudy: "Case Study 4: Amazon", summary: null
    },
    {
      id: 7, date: "2026-10-30", dateLabel: "30 Oktober 2026",
      topic: "Planning & Control",
      subtopics: ["MRP dan ERP", "Sequencing and scheduling"],
      readings: ["SBB bab 10, 14", "HRM bab 14, 15"],
      caseStudy: "Case Study 5: Alaska Airlines", summary: null
    },
    {
      id: 8, date: "2026-10-31", dateLabel: "31 Oktober 2026",
      topic: "Supply Chain Management",
      subtopics: ["Supply Chain Management"],
      readings: ["SBB bab 12", "HRM bab 11", "TPW bab 10, 12"],
      caseStudy: "Case Study 6: Red Lobster Restaurant", summary: null
    },
    {
      id: 9, date: "2026-11-14", dateLabel: "14 November 2026",
      topic: "Improvement, Lean & Agile Operations",
      subtopics: ["Operations improvement", "Lean operations"],
      readings: ["SBB bab 15, 16", "HRM bab 16"],
      caseStudy: "Case Study 7: Toyota", summary: null
    },
    {
      id: 10, date: "2026-11-14", dateLabel: "14 November 2026",
      topic: "Quality Management",
      subtopics: ["Total quality management"],
      readings: ["SBB bab 17", "HRM bab 6"],
      caseStudy: "Case Study 8: Arnold Palmer Hospital", summary: null
    },
    {
      id: 11, date: "2026-11-27", dateLabel: "27 November 2026",
      topic: "Operations Reliability & Resilience",
      subtopics: ["Managing risk and recovery", "Project management"],
      readings: ["SBB bab 18, 19", "HRM bab 3, 17", "TPW bab 13"],
      caseStudy: "Case Study 9: Bechtel Group", summary: null
    },
    {
      id: 12, date: "2026-11-28", dateLabel: "28 November 2026",
      topic: "Team Final Project Presentation",
      subtopics: ["Presentasi proyek akhir tim"],
      readings: [],
      caseStudy: null, summary: null
    }
  ],

  /* ---------- Flashcards (field session = nomor sesi) ---------- */
  flashcards: [
    { session: 1, front: "Apa definisi operations management menurut Slack, Brandon-Jones & Burgess (2022)?", back: "Aktivitas mengelola sumber daya yang menciptakan dan menyampaikan (create and deliver) produk dan jasa." },
    { session: 1, front: "Apa definisi operations management menurut Heizer, Render & Munson?", back: "Serangkaian aktivitas yang menciptakan nilai dalam bentuk barang dan jasa dengan mentransformasi input menjadi output." },
    { session: 1, front: "Sebutkan 4 alasan mengapa kita perlu mempelajari OM.", back: "1) OM bagian yang sangat mahal dari organisasi, 2) OM salah satu fungsi utama organisasi, 3) kita perlu tahu bagaimana barang/jasa diproduksi, 4) kita perlu memahami apa yang dikerjakan operations manager." },
    { session: 1, front: "Apa model dasar semua proses operasi?", back: "Input → Transformation → Output: mengubah input menjadi output berupa produk dan jasa." },
    { session: 1, front: "Tiga jenis transformed resources yang dominan diproses operasi?", back: "Material (manufaktur, ritel, logistik), Informasi (akuntan, bank, riset pasar), dan Pelanggan (rumah sakit, hotel, transportasi, salon)." },
    { session: 1, front: "Bedakan 'operations' sebagai fungsi vs sebagai aktivitas.", back: "Fungsi: bagian organisasi yang menciptakan produk/jasa bagi pelanggan eksternal. Aktivitas: pengelolaan proses dalam fungsi organisasi mana pun — sehingga OM relevan untuk semua bagian bisnis." },
    { session: 1, front: "Sebutkan the Four Vs of operations.", back: "Volume (banyaknya output), Variety (keragaman output), Variation (fluktuasi permintaan), Visibility (keterlihatan proses bagi pelanggan)." },
    { session: 1, front: "Bagaimana konfigurasi 4 Vs yang menurunkan biaya operasi?", back: "Volume tinggi, variety rendah, variation rendah, dan visibility rendah (ceteris paribus)." },
    { session: 1, front: "Empat aktivitas utama operations manager?", back: "Directing (strategi keseluruhan operasi), Designing (produk/jasa & proses), Planning & Controlling (penyampaian proses), Developing (kinerja proses)." },
    { session: 1, front: "Sebutkan 10 keputusan kritis (critical decisions) OM.", back: "1) Desain barang & jasa, 2) Manajemen kualitas, 3) Desain proses & kapasitas, 4) Strategi lokasi, 5) Strategi layout, 6) SDM & desain pekerjaan, 7) Supply chain management, 8) Persediaan/MRP/JIT, 9) Penjadwalan, 10) Pemeliharaan (maintenance)." },
    { session: 1, front: "Apa itu digital transformation?", back: "Proses menggunakan teknologi digital untuk menciptakan atau memodifikasi proses bisnis, budaya, dan pengalaman pelanggan agar sesuai perubahan kebutuhan bisnis & pasar." },
    { session: 1, front: "Lima syarat digital business model yang baik?", back: "1) Memberi customer experience luar biasa, 2) menghasilkan profit, 3) menaikkan market share, 4) mengubah proses, 5) melibatkan karyawan secara kreatif." },
    { session: 1, front: "Sebutkan 5 performance objectives operasi.", back: "Quality, Speed, Dependability, Flexibility, Cost." },
    { session: 1, front: "Apa arti 'speed' sebagai performance objective?", back: "Waktu yang berlalu antara pelanggan meminta produk/jasa dan menerimanya. Speed mengurangi persediaan dan risiko." },
    { session: 1, front: "Apa arti 'dependability' dan mengapa penting?", back: "Menyampaikan tepat waktu sesuai kebutuhan/janji kepada pelanggan. Menghemat waktu & uang, memberi stabilitas; dalam jangka panjang bisa mengalahkan semua kriteria lain." },
    { session: 1, front: "Empat tipe flexibility yang dibutuhkan pelanggan?", back: "Product/service flexibility, Mix flexibility, Volume flexibility, Delivery flexibility." },
    { session: 1, front: "Dua cara kualitas meningkatkan profitabilitas?", back: "1) Sales gain: respons lebih baik, harga fleksibel, reputasi naik. 2) Reduced costs: produktivitas naik, biaya rework/scrap/garansi turun." },
    { session: 1, front: "Rumus produktivitas dan rumus labor productivity?", back: "Produktivitas = Output ÷ Input. Labor productivity = unit yang diproduksi ÷ jam kerja (labor-hours). Ini contoh single-factor productivity." },
    { session: 1, front: "Apa itu multifactor productivity dan mengapa lebih baik?", back: "Output ÷ (Labor + Material + Energy + Capital + Miscellaneous), biasanya dalam dolar. Lebih baik karena mencakup semua biaya yang terkait kenaikan output." },
    { session: 1, front: "Apa itu operations strategy?", back: "Pola keputusan dan aksi yang membentuk visi jangka panjang, tujuan, dan kapabilitas operasi serta kontribusinya pada strategi bisnis keseluruhan." },
    { session: 1, front: "Sebutkan 4 perspektif operations strategy.", back: "Top-down (hierarki corporate→business→functional), Outside-in/market (kebutuhan pasar), Bottom-up (pengalaman operasional), Inside-out/resources (kapabilitas sumber daya & proses)." },
    { session: 1, front: "Bedakan order winners dan order qualifiers.", back: "Order winners: faktor yang langsung & signifikan memenangkan bisnis. Order qualifiers: syarat minimum — di bawah level itu organisasi bahkan tidak dipertimbangkan pelanggan." },
    { session: 1, front: "Empat zona pada importance–performance matrix?", back: "Appropriate (memuaskan), Improve (di bawah batas layak), Urgent-action (penting bagi pelanggan tapi kalah dari kompetitor), Excess? (kinerja tinggi tapi tidak penting bagi pelanggan)." },
    { session: 1, front: "Tiga strategi mencapai competitive advantage melalui operasi?", back: "Differentiation (lebih baik/berbeda), Cost leadership (lebih murah — bukan kualitas rendah), Response (respons cepat: flexibility, reliability, timeliness)." },
    { session: 1, front: "Enam alasan perusahaan melakukan globalisasi operasi?", back: "1) Memperbaiki supply chain, 2) menekan biaya & risiko kurs, 3) memperbaiki operasi, 4) memahami pasar, 5) memperbaiki produk, 6) menarik & mempertahankan talenta global." },
    { session: 1, front: "Apa itu operational hedging?", back: "Mempertahankan kapasitas berlebih di beberapa negara dan menggeser level produksi antarnegara saat biaya dan nilai tukar berubah." },
    { session: 1, front: "Tiga variabel produktivitas menurut HRM dan kontribusinya terhadap kenaikan tahunan?", back: "Labor ±10%, Capital ±38%, Management ±52%. Management adalah kontributor terbesar — area utama tempat manajer bisa bertindak memperbaiki produktivitas." },
    { session: 1, front: "Sebutkan minimal 4 karakteristik jasa (services) yang membedakannya dari barang (goods).", back: "Intangible; diproduksi & dikonsumsi bersamaan; unik per pelanggan; interaksi pelanggan tinggi; definisi produk tidak konsisten; berbasis pengetahuan (sulit diotomasi); lokasi tersebar; kualitas sulit dievaluasi; tidak bisa dijual kembali; tidak bisa disimpan sebagai persediaan." },
    { session: 1, front: "Mengapa barang (goods) lebih mudah diotomasi daripada jasa?", back: "Karena barang berupa produk tangible yang terstandardisasi (mis. iPhone) dan diproduksi di fasilitas tetap, sedangkan jasa sering berbasis pengetahuan, unik per pelanggan, dan butuh interaksi tinggi (hukum, pendidikan, medis)." },

    { session: 2, front: "Apa definisi mission sebuah organisasi?", back: "Tujuan atau alasan keberadaan organisasi — apa yang akan dikontribusikannya bagi masyarakat. Mission memberi batasan, fokus, dan konsep pemersatu perusahaan." },
    { session: 2, front: "Apa definisi strategy?", back: "Rencana aksi (action plan) organisasi untuk mencapai mission-nya. Strategi mengeksploitasi peluang & kekuatan, menetralkan ancaman, dan menghindari kelemahan." },
    { session: 2, front: "Bagaimana hierarki mission dalam perusahaan?", back: "Mission perusahaan → supporting mission tiap area fungsional (marketing, keuangan, operasi) → mission pendukung level bawah untuk fungsi-fungsi OM. Semuanya saling mendukung." },
    { session: 2, front: "Tiga cara konseptual perusahaan mencapai mission-nya?", back: "1) Differentiation (lebih baik/berbeda), 2) Cost leadership (lebih murah), 3) Response (lebih responsif). Ketiganya bisa dikombinasikan untuk menghasilkan competitive advantage." },
    { session: 2, front: "Apa itu resources view dalam operations strategy?", back: "Cara pandang yang memastikan strategi kompatibel dengan sumber daya yang tersedia: finansial, fisik, manusia, dan teknologi." },
    { session: 2, front: "Apa itu value-chain analysis (Porter)?", back: "Cara mengidentifikasi aktivitas dalam rantai produk/jasa yang menambah nilai secara unik — mis. riset produk, desain, SDM, supply chain, inovasi proses, manajemen kualitas — sebagai peluang membangun competitive advantage." },
    { session: 2, front: "Sebutkan lima kekuatan dalam five forces model Porter.", back: "1) Rival langsung (immediate rivals), 2) pendatang potensial, 3) pelanggan, 4) pemasok, 5) produk substitusi." },
    { session: 2, front: "Bagaimana product life cycle memengaruhi strategi operasi?", back: "Introduction: desain produk/proses sering berubah, biaya produksi tinggi. Growth: peramalan & reliabilitas kritis, tambah kapasitas. Maturity: kontrol biaya kritis, pertahankan posisi pasar. Decline: efisiensi. Strategi harus dinamis mengikuti fase produk." },
    { session: 2, front: "Apa itu SWOT analysis?", back: "Tinjauan formal atas Strengths & Weaknesses internal serta Opportunities & Threats eksternal, sebagai dasar memposisikan perusahaan untuk meraih competitive advantage." },
    { session: 2, front: "Bedakan Key Success Factors (KSFs) dan core competencies.", back: "KSFs: aktivitas/faktor yang menjadi kunci meraih competitive advantage — harus dilakukan dengan baik. Core competencies: hal yang dilakukan perusahaan setara atau lebih baik dari kompetitor (kekuatan uniknya)." },
    { session: 2, front: "Apa itu activity mapping? Beri contohnya.", back: "Menghubungkan competitive advantage dengan KSF & aktivitas pendukung yang saling menguatkan. Contoh Southwest Airlines (low-cost): rute pendek point-to-point ke bandara sekunder, armada seragam B737, utilisasi tinggi, karyawan lean & berdaya, layanan terbatas, tanpa nomor kursi." },
    { session: 2, front: "Apa itu outsourcing dan aktivitas apa yang cocok di-outsource?", back: "Memindahkan aktivitas yang tradisinya internal ke pemasok eksternal. Kandidat terbaik: non-core activities — sementara core competencies dipertahankan di dalam." },
    { session: 2, front: "Apa isi theory of comparative advantage?", back: "Negara diuntungkan bila berspesialisasi dan mengekspor barang/jasa yang keunggulan relatifnya tinggi, serta mengimpor barang/jasa yang keunggulan relatifnya rendah. Ini landasan ekonomi outsourcing internasional." },
    { session: 2, front: "Sebutkan risiko-risiko outsourcing.", back: "±Separuh perjanjian outsourcing gagal karena perencanaan/analisis kurang; masalah ketepatan pengiriman & kualitas; biaya persediaan-logistik diremehkan; penurunan kepuasan pelanggan; untuk luar negeri: isu finansial, keterampilan, lingkungan bisnis, dan reaksi politik." },
    { session: 2, front: "Apa itu reshoring?", back: "Kembalinya aktivitas bisnis ke negara asal — antara lain dipicu reaksi politik terhadap hilangnya lapangan kerja akibat outsourcing ke luar negeri." },
    { session: 2, front: "Apa itu factor-rating method dalam memilih penyedia outsourcing?", back: "Metode penilaian objektif: tentukan kriteria, beri bobot tiap kriteria, skor tiap kandidat provider, kalikan bobot × skor lalu jumlahkan — kandidat dengan total tertinggi dipilih (contoh buku: National Architects memilih provider IT)." },
    { session: 2, front: "Bedakan international business dan multinational corporation (MNC).", back: "International business: perusahaan yang terlibat perdagangan/investasi lintas negara. MNC: keterlibatan internasionalnya ekstensif — membeli sumber daya, berproduksi, dan menjual di banyak negara (mis. IBM: fasilitas di 45 negara, ekspor ke 130+ negara)." },
    { session: 2, front: "Dua sumbu matriks empat strategi operasi global?", back: "Sumbu vertikal: cost reduction. Sumbu horizontal: local responsiveness (respons cepat dan/atau diferensiasi untuk pasar lokal)." },
    { session: 2, front: "Jelaskan international strategy.", back: "Penetrasi pasar global lewat ekspor & lisensi. Paling mudah (sedikit perubahan operasi, risiko lisensi di pihak licensee) tapi paling tidak menguntungkan: responsivitas lokal rendah dan keunggulan biaya kecil." },
    { session: 2, front: "Jelaskan multidomestic strategy dan contohnya.", back: "Wewenang terdesentralisasi ke tiap negara (anak perusahaan, waralaba, joint venture otonom) demi memaksimalkan respons pasar lokal; hampir tanpa keunggulan biaya. Contoh: Heinz menyesuaikan selera lokal. 'Ekspor talenta manajemen & proses, bukan produknya.'" },
    { session: 2, front: "Jelaskan global strategy dan contohnya.", back: "Sentralisasi tinggi: kantor pusat mengoordinasi standardisasi & pembelajaran antar-pabrik demi skala ekonomi. Cocok saat fokus pada penekanan biaya dan produk seragam sedunia. Contoh: Caterpillar & Texas Instruments." },
    { session: 2, front: "Jelaskan transnational strategy.", back: "Strategi yang menggabungkan keunggulan efisiensi skala global dengan keunggulan responsivitas lokal sekaligus — cost reduction tinggi dan local responsiveness tinggi." }
  ],

  /* ---------- Kuis (field session = nomor sesi) ---------- */
  quizzes: [
    {
      session: 1,
      questions: [
        {
          q: "Menurut Heizer, Render & Munson, operations management adalah…",
          options: [
            "Serangkaian aktivitas yang menciptakan nilai dengan mentransformasi input menjadi output",
            "Aktivitas memasarkan produk agar bernilai di mata pelanggan",
            "Proses menyusun laporan keuangan operasional perusahaan",
            "Kegiatan merekrut dan melatih karyawan operasional"
          ],
          answer: 0,
          explain: "Definisi Heizer: the set of activities that create value in the form of goods and services by transforming inputs into outputs."
        },
        {
          q: "Manakah yang BUKAN termasuk the Four Vs of operations?",
          options: ["Volume", "Velocity", "Variation", "Visibility"],
          answer: 1,
          explain: "The Four Vs = Volume, Variety, Variation (in demand), dan Visibility. 'Velocity' bukan salah satunya."
        },
        {
          q: "Agar biaya operasi turun (ceteris paribus), kombinasi 4 Vs yang tepat adalah…",
          options: [
            "Volume rendah, variety tinggi, variation tinggi, visibility tinggi",
            "Volume tinggi, variety tinggi, variation rendah, visibility tinggi",
            "Volume tinggi, variety rendah, variation rendah, visibility rendah",
            "Semua dimensi ditingkatkan setinggi mungkin"
          ],
          answer: 2,
          explain: "Biaya turun dengan menaikkan volume serta menurunkan variety, variation, dan visibility — seperti hotelF1 vs Ski Verbier Exclusive."
        },
        {
          q: "Rumah sakit dan salon adalah contoh operasi yang dominan memproses input berupa…",
          options: ["Material", "Informasi", "Pelanggan", "Modal"],
          answer: 2,
          explain: "Hairdresser, hotel, rumah sakit, transportasi = predominantly processing inputs of customers."
        },
        {
          q: "Performance objective yang berarti 'menepati janji waktu penyampaian kepada pelanggan' adalah…",
          options: ["Quality", "Speed", "Flexibility", "Dependability"],
          answer: 3,
          explain: "Dependability = doing things in time — menyampaikan tepat saat dibutuhkan atau sesuai yang dijanjikan. Jangka panjang bisa mengalahkan kriteria lain."
        },
        {
          q: "Collins Title memproses 8 titel/hari dengan 4 staf yang masing-masing bekerja 8 jam. Labor productivity-nya adalah…",
          options: ["0,25 titel per jam kerja", "0,50 titel per jam kerja", "2 titel per jam kerja", "0,4375 titel per jam kerja"],
          answer: 0,
          explain: "Total jam kerja = 4 × 8 = 32 jam. Labor productivity = 8 ÷ 32 = 0,25 titel/jam. Setelah komputerisasi (14 titel/hari) menjadi 14 ÷ 32 = 0,4375 (naik 75%)."
        },
        {
          q: "Keunggulan multifactor productivity dibanding single-factor productivity adalah…",
          options: [
            "Lebih mudah dihitung karena hanya satu input",
            "Mencakup semua biaya input sehingga gambarannya lebih lengkap",
            "Tidak memerlukan data output",
            "Selalu menghasilkan angka yang lebih besar"
          ],
          answer: 1,
          explain: "Multifactor productivity = Output ÷ (Labor + Material + Energy + Capital + Misc.) — memberi gambaran lebih baik karena memasukkan seluruh biaya."
        },
        {
          q: "Faktor kompetitif yang menjadi syarat minimum agar perusahaan dipertimbangkan pelanggan disebut…",
          options: ["Order winner", "Order qualifier", "Less important factor", "Efficient frontier"],
          answer: 1,
          explain: "Order qualifiers bukan penentu utama kemenangan, tapi di bawah level 'qualifying' organisasi terdiskualifikasi dari pertimbangan pelanggan."
        },
        {
          q: "Perspektif operations strategy yang menekankan kapabilitas sumber daya dan proses operasi sebagai sumber keunggulan jangka panjang adalah…",
          options: ["Top-down", "Outside-in (market)", "Bottom-up", "Inside-out (operations resources)"],
          answer: 3,
          explain: "Perspektif inside-out: keunggulan kompetitif jangka panjang datang dari kapabilitas resources & processes yang dikembangkan jangka panjang."
        },
        {
          q: "Pada importance–performance matrix, faktor yang penting bagi pelanggan tetapi kinerjanya di bawah kompetitor masuk zona…",
          options: ["Appropriate", "Improve", "Urgent-action", "Excess?"],
          answer: 2,
          explain: "Zona urgent-action = penting bagi pelanggan tapi performa di bawah kompetitor → kandidat perbaikan segera."
        },
        {
          q: "Southwest Airlines (bandara sekunder, layanan tanpa embel-embel, utilisasi pesawat efisien) adalah contoh perusahaan yang bersaing lewat…",
          options: ["Differentiation", "Cost leadership", "Response", "Experience differentiation"],
          answer: 1,
          explain: "Competing on cost: memberi nilai maksimum di mata pelanggan dengan biaya rendah — bukan berarti kualitas rendah."
        },
        {
          q: "Menjaga kapasitas berlebih di beberapa negara lalu menggeser produksi antarnegara mengikuti perubahan biaya dan kurs disebut…",
          options: ["Mass customization", "Operational hedging", "Supply-chain partnering", "Offshoring"],
          answer: 1,
          explain: "Operational hedging adalah salah satu cara menekan biaya dan risiko nilai tukar dalam operasi global."
        },
        {
          q: "(Latihan HRM bab 1) Collins Title memproses 14 titel/hari dengan payroll $640/hari. Jika overhead-nya $960/hari (bukan $800), multifactor productivity-nya adalah…",
          options: ["0,0097 titel per dolar", "0,00875 titel per dolar", "0,0077 titel per dolar", "0,4375 titel per dolar"],
          answer: 1,
          explain: "Multifactor productivity = 14 ÷ (640 + 960) = 14 ÷ 1600 = 0,00875 titel per dolar. Ini learning exercise resmi dari buku HRM bab 1."
        }
      ]
    },
    {
      session: 2,
      questions: [
        {
          q: "Mission sebuah organisasi didefinisikan sebagai…",
          options: [
            "Rencana aksi untuk mengalahkan kompetitor",
            "Tujuan atau alasan keberadaan organisasi — kontribusinya bagi masyarakat",
            "Target laba tahunan yang ditetapkan pemegang saham",
            "Daftar produk yang akan diluncurkan perusahaan"
          ],
          answer: 1,
          explain: "Mission = the purpose or rationale for an organization's existence. Strategy-lah yang merupakan rencana aksi untuk mencapai mission."
        },
        {
          q: "Strategy adalah…",
          options: [
            "Pernyataan nilai-nilai luhur perusahaan",
            "Struktur organisasi perusahaan",
            "Rencana aksi organisasi untuk mencapai mission-nya",
            "Anggaran tahunan tiap area fungsional"
          ],
          answer: 2,
          explain: "Strategy = action plan to achieve the mission; mengeksploitasi peluang & kekuatan, menetralkan ancaman, menghindari kelemahan."
        },
        {
          q: "Manakah yang BUKAN salah satu dari tiga pendekatan strategis untuk mencapai competitive advantage?",
          options: ["Differentiation", "Cost leadership", "Response", "Diversification"],
          answer: 3,
          explain: "Tiga pendekatannya: differentiation (lebih baik/berbeda), cost leadership (lebih murah), dan response (lebih responsif). Diversification bukan salah satunya."
        },
        {
          q: "Lima kekuatan dalam five forces model Porter adalah rival langsung, pendatang potensial, pelanggan, pemasok, dan…",
          options: ["Regulator pemerintah", "Produk substitusi", "Serikat pekerja", "Pemegang saham"],
          answer: 1,
          explain: "Five forces: immediate rivals, potential entrants, customers, suppliers, dan substitute products."
        },
        {
          q: "Pada fase maturity dalam product life cycle, prioritas strategi operasi yang tepat adalah…",
          options: [
            "Perubahan desain produk dan proses yang sering",
            "Kontrol biaya yang kritis dan mempertahankan posisi pasar",
            "Produksi jangka pendek dengan biaya tinggi",
            "Menghentikan seluruh investasi kapasitas"
          ],
          answer: 1,
          explain: "Fase introduction identik dengan desain yang masih berubah-ubah dan biaya tinggi; fase maturity menuntut cost control dan pertahanan posisi pasar."
        },
        {
          q: "SWOT analysis adalah tinjauan formal atas…",
          options: [
            "Skill, Wisdom, Opportunity, Timing",
            "Kekuatan & kelemahan internal serta peluang & ancaman eksternal",
            "Kinerja keuangan empat kuartal terakhir",
            "Struktur organisasi dan pembagian wewenang"
          ],
          answer: 1,
          explain: "SWOT = internal Strengths & Weaknesses + external Opportunities & Threats — model yang sangat baik untuk mengevaluasi strategi."
        },
        {
          q: "Aktivitas yang dilakukan perusahaan setara atau lebih baik daripada kompetitornya disebut…",
          options: ["Key success factors", "Core competencies", "Order qualifiers", "Non-core activities"],
          answer: 1,
          explain: "Core competencies = kekuatan unik perusahaan. KSF = aktivitas yang menjadi kunci meraih tujuan. Non-core activities justru kandidat outsourcing."
        },
        {
          q: "Keunggulan low-cost Southwest Airlines dibangun lewat activity mapping yang mencakup hal-hal berikut, KECUALI…",
          options: [
            "Rute pendek point-to-point ke bandara sekunder",
            "Armada seragam Boeing 737",
            "Layanan premium lengkap di semua penerbangan",
            "Utilisasi pesawat yang tinggi"
          ],
          answer: 2,
          explain: "Southwest justru menawarkan layanan penumpang yang terbatas (tapi ramah) — tanpa nomor kursi, tanpa transfer bagasi — demi biaya rendah."
        },
        {
          q: "Teori yang menyatakan negara diuntungkan bila berspesialisasi mengekspor barang/jasa dengan keunggulan relatif tinggi adalah…",
          options: [
            "Theory of comparative advantage",
            "Five forces model",
            "Resources view",
            "Efficient frontier theory"
          ],
          answer: 0,
          explain: "Theory of comparative advantage — landasan ekonomi outsourcing internasional."
        },
        {
          q: "Menurut HRM, kira-kira berapa proporsi perjanjian outsourcing yang gagal karena perencanaan dan analisis yang kurang?",
          options: ["Sekitar 10%", "Sekitar 25%", "Sekitar separuh", "Hampir semuanya"],
          answer: 2,
          explain: "Roughly half of all outsourcing agreements fail — umumnya karena inadequate planning and analysis, masalah ketepatan waktu, kualitas, serta biaya logistik yang diremehkan."
        },
        {
          q: "Strategi operasi global dengan wewenang terdesentralisasi (subsidiary/franchise/joint venture otonom) demi memaksimalkan respons pasar lokal disebut…",
          options: ["International strategy", "Multidomestic strategy", "Global strategy", "Transnational strategy"],
          answer: 1,
          explain: "Multidomestic (contoh: Heinz) — respons lokal maksimal, tapi hampir tanpa keunggulan biaya. 'Ekspor talenta manajemen & proses, bukan produknya.'"
        },
        {
          q: "Caterpillar dan Texas Instruments — dengan sentralisasi tinggi, standardisasi, dan skala ekonomi — adalah contoh…",
          options: ["International strategy", "Multidomestic strategy", "Global strategy", "Transnational strategy"],
          answer: 2,
          explain: "Global strategy: cocok saat fokusnya cost reduction dan produk seragam di seluruh dunia ('alat berat di Nigeria sama dengan di Iowa'). Transnational menggabungkan keduanya: efisiensi global + responsivitas lokal."
        }
      ]
    }
  ]
};
