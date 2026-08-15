/* ============================================================
   BEfS Study Hub — Bank Soal
   ch = nomor bab · a = indeks jawaban benar (0-based)
   Mode ujian: Mid-term = CM1–CM6 · Final = CM7–CM12
   ============================================================ */

window.BEFS_QUIZZES = [
  /* ================= CM1 ================= */
  { ch: 1, q: "Menurut Crane & Matten, business ethics paling tepat didefinisikan sebagai studi tentang…", opts: [
    "cara perusahaan memaksimalkan laba tanpa melanggar hukum",
    "situasi, aktivitas, dan keputusan bisnis di mana isu benar dan salah dipertanyakan",
    "aturan hukum yang mengatur perilaku korporasi",
    "program tanggung jawab sosial yang dijalankan perusahaan"
  ], a: 1, why: "Definisi kuncinya adalah <strong>right and wrong</strong>. Pilihan lain mengacaukan etika dengan kepatuhan hukum (c), dengan CSR (d), atau dengan tujuan bisnis (a)." },

  { ch: 1, q: "Pernyataan mana yang paling tepat menggambarkan hubungan etika dan hukum?", opts: [
    "Semua tindakan yang legal secara otomatis etis",
    "Hukum dan etika adalah dua hal yang sepenuhnya terpisah",
    "Business ethics terutama bekerja pada wilayah yang tidak dicakup hukum atau yang belum ada konsensusnya",
    "Etika hanya relevan ketika hukum tidak ditegakkan"
  ], a: 2, why: "Crane & Matten: <em>business ethics dimulai di titik hukum berakhir</em>. Hukum adalah kodifikasi moralitas yang sudah disepakati, sehingga selalu tertinggal dari isu etis baru." },

  { ch: 1, q: "Praktik <em>tax avoidance</em> agresif yang sah secara hukum paling tepat ditempatkan pada kuadran…", opts: [
    "legal dan etis", "legal tetapi tidak etis", "ilegal tetapi etis", "ilegal dan tidak etis"
  ], a: 1, why: "Ini contoh klasik kuadran <strong>legal tetapi tidak etis</strong> — medan utama etika bisnis. Bandingkan dengan whistleblowing yang melanggar klausul kerahasiaan: ilegal tetapi dapat dibenarkan secara etis." },

  { ch: 1, q: "Manakah yang BUKAN termasuk tiga celah yang ditimbulkan globalisasi bagi etika bisnis?", opts: [
    "Cultural issues", "Legal issues", "Accountability issues", "Technological issues"
  ], a: 3, why: "Tiga celahnya adalah <strong>cultural, legal, dan accountability</strong>. Teknologi memang isu penting, tetapi dibahas tersendiri di CM12, bukan sebagai salah satu dari tiga celah globalisasi." },

  { ch: 1, q: "Sebuah perusahaan berargumen bahwa mempekerjakan anak di negara tertentu dapat diterima karena \"itu norma setempat\". Posisi ini mencerminkan…", opts: [
    "ethical absolutism", "ethical relativism", "ethical pluralism", "utilitarianism"
  ], a: 1, why: "\"When in Rome, do as the Romans do\" adalah <strong>ethical relativism</strong>. Risikonya persis seperti ini: membenarkan pekerja anak dan suap dengan dalih budaya. Crane & Matten mengusulkan pluralism sebagai jalan tengah." },

  { ch: 1, q: "Definisi sustainable development dari Brundtland Report menekankan dua kata kunci, yaitu…", opts: [
    "profit dan growth", "needs dan limitations", "efficiency dan innovation", "compliance dan reporting"
  ], a: 1, why: "Definisinya menekankan <em>needs</em> (terutama kebutuhan kaum miskin) dan <em>limitations</em> (batas kemampuan lingkungan menopang kebutuhan)." },

  { ch: 1, q: "Dimensi sosial dalam triple bottom line paling tepat dikaitkan dengan prinsip…", opts: [
    "efisiensi pengelolaan sumber daya fisik", "social justice", "maksimalisasi nilai pemegang saham", "kepatuhan pada regulasi lingkungan"
  ], a: 1, why: "Dimensi sosial berpusat pada <strong>social justice</strong> — keadilan distribusi manfaat dan beban, baik intra-generasi maupun antargenerasi. Pilihan (a) adalah dimensi lingkungan." },

  { ch: 1, q: "Peringatan Crane & Matten tentang argumen \"ethics pays\" adalah…", opts: [
    "argumen itu terbukti salah secara empiris",
    "bila laba menjadi satu-satunya alasan berperilaku etis, perilaku itu akan ditinggalkan ketika tidak menguntungkan",
    "perusahaan etis selalu berkinerja finansial lebih rendah",
    "kinerja sosial tidak dapat diukur sama sekali"
  ], a: 1, why: "Ada korelasi positif lemah hingga sedang, tetapi arah sebabnya tidak jelas. Poin etisnya: motif menentukan — bila hanya profit, itu strategi, bukan etika." },

  /* ================= CM2 ================= */
  { ch: 2, q: "Konsep <em>Corporate Internal Decision Structure</em> digunakan untuk mendukung argumen bahwa…", opts: [
    "hanya individu yang dapat bertanggung jawab secara moral",
    "korporasi dapat dipandang sebagai pelaku moral karena punya struktur keputusan sendiri",
    "korporasi tidak dapat dituntut secara hukum",
    "budaya organisasi tidak memengaruhi keputusan etis"
  ], a: 1, why: "CID (French) adalah bagan organisasi + aturan pengakuan keputusan, yang membuat sebuah keputusan dapat disebut keputusan <em>perusahaan</em>. Ini tidak menghapus tanggung jawab individu — keduanya berlaku bersamaan." },

  { ch: 2, q: "Dalam piramida Carroll, tanggung jawab <em>ethical</em> berstatus…", opts: [
    "required oleh masyarakat", "expected oleh masyarakat", "desired oleh masyarakat", "optional sepenuhnya"
  ], a: 1, why: "Urutannya: economic dan legal = <strong>required</strong>; ethical = <strong>expected</strong>; philanthropic = <strong>desired</strong>. Kolom status ini sering menjadi kunci penilaian." },

  { ch: 2, q: "Manakah yang BUKAN argumen Friedman menentang CSR?", opts: [
    "Manajer adalah agen pemegang saham dan tidak punya mandat membelanjakan uang mereka untuk tujuan sosial",
    "Manajer tidak dilatih menyelesaikan masalah sosial",
    "Menentukan prioritas sosial adalah kewenangan pemerintah terpilih",
    "Program sosial selalu menurunkan kualitas produk perusahaan"
  ], a: 3, why: "Tiga argumen Friedman adalah <strong>agensi, kompetensi, dan legitimasi</strong>. Pilihan (d) bukan argumennya dan tidak punya dasar." },

  { ch: 2, q: "Definisi stakeholder Freeman mencakup pihak yang…", opts: [
    "memiliki saham di perusahaan",
    "dapat memengaruhi ATAU dipengaruhi oleh pencapaian tujuan organisasi",
    "memiliki kontrak hukum dengan perusahaan",
    "berada dalam struktur organisasi perusahaan"
  ], a: 1, why: "Definisinya sengaja <strong>dua arah</strong> dan luas — inilah yang memasukkan komunitas, lingkungan, dan generasi mendatang ke dalam analisis." },

  { ch: 2, q: "Sebuah LSM lingkungan mengajukan tuntutan yang dipandang sah, mendesak, dan didukung liputan media luas serta tekanan investor. Dalam model salience, LSM ini adalah…", opts: [
    "latent stakeholder", "expectant stakeholder", "definitive stakeholder", "non-stakeholder"
  ], a: 2, why: "Ia memiliki ketiganya: <strong>legitimacy</strong> (klaim sah), <strong>urgency</strong> (mendesak), dan <strong>power</strong> (lewat media dan investor) — sehingga menjadi <strong>definitive stakeholder</strong>, prioritas utama manajemen." },

  { ch: 2, q: "Pendekatan stakeholder theory yang berargumen \"mengelola stakeholder dengan baik meningkatkan kinerja perusahaan\" disebut…", opts: [
    "normative", "descriptive", "instrumental", "regulatory"
  ], a: 2, why: "Itu pendekatan <strong>instrumental</strong> — argumen business case. Normative bertanya mengapa ini benar secara moral; descriptive menggambarkan apa yang sebenarnya terjadi." },

  { ch: 2, q: "Perbedaan pokok antara <em>responsibility</em> dan <em>accountability</em> adalah…", opts: [
    "responsibility bersifat hukum, accountability bersifat moral",
    "responsibility berorientasi ke depan, accountability berorientasi ke belakang dengan konsekuensi",
    "keduanya identik dalam literatur etika bisnis",
    "accountability hanya berlaku bagi perusahaan publik"
  ], a: 1, why: "<strong>Responsibility</strong>: apa yang seharusnya kita lakukan. <strong>Accountability</strong>: kepada siapa kita menjelaskan apa yang sudah dilakukan, dan sanksi apa bila gagal." },

  { ch: 2, q: "Dalam <em>extended view of corporate citizenship</em>, korporasi paling tepat dipandang sebagai…", opts: [
    "warga negara yang memiliki hak seperti individu",
    "aktor yang mengelola hak kewarganegaraan individu ketika negara mundur atau gagal",
    "penyumbang dana bagi program komunitas lokal",
    "istilah lain untuk CSR tanpa perbedaan makna"
  ], a: 1, why: "Inilah pandangan khas Crane & Matten. Pilihan (c) adalah <em>limited view</em>, (d) adalah <em>equivalent view</em>." },

  { ch: 2, q: "Respons awal Nike terhadap tuduhan kondisi kerja pemasok — \"pabrik itu bukan milik kami\" — mencerminkan tahap…", opts: [
    "defensive", "compliance", "managerial", "civil"
  ], a: 0, why: "Tahap <strong>defensive</strong> dalam model Zadek: menyangkal praktik, dampak, atau tanggung jawab. Nike kemudian bergerak melalui compliance, managerial, hingga strategic dan civil." },

  /* ================= CM3 ================= */
  { ch: 3, q: "Teori etika yang menilai benar-salah berdasarkan prinsip dan motif, bukan akibat, disebut…", opts: [
    "consequentialist", "teleological", "non-consequentialist", "instrumental"
  ], a: 2, why: "<strong>Non-consequentialist</strong> (deontological) menilai dari prinsip; anggotanya ethics of duty dan ethics of rights & justice. Consequentialist dan teleological adalah istilah yang sama untuk kelompok satunya." },

  { ch: 3, q: "Kelemahan utilitarianism yang paling relevan pada kasus Ford Pinto adalah…", opts: [
    "sulit memprediksi konsekuensi jangka panjang",
    "problem of distribution — total utilitas maksimal sambil mengorbankan hak sebagian orang",
    "terlalu kaku dan tidak memberi ruang pengecualian",
    "mengabaikan motif pelaku sepenuhnya"
  ], a: 1, why: "Ford menghitung total biaya-manfaat dan mengabaikan bahwa korban memiliki <strong>hak atas keselamatan</strong> yang tidak boleh diperdagangkan. Pilihan (c) adalah kelemahan ethics of duty, bukan utilitarianism." },

  { ch: 3, q: "\"Perlakukan manusia selalu sekaligus sebagai tujuan, tidak pernah semata-mata sebagai sarana\" adalah maksim Kant yang ke-…", opts: [
    "pertama — consistency", "kedua — human dignity", "ketiga — universality", "bukan bagian dari categorical imperative"
  ], a: 1, why: "Maxim 2 (<strong>human dignity</strong>) adalah alat paling tajam untuk kasus bisnis. Perhatikan kata <em>semata-mata</em>: mempekerjakan orang tidak otomatis salah." },

  { ch: 3, q: "Prinsip Rawls yang menyatakan ketimpangan hanya dibenarkan bila menguntungkan pihak paling tidak beruntung disebut…", opts: [
    "liberty principle", "difference principle", "veil of ignorance", "categorical imperative"
  ], a: 1, why: "<strong>Difference principle</strong>. <em>Veil of ignorance</em> adalah metode untuk sampai pada prinsip itu, bukan prinsipnya sendiri." },

  { ch: 3, q: "Teori yang menyatakan keabsahan moral lahir dari dialog yang setara dan bebas dominasi di antara pihak terdampak adalah…", opts: [
    "virtue ethics", "feminist ethics", "discourse ethics", "postmodern ethics"
  ], a: 2, why: "<strong>Discourse ethics</strong> (Habermas). Ini landasan teoretis bagi praktik <em>stakeholder dialogue</em> yang dibahas di CM5." },

  { ch: 3, q: "Pertanyaan pokok virtue ethics adalah…", opts: [
    "Tindakan apa yang menghasilkan manfaat terbesar?",
    "Kewajiban apa yang mengikat saya?",
    "Orang seperti apa yang seharusnya saya jadi?",
    "Hak siapa yang dilanggar di sini?"
  ], a: 2, why: "Virtue ethics (Aristoteles) menggeser fokus dari <em>tindakan</em> ke <strong>karakter</strong>. Tindakan bermoral mengalir dari karakter yang baik dan kebijaksanaan praktis (phronesis)." },

  { ch: 3, q: "Ciri yang membedakan teori etika kontemporer dari teori Western modernist adalah…", opts: [
    "lebih rasional, universal, dan berbasis aturan",
    "lebih berbasis pengalaman, partikular, personal, dan relasional",
    "hanya berlaku di negara berkembang",
    "sepenuhnya menolak konsep benar dan salah"
  ], a: 1, why: "Modernist: rasional, universal, impersonal, berbasis aturan. <strong>Kontemporer</strong>: berbasis pengalaman, partikular, personal, relasional." },

  { ch: 3, q: "Pendekatan yang paling dianjurkan Crane & Matten dalam menganalisis kasus bisnis adalah…", opts: [
    "memilih satu teori dan menerapkannya secara konsisten",
    "menggunakan utilitarianism karena paling praktis untuk bisnis",
    "menggunakan beberapa lensa teori sekaligus, lalu tetap mengambil posisi",
    "menghindari teori dan mengandalkan intuisi"
  ], a: 2, why: "Inilah <strong>ethical pluralism</strong>. Masing-masing teori menyorot aspek berbeda; setelah itu kamu tetap harus menyatakan penilaian, mengakui trade-off, dan menawarkan alternatif." },

  /* ================= CM4 ================= */
  { ch: 4, q: "Urutan yang benar dalam model pengambilan keputusan etis adalah…", opts: [
    "judgement → recognition → intent → behaviour",
    "recognition → judgement → intent → behaviour",
    "intent → judgement → recognition → behaviour",
    "recognition → intent → judgement → behaviour"
  ], a: 1, why: "Model Rest: <strong>recognize moral issue → make moral judgement → establish moral intent → engage in moral behaviour</strong>. Rantai bisa putus di tahap mana pun." },

  { ch: 4, q: "Seorang manajer memandang keputusan PHK murni sebagai persoalan efisiensi biaya, tanpa menyadari dimensi moralnya. Ini adalah kegagalan pada tahap…", opts: [
    "1 — recognize moral issue", "2 — make moral judgement", "3 — establish moral intent", "4 — engage in moral behaviour"
  ], a: 0, why: "Ini <strong>ethical blindness</strong> — gagal mengenali isu sebagai isu moral. Kegagalan paling umum, dan sering diperparah oleh <em>euphemistic labelling</em> seperti menyebut PHK sebagai \"rightsizing\"." },

  { ch: 4, q: "Manakah yang BUKAN komponen moral intensity menurut Jones?", opts: [
    "Magnitude of consequences", "Social consensus", "Temporal immediacy", "Cognitive moral development"
  ], a: 3, why: "Enam komponennya: magnitude of consequences, social consensus, probability of effect, temporal immediacy, proximity, concentration of effect. <strong>CMD adalah konsep Kohlberg</strong> — faktor individual, bukan komponen moral intensity." },

  { ch: 4, q: "Buruh di pabrik pemasok lima negara jauhnya terasa \"kurang nyata\" bagi manajer pembelian. Komponen moral intensity yang rendah di sini adalah…", opts: [
    "magnitude of consequences", "proximity", "social consensus", "concentration of effect"
  ], a: 1, why: "<strong>Proximity</strong> — kedekatan sosial, budaya, fisik, atau psikologis korban dengan pengambil keputusan. Ini penjelasan kuat mengapa pelanggaran di rantai pasok jauh mudah diabaikan." },

  { ch: 4, q: "Sebagian besar orang dewasa menurut Kohlberg berada pada level…", opts: [
    "pre-conventional", "conventional", "post-conventional", "tidak dapat dikategorikan"
  ], a: 1, why: "Level <strong>conventional</strong> (tahap 3–4): memenuhi harapan kelompok dan mematuhi hukum serta ketertiban sosial. Relatif sedikit orang mencapai level post-conventional." },

  { ch: 4, q: "Kritik Carol Gilligan terhadap model Kohlberg adalah bahwa model itu…", opts: [
    "terlalu menekankan konsekuensi tindakan",
    "dibangun dari sampel laki-laki dan mengistimewakan penalaran keadilan di atas penalaran care",
    "tidak dapat diuji secara empiris",
    "hanya berlaku bagi anak-anak"
  ], a: 1, why: "Gilligan menunjukkan perempuan yang menalar lewat relasi dan kepedulian tampak \"lebih rendah\" pada skala Kohlberg, padahal hanya <strong>berbeda</strong>, bukan kurang berkembang." },

  { ch: 4, q: "Efek birokrasi berupa terpecahnya tanggung jawab sehingga tak seorang pun merasa bertanggung jawab utuh disebut…", opts: [
    "suppression of moral autonomy", "instrumental morality", "segmentation of responsibility", "denial of moral status"
  ], a: 2, why: "<strong>Segmentation of responsibility</strong>. Empat efek birokrasi lainnya: penekanan otonomi moral, moralitas instrumental (fokus cara bukan tujuan), dan penyangkalan status moral (orang direduksi jadi angka)." },

  { ch: 4, q: "Seorang CEO dikenal berintegritas tinggi dalam kehidupan pribadinya, tetapi tidak pernah membicarakan etika kepada karyawan. Dalam matriks Treviño ia adalah…", opts: [
    "ethical leader", "hypocritical leader", "ethically neutral leader", "unethical leader"
  ], a: 2, why: "<strong>Ethically neutral / silent leader</strong>: kuat sebagai moral person, lemah sebagai moral manager. Karyawan mengisi kekosongan itu dengan asumsi bahwa yang penting hanya hasil." },

  /* ================= CM5 ================= */
  { ch: 5, q: "Pendekatan manajemen etika yang mengandalkan aturan rinci, pemantauan, dan sanksi disebut…", opts: [
    "integrity-based", "compliance-based", "values-based", "discourse-based"
  ], a: 1, why: "<strong>Compliance-based</strong> (Paine) berasumsi manusia adalah makhluk yang menghitung untung-rugi dan takut sanksi. Risikonya: mentalitas \"asal tidak melanggar aturan tertulis\" dan mencari celah." },

  { ch: 5, q: "Kode etik yang ditetapkan badan lintas pihak seperti Fairtrade atau UN Global Compact termasuk jenis…", opts: [
    "organizational code", "professional code", "industry code", "programme / group code"
  ], a: 3, why: "<strong>Programme / group code</strong>. Organizational = satu perusahaan; professional = asosiasi profesi; industry = satu sektor." },

  { ch: 5, q: "Fakta bahwa Enron memiliki kode etik setebal 64 halaman yang memenangkan penghargaan paling tepat digunakan untuk menunjukkan bahwa…", opts: [
    "kode etik selalu tidak berguna",
    "keberadaan kode etik saja tidak menjamin apa pun tanpa budaya dan penegakan",
    "kode etik seharusnya lebih pendek",
    "penghargaan etika tidak kredibel"
  ], a: 1, why: "Yang menentukan efektivitas adalah isi yang spesifik, proses penyusunan yang melibatkan karyawan, komunikasi, <strong>penegakan konsisten termasuk pada eksekutif senior</strong>, dan keselarasan dengan sistem imbalan." },

  { ch: 5, q: "Manakah yang BUKAN kriteria whistleblowing yang dapat dibenarkan secara moral?", opts: [
    "Praktik tersebut menimbulkan bahaya serius bagi pihak lain",
    "Karyawan sudah menempuh saluran internal hingga habis",
    "Karyawan memperoleh imbalan finansial dari pengungkapan",
    "Ada bukti terdokumentasi yang meyakinkan bagi pengamat wajar"
  ], a: 2, why: "Imbalan finansial bukan kriteria pembenar — justru dapat mempertanyakan motifnya. Kriteria De George berfokus pada bahaya, penempuhan saluran internal, bukti, dan peluang perubahan." },

  { ch: 5, q: "Tingkat tertinggi dalam tangga keterlibatan stakeholder adalah…", opts: [
    "informing", "consultation", "dialogue", "partnership"
  ], a: 3, why: "<strong>Partnership</strong> — berbagi pengambilan keputusan dan sumber daya. Stakeholder menjadi mitra, bukan objek yang dimintai pendapat." },

  { ch: 5, q: "Konsultasi stakeholder yang hasilnya sudah ditentukan sebelumnya disebut…", opts: [
    "dialogue", "tokenism", "partnership", "assurance"
  ], a: 1, why: "<strong>Tokenism</strong> menyerap kritik tanpa mengubah apa pun, dan meruntuhkan kepercayaan lebih dalam daripada tidak berkonsultasi. Uji: apakah keputusan perusahaan <em>pernah berubah</em> karena masukan?" },

  { ch: 5, q: "Elemen yang paling tajam membedakan laporan keberlanjutan yang kredibel dari materi pemasaran adalah…", opts: [
    "jumlah halaman laporan", "kualitas desain dan foto", "external assurance oleh pihak ketiga independen", "penggunaan istilah teknis"
  ], a: 2, why: "<strong>External assurance</strong>. Tanpa verifikasi independen, angka apa pun hanyalah klaim sepihak. Kriteria lain: completeness, comparability, accuracy, dan balance." },

  { ch: 5, q: "Standar yang menekankan prinsip <em>inclusivity, materiality, responsiveness,</em> dan <em>impact</em> adalah…", opts: [
    "GRI Standards", "AA1000", "ISO 26000", "TCFD"
  ], a: 1, why: "<strong>AA1000</strong> (AccountAbility) menekankan kualitas <em>proses</em>. GRI menekankan isi pelaporan berbasis materialitas dan dampak; ISO 26000 adalah panduan tanpa sertifikasi." },

  /* ================= CM6 ================= */
  { ch: 6, q: "Dua penyebab utama agency problem adalah…", opts: [
    "regulasi lemah dan pajak tinggi",
    "perbedaan kepentingan dan asimetri informasi",
    "persaingan pasar dan tekanan konsumen",
    "struktur dewan dan ukuran perusahaan"
  ], a: 1, why: "Manajer mungkin mengejar ukuran perusahaan, prestise, atau bonus jangka pendek (<strong>perbedaan kepentingan</strong>), dan tahu jauh lebih banyak daripada pemegang saham (<strong>asimetri informasi</strong>)." },

  { ch: 6, q: "Ciri sistem tata kelola Continental European adalah…", opts: [
    "kepemilikan tersebar dan dewan satu tingkat",
    "kepemilikan terkonsentrasi dan dewan dua tingkat",
    "kepemilikan tersebar dan dewan dua tingkat",
    "kepemilikan terkonsentrasi dan dewan satu tingkat"
  ], a: 1, why: "Continental: kepemilikan terkonsentrasi pada bank, keluarga, atau negara, dengan dewan pengawas terpisah dari dewan pelaksana, serta <em>codetermination</em>. Indonesia mengikuti pola dua tingkat ini." },

  { ch: 6, q: "Manakah yang merupakan argumen KRITIS terhadap remunerasi eksekutif berbasis saham dan opsi?", opts: [
    "Menyelaraskan kepentingan manajer dengan pemilik",
    "Mendorong manipulasi jangka pendek harga saham dan pengambilan risiko berlebihan",
    "Mencerminkan pasar bakat yang kompetitif",
    "Ditetapkan oleh komite remunerasi independen"
  ], a: 1, why: "Insentif berbasis saham dapat memicu <strong>short-termism</strong> dan risiko berlebih. Ditambah fenomena <em>rewards for failure</em>: pesangon besar tetap diterima meski kinerja buruk." },

  { ch: 6, q: "Manakah yang BUKAN alasan mengapa insider trading dianggap tidak etis?", opts: [
    "Melanggar keadilan karena sebagian pihak bermain dengan kartu terbuka",
    "Merupakan penyalahgunaan informasi yang bukan miliknya",
    "Menggerus kepercayaan pada pasar",
    "Selalu menyebabkan kerugian finansial bagi perusahaan penerbit"
  ], a: 3, why: "Tiga alasan pertama adalah argumen standar. Insider trading dipersoalkan karena <strong>keadilan, penyalahgunaan informasi, dan kepercayaan pasar</strong> — bukan karena kerugian langsung bagi emiten." },

  { ch: 6, q: "Perbedaan pokok tax evasion dan tax avoidance adalah…", opts: [
    "evasion ilegal, avoidance legal tetapi tetap dapat dipersoalkan secara etis",
    "evasion legal, avoidance ilegal",
    "keduanya ilegal dengan tingkat sanksi berbeda",
    "keduanya legal dan tidak menimbulkan isu etis"
  ], a: 0, why: "Avoidance sah, tetapi perusahaan menikmati infrastruktur yang dibiayai pajak lalu memindahkan bebannya ke pihak lain. Uji dengan maksim Kant 1: bagaimana bila semua perusahaan melakukannya?" },

  { ch: 6, q: "Strategi SRI yang justru mempertahankan kepemilikan saham agar dapat menekan perubahan dari dalam disebut…", opts: [
    "negative screening", "best-in-class", "engagement", "divestment"
  ], a: 2, why: "<strong>Engagement</strong> — memakai hak suara dan dialog untuk mengubah perilaku perusahaan. Negative screening justru mengeluarkan sektor tertentu dari portofolio." },

  { ch: 6, q: "Kritik bahwa ESG arus utama mengukur risiko keberlanjutan <em>terhadap perusahaan</em>, bukan dampak <em>perusahaan terhadap dunia</em>, berkaitan dengan konsep…", opts: [
    "agency cost", "double materiality", "shareholder primacy", "external assurance"
  ], a: 1, why: "<strong>Double materiality</strong>: pengungkapan harus dua arah — financial materiality dan impact materiality. Kebanyakan perusahaan hanya melaporkan arah pertama." },

  { ch: 6, q: "Bentuk badan hukum yang secara hukum mengikat tujuan sosial ke dalam anggaran dasar perusahaan adalah…", opts: [
    "limited liability company", "benefit corporation", "public listed company", "holding company"
  ], a: 1, why: "<strong>Benefit corporation</strong> — respons terhadap short-termism, karena direksi secara hukum wajib mempertimbangkan tujuan sosial dan lingkungan, bukan hanya nilai pemegang saham." },

  /* ================= CM7 ================= */
  { ch: 7, q: "Batas kewajiban loyalitas karyawan terhadap perusahaan adalah ketika…", opts: [
    "karyawan menerima tawaran kerja dari perusahaan lain",
    "perusahaan meminta karyawan berpartisipasi dalam atau menutupi tindakan yang membahayakan pihak lain",
    "karyawan tidak setuju dengan strategi perusahaan",
    "karyawan merasa gajinya terlalu rendah"
  ], a: 1, why: "Loyalitas tidak absolut. Di titik inilah <strong>whistleblowing</strong> (CM5) menjadi dapat dibenarkan secara moral." },

  { ch: 7, q: "Persyaratan tinggi badan minimum untuk pekerjaan yang tidak memerlukannya merupakan contoh…", opts: [
    "direct discrimination", "indirect discrimination", "affirmative action", "reverse discrimination"
  ], a: 1, why: "<strong>Indirect discrimination</strong>: aturan tampak netral tetapi berdampak tidak proporsional pada kelompok tertentu. Direct discrimination bersifat terang-terangan." },

  { ch: 7, q: "Argumen bahwa affirmative action merugikan individu dari kelompok mayoritas atas hal yang bukan perbuatannya disebut…", opts: [
    "glass ceiling", "reverse discrimination", "indirect discrimination", "equal opportunity"
  ], a: 1, why: "<strong>Reverse discrimination</strong> adalah keberatan utama terhadap affirmative action, bersama argumen meritokrasi dan risiko stigma terhadap penerima manfaat." },

  { ch: 7, q: "Manakah yang BUKAN termasuk empat uji kelayakan pemantauan karyawan?", opts: [
    "Justification", "Proportionality", "Profitability", "Transparency"
  ], a: 2, why: "Empat ujinya: <strong>justification, proportionality, transparency, consent & recourse</strong>. Profitabilitas bukan pembenar etis untuk mengurangi privasi seseorang." },

  { ch: 7, q: "Mengapa argumen \"karyawan sudah menyetujui pemantauan dalam kontrak\" dipandang lemah secara etis?", opts: [
    "Karena kontrak kerja tidak mengikat secara hukum",
    "Karena asimetri kuasa membuat persetujuan itu tidak benar-benar bebas",
    "Karena pemantauan selalu ilegal",
    "Karena karyawan tidak membaca kontrak"
  ], a: 1, why: "Menolak bisa berarti kehilangan pekerjaan, sehingga persetujuannya tidak setara. Kaitkan dengan maksim Kant 2: apakah karyawan diperlakukan sebagai tujuan, atau semata alat produksi?" },

  { ch: 7, q: "Selisih antara upah minimum legal dan upah layak paling tepat digambarkan sebagai…", opts: [
    "wilayah ilegal yang harus ditindak",
    "wilayah legal tetapi tetap dapat dipersoalkan secara etis",
    "wilayah yang tidak relevan bagi etika bisnis",
    "wilayah yang sepenuhnya menjadi tanggung jawab pemerintah"
  ], a: 1, why: "Membayar upah minimum sepenuhnya legal, tetapi bila tidak cukup memenuhi kebutuhan dasar pekerja, ia kembali ke kuadran <strong>legal tetapi tidak etis</strong> dari CM1." },

  { ch: 7, q: "Pelajaran utama kasus Rana Plaza bagi etika bisnis adalah…", opts: [
    "perusahaan hanya bertanggung jawab atas aset yang dimilikinya",
    "tanggung jawab meluas ke rantai pasok karena tekanan harga dan tenggat ikut membentuk kondisi kerja",
    "regulasi bangunan tidak relevan bagi merek global",
    "audit sukarela sudah memadai untuk mencegah tragedi"
  ], a: 1, why: "Merek yang memesan tidak memiliki gedung itu, tetapi ikut membentuk kondisinya. Hasilnya adalah <em>Accord on Fire and Building Safety</em> — pergeseran dari kode sukarela ke komitmen yang dapat ditegakkan." },

  { ch: 7, q: "Prinsip bahwa pekerja sektor energi fosil tidak boleh ditinggalkan dalam peralihan ke energi bersih disebut…", opts: [
    "green jobs", "just transition", "work-life balance", "codetermination"
  ], a: 1, why: "<strong>Just transition</strong> — titik pertemuan langsung antara pilar lingkungan dan pilar sosial pada triple bottom line." },

  /* ================= CM8 ================= */
  { ch: 8, q: "Empat hak konsumen yang dirumuskan Kennedy (1962) adalah…", opts: [
    "safety, information, choice, redress",
    "safety, be informed, choose, be heard",
    "safety, privacy, choose, education",
    "information, privacy, redress, healthy environment"
  ], a: 1, why: "Empat hak asli: <strong>right to safety, to be informed, to choose, to be heard</strong>. Redress, education, basic needs, dan healthy environment adalah perluasannya." },

  { ch: 8, q: "Manakah yang BUKAN syarat agar <em>consumer sovereignty</em> benar-benar berlaku?", opts: [
    "Capability — konsumen mampu menilai", "Information — tersedia dan dapat dipahami", "Choice — ada alternatif nyata", "Loyalty — konsumen setia pada merek"
  ], a: 3, why: "Tiga syaratnya: <strong>capability, information, choice</strong>. Bila salah satu tidak terpenuhi — misalnya pada anak-anak — argumen \"konsumen kan memilih sendiri\" kehilangan kekuatannya." },

  { ch: 8, q: "Standar yang menyatakan produsen bertanggung jawab atas cacat produk meskipun tidak terbukti lalai adalah…", opts: [
    "caveat emptor", "due care", "strict liability", "caveat venditor"
  ], a: 2, why: "<strong>Strict liability</strong> — alasannya produsen paling mampu menanggung, menyebarkan, dan mencegah risiko. Ini standar paling ketat dari ketiganya." },

  { ch: 8, q: "Menaikkan harga masker dan oksigen secara ekstrem pada puncak pandemi disebut…", opts: [
    "predatory pricing", "price fixing", "price gouging", "deceptive pricing"
  ], a: 2, why: "<strong>Price gouging</strong> — menaikkan harga secara ekstrem saat darurat ketika konsumen tidak punya pilihan." },

  { ch: 8, q: "Mengapa iklan yang menyasar anak-anak dipersoalkan secara khusus?", opts: [
    "Karena anak tidak memiliki daya beli sendiri",
    "Karena anak belum mampu mengenali maksud persuasif iklan sehingga syarat capability tidak terpenuhi",
    "Karena iklan untuk anak selalu ilegal",
    "Karena anak tidak menonton televisi lagi"
  ], a: 1, why: "Syarat <strong>capability</strong> pada consumer sovereignty tidak terpenuhi. Karena itu banyak negara membatasi iklan makanan tinggi gula, garam, dan lemak untuk anak." },

  { ch: 8, q: "Kasus Cambridge Analytica paling tepat dianalisis sebagai pelanggaran…", opts: [
    "maksim Kant 2 — orang diperlakukan semata sebagai sarana",
    "prinsip utilitarianism karena manfaat totalnya negatif",
    "difference principle Rawls",
    "kode etik profesi akuntan"
  ], a: 0, why: "Data puluhan juta orang dipakai membuat profil psikologis untuk penargetan politik tanpa persetujuan — pelanggaran <strong>human dignity</strong> dalam bentuk paling murni." },

  { ch: 8, q: "Kritik utama terhadap pendekatan Bottom of the Pyramid adalah…", opts: [
    "pasar BOP terlalu kecil untuk menguntungkan",
    "berisiko menjadi eksploitasi terhadap kelompok paling rentan, termasuk lewat poverty penalty dan jeratan utang",
    "produk BOP selalu berkualitas rendah",
    "BOP hanya relevan di negara maju"
  ], a: 1, why: "Tanpa keterlibatan komunitas, BOP dapat sekadar memindahkan model konsumsi dan menjerat kelompok rentan. Model yang lebih menjanjikan: membangun usaha <em>bersama</em> komunitas sebagai produsen dan pemilik." },

  { ch: 8, q: "Fenomena konsumen menyatakan peduli lingkungan tetapi tetap membeli berdasarkan harga dan kenyamanan disebut…", opts: [
    "planned obsolescence", "attitude–behaviour gap", "consumer sovereignty", "dark pattern"
  ], a: 1, why: "<strong>Attitude–behaviour gap</strong>. Implikasi etisnya: mengalihkan seluruh tanggung jawab keberlanjutan kepada \"pilihan konsumen\" adalah pengalihan tanggung jawab yang tidak jujur." },

  /* ================= CM9 ================= */
  { ch: 9, q: "Perbedaan bribery dan corruption adalah…", opts: [
    "keduanya istilah yang identik",
    "bribery adalah pertukaran keuntungan atas tindakan yang melanggar kepercayaan; corruption lebih luas yaitu penyalahgunaan kekuasaan yang dipercayakan",
    "corruption hanya terjadi di sektor publik",
    "bribery selalu legal di negara berkembang"
  ], a: 1, why: "<strong>Corruption</strong> adalah payung yang lebih luas; <strong>bribery</strong> adalah salah satu bentuknya." },

  { ch: 9, q: "Argumen bahwa suap \"tidak dapat diuniversalkan karena bila semua orang menyuap sistemnya runtuh\" berasal dari…", opts: [
    "utilitarianism", "maksim Kant 1 — consistency", "virtue ethics", "discourse ethics"
  ], a: 1, why: "<strong>Maksim 1 (consistency)</strong>. Suap secara inheren mensyaratkan orang lain <em>tidak</em> melakukannya — karena itu ia gagal uji universalisasi." },

  { ch: 9, q: "Status hukum <em>facilitation payment</em> adalah…", opts: [
    "dilarang oleh semua yurisdiksi tanpa kecuali",
    "diizinkan bersyarat oleh US FCPA tetapi dilarang oleh UK Bribery Act dan hukum Indonesia",
    "diizinkan oleh UK Bribery Act tetapi dilarang FCPA",
    "tidak diatur di mana pun"
  ], a: 1, why: "Perbedaan FCPA dan UK Bribery Act ini sering ditanyakan. UK Bribery Act lebih ketat: mencakup suap sektor swasta dan delik <em>failure to prevent bribery</em>." },

  { ch: 9, q: "Menyamar sebagai pelamar kerja untuk menggali rahasia dagang pesaing termasuk…", opts: [
    "competitive intelligence yang sah", "industrial espionage", "benchmarking", "market research"
  ], a: 1, why: "<strong>Industrial espionage</strong>. Competitive intelligence yang sah menganalisis laporan tahunan, paten, iklan, dan riset pasar terbuka." },

  { ch: 9, q: "Kesepakatan antarpesaing untuk mengatur siapa yang memenangkan tender disebut…", opts: [
    "predatory pricing", "bid rigging", "tying", "dumping"
  ], a: 1, why: "<strong>Bid rigging</strong> adalah bentuk kartel. Di Indonesia diawasi KPPU berdasarkan UU No. 5/1999 tentang Larangan Praktik Monopoli dan Persaingan Usaha Tidak Sehat." },

  { ch: 9, q: "Menurut Crane & Matten, persaingan yang keras…", opts: [
    "selalu merupakan pelanggaran etika bisnis",
    "bukan pelanggaran etika; yang tidak etis adalah menghindari persaingan atau menang di luar kualitas penawaran",
    "hanya etis bila perusahaan berukuran sama",
    "harus dibatasi regulasi pada semua sektor"
  ], a: 1, why: "Persaingan justru manfaat utama pasar bagi konsumen. Yang bermasalah adalah <strong>kartel</strong> (menghindari persaingan) dan <strong>spionase, fitnah, penyalahgunaan dominasi</strong> (menang di luar kualitas)." },

  { ch: 9, q: "Kelemahan utama supplier codes of conduct dan audit terjadwal adalah…", opts: [
    "biayanya terlalu murah",
    "audit terjadwal mudah disiapkan dan biaya kepatuhan sering dibebankan ke pemasok tanpa kenaikan harga beli",
    "tidak ada standar internasional yang tersedia",
    "pemasok tidak pernah bersedia diaudit"
  ], a: 1, why: "Karena itu praktik yang lebih baik mencakup audit mendadak, wawancara pekerja di luar lokasi, penelusuran ke pemasok tingkat lanjut, dan <strong>capacity building</strong> alih-alih pemutusan sepihak." },

  { ch: 9, q: "Dalam hierarki prinsip circular economy, daur ulang (<em>recycle</em>) berada…", opts: [
    "di urutan pertama sebagai prioritas utama",
    "hampir di urutan terakhir, karena mencegah penggunaan material lebih baik daripada mengolahnya kembali",
    "di luar hierarki",
    "sejajar dengan refuse dan reduce"
  ], a: 1, why: "Hierarkinya: <strong>refuse, reduce, reuse, repair, refurbish, remanufacture, recycle, recover</strong>. Banyak perusahaan menonjolkan daur ulang justru karena ia paling tidak mengganggu model bisnis yang ada." },

  /* ================= CM10 ================= */
  { ch: 10, q: "Dalam kerangka stakeholder salience, CSO umumnya kuat pada atribut…", opts: [
    "power formal dan legitimacy", "legitimacy dan urgency", "power formal dan urgency", "hanya urgency"
  ], a: 1, why: "CSO umumnya lemah pada <strong>power</strong> formal karena tidak punya hubungan transaksional dengan perusahaan. Mereka membangun kekuatan lewat media, konsumen, dan investor." },

  { ch: 10, q: "Membentuk gerakan warga palsu yang seolah muncul spontan dari masyarakat disebut…", opts: [
    "greenwashing", "bluewashing", "astroturfing", "co-optation"
  ], a: 2, why: "<strong>Astroturfing</strong> — manipulasi opini publik yang menyamar sebagai partisipasi sipil. Bandingkan dengan bluewashing (memakai kemitraan LSM/PBB sebagai tameng reputasi)." },

  { ch: 10, q: "Risiko utama bagi CSO dalam kemitraan jangka panjang dengan perusahaan adalah…", opts: [
    "kehilangan pendanaan", "co-optation — kehilangan ketajaman kritis", "kehilangan anggota", "tuntutan hukum"
  ], a: 1, why: "<strong>Co-optation</strong>. Karena itu isu akuntabilitas, transparansi sumber dana, dan independensi CSO juga harus diuji — bukan hanya perilaku perusahaan." },

  { ch: 10, q: "Pertanyaan \"atas dasar apa sebuah NGO mengklaim berbicara mewakili komunitas terdampak?\" berkaitan dengan isu…", opts: [
    "efisiensi", "legitimacy dan representativeness", "profitabilitas", "regulasi pajak"
  ], a: 1, why: "Berbeda dari pemerintah, NGO tidak melalui mekanisme pemilihan. Menerapkan standar yang sama pada bisnis dan CSO adalah tanda analisis yang matang." },

  { ch: 10, q: "Tingkat keterlibatan komunitas di mana perusahaan menciptakan nilai sosial melalui model bisnisnya sendiri disebut…", opts: [
    "charitable giving", "community involvement", "strategic philanthropy", "shared value / social investment"
  ], a: 3, why: "<strong>Shared value</strong> adalah tingkat terdalam — nilai sosial dihasilkan oleh bisnis intinya, bukan lewat program terpisah yang mudah dihentikan saat laba turun." },

  { ch: 10, q: "Kritik paling tajam terhadap filantropi korporat adalah bahwa ia dapat…", opts: [
    "menghabiskan terlalu banyak anggaran perusahaan",
    "mengalihkan perhatian dari dampak negatif bisnis inti perusahaan",
    "membuat LSM terlalu kaya",
    "melanggar hukum persaingan usaha"
  ], a: 1, why: "Contohnya menyumbang untuk pendidikan sambil melakukan penghindaran pajak yang mengurangi anggaran pendidikan publik. <strong>Filantropi tidak dapat menebus kerusakan operasi utama.</strong>" },

  { ch: 10, q: "Ciri pembeda utama social enterprise adalah…", opts: [
    "tidak boleh menghasilkan surplus sama sekali",
    "misi sosial sebagai tujuan utama, dengan surplus terutama diinvestasikan kembali untuk misi itu",
    "sepenuhnya dibiayai donasi",
    "hanya beroperasi di negara berkembang"
  ], a: 1, why: "Social enterprise tetap menggunakan model bisnis dan boleh menghasilkan surplus — yang membedakan adalah <strong>tujuan utamanya</strong> dan ke mana surplus itu mengalir." },

  { ch: 10, q: "Kasus Shell dan komunitas Ogoni di Nigeria paling relevan menunjukkan…", opts: [
    "keberhasilan program filantropi korporat",
    "pertanyaan tentang kewajiban MNC di wilayah dengan tata kelola lemah dan hak sipil-politik warga",
    "efektivitas sertifikasi lingkungan",
    "manfaat privatisasi sektor energi"
  ], a: 1, why: "Kasus ini menghubungkan CM10 dengan CM2 (<em>extended corporate citizenship</em>) dan CM11 (apa kewajiban perusahaan ketika negara tuan rumah tidak melindungi warganya)." },

  /* ================= CM11 ================= */
  { ch: 11, q: "Manakah yang BUKAN alasan etis dibutuhkannya regulasi atas bisnis?", opts: [
    "Eksternalitas yang tidak masuk dalam harga pasar",
    "Asimetri informasi antara perusahaan dan konsumen",
    "Tragedy of the commons pada sumber daya bersama",
    "Kebutuhan perusahaan memperoleh margin laba tertentu"
  ], a: 3, why: "Alasan etis regulasi: <strong>eksternalitas, barang publik, asimetri informasi, kekuatan pasar/monopoli, dan tragedy of the commons</strong>. Menjamin margin laba bukan alasan etis regulasi." },

  { ch: 11, q: "Perpindahan orang antara jabatan regulator dan industri yang diaturnya disebut…", opts: [
    "state capture", "revolving door", "regulatory arbitrage", "astroturfing"
  ], a: 1, why: "<strong>Revolving door</strong>. Bedakan dari <em>regulatory capture</em> (regulator melayani industri yang diawasinya) dan <em>state capture</em> (kepentingan swasta membentuk aturan negara secara sistematis)." },

  { ch: 11, q: "Praktik lobi yang paling jelas bermasalah secara etis adalah…", opts: [
    "menyampaikan data teknis yang dapat diverifikasi kepada pembuat kebijakan",
    "terdaftar dalam daftar lobi resmi",
    "mendanai riset yang tampak independen untuk menciptakan keraguan ilmiah palsu",
    "bersaing terbuka dengan kepentingan lain"
  ], a: 2, why: "Memengaruhi kebijakan tidak otomatis tidak etis. Yang bermasalah: kerahasiaan, data menyesatkan, meniadakan suara pihak lemah, dan <strong>astroturfing</strong>." },

  { ch: 11, q: "Memindahkan pencatatan laba ke yurisdiksi dengan aturan paling menguntungkan disebut…", opts: [
    "race to the bottom", "regulatory arbitrage", "governance gap", "soft law"
  ], a: 1, why: "<strong>Regulatory arbitrage</strong>. <em>Race to the bottom</em> adalah respons negara yang menurunkan standar demi menarik investasi; <em>governance gap</em> adalah ketiadaan otoritas penegak lintas batas." },

  { ch: 11, q: "UN Guiding Principles on Business and Human Rights merumuskan kerangka…", opts: [
    "Plan, Do, Check, Act", "Protect, Respect, Remedy", "People, Planet, Profit", "Reduce, Reuse, Recycle"
  ], a: 1, why: "Negara <em>melindungi</em>, perusahaan <em>menghormati</em> (termasuk <strong>human rights due diligence</strong>), dan korban memiliki akses <em>pemulihan</em>." },

  { ch: 11, q: "Standar yang disusun bersama bisnis, LSM, serikat pekerja, dan pemerintah — seperti FSC dan RSPO — disebut…", opts: [
    "hard law", "self-regulation", "multi-stakeholder initiative", "soft law"
  ], a: 2, why: "<strong>Multi-stakeholder initiatives</strong> memiliki legitimasi lebih tinggi daripada self-regulation karena melibatkan pihak terdampak dalam penyusunannya." },

  { ch: 11, q: "Masalah demokratis utama dari <em>political CSR</em> adalah…", opts: [
    "perusahaan tidak punya cukup dana",
    "korporasi tidak dipilih dan tidak dapat dicopot oleh mereka yang terdampak keputusannya",
    "pemerintah menolak bekerja sama",
    "program semacam itu selalu merugi"
  ], a: 1, why: "Ini kelanjutan <em>extended corporate citizenship</em> CM2. Risiko lain: melemahkan kapasitas negara jangka panjang, dan layanan dapat ditarik sewaktu-waktu ketika tidak lagi menguntungkan." },

  { ch: 11, q: "Pajak karbon dan sistem perdagangan emisi termasuk instrumen regulasi jenis…", opts: [
    "instrumen perintah", "instrumen harga", "instrumen informasi", "instrumen insentif"
  ], a: 1, why: "<strong>Instrumen harga</strong> — membuat eksternalitas masuk ke dalam harga (<em>internalising externalities</em>). Standar emisi adalah instrumen perintah; label energi adalah instrumen informasi." },

  /* ================= CM12 ================= */
  { ch: 12, q: "Manakah yang menggambarkan pergeseran arah etika bisnis menurut CM12?", opts: [
    "dari tanggung jawab atas dampak menuju kepatuhan hukum semata",
    "dari program CSR terpisah menuju integrasi ke dalam model bisnis",
    "dari pelaporan dampak terverifikasi menuju pernyataan niat",
    "dari tata kelola lintas batas menuju regulasi nasional saja"
  ], a: 1, why: "Arah pergeserannya: kepatuhan → tanggung jawab atas dampak; sukarela → uji tuntas mengikat; program terpisah → terintegrasi; niat → dampak terverifikasi." },

  { ch: 12, q: "Uji paling tajam untuk menilai kesungguhan klaim <em>stakeholder capitalism</em> adalah…", opts: [
    "seberapa sering istilah itu disebut dalam laporan tahunan",
    "apakah ada target terukur, remunerasi eksekutif yang terikat padanya, dan pihak luar yang dapat menuntut pertanggungjawaban",
    "berapa besar anggaran CSR perusahaan",
    "apakah perusahaan memiliki departemen keberlanjutan"
  ], a: 1, why: "Tanpa mekanisme akuntabilitas, stakeholder capitalism mudah menjadi retorika — karena tidak ada yang dapat menuntut bila janji tidak dipenuhi." },

  { ch: 12, q: "Sistem rekrutmen otomatis yang menolak pelamar perempuan karena dilatih pada data historis perusahaan merupakan contoh…", opts: [
    "black box problem", "algorithmic bias", "accountability gap", "human oversight"
  ], a: 1, why: "<strong>Algorithmic bias</strong> — sistem mereproduksi diskriminasi masa lalu. Ini menghubungkan CM12 langsung ke isu diskriminasi CM7." },

  { ch: 12, q: "Prinsip etika AI yang menuntut manusia tetap dapat meninjau dan membatalkan keputusan berisiko tinggi disebut…", opts: [
    "explainability", "human oversight", "robustness", "data minimisation"
  ], a: 1, why: "<strong>Human oversight</strong>. Prinsip lain: transparency & explainability, fairness, accountability, privacy & data governance, safety & robustness." },

  { ch: 12, q: "Double materiality mensyaratkan pengungkapan mengenai…", opts: [
    "dampak isu keberlanjutan pada nilai perusahaan saja",
    "dampak perusahaan pada manusia dan lingkungan saja",
    "kedua arah: dampak isu pada perusahaan DAN dampak perusahaan pada manusia serta lingkungan",
    "dampak finansial pada pemegang saham mayoritas"
  ], a: 2, why: "<strong>Kedua arah.</strong> Kebanyakan perusahaan hanya melaporkan <em>financial materiality</em> dan mengabaikan <em>impact materiality</em>." },

  { ch: 12, q: "Kerangka pelaporan keberlanjutan yang berlaku bagi emiten dan perusahaan publik di Indonesia adalah…", opts: [
    "CSRD", "POJK 51/2017", "ISSB S1", "AA1000"
  ], a: 1, why: "<strong>POJK 51/2017</strong> mewajibkan laporan keberlanjutan bagi lembaga jasa keuangan, emiten, dan perusahaan publik di Indonesia — contoh lokal yang berguna untuk esai." },

  { ch: 12, q: "Tanda greenwashing yang paling sering terlewat oleh pembaca laporan adalah…", opts: [
    "tidak adanya foto berwarna hijau",
    "ketidaksesuaian antara komitmen publik perusahaan dan lobi kebijakan yang dijalankannya atau asosiasi industrinya",
    "laporan yang terlalu panjang",
    "penggunaan standar GRI"
  ], a: 1, why: "Perusahaan dapat menjanjikan target iklim sementara asosiasi industrinya menentang regulasi iklim. Bandingkan <strong>apa yang dikatakan</strong> dengan <strong>apa yang diperjuangkan</strong>." },

  { ch: 12, q: "Empat kapasitas manajer etis menurut penutup mata kuliah ini adalah…", opts: [
    "efisiensi, inovasi, kepemimpinan, komunikasi",
    "sensitivitas, penalaran, imajinasi moral, keberanian",
    "kepatuhan, pelaporan, audit, sertifikasi",
    "analisis, perencanaan, eksekusi, evaluasi"
  ], a: 1, why: "<strong>Sensitivitas</strong> (mengenali dimensi moral), <strong>penalaran</strong> (menganalisis dengan beberapa lensa), <strong>imajinasi moral</strong> (menemukan alternatif ketiga), <strong>keberanian</strong> (bertindak ketika ada biayanya)." }
];
