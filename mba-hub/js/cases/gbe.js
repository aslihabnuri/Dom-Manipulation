/* ============================================================
   Studi Kasus GBE (MAN 6521): satu teaching case per topik lingkungan.
   Karena mata kuliah ini tidak memakai buku teks tunggal, tiap kasus
   dipasangkan dengan modul dan slide dosen pengampu topik terkait.
   Angka pada exhibit bersifat indikatif untuk latihan analisis.
   ============================================================ */
(function () {
  const C = window.MBA_COURSES.gbe;
  const cases = [,
  {
    id: "gbe2-rupiah",
    title: "Rupiah, Suku Bunga, dan Rencana Ekspansi yang Tertunda",
    subtitle: "Membaca lingkungan ekonomi makro sebelum menandatangani belanja modal",
    forSession: 2,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Ekonomi (slide Gumilang Aryo Sahadewo); data Bank Indonesia dan Badan Pusat Statistik",
    decisionMaker: "Direksi sebuah produsen barang setengah jadi dengan bahan baku impor",
    decisionPoint: "Menentukan kelanjutan rencana ekspansi pabrik senilai belanja modal besar di tengah pengetatan moneter",
    relevance: "Latihan membaca variabel makro dan menerjemahkannya menjadi keputusan bisnis, dari perspektif seorang CEO.",
    sections: [
      { heading: "Rencana yang Disusun pada Musim yang Berbeda",
        body: `<p>Rencana ekspansi ini disusun ketika biaya dana murah, permintaan domestik pulih setelah pandemi,
dan nilai tukar relatif stabil. Perhitungan kelayakannya menunjukkan pengembalian yang memadai dengan asumsi kurs
dan bunga pada tingkat saat itu.</p>
<p>Kondisi berubah dalam waktu singkat. Bank sentral negara maju menaikkan suku bunga acuan secara agresif untuk
menekan inflasi, arus modal berbalik keluar dari pasar berkembang, dan rupiah melemah. Bank Indonesia merespons
dengan menaikkan suku bunga acuannya, yang menaikkan biaya pinjaman di dalam negeri.</p>
<p>Perusahaan ini terpapar dari dua sisi. Bahan bakunya diimpor, sehingga pelemahan rupiah menaikkan harga pokok.
Rencana ekspansinya dibiayai pinjaman, sehingga kenaikan suku bunga menaikkan beban keuangan. Sementara itu harga
jual sulit dinaikkan karena pelanggannya juga sedang menahan belanja.</p>` },
      { heading: "Membedakan Guncangan Sementara dan Perubahan Struktural",
        body: `<p>Pertanyaan pertama bagi manajemen adalah apakah kondisi ini bersifat siklikal atau struktural.
Jika ia bagian dari siklus moneter global yang akan berbalik dalam satu sampai dua tahun, menunda ekspansi berarti
kehilangan waktu pada saat pesaing juga menunda. Jika ia mencerminkan pergeseran struktural pada biaya modal
global, asumsi kelayakan proyek perlu disusun ulang seluruhnya.</p>
<p>Pertanyaan kedua menyangkut transmisi. Kenaikan suku bunga acuan tidak langsung menjadi kenaikan bunga kredit
dengan besaran yang sama, dan pelemahan kurs tidak seluruhnya diteruskan ke harga jual. Besarnya penerusan itu
berbeda antar-industri dan bergantung pada struktur persaingan.</p>
<p>Pertanyaan ketiga menyangkut sisi permintaan. Konsumsi rumah tangga menyumbang porsi terbesar produk domestik
bruto Indonesia, sehingga daya beli kelas menengah menjadi penentu utama. Indikator seperti indeks keyakinan
konsumen, penjualan kendaraan bermotor, dan penyaluran kredit konsumsi memberi petunjuk lebih awal daripada data
pertumbuhan triwulanan.</p>` },
      { heading: "Tiga Pilihan di Meja Rapat",
        body: `<p>Direktur keuangan mengusulkan menunda proyek sampai arah suku bunga jelas, dengan konsekuensi
harga peralatan dan biaya konstruksi kemungkinan naik. Direktur operasi mengusulkan melanjutkan dengan skala lebih
kecil dan bertahap. Direktur pemasaran mengusulkan melanjutkan penuh dengan alasan bahwa pesaing yang menunda akan
kehilangan kapasitas ketika permintaan pulih.</p>
<p>Ketiganya bertumpu pada perkiraan yang berbeda tentang arah lingkungan ekonomi dalam dua tahun ke depan.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Variabel Makro dan Jalur Pengaruhnya",
        note: "Petakan jalur pengaruh sebelum menilai besarannya.",
        rows: [["Variabel", "Jalur pengaruh ke perusahaan", "Arah dampak"],
               ["Suku bunga acuan", "Biaya pinjaman ekspansi", "Menaikkan beban"],
               ["Nilai tukar rupiah", "Harga bahan baku impor", "Menaikkan harga pokok"],
               ["Inflasi", "Daya beli pelanggan", "Menekan volume"],
               ["Harga komoditas global", "Biaya energi dan bahan", "Bergantung komoditas"],
               ["Kebijakan fiskal", "Permintaan dari proyek pemerintah", "Berpotensi menopang"]] },
      { title: "Exhibit 2: Tiga Skenario Dua Tahun ke Depan",
        note: "Skenario disusun sebagai alat latihan, bukan proyeksi resmi.",
        rows: [["Skenario", "Arah suku bunga", "Arah kurs", "Implikasi bagi proyek"],
               ["Pemulihan cepat", "Turun", "Menguat", "Ekspansi penuh menguntungkan"],
               ["Normal baru berbiaya tinggi", "Tetap tinggi", "Lemah stabil", "Ekspansi bertahap lebih aman"],
               ["Pengetatan berlanjut", "Naik", "Melemah lanjut", "Penundaan lebih rasional"]] }
    ],
    questions: [
      "Dengan Exhibit 1, jelaskan jalur mana yang paling cepat memengaruhi laba perusahaan ini dan mana yang bekerja lambat.",
      "Bagaimana Anda membedakan guncangan siklikal dari perubahan struktural pada biaya modal? Indikator apa yang Anda pantau?",
      "Nilai ketiga usulan direksi terhadap ketiga skenario pada Exhibit 2. Usulan mana yang paling tahan terhadap kesalahan perkiraan?",
      "Konsumsi rumah tangga menyumbang porsi terbesar produk domestik bruto Indonesia. Bagaimana fakta itu mengubah cara Anda membaca risiko permintaan?",
      "Sebagai CEO, keputusan apa yang Anda ambil, dan pemicu apa yang akan membuat Anda mengubah keputusan itu?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai keputusan investasi jangka panjang di bawah ketidakpastian variabel makro yang berada di luar kendali perusahaan.",
      alternatives: "Juduli ketiga usulan dan sebutkan komitmen modal serta fleksibilitas yang tersisa pada masing-masing.",
      issues: "Bahas sensitivitas kelayakan proyek terhadap kurs dan bunga, risiko kehilangan posisi pasar, dan keterbatasan kemampuan meneruskan biaya ke harga jual.",
      conclusion: "Ambil posisi, tetapkan pemicu keputusan berbasis indikator yang dapat dipantau, dan sebutkan usulan yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "gbe3-rob",
    title: "Banjir Rob di Kawasan Industri Pantai Utara",
    subtitle: "Ketika penurunan muka tanah mengubah perhitungan investasi jangka panjang",
    forSession: 3,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Alami (slide Pak Andhika); kajian penurunan muka tanah pesisir utara Jawa",
    decisionMaker: "Manajemen sebuah perusahaan manufaktur dengan pabrik di kawasan industri pesisir",
    decisionPoint: "Menentukan apakah pabrik dipertahankan dengan perlindungan tambahan atau dipindahkan ke lokasi lain",
    relevance: "Kasus untuk hubungan timbal balik bisnis dan ekologi, risiko fisik perubahan iklim, dan biaya yang tidak masuk pembukuan.",
    sections: [
      { heading: "Air yang Datang Semakin Sering",
        body: `<p>Kawasan pesisir utara Jawa mengalami penurunan muka tanah yang termasuk paling cepat di dunia,
dengan laju yang di beberapa titik mencapai belasan sentimeter per tahun. Penyebab utamanya adalah pengambilan air
tanah dalam jumlah besar oleh industri dan permukiman, diperparah beban bangunan di atas tanah aluvial muda.
Kenaikan muka air laut menambah tekanan dari arah berlawanan.</p>
<p>Akibatnya terlihat pada banjir rob yang semakin sering dan semakin dalam. Jalan akses tergenang, jadwal
pengiriman terganggu, dan peralatan di lantai produksi mengalami kerusakan berulang. Sebagian perusahaan menaikkan
lantai bangunan, membangun tanggul, dan memasang pompa, sebuah rangkaian belanja yang harus diulang setiap beberapa
tahun karena tanah terus turun.</p>
<p>Yang menyulitkan, sebagian penyebabnya adalah tindakan industri itu sendiri. Perusahaan yang mengambil air tanah
untuk prosesnya turut mempercepat penurunan tanah yang kemudian merugikannya.</p>` },
      { heading: "Biaya yang Tidak Muncul di Laporan Keuangan",
        body: `<p>Dalam perhitungan investasi awal, biaya lingkungan semacam ini tidak muncul. Harga lahan di
kawasan industri pesisir murah, akses pelabuhan dekat, dan tenaga kerja tersedia. Biaya penurunan tanah ditanggung
bersama oleh seluruh pengguna kawasan dan oleh warga sekitar, sebuah bentuk klasik biaya eksternal.</p>
<p>Ketika biaya itu akhirnya muncul, ia muncul sebagai belanja perlindungan, kerugian gangguan produksi, kenaikan
premi asuransi, dan penurunan nilai aset. Sebagian penyedia asuransi mulai menaikkan premi atau membatasi
pertanggungan untuk wilayah dengan risiko banjir tinggi, yang merupakan sinyal pasar bahwa risiko sedang
dinilai ulang.</p>
<p>Pemerintah membangun tanggul laut dan jalan tol yang berfungsi sebagai penahan, serta mengatur pengambilan air
tanah. Namun pengendalian pengambilan air tanah menuntut tersedianya sumber air alternatif yang belum merata.</p>` },
      { heading: "Pilihan yang Tersedia",
        body: `<p>Manajemen mempertimbangkan tiga langkah. Pertama, bertahan dengan investasi perlindungan berkala
dan beralih ke sumber air permukaan untuk menghentikan kontribusi perusahaan pada penurunan tanah. Kedua,
memindahkan fasilitas ke kawasan industri di dataran yang lebih tinggi, dengan biaya pemindahan besar dan
kehilangan kedekatan pelabuhan. Ketiga, membagi risiko dengan memindahkan lini paling kritis dan mempertahankan
sisanya.</p>
<p>Keputusan ini menyangkut horizon puluhan tahun, sementara sebagian besar sistem penilaian investasi perusahaan
bekerja pada horizon lima tahun.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Biaya yang Terlihat dan Tidak Terlihat",
        note: "Perhatikan mana yang masuk pembukuan perusahaan dan mana yang ditanggung pihak lain.",
        rows: [["Jenis biaya", "Ditanggung siapa", "Muncul di laporan keuangan"],
               ["Belanja tanggul dan pompa", "Perusahaan", "Ya"],
               ["Gangguan produksi saat rob", "Perusahaan", "Ya, sebagian"],
               ["Kenaikan premi asuransi", "Perusahaan", "Ya"],
               ["Kerusakan rumah warga sekitar", "Masyarakat", "Tidak"],
               ["Penurunan muka tanah kawasan", "Bersama", "Tidak"]] },
      { title: "Exhibit 2: Tiga Langkah dan Horizon Waktunya",
        note: "Bandingkan dengan horizon penilaian investasi yang dipakai perusahaan Anda.",
        rows: [["Langkah", "Biaya awal", "Risiko sisa 10 tahun", "Risiko sisa 25 tahun"],
               ["Bertahan dengan perlindungan", "Rendah", "Menengah", "Tinggi"],
               ["Pindah sepenuhnya", "Sangat tinggi", "Rendah", "Rendah"],
               ["Pindah sebagian", "Tinggi", "Menengah", "Menengah"]] }
    ],
    questions: [
      "Jelaskan hubungan timbal balik antara kegiatan industri dan penurunan muka tanah pada kasus ini. Mengapa hubungan itu sulit diputus oleh satu perusahaan saja?",
      "Exhibit 1 memisahkan biaya yang masuk pembukuan dan yang tidak. Apa konsekuensi pemisahan itu bagi keputusan investasi awal di kawasan pesisir?",
      "Asuransi mulai menaikkan premi untuk wilayah berisiko. Mengapa sinyal pasar semacam ini penting dibaca sebagai informasi lingkungan?",
      "Keputusan ini berhorizon puluhan tahun sementara penilaian investasi perusahaan berhorizon lima tahun. Bagaimana Anda menjembatani ketidakcocokan itu?",
      "Sebagai CEO, langkah mana pada Exhibit 2 yang Anda pilih, dan bagaimana Anda menjelaskannya kepada pemegang saham?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai investasi pada lokasi yang risiko fisiknya meningkat secara struktural, sebagian akibat kegiatan industri itu sendiri.",
      alternatives: "Juduli ketiga langkah, sebutkan biaya awal dan risiko sisa pada dua horizon waktu.",
      issues: "Bahas biaya eksternal, ketidakcocokan horizon waktu, ketergantungan pada infrastruktur publik, dan tanggung jawab terhadap warga sekitar.",
      conclusion: "Ambil posisi, tetapkan tahapan pelaksanaan, dan sebutkan indikator lingkungan yang akan memicu peninjauan ulang."
    }
  },

  {
    id: "gbe4-halal",
    title: "Kewajiban Sertifikasi Halal dan Usaha Kecil",
    subtitle: "Ketika nilai sosial dan budaya menjadi kewajiban hukum yang mengubah biaya masuk pasar",
    forSession: 4,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Sosial dan Budaya (slide Desideria Cempaka); Undang-Undang Jaminan Produk Halal dan ketentuan pelaksanaannya",
    decisionMaker: "Manajemen sebuah perusahaan makanan menengah dengan jaringan pemasok usaha kecil",
    decisionPoint: "Menentukan cara memenuhi kewajiban sertifikasi halal tanpa memutus hubungan dengan pemasok kecil yang belum bersertifikat",
    relevance: "Kasus untuk membaca nilai sosial dan budaya sebagai faktor lingkungan bisnis yang menentukan akses pasar.",
    sections: [
      { heading: "Nilai yang Menjadi Aturan",
        body: `<p>Preferensi konsumen Muslim atas produk halal sudah lama menjadi kenyataan pasar di Indonesia.
Yang berubah adalah statusnya. Undang-Undang Jaminan Produk Halal menetapkan kewajiban sertifikasi bagi produk
yang beredar dan diperdagangkan, dengan penahapan waktu bagi kelompok produk yang berbeda. Nilai budaya berubah
menjadi persyaratan hukum untuk masuk pasar.</p>
<p>Bagi perusahaan besar, pemenuhan kewajiban ini merupakan pekerjaan administratif dan teknis yang terkelola. Bagi
usaha mikro dan kecil, ia menjadi hambatan nyata: biaya, dokumen, penelusuran bahan, dan pemahaman prosedur.
Pemerintah menyediakan skema sertifikasi dengan pernyataan pelaku usaha bagi usaha mikro dan kecil untuk
meringankan beban tersebut.</p>
<p>Persoalan perusahaan menengah ini terletak pada rantai pasoknya. Sebagian bahan berasal dari usaha kecil di
daerah yang selama bertahun-tahun menjadi mitra, tetapi belum bersertifikat.</p>` },
      { heading: "Rantai yang Harus Bersih Seluruhnya",
        body: `<p>Sertifikasi halal tidak berhenti pada produk akhir. Ia menuntut penelusuran bahan, pemisahan
peralatan, dan kejelasan asal-usul bahan tertentu. Satu bahan yang tidak dapat ditelusuri dapat menggugurkan
sertifikat produk akhir.</p>
<p>Perusahaan menghadapi pilihan yang lazim muncul ketika standar naik: mengganti pemasok kecil dengan pemasok
besar yang sudah bersertifikat, atau membantu pemasok kecil naik kelas. Pilihan pertama lebih cepat dan lebih
murah, tetapi memutus hubungan yang menopang penghidupan ratusan keluarga sekaligus menghilangkan keunikan bahan
yang menjadi ciri produk perusahaan.</p>
<p>Persoalan serupa muncul pada standar lain: keamanan pangan, keberlanjutan, dan penelusuran rantai pasok. Pola
yang sama berulang, yaitu standar yang dimaksudkan melindungi konsumen berpotensi menyingkirkan pelaku kecil.</p>` },
      { heading: "Pilihan Manajemen",
        body: `<p>Tiga usulan muncul. Pertama, beralih ke pemasok besar bersertifikat. Kedua, membiayai dan
mendampingi pemasok kecil untuk memperoleh sertifikasi, dengan biaya dan waktu di muka. Ketiga, membangun fasilitas
pengolahan antara milik perusahaan yang menerima bahan mentah dari pemasok kecil dan memprosesnya dalam lingkungan
bersertifikat.</p>
<p>Batas waktu penahapan kewajiban semakin dekat, sementara pendampingan pemasok menuntut waktu berbulan-bulan.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Nilai Sosial sebagai Faktor Lingkungan Bisnis",
        note: "Perhatikan bagaimana nilai berubah bentuk menjadi hambatan atau peluang.",
        rows: [["Tahap", "Bentuk", "Konsekuensi bagi perusahaan"],
               ["Preferensi konsumen", "Pilihan pembelian", "Peluang diferensiasi"],
               ["Norma sosial", "Tekanan komunitas", "Risiko reputasi"],
               ["Kewajiban hukum", "Sertifikasi wajib", "Syarat akses pasar"],
               ["Standar rantai pasok", "Penelusuran bahan", "Biaya kepatuhan hingga ke hulu"]] },
      { title: "Exhibit 2: Tiga Usulan dan Dampaknya",
        note: "Kolom bersifat relatif untuk latihan perbandingan.",
        rows: [["Usulan", "Kecepatan pemenuhan", "Biaya", "Dampak pada pemasok kecil"],
               ["Ganti dengan pemasok besar", "Cepat", "Rendah", "Terputus"],
               ["Dampingi pemasok kecil", "Lambat", "Tinggi", "Naik kelas"],
               ["Bangun fasilitas antara", "Menengah", "Tinggi", "Tetap terlibat"]] }
    ],
    questions: [
      "Jelaskan tahapan pada Exhibit 1 dengan contoh dari kasus ini. Pada tahap mana perusahaan seharusnya sudah bersiap?",
      "Standar yang dimaksudkan melindungi konsumen berpotensi menyingkirkan pelaku kecil. Bagaimana Anda menilai pertukaran itu sebagai pembuat kebijakan?",
      "Nilai ketiga usulan pada Exhibit 2 dari perspektif seorang CEO yang memikirkan biaya sekaligus keberlanjutan rantai pasok.",
      "Sertifikasi halal berlaku sampai ke penelusuran bahan. Kemampuan operasional apa yang harus dibangun perusahaan agar mampu memenuhinya secara berkelanjutan?",
      "Pola serupa muncul pada standar keberlanjutan dan keamanan pangan. Pelajaran apa dari kasus ini yang dapat diterapkan pada standar berikutnya?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai pemenuhan standar wajib dengan tenggat tetap pada rantai pasok yang sebagian besar belum siap.",
      alternatives: "Juduli ketiga usulan dan sebutkan waktu, biaya, serta konsekuensinya bagi mitra pemasok.",
      issues: "Bahas tenggat regulasi, biaya kepatuhan, keberlanjutan hubungan pemasok, dan keunikan produk yang bergantung pada bahan dari pemasok kecil.",
      conclusion: "Ambil posisi, susun rencana bertahap dengan tenggat, dan sebutkan usulan yang Anda tolak beserta alasannya."
    }
  },
  {
    id: "gbe5-pemilu",
    title: "Tahun Pemilu dan Keputusan yang Ditahan",
    subtitle: "Membaca risiko politik nasional dan geopolitik tanpa terjebak spekulasi",
    forSession: 5,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Politik (slide Hempri Suyatna)",
    decisionMaker: "Direksi sebuah perusahaan infrastruktur dengan proyek jangka panjang",
    decisionPoint: "Menentukan kelanjutan komitmen investasi menjelang pergantian pemerintahan",
    relevance: "Kasus untuk stabilitas politik, risiko kebijakan, dan pengaruh geopolitik terhadap keputusan bisnis.",
    sections: [
      { heading: "Siklus yang Berulang",
        body: `<p>Pola yang berulang di banyak negara demokrasi terlihat pula di Indonesia: menjelang pemilihan
umum, sebagian pelaku usaha menahan keputusan investasi besar sampai arah kebijakan pemerintahan berikutnya jelas.
Belanja pemerintah cenderung meningkat pada masa kampanye, sementara persetujuan proyek jangka panjang cenderung
melambat.</p>
<p>Bagi perusahaan yang bergantung pada konsesi, izin, atau kontrak pemerintah, ketidakpastian ini bukan soal
siapa yang menang, melainkan soal apakah kebijakan yang menjadi dasar perhitungan proyek akan berlanjut. Proyek
infrastruktur berumur puluhan tahun harus melewati beberapa kali pergantian pemerintahan.</p>
<p>Perusahaan ini memiliki proyek yang perhitungan kelayakannya bergantung pada tarif yang diatur pemerintah dan
pada kelanjutan rencana induk kawasan. Keduanya dapat ditinjau ulang oleh pemerintahan berikutnya.</p>` },
      { heading: "Membedakan Risiko Politik dan Preferensi Politik",
        body: `<p>Analisis risiko politik yang baik berbeda dari spekulasi tentang pemenang. Yang perlu dipetakan
adalah kebijakan mana yang bersifat lintas pemerintahan karena tertuang dalam undang-undang atau perjanjian jangka
panjang, dan kebijakan mana yang bergantung pada keputusan pemerintahan yang sedang berkuasa.</p>
<p>Selain itu, risiko politik memiliki beberapa bentuk. Terdapat risiko perubahan regulasi, risiko perubahan tarif
atau subsidi, risiko penundaan perizinan, serta risiko yang paling ekstrem berupa pengambilalihan aset. Setiap
bentuk memiliki cara mitigasi yang berbeda, mulai dari klausul kontrak, penjaminan, sampai asuransi risiko politik.</p>
<p>Dimensi internasional menambah lapisan. Ketegangan geopolitik memengaruhi harga energi, rantai pasok peralatan,
dan ketersediaan pembiayaan dari lembaga multilateral maupun bilateral. Perusahaan yang bergantung pada peralatan
dari satu negara menghadapi risiko yang tidak muncul dalam analisis politik dalam negeri.</p>` },
      { heading: "Keputusan yang Harus Diambil",
        body: `<p>Direksi mempertimbangkan tiga sikap. Pertama, menahan komitmen sampai pemerintahan baru menetapkan
arah kebijakannya, dengan risiko kehilangan momentum dan kenaikan biaya konstruksi. Kedua, melanjutkan sambil
memperkuat perlindungan kontraktual berupa klausul penyesuaian tarif dan mekanisme penyelesaian sengketa. Ketiga,
membagi proyek menjadi tahapan yang masing-masing dapat dihentikan tanpa kerugian besar.</p>
<p>Direksi juga membahas sejauh mana perusahaan sebaiknya terlibat dalam proses politik, sebuah pertanyaan yang
menyentuh batas antara advokasi kebijakan yang sah dan keterlibatan yang tidak pantas.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Bentuk Risiko Politik dan Mitigasinya",
        note: "Cocokkan bentuk risiko dengan alat mitigasi yang sesuai.",
        rows: [["Bentuk risiko", "Contoh wujudnya", "Alat mitigasi lazim"],
               ["Perubahan regulasi", "Perubahan aturan teknis sektor", "Klausul stabilisasi, keterlibatan asosiasi"],
               ["Perubahan tarif atau subsidi", "Peninjauan tarif yang diatur", "Formula penyesuaian dalam kontrak"],
               ["Penundaan perizinan", "Proses izin melambat", "Penjadwalan bertahap, hubungan kelembagaan"],
               ["Pengambilalihan aset", "Nasionalisasi", "Asuransi risiko politik, arbitrase internasional"]] },
      { title: "Exhibit 2: Kebijakan Lintas Pemerintahan atau Tidak",
        note: "Klasifikasi ini menentukan seberapa besar risiko yang sesungguhnya dihadapi.",
        rows: [["Dasar kebijakan", "Ketahanan terhadap pergantian pemerintahan"],
               ["Undang-undang", "Tinggi"],
               ["Perjanjian internasional", "Tinggi"],
               ["Peraturan pemerintah", "Menengah"],
               ["Peraturan menteri", "Rendah"],
               ["Kebijakan tidak tertulis", "Sangat rendah"]] }
    ],
    questions: [
      "Gunakan Exhibit 2 untuk menilai seberapa rapuh dasar hukum proyek ini. Apa implikasinya bagi keputusan direksi?",
      "Bedakan analisis risiko politik dari spekulasi tentang pemenang pemilihan. Informasi apa yang benar-benar berguna bagi perusahaan?",
      "Cocokkan risiko yang dihadapi perusahaan ini dengan alat mitigasi pada Exhibit 1. Mana yang realistis diterapkan?",
      "Ketegangan geopolitik memengaruhi rantai pasok peralatan. Bagaimana Anda memasukkan faktor itu ke dalam rencana proyek?",
      "Di mana batas antara advokasi kebijakan yang sah dan keterlibatan politik yang tidak pantas bagi perusahaan?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai komitmen jangka panjang yang bergantung pada kebijakan yang dapat berubah pada siklus politik yang lebih pendek.",
      alternatives: "Juduli ketiga sikap dan sebutkan konsekuensi biaya, waktu, serta perlindungan hukum masing-masing.",
      issues: "Bahas ketahanan dasar hukum, biaya menunggu, efektivitas klausul kontrak, dan dimensi geopolitik pada rantai pasok.",
      conclusion: "Ambil posisi, tetapkan perlindungan kontraktual yang wajib ada, dan sebutkan sikap yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "gbe6-demografi",
    title: "Bonus Demografi dan Pabrik yang Mencari Tenaga Kerja",
    subtitle: "Jumlah penduduk usia produktif besar, tetapi keterampilan yang dibutuhkan tidak selalu tersedia",
    forSession: 6,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Demografi (slide Ibu Amelia); proyeksi penduduk Badan Pusat Statistik",
    decisionMaker: "Direktur Sumber Daya Manusia sebuah perusahaan manufaktur yang merencanakan pabrik baru",
    decisionPoint: "Memilih lokasi pabrik berdasarkan ketersediaan dan keterampilan tenaga kerja pada horizon dua puluh tahun",
    relevance: "Kasus untuk membaca struktur dan perubahan variabel demografi serta dampaknya pada tenaga kerja dan permintaan.",
    sections: [
      { heading: "Angka yang Menjanjikan dan Jendela yang Menutup",
        body: `<p>Indonesia berada pada periode yang sering disebut bonus demografi, yaitu ketika proporsi penduduk
usia produktif jauh lebih besar daripada penduduk usia tidak produktif. Rasio ketergantungan berada pada titik
terendah dalam sejarah negara ini, dan jendela itu diperkirakan mulai menutup pada dekade 2030-an seiring
meningkatnya proporsi penduduk lanjut usia.</p>
<p>Angka agregat itu menyembunyikan perbedaan besar antar-wilayah. Sebagian provinsi masih memiliki proporsi
penduduk muda yang sangat besar, sementara sebagian provinsi di Jawa sudah mendekati struktur penduduk yang lebih
tua. Urbanisasi menambah dinamika: penduduk usia produktif berpindah ke kota besar, sehingga daerah asal kehilangan
tenaga kerja mudanya.</p>
<p>Bagi perusahaan yang memilih lokasi pabrik untuk dioperasikan puluhan tahun, perbedaan itu menentukan.</p>` },
      { heading: "Jumlah Bukan Keterampilan",
        body: `<p>Ketersediaan tenaga kerja usia produktif tidak sama dengan ketersediaan keterampilan yang
dibutuhkan. Perusahaan manufaktur modern membutuhkan operator yang mampu membaca instruksi teknis, memahami dasar
pengendalian mutu, dan bekerja dengan sistem digital. Kesenjangan antara keluaran pendidikan menengah kejuruan dan
kebutuhan industri menjadi keluhan yang berulang.</p>
<p>Persoalan kedua adalah upah minimum yang berbeda antar-kabupaten, yang menciptakan pertimbangan biaya sekaligus
pertimbangan sosial. Wilayah berupah rendah sering kali juga wilayah dengan ketersediaan keterampilan yang lebih
terbatas dan infrastruktur pendukung yang lebih tipis.</p>
<p>Persoalan ketiga adalah perubahan struktur permintaan. Perusahaan tidak hanya mempekerjakan penduduk; ia juga
menjual kepada mereka. Penuaan penduduk mengubah komposisi permintaan barang dan jasa, dari produk untuk keluarga
muda menuju produk kesehatan dan layanan perawatan.</p>` },
      { heading: "Tiga Kandidat Lokasi",
        body: `<p>Lokasi pertama berada di kawasan industri mapan di Jawa Barat: tenaga kerja terampil tersedia,
infrastruktur baik, tetapi upah minimum tinggi dan persaingan merebut tenaga kerja ketat. Lokasi kedua berada di
Jawa Tengah: upah lebih rendah, penduduk usia produktif melimpah, keterampilan menengah. Lokasi ketiga berada di
luar Jawa dekat sumber bahan baku: upah rendah, penduduk muda banyak, tetapi ketersediaan keterampilan teknis
terbatas dan infrastruktur pendukung masih berkembang.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Profil Tiga Kandidat Lokasi (indikatif)",
        note: "Skor 1 sampai 5, disusun sebagai alat latihan pengambilan keputusan.",
        rows: [["Faktor", "Jawa Barat", "Jawa Tengah", "Luar Jawa"],
               ["Ketersediaan tenaga kerja muda", "3", "4", "5"],
               ["Ketersediaan keterampilan teknis", "5", "3", "2"],
               ["Tingkat upah minimum", "5 (tertinggi)", "3", "2"],
               ["Infrastruktur pendukung", "5", "4", "2"],
               ["Persaingan merebut tenaga kerja", "5 (paling ketat)", "3", "1"]] },
      { title: "Exhibit 2: Perubahan Struktur Penduduk dan Implikasinya",
        note: "Gunakan untuk menilai keputusan pada horizon dua puluh tahun.",
        rows: [["Periode", "Ciri struktur penduduk", "Implikasi bagi perusahaan"],
               ["Saat ini sampai 2030", "Rasio ketergantungan rendah", "Pasokan tenaga kerja melimpah"],
               ["2030 sampai 2045", "Proporsi lanjut usia meningkat", "Biaya tenaga kerja naik, permintaan bergeser"],
               ["Setelah 2045", "Struktur penduduk lebih tua", "Otomasi menjadi keharusan"]] }
    ],
    questions: [
      "Dengan Exhibit 1, lokasi mana yang Anda pilih untuk pabrik berumur dua puluh tahun? Pertahankan pilihan Anda.",
      "Ketersediaan penduduk usia produktif tidak sama dengan ketersediaan keterampilan. Program apa yang seharusnya disiapkan perusahaan untuk menutup kesenjangan itu?",
      "Exhibit 2 menunjukkan jendela bonus demografi akan menutup. Bagaimana fakta itu mengubah rencana otomasi perusahaan?",
      "Penuaan penduduk mengubah komposisi permintaan. Peluang produk atau layanan apa yang muncul dari pergeseran itu?",
      "Urbanisasi memindahkan tenaga kerja muda ke kota besar. Bagaimana perusahaan di daerah dapat bersaing memperoleh tenaga kerja?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai pemilihan lokasi jangka panjang di bawah struktur penduduk yang berubah secara terprediksi tetapi tidak merata antar-wilayah.",
      alternatives: "Juduli ketiga kandidat lokasi dan sebutkan konsekuensi biaya, keterampilan, serta infrastrukturnya.",
      issues: "Bahas kesenjangan keterampilan, perbedaan upah minimum, persaingan tenaga kerja, dan pergeseran permintaan akibat penuaan penduduk.",
      conclusion: "Ambil posisi, sertakan rencana pengembangan keterampilan, dan sebutkan kandidat yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "gbe7-qris",
    title: "Kode QR di Meja Warung",
    subtitle: "Bagaimana satu standar pembayaran mengubah perilaku pedagang, konsumen, dan bank",
    forSession: 7,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Teknologi (slide Pak Wirawan); ketentuan Bank Indonesia tentang standar kode QR nasional",
    decisionMaker: "Direktur Ritel sebuah bank menengah",
    decisionPoint: "Menentukan strategi bank menghadapi standardisasi pembayaran yang menghapus keunggulan jaringan eksklusif",
    relevance: "Kasus untuk membaca kemajuan teknologi sebagai faktor lingkungan yang mengubah struktur industri, bukan sekadar alat.",
    sections: [
      { heading: "Dari Banyak Kode Menjadi Satu",
        body: `<p>Sebelum standardisasi, setiap penyedia dompet digital memiliki kode QR sendiri. Pedagang kecil
memasang beberapa lembar kode di mejanya, satu untuk tiap aplikasi, dan pelanggan hanya dapat membayar bila
memakai aplikasi yang sesuai. Penyedia dengan basis pengguna terbesar memiliki keunggulan jaringan yang besar.</p>
<p>Bank Indonesia kemudian menetapkan standar kode QR nasional yang dapat dibaca seluruh aplikasi pembayaran.
Satu kode di meja pedagang melayani semua penyedia. Jumlah pedagang yang menerima pembayaran digital meningkat
tajam, terutama pada usaha mikro yang sebelumnya hanya menerima uang tunai.</p>
<p>Dari sudut pandang lingkungan bisnis, ini adalah contoh perubahan teknologi yang bukan sekadar menambah alat
baru, melainkan mengubah struktur persaingan industri. Keunggulan jaringan eksklusif yang dibangun dengan biaya
promosi besar kehilangan sebagian nilainya dalam satu kebijakan.</p>` },
      { heading: "Siapa yang Diuntungkan dan Siapa yang Kehilangan",
        body: `<p>Pedagang kecil diuntungkan: satu kode, biaya perangkat mendekati nol, dan tarif layanan yang
diatur, dengan keringanan bagi kategori usaha mikro. Konsumen diuntungkan karena dapat memakai aplikasi apa pun.
Penyedia kecil diuntungkan karena dapat menjangkau pedagang tanpa membangun jaringan sendiri.</p>
<p>Penyedia besar kehilangan sebagian keunggulan yang dibangunnya. Bank kehilangan sebagian pendapatan dari
transaksi kartu dan menghadapi pertanyaan baru: jika pembayaran menjadi komoditas yang distandardisasi, di mana
nilai tambah bank berada?</p>
<p>Data transaksi menjadi jawaban yang sering disebut. Pembayaran menghasilkan aliran data tentang perilaku
pedagang dan konsumen yang dapat dipakai untuk penilaian kredit dan penawaran produk lain. Namun pemanfaatan data
itu menyentuh ketentuan perlindungan data pribadi dan pertanyaan tentang persetujuan.</p>` },
      { heading: "Pilihan Strategis Bank",
        body: `<p>Direktur ritel mempertimbangkan tiga arah. Pertama, bersaing pada pengalaman aplikasi dan
program loyalitas, menerima bahwa pembayaran menjadi komoditas. Kedua, membangun layanan berbasis data transaksi
berupa pembiayaan modal kerja mikro untuk pedagang. Ketiga, memusatkan sumber daya pada segmen yang belum
tersentuh standardisasi, misalnya pembayaran antarnegara.</p>
<p>Ketiganya menuntut kemampuan yang berbeda dan memiliki horizon waktu yang berbeda pula.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Sebelum dan Sesudah Standardisasi",
        note: "Perhatikan perubahan pada struktur persaingan, bukan hanya pada teknologinya.",
        rows: [["Aspek", "Sebelum standar nasional", "Sesudah"],
               ["Jumlah kode di meja pedagang", "Beberapa", "Satu"],
               ["Keunggulan jaringan penyedia besar", "Besar", "Berkurang"],
               ["Hambatan masuk penyedia baru", "Tinggi", "Lebih rendah"],
               ["Dasar persaingan", "Ukuran jaringan", "Pengalaman, tarif, layanan tambahan"]] },
      { title: "Exhibit 2: Tiga Arah Strategis Bank",
        note: "Bahan pembanding untuk bagian Issues.",
        rows: [["Arah", "Kemampuan yang dibutuhkan", "Horizon hasil", "Risiko utama"],
               ["Bersaing pada pengalaman", "Produk digital, pemasaran", "Pendek", "Mudah ditiru"],
               ["Pembiayaan berbasis data", "Analitik, manajemen risiko", "Menengah", "Kualitas kredit dan perlindungan data"],
               ["Fokus pembayaran antarnegara", "Kepatuhan lintas yurisdiksi", "Panjang", "Regulasi berlapis"]] }
    ],
    questions: [
      "Jelaskan bagaimana satu kebijakan standardisasi mengubah struktur persaingan industri pembayaran, memakai Exhibit 1.",
      "Jika pembayaran menjadi komoditas, di mana nilai tambah sebuah bank berada? Pertahankan jawaban Anda.",
      "Pemanfaatan data transaksi untuk penilaian kredit menjanjikan tetapi menyentuh perlindungan data pribadi. Batas apa yang seharusnya ditetapkan bank sendiri?",
      "Nilai ketiga arah pada Exhibit 2. Mana yang paling sesuai bagi bank menengah dengan sumber daya terbatas?",
      "Perubahan teknologi apa lagi yang menurut Anda berpotensi mengubah struktur industri jasa keuangan Indonesia dalam lima tahun ke depan?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai hilangnya sumber keunggulan lama akibat perubahan aturan teknologi yang berlaku bagi seluruh industri.",
      alternatives: "Juduli ketiga arah dan sebutkan kemampuan serta investasi yang dituntut masing-masing.",
      issues: "Bahas kemudahan peniruan, kualitas risiko kredit, kepatuhan perlindungan data, dan keterbatasan sumber daya bank menengah.",
      conclusion: "Ambil posisi, tetapkan urutan langkah, dan sebutkan arah yang Anda tolak beserta alasannya."
    }
  },
  {
    id: "gbe8-oss",
    title: "Perizinan Berusaha Berbasis Risiko dan Pabrik yang Menunggu",
    subtitle: "Ketika penyederhanaan aturan di tingkat pusat bertemu pelaksanaan di tingkat daerah",
    forSession: 8,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Hukum dan Hukum Bisnis (slide Pak Ferry); ketentuan perizinan berusaha berbasis risiko dan sistem OSS",
    decisionMaker: "Direktur Legal dan Perizinan sebuah perusahaan yang membangun fasilitas produksi baru",
    decisionPoint: "Menentukan strategi pemenuhan perizinan agar jadwal proyek tidak meleset",
    relevance: "Kasus untuk lingkungan hukum bisnis Indonesia: perizinan, kepatuhan, dan risiko hukum dalam operasi sehari-hari.",
    sections: [
      { heading: "Aturan Baru, Praktik Lama",
        body: `<p>Kerangka perizinan berusaha di Indonesia diubah menjadi berbasis risiko. Kegiatan usaha
diklasifikasikan menurut tingkat risikonya, dan persyaratan perizinan disesuaikan: usaha berisiko rendah cukup
memiliki nomor induk berusaha, sementara usaha berisiko tinggi memerlukan izin dengan verifikasi teknis. Seluruh
proses dijalankan melalui sistem elektronik terpadu.</p>
<p>Tujuannya menyederhanakan dan mempercepat. Dalam praktik, perusahaan menemukan bahwa penyederhanaan di tingkat
pusat tidak selalu diikuti kesiapan di tingkat daerah. Persyaratan teknis tertentu masih memerlukan rekomendasi
dinas daerah yang prosedurnya belum seragam, dan penafsiran atas klasifikasi risiko dapat berbeda antar-daerah.</p>
<p>Bagi proyek dengan jadwal ketat, ketidakpastian prosedur berubah menjadi risiko biaya. Setiap bulan keterlambatan
berarti bunga masa konstruksi berjalan tanpa pendapatan.</p>` },
      { heading: "Kepatuhan Bukan Hanya Perizinan Awal",
        body: `<p>Kesalahan yang lazim adalah memperlakukan perizinan sebagai pekerjaan sekali selesai. Kerangka
berbasis risiko justru memindahkan sebagian beban dari tahap awal ke tahap pengawasan. Perusahaan memperoleh izin
lebih cepat, tetapi menghadapi kewajiban pelaporan berkala dan pemeriksaan kepatuhan yang dapat berujung sanksi
administratif hingga penghentian kegiatan.</p>
<p>Selain perizinan usaha, terdapat lapisan hukum lain yang berjalan bersamaan: persetujuan lingkungan, ketentuan
ketenagakerjaan, kewajiban perpajakan daerah, standar keselamatan, serta ketentuan perlindungan konsumen bagi
produk yang dihasilkan. Setiap lapisan memiliki otoritas dan mekanisme sanksi sendiri.</p>
<p>Persoalan tambahan muncul pada perjanjian dengan mitra. Kontrak konstruksi, pengadaan peralatan, dan sewa lahan
memuat klausul yang mengaitkan kewajiban para pihak dengan tanggal perolehan izin. Keterlambatan izin dapat memicu
kewajiban ganti rugi kepada mitra.</p>` },
      { heading: "Pilihan Strategi Kepatuhan",
        body: `<p>Tiga pendekatan dipertimbangkan. Pertama, menjalankan proses secara bertahap sesuai urutan formal
dan menerima jadwal yang lebih panjang. Kedua, menjalankan beberapa proses secara paralel dengan menanggung risiko
pekerjaan yang harus diulang bila ada perubahan persyaratan. Ketiga, menyesuaikan rancangan fasilitas agar masuk
klasifikasi risiko yang lebih rendah, dengan konsekuensi pada kapasitas produksi.</p>
<p>Pendekatan ketiga menimbulkan pertanyaan tersendiri: menyesuaikan rancangan demi klasifikasi izin adalah
keputusan yang sah, tetapi dapat bergeser menjadi upaya menghindari pengawasan yang sesungguhnya diperlukan.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Lapisan Kewajiban Hukum Sebuah Fasilitas Produksi",
        note: "Setiap lapisan memiliki otoritas dan sanksi tersendiri.",
        rows: [["Lapisan", "Contoh kewajiban", "Konsekuensi kelalaian"],
               ["Perizinan berusaha", "Nomor induk berusaha, izin sesuai risiko", "Penghentian kegiatan"],
               ["Persetujuan lingkungan", "Dokumen lingkungan dan pemantauan", "Sanksi administratif"],
               ["Ketenagakerjaan", "Perjanjian kerja, keselamatan kerja", "Sanksi dan gugatan"],
               ["Perpajakan", "Pajak pusat dan daerah", "Denda dan bunga"],
               ["Perlindungan konsumen", "Standar dan label produk", "Penarikan produk"]] },
      { title: "Exhibit 2: Tiga Pendekatan dan Risikonya",
        note: "Bahan pembanding untuk bagian Issues.",
        rows: [["Pendekatan", "Dampak pada jadwal", "Risiko hukum", "Risiko biaya"],
               ["Bertahap sesuai urutan", "Paling lama", "Rendah", "Bunga masa konstruksi"],
               ["Paralel", "Lebih cepat", "Menengah", "Pekerjaan berulang"],
               ["Sesuaikan rancangan", "Cepat", "Bergantung niat dan pelaksanaan", "Kapasitas berkurang"]] }
    ],
    questions: [
      "Jelaskan logika perizinan berbasis risiko. Mengapa pendekatan itu memindahkan beban dari perizinan awal ke pengawasan?",
      "Exhibit 1 menunjukkan lapisan kewajiban yang berjalan bersamaan. Bagaimana perusahaan sebaiknya mengorganisasi fungsi kepatuhannya?",
      "Nilai ketiga pendekatan pada Exhibit 2. Mana yang Anda pilih untuk proyek dengan jadwal ketat?",
      "Menyesuaikan rancangan agar masuk klasifikasi risiko lebih rendah adalah keputusan yang sah. Kapan ia bergeser menjadi penghindaran pengawasan?",
      "Kontrak dengan mitra mengaitkan kewajiban dengan tanggal perolehan izin. Klausul apa yang sebaiknya dinegosiasikan sejak awal untuk melindungi perusahaan?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai ketidakpastian prosedur perizinan yang berdampak langsung pada jadwal dan biaya proyek.",
      alternatives: "Juduli ketiga pendekatan dan sebutkan konsekuensi jadwal, hukum, serta biayanya.",
      issues: "Bahas kesenjangan pelaksanaan pusat dan daerah, beban pengawasan setelah izin terbit, keterkaitan kontraktual, serta batas etis penyesuaian rancangan.",
      conclusion: "Ambil posisi, tetapkan struktur fungsi kepatuhan, dan sebutkan pendekatan yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "gbe9-arbitrase",
    title: "Kontrak Ekspor Kopi yang Berakhir di Arbitrase",
    subtitle: "Ketika satu klausul menentukan hukum mana yang berlaku dan di mana sengketa diselesaikan",
    forSession: 9,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Hukum Bisnis Internasional; Konvensi New York tentang pengakuan putusan arbitrase asing",
    decisionMaker: "Direktur Ekspor sebuah perusahaan pengolahan kopi Indonesia",
    decisionPoint: "Menentukan sikap dalam sengketa mutu dengan pembeli luar negeri dan merumuskan ulang klausul kontrak ke depan",
    relevance: "Kasus untuk kontrak internasional, arbitrase, incoterms, dan perlindungan kekayaan intelektual lintas negara.",
    sections: [
      { heading: "Kiriman yang Ditolak",
        body: `<p>Perusahaan ini mengekspor kopi arabika olahan ke pembeli di Eropa. Kontraknya menyebut mutu
berdasarkan contoh yang disetujui, penyerahan dengan syarat FOB pelabuhan asal, pembayaran dengan letter of credit,
dan penyelesaian sengketa melalui arbitrase di sebuah lembaga arbitrase internasional dengan hukum yang berlaku
adalah hukum negara pembeli.</p>
<p>Setibanya di pelabuhan tujuan, pembeli menyatakan sebagian kiriman tidak memenuhi mutu yang disepakati dan
menolak membayar sisa pembayaran. Perusahaan berpendapat mutu pada saat penyerahan sesuai contoh, dan bahwa dengan
syarat FOB risiko telah beralih kepada pembeli sejak barang melewati pagar kapal di pelabuhan asal.</p>
<p>Nilai sengketa cukup besar bagi perusahaan, sementara biaya arbitrase di luar negeri dalam mata uang asing juga
besar, ditambah biaya penasihat hukum dan penerjemahan dokumen.</p>` },
      { heading: "Tiga Pertanyaan Hukum yang Terpisah",
        body: `<p>Pertanyaan pertama adalah <strong>hukum mana yang berlaku</strong>. Para pihak bebas memilihnya,
dan dalam kontrak ini pilihannya jatuh pada hukum negara pembeli. Pilihan itu memengaruhi penafsiran tentang mutu,
kewajiban pemberitahuan cacat, dan jangka waktu pengajuan klaim.</p>
<p>Pertanyaan kedua adalah <strong>di mana sengketa diselesaikan</strong>. Arbitrase dipilih karena putusannya
lebih mudah diakui lintas negara berkat Konvensi New York yang diikuti banyak negara termasuk Indonesia. Namun
tempat arbitrase menentukan biaya, bahasa, dan kenyamanan para pihak.</p>
<p>Pertanyaan ketiga adalah <strong>kapan risiko beralih</strong>. Incoterms yang dipilih menentukan titik
peralihan risiko dan biaya. FOB menempatkan peralihan risiko pada pelabuhan asal, sedangkan CIF menempatkan
kewajiban pengangkutan dan asuransi pada penjual meskipun titik peralihan risikonya tetap di pelabuhan asal.
Kesalahpahaman tentang hal ini merupakan sumber sengketa yang sangat lazim.</p>` },
      { heading: "Pelajaran untuk Kontrak Berikutnya",
        body: `<p>Selain menyelesaikan sengketa berjalan, perusahaan perlu merumuskan ulang kontrak ekspornya:
memperjelas metode pengujian mutu dan pihak penguji independen, menetapkan jangka waktu pengajuan klaim, memilih
tempat arbitrase yang lebih seimbang secara biaya, serta mempertimbangkan pendaftaran merek di negara tujuan
sebelum produk beredar luas di sana.</p>
<p>Persoalan merek menjadi relevan karena beberapa nama kopi asal Indonesia pernah didaftarkan pihak lain di luar
negeri, sehingga produsen asal justru menghadapi hambatan memakai namanya sendiri.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Klausul Kunci dalam Kontrak Ekspor",
        note: "Periksa setiap klausul ini sebelum menandatangani kontrak lintas negara.",
        rows: [["Klausul", "Yang ditentukan", "Risiko bila lalai"],
               ["Pilihan hukum", "Hukum yang menafsirkan kontrak", "Penafsiran mutu tidak sesuai harapan"],
               ["Forum penyelesaian sengketa", "Pengadilan atau arbitrase, dan tempatnya", "Biaya berperkara sangat tinggi"],
               ["Incoterms", "Titik peralihan risiko dan biaya", "Sengketa tanggung jawab kerusakan"],
               ["Metode pengujian mutu", "Cara dan pihak penguji", "Perbedaan hasil uji"],
               ["Jangka waktu klaim", "Batas waktu mengajukan keberatan", "Klaim diajukan terlambat atau terlalu lama"]] },
      { title: "Exhibit 2: Perbandingan Tempat Penyelesaian Sengketa",
        note: "Pertimbangkan biaya dan keterlaksanaan putusan sekaligus.",
        rows: [["Pilihan", "Biaya relatif", "Keterlaksanaan putusan lintas negara"],
               ["Pengadilan negara penjual", "Rendah", "Sulit diakui di negara pembeli"],
               ["Pengadilan negara pembeli", "Tinggi", "Sulit diakui di negara penjual"],
               ["Arbitrase internasional", "Tinggi", "Relatif mudah lewat Konvensi New York"],
               ["Arbitrase nasional Indonesia", "Menengah", "Diakui di negara peserta konvensi"]] }
    ],
    questions: [
      "Jelaskan pengaruh pilihan hukum terhadap penilaian sengketa mutu pada kasus ini.",
      "Dengan syarat FOB, di titik mana risiko beralih? Apakah argumen perusahaan tentang peralihan risiko dapat dipertahankan?",
      "Nilai pilihan tempat penyelesaian sengketa pada Exhibit 2 untuk perusahaan Indonesia berukuran menengah.",
      "Rumuskan ulang tiga klausul pada Exhibit 1 agar melindungi perusahaan pada kontrak berikutnya.",
      "Mengapa pendaftaran merek di negara tujuan penting dilakukan sebelum ekspor berkembang? Apa risiko bila ditunda?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai sengketa mutu yang penyelesaiannya ditentukan oleh klausul kontrak yang disepakati sebelum sengketa muncul.",
      alternatives: "Juduli pilihan tindakan: menempuh arbitrase, berunding untuk penyelesaian damai, atau menerima potongan pembayaran.",
      issues: "Bahas biaya berperkara lintas negara, kekuatan bukti mutu, keterlaksanaan putusan, dan hubungan dagang jangka panjang.",
      conclusion: "Ambil posisi untuk sengketa berjalan dan tetapkan rumusan klausul baku untuk kontrak berikutnya."
    }
  },

  {
    id: "gbe10-otonomi",
    title: "Satu Perusahaan, Dua Puluh Kabupaten",
    subtitle: "Ketika otonomi daerah membuat aturan yang sama ditafsirkan dengan cara yang berbeda",
    forSession: 10,
    readingTime: 6,
    officialSource: "Bacaan pendamping: modul Lingkungan Pemerintahan; ketentuan pemerintahan daerah dan pajak serta retribusi daerah",
    decisionMaker: "Direktur Pengembangan Jaringan sebuah perusahaan ritel dan logistik",
    decisionPoint: "Menyusun strategi ekspansi ke banyak kabupaten dengan aturan dan praktik perizinan yang berbeda",
    relevance: "Kasus untuk struktur pemerintahan, desentralisasi, regulasi dan deregulasi, serta hubungan bisnis dengan pemerintah daerah.",
    sections: [
      { heading: "Rencana yang Sederhana di Atas Kertas",
        body: `<p>Perusahaan berencana membuka gerai dan pusat distribusi di dua puluh kabupaten dan kota dalam dua
tahun. Di kantor pusat, rencana itu tampak sebagai pekerjaan yang seragam: cari lahan, urus izin, bangun,
operasikan.</p>
<p>Kenyataan di lapangan berbeda. Otonomi daerah memberi kewenangan besar kepada pemerintah kabupaten dan kota
dalam penataan ruang, izin mendirikan bangunan, retribusi, serta ketentuan jam operasi dan perlindungan pasar
tradisional. Beberapa daerah membatasi jarak minimum gerai modern dari pasar rakyat, sebagian menetapkan kewajiban
menjual produk lokal dengan porsi tertentu, dan sebagian lagi mengatur jam buka.</p>
<p>Selain aturan tertulis, terdapat perbedaan praktik. Waktu penyelesaian izin untuk permohonan yang secara
substansi identik dapat berbeda beberapa kali lipat antar-daerah.</p>` },
      { heading: "Desentralisasi sebagai Peluang dan Hambatan",
        body: `<p>Desentralisasi memiliki logika yang kuat: pemerintah daerah lebih memahami kebutuhan wilayahnya
dan lebih dekat dengan warganya. Bagi perusahaan, ia berarti keragaman aturan yang menaikkan biaya kepatuhan dan
menyulitkan standardisasi model bisnis.</p>
<p>Namun desentralisasi juga menciptakan peluang. Daerah bersaing menarik investasi, dan sebagian menawarkan
kemudahan perizinan, keringanan retribusi, atau dukungan infrastruktur. Perusahaan yang memetakan perbedaan itu
dapat mengurutkan ekspansinya ke daerah yang paling siap terlebih dahulu.</p>
<p>Terdapat pula pertanyaan tentang hubungan dengan pemerintah daerah. Kemitraan yang sehat berupa penyerapan
produk lokal dan program pengembangan usaha kecil dapat memperkuat penerimaan. Batasnya menjadi kabur ketika
kemudahan dipertukarkan dengan komitmen yang tidak tercantum dalam ketentuan mana pun.</p>` },
      { heading: "Pilihan Strategi Ekspansi",
        body: `<p>Tiga pendekatan dipertimbangkan. Pertama, model gerai yang seragam secara nasional dengan
penyesuaian minimum, menerima bahwa sebagian daerah tidak dapat dimasuki. Kedua, model yang dapat disesuaikan per
daerah, termasuk porsi produk lokal dan format gerai, dengan biaya operasi lebih tinggi. Ketiga, ekspansi bertahap
yang diurutkan berdasarkan indeks kesiapan daerah, dimulai dari yang paling mudah.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Sumber Keragaman Aturan Antar-Daerah",
        note: "Petakan sebelum menyusun urutan ekspansi.",
        rows: [["Bidang", "Contoh perbedaan antar-daerah", "Dampak bagi perusahaan"],
               ["Penataan ruang", "Zona yang boleh untuk ritel modern", "Menentukan ketersediaan lahan"],
               ["Perlindungan pasar rakyat", "Jarak minimum dari pasar", "Membatasi titik lokasi"],
               ["Kandungan produk lokal", "Kewajiban porsi produk daerah", "Mengubah rantai pasok"],
               ["Retribusi dan pajak daerah", "Tarif dan jenis pungutan", "Memengaruhi biaya operasi"],
               ["Praktik perizinan", "Waktu penyelesaian", "Memengaruhi jadwal pembukaan"]] },
      { title: "Exhibit 2: Indeks Kesiapan Daerah (contoh penyusunan)",
        note: "Susun indeks serupa untuk mengurutkan ekspansi.",
        rows: [["Komponen indeks", "Bobot usulan", "Sumber data"],
               ["Kejelasan aturan tata ruang", "25%", "Peraturan daerah"],
               ["Waktu penyelesaian izin", "25%", "Pengalaman dan laporan kemudahan berusaha"],
               ["Beban retribusi", "20%", "Peraturan daerah"],
               ["Daya beli dan ukuran pasar", "20%", "Data statistik"],
               ["Ketersediaan infrastruktur logistik", "10%", "Survei internal"]] }
    ],
    questions: [
      "Jelaskan mengapa desentralisasi dapat menjadi hambatan sekaligus peluang bagi ekspansi perusahaan.",
      "Dengan Exhibit 1, aturan mana yang paling menentukan kelayakan sebuah lokasi, dan mengapa?",
      "Susun indeks kesiapan daerah versi Anda sendiri dengan bobot yang Anda tetapkan, lalu jelaskan alasan pembobotan itu.",
      "Kewajiban menjual produk lokal mengubah rantai pasok. Apakah kewajiban semacam itu sebaiknya dipandang sebagai beban atau sebagai peluang?",
      "Di mana batas antara kemitraan yang sehat dengan pemerintah daerah dan hubungan yang tidak pantas? Rumuskan aturan internal yang jelas."
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai ekspansi model bisnis yang menuntut keseragaman ke dalam lingkungan regulasi yang beragam.",
      alternatives: "Juduli ketiga pendekatan dan sebutkan konsekuensi biaya, kecepatan, serta cakupan wilayahnya.",
      issues: "Bahas biaya kepatuhan, keragaman aturan, hubungan dengan pemerintah daerah, dan risiko integritas.",
      conclusion: "Ambil posisi, tetapkan urutan wilayah berdasarkan indeks yang Anda susun, dan sebutkan pendekatan yang Anda tolak beserta alasannya."
    }
  }
  ];
  C.cases = (C.cases || []).concat(cases).sort((a, b) => a.forSession - b.forSession);
})();
