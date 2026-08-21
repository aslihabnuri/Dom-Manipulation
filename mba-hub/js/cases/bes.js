/* ============================================================
   Studi Kasus BES (MAN 5522): satu teaching case per bab.
   Format Harvard: narasi tanpa kesimpulan, exhibit, pertanyaan
   diskusi, dan panduan analisis lima langkah etika bisnis.
   Angka pada exhibit bersifat indikatif untuk latihan analisis.
   ============================================================ */
(function () {
  const C = window.MBA_COURSES.bes;
  const cases = [,
  {
    id: "bes1-sirop",
    title: "Obat Sirop dan Gagal Ginjal Akut pada Anak",
    subtitle: "Ketika cemaran pada bahan baku menjadi pertanyaan tentang siapa yang bertanggung jawab",
    forSession: 1,
    badge: "⭐ Kasus yang disebut dosen di kelas",
    readingTime: 7,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 1; siaran pers Kementerian Kesehatan dan BPOM, Oktober 2022",
    decisionMaker: "Direksi sebuah perusahaan farmasi nasional dan regulator obat",
    decisionPoint: "Menentukan tanggung jawab atas cemaran yang masuk lewat pemasok bahan baku",
    relevance: "Kasus pembuka yang memperlihatkan tiga level analisis etika bisnis: sistemik, korporasi, dan individu.",
    sections: [
      { heading: "Kronologi Singkat",
        body: `<p>Sepanjang paruh kedua 2022, rumah sakit di berbagai provinsi melaporkan lonjakan kasus gangguan
ginjal akut pada anak. Pada pertengahan Oktober 2022, Kementerian Kesehatan melaporkan ratusan kasus yang tersebar
di puluhan provinsi dengan angka kematian yang tinggi. Penelusuran mengarah pada cemaran etilen glikol dan
dietilen glikol pada sejumlah obat sirop.</p>
<p>Pemerintah menghentikan sementara peresepan dan penjualan obat sirop, sebuah keputusan yang berdampak luas pada
pasien yang membutuhkan sediaan cair. BPOM kemudian mencabut izin edar sejumlah produk dan mengumumkan sanksi
terhadap beberapa produsen, sementara kepolisian membuka penyidikan terhadap rantai pemasok bahan baku pelarut.</p>
<p>Dari pemberitaan yang berkembang muncul gambaran rantai yang panjang: pelarut yang seharusnya berkualitas
farmasi diduga digantikan atau tercampur bahan kualitas industri yang jauh lebih murah, melewati beberapa lapis
pedagang bahan kimia sebelum sampai ke produsen obat.</p>` },
      { heading: "Pertanyaan yang Tidak Nyaman",
        body: `<p>Produsen obat berargumen bahwa mereka membeli bahan dengan sertifikat analisis dari pemasok
terdaftar, dan bahwa pengujian ulang setiap batch untuk cemaran spesifik tersebut bukan praktik yang lazim
diwajibkan pada saat itu. Pemasok bahan menunjuk pedagang di lapis sebelumnya. Regulator menghadapi pertanyaan
mengapa pengawasan bahan baku tidak menangkap persoalan itu lebih awal.</p>
<p>Setiap pihak memiliki argumen yang secara hukum dapat dipertahankan sampai batas tertentu. Namun keluarga yang
kehilangan anak tidak berhadapan dengan rantai tanggung jawab, melainkan dengan sebotol obat yang mereka beli di
apotek dengan itikad baik.</p>
<p>Di sinilah ungkapan yang dipakai dosen di kelas menjadi relevan: <em>business ethics begins where the law ends</em>.
Pertanyaannya bukan hanya apakah perusahaan melanggar aturan yang berlaku saat itu, melainkan apakah kepatuhan pada
aturan minimum sudah cukup untuk produk yang dikonsumsi anak-anak.</p>` },
      { heading: "Tiga Level Analisis",
        body: `<p>Pada level <strong>sistemik</strong>, pertanyaannya menyangkut rancangan sistem pengawasan obat,
insentif harga yang mendorong pencarian bahan termurah, dan lemahnya penelusuran rantai pemasok bahan kimia.
Pada level <strong>korporasi</strong>, pertanyaannya menyangkut kebijakan pengujian bahan baku, keputusan pemilihan
pemasok, dan kecepatan penarikan produk setelah kecurigaan muncul. Pada level <strong>individu</strong>, terdapat
pertanyaan tentang keputusan orang-orang tertentu yang menandatangani penerimaan bahan atau mengabaikan
kejanggalan.</p>
<p>Ketiga level itu tidak saling menggantikan. Menjelaskan peristiwa ini semata sebagai kegagalan individu akan
melewatkan persoalan sistem; menjelaskannya semata sebagai kegagalan sistem akan menghapus tanggung jawab yang
nyata dari pengambil keputusan.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Rantai Tanggung Jawab yang Diperdebatkan",
        note: "Susun argumen tiap pihak sebelum menentukan posisi Anda.",
        rows: [["Pihak", "Argumen pembelaan", "Pertanyaan etis yang tersisa"],
               ["Produsen obat", "Membeli dengan sertifikat analisis dari pemasok terdaftar", "Apakah verifikasi minimum cukup untuk produk anak?"],
               ["Pemasok bahan", "Meneruskan barang dari pedagang sebelumnya", "Apakah penelusuran asal bahan menjadi kewajibannya?"],
               ["Regulator", "Menindak setelah kasus terdeteksi", "Mengapa pengawasan hulu tidak menangkap lebih awal?"],
               ["Apotek dan tenaga kesehatan", "Menjual produk berizin edar", "Adakah kewajiban kehati-hatian tambahan?"]] },
      { title: "Exhibit 2: Perbandingan Respons Perusahaan pada Krisis Produk",
        note: "Pembanding klasik untuk menilai kecepatan dan sikap penanganan.",
        rows: [["Aspek", "Penarikan proaktif (contoh klasik industri global)", "Penanganan reaktif"],
               ["Pemicu tindakan", "Kecurigaan internal", "Perintah regulator"],
               ["Kecepatan", "Hari", "Minggu atau lebih"],
               ["Cakupan penarikan", "Seluruh batch terkait", "Terbatas yang dipersoalkan"],
               ["Dampak jangka panjang pada kepercayaan", "Pulih relatif cepat", "Menurun berkepanjangan"]] }
    ],
    questions: [
      "Petakan pemangku kepentingan kasus ini menjadi primer dan sekunder, lalu tunjukkan di mana klaim mereka saling bertabrakan.",
      "Apakah kepatuhan pada aturan yang berlaku saat itu cukup untuk membebaskan produsen dari tanggung jawab etis? Gunakan ungkapan bahwa etika bisnis dimulai ketika hukum berakhir sebagai pijakan.",
      "Analisis kasus ini pada tiga level: sistemik, korporasi, dan individu. Level mana yang menurut Anda paling menentukan, dan mengapa?",
      "Dengan Exhibit 2 sebagai pembanding, rancang respons yang seharusnya diambil produsen pada minggu pertama setelah kecurigaan muncul.",
      "Perubahan kebijakan apa yang Anda usulkan agar peristiwa serupa tidak berulang, dan pada level mana perubahan itu bekerja?"
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai pertanyaan benar dan salah, bukan sekadar masalah bisnis, misalnya sejauh mana kewajiban kehati-hatian produsen menjangkau ke hulu rantai pasok.",
      alternatives: "Sebutkan pilihan tindakan yang tersedia bagi produsen dan bagi regulator, lengkap dengan sumber daya yang dituntut, tanpa argumen pro dan kontra.",
      issues: "Terapkan lebih dari satu lensa: konsekuensi bagi korban dan pasien lain, hak konsumen atas keamanan produk, dan keadilan dalam membagi beban tanggung jawab.",
      conclusion: "Ambil posisi tentang siapa menanggung apa, sebutkan alasannya, dan tunjukkan alternatif yang Anda tolak beserta alasan penolakannya."
    }
  },

  {
    id: "bes2-sachet",
    title: "Sachet Kecil, Persoalan Besar",
    subtitle: "Model bisnis yang membuat produk terjangkau bagi jutaan orang sekaligus menghasilkan sampah yang tidak dapat didaur ulang",
    forSession: 2,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 2 tentang CSR, corporate citizenship, dan accountability",
    decisionMaker: "Direktur Keberlanjutan sebuah perusahaan barang konsumsi multinasional di Indonesia",
    decisionPoint: "Menentukan sejauh mana perusahaan bertanggung jawab atas sampah kemasan setelah produk dikonsumsi",
    relevance: "Kasus untuk menguji piramida Carroll, pandangan shareholder versus stakeholder, dan gagasan corporate citizenship.",
    sections: [
      { heading: "Inovasi yang Membuka Pasar",
        body: `<p>Kemasan sachet adalah salah satu inovasi pemasaran paling berhasil di pasar berkembang. Dengan
membagi sampo, kopi, atau deterjen ke dalam kemasan sekali pakai seharga beberapa ratus rupiah, perusahaan barang
konsumsi membuka akses bagi konsumen berpenghasilan harian yang tidak mampu membeli kemasan besar.</p>
<p>Dari sudut pandang kesejahteraan, dampaknya nyata. Produk kebersihan menjadi terjangkau, dan warung kecil
memiliki barang dagangan dengan perputaran cepat dan modal rendah.</p>
<p>Dari sudut pandang lingkungan, sachet adalah persoalan yang berat. Kemasannya berlapis banyak bahan yang
menyatu, sehingga secara ekonomi hampir tidak layak didaur ulang. Nilainya bagi pemulung mendekati nol, sehingga
ia tidak terangkut oleh sistem daur ulang informal yang selama ini menangani botol dan kardus.</p>` },
      { heading: "Klaim yang Saling Berhadapan",
        body: `<p>Perusahaan menyatakan telah menjalankan program pengumpulan kemasan, mendanai bank sampah, dan
menetapkan target kemasan yang dapat didaur ulang pada tahun tertentu. Kritikus menilai program semacam itu kecil
dibanding volume yang diproduksi setiap hari, dan menyebutnya sebagai pengalihan tanggung jawab kepada konsumen dan
pemerintah daerah.</p>
<p>Pemerintah daerah menanggung biaya pengangkutan dan pengelolaan sampah yang sebagian besar berasal dari kemasan
produk yang dijual perusahaan. Dalam bahasa ekonomi, sebagian biaya produksi dialihkan menjadi biaya publik.</p>
<p>Di sisi lain, menghentikan sachet berarti menutup akses bagi konsumen berpenghasilan rendah, dan pesaing yang
tetap menjual sachet akan mengambil pangsa pasar itu. Perusahaan yang bertindak sendirian menanggung biaya penuh
tanpa menyelesaikan persoalan.</p>` },
      { heading: "Pilihan yang Tersedia",
        body: `<p>Manajemen mempertimbangkan empat langkah. Pertama, memperbesar program pengumpulan dengan target
yang diaudit pihak ketiga. Kedua, mengubah struktur kemasan menjadi bahan tunggal yang dapat didaur ulang, dengan
biaya lebih tinggi dan risiko umur simpan lebih pendek. Ketiga, mengembangkan model isi ulang di titik penjualan
untuk kota besar. Keempat, mendorong regulasi tanggung jawab produsen yang berlaku untuk seluruh industri sehingga
biayanya ditanggung bersama.</p>
<p>Langkah keempat menarik karena mengubah aturan main bagi semua pemain, tetapi berarti perusahaan meminta
pemerintah membebaninya sendiri dan pesaingnya.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Piramida CSR Carroll pada Kasus Ini",
        note: "Isi kolom kanan sebagai latihan sebelum diskusi kelas.",
        rows: [["Lapis", "Isi menurut Carroll", "Wujudnya pada kasus sachet"],
               ["Economic", "Menghasilkan laba", "Model sachet menopang volume dan pangsa pasar"],
               ["Legal", "Mematuhi hukum", "Memenuhi aturan kemasan yang berlaku saat ini"],
               ["Ethical", "Melakukan yang benar meski tidak diwajibkan", "Menanggung biaya pengelolaan sampah kemasannya"],
               ["Philanthropic", "Berkontribusi pada masyarakat", "Mendanai bank sampah dan edukasi"]] },
      { title: "Exhibit 2: Perbandingan Empat Langkah",
        note: "Kolom biaya dan dampak bersifat relatif untuk latihan analisis.",
        rows: [["Langkah", "Biaya bagi perusahaan", "Dampak pada persoalan", "Risiko kompetitif"],
               ["Perbesar pengumpulan", "Menengah", "Terbatas", "Rendah"],
               ["Ubah struktur kemasan", "Tinggi", "Besar", "Tinggi bila sendirian"],
               ["Model isi ulang", "Menengah", "Terbatas pada kota besar", "Menengah"],
               ["Dorong regulasi industri", "Rendah di awal", "Besar bila terwujud", "Rendah, berlaku merata"]] }
    ],
    questions: [
      "Gunakan piramida Carroll pada Exhibit 1. Pada lapis mana perusahaan sudah kuat, dan pada lapis mana ia lemah?",
      "Menurut pandangan shareholder ala Friedman, apakah perusahaan wajib menanggung biaya pengelolaan sampah kemasannya? Bagaimana pandangan stakeholder menjawabnya?",
      "Gagasan corporate citizenship menyebut perusahaan kadang mengambil peran yang biasanya dijalankan pemerintah. Apakah kasus ini contoh yang tepat, atau justru contoh pengalihan tanggung jawab?",
      "Bertindak sendirian membuat perusahaan menanggung biaya penuh tanpa menyelesaikan masalah. Apakah itu alasan yang sah secara etis untuk menunda tindakan?",
      "Pilih satu langkah pada Exhibit 2 dan pertahankan pilihan Anda dengan argumen etis, bukan hanya argumen bisnis."
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai pertanyaan tentang batas tanggung jawab produsen atas dampak produk setelah dikonsumsi.",
      alternatives: "Juduli keempat langkah, sebutkan sumber daya dan mitra yang dibutuhkan masing-masing.",
      issues: "Bahas konsekuensi bagi konsumen berpenghasilan rendah, hak masyarakat atas lingkungan yang sehat, keadilan dalam menanggung biaya publik, dan tekanan persaingan.",
      conclusion: "Ambil posisi, tentukan urutan langkah, dan sebutkan komitmen terukur yang bersedia diaudit pihak ketiga."
    }
  },

  {
    id: "bes3-ojol",
    title: "Mitra atau Pekerja: Status Pengemudi Ojek Daring",
    subtitle: "Satu hubungan kerja yang dinilai berbeda oleh empat teori etika",
    forSession: 3,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 3 tentang teori etika normatif",
    decisionMaker: "Manajemen sebuah platform transportasi daring",
    decisionPoint: "Menentukan paket perlindungan dan skema pendapatan bagi pengemudi yang berstatus mitra",
    relevance: "Kasus terbaik untuk membandingkan utilitarianisme, teori hak, teori keadilan, dan etika kepedulian pada satu persoalan yang sama.",
    sections: [
      { heading: "Fleksibilitas dan Harganya",
        body: `<p>Platform transportasi daring mengubah pasar kerja Indonesia dalam waktu singkat. Ratusan ribu orang
memperoleh penghasilan tanpa proses rekrutmen formal, tanpa jam kerja tetap, dan tanpa atasan langsung. Bagi banyak
orang, ini adalah pintu masuk penghasilan yang sebelumnya tertutup.</p>
<p>Hubungan hukum yang dipakai adalah kemitraan, bukan hubungan kerja. Konsekuensinya, ketentuan upah minimum,
jam kerja, cuti, pesangon, dan jaminan sosial ketenagakerjaan tidak berlaku secara otomatis. Pengemudi menanggung
sendiri biaya kendaraan, bahan bakar, perawatan, dan risiko kecelakaan di luar skema asuransi yang disediakan
platform.</p>
<p>Di sisi lain, platform menetapkan tarif, mengatur alokasi pesanan lewat algoritma, memberi peringkat, dan dapat
memutus akses akun. Kendali semacam itu dalam banyak hal menyerupai kendali seorang pemberi kerja.</p>` },
      { heading: "Empat Cara Menilai Situasi yang Sama",
        body: `<p>Pendekatan <strong>utilitarian</strong> menimbang total kesejahteraan. Model kemitraan memungkinkan
jumlah orang yang bekerja jauh lebih banyak karena biaya per pengemudi rendah; mengubahnya menjadi hubungan kerja
penuh dapat menaikkan kesejahteraan sebagian orang sambil mengurangi jumlah yang dapat bekerja.</p>
<p>Pendekatan <strong>hak</strong> berangkat dari martabat manusia dan hak dasar pekerja atas keselamatan,
istirahat, dan penghasilan yang layak. Dari sudut ini, besarnya manfaat agregat tidak membenarkan peniadaan hak
dasar seseorang.</p>
<p>Pendekatan <strong>keadilan</strong> menyoroti pembagian manfaat dan beban. Ketika platform mengendalikan tarif
dan alokasi pesanan sementara pengemudi menanggung seluruh biaya modal dan risiko, distribusi risiko dan imbalannya
patut dipersoalkan.</p>
<p>Pendekatan <strong>etika kepedulian</strong> memusatkan perhatian pada hubungan dan kerentanan konkret: apa yang
terjadi pada keluarga pengemudi yang mengalami kecelakaan, dan siapa yang hadir untuknya.</p>` },
      { heading: "Pilihan Kebijakan",
        body: `<p>Manajemen mempertimbangkan tiga paket. Pertama, mempertahankan status kemitraan dengan menambah
asuransi kecelakaan dan santunan, dibiayai potongan kecil dari setiap perjalanan. Kedua, menciptakan status
menengah dengan jaminan pendapatan minimum per jam aktif dan iuran jaminan sosial bersama. Ketiga, mengubah
sebagian pengemudi paling aktif menjadi pekerja tetap dengan seluruh hak ketenagakerjaan, sementara sisanya tetap
mitra.</p>
<p>Setiap pilihan mengubah struktur biaya, harga bagi konsumen, dan jumlah orang yang dapat bergabung.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Empat Lensa Etika pada Satu Persoalan",
        note: "Isi kolom kesimpulan sebagai latihan sebelum kelas.",
        rows: [["Lensa", "Pertanyaan kunci", "Kecenderungan kesimpulan"],
               ["Utilitarian", "Mana yang memaksimalkan kesejahteraan total?", "Cenderung membela model kemitraan"],
               ["Hak", "Adakah hak dasar yang dilanggar?", "Cenderung menuntut perlindungan minimum"],
               ["Keadilan", "Adilkah pembagian risiko dan imbalan?", "Cenderung menuntut penyeimbangan"],
               ["Kepedulian", "Siapa yang paling rentan dan siapa yang hadir untuknya?", "Cenderung menuntut jaring pengaman"]] },
      { title: "Exhibit 2: Konsekuensi Tiga Paket Kebijakan (indikatif)",
        note: "Arah perubahan disusun untuk latihan, bukan proyeksi perusahaan.",
        rows: [["Ukuran", "Kemitraan plus asuransi", "Status menengah", "Sebagian jadi pekerja tetap"],
               ["Biaya per perjalanan", "Naik sedikit", "Naik menengah", "Naik besar"],
               ["Jumlah pengemudi yang dapat bergabung", "Tetap", "Turun sedikit", "Turun banyak"],
               ["Perlindungan bagi yang aktif penuh waktu", "Terbatas", "Menengah", "Penuh"],
               ["Risiko sengketa hukum status", "Tetap ada", "Berkurang", "Berkurang untuk kelompok itu"]] }
    ],
    questions: [
      "Terapkan keempat lensa pada Exhibit 1 dan tunjukkan di mana kesimpulannya berbeda. Perbedaan itu berasal dari asumsi apa?",
      "Platform menetapkan tarif dan dapat memutus akun. Apakah kendali semacam itu secara etis menciptakan kewajiban yang setara dengan kewajiban pemberi kerja?",
      "Argumen bahwa perlindungan penuh akan mengurangi jumlah orang yang dapat bekerja adalah argumen utilitarian. Bagaimana teori hak menanggapinya?",
      "Pilih satu paket pada Exhibit 2 dan pertahankan pilihan Anda dengan menyebut lensa etika yang Anda utamakan beserta alasannya.",
      "Jika Anda menolak dua paket lainnya, jelaskan secara spesifik alasan penolakan itu."
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai pertanyaan apakah fleksibilitas dapat dibenarkan ketika ia disertai peniadaan perlindungan dasar.",
      alternatives: "Juduli ketiga paket dan sebutkan konsekuensi biaya serta jumlah pengemudi terdampak.",
      issues: "Terapkan minimal tiga lensa etika dan tunjukkan secara eksplisit ketika lensa yang berbeda memberi jawaban berbeda.",
      conclusion: "Ambil posisi, sebutkan alasannya, dan tunjukkan paket yang Anda tolak beserta alasan penolakannya."
    }
  },
  {
    id: "bes4-pengadaan",
    title: "Fee Lima Persen di Pengadaan",
    subtitle: "Ketika praktik yang dianggap biasa berhadapan dengan keputusan seorang manajer baru",
    forSession: 4,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 4 tentang pengambilan keputusan etis dan moral intensity",
    decisionMaker: "Manajer Pengadaan yang baru diangkat di sebuah perusahaan menengah",
    decisionPoint: "Menentukan sikap terhadap praktik pemberian imbalan yang sudah berlangsung lama di departemennya",
    relevance: "Kasus untuk faktor individual dan situasional dalam keputusan etis, rasionalisasi, dan intensitas moral.",
    sections: [
      { heading: "Minggu Pertama",
        body: `<p>Seorang manajer pengadaan yang baru diangkat menemukan pola yang berulang pada dokumen tender.
Beberapa pemasok memenangi hampir seluruh paket dalam tiga tahun terakhir. Harga penawaran mereka tidak selalu
terendah, tetapi selalu memenuhi persyaratan administratif dengan sempurna, sementara penawar lain sering gugur
karena kelengkapan dokumen.</p>
<p>Seorang staf senior menjelaskan secara terbuka bahwa terdapat kebiasaan pemberian imbalan sekitar lima persen
nilai kontrak, yang dibagi di antara beberapa orang yang terlibat proses. Ia menyebutnya sebagai hal yang lazim di
industri, menegaskan bahwa perusahaan tidak dirugikan karena harga tetap wajar, dan bahwa penolakan akan membuat
pekerjaan sehari-hari menjadi sulit.</p>
<p>Manajer baru ini memiliki keluarga yang bergantung pada penghasilannya, sedang menjalani masa percobaan, dan
belum memiliki hubungan baik dengan siapa pun di perusahaan.</p>` },
      { heading: "Cara Sebuah Praktik Menjadi Terasa Wajar",
        body: `<p>Literatur etika bisnis menjelaskan bagaimana praktik yang secara prinsip jelas keliru dapat
terasa wajar bagi pelakunya. Beberapa bentuk rasionalisasi muncul dalam kasus ini. <em>Penyangkalan korban</em>
tampak dalam kalimat bahwa perusahaan tidak dirugikan. <em>Perbandingan sosial</em> tampak dalam argumen bahwa
semua orang di industri melakukannya. <em>Pembagian tanggung jawab</em> tampak dalam kenyataan bahwa imbalan dibagi
banyak orang sehingga tidak seorang pun merasa menjadi pelaku utama.</p>
<p>Kerangka intensitas moral membantu menjelaskan mengapa perbuatan ini terasa ringan. Akibatnya tidak terlihat
langsung, korbannya tidak berwajah, jarak sosialnya jauh, dan kesepakatan sosial di lingkungan kerja justru
mendukung praktiknya. Semua faktor itu menurunkan intensitas moral yang dirasakan, meskipun tidak mengubah
sifat perbuatannya.</p>` },
      { heading: "Pilihan yang Tersedia",
        body: `<p>Manajer baru itu memiliki beberapa pilihan. Ia dapat menolak secara pribadi tanpa melaporkan,
dan menjalankan tender di bawah pengawasannya sendiri secara bersih. Ia dapat melaporkan kepada direksi, dengan
risiko bahwa sebagian direksi mungkin mengetahui praktik ini. Ia dapat mengusulkan perubahan sistem tanpa menuduh
siapa pun, misalnya evaluasi dokumen oleh pihak ketiga dan publikasi hasil tender. Ia juga dapat memilih diam dan
menyesuaikan diri.</p>
<p>Masa percobaannya berakhir dalam dua bulan.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Bentuk Rasionalisasi yang Muncul",
        note: "Kenali bentuknya sebelum menilai keputusan pelakunya.",
        rows: [["Bentuk rasionalisasi", "Kalimat yang terdengar di kasus"],
               ["Penyangkalan korban", "Perusahaan tidak dirugikan, harganya tetap wajar"],
               ["Perbandingan sosial", "Semua perusahaan di industri ini melakukannya"],
               ["Pembagian tanggung jawab", "Imbalan dibagi banyak orang, bukan keputusan satu orang"],
               ["Klaim kesetiaan yang lebih tinggi", "Ini demi kelancaran operasional perusahaan"]] },
      { title: "Exhibit 2: Faktor Intensitas Moral",
        note: "Semakin rendah skornya, semakin ringan perbuatan itu terasa, meskipun sifatnya tidak berubah.",
        rows: [["Faktor", "Kondisi pada kasus ini", "Pengaruh pada intensitas moral"],
               ["Besarnya akibat", "Tersebar dan tidak langsung", "Menurunkan"],
               ["Kesepakatan sosial", "Praktik dianggap lazim", "Menurunkan"],
               ["Kedekatan dengan korban", "Korban tidak berwajah", "Menurunkan"],
               ["Kemungkinan akibat", "Tidak pasti dan jauh", "Menurunkan"]] }
    ],
    questions: [
      "Identifikasi bentuk rasionalisasi pada Exhibit 1 dan jelaskan mengapa masing-masing terdengar meyakinkan bagi pelakunya.",
      "Dengan kerangka intensitas moral pada Exhibit 2, jelaskan mengapa praktik ini bertahan lama tanpa ada yang merasa bersalah.",
      "Empat pilihan tersedia bagi manajer baru. Evaluasi masing-masing dengan mempertimbangkan konsekuensi, hak pihak yang dirugikan, dan keadilan proses tender.",
      "Situasi masa percobaan menekan keputusan individu. Sejauh mana faktor situasional dapat meringankan tanggung jawab moral seseorang?",
      "Rancang satu perubahan sistem yang menurut Anda paling efektif memutus praktik ini, dan jelaskan mengapa perubahan itu bekerja."
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai benturan antara integritas pribadi dan tekanan kelangsungan pekerjaan dalam sistem yang menormalkan praktik keliru.",
      alternatives: "Juduli keempat pilihan tindakan, sebutkan risiko dan pihak yang terdampak untuk masing-masing.",
      issues: "Bahas kerugian yang tersembunyi bagi perusahaan dan pemasok yang jujur, hak atas proses yang adil, serta batas tanggung jawab individu dalam sistem yang rusak.",
      conclusion: "Ambil posisi, tetapkan langkah pertama yang konkret pada minggu pertama, dan sebutkan pilihan yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "bes5-whistleblower",
    title: "Saluran Pelaporan yang Tidak Dipercaya",
    subtitle: "Ketika perusahaan sudah memiliki kode etik, pelatihan, dan sistem pelaporan, tetapi tidak ada yang melapor",
    forSession: 5,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 5 tentang mengelola etika bisnis, kode etik, dan whistleblowing",
    decisionMaker: "Direktur Kepatuhan sebuah lembaga jasa keuangan nasional",
    decisionPoint: "Merancang ulang sistem pelaporan pelanggaran setelah temuan besar berasal dari luar, bukan dari dalam",
    relevance: "Kasus untuk komponen manajemen etika: kode etik, pelatihan, saluran pelaporan, dan budaya organisasi.",
    sections: [
      { heading: "Semua Instrumen Ada, Tidak Ada yang Bekerja",
        body: `<p>Lembaga ini memiliki kode etik setebal puluhan halaman yang ditandatangani seluruh karyawan
setiap tahun. Pelatihan kepatuhan wajib diikuti dengan kuis daring. Terdapat saluran pelaporan pelanggaran dengan
nomor telepon khusus dan alamat surel yang dikelola unit kepatuhan.</p>
<p>Meski demikian, sebuah penyimpangan yang berlangsung dua tahun di salah satu kantor wilayah terungkap bukan
lewat saluran itu, melainkan lewat pemeriksaan otoritas eksternal. Setelah kejadian, wawancara internal
memperlihatkan bahwa cukup banyak karyawan sebenarnya mengetahui atau mencurigai adanya persoalan.</p>
<p>Ketika ditanya mengapa tidak melapor, jawaban mereka berulang. Mereka meragukan kerahasiaan pelapor karena
saluran dikelola unit yang berada di bawah struktur yang sama. Mereka mengingat seorang rekan yang pernah melapor
lalu dipindahkan ke posisi tanpa masa depan. Mereka juga tidak yakin laporan akan ditindaklanjuti karena tidak
pernah ada informasi tentang hasil laporan sebelumnya.</p>` },
      { heading: "Kode Etik sebagai Dokumen atau sebagai Praktik",
        body: `<p>Literatur membedakan antara komponen formal dan komponen informal manajemen etika. Komponen
formal berupa kode, pelatihan, saluran, dan sanksi relatif mudah dibangun dan mudah ditunjukkan kepada regulator.
Komponen informal berupa keteladanan atasan, cerita yang beredar tentang apa yang terjadi pada pelapor, dan
keyakinan bahwa berbicara aman jauh lebih menentukan perilaku sehari-hari.</p>
<p>Dalam kasus ini, komponen formal lengkap sementara komponen informal justru mengirim pesan berlawanan. Sinyal
paling kuat bukan kalimat dalam kode etik, melainkan apa yang terjadi pada orang yang pernah melapor.</p>` },
      { heading: "Usulan Perbaikan",
        body: `<p>Direktur kepatuhan mempertimbangkan beberapa langkah: memindahkan pengelolaan saluran pelaporan
kepada pihak ketiga independen yang melapor langsung ke komite audit dewan komisaris; menerbitkan laporan berkala
berisi jumlah laporan yang diterima, ditindaklanjuti, dan hasilnya tanpa membuka identitas; menetapkan kebijakan
anti-pembalasan dengan konsekuensi tegas; serta memasukkan penilaian iklim etika ke dalam evaluasi kinerja para
pemimpin unit.</p>
<p>Sebagian direksi khawatir bahwa penerbitan angka laporan akan menimbulkan kesan bahwa pelanggaran meningkat,
padahal yang meningkat adalah keberanian melapor.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Komponen Formal dan Informal",
        note: "Bandingkan kekuatan sinyal dari kedua kolom.",
        rows: [["Komponen formal", "Status di lembaga ini", "Komponen informal", "Status di lembaga ini"],
               ["Kode etik tertulis", "Ada dan lengkap", "Keteladanan atasan langsung", "Tidak konsisten"],
               ["Pelatihan wajib", "Ada dan terdokumentasi", "Cerita tentang nasib pelapor", "Menakutkan"],
               ["Saluran pelaporan", "Ada", "Keyakinan atas kerahasiaan", "Rendah"],
               ["Sanksi tertulis", "Ada", "Konsistensi penerapan sanksi", "Diragukan"]] },
      { title: "Exhibit 2: Prasyarat Saluran Pelaporan yang Dipercaya",
        note: "Gunakan sebagai daftar periksa saat merancang usulan Anda.",
        rows: [["Prasyarat", "Pertanyaan uji"],
               ["Independensi pengelola", "Apakah pengelola berada di luar garis komando terlapor?"],
               ["Perlindungan pelapor", "Adakah konsekuensi nyata bagi pembalasan?"],
               ["Umpan balik", "Apakah pelapor tahu laporannya ditindaklanjuti?"],
               ["Transparansi agregat", "Apakah organisasi mempublikasikan statistik penanganan?"],
               ["Konsistensi sanksi", "Apakah aturan berlaku sama untuk pejabat senior?"]] }
    ],
    questions: [
      "Mengapa kelengkapan komponen formal pada Exhibit 1 tidak menghasilkan perilaku melapor? Apa yang ditunjukkan hal itu tentang hubungan kode etik dan budaya?",
      "Nilai keempat usulan direktur kepatuhan memakai daftar periksa pada Exhibit 2. Mana yang paling menentukan, dan mengapa?",
      "Sebagian direksi khawatir kenaikan angka laporan akan disalahartikan. Bagaimana Anda menanggapi kekhawatiran itu?",
      "Apakah kewajiban melapor merupakan kewajiban moral bagi karyawan biasa, ataukah kewajiban itu hanya melekat pada mereka yang memiliki kewenangan?",
      "Rancang tiga langkah pertama yang akan Anda jalankan dalam enam bulan pertama sebagai direktur kepatuhan."
    ],
    guide: {
      problem: "Nyatakan masalahnya sebagai kesenjangan antara sistem etika formal yang lengkap dan budaya organisasi yang tidak mendukungnya.",
      alternatives: "Juduli usulan-usulan yang tersedia, sebutkan konsekuensi struktural dan biayanya.",
      issues: "Bahas risiko pembalasan terhadap pelapor, kekhawatiran reputasi, dan konsistensi penerapan sanksi pada jenjang senior.",
      conclusion: "Tetapkan rancangan sistem beserta indikator yang menunjukkan kepercayaan karyawan meningkat, bukan sekadar jumlah dokumen bertambah."
    }
  },

  {
    id: "bes6-jiwasraya",
    title: "Dana Nasabah yang Ditempatkan pada Saham Berisiko",
    subtitle: "Ketika tata kelola gagal, siapa pemangku kepentingan yang paling menanggung akibatnya?",
    forSession: 6,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 6 tentang shareholder dan tata kelola perusahaan",
    decisionMaker: "Dewan komisaris dan regulator sebuah perusahaan asuransi jiwa milik negara",
    decisionPoint: "Menentukan mekanisme pengawasan yang mencegah penempatan investasi berisiko di luar batas kehati-hatian",
    relevance: "Kasus untuk agency problem, tanggung jawab fidusia, dan perbedaan antara pandangan shareholder dan stakeholder pada perusahaan milik negara.",
    sections: [
      { heading: "Produk yang Menjanjikan Imbal Hasil Tinggi",
        body: `<p>Sebuah perusahaan asuransi jiwa milik negara memasarkan produk yang menggabungkan proteksi dengan
imbal hasil pasti yang tinggi, di atas tingkat bunga deposito pada masanya. Produk itu laku keras karena dijual
lewat jaringan perbankan dan dipandang aman oleh nasabah mengingat status kepemilikan negara.</p>
<p>Untuk memenuhi janji imbal hasil tersebut, dana nasabah perlu ditempatkan pada instrumen berimbal hasil tinggi.
Laporan pemeriksaan yang kemudian dipublikasikan menunjukkan penempatan pada saham dan reksa dana dengan likuiditas
rendah dan kualitas yang dipertanyakan, di luar praktik kehati-hatian yang lazim bagi dana jangka panjang milik
pemegang polis.</p>
<p>Ketika nilai instrumen itu jatuh, perusahaan tidak mampu membayar klaim yang jatuh tempo. Ratusan ribu pemegang
polis, banyak di antaranya pensiunan yang menempatkan seluruh tabungannya, tidak menerima haknya tepat waktu.
Kasus ini kemudian berujung pada proses hukum dan kerugian negara yang dinyatakan mencapai belasan triliun rupiah.</p>` },
      { heading: "Siapa Prinsipal, Siapa Agen",
        body: `<p>Kerangka keagenan menjelaskan sebagian persoalannya. Manajemen bertindak sebagai agen bagi
pemegang saham, yaitu negara, sekaligus memikul tanggung jawab fidusia kepada pemegang polis yang menitipkan
dananya. Kedua tanggung jawab itu dapat berbenturan ketika tekanan mencapai target pertumbuhan mendorong penjualan
produk berjanji tinggi.</p>
<p>Mekanisme pengawasan yang seharusnya bekerja gagal berlapis. Dewan komisaris tidak menghentikan strategi
investasi tersebut. Auditor tidak mengangkat persoalan penilaian aset secara cukup keras. Regulator tidak
menghentikan penjualan produk. Setiap lapis memiliki alasan, dan bersama-sama mereka menghasilkan kegagalan
sistem.</p>
<p>Pertanyaan etisnya melampaui pertanyaan hukum. Pemegang polis bukan investor yang memilih mengambil risiko;
mereka membeli janji keamanan. Menggunakan dana mereka untuk risiko yang tidak mereka pahami menyentuh persoalan
persetujuan dan kejujuran, bukan sekadar persoalan kehati-hatian teknis.</p>` },
      { heading: "Pertanyaan bagi Perusahaan Milik Negara",
        body: `<p>Kasus ini memunculkan perdebatan lebih luas tentang perusahaan milik negara. Ketika pemegang
sahamnya adalah negara, siapa yang benar-benar mengawasi manajemen? Ketika kerugian terjadi, siapa yang
menanggungnya, dan atas dasar apa dana publik dipakai untuk menutup kerugian yang lahir dari keputusan
manajemen?</p>
<p>Usulan perbaikan yang muncul mencakup pemisahan tegas antara dana pemegang polis dan dana perusahaan, pembatasan
jenis instrumen investasi, penguatan komisaris independen, serta larangan produk berjanji imbal hasil pasti di atas
ambang tertentu.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Lapis Pengawasan yang Gagal",
        note: "Nilai kontribusi tiap lapis sebelum menentukan prioritas perbaikan.",
        rows: [["Lapis", "Peran seharusnya", "Kegagalan yang terjadi"],
               ["Direksi", "Menerapkan kehati-hatian investasi", "Menempatkan dana pada aset berisiko tinggi"],
               ["Dewan komisaris", "Mengawasi dan menantang direksi", "Tidak menghentikan strategi tersebut"],
               ["Auditor", "Menguji penilaian aset", "Tidak mengangkat persoalan cukup keras"],
               ["Regulator", "Melindungi pemegang polis", "Terlambat menghentikan penjualan produk"]] },
      { title: "Exhibit 2: Pemangku Kepentingan dan Kerugiannya",
        note: "Perhatikan bahwa pihak yang paling menanggung bukan pengambil keputusan.",
        rows: [["Pemangku kepentingan", "Bentuk kerugian", "Kendali atas keputusan"],
               ["Pemegang polis", "Klaim tidak dibayar tepat waktu", "Tidak ada"],
               ["Pembayar pajak", "Beban penyelesaian", "Tidak ada"],
               ["Karyawan", "Ketidakpastian pekerjaan", "Terbatas"],
               ["Manajemen pengambil keputusan", "Sanksi hukum", "Penuh"]] }
    ],
    questions: [
      "Jelaskan persoalan keagenan pada kasus ini. Siapa prinsipal, siapa agen, dan di mana kepentingan mereka berbenturan?",
      "Pemegang polis bukan investor yang memilih risiko. Apa implikasi perbedaan itu bagi kewajiban etis manajemen?",
      "Dengan Exhibit 1, tentukan lapis pengawasan mana yang perbaikannya paling menentukan, dan pertahankan pilihan Anda.",
      "Exhibit 2 menunjukkan pihak yang menanggung kerugian bukan pihak yang mengendalikan keputusan. Prinsip keadilan apa yang dilanggar oleh pola semacam ini?",
      "Untuk perusahaan milik negara, apakah pandangan shareholder ala Friedman masih dapat diterapkan? Jelaskan posisi Anda."
    ],
    guide: {
      problem: "Rumuskan masalahnya sebagai kegagalan tanggung jawab fidusia terhadap pihak yang tidak memiliki kendali maupun informasi.",
      alternatives: "Juduli usulan perbaikan tata kelola yang tersedia, sebutkan konsekuensi kelembagaannya.",
      issues: "Bahas benturan antara target pertumbuhan dan kehati-hatian, kelemahan pengawasan berlapis, dan penggunaan dana publik untuk menutup kerugian.",
      conclusion: "Tetapkan paket perbaikan, urutkan berdasarkan dampaknya, dan sebutkan mekanisme yang membuatnya tidak mudah dilemahkan kembali."
    }
  },
  {
    id: "bes7-phk",
    title: "Pemutusan Hubungan Kerja lewat Panggilan Video",
    subtitle: "Efisiensi yang sah secara hukum, cara pelaksanaan yang dipersoalkan secara etis",
    forSession: 7,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 7 tentang karyawan sebagai pemangku kepentingan",
    decisionMaker: "Chief People Officer sebuah perusahaan teknologi yang sedang melakukan efisiensi",
    decisionPoint: "Menentukan cakupan, cara pelaksanaan, dan paket kompensasi pemutusan hubungan kerja",
    relevance: "Kasus untuk hak pekerja, martabat dalam prosedur, keadilan distributif dan prosedural, serta due process.",
    sections: [
      { heading: "Musim Efisiensi",
        body: `<p>Setelah beberapa tahun pertumbuhan yang dibiayai pendanaan investor, sejumlah perusahaan teknologi
Indonesia memasuki periode yang berbeda pada 2022 dan 2023. Pendanaan mengetat, tuntutan mencapai profitabilitas
menguat, dan gelombang pemutusan hubungan kerja terjadi di banyak perusahaan, dengan jumlah karyawan terdampak
mencapai ribuan orang secara agregat.</p>
<p>Sebagian besar perusahaan menjalankannya sesuai ketentuan hukum ketenagakerjaan. Namun cara pelaksanaannya
menjadi sorotan. Beberapa karyawan mengetahui pemutusan lewat pertemuan daring singkat yang diikuti ratusan orang
sekaligus, sebagian lain kehilangan akses ke surel dan sistem perusahaan sebelum pemberitahuan selesai
disampaikan.</p>
<p>Manajemen berargumen bahwa pelaksanaan serentak diperlukan untuk mencegah kebocoran informasi, menjaga
keamanan data, dan memperpendek periode ketidakpastian yang justru menyiksa.</p>` },
      { heading: "Tiga Pertanyaan yang Berbeda",
        body: `<p>Kasus semacam ini sebaiknya dipecah menjadi tiga pertanyaan yang terpisah. Pertama, pertanyaan
tentang <strong>keputusan</strong>: apakah pemutusan hubungan kerja itu sendiri dapat dibenarkan? Kedua, pertanyaan
tentang <strong>pemilihan</strong>: bagaimana menentukan siapa yang terdampak, dan apakah kriterianya adil? Ketiga,
pertanyaan tentang <strong>pelaksanaan</strong>: bagaimana keputusan itu disampaikan dan apa yang diberikan kepada
mereka yang pergi?</p>
<p>Ketiganya sering tercampur dalam perdebatan publik. Sebuah pemutusan dapat dibenarkan pada pertanyaan pertama,
tetapi gagal total pada pertanyaan ketiga. Perusahaan yang menyelamatkan kelangsungan usahanya dengan cara yang
merendahkan tetap menanggung persoalan etis, sekaligus kehilangan kepercayaan karyawan yang tetap tinggal.</p>
<p>Teori keadilan membedakan keadilan distributif, yaitu apa yang diterima orang, dan keadilan prosedural, yaitu
bagaimana keputusan diambil dan disampaikan. Karyawan yang terdampak sering menerima paket yang secara hukum
memadai, tetapi merasakan pelanggaran pada sisi prosedural.</p>` },
      { heading: "Keputusan yang Harus Diambil",
        body: `<p>Perusahaan menghadapi kebutuhan menurunkan biaya tenaga kerja dalam waktu terbatas. Tim keuangan
mengusulkan pemutusan sekaligus dengan paket sesuai ketentuan minimum. Tim sumber daya manusia mengusulkan paket di
atas ketentuan disertai dukungan penempatan kerja dan pemberitahuan personal oleh atasan langsung, dengan biaya
lebih tinggi. Sebagian manajer mengusulkan alternatif berupa pemotongan jam kerja dan gaji secara menyeluruh agar
tidak ada yang kehilangan pekerjaan, meskipun secara finansial lebih lambat memperbaiki posisi kas.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Tiga Pertanyaan yang Harus Dipisahkan",
        note: "Nilai setiap pertanyaan secara terpisah agar analisis tidak tercampur.",
        rows: [["Pertanyaan", "Kriteria penilaian", "Kesalahan umum"],
               ["Apakah pemutusan dibenarkan?", "Kelangsungan usaha, alternatif yang tersedia", "Menganggap alasan bisnis otomatis membenarkan cara"],
               ["Siapa yang terdampak?", "Kriteria objektif, bebas diskriminasi", "Kriteria yang tidak dijelaskan"],
               ["Bagaimana disampaikan?", "Martabat, pemberitahuan, dukungan transisi", "Efisiensi pelaksanaan dijadikan tujuan"]] },
      { title: "Exhibit 2: Tiga Usulan dan Konsekuensinya",
        note: "Kolom bersifat relatif untuk latihan perbandingan.",
        rows: [["Usulan", "Perbaikan posisi kas", "Dampak pada martabat pekerja", "Dampak pada karyawan yang tinggal"],
               ["Pemutusan minimum sesuai aturan", "Cepat", "Rendah", "Kepercayaan menurun"],
               ["Paket di atas ketentuan plus dukungan", "Lebih lambat", "Tinggi", "Kepercayaan relatif terjaga"],
               ["Pemotongan jam dan gaji menyeluruh", "Paling lambat", "Menengah", "Beban ditanggung bersama"]] }
    ],
    questions: [
      "Pisahkan kasus ini menjadi tiga pertanyaan pada Exhibit 1 dan nilai masing-masing secara terpisah.",
      "Bedakan keadilan distributif dan keadilan prosedural pada kasus ini. Pada dimensi mana perusahaan paling bermasalah?",
      "Manajemen berargumen pelaksanaan serentak diperlukan demi keamanan data. Apakah alasan itu cukup membenarkan cara penyampaian tersebut?",
      "Usulan pemotongan jam kerja menyebar beban ke semua orang. Apakah pendekatan itu lebih etis, atau justru memindahkan kerugian kepada mereka yang tidak dimintai pendapat?",
      "Ambil posisi sebagai Chief People Officer, pilih satu usulan pada Exhibit 2, dan jelaskan bagaimana Anda menyampaikannya."
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai benturan antara kebutuhan kelangsungan usaha dan kewajiban memperlakukan pekerja dengan martabat.",
      alternatives: "Juduli ketiga usulan dan sebutkan konsekuensi finansial serta manusiawinya.",
      issues: "Terapkan lensa hak pekerja, keadilan distributif dan prosedural, serta konsekuensi bagi karyawan yang tetap tinggal.",
      conclusion: "Ambil posisi, tetapkan paket dan prosedur penyampaian yang konkret, dan sebutkan usulan yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "bes8-pinjol",
    title: "Pinjaman Daring, Bunga Harian, dan Penagihan",
    subtitle: "Akses keuangan bagi yang tidak terjangkau bank, dengan biaya yang dipersoalkan",
    forSession: 8,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 8 tentang konsumen; ketentuan Otoritas Jasa Keuangan tentang layanan pendanaan bersama berbasis teknologi",
    decisionMaker: "Direksi sebuah penyelenggara layanan pendanaan daring berizin",
    decisionPoint: "Menetapkan batas biaya, praktik penagihan, dan standar keterbukaan informasi kepada peminjam",
    relevance: "Kasus untuk hak konsumen, kerentanan, informasi asimetris, dan batas antara pemasaran yang sah dan eksploitatif.",
    sections: [
      { heading: "Kredit untuk yang Tidak Terjangkau Bank",
        body: `<p>Sebagian besar penduduk dewasa Indonesia tidak memiliki akses kredit formal. Ketika kebutuhan
mendesak muncul, pilihan mereka selama ini adalah kerabat atau rentenir. Layanan pendanaan daring menawarkan
alternatif: pengajuan lewat aplikasi, keputusan dalam hitungan menit, dan pencairan pada hari yang sama tanpa
agunan.</p>
<p>Manfaatnya nyata bagi sebagian peminjam. Pedagang kecil dapat menambah modal dagangan, dan keluarga dapat
menutup biaya kesehatan mendadak.</p>
<p>Biayanya juga nyata. Karena risikonya tinggi dan tenornya pendek, biaya harian yang tampak kecil menghasilkan
biaya efektif tahunan yang sangat besar. Otoritas kemudian menetapkan batas maksimum biaya harian dan mengatur
praktik penagihan, sebagian karena maraknya laporan tentang penagihan yang mengancam serta penyalahgunaan akses
kontak telepon peminjam.</p>` },
      { heading: "Tiga Titik yang Dipersoalkan",
        body: `<p>Persoalan pertama menyangkut <strong>keterbukaan informasi</strong>. Biaya sering ditampilkan
sebagai angka harian atau nominal per cicilan, bukan sebagai biaya efektif tahunan. Secara formal informasinya
tersedia, tetapi disajikan dalam bentuk yang menyulitkan perbandingan bagi orang yang tidak terbiasa dengan
matematika keuangan.</p>
<p>Persoalan kedua menyangkut <strong>penargetan</strong>. Model penilaian risiko dapat mengenali orang yang sedang
terdesak dan menawarkan pinjaman tepat pada saat kemampuan menimbang mereka paling lemah. Menawarkan produk kepada
orang yang paling rentan menimbulkan pertanyaan etis meskipun setiap transaksinya bersifat sukarela.</p>
<p>Persoalan ketiga menyangkut <strong>penagihan</strong>. Sebagian penyelenggara mengalihdayakan penagihan kepada
pihak ketiga yang dibayar berdasarkan keberhasilan, sebuah struktur insentif yang mendorong tekanan berlebihan.
Perusahaan dapat menyatakan tidak mengetahui praktik di lapangan, tetapi struktur insentif itu adalah keputusannya
sendiri.</p>` },
      { heading: "Usulan Kebijakan Internal",
        body: `<p>Direksi mempertimbangkan beberapa langkah: menampilkan biaya efektif tahunan secara mencolok
sebelum persetujuan; menolak pemberian pinjaman baru kepada peminjam yang sedang menanggung beberapa pinjaman
sekaligus di penyelenggara lain; membawa penagihan ke dalam perusahaan dengan skema imbalan yang tidak berbasis
keberhasilan semata; serta menetapkan batas biaya di bawah batas maksimum yang diizinkan regulator.</p>
<p>Setiap langkah menurunkan pendapatan dalam jangka pendek, sementara pesaing tidak wajib mengikutinya.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Cara Menampilkan Biaya (ilustrasi)",
        note: "Angka ilustratif untuk memperlihatkan pengaruh cara penyajian, bukan tarif perusahaan tertentu.",
        rows: [["Cara penyajian", "Bentuk yang dilihat konsumen", "Kesan yang muncul"],
               ["Biaya harian", "0,4% per hari", "Terasa kecil"],
               ["Biaya per tenor 30 hari", "12% per bulan", "Terasa sedang"],
               ["Biaya efektif tahunan", "Di atas 140% per tahun", "Terasa besar"],
               ["Nominal per cicilan", "Rp60.000 per minggu", "Terasa terjangkau"]] },
      { title: "Exhibit 2: Hak Konsumen dan Ujinya",
        note: "Gunakan sebagai daftar periksa saat menilai praktik perusahaan.",
        rows: [["Hak konsumen", "Pertanyaan uji"],
               ["Hak atas informasi", "Apakah biaya disajikan dalam bentuk yang dapat dibandingkan?"],
               ["Hak untuk memilih", "Apakah keputusan diambil tanpa tekanan waktu yang dibuat-buat?"],
               ["Hak atas keamanan", "Apakah data pribadi dan kontak dilindungi?"],
               ["Hak untuk didengar", "Adakah saluran pengaduan yang berfungsi?"],
               ["Hak atas perlakuan yang layak", "Apakah penagihan bebas dari ancaman dan mempermalukan?"]] }
    ],
    questions: [
      "Exhibit 1 menunjukkan angka yang sama terasa berbeda tergantung cara penyajian. Apakah menyajikan biaya harian merupakan pelanggaran etis, ataukah sekadar praktik pemasaran yang lazim?",
      "Model penilaian risiko dapat menargetkan orang yang sedang terdesak. Apakah transaksi sukarela dari pihak yang terdesak tetap dapat disebut persetujuan yang bermakna?",
      "Penagihan dialihdayakan dengan imbalan berbasis keberhasilan. Sejauh mana perusahaan bertanggung jawab atas perilaku pihak ketiga yang insentifnya ia rancang sendiri?",
      "Nilai keempat usulan direksi dengan daftar periksa pada Exhibit 2. Mana yang paling menentukan bagi perlindungan konsumen?",
      "Menetapkan batas biaya di bawah batas regulator menurunkan pendapatan sementara pesaing tidak wajib mengikutinya. Bagaimana Anda mempertahankan keputusan itu di hadapan pemegang saham?"
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai ketegangan antara perluasan akses keuangan dan risiko eksploitasi terhadap konsumen rentan.",
      alternatives: "Juduli usulan kebijakan yang tersedia dan sebutkan dampaknya pada pendapatan dan risiko kredit.",
      issues: "Terapkan lensa hak konsumen, konsekuensi bagi peminjam yang gagal bayar, dan keadilan struktur insentif penagihan.",
      conclusion: "Tetapkan paket kebijakan, sebutkan yang Anda tolak beserta alasannya, dan usulkan indikator perlindungan konsumen yang akan dipantau."
    }
  },

  {
    id: "bes9-ayam",
    title: "Peternak Mandiri dan Perusahaan Terintegrasi",
    subtitle: "Ketika satu perusahaan menjadi pemasok sarana produksi sekaligus pesaing di pasar yang sama",
    forSession: 9,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 9 tentang pemasok dan pesaing; putusan Komisi Pengawas Persaingan Usaha terkait industri perunggasan",
    decisionMaker: "Manajemen sebuah perusahaan perunggasan terintegrasi",
    decisionPoint: "Menentukan kebijakan penjualan bibit ayam dan pakan kepada peternak mandiri yang sekaligus menjadi pesaing di pasar ayam potong",
    relevance: "Kasus untuk etika hubungan dengan pemasok dan pesaing, penyalahgunaan posisi dominan, dan integrasi vertikal.",
    sections: [
      { heading: "Struktur Industri yang Timpang",
        body: `<p>Industri perunggasan Indonesia didominasi beberapa perusahaan besar yang terintegrasi dari hulu ke
hilir: mereka memproduksi bibit ayam umur sehari, memproduksi pakan, menjalankan peternakan sendiri, dan memiliki
rumah potong serta jalur distribusi. Di sisi lain terdapat puluhan ribu peternak mandiri berskala kecil dan
menengah.</p>
<p>Peternak mandiri membeli bibit dan pakan dari perusahaan terintegrasi tersebut, lalu menjual ayam hidup di
pasar yang sama tempat perusahaan itu juga menjual. Dengan kata lain, pemasok utama mereka adalah pesaing mereka.</p>
<p>Struktur seperti ini secara inheren menghasilkan ketegangan. Ketika harga ayam hidup jatuh, peternak mandiri
menanggung kerugian penuh, sementara perusahaan terintegrasi masih memperoleh marjin dari penjualan bibit dan
pakan. Ketika pemerintah memerintahkan pengurangan produksi bibit untuk menstabilkan harga, pertanyaan tentang siapa
yang menanggung pengurangan itu menjadi tajam.</p>` },
      { heading: "Batas antara Efisiensi dan Penyalahgunaan",
        body: `<p>Integrasi vertikal bukan praktik terlarang. Ia menghasilkan efisiensi nyata: mutu bibit terjaga,
rantai dingin terkendali, dan biaya transaksi turun. Persoalan etis muncul ketika posisi dominan dipakai untuk
menutup ruang hidup pihak yang bergantung.</p>
<p>Beberapa praktik berada di wilayah abu-abu. Menetapkan harga bibit yang tinggi bagi peternak mandiri sementara
transfer internal dilakukan pada harga lebih rendah adalah keputusan bisnis, tetapi berdampak menekan pesaing yang
sekaligus pelanggan. Mengutamakan pasokan bagi peternakan sendiri saat pasokan bibit terbatas juga masuk akal
secara operasional, tetapi berakibat serupa.</p>
<p>Otoritas persaingan usaha pernah memeriksa praktik di industri ini, termasuk dugaan kesepakatan pengurangan
produksi bersama, yang memperlihatkan bahwa batas hukumnya pun tidak selalu jelas bagi para pelaku.</p>` },
      { heading: "Keputusan Kebijakan",
        body: `<p>Manajemen mempertimbangkan tiga arah. Pertama, memperlakukan peternak mandiri sepenuhnya sebagai
pelanggan dengan kebijakan harga dan alokasi yang setara dengan unit internal, disertai keterbukaan formula harga.
Kedua, mengubah sebagian peternak mandiri menjadi mitra kemitraan dengan kontrak harga jaminan, yang memberi
kepastian sekaligus mengurangi kemandirian mereka. Ketiga, mempertahankan praktik yang berlaku sepanjang tidak
melanggar putusan otoritas.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Posisi Peternak Mandiri",
        note: "Perhatikan bahwa ketergantungan terjadi pada dua sisi sekaligus.",
        rows: [["Aspek", "Perusahaan terintegrasi", "Peternak mandiri"],
               ["Sumber bibit dan pakan", "Produksi sendiri", "Membeli dari perusahaan terintegrasi"],
               ["Akses rumah potong", "Milik sendiri", "Terbatas"],
               ["Ketahanan saat harga jatuh", "Marjin hulu menopang", "Menanggung kerugian penuh"],
               ["Akses pembiayaan", "Kuat", "Terbatas"]] },
      { title: "Exhibit 2: Tiga Arah Kebijakan",
        note: "Bahan pembanding untuk bagian Issues.",
        rows: [["Arah kebijakan", "Dampak pada peternak mandiri", "Dampak pada laba jangka pendek", "Risiko hukum"],
               ["Perlakuan setara dan harga transparan", "Positif", "Menurun", "Rendah"],
               ["Konversi menjadi mitra kontrak", "Kepastian naik, kemandirian turun", "Stabil", "Menengah"],
               ["Pertahankan praktik berjalan", "Tertekan", "Tertinggi", "Tinggi"]] }
    ],
    questions: [
      "Mengapa struktur yang menempatkan pemasok utama sebagai pesaing menimbulkan persoalan etis meskipun setiap transaksinya sah?",
      "Di mana batas antara memanfaatkan efisiensi integrasi vertikal dan menyalahgunakan posisi dominan? Rumuskan uji yang dapat dipakai manajer.",
      "Nilai ketiga arah pada Exhibit 2 dengan lensa keadilan dan konsekuensi. Mana yang paling dapat dipertahankan secara etis?",
      "Konversi menjadi mitra kontrak memberi kepastian tetapi mengurangi kemandirian. Apakah pertukaran itu adil bagi peternak?",
      "Bagaimana Anda menilai peran pemerintah dalam kasus ini: melindungi peternak kecil, menjaga persaingan, atau menjaga harga konsumen?"
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai pertanyaan tentang kewajiban perusahaan dominan terhadap pihak yang bergantung padanya sekaligus bersaing dengannya.",
      alternatives: "Juduli ketiga arah kebijakan dan sebutkan konsekuensi komersial serta hukumnya.",
      issues: "Bahas efisiensi integrasi, ketimpangan daya tawar, keadilan dalam menanggung kerugian saat harga jatuh, dan batas hukum persaingan usaha.",
      conclusion: "Ambil posisi, tetapkan aturan internal yang konkret misalnya formula harga terbuka, dan sebutkan arah yang Anda tolak beserta alasannya."
    }
  },
  {
    id: "bes10-kendeng",
    title: "Pabrik Semen di Pegunungan Kapur",
    subtitle: "Ketika petani, organisasi masyarakat sipil, perusahaan, dan pengadilan berhadapan atas satu kawasan",
    forSession: 10,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 10 tentang masyarakat sipil; putusan peninjauan kembali Mahkamah Agung terkait izin lingkungan pabrik semen di Jawa Tengah",
    decisionMaker: "Direksi sebuah perusahaan semen dan pemerintah provinsi",
    decisionPoint: "Menentukan kelanjutan proyek setelah perlawanan warga dan putusan pengadilan",
    relevance: "Kasus untuk peran organisasi masyarakat sipil, izin sosial untuk beroperasi, dan batas legitimasi izin formal.",
    sections: [
      { heading: "Dua Pandangan atas Satu Kawasan",
        body: `<p>Kawasan pegunungan kapur di Jawa Tengah memiliki dua makna yang berbeda bagi dua pihak. Bagi
industri, batu gamping adalah bahan baku utama semen, dan kawasan itu bernilai ekonomi besar dengan janji lapangan
kerja serta pendapatan daerah. Bagi sebagian petani di sekitarnya, kawasan karst adalah sistem penyimpan air yang
menghidupi lahan pertanian mereka melalui mata air dan sungai bawah tanah.</p>
<p>Ketika rencana pembangunan pabrik semen bergulir, sebagian warga menolak. Perlawanan itu berlangsung
bertahun-tahun, memakai jalur hukum sekaligus aksi simbolik yang menarik perhatian nasional, termasuk aksi
menyemen kaki di depan istana yang diliput luas media.</p>
<p>Perlawanan warga didampingi organisasi lingkungan, akademisi yang menyusun kajian hidrogeologi, dan jaringan
solidaritas yang membawa isu itu ke tingkat nasional. Pada 2016, Mahkamah Agung mengabulkan permohonan peninjauan
kembali dan membatalkan izin lingkungan yang menjadi dasar proyek, meskipun persoalannya berlanjut lewat penerbitan
izin baru dan kajian lingkungan hidup strategis.</p>` },
      { heading: "Izin Formal dan Izin Sosial",
        body: `<p>Kasus ini memperlihatkan perbedaan antara izin formal dan apa yang lazim disebut izin sosial untuk
beroperasi. Perusahaan dapat memiliki seluruh dokumen yang diwajibkan, tetapi tetap menghadapi penolakan yang
membuat proyek tidak berjalan. Sebaliknya, penerimaan masyarakat tanpa izin formal juga tidak memadai.</p>
<p>Organisasi masyarakat sipil dalam kasus ini menjalankan beberapa peran sekaligus: mewakili pihak yang daya
tawarnya lemah, menyediakan keahlian teknis yang tidak dimiliki warga, dan mengubah persoalan lokal menjadi
perhatian nasional. Peran itu memberi mereka pengaruh besar tanpa mandat pemilihan, yang oleh sebagian pihak
dipersoalkan legitimasinya.</p>
<p>Di sisi lain, warga yang menolak bukan kelompok tunggal. Sebagian warga mendukung proyek karena mengharapkan
pekerjaan. Menyebut penolakan sebagai suara warga secara keseluruhan sama menyesatkannya dengan mengabaikan
penolakan itu.</p>` },
      { heading: "Pertanyaan bagi Perusahaan",
        body: `<p>Direksi menghadapi pilihan yang sulit. Melanjutkan proyek berdasarkan izin baru berarti
menghadapi konflik berkepanjangan dengan biaya reputasi dan risiko hukum. Menghentikan proyek berarti menghapus
investasi yang telah dikeluarkan dan mengecewakan pemerintah daerah serta warga yang mendukung. Mencari lokasi
alternatif menunda proyek bertahun-tahun.</p>
<p>Pilihan keempat yang lebih jarang dibahas adalah mengubah cara pengambilan keputusan itu sendiri: melibatkan
warga dan akademisi dalam kajian yang disepakati bersama sejak awal, dengan komitmen mengikuti hasilnya.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Peran Organisasi Masyarakat Sipil",
        note: "Nilai kekuatan dan keterbatasan tiap peran.",
        rows: [["Peran", "Wujudnya pada kasus ini", "Pertanyaan yang muncul"],
               ["Mewakili pihak lemah", "Mendampingi petani di pengadilan", "Siapa yang memberi mandat?"],
               ["Menyediakan keahlian", "Kajian hidrogeologi independen", "Bagaimana menguji kualitasnya?"],
               ["Memperbesar suara", "Aksi simbolik dan liputan nasional", "Apakah representatif atas seluruh warga?"],
               ["Mengawasi kepatuhan", "Menggugat izin lingkungan", "Apa batas intervensinya?"]] },
      { title: "Exhibit 2: Empat Pilihan Perusahaan",
        note: "Bahan pembanding untuk bagian Alternatives.",
        rows: [["Pilihan", "Biaya finansial", "Risiko konflik", "Legitimasi sosial"],
               ["Lanjutkan dengan izin baru", "Rendah", "Tinggi", "Rendah"],
               ["Hentikan proyek", "Sangat tinggi", "Rendah", "Menengah"],
               ["Pindah lokasi", "Tinggi", "Menengah", "Menengah"],
               ["Kaji ulang bersama warga dan akademisi", "Menengah", "Menengah", "Berpotensi tinggi"]] }
    ],
    questions: [
      "Jelaskan perbedaan antara izin formal dan izin sosial untuk beroperasi. Mengapa memiliki yang pertama tidak menjamin yang kedua?",
      "Organisasi masyarakat sipil memiliki pengaruh besar tanpa mandat pemilihan. Bagaimana Anda menilai legitimasi peran mereka pada Exhibit 1?",
      "Warga tidak bersuara tunggal. Bagaimana perusahaan seharusnya menangani situasi ketika sebagian warga menolak dan sebagian mendukung?",
      "Nilai keempat pilihan pada Exhibit 2 dengan lensa konsekuensi, hak, dan keadilan. Mana yang paling dapat dipertahankan?",
      "Rancang proses pengambilan keputusan yang menurut Anda seharusnya dipakai sejak awal untuk proyek dengan dampak lingkungan besar."
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai benturan antara hak atas pembangunan ekonomi dan hak masyarakat atas sumber penghidupannya.",
      alternatives: "Juduli keempat pilihan, sebutkan konsekuensi finansial dan sosialnya tanpa argumen pro dan kontra.",
      issues: "Bahas keabsahan kajian ilmiah yang bertentangan, legitimasi perwakilan warga, dan hubungan antara kepatuhan hukum dan penerimaan sosial.",
      conclusion: "Ambil posisi, tetapkan prosedur pelibatan yang konkret, dan sebutkan pilihan yang Anda tolak beserta alasannya."
    }
  },

  {
    id: "bes11-nikel",
    title: "Larangan Ekspor Bijih Nikel",
    subtitle: "Kebijakan yang mengubah struktur industri, menaikkan nilai tambah, dan menuai gugatan internasional",
    forSession: 11,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 11 tentang pemerintah dan regulasi; laporan panel Organisasi Perdagangan Dunia terkait gugatan Uni Eropa atas kebijakan Indonesia",
    decisionMaker: "Manajemen sebuah perusahaan pertambangan dan pengolahan nikel yang beroperasi di Indonesia",
    decisionPoint: "Menentukan sikap perusahaan terhadap kebijakan hilirisasi, termasuk investasi smelter dan standar lingkungan yang diterapkan",
    relevance: "Kasus untuk hubungan bisnis dan pemerintah, kebijakan industri, lobi, dan tanggung jawab lingkungan lintas negara.",
    sections: [
      { heading: "Kebijakan yang Mengubah Peta",
        body: `<p>Indonesia memiliki cadangan nikel terbesar di dunia. Selama bertahun-tahun sebagian besar diekspor
dalam bentuk bijih mentah dengan nilai tambah rendah. Pemerintah kemudian menerapkan larangan ekspor bijih nikel
untuk mendorong pembangunan fasilitas pengolahan di dalam negeri, dengan kebijakan yang berlaku penuh sejak awal
2020.</p>
<p>Hasilnya terlihat pada angka perdagangan. Nilai ekspor produk turunan nikel meningkat berlipat dibanding nilai
ekspor bijih mentah sebelumnya, dan rangkaian smelter dibangun terutama dengan modal asing. Kawasan industri baru
tumbuh di Sulawesi dan Maluku Utara.</p>
<p>Uni Eropa menggugat kebijakan itu ke Organisasi Perdagangan Dunia, dan panel memutuskan kebijakan tersebut
bertentangan dengan ketentuan perdagangan internasional. Indonesia mengajukan banding dan tetap melanjutkan
kebijakannya.</p>` },
      { heading: "Manfaat dan Biaya yang Tidak Merata",
        body: `<p>Kebijakan ini menghasilkan manfaat yang nyata: penerimaan negara meningkat, lapangan kerja
tercipta, dan kemampuan industri terbangun. Namun biayanya juga nyata dan tidak merata. Sebagian besar smelter
menggunakan pembangkit listrik batu bara, sehingga penurunan emisi pada rantai kendaraan listrik global sebagian
tergeser menjadi emisi di Indonesia. Muncul pula persoalan pengelolaan limbah, dampak pada wilayah pesisir,
keselamatan kerja setelah beberapa kecelakaan di kawasan industri, serta perselisihan mengenai lahan dan tenaga
kerja asing.</p>
<p>Bagi perusahaan yang beroperasi di sana, muncul pertanyaan yang tidak dapat dijawab hanya dengan kepatuhan.
Standar lingkungan dan keselamatan yang diwajibkan di Indonesia berbeda dari standar di negara asal sebagian
investor. Perusahaan dapat memenuhi standar setempat sepenuhnya dan tetap menghadapi pertanyaan etis dari pembeli
serta publik internasional.</p>` },
      { heading: "Pilihan Sikap Perusahaan",
        body: `<p>Manajemen mempertimbangkan tiga sikap. Pertama, mematuhi standar setempat dan mengandalkan
argumen kedaulatan kebijakan. Kedua, menerapkan standar internal yang lebih ketat daripada kewajiban setempat,
terutama pada emisi dan keselamatan kerja, dengan biaya lebih tinggi daripada pesaing. Ketiga, bergabung dalam
inisiatif industri untuk menyusun standar bersama dan mendorong pemerintah menaikkan ketentuan bagi semua
pelaku.</p>
<p>Pilihan ketiga menyerupai lobi, tetapi dengan arah yang tidak biasa: meminta regulasi yang lebih ketat bagi
diri sendiri dan pesaing.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Manfaat dan Biaya Kebijakan Hilirisasi",
        note: "Perhatikan siapa yang menerima manfaat dan siapa yang menanggung biaya.",
        rows: [["Aspek", "Penerima manfaat", "Penanggung biaya"],
               ["Nilai tambah ekspor", "Penerimaan negara, investor", "Mitra dagang pengimpor bijih"],
               ["Lapangan kerja", "Pekerja lokal dan pendatang", "Ketegangan sosial di wilayah tertentu"],
               ["Emisi dari pembangkit batu bara", "Rantai pasok kendaraan listrik global", "Lingkungan dan warga sekitar"],
               ["Kecepatan pembangunan", "Pertumbuhan ekonomi daerah", "Standar keselamatan yang tertinggal"]] },
      { title: "Exhibit 2: Tiga Sikap Perusahaan",
        note: "Bahan pembanding untuk bagian Issues.",
        rows: [["Sikap", "Biaya relatif", "Risiko reputasi internasional", "Pengaruh pada industri"],
               ["Patuhi standar setempat", "Rendah", "Tinggi", "Tidak ada"],
               ["Terapkan standar internal lebih ketat", "Tinggi", "Rendah", "Terbatas"],
               ["Dorong standar bersama industri", "Menengah", "Rendah", "Besar bila berhasil"]] }
    ],
    questions: [
      "Kebijakan ini dinilai bertentangan dengan ketentuan perdagangan internasional tetapi didukung luas di dalam negeri. Bagaimana Anda menimbang kedaulatan kebijakan dan kewajiban perjanjian internasional?",
      "Exhibit 1 memperlihatkan manfaat dan biaya yang jatuh pada pihak berbeda. Prinsip keadilan apa yang relevan untuk menilai pola itu?",
      "Emisi dari pengolahan nikel di Indonesia menopang rantai kendaraan listrik global yang rendah emisi. Bagaimana tanggung jawab lingkungan seharusnya dibagi sepanjang rantai itu?",
      "Menerapkan standar lebih ketat daripada kewajiban setempat menaikkan biaya dibanding pesaing. Apakah keputusan itu dapat dipertahankan di hadapan pemegang saham?",
      "Mendorong regulasi yang lebih ketat bagi diri sendiri dan pesaing adalah bentuk lobi. Kapan lobi menjadi praktik yang sah dan kapan ia menjadi masalah etis?"
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai pertanyaan tentang standar mana yang mengikat perusahaan ketika standar setempat lebih longgar daripada standar internasional.",
      alternatives: "Juduli ketiga sikap dan sebutkan konsekuensi biaya, reputasi, dan pengaruh industrinya.",
      issues: "Bahas kedaulatan kebijakan, distribusi manfaat dan biaya lingkungan, keselamatan kerja, serta batas antara lobi yang sah dan tidak.",
      conclusion: "Ambil posisi, tetapkan standar internal yang konkret, dan jelaskan cara Anda mempertanggungjawabkannya kepada pemegang saham."
    }
  },

  {
    id: "bes12-skorkredit",
    title: "Skor Kredit yang Disusun Algoritma",
    subtitle: "Ketika keputusan yang memengaruhi hidup orang diambil oleh model yang tidak dapat dijelaskan",
    forSession: 12,
    readingTime: 6,
    officialSource: "Bacaan pendamping: Crane & Matten Bab 12 tentang perspektif masa depan dan etika teknologi; Undang-Undang Perlindungan Data Pribadi",
    decisionMaker: "Komite Risiko sebuah lembaga jasa keuangan yang menerapkan penilaian kredit berbasis kecerdasan buatan",
    decisionPoint: "Menentukan variabel yang boleh dipakai model dan tingkat penjelasan yang wajib diberikan kepada pemohon",
    relevance: "Kasus penutup yang menghubungkan tata kelola perusahaan, perlindungan data, dan etika teknologi.",
    sections: [
      { heading: "Model yang Bekerja Lebih Baik",
        body: `<p>Lembaga ini menggantikan penilaian kredit berbasis aturan sederhana dengan model pembelajaran mesin
yang memanfaatkan ratusan variabel, termasuk data perilaku dari aplikasi: pola pemakaian, jenis perangkat, waktu
pengajuan, dan riwayat transaksi digital. Model baru menurunkan angka gagal bayar sekaligus menyetujui lebih banyak
pemohon yang sebelumnya ditolak karena tidak memiliki riwayat kredit formal.</p>
<p>Bagi banyak orang, hasilnya positif: mereka memperoleh akses kredit pertama dalam hidupnya. Bagi lembaga,
hasilnya juga positif: risiko turun dan portofolio tumbuh.</p>
<p>Persoalan muncul ketika tim audit internal memeriksa pola penolakan. Ditemukan bahwa tingkat penolakan berbeda
secara mencolok antar-wilayah dan antar-kelompok tertentu, meskipun model tidak pernah diberi variabel suku, agama,
maupun jenis kelamin secara langsung. Variabel seperti kode pos, jenis perangkat, dan pola waktu aktivitas ternyata
berkorelasi kuat dengan atribut yang tidak boleh dipakai.</p>` },
      { heading: "Tiga Persoalan yang Terjalin",
        body: `<p>Persoalan pertama adalah <strong>bias tidak langsung</strong>. Model tidak melihat atribut yang
dilarang, tetapi menemukan penggantinya. Menghapus variabel yang mencurigakan sering menurunkan akurasi, sehingga
muncul pertukaran antara akurasi dan keadilan yang tidak dapat dihindari dengan cara teknis semata.</p>
<p>Persoalan kedua adalah <strong>keterjelasan</strong>. Ketika pemohon bertanya mengapa ditolak, jawaban yang
jujur adalah bahwa keputusan berasal dari kombinasi ratusan variabel yang tidak dapat diringkas menjadi satu alasan
sederhana. Padahal hak untuk memahami keputusan yang memengaruhi diri sendiri merupakan bagian dari perlakuan yang
layak.</p>
<p>Persoalan ketiga adalah <strong>persetujuan atas data</strong>. Pemohon menyetujui syarat penggunaan yang
mengizinkan pengumpulan data perilaku, tetapi hampir tidak ada yang membacanya, dan lebih sedikit lagi yang memahami
bahwa jenis perangkat mereka dapat memengaruhi persetujuan kredit. Undang-Undang Perlindungan Data Pribadi
menetapkan prinsip persetujuan yang sah dan pembatasan tujuan, yang menuntut lebih dari sekadar tanda centang.</p>` },
      { heading: "Usulan Komite Risiko",
        body: `<p>Beberapa langkah diusulkan: membatasi variabel hanya pada yang memiliki hubungan sebab yang dapat
dijelaskan dengan kemampuan membayar; menjalankan uji dampak berbeda secara berkala terhadap kelompok tertentu;
menyediakan alasan penolakan dalam bentuk faktor utama yang dapat dipahami; serta menetapkan bahwa penolakan dapat
ditinjau ulang oleh manusia atas permintaan pemohon.</p>
<p>Setiap langkah menurunkan akurasi model atau menaikkan biaya operasional.</p>` }
    ],
    exhibits: [
      { title: "Exhibit 1: Variabel dan Pertanyaan Etisnya",
        note: "Klasifikasikan tiap variabel sebelum memutuskan mana yang boleh dipakai.",
        rows: [["Variabel", "Daya prediksi", "Pertanyaan etis"],
               ["Riwayat pembayaran sebelumnya", "Tinggi", "Rendah, hubungan sebabnya jelas"],
               ["Penghasilan terverifikasi", "Tinggi", "Rendah"],
               ["Kode pos tempat tinggal", "Menengah", "Berpotensi menjadi pengganti atribut terlarang"],
               ["Jenis dan harga perangkat", "Menengah", "Menghukum orang berpenghasilan rendah"],
               ["Waktu pengajuan pada malam hari", "Rendah sampai menengah", "Hubungan sebabnya tidak jelas"]] },
      { title: "Exhibit 2: Pertukaran Akurasi dan Keadilan (ilustrasi)",
        note: "Angka ilustratif untuk memperlihatkan bentuk pertukaran, bukan hasil model tertentu.",
        rows: [["Konfigurasi model", "Akurasi relatif", "Selisih tingkat persetujuan antar-kelompok"],
               ["Seluruh variabel dipakai", "100", "Besar"],
               ["Variabel pengganti dihapus", "94", "Menengah"],
               ["Hanya variabel bersebab jelas", "88", "Kecil"]] }
    ],
    questions: [
      "Model tidak pernah diberi atribut terlarang tetapi menghasilkan perbedaan mencolok antar-kelompok. Apakah hasil itu tetap merupakan diskriminasi secara etis?",
      "Klasifikasikan variabel pada Exhibit 1 menjadi yang boleh, meragukan, dan tidak boleh dipakai. Pertahankan garis batas yang Anda tetapkan.",
      "Exhibit 2 memperlihatkan akurasi menurun ketika keadilan diutamakan. Bagaimana Anda menimbang pertukaran itu, dan siapa yang berhak memutuskannya?",
      "Pemohon menyetujui syarat penggunaan tanpa membacanya. Apakah persetujuan semacam itu memenuhi syarat persetujuan yang bermakna menurut prinsip perlindungan data pribadi?",
      "Rancang kebijakan tata kelola algoritma untuk lembaga ini, mencakup siapa yang bertanggung jawab, apa yang diaudit, dan hak apa yang dimiliki pemohon."
    ],
    guide: {
      problem: "Rumuskan dilemanya sebagai benturan antara akurasi model yang memperluas akses kredit dan keadilan serta keterjelasan bagi individu yang dinilai.",
      alternatives: "Juduli usulan kebijakan yang tersedia dan sebutkan dampaknya pada akurasi, biaya, dan hak pemohon.",
      issues: "Terapkan lensa hak atas perlakuan yang adil dan atas penjelasan, konsekuensi bagi kelompok yang terdampak, serta keabsahan persetujuan atas data.",
      conclusion: "Tetapkan aturan variabel dan mekanisme peninjauan oleh manusia, lalu sebutkan usulan yang Anda tolak beserta alasannya."
    }
  }
  ];
  C.cases = (C.cases || []).concat(cases).sort((a, b) => a.forSession - b.forSession);
})();
