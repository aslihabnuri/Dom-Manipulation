/* ============================================================
   Studi Kasus OTM (MAN 5322): satu teaching case per bab.
   Format mengikuti gaya Harvard Business School: narasi tanpa
   kesimpulan, exhibit data, pertanyaan diskusi, panduan analisis.
   Angka pada exhibit bersifat indikatif untuk latihan analisis,
   disusun dari laporan publik dan pola industri yang lazim.
   ============================================================ */
(function () {
  const C = window.MBA_COURSES.otm;
  const cases = [

  {
    id: "otm1-indomie",
    title: "Indomie: Menakar Nilai di Setiap Bungkus Rp3.000",
    subtitle: "Bagaimana operasi mengubah tepung, minyak, dan bumbu menjadi keunggulan yang bertahan lima dekade",
    forSession: 1,
    readingTime: 7,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 1; Heizer, Render & Munson Bab 1",
    decisionMaker: "Direktur Operasi, divisi mi instan sebuah produsen makanan nasional",
    decisionPoint: "Menentukan apakah pertumbuhan berikutnya dikejar lewat efisiensi pabrik atau lewat perluasan varian rasa",
    relevance: "Menunjukkan model input–transformasi–output, empat V, dan sepuluh keputusan OM pada satu produk yang Anda kenal sehari-hari.",
    sections: [
      { heading: "Produk Rp3.000 yang Menjadi Institusi",
        body: `<p>Di rak minimarket mana pun di Indonesia, satu bungkus mi instan dijual pada harga yang nyaris
tidak berubah secara riil selama bertahun-tahun. Di baliknya ada rantai operasi yang panjang: gandum diimpor dari
Australia dan Kanada, digiling menjadi tepung di pabrik penggilingan milik grup yang sama, dikirim ke pabrik mi,
dicampur, dikukus, digoreng, didinginkan, dibumbui, dibungkus, lalu dikirim ke ratusan ribu titik penjualan.</p>
<p>Perusahaan mengoperasikan belasan pabrik yang tersebar dari Medan sampai Jayapura. Penempatan pabrik itu bukan
kebetulan: mi instan adalah produk dengan nilai per kilogram rendah tetapi volume besar, sehingga biaya angkut
menjadi komponen yang menentukan. Mendekatkan pabrik ke pasar lebih murah daripada mengangkut barang jadi
melintasi laut.</p>
<p>Yang menarik bagi mahasiswa operasi bukan besarnya perusahaan, melainkan betapa banyak keputusan operasional
yang harus benar secara bersamaan agar harga Rp3.000 itu tetap mungkin sambil tetap menghasilkan margin.</p>` },
      { heading: "Membaca Operasinya sebagai Sistem Transformasi",
        body: `<p>Dengan kerangka input–transformasi–output, operasi ini mengambil <em>transformed resources</em>
berupa material (tepung, minyak goreng, bumbu, kemasan) dan mengolahnya menggunakan <em>transforming resources</em>
berupa lini produksi kontinu dan operator terlatih. Outputnya adalah barang yang tahan disimpan berbulan-bulan,
sebuah sifat yang sangat memengaruhi desain rantai pasoknya.</p>
<p>Pada kerangka empat V, profilnya cukup ekstrem. <strong>Volume</strong> sangat tinggi, sehingga proses dapat
dibuat sangat sistematis dan padat modal. <strong>Variety</strong> sebenarnya tidak rendah: perusahaan memasarkan
puluhan varian rasa, termasuk rasa kedaerahan dan rasa khusus pasar ekspor. <strong>Variation</strong> permintaan
relatif stabil sepanjang tahun, dengan lonjakan menjelang Ramadan dan saat bencana. <strong>Visibility</strong>
mendekati nol: konsumen tidak pernah melihat proses produksinya.</p>
<p>Kombinasi volume tinggi dengan variety yang juga tinggi adalah kombinasi yang secara teori mahal. Setiap
pergantian varian menuntut penghentian lini, pembersihan, dan penyetelan ulang. Pertanyaannya, mengapa perusahaan
tetap memilih menambah varian?</p>` },
      { heading: "Sepuluh Keputusan yang Saling Mengunci",
        body: `<p>Jawabannya terletak pada cara sepuluh keputusan OM disusun agar saling mendukung. Desain produk
dibuat modular: adonan mi dan proses gorengnya nyaris identik untuk semua varian, sedangkan pembeda rasa hampir
seluruhnya berada pada sachet bumbu yang diproduksi terpisah. Dengan begitu, penambahan varian rasa tidak menuntut
perubahan pada bagian proses yang paling mahal.</p>
<p>Keputusan lokasi menekan biaya distribusi. Keputusan tata letak memakai <em>product layout</em> berupa lini
kontinu berkecepatan tinggi. Keputusan sumber daya manusia menekankan pelatihan operator untuk pergantian lini yang
cepat. Keputusan persediaan menyeimbangkan risiko harga gandum global dengan biaya simpan.</p>
<p>Pesaing dapat menyalin resep dan bahkan meniru kemasan. Yang jauh lebih sulit disalin adalah jaringan distribusi
yang menjangkau warung-warung kecil di pelosok, karena jaringan itu dibangun puluhan tahun dan membutuhkan armada,
gudang, serta hubungan dagang yang tidak bisa dibeli dalam semalam.</p>` },
      { heading: "Keputusan yang Harus Diambil",
        body: `<p>Rapat perencanaan tahunan menghadirkan dua usulan. Tim manufaktur mengusulkan investasi pada
lini berkecepatan lebih tinggi dan otomasi pengemasan, dengan janji menurunkan biaya konversi per bungkus.
Tim pemasaran mengusulkan penambahan varian rasa kedaerahan baru untuk merespons pesaing yang bergerak di segmen
premium, dengan konsekuensi jumlah pergantian lini meningkat.</p>
<p>Keduanya menuntut modal dan perhatian manajemen yang sama. Direktur operasi harus memilih, atau menemukan cara
menjalankan keduanya tanpa merusak struktur biaya yang selama ini menjadi keunggulan utama perusahaan.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Profil Empat V Tiga Operasi Makanan (indikatif)",
        note: "Skor 1 sampai 5. Disusun sebagai alat latihan, bukan pengukuran resmi perusahaan.",
        rows: [["Dimensi", "Pabrik mi instan", "Restoran cepat saji", "Katering pernikahan"],
               ["Volume", "5", "4", "1"],
               ["Variety", "3", "2", "5"],
               ["Variation permintaan", "2", "3", "5"],
               ["Visibility", "1", "4", "5"],
               ["Implikasi biaya per unit", "Sangat rendah", "Rendah", "Tinggi"]] },
      { title: "Exhibit 2: Struktur Biaya Perkiraan per Bungkus (indikatif)",
        note: "Proporsi disusun dari pola industri makanan kemasan bervolume besar.",
        rows: [["Komponen", "Porsi perkiraan"],
               ["Tepung terigu", "±30%"],
               ["Minyak goreng", "±15%"],
               ["Bumbu dan bahan pelengkap", "±12%"],
               ["Kemasan", "±10%"],
               ["Konversi pabrik (energi, tenaga kerja, penyusutan)", "±13%"],
               ["Distribusi dan penjualan", "±20%"]] }
    ],
    questions: [
      "Gambarkan operasi ini dalam model input–transformasi–output. Mana yang menjadi transformed resources dominan, dan apa konsekuensinya bagi desain prosesnya?",
      "Perusahaan memiliki volume tinggi sekaligus variety tinggi, kombinasi yang menurut teori empat V saling bertentangan. Keputusan desain apa yang membuat kombinasi itu tetap ekonomis?",
      "Dari sepuluh keputusan OM, tiga mana yang menurut Anda paling menentukan keunggulan biaya perusahaan ini? Beri alasan yang menghubungkan keputusan itu dengan struktur biaya pada Exhibit 2.",
      "Direktur operasi harus memilih antara otomasi lini dan penambahan varian. Analisis kedua pilihan itu dengan bahasa performance objectives, lalu ambil posisi.",
      "Jaringan distribusi disebut lebih sulit ditiru daripada resep. Apakah Anda setuju bahwa distribusi adalah sumber keunggulan yang berkelanjutan, atau ia hanya penghalang masuk yang bisa dilewati pemain digital?"
    ],
    guide: {
      problem: "Rumuskan masalah pokoknya sebagai ketegangan antara mempertahankan struktur biaya rendah dan merespons pergeseran selera pasar. Hindari menuliskan 'persaingan ketat' karena terlalu umum.",
      alternatives: "Beri judul pada setiap alternatif, misalnya 'Otomasi lini inti', 'Ekspansi varian lewat modularitas bumbu', dan 'Kombinasi bertahap'. Sebutkan sumber daya yang dibutuhkan, tanpa argumen pro dan kontra.",
      issues: "Bahas trade-off tiap alternatif memakai kerangka empat V dan performance objectives: pengaruhnya pada biaya, fleksibilitas, kecepatan, dan keandalan pasokan.",
      conclusion: "Pilih satu alternatif, sebutkan tiga langkah implementasi pertama beserta ukuran keberhasilannya, dan jelaskan kondisi yang akan membuat Anda meninjau ulang keputusan itu."
    }
  },

  {
    id: "otm2-toyota",
    title: "Toyota Indonesia: Strategi Operasi di Antara Pasar Domestik dan Ekspor",
    subtitle: "Ketika pabrik yang sama harus melayani konsumen keluarga Indonesia dan pembeli di puluhan negara",
    forSession: 2,
    readingTime: 7,
    officialSource: "Bacaan pendamping: Heizer, Render & Munson Bab 2; Slack, Brandon-Jones & Burgess Bab 3",
    decisionMaker: "Manajemen pabrik perakitan kendaraan penumpang di Karawang",
    decisionPoint: "Menentukan posisi pabrik pada matriks cost reduction dan local responsiveness saat porsi ekspor meningkat",
    relevance: "Latihan langsung untuk empat perspektif operations strategy, order winners dan qualifiers, serta empat strategi operasi global.",
    sections: [
      { heading: "Satu Pabrik, Dua Jenis Pelanggan",
        body: `<p>Industri otomotif Indonesia dibangun di atas satu kenyataan sederhana: keluarga Indonesia
membutuhkan kendaraan berkapasitas tujuh penumpang dengan harga terjangkau dan biaya perawatan rendah. Segmen
<em>multi purpose vehicle</em> menjawab kebutuhan itu dan selama bertahun-tahun menguasai porsi terbesar penjualan
kendaraan penumpang nasional.</p>
<p>Yang berubah pada dekade terakhir adalah tujuan produksinya. Model yang dirancang untuk pasar Indonesia
ternyata cocok pula bagi pasar Filipina, Vietnam, Timur Tengah, dan Amerika Latin, yang memiliki struktur keluarga
dan kondisi jalan serupa. Indonesia pun bergeser dari sekadar pasar menjadi basis produksi ekspor kendaraan utuh
bagi puluhan negara.</p>
<p>Pergeseran itu membawa persoalan operasi yang tidak sepele. Pembeli domestik dan pembeli ekspor menuntut hal
yang berbeda, sementara lini produksinya sama.</p>` },
      { heading: "Order Winners yang Berbeda di Dua Pasar",
        body: `<p>Di pasar domestik, faktor yang benar-benar memenangkan pesanan adalah harga, biaya perawatan,
ketersediaan suku cadang sampai ke kota kecil, dan nilai jual kembali. Kualitas rakitan penting, tetapi ia lebih
merupakan <em>order qualifier</em>: konsumen mengharapkannya ada dan tidak membandingkannya secara detail antar-merek
selama tidak ada masalah mencolok.</p>
<p>Di pasar ekspor, susunannya bergeser. Standar emisi dan keselamatan negara tujuan menjadi qualifier yang keras:
tidak lolos berarti tidak boleh masuk sama sekali. Keandalan jadwal pengiriman naik menjadi order winner, karena
importir menyusun kalender peluncuran dan promosi berdasarkan janji tanggal kapal.</p>
<p>Dua susunan prioritas itu menekan lini yang sama. Ketika permintaan domestik melonjak menjelang akhir tahun,
godaan untuk menggeser alokasi produksi menjadi besar, sementara komitmen ekspor tidak bisa ditunda tanpa merusak
reputasi keandalan yang justru menjadi order winner di sana.</p>` },
      { heading: "Empat Perspektif yang Menekan dari Empat Arah",
        body: `<p>Dari <strong>atas</strong>, strategi korporat prinsipal global menetapkan Indonesia sebagai basis
produksi kendaraan keluarga terjangkau untuk pasar berkembang. Dari <strong>luar</strong>, pasar domestik menuntut
harga dan jaringan purnajual, sementara pasar ekspor menuntut kepatuhan regulasi dan ketepatan jadwal. Dari
<strong>dalam</strong>, kapabilitas yang terbangun puluhan tahun berupa ekosistem pemasok lokal, tenaga kerja
terlatih, dan disiplin sistem produksi menjadi aset yang membedakan. Dari <strong>bawah</strong>, pengalaman
harian di lantai produksi terus melahirkan perbaikan kecil yang mengubah cara kerja.</p>
<p>Tingkat kandungan komponen lokal yang tinggi memberi keunggulan biaya sekaligus menciptakan ketergantungan:
ketika satu pemasok tingkat kedua terganggu, seluruh lini ikut terganggu. Pandemi memperlihatkan hal itu dengan
sangat jelas ketika pasokan semikonduktor terputus.</p>` },
      { heading: "Keputusan yang Harus Diambil",
        body: `<p>Manajemen pabrik menghadapi tiga usulan. Pertama, memperdalam spesialisasi sebagai basis ekspor
dengan menstandardisasi spesifikasi agar biaya turun, meskipun berarti mengurangi penyesuaian untuk selera lokal.
Kedua, mempertahankan fleksibilitas dua pasar dengan menambah kemampuan pergantian model pada lini, yang menuntut
investasi dan menurunkan utilisasi. Ketiga, memisahkan lini domestik dan ekspor, yang memberi kejelasan tetapi
mengorbankan skala.</p>
<p>Setiap pilihan menempatkan pabrik pada kuadran yang berbeda dalam matriks strategi operasi global.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Order Winners dan Qualifiers pada Dua Pasar",
        note: "Disusun sebagai alat latihan analisis, bukan riset pasar resmi.",
        rows: [["Faktor kompetitif", "Pasar domestik", "Pasar ekspor"],
               ["Harga jual", "Order winner", "Qualifier"],
               ["Biaya perawatan dan suku cadang", "Order winner", "Kurang menentukan"],
               ["Kepatuhan emisi dan keselamatan", "Qualifier", "Qualifier keras"],
               ["Ketepatan jadwal pengiriman", "Kurang menentukan", "Order winner"],
               ["Penyesuaian fitur untuk selera lokal", "Order winner", "Kurang menentukan"]] },
      { title: "Exhibit 2: Empat Strategi Operasi Global dan Posisi Kandidat",
        note: "Gunakan untuk memetakan ketiga usulan pada bagian akhir kasus.",
        rows: [["Strategi", "Cost reduction", "Local responsiveness", "Konsekuensi utama"],
               ["International", "Rendah", "Rendah", "Perubahan operasi minimal, keunggulan kecil"],
               ["Multidomestic", "Rendah", "Tinggi", "Respons lokal maksimal, skala terbatas"],
               ["Global", "Tinggi", "Rendah", "Skala besar, penyesuaian lokal minim"],
               ["Transnational", "Tinggi", "Tinggi", "Paling sulit dicapai, menuntut organisasi lintas negara"]] }
    ],
    questions: [
      "Petakan ketiga usulan manajemen ke dalam matriks empat strategi operasi global. Kuadran mana yang ditempati masing-masing?",
      "Exhibit 1 menunjukkan order winner yang berbeda di dua pasar. Bagaimana sebuah lini produksi tunggal dapat melayani dua susunan prioritas yang berbeda tanpa mengorbankan salah satunya?",
      "Kandungan komponen lokal yang tinggi memberi keunggulan biaya sekaligus risiko pasokan. Bagaimana Anda menilai trade-off itu dengan bahasa performance objectives?",
      "Gunakan empat perspektif operations strategy untuk menjelaskan mengapa keputusan ini tidak bisa diambil hanya oleh direktur pabrik.",
      "Jika Anda menjadi manajemen pabrik, usulan mana yang Anda pilih, dan indikator apa yang akan Anda pantau pada dua belas bulan pertama?"
    ],
    guide: {
      problem: "Nyatakan masalahnya sebagai ketidakselarasan antara satu konfigurasi operasi dan dua susunan order winner yang berbeda.",
      alternatives: "Juduli ketiga usulan, sebutkan investasi dan perubahan organisasi yang dituntut masing-masing, tanpa memberi penilaian pada tahap ini.",
      issues: "Uji tiap alternatif terhadap keempat perspektif operations strategy dan terhadap risiko pasokan yang tampak pada gangguan semikonduktor.",
      conclusion: "Ambil posisi, tetapkan kuadran target pada Exhibit 2, dan sebutkan tiga ukuran kinerja yang akan membuktikan pilihan Anda tepat."
    }
  }
,
  {
    id: "otm3-eiger",
    title: "Eiger Adventure: Merancang Produk untuk Tubuh dan Medan Indonesia",
    subtitle: "Ketika desain produk harus menyeimbangkan selera pasar, kemampuan penjahit mitra, dan biaya bahan",
    forSession: 3,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 4; Heizer, Render & Munson Bab 5",
    decisionMaker: "Kepala Divisi Product Development sebuah merek perlengkapan luar ruang nasional",
    decisionPoint: "Memilih struktur portofolio produk untuk musim berikutnya di tengah tekanan biaya bahan impor",
    relevance: "Latihan konkret untuk desain produk, standardisasi versus variasi, modularitas, dan design for manufacture.",
    sections: [
      { heading: "Merek Lokal yang Dibangun dari Tas Gunung",
        body: `<p>Merek perlengkapan luar ruang ini tumbuh dari bengkel kecil di Bandung menjadi jaringan ratusan
gerai. Produk awalnya sederhana: tas gunung yang dirancang untuk pendaki Indonesia, dengan panjang punggung dan
lebar bahu yang berbeda dari standar Eropa. Perbedaan antropometri itu menjadi alasan pertama konsumen memilih
merek lokal.</p>
<p>Portofolionya kemudian meluas. Dari tas, merek ini bergerak ke sepatu, jaket, sandal, jam tangan, bahkan
perlengkapan berkendara. Setiap kategori baru menjanjikan pasar tambahan, tetapi juga membawa persoalan desain,
pemasok, dan pengujian yang berbeda.</p>
<p>Di dalam perusahaan mulai muncul pertanyaan yang tidak nyaman: pada titik mana penambahan varian berhenti
menambah nilai dan mulai menggerogoti kemampuan tim desain untuk menghasilkan produk yang benar-benar unggul?</p>` },
      { heading: "Desain yang Menentukan Biaya Sebelum Produksi Dimulai",
        body: `<p>Prinsip yang diajarkan buku teks terlihat nyata di sini: sebagian besar biaya sebuah produk
terkunci pada tahap desain, jauh sebelum unit pertama diproduksi. Pilihan jenis kain, jumlah jahitan, jenis
ritsleting, dan cara komponen disambung menentukan berapa lama satu unit dikerjakan dan berapa banyak sisa bahan
yang terbuang.</p>
<p>Sebagian besar produksi dikerjakan mitra jahit di Jawa Barat. Kemampuan mesin dan keterampilan operator mitra
itu menjadi batas nyata bagi kebebasan desainer. Sebuah rancangan yang indah di atas kertas bisa menjadi mahal
apabila menuntut teknik jahitan yang hanya dikuasai sedikit operator.</p>
<p>Karena itulah tim desain mulai mendorong <em>modularitas</em>: rangka punggung yang sama dipakai pada beberapa
model tas dengan kapasitas berbeda, dan sistem tali yang sama dipakai lintas kategori. Dengan cara itu variasi yang
terlihat konsumen tetap kaya, sementara jumlah komponen unik yang harus dikelola operasi ditekan.</p>` },
      { heading: "Tekanan yang Datang Bersamaan",
        body: `<p>Tiga tekanan datang pada musim yang sama. Nilai tukar rupiah melemah, sehingga kain teknis impor
menjadi lebih mahal. Pesaing dari luar negeri masuk lewat kanal lokapasar dengan harga agresif. Sementara itu
konsumen muda menuntut siklus rilis yang lebih cepat, mengikuti irama media sosial, bukan irama musim pendakian.</p>
<p>Tim pemasaran meminta lebih banyak model dengan siklus lebih pendek. Tim operasi meminta lebih sedikit model
dengan rancangan yang lebih mudah dijahit. Keduanya memiliki alasan yang masuk akal.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Dampak Pilihan Desain pada Operasi (indikatif)",
        note: "Indeks relatif, 100 berarti setara model dasar. Disusun untuk latihan analisis.",
        rows: [["Pilihan desain", "Waktu jahit", "Sisa bahan", "Jumlah komponen unik"],
               ["Model dasar, komponen standar", "100", "100", "100"],
               ["Tambah saku multifungsi", "118", "112", "130"],
               ["Ganti ritsleting khusus impor", "104", "100", "115"],
               ["Rangka punggung modular lintas model", "97", "94", "62"]] },
      { title: "Exhibit 2: Struktur Portofolio Dua Skenario",
        note: "Skenario disusun sebagai bahan diskusi kelas.",
        rows: [["Ukuran", "Skenario A: portofolio lebar", "Skenario B: portofolio modular"],
               ["Jumlah model per musim", "±120", "±70"],
               ["Komponen unik yang dikelola", "Tinggi", "Menengah"],
               ["Kecepatan rilis model baru", "Cepat", "Menengah"],
               ["Risiko persediaan tidak terjual", "Tinggi", "Menengah"]] }
    ],
    questions: [
      "Mengapa keputusan desain disebut mengunci sebagian besar biaya produk? Tunjukkan buktinya dari Exhibit 1.",
      "Modularitas menurunkan jumlah komponen unik tetapi membatasi kebebasan desain. Bagaimana Anda menilai trade-off ini untuk merek yang bersaing pada identitas produk?",
      "Kemampuan mitra jahit menjadi batas nyata bagi desain. Bagaimana prinsip design for manufacture seharusnya mengubah proses kerja tim desain?",
      "Tim pemasaran menuntut siklus rilis lebih cepat. Perubahan apa pada desain produk, bukan pada pabrik, yang paling efektif memenuhi tuntutan itu?",
      "Pilih satu skenario pada Exhibit 2 dan pertahankan pilihan Anda dengan bahasa performance objectives."
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai ketegangan antara kekayaan portofolio yang diminta pasar dan kesederhanaan operasi yang dituntut struktur biaya.",
      alternatives: "Juduli minimal dua alternatif portofolio, lengkapi dengan konsekuensi pada komponen unik dan kapasitas mitra jahit.",
      issues: "Bahas dampak tiap alternatif terhadap biaya, kecepatan rilis, risiko persediaan, dan identitas merek.",
      conclusion: "Ambil posisi dan tetapkan aturan desain yang harus dipatuhi tim, misalnya batas jumlah komponen unik per model."
    }
  },

  {
    id: "otm4-bank",
    title: "Bank Jago dan Cabang yang Tidak Pernah Dibangun",
    subtitle: "Ketika desain proses berpindah dari antrean teller ke alur aplikasi, siapa yang mengerjakan pekerjaannya?",
    forSession: 4,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 5 dan 6; Heizer, Render & Munson Bab 7",
    decisionMaker: "Chief Operating Officer sebuah bank digital di Indonesia",
    decisionPoint: "Menentukan seberapa jauh proses pembukaan rekening dan penanganan keluhan boleh diotomasi sepenuhnya",
    relevance: "Kasus untuk tipe proses jasa, process technology, dan peran manusia dalam operasi berbasis teknologi.",
    sections: [
      { heading: "Bank Tanpa Antrean",
        body: `<p>Bank digital di Indonesia tumbuh cepat pada awal 2020-an dengan proposisi yang sederhana: seluruh
layanan perbankan dasar dapat diselesaikan dari telepon genggam tanpa pernah mendatangi cabang. Pembukaan rekening
yang dulu memakan waktu puluhan menit di kantor cabang kini diklaim selesai dalam hitungan menit lewat verifikasi
wajah dan pencocokan data kependudukan.</p>
<p>Dari sudut pandang operasi, yang terjadi bukan sekadar digitalisasi, melainkan perubahan tipe proses. Proses
yang dulu berbentuk <em>professional service</em> dengan kontak tinggi dan penanganan individual bergeser menjadi
<em>mass service</em> dengan volume sangat besar, variasi rendah, dan kontak yang dimediasi layar.</p>
<p>Pergeseran itu memindahkan sebagian pekerjaan kepada nasabah. Nasabah kini mengisi data sendiri, memotret
dokumen sendiri, dan menyelesaikan verifikasi sendiri. Dalam bahasa buku teks, sebagian aktivitas berpindah dari
<em>back office</em> ke pelanggan.</p>` },
      { heading: "Ketika Proses Otomatis Bertemu Kasus yang Tidak Standar",
        body: `<p>Masalah muncul pada ekor distribusi. Sebagian kecil pemohon memiliki data kependudukan yang tidak
cocok, foto yang tidak terbaca sistem, atau kondisi yang tidak diantisipasi perancang alur. Persentasenya kecil,
tetapi karena volumenya besar, jumlah absolutnya besar pula.</p>
<p>Kasus semacam ini tidak bisa diselesaikan oleh alur otomatis. Ia membutuhkan penilaian manusia, dan justru di
sinilah pengalaman nasabah paling menentukan reputasi bank. Nasabah yang alurnya mulus tidak bercerita kepada siapa
pun; nasabah yang tertahan tiga hari menulis di media sosial.</p>
<p>Tim operasi menghadapi pertanyaan klasik desain proses jasa: berapa banyak kapasitas manusia yang harus
disiapkan untuk menangani perkecualian, dan bagaimana pekerjaan itu dirancang agar staf memiliki wewenang cukup
untuk menyelesaikan masalah, bukan sekadar meneruskannya.</p>` },
      { heading: "Dua Filosofi Desain Pekerjaan",
        body: `<p>Usulan pertama datang dari tim teknologi: perbesar cakupan otomasi, tambahkan model pembelajaran
mesin untuk menilai dokumen yang buram, dan sisakan tim manusia yang sangat kecil untuk kasus paling sulit. Biaya
per transaksi turun, tetapi waktu tunggu kasus perkecualian berpotensi memanjang.</p>
<p>Usulan kedua datang dari tim layanan: pertahankan otomasi untuk alur utama, tetapi bangun tim penyelesai kasus
dengan pelatihan mendalam dan wewenang mengambil keputusan sampai batas tertentu tanpa eskalasi. Biaya per
transaksi naik, tetapi tingkat penyelesaian pada kontak pertama diperkirakan membaik.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Pergeseran Tipe Proses",
        note: "Kerangka mengikuti klasifikasi tipe proses jasa pada buku teks.",
        rows: [["Dimensi", "Cabang konvensional", "Bank digital"],
               ["Volume transaksi per staf", "Rendah", "Sangat tinggi"],
               ["Variasi penanganan", "Tinggi", "Rendah pada alur utama"],
               ["Kontak dengan pelanggan", "Tatap muka", "Dimediasi aplikasi"],
               ["Tipe proses dominan", "Professional service", "Mass service"],
               ["Pekerjaan yang dilakukan pelanggan", "Minimal", "Besar"]] },
      { title: "Exhibit 2: Dua Usulan Desain Proses (indikatif)",
        note: "Angka indikatif sebagai bahan latihan perbandingan, bukan data perusahaan.",
        rows: [["Ukuran", "Usulan otomasi maksimal", "Usulan tim penyelesai"],
               ["Biaya per pembukaan rekening", "Lebih rendah", "Lebih tinggi"],
               ["Waktu selesai kasus normal", "Setara", "Setara"],
               ["Waktu selesai kasus perkecualian", "Berpotensi memanjang", "Lebih pendek"],
               ["Penyelesaian pada kontak pertama", "Rendah", "Tinggi"],
               ["Kebutuhan pelatihan staf", "Rendah", "Tinggi"]] }
    ],
    questions: [
      "Jelaskan pergeseran tipe proses pada Exhibit 1 dengan bahasa empat V. Dimensi mana yang berubah paling drastis?",
      "Sebagian pekerjaan berpindah kepada nasabah. Apa konsekuensi pergeseran itu bagi pengukuran produktivitas bank?",
      "Kasus perkecualian jumlahnya kecil secara persentase tetapi besar secara absolut. Bagaimana prinsip desain proses seharusnya memperlakukan ekor distribusi semacam ini?",
      "Bandingkan kedua usulan pada Exhibit 2 memakai performance objectives. Objective mana yang dikorbankan oleh masing-masing?",
      "Ambil posisi sebagai COO dan tentukan berapa besar kapasitas manusia yang Anda siapkan, beserta alasannya."
    ],
    guide: {
      problem: "Nyatakan masalahnya sebagai pertanyaan desain proses, yaitu bagaimana mengalokasikan pekerjaan antara otomasi, pelanggan, dan staf.",
      alternatives: "Juduli kedua usulan, lengkapi dengan implikasi pada struktur biaya dan kebutuhan pelatihan.",
      issues: "Bahas trade-off biaya versus pengalaman pelanggan, risiko reputasi dari kasus perkecualian, serta batas kemampuan teknologi saat ini.",
      conclusion: "Tetapkan aturan pembagian kerja yang konkret, misalnya kategori kasus yang wajib ditangani manusia, dan ukuran yang akan Anda pantau."
    }
  },
  {
    id: "otm5-garuda",
    title: "Maskapai Nasional dan Kursi yang Terbang Kosong",
    subtitle: "Mengelola kapasitas ketika produknya tidak bisa disimpan dan permintaannya melonjak dua kali setahun",
    forSession: 5,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 11; Heizer, Render & Munson Bab 7 Suplemen",
    decisionMaker: "Direktur Perencanaan Jaringan sebuah maskapai penerbangan nasional",
    decisionPoint: "Menentukan strategi kapasitas menghadapi puncak permintaan Lebaran dan lembah permintaan pada bulan-bulan sepi",
    relevance: "Kasus klasik untuk capacity management pada jasa: kapasitas tidak bisa disimpan, permintaan sangat berfluktuasi.",
    sections: [
      { heading: "Dua Minggu yang Menentukan Setahun",
        body: `<p>Pola permintaan penerbangan domestik Indonesia memiliki bentuk yang sangat khas. Selama sekitar
dua minggu di sekitar Idulfitri, permintaan melonjak jauh di atas rata-rata tahunan, terutama pada rute-rute menuju
kota asal para perantau. Setelah itu permintaan turun tajam, dan pada bulan-bulan tertentu banyak penerbangan
berangkat dengan tingkat isian yang jauh di bawah titik impas.</p>
<p>Persoalannya, kapasitas maskapai berupa pesawat, awak, dan slot bandara tidak bisa disimpan. Kursi yang kosong
hari ini hangus selamanya. Tidak ada gudang untuk menampung kapasitas yang tidak terpakai lalu menjualnya bulan
depan.</p>
<p>Menambah pesawat untuk melayani puncak berarti menanggung biaya sewa dan perawatan sepanjang tahun untuk aset
yang menganggur sebagian besar waktu. Tidak menambah berarti kehilangan pendapatan pada periode paling
menguntungkan sekaligus mengecewakan penumpang.</p>` },
      { heading: "Tiga Cara Menyiasati Ketidakcocokan",
        body: `<p>Buku teks menawarkan tiga strategi dasar. <strong>Level capacity</strong> mempertahankan kapasitas
tetap dan membiarkan permintaan yang menyesuaikan lewat harga. <strong>Chase demand</strong> menggerakkan kapasitas
mengikuti permintaan, misalnya lewat penyewaan pesawat jangka pendek dan penjadwalan awak tambahan. <strong>Demand
management</strong> berusaha meratakan permintaan itu sendiri.</p>
<p>Dalam praktik, maskapai memakai ketiganya secara bersamaan. Harga tiket naik tajam menjelang puncak, yang
merupakan bentuk demand management sekaligus alat memilih penumpang yang paling bersedia membayar. Pesawat disewa
untuk musim ramai, yang merupakan bentuk chase demand. Sementara itu jaringan rute inti dipertahankan sepanjang
tahun, yang merupakan level capacity.</p>
<p>Yang menyulitkan, ketiga alat itu saling memengaruhi. Harga tinggi pada puncak mengundang perhatian publik dan
regulator. Penyewaan pesawat jangka pendek menuntut awak dan sertifikasi yang tidak selalu tersedia. Rute yang
dipertahankan sepanjang tahun demi kehadiran jaringan dapat menggerus laba.</p>` },
      { heading: "Keputusan Menjelang Musim Puncak Berikutnya",
        body: `<p>Rapat perencanaan jaringan mempertimbangkan tiga langkah. Pertama, menyewa beberapa pesawat
untuk enam minggu di sekitar puncak. Kedua, menambah frekuensi pada rute yang sudah ada dengan memperpanjang jam
operasi harian, memanfaatkan armada yang dimiliki secara lebih intensif. Ketiga, menahan kapasitas dan mengandalkan
penetapan harga untuk memaksimalkan pendapatan per kursi.</p>
<p>Direktur perencanaan jaringan harus memilih di tengah ketidakpastian: permintaan puncak diperkirakan, tidak
diketahui, dan kesalahan pada dua arah sama-sama mahal.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Pola Permintaan Bulanan (indeks indikatif)",
        note: "Indeks 100 adalah rata-rata bulanan. Pola disusun untuk latihan analisis kapasitas.",
        rows: [["Periode", "Indeks permintaan", "Tingkat isian tipikal"],
               ["Bulan sepi (Feb, Nov)", "78", "±65%"],
               ["Bulan normal", "100", "±78%"],
               ["Liburan sekolah", "126", "±85%"],
               ["Dua minggu puncak Lebaran", "185", "±92%"]] },
      { title: "Exhibit 2: Tiga Strategi Kapasitas",
        note: "Bandingkan konsekuensi tiap strategi sebelum memilih.",
        rows: [["Strategi", "Mekanisme utama", "Risiko utama"],
               ["Level capacity", "Kapasitas tetap sepanjang tahun", "Kehilangan pendapatan pada puncak"],
               ["Chase demand", "Sewa pesawat dan awak musiman", "Biaya tinggi, ketersediaan tidak pasti"],
               ["Demand management", "Harga dinamis, promo di luar puncak", "Sorotan publik dan regulator"]] }
    ],
    questions: [
      "Mengapa sifat jasa yang tidak dapat disimpan membuat keputusan kapasitas maskapai berbeda dari keputusan kapasitas pabrik?",
      "Dengan pola pada Exhibit 1, hitung secara kasar berapa persen kapasitas tambahan yang dibutuhkan untuk melayani puncak sepenuhnya, dan diskusikan apakah itu masuk akal secara ekonomi.",
      "Harga tinggi pada musim puncak efektif secara ekonomi tetapi menimbulkan sorotan publik. Bagaimana Anda menempatkan pertimbangan ini dalam keputusan operasi?",
      "Dari ketiga langkah yang dipertimbangkan, mana yang paling tahan terhadap kesalahan peramalan permintaan? Jelaskan alasannya.",
      "Industri jasa Indonesia lain apa yang menghadapi pola permintaan serupa, dan pelajaran apa yang bisa dipindahkan?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai ketidakcocokan antara pola permintaan yang sangat berfluktuasi dan kapasitas yang tidak dapat disimpan.",
      alternatives: "Juduli ketiga langkah, sebutkan komitmen biaya dan waktu penyiapan masing-masing.",
      issues: "Bahas risiko peramalan, biaya kapasitas menganggur, dampak reputasi dari penetapan harga, serta keterbatasan awak dan slot bandara.",
      conclusion: "Pilih kombinasi strategi, bukan hanya satu, dan tetapkan pemicu keputusan berdasarkan data pemesanan awal."
    }
  },

  {
    id: "otm6-apotek",
    title: "Kimia Farma Apotek: Persediaan yang Tidak Boleh Habis dan Tidak Boleh Menumpuk",
    subtitle: "Mengelola ribuan jenis obat dengan masa kedaluwarsa, resep tak terduga, dan kewajiban pelayanan publik",
    forSession: 6,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 12; Heizer, Render & Munson Bab 12",
    decisionMaker: "Manajer Rantai Pasok jaringan apotek nasional",
    decisionPoint: "Merancang kebijakan persediaan yang menekan obat kedaluwarsa tanpa menaikkan kejadian obat kosong",
    relevance: "Kasus untuk analisis ABC, economic order quantity, safety stock, dan reorder point pada konteks yang menyangkut keselamatan.",
    sections: [
      { heading: "Ribuan Item, Satu Rak",
        body: `<p>Sebuah gerai apotek jaringan biasanya menyimpan beberapa ribu jenis barang, mulai dari obat bebas
yang laku setiap hari sampai obat khusus yang mungkin hanya diminta beberapa kali dalam setahun. Setiap jenis
memiliki masa kedaluwarsa, sebagian menuntut penyimpanan suhu tertentu, dan sebagian lagi memerlukan dokumen
khusus untuk pemesanan.</p>
<p>Dua kegagalan mengintai dari arah berlawanan. Jika persediaan terlalu tipis, pasien datang dengan resep dan
pulang dengan tangan kosong, yang berarti kehilangan penjualan sekaligus kehilangan kepercayaan pada saat orang
sedang membutuhkan. Jika persediaan terlalu tebal, sebagian obat akan melewati tanggal kedaluwarsa dan harus
dimusnahkan, yang berarti kerugian langsung.</p>
<p>Manajemen menemukan pola yang lazim dalam teori: sebagian kecil jenis barang menyumbang sebagian besar nilai
penjualan, sementara sebagian besar jenis barang menyumbang porsi nilai yang kecil namun menuntut perhatian
administratif yang sama besarnya.</p>` },
      { heading: "Kebijakan yang Berlaku Sekarang",
        body: `<p>Selama ini setiap gerai memesan berdasarkan penilaian apoteker penanggung jawab dengan aturan
sederhana: pesan ketika rak terlihat menipis. Aturan itu bekerja pada barang yang lakunya rutin, tetapi gagal pada
dua ujung. Pada obat yang sangat laku, pemesanan sering terlambat sehingga terjadi kekosongan pendek. Pada obat
yang jarang diminta, pemesanan cenderung berlebih karena pemasok menerapkan jumlah pemesanan minimum.</p>
<p>Data internal menunjukkan nilai obat yang dimusnahkan karena kedaluwarsa mencapai porsi yang tidak kecil dari
laba kotor gerai, sementara keluhan obat kosong tetap muncul secara rutin. Keduanya terjadi bersamaan, yang
merupakan tanda klasik bahwa persoalannya bukan jumlah persediaan melainkan kebijakan pengelolaannya.</p>` },
      { heading: "Usulan Perubahan",
        body: `<p>Tim rantai pasok mengusulkan klasifikasi ABC berbasis nilai pemakaian, dengan aturan berbeda per
kelas. Kelas A dipantau ketat dengan titik pemesanan ulang yang dihitung, kelas B memakai jadwal pemesanan berkala,
dan kelas C dipesan dalam jumlah lebih besar dengan frekuensi rendah. Untuk obat dengan masa simpan pendek,
diusulkan pengiriman lebih sering dalam jumlah lebih kecil dari gudang regional.</p>
<p>Usulan itu menuntut disiplin pencatatan yang lebih baik di gerai dan biaya transportasi yang lebih tinggi.
Sebagian kepala gerai menolak karena merasa kehilangan keleluasaan menilai kebutuhan pasiennya sendiri.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Distribusi Nilai Persediaan (indikatif)",
        note: "Pola khas analisis ABC pada ritel farmasi, disusun untuk latihan.",
        rows: [["Kelas", "Porsi jumlah jenis", "Porsi nilai pemakaian", "Contoh"],
               ["A", "±15%", "±70%", "Obat kronis yang rutin ditebus"],
               ["B", "±30%", "±22%", "Obat musiman dan suplemen populer"],
               ["C", "±55%", "±8%", "Obat khusus, alat kesehatan kecil"]] },
      { title: "Exhibit 2: Data Contoh untuk Perhitungan",
        note: "Gunakan untuk berlatih menghitung EOQ dan reorder point.",
        rows: [["Parameter", "Obat kelas A contoh"],
               ["Permintaan tahunan", "12.000 unit"],
               ["Biaya pesan per pesanan", "Rp150.000"],
               ["Biaya simpan per unit per tahun", "Rp2.500"],
               ["Waktu tunggu pemasok", "5 hari"],
               ["Simpangan baku permintaan harian", "6 unit"]] }
    ],
    questions: [
      "Hitung EOQ untuk obat pada Exhibit 2, lalu tentukan reorder point dengan tingkat layanan yang Anda pilih. Jelaskan mengapa Anda memilih tingkat layanan itu.",
      "Mengapa kekosongan obat dan pemusnahan obat kedaluwarsa bisa terjadi bersamaan? Apa yang ditunjukkan gejala itu tentang kebijakan persediaan yang berlaku?",
      "Analisis ABC mengalokasikan perhatian secara tidak merata. Apakah pendekatan itu dapat dibenarkan ketika barang yang dikelola menyangkut keselamatan pasien?",
      "Pengiriman lebih sering menurunkan risiko kedaluwarsa tetapi menaikkan biaya transportasi. Bagaimana Anda mengevaluasi trade-off ini?",
      "Kepala gerai menolak kehilangan keleluasaan. Bagaimana Anda merancang kebijakan yang tetap memberi ruang penilaian profesional tanpa mengembalikan masalah lama?"
    ],
    guide: {
      problem: "Nyatakan masalahnya sebagai kebijakan persediaan yang seragam untuk barang yang karakteristiknya sangat berbeda.",
      alternatives: "Juduli alternatif kebijakan, misalnya 'ABC dengan aturan per kelas', 'pengiriman frekuensi tinggi', dan 'sentralisasi keputusan pemesanan'.",
      issues: "Bahas biaya simpan versus biaya kekosongan, risiko keselamatan, kapasitas administratif gerai, dan penerimaan dari kepala gerai.",
      conclusion: "Pilih kebijakan, sebutkan parameter awalnya, dan tetapkan indikator yang akan meninjau ulang parameter tersebut."
    }
  },
  {
    id: "otm7-jne",
    title: "Musim Harbolnas di Gudang Sortir",
    subtitle: "Perencanaan dan pengendalian ketika volume paket naik tiga kali lipat dalam dua puluh empat jam",
    forSession: 7,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 10; Heizer, Render & Munson Bab 15",
    decisionMaker: "Kepala Operasi pusat sortir sebuah perusahaan jasa kurir nasional",
    decisionPoint: "Menyusun rencana dan aturan pengendalian untuk periode puncak belanja daring akhir tahun",
    relevance: "Kasus untuk planning and control, penjadwalan, aturan prioritas, dan pengendalian beban kerja.",
    sections: [
      { heading: "Puncak yang Sudah Diketahui Tanggalnya",
        body: `<p>Berbeda dari kebanyakan lonjakan permintaan, puncak belanja daring Indonesia terjadi pada tanggal
yang sudah diketahui jauh hari: tanggal kembar setiap bulan dan puncaknya pada 12 Desember. Lokapasar mengumumkan
promo berminggu-minggu sebelumnya, sehingga perusahaan kurir memiliki keistimewaan langka, yaitu mengetahui kapan
badai akan datang.</p>
<p>Namun mengetahui tanggalnya tidak menyelesaikan masalah. Pada hari puncak, jumlah paket yang masuk ke pusat
sortir dapat mencapai beberapa kali lipat volume harian biasa. Paket datang dalam gelombang yang tidak merata,
bergantung pada kapan penjual menyerahkan barang. Kapasitas mesin sortir tetap, ruang gudang tetap, dan jumlah
kendaraan pengantar terbatas.</p>
<p>Yang bisa diatur adalah urutan pekerjaan, alokasi tenaga kerja, dan janji layanan kepada pelanggan.</p>` },
      { heading: "Aturan Prioritas yang Saling Bertentangan",
        body: `<p>Di lantai sortir, setiap paket bersaing memperebutkan kapasitas yang sama. Beberapa aturan
prioritas dapat dipakai. Melayani berdasarkan urutan kedatangan bersifat adil dan mudah dijelaskan, tetapi membuat
paket layanan kilat yang datang belakangan tertahan di belakang antrean panjang. Mendahulukan paket dengan waktu
proses terpendek menaikkan jumlah paket selesai per jam, tetapi paket besar dapat tertahan berhari-hari.
Mendahulukan paket dengan tenggat paling dekat menjaga janji layanan, tetapi menurunkan hasil total.</p>
<p>Pada praktiknya, perusahaan menjual beberapa tingkat layanan dengan janji waktu berbeda, dan pelanggan membayar
harga berbeda pula. Aturan prioritas karena itu bukan sekadar keputusan teknis, melainkan keputusan yang menyangkut
janji komersial.</p>
<p>Terdapat pula persoalan pengendalian beban. Ketika seluruh paket dilepas ke lantai sortir sekaligus, ruang
gudang penuh, pergerakan melambat, dan waktu penyelesaian justru memanjang. Membatasi jumlah paket yang dilepas ke
proses pada satu waktu terdengar berlawanan dengan intuisi, tetapi sering mempercepat keseluruhan.</p>` },
      { heading: "Rencana untuk Musim Berikutnya",
        body: `<p>Tim operasi menyiapkan tiga komponen rencana. Pertama, penambahan tenaga kerja musiman dengan
pelatihan singkat, yang menaikkan kapasitas tetapi menurunkan produktivitas per orang pada minggu pertama. Kedua,
perubahan aturan prioritas menjadi berbasis tenggat layanan. Ketiga, pengaturan jadwal penjemputan dari penjual
besar agar kedatangan paket lebih merata sepanjang hari.</p>
<p>Ketiganya menuntut koordinasi dengan pihak di luar kendali operasi: lokapasar, penjual besar, dan penyedia
tenaga kerja.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Perbandingan Aturan Prioritas",
        note: "Kerangka mengikuti pembahasan aturan penjadwalan pada buku teks.",
        rows: [["Aturan", "Kelebihan", "Kelemahan utama"],
               ["FCFS (urutan kedatangan)", "Adil dan mudah dijelaskan", "Layanan kilat ikut tertahan"],
               ["SPT (waktu proses terpendek)", "Hasil per jam tertinggi", "Paket besar tertahan lama"],
               ["EDD (tenggat terdekat)", "Janji layanan terjaga", "Hasil total lebih rendah"],
               ["Prioritas berbayar", "Selaras dengan pendapatan", "Berpotensi dianggap tidak adil"]] },
      { title: "Exhibit 2: Profil Beban Hari Puncak (indikatif)",
        note: "Disusun sebagai bahan latihan perencanaan kapasitas harian.",
        rows: [["Jam", "Porsi paket masuk", "Kapasitas sortir tersedia"],
               ["08.00–12.00", "15%", "25%"],
               ["12.00–17.00", "30%", "30%"],
               ["17.00–22.00", "40%", "30%"],
               ["22.00–08.00", "15%", "15%"]] }
    ],
    questions: [
      "Dengan profil pada Exhibit 2, di jam berapa penumpukan terbesar terjadi, dan langkah apa yang paling efektif meredamnya?",
      "Pilih satu aturan prioritas dari Exhibit 1 untuk hari puncak dan pertahankan pilihan Anda dengan mempertimbangkan janji layanan berbayar.",
      "Membatasi jumlah paket yang dilepas ke lantai sortir dapat mempercepat penyelesaian keseluruhan. Jelaskan mengapa, memakai konsep beban kerja dan antrean.",
      "Tenaga kerja musiman menaikkan kapasitas tetapi menurunkan produktivitas awal. Bagaimana Anda memperhitungkan kurva belajar itu dalam rencana?",
      "Sebagian solusi berada di luar kendali operasi. Bagaimana Anda merancang kesepakatan dengan lokapasar dan penjual besar agar beban lebih merata?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai ketidakcocokan antara pola kedatangan paket dan pola ketersediaan kapasitas dalam satu hari.",
      alternatives: "Juduli komponen rencana secara terpisah agar dapat dievaluasi sendiri-sendiri.",
      issues: "Bahas trade-off antara hasil total, janji layanan, keadilan antar-pelanggan, dan biaya tenaga kerja musiman.",
      conclusion: "Susun rencana gabungan dengan aturan prioritas yang jelas dan ukuran keberhasilan harian yang dapat dipantau selama musim puncak."
    }
  },

  {
    id: "otm8-unilever",
    title: "Rantai Pasok Barang Konsumsi dan Warung yang Tak Terhitung Jumlahnya",
    subtitle: "Ketika produk harus tersedia di ratusan ribu titik penjualan kecil dengan pesanan yang tidak menentu",
    forSession: 8,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 13; Heizer, Render & Munson Bab 11",
    decisionMaker: "Direktur Rantai Pasok sebuah perusahaan barang konsumsi bergerak cepat di Indonesia",
    decisionPoint: "Memilih model distribusi ke ritel tradisional di tengah kenaikan biaya logistik dan masuknya distribusi digital",
    relevance: "Kasus untuk bullwhip effect, hubungan dengan mitra pasokan, dan pilihan antara distribusi berlapis dan langsung.",
    sections: [
      { heading: "Pasar yang Tersebar",
        body: `<p>Sebagian besar penjualan barang konsumsi bergerak cepat di Indonesia masih melewati ritel
tradisional berupa warung dan toko kelontong yang jumlahnya mencapai jutaan titik. Setiap titik memesan dalam
jumlah kecil, tidak memiliki sistem pencatatan persediaan, dan memutuskan pembelian berdasarkan uang tunai yang
tersedia hari itu.</p>
<p>Untuk menjangkaunya, perusahaan mengandalkan jaringan distributor dan sub-distributor berlapis. Model ini
memiliki jangkauan luar biasa, tetapi menciptakan jarak informasi. Perusahaan tidak melihat penjualan sebenarnya di
warung, melainkan hanya melihat pesanan dari distributor.</p>
<p>Akibatnya klasik. Ketika permintaan konsumen naik sedikit, distributor menambah pesanan lebih banyak untuk
mengamankan diri, dan pabrik menambah produksi lebih banyak lagi. Ketika permintaan turun, seluruh rantai berhenti
memesan sampai persediaannya habis. Fluktuasi membesar semakin ke hulu.</p>` },
      { heading: "Tekanan Baru dari Dua Arah",
        body: `<p>Dua perkembangan mengubah persoalan. Pertama, muncul penyedia distribusi digital yang menawarkan
aplikasi pemesanan langsung kepada pemilik warung, lengkap dengan pengiriman cepat dan pembayaran bertahap. Mereka
memangkas satu lapis dalam rantai dan mengumpulkan data penjualan tingkat warung yang selama ini tidak pernah
dimiliki produsen.</p>
<p>Kedua, biaya logistik naik. Pengiriman dalam jumlah kecil ke titik yang tersebar adalah bentuk distribusi
termahal per unit, dan kenaikan harga bahan bakar memperbesar tekanan itu.</p>
<p>Perusahaan menghadapi pilihan yang tidak nyaman: mempertahankan jaringan distributor yang telah menjadi mitra
puluhan tahun, atau bergeser ke model yang memberi visibilitas data tetapi mengganggu hubungan lama.</p>` },
      { heading: "Tiga Model yang Dipertimbangkan",
        body: `<p>Model pertama mempertahankan struktur berlapis dan memperbaikinya lewat berbagi data: distributor
diminta melaporkan penjualan ke tingkat warung dengan imbalan insentif. Model kedua bermitra dengan penyedia
distribusi digital untuk sebagian wilayah, menerima kehilangan sebagian marjin demi visibilitas. Model ketiga
membangun kemampuan distribusi langsung sendiri di kota besar dan mempertahankan distributor di wilayah lain.</p>
<p>Ketiganya menyangkut lebih dari sekadar biaya per pengiriman. Yang dipertaruhkan adalah siapa yang memiliki
hubungan dengan pemilik warung dan siapa yang memiliki datanya.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Gejala Bullwhip pada Satu Produk (indikatif)",
        note: "Simpangan permintaan relatif terhadap rata-rata, disusun untuk latihan.",
        rows: [["Titik dalam rantai", "Fluktuasi pesanan"],
               ["Penjualan di warung", "±8%"],
               ["Pesanan sub-distributor", "±19%"],
               ["Pesanan distributor", "±34%"],
               ["Rencana produksi pabrik", "±52%"]] },
      { title: "Exhibit 2: Perbandingan Tiga Model Distribusi",
        note: "Bahan pembanding untuk diskusi kelas.",
        rows: [["Aspek", "Berlapis dengan berbagi data", "Kemitraan digital", "Distribusi langsung sendiri"],
               ["Jangkauan titik penjualan", "Sangat luas", "Terbatas kota besar", "Terbatas kota besar"],
               ["Visibilitas penjualan akhir", "Menengah", "Tinggi", "Tinggi"],
               ["Biaya per pengiriman", "Rendah", "Menengah", "Tinggi"],
               ["Risiko hubungan mitra lama", "Rendah", "Menengah", "Tinggi"]] }
    ],
    questions: [
      "Jelaskan mekanisme yang menghasilkan pola pada Exhibit 1. Faktor apa saja dalam struktur distribusi ini yang memperbesar fluktuasi?",
      "Berbagi data disebut sebagai obat utama bullwhip effect. Mengapa dalam praktik distributor sering enggan membagikannya?",
      "Bandingkan ketiga model pada Exhibit 2 memakai performance objectives. Objective mana yang dikorbankan oleh masing-masing?",
      "Penyedia distribusi digital memiliki data penjualan tingkat warung. Mengapa kepemilikan data itu dapat menjadi sumber keunggulan kompetitif jangka panjang?",
      "Ambil posisi sebagai direktur rantai pasok dan tentukan model yang Anda pilih beserta tahapan transisinya."
    ],
    guide: {
      problem: "Nyatakan masalahnya sebagai kesenjangan informasi antara penjualan sebenarnya di titik akhir dan keputusan produksi di hulu.",
      alternatives: "Juduli ketiga model dan sebutkan investasi, mitra, serta perubahan organisasi yang dituntut masing-masing.",
      issues: "Bahas trade-off biaya distribusi, visibilitas data, risiko hubungan mitra, dan kecepatan respons terhadap perubahan permintaan.",
      conclusion: "Pilih satu model atau kombinasi bertahap, sebutkan wilayah percontohan, dan tetapkan ukuran keberhasilannya."
    }
  },
  {
    id: "otm9-astra",
    title: "Kaizen di Lantai Perakitan Komponen",
    subtitle: "Ketika perbaikan kecil yang tak berhenti harus bertemu tuntutan pelanggan yang berubah cepat",
    forSession: 9,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 15 dan 16; Heizer, Render & Munson Bab 16",
    decisionMaker: "Manajer Pabrik sebuah produsen komponen otomotif di Jawa Barat",
    decisionPoint: "Menentukan apakah sistem lean yang sudah matang perlu ditambah kemampuan agile untuk melayani pesanan kendaraan listrik",
    relevance: "Kasus untuk perbaikan berkelanjutan, lean, dan perbedaan antara operasi lean dan operasi agile.",
    sections: [
      { heading: "Pabrik yang Sudah Rapi",
        body: `<p>Pabrik ini memasok komponen kepada beberapa perakit kendaraan di Indonesia. Selama lima belas tahun
terakhir ia menerapkan sistem produksi bergaya Jepang: papan kanban mengatur aliran material, penataan 5S dijalankan
setiap giliran kerja, dan setiap operator berhak menghentikan lini bila menemukan cacat. Usulan perbaikan dari
lantai produksi dikumpulkan setiap bulan, dan sebagian besar di antaranya adalah perbaikan kecil yang tidak menarik
perhatian dari luar tetapi secara kumulatif memangkas waktu siklus.</p>
<p>Hasilnya terlihat pada angka. Tingkat cacat sangat rendah, persediaan barang dalam proses tipis, dan pengiriman
tepat waktu mendekati sempurna. Pabrik ini beberapa kali menerima penghargaan dari pelanggannya.</p>
<p>Sistem itu dibangun untuk dunia yang stabil: model kendaraan berumur panjang, volume besar, dan perubahan
spesifikasi yang jarang.</p>` },
      { heading: "Pesanan yang Tidak Cocok dengan Sistem",
        body: `<p>Perubahan datang dari pelanggan baru. Sebuah perakit kendaraan listrik meminta komponen dengan
spesifikasi yang belum pernah dibuat, volume awal jauh lebih kecil, dan permintaan perubahan desain yang mungkin
terjadi beberapa kali dalam setahun pertama. Mereka juga meminta waktu tanggap yang jauh lebih pendek untuk
prototipe.</p>
<p>Sistem lean yang matang justru membuat permintaan itu terasa mengganggu. Aliran yang telah diseimbangkan dengan
cermat terganggu oleh pekerjaan bervolume kecil. Standar kerja yang menjadi tulang punggung konsistensi harus
ditulis ulang setiap kali desain berubah. Sebagian penyelia memandang pesanan ini sebagai gangguan terhadap kinerja
yang selama ini mereka jaga.</p>
<p>Sementara itu manajemen melihat bahwa segmen kendaraan listrik adalah arah masa depan industri, dan menolak
pesanan ini berarti menyerahkan pembelajaran kepada pesaing.</p>` },
      { heading: "Lean, Agile, atau Keduanya",
        body: `<p>Buku teks membedakan dua pendekatan. Operasi <em>lean</em> unggul pada permintaan yang dapat
diprediksi dengan variasi rendah, dan mengejar penghapusan pemborosan. Operasi <em>agile</em> unggul pada permintaan
yang sulit diprediksi dengan variasi tinggi, dan mengejar kemampuan merespons cepat, yang sering menuntut kelonggaran
kapasitas yang dalam kacamata lean tampak sebagai pemborosan.</p>
<p>Tiga usulan muncul. Pertama, menolak pesanan bervolume kecil dan tetap fokus pada keunggulan lean. Kedua,
membangun sel produksi terpisah yang dirancang untuk pekerjaan bervariasi tinggi, dengan aturan kerja sendiri.
Ketiga, melonggarkan sistem yang ada agar seluruh pabrik lebih fleksibel.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Karakter Dua Jenis Pesanan",
        note: "Perbandingan disusun untuk membantu memilih pendekatan operasi.",
        rows: [["Karakter", "Pelanggan lama", "Pelanggan kendaraan listrik"],
               ["Volume per bulan", "Besar dan stabil", "Kecil dan berubah"],
               ["Frekuensi perubahan desain", "Jarang", "Sering"],
               ["Waktu tanggap prototipe diminta", "Panjang", "Sangat pendek"],
               ["Toleransi harga", "Ketat", "Lebih longgar"],
               ["Pendekatan yang cocok", "Lean", "Agile"]] },
      { title: "Exhibit 2: Konsekuensi Tiga Usulan",
        note: "Bahan pembanding untuk bagian Issues.",
        rows: [["Usulan", "Dampak pada kinerja lean", "Dampak pada pembelajaran baru"],
               ["Tolak pesanan kecil", "Terjaga", "Hilang"],
               ["Bangun sel terpisah", "Sebagian besar terjaga", "Terbangun pada lingkup terbatas"],
               ["Longgarkan seluruh pabrik", "Menurun", "Menyebar ke seluruh organisasi"]] }
    ],
    questions: [
      "Jelaskan perbedaan mendasar antara operasi lean dan operasi agile, lalu tunjukkan mengapa Exhibit 1 menuntut keduanya sekaligus.",
      "Mengapa kelonggaran kapasitas yang dibutuhkan operasi agile sering ditolak oleh organisasi yang matang menerapkan lean?",
      "Evaluasi ketiga usulan pada Exhibit 2. Mana yang paling menjaga keunggulan yang sudah dimiliki tanpa menutup pintu pembelajaran?",
      "Budaya kaizen mengandalkan standar kerja yang stabil. Bagaimana budaya itu dipertahankan ketika desain sering berubah?",
      "Ambil posisi sebagai manajer pabrik dan jelaskan bagaimana Anda akan menyampaikan keputusan itu kepada penyelia yang menolak."
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai ketidakcocokan antara sistem operasi yang dioptimalkan untuk stabilitas dan permintaan baru yang menuntut kelincahan.",
      alternatives: "Juduli ketiga usulan dan sebutkan konsekuensi organisasinya, bukan hanya konsekuensi teknisnya.",
      issues: "Bahas trade-off efisiensi versus fleksibilitas, risiko kehilangan pembelajaran segmen baru, dan resistensi internal.",
      conclusion: "Ambil posisi, tetapkan batas lingkup yang jelas, dan sebutkan ukuran yang berbeda untuk dua jenis pekerjaan tersebut."
    }
  },

  {
    id: "otm10-rs",
    title: "Rumah Sakit dan Ukuran Kualitas yang Sulit Disepakati",
    subtitle: "Ketika kualitas klinis, kepuasan pasien, dan efisiensi biaya menunjuk arah yang berbeda",
    forSession: 10,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 17; Heizer, Render & Munson Bab 6",
    decisionMaker: "Direktur Mutu sebuah rumah sakit swasta menengah",
    decisionPoint: "Menetapkan sistem pengukuran mutu yang dipakai untuk menilai kinerja unit dan dokter",
    relevance: "Kasus untuk definisi kualitas, biaya kualitas, dan pengukuran mutu pada jasa yang sebagian besar penilaiannya subjektif.",
    sections: [
      { heading: "Tiga Definisi Kualitas dalam Satu Gedung",
        body: `<p>Di rumah sakit ini, kata kualitas berarti hal yang berbeda bagi tiga kelompok. Bagi dokter,
kualitas berarti ketepatan diagnosis dan hasil klinis. Bagi pasien dan keluarganya, kualitas berarti waktu tunggu
yang wajar, komunikasi yang jelas, dan perlakuan yang menghormati. Bagi manajemen dan penjamin biaya, kualitas
berarti pelayanan yang sesuai standar tanpa pemeriksaan berlebihan.</p>
<p>Ketiganya sah dan ketiganya dapat diukur, tetapi ukurannya tidak selalu bergerak searah. Mempercepat waktu
tunggu dapat menekan durasi konsultasi. Menambah pemeriksaan penunjang dapat menurunkan risiko kesalahan diagnosis
sekaligus menaikkan biaya yang ditanggung penjamin.</p>
<p>Program akreditasi mewajibkan pengukuran indikator mutu tertentu, sehingga rumah sakit sudah memiliki banyak
angka. Persoalannya angka-angka itu belum dipakai untuk mengambil keputusan.</p>` },
      { heading: "Biaya Kualitas yang Tidak Terlihat",
        body: `<p>Kerangka biaya kualitas membagi pengeluaran menjadi empat kelompok: pencegahan, penilaian,
kegagalan internal, dan kegagalan eksternal. Di rumah sakit, biaya pencegahan berbentuk pelatihan, protokol
keselamatan, dan verifikasi obat. Biaya penilaian berbentuk audit rekam medis dan ronde mutu. Kegagalan internal
berbentuk pemeriksaan ulang, perpanjangan hari rawat, dan pengulangan tindakan. Kegagalan eksternal berbentuk
komplikasi setelah pasien pulang, keluhan, dan tuntutan hukum.</p>
<p>Yang menyulitkan, biaya pencegahan muncul jelas pada anggaran, sementara biaya kegagalan tersebar dan sering
tidak tercatat sebagai biaya mutu. Akibatnya, ketika anggaran diketatkan, pos yang paling mudah dipotong justru
pelatihan dan audit.</p>` },
      { heading: "Usulan Sistem Pengukuran",
        body: `<p>Direktur mutu mengusulkan seperangkat indikator berimbang yang mencakup ketiga sudut pandang,
dengan hasil dipublikasikan antar-unit setiap bulan. Sebagian dokter menolak, dengan alasan angka hasil klinis
sangat dipengaruhi tingkat keparahan pasien yang mereka tangani, sehingga perbandingan antar-dokter berpotensi
menyesatkan dan mendorong penolakan terhadap pasien berisiko tinggi.</p>
<p>Manajemen keuangan mengusulkan agar indikator efisiensi diberi bobot lebih besar, sementara komite keselamatan
pasien meminta indikator kegagalan eksternal menjadi penentu utama.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Kandidat Indikator Mutu",
        note: "Kelompokkan indikator ini sebelum memilih yang dipakai untuk penilaian kinerja.",
        rows: [["Indikator", "Sudut pandang", "Kemudahan pengukuran"],
               ["Angka infeksi daerah operasi", "Klinis", "Sedang"],
               ["Waktu tunggu rawat jalan", "Pasien", "Mudah"],
               ["Kepatuhan protokol keselamatan", "Klinis dan sistem", "Sedang"],
               ["Skor pengalaman pasien", "Pasien", "Mudah"],
               ["Rata-rata hari rawat", "Efisiensi", "Mudah"],
               ["Angka pasien kembali dirawat dalam 30 hari", "Klinis dan efisiensi", "Sedang"]] },
      { title: "Exhibit 2: Struktur Biaya Kualitas (indikatif)",
        note: "Proporsi disusun untuk latihan analisis, bukan data rumah sakit tertentu.",
        rows: [["Kelompok biaya", "Porsi perkiraan", "Kemudahan terlihat di anggaran"],
               ["Pencegahan", "±12%", "Sangat terlihat"],
               ["Penilaian", "±18%", "Terlihat"],
               ["Kegagalan internal", "±42%", "Tersebar"],
               ["Kegagalan eksternal", "±28%", "Hampir tidak terlihat"]] }
    ],
    questions: [
      "Pilih empat indikator dari Exhibit 1 untuk dipakai menilai kinerja unit. Pertahankan pilihan Anda dan jelaskan perilaku apa yang akan didorong oleh pilihan tersebut.",
      "Exhibit 2 menunjukkan biaya kegagalan jauh lebih besar daripada biaya pencegahan, tetapi lebih sulit terlihat. Apa konsekuensinya bagi keputusan anggaran?",
      "Dokter menolak perbandingan antar-dokter karena perbedaan tingkat keparahan pasien. Apakah keberatan itu valid, dan bagaimana sistem pengukuran dapat menanganinya?",
      "Mengapa konsep zero defects yang lazim di manufaktur sulit diterjemahkan ke layanan kesehatan? Apa padanannya yang realistis?",
      "Rancang satu perubahan proses yang menurut Anda paling menurunkan biaya kegagalan internal, dan jelaskan cara mengukur keberhasilannya."
    ],
    guide: {
      problem: "Nyatakan masalahnya sebagai ketiadaan sistem pengukuran mutu yang disepakati bersama oleh tiga kelompok pemangku kepentingan.",
      alternatives: "Juduli alternatif rancangan pengukuran, misalnya berbasis hasil klinis, berbasis pengalaman pasien, atau berimbang dengan penyesuaian risiko.",
      issues: "Bahas risiko perilaku yang tidak diinginkan dari setiap sistem pengukuran, termasuk penghindaran pasien berisiko tinggi.",
      conclusion: "Tetapkan seperangkat indikator, cara penyesuaian risiko yang dipakai, dan aturan penggunaan hasilnya untuk perbaikan, bukan sekadar penilaian."
    }
  },

  {
    id: "otm11-pln",
    title: "Ketika Listrik Padam di Jawa dan Bali",
    subtitle: "Keandalan, redundansi, dan biaya dari sistem yang tidak boleh gagal",
    forSession: 11,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Slack, Brandon-Jones & Burgess Bab 19; Heizer, Render & Munson Suplemen Bab 17",
    decisionMaker: "Direktur Operasi Sistem sebuah perusahaan penyedia tenaga listrik",
    decisionPoint: "Menentukan tingkat redundansi jaringan yang dibiayai setelah kejadian padam berskala luas",
    relevance: "Kasus untuk reliability, redundansi, failure mode analysis, dan resilience pada infrastruktur kritis.",
    sections: [
      { heading: "Satu Gangguan, Jutaan Pelanggan",
        body: `<p>Pada Agustus 2019, gangguan pada jaringan transmisi mengakibatkan padamnya aliran listrik di
sebagian besar Jawa bagian barat, termasuk Jakarta, selama beberapa jam hingga lebih dari sehari di sejumlah
wilayah. Transportasi berbasis rel terhenti, jaringan telekomunikasi terganggu, dan layanan publik terhambat.
Kejadian itu memperlihatkan sifat sistem yang saling terhubung: kegagalan pada satu simpul merambat ke seluruh
sistem.</p>
<p>Dalam bahasa manajemen operasi, ini adalah kegagalan sistem dengan komponen seri. Ketika komponen tersusun seri,
keandalan sistem adalah hasil kali keandalan setiap komponen, sehingga sistem yang tersusun dari banyak komponen
andal sekalipun dapat memiliki keandalan keseluruhan yang mengecewakan.</p>
<p>Cara memperbaikinya ada dua: menaikkan keandalan tiap komponen, atau menambahkan redundansi sehingga kegagalan
satu komponen tidak menjatuhkan sistem. Keduanya mahal.</p>` },
      { heading: "Menghitung Nilai dari Sesuatu yang Tidak Terjadi",
        body: `<p>Kesulitan mendasar dalam investasi keandalan adalah bahwa manfaatnya berbentuk kejadian yang
tidak terjadi. Anggaran redundansi bersaing dengan anggaran perluasan jaringan ke wilayah yang belum terlistriki,
yang manfaatnya terlihat langsung dan dapat diresmikan.</p>
<p>Untuk membuat perbandingannya masuk akal, biaya padam perlu diperkirakan. Perkiraan itu mencakup kerugian
produksi industri, kerugian usaha kecil, biaya bahan bakar genset, dan biaya sosial yang lebih sulit diukur seperti
gangguan layanan kesehatan.</p>
<p>Analisis mode kegagalan membantu memfokuskan belanja. Dengan memetakan cara sistem dapat gagal, seberapa sering,
dan seberapa besar akibatnya, sumber daya dapat diarahkan ke titik yang paling menentukan, bukan disebar merata.</p>` },
      { heading: "Pilihan Investasi",
        body: `<p>Tiga usulan diajukan. Pertama, menggandakan jalur transmisi pada koridor paling kritis. Kedua,
memperbaiki program pemeliharaan preventif dan pemantauan kondisi peralatan secara menyeluruh. Ketiga, membangun
kemampuan pemulihan cepat berupa peralatan cadangan bergerak dan latihan pemulihan berkala, dengan menerima bahwa
gangguan tetap akan terjadi.</p>
<p>Usulan ketiga mencerminkan pergeseran cara berpikir dari mencegah kegagalan menuju membatasi dampaknya, yang
merupakan inti konsep resilience.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Keandalan Sistem Seri dan Paralel",
        note: "Gunakan untuk berlatih menghitung dampak redundansi.",
        rows: [["Konfigurasi", "Keandalan komponen", "Keandalan sistem"],
               ["Tiga komponen seri", "0,98 masing-masing", "0,98³ = 0,941"],
               ["Lima komponen seri", "0,98 masing-masing", "0,98⁵ = 0,904"],
               ["Dua komponen paralel", "0,98 masing-masing", "1 − (0,02)² = 0,9996"],
               ["Tiga seri, tiap tahap digandakan", "0,98 masing-masing", "0,9996³ = 0,9988"]] },
      { title: "Exhibit 2: Perbandingan Tiga Usulan",
        note: "Kolom biaya bersifat relatif, disusun untuk latihan.",
        rows: [["Usulan", "Biaya relatif", "Waktu penerapan", "Sasaran utama"],
               ["Redundansi jalur kritis", "Tinggi", "Panjang", "Mencegah kegagalan sistem"],
               ["Pemeliharaan preventif menyeluruh", "Menengah", "Menengah", "Menurunkan frekuensi kegagalan"],
               ["Kemampuan pemulihan cepat", "Rendah", "Pendek", "Memperpendek durasi dampak"]] }
    ],
    questions: [
      "Dengan Exhibit 1, jelaskan mengapa menambah komponen pada rangkaian seri menurunkan keandalan sistem meskipun tiap komponen andal.",
      "Manfaat investasi keandalan berbentuk kejadian yang tidak terjadi. Bagaimana Anda menyusun argumen anggaran yang meyakinkan untuk investasi semacam itu?",
      "Bandingkan pendekatan mencegah kegagalan dan pendekatan membatasi dampak. Dalam kondisi apa pendekatan kedua lebih rasional?",
      "Gunakan logika analisis mode kegagalan untuk menentukan urutan prioritas ketiga usulan pada Exhibit 2.",
      "Sistem yang saling terhubung membuat kegagalan merambat. Pelajaran apa dari kasus ini yang berlaku bagi rantai pasok perusahaan pada umumnya?"
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai alokasi anggaran terbatas di antara pencegahan, pengurangan frekuensi, dan pemulihan.",
      alternatives: "Juduli ketiga usulan dan sebutkan waktu penerapan serta komitmen biaya masing-masing.",
      issues: "Bahas ketidakpastian perkiraan biaya padam, persaingan anggaran dengan perluasan jaringan, dan batas kemampuan organisasi menjalankan ketiganya sekaligus.",
      conclusion: "Tetapkan bauran investasi beserta urutan waktunya, dan sebutkan indikator keandalan yang akan dipantau."
    }
  }
  ];
  C.cases = (C.cases || []).concat(cases).sort((a, b) => a.forSession - b.forSession);
})();
