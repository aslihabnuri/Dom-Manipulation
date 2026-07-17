# Ads Command Center — Versi Google Apps Script Web App

Dashboard yang sama persis dengan artifact claude.ai Anda, tetapi:

- **Real-time** — setiap kali halaman dibuka, dashboard otomatis menarik file raw data terbaru dari folder "SM Ads Raw Data" di Google Drive Anda. File yang berubah di Drive ikut diproses ulang otomatis.
- **Bisa diakses tim** — di-hosting gratis di akun Google Anda; Anda yang mengatur siapa boleh membuka. Tim **tidak perlu** akun claude.ai dan **tidak perlu** akses ke folder Drive-nya (Web App berjalan atas nama akun Anda).
- **Artifact asli tidak berubah** — ini salinan terpisah; artifact di claude.ai tetap seperti semula.

Isi folder ini:

| File | Peran |
|---|---|
| `Code.gs` | Server: menyajikan halaman + jembatan baca Google Drive |
| `Index.html` | Seluruh dashboard (UI, data dasar, logika parsing) |
| `appsscript.json` | Manifest proyek (zona waktu, izin, mode web app) |

---

## Setup (±10 menit, sekali saja)

### 1. Buat proyek Apps Script

1. Buka **https://script.google.com** dengan akun Google **yang memiliki folder "SM Ads Raw Data"** (penting — server membaca Drive akun ini).
2. Klik **+ New project**. Beri nama, misalnya `Ads Command Center`.

### 2. Isi tiga file

1. **Code.gs** — hapus isi bawaan `myFunction`, tempel seluruh isi file `Code.gs` dari folder ini.
2. **Index.html** — klik ikon **+** di samping "Files" → **HTML** → beri nama persis `Index` (tanpa `.html`, editor menambahkannya sendiri). Hapus isi bawaan, lalu tempel seluruh isi file `Index.html` dari folder ini. *(File-nya besar, ±640 KB — tunggu beberapa detik setelah menempel.)*
3. **appsscript.json** — buka **Project Settings** (ikon gerigi) → centang **"Show 'appsscript.json' manifest file in editor"** → kembali ke Editor, buka `appsscript.json`, ganti isinya dengan isi file `appsscript.json` dari folder ini.
4. Tekan **Ctrl/Cmd+S** untuk menyimpan semua.

### 3. Deploy sebagai Web App

1. Klik **Deploy → New deployment**.
2. Klik ikon gerigi di samping "Select type" → pilih **Web app**.
3. Atur:
   - **Description**: bebas, mis. `v1`.
   - **Execute as**: **Me** ← wajib, supaya tim tidak perlu akses Drive Anda.
   - **Who has access**: pilih salah satu (lihat bagian *Mengatur akses tim* di bawah).
4. Klik **Deploy**. Saat diminta, klik **Authorize access** → pilih akun Anda → jika muncul layar "Google hasn't verified this app", klik **Advanced → Go to Ads Command Center (unsafe)** → **Allow**. (Ini normal untuk skrip pribadi; izinnya hanya *baca* Drive/Sheets akun Anda sendiri, dan kodenya bisa Anda audit sendiri di editor.)
5. Salin **Web app URL** (`https://script.google.com/macros/s/…/exec`) — inilah link dashboard yang dibagikan ke tim.

### 4. Selesai — uji

Buka URL tersebut. Dashboard tampil dengan data dasar, lalu di pojok kanan atas terlihat status `⟳ Memindai…` saat sinkron otomatis berjalan. Jika ada file baru/berubah di Drive, muncul notifikasi "N file baru dari Drive diterapkan" dan angka-angka ter-update.

---

## Mengatur akses tim

Pilihan **Who has access** saat deploy:

| Pilihan | Artinya | Cocok untuk |
|---|---|---|
| **Anyone with Google account** | Harus login Google dulu, siapa pun yang punya link bisa buka | **Direkomendasikan** — link-nya panjang dan tidak bisa ditebak |
| **Anyone** | Terbuka tanpa login | Hanya jika tim ada yang tidak punya akun Google |
| **Anyone within [domain]** | Khusus akun Google Workspace organisasi Anda | Jika seluruh tim memakai email kantor satu domain |

**Lapisan ekstra (opsional):** di `Code.gs` ada konstanta `SECRET_KEY`. Jika diisi (mis. `'sm-ads-2026'`), dashboard hanya terbuka lewat link `…/exec?key=sm-ads-2026`. Berguna sebagai "password" sederhana bila Anda memilih akses "Anyone".

> Catatan: pembatasan per-alamat-email hanya andal di akun Google Workspace (lewat pilihan domain di atas). Di akun Gmail biasa, gunakan kombinasi "Anyone with Google account" + `SECRET_KEY`.

---

## Alur data harian (tidak berubah dari kebiasaan sekarang)

1. Anda/tim mengunggah file ekspor platform (CSV/XLSX) ke sub-folder "SM Ads Raw Data" di Drive seperti biasa.
2. Siapa pun yang membuka dashboard setelah itu langsung melihat data terbarunya — tanpa perlu menerbitkan ulang apa pun.
3. File yang **diganti/di-update** di Drive (ID sama, isi baru) juga otomatis diproses ulang — data yang sama tertimpa, tidak dobel.
4. Google Sheet asli di dalam folder raw data kini juga terbaca (otomatis diekspor sebagai CSV dari sheet pertamanya).

Fitur lain (unggah manual, input manual, generate ke Google Sheet, ekspor HTML tim, chatbot analisis, ID/EN, tema gelap) berfungsi sama seperti di artifact.

---

## Memperbarui dashboard di kemudian hari

Jika nanti ada perubahan kode (mis. tambah channel atau bulan baru di data dasar):

1. Tempel `Index.html` / `Code.gs` versi baru di editor Apps Script, simpan.
2. **Deploy → Manage deployments → ✏️ (edit) → Version: New version → Deploy.**
   Link web app **tetap sama** — tim tidak perlu link baru. (Jangan pakai "New deployment", karena itu membuat URL baru.)

---

## Troubleshooting

- **"Akses ditolak" saat tim membuka link** → cek "Who has access" di Manage deployments; pastikan tim memakai link `/exec` (bukan `/dev`), dan bila `SECRET_KEY` diisi, link harus menyertakan `?key=…`.
- **Sinkron menampilkan error nama folder** → pastikan akun yang men-deploy adalah pemilik/punya akses folder "SM Ads Raw Data", dan otorisasi Drive sudah disetujui (Deploy ulang → Authorize).
- **Data tidak ter-update padahal file baru sudah ada** → buka tab **Unggah Data → Sinkron Google Drive → "Sinkron dari Drive"** untuk memaksa; tombol **"Lupakan riwayat file"** membuat semua file diproses ulang dari nol (aman — data identik tertimpa, tidak dobel).
- **Safari/iPhone: sinkron mengulang dari awal setiap buka** → Safari kadang memblokir penyimpanan lokal di iframe; dashboard tetap benar, hanya sinkron pertamanya lebih lama. Di Chrome/Edge/Firefox normal.
- **Halaman kosong setelah menempel Index.html** → pastikan seluruh isi file tertempel utuh (baris pertama `<!doctype html>`, baris terakhir `</html>`) dan nama file HTML persis `Index`.
