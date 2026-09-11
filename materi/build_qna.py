# -*- coding: utf-8 -*-
"""
Dokumen tanya jawab untuk sidang studi kasus 4 (Amazon, Kelompok 4).
25 pertanyaan kritis dengan jawaban singkat, jawaban lengkap, rujukan slide,
serta lembar contekan angka dan kalimat penyelamat.
Jalankan:  python3 build_qna.py
"""
import os
from docx import Document
from docx.shared import Pt, RGBColor, Cm
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "Tanya_Jawab_Studi_Kasus_4_Amazon_Kelompok_4.docx")
BLACK = RGBColor(0x1A, 0x1A, 0x1A)
GRAY = RGBColor(0x5F, 0x5F, 0x5F)
MAGENTA = RGBColor(0xC4, 0x18, 0x5C)
PINK = "F6D5DA"
ABU = "F0F0F0"

# (kode, pertanyaan, jawaban singkat, jawaban lengkap [paragraf], rujukan, penjawab)
QNA = [
    # ---------------------------------------------------------------- A
    ("A1", "Slide perkembangan terbaru menyebut Amazon memecah jaringan menjadi delapan wilayah. "
           "Bukankah menurut teori konsolidasi persediaan, memecah stok ke banyak lokasi justru "
           "menaikkan total safety stock? Kenapa Amazon melakukan kebalikan dari teori?",
     "Betul, total safety stock memang naik. Amazon menerima kenaikan itu karena ditukar dengan "
     "ongkos kirim yang turun dan waktu kirim yang lebih pendek.",
     ["Teorinya benar dan kami akui. Kalau permintaan dipecah ke banyak lokasi, simpangan baku per "
      "lokasi tidak ikut turun secara proporsional, sehingga total stok pengaman sistem naik kira-kira "
      "sebanding dengan akar jumlah lokasi. Menggabungkan stok di satu titik memang meminimalkan stok.",
      "Tetapi konsolidasi hanya optimal kalau yang diperhitungkan cuma biaya simpan. Begitu ongkos "
      "kirim dan waktu kirim ikut masuk, hasilnya berubah. Satu gudang pusat berarti jarak kirim panjang, "
      "ongkos per paket naik, dan janji satu sampai dua hari tidak mungkin dipenuhi.",
      "Jadi ini pertukaran antara tambahan biaya simpan di satu sisi, melawan penghematan ongkos kirim "
      "dan kecepatan di sisi lain. Amazon menilai sisi kedua lebih besar.",
      "Ada satu syarat yang membuat pilihan ini masuk akal untuk Amazon dan belum tentu untuk perusahaan "
      "lain. Volume per wilayah harus cukup besar, supaya koefisien variasi permintaan tiap wilayah tetap "
      "kecil. Kalau volumenya kecil, permintaan jadi tidak stabil, dan denda dari memecah stok menjadi mahal.",
      "Bukti bahwa pilihan ini berhasil ada pada angkanya sendiri: 76 persen permintaan bisa dipenuhi dari "
      "dalam wilayah, artinya sebagian besar paket tidak perlu menyeberang wilayah."],
     "Slide 20 dan slide 18", "Aulia"),

    ("A2", "Aturan Anda berbunyi tambah stok bila biaya kekosongan lebih besar dari biaya simpan. "
           "Itu perbandingan nilai total atau nilai marjinal?",
     "Yang di slide adalah versi sederhana untuk audiens. Bentuk yang benar adalah marjinal.",
     ["Kami akui slide menyederhanakannya supaya mudah diikuti. Kalau dibaca sebagai perbandingan total, "
      "aturan itu memang tidak tepat, karena akan selalu menyuruh menambah stok tanpa batas.",
      "Bentuk yang benar adalah marjinal. Tambah satu unit selama ekspektasi manfaatnya masih lebih besar "
      "dari biaya menyimpan unit itu. Manfaat marjinalnya adalah peluang terjadi kekurangan dikalikan biaya "
      "kekurangan per unit.",
      "Bentuk bakunya di buku adalah rasio kritis, yaitu biaya kekurangan dibagi jumlah biaya kekurangan dan "
      "biaya kelebihan. Hasilnya adalah service level optimal. Dari service level itu baru diambil nilai z, "
      "lalu stok pengaman dihitung sebagai z dikali simpangan baku permintaan dikali akar lead time.",
      "Untuk Amazon, biaya kekurangan tinggi karena bukan hanya penjualan yang hilang, tetapi juga janji layanan "
      "yang rusak. Rasio kritisnya mendekati satu, sehingga service level optimalnya memang tinggi dan stoknya besar. "
      "Kesimpulan di slide tetap berlaku, hanya alasannya yang perlu ditulis lebih tepat."],
     "Slide 18", "Bagaskoro"),

    ("A3", "Slide menyebut nilai persediaan bisa mencapai 50 persen dari total modal. "
           "Berapa sebenarnya porsi persediaan Amazon?",
     "Angka 50 persen itu patokan umum dari buku, bukan angka Amazon. Porsi persediaan Amazon justru "
     "kecil, sekitar satu digit persen dari total aset.",
     ["Kami perlu meluruskan ini. Angka 50 persen adalah rule of thumb yang dipakai buku untuk menggambarkan "
      "betapa besarnya persediaan pada banyak perusahaan, terutama manufaktur dan ritel konvensional.",
      "Untuk Amazon sendiri porsinya jauh lebih kecil, sekitar enam sampai tujuh persen dari total aset, karena "
      "aset Amazon didominasi pusat data, gudang, dan peralatan. Angka ini perlu diverifikasi dari laporan "
      "tahunan sebelum dikutip sebagai data resmi.",
      "Jadi argumen yang benar bukan porsinya, melainkan nilai absolutnya. Persediaan Amazon bernilai puluhan "
      "miliar dolar, dan itu tetap investasi yang besar dan berisiko, meskipun porsinya terhadap total aset kecil.",
      "Justru porsi yang kecil ini memperkuat argumen kami. Artinya Amazon berhasil melayani dua ratus juta jenis "
      "barang tanpa menumpuk modal secara berlebihan di persediaan."],
     "Slide 16", "Fitra"),

    ("A4", "Anda berargumen Amazon tidak mau bergantung pada pihak ketiga. Tetapi slide lain menyebut "
           "60 persen paket dikirim lewat USPS. Bukankah itu bertentangan?",
     "Tidak bertentangan, karena yang dikendalikan sendiri adalah stok dan proses gudang, sedangkan "
     "pengiriman jarak akhir dibeli.",
     ["Pertanyaan yang tepat sasaran, dan pembedanya ada pada apa yang menentukan janji layanan.",
      "Tiga janji Amazon adalah harga murah, kirim cepat, dan bebas kesalahan. Yang menentukan benar salahnya "
      "isi paket adalah proses di gudang, bukan kurirnya. Yang menentukan apakah paket bisa berangkat hari itu "
      "juga proses gudang dan posisi stoknya. Karena itu dua hal ini dikendalikan sendiri.",
      "Pengangkutan jarak akhir berbeda sifatnya. Jasanya standar, tarifnya transparan, kinerjanya bisa diukur, "
      "dan ada banyak penyedia yang bisa dibandingkan. Membangun sendiri justru menaikkan biaya tanpa menambah "
      "kendali atas akurasi pesanan.",
      "Rumusan singkatnya: Amazon mengendalikan bagian yang menentukan janji, dan membeli bagian yang tidak.",
      "Perlu ditambahkan bahwa posisinya sekarang sudah bergeser. Amazon membangun armada logistiknya sendiri, "
      "dan porsi USPS menurun dibanding era kasus ini. Artinya begitu skalanya cukup, bagian yang tadinya dibeli "
      "pun bisa menjadi layak dikerjakan sendiri. Ini konsisten dengan aturan otomasi kami: penentunya volume."],
     "Slide 9, slide 12, dan slide 17", "Aulia"),

    ("A5", "Anda menulis kesalahan mendekati nol. Mendekati nol itu berapa? "
           "Apakah ada angkanya, misalnya tingkat kesalahan per sejuta pesanan?",
     "Kasus tidak menyebutkan angkanya. Yang disebut adalah mekanismenya, bukan hasil ukurnya.",
     ["Kami harus jujur bahwa angka itu tidak ada dalam kasus, dan kami tidak ingin mengarang.",
      "Yang disebut kasus adalah mekanisme pengendaliannya: bar code dipindai sampai lima belas kali di sepanjang "
      "proses, pencocokan bar code dengan nomor pesanan saat pengelompokan, dan penimbangan paket sebagai "
      "pemeriksaan terakhir sebelum dikirim.",
      "Kalau kelompok kami harus mengusulkan ukuran yang tepat, kami akan memakai tingkat kesalahan pemenuhan "
      "per sejuta pesanan, dipecah menjadi tiga jenis: barang salah, jumlah salah, dan barang kurang. Tiga angka "
      "itu yang seharusnya dipantau, bukan klaim kualitatif.",
      "Kami akan memperbaiki kalimat di slide menjadi mekanisme kontrol berlapis, bukan klaim mendekati nol, "
      "supaya tidak ada klaim tanpa dasar ukur."],
     "Slide 17 dan slide 21", "Fitra"),

    # ---------------------------------------------------------------- B
    ("B1", "Anda menyebut penghematan US$400 sampai 900 juta per tahun dan US$0,70 sampai 1,50 per pesanan. "
           "Coba turunkan angkanya, apakah kedua angka itu konsisten?",
     "Konsisten. Kedua angka itu menyiratkan sekitar 575 sampai 600 juta pesanan per tahun, "
     "dan biaya proses awal sekitar tiga setengah dolar per pesanan.",
     ["Kami sudah mengujinya dengan dua cara.",
      "Pertama, jumlah pesanan yang tersirat. Penghematan terendah dibagi penghematan per pesanan terendah "
      "menghasilkan sekitar 571 juta pesanan. Penghematan tertinggi dibagi penghematan per pesanan tertinggi "
      "menghasilkan 600 juta pesanan. Keduanya jatuh di kisaran yang sama, jadi angkanya saling mendukung.",
      "Kedua, biaya proses awal per pesanan. Kalau hemat 0,70 dolar setara penurunan 20 persen, biaya awalnya "
      "3,50 dolar. Kalau hemat 1,50 dolar setara penurunan 40 persen, biaya awalnya 3,75 dolar. Rentangnya sempit "
      "dan wajar untuk biaya ambil, sortir, dan kemas per pesanan.",
      "Jadi tiga angka di slide, yaitu persentase, penghematan per pesanan, dan penghematan tahunan, saling "
      "konsisten dan menggambarkan periode awal penerapan Kiva, bukan kondisi Amazon hari ini."],
     "Slide 14 dan slide 15", "Fitra"),

    ("B2", "Kalau satu pesanan memerlukan tenaga kerja kurang dari tiga menit dan satu gudang mengeluarkan "
           "200 ribu barang per hari, berapa pekerja yang dibutuhkan satu gudang?",
     "Sekitar enam ratus pekerja per hari, dan angka itu wajar untuk ukuran gudang Amazon.",
     ["Kami hitung dengan asumsi yang kami sebutkan terbuka.",
      "Dua ratus ribu barang per hari, dengan 70 persen pesanan berisi lebih dari satu barang, kalau rata-rata "
      "dua barang per pesanan, berarti sekitar seratus ribu pesanan per hari.",
      "Seratus ribu pesanan dikali tiga menit sama dengan tiga ratus ribu menit, atau lima ribu jam kerja per hari. "
      "Dibagi delapan jam per shift, hasilnya sekitar 625 orang.",
      "Angka itu masuk akal dibanding ukuran gudang Amazon yang umumnya mempekerjakan seribu sampai seribu lima "
      "ratus orang, karena tidak semua pekerja ada di jalur pemenuhan pesanan. Ada bagian penerimaan barang, "
      "penyimpanan, pemeliharaan, dan pengawasan.",
      "Yang perlu ditekankan, tiga menit itu jam kerja yang dipakai, bukan lamanya pesanan berada di dalam gudang. "
      "Dua hal itu berbeda dan kami bahas di slide 13."],
     "Slide 10 dan slide 13", "Fitra"),

    ("B3", "Berapa perputaran persediaan Amazon, dan bagaimana dibandingkan pesaingnya?",
     "Angka itu tidak ada dalam kasus, jadi kami tidak memasukkannya ke analisis.",
     ["Kami tidak menemukan angka perputaran persediaan di dalam kasus, dan kami memilih tidak mengutip angka "
      "yang belum kami verifikasi.",
      "Kalau harus diperkirakan dari laporan tahunan, perputaran persediaan Amazon berada di kisaran delapan "
      "sampai sepuluh kali per tahun, tetapi ini perlu dicek langsung ke laporan keuangan sebelum dipakai.",
      "Yang bisa kami katakan dengan yakin dari kasus adalah arah logikanya. Rasio ini akan tinggi untuk barang "
      "terlaris yang disimpan di fasilitas same-day, dan rendah untuk barang ekor panjang yang jarang dipesan. "
      "Satu angka rata-rata justru menyembunyikan perbedaan ini.",
      "Karena itu, menurut kami ukuran yang lebih tepat untuk Amazon bukan perputaran keseluruhan, melainkan "
      "perputaran per kelas barang berdasarkan analisis ABC."],
     "Tidak ada di deck; jawab dengan jujur", "Fitra"),

    ("B4", "Angka carrying cost 26 persen per tahun itu berasal dari mana, dan apakah cocok dipakai untuk Amazon?",
     "Itu angka contoh dari buku, susunan beberapa komponen biaya. Untuk Amazon komposisinya berbeda.",
     ["Angka 26 persen di buku adalah penjumlahan beberapa komponen, yaitu biaya gedung dan penyimpanan, "
      "biaya penanganan bahan, tenaga kerja gudang, biaya modal yang tertahan, serta kehilangan dan penyusutan. "
      "Itu contoh tipikal, bukan angka satu perusahaan tertentu.",
      "Untuk Amazon, komposisinya akan berbeda dan tidak seragam antarbarang. Untuk elektronik dan fesyen, "
      "komponen keusangan dan penurunan harga jauh lebih besar daripada untuk buku atau barang rumah tangga.",
      "Konsekuensinya, aturan keputusan seharusnya tidak memakai satu angka tunggal untuk semua barang. "
      "Biaya simpan per kelas barang akan menghasilkan rasio kritis yang berbeda, sehingga service level "
      "targetnya juga berbeda antarkelas.",
      "Ini justru mendukung praktik Amazon yang membedakan perlakuan seratus ribu barang terlaris dari barang lainnya."],
     "Slide 18", "Bagaskoro"),

    ("B5", "Fasilitas same-day menyimpan seratus ribu barang terlaris, dari dua ratus juta jenis barang. "
           "Itu hanya 0,05 persen. Berapa persen penjualan yang dicakup kelompok itu?",
     "Angka cakupannya tidak ada di kasus. Yang bisa kami tunjukkan adalah logika Pareto di balik pemilihannya.",
     ["Kami akui angka persentase penjualannya tidak disebut dalam kasus, dan kami tidak mau menebak angkanya.",
      "Yang bisa kami jelaskan adalah prinsipnya. Ini penerapan analisis ABC. Sejumlah kecil jenis barang menyumbang "
      "sebagian besar volume permintaan, sehingga barang itulah yang paling berharga untuk didekatkan ke pelanggan.",
      "Logikanya juga bisa dibalik untuk menguji kewajarannya. Fasilitas same-day hanya masuk akal secara biaya "
      "kalau isinya benar-benar barang dengan perputaran tinggi. Kalau cakupan penjualannya kecil, fasilitas itu "
      "akan sering menganggur dan tidak akan dibangun.",
      "Kalau kelompok kami diminta melengkapi, data yang perlu dicari adalah kurva Pareto permintaan Amazon, yaitu "
      "berapa persen permintaan yang dicakup oleh setiap kelompok barang teratas."],
     "Slide 20", "Aulia"),

    ("B6", "Anda punya aturan sendiri: otomasi layak bila penghematan per pesanan dikali volume tahunan "
           "lebih besar dari biaya otomasi. Coba terapkan aturan itu pada pembungkusan kado yang masih manual.",
     "Dengan aturan kami sendiri, pembungkusan kado memang belum layak diotomasi, karena volumenya kecil "
     "dan variasinya tinggi.",
     ["Kami senang pertanyaan ini muncul, karena justru menguji konsistensi aturan kami.",
      "Ambil contoh kasar. Satu tim manual menghasilkan tiga puluh paket per jam. Kalau otomasi menghemat "
      "misalnya setengah dolar per paket, maka untuk menutup investasi sebesar satu juta dolar dibutuhkan "
      "sekitar dua juta paket kado per tahun.",
      "Angka pembandingnya tidak ada di kasus, tetapi arahnya jelas. Pembungkusan kado hanya diminta untuk "
      "sebagian kecil pesanan, jadi volumenya jauh di bawah volume pemenuhan pesanan biasa.",
      "Ada penghalang kedua di luar volume, yaitu variasi. Bentuk dan ukuran barang sangat beragam, sehingga "
      "mesin pembungkus harus sangat fleksibel, dan itu menaikkan biaya investasinya, bukan menurunkannya.",
      "Jadi dua faktor bekerja bersamaan: volume kecil membuat sisi manfaat rendah, variasi tinggi membuat sisi "
      "biaya naik. Keputusan Amazon mempertahankan cara manual konsisten dengan aturan yang kami pakai."],
     "Slide 12 dan slide 18", "Bagaskoro"),

    # ---------------------------------------------------------------- C
    ("C1", "Anda bilang akurasi dan biaya itu sejalan, bukan saling mengorbankan. "
           "Kalau benar sejalan, kenapa tidak dipindai lima puluh kali saja?",
     "Sejalan hanya sampai titik tertentu. Setelah itu tambahan pemeriksaan lebih mahal daripada "
     "kesalahan yang dicegahnya.",
     ["Pertanyaan ini menunjukkan kalimat kami di slide kurang lengkap, dan kami setuju.",
      "Yang kami maksud sejalan adalah pada rentang yang relevan. Di titik awal, satu pemeriksaan tambahan "
      "mencegah kesalahan yang biayanya jauh lebih besar daripada biaya pemeriksaan itu. Di rentang ini, "
      "menambah kontrol menurunkan biaya total.",
      "Tetapi manfaatnya menurun. Kesalahan yang mudah ditangkap sudah tertangkap lebih dulu, sehingga pemeriksaan "
      "berikutnya menangkap semakin sedikit kesalahan, sementara biayanya tetap.",
      "Titik berhentinya adalah saat biaya satu pemeriksaan tambahan sama dengan ekspektasi biaya kesalahan yang "
      "dicegahnya. Angka lima belas kali pindai adalah hasil dari titik itu, bukan angka yang dipilih sembarangan.",
      "Jadi rumusan yang lebih tepat: akurasi dan biaya sejalan sampai titik optimal, dan setelah itu kembali "
      "menjadi pertukaran biasa."],
     "Slide 19", "Bagaskoro"),

    ("C2", "Anda menyebut 70 persen pesanan berisi banyak barang sebagai bukti flexibility. "
           "Fleksibilitas jenis apa yang Anda maksud?",
     "Yang kami maksud fleksibilitas bauran produk, yaitu kemampuan melayani banyak kombinasi barang "
     "dalam satu pesanan.",
     ["Kami akui slide tidak menyebut jenisnya, dan istilah fleksibilitas memang punya beberapa arti.",
      "Dalam pembahasan tujuan kinerja operasi, fleksibilitas biasanya dipecah menjadi fleksibilitas produk baru, "
      "bauran produk, volume, dan waktu pengiriman.",
      "Yang ditunjukkan angka 70 persen adalah fleksibilitas bauran produk. Satu sistem yang sama harus bisa "
      "menyusun kombinasi barang yang berbeda-beda untuk setiap pesanan, tanpa memperlambat prosesnya.",
      "Amazon sebenarnya juga menunjukkan fleksibilitas volume, yaitu kemampuan menyerap lonjakan pesanan pada "
      "musim puncak. Hanya saja itu kami bahas terpisah di bagian karakter operasi, bukan di slide tujuan kinerja.",
      "Kalau slide direvisi, kami akan menulisnya secara eksplisit sebagai mix flexibility."],
     "Slide 17 dan slide 10", "Fitra"),

    ("C3", "Anda memakai istilah efficient frontier. Sumbunya apa, dan bagaimana Anda tahu gudang otomatis "
           "berada di frontier tanpa data biaya alternatifnya?",
     "Sumbunya biaya per pesanan dan tingkat layanan. Kami memakainya sebagai kerangka membandingkan "
     "alternatif, bukan sebagai hasil perhitungan kuantitatif.",
     ["Kami perlu jujur soal batasnya. Kami tidak menghitung kurva frontier, karena data biaya untuk setiap "
      "alternatif tidak tersedia di kasus.",
      "Yang kami pakai adalah kerangkanya. Sumbu mendatar tingkat layanan, misalnya kecepatan dan keandalan "
      "pengiriman. Sumbu tegak biaya per pesanan. Sebuah alternatif berada di frontier kalau tidak ada alternatif "
      "lain yang sekaligus lebih murah dan lebih baik layanannya.",
      "Dengan kerangka itu, model tanpa gudang bisa disingkirkan bukan karena mahal, melainkan karena gagal "
      "memenuhi batas layanan yang dijanjikan. Alternatif yang tidak memenuhi batas tidak ikut dibandingkan.",
      "Antara gudang manual dan gudang otomatis, keunggulannya bergantung volume. Pada volume Amazon, biaya per "
      "pesanan gudang otomatis lebih rendah dengan layanan yang sama atau lebih baik, sehingga gudang manual "
      "menjadi terdominasi. Pada volume kecil, urutannya berbalik.",
      "Jadi klaim kami bersifat kualitatif dan bersyarat pada volume, bukan hasil pengukuran. Itu batas yang "
      "kami sadari."],
     "Slide 19", "Bagaskoro"),

    ("C4", "Kalau gudang dirancang untuk mampu menangani beban puncak, berapa utilisasinya di luar musim puncak, "
           "dan siapa yang menanggung kapasitas menganggur itu?",
     "Kapasitas menganggur memang ada, dan biayanya ditanggung Amazon. Yang bisa dilakukan adalah membuat "
     "sebagian kapasitas bersifat lentur.",
     ["Kami akui ini sisi yang belum dibahas di deck, dan pertanyaannya tepat.",
      "Merancang untuk beban puncak berarti di luar puncak sebagian kapasitas menganggur. Untuk ritel daring, "
      "puncaknya tajam, terutama akhir tahun, sehingga selisihnya besar.",
      "Yang bisa dilakukan adalah memisahkan kapasitas tetap dari kapasitas lentur. Bangunan, konveyor, dan robot "
      "adalah kapasitas tetap yang biayanya berjalan terus. Tenaga kerja adalah kapasitas lentur, dan di sinilah "
      "Amazon memakai pekerja musiman dalam jumlah besar menjelang puncak.",
      "Cara kedua adalah meratakan permintaan, misalnya lewat penawaran di luar musim puncak dan pilihan pengiriman "
      "yang lebih lambat tetapi lebih murah, supaya beban bisa digeser.",
      "Kalau dihubungkan dengan aturan otomasi kami, kapasitas menganggur inilah yang membuat otomasi mahal bagi "
      "perusahaan bervolume kecil. Biaya tetapnya berjalan terus meskipun pesanannya sedikit."],
     "Slide 10", "Aulia"),

    ("C5", "Persediaan Amazon ini termasuk permintaan bebas atau permintaan terikat? "
           "Model persediaan mana yang seharusnya dipakai?",
     "Permintaan bebas, sehingga model yang cocok adalah titik pesan ulang dengan stok pengaman, "
     "bukan perencanaan kebutuhan bahan.",
     ["Permintaan barang di Amazon adalah permintaan bebas, karena berasal langsung dari pelanggan akhir dan "
      "tidak diturunkan dari jadwal produksi barang lain.",
      "Karena itu pendekatannya adalah peramalan permintaan, lalu titik pesan ulang dan stok pengaman untuk "
      "meredam ketidakpastian. Perencanaan kebutuhan bahan tidak relevan di sini karena tidak ada struktur produk "
      "yang diturunkan.",
      "Ada satu hal yang membuat kasus Amazon lebih rumit dari model buku. Tujuh puluh persen pesanan berisi lebih "
      "dari satu barang, sehingga permintaan antarbarang tidak sepenuhnya saling bebas. Kalau satu barang dalam "
      "keranjang kosong, pesanan bisa pecah menjadi dua pengiriman, dan biayanya naik.",
      "Artinya ukuran layanan yang benar-benar penting bukan tingkat layanan per barang, melainkan peluang seluruh "
      "isi satu pesanan tersedia di gudang yang sama. Ini biasa disebut order fill rate, dan nilainya selalu lebih "
      "rendah daripada tingkat layanan per barang.",
      "Konsekuensinya, untuk mencapai order fill rate yang tinggi, tingkat layanan per barang harus ditetapkan "
      "lebih tinggi lagi. Ini salah satu alasan tambahan kenapa stok Amazon besar."],
     "Slide 5, slide 6, dan slide 13", "Bagaskoro"),

    ("C6", "Tiga menit per pesanan itu waktu siklus atau waktu kerja? "
           "Kalau tiga menit, kenapa pengirimannya baru sampai satu sampai dua hari?",
     "Tiga menit adalah jam kerja yang dipakai, bukan lamanya pesanan berada dalam sistem. Dua ukuran itu "
     "memang berbeda.",
     ["Ini persis alasan kami membuat slide khusus tentang dua angka yang berbeda artinya.",
      "Tiga menit adalah kandungan kerja, yaitu total jam kerja manusia yang dipakai untuk satu pesanan. Ini ukuran "
      "biaya dan produktivitas.",
      "Satu sampai dua hari adalah waktu tunggu pelanggan, yaitu selisih waktu sejak pesanan dibuat sampai barang "
      "diterima. Ini ukuran kecepatan yang dirasakan pelanggan.",
      "Selisih di antara keduanya bukan waktu kerja, melainkan waktu menunggu: menunggu batch terkumpul, menunggu "
      "di konveyor, menunggu jadwal penjemputan kurir, dan waktu perjalanan di jalan. Bagian terbesar justru ada "
      "pada pengangkutan, bukan di dalam gudang.",
      "Kalau dilihat dengan hukum Little, jumlah pesanan yang sedang berada dalam sistem sama dengan laju "
      "kedatangan dikali waktu tinggal. Mengurangi waktu tinggal berarti mengurangi pesanan yang menumpuk dalam "
      "proses, dan itu dicapai dengan memperpendek antrean, bukan dengan mempercepat tangan pekerja.",
      "Inilah alasan kami menyimpulkan kecepatan dibangun dari posisi stok dan pemendekan antrean, bukan dari "
      "menyuruh orang bekerja lebih cepat."],
     "Slide 13", "Fitra"),

    # ---------------------------------------------------------------- D
    ("D1", "Satu slide menyebut sepuluh ribu robot, slide lain menyebut lebih dari satu juta robot. "
           "Yang mana yang benar?",
     "Keduanya benar untuk waktunya masing-masing. Sepuluh ribu adalah kondisi pada kasus di buku, "
     "satu juta adalah kondisi 2025.",
     ["Kami sebutkan ini sebagai dua titik waktu yang berbeda, dan seharusnya kami tandai lebih jelas di slide.",
      "Sepuluh ribu robot adalah kondisi awal penerapan Kiva, yang menjadi dasar angka penghematan 20 sampai 40 "
      "persen per pesanan di kasus.",
      "Lebih dari satu juta robot adalah kondisi 2025, yang kami ambil dari perkembangan terbaru.",
      "Justru perbandingan ini memperkuat argumen kami. Dalam rentang waktu itu, keputusan otomasi terbukti berlanjut "
      "dan diperluas, yang berarti perhitungan kelayakannya terus terpenuhi seiring volume yang juga tumbuh.",
      "Yang perlu dijaga, angka penghematan per pesanan dari periode awal tidak boleh langsung dikalikan dengan "
      "volume hari ini, karena struktur biayanya sudah berubah."],
     "Slide 14 dan slide 20", "Aulia"),

    ("D2", "Data tahun 2023 dan 2025 yang Anda pakai berasal dari blog. "
           "Apakah itu sumber yang cukup kuat untuk analisis akademik?",
     "Sumbernya blog resmi para penulis buku yang kami pakai di kelas, jadi sejalan dengan rujukan utama. "
     "Tetapi tingkat kekuatannya memang di bawah laporan resmi perusahaan.",
     ["Kami akui keterbatasan ini dan sudah menandainya di dalam materi.",
      "Alasan kami memakainya, kasus di buku menggambarkan kondisi lebih dari satu dekade lalu. Tanpa data terbaru, "
      "pembahasan akan tertinggal jauh dari kondisi sekarang.",
      "Blog yang kami pakai ditulis oleh penulis buku yang sama, sehingga kerangka analisisnya konsisten dengan "
      "rujukan kelas. Itu alasan kami memilihnya dibanding artikel berita umum.",
      "Kalau analisis ini dilanjutkan menjadi tulisan yang lebih formal, urutan sumber yang seharusnya dipakai adalah "
      "laporan tahunan Amazon untuk data keuangan dan persediaan, lalu jurnal untuk kerangka teorinya, baru sumber "
      "sekunder untuk ilustrasi.",
      "Karena itu kami menandai setiap pernyataan sebagai eksplisit dari kasus, dari sumber lain, atau hasil "
      "inferensi kami sendiri."],
     "Slide 20", "Aulia"),

    ("D3", "Anda menyebut target Amazon adalah harga terendah. Apakah hari ini Amazon benar-benar termurah?",
     "Belum tentu. Harga terendah adalah target strategis dari kasus, bukan klaim bahwa setiap barang selalu "
     "paling murah.",
     ["Kami perlu membedakan target dengan hasil.",
      "Harga terendah adalah salah satu dari tiga target yang ditetapkan pendiri Amazon, dan target itu yang "
      "menjelaskan kenapa Amazon mengejar biaya per pesanan serendah mungkin.",
      "Sebagai kenyataan pasar, klaim itu tidak selalu berlaku. Harga di Amazon berubah-ubah, banyak barang dijual "
      "oleh pihak ketiga, dan pesaing bisa lebih murah untuk kategori tertentu.",
      "Yang lebih tepat dikatakan, Amazon menjaga struktur biayanya cukup rendah agar bisa bersaing di harga sambil "
      "tetap memenuhi janji kecepatan. Kombinasi itulah yang sulit ditiru, bukan harga termurahnya saja.",
      "Untuk analisis kami, yang penting adalah arah tekanannya. Target harga rendah memberi tekanan terus-menerus "
      "pada biaya proses, dan tekanan itulah yang mendorong otomasi."],
     "Slide 9", "Aulia"),

    # ---------------------------------------------------------------- E
    ("E1", "Apakah model Amazon ini bisa diterapkan di Indonesia, dengan kondisi kepulauan dan biaya logistik "
           "yang tinggi?",
     "Prinsipnya bisa, tetapi bentuknya harus berbeda. Mendekatkan stok justru lebih penting di Indonesia, "
     "sedangkan tingkat otomasinya harus jauh lebih rendah.",
     ["Kami pisahkan mana yang bisa ditiru dan mana yang tidak.",
      "Yang bisa ditiru adalah prinsip mendekatkan stok ke pelanggan. Di Indonesia manfaatnya justru lebih besar, "
      "karena biaya dan waktu penyeberangan antarpulau jauh lebih mahal daripada pengiriman darat di daratan Amerika. "
      "Gudang wilayah di beberapa kota besar bisa memangkas pengiriman antarpulau secara signifikan.",
      "Yang juga bisa ditiru adalah akurasi data stok. Ini investasi paling murah dengan dampak paling besar, dan "
      "tidak memerlukan robot.",
      "Yang tidak bisa langsung ditiru adalah tingkat otomasinya. Dengan aturan kami sendiri, otomasi layak kalau "
      "penghematan per pesanan dikali volume melebihi biayanya. Volume e-commerce Indonesia per gudang jauh di bawah "
      "Amazon, sementara upah tenaga kerja lebih rendah, sehingga penghematan per pesanan dari otomasi juga lebih "
      "kecil. Dua faktor ini sama-sama menekan kelayakan otomasi penuh.",
      "Karena itu urutan yang masuk akal untuk Indonesia adalah akurasi data stok dulu, lalu penempatan stok per "
      "wilayah, lalu otomasi bertahap pada proses yang paling berulang, misalnya sortir, bukan otomasi menyeluruh.",
      "Ada satu perbedaan struktural lagi. Di Indonesia pengiriman sangat bergantung pada mitra logistik pihak ketiga, "
      "sehingga keandalan pengiriman tidak sepenuhnya bisa dikendalikan. Konsekuensinya, janji layanan yang "
      "diumumkan ke pelanggan harus lebih konservatif."],
     "Slide 20 dan slide 21", "Bagaskoro"),

    ("E2", "Presentasi Anda menggambarkan Amazon secara positif dari awal sampai akhir. "
           "Apa kelemahan dan risiko dari strategi ini?",
     "Kami akui deck kami kurang menyorot sisi ini. Ada empat risiko utama: padat modal, keusangan barang, "
     "ketergantungan teknologi, dan beban kerja manusia.",
     ["Pertanyaan ini tepat, dan kami akui pembahasan kami terlalu berat ke sisi keberhasilannya.",
      "Risiko pertama, padat modal. Gudang, robot, dan persediaan adalah biaya tetap yang besar. Kalau permintaan "
      "turun, biaya tetap itu tetap berjalan, dan titik impasnya menjadi sulit dicapai. Strategi ini rapuh terhadap "
      "penurunan permintaan.",
      "Risiko kedua, keusangan barang. Menyimpan stok besar berarti menanggung risiko barang tidak laku, terutama "
      "untuk elektronik dan fesyen yang harganya turun cepat.",
      "Risiko ketiga, ketergantungan pada teknologi. Kalau sistem data stok atau sistem pengendalian robot terganggu, "
      "gudang bisa berhenti total. Cara manual masih bisa berjalan lambat saat sistem mati, gudang otomatis tidak.",
      "Risiko keempat, beban kerja manusia. Proses yang dirancang untuk kecepatan tinggi menimbulkan tekanan kerja "
      "dan risiko cedera, dan ini sudah berkali-kali menjadi sorotan publik. Efisiensi yang tidak memperhitungkan "
      "hal ini bisa berbalik menjadi biaya, baik berupa perputaran karyawan maupun reputasi.",
      "Kalau kami merevisi deck, kami akan menambahkan satu slide risiko sebelum lesson learned, supaya analisisnya "
      "berimbang."],
     "Tidak ada di deck; akui dan jawab", "Fitra"),

    ("E3", "Seluruh pembahasan Anda berhenti di gudang sampai pelanggan. Bagaimana sisi hulunya, "
           "yaitu hubungan dengan pemasok dan ketidakpastian waktu pasok?",
     "Benar, kami membatasi pembahasan pada sisi hilir. Sisi hulu memengaruhi besar stok pengaman lewat "
     "variabilitas waktu pasok.",
     ["Kami akui pembatasan ini, dan alasannya kasus di buku memang berfokus pada proses pemenuhan pesanan.",
      "Secara teori, stok pengaman dipengaruhi dua sumber ketidakpastian: ketidakpastian permintaan dan "
      "ketidakpastian waktu pasok. Kalau pemasok tidak dapat diandalkan, komponen kedua membesar, dan stok pengaman "
      "harus naik meskipun permintaannya stabil.",
      "Artinya memperbaiki keandalan pemasok adalah cara menurunkan stok tanpa menurunkan tingkat layanan. Ini "
      "sering lebih murah daripada menambah stok.",
      "Untuk Amazon, sebagian persoalan ini dialihkan lewat model penjual pihak ketiga. Barang milik penjual lain "
      "disimpan di gudang Amazon, sehingga risiko persediaannya tidak sepenuhnya ditanggung Amazon, tetapi "
      "kecepatannya tetap terjaga karena barangnya sudah ada di gudang.",
      "Soal efek bullwhip, posisi Amazon relatif menguntungkan karena melihat permintaan langsung dari pelanggan "
      "akhir tanpa perantara. Informasi permintaan yang tidak terdistorsi inilah yang menekan efek tersebut."],
     "Tidak ada di deck; jawab konseptual", "Aulia"),

    ("E4", "Kapan sebuah perusahaan justru tidak boleh meniru Amazon?",
     "Saat volumenya kecil, saat kecepatan bukan dasar bersaingnya, dan saat barangnya cepat usang atau "
     "permintaannya sangat tidak menentu.",
     ["Ada tiga keadaan yang membuat model ini keliru kalau ditiru.",
      "Pertama, volume kecil. Seluruh pembenaran otomasi Amazon bersandar pada volume. Penghematan kecil per "
      "pesanan hanya menjadi besar kalau dikalikan jumlah pesanan yang sangat banyak. Tanpa volume, biaya tetapnya "
      "justru mematikan.",
      "Kedua, kecepatan bukan dasar bersaing. Kalau pelanggan membeli karena keunikan produk, layanan kurasi, atau "
      "harga borongan, dan bersedia menunggu, maka membangun jaringan gudang untuk memangkas satu hari pengiriman "
      "adalah biaya yang tidak dibayar oleh pelanggan.",
      "Ketiga, barang cepat usang atau permintaannya sangat tidak menentu. Menyimpan stok besar di banyak lokasi "
      "untuk barang seperti ini berisiko tinggi. Model yang lebih tepat justru menunda penempatan stok sampai "
      "permintaannya lebih jelas.",
      "Dua hal yang tetap layak ditiru siapa pun, berapa pun ukurannya, adalah akurasi data stok dan pemeriksaan "
      "berlapis pada titik yang biaya kesalahannya besar. Keduanya tidak memerlukan modal besar."],
     "Slide 19 dan slide 21", "Bagaskoro"),

    ("E5", "Apa kontribusi analisis kelompok Anda, di luar meringkas apa yang sudah tertulis di kasus?",
     "Tiga hal: memisahkan tujuan dari batas, memisahkan trade-off semu dari trade-off nyata, dan menolak "
     "membaca kenaikan produktivitas 200 persen sebagai efisiensi.",
     ["Kami tidak ingin berhenti pada penyajian ulang fakta kasus, jadi ada tiga hal yang kami tambahkan.",
      "Pertama, memisahkan tujuan dari batas. Kasus menyebut Amazon menjanjikan harga rendah, kecepatan, dan bebas "
      "kesalahan. Kami menegaskan bahwa tingkat layanan adalah batas, sedangkan yang diminimalkan adalah biaya total. "
      "Pembedaan ini yang membuat stok besar bisa dinilai benar atau salah, bukan sekadar dikagumi.",
      "Kedua, memeriksa dulu apakah dua tujuan benar bertentangan. Kami menemukan dua pasangan yang sebenarnya "
      "sejalan, yaitu akurasi dengan biaya, dan kecepatan proses dengan biaya. Hanya dua yang benar-benar trade-off. "
      "Kesimpulan praktisnya, yang sejalan itu langsung dikerjakan, tidak perlu dinegosiasikan.",
      "Ketiga, menolak angka 200 persen sebagai ukuran efisiensi. Itu produktivitas satu faktor yang tidak "
      "memperhitungkan biaya robot. Kami mengganti ukurannya dengan penurunan biaya per pesanan, dan menerapkan "
      "koreksi yang sama pada angka paket per karyawan tahun 2025.",
      "Ketiga hal itu adalah cara berpikir yang bisa dipakai ke kasus lain, bukan hanya ke Amazon."],
     "Slide 16, slide 19, dan slide 15", "Fitra"),
]

HITUNGAN = [
    ("Rekonsiliasi penghematan tahunan",
     ["US$400 juta dibagi US$0,70 per pesanan  ≈  571 juta pesanan per tahun",
      "US$900 juta dibagi US$1,50 per pesanan  =  600 juta pesanan per tahun",
      "Kesimpulan: kedua angka menyiratkan 575–600 juta pesanan per tahun, saling konsisten."]),
    ("Rekonsiliasi biaya proses awal per pesanan",
     ["US$0,70 dibagi 20 persen  =  US$3,50 per pesanan",
      "US$1,50 dibagi 40 persen  =  US$3,75 per pesanan",
      "Kesimpulan: biaya ambil, sortir, dan kemas awal sekitar US$3,5–3,75 per pesanan."]),
    ("Kebutuhan tenaga kerja satu gudang",
     ["200.000 pieces per hari, rata-rata 2 item per pesanan  =  100.000 pesanan",
      "100.000 pesanan × 3 menit  =  5.000 jam kerja per hari",
      "5.000 jam dibagi 8 jam per shift  ≈  625 orang per hari"]),
    ("Titik impas otomasi (rumus yang dipakai kelompok)",
     ["Volume impas  =  biaya otomasi per tahun ÷ penghematan per pesanan",
      "Contoh: investasi US$1 juta per tahun, hemat US$0,50 per pesanan  →  2 juta pesanan per tahun",
      "Di bawah volume itu, cara manual lebih murah."]),
]

PENYELAMAT = [
    "Kalau tidak tahu angkanya: \"Angka itu tidak disebut dalam kasus, jadi kami tidak ingin menebak. "
    "Yang bisa kami jelaskan adalah mekanismenya.\"",
    "Kalau pertanyaannya membongkar kelemahan: \"Betul, itu kelemahan analisis kami. Kalau kami revisi, "
    "yang akan kami perbaiki adalah ...\"",
    "Kalau pertanyaannya di luar cakupan: \"Itu di luar batas pembahasan kami yang berfokus pada sisi hilir. "
    "Kalau boleh kami jawab secara konseptual ...\"",
    "Kalau butuh waktu berpikir: \"Boleh saya ulangi pertanyaannya untuk memastikan?\" Lalu ulangi dengan "
    "kalimat sendiri. Ini memberi waktu berpikir dan sekaligus memastikan Anda menjawab yang ditanyakan.",
    "Kalau benar-benar buntu: \"Kami belum sampai ke sana. Boleh kami catat dan kami dalami setelah ini?\" "
    "Ini jauh lebih baik daripada mengarang jawaban.",
]

ATURAN = [
    "Satu pertanyaan dijawab satu orang. Jangan saling menimpali, kecuali diminta menambahkan.",
    "Mulai dari jawaban singkat dulu, satu sampai dua kalimat. Baru lanjutkan ke uraian kalau masih ditunggu.",
    "Akui keterbatasan lebih awal, jangan setelah didesak. Mengakui lebih cepat justru menaikkan kredibilitas.",
    "Jangan membantah data dosen. Kalau beliau menyebut angka yang berbeda, catat dan tawarkan untuk mengecek ulang.",
    "Kalau jawaban Anda memakai asumsi, sebutkan asumsinya di depan, bukan disembunyikan.",
]


def shade(paragraph, hex_fill):
    pPr = paragraph._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_fill)
    pPr.append(shd)


def para(doc, text, size=11, bold=False, italic=False, color=BLACK, after=6, before=0):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold, r.italic = bold, italic
    r.font.size, r.font.color.rgb = Pt(size), color
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.space_before = Pt(before)
    return p


SEKSI = {
    "A": ("Bagian A · Lima pertanyaan paling berbahaya",
          "Lima pertanyaan ini menyerang titik terlemah deck. Kalau hanya sempat menyiapkan satu bagian, siapkan bagian ini."),
    "B": ("Bagian B · Pertanyaan angka dan perhitungan",
          "Pertanyaan yang meminta Anda menurunkan atau memverifikasi angka di layar. Hitungannya ada di lembar contekan halaman terakhir."),
    "C": ("Bagian C · Pertanyaan konsep dan definisi",
          "Pertanyaan yang menguji apakah Anda paham istilah yang Anda pakai, bukan sekadar mengutipnya."),
    "D": ("Bagian D · Pertanyaan sumber dan konsistensi",
          "Pertanyaan tentang asal data dan angka yang tampak bertentangan antarslide."),
    "E": ("Bagian E · Pertanyaan penerapan dan kritik",
          "Pertanyaan yang meminta Anda melangkah keluar dari kasus: risiko, penerapan lokal, dan kontribusi analisis."),
}


def build():
    doc = Document()
    st = doc.styles["Normal"]
    st.font.name = "Calibri"
    st.font.size = Pt(11)
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")
    for s in doc.sections:
        s.top_margin = s.bottom_margin = Cm(2.0)
        s.left_margin = s.right_margin = Cm(2.2)

    para(doc, "PERSIAPAN TANYA JAWAB", 22, bold=True, after=2)
    para(doc, "Inventory Management sebagai Keunggulan Kompetitif Amazon", 14, bold=True, color=MAGENTA, after=2)
    para(doc, "Studi Kasus 4 · Operations & Technology Management · Kelompok 4: Bagaskoro, Aulia Sisca Rahmadiyanti, Fitra Aidila", 10, color=GRAY, after=14)

    para(doc, "Cara memakai dokumen ini", 13, bold=True, after=4)
    for t in ["Dua puluh lima pertanyaan ini disusun dari titik-titik lemah yang benar-benar ada di deck final, bukan pertanyaan umum.",
              "Tiap pertanyaan punya jawaban singkat, yaitu satu sampai dua kalimat yang diucapkan lebih dulu, dan jawaban lengkap sebagai cadangan kalau masih ditunggu.",
              "Jawaban singkat dicetak dengan latar merah muda. Kalau waktu terbatas, cukup itu.",
              "Kolom penjawab hanya usulan berdasarkan pembagian slide. Silakan ditukar sesuai kesiapan masing-masing.",
              "Baca Bagian A dan lembar contekan di halaman terakhir sebelum masuk ruangan. Sisanya cukup dibaca sekali."]:
        p = doc.add_paragraph(t, style="List Bullet")
        p.paragraph_format.space_after = Pt(3)

    para(doc, "Aturan main saat sesi tanya jawab", 13, bold=True, before=12, after=4)
    for t in ATURAN:
        p = doc.add_paragraph(t, style="List Bullet")
        p.paragraph_format.space_after = Pt(3)

    para(doc, "Daftar pertanyaan", 13, bold=True, before=12, after=4)
    tbl = doc.add_table(rows=1, cols=3)
    tbl.style = "Light Grid Accent 1"
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(["Kode", "Pertanyaan (ringkas)", "Penjawab"]):
        c = tbl.rows[0].cells[i]
        c.text = ""
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
    for kode, q, _, _, _, siapa in QNA:
        ringkas = q if len(q) < 95 else q[:92].rsplit(" ", 1)[0] + " ..."
        row = tbl.add_row().cells
        for i, v in enumerate([kode, ringkas, siapa]):
            row[i].text = ""
            r = row[i].paragraphs[0].add_run(v)
            r.font.size = Pt(9)

    current = None
    for kode, q, singkat, lengkap, rujukan, siapa in QNA:
        if kode[0] != current:
            current = kode[0]
            judul, ket = SEKSI[current]
            doc.add_page_break()
            para(doc, judul, 16, bold=True, after=3)
            para(doc, ket, 10.5, italic=True, color=GRAY, after=10)

        h = para(doc, f"{kode}.  {q}", 12, bold=True, before=14, after=3)
        h.paragraph_format.keep_with_next = True

        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.12
        r = p.add_run("Jawaban singkat: ")
        r.bold = True
        r.font.size = Pt(11)
        r2 = p.add_run(singkat)
        r2.bold = True
        r2.font.size = Pt(11)
        shade(p, PINK)

        para(doc, "Jawaban lengkap:", 10, bold=True, color=GRAY, after=3)
        for line in lengkap:
            pl = doc.add_paragraph()
            pl.paragraph_format.space_after = Pt(4)
            pl.paragraph_format.line_spacing = 1.12
            pl.paragraph_format.left_indent = Cm(0.5)
            rl = pl.add_run(line)
            rl.font.size = Pt(10.5)

        pf = doc.add_paragraph()
        pf.paragraph_format.space_before = Pt(3)
        pf.paragraph_format.space_after = Pt(2)
        rf = pf.add_run(f"Rujukan: {rujukan}   ·   Penjawab: {siapa}")
        rf.italic = True
        rf.font.size = Pt(9.5)
        rf.font.color.rgb = MAGENTA

    # ---------------- lembar contekan
    doc.add_page_break()
    para(doc, "Lembar contekan", 16, bold=True, after=3)
    para(doc, "Cetak halaman ini terpisah dan pegang saat sesi tanya jawab.", 10.5, italic=True, color=GRAY, after=10)

    para(doc, "Empat hitungan yang harus bisa dilakukan di tempat", 13, bold=True, after=5)
    for judul, baris in HITUNGAN:
        para(doc, judul, 11, bold=True, before=6, after=2)
        for b in baris:
            pb = doc.add_paragraph()
            pb.paragraph_format.space_after = Pt(1)
            pb.paragraph_format.left_indent = Cm(0.5)
            rb = pb.add_run(b)
            rb.font.size = Pt(10)
            rb.font.name = "Consolas"
            rb.element.rPr.rFonts.set(qn("w:eastAsia"), "Consolas")

    para(doc, "Angka kunci dari deck", 13, bold=True, before=14, after=5)
    t2 = doc.add_table(rows=1, cols=2)
    t2.style = "Light Grid Accent 1"
    for i, h in enumerate(["Angka", "Artinya dan slidenya"]):
        c = t2.rows[0].cells[i]
        c.text = ""
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
    for a, b in [
        ("Kurang dari 3 menit", "Jam kerja per pesanan, ukuran biaya. Slide 13."),
        ("1 sampai 2 hari", "Waktu tunggu pelanggan, ukuran kecepatan. Slide 13."),
        ("150+ gudang", "Sebaran stok, dasar keputusan lokasi. Slide 5 dan 8."),
        ("200 juta item", "Keragaman barang, dasar pentingnya akurasi data. Slide 8 dan 10."),
        ("200.000 pieces per hari", "Volume satu gudang, dasar kelayakan otomasi. Slide 8 dan 10."),
        ("70 persen", "Pesanan berisi lebih dari satu barang. Slide 13 dan 17."),
        ("15 kali pindai", "Jumlah titik pemeriksaan bar code. Slide 11 dan 17."),
        ("60 persen via USPS", "Porsi pengiriman lewat mitra. Slide 12 dan 17."),
        ("100 ke 300 item per jam", "Kecepatan ambil dan pindai setelah Kiva. Slide 14."),
        ("Turun 20 sampai 40 persen", "Penurunan biaya per pesanan, ukuran multi faktor. Slide 14 dan 15."),
        ("US$0,70 sampai 1,50", "Penghematan per pesanan setelah biaya robot. Slide 15."),
        ("US$400 sampai 900 juta", "Penghematan tahunan. Slide 14."),
        ("26 persen per tahun", "Carrying cost, angka contoh dari buku. Slide 18."),
        ("8 wilayah, 76 persen", "Regionalisasi 2023 dan permintaan yang dipenuhi dari dalam wilayah. Slide 20."),
        ("175 ke 3.870 paket", "Paket per karyawan per tahun, produktivitas satu faktor. Slide 20."),
    ]:
        row = t2.add_row().cells
        for i, v in enumerate([a, b]):
            row[i].text = ""
            r = row[i].paragraphs[0].add_run(v)
            r.font.size = Pt(9.5)
            if i == 0:
                r.bold = True

    para(doc, "Tiga koreksi yang sebaiknya Anda sampaikan sendiri sebelum ditanya", 13, bold=True, before=14, after=5)
    for t in ["Angka 50 persen dari total modal adalah patokan umum buku, bukan angka Amazon.",
              "Aturan tambah stok di slide 18 adalah versi sederhana; bentuk bakunya perbandingan marjinal lewat rasio kritis.",
              "Sepuluh ribu robot dan satu juta robot adalah dua titik waktu yang berbeda, bukan angka yang bertentangan."]:
        p = doc.add_paragraph(t, style="List Number")
        p.paragraph_format.space_after = Pt(3)
        for r in p.runs:
            r.font.size = Pt(10.5)

    para(doc, "Kalimat penyelamat", 13, bold=True, before=14, after=5)
    for t in PENYELAMAT:
        p = doc.add_paragraph(t, style="List Bullet")
        p.paragraph_format.space_after = Pt(4)
        for r in p.runs:
            r.font.size = Pt(10.5)

    doc.save(OUT)
    print("ditulis:", OUT, "| jumlah pertanyaan:", len(QNA))


if __name__ == "__main__":
    build()
