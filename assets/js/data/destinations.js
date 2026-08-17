/* ============================================================
   Rute — destination library
   ------------------------------------------------------------
   Setiap harga adalah ESTIMASI per orang dalam Rupiah dan bisa
   diubah langsung di aplikasi (tab Biaya). Harga tiket di
   Indonesia sering berubah dan berbeda weekday/weekend, jadi
   perlakukan angka ini sebagai titik awal, bukan harga final.

   PRICE_SNAPSHOT menandai kapan data ini terakhir disegarkan.
   ============================================================ */

window.RUTE_DATA = (function () {
  'use strict';

  var PRICE_SNAPSHOT = 'Agustus 2026';

  /* Kategori dipakai untuk filter, ikon, dan pembagian biaya. */
  var CATEGORIES = {
    candi:    { label: 'Candi & situs',   costGroup: 'tiket' },
    kota:     { label: 'Pusat kota',      costGroup: 'tiket' },
    alam:     { label: 'Alam & bukit',    costGroup: 'tiket' },
    pantai:   { label: 'Pantai',          costGroup: 'tiket' },
    museum:   { label: 'Museum',          costGroup: 'tiket' },
    kuliner:  { label: 'Kuliner',         costGroup: 'makan' },
    belanja:  { label: 'Belanja & oleh-oleh', costGroup: 'belanja' },
    hiburan:  { label: 'Hiburan & wahana', costGroup: 'tiket' },
    petualangan: { label: 'Petualangan',  costGroup: 'aktivitas' }
  };

  /* Minat dipakai oleh generator itinerary untuk memberi skor. */
  var INTERESTS = [
    { id: 'ikonik',      label: 'Ikonik / wajib' },
    { id: 'budaya',      label: 'Budaya & sejarah' },
    { id: 'alam',        label: 'Alam & pemandangan' },
    { id: 'pantai',      label: 'Pantai' },
    { id: 'kuliner',     label: 'Kuliner' },
    { id: 'foto',        label: 'Spot foto' },
    { id: 'petualangan', label: 'Petualangan' },
    { id: 'santai',      label: 'Santai' },
    { id: 'keluarga',    label: 'Ramah anak' },
    { id: 'malam',       label: 'Suasana malam' },
    { id: 'belanja',     label: 'Belanja' },
    { id: 'sunrise',     label: 'Sunrise' },
    { id: 'sunset',      label: 'Sunset' }
  ];

  /* ----------------------------------------------------------
     p() — pembuat objek tempat, supaya datanya ringkas dibaca.
     cost      : tiket masuk per orang (Rp)
     extra     : biaya lain yang hampir selalu keluar (parkir dll)
     dur       : durasi kunjungan wajar (menit)
     open/close: jam operasional, null = 24 jam
     ---------------------------------------------------------- */
  function p(o) {
    return {
      id: o.id,
      name: o.name,
      area: o.area,
      lat: o.lat,
      lng: o.lng,
      cat: o.cat,
      cost: o.cost || 0,
      extra: o.extra || 0,
      costNote: o.costNote || '',
      dur: o.dur,
      open: o.open === undefined ? null : o.open,
      close: o.close === undefined ? null : o.close,
      tags: o.tags || [],
      rating: o.rating || 4.3,
      why: o.why || '',
      tip: o.tip || ''
    };
  }

  /* ============================================================
     YOGYAKARTA
     ============================================================ */
  var JOGJA = [
    /* --- Pusat kota & warisan Keraton --- */
    p({ id: 'jg-keraton', name: 'Keraton Yogyakarta', area: 'Kraton', lat: -7.8053, lng: 110.3642,
        cat: 'kota', cost: 15000, extra: 3000, costNote: 'wisatawan domestik', dur: 90,
        open: '08:00', close: '14:00', rating: 4.6, tags: ['ikonik', 'budaya', 'keluarga'],
        why: 'Istana Sultan yang masih dihuni; ada pertunjukan gamelan atau wayang tiap pagi sesuai hari.',
        tip: 'Tutup jam 14.00 dan loket berhenti sekitar 13.00 — jangan taruh di sore hari.' }),

    p({ id: 'jg-tamansari', name: 'Taman Sari', area: 'Kraton', lat: -7.8100, lng: 110.3593,
        cat: 'kota', cost: 15000, extra: 3000, dur: 75, open: '09:00', close: '15:00',
        rating: 4.5, tags: ['budaya', 'foto', 'ikonik'],
        why: 'Bekas pemandian kerajaan dengan Sumur Gumuling — lorong melingkar yang jadi spot foto paling dicari di Jogja.',
        tip: 'Datang sebelum jam 10 kalau mau foto Sumur Gumuling tanpa antre.' }),

    p({ id: 'jg-malioboro', name: 'Malioboro', area: 'Gedongtengen', lat: -7.7925, lng: 110.3657,
        cat: 'kota', cost: 0, extra: 5000, costNote: 'parkir', dur: 120, open: null, close: null,
        rating: 4.5, tags: ['ikonik', 'belanja', 'malam', 'kuliner', 'santai'],
        why: 'Jalan legendaris Jogja. Paling hidup setelah matahari turun: pedestrian lebar, musisi jalanan, lesehan.',
        tip: 'Sore ke malam jauh lebih nyaman daripada siang. Kendaraan dilarang parkir di badan jalan.' }),

    p({ id: 'jg-nolkm', name: 'Titik Nol Kilometer', area: 'Gondomanan', lat: -7.8006, lng: 110.3648,
        cat: 'kota', cost: 0, dur: 30, open: null, close: null,
        rating: 4.5, tags: ['ikonik', 'foto', 'malam', 'santai'],
        why: 'Simpang bersejarah dikelilingi bangunan kolonial; ramai anak muda tiap malam.',
        tip: 'Digabung saja dengan Malioboro, jaraknya cuma jalan kaki beberapa menit.' }),

    p({ id: 'jg-beringharjo', name: 'Pasar Beringharjo', area: 'Ngupasan', lat: -7.7952, lng: 110.3660,
        cat: 'belanja', cost: 0, extra: 3000, dur: 60, open: '08:30', close: '17:00',
        rating: 4.4, tags: ['belanja', 'budaya', 'kuliner'],
        why: 'Pasar batik tertua di Jogja. Lantai bawah batik dan kain, lantai atas jajanan pasar.',
        tip: 'Menawar itu normal di sini — mulai dari sekitar setengah harga yang disebut penjual.' }),

    p({ id: 'jg-alkid', name: 'Alun-Alun Kidul', area: 'Kraton', lat: -7.8127, lng: 110.3629,
        cat: 'hiburan', cost: 0, extra: 40000, costNote: 'sewa odong-odong per unit', dur: 60,
        open: null, close: null, rating: 4.3, tags: ['malam', 'keluarga', 'santai', 'foto'],
        why: 'Lapangan dua beringin dengan sepeda hias berlampu — ritual malam khas Jogja.',
        tip: 'Baru hidup setelah jam 19.00. Coba masangin — jalan dengan mata tertutup melewati dua beringin.' }),

    p({ id: 'jg-tugu', name: 'Tugu Pal Putih', area: 'Jetis', lat: -7.7828, lng: 110.3671,
        cat: 'kota', cost: 0, dur: 20, open: null, close: null,
        rating: 4.4, tags: ['ikonik', 'foto', 'malam'],
        why: 'Penanda kota yang paling difoto. Malam hari lampunya bagus dan lalu lintas lebih longgar.',
        tip: 'Menyeberang ke tugu lewat zebra cross; lalu lintasnya ramai dari empat arah.' }),

    p({ id: 'jg-sonobudoyo', name: 'Museum Sonobudoyo', area: 'Gondomanan', lat: -7.8035, lng: 110.3639,
        cat: 'museum', cost: 10000, dur: 60, open: '08:00', close: '15:30',
        rating: 4.4, tags: ['budaya', 'santai'],
        why: 'Koleksi wayang, keris, dan topeng terlengkap kedua di Indonesia. Ada pentas wayang kulit malam hari.',
        tip: 'Pentas wayang kulit malam dijual terpisah, biasanya mulai 20.00.' }),

    p({ id: 'jg-wahanarata', name: 'Wahanarata (Museum Kereta Keraton)', area: 'Kraton', lat: -7.8039, lng: 110.3609,
        cat: 'museum', cost: 20000, dur: 45, open: '08:00', close: '15:00',
        rating: 4.5, tags: ['budaya', 'keluarga'],
        why: 'Kereta kuda kerajaan yang dipugar rapi, penyajiannya modern dan sejuk.',
        tip: 'Sebelahan dengan Keraton — praktis dijadikan satu paket jalan kaki.' }),

    p({ id: 'jg-affandi', name: 'Museum Affandi', area: 'Gondokusuman', lat: -7.7828, lng: 110.3958,
        cat: 'museum', cost: 50000, extra: 3000, dur: 60, open: '09:00', close: '16:00',
        rating: 4.5, tags: ['budaya', 'santai', 'foto'],
        why: 'Rumah dan galeri sang maestro, berbentuk daun pisang di tepi Sungai Gajah Wong.',
        tip: 'Harga tiket sudah termasuk minuman di kafenya.' }),

    p({ id: 'jg-kotagede', name: 'Kotagede & Masjid Gedhe Mataram', area: 'Kotagede', lat: -7.8283, lng: 110.3986,
        cat: 'kota', cost: 0, extra: 5000, costNote: 'donasi & parkir', dur: 90,
        open: '08:00', close: '17:00', rating: 4.4, tags: ['budaya', 'santai', 'belanja'],
        why: 'Bekas ibu kota Mataram: gang-gang sempit, rumah joglo tua, dan sentra kerajinan perak.',
        tip: 'Beberapa bengkel perak menerima kunjungan; bisa lihat proses pembuatannya langsung.' }),

    /* --- Candi timur --- */
    p({ id: 'jg-prambanan', name: 'Candi Prambanan', area: 'Sleman timur', lat: -7.7520, lng: 110.4915,
        cat: 'candi', cost: 50000, extra: 5000, costNote: 'weekday; weekend Rp65.000', dur: 150,
        open: '06:30', close: '17:00', rating: 4.7, tags: ['ikonik', 'budaya', 'foto', 'sunset'],
        why: 'Kompleks candi Hindu tertinggi di Indonesia. Sore hari batunya berubah keemasan.',
        tip: 'Tiket terusan Prambanan + Ratu Boko lebih murah dan sudah termasuk antar-jemput shuttle.' }),

    p({ id: 'jg-ratuboko', name: 'Istana Ratu Boko', area: 'Prambanan', lat: -7.7706, lng: 110.4892,
        cat: 'candi', cost: 40000, extra: 5000, dur: 90, open: '06:00', close: '17:00',
        rating: 4.6, tags: ['sunset', 'foto', 'budaya', 'ikonik'],
        why: 'Reruntuhan di atas bukit; gerbangnya membingkai matahari terbenam persis di garis Merapi.',
        tip: 'Tempat sunset terbaik di sekitar Jogja. Datang jam 16.30 supaya dapat posisi di gerbang utama.' }),

    p({ id: 'jg-plaosan', name: 'Candi Plaosan', area: 'Klaten', lat: -7.7419, lng: 110.5049,
        cat: 'candi', cost: 10000, extra: 3000, dur: 45, open: '07:00', close: '17:00',
        rating: 4.5, tags: ['budaya', 'foto', 'santai'],
        why: 'Candi kembar Buddha-Hindu di tengah sawah — jauh lebih sepi daripada Prambanan.',
        tip: 'Cuma 10 menit dari Prambanan, cocok jadi penutup sebelum balik ke kota.' }),

    p({ id: 'jg-sambisari', name: 'Candi Sambisari', area: 'Kalasan', lat: -7.7626, lng: 110.4478,
        cat: 'candi', cost: 10000, extra: 3000, dur: 40, open: '07:00', close: '17:00',
        rating: 4.4, tags: ['budaya', 'santai'],
        why: 'Candi yang terkubur 6 meter di bawah tanah dan baru ditemukan petani pada 1966.',
        tip: 'Sangat dekat bandara Adisutjipto — pas buat mengisi waktu sebelum penerbangan sore.' }),

    p({ id: 'jg-breksi', name: 'Tebing Breksi', area: 'Prambanan', lat: -7.7767, lng: 110.5039,
        cat: 'alam', cost: 10000, extra: 5000, dur: 60, open: '08:00', close: '21:00',
        rating: 4.4, tags: ['foto', 'sunset', 'keluarga', 'malam'],
        why: 'Bekas tambang batu kapur yang dipahat jadi amfiteater; pemandangan kota dari atas.',
        tip: 'Buka sampai malam. Setelah gelap lampunya menyala dan jadi tempat nongkrong.' }),

    p({ id: 'jg-candiijo', name: 'Candi Ijo', area: 'Prambanan', lat: -7.7861, lng: 110.5117,
        cat: 'candi', cost: 10000, extra: 3000, dur: 60, open: '06:00', close: '17:30',
        rating: 4.6, tags: ['sunset', 'foto', 'budaya'],
        why: 'Candi tertinggi di Yogyakarta. Dari halamannya pesawat terlihat mendarat di kejauhan saat senja.',
        tip: 'Jalannya menanjak tajam di ujung — motor matik berboncengan bisa berat.' }),

    /* --- Borobudur & barat --- */
    p({ id: 'jg-borobudur', name: 'Candi Borobudur', area: 'Magelang', lat: -7.6079, lng: 110.2038,
        cat: 'candi', cost: 50000, extra: 10000, costNote: 'kawasan; naik ke stupa dijual terpisah', dur: 180,
        open: '06:30', close: '17:00', rating: 4.8, tags: ['ikonik', 'budaya', 'foto'],
        why: 'Candi Buddha terbesar di dunia. Tiket kawasan sudah cukup untuk melihatnya dari pelataran.',
        tip: 'Naik ke lantai stupa dibatasi kuota, harus pesan terpisah jauh hari, dan wajib pakai sandal upanat.' }),

    p({ id: 'jg-mendut', name: 'Candi Mendut & Pawon', area: 'Magelang', lat: -7.6047, lng: 110.2302,
        cat: 'candi', cost: 10000, extra: 3000, dur: 30, open: '07:00', close: '17:00',
        rating: 4.4, tags: ['budaya', 'santai'],
        why: 'Satu garis lurus dengan Borobudur; arca Buddha setinggi 3 meter di dalamnya masih utuh.',
        tip: 'Searah jalan pulang dari Borobudur, hanya perlu mampir 30 menit.' }),

    p({ id: 'jg-punthuk', name: 'Punthuk Setumbu', area: 'Magelang', lat: -7.6027, lng: 110.1899,
        cat: 'alam', cost: 20000, extra: 5000, dur: 90, open: '04:00', close: '17:00',
        rating: 4.5, tags: ['sunrise', 'foto', 'alam'],
        why: 'Bukit tempat memotret Borobudur mengambang di atas kabut saat matahari terbit.',
        tip: 'Harus berangkat dari kota sekitar jam 03.30. Kabutnya paling tebal di musim kemarau.' }),

    p({ id: 'jg-svargabumi', name: 'Svargabumi', area: 'Magelang', lat: -7.6106, lng: 110.2168,
        cat: 'hiburan', cost: 30000, extra: 5000, dur: 60, open: '06:00', close: '18:00',
        rating: 4.3, tags: ['foto', 'keluarga', 'santai'],
        why: 'Instalasi foto di tengah sawah dengan latar Borobudur dan perbukitan Menoreh.',
        tip: 'Paling hijau saat padi belum dipanen; setelah panen latarnya jadi cokelat.' }),

    p({ id: 'jg-gamplong', name: 'Studio Alam Gamplong', area: 'Sleman barat', lat: -7.7930, lng: 110.2589,
        cat: 'hiburan', cost: 5000, extra: 5000, dur: 75, open: '08:00', close: '17:00',
        rating: 4.3, tags: ['foto', 'keluarga', 'budaya'],
        why: 'Set film Bumi Manusia dan Sultan Agung yang dibiarkan berdiri — satu desa kolonial lengkap.',
        tip: 'Tiket masuknya murah sekali, tapi beberapa bangunan dalam dikenakan tiket tambahan.' }),

    p({ id: 'jg-kalibiru', name: 'Kalibiru', area: 'Kulon Progo', lat: -7.7969, lng: 110.1372,
        cat: 'alam', cost: 15000, extra: 15000, costNote: 'tiket + antre spot foto', dur: 90,
        open: '06:00', close: '17:00', rating: 4.2, tags: ['foto', 'alam', 'petualangan'],
        why: 'Gardu pandang di pohon dengan latar Waduk Sermo dan perbukitan Menoreh.',
        tip: 'Antrean foto bisa lama di akhir pekan; datang pagi.' }),

    /* --- Utara: Merapi & Kaliurang --- */
    p({ id: 'jg-lavatour', name: 'Lava Tour Merapi (jeep)', area: 'Cangkringan', lat: -7.6169, lng: 110.4342,
        cat: 'petualangan', cost: 120000, extra: 0, costNote: '± Rp350.000 per jeep isi 3-4 orang, rute pendek', dur: 150,
        open: '06:00', close: '16:00', rating: 4.6, tags: ['petualangan', 'alam', 'keluarga', 'ikonik'],
        why: 'Jeep menyusuri jalur lahar dingin 2010: bunker, batu Alien, dan Museum Sisa Hartaku.',
        tip: 'Harga dihitung per jeep, bukan per orang — makin ramai makin murah. Rute pendek 1,5 jam sudah cukup.' }),

    p({ id: 'jg-ullen', name: 'Museum Ullen Sentalu', area: 'Kaliurang', lat: -7.5992, lng: 110.4194,
        cat: 'museum', cost: 50000, extra: 5000, dur: 90, open: '08:30', close: '16:00',
        rating: 4.7, tags: ['budaya', 'santai'],
        why: 'Museum budaya Jawa terbaik di Indonesia — dipandu, sejuk, dan tidak boleh difoto di dalam.',
        tip: 'Kunjungan hanya bisa ikut tur berpemandu; tiket terakhir dijual sekitar 15.15.' }),

    p({ id: 'jg-bunker', name: 'Bunker Kaliadem', area: 'Cangkringan', lat: -7.6015, lng: 110.4470,
        cat: 'alam', cost: 10000, extra: 5000, dur: 45, open: '06:00', close: '17:00',
        rating: 4.3, tags: ['alam', 'foto', 'petualangan'],
        why: 'Titik terdekat yang bisa dicapai kendaraan ke puncak Merapi.',
        tip: 'Merapi tertutup awan mulai sekitar jam 09.00 — makin pagi makin jelas.' }),

    p({ id: 'jg-kopiklotok', name: 'Kopi Klotok', area: 'Pakem', lat: -7.7211, lng: 110.4103,
        cat: 'kuliner', cost: 45000, extra: 3000, dur: 75, open: '08:00', close: '20:00',
        rating: 4.5, tags: ['kuliner', 'santai', 'foto'],
        why: 'Sayur lodeh, telur krispi, dan pisang goreng di rumah joglo menghadap sawah dan Merapi.',
        tip: 'Antrean panjang saat makan siang akhir pekan. Datang sebelum jam 11.' }),

    p({ id: 'jg-lostworld', name: 'The Lost World Castle', area: 'Cangkringan', lat: -7.6088, lng: 110.4471,
        cat: 'hiburan', cost: 30000, extra: 5000, dur: 75, open: '07:00', close: '17:00',
        rating: 4.0, tags: ['foto', 'keluarga'],
        why: 'Kastil replika dari batu sisa erupsi dengan puluhan latar foto bertema.',
        tip: 'Konsepnya memang penuh spot foto buatan — cocok kalau bawa anak, lewati kalau cari yang otentik.' }),

    /* --- Selatan: Bantul, Mangunan, Imogiri --- */
    p({ id: 'jg-pinusmangunan', name: 'Hutan Pinus Mangunan', area: 'Dlingo, Bantul', lat: -7.9302, lng: 110.4247,
        cat: 'alam', cost: 5000, extra: 5000, dur: 60, open: '06:00', close: '17:00',
        rating: 4.4, tags: ['alam', 'foto', 'santai', 'keluarga'],
        why: 'Hutan pinus rapat dengan berkas cahaya pagi menembus batang — murah dan selalu enak.',
        tip: 'Jalur ke Dlingo berkelok dan menanjak; hitung waktu tempuh lebih longgar dari perkiraan.' }),

    p({ id: 'jg-kebunbuah', name: 'Kebun Buah Mangunan', area: 'Dlingo, Bantul', lat: -7.9354, lng: 110.4245,
        cat: 'alam', cost: 10000, extra: 5000, dur: 60, open: '05:00', close: '17:00',
        rating: 4.5, tags: ['sunrise', 'alam', 'foto'],
        why: 'Gardu pandang di atas lembah Sungai Oyo; pagi buta lembahnya penuh lautan awan.',
        tip: 'Lautan awan hanya muncul musim kemarau dan sebelum jam 06.30.' }),

    p({ id: 'jg-panguk', name: 'Bukit Panguk Kediwung', area: 'Dlingo, Bantul', lat: -7.9494, lng: 110.4356,
        cat: 'alam', cost: 10000, extra: 5000, dur: 60, open: '04:30', close: '17:00',
        rating: 4.4, tags: ['sunrise', 'foto', 'alam'],
        why: 'Deretan panggung kayu menjorok ke jurang — latar sunrise paling dramatis di selatan Jogja.',
        tip: 'Berangkat dari kota jam 04.00. Bawa jaket, dinginnya nyata.' }),

    p({ id: 'jg-pengger', name: 'Hutan Pinus Pengger', area: 'Dlingo, Bantul', lat: -7.8862, lng: 110.4288,
        cat: 'alam', cost: 5000, extra: 5000, dur: 75, open: '08:00', close: '21:00',
        rating: 4.4, tags: ['malam', 'foto', 'alam'],
        why: 'Instalasi ranting berbentuk tangan dan sarang, dengan lampu kota Jogja berkelap-kelip di bawah.',
        tip: 'Ini tempat malam, bukan siang. Datang setelah jam 18.00.' }),

    p({ id: 'jg-becici', name: 'Puncak Becici', area: 'Dlingo, Bantul', lat: -7.9231, lng: 110.4265,
        cat: 'alam', cost: 5000, extra: 5000, dur: 45, open: '06:00', close: '18:00',
        rating: 4.3, tags: ['alam', 'sunset', 'santai'],
        why: 'Gardu pandang pinus yang pernah dikunjungi Barack Obama; sepi dan teduh.',
        tip: 'Bisa digabung satu jalur dengan Mangunan dan Panguk — semua di punggung bukit yang sama.' }),

    p({ id: 'jg-parangtritis', name: 'Pantai Parangtritis', area: 'Kretek, Bantul', lat: -8.0257, lng: 110.3306,
        cat: 'pantai', cost: 10000, extra: 5000, dur: 120, open: null, close: null,
        rating: 4.3, tags: ['pantai', 'sunset', 'ikonik', 'keluarga'],
        why: 'Pantai paling terkenal di Jogja; ombak besar, delman, dan matahari terbenam di garis laut.',
        tip: 'Dilarang berenang — arusnya berbahaya. Datang jam 16.30 untuk sunset.' }),

    p({ id: 'jg-gumukpasir', name: 'Gumuk Pasir Parangkusumo', area: 'Kretek, Bantul', lat: -8.0180, lng: 110.3169,
        cat: 'alam', cost: 5000, extra: 5000, costNote: 'sandboarding ± Rp70.000', dur: 60,
        open: '06:00', close: '18:00', rating: 4.3, tags: ['foto', 'petualangan', 'sunset'],
        why: 'Gurun pasir barchan, satu-satunya di Asia Tenggara. Bisa sandboarding.',
        tip: 'Bersebelahan dengan Parangtritis; sore hari pasirnya sudah tidak panas.' }),

    p({ id: 'jg-heha', name: 'HeHa Sky View', area: 'Patuk, Gunungkidul', lat: -7.8570, lng: 110.4372,
        cat: 'hiburan', cost: 30000, extra: 5000, costNote: 'sebagian tiket bisa ditukar makanan', dur: 90,
        open: '10:00', close: '22:00', rating: 4.3, tags: ['malam', 'foto', 'keluarga', 'sunset'],
        why: 'Restoran-taman di tebing Patuk dengan panorama kota Jogja dari ketinggian.',
        tip: 'Datang jam 17.00: dapat sunset sekaligus lampu kota.' }),

    p({ id: 'jg-bukitbintang', name: 'Bukit Bintang Hargodumilah', area: 'Patuk, Gunungkidul', lat: -7.8478, lng: 110.4650,
        cat: 'alam', cost: 0, extra: 5000, dur: 45, open: null, close: null,
        rating: 4.2, tags: ['malam', 'santai', 'murah'],
        why: 'Warung-warung jagung bakar di tepi jalan dengan hamparan lampu kota — gratis.',
        tip: 'Alternatif gratis dari HeHa, pemandangannya mirip. Ada di jalur pulang dari Gunungkidul.' }),

    /* --- Kuliner kota --- */
    p({ id: 'jg-sateklathak', name: 'Sate Klathak Pak Pong', area: 'Pleret, Bantul', lat: -7.8845, lng: 110.3776,
        cat: 'kuliner', cost: 50000, extra: 3000, dur: 60, open: '09:00', close: '23:00',
        rating: 4.5, tags: ['kuliner', 'ikonik'],
        why: 'Sate kambing yang ditusuk jeruji sepeda dan hanya dibumbui garam — legendaris.',
        tip: 'Jam makan malam ramai sekali. Pesan gulai sebagai pendamping.' }),

    p({ id: 'jg-gudegwijilan', name: 'Gudeg Wijilan', area: 'Wijilan', lat: -7.8060, lng: 110.3689,
        cat: 'kuliner', cost: 35000, extra: 3000, dur: 45, open: '06:00', close: '22:00',
        rating: 4.4, tags: ['kuliner', 'ikonik', 'budaya'],
        why: 'Satu gang berisi warung gudeg legendaris, persis di timur Alun-Alun Utara.',
        tip: 'Gudeg kering lebih tahan lama kalau mau dibawa pulang sebagai oleh-oleh.' }),

    p({ id: 'jg-raminten', name: 'House of Raminten', area: 'Kotabaru', lat: -7.7743, lng: 110.3721,
        cat: 'kuliner', cost: 55000, extra: 3000, dur: 75, open: null, close: null,
        rating: 4.4, tags: ['kuliner', 'malam', 'foto'],
        why: 'Buka 24 jam, penuh ornamen Jawa, pelayan berkebaya, dan menu yang sengaja nyeleneh.',
        tip: 'Sering antre malam hari. Susu tante dan es teh poci-nya jadi ciri khas.' }),

    p({ id: 'jg-angkringan', name: 'Angkringan Lik Man', area: 'Stasiun Tugu', lat: -7.7893, lng: 110.3639,
        cat: 'kuliner', cost: 25000, extra: 0, dur: 45, open: '17:00', close: '02:00',
        rating: 4.4, tags: ['kuliner', 'malam', 'murah', 'ikonik'],
        why: 'Asal-usul kopi joss — kopi hitam yang disiram arang membara. Nasi kucing seribuan.',
        tip: 'Baru buka sore. Duduk lesehan di trotoar utara Stasiun Tugu.' }),

    p({ id: 'jg-bakpia25', name: 'Bakpia Pathok 25', area: 'Pathuk', lat: -7.7936, lng: 110.3559,
        cat: 'belanja', cost: 45000, extra: 3000, costNote: 'per kotak oleh-oleh', dur: 30,
        open: '07:00', close: '21:00', rating: 4.3, tags: ['belanja', 'kuliner'],
        why: 'Oleh-oleh wajib. Yang panas baru keluar oven jauh lebih enak dari yang di rak.',
        tip: 'Bakpia basah hanya tahan 3-4 hari; pilih yang kering kalau perjalanan pulang masih lama.' }),

    /* --- Gunungkidul --- */
    p({ id: 'jg-jomblang', name: 'Goa Jomblang', area: 'Semanu, Gunungkidul', lat: -8.0294, lng: 110.6389,
        cat: 'petualangan', cost: 500000, extra: 10000, costNote: 'sudah termasuk alat & pemandu', dur: 240,
        open: '07:00', close: '13:00', rating: 4.8, tags: ['petualangan', 'ikonik', 'foto', 'alam'],
        why: 'Turun 60 meter ke gua runtuhan untuk melihat cahaya surga menembus mulut gua.',
        tip: 'Wajib reservasi jauh hari, kuota harian terbatas. Cahaya terbaik jam 10.00-12.00 dan hanya di musim kemarau.' }),

    p({ id: 'jg-pindul', name: 'Goa Pindul', area: 'Bejiharjo, Gunungkidul', lat: -7.9455, lng: 110.6478,
        cat: 'petualangan', cost: 60000, extra: 5000, costNote: 'paket cave tubing', dur: 120,
        open: '07:00', close: '16:00', rating: 4.2, tags: ['petualangan', 'keluarga', 'alam'],
        why: 'Mengapung dengan ban dalam menyusuri sungai bawah tanah — santai, aman untuk pemula.',
        tip: 'Banyak operator di pintu masuk dengan harga berbeda; tanya isi paketnya sebelum bayar.' }),

    p({ id: 'jg-srigethuk', name: 'Air Terjun Sri Gethuk', area: 'Playen, Gunungkidul', lat: -7.9367, lng: 110.5192,
        cat: 'alam', cost: 25000, extra: 5000, dur: 120, open: '08:00', close: '16:00',
        rating: 4.4, tags: ['alam', 'petualangan', 'foto'],
        why: 'Air terjun bertingkat di tebing Sungai Oyo, dicapai dengan rakit menyusuri ngarai.',
        tip: 'Debit air paling deras di musim hujan; kemarau panjang bisa membuatnya tipis.' }),

    p({ id: 'jg-nglanggeran', name: 'Gunung Api Purba Nglanggeran', area: 'Patuk, Gunungkidul', lat: -7.8422, lng: 110.5940,
        cat: 'alam', cost: 20000, extra: 5000, dur: 180, open: null, close: null,
        rating: 4.5, tags: ['alam', 'petualangan', 'sunrise', 'foto'],
        why: 'Gunung api purba berumur 60 juta tahun; pendakian 1 jam ke puncak batu raksasa.',
        tip: 'Buka 24 jam untuk pendakian sunrise. Trek berbatu dan sempit — pakai sepatu, bukan sandal.' }),

    p({ id: 'jg-indrayanti', name: 'Pantai Indrayanti', area: 'Tepus, Gunungkidul', lat: -8.1512, lng: 110.6122,
        cat: 'pantai', cost: 10000, extra: 5000, costNote: 'retribusi kawasan berlaku untuk semua pantai Gunungkidul', dur: 120,
        open: null, close: null, rating: 4.4, tags: ['pantai', 'santai', 'keluarga', 'kuliner'],
        why: 'Pasir putih bersih dengan deretan kafe tepi pantai — yang paling nyaman di Gunungkidul.',
        tip: 'Retribusi kawasan dibayar sekali di gerbang dan berlaku untuk semua pantai di jalur itu.' }),

    p({ id: 'jg-nglambor', name: 'Pantai Nglambor', area: 'Tepus, Gunungkidul', lat: -8.1554, lng: 110.6420,
        cat: 'pantai', cost: 10000, extra: 60000, costNote: 'sewa alat snorkeling', dur: 120,
        open: '06:00', close: '18:00', rating: 4.3, tags: ['pantai', 'petualangan', 'alam'],
        why: 'Dua batu karang besar menahan ombak, menciptakan kolam alami untuk snorkeling.',
        tip: 'Satu-satunya pantai selatan Jogja yang aman untuk snorkeling. Air paling jernih saat surut.' }),

    p({ id: 'jg-timang', name: 'Pantai Timang', area: 'Tepus, Gunungkidul', lat: -8.1548, lng: 110.6284,
        cat: 'petualangan', cost: 15000, extra: 200000, costNote: 'gondola/jembatan gantung dibayar terpisah', dur: 120,
        open: '07:00', close: '17:00', rating: 4.4, tags: ['petualangan', 'pantai', 'foto', 'ikonik'],
        why: 'Gondola kayu tarik tangan menyeberangi jurang laut menuju Pulau Panjang.',
        tip: 'Jalan masuk terakhir rusak berat — banyak yang oper ojek lokal. Gondola dan jembatan gantung harganya beda.' }),

    p({ id: 'jg-baron', name: 'Pantai Baron & Kukup', area: 'Tanjungsari, Gunungkidul', lat: -8.1268, lng: 110.5486,
        cat: 'pantai', cost: 10000, extra: 5000, dur: 90, open: null, close: null,
        rating: 4.2, tags: ['pantai', 'keluarga', 'kuliner'],
        why: 'Pantai teluk berpasir dengan pasar ikan segar yang bisa langsung dimasakkan.',
        tip: 'Pantai pertama di jalur Gunungkidul — pas untuk berhenti makan siang.' })
  ];

  /* ============================================================
     BALI
     ============================================================ */
  var BALI = [
    p({ id: 'bl-tanahlot', name: 'Pura Tanah Lot', area: 'Tabanan', lat: -8.6212, lng: 115.0868,
        cat: 'kota', cost: 75000, extra: 5000, dur: 120, open: '07:00', close: '19:00',
        rating: 4.6, tags: ['ikonik', 'sunset', 'budaya', 'foto'],
        why: 'Pura di atas karang laut; saat pasang, ia benar-benar terpisah dari daratan.',
        tip: 'Datang jam 17.00 untuk sunset. Cek jadwal pasang kalau ingin menyeberang ke kakinya.' }),

    p({ id: 'bl-uluwatu', name: 'Pura Uluwatu & Tari Kecak', area: 'Badung selatan', lat: -8.8291, lng: 115.0849,
        cat: 'kota', cost: 50000, extra: 150000, costNote: 'tiket pura + tiket Kecak', dur: 180,
        open: '07:00', close: '19:00', rating: 4.7, tags: ['ikonik', 'sunset', 'budaya'],
        why: 'Pura di tebing 70 meter di atas samudra, ditutup tari Kecak saat matahari terbenam.',
        tip: 'Tiket Kecak sering habis; beli begitu sampai. Jaga kacamata dan topi dari monyet.' }),

    p({ id: 'bl-tegallalang', name: 'Terasering Tegallalang', area: 'Ubud', lat: -8.4319, lng: 115.2779,
        cat: 'alam', cost: 25000, extra: 10000, dur: 90, open: '08:00', close: '18:00',
        rating: 4.4, tags: ['foto', 'alam', 'ikonik'],
        why: 'Sawah bertingkat paling difoto di Bali, lengkap dengan ayunan di atas lembah.',
        tip: 'Sebelum jam 09.00 masih sepi. Pemilik lahan di jalur bawah minta donasi terpisah.' }),

    p({ id: 'bl-monkeyforest', name: 'Sacred Monkey Forest', area: 'Ubud', lat: -8.5188, lng: 115.2585,
        cat: 'alam', cost: 80000, extra: 5000, dur: 90, open: '09:00', close: '18:00',
        rating: 4.4, tags: ['keluarga', 'alam', 'budaya'],
        why: 'Hutan pura dengan 1.200 monyet ekor panjang dan pohon beringin raksasa.',
        tip: 'Jangan bawa makanan, plastik, atau kacamata longgar. Monyetnya berani.' }),

    p({ id: 'bl-tirtaempul', name: 'Pura Tirta Empul', area: 'Tampaksiring', lat: -8.4157, lng: 115.3153,
        cat: 'kota', cost: 75000, extra: 5000, dur: 90, open: '08:00', close: '18:00',
        rating: 4.5, tags: ['budaya', 'ikonik'],
        why: 'Mata air suci tempat ritual melukat; pengunjung boleh ikut penyucian.',
        tip: 'Bawa baju ganti kalau mau melukat. Sarung disediakan di pintu masuk.' }),

    p({ id: 'bl-campuhan', name: 'Campuhan Ridge Walk', area: 'Ubud', lat: -8.5052, lng: 115.2534,
        cat: 'alam', cost: 0, extra: 0, dur: 90, open: null, close: null,
        rating: 4.5, tags: ['alam', 'santai', 'sunrise', 'murah'],
        why: 'Jalur punggung bukit sepanjang 2 km di antara dua sungai — gratis dan tenang.',
        tip: 'Jalan sebelum jam 08.00; setelah itu panas tanpa peneduh sama sekali.' }),

    p({ id: 'bl-ulundanu', name: 'Pura Ulun Danu Beratan', area: 'Bedugul', lat: -8.2751, lng: 115.1668,
        cat: 'kota', cost: 75000, extra: 5000, dur: 90, open: '07:00', close: '19:00',
        rating: 4.6, tags: ['ikonik', 'foto', 'budaya'],
        why: 'Pura yang tampak mengapung di Danau Beratan — gambar di uang Rp50.000.',
        tip: 'Dataran tinggi, jauh lebih dingin. Pagi hari danaunya paling tenang dan berkabut.' }),

    p({ id: 'bl-jatiluwih', name: 'Jatiluwih', area: 'Tabanan', lat: -8.3706, lng: 115.1300,
        cat: 'alam', cost: 40000, extra: 10000, dur: 120, open: '08:00', close: '18:00',
        rating: 4.6, tags: ['alam', 'santai', 'foto'],
        why: 'Terasering warisan dunia UNESCO — jauh lebih luas dan lebih sepi dari Tegallalang.',
        tip: 'Jalannya berkelok dari Bedugul. Ada jalur trekking 1,5 jam mengelilingi sawah.' }),

    p({ id: 'bl-melasti', name: 'Pantai Melasti', area: 'Ungasan', lat: -8.8480, lng: 115.1620,
        cat: 'pantai', cost: 10000, extra: 5000, dur: 150, open: '07:00', close: '19:00',
        rating: 4.5, tags: ['pantai', 'foto', 'sunset'],
        why: 'Jalan turun dipahat menembus tebing kapur menuju pasir putih dan air biru.',
        tip: 'Jalan tebingnya sendiri adalah spot fotonya. Beach club di sini ramai saat sunset.' }),

    p({ id: 'bl-pandawa', name: 'Pantai Pandawa', area: 'Kutuh', lat: -8.8481, lng: 115.1866,
        cat: 'pantai', cost: 15000, extra: 5000, dur: 120, open: '07:00', close: '19:00',
        rating: 4.4, tags: ['pantai', 'keluarga', 'santai'],
        why: 'Pantai tenang dengan lima arca Pandawa dipahat di dinding tebing.',
        tip: 'Ombaknya kecil — salah satu pantai selatan yang benar-benar aman untuk berenang.' }),

    p({ id: 'bl-tegenungan', name: 'Air Terjun Tegenungan', area: 'Gianyar', lat: -8.5757, lng: 115.2887,
        cat: 'alam', cost: 20000, extra: 5000, dur: 90, open: '06:30', close: '18:00',
        rating: 4.2, tags: ['alam', 'foto', 'keluarga'],
        why: 'Air terjun lebar yang paling mudah dijangkau dari Ubud, bisa berenang di kolamnya.',
        tip: 'Turun sekitar 160 anak tangga. Paling jernih di pagi hari sebelum ramai.' }),

    p({ id: 'bl-gwk', name: 'Garuda Wisnu Kencana', area: 'Ungasan', lat: -8.8104, lng: 115.1673,
        cat: 'hiburan', cost: 125000, extra: 10000, dur: 150, open: '08:00', close: '22:00',
        rating: 4.4, tags: ['ikonik', 'budaya', 'keluarga', 'foto'],
        why: 'Patung Wisnu setinggi 121 meter, salah satu yang tertinggi di dunia.',
        tip: 'Pertunjukan tari Kecak sore hari sudah termasuk tiket masuk.' }),

    p({ id: 'bl-kuta', name: 'Pantai Kuta', area: 'Kuta', lat: -8.7185, lng: 115.1686,
        cat: 'pantai', cost: 0, extra: 10000, costNote: 'parkir; sewa papan selancar terpisah', dur: 120,
        open: null, close: null, rating: 4.1, tags: ['pantai', 'sunset', 'ikonik', 'murah'],
        why: 'Pantai selancar pemula paling ramai di Bali dengan sunset yang tetap juara.',
        tip: 'Ombak paling bersahabat untuk belajar selancar di pagi hari.' }),

    p({ id: 'bl-sanur', name: 'Pantai Sanur', area: 'Denpasar', lat: -8.6866, lng: 115.2620,
        cat: 'pantai', cost: 0, extra: 10000, dur: 120, open: null, close: null,
        rating: 4.3, tags: ['pantai', 'sunrise', 'santai', 'keluarga'],
        why: 'Pantai timur yang tenang dengan jalur sepeda 8 km — tempat sunrise, bukan sunset.',
        tip: 'Satu-satunya pantai utama di Bali selatan yang menghadap timur.' }),

    p({ id: 'bl-kelingking', name: 'Kelingking Beach, Nusa Penida', area: 'Nusa Penida', lat: -8.7509, lng: 115.4728,
        cat: 'alam', cost: 10000, extra: 400000, costNote: 'fastboat PP + transport pulau', dur: 240,
        open: '07:00', close: '18:00', rating: 4.7, tags: ['ikonik', 'foto', 'alam', 'petualangan'],
        why: 'Tebing berbentuk kepala T-Rex — pemandangan paling terkenal di Bali.',
        tip: 'Perlu satu hari penuh dari Sanur. Turun ke pantainya sangat curam dan makan 1 jam sekali jalan.' })
  ];

  /* ============================================================
     BANDUNG
     ============================================================ */
  var BANDUNG = [
    p({ id: 'bd-kawahputih', name: 'Kawah Putih', area: 'Ciwidey', lat: -7.1663, lng: 107.4022,
        cat: 'alam', cost: 35000, extra: 35000, costNote: 'tiket + ontang-anting/parkir atas', dur: 120,
        open: '07:00', close: '17:00', rating: 4.5, tags: ['ikonik', 'alam', 'foto'],
        why: 'Danau kawah belerang berwarna putih kehijauan yang berubah warna sesuai cuaca.',
        tip: 'Bau belerang kuat — bawa masker. Pagi hari kabutnya tebal dan justru bagus difoto.' }),

    p({ id: 'bd-tangkuban', name: 'Tangkuban Perahu', area: 'Lembang', lat: -6.7597, lng: 107.6098,
        cat: 'alam', cost: 30000, extra: 25000, dur: 120, open: '08:00', close: '17:00',
        rating: 4.3, tags: ['ikonik', 'alam', 'keluarga'],
        why: 'Kawah Ratu bisa dilihat dari bibir kawah, mobil bisa naik sampai atas.',
        tip: 'Kadang ditutup kalau aktivitas vulkanik naik — cek statusnya sebelum berangkat.' }),

    p({ id: 'bd-tebingkeraton', name: 'Tebing Keraton', area: 'Dago Atas', lat: -6.8341, lng: 107.6613,
        cat: 'alam', cost: 15000, extra: 10000, dur: 90, open: '05:00', close: '17:00',
        rating: 4.3, tags: ['sunrise', 'foto', 'alam'],
        why: 'Tebing sempit menghadap lautan hutan Taman Hutan Raya Ir. H. Djuanda.',
        tip: 'Jalan terakhir sempit dan curam — mobil besar tidak disarankan. Datang jam 05.00 untuk kabut.' }),

    p({ id: 'bd-farmhouse', name: 'Farmhouse Lembang', area: 'Lembang', lat: -6.8329, lng: 107.6060,
        cat: 'hiburan', cost: 35000, extra: 10000, costNote: 'tiket bisa ditukar susu', dur: 90,
        open: '09:00', close: '20:00', rating: 4.2, tags: ['keluarga', 'foto'],
        why: 'Desa bergaya Eropa dengan rumah hobbit dan kandang ternak — favorit keluarga.',
        tip: 'Tiket masuk bisa ditukar segelas susu atau sosis di dalam.' }),

    p({ id: 'bd-floating', name: 'Floating Market Lembang', area: 'Lembang', lat: -6.8168, lng: 107.6172,
        cat: 'kuliner', cost: 30000, extra: 20000, dur: 120, open: '09:00', close: '19:00',
        rating: 4.3, tags: ['kuliner', 'keluarga', 'foto'],
        why: 'Jajanan dijual dari perahu di atas danau; pembayaran pakai koin khusus.',
        tip: 'Tukar uang ke koin di gerbang; sisa koin bisa ditukar balik sebelum pulang.' }),

    p({ id: 'bd-dusunbambu', name: 'Dusun Bambu', area: 'Cisarua', lat: -6.7883, lng: 107.5539,
        cat: 'hiburan', cost: 25000, extra: 15000, dur: 150, open: '08:00', close: '20:00',
        rating: 4.4, tags: ['keluarga', 'santai', 'kuliner', 'alam'],
        why: 'Kompleks wisata alam dengan saung makan di atas danau dan taman bunga.',
        tip: 'Saung Purbasari harus dipesan dulu kalau mau makan di atas air.' }),

    p({ id: 'bd-braga', name: 'Jalan Braga', area: 'Bandung Wetan', lat: -6.9175, lng: 107.6091,
        cat: 'kota', cost: 0, extra: 10000, dur: 90, open: null, close: null,
        rating: 4.4, tags: ['budaya', 'malam', 'kuliner', 'foto', 'murah'],
        why: 'Koridor art deco peninggalan Hindia Belanda; kafe dan galeri berjajar.',
        tip: 'Akhir pekan malam ditutup untuk kendaraan dan jadi area pejalan kaki.' }),

    p({ id: 'bd-gedungsate', name: 'Gedung Sate', area: 'Bandung Wetan', lat: -6.9025, lng: 107.6187,
        cat: 'kota', cost: 5000, extra: 5000, dur: 60, open: '09:30', close: '16:00',
        rating: 4.5, tags: ['ikonik', 'budaya', 'foto', 'murah'],
        why: 'Ikon arsitektur Bandung; museumnya interaktif dan sangat murah.',
        tip: 'Tutup hari Senin. Halaman depannya ramai saat car free day Minggu pagi.' }),

    p({ id: 'bd-ranca', name: 'Ranca Upas', area: 'Ciwidey', lat: -7.1256, lng: 107.3846,
        cat: 'alam', cost: 25000, extra: 10000, dur: 120, open: '07:00', close: '17:00',
        rating: 4.3, tags: ['keluarga', 'alam', 'foto'],
        why: 'Bumi perkemahan dengan penangkaran rusa yang boleh diberi makan.',
        tip: 'Satu jalur dengan Kawah Putih — gabungkan jadi satu hari Ciwidey.' }),

    p({ id: 'bd-patenggang', name: 'Situ Patenggang', area: 'Ciwidey', lat: -7.1651, lng: 107.3652,
        cat: 'alam', cost: 30000, extra: 15000, dur: 90, open: '07:00', close: '17:00',
        rating: 4.3, tags: ['alam', 'santai', 'keluarga'],
        why: 'Danau di tengah kebun teh; bisa berperahu ke Batu Cinta di tengahnya.',
        tip: 'Ujung jalur Ciwidey — taruh paling akhir sebelum balik ke kota.' }),

    p({ id: 'bd-angklung', name: 'Saung Angklung Udjo', area: 'Padasuka', lat: -6.8998, lng: 107.6544,
        cat: 'hiburan', cost: 130000, extra: 5000, dur: 120,
        open: '09:00', close: '17:00', rating: 4.7, tags: ['budaya', 'keluarga', 'ikonik'],
        why: 'Pertunjukan angklung interaktif — penonton diberi angklung dan ikut bermain.',
        tip: 'Pertunjukan utama jam 15.30 setiap hari; datang 30 menit lebih awal.' }),

    p({ id: 'bd-cihampelas', name: 'Cihampelas Walk & Teras Cihampelas', area: 'Cihampelas', lat: -6.8945, lng: 107.6041,
        cat: 'belanja', cost: 0, extra: 10000, dur: 120, open: '10:00', close: '22:00',
        rating: 4.1, tags: ['belanja', 'keluarga', 'malam'],
        why: 'Pusat belanja jeans legendaris dengan skywalk pejalan kaki di atas jalan.',
        tip: 'Lalu lintas Cihampelas padat sekali akhir pekan; naik ojek lebih cepat.' }),

    p({ id: 'bd-alunalun', name: 'Alun-Alun Bandung & Masjid Raya', area: 'Bandung Wetan', lat: -6.9218, lng: 107.6069,
        cat: 'kota', cost: 0, extra: 5000, dur: 60, open: null, close: null,
        rating: 4.4, tags: ['keluarga', 'murah', 'budaya', 'santai'],
        why: 'Lapangan rumput sintetis di depan Masjid Raya; menara kembarnya bisa dinaiki.',
        tip: 'Naik menara masjid berbayar murah dan pemandangan kotanya luas.' }),

    p({ id: 'bd-kampungdaun', name: 'Kampung Daun', area: 'Cisarua', lat: -6.8210, lng: 107.5779,
        cat: 'kuliner', cost: 90000, extra: 5000, dur: 120, open: '11:00', close: '22:00',
        rating: 4.4, tags: ['kuliner', 'santai', 'malam'],
        why: 'Saung-saung terpisah di lembah beraliran sungai kecil, diterangi lentera.',
        tip: 'Malam hari suasananya paling bagus. Reservasi saung dekat air terjun.' })
  ];

  /* ============================================================
     MALANG - BROMO
     ============================================================ */
  var BROMO = [
    p({ id: 'br-penanjakan', name: 'Penanjakan 1 (sunrise Bromo)', area: 'Probolinggo', lat: -7.9105, lng: 112.9530,
        cat: 'alam', cost: 54000, extra: 250000, costNote: 'tiket TNBTS weekday + sewa jeep dibagi rombongan', dur: 150,
        open: null, close: null, rating: 4.8, tags: ['ikonik', 'sunrise', 'alam', 'foto'],
        why: 'Titik pandang klasik: Bromo, Batok, dan Semeru muncul bersamaan dari lautan awan.',
        tip: 'Berangkat dari Malang jam 00.00 atau menginap di Cemoro Lawang. Suhu bisa 5°C — bawa jaket tebal.' }),

    p({ id: 'br-kawah', name: 'Kawah Bromo', area: 'Probolinggo', lat: -7.9425, lng: 112.9530,
        cat: 'alam', cost: 0, extra: 150000, costNote: 'sudah termasuk tiket TNBTS; sewa kuda opsional', dur: 120,
        open: null, close: null, rating: 4.7, tags: ['ikonik', 'petualangan', 'alam'],
        why: 'Menyeberangi lautan pasir lalu naik 250 anak tangga ke bibir kawah yang mengepul.',
        tip: 'Masker dan kacamata wajib — pasirnya beterbangan. Kuda hanya sampai kaki tangga.' }),

    p({ id: 'br-teletubbies', name: 'Bukit Teletubbies & Pasir Berbisik', area: 'Probolinggo', lat: -7.9500, lng: 112.9601,
        cat: 'alam', cost: 0, extra: 0, costNote: 'termasuk rute jeep', dur: 60,
        open: null, close: null, rating: 4.5, tags: ['foto', 'alam', 'santai'],
        why: 'Perbukitan savana hijau dan hamparan pasir vulkanik — dua lanskap berbeda dalam satu rute.',
        tip: 'Sudah masuk paket jeep standar; pastikan sopir mengambil rute lengkap empat titik.' }),

    p({ id: 'br-tumpaksewu', name: 'Air Terjun Tumpak Sewu', area: 'Lumajang', lat: -8.2306, lng: 112.9188,
        cat: 'alam', cost: 20000, extra: 30000, costNote: 'tiket + pemandu turun ke dasar', dur: 180,
        open: '06:00', close: '16:00', rating: 4.8, tags: ['ikonik', 'alam', 'petualangan', 'foto'],
        why: 'Tirai air setinggi 120 meter berbentuk setengah lingkaran — air terjun terindah di Jawa.',
        tip: 'Turun ke dasar licin, curam, dan makan 1 jam. Dari gardu pandang atas saja sudah spektakuler.' }),

    p({ id: 'br-jodipan', name: 'Kampung Warna-Warni Jodipan', area: 'Kota Malang', lat: -7.9852, lng: 112.6350,
        cat: 'kota', cost: 5000, extra: 3000, dur: 75, open: '07:00', close: '17:00',
        rating: 4.2, tags: ['foto', 'budaya', 'murah'],
        why: 'Perkampungan tepi sungai yang dicat warna-warni, dihubungkan jembatan kaca.',
        tip: 'Ini permukiman warga — jangan berisik dan minta izin sebelum memotret orang.' }),

    p({ id: 'br-cobanrondo', name: 'Coban Rondo', area: 'Batu', lat: -7.8853, lng: 112.4794,
        cat: 'alam', cost: 30000, extra: 10000, dur: 120, open: '07:00', close: '17:00',
        rating: 4.3, tags: ['alam', 'keluarga', 'foto'],
        why: 'Air terjun 84 meter dengan taman labirin dan area piknik di bawahnya.',
        tip: 'Bisa dicapai mobil sampai dekat air terjun — ramah untuk yang bawa anak kecil.' }),

    p({ id: 'br-museumangkut', name: 'Museum Angkut', area: 'Batu', lat: -7.8825, lng: 112.5223,
        cat: 'museum', cost: 120000, extra: 10000, dur: 180, open: '12:00', close: '20:00',
        rating: 4.6, tags: ['keluarga', 'foto', 'ikonik'],
        why: 'Koleksi kendaraan dari sepeda ontel sampai pesawat, ditata dalam zona kota dunia.',
        tip: 'Butuh minimal 3 jam. Zona Eropa paling bagus difoto menjelang malam saat lampu menyala.' }),

    p({ id: 'br-jatimpark2', name: 'Jatim Park 2 (Batu Secret Zoo)', area: 'Batu', lat: -7.8862, lng: 112.5262,
        cat: 'hiburan', cost: 130000, extra: 10000, dur: 240, open: '10:00', close: '18:00',
        rating: 4.5, tags: ['keluarga', 'anak'],
        why: 'Kebun binatang modern dan museum satwa dalam satu tiket — luas sekali.',
        tip: 'Rencanakan setengah hari penuh. Beli tiket terusan kalau juga mau ke Jatim Park 1 atau 3.' }),

    p({ id: 'br-alunbatu', name: 'Alun-Alun Kota Batu', area: 'Batu', lat: -7.8710, lng: 112.5279,
        cat: 'kota', cost: 0, extra: 5000, dur: 60, open: null, close: null,
        rating: 4.3, tags: ['keluarga', 'malam', 'murah', 'kuliner'],
        why: 'Bianglala, air mancur, dan pedagang kaki lima — hidup sampai larut.',
        tip: 'Gratis. Naik bianglala malam hari untuk melihat lampu kota Batu.' }),

    p({ id: 'br-balekambang', name: 'Pantai Balekambang', area: 'Malang selatan', lat: -8.4022, lng: 112.5334,
        cat: 'pantai', cost: 25000, extra: 10000, dur: 150, open: null, close: null,
        rating: 4.2, tags: ['pantai', 'budaya', 'foto'],
        why: 'Pura di atas karang yang dihubungkan jembatan — sering disebut Tanah Lot-nya Jawa Timur.',
        tip: 'Perjalanan 2,5 jam dari kota Malang lewat jalan berkelok; berangkat pagi.' }),

    p({ id: 'br-singosari', name: 'Candi Singosari', area: 'Malang utara', lat: -7.8880, lng: 112.6650,
        cat: 'candi', cost: 5000, extra: 3000, dur: 45, open: '07:00', close: '16:00',
        rating: 4.3, tags: ['budaya', 'murah', 'santai'],
        why: 'Peninggalan Kerajaan Singhasari abad ke-13 dengan arca dwarapala raksasa di dekatnya.',
        tip: 'Searah jalur menuju Bromo dari Malang — mampir sebentar sebelum naik.' }),

    p({ id: 'br-tokooen', name: 'Toko Oen', area: 'Kota Malang', lat: -7.9756, lng: 112.6300,
        cat: 'kuliner', cost: 70000, extra: 3000, dur: 75, open: '09:00', close: '21:00',
        rating: 4.3, tags: ['kuliner', 'budaya', 'santai'],
        why: 'Kedai es krim sejak 1930 dengan interior kolonial yang nyaris tak berubah.',
        tip: 'Pesan es krim klasiknya, bukan menu utamanya. Di seberang alun-alun kota.' })
  ];

  var DESTINATIONS = [
    {
      id: 'jogja',
      name: 'Yogyakarta',
      region: 'DIY, Magelang & Klaten',
      lat: -7.7956, lng: 110.3695,
      hub: { name: 'Malioboro / pusat kota', lat: -7.7925, lng: 110.3657 },
      roadFactor: 1.32,
      blurb: 'Candi, keraton, bukit kabut, dan pantai selatan dalam radius dua jam berkendara.',
      places: JOGJA
    },
    {
      id: 'bali',
      name: 'Bali',
      region: 'Badung, Gianyar, Tabanan',
      lat: -8.6500, lng: 115.2167,
      hub: { name: 'Kuta / Seminyak', lat: -8.7185, lng: 115.1686 },
      roadFactor: 1.45,
      blurb: 'Pura di tebing, terasering, dan pantai — tapi macetnya nyata, sisakan waktu ekstra.',
      places: BALI
    },
    {
      id: 'bandung',
      name: 'Bandung',
      region: 'Bandung Raya, Lembang & Ciwidey',
      lat: -6.9175, lng: 107.6191,
      hub: { name: 'Alun-Alun / Braga', lat: -6.9210, lng: 107.6080 },
      roadFactor: 1.48,
      blurb: 'Kawah, kebun teh, dan art deco. Lembang di utara, Ciwidey di selatan — jangan digabung sehari.',
      places: BANDUNG
    },
    {
      id: 'bromo',
      name: 'Malang & Bromo',
      region: 'Malang, Batu, Probolinggo',
      lat: -7.9666, lng: 112.6326,
      hub: { name: 'Kota Malang', lat: -7.9797, lng: 112.6304 },
      roadFactor: 1.40,
      blurb: 'Sunrise gunung berapi, air terjun raksasa, dan kota sejuk peninggalan kolonial.',
      places: BROMO
    }
  ];

  return {
    PRICE_SNAPSHOT: PRICE_SNAPSHOT,
    CATEGORIES: CATEGORIES,
    INTERESTS: INTERESTS,
    DESTINATIONS: DESTINATIONS,
    byId: function (destId) {
      for (var i = 0; i < DESTINATIONS.length; i++) {
        if (DESTINATIONS[i].id === destId) return DESTINATIONS[i];
      }
      return DESTINATIONS[0];
    }
  };
})();
