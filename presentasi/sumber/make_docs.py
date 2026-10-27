# -*- coding: utf-8 -*-
"""Membangkitkan Materi Pemahaman (HTML) dan Naskah Presentasi (HTML + JSON catatan pembicara) dalam bahasa yang mudah dipahami."""
import json, os, sys, html
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

PRESENTERS = [('Aslih Abnuri', '25/574338/PEK/31801', 'Pembuka, profil perusahaan, dan MRP (slide 1–9)'),
              ('Happy Dinithasari', '25/574400/PEK/31831', 'ERP: sistem yang terhubung dan risikonya (slide 10–11)'),
              ('Juan Bagas Prayogo', '25/573847/PEK/31678', 'Scheduling: apa yang dijadwalkan, hari badai, pusat operasi dan kru (slide 12–15)'),
              ('Riska Novalita', '25/574037/PEK/31724', 'Sequencing: urutan pekerjaan, Johnson\'s rule, staf bergilir; evaluasi dan kesimpulan (slide 16–20)')]

# ---------------------------------------------------------------- NASKAH (per slide), bahasa lisan yang sederhana
NASKAH = [
 (1, 'Aslih', '0:45', 'Judul',
  "Selamat pagi, Ibu Prof. Nur Aini dan teman-teman. Kami kelompok Alaska Airlines. Saya Aslih, bersama Happy, Juan, dan Riska. Hari ini kami membahas Planning and Control di Alaska Airlines. Ada dua subtopik: MRP dan ERP, lalu sequencing and scheduling. Pembagiannya begini: saya membuka dengan profil perusahaan dan bagian MRP, Happy melanjutkan ke ERP, Juan membahas scheduling, dan Riska menutup dengan sequencing, evaluasi, dan kesimpulan.",
  "Sebut nama anggota sambil mengarah ke kotak PRESENTER. NIM tidak perlu dibaca."),
 (2, 'Aslih', '0:45', 'Alur pembahasan',
  "Alur kami empat langkah. Pertama, kita berkenalan dulu dengan Alaska Airlines: seberapa besar operasinya dan apa saja yang sering mengganggu rencananya. Kedua, MRP dan ERP: bagaimana jadwal penerbangan diterjemahkan menjadi kebutuhan perawatan dan suku cadang, lalu bagaimana semua datanya disatukan. Ketiga, sequencing and scheduling: bagaimana pesawat, kru, hangar, dan staf darat diatur urutan dan jadwalnya, termasuk saat badai. Keempat, evaluasi dan rekomendasi. Setiap langkah memakai hasil langkah sebelumnya.",
  "Tunjuk kartu 01 sampai 04 berurutan."),
 (3, 'Aslih', '1:15', 'Tentang Alaska Airlines',
  "Alaska Airlines berpusat di Seattle. Sejak 2024 ia bergabung dengan Hawaiian Airlines. Totalnya 392 pesawat, lebih dari 140 tujuan, dan 30 ribu karyawan. Yang menarik adalah lingkungannya. Bandara Seattle termasuk 15 bandara tersibuk di Amerika, dan di musim dingin hujannya sekitar 5 inci per bulan. Tetapi justru bandara ini punya rekor keberangkatan tepat waktu tertinggi di Amerika, 85,8 persen. Menurut Heizer, sebagian besar berkat Alaska, karena lebih dari separuh penerbangan domestik di sana milik Alaska. Satu lagi: pada 29 Oktober 2025, FAA memberi satu sertifikat operasi untuk Alaska dan Hawaiian. Artinya dua merek, satu sistem. Kutipan di kanan bawah adalah inti presentasi kami: keunggulan Alaska ada pada kemampuannya menyesuaikan jadwal di menit terakhir.",
  "Tekankan kalimat terakhir; Juan dan Riska akan merujuknya lagi."),
 (4, 'Aslih', '1:00', 'Skala operasi dan ketepatan waktu',
  "Ini skalanya. Setiap hari Alaska mengatur 392 pesawat dan lebih dari 4.500 pilot dan awak kabin. Angka 18 juta dolar itu taksiran Alaska sendiri: sebesar itu penghematan per tahun dari teknologi yang membantu mereka mengatur ulang jadwal saat ada gangguan. Grafik di kanan adalah hasilnya: pada 2024, menurut Cirium, Alaska nomor tiga paling tepat waktu di Amerika Utara, 79 persen lebih, di bawah Delta dan United. Jadi kinerjanya bagus. Pertanyaannya: bagaimana caranya?",
  "Tidak perlu membaca semua angka. Tunjuk 4.500 kru dan 18 juta dolar, dua angka yang akan muncul lagi."),
 (5, 'Aslih', '1:15', 'Empat sumber gangguan',
  "Ada empat hal yang sering mengganggu rencana Alaska. Satu, cuaca Seattle. Satu badai di bulan Desember bisa memaksa pembatalan 50 sampai 80 persen penerbangan, dan keputusannya berubah tiap beberapa jam. Ini soal scheduling. Dua, geografi Alaska. Di Juneau ada angin berbahaya, di Sitka landasannya hanya satu dan sempit, di Kodiak hanya kapten yang boleh mendarat. Jadi tidak semua pesawat dan kru bisa dipasang ke sembarang rute. Tiga, sistem komputernya pernah gagal dua kali pada 2025, Juli dan Oktober, dan seluruh operasi berhenti. Ini sisi gelap ERP. Empat, Januari 2024, 65 pesawat MAX 9 dilarang terbang dan harus diperiksa serentak. Ini lonjakan kebutuhan perawatan, wilayah MRP. Pertanyaan kami: bagaimana MRP, ERP, dan sequencing and scheduling menjelaskan cara Alaska bertahan, dan di mana kelemahannya.",
  "Sebutkan label dimensi di bawah tiap kartu supaya kelas melihat kaitannya dengan subtopik."),
 (6, 'Aslih', '0:20', 'Pembuka Subtopik 1',
  "Sekarang kita masuk subtopik pertama, MRP dan ERP. Saya mulai dari MRP.",
  "Transisi singkat saja."),
 (7, 'Aslih', '1:30', 'Dari jadwal penerbangan ke suku cadang',
  "Inti MRP sederhana: kebutuhan suku cadang tidak ditebak, tetapi dihitung dari jadwal. Ibaratnya, kalau kita tahu menu makan satu minggu, kita bisa menghitung belanjaannya. Rantainya empat langkah. Satu, jadwal penerbangan: pesawat mana terbang ke mana dan berapa jam. Ini jadwal induknya. Dua, dari jam terbang tiap pesawat kita tahu kapan pesawat itu harus masuk perawatan. Tiga, setiap perawatan punya daftar pekerjaan, disebut task card: komponen apa yang diganti dan berapa jam kerjanya. Ini seperti resep. Empat, kebutuhan itu dikurangi stok yang ada dan barang yang sedang dipesan, lalu dimundurkan sesuai lama pemesanan, lead time, supaya barang datang pas waktunya. Akibatnya, kalau jadwal penerbangan berubah, jadwal perawatan ikut berubah, dan jadwal pemesanan suku cadang ikut bergeser.",
  "Ikuti panah dari kartu 01 ke 04 dengan tangan."),
 (8, 'Aslih', '1:45', 'Contoh perhitungan brake assembly',
  "Supaya jelas, ini contoh satu komponen: brake assembly, atau rem. Anggaplah satu paket perawatan besar butuh 4 unit rem. Pesan ke pemasok butuh 2 minggu. Stok awal 6. Ada 4 unit yang sudah dipesan dan datang di minggu kedua. Rencana perawatan: 2 paket di minggu 5, 1 paket di minggu 7, 2 paket di minggu 8. Baris pertama, kebutuhan kotor: 8, 4, 8. Baris stok: mulai 6, jadi 10 di minggu 2, dipakai 8 di minggu 5, sisa 2. Minggu 7 butuh 4, stok cuma 2, kurang 2. Minggu 8 butuh 8, stok habis, kurang 8. Karena memesan butuh 2 minggu, pesanan 2 unit harus dilepas di minggu 5, dan 8 unit di minggu 6. Itu dua sel hijau di baris paling bawah. Logika sesederhana ini dijalankan sistem Alaska untuk ribuan komponen di 392 pesawat. Kalau pesan terlambat, pesawat menganggur menunggu barang, istilahnya AOG. Kalau terlalu cepat, gudang penuh.",
  "Tunjuk sel per sel di baris stok, lalu dua sel hijau di baris paling bawah."),
 (9, 'Aslih', '1:30', 'Perencanaan perawatan: 2024 versus 2026',
  "Dua peristiwa menunjukkan perubahan cara Alaska merencanakan perawatan. Januari 2024, setelah insiden 5 Januari, FAA melarang terbang 737 MAX 9. Alaska harus memeriksa 65 pesawat sekaligus. Dalam bahasa MRP, kebutuhannya melonjak di satu waktu, padahal hangar dan teknisinya terbatas. Hasilnya, sekitar 150 penerbangan per hari dibatalkan selama tiga minggu, dan kerugiannya sekitar 150 juta dolar. April 2026, Alaska bermitra dengan Tailsight. Ini perangkat lunak yang menyusun rencana perawatan dengan menggabungkan data perawatan, jadwal penerbangan, jumlah staf, kemampuan tiap stasiun, dan ketersediaan suku cadang. Jadi kapasitasnya ikut dihitung sejak awal, bukan dicek belakangan. Istilahnya: dari infinite loading menjadi closed-loop. Nah, karena alat ini bergantung pada data dari banyak sistem, kita masuk ke ERP. Silakan, Happy.",
  "Kalimat terakhir adalah jembatan ke Happy. Tunggu Happy mengambil alih."),
 (10, 'Happy', '2:00', 'Integrasi sistem ala ERP',
  "Terima kasih, Aslih. Inti ERP satu: satu basis data bersama. Data dimasukkan sekali, dipakai semua bagian. Diagram di kiri menunjukkan sistem-sistem Alaska yang terhubung ke satu pusat: reservasi dan check-in, penjadwalan kru, pengaturan penerbangan dan cuaca, perawatan dan suku cadang, serta keuangan dan SDM. Di kanan, tiga bukti manfaatnya. Pertama, saat cuaca buruk, data pesawat, kru, dan penumpang yang sama dipakai untuk menyusun jadwal baru dan mengabari penumpang, hanya dalam hitungan jam. Alaska menaksir manfaatnya 18 juta dolar per tahun. Kedua, penggabungan dengan Hawaiian: satu sertifikat operasi tercapai 29 Oktober 2025 setelah setahun kerja lintas departemen, dan pada 2026 sistem layanan penumpangnya disatukan. Ketiga, Tailsight yang tadi disebut Aslih hanya berguna kalau data perawatan, jadwal, staf, dan suku cadang konsisten di semua sistem. Satu catatan: Alaska memakai pusat data sendiri untuk sistem penting, ditambah cloud. Ingat kata 'pusat data' ini untuk slide berikutnya.",
  "Tunjuk lingkaran hitam di tengah diagram saat menyebut 'satu basis data bersama'."),
 (11, 'Happy', '2:00', 'Risiko integrasi: dua outage 2025',
  "Karena semuanya terhubung, kalau pusatnya mati, semuanya ikut berhenti. Pada 2025 itu terjadi dua kali. 20 Juli, satu perangkat keras di pusat data rusak dan beberapa sistem lumpuh. Alaska menahan semua pesawat di darat sekitar tiga jam, dan lebih dari 150 penerbangan dibatalkan. Setelah itu Alaska menyatakan sudah memperkuat sistemnya. Tetapi 23 Oktober, pusat data utamanya gagal: pesawat ditahan sekitar delapan jam, lebih dari 400 penerbangan batal, sekitar 49 ribu penumpang terdampak. Bukan serangan siber. Alaska lalu mendatangkan ahli dari luar untuk memeriksa seluruh sistemnya dan mengganti perangkat kerasnya. Pelajarannya: makin terintegrasi, makin besar akibat satu titik kegagalan. Manfaat 18 juta dolar tadi hanya ada kalau sistemnya hidup. Inilah kelemahan ERP menurut Heizer: rumit, dan pekerjaannya tidak pernah benar-benar selesai. Lalu, bagaimana rencana itu dijalankan jam demi jam? Juan akan membahas scheduling.",
  "Foto kanan: deretan pesawat tertahan di gate saat ground stop. Beri jeda sebelum menyebut 49 ribu."),
 (12, 'Juan', '0:20', 'Pembuka Subtopik 2',
  "Terima kasih, Happy. Subtopik kedua: sequencing and scheduling. Saya membahas scheduling, yaitu mengatur jadwal jam demi jam. Riska nanti membahas sequencing, yaitu mengatur urutan.",
  "Transisi singkat."),
 (13, 'Juan', '1:30', 'Apa yang dijadwalkan setiap hari',
  "Apa saja yang dijadwalkan Alaska setiap hari? Tiga hal. Pertama, pesawat dan perawatannya: dulu sekitar 150 pesawat per hari, sekarang 392, ditambah slot perawatan yang harus diselipkan di antara jadwal terbang. Kedua, kru dan jadwal keberangkatan: lebih dari 4.500 pilot dan awak kabin, dengan aturan batas jam kerja dari FAA, kontrak serikat, dan sistem bidding, yaitu kru memilih jadwal yang mereka inginkan. Ketiga, petugas gate, tiket, katering, dan deicing, yang kebutuhannya naik-turun tergantung hari dan cuaca. Ketiganya saling terkait: satu jadwal berubah, yang lain ikut berubah, sampai ke puluhan bandara. Istilahnya ripple effect, efek riak.",
  "Tunjuk foto saat menyebut tiap objek."),
 (14, 'Juan', '2:00', 'Satu hari badai di Seattle',
  "Ini cerita satu hari badai di Seattle dari buku Heizer. Jam 4 pagi, prakiraannya hujan, mungkin salju ringan. Tindakannya baru rapat: membahas kondisi pesawat dan kemungkinan pembatalan. Jam 10, prakiraan berubah: hujan beku setelah jam 5 sore. Tindakannya: siapkan truk deicing, dan susun rencana membatalkan 50 sampai 80 persen penerbangan setelah jam 6 sore. Jam setengah 2 siang, hujan berubah menjadi salju. Separuh penerbangan dari jam 6 sore sampai jam 10 pagi dibatalkan, penumpang dikabari, pesawat dialihkan. Jam 5 sore, salju ternyata lebih sedikit. Tim terus menelepon penumpang dan mencarikan penerbangan pengganti. Jam 10 malam, salju reda. Sisanya mencarikan hotel untuk 600 penumpang yang tertahan. Lima kali rencana direvisi dalam 18 jam, dan setiap revisi langsung ditindaklanjuti. Di sinilah nilai 18 juta dolar itu: teknologi yang membantu menyusun ulang jadwal dengan cepat.",
  "Berjalan dari kartu kiri ke kanan mengikuti garis waktu. Ini slide paling bercerita; jangan terburu-buru."),
 (15, 'Juan', '1:45', 'Pusat operasi dan penjadwalan kru',
  "Siapa yang mengerjakan semua itu? Flight Operations Department di Seattle. Ruangannya penuh layar: posisi pesawat, peta cuaca, radar. Ada lampu status, disebut andon: hijau aman, kuning perlu perhatian, merah darurat. Dengan model matematika, tim ini menyusun jadwal pengganti, mengalihkan rute, memastikan kru tersedia, dan mengabari penumpang. Bagian kedua: mengatur 4.500 lebih kru. Kru memilih jadwal lewat sistem bidding, tetapi sistem memeriksa batas jam kerja FAA dan kontrak serikat secara real time. Ada juga kendala khusus: di Kodiak hanya kapten yang boleh mendarat, jadi tidak semua pasangan kru bisa ditugaskan ke sana. Intinya, scheduling di Alaska bukan hanya menyusun jadwal, tetapi menjaga jadwal tetap bisa dijalankan saat kondisi berubah. Selanjutnya, Riska akan menjelaskan cara mengurutkan pekerjaan.",
  "Tunjuk lampu pada foto saat menyebut andon."),
 (16, 'Riska', '2:00', 'Mengurutkan pekerjaan di hangar',
  "Terima kasih, Juan. Kalau beberapa pesawat antre di hangar, mana yang dikerjakan dulu? Urutannya menentukan hasil. Kami memakai contoh dari Heizer: lima paket pekerjaan, A sampai E, dengan lama pengerjaan 6, 2, 8, 3, dan 9 hari, serta tenggat 8, 6, 18, 15, dan 23 hari. Ada empat aturan. Yang datang dulu dikerjakan dulu, FCFS: rata-rata selesai 15,4 hari. Yang paling cepat dikerjakan dulu, SPT: rata-rata 13 hari, dan terbaik di tiga ukuran, yaitu waktu selesai, utilisasi 43 persen, dan jumlah pekerjaan yang menumpuk. Yang tenggatnya paling dekat dulu, EDD: paling sedikit terlambat, rata-rata hanya 1,2 hari. Yang paling lama dulu, LPT: paling buruk di semua ukuran. Artinya untuk Alaska: kalau ingin hangar cepat kosong, pakai SPT; kalau ingin tidak melewati tenggat kelaikan udara, pakai EDD; dan untuk pesawat yang sedang menganggur menunggu perbaikan, dipakai critical ratio, yaitu sisa waktu dibagi sisa pekerjaan, yang dihitung ulang setiap hari. Tidak ada satu aturan yang paling bagus di semua ukuran, jadi aturannya dipilih sesuai situasi.",
  "Kalau ditanya cara menghitung: utilisasi = total lama pengerjaan dibagi total waktu alir. Tabel lengkap ada di Materi Pemahaman bagian 7."),
 (17, 'Riska', '1:45', 'Alur dua tahap dan staf darat',
  "Dua contoh lagi. Pertama, pekerjaan dua tahap: inspeksi dulu, baru perbaikan. Lima komponen dengan lama inspeksi dan perbaikan: A 5 dan 2 jam, B 3 dan 6, C 8 dan 4, D 10 dan 7, E 7 dan 12. Dengan Johnson's rule, yang inspeksinya cepat ditaruh di awal, yang perbaikannya cepat ditaruh di akhir. Hasilnya urutan B, E, D, C, A, dan semuanya selesai dalam 35 jam. Kalau urutan sembarang A sampai E, butuh 45 jam. Hemat 10 jam hanya dari urutan. Kedua, petugas gate di musim dingin. Kebutuhan Senin sampai Minggu: 5, 5, 6, 5, 4, 3, 3. Dengan pola kerja lima hari dan libur dua hari berurutan, cukup tujuh petugas: empat libur Sabtu–Minggu, dua libur Kamis–Jumat, satu libur Senin–Selasa, dan kelebihan tenaganya hanya empat orang-hari seminggu. Ingat juga dari slide Juan: truk deicing disiapkan delapan jam sebelum hujan beku datang. Jadi staf darat diatur berdasarkan prakiraan, bukan menunggu kejadian.",
  "Tunjuk batang Gantt B–E–D–C–A saat menyebut 35 jam."),
 (18, 'Riska', '1:45', 'Evaluasi dan rekomendasi',
  "Evaluasi kami: Alaska kuat dalam menyusun ulang jadwal jangka pendek, dan sedang memperbaiki perencanaan perawatan agar memperhitungkan kapasitas. Kelemahan yang terbukti adalah ketahanan sistem komputer terintegrasinya. Empat rekomendasi. Satu, perkuat ketahanan infrastruktur: dua pusat data yang sama-sama aktif, uji pindah sistem secara rutin, dan prosedur manual kalau sistem mati. Ukurannya: waktu pemulihan dan jumlah ground stop karena IT. Dua, jalankan perencanaan perawatan yang menghitung kapasitas lewat Tailsight, dengan lama pemesanan pemasok sebagai batasan. Ukurannya: jam pesawat menganggur, ketersediaan suku cadang, dan pemakaian jam teknisi. Tiga, aturan prioritas campuran di hangar: critical ratio untuk yang mendesak, SPT untuk antrean biasa, Johnson's rule untuk pekerjaan dua tahap. Ukurannya: keterlambatan rata-rata dan total waktu selesai. Empat, rapikan proses dulu, baru satukan sistem, saat Hawaiian dipindah ke sistem Alaska, dan jangan terlalu banyak mengubah perangkat lunaknya. Ukurannya: biaya kustomisasi dan jumlah masalah saat perpindahan.",
  "Setiap rekomendasi punya dasar teori; lihat bagian 8 Materi Pemahaman bila ditanya."),
 (19, 'Riska', '1:15', 'Kesimpulan',
  "Tiga kesimpulan. Pertama, jadwal penerbangan adalah jadwal induk Alaska: dari situ kebutuhan perawatan, suku cadang, dan kru dihitung. Itu MRP. Dan satu basis data menyatukan semuanya. Itu ERP. Kedua, ketepatan waktu dijaga jam demi jam lewat sequencing and scheduling: aturan prioritas di hangar, pengaturan kru dengan batasan aturan, jadwal bergilir staf darat, dan penyusunan ulang jadwal saat badai. Ketiga, integrasi itu kekuatan sekaligus risiko: hemat 18 juta dolar per tahun, tetapi dua kali sistem mati pada 2025 menghentikan seluruh operasi. Jadi ketahanan sistem harus direncanakan seserius jadwalnya. Angka yang perlu diingat: 18 juta dolar, 85,8 persen, dan 79,25 persen.",
  "Daftar referensi lengkap ada di catatan pembicara slide ini dan di Materi Pemahaman."),
 (20, 'Riska', '0:15', 'Terima kasih',
  "Itu presentasi kami. Terima kasih, kami siap menerima pertanyaan.",
  "Semua anggota berdiri untuk tanya jawab; pertanyaan dijawab pemilik bagian masing-masing."),
]

json.dump({str(n): f"[{p} · {d}] {t}\n\nCatatan: {c}" for (n, p, d, _, t, c) in NASKAH}, open(os.path.join(OUT, 'naskah.json'), 'w'), ensure_ascii=False, indent=1)

CSS = """
@page { size: A4; margin: 20mm 18mm 20mm 18mm; }
* { box-sizing: border-box; }
body { font-family: 'Barlow', Arial, sans-serif; font-size: 11.5pt; line-height: 1.5; color: #1A1C14; margin: 0; }
h1, h2, h3 { font-family: 'Barlow Condensed ExtraBold', 'Barlow Condensed', Arial Narrow, sans-serif; font-weight: 800; text-transform: uppercase; line-height: 1.05; margin: 0; letter-spacing: 0.2px; }
h1 { font-size: 34pt; }
h2 { font-size: 22pt; margin: 22pt 0 8pt; padding-bottom: 4pt; border-bottom: 3px solid #1A1C14; page-break-after: avoid; }
h3 { font-size: 15pt; margin: 14pt 0 5pt; page-break-after: avoid; }
h3 .num { display: inline-block; background: #F1681D; color: #fff; padding: 1px 7px; border-radius: 6px; margin-right: 6px; font-size: 13pt; }
p { margin: 0 0 7pt; }
ul, ol { margin: 0 0 8pt 18pt; padding: 0; } li { margin-bottom: 4pt; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 10.5pt; page-break-inside: avoid; }
th { background: #1A1C14; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; padding: 5px 7px; text-align: center; font-size: 10.5pt; }
td { border: 1px solid #DADAD5; padding: 4px 7px; vertical-align: top; }
td.l { text-align: left; } td.c { text-align: center; }
tr:nth-child(even) td { background: #F6F6F3; }
.hl { background: #9CC506; font-weight: 700; }
.box { border-radius: 12px; padding: 10px 14px; margin: 8pt 0 10pt; page-break-inside: avoid; }
.box.lime { background: #EEF7CF; border-left: 6px solid #9CC506; }
.box.orange { background: #FDE9DD; border-left: 6px solid #F1681D; }
.box.dark { background: #1A1C14; color: #fff; }
.box .t { font-family: 'Barlow Condensed ExtraBold', sans-serif; text-transform: uppercase; font-size: 13pt; margin-bottom: 3pt; }
.tag { display: inline-block; background: #1A1C14; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-transform: uppercase; font-size: 9.5pt; padding: 2px 9px; border-radius: 999px; letter-spacing: 0.5px; }
.tag.o { background: #F1681D; } .tag.g { background: #9CC506; color: #1A1C14; }
.cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; }
.cover .kicker { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #F1681D; font-size: 13pt; margin-bottom: 10pt; }
.cover h1 { font-size: 44pt; margin-bottom: 10pt; }
.cover h1 .m { background: #9CC506; padding: 0 10px; border-radius: 8px; }
.cover .sub { font-size: 15pt; margin: 6pt 0 26pt; }
.cover table { width: auto; font-size: 11pt; }
.pb { page-break-before: always; }
.small { font-size: 9.5pt; color: #555; }
.slide { border: 1px solid #DADAD5; border-radius: 12px; padding: 10px 14px 6px; margin: 0 0 10pt; page-break-inside: avoid; }
.slide .head { display: flex; align-items: center; gap: 10px; margin-bottom: 6pt; }
.slide .head h3 { margin: 0; font-size: 16pt; }
.slide .meta { margin-left: auto; white-space: nowrap; }
.slide .script { font-size: 11.5pt; }
.slide .note { font-size: 10pt; color: #444; background: #F6F6F3; border-radius: 8px; padding: 6px 10px; margin-top: 6pt; }
.pres-A { border-left: 7px solid #F1681D; } .pres-H { border-left: 7px solid #9CC506; } .pres-J { border-left: 7px solid #1A1C14; } .pres-R { border-left: 7px solid #F39D6A; }
.formula { background: #F6F6F3; border-radius: 8px; padding: 6px 10px; margin: 4pt 0 8pt; font-size: 10.5pt; }
.kv { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 6pt 0 10pt; }
.kv div { background: #F6F6F3; border-radius: 10px; padding: 8px 12px; }
.kv b { display: block; font-family: 'Barlow Condensed ExtraBold', sans-serif; text-transform: uppercase; font-size: 12.5pt; }
"""

def page(title, body):
    return f"<!doctype html><html lang='id'><head><meta charset='utf-8'><title>{html.escape(title)}</title><style>{CSS}</style></head><body>{body}</body></html>"

def cover(kicker, h1_pre, h1_mark, sub, extra=''):
    rows = ''.join(f"<tr><td class='l'><b>{n}</b></td><td class='l'>{nim}</td><td class='l'>{r}</td></tr>" for n, nim, r in PRESENTERS)
    return f"""<div class='cover'><div class='kicker'>{kicker}</div><h1>{h1_pre}<br><span class='m'>{h1_mark}</span></h1><div class='sub'>{sub}</div>
    <table><tr><th>Presenter</th><th>NIM</th><th>Bagian</th></tr>{rows}</table>
    <p style='margin-top:18pt'><b>Mata kuliah:</b> Operations &amp; Technology Management · Sesi 7 · Studi Kasus 5<br><b>Dosen pengampu:</b> Prof. Nur Aini Masruroh, S.T., M.Sc., Ph.D.<br><b>Bacaan:</b> Heizer, Render &amp; Munson (2017) Bab 14–15; Slack, Brandon-Jones &amp; Burgess (2022) Bab 10 dan 14.</p>{extra}</div>"""

def tbl(header, rows):
    h = ''.join(f'<th>{c}</th>' for c in header)
    b = ''
    for r in rows:
        cells = ''
        for j, c in enumerate(r):
            c = str(c); k = ' class="l"' if j == 0 else ' class="c"'
            if c.startswith('!'): c = c[1:]; k = ' class="c hl"'
            cells += f'<td{k}>{c}</td>'
        b += f'<tr>{cells}</tr>'
    return f"<table><tr>{h}</tr>{b}</table>"

def box(kind, title, text): return f"<div class='box {kind}'><div class='t'>{title}</div>{text}</div>"

# ================================================================ MATERI PEMAHAMAN (bahasa sederhana)
M = []
M.append(cover('Materi Pemahaman · Operations &amp; Technology Management · Sesi 7', 'Planning and Control di', 'Alaska Airlines',
               'Penjelasan sederhana di balik setiap slide: apa maksudnya, dari mana angkanya, bagaimana cara menghitungnya, dan pertanyaan apa yang mungkin ditanyakan.'))

M.append("""<div class='pb'></div><h2>1. Untuk apa dokumen ini</h2>
<p>Slide presentasi kita sengaja tidak berisi teori. Slide langsung membahas kasus Alaska Airlines dan mengikuti dua subtopik: <i>MRP dan ERP</i>, lalu <i>sequencing and scheduling</i>. Dokumen ini melengkapinya. Untuk setiap bagian, dokumen ini menjelaskan konsepnya dengan bahasa sehari-hari, dari mana angkanya berasal, bagaimana menghitungnya langkah demi langkah, dan pertanyaan apa yang mungkin muncul.</p>
<p>Saran membaca: pahami bagian Anda sendiri sampai detail, dan bagian anggota lain secara garis besar. Saat tanya jawab, pertanyaan bisa melompat ke bagian siapa saja.</p>
<p>Urutan tampil: <b>Aslih</b> (slide 1–9: pembuka, profil, MRP) → <b>Happy</b> (slide 10–11: ERP) → <b>Juan</b> (slide 12–15: scheduling) → <b>Riska</b> (slide 16–20: sequencing, evaluasi, kesimpulan). Naskah per slide ada di dokumen <i>Naskah Presentasi</i> dan di catatan pembicara berkas PPTX.</p>
""" + box('lime', 'Cerita besarnya dalam lima kalimat',
 "<p>Alaska Airlines beroperasi di bandara yang sering hujan dan bersalju, tetapi tetap termasuk yang paling tepat waktu. Rahasianya: semua kebutuhan dihitung dari satu jadwal induk, yaitu jadwal penerbangan (itu MRP), dan semua data disimpan dalam satu sistem yang terhubung (itu ERP). Lalu setiap hari, bahkan setiap jam, jadwal pesawat, kru, hangar, dan staf darat diatur ulang kalau keadaan berubah (itu <i>scheduling</i>), dan pekerjaan yang antre diurutkan dengan aturan tertentu (itu <i>sequencing</i>). Sistem yang terhubung ini menghemat sekitar US$18 juta per tahun. Tetapi pada 2025 sistem itu dua kali mati dan seluruh operasi berhenti: itulah risikonya.</p>"))

M.append("""<h2>2. Konsep dasar dengan bahasa sederhana</h2>
<p>Berikut konsep yang melatari slide. Setiap konsep dijelaskan dengan perumpamaan, lalu dihubungkan ke Alaska. Istilah asli bahasa Inggris tetap ditulis karena itulah yang dipakai di buku dan di slide.</p>
<div class='kv'>
<div><b>Planning vs control</b><i>Planning</i> = membuat rencana. <i>Control</i> = menjaga rencana tetap jalan saat keadaan berubah. Seperti merencanakan perjalanan (planning) lalu mencari jalan lain saat macet (control). Semakin dekat hari-H, semakin banyak control yang dibutuhkan.</div>
<div><b>Dependent demand</b>Kebutuhan yang bisa dihitung dari kebutuhan lain. Kalau tahu berapa kue yang akan dibuat, kita tahu berapa telur yang dibutuhkan. Tidak perlu meramal. Di Alaska: kebutuhan suku cadang dihitung dari jadwal perawatan, dan jadwal perawatan dihitung dari jadwal terbang.</div>
<div><b>MRP (Material Requirements Planning)</b>Cara menghitung apa yang harus dipesan, berapa, dan kapan, berdasarkan jadwal induk, daftar bahan, stok, dan lama pemesanan. Seperti menyusun daftar belanja dari menu seminggu, lalu belanja beberapa hari lebih awal supaya bahannya ada saat dimasak.</div>
<div><b>ERP (Enterprise Resource Planning)</b>Satu sistem komputer dengan satu basis data yang dipakai semua bagian perusahaan: penjualan, keuangan, perawatan, SDM. Seperti satu buku catatan bersama: siapa pun yang menulis, semua langsung bisa membacanya. Hebat kalau jalan, lumpuh total kalau bukunya hilang.</div>
<div><b>Scheduling</b>Menentukan kapan dan oleh siapa sesuatu dikerjakan: jam berapa pesawat berangkat, kru mana yang bertugas, hangar mana yang dipakai. Jangka pendeknya hitungan hari dan jam.</div>
<div><b>Sequencing</b>Menentukan urutan: kalau lima pekerjaan antre, mana yang dikerjakan dulu. Aturannya macam-macam, misalnya yang datang dulu, yang tercepat, atau yang tenggatnya paling dekat.</div>
</div>
<h3><span class='num'>2.1</span>Planning and control (Slack, Bab 10)</h3>
<p>Perusahaan harus mencocokkan apa yang bisa dibuatnya dengan apa yang diminta pelanggan: berapa banyak, kapan, dan dengan mutu apa. Rencana adalah niat, bukan jaminan; karena itu perencanaan selalu berpasangan dengan pengendalian. Ada empat kegiatan inti: <b>loading</b> (berapa banyak pekerjaan dibebankan ke tiap bagian), <b>sequencing</b> (urutan pengerjaan), <b>scheduling</b> (jadwal mulai dan selesai), dan <b>monitoring and control</b> (memantau lalu campur tangan bila meleset). Slide 14, cerita hari badai, adalah contoh paling jelas: rencana dibuat pagi, dipantau, lalu diubah lima kali.</p>
<h3><span class='num'>2.2</span>Urutan perencanaan dari besar ke kecil (Heizer, Gambar 15.1)</h3>
<p>Rencana dibuat bertingkat: rencana kapasitas jangka panjang (berapa pesawat dan hangar) → rencana agregat beberapa bulan (berapa kursi dan kru musim ini) → jadwal induk mingguan (jadwal penerbangan) → kebutuhan komponen (MRP) → jadwal harian dan jam-jaman (<i>short-term scheduling</i>). Tiap tingkat menurunkan rencana ke tingkat di bawahnya. ERP adalah "lem" datanya.</p>
<h3><span class='num'>2.3</span>MRP lebih dalam (Heizer, Bab 14; Slack, Bab 14)</h3>
<ul>
<li><b>Lima bahan yang harus ada:</b> jadwal induk (<i>master production schedule</i>), daftar komponen (<i>bill of material</i>), catatan stok yang akurat, daftar barang yang sedang dipesan (<i>purchase orders outstanding</i>), dan lama pemesanan (<i>lead time</i>).</li>
<li><b>Cara kerjanya (gross-to-net):</b> kebutuhan kotor dikurangi stok dan barang yang akan datang = kebutuhan bersih. Kebutuhan bersih dijadwalkan sebagai penerimaan, lalu waktu pemesanannya dimundurkan sebesar lead time (<i>lead-time offsetting</i>).</li>
<li><b>Berapa yang dipesan (lot sizing):</b> <i>lot-for-lot</i> = pesan persis sebesar kekurangan. Ini yang kita pakai di contoh, karena kebutuhannya sudah pasti dari jadwal.</li>
<li><b>Kelemahan MRP dasar:</b> ia tidak menghitung kapasitas (<i>infinite loading</i>); rencana bisa tersusun walau hangar dan teknisinya tidak cukup. Perbaikannya: <i>closed-loop MRP</i> dan MRP II, yang memasukkan kapasitas, tenaga kerja, dan biaya. Tailsight (slide 9) adalah contoh nyata.</li>
<li><b>MRP di perusahaan jasa:</b> Heizer memberi contoh restoran (resep sebagai daftar bahan), rumah sakit (bedah), dan hotel (renovasi kamar). Di maskapai, daftar pekerjaan perawatan (<i>task card</i>) memainkan peran daftar bahan sekaligus daftar jam kerja.</li>
</ul>
<h3><span class='num'>2.4</span>ERP lebih dalam (Heizer, Bab 14; Slack, Bab 14)</h3>
<ul>
<li><b>Tiga kemampuan:</b> mengotomatisasi dan menghubungkan proses bisnis; satu basis data dan satu cara kerja untuk semua bagian; informasi tersedia seketika (<i>real time</i>). Prinsipnya: data dimasukkan sekali saja.</li>
<li><b>Manfaat:</b> bagian-bagian perusahaan bekerja dengan data yang sama (<i>commonality of databases</i>), komunikasi lebih mudah, proses mengikuti praktik terbaik, dan bisa menjadi keunggulan bersaing.</li>
<li><b>Kelemahan:</b> sangat mahal (menyesuaikan perangkat lunak bisa lima kali harga belinya), memaksa perusahaan mengubah cara kerja, sangat rumit, pekerjaannya tidak pernah benar-benar selesai, dan ahlinya langka.</li>
<li><b>Pelajaran Slack:</b> yang menentukan keberhasilan bukan teknologinya, melainkan kedisiplinan proses dan kesiapan organisasi. Rapikan proses dulu, baru satukan sistem. Ini dasar rekomendasi 4.</li>
</ul>
<h3><span class='num'>2.5</span>Scheduling lebih dalam (Heizer, Bab 15)</h3>
<ul>
<li><b>Mengapa penting:</b> jadwal yang baik membuat aset lebih banyak terpakai (biaya turun) dan layanan lebih cepat dan andal.</li>
<li><b>Dua arah:</b> <i>forward scheduling</i> = mulai secepatnya begitu kebutuhan diketahui; <i>backward scheduling</i> = mundur dari tenggat. Truk deicing yang disiapkan jam 10 untuk hujan beku jam 17 adalah penjadwalan berdasarkan prakiraan.</li>
<li><b>Dua cara membebani:</b> <i>finite loading</i> = hanya sampai batas kapasitas; <i>infinite loading</i> = tanpa melihat kapasitas.</li>
<li><b>Finite capacity scheduling (FCS):</b> penjadwalan dengan komputer yang menghitung kapasitas dan aturan sekaligus, dan bisa dicoba-coba (<i>what-if</i>). Pengaturan kru Alaska dengan batas jam kerja FAA adalah contohnya.</li>
<li><b>Cyclical scheduling:</b> cara mengatur staf yang kebutuhannya beda tiap hari, dengan libur dua hari berurutan, supaya jumlah stafnya minimum. Dipakai untuk perawat, polisi, kasir, petugas gate. Langkahnya di bagian 7.3.</li>
</ul>
<h3><span class='num'>2.6</span>Sequencing lebih dalam (Heizer, Bab 15)</h3>
<p><b>Empat aturan urutan:</b> FCFS (yang datang dulu), SPT (yang tercepat dulu), EDD (yang tenggatnya paling dekat dulu), LPT (yang terlama dulu). <b>Empat ukuran untuk membandingkannya:</b></p>
<div class='formula'>Waktu selesai rata-rata = jumlah waktu alir ÷ jumlah pekerjaan<br>Utilisasi = jumlah waktu pengerjaan ÷ jumlah waktu alir<br>Jumlah pekerjaan rata-rata yang ada di sistem = jumlah waktu alir ÷ jumlah waktu pengerjaan<br>Keterlambatan rata-rata = jumlah keterlambatan ÷ jumlah pekerjaan, dengan keterlambatan = 0 kalau selesai sebelum tenggat</div>
<p>"Waktu alir" artinya kapan sebuah pekerjaan selesai, dihitung dari saat antrean dimulai. <b>Critical ratio</b> = sisa waktu sampai tenggat ÷ sisa hari kerja; kalau kurang dari 1 berarti sudah tertinggal dan harus didahulukan. <b>Johnson's rule</b> dipakai kalau setiap pekerjaan harus melewati dua tahap berurutan: pekerjaan yang tahap pertamanya singkat ditaruh di awal, yang tahap keduanya singkat ditaruh di akhir. Hasilnya total waktu selesai (<i>makespan</i>) paling pendek. Catatan penting: tidak ada aturan yang paling baik untuk semua ukuran.</p>""")

M.append("""<div class='pb'></div><h2>3. Kenalan dengan kasusnya (slide 3–5)</h2>
<p><b>Siapa Alaska Airlines.</b> Maskapai dari Seattle, bagian dari Alaska Air Group bersama Horizon Air dan, sejak September 2024, Hawaiian Airlines. Pada 29 Oktober 2025 FAA memberi satu sertifikat operasi untuk Alaska dan Hawaiian: secara hukum keduanya kini satu operasi dengan dua merek. Basis kru ada di Seattle, Anchorage, Portland, San Francisco, Los Angeles, San Diego, dan Honolulu.</p>
<p><b>Lingkungannya.</b> Bandara Seattle–Tacoma (SEA) termasuk 15 tersibuk di Amerika, hujannya sekitar 5 inci per bulan di musim dingin, tetapi punya rekor keberangkatan tepat waktu tertinggi di Amerika (85,8%). Heizer menulis bahwa sebagian besar kreditnya untuk Alaska, yang menerbangkan lebih dari separuh penerbangan domestik di sana.</p>
""" + tbl(['Angka di slide 4', 'Nilai', 'Dari mana'], [
 ['Jumlah pesawat grup, akhir 2024', '392 (239 Alaska, 44 Horizon, 71 Hawaiian)', 'Aviacionline (2025)'],
 ['Tujuan; karyawan', '140 lebih; 30.000 lebih', 'Alaska Air Group fact sheet'],
 ['Pesawat yang dijadwalkan per hari (saat buku ditulis)', 'sekitar 150', 'Heizer et al. (2017, hlm. 602)'],
 ['Pilot dan awak kabin yang dijadwalkan per hari', '4.500 lebih', 'Heizer et al. (2017, hlm. 602)'],
 ['Penghematan dari teknologi penjadwalan ulang', 'US$18 juta per tahun', 'Heizer et al. (2017, hlm. 601)'],
 ['Ketepatan waktu kedatangan 2024', '79,25%, peringkat 3 Amerika Utara (Delta 83,46; United 80,93; American 77,78; Southwest 77,77)', 'Cirium 2024 On-Time Performance Review, dikutip Fox Business (Jan 2025)'],
]) + """
<p><b>Empat pengganggu rencana (slide 5).</b> (1) <b>Cuaca Seattle:</b> satu badai Desember memaksa rencana pembatalan 50–80% penerbangan. (2) <b>Geografi Alaska:</b> Juneau dikelilingi gunung dengan angin berbahaya (<i>wind shear</i>), Sitka hanya punya satu landasan di tanah sempit, dan di Kodiak landasannya berakhir di lereng gunung sehingga hanya kapten yang boleh mendarat. (3) <b>Sistem komputer gagal, 2025:</b> 20 Juli (satu perangkat keras di pusat data rusak; pesawat ditahan sekitar 3 jam; lebih dari 150 penerbangan batal) dan 23 Oktober (pusat data utama gagal; ditahan sekitar 8 jam; lebih dari 400 penerbangan batal; sekitar 49.000 penumpang terdampak). (4) <b>Larangan terbang 737 MAX 9, Januari 2024:</b> 65 pesawat diperiksa serentak, sekitar 3.000 penerbangan batal dalam sebulan, kerugian sekitar US$150 juta, mulai terbang lagi 26 Januari. Angka pembatalan sedikit berbeda antarmedia; kalau ditanya, sebut sebagai perkiraan.</p>""")

M.append("""<div class='pb'></div><h2>4. Bagian Aslih — MRP di Alaska Airlines (slide 6–9)</h2>
<h3><span class='num'>4.1</span>Dari jadwal penerbangan ke suku cadang (slide 7)</h3>
<p>Pesan utamanya: suku cadang tidak ditebak, tetapi dihitung dari jadwal. Rantainya begini.</p>
<ol>
<li><b>Jadwal penerbangan</b> adalah jadwal induk: pesawat mana terbang ke mana, berapa jam, berapa kali mendarat (siklus).</li>
<li><b>Jam terbang menentukan jadwal perawatan.</b> Setiap pesawat punya batas jam terbang sebelum harus diperiksa. Dari jadwal terbang, kita tahu kapan tiap pesawat jatuh tempo perawatan.</li>
<li><b>Setiap perawatan punya daftar pekerjaan</b> (<i>task card</i>): komponen apa yang diganti dan berapa jam kerja. Ini seperti resep: daftar bahan sekaligus lama memasak.</li>
<li><b>Kebutuhan bersih dihitung</b>: kebutuhan dikurangi stok dan barang yang sedang dalam pengiriman, lalu waktu pesannya dimundurkan sebesar lama pemesanan supaya barangnya datang pas.</li>
</ol>
<p>Kalimat kunci untuk dibawakan: kalau jadwal penerbangan berubah, jadwal perawatan ikut berubah, dan jadwal pemesanan suku cadang ikut bergeser.</p>
<h3><span class='num'>4.2</span>Cara menghitung contoh brake assembly (slide 8)</h3>
<p>Anggapan: 4 rem per paket perawatan besar; lama pesan 2 minggu; stok awal 6; 4 unit sudah dipesan dan tiba minggu 2; pesan persis sebesar kekurangan (<i>lot-for-lot</i>); rencana perawatan 2 paket di minggu 5, 1 paket di minggu 7, 2 paket di minggu 8.</p>
<ol>
<li><b>Kebutuhan kotor</b> = 4 × jumlah paket: minggu 5 → 8, minggu 7 → 4, minggu 8 → 8.</li>
<li><b>Stok akhir minggu</b> = stok sebelumnya + barang datang − pemakaian. Minggu 1: 6. Minggu 2: 6 + 4 = 10. Minggu 3 dan 4 tetap 10. Minggu 5: 10 − 8 = 2. Minggu 6: 2. Minggu 7: butuh 4, ada 2 → <b>kurang 2</b>. Minggu 8: butuh 8, ada 0 → <b>kurang 8</b>.</li>
<li><b>Kekurangan dipesan</b> supaya datang tepat di minggu 7 dan 8. Karena pesan butuh 2 minggu, pesanan 2 unit dilepas di minggu 5, pesanan 8 unit dilepas di minggu 6.</li>
</ol>
""" + tbl(['Minggu', '1', '2', '3', '4', '5', '6', '7', '8'], [
 ['Kebutuhan kotor (gross requirements)', '–', '–', '–', '–', '8', '–', '4', '8'],
 ['Barang datang yang sudah dipesan (scheduled receipts)', '–', '4', '–', '–', '–', '–', '–', '–'],
 ['Stok akhir minggu (projected on hand), awal 6', '6', '10', '10', '10', '2', '2', '0', '0'],
 ['Kekurangan (net requirements)', '–', '–', '–', '–', '–', '–', '2', '8'],
 ['Penerimaan yang direncanakan (planned order receipts)', '–', '–', '–', '–', '–', '–', '2', '8'],
 ['Pesanan dilepas (planned order releases)', '–', '–', '–', '–', '!2', '!8', '–', '–'],
]) + box('orange', 'Artinya untuk Alaska', "<p>MRP mengubah kebiasaan \"sudah waktunya pesan\" menjadi \"pesan karena memang akan dibutuhkan\". Pesan terlambat berarti pesawat menganggur menunggu barang (<i>aircraft on ground</i>, AOG). Pesan terlalu cepat berarti uang tertahan di gudang. Untuk 392 pesawat dan ribuan komponen, hitungan ini dijalankan komputer. Kalau ditanya \"kenapa lot-for-lot?\": karena kebutuhannya sudah pasti dari jadwal, jadi tidak perlu memesan lebih.</p>") + """
<h3><span class='num'>4.3</span>Januari 2024 lawan April 2026 (slide 9)</h3>
<p><b>Januari 2024.</b> Setelah insiden 5 Januari (sebuah panel pintu lepas saat terbang), FAA melarang terbang semua 737 MAX 9. Alaska harus memeriksa 65 pesawat sekaligus. Dalam bahasa MRP: kebutuhan pemeriksaan melonjak pada satu waktu, padahal hangar dan teknisinya terbatas. Karena MRP dasar tidak menghitung kapasitas, jadwal harus dirombak besar-besaran: sekitar 150 penerbangan per hari batal selama tiga minggu, kerugian sekitar US$150 juta, pesawat pertama terbang lagi 26 Januari.</p>
<p><b>April 2026.</b> Alaska mengumumkan kemitraan dengan Tailsight (16 April 2026). Tailsight menyusun rencana perawatan dengan menggabungkan data sistem perawatan, jadwal penerbangan, jumlah staf, kemampuan tiap stasiun, dan ketersediaan suku cadang, sehingga rencana yang dihasilkan sudah memperhitungkan tenaga kerja dan kesiapan pesawat. Tujuannya: teknisi dan suku cadang lebih terpakai, pesawat lebih sedikit menganggur. Tim perawatan Alaska ikut merancangnya selama dua tahun. Ini contoh nyata perencanaan yang menghitung kapasitas sejak awal (<i>closed-loop</i>). Jembatan ke Happy: alat ini hanya berguna kalau data dari banyak sistem konsisten, dan itu urusan ERP.</p>""")

M.append("""<div class='pb'></div><h2>5. Bagian Happy — ERP: sistem yang terhubung dan risikonya (slide 10–11)</h2>
<h3><span class='num'>5.1</span>Satu basis data untuk semua (slide 10)</h3>
<p>Gambar hub di slide menunjukkan lima kelompok sistem yang berbagi satu pusat data: reservasi dan <i>check-in</i>, penjadwalan kru, pengaturan penerbangan dan cuaca, perawatan dan suku cadang (di sinilah MRP bekerja), serta keuangan dan SDM. Alaska tidak mengumumkan merek perangkat lunaknya, jadi kita menyebutnya "sistem terintegrasi ala ERP" berdasarkan cara kerjanya. Infrastrukturnya campuran: pusat data sendiri untuk sistem penting, ditambah layanan cloud.</p>
<p><b>Tiga bukti manfaat.</b> (1) Saat cuaca buruk, data pesawat, kru, dan penumpang yang sama dipakai untuk menyusun jadwal baru dan mengabari penumpang dalam hitungan jam; Alaska menaksir nilainya US$18 juta per tahun. (2) Penggabungan dengan Hawaiian: satu sertifikat operasi tercapai 29 Oktober 2025 setelah setahun kerja banyak departemen; pada 2026 sistem layanan penumpangnya disatukan. Ini contoh "satu data untuk semua" dalam praktik. (3) Tailsight hanya berguna kalau data perawatan, jadwal, staf, dan suku cadang konsisten di semua sistem.</p>
<h3><span class='num'>5.2</span>Dua kali sistem mati pada 2025 (slide 11)</h3>
""" + tbl(['', '20 Juli 2025', '23 Oktober 2025'], [
 ['Apa yang terjadi', 'Satu perangkat keras di pusat data (buatan pihak ketiga, punya cadangan) rusak tiba-tiba', 'Pusat data utama gagal; Alaska menegaskan bukan serangan siber'],
 ['Akibat', 'Semua pesawat ditahan di darat sekitar 3 jam; beberapa sistem lumpuh; lebih dari 150 penerbangan batal', 'Ditahan sekitar 8 jam; lebih dari 400 penerbangan Alaska dan Horizon batal; sekitar 49.000 penumpang terdampak'],
 ['Tanggapan Alaska', 'Menyatakan sudah memperkuat sistem', 'Mendatangkan ahli luar untuk memeriksa seluruh sistem; mengganti perangkat keras pusat data'],
 ['Sumber', 'CBS News (Juli 2025)', 'GeekWire (Oktober 2025)'],
]) + box('dark', 'Pelajaran yang disampaikan', "<p>Makin terhubung sistemnya, makin besar akibat satu titik kegagalan (<i>single point of failure</i>): satu alat rusak, seluruh maskapai berhenti, bukan hanya satu bagian. Manfaat US$18 juta hanya ada kalau sistemnya hidup. Karena itu ketahanan sistem (dua pusat data yang sama-sama aktif, uji pindah sistem, prosedur manual) harus direncanakan seserius jadwal penerbangan. Ini persis kelemahan ERP menurut Heizer: rumit dan tidak pernah selesai. Kalau ditanya \"kenapa pesawat ditahan, bukan terbang manual?\": tanpa sistem, batas jam kerja kru, berat pesawat, dan data penumpang tidak bisa dipastikan; menahan pesawat lebih aman dan membuat jadwal lebih cepat pulih.</p>"))

M.append("""<div class='pb'></div><h2>6. Bagian Juan — Scheduling di Alaska Airlines (slide 12–15)</h2>
<h3><span class='num'>6.1</span>Apa yang dijadwalkan setiap hari (slide 13)</h3>
<p>Heizer (Tabel 15.1) menulis bahwa manajer Alaska menjadwalkan: perawatan pesawat; jadwal keberangkatan; kru, katering, petugas gate, dan tiket. Kita kelompokkan jadi tiga: (1) pesawat dan perawatan, (2) kru dan jadwal keberangkatan, (3) gate, tiket, katering, termasuk <i>deicing</i> (menyemprot pesawat agar tidak membeku) di musim dingin. Kru memilih jadwal lewat <i>preferential bidding system</i>, semacam sistem lelang preferensi, lalu komputer memeriksa apakah pilihan itu memenuhi batas jam kerja FAA dan kontrak serikat. Ketiganya saling terkait: kalau satu berubah, yang lain ikut berubah sampai ke puluhan bandara (<i>ripple effect</i>).</p>
<h3><span class='num'>6.2</span>Satu hari badai di Seattle (slide 14)</h3>
""" + tbl(['Jam', 'Prakiraan cuaca', 'Yang dilakukan', 'Artinya'], [
 ['04.00', 'Hujan, mungkin salju ringan', 'Rapat: bahas kondisi pesawat dan kemungkinan pembatalan', 'Menyiapkan rencana cadangan'],
 ['10.00', 'Hujan beku setelah 17.00', 'Siapkan truk deicing; susun rencana membatalkan 50–80% penerbangan setelah 18.00', 'Menyiapkan kapasitas dari prakiraan'],
 ['13.30', 'Hujan berubah jadi salju', 'Batalkan separuh penerbangan 18.00–10.00; kabari penumpang; alihkan rute pesawat', 'Mengubah rencana (control)'],
 ['17.00', 'Salju lebih sedikit dari perkiraan', 'Terus hubungi penumpang; carikan penerbangan pengganti', 'Memantau dan menyesuaikan'],
 ['22.00', 'Salju mereda', 'Carikan hotel untuk 600 penumpang yang tertahan', 'Memulihkan layanan'],
]) + """<p>Sumber: Heizer (2017, hlm. 600). Yang perlu ditekankan: lima kali rencana diubah dalam 18 jam, dan tiap perubahan langsung ditindaklanjuti. Makin dekat waktunya, makin banyak pengendalian dibanding perencanaan. Teknologi yang membantu mengatur ulang jadwal ini, menurut Alaska, menghemat US$18 juta per tahun.</p>
<h3><span class='num'>6.3</span>Pusat operasi dan pengaturan kru (slide 15)</h3>
<p><b>Flight Operations Department</b> di dekat bandara Seattle: ruangan penuh layar yang menampilkan pesawat yang sedang terbang, peta cuaca, dan radar. Ada lampu status (<i>andon</i>): hijau normal, kuning perlu perhatian, merah darurat. Dengan model matematika, tim ini menyusun jadwal pengganti, mengalihkan rute, memastikan kru tersedia, dan mengabari penumpang secepat mungkin. <b>Kru:</b> lebih dari 4.500 pilot dan awak kabin diatur dengan "program komputer besar". Batasannya: jam kerja maksimum dari FAA, kontrak serikat, dan kualifikasi khusus (di Kodiak hanya kapten yang boleh mendarat). Sistem pelatihan Fox TMS (2024) menjaga data kualifikasi kru. Jadi ini bukan sekadar menyusun jadwal, tetapi menjaga jadwal tetap sah dan bisa dijalankan saat kondisi berubah.</p>""")

rules = [('FCFS (yang datang dulu)', ['A', 'B', 'C', 'D', 'E']), ('SPT (yang tercepat dulu)', ['B', 'D', 'A', 'C', 'E']), ('EDD (tenggat terdekat dulu)', ['B', 'A', 'D', 'C', 'E']), ('LPT (yang terlama dulu)', ['E', 'C', 'A', 'D', 'B'])]
jobs = {'A': (6, 8), 'B': (2, 6), 'C': (8, 18), 'D': (3, 15), 'E': (9, 23)}
def rule_table(name, seq):
    t = 0; rows = []; sf = 0; sl = 0
    for j in seq:
        p, d = jobs[j]; t += p; late = max(0, t - d); sf += t; sl += late
        rows.append([j, p, t, d, late])
    rows.append(['<b>Jumlah</b>', '<b>28</b>', f'<b>{sf}</b>', '', f'<b>{sl}</b>'])
    summ = f"Waktu selesai rata-rata = {sf} ÷ 5 = {sf/5:.1f} hari · Utilisasi = 28 ÷ {sf} = {28/sf*100:.1f}% · Pekerjaan rata-rata di sistem = {sf} ÷ 28 = {sf/28:.2f} · Keterlambatan rata-rata = {sl} ÷ 5 = {sl/5:.1f} hari"
    return f"<p><b>{name}</b>, urutan {'–'.join(seq)}</p>" + tbl(['Pekerjaan', 'Lama (hari)', 'Selesai pada hari ke-', 'Tenggat', 'Terlambat (hari)'], rows) + f"<p class='small'>{summ}</p>"

M.append("""<div class='pb'></div><h2>7. Bagian Riska — Sequencing, staf bergilir, evaluasi, kesimpulan (slide 16–20)</h2>
<h3><span class='num'>7.1</span>Mengurutkan lima pekerjaan hangar (slide 16)</h3>
<p>Data dari Heizer Contoh 15.4, kita bayangkan sebagai lima paket pekerjaan di hangar: A (6 hari, tenggat hari ke-8), B (2, 6), C (8, 18), D (3, 15), E (9, 23). Cara membaca tabel: "selesai pada hari ke-" adalah waktu alir, yaitu hari saat pekerjaan itu selesai bila dihitung dari awal antrean. "Terlambat" = selesai dikurangi tenggat, atau 0 kalau selesai lebih cepat.</p>""" + ''.join(rule_table(n, s) for n, s in rules) +
tbl(['Aturan', 'Waktu selesai rata-rata (hari)', 'Utilisasi', 'Pekerjaan rata-rata', 'Keterlambatan rata-rata (hari)'], [
 ['FCFS', '15,4', '36,4%', '2,75', '2,2'], ['SPT', '!13,0', '!43,1%', '!2,32', '1,8'], ['EDD', '13,6', '41,2%', '2,43', '!1,2'], ['LPT', '20,6', '27,2%', '3,68', '9,6']]) +
box('lime', 'Cara membacanya, plus critical ratio', "<p>SPT menang di tiga ukuran, tetapi pekerjaan yang lama bisa terus tertunda. EDD paling sedikit terlambat. LPT paling buruk. FCFS adil tetapi tidak efisien. Untuk pesawat yang sedang menganggur (AOG) atau batas kelaikan udara, dipakai <b>critical ratio</b> = sisa waktu sampai tenggat ÷ sisa hari kerja. Contoh Heizer 15.5, hari ini hari ke-25: A tenggat hari 30 dan sisa kerja 4 hari → (30 − 25) ÷ 4 = 1,25; B tenggat 28, sisa 5 hari → 3 ÷ 5 = 0,60; C tenggat 27, sisa 2 hari → 2 ÷ 2 = 1,00. Yang di bawah 1 sudah tertinggal, jadi urutannya B, lalu C, lalu A. Angkanya dihitung ulang tiap hari, sehingga prioritas bisa berubah.</p>") + """
<h3><span class='num'>7.2</span>Johnson's rule: inspeksi lalu perbaikan (slide 17, kiri)</h3>
<p>Data dari Heizer Contoh 15.6. Lima komponen masing-masing harus diinspeksi dulu (tahap 1), baru diperbaiki dan diuji (tahap 2). Lamanya dalam jam: A 5 lalu 2, B 3 lalu 6, C 8 lalu 4, D 10 lalu 7, E 7 lalu 12. Langkahnya: cari angka terkecil di seluruh tabel. Kalau angka itu ada di tahap 1, taruh pekerjaannya paling depan; kalau di tahap 2, taruh paling belakang. Coret, ulangi.</p>
<ol><li>Angka terkecil 2 (A, tahap 2) → A paling belakang.</li><li>Berikutnya 3 (B, tahap 1) → B paling depan.</li><li>Berikutnya 4 (C, tahap 2) → C di depan A.</li><li>Sisa D (10, 7) dan E (7, 12): angka 7 ada di D tahap 2 dan E tahap 1 → E setelah B, D sebelum C.</li></ol>
<p>Urutan akhir <b>B–E–D–C–A</b>.</p>
""" + tbl(['Pekerjaan', 'Inspeksi (mulai–selesai)', 'Perbaikan (mulai–selesai)'], [['B', '0–3', '3–9'], ['E', '3–10', '10–22'], ['D', '10–20', '22–29'], ['C', '20–28', '29–33'], ['A', '28–33', '33–35']]) + """
<p>Semua selesai pada jam ke-35. Pembanding kalau urutannya A–B–C–D–E: inspeksi A 0–5, B 5–8, C 8–16, D 16–26, E 26–33; perbaikan A 5–7, B 8–14, C 16–20, D 26–33, E 33–45. Selesai jam ke-45. Jadi urutan yang tepat menghemat 10 jam, tanpa menambah orang atau alat.</p>
<h3><span class='num'>7.3</span>Jadwal bergilir petugas gate (slide 17, kanan)</h3>
<p>Data kebutuhan dari Heizer Contoh 15.8: Senin 5, Selasa 5, Rabu 6, Kamis 5, Jumat 4, Sabtu 3, Minggu 3 (total 31 orang-hari). Aturan main: setiap petugas bekerja 5 hari dan libur 2 hari berurutan. Langkahnya: (1) cari dua hari berurutan dengan jumlah kebutuhan paling kecil, jadikan hari libur petugas 1 (kalau seri, pilih Sabtu–Minggu); (2) kurangi 1 pada hari-hari yang ia kerjakan; (3) ulangi untuk petugas berikutnya sampai semua kebutuhan terpenuhi.</p>
""" + tbl(['Petugas', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min', 'Hari libur'], [
 ['P1', 5, 5, 6, 5, 4, 3, 3, 'Sab–Min'], ['P2', 4, 4, 5, 4, 3, 3, 3, 'Sab–Min'], ['P3', 3, 3, 4, 3, 2, 3, 3, 'Kam–Jum'], ['P4', 2, 2, 3, 3, 2, 2, 2, 'Sab–Min'],
 ['P5', 1, 1, 2, 2, 1, 2, 2, 'Sen–Sel'], ['P6', 1, 1, 1, 1, 0, 1, 1, 'Kam–Jum'], ['P7', 0, 0, 0, 1, 0, 0, 0, 'Sab–Min'],
 ['<b>Kapasitas</b>', '<b>6</b>', '<b>6</b>', '<b>7</b>', '<b>5</b>', '<b>5</b>', '<b>3</b>', '<b>3</b>', ''], ['<b>Kelebihan</b>', '1', '1', '1', '0', '1', '0', '0', '']]) + """
<p>Angka di tiap baris adalah kebutuhan yang masih tersisa sebelum petugas itu ditugaskan. Hasilnya: tujuh petugas cukup untuk 31 orang-hari, dengan kelebihan hanya 4 orang-hari (35 − 31). Libur: P1, P2, P4, P7 Sabtu–Minggu; P3, P6 Kamis–Jumat; P5 Senin–Selasa. Kalau ada seri, pilihan hari libur bisa berbeda dari buku, tetapi jumlah minimal petugasnya tetap tujuh. Kaitan dengan Alaska: kebutuhan petugas gate dan deicing berubah mengikuti hari dan cuaca, dan truk deicing disiapkan delapan jam sebelum hujan beku datang, jadi staf darat diatur dari prakiraan, bukan menunggu kejadian.</p>""")

M.append("""<div class='pb'></div><h2>8. Evaluasi dan rekomendasi: alasannya (slide 18)</h2>
""" + tbl(['Rekomendasi', 'Alasannya (teori)', 'Yang dilakukan', 'Cara mengukur'], [
 ['1. Perkuat ketahanan sistem terintegrasi', 'Kelemahan ERP: rumit, satu titik kegagalan; terbukti dua kali pada 2025', 'Dua pusat data yang sama-sama aktif; uji pindah sistem (<i>failover</i>) rutin; prosedur manual kalau sistem mati', 'Lama pemulihan; jumlah pesawat ditahan karena IT'],
 ['2. Rencanakan perawatan dengan menghitung kapasitas', 'MRP dasar tidak menghitung kapasitas; <i>closed-loop</i>/MRP II memperbaikinya', 'Jalankan Tailsight dengan laporan beban hangar dan suku cadang; masukkan lama pemesanan pemasok sebagai batasan', 'Jam pesawat menganggur; ketersediaan suku cadang; pemakaian jam teknisi'],
 ['3. Pakai aturan prioritas campuran di hangar', 'Tidak ada aturan yang terbaik di semua ukuran; CR dinamis; Johnson\'s rule optimal untuk dua tahap', '<i>Critical ratio</i> untuk yang mendesak; SPT untuk antrean biasa; Johnson\'s rule untuk pekerjaan dua tahap', 'Keterlambatan rata-rata; total waktu selesai'],
 ['4. Rapikan proses dulu, baru satukan sistem', 'Pelajaran Slack: keberhasilan ERP ditentukan kedisiplinan proses; penyesuaian perangkat lunak bisa 5× harganya', 'Samakan proses kru, perawatan, dan layanan penumpang sebelum Hawaiian dipindah ke sistem tunggal; batasi kustomisasi', 'Biaya kustomisasi; jumlah masalah saat perpindahan'],
]) + """
<p><b>Kalimat evaluasinya:</b> Alaska kuat dalam mengatur ulang jadwal jangka pendek dan sedang memperbaiki perencanaan perawatan agar menghitung kapasitas; kelemahan yang terbukti adalah ketahanan sistem komputer terintegrasinya.</p>
<h2>9. Pertanyaan yang mungkin muncul, dan jawabannya</h2>""" + tbl(['Pertanyaan', 'Jawaban singkat (siapa yang menjawab)'], [
 ['Alaska kan tidak memproduksi barang, kenapa pakai MRP?', 'Karena kebutuhan suku cadang dan jam teknisi bisa dihitung dari jadwal terbang; itulah <i>dependent demand</i>. Heizer juga memberi contoh MRP di restoran, rumah sakit, dan hotel. (Aslih)'],
 ['Angka contoh brake assembly dari mana?', 'Angka ilustrasi yang kami buat sederhana untuk menunjukkan cara kerjanya, bukan data internal Alaska. (Aslih)'],
 ['Alaska pakai SAP atau Oracle?', 'Alaska tidak mengumumkan mereknya. Kami menyebut "ala ERP" karena cara kerjanya: satu data bersama, dan kalau pusatnya mati semua berhenti. (Happy)'],
 ['Kalau sistem mati dua kali, apakah integrasi itu salah?', 'Tidak. Integrasinya menghasilkan manfaat besar. Yang kurang adalah ketahanannya. Solusinya cadangan dan prosedur darurat, bukan memisahkan sistem. (Happy)'],
 ['Kenapa pesawat ditahan, bukan terbang manual saja?', 'Tanpa sistem, batas jam kerja kru, berat pesawat, dan data penumpang tidak bisa dipastikan. Menahan pesawat lebih aman dan jadwal lebih cepat pulih. (Happy/Juan)'],
 ['Apa bedanya scheduling dan sequencing?', 'Scheduling: kapan dan oleh siapa. Sequencing: urutan mana dulu. Slide 13–15 scheduling, slide 16–17 sequencing. (Juan/Riska)'],
 ['Utilisasi 43,1% pada SPT dihitung bagaimana?', 'Total lama pengerjaan 28 hari dibagi total waktu alir 65 hari = 0,431. Tabelnya di bagian 7.1. (Riska)'],
 ['Kalau SPT terbaik di tiga ukuran, kenapa tidak pakai SPT saja?', 'SPT bisa terus menunda pekerjaan lama dan mengabaikan tenggat. Untuk keselamatan, tenggat lebih penting, jadi dipakai campuran aturan. (Riska)'],
 ['Johnson\'s rule bisa untuk tiga tahap?', 'Tidak langsung. Untuk tiga tahap ada perluasan dengan syarat khusus; lebih dari itu dipakai perangkat lunak penjadwalan. (Riska)'],
 ['Angka ketepatan waktu 2024 dari mana?', 'Cirium, 2024 On-Time Performance Review, dikutip Fox Business Januari 2025: Alaska 79,25%, peringkat 3 Amerika Utara. (Aslih)'],
 ['Topik kelompok ini bukan hanya sequencing and scheduling?', 'Silabus Sesi 7 memuat dua subtopik; kami membahas keduanya, dengan porsi lebih besar pada penjadwalan karena itulah inti profil Alaska di buku Heizer. (Aslih)'],
]) + """
<h2>10. Kamus istilah</h2>""" + tbl(['Istilah', 'Arti sederhana'], [
 ['Dependent demand', 'Kebutuhan yang bisa dihitung dari kebutuhan lain, jadi tidak perlu diramal'],
 ['Master schedule', 'Jadwal induk; di Alaska: jadwal penerbangan dan jadwal perawatan'],
 ['Bill of material / task card', 'Daftar komponen (dan jam kerja) untuk satu pekerjaan; seperti resep'],
 ['Gross / net requirements', 'Kebutuhan kotor sebelum dikurangi stok / kekurangan setelah dikurangi stok'],
 ['Lead time', 'Lama menunggu sejak memesan sampai barang datang'],
 ['Lot-for-lot', 'Memesan persis sebesar kekurangan'],
 ['Infinite / finite loading', 'Menjadwalkan tanpa melihat kapasitas / hanya sampai batas kapasitas'],
 ['Closed-loop MRP, MRP II', 'MRP yang sudah memperhitungkan kapasitas, tenaga kerja, dan biaya'],
 ['ERP', 'Satu sistem dengan satu basis data untuk semua bagian perusahaan'],
 ['Single point of failure', 'Satu bagian yang kalau rusak, semuanya berhenti'],
 ['Forward / backward scheduling', 'Menjadwalkan maju dari sekarang / mundur dari tenggat'],
 ['FCFS, SPT, EDD, LPT', 'Aturan urutan: datang dulu, tercepat dulu, tenggat terdekat dulu, terlama dulu'],
 ['Critical ratio', 'Sisa waktu dibagi sisa pekerjaan; di bawah 1 berarti sudah tertinggal'],
 ['Johnson\'s rule', 'Cara mengurutkan pekerjaan yang melewati dua tahap supaya total waktunya paling pendek'],
 ['Makespan', 'Total waktu sampai semua pekerjaan selesai'],
 ['Cyclical scheduling', 'Jadwal bergilir staf dengan libur dua hari berurutan'],
 ['Andon', 'Lampu status: hijau, kuning, merah'],
 ['AOG (aircraft on ground)', 'Pesawat tidak bisa terbang karena menunggu perbaikan atau komponen'],
 ['Ground stop', 'Perintah menahan semua pesawat di darat'],
 ['Single operating certificate', 'Satu izin operasi dari FAA untuk dua maskapai yang digabung'],
]) + """
<h2>11. Daftar sumber</h2>
<ul>
<li>Heizer, J., Render, B., &amp; Munson, C. (2017). <i>Operations management: Sustainability and supply chain management</i> (12th ed.). Pearson. Bab 14 dan 15; profil Alaska Airlines hlm. 600–602; Tabel 15.1; Contoh 15.4, 15.5, 15.6, 15.8.</li>
<li>Slack, N., Brandon-Jones, A., &amp; Burgess, N. (2022). <i>Operations management</i> (10th ed.). Pearson. Bab 10 dan 14.</li>
<li>Alaska Airlines. (2026, 16 April). <i>Alaska Airlines and Tailsight launch AI-powered maintenance planning solution</i>. news.alaskaair.com.</li>
<li>Alaska Airlines. (2025, 29 Oktober). <i>Alaska Airlines and Hawaiian Airlines reach major integration milestone: A single operating certificate</i>. news.alaskaair.com.</li>
<li>Alaska Air Group. (t.t.). <i>Alaska Air Group fact sheet</i>. news.alaskaair.com.</li>
<li>Cirium. (2025, Januari). <i>2024 On-Time Performance Review</i>; dikutip Fox Business, "Delta, United, Alaska tops in North America for on-time performance".</li>
<li>GeekWire. (2025, Oktober). <i>After latest outage disrupts 49,000 passengers, Alaska Airlines vows to diagnose "our entire IT infrastructure"</i>.</li>
<li>CBS News. (2025, 20 Juli). <i>Alaska Airlines requests system-wide ground stop due to IT outage</i>.</li>
<li>CNBC. (2024, 25 Januari). <i>Alaska Airlines says Boeing 737 Max 9 grounding will cost it $150 million</i>; Anchorage Daily News. (2024, 6 Januari). <i>Alaska Airlines cancels more than 90 flights after grounding Boeing Max 9s</i>.</li>
<li>Aviacionline. (2025). <i>Alaska Airlines ends 2024 with $395 million in profit following the integration of Hawaiian Airlines</i>.</li>
<li>Halldale. (2024, Juli). <i>Alaska Airlines optimizes AQP with Fox TMS</i>.</li>
</ul>""")

open(os.path.join(OUT, 'materi.html'), 'w').write(page('Materi Pemahaman — Planning and Control di Alaska Airlines', ''.join(M)))

# ================================================================ NASKAH PRESENTASI
N = []
dur = {'Aslih': 0, 'Happy': 0, 'Juan': 0, 'Riska': 0}
for _, p, d, _, _, _ in NASKAH:
    m, s = d.split(':'); dur[p] += int(m) * 60 + int(s)
tot = sum(dur.values())
fmt = lambda s: f"{s // 60}:{s % 60:02d}"
N.append(cover('Naskah Presentasi · Operations &amp; Technology Management · Sesi 7', 'Planning and Control di', 'Alaska Airlines',
               f'Naskah lisan per slide untuk 20 slide, total sekitar {fmt(tot)} menit ditambah tanya jawab. Urutan: Aslih (MRP) → Happy (ERP) → Juan (scheduling) → Riska (sequencing).',
               f"<p class='small'>Durasi per presenter: Aslih {fmt(dur['Aslih'])} · Happy {fmt(dur['Happy'])} · Juan {fmt(dur['Juan'])} · Riska {fmt(dur['Riska'])}. Naskah yang sama tertanam di catatan pembicara berkas PPTX (tampilan Presenter View).</p>"))
N.append("""<div class='pb'></div><h2>Petunjuk singkat</h2>
<ul><li>Naskah ini untuk dibicarakan, bukan dibaca. Pahami urutan gagasannya, lalu sampaikan dengan kata-kata sendiri. Yang ada di slide cukup sebagai pegangan.</li>
<li>Pergantian presenter ditandai kalimat jembatan di akhir slide. Presenter berikutnya cukup mengucap "Terima kasih" singkat, lalu langsung ke isi.</li>
<li>Angka yang perlu dihafal: 392 pesawat; 4.500 lebih kru; 85,8% keberangkatan tepat waktu di SEA; 79,25% ketepatan kedatangan 2024 (peringkat 3); US$18 juta per tahun; 65 pesawat MAX 9; US$150 juta; sistem mati 20 Juli (3 jam, 150 lebih pembatalan) dan 23 Oktober 2025 (8 jam, 400 lebih pembatalan, 49 ribu penumpang); sertifikat tunggal 29 Oktober 2025; Tailsight 16 April 2026.</li>
<li>Istilah bahasa Inggris tetap dipakai seperti di buku (<i>master schedule</i>, <i>lead time</i>, <i>closed-loop</i>, <i>single point of failure</i>, <i>critical ratio</i>, Johnson's rule), tetapi selalu diikuti penjelasan singkat dalam bahasa sehari-hari.</li>
<li>Tanya jawab: pertanyaan dijawab oleh pemilik bagian. Daftar pertanyaan yang mungkin muncul ada di bagian 9 Materi Pemahaman.</li></ul>""")
cur = None
for n, p, d, title, text, note in NASKAH:
    if p != cur:
        cur = p
        full = next(x for x in PRESENTERS if x[0].startswith(p))
        N.append(f"<h2>{p} — {html.escape(full[2])}</h2>")
    N.append(f"<div class='slide pres-{p[0]}'><div class='head'><span class='tag o'>Slide {n}</span><h3>{html.escape(title)}</h3><span class='meta'><span class='tag g'>{p}</span> <span class='tag'>{d} menit</span></span></div><div class='script'>{html.escape(text)}</div><div class='note'><b>Catatan penyampaian:</b> {html.escape(note)}</div></div>")
open(os.path.join(OUT, 'naskah.html'), 'w').write(page('Naskah Presentasi — Planning and Control di Alaska Airlines', ''.join(N)))
print('ok', tot)
