const C = require("./common");
const { P, H1, H2, H3, EYEBROW, SPACER, RULEP, BULLETS, NUMS, TABLE, thead, trow, NOTE,
        buildDoc, TITLEBLOCK, AlignmentType, BLUE, INK, MUTE, PINK, GREEN, SANS, SERIF, CW } = C;
const fs = require("fs");

const A = "Aslih Abnuri", B = "Arfinal Diputra", R = "Rohana Dwi Hardianti";

const SLIDES = [
{ no: 1, title: "Judul dan pembuka", who: A, dur: "1 menit", clock: "00.00 sampai 01.00",
  lines: [
   "Selamat pagi Bapak Ibu dan teman-teman. Kami bertiga: saya Aslih, lalu Arfinal, dan Rohana. Hari ini kami membawakan Bab 3 dari buku Crane dan Matten, judulnya Evaluating Business Ethics.",
   "Bab ini sebenarnya menjawab satu pertanyaan sederhana. Kalau kita bilang sebuah keputusan bisnis itu etis atau tidak etis, dasarnya apa? Kalau urusan pribadi, perasaan kita biasanya sudah cukup. Tapi keputusan perusahaan berbeda. Keputusan itu harus bisa dijelaskan ke banyak pihak: pemegang saham, pemerintah, pekerja, sampai warga di sekitar pabrik.",
   "Bab 3 memberi kita sembilan alat uji. Nanti kesembilan alat itu kami pakai untuk menguji satu kebijakan yang masih berjalan sampai sekarang, yaitu hilirisasi nikel Indonesia.",
   "Waktu kami 30 menit. Kurang lebih 17 menit untuk teori, 11 menit untuk kasus, dan 2 menit penutup."],
  cue: "Lanjut ke slide 2 sambil bilang: sebelum masuk, ini dulu peta jalannya." },

{ no: 2, title: "Sistematika pembahasan", who: A, dur: "30 detik", clock: "01.00 sampai 01.30",
  lines: [
   "Presentasi ini ada dua bagian. Bagian satu kita siapkan dulu alat ujinya: apa itu teori etika, ada berapa macam, apa kelebihan dan kekurangannya.",
   "Bagian dua baru kita pakai alat itu untuk membedah kasus nikel: kebijakannya seperti apa, faktanya bagaimana, lalu apa kata sembilan teori tadi.",
   "Kenapa teorinya duluan? Karena kalau kasusnya duluan, biasanya diskusi berhenti di adu angka. Teori memberi kita cara menilai angka yang sama dari sudut yang berbeda."],
  cue: "Jangan lama-lama di sini. Tunjukkan alurnya, langsung lanjut." },

{ no: 3, title: "Mengapa teori normatif diperlukan", who: A, dur: "1 menit 30 detik", clock: "01.30 sampai 03.00",
  lines: [
   "Pertama, apa sih teori etika normatif itu? Sederhananya: seperangkat aturan dan cara berpikir untuk menentukan mana yang benar dan mana yang salah. Itu definisi dari Crane dan Matten.",
   "Buat apa repot-repot pakai teori? Ada tiga alasan.",
   "Satu, teori merapikan perasaan kita. Kita sering merasa sesuatu itu salah tapi susah menjelaskan kenapa. Teori membantu mengubah perasaan itu jadi alasan yang jelas.",
   "Dua, teori membuat diskusi jadi mungkin. Kalau dua orang punya nilai yang berbeda, tanpa teori ujungnya cuma selera lawan selera. Dengan teori, keduanya bisa beradu argumen.",
   "Tiga, keputusan bisnis butuh pertanggungjawaban. Perusahaan harus bisa menjelaskan alasannya secara masuk akal ke semua pihak yang terkena dampak.",
   "Satu hal penting sebelum lanjut. Bilang praktik di negara lain itu berbeda, itu pengamatan. Bilang praktik itu salah, itu penilaian. Teori bekerja di yang kedua."],
  cue: "Kalimat terakhir itu pemantik. Beri jeda dua detik sebelum pindah." },

{ no: 4, title: "Absolutisme, relativisme, pluralisme", who: A, dur: "1 menit 15 detik", clock: "03.00 sampai 04.15",
  lines: [
   "Sebelum pakai teorinya, kita tentukan dulu sikap dasar. Ada tiga pilihan.",
   "Absolutisme bilang: ada aturan moral yang berlaku untuk semua orang, di mana pun, kapan pun. Benar ya benar, salah ya salah.",
   "Relativisme bilang sebaliknya: tidak ada benar salah yang universal. Semua tergantung budaya dan kebiasaan masing-masing tempat.",
   "Crane dan Matten mengambil jalan tengah, namanya pluralisme. Nilai yang bertentangan bisa sama-sama masuk akal. Kita tidak bilang semua pendapat benar, tapi kita juga tidak memaksakan satu pendapat sebagai satu-satunya kebenaran.",
   "Contoh gampangnya: suap. Orang absolutis bilang suap selalu salah. Orang relativis bilang tergantung negaranya. Orang pluralis bertanya: alasan mana yang paling kuat kalau diadu?",
   "Sikap pluralis inilah yang kami pakai sepanjang presentasi ini."],
  cue: "Contoh suap biasanya langsung nyambung ke kelas. Santai saja bawakannya." },

{ no: 5, title: "Klasifikasi sembilan teori", who: A, dur: "1 menit 15 detik", clock: "04.15 sampai 05.30",
  lines: [
   "Sembilan teori di Bab 3 terbagi dua kelompok besar.",
   "Kelompok pertama: teori modernis Barat. Umurnya sudah ratusan tahun dan sifatnya seperti rumus, bisa dipakai di situasi apa pun. Isinya lima teori. Dua menilai hasil akhir sebuah tindakan, yaitu egoism dan utilitarianism. Tiga menilai prinsipnya, yaitu ethics of duty, ethics of rights, dan justice.",
   "Kelompok kedua: teori alternatif. Ini lahir belakangan karena orang tidak puas dengan kelompok pertama. Isinya empat: virtue ethics menilai karakter orangnya, ethic of care menilai hubungan antarpihak, discourse ethics menilai prosesnya, dan postmodern ethics menilai bahasanya.",
   "Satu catatan: semua teori ini berangkat dari asumsi tertentu tentang manusia. Kalau kita terima asumsinya, kita terima kesimpulannya.",
   "Tolong ingat nomor satu sampai sembilan ini ya, karena di bagian kasus nanti kami pakai nomor yang sama."],
  cue: "Serah terima: lima teori pertama akan dibawakan Arfinal." },

{ no: 6, title: "Ethical egoism", who: B, dur: "1 menit 15 detik", clock: "05.30 sampai 06.45",
  lines: [
   "Teori nomor satu: ethical egoism. Ini teori paling tua dan paling sering disalahpahami.",
   "Intinya begini: sebuah tindakan itu benar kalau semua orang bebas mengejar kepentingannya sendiri, baik yang jangka pendek maupun jangka panjang.",
   "Yang sering keliru: egois itu bukan serakah. Orang egois masih bisa peduli pada orang lain. Orang serakah sudah tidak peduli sama sekali.",
   "Tokohnya Thomas Hobbes dan Ayn Rand.",
   "Kelemahannya: teori ini cuma jalan kalau pasar berfungsi baik, saat tidak ada yang bisa seenaknya merugikan orang lain. Begitu bicara lingkungan dan generasi mendatang, teori ini macet. Kenapa? Karena korban kerusakan lingkungan adalah anak cucu kita, dan mereka belum bisa ikut menawar hari ini.",
   "Tapi jangan buru-buru membuang teori ini. Versi jangka panjangnya justru nanti memberi kritik paling tajam ke kasus nikel: perusahaan yang benar-benar cerdas menghitung untung ruginya sampai jauh ke depan."],
  cue: "Nada santai. Egoism di sini istilah teknis, bukan hinaan." },

{ no: 7, title: "Utilitarianism", who: B, dur: "1 menit 30 detik", clock: "06.45 sampai 08.15",
  lines: [
   "Teori nomor dua: utilitarianism. Ini teori favorit dunia bisnis karena mirip hitung-hitungan untung rugi.",
   "Aturannya satu kalimat: tindakan yang benar adalah yang memberi manfaat terbesar untuk orang sebanyak-banyaknya.",
   "Cara kerjanya: jumlahkan semua manfaat, kurangi semua kerugian, dan semua orang yang kena dampak harus ikut dihitung, bukan cuma diri kita.",
   "Nah, ini bagian paling penting di slide ini: bedanya act dan rule. Act utilitarianism menilai satu kejadian saja. Rule utilitarianism bertanya lebih jauh: kalau semua orang melakukan hal yang sama, dunia jadi lebih baik atau lebih buruk? Dua-duanya utilitarianism, tapi jawabannya bisa bertolak belakang untuk kasus yang sama. Tolong diingat, karena persis itu yang terjadi di kasus nikel nanti.",
   "Kelemahannya: manfaat itu susah diukur, semua orang dihitung sama rata, dan kelompok kecil bisa terlindas. Angka total yang bagus bisa menyembunyikan penderitaan segelintir orang."],
  cue: "Tekankan suara di bagian act dan rule. Ini dipanggil lagi di slide 17." },

{ no: 8, title: "Ethics of duty, Immanuel Kant", who: B, dur: "1 menit 30 detik", clock: "08.15 sampai 09.45",
  lines: [
   "Teori nomor tiga dari Immanuel Kant. Kalau dua teori tadi melihat hasil, Kant justru bilang: hasil itu tidak penting. Yang penting niat dan prinsipnya.",
   "Kant memberi dua alat uji yang gampang dipakai.",
   "Uji pertama: bisakah aturan ini berlaku untuk semua orang? Contohnya janji palsu. Kalau semua orang boleh ingkar janji, tidak ada lagi yang percaya pada janji, dan janji itu sendiri jadi tidak ada artinya. Aturannya menghancurkan dirinya sendiri. Berarti salah.",
   "Uji kedua: apakah kita memperlakukan manusia sebagai manusia? Orang tidak boleh dipakai sekadar sebagai alat untuk tujuan kita. Dari sinilah lahir ide bahwa perusahaan harus peduli pada semua pemangku kepentingannya.",
   "Jadi cara pakai Kant itu singkat: tulis aturannya satu kalimat, lalu bayangkan semua orang melakukannya. Kalau kacau, berarti salah.",
   "Kelemahannya: hasil sama sekali tidak dihitung, dan Kant menganggap semua orang selalu berpikir jernih. Kenyataannya kan tidak."],
  cue: "Contoh janji palsu ucapkan pelan-pelan. Alat uji ini dipakai langsung di slide 17." },

{ no: 9, title: "Ethics of rights", who: B, dur: "1 menit 15 detik", clock: "09.45 sampai 11.00",
  lines: [
   "Teori nomor empat: hak asasi manusia. Ini teori yang paling sering dipakai di dunia nyata karena sudah jadi aturan resmi di mana-mana.",
   "Idenya sederhana: setiap manusia lahir dengan hak dasar yang tidak bisa dicabut siapa pun. Hak hidup, hak atas kebebasan, hak atas milik.",
   "Yang sering dilupakan: setiap hak selalu menciptakan kewajiban di pihak lain. Kalau warga punya hak atas air bersih, berarti ada pihak yang wajib tidak mencemari sungainya.",
   "Untuk bisnis, aturan mainnya ada di pedoman PBB tahun 2011. Pembagiannya jelas: negara melindungi, perusahaan menghormati, dan korban harus bisa menuntut pemulihan.",
   "Satu poin yang nanti penting sekali untuk kasus kita: tanggung jawab perusahaan ikut mengalir lewat rantai bisnisnya. Perusahaan tetap wajib peduli pada masalah di pemasoknya, walaupun bukan dia yang membuat masalah itu. Inilah yang menghubungkan pembeli mobil listrik di Eropa dengan kondisi di Halmahera."],
  cue: "Kalimat terakhir jembatan ke kasus. Bawakan dengan tempo lambat." },

{ no: 10, title: "Justice dan kontrak sosial", who: B, dur: "1 menit 15 detik", clock: "11.00 sampai 12.15",
  lines: [
   "Teori nomor lima: keadilan. Pertanyaannya bergeser. Bukan lagi ini benar atau salah, tapi: pembagiannya adil atau tidak?",
   "Keadilan itu dua macam. Pertama soal proses: siapa yang boleh ikut memutuskan? Kedua soal pembagian: enaknya ke mana, sakitnya ke siapa?",
   "Tokoh utamanya John Rawls, dan dia punya alat uji yang sangat mudah dipakai, namanya selubung ketidaktahuan. Begini caranya. Bayangkan Anda harus memilih sebuah kebijakan, tapi Anda belum tahu akan lahir jadi siapa. Bisa jadi pemilik smelter, bisa jadi warga di pinggir sungai yang tercemar. Nah, kebijakan seperti apa yang akan Anda pilih? Kebijakan yang Anda pilih dalam kondisi buta seperti itu, itulah yang adil.",
   "Rawls juga bilang: ketimpangan boleh saja ada, asal ketimpangan itu paling menguntungkan orang yang paling lemah.",
   "Turunannya adalah teori kontrak sosial, versi bisnisnya menggabungkan prinsip universal dengan kesepakatan lokal di tiap komunitas."],
  cue: "Pertanyaan selubung ketidaktahuan boleh dilempar ke kelas, tapi jangan tunggu jawaban. Serah terima ke Rohana." },

{ no: 11, title: "Enam keterbatasan teori modernis", who: R, dur: "1 menit", clock: "12.15 sampai 13.15",
  lines: [
   "Lima teori tadi hebat, tapi punya enam kelemahan yang diakui bukunya sendiri. Saya bacakan cepat.",
   "Satu, terlalu melayang: prinsipnya jauh dari masalah nyata seorang manajer. Dua, terlalu menyederhanakan: tiap teori cuma melihat satu sisi tapi merasa melihat semuanya. Tiga, terlalu elitis: kebenaran ditentukan para ahli, bukan orang yang mengalami langsung. Empat, terlalu dingin: hubungan pribadi malah dianggap mengganggu penilaian. Lima, terlalu mendewakan logika: peran empati dan perasaan dibuang. Enam, terlalu Barat: pengalaman Eropa dianggap berlaku untuk seluruh dunia.",
   "Untuk kasus nikel, kelemahan nomor tiga sampai lima itu yang paling terasa, karena warga yang terdampak memang tidak pernah diajak bicara.",
   "Dari kelemahan-kelemahan inilah lahir empat teori alternatif berikut."],
  cue: "Enam butir dibaca cepat saja. Yang penting kalimat penutupnya." },

{ no: 12, title: "Virtue ethics dan ethic of care", who: R, dur: "1 menit 30 detik", clock: "13.15 sampai 14.45",
  lines: [
   "Teori nomor enam: virtue ethics, etika keutamaan. Pertanyaannya bukan lagi tindakan mana yang benar, tapi: orang seperti apa yang pantas disebut baik di posisi ini? Akarnya dari Aristoteles. Karakter yang baik dibentuk dari kebiasaan, bukan dari hafalan aturan. Di dunia bisnis wujudnya jujur, adil, bisa dipercaya, dan tangguh.",
   "Teori ini sering dikira cuma nasihat moral. Padahal dia punya satu pertanyaan yang tajam sekali: kalau kita bilang sesuatu sudah cukup baik, cukup baik dibanding apa? Simpan pertanyaan itu, nanti terpakai di kasus.",
   "Teori nomor tujuh: ethic of care, etika kepedulian. Pandangannya: manusia itu tidak hidup sendiri-sendiri, kita saling terhubung dan saling bergantung. Maka yang dinilai adalah bagaimana kita menjaga hubungan dengan orang yang terdampak, secara nyata, bukan lewat aturan seragam.",
   "Kelemahan keduanya mirip: baik itu menurut ukuran komunitas mana, dan kepedulian pada orang dekat bisa membuat kita lupa pada orang jauh."],
  cue: "Pertanyaan dibanding apa itu kail untuk slide 18. Tandai." },

{ no: 13, title: "Discourse ethics dan postmodern ethics", who: R, dur: "1 menit 30 detik", clock: "14.45 sampai 16.15",
  lines: [
   "Teori nomor delapan: discourse ethics, dari Habermas. Idenya menarik: aturan yang baik itu tidak diturunkan dari atas, tapi lahir dari musyawarah semua pihak yang terkena dampak. Syarat musyawarahnya ketat: semua boleh ikut, tidak ada yang menekan, dan yang menang adalah argumen terkuat, bukan orang terkuat.",
   "Akibatnya penting sekali: kalau prosesnya cacat, hasilnya batal. Sebagus apa pun hasilnya, kalau pihak terdampak tidak pernah diajak bicara, keputusannya tidak sah secara etis.",
   "Teori nomor sembilan: postmodern ethics, dari Bauman. Teori ini curiga pada kata-kata. Pertanyaannya: istilah yang dipakai itu menguntungkan siapa? Kata yang sama bisa dibungkus untuk kesan yang berbeda.",
   "Teori inilah yang nanti membongkar istilah nikel hijau."],
  cue: "Kalimat penutup adalah kail untuk slide 18 dan 19. Ucapkan jelas." },

{ no: 14, title: "Sembilan pertanyaan penilaian", who: R, dur: "45 detik", clock: "16.15 sampai 17.00",
  lines: [
   "Supaya gampang dipakai, kami ringkas sembilan teori tadi jadi sembilan pertanyaan di slide ini. Silakan difoto dulu.",
   "Ingat, tidak ada satu teori yang bisa menjawab semuanya. Yang kita cari bukan satu jawaban benar, tapi arah yang sama dari sembilan penilaian yang berbeda. Kalau sembilan sudut pandang yang berbeda menunjuk ke arah yang sama, kesimpulan kita jadi kuat sekali."],
  cue: "Jeda tiga detik untuk memotret. Serah terima ke Aslih." },

{ no: 15, title: "Anatomi kebijakan hilirisasi nikel", who: A, dur: "2 menit", clock: "17.00 sampai 19.00",
  lines: [
   "Sekarang kasusnya. Kebijakannya sebenarnya satu aturan saja: sejak Januari 2020, bijih nikel mentah dilarang diekspor. Mau jual nikel? Olah dulu di dalam negeri. Dan untuk masuk kawasan industri, perusahaan harus punya smelter, pabrik pengolahnya.",
   "Garis waktunya begini: larangan pertama tahun 2014 sempat dilonggarkan, aturan finalnya terbit 2019, berlaku 2020. Tahun 2022 Indonesia digugat Uni Eropa dan kalah di WTO, organisasi perdagangan dunia. Sengketanya masih berjalan. Tahun 2025 ekspor olahan nikel tembus 40 miliar dolar.",
   "Kenapa kasus ini menarik untuk pelajaran etika? Karena bentuknya khas: manfaatnya besar, gampang dihitung, dan jatuh ke pihak yang jelas. Bebannya sebaliknya: menyebar ke banyak orang, munculnya belakangan, dan susah dihitung. Masalah dengan bentuk seperti ini tidak bisa diadili pakai satu kriteria saja.",
   "Oh ya, semua angka kami ambil per Agustus 2026, dan kasusnya masih berjalan, jadi angkanya bisa berubah tahun depan."],
  cue: "Sebut batas waktu data supaya kelas tahu angkanya bertanggal. Serah terima ke Rohana." },

{ no: 16, title: "Dua narasi atas fakta yang sama", who: R, dur: "2 menit", clock: "19.00 sampai 21.00",
  lines: [
   "Slide ini dua kolom, dan dua-duanya benar. Itu justru intinya.",
   "Kolom kiri, kabar baiknya. Ekspor olahan nikel naik dari 3 miliar jadi 40 miliar dolar dalam lima tahun. Investasi yang masuk ke kawasan Morowali 41,5 miliar dolar. Pekerja yang terserap 166 ribu orang, padahal tadinya 36 ribu. Dan Indonesia sekarang jadi pemain utama rantai baterai dunia.",
   "Kolom kanan, tagihannya. Upah pokok pekerja 3 sampai 3,6 juta, masih di bawah upah minimum Morowali yang 3,7 juta. Ada 107 pekerja meninggal dan 155 luka dalam kecelakaan smelter selama enam tahun. Hutan yang hilang di Halmahera 163 ribu hektare, dan listrik kawasan ini sebagian besar dari batu bara. Dari semua nilai tambah itu, yang tinggal di Morowali cuma 4,35 persen, dan kemiskinannya masih 12,58 persen.",
   "Ada juga beban yang tidak masuk hitungan mana pun: sungai Ake Jira sudah tidak bisa dipakai warga, dan 40 persen wilayah masyarakat adat O Hongana Manyawa sudah dikapling izin tambang.",
   "Jadi tolong jangan adu angka. Dua kolom ini sama-sama benar. Yang berbeda adalah kacamata yang dipakai untuk menilainya. Karena itu kita butuh sembilan kacamata, bukan satu."],
  cue: "Bacakan kolom kiri sampai habis dulu, baru kolom kanan. Jangan bolak-balik." },

{ no: 17, title: "Penilaian lima teori modernis", who: B, dur: "3 menit", clock: "21.00 sampai 24.00",
  lines: [
   "Sekarang fakta tadi kita uji satu per satu dengan lima teori modernis.",
   "Egoism: hasilnya netral. Jangka pendek jelas Indonesia untung. Tapi ingat egois yang cerdas menghitung sampai jauh: biaya berobat warga, biaya membersihkan sungai, biaya menutup pembangkit batu bara, semua itu belum masuk hitungan. Biaya itu tidak hilang, cuma ditunda, dan nanti kita juga yang bayar.",
   "Utilitarianism: hasilnya terbelah, dan ini bagian paling menarik. Kalau menilai kejadian ini saja, act, jawabannya cenderung setuju: 166 ribu orang dapat kerja itu nyata. Tapi kalau dijadikan aturan umum, rule, jawabannya menolak. Bayangkan semua negara pemilik tambang ikut mengolah pakai batu bara. Tambahan polusinya justru membatalkan alasan nikel ini dibutuhkan, yaitu kendaraan listrik yang bersih. Data sama, dua jawaban. Bedanya cuma satu kejadian atau aturan umum.",
   "Kant: menolak. Coba tulis aturannya: boleh mempercepat pembangunan sambil menunda standar upah, keselamatan, dan lingkungan. Kalau semua orang boleh menunda dengan alasan kejar target, standar itu tidak ada artinya lagi. Gagal di uji pertama. Uji kedua juga gagal: upah di bawah minimum dan lembur sampai 13 jam artinya pekerja dipakai sebagai alat.",
   "Hak asasi: bersyarat. Hak atas pekerjaan terpenuhi untuk 166 ribu orang, itu harus diakui. Tapi di saat yang sama hak atas kerja yang layak, kesehatan, air bersih, dan tanah adat dilanggar. Jadi kebijakan ini boleh jalan terus, dengan syarat hak yang dilanggar itu dipulihkan.",
   "Keadilan: menolak. Enaknya mengalir ke kas negara dan pemodal, sakitnya menumpuk di pekerja, warga pinggir sungai, dan masyarakat adat. Kabupaten penghasilnya malah lebih miskin dari rata-rata provinsinya. Coba pakai uji Rawls: kalau Anda belum tahu akan lahir jadi siapa di Morowali, berani pilih susunan yang sekarang?"],
  cue: "Slide terpanjang, jaga tempo sekitar 30 detik per teori. Bagian act dan rule paling penting." },

{ no: 18, title: "Penilaian empat teori alternatif", who: R, dur: "2 menit 15 detik", clock: "24.00 sampai 26.15",
  lines: [
   "Empat teori alternatif melihat fakta yang sama dari sudut lain.",
   "Virtue ethics menolak cara membandingkannya. Selama ini pembelaannya selalu: sekarang lebih baik daripada zaman ekspor mentah. Tapi orang yang berkarakter baik tidak membandingkan diri dengan masa lalunya sendiri. Dia membandingkan diri dengan standar terbaik yang ada hari ini. Teknologi bersih dan standar keselamatan yang lebih baik itu ada dan dipakai di tempat lain.",
   "Ethic of care menuntut pemulihan. Warga pinggir sungai dan sekitar 300 sampai 500 jiwa masyarakat adat itu tetangga kita, bukan angka biaya. Perhatikan: teori ini tidak minta pabriknya ditutup. Yang diminta sungainya dipulihkan dan wilayah adatnya dilindungi. Ini contoh bagus bahwa sembilan teori tidak harus satu suara.",
   "Discourse ethics menolak prosesnya. Warga terdampak tidak pernah duduk di meja saat kebijakan dan izin dibuat. Bagi teori ini, itu saja sudah cukup untuk membatalkan keabsahan hasilnya.",
   "Postmodern ethics membongkar bahasanya. Hilirisasi terdengar maju, ekstraksi terdengar menguras, padahal barangnya sama. Dan yang paling tajam: nikel ini dijual dengan label hijau, padahal listrik pengolahnya dari batu bara."],
  cue: "Kalimat teori ini tidak minta pabrik ditutup sering memancing pertanyaan. Siapkan jawabannya." },

{ no: 19, title: "Sintesis penilaian dan evaluasi klaim", who: R, dur: "1 menit 45 detik", clock: "26.15 sampai 28.00",
  lines: [
   "Kalau sembilan penilaian tadi kita kumpulkan: enam menolak, satu setuju dengan syarat, satu terbelah, dan satu netral. Tidak ada satu pun yang setuju tanpa syarat.",
   "Dari situ kami tarik empat kesimpulan antara.",
   "Pertama, lebih baik dari dulu itu bukan ukuran. Ukurannya standar terbaik hari ini.",
   "Kedua, label hijau gugur di sumber listriknya. Pengolahan bertenaga batu bara tidak bisa disebut hijau.",
   "Ketiga, pembagiannya timpang. Nilai tambah yang tinggal di daerah cuma 4,35 persen, dan daerah penghasilnya justru lebih miskin.",
   "Keempat, prosesnya cacat dari awal, karena warga terdampak tidak pernah dilibatkan.",
   "Satu hal yang perlu digarisbawahi supaya tidak salah tangkap: yang kami tolak itu klaim bahwa kebijakan ini sudah etis. Kebijakan hilirisasinya sendiri tidak kami minta dihentikan. Dua hal itu berbeda."],
  cue: "Kalimat penegasan terakhir adalah inti kontribusi kelompok. Serah terima ke Aslih." },

{ no: 20, title: "Simpulan dan implikasi manajerial", who: A, dur: "1 menit 45 detik", clock: "28.00 sampai 29.45",
  lines: [
   "Kami tutup dengan tiga temuan dan tiga saran.",
   "Temuan satu: sembilan teori yang asumsinya berbeda-beda ternyata mengarah ke kesimpulan yang sama. Justru itu bukti terkuat. Kalau sembilan kacamata yang berbeda melihat masalah yang sama, masalahnya nyata.",
   "Temuan dua: yang gugur klaim etisnya, bukan kebijakannya. Upah, keselamatan, lingkungan, dan sumber listriknya semua masih bisa diperbaiki.",
   "Temuan tiga: kasus ini belum selesai, angkanya masih bergerak. Justru karena belum selesai, diskusi kita hari ini masih bisa berarti.",
   "Lalu apa yang bisa dilakukan manajemen? Tiga hal. Satu, masukkan biaya yang tertunda itu ke perencanaan sejak awal: biaya kesehatan warga, pemulihan sungai, dan penutupan pembangkit. Dua, beri kursi untuk pihak yang selama ini absen: pekerja, warga, dan masyarakat adat, di panitia keselamatan dan proses perizinan. Tiga, uji setiap klaim dengan lebih dari satu teori, karena klaim yang lolos hitung-hitungan manfaat sering gugur di keadilan dan proses.",
   "Kalimat penutup dari kami: manfaat yang gampang dihitung selalu lebih mudah dibela daripada beban yang menyebar. Justru karena itu, beban yang menyebar harus dihitung lebih dulu."],
  cue: "Kalimat penutup diucapkan pelan, jeda sebentar, baru pindah slide." },

{ no: 21, title: "Penutup", who: A, dur: "15 detik", clock: "29.45 sampai 30.00",
  lines: [
   "Terima kasih Bapak Ibu dan teman-teman. Silakan kalau ada pertanyaan, kami buka diskusi."],
  cue: "Ketiga anggota berdiri menghadap kelas selama tanya jawab." }
];

const QA = [
 ["Kalau enam dari sembilan teori menolak, berarti hilirisasi harus dihentikan?",
  "Tidak. Yang gugur itu klaim bahwa kebijakan ini sudah etis, bukan kebijakannya. Lihat saja bentuk penolakannya: Kant menolak aturannya, keadilan menolak pembagiannya, discourse menolak prosesnya, dan ethic of care malah minta pemulihan, bukan penghentian. Semua yang ditolak itu bisa diperbaiki tanpa menghentikan kebijakan."],
 ["Bukankah semua industri baru memang begitu di awal?",
  "Argumen itu membandingkan dengan masa lalu. Virtue ethics justru mempersoalkan pembandingnya. Pertanyaannya bukan apakah sekarang lebih baik dari zaman ekspor mentah, tapi apakah sudah setara dengan standar terbaik yang ada hari ini. Teknologi tungku yang lebih bersih dan sistem keselamatan yang lebih baik itu sudah ada dan dipakai di tempat lain."],
 ["WTO sudah memutus kebijakan ini melanggar. Berarti tidak etis dong?",
  "Tidak otomatis. Sah menurut hukum dan benar secara etika itu dua penilaian yang berbeda. WTO menilai aturan dagang. Kami menilai pembagian manfaat, kondisi kerja, dan siapa yang diajak bicara. Sebuah kebijakan bisa kalah di pengadilan dagang tapi etis, bisa juga menang tapi bermasalah secara etika."],
 ["Menuntut standar Eropa ke Indonesia itu bukannya imperialisme budaya?",
  "Keberatan itu memang tercatat sebagai kelemahan nomor enam, dan karena itu kami sengaja tidak memakai standar Eropa. Semua ukuran yang kami pakai adalah standar Indonesia sendiri: upah minimum Morowali, aturan keselamatan kerja nasional, dan komitmen iklim Indonesia. Lagi pula keselamatan kerja dan hak untuk didengar itu bukan monopoli budaya mana pun."],
 ["166 ribu lapangan kerja itu besar sekali. Apa tidak cukup jadi pembenaran?",
  "Itu argumen utilitarian, dan memang kuat untuk versi act. Masalahnya dua. Pertama, versi rule menjawab sebaliknya: kalau semua negara meniru cara ini, polusinya membatalkan tujuan nikel itu sendiri. Kedua, angka total bisa menyembunyikan siapa yang menanggung sakitnya. Yang menikmati banyak orang, yang menanggung segelintir, dan segelintir itu pekerja kawasan dan masyarakat adat."],
 ["Kalau jadi manajemen, langkah paling realistis dalam waktu dekat apa?",
  "Tiga hal di slide 20. Masukkan biaya kesehatan warga, pemulihan sungai, dan penutupan pembangkit ke neraca sejak perencanaan. Beri keterwakilan resmi untuk pekerja, warga, dan masyarakat adat di panitia keselamatan dan perizinan. Dan uji setiap klaim keberlanjutan dengan lebih dari satu teori sebelum dipublikasikan."],
 ["Kenapa harus sembilan teori? Satu saja tidak cukup?",
  "Karena bentuk kasusnya: manfaat menumpuk di satu sisi, beban menyebar di sisi lain. Satu kriteria hanya menangkap satu sisi. Kekuatan analisis ini justru di konvergensinya: sembilan sudut pandang yang asumsinya berbeda-beda ternyata menunjuk arah yang sama, dan itu jauh lebih meyakinkan daripada satu teori."],
 ["Angka-angkanya dari mana?",
  "Dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, dan dokumen putusan panel WTO, kami telusuri per Agustus 2026. Kasusnya masih berjalan, jadi sebagian angka akan berubah tahun depan."]
];

const ANGKA = [
 ["40 miliar dolar", "Ekspor produk nikel olahan pada 2025, naik dari 3 miliar dolar pada 2020"],
 ["41,5 miliar dolar", "Investasi yang terkumpul di kawasan IMIP Morowali sampai Desember 2025"],
 ["166 ribu pekerja", "Terserap di IMIP dan IWIP, dari 35.952 orang pada 2020"],
 ["3 sampai 3,6 juta", "Upah pokok per bulan, di bawah upah minimum Morowali 2025 sebesar 3,7 juta"],
 ["107 dan 155", "Pekerja meninggal dan pekerja luka pada 104 kecelakaan smelter, 2019 sampai 2025"],
 ["163 ribu hektare", "Tutupan pohon yang hilang di Halmahera"],
 ["76 persen", "Porsi pembangkit listrik batu bara yang dipegang industri nikel"],
 ["4,35 persen", "Nilai tambah yang tinggal di Morowali, dengan kemiskinan 12,58 persen"],
 ["13 jam", "Durasi lembur yang tercatat di kawasan pengolahan"],
 ["300 sampai 500 jiwa", "Perkiraan warga O Hongana Manyawa yang terdampak"],
 ["40 persen", "Wilayah adat O Hongana Manyawa yang sudah berizin tambang"],
 ["November 2022", "Panel WTO memutus larangan ekspor melanggar aturan perdagangan"]
];

/* ================= susun dokumen ================= */
const kids = [];
kids.push.apply(kids, TITLEBLOCK(
  "SKRIP PRESENTASI  |  MAN5522 BUSINESS ETHICS FOR SUSTAINABILITY",
  "Evaluating Business Ethics: Normative Ethical Theories",
  "Naskah pembawaan 21 slide dalam bahasa sederhana, dengan studi kasus hilirisasi nikel Indonesia"));

const idW = [1900, CW - 1900];
kids.push(TABLE(idW, [
  trow(["Mata kuliah", "Business Ethics for Sustainability (MAN5522), MBA Universitas Gadjah Mada"], idW),
  trow(["Rujukan utama", "Crane, A., Matten, D., Glozer, S., dan Spence, L. (2019). Business Ethics, edisi kelima, Bab 3"], idW),
  trow(["Penyusun", "Aslih Abnuri (25/574338/PEK/31801), Arfinal Diputra (25/574664/PEK/31914), Rohana Dwi Hardianti (25/574077/PEK/31728)"], idW),
  trow(["Durasi", "30 menit: 17 menit teori, 11 menit studi kasus, 2 menit penutup"], idW),
  trow(["Gaya bahasa", "Bahasa sehari-hari yang mudah dipahami. Istilah teknis disebut sekali lalu langsung dijelaskan dengan kata sederhana"], idW)
]));
kids.push(SPACER(200));

kids.push(H1("Pembagian pembicara dan alokasi waktu"));
kids.push(P("Pembagian ini menyeimbangkan durasi bicara ketiga anggota pada kisaran sepuluh menit. Boleh ditukar, asalkan total waktunya tetap dan pergantian pembicara jatuh di batas bagian, bukan di tengah pembahasan satu teori."));
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
 [{ text: "Tempo. ", bold: true }, { text: "Naskah disusun pada kisaran 130 kata per menit. Kalau terasa terburu-buru, pangkas contohnya, jangan pangkas penjelasan intinya." }],
 [{ text: "Jangan membaca slide. ", bold: true }, { text: "Slide berisi rumusan padat, naskah berisi cerita penghubungnya. Bacakan naskah, tunjuk slide seperlunya." }],
 [{ text: "Istilah teknis. ", bold: true }, { text: "Sebut nama teorinya sekali dalam bahasa Inggris seperti di slide, lalu langsung jelaskan dengan kata sehari-hari. Setelah itu cukup pakai penjelasan sederhananya." }],
 [{ text: "Nomor teori. ", bold: true }, { text: "Sebutkan nomor urut setiap kali membuka teori baru. Nomor yang sama muncul lagi di matriks slide 19, jadi pendengar mudah mengikuti." }],
 [{ text: "Angka. ", bold: true }, { text: "Sebutkan angka lengkap sekali saja, setelah itu rujuk dengan kata pendek. Contoh: sebut 166 ribu pekerja sekali, selanjutnya cukup bilang penyerapan kerjanya." }],
 [{ text: "Serah terima. ", bold: true }, { text: "Ada empat titik pergantian pembicara: setelah slide 5, 10, 14, dan 19, ditambah pergantian pendek di slide 15 sampai 18. Sebut nama penerimanya singkat saja." }],
 [{ text: "Cadangan waktu. ", bold: true }, { text: "Kalau sisa waktu kurang dari dua menit saat tiba di slide 18, ringkas slide 18 jadi dua kalimat per teori dan pertahankan slide 19 utuh." }]
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
kids.push(P("Delapan pertanyaan berikut yang paling mungkin muncul. Jawabannya ditulis ringkas supaya bisa disampaikan dalam waktu kurang dari satu menit."));
QA.forEach(function (q, i) {
  kids.push(H3((i + 1) + ".  " + q[0]));
  kids.push(P(q[1], { size: 21, after: 60 }));
});

kids.push(H1("Daftar angka penting", { pageBreak: true }));
kids.push(P("Angka pada tabel ini muncul di slide 15 sampai 19. Simpan sebagai lembar contekan supaya tidak perlu kembali ke slide saat menjawab pertanyaan."));
const agW = [2900, CW - 2900];
kids.push(TABLE(agW, [thead(["Angka", "Keterangan"], agW)].concat(
  ANGKA.map(function (a) {
    return trow([[P(a[0], { size: 19, bold: true, after: 0, line: 264, align: AlignmentType.LEFT, font: SANS })], a[1]], agW);
  })
)));
kids.push(SPACER(160));
kids.push(NOTE("BATAS WAKTU DATA",
  "Seluruh angka ditelusuri pada Agustus 2026 dari pengelola kawasan IMIP dan IWIP, Badan Pusat Statistik, serta dokumen putusan panel WTO. Kasus ini masih berjalan, jadi sebagian angka akan berubah pada tahun berikutnya. Sebutkan batas waktu ini bila ada yang menanyakan sumber."));

const fsp = require("fs");
C.D.Packer.toBuffer(buildDoc("Skrip Presentasi Business Ethics", kids,
  "Skrip Presentasi  |  Evaluating Business Ethics  |  MAN5522 MBA UGM")).then(function (buf) {
  fsp.writeFileSync(process.argv[2] || "Skrip-Presentasi.docx", buf);
  console.log("WROTE skrip");
});
