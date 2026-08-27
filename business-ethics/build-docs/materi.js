const C = require("./common");
const { P, H1, H2, H3, SPACER, BULLETS, NUMS, TABLE, thead, trow, NOTE,
        buildDoc, TITLEBLOCK, AlignmentType, BLUE, INK, MUTE, PINK, GREEN, SANS, SERIF, CW } = C;

const k = [];
const b = function (t) { return { text: t, bold: true }; };
const i = function (t) { return { text: t, italics: true }; };
const t = function (x) { return { text: x }; };
const HEAD = function (x) { return [P(x, { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })]; };

k.push.apply(k, TITLEBLOCK(
  "MATERI BACAAN  |  MAN5522 BUSINESS ETHICS FOR SUSTAINABILITY",
  "Evaluating Business Ethics: Normative Ethical Theories",
  "Bab 3 Crane dan Matten dalam bahasa sederhana, beserta penerapannya pada hilirisasi nikel Indonesia"));

const idW = [1900, CW - 1900];
k.push(TABLE(idW, [
  trow(["Mata kuliah", "Business Ethics for Sustainability (MAN5522), MBA Universitas Gadjah Mada"], idW),
  trow(["Rujukan utama", "Crane, A., Matten, D., Glozer, S., dan Spence, L. (2019). Business Ethics: Managing Corporate Citizenship and Sustainability in the Age of Globalization, edisi kelima, Bab 3"], idW),
  trow(["Penyusun", "Aslih Abnuri (25/574338/PEK/31801), Arfinal Diputra (25/574664/PEK/31914), Rohana Dwi Hardianti (25/574077/PEK/31728)"], idW),
  trow(["Fungsi dokumen", "Bahan bacaan pendamping presentasi 21 slide, ditulis supaya bisa dibaca sendiri tanpa decknya"], idW)
]));
k.push(SPACER(180));

k.push(NOTE("CARA MEMBACA DOKUMEN INI",
 "Bagian 1 sampai 3 menjelaskan alat ujinya, yaitu sembilan teori etika. Bagian 4 sampai 7 memakai alat itu untuk membedah satu kebijakan nyata. Kalau Anda sudah paham teorinya, langsung saja ke Bagian 4. Nomor satu sampai sembilan dipakai konsisten di seluruh dokumen, jadi kalau lupa teori nomor berapa, tinggal balik ke Tabel 1."));
k.push(SPACER(180));

/* ================= RINGKASAN ================= */
k.push(H1("Ringkasan"));
k.push(P("Bab 3 buku Crane dan Matten memberi kita sembilan cara untuk menilai apakah sebuah keputusan bisnis itu benar atau salah. Kesembilan cara ini tidak saling meniadakan. Bukunya justru mengajak kita memakai semuanya, lalu melihat ke mana arah jawabannya bertemu."));
k.push(P("Dokumen ini terbagi dua. Bagian awal menjelaskan kesembilan alat uji itu. Bagian akhir memakainya untuk membedah satu kebijakan yang masih berjalan sampai hari ini, yaitu larangan ekspor bijih nikel mentah yang berlaku di Indonesia sejak Januari 2020."));
k.push(P("Hasil pengujiannya: enam teori menolak, satu setuju dengan syarat, satu terbelah, dan satu netral. Tidak ada satu pun yang setuju tanpa syarat. Tapi perlu digarisbawahi sejak awal: yang gugur itu klaim bahwa kebijakan ini sudah etis, bukan kebijakannya. Ada empat titik yang bermasalah, dan keempatnya masih bisa diperbaiki tanpa menghentikan kebijakannya."));

/* ================= BAGIAN 1 ================= */
k.push(H1("Bagian 1  Kenapa kita butuh teori etika", { pageBreak: true }));

k.push(H2("1.1  Apa itu teori etika normatif"));
k.push(P([t("Crane dan Matten (2019: 87) merumuskannya begini: teori etika normatif adalah "), b("seperangkat aturan, pedoman, dan cara berpikir untuk menentukan mana yang benar dan mana yang salah"), t(".")]));
k.push(P("Ada satu pembedaan yang perlu dipegang sejak awal. Kalau kita bilang di negara tertentu memberi amplop kepada pejabat adalah hal biasa, itu pengamatan. Kita cuma melaporkan apa yang terjadi. Tapi kalau kita bilang memberi amplop kepada pejabat itu salah, itu penilaian. Kita sedang menghakimi. Teori etika normatif bekerja di kalimat jenis kedua."));
k.push(P("Kata normatif memang terdengar berat. Artinya sederhana saja: berisi norma, yaitu ukuran benar dan salah. Lawannya deskriptif, yang cuma memerikan kenyataan tanpa menilai."));

k.push(H2("1.2  Buat apa repot pakai teori"));
k.push(P("Untuk urusan pribadi, kita jarang perlu teori. Kita tahu membohongi teman itu tidak benar tanpa harus membuka buku filsafat. Perasaan kita sudah cukup."));
k.push(P("Keputusan perusahaan berbeda. Keputusan itu harus bisa dijelaskan kepada banyak pihak yang kepentingannya bertabrakan: pemegang saham, pemerintah, pekerja, konsumen, sampai warga di sekitar pabrik. Di situ perasaan saja tidak cukup. Ada tiga hal yang bisa dikerjakan teori."));
k.push.apply(k, NUMS([
 [b("Teori merapikan perasaan menjadi alasan. "), t("Kita sering merasa sesuatu itu salah tapi susah menjelaskan kenapa. Teori membantu mengubah perasaan itu menjadi alasan yang bisa diperiksa orang lain. Jadi teori tidak menggantikan hati nurani, dia merapikannya.")],
 [b("Teori membuat perdebatan jadi mungkin. "), t("Kalau dua orang berangkat dari nilai yang berbeda, tanpa teori ujungnya cuma selera lawan selera, dan itu buntu. Dengan teori, keduanya bisa beradu argumen di lapangan yang sama.")],
 [b("Keputusan bisnis butuh pertanggungjawaban. "), t("Perusahaan harus bisa menunjukkan alasannya secara runtut, bukan cuma bilang menurut kami begitu. Apalagi kalau keputusannya nanti dipersoalkan publik.")]
]));

k.push(H2("1.3  Tiga sikap dasar sebelum memakai teori"));
k.push(P("Sebelum memakai teori apa pun, kita perlu menentukan dulu sikap dasarnya: seberapa luas sebuah aturan moral berlaku? Ada tiga pilihan."));
const posW = [2300, CW - 2300];
k.push(TABLE(posW, [
  thead(["Sikap", "Isinya"], posW),
  trow([HEAD("Absolutisme"), "Ada aturan moral yang berlaku untuk semua orang, di mana pun dan kapan pun. Benar ya benar, salah ya salah, tidak tergantung situasi. Hampir semua teori modernis Barat berdiri di sini."], posW),
  trow([HEAD("Relativisme"), "Tidak ada benar salah yang berlaku universal. Semua tergantung budaya, kebiasaan, dan keyakinan masing-masing tempat."], posW),
  trow([HEAD("Pluralisme"), "Nilai yang bertentangan bisa sama-sama masuk akal. Kita tidak bilang semua pendapat benar, tapi kita juga tidak memaksakan satu pendapat sebagai satu-satunya kebenaran. Inilah sikap yang dipilih Crane dan Matten."], posW)
]));
k.push(SPACER(140));
k.push(P("Bedanya paling gampang dilihat lewat contoh suap. Orang absolutis bilang suap selalu salah di mana pun. Orang relativis bilang tergantung negaranya. Orang pluralis bertanya hal yang berbeda: dari semua alasan yang ada, mana yang paling kuat kalau diadu?"));
k.push(P("Sikap pluralis inilah yang membuat pendekatan sembilan teori masuk akal. Tujuannya bukan mencari satu teori paling benar, tapi melihat apakah sembilan sudut pandang yang berbeda ternyata menunjuk ke arah yang sama. Kalau iya, kesimpulannya jadi jauh lebih kuat."));
k.push(P("Satu catatan tentang relativisme. Argumen ini sering dipakai untuk menolak kritik dari luar dengan alasan budaya kita berbeda. Amartya Sen (2000) menunjukkan bahwa nilai seperti keselamatan kerja dan hak untuk ikut menentukan nasib sendiri itu bukan monopoli budaya mana pun. Jadi alasan perbedaan budaya tidak otomatis membatalkan kritik."));

k.push(H2("1.4  Peta sembilan teori"));
k.push(P("Sembilan teori di Bab 3 terbagi dua kelompok. Kelompok pertama lahir dari zaman Pencerahan di Eropa abad ke-18. Sifatnya seperti rumus: sekali dipegang, bisa dipakai di situasi apa pun. Kelompok kedua lahir belakangan, justru karena banyak orang tidak puas dengan kelompok pertama."));
const klW = [560, 2350, 2200, CW - 560 - 2350 - 2200];
k.push(P("Tabel 1  Sembilan teori etika normatif", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(klW, [
  thead(["No", "Teori", "Kelompok", "Yang dinilai"], klW),
  trow(["1", "Egoism", "Modernis, menilai hasil", "Untung rugi bagi pelakunya sendiri"], klW),
  trow(["2", "Utilitarianism", "Modernis, menilai hasil", "Untung rugi bagi semua yang kena dampak"], klW),
  trow(["3", "Ethics of duty", "Modernis, menilai prinsip", "Aturan dan niat di balik tindakan"], klW),
  trow(["4", "Ethics of rights", "Modernis, menilai prinsip", "Hak siapa terpenuhi, hak siapa dilanggar"], klW),
  trow(["5", "Justice", "Modernis, menilai prinsip", "Adil tidaknya pembagian untung dan beban"], klW),
  trow(["6", "Virtue ethics", "Alternatif", "Karakter orang yang melakukannya"], klW),
  trow(["7", "Ethic of care", "Alternatif", "Hubungan dengan pihak yang terdampak"], klW),
  trow(["8", "Discourse ethics", "Alternatif", "Proses saat aturannya dibuat"], klW),
  trow(["9", "Postmodern ethics", "Alternatif", "Bahasa dan istilah yang dipakai"], klW)
]));
k.push(SPACER(140));
k.push(P("Satu hal yang perlu disadari: setiap teori ini berangkat dari asumsi tertentu tentang manusia dan dunia. Kalau kita menerima asumsinya, kita akan menerima kesimpulannya. Karena itu, ketika dua teori memberi jawaban berbeda, yang sebenarnya berbeda sering kali bukan faktanya, melainkan asumsi tentang siapa yang perlu diperhitungkan dan apa yang dianggap baik."));

/* ================= BAGIAN 2 ================= */
k.push(H1("Bagian 2  Lima teori modernis Barat"));

k.push(H2("2.1  Egoism, teori kepentingan diri"));
k.push(P([b("Aturannya. "), t("Sebuah tindakan itu benar kalau semua orang bebas mengejar kepentingannya sendiri, baik yang jangka pendek maupun jangka panjang.")]));
k.push(P([b("Yang sering keliru. "), t("Egois itu bukan serakah. Orang egois masih bisa peduli pada orang lain, terutama kalau kepedulian itu ada gunanya buat dia. Orang serakah sudah tidak peduli sama sekali. Bedanya di situ.")]));
k.push(P([b("Tokohnya. "), t("Thomas Hobbes lewat bukunya Leviathan, yang menggambarkan manusia tanpa aturan sebagai perang semua melawan semua, dan Ayn Rand lewat The Virtue of Selfishness.")]));
k.push(P([b("Versi yang paling berguna untuk bisnis"), t(" disebut "), i("enlightened egoism"), t(", atau egoisme yang cerdas. Intinya: perusahaan menjaga lingkungan dan masyarakat sekitarnya justru karena itu menguntungkan dirinya sendiri dalam jangka panjang. Pabrik yang mencemari sungai akhirnya kena biaya juga, entah lewat protes warga, denda, atau reputasi yang rusak.")]));
k.push(P([b("Kelemahannya. "), t("Teori ini cuma jalan kalau pasar berfungsi baik, artinya tidak ada pihak yang bisa seenaknya merugikan pihak lain tanpa konsekuensi. Begitu bicara lingkungan, teori ini macet. Kenapa? Karena yang menanggung kerusakan lingkungan adalah anak cucu kita, dan mereka belum lahir. Mereka tidak bisa ikut menawar hari ini.")]));

k.push(H2("2.2  Utilitarianism, teori manfaat terbesar"));
k.push(P([b("Aturannya. "), t("Sebuah tindakan itu benar kalau menghasilkan manfaat terbesar untuk orang sebanyak-banyaknya. Perumusnya Jeremy Bentham dan John Stuart Mill.")]));
k.push(P([b("Kenapa populer di bisnis. "), t("Karena cara kerjanya mirip hitung-hitungan untung rugi yang sudah biasa dipakai perusahaan. Jumlahkan semua manfaat, kurangi semua kerugian, lihat sisanya positif atau negatif.")]));
k.push(P([b("Empat ciri pokoknya. "), t("Pertama, yang dinilai akibatnya, bukan niatnya. Kedua, kebaikan diukur dari senang dikurangi susah. Ketiga, yang dicari hasil bersih terbesar. Keempat, semua orang yang kena dampak wajib ikut dihitung, bukan cuma diri kita atau perusahaan kita.")]));
k.push(P([b("Bagian terpenting: bedanya "), i("act"), b(" dan "), i("rule"), b(". "), i("Act utilitarianism"), t(" menilai satu kejadian saja: kali ini, manfaatnya lebih besar atau tidak? "), i("Rule utilitarianism"), t(" bertanya lebih jauh: kalau tindakan seperti ini dijadikan aturan umum dan semua orang melakukannya, dunia jadi lebih baik atau lebih buruk?")]));
k.push(P("Keduanya sama-sama utilitarianism dan memakai data yang sama, tapi jawabannya bisa bertolak belakang. Bedanya cuma satu: yang dinilai satu kejadian, atau satu kelas tindakan. Simpan baik-baik pembedaan ini, karena persis inilah yang terjadi pada kasus nikel nanti."));
k.push(P([b("Kelemahannya ada empat. "), t("Manfaat itu susah diukur dan sering subjektif. Semua orang dihitung sama rata, padahal posisinya tidak sama. Banyak akibat yang tidak berbentuk uang jadi susah dimasukkan hitungan. Dan yang paling serius: angka total yang bagus bisa menyembunyikan penderitaan kelompok kecil. Kalau seratus orang untung dan sepuluh orang menderita berat, hitungannya tetap positif, padahal ada yang tidak beres.")]));

k.push(H2("2.3  Ethics of duty, teori kewajiban dari Kant"));
k.push(P([b("Aturannya. "), t("Immanuel Kant membalik cara pandang dua teori sebelumnya. Baginya hasil itu tidak penting. Yang penting prinsip dan niat di balik tindakan. Perbuatan baik yang dilakukan demi pamrih, bagi Kant, tidak bernilai moral.")]));
k.push(P([b("Uji pertama: bisakah aturan ini berlaku untuk semua orang? "), t("Contoh dari Kant sendiri: ingkar janji. Coba bayangkan semua orang boleh ingkar janji kapan saja. Kalau begitu tidak ada lagi yang percaya pada janji, dan janji jadi tidak ada artinya. Aturannya menghancurkan dirinya sendiri. Berarti ingkar janji itu salah.")]));
k.push(P([b("Uji kedua: apakah manusia diperlakukan sebagai manusia? "), t("Kata Kant, orang tidak boleh dipakai sekadar sebagai alat untuk mencapai tujuan kita. Dari sinilah lahir gagasan bahwa perusahaan wajib peduli pada semua pihak yang terdampak, bukan cuma pada pemilik modal.")]));
k.push(P([b("Cara pakainya singkat. "), t("Tulis aturan tindakannya dalam satu kalimat, lalu bayangkan semua orang melakukannya. Kalau jadi kacau atau membatalkan dirinya sendiri, berarti salah.")]));
k.push(P([b("Kelemahannya. "), t("Hasil sama sekali tidak dihitung, padahal dalam praktik hasil itu penting. Kriteria niatnya terlalu sempit. Dan Kant menganggap semua orang selalu berpikir jernih dan rasional, yang jelas tidak sesuai kenyataan.")]));

k.push(H2("2.4  Ethics of rights, teori hak asasi"));
k.push(P([b("Aturannya. "), t("Setiap manusia lahir membawa hak dasar yang tidak bisa dicabut siapa pun. John Locke merumuskan tiga yang paling pokok: hak hidup, hak atas kebebasan, dan hak atas milik.")]));
k.push(P([b("Kenapa paling sering dipakai. "), t("Karena teori ini sudah jadi aturan resmi di mana-mana, mulai dari Deklarasi Universal Hak Asasi Manusia tahun 1948. Jadi tidak perlu berdebat filsafat dulu, tinggal merujuk dokumen yang sudah disepakati banyak negara.")]));
k.push(P([b("Yang sering dilupakan. "), t("Setiap hak selalu menciptakan kewajiban di pihak lain. Kalau warga punya hak atas air bersih, berarti ada pihak yang wajib tidak mencemari sungainya. Inilah yang membuat bahasa hak gampang diterjemahkan jadi kewajiban perusahaan.")]));
k.push(P([b("Aturan main untuk bisnis. "), t("Rujukannya pedoman PBB tahun 2011 yang dikenal sebagai UNGP. Pembagiannya jelas: negara melindungi, perusahaan menghormati, dan korban harus punya jalan untuk menuntut pemulihan.")]));
k.push(P([b("Satu poin yang menentukan. "), t("Tanggung jawab perusahaan ikut mengalir lewat rantai bisnisnya. Perusahaan tetap wajib peduli pada masalah yang terjadi di pemasoknya, walaupun bukan dia yang menyebabkan. Poin inilah yang menghubungkan pembeli mobil listrik di Eropa dengan kondisi kerja di Halmahera.")]));
k.push(P([b("Kelemahannya. "), t("Daftar hak bisa saling bertabrakan. Hak atas pekerjaan bisa berbenturan dengan hak atas lingkungan sehat, dan teori ini tidak memberi tahu kita mana yang harus didahulukan.")]));

k.push(H2("2.5  Justice, teori keadilan"));
k.push(P([b("Pertanyaannya bergeser. "), t("Bukan lagi tindakan ini benar atau salah, melainkan pembagiannya adil atau tidak.")]));
k.push(P([b("Dua macam keadilan. "), t("Pertama soal proses: siapa yang boleh ikut memutuskan? Kedua soal pembagian: untungnya mengalir ke mana, ruginya ditanggung siapa? Sebuah kebijakan bisa lolos di satu sisi dan gagal di sisi lain.")]));
k.push(P([b("Alat uji John Rawls. "), t("Rawls memberi satu alat yang sangat mudah dipakai, namanya "), i("veil of ignorance"), t(" atau selubung ketidaktahuan. Begini caranya. Bayangkan Anda harus memilih aturan main untuk sebuah masyarakat, tapi Anda belum tahu akan lahir jadi siapa di dalamnya. Bisa jadi pemilik pabrik, bisa jadi buruh, bisa jadi warga di pinggir sungai yang tercemar. Aturan yang Anda pilih dalam kondisi buta seperti itu, itulah yang adil. Sebab kalau kita tahu posisi kita, kita cenderung memilih aturan yang menguntungkan diri sendiri.")]));
k.push(P([b("Dua prinsip Rawls. "), t("Pertama, kebebasan dasar harus sama untuk semua. Kedua, ketimpangan boleh ada, asalkan susunan itu paling menguntungkan orang yang paling lemah posisinya.")]));
k.push(P([b("Turunannya. "), t("Teori kontrak sosial dari Hobbes, Locke, dan Rousseau. Versi bisnisnya bernama "), i("Integrative Social Contracts Theory"), t(" dari Donaldson dan Dunfee, yang menggabungkan prinsip universal dengan kesepakatan lokal tiap komunitas. Berguna kalau standar global dan kebiasaan setempat berbenturan.")]));

k.push(H2("2.6  Enam kelemahan kelompok pertama"));
k.push(P("Kelima teori tadi kuat, tapi bukunya sendiri mencatat enam kelemahan. Dari kelemahan inilah lahir empat teori alternatif di bagian berikutnya."));
k.push.apply(k, NUMS([
 [b("Terlalu melayang. "), t("Prinsipnya bekerja di tataran yang jauh dari masalah nyata sehari-hari seorang manajer.")],
 [b("Terlalu menyederhanakan. "), t("Tiap teori cuma melihat satu sisi moralitas, tapi merasa sudah melihat seluruhnya.")],
 [b("Terlalu elitis. "), t("Kebenaran ditentukan lewat pemikiran para ahli, bukan lewat pengalaman orang yang benar-benar mengalaminya.")],
 [b("Terlalu dingin. "), t("Hubungan pribadi dan rasa dekat dengan pihak tertentu malah dianggap mengganggu penilaian yang seharusnya netral.")],
 [b("Terlalu mendewakan logika. "), t("Peran empati, perasaan, dan dorongan hati dibuang dari perhitungan.")],
 [b("Terlalu Barat. "), t("Pengalaman dan cara berpikir Eropa dianggap berlaku untuk seluruh dunia.")]
]));
k.push(SPACER(60));
k.push(NOTE("CATATAN",
 "Teori alternatif bukan pengganti teori modernis. Dia menambah hal yang belum tercakup, yaitu karakter pelakunya, hubungan antarpihak, proses pembuatan aturan, dan pilihan kata. Karena itu di Bagian 5 nanti keduanya dipakai bersama, bukan dipertentangkan."));

/* ================= BAGIAN 3 ================= */
k.push(H1("Bagian 3  Empat teori alternatif"));

k.push(H2("3.1  Virtue ethics, teori keutamaan"));
k.push(P([b("Pertanyaannya. "), t("Bukan tindakan mana yang benar, tapi orang seperti apa yang pantas disebut baik di posisi ini?")]));
k.push(P([b("Akarnya. "), t("Aristoteles lewat Nicomachean Ethics, lalu diteruskan Alasdair MacIntyre dan Robert Solomon.")]));
k.push(P([b("Gagasan intinya. "), t("Karakter yang baik itu dibentuk dari kebiasaan, bukan dari hafalan aturan. Orang jujur bukan karena membaca peraturan tentang kejujuran, tapi karena terbiasa jujur sejak kecil. Tujuan akhirnya disebut "), i("eudaimonia"), t(", yaitu hidup yang baik dan berkembang penuh. Dalam bisnis, perusahaan dilihat sebagai komunitas yang punya keutamaan bersama: jujur, adil, bisa dipercaya, dan tangguh.")]));
k.push(P([b("Yang sering disalahpahami. "), t("Teori ini dikira cuma nasihat moral. Padahal dia punya satu pertanyaan yang sangat tajam dan sangat praktis: kalau kita bilang sesuatu sudah cukup baik, cukup baik dibanding apa? Pilihan pembanding itulah yang jadi sasaran kritiknya.")]));
k.push(P([b("Kelemahannya. "), t("Baik itu selalu menurut ukuran komunitas tertentu, jadi susah dipakai sebagai patokan lintas budaya dan lintas industri.")]));

k.push(H2("3.2  Ethic of care, teori kepedulian"));
k.push(P([b("Pertanyaannya. "), t("Solusi mana yang menjaga hubungan dengan pihak yang terdampak, bukan sekadar mengganti kerugiannya dengan uang?")]));
k.push(P([b("Tokohnya. "), t("Carol Gilligan lewat In a Different Voice dan Nel Noddings lewat Caring. Akarnya dari etika feminis.")]));
k.push(P([b("Gagasan intinya. "), t("Manusia itu tidak hidup sendiri-sendiri. Kita saling terhubung dan saling bergantung. Karena itu yang dinilai bukan kepatuhan pada aturan seragam, tapi bagaimana kita menjaga hubungan dengan orang tertentu secara nyata: empati, tidak merugikan, dan tanggung jawab yang konkret.")]));
k.push(P([b("Yang khas dari teori ini. "), t("Dia jarang menuntut sebuah kegiatan dihentikan. Yang dituntutnya hubungan yang rusak itu dipulihkan. Karena itu rekomendasinya sering berbeda dari teori keadilan, walaupun keprihatinannya sama.")]));
k.push(P([b("Kelemahannya. "), t("Karena mengutamakan yang dekat, teori ini berisiko melupakan yang jauh. Dan ukuran peduli itu susah diaudit secara seragam.")]));

k.push(H2("3.3  Discourse ethics, teori musyawarah"));
k.push(P([b("Pertanyaannya. "), t("Siapa yang hadir dan siapa yang absen ketika aturannya dibuat?")]));
k.push(P([b("Tokohnya. "), t("Jurgen Habermas bersama Karl Otto Apel.")]));
k.push(P([b("Gagasan intinya. "), t("Aturan yang baik tidak diturunkan dari atas oleh ahli atau penguasa, tapi lahir dari musyawarah semua pihak yang akan terkena dampaknya. Syarat musyawarahnya ketat, disebut "), i("ideal speech situation"), t(": semua boleh ikut bicara, tidak ada yang ditekan, dan yang menang adalah argumen terkuat, bukan orang terkuat.")]));
k.push(P([b("Akibatnya penting sekali. "), t("Karena yang dinilai prosesnya, maka proses yang cacat membatalkan hasilnya. Sebagus apa pun hasil sebuah kebijakan, kalau pihak terdampak tidak pernah diajak bicara, keputusan itu tidak sah secara etis.")]));
k.push(P([b("Kelemahannya. "), t("Syarat musyawarah idealnya nyaris mustahil terpenuhi sepenuhnya. Jadi teori ini lebih berguna sebagai alat ukur seberapa jauh sebuah proses menyimpang, ketimbang sebagai resep yang benar-benar bisa dijalankan.")]));

k.push(H2("3.4  Postmodern ethics, teori yang curiga pada kata"));
k.push(P([b("Pertanyaannya. "), t("Istilah yang dipakai untuk menamai sesuatu itu menguntungkan siapa?")]));
k.push(P([b("Tokohnya. "), t("Zygmunt Bauman lewat Postmodern Ethics, dengan latar pemikiran Jacques Derrida dan Jean-Francois Lyotard.")]));
k.push(P([b("Gagasan intinya. "), t("Dorongan hati dan perasaan justru didahulukan di atas perhitungan rasional. Menurut Bauman, tindakan etis lebih sering digerakkan naluri daripada kalkulasi. Kritiknya diarahkan ke organisasi: prosedur, pembagian tugas, dan jarak birokrasi menciptakan jarak moral. Orang jadi merasa tidak bertanggung jawab karena dia cuma menjalankan bagian kecil dari sistem.")]));
k.push(P([b("Sikap yang dituntut. "), t("Mempertanyakan kata-kata dan asumsi yang sudah dianggap wajar, lalu bertindak di skala lokal tempat akibatnya benar-benar terasa. Teori inilah yang paling ampuh untuk membongkar istilah pemasaran yang dipakai membenarkan sebuah kebijakan.")]));
k.push(P([b("Kelemahannya. "), t("Karena menolak patokan yang tetap, teori ini susah dipakai untuk memutuskan. Dia lebih kuat sebagai alat kritik daripada sebagai pedoman bertindak.")]));

k.push(H2("3.5  Sembilan teori jadi sembilan pertanyaan"));
k.push(P("Supaya gampang dipakai, kesembilan teori tadi bisa diringkas jadi sembilan pertanyaan. Tidak ada satu pertanyaan yang bisa menjawab semuanya. Yang kita cari bukan satu jawaban benar, melainkan arah yang sama dari sembilan jawaban yang berbeda."));
const qW = [560, 2100, CW - 560 - 2100];
k.push(P("Tabel 2  Sembilan pertanyaan penilaian", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(qW, [
  thead(["No", "Teori", "Pertanyaannya"], qW),
  trow(["1", "Egoism", "Apakah semua pihak bebas mengejar kepentingan jangka panjangnya, dan sudahkah biaya yang tertunda ikut dihitung?"], qW),
  trow(["2", "Utilitarianism", "Kalau semua akibat dijumlahkan, hasilnya positif? Dan apakah jawaban act dan rule sejalan?"], qW),
  trow(["3", "Ethics of duty", "Kalau aturan tindakan ini berlaku untuk semua orang, masih masuk akal? Adakah pihak yang cuma dipakai sebagai alat?"], qW),
  trow(["4", "Ethics of rights", "Hak siapa yang terpenuhi, hak siapa yang dilanggar, dan sampai mana rantai bisnisnya menjangkau?"], qW),
  trow(["5", "Justice", "Aturan main seperti apa yang akan dipilih orang yang belum tahu akan lahir jadi siapa?"], qW),
  trow(["6", "Virtue ethics", "Bagaimana orang berkarakter baik bertindak di posisi ini, dan diukur dengan pembanding yang mana?"], qW),
  trow(["7", "Ethic of care", "Solusi mana yang menjaga hubungan dengan pihak terdampak, bukan cuma mengganti kerugiannya?"], qW),
  trow(["8", "Discourse ethics", "Siapa yang hadir dan siapa yang absen ketika aturan dan izinnya dibuat?"], qW),
  trow(["9", "Postmodern ethics", "Istilah yang dipakai untuk menamai kebijakan ini menguntungkan siapa?"], qW)
]));

/* ================= BAGIAN 4 ================= */
k.push(H1("Bagian 4  Kasus hilirisasi nikel Indonesia", { pageBreak: true }));

k.push(H2("4.1  Kebijakannya seperti apa"));
k.push(P([b("Aturannya. "), t("Peraturan Menteri ESDM Nomor 11 Tahun 2019 melarang ekspor bijih nikel mentah. Berlaku efektif 1 Januari 2020.")]));
k.push(P([b("Cara kerjanya. "), t("Mau menjual nikel? Olah dulu di dalam negeri. Dan untuk masuk kawasan industri, perusahaan harus punya smelter, yaitu pabrik peleburan yang mengubah bijih jadi bahan setengah jadi. Dengan begitu, nilai tambah yang tadinya dinikmati negara pembeli sekarang tercatat di Indonesia.")]));
k.push(P([b("Sengketanya. "), t("Uni Eropa menggugat, dan pada November 2022 panel WTO, yaitu badan penyelesaian sengketa perdagangan dunia, memutuskan kebijakan ini melanggar aturan dagang. Sengketanya belum tuntas sampai dokumen ini disusun.")]));
k.push(P("Jadi hanya satu aturan, tapi dalam waktu kurang dari lima tahun aturan itu mengubah seluruh struktur industri nikel nasional."));

k.push(H2("4.2  Urutan kejadiannya"));
const krW = [1100, CW - 1100];
k.push(TABLE(krW, [
  thead(["Tahun", "Yang terjadi"], krW),
  trow(["2014", "Larangan ekspor bijih pertama diberlakukan, tapi kemudian dilonggarkan"], krW),
  trow(["2019", "Peraturan Menteri ESDM Nomor 11 terbit"], krW),
  trow(["2020", "Larangan mulai berlaku efektif per 1 Januari"], krW),
  trow(["2022", "Panel WTO memenangkan gugatan Uni Eropa pada November"], krW),
  trow(["2025", "Nilai ekspor produk nikel olahan mencapai 40 miliar dolar"], krW)
]));
k.push(SPACER(140));

k.push(H2("4.3  Dua cerita atas fakta yang sama"));
k.push(P("Yang menarik dari kasus ini: dua pihak yang berselisih sama-sama memakai data resmi, dan dua-duanya benar. Yang mereka perselisihkan bukan angkanya, melainkan kacamata yang dipakai untuk menilai angka itu. Tabel berikut menyandingkan keduanya tanpa memihak dulu."));
const dnW = [2200, (CW - 2200) / 2, (CW - 2200) / 2];
k.push(P("Tabel 3  Dua cerita atas rangkaian fakta yang sama", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(dnW, [
  thead(["Sisi yang dilihat", "Cerita hilirisasi berdaulat", "Cerita ekstraksi berbiaya sosial"], dnW),
  trow(["Nilai ekonomi", "Ekspor produk olahan 40 miliar dolar pada 2025, naik dari 3 miliar dolar pada 2020", "Dari semua nilai tambah itu, yang tinggal di Morowali cuma 4,35 persen, sementara kemiskinannya 12,58 persen"], dnW),
  trow(["Investasi", "41,5 miliar dolar masuk ke kawasan IMIP Morowali sampai Desember 2025", "Kepemilikan dan keuntungannya terpusat di luar daerah penghasil"], dnW),
  trow(["Tenaga kerja", "166 ribu orang bekerja di IMIP dan IWIP, padahal pada 2020 baru 35.952 orang", "Upah pokoknya 3 sampai 3,6 juta per bulan, masih di bawah upah minimum Morowali 2025 yang 3,7 juta"], dnW),
  trow(["Keselamatan", "Kawasan industri terpadu dengan prosedur operasi yang terdokumentasi", "107 pekerja meninggal dan 155 luka dalam 104 kecelakaan smelter sepanjang 2019 sampai 2025"], dnW),
  trow(["Lingkungan", "Pengolahan di dalam negeri memindahkan nilai tambah dari negara pembeli ke Indonesia", "163 ribu hektare tutupan pohon hilang di Halmahera, dan 76 persen listrik kawasan ini dari pembangkit batu bara"], dnW),
  trow(["Posisi global", "Indonesia jadi simpul utama rantai pasok baterai dunia", "Sungai Ake Jira tidak lagi layak dipakai warga, dan 40 persen wilayah adat O Hongana Manyawa sudah berizin tambang"], dnW)
]));
k.push(SPACER(140));
k.push(P([b("Bentuk masalahnya yang menentukan. "), t("Manfaat kebijakan ini besar, gampang dihitung, dan jatuh ke pihak yang mudah ditunjuk. Bebannya kebalikannya: menyebar ke banyak orang, munculnya belakangan, dan susah diangkakan. Masalah dengan bentuk seperti ini tidak bisa diadili dengan satu kriteria saja, sebab satu kriteria biasanya cuma menangkap salah satu sisinya.")]));
k.push(SPACER(60));
k.push(NOTE("BATAS WAKTU DATA",
 "Semua angka di bagian ini ditelusuri pada Agustus 2026 dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, serta dokumen putusan panel WTO. Kebijakannya masih berjalan dan sengketanya belum tuntas, jadi sebagian angka akan berubah pada tahun berikutnya."));

/* ================= BAGIAN 5 ================= */
k.push(H1("Bagian 5  Menguji kasus dengan sembilan teori"));
k.push(P("Bagian ini menguji rangkaian fakta yang sama dengan sembilan alat uji yang berbeda. Perhatikan: faktanya tidak berubah sama sekali dari satu teori ke teori berikutnya. Yang berubah cuma pertanyaan yang kita ajukan atas fakta itu."));

k.push(H2("5.1  Lima teori modernis"));

k.push(H3("Egoism: netral"));
k.push(P("Kalau dilihat jangka pendek, kebijakan ini jelas menguntungkan Indonesia. Tapi ingat, egois yang cerdas menghitung sampai jauh ke depan. Biaya berobat warga, biaya membersihkan sungai, dan biaya menutup pembangkit batu bara lebih awal belum masuk hitungan. Biaya itu tidak hilang, cuma ditunda, dan pada akhirnya tetap ditanggung pihak yang sama."));
k.push(P("Jadi justru kepentingan diri yang dihitung cermat menuntut biaya tertunda itu dimasukkan sejak awal. Teori ini kami sebut netral karena dia sendiri mengakui tidak sanggup menilai persoalan yang korbannya belum lahir."));

k.push(H3("Utilitarianism: terbelah"));
k.push(P("Ini penilaian paling menarik karena teorinya sendiri terpecah dua."));
k.push(P([i("Act utilitarianism"), t(" cenderung setuju. Manfaat 166 ribu lapangan kerja itu nyata, terukur, dan dirasakan sekarang. Sementara kerugiannya menyebar ke banyak pihak dan sebagian baru muncul bertahun-tahun kemudian.")]));
k.push(P([i("Rule utilitarianism"), t(" justru menolak. Coba jadikan kebijakan ini aturan umum: semua negara pemilik cadangan nikel mengolah sendiri dengan tenaga batu bara. Tambahan polusinya akan membatalkan manfaat transisi energi, padahal transisi energi itulah alasan nikel ini dibutuhkan. Aturan yang membatalkan tujuannya sendiri ketika diterapkan luas tidak lolos uji ini.")]));
k.push(P("Keduanya utilitarianism, keduanya memakai data yang sama, hasilnya bertolak belakang. Pembedanya cuma satu: yang dinilai satu kejadian atau satu kelas tindakan. Jadi bedanya act dan rule itu bukan detail teknis, melainkan penentu putusan."));

k.push(H3("Ethics of duty: menolak"));
k.push(P("Mari tulis aturan tindakannya dalam satu kalimat: boleh mempercepat pembangunan industri sambil menunda pemenuhan standar upah, keselamatan, dan lingkungan."));
k.push(P("Sekarang bayangkan semua orang boleh melakukannya. Kalau setiap pihak bisa menunda standar dengan alasan mengejar target, standar itu kehilangan seluruh daya ikatnya. Aturannya membatalkan dirinya sendiri, jadi gagal di uji pertama."));
k.push(P("Uji kedua juga gagal. Upah pokok di bawah upah minimum daerah dan lembur yang tercatat sampai 13 jam menunjukkan pekerja diperlakukan sebagai alat untuk mengejar produksi, bukan sebagai pihak yang kepentingannya berdiri sendiri."));

k.push(H3("Ethics of rights: setuju dengan syarat"));
k.push(P("Hak atas pekerjaan terpenuhi untuk 166 ribu orang, dan itu harus diakui jujur. Sampai titik itu kebijakan ini bisa dipertahankan."));
k.push(P("Tapi pada saat yang sama ada hak lain yang dilanggar: hak atas kondisi kerja yang layak dan aman, hak atas kesehatan, hak atas air bersih, dan hak masyarakat adat atas tanah leluhurnya."));
k.push(P("Kami sebut setuju dengan syarat karena teori ini tidak menolak kebijakannya. Yang dia tuntut adalah hak yang dilanggar itu dipulihkan sebagai syarat kebijakannya boleh jalan terus. Perlu ditambahkan, pedoman PBB menuntut penghormatan pada seluruh rantai bisnis, jadi pembeli produk nikel di negara lain juga tidak bisa cuci tangan."));

k.push(H3("Justice: menolak"));
k.push(P("Dari sisi pembagian, untungnya mengalir ke penerimaan negara dan pemodal, sementara ruginya menumpuk pada pekerja kawasan, warga di hilir sungai, dan masyarakat adat. Nilai tambah yang tinggal di Morowali cuma 4,35 persen, dan kabupaten penghasilnya justru lebih miskin dari rata-rata provinsinya. Susunan seperti ini jelas tidak memenuhi prinsip kedua Rawls, sebab ketimpangannya sama sekali tidak menguntungkan pihak yang paling lemah."));
k.push(P("Dari sisi proses, pihak yang menanggung beban tidak ikut memutuskan. Coba pakai uji selubung ketidaktahuan tadi: kalau Anda belum tahu akan lahir sebagai pemegang saham smelter atau sebagai warga di pinggir sungai Ake Jira, apakah Anda akan memilih susunan yang berlaku sekarang? Kemungkinan besar tidak."));

k.push(H2("5.2  Empat teori alternatif"));

k.push(H3("Virtue ethics: menolak pembandingnya"));
k.push(P("Teori ini tidak menolak kebijakannya, tapi menolak cara membandingkannya. Selama ini pembelaannya selalu sama: sekarang lebih baik daripada zaman ekspor bijih mentah."));
k.push(P("Orang yang berkarakter baik tidak mengukur diri dengan masa lalunya sendiri. Dia mengukur diri dengan standar terbaik yang tersedia hari ini. Dan standar itu bukan mimpi: teknologi tungku yang lebih bersih, sistem keselamatan kerja yang lebih ketat, dan pasokan listrik rendah karbon sudah ada dan dipakai di tempat lain."));

k.push(H3("Ethic of care: menuntut pemulihan"));
k.push(P("Warga di hilir sungai dan sekitar 300 sampai 500 jiwa masyarakat O Hongana Manyawa itu pihak yang berhubungan langsung dengan operasi kawasan, bukan angka biaya dalam laporan."));
k.push(P("Yang dituntut teori ini adalah pemulihan sungai dan perlindungan wilayah adat, bukan penutupan pabrik secara mendadak. Sebab penutupan mendadak justru merusak hubungan lain, yaitu dengan 166 ribu pekerja beserta keluarganya. Ini contoh bagus bahwa pluralisme tidak berarti semua teori harus satu suara."));

k.push(H3("Discourse ethics: menolak prosesnya"));
k.push(P("Warga terdampak tidak pernah menjadi pihak dalam perumusan kebijakan maupun dalam proses perizinan kawasan. Syarat musyawarah yang setara jelas tidak terpenuhi, karena justru orang yang paling merasakan akibatnya yang tidak ada di meja."));
k.push(P("Bagi teori ini, cacat proses itu saja sudah cukup untuk membatalkan keabsahan hasilnya, terlepas dari sebagus apa hasilnya kalau diukur dengan kriteria lain."));

k.push(H3("Postmodern ethics: membongkar bahasanya"));
k.push(P("Kata hilirisasi terdengar seperti kemajuan dan penguasaan rantai nilai. Kata ekstraksi terdengar seperti pengurasan sumber daya. Padahal keduanya menamai peristiwa yang sama. Pilihan kata itulah yang menentukan siapa yang terlihat berjasa dan siapa yang terlihat jadi korban."));
k.push(P("Contoh paling tajamnya adalah istilah nikel hijau. Istilah itu dipakai untuk pengolahan yang listriknya justru bertumpu pada pembangkit batu bara di dalam kawasan. Teori ini membaca pemakaian istilah seperti itu bukan sebagai pilihan kata biasa, melainkan sebagai alat pembenar."));

/* ================= BAGIAN 6 ================= */
k.push(H1("Bagian 6  Menyatukan sembilan penilaian"));

k.push(H2("6.1  Rekap hasilnya"));
const mW = [560, 2300, 2100, CW - 560 - 2300 - 2100];
k.push(P("Tabel 4  Hasil pengujian sembilan teori", { size: 18, bold: true, color: MUTE, font: SANS, after: 80, align: AlignmentType.LEFT }));
k.push(TABLE(mW, [
  thead(["No", "Teori", "Hasilnya", "Alasan singkatnya"], mW),
  trow(["1", "Egoism", "Netral", "Biaya yang tertunda belum dimasukkan hitungan"], mW),
  trow(["2", "Utilitarianism", "Terbelah", "Versi act setuju, versi rule menolak"], mW),
  trow(["3", "Ethics of duty", "Menolak", "Aturannya gugur kalau berlaku untuk semua orang"], mW),
  trow(["4", "Ethics of rights", "Bersyarat", "Sebagian hak terpenuhi, sebagian dilanggar"], mW),
  trow(["5", "Justice", "Menolak", "Pembagian dan prosesnya sama-sama timpang"], mW),
  trow(["6", "Virtue ethics", "Menolak pembanding", "Diukur dengan masa lalu, bukan standar terbaik"], mW),
  trow(["7", "Ethic of care", "Menuntut pemulihan", "Hubungan rusak, tapi tidak minta dihentikan"], mW),
  trow(["8", "Discourse ethics", "Menolak prosedur", "Pihak terdampak tidak ada saat aturan dibuat"], mW),
  trow(["9", "Postmodern ethics", "Relativistik", "Istilahnya dipakai sebagai alat pembenar"], mW)
]));
k.push(SPACER(140));
k.push(P("Rekapnya: enam menolak, satu setuju dengan syarat, satu terbelah, dan satu netral karena mengakui keterbatasannya sendiri. Tidak ada satu pun dari sembilan teori yang setuju tanpa syarat."));

k.push(H2("6.2  Empat kesimpulan antara"));
k.push(P("Dari kesembilan penilaian tadi bisa ditarik empat kesimpulan yang berlaku lintas teori."));
k.push.apply(k, NUMS([
 [b("Lebih baik dari dulu itu bukan ukuran. "), t("Keadaan sekarang yang lebih baik daripada zaman ekspor bijih mentah tidak otomatis berarti sudah cukup. Ukurannya harusnya standar terbaik yang tersedia hari ini.")],
 [b("Label hijau gugur di sumber listriknya. "), t("Pengolahan yang bertenaga pembangkit batu bara tidak bisa disebut hijau, apa pun tujuan akhir produknya.")],
 [b("Pembagiannya timpang. "), t("Nilai tambah yang tinggal di daerah cuma 4,35 persen, sementara daerah penghasilnya justru lebih miskin dari rata-rata provinsinya. Prinsip kedua Rawls tidak terpenuhi.")],
 [b("Prosesnya cacat sejak awal. "), t("Warga terdampak tidak pernah jadi pihak dalam perizinan maupun perencanaan kawasan.")]
]));

k.push(H2("6.3  Dua hal yang jangan sampai tertukar"));
k.push(P([b("Pertama"), t(", menolak klaim nikel hijau itu tidak sama dengan menolak hilirisasi. Yang gugur adalah klaim bahwa kebijakan ini sudah etis, bukan kebijakan hilirisasinya. Ini dua hal yang berbeda dan bisa dinilai terpisah.")]));
k.push(P([b("Kedua"), t(", sah menurut hukum dan benar secara etika juga dua hal yang berbeda. Putusan WTO menilai kepatuhan pada aturan dagang. Pengujian dalam dokumen ini menilai pembagian manfaat, kondisi kerja, dan siapa yang diajak bicara. Sebuah kebijakan bisa saja kalah di pengadilan dagang tapi etis, atau sebaliknya menang tapi tetap bermasalah secara etika.")]));

/* ================= BAGIAN 7 ================= */
k.push(H1("Bagian 7  Simpulan dan saran untuk manajemen"));

k.push(H2("7.1  Tiga temuan"));
k.push.apply(k, NUMS([
 [b("Sembilan sudut pandang, satu arah. "), t("Kesembilan teori berangkat dari asumsi yang berbeda-beda, tapi mayoritasnya bermuara ke kesimpulan yang sama. Inilah bukti terkuat untuk pendekatan pluralis. Kesimpulan yang dicapai lewat pertemuan banyak sudut pandang jauh lebih kokoh daripada kesimpulan satu teori, sebab dia tidak bergantung pada satu asumsi tertentu.")],
 [b("Yang gugur klaimnya, bukan kebijakannya. "), t("Upah, keselamatan, lingkungan, dan sumber listriknya semua masih bisa diperbaiki. Kalau keempatnya dibenahi, hasil pengujian ini akan langsung berubah.")],
 [b("Kasusnya belum selesai. "), t("Kebijakannya masih jalan, sengketa dagangnya belum tuntas, dan angkanya bergerak tiap tahun. Justru karena belum selesai, diskusi seperti ini masih bisa berpengaruh pada arah kebijakannya.")]
]));

k.push(H2("7.2  Tiga saran yang bisa dijalankan"));
const imW = [3000, CW - 3000];
k.push(TABLE(imW, [
  thead(["Saran", "Isinya"], imW),
  trow([HEAD("Hitung biaya yang tertunda"), "Biaya berobat warga, pemulihan sungai, dan penutupan pembangkit lebih awal dimasukkan ke perencanaan sejak awal, bukan diakui setelah masalahnya meledak."], imW),
  trow([HEAD("Beri kursi untuk yang absen"), "Pekerja, warga di hilir sungai, dan masyarakat adat diberi keterwakilan resmi di panitia keselamatan kerja dan proses perizinan kawasan."], imW),
  trow([HEAD("Uji klaim dengan lebih dari satu teori"), "Sebelum sebuah klaim keberlanjutan dipublikasikan, uji dulu dengan beberapa sudut pandang. Klaim yang lolos hitungan manfaat sering gugur di keadilan pembagian dan di proses."], imW)
]));
k.push(SPACER(160));
k.push(NOTE("KALIMAT PENUTUP",
 "Manfaat yang gampang dihitung selalu lebih mudah dibela daripada beban yang menyebar. Justru karena itu, beban yang menyebar harus dihitung lebih dulu.", "FBEAF2"));

/* ================= LAMPIRAN ================= */
k.push(H1("Lampiran A  Daftar istilah", { pageBreak: true }));
const glW = [3000, CW - 3000];
const GLOS = [
 ["A priori", "Pengetahuan yang didapat lewat penalaran saja, tanpa perlu pengalaman."],
 ["Act utilitarianism", "Menilai satu kejadian saja: kali ini manfaatnya lebih besar atau tidak."],
 ["Categorical imperative", "Perintah moral tanpa syarat pada Kant. Dua bentuk utamanya: aturannya harus bisa berlaku untuk semua orang, dan manusia tidak boleh dipakai sekadar sebagai alat."],
 ["Deontologis", "Cara menilai yang melihat kewajiban dan prinsip, bukan hasilnya."],
 ["Enlightened egoism", "Egoisme yang cerdas: menjaga lingkungan dan masyarakat karena itu menguntungkan diri sendiri dalam jangka panjang."],
 ["Eudaimonia", "Hidup yang baik dan berkembang penuh. Tujuan akhir dalam virtue ethics."],
 ["Hypernorms", "Prinsip yang berlaku lintas komunitas dalam Integrative Social Contracts Theory."],
 ["Ideal speech situation", "Syarat musyawarah pada discourse ethics: semua boleh ikut, tidak ada yang ditekan, dan argumen dinilai dari kekuatannya sendiri."],
 ["Keadilan distributif", "Menilai untungnya mengalir ke mana dan ruginya ditanggung siapa."],
 ["Keadilan prosedural", "Menilai siapa yang boleh ikut memutuskan dan apakah prosesnya terbuka."],
 ["Konsekuensialis", "Cara menilai yang melihat akibat sebuah tindakan. Disebut juga teleologis."],
 ["Normatif", "Berisi ukuran benar dan salah. Lawannya deskriptif, yang cuma memerikan kenyataan."],
 ["Rule utilitarianism", "Menilai kelas tindakan: kalau semua orang melakukan hal ini sebagai aturan, hasilnya bagaimana."],
 ["Smelter", "Pabrik peleburan yang mengubah bijih tambang jadi bahan setengah jadi."],
 ["UNGP", "Pedoman PBB tentang Bisnis dan Hak Asasi Manusia (2011), dengan kerangka lindungi, hormati, pulihkan."],
 ["Veil of ignorance", "Selubung ketidaktahuan, alat uji Rawls: memilih aturan main tanpa tahu akan lahir jadi siapa."],
 ["WTO", "World Trade Organization, badan yang mengurus aturan perdagangan antarnegara dan sengketanya."]
];
k.push(TABLE(glW, [thead(["Istilah", "Artinya"], glW)].concat(GLOS.map(function (g) {
  return trow([HEAD(g[0]), g[1]], glW);
}))));

k.push(H1("Lampiran B  Pertanyaan untuk diskusi"));
k.push(P("Enam pertanyaan berikut bisa dipakai untuk memperdalam pembahasan, baik di kelas maupun sebagai bahan tulisan lanjutan."));
k.push.apply(k, NUMS([
 "Kalau act utilitarianism dan rule utilitarianism memberi jawaban yang berlawanan, atas dasar apa kita memilih salah satunya?",
 "Sejauh mana perusahaan pembeli di negara lain ikut bertanggung jawab atas kondisi kerja di pemasoknya? Apa dasarnya menurut pedoman PBB?",
 "Apakah keberatan bahwa kritik ini bernuansa Barat cukup kuat untuk membatalkan kritik atas kondisi kerja di kawasan pengolahan? Bagaimana Sen (2000) menjawabnya?",
 "Bentuk keterwakilan seperti apa yang memenuhi syarat discourse ethics, tapi tetap membuat proses perizinan bisa berjalan?",
 "Dilema yang sama akan berulang pada bauksit, tembaga, dan timah. Pelajaran mana dari kasus nikel yang bisa dipindahkan, dan mana yang tidak?",
 "Kalau kelompok Anda diminta merancang indikator keberlanjutan untuk kawasan pengolahan, indikator apa yang akan menangkap beban yang selama ini tidak masuk hitungan?"
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
