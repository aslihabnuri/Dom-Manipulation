# 🎬 Studio Video Cerita

Aplikasi untuk membuat video pendek bergaya animasi penjelas — untuk TikTok, Instagram Reels, dan YouTube Shorts — yang **mempromosikan produk secara halus lewat cerita**, bukan lewat iklan.

Dibuat untuk dipakai tanpa perlu bisa memprogram. Semua lewat tampilan di peramban.

---

## Cara memasang

Butuh dua hal terpasang di komputer: **Python** dan **ffmpeg**.

### Windows

1. Pasang Python dari <https://www.python.org/downloads/>
   **Penting:** centang kotak *"Add Python to PATH"* saat memasang.
2. Buka PowerShell, ketik: `winget install Gyan.FFmpeg`
3. Tutup PowerShell.
4. Klik dua kali berkas **`jalankan.bat`**

### macOS

1. Buka Terminal, pasang Homebrew bila belum ada: lihat <https://brew.sh>
2. Ketik: `brew install python ffmpeg`
3. Di Terminal, masuk ke folder ini lalu ketik: `bash jalankan.sh`

### Linux

```bash
sudo apt install python3 python3-venv ffmpeg
bash jalankan.sh
```

Saat pertama dijalankan, aplikasi menyiapkan lingkungannya sendiri. Ini butuh
beberapa menit, tapi cuma sekali. Setelah itu peramban akan terbuka sendiri.

---

## Pertama kali membuka

1. Di panel kiri, tempel **API key Kie** kamu, lalu tekan **Simpan kunci**.
   Ambil kuncinya di <https://kie.ai/api-key>.
2. Tekan **Uji koneksi** untuk memastikan kuncinya benar.
3. Buat proyek baru.

Kunci disimpan di berkas `.env` di komputermu sendiri. Berkas itu sudah diatur
supaya tidak pernah ikut terunggah ke GitHub.

---

## Alur kerja

Lima tahap, berurutan. Tahap berbayar selalu menampilkan perkiraan biaya lebih
dulu, dan video baru dirakit setelah kamu menekan tombol setuju.

### 1 · Produk — *gratis*

Unggah foto produk, isi nama barang, merek, kategori, dan keterangan singkat.

Foto produk dipakai sebagai **acuan gambar**: di adegan terakhir, produk digambar
ulang menjadi ilustrasi datar dengan bentuk dan warna yang tetap sama seperti
barang aslimu.

### 2 · Riset Topik — *gratis*

Aplikasi menarik berita Indonesia terbaru dan tren pencarian hari ini, lalu
menyusun ide cerita yang nyambung dengan produkmu.

Tiap ide diberi tiga skor: seberapa **segar**, seberapa **nyambung** dengan
produk, dan seberapa kuat **menahan penonton** sampai habis. Pilih satu.

### 3 · Naskah — *gratis*

Naskah ditulis mengikuti kerangka cerita yang kamu pilih. Aturan yang dipaksakan:

- Merek hanya muncul di adegan terakhir, satu kali saja.
- Tidak ada kalimat jualan keras di dalam narasi.
- Semua angka ditulis dengan huruf, supaya mesin suara tidak keseleo.
- Kalimat maksimal dua puluh kata.

Naskahnya bisa kamu ubah langsung. Di bawah tiap adegan ada baris
*"Yang akan dibaca narator"* — itu teks persis yang masuk ke mesin suara,
sudah lengkap dengan angka yang dieja.

### 4 · Storyboard — *berbayar*

Di sinilah gambar dan suara benar-benar dibuat. Perkiraan biaya ditampilkan
sebelum tombol ditekan.

Setelah selesai, kamu bisa **melihat setiap gambar** dan **mendengarkan setiap
potongan suara** satu per satu. Periksa baik-baik di tahap ini. Kalau ada satu
kata yang salah ucap, perbaiki naskahnya lalu buat ulang storyboard.

Video baru dirakit setelah kamu mencentang kotak persetujuan.

### 5 · Video — *gratis*

Perakitan video tidak memakai kredit sama sekali. Hasilnya:

- Berkas video 1080×1920, siap unggah
- Caption terpisah untuk TikTok, Instagram, dan YouTube
- Daftar tagar
- Komentar pertama untuk memancing percakapan
- Berkas takarir `.srt`
- Daftar periksa sebelum unggah

Semua berkas itu juga otomatis disalin ke Google Drive, ke folder sesuai
kategorinya.

---

## Kirim otomatis ke Google Drive

Setiap video yang selesai langsung masuk ke folder kategorinya:

| Kategori | Folder tujuan |
|---|---|
| Food & Beverage | `seruputsejarah` |
| Fashion | `benangmerah` |

Di dalamnya dibuatkan subfolder per proyek, misalnya
`seruputsejarah/2026-08-16 Nomukita Matcha Uji/`, berisi video, takarir,
caption, dan naskahnya. Nama folder bisa diganti di halaman Pengaturan.

### Cara termudah — tanpa pengaturan apa pun

Pasang **Google Drive for Desktop** dari
<https://www.google.com/drive/download/>, lalu buka ulang aplikasi ini.
Aplikasi akan menemukan sendiri folder Drive di komputermu dan menyalin
hasilnya ke sana. Drive yang mengurus pengunggahannya.

Tidak ada API key, tidak ada token, tidak ada yang bisa kedaluwarsa.

Cara ini dipilih dengan sengaja. Mengunggah lewat API Google memerlukan
pendaftaran proyek Google Cloud, layar persetujuan OAuth, dan berkas
kredensial — beban yang tidak sepadan, apalagi berkas videonya belasan megabyte.

### Alternatif — rclone

Kalau tidak memakai Drive Desktop, pasang [rclone](https://rclone.org/downloads/)
lalu jalankan `rclone config` sekali untuk menyambungkan akun Google Drive-mu.
Setelah itu aplikasi memanggil `rclone copy` sendiri.

### Kalau keduanya tidak ada

Aplikasi tetap menyelesaikan videonya seperti biasa dan memberitahu bahwa
berkasnya belum terkirim. Semua hasil tetap tersimpan di folder `projects/`
dan bisa kamu unggah sendiri kapan saja.

---

## Perkiraan biaya

Diukur langsung dari pemakaian nyata, untuk video 45 detik dengan enam adegan:

| Bagian | Biaya |
|---|---|
| Riset topik | ± 0 kredit |
| Naskah | ± 0 kredit |
| Gambar storyboard | 4 kredit per adegan |
| Suara narator | ± 2 kredit per adegan |
| Perakitan video | 0 kredit |
| Caption dan tagar | ± 0 kredit |
| **Total** | **± 37 kredit** |

Untuk video sepuluh adegan, kira-kira 60 kredit.

Gerak gambar dibuat oleh komputermu sendiri dengan ffmpeg, bukan oleh model AI.
Itu sebabnya perakitan videonya gratis.

---

## Beberapa hal yang perlu kamu tahu

### Kenapa gerak gambarnya tidak pakai AI

Model *image-to-video* sudah diuji. Hasilnya: bentuk karakter berubah di tengah
klip — mulut hilang, kaki berubah bentuk, proporsi bergeser. Biayanya 20 kredit
per lima detik, jadi satu video enam adegan menghabiskan 240 kredit dengan hasil
yang tidak bisa dipastikan.

Untuk video yang harus jadi sekali tanpa revisi, itu tidak sepadan. Gerak
terprogram memberi hasil yang sama persis setiap kali, tanpa biaya, dan
ilustrasinya tidak pernah rusak.

Model AI-nya tetap tersedia di Pengaturan bila suatu saat kamu butuh untuk
adegan tertentu.

### Kenapa penulis naskahnya Gemini, bukan Claude

Kie menyediakan dua jalur untuk model teks, dan keduanya berperilaku sangat
berbeda.

Jalur Claude (`/claude/v1/messages`) ternyata **disisipi system prompt "Ask
mode"** oleh Kie — persona asisten pemrograman. Akibatnya, saat diminta menulis
naskah atau meriset topik, modelnya sering menolak dan membalas kira-kira
*"this isn't a coding question, switch to Agent mode"* alih-alih mengembalikan
hasil yang diminta. Jalur ini juga menolak permintaan non-stream.

Karena itu penulis naskah memakai **Gemini 3 Pro** lewat jalur
`/<model>/v1/chat/completions`, yang bersih tanpa sisipan apa pun, mendukung
peran system, dan jauh lebih murah — sekitar 0,02 kredit sekali panggil.

Claude tetap tersedia di Pengaturan sebagai cadangan. Kalau suatu saat model
membalas dengan penolakan, aplikasi mengenalinya dan memberi pesan yang jelas,
bukan diam-diam menghasilkan naskah kosong.

### Soal dubbing Bahasa Indonesia

ElevenLabs lewat Kie **sedang tidak berfungsi** saat aplikasi ini dibuat. Semua
modelnya — Multilingual v2, Turbo 2.5, dan Text-to-Dialogue v3 — mengembalikan
galat internal server. Kredit tidak terpotong, jadi bukan masalah saldo.

Karena itu suara utamanya memakai **Gemini 3.1 Flash TTS**, yang sudah diuji
bekerja baik untuk Bahasa Indonesia. Kalau penyedia utama gagal, aplikasi
otomatis pindah ke penyedia berikutnya tanpa menghentikan produksi:

1. Gemini 3.1 Flash TTS lewat Kie — utama
2. Edge TTS — gratis, tanpa API key, suara `id-ID-GadisNeural` dan `id-ID-ArdiNeural`
3. ElevenLabs lewat Kie — otomatis dipakai lagi kalau Kie sudah memperbaikinya
4. ElevenLabs dengan API key sendiri — bila kamu punya akun terpisah

### Bagaimana "slip of tongue" dicegah

Ada dua lapis pertahanan: sebelum suara dibuat, dan sesudahnya.

**Lapis pertama — membersihkan naskah sebelum dikirim ke mesin suara:**

- Semua angka diubah jadi kata: `1972` → *"seribu sembilan ratus tujuh puluh dua"*
- Mata uang, persen, suhu, dan satuan ikut dieja
- Singkatan dipanjangkan: `yg` → *yang*, `dll` → *dan lain-lain*
- Kata serapan ditulis fonetis: `matcha` → *maca*, `vintage` → *vintèj*
- Kata ber-e ambigu diberi aksen: `tempe` → *témpé*, `sate` → *saté*
- Kalimat lebih dari 28 kata ditandai untuk dipecah
- Tiga kata berurutan berawalan sama ditandai sebagai risiko keseleo lidah

Kamu juga bisa menambah kamus sendiri di Pengaturan, satu baris per kata dengan
format `kata=cara baca`.

**Lapis kedua — mendengarkan kembali suara yang sudah jadi.**

Naskah yang benar ternyata belum menjamin ucapan yang benar. Pada produksi
sungguhan, mesin suara pernah menghasilkan ini:

```
naskah  : ...banyak orang keliru menilainya sebagai plastik biasa.
terucap : ...banyak orang keliurum menilainya sebagai plastik biasa,
          banyak orang keliurum menilainya sebagai plastik biasa.
```

Satu frasa terucap dua kali, dan "keliru" berubah jadi "keliurum". Tidak ada
pemeriksaan teks yang bisa menangkap ini, karena naskahnya sendiri sudah benar.

Karena itu aplikasi mendengarkan kembali setiap potongan suara, menuliskan apa
yang terdengar, lalu membandingkannya dengan naskah. Potongan yang menyimpang
**dibuat ulang otomatis**, sampai tiga kali, sebelum kamu sempat melihatnya.
Satu potongan hanya sekitar satu kredit — jauh lebih murah daripada membiarkan
cacatnya masuk ke video jadi.

Nyalakan di Pengaturan, dan pasang dulu paketnya:

```
pip install faster-whisper
```

Pemeriksaan berjalan di komputermu sendiri, gratis, dan menambah sekitar
sepuluh detik per adegan.

**Kalau paket itu tidak dipasang**, aplikasi tetap punya jaring pengaman yang
tidak butuh apa pun: kecepatan bicara tiap adegan dibandingkan dengan adegan
lain di video yang sama. Frasa yang terucap dua kali membuat satu potongan jauh
lebih panjang dari seharusnya, sehingga kecepatannya anjlok dan langsung
ditandai. Pada kasus di atas, adegan yang cacat terbaca 113 kata per menit
sementara tujuh adegan lainnya seragam di 157.

Terakhir, semua suara dirapikan otomatis: keheningan panjang dipangkas dan tempo
disamakan, supaya kecepatan bicara konsisten di seluruh video.

### Soal terdeteksi sebagai video AI

Ini perlu dijawab jujur, karena ada dua hal berbeda yang sering tercampur.

**Yang aplikasi ini lakukan** adalah membuat videonya bagus, sehingga tidak
terlihat seperti keluaran mesin yang asal jadi:

- Gaya animasi datar memang gaya seni, bukan tiruan foto. Yang biasanya membuat
  penonton dan algoritma bereaksi negatif adalah video AI yang mencoba tampak
  nyata tapi janggal — wajah aneh, jari berlebih, gerakan meleleh. Animasi
  vektor tidak punya masalah itu.
- Durasi tiap adegan mengikuti panjang kalimat, bukan potongan seragam.
- Jenis gerak kamera berganti-ganti antaradegan.
- Ada butiran halus dan vignette untuk memecah kesan render digital yang terlalu bersih.
- Efek suara berlapis dan musik yang ditekan otomatis saat narator bicara.
- Naskah ditulis dengan aturan ketat supaya tidak berbunyi seperti mesin.

**Yang aplikasi ini tidak lakukan** adalah menghapus metadata asal-usul dari
berkas keluaran model. Menghapusnya melanggar ketentuan penyedia model dan
aturan pelabelan konten sintetis yang kini berlaku di banyak wilayah.

Saran praktisnya: **nyalakan sendiri penanda "konten buatan AI"** saat mengunggah.
TikTok, Instagram, dan YouTube semuanya menyediakan sakelar itu. Memakainya tidak
menurunkan jangkauan. Yang menurunkan jangkauan justru kalau platform mendeteksi
sendiri setelah kamu tidak mendeklarasikannya.

---

## Kalau ada masalah

**"ffmpeg belum terpasang"**
Aplikasi tidak bisa merakit video tanpa ini. Ikuti langkah pemasangan di atas,
lalu tutup dan buka lagi jendela perintahnya.

**"Server Kie sedang bermasalah untuk model ini"**
Coba lagi beberapa menit kemudian, atau ganti penyedia suara di Pengaturan.
Aplikasi tidak memotong kredit untuk tugas yang gagal.

**"Saldo kredit Kie tidak cukup"**
Isi ulang di <https://kie.ai>.

**Suara narator terlalu cepat atau terlalu lambat**
Ubah penggeser *Kecepatan bicara narator* di tahap Storyboard, lalu buat ulang.

**Takarir tertutup tombol aplikasi**
TikTok menutupi sekitar 15% bagian bawah layar. Takarir sudah ditaruh di atas
area itu, tapi kalau masih tertutup, kecilkan ukurannya lewat `core/subtitles.py`
pada nilai `margin_bawah`.

**Gambar tidak sesuai bayangan**
Ubah kalimat di kolom naskah, lalu buat ulang storyboard. Yang menentukan gambar
adalah kolom `deskripsi_visual` yang dihasilkan dari narasi tiap adegan.

---

## Isi folder

```
video-studio/
├── app.py                 tampilan aplikasi
├── jalankan.bat           peluncur Windows
├── jalankan.sh            peluncur macOS dan Linux
├── core/
│   ├── config.py          pengaturan, kunci API, daftar model
│   ├── kie.py             sambungan ke API Kie
│   ├── idn.py             normalisasi Bahasa Indonesia untuk dubbing
│   ├── categories.py      kategori, gaya visual, kerangka cerita
│   ├── research.py        riset topik dari berita dan tren
│   ├── script.py          penulisan naskah dan pemeriksaan mutu
│   ├── tts.py             suara narator dan rantai cadangannya
│   ├── visuals.py         gambar storyboard
│   ├── audio.py           efek suara dan penataan audio
│   ├── subtitles.py       takarir dan teks di layar
│   ├── assemble.py        perakitan video dengan ffmpeg
│   ├── social.py          caption dan tagar
│   ├── store.py           penyimpanan proyek
│   └── pipeline.py        alur kerja lima tahap
├── assets/fonts/          Poppins, berlisensi SIL Open Font License
└── projects/              hasil kerjamu, satu folder per proyek
```

---

## Catatan lisensi

Font Poppins dipakai di bawah SIL Open Font License 1.1. Salinan lisensinya ada
di `assets/fonts/OFL.txt`.

Efek suara dibangkitkan secara matematis oleh ffmpeg, bukan diambil dari pustaka
mana pun, jadi tidak ada masalah hak cipta.
