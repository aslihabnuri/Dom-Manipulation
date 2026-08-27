const C = require("./common");
const { P, H1, H2, H3, EYEBROW, SPACER, RULEP, BULLETS, NUMS, TABLE, thead, trow, NOTE,
        buildDoc, TITLEBLOCK, AlignmentType, BLUE, INK, MUTE, PINK, GREEN, SANS, SERIF, CW } = C;

const k = [];
const b = function (t) { return { text: t, bold: true }; };
const i = function (t) { return { text: t, italics: true }; };
const t = function (x) { return { text: x }; };

k.push.apply(k, TITLEBLOCK(
  "MATERI BACAAN  |  MAN5522 BUSINESS ETHICS FOR SUSTAINABILITY",
  "Evaluating Business Ethics: Normative Ethical Theories",
  "Ringkasan Bab 3 Crane dan Matten beserta penerapannya pada hilirisasi nikel Indonesia"));

const idW = [1900, CW - 1900];
k.push(TABLE(idW, [
  trow(["Mata kuliah", "Business Ethics for Sustainability (MAN5522), MBA Universitas Gadjah Mada"], idW),
  trow(["Rujukan utama", "Crane, A., Matten, D., Glozer, S., dan Spence, L. (2019). Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization, edisi kelima, Bab 3"], idW),
  trow(["Penyusun", "Aslih Abnuri (25/574338/PEK/31801), Arfinal Diputra (25/574664/PEK/31914), Rohana Dwi Hardianti (25/574077/PEK/31728)"], idW),
  trow(["Fungsi dokumen", "Bahan bacaan pendamping presentasi 21 slide, dapat dibaca terpisah dari decknya"], idW)
]));
k.push(SPACER(180));

k.push(NOTE("CARA MEMBACA DOKUMEN INI",
 "Bagian 1 sampai 3 membangun kerangka penilaian dan dapat dibaca sebagai ringkasan Bab 3. Bagian 4 sampai 7 menerapkan kerangka itu pada satu kebijakan yang masih berjalan. Pembaca yang sudah menguasai teorinya dapat langsung ke Bagian 4, tetapi nomor urut teori satu sampai sembilan dipakai konsisten di seluruh dokumen, sehingga matriks pada Bagian 6 tetap dapat dibaca dengan kembali ke Tabel 1."));
k.push(SPACER(180));

/* ================= RINGKASAN ================= */
k.push(H1("Ringkasan"));
k.push(P("Bab 3 Crane dan Matten menyediakan sembilan teori etika normatif dan menempatkannya dalam kerangka pluralis, yaitu pandangan bahwa nilai yang saling bertentangan dapat sama sahnya tanpa harus disamaratakan. Kesembilan teori itu dibagi ke dalam dua klasifikasi. Klasifikasi pertama berisi lima teori modernis Barat yang menilai tindakan, baik dari akibatnya maupun dari prinsip di baliknya. Klasifikasi kedua berisi empat teori alternatif yang menggeser objek penilaian ke karakter pelaku, relasi antarpihak, prosedur perumusan norma, dan bahasa yang dipakai untuk membenarkan."));
k.push(P("Dokumen ini merangkum kesembilan teori tersebut, lalu mengujinya pada kebijakan hilirisasi nikel Indonesia yang dijalankan melalui Peraturan Menteri ESDM Nomor 11 Tahun 2019. Hasil pengujian menunjukkan enam teori menolak, satu memberi dukungan bersyarat, satu ambivalen, dan satu netral. Tidak satu pun memberikan dukungan tanpa syarat."));
k.push(P("Kesimpulan yang ditarik bukan bahwa hilirisasi harus dihentikan, melainkan bahwa klaim etis atas kebijakan ini belum dapat dipertahankan pada empat titik: pilihan pembandingnya, sumber energinya, distribusi manfaat dan bebannya, serta prosedur perumusannya. Keempat titik itu dapat diperbaiki tanpa membatalkan kebijakannya."));

/* ================= BAGIAN 1 ================= */
k.push(H1("Bagian 1  Mengapa teori etika normatif diperlukan", { pageBreak: true }));

k.push(H2("1.1  Definisi dan tiga fungsi"));
k.push(P([t("Crane dan Matten (2019: 87) mendefinisikan teori etika normatif sebagai "), b("aturan, pedoman, prinsip, dan pendekatan yang menentukan benar dan salah"), t(". Definisi ini perlu dibedakan dari etika deskriptif, yang hanya memerikan apa yang secara faktual dianggap benar oleh sekelompok orang. Pernyataan bahwa praktik di negara lain berbeda adalah pengamatan deskriptif. Pernyataan bahwa praktik itu salah adalah penilaian normatif. Teori normatif bekerja pada jenis pernyataan kedua.")]));
k.push(P("Dalam ranah personal, intuisi biasanya memadai. Kita jarang memerlukan argumen filosofis untuk mengetahui bahwa berbohong pada teman itu keliru. Konteks bisnis berbeda karena penilaian etis di sana harus dapat dipertahankan di hadapan pemegang saham, regulator, pekerja, konsumen, dan masyarakat sekitar, yang masing-masing berangkat dari kepentingan berbeda. Pada titik itu intuisi saja tidak cukup, dan teori normatif menjalankan tiga fungsi."));
k.push.apply(k, NUMS([
 [b("Rasionalisasi intuisi moral. "), t("Teori tidak menggantikan intuisi melainkan merapikannya. Ia menjelaskan mengapa suatu keputusan terasa keliru dan menerjemahkan perasaan itu menjadi alasan yang dapat diperiksa orang lain.")],
 [b("Dasar diskusi rasional. "), t("Ketika dua pihak berangkat dari nilai yang berbeda, teori memungkinkan perbedaan itu diperdebatkan pada tataran argumen. Tanpa teori, perbedaan penilaian berhenti pada tataran preferensi dan tidak dapat diselesaikan.")],
 [b("Justifikasi keputusan bisnis. "), t("Keputusan perusahaan menuntut dasar rasional yang sistematis dan dapat dipertanggungjawabkan. Teori menyediakan struktur alasan itu, termasuk ketika keputusannya kemudian dipersoalkan di ruang publik.")]
]));

k.push(H2("1.2  Absolutisme, relativisme, dan pluralisme"));
k.push(P("Sebelum menerapkan teori apa pun, perlu ditetapkan lebih dahulu seberapa luas klaim keberlakuan yang diajukan teori tersebut. Bab 3 membedakan tiga posisi."));
const posW = [2300, CW - 2300];
k.push(TABLE(posW, [
  thead(["Posisi", "Klaim pokok"], posW),
  trow([[P("Absolutisme etis", { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })],
        "Ada prinsip moral yang universal dan abadi. Benar dan salah adalah kualitas objektif yang ditentukan lewat nalar, terlepas dari keadaan. Hampir seluruh teori modernis Barat berada pada posisi ini."], posW),
  trow([[P("Relativisme etis", { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })],
        "Tidak ada benar dan salah yang berlaku universal. Penilaian moral bergantung pada tradisi, keyakinan, dan praktik pihak yang memutuskan."], posW),
  trow([[P("Pluralisme etis", { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })],
        "Nilai yang bertentangan dapat sama sahnya. Pluralisme tidak menyamaratakan seluruh perspektif, tetapi juga tidak mengunggulkan satu di atas yang lain. Inilah posisi yang diambil Crane dan Matten."], posW)
]));
k.push(SPACER(140));
k.push(P("Perbedaan ketiganya paling mudah dilihat pada kasus suap. Absolutis menyatakan suap selalu salah di mana pun. Relativis menyatakan penilaiannya bergantung pada negara dan praktik setempat. Pluralis mengajukan pertanyaan yang berbeda, yaitu kriteria mana yang paling kuat menanggung beban argumen dalam situasi tersebut. Posisi pluralis inilah yang membuat pendekatan sembilan teori masuk akal. Tujuannya bukan mencari satu teori yang paling benar, melainkan melihat ke arah mana penilaian dari premis yang berbeda itu bertemu."));
k.push(P("Perlu dicatat bahwa relativisme sering dipakai untuk menolak kritik lintas negara dengan alasan perbedaan budaya. Sen (2000) menunjukkan bahwa nilai seperti keselamatan kerja dan keikutsertaan warga dalam keputusan yang memengaruhi hidupnya tidak eksklusif milik satu tradisi budaya, sehingga argumen perbedaan budaya tidak dengan sendirinya membatalkan penilaian."));

k.push(H2("1.3  Klasifikasi sembilan teori"));
k.push(P("Bab 3 membagi sembilan teori ke dalam dua klasifikasi. Klasifikasi pertama berakar pada Pencerahan abad kedelapan belas, bersifat absolutis, dan menawarkan aturan yang dapat diterapkan pada situasi apa pun. Klasifikasi kedua cenderung relativis dan lahir dari keberatan atas klasifikasi pertama."));
const klW = [560, 2350, 2200, CW - 560 - 2350 - 2200];
k.push(P("Tabel 1  Sembilan teori etika normatif", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(klW, [
  thead(["No", "Teori", "Klasifikasi", "Objek penilaian"], klW),
  trow(["1", "Egoism", "Modernis, konsekuensialis", "Akibat bagi kepentingan pelaku sendiri"], klW),
  trow(["2", "Utilitarianism", "Modernis, konsekuensialis", "Akibat bagi seluruh pihak terdampak"], klW),
  trow(["3", "Ethics of duty", "Modernis, berbasis prinsip", "Maksim dan motivasi di balik tindakan"], klW),
  trow(["4", "Ethics of rights", "Modernis, berbasis prinsip", "Hak yang terpenuhi dan hak yang terlanggar"], klW),
  trow(["5", "Justice", "Modernis, berbasis prinsip", "Susunan pembagian manfaat dan beban"], klW),
  trow(["6", "Virtue ethics", "Alternatif", "Karakter pelaku"], klW),
  trow(["7", "Ethic of care", "Alternatif", "Relasi dan tanggung jawab pada pihak tertentu"], klW),
  trow(["8", "Discourse ethics", "Alternatif", "Prosedur perumusan norma"], klW),
  trow(["9", "Postmodern ethics", "Alternatif", "Bahasa dan dorongan moral"], klW)
]));
k.push(SPACER(140));
k.push(P("Kesembilan teori ini bersifat normatif karena masing-masing berangkat dari asumsi tentang hakikat dunia dan hakikat manusia. Menerima kesimpulan sebuah teori berarti menerima lebih dahulu asumsi yang mendasarinya. Kesadaran ini penting ketika penilaian dua teori berbeda, sebab yang sebenarnya berbeda kerap bukan faktanya, melainkan asumsi tentang siapa yang perlu diperhitungkan dan apa yang dianggap sebagai kebaikan."));

/* ================= BAGIAN 2 ================= */
k.push(H1("Bagian 2  Lima teori modernis Barat"));

k.push(H2("2.1  Ethical egoism"));
k.push(P([b("Definisi. "), t("Sebuah tindakan benar secara moral jika dalam situasi tersebut semua pengambil keputusan secara bebas memilih mengejar keinginan jangka pendek atau kepentingan jangka panjangnya. Teori ini yang tertua sekaligus paling diperdebatkan, sampai sebagian penulis menolak mengategorikannya sebagai teori moral.")]));
k.push(P([b("Tokoh. "), t("Thomas Hobbes dalam Leviathan, yang menggambarkan keadaan alamiah sebagai perang semua melawan semua sehingga kerja sama lahir dari kepentingan diri, dan Ayn Rand dalam The Virtue of Selfishness.")]));
k.push(P([b("Pembedaan yang sering tertukar. "), t("Egoisme bukan keserakahan. Pelaku egois masih dapat tergerak oleh rasa iba dan tetap memperhitungkan kepentingan pihak lain sejauh itu berpengaruh pada dirinya. Pelaku serakah tidak peka pada kepentingan pihak lain sama sekali. Versi yang paling relevan bagi bisnis adalah enlightened egoism, yaitu pandangan bahwa perusahaan menyokong lingkungan sosial dan ekologisnya justru karena hal itu menguntungkan dirinya sendiri dalam jangka panjang.")]));
k.push(P([b("Keterbatasan. "), t("Teori ini hanya bekerja bila pasar mencegah satu pelaku merugikan pelaku lain. Ia gugur pada kegagalan pasar, dan gugur lebih tegas lagi pada isu keberlanjutan, sebab korban penipisan sumber daya adalah generasi mendatang yang belum dapat ikut bertransaksi maupun menuntut.")]));

k.push(H2("2.2  Utilitarianism"));
k.push(P([b("Definisi. "), t("Sebuah tindakan benar secara moral jika menghasilkan kebaikan terbesar bagi jumlah orang terbesar yang terkena dampaknya. Perumusnya Jeremy Bentham dan John Stuart Mill. Teori ini paling lazim diterapkan dalam bisnis karena kompatibel dengan metodologi kuantitatif ekonomi, termasuk analisis biaya manfaat.")]));
k.push(P([b("Empat ciri pokok. "), t("Consequentialism, yang dinilai akibatnya. Hedonism, kebaikan diukur sebagai pleasure dikurangi pain. Maximalism, yang dicari akibat bersih terbesar. Universalism, akibat bagi semua pihak wajib ikut dihitung, bukan hanya akibat bagi pelaku.")]));
k.push(P([b("Act dan rule. "), t("Pembedaan ini yang paling menentukan dalam praktik. "), i("Act utilitarianism"), t(" menilai satu tindakan tunggal berdasarkan akibat tindakan itu sendiri. "), i("Rule utilitarianism"), t(" menilai kelas tindakan dan prinsip di baliknya, dengan pertanyaan seperti apa akibatnya bila tindakan semacam ini menjadi aturan umum. Keduanya sama-sama utilitarianism, namun keduanya dapat menghasilkan kesimpulan yang berlawanan atas rangkaian fakta yang identik. Pembedanya terletak pada unit analisis, bukan pada datanya.")]));
k.push(P([b("Empat keberatan. "), t("Subjektivitas dalam menilai utilitas, pembobotan yang menyamakan seluruh orang tanpa memandang posisi, kesulitan mengkuantifikasi akibat yang tidak berbentuk uang, serta distribusi utilitas yang dapat mengabaikan minoritas dan generasi mendatang. Keberatan terakhir yang paling sering muncul dalam kasus kebijakan industri, sebab angka agregat yang positif dapat menyembunyikan kerugian berat pada kelompok kecil.")]));

k.push(H2("2.3  Ethics of duty"));
k.push(P([b("Definisi. "), t("Kewajiban yang abstrak dan tidak berubah, dirumuskan lewat aturan moral a priori yang dideduksi secara rasional dan berlaku pada semua persoalan etis. Yang dinilai bukan akibat, melainkan prinsip di balik tindakan dan motivasi pelakunya. Perumusnya Immanuel Kant.")]));
k.push(P([b("Formulasi pertama, universal acceptability. "), t("Terima sebuah hukum moral hanya bila semua makhluk berakal budi juga dapat menerimanya. Contoh Kant sendiri adalah mengingkari utang. Bila semua orang boleh mengingkari utang, lembaga utang piutang kehilangan dasarnya, sehingga maksim itu membatalkan dirinya sendiri ketika diuniversalkan.")]));
k.push(P([b("Formulasi kedua, respect for persons. "), t("Perlakukan manusia sebagai tujuan, jangan pernah sekadar sebagai sarana. Formulasi inilah yang menjadi dasar etis stakeholder theory, sebab ia menuntut setiap pihak yang terdampak diperlakukan sebagai pihak yang kepentingannya berdiri sendiri, bukan sebagai variabel dalam perhitungan pihak lain.")]));
k.push(P([b("Cara pakai. "), t("Rumuskan maksim tindakannya dalam satu kalimat, lalu universalkan. Bila maksim itu membatalkan dirinya sendiri, atau bila menjalankannya mengharuskan sebagian pihak diperlakukan sekadar sebagai sarana, tindakan tersebut gagal uji.")]));
k.push(P([b("Tiga keberatan. "), t("Kriteria motivasinya terlalu sempit karena hanya tindakan yang dilakukan demi kewajiban yang dinilai bermoral, akibat diabaikan sepenuhnya sehingga hasil yang buruk tidak mengubah penilaian, dan asumsi rasionalitas penuh pada setiap pelaku bersifat idealistis.")]));

k.push(H2("2.4  Ethics of rights"));
k.push(P([b("Definisi. "), t("Hak dasar yang melekat, tidak dapat dicabut, dan tidak bersyarat, yang dimiliki setiap manusia tanpa kecuali. John Locke merumuskan natural rights atas hidup, kebebasan, dan milik. Pendekatan ini yang paling banyak dipakai secara praktis karena sudah melembaga dalam instrumen internasional, mulai dari Universal Declaration of Human Rights (1948).")]));
k.push(P([b("Korelasi hak dan kewajiban. "), t("Hak seseorang selalu menimbulkan kewajiban pada pihak lain. Hak atas air bersih berarti ada pihak yang berkewajiban tidak mencemari. Konsekuensi ini yang membuat bahasa hak dapat langsung diterjemahkan menjadi kewajiban korporasi, tanpa perlu menunggu kesepakatan moral yang lebih dalam.")]));
k.push(P([b("UN Guiding Principles 2011. "), t("Kerangka yang berlaku dalam praktik bisnis membagi tanggung jawab menjadi tiga. Negara melindungi, bisnis menghormati, dan peradilan menyediakan pemulihan bagi korban. Yang menentukan adalah cakupannya. Perusahaan wajib meredakan dampak buruk yang terkait lewat relasi bisnisnya, sekalipun perusahaan itu tidak ikut menyebabkannya. Pemasok, kontraktor, dan mitra kawasan termasuk di dalamnya.")]));
k.push(P([b("Keterbatasan. "), t("Daftar hak dapat saling bertentangan, misalnya hak atas pekerjaan berhadapan dengan hak atas lingkungan yang sehat, dan teori ini tidak menyediakan aturan pemeringkatan ketika pertentangan itu terjadi.")]));

k.push(H2("2.5  Justice dan teori kontrak sosial"));
k.push(P([b("Definisi. "), t("Perlakuan yang adil terhadap setiap orang dalam satu situasi, sehingga semua pihak memperoleh apa yang memang menjadi haknya. Pertanyaannya bergeser dari benar atau salah menjadi susunan seperti apa yang layak disepakati bersama.")]));
k.push(P([b("Dua dimensi. "), i("Keadilan prosedural"), t(" menilai siapa yang berhak turut memutuskan dan apakah prosesnya terbuka bagi pihak yang akan terkena akibatnya. "), i("Keadilan distributif"), t(" menilai ke mana manfaat mengalir dan siapa yang menanggung bebannya. Sebuah kebijakan dapat lolos pada satu dimensi dan gugur pada dimensi lain.")]));
k.push(P([b("Dua prinsip John Rawls. "), t("Pertama, kebebasan dasar yang setara bagi semua. Kedua, ketimpangan hanya dibenarkan bila susunan itu paling menguntungkan pihak yang paling tidak diuntungkan. Alat ujinya adalah veil of ignorance, yaitu memilih susunan tanpa mengetahui posisi yang akan ditempati sendiri. Bila seseorang tidak tahu akan lahir sebagai pemegang saham atau sebagai warga di hilir sungai, susunan mana yang akan dipilihnya?")]));
k.push(P([b("Kontrak sosial. "), t("Dari Hobbes, Locke, dan Rousseau. Versi bisnisnya adalah Integrative Social Contracts Theory dari Donaldson dan Dunfee, yang memadukan hypernorms, yaitu prinsip yang berlaku lintas komunitas, dengan kontrak mikro yang berlaku pada komunitas tertentu. Kerangka ini berguna ketika standar global dan praktik lokal berbenturan.")]));

k.push(H2("2.6  Enam keterbatasan teori modernis"));
k.push(P("Kelima teori di atas memiliki enam keberatan yang tercatat dalam Bab 3. Keberatan inilah yang melahirkan empat teori alternatif."));
k.push.apply(k, NUMS([
 [b("Abstraksi berlebih. "), t("Prinsipnya beroperasi pada tataran yang jauh dari persoalan konkret yang dihadapi manajer sehari-hari.")],
 [b("Reduksionisme. "), t("Setiap teori menonjolkan satu dimensi moralitas, misalnya akibat atau kewajiban, lalu memperlakukannya sebagai keseluruhan moralitas.")],
 [b("Objektivisme elitis. "), t("Kebenaran moral ditentukan melalui deduksi ahli, bukan melalui pengalaman pihak yang benar-benar terlibat dan terkena akibatnya.")],
 [b("Impersonalitas. "), t("Ikatan personal dan tanggung jawab pada pihak tertentu justru diposisikan sebagai pengganggu penilaian yang seharusnya netral.")],
 [b("Rasionalisme terkodifikasi. "), t("Peran perasaan, empati, dan dorongan moral diabaikan dalam perumusan penilaian etis.")],
 [b("Imperialisme kultural. "), t("Pengalaman dan tradisi intelektual Barat diposisikan sebagai ukuran yang berlaku universal bagi seluruh masyarakat.")]
]));
k.push(SPACER(60));
k.push(NOTE("CATATAN",
 "Teori alternatif tidak menggantikan teori modernis. Ia menambahkan dimensi penilaian yang belum tercakup, yaitu karakter pelaku, relasi antarpihak, prosedur perumusan norma, dan pilihan istilah. Karena itu keduanya dipakai bersama pada Bagian 5, bukan dipertentangkan."));

/* ================= BAGIAN 3 ================= */
k.push(H1("Bagian 3  Empat teori alternatif"));

k.push(H2("3.1  Virtue ethics"));
k.push(P([b("Pertanyaan pokok. "), t("Pelaku seperti apa yang layak disebut baik pada posisi ini? Objek penilaian bergeser dari tindakan ke karakter pelaku.")]));
k.push(P([b("Tokoh. "), t("Aristoteles dalam Nicomachean Ethics, Alasdair MacIntyre dalam After Virtue, dan Robert Solomon dalam Ethics and Excellence.")]));
k.push(P([b("Gagasan inti. "), t("Moralitas lahir dari karakter yang dibentuk lewat pembiasaan, bukan dari kepatuhan pada aturan. Tujuan akhirnya eudaimonia, yaitu hidup yang baik dan berkembang penuh. Dalam bisnis, perusahaan dipandang sebagai komunitas praktik dengan keutamaan berupa kejujuran, keadilan, kepercayaan, dan ketangguhan.")]));
k.push(P([b("Yang sering disalahpahami. "), t("Virtue ethics kerap dibaca sebagai imbauan moral belaka. Sebenarnya ia mengajukan satu pertanyaan yang tajam dan sangat operasional, yaitu dibandingkan dengan apa kita menyebut sesuatu sudah cukup baik. Pilihan pembanding inilah yang menjadi objek kritiknya.")]));
k.push(P([b("Keterbatasan. "), t("Keutamaan selalu ditentukan oleh komunitas tertentu, sehingga sulit dijadikan ukuran lintas budaya dan lintas industri.")]));

k.push(H2("3.2  Ethic of care"));
k.push(P([b("Pertanyaan pokok. "), t("Solusi mana yang memelihara relasi dengan pihak terdampak, bukan sekadar mengganti kerugiannya?")]));
k.push(P([b("Tokoh. "), t("Carol Gilligan dalam In a Different Voice dan Nel Noddings dalam Caring. Berakar pada etika feminis.")]));
k.push(P([b("Gagasan inti. "), t("Manusia dipandang sebagai makhluk yang saling bergantung dan terjalin dalam relasi, bukan sebagai individu rasional yang terpisah. Yang dituntut adalah empati, keselarasan, menghindari kerugian, dan tanggung jawab konkret pada orang tertentu, bukan penerapan aturan yang seragam pada semua orang.")]));
k.push(P([b("Implikasi praktis. "), t("Teori ini jarang menuntut penghentian sebuah kegiatan. Yang dituntutnya pemulihan relasi yang rusak, dan itu membuatnya sering menghasilkan rekomendasi yang berbeda dari teori keadilan sekalipun berangkat dari keprihatinan yang sama.")]));
k.push(P([b("Keterbatasan. "), t("Prioritas pada pihak terdekat berisiko mengabaikan pihak yang jauh, dan kriteria kepedulian sulit diaudit secara seragam.")]));

k.push(H2("3.3  Discourse ethics"));
k.push(P([b("Pertanyaan pokok. "), t("Norma apa yang dapat lahir dari deliberasi yang terbuka, dan siapa yang hadir serta siapa yang absen ketika norma itu dirumuskan?")]));
k.push(P([b("Tokoh. "), t("Jurgen Habermas dalam Moral Consciousness and Communicative Action, bersama Karl Otto Apel.")]));
k.push(P([b("Gagasan inti. "), t("Norma tidak ditetapkan filsuf dari luar, melainkan dihasilkan dialog rasional antara semua pihak terdampak. Syaratnya disebut ideal speech situation, yaitu semua pihak boleh ikut, bebas dari paksaan, dan argumen dinilai dari kekuatannya sendiri, bukan dari kekuasaan pihak yang mengusulkannya.")]));
k.push(P([b("Konsekuensi yang menentukan. "), t("Orientasinya penyelesaian konflik secara damai, bukan pembuktian satu kebenaran. Karena yang dinilai prosedurnya, prosedur yang cacat sudah cukup untuk membatalkan keabsahan hasilnya, sekalipun hasil itu tampak baik bila diukur dengan kriteria lain.")]));
k.push(P([b("Keterbatasan. "), t("Syarat ideal speech situation nyaris tidak pernah terpenuhi sepenuhnya dalam praktik, sehingga teori ini lebih berguna sebagai ukuran seberapa jauh sebuah proses menyimpang daripada sebagai prosedur yang benar-benar dijalankan.")]));

k.push(H2("3.4  Postmodern ethics"));
k.push(P([b("Pertanyaan pokok. "), t("Kepentingan siapa yang dilayani oleh pilihan istilah yang dipakai untuk menamai sebuah kebijakan?")]));
k.push(P([b("Tokoh. "), t("Zygmunt Bauman dalam Postmodern Ethics, dengan latar pemikiran Jacques Derrida dan Jean-Francois Lyotard.")]));
k.push(P([b("Gagasan inti. "), t("Dorongan moral dan perasaan didahulukan atas perhitungan rasional. Tindakan etis kerap digerakkan intuisi, bukan kalkulasi. Kritiknya diarahkan pada organisasi, sebab prosedur, pembagian tugas, dan jarak birokratis menciptakan jarak moral yang menumpulkan dorongan tersebut.")]));
k.push(P([b("Implikasi sikap. "), t("Mempertanyakan bahasa dan asumsi yang sudah dianggap wajar, lalu bertindak pada skala lokal tempat akibatnya benar-benar dirasakan. Teori inilah yang paling berguna untuk membongkar istilah pemasaran yang dipakai membenarkan sebuah kebijakan.")]));
k.push(P([b("Keterbatasan. "), t("Karena menolak dasar rasional yang tetap, teori ini sulit dipakai untuk memutuskan. Ia lebih kuat sebagai alat kritik daripada sebagai pedoman tindakan.")]));

k.push(H2("3.5  Sembilan pertanyaan penilaian"));
k.push(P("Kesembilan teori dapat diringkas menjadi sembilan pertanyaan yang dapat langsung dipakai untuk menguji sebuah kebijakan. Tidak ada satu teori yang memberikan jawaban lengkap. Yang dicari adalah pertimbangan yang paling kuat menanggung beban argumen, dan arah konvergensi dari kesembilan jawabannya."));
const qW = [560, 2100, CW - 560 - 2100];
k.push(P("Tabel 2  Sembilan pertanyaan penilaian", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(qW, [
  thead(["No", "Teori", "Pertanyaan"], qW),
  trow(["1", "Egoism", "Apakah semua pihak bebas mengejar kepentingan jangka panjangnya, dan sudahkah biaya tertunda dihitung?"], qW),
  trow(["2", "Utilitarianism", "Bila seluruh akibat diagregasi, apakah hasilnya positif, dan apakah act dan rule sejalan?"], qW),
  trow(["3", "Ethics of duty", "Dapatkah maksim tindakan ini diuniversalkan, dan adakah pihak yang diperlakukan sekadar sarana?"], qW),
  trow(["4", "Ethics of rights", "Hak siapa yang terpenuhi, hak siapa yang terlanggar, dan sampai mana relasi bisnisnya menjangkau?"], qW),
  trow(["5", "Justice", "Susunan apa yang akan dipilih orang yang belum tahu posisi yang akan ditempatinya?"], qW),
  trow(["6", "Virtue ethics", "Bagaimana pelaku berkarakter baik bertindak di posisi ini, dan diukur terhadap standar yang mana?"], qW),
  trow(["7", "Ethic of care", "Solusi mana yang memelihara relasi dengan pihak terdampak, bukan sekadar mengganti kerugiannya?"], qW),
  trow(["8", "Discourse ethics", "Siapa yang hadir dan siapa yang absen ketika norma dan izinnya dirumuskan?"], qW),
  trow(["9", "Postmodern ethics", "Kepentingan siapa yang dilayani oleh istilah yang dipakai menamai kebijakan ini?"], qW)
]));

/* ================= BAGIAN 4 ================= */
k.push(H1("Bagian 4  Studi kasus hilirisasi nikel Indonesia", { pageBreak: true }));

k.push(H2("4.1  Anatomi kebijakan"));
k.push(P([b("Instrumen. "), t("Peraturan Menteri ESDM Nomor 11 Tahun 2019 melarang ekspor bijih nikel dan berlaku efektif 1 Januari 2020.")]));
k.push(P([b("Mekanisme. "), t("Bijih wajib diolah di dalam negeri, dan kepemilikan smelter menjadi syarat masuk kawasan industri. Kebijakan ini memindahkan tahap pengolahan dari negara pembeli ke dalam wilayah Indonesia, sehingga nilai tambahnya tercatat di dalam negeri.")]));
k.push(P([b("Sengketa. "), t("Panel World Trade Organization memutus kebijakan ini melanggar aturan perdagangan pada November 2022, atas gugatan Uni Eropa. Sengketanya belum tuntas sampai dokumen ini disusun.")]));
k.push(P("Satu instrumen regulasi ini mengubah struktur industri nikel nasional dalam waktu kurang dari lima tahun."));

k.push(H2("4.2  Kronologi"));
const krW = [1100, CW - 1100];
k.push(TABLE(krW, [
  thead(["Tahun", "Peristiwa"], krW),
  trow(["2014", "Larangan ekspor bijih pertama diberlakukan, kemudian direlaksasi"], krW),
  trow(["2019", "Peraturan Menteri ESDM Nomor 11 terbit"], krW),
  trow(["2020", "Larangan berlaku efektif per 1 Januari"], krW),
  trow(["2022", "Panel WTO memenangkan gugatan Uni Eropa pada November"], krW),
  trow(["2025", "Nilai ekspor produk nikel olahan mencapai 40 miliar dolar"], krW)
]));
k.push(SPACER(140));

k.push(H2("4.3  Dua narasi atas fakta yang sama"));
k.push(P("Kasus ini menarik untuk mata kuliah etika bisnis karena kedua pihak yang berselisih bersandar pada data resmi yang sama sahnya. Yang disengketakan bukan angkanya, melainkan kriteria penilaiannya. Tabel berikut menyandingkan kedua narasi tanpa memilih salah satunya lebih dahulu."));
const dnW = [2200, (CW - 2200) / 2, (CW - 2200) / 2];
k.push(P("Tabel 3  Dua narasi atas rangkaian fakta yang identik", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(dnW, [
  thead(["Dimensi", "Narasi hilirisasi berdaulat", "Narasi ekstraksi berbiaya sosial"], dnW),
  trow(["Nilai ekonomi", "Ekspor produk olahan 40 miliar dolar pada 2025, naik dari 3 miliar dolar pada 2020", "Hanya 4,35 persen nilai tambah tinggal di Morowali, dengan kemiskinan 12,58 persen"], dnW),
  trow(["Investasi", "41,5 miliar dolar terkumpul di kawasan IMIP Morowali sampai Desember 2025", "Konsentrasi kepemilikan dan keuntungan berada di luar daerah penghasil"], dnW),
  trow(["Tenaga kerja", "166 ribu pekerja terserap di IMIP dan IWIP, dari 35.952 orang pada 2020", "Upah pokok 3 sampai 3,6 juta rupiah per bulan, di bawah upah minimum Morowali 2025 sebesar 3,7 juta"], dnW),
  trow(["Keselamatan", "Kawasan industri terintegrasi dengan standar operasi yang terdokumentasi", "107 pekerja meninggal dan 155 pekerja luka pada 104 kecelakaan smelter sepanjang 2019 sampai 2025"], dnW),
  trow(["Lingkungan", "Pengolahan di dalam negeri memindahkan nilai tambah dari negara pembeli", "163 ribu hektare tutupan pohon hilang di Halmahera, dan industri nikel memegang 76 persen PLTU"], dnW),
  trow(["Posisi global", "Indonesia menjadi simpul utama rantai pasok baterai dunia", "Sungai Ake Jira tidak lagi layak dipakai warga, dan 40 persen wilayah adat O Hongana Manyawa sudah berizin tambang"], dnW)
]));
k.push(SPACER(140));
k.push(P([b("Struktur biaya yang menentukan. "), t("Manfaat kebijakan ini besar, terukur, dan terkonsentrasi pada pihak yang mudah diidentifikasi. Bebannya tersebar pada banyak pihak, tertunda ke masa depan, dan sulit dikuantifikasi. Persoalan dengan struktur seperti ini tidak dapat diselesaikan melalui satu kriteria penilaian tunggal, sebab kriteria tunggal cenderung hanya menangkap salah satu sisinya.")]));
k.push(SPACER(60));
k.push(NOTE("BATAS WAKTU DATA",
 "Seluruh angka pada bagian ini ditelusuri pada Agustus 2026 dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, serta dokumen putusan panel WTO. Kebijakannya masih berjalan dan sengketa dagangnya belum tuntas, sehingga sebagian angka akan berubah pada tahun berikutnya."));

/* ================= BAGIAN 5 ================= */
k.push(H1("Bagian 5  Penerapan sembilan teori"));
k.push(P("Bagian ini menguji rangkaian fakta yang sama dengan sembilan kriteria yang berbeda. Perhatikan bahwa faktanya tidak berubah dari satu teori ke teori berikutnya. Yang berubah adalah pertanyaan yang diajukan atas fakta tersebut."));

k.push(H2("5.1  Lima teori modernis"));

k.push(H3("Egoism, penilaian netral"));
k.push(P("Pada horizon pendek kebijakan ini jelas melayani kepentingan Indonesia sebagai pemilik cadangan. Pada horizon panjang, penilaiannya berubah. Biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit batu bara belum diinternalisasi ke dalam perhitungan. Biaya tersebut tidak hilang, hanya tertunda, dan pada akhirnya tetap ditanggung pihak yang sama. Justru kepentingan diri yang dihitung cermat, yaitu enlightened egoism, menuntut biaya tertunda itu masuk sejak awal. Teori ini dinilai netral karena mengakui keterbatasannya sendiri pada persoalan yang melibatkan generasi mendatang."));

k.push(H3("Utilitarianism, penilaian ambivalen"));
k.push(P("Ini penilaian yang paling menarik karena teorinya terbelah. Act utilitarianism cenderung mendukung, sebab manfaat 166 ribu lapangan kerja bersifat nyata, terukur, dan dirasakan sekarang, sedangkan kerugiannya tersebar pada banyak pihak dan sebagian baru muncul di kemudian hari."));
k.push(P("Rule utilitarianism justru menolak. Bila kebijakan ini diperlakukan sebagai kelas tindakan, artinya bila setiap negara pemilik cadangan menempuh pengolahan bertenaga batu bara, tambahan emisinya membatalkan manfaat transisi energi yang justru menjadi pembenar kebijakan tersebut. Aturan yang membatalkan tujuannya sendiri ketika diterapkan secara umum tidak lolos uji rule utilitarianism."));
k.push(P("Keduanya utilitarianism dan keduanya memakai data yang sama. Pembedanya semata unit analisis, yaitu tindakan tunggal atau kelas tindakan. Perbedaan act dan rule karena itu bukan detail teknis, melainkan yang menentukan putusan."));

k.push(H3("Ethics of duty, penilaian menolak"));
k.push(P("Maksim tindakannya dapat dirumuskan sebagai berikut: pengolahan boleh dipercepat sambil menunda pemenuhan standar upah, keselamatan, dan lingkungan. Diuniversalkan, maksim itu menjadikan standar upah, keselamatan, dan lingkungan kehilangan daya ikatnya, sebab setiap pihak dapat menunda dengan alasan percepatan. Maksimnya membatalkan dirinya sendiri, sehingga gagal pada formulasi pertama."));
k.push(P("Formulasi kedua juga tidak terpenuhi. Upah pokok di bawah upah minimum daerah dan lembur yang tercatat sampai 13 jam menjadikan pekerja sarana bagi pencapaian target produksi, bukan tujuan yang kepentingannya berdiri sendiri."));

k.push(H3("Ethics of rights, penilaian bersyarat"));
k.push(P("Hak atas pekerjaan terpenuhi bagi 166 ribu pekerja, dan sampai titik itu kebijakan ini dapat dipertahankan. Namun sejumlah hak lain terlanggar bersamaan, yaitu hak atas kondisi kerja yang adil dan aman, hak atas kesehatan, hak atas air bersih, dan hak masyarakat adat atas tanah leluhurnya."));
k.push(P("Penilaian ini disebut bersyarat karena teorinya tidak menolak kebijakannya, melainkan menuntut pemenuhan hak yang terlanggar sebagai syarat keberlanjutannya. UN Guiding Principles menuntut penghormatan pada seluruh relasi bisnis, sehingga pembeli produk nikel di negara lain tidak dapat melepaskan diri dari kondisi di tempat produksinya."));

k.push(H3("Justice, penilaian menolak"));
k.push(P("Pada dimensi distributif, manfaat mengalir ke penerimaan nasional dan pemodal, sedangkan beban terkonsentrasi pada pekerja kawasan, warga di hilir sungai, dan masyarakat adat. Hanya 4,35 persen nilai tambah yang tinggal di Morowali, dan kabupaten penghasil justru lebih miskin daripada rata-rata provinsinya. Susunan semacam ini tidak memenuhi prinsip kedua Rawls, sebab ketimpangannya tidak paling menguntungkan pihak yang paling tidak diuntungkan."));
k.push(P("Pada dimensi prosedural, pihak yang menanggung beban tidak turut memutuskan. Uji veil of ignorance memperjelasnya. Seseorang yang tidak mengetahui akan lahir sebagai pemegang saham smelter atau sebagai warga di hilir sungai Ake Jira kemungkinan besar tidak akan memilih susunan yang sekarang berlaku."));

k.push(H2("5.2  Empat teori alternatif"));

k.push(H3("Virtue ethics, menolak pembandingnya"));
k.push(P("Teori ini tidak menolak kebijakannya, melainkan menolak pembanding yang dipakai untuk membenarkannya. Selama ini pembandingnya adalah keadaan sebelum hilirisasi, yaitu ekspor bijih mentah. Aktor yang berkarakter baik mengukur diri pada standar tertinggi yang dapat dicapai, bukan pada keadaan masa lalunya sendiri. Teknologi tungku yang lebih bersih, sistem keselamatan kerja yang lebih ketat, dan pasokan listrik rendah karbon sudah tersedia dan dipakai di tempat lain, sehingga standar itu bukan tuntutan yang mustahil."));

k.push(H3("Ethic of care, menuntut pemulihan"));
k.push(P("Warga di hilir sungai dan sekitar 300 sampai 500 jiwa masyarakat O Hongana Manyawa adalah pihak yang berelasi dengan operasi kawasan, bukan variabel biaya dalam perhitungan. Yang dituntut teori ini adalah pemulihan sungai dan wilayah lindung, bukan penghentian kegiatan secara mendadak yang justru akan merusak relasi lain, yaitu relasi dengan 166 ribu pekerja beserta keluarganya."));
k.push(P("Penilaian ini contoh baik bahwa pluralisme tidak berarti seluruh teori berkata sama. Ethic of care berangkat dari keprihatinan yang sama dengan teori keadilan, tetapi menghasilkan rekomendasi yang berbeda."));

k.push(H3("Discourse ethics, menolak prosedurnya"));
k.push(P("Warga terdampak bukan pihak dalam perumusan kebijakan maupun dalam perizinan kawasan. Syarat ideal speech situation karena itu tidak terpenuhi, sebab pihak yang paling terkena akibatnya justru absen dari forum yang memutuskan. Bagi teori ini, cacat prosedur sudah cukup untuk membatalkan keabsahan hasilnya, terlepas dari seberapa baik hasil itu bila diukur dengan kriteria lain."));

k.push(H3("Postmodern ethics, membaca pilihan istilahnya"));
k.push(P("Istilah hilirisasi berkonotasi kemajuan dan penguasaan rantai nilai. Istilah ekstraksi berkonotasi pengurasan sumber daya. Keduanya menamai peristiwa yang sama, dan pilihan di antara keduanya menentukan siapa yang tampak sebagai pihak yang berjasa dan siapa yang tampak sebagai korban."));
k.push(P("Contoh paling tajam adalah istilah nikel hijau. Istilah tersebut dipakai bagi pengolahan yang listriknya justru bertumpu pada pembangkit batu bara di dalam kawasan. Teori ini membaca pemakaian istilah semacam itu sebagai alat pembenar, bukan sekadar pilihan kata."));

/* ================= BAGIAN 6 ================= */
k.push(H1("Bagian 6  Sintesis penilaian dan evaluasi klaim"));

k.push(H2("6.1  Matriks sembilan penilaian"));
const mW = [560, 2300, 2100, CW - 560 - 2300 - 2100];
k.push(P("Tabel 4  Hasil pengujian sembilan teori", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(mW, [
  thead(["No", "Teori", "Penilaian", "Dasar penilaian"], mW),
  trow(["1", "Egoism", "Netral", "Biaya tertunda belum diinternalisasi"], mW),
  trow(["2", "Utilitarianism", "Ambivalen", "Act mendukung, rule menolak"], mW),
  trow(["3", "Ethics of duty", "Menolak", "Maksimnya gugur ketika diuniversalkan"], mW),
  trow(["4", "Ethics of rights", "Bersyarat", "Sebagian hak terpenuhi, sebagian terlanggar"], mW),
  trow(["5", "Justice", "Menolak", "Distribusi dan prosedurnya timpang"], mW),
  trow(["6", "Virtue ethics", "Menolak pembanding", "Diukur pada masa lalu, bukan standar terbaik"], mW),
  trow(["7", "Ethic of care", "Menuntut pemulihan", "Relasi rusak, tetapi tidak menuntut penghentian"], mW),
  trow(["8", "Discourse ethics", "Menolak prosedur", "Pihak terdampak absen dalam perumusan"], mW),
  trow(["9", "Postmodern ethics", "Relativistik", "Istilah dipakai sebagai alat pembenar"], mW)
]));
k.push(SPACER(140));
k.push(P("Rekapitulasinya enam menolak, satu bersyarat, satu ambivalen, dan satu netral karena mengakui keterbatasan teorinya sendiri. Tidak satu pun dari sembilan teori memberikan dukungan tanpa syarat."));

k.push(H2("6.2  Empat proposisi"));
k.push(P("Dari kesembilan penilaian tersebut dapat ditarik empat proposisi yang berlaku lintas teori."));
k.push.apply(k, NUMS([
 [b("Perbandingan dengan masa lalu tidak bernilai normatif. "), t("Kondisi yang lebih baik daripada ekspor bijih mentah tidak dengan sendirinya memadai. Virtue ethics menuntut pembanding pada standar tertinggi yang tersedia, bukan pada keadaan sebelumnya.")],
 [b("Klaim hijau gugur pada sumber energinya. "), t("Pengolahan yang bertumpu pada pembangkit batu bara di dalam kawasan tidak dapat disebut hijau. Postmodern ethics membaca pemakaian istilah tersebut sebagai alat pembenar.")],
 [b("Distribusi manfaat dan bebannya timpang. "), t("Hanya 4,35 persen nilai tambah tinggal di daerah, sementara kabupaten penghasil lebih miskin daripada rata-rata provinsinya. Prinsip kedua Rawls tidak terpenuhi.")],
 [b("Prosesnya cacat sejak perumusan. "), t("Warga terdampak tidak menjadi pihak dalam perizinan dan perencanaan kawasan. Discourse ethics membatalkan hasil yang lahir dari proses semacam itu.")]
]));

k.push(H2("6.3  Batas argumen"));
k.push(P("Ada dua hal yang perlu dipisahkan agar kesimpulan ini tidak dibaca melampaui yang dimaksudkan."));
k.push(P([b("Pertama"), t(", penolakan atas klaim nikel hijau tidak setara dengan penolakan atas hilirisasi. Yang gugur adalah klaim bahwa kebijakan ini sudah etis, bukan kebijakan hilirisasinya. Keduanya persoalan yang terpisah dan dapat dinilai secara terpisah pula.")]));
k.push(P([b("Kedua"), t(", legalitas dan etika dua penilaian yang berbeda. Putusan panel WTO menilai kepatuhan pada aturan perdagangan, sedangkan pengujian dalam dokumen ini menyangkut distribusi manfaat, kondisi kerja, dan keterwakilan pihak terdampak. Sebuah kebijakan dapat sah secara hukum dagang namun tetap bermasalah secara etis, dan sebaliknya.")]));

/* ================= BAGIAN 7 ================= */
k.push(H1("Bagian 7  Simpulan dan implikasi manajerial"));

k.push(H2("7.1  Tiga temuan"));
k.push.apply(k, NUMS([
 [b("Konvergensi, bukan kesepakatan. "), t("Sembilan teori berangkat dari premis yang berbeda, namun mayoritasnya bermuara pada arah yang sama. Inilah bukti terkuat bagi pendekatan pluralis yang diajukan Crane dan Matten. Kesimpulan yang dicapai lewat konvergensi jauh lebih kuat daripada kesimpulan satu teori tunggal, sebab ia tidak bergantung pada penerimaan atas satu asumsi tertentu.")],
 [b("Klaim etis yang gugur, bukan kebijakannya. "), t("Upah, keselamatan, lingkungan, dan sumber energinya seluruhnya tetap terbuka untuk diperbaiki. Perbaikan pada keempat titik itu akan mengubah hasil pengujian secara langsung.")],
 [b("Kasus yang masih berlangsung. "), t("Kebijakannya masih berjalan, sengketa dagangnya belum tuntas, dan angkanya berubah tiap tahun. Kasus yang belum selesai justru paling layak didiskusikan, sebab kesimpulannya masih dapat memengaruhi arah kebijakannya.")]
]));

k.push(H2("7.2  Tiga implikasi manajerial"));
const imW = [3000, CW - 3000];
k.push(TABLE(imW, [
  thead(["Tindak lanjut", "Isi"], imW),
  trow([[P("Internalisasi biaya tertunda", { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })],
        "Biaya kesehatan warga, pemulihan sungai, dan pensiun dini pembangkit dimasukkan ke dalam neraca sejak tahap perencanaan, bukan diakui setelah persoalannya muncul."], imW),
  trow([[P("Pelibatan pihak yang absen", { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })],
        "Pekerja, warga hilir sungai, dan masyarakat adat diberi keterwakilan formal dalam panitia keselamatan kerja dan dalam proses perizinan kawasan."], imW),
  trow([[P("Pengujian multiteori", { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })],
        "Setiap klaim keberlanjutan diuji dengan lebih dari satu teori. Klaim yang lolos utilitarianism kerap gugur pada keadilan distributif dan discourse ethics."], imW)
]));
k.push(SPACER(160));
k.push(NOTE("KALIMAT PENUTUP",
 "Manfaat yang terukur selalu lebih mudah dipertahankan daripada beban yang tersebar. Justru karena itu, beban yang tersebar perlu dihitung lebih dahulu.", "FBEAF2"));

/* ================= LAMPIRAN ================= */
k.push(H1("Lampiran A  Glosarium istilah", { pageBreak: true }));
const glW = [3000, CW - 3000];
const GLOS = [
 ["A priori", "Pengetahuan atau prinsip yang diperoleh lewat penalaran, tanpa bersandar pada pengalaman."],
 ["Act utilitarianism", "Penilaian utilitarian atas satu tindakan tunggal berdasarkan akibat tindakan itu sendiri."],
 ["Categorical imperative", "Perintah moral tanpa syarat pada Kant, dirumuskan dalam beberapa formulasi, dua di antaranya universal acceptability dan respect for persons."],
 ["Deontologis", "Pendekatan yang menilai kewajiban dan prinsip di balik tindakan, bukan akibatnya."],
 ["Enlightened egoism", "Pandangan bahwa pelaku menyokong lingkungan sosial dan ekologisnya karena hal itu menguntungkan dirinya sendiri dalam jangka panjang."],
 ["Eudaimonia", "Hidup yang baik dan berkembang penuh, tujuan akhir dalam virtue ethics."],
 ["Hypernorms", "Prinsip yang berlaku lintas komunitas dalam Integrative Social Contracts Theory."],
 ["Ideal speech situation", "Syarat deliberasi pada discourse ethics: semua pihak boleh ikut, bebas paksaan, dan argumen dinilai dari kekuatannya sendiri."],
 ["Keadilan distributif", "Penilaian atas ke mana manfaat mengalir dan siapa yang menanggung bebannya."],
 ["Keadilan prosedural", "Penilaian atas siapa yang berhak turut memutuskan dan apakah prosesnya terbuka."],
 ["Konsekuensialis", "Pendekatan yang menilai tindakan dari akibatnya. Disebut juga teleologis."],
 ["Rule utilitarianism", "Penilaian utilitarian atas kelas tindakan dan prinsip di baliknya dalam jangka panjang."],
 ["UNGP", "United Nations Guiding Principles on Business and Human Rights (2011), kerangka protect, respect, remedy."],
 ["Veil of ignorance", "Alat uji Rawls: memilih susunan tanpa mengetahui posisi yang akan ditempati sendiri."]
];
k.push(TABLE(glW, [thead(["Istilah", "Pengertian"], glW)].concat(GLOS.map(function (g) {
  return trow([[P(g[0], { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })], g[1]], glW);
}))));

k.push(H1("Lampiran B  Pertanyaan untuk diskusi"));
k.push(P("Enam pertanyaan berikut dapat dipakai untuk memperluas pembahasan, baik dalam kelas maupun sebagai bahan tulisan lanjutan."));
k.push.apply(k, NUMS([
 "Bila act utilitarianism dan rule utilitarianism menghasilkan kesimpulan yang berlawanan, atas dasar apa salah satunya dipilih?",
 "Sampai sejauh mana perusahaan pembeli di negara lain menanggung tanggung jawab atas kondisi kerja pada pemasoknya, dan apa dasarnya menurut UN Guiding Principles?",
 "Apakah keberatan imperialisme kultural cukup kuat untuk membatalkan kritik atas kondisi kerja di kawasan pengolahan? Bagaimana Sen (2000) menjawabnya?",
 "Bagaimana bentuk keterwakilan formal yang memenuhi syarat discourse ethics tanpa membuat proses perizinan menjadi tidak dapat dijalankan?",
 "Struktur dilema yang sama akan berulang pada bauksit, tembaga, dan timah. Pelajaran mana dari kasus nikel yang dapat dipindahkan, dan mana yang tidak?",
 "Jika kelompok Anda diminta merancang indikator keberlanjutan bagi kawasan pengolahan, indikator apa yang akan menangkap beban yang selama ini tidak masuk neraca?"
]));

k.push(H1("Daftar rujukan"));
const REF = [
 "Crane, A., Matten, D., Glozer, S., dan Spence, L. (2019). Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization. Edisi kelima. Oxford: Oxford University Press, Bab 3.",
 "Donaldson, T., dan Dunfee, T. W. (1999). Ties That Bind: A Social Contracts Approach to Business Ethics. Boston: Harvard Business School Press.",
 "Gilligan, C. (1982). In a Different Voice: Psychological Theory and Women's Development. Cambridge: Harvard University Press.",
 "Habermas, J. (1990). Moral Consciousness and Communicative Action. Cambridge: MIT Press.",
 "Kant, I. (1785). Groundwork of the Metaphysics of Morals.",
 "Rawls, J. (1971). A Theory of Justice. Cambridge: Harvard University Press.",
 "Sen, A. (2000). Development as Freedom. New York: Anchor Books.",
 "United Nations (1948). Universal Declaration of Human Rights.",
 "United Nations (2011). Guiding Principles on Business and Human Rights: Implementing the United Nations Protect, Respect and Remedy Framework.",
 "Peraturan Menteri Energi dan Sumber Daya Mineral Nomor 11 Tahun 2019 tentang Perubahan Kedua atas Peraturan Menteri ESDM Nomor 25 Tahun 2018 tentang Pengusahaan Pertambangan Mineral dan Batubara.",
 "World Trade Organization (2022). Indonesia: Measures Relating to Raw Materials, DS592, Laporan Panel."
];
REF.forEach(function (r) {
  k.push(P(r, { size: 20, after: 100, line: 288, indent: { left: 400, hanging: 400 }, justify: false, align: AlignmentType.LEFT }));
});
k.push(SPACER(120));
k.push(P("Data kasus ditelusuri pada Agustus 2026 dari pengelola kawasan Indonesia Morowali Industrial Park dan Indonesia Weda Bay Industrial Park, Badan Pusat Statistik, serta dokumen putusan panel World Trade Organization.",
  { size: 18, italics: true, color: MUTE }));

const fs = require("fs");
C.D.Packer.toBuffer(buildDoc("Materi Bacaan Business Ethics", k,
  "Materi Bacaan  |  Evaluating Business Ethics  |  MAN5522 MBA UGM")).then(function (buf) {
  fs.writeFileSync(process.argv[2] || "Materi-Bacaan.docx", buf);
  console.log("WROTE materi");
});
