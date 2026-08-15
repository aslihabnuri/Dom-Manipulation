/* ============================================================
   OTM Study Hub — Data Mata Kuliah
   Operations & Technology Management (MAN 5322 / EBMY231001)
   MBA UGM — Semester 2

   Cara menambah materi pertemuan berikutnya:
   1. Cari sesi di array SESSIONS di bawah (id sesuai nomor sesi).
   2. Isi field `summary` (array of section) dengan rangkuman materi.
   3. Tambahkan kartu di FLASHCARDS dan soal di QUIZZES
      dengan `session` = nomor sesi tersebut.
   ============================================================ */

window.OTM_DATA = {
  course: {
    title: "Operations & Technology Management",
    codes: "MAN 5322 · EBMY231001",
    program: "Magister Business Administration — Universitas Gadjah Mada",
    semester: "Semester 2 · Kelas S51A",
    classCode: "dm3cpfej",
    lecturer: {
      name: "Nur Aini Masruroh",
      dept: "Industrial Engineering, Universitas Gadjah Mada",
      education: "ST (UGM) · M.Sc. (University of Manchester) · Ph.D (National University of Singapore)"
    },
    driveLinks: [
      { label: "Folder Semester 2 - MBA UGM", url: "https://drive.google.com/drive/folders/15qUTfHdRAi-x3eaxfZEapQHXArC-RY2R" },
      { label: "Materi PPT", url: "https://drive.google.com/drive/folders/1R3WoiIFFQOTY50GOH-CKDdrEOHXdu1kk" },
      { label: "Buku (Turban — IT for Management)", url: "https://drive.google.com/drive/folders/1b5_8m64PzZ4t9kTk-YWCoBAwtMzxXx1T" },
      { label: "Silabus (OTM Course Plan S51A)", url: "https://drive.google.com/drive/folders/1rxDRJPytT2b7Vyo2nHEtcfn6f3UZ_qJ2" }
    ],
    assessment: [
      { label: "Partisipasi di kelas", weight: 10 },
      { label: "Ujian tengah semester (individu)", weight: 25 },
      { label: "Presentasi proyek tim I", weight: 20 },
      { label: "Presentasi proyek tim II", weight: 20 },
      { label: "Laporan proyek individu (UAS)", weight: 25 }
    ],
    references: [
      { code: "SBB", text: "Slack, Brandon-Jones & Burgess (2022), Operations Management, 10th Ed., Pearson." },
      { code: "HRM", text: "Heizer, Render & Munson (2017), Operations Management, 12th Ed., Pearson." },
      { code: "TPW", text: "Turban, Pollard & Wood (2025), Information Technology for Management, 13th Ed., Wiley." }
    ],
    objectives: [
      "Memahami konsep dasar operations management sebagai bagian integral dari business value chain.",
      "Mampu menerapkan sepuluh keputusan utama (ten decisions) operations management.",
      "Memahami fundamental technology management.",
      "Mampu memanfaatkan teknologi sebagai enabler efektivitas dan efisiensi operasi bisnis.",
      "Memahami relevansi operations & technology management dalam lingkungan kontemporer."
    ]
  },

  /* ---------- 12 sesi sesuai OTM Course Plan S51A ---------- */
  sessions: [
    {
      id: 1, date: "2026-08-14", dateLabel: "14 Agustus 2026",
      topic: "Operations Management & Business Value Chain",
      subtopics: ["Operations Management", "Operations Performance", "Operations Strategy"],
      readings: ["SBB bab 1, 2", "HRM bab 1", "TPW bab 1"],
      caseStudy: null,
      summary: [
        {
          heading: "Apa itu Operations Management?",
          questions: [{"q": "Di kasus Hard Rock Cafe, menu baru hanya masuk produksi bila bahannya tersedia dari pemasok yang qualified. Dalam praktik di Indonesia, bagaimana perusahaan sebaiknya menyeimbangkan kecepatan meluncurkan produk baru dengan kesiapan pemasok — apakah pernah ada kasus di mana menunggu pemasok justru membuat kehilangan momentum pasar?", "guide": "Kenapa menarik: menghubungkan kasus pembuka kuliah dengan dilema nyata speed vs quality di keputusan supply chain. Dosen Anda berlatar industrial engineering — kemungkinan punya contoh riset/industri nyata. Follow-up: 'Apa kriteria minimum pemasok yang tidak boleh dikompromikan?'"}, {"q": "Materi membagi operasi berdasarkan input dominannya: material, informasi, atau pelanggan. Untuk bisnis hybrid seperti bank digital atau rumah sakit dengan telemedicine — yang memproses informasi sekaligus pelanggan — mana yang sebaiknya dijadikan acuan utama desain operasinya?", "guide": "Kenapa menarik: menguji batas kerangka Tabel 1.2 pada bisnis kontemporer yang tidak rapi masuk satu kategori. Ini pertanyaan konseptual yang menunjukkan Anda membaca materi sampai implikasinya. Follow-up: 'Apakah pergeseran layanan ke digital berarti semua operasi bergerak menjadi pemroses informasi?'"}, {"q": "Kalau prinsip OM berlaku untuk semua fungsi (operations as activity), mengapa dalam struktur organisasi kebanyakan perusahaan Indonesia, direktur operasi justru jarang duduk setara CFO/CMO di pengambilan keputusan strategis? Apakah ini masalah persepsi terhadap fungsi operasi?", "guide": "Kenapa menarik: mengangkat ketegangan antara teori (OM fundamental) dan realita organisasi — tema yang biasanya memancing dosen bercerita pengalaman industri. Follow-up: 'Apa yang harus dilakukan profesional operasi agar suaranya lebih strategis?'"}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          visuals: ["inputTransform"],
          body: `<p>Bayangkan Anda makan di <strong>Hard Rock Cafe</strong>. Restoran yang dibuka pertama kali
di London tahun 1971 ini kini punya 300+ venue di 70 negara. Pertanyaan sederhananya: bagaimana sebuah menu bisa sampai
ke meja Anda? Ternyata panjang ceritanya — hidangan dirancang, diuji, lalu dianalisis biaya bahannya, kebutuhan tenaga
kerjanya, dan kepuasan pelanggannya. Setelah disetujui, menu baru diproduksi <em>hanya jika</em> bahannya tersedia dari
pemasok yang berkualitas. Proses produksinya — dari penerimaan bahan, penyimpanan dingin, memanggang, sampai penyajian —
dirancang dan dijaga agar menghasilkan makanan berkualitas. Di balik itu semua ada manajer yang menyusun jadwal karyawan
dan merancang layout dapur yang efisien. <strong>Semua aktivitas itulah yang disebut operations management.</strong></p>
<h4 class="sub-h">Dua definisi yang perlu Anda hafal</h4>
<p>Ada dua definisi resmi dari dua buku utama mata kuliah ini, dan keduanya sering keluar di ujian:</p>
<ul>
<li><strong>Versi Slack, Brandon-Jones &amp; Burgess (2022):</strong> OM adalah <em>aktivitas mengelola sumber daya yang
menciptakan dan menyampaikan (create and deliver) produk dan jasa</em>. Kata kuncinya: mengelola sumber daya.</li>
<li><strong>Versi Heizer, Render &amp; Munson:</strong> OM adalah <em>serangkaian aktivitas yang menciptakan nilai dalam
bentuk barang dan jasa dengan mentransformasi input menjadi output</em>. Kata kuncinya: transformasi input → output.</li>
</ul>
<p>Dua definisi ini sebenarnya bicara hal yang sama dari sudut berbeda: yang satu menyorot <em>sumber dayanya</em>,
yang satu menyorot <em>prosesnya</em>. Orang yang bertanggung jawab mengelola sebagian atau seluruh sumber daya operasi
disebut <strong>operations manager</strong>.</p>
<h4 class="sub-h">Mengapa mata kuliah ini penting untuk Anda?</h4>
<p>Ada empat alasan mengapa mahasiswa MBA wajib mempelajari OM. <strong>Pertama</strong>, OM adalah bagian yang paling
mahal dari organisasi — sebagian besar biaya perusahaan ada di operasi, sehingga perbaikan kecil di operasi berdampak
besar pada laba. <strong>Kedua</strong>, OM adalah salah satu dari tiga fungsi utama organisasi (bersama marketing dan
keuangan) — kita perlu tahu bagaimana orang mengorganisasi diri untuk usaha yang produktif. <strong>Ketiga</strong>,
kita perlu tahu bagaimana barang dan jasa benar-benar diproduksi — bukan sekadar teori. <strong>Keempat</strong>,
kita perlu memahami apa yang sesungguhnya dikerjakan seorang operations manager, karena apa pun karier Anda nanti,
Anda akan bekerja dengan (atau menjadi) salah satunya.</p>
<h4 class="sub-h">Model dasar: input → transformasi → output</h4>
<p>Semua operasi — pabrik, rumah sakit, bank, warung kopi — bekerja dengan pola yang sama: mengambil <strong>input</strong>,
<strong>mentransformasikannya</strong>, dan menghasilkan <strong>output</strong> berupa produk atau jasa. Input yang
ditransformasi (<em>transformed resources</em>) bisa dikelompokkan menjadi tiga, dan setiap operasi biasanya dominan
memproses salah satunya:</p>
<ul>
<li><strong>Material</strong> — diproses oleh semua operasi manufaktur, perusahaan tambang, ritel, gudang, jasa pos,
perusahaan pelayaran kontainer, dan perusahaan truk. Materialnya berubah bentuk, berpindah tempat, atau berpindah pemilik.</li>
<li><strong>Informasi</strong> — diproses oleh akuntan, kantor pusat bank, perusahaan riset pasar, analis keuangan,
kantor berita, unit riset universitas, dan perusahaan telekomunikasi. Yang "diolah" adalah data dan pengetahuan.</li>
<li><strong>Pelanggan</strong> — diproses oleh salon (mengubah penampilan), hotel (mengakomodasi), rumah sakit
(mengobati), transportasi massal (memindahkan), teater dan taman hiburan (menghibur), serta dokter gigi.
Pelanggannya sendiri yang "masuk ke dalam proses".</li>
</ul>
<p>Selain transformed resources, operasi juga membutuhkan <em>transforming resources</em> — fasilitas dan staf yang
melakukan transformasi itu.</p>
<h4 class="sub-h">"Operations" sebagai fungsi vs sebagai aktivitas</h4>
<p>Satu hal yang sering membingungkan: kata "operations" punya dua makna. Sebagai <strong>fungsi</strong>, operations
adalah bagian organisasi yang menciptakan dan menyampaikan produk/jasa bagi pelanggan eksternal — "departemen operasi".
Sebagai <strong>aktivitas</strong>, operations berarti pengelolaan proses di fungsi <em>mana pun</em> — departemen
marketing pun punya proses yang harus dikelola. Implikasinya penting: <em>semua manajer adalah operations manager</em>
untuk prosesnya masing-masing, sehingga prinsip-prinsip OM relevan untuk seluruh bagian bisnis, apa pun jabatan Anda.</p>
<div class="key-box"><strong>💡 Intinya:</strong> OM = mengelola sumber daya yang mentransformasi input (material,
informasi, atau pelanggan) menjadi output bernilai (produk &amp; jasa). OM penting karena mahal, fundamental, dan
berlaku di semua fungsi bisnis — bukan hanya di pabrik.</div>`
        },
        {
          heading: "The Four Vs",
          questions: [{"q": "hotelF1 sukses dengan menekan visibility serendah mungkin demi biaya. Tapi tren 'experience economy' mendorong pelanggan justru ingin melihat dan terlibat dalam proses (open kitchen, live barista). Apakah strategi menekan visibility makin berisiko sekarang — atau kedua tren ini melayani segmen yang memang berbeda?", "guide": "Kenapa menarik: mempertemukan kerangka klasik 4V dengan tren konsumen terkini — mengundang dosen mengomentari apakah teorinya perlu adaptasi. Follow-up: 'Apakah ada industri di mana menaikkan visibility justru menurunkan biaya, misalnya karena pelanggan ikut bekerja (self-service)?'"}, {"q": "Adakah contoh perusahaan Indonesia yang berhasil berpindah posisi 4V secara signifikan — misalnya dari volume rendah-variety tinggi menjadi volume tinggi-variety rendah — tanpa kehilangan pelanggan lamanya? Apa yang membuat transisi seperti itu berhasil atau gagal?", "guide": "Kenapa menarik: meminta contoh lokal dari pengalaman/riset dosen, bukan dari buku — jenis pertanyaan yang menghidupkan kelas. Kandidat diskusi: warung yang jadi waralaba, katering rumahan yang masuk industri. Follow-up: 'Fase mana yang paling berbahaya dalam transisi itu?'"}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          visuals: ["fourVs"],
          body: `<p>Kalau semua operasi sama-sama mentransformasi input menjadi output, apakah mengelola
pabrik mi instan sama dengan mengelola butik pernikahan? Tentu tidak. Perbedaan antar-operasi bisa dipetakan dengan
empat dimensi yang disebut <strong>the Four Vs</strong>. Memahami posisi operasi Anda di keempat dimensi ini akan
menentukan bagaimana operasi itu sebaiknya dirancang dan berapa biayanya.</p>
<h4 class="sub-h">Empat dimensi itu satu per satu</h4>
<ul>
<li><strong>Volume</strong> — seberapa <em>banyak</em> output dihasilkan. McDonald's membuat jutaan burger (volume
tinggi) sehingga bisa membangun proses yang sangat sistematis, terstandardisasi, dan murah per unit. Warung burger
rumahan membuat puluhan saja (volume rendah) — tiap burger dikerjakan lebih "manual" dan biaya per unitnya lebih tinggi.</li>
<li><strong>Variety</strong> — seberapa <em>beragam</em> output-nya. Taksi menawarkan variety tinggi: rute apa pun
sesuai permintaan penumpang. Bus kota variety-nya rendah: rutenya tetap. Makin banyak variasi yang ditawarkan,
makin kompleks dan mahal operasinya.</li>
<li><strong>Variation (in demand)</strong> — seberapa <em>fluktuatif</em> permintaannya. Hotel resor pantai ramai
saat liburan dan sepi di luar musim (variation tinggi) — kapasitasnya sering menganggur atau kewalahan. Minimarket
permintaannya relatif stabil sepanjang tahun (variation rendah) — kapasitas bisa dipakai efisien.</li>
<li><strong>Visibility</strong> — seberapa <em>terlihat</em> proses operasi oleh pelanggan. Di salon, pelanggan
menyaksikan (bahkan mengalami) seluruh proses — kesalahan kecil langsung ketahuan, dan staf harus punya keterampilan
melayani. Di pabrik atau dapur pusat, proses tersembunyi dari pelanggan — bisa dioptimasi tanpa memikirkan "penampilan".</li>
</ul>
<h4 class="sub-h">Hubungannya dengan biaya</h4>
<p>Inilah pola yang harus Anda ingat: <strong>biaya operasi turun ketika volume tinggi, variety rendah, variation
rendah, dan visibility rendah</strong> (dengan asumsi hal lain tetap). Logikanya: volume tinggi memberi skala ekonomi;
variety rendah memungkinkan standardisasi; variation rendah membuat kapasitas terpakai merata; visibility rendah
membebaskan operasi dari "biaya melayani penonton".</p>
<div class="case-box"><strong>📌 Contoh dari slide — dua hotel yang sangat berbeda:</strong> <em>Ski Verbier
Exclusive</em> menjual liburan ski mewah dan bespoke untuk segmen kecil. Variety-nya nyaris tak terbatas (tamu boleh
minta makanan dan hiburan apa pun), variation tinggi (4 bulan penuh 100% okupansi lalu sepi), dan kontak pelanggan
sangat tinggi. Akibatnya biayanya tinggi — dan harganya pun mahal. Bandingkan dengan <em>hotelF1</em>: tamu biasanya
menginap semalam, layanan sangat terbatas dan terstandardisasi, kontak pelanggan ditekan seminimal mungkin. Hasilnya:
layanan standar dengan biaya (dan harga) sangat rendah. Keduanya sukses — karena keduanya <em>konsisten</em> dengan
posisi 4V-nya masing-masing.</div>
<h4 class="sub-h">Implikasi tiap V terhadap desain operasi</h4>
<p>Slide "A typology of operations and processes" memerinci apa konsekuensi posisi rendah vs tinggi di tiap dimensi —
perhatikan bagaimana ujung kanan (kolom kedua) selalu bermuara pada <em>biaya unit rendah</em>:</p>
<ul>
<li><strong>Volume</strong> — rendah: repetisi rendah, tiap staf mengerjakan lebih banyak bagian tugas, kurang
tersistemasi, biaya unit tinggi. Tinggi: repeatability tinggi, spesialisasi, padat modal (capital intensive),
biaya unit rendah.</li>
<li><strong>Variety</strong> — tinggi: fleksibel, kompleks, menyesuaikan kebutuhan tiap pelanggan, biaya unit tinggi.
Rendah: terdefinisi baik, rutin, terstandardisasi, teratur, biaya unit rendah.</li>
<li><strong>Variation in demand</strong> — tinggi: kapasitas harus berubah-ubah, perlu antisipasi dan fleksibilitas,
selalu "menempel" pada permintaan, biaya unit tinggi. Rendah: stabil, rutin, dapat diprediksi, utilisasi tinggi,
biaya unit rendah.</li>
<li><strong>Visibility</strong> — tinggi: toleransi menunggu pelanggan pendek, kepuasan ditentukan persepsi,
butuh keterampilan kontak pelanggan, variety yang diterima tinggi, biaya unit tinggi. Rendah: ada jeda waktu antara
produksi dan konsumsi, standardisasi, keterampilan kontak rendah, utilisasi staf tinggi, sentralisasi,
biaya unit rendah.</li>
</ul>
<div class="key-box"><strong>💡 Intinya:</strong> 4 Vs = Volume, Variety, Variation, Visibility. Konfigurasi biaya
rendah: volume ↑, variety ↓, variation ↓, visibility ↓. Tidak ada posisi yang "benar" — yang penting strategi dan
desain operasinya konsisten dengan posisinya.</div>`
        },
        {
          heading: "Apa yang Dikerjakan Operations Manager?",
          questions: [{"q": "Dari sepuluh keputusan kritis OM, menurut pengalaman riset dan industri Ibu, keputusan mana yang paling sering diremehkan perusahaan Indonesia — dan apa akibat yang paling sering Ibu lihat?", "guide": "Kenapa menarik: langsung meminta perspektif pengalaman dosen (beliau Ph.D NUS dengan riset industrial engineering) — pertanyaan yang menghargai keahliannya dan jawabannya tidak ada di buku. Catat jawabannya: kemungkinan besar jadi bocoran penekanan ujian."}, {"q": "Pergeseran 'from batch shipments to just-in-time' terdengar ideal, tapi JIT sangat bergantung pada keandalan pemasok dan infrastruktur logistik. Dengan kondisi logistik Indonesia (biaya logistik ±14% PDB), apakah JIT penuh realistis di sini, atau perusahaan Indonesia perlu versi hibrida — dan seperti apa bentuknya?", "guide": "Kenapa menarik: membumikan konsep global ke konteks Indonesia dengan data (biaya logistik nasional) — menunjukkan riset mandiri. Follow-up: 'Berapa banyak safety stock yang masih masuk akal untuk perusahaan yang mengaku JIT?' Topik ini juga jembatan ke materi inventory (Sesi 6)."}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          body: `<p>Jika Anda menjadi operations manager besok pagi, apa saja
pekerjaan Anda? Slack dkk. merangkum pekerjaan itu dalam empat aktivitas besar yang berurutan secara logis:</p>
<ul>
<li><strong>Directing</strong> — mengarahkan strategi keseluruhan operasi. Sebelum menyentuh detail, manajer harus
paham tujuan strategis operasinya: bersaing lewat apa? Biaya? Kecepatan? Kualitas? Pemahaman ini menjadi prasyarat
untuk semua keputusan detail berikutnya.</li>
<li><strong>Designing</strong> — merancang produk/jasa dan prosesnya: menentukan bentuk fisik, komposisi, dan cara
kerja operasi beserta produk yang dihasilkannya.</li>
<li><strong>Planning &amp; controlling</strong> — setelah dirancang, penyampaian produk/jasa dari pemasok, melewati
operasi, sampai ke pelanggan harus direncanakan dan dikendalikan sehari-hari.</li>
<li><strong>Developing</strong> — mengembangkan kinerja proses. Manajer tidak boleh puas menjalankan proses dengan
cara yang itu-itu saja; ia bertanggung jawab meningkatkan kapabilitas prosesnya terus-menerus.</li>
</ul>
<h4 class="sub-h">10 keputusan kritis operations management</h4>
<p>Versi Heizer memerinci pekerjaan itu menjadi <strong>sepuluh area keputusan</strong>. Daftar ini adalah kerangka
utama mata kuliah kita — hampir setiap pertemuan ke depan membahas satu atau dua keputusan ini. Perhatikan pertanyaan
kunci di tiap keputusan:</p>
<ul>
<li><strong>1. Desain barang &amp; jasa</strong> — produk/jasa apa yang kita tawarkan? Bagaimana merancangnya?</li>
<li><strong>2. Manajemen kualitas</strong> — bagaimana kita mendefinisikan kualitas? Siapa yang bertanggung jawab atasnya?</li>
<li><strong>3. Desain proses &amp; kapasitas</strong> — proses dan kapasitas apa yang dibutuhkan produk ini?
Peralatan dan teknologi apa yang diperlukan?</li>
<li><strong>4. Strategi lokasi</strong> — di mana fasilitas ditempatkan? Kriteria apa dasar keputusannya?</li>
<li><strong>5. Strategi layout</strong> — bagaimana menata fasilitas? Seberapa besar fasilitas yang dibutuhkan?</li>
<li><strong>6. SDM &amp; desain pekerjaan</strong> — bagaimana menyediakan lingkungan kerja yang layak? Berapa
output yang wajar diharapkan dari karyawan?</li>
<li><strong>7. Supply chain management</strong> — buat sendiri atau beli (make or buy)? Siapa pemasok kita dan
bagaimana mengintegrasikan mereka ke strategi?</li>
<li><strong>8. Persediaan, MRP, dan JIT</strong> — berapa banyak persediaan tiap barang? Kapan memesan ulang?</li>
<li><strong>9. Penjadwalan jangka menengah &amp; pendek</strong> — apakah lebih baik mempertahankan karyawan saat
permintaan sepi? Pekerjaan mana yang dikerjakan berikutnya?</li>
<li><strong>10. Pemeliharaan (maintenance)</strong> — bagaimana membangun keandalan ke dalam proses? Siapa yang
bertanggung jawab atas pemeliharaan?</li>
</ul>
<h4 class="sub-h">Tantangan OM masa kini: dari mana ke mana</h4>
<p>Cara menjalankan sepuluh keputusan itu terus bergeser. Slide dosen merangkum enam pergeseran besar — format
"dari → ke" ini gampang keluar di ujian:</p>
<ul>
<li>Fokus lokal/nasional → <strong>fokus global</strong> (pasar dan pemasok mendunia);</li>
<li>Pengiriman batch besar → <strong>just-in-time</strong> (kirim kecil tapi sering, persediaan minim);</li>
<li>Pembelian dengan tawaran terendah → <strong>kemitraan supply chain</strong> (hubungan jangka panjang dengan pemasok);</li>
<li>Pengembangan produk yang lama → <strong>pengembangan cepat &amp; beraliansi</strong>;</li>
<li>Produk terstandardisasi → <strong>mass customization</strong> (produk massal tapi bisa dipersonalisasi);</li>
<li>Spesialisasi pekerjaan sempit → <strong>karyawan yang diberdayakan dan kerja tim</strong>.</li>
</ul>
<div class="key-box"><strong>💡 Intinya:</strong> Pekerjaan operations manager = direct, design, plan &amp; control,
develop — yang dijabarkan dalam 10 keputusan kritis. Hafalkan kesepuluhnya beserta pertanyaan kuncinya; itu peta
seluruh mata kuliah ini.</div>`
        },
        {
          heading: "Sejarah OM & Agenda Operasi Baru",
          questions: [{"q": "Timeline Heizer berhenti di Globalization Era (2005–2020). Kalau Ibu yang menulis bab berikutnya, era 2020 ke depan akan Ibu beri nama apa — dan inovasi apa yang akan jadi penandanya seperti JIT menandai era lean?", "guide": "Kenapa menarik: pertanyaan terbuka yang mengundang dosen berspekulasi dengan keahliannya — biasanya jadi diskusi paling hidup. Kandidat jawaban: era AI & resilience (pasca-pandemi), era sustainability. Follow-up: 'Apakah reshoring berarti era globalisasi sedang berbalik arah?'"}, {"q": "Dari new operations agenda, triple bottom line (people-planet-profit) sering dianggap beban biaya oleh perusahaan lokal, bukan investasi. Dari kacamata operations, adakah bukti bahwa operasi yang berkelanjutan justru lebih efisien — atau memang selalu ada trade-off dengan profit di awal?", "guide": "Kenapa menarik: isu sustainability sedang hangat dan masuk agenda baru operasi — dan pertanyaannya menantang secara konstruktif. Contoh pendukung untuk diskusi: penghematan energi = penghematan biaya (Colruyt mematikan lampu justru hemat). Follow-up: 'KPI keberlanjutan apa yang realistis dipasang di level operasional?'"}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          body: `<p>Dari mana ilmu operations management berasal, dan ke mana arahnya? Dua slide penting — "Significant
Events in Operations Management" dan "The New Operations Agenda" — menjawabnya.</p>
<h4 class="sub-h">Lima era perkembangan OM (Figure 1.4 Heizer)</h4>
<p>Sejarah OM dibagi dalam era-era yang masing-masing punya fokus berbeda:</p>
<ul>
<li><strong>Cost Focus — Early Concepts (1776–1880):</strong> spesialisasi tenaga kerja (Adam Smith, Babbage) dan
komponen terstandardisasi (Whitney). <strong>Scientific Management (1880–1910):</strong> Gantt chart (Gantt), studi
gerak & waktu (Gilbreth), analisis proses (Taylor), teori antrean (Erlang). <strong>Mass Production (1910–1980):</strong>
lini perakitan bergerak (Ford/Sorensen), sampling statistik (Shewhart), Economic Order Quantity (Harris), linear
programming, PERT/CPM (DuPont), Material Requirements Planning.</li>
<li><strong>Quality Focus — Lean Production Era (1980–1995):</strong> Just-in-Time, Computer-Aided Design, Electronic
Data Interchange, Total Quality Management, Baldrige Award, pemberdayaan karyawan, kanban.</li>
<li><strong>Customization Focus — Mass Customization Era (1995–2005):</strong> internet & e-commerce, Enterprise
Resource Planning, standar kualitas internasional (ISO), finite scheduling, supply chain management, mass
customization, build-to-order, RFID.</li>
<li><strong>Globalization Focus — Globalization Era (2005–2020):</strong> rantai pasok global, tumbuhnya organisasi
transnasional, komunikasi instan, keberlanjutan (sustainability), etika dalam tenaga kerja global, logistik.</li>
</ul>
<p>Pola besarnya mudah diingat: <strong>biaya → kualitas → kustomisasi → globalisasi</strong> — tiap era menambahkan
tuntutan baru tanpa menghapus tuntutan sebelumnya.</p>
<h4 class="sub-h">The new operations agenda</h4>
<p>Perkembangan lingkungan bisnis (persaingan, teknologi, sikap sosial-lingkungan, politik global, regulasi)
mendorong tiga arus perubahan besar pada operasi masa kini:</p>
<ul>
<li><strong>Adopsi teknologi baru</strong> — Internet of Things, algorithmic decision making, artificial
intelligence, 3D printing, robotika, dan analisis big data masuk ke jantung operasi.</li>
<li><strong>Pengaturan pasokan yang berbeda</strong> — jaringan operasi global, hubungan kemitraan, analisis
business ecosystem, dan manajemen risiko reputasi.</li>
<li><strong>Penekanan isu sosial & lingkungan</strong> — kinerja triple bottom line, desain yang peka lingkungan,
pola kerja fleksibel, dan penghematan energi.</li>
</ul>
<h4 class="sub-h">Posisi operasi di antara fungsi-fungsi lain</h4>
<p>Slide "The relationship between the operations function and other functions" menggambarkan operasi sebagai pusat
yang terhubung ke semua fungsi. Tiga <strong>fungsi inti (core)</strong>: operations, marketing, dan product/service
development. Empat <strong>fungsi pendukung (support)</strong>: accounting & finance (memberi analisis finansial
untuk pengukuran kinerja & pengambilan keputusan), human resources (rekrutmen, pengembangan, pelatihan), information
systems (menyediakan sistem untuk desain, perencanaan, kontrol, dan perbaikan), serta fungsi teknis (opsi & kebutuhan
teknologi proses). Ke setiap arah, operasi <em>mengomunikasikan kapabilitas dan batasan prosesnya</em> — misalnya ke
marketing soal apa yang sanggup dijanjikan ke pasar, dan ke pengembangan produk soal apa yang sanggup diproduksi.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Lima era OM: cost (1776–1980, dari Smith sampai MRP) → quality
(lean 1980–1995) → customization (1995–2005) → globalization (2005–2020). Agenda baru: teknologi (IoT, AI, robotik,
big data), pengaturan pasokan baru, dan isu sosial-lingkungan (triple bottom line). Operasi adalah fungsi inti yang
harus terus berdialog dengan marketing, pengembangan produk, dan fungsi-fungsi pendukung.</div>`
        },
        {
          heading: "Digital Transformation & Digital Business Model",
          questions: [{"q": "Walmart menggabungkan jual-langsung dengan marketplace. Gojek menggabungkan on-demand, ecosystem, subscription, sekaligus memonetisasi data. Apakah ada titik di mana mengombinasikan terlalu banyak model bisnis digital justru saling mengkanibal atau mengaburkan positioning — dan bagaimana operasi mengelola kompleksitas itu?", "guide": "Kenapa menarik: naik satu level dari 'apa itu tiap model' (yang ada di slide) ke 'bagaimana mengelola kombinasinya' (yang tidak ada di slide). Follow-up: 'Dari sisi operasi, model mana yang paling berat infrastrukturnya?' Cocok ditanyakan tepat setelah dosen selesai menjelaskan kedelapan model."}, {"q": "Pada model Free, 'customer is the product' — data dan perhatian pelanggan yang dijual. Dengan berlakunya UU Perlindungan Data Pribadi di Indonesia, apakah model ini masih berkelanjutan di sini, atau perusahaan digital Indonesia harus mulai migrasi ke subscription/freemium?", "guide": "Kenapa menarik: mempertemukan materi kuliah dengan regulasi Indonesia terkini — menunjukkan Anda berpikir sebagai praktisi, bukan penghafal. Follow-up: 'Model mana yang paling tahan regulasi privasi dalam jangka panjang?'"}, {"q": "Slide menyebut COVID mempercepat transformasi digital 3–4 tahun. Tapi banyak transformasi yang dipaksakan pandemi itu kabarnya ditinggalkan lagi setelah situasi normal. Dari pengamatan Ibu, transformasi digital 'darurat' seperti apa yang bertahan, dan seperti apa yang kembali mundur — apa pembedanya?", "guide": "Kenapa menarik: menguji klaim slide dengan fenomena nyata pasca-pandemi (hybrid working dibatalkan, layanan online ditutup). Jawabannya kemungkinan menyentuh poin kunci slide: yang bertahan adalah yang mengubah proses & budaya, yang mundur adalah yang cuma memasang alat. Follow-up: 'Bagaimana mengukur kesiapan budaya sebelum transformasi?'"}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          body: `<p>Bagian ini menghubungkan operations management dengan
sisi <em>teknologi</em> dari mata kuliah kita. Mengapa dibahas di pertemuan pertama? Karena hari ini hampir tidak ada
keputusan operasi yang tidak melibatkan teknologi digital.</p>
<h4 class="sub-h">Apa itu digital transformation?</h4>
<p><strong>Digital transformation</strong> adalah proses menggunakan teknologi digital untuk <em>menciptakan yang
baru</em> atau <em>memodifikasi yang sudah ada</em> — pada tiga hal sekaligus: proses bisnis, budaya organisasi, dan
pengalaman pelanggan — agar sesuai dengan perubahan kebutuhan bisnis dan pasar. Perhatikan: definisinya menyebut
<em>budaya</em>, bukan cuma teknologi. Ini poin yang sering dilewatkan orang.</p>
<p>Pandemi COVID-19 menjadi akselerator raksasa: organisasi terpaksa mempercepat transformasi digital pada interaksi
pelanggan, operasi supply chain, dan proses internal — memajukan timeline adopsi digital mereka <strong>3–4 tahun</strong>
lebih cepat dari rencana.</p>
<h4 class="sub-h">Digital business model</h4>
<p><strong>Digital business model</strong> menjawab pertanyaan: bagaimana perusahaan <em>menghasilkan uang</em> dan
mencapai tujuannya menggunakan teknologi digital — website, media sosial, perangkat mobile? Perusahaan dengan model
bisnis digital yang baik menjadi <em>customer-centric</em> (berpusat pada pelanggan), <em>agile</em> (lincah),
<em>data-driven</em> (berbasis data), dan berjangkauan global.</p>
<p>Dalam praktiknya, model-model digital sering dipakai <strong>kombinasi</strong>. Contoh yang disebut di slide:
<strong>Walmart</strong> menghasilkan pendapatan dari menjual produknya sendiri secara online, sekaligus menjadi
<em>marketplace</em> tempat penjual lain menawarkan barang dengan berbagi persentase keuntungan. Satu perusahaan,
dua model sekaligus.</p>
<p>Setiap inovasi teknologi memicu <em>peluang sekaligus ancaman</em> bagi model bisnis. Kuncinya bukan sekadar punya
teknologi, tapi <strong>memanfaatkannya lebih awal dan lebih efisien daripada kompetitor</strong>.</p>
<h4 class="sub-h">Lima syarat digital business model yang berhasil</h4>
<p>Slide dosen menyebut lima syarat — semuanya harus terpenuhi, bukan pilih salah satu:</p>
<ul>
<li>Memberikan <strong>customer experience yang luar biasa</strong> — setara atau melebihi pengalaman online terbaik
yang pernah dirasakan pelanggan (pelanggan membandingkan Anda dengan aplikasi terbaik yang mereka pakai, bukan dengan
kompetitor langsung Anda);</li>
<li>Tetap <strong>menghasilkan profit</strong>;</li>
<li><strong>Menaikkan market share</strong>;</li>
<li><strong>Mengubah proses</strong> — bukan menempelkan teknologi di atas proses lama;</li>
<li><strong>Melibatkan karyawan secara kreatif</strong> — perubahan peran dan tanggung jawab karyawan tidak boleh diabaikan.</li>
</ul>
<h4 class="sub-h">Delapan model bisnis digital yang paling banyak dipakai</h4>
<p>Slide dosen memetakan <strong>delapan model bisnis digital</strong> yang paling umum, lengkap dengan contoh
perusahaannya. Cara termudah membedakannya: tanyakan <em>"dari mana uangnya datang, dan apa yang sebenarnya
dijual?"</em></p>
<div class="dbm-grid">
<div class="dbm-card"><b>Subscription</b><span>Pelanggan membayar biaya bulanan untuk akses berkelanjutan ke
produk/jasa tertentu.</span><em>Netflix · Apple Music (juga Spotify)</em></div>
<div class="dbm-card"><b>Freemium</b><span>Pelanggan mendapat versi "basic" gratis atau free trial, dengan opsi
upgrade ke versi berbayar.</span><em>LinkedIn · Dropbox</em></div>
<div class="dbm-card"><b>Free</b><span>Pelanggan adalah "produknya". Data pelanggan (plus perhatiannya) adalah bagian
paling bernilai dari bisnis, dijual untuk kepentingan iklan.</span><em>Google · Facebook</em></div>
<div class="dbm-card"><b>Access-over-Ownership</b><span>Pelanggan membayar akses sementara atas produk/jasa tanpa
memilikinya.</span><em>Zipcar · Airbnb</em></div>
<div class="dbm-card"><b>Experience</b><span>Pelanggan diberi pengalaman unik yang membuatnya rela membayar harga
tinggi.</span><em>Tesla · Apple</em></div>
<div class="dbm-card"><b>On-Demand</b><span>Pelanggan membayar jasa yang tidak sempat ia kerjakan sendiri — dipenuhi
oleh orang yang punya waktu tapi butuh uang.</span><em>Uber · Taskrabbit (di Indonesia: Gojek/Grab)</em></div>
<div class="dbm-card"><b>Crowdfunding</b><span>Sejumlah besar individu berdonasi untuk menggalang dana bagi individu
atau tujuan tertentu.</span><em>Kickstarter · GoFundMe (di Indonesia: Kitabisa)</em></div>
<div class="dbm-card"><b>Ecosystem</b><span>Pelanggan dijual rangkaian produk/jasa yang saling terkait — makin banyak
yang dimiliki, makin tinggi nilai keseluruhannya.</span><em>Apple · Google</em></div>
</div>
<p>Untuk ujian, perhatikan pasangan yang mudah tertukar: <strong>Freemium vs Free</strong> — pada freemium pelanggan
bisa upgrade jadi pembayar (LinkedIn Premium), pada free pelanggan tidak pernah membayar karena datanya yang menjadi
dagangan (Google). Dan <strong>Access-over-Ownership vs On-Demand</strong> — yang pertama menyewakan <em>aset</em>
(mobil Zipcar, kamar Airbnb), yang kedua menjual <em>tenaga/waktu orang lain</em> (sopir Uber, tukang Taskrabbit).</p>
<div class="key-box"><strong>💡 Intinya:</strong> Transformasi digital = teknologi + proses + budaya + pengalaman
pelanggan. Digital business model menentukan cara menghasilkan uang lewat teknologi digital, sering dipakai kombinasi
(contoh Walmart), dan gagal bila hanya "memasang alat baru" tanpa mengubah proses dan orangnya.</div>`
        },
        {
          heading: "Operations Performance: 5 Performance Objectives",
          questions: [{"q": "Materi menyebut dependability dalam jangka panjang bisa mengalahkan semua kriteria lain. Tapi di pasar Indonesia yang sangat sensitif harga, konsumen tampak selalu kembali ke yang termurah. Apakah supremasi dependability itu berlaku universal, atau ada prasyarat tingkat pendapatan/kematangan pasar?", "guide": "Kenapa menarik: menantang klaim buku dengan konteks lokal secara sehat — diskusi 'kapan teori berlaku' selalu lebih dalam daripada 'apa teorinya'. Contoh untuk diskusi: KRL/kurir yang naik kelas karena konsistensi vs perang harga e-commerce. Follow-up: 'Di segmen B2B apakah jawabannya berbeda?'"}, {"q": "Polar diagram membandingkan prioritas objectives antar-operasi, tapi sifatnya statis. Dalam praktik, apakah perusahaan sebaiknya meninjau ulang profil polar-nya secara berkala — dan apa sinyal bahwa profil yang selama ini dipakai sudah tidak cocok dengan pasar?", "guide": "Kenapa menarik: mengubah alat deskriptif di slide menjadi alat manajemen hidup — pertanyaan praktis yang dosen teknik industri biasanya senang jawab. Jembatan ke konsep PLC: profil bergeser mengikuti fase produk. Follow-up: 'Siapa di organisasi yang seharusnya memiliki polar diagram ini?'"}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          visuals: ["perfObjectives", "efficientFrontier"],
          body: `<p>Bagaimana kita tahu sebuah operasi "bagus"?
Prinsipnya tegas: <em>kinerja operasi yang baik adalah fondasi kesuksesan berkelanjutan organisasi mana pun</em>.
Kinerja itu dinilai pada <strong>tiga level</strong>: level masyarakat (societal — dampak pada lingkungan dan
stakeholder luas), level strategis (kontribusi pada strategi bisnis), dan level operasional (kinerja harian proses).
Dalam praktik, organisasi memakai ukuran dari ketiga level sekaligus. Dan karena setiap kelompok stakeholder —
pemegang saham, karyawan, pelanggan, masyarakat — punya tujuan yang kadang saling bertentangan, adalah tanggung jawab
operations manager untuk memahami dan menyeimbangkannya.</p>
<h4 class="sub-h">Lima performance objectives — satu per satu</h4>
<p>Di level operasional, kinerja diukur dengan lima objective. Ini konsep paling penting di pertemuan pertama:</p>
<ul>
<li><strong>Quality</strong> — melakukan hal yang benar, sesuai kebutuhan pelanggan. Tujuan manajer adalah membangun
sistem total quality management yang mengidentifikasi dan memuaskan kebutuhan pelanggan. Kualitas meningkatkan
profitabilitas lewat <em>dua jalur</em>: (1) <em>sales gain</em> — respons membaik, harga bisa lebih fleksibel,
reputasi naik; (2) <em>reduced costs</em> — produktivitas naik, biaya rework/scrap turun, biaya garansi turun.
Kualitas juga menaikkan dependability: proses yang benar sejak awal jarang meleset dari jadwal.</li>
<li><strong>Speed</strong> — waktu yang berlalu antara pelanggan <em>meminta</em> dan <em>menerima</em> produk/jasa.
Respons cepat ke pelanggan eksternal sangat terbantu oleh pengambilan keputusan yang cepat serta pergerakan material
dan informasi yang cepat <em>di dalam</em> operasi. Manfaat internalnya: speed mengurangi persediaan (barang tidak
lama mengendap) dan mengurangi risiko (ramalan untuk waktu dekat lebih akurat).</li>
<li><strong>Dependability</strong> — menepati janji: pelanggan menerima produk/jasa tepat saat dibutuhkan atau
setidaknya sesuai yang dijanjikan. Menariknya, pelanggan baru bisa menilai dependability <em>setelah</em> produk
diterima — berbeda dengan harga yang terlihat di awal. Tapi seiring waktu, <strong>dependability bisa mengalahkan
semua kriteria lain</strong>: pelanggan yang berulang kali dikecewakan jadwal akan pergi, semurah apa pun harganya.
Secara internal, dependability menghemat waktu dan uang serta memberi stabilitas pada operasi.</li>
<li><strong>Flexibility</strong> — kemampuan operasi untuk <em>berubah</em>. Pelanggan membutuhkan empat jenis
fleksibilitas: <em>product/service flexibility</em> (kemampuan memperkenalkan produk baru), <em>mix flexibility</em>
(kemampuan mengubah bauran produk yang ditawarkan), <em>volume flexibility</em> (kemampuan mengubah tingkat output),
dan <em>delivery flexibility</em> (kemampuan mengubah waktu penyampaian). Manfaat internalnya: fleksibilitas
mempercepat respons, menghemat waktu, dan menjaga dependability saat terjadi gangguan.</li>
<li><strong>Cost</strong> — objective terakhir tapi bermuara dari semuanya. Semua operasi berkepentingan menjaga
biaya serendah mungkin <em>yang masih kompatibel</em> dengan level quality, speed, dependability, dan flexibility
yang dibutuhkan pelanggannya. Di sinilah letak hubungan indahnya: <strong>secara internal, cost dipengaruhi oleh
keempat objective lainnya</strong> — kualitas mengurangi pemborosan, kecepatan mengurangi persediaan, keandalan
mengurangi kejutan, fleksibilitas mempercepat penyesuaian. Memperbaiki empat hal itu adalah cara paling sehat
menurunkan biaya.</li>
</ul>
<h4 class="sub-h">Polar diagram: membandingkan prioritas antar-operasi</h4>
<p>Tidak semua operasi memprioritaskan kelima objective secara sama. <strong>Polar diagram</strong> (diagram
laba-laba di bawah) adalah cara visual menggambarkan kepentingan relatif tiap objective: makin jauh garis dari pusat,
makin penting objective itu. Contoh slide: <em>taksi</em> menonjol di speed dan flexibility (antar ke mana saja,
kapan saja), sedangkan <em>bus</em> menonjol di cost dan dependability (murah dan terjadwal). Contoh lain: organisasi
amal yang mempromosikan pangan organik akan punya profil yang berbeda lagi.</p>
<h4 class="sub-h">Trade-off dan efficient frontier</h4>
<p>Bisakah unggul di semua objective sekaligus? Umumnya tidak — ada <strong>trade-off</strong>. Meningkatkan
fleksibilitas sering menaikkan biaya; menekan biaya habis-habisan bisa mengorbankan kecepatan. Konsep
<strong>efficient frontier</strong> menggambarkan batas kombinasi kinerja terbaik yang mungkin dicapai saat ini:
operasi yang sudah berada di frontier hanya bisa menaikkan satu objective dengan mengorbankan yang lain — kecuali ia
berinvestasi menggeser frontier itu sendiri (misalnya lewat teknologi atau metode baru).</p>
<h4 class="sub-h">Melihat tiga level kinerja lebih dekat</h4>
<p>Slide "Three levels of operations performance" dan "Performance measures at the three levels" memerinci isi
tiap level beserta contoh ukurannya:</p>
<ul>
<li><strong>Societal level — operations sustainability.</strong> Digambarkan sebagai <em>triple bottom line</em>:
People (sosial), Planet (lingkungan), Profit (ekonomi) yang beririsan pada "sustainability". Contoh ukuran: kepuasan
& keselamatan karyawan, gender balance, program komunitas (People); emisi CO₂, limbah kemasan, penggunaan air,
biodiversitas (Planet); return on invested capital, harga saham, pertumbuhan yang menguntungkan (Profit).</li>
<li><strong>Strategic level — dampak strategis operasi.</strong> Operasi memengaruhi lima hal: <em>cost</em>,
<em>revenue</em>, <em>capital</em> (return on assets, utilisasi kapasitas), <em>risk & resilience</em> (gangguan
layanan, kecepatan pulih/business continuity), dan <em>learning</em> (kapabilitas untuk inovasi, pipeline penawaran
baru).</li>
<li><strong>Operational level — 5 performance objectives</strong>, masing-masing dengan ukuran konkretnya:
quality (cacat per unit, keluhan pelanggan, tingkat scrap, biaya garansi), speed (waktu respons pertanyaan pelanggan,
order lead time, throughput time), dependability (rata-rata waktu antar kegagalan/MTBF, keluhan keterlambatan),
flexibility (time to market, lebar rentang produk, tingkat kustomisasi), cost (biaya transaksi, produktivitas tenaga
kerja, efisiensi mesin, varians terhadap anggaran).</li>
</ul>
<p>Ukuran-ukuran detail itu bisa diagregasi menjadi ukuran komposit (customer satisfaction, overall service level,
operations agility) yang merepresentasikan kinerja keseluruhan — dan sebaliknya bisa dipecah makin rinci untuk
dimonitor makin sering.</p>
<h4 class="sub-h">Siapa saja stakeholder operasi dan apa maunya?</h4>
<p>Slide "Stakeholder groups" memetakan tuntutan tiap kelompok — perhatikan betapa mudahnya mereka saling
bertentangan:</p>
<ul>
<li><strong>Pelanggan</strong> — harga pantas, layanan baik, kualitas terjaga.</li>
<li><strong>Pemasok</strong> — pemberitahuan kebutuhan sejak awal, order jangka panjang, harga adil, pembayaran
tepat waktu.</li>
<li><strong>Pemegang saham</strong> — return on investment, stabilitas laba, likuiditas investasi.</li>
<li><strong>Top management</strong> — profit yang layak, ROI, risiko kegagalan rendah, inovasi masa depan.</li>
<li><strong>Staf</strong> — upah adil, kondisi kerja baik, pengembangan pribadi/karier; <strong>serikat/perwakilan
staf</strong> — kesesuaian dengan kesepakatan nasional, konsultasi.</li>
<li><strong>Pemerintah</strong> — kepatuhan hukum, kontribusi pada ekonomi; <strong>regulator</strong> — kepatuhan
regulasi & umpan balik efektivitasnya; <strong>masyarakat</strong> — meminimalkan dampak negatif (kebisingan, lalu
lintas) dan memaksimalkan dampak positif (lapangan kerja, sponsor lokal); <strong>kelompok kepentingan</strong> —
keselarasan aktivitas organisasi dengan isu yang mereka perjuangkan.</li>
</ul>
<div class="key-box"><strong>💡 Intinya:</strong> Lima objectives = Quality, Speed, Dependability, Flexibility, Cost
(mnemonik: <em>QSDFC</em>). Masing-masing punya efek eksternal (dilihat pelanggan) dan efek internal (memengaruhi
biaya). Prioritasnya berbeda antar-operasi (polar diagram) dan saling tarik-menarik (trade-off, efficient frontier).</div>`
        },
        {
          heading: "Produktivitas",
          questions: [{"q": "Di kasus Starbucks, menghemat 8–14 detik per transaksi menaikkan produktivitas 27%. Tapi kafe justru menjual suasana dan pengalaman — di titik mana perburuan detik mulai merusak nilai yang dijual? Bagaimana operasi menentukan batas antara efisiensi dan erosi pengalaman pelanggan?", "guide": "Kenapa menarik: ini ketegangan inti kasus Starbucks yang slide-nya tidak bahas — efisiensi vs experience. Perhatikan detailnya: yang dipangkas Starbucks adalah waktu yang TIDAK bernilai bagi pelanggan (menunggu tanda tangan), bukan interaksi baristanya. Follow-up: 'Apakah ada kerangka formal untuk memilah aktivitas yang boleh dipangkas — semacam value-added analysis di sisi layanan?'"}, {"q": "Kasus Collins Title menunjukkan labor productivity naik 75% tapi multifactor hanya 26% — dua angka yang bisa menceritakan kisah berbeda ke manajemen. Dalam evaluasi investasi teknologi yang sesungguhnya, angka mana yang sebaiknya menjadi dasar keputusan akhir, dan bagaimana memasukkan dampak yang tak terukur seperti kualitas layanan atau kelelahan staf?", "guide": "Kenapa menarik: mengangkat kasus hitungan di slide ke level keputusan manajerial — dan menyentuh keterbatasan pengukuran, wilayah yang dekat dengan riset dosen. Follow-up: 'Pernahkah Ibu menemui kasus di mana produktivitas naik di atas kertas tapi kinerja bisnis turun?'"}, {"q": "Untuk pekerja pengetahuan — konsultan, peneliti, bahkan dosen — output-nya sulit dihitung per unit. Ukuran produktivitas apa yang adil untuk knowledge workers, dan apakah memaksakan metrik kuantitatif justru menurunkan kualitas kerjanya?", "guide": "Kenapa menarik: pertanyaan yang relevan untuk hampir semua mahasiswa MBA (mayoritas knowledge workers) dan sedikit menyentil profesi dosen — biasanya mengundang jawaban jujur dan diskusi hangat. Kaitannya ke materi: keterbatasan single-factor productivity di sektor jasa."}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          body: `<p>Dari lima performance objectives, cost adalah yang paling mudah diukur — dan ukuran
yang paling sering dipakai untuk itu adalah <strong>produktivitas</strong>. Konsep ini dijamin muncul di ujian dalam
bentuk soal hitungan, jadi mari kita kuasai sampai tuntas.</p>
<h4 class="sub-h">Definisi dan dua jenis ukuran</h4>
<p><strong>Produktivitas = Output ÷ Input.</strong> Sesederhana itu: berapa banyak yang dihasilkan dibagi berapa
banyak sumber daya yang dipakai. Produktivitas adalah ukuran <em>perbaikan proses</em> — naiknya produktivitas berarti
kita menghasilkan lebih banyak dengan sumber daya yang sama (atau sama banyak dengan sumber daya lebih sedikit).</p>
<ul>
<li><strong>Single-factor productivity</strong> — hanya menghitung <em>satu</em> input. Yang paling umum:
<em>labor productivity</em> = unit yang diproduksi ÷ jam kerja (labor-hours). Mudah dihitung, tapi hanya memotret
satu sisi.</li>
<li><strong>Multifactor productivity</strong> (disebut juga <em>total factor productivity</em>) — menghitung
<em>semua</em> input: Output ÷ (Labor + Material + Energy + Capital + Miscellaneous). Karena inputnya beragam,
semuanya dikonversi ke satuan uang. Lebih repot, tapi jauh lebih jujur.</li>
</ul>
<h4 class="sub-h">Contoh soal lengkap: Collins Title Insurance</h4>
<div class="case-box"><p><strong>📌 Soal:</strong> Collins Title ingin mengevaluasi produktivitasnya setelah memasang
sistem pencarian titel terkomputerisasi. Kondisi awal: 4 staf, masing-masing bekerja 8 jam/hari (biaya payroll
$640/hari), overhead $400/hari, memproses <strong>8 titel per hari</strong>. Dengan sistem baru: staf, jam kerja, dan
gaji tetap sama, tapi bisa memproses <strong>14 titel per hari</strong> — dengan overhead naik menjadi $800/hari.
Apakah sistem baru ini meningkatkan produktivitas?</p>
<p><strong>Langkah 1 — Labor productivity (single factor):</strong><br>
Total jam kerja = 4 staf × 8 jam = 32 jam/hari.<br>
Sistem lama: 8 ÷ 32 = <strong>0,25</strong> titel per jam kerja.<br>
Sistem baru: 14 ÷ 32 = <strong>0,4375</strong> titel per jam kerja.<br>
Kenaikan = (0,4375 − 0,25) ÷ 0,25 = <strong>75%</strong>.</p>
<p><strong>Langkah 2 — Multifactor productivity:</strong><br>
Sistem lama: 8 ÷ (640 + 400) = 8 ÷ 1040 = <strong>0,0077</strong> titel per dolar.<br>
Sistem baru: 14 ÷ (640 + 800) = 14 ÷ 1440 = <strong>0,0097</strong> titel per dolar.<br>
Kenaikan = (0,0097 − 0,0077) ÷ 0,0077 = <strong>26%</strong>.</p>
<p><strong>Insight:</strong> Kedua ukuran menunjukkan kenaikan — tapi lihat bedanya: 75% vs 26%! Ukuran multifactor
memberi gambaran yang lebih akurat karena ikut menghitung kenaikan overhead $400. Kalau Anda hanya melihat labor
productivity, Anda akan terlalu optimis menilai investasi sistem ini. <em>Latihan dari buku:</em> jika overhead naik
ke $960 (bukan $800), multifactor productivity baru = 14 ÷ 1600 = <strong>0,00875</strong> — coba verifikasi di menu
Kalkulator aplikasi ini.</p></div>
<h4 class="sub-h">Cerita nyata: Starbucks</h4>
<p>Produktivitas bukan cuma soal mesin mahal — sering kali soal detik-detik kecil. Tim 10 analis Starbucks terus
mencari cara memangkas waktu: berhenti mewajibkan tanda tangan untuk pembelian kartu kredit di bawah $25
(<em>hemat 8 detik per transaksi</em>), mengganti ukuran scoop es (<em>hemat 14 detik per minuman</em>), dan memasang
mesin espresso baru (<em>hemat 12 detik per shot</em>). Hasil akumulasinya luar biasa: pendapatan per gerai naik
$200.000 menjadi $940.000 dalam enam tahun, dan produktivitas naik <strong>27%</strong> — sekitar 4,5% per tahun.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Produktivitas = output ÷ input. Single-factor (mis. per jam kerja)
mudah tapi parsial; multifactor (semua input dalam dolar) lebih lengkap dan lebih jujur. Untuk ujian: hafalkan langkah
Collins Title — hitung total jam kerja dulu, jangan lupa menjumlahkan SEMUA biaya untuk multifactor, dan hitung
persentase perubahan dengan (baru − lama) ÷ lama.</div>`
        },
        {
          heading: "Operations Strategy: 4 Perspektif",
          questions: [{"q": "Kalau perspektif outside-in dan inside-out menunjuk arah berbeda — pasar menuntut murah, sementara kapabilitas kita justru di kustomisasi premium — perspektif mana yang seharusnya menang? Apakah ada urutan prioritas di antara keempat perspektif, atau rekonsiliasinya selalu kasus-per-kasus seperti Micraytech?", "guide": "Kenapa menarik: slide bilang 'keempatnya harus direkonsiliasi' tapi tidak bilang BAGAIMANA saat mereka bertabrakan — itu celah diskusi yang tajam. Follow-up: 'Dalam pengalaman Ibu, perusahaan Indonesia lebih sering gagal karena mengabaikan perspektif yang mana?'"}, {"q": "Di importance–performance matrix, zona 'excess?' menyarankan realokasi sumber daya dari faktor yang kinerjanya tinggi tapi tidak penting bagi pelanggan. Tapi kadang kelebihan itu justru ciri khas yang membedakan brand — bagaimana membedakan excess yang aman dipangkas dari excess yang diam-diam menjadi identitas?", "guide": "Kenapa menarik: mempersoalkan sisi paling kontroversial dari matrix — tanda baca '?' pada zona excess memang disengaja penulisnya. Contoh diskusi: pelayanan berlebih ala restoran Jepang yang 'tidak diminta' pelanggan tapi jadi reputasi. Follow-up: 'Bagaimana menguji secara murah apakah pelanggan diam-diam menghargai faktor itu?'"}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          visuals: ["strategyPerspectives", "importancePerformance"],
          body: `<p>Kalau operations management adalah "menjalankan mesin", maka
<strong>operations strategy</strong> adalah menentukan "mesin seperti apa yang kita bangun dan ke mana arahnya".
Definisi formalnya: <em>pola keputusan dan aksi yang membentuk visi jangka panjang, tujuan, dan kapabilitas operasi,
serta kontribusinya terhadap strategi bisnis keseluruhan</em>. Isi (content) dari operations strategy adalah
keputusan dan aksi spesifik yang menetapkan peran, tujuan, dan aktivitas operasi.</p>
<h4 class="sub-h">Empat perspektif pembentuk strategi operasi</h4>
<p>Dari mana strategi operasi seharusnya berasal? Slack menawarkan empat perspektif — dan ini poin pentingnya:
<strong>tidak ada satu pun yang lengkap sendirian</strong>; keempatnya bersama-sama membentuk tekanan yang menentukan
isi strategi operasi.</p>
<ul>
<li><strong>Top-down</strong> — strategi operasi "diturunkan" dari atas, mengikuti hierarki tiga level:
<em>corporate strategy</em> (grup mau ke mana), <em>business strategy</em> (tiap unit bisnis bersaing bagaimana),
lalu <em>functional strategy</em> (tiap fungsi mendukung bagaimana). Dua kata kunci: <em>correspondence</em> —
harus ada hubungan yang jelas, eksplisit, dan logis antara strategi fungsional dengan keputusan-keputusan di dalam
fungsi; dan <em>coherence</em> — semua keputusan harus saling melengkapi dan menguatkan, tidak menarik operasi ke
arah yang berbeda-beda.</li>
<li><strong>Outside-in (market perspective)</strong> — strategi operasi dibentuk oleh kebutuhan pasar. Alat pentingnya
adalah membedakan tiga jenis faktor kompetitif:
<em>Order winners</em> — faktor yang secara langsung dan signifikan memenangkan bisnis; makin baik kinerjanya, makin
banyak order masuk. <em>Order qualifiers</em> — "tiket masuk": mungkin bukan penentu kemenangan, tapi di bawah level
tertentu organisasi bahkan <em>tidak dipertimbangkan</em> oleh pelanggan. <em>Less important factors</em> — tidak
banyak memengaruhi pelanggan. Contoh sehari-hari: untuk warung makan siang kantoran, kebersihan adalah qualifier
(kotor = langsung dicoret), sedangkan kecepatan penyajian bisa jadi order winner. Perhatikan juga bahwa posisi produk
pada <em>product/service life cycle</em> menggeser objective yang relevan.</li>
<li><strong>Bottom-up</strong> — strategi muncul dari bawah: banyak organisasi bergerak ke arah strategis tertentu
karena <em>pengalaman operasional sehari-hari</em> meyakinkan mereka bahwa itulah jalan yang benar. Inovasi di lantai
operasi bisa naik menjadi strategi perusahaan. Perspektif top-down dan bottom-up idealnya saling menguatkan.</li>
<li><strong>Inside-out (operations resources perspective)</strong> — keunggulan kompetitif jangka panjang berasal
dari <em>kapabilitas sumber daya dan proses operasi</em> yang dikembangkan pelan-pelan dan sulit ditiru kompetitor.
Strategi dibangun dari kekuatan unik yang sudah dimiliki, bukan hanya dari permintaan pasar.</li>
</ul>
<div class="case-box"><strong>📌 Contoh dari slide — Micraytech:</strong> perusahaan sistem metrologi (bagian dari
Micray Group) yang mengembangkan sistem pengukuran terintegrasi untuk klien internasional besar. Strategi operasinya
adalah hasil rekonsiliasi keempat perspektif sekaligus: arahan grup (top-down), tuntutan klien (outside-in),
pembelajaran operasional (bottom-up), dan kapabilitas teknologinya (inside-out).</div>
<h4 class="sub-h">Menyelaraskan pasar dan kapabilitas: line of fit</h4>
<p><strong>Operations strategy matrix</strong> mempertemukan <em>market requirements</em> (apa yang pasar minta)
dengan <em>operations capabilities</em> (apa yang operasi mampu). Idealnya keduanya berada pada "line of fit" —
selaras. Titik A menggambarkan keselarasan di level rendah (pasar tidak menuntut banyak, operasi juga biasa saja);
titik B keselarasan di level tinggi. Asumsi kebanyakan perusahaan: <strong>B lebih diinginkan daripada A</strong>
karena lebih mungkin merepresentasikan posisi yang sukses secara finansial.</p>
<h4 class="sub-h">Importance–performance matrix: menentukan prioritas perbaikan</h4>
<p>Alat praktis untuk memutuskan <em>apa yang diperbaiki duluan</em>. Setiap faktor kompetitif dipetakan pada dua
sumbu: seberapa <em>penting</em> bagi pelanggan, dan seberapa baik <em>kinerja</em> kita dibanding kompetitor.
Hasilnya empat zona:</p>
<ul>
<li><strong>Appropriate</strong> — di atas batas kelayakan; memuaskan, pertahankan.</li>
<li><strong>Improve</strong> — di bawah batas kelayakan; masuk daftar perbaikan.</li>
<li><strong>Urgent-action</strong> — penting bagi pelanggan tapi kinerja di bawah kompetitor; perbaiki SEGERA.</li>
<li><strong>Excess?</strong> — kinerja tinggi pada faktor yang tidak penting; tanyakan: apakah sumber daya di sini
sebaiknya dialihkan ke tempat lain?</li>
</ul>
<div class="case-box"><strong>📌 Contoh dari slide — YIR Laboratories:</strong> anak perusahaan elektronik ini harus
memutuskan aspek layanan mana yang diperbaiki lebih dulu. Caranya: menyusun daftar aspek terpenting layanannya, memberi
skor kepentingan dan kinerja pada skala 1–9, lalu memetakan tiap aspek ke dalam matriks — aspek di zona urgent-action
otomatis jadi prioritas pertama.</div>
<p>Terakhir, ingat bahwa strategi operasi disusun melalui <em>proses</em> bertahap (formulation → implementation →
monitoring → control) — strategi bukan dokumen sekali jadi.</p>
<h4 class="sub-h">Membaca order winners lewat kurvanya</h4>
<p>Slide menggambarkan tiga jenis faktor kompetitif sebagai kurva "competitive benefit vs performance":
<strong>order winners</strong> berbentuk garis naik — makin baik kinerja, makin besar manfaat kompetitifnya, tanpa
batas; <strong>qualifiers</strong> berbentuk kurva S — di bawah <em>qualifying level</em> sangat merugikan, tapi
setelah melewatinya manfaat tambahan mendatar (percuma jor-joran); <strong>less important factors</strong> nyaris
datar — diperbaiki pun dampaknya kecil. Implikasi praktisnya: investasi besar-besaran hanya layak untuk order
winners; untuk qualifiers cukup sampai level "lolos".</p>
<h4 class="sub-h">Bagaimana product life cycle menggeser order winners</h4>
<p>Slide "The effects of the product/service life cycle" merinci pergeseran per fase — tabel ini favorit dosen untuk
soal ujian:</p>
<ul>
<li><strong>Introduction</strong> — pelanggan: innovators; kompetitor: sedikit/tidak ada; order winner: <em>spesifikasi
produk/jasa</em>; qualifier: quality & range; objectives dominan: <strong>flexibility & quality</strong>.</li>
<li><strong>Growth</strong> — pelanggan: early adopters; kompetitor: terus bertambah; order winner:
<em>availability</em> (barang harus ada!); qualifier: price & range; objectives dominan: <strong>speed,
dependability, quality</strong>.</li>
<li><strong>Maturity</strong> — pelanggan: bulk of market; kompetitor: stabil; order winner: <em>harga murah &
pasokan andal</em>; qualifier: range & quality; objectives dominan: <strong>cost & dependability</strong>.</li>
<li><strong>Decline</strong> — pelanggan: laggards; kompetitor: menurun; order winner: <em>harga murah</em>;
qualifier: pasokan andal; objective dominan: <strong>cost</strong>.</li>
</ul>
<h4 class="sub-h">Proses penyusunan strategi: empat tahap berdaur</h4>
<p>Strategi operasi disusun melalui siklus empat tahap: <strong>formulation</strong> (merumuskan) →
<strong>implementation</strong> (menjalankan) → <strong>monitoring</strong> (memantau) → <strong>control</strong>
(mengendalikan & mengoreksi) → kembali ke formulation. Ini menegaskan strategi bukan dokumen sekali jadi. Contoh
hierarki top-down dari slide (printing services group): corporate "spesialisasi di bisnis kemasan, jadi pemain besar
di semua pasar" → business strategy kemasan konsumen "pertumbuhan volume cepat, layanan cepat, skala ekonomi" →
operations strategy "ekspansi kapasitas, toleransi over-capacity jangka pendek, buka lokasi baru". Terlihat bagaimana
tiap level menerjemahkan level di atasnya.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Operations strategy dibentuk 4 perspektif: top-down (hierarki),
outside-in (order winners &amp; qualifiers), bottom-up (pengalaman operasional), inside-out (kapabilitas sumber daya).
Alat analisisnya: operations strategy matrix (line of fit) dan importance–performance matrix (4 zona prioritas).</div>`
        },
        {
          heading: "Competitive Advantage & Operasi Global",
          questions: [{"q": "Franz Colruyt memangkas biaya sampai meniadakan kantong belanja, meredupkan lampu, dan mematikan musik — dan pelanggannya menerima karena janjinya memang harga termurah. Di budaya belanja Indonesia yang sosial dan mementingkan layanan, seberapa jauh cost-cutting yang terlihat pelanggan bisa diterima — dan apa contoh batas yang pernah dilanggar peritel lokal?", "guide": "Kenapa menarik: menguji transferabilitas strategi lintas budaya — tema yang pas dengan bagian operasi global. Follow-up: 'Apakah cost leadership di Indonesia menuntut biaya rendah yang TIDAK terlihat pelanggan (back office) alih-alih yang terlihat?'"}, {"q": "Dari enam alasan globalisasi, mana yang menurut Ibu paling realistis menjadi pintu masuk UMKM Indonesia ke pasar global — dan kesalahan apa yang paling sering dilakukan perusahaan lokal di langkah internasional pertamanya?", "guide": "Kenapa menarik: menurunkan kerangka besar (6 alasan go-global) ke aksi konkret untuk skala UMKM — konteks yang sangat Indonesia. Catat jawabannya untuk bekal proyek tim. Follow-up: 'Lebih baik mulai dari ekspor, lisensi, atau ikut marketplace global seperti Alibaba?'"}],
          source: { kind: "ppt", label: "Slide Pertemuan 1" },
          visuals: ["competitiveAdvantage"],
          body: `<p><strong>Competitive advantage</strong> berarti menciptakan
sistem yang punya keunggulan unik atas kompetitor. Bagaimana operasi bisa menyumbangkannya? Lewat tiga strategi —
dan cara terbaik memahaminya adalah lewat kisah perusahaan nyata:</p>
<h4 class="sub-h">Tiga strategi keunggulan kompetitif</h4>
<ul>
<li><strong>Differentiation — "lebih baik, atau setidaknya berbeda".</strong> Keunikan tidak berhenti di karakteristik
fisik produk; ia mencakup <em>segala hal yang memengaruhi persepsi nilai pelanggan</em>. Contoh: Safeskin memimpin
lewat produk sarung tangan paling mutakhir; Walt Disney Magic Kingdom menjual <em>experience differentiation</em> —
yang dibeli pengunjung adalah pengalamannya, bukan wahananya; Hard Rock Cafe menjual "dining experience", bukan
sekadar makanan.</li>
<li><strong>Cost leadership — "lebih murah".</strong> Hati-hati dengan salah paham umum: cost leadership berarti
memberikan <em>nilai maksimum di mata pelanggan</em> dengan biaya rendah — <strong>bukan berarti kualitas rendah</strong>.
Contoh: Southwest Airlines memakai bandara sekunder yang murah, layanan tanpa embel-embel, dan utilisasi pesawat yang
sangat efisien; Walmart menekan overhead, kehilangan barang (shrinkage), dan biaya distribusi; supermarket Belgia
Franz Colruyt ekstrem: tanpa kantong belanja, lampu redup, tanpa musik, dan freezer berpintu demi hemat listrik.</li>
<li><strong>Response — "lebih responsif".</strong> Terdiri dari tiga komponen: <em>flexibility</em> — mengikuti
perubahan pasar dalam inovasi desain dan volume (cara hidup di Hewlett-Packard); <em>reliability</em> — konsisten
menepati jadwal (keunggulan industri mesin Jerman); dan <em>timeliness</em> — cepat dalam desain, produksi, dan
pengiriman (Johnson Electric, Pizza Hut, Motorola).</li>
</ul>
<p>Ketiganya juga membedakan bagaimana 10 keputusan OM dijalankan untuk <em>barang</em> vs <em>jasa</em> — misalnya
kualitas barang punya banyak standar objektif, sementara kualitas jasa lebih subjektif; persediaan barang bisa
disimpan, jasa tidak bisa.</p>
<h4 class="sub-h">Mengapa perusahaan go-global? Enam alasan</h4>
<p>Perusahaan yang tadinya domestik memutuskan beroperasi internasional karena enam alasan utama:</p>
<ul>
<li><strong>1. Memperbaiki supply chain</strong> — menempatkan fasilitas dekat sumber daya unik: desain otomotif
pindah ke California demi talenta desain; produksi parfum di Prancis karena esens bunga Mediterania ada di sana.</li>
<li><strong>2. Menekan biaya dan risiko nilai tukar</strong> — lokasi asing dengan upah lebih rendah menekan biaya;
<em>operational hedging</em> = menjaga kapasitas berlebih di beberapa negara lalu menggeser produksi antarnegara
mengikuti perubahan biaya dan kurs. Perjanjian dagang (WTO, EU, APEC, dll.) memuluskan jalannya.</li>
<li><strong>3. Memperbaiki operasi</strong> — belajar dari keunggulan negara lain: Jepang unggul manajemen persediaan,
Jerman agresif memakai robot, Skandinavia berkontribusi pada ergonomika.</li>
<li><strong>4. Memahami pasar</strong> — berinteraksi dengan pelanggan dan pemasok asing membuka peluang baru
(desain ponsel dari Eropa, tren ponsel dari Jepang) dan memperpanjang product life cycle: produk yang jenuh di satu
negara bisa tumbuh di negara lain.</li>
<li><strong>5. Memperbaiki produk</strong> — aliansi R&amp;D lintas negara: Toyota–BMW berbagi biaya riset baterai
generasi berikutnya; Samsung–Bosch patungan memproduksi baterai lithium-ion.</li>
<li><strong>6. Menarik dan mempertahankan talenta global</strong> — menawarkan peluang karier yang lebih baik,
perlindungan dari PHK saat pasar lokal lesu, dan mobilitas karyawan antarnegara.</li>
</ul>
<h4 class="sub-h">Isu budaya dan etika</h4>
<p>Operasi global berarti berhadapan dengan budaya yang berbeda-beda: sikap terhadap ketepatan waktu, jam istirahat,
lingkungan, kekayaan intelektual, pencurian, suap, hingga pekerja anak. Perusahaan juga menimbang faktor negara:
tingkat literasi, laju inovasi dan perubahan teknologi, jumlah tenaga terampil, stabilitas politik, hukum kewajiban
produk, pembatasan ekspor, bahasa, etos kerja, pajak, dan inflasi.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Tiga jalan competitive advantage lewat operasi: differentiation,
cost leadership (murah ≠ kualitas rendah!), dan response (flexibility + reliability + timeliness). Enam alasan
globalisasi: supply chain, biaya &amp; kurs, perbaikan operasi, pemahaman pasar, perbaikan produk, dan talenta.</div>`
        },
        {
          heading: "Pendalaman dari Buku HRM Bab 1",
          questions: [{"q": "Heizer menyebut management menyumbang 52% kenaikan produktivitas — jauh melampaui labor dan capital. Tapi saat efisiensi, yang dipangkas perusahaan justru sering pelatihan dan pengembangan manajerial. Bagaimana seorang manajer membuktikan ROI dari 'kualitas manajemen' agar tidak jadi korban pemangkasan pertama?", "guide": "Kenapa menarik: mengadu angka ikonik dari buku dengan perilaku nyata perusahaan — paradoks yang enak didiskusikan. Follow-up: 'Metrik apa yang bisa menunjukkan kontribusi manajemen terhadap produktivitas secara terpisah dari faktor lain?'"}, {"q": "Karena jasa tidak bisa disimpan sebagai persediaan, kapasitas yang menganggur hari ini hangus selamanya — kursi pesawat kosong tidak bisa dijual besok. Dari industri jasa Indonesia yang pernah Ibu amati, siapa yang paling cerdik mengelola kapasitas menghadapi permintaan bergelombang, dan teknik apa yang mereka pakai?", "guide": "Kenapa menarik: meminta studi kasus lokal dari keahlian dosen tentang salah satu konsekuensi paling fundamental dari karakteristik jasa. Teknik yang mungkin muncul: dynamic pricing, promo off-peak, kapasitas fleksibel. Jembatan bagus ke materi capacity management (Sesi 5) — tunjukkan Anda membaca silabus ke depan."}],
          source: { kind: "book", label: "Buku HRM bab 1" },
          body: `<p>Bagian ini adalah pengayaan dari buku <strong>Heizer, Render &amp;
Munson bab 1</strong> — materi yang tidak sempat dibahas mendalam di slide, tapi melengkapi pemahaman Anda (dan bisa
jadi bahan soal ujian).</p>
<h4 class="sub-h">Perbedaan barang (goods) dan jasa (services)</h4>
<p>Mengapa mengelola restoran berbeda dari mengelola pabrik? Karena karakter output-nya berbeda fundamental.
Perhatikan sembilan kontras ini — di kolom kiri karakter jasa, di kanan padanannya untuk barang:</p>
<ul>
<li><strong>Intangible vs tangible</strong> — yang Anda beli dari maskapai adalah "perjalanan" (tak berwujud);
kursinya sendiri adalah barang.</li>
<li><strong>Diproduksi &amp; dikonsumsi bersamaan vs bisa disimpan</strong> — potong rambut "diproduksi" saat itu
juga dan langsung "dikonsumsi"; sampo bisa disimpan di gudang.</li>
<li><strong>Unik per pelanggan vs produk serupa</strong> — portofolio investasi dan perawatan medis Anda unik;
iPod diproduksi seragam jutaan unit.</li>
<li><strong>Interaksi pelanggan tinggi vs keterlibatan terbatas</strong> — pada konsultasi atau pendidikan,
interaksi itulah yang dibayar pelanggan.</li>
<li><strong>Definisi produk tidak konsisten vs terstandardisasi</strong> — polis asuransi mobil berubah mengikuti
usia dan jenis mobil; iPhone spesifikasinya tetap.</li>
<li><strong>Berbasis pengetahuan vs mudah diotomasi</strong> — jasa hukum, pendidikan, dan medis sulit diotomasi;
produk tangible yang standar justru mudah.</li>
<li><strong>Lokasi tersebar vs fasilitas tetap</strong> — jasa bisa terjadi di toko, kantor cabang, rumah pelanggan,
atau lewat internet; barang biasanya dibuat di fasilitas tetap.</li>
<li><strong>Kualitas sulit dievaluasi vs mudah diukur</strong> — menilai mutu konsultasi itu subjektif; kekuatan
baut bisa diukur objektif.</li>
<li><strong>Tidak bisa dijual kembali</strong> — tiket konser yang sudah dipakai atau layanan medis tidak bisa
dijual ulang.</li>
</ul>
<p>Implikasinya bagi operations manager: hampir semua dari 10 keputusan OM dieksekusi berbeda untuk jasa — lokasi
harus dekat pelanggan (bukan dekat bahan baku), persediaan tidak bisa jadi penyangga permintaan, dan penjadwalan
harus melayani permintaan seketika.</p>
<h4 class="sub-h">Tiga variabel produktivitas: siapa penyumbang terbesarnya?</h4>
<p>Dari mana datangnya kenaikan produktivitas? Heizer membaginya ke tiga variabel — dan proporsinya mengejutkan
banyak orang:</p>
<ul>
<li><strong>Labor (tenaga kerja)</strong> — menyumbang hanya sekitar <strong>10%</strong> dari kenaikan tahunan.
Perbaikannya lewat tenaga kerja yang lebih sehat, terdidik, dan terlatih.</li>
<li><strong>Capital (modal)</strong> — menyumbang sekitar <strong>38%</strong>. Investasi mesin dan alat membuat
tiap jam kerja lebih produktif.</li>
<li><strong>Management (manajemen)</strong> — menyumbang sekitar <strong>52%</strong> — lebih dari separuh!
Manajemen bertanggung jawab memastikan tenaga kerja dan modal dipakai secara efektif: memilih teknologi yang tepat,
membangun proses yang baik, dan memanfaatkan pengetahuan.</li>
</ul>
<p>Angka 52% itu adalah kabar baik untuk Anda sebagai calon manajer: kontributor terbesar produktivitas bukan
kerja lebih keras (labor) atau mesin lebih mahal (capital), melainkan <em>keputusan manajemen yang lebih baik</em> —
persis yang sedang Anda pelajari di mata kuliah ini.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Jasa ≠ barang di sembilan dimensi (intangible, simultan, unik,
interaksi tinggi, dst.) — dan itu mengubah cara mengelola operasinya. Kenaikan produktivitas: labor 10% + capital
38% + management 52% — manajemen adalah pengungkit terbesar.</div>`
        }
      ]
    },
    {
      id: 2, date: "2026-08-15", dateLabel: "15 Agustus 2026",
      topic: "Operations Strategy",
      subtopics: ["Operations Strategy (lanjutan & pendalaman)"],
      readings: ["SBB bab 3", "HRM bab 2"],
      caseStudy: null,
      summary: [
        {
          heading: "Operations Strategy dalam Lingkungan Global (HRM Bab 2)",
          questions: [{"q": "Boeing sengaja membagi produksi 787 ke banyak negara sebagian agar negara-negara itu membeli pesawatnya. Apakah strategi 'offset produksi' seperti ini realistis diadopsi industri strategis Indonesia seperti PT DI atau PT PAL untuk menembus pasar ekspor — atau skala kita belum memungkinkan?", "guide": "Kenapa menarik: mengaitkan kasus pembuka bab dengan industri strategis nasional — diskusi kebijakan industri yang jarang muncul di kelas. Follow-up: 'Untuk masuk rantai pasok global, lebih baik Indonesia menjadi pemasok komponen (seperti mitra Boeing) dulu atau memaksakan produk akhir sendiri?'"}, {"q": "Program 787 juga terkenal molor bertahun-tahun dan biayanya membengkak justru karena kompleksitas koordinasi mitra globalnya. Setelah kasus itu (dan krisis 737 MAX), apakah pendulum industri manufaktur besar sedang berbalik dari outsourcing desain ke integrasi vertikal kembali — dan pelajaran apa yang bisa dipetik perusahaan yang jauh lebih kecil?", "guide": "Kenapa menarik: menampilkan sisi gelap kasus yang di buku diceritakan sebagai kisah sukses — menunjukkan Anda membaca kritis dan mengikuti berita industri. Follow-up: 'Berapa banyak dari total nilai produk yang aman di-outsource sebelum kendali mutu tidak lagi bisa dijaga?'"}],
          source: { kind: "book", label: "Buku HRM bab 2" },
          body: `<p>Materi sesi ini disusun utuh dari buku
<strong>Heizer, Render &amp; Munson bab 2 — "Operations Strategy in a Global Environment"</strong>, bacaan wajib
Sesi 2, sebagai bekal Anda sebelum kuliah. Begitu slide Pertemuan 2 dari dosen tersedia di Drive, materi ini akan
disusun ulang mengikuti alur penjelasan di kelas — dengan materi buku tetap dipertahankan sebagai pengayaan
bertanda 📖.</p>
<h4 class="sub-h">Kisah pembuka: Boeing 787 Dreamliner</h4>
<p>Buku ini membuka bab dengan kisah yang bagus untuk memahami "operasi global". Strategi Boeing untuk 787
Dreamliner unik karena menggabungkan <em>desain produk yang secara teknologi sangat maju</em> dengan <em>supply
chain global</em>. Dengan komitmen finansial lebih dari $5 miliar, Boeing menerima tantangan bermitra secara global:
kolaborasi dengan General Electric untuk mesin, serta puluhan mitra dari Jepang, Italia, dan berbagai negara yang
masing-masing membuat bagian pesawat — sayap, badan, sistem — lalu mengirimkannya ke fasilitas perakitan akhir Boeing
di Everett, Washington.</p>
<p>Mengapa repot-repot begitu? Ada logika strategisnya: teknologi kolaboratif memungkinkan tiap mitra mengerjakan
keahlian terbaiknya; risiko dan biaya pengembangan terbagi; dan — ini yang cerdas — negara yang industri
penerbangannya ikut membuat komponen Dreamliner <em>lebih mungkin membeli dari Boeing</em> daripada dari pesaingnya.
Hasilnya: dengan desain mutakhir, interior lebih lega, dan pemasok global, 787 mencetak rekor penjualan — lebih dari
1.100 pesawat terjual, menjadikannya salah satu peluncuran paling sukses dalam sejarah penerbangan komersial.</p>
<p><strong>Pelajaran utamanya:</strong> Boeing kompetitif karena <em>baik penjualan maupun supply chain-nya
mendunia</em>. Rantai pasok global bukan sekadar cara menekan biaya — ia bisa menjadi sumber competitive advantage
itu sendiri.</p>
<h4 class="sub-h">Konteks: perusahaan multinasional</h4>
<p>Dua istilah penting sebelum masuk lebih dalam: <strong>international business</strong> adalah perusahaan mana pun
yang terlibat perdagangan atau investasi lintas negara. <strong>Multinational corporation (MNC)</strong> lebih jauh
lagi: perusahaan dengan keterlibatan bisnis internasional yang <em>ekstensif</em> — membeli sumber daya, berproduksi,
dan menjual di banyak negara. Contoh sempurna: <strong>IBM</strong> — mengimpor komponen elektronik dari 50+ negara,
mengekspor ke 130+ negara, punya fasilitas di 45 negara, dan meraih lebih dari separuh penjualan serta labanya dari
luar Amerika.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Operasi global menambah tantangan sekaligus peluang. Kisah Boeing
787 menunjukkan supply chain global bisa menjadi competitive advantage: berbagi keahlian, berbagi risiko, dan membuka
pasar. Bedakan international business (terlibat lintas negara) dengan MNC (keterlibatan ekstensif).</div>`
        },
        {
          heading: "Mission & Strategy",
          questions: [{"q": "Banyak mission statement perusahaan Indonesia terdengar bisa dipakai perusahaan mana pun — generik dan tidak memberi fokus. Dari pengalaman Ibu, apa tanda paling jelas bahwa sebuah mission statement benar-benar 'hidup' dan memengaruhi keputusan operasi harian, bukan sekadar pajangan dinding?", "guide": "Kenapa menarik: semua orang pernah melihat mission statement pajangan — pertanyaan ini mengubahnya jadi diskusi tentang mekanisme, bukan retorika. Tes praktis yang bisa muncul: apakah karyawan lini depan bisa menyebutkan mission-nya? apakah pernah ada keputusan yang dibatalkan karena bertentangan dengan mission? Follow-up: 'Bagaimana menurunkan mission ke KPI operasional tanpa kehilangan maknanya?'"}, {"q": "Buku menyebut perusahaan biasanya mengimplementasikan kombinasi differentiation, cost, dan response — tapi Porter memperingatkan bahaya 'stuck in the middle'. Bagaimana membedakan kombinasi yang sehat (seperti IKEA yang murah sekaligus khas) dari perusahaan yang sebenarnya kehilangan arah?", "guide": "Kenapa menarik: mempertemukan dua pandangan teori yang tampak bertentangan (Heizer vs Porter) — level diskusi yang menunjukkan bacaan luas. Kuncinya kemungkinan: kombinasi sehat ditopang sistem aktivitas yang koheren; stuck in the middle terjadi saat aktivitas saling meniadakan. Follow-up: 'Sinyal operasional apa yang menandakan perusahaan mulai stuck in the middle?'"}],
          source: { kind: "book", label: "Buku HRM bab 2" },
          body: `<p>Upaya operations management yang efektif harus punya <strong>mission</strong>
agar tahu <em>ke mana ia pergi</em>, dan <strong>strategy</strong> agar tahu <em>bagaimana sampai ke sana</em>.
Ini berlaku untuk organisasi kecil domestik maupun raksasa internasional — bahkan, seperti kata buku, untuk hidup
Anda sendiri: menempuh pendidikan pun butuh mission dan strategy.</p>
<h4 class="sub-h">Mission: alasan keberadaan</h4>
<p><strong>Mission</strong> didefinisikan sebagai <em>tujuan atau alasan keberadaan organisasi</em> — apa yang akan
dikontribusikannya bagi masyarakat. Mission statement memberi batasan dan fokus, serta menjadi konsep yang membuat
seluruh perusahaan "berkumpul di sekelilingnya". Keberhasilan ekonomi — bahkan kelangsungan hidup — adalah hasil dari
mengidentifikasi mission untuk memuaskan kebutuhan pelanggan. Menyusun strategi yang baik itu sulit, tapi jauh lebih
mudah kalau mission-nya sudah terdefinisi dengan baik.</p>
<div class="case-box"><strong>📌 Tiga contoh mission statement dari buku:</strong><br>
<em>Merck:</em> "Menyediakan produk dan layanan unggul bagi masyarakat — inovasi dan solusi yang meningkatkan kualitas
hidup dan memuaskan kebutuhan pelanggan — memberi karyawan pekerjaan yang bermakna dan peluang berkembang, serta
memberi investor tingkat pengembalian yang unggul."<br>
<em>PepsiCo:</em> "Menjadi perusahaan produk konsumen terkemuka dunia yang berfokus pada makanan dan minuman praktis…
dan dalam semua yang kami lakukan, kami berjuang untuk kejujuran, keadilan, dan integritas."<br>
<em>Arnold Palmer Hospital:</em> "Menyediakan layanan kesehatan mutakhir yang berpusat pada keluarga, berfokus
memulihkan kegembiraan masa kecil dalam lingkungan yang penuh kasih, penyembuhan, dan harapan."<br>
Perhatikan polanya: semuanya menyebut <em>untuk siapa</em> mereka ada dan <em>nilai apa</em> yang mereka janjikan.</div>
<p>Setelah mission organisasi ditetapkan, tiap <em>area fungsional</em> (marketing, keuangan/akuntansi,
produksi/operasi) menyusun supporting mission-nya. Lalu di dalam fungsi operasi, mission pendukung level yang lebih
rendah disusun untuk fungsi-fungsi OM. Jadinya sebuah <strong>hierarki mission</strong> yang saling menopang.</p>
<h4 class="sub-h">Strategy: rencana aksi</h4>
<p><strong>Strategy</strong> adalah <em>rencana aksi organisasi untuk mencapai mission</em>. Setiap area fungsional
punya strateginya sendiri untuk mencapai mission-nya dan membantu organisasi mencapai mission keseluruhan. Strategi
yang baik <em>mengeksploitasi peluang dan kekuatan, menetralkan ancaman, dan menghindari kelemahan</em> — definisi
yang nanti langsung terhubung dengan SWOT analysis di bagian selanjutnya.</p>
<p>Perusahaan mencapai mission lewat tiga jalan konseptual yang sudah Anda kenal dari Sesi 1: <strong>(1)
differentiation, (2) cost leadership, (3) response</strong> — artinya operations manager dipanggil untuk menyampaikan
barang dan jasa yang (1) <em>lebih baik atau setidaknya berbeda</em>, (2) <em>lebih murah</em>, dan (3) <em>lebih
responsif</em>. Tugas operations manager adalah menerjemahkan konsep strategis ini menjadi <em>tugas-tugas nyata</em>
yang bisa dikerjakan. Satu atau kombinasi dari ketiganya bisa menghasilkan sistem yang punya keunggulan unik atas
kompetitor — itulah <strong>competitive advantage</strong>: menciptakan nilai pelanggan secara efisien dan
berkelanjutan. Dalam praktik, bentuk murni jarang ada; manajer biasanya mengimplementasikan kombinasinya.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Mission = alasan keberadaan (ke mana); strategy = rencana aksi
(bagaimana). Mission diturunkan hierarkis ke tiap fungsi. Tiga jalan mencapai mission: differentiation, cost
leadership, response — dan operations manager yang menerjemahkannya jadi tugas nyata.</div>`
        },
        {
          heading: "Issues in Operations Strategy",
          questions: [{"q": "Kalau dianalisis dengan five forces, industri kopi kekinian Indonesia tampak sangat tidak menarik: entry mudah, substitusi banyak, pelanggan gampang pindah. Tapi pemain dan investor terus berdatangan. Apakah ini berarti analisis five forces melewatkan sesuatu — atau para pemain itu yang keliru membaca industrinya?", "guide": "Kenapa menarik: menguji alat analisis klasik dengan anomali pasar lokal yang semua orang lihat sehari-hari. Kemungkinan jawaban yang memancing diskusi: five forces memotret rata-rata industri, bukan peluang pemain dengan kapabilitas unik (resources view!); atau ekspektasi exit/akuisisi yang menggerakkan investor. Follow-up: 'Alat apa yang sebaiknya melengkapi five forces sebelum keputusan masuk industri?'"}, {"q": "Perpindahan fase product life cycle menuntut perubahan operasi yang besar — dari fleksibilitas ke kontrol biaya. Tapi di dalam perusahaan, sinyal pergeseran fase sering terlambat disadari. Indikator operasional apa yang biasanya muncul paling awal ketika produk mulai bergeser dari growth ke maturity?", "guide": "Kenapa menarik: slide memberi tabel per fase tapi tidak membahas TRANSISI antar fase — padahal di situlah perusahaan gagal. Kandidat indikator untuk diskusi: melambatnya repeat-order growth, menyempitnya margin, menumpuknya persediaan, perang diskon kompetitor. Follow-up: 'Siapa yang seharusnya memiliki tanggung jawab memantau sinyal ini — marketing atau operasi?'"}],
          source: { kind: "book", label: "Buku HRM bab 2" },
          visuals: ["plc"],
          body: `<p>Sebelum menetapkan dan menjalankan strategi, ada beberapa "kacamata"
analisis yang sebaiknya dipakai dulu. Bagian ini memperkenalkan tiga alat berpikir plus satu kesadaran penting:
strategi harus dinamis.</p>
<h4 class="sub-h">Tiga kacamata analisis pra-strategi</h4>
<ul>
<li><strong>Resources view</strong> — berpikir dari sumber daya: apakah strategi yang direncanakan <em>kompatibel</em>
dengan sumber daya finansial, fisik, manusia, dan teknologi yang tersedia? Strategi sehebat apa pun gagal kalau
sumber dayanya tidak sanggup menjalankannya.</li>
<li><strong>Value-chain analysis (Porter)</strong> — memeriksa rantai aktivitas untuk menemukan di mana perusahaan
menambahkan <em>nilai yang unik</em>: riset produk, desain, SDM, manajemen supply chain, inovasi proses, atau
manajemen kualitas. Aktivitas-aktivitas yang merupakan kekuatan (atau kekuatan potensial) itulah peluang membangun
competitive advantage.</li>
<li><strong>Five forces model (Porter)</strong> — menganalisis lima kekuatan yang bersaing memperebutkan profit di
industri Anda: (1) <em>rival langsung</em>, (2) <em>pendatang potensial</em> yang bisa masuk kapan saja,
(3) <em>pelanggan</em> dengan daya tawarnya, (4) <em>pemasok</em> dengan daya tawarnya, dan (5) <em>produk
substitusi</em> yang bisa menggantikan Anda. Makin kuat kelima kekuatan itu, makin sulit industri tersebut.</li>
</ul>
<p>Selain lingkungan kompetitif, perusahaan juga beroperasi dalam sistem dengan banyak faktor eksternal lain —
ekonomi, hukum, budaya — yang memengaruhi penyusunan dan eksekusi strategi, sehingga lingkungan harus terus dipindai.</p>
<h4 class="sub-h">Strategi harus dinamis: pelajaran dari product life cycle</h4>
<p>Perusahaan sendiri juga terus berubah — sumber daya, teknologi, dan produk semuanya bergerak. Perhatikan perubahan
besar yang dituntut ketika produk bergerak melintasi empat fase siklus hidupnya:</p>
<ul>
<li><strong>Introduction</strong> — desain produk dan proses masih sering berubah; produksi jangka pendek; biaya
produksi tinggi; model terbatas; perhatian besar pada kualitas. Kuncinya: desain dan pengembangan produk.</li>
<li><strong>Growth</strong> — desain mulai stabil; <em>peramalan (forecasting) menjadi kritis</em>; reliabilitas
produk dan proses penting; perbaikan produk dan opsi yang kompetitif; kapasitas harus ditambah mengejar permintaan.</li>
<li><strong>Maturity</strong> — kompetitor sudah mapan; <em>kontrol biaya menjadi kritis</em>; volume tinggi,
inovasi produk melambat; fokus bertahan di posisi pasar.</li>
<li><strong>Decline</strong> — permintaan menyusut; efisiensi jadi segalanya; pangkas lini produk yang tidak
menguntungkan.</li>
</ul>
<div class="case-box"><strong>📌 Dua contoh strategi dinamis dari buku:</strong> <em>Boeing</em> — strateginya berubah
seiring teknologi dan globalisasi: kini bisa membangun pesawat dari serat karbon dengan supply chain global.
<em>Microsoft</em> — dipaksa beradaptasi cepat oleh prosesor yang makin kencang, bahasa pemrograman baru, preferensi
pelanggan yang berubah, isu keamanan, internet, cloud, dan Google; strategi produknya bergeser dari operating system →
office products → penyedia layanan internet → integrator komputer, ponsel, game, dan televisi via cloud.</div>
<p>Makin menyeluruh analisis dan pemahaman atas faktor eksternal dan internal, makin besar kemungkinan perusahaan
menemukan penggunaan optimal sumber dayanya. Setelah perusahaan memahami dirinya dan lingkungannya, barulah masuk ke
SWOT analysis — bahasan bagian berikutnya.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Sebelum berstrategi, pakai tiga kacamata: resources view (mampukah
kita?), value-chain analysis (di mana nilai unik kita?), five forces (seberapa keras medan persaingannya?). Dan ingat:
posisi produk di life cycle mengubah prioritas operasi — strategi yang baik selalu dinamis.</div>`
        },
        {
          heading: "Strategy Development & Implementation",
          questions: [{"q": "Activity map Southwest tampak elegan setelah selesai — semua aktivitasnya saling mengunci. Tapi bagaimana proses MENEMUKAN kombinasi seperti itu dari awal? Apakah sistem aktivitas yang koheren bisa dirancang di atas kertas, atau selalu hasil evolusi dan trial-and-error bertahun-tahun?", "guide": "Kenapa menarik: pertanyaan tentang proses penciptaan strategi, bukan hasil akhirnya — wilayah yang jarang dibahas buku teks dan biasanya dijawab dosen dari pengalaman. Follow-up: 'Kalau evolutif, apa peran manajemen: merancang, atau menyeleksi dan memperkuat pola yang muncul (bottom-up)?' — sekaligus menghubungkan ke 4 perspektif strategi."}, {"q": "Hampir semua perusahaan rutin membuat SWOT, tapi sedikit yang keputusannya benar-benar berubah karena SWOT. Dari yang Ibu amati, apa yang membedakan organisasi yang SWOT-nya mengoreksi strategi dari yang sekadar mengisi template tahunan?", "guide": "Kenapa menarik: semua mahasiswa MBA pernah menulis SWOT — pertanyaan ini menyentil pengalaman bersama dengan jujur. Kunci dari slide yang bisa diangkat: buku menyebut mission & strategi harus 'dievaluasi ulang' setelah SWOT — langkah yang paling sering dilewati. Follow-up: 'Apakah sebaiknya SWOT disusun oleh orang dalam yang paham konteks, atau pihak luar yang bebas kepentingan?'"}],
          source: { kind: "book", label: "Buku HRM bab 2" },
          visuals: ["swot"],
          body: `<p>Setelah memahami lingkungan, bagaimana strategi disusun dan
dijalankan? Alurnya: SWOT → tentukan faktor kunci → petakan aktivitas → bangun dan isi organisasi.</p>
<h4 class="sub-h">Mulai dari SWOT analysis</h4>
<p><strong>SWOT analysis</strong> adalah tinjauan formal atas <em>kekuatan (Strengths) dan kelemahan (Weaknesses)
internal</em> serta <em>peluang (Opportunities) dan ancaman (Threats) eksternal</em>. Dimulai dari SWOT, organisasi
memposisikan dirinya untuk meraih competitive advantage. Yang penting: mission dan strategi kemudian <em>dievaluasi
ulang</em> untuk memastikan keduanya konsisten dengan hasil SWOT — jadi SWOT bukan formalitas, melainkan cermin yang
bisa mengubah arah.</p>
<h4 class="sub-h">Key success factors dan core competencies</h4>
<p>Karena <em>tidak ada perusahaan yang melakukan segalanya dengan sangat baik</em>, strategi yang sukses menuntut
kejelasan tentang dua hal:</p>
<ul>
<li><strong>Key Success Factors (KSFs)</strong> — aktivitas atau faktor yang menjadi <em>kunci</em> untuk meraih
competitive advantage; hal-hal yang mutlak harus dilakukan dengan baik agar tujuan tercapai. KSF bisa berada di
area mana pun: marketing, keuangan, maupun operasi.</li>
<li><strong>Core competencies</strong> — hal-hal yang perusahaan lakukan <em>setara atau lebih baik daripada
kompetitornya</em>; kekuatan uniknya. Inilah yang harus dijaga di dalam perusahaan.</li>
</ul>
<h4 class="sub-h">Activity mapping: merangkai keunggulan</h4>
<p><strong>Activity mapping</strong> menghubungkan competitive advantage → KSF → aktivitas-aktivitas pendukung, dan
menunjukkan bagaimana aktivitas-aktivitas itu <em>saling menguatkan</em>. Contoh legendaris dari buku:
keunggulan biaya rendah <strong>Southwest Airlines</strong> dibangun dari jaringan aktivitas yang koheren:</p>
<div class="case-box"><p><strong>📌 Peta aktivitas Southwest Airlines (low-cost advantage):</strong></p>
<ul>
<li><em>Rute pendek point-to-point, sering ke bandara sekunder</em> — menghindari bandara hub yang mahal dan padat;</li>
<li><em>Layanan penumpang terbatas tapi ramah</em> — tanpa makanan mewah, "bags fly free", tanpa transfer bagasi;</li>
<li><em>Jadwal yang sering dan andal</em> — pesawat lebih banyak terbang, pelanggan puas;</li>
<li><em>Armada seragam Boeing 737</em> — satu jenis pesawat berarti satu jenis pelatihan pilot &amp; mekanik, satu
stok suku cadang;</li>
<li><em>Utilisasi pesawat tinggi</em> — turnaround cepat di darat (tanpa nomor kursi, mesin tiket otomatis);</li>
<li><em>Karyawan lean dan berdaya</em> — produktivitas per karyawan tinggi.</li>
</ul>
<p>Perhatikan: tidak ada satu aktivitas pun yang ajaib sendirian. Kekuatannya justru pada <em>kombinasi yang saling
mengunci</em> — kompetitor yang meniru satu-dua aktivitas saja tidak akan mendapatkan hasil yang sama. Itulah mengapa
keunggulan Southwest bertahan puluhan tahun.</p></div>
<p>Langkah terakhir adalah <em>build and staff the organization</em>: mewujudkan strategi dengan struktur dan orang
yang tepat, lalu mengintegrasikan OM dengan aktivitas lain. Pekerjaan operations manager: menerapkan strategi,
mencapai competitive advantage, dan meningkatkan produktivitas.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Alur pengembangan strategi: SWOT analysis → identifikasi KSF &amp;
core competencies → activity mapping (aktivitas saling menguatkan, contoh Southwest) → bangun organisasi.
Keunggulan yang tahan lama datang dari <em>sistem aktivitas</em>, bukan satu trik.</div>`
        },
        {
          heading: "Outsourcing & Theory of Comparative Advantage",
          questions: [{"q": "Buku mencatat separuh perjanjian outsourcing gagal, dan skor kepuasan pelanggan turun ketika layanan pelanggan di-outsource — tapi praktiknya terus meluas. Menurut Ibu, kegagalan sebesar itu bersumber dari cacat konsepnya atau selalu dari eksekusinya? Dan kapan sinyal bahwa suatu aktivitas sebaiknya ditarik kembali (insourcing)?", "guide": "Kenapa menarik: memakai statistik mengejutkan dari buku sebagai pintu masuk ke diskusi keputusan nyata. Follow-up: 'Apakah ada aktivitas yang menurut Ibu tidak boleh di-outsource apa pun alasannya?' — jawabannya biasanya menyentuh core competency dan titik kontak pelanggan."}, {"q": "Theory of comparative advantage menjadi dasar outsourcing ke negara berupah rendah. Tapi kalau AI dan otomasi membuat biaya tenaga kerja makin tidak relevan, apakah keunggulan komparatif negara seperti Indonesia akan terkikis — dan keunggulan relatif baru apa yang harus kita bangun dari sekarang?", "guide": "Kenapa menarik: mempertemukan teori ekonomi klasik dengan disrupsi AI — pertanyaan berbobot kebijakan yang relevan untuk semua karier. Kandidat jawaban: bergeser dari 'murah' ke pasar domestik besar, sumber daya alam hilirisasi, dan talenta digital. Follow-up: 'Untuk anak-anak kami yang masuk dunia kerja 10 tahun lagi, keterampilan operasi apa yang paling tahan otomasi?'"}],
          source: { kind: "book", label: "Buku HRM bab 2" },
          body: `<p>Konsekuensi logis dari core competencies: kalau ada
aktivitas yang <em>bukan</em> kekuatan inti Anda, kenapa tidak diserahkan ke pihak yang lebih ahli?
Itulah outsourcing — tapi seperti akan kita lihat, keputusannya tidak sesederhana itu.</p>
<h4 class="sub-h">Apa itu outsourcing dan kapan masuk akal?</h4>
<p><strong>Outsourcing</strong> = memindahkan aktivitas yang secara tradisi dikerjakan internal ke pemasok eksternal.
Saat organisasi menyusun mission dan strategi, mereka mengidentifikasi kekuatannya — <em>core competencies</em> —
dan mempertahankannya di dalam. Sebaliknya, <em>non-core activities</em> (yang bisa jadi porsi besar dari total
bisnis) adalah kandidat baik untuk di-outsource. Outsourcing bukan konsep baru — ia perpanjangan dari praktik lama
subkontrak — tapi cakupannya terus meluas seiring keahlian pemasok yang makin spesialis, biaya komunikasi yang makin
murah, dan tekanan untuk fokus.</p>
<h4 class="sub-h">Landasan ekonominya: theory of comparative advantage</h4>
<p>Mengapa outsourcing lintas negara masuk akal secara ekonomi? Jawabannya teori klasik ekonomi:
<strong>theory of comparative advantage</strong> — negara-negara diuntungkan bila <em>berspesialisasi pada (dan
mengekspor) barang/jasa yang keunggulan relatifnya tinggi</em>, dan <em>mengimpor barang/jasa yang keunggulan
relatifnya rendah</em>. Diterapkan ke perusahaan: serahkan tiap aktivitas ke pihak (atau negara) yang paling unggul
mengerjakannya secara relatif, dan semua pihak lebih sejahtera.</p>
<h4 class="sub-h">Tapi hati-hati: risikonya nyata</h4>
<p>Manajemen risiko dimulai dari analisis ketidakpastian yang realistis. Faktanya mencengangkan: <strong>sekitar
separuh dari semua perjanjian outsourcing gagal</strong> — umumnya karena perencanaan dan analisis yang tidak memadai.
Masalah yang paling sering muncul:</p>
<ul>
<li>Ketepatan waktu pengiriman dan standar kualitas yang meleset;</li>
<li>Kenaikan biaya persediaan dan logistik yang <em>diremehkan</em> saat perhitungan awal;</li>
<li>Penurunan kepuasan pelanggan — survei perusahaan Amerika Utara menemukan skor American Consumer Satisfaction
Index <em>turun</em> pada perusahaan yang meng-outsource layanan pelanggannya, dan penurunannya kurang-lebih sama
baik outsourcing-nya domestik maupun ke luar negeri;</li>
<li>Untuk outsourcing lintas negara, ada lapisan isu tambahan: daya tarik finansial negara tujuan, ketersediaan dan
keterampilan tenaga kerja, lingkungan bisnis secara umum;</li>
<li>Reaksi politik atas "hilangnya lapangan kerja" ke luar negeri — retorika anti-outsourcing ini ikut mendorong
<strong>reshoring</strong>: kembalinya aktivitas bisnis ke negara asal.</li>
</ul>
<h4 class="sub-h">Alat bantu memilih penyedia: factor-rating method</h4>
<p>Supaya keputusan outsourcing tidak berdasar "kira-kira", buku memperkenalkan <strong>factor-rating method</strong>:
(1) tentukan kriteria penilaian (mis. harga, keandalan, keterampilan, jarak); (2) beri <em>bobot</em> tiap kriteria
sesuai kepentingannya (total 100%); (3) beri <em>skor</em> tiap kandidat pada tiap kriteria (mis. skala 1–5);
(4) kalikan bobot × skor dan jumlahkan; (5) kandidat dengan total tertinggi menang. Contoh di buku: National
Architects menilai calon provider IT dengan metode ini — dan metode yang sama bisa Anda pakai untuk keputusan
apa pun yang multikriteria.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Outsource yang non-core, pertahankan core competencies. Landasan
teorinya comparative advantage. Tapi waspada: ±50% perjanjian outsourcing gagal karena perencanaan buruk — hitung
semua biaya, dan pakai factor-rating method agar keputusan objektif. Tren balik arah: reshoring.</div>`
        },
        {
          heading: "Empat Opsi Strategi Operasi Global",
          questions: [{"q": "McDonald's menyesuaikan menu di tiap negara — tapi ke mana pun kita pergi, McD tetap terasa 'McD'. Di mana sebenarnya batas antara multidomestic strategy yang sungguhan dengan sekadar lokalisasi kosmetik di atas operasi yang sepenuhnya standar? Keputusan operasi apa yang jadi penentunya?", "guide": "Kenapa menarik: membongkar contoh yang tampak sederhana di slide — jawabannya menyentuh keputusan mana yang didesentralisasi (menu, pemasok lokal) vs yang tetap terpusat (proses, standar kualitas, sistem). Follow-up: 'Apakah lokalisasi menu tanpa desentralisasi keputusan operasi masih layak disebut multidomestic?'"}, {"q": "Untuk brand Indonesia yang mau ekspansi regional — Kopi Kenangan, J.CO, Erigo — kuadran strategi global mana yang realistis sebagai pintu masuk pertama, dan kesalahan apa yang paling sering dilakukan perusahaan Asia Tenggara saat naik kelas dari international ke multidomestic?", "guide": "Kenapa menarik: meminta dosen menerapkan matriks 2×2 pada kasus lokal yang belum ada di buku mana pun — diskusi yang hasilnya orisinal. Catat jawabannya: bisa jadi bahan proyek tim presentasi. Follow-up: 'Kapabilitas organisasi apa yang harus dibangun SEBELUM membuka operasi di negara kedua?'"}],
          source: { kind: "book", label: "Buku HRM bab 2" },
          visuals: ["globalStrategies"],
          body: `<p>Ketika perusahaan memutuskan go-international, ia harus memilih
<em>cara</em> hadir di panggung global. Heizer memetakan empat pilihan strategi pada sebuah matriks dua sumbu — dan
memahami matriks ini jauh lebih penting daripada menghafal empat namanya.</p>
<h4 class="sub-h">Dua sumbu matriksnya</h4>
<p>Sumbu <strong>vertikal: cost reduction</strong> — seberapa besar strategi itu mengejar efisiensi biaya lewat
skala dan standardisasi global. Sumbu <strong>horizontal: local responsiveness</strong> — seberapa besar strategi
itu menuntut respons cepat dan/atau diferensiasi untuk pasar lokal. Tugas operations manager: tahu di mana
memposisikan perusahaannya pada matriks ini.</p>
<h4 class="sub-h">Empat strategi, empat kuadran</h4>
<ul>
<li><strong>International strategy (cost rendah, responsiveness rendah)</strong> — menembus pasar global lewat
<em>ekspor dan lisensi</em> dengan sedikit perubahan pada operasi yang ada. Ini strategi yang <em>paling mudah</em> —
ekspor menuntut perubahan minimal, dan perjanjian lisensi melimpahkan sebagian besar risiko ke pemegang lisensi —
tapi juga <em>paling tidak menguntungkan</em>: keunggulan biayanya kecil, responsivitas lokalnya pun rendah.
Biasanya jadi pintu masuk pertama perusahaan ke pasar dunia.</li>
<li><strong>Multidomestic strategy (cost rendah, responsiveness tinggi)</strong> — wewenang <em>terdesentralisasi</em>:
tiap negara punya otonomi substansial lewat anak perusahaan, waralaba, atau joint venture. Keunggulannya:
memaksimalkan respons kompetitif untuk pasar lokal; kelemahannya: nyaris tanpa keunggulan biaya. Konsepnya: <em>"kami
sukses di pasar domestik; mari ekspor talenta manajemen dan prosesnya — bukan produknya — untuk melayani pasar
lain"</em>. Contoh: produsen makanan seperti <strong>Heinz</strong> menyesuaikan produk dengan selera lokal karena
integrasi global proses produksinya memang tidak kritis.</li>
<li><strong>Global strategy (cost tinggi, responsiveness rendah)</strong> — <em>sentralisasi</em> tinggi: kantor
pusat mengoordinasi standardisasi dan pembelajaran antar-pabrik sehingga tercipta skala ekonomi. Cocok saat fokus
strategisnya penekanan biaya dan permintaan responsivitas lokal rendah — produk akhirnya serupa di seluruh dunia.
Contoh: <strong>Caterpillar</strong> (pemimpin dunia alat berat) dan <strong>Texas Instruments</strong> (pemimpin
semikonduktor) — "alat penggali tanah di Nigeria sama saja dengan di Iowa".</li>
<li><strong>Transnational strategy (cost tinggi, responsiveness tinggi)</strong> — menggabungkan <em>keduanya</em>:
efisiensi skala global <em>plus</em> responsivitas lokal. Ini kuadran yang paling sulit dicapai karena dua tuntutan
itu secara alami saling tarik-menarik — butuh organisasi yang mampu memindahkan material, orang, dan ide melintasi
batas negara dengan lincah.</li>
</ul>
<div class="case-box"><strong>📌 Ilustrasi persaingan global dari buku — Komatsu vs Caterpillar:</strong> dalam
pertarungan sengit di pasar alat berat dunia, Komatsu bergerak ke barat (membuka fasilitas di Inggris) sementara
Caterpillar bergerak ke timur (13 fasilitas dan joint venture di Tiongkok). Keduanya membangun peralatan di seluruh
dunia <em>sesuai dikte biaya dan logistik</em> — strategi global memungkinkan produksi berpindah mengikuti pasar,
risiko, dan nilai tukar. Persis seperti konsep operational hedging yang Anda pelajari di Sesi 1.</div>
<h4 class="sub-h">Menutup bab: benang merahnya</h4>
<p>Operasi global menambah tantangan <em>dan</em> peluang bagi operations manager. Urutannya kini lengkap:
identifikasi kekuatan dan kelemahan → susun mission dan strategi yang memperhitungkannya serta melengkapi peluang
dan ancaman lingkungan → raih competitive advantage lewat kombinasi differentiation, low cost, dan response →
fokus pada core competencies (outsource sisanya dengan hati-hati) → dan pilih posisi yang tepat di matriks strategi
global. Jika prosedur ini dijalankan dengan baik, perusahaan bisa unggul — di mana pun di dunia.</p>
<div class="key-box"><strong>💡 Intinya:</strong> Hafalkan matriksnya, bukan cuma namanya: sumbu cost reduction ×
local responsiveness. International = ekspor/lisensi (rendah-rendah, termudah, paling kecil untungnya); Multidomestic
= desentralisasi demi pasar lokal (Heinz); Global = sentralisasi demi skala (Caterpillar, TI); Transnational =
keduanya sekaligus (tersulit).</div>`
        }
      ]
    },
    {
      id: 3, date: "2026-08-29", dateLabel: "29 Agustus 2026",
      topic: "Product Design",
      subtopics: ["Product design"],
      readings: ["SBB bab 4", "HRM bab 5", "TPW bab 6"],
      caseStudy: "Case Study 1: Regal Marine", summary: null
    },
    {
      id: 4, date: "2026-08-29", dateLabel: "29 Agustus 2026",
      topic: "Process Design, Process Technology & People in Operations",
      subtopics: ["Process design", "Process technology", "People in operations"],
      readings: ["SBB bab 6", "HRM bab 7", "TPW bab 9, 11"],
      caseStudy: "Case Study 2: Harley Davidson", summary: null
    },
    {
      id: 5, date: "2026-09-11", dateLabel: "11 September 2026",
      topic: "Capacity Management",
      subtopics: ["Measuring the capacity"],
      readings: ["SBB bab 11", "HRM bab 13"],
      caseStudy: "Case Study 3: Frito-Lay", summary: null
    },
    {
      id: 6, date: "2026-09-12", dateLabel: "12 September 2026",
      topic: "Inventory Management",
      subtopics: ["Inventory management"],
      readings: ["SBB bab 13", "HRM bab 12"],
      caseStudy: "Case Study 4: Amazon", summary: null
    },
    {
      id: 7, date: "2026-10-30", dateLabel: "30 Oktober 2026",
      topic: "Planning & Control",
      subtopics: ["MRP dan ERP", "Sequencing and scheduling"],
      readings: ["SBB bab 10, 14", "HRM bab 14, 15"],
      caseStudy: "Case Study 5: Alaska Airlines", summary: null
    },
    {
      id: 8, date: "2026-10-31", dateLabel: "31 Oktober 2026",
      topic: "Supply Chain Management",
      subtopics: ["Supply Chain Management"],
      readings: ["SBB bab 12", "HRM bab 11", "TPW bab 10, 12"],
      caseStudy: "Case Study 6: Red Lobster Restaurant", summary: null
    },
    {
      id: 9, date: "2026-11-14", dateLabel: "14 November 2026",
      topic: "Improvement, Lean & Agile Operations",
      subtopics: ["Operations improvement", "Lean operations"],
      readings: ["SBB bab 15, 16", "HRM bab 16"],
      caseStudy: "Case Study 7: Toyota", summary: null
    },
    {
      id: 10, date: "2026-11-14", dateLabel: "14 November 2026",
      topic: "Quality Management",
      subtopics: ["Total quality management"],
      readings: ["SBB bab 17", "HRM bab 6"],
      caseStudy: "Case Study 8: Arnold Palmer Hospital", summary: null
    },
    {
      id: 11, date: "2026-11-27", dateLabel: "27 November 2026",
      topic: "Operations Reliability & Resilience",
      subtopics: ["Managing risk and recovery", "Project management"],
      readings: ["SBB bab 18, 19", "HRM bab 3, 17", "TPW bab 13"],
      caseStudy: "Case Study 9: Bechtel Group", summary: null
    },
    {
      id: 12, date: "2026-11-28", dateLabel: "28 November 2026",
      topic: "Team Final Project Presentation",
      subtopics: ["Presentasi proyek akhir tim"],
      readings: [],
      caseStudy: null, summary: null
    }
  ],

  /* ---------- Flashcards (field session = nomor sesi) ---------- */
  flashcards: [
    { session: 1, front: "Apa definisi operations management menurut Slack, Brandon-Jones & Burgess (2022)?", back: "Aktivitas mengelola sumber daya yang menciptakan dan menyampaikan (create and deliver) produk dan jasa." },
    { session: 1, front: "Apa definisi operations management menurut Heizer, Render & Munson?", back: "Serangkaian aktivitas yang menciptakan nilai dalam bentuk barang dan jasa dengan mentransformasi input menjadi output." },
    { session: 1, front: "Sebutkan 4 alasan mengapa kita perlu mempelajari OM.", back: "1) OM bagian yang sangat mahal dari organisasi, 2) OM salah satu fungsi utama organisasi, 3) kita perlu tahu bagaimana barang/jasa diproduksi, 4) kita perlu memahami apa yang dikerjakan operations manager." },
    { session: 1, front: "Apa model dasar semua proses operasi?", back: "Input → Transformation → Output: mengubah input menjadi output berupa produk dan jasa." },
    { session: 1, front: "Tiga jenis transformed resources yang dominan diproses operasi?", back: "Material (manufaktur, ritel, logistik), Informasi (akuntan, bank, riset pasar), dan Pelanggan (rumah sakit, hotel, transportasi, salon)." },
    { session: 1, front: "Bedakan 'operations' sebagai fungsi vs sebagai aktivitas.", back: "Fungsi: bagian organisasi yang menciptakan produk/jasa bagi pelanggan eksternal. Aktivitas: pengelolaan proses dalam fungsi organisasi mana pun — sehingga OM relevan untuk semua bagian bisnis." },
    { session: 1, front: "Sebutkan the Four Vs of operations.", back: "Volume (banyaknya output), Variety (keragaman output), Variation (fluktuasi permintaan), Visibility (keterlihatan proses bagi pelanggan)." },
    { session: 1, front: "Bagaimana konfigurasi 4 Vs yang menurunkan biaya operasi?", back: "Volume tinggi, variety rendah, variation rendah, dan visibility rendah (ceteris paribus)." },
    { session: 1, front: "Empat aktivitas utama operations manager?", back: "Directing (strategi keseluruhan operasi), Designing (produk/jasa & proses), Planning & Controlling (penyampaian proses), Developing (kinerja proses)." },
    { session: 1, front: "Sebutkan 10 keputusan kritis (critical decisions) OM.", back: "1) Desain barang & jasa, 2) Manajemen kualitas, 3) Desain proses & kapasitas, 4) Strategi lokasi, 5) Strategi layout, 6) SDM & desain pekerjaan, 7) Supply chain management, 8) Persediaan/MRP/JIT, 9) Penjadwalan, 10) Pemeliharaan (maintenance)." },
    { session: 1, front: "Apa itu digital transformation?", back: "Proses menggunakan teknologi digital untuk menciptakan atau memodifikasi proses bisnis, budaya, dan pengalaman pelanggan agar sesuai perubahan kebutuhan bisnis & pasar." },
    { session: 1, front: "Lima syarat digital business model yang baik?", back: "1) Memberi customer experience luar biasa, 2) menghasilkan profit, 3) menaikkan market share, 4) mengubah proses, 5) melibatkan karyawan secara kreatif." },
    { session: 1, front: "Sebutkan 5 performance objectives operasi.", back: "Quality, Speed, Dependability, Flexibility, Cost." },
    { session: 1, front: "Apa arti 'speed' sebagai performance objective?", back: "Waktu yang berlalu antara pelanggan meminta produk/jasa dan menerimanya. Speed mengurangi persediaan dan risiko." },
    { session: 1, front: "Apa arti 'dependability' dan mengapa penting?", back: "Menyampaikan tepat waktu sesuai kebutuhan/janji kepada pelanggan. Menghemat waktu & uang, memberi stabilitas; dalam jangka panjang bisa mengalahkan semua kriteria lain." },
    { session: 1, front: "Empat tipe flexibility yang dibutuhkan pelanggan?", back: "Product/service flexibility, Mix flexibility, Volume flexibility, Delivery flexibility." },
    { session: 1, front: "Dua cara kualitas meningkatkan profitabilitas?", back: "1) Sales gain: respons lebih baik, harga fleksibel, reputasi naik. 2) Reduced costs: produktivitas naik, biaya rework/scrap/garansi turun." },
    { session: 1, front: "Rumus produktivitas dan rumus labor productivity?", back: "Produktivitas = Output ÷ Input. Labor productivity = unit yang diproduksi ÷ jam kerja (labor-hours). Ini contoh single-factor productivity." },
    { session: 1, front: "Apa itu multifactor productivity dan mengapa lebih baik?", back: "Output ÷ (Labor + Material + Energy + Capital + Miscellaneous), biasanya dalam dolar. Lebih baik karena mencakup semua biaya yang terkait kenaikan output." },
    { session: 1, front: "Apa itu operations strategy?", back: "Pola keputusan dan aksi yang membentuk visi jangka panjang, tujuan, dan kapabilitas operasi serta kontribusinya pada strategi bisnis keseluruhan." },
    { session: 1, front: "Sebutkan 4 perspektif operations strategy.", back: "Top-down (hierarki corporate→business→functional), Outside-in/market (kebutuhan pasar), Bottom-up (pengalaman operasional), Inside-out/resources (kapabilitas sumber daya & proses)." },
    { session: 1, front: "Bedakan order winners dan order qualifiers.", back: "Order winners: faktor yang langsung & signifikan memenangkan bisnis. Order qualifiers: syarat minimum — di bawah level itu organisasi bahkan tidak dipertimbangkan pelanggan." },
    { session: 1, front: "Empat zona pada importance–performance matrix?", back: "Appropriate (memuaskan), Improve (di bawah batas layak), Urgent-action (penting bagi pelanggan tapi kalah dari kompetitor), Excess? (kinerja tinggi tapi tidak penting bagi pelanggan)." },
    { session: 1, front: "Tiga strategi mencapai competitive advantage melalui operasi?", back: "Differentiation (lebih baik/berbeda), Cost leadership (lebih murah — bukan kualitas rendah), Response (respons cepat: flexibility, reliability, timeliness)." },
    { session: 1, front: "Enam alasan perusahaan melakukan globalisasi operasi?", back: "1) Memperbaiki supply chain, 2) menekan biaya & risiko kurs, 3) memperbaiki operasi, 4) memahami pasar, 5) memperbaiki produk, 6) menarik & mempertahankan talenta global." },
    { session: 1, front: "Apa itu operational hedging?", back: "Mempertahankan kapasitas berlebih di beberapa negara dan menggeser level produksi antarnegara saat biaya dan nilai tukar berubah." },
    { session: 1, front: "Tiga variabel produktivitas menurut HRM dan kontribusinya terhadap kenaikan tahunan?", back: "Labor ±10%, Capital ±38%, Management ±52%. Management adalah kontributor terbesar — area utama tempat manajer bisa bertindak memperbaiki produktivitas." },
    { session: 1, front: "Sebutkan minimal 4 karakteristik jasa (services) yang membedakannya dari barang (goods).", back: "Intangible; diproduksi & dikonsumsi bersamaan; unik per pelanggan; interaksi pelanggan tinggi; definisi produk tidak konsisten; berbasis pengetahuan (sulit diotomasi); lokasi tersebar; kualitas sulit dievaluasi; tidak bisa dijual kembali; tidak bisa disimpan sebagai persediaan." },
    { session: 1, front: "Mengapa barang (goods) lebih mudah diotomasi daripada jasa?", back: "Karena barang berupa produk tangible yang terstandardisasi (mis. iPhone) dan diproduksi di fasilitas tetap, sedangkan jasa sering berbasis pengetahuan, unik per pelanggan, dan butuh interaksi tinggi (hukum, pendidikan, medis)." },
    { session: 1, front: "Sebutkan 8 model bisnis digital yang paling banyak dipakai.", back: "Subscription (Netflix), Freemium (LinkedIn, Dropbox), Free (Google, Facebook), Access-over-Ownership (Zipcar, Airbnb), Experience (Tesla, Apple), On-Demand (Uber, Taskrabbit), Crowdfunding (Kickstarter, GoFundMe), Ecosystem (Apple, Google)." },
    { session: 1, front: "Bedakan model Freemium dan model Free.", back: "Freemium: pelanggan dapat versi basic gratis/free trial dengan opsi upgrade berbayar (LinkedIn, Dropbox). Free: pelanggan tidak pernah membayar — pelanggan adalah 'produknya'; data dan perhatiannya dijual untuk iklan (Google, Facebook)." },
    { session: 1, front: "Bedakan model Access-over-Ownership dan On-Demand.", back: "Access-over-Ownership: membayar akses sementara atas ASET tanpa memilikinya (mobil Zipcar, kamar Airbnb). On-Demand: membayar TENAGA/WAKTU orang lain untuk jasa yang tak sempat dikerjakan sendiri (Uber, Taskrabbit)." },
    { session: 1, front: "Apa itu model bisnis Ecosystem? Beri contoh.", back: "Pelanggan dijual rangkaian produk/jasa yang saling terkait, yang nilainya meningkat seiring makin banyak produk yang dimiliki — mis. ekosistem Apple (iPhone + Watch + Mac + iCloud) atau Google." },
    { session: 1, front: "Sebutkan lima era perkembangan OM beserta fokusnya.", back: "Cost focus: Early Concepts (1776–1880), Scientific Management (1880–1910), Mass Production (1910–1980). Quality focus: Lean Production Era (1980–1995, JIT/TQM/kanban). Customization focus: Mass Customization Era (1995–2005, e-commerce/ERP/RFID). Globalization focus (2005–2020, global supply chain, sustainability)." },
    { session: 1, front: "Apa tiga arus perubahan dalam 'the new operations agenda'?", back: "1) Adopsi teknologi baru (IoT, AI, algorithmic decision making, 3D printing, robotika, big data), 2) pengaturan pasokan berbeda (jaringan global, kemitraan, business ecosystem, risiko reputasi), 3) penekanan isu sosial-lingkungan (triple bottom line, desain ramah lingkungan, kerja fleksibel, hemat energi)." },
    { session: 1, front: "Apa itu triple bottom line pada level kinerja societal?", back: "People (sosial: kepuasan & keselamatan karyawan, komunitas), Planet (lingkungan: emisi CO₂, limbah, air), Profit (ekonomi: return on capital, pertumbuhan menguntungkan) — ketiganya beririsan pada sustainability." },
    { session: 1, front: "Pada fase maturity product life cycle, apa order winner dan objectives dominannya?", back: "Order winner: harga murah & pasokan andal. Qualifier: range & quality. Objectives dominan: cost & dependability. (Bandingkan fase introduction: winner = spesifikasi produk, objectives = flexibility & quality.)" },

    { session: 2, front: "Apa definisi mission sebuah organisasi?", back: "Tujuan atau alasan keberadaan organisasi — apa yang akan dikontribusikannya bagi masyarakat. Mission memberi batasan, fokus, dan konsep pemersatu perusahaan." },
    { session: 2, front: "Apa definisi strategy?", back: "Rencana aksi (action plan) organisasi untuk mencapai mission-nya. Strategi mengeksploitasi peluang & kekuatan, menetralkan ancaman, dan menghindari kelemahan." },
    { session: 2, front: "Bagaimana hierarki mission dalam perusahaan?", back: "Mission perusahaan → supporting mission tiap area fungsional (marketing, keuangan, operasi) → mission pendukung level bawah untuk fungsi-fungsi OM. Semuanya saling mendukung." },
    { session: 2, front: "Tiga cara konseptual perusahaan mencapai mission-nya?", back: "1) Differentiation (lebih baik/berbeda), 2) Cost leadership (lebih murah), 3) Response (lebih responsif). Ketiganya bisa dikombinasikan untuk menghasilkan competitive advantage." },
    { session: 2, front: "Apa itu resources view dalam operations strategy?", back: "Cara pandang yang memastikan strategi kompatibel dengan sumber daya yang tersedia: finansial, fisik, manusia, dan teknologi." },
    { session: 2, front: "Apa itu value-chain analysis (Porter)?", back: "Cara mengidentifikasi aktivitas dalam rantai produk/jasa yang menambah nilai secara unik — mis. riset produk, desain, SDM, supply chain, inovasi proses, manajemen kualitas — sebagai peluang membangun competitive advantage." },
    { session: 2, front: "Sebutkan lima kekuatan dalam five forces model Porter.", back: "1) Rival langsung (immediate rivals), 2) pendatang potensial, 3) pelanggan, 4) pemasok, 5) produk substitusi." },
    { session: 2, front: "Bagaimana product life cycle memengaruhi strategi operasi?", back: "Introduction: desain produk/proses sering berubah, biaya produksi tinggi. Growth: peramalan & reliabilitas kritis, tambah kapasitas. Maturity: kontrol biaya kritis, pertahankan posisi pasar. Decline: efisiensi. Strategi harus dinamis mengikuti fase produk." },
    { session: 2, front: "Apa itu SWOT analysis?", back: "Tinjauan formal atas Strengths & Weaknesses internal serta Opportunities & Threats eksternal, sebagai dasar memposisikan perusahaan untuk meraih competitive advantage." },
    { session: 2, front: "Bedakan Key Success Factors (KSFs) dan core competencies.", back: "KSFs: aktivitas/faktor yang menjadi kunci meraih competitive advantage — harus dilakukan dengan baik. Core competencies: hal yang dilakukan perusahaan setara atau lebih baik dari kompetitor (kekuatan uniknya)." },
    { session: 2, front: "Apa itu activity mapping? Beri contohnya.", back: "Menghubungkan competitive advantage dengan KSF & aktivitas pendukung yang saling menguatkan. Contoh Southwest Airlines (low-cost): rute pendek point-to-point ke bandara sekunder, armada seragam B737, utilisasi tinggi, karyawan lean & berdaya, layanan terbatas, tanpa nomor kursi." },
    { session: 2, front: "Apa itu outsourcing dan aktivitas apa yang cocok di-outsource?", back: "Memindahkan aktivitas yang tradisinya internal ke pemasok eksternal. Kandidat terbaik: non-core activities — sementara core competencies dipertahankan di dalam." },
    { session: 2, front: "Apa isi theory of comparative advantage?", back: "Negara diuntungkan bila berspesialisasi dan mengekspor barang/jasa yang keunggulan relatifnya tinggi, serta mengimpor barang/jasa yang keunggulan relatifnya rendah. Ini landasan ekonomi outsourcing internasional." },
    { session: 2, front: "Sebutkan risiko-risiko outsourcing.", back: "±Separuh perjanjian outsourcing gagal karena perencanaan/analisis kurang; masalah ketepatan pengiriman & kualitas; biaya persediaan-logistik diremehkan; penurunan kepuasan pelanggan; untuk luar negeri: isu finansial, keterampilan, lingkungan bisnis, dan reaksi politik." },
    { session: 2, front: "Apa itu reshoring?", back: "Kembalinya aktivitas bisnis ke negara asal — antara lain dipicu reaksi politik terhadap hilangnya lapangan kerja akibat outsourcing ke luar negeri." },
    { session: 2, front: "Apa itu factor-rating method dalam memilih penyedia outsourcing?", back: "Metode penilaian objektif: tentukan kriteria, beri bobot tiap kriteria, skor tiap kandidat provider, kalikan bobot × skor lalu jumlahkan — kandidat dengan total tertinggi dipilih (contoh buku: National Architects memilih provider IT)." },
    { session: 2, front: "Bedakan international business dan multinational corporation (MNC).", back: "International business: perusahaan yang terlibat perdagangan/investasi lintas negara. MNC: keterlibatan internasionalnya ekstensif — membeli sumber daya, berproduksi, dan menjual di banyak negara (mis. IBM: fasilitas di 45 negara, ekspor ke 130+ negara)." },
    { session: 2, front: "Dua sumbu matriks empat strategi operasi global?", back: "Sumbu vertikal: cost reduction. Sumbu horizontal: local responsiveness (respons cepat dan/atau diferensiasi untuk pasar lokal)." },
    { session: 2, front: "Jelaskan international strategy.", back: "Penetrasi pasar global lewat ekspor & lisensi. Paling mudah (sedikit perubahan operasi, risiko lisensi di pihak licensee) tapi paling tidak menguntungkan: responsivitas lokal rendah dan keunggulan biaya kecil." },
    { session: 2, front: "Jelaskan multidomestic strategy dan contohnya.", back: "Wewenang terdesentralisasi ke tiap negara (anak perusahaan, waralaba, joint venture otonom) demi memaksimalkan respons pasar lokal; hampir tanpa keunggulan biaya. Contoh: Heinz menyesuaikan selera lokal. 'Ekspor talenta manajemen & proses, bukan produknya.'" },
    { session: 2, front: "Jelaskan global strategy dan contohnya.", back: "Sentralisasi tinggi: kantor pusat mengoordinasi standardisasi & pembelajaran antar-pabrik demi skala ekonomi. Cocok saat fokus pada penekanan biaya dan produk seragam sedunia. Contoh: Caterpillar & Texas Instruments." },
    { session: 2, front: "Jelaskan transnational strategy.", back: "Strategi yang menggabungkan keunggulan efisiensi skala global dengan keunggulan responsivitas lokal sekaligus — cost reduction tinggi dan local responsiveness tinggi." }
  ],

  /* ---------- Kuis (field session = nomor sesi) ---------- */
  quizzes: [
    {
      session: 1,
      questions: [
        {
          q: "Menurut Heizer, Render & Munson, operations management adalah…",
          options: [
            "Serangkaian aktivitas yang menciptakan nilai dengan mentransformasi input menjadi output",
            "Aktivitas memasarkan produk agar bernilai di mata pelanggan",
            "Proses menyusun laporan keuangan operasional perusahaan",
            "Kegiatan merekrut dan melatih karyawan operasional"
          ],
          answer: 0,
          explain: "Definisi Heizer: the set of activities that create value in the form of goods and services by transforming inputs into outputs."
        },
        {
          q: "Manakah yang BUKAN termasuk the Four Vs of operations?",
          options: ["Volume", "Velocity", "Variation", "Visibility"],
          answer: 1,
          explain: "The Four Vs = Volume, Variety, Variation (in demand), dan Visibility. 'Velocity' bukan salah satunya."
        },
        {
          q: "Agar biaya operasi turun (ceteris paribus), kombinasi 4 Vs yang tepat adalah…",
          options: [
            "Volume rendah, variety tinggi, variation tinggi, visibility tinggi",
            "Volume tinggi, variety tinggi, variation rendah, visibility tinggi",
            "Volume tinggi, variety rendah, variation rendah, visibility rendah",
            "Semua dimensi ditingkatkan setinggi mungkin"
          ],
          answer: 2,
          explain: "Biaya turun dengan menaikkan volume serta menurunkan variety, variation, dan visibility — seperti hotelF1 vs Ski Verbier Exclusive."
        },
        {
          q: "Rumah sakit dan salon adalah contoh operasi yang dominan memproses input berupa…",
          options: ["Material", "Informasi", "Pelanggan", "Modal"],
          answer: 2,
          explain: "Hairdresser, hotel, rumah sakit, transportasi = predominantly processing inputs of customers."
        },
        {
          q: "Performance objective yang berarti 'menepati janji waktu penyampaian kepada pelanggan' adalah…",
          options: ["Quality", "Speed", "Flexibility", "Dependability"],
          answer: 3,
          explain: "Dependability = doing things in time — menyampaikan tepat saat dibutuhkan atau sesuai yang dijanjikan. Jangka panjang bisa mengalahkan kriteria lain."
        },
        {
          q: "Collins Title memproses 8 titel/hari dengan 4 staf yang masing-masing bekerja 8 jam. Labor productivity-nya adalah…",
          options: ["0,25 titel per jam kerja", "0,50 titel per jam kerja", "2 titel per jam kerja", "0,4375 titel per jam kerja"],
          answer: 0,
          explain: "Total jam kerja = 4 × 8 = 32 jam. Labor productivity = 8 ÷ 32 = 0,25 titel/jam. Setelah komputerisasi (14 titel/hari) menjadi 14 ÷ 32 = 0,4375 (naik 75%)."
        },
        {
          q: "Keunggulan multifactor productivity dibanding single-factor productivity adalah…",
          options: [
            "Lebih mudah dihitung karena hanya satu input",
            "Mencakup semua biaya input sehingga gambarannya lebih lengkap",
            "Tidak memerlukan data output",
            "Selalu menghasilkan angka yang lebih besar"
          ],
          answer: 1,
          explain: "Multifactor productivity = Output ÷ (Labor + Material + Energy + Capital + Misc.) — memberi gambaran lebih baik karena memasukkan seluruh biaya."
        },
        {
          q: "Faktor kompetitif yang menjadi syarat minimum agar perusahaan dipertimbangkan pelanggan disebut…",
          options: ["Order winner", "Order qualifier", "Less important factor", "Efficient frontier"],
          answer: 1,
          explain: "Order qualifiers bukan penentu utama kemenangan, tapi di bawah level 'qualifying' organisasi terdiskualifikasi dari pertimbangan pelanggan."
        },
        {
          q: "Perspektif operations strategy yang menekankan kapabilitas sumber daya dan proses operasi sebagai sumber keunggulan jangka panjang adalah…",
          options: ["Top-down", "Outside-in (market)", "Bottom-up", "Inside-out (operations resources)"],
          answer: 3,
          explain: "Perspektif inside-out: keunggulan kompetitif jangka panjang datang dari kapabilitas resources & processes yang dikembangkan jangka panjang."
        },
        {
          q: "Pada importance–performance matrix, faktor yang penting bagi pelanggan tetapi kinerjanya di bawah kompetitor masuk zona…",
          options: ["Appropriate", "Improve", "Urgent-action", "Excess?"],
          answer: 2,
          explain: "Zona urgent-action = penting bagi pelanggan tapi performa di bawah kompetitor → kandidat perbaikan segera."
        },
        {
          q: "Southwest Airlines (bandara sekunder, layanan tanpa embel-embel, utilisasi pesawat efisien) adalah contoh perusahaan yang bersaing lewat…",
          options: ["Differentiation", "Cost leadership", "Response", "Experience differentiation"],
          answer: 1,
          explain: "Competing on cost: memberi nilai maksimum di mata pelanggan dengan biaya rendah — bukan berarti kualitas rendah."
        },
        {
          q: "Menjaga kapasitas berlebih di beberapa negara lalu menggeser produksi antarnegara mengikuti perubahan biaya dan kurs disebut…",
          options: ["Mass customization", "Operational hedging", "Supply-chain partnering", "Offshoring"],
          answer: 1,
          explain: "Operational hedging adalah salah satu cara menekan biaya dan risiko nilai tukar dalam operasi global."
        },
        {
          q: "(Latihan HRM bab 1) Collins Title memproses 14 titel/hari dengan payroll $640/hari. Jika overhead-nya $960/hari (bukan $800), multifactor productivity-nya adalah…",
          options: ["0,0097 titel per dolar", "0,00875 titel per dolar", "0,0077 titel per dolar", "0,4375 titel per dolar"],
          answer: 1,
          explain: "Multifactor productivity = 14 ÷ (640 + 960) = 14 ÷ 1600 = 0,00875 titel per dolar. Ini learning exercise resmi dari buku HRM bab 1."
        },
        {
          q: "Netflix dan Apple Music, yang menarik pembayaran bulanan untuk akses berkelanjutan, memakai model bisnis digital…",
          options: ["Freemium", "Subscription", "On-Demand", "Ecosystem"],
          answer: 1,
          explain: "Subscription = pelanggan membayar biaya bulanan untuk akses berkelanjutan ke produk/jasa. Freemium berbeda: versi dasar gratis dengan opsi upgrade."
        },
        {
          q: "Pada model bisnis 'Free' seperti Google dan Facebook, siapa/apa yang sebenarnya menjadi 'produk'?",
          options: [
            "Perangkat lunak yang diunduh pengguna",
            "Iklan yang ditayangkan",
            "Pelanggan itu sendiri — data dan perhatiannya",
            "Server dan infrastruktur perusahaan"
          ],
          answer: 2,
          explain: "Dalam model Free, customer is the 'product' — data pelanggan (plus perhatiannya) adalah bagian paling bernilai dari bisnis, dimonetisasi lewat iklan."
        },
        {
          q: "Zipcar dan Airbnb — pelanggan membayar akses sementara tanpa memiliki asetnya — adalah contoh model…",
          options: ["On-Demand", "Experience", "Access-over-Ownership", "Crowdfunding"],
          answer: 2,
          explain: "Access-over-Ownership = bayar untuk akses sementara atas aset. Bedakan dengan On-Demand (Uber/Taskrabbit) yang menjual tenaga/waktu orang lain."
        },
        {
          q: "Era 1980–1995 dalam sejarah OM yang ditandai JIT, TQM, kanban, dan pemberdayaan karyawan disebut…",
          options: ["Mass Production Era", "Lean Production Era", "Mass Customization Era", "Globalization Era"],
          answer: 1,
          explain: "Lean Production Era (1980–1995) adalah masa 'quality focus'. Mass Production (1910–1980) fokus biaya; Mass Customization (1995–2005) fokus kustomisasi; Globalization (2005–2020) fokus global."
        },
        {
          q: "Menurut tabel efek product life cycle, order winner pada fase GROWTH adalah…",
          options: ["Spesifikasi produk/jasa", "Availability (ketersediaan)", "Harga murah", "Pasokan yang andal"],
          answer: 1,
          explain: "Fase growth: permintaan melesat sehingga availability menjadi order winner; objectives dominannya speed, dependability, quality. Harga murah baru jadi winner di fase maturity dan decline."
        }
      ]
    },
    {
      session: 2,
      questions: [
        {
          q: "Mission sebuah organisasi didefinisikan sebagai…",
          options: [
            "Rencana aksi untuk mengalahkan kompetitor",
            "Tujuan atau alasan keberadaan organisasi — kontribusinya bagi masyarakat",
            "Target laba tahunan yang ditetapkan pemegang saham",
            "Daftar produk yang akan diluncurkan perusahaan"
          ],
          answer: 1,
          explain: "Mission = the purpose or rationale for an organization's existence. Strategy-lah yang merupakan rencana aksi untuk mencapai mission."
        },
        {
          q: "Strategy adalah…",
          options: [
            "Pernyataan nilai-nilai luhur perusahaan",
            "Struktur organisasi perusahaan",
            "Rencana aksi organisasi untuk mencapai mission-nya",
            "Anggaran tahunan tiap area fungsional"
          ],
          answer: 2,
          explain: "Strategy = action plan to achieve the mission; mengeksploitasi peluang & kekuatan, menetralkan ancaman, menghindari kelemahan."
        },
        {
          q: "Manakah yang BUKAN salah satu dari tiga pendekatan strategis untuk mencapai competitive advantage?",
          options: ["Differentiation", "Cost leadership", "Response", "Diversification"],
          answer: 3,
          explain: "Tiga pendekatannya: differentiation (lebih baik/berbeda), cost leadership (lebih murah), dan response (lebih responsif). Diversification bukan salah satunya."
        },
        {
          q: "Lima kekuatan dalam five forces model Porter adalah rival langsung, pendatang potensial, pelanggan, pemasok, dan…",
          options: ["Regulator pemerintah", "Produk substitusi", "Serikat pekerja", "Pemegang saham"],
          answer: 1,
          explain: "Five forces: immediate rivals, potential entrants, customers, suppliers, dan substitute products."
        },
        {
          q: "Pada fase maturity dalam product life cycle, prioritas strategi operasi yang tepat adalah…",
          options: [
            "Perubahan desain produk dan proses yang sering",
            "Kontrol biaya yang kritis dan mempertahankan posisi pasar",
            "Produksi jangka pendek dengan biaya tinggi",
            "Menghentikan seluruh investasi kapasitas"
          ],
          answer: 1,
          explain: "Fase introduction identik dengan desain yang masih berubah-ubah dan biaya tinggi; fase maturity menuntut cost control dan pertahanan posisi pasar."
        },
        {
          q: "SWOT analysis adalah tinjauan formal atas…",
          options: [
            "Skill, Wisdom, Opportunity, Timing",
            "Kekuatan & kelemahan internal serta peluang & ancaman eksternal",
            "Kinerja keuangan empat kuartal terakhir",
            "Struktur organisasi dan pembagian wewenang"
          ],
          answer: 1,
          explain: "SWOT = internal Strengths & Weaknesses + external Opportunities & Threats — model yang sangat baik untuk mengevaluasi strategi."
        },
        {
          q: "Aktivitas yang dilakukan perusahaan setara atau lebih baik daripada kompetitornya disebut…",
          options: ["Key success factors", "Core competencies", "Order qualifiers", "Non-core activities"],
          answer: 1,
          explain: "Core competencies = kekuatan unik perusahaan. KSF = aktivitas yang menjadi kunci meraih tujuan. Non-core activities justru kandidat outsourcing."
        },
        {
          q: "Keunggulan low-cost Southwest Airlines dibangun lewat activity mapping yang mencakup hal-hal berikut, KECUALI…",
          options: [
            "Rute pendek point-to-point ke bandara sekunder",
            "Armada seragam Boeing 737",
            "Layanan premium lengkap di semua penerbangan",
            "Utilisasi pesawat yang tinggi"
          ],
          answer: 2,
          explain: "Southwest justru menawarkan layanan penumpang yang terbatas (tapi ramah) — tanpa nomor kursi, tanpa transfer bagasi — demi biaya rendah."
        },
        {
          q: "Teori yang menyatakan negara diuntungkan bila berspesialisasi mengekspor barang/jasa dengan keunggulan relatif tinggi adalah…",
          options: [
            "Theory of comparative advantage",
            "Five forces model",
            "Resources view",
            "Efficient frontier theory"
          ],
          answer: 0,
          explain: "Theory of comparative advantage — landasan ekonomi outsourcing internasional."
        },
        {
          q: "Menurut HRM, kira-kira berapa proporsi perjanjian outsourcing yang gagal karena perencanaan dan analisis yang kurang?",
          options: ["Sekitar 10%", "Sekitar 25%", "Sekitar separuh", "Hampir semuanya"],
          answer: 2,
          explain: "Roughly half of all outsourcing agreements fail — umumnya karena inadequate planning and analysis, masalah ketepatan waktu, kualitas, serta biaya logistik yang diremehkan."
        },
        {
          q: "Strategi operasi global dengan wewenang terdesentralisasi (subsidiary/franchise/joint venture otonom) demi memaksimalkan respons pasar lokal disebut…",
          options: ["International strategy", "Multidomestic strategy", "Global strategy", "Transnational strategy"],
          answer: 1,
          explain: "Multidomestic (contoh: Heinz) — respons lokal maksimal, tapi hampir tanpa keunggulan biaya. 'Ekspor talenta manajemen & proses, bukan produknya.'"
        },
        {
          q: "Caterpillar dan Texas Instruments — dengan sentralisasi tinggi, standardisasi, dan skala ekonomi — adalah contoh…",
          options: ["International strategy", "Multidomestic strategy", "Global strategy", "Transnational strategy"],
          answer: 2,
          explain: "Global strategy: cocok saat fokusnya cost reduction dan produk seragam di seluruh dunia ('alat berat di Nigeria sama dengan di Iowa'). Transnational menggabungkan keduanya: efisiensi global + responsivitas lokal."
        }
      ]
    }
  ]
};
