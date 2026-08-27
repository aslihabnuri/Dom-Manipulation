const C = require("./common");
const { P, H1, H2, H3, EYEBROW, SPACER, RULEP, BULLETS, NUMS, TABLE, thead, trow, NOTE,
        buildDoc, TITLEBLOCK, AlignmentType, BLUE, INK, MUTE, PINK, GREEN, SANS, SERIF, CW } = C;
const fs = require("fs");

const A = "Aslih Abnuri", B = "Arfinal Diputra", R = "Rohana Dwi Hardianti";

const SLIDES = [
{ no: 1, title: "Judul dan pembuka", who: A, dur: "1 menit", clock: "00.00 sampai 01.00",
  lines: [
   "Selamat pagi Bapak Ibu dan teman-teman. Kami bertiga, Aslih Abnuri, Arfinal Diputra, dan Rohana Dwi Hardianti, akan membahas Bab 3 buku Crane dan Matten, Evaluating Business Ethics: Normative Ethical Theories.",
   "Bab ini menjawab satu pertanyaan yang kelihatan sederhana. Ketika kita menyebut sebuah keputusan bisnis itu etis atau tidak etis, apa dasar penilaiannya. Dalam urusan pribadi intuisi biasanya sudah cukup. Dalam konteks bisnis, penilaian itu harus bisa dipertahankan di hadapan pemegang saham, regulator, pekerja, dan masyarakat sekitar.",
   "Bab 3 memberikan sembilan kriteria penilaian. Sembilan kriteria itu yang akan kami pakai untuk menguji satu kebijakan yang masih berjalan sampai hari ini, yaitu hilirisasi nikel Indonesia.",
   "Waktu kami tiga puluh menit, dengan pembagian tujuh belas menit untuk teori, sebelas menit untuk kasus, dan dua menit untuk penutup."],
  cue: "Lanjut ke slide 2 sambil mengatakan: sebelum masuk, saya sampaikan dulu alur pembahasannya." },

{ no: 2, title: "Sistematika pembahasan", who: A, dur: "30 detik", clock: "01.00 sampai 01.30",
  lines: [
   "Presentasi ini terbagi dua. Bagian pertama membangun kerangka penilaian: peran teori normatif, posisi absolutisme sampai pluralisme, klasifikasi sembilan teori, lima teori modernis Barat, keterbatasannya, lalu empat teori alternatif.",
   "Bagian kedua menerapkan kerangka itu pada hilirisasi nikel: anatomi kebijakan dan sengketanya, dua narasi atas fakta yang sama, penilaian sembilan teori, sintesis, dan implikasi manajerial.",
   "Urutan ini kami pilih dengan sengaja. Kalau kasusnya dibahas lebih dulu, diskusi biasanya berhenti pada adu data. Teori memberi alat untuk menilai data yang sama secara berbeda."],
  cue: "Jangan berlama-lama di slide ini. Cukup tunjukkan peta jalannya, lalu langsung lanjut." },

{ no: 3, title: "Mengapa teori normatif diperlukan", who: A, dur: "1 menit 30 detik", clock: "01.30 sampai 03.00",
  lines: [
   "Crane dan Matten mendefinisikan teori etika normatif sebagai aturan, pedoman, prinsip, dan pendekatan yang menentukan benar dan salah. Ada tiga alasan mengapa teori semacam ini diperlukan.",
   "Pertama, rasionalisasi intuisi moral. Teori tidak menggantikan intuisi, ia merapikannya. Kita sudah punya perasaan tentang mana yang benar dan mana yang salah, dan teori membantu menjelaskan mengapa perasaan itu muncul.",
   "Kedua, dasar diskusi rasional. Ketika dua pihak berangkat dari nilai yang berbeda, teori memungkinkan keduanya berdebat pada tataran argumen, bukan berhenti pada tataran selera.",
   "Ketiga, justifikasi keputusan bisnis. Keputusan perusahaan menuntut dasar yang sistematis dan dapat dipertanggungjawabkan kepada pemangku kepentingan.",
   "Satu pembeda yang penting di sini. Ada bedanya antara mengatakan praktik di negara lain itu berbeda, dengan mengatakan praktik itu salah. Yang pertama pengamatan, yang kedua penilaian. Teori normatif bekerja pada yang kedua."],
  cue: "Kalimat pembeda di akhir adalah pemantik. Beri jeda sebentar sebelum pindah slide." },

{ no: 4, title: "Absolutisme, relativisme, pluralisme", who: A, dur: "1 menit 15 detik", clock: "03.00 sampai 04.15",
  lines: [
   "Sebelum menerapkan teori apa pun, ada satu hal yang perlu ditetapkan lebih dulu, yaitu seberapa luas klaim keberlakuan yang diajukan teori itu.",
   "Absolutisme etis berpandangan ada prinsip moral yang universal dan abadi. Benar dan salah adalah kualitas objektif yang ditentukan lewat nalar, terlepas dari keadaan. Hampir seluruh teori modernis Barat berada di posisi ini.",
   "Relativisme etis mengambil posisi sebaliknya. Tidak ada benar dan salah yang universal. Semuanya bergantung pada tradisi, keyakinan, dan praktik pihak yang memutuskan.",
   "Crane dan Matten sendiri memilih posisi ketiga, yaitu pluralisme etis. Nilai yang bertentangan dapat sama sahnya. Pluralisme tidak menyamaratakan seluruh perspektif, tetapi juga tidak mengunggulkan satu di atas yang lain.",
   "Contoh yang biasa dipakai adalah suap. Absolutis mengatakan selalu salah. Relativis mengatakan tergantung negaranya. Pluralis bertanya kriteria mana yang paling kuat menanggung beban argumen dalam situasi tersebut."],
  cue: "Posisi pluralis ini penting, karena seluruh bagian kasus nanti berdiri di atasnya." },

{ no: 5, title: "Klasifikasi sembilan teori", who: A, dur: "1 menit 15 detik", clock: "04.15 sampai 05.30",
  lines: [
   "Sembilan teori dalam Bab 3 dibagi ke dalam dua klasifikasi.",
   "Klasifikasi pertama adalah teori modernis Barat. Berakar pada Pencerahan abad kedelapan belas, bersifat absolutis, dan menawarkan aturan yang dapat diterapkan pada situasi apa pun. Di dalamnya ada dua kelompok. Kelompok konsekuensialis atau teleologis menilai akibat tindakan, isinya egoism dan utilitarianism. Kelompok berbasis prinsip atau deontologis menilai kewajiban, isinya ethics of duty, ethics of rights, serta justice dan social contract.",
   "Klasifikasi kedua adalah teori alternatif. Cenderung relativis dan lahir dari keberatan atas klasifikasi pertama. Isinya virtue ethics yang menilai karakter pelaku, ethic of care yang menilai relasi, discourse ethics yang menilai prosedur, dan postmodern ethics yang menilai bahasa.",
   "Satu catatan yang perlu digarisbawahi. Kesembilan teori ini bersifat normatif karena berangkat dari asumsi tentang hakikat dunia dan hakikat manusia. Menerima kesimpulannya berarti menerima asumsinya terlebih dahulu.",
   "Mohon nomor urut satu sampai sembilan ini diingat, karena matriks pada bagian kasus memakai nomor yang sama."],
  cue: "Serah terima ke Arfinal. Kalimat penyerahan: kelima teori modernis akan dibahas oleh Arfinal." },

{ no: 6, title: "Ethical egoism", who: B, dur: "1 menit 15 detik", clock: "05.30 sampai 06.45",
  lines: [
   "Teori nomor satu, ethical egoism. Ini teori tertua sekaligus yang paling diperdebatkan, sampai sebagian penulis menolak mengategorikannya sebagai teori moral.",
   "Definisinya, sebuah tindakan benar secara moral jika dalam situasi tersebut semua pengambil keputusan secara bebas memilih mengejar keinginan jangka pendek atau kepentingan jangka panjangnya.",
   "Yang sering tertukar, egoisme bukan keserakahan. Pelaku egois masih dapat tergerak oleh rasa iba. Pelaku serakah tidak peka pada kepentingan pihak lain sama sekali.",
   "Tokohnya Thomas Hobbes dalam Leviathan, yang menyebut keadaan alamiah sebagai perang semua melawan semua, dan Ayn Rand dalam The Virtue of Selfishness.",
   "Keterbatasannya, teori ini hanya berlaku bila pasar mencegah satu pelaku merugikan pelaku lain. Ia gugur pada kegagalan pasar dan isu keberlanjutan, sebab korban penipisan sumber daya adalah generasi mendatang yang belum dapat ikut bertransaksi.",
   "Saya minta jangan buru-buru menolak teori ini. Versi jangka panjangnya, yang disebut enlightened egoism, justru memberi kritik paling tajam pada kasus nikel nanti."],
  cue: "Nada bicara jangan defensif. Egoism di sini istilah teknis, bukan celaan." },

{ no: 7, title: "Utilitarianism", who: B, dur: "1 menit 30 detik", clock: "06.45 sampai 08.15",
  lines: [
   "Teori nomor dua, utilitarianism. Ini teori yang paling lazim diterapkan dalam bisnis karena kompatibel dengan metodologi kuantitatif ekonomi.",
   "Definisinya dari Bentham dan Mill. Sebuah tindakan benar secara moral jika menghasilkan kebaikan terbesar bagi jumlah orang terbesar yang terkena dampaknya.",
   "Ada empat ciri pokok. Consequentialism, yang dinilai akibatnya. Hedonism, kebaikan diukur sebagai pleasure dikurangi pain. Maximalism, yang dicari akibat bersih terbesar. Universalism, akibat bagi semua pihak wajib ikut dihitung.",
   "Bagian terpenting dari slide ini adalah pembedaan act dan rule. Act utilitarianism menilai satu tindakan tunggal. Rule utilitarianism menilai kelas tindakan dan prinsip di baliknya dalam jangka panjang. Keduanya sama-sama utilitarianism, tetapi keduanya dapat menghasilkan kesimpulan yang berlawanan atas fakta yang sama. Mohon diingat, karena persis itu yang terjadi pada kasus nikel.",
   "Keberatannya ada empat. Subjektivitas dalam menilai utilitas, pembobotan yang menyamakan semua orang, kesulitan kuantifikasi, dan distribusi utilitas yang mengabaikan minoritas serta generasi mendatang."],
  cue: "Beri penekanan suara pada kalimat act dan rule. Ini titik yang akan dipanggil kembali di slide 17." },

{ no: 8, title: "Ethics of duty, Immanuel Kant", who: B, dur: "1 menit 30 detik", clock: "08.15 sampai 09.45",
  lines: [
   "Teori nomor tiga, ethics of duty dari Immanuel Kant. Di sini yang dinilai bukan akibat, melainkan prinsip di balik tindakan dan motivasi pelakunya.",
   "Kewajiban dalam pengertian Kant bersifat abstrak dan tidak berubah, dirumuskan lewat aturan moral a priori yang dideduksi secara rasional dan berlaku pada semua persoalan etis.",
   "Formulasi pertama, universal acceptability. Terima sebuah hukum moral hanya bila semua makhluk berakal budi juga dapat menerimanya. Contoh dari Kant sendiri adalah mengingkari utang. Bila semua orang boleh mengingkari utang, lembaga utang piutang bubar, sehingga maksimnya membatalkan dirinya sendiri.",
   "Formulasi kedua, respect for persons. Perlakukan manusia sebagai tujuan, jangan pernah sekadar sebagai sarana. Inilah dasar etis dari stakeholder theory.",
   "Cara cepat memakai Kant, sebutkan maksim tindakannya dalam satu kalimat, lalu universalkan. Bila maksimnya membatalkan dirinya sendiri, tindakan itu gagal.",
   "Keberatannya ada tiga. Kriteria motivasinya terlalu sempit, akibat diabaikan sepenuhnya, dan asumsi rasionalitas penuh bersifat idealistis."],
  cue: "Cara cepat memakai Kant sebaiknya diucapkan pelan, karena akan dipakai langsung pada slide 17." },

{ no: 9, title: "Ethics of rights", who: B, dur: "1 menit 15 detik", clock: "09.45 sampai 11.00",
  lines: [
   "Teori nomor empat, ethics of rights. Pendekatan ini yang paling banyak dipakai secara praktis karena sudah melembaga dalam instrumen internasional.",
   "Hak asasi didefinisikan sebagai hak dasar yang melekat, tidak dapat dicabut, dan tidak bersyarat, yang dimiliki semua manusia tanpa kecuali. John Locke merumuskan natural rights atas hidup, kebebasan, dan milik.",
   "Satu hal yang sering terlewat, hak seseorang selalu menimbulkan kewajiban pada pihak lain. Hak atas air bersih berarti ada pihak yang berkewajiban tidak mencemari.",
   "Dalam praktik bisnis rujukannya adalah UN Guiding Principles tahun 2011. Negara melindungi, bisnis menghormati, dan peradilan menyediakan pemulihan bagi korban.",
   "Yang menentukan untuk kasus kami adalah soal cakupan. Perusahaan wajib meredakan dampak buruk yang terkait lewat relasi bisnisnya, sekalipun ia tidak ikut menyebabkannya. Pemasok termasuk di dalamnya. Inilah yang menghubungkan pembeli kendaraan listrik di Eropa dengan apa yang terjadi di Halmahera."],
  cue: "Kalimat terakhir menjembatani teori ke kasus. Ucapkan dengan tempo agak lambat." },

{ no: 10, title: "Justice dan kontrak sosial", who: B, dur: "1 menit 15 detik", clock: "11.00 sampai 12.15",
  lines: [
   "Teori nomor lima, justice. Di sini pertanyaannya bergeser, dari benar atau salah menjadi susunan seperti apa yang layak disepakati bersama.",
   "Keadilan didefinisikan sebagai perlakuan yang adil terhadap setiap orang dalam satu situasi, sehingga semua pihak memperoleh apa yang memang menjadi haknya.",
   "Ada dua dimensi. Keadilan prosedural menilai siapa yang berhak turut memutuskan. Keadilan distributif menilai ke mana manfaat mengalir dan siapa yang menanggung bebannya.",
   "John Rawls memberi dua prinsip. Pertama, kebebasan dasar yang setara bagi semua. Kedua, ketimpangan hanya dibenarkan bila susunan itu paling menguntungkan pihak yang paling tidak diuntungkan.",
   "Alat yang paling mudah dipakai adalah veil of ignorance. Bayangkan Anda harus memilih kebijakan tanpa mengetahui Anda akan lahir sebagai pemegang saham smelter atau sebagai warga di hilir sungai. Kebijakan mana yang Anda pilih?",
   "Turunan lainnya adalah teori kontrak sosial dari Hobbes, Locke, dan Rousseau. Versi bisnisnya Integrative Social Contracts Theory dari Donaldson dan Dunfee, yang memadukan hypernorms dengan kontrak mikro komunitas."],
  cue: "Pertanyaan veil of ignorance boleh dilempar ke kelas, tetapi jangan tunggu jawaban. Serah terima ke Rohana." },

{ no: 11, title: "Enam keterbatasan teori modernis", who: R, dur: "1 menit", clock: "12.15 sampai 13.15",
  lines: [
   "Kelima teori tadi memiliki enam keberatan yang tercatat dalam bab ini.",
   "Satu, abstraksi berlebih. Prinsipnya beroperasi pada tataran yang jauh dari persoalan konkret yang dihadapi manajer.",
   "Dua, reduksionisme. Setiap teori menonjolkan satu dimensi moralitas dan memperlakukannya sebagai keseluruhan.",
   "Tiga, objektivisme elitis. Kebenaran moral ditentukan melalui deduksi ahli, bukan melalui pengalaman pihak yang terlibat.",
   "Empat, impersonalitas. Ikatan personal dan tanggung jawab pada pihak tertentu justru diposisikan sebagai pengganggu penilaian.",
   "Lima, rasionalisme terkodifikasi. Peran perasaan, empati, dan dorongan moral diabaikan dalam perumusan penilaian etis.",
   "Enam, imperialisme kultural. Pengalaman dan tradisi intelektual Barat diposisikan sebagai ukuran yang berlaku universal.",
   "Keberatan nomor tiga sampai lima yang paling menentukan bagi kasus nikel, karena warga terdampak memang tidak pernah menjadi pihak dalam perumusan kebijakan."],
  cue: "Enam butir ini cukup dibacakan cepat. Yang penting kalimat penutupnya." },

{ no: 12, title: "Virtue ethics dan ethic of care", who: R, dur: "1 menit 30 detik", clock: "13.15 sampai 14.45",
  lines: [
   "Dari keberatan tadi lahir empat teori alternatif. Dua yang pertama menggeser objek penilaian.",
   "Virtue ethics, teori nomor enam. Pertanyaannya bukan tindakan mana yang benar, melainkan pelaku seperti apa yang layak disebut baik pada posisi ini. Akarnya Aristoteles dalam Nicomachean Ethics, lalu MacIntyre dan Solomon. Moralitas lahir dari karakter yang dibentuk lewat pembiasaan, bukan dari aturan, dan tujuannya eudaimonia, hidup yang baik. Dalam bisnis, perusahaan dipandang sebagai komunitas praktik dengan keutamaan berupa kejujuran, keadilan, kepercayaan, dan ketangguhan. Keterbatasannya, keutamaan selalu ditentukan komunitas tertentu sehingga sulit dijadikan ukuran lintas budaya.",
   "Virtue ethics sering disalahpahami sebagai sekadar imbauan moral. Sebenarnya ia mengajukan satu pertanyaan yang tajam: dibandingkan dengan apa kita menyebut sesuatu sudah cukup baik?",
   "Ethic of care, teori nomor tujuh, dari Carol Gilligan dan Nel Noddings, berakar pada etika feminis. Manusia dipandang sebagai makhluk yang saling bergantung dan terjalin dalam relasi, bukan individu rasional yang terpisah. Yang dituntut empati, keselarasan, menghindari kerugian, dan tanggung jawab konkret pada orang tertentu, bukan aturan yang seragam. Keterbatasannya, prioritas pada pihak terdekat berisiko mengabaikan pihak yang jauh."],
  cue: "Pertanyaan pembanding pada virtue ethics akan dipakai lagi di slide 18. Tandai." },

{ no: 13, title: "Discourse ethics dan postmodern ethics", who: R, dur: "1 menit 30 detik", clock: "14.45 sampai 16.15",
  lines: [
   "Dua teori alternatif berikutnya menggeser objek penilaian lebih jauh lagi.",
   "Discourse ethics, teori nomor delapan, dari Jurgen Habermas bersama Karl Otto Apel. Norma tidak ditetapkan filsuf dari luar, melainkan dihasilkan dialog rasional antara semua pihak terdampak. Syaratnya disebut ideal speech situation. Semua pihak boleh ikut, bebas paksaan, dan argumen dinilai dari kekuatannya sendiri, bukan dari kekuasaan pengusulnya. Orientasinya penyelesaian konflik secara damai, bukan pembuktian satu kebenaran.",
   "Konsekuensinya penting. Prosedur yang cacat sudah cukup untuk membatalkan hasilnya, sekalipun hasil itu tampak baik.",
   "Postmodern ethics, teori nomor sembilan, dari Zygmunt Bauman dengan latar pemikiran Derrida dan Lyotard. Dorongan moral dan perasaan didahulukan atas perhitungan rasional. Kritiknya diarahkan pada organisasi. Prosedur, pembagian tugas, dan jarak birokratis menciptakan jarak moral yang menumpulkan dorongan itu. Sikap yang dituntut adalah mempertanyakan bahasa dan asumsi yang sudah dianggap wajar, lalu bertindak pada skala lokal tempat akibatnya dirasakan.",
   "Teori inilah yang nanti membongkar istilah nikel hijau."],
  cue: "Kalimat penutup adalah kail untuk slide 18 dan 19. Ucapkan dengan jelas." },

{ no: 14, title: "Sembilan pertanyaan penilaian", who: R, dur: "45 detik", clock: "16.15 sampai 17.00",
  lines: [
   "Sebelum masuk ke kasus, kami rangkum kesembilan teori menjadi sembilan pertanyaan penilaian. Silakan difoto, karena selama bagian kasus teman-teman dapat menandai sendiri jawabannya sebelum kami bahas.",
   "Intinya, tidak ada satu teori yang memberikan jawaban lengkap. Pendekatan pluralis Bab 3 menghasilkan sembilan penilaian atas rangkaian fakta yang identik, lalu yang dicari adalah arah konvergensinya, bukan satu jawaban tunggal."],
  cue: "Beri jeda tiga detik supaya kelas sempat memotret. Serah terima ke Aslih." },

{ no: 15, title: "Anatomi kebijakan hilirisasi nikel", who: A, dur: "2 menit", clock: "17.00 sampai 19.00",
  lines: [
   "Masuk ke bagian kedua. Kebijakannya hanya satu instrumen regulasi, tetapi mengubah struktur industri nikel nasional.",
   "Instrumennya Peraturan Menteri ESDM Nomor 11 Tahun 2019, yang melarang ekspor bijih nikel dan berlaku efektif 1 Januari 2020. Mekanismenya, bijih wajib diolah di dalam negeri dan kepemilikan smelter menjadi syarat masuk kawasan industri. Sengketanya, panel WTO memutus kebijakan ini melanggar aturan perdagangan pada November 2022.",
   "Kronologinya, larangan pertama sudah ada pada 2014 lalu direlaksasi, Permen ESDM Nomor 11 terbit pada 2019, berlaku efektif pada 2020, panel WTO memenangkan Uni Eropa pada 2022, dan pada 2025 nilai ekspor produk olahan mencapai 40 miliar dolar.",
   "Yang membuat kasus ini layak dibahas dalam mata kuliah etika bisnis adalah struktur biayanya. Manfaatnya besar, terukur, dan terkonsentrasi. Bebannya tersebar, tertunda, dan sulit dikuantifikasi. Persoalan dengan struktur seperti ini tidak dapat diselesaikan melalui satu kriteria penilaian saja.",
   "Perlu kami sampaikan juga, kebijakannya masih berjalan dan sengketa dagangnya belum tuntas. Justru kasus yang belum selesai yang paling layak didiskusikan di kelas."],
  cue: "Sebutkan bahwa data ditelusuri Agustus 2026, supaya angkanya jelas berbatas waktu. Serah terima ke Rohana." },

{ no: 16, title: "Dua narasi atas fakta yang sama", who: R, dur: "2 menit", clock: "19.00 sampai 21.00",
  lines: [
   "Slide ini memuat dua kolom yang sama-sama bersandar pada data resmi.",
   "Kolom pendukung memakai bingkai hilirisasi berdaulat. Nilai ekspor produk nikel olahan 40 miliar dolar pada 2025, naik dari 3 miliar dolar pada 2020. Investasi terkumpul di kawasan IMIP Morowali 41,5 miliar dolar sampai Desember 2025. Tenaga kerja terserap 166 ribu orang di IMIP dan IWIP, dari 35.952 orang pada 2020. Dan Indonesia menjadi simpul utama rantai pasok baterai dunia.",
   "Kolom penentang memakai bingkai ekstraksi berbiaya sosial. Upah pokok 3 sampai 3,6 juta rupiah per bulan, di bawah upah minimum Morowali 2025 yang sebesar 3,7 juta. Tercatat 107 pekerja meninggal beserta 155 pekerja luka pada 104 kecelakaan smelter sepanjang 2019 sampai 2025. Tutupan pohon hilang 163 ribu hektare di Halmahera, dan industri nikel memegang 76 persen pembangkit listrik tenaga uap. Nilai tambah yang tinggal di Morowali hanya 4,35 persen, sementara kemiskinannya 12,58 persen.",
   "Ada pula beban yang sama sekali tidak masuk neraca ekspor. Sungai Ake Jira tidak lagi layak dipakai warga, dan 40 persen wilayah adat O Hongana Manyawa sudah berizin tambang.",
   "Mohon angkanya tidak diperdebatkan. Kedua kolom ini benar. Justru itu yang membuat kasus ini membutuhkan sembilan kriteria, bukan satu."],
  cue: "Bacakan kolom kiri lebih dahulu sampai selesai, baru kolom kanan. Jangan berpindah bolak-balik." },

{ no: 17, title: "Penilaian lima teori modernis", who: B, dur: "3 menit", clock: "21.00 sampai 24.00",
  lines: [
   "Sekarang rangkaian fakta tadi kita uji dengan lima teori modernis.",
   "Egoism, hasilnya netral. Pada horizon pendek kebijakan ini jelas melayani kepentingan Indonesia. Namun pada horizon panjang, biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit batu bara belum diinternalisasi. Justru kepentingan diri yang dihitung cermat menuntut biaya tertunda itu masuk sejak awal.",
   "Utilitarianism, hasilnya ambivalen, dan ini bagian terpenting dari slide ini. Act utilitarianism cenderung mendukung, sebab manfaat 166 ribu lapangan kerja nyata dan terukur sedangkan kerugiannya tersebar. Rule utilitarianism justru menolak, sebab bila setiap negara pemilik cadangan menempuh pengolahan bertenaga batu bara, tambahan emisinya membatalkan manfaat transisi energi yang justru menjadi pembenarnya. Keduanya utilitarianism, kesimpulannya berlawanan, dan pembedanya hanya unit analisis.",
   "Ethics of duty, menolak. Maksimnya berbunyi, pengolahan boleh dipercepat sambil menunda standar upah, keselamatan, dan lingkungan. Bila maksim itu diuniversalkan, standarnya kehilangan daya ikat. Formulasi kedua juga gagal, sebab upah di bawah minimum dan lembur sampai 13 jam menjadikan pekerja sarana semata.",
   "Ethics of rights, bersyarat. Hak atas pekerjaan terpenuhi bagi 166 ribu pekerja, dan sampai titik itu kebijakan ini dapat dipertahankan. Namun hak atas kondisi kerja yang adil, kesehatan, air bersih, dan tanah leluhur terlanggar bersamaan. UNGP menuntut penghormatan pada seluruh relasi bisnis, bukan hanya pada operasi sendiri.",
   "Justice, menolak. Manfaat mengalir ke penerimaan nasional dan pemodal, sedangkan beban terkonsentrasi pada pekerja kawasan, warga hilir sungai, dan masyarakat adat. Kabupaten penghasil justru lebih miskin daripada rata-rata provinsinya, dan hanya 4,35 persen nilai tambah yang tinggal di daerah."],
  cue: "Slide terpanjang. Jaga tempo, satu teori sekitar tiga puluh detik. Tekankan bagian act dan rule." },

{ no: 18, title: "Penilaian empat teori alternatif", who: R, dur: "2 menit 15 detik", clock: "24.00 sampai 26.15",
  lines: [
   "Empat teori alternatif menilai rangkaian fakta yang sama, tetapi dari sudut yang berbeda.",
   "Virtue ethics menolak pembandingnya. Selama ini pembandingnya adalah keadaan sebelum hilirisasi, bukan standar industri terbaik yang tersedia hari ini. Aktor yang berkarakter baik mengukur diri pada standar tertinggi yang dapat dicapai, bukan pada keadaan masa lalunya sendiri.",
   "Ethic of care menuntut pemulihan. Warga hilir sungai dan sekitar 300 sampai 500 jiwa O Hongana Manyawa adalah pihak yang berelasi, bukan variabel biaya. Perlu digarisbawahi, ethic of care tidak menolak kebijakan ini. Yang dituntut adalah pemulihan sungai dan wilayah lindung, bukan penghentian mendadak. Ini contoh baik bahwa pluralisme tidak berarti semua teori berkata sama.",
   "Discourse ethics menolak prosedurnya. Warga terdampak bukan pihak dalam perumusan kebijakan maupun perizinan kawasan. Syarat keterlibatan setara tidak terpenuhi, dan cacat prosedur sudah cukup untuk membatalkan keabsahan hasilnya.",
   "Postmodern ethics membacanya secara relativistik. Hilirisasi berkonotasi kemajuan, ekstraksi berkonotasi pengurasan, padahal keduanya menamai peristiwa yang sama. Dan istilah nikel hijau dipakai bagi pengolahan yang listriknya justru bertumpu pada batu bara."],
  cue: "Kalimat ethic of care tidak menolak kebijakan sering menarik pertanyaan. Siapkan penjelasannya." },

{ no: 19, title: "Sintesis penilaian dan evaluasi klaim", who: R, dur: "1 menit 45 detik", clock: "26.15 sampai 28.00",
  lines: [
   "Bila kesembilan penilaian tadi dikumpulkan, hasilnya enam menolak, satu bersyarat, satu ambivalen, dan satu netral karena teorinya sendiri mengakui keterbatasannya. Tidak satu pun memberikan dukungan tanpa syarat.",
   "Dari kesembilan penilaian itu kami menarik empat proposisi.",
   "Pertama, perbandingan dengan masa lalu tidak bernilai normatif. Kondisi yang lebih baik daripada ekspor bijih mentah tidak dengan sendirinya memadai.",
   "Kedua, klaim hijau gugur pada sumber energinya. Pengolahan yang bertumpu pada pembangkit batu bara di dalam kawasan tidak dapat disebut hijau.",
   "Ketiga, distribusi manfaat dan bebannya timpang. Hanya 4,35 persen nilai tambah tinggal di daerah, sementara kabupaten penghasil lebih miskin daripada rata-rata provinsinya.",
   "Keempat, prosesnya cacat sejak perumusan. Warga terdampak tidak menjadi pihak dalam perizinan dan perencanaan kawasan.",
   "Satu hal yang perlu ditegaskan. Penolakan atas klaim nikel hijau tidak setara dengan penolakan atas hilirisasi. Keduanya persoalan yang terpisah."],
  cue: "Kalimat penegasan terakhir adalah inti kontribusi kelompok. Serah terima ke Aslih." },

{ no: 20, title: "Simpulan dan implikasi manajerial", who: A, dur: "1 menit 45 detik", clock: "28.00 sampai 29.45",
  lines: [
   "Ada tiga temuan dari pengujian ini.",
   "Satu, konvergensi, bukan kesepakatan. Sembilan teori berangkat dari premis yang berbeda, namun mayoritasnya bermuara pada arah yang sama. Inilah bukti terkuat bagi pluralisme yang diajukan Crane dan Matten.",
   "Dua, yang gugur adalah klaim etisnya, bukan kebijakannya. Upah, keselamatan, lingkungan, dan sumber energinya seluruhnya tetap terbuka untuk diperbaiki.",
   "Tiga, kasusnya masih berlangsung. Kebijakannya masih berjalan, sengketa dagangnya belum tuntas, dan angkanya berubah tiap tahun.",
   "Implikasi manajerialnya ada tiga. Pertama, internalisasi biaya tertunda. Biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit masuk neraca sejak tahap perencanaan. Kedua, pelibatan pihak yang absen. Pekerja, warga hilir, dan masyarakat adat diberi keterwakilan formal dalam panitia keselamatan dan perizinan. Ketiga, pengujian multiteori. Klaim yang lolos utilitarianism kerap gugur pada keadilan distributif dan discourse ethics.",
   "Kami tutup dengan satu kalimat. Manfaat yang terukur selalu lebih mudah dipertahankan daripada beban yang tersebar. Justru karena itu, beban yang tersebar perlu dihitung lebih dahulu."],
  cue: "Kalimat penutup diucapkan pelan dan berhenti sejenak sebelum pindah ke slide terakhir." },

{ no: 21, title: "Penutup", who: A, dur: "15 detik", clock: "29.45 sampai 30.00",
  lines: [
   "Terima kasih atas perhatian Bapak Ibu dan teman-teman. Kami buka untuk pertanyaan dan diskusi."],
  cue: "Ketiga anggota berdiri menghadap kelas selama sesi tanya jawab." }
];

const QA = [
 ["Kalau enam dari sembilan teori menolak, apakah kesimpulan kelompok adalah hilirisasi harus dihentikan?",
  "Tidak. Yang gugur adalah klaim bahwa kebijakan ini sudah etis, bukan kebijakan hilirisasinya. Perhatikan bahwa bentuk penolakan setiap teori berbeda. Ethics of duty menolak maksimnya, justice menolak distribusinya, discourse ethics menolak prosedurnya, dan ethic of care justru meminta pemulihan, bukan penghentian. Empat objek penolakan itu semuanya dapat diperbaiki tanpa membatalkan kebijakan."],
 ["Bukankah semua industri baru memang seperti itu pada tahap awal?",
  "Argumen itu memakai masa lalu sebagai pembanding. Virtue ethics justru mempersoalkan pilihan pembanding tersebut. Pertanyaannya bukan apakah keadaan hari ini lebih baik daripada ekspor bijih mentah, melainkan apakah sudah setara dengan standar industri terbaik yang tersedia hari ini. Teknologi tungku, sistem keselamatan, dan pasokan listrik rendah karbon sudah ada dan dipakai di tempat lain."],
 ["Panel WTO sudah memutus kebijakan ini melanggar. Apakah itu berarti tidak etis?",
  "Tidak otomatis. Legalitas dan etika dua penilaian yang berbeda, dan Bab 3 justru dibuka dengan pembedaan itu. Putusan WTO menilai kepatuhan pada aturan perdagangan, sedangkan penilaian kami menyangkut distribusi manfaat, kondisi kerja, dan keterwakilan pihak terdampak. Sebuah kebijakan bisa saja sah secara hukum dagang namun tetap bermasalah secara etis, dan sebaliknya."],
 ["Bukankah menuntut standar Eropa pada Indonesia itu justru imperialisme kultural?",
  "Keberatan itu memang tercatat sebagai keterbatasan nomor enam dalam bab ini. Karena itu argumen kami tidak bersandar pada standar Eropa, melainkan pada standar yang sudah diakui Indonesia sendiri, yaitu upah minimum Morowali, peraturan keselamatan kerja nasional, dan komitmen iklim Indonesia. Sen (2000) juga menunjukkan bahwa nilai seperti keselamatan dan suara warga tidak eksklusif milik satu tradisi budaya."],
 ["Angka 166 ribu lapangan kerja itu besar. Apakah utilitarianism tidak cukup untuk membenarkan?",
  "Act utilitarianism memang cenderung membenarkan. Persoalannya ada dua. Pertama, rule utilitarianism menghasilkan kesimpulan sebaliknya bila kebijakan ini diperlakukan sebagai kelas tindakan yang ditiru semua negara pemilik cadangan. Kedua, keberatan klasik terhadap utilitarianism adalah distribusi. Angka agregat yang positif dapat menyembunyikan kerugian berat pada kelompok kecil, dan di sini kelompok kecil itu adalah pekerja kawasan serta masyarakat adat."],
 ["Apa yang paling realistis dilakukan manajemen dalam waktu dekat?",
  "Tiga hal pada slide 20. Memasukkan biaya kesehatan, pemulihan sungai, dan pensiun dini pembangkit ke dalam neraca sejak perencanaan. Memberi keterwakilan formal kepada pekerja, warga hilir, dan masyarakat adat dalam panitia keselamatan dan proses perizinan. Serta menguji setiap klaim keberlanjutan dengan lebih dari satu teori, karena klaim yang lolos utilitarianism kerap gugur pada keadilan distributif dan discourse ethics."],
 ["Mengapa perlu sembilan teori, tidak cukup satu?",
  "Karena struktur kasusnya. Manfaatnya terukur dan terkonsentrasi, bebannya tersebar dan tertunda. Kriteria tunggal cenderung hanya menangkap salah satu sisi. Justru ketika sembilan teori dengan premis berbeda bermuara pada arah yang sama, kesimpulannya menjadi jauh lebih kuat daripada kesimpulan satu teori."],
 ["Dari mana angka-angka pada bagian kasus diambil?",
  "Dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, dan dokumen putusan panel WTO, ditelusuri pada Agustus 2026. Perlu kami sampaikan bahwa kasus ini masih berjalan, sehingga sebagian angka akan berubah pada tahun berikutnya."]
];

const ANGKA = [
 ["40 miliar dolar", "Nilai ekspor produk nikel olahan pada 2025, naik dari 3 miliar dolar pada 2020"],
 ["41,5 miliar dolar", "Investasi terkumpul di kawasan IMIP Morowali sampai Desember 2025"],
 ["166 ribu pekerja", "Terserap di IMIP dan IWIP, dari 35.952 orang pada 2020"],
 ["3 sampai 3,6 juta", "Upah pokok per bulan, di bawah upah minimum Morowali 2025 sebesar 3,7 juta"],
 ["107 dan 155", "Pekerja meninggal dan pekerja luka pada 104 kecelakaan smelter, 2019 sampai 2025"],
 ["163 ribu hektare", "Tutupan pohon yang hilang di Halmahera"],
 ["76 persen", "Porsi pembangkit listrik tenaga uap yang dipegang industri nikel"],
 ["4,35 persen", "Nilai tambah yang tinggal di Morowali, dengan kemiskinan 12,58 persen"],
 ["13 jam", "Durasi lembur yang tercatat pada kawasan pengolahan"],
 ["300 sampai 500 jiwa", "Perkiraan populasi O Hongana Manyawa yang terdampak"],
 ["40 persen", "Wilayah adat O Hongana Manyawa yang sudah berizin tambang"],
 ["November 2022", "Panel WTO memutus kebijakan larangan ekspor melanggar aturan perdagangan"]
];

/* ================= susun dokumen ================= */
const kids = [];
kids.push.apply(kids, TITLEBLOCK(
  "SKRIP PRESENTASI  |  MAN5522 BUSINESS ETHICS FOR SUSTAINABILITY",
  "Evaluating Business Ethics: Normative Ethical Theories",
  "Naskah pembawaan untuk 21 slide, dengan studi kasus hilirisasi nikel Indonesia"));

const idW = [1900, CW - 1900];
kids.push(TABLE(idW, [
  trow(["Mata kuliah", "Business Ethics for Sustainability (MAN5522), MBA Universitas Gadjah Mada"], idW),
  trow(["Rujukan utama", "Crane, A., Matten, D., Glozer, S., dan Spence, L. (2019). Business Ethics, edisi kelima, Bab 3"], idW),
  trow(["Penyusun", "Aslih Abnuri (25/574338/PEK/31801), Arfinal Diputra (25/574664/PEK/31914), Rohana Dwi Hardianti (25/574077/PEK/31728)"], idW),
  trow(["Durasi", "30 menit: 17 menit teori, 11 menit studi kasus, 2 menit penutup"], idW),
  trow(["Jumlah slide", "21 slide"], idW)
]));
kids.push(SPACER(200));

kids.push(H1("Pembagian pembicara dan alokasi waktu"));
kids.push(P("Pembagian di bawah ini menyeimbangkan durasi bicara ketiga anggota pada kisaran sepuluh menit. Susunannya dapat ditukar selama total waktunya tetap dan tiap pergantian pembicara jatuh pada batas bagian, bukan di tengah pembahasan satu teori."));
const spW = [1700, 2500, CW - 1700 - 2500 - 1500, 1500];
kids.push(TABLE(spW, [
  thead(["Pembicara", "Slide", "Cakupan", "Total"], spW),
  trow(["Aslih Abnuri", "1 sampai 5, 15, 20 sampai 21", "Pembuka, kerangka dasar, anatomi kebijakan, simpulan", "9 menit 30 detik"], spW),
  trow(["Arfinal Diputra", "6 sampai 10, 17", "Lima teori modernis Barat dan penerapannya pada kasus", "9 menit 45 detik"], spW),
  trow(["Rohana Dwi Hardianti", "11 sampai 14, 16, 18 sampai 19", "Keterbatasan, empat teori alternatif, dua narasi, sintesis", "10 menit 45 detik"], spW)
]));
kids.push(SPACER(160));

kids.push(H1("Panduan pembawaan"));
kids.push.apply(kids, BULLETS([
 [{ text: "Tempo. ", bold: true }, { text: "Naskah ini disusun pada kisaran 130 kata per menit. Bila terasa terburu-buru, yang dipangkas adalah contoh, bukan definisi." }],
 [{ text: "Jangan membaca slide. ", bold: true }, { text: "Slide memuat rumusan padat, naskah memuat kalimat penghubungnya. Bacakan naskah, tunjuk slide seperlunya." }],
 [{ text: "Nomor teori. ", bold: true }, { text: "Sebutkan nomor urut setiap kali memperkenalkan teori. Nomor itu dipakai lagi pada matriks slide 19, sehingga pendengar dapat mengikutinya tanpa kembali ke belakang." }],
 [{ text: "Angka. ", bold: true }, { text: "Sebutkan angka utuh sekali saja, lalu rujuk dengan istilah pendek. Contoh, sebut 166 ribu pekerja sekali, selanjutnya cukup katakan penyerapan tenaga kerjanya." }],
 [{ text: "Serah terima. ", bold: true }, { text: "Ada empat titik pergantian pembicara, yaitu setelah slide 5, 10, 14, dan 19, ditambah dua pergantian pendek pada slide 15 sampai 18. Sebutkan nama penerimanya secara singkat." }],
 [{ text: "Cadangan waktu. ", bold: true }, { text: "Bila tersisa kurang dari dua menit ketika sampai slide 18, ringkas slide 18 menjadi dua kalimat per teori dan pertahankan slide 19 secara utuh." }]
]));

kids.push(H1("Naskah per slide", { pageBreak: true }));
kids.push(P("Teks pada bagian Naskah ditulis untuk diucapkan langsung. Baris Catatan pembawaan berisi pengingat teknis dan tidak perlu dibacakan."));

SLIDES.forEach(function (s) {
  kids.push(new C.Paragraph({
    spacing: { before: 300, after: 0, line: 264 },
    keepNext: true,
    children: [
      new C.TextRun({ text: "SLIDE " + (s.no < 10 ? "0" + s.no : s.no) + "   ", bold: true, color: PINK, size: 17, font: SANS, characterSpacing: 26 }),
      new C.TextRun({ text: s.title.toUpperCase(), bold: true, color: BLUE, size: 17, font: SANS, characterSpacing: 26 })
    ]
  }));
  kids.push(new C.Paragraph({
    spacing: { before: 30, after: 110, line: 240 },
    border: { bottom: { style: C.BorderStyle.SINGLE, size: 8, color: BLUE, space: 5 } },
    children: [
      new C.TextRun({ text: s.who, size: 18, color: INK, font: SANS, bold: true }),
      new C.TextRun({ text: "     " + s.dur + "     menit ke " + s.clock, size: 18, color: MUTE, font: SANS })
    ]
  }));
  s.lines.forEach(function (l) { kids.push(P(l, { size: 21, after: 110, line: 300 })); });
  kids.push(NOTE("CATATAN PEMBAWAAN", s.cue, "FBEAF2"));
  kids.push(SPACER(60));
});

kids.push(H1("Antisipasi pertanyaan", { pageBreak: true }));
kids.push(P("Delapan pertanyaan berikut paling mungkin muncul, disusun dari yang paling sering ditanyakan pada kasus kebijakan industri. Jawabannya ditulis ringkas supaya dapat disampaikan dalam waktu kurang dari satu menit."));
QA.forEach(function (q, i) {
  kids.push(H3((i + 1) + ".  " + q[0]));
  kids.push(P(q[1], { size: 21, after: 60 }));
});

kids.push(H1("Daftar angka penting", { pageBreak: true }));
kids.push(P("Angka pada tabel ini muncul pada slide 15 sampai 19. Simpan sebagai lembar contekan supaya tidak perlu kembali ke slide ketika menjawab pertanyaan."));
const agW = [2900, CW - 2900];
kids.push(TABLE(agW, [thead(["Angka", "Keterangan"], agW)].concat(
  ANGKA.map(function (a) {
    return trow([[P(a[0], { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })], a[1]], agW);
  })
)));
kids.push(SPACER(160));
kids.push(NOTE("BATAS WAKTU DATA",
  "Seluruh angka ditelusuri pada Agustus 2026 dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, serta dokumen putusan panel WTO. Kasus ini masih berjalan, sehingga sebagian angka akan berubah pada tahun berikutnya. Sebutkan batas waktu ini bila ada yang menanyakan sumber."));

const fsp = require("fs");
C.D.Packer.toBuffer(buildDoc("Skrip Presentasi Business Ethics", kids,
  "Skrip Presentasi  |  Evaluating Business Ethics  |  MAN5522 MBA UGM")).then(function (buf) {
  fsp.writeFileSync(process.argv[2] || "Skrip-Presentasi.docx", buf);
  console.log("WROTE skrip");
});
