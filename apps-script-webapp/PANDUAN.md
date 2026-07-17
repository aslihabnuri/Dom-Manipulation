# Ads Command Center — Versi Google Apps Script Web App

Dashboard yang sama persis dengan artifact claude.ai Anda, tetapi:

- **Real-time** — setiap kali halaman dibuka, dashboard otomatis menarik file raw data terbaru dari folder "SM Ads Raw Data" di Google Drive. File yang berubah di Drive ikut diproses ulang otomatis.
- **Hanya untuk orang pilihan Anda** — akses dibatasi ke daftar email Google yang Anda tentukan sendiri di `ALLOWED_EMAILS` (file `Code.gs`). Orang di luar daftar melihat halaman "Akses ditolak" meskipun memegang link.
- **Artifact asli tidak berubah** — ini salinan terpisah; artifact di claude.ai tetap seperti semula.

Isi folder ini:

| File | Peran |
|---|---|
| `Code.gs` | Server: cek izin akses, menyajikan halaman, jembatan baca Google Drive |
| `Index.html` | Seluruh dashboard (UI, data dasar, logika parsing) |
| `appsscript.json` | Manifest proyek (zona waktu, izin, mode web app) |

---

## Cara kerja pembatasan akses

Web app di-deploy dengan **Execute as: "User accessing the web app"**. Artinya skrip berjalan atas nama *pengunjung*, sehingga Google memberi tahu skrip email siapa yang membuka — dan skrip menolak semua email yang tidak ada di `ALLOWED_EMAILS`. Ini kontrol berbasis identitas asli (login Google), bukan sekadar link rahasia.

Konsekuensinya ada dua, dan keduanya wajib:

1. **Folder "SM Ads Raw Data" harus di-share (cukup Viewer) ke email yang sama** — karena pembacaan Drive kini berjalan atas nama pengunjung.
2. **Setiap anggota mengklik "Allow" sekali** saat pertama kali membuka (layar otorisasi Google; muncul peringatan "unverified app" — normal untuk skrip pribadi).

---

## Setup awal (±10 menit, sekali saja)

### 1. Buat proyek Apps Script

1. Buka **https://script.google.com** dengan akun Google **pemilik folder "SM Ads Raw Data"**.
2. Klik **+ New project**, beri nama mis. `Ads Command Center`.

### 2. Isi tiga file

1. **Code.gs** — hapus isi bawaan, tempel seluruh isi `Code.gs` dari folder ini, lalu **isi `ALLOWED_EMAILS`** dengan email Anda + email anggota tim yang dipilih.
2. **Index.html** — ikon **+** di "Files" → **HTML** → beri nama persis `Index`. Tempel seluruh isi `Index.html`. *(±640 KB — tunggu beberapa detik. Jangan copy lewat TextEdit/Quick Look; ambil dari GitHub tombol **Raw**.)*
3. **appsscript.json** — Project Settings (gerigi) → centang **"Show 'appsscript.json' manifest file in editor"** → ganti isinya dengan `appsscript.json` dari folder ini.
4. **Cmd/Ctrl+S** untuk menyimpan.

### 3. Share folder Drive ke tim

Di Google Drive: klik kanan folder **SM Ads Raw Data** (folder induknya sekaligus semua sub-folder) → **Share** → masukkan email yang sama dengan `ALLOWED_EMAILS` → peran **Viewer** → Send.

### 4. Deploy sebagai Web App

1. **Deploy → New deployment** → gerigi "Select type" → **Web app**.
2. Atur:
   - **Execute as**: **User accessing the web app** ← kunci mode akses ini.
   - **Who has access**: **Anyone with Google account**. *(Jangan khawatir — yang lolos tetap hanya email di `ALLOWED_EMAILS`; pengaturan ini hanya berarti "harus login Google dulu".)*
3. Klik **Deploy** → **Authorize access** → pilih akun Anda → layar "Google hasn't verified this app" → **Advanced → Go to … (unsafe) → Allow**.
4. Salin **Web app URL** (`…/exec`) — link inilah yang dibagikan ke tim.

---

## Flow harian

**Anggota tim (pertama kali):** buka link → login Google → Allow (sekali saja) → dashboard tampil, sinkron otomatis berjalan.

**Anggota tim (selanjutnya):** buka link → langsung tampil dengan data terkini.

**Menambah anggota:** tambahkan emailnya di `ALLOWED_EMAILS` → Cmd+S → **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** → share folder "SM Ads Raw Data" ke email itu (Viewer) → kirim link.

**Mencabut akses:** hapus emailnya dari `ALLOWED_EMAILS` → simpan → Manage deployments → New version → Deploy → hentikan share foldernya. Sejak itu ia hanya melihat "Akses ditolak".

**Update kode dashboard:** tempel versi baru → simpan → Manage deployments → New version. **Link tidak berubah** (jangan pakai "New deployment", itu membuat URL baru).

---

## Troubleshooting

- **Anggota melihat "Akses ditolak" padahal sudah didaftarkan** → cek ejaan email di `ALLOWED_EMAILS` (harus persis, huruf kecil); pastikan ia login dengan akun itu (coba jendela incognito); pastikan setelah mengubah daftar Anda melakukan **New version** di Manage deployments.
- **"Akses ditolak" menampilkan "(email tidak terbaca)"** → deployment masih "Execute as: Me". Ubah ke "User accessing the web app" lewat Manage deployments → ✏️.
- **Sinkron error "Folder … : Access denied / not found"** → folder "SM Ads Raw Data" belum di-share ke anggota tersebut. Share ulang sebagai Viewer.
- **Anggota takut dengan layar "Google hasn't verified this app"** → normal untuk skrip pribadi (bukan aplikasi terpublikasi). Klik Advanced → Go to … → Allow; izinnya hanya *baca* Drive/Sheets, dan kodenya bisa diaudit di editor.
- **Data tidak ter-update padahal file baru ada** → tab **Unggah Data → Sinkron Google Drive → "Sinkron dari Drive"**; tombol **"Lupakan riwayat file"** memproses ulang semua dari nol (aman, data identik tertimpa).
- **Halaman kosong setelah menempel Index.html** → pastikan tertempel utuh: baris pertama `<!doctype html>`, baris terakhir `</html>`, nama file persis `Index`.
