# Ads Command Center — Versi Google Apps Script Web App

Dashboard yang sama persis dengan artifact claude.ai Anda, tetapi:

- **Real-time** — setiap kali halaman dibuka, dashboard otomatis menarik file raw data terbaru dari folder "SM Ads Raw Data" di Google Drive. File yang berubah di Drive ikut diproses ulang otomatis.
- **Hanya untuk orang pilihan Anda** — tiap anggota mendapat link berisi kunci pribadinya (`?key=…`, daftar `TOKENS` di `Code.gs`). Tanpa kunci terdaftar: "Akses ditolak". Kunci bisa dicabut per orang kapan saja. Tim tidak pernah melihat layar izin/"unverified" Google.
- **Artifact asli tidak berubah** — ini salinan terpisah; artifact di claude.ai tetap seperti semula.

Isi folder ini:

| File | Peran |
|---|---|
| `Code.gs` | Server: cek kunci akses, menyajikan halaman, jembatan baca Google Drive |
| `Index.html` | Seluruh dashboard (UI, data dasar, logika parsing) |
| `appsscript.json` | Manifest proyek (zona waktu, izin, mode web app) |

---

## Cara kerja pembatasan akses

Web app di-deploy **Execute as: Me** — skrip selalu berjalan atas nama pemilik, sehingga:

- Tim **tidak pernah melihat layar izin Google / peringatan "unverified"** (hanya pemilik yang otorisasi sekali saat deploy).
- Folder "SM Ads Raw Data" **tidak perlu di-share** ke siapa pun.

Pembatasan orang dilakukan lewat **kunci pribadi per anggota** di `TOKENS` (file `Code.gs`). Setiap anggota diberi link dengan kuncinya sendiri:

```
https://script.google.com/macros/s/…/exec?key=budi-x7k2q9
```

Tanpa kunci yang terdaftar, halaman menampilkan "Akses ditolak". Kunci per orang membuat pencabutan akses individual: hapus baris kuncinya, terbitkan versi baru, selesai.

> Catatan jujur: kunci di link bisa saja diteruskan orangnya ke pihak lain (sebagaimana password). Pembatasan berbasis identitas email tanpa layar "unverified" hanya mungkin lewat Google Workspace atau proses verifikasi aplikasi resmi Google — tidak praktis untuk skrip pribadi. Untuk tim kecil terpercaya, kunci per orang adalah standar yang wajar.

---

## Setup awal (±10 menit, sekali saja)

### 1. Buat proyek Apps Script

1. Buka **https://script.google.com** dengan akun Google **pemilik folder "SM Ads Raw Data"**.
2. Klik **+ New project**, beri nama mis. `Ads Command Center`.

### 2. Isi tiga file

1. **Code.gs** — hapus isi bawaan, tempel seluruh isi `Code.gs` dari folder ini, lalu **isi `TOKENS`**: satu kunci unik per anggota (campur nama + angka acak).
2. **Index.html** — ikon **+** di "Files" → **HTML** → beri nama persis `Index`. Tempel seluruh isi `Index.html` (±640 KB, 4017 baris). **Copy hanya dari tampilan GitHub "Raw"** — tampilan file GitHub biasa memotong file sebesar ini, dan TextEdit/Quick Look merusak teks. Setelah menempel, cek: baris pertama `<!doctype html>`, baris terakhir (baris 4017) `</html>`.
3. **appsscript.json** — Project Settings (gerigi) → centang **"Show 'appsscript.json' manifest file in editor"** → ganti isinya dengan `appsscript.json` dari folder ini.
4. **Cmd/Ctrl+S** untuk menyimpan.

### 3. Deploy sebagai Web App

1. **Deploy → New deployment** → gerigi "Select type" → **Web app**.
2. Atur:
   - **Execute as**: **Me** ← kunci mode ini.
   - **Who has access**: **Anyone with Google account** (wajib login Google; lapisan tambahan di atas kunci).
3. Klik **Deploy** → **Authorize access** → layar "Google hasn't verified this app" → **Advanced → Go to … (unsafe) → Allow**. *(Hanya Anda yang melihat layar ini, sekali saja; tim tidak akan pernah melihatnya.)*
4. Salin **Web app URL** (`…/exec`).

---

## Flow harian

**Membagikan akses:** kirim ke tiap anggota link pribadinya: `…/exec?key=KUNCI-DIA`. Minta mereka mem-bookmark. Mereka tinggal buka → (login Google bila belum) → dashboard tampil, tanpa layar izin apa pun.

**Menambah anggota:** tambah baris kunci baru di `TOKENS` → Cmd+S → **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** → kirim link+kunci ke orangnya. Link dasar tidak pernah berubah.

**Mencabut akses:** hapus baris kuncinya di `TOKENS` → simpan → Manage deployments → **New version** → Deploy. Sejak itu link lamanya menampilkan "Akses ditolak".

**Update kode dashboard:** tempel versi baru → simpan → Manage deployments → New version. (Jangan "New deployment" — itu membuat URL baru.)

---

## Troubleshooting

- **Anggota melihat "Akses ditolak" padahal kuncinya benar** → pastikan link memuat `?key=…` persis seperti di `TOKENS` (huruf besar/kecil berpengaruh), dan setelah mengubah `TOKENS` Anda sudah melakukan **New version** di Manage deployments.
- **Anggota melihat layar izin/"unverified"** → deployment bukan "Execute as: Me". Perbaiki lewat Manage deployments → ✏️.
- **Dashboard tampil tapi kosong (hanya header)** → `Index.html` di editor tidak utuh. Hapus isinya, copy ulang dari GitHub tombol **Raw**, tempel, cek baris terakhir (4017) adalah `</html>`, simpan, lalu New version.
- **Data tidak ter-update padahal file baru ada** → tab **Unggah Data → Sinkron Google Drive → "Sinkron dari Drive"**; tombol **"Lupakan riwayat file"** memproses ulang semua dari nol (aman, data identik tertimpa).
- **Halaman kosong setelah menempel Index.html** → pastikan tertempel utuh: baris pertama `<!doctype html>`, baris terakhir `</html>`, nama file persis `Index`.
