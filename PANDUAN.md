# Panduan Pakai — Mesin Clipper TikTok LIVE

Panduan ini untuk dipakai langsung. Tidak ada perintah yang perlu diketik.

---

## Pilih satu cara

| | **Lewat Google Colab** | **Aplikasi di komputer** |
|---|---|---|
| Perlu pasang apa pun? | Tidak | Ya, sekali |
| Baca video dari Drive | Langsung, tanpa unduh | Perlu diunduh dulu |
| Cocok untuk | Video sudah di Drive | Pakai tiap hari, video di komputer |

**Kalau video Anda ada di Google Drive, pakai cara pertama.** Lebih cepat karena
video tidak perlu diunduh sama sekali.

---

## Siapkan berkasnya dulu

Apa pun caranya, siapkan ini lebih dulu di Google Drive:

Satu folder untuk satu tanggal live, isinya **dua berkas**:

```
Live/
  2026-08-18/
      rekaman live       .mp4 / .mov / .flv  (apa saja)
      data performa      .csv / .xlsx        (dari Seller Center)
```

Beri nama folder dengan tanggalnya, misalnya `2026-08-18`.

**Boleh ditambah (tidak wajib):** kalau Anda punya berkas subtitle `.srt` dari
video itu, taruh di folder yang sama. Aplikasi akan memakainya dan hasilnya
lebih bagus, karena teks di video jadi lebih tepat.

### Soal data performa

Ekspor apa adanya dari Seller Center, tidak perlu dirapikan. Aplikasi mengenali
nama kolom bahasa Indonesia maupun Inggris, dan mengabaikan baris judul di atas
tabel. Format angka `Rp1.234.567`, `12rb`, dan `1,2jt` semuanya terbaca.

Yang penting isinya ada **jam** dan **penonton** dan **penjualan**.

---

## Cara 1 — Lewat Google Colab

### Buka
Klik tautan ini:

**[▶ Buka Mesin Clipper di Colab](https://colab.research.google.com/github/aslihabnuri/Dom-Manipulation/blob/claude/tiktok-live-clipper-app-1c0qai/Clipper_TikTok_LIVE.ipynb)**

Login pakai akun Google yang sama dengan Google Drive Anda.

### Langkah 1 — Siapkan aplikasi
Klik tombol **▶** di sebelah kiri kotak pertama. Tunggu sekitar 2 menit.

Di tengah proses akan muncul permintaan izin membuka Google Drive. Pilih akun
Anda, lalu klik **Izinkan**. Ini supaya aplikasi bisa membaca rekaman live Anda
tanpa perlu diunduh.

Selesai kalau muncul tulisan **Siap**.

### Langkah 2 — Buka aplikasi
Klik tombol **▶** di kotak kedua. Tampilan aplikasi muncul di bawahnya.

Setelah itu ikuti bagian **"Yang Anda lihat di aplikasi"** di bawah.

> **Biar lebih cepat:** sebelum mulai, buka menu **Runtime → Change runtime type
> → T4 GPU → Save**. Tanpa ini tetap jalan, hanya lebih lama.

---

## Cara 2 — Aplikasi di komputer

### Sekali saja: pasang Python
Buka [python.org/downloads](https://www.python.org/downloads/), unduh, lalu
pasang seperti aplikasi biasa.

> **Pengguna Windows:** saat memasang, **centang "Add Python to PATH"** di layar
> pertama. Ini penting.

### Setiap kali mau pakai
Klik dua kali berkas ini di folder aplikasi:

- **Mac** → `Buka Aplikasi (Mac).command`
- **Windows** → `Buka Aplikasi (Windows).bat`

Pertama kali akan memasang sendiri (sekitar 2 menit). Berikutnya langsung
terbuka. Browser akan terbuka otomatis.

Akan muncul satu jendela hitam berisi tulisan. **Biarkan terbuka** selama Anda
memakai aplikasinya — itu mesinnya. Tutup jendela itu kalau sudah selesai.

> **Mac menolak membukanya?** Klik kanan berkasnya → **Open** → **Open** lagi.
> Ini hanya perlu sekali.

---

## Kalau ada berkas "rencana" di folder

Kadang keputusannya sudah disiapkan lebih dulu — misalnya Anda minta Claude
menganalisis data performa Anda, lalu ia menaruh berkas `rencana-klip.json`
di folder live.

Kalau berkas itu ada, aplikasi akan:

- **mengisi sendiri** jam mulai, jumlah klip, dan bentuk video
- menampilkan panel **"Rencana siap"** berisi blok mana saja yang dipilih dan alasannya
- mengganti tulisan tombol jadi **"Jalankan Rencana"**

Anda tidak perlu mengisi apa pun. Cukup klik tombolnya.

Berkas rencana hanya menentukan **blok jam mana** yang dipotong dan pengaturannya.
Titik potong persisnya, teks di video, dan caption tetap ditentukan aplikasi dari
suara di rekaman — karena hanya aplikasi yang bisa mendengar videonya.

Kalau Anda ingin memilih sendiri, hapus saja berkas rencananya.

## Yang Anda lihat di aplikasi

### Langkah 1 — Pilih folder live
Daftar folder muncul otomatis. Pilih tanggal live yang mau dipotong.

Di bawahnya akan tampil apa yang ditemukan:

- ✓ hijau = berkasnya ada
- ✗ merah = belum ada, folder itu belum bisa diproses

### Langkah 2 — Jam mulai rekaman
**Ini bagian yang paling perlu diperhatikan.**

Isi dengan jam yang tertera pada **detik pertama** video Anda. Bukan jam live
dimulai — jam saat **rekamannya** mulai.

Kalau ini meleset satu jam, aplikasi akan memotong bagian yang salah, karena
jam pada laporan tidak cocok dengan isi rekaman.

### Langkah 3 — Jumlah klip dan bentuk video
Geser untuk memilih berapa klip. Enam biasanya cukup untuk satu live.

Untuk bentuk video:
- **Seluruh layar terlihat** — aman, tidak ada yang terpotong. Pilih ini kalau ragu.
- **Potong bagian tengah** — penuh layar, tapi sisi kiri-kanan terbuang. Pilih
  kalau Anda selalu berdiri di tengah frame.

### Klik "Cari Momen Terbaik"
Tunggu. Aplikasi sedang membaca rekaman dan menghitung jam mana yang paling
bagus. Belum ada video yang dibuat di tahap ini, jadi relatif cepat.

---

## Membaca hasilnya

Tiap momen muncul sebagai satu kartu, dengan tanda:

| Tanda | Artinya | Yang harus dilakukan |
|---|---|---|
| **AMAN** | Tidak ada masalah terdeteksi | Boleh lanjut |
| **PERIKSA DULU** | Ada yang perlu Anda lihat | Baca catatannya, perbaiki bila perlu |
| **TIDAK BOLEH** | Berisiko kena pelanggaran | Tidak bisa dibuat, dan memang sebaiknya jangan |

### Tiga kotak yang bisa Anda ubah

**Kalimat besar di atas video** — kalimat pembuka yang muncul beberapa detik
pertama. Aplikasi mengusulkan satu dari ucapan Anda sendiri, tapi **hampir
selalu perlu Anda rapikan**. Ini yang membuat orang berhenti scroll.

**Baris kecil** — harga atau nama produk. Muncul di bawah kalimat besar.

**Caption untuk diunggah** — teks yang Anda salin ke TikTok saat mengunggah.
Disusun dari yang benar-benar diucapkan di klip itu: harga, bahan, ukuran,
warna, promo. Klik **Tulis ulang** untuk gaya lain. Kalau Anda mengubah kalimat
besar dulu, caption ikut disesuaikan.

Hilangkan centang **"Buat klip ini"** untuk klip yang tidak Anda inginkan.

### Klik "Buat Klip Terpilih"
Ini bagian paling lama. Biarkan jendela terbuka sampai selesai.

Hasilnya masuk ke folder **`klip`** di dalam folder live Anda:

```
Live/2026-08-18/
    klip/
        2026-08-18_002015.mp4      <- klip siap unggah
        2026-08-18_014230.mp4
        laporan.md                 <- catatan lengkap
        riwayat.json               <- jangan dihapus, lihat di bawah
```

Kalau pakai Colab, folder itu langsung ada di Google Drive Anda. Tidak perlu
diunduh dari Colab.

---

## Sebelum mengunggah ke TikTok

Lima hal, jangan dilewati:

1. **Tonton tiap klip sampai habis.** Pemeriksaan otomatis hanya membaca teks
   dan suara — ia tidak bisa melihat gambar.
2. **Dengarkan latarnya.** Kalau ada musik berhak cipta, ganti audio atau pilih
   momen lain.
3. **Pastikan produknya cocok** dengan yang ada di keranjang. Produk tidak sesuai
   adalah salah satu pelanggaran TikTok Shop yang paling sering kena sanksi.
4. **Ubah sedikit caption-nya** supaya terasa seperti tulisan Anda.
5. **Jangan pernah memutar klip ini ke dalam sesi LIVE.** Itu pelanggaran
   tersendiri, dan justru penyebab paling umum notifikasi "unoriginal content".

---

## Kenapa ada klip yang ditolak

### "Beririsan dengan klip yang sudah dibuat"
Anda pernah membuat klip dari bagian yang sama. Mengunggah momen yang sama dua
kali dihitung TikTok sebagai konten tidak orisinal.

Ini dijaga oleh berkas **`riwayat.json`** di folder `klip`. **Jangan dihapus** —
kalau hilang, aplikasi lupa apa yang sudah pernah dibuat.

### "Teks overlay terlalu pendek"
Kotak kalimat besar masih kosong atau terlalu singkat. Aturan TikTok: unggahan
ulang rekaman live harus membawa nilai baru, dan teks dihitung sebagai nilai
baru — asal isinya informasi, bukan sekadar "Part 2".

### "Klaim medis" / "Jaminan hasil" / "Mengarahkan ke WhatsApp"
Ada kalimat berisiko yang terucap di klip itu. Kalimatnya ditampilkan di kartu.
Pilih momen lain, atau potong bagian itu.

Penjelasan lengkap tiap aturan ada di [docs/kepatuhan-tiktok.md](docs/kepatuhan-tiktok.md).

---

## Kalau ada masalah

**"Tidak ada rekaman ditemukan"**
Video belum selesai diunggah ke Drive, atau ada di folder lain. Klik **Segarkan
daftar** setelah unggahan selesai.

**"Tidak ada baris performa yang jatuh di dalam durasi rekaman"**
Jam mulai rekaman salah. Buka videonya, lihat jam pada detik pertama, isi lagi.

**Klipnya terasa salah potong**
Coba naikkan jumlah klip supaya pilihannya lebih banyak. Kalau sering meleset,
tambahkan berkas subtitle `.srt` ke folder — aplikasi akan jauh lebih tepat
menentukan titik potong.

**Teks di video kosong terus**
Klip itu tidak ada suaranya, atau tidak ada transkrip. Isi sendiri kotak
kalimat besar, atau tambahkan berkas `.srt`.

**Aplikasinya lama sekali**
Membuat video memang lama, apalagi rekaman panjang. Yang cepat adalah tahap
"Cari Momen"; tahap "Buat Klip" yang berat. Kurangi jumlah klip kalau perlu.
