/* ============================================================
   BEfS Study Hub — Materi CM1–CM12
   Berbasis Crane, A. & Matten, D. (2019), Business Ethics:
   Managing corporate citizenship and sustainability in the age
   of globalization, Oxford University Press.

   Rangkuman disusun dalam Bahasa Indonesia; istilah kunci
   dipertahankan dalam Bahasa Inggris karena ujian dan bacaan
   memakai istilah aslinya.

   Placeholder {{viz:namaDiagram}} di dalam `body` akan diganti
   oleh diagram dari visuals.js saat render.
   ============================================================ */

window.BEFS_CHAPTERS = [

/* ==========================================================
   CM1 — INTRODUCING BUSINESS ETHICS
   Pertemuan 1 — urutan mengikuti slide dosen, diperkaya buku.
   ========================================================== */
{
  id: 1, ref: "CM1", session: 1,
  title: "Introducing Business Ethics",
  titleId: "Pengantar Etika Bisnis",
  blurb: "Pertemuan 1. Urutan materi mengikuti alur slide dosen — definisi, batas etika dan hukum, mengapa etika bisnis penting, lalu dua tema besar buku: globalisasi dan sustainability — dan tiap bagian diperkaya penjelasan buku.",
  objectives: [
    "Mendefinisikan business ethics sebagai bidang kajian dan membedakan morality, ethics, serta ethical theory.",
    "Menjelaskan hubungan etika dan hukum — dan mengapa kepatuhan hukum hanyalah lantai minimum.",
    "Menjelaskan mengapa etika bisnis penting bagi manajer dan masyarakat, di organisasi privat, publik, maupun masyarakat sipil.",
    "Mengenali globalisasi sebagai konteks kunci beserta perbedaan perspektif antarkawasan.",
    "Memakai sustainability dan triple bottom line sebagai lensa penilaian."
  ],
  sections: [
    {
      title: "Apa itu business ethics?",
      src: "CM1", ppt: "Slide 2–3 & 5",
      img: { key: "c1s3", cap: "Slide 3 — What is business ethics? (slide asli dosen)" },
      body: `
<p><strong>Business ethics</strong> adalah studi tentang situasi, aktivitas, dan keputusan bisnis di mana persoalan
<em>benar dan salah secara moral</em> dipertanyakan. Slide dosen memberi tiga penegasan atas definisi ini:</p>

<ul>
  <li>Tidak terbatas pada perusahaan pencari laba;</li>
  <li>berlaku untuk organisasi <strong>publik, swasta, dan masyarakat sipil</strong>;</li>
  <li>menyangkut benar-salah <strong>moral</strong> — bukan sekadar untung-rugi komersial.</li>
</ul>

<p>Buku menempatkan definisi ini <em>di dalam</em> aktivitas bisnis sehari-hari: isu etis tidak hanya muncul pada
skandal besar seperti korupsi atau penipuan. Keputusan harga bisa rasional secara ekonomi tetapi tetap menimbulkan
pertanyaan keadilan; kampanye pemasaran bisa legal tetapi menyesatkan konsumen yang rentan. Pertanyaan dasarnya
selalu sama: <em>bagaimana keputusan ini memengaruhi pihak lain, dan dapatkah ia dibenarkan secara moral?</em></p>

<p class="sub-h">Morality, ethics, dan ethical theory</p>

<p>Slide 5 menyusun tiga istilah yang sering tertukar — dan ini pertanyaan klasik ujian:</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Morality</b>
    <span>Norma, nilai, dan keyakinan yang tertanam dalam proses sosial, yang mendefinisikan benar dan salah bagi
    individu atau komunitas.</span>
    <em>Level: praktik sosial sehari-hari</em>
  </div>
  <div class="dbm-card">
    <b>Ethics</b>
    <span>Refleksi sistematis dan rasional atas moralitas — aturan dan prinsip yang menentukan benar dan salah pada
    situasi tertentu.</span>
    <em>Level: refleksi rasional atas moralitas</em>
  </div>
  <div class="dbm-card">
    <b>Ethical theory</b>
    <span>Kerangka terstruktur hasil studi etika untuk mengevaluasi dilema — misalnya utilitarianism atau ethics
    of duty.</span>
    <em>Level: teori yang bisa dipakai menilai</em>
  </div>
</div>

<p class="viz-hint">Alurnya: <strong>morality</strong> (yang dipercaya masyarakat) → dipelajari secara rasional oleh
<strong>ethics</strong> → menghasilkan <strong>ethical theory</strong> yang bisa diterapkan kembali ke situasi bisnis.
Catatan dosen: penalaran etis bukan sekadar pendapat pribadi — teori membantu membangun penilaian yang disiplin dan
dapat dipertahankan.</p>

<p class="sub-h">Apakah "business ethics" itu oxymoron?</p>

<p>Kritik populer mengatakan bisnis dan etika saling meniadakan: bisnis bertujuan mencari laba, etika menuntut
pengorbanan. Buku menolak posisi ini. Justru karena bisnis punya <strong>kekuatan besar</strong> dan beroperasi di
wilayah abu-abu, refleksi etis menjadi penting. Etika bisnis tidak menggantikan tujuan bisnis — ia mempertanyakan
<em>cara</em> tujuan itu dicapai dan <em>siapa</em> yang menanggung biayanya.</p>

<div class="case-box">
  <strong>Prompt dari slide untuk kelas.</strong>
  <p>Definisikan "etika bisnis sebuah organisasi" dalam <em>satu kalimat</em>. Latihan ini kelihatan sepele, tetapi
  memaksa kamu memilih: apakah definisimu berhenti pada kepatuhan, atau mencakup dampak pada pihak lain?</p>
</div>

<div class="key-box">
  <strong>Kunci ujian.</strong> Ketika ditanya "apa itu business ethics", jangan berhenti pada "belajar soal moral
  dalam bisnis". Sebutkan definisinya secara utuh — <em>situasi, aktivitas, dan keputusan bisnis di mana isu benar
  dan salah dipertanyakan</em> — lalu bedakan morality / ethics / ethical theory, dan tegaskan bahwa cakupannya
  melampaui perusahaan komersial.
</div>`
    },
    {
      title: "Etika dan hukum: batas yang tidak sama",
      src: "CM1", ppt: "Slide 4",
      img: { key: "c1s4", cap: "Slide 4 — Ethics and law: irisan hukum dan etika (slide asli dosen)" },
      body: `
<p>Kesalahan paling umum mahasiswa adalah menyamakan <strong>legal</strong> dengan <strong>ethical</strong>.
Slide 4 merangkum relasinya dalam empat butir:</p>

<ul>
  <li>Hukum menetapkan <strong>batas minimum</strong> perilaku yang dapat diterima;</li>
  <li>sebagian isu etis <strong>belum diatur</strong> oleh hukum;</li>
  <li>sebagian persoalan hukum <strong>bukan dilema moral</strong>;</li>
  <li>perdebatan etis hari ini dapat <strong>membentuk hukum</strong> di kemudian hari.</li>
</ul>

<p>Karena itu buku merumuskan: <em>"Business ethics dimulai di titik hukum berakhir."</em> Etika bisnis terutama
bekerja pada isu-isu yang tidak dicakup hukum, atau yang belum ada konsensus jelas tentang apa yang benar.</p>

{{viz:ethicsLaw}}

<p>Empat kuadran yang perlu kamu kenali:</p>

<ul>
  <li><strong>Legal &amp; ethical</strong> — wilayah aman: membayar upah layak, menaati standar keselamatan.</li>
  <li><strong>Legal tapi tidak etis</strong> — inilah medan utama etika bisnis. Contoh: <em>tax avoidance</em>
  agresif yang sah secara hukum tetapi memindahkan beban ke pembayar pajak lain; memasarkan makanan tinggi gula
  ke anak-anak; PHK massal saat perusahaan untung besar.</li>
  <li><strong>Ilegal tapi dianggap etis oleh sebagian pihak</strong> — misalnya <em>whistleblowing</em> yang melanggar
  klausul kerahasiaan, atau pembangkangan sipil terhadap regulasi yang dianggap tidak adil.</li>
  <li><strong>Ilegal &amp; tidak etis</strong> — penipuan, suap, kartel. Ini urusan hukum, bukan lagi dilema etis.</li>
</ul>

<div class="warn-box">
  <strong>Jangan tertukar.</strong> Hukum adalah <em>kodifikasi</em> moralitas yang sudah disepakati masyarakat —
  artinya hukum selalu <strong>tertinggal</strong> dari isu etis yang baru muncul. Ketika teknologi atau model bisnis
  baru lahir (AI, gig economy, data pribadi), wilayah "legal tapi belum tentu etis" melebar. Di situlah manajer harus
  memutuskan tanpa panduan hukum.
</div>

<div class="case-box">
  <strong>Pertanyaan kelas (slide 4).</strong>
  <p>Bisakah suatu tindakan legal tetapi tetap tidak etis? Siapkan satu contoh bisnis terkini. Catatan dosen memberi
  dua contoh: perusahaan yang memenuhi regulasi lingkungan secara teknis sambil tetap menghasilkan polusi yang tidak
  perlu, dan skema pajak agresif yang memenuhi bunyi hukum tetapi mempertanyakan tanggung jawab sosialnya.
  Pelajarannya: <strong>kepatuhan hukum adalah lantai, bukan langit-langit.</strong></p>
</div>`
    },
    {
      title: "Mengapa etika bisnis penting — di semua jenis organisasi",
      src: "CM1", ppt: "Slide 6–7",
      img: { key: "c1s7", cap: "Slide 7 — Business ethics across organizational contexts (slide asli dosen)" },
      body: `
<p>Slide 6 membagi alasannya menjadi dua sisi:</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">ALASAN KEMASYARAKATAN</div>
  <div class="gs-head gs-head--b">ALASAN MANAJERIAL</div>
  <div class="gs-cell gs-cell--a">Bisnis punya kekuatan dan pengaruh sosial yang besar.</div>
  <div class="gs-cell gs-cell--b">Manajer menghadapi tekanan nyata dan ambiguitas moral.</div>
  <div class="gs-cell gs-cell--a">Bisnis dapat menciptakan nilai dan memecahkan masalah.</div>
  <div class="gs-cell gs-cell--b">Media, LSM, konsumen, dan karyawan mengawasi perusahaan.</div>
  <div class="gs-cell gs-cell--a">Bisnis juga dapat menimbulkan kerugian luas.</div>
  <div class="gs-cell gs-cell--b">Perusahaan global melintasi batas hukum dan budaya.</div>
  <div class="gs-cell gs-cell--a">Kegagalan etis merusak kepercayaan dan legitimasi.</div>
  <div class="gs-cell gs-cell--b">Etika bisnis membantu menyusun keputusan yang lebih baik.</div>
</div>

<p>Buku merincinya: banyak korporasi punya pendapatan melebihi PDB negara berkembang — kekuatan besar menuntut
tanggung jawab besar; malpraktik berpotensi merugikan sangat luas; tuntutan stakeholder meningkat; dan isu etis
kompleks tanpa jawaban tunggal, sehingga manajer perlu <em>kerangka berpikir</em>, bukan daftar aturan. Contoh
kepentingan yang bertabrakan: pemegang saham ingin imbal hasil, karyawan menuntut kondisi kerja, pelanggan ingin
harga murah, komunitas mengharapkan perlindungan lingkungan.</p>

<div class="case-box">
  <strong>Kasus rujukan — Volkswagen "Dieselgate" (2015).</strong>
  <p>VW memasang <em>defeat device</em>: perangkat lunak yang mendeteksi kondisi uji emisi dan menurunkan output NOx
  hanya saat diuji. Di jalan raya, emisi mencapai hingga 40 kali batas legal. Sekitar 11 juta kendaraan terdampak.</p>
  <p><strong>Kenapa relevan untuk CM1?</strong> (1) Kekuatan bisnis menimbulkan dampak lintas negara; (2) malpraktik
  merugikan luas — kesehatan publik, nilai saham, kepercayaan industri; (3) masalahnya bukan ketiadaan aturan,
  melainkan keputusan sadar mengakalinya. Biaya total bagi VW melampaui EUR 30 miliar — bukti <em>ethics pays</em>
  juga berlaku terbalik.</p>
</div>

<p class="sub-h">Etika bisnis melampaui korporasi komersial</p>

<p>Slide 7 menegaskan poin yang sering terlewat: tanggung jawab etis ada di mana pun keputusan organisasi
memengaruhi orang — tetapi tantangan spesifiknya berbeda menurut tujuan dan akuntabilitas organisasi.</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Private firms</b>
    <span>Akuntabel pada pemilik, pelanggan, karyawan.</span>
    <em>Fokus: laba, kejujuran berdagang, rantai pasok</em>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Public sector</b>
    <span>Akuntabel pada warga negara, hukum, dan pengawasan pemerintah.</span>
    <em>Fokus: rule of law, korupsi, konflik kepentingan</em>
  </div>
  <div class="dbm-card dbm-card--clay">
    <b>Civil society</b>
    <span>Akuntabel pada penerima manfaat, donor, dan misi publik.</span>
    <em>Fokus: akuntabilitas, legitimasi, mission drift</em>
  </div>
</div>

<p class="sub-h">Apakah etis itu menguntungkan? (the business case)</p>

<p>Pertanyaan "does ethics pay?" tidak punya jawaban sederhana. Riset menunjukkan korelasi positif lemah hingga
sedang antara kinerja sosial dan finansial, tetapi <strong>arah sebabnya tidak jelas</strong>. Peringatan buku: jika
alasan satu-satunya berperilaku etis adalah profit, maka begitu tidak menguntungkan, perilaku etis akan
ditinggalkan. Itu bukan etika, itu strategi.</p>`
    },
    {
      title: "Globalisasi: konteks yang mengubah pertanyaan",
      src: "CM1", ppt: "Slide 8–9 & 11",
      img: { key: "c1s8", cap: "Slide 8 — Globalization as a key context (slide asli dosen)" },
      body: `
<p><strong>Globalization</strong> didefinisikan buku sebagai proses <em>deterritorialization</em> — aktivitas sosial,
politik, dan ekonomi semakin terlepas dari batas wilayah geografis. Slide 8 menyebut lima arena yang kini saling
terhubung:</p>

<div class="fx-chips"><span>Markets</span><span>Supply chains</span><span>Culture</span><span>Climate</span><span>Technology</span></div>

<p>Akibatnya: saling ketergantungan meningkat, risiko reputasi menjalar lebih cepat, dan perusahaan berhadapan
dengan ekspektasi moral yang berbeda-beda. Buku menajamkannya menjadi tiga celah (gap):</p>

{{viz:globalGaps}}

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Cultural issues</b>
    <span>Nilai moral berbeda antarnegara. Pemberian hadiah yang wajar di satu budaya bisa dianggap suap di budaya
    lain. Muncul ketegangan <em>ethical relativism</em> vs <em>ethical absolutism</em>.</span>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Legal issues</b>
    <span>Perusahaan multinasional beroperasi lintas yurisdiksi; tidak ada satu hukum global. Muncul praktik
    <em>regulatory arbitrage</em> — memindahkan operasi ke negara dengan aturan paling longgar.</span>
  </div>
  <div class="dbm-card dbm-card--clay">
    <b>Accountability issues</b>
    <span>Kepada siapa MNC bertanggung jawab? Pemerintah lokal sering lebih lemah daripada korporasi. Muncul
    <em>accountability gap</em> yang coba diisi LSM, media, dan konsumen.</span>
  </div>
</div>

<p class="sub-h">Relativism vs absolutism</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">ETHICAL RELATIVISM</div>
  <div class="gs-head gs-head--b">ETHICAL ABSOLUTISM</div>
  <div class="gs-cell gs-cell--a">Tidak ada kebenaran moral universal; benar-salah bergantung konteks budaya.</div>
  <div class="gs-cell gs-cell--b">Ada prinsip moral abadi yang berlaku di mana pun, kapan pun.</div>
  <div class="gs-cell gs-cell--a">"When in Rome, do as the Romans do."</div>
  <div class="gs-cell gs-cell--b">"Standar kita berlaku di mana saja kami beroperasi."</div>
  <div class="gs-cell gs-cell--a"><strong>Risiko:</strong> membenarkan pekerja anak dan suap dengan dalih budaya.</div>
  <div class="gs-cell gs-cell--b"><strong>Risiko:</strong> imperialisme moral; mengabaikan konteks lokal yang sah.</div>
</div>

<p>Buku menolak kedua ekstrem dan mengusulkan <strong>ethical pluralism</strong>: ada nilai inti yang tidak bisa
ditawar (hak asasi dasar, larangan kerja paksa), sambil menghormati variasi lokal pada hal yang secara moral tidak
setara bobotnya.</p>

<p class="sub-h">Perspektif internasional (slide 9)</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Europe</b>
    <span>Kontrol sosial kolektif; pemerintah dan serikat pekerja sentral; kerangka hukum hasil negosiasi;
    orientasi multi-stakeholder.</span>
  </div>
  <div class="dbm-card">
    <b>North America</b>
    <span>Tanggung jawab individual; korporasi sebagai aktor kunci; codes of ethics; fokus pada misconduct dan
    situasi keputusan.</span>
  </div>
  <div class="dbm-card">
    <b>Asia</b>
    <span>Diskresi manajemen puncak; pemerintah dan korporasi sebagai aktor kunci; tekanan pada governance dan
    akuntabilitas; pendekatan stakeholder yang implisit.</span>
  </div>
</div>

<p>Peringatan slide: ini <em>pola perbandingan umum, bukan stereotip</em> untuk setiap negara atau organisasi.
Perhatikan kolom Asia — relasi pemerintah-korporasi dan stakeholder implisit — karena paling dekat dengan konteks
Indonesia dan akan terasa lagi saat membahas tata kelola (CM6) dan regulasi (CM11).</p>

<p class="sub-h">Dampak globalisasi per stakeholder (slide 11)</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card"><b>Shareholders</b><span>Governance, transparansi, short-termism.</span></div>
  <div class="dbm-card"><b>Employees</b><span>Standar ketenagakerjaan, migrasi, hak di tempat kerja.</span></div>
  <div class="dbm-card"><b>Consumers</b><span>Keamanan, privasi, harga, informasi.</span></div>
  <div class="dbm-card"><b>Suppliers</b><span>Sourcing, suap, kondisi kerja.</span></div>
  <div class="dbm-card"><b>Society</b><span>Iklim, pajak, ketimpangan, hak asasi manusia.</span></div>
</div>

<div class="case-box">
  <strong>Aktivitas kelas (slide 11).</strong>
  <p>Pilih satu perusahaan multinasional dan petakan isu etis utamanya per stakeholder. Susunan ini adalah cikal
  bakal <em>stakeholder mapping</em> yang kerangka penuhnya menunggu di CM2.</p>
</div>`
    },
    {
      title: "Sustainability dan triple bottom line",
      src: "CM1", ppt: "Slide 10",
      img: { key: "c1s10", cap: "Slide 10 — Sustainability dan Triple Bottom Line (slide asli dosen)" },
      body: `
<p>Slide 10 menutup dengan tema kedua buku: etika bisnis melampaui laba jangka pendek. Definisi paling banyak
dikutip berasal dari <strong>Brundtland Report</strong> (WCED, 1987):</p>

<div class="term-box">
  <strong>Sustainable development</strong> — "development that meets the needs of the present without compromising
  the ability of future generations to meet their own needs." Dua kata kuncinya: <em>needs</em> (khususnya kebutuhan
  kaum miskin) dan <em>limitations</em> (batas kemampuan lingkungan menopang kebutuhan).
</div>

<p>Buku mendefinisikan sustainability sebagai <em>"the long-term maintenance of systems according to environmental,
economic and social considerations"</em> — tiga dimensi ini dikenal sebagai <strong>triple bottom line</strong>
(istilah John Elkington): <strong>people, planet, profit</strong>.</p>

{{viz:tripleBottomLine}}

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Environmental (Planet)</b>
    <span>Sistem alam punya batas. Isu: emisi, keanekaragaman hayati, limbah, air, sumber daya tak terbarukan.</span>
    <em>Prinsip: effective management of physical resources</em>
  </div>
  <div class="dbm-card">
    <b>Economic (Profit)</b>
    <span>Dua level: dampak perusahaan pada sistem ekonomi luas, dan kelayakan finansial perusahaan sendiri agar
    bertahan jangka panjang.</span>
    <em>Prinsip: sistem ekonomi yang menopang, bukan menggerus</em>
  </div>
  <div class="dbm-card">
    <b>Social (People)</b>
    <span>Dimensi yang paling belakangan diakui. Isu utamanya <strong>social justice</strong> — keadilan distribusi
    manfaat dan beban pembangunan.</span>
    <em>Prinsip: keadilan sosial</em>
  </div>
</div>

<div class="key-box">
  <strong>Kunci ujian.</strong> Jangan berhenti di "people, planet, profit". Tambahkan: (1) triple bottom line
  menuntut perusahaan <em>mengukur dan melaporkan</em> ketiganya; (2) ketiga dimensi sering <strong>trade-off</strong>
  — slide dosen secara eksplisit meminta perhatian pada trade-off antardimensi, karena di situlah dilema etisnya;
  (3) keadilan sosial mencakup dimensi <strong>intra-generasi</strong> dan <strong>inter-generasi</strong>.
</div>

<div class="case-box">
  <strong>Kasus Indonesia — kelapa sawit dan deforestasi.</strong>
  <p>Sawit memberi kontribusi ekonomi besar (devisa, jutaan lapangan kerja — dimensi <em>economic</em>), namun
  ekspansinya dikaitkan dengan deforestasi, kebakaran gambut, dan kabut asap lintas batas (<em>environmental</em>),
  serta konflik lahan dan kondisi kerja buruh (<em>social</em>).</p>
  <p><strong>Latihan:</strong> pakai kasus ini untuk menunjukkan bahwa triple bottom line bukan penjumlahan
  sederhana. Keuntungan satu pilar dapat dibayar pilar lain — dan pertanyaan etisnya: <em>siapa yang membayar, dan
  apakah mereka ikut memutuskan?</em></p>
</div>`
    },
    {
      title: "Di kelas: alur sesi, kasus McEthics, dan penutup",
      src: "CM1", ppt: "Slide 12–15",
      img: { key: "c1s13", cap: "Slide 13 — Teaching flow for class (slide asli dosen)" },
      body: `
<p>Slide dosen menyertakan rancangan sesi 75–90 menit — berguna untuk menyiapkan diri sebelum kuliah dan menebak
arah diskusinya:</p>

<div class="cascade">
  <div class="cascade-box"><b>1. Warm-up</b><span>legal vs ethical — mulai dari pengalamanmu sendiri</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>2. Mini-lecture</b><span>definisi kunci</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>3. Group task</b><span>isu etis sebuah perusahaan multinasional</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>4. Case discussion</b><span>Global McEthics — global vs lokal</span></div>
  <div class="cascade-box cascade-box--hi"><b>5. Reflection</b><span>sustainability sebagai penutup</span></div>
</div>

<p>Satu takeaway penutup dari dosen: etika bisnis mengembangkan <strong>penilaian dalam ketidakpastian</strong> —
lintas organisasi, lintas batas negara, dan di bawah tekanan keberlanjutan. Tujuan pendidikannya: bergerak dari
reaksi personal menuju <em>penalaran etis yang terstruktur</em>.</p>

<div class="case-box">
  <strong>Kasus bab ini — Global McEthics.</strong>
  <p>Perusahaan makanan cepat saji dikritik soal kesehatan, gizi, ketenagakerjaan, kesejahteraan hewan, dan
  globalisasi. Dilema sentralnya: <strong>konsistensi global vs adaptasi lokal</strong> — dan reputasi etis bisa
  menjadi isu global meski masalahnya bermula lokal. Tujuannya bukan memutuskan perusahaan itu baik atau buruk,
  melainkan menganalisis tanggung jawab, stakeholder, konsekuensi, dan alternatif. Versi lengkap dengan fakta dan
  rujukan beritanya ada di bagian <em>Kasus nyata untuk CM1</em> di bawah.</p>
</div>

<p class="sub-h">Pertanyaan penutup dari slide</p>

<ul>
  <li>Bisakah perusahaan yang untung tetap gagal secara etis?</li>
  <li>Bisakah perusahaan bertindak legal tetapi tidak etis?</li>
  <li>Haruskah perusahaan multinasional menerapkan standar etis identik di setiap negara?</li>
  <li>Kelompok stakeholder mana yang paling sulit dipuaskan manajer?</li>
  <li>Dapatkah pertumbuhan ekonomi dan keberlanjutan lingkungan selalu didamaikan?</li>
  <li>Siapa yang seharusnya memutuskan apakah sebuah perusahaan berperilaku etis?</li>
</ul>

<div class="key-box">
  <strong>Ringkasan satu kalimat (dari slide).</strong> Etika bisnis menanyakan bukan hanya apakah keputusan bisnis
  itu menguntungkan atau legal, melainkan apakah ia <em>dapat dipertahankan secara moral, adil bagi stakeholder
  terdampak, dan berkelanjutan dalam jangka panjang</em>.
</div>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM1:</strong></p>
<ul>
  <li>Definisi business ethics + bedakan morality / ethics / ethical theory — plus penegasan slide bahwa cakupannya melampaui perusahaan komersial.</li>
  <li>Hubungan etika dan hukum — kuadran <em>legal tapi tidak etis</em> beserta contohnya; hukum sebagai lantai minimum.</li>
  <li>Konteks organisasi: private / public sector / civil society dengan akuntabilitas dan fokus etis masing-masing.</li>
  <li>Tiga celah globalisasi (cultural, legal, accountability) + relativism vs absolutism vs pluralism.</li>
  <li>Perspektif internasional: pola Eropa / Amerika Utara / Asia.</li>
  <li>Definisi Brundtland + triple bottom line, trade-off antardimensi, keadilan intra- dan inter-generasi.</li>
</ul>`
},

/* ==========================================================
   CM2 — FRAMING BUSINESS ETHICS
   Pertemuan 2 — urutan mengikuti slide dosen, diperkaya buku.
   ========================================================== */
{
  id: 2, ref: "CM2", session: 2,
  title: "Framing Business Ethics: Corporate Responsibility, Stakeholders, and Citizenship",
  titleId: "Membingkai Etika Bisnis",
  blurb: "Pertemuan 2. Mengikuti alur slide dosen: apa itu korporasi dan bisakah ia bertanggung jawab moral, CSR dan piramida Carroll, stakeholder theory, accountability, hingga corporate citizenship — diperkaya penjelasan buku.",
  objectives: [
    "Menjelaskan korporasi sebagai aktor hukum, ekonomi, dan sosial — dan menilai apakah ia dapat menjadi pelaku moral.",
    "Membedakan pendekatan CSR: piramida Carroll dan tiga corak strategi (defensif, terintegrasi, transformatif).",
    "Menerapkan stakeholder theory dan memetakan klaim: power, legitimacy, urgency — plus vulnerability dan dependency.",
    "Menjelaskan corporate accountability dan transparency.",
    "Membahas secara kritis corporate citizenship dalam konteks global."
  ],
  sections: [
    {
      title: "Mengapa etika bisnis perlu dibingkai?",
      src: "CM2", ppt: "Slide 3–4",
      img: { key: "c2s3", cap: "Slide 3 — Chapter map: perjalanan konseptual Bab 2 (slide asli dosen)" },
      body: `
<p>Bab 1 bertanya "apa itu etika bisnis". Bab 2 bertanya sesuatu yang lebih struktural: bagaimana menempatkan
<strong>korporasi itu sendiri</strong> di dalam tatanan sosial. Slide 3 memberi peta perjalanannya:</p>

<div class="slide-chain">
  <span>What is a corporation?</span><i>→</i>
  <span>Moral responsibility</span><i>→</i>
  <span>CSR</span><i>→</i>
  <span>Stakeholder theory</span><i>→</i>
  <span>Corporate citizenship</span>
</div>

<p>Tiap konsep menjawab pertanyaan berbeda: <strong>apa</strong> perusahaan itu, <strong>apa</strong> yang harus
dilakukannya, <strong>siapa</strong> yang diperhitungkan, dan <strong>bagaimana</strong> ia dimintai
pertanggungjawaban. Bersama-sama mereka membentuk kerangka analisis melampaui kepatuhan hukum.</p>

<div class="gs-grid">
  <div class="gs-head gs-head--b">PANDANGAN SEMPIT TRADISIONAL</div>
  <div class="gs-head gs-head--a">PANDANGAN SOSIAL YANG LEBIH LUAS</div>
  <div class="gs-cell gs-cell--b">Perusahaan terutama institusi ekonomi.</div>
  <div class="gs-cell gs-cell--a">Perusahaan tertanam (embedded) dalam masyarakat.</div>
  <div class="gs-cell gs-cell--b">Manajer fokus pada kepentingan pemegang saham.</div>
  <div class="gs-cell gs-cell--a">Keputusan bisnis memengaruhi banyak kelompok.</div>
  <div class="gs-cell gs-cell--b">Masalah sosial diserahkan pada pemerintah atau individu.</div>
  <div class="gs-cell gs-cell--a">Tanggung jawab mencakup dimensi ekonomi, hukum, etis, dan sosial.</div>
  <div class="gs-cell gs-cell--b">Etika = kepatuhan atau perilaku pribadi.</div>
  <div class="gs-cell gs-cell--a">Etika = bagian dari strategi, tata kelola, dan legitimasi.</div>
</div>

<p>Catatan dosen: pandangan sempit tidak "salah" — ia hanya <em>tidak memadai</em>, karena korporasi memengaruhi
banyak stakeholder dan ikut membentuk hasil sosial serta politik. Itulah pergeseran fundamental bab ini.</p>`
    },
    {
      title: "Apa itu korporasi — dan bisakah ia bertanggung jawab secara moral?",
      src: "CM2", ppt: "Slide 5–6",
      img: { key: "c2s5", cap: "Slide 5 — What is a corporation? Tiga aktor sekaligus (slide asli dosen)" },
      body: `
<p>Slide 5 menguraikan korporasi sebagai tiga aktor sekaligus:</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Legal person</b>
    <span>Diakui hukum, terpisah dari pemiliknya; dapat memiliki properti, membuat kontrak, menggugat dan
    digugat.</span>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Economic actor</b>
    <span>Mengorganisasi modal, tenaga kerja, dan aset; memproduksi barang dan jasa; menciptakan serta
    mendistribusikan nilai.</span>
  </div>
  <div class="dbm-card dbm-card--clay">
    <b>Social actor</b>
    <span>Memengaruhi komunitas, pekerja, konsumen, dan ekosistem — dan beroperasi dengan <strong>legitimasi yang
    diberikan masyarakat</strong>.</span>
  </div>
</div>

<p>Karena ia aktor sosial, muncul debat inti bab ini: korporasi adalah <em>entitas hukum</em>, bukan manusia.
Bisakah ia disebut bersalah secara moral?</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">YA — korporasi adalah moral agent</div>
  <div class="gs-head gs-head--b">TIDAK — hanya individu yang bermoral</div>
  <div class="gs-cell gs-cell--a">Korporasi punya <strong>sistem keputusan, budaya, dan kebijakan</strong> —
  keputusan bisa disebut keputusan <em>perusahaan</em>, bukan penjumlahan keputusan orang.</div>
  <div class="gs-cell gs-cell--b">Hanya manusia yang dapat berniat, memilih, dan merasa bersalah.</div>
  <div class="gs-cell gs-cell--a">Tindakan korporasi berdampak <strong>kolektif</strong>; organisasi dapat dipuji,
  disalahkan, disanksi, atau dipercaya.</div>
  <div class="gs-cell gs-cell--b">Manajer adalah agen pemilik; isu sosial adalah peran pemerintah.</div>
  <div class="gs-cell gs-cell--a">Budaya organisasi bertahan meski orangnya berganti.</div>
  <div class="gs-cell gs-cell--b">Menyalahkan "perusahaan" bisa mengaburkan tanggung jawab individual.</div>
</div>

<div class="term-box">
  <strong>Corporate Internal Decision Structure (CID)</strong> — kerangka Peter French dari buku: kombinasi bagan
  organisasi (siapa memutuskan apa) dan aturan pengakuan keputusan (kapan sebuah keputusan menjadi keputusan
  korporasi). Keberadaan CID inilah yang membuat korporasi bisa disebut pelaku, bukan sekadar wadah.
</div>

<p>Posisi buku dan slide sama: tanggung jawab korporasi <strong>tidak menghapus</strong> tanggung jawab individu —
keduanya berlaku bersamaan (<em>shared responsibility</em>). Saat menganalisis kasus, tanyakan dua-duanya:
<em>apa yang salah pada sistemnya</em> dan <em>siapa yang mengambil keputusan itu</em>.</p>`
    },
    {
      title: "Shareholder view vs tanggung jawab yang lebih luas",
      src: "CM2", ppt: "Slide 7",
      img: { key: "c2s7", cap: "Slide 7 — Shareholder view vs broader responsibility (slide asli dosen)" },
      body: `
<div class="gs-grid">
  <div class="gs-head gs-head--b">SHAREHOLDER-CENTRED VIEW</div>
  <div class="gs-head gs-head--a">BROADER RESPONSIBILITY VIEW</div>
  <div class="gs-cell gs-cell--b">Manajer berkewajiban melindungi investasi pemilik.</div>
  <div class="gs-cell gs-cell--a">Korporasi bergantung pada banyak relasi stakeholder.</div>
  <div class="gs-cell gs-cell--b">Maksimalisasi laba = tanggung jawab utama bisnis.</div>
  <div class="gs-cell gs-cell--a">Bisnis memengaruhi masyarakat melampaui pemiliknya.</div>
  <div class="gs-cell gs-cell--b">Belanja sosial dikritik karena memakai sumber daya pemegang saham.</div>
  <div class="gs-cell gs-cell--a">Legitimasi jangka panjang menuntut keadilan, kepercayaan, akuntabilitas.</div>
</div>

<p>Argumen shareholder paling tajam datang dari <strong>Milton Friedman</strong> (1970):
<em>"The social responsibility of business is to increase its profits."</em> Buku memerinci tiga alasannya:</p>

<ol>
  <li><strong>Argumen agensi:</strong> manajer adalah agen pemegang saham. Membelanjakan uang perusahaan untuk tujuan
  sosial sama dengan membelanjakan uang orang lain tanpa mandat.</li>
  <li><strong>Argumen kompetensi:</strong> manajer dilatih menjalankan bisnis, bukan menyelesaikan masalah sosial.</li>
  <li><strong>Argumen legitimasi:</strong> menentukan prioritas sosial adalah kewenangan pemerintah terpilih, bukan
  eksekutif korporasi.</li>
</ol>

<div class="key-box">
  <strong>Catatan dosen — penting untuk cara menjawab.</strong> Pandangan shareholder <em>bukan sekadar tidak
  etis</em>; ia posisi koheren tentang keagenan manajerial dan efisiensi ekonomi. Jawaban ujian yang baik mengakui
  kekuatannya dulu, baru membantah: (a) perusahaan menikmati hak istimewa dari masyarakat (badan hukum, tanggung
  jawab terbatas) sehingga punya kewajiban balik; (b) pasar punya eksternalitas yang tidak terhitung dalam harga;
  (c) pemegang saham sendiri kini menuntut kinerja ESG; (d) Friedman sendiri mensyaratkan kepatuhan pada
  <em>"ethical custom"</em> — syarat yang sering dilupakan pengutipnya.
</div>`
    },
    {
      title: "CSR: kontestasi, piramida Carroll, dan strategi",
      src: "CM2", ppt: "Slide 8–10",
      img: { key: "c2s9", cap: "Slide 9 — Carroll's four-part CSR model (slide asli dosen)" },
      body: `
<p><strong>CSR</strong> menanyakan tanggung jawab apa yang dimiliki korporasi atas <strong>dampaknya terhadap
masyarakat</strong> — dan bagaimana tanggung jawab itu dikelola. Slide 8 membingkainya dalam tiga sifat:</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card"><b>Contested</b><span>Banyak definisi; debat sukarela vs wajib; bisa strategis, etis,
  defensif, atau sekadar simbolik.</span></div>
  <div class="dbm-card"><b>Relational</b><span>Melibatkan stakeholder, menuntut akuntabilitas, menghubungkan
  keputusan bisnis dengan ekspektasi sosial.</span></div>
  <div class="dbm-card"><b>Practical</b><span>Berwujud kebijakan dan program, pelaporan dan dialog, manajemen
  risiko, reputasi, dan penciptaan nilai.</span></div>
</div>

<p>Penting dari catatan dosen: <strong>CSR bukan hanya filantropi.</strong> Ia mencakup tata kelola, operasi,
rantai pasok, tanggung jawab produk, praktik ketenagakerjaan, manajemen lingkungan, dan pelaporan.</p>

<p class="sub-h">Piramida CSR Carroll</p>

{{viz:carrollPyramid}}

<ul>
  <li><strong>Economic responsibility (be profitable)</strong> — fondasi; <em>required</em> oleh masyarakat.</li>
  <li><strong>Legal responsibility (obey the law)</strong> — mematuhi hukum; juga <em>required</em>.</li>
  <li><strong>Ethical responsibility (be ethical)</strong> — melakukan yang benar dan adil melampaui hukum;
  <em>expected</em>.</li>
  <li><strong>Philanthropic responsibility</strong> — menyumbang bagi komunitas; <em>desired</em>, sukarela.</li>
</ul>

<div class="warn-box">
  <strong>Kritik terhadap piramida — termasuk peringatan slide.</strong> (1) Bentuk piramida menyiratkan urutan
  prioritas, padahal keempatnya berjalan simultan dan sering bertabrakan; slide dosen menegaskan model ini
  <em>jangan dibaca sebagai hierarki kaku di semua konteks budaya atau institusional</em>. (2) Model berbasis
  konteks Amerika; di Eropa banyak tanggung jawab "etis" sudah menjadi kewajiban hukum. (3) Kategori etis dan
  filantropis sulit dipisahkan.
</div>

<p class="sub-h">Tiga corak strategi CSR (slide 10)</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card dbm-card--clay">
    <b>Defensive / compliance</b>
    <span>Merespons tekanan atau risiko; fokus menghindari kerugian atau kritik; cenderung reaktif.</span>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Strategic / integrated</b>
    <span>Menghubungkan CSR dengan bisnis inti; memakai wawasan stakeholder; mengejar manfaat reputasi, risiko, dan
    inovasi.</span>
  </div>
  <div class="dbm-card">
    <b>Civil / transformative</b>
    <span>Menggarap isu sosial-lingkungan yang sistemik; sering lewat kemitraan; menuju nilai publik yang lebih
    luas.</span>
  </div>
</div>

<div class="key-box">
  <strong>Alat evaluasi tercepat (dari slide).</strong> Saat menilai program CSR perusahaan mana pun, tanyakan:
  apakah ia sekadar <em>bereaksi terhadap tekanan</em>, sudah <em>mengintegrasikan tanggung jawab ke operasi
  inti</em>, atau ikut <em>menggarap solusi masyarakat yang lebih luas</em>?
</div>

<p class="sub-h">Tahapan pembelajaran organisasi (Zadek)</p>

<p>Buku melengkapi tiga corak itu dengan peta Simon Zadek tentang bagaimana perusahaan <em>belajar</em>:</p>

<div class="cascade">
  <div class="cascade-box"><b>1. Defensive</b><span>"Bukan salah kami." Menyangkal praktik, dampak, atau tanggung jawab.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>2. Compliance</b><span>"Kami lakukan sebatas kewajiban."</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>3. Managerial</b><span>"Ini urusan bisnis inti." Ditanam ke proses manajemen.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>4. Strategic</b><span>"Ini memberi keunggulan bersaing."</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box cascade-box--hi"><b>5. Civil</b><span>"Kami dorong seluruh industri."</span></div>
</div>

<div class="case-box">
  <strong>Kasus rujukan — Nike dan rantai pasok (1990-an hingga kini).</strong>
  <p>Awal 1990-an Nike dituduh soal upah rendah, jam kerja panjang, dan pekerja anak di pabrik pemasok Asia.
  Respons awalnya <strong>defensive</strong>: "pabrik itu bukan milik kami." Tekanan konsumen dan media memaksanya
  bergerak melalui compliance, managerial, strategic, hingga <strong>civil</strong> — Nike menjadi salah satu merek
  pertama yang mempublikasikan daftar pabriknya.</p>
  <p><strong>Poin analisis:</strong> batas tanggung jawab perusahaan tidak ditentukan kepemilikan hukum, melainkan
  <em>ekspektasi stakeholder</em> — dan ekspektasi itu bergerak.</p>
</div>`
    },
    {
      title: "Stakeholder theory dan pemetaan klaim",
      src: "CM2", ppt: "Slide 11–12",
      img: { key: "c2s11", cap: "Slide 11 — Stakeholder theory of the firm (slide asli dosen)" },
      body: `
<p><strong>Stakeholder</strong> menurut definisi klasik R. Edward Freeman (1984):
<em>"any group or individual who can affect or is affected by the achievement of the organization's
objectives."</em> Definisi ini dua arah — memengaruhi <strong>atau</strong> dipengaruhi. Slide 11 merumuskannya
sebagai pergeseran pertanyaan: dari "bagaimana manajer melayani pemegang saham?" menjadi
<strong>"kelompok mana yang punya klaim sah atas korporasi?"</strong></p>

{{viz:stakeholderMap}}

<p>Teori ini tidak otomatis menyelesaikan konflik antarklaim — tetapi ia memastikan kelompok terdampak
<em>terlihat</em>. Buku menambahkan tiga cara memakainya:</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Normative</b>
    <span>Perusahaan <em>seharusnya</em> memperhatikan stakeholder karena mereka punya hak moral dan kepentingan
    sah.</span>
    <em>Pertanyaan: mengapa ini benar?</em>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Descriptive</b>
    <span>Menggambarkan bagaimana perusahaan <em>sebenarnya</em> berinteraksi dengan stakeholder.</span>
    <em>Pertanyaan: apa yang terjadi?</em>
  </div>
  <div class="dbm-card dbm-card--clay">
    <b>Instrumental</b>
    <span>Mengelola stakeholder dengan baik <em>menghasilkan</em> kinerja lebih baik — argumen business case.</span>
    <em>Pertanyaan: apa untungnya?</em>
  </div>
</div>

<p class="sub-h">Primary vs secondary stakeholders: relasi dua arah dengan perusahaan</p>

<p><em>Dibahas dosen di kelas.</em> Sebelum menilai bobot tiap klaim, literatur stakeholder management membedakan
dulu <strong>jenis relasinya</strong> — kerangka klasik dari tradisi Carroll yang juga ada di bacaan pendukung
silabus (CB — Carroll &amp; Brown):</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">PRIMARY (market) STAKEHOLDERS</div>
  <div class="gs-head gs-head--b">SECONDARY (nonmarket) STAKEHOLDERS</div>
  <div class="gs-cell gs-cell--a">Terlibat <strong>transaksi ekonomi langsung</strong> dengan perusahaan.</div>
  <div class="gs-cell gs-cell--b">Tidak bertransaksi langsung, tetapi dapat <strong>memengaruhi atau
  dipengaruhi</strong> perusahaan.</div>
  <div class="gs-cell gs-cell--a">Karyawan, pemegang saham &amp; investor, kreditor, pelanggan, pemasok,
  distributor &amp; peritel.</div>
  <div class="gs-cell gs-cell--b">Pemerintah, komunitas, media, LSM/kelompok aktivis, masyarakat umum,
  asosiasi bisnis.</div>
  <div class="gs-cell gs-cell--a"><strong>Uji cepat:</strong> bila kelompok ini menghilang, operasi perusahaan
  langsung terancam berhenti.</div>
  <div class="gs-cell gs-cell--b"><strong>Awas:</strong> sekunder bukan berarti kurang penting — media dan LSM bisa
  menjadi <em>definitive stakeholder</em> pada model salience.</div>
</div>

{{viz:primaryStakeholders}}

<p>Inti gambarnya ada pada <strong>panah dua arah</strong>: setiap primary stakeholder memberi sesuatu kepada
perusahaan <em>dan</em> menerima sesuatu darinya. Relasinya adalah <strong>saling ketergantungan</strong>, bukan
satu arah:</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card"><b>Karyawan</b><span>Memberi tenaga, keterampilan, komitmen → menerima upah yang adil,
  keamanan kerja, pengembangan.</span></div>
  <div class="dbm-card"><b>Pemegang saham &amp; investor</b><span>Memberi modal → menerima dividen, kenaikan nilai,
  hak suara dan informasi.</span></div>
  <div class="dbm-card"><b>Kreditor</b><span>Memberi pinjaman → menerima bunga dan pelunasan tepat waktu.</span></div>
  <div class="dbm-card"><b>Pelanggan</b><span>Memberi pendapatan dan loyalitas → menerima produk aman, bernilai,
  dan informasi jujur.</span></div>
  <div class="dbm-card"><b>Pemasok</b><span>Memberi bahan baku dan keandalan → menerima pembayaran adil, tepat
  waktu, relasi berkelanjutan.</span></div>
  <div class="dbm-card"><b>Distributor &amp; peritel</b><span>Memberi akses pasar → menerima margin wajar dan
  dukungan produk.</span></div>
</div>

<div class="key-box">
  <strong>Mengapa relasi dua arah ini penting secara etis.</strong> Ketika perusahaan menerima kontribusi tetapi
  menekan imbalannya — upah di bawah layak (CM7), menunda pembayaran pemasok (CM9), produk tidak aman (CM8) —
  relasi itu berubah dari pertukaran menjadi <em>ekstraksi</em>. Kerangka ini juga alat diagnosis cepat: telusuri
  tiap panah dan tanyakan, <em>apakah kedua arah pertukarannya masih adil?</em> Bedakan pula dari model salience:
  primary/secondary memetakan <strong>jenis relasi</strong>, salience memetakan <strong>bobot perhatian</strong> —
  dua alat berbeda yang saling melengkapi.
</div>

<p class="sub-h">Menilai klaim: model salience — plus dua atribut dari slide</p>

{{viz:stakeholderSalience}}

<ul>
  <li><strong>Power</strong> — kemampuan memaksakan kehendak pada perusahaan.</li>
  <li><strong>Legitimacy</strong> — klaim yang dipandang sah, pantas, dan sesuai norma.</li>
  <li><strong>Urgency</strong> — tuntutan yang sensitif waktu dan dianggap kritis.</li>
</ul>

<p>Satu atribut = <em>latent</em>; dua = <em>expectant</em>; tiga = <strong>definitive stakeholder</strong> —
prioritas utama manajemen.</p>

<div class="term-box">
  <strong>Tambahan penting dari slide 12.</strong> Di luar tiga atribut Mitchell yang klasik, slide dosen menambahkan
  <strong>vulnerability</strong> dan <strong>dependency</strong>: sebagian stakeholder punya power kuat tetapi klaim
  moral lemah; sebagian lain nyaris tanpa power tetapi sangat rentan dan bergantung pada perusahaan. Analisis etis
  tidak boleh sekadar memprioritaskan pihak yang paling nyaring atau paling berkuasa — pertimbangkan legitimacy,
  urgency, dependency, dan keadilan.
</div>

<p class="sub-h">Tiga langkah pemetaan (slide 12)</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card"><b>1 · Identify</b><span>Siapa terdampak? Siapa dapat memengaruhi perusahaan? Siapa punya
  klaim, hak, atau kepentingan?</span></div>
  <div class="dbm-card"><b>2 · Assess</b><span>Power dan pengaruh · legitimacy klaim · urgency isu ·
  vulnerability dan dependency.</span></div>
  <div class="dbm-card"><b>3 · Respond ethically</b><span>Libatkan dan dengarkan · seimbangkan kepentingan ·
  jelaskan trade-off · bangun mekanisme akuntabilitas.</span></div>
</div>

<div class="key-box">
  <strong>Cara memakai di analisis kasus.</strong> Jangan hanya membuat daftar stakeholder. Untuk tiap pihak
  sebutkan: (1) apa <em>stake</em>-nya secara konkret; (2) atribut mana yang dimilikinya — termasuk kerentanannya;
  (3) apakah klaimnya bertabrakan dengan klaim pihak lain. Dilema etis lahir dari klaim yang sama-sama sah tetapi
  saling bertentangan.
</div>`
    },
    {
      title: "Accountability, transparency, dan corporate citizenship",
      src: "CM2", ppt: "Slide 13–14",
      img: { key: "c2s13", cap: "Slide 13 — Corporate accountability and transparency (slide asli dosen)" },
      body: `
<p>Bertanggung jawab berarti juga <em>dapat dimintai penjelasan</em>. Bedakan: <strong>responsibility</strong>
bersifat ke depan (apa yang seharusnya kita lakukan), <strong>accountability</strong> bersifat ke belakang (kepada
siapa kita menjelaskan apa yang sudah dilakukan, dan sanksi apa bila gagal). Slide 13 menyusunnya sebagai tiga
rangkaian pertanyaan:</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card"><b>Responsibility</b><span>Siapa punya kewajiban? Kewajiban apa yang ada? Kerugian atau
  manfaat apa yang tercipta?</span></div>
  <div class="dbm-card dbm-card--brass"><b>Accountability</b><span>Siapa harus menjelaskan keputusan? Kepada siapa?
  Konsekuensi apa yang mengikuti?</span></div>
  <div class="dbm-card dbm-card--clay"><b>Transparency</b><span>Informasi apa yang diungkap? Apakah dapat dipahami
  dan diandalkan? Dapatkah stakeholder memakainya?</span></div>
</div>

<div class="warn-box">
  <strong>Transparansi saja tidak cukup.</strong> Catatan dosen: informasi harus relevan, andal, dapat diakses, dan
  terhubung dengan mekanisme yang memungkinkan stakeholder <em>mempertanyakan atau menantang</em> perilaku
  korporasi. Laporan tebal tanpa mekanisme itu hanyalah kehumasan — sambungkan dengan social auditing di CM5.
</div>

<p class="sub-h">Tiga pandangan corporate citizenship</p>

<div class="cascade">
  <div class="cascade-box"><b>Limited view</b><span>Corporate citizenship = filantropi korporat dan investasi
  komunitas lokal.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>Equivalent view</b><span>Corporate citizenship = CSR, sekadar dibungkus ulang.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box cascade-box--hi"><b>Extended view</b><span>Pandangan Crane &amp; Matten: korporasi
  <em>mengelola hak-hak kewarganegaraan</em> individu ketika negara mundur atau gagal.</span></div>
</div>

<p>Pada <strong>extended view</strong>, korporasi bukan "warga negara" yang punya hak, melainkan aktor yang
<strong>mengatur hak warga lain</strong>: sebagai <em>provider</em> hak sosial (kesehatan, pendidikan, pensiun),
<em>enabler</em> hak sipil (berserikat, privasi, berpendapat), dan <em>channel</em> hak politik (lobi, pendanaan
kampanye, atau menjadi sasaran aktivisme konsumen).</p>

<div class="case-box">
  <strong>Tantangan etis (slide 14).</strong>
  <p>Ketika bisnis menjadi <em>aktor politik</em>: siapa yang mengotorisasi kekuasaan korporasi? Bagaimana ia
  dimintai pertanggungjawaban? Dapatkah kewargaan bersifat global? Perusahaan dapat berkontribusi pada kesejahteraan
  publik, tetapi kekuasaannya tidak diotorisasi secara demokratis — pertanyaan ini kembali dengan nama
  <em>political CSR</em> di CM11.</p>
</div>`
    },
    {
      title: "Konteks regional, kasus American Apparel, dan penutup",
      src: "CM2", ppt: "Slide 15–18",
      img: { key: "c2s17", cap: "Slide 17 — Teaching flow for class (slide asli dosen)" },
      body: `
<p>Konsep bab ini menyebar tidak merata antarkawasan (slide 15):</p>

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>North America</b>
    <span>Tanggung jawab individual dan inisiatif korporasi; shareholder value tetap berpengaruh; kode etik,
    kepatuhan, filantropi menonjol.</span>
  </div>
  <div class="dbm-card">
    <b>Europe</b>
    <span>Peran institusional dan regulasi; tradisi tata kelola stakeholder lebih kuat; CSR lebih menyatu dengan
    kebijakan sosial.</span>
  </div>
  <div class="dbm-card">
    <b>Asia &amp; emerging</b>
    <span>Relasi bisnis-pemerintah sentral; perusahaan keluarga, BUMN, dan konglomerat penting; norma lokal
    membentuk ekspektasi.</span>
  </div>
</div>

<p>Untuk Indonesia, kolom ketiga paling relevan: perusahaan keluarga, BUMN, konglomerat, dan relasi
bisnis-pemerintah membentuk ekspektasi tanggung jawab — pola yang kembali saat membahas tata kelola (CM6) dan
regulasi (CM11). Hindari stereotip, tetapi akui bahwa etika bisnis <em>peka konteks</em>.</p>

<div class="case-box">
  <strong>Kasus bab ini — American Apparel.</strong>
  <p>Merek yang dibangun di atas klaim etis "Made in USA — Sweatshop Free", lalu runtuh justru karena kontradiksi
  antara citra publik dan praktik internal — kampanye iklan yang dipersoalkan dan perilaku pendirinya. Pelajaran
  kuncinya: <strong>klaim CSR menaikkan ekspektasi</strong>; kegagalan memenuhi klaim sendiri merusak legitimasi
  lebih dalam daripada bila klaim itu tidak pernah dibuat. Versi lengkapnya ada di bagian <em>Kasus nyata untuk
  CM2</em> di bawah.</p>
</div>

<p class="sub-h">Alur kelas yang disarankan (slide 17)</p>

<div class="cascade">
  <div class="cascade-box"><b>1. Opening question</b><span>What is a corporation for?</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>2. Mini-lecture</b><span>CSR dan tanggung jawab korporasi</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>3. Group work</b><span>stakeholder mapping</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>4. Case debate</b><span>American Apparel</span></div>
  <div class="cascade-box cascade-box--hi"><b>5. Reflection</b><span>corporate citizenship</span></div>
</div>

<p><em>Instructor tip</em> dari slide: pilih satu konsep — CSR, stakeholder theory, accountability, atau
citizenship — dan terapkan pada satu perusahaan terkini. Latihan yang persis sama bisa kamu kerjakan di halaman
<strong>Kasus</strong> aplikasi ini.</p>

<p class="sub-h">Pertanyaan penutup dari slide</p>

<ul>
  <li>Untuk apa sebuah korporasi ada?</li>
  <li>Dapatkah korporasi benar-benar dimintai pertanggungjawaban moral, atau hanya individu di dalamnya?</li>
  <li>Kapan CSR menjadi strategi, dan kapan ia menjadi manipulasi?</li>
  <li>Jika korporasi kini memengaruhi barang publik, hak, dan regulasi — bagaimana kekuasaan itu seharusnya
  diatur?</li>
</ul>

<div class="key-box">
  <strong>Ringkasan satu kalimat (dari slide).</strong> CSR menanyakan tanggung jawab <em>apa</em> yang dimiliki
  bisnis; stakeholder theory menanyakan <em>kepada siapa</em> tanggung jawab itu terutang; accountability menanyakan
  <em>bagaimana</em> korporasi dimintai penjelasan; corporate citizenship menanyakan bagaimana <em>kekuasaan
  korporasi</em> dipahami ketika perusahaan mengambil peran sosial atau politik.
</div>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM2:</strong></p>
<ul>
  <li>Korporasi sebagai tiga aktor (legal, economic, social) + debat moral agency dan CID.</li>
  <li>Piramida Carroll — required / expected / desired — plus kritiknya dan peringatan slide soal hierarki kaku.</li>
  <li>Argumen Friedman dan cara membantahnya secara berimbang.</li>
  <li>Definisi stakeholder Freeman + tiga pendekatan (normative, descriptive, instrumental).</li>
  <li>Model salience (power, legitimacy, urgency) <strong>plus vulnerability dan dependency</strong> dari slide.</li>
  <li>Tiga corak strategi CSR: defensive / integrated / transformative.</li>
  <li>Trio responsibility–accountability–transparency, dan mengapa transparansi saja tidak cukup.</li>
  <li>Tiga pandangan corporate citizenship, terutama <em>extended view</em>.</li>
</ul>`
},

/* ==========================================================
   CM3 — EVALUATING BUSINESS ETHICS
   ========================================================== */
{
  id: 3, ref: "CM3", session: 3,
  title: "Evaluating Business Ethics: Normative Ethical Theories",
  titleId: "Mengevaluasi Etika Bisnis: Teori Etika Normatif",
  blurb: "Alat utama mata kuliah ini. Teori normatif memberi kamu lensa untuk menilai apakah sebuah keputusan bisnis benar atau salah — dan bahasa untuk mempertahankan penilaian itu.",
  objectives: [
    "Membedakan teori konsekuensialis dan non-konsekuensialis.",
    "Menerapkan utilitarianism, ethics of duty, dan ethics of rights & justice pada kasus bisnis.",
    "Menjelaskan teori kontemporer: virtue, feminist, discourse, dan postmodern ethics.",
    "Menggunakan pendekatan pluralistik dalam analisis kasus."
  ],
  sections: [
    {
      title: "Peta teori etika normatif",
      src: "CM3",
      body: `
<p>Teori <strong>normatif</strong> menjawab pertanyaan "apa yang <em>seharusnya</em> dilakukan?" — berbeda dari teori
<strong>deskriptif</strong> (CM4) yang menjawab "apa yang <em>sebenarnya</em> terjadi saat orang mengambil keputusan?"</p>

<p>Crane &amp; Matten membagi teori normatif menjadi dua kelompok besar berdasarkan <strong>apa yang menentukan
kebenaran suatu tindakan</strong>:</p>

{{viz:theoryTree}}

<div class="gs-grid">
  <div class="gs-head gs-head--a">CONSEQUENTIALIST (teleological)</div>
  <div class="gs-head gs-head--b">NON-CONSEQUENTIALIST (deontological)</div>
  <div class="gs-cell gs-cell--a">Benar-salah ditentukan oleh <strong>hasil/akibat</strong> tindakan.</div>
  <div class="gs-cell gs-cell--b">Benar-salah ditentukan oleh <strong>prinsip/motif</strong> yang mendasari tindakan.</div>
  <div class="gs-cell gs-cell--a">"Tindakan ini benar karena membawa hasil terbaik."</div>
  <div class="gs-cell gs-cell--b">"Tindakan ini benar karena sesuai kewajiban, apa pun hasilnya."</div>
  <div class="gs-cell gs-cell--a">Anggota: <em>egoism</em>, <em>utilitarianism</em>.</div>
  <div class="gs-cell gs-cell--b">Anggota: <em>ethics of duty</em> (Kant), <em>ethics of rights &amp; justice</em>.</div>
</div>

<p>Selain itu ada kelompok <strong>teori kontemporer</strong> yang muncul sebagai kritik terhadap keduanya:
virtue ethics, feminist ethics, discourse ethics, dan postmodern ethics. Ciri khasnya: menggeser fokus dari
<em>tindakan</em> ke <em>pelaku, relasi, dan proses</em>.</p>

<div class="term-box">
  <strong>Western modernist vs contemporary.</strong> Crane &amp; Matten menyebut teori konsekuensialis dan
  non-konsekuensialis sebagai <em>Western modernist ethical theories</em> — ciri khasnya: rasional, universal,
  impersonal, dan berbasis aturan. Teori kontemporer justru menekankan yang sebaliknya: berbasis pengalaman,
  partikular, personal, dan berbasis relasi. Perbedaan ini sering ditanyakan.
</div>`
    },
    {
      title: "Consequentialist: egoism dan utilitarianism",
      src: "CM3",
      body: `
<p class="sub-h">Egoism</p>

<p><strong>Egoism</strong> menyatakan sebuah tindakan dapat diterima secara moral jika pengambil keputusan secara
bebas memutuskan untuk mengejar kepentingan jangka pendek maupun jangka panjangnya sendiri. Adam Smith memberi
landasan ekonominya: melalui <em>invisible hand</em>, pengejaran kepentingan pribadi di pasar bebas menghasilkan
manfaat kolektif.</p>

<p><strong>Masalahnya:</strong> asumsi invisible hand hanya bekerja bila pasar kompetitif sempurna, informasi
simetris, dan tidak ada eksternalitas — kondisi yang jarang terpenuhi. Egoism juga sulit membedakan kepentingan
pribadi yang sah dari keserakahan yang merusak.</p>

<p class="sub-h">Utilitarianism</p>

<p><strong>Utilitarianism</strong> (Jeremy Bentham, John Stuart Mill): sebuah tindakan benar secara moral jika
menghasilkan <strong>kebaikan terbesar bagi jumlah orang terbanyak</strong> — <em>"the greatest good for the
greatest number."</em> Fokusnya bukan kepentingan pelaku, melainkan <strong>utilitas kolektif</strong>.</p>

{{viz:utilitarianCalc}}

<p>Bentham mengusulkan <em>hedonistic calculus</em> untuk menghitung utilitas dengan mempertimbangkan intensitas,
durasi, kepastian, kedekatan, dan cakupan kesenangan/penderitaan yang dihasilkan.</p>

<div class="dbm-grid">
  <div class="dbm-card">
    <b>Act utilitarianism</b>
    <span>Menilai <strong>tiap tindakan individual</strong> berdasarkan utilitas yang dihasilkannya pada situasi itu.</span>
    <em>Fleksibel, tetapi bisa membenarkan tindakan yang mengerikan pada kasus tertentu.</em>
  </div>
  <div class="dbm-card">
    <b>Rule utilitarianism</b>
    <span>Menilai <strong>aturan</strong> di balik tindakan: apakah jika semua orang mengikuti aturan ini, utilitas
    kolektif maksimal?</span>
    <em>Lebih stabil, mendekati pendekatan berbasis prinsip.</em>
  </div>
</div>

<div class="warn-box">
  <strong>Tiga kelemahan utilitarianism yang wajib kamu sebut di ujian.</strong>
  <ol>
    <li><strong>Subjectivity / problem of quantification</strong> — bagaimana mengukur dan membandingkan kebahagiaan
    orang yang berbeda? Bagaimana memberi angka pada nyawa, kesehatan, atau hutan?</li>
    <li><strong>Distribution problem</strong> — utilitas total bisa maksimal sambil sangat tidak adil. Utilitarianism
    tidak peduli <em>siapa</em> yang menikmati dan <em>siapa</em> yang menderita, selama totalnya besar. Ini bisa
    membenarkan pengorbanan minoritas demi mayoritas.</li>
    <li><strong>Prediksi konsekuensi</strong> — kita tidak pernah tahu pasti seluruh akibat suatu tindakan, terutama
    jangka panjang.</li>
  </ol>
</div>

<div class="case-box">
  <strong>Kasus klasik — Ford Pinto (1970-an).</strong>
  <p>Ford mengetahui desain tangki bensin Pinto berisiko meledak pada tabrakan belakang. Perbaikan diperkirakan
  memakan biaya USD 11 per mobil. Ford melakukan analisis biaya-manfaat: biaya perbaikan seluruh armada dibandingkan
  perkiraan biaya tuntutan hukum atas kematian dan luka bakar. Karena biaya perbaikan lebih besar, perbaikan
  ditunda.</p>
  <p><strong>Analisis:</strong> ini adalah <em>act utilitarianism</em> yang dijalankan secara harfiah — dan justru
  memperlihatkan kelemahannya. Menempatkan nilai moneter pada nyawa manusia mengabaikan bahwa korban punya
  <strong>hak</strong> atas keselamatan yang tidak boleh diperdagangkan, berapa pun angkanya. Gunakan kasus ini untuk
  menunjukkan mengapa satu teori saja tidak cukup.</p>
</div>`
    },
    {
      title: "Non-consequentialist: ethics of duty",
      src: "CM3",
      body: `
<p><strong>Immanuel Kant</strong> berargumen bahwa moralitas harus berbasis <em>akal budi</em>, bukan akibat.
Sebuah tindakan bermoral bila dilakukan <strong>karena kewajiban</strong> (duty), bukan karena kecenderungan atau
keuntungan. Kant merumuskan <strong>categorical imperative</strong> dalam tiga maksim:</p>

{{viz:kantMaxims}}

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Maxim 1 — Consistency<br>(universalizability)</b>
    <span>"Bertindaklah hanya menurut prinsip yang sekaligus dapat kamu kehendaki menjadi <strong>hukum
    universal</strong>."</span>
    <em>Uji: bagaimana jika semua orang melakukan ini?</em>
  </div>
  <div class="dbm-card">
    <b>Maxim 2 — Human dignity</b>
    <span>"Perlakukan manusia selalu <strong>sekaligus sebagai tujuan</strong>, tidak pernah semata-mata sebagai
    <strong>sarana</strong>."</span>
    <em>Uji: apakah orang ini saya alat-kan?</em>
  </div>
  <div class="dbm-card">
    <b>Maxim 3 — Universality<br>(autonomy)</b>
    <span>"Bertindaklah seolah-olah kamu, melalui maksimmu, adalah anggota pembuat hukum dalam <strong>kerajaan
    tujuan</strong> yang universal."</span>
    <em>Uji: apakah semua pihak bisa menerima aturan ini?</em>
  </div>
</div>

<p><strong>Maxim 2 adalah yang paling sering dipakai dalam analisis kasus bisnis.</strong> Ia langsung mengenai
praktik seperti iklan menyesatkan (konsumen dijadikan alat mencapai penjualan), kerja paksa, atau eksperimen tanpa
persetujuan. Perhatikan kata <em>"semata-mata"</em> (merely): mempekerjakan orang untuk mencapai tujuan perusahaan
tidak otomatis salah — yang salah adalah memperlakukan mereka <em>hanya</em> sebagai alat, tanpa menghormati
martabat dan otonomi mereka.</p>

<div class="warn-box">
  <strong>Kelemahan ethics of duty.</strong> (1) Terlalu <em>kaku</em> — tidak memberi ruang pengecualian, bahkan
  ketika berbohong bisa menyelamatkan nyawa. (2) <em>Konflik kewajiban</em> — ketika dua kewajiban bertabrakan,
  Kant tidak memberi cara memilih. (3) <em>Mengabaikan akibat</em> sepenuhnya terasa tidak masuk akal dalam keputusan
  bisnis nyata. (4) Bersifat sangat individualistis dan rasionalistik.
</div>`
    },
    {
      title: "Non-consequentialist: ethics of rights and justice",
      src: "CM3",
      body: `
<p class="sub-h">Ethics of rights</p>

<p>Berakar pada <strong>John Locke</strong>: manusia memiliki <strong>natural rights</strong> — hak yang melekat
karena ia manusia, bukan karena diberikan negara. <strong>Human rights</strong> adalah hak dasar tertentu yang
diyakini menjadi milik semua manusia, bersifat universal dan tidak dapat dicabut.</p>

<p>Ciri hak yang perlu diingat: <em>universal</em> (berlaku untuk semua), <em>equal</em> (setara), dan
<em>inalienable</em> (tidak bisa dialihkan atau dicabut). Setiap hak menciptakan <strong>kewajiban korelatif</strong>
pada pihak lain — hak karyawan atas tempat kerja aman menciptakan kewajiban perusahaan menyediakannya.</p>

<p class="sub-h">Ethics of justice</p>

<p><strong>Justice</strong> adalah distribusi manfaat dan beban yang adil secara simultan. Ada dua pemahaman utama:</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">FAIR PROCEDURE (Nozick)</div>
  <div class="gs-head gs-head--b">FAIR OUTCOME (Rawls)</div>
  <div class="gs-cell gs-cell--a">Adil bila <strong>prosesnya</strong> adil: semua punya kesempatan setara dan
  aturan main sama. Hasil yang timpang tetap adil bila diperoleh secara sah.</div>
  <div class="gs-cell gs-cell--b">Adil bila <strong>hasilnya</strong> adil: ketimpangan hanya dibenarkan bila
  menguntungkan pihak yang paling tidak beruntung.</div>
  <div class="gs-cell gs-cell--a">Fokus: kebebasan dan hak milik.</div>
  <div class="gs-cell gs-cell--b">Fokus: kesetaraan dan perlindungan yang lemah.</div>
</div>

<div class="term-box">
  <strong>John Rawls — veil of ignorance.</strong> Bayangkan kamu merancang aturan masyarakat tanpa mengetahui akan
  lahir sebagai siapa: kaya atau miskin, sehat atau sakit, mayoritas atau minoritas. Aturan yang kamu pilih dalam
  kondisi itulah yang adil. Dari sini Rawls menurunkan dua prinsip: (1) <em>liberty principle</em> — kebebasan dasar
  yang setara untuk semua; (2) <em>difference principle</em> — ketimpangan sosial-ekonomi hanya dibenarkan bila
  memberi manfaat terbesar bagi mereka yang paling tidak beruntung.
  <br><br>
  <strong>Cara pakai di kasus bisnis:</strong> tanyakan — "jika saya tidak tahu akan menjadi CEO atau buruh harian di
  rantai pasok ini, aturan mana yang akan saya pilih?"
</div>`
    },
    {
      title: "Teori etika kontemporer",
      src: "CM3",
      body: `
<p>Empat teori ini muncul sebagai kritik terhadap pendekatan modernis yang dianggap terlalu abstrak, rasionalistik,
dan mengabaikan konteks serta relasi.</p>

<div class="dbm-grid">
  <div class="dbm-card">
    <b>Virtue ethics</b>
    <span>Berakar pada Aristoteles. Fokus bergeser dari "tindakan apa yang benar?" ke <strong>"orang seperti apa yang
    seharusnya saya jadi?"</strong> Tindakan bermoral mengalir dari <em>karakter</em> yang baik. Kebajikan bisnis:
    integritas, kejujuran, keadilan, keberanian, kehati-hatian.</span>
    <em>Kunci: character, habit, dan practical wisdom (phronesis).</em>
  </div>
  <div class="dbm-card">
    <b>Feminist ethics / ethics of care</b>
    <span>Menolak model "individu terpisah yang menimbang hak". Menekankan <strong>relasi, tanggung jawab merawat,
    empati, dan menghindari bahaya</strong> pada pihak yang bergantung pada kita. Keputusan dinilai dari dampaknya
    pada jejaring relasi.</span>
    <em>Kunci: relationship, care, responsibility, experience.</em>
  </div>
  <div class="dbm-card">
    <b>Discourse ethics</b>
    <span>Jürgen Habermas. Kebenaran moral tidak ditemukan sendirian, tetapi lewat <strong>dialog bebas dominasi
    </strong> di antara semua pihak yang terdampak. Yang penting bukan hasilnya, tetapi <em>keabsahan prosesnya</em>:
    setara, terbuka, tanpa paksaan.</span>
    <em>Landasan teoretis bagi stakeholder dialogue di CM5.</em>
  </div>
  <div class="dbm-card">
    <b>Postmodern ethics</b>
    <span>Menolak klaim adanya rasionalitas moral universal. Menekankan <strong>moral impulse</strong> — dorongan
    moral spontan, perasaan, dan intuisi — serta kecurigaan terhadap aturan birokratis yang menumpulkan tanggung
    jawab personal.</span>
    <em>Kunci: "think local, act local"; questioning everyday practice.</em>
  </div>
</div>

<p class="sub-h">Menggabungkan semuanya: pendekatan pluralistik</p>

<p>Crane &amp; Matten tidak meminta kamu memilih satu teori dan setia padanya. Mereka menganjurkan
<strong>ethical pluralism</strong>: gunakan beberapa lensa sekaligus, karena masing-masing menyorot aspek berbeda.
Ini adalah cara paling aman menjawab soal kasus di ujian.</p>

{{viz:pluralistLens}}

<div class="key-box">
  <strong>Template jawaban kasus (pakai ini di ujian dan tugas).</strong>
  <ol>
    <li><strong>Identifikasi</strong> dilema etisnya secara spesifik — siapa berbuat apa, kepada siapa, dan apa yang
    dipertaruhkan.</li>
    <li><strong>Petakan stakeholder</strong> dan kepentingan yang bertabrakan (CM2).</li>
    <li><strong>Terapkan minimal tiga lensa:</strong> konsekuensialis (siapa untung, siapa rugi, seberapa besar),
    ethics of duty (apakah ada pihak yang dijadikan sekadar alat), ethics of rights &amp; justice (hak siapa yang
    dilanggar, apakah distribusinya adil).</li>
    <li><strong>Tambahkan lensa kontemporer</strong> bila relevan: karakter macam apa yang ditunjukkan keputusan ini
    (virtue); apakah pihak terdampak dilibatkan dalam dialog (discourse).</li>
    <li><strong>Ambil posisi</strong> — nyatakan penilaian etismu dengan jelas, akui trade-off-nya, lalu usulkan
    beberapa solusi alternatif (ini yang diminta CO3).</li>
  </ol>
</div>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM3:</strong></p>
<ul>
  <li>Peta teori: konsekuensialis vs non-konsekuensialis + anggotanya masing-masing.</li>
  <li>Utilitarianism: definisi, act vs rule, dan <strong>tiga kelemahannya</strong>.</li>
  <li>Tiga maksim Kant — terutama maxim 2 (human dignity) dan penerapannya.</li>
  <li>Rawls: veil of ignorance, liberty principle, difference principle.</li>
  <li>Empat teori kontemporer dan apa yang membedakannya dari teori modernis.</li>
  <li>Soal kasus: hampir pasti diminta menerapkan lebih dari satu teori. Latih template lima langkah di atas.</li>
</ul>`
},

/* ==========================================================
   CM4 — MAKING DECISIONS IN BUSINESS ETHICS
   ========================================================== */
{
  id: 4, ref: "CM4", session: 4,
  title: "Making Decisions in Business Ethics: Descriptive Ethical Theories",
  titleId: "Mengambil Keputusan dalam Etika Bisnis",
  blurb: "Kalau CM3 bertanya 'apa yang seharusnya', CM4 bertanya 'apa yang sebenarnya terjadi'. Bab ini menjelaskan mengapa orang baik pun bisa mengambil keputusan buruk — plus ethical leadership.",
  objectives: [
    "Menjelaskan model pengambilan keputusan etis empat tahap.",
    "Membedakan faktor individual dan situasional.",
    "Menerapkan konsep moral intensity dan cognitive moral development.",
    "Menjelaskan ethical leadership sebagai moral person dan moral manager."
  ],
  sections: [
    {
      title: "Model pengambilan keputusan etis",
      src: "CM4",
      body: `
<p>Model deskriptif yang menjadi acuan berasal dari <strong>James Rest</strong>, dan diadaptasi Crane &amp; Matten
menjadi empat tahap berurutan. Kegagalan bisa terjadi di tahap mana pun:</p>

{{viz:decisionModel}}

<ol>
  <li><strong>Recognize moral issue</strong> — menyadari bahwa situasi ini mengandung persoalan etis. Banyak
  kegagalan etis terjadi di sini: orang tidak melihat masalahnya sebagai masalah moral, melainkan sebagai keputusan
  teknis, hukum, atau finansial belaka (<em>ethical blindness</em>).</li>
  <li><strong>Make moral judgement</strong> — menilai mana tindakan yang benar. Di sinilah teori normatif CM3 bekerja.</li>
  <li><strong>Establish moral intent</strong> — memutuskan untuk memprioritaskan pertimbangan moral di atas
  pertimbangan lain. Orang bisa tahu apa yang benar tetapi memilih tidak melakukannya.</li>
  <li><strong>Engage in moral behaviour</strong> — benar-benar bertindak. Butuh <em>moral courage</em>, terutama
  ketika ada tekanan atasan atau rekan.</li>
</ol>

<div class="key-box">
  <strong>Kunci ujian.</strong> Model ini paling kuat dipakai untuk <em>mendiagnosis</em> kasus. Ketika menganalisis
  skandal, tanyakan: di tahap mana rantai ini putus? Pada Dieselgate, misalnya, para insinyur kemungkinan
  <em>mengenali</em> isu dan <em>menilai</em> dengan benar, tetapi gagal pada tahap 3 dan 4 karena tekanan target dan
  budaya organisasi. Diagnosis semacam ini jauh lebih bernilai daripada sekadar menyebut "mereka tidak etis".
</div>

<p>Dua kelompok faktor memengaruhi keempat tahap ini:</p>

{{viz:influences}}`
    },
    {
      title: "Faktor individual",
      src: "CM4",
      body: `
<p>Faktor yang melekat pada pribadi pengambil keputusan. Crane &amp; Matten membaginya menjadi tiga kelompok, dengan
catatan penting: <strong>bukti empirisnya beragam dan sering lemah</strong> — ini sendiri sering ditanyakan.</p>

<p class="sub-h">1. Faktor demografis</p>

<ul>
  <li><strong>Age and gender</strong> — hasil riset sangat tidak konsisten. Tidak ada kesimpulan kuat bahwa satu
  kelompok umur atau gender lebih etis.</li>
  <li><strong>National and cultural characteristics</strong> — punya pengaruh nyata. Kerangka Hofstede
  (individualism/collectivism, power distance, uncertainty avoidance, masculinity/femininity, long-term orientation)
  membantu menjelaskan mengapa praktik yang sama dinilai berbeda di negara berbeda.</li>
  <li><strong>Education and employment</strong> — jenis pendidikan dan lamanya bekerja memengaruhi cara seseorang
  membingkai masalah. Ada temuan kontroversial bahwa pendidikan bisnis justru dapat menumpulkan sensitivitas etis
  bila terlalu menekankan maksimalisasi laba.</li>
  <li><strong>Psychological factors</strong> — dibahas berikutnya.</li>
</ul>

<p class="sub-h">2. Cognitive moral development (Kohlberg)</p>

<p><strong>Lawrence Kohlberg</strong> memetakan bagaimana penalaran moral berkembang melalui enam tahap dalam tiga
level. Yang dinilai bukan <em>keputusan</em> seseorang, melainkan <strong>alasan</strong> di baliknya:</p>

{{viz:kohlberg}}

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card">
    <b>Level 1 — Pre-conventional</b>
    <span><strong>Tahap 1:</strong> menghindari hukuman.<br>
    <strong>Tahap 2:</strong> memenuhi kepentingan sendiri, pertukaran timbal balik.</span>
    <em>Fokus: konsekuensi bagi diri sendiri</em>
  </div>
  <div class="dbm-card">
    <b>Level 2 — Conventional</b>
    <span><strong>Tahap 3:</strong> memenuhi harapan orang terdekat, menjadi "orang baik".<br>
    <strong>Tahap 4:</strong> menjaga ketertiban sosial, mematuhi hukum dan aturan.</span>
    <em>Fokus: harapan kelompok dan masyarakat — mayoritas orang dewasa ada di sini</em>
  </div>
  <div class="dbm-card">
    <b>Level 3 — Post-conventional</b>
    <span><strong>Tahap 5:</strong> kontrak sosial, hak yang disepakati bersama.<br>
    <strong>Tahap 6:</strong> prinsip etis universal yang dipilih sendiri.</span>
    <em>Fokus: prinsip di atas aturan — relatif sedikit orang mencapainya</em>
  </div>
</div>

<div class="warn-box">
  <strong>Kritik Kohlberg (wajib disebut).</strong> (1) <strong>Bias gender</strong> — Carol Gilligan menunjukkan
  model ini dibangun dari sampel laki-laki dan menempatkan penalaran berbasis keadilan di atas penalaran berbasis
  <em>care</em>; perempuan yang menalar lewat relasi jadi tampak "lebih rendah" padahal hanya berbeda.
  (2) <strong>Bias budaya Barat</strong> — mengistimewakan individualisme. (3) <strong>Kesenjangan penalaran dan
  tindakan</strong> — penalaran tingkat tinggi tidak menjamin perilaku etis.
</div>

<p class="sub-h">3. Faktor psikologis dan personal lainnya</p>

<div class="exp-grid">
  <div class="exp-card"><button class="exp-head" type="button">Locus of control <i>+</i></button>
    <div class="exp-body"><p>Sejauh mana seseorang merasa mengendalikan peristiwa dalam hidupnya. <em>Internal
    locus</em>: merasa bertanggung jawab atas hasil, cenderung lebih menerima tanggung jawab moral.
    <em>External locus</em>: menganggap hasil ditentukan nasib, keberuntungan, atau orang lain — lebih mudah
    melepaskan tanggung jawab ("saya hanya menjalankan perintah").</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">Personal values <i>+</i></button>
    <div class="exp-body"><p>Keyakinan abadi tentang mode perilaku yang lebih disukai. Nilai pribadi menyaring
    informasi mana yang dianggap relevan saat mengambil keputusan.</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">Personal integrity <i>+</i></button>
    <div class="exp-body"><p>Kepatuhan konsisten pada prinsip moral, termasuk ketika mahal harganya. Integritas
    menjelaskan mengapa sebagian orang menolak ikut serta dalam praktik yang salah meski semua orang melakukannya.</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">Moral imagination <i>+</i></button>
    <div class="exp-body"><p>Kemampuan membayangkan <strong>alternatif</strong> di luar pilihan yang tampak tersedia,
    dan melihat situasi dari sudut pandang pihak lain. Ini kapasitas yang paling bisa dilatih — dan paling berguna
    untuk CO3 (menyediakan beragam solusi). Manajer dengan moral imagination rendah melihat dilema sebagai pilihan
    biner "untung atau etis"; yang tinggi menemukan opsi ketiga.</p></div>
  </div>
</div>`
    },
    {
      title: "Faktor situasional: isu dan konteks",
      src: "CM4",
      body: `
<p>Ini bagian terpenting bab ini. Riset konsisten menunjukkan bahwa <strong>faktor situasional lebih kuat
memprediksi perilaku etis daripada faktor individual</strong>. Orang baik dalam sistem buruk sering berperilaku
buruk.</p>

<p class="sub-h">A. Faktor terkait isu (issue-related)</p>

<p><strong>Moral intensity</strong> (Thomas Jones) — sejauh mana sebuah isu dipandang penting secara moral. Semakin
tinggi intensitasnya, semakin besar peluang isu itu dikenali dan ditindaklanjuti. Enam komponennya:</p>

{{viz:moralIntensity}}

<div class="dbm-grid">
  <div class="dbm-card"><b>Magnitude of consequences</b><span>Seberapa besar total kerugian atau manfaatnya.</span></div>
  <div class="dbm-card"><b>Social consensus</b><span>Seberapa luas kesepakatan bahwa tindakan itu salah.</span></div>
  <div class="dbm-card"><b>Probability of effect</b><span>Seberapa besar kemungkinan dampak itu benar-benar terjadi.</span></div>
  <div class="dbm-card"><b>Temporal immediacy</b><span>Seberapa cepat dampaknya terasa. Dampak jauh di masa depan
  terasa kurang mendesak — ini alasan psikologis mengapa krisis iklim sulit ditangani.</span></div>
  <div class="dbm-card"><b>Proximity</b><span>Seberapa dekat korban dengan pengambil keputusan — secara sosial,
  budaya, fisik, atau psikologis. Buruh di pabrik pemasok lima negara jauhnya terasa "kurang nyata".</span></div>
  <div class="dbm-card"><b>Concentration of effect</b><span>Apakah dampaknya terkonsentrasi pada sedikit orang atau
  tersebar tipis pada banyak orang.</span></div>
</div>

<p><strong>Moral framing</strong> — cara isu dibahasakan sangat memengaruhi apakah ia dikenali sebagai isu moral.
Menyebut PHK sebagai <em>"rightsizing"</em>, suap sebagai <em>"biaya administrasi"</em>, atau polusi sebagai
<em>"eksternalitas"</em> adalah bentuk <strong>euphemistic labelling</strong> yang menumpulkan sensitivitas moral.
Riset menunjukkan manajer sering sengaja menghindari bahasa moral (<em>moral muteness</em>) karena dianggap
tidak profesional, mengancam harmoni, dan mengurangi fleksibilitas.</p>

<p class="sub-h">B. Faktor terkait konteks (context-related)</p>

<div class="exp-grid">
  <div class="exp-card"><button class="exp-head" type="button">Systems of reward <i>+</i></button>
    <div class="exp-body"><p>Apa yang diberi imbalan akan dilakukan. Bonus berbasis target penjualan jangka pendek
    mendorong manipulasi. <strong>Kasus Wells Fargo:</strong> target penjualan silang yang ekstrem membuat karyawan
    membuka jutaan rekening fiktif atas nama nasabah tanpa izin.</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">Authority <i>+</i></button>
    <div class="exp-body"><p>Tekanan atasan, langsung maupun tersirat. Eksperimen Milgram menunjukkan betapa jauh
    orang bersedia melangkah atas perintah otoritas. Dalam organisasi, cukup dengan atasan tidak pernah menanyakan
    <em>bagaimana</em> target dicapai.</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">Bureaucracy <i>+</i></button>
    <div class="exp-body"><p>Efek birokrasi: <strong>suppression of moral autonomy</strong> (aturan menggantikan
    penilaian pribadi), <strong>instrumental morality</strong> (fokus pada cara, bukan tujuan),
    <strong>segmentation of responsibility</strong> (tanggung jawab terpecah sehingga tak seorang pun merasa
    bertanggung jawab utuh), dan <strong>denial of moral status</strong> (orang direduksi menjadi angka).</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">Work roles <i>+</i></button>
    <div class="exp-body"><p>Peran kerja membawa ekspektasi perilaku yang bisa mengesampingkan nilai pribadi.
    Seseorang bisa berperilaku berbeda sebagai "manajer pembelian" dibanding sebagai pribadi.</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">Organizational culture <i>+</i></button>
    <div class="exp-body"><p>"Cara kami melakukan sesuatu di sini." Budaya yang menoleransi pelanggaran kecil
    menormalisasi pelanggaran besar (<em>normalization of deviance</em>). Ini faktor tunggal paling menentukan —
    dan menjadi fokus CM5.</p></div>
  </div>
  <div class="exp-card"><button class="exp-head" type="button">National &amp; organizational field <i>+</i></button>
    <div class="exp-body"><p>Norma industri dan konteks nasional. Bila seluruh industri melakukan praktik tertentu,
    ia terasa normal — tekanan isomorfik membuat perusahaan meniru satu sama lain, termasuk praktik buruknya.</p></div>
  </div>
</div>`
    },
    {
      title: "Ethical leadership",
      src: "CM4 + materi tambahan",
      body: `
<p>Silabus secara khusus menambahkan <strong>ethical leadership</strong> pada sesi ini, dan menjadikannya topik
kuliah tamu di sesi 7. Ini kemungkinan besar keluar di ujian tengah semester.</p>

<div class="term-box">
  <strong>Ethical leadership</strong> — "the demonstration of normatively appropriate conduct through personal
  actions and interpersonal relationships, and the promotion of such conduct to followers through two-way
  communication, reinforcement, and decision-making" (Brown, Treviño &amp; Harrison). Perhatikan dua bagian:
  <em>menunjukkan sendiri</em> dan <em>mendorong pada orang lain</em>.
</div>

<p class="sub-h">Dua pilar: moral person dan moral manager (Treviño, Hartman &amp; Brown)</p>

<p>Pemimpin etis harus kuat pada <strong>dua dimensi sekaligus</strong>. Kombinasinya menghasilkan empat tipe:</p>

{{viz:ethicalLeaderMatrix}}

<ul>
  <li><strong>Moral person</strong> — siapa dirinya: sifat (integritas, kejujuran, dapat dipercaya), perilaku
  (melakukan hal yang benar, peduli orang, terbuka), dan pengambilan keputusan (berpegang pada nilai, objektif,
  adil, peduli masyarakat).</li>
  <li><strong>Moral manager</strong> — apa yang ia lakukan pada organisasi: menjadi <em>role model</em> yang terlihat,
  mengomunikasikan etika secara eksplisit, dan menggunakan <em>reward and discipline</em> untuk menegakkan standar.</li>
</ul>

<div class="dbm-grid">
  <div class="dbm-card dbm-card--clay">
    <b>Unethical leader</b>
    <span>Lemah sebagai moral person <em>dan</em> moral manager. Pesan yang diterima karyawan: etika tidak penting
    di sini.</span>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Hypocritical leader</b>
    <span>Banyak bicara etika (kuat sebagai moral manager) tetapi perilakunya sendiri buruk. <strong>Ini yang paling
    merusak</strong> — lebih buruk daripada diam, karena menghancurkan kepercayaan pada seluruh program etika.</span>
  </div>
  <div class="dbm-card">
    <b>Ethically neutral / silent leader</b>
    <span>Pribadinya baik, tetapi tidak pernah membicarakan etika. Karyawan mengisi kekosongan itu dengan asumsi
    bahwa yang penting hanyalah hasil.</span>
  </div>
  <div class="dbm-card dbm-card--dark">
    <b>Ethical leader</b>
    <span>Kuat pada kedua dimensi. Karyawan tahu apa yang diharapkan, melihat contohnya, dan melihat konsekuensinya
    ditegakkan secara konsisten.</span>
  </div>
</div>

<div class="key-box">
  <strong>Kunci ujian.</strong> Poin paling penting: <em>menjadi orang baik saja tidak cukup untuk menjadi pemimpin
  etis</em>. Kuadran "ethically neutral" ada persis untuk menunjukkan hal itu. Pemimpin yang berintegritas tetapi
  diam soal etika akan dianggap tidak peduli, karena karyawan menilai dari sinyal yang mereka terima — bukan dari
  isi hati atasannya.
</div>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM4:</strong></p>
<ul>
  <li>Empat tahap model keputusan etis + kemampuan mendiagnosis di tahap mana kasus gagal.</li>
  <li>Enam komponen <em>moral intensity</em> — hafalkan keenamnya, sering ditanya lengkap.</li>
  <li>Kohlberg: tiga level, enam tahap, dan kritiknya (terutama Gilligan).</li>
  <li><em>Moral imagination</em> — definisi dan mengapa ia penting untuk menghasilkan alternatif solusi.</li>
  <li>Faktor konteks: reward systems, authority, bureaucracy, organizational culture — lengkap dengan contoh.</li>
  <li>Ethical leadership: matriks moral person × moral manager dan keempat tipenya.</li>
</ul>`
},

/* ==========================================================
   CM5 — MANAGING BUSINESS ETHICS
   ========================================================== */
{
  id: 5, ref: "CM5", session: 5,
  title: "Managing Business Ethics: Tools and Techniques",
  titleId: "Mengelola Etika Bisnis: Alat dan Teknik",
  blurb: "Dari teori ke praktik: alat konkret yang dipakai perusahaan untuk mengelola etika — kode etik, whistleblowing, pelatihan, dialog stakeholder, dan pelaporan keberlanjutan.",
  objectives: [
    "Menjelaskan komponen business ethics management.",
    "Menilai efektivitas codes of ethics dan whistleblowing.",
    "Menjelaskan tangga keterlibatan stakeholder.",
    "Menjelaskan proses social accounting, auditing, dan reporting."
  ],
  sections: [
    {
      title: "Apa itu business ethics management?",
      src: "CM5",
      body: `
<p><strong>Business ethics management</strong> adalah upaya langsung perusahaan untuk secara formal atau informal
mengelola isu-isu etis dan sosial melalui kebijakan, praktik, dan program spesifik.</p>

<p>Komponen utamanya:</p>

{{viz:ethicsToolkit}}

<p class="sub-h">Dua pendekatan dasar (Paine)</p>

<div class="gs-grid">
  <div class="gs-head gs-head--b">COMPLIANCE-BASED</div>
  <div class="gs-head gs-head--a">INTEGRITY-BASED / VALUES-BASED</div>
  <div class="gs-cell gs-cell--b">Tujuan: mencegah pelanggaran hukum.</div>
  <div class="gs-cell gs-cell--a">Tujuan: mendorong perilaku yang bertanggung jawab.</div>
  <div class="gs-cell gs-cell--b">Mekanisme: aturan rinci, pemantauan, sanksi.</div>
  <div class="gs-cell gs-cell--a">Mekanisme: nilai bersama, penilaian, kepemimpinan.</div>
  <div class="gs-cell gs-cell--b">Asumsi tentang manusia: makhluk yang menghitung untung-rugi dan takut sanksi.</div>
  <div class="gs-cell gs-cell--a">Asumsi: makhluk sosial yang dibimbing nilai, ideal, dan rekan kerja.</div>
  <div class="gs-cell gs-cell--b"><strong>Risiko:</strong> mentalitas "asal tidak melanggar aturan tertulis"; mencari celah.</div>
  <div class="gs-cell gs-cell--a"><strong>Risiko:</strong> terlalu kabur untuk memandu keputusan sulit; sulit ditegakkan.</div>
</div>

<p>Perusahaan yang baik biasanya <strong>menggabungkan keduanya</strong>: kepatuhan sebagai lantai minimum,
integritas sebagai aspirasi.</p>`
    },
    {
      title: "Codes of ethics",
      src: "CM5",
      body: `
<p><strong>Codes of ethics</strong> adalah pernyataan sukarela yang memuat komitmen pada nilai dan standar etis
tertentu. Ada empat jenis yang perlu dibedakan:</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Organizational / corporate codes</b><span>Kode etik satu perusahaan untuk karyawannya
  sendiri.</span></div>
  <div class="dbm-card"><b>Professional codes</b><span>Ditetapkan asosiasi profesi (akuntan, dokter, insinyur) untuk
  anggotanya lintas perusahaan.</span></div>
  <div class="dbm-card"><b>Industry codes</b><span>Disepakati satu sektor industri, misalnya kode etik perbankan atau
  periklanan.</span></div>
  <div class="dbm-card"><b>Programme / group codes</b><span>Ditetapkan badan lintas pihak, misalnya Fairtrade,
  Forest Stewardship Council, atau UN Global Compact.</span></div>
</div>

<p class="sub-h">Apakah kode etik efektif?</p>

<p>Bukti empirisnya <strong>campur aduk</strong>. Crane &amp; Matten menunjukkan bahwa keberadaan kode etik saja
hampir tidak berpengaruh. Yang menentukan adalah bagaimana ia dibuat dan dihidupkan:</p>

<ul>
  <li><strong>Isi</strong> — spesifik dan relevan pada dilema nyata yang dihadapi karyawan, bukan slogan umum.</li>
  <li><strong>Proses penyusunan</strong> — melibatkan karyawan dan stakeholder, bukan dijatuhkan dari kantor pusat.</li>
  <li><strong>Komunikasi &amp; pelatihan</strong> — dipahami, bukan sekadar ditandatangani saat orientasi.</li>
  <li><strong>Penegakan</strong> — dijalankan konsisten, <em>termasuk pada eksekutif senior</em>. Satu pengecualian
  untuk pejabat tinggi menghapus kredibilitas seluruh kode.</li>
  <li><strong>Keselarasan dengan sistem imbalan</strong> — percuma melarang sesuatu yang secara diam-diam justru
  diberi bonus.</li>
</ul>

<div class="warn-box">
  <strong>Peringatan penting.</strong> Enron punya kode etik setebal 64 halaman yang memenangkan penghargaan, dan
  enam kali masuk daftar perusahaan paling inovatif. Kode etik tanpa budaya dan penegakan hanyalah dokumen. Gunakan
  contoh ini bila diminta menilai efektivitas kode etik.
</div>`
    },
    {
      title: "Reporting dan whistleblowing",
      src: "CM5",
      body: `
<div class="term-box">
  <strong>Whistleblowing</strong> — pengungkapan oleh anggota organisasi atas praktik ilegal, tidak bermoral, atau
  tidak sah yang berada di bawah kendali atasan mereka, kepada pihak yang mampu bertindak. Dapat bersifat
  <em>internal</em> (ke dalam organisasi) atau <em>external</em> (ke regulator, media, LSM).
</div>

<p class="sub-h">Kapan whistleblowing dibenarkan secara moral?</p>

<p>Kriteria yang umum dipakai (dikembangkan dari Richard De George) — sebuah pengungkapan dibenarkan bila:</p>

<ol>
  <li>Praktik tersebut menimbulkan <strong>bahaya serius</strong> bagi pihak lain.</li>
  <li>Karyawan sudah <strong>melaporkan ke atasan langsung</strong> dan tidak memperoleh tanggapan memadai.</li>
  <li>Sudah <strong>menempuh saluran internal</strong> yang tersedia hingga habis.</li>
  <li>Ada <strong>bukti terdokumentasi</strong> yang meyakinkan bagi pengamat wajar.</li>
  <li>Ada <strong>alasan kuat meyakini pengungkapan akan mengubah keadaan</strong>, sepadan dengan risikonya.</li>
</ol>

<p class="sub-h">Dilema etis whistleblowing</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">ARGUMEN MENDUKUNG</div>
  <div class="gs-head gs-head--b">ARGUMEN MENENTANG</div>
  <div class="gs-cell gs-cell--a">Kewajiban mencegah bahaya pada publik lebih tinggi daripada loyalitas pada
  perusahaan.</div>
  <div class="gs-cell gs-cell--b">Karyawan punya kewajiban <em>loyalty</em> dan menjaga kerahasiaan perusahaan.</div>
  <div class="gs-cell gs-cell--a">Merupakan bentuk <em>moral courage</em> dan pelaksanaan hak kebebasan berpendapat.</div>
  <div class="gs-cell gs-cell--b">Dapat merusak reputasi dan pekerjaan rekan yang tidak bersalah bila tuduhannya
  keliru.</div>
  <div class="gs-cell gs-cell--a">Sering menjadi satu-satunya mekanisme koreksi ketika pengawasan internal gagal.</div>
  <div class="gs-cell gs-cell--b">Berpotensi disalahgunakan untuk motif pribadi atau balas dendam.</div>
</div>

<p>Karena itu perusahaan yang serius menyediakan <strong>whistleblowing hotline</strong> yang anonim, independen dari
lini manajemen, dengan <strong>jaminan perlindungan dari pembalasan (non-retaliation)</strong>. Tanpa perlindungan
itu, saluran pelaporan hanya jebakan.</p>

<div class="case-box">
  <strong>Kasus rujukan — Sherron Watkins (Enron).</strong>
  <p>Wakil presiden Enron yang pada Agustus 2001 mengirim memo kepada CEO Kenneth Lay memperingatkan bahwa perusahaan
  bisa "runtuh dalam gelombang skandal akuntansi". Ia menempuh saluran internal terlebih dahulu — memenuhi kriteria
  De George. Peringatannya diabaikan; Enron bangkrut beberapa bulan kemudian.</p>
  <p><strong>Poin analisis:</strong> kegagalan di sini bukan pada whistleblower, melainkan pada organisasi yang tidak
  punya mekanisme untuk <em>mendengar</em>. Hubungkan dengan CM4: budaya organisasi dan authority menekan tahap
  <em>moral behaviour</em>.</p>
</div>`
    },
    {
      title: "Struktur, budaya, dan pelatihan etika",
      src: "CM5",
      body: `
<p>Alat formal hanya bekerja bila ada orang dan struktur yang menjalankannya.</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Ethics officers</b><span>Pejabat yang bertanggung jawab mengoordinasi program etika.
  Efektif bila punya akses langsung ke dewan direksi dan independensi anggaran.</span></div>
  <div class="dbm-card"><b>Ethics committees</b><span>Komite lintas fungsi, idealnya di tingkat dewan, yang membahas
  dilema dan meninjau kebijakan.</span></div>
  <div class="dbm-card"><b>Ethics training</b><span>Pelatihan berbasis <em>kasus dan dilema nyata</em>, bukan ceramah
  aturan. Tujuannya melatih pengenalan isu (tahap 1 model CM4) dan moral imagination.</span></div>
  <div class="dbm-card"><b>Ethics consultants &amp; audit</b><span>Pihak eksternal untuk menilai program secara
  independen — mengurangi risiko penilaian diri yang bias.</span></div>
</div>

<p class="sub-h">Mengelola perubahan budaya</p>

<p>Crane &amp; Matten menekankan bahwa budaya <strong>tidak bisa diperintahkan</strong>. Perubahan budaya etis
memerlukan konsistensi jangka panjang antara apa yang dikatakan, apa yang diberi imbalan, dan apa yang dihukum.
Sinyal paling kuat datang dari <strong>tone at the top</strong> — perilaku pimpinan, bukan pernyataan pimpinan
(sambungkan langsung ke matriks ethical leadership di CM4).</p>`
    },
    {
      title: "Stakeholder engagement: konsultasi, dialog, kemitraan",
      src: "CM5",
      body: `
<p>Landasan teoretisnya adalah <strong>discourse ethics</strong> (CM3): keabsahan moral lahir dari proses dialog
yang setara dan bebas dominasi. Dalam praktik, keterlibatan stakeholder punya tingkat kedalaman berbeda:</p>

{{viz:stakeholderLadder}}

<div class="cascade">
  <div class="cascade-box"><b>1. Informing</b><span>Perusahaan memberi tahu keputusan yang sudah diambil. Komunikasi
  satu arah.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>2. Consultation</b><span>Perusahaan bertanya pendapat, tetapi tetap memutuskan sendiri.
  Umpan balik bersifat masukan.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>3. Dialogue</b><span>Pertukaran dua arah yang tulus; posisi perusahaan bisa berubah
  karena argumen pihak lain.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box cascade-box--hi"><b>4. Partnership</b><span>Berbagi pengambilan keputusan dan sumber daya
  untuk tujuan bersama. Stakeholder menjadi mitra, bukan objek.</span></div>
</div>

<div class="warn-box">
  <strong>Bahaya keterlibatan semu.</strong> Konsultasi yang hasilnya sudah ditentukan sebelumnya adalah bentuk
  <em>tokenism</em> — ia menyerap kritik tanpa mengubah apa pun, dan justru meruntuhkan kepercayaan lebih dalam
  daripada tidak berkonsultasi sama sekali. Saat menganalisis kasus, tanyakan: apakah ada bukti keputusan perusahaan
  <em>pernah berubah</em> karena masukan stakeholder?
</div>`
    },
    {
      title: "Social accounting, auditing, dan reporting",
      src: "CM5",
      body: `
<div class="term-box">
  <strong>Social accounting</strong> — proses mengumpulkan, menganalisis, dan mengomunikasikan informasi tentang
  dampak sosial dan lingkungan perusahaan kepada stakeholder. Mencakup tiga aktivitas: <em>accounting</em> (mencatat),
  <em>auditing</em> (memverifikasi), dan <em>reporting</em> (melaporkan).
</div>

<p>Mengapa perusahaan melakukannya? Motifnya beragam: tekanan stakeholder, kewajiban regulasi, manajemen risiko
reputasi, peningkatan proses internal, akses ke investor ESG — dan, secara jujur, juga <strong>manajemen
kesan</strong>.</p>

{{viz:socialAuditCycle}}

<p class="sub-h">Standar utama yang perlu kamu kenal</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>GRI Standards</b><span>Global Reporting Initiative — kerangka pelaporan keberlanjutan
  paling luas dipakai di dunia. Berbasis materialitas dan dampak.</span></div>
  <div class="dbm-card"><b>AA1000</b><span>AccountAbility — menekankan proses: <em>inclusivity</em> (melibatkan),
  <em>materiality</em> (relevan), <em>responsiveness</em> (menanggapi), <em>impact</em>.</span></div>
  <div class="dbm-card"><b>ISO 26000</b><span>Panduan tanggung jawab sosial. Bersifat <em>guidance</em>, bukan
  standar sertifikasi.</span></div>
  <div class="dbm-card"><b>SASB / ISSB &amp; TCFD</b><span>Berorientasi investor: mengukur isu keberlanjutan yang
  material secara finansial, termasuk risiko iklim.</span></div>
</div>

<p class="sub-h">Kualitas laporan: apa yang membedakan laporan serius dari brosur</p>

<ul>
  <li><strong>Completeness</strong> — mencakup seluruh dampak material, termasuk yang buruk.</li>
  <li><strong>Comparability</strong> — bisa dibandingkan antarwaktu dan antarperusahaan.</li>
  <li><strong>Accuracy &amp; verifiability</strong> — data bisa diperiksa ulang.</li>
  <li><strong>External assurance</strong> — diverifikasi pihak ketiga independen. Ini pembeda paling tajam.</li>
  <li><strong>Balance</strong> — memuat kegagalan dan target yang meleset, bukan hanya cerita sukses.</li>
</ul>

<div class="warn-box">
  <strong>Greenwashing.</strong> Praktik menyampaikan klaim lingkungan atau sosial yang menyesatkan — melebih-lebihkan,
  memilih data yang menguntungkan, mengalihkan perhatian dari dampak utama, atau memakai citra hijau tanpa substansi.
  Tanda peringatan: klaim tanpa angka, tanpa target berbatas waktu, tanpa verifikasi independen, dan laporan yang
  tidak memuat satu pun kegagalan.
</div>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM5:</strong></p>
<ul>
  <li>Compliance-based vs integrity-based approach (Paine) — bandingkan lengkap.</li>
  <li>Empat jenis codes of ethics + faktor yang membuatnya efektif atau gagal.</li>
  <li>Definisi whistleblowing + kriteria kapan ia dibenarkan secara moral.</li>
  <li>Tangga keterlibatan stakeholder: informing → consultation → dialogue → partnership.</li>
  <li>Social accounting: definisi, motif, standar (GRI, AA1000, ISO 26000), dan kriteria kualitas laporan.</li>
  <li>Greenwashing: definisi dan tanda-tandanya.</li>
</ul>`
},

/* ==========================================================
   CM6 — SHAREHOLDERS AND BUSINESS ETHICS
   ========================================================== */
{
  id: 6, ref: "CM6", session: 6,
  title: "Shareholders and Business Ethics",
  titleId: "Pemegang Saham dan Etika Bisnis",
  blurb: "Stakeholder pertama yang dibahas satu per satu. Fokusnya: tata kelola korporat, masalah keagenan, gaji eksekutif, etika pasar keuangan, dan bangkitnya investasi ESG.",
  objectives: [
    "Menjelaskan masalah keagenan antara pemegang saham dan manajemen.",
    "Membandingkan sistem tata kelola Anglo-American dan Continental European.",
    "Menganalisis isu etis remunerasi eksekutif dan pasar keuangan.",
    "Menjelaskan shareholder activism, SRI, dan investasi ESG."
  ],
  sections: [
    {
      title: "Pemegang saham sebagai stakeholder dan masalah keagenan",
      src: "CM6",
      body: `
<p>Pemegang saham punya posisi khusus: mereka <strong>pemilik</strong> perusahaan, tetapi tidak
<strong>mengendalikan</strong>nya. Pemisahan antara kepemilikan dan kendali inilah sumber persoalan etis bab ini.</p>

{{viz:agency}}

<div class="term-box">
  <strong>Agency problem.</strong> Pemegang saham (<em>principal</em>) mendelegasikan pengelolaan kepada manajemen
  (<em>agent</em>). Masalah muncul karena: (1) <strong>kepentingan berbeda</strong> — manajer mungkin mengejar
  ukuran perusahaan, prestise, atau bonus jangka pendek, bukan nilai jangka panjang pemilik;
  (2) <strong>asimetri informasi</strong> — manajer tahu jauh lebih banyak daripada pemegang saham.
  Biaya untuk mengatasinya disebut <em>agency cost</em>.
</div>

<p>Hak-hak dasar pemegang saham yang perlu dilindungi: hak memperoleh <strong>informasi</strong> yang benar dan tepat
waktu, hak <strong>memilih</strong> dewan dan memberi suara pada keputusan penting, hak atas <strong>bagian
keuntungan</strong>, dan hak atas <strong>perlakuan setara</strong> — termasuk perlindungan pemegang saham minoritas
dari pemegang saham pengendali.</p>

<p class="sub-h">Ketegangan utama: shareholder value vs stakeholder value</p>

<div class="gs-grid">
  <div class="gs-head gs-head--b">SHAREHOLDER VALUE MODEL</div>
  <div class="gs-head gs-head--a">STAKEHOLDER MODEL</div>
  <div class="gs-cell gs-cell--b">Tujuan perusahaan: memaksimalkan nilai bagi pemegang saham.</div>
  <div class="gs-cell gs-cell--a">Tujuan: menyeimbangkan klaim seluruh stakeholder yang sah.</div>
  <div class="gs-cell gs-cell--b">Manajer adalah agen pemilik; akuntabilitas tunggal dan jelas.</div>
  <div class="gs-cell gs-cell--a">Manajer adalah pengelola kepercayaan banyak pihak; akuntabilitas jamak.</div>
  <div class="gs-cell gs-cell--b"><strong>Kritik:</strong> mendorong orientasi jangka pendek dan mengalihkan biaya
  ke pihak yang tak bersuara.</div>
  <div class="gs-cell gs-cell--a"><strong>Kritik:</strong> tanpa prioritas yang jelas, manajer bisa membenarkan
  hampir apa pun.</div>
</div>`
    },
    {
      title: "Corporate governance: dua model besar",
      src: "CM6",
      body: `
<div class="term-box">
  <strong>Corporate governance</strong> — sistem aturan, praktik, dan proses yang mengarahkan dan mengendalikan
  perusahaan; mengatur hubungan hak dan kewajiban antara manajemen, dewan, pemegang saham, dan stakeholder lain.
</div>

{{viz:governanceCompare}}

<div class="gs-grid">
  <div class="gs-head gs-head--b">ANGLO-AMERICAN (outsider)</div>
  <div class="gs-head gs-head--a">CONTINENTAL EUROPEAN (insider)</div>
  <div class="gs-cell gs-cell--b">Kepemilikan <strong>tersebar</strong> di banyak investor kecil dan institusional.</div>
  <div class="gs-cell gs-cell--a">Kepemilikan <strong>terkonsentrasi</strong> pada bank, keluarga, negara, atau
  perusahaan lain.</div>
  <div class="gs-cell gs-cell--b">Struktur dewan <strong>satu tingkat</strong> (unitary board): eksekutif dan
  non-eksekutif duduk bersama.</div>
  <div class="gs-cell gs-cell--a">Struktur dewan <strong>dua tingkat</strong>: dewan pengawas (supervisory) terpisah
  dari dewan pelaksana (management).</div>
  <div class="gs-cell gs-cell--b">Pengendalian lewat <strong>pasar modal</strong> — harga saham, ancaman pengambilalihan.</div>
  <div class="gs-cell gs-cell--a">Pengendalian lewat <strong>relasi jangka panjang</strong> — bank, keluarga,
  serikat pekerja.</div>
  <div class="gs-cell gs-cell--b">Orientasi: nilai pemegang saham, jangka pendek hingga menengah.</div>
  <div class="gs-cell gs-cell--a">Orientasi: keseimbangan stakeholder, jangka panjang. Jerman mengenal
  <em>codetermination</em> — perwakilan pekerja di dewan pengawas.</div>
</div>

<p><strong>Indonesia</strong> menganut sistem <strong>dua tingkat</strong>: Dewan Komisaris (pengawas) dan Direksi
(pelaksana), sesuai UU Perseroan Terbatas — mirip model Kontinental. Namun kepemilikan yang terkonsentrasi pada
kelompok keluarga menimbulkan isu khas: perlindungan pemegang saham minoritas dan transaksi pihak berelasi
(<em>related-party transactions</em>).</p>`
    },
    {
      title: "Etika remunerasi eksekutif",
      src: "CM6",
      body: `
<p>Gaji eksekutif adalah salah satu isu etika bisnis yang paling terlihat publik. Pertanyaannya bukan "apakah
eksekutif boleh dibayar mahal", melainkan <strong>atas dasar apa besarannya dibenarkan</strong>.</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">ARGUMEN PEMBENAR</div>
  <div class="gs-head gs-head--b">ARGUMEN KRITIS</div>
  <div class="gs-cell gs-cell--a">Pasar bakat kompetitif — talenta langka harus dibayar setara.</div>
  <div class="gs-cell gs-cell--b">Rasio gaji CEO terhadap pekerja rata-rata melonjak drastis tanpa lonjakan kinerja
  sepadan.</div>
  <div class="gs-cell gs-cell--a">Menyelaraskan kepentingan manajer dengan pemilik lewat saham dan opsi.</div>
  <div class="gs-cell gs-cell--b">Justru mendorong <strong>manipulasi jangka pendek</strong> harga saham dan
  pengambilan risiko berlebihan.</div>
  <div class="gs-cell gs-cell--a">Kompensasi atas risiko dan tanggung jawab besar.</div>
  <div class="gs-cell gs-cell--b"><strong>Rewards for failure</strong> — pesangon besar tetap diterima meski kinerja
  buruk; risiko tidak benar-benar ditanggung.</div>
  <div class="gs-cell gs-cell--a">Ditetapkan komite remunerasi independen.</div>
  <div class="gs-cell gs-cell--b">Komite sering diisi sesama CEO dengan kepentingan serupa; muncul efek perbandingan
  yang saling menaikkan.</div>
</div>

<p><strong>Analisis etisnya:</strong> gunakan Rawls — apakah struktur gaji ini akan dipilih orang yang tidak tahu
akan menjadi CEO atau pekerja lini? Gunakan pula <em>ethics of justice</em>: apakah proses penetapannya adil
(<em>fair procedure</em>), dan apakah hasilnya adil (<em>fair outcome</em>)?</p>`
    },
    {
      title: "Etika di pasar keuangan",
      src: "CM6",
      body: `
<div class="dbm-grid">
  <div class="dbm-card dbm-card--clay">
    <b>Insider trading</b>
    <span>Memperdagangkan efek berdasarkan informasi material yang belum tersedia untuk publik. <strong>Mengapa
    salah?</strong> (1) Melanggar keadilan — sebagian pihak bermain dengan kartu terbuka; (2) merupakan
    penyalahgunaan informasi yang bukan miliknya (<em>misappropriation</em>); (3) menggerus kepercayaan pada
    pasar.</span>
  </div>
  <div class="dbm-card dbm-card--clay">
    <b>Market manipulation</b>
    <span>Menciptakan kesan palsu atas permintaan atau harga — <em>pump and dump</em>, <em>wash trading</em>,
    penyebaran rumor. Merusak fungsi utama pasar: penemuan harga yang jujur.</span>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Speculation &amp; derivatives</b>
    <span>Tidak otomatis tidak etis — derivatif punya fungsi sah melindungi risiko (<em>hedging</em>). Menjadi
    bermasalah ketika kompleksitasnya menyembunyikan risiko dari pihak yang menanggungnya, atau ketika spekulasi
    komoditas pangan menaikkan harga bagi yang paling miskin.</span>
  </div>
  <div class="dbm-card dbm-card--brass">
    <b>Creative accounting</b>
    <span>Memanfaatkan celah standar akuntansi untuk menyajikan gambaran yang menyesatkan meski secara teknis
    sah — contoh sempurna kuadran "legal tapi tidak etis" dari CM1.</span>
  </div>
</div>

<p class="sub-h">Pajak sebagai isu etis</p>

<div class="gs-grid">
  <div class="gs-head gs-head--b">TAX EVASION</div>
  <div class="gs-head gs-head--a">TAX AVOIDANCE</div>
  <div class="gs-cell gs-cell--b"><strong>Ilegal.</strong> Menyembunyikan penghasilan, memalsukan laporan.</div>
  <div class="gs-cell gs-cell--a"><strong>Legal.</strong> Menyusun struktur usaha untuk meminimalkan pajak —
  transfer pricing, pemindahan laba ke yurisdiksi pajak rendah.</div>
  <div class="gs-cell gs-cell--b">Jelas salah secara hukum dan etika.</div>
  <div class="gs-cell gs-cell--a"><strong>Inilah dilema etisnya.</strong> Sah, tetapi: perusahaan menikmati
  infrastruktur, pendidikan, dan penegakan hukum yang dibiayai pajak, lalu memindahkan bebannya ke pihak lain.
  Uji dengan maksim Kant 1: bagaimana jika semua perusahaan melakukannya?</div>
</div>`
    },
    {
      title: "Shareholder activism, SRI, dan ESG",
      src: "CM6",
      body: `
<p>Pemegang saham tidak selalu pasif. <strong>Shareholder activism</strong> adalah penggunaan hak kepemilikan untuk
memengaruhi perilaku perusahaan — lewat resolusi dalam RUPS, pemungutan suara, dialog dengan manajemen, atau kampanye
publik. Bentuk khususnya adalah <em>social shareholder activism</em>, ketika tuntutannya bersifat sosial atau
lingkungan.</p>

<div class="term-box">
  <strong>Socially Responsible Investment (SRI)</strong> — pendekatan investasi yang mempertimbangkan kriteria
  sosial, lingkungan, dan etika, bukan hanya imbal hasil finansial. Berkembang menjadi analisis
  <strong>ESG</strong> (Environmental, Social, Governance) yang kini arus utama di kalangan investor institusional.
</div>

{{viz:esgScreens}}

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card"><b>Negative screening</b><span>Mengeluarkan sektor tertentu dari portofolio: senjata,
  tembakau, judi, batu bara. Pendekatan tertua dan paling sederhana.</span></div>
  <div class="dbm-card"><b>Positive / best-in-class</b><span>Memilih perusahaan dengan kinerja ESG terbaik di
  sektornya, bukan mengeluarkan sektornya.</span></div>
  <div class="dbm-card"><b>Engagement &amp; impact</b><span>Tetap memegang saham justru untuk menekan perubahan dari
  dalam; atau berinvestasi pada usaha yang dampak positifnya terukur.</span></div>
</div>

<div class="warn-box">
  <strong>Kritik terhadap ESG yang perlu kamu tahu.</strong> (1) <strong>Inkonsistensi rating</strong> — lembaga
  pemeringkat berbeda memberi skor sangat berbeda untuk perusahaan yang sama. (2) <strong>Materialitas finansial vs
  dampak</strong> — ESG arus utama mengukur risiko keberlanjutan <em>terhadap perusahaan</em>, bukan dampak
  <em>perusahaan terhadap dunia</em>; keduanya sering dikacaukan (<em>double materiality</em>).
  (3) <strong>Greenwashing produk keuangan</strong> — dana yang dilabeli hijau tanpa perubahan portofolio nyata.
</div>

<p class="sub-h">Sustainability dan pemegang saham</p>

<p>Isu terakhir bab ini: apakah orientasi pasar modal kompatibel dengan keberlanjutan? Tekanan laporan kuartalan
mendorong <strong>short-termism</strong>, sementara isu keberlanjutan bersifat jangka sangat panjang. Beberapa
respons yang muncul: saham dengan hak suara ganda untuk pemegang jangka panjang, integrated reporting,
mandat <em>stewardship</em> bagi investor institusional, serta bentuk badan hukum baru seperti
<em>benefit corporation</em> yang secara hukum mengikat tujuan sosial ke dalam anggaran dasar.</p>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM6:</strong></p>
<ul>
  <li>Agency problem: definisi, dua penyebab (perbedaan kepentingan + asimetri informasi), agency cost.</li>
  <li>Perbandingan lengkap Anglo-American vs Continental European governance.</li>
  <li>Argumen pro dan kontra gaji eksekutif — jawab berimbang, lalu ambil posisi.</li>
  <li>Insider trading: definisi dan <strong>tiga alasan mengapa dianggap tidak etis</strong>.</li>
  <li>Tax avoidance vs tax evasion, dan mengapa avoidance tetap dipersoalkan secara etis.</li>
  <li>SRI/ESG: tiga strategi (negative, positive, engagement) + kritiknya.</li>
</ul>`
},

/* ==========================================================
   CM7 — EMPLOYEES AND BUSINESS ETHICS
   ========================================================== */
{
  id: 7, ref: "CM7", session: 8,
  title: "Employees and Business Ethics",
  titleId: "Karyawan dan Etika Bisnis",
  blurb: "Stakeholder yang paling bergantung pada perusahaan. Bab ini membahas hak dan kewajiban karyawan: diskriminasi, privasi, kondisi kerja, upah layak, dan dampak globalisasi pada tenaga kerja.",
  objectives: [
    "Menjelaskan hak dan kewajiban karyawan sebagai stakeholder.",
    "Menganalisis isu diskriminasi dan equal opportunity.",
    "Menilai batas privasi karyawan di tempat kerja.",
    "Menjelaskan isu kondisi kerja, upah layak, dan tenaga kerja global."
  ],
  sections: [
    {
      title: "Karyawan sebagai stakeholder: hak dan kewajiban",
      src: "CM7",
      body: `
<p>Karyawan adalah stakeholder dengan <strong>ketergantungan tertinggi</strong> pada perusahaan: pendapatan,
identitas, jaminan kesehatan, dan sebagian besar waktu hidupnya. Sekaligus, karyawan adalah stakeholder yang
posisi tawarnya paling timpang — terutama pekerja berketerampilan rendah.</p>

{{viz:rightsDuties}}

<p>Hubungan kerja bersifat <strong>dua arah</strong>. Ujian sering meminta kamu menyebutkan keduanya, jadi jangan
hanya menghafal hak.</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">HAK KARYAWAN</div>
  <div class="gs-head gs-head--b">KEWAJIBAN KARYAWAN</div>
  <div class="gs-cell gs-cell--a">Kebebasan dari diskriminasi; kesempatan setara.</div>
  <div class="gs-cell gs-cell--b">Mematuhi kontrak kerja dan menjalankan tugas dengan kompeten.</div>
  <div class="gs-cell gs-cell--a">Privasi dan perlakuan bermartabat.</div>
  <div class="gs-cell gs-cell--b">Menghindari <strong>conflict of interest</strong> — kepentingan pribadi tidak
  boleh menabrak kepentingan perusahaan.</div>
  <div class="gs-cell gs-cell--a">Tempat kerja yang sehat dan aman.</div>
  <div class="gs-cell gs-cell--b">Menjaga kerahasiaan informasi perusahaan yang sah.</div>
  <div class="gs-cell gs-cell--a">Upah yang adil dan jam kerja yang wajar.</div>
  <div class="gs-cell gs-cell--b">Tidak menyalahgunakan aset perusahaan (waktu, properti, data).</div>
  <div class="gs-cell gs-cell--a">Kebebasan berserikat dan berunding bersama.</div>
  <div class="gs-cell gs-cell--b">Loyalitas dalam batas wajar — <em>tidak</em> mencakup menutupi pelanggaran.</div>
  <div class="gs-cell gs-cell--a"><strong>Due process</strong> — prosedur yang adil sebelum sanksi atau pemutusan.</div>
  <div class="gs-cell gs-cell--b">Kejujuran dalam pelaporan dan klaim.</div>
</div>

<div class="key-box">
  <strong>Kunci ujian.</strong> Batas kewajiban <em>loyalty</em> adalah pertanyaan favorit. Loyalitas karyawan tidak
  bersifat absolut: ia berhenti ketika perusahaan meminta karyawan berpartisipasi dalam atau menutupi tindakan yang
  membahayakan pihak lain. Di titik itulah whistleblowing (CM5) menjadi dapat dibenarkan.
</div>`
    },
    {
      title: "Diskriminasi dan kesempatan setara",
      src: "CM7",
      body: `
<div class="term-box">
  <strong>Discrimination</strong> dalam konteks kerja terjadi ketika karyawan diperlakukan berbeda karena
  karakteristik yang <strong>tidak relevan dengan pekerjaannya</strong> — gender, ras, etnis, agama, usia,
  disabilitas, orientasi seksual, status pernikahan, atau kehamilan.
</div>

<p>Bedakan dua bentuknya, karena keduanya sering tertukar:</p>

<div class="dbm-grid">
  <div class="dbm-card dbm-card--clay">
    <b>Direct discrimination</b>
    <span>Perlakuan berbeda secara terang-terangan berdasarkan karakteristik terlarang. Contoh: lowongan yang
    menyebut batas usia atau jenis kelamin tanpa alasan pekerjaan yang sah.</span>
  </div>
  <div class="dbm-card dbm-card--clay">
    <b>Indirect discrimination</b>
    <span>Aturan yang tampak netral tetapi berdampak tidak proporsional pada kelompok tertentu. Contoh: syarat tinggi
    badan minimum untuk pekerjaan yang tidak memerlukannya, atau rapat wajib pukul 19.00 yang menyulitkan pekerja
    dengan tanggung jawab pengasuhan.</span>
  </div>
</div>

<p class="sub-h">Equal opportunity dan affirmative action</p>

<ul>
  <li><strong>Equal opportunity</strong> — semua pelamar dinilai dengan kriteria yang sama dan hanya berdasarkan
  kemampuan yang relevan. Ini prinsip minimum.</li>
  <li><strong>Affirmative action / positive action</strong> — langkah aktif memperbaiki ketimpangan struktural:
  pelatihan khusus, target keberagaman, rekrutmen yang menjangkau kelompok kurang terwakili.</li>
</ul>

<div class="gs-grid">
  <div class="gs-head gs-head--a">MENDUKUNG AFFIRMATIVE ACTION</div>
  <div class="gs-head gs-head--b">MENENTANG</div>
  <div class="gs-cell gs-cell--a">Memperbaiki ketidakadilan historis yang efeknya masih berlanjut.</div>
  <div class="gs-cell gs-cell--b"><strong>Reverse discrimination</strong> — individu dari kelompok mayoritas dirugikan
  atas hal yang bukan perbuatannya.</div>
  <div class="gs-cell gs-cell--a">Kesempatan formal yang setara tidak cukup bila titik berangkatnya tidak setara
  (argumen Rawls).</div>
  <div class="gs-cell gs-cell--b">Melanggar prinsip meritokrasi — seharusnya kemampuan yang menentukan.</div>
  <div class="gs-cell gs-cell--a">Keberagaman terbukti meningkatkan kualitas keputusan dan inovasi.</div>
  <div class="gs-cell gs-cell--b">Dapat menstigma penerima manfaat sebagai "bukan dipilih karena kemampuan".</div>
</div>

<p><strong>Isu lanjutan:</strong> <em>gender pay gap</em>, <em>glass ceiling</em> (hambatan tak terlihat pada
promosi ke jenjang atas), pelecehan seksual di tempat kerja, dan diskriminasi terhadap pekerja penyandang
disabilitas.</p>`
    },
    {
      title: "Privasi karyawan",
      src: "CM7",
      body: `
<p>Ketegangan intinya: perusahaan punya kepentingan sah memantau produktivitas, keamanan, dan kepatuhan; karyawan
punya hak atas ruang privat. Pertanyaannya di mana batasnya.</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Surveillance di tempat kerja</b><span>CCTV, pemantauan email dan chat, pelacakan waktu
  layar, penghitungan langkah di gudang. Semakin banyak pekerjaan dipantau algoritma.</span></div>
  <div class="dbm-card"><b>Pemantauan di luar jam kerja</b><span>Memeriksa media sosial pribadi, atau menuntut
  karyawan selalu tersedia. Muncul konsep <em>right to disconnect</em>.</span></div>
  <div class="dbm-card"><b>Testing</b><span>Tes narkoba, tes kesehatan, tes psikologi, bahkan tes genetik. Isu:
  relevansi dengan pekerjaan dan potensi diskriminasi.</span></div>
  <div class="dbm-card"><b>Data pribadi karyawan</b><span>Pengumpulan, penyimpanan, dan penggunaan data HR. Di
  Indonesia diatur UU Perlindungan Data Pribadi.</span></div>
</div>

<p class="sub-h">Empat uji kelayakan pemantauan</p>

<ol>
  <li><strong>Justification</strong> — apakah ada kepentingan bisnis yang sah dan serius?</li>
  <li><strong>Proportionality</strong> — apakah tingkat pemantauan sepadan dengan risiko yang ditangani, atau
  berlebihan?</li>
  <li><strong>Transparency</strong> — apakah karyawan tahu apa yang dipantau, bagaimana, dan untuk apa? Pemantauan
  rahasia hampir selalu bermasalah.</li>
  <li><strong>Consent &amp; recourse</strong> — apakah persetujuannya bermakna (mengingat posisi tawar timpang), dan
  adakah saluran keberatan?</li>
</ol>

<div class="warn-box">
  <strong>Perhatikan asimetri kuasa.</strong> "Persetujuan" karyawan atas pemantauan tidak setara dengan persetujuan
  bebas — menolak bisa berarti kehilangan pekerjaan. Karena itu argumen "mereka sudah setuju di kontrak" lemah secara
  etis. Kaitkan dengan maksim Kant 2: apakah karyawan diperlakukan sebagai tujuan, atau semata alat produksi yang
  dioptimalkan?
</div>`
    },
    {
      title: "Kondisi kerja: keselamatan, upah, jam kerja",
      src: "CM7",
      body: `
<p class="sub-h">Health and safety</p>

<p>Hak atas tempat kerja yang aman termasuk hak paling mendasar dan paling sedikit diperdebatkan secara prinsip —
namun paling sering dilanggar dalam praktik, terutama di rantai pasok global.</p>

<div class="case-box">
  <strong>Kasus rujukan — Rana Plaza, Bangladesh (2013).</strong>
  <p>Gedung delapan lantai berisi pabrik garmen runtuh dan menewaskan lebih dari 1.100 pekerja. Retakan struktural
  sudah terlihat sehari sebelumnya; toko dan bank di lantai bawah tutup, tetapi para pekerja garmen diperintahkan
  tetap masuk. Pabrik-pabrik itu memasok banyak merek global.</p>
  <p><strong>Poin analisis:</strong> kasus ini menghubungkan CM7 dengan CM9 (tanggung jawab rantai pasok) dan CM2
  (batas tanggung jawab korporat). Merek yang memesan tidak memiliki gedung itu — tetapi tekanan harga dan tenggat
  yang mereka terapkan ikut membentuk kondisi yang menyebabkan tragedi. Hasilnya adalah <em>Accord on Fire and
  Building Safety</em>, perjanjian mengikat antara merek dan serikat pekerja — contoh nyata pergeseran dari
  kode etik sukarela ke komitmen yang dapat ditegakkan.</p>
</div>

<p class="sub-h">Living wage vs minimum wage</p>

{{viz:livingWage}}

<div class="term-box">
  <strong>Minimum wage</strong> adalah batas bawah <em>legal</em> yang ditetapkan pemerintah.
  <strong>Living wage</strong> adalah tingkat upah yang cukup untuk memenuhi kebutuhan dasar pekerja dan
  keluarganya — pangan, tempat tinggal, kesehatan, pendidikan, dan sedikit tabungan — di lokasi tersebut.
  Di banyak negara, upah minimum berada <em>di bawah</em> upah layak. Membayar upah minimum sepenuhnya legal,
  tetapi tetap bisa dipersoalkan secara etis: kembali ke kuadran "legal tapi tidak etis" dari CM1.
</div>

<p class="sub-h">Jam kerja dan kebebasan berserikat</p>

<ul>
  <li><strong>Working hours</strong> — lembur berlebihan, khususnya lembur "sukarela" yang secara praktis wajib
  karena upah pokok terlalu rendah untuk hidup. Isu terkait: <em>karoshi</em> (kematian akibat kerja berlebih) dan
  kesehatan mental.</li>
  <li><strong>Freedom of association</strong> — hak berserikat dan berunding bersama adalah standar inti ILO.
  Praktik menghalangi serikat (union-busting) melanggar hak yang diakui universal, meski di beberapa yurisdiksi
  tidak dilarang tegas.</li>
  <li><strong>Due process</strong> — prosedur adil sebelum sanksi, mutasi, atau PHK: pemberitahuan, kesempatan
  membela diri, dan mekanisme banding.</li>
</ul>`
    },
    {
      title: "Globalisasi, sustainability, dan masa depan kerja",
      src: "CM7",
      body: `
<p class="sub-h">Globalisasi tenaga kerja</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Migrant labour</b><span>Pekerja migran rentan: paspor ditahan, biaya perekrutan yang
  menjerat utang, tidak ada perlindungan hukum lokal. Bentuk ekstremnya adalah kerja paksa dan perdagangan orang.</span></div>
  <div class="dbm-card"><b>Offshoring &amp; outsourcing</b><span>Memindahkan pekerjaan ke negara berbiaya rendah.
  Isu etis muncul di kedua ujung: hilangnya pekerjaan di negara asal, dan standar kerja di negara tujuan.</span></div>
  <div class="dbm-card"><b>Race to the bottom</b><span>Kekhawatiran bahwa persaingan menarik investasi mendorong
  negara menurunkan standar perlindungan pekerja.</span></div>
  <div class="dbm-card"><b>Gig economy</b><span>Pekerja platform diklasifikasikan sebagai mitra independen, sehingga
  di luar jangkauan hak ketenagakerjaan — meski tingkat kendali platform atasnya menyerupai hubungan kerja. Isu
  besar di Indonesia bagi pengemudi dan kurir aplikasi.</span></div>
</div>

<p class="sub-h">Sustainability dan karyawan</p>

<ul>
  <li><strong>Downsizing</strong> — PHK bisa dibenarkan bila diperlukan untuk kelangsungan usaha, tetapi
  <em>caranya</em> dinilai secara etis: pemberitahuan dini, kriteria yang transparan, pesangon yang layak, bantuan
  penempatan kembali, dan tidak dilakukan saat perusahaan membagikan bonus besar.</li>
  <li><strong>Work-life balance</strong> — beban kerja, fleksibilitas, dan kesehatan mental sebagai bagian dari
  dimensi <em>social</em> pada triple bottom line.</li>
  <li><strong>Just transition</strong> — ketika perusahaan beralih dari energi fosil ke energi bersih, pekerja
  sektor lama tidak boleh ditinggalkan. Keadilan transisi adalah pertemuan langsung antara pilar lingkungan dan
  pilar sosial.</li>
  <li><strong>Otomasi dan AI</strong> — pertanyaan etis tentang siapa menanggung biaya perpindahan pekerjaan,
  dan kewajiban perusahaan untuk melatih ulang (<em>reskilling</em>).</li>
</ul>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM7:</strong></p>
<ul>
  <li>Daftar hak <strong>dan</strong> kewajiban karyawan — sebutkan keduanya.</li>
  <li>Direct vs indirect discrimination dengan contoh; pro-kontra affirmative action.</li>
  <li>Privasi: empat uji kelayakan pemantauan + argumen asimetri kuasa.</li>
  <li>Living wage vs minimum wage — definisi dan mengapa selisihnya jadi isu etis.</li>
  <li>Kasus Rana Plaza sebagai penghubung tanggung jawab rantai pasok.</li>
  <li>Batas kewajiban loyalitas dan kaitannya dengan whistleblowing.</li>
</ul>`
},

/* ==========================================================
   CM8 — CONSUMERS AND BUSINESS ETHICS
   ========================================================== */
{
  id: 8, ref: "CM8", session: 9,
  title: "Consumers and Business Ethics",
  titleId: "Konsumen dan Etika Bisnis",
  blurb: "Etika pemasaran secara menyeluruh: keamanan produk, iklan yang menyesatkan, penetapan harga, privasi data, konsumen rentan, dan konsumsi berkelanjutan.",
  objectives: [
    "Menjelaskan hak-hak konsumen dan dasar moralnya.",
    "Menganalisis isu keamanan produk dan tanggung jawab produsen.",
    "Menilai etika komunikasi pemasaran dan penetapan harga.",
    "Menjelaskan isu privasi data dan konsumsi berkelanjutan."
  ],
  sections: [
    {
      title: "Konsumen sebagai stakeholder dan hak konsumen",
      src: "CM8",
      body: `
<p>Konsumen adalah stakeholder yang paling banyak berinteraksi dengan perusahaan, tetapi paling sedikit informasinya.
Sumber persoalan etisnya adalah <strong>asimetri informasi</strong>: penjual selalu tahu lebih banyak tentang produk
daripada pembeli.</p>

{{viz:consumerRights}}

<p>Kerangka klasiknya adalah <strong>empat hak konsumen</strong> yang dirumuskan Presiden John F. Kennedy (1962),
kemudian diperluas menjadi delapan oleh gerakan konsumen internasional:</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Right to safety</b><span>Perlindungan dari produk yang membahayakan kesehatan atau
  keselamatan.</span></div>
  <div class="dbm-card"><b>Right to be informed</b><span>Perlindungan dari informasi yang menipu dan hak atas fakta
  yang dibutuhkan untuk memilih.</span></div>
  <div class="dbm-card"><b>Right to choose</b><span>Akses pada beragam produk dengan harga kompetitif — terkait
  langsung dengan isu monopoli di CM9.</span></div>
  <div class="dbm-card"><b>Right to be heard</b><span>Kepentingan konsumen diperhatikan dalam kebijakan, dan ada
  mekanisme keluhan yang berfungsi.</span></div>
</div>

<p>Perluasannya mencakup hak atas <em>redress</em> (ganti rugi), <em>consumer education</em>, <em>basic needs</em>,
dan <em>healthy environment</em>. Di Indonesia, hak-hak ini dijamin UU No. 8/1999 tentang Perlindungan Konsumen.</p>

<div class="term-box">
  <strong>Consumer sovereignty</strong> — gagasan bahwa konsumen berdaulat: pilihan mereka yang menentukan apa yang
  diproduksi. Crane &amp; Matten mempertanyakan asumsi ini, karena kedaulatan hanya nyata bila terpenuhi tiga
  syarat: <em>capability</em> (konsumen mampu menilai), <em>information</em> (tersedia dan dapat dipahami), dan
  <em>choice</em> (ada alternatif nyata). Bila salah satu tidak terpenuhi — misalnya pada anak-anak, lansia, atau
  pasar yang dikuasai segelintir pemain — argumen "konsumen kan memilih sendiri" kehilangan kekuatannya.
</div>`
    },
    {
      title: "Keamanan produk dan tanggung jawab produsen",
      src: "CM8",
      body: `
<p>Sejauh mana produsen bertanggung jawab atas bahaya produknya? Ada tiga standar yang semakin ketat:</p>

<div class="cascade">
  <div class="cascade-box"><b>1. Caveat emptor</b><span>"Let the buyer beware." Risiko ada pada pembeli; kewajiban
  penjual hanya tidak berbohong secara aktif. Standar historis yang kini ditinggalkan.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>2. Due care</b><span>Produsen wajib mengambil langkah wajar untuk mencegah bahaya —
  dalam desain, produksi, pengujian, dan pemberian peringatan. Tanggung jawab muncul bila ia lalai.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box cascade-box--hi"><b>3. Strict liability</b><span>Produsen bertanggung jawab atas cacat
  produk <em>meskipun tidak lalai</em>. Alasannya: produsen paling mampu menanggung dan menyebarkan risiko, serta
  paling mampu mencegahnya.</span></div>
</div>

<p><strong>Kewajiban turunan yang penting:</strong> memberi peringatan yang memadai, melakukan
<strong>product recall</strong> secara cepat dan proaktif ketika cacat ditemukan, dan tidak menjual produk yang
sudah ditarik di satu negara ke negara lain yang regulasinya lebih longgar (<em>dumping</em> produk berbahaya).</p>

<div class="case-box">
  <strong>Kasus rujukan — Boeing 737 MAX (2018–2019).</strong>
  <p>Dua kecelakaan — Lion Air JT610 di Indonesia dan Ethiopian Airlines ET302 — menewaskan 346 orang. Penyebab
  utamanya terkait sistem MCAS yang dapat mendorong hidung pesawat ke bawah berdasarkan satu sensor tunggal, dan
  yang keberadaannya tidak dijelaskan memadai dalam manual maupun pelatihan pilot.</p>
  <p><strong>Analisis:</strong> gunakan <em>due care</em> — apakah pengujian dan pengungkapan sudah wajar? Gunakan
  CM4 — tekanan biaya dan jadwal terhadap Airbus membentuk konteks keputusan; sertifikasi yang sebagian
  didelegasikan ke produsen sendiri menciptakan konflik kepentingan struktural. Kasus ini juga menyentuh CM11:
  bagaimana bila regulator terlalu bergantung pada pihak yang diaturnya (<em>regulatory capture</em>)?</p>
</div>`
    },
    {
      title: "Etika komunikasi pemasaran",
      src: "CM8",
      body: `
{{viz:marketingMix}}

<p>Isu etis muncul di setiap unsur bauran pemasaran. Untuk komunikasi, yang utama:</p>

<div class="dbm-grid">
  <div class="dbm-card dbm-card--clay"><b>Deception</b><span>Klaim palsu, penghilangan informasi material, atau
  penyajian yang menciptakan kesan keliru meski secara harfiah benar. <em>Half-truth</em> tetap menyesatkan.</span></div>
  <div class="dbm-card dbm-card--brass"><b>Puffery</b><span>Pujian berlebihan yang tidak dimaksudkan dipercaya
  harfiah ("kopi terenak di dunia"). Umumnya dianggap sah — tetapi batasnya kabur ketika menyangkut klaim
  kesehatan.</span></div>
  <div class="dbm-card dbm-card--clay"><b>Iklan untuk anak</b><span>Anak belum mampu mengenali maksud persuasif
  iklan, sehingga syarat <em>capability</em> pada consumer sovereignty tidak terpenuhi. Banyak negara membatasi
  iklan makanan tinggi gula, garam, dan lemak untuk anak.</span></div>
  <div class="dbm-card dbm-card--brass"><b>Native advertising &amp; influencer</b><span>Konten berbayar yang tampak
  seperti konten independen. Isu intinya <strong>pengungkapan</strong>: konsumen berhak tahu bahwa yang mereka baca
  adalah iklan.</span></div>
  <div class="dbm-card"><b>Product placement</b><span>Penempatan produk dalam film, game, atau siaran tanpa
  ditandai jelas sebagai iklan.</span></div>
  <div class="dbm-card"><b>Greenwashing produk</b><span>Klaim "ramah lingkungan", "alami", atau "dapat didaur ulang"
  tanpa dasar terverifikasi — menghubungkan kembali ke CM5.</span></div>
</div>

<p class="sub-h">Etika penetapan harga</p>

<ul>
  <li><strong>Price fixing</strong> — kesepakatan antarpesaing untuk menyeragamkan harga. Ilegal di hampir semua
  yurisdiksi dan jelas tidak etis (dibahas lanjut di CM9).</li>
  <li><strong>Predatory pricing</strong> — menetapkan harga di bawah biaya untuk mematikan pesaing, lalu menaikkan
  harga setelah pasar dikuasai. Merugikan konsumen dalam jangka panjang meski menguntungkan sesaat.</li>
  <li><strong>Price gouging</strong> — menaikkan harga secara ekstrem saat darurat, ketika konsumen tidak punya
  pilihan. Contoh: harga masker, oksigen, dan obat pada puncak pandemi.</li>
  <li><strong>Deceptive pricing</strong> — harga "diskon" dari harga acuan yang tidak pernah benar-benar berlaku;
  <em>drip pricing</em> yang memunculkan biaya tambahan di akhir proses pembelian.</li>
  <li><strong>Dynamic &amp; personalized pricing</strong> — harga berbeda per orang berdasarkan data perilaku.
  Efisien secara ekonomi, tetapi mempersoalkan keadilan dan transparansi.</li>
</ul>`
    },
    {
      title: "Privasi konsumen dan data",
      src: "CM8",
      body: `
<p>Model bisnis digital menjadikan data konsumen sebagai komoditas utama. Ini memunculkan isu etis yang belum ada
saat kerangka hak konsumen klasik dirumuskan.</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Pengumpulan berlebihan</b><span>Aplikasi meminta izin yang jauh melampaui fungsinya.
  Prinsip yang seharusnya berlaku: <em>data minimisation</em>.</span></div>
  <div class="dbm-card"><b>Consent yang tidak bermakna</b><span>Persetujuan lewat kotak centang atas dokumen
  puluhan halaman bukanlah persetujuan yang terinformasi. Ditambah <em>dark patterns</em> — desain antarmuka yang
  mengarahkan pengguna menyetujui tanpa sadar.</span></div>
  <div class="dbm-card"><b>Penggunaan sekunder</b><span>Data yang dikumpulkan untuk satu tujuan dipakai atau dijual
  untuk tujuan lain yang tidak pernah disetujui.</span></div>
  <div class="dbm-card"><b>Profiling &amp; manipulasi</b><span>Menargetkan iklan berdasarkan kerentanan psikologis —
  misalnya menyasar orang yang sedang berjudi atau berutang.</span></div>
</div>

<div class="case-box">
  <strong>Kasus rujukan — Cambridge Analytica (2018).</strong>
  <p>Data puluhan juta pengguna Facebook diperoleh melalui kuis kepribadian, lalu dipakai membuat profil psikologis
  untuk penargetan pesan politik. Sebagian besar pemilik data tidak pernah menggunakan aplikasi tersebut — data
  mereka ikut terambil melalui jaringan pertemanan.</p>
  <p><strong>Analisis:</strong> ini pelanggaran maksim Kant 2 dalam bentuk paling murni — orang diperlakukan semata
  sebagai sarana memenangkan pemilu. Kaitkan juga dengan CM2 <em>extended corporate citizenship</em>: perusahaan
  teknologi mengelola hak politik warga.</p>
</div>

<p><strong>Kerangka hukum:</strong> GDPR di Uni Eropa memperkenalkan hak akses, koreksi, penghapusan, dan
portabilitas data. Indonesia memiliki <strong>UU No. 27/2022 tentang Perlindungan Data Pribadi</strong> dengan
prinsip serupa. Ingat pelajaran CM1: kepatuhan hukum adalah lantai minimum, bukan batas atas perilaku etis.</p>`
    },
    {
      title: "Konsumen rentan, BOP, dan konsumsi berkelanjutan",
      src: "CM8",
      body: `
<p class="sub-h">Vulnerable consumers</p>

<p>Konsumen rentan adalah mereka yang kemampuannya memilih secara bebas dan terinformasi berkurang: anak-anak,
lansia, penyandang disabilitas kognitif, orang dengan literasi rendah, orang dalam kondisi darurat atau
ketergantungan. Menargetkan kerentanan secara sengaja adalah bentuk eksploitasi.</p>

<div class="case-box">
  <strong>Dua kasus klasik.</strong>
  <p><strong>Nestlé dan susu formula bayi (1970-an).</strong> Pemasaran agresif susu formula di negara berkembang —
  termasuk sampel gratis dan tenaga penjual berseragam perawat — mendorong ibu berhenti menyusui. Di lingkungan
  tanpa air bersih, susu formula justru meningkatkan angka kematian bayi. Memicu boikot global dan lahirnya
  <em>WHO International Code of Marketing of Breast-milk Substitutes</em>.</p>
  <p><strong>Purdue Pharma dan OxyContin.</strong> Pemasaran opioid dengan klaim risiko kecanduan yang diremehkan,
  menyasar dokter dan pasien nyeri kronis. Berkontribusi pada krisis opioid di Amerika Serikat dengan ratusan ribu
  kematian.</p>
</div>

<p class="sub-h">Bottom of the Pyramid (BOP)</p>

{{viz:bopPyramid}}

<p>Gagasan C.K. Prahalad: miliaran orang berpendapatan rendah adalah pasar yang selama ini diabaikan, dan melayani
mereka bisa menguntungkan sekaligus mengurangi kemiskinan.</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">JANJI BOP</div>
  <div class="gs-head gs-head--b">KRITIK BOP</div>
  <div class="gs-cell gs-cell--a">Akses pada produk dan layanan yang sebelumnya tidak terjangkau.</div>
  <div class="gs-cell gs-cell--b">Berisiko menjadi eksploitasi terhadap kelompok paling rentan
  (<em>poverty penalty</em>: yang miskin membayar lebih mahal per satuan).</div>
  <div class="gs-cell gs-cell--a">Mendorong inovasi produk berbiaya rendah yang bermanfaat luas.</div>
  <div class="gs-cell gs-cell--b">Dapat mendorong konsumsi yang tidak dibutuhkan atau menjerat utang, misalnya
  lewat kredit mikro berbunga tinggi.</div>
  <div class="gs-cell gs-cell--a">Memandang kelompok miskin sebagai produsen dan mitra, bukan objek amal.</div>
  <div class="gs-cell gs-cell--b">Tanpa keterlibatan komunitas, program BOP hanya memindahkan model konsumsi Barat.</div>
</div>

<p class="sub-h">Sustainable consumption</p>

<p>Pertanyaan yang paling menantang di bab ini: perusahaan hidup dari mendorong orang membeli lebih banyak,
sementara keberlanjutan menuntut konsumsi total menurun. Isu-isunya:</p>

<ul>
  <li><strong>Planned obsolescence</strong> — produk dirancang agar cepat usang atau sulit diperbaiki.
  Lawannya: gerakan <em>right to repair</em>.</li>
  <li><strong>Fast fashion</strong> — siklus produksi sangat cepat dengan dampak air, kimia, dan limbah tekstil besar.</li>
  <li><strong>Attitude–behaviour gap</strong> — konsumen menyatakan peduli lingkungan tetapi tetap membeli
  berdasarkan harga dan kenyamanan. Karena itu mengalihkan seluruh tanggung jawab kepada "pilihan konsumen"
  adalah pengalihan tanggung jawab yang tidak jujur.</li>
  <li><strong>Model alternatif</strong> — ekonomi berbagi, produk sebagai layanan, dan desain untuk daur ulang
  (bersambung ke CM9).</li>
</ul>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM8:</strong></p>
<ul>
  <li>Empat hak konsumen Kennedy + tiga syarat consumer sovereignty.</li>
  <li>Caveat emptor → due care → strict liability, dengan contoh masing-masing.</li>
  <li>Bentuk-bentuk isu etis dalam iklan dan penetapan harga — hafalkan istilahnya.</li>
  <li>Isu privasi data: pengumpulan berlebihan, consent semu, penggunaan sekunder, profiling.</li>
  <li>Vulnerable consumers + kasus Nestlé.</li>
  <li>BOP: janji dan kritiknya; attitude–behaviour gap dalam konsumsi berkelanjutan.</li>
</ul>`
},

/* ==========================================================
   CM9 — SUPPLIERS, COMPETITORS, AND BUSINESS ETHICS
   ========================================================== */
{
  id: 9, ref: "CM9", session: 10,
  title: "Suppliers, Competitors, and Business Ethics",
  titleId: "Pemasok, Pesaing, dan Etika Bisnis",
  blurb: "Etika hubungan horizontal: suap dan korupsi, penyalahgunaan kekuasaan atas pemasok, perilaku antipersaingan, tanggung jawab rantai pasok yang diperluas, dan ekonomi sirkular.",
  objectives: [
    "Menjelaskan isu etis dalam hubungan dengan pemasok.",
    "Menganalisis suap, korupsi, dan pembayaran fasilitasi.",
    "Menjelaskan perilaku antipersaingan dan etika intelijen kompetitif.",
    "Menjelaskan extended responsibility, fair trade, dan circular economy."
  ],
  sections: [
    {
      title: "Pemasok dan pesaing sebagai stakeholder",
      src: "CM9",
      body: `
<p>Pemasok dan pesaing sering diabaikan dalam analisis stakeholder, padahal justru di sinilah banyak dilema etis
paling praktis dihadapi manajer sehari-hari — terutama di fungsi pembelian dan penjualan.</p>

<p><strong>Isu utama dengan pemasok:</strong></p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Misuse of power</b><span>Pembeli besar menekan pemasok kecil: menuntut potongan harga
  sepihak, mengubah pesanan mendadak, atau memaksa syarat yang merugikan.</span></div>
  <div class="dbm-card"><b>Late payment</b><span>Menunda pembayaran untuk memperbaiki arus kas sendiri — memindahkan
  beban modal kerja ke pihak yang paling tidak mampu menanggungnya. Legal, tetapi bermasalah secara etis.</span></div>
  <div class="dbm-card"><b>Negotiation ethics</b><span>Batas antara taktik negosiasi yang sah dan penipuan:
  melebih-lebihkan alternatif yang dimiliki, menyembunyikan informasi material, atau memberi janji palsu.</span></div>
  <div class="dbm-card"><b>Loyalty &amp; conflict of interest</b><span>Hubungan pribadi, hadiah, dan jamuan yang
  memengaruhi keputusan pembelian secara tidak wajar.</span></div>
</div>

<div class="key-box">
  <strong>Pertanyaan penuntun.</strong> Dalam hubungan pemasok, isu etis hampir selalu berakar pada
  <strong>ketimpangan kekuasaan</strong>. Ketika menganalisis, tanyakan: siapa yang bisa pergi dari meja perundingan
  tanpa kehilangan besar? Pihak yang tidak bisa pergi adalah pihak yang rentan dieksploitasi — dan di situlah
  kewajiban etis pihak yang lebih kuat muncul.
</div>`
    },
    {
      title: "Suap dan korupsi",
      src: "CM9",
      body: `
<div class="term-box">
  <strong>Bribery</strong> — menawarkan, menjanjikan, memberi, menerima, atau meminta keuntungan sebagai imbalan
  atas tindakan yang <em>ilegal, tidak etis, atau melanggar kepercayaan</em>. <strong>Corruption</strong> lebih luas:
  penyalahgunaan kekuasaan yang dipercayakan untuk keuntungan pribadi.
</div>

<p><strong>Mengapa suap tidak etis?</strong> Susun jawabanmu dengan teori CM3 agar tidak sekadar normatif:</p>

<ul>
  <li><strong>Utilitarian:</strong> merusak alokasi sumber daya — kontrak jatuh pada penyuap terbaik, bukan penawar
  terbaik. Biaya ditanggung publik lewat proyek berkualitas rendah dan harga lebih mahal.</li>
  <li><strong>Kant maksim 1:</strong> tidak dapat diuniversalkan — bila semua menyuap, sistemnya runtuh dan suap
  kehilangan gunanya. Suap secara inheren mensyaratkan orang lain <em>tidak</em> melakukannya.</li>
  <li><strong>Ethics of justice:</strong> melanggar kesetaraan kesempatan; pemain kecil tersingkir.</li>
  <li><strong>Ciri kunci:</strong> suap butuh kerahasiaan. Uji sederhana yang bisa kamu pakai —
  <em>apakah kamu bersedia praktik ini diberitakan di media besok pagi?</em></li>
</ul>

<p class="sub-h">Wilayah abu-abu: facilitation payments dan gift-giving</p>

<div class="gs-grid">
  <div class="gs-head gs-head--b">FACILITATION PAYMENT</div>
  <div class="gs-head gs-head--a">GIFT / HOSPITALITY</div>
  <div class="gs-cell gs-cell--b">Pembayaran kecil untuk mempercepat layanan rutin yang <em>memang menjadi hak</em>
  pembayar — misalnya mempercepat izin yang sudah memenuhi syarat.</div>
  <div class="gs-cell gs-cell--a">Pemberian sebagai bagian dari relasi bisnis dan norma budaya.</div>
  <div class="gs-cell gs-cell--b">Diizinkan bersyarat oleh <strong>US FCPA</strong>, tetapi <strong>dilarang</strong>
  oleh <strong>UK Bribery Act</strong> dan hukum Indonesia.</div>
  <div class="gs-cell gs-cell--a">Menjadi suap ketika: nilainya besar, waktunya berdekatan dengan keputusan, bersifat
  rahasia, atau menciptakan rasa berutang budi.</div>
</div>

<p><strong>Uji praktis untuk hadiah:</strong> (1) <em>Nilai</em> — wajar dan proporsional? (2) <em>Waktu</em> —
apakah sedang ada tender atau keputusan berjalan? (3) <em>Transparansi</em> — apakah dicatat dan diketahui atasan?
(4) <em>Timbal balik</em> — apakah menciptakan ekspektasi imbalan? (5) <em>Norma yang berlaku</em> — apakah sesuai
kebijakan kedua organisasi?</p>

<p class="sub-h">Kerangka antikorupsi yang perlu dikenal</p>

<ul>
  <li><strong>US Foreign Corrupt Practices Act (FCPA)</strong> — melarang penyuapan pejabat asing; berlaku
  ekstrateritorial.</li>
  <li><strong>UK Bribery Act 2010</strong> — lebih ketat; mencakup suap sektor swasta dan
  <em>failure to prevent bribery</em> sebagai delik korporasi tersendiri.</li>
  <li><strong>OECD Anti-Bribery Convention</strong> dan <strong>UN Convention against Corruption (UNCAC)</strong>.</li>
  <li><strong>Transparency International</strong> — Corruption Perceptions Index sebagai rujukan risiko negara.</li>
  <li><strong>Indonesia</strong> — UU Tipikor dan peran KPK; penting untuk analisis kasus lokal.</li>
</ul>`
    },
    {
      title: "Etika terhadap pesaing",
      src: "CM9",
      body: `
<p class="sub-h">Intelijen kompetitif vs spionase</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">SAH — competitive intelligence</div>
  <div class="gs-head gs-head--b">TIDAK SAH — industrial espionage</div>
  <div class="gs-cell gs-cell--a">Menganalisis laporan tahunan, paten, iklan, dan siaran pers.</div>
  <div class="gs-cell gs-cell--b">Meretas sistem, mencuri dokumen, menyadap komunikasi.</div>
  <div class="gs-cell gs-cell--a">Riset pasar dan wawancara pelanggan secara terbuka.</div>
  <div class="gs-cell gs-cell--b">Menyamar sebagai pelanggan atau pelamar kerja untuk menggali rahasia.</div>
  <div class="gs-cell gs-cell--a">Merekrut talenta secara wajar dengan menghormati klausul kerahasiaan.</div>
  <div class="gs-cell gs-cell--b">Merekrut khusus untuk mengekstraksi rahasia dagang pesaing.</div>
</div>

<p class="sub-h">Perilaku antipersaingan</p>

<div class="dbm-grid">
  <div class="dbm-card dbm-card--clay"><b>Cartel &amp; price fixing</b><span>Kesepakatan antarpesaing menetapkan
  harga, membagi wilayah pasar, atau mengatur pemenang tender (<em>bid rigging</em>). Merugikan konsumen secara
  langsung dan menghapus manfaat persaingan.</span></div>
  <div class="dbm-card dbm-card--clay"><b>Abuse of dominant position</b><span>Perusahaan dominan menyalahgunakan
  posisinya: predatory pricing, <em>tying</em> (memaksa pembelian paket), atau menghalangi akses pesaing ke
  infrastruktur penting.</span></div>
  <div class="dbm-card dbm-card--brass"><b>Dirty tricks</b><span>Menyebarkan rumor negatif, iklan komparatif yang
  menyesatkan, atau mengganggu operasi pesaing.</span></div>
  <div class="dbm-card"><b>Anti-competitive M&amp;A</b><span>Akuisisi yang bertujuan menghilangkan pesaing potensial
  sebelum tumbuh (<em>killer acquisition</em>).</span></div>
</div>

<p>Di Indonesia, isu ini diawasi <strong>KPPU</strong> berdasarkan UU No. 5/1999 tentang Larangan Praktik Monopoli
dan Persaingan Usaha Tidak Sehat.</p>

<div class="term-box">
  <strong>Nuansa penting.</strong> Persaingan yang keras <em>bukan</em> pelanggaran etika — ia justru manfaat utama
  pasar bagi konsumen. Yang tidak etis adalah upaya <strong>menghindari persaingan</strong> (kartel) atau
  <strong>menang dengan cara di luar kualitas penawaran</strong> (spionase, fitnah, penyalahgunaan dominasi).
</div>`
    },
    {
      title: "Extended responsibility dan rantai pasok",
      src: "CM9",
      body: `
<p>Pertanyaan sentral: sejauh mana perusahaan bertanggung jawab atas apa yang terjadi di rantai pasoknya — pada
pemasok tingkat kedua, ketiga, hingga tambang dan perkebunan?</p>

{{viz:supplyChainResp}}

<p>Crane &amp; Matten menyebut pergeseran ini sebagai <strong>extended responsibility</strong>: tanggung jawab
perusahaan tidak lagi berhenti pada batas kepemilikan hukum, melainkan meluas ke seluruh rantai nilai — ke hulu
(pemasok) dan ke hilir (penggunaan dan pembuangan produk).</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Supplier codes of conduct</b><span>Standar yang wajib dipenuhi pemasok. Kelemahannya:
  audit terjadwal mudah disiapkan, dan biaya kepatuhan sering dibebankan ke pemasok tanpa kenaikan harga
  beli.</span></div>
  <div class="dbm-card"><b>Auditing &amp; certification</b><span>Verifikasi pihak ketiga. Lebih kredibel bila
  mendadak, melibatkan wawancara pekerja di luar lokasi, dan mencakup pemasok tingkat lanjut.</span></div>
  <div class="dbm-card"><b>Traceability</b><span>Kemampuan menelusuri asal bahan. Menjadi kewajiban hukum di
  beberapa yurisdiksi, misalnya aturan uji tuntas deforestasi dan konflik mineral.</span></div>
  <div class="dbm-card"><b>Capacity building</b><span>Membantu pemasok memperbaiki kondisi, bukan sekadar
  memutus kontrak ketika audit gagal — pemutusan sepihak sering justru merugikan pekerja.</span></div>
</div>

<p class="sub-h">Fair trade</p>

{{viz:fairTradeChain}}

<p><strong>Fairtrade</strong> menjamin harga minimum yang menutup biaya produksi berkelanjutan, ditambah
<em>premium</em> untuk pembangunan komunitas, hubungan dagang jangka panjang, prapembayaran, serta standar kerja dan
lingkungan. Kritiknya: cakupannya terbatas, biaya sertifikasi memberatkan petani kecil, dan manfaat per petani
kadang lebih kecil dari yang dibayangkan konsumen. Meski begitu, fair trade tetap contoh penting bahwa
<em>struktur rantai pasok bisa dirancang ulang</em>, bukan diterima sebagai takdir pasar.</p>`
    },
    {
      title: "Circular economy dan industrial ecology",
      src: "CM9",
      body: `
<p>Model ekonomi linier — <em>take, make, dispose</em> — bertabrakan dengan batas fisik planet. Alternatifnya adalah
<strong>circular economy</strong>, di mana keluaran satu proses menjadi masukan proses lain.</p>

{{viz:circularEconomy}}

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card"><b>Supply loops</b><span>Menutup lingkaran material: produk kembali ke produsen untuk
  diperbaiki, diproduksi ulang, atau didaur ulang.</span></div>
  <div class="dbm-card"><b>Industrial ecology</b><span>Kawasan industri dirancang agar limbah dan panas satu pabrik
  menjadi bahan baku dan energi pabrik lain — meniru ekosistem alami.</span></div>
  <div class="dbm-card"><b>Extended producer responsibility</b><span>Produsen bertanggung jawab atas produknya
  hingga akhir masa pakai, termasuk pengumpulan dan pengolahan.</span></div>
</div>

<p><strong>Prinsip operasionalnya</strong> sering diringkas sebagai hierarki: <em>refuse, reduce, reuse, repair,
refurbish, remanufacture, recycle, recover</em> — daur ulang berada hampir di urutan terakhir, karena mencegah
penggunaan material selalu lebih baik daripada mengolahnya kembali.</p>

<div class="warn-box">
  <strong>Hati-hati dengan klaim sirkular.</strong> Banyak program "daur ulang" yang sebenarnya mengekspor limbah ke
  negara dengan pengelolaan lebih lemah, atau mendaur ulang sebagian kecil sambil tetap meningkatkan produksi total.
  Uji klaim dengan angka: berapa persen material yang benar-benar kembali ke siklus, dan apakah total penggunaan
  material menurun?
</div>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM9:</strong></p>
<ul>
  <li>Definisi bribery vs corruption; mengapa suap tidak etis dijelaskan dengan teori CM3.</li>
  <li>Facilitation payments — status hukumnya berbeda antara FCPA dan UK Bribery Act.</li>
  <li>Uji kelayakan pemberian hadiah (nilai, waktu, transparansi, timbal balik).</li>
  <li>Competitive intelligence vs industrial espionage — beri contoh masing-masing.</li>
  <li>Bentuk perilaku antipersaingan: kartel, bid rigging, abuse of dominance.</li>
  <li>Extended responsibility dalam rantai pasok + keterbatasan audit dan kode pemasok.</li>
  <li>Circular economy: supply loops, industrial ecology, extended producer responsibility.</li>
</ul>`
},

/* ==========================================================
   CM10 — CIVIL SOCIETY AND BUSINESS ETHICS
   ========================================================== */
{
  id: 10, ref: "CM10", session: 11,
  title: "Civil Society and Business Ethics",
  titleId: "Masyarakat Sipil dan Etika Bisnis",
  blurb: "LSM, komunitas, dan gerakan warga sebagai stakeholder. Dari konfrontasi ke kemitraan — plus filantropi korporat dan kewirausahaan sosial.",
  objectives: [
    "Menjelaskan peran civil society organizations sebagai stakeholder.",
    "Menganalisis etika taktik CSO dan isu akuntabilitas serta legitimasi NGO.",
    "Menjelaskan spektrum hubungan bisnis–CSO dari konflik ke kolaborasi.",
    "Membedakan filantropi karitatif, strategis, dan kewirausahaan sosial."
  ],
  sections: [
    {
      title: "Civil society organizations sebagai stakeholder",
      src: "CM10",
      body: `
<div class="term-box">
  <strong>Civil society organizations (CSOs)</strong> — organisasi yang berada di luar negara dan di luar pasar:
  LSM, serikat pekerja, kelompok agama, asosiasi komunitas, gerakan sosial, dan kelompok kampanye. Ciri umumnya:
  nirlaba, sukarela, dan mengejar tujuan kolektif tertentu.
</div>

<p>CSO adalah stakeholder yang khas karena sering <strong>tidak memiliki hubungan transaksional</strong> dengan
perusahaan — mereka tidak membeli, memasok, atau bekerja untuk perusahaan. Kekuatan mereka bersifat
<em>moral dan reputasional</em>, bukan ekonomi. Dalam kerangka salience CM2, CSO biasanya kuat pada
<strong>legitimacy</strong> dan <strong>urgency</strong>, tetapi lemah pada <strong>power</strong> formal — sehingga
mereka membangun kekuatan lewat media, konsumen, dan investor.</p>

<p><strong>Peran CSO terhadap bisnis:</strong></p>

<ul>
  <li><strong>Watchdog</strong> — mengawasi, meneliti, dan mengungkap praktik bermasalah.</li>
  <li><strong>Advocate</strong> — memperjuangkan perubahan kebijakan dan standar industri.</li>
  <li><strong>Representative</strong> — mewakili pihak yang tidak bersuara: komunitas terdampak, pekerja rantai
  pasok, generasi mendatang, bahkan ekosistem.</li>
  <li><strong>Service provider &amp; partner</strong> — mitra pelaksana program sosial dan penyedia keahlian lokal.</li>
</ul>`
    },
    {
      title: "Taktik CSO dan pertanyaan akuntabilitas",
      src: "CM10",
      body: `
<p>Bab ini menuntut kejujuran dua arah: bukan hanya bisnis yang perlu diuji etikanya, tetapi juga CSO.</p>

<p class="sub-h">Etika taktik CSO</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">TAKTIK YANG UMUM DITERIMA</div>
  <div class="gs-head gs-head--b">TAKTIK YANG DIPERDEBATKAN</div>
  <div class="gs-cell gs-cell--a">Riset dan publikasi laporan berbasis bukti.</div>
  <div class="gs-cell gs-cell--b">Penyederhanaan berlebihan atau data yang dilebih-lebihkan demi dampak media.</div>
  <div class="gs-cell gs-cell--a">Kampanye publik, petisi, boikot konsumen.</div>
  <div class="gs-cell gs-cell--b">Aksi langsung yang melanggar hukum atau mengganggu operasi.</div>
  <div class="gs-cell gs-cell--a">Resolusi pemegang saham dan dialog dengan manajemen.</div>
  <div class="gs-cell gs-cell--b">Menyasar individu karyawan alih-alih kebijakan perusahaan.</div>
  <div class="gs-cell gs-cell--a">Litigasi strategis untuk menegakkan hak.</div>
  <div class="gs-cell gs-cell--b">Menerima pendanaan dari pihak yang punya kepentingan bersaing tanpa
  mengungkapkannya.</div>
</div>

<p class="sub-h">Siapa yang mengawasi pengawas?</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Accountability</b><span>Kepada siapa NGO bertanggung jawab? Kepada donor, anggota,
  atau komunitas yang diwakilinya? Ketiganya bisa punya kepentingan berbeda.</span></div>
  <div class="dbm-card"><b>Legitimacy</b><span>Atas dasar apa sebuah NGO mengklaim berbicara mewakili pihak lain?
  Tidak ada mekanisme pemilihan seperti pada pemerintah.</span></div>
  <div class="dbm-card"><b>Representativeness</b><span>Apakah suara komunitas terdampak benar-benar tersalurkan,
  atau justru diambil alih oleh organisasi yang berbasis di ibu kota atau luar negeri?</span></div>
  <div class="dbm-card"><b>Transparency</b><span>Keterbukaan sumber dana, penggunaan anggaran, dan metode riset.</span></div>
</div>

<div class="key-box">
  <strong>Kunci ujian.</strong> Bila diminta menilai konflik bisnis–LSM, hindari memihak otomatis. Terapkan standar
  yang sama pada keduanya: apakah klaimnya berbasis bukti, apakah prosesnya transparan, siapa yang benar-benar
  diwakili, dan apakah pihak terdampak dilibatkan. Ini persis penerapan <em>discourse ethics</em> dari CM3.
</div>`
    },
    {
      title: "Dari konflik ke kolaborasi",
      src: "CM10",
      body: `
<p>Hubungan bisnis dan CSO berada pada sebuah spektrum, dan sering bergerak sepanjang waktu:</p>

{{viz:csoSpectrum}}

<div class="dbm-grid dbm-grid--3">
  <div class="dbm-card dbm-card--clay"><b>Confrontation</b><span>Kampanye publik, boikot, litigasi, aksi protes.
  Efektif menciptakan tekanan dan menempatkan isu pada agenda, tetapi berbiaya tinggi bagi kedua pihak.</span></div>
  <div class="dbm-card dbm-card--brass"><b>Dialogue &amp; engagement</b><span>Pertemuan rutin, konsultasi, keanggotaan
  panel penasihat. Risiko: dijadikan alat legitimasi tanpa perubahan nyata.</span></div>
  <div class="dbm-card"><b>Partnership</b><span>Program bersama, berbagi sumber daya dan pengambilan keputusan,
  hingga inisiatif multi-pihak yang menetapkan standar industri.</span></div>
</div>

<p class="sub-h">Manfaat dan risiko kemitraan</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">MANFAAT</div>
  <div class="gs-head gs-head--b">RISIKO</div>
  <div class="gs-cell gs-cell--a">Perusahaan memperoleh keahlian lokal, legitimasi, dan pemahaman isu.</div>
  <div class="gs-cell gs-cell--b"><strong>Co-optation</strong> — CSO kehilangan ketajaman kritis karena bergantung
  pada dana atau relasi.</div>
  <div class="gs-cell gs-cell--a">CSO memperoleh sumber daya, skala, dan akses langsung ke pengambil keputusan.</div>
  <div class="gs-cell gs-cell--b">Perusahaan memakai kemitraan sebagai tameng reputasi tanpa mengubah praktik
  intinya (<em>bluewashing</em>).</div>
  <div class="gs-cell gs-cell--a">Menghasilkan solusi yang tidak bisa dicapai satu pihak sendiri.</div>
  <div class="gs-cell gs-cell--b">Ketimpangan sumber daya membuat agenda ditentukan pihak yang membiayai.</div>
</div>

<div class="case-box">
  <strong>Kasus rujukan — Shell dan Ogoni, Nigeria.</strong>
  <p>Aktivitas minyak di Delta Niger memicu protes komunitas Ogoni atas pencemaran dan pembagian manfaat. Konflik
  memuncak dengan eksekusi aktivis Ken Saro-Wiwa oleh pemerintah militer pada 1995, memicu kecaman global terhadap
  Shell. Kasus ini menjadi titik balik dalam pemikiran tentang tanggung jawab MNC di wilayah dengan tata kelola
  lemah.</p>
  <p><strong>Poin analisis:</strong> hubungkan ke CM2 (extended corporate citizenship — perusahaan berhadapan dengan
  hak sipil dan politik warga) dan CM11 (apa kewajiban perusahaan ketika negara tuan rumah tidak melindungi
  warganya?).</p>
</div>`
    },
    {
      title: "Filantropi korporat dan kewirausahaan sosial",
      src: "CM10",
      body: `
<p>Tingkat kedalaman keterlibatan komunitas dapat dibedakan sebagai berikut:</p>

<div class="cascade">
  <div class="cascade-box"><b>1. Charitable giving</b><span>Sumbangan uang atau barang tanpa kaitan dengan bisnis
  inti. Mudah dilakukan, mudah pula dihentikan saat laba turun.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>2. Community involvement</b><span>Kesukarelawanan karyawan, berbagi keahlian dan
  fasilitas. Melibatkan sumber daya perusahaan selain uang.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>3. Strategic philanthropy</b><span>Program yang selaras dengan kompetensi inti dan
  kepentingan bisnis jangka panjang — misalnya perusahaan teknologi mendanai pendidikan digital.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box cascade-box--hi"><b>4. Social investment / shared value</b><span>Menciptakan nilai
  ekonomi sekaligus nilai sosial melalui model bisnisnya sendiri, bukan lewat program terpisah.</span></div>
</div>

<div class="warn-box">
  <strong>Kritik yang penting.</strong> Filantropi dapat menjadi <em>pengalihan perhatian</em>: perusahaan
  menyumbang untuk pendidikan sambil melakukan penghindaran pajak yang justru mengurangi anggaran pendidikan publik.
  Ketika menilai program CSR, tanyakan lebih dulu: apakah dampak negatif dari <strong>bisnis intinya</strong> sudah
  ditangani? Filantropi tidak dapat menebus kerusakan yang ditimbulkan operasi utama.
</div>

<p class="sub-h">Social enterprise dan social entrepreneurship</p>

<div class="term-box">
  <strong>Social enterprise</strong> — organisasi yang menggunakan model bisnis untuk mencapai misi sosial, dengan
  surplus terutama diinvestasikan kembali untuk misi tersebut. <strong>Social entrepreneurship</strong> adalah
  prosesnya: mengidentifikasi masalah sosial dan menyusun solusi berkelanjutan yang inovatif.
</div>

<p>Ciri pembedanya adalah <strong>misi sosial sebagai tujuan utama</strong>, bukan sebagai tambahan. Bentuknya
beragam: koperasi, bank perkreditan mikro, perusahaan berorientasi manfaat (<em>benefit corporation</em>), hingga
usaha berbasis komunitas. Isu etisnya: <em>mission drift</em> — tekanan komersial menggeser misi sosial — dan
pengukuran dampak yang kredibel.</p>

<p><strong>BOP partnership:</strong> menyambungkan CM8 dan CM10 — model paling menjanjikan bukan menjual
<em>kepada</em> komunitas miskin, melainkan membangun usaha <em>bersama</em> mereka sebagai produsen, distributor,
dan pemilik.</p>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM10:</strong></p>
<ul>
  <li>Definisi CSO dan empat perannya terhadap bisnis.</li>
  <li>Isu akuntabilitas dan legitimasi NGO — bukti bahwa kamu berpikir dua arah.</li>
  <li>Spektrum konflik → dialog → kemitraan, lengkap dengan manfaat dan risikonya (co-optation!).</li>
  <li>Empat tingkat keterlibatan komunitas, dari charity ke shared value.</li>
  <li>Kritik terhadap filantropi sebagai pengalih perhatian dari dampak bisnis inti.</li>
  <li>Definisi social enterprise dan risiko mission drift.</li>
</ul>`
},

/* ==========================================================
   CM11 — GOVERNMENT, REGULATION, AND BUSINESS ETHICS
   ========================================================== */
{
  id: 11, ref: "CM11", session: 12,
  title: "Government, Regulation, and Business Ethics",
  titleId: "Pemerintah, Regulasi, dan Etika Bisnis",
  blurb: "Hubungan bisnis dan negara: lobi, pendanaan politik, state capture, privatisasi, dan celah regulasi global yang melahirkan self-regulation serta political CSR.",
  objectives: [
    "Menjelaskan peran pemerintah sebagai stakeholder dan pembuat aturan.",
    "Menganalisis etika lobi, pendanaan partai, dan revolving door.",
    "Menjelaskan celah regulasi dalam globalisasi dan respons self-regulation.",
    "Menjelaskan political CSR dan peran bisnis dalam agenda SDGs."
  ],
  sections: [
    {
      title: "Pemerintah sebagai stakeholder ganda",
      src: "CM11",
      body: `
<p>Pemerintah punya posisi unik: ia sekaligus <strong>stakeholder</strong> (menerima pajak, menyediakan
infrastruktur, berkepentingan atas lapangan kerja) dan <strong>pembuat aturan main</strong> bagi seluruh
stakeholder lain. Hubungan ini bersifat dua arah dan penuh ketegangan.</p>

{{viz:govBusiness}}

<p><strong>Peran pemerintah terhadap bisnis:</strong> membuat regulasi, menegakkan hukum, memungut pajak, menjadi
pembeli besar lewat pengadaan publik, memberi subsidi dan insentif, serta memiliki badan usaha milik negara.</p>

<p><strong>Peran bisnis terhadap pemerintah:</strong> membayar pajak, menciptakan lapangan kerja, menyediakan
keahlian teknis dalam penyusunan kebijakan, berinvestasi, dan — di sinilah persoalan etisnya — berupaya
<em>memengaruhi</em> kebijakan.</p>

<p class="sub-h">Mengapa regulasi dibutuhkan secara etis?</p>

<ul>
  <li><strong>Eksternalitas</strong> — biaya yang ditanggung pihak ketiga (polusi) tidak masuk dalam harga pasar.</li>
  <li><strong>Barang publik</strong> — udara bersih dan stabilitas iklim tidak akan disediakan pasar secara
  memadai.</li>
  <li><strong>Asimetri informasi</strong> — konsumen dan pekerja tidak punya informasi setara.</li>
  <li><strong>Kekuatan pasar</strong> — monopoli merusak manfaat persaingan.</li>
  <li><strong>Tragedy of the commons</strong> — sumber daya bersama habis bila tiap pihak mengejar kepentingan
  sendiri.</li>
</ul>`
    },
    {
      title: "Lobi, pendanaan politik, dan state capture",
      src: "CM11",
      body: `
<p>Memengaruhi kebijakan publik tidak otomatis tidak etis — bisnis punya pengetahuan teknis yang berguna dan
kepentingan sah yang boleh disuarakan. Yang menjadi persoalan adalah <strong>bagaimana</strong> pengaruh itu
dijalankan dan <strong>seberapa timpang</strong> aksesnya.</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">LOBI YANG DAPAT DITERIMA</div>
  <div class="gs-head gs-head--b">LOBI YANG BERMASALAH</div>
  <div class="gs-cell gs-cell--a">Terbuka dan tercatat dalam daftar lobi resmi.</div>
  <div class="gs-cell gs-cell--b">Rahasia; pengaruh dijalankan lewat saluran informal.</div>
  <div class="gs-cell gs-cell--a">Menyampaikan data dan analisis yang jujur dan dapat diverifikasi.</div>
  <div class="gs-cell gs-cell--b">Mendanai riset yang tampak independen untuk menciptakan keraguan ilmiah palsu.</div>
  <div class="gs-cell gs-cell--a">Bersaing secara terbuka dengan suara kepentingan lain.</div>
  <div class="gs-cell gs-cell--b">Menggunakan sumber daya besar untuk meniadakan suara pihak yang lebih lemah.</div>
  <div class="gs-cell gs-cell--a">Berbicara atas nama sendiri secara jelas.</div>
  <div class="gs-cell gs-cell--b"><strong>Astroturfing</strong> — membentuk gerakan warga palsu yang seolah
  spontan.</div>
</div>

<div class="dbm-grid">
  <div class="dbm-card dbm-card--brass"><b>Party financing</b><span>Sumbangan kampanye dapat menciptakan rasa
  berutang budi. Isu utamanya transparansi dan batas nilai sumbangan.</span></div>
  <div class="dbm-card dbm-card--brass"><b>Revolving door</b><span>Perpindahan orang antara jabatan regulator dan
  industri yang diaturnya. Menciptakan konflik kepentingan dan risiko kebijakan yang berpihak.</span></div>
  <div class="dbm-card dbm-card--clay"><b>Regulatory capture</b><span>Regulator lama-kelamaan melayani kepentingan
  industri yang diawasinya, bukan kepentingan publik.</span></div>
  <div class="dbm-card dbm-card--clay"><b>State capture</b><span>Bentuk paling ekstrem: kepentingan swasta
  membentuk aturan dan kebijakan negara secara sistematis untuk keuntungannya sendiri.</span></div>
</div>

<p class="sub-h">Isu terkait lainnya</p>

<ul>
  <li><strong>Privatisation</strong> — memindahkan layanan publik ke swasta. Pertanyaan etisnya: apa yang terjadi
  pada akses universal dan akuntabilitas publik ketika air, listrik, atau kesehatan dikelola secara komersial?</li>
  <li><strong>Deregulation</strong> — pelonggaran aturan atas nama efisiensi. Krisis keuangan 2008 sering dikaitkan
  dengan deregulasi sektor keuangan.</li>
  <li><strong>Public-private partnership</strong> — kolaborasi yang bermanfaat, tetapi menuntut transparansi kontrak
  dan pembagian risiko yang adil.</li>
  <li><strong>Corporate tax</strong> — bersambung dari CM6; pajak adalah kontribusi paling langsung bisnis pada
  barang publik.</li>
</ul>`
    },
    {
      title: "Globalisasi dan celah regulasi",
      src: "CM11",
      body: `
<p>Inilah persoalan struktural yang menjadi benang merah seluruh buku: <strong>bisnis beroperasi secara global,
sementara regulasi bersifat nasional.</strong></p>

{{viz:regGap}}

<p>Akibatnya muncul beberapa fenomena:</p>

<ul>
  <li><strong>Regulatory arbitrage</strong> — memindahkan produksi, pencatatan laba, atau kantor pusat ke yurisdiksi
  dengan aturan paling menguntungkan.</li>
  <li><strong>Race to the bottom</strong> — negara bersaing menarik investasi dengan melonggarkan standar
  lingkungan, pajak, dan ketenagakerjaan.</li>
  <li><strong>Governance gap</strong> — pada isu lintas batas seperti iklim, laut lepas, dan internet, tidak ada
  otoritas yang berwenang menegakkan aturan secara global.</li>
</ul>

<p class="sub-h">Respons: dari hard law ke soft law</p>

<div class="cascade">
  <div class="cascade-box"><b>Hard law</b><span>Regulasi negara yang mengikat dan dapat ditegakkan. Efektif, tetapi
  berhenti di batas wilayah.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>Self-regulation</b><span>Perusahaan atau industri menetapkan standar sendiri. Cepat
  dan fleksibel, tetapi rentan konflik kepentingan dan lemah penegakan.</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box"><b>Soft law</b><span>Norma internasional tidak mengikat secara hukum: UN Global Compact,
  OECD Guidelines for MNEs, UN Guiding Principles on Business and Human Rights (Ruggie).</span></div>
  <div class="cascade-arrow">↓</div>
  <div class="cascade-box cascade-box--hi"><b>Multi-stakeholder initiatives</b><span>Standar yang disusun bersama
  bisnis, LSM, serikat pekerja, dan pemerintah — misalnya Fairtrade, FSC, RSPO, Extractive Industries Transparency
  Initiative. Legitimasi lebih tinggi karena melibatkan pihak terdampak.</span></div>
</div>

<div class="term-box">
  <strong>UN Guiding Principles on Business and Human Rights</strong> — kerangka "Protect, Respect, Remedy":
  negara berkewajiban <em>melindungi</em> hak asasi, perusahaan berkewajiban <em>menghormati</em> hak asasi
  (termasuk melakukan <em>human rights due diligence</em> di seluruh operasi dan rantai pasoknya), dan korban harus
  memiliki akses pada <em>pemulihan</em>. Semakin banyak negara mengubah prinsip ini menjadi kewajiban hukum
  uji tuntas.
</div>`
    },
    {
      title: "Political CSR dan agenda keberlanjutan",
      src: "CM11",
      body: `
<div class="term-box">
  <strong>Political CSR</strong> — situasi ketika korporasi mengambil peran yang secara tradisional menjadi
  kewenangan pemerintah: menyediakan barang publik, menetapkan standar, atau mengatur perilaku aktor lain. Ini
  kelanjutan langsung dari <em>extended corporate citizenship</em> pada CM2.
</div>

<p>Contohnya: perusahaan yang membangun sekolah dan puskesmas di wilayah yang tidak dijangkau negara; platform
digital yang menetapkan aturan kebebasan berekspresi bagi miliaran orang; koalisi industri yang menetapkan standar
lingkungan lebih ketat daripada hukum.</p>

<div class="gs-grid">
  <div class="gs-head gs-head--a">SISI POSITIF</div>
  <div class="gs-head gs-head--b">MASALAH DEMOKRATIS</div>
  <div class="gs-cell gs-cell--a">Mengisi kekosongan tata kelola pada isu yang mendesak.</div>
  <div class="gs-cell gs-cell--b">Korporasi <strong>tidak dipilih</strong> dan tidak dapat dicopot oleh mereka yang
  terdampak keputusannya.</div>
  <div class="gs-cell gs-cell--a">Memiliki sumber daya, jangkauan, dan kecepatan yang sering melampaui negara.</div>
  <div class="gs-cell gs-cell--b">Dapat melemahkan kapasitas negara dalam jangka panjang — mengapa membangun
  layanan publik bila perusahaan menyediakannya?</div>
  <div class="gs-cell gs-cell--a">Dapat menetapkan standar melampaui hukum minimum.</div>
  <div class="gs-cell gs-cell--b">Layanan dapat ditarik sewaktu-waktu ketika tidak lagi menguntungkan.</div>
</div>

<p class="sub-h">Regulasi untuk keberlanjutan</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Instrumen harga</b><span>Pajak karbon, sistem perdagangan emisi — membuat eksternalitas
  masuk ke dalam harga (<em>internalising externalities</em>).</span></div>
  <div class="dbm-card"><b>Instrumen perintah</b><span>Standar emisi, larangan bahan berbahaya, kewajiban pelaporan
  keberlanjutan.</span></div>
  <div class="dbm-card"><b>Instrumen insentif</b><span>Subsidi energi terbarukan, keringanan pajak untuk investasi
  hijau, pengadaan publik berkelanjutan.</span></div>
  <div class="dbm-card"><b>Instrumen informasi</b><span>Label energi, ekolabel, kewajiban pengungkapan jejak karbon
  — memberdayakan pilihan konsumen dan investor.</span></div>
</div>

{{viz:sdgGrid}}

<p><strong>Sustainable Development Goals (SDGs)</strong> — 17 tujuan yang disepakati PBB pada 2015 dengan target
2030. Bagi bisnis, SDGs berfungsi sebagai bahasa bersama untuk memetakan kontribusi dan dampak.
<strong>Kritiknya:</strong> perusahaan cenderung memilih tujuan yang mudah dan sudah selaras dengan bisnisnya
(<em>SDG-washing</em> atau <em>cherry-picking</em>), sambil mengabaikan tujuan yang justru paling terdampak
operasinya.</p>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM11:</strong></p>
<ul>
  <li>Alasan etis dibutuhkannya regulasi: eksternalitas, barang publik, asimetri informasi, kekuatan pasar.</li>
  <li>Kapan lobi dapat diterima dan kapan bermasalah — plus astroturfing.</li>
  <li>Revolving door, regulatory capture, state capture — bedakan ketiganya.</li>
  <li>Celah regulasi global + tangga hard law → self-regulation → soft law → MSI.</li>
  <li>UN Guiding Principles: kerangka Protect, Respect, Remedy.</li>
  <li>Political CSR: definisi dan masalah legitimasi demokratisnya.</li>
  <li>SDGs dan kritik cherry-picking.</li>
</ul>`
},

/* ==========================================================
   CM12 — FUTURE PERSPECTIVES, CORPORATE GOVERNANCE & TECHNOLOGY
   ========================================================== */
{
  id: 12, ref: "CM12", session: 13,
  title: "Future Perspectives, Corporate Governance, and Business Ethics",
  titleId: "Perspektif Masa Depan, Tata Kelola, dan Etika Bisnis",
  blurb: "Bab penutup: ke mana etika bisnis bergerak. Tata kelola berbasis tujuan, etika teknologi dan AI, kualitas pelaporan ESG, serta peran manajer dalam transisi keberlanjutan.",
  objectives: [
    "Merangkum arah perkembangan etika bisnis.",
    "Menjelaskan pergeseran tata kelola menuju purpose dan stakeholder capitalism.",
    "Menganalisis isu etis teknologi digital dan kecerdasan buatan.",
    "Menilai kualitas pelaporan ESG dan risiko greenwashing."
  ],
  sections: [
    {
      title: "Ke mana etika bisnis bergerak",
      src: "CM12 + modul/handout",
      body: `
<p>Bab penutup merangkum benang merah seluruh mata kuliah dan memproyeksikannya ke depan. Crane &amp; Matten
mengidentifikasi beberapa pergeseran besar:</p>

<div class="ft-wrap">
  <div class="ft-head"><span>DARI</span><span></span><span>MENJADI</span></div>
  <div class="ft-row"><div class="ft-from">Kepatuhan pada hukum</div><div class="ft-arrow">→</div><div class="ft-to">Tanggung jawab atas dampak</div></div>
  <div class="ft-row"><div class="ft-from">Sukarela</div><div class="ft-arrow">→</div><div class="ft-to">Kewajiban uji tuntas yang mengikat</div></div>
  <div class="ft-row"><div class="ft-from">Program CSR terpisah</div><div class="ft-arrow">→</div><div class="ft-to">Terintegrasi ke model bisnis</div></div>
  <div class="ft-row"><div class="ft-from">Batas tanggung jawab = kepemilikan</div><div class="ft-arrow">→</div><div class="ft-to">Sepanjang rantai nilai</div></div>
  <div class="ft-row"><div class="ft-from">Melaporkan niat</div><div class="ft-arrow">→</div><div class="ft-to">Melaporkan dampak terverifikasi</div></div>
  <div class="ft-row"><div class="ft-from">Regulasi nasional</div><div class="ft-arrow">→</div><div class="ft-to">Tata kelola multi-pihak lintas batas</div></div>
</div>

<p>Empat pendorong utama perubahan: <strong>krisis iklim</strong> yang mengubah keberlanjutan dari isu reputasi
menjadi risiko finansial dan eksistensial; <strong>teknologi digital</strong> yang menciptakan kategori isu etis
baru; <strong>pergeseran ekspektasi generasi</strong> pekerja dan konsumen; serta <strong>kembalinya regulasi</strong>
setelah dekade self-regulation dinilai tidak memadai.</p>`
    },
    {
      title: "Masa depan corporate governance",
      src: "CM12",
      body: `
<p>Pertanyaan tata kelola bergeser dari "bagaimana mengendalikan manajer demi pemegang saham" (CM6) menjadi
<strong>"untuk apa perusahaan ini ada?"</strong></p>

<div class="dbm-grid">
  <div class="dbm-card"><b>Corporate purpose</b><span>Menyatakan tujuan perusahaan melampaui laba, dan
  menjadikannya dasar pengambilan keputusan — bukan sekadar kalimat di laporan tahunan.</span></div>
  <div class="dbm-card"><b>Stakeholder capitalism</b><span>Gagasan bahwa perusahaan melayani seluruh stakeholder.
  <strong>Kritik:</strong> tanpa mekanisme akuntabilitas yang mengikat, ia mudah menjadi retorika — siapa yang bisa
  menuntut bila janji tidak dipenuhi?</span></div>
  <div class="dbm-card"><b>Benefit corporation / B Corp</b><span>Bentuk hukum atau sertifikasi yang mengikat tujuan
  sosial dan lingkungan ke dalam anggaran dasar, sehingga direksi wajib mempertimbangkannya.</span></div>
  <div class="dbm-card"><b>Board accountability</b><span>Keberagaman dewan, komite keberlanjutan, keterkaitan
  remunerasi eksekutif dengan target iklim dan sosial, serta <em>say on pay</em> bagi pemegang saham.</span></div>
</div>

<div class="warn-box">
  <strong>Uji kritis yang berguna untuk ujian.</strong> Ketika sebuah perusahaan mengklaim menganut stakeholder
  capitalism, tanyakan tiga hal: (1) Apakah ada <em>target terukur</em> dengan tenggat? (2) Apakah <em>remunerasi
  eksekutif</em> terikat pada target itu? (3) Apakah ada pihak <em>di luar perusahaan</em> yang dapat menuntut
  pertanggungjawaban bila gagal? Bila jawaban ketiganya tidak, klaim tersebut belum memiliki mekanisme akuntabilitas.
</div>`
    },
    {
      title: "Etika teknologi dan kecerdasan buatan",
      src: "CM12 + modul/handout",
      body: `
<p>Silabus secara eksplisit menyebut <em>ethics and technology</em> pada sesi ini. Teknologi digital menciptakan isu
etis yang belum terjawab kerangka klasik.</p>

{{viz:aiEthics}}

<div class="dbm-grid">
  <div class="dbm-card dbm-card--clay"><b>Algorithmic bias</b><span>Sistem yang dilatih pada data historis
  mereproduksi diskriminasi masa lalu — pada rekrutmen, penilaian kredit, atau penegakan hukum. Menghubungkan
  langsung ke isu diskriminasi CM7.</span></div>
  <div class="dbm-card dbm-card--clay"><b>Opacity / black box</b><span>Keputusan yang memengaruhi hidup orang tidak
  dapat dijelaskan. Bertabrakan dengan <em>due process</em> dan hak untuk mengetahui alasan keputusan.</span></div>
  <div class="dbm-card dbm-card--brass"><b>Accountability gap</b><span>Ketika sistem otonom menimbulkan kerugian,
  siapa bertanggung jawab — perancang, penyebar, pengguna, atau pemilik data? Kembali ke pertanyaan
  <em>moral agency</em> di CM2.</span></div>
  <div class="dbm-card dbm-card--brass"><b>Surveillance &amp; data</b><span>Pengawasan pekerja (CM7) dan konsumen
  (CM8) dalam skala baru; model bisnis berbasis ekstraksi data.</span></div>
  <div class="dbm-card"><b>Automation &amp; kerja</b><span>Perpindahan pekerjaan, siapa menanggung biaya transisi,
  dan kewajiban pelatihan ulang.</span></div>
  <div class="dbm-card"><b>Dampak lingkungan digital</b><span>Konsumsi energi pusat data dan komputasi model besar,
  serta limbah elektronik — sisi lingkungan yang sering terlupakan.</span></div>
</div>

<p class="sub-h">Prinsip etika AI yang mulai menjadi standar</p>

<ul>
  <li><strong>Transparency &amp; explainability</strong> — orang berhak tahu bahwa keputusan dibuat sistem otomatis
  dan atas dasar apa.</li>
  <li><strong>Fairness &amp; non-discrimination</strong> — pengujian bias sebelum dan sesudah penerapan.</li>
  <li><strong>Accountability</strong> — selalu ada pihak manusia yang bertanggung jawab dan dapat dimintai
  penjelasan.</li>
  <li><strong>Privacy &amp; data governance</strong> — minimalisasi data dan tujuan penggunaan yang jelas.</li>
  <li><strong>Human oversight</strong> — manusia tetap dapat meninjau dan membatalkan keputusan berisiko tinggi.</li>
  <li><strong>Safety &amp; robustness</strong> — sistem diuji untuk kondisi tak terduga sebelum dipakai luas.</li>
</ul>

<p>Kerangka regulasi yang mulai berlaku: <strong>EU AI Act</strong> dengan pendekatan berbasis tingkat risiko, serta
prinsip AI OECD dan UNESCO. Terapkan kembali pelajaran CM1: hukum tertinggal dari teknologi, sehingga penilaian etis
manajer tetap dibutuhkan.</p>`
    },
    {
      title: "ESG, pelaporan, dan greenwashing",
      src: "CM12",
      body: `
{{viz:esgPillars}}

<p>Pelaporan keberlanjutan bergerak dari sukarela menjadi wajib dan terstandardisasi:</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>CSRD (Uni Eropa)</b><span>Kewajiban pelaporan keberlanjutan yang luas dengan asurans
  wajib, memperkenalkan konsep <em>double materiality</em>.</span></div>
  <div class="dbm-card"><b>ISSB / IFRS S1–S2</b><span>Standar global berorientasi investor untuk pengungkapan risiko
  dan peluang terkait keberlanjutan dan iklim.</span></div>
  <div class="dbm-card"><b>TCFD</b><span>Kerangka pengungkapan risiko iklim: tata kelola, strategi, manajemen
  risiko, serta metrik dan target.</span></div>
  <div class="dbm-card"><b>Indonesia — POJK 51/2017</b><span>Kewajiban laporan keberlanjutan bagi lembaga jasa
  keuangan, emiten, dan perusahaan publik. Berguna untuk contoh lokal.</span></div>
</div>

<div class="term-box">
  <strong>Double materiality</strong> — pengungkapan harus mencakup dua arah: (1) <em>financial materiality</em> —
  bagaimana isu keberlanjutan memengaruhi nilai perusahaan; dan (2) <em>impact materiality</em> — bagaimana
  perusahaan memengaruhi manusia dan lingkungan. Kebanyakan perusahaan hanya melaporkan arah pertama. Konsep ini
  sangat mungkin ditanyakan.
</div>

<p class="sub-h">Mendeteksi greenwashing — daftar periksa praktis</p>

<ul>
  <li>Klaim tanpa <strong>angka</strong> dan tanpa <strong>tahun dasar</strong> pembanding.</li>
  <li>Target yang seluruhnya jatuh setelah masa jabatan manajemen saat ini berakhir.</li>
  <li>Ketergantungan besar pada <strong>offset</strong> alih-alih pengurangan emisi sendiri.</li>
  <li>Menyoroti satu produk hijau sementara portofolio utama tidak berubah.</li>
  <li><strong>Tidak ada asurans independen</strong> atas data yang dilaporkan.</li>
  <li>Laporan tanpa satu pun kegagalan atau target yang meleset.</li>
  <li>Lobi kebijakan yang bertentangan dengan komitmen publiknya sendiri — inilah yang paling sering terlewat;
  bandingkan apa yang dikatakan perusahaan dengan apa yang diperjuangkan asosiasi industrinya.</li>
</ul>`
    },
    {
      title: "Menjadi manajer yang etis: penutup",
      src: "CM12",
      body: `
<p>Mata kuliah ini tidak berakhir dengan daftar aturan, melainkan dengan kapasitas. Empat hal yang perlu kamu bawa
keluar dari kelas ini:</p>

<div class="dbm-grid">
  <div class="dbm-card"><b>1. Sensitivitas</b><span>Kemampuan <em>mengenali</em> bahwa sebuah keputusan mengandung
  dimensi moral — tahap pertama model CM4, dan tahap yang paling sering gagal.</span></div>
  <div class="dbm-card"><b>2. Penalaran</b><span>Kemampuan menganalisis dengan beberapa lensa teori (CM3) dan
  mempertahankan penilaianmu dengan argumen, bukan sekadar perasaan.</span></div>
  <div class="dbm-card"><b>3. Imajinasi moral</b><span>Kemampuan menemukan alternatif ketiga ketika situasi tampak
  memaksa memilih antara untung dan benar.</span></div>
  <div class="dbm-card dbm-card--dark"><b>4. Keberanian</b><span>Kemampuan bertindak sesuai penilaian itu ketika ada
  biayanya — tahap keempat model CM4, dan yang paling menentukan.</span></div>
</div>

<div class="key-box">
  <strong>Pertanyaan penutup untuk refleksi.</strong> Crane &amp; Matten menutup dengan mengingatkan bahwa etika
  bisnis bukan disiplin untuk menilai orang lain, melainkan untuk memandu keputusanmu sendiri. Sebelum keputusan
  besar, tanyakan empat hal: <em>Siapa yang terdampak dan apakah mereka ikut bersuara? Apakah saya bersedia keputusan
  ini diberitakan secara terbuka? Apakah saya akan menerima keputusan ini bila berada di posisi pihak yang paling
  dirugikan? Apakah saya akan bangga menjelaskannya kepada orang yang saya hormati sepuluh tahun dari sekarang?</em>
</div>`
    }
  ],
  exam: `
<p><strong>Yang paling sering keluar dari CM12:</strong></p>
<ul>
  <li>Pergeseran besar etika bisnis (tabel "dari → menjadi") dan pendorongnya.</li>
  <li>Stakeholder capitalism dan uji tiga pertanyaan akuntabilitasnya.</li>
  <li>Isu etis AI: algorithmic bias, opacity, accountability gap — plus prinsip etika AI.</li>
  <li><strong>Double materiality</strong> — definisi dua arahnya.</li>
  <li>Daftar periksa greenwashing, terutama ketidaksesuaian antara komitmen publik dan lobi kebijakan.</li>
  <li>Empat kapasitas manajer etis: sensitivitas, penalaran, imajinasi moral, keberanian.</li>
</ul>`
}

];
