/* ============================================================
   Studi Kasus SM (MAN 5422): satu teaching case per bab.
   Termasuk kasus resmi yang ditugaskan silabus kepada tiap kelompok.
   Panduan analisis mengikuti metode empat komponen dosen:
   Problem, Alternatives, Issues, Conclusion.
   ============================================================ */
(function () {
  const C = window.MBA_COURSES.sm;
  const cases = [,
  {
    id: "sm3-bluebird",
    title: "Blue Bird dan Armada yang Tiba-Tiba Kelebihan",
    subtitle: "Memimpin proses perumusan dan eksekusi strategi ketika model lama berhenti bekerja",
    forSession: 3,
    readingTime: 7,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 2 tentang lima tahap proses manajemen strategik",
    decisionMaker: "Direksi dan dewan komisaris sebuah perusahaan taksi terbesar di Indonesia",
    decisionPoint: "Menetapkan visi dan arah strategis baru setelah kehadiran layanan transportasi berbasis aplikasi",
    relevance: "Kasus untuk lima tahap proses strategi, peran visi dan misi, serta peran dewan komisaris dalam mengawasi arah perusahaan.",
    sections: [
      { heading: "Merek yang Identik dengan Kategorinya",
        body: `<p>Selama puluhan tahun, satu nama menjadi sinonim taksi di Indonesia. Perusahaan ini dibangun di atas
kepercayaan: argometer yang jujur, pengemudi yang dilatih, dan pengembalian barang penumpang yang tertinggal
menjadi cerita yang beredar dari mulut ke mulut. Kepercayaan itu memungkinkan perusahaan menetapkan tarif premium
dan tetap menjadi pilihan pertama.</p>
<p>Model bisnisnya bertumpu pada kepemilikan armada. Perusahaan membeli kendaraan, mempekerjakan pengemudi,
membangun pul dan bengkel sendiri, serta mengelola seluruh rantai perawatan. Aset itu adalah sumber keunggulan
sekaligus komitmen jangka panjang.</p>
<p>Pada 2015 dan 2016, layanan transportasi berbasis aplikasi masuk dengan model yang berbeda secara mendasar:
tidak memiliki kendaraan, tidak mempekerjakan pengemudi, dan menawarkan tarif jauh lebih rendah yang disubsidi
pendanaan investor. Dalam waktu singkat, permintaan bergeser.</p>` },
      { heading: "Lima Tahap yang Diuji Sekaligus",
        body: `<p>Buku teks menggambarkan proses strategi dalam lima tahap: menyusun visi dan misi, menetapkan
sasaran, merumuskan strategi, mengeksekusinya, lalu memantau dan menyesuaikan. Perusahaan ini harus mengerjakan
kelimanya nyaris bersamaan dan dalam tekanan waktu.</p>
<p>Pada tahap <strong>visi</strong>, pertanyaannya mendasar. Apakah perusahaan ini perusahaan taksi, ataukah
perusahaan penyedia mobilitas? Jawaban atas pertanyaan itu menentukan segala hal berikutnya. Jika ia perusahaan
taksi, maka kompetisinya adalah mempertahankan pangsa taksi. Jika ia perusahaan mobilitas, maka armada, pengemudi
terlatih, dan izin operasi adalah aset yang dapat dipakai dengan cara lain.</p>
<p>Pada tahap <strong>eksekusi</strong>, hambatannya bukan gagasan melainkan struktur. Organisasi yang dibangun
untuk mengelola armada fisik memiliki kebiasaan, sistem imbalan, dan cara pengambilan keputusan yang berbeda dari
yang dituntut layanan berbasis aplikasi.</p>
<p>Dewan komisaris menghadapi pertanyaannya sendiri: seberapa jauh ia harus mendorong perubahan arah, dan seberapa
besar risiko yang boleh diambil manajemen atas aset pemegang saham.</p>` },
      { heading: "Langkah yang Diambil dan yang Masih Terbuka",
        body: `<p>Perusahaan meluncurkan aplikasi pemesanan sendiri, menyesuaikan tarif, menawarkan skema kemitraan
bagi pengemudi, dan kemudian menempuh jalan yang beberapa tahun sebelumnya sulit dibayangkan, yaitu bekerja sama
dengan platform yang sebelumnya menjadi pesaing sehingga armadanya dapat dipesan lewat aplikasi platform
tersebut.</p>
<p>Sebagian analis menilai langkah itu sebagai pengakuan realistis atas kekuatan jaringan platform. Sebagian lain
menilainya sebagai penyerahan hubungan dengan pelanggan kepada pihak lain, sesuatu yang dalam jangka panjang
mengurangi kendali perusahaan atas nasibnya sendiri.</p>
<p>Pertanyaan yang masih terbuka adalah apa yang menjadi sumber keunggulan perusahaan ini pada dekade
berikutnya.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Dua Model Bisnis yang Berhadapan",
        note: "Perhatikan bahwa perbedaannya bukan pada teknologi semata, melainkan pada struktur aset.",
        rows: [["Aspek", "Model taksi konvensional", "Model platform"],
               ["Kepemilikan kendaraan", "Perusahaan", "Pengemudi"],
               ["Status pengemudi", "Karyawan", "Mitra"],
               ["Struktur biaya tetap", "Tinggi", "Rendah"],
               ["Sumber kepercayaan", "Merek dan pelatihan", "Peringkat dan pelacakan"],
               ["Kecepatan menambah kapasitas", "Lambat", "Cepat"]] },
      { title: "Exhibit 2: Lima Tahap Proses Strategi pada Kasus Ini",
        note: "Isi kolom kanan sebagai latihan sebelum diskusi kelas.",
        rows: [["Tahap", "Pertanyaan kunci pada kasus ini"],
               ["Visi dan misi", "Perusahaan taksi atau perusahaan mobilitas?"],
               ["Sasaran", "Mempertahankan pangsa atau memperbaiki laba per kendaraan?"],
               ["Perumusan strategi", "Bersaing sendiri, bermitra, atau keduanya?"],
               ["Eksekusi", "Struktur dan sistem imbalan seperti apa yang dibutuhkan?"],
               ["Pemantauan", "Indikator apa yang menunjukkan arah baru berhasil?"]] }
    ],
    questions: [
      "Rumuskan ulang visi perusahaan ini dalam satu kalimat. Bagaimana rumusan Anda mengubah pilihan strategi yang tersedia?",
      "Exhibit 1 menunjukkan perbedaan struktur aset. Apakah kepemilikan armada merupakan beban atau aset dalam persaingan ini? Pertahankan jawaban Anda.",
      "Bermitra dengan pesaing memberi akses pasar tetapi menyerahkan hubungan pelanggan. Bagaimana Anda menimbang pertukaran itu?",
      "Eksekusi sering gagal karena struktur dan kebiasaan lama. Perubahan organisasi apa yang paling menentukan bagi perusahaan ini?",
      "Apa peran dewan komisaris dalam situasi seperti ini? Sejauh mana ia boleh mendorong perubahan arah?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai keusangan model bisnis yang menuntut perumusan ulang visi, bukan sekadar penyesuaian tarif. Hindari menuliskan bahwa masalahnya adalah persaingan aplikasi.",
      alternatives: "Beri judul pada setiap alternatif, misalnya 'Bersaing sebagai platform sendiri', 'Bermitra dengan platform', dan 'Fokus pada segmen korporat dan premium'. Sebutkan sumber daya yang dibutuhkan tanpa argumen pro dan kontra.",
      issues: "Bahas trade-off tiap alternatif pada kendali hubungan pelanggan, struktur biaya tetap, kesiapan organisasi, dan kecepatan pelaksanaan.",
      conclusion: "Pilih satu alternatif, sebutkan tiga langkah eksekusi pertama beserta indikatornya, dan jelaskan kondisi yang membuat Anda meninjau ulang."
    }
  },

  {
    id: "sm5-manutd",
    title: "Manchester United: Bersiap untuk Hidup Tanpa Ferguson",
    subtitle: "Menakar sumber daya dan kapabilitas sebuah klub ketika arsitek utamanya mendekati pensiun",
    forSession: 5,
    badge: "Kasus resmi Kelompok 4",
    readingTime: 8,
    officialSource: "Bacaan resmi (PDF di Drive, dua bagian): Grant, R.M. (2010), Manchester United: Preparing for Life without Ferguson, teaching case Contemporary Strategy Analysis. Bagian 2: https://drive.google.com/file/d/1VOWueCFJvHEe306j5JD0IQopFCFtQWQO/view",
    driveUrl: "https://drive.google.com/file/d/1SqV5W6XZpO3IZ8d1KlOFUqn5oeR-IcHv/view",
    decisionMaker: "David Gill, Chief Executive Manchester United Football Club",
    decisionPoint: "Juli 2009, dalam Asia Tour: merencanakan suksesi Sir Alex Ferguson yang diperkirakan pensiun, dengan memahami lebih dulu apa yang sesungguhnya menentukan keberhasilan sebuah klub",
    relevance: "Bab 4 (analisis sumber daya, kapabilitas, dan daya saing perusahaan), pasangan langsung materi VRIN.",
    sections: [
      { heading: "Juli 2009: Tur yang Sepenuhnya Komersial",
        body: `<p>Pada Juli 2009, David Gill mendampingi tim Manchester United dalam Asia Tour melawan tim-tim lokal
di Malaysia, Indonesia, Korea Selatan, dan Tiongkok. Di atas kertas tur itu bagian dari persiapan pramusim; pada
kenyataannya tujuannya hampir seluruhnya komersial (Grant, 2010). Jadwalnya pun ditentukan oleh kesepakatan
sponsor: laga Kuala Lumpur adalah imbalan sponsor Telekom Malaysia, sementara laga lainnya terkait kesepakatan
dengan mitra di Korea, Tiongkok, dan Indonesia.</p>
<p>Alasannya jelas: klub memperkirakan memiliki 80 juta pendukung di Asia, termasuk 1,2 juta pemegang kartu
kredit berlogo klub di Korea Selatan. Basis penggemar Asia itu pula yang menjadi kunci kesepakatan sponsor
empat tahun senilai 80 juta pound dengan AON, yang logonya akan menggantikan AIG di kaus tim. Di dalam pesawat
yang mendarat di Kuala Lumpur ikut serta tim komersial dari London yang bertugas menuntaskan serangkaian
kesepakatan sponsor dan perjanjian per wilayah.</p>
<p>Namun yang paling membebani pikiran Gill bukan urusan komersial. Selama tim terus menang dan bermain menarik,
pendapatan akan terus mengalir. Awan paling gelap di cakrawala adalah pensiunnya Sir Alex Ferguson yang semakin
dekat: manajer yang dalam 23 tahun membangun seluruh infrastruktur pemandu bakat, latihan, disiplin, serta taktik
tim, dan pada akhir 2009 akan berusia 68 tahun. Mencari penggantinya memaksa Gill merenungkan pertanyaan yang
lebih mendasar: apa sesungguhnya yang menentukan keberhasilan dalam sepak bola Inggris dan Eropa.</p>` },
      { heading: "Ekonomi Industri Sepak Bola",
        body: `<p>Kasus ini memberikan potret industri yang tidak biasa. Pendapatan klub mengalir dari tiga sumber:
<em>matchday</em> (tiket dan hospitality), <em>penyiaran</em> (hak siar Premier League dijual 2,7 miliar pound
untuk 2007 sampai 2010, memberi rata-rata 45 juta pound per klub per tahun, ditambah lebih dari 30 juta euro dari
UEFA bagi peserta terbaik Liga Champions), dan <em>komersial</em> (sponsor dan lisensi merchandise). Lolos ke Liga
Champions menjadi sasaran finansial yang kritis karena pendapatannya besar, dan hal itu memperlebar jurang antara
empat klub teratas Inggris dan sisanya.</p>
<p>Di sisi biaya, gaji pemain mendominasi: sekitar 62 persen pendapatan untuk rata-rata Premier League, sekitar
separuh pendapatan untuk Manchester United dan Arsenal, hingga 81 persen untuk Chelsea. Biaya transfer terus
melambung karena masuknya pemilik super kaya; pada musim panas 2009 Cristiano Ronaldo pindah ke Real Madrid
dengan rekor sekitar 93 juta dolar.</p>
<p>Hasil akhirnya paradoks: olahraga paling populer di dunia adalah bisnis yang nyaris tidak menguntungkan.
Dalam data kasus untuk 2000 sampai 2006, hanya Manchester United (12,6 persen laba atas penjualan), Arsenal, dan
Bayern Munich yang mencetak laba berarti; Chelsea dan Inter justru merugi puluhan persen. Manchester United
sendiri menghasilkan pendapatan sekitar 325 juta euro dengan EBITDA hampir 102 juta euro, tertinggi di Eropa,
tetapi memikul utang sekitar 616 juta pound akibat akuisisi keluarga Glazer yang dibiayai utang.</p>` },
      { heading: "Dua Jalan Menuju Tim Hebat, dan Peran Sang Manajer",
        body: `<p>Karena penentu utama kinerja tim adalah kualitas pemain, klub memiliki dua jalan: <strong>membeli
pemain jadi</strong> atau <strong>mengembangkan pemain sendiri</strong>. Kasus ini memetakan strategi klub-klub
puncak: Real Madrid terang-terangan membeli pemain terbaik dunia; AC Milan mengandalkan pemain matang; Arsenal
membentuk pemain muda berbakat menjadi tim yang mengalir; sedangkan Manchester United menekankan pengembangan
talenta muda yang dipadukan dengan pemain berpengalaman.</p>
<p>Di tengah semua itu berdiri figur manajer. Kasus ini mencatat bahwa keberhasilan berkelanjutan sebuah tim
hampir selalu terkait dengan satu pelatih, tetapi apa yang membuat pelatih hebat sulit dirumuskan: gaya keras
Ferguson berbeda dari ketenangan Eriksson, pendekatan intelektual Wenger, atau gaya obsesif Mourinho, dan pelatih
yang berjaya di satu klub sering gagal di klub lain. Benang merah yang teridentifikasi ada tiga: kejelian melihat
bakat sebelum matang, kemampuan meramu kombinasi pemain menjadi tim yang efektif, dan kemampuan memotivasi serta
merebut kesetiaan pemain.</p>
<p>Bagi analisis Bab 4, inilah inti kasusnya: memisahkan mana yang merupakan <em>sumber daya</em> klub (merek
global, stadion, basis penggemar, kontrak pemain, akademi) dan mana yang merupakan <em>kapabilitas</em> yang
selama 23 tahun melekat pada satu orang (memandu bakat, membangun ulang skuad berkali-kali, menjaga disiplin dan
budaya menang), lalu menilai mana yang akan bertahan ketika orang itu pergi.</p>` },
      { heading: "Epilog: Perkembangan Sesudah Periode Kasus",
        body: `<p><em>Bagian ini melampaui periode kasus (2009). Gunakan untuk menguji analisis Anda, bukan sebagai
bahan analisis utama.</em></p>
<p>Ferguson ternyata bertahan hingga 2013, memberi klub empat tahun tambahan untuk bersiap; pada masa itu klub
masih menambah gelar liga. Namun setelah ia benar-benar pergi, klub berganti manajer berkali-kali, membelanjakan
dana transfer yang sangat besar, dan tidak lagi memenangi gelar liga hingga bertahun-tahun kemudian, meskipun
pendapatan komersialnya tetap tumbuh. Pertanyaan untuk kelas: apakah hasil itu membuktikan analisis yang Anda
buat atas data 2009?</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Data Finansial Klub Terkemuka Eropa (dari Tabel 6.5 kasus)",
        note: "Pendapatan dan EBITDA dalam juta euro; nilai klub dan utang dalam juta pound. Lihat tabel lengkap pada PDF asli.",
        rows: [["Klub", "Pendapatan", "EBITDA", "Nilai klub", "Utang"],
               ["Real Madrid", "365,8", "51,6", "850", "196"],
               ["Manchester United", "324,8", "101,9", "1.140", "616"],
               ["Barcelona", "308,8", "68,8", "960", "41"],
               ["Bayern Munich", "295,3", "37,6", "774", "0"],
               ["Chelsea", "268,9", "(8,3)", "486", "447"],
               ["Arsenal", "264,4", "51,0", "690", "896"]] },
      { title: "Exhibit 2: Uji VRIN atas Sumber Daya dan Kapabilitas Klub, 2009",
        note: "Kerangka latihan; isi kolom penilaian Anda sendiri sebelum kelas.",
        rows: [["Sumber daya / kapabilitas", "Bernilai", "Langka", "Sulit ditiru", "Catatan"],
               ["Merek global dan 80 juta penggemar Asia", "Ya", "Ya", "Ya", "Dibangun puluhan tahun"],
               ["Stadion Old Trafford dan matchday", "Ya", "Sebagian", "Sebagian", "Kapasitas terbesar di Inggris"],
               ["Kontrak pemain bintang", "Ya", "Ya", "Tidak", "Dapat dibeli pesaing kaya"],
               ["Akademi dan pengembangan pemain muda", "Ya", "Sebagian", "Sebagian", "Kelas 1992 sebagai bukti"],
               ["Kapabilitas Ferguson: bakat, peramuan tim, motivasi", "Ya", "Ya", "Ya", "Melekat pada individu"]] }
    ],
    questions: [
      "Pisahkan sumber daya dan kapabilitas Manchester United per 2009, lalu uji masing-masing dengan VRIN. Mana yang menghasilkan keunggulan berkelanjutan dan mana yang berisiko hilang bersama Ferguson?",
      "Exhibit 1 menunjukkan EBITDA tertinggi di Eropa berdampingan dengan utang 616 juta pound. Bagaimana struktur kepemilikan Glazer memengaruhi pilihan strategis klub dibandingkan Chelsea atau Manchester City yang disuntik modal pemiliknya?",
      "Dua jalan menuju tim hebat: membeli atau mengembangkan. Dengan ekonomi industri pada kasus (gaji 62 persen pendapatan, inflasi transfer), jalur mana yang lebih berkelanjutan, dan untuk klub seperti apa?",
      "Kasus menyebut tiga benang merah pelatih hebat. Sejauh mana ketiganya dapat dilembagakan menjadi sistem klub, dan sejauh mana ia tetap seni individu?",
      "Susun rencana suksesi yang akan Anda ajukan kepada Gill pada 2009: kriteria pengganti, perubahan struktur di sekitar manajer baru, dan indikator dua tahun pertama."
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai risiko hilangnya kapabilitas inti yang melekat pada individu, bukan sekadar mencari pelatih baru; sertakan konteks keuangan (utang) yang membatasi solusi lewat belanja pemain.",
      alternatives: "Beri judul alternatif suksesi, misalnya 'Merekrut manajer bintang dari luar', 'Promosi dari dalam sistem Ferguson', dan 'Membangun struktur direktur sepak bola yang mengurangi ketergantungan pada satu orang'. Sebutkan konsekuensi biaya dan organisasi tanpa argumen pro dan kontra.",
      issues: "Bahas transferabilitas kapabilitas Ferguson, batas keuangan akibat utang, tekanan hasil jangka pendek dari kebutuhan lolos Liga Champions, dan risiko merek bila prestasi turun.",
      conclusion: "Ambil posisi, sebutkan tiga langkah pelembagaan kapabilitas yang dimulai sekarang selagi Ferguson masih ada, dan indikator keberhasilan suksesi."
    }
  },

  {
    id: "sm6-ikea",
    title: "IKEA di Indonesia: Murah, Berbeda, atau Keduanya",
    subtitle: "Menempatkan sebuah peritel perabot pada peta lima strategi kompetitif generik",
    forSession: 6,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 5 tentang lima strategi kompetitif generik",
    decisionMaker: "Manajemen pemegang waralaba sebuah peritel perabot global di Indonesia",
    decisionPoint: "Menentukan strategi kompetitif untuk ekspansi ke kota-kota di luar wilayah metropolitan",
    relevance: "Kasus untuk membedakan cost leadership, differentiation, focused strategies, dan best-cost provider pada satu perusahaan nyata.",
    sections: [
      { heading: "Model yang Tidak Mudah Digolongkan",
        body: `<p>Peritel perabot ini masuk ke Indonesia melalui pemegang waralaba lokal dan membuka gerai pertamanya
di kawasan pinggiran Jakarta pada 2014, disusul gerai di beberapa lokasi lain termasuk gerai berformat lebih kecil
di pusat kota. Modelnya mudah dikenali: gerai besar dengan alur kunjungan yang diarahkan, ruang pamer bertema,
gudang swalayan, perabot yang dirakit sendiri oleh pembeli, dan restoran di dalam gerai.</p>
<p>Yang menarik dari sudut pandang strategi adalah bahwa perusahaan ini sulit digolongkan ke dalam satu kotak. Ia
menawarkan harga yang jauh lebih rendah daripada toko perabot bermerek, sekaligus menawarkan desain, pengalaman
berbelanja, dan identitas merek yang kuat. Dalam bahasa Thompson dan Strickland, ini adalah gambaran khas
<em>best-cost provider</em>: memberi atribut yang lebih baik pada biaya yang lebih rendah.</p>
<p>Posisi itu secara teori adalah posisi paling sulit dipertahankan karena ia diserang dari dua arah sekaligus.</p>` },
      { heading: "Diserang dari Dua Arah",
        body: `<p>Dari arah bawah, pasar perabot Indonesia dipenuhi produsen lokal di sentra-sentra mebel yang mampu
membuat perabot serupa dengan harga lebih murah, meskipun tanpa jaminan mutu dan konsistensi. Lokapasar daring
memperkuat serangan ini dengan memberi produsen kecil akses langsung ke konsumen.</p>
<p>Dari arah atas, peritel perabot bermerek dan toko desain interior menawarkan mutu bahan, layanan pengukuran,
dan pemasangan di rumah, sesuatu yang tidak disediakan model rakit sendiri.</p>
<p>Terdapat pula persoalan yang khas Indonesia. Model gerai besar di pinggiran kota mengasumsikan konsumen memiliki
kendaraan pribadi dan bersedia menempuh perjalanan panjang. Biaya pengantaran dan perakitan yang di negara asal
dianggap opsional menjadi hampir wajib bagi sebagian besar pembeli Indonesia, yang mengubah struktur biaya dan
sebagian menghapus keunggulan harganya.</p>` },
      { heading: "Pilihan untuk Ekspansi Berikutnya",
        body: `<p>Manajemen mempertimbangkan tiga arah. Pertama, mempertahankan format gerai besar dan membukanya di
kota besar berikutnya, dengan investasi tinggi dan risiko lalu lintas kunjungan yang belum teruji. Kedua,
memperbanyak gerai berformat kecil di pusat kota yang berfungsi sebagai ruang pamer dan titik pengambilan, dengan
biaya lebih rendah tetapi pengalaman kunjungan yang berbeda. Ketiga, memperkuat kanal daring dengan jaringan gudang
regional, menerima bahwa pengalaman gerai bukan lagi inti proposisi.</p>
<p>Setiap arah menggeser posisi perusahaan pada peta lima strategi generik.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Lima Strategi Generik dan Kandidat Pemainnya",
        note: "Tempatkan tiap pemain pada strategi yang paling menggambarkan posisinya.",
        rows: [["Strategi generik", "Ciri utama", "Contoh kandidat di pasar perabot Indonesia"],
               ["Low-cost provider", "Biaya terendah di industri", "Produsen sentra mebel lewat lokapasar"],
               ["Broad differentiation", "Atribut unik bagi pasar luas", "Peritel perabot bermerek"],
               ["Focused low-cost", "Biaya rendah pada ceruk", "Toko perabot bekas dan kaki lima"],
               ["Focused differentiation", "Keunikan pada ceruk", "Studio desain interior khusus"],
               ["Best-cost provider", "Atribut lebih baik pada biaya lebih rendah", "Peritel perabot global rakit sendiri"]] },
      { title: "Exhibit 2: Tiga Arah Ekspansi dan Pergeseran Posisinya",
        note: "Bahan pembanding untuk bagian Issues.",
        rows: [["Arah", "Investasi", "Pengalaman pelanggan", "Posisi strategi generik"],
               ["Gerai besar di kota baru", "Tinggi", "Utuh", "Best-cost provider"],
               ["Gerai kecil di pusat kota", "Menengah", "Terbatas", "Bergeser ke differentiation terfokus"],
               ["Perkuat kanal daring", "Menengah", "Tanpa pengalaman gerai", "Bergeser ke low-cost provider"]] }
    ],
    questions: [
      "Tempatkan perusahaan ini pada Exhibit 1 dan pertahankan penempatan Anda dengan bukti dari narasi kasus.",
      "Posisi best-cost provider disebut paling sulit dipertahankan. Jelaskan mengapa, dengan menunjuk serangan dari dua arah pada kasus ini.",
      "Biaya pengantaran dan perakitan yang hampir wajib mengubah struktur biaya di Indonesia. Bagaimana kenyataan itu memengaruhi keunggulan harganya?",
      "Nilai ketiga arah pada Exhibit 2. Arah mana yang paling menjaga konsistensi posisi strategi perusahaan?",
      "Porter memperingatkan bahaya terjebak di tengah. Apakah perusahaan ini contoh best-cost provider yang berhasil, atau contoh terjebak di tengah yang belum terlihat?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai pemilihan posisi strategi kompetitif untuk ekspansi ke pasar yang struktur biaya dan perilaku konsumennya berbeda dari asumsi model aslinya.",
      alternatives: "Beri judul pada ketiga arah ekspansi, sebutkan investasi dan konsekuensi operasionalnya tanpa argumen pro dan kontra.",
      issues: "Bahas tekanan dari pesaing berbiaya rendah dan pesaing terdiferensiasi, biaya layanan tambahan, serta konsistensi posisi strategi.",
      conclusion: "Pilih satu arah, tegaskan posisi strategi generik yang dituju, dan sebutkan indikator yang menunjukkan posisi itu tetap terjaga."
    }
  },
  {
    id: "sm7-iphone",
    title: "Apple iPhone: Calling Europe or Europe Calling?",
    subtitle: "Konsesi apa yang pantas diberikan operator demi sebuah telepon, dan siapa yang sesungguhnya memegang kendali rantai nilai",
    forSession: 7,
    badge: "Kasus resmi Kelompok 1",
    readingTime: 8,
    officialSource: "Bacaan resmi (PDF di Drive): Mitchell, Sieber dan Valor (2008), Apple's iPhone: Calling Europe or Europe Calling?, IESE Business School SI-167-E",
    driveUrl: "https://drive.google.com/file/d/1PFVI_o3rTOJsJxjHdYyBTOHiFRjSshBD/view",
    decisionMaker: "Matthew Key, Chief Executive O2 Inggris",
    decisionPoint: "9 November 2007, hari peluncuran iPhone di Inggris: apakah konsesi yang diberikan kepada Apple merupakan keputusan yang tepat",
    relevance: "Bab 6 (aliansi strategis, kekuatan tawar dalam rantai nilai, first mover) dan Bab 7 (memasuki pasar internasional lewat mitra lokal).",
    sections: [
      { heading: "Antrean di Regent Street",
        body: `<p>Pada pagi 9 November 2007, warga Inggris mengantre di depan Apple Store di Regent Street, London,
untuk mendapatkan iPhone. Bagi Matthew Key, kepala eksekutif O2, antrean itu menggembirakan sekaligus menyisakan
pertanyaan yang terus diajukan banyak pihak: apakah iPhone sepadan bagi O2, mengingat konsesi yang telah
diberikan kepada Apple (Mitchell, Sieber dan Valor, 2008).</p>
<p>iPhone diumumkan pada Januari 2007 dan dirilis di Amerika Serikat pada 29 Juni 2007. Produk itu dipuji luas
karena antarmuka layar sentuhnya, kemampuan menjelajah web, dan kemampuan multimedianya; Steve Jobs menyebutnya
produk yang revolusioner dan berada bertahun-tahun di depan telepon genggam mana pun. Klaim pemasaran itu didukung
angka: di Amerika Serikat iPhone terjual satu juta unit hanya dalam 74 hari, jauh lebih cepat daripada iPod yang
membutuhkan hampir dua tahun untuk angka yang sama.</p>
<p>Untuk peluncuran Eropa, Apple memilih satu operator per negara: O2 di Inggris, T-Mobile di Jerman, dan Orange
di Prancis, dengan target penjualan 10 juta unit pada 2008. Di Inggris, perangkat 8GB dijual 269 pound dengan
kontrak minimum 18 bulan dan tarif bulanan 35, 45, atau 55 pound untuk 200, 600, atau 1.200 menit percakapan.</p>` },
      { heading: "Konsesi yang Mengubah Aturan Industri",
        body: `<p>Yang membuat kesepakatan ini menjadi bahan perdebatan bukan harga perangkatnya, melainkan struktur
kesepakatannya. Dalam industri telekomunikasi Eropa saat itu, operatorlah yang memegang kendali: produsen telepon
menjual perangkat kepada operator, operator mensubsidi harga perangkat demi mengikat pelanggan pada kontrak, lalu
seluruh pendapatan layanan menjadi milik operator. Merek yang menghadap konsumen adalah merek operator, dan
produsen perangkat bersaing memperebutkan rak operator.</p>
<p>Apple membalik logika itu. Perangkat tidak disubsidi; merek yang menghadap konsumen adalah Apple; aktivasi
berjalan melalui iTunes milik Apple; fitur seperti Visual Voicemail menuntut operator menyesuaikan jaringannya
dengan spesifikasi Apple; dan yang paling mengejutkan industri, Apple meminta <strong>bagian dari pendapatan
bulanan layanan</strong>. Di Amerika Serikat, para analis memperkirakan AT&amp;T menyerahkan sekitar 10 sampai 20
persen pendapatan bulanan terkait iPhone kepada Apple, sesuatu yang belum pernah terjadi dalam industri ini.
Di Inggris, sejumlah pihak menilai O2 telah melampaui batas kewajaran harga, sementara Key menegaskan
perusahaannya hanya membuat kesepakatan yang baik.</p>
<p>Eksklusivitas juga segera diuji hukum. Di Jerman, gugatan dari Vodafone memaksa T-Mobile untuk sementara
menjual iPhone versi tanpa kunci jaringan dengan harga sekitar 1.000 euro, jauh di atas harga berlangganan,
sebelum pengadilan akhirnya memihak T-Mobile.</p>` },
      { heading: "Pasar yang Sudah Jenuh, Pertumbuhan yang Berpindah Tempat",
        body: `<p>Konteks pasarnya penting untuk analisis. Pasar telekomunikasi seluler Eropa bernilai sekitar 200
miliar euro dengan lebih dari 500 juta pelanggan; penetrasi diperkirakan 95 dari 100 pengguna pada 2005, dan lebih
dari separuh negara Eropa memiliki penetrasi di atas 100 persen karena satu orang lazim memiliki lebih dari satu
telepon. Dalam pasar sejenuh itu, pertumbuhan operator tidak lagi berasal dari pelanggan baru, melainkan dari
merebut pelanggan pesaing dan menaikkan pendapatan per pelanggan lewat layanan data.</p>
<p>Di sinilah nilai iPhone bagi operator: perangkat itu terbukti mendorong pemakaian data jauh di atas rata-rata
dan menarik pelanggan bernilai tinggi dari operator lain. Pertanyaannya, berapa besar nilai itu, dan berapa porsi
yang wajar diserahkan kepada Apple sebagai pemilik perangkatnya.</p>
<p>Sementara itu produsen petahana membaca ancaman yang sama dari arah berbeda. Nokia masih menguasai pasar
perangkat dunia, tetapi iPhone menggeser dasar persaingan dari perangkat keras dan skala menuju perangkat lunak,
desain antarmuka, dan ekosistem konten, medan yang justru menjadi kekuatan Apple.</p>` },
      { heading: "Keputusan yang Harus Dinilai",
        body: `<p>Kasus ini sengaja berhenti pada November 2007, sebelum hasil kesepakatan terlihat. Pembaca diminta
menilai keputusan O2 dengan informasi yang tersedia saat itu: apakah eksklusivitas dengan pembagian pendapatan
merupakan harga yang pantas untuk diferensiasi, ataukah preseden berbahaya yang menggeser kekuatan rantai nilai
kepada pemilik perangkat untuk seterusnya.</p>
<p>Pertimbangan Key mencakup tiga hal: nilai pelanggan baru yang berpindah dari operator lain, kenaikan pendapatan
data dari pelanggan lama, dan risiko jangka panjang bila konsumen lebih setia kepada Apple daripada kepada O2.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Dua Model Hubungan Operator dan Produsen Perangkat",
        note: "Sintesis dari narasi kasus untuk membantu analisis; periksa detailnya pada PDF asli.",
        rows: [["Aspek", "Model tradisional", "Model kesepakatan iPhone"],
               ["Subsidi perangkat", "Operator mensubsidi", "Tanpa subsidi di awal"],
               ["Merek yang menghadap konsumen", "Operator", "Apple"],
               ["Pendapatan layanan bulanan", "Sepenuhnya milik operator", "Sebagian mengalir ke Apple"],
               ["Aktivasi dan pengalaman", "Sistem operator", "iTunes milik Apple"],
               ["Kekuatan tawar", "Operator", "Bergeser ke produsen perangkat"]] },
      { title: "Exhibit 2: Peluncuran Eropa, November 2007",
        note: "Disarikan dari kasus; angka Inggris paling rinci karena menjadi fokus kasus.",
        rows: [["Negara", "Operator eksklusif", "Catatan"],
               ["Inggris", "O2", "8GB seharga 269 pound; kontrak 18 bulan; tarif 35/45/55 pound"],
               ["Jerman", "T-Mobile", "Digugat Vodafone; sempat wajib menjual versi tanpa kunci sekitar 1.000 euro"],
               ["Prancis", "Orange", "Hukum setempat menuntut tersedianya versi tanpa kunci"],
               ["Amerika Serikat (pembanding)", "AT&T", "1 juta unit dalam 74 hari; estimasi bagi hasil 10 sampai 20 persen"]] }
    ],
    questions: [
      "Mengapa Apple mampu menuntut struktur kesepakatan yang belum pernah diberikan industri kepada produsen perangkat mana pun? Sumber kekuatan tawar apa yang dimilikinya?",
      "Dari sudut pandang O2, hitung secara konseptual sumber nilai kesepakatan ini (pelanggan pindahan, pendapatan data, citra merek) dan bandingkan dengan konsesinya. Apakah kesepakatan ini menguntungkan?",
      "Eksklusivitas satu operator per negara adalah pilihan Apple untuk memasuki pasar internasional. Bandingkan pendekatan ini dengan alternatif menjual lewat semua operator sekaligus, memakai kerangka Bab 7 tentang cara memasuki pasar asing.",
      "Gugatan di Jerman dan aturan di Prancis menunjukkan risiko regulasi model eksklusif. Bagaimana seharusnya Apple dan operator mengantisipasi perbedaan kelembagaan antarnegara?",
      "Kasus ini terjadi pada 2007. Dengan pengetahuan Anda tentang perkembangan industri sesudahnya, penilaian siapa yang terbukti benar: operator yang memberi konsesi, atau yang menolak?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai keputusan operator menukar sebagian kendali rantai nilai dan pendapatannya demi diferensiasi perangkat, bukan sebagai persoalan harga telepon.",
      alternatives: "Beri judul alternatif dari sudut pandang O2, misalnya 'Menerima syarat Apple secara penuh', 'Bernegosiasi tanpa bagi hasil', dan 'Menolak dan mengandalkan perangkat pesaing'. Sebutkan konsekuensi komersial masing-masing tanpa argumen pro dan kontra.",
      issues: "Bahas kekuatan tawar Apple, ekonomi pasar yang jenuh, risiko loyalitas berpindah ke merek perangkat, preseden bagi kesepakatan berikutnya, dan risiko hukum eksklusivitas di tiap negara.",
      conclusion: "Ambil posisi apakah O2 benar, sebutkan ukuran keberhasilan yang akan Anda pantau pada dua belas bulan pertama, dan jelaskan kondisi yang akan mengubah penilaian Anda."
    }
  },

  {
    id: "sm8-nyt",
    title: "New York Times: Masa Sulit Sang Nyonya Tua Kelabu",
    subtitle: "Portofolio mana yang dipertahankan, mana yang dilepas, dan model bisnis apa yang bisa menyelamatkan jurnalisme berkualitas",
    forSession: 8,
    badge: "Kasus resmi Kelompok 2",
    readingTime: 8,
    officialSource: "Bacaan resmi (PDF di Drive): Grant, R.M. (2010), New York Times, teaching case Contemporary Strategy Analysis (Case 14)",
    driveUrl: "https://drive.google.com/file/d/1pOJlBZSrjnDbm7WkJAN-hiFNTXJjtUSa/view",
    decisionMaker: "Arthur Sulzberger Jr. (Chairman) dan Janet Robinson (CEO) New York Times Company",
    decisionPoint: "April 2009, di tengah krisis likuiditas: menentukan susunan portofolio bisnis dan model bisnis digital yang dapat menopang jurnalisme perusahaan",
    relevance: "Bab 8 (strategi korporat: diversifikasi dan pengelolaan portofolio multibisnis), dengan sentuhan Bab 1 tentang strategi dan model bisnis.",
    sections: [
      { heading: "Awal 2009: Krisis yang Menjadi Nyata",
        body: `<p>Bulan-bulan awal 2009 adalah periode berat bagi New York Times Company, penerbit New York Times
dan Boston Globe. Seperti penerbit surat kabar Amerika lainnya, perusahaan terjepit dua masalah sekaligus:
masalah siklikal berupa pemangkasan anggaran iklan pada masa resesi, dan masalah struktural berupa pembaca yang
terus berpindah ke sumber informasi daring (Grant, 2010).</p>
<p>Tekanannya bukan lagi abstrak. Fasilitas kredit 400 juta dolar akan berakhir pada Mei; pada Januari perusahaan
membeli napas dengan pinjaman 250 juta dolar berbunga 14 persen dari miliarder Meksiko Carlos Slim; pada Februari
dividen tahun itu dihapus. Hasil 2008 mencatat rugi bersih hampir 58 juta dolar setelah beban penurunan nilai,
karena pendapatan menyusut lebih cepat daripada kemampuan perusahaan memangkas biaya. Harga saham yang masih di
atas 14 dolar pada September 2008 ditutup pada 3,44 dolar pada 20 Februari 2009.</p>
<p>Pada rapat pemegang saham 29 April 2009, Sulzberger menegaskan keyakinan lamanya bahwa jurnalisme berkualitas
menarik audiens berkualitas yang pada gilirannya menarik pengiklan berkualitas, sambil mengakui bahwa tidak ada
satu solusi tunggal yang akan mengembalikan pertumbuhan pendapatan. Para skeptis tidak sepenuhnya percaya:
mereka menunjuk penurunan sirkulasi, larinya pembaca muda, perpindahan iklan ke media daring, dan kegagalan
industri menemukan model bisnis daring yang layak.</p>` },
      { heading: "Portofolio yang Harus Ditata",
        body: `<p>Dari kacamata Bab 8, kasus ini adalah persoalan portofolio. Perusahaan terdiri atas News Media
Group (New York Times Media Group termasuk NYTimes.com dan International Herald Tribune; New England Media Group
termasuk Boston Globe; serta Regional Media Group dengan 15 koran harian daerah) dan About Group, jaringan situs
informasi yang dipimpin About.com dengan sekitar 39 juta kunjungan bulanan. Di luar itu terdapat kepemilikan yang
tampak jauh dari bisnis inti: 18 persen klub bisbol Boston Red Sox beserta Stadion Fenway Park, 80 persen jaringan
televisi olahraga New England Sports Network, dan separuh tim balap NASCAR.</p>
<p>The Times sendiri adalah permatanya: satu-satunya harian umum yang beredar di seluruh 50 negara bagian, dengan
101 penghargaan Pulitzer hingga 2009, lebih dari dua kali lipat koran mana pun. Kekuatan merek itulah yang membuat
harga ecerannya dapat dinaikkan dari 1 menjadi 2 dolar antara 2007 dan 2009. Namun strukturnya rapuh: mayoritas
pendapatan perusahaan bergantung pada iklan (sekitar 1,78 miliar dolar dari total 2,95 miliar dolar pada 2008),
dan pendapatan situs web hampir seluruhnya iklan.</p>
<p>Boston Globe menjadi penguras kas terbesar. Kritik terhadap dewan yang dikendalikan keluarga lewat saham dua
kelas ikut mengeras: dewan pernah menolak tawaran 600 juta dolar untuk Globe pada 2006, membangun kantor pusat
setengah miliar dolar pada 2007, dan menghabiskan 3 miliar dolar membeli kembali saham pada harga rata-rata 37
dolar, jauh di atas harga 2009.</p>` },
      { heading: "Langkah Bertahan dan Pencarian Model Baru",
        body: `<p>Respons utama manajemen adalah memangkas biaya: konsolidasi percetakan (menghemat puluhan juta
dolar per tahun), menutup bisnis distribusi yang tidak mencapai target, mengalihdayakan fungsi pendukung,
mengurangi sirkulasi yang marginal, dan menghemat kertas koran. Aset non-inti mulai dilepas: stasiun televisi
lokal dijual pada 2007, dan pada 2009 perusahaan bernegosiasi menjual kepemilikan olahraganya.</p>
<p>Persoalan yang lebih dalam adalah model bisnis daring. Sejarah NYTimes.com adalah sejarah keraguan: berbayar
untuk pembaca internasional pada awalnya, digratiskan pada 1997 demi audiens, model campuran TimesSelect pada
2005, digratiskan lagi pada 2007 demi iklan, dan pada 2009 kembali dievaluasi. Perdebatan industrinya terbelah
dua kubu: kubu berbayar yang yakin konten unik layak dijual, dan kubu gratis yang, seperti dikemukakan CEO Google
Eric Schmidt, berpendapat sebagian besar berita tersedia di banyak sumber sehingga hanya iklan tertarget yang
menjadi model yang layak.</p>
<p>Ada pula jalan ketiga yang tidak nyaman: menjadi milik pemilik kaya yang membeli pengaruh, bukan laba. Sejarah
industri menunjukkan koran sering bertahan justru karena motivasi non-finansial pemiliknya, tetapi kebangkrutan
Tribune Company setelah dibeli 8,2 miliar dolar menjadi peringatan bahwa kesabaran pemilik kaya pun ada
batasnya.</p>` },
      { heading: "Epilog: Perkembangan Sesudah Periode Kasus",
        body: `<p><em>Bagian ini melampaui periode kasus (2009). Gunakan untuk menguji analisis Anda, bukan sebagai
bahan analisis utama.</em></p>
<p>Perusahaan akhirnya memilih jalur yang saat kasus ini ditulis masih diperdebatkan: dinding berbayar terukur
diluncurkan pada 2011, Boston Globe dan aset regional dijual, dan produk langganan non-berita (permainan, resep,
ulasan produk) dikembangkan hingga pendapatan digital melampaui cetak. Pertanyaan untuk kelas: dari informasi yang
tersedia pada April 2009, apakah arah itu sudah dapat dipertahankan sebagai rekomendasi Anda?</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Ringkasan Keuangan Terpilih (dari Tabel 14.1 kasus)",
        note: "Angka dalam ribuan dolar kecuali disebutkan; lihat tabel lengkap pada PDF asli.",
        rows: [["Ukuran", "2008", "2007", "2006"],
               ["Pendapatan", "2.948.856", "3.195.077", "3.289.903"],
               ["Laba (rugi) operasi", "(40.636)", "227.429", "(520.611)"],
               ["Laba (rugi) bersih", "(57.839)", "208.704", "(543.443)"],
               ["Total utang", "1.059.375", "1.034.979", "1.445.928"],
               ["Utang terhadap kapitalisasi", "68%", "51%", "64%"],
               ["Karyawan (setara penuh waktu)", "9.346", "10.231", "11.585"]] },
      { title: "Exhibit 2: Sejarah Model Bisnis Daring NYTimes.com",
        note: "Disarikan dari narasi kasus; perhatikan bolak-baliknya arah kebijakan.",
        rows: [["Periode", "Model", "Alasan"],
               ["Awal", "Berbayar untuk pembaca internasional", "Menguji kesediaan membayar"],
               ["1997", "Gratis penuh", "Memperbesar audiens daring"],
               ["2005", "TimesSelect: premium berbayar", "Memonetisasi kolumnis dan arsip"],
               ["2007", "Gratis penuh lagi", "Mengejar pendapatan iklan"],
               ["2009", "Dievaluasi ulang", "Iklan runtuh; mencari model berkelanjutan"]] }
    ],
    questions: [
      "Petakan portofolio perusahaan pada 2009 dan uji tiap unit dengan pertanyaan Bab 8: apakah kepemilikan induk menambah nilai unit itu? Mana yang layak dilepas lebih dulu?",
      "Sulzberger berpegang pada formula jurnalisme berkualitas menarik audiens dan pengiklan berkualitas. Pada 2009, apakah formula itu masih merupakan model bisnis, atau tinggal keyakinan? Bedakan keduanya.",
      "Analisis bolak-balik kebijakan daring pada Exhibit 2. Apa yang menyebabkan ketidakkonsistenan itu, dan kerangka apa yang seharusnya dipakai untuk memutuskan berbayar atau gratis?",
      "Struktur saham dua kelas melindungi kendali keluarga sekaligus dikritik pemegang saham. Timbang biaya dan manfaat struktur itu bagi perusahaan pada masa krisis.",
      "Sebagai penasihat Robinson pada April 2009, susun urutan tindakan dua belas bulan: apa yang dijual, apa yang dipangkas, dan taruhan digital apa yang diambil?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai krisis likuiditas jangka pendek yang menumpang di atas keusangan model bisnis jangka panjang; keduanya menuntut jawaban yang berbeda dan jangan dicampur.",
      alternatives: "Beri judul alternatif strategi korporat, misalnya 'Fokus pada The Times dan lepaskan sisanya', 'Pertahankan portofolio dengan penghematan agresif', dan 'Bertaruh penuh pada digital berbayar'. Sebutkan konsekuensi kas dan organisasi masing-masing tanpa argumen pro dan kontra.",
      issues: "Bahas ketergantungan pada iklan, posisi Boston Globe, nilai aset non-inti, perdebatan berbayar melawan gratis, dan peran struktur kepemilikan keluarga.",
      conclusion: "Ambil posisi, tetapkan urutan pelepasan aset dan kebijakan konten daring, serta ukuran kas dan digital yang menandakan strategi Anda berhasil dalam dua tahun."
    }
  },

  {
    id: "sm9-bsi",
    title: "Menyatukan Tiga Bank Menjadi Satu Organisasi",
    subtitle: "Membangun organisasi yang mampu mengeksekusi strategi setelah penggabungan usaha",
    forSession: 9,
    badge: "⭐ Sesi Kelompok 3",
    readingTime: 7,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 10 tentang membangun organisasi yang mampu mengeksekusi strategi",
    decisionMaker: "Direksi sebuah bank hasil penggabungan tiga bank syariah milik negara",
    decisionPoint: "Merancang struktur, kapabilitas, dan penempatan orang agar strategi hasil penggabungan benar-benar berjalan",
    relevance: "Kasus utama untuk Bab 10: membangun kapabilitas, menyusun struktur, dan menempatkan orang. Relevan langsung dengan tugas Kelompok 3.",
    sections: [
      { heading: "Penggabungan yang Diumumkan dalam Hitungan Bulan",
        body: `<p>Pada awal 2021, tiga bank syariah milik negara digabungkan menjadi satu entitas dengan tujuan
menciptakan bank syariah berskala besar yang mampu bersaing di tingkat nasional dan regional. Secara hukum,
penggabungan itu selesai dalam hitungan bulan. Secara organisasi, pekerjaannya baru dimulai.</p>
<p>Ketiga bank asal memiliki sejarah, sistem teknologi, budaya kerja, dan kekuatan segmen yang berbeda. Satu bank
kuat pada pembiayaan konsumer, satu pada segmen usaha kecil, dan satu pada nasabah institusi. Sistem inti
perbankan mereka berbeda, produk mereka berbeda namanya, dan cara mereka mengambil keputusan kredit berbeda pula.</p>
<p>Nasabah mengalami langsung akibat penyatuan itu pada masa migrasi sistem: penggantian nomor rekening, gangguan
layanan, dan antrean di kantor cabang.</p>` },
      { heading: "Tiga Pekerjaan yang Disebut Bab 10",
        body: `<p>Buku teks menyebut tiga pekerjaan inti dalam membangun organisasi yang mampu mengeksekusi
strategi. Pertama, <strong>menempatkan orang yang tepat</strong>. Dalam penggabungan, ini berarti memilih di antara
tiga kelompok manajer untuk satu posisi, sebuah keputusan yang menentukan pesan apa yang ditangkap organisasi
tentang budaya mana yang akan menang.</p>
<p>Kedua, <strong>membangun kapabilitas inti</strong>. Bank hasil penggabungan tidak cukup menjumlahkan
kapabilitas ketiga bank asal. Ia perlu kapabilitas baru yang tidak dimiliki satu pun dari ketiganya, misalnya
kemampuan melayani nasabah lewat kanal digital pada skala yang jauh lebih besar dan kemampuan menyusun produk
syariah yang bersaing dengan produk bank konvensional.</p>
<p>Ketiga, <strong>menyusun struktur yang mendukung strategi</strong>. Pertanyaan yang harus dijawab adalah
aktivitas mana yang dipusatkan demi efisiensi dan skala, dan aktivitas mana yang didelegasikan ke wilayah agar
tetap dekat dengan nasabah.</p>
<p>Ketiganya saling terkait. Struktur yang bagus dengan orang yang salah tidak akan berjalan, dan orang yang tepat
dalam struktur yang tidak jelas akan kehabisan tenaga pada koordinasi.</p>` },
      { heading: "Pertanyaan yang Masih Dihadapi",
        body: `<p>Setelah penggabungan, bank ini menjadi salah satu bank terbesar di Indonesia dari sisi aset dan
memiliki jaringan cabang yang luas. Namun pertanyaan strategisnya tetap terbuka: apakah pertumbuhan berikutnya
berasal dari nasabah yang berpindah dari bank konvensional karena alasan keyakinan, ataukah dari nasabah yang
memilih berdasarkan mutu layanan dan harga.</p>
<p>Jawaban atas pertanyaan itu menentukan kapabilitas mana yang harus dibangun lebih dahulu, dan karena itu
menentukan pula ke mana anggaran dan perhatian manajemen diarahkan.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Tiga Pekerjaan Membangun Organisasi",
        note: "Gunakan sebagai kerangka presentasi Kelompok 3.",
        rows: [["Pekerjaan", "Pertanyaan kunci", "Risiko bila gagal"],
               ["Menempatkan orang", "Siapa memimpin unit hasil penggabungan?", "Pesan budaya yang keliru, kehilangan talenta"],
               ["Membangun kapabilitas", "Kemampuan baru apa yang belum dimiliki ketiganya?", "Sekadar menjumlahkan, bukan menciptakan"],
               ["Menyusun struktur", "Apa dipusatkan, apa didelegasikan?", "Koordinasi menghabiskan energi"]] },
      { title: "Exhibit 2: Pilihan Struktur Setelah Penggabungan",
        note: "Bahan pembanding untuk bagian Alternatives.",
        rows: [["Pilihan struktur", "Kekuatan", "Kelemahan"],
               ["Terpusat berdasarkan fungsi", "Efisiensi dan konsistensi", "Lambat merespons pasar lokal"],
               ["Berdasarkan segmen nasabah", "Fokus pada kebutuhan segmen", "Duplikasi fungsi pendukung"],
               ["Berdasarkan wilayah", "Dekat dengan pasar", "Standar layanan berbeda antar-wilayah"],
               ["Matriks segmen dan wilayah", "Menggabungkan keduanya", "Jalur pelaporan ganda"]] }
    ],
    questions: [
      "Ketiga bank asal memiliki budaya berbeda. Bagaimana keputusan penempatan manajer mengirim pesan tentang budaya mana yang akan berlaku?",
      "Kapabilitas baru apa yang tidak dimiliki satu pun bank asal tetapi mutlak dibutuhkan bank hasil penggabungan? Urutkan berdasarkan prioritas.",
      "Nilai keempat pilihan struktur pada Exhibit 2 untuk bank dengan jaringan cabang yang sangat luas.",
      "Migrasi sistem menimbulkan gangguan layanan yang dirasakan nasabah. Bagaimana biaya jangka pendek semacam itu seharusnya diperhitungkan dalam rencana eksekusi?",
      "Pertumbuhan berikutnya berasal dari alasan keyakinan atau dari mutu layanan? Ambil posisi dan jelaskan konsekuensinya bagi prioritas kapabilitas."
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai kesenjangan antara strategi yang diumumkan pada saat penggabungan dan kemampuan organisasi menjalankannya.",
      alternatives: "Beri judul pada pilihan struktur dan pendekatan penempatan orang, sebutkan konsekuensi masing-masing tanpa argumen pro dan kontra.",
      issues: "Bahas benturan budaya, risiko kehilangan talenta, biaya migrasi sistem, dan ketegangan antara pemusatan demi efisiensi dan pendelegasian demi kedekatan pasar.",
      conclusion: "Tetapkan struktur pilihan, prioritas kapabilitas, dan tiga langkah eksekusi pertama beserta ukuran keberhasilannya."
    }
  },
  {
    id: "sm10-insentif",
    title: "Target Penjualan Silang dan Rekening yang Tidak Pernah Diminta",
    subtitle: "Ketika sistem imbalan yang dirancang untuk mendorong strategi justru menghancurkannya",
    forSession: 10,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 11 tentang mengelola operasi internal, kebijakan, sistem informasi, dan imbalan",
    decisionMaker: "Direksi sebuah bank ritel berjaringan luas",
    decisionPoint: "Merancang ulang sistem target, kebijakan, dan imbalan agar mendukung strategi tanpa memicu perilaku menyimpang",
    relevance: "Kasus untuk alokasi sumber daya, kebijakan dan prosedur, sistem informasi, serta sistem imbalan sebagai alat eksekusi strategi.",
    sections: [
      { heading: "Strategi yang Masuk Akal",
        body: `<p>Strategi penjualan silang secara logika sangat masuk akal. Nasabah yang memiliki lebih banyak
produk pada satu bank lebih menguntungkan dan lebih kecil kemungkinannya berpindah. Karena itu banyak bank ritel
menetapkan sasaran jumlah produk per nasabah dan menurunkannya menjadi target harian bagi setiap kantor cabang dan
setiap petugas.</p>
<p>Kasus paling terkenal di dunia mengenai strategi ini terjadi pada sebuah bank besar di Amerika Serikat. Target
penjualan silang yang agresif diturunkan sampai tingkat individu, disertai pemantauan harian dan konsekuensi bagi
yang tidak mencapainya. Pada 2016 terungkap bahwa karyawan membuka jutaan rekening dan kartu tanpa sepengetahuan
nasabah untuk memenuhi target tersebut. Bank membayar denda besar, memberhentikan ribuan karyawan, dan kehilangan
kepercayaan publik selama bertahun-tahun.</p>
<p>Yang penting dicatat, strategi penjualan silangnya sendiri tidak keliru. Yang keliru adalah sistem eksekusinya:
target yang tidak realistis, pemantauan yang hanya mengukur keluaran, tekanan yang diteruskan ke bawah, serta
ketiadaan mekanisme yang menangkap sinyal peringatan lebih awal.</p>` },
      { heading: "Empat Alat Eksekusi yang Dibahas Bab 11",
        body: `<p>Buku teks menyebut beberapa alat yang dipakai manajemen untuk menjalankan strategi pada operasi
sehari-hari. <strong>Alokasi sumber daya</strong> menentukan ke mana dana dan orang diarahkan. <strong>Kebijakan
dan prosedur</strong> menetapkan cara kerja yang seragam. <strong>Sistem informasi</strong> memberi data untuk
memantau kemajuan. <strong>Sistem imbalan</strong> menghubungkan kinerja individu dengan sasaran perusahaan.</p>
<p>Keempatnya adalah alat yang kuat, dan justru karena kuat maka kesalahan rancangannya berdampak besar. Sistem
imbalan yang mengukur jumlah rekening yang dibuka akan menghasilkan lebih banyak rekening dibuka, apa pun caranya.
Sistem informasi yang hanya memantau keluaran tidak akan menangkap bagaimana keluaran itu dihasilkan.</p>
<p>Prinsip yang sering dikutip adalah bahwa organisasi memperoleh apa yang diukur dan diberi imbalan, bukan apa
yang tertulis dalam pernyataan nilai perusahaan.</p>` },
      { heading: "Merancang Ulang di Bank Ritel Indonesia",
        body: `<p>Sebuah bank ritel di Indonesia dengan ribuan kantor cabang menghadapi persoalan serupa dalam
skala berbeda. Keluhan nasabah tentang produk yang dijual tanpa penjelasan memadai meningkat, sementara pencapaian
target penjualan silang justru tampak membaik.</p>
<p>Direksi mempertimbangkan beberapa langkah: menurunkan bobot target volume dan menaikkan bobot ukuran mutu
seperti tingkat pemakaian produk setelah tiga bulan; menambahkan pemantauan proses berupa perekaman persetujuan
nasabah; menetapkan konsekuensi bagi manajer wilayah yang unitnya menunjukkan pola pembatalan tinggi; serta
membuka saluran umpan balik nasabah yang terhubung langsung ke evaluasi kinerja cabang.</p>
<p>Setiap langkah menurunkan pencapaian target jangka pendek dan menuntut investasi pada sistem informasi.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Ukuran Keluaran dan Ukuran Mutu",
        note: "Perhatikan perilaku yang didorong oleh masing-masing.",
        rows: [["Ukuran", "Jenis", "Perilaku yang didorong"],
               ["Jumlah rekening baru per petugas", "Keluaran", "Membuka rekening sebanyak mungkin"],
               ["Produk aktif setelah tiga bulan", "Mutu", "Menjual yang benar-benar dibutuhkan"],
               ["Tingkat pembatalan dalam 30 hari", "Mutu", "Menghindari penjualan yang dipaksakan"],
               ["Skor kepuasan nasabah cabang", "Mutu", "Menjaga pengalaman layanan"],
               ["Pertumbuhan dana pihak ketiga", "Keluaran", "Mengejar volume tanpa melihat cara"]] },
      { title: "Exhibit 2: Empat Alat Eksekusi dan Kegagalannya",
        note: "Cocokkan alat dengan kegagalan yang terjadi pada kasus rujukan.",
        rows: [["Alat eksekusi", "Rancangan yang keliru", "Akibatnya"],
               ["Alokasi sumber daya", "Investasi pada perekrutan, bukan pengawasan", "Kapasitas kontrol tertinggal"],
               ["Kebijakan dan prosedur", "Prosedur persetujuan nasabah lemah", "Celah penyalahgunaan"],
               ["Sistem informasi", "Hanya memantau keluaran", "Sinyal peringatan tidak terbaca"],
               ["Sistem imbalan", "Bonus terikat volume harian", "Tekanan mendorong perilaku menyimpang"]] }
    ],
    questions: [
      "Strategi penjualan silang tidak keliru, tetapi eksekusinya gagal. Jelaskan pada alat eksekusi mana kegagalan itu bermula, memakai Exhibit 2.",
      "Susun bauran ukuran kinerja untuk petugas cabang dengan memakai Exhibit 1. Bobot apa yang Anda berikan pada tiap ukuran, dan mengapa?",
      "Menurunkan bobot target volume akan menurunkan pencapaian jangka pendek. Bagaimana Anda mempertahankan keputusan itu di hadapan pemegang saham?",
      "Sistem informasi yang hanya memantau keluaran tidak menangkap cara hasil diperoleh. Data proses apa yang paling layak dipantau pada kasus ini?",
      "Sejauh mana manajemen senior bertanggung jawab atas perilaku menyimpang yang terjadi pada tingkat cabang?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai sistem eksekusi yang mendorong perilaku bertentangan dengan strategi yang hendak dicapai, bukan sebagai persoalan integritas individu semata.",
      alternatives: "Beri judul pada langkah-langkah perancangan ulang yang tersedia, sebutkan biaya dan dampaknya pada pencapaian jangka pendek.",
      issues: "Bahas ketegangan antara target jangka pendek dan mutu jangka panjang, keterbatasan sistem informasi, serta tanggung jawab berjenjang.",
      conclusion: "Tetapkan bauran ukuran kinerja dan mekanisme pengawasan yang konkret, lalu sebutkan langkah yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "sm11-renault",
    title: "Renault dan Nissan: Lahirnya Sebuah Aliansi Global",
    subtitle: "Bagaimana produsen nomor sembilan dunia mengalahkan raksasa dalam perebutan mitra, dengan kepercayaan sebagai mata uangnya",
    forSession: 11,
    badge: "Kasus resmi Kelompok 5",
    readingTime: 8,
    officialSource: "Bacaan resmi (PDF di Drive): Renault/Nissan: The Making of a Global Alliance, kasus ganda sudut pandang Renault dan Nissan (Korine, Gomez dan Asakawa; LBS, EM Lyon dan Keio)",
    driveUrl: "https://drive.google.com/file/d/1AfGOu0SAqfBHjgLRICLo6K_C3nKOzOfS/view",
    decisionMaker: "Louis Schweitzer (Chairman dan CEO Renault) dan Yoshikazu Hanawa (Chairman dan CEO Nissan)",
    decisionPoint: "Maret 1999, menjelang tutup tahun fiskal Jepang 30 Maret: Nissan harus memilih mitra antara Renault dan DaimlerChrysler; Renault harus memutuskan seberapa jauh berkomitmen",
    relevance: "Bab 12 (budaya korporat dan kepemimpinan): membangun kepercayaan lintas budaya, memimpin perubahan, dan merancang tata kelola aliansi.",
    sections: [
      { heading: "Geneva, Maret 1999",
        body: `<p>Pada pembukaan Geneva International Motor Show, 3 Maret 1999, perbincangan di aula utama tidak
berpusat pada mobil baru melainkan pada manuver korporasi: siapa yang akan beraliansi dengan Nissan, produsen
mobil terbesar kedua Jepang yang sedang terbebani utang. Dua kandidat berada di atas ring. Di satu sudut, Renault,
produsen kesembilan dunia dengan sekitar 4,3 persen pasar, yang telah bernegosiasi dengan Nissan lebih dari
sepuluh bulan. Di sudut lain, raksasa Jerman-Amerika DaimlerChrysler, produsen kelima dunia dengan 8,4 persen
pasar, yang baru masuk gelanggang pada Desember 1998. Tenggatnya nyata: kesepakatan harus rampung sebelum
30 Maret, akhir tahun fiskal di Jepang.</p>
<p>Di atas kertas, pertarungan itu timpang. Kekuatan finansial DaimlerChrysler menjadikannya favorit, dan mereka
baru saja mengguncang industri lewat merger Daimler dan Chrysler setahun sebelumnya. Renault justru membawa luka:
upaya aliansinya dengan Volvo berakhir gagal pada 1993 setelah bertahun-tahun negosiasi. Namun para pemimpin
Renault yakin sinergi Renault dengan Nissan lebih besar daripada sinergi DaimlerChrysler dengan Nissan, dan
keyakinan itu telah mereka bangun pelan-pelan melalui hubungan antar tim negosiasi selama berbulan-bulan
(dokumen kasus, sudut pandang Renault).</p>` },
      { heading: "Logika Strategis Kedua Belah Pihak",
        body: `<p>Dari sisi Renault, rencana pengembangan internasional yang disusun Georges Douin pada 1997
menyimpulkan bahwa Renault harus memilih: tetap menjadi pemain Eropa yang penting tetapi terbatas dengan pangsa
sekitar 5 persen, atau melompat ke panggung global lewat kemitraan, karena gelombang konsolidasi industri tampak
tak terhindarkan. Nissan menawarkan komplementaritas yang hampir sempurna: kuat di Asia dan Amerika Utara tempat
Renault absen, unggul dalam rekayasa dan kualitas manufaktur, sementara Renault kuat di Eropa dan Amerika Latin,
unggul dalam desain, inovasi produk, dan pengelolaan biaya pembelian.</p>
<p>Dari sisi Nissan, persoalannya adalah keuangan dan pembaruan. Utang yang menumpuk (dokumen kasus menyebut
angka hingga 23 miliar euro beserta jadwal pembayarannya) membuat Nissan membutuhkan suntikan modal segera,
tetapi Hanawa tidak sekadar mencari uang. Ia mencari mitra yang memberi <strong>status setara</strong> dan ruang
bagi Nissan untuk mempertahankan identitasnya, bukan pengakuisisi yang akan menelannya. Surat-menyurat pribadi
antara Hanawa dan Schweitzer sejak pertengahan 1998 membangun keyakinan bahwa Renault memahami hal itu.</p>
<p>Perbedaan pendekatan kedua pelamar menjadi penentu. Tim Renault dan Nissan telah menjalankan studi bersama
menilai sinergi konkret: platform bersama, kebijakan pembelian, dan jaringan distribusi, sehingga angka-angka
sinerginya dimiliki bersama, bukan dipaksakan satu pihak. Ketika DaimlerChrysler akhirnya mundur dari negosiasi
pada awal Maret 1999, Renault tinggal menuntaskan syarat-syaratnya.</p>` },
      { heading: "Kesepakatan 27 Maret 1999",
        body: `<p>Aliansi ditandatangani pada 27 Maret 1999. Renault mengambil <strong>36,8 persen</strong> saham
Nissan Motor, dengan struktur yang sengaja dirancang sebagai aliansi dua perusahaan yang tetap berdiri sendiri,
bukan merger: masing-masing mempertahankan merek, identitas, dan pencatatan sahamnya, dengan komite bersama untuk
mengelola sinergi. Carlos Ghosn, saat itu executive vice president Renault yang dikenal keras dalam pengendalian
biaya, dikirim ke Tokyo untuk memimpin pemulihan Nissan.</p>
<p>Bagi kelas budaya dan kepemimpinan, bagian paling kaya dari kasus ini adalah prosesnya, bukan angkanya:
bagaimana kepercayaan dibangun antara dua organisasi dengan bahasa, praktik keiretsu, dan cara mengambil
keputusan yang sangat berbeda; bagaimana Hanawa mengelola konsensus internal Nissan; dan bagaimana Renault
menahan diri untuk tidak berperilaku sebagai pemenang.</p>` },
      { heading: "Epilog: Perkembangan Sesudah Periode Kasus",
        body: `<p><em>Bagian ini melampaui periode kasus. Gunakan untuk menguji analisis Anda, bukan sebagai bahan
analisis utama.</em></p>
<p>Pemulihan Nissan di bawah Ghosn berlangsung jauh lebih cepat dari perkiraan dan menjadikannya salah satu
eksekutif paling terkenal di dunia; ia kemudian memimpin Renault dan Nissan sekaligus. Dua dekade kemudian
struktur yang tidak seimbang, kepemilikan Renault yang besar atas Nissan tanpa hak suara timbal balik yang
setara, menjadi sumber ketegangan yang tidak pernah selesai. Penangkapan Ghosn di Tokyo pada 2018 menghilangkan
figur penengah aliansi, dan baru pada 2023 kedua perusahaan menyepakati penyetaraan kepemilikan silang. Pertanyaan
untuk kelas: apakah benih ketegangan itu sudah terlihat dalam rancangan kesepakatan 1999?</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Dua Pelamar di Mata Nissan, Awal 1999",
        note: "Sintesis dari narasi kasus; periksa detail pada PDF asli.",
        rows: [["Aspek", "Renault", "DaimlerChrysler"],
               ["Posisi dunia", "Ke-9, sekitar 4,3% pasar", "Ke-5, sekitar 8,4% pasar"],
               ["Kekuatan finansial", "Terbatas", "Sangat besar"],
               ["Lama pendekatan ke Nissan", "Lebih dari 10 bulan, studi sinergi bersama", "Sejak Desember 1998"],
               ["Tawaran status", "Aliansi setara, identitas Nissan dijaga", "Dikhawatirkan menyerupai akuisisi"],
               ["Pengalaman aliansi", "Gagal dengan Volvo (1993), menjadi pelajaran", "Merger Daimler-Chrysler (1998)"]] },
      { title: "Exhibit 2: Komplementaritas yang Mendasari Sinergi",
        note: "Kerangka analisis untuk bagian Issues.",
        rows: [["Dimensi", "Kekuatan Renault", "Kekuatan Nissan"],
               ["Geografi", "Eropa, Amerika Latin", "Asia, Amerika Utara"],
               ["Produk dan teknik", "Desain, mobil kecil, inovasi produk", "Rekayasa, kualitas manufaktur"],
               ["Manajemen biaya", "Pembelian dan pengendalian biaya", "Perlu pembaruan (praktik keiretsu)"],
               ["Kebutuhan", "Skala global", "Modal dan pembaruan manajemen"]] }
    ],
    questions: [
      "Mengapa Nissan memilih penawar yang lebih kecil dan lebih miskin? Pisahkan faktor ekonomi dari faktor kepercayaan dan status, lalu timbang bobot masing-masing.",
      "Proses sepuluh bulan Renault (studi sinergi bersama, surat-menyurat pemimpin) adalah investasi membangun kepercayaan lintas budaya. Praktik mana yang paling menentukan, dan dapatkah dipercepat?",
      "Struktur 1999 memilih aliansi dua entitas alih-alih merger penuh. Analisis pertukaran pilihan itu bagi eksekusi sinergi dan bagi identitas masing-masing perusahaan.",
      "Dengan kerangka Bab 12, jelaskan peran kepemimpinan (Schweitzer, Hanawa, kemudian Ghosn) dalam membuat aliansi ini bekerja melampaui dokumen legalnya.",
      "Epilog menunjukkan ketegangan struktural yang meledak dua dekade kemudian. Rancangan tata kelola seperti apa pada 1999 yang mungkin mencegahnya, dan apa biayanya saat itu?"
    ],
    guide: {
      problem: "Rumuskan masalahnya dari sudut pandang yang Anda pilih (Renault atau Nissan): bukan sekadar memilih mitra, melainkan merancang kemitraan yang menyelesaikan kebutuhan strategis tanpa menghancurkan identitas dan kepercayaan.",
      alternatives: "Beri judul alternatif dari sudut pandang itu, misalnya bagi Nissan: 'Aliansi setara dengan Renault', 'Bergabung dengan DaimlerChrysler', 'Restrukturisasi mandiri'. Sebutkan konsekuensi modal, kendali, dan budaya tanpa argumen pro dan kontra.",
      issues: "Bahas kesenjangan finansial kedua pelamar, risiko integrasi lintas budaya, pelajaran kegagalan Volvo, tekanan tenggat fiskal, dan keberlanjutan struktur kepemilikan yang timpang.",
      conclusion: "Ambil posisi, sebutkan syarat-syarat kunci yang akan Anda tuntut dalam perjanjian, dan indikator awal bahwa aliansi berjalan dalam dua tahun pertama."
    }
  },

  {
    id: "sm12-nike",
    title: "Hitting the Wall: Nike dan Praktik Ketenagakerjaan Internasional",
    subtitle: "Ketika strategi alih daya yang paling berhasil di dunia menabrak batas tanggung jawabnya sendiri",
    forSession: 12,
    badge: "Kasus resmi Kelompok 6",
    readingTime: 8,
    officialSource: "Bacaan resmi (PDF di Drive): Spar, D.L. dan Burns, J. (2000, rev. 2002), Hitting the Wall: Nike and International Labor Practices, Harvard Business School 9-700-047",
    driveUrl: "https://drive.google.com/file/d/1EkrKjtYCcwPqY_mOGj_0opB3EVBankWM/view",
    decisionMaker: "Phil Knight, CEO Nike, dan manajemen senior perusahaan",
    decisionPoint: "1998, menentukan respons perusahaan setelah bertahun-tahun kritik atas kondisi kerja di pabrik mitra: bertahan dengan argumen lama atau mengubah sikap secara mendasar",
    relevance: "Bab 9 (etika bisnis, tanggung jawab sosial, dan keberlanjutan sebagai bagian strategi), penutup seluruh mata kuliah.",
    sections: [
      { heading: "Strategi yang Membesarkan Nike",
        body: `<p>Nike dibangun di atas gagasan sederhana yang dirumuskan Phil Knight sejak masih mahasiswa: perusahaan
akan menekan biaya dengan <strong>mengalihdayakan seluruh produksi</strong> kepada pabrik kontraktor independen di
negara berupah rendah, lalu menuangkan sumber dayanya ke desain dan pemasaran (Spar dan Burns, 2000). Tidak ada
pabrik milik sendiri; yang dimiliki Nike adalah merek, teknologi produk, dan jaringan kontrak.</p>
<p>Hasilnya luar biasa. Pendapatan tumbuh dari 60 ribu dolar pada 1972 menjadi 49 juta dolar pada 1982, lalu
melampaui 9 miliar dolar pada pertengahan 1990-an. Pada 1998, Nike menguasai lebih dari 40 persen pasar alas kaki
atletik Amerika Serikat yang bernilai 14,7 miliar dolar. Produksi mengikuti upah: dari Jepang berpindah ke Korea
Selatan dan Taiwan, lalu ketika upah di sana naik, ke Indonesia, Tiongkok, dan Vietnam. Indonesia menjadi lokasi
penting dengan enam pabrik pemasok pada awal 1990-an.</p>
<p>Dari sudut pandang buku teks, ini adalah strategi alih daya yang nyaris sempurna: fokus pada kompetensi inti,
struktur biaya variabel, dan kelincahan berpindah lokasi. Kasus ini memperlihatkan sisi lain dari strategi
tersebut.</p>` },
      { heading: "Kritik yang Menemukan Wajahnya",
        body: `<p>Persoalan bermula dari hal-hal yang tampak teknis. Upah minimum di Jakarta pada awal 1990-an
hampir tidak mencapai satu dolar per hari, dan pemerintah saat itu mengakui angka tersebut belum memenuhi
kebutuhan hidup dasar. Sebagian pabrik bahkan meminta pengecualian membayar di bawah upah minimum dengan status
upah percobaan yang berlarut-larut. Aktivis buruh Jeff Ballinger, yang bertahun-tahun bekerja di Indonesia,
menjadikan Nike sasaran kampanye dengan logika sederhana: perusahaan yang paling besar dan paling terlihat harus
memikul tanggung jawab paling besar.</p>
<p>Sepanjang 1990-an kritik menumpuk: pekerja di bawah umur di pabrik Indonesia, lembur yang dipaksakan di
Tiongkok, kondisi kerja berbahaya di Vietnam. Pada 1997 seorang pekerja perempuan Vietnam berusia 23 tahun,
Nguyen Thi Thu Phuong, tewas di pabrik kontraktor ketika mesin rekannya pecah dan melontarkan serpihan logam.
Cerita yang semula beredar di kalangan aktivis masuk ke Time dan Business Week; mahasiswa di berbagai kampus
Amerika menggalang boikot; dan jawaban awal perusahaan, bahwa Nike tidak membuat sepatu sehingga urusan pabrik
bukan urusannya, semakin sulit dipertahankan.</p>
<p>Respons bertahap perusahaan justru menambah bahan kritik. Kode etik pemasok diterbitkan sejak 1992; Ernst &amp;
Young dikontrak mengaudit pabrik, tetapi objektivitas auditor yang dibayar Nike dipertanyakan, dan sebuah laporan
audit yang bocor memperlihatkan masalah yang tidak diumumkan. Evaluasi independen oleh Andrew Young pada 1997
dinilai para kritikus terlalu lunak karena tidak menyentuh persoalan upah.</p>` },
      { heading: "Titik Balik 1998",
        body: `<p>Tekanan mencapai puncaknya ketika penjualan melemah dan perusahaan mengumumkan restrukturisasi
serta pemutusan hubungan kerja. Pada 12 Mei 1998, di National Press Club, Knight mengakui secara terbuka bahwa
produk Nike telah menjadi identik dengan upah budak, lembur paksa, dan kesewenang-wenangan, lalu mengumumkan
serangkaian pembaruan: menaikkan usia minimum pekerja pabrik sepatu menjadi 18 tahun dan pekerja pakaian menjadi
16 tahun; menerapkan standar kualitas udara OSHA Amerika Serikat di seluruh pabrik; memperluas program
pemantauan; memperluas program pendidikan bagi pekerja; dan menyediakan pinjaman mikro (Spar dan Burns, 2000).</p>
<p>Nike kemudian ikut membentuk Fair Labor Association, asosiasi multi-pihak yang mewajibkan anggotanya membayar
setidaknya upah minimum legal atau upah setempat yang berlaku, dengan pemantauan oleh pihak eksternal.</p>
<p>Pertanyaan analitis kasus ini bukan apakah Nike akhirnya berubah, melainkan mengapa perubahan itu memakan waktu
hampir satu dekade, dan sejauh mana komitmen 1998 menyelesaikan persoalan strukturalnya: insentif pembelian yang
menekan harga dan tenggat tetap berhadapan dengan standar kerja yang menaikkan biaya pabrik mitra.</p>` },
      { heading: "Pertanyaan yang Tetap Hidup",
        body: `<p>Kasus ini ditulis pada 2000 dan sengaja menggantung. Sebagian ukuran keberhasilan baru terlihat
bertahun-tahun kemudian, dan sebagian persoalan berpindah bentuk: pemantauan pabrik lapis kedua, kebebasan
berserikat, dan pembayaran pesangon ketika pesanan berpindah. Bagi mahasiswa Indonesia, kasus ini juga bisa dibaca
dari arah sebaliknya: apa artinya standar global semacam ini bagi pabrik dan pekerja Indonesia yang menjadi bagian
rantai pasok merek dunia.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Kronologi Ringkas dari Kasus",
        note: "Disarikan dari dokumen kasus; periksa detail dan kutipan lengkapnya pada PDF asli.",
        rows: [["Periode", "Peristiwa"],
               ["1962-1972", "Formula Knight: alih daya penuh produksi, fokus pada merek; pendapatan awal 60 ribu dolar (1972)"],
               ["1980-an", "Produksi berpindah dari Korea dan Taiwan ke Indonesia, Tiongkok, Vietnam"],
               ["1992", "Kode etik pemasok pertama dilampirkan pada kontrak"],
               ["1996", "Departemen Praktik Ketenagakerjaan dibentuk; audit Ernst & Young dipersoalkan"],
               ["1997", "Laporan Andrew Young; kematian Nguyen Thi Thu Phuong; audit bocor"],
               ["12 Mei 1998", "Pidato National Press Club: usia minimum 18 tahun, standar udara OSHA, perluasan pemantauan"],
               ["1999", "Fair Labor Association terbentuk"]] },
      { title: "Exhibit 2: Argumen yang Saling Berhadapan",
        note: "Kerangka untuk latihan analisis empat komponen.",
        rows: [["Isu", "Posisi perusahaan (awal)", "Posisi kritikus"],
               ["Status pabrik", "Milik kontraktor independen", "Nike mengendalikan lewat pesanan, maka bertanggung jawab"],
               ["Upah", "Sesuai hukum setempat", "Upah minimum setempat tidak memenuhi kebutuhan dasar"],
               ["Audit", "Sudah ada auditor profesional", "Auditor dibayar perusahaan, hasilnya tidak terbuka"],
               ["Perbandingan upah", "Wajar untuk negara berkembang", "Upah harian pekerja jauh di bawah harga sepasang sepatu"]] }
    ],
    questions: [
      "Jawaban awal perusahaan benar secara hukum tetapi gagal secara publik. Jelaskan mengapa batas tanggung jawab yang dipakai publik berbeda dari batas kepemilikan hukum.",
      "Mengapa langkah-langkah 1992 sampai 1997 (kode etik, audit, evaluasi independen) tidak meredakan tekanan? Apa yang membedakan langkah 1998?",
      "Analisis persoalan ini dengan kerangka Bab 9: apakah komitmen 1998 merupakan strategi etika yang tulus, manajemen risiko reputasi, atau keduanya, dan apakah perbedaannya penting?",
      "Insentif pembelian (harga dan tenggat) berhadapan dengan standar kerja pabrik mitra. Perubahan apa pada praktik pembelian yang paling menentukan agar standar benar-benar dijalankan?",
      "Dari sudut pandang pemasok Indonesia merek global hari ini, pelajaran apa dari kasus ini yang paling relevan, dan bagaimana pemasok sebaiknya memposisikan diri?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai kesenjangan antara batas tanggung jawab hukum perusahaan dan batas tanggung jawab yang dituntut pemangku kepentingan atas rantai pasok yang dikendalikannya secara ekonomi.",
      alternatives: "Beri judul alternatif respons perusahaan pada 1998, misalnya 'Bertahan dengan argumen hukum', 'Reformasi standar dan pemantauan', dan 'Integrasi sebagian produksi ke milik sendiri'. Sebutkan biaya dan konsekuensi tiap alternatif tanpa argumen pro dan kontra.",
      issues: "Bahas kredibilitas pemantauan, ekonomi upah di negara produksi, dampak boikot pada merek, dan ketegangan antara insentif pembelian dan standar kerja.",
      conclusion: "Ambil posisi atas respons yang seharusnya diambil pada 1998, tetapkan ukuran keberhasilan yang dapat diverifikasi pihak luar, dan sebutkan alternatif yang Anda tolak beserta alasannya."
    }
  }
  ];
  C.cases = (C.cases || []).concat(cases).sort((a, b) => a.forSession - b.forSession);
})();
