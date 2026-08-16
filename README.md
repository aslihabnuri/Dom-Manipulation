# ◐ Naratif

Studio produksi video **soft-selling gaya Vox** untuk **Makanan & Minuman** dan **Fashion**.
Satu alur dari riset topik sampai caption siap unggah — dengan pemeriksaan bahasa Indonesia
yang dirancang supaya video bisa jadi sekali produksi, tanpa revisi.

```
riset topik → naskah + QC bahasa → dubbing + verifikasi → gambar → rakit video → QC teknis → caption
   murah            murah              sedang            mahal      gratis        gratis     murah
```

Urutannya sengaja begitu: **semua yang bisa salah dan murah diperiksa dulu**, sebelum satu
rupiah pun keluar untuk generasi gambar. Masalah naskah ketahuan seharga beberapa sen.
Masalah yang sama kalau baru ketahuan setelah video jadi, harganya satu render penuh.

---

## Daftar isi

- [Pasang](#pasang)
- [Mulai cepat](#mulai-cepat)
- [Kenapa videonya begini — hasil bedah referensi](#kenapa-videonya-begini--hasil-bedah-referensi)
- [Mesin bahasa Indonesia](#mesin-bahasa-indonesia)
- [Strategi sekali jadi](#strategi-sekali-jadi)
- [Soal "tidak terdeteksi AI" — jawaban jujur](#soal-tidak-terdeteksi-ai--jawaban-jujur)
- [Riset topik yang selalu segar](#riset-topik-yang-selalu-segar)
- [Sound design](#sound-design)
- [Biaya](#biaya)
- [Perintah CLI](#perintah-cli)
- [Struktur kode](#struktur-kode)
- [Kalau ada masalah](#kalau-ada-masalah)

---

## Pasang

### Cara paling mudah: klik dua kali

1. **[Unduh ZIP-nya di sini](https://github.com/aslihabnuri/Dom-Manipulation/archive/refs/heads/claude/video-ai-soft-selling-app-rj9zpv.zip)**
   — satu klik, langsung terunduh.
2. Buka ZIP-nya, pindahkan foldernya ke tempat yang gampang dicari (misalnya Documents).
3. Klik dua kali berkas peluncur sesuai sistemmu:

| Sistem | Berkas |
|---|---|
| macOS | `Mulai Naratif (Mac).command` |
| Windows | `Mulai Naratif (Windows).bat` |
| Linux | `Mulai Naratif (Linux).sh` |

Peluncurnya memeriksa dan memasang sendiri Node.js dan ffmpeg kalau belum ada,
menyiapkan aplikasinya, lalu membuka browser. **Kunci API diisi di halaman yang
terbuka itu**, bukan di berkas teks.

Sekali selesai, seterusnya cukup klik dua kali berkas yang sama.

> **macOS** akan menolak berkas yang diunduh dari internet pada percobaan pertama
> (*"cannot be opened because it is from an unidentified developer"*). Klik kanan
> berkasnya, pilih **Open**, lalu **Open** sekali lagi di kotak yang muncul. Cukup
> sekali; setelah itu klik dua kali biasa sudah jalan.

> **Windows** mungkin menampilkan layar biru *"Windows protected your PC"*. Klik
> **More info**, lalu **Run anyway**.

Jendela hitam yang muncul itu cuma penunjuk kemajuan. Kamu tidak perlu mengetik
apa pun di sana. Biarkan terbuka selama memakai aplikasi; menutupnya menghentikan
studio.

### Kalau kamu terbiasa dengan terminal

```bash
git clone https://github.com/aslihabnuri/Dom-Manipulation.git
cd Dom-Manipulation
npm install
npm start          # membuka browser sendiri
```

Kunci API tetap bisa diisi lewat layar setup di browser, atau langsung ke `.env`
kalau lebih suka. `npm run doctor` menampilkan komponen mana yang belum siap.

### Yang dibutuhkan

Peluncur memasang keduanya otomatis, jadi ini cuma untuk pemasangan manual:

- **Node.js 20+**
- **ffmpeg dengan libass** — libass yang membakar takarir ke video. Tanpa itu,
  videonya jadi tanpa teks sama sekali dan tidak ada pesan error.

---

## Mulai cepat

Setelah peluncur berjalan dan kunci API terisi, semuanya di satu layar:

1. Klik **+ Baru**, pilih kategori (F&B atau Fashion), isi produknya.
2. Klik **Riset topik** — muncul enam usulan sudut cerita dengan skor kekuatan
   hook dan skor kehalusan jualan.
3. Pilih satu, klik **Pakai topik ini**.
4. Periksa naskah dan temuan bahasanya, lalu lanjut tahap demi tahap.
   Atau klik **Jalankan semua** untuk sekali jalan sampai caption jadi.

Tiap tahap punya tombolnya sendiri, jadi kamu bisa berhenti dan memeriksa hasil
sebelum masuk ke tahap yang lebih mahal.

### Memeriksa naskah tanpa membuka aplikasi

Ada versi web dari pemeriksa bahasanya yang jalan tanpa instalasi dan tanpa kunci
API, cocok dibuka dari HP: **[Pemeriksa Pelafalan](https://claude.ai/code/artifact/568e5970-baba-48a7-b96e-e1d97311f174)**.
Sumbernya ada di [`artifact/`](artifact) dan dibangun dari modul yang sama persis
dengan aplikasinya, jadi keduanya tidak mungkin berbeda pendapat.

---

## Kenapa videonya begini — hasil bedah referensi

Dua video referensi yang kamu kirim dibedah dulu, dan angkanya jadi spesifikasi di
[`src/vox.mjs`](src/vox.mjs).

### Referensi 1 — ritme, warna, dan mixing

| Yang diukur | Hasil | Dipakai untuk |
|---|---|---|
| Potongan gambar | **45 cut dalam 43 detik** ≈ 1 detik per shot | Ritme edit; segmen panjang otomatis dipecah jadi beberapa shot |
| Jeda narasi | **cuma satu jeda 0,21 detik** dalam 43 detik | Narasi dibuat mengalir tanpa dead air |
| Loudness | **-16,7 LUFS**, LRA 5,9 LU | Target mixing; hasil Naratif diukur -16,5 LUFS |
| Warna paling gelap | **#181319** — bukan hitam murni | Grading: `colorlevels` mengangkat titik hitam ke `#14111C` |
| Rasio | 9:16 vertikal | Kanvas 1080×1920 |

Poin terakhir itu justru yang paling ditekankan di videonya: latar Vox **tidak pernah
hitam murni**. Ada *tint* yang mengangkat titik hitam sedikit ke arah ungu supaya
kontrasnya halus. Hitam murni terlihat murah; `#14111C` terlihat editorial.

### Referensi 2 — stabilo dan latar kertas

Video kedua (@dodford, "Fake highlights in Premiere Pro") menambahkan dua hal yang
tidak ada di referensi pertama.

**Efek stabilo.** Color picker-nya terbaca H 58 / S 94 / B 100 — yaitu **`#FFF70F`**,
kuning spidol yang pekat, bukan pastel. Tiga detail yang menentukan:

1. Blend mode **multiply**, jadi teks menggelap *lewat* tintanya, bukan tertutup.
2. Skala vertikal dipendekkan dan kotaknya duduk agak rendah — spidol asli memang
   tidak menutup seluruh tinggi huruf.
3. Efek **Crop** dianimasikan kiri→kanan dengan **ease-in**: stroke-nya *digambar*,
   bukan muncul memudar.

Ketiganya bisa direproduksi persis di libass — kotak tinta dari `BorderStyle 3`,
sapuan dari `\clip` yang dianimasikan lewat `\t`, dan miring tangan dari `\frz`:

```
{\frz1.8\clip(202,829,202,1133)\t(0,420,\clip(202,829,878,1133))}Belum pernah dicoba
```

**Latar kertas.** Referensi kedua sebagian besar berlatar terang: koran tua menguning,
kertas dengan noda foxing, dinding beton pudar. Ini keluarga latar yang berbeda dari
referensi pertama, dan pergantian di antara keduanya justru yang memberi ritme —
frame kertas terasa terang karena datang setelah beberapa frame gelap.

### Dua keluarga latar

Setiap arketipe shot menyatakan keluarganya, dan perencana shot **berganti keluarga
setiap tiga shot**:

| Gelap | Terang |
|---|---|
| kolase potongan kertas | koran tua |
| foto arsip | tekstur kertas |
| gambar teknis | ukiran |
| diagram peta | cetak biru di kertas |
| objek di ruang kosong | dinding beton |
| makro tekstur | |

Keluarga latar juga menentukan bentuk kartu penekanan di tengah layar:

- **Latar gelap** → kartu serif terang di atas panel gelap transparan.
- **Latar kertas** → sapuan stabilo kuning dengan teks gelap.

Ini bukan pilihan gaya semata. Stabilo di atas frame gelap akan salah dua kali:
tintanya menyala alih-alih menandai, dan teks gelapnya hilang.

---

## Mesin bahasa Indonesia

Ini bagian yang paling menentukan apakah dubbing bisa bersih sekali jalan.

### Masalahnya

Mesin *text-to-speech* multibahasa menebak saat membaca bahasa Indonesia, dan tebakannya
sering salah di tempat-tempat yang bisa diprediksi:

1. **Angka.** `1945` sering dibaca dalam bahasa Inggris, atau digit per digit.
2. **Akronim.** `AI` dibaca sebagai kata "ai", bukan huruf "a-i".
3. **Huruf `e`.** Bahasa Indonesia punya dua bunyi `e` yang ejaannya sama:
   pepet /ə/ (b**e**ras) dan taling /e/ (m**e**ja). Mesin menebak, dan salah di kata
   yang lebih jarang.
4. **Homograf.** `apel` (buah) vs `apel` (upacara). `mental` (terpental) vs `mental`
   (psikologis). Salah tebak di sini **mengubah arti kalimat**.
5. **Campur Inggris.** Satu kata Inggris di tengah kalimat Indonesia bikin mesin
   berpindah aksen sesaat lalu balik lagi. Ini tanda paling kentara video AI.
6. **Kalimat panjang.** Lebih dari ~22 kata, mesin kehabisan napas dan mempercepat tempo.

### Yang dilakukan Naratif

**Normalisasi** ([`src/lang/normalize.mjs`](src/lang/normalize.mjs)) — setiap angka,
tanggal, mata uang, persen, dan akronim diubah jadi kata sebelum dikirim ke mesin:

```
MASUK : Di tahun 1945 harganya Rp250.000 naik 70%.
KELUAR: Di tahun seribu sembilan ratus empat puluh lima harganya
        dua ratus lima puluh ribu rupiah naik tujuh puluh persen.
```

**Pemeriksa** ([`src/lang/lint.mjs`](src/lang/lint.mjs)) — memeriksa 14 jenis risiko.
Yang bisa mengubah arti diberi status `error` dan **memblokir produksi**:

```
DITOLAK  3 error · 1 peringatan · 13 kata · ~5 detik

ERROR  kata-kembar
       Kata "sangat" muncul dua kali berturut-turut.
       → Hapus salah satu.

ERROR  homograf
       "apel" punya dua pelafalan dengan arti berbeda:
       buah apel (/apəl/) vs upacara apel (/apel/).
       → Ganti jadi "buah apel" atau "apel pagi".

WARN   campur-inggris
       "brand" adalah kata Inggris. Mesin akan berpindah aksen sesaat.
       → Ganti jadi "merek".
```

Kalau pemeriksa menolak, naskahnya **dikirim balik ke Claude dengan temuan yang persis**,
bukan disuruh "coba lagi". Maksimal tiga putaran perbaikan.

### Verifikasi dubbing — ini kuncinya

Pemeriksa memprediksi masalah dari teks. Yang benar-benar membuktikan dubbing bersih
adalah ini ([`src/lang/wer.mjs`](src/lang/wer.mjs)):

> Setiap segmen disuarakan → **ditranskripsi ulang** dengan *speech-to-text* →
> dibandingkan kata per kata dengan naskah aslinya.

Kalau selisihnya (Word Error Rate) di atas 5%, segmen itu **otomatis diulang** dengan
setelan suara yang lebih stabil — sampai tiga kali, makin konservatif tiap kali:

| Percobaan | Setelan | Alasan |
|---|---|---|
| 1 | Setelan kamu | Paling ekspresif |
| 2 | stability 0.85, style 0 | Kurang ekspresif, jauh lebih bisa ditebak |
| 3 | stability 0.95, style 0, speed 0.92 | Pelan itu lebih mudah dibaca mesin |

Dan UI menunjukkan persis kata mana yang salah dengar:

```
WER 14.3%   sophie → sopi
```

Ongkos verifikasi ini beberapa sen per video. Menemukan masalah yang sama setelah
video jadi ongkosnya satu render penuh.

### Kalau dubbing masih kurang

Suara ElevenLabs direkam oleh penutur bahasa Inggris. Sebagian membawa sedikit aksen
ke bahasa Indonesia. `npm run cli -- voices` memberi daftar yang paling cocok untuk
narasi dokumenter — mulai dari **Brian**.

Kalau setelah dicoba masih kurang natural, alternatifnya:

1. **Voice cloning ElevenLabs** — rekam 3 menit suara penutur Indonesia asli, buat
   *Instant Voice Clone*, lalu isi `TTS_VOICE` dengan voice ID-nya dan `ELEVENLABS_API_KEY`.
   Ini yang paling bagus hasilnya, dan mesin verifikasi tetap jalan sama persis.
2. **Dubber manusia** — jalankan sampai tahap naskah, ambil teksnya dari
   `data/projects.json`, rekam sendiri, lalu taruh file per segmen di
   `tmp/<projectId>/vo/seg-000.mp3` dan seterusnya, lalu lanjut dari tahap `assemble`.

---

## Strategi sekali jadi

Permintaannya: video jadi sekali produksi, tanpa revisi. Yang dipasang untuk itu:

**1. Gerbang bertingkat.** Tiap tahap punya syarat lulus. Gagal di gerbang = berhenti,
bukan lanjut dan boros.

| Gerbang | Memeriksa | Kalau gagal |
|---|---|---|
| Naskah | 0 error pemeriksa bahasa | Berhenti sebelum keluar biaya dubbing |
| Dubbing | Semua segmen WER ≤ 5% | Berhenti sebelum keluar biaya gambar |
| Visual | Semua gambar berhasil | Berhenti sebelum perakitan |
| QC teknis | Lihat tabel di bawah | Video ditandai bermasalah |

**2. Batas biaya.** `MAX_COST_PER_VIDEO_USD` di `.env`. Perkiraan biaya dihitung
sebelum tahap mahal; kalau lewat batas, produksi berhenti dengan pesan jelas.

**3. QC teknis otomatis** ([`src/pipeline/qc.mjs`](src/pipeline/qc.mjs)) — memeriksa
hal-hal yang biasanya baru ketahuan waktu ditonton:

| Pemeriksaan | Kenapa penting |
|---|---|
| Frame hitam | Kegagalan render yang paling sering luput |
| True peak > -0,5 dB | Audio mentok dan terdengar pecah |
| Loudness vs -16,5 LUFS | Platform menormalkan sendiri; kalau jauh, hasilnya berubah |
| Jeda sunyi > 0,9 detik | Titik penonton berhenti nonton |
| `pix_fmt` bukan yuv420p | Tidak jalan di sebagian pemutar |
| Durasi menyimpang > 35% | Biasanya berarti ada segmen hilang |
| Resolusi, fps, sample rate | Spesifikasi unggah |

Hasilnya muncul di tab **Hasil** — jadi kamu tidak perlu menonton video itu sendiri
untuk tahu ia layak unggah.

---

## Soal "tidak terdeteksi AI" — jawaban jujur

Ini perlu dijawab terus terang, karena separuh dari yang biasa dijanjikan orang untuk
hal ini tidak benar dan separuh lagi berbahaya buat akunmu.

### Yang Naratif lakukan, dan kenapa itu berpengaruh

**Gaya visualnya sendiri adalah pertahanan terbaik.** Yang dideteksi mesin pendeteksi
AI adalah ciri khas video generatif fotorealistis: wajah yang sedikit meleleh, tangan
berjari enam, gerak kamera yang meluncur terlalu mulus, tekstur kulit yang terlalu rata.
Gaya Vox **tidak punya satu pun dari itu** — ia motion graphics: kolase, foto arsip,
gambar teknis, garis dan titik. Itu persis yang dibuat editor manusia di After Effects.
Karena memang begitulah cara Naratif membuatnya.

Mode default (`collage`) memakai **gambar diam yang digerakkan saat perakitan**, bukan
video AI. Ini bukan cuma jauh lebih murah — ini juga menghilangkan *drift* khas video
generatif, karena gerakannya berasal dari `zoompan` ffmpeg, sama seperti Ken Burns di
editor mana pun.

Selain itu:

- **Tidak ada wajah AI.** Prompt negatif memblokir wajah, potret, dan tangan.
- **Tidak ada teks hasil generasi di gambar.** Huruf palsu adalah penanda AI paling
  kentara; semua teks datang dari takarir yang dirender libass.
- **Grain film asli**, bukan filter — memecah gradien datar dan pita warna yang
  biasa muncul di gambar generatif.
- **Dubbing diverifikasi manusia-setara**, jadi tidak ada pelafalan aneh yang jadi
  penanda sintetis.
- **Profil encoding standar** — H.264 High, level 4.0, CRF 20, yuv420p, faststart:
  sama persis dengan yang dikeluarkan Premiere atau DaVinci untuk media sosial.
- **Tidak ada metadata yang menyebut pipeline ini.** `-map_metadata -1` membersihkan
  semua tag; file hasil tidak membawa nama alat apa pun.

### Yang Naratif TIDAK lakukan, dan kenapa

Naratif **tidak menghapus atau memalsukan penanda provenance C2PA**, dan tidak menulis
metadata palsu yang mengaku video ini berasal dari kamera.

Alasannya praktis, bukan cuma prinsip:

1. **TikTok, Meta, dan YouTube mewajibkan pengungkapan konten AI.** Memalsukan asal-usul
   melanggar ketentuan mereka, dan sanksinya jatuh ke akun — persis aset yang sedang
   kamu bangun.
2. **Deteksi mereka tidak cuma baca metadata.** Platform punya sinyal sendiri di sisi
   server. Membersihkan metadata tidak membuat video lolos; itu cuma menghapus jejak
   yang bisa kamu jelaskan kalau ditanya.

Jadi posisi jujurnya: **Naratif membuat video yang tidak terlihat seperti AI karena
memang bukan AI-slop** — ia motion graphics dengan aset generatif, dikerjakan seperti
editor manusia mengerjakannya. Itu yang bisa dijanjikan. Yang tidak bisa dijanjikan
siapa pun adalah lolos dari sistem deteksi platform, dan alat yang menjanjikan itu
biasanya sedang mempertaruhkan akunmu.

Kalau kamu memang perlu menandai video sebagai buatan AI di TikTok atau Instagram,
sakelarnya ada di aplikasi mereka saat unggah.

---

## Riset topik yang selalu segar

Meminta model "cari topik yang segar" bukan jaminan. Naratif memakai tiga lapis:

**1. Dua belas arketipe sudut pandang** ([`src/pipeline/research.mjs`](src/pipeline/research.mjs)) —
tiap arketipe memaksa bentuk cerita yang benar-benar beda:

| | | |
|---|---|---|
| asal-usul | ketidaksengajaan | krisis |
| kelas sosial | sains di baliknya | mitos yang keliru |
| tangan perajin | ekonomi tersembunyi | rute perjalanan |
| jejak Nusantara | ritual & kebiasaan | kenapa bentuknya begitu |

Daftarnya **dirotasi** berdasarkan berapa banyak topik yang sudah pernah dipakai, jadi
riset kedua untuk produk yang sama mulai dari titik berbeda.

**2. Riwayat dikirim ke dalam prompt.** Semua judul yang pernah dipakai ikut dikirim
dengan larangan menyerupainya.

**3. Penyaringan setelahnya.** Judul yang mirip riwayat tetap dibuang di sisi kode,
bahkan kalau model mengabaikan instruksinya.

Topik hanya dicatat sebagai "terpakai" **setelah videonya benar-benar jadi** — produksi
yang gagal di tengah jalan tidak membakar sudut ceritanya.

Tiap topik datang dengan skor kekuatan hook dan skor kehalusan jualan (1-10), plus
daftar **fakta yang perlu dicek** — supaya tidak ada tanggal atau angka karangan.

Contoh untuk matcha:

```
[0] Kenapa Matcha Harus Diaduk Membentuk Huruf W
    hook 9/10 · halus 9/10
    Perlu dicek: asal teknik chasen, abad ke-16, Sen no Rikyū
```

---

## Sound design

Efek suaranya **disintesis ffmpeg saat produksi**, bukan file audio yang dibundel —
jadi tidak ada masalah lisensi dan hasilnya selalu sama.

| Efek | Durasi | Dipakai untuk |
|---|---|---|
| `whoosh` | 0,55s | Perpindahan antar-bagian |
| `thud` | 0,45s | Penekanan berat |
| `paper` | 0,30s | Elemen kolase masuk |
| `click` | 0,09s | Aksen kecil |
| `riser` | 1,30s | Naik menuju titik balik |
| `drop` | 0,80s | Tepat di titik baliknya |

`riser` sengaja dimulai 1,1 detik **sebelum** ketukannya, karena begitulah cara kerjanya
di edit sungguhan. Yang lain jatuh tepat di ketukan.

Musik latar opsional (`--music <path>`) dipasang dengan **sidechain ducking** terhadap
narasi — jadi musik mengecil saat ada suara dan naik lagi di sela-selanya, bukan
dipasang di level rata.

Seluruh mix dinormalkan ke **-16,5 LUFS** dengan true peak -1,5 dB.

---

## Biaya

Perkiraan untuk video 45 detik (~39 segmen), mode `collage`:

| Tahap | Perkiraan |
|---|---|
| Claude (riset, naskah, caption) | ~$0,24 |
| Dubbing + verifikasi transkripsi | ~$0,98 |
| Gambar (39 buah) | ~$1,50 |
| Perakitan + QC | gratis (lokal) |
| **Total** | **~$2,70** |

Mode `aigen` (video Veo) sekitar **20× lebih mahal** dan lebih mudah dikenali sebagai AI.
Pakai hanya untuk satu-dua shot kunci kalau memang perlu.

Biaya asli dicatat per pemanggilan API di `data/cost-ledger.json`:

```bash
npm run cli -- cost proj_a1b2c3   # satu proyek
npm run cli -- cost               # semua proyek
```

---

## Perintah CLI

```
PEMERIKSAAN
  doctor [--live]               Cek kunci API, ffmpeg, dan font
  voices                        Suara yang disarankan untuk narasi Indonesia

BAHASA (gratis, tanpa API)
  lint "<teks>" | --file <path> Periksa risiko pelafalan
  normalize "<teks>"            Ubah angka/akronim jadi kata

PRODUKSI
  new --category <fnb|fashion> --product "<produk>" [--brand "<merek>"]
      [--duration 45] [--mode collage|aigen]
  research <projectId> [--count 6]
  script <projectId> [--topic 0]
  run <projectId> [--topic 0] [--music <path>]

INFO
  list                          Daftar proyek
  show <projectId>              Rincian satu proyek
  cost [projectId]              Biaya terpakai
  history                       Topik yang sudah pernah dipakai
```

---

## Struktur kode

```
server.mjs                 Server HTTP + API + streaming log
bin/cli.mjs                Antarmuka terminal

src/
  config.mjs               Konfigurasi + pemuat .env
  claude.mjs               Klien Claude (structured output, penanganan penolakan)
  kie.mjs                  Klien KIE.ai (createTask/recordInfo + Veo, retry, polling)
  ffmpeg.mjs               Pembungkus ffmpeg, sintesis SFX, penulis takarir ASS
  vox.mjs                  Spesifikasi gaya Vox hasil bedah video referensi
  store.mjs                Penyimpanan JSON (proyek, riwayat topik, buku biaya)
  log.mjs                  Logger terstruktur + siaran SSE

  lang/                    ← inti nilai aplikasi ini
    numbers.mjs            Angka Indonesia → kata
    lexicon.mjs            Pepet/taling, homograf, kata serapan, akronim
    normalize.mjs          Teks → teks yang aman dibaca mesin
    lint.mjs               Pemeriksa risiko pelafalan (14 aturan)
    wer.mjs                Perbandingan naskah vs transkripsi (Word Error Rate)

  pipeline/
    research.mjs           Riset topik + penjagaan kesegaran
    script.mjs             Penulisan naskah + putaran perbaikan otomatis
    voice.mjs              Dubbing + verifikasi transkripsi + pengulangan
    visuals.mjs            Generasi gambar + rencana gerak kamera
    assemble.mjs           Perakitan video (gerak, grading, takarir, mix)
    qc.mjs                 QC teknis
    caption.mjs            Caption TikTok / Instagram / YouTube
    orchestrator.mjs       Penjalan alur + gerbang biaya

web/                       Antarmuka studio (tanpa framework)
```

---

## Kalau ada masalah

**`libass (takarir) HILANG`**
Build ffmpeg-mu tanpa libass, jadi takarir tidak bisa dibakar ke video.
Pasang ulang: `brew install ffmpeg` (macOS) atau `sudo apt install ffmpeg` (Ubuntu).

**`Naskah tidak lolos QC bahasa`**
Ini gerbang bekerja sebagaimana mestinya. Lihat temuannya di tab **Naskah** —
tiap temuan menyebut kata yang bermasalah dan cara memperbaikinya. Klik "Tulis ulang
naskah" untuk mencoba lagi, atau ganti topik kalau topiknya memang sulit diucapkan.

**`X segmen dubbing tidak lolos verifikasi`**
Buka tab **Dubbing** dan lihat kolom "Terdengar berbeda". Biasanya satu nama asing
atau satu kata serapan. Perbaiki kalimatnya di naskah, lalu ulangi dubbing —
tidak perlu mengulang tahap lain.

**`Batas biaya terlampaui`**
Naikkan `MAX_COST_PER_VIDEO_USD` di `.env`, atau pendekkan durasi target.

**Dubbing terdengar seperti orang asing berbahasa Indonesia**
Coba suara lain (`npm run cli -- voices`), atau pakai voice cloning ElevenLabs dengan
rekaman penutur Indonesia. Lihat [Kalau dubbing masih kurang](#kalau-dubbing-masih-kurang).

**Gambar tidak nyambung dengan narasinya**
`visualSubject` ditulis oleh Claude dalam bahasa Inggris per segmen. Kalau meleset,
tulis ulang naskah — subjek visualnya ikut ditulis ulang.

**Video terasa terlalu cepat atau terlalu lambat**
Ubah `RHYTHM.averageShotSeconds` di [`src/vox.mjs`](src/vox.mjs). Nilai 1,15 detik
diambil dari video referensi.
