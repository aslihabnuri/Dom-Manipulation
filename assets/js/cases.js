/* ============================================================
   BEfS Study Hub — Pustaka Kasus Nyata
   Dua kasus per bab: satu internasional, satu Indonesia.
   Semuanya kasus yang benar-benar terjadi dan diliput media,
   sehingga bisa ditelusuri sendiri sebelum diskusi kelas.

   Catatan pemakaian: angka dan tanggal di bawah adalah yang
   dilaporkan media dan dokumen resmi pada saat kejadian.
   Selalu cek berita terbaru sebelum presentasi — beberapa
   kasus masih berjalan di pengadilan.

   Field `sources[].q` dipakai untuk membangun tautan pencarian
   berita, bukan tautan langsung, agar tetap berfungsi meski
   alamat artikel aslinya berubah.
   ============================================================ */

window.BEFS_CASES = [

/* ---------------- CM1 ---------------- */
{
  ch: 1, id: "vw-dieselgate", scope: "int", flag: "🌍",
  title: "Volkswagen “Dieselgate”",
  place: "Jerman · global", year: "2015–2017",
  hook: "Perusahaan menulis perangkat lunak khusus untuk mengelabui uji emisi — bukan karena tidak ada aturan, melainkan karena memilih mengakalinya.",
  facts: [
    "September 2015, badan lingkungan Amerika Serikat (EPA) mengumumkan bahwa VW memasang <em>defeat device</em>: perangkat lunak yang mengenali kondisi laboratorium dan menurunkan emisi hanya saat diuji.",
    "Di jalan raya, emisi NOx dilaporkan mencapai hingga sekitar 40 kali batas yang diizinkan di AS.",
    "Sekitar <strong>11 juta kendaraan</strong> di seluruh dunia terdampak.",
    "CEO Martin Winterkorn mundur beberapa hari setelah skandal terbuka; sejumlah eksekutif kemudian diproses hukum.",
    "Total biaya bagi VW — denda, penarikan, ganti rugi, dan penyelesaian hukum — dilaporkan melampaui <strong>EUR 30 miliar</strong>."
  ],
  link: "Ini contoh paling tajam bahwa masalah etika bisnis bukan ketiadaan aturan. Aturannya jelas, VW tahu persis batasnya, lalu merekayasa cara melewatinya. Sekaligus menunjukkan tiga hal di CM1: kekuatan bisnis lintas negara, kerugian luas dari malpraktik (kesehatan publik, kepercayaan industri, nilai saham), dan bahwa “ethics pays” juga berlaku terbalik.",
  questions: [
    "Apakah ini kegagalan individu insinyur, atau kegagalan perusahaan sebagai entitas? Siapa yang seharusnya bertanggung jawab?",
    "VW tidak melanggar hukum di semua yurisdiksi dengan tingkat yang sama. Apakah itu mengubah penilaian etismu?",
    "Kalau kamu insinyur yang diminta menulis kode itu, di tahap mana kamu akan berhenti — dan apa yang membuatmu sulit berhenti?"
  ],
  sources: [
    { outlet: "BBC News", desc: "Ringkasan kronologi skandal", q: "BBC Volkswagen emissions scandal explained" },
    { outlet: "Reuters", desc: "Rincian biaya dan proses hukum", q: "Reuters Volkswagen dieselgate cost 30 billion euros" },
    { outlet: "US EPA", desc: "Notice of Violation resmi, 18 September 2015", q: "EPA notice of violation Volkswagen defeat device 2015" }
  ]
},
{
  ch: 1, id: "karhutla-2015", scope: "id", flag: "🇮🇩",
  title: "Kebakaran hutan dan kabut asap 2015",
  place: "Sumatra &amp; Kalimantan", year: "2015",
  hook: "Keuntungan ekonomi satu sektor dibayar oleh kesehatan jutaan orang di tiga negara — triple bottom line yang benar-benar bertabrakan.",
  facts: [
    "Kebakaran lahan dan gambut membakar sekitar <strong>2,6 juta hektare</strong> lahan di Indonesia sepanjang 2015.",
    "Bank Dunia memperkirakan kerugian ekonomi Indonesia akibat kebakaran tahun itu sekitar <strong>USD 16 miliar</strong> — jauh melampaui nilai ekspor sektor terkait pada periode yang sama.",
    "Kabut asap melintasi batas negara ke Singapura dan Malaysia, memicu ketegangan diplomatik dan penutupan sekolah.",
    "Ratusan ribu orang mengalami infeksi saluran pernapasan akut; sejumlah studi memperkirakan dampak kematian dini yang signifikan di kawasan.",
    "Pemerintah dan KLHK menggugat sejumlah korporasi; beberapa putusan perdata mewajibkan ganti rugi dan pemulihan lingkungan."
  ],
  link: "Kasus ini memperlihatkan <strong>triple bottom line</strong> bukan sebagai penjumlahan yang rapi. Pilar ekonomi (devisa, lapangan kerja) naik sementara pilar lingkungan dan sosial ditekan. Sekaligus contoh sempurna <em>accountability gap</em> lintas batas: asap menyeberang, tetapi yurisdiksi hukum tidak.",
  questions: [
    "Siapa yang menanggung biaya, dan apakah mereka ikut dalam pengambilan keputusan? Uji dengan keadilan intra-generasi.",
    "Perusahaan sering berargumen kebakaran terjadi di lahan masyarakat, bukan konsesinya. Sejauh mana argumen “bukan lahan kami” dapat diterima secara etis?",
    "Apa kewajiban etis pembeli internasional (produsen makanan, kosmetik) yang membeli dari rantai pasok ini?"
  ],
  sources: [
    { outlet: "Bank Dunia", desc: "Laporan kerugian ekonomi kebakaran 2015", q: "World Bank Indonesia forest fire 2015 cost 16 billion" },
    { outlet: "BBC / Reuters", desc: "Liputan kabut asap lintas batas", q: "Indonesia haze 2015 Singapore Malaysia BBC" },
    { outlet: "Mongabay / Tempo", desc: "Gugatan KLHK terhadap korporasi", q: "gugatan KLHK perusahaan pembakaran hutan 2015 Tempo" }
  ]
},

/* ---------------- CM2 ---------------- */
{
  ch: 2, id: "nike-supply", scope: "int", flag: "🌍",
  title: "Nike dan kondisi kerja pemasok",
  place: "AS · Asia", year: "1990-an–kini",
  hook: "Kasus paling klasik tentang batas tanggung jawab perusahaan: “pabrik itu bukan milik kami” ternyata bukan jawaban yang bisa dipertahankan.",
  facts: [
    "Awal 1990-an Nike menghadapi tuduhan upah rendah, jam kerja berlebih, dan pekerja anak di pabrik pemasoknya di Asia.",
    "Foto majalah <em>Life</em> tahun 1996 yang menampilkan seorang anak Pakistan menjahit bola sepak berlogo Nike memicu kemarahan global.",
    "Respons awal Nike bersifat menyangkal: pabrik itu dimiliki kontraktor, bukan Nike.",
    "1998, CEO Phil Knight mengakui secara terbuka bahwa produk Nike “telah menjadi sinonim dengan upah budak, lembur paksa, dan pelecehan sewenang-wenang”.",
    "2005, Nike menjadi salah satu merek besar pertama yang <strong>mempublikasikan daftar pabrik pemasoknya</strong> — langkah yang saat itu belum lazim di industri."
  ],
  link: "Ini ilustrasi hidup untuk tahapan <strong>Zadek</strong>: defensive → compliance → managerial → strategic → civil. Sekaligus membuktikan tesis CM2 bahwa batas tanggung jawab perusahaan tidak ditentukan kepemilikan hukum, melainkan <strong>ekspektasi stakeholder</strong> — dan ekspektasi itu bergerak.",
  questions: [
    "Petakan stakeholder Nike pada 1996 memakai model salience. Siapa yang berubah dari <em>latent</em> menjadi <em>definitive</em>, dan mengapa?",
    "Apakah perubahan Nike didorong etika atau tekanan pasar? Apakah bedanya penting?",
    "Bandingkan dengan merek fast fashion hari ini — apakah pelajarannya sudah diserap industri?"
  ],
  sources: [
    { outlet: "The New York Times", desc: "Pidato Phil Knight 1998", q: "Phil Knight 1998 speech Nike slave wages New York Times" },
    { outlet: "Life Magazine (1996)", desc: "Foto pekerja anak menjahit bola", q: "Life magazine 1996 Nike child labour soccer ball Pakistan" },
    { outlet: "Harvard Business Review", desc: "Analisis transformasi rantai pasok Nike", q: "Nike supply chain transparency case study HBR" }
  ]
},
{
  ch: 2, id: "freeport", scope: "id", flag: "🇮🇩",
  title: "Freeport Indonesia dan tambang Grasberg",
  place: "Papua", year: "1967–kini",
  hook: "Satu perusahaan berhadapan dengan pemerintah pusat, masyarakat adat, lingkungan, dan pemegang saham asing — dengan klaim yang semuanya terdengar sah.",
  facts: [
    "Grasberg di Papua termasuk tambang tembaga dan emas terbesar di dunia; kontrak karya pertama ditandatangani 1967.",
    "Masyarakat adat <strong>Amungme</strong> dan <strong>Kamoro</strong> menuntut pengakuan atas tanah ulayat, pembagian manfaat, dan dampak lingkungan.",
    "Pembuangan tailing ke sistem sungai menjadi sengketa lingkungan berkepanjangan dengan pemerintah dan organisasi masyarakat sipil.",
    "2018, holding BUMN tambang <strong>Inalum</strong> mengambil alih 51,2% saham PT Freeport Indonesia dengan nilai transaksi sekitar <strong>USD 3,85 miliar</strong>.",
    "Isu keamanan, kehadiran aparat di area tambang, dan pembayaran kepada pihak keamanan berulang kali menjadi sorotan media internasional."
  ],
  link: "Kasus terbaik di Indonesia untuk <strong>stakeholder theory</strong> dan <strong>extended corporate citizenship</strong>. Di wilayah yang layanan negaranya terbatas, perusahaan menjadi penyedia hak sosial — sekolah, rumah sakit, jalan — sekaligus aktor yang keputusannya memengaruhi hak sipil dan politik warga.",
  questions: [
    "Buat peta stakeholder lengkap dengan atribut power, legitimacy, dan urgency. Klaim siapa yang paling sah tetapi paling lemah kekuatannya?",
    "Ketika perusahaan menyediakan layanan yang seharusnya disediakan negara, apa yang terjadi pada akuntabilitas demokratis?",
    "Apakah pengalihan mayoritas saham ke BUMN menyelesaikan persoalan etisnya, atau hanya memindahkan pihak yang harus menjawabnya?"
  ],
  sources: [
    { outlet: "Reuters", desc: "Divestasi 51,2% saham ke Inalum, 2018", q: "Reuters Inalum Freeport Indonesia 51 percent 3.85 billion" },
    { outlet: "The New York Times", desc: "Investigasi dampak lingkungan dan sosial Grasberg", q: "New York Times Freeport Grasberg Indonesia investigation" },
    { outlet: "Tempo / Kompas", desc: "Konflik masyarakat adat Amungme dan Kamoro", q: "Tempo Freeport Amungme Kamoro hak ulayat" }
  ]
},

/* ---------------- CM3 ---------------- */
{
  ch: 3, id: "ford-pinto", scope: "int", flag: "🌍",
  title: "Ford Pinto dan harga sebuah nyawa",
  place: "Amerika Serikat", year: "1970-an",
  hook: "Perusahaan benar-benar menghitung berapa nilai uang sebuah nyawa, lalu menyimpulkan bahwa memperbaiki mobilnya tidak sepadan.",
  facts: [
    "Ford mengetahui desain tangki bahan bakar Pinto berisiko terbakar pada tabrakan dari belakang.",
    "Perkiraan biaya perbaikan pada dokumen internal sekitar <strong>USD 11 per kendaraan</strong>.",
    "Analisis biaya-manfaat internal (dikenal sebagai memo Grush-Saunby) memberi nilai moneter pada kematian dan luka bakar, lalu membandingkannya dengan biaya perbaikan seluruh armada.",
    "Karena biaya perbaikan dinilai lebih besar daripada perkiraan biaya tuntutan hukum, perbaikan tidak dilakukan.",
    "Dalam perkara <em>Grimshaw v. Ford Motor Co.</em>, juri menjatuhkan ganti rugi punitif yang sangat besar; kasus ini menjadi bahan ajar etika bisnis hingga kini."
  ],
  link: "Kasus wajib untuk menguji <strong>utilitarianism</strong> dan menemukan batasnya. Perhitungan Ford secara teknis adalah <em>act utilitarianism</em> yang dijalankan konsisten — dan justru itu masalahnya. Bandingkan dengan <em>ethics of rights</em>: korban punya hak atas keselamatan yang tidak boleh diperdagangkan, berapa pun angkanya.",
  questions: [
    "Apakah analisis biaya-manfaat atas keselamatan selalu tidak etis, atau ada cara melakukannya yang dapat dibenarkan?",
    "Terapkan maksim Kant 2. Apakah pembeli Pinto diperlakukan semata sebagai sarana?",
    "Regulator hari ini tetap memakai nilai statistik nyawa (<em>value of statistical life</em>) untuk menyusun aturan. Apa bedanya dengan yang dilakukan Ford?"
  ],
  sources: [
    { outlet: "Mother Jones (1977)", desc: "Artikel investigasi “Pinto Madness”", q: "Mother Jones Pinto Madness 1977 Dowie" },
    { outlet: "Grimshaw v. Ford Motor Co.", desc: "Putusan pengadilan California", q: "Grimshaw v Ford Motor Co 1981 punitive damages Pinto" },
    { outlet: "Time / BBC", desc: "Retrospektif kasus Pinto", q: "Ford Pinto fuel tank scandal retrospective BBC" }
  ]
},
{
  ch: 3, id: "vaksin-palsu", scope: "id", flag: "🇮🇩",
  title: "Peredaran vaksin palsu",
  place: "Jabodetabek dan sekitarnya", year: "2016",
  hook: "Sindikat memalsukan vaksin anak selama bertahun-tahun; korbannya bayi yang orang tuanya percaya sudah melindungi mereka.",
  facts: [
    "Juni 2016, Bareskrim Polri membongkar sindikat produksi dan peredaran vaksin palsu yang diduga beroperasi sejak sekitar 2003.",
    "Vaksin dibuat dari cairan infus dan bahan lain, dikemas ulang menyerupai produk asli, lalu dijual ke klinik dan rumah sakit.",
    "Kementerian Kesehatan mengumumkan daftar belasan rumah sakit yang menerima vaksin dari jalur tidak resmi, memicu kemarahan publik dan aksi orang tua.",
    "Sejumlah pelaku — produsen, distributor, hingga tenaga medis — dijatuhi hukuman pidana.",
    "Pemerintah kemudian melakukan vaksinasi ulang bagi anak-anak yang terdampak."
  ],
  link: "Kasus ideal untuk membandingkan beberapa lensa sekaligus. <strong>Utilitarianism</strong>: kerugian total jelas besar. <strong>Kant maksim 2</strong>: bayi dan orang tua diperlakukan semata sebagai sarana memperoleh laba. <strong>Ethics of rights</strong>: hak atas keselamatan dan hak atas informasi dilanggar bersamaan. <strong>Virtue ethics</strong>: karakter macam apa yang memungkinkan seseorang melakukannya bertahun-tahun?",
  questions: [
    "Rumah sakit yang membeli dari jalur tidak resmi berdalih tidak tahu. Sejauh mana ketidaktahuan menghapus tanggung jawab moral?",
    "Terapkan <em>moral intensity</em> Jones. Komponen mana yang sangat tinggi di kasus ini, dan apa artinya bagi kemarahan publik yang terjadi?",
    "Apa kewajiban etis produsen vaksin asli dan distributor resmi dalam mencegah pemalsuan di rantai distribusinya?"
  ],
  sources: [
    { outlet: "Tempo", desc: "Liputan pembongkaran sindikat vaksin palsu", q: "Tempo vaksin palsu 2016 Bareskrim sindikat" },
    { outlet: "BBC Indonesia", desc: "Daftar rumah sakit dan reaksi publik", q: "BBC Indonesia vaksin palsu 2016 rumah sakit" },
    { outlet: "Kompas / CNN Indonesia", desc: "Putusan pengadilan dan vaksinasi ulang", q: "vonis kasus vaksin palsu vaksinasi ulang Kompas" }
  ]
},

/* ---------------- CM4 ---------------- */
{
  ch: 4, id: "wells-fargo", scope: "int", flag: "🌍",
  title: "Wells Fargo dan jutaan rekening fiktif",
  place: "Amerika Serikat", year: "2016",
  hook: "Ribuan karyawan membuka rekening palsu atas nama nasabah — bukan karena mereka jahat, melainkan karena sistem imbalannya menuntut demikian.",
  facts: [
    "September 2016, regulator perlindungan konsumen AS (CFPB) mendenda Wells Fargo <strong>USD 185 juta</strong>.",
    "Karyawan membuka rekening dan kartu kredit atas nama nasabah <strong>tanpa izin</strong> untuk memenuhi target penjualan silang; jumlahnya kemudian direvisi naik hingga sekitar 3,5 juta rekening.",
    "Budaya target dirangkum slogan internal “Eight is Great” — delapan produk per nasabah.",
    "Sekitar <strong>5.300 karyawan</strong> dipecat, sementara pertanyaan publik justru mengarah pada manajemen yang menetapkan targetnya.",
    "CEO John Stumpf mundur Oktober 2016; sebagian kompensasinya ditarik kembali (<em>clawback</em>), dan ia kemudian dilarang bekerja di industri perbankan."
  ],
  link: "Kasus terbaik untuk membuktikan tesis inti CM4: <strong>faktor situasional lebih kuat memprediksi perilaku daripada karakter individu</strong>. Semua faktor konteks hadir sekaligus — <em>systems of reward</em>, <em>authority</em>, <em>organizational culture</em>, dan <em>work roles</em>. Memecat 5.300 orang tanpa mengubah sistem imbalannya adalah salah diagnosis.",
  questions: [
    "Diagnosis dengan model empat tahap: di tahap mana rantai keputusan karyawan putus, dan mengapa?",
    "Apakah adil memecat 5.300 karyawan sementara perancang sistem targetnya bertahan lebih lama? Terapkan ethics of justice.",
    "Nilai kepemimpinan Stumpf dengan matriks moral person × moral manager. Di kuadran mana ia berada, dan apa buktinya?"
  ],
  sources: [
    { outlet: "CFPB", desc: "Siaran resmi denda USD 185 juta", q: "CFPB Wells Fargo 185 million unauthorized accounts 2016" },
    { outlet: "The New York Times", desc: "Investigasi budaya target penjualan", q: "New York Times Wells Fargo sales culture fake accounts" },
    { outlet: "Reuters", desc: "Pengunduran diri dan clawback Stumpf", q: "Reuters John Stumpf resign clawback Wells Fargo" }
  ]
},
{
  ch: 4, id: "jiwasraya", scope: "id", flag: "🇮🇩",
  title: "Gagal bayar Jiwasraya",
  place: "Indonesia", year: "2018–2021",
  hook: "Asuransi milik negara menjanjikan imbal hasil tinggi, lalu gagal membayar ratusan ribu pemegang polis — banyak di antaranya pensiunan.",
  facts: [
    "PT Asuransi Jiwasraya (Persero) memasarkan produk <em>JS Saving Plan</em> dengan imbal hasil di atas pasar.",
    "Oktober 2018 perusahaan mengumumkan tidak mampu membayar klaim jatuh tempo; ratusan ribu pemegang polis terdampak.",
    "BPK memperkirakan kerugian negara sekitar <strong>Rp16,8 triliun</strong>, sebagian besar terkait penempatan dana pada saham dan reksa dana berkualitas rendah.",
    "Kejaksaan Agung menetapkan sejumlah tersangka, termasuk eks-direksi dan pengusaha pasar modal.",
    "Benny Tjokrosaputro dan Heru Hidayat dijatuhi hukuman penjara seumur hidup; sejumlah manajer investasi juga diproses."
  ],
  link: "Contoh Indonesia paling kuat untuk faktor konteks CM4 dan kegagalan <strong>ethical leadership</strong>. Tekanan menunjukkan imbal hasil tinggi mendorong keputusan investasi berisiko; korbannya tersebar dan tidak berdaya — <em>proximity</em> dan <em>concentration of effect</em> yang rendah membuat isu ini lama tidak terasa sebagai persoalan moral oleh para pengambil keputusan.",
  questions: [
    "Terapkan enam komponen moral intensity. Mengapa isu ini bisa berjalan bertahun-tahun tanpa dihentikan dari dalam?",
    "Di mana peran pengawas — komisaris, OJK, auditor? Hubungkan dengan agency problem di CM6.",
    "Apa yang seharusnya dilakukan seorang manajer menengah yang melihat penempatan dana bermasalah? Uji dengan kriteria whistleblowing CM5."
  ],
  sources: [
    { outlet: "BPK RI", desc: "Hasil pemeriksaan kerugian negara", q: "BPK kerugian negara Jiwasraya 16,8 triliun" },
    { outlet: "Reuters / Bloomberg", desc: "Liputan internasional gagal bayar", q: "Reuters Jiwasraya Indonesia insurance scandal" },
    { outlet: "Tempo / Katadata", desc: "Kronologi dan vonis pengadilan", q: "Tempo kronologi kasus Jiwasraya vonis Benny Tjokro" }
  ]
},

/* ---------------- CM5 ---------------- */
{
  ch: 5, id: "enron", scope: "int", flag: "🌍",
  title: "Enron dan memo Sherron Watkins",
  place: "Amerika Serikat", year: "2001",
  hook: "Perusahaan dengan kode etik 64 halaman dan penghargaan inovasi runtuh dalam hitungan bulan — peringatan datang dari dalam, dan diabaikan.",
  facts: [
    "Enron memiliki <strong>kode etik setebal 64 halaman</strong> dan berulang kali masuk daftar perusahaan paling inovatif.",
    "Agustus 2001, Wakil Presiden Sherron Watkins mengirim memo kepada CEO Kenneth Lay yang memperingatkan perusahaan bisa “runtuh dalam gelombang skandal akuntansi”.",
    "Ia menempuh <strong>saluran internal lebih dulu</strong> — memenuhi kriteria whistleblowing yang dapat dibenarkan.",
    "Peringatan itu tidak ditindaklanjuti secara memadai; Enron mengajukan kebangkrutan Desember 2001.",
    "Kantor akuntan Arthur Andersen ikut runtuh; skandal ini melahirkan <strong>Sarbanes-Oxley Act 2002</strong>."
  ],
  link: "Bukti paling telak bahwa <strong>keberadaan kode etik tidak menjamin apa pun</strong>. Yang menentukan adalah budaya, sistem imbalan, dan penegakan — termasuk pada eksekutif senior. Kegagalannya bukan pada whistleblower, melainkan pada organisasi yang tidak punya mekanisme untuk <em>mendengar</em>.",
  questions: [
    "Uji memo Watkins dengan lima kriteria De George. Apakah semuanya terpenuhi?",
    "Apa yang membuat kode etik Enron menjadi dokumen mati? Bandingkan dengan faktor efektivitas kode etik di CM5.",
    "Rancang mekanisme pelaporan yang akan membuat peringatan seperti itu tidak bisa diabaikan. Siapa yang harus menerimanya?"
  ],
  sources: [
    { outlet: "Time", desc: "Watkins sebagai Person of the Year 2002 (whistleblower)", q: "Time Person of the Year 2002 whistleblowers Sherron Watkins" },
    { outlet: "The Guardian / BBC", desc: "Kronologi keruntuhan Enron", q: "BBC Enron collapse timeline explained" },
    { outlet: "Dokumenter", desc: "“The Smartest Guys in the Room” (2005)", q: "Enron The Smartest Guys in the Room documentary" }
  ]
},
{
  ch: 5, id: "snp-finance", scope: "id", flag: "🇮🇩",
  title: "SNP Finance dan sanksi bagi auditornya",
  place: "Indonesia", year: "2018",
  hook: "Laporan keuangan yang direkayasa lolos audit bertahun-tahun — dan untuk pertama kalinya kantor akuntan besar di Indonesia dijatuhi sanksi berat.",
  facts: [
    "PT Sunprima Nusantara Pembiayaan (SNP Finance), perusahaan pembiayaan grup Columbia, gagal bayar surat utang jangka menengah (MTN) dan kredit perbankan pada 2018.",
    "Ditemukan dugaan <strong>piutang fiktif</strong> yang dipakai sebagai dasar memperoleh pembiayaan dari sejumlah bank.",
    "OJK mencabut izin usaha SNP Finance.",
    "Pusat Pembinaan Profesi Keuangan (PPPK) Kementerian Keuangan menjatuhkan <strong>sanksi pembatasan izin</strong> kepada akuntan publik yang mengaudit SNP Finance dari KAP Satrio Bing Eny &amp; Rekan (afiliasi Deloitte Indonesia).",
    "Kasus ini menjadi salah satu rujukan utama pembahasan independensi auditor di Indonesia."
  ],
  link: "Kasus lokal terbaik untuk membahas <strong>social auditing, assurance, dan independensi</strong>. Verifikasi pihak ketiga hanya bernilai bila auditornya benar-benar independen dan skeptis. Hubungkan dengan kriteria kualitas laporan di CM5: tanpa asurans yang kredibel, angka apa pun hanyalah klaim sepihak.",
  questions: [
    "Apa yang membuat auditor kehilangan skeptisisme? Identifikasi faktor situasional dari CM4 yang bekerja di sini.",
    "Bandingkan dengan Enron–Arthur Andersen. Apa pola yang berulang, dan apa yang berbeda dalam responsnya?",
    "Apakah sanksi terhadap akuntan individual cukup, atau sistem imbalan kantor akuntan yang perlu diubah?"
  ],
  sources: [
    { outlet: "OJK", desc: "Pencabutan izin usaha SNP Finance", q: "OJK cabut izin usaha SNP Finance 2018" },
    { outlet: "Kementerian Keuangan (PPPK)", desc: "Sanksi terhadap akuntan publik", q: "Kemenkeu sanksi akuntan publik Deloitte SNP Finance" },
    { outlet: "Katadata / Bisnis Indonesia", desc: "Kronologi gagal bayar dan piutang fiktif", q: "Katadata kronologi SNP Finance piutang fiktif MTN" }
  ]
},

/* ---------------- CM6 ---------------- */
{
  ch: 6, id: "wirecard", scope: "int", flag: "🌍",
  title: "Wirecard: EUR 1,9 miliar yang tidak pernah ada",
  place: "Jerman", year: "2020",
  hook: "Perusahaan yang masuk indeks saham utama Jerman ternyata melaporkan uang yang tidak pernah ada — dan jurnalis yang membongkarnya sempat diselidiki polisi.",
  facts: [
    "Juni 2020, Wirecard mengakui bahwa saldo sekitar <strong>EUR 1,9 miliar</strong> yang tercatat di rekening perwalian “kemungkinan besar tidak ada”.",
    "Perusahaan ini merupakan anggota indeks <strong>DAX</strong> — jajaran korporasi terbesar Jerman — dan sempat bernilai lebih dari EUR 20 miliar.",
    "Jurnalis <em>Financial Times</em> Dan McCrum melaporkan kejanggalan selama bertahun-tahun; alih-alih diperiksa, regulator Jerman BaFin sempat melarang short-selling saham Wirecard dan menyelidiki para jurnalis.",
    "CEO Markus Braun ditangkap; COO Jan Marsalek melarikan diri dan menjadi buronan.",
    "Peran auditor EY menjadi sorotan; kasus ini memicu reformasi pengawasan pasar modal dan audit di Jerman."
  ],
  link: "Kasus lengkap untuk CM6: <strong>agency problem</strong> (manajemen tahu jauh lebih banyak daripada pemilik), kegagalan <strong>corporate governance</strong> dan dewan pengawas, serta <em>regulatory capture</em> ketika pengawas justru melindungi pihak yang diawasinya. Sekaligus contoh bahwa pasar modal bisa salah harga selama bertahun-tahun.",
  questions: [
    "Sistem governance Jerman memakai dewan dua tingkat. Mengapa dewan pengawas tetap gagal? Apakah masalahnya struktur atau budaya?",
    "Apa kewajiban etis regulator terhadap jurnalis dan short-seller yang mengangkat kejanggalan?",
    "Terapkan konsep asimetri informasi. Perlindungan apa yang seharusnya dimiliki pemegang saham ritel?"
  ],
  sources: [
    { outlet: "Financial Times", desc: "Investigasi Dan McCrum, “House of Wirecard”", q: "Financial Times Wirecard investigation Dan McCrum" },
    { outlet: "BBC / Reuters", desc: "Runtuhnya Wirecard dan penangkapan Braun", q: "BBC Wirecard collapse 1.9 billion missing Markus Braun" },
    { outlet: "Buku / film", desc: "“Money Men” (McCrum) dan dokumenter Netflix", q: "Money Men Dan McCrum Wirecard book Netflix documentary" }
  ]
},
{
  ch: 6, id: "garuda-2018", scope: "id", flag: "🇮🇩",
  title: "Laporan keuangan Garuda Indonesia 2018",
  place: "Indonesia", year: "2019",
  hook: "Kerugian berubah menjadi laba lewat satu pengakuan pendapatan — dua komisaris menolak menandatangani, dan kasusnya terbuka.",
  facts: [
    "Garuda Indonesia melaporkan <strong>laba bersih</strong> untuk tahun buku 2018, berbalik dari kerugian tahun sebelumnya.",
    "Laba itu bergantung pada pengakuan pendapatan dari perjanjian dengan PT Mahata Aero Teknologi senilai sekitar <strong>USD 239,94 juta</strong>, meski uangnya belum diterima.",
    "Dua komisaris <strong>menolak menandatangani</strong> laporan keuangan tersebut dan menyampaikan keberatan secara terbuka — pemicu utama terbukanya kasus ini.",
    "OJK menyatakan laporan keuangan tidak sesuai standar akuntansi, menjatuhkan denda kepada perusahaan dan jajaran direksi, serta memerintahkan penyajian ulang.",
    "Kementerian Keuangan membekukan izin akuntan publik yang mengaudit laporan tersebut selama 12 bulan."
  ],
  link: "Contoh Indonesia paling jelas untuk <strong>creative accounting</strong> — praktik yang memanfaatkan celah standar untuk menyajikan gambaran menyesatkan. Sekaligus kasus langka di mana mekanisme governance <em>bekerja</em>: keberatan komisaris menjadi bentuk whistleblowing di tingkat dewan.",
  questions: [
    "Apakah tindakan dua komisaris itu whistleblowing? Uji dengan kriteria De George di CM5.",
    "Di mana batas antara pilihan kebijakan akuntansi yang sah dan penyajian yang menyesatkan?",
    "Siapa saja yang dirugikan — sebutkan konkret, termasuk pihak yang tidak terlihat di laporan keuangan."
  ],
  sources: [
    { outlet: "OJK", desc: "Sanksi atas laporan keuangan Garuda 2018", q: "OJK sanksi laporan keuangan Garuda Indonesia 2018 Mahata" },
    { outlet: "Reuters", desc: "Liputan internasional penyajian ulang", q: "Reuters Garuda Indonesia restate 2018 accounts fined" },
    { outlet: "Katadata / Tempo", desc: "Kronologi penolakan dua komisaris", q: "Katadata kronologi dua komisaris tolak laporan keuangan Garuda" }
  ]
},

/* ---------------- CM7 ---------------- */
{
  ch: 7, id: "rana-plaza", scope: "int", flag: "🌍",
  title: "Runtuhnya Rana Plaza",
  place: "Savar, Bangladesh", year: "24 April 2013",
  hook: "Retakan sudah terlihat sehari sebelumnya. Bank dan toko di lantai bawah tutup; para penjahit tetap diperintahkan masuk.",
  facts: [
    "Gedung delapan lantai berisi beberapa pabrik garmen runtuh, menewaskan <strong>1.134 orang</strong> dan melukai ribuan lainnya.",
    "Retakan struktural ditemukan sehari sebelumnya; bank dan pertokoan di lantai bawah diliburkan, tetapi pekerja garmen tetap diminta bekerja.",
    "Pabrik-pabrik di dalamnya memasok sejumlah merek pakaian global.",
    "Tragedi ini melahirkan <strong>Accord on Fire and Building Safety in Bangladesh</strong> — perjanjian <em>mengikat secara hukum</em> antara merek global dan serikat pekerja, berbeda dari kode etik sukarela yang lazim sebelumnya.",
    "Ribuan pabrik diinspeksi di bawah Accord, dan banyak perbaikan keselamatan diwajibkan."
  ],
  link: "Kasus penghubung antara CM7 (hak atas tempat kerja yang aman) dan CM9 (<strong>extended responsibility</strong>). Merek yang memesan tidak memiliki gedung itu — tetapi tekanan harga dan tenggat yang mereka terapkan ikut membentuk kondisi yang menyebabkan tragedi. Sekaligus bukti pergeseran dari kode sukarela ke komitmen yang dapat ditegakkan.",
  questions: [
    "Sejauh mana merek pemesan bertanggung jawab atas gedung yang bukan miliknya? Bangun argumenmu dengan dua teori berbeda.",
    "Mengapa audit sosial sebelum tragedi gagal menangkap risikonya? Apa keterbatasan audit terjadwal?",
    "Bandingkan kode etik sukarela dan perjanjian mengikat. Apa yang membuat yang kedua lebih efektif?"
  ],
  sources: [
    { outlet: "BBC News", desc: "Kronologi dan jumlah korban", q: "BBC Rana Plaza collapse 1134 killed Bangladesh" },
    { outlet: "The Guardian", desc: "Liputan lanjutan dan tanggung jawab merek", q: "Guardian Rana Plaza brands responsibility garment" },
    { outlet: "ILO / Accord", desc: "Dokumen Accord on Fire and Building Safety", q: "Accord on Fire and Building Safety in Bangladesh ILO" }
  ]
},
{
  ch: 7, id: "ojol", scope: "id", flag: "🇮🇩",
  title: "Status pengemudi ojek online: mitra atau pekerja?",
  place: "Indonesia", year: "2015–kini",
  hook: "Jutaan orang bekerja penuh waktu untuk sebuah platform, diatur algoritmanya, tetapi secara hukum bukan karyawannya.",
  facts: [
    "Pengemudi dan kurir aplikasi diklasifikasikan sebagai <strong>mitra</strong>, bukan pekerja, sehingga berada di luar jangkauan sebagian besar hak ketenagakerjaan.",
    "Akibatnya tidak ada jaminan upah minimum, cuti berbayar, pesangon, maupun THR sebagai hak normatif.",
    "Padahal tingkat kendali platform — penentuan tarif, alokasi order, sistem penilaian, sanksi suspend — menyerupai hubungan kerja.",
    "Perubahan skema tarif dan potongan aplikasi berulang kali memicu <strong>aksi unjuk rasa</strong> pengemudi di berbagai kota.",
    "Perdebatan mengenai THR dan perlindungan pekerja platform berulang muncul dalam pembahasan kebijakan nasional dan belum tuntas hingga kini."
  ],
  link: "Isu ketenagakerjaan paling relevan dan paling dekat dengan keseharian kelas. Menguji seluruh daftar hak karyawan di CM7 sekaligus: upah layak, jam kerja, kebebasan berserikat, <em>due process</em> (bagaimana melawan suspend algoritmik?), dan menyambung ke CM12 soal pengawasan algoritmik.",
  questions: [
    "Bila kendali platform menyerupai hubungan kerja, apakah label “mitra” dapat dibenarkan secara etis meski sah secara hukum? Ingat kuadran CM1.",
    "Bagaimana <em>due process</em> bekerja ketika keputusan suspend dibuat algoritma? Hubungkan dengan black box problem di CM12.",
    "Rancang skema yang adil bagi ketiga pihak: pengemudi, platform, dan konsumen. Apa yang harus dikorbankan masing-masing?"
  ],
  sources: [
    { outlet: "Reuters / Nikkei Asia", desc: "Liputan status pekerja gig di Asia Tenggara", q: "Reuters Indonesia gig workers ojol driver status protest" },
    { outlet: "Tempo / Katadata", desc: "Perdebatan THR dan perlindungan pekerja platform", q: "Katadata THR ojol status mitra pekerja platform" },
    { outlet: "ILO", desc: "Laporan kerja platform digital", q: "ILO world employment report platform work digital labour" }
  ]
},

/* ---------------- CM8 ---------------- */
{
  ch: 8, id: "737max", scope: "int", flag: "🌍",
  title: "Boeing 737 MAX: dua kecelakaan, 346 nyawa",
  place: "Indonesia · Ethiopia · AS", year: "2018–2019",
  hook: "Sistem yang bisa menekan hidung pesawat ke bawah bergantung pada satu sensor — dan pilot tidak diberi tahu sistem itu ada.",
  facts: [
    "29 Oktober 2018, <strong>Lion Air JT610</strong> jatuh di perairan Karawang; 189 orang meninggal.",
    "10 Maret 2019, <strong>Ethiopian Airlines ET302</strong> jatuh; 157 orang meninggal. Total korban kedua kecelakaan <strong>346 jiwa</strong>.",
    "Investigasi menyoroti sistem <strong>MCAS</strong> yang dapat menekan hidung pesawat ke bawah berdasarkan masukan satu sensor <em>angle of attack</em>, tanpa redundansi memadai.",
    "Keberadaan MCAS tidak dijelaskan memadai dalam manual maupun pelatihan pilot; pelatihan tambahan dihindari karena akan menaikkan biaya bagi maskapai.",
    "Seluruh armada 737 MAX dikandangkan secara global sejak Maret 2019; Januari 2021 Boeing menyepakati penyelesaian dengan Departemen Kehakiman AS senilai sekitar <strong>USD 2,5 miliar</strong>."
  ],
  link: "Kasus keselamatan produk paling penting dekade ini, dan sangat dekat dengan Indonesia. Uji dengan <strong>due care</strong>: apakah pengujian, pengungkapan, dan pelatihan sudah wajar? Sambungkan ke CM4 (tekanan biaya dan jadwal terhadap Airbus) dan CM11 (sertifikasi yang sebagian didelegasikan kepada produsen sendiri — <em>regulatory capture</em>).",
  questions: [
    "Terapkan tiga standar tanggung jawab produk: caveat emptor, due care, strict liability. Mana yang paling tepat, dan mengapa?",
    "Siapa konsumen di kasus ini — maskapai atau penumpang? Bagaimana itu mengubah analisis hak konsumen?",
    "Apa yang salah ketika regulator bergantung pada penilaian pihak yang diaturnya?"
  ],
  sources: [
    { outlet: "KNKT Indonesia", desc: "Laporan akhir investigasi Lion Air JT610", q: "KNKT final report Lion Air JT610 737 MAX MCAS" },
    { outlet: "The Seattle Times", desc: "Investigasi desain dan sertifikasi MCAS", q: "Seattle Times Boeing 737 MAX MCAS certification investigation" },
    { outlet: "US DOJ / BBC", desc: "Penyelesaian USD 2,5 miliar, Januari 2021", q: "DOJ Boeing 737 MAX 2.5 billion settlement January 2021" }
  ]
},
{
  ch: 8, id: "bpjs-data", scope: "id", flag: "🇮🇩",
  title: "Dugaan kebocoran data BPJS Kesehatan",
  place: "Indonesia", year: "2021",
  hook: "Data ratusan juta peserta diduga bocor dan diperjualbelikan — dan hampir tidak ada konsekuensi yang terasa bagi pengelolanya.",
  facts: [
    "Mei 2021, data yang diduga berasal dari BPJS Kesehatan — disebut mencakup sekitar <strong>279 juta</strong> catatan penduduk — ditemukan dijual di forum peretas.",
    "Data yang beredar dilaporkan memuat NIK, nama, alamat, nomor telepon, hingga informasi keluarga.",
    "Kominfo dan BSSN melakukan penelusuran; BPJS Kesehatan membentuk tim investigasi internal.",
    "Kejadian ini menjadi bagian dari rangkaian dugaan kebocoran data di berbagai lembaga di Indonesia pada periode tersebut.",
    "Kasus semacam ini mempercepat pengesahan <strong>UU No. 27/2022 tentang Perlindungan Data Pribadi</strong>."
  ],
  link: "Kasus privasi konsumen yang paling menyentuh mahasiswa secara langsung — kemungkinan besar data mereka sendiri termasuk di dalamnya. Menguji seluruh isu CM8: pengumpulan berlebihan, <em>consent</em> yang tidak bermakna (peserta tidak punya pilihan tidak mendaftar), dan penggunaan sekunder di luar kendali pemilik data.",
  questions: [
    "Ketika layanan bersifat wajib, apakah konsep <em>consent</em> masih punya makna? Apa implikasinya bagi kewajiban pengelola data?",
    "Bandingkan dengan Cambridge Analytica. Mana yang lebih berat secara etis, dan atas dasar apa kamu menilainya?",
    "Apa kewajiban etis organisasi setelah kebocoran terjadi — kepada siapa, seberapa cepat, dan seberapa terbuka?"
  ],
  sources: [
    { outlet: "BBC Indonesia / Reuters", desc: "Liputan dugaan kebocoran 279 juta data", q: "Reuters Indonesia BPJS data leak 279 million 2021" },
    { outlet: "Kominfo", desc: "Pernyataan resmi dan penelusuran", q: "Kominfo dugaan kebocoran data BPJS Kesehatan 2021" },
    { outlet: "Katadata / Tempo", desc: "Rangkaian kebocoran data dan lahirnya UU PDP", q: "Katadata kebocoran data Indonesia UU PDP 27 2022" }
  ]
},

/* ---------------- CM9 ---------------- */
{
  ch: 9, id: "rolls-royce", scope: "int", flag: "🌍",
  title: "Suap Rolls-Royce lintas negara",
  place: "Inggris · global (termasuk Indonesia)", year: "2017",
  hook: "Salah satu penyelesaian kasus suap terbesar di Inggris — dan salah satu jalur suapnya bermuara ke Indonesia.",
  facts: [
    "Januari 2017, Rolls-Royce menyepakati <em>Deferred Prosecution Agreement</em> dengan Serious Fraud Office Inggris; total penyelesaian dengan otoritas Inggris, AS, dan Brasil dilaporkan sekitar <strong>GBP 671 juta</strong>.",
    "Dokumen pengadilan memaparkan penggunaan perantara untuk memenangkan kontrak di berbagai negara selama bertahun-tahun.",
    "Salah satu bagian menyangkut pembelian mesin <strong>Trent 700</strong> oleh Garuda Indonesia, dengan perantara yang diidentifikasi terkait Tommy Suharto.",
    "KPK kemudian memproses eks-Direktur Utama Garuda <strong>Emirsyah Satar</strong>; ia dijatuhi hukuman pidana dalam perkara suap pengadaan pesawat dan mesin.",
    "Kasus ini menjadi contoh penegakan hukum antikorupsi <strong>ekstrateritorial</strong> — hukum Inggris menjangkau perbuatan di luar wilayahnya."
  ],
  link: "Kasus terbaik untuk CM9 karena menyatukan dua sisi sekaligus: penyuap (korporasi global) dan penerima (pejabat BUMN Indonesia). Menunjukkan cara kerja <strong>UK Bribery Act</strong> dan FCPA, sekaligus mengapa suap gagal uji universalisasi Kant — ia hanya berguna selama orang lain tidak melakukannya.",
  questions: [
    "Perantara sering dipakai agar perusahaan bisa berdalih tidak tahu. Apakah struktur semacam itu menghapus tanggung jawab moral?",
    "Terapkan lima uji kelayakan pemberian: nilai, waktu, transparansi, timbal balik, norma. Di titik mana ini jelas melewati batas?",
    "Apakah adil hukum satu negara menjangkau perbuatan di negara lain? Hubungkan dengan celah regulasi global di CM11."
  ],
  sources: [
    { outlet: "UK Serious Fraud Office", desc: "Siaran resmi DPA Rolls-Royce", q: "Serious Fraud Office Rolls-Royce deferred prosecution agreement 2017" },
    { outlet: "BBC / The Guardian", desc: "Rincian jalur suap termasuk Indonesia", q: "BBC Rolls-Royce bribery Indonesia Garuda Tommy Suharto" },
    { outlet: "KPK / Tempo", desc: "Proses hukum Emirsyah Satar", q: "KPK Emirsyah Satar suap pengadaan pesawat Garuda vonis" }
  ]
},
{
  ch: 9, id: "minyak-goreng", scope: "id", flag: "🇮🇩",
  title: "Krisis dan dugaan kartel minyak goreng",
  place: "Indonesia", year: "2021–2022",
  hook: "Negara produsen sawit terbesar dunia kehabisan minyak goreng — dan antrean panjang itu ternyata bukan sekadar soal pasokan.",
  facts: [
    "Akhir 2021 hingga 2022 terjadi kelangkaan dan lonjakan harga minyak goreng di seluruh Indonesia, memicu antrean panjang dan pembatasan pembelian.",
    "April 2022 pemerintah sempat menerapkan <strong>larangan ekspor</strong> minyak sawit mentah dan turunannya untuk mengamankan pasokan dalam negeri.",
    "Kejaksaan Agung menetapkan sejumlah tersangka dalam perkara pemberian persetujuan ekspor, termasuk <strong>pejabat Kementerian Perdagangan</strong> dan eksekutif dari beberapa grup usaha sawit besar.",
    "KPPU memeriksa dugaan <strong>kartel</strong> di antara produsen minyak goreng dan menjatuhkan putusan terhadap sejumlah perusahaan.",
    "Kasus ini menggabungkan dugaan perilaku antipersaingan dengan dugaan korupsi perizinan."
  ],
  link: "Kasus Indonesia paling kaya untuk CM9. Ia sekaligus menyentuh <strong>kartel dan penetapan harga</strong> (merugikan konsumen langsung), <strong>penyalahgunaan posisi dominan</strong>, dan <strong>state capture</strong> di CM11 — ketika kepentingan swasta membentuk keputusan perizinan negara.",
  questions: [
    "Mengapa kartel dianggap lebih merusak daripada persaingan yang keras? Jelaskan dengan utilitarianism dan ethics of justice.",
    "Siapa yang paling dirugikan oleh kenaikan harga bahan pokok? Terapkan difference principle Rawls.",
    "Apakah larangan ekspor merupakan respons kebijakan yang etis? Siapa yang menanggung biayanya — petani sawit, produsen, atau konsumen?"
  ],
  sources: [
    { outlet: "Reuters", desc: "Larangan ekspor sawit dan krisis minyak goreng", q: "Reuters Indonesia palm oil export ban 2022 cooking oil shortage" },
    { outlet: "KPPU", desc: "Putusan perkara dugaan kartel minyak goreng", q: "KPPU putusan kartel minyak goreng perkara" },
    { outlet: "Tempo / Katadata", desc: "Perkara korupsi izin ekspor", q: "Kejagung tersangka izin ekspor minyak goreng Kemendag Tempo" }
  ]
},

/* ---------------- CM10 ---------------- */
{
  ch: 10, id: "greenpeace-nestle", scope: "int", flag: "🌍",
  title: "Greenpeace vs Nestlé: kampanye KitKat",
  place: "Global · sawit Indonesia", year: "2010",
  hook: "Video 60 detik memaksa salah satu perusahaan makanan terbesar dunia mengubah kebijakan pembelian sawitnya.",
  facts: [
    "Maret 2010, Greenpeace merilis video parodi iklan KitKat yang mengaitkan sawit dalam produk Nestlé dengan perusakan habitat orangutan di Indonesia.",
    "Nestlé sempat meminta YouTube menurunkan video itu dan menghapus komentar kritis di media sosialnya — respons yang justru memperbesar kemarahan publik.",
    "Kampanye menyebar cepat; tekanan konsumen berlangsung berminggu-minggu di kanal media sosial Nestlé.",
    "Dalam hitungan bulan, Nestlé mengumumkan komitmen <strong>bebas deforestasi</strong> untuk rantai pasoknya dan bekerja sama dengan organisasi pemantau hutan untuk menelusuri pemasok.",
    "Pola kampanye ini kemudian ditiru untuk menekan banyak merek global lain."
  ],
  link: "Contoh paling jelas pergerakan dari <strong>confrontation ke collaboration</strong> di CM10. Sekaligus menunjukkan sumber kekuatan CSO: bukan <em>power</em> formal, melainkan <em>legitimacy</em> dan <em>urgency</em> yang diubah menjadi tekanan lewat konsumen dan media.",
  questions: [
    "Apakah taktik Greenpeace — memarodikan merek — dapat dibenarkan secara etis? Terapkan standar yang sama pada CSO dan perusahaan.",
    "Respons awal Nestlé memperburuk keadaan. Apa yang seharusnya dilakukan pada 48 jam pertama?",
    "Setelah kemitraan terbentuk, bagaimana memastikan CSO tidak mengalami <em>co-optation</em>?"
  ],
  sources: [
    { outlet: "The Guardian", desc: "Kronologi kampanye dan respons Nestlé", q: "Guardian Greenpeace Nestle KitKat palm oil campaign 2010" },
    { outlet: "Greenpeace", desc: "Kampanye asli dan tuntutannya", q: "Greenpeace Nestle KitKat orangutan campaign video" },
    { outlet: "Harvard Business Review", desc: "Analisis krisis media sosial", q: "Nestle social media crisis KitKat case study HBR" }
  ]
},
{
  ch: 10, id: "app-sinarmas", scope: "id", flag: "🇮🇩",
  title: "Greenpeace dan Asia Pulp &amp; Paper (Sinar Mas)",
  place: "Indonesia", year: "2010–2013 (dan tindak lanjutnya)",
  hook: "Setelah bertahun-tahun kampanye dan kehilangan pelanggan besar, salah satu produsen kertas terbesar dunia berbalik menjadi mitra organisasi yang menyerangnya.",
  facts: [
    "Greenpeace dan sejumlah organisasi menjalankan kampanye bertahun-tahun yang mengaitkan produk APP dengan perusakan hutan alam dan habitat harimau Sumatra.",
    "Sejumlah pembeli besar internasional menghentikan atau menangguhkan pembelian dari APP sebagai akibat kampanye tersebut.",
    "Februari 2013, APP mengumumkan <strong>Forest Conservation Policy</strong> — komitmen menghentikan pembukaan hutan alam di seluruh rantai pasoknya.",
    "Greenpeace menghentikan kampanyenya dan beralih memantau pelaksanaan komitmen itu.",
    "2018, Greenpeace mengakhiri kerja samanya setelah laporan investigatif mempersoalkan keterkaitan APP dengan perusahaan pemasok lain — contoh nyata risiko <em>co-optation</em> dan pentingnya verifikasi."
  ],
  link: "Kasus Indonesia yang memperlihatkan <strong>seluruh spektrum</strong> hubungan bisnis–CSO: konflik, kemitraan, lalu putus kembali. Justru bagian terakhirnya yang paling berharga untuk diskusi — kemitraan bukan akhir cerita, dan CSO perlu menjaga kemampuan menarik diri.",
  questions: [
    "Apa yang membuat kampanye ini berhasil padahal kampanye lain gagal? Identifikasi titik tekan yang paling menentukan.",
    "Ketika Greenpeace mengakhiri kerja sama pada 2018, apakah itu kegagalan kemitraan atau justru bukti kemitraan yang sehat?",
    "Bagaimana menilai kredibilitas komitmen keberlanjutan sebuah perusahaan? Susun daftar periksa berdasarkan CM5 dan CM12."
  ],
  sources: [
    { outlet: "Reuters / The Guardian", desc: "Pengumuman Forest Conservation Policy 2013", q: "Reuters Asia Pulp Paper forest conservation policy 2013 Greenpeace" },
    { outlet: "Greenpeace", desc: "Pernyataan mengakhiri kerja sama, 2018", q: "Greenpeace ends engagement Asia Pulp Paper 2018 statement" },
    { outlet: "Mongabay / Tempo", desc: "Investigasi keterkaitan pemasok", q: "Mongabay Asia Pulp Paper hidden supplier links investigation" }
  ]
},

/* ---------------- CM11 ---------------- */
{
  ch: 11, id: "apple-ireland", scope: "int", flag: "🌍",
  title: "Apple, Irlandia, dan pajak EUR 13 miliar",
  place: "Uni Eropa", year: "2016–2024",
  hook: "Sebuah negara berjuang di pengadilan agar tidak menerima pajak belasan miliar euro dari perusahaan paling bernilai di dunia.",
  facts: [
    "2016, Komisi Eropa menyimpulkan Irlandia memberi Apple keuntungan pajak yang dinilai sebagai bantuan negara terlarang, dan memerintahkan pemulihan sekitar <strong>EUR 13 miliar</strong>.",
    "Apple <em>dan pemerintah Irlandia</em> sama-sama mengajukan banding — Irlandia menolak menerima uang itu karena ingin mempertahankan daya tariknya bagi investasi asing.",
    "2020, Pengadilan Umum Uni Eropa membatalkan keputusan Komisi.",
    "September 2024, <strong>Court of Justice</strong> Uni Eropa membatalkan putusan itu dan menegaskan keputusan Komisi — Apple harus membayar sekitar EUR 13 miliar.",
    "Kasus ini menjadi rujukan utama perdebatan pajak korporasi global dan mendorong kesepakatan pajak minimum global OECD."
  ],
  link: "Kasus terbaik untuk <strong>celah regulasi global</strong>, <em>regulatory arbitrage</em>, dan <em>race to the bottom</em>. Perhatikan detail paling tajamnya: negara yang menolak menerima pajak. Itu memperlihatkan persis dinamika persaingan antarnegara menarik investasi yang dibahas CM11.",
  questions: [
    "Tax avoidance ini sah secara hukum. Susun argumen etis mengapa ia tetap dipersoalkan — pakai maksim Kant 1.",
    "Apakah Irlandia berbuat salah secara etis dengan menolak menerima pembayaran itu? Kepada siapa pemerintah bertanggung jawab?",
    "Apa relevansinya bagi Indonesia sebagai negara yang juga bersaing menarik investasi asing?"
  ],
  sources: [
    { outlet: "Komisi Eropa", desc: "Keputusan bantuan negara 2016", q: "European Commission Apple Ireland state aid 13 billion 2016" },
    { outlet: "BBC / Reuters", desc: "Putusan final Court of Justice, September 2024", q: "BBC Apple Ireland 13 billion tax court ruling September 2024" },
    { outlet: "Financial Times", desc: "Konteks pajak korporasi global", q: "Financial Times Apple Ireland tax global minimum tax OECD" }
  ]
},
{
  ch: 11, id: "e-ktp", scope: "id", flag: "🇮🇩",
  title: "Korupsi proyek e-KTP",
  place: "Indonesia", year: "2011–2018",
  hook: "Proyek identitas nasional dijadikan bancakan sejak tahap perencanaan anggaran — contoh paling telanjang tentang kepentingan swasta membentuk keputusan negara.",
  facts: [
    "Proyek kartu tanda penduduk elektronik bernilai sekitar <strong>Rp5,9 triliun</strong>.",
    "BPK dan KPK memperkirakan kerugian negara sekitar <strong>Rp2,3 triliun</strong>.",
    "Dakwaan memaparkan pembagian jatah yang disusun sejak tahap pembahasan anggaran, melibatkan pejabat kementerian, anggota DPR, dan konsorsium penyedia.",
    "Ketua DPR saat itu, <strong>Setya Novanto</strong>, divonis 15 tahun penjara pada April 2018.",
    "Puluhan pihak lain diproses; kasus ini menjadi salah satu perkara korupsi terbesar dalam sejarah KPK."
  ],
  link: "Ilustrasi paling jelas untuk <strong>state capture</strong> di CM11 — bukan sekadar suap satu transaksi, melainkan kepentingan swasta yang membentuk aturan dan anggaran negara secara sistematis. Sekaligus contoh kegagalan pengadaan publik sebagai instrumen kebijakan.",
  questions: [
    "Bedakan lobi yang sah, regulatory capture, dan state capture dengan merujuk fakta kasus ini.",
    "Apa kewajiban etis perusahaan yang diundang ikut tender ketika mengetahui prosesnya sudah diatur?",
    "Rancang mekanisme pengadaan yang membuat pola seperti ini jauh lebih sulit. Instrumen mana dari CM11 yang kamu pakai?"
  ],
  sources: [
    { outlet: "KPK", desc: "Kronologi perkara dan daftar terdakwa", q: "KPK kasus korupsi e-KTP kronologi kerugian negara 2,3 triliun" },
    { outlet: "BBC Indonesia / Tempo", desc: "Vonis Setya Novanto", q: "BBC Indonesia vonis Setya Novanto 15 tahun e-KTP" },
    { outlet: "Reuters", desc: "Liputan internasional skandal e-KTP", q: "Reuters Indonesia e-KTP corruption Setya Novanto sentenced" }
  ]
},

/* ---------------- CM12 ---------------- */
{
  ch: 12, id: "amazon-ai", scope: "int", flag: "🌍",
  title: "Alat rekrutmen AI Amazon yang bias gender",
  place: "Amerika Serikat", year: "2014–2018",
  hook: "Sistem dilatih dari sepuluh tahun lamaran kerja perusahaan sendiri — lalu belajar bahwa kandidat terbaik biasanya laki-laki.",
  facts: [
    "Amazon mengembangkan alat penyaring lamaran berbasis pembelajaran mesin sejak sekitar 2014.",
    "Model dilatih memakai data lamaran <strong>sepuluh tahun terakhir</strong>, yang didominasi pelamar laki-laki di posisi teknis.",
    "Sistem belajar menurunkan skor lamaran yang memuat kata “women’s” — misalnya “women’s chess club captain” — dan menurunkan peringkat lulusan dua kampus khusus perempuan.",
    "Upaya menetralkan istilah-istilah itu tidak menjamin model tidak menemukan proksi bias lain.",
    "Proyek dihentikan; Reuters memberitakannya pada Oktober 2018."
  ],
  link: "Kasus paling bersih untuk <strong>algorithmic bias</strong> di CM12 dan penghubung langsung ke diskriminasi di CM7. Yang penting: tidak ada seorang pun yang berniat mendiskriminasi. Biasnya diwarisi dari data historis — inilah sebabnya <em>fairness</em> harus diuji secara aktif, bukan diasumsikan dari niat baik.",
  questions: [
    "Jika tidak ada niat mendiskriminasi, siapa yang bertanggung jawab secara moral? Kaitkan dengan moral agency di CM2.",
    "Ini bentuk diskriminasi langsung atau tidak langsung menurut kerangka CM7? Jelaskan.",
    "Terapkan enam prinsip etika AI. Uji dan pengaman apa yang seharusnya ada sebelum sistem dipakai?"
  ],
  sources: [
    { outlet: "Reuters", desc: "Laporan eksklusif Jeffrey Dastin, Oktober 2018", q: "Reuters Amazon scraps AI recruiting tool bias against women 2018" },
    { outlet: "The Guardian / MIT Tech Review", desc: "Analisis bias algoritmik dalam rekrutmen", q: "MIT Technology Review algorithmic bias hiring Amazon" },
    { outlet: "EU AI Act", desc: "Klasifikasi rekrutmen sebagai sistem berisiko tinggi", q: "EU AI Act high risk employment recruitment systems" }
  ]
},
{
  ch: 12, id: "jetp", scope: "id", flag: "🇮🇩",
  title: "JETP: pendanaan transisi energi Indonesia",
  place: "Indonesia", year: "2022–kini",
  hook: "USD 20 miliar untuk mempercepat pensiun dini PLTU batu bara — dan pertanyaan yang belum terjawab: siapa yang menanggung biaya bagi pekerjanya?",
  facts: [
    "November 2022 di sela KTT G20 Bali, Indonesia dan sejumlah negara maju mengumumkan <strong>Just Energy Transition Partnership (JETP)</strong> senilai sekitar <strong>USD 20 miliar</strong>.",
    "Skema ini menargetkan percepatan puncak emisi sektor ketenagalistrikan dan peningkatan porsi energi terbarukan.",
    "Rencana investasi dan kebijakan komprehensif (CIPP) diterbitkan pada 2023.",
    "Perdebatan berlanjut soal komposisi pendanaan — berapa banyak berupa hibah dan berapa berupa <strong>pinjaman</strong> — serta kecepatan realisasinya.",
    "Isu <em>just transition</em> bagi pekerja tambang batu bara dan daerah penghasil menjadi salah satu titik paling sensitif."
  ],
  link: "Kasus penutup yang menyatukan hampir seluruh mata kuliah: <strong>sustainability</strong> (CM1), <strong>stakeholder</strong> (CM2), <strong>hak pekerja dan just transition</strong> (CM7), <strong>peran pemerintah dan tata kelola lintas negara</strong> (CM11), serta <strong>pelaporan dan kredibilitas komitmen iklim</strong> (CM12).",
  questions: [
    "Apa yang membuat sebuah transisi disebut “adil”? Siapa yang harus ikut memutuskan definisinya?",
    "Bila sebagian besar dana berupa pinjaman, siapa yang sesungguhnya menanggung biaya transisi? Terapkan keadilan antargenerasi.",
    "Apa kewajiban etis perusahaan energi dan sektor keuangan dalam skema ini? Uji komitmen mereka dengan daftar periksa greenwashing di CM12."
  ],
  sources: [
    { outlet: "Reuters / BBC", desc: "Pengumuman JETP di G20 Bali 2022", q: "Reuters Indonesia JETP 20 billion just energy transition partnership G20" },
    { outlet: "Sekretariat JETP Indonesia", desc: "Comprehensive Investment and Policy Plan", q: "JETP Indonesia comprehensive investment and policy plan CIPP" },
    { outlet: "Katadata / IESR", desc: "Kritik komposisi pendanaan dan just transition", q: "Katadata IESR kritik pendanaan JETP pinjaman just transition" }
  ]
}

];
