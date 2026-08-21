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
    subtitle: "Menguji sumber daya dan kapabilitas sebuah klub ketika aset terpentingnya adalah seseorang yang pensiun",
    forSession: 5,
    badge: "Kasus resmi Kelompok 4",
    readingTime: 7,
    officialSource: "Bacaan resmi: Grant, R.M. (2010), Contemporary Strategy Analysis, Bab 6. Primer ini mempercepat pemahaman, bukan menggantikannya.",
    decisionMaker: "Manajemen eksekutif klub dan pemiliknya",
    decisionPoint: "Mempertahankan keunggulan kompetitif klub setelah pensiunnya manajer yang memimpin selama dua puluh enam tahun",
    relevance: "Kasus utama untuk analisis sumber daya dan kapabilitas, kerangka VRIO, dan pertanyaan tentang keunggulan yang melekat pada individu.",
    sections: [
      { heading: "Dua Puluh Enam Tahun Satu Manajer",
        body: `<p>Sir Alex Ferguson menjabat sebagai manajer Manchester United dari 1986 hingga pensiun pada 2013.
Pada masa itu klub memenangi tiga belas gelar liga domestik dan dua trofi kompetisi klub Eropa tertinggi, dan
berubah dari klub sepak bola menjadi merek global dengan pendapatan komersial yang menyaingi pendapatan
pertandingan dan penyiaran.</p>
<p>Keberhasilan itu bertumpu pada beberapa hal yang saling menguatkan: sistem pembinaan pemain muda yang
menghasilkan generasi pemain berbiaya rendah, kemampuan manajer membangun ulang tim beberapa kali tanpa kehilangan
daya saing, disiplin ruang ganti, serta kemampuan bertahan pada momen-momen menentukan yang oleh pers Inggris
dijuluki waktu tambahan Ferguson.</p>
<p>Ketika ia mengumumkan pensiun, pertanyaan yang muncul bukan sekadar siapa penggantinya, melainkan apa
sesungguhnya sumber keunggulan klub selama ini, dan berapa banyak di antaranya yang ikut pergi bersamanya.</p>` },
      { heading: "Memisahkan Sumber Daya dari Kapabilitas",
        body: `<p>Analisis Grant membedakan sumber daya, yaitu aset yang dimiliki, dari kapabilitas, yaitu
kemampuan organisasi memakai aset itu untuk mencapai hasil. Klub ini memiliki sumber daya yang jelas: merek global,
stadion berkapasitas besar, basis pendukung di banyak negara, kontrak sponsor bernilai tinggi, akademi pemain muda,
dan kemampuan finansial merekrut pemain.</p>
<p>Kapabilitasnya lebih sulit dipetakan. Kemampuan mengembangkan pemain muda menjadi pemain tim utama, kemampuan
membangun ulang skuad, dan kemampuan menjaga budaya menang adalah kapabilitas yang selama dua puluh enam tahun
melekat pada satu orang.</p>
<p>Di sinilah kerangka VRIO menjadi tajam. Sebuah sumber daya bernilai, langka, sulit ditiru, dan didukung
organisasi akan menghasilkan keunggulan berkelanjutan. Namun bila kapabilitas itu berada pada individu, bukan pada
sistem, maka ketika individu itu pergi, keunggulannya ikut pergi. Pertanyaan pentingnya adalah sejauh mana klub
telah mengubah keahlian pribadi menjadi rutinitas organisasi.</p>
<p>Musim-musim setelah 2013 memberi jawaban yang keras. Klub berganti manajer beberapa kali, membelanjakan dana
besar untuk pemain, dan tidak lagi memenangi gelar liga, meskipun pendapatan komersialnya tetap tumbuh.</p>` },
      { heading: "Bisnis yang Terus Tumbuh, Prestasi yang Menurun",
        body: `<p>Fakta yang membuat kasus ini menarik adalah terpisahnya kinerja olahraga dari kinerja komersial.
Pendapatan klub tetap termasuk tertinggi di dunia karena kontrak sponsor dan penyiaran berjangka panjang tidak
langsung terkait hasil pertandingan musim berjalan.</p>
<p>Namun pemisahan itu memiliki batas. Ketiadaan partisipasi di kompetisi Eropa tertinggi mengurangi pendapatan dan
memicu klausul penurunan nilai pada sebagian kontrak sponsor. Dalam jangka panjang, daya tarik komersial bertumpu
pada relevansi olahraga.</p>
<p>Struktur kepemilikan menambah lapisan. Pengambilalihan klub dengan pembiayaan utang membebani neraca dengan
bunga yang harus dibayar dari arus kas operasi, sehingga dana yang tersedia untuk skuad bersaing dengan kewajiban
pembayaran utang.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Uji VRIO atas Sumber Daya dan Kapabilitas Klub",
        note: "Isi kolom kesimpulan sebagai latihan sebelum diskusi kelas.",
        rows: [["Sumber daya atau kapabilitas", "Bernilai", "Langka", "Sulit ditiru", "Didukung organisasi"],
               ["Merek global dan basis pendukung", "Ya", "Ya", "Ya", "Ya"],
               ["Stadion dan pendapatan pertandingan", "Ya", "Sebagian", "Sebagian", "Ya"],
               ["Akademi pemain muda", "Ya", "Sebagian", "Sebagian", "Dipertanyakan"],
               ["Kemampuan membangun ulang skuad", "Ya", "Ya", "Ya", "Melekat pada individu"],
               ["Kemampuan finansial merekrut", "Ya", "Tidak", "Tidak", "Terbatas beban utang"]] },
      { title: "Exhibit 2: Dua Ukuran Kinerja yang Bergerak Berbeda",
        note: "Arah pergerakan disusun sebagai gambaran umum untuk diskusi, bukan data laporan keuangan lengkap.",
        rows: [["Periode", "Kinerja olahraga", "Pendapatan komersial"],
               ["1993 sampai 2013", "Dominan di liga domestik", "Tumbuh pesat"],
               ["2013 sampai sekarang", "Tanpa gelar liga", "Tetap tumbuh, lalu melambat"],
               ["Implikasi", "Keunggulan olahraga tidak berkelanjutan", "Bergantung pada relevansi olahraga jangka panjang"]] }
    ],
    questions: [
      "Terapkan kerangka VRIO pada Exhibit 1. Sumber daya atau kapabilitas mana yang benar-benar menghasilkan keunggulan berkelanjutan, dan mana yang tidak?",
      "Sejauh mana keunggulan klub melekat pada individu, dan sejauh mana ia telah menjadi rutinitas organisasi? Bukti apa yang mendukung penilaian Anda?",
      "Exhibit 2 menunjukkan kinerja olahraga dan komersial bergerak berbeda. Berapa lama pemisahan itu dapat bertahan, dan apa yang menentukan batasnya?",
      "Bagaimana sebuah organisasi mengubah keahlian pribadi seorang pemimpin menjadi kapabilitas yang tertanam dalam sistem? Sebutkan mekanisme konkretnya.",
      "Jika Anda menjadi manajemen klub pada 2013, tiga langkah apa yang Anda ambil untuk melindungi keunggulan sebelum pensiunnya manajer berlaku?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai kegagalan melembagakan kapabilitas yang selama ini melekat pada seorang individu. Hindari menuliskan bahwa masalahnya adalah pensiunnya manajer.",
      alternatives: "Beri judul pada setiap alternatif, misalnya 'Merekrut manajer dengan profil serupa', 'Membangun struktur direktur olahraga', dan 'Mengubah model menjadi berbasis data dan akademi'. Sebutkan sumber daya yang dituntut masing-masing tanpa argumen pro dan kontra.",
      issues: "Uji tiap alternatif dengan VRIO, pertimbangkan beban utang, tekanan hasil jangka pendek, dan kesabaran pemilik serta pendukung.",
      conclusion: "Ambil posisi, sebutkan indikator keberhasilan pada horizon tiga sampai lima tahun, dan tunjukkan alternatif yang Anda tolak beserta alasannya."
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
    title: "Apple dan iPhone: Melengkapi Strategi Kompetitif serta Bersaing di Pasar Asing",
    subtitle: "Ekosistem, waktu masuk pasar, dan cara satu perusahaan menghadapi aturan lokal",
    forSession: 7,
    badge: "Kasus resmi Kelompok 1",
    readingTime: 7,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 6 dan 7 tentang langkah strategis pelengkap dan persaingan di pasar asing",
    decisionMaker: "Manajemen sebuah perusahaan teknologi global",
    decisionPoint: "Menentukan cara memasuki dan mempertahankan posisi di pasar berkembang dengan aturan kandungan lokal dan daya beli yang berbeda",
    relevance: "Kasus untuk aliansi, integrasi vertikal, waktu masuk pasar, dan pilihan antara strategi global dan penyesuaian lokal.",
    sections: [
      { heading: "Produk Tunggal yang Menjadi Ekosistem",
        body: `<p>Ketika iPhone diperkenalkan pada 2007, ia adalah satu produk. Yang membuatnya bertahan sebagai
sumber laba selama lebih dari satu setengah dekade bukan produk itu sendiri, melainkan lapisan yang dibangun di
sekelilingnya: toko aplikasi dengan bagian pendapatan dari pengembang, layanan berlangganan, perangkat pendamping
yang hanya bekerja optimal dengan perangkat lain dalam ekosistem yang sama, serta pengendalian atas perancangan
prosesor sendiri.</p>
<p>Dalam bahasa Bab 6, ini adalah rangkaian langkah pelengkap: integrasi vertikal ke perancangan cip, perluasan ke
layanan, dan pembangunan biaya berpindah yang membuat pengguna enggan keluar dari ekosistem. Setiap langkah
memperkuat langkah lainnya.</p>
<p>Laba industri telepon pintar terkonsentrasi pada segelintir pemain, dan porsi terbesarnya diambil oleh pemain
yang menguasai segmen harga atas. Perusahaan ini tidak pernah mengejar pangsa unit terbesar, melainkan pangsa laba
terbesar.</p>` },
      { heading: "Pasar Berkembang dengan Aturan Sendiri",
        body: `<p>Strategi global yang menstandardisasi produk di seluruh dunia menghadapi ujian di pasar
berkembang. Di Indonesia, ketentuan tingkat kandungan dalam negeri mewajibkan produsen telepon seluler memenuhi
persentase kandungan lokal tertentu untuk dapat menjual perangkat jaringan tertentu. Pemenuhan dapat ditempuh
melalui manufaktur, pengembangan perangkat lunak, atau skema investasi inovasi.</p>
<p>Perusahaan ini memilih jalur yang berbeda dari sebagian pesaingnya yang membangun perakitan lokal. Ia menempuh
skema investasi berupa pusat pengembangan bagi pengembang aplikasi. Kebijakan itu kemudian menjadi bahan
perdebatan publik ketika pemerintah mempersoalkan pemenuhan komitmen investasi yang menjadi dasar sertifikasi.</p>
<p>Persoalan kedua adalah daya beli. Harga perangkat kelas atas setara dengan penghasilan bulanan sebagian besar
pekerja Indonesia, sehingga pasar utamanya adalah segmen sempit di kota besar. Sementara itu pesaing dari Tiongkok
menguasai segmen menengah dengan spesifikasi tinggi pada harga jauh lebih rendah.</p>` },
      { heading: "Pilihan yang Terbuka",
        body: `<p>Tiga arah dapat dipertimbangkan. Pertama, mempertahankan strategi global tanpa penyesuaian
signifikan dan menerima pangsa unit yang kecil dengan laba per unit tinggi. Kedua, berinvestasi dalam manufaktur
lokal untuk memenuhi ketentuan kandungan dalam negeri secara permanen sekaligus memperoleh keringanan biaya masuk.
Ketiga, memperluas jangkauan lewat produk generasi sebelumnya dan skema pembiayaan cicilan yang menurunkan hambatan
harga tanpa menurunkan posisi merek.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Langkah Strategis Pelengkap dan Fungsinya",
        note: "Perhatikan bagaimana tiap langkah memperkuat langkah lain.",
        rows: [["Langkah", "Bentuknya", "Fungsi strategis"],
               ["Integrasi vertikal", "Perancangan prosesor sendiri", "Kendali kinerja dan diferensiasi"],
               ["Perluasan ke layanan", "Langganan dan toko aplikasi", "Pendapatan berulang"],
               ["Perangkat pendamping", "Jam tangan, pelantang telinga", "Menaikkan biaya berpindah"],
               ["Kendali kanal", "Gerai resmi dan program tukar tambah", "Menjaga pengalaman dan harga"]] },
      { title: "Exhibit 2: Tiga Arah di Pasar Indonesia",
        note: "Bahan pembanding untuk bagian Issues.",
        rows: [["Arah", "Kepatuhan kandungan lokal", "Jangkauan pasar", "Risiko"],
               ["Pertahankan strategi global", "Lewat skema investasi", "Sempit", "Ketidakpastian kebijakan"],
               ["Bangun manufaktur lokal", "Terpenuhi permanen", "Menengah", "Komitmen modal besar"],
               ["Perluas lewat produk generasi lama dan cicilan", "Tidak berubah", "Lebih luas", "Potensi menggerus posisi merek"]] }
    ],
    questions: [
      "Jelaskan bagaimana langkah-langkah pada Exhibit 1 saling memperkuat. Mengapa rangkaian itu sulit ditiru sebagian?",
      "Perusahaan ini mengejar pangsa laba, bukan pangsa unit. Apakah pilihan itu berkelanjutan di pasar yang pertumbuhannya berasal dari segmen menengah?",
      "Ketentuan kandungan dalam negeri memaksa penyesuaian lokal pada strategi yang pada dasarnya global. Bagaimana Anda menempatkan situasi ini pada kerangka strategi global dan multidomestik?",
      "Nilai ketiga arah pada Exhibit 2 dengan mempertimbangkan hubungan jangka panjang dengan pemerintah dan posisi merek.",
      "Apa pelajaran dari kasus ini bagi perusahaan Indonesia yang ingin membangun ekosistem produk, bukan sekadar menjual produk tunggal?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai ketegangan antara strategi global yang menstandardisasi dan tuntutan penyesuaian dari kebijakan serta daya beli pasar setempat.",
      alternatives: "Beri judul pada ketiga arah, sebutkan komitmen modal dan konsekuensi kebijakannya tanpa argumen pro dan kontra.",
      issues: "Bahas ketidakpastian regulasi, biaya kepatuhan, risiko posisi merek, dan struktur laba industri yang terkonsentrasi.",
      conclusion: "Pilih satu arah, sebutkan langkah pelaksanaan pertama, dan jelaskan alternatif yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "sm8-nyt",
    title: "The New York Times: Diversifikasi atau Transformasi Model Bisnis",
    subtitle: "Ketika perusahaan media memutuskan menjual langganan, bukan menjual perhatian pembaca",
    forSession: 8,
    badge: "Kasus resmi Kelompok 2",
    readingTime: 7,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 8 tentang strategi diversifikasi",
    decisionMaker: "Direksi sebuah perusahaan surat kabar terkemuka",
    decisionPoint: "Menentukan apakah pertumbuhan dikejar lewat diversifikasi bisnis baru atau lewat pendalaman model langganan digital",
    relevance: "Kasus untuk membedakan diversifikasi terkait, tidak terkait, dan transformasi model bisnis dalam industri yang sama.",
    sections: [
      { heading: "Industri yang Runtuh Pendapatannya",
        body: `<p>Model bisnis surat kabar selama satu abad bertumpu pada iklan. Pembaca membayar sebagian kecil
biaya, dan sebagian besar pendapatan berasal dari pengiklan yang membeli akses ke perhatian pembaca. Ketika mesin
pencari dan media sosial menawarkan penargetan yang jauh lebih presisi dengan harga lebih rendah, pendapatan iklan
surat kabar di seluruh dunia runtuh dalam waktu satu dekade.</p>
<p>Banyak penerbit merespons dengan memperbanyak halaman terbaca melalui konten ringan agar tetap menarik
pengiklan, sebuah jalan yang menekan biaya redaksi dan mengikis alasan pembaca membayar.</p>
<p>Perusahaan ini memilih jalan yang berlawanan. Ia memasang dinding berbayar pada 2011, pada saat sebagian besar
pesaing membuka isinya gratis, dan menegaskan bahwa produknya adalah jurnalisme yang layak dibayar. Keputusan itu
disertai investasi besar pada redaksi ketika arah industri adalah pemangkasan.</p>` },
      { heading: "Menumbuhkan Sesuatu yang Bukan Berita",
        body: `<p>Langkah berikutnya lebih menarik dari sudut pandang strategi korporat. Perusahaan mengakuisisi
dan mengembangkan produk yang bukan berita: permainan kata harian, aplikasi resep masak, dan situs ulasan produk.
Produk-produk itu memiliki pola pemakaian harian yang kuat dan menurunkan tingkat berhenti berlangganan.</p>
<p>Pertanyaan strategisnya adalah bagaimana menggolongkan langkah ini. Jika kita mendefinisikan bisnis perusahaan
sebagai berita, maka permainan kata dan resep masak adalah diversifikasi ke bisnis yang tidak terkait. Jika kita
mendefinisikannya sebagai langganan digital berbayar untuk kebiasaan harian, maka semuanya adalah bisnis yang sama
dengan produk berbeda, dan yang terjadi adalah transformasi model bisnis, bukan diversifikasi.</p>
<p>Uji keterkaitan yang lazim dipakai adalah apakah terdapat kecocokan strategis yang menghasilkan nilai lebih
besar daripada jumlah bagian-bagiannya. Di sini kecocokan itu tampak nyata: teknologi langganan yang sama, data
perilaku pembaca yang sama, merek yang sama, dan kanal pemasaran yang sama.</p>
<p>Perusahaan kemudian menetapkan sasaran jumlah pelanggan digital yang ambisius dan mencapainya lebih cepat dari
jadwal, dengan pendapatan digital akhirnya melampaui pendapatan cetak.</p>` },
      { heading: "Pertanyaan yang Tersisa",
        body: `<p>Keberhasilan itu memunculkan pertanyaan baru. Paket berlangganan gabungan menaikkan nilai bagi
pelanggan tetapi menyulitkan penetapan harga per produk. Redaksi mempertanyakan apakah produk hiburan menggeser
identitas jurnalistik perusahaan. Pertumbuhan pelanggan di luar negara asal menuntut penyesuaian isi yang dapat
berbenturan dengan sudut pandang redaksi pusat.</p>
<p>Di sisi lain, kecerdasan buatan generatif memunculkan ancaman baru terhadap lalu lintas rujukan dari mesin
pencari sekaligus pertanyaan tentang penggunaan karya jurnalistik untuk melatih model.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Diversifikasi atau Transformasi",
        note: "Jawaban bergantung pada bagaimana bisnis inti didefinisikan.",
        rows: [["Definisi bisnis inti", "Permainan kata dan resep masak dianggap", "Uji kecocokan strategis"],
               ["Perusahaan berita", "Diversifikasi tidak terkait", "Lemah"],
               ["Perusahaan penerbitan", "Diversifikasi terkait", "Menengah"],
               ["Perusahaan langganan digital", "Produk baru pada bisnis yang sama", "Kuat"]] },
      { title: "Exhibit 2: Pergeseran Sumber Pendapatan",
        note: "Arah pergeseran disusun sebagai gambaran umum untuk diskusi.",
        rows: [["Periode", "Sumber pendapatan dominan", "Konsekuensi strategis"],
               ["Sebelum 2010", "Iklan cetak", "Mengejar jumlah pembaca"],
               ["2011 sampai 2018", "Peralihan ke langganan digital", "Mengejar alasan membayar"],
               ["Setelah 2019", "Langganan digital gabungan", "Mengejar kebiasaan harian dan retensi"]] }
    ],
    questions: [
      "Definisikan bisnis inti perusahaan ini dalam satu kalimat, lalu gunakan Exhibit 1 untuk menentukan apakah langkahnya merupakan diversifikasi atau transformasi model bisnis.",
      "Uji kecocokan strategis antara berita, permainan kata, dan resep masak. Di mana nilai gabungannya melampaui jumlah bagian-bagiannya?",
      "Perusahaan memasang dinding berbayar ketika pesaing membuka isinya gratis. Prinsip strategi apa yang menjelaskan keberhasilan langkah berlawanan arah tersebut?",
      "Redaksi mempertanyakan apakah produk hiburan menggeser identitas jurnalistik. Bagaimana Anda menimbang ketegangan antara identitas dan pertumbuhan?",
      "Apa pelajaran kasus ini bagi perusahaan media Indonesia yang masih bergantung pada pendapatan iklan digital?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai runtuhnya sumber pendapatan utama yang menuntut penetapan ulang definisi bisnis, bukan sekadar penambahan lini baru.",
      alternatives: "Beri judul pada alternatif yang tersedia, misalnya 'Pertahankan model iklan dengan efisiensi', 'Dinding berbayar dan investasi redaksi', dan 'Diversifikasi ke produk berlangganan non-berita'.",
      issues: "Bahas uji kecocokan strategis, risiko identitas merek, ketergantungan pada kanal rujukan pihak ketiga, dan ancaman baru dari kecerdasan buatan generatif.",
      conclusion: "Ambil posisi tentang definisi bisnis yang seharusnya dipakai, sebutkan implikasinya pada portofolio produk, dan tunjukkan alternatif yang Anda tolak."
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
    title: "Aliansi Renault dan Nissan: Budaya, Kepemimpinan, dan Struktur yang Tidak Seimbang",
    subtitle: "Ketika keberhasilan aliansi bertumpu pada satu orang dan ketidaksetaraan yang tidak pernah diselesaikan",
    forSession: 11,
    badge: "Kasus resmi Kelompok 5",
    readingTime: 7,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 12 tentang budaya korporat dan kepemimpinan",
    decisionMaker: "Dewan direksi kedua perusahaan dan pemerintah sebagai pemegang saham",
    decisionPoint: "Menata ulang tata kelola dan kepemimpinan aliansi setelah krisis kepercayaan",
    relevance: "Kasus utama untuk budaya korporat lintas negara, peran kepemimpinan, dan bahaya ketika budaya bertumpu pada figur tunggal.",
    sections: [
      { heading: "Penyelamatan yang Menjadi Legenda",
        body: `<p>Pada 1999, Renault mengambil bagian saham signifikan di Nissan yang saat itu menanggung utang
besar dan merugi. Carlos Ghosn dikirim dari Prancis untuk memimpin pemulihan. Ia menjalankan program penghematan
yang keras: menutup pabrik, memangkas jumlah pemasok, dan memutus sebagian hubungan kepemilikan silang yang khas
struktur bisnis Jepang. Langkah-langkah itu bertentangan dengan norma yang berlaku dan membuatnya menjadi figur
kontroversial sekaligus dipuji.</p>
<p>Hasilnya cepat terlihat. Nissan kembali untung dalam waktu singkat, dan Ghosn menjadi salah satu eksekutif
paling terkenal di dunia, satu-satunya orang yang secara bersamaan memimpin dua produsen mobil besar dari dua
negara berbeda.</p>
<p>Aliansi ini menjadi contoh yang sering dikutip tentang bagaimana dua perusahaan dari budaya berbeda dapat
berbagi platform, mesin, dan pembelian tanpa melebur menjadi satu perusahaan.</p>` },
      { heading: "Ketidaksetaraan yang Tidak Pernah Diselesaikan",
        body: `<p>Di balik keberhasilan itu terdapat struktur kepemilikan yang timpang. Renault memiliki bagian
saham Nissan yang jauh lebih besar dan disertai hak suara, sementara kepemilikan Nissan atas Renault lebih kecil
dan tanpa hak suara setara. Padahal dari sisi penjualan dan laba, Nissan tumbuh lebih besar daripada Renault.
Ketidaksesuaian antara kontribusi dan hak suara itu menjadi sumber ketegangan yang bertahan bertahun-tahun,
diperumit oleh kepemilikan pemerintah Prancis di Renault.</p>
<p>Selama Ghosn memimpin, ketegangan itu tertutup oleh keberhasilan dan oleh kewenangannya sendiri. Ia menjadi
jembatan antara dua budaya sekaligus penengah setiap perselisihan. Dalam bahasa Bab 12, budaya aliansi tidak
tertanam dalam sistem, melainkan bergantung pada seorang pemimpin.</p>
<p>Pada November 2018, Ghosn ditangkap di Jepang atas tuduhan pelanggaran keuangan. Ia kemudian diberhentikan dari
jabatannya di Nissan, dan pada akhir 2019 meninggalkan Jepang secara tidak sah menuju Lebanon. Terlepas dari
kebenaran tuduhannya, peristiwa itu menghilangkan satu-satunya penopang yang selama ini menyatukan aliansi.</p>` },
      { heading: "Menata Ulang Tanpa Figur Penengah",
        body: `<p>Setelah krisis, kedua perusahaan menghadapi pilihan yang selama dua dekade ditunda. Aliansi dapat
dibubarkan, dipertahankan dengan struktur lama, atau ditata ulang menuju kepemilikan silang yang lebih setara
disertai tata kelola bersama yang tidak bergantung pada satu orang. Pada 2023 kedua perusahaan menyepakati
penyetaraan kepemilikan silang, sebuah langkah yang menyelesaikan sebagian ketegangan struktural.</p>
<p>Pertanyaan budaya tetap terbuka. Cara pengambilan keputusan, kecepatan, dan hubungan dengan pemasok di kedua
perusahaan berbeda secara mendasar, dan perbedaan itu tidak selesai dengan mengubah persentase saham.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Sumber Ketegangan Aliansi",
        note: "Pisahkan sumber struktural dari sumber budaya.",
        rows: [["Sumber ketegangan", "Jenis", "Dapat diselesaikan dengan"],
               ["Kepemilikan silang tidak setara", "Struktural", "Perubahan perjanjian pemegang saham"],
               ["Hak suara yang timpang", "Struktural", "Penyetaraan hak suara"],
               ["Kepemilikan pemerintah pada salah satu pihak", "Struktural dan politis", "Negosiasi lintas negara"],
               ["Perbedaan cara pengambilan keputusan", "Budaya", "Waktu, kepemimpinan, dan mekanisme bersama"],
               ["Ketergantungan pada figur tunggal", "Budaya dan tata kelola", "Pelembagaan proses"]] },
      { title: "Exhibit 2: Tiga Pilihan setelah Krisis",
        note: "Bahan pembanding untuk bagian Alternatives.",
        rows: [["Pilihan", "Manfaat", "Risiko"],
               ["Bubarkan aliansi", "Kejelasan dan kemandirian", "Kehilangan skala pembelian dan platform bersama"],
               ["Pertahankan struktur lama", "Tidak ada biaya negosiasi", "Ketegangan berulang"],
               ["Tata ulang menuju kesetaraan", "Menyelesaikan sumber struktural", "Negosiasi panjang dan lintas pemerintah"]] }
    ],
    questions: [
      "Pisahkan sumber ketegangan pada Exhibit 1 menjadi struktural dan budaya. Mana yang lebih menentukan bagi kelangsungan aliansi?",
      "Budaya aliansi bertumpu pada seorang pemimpin. Mekanisme apa yang seharusnya dibangun agar budaya tertanam dalam sistem, bukan pada individu?",
      "Nilai ketiga pilihan pada Exhibit 2 dari sudut pandang dewan direksi Nissan, lalu dari sudut pandang dewan direksi Renault. Apakah kesimpulannya berbeda?",
      "Kepemilikan pemerintah pada salah satu pihak menambah lapisan politis. Bagaimana faktor itu memengaruhi ruang negosiasi?",
      "Apa pelajaran kasus ini bagi perusahaan Indonesia yang membentuk usaha patungan dengan mitra asing?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai aliansi yang keberhasilannya bergantung pada figur tunggal di atas struktur kepemilikan yang tidak seimbang.",
      alternatives: "Beri judul pada ketiga pilihan, sebutkan konsekuensi struktural dan komersialnya tanpa argumen pro dan kontra.",
      issues: "Bahas ketimpangan hak suara, perbedaan budaya pengambilan keputusan, kepentingan pemerintah, serta nilai skala bersama yang dipertaruhkan.",
      conclusion: "Ambil posisi, tetapkan mekanisme tata kelola bersama yang konkret, dan sebutkan pilihan yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "sm12-nike",
    title: "Nike di Indonesia: Rantai Pasok, Standar Perburuhan, dan Reputasi",
    subtitle: "Bagaimana sebuah perusahaan bertanggung jawab atas pabrik yang tidak dimilikinya",
    forSession: 12,
    badge: "Kasus resmi Kelompok 6",
    readingTime: 7,
    officialSource: "Bacaan pendamping: Thompson & Strickland Bab 9 tentang strategi bisnis yang etis, tanggung jawab sosial, dan keberlanjutan",
    decisionMaker: "Manajemen sebuah perusahaan perlengkapan olahraga global",
    decisionPoint: "Menentukan sejauh mana perusahaan bertanggung jawab atas kondisi kerja di pabrik pemasok independen",
    relevance: "Kasus penutup untuk etika bisnis, tanggung jawab sosial, dan keberlanjutan sebagai bagian dari strategi, bukan pelengkapnya.",
    sections: [
      { heading: "Model Tanpa Pabrik",
        body: `<p>Perusahaan ini membangun modelnya di atas satu keputusan strategis: tidak memiliki pabrik. Ia
memusatkan sumber dayanya pada desain, teknologi produk, dan pemasaran, sementara produksi diserahkan kepada
pemasok independen di Asia. Indonesia menjadi salah satu basis produksi utamanya sejak akhir 1980-an, bersama
Vietnam dan Tiongkok.</p>
<p>Model itu menghasilkan keunggulan biaya dan kelincahan yang besar. Ia juga menciptakan jarak antara merek dan
kondisi kerja tempat produknya dibuat.</p>
<p>Pada 1990-an, laporan tentang upah rendah, jam kerja panjang, dan perlakuan terhadap pekerja di pabrik pemasok
di Indonesia dan negara lain menjadi sorotan internasional. Perusahaan pada awalnya berargumen bahwa pabrik-pabrik
itu bukan miliknya dan bahwa hubungan kerja adalah urusan pemasok. Argumen itu benar secara hukum dan gagal secara
publik. Kampanye boikot berlangsung selama bertahun-tahun dan menjadi salah satu contoh paling dikutip tentang
risiko reputasi rantai pasok.</p>` },
      { heading: "Dari Penyangkalan Menuju Pengungkapan",
        body: `<p>Perubahan sikap perusahaan berlangsung bertahap. Ia menetapkan kode perilaku pemasok, membangun
tim audit kepatuhan, bergabung dengan inisiatif multi-pihak, dan pada 2005 mengambil langkah yang saat itu jarang
dilakukan, yaitu mempublikasikan daftar pabrik pemasoknya. Langkah itu mengundang pengawasan dari luar, sesuatu
yang sebelumnya dihindari perusahaan mana pun.</p>
<p>Dalam bahasa Bab 9, ini adalah pergeseran dari memperlakukan tanggung jawab sosial sebagai biaya reputasi
menjadi memperlakukannya sebagai bagian dari strategi. Pengungkapan menciptakan tekanan internal untuk memperbaiki,
karena tidak ada lagi tempat menyembunyikan pemasok bermasalah.</p>
<p>Persoalannya tidak selesai. Audit menghadapi keterbatasan: pemeriksaan yang dijadwalkan dapat dipersiapkan,
pekerja yang diwawancarai di lingkungan pabrik tidak selalu bebas berbicara, dan pemasok lapis kedua sering berada
di luar jangkauan pemeriksaan. Persoalan pembayaran pesangon pada masa pandemi dan sengketa kebebasan berserikat
memperlihatkan bahwa jarak antara kebijakan di kantor pusat dan kenyataan di lantai pabrik tetap ada.</p>` },
      { heading: "Pertanyaan Strategis, Bukan Hanya Etis",
        body: `<p>Bagi manajemen, pertanyaannya bukan hanya apa yang benar, melainkan juga bagaimana tanggung jawab
itu dijalankan tanpa menghancurkan keunggulan biaya yang menjadi dasar modelnya. Menaikkan standar berarti
menaikkan biaya. Berpindah ke pemasok yang lebih patuh dapat menghukum pemasok lama beserta pekerjanya.
Meninggalkan sebuah negara ketika muncul persoalan justru memindahkan masalah, bukan menyelesaikannya.</p>
<p>Tiga arah dipertimbangkan: memperketat audit dan sanksi bagi pemasok; berinvestasi jangka panjang pada
sedikit pemasok terpilih dengan kemitraan yang lebih dalam; atau mengambil kembali sebagian produksi ke dalam
kendali langsung perusahaan untuk lini bernilai tinggi.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Tahapan Sikap Perusahaan atas Tanggung Jawab Rantai Pasok",
        note: "Perhatikan pergeseran dari penyangkalan menuju pelembagaan.",
        rows: [["Tahap", "Sikap", "Alat yang dipakai"],
               ["Penyangkalan", "Pabrik bukan milik kami", "Argumen hukum"],
               ["Kepatuhan", "Menetapkan standar minimum", "Kode perilaku dan audit"],
               ["Pengungkapan", "Membuka daftar pemasok", "Transparansi dan pengawasan publik"],
               ["Kemitraan", "Membangun kapabilitas pemasok", "Kontrak jangka panjang dan pelatihan"]] },
      { title: "Exhibit 2: Keterbatasan Audit Kepatuhan",
        note: "Gunakan untuk menilai keandalan mekanisme pengawasan.",
        rows: [["Keterbatasan", "Wujudnya", "Kemungkinan perbaikan"],
               ["Pemeriksaan terjadwal", "Pabrik bersiap sebelum audit", "Pemeriksaan mendadak"],
               ["Wawancara di lingkungan pabrik", "Pekerja tidak bebas berbicara", "Wawancara di luar lokasi kerja"],
               ["Pemasok lapis kedua", "Di luar jangkauan pemeriksaan", "Kewajiban penelusuran berjenjang"],
               ["Insentif pembelian", "Tekanan harga dan tenggat", "Menyelaraskan target pembelian dengan standar"]] }
    ],
    questions: [
      "Argumen bahwa pabrik bukan milik perusahaan benar secara hukum tetapi gagal secara publik. Apa yang ditunjukkan hal itu tentang batas tanggung jawab perusahaan?",
      "Exhibit 2 memperlihatkan keterbatasan audit. Perubahan apa pada praktik pembelian perusahaan yang paling menentukan bagi perbaikan kondisi kerja?",
      "Nilai ketiga arah yang dipertimbangkan manajemen. Mana yang paling menyeimbangkan tanggung jawab dan keunggulan biaya?",
      "Meninggalkan sebuah negara ketika muncul persoalan memindahkan masalah, bukan menyelesaikannya. Apakah Anda setuju? Pertahankan posisi Anda.",
      "Bagaimana perusahaan Indonesia yang menjadi pemasok merek global sebaiknya memposisikan diri terhadap tuntutan standar semacam ini?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai tanggung jawab atas dampak yang terjadi di luar batas kepemilikan perusahaan, tetapi di dalam jangkauan pengaruhnya.",
      alternatives: "Beri judul pada ketiga arah, sebutkan biaya, waktu, dan perubahan hubungan pemasok masing-masing.",
      issues: "Bahas keterbatasan audit, ketegangan antara tekanan harga dan standar kerja, risiko reputasi, serta dampak bagi pekerja bila hubungan pemasok diputus.",
      conclusion: "Ambil posisi, tetapkan perubahan konkret pada praktik pembelian, dan sebutkan arah yang Anda tolak beserta alasannya."
    }
  }
  ];
  C.cases = (C.cases || []).concat(cases).sort((a, b) => a.forSession - b.forSession);
})();
