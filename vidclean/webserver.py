"""Server web lokal: antarmuka klik-dan-jadi untuk orang yang bukan programmer.

Hanya memakai pustaka bawaan Python, jadi tidak perlu memasang apa pun selain
ffmpeg. Server ini sengaja hanya mendengarkan di komputer sendiri (127.0.0.1).
"""

from __future__ import annotations

import html
import json
import mimetypes
import os
import shutil
import threading
import time
import traceback
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import parse_qs, urlparse

from . import caption as modul_caption
from . import config as konfigurasi
from . import fonts as modul_font
from . import produk as modul_produk
from .pipeline import Permintaan, proses
from .similarity import bandingkan

AKAR = konfigurasi.AKAR
FOLDER_UI = os.path.join(AKAR, "assets")
FOLDER_KELUAR = os.path.join(AKAR, "output")
FOLDER_UNGGAH = os.path.join(AKAR, "input", ".unggahan")
BATAS_UNGGAH = 600 * 1024 * 1024      # 600 MB

_pekerjaan: Dict[str, Dict[str, Any]] = {}
_kunci = threading.Lock()


# ---------------------------------------------------------------------------
# Pembaca unggahan (multipart/form-data) yang hemat memori
# ---------------------------------------------------------------------------
def _baca_multipart(rfile, boundary: bytes, panjang: int, folder: str):
    """Kembalikan (kolom_teks, berkas_terunggah). Isi berkas ditulis langsung ke disk."""
    delim = b"--" + boundary
    buf = bytearray()
    sisa = panjang

    def tarik(minimal: int) -> None:
        nonlocal sisa
        while len(buf) < minimal and sisa > 0:
            potong = rfile.read(min(262144, sisa))
            if not potong:
                sisa = 0
                break
            sisa -= len(potong)
            buf.extend(potong)

    def cari(pola: bytes) -> int:
        while True:
            posisi = buf.find(pola)
            if posisi >= 0:
                return posisi
            if sisa <= 0:
                return -1
            tarik(len(buf) + 262144)

    kolom: Dict[str, str] = {}
    berkas: List[Tuple[str, str, str]] = []

    # Lewati bagian pembuka sampai pembatas pertama.
    posisi = cari(delim)
    if posisi < 0:
        return kolom, berkas
    del buf[: posisi + len(delim)]

    while True:
        tarik(2)
        if buf[:2] == b"--":          # penanda akhir
            break
        if buf[:2] == b"\r\n":
            del buf[:2]

        batas_kepala = cari(b"\r\n\r\n")
        if batas_kepala < 0:
            break
        kepala_mentah = bytes(buf[:batas_kepala]).decode("utf-8", "replace")
        del buf[: batas_kepala + 4]

        nama = nama_berkas = ""
        for baris in kepala_mentah.split("\r\n"):
            if baris.lower().startswith("content-disposition"):
                for bagian in baris.split(";"):
                    bagian = bagian.strip()
                    if bagian.startswith("name="):
                        nama = bagian[5:].strip('"')
                    elif bagian.startswith("filename="):
                        nama_berkas = bagian[9:].strip('"')

        penutup = b"\r\n" + delim
        tulis = None
        tujuan = ""
        if nama_berkas:
            aman = "".join(c for c in os.path.basename(nama_berkas) if c.isalnum() or c in "._- ")
            aman = aman.strip() or "video.mp4"
            tujuan = os.path.join(folder, f"{uuid.uuid4().hex[:8]}_{aman}")
            tulis = open(tujuan, "wb")

        potongan_teks = bytearray()
        try:
            while True:
                akhir = buf.find(penutup)
                if akhir >= 0:
                    isi = bytes(buf[:akhir])
                    del buf[: akhir + len(penutup)]
                    if tulis:
                        tulis.write(isi)
                    else:
                        potongan_teks.extend(isi)
                    break
                # Simpan sebagian buffer, sisakan ekor sepanjang pembatas.
                aman_sampai = max(0, len(buf) - len(penutup) - 2)
                if aman_sampai > 0:
                    isi = bytes(buf[:aman_sampai])
                    del buf[:aman_sampai]
                    if tulis:
                        tulis.write(isi)
                    else:
                        potongan_teks.extend(isi)
                if sisa <= 0 and len(buf) < len(penutup):
                    if tulis:
                        tulis.write(bytes(buf))
                    else:
                        potongan_teks.extend(buf)
                    buf.clear()
                    break
                tarik(len(buf) + 262144)
        finally:
            if tulis:
                tulis.close()

        if nama_berkas:
            if tujuan and os.path.getsize(tujuan) > 0:
                berkas.append((nama, nama_berkas, tujuan))
            elif tujuan:
                os.remove(tujuan)
        elif nama:
            kolom[nama] = bytes(potongan_teks).decode("utf-8", "replace")

    return kolom, berkas


# ---------------------------------------------------------------------------
# Pekerjaan (job) latar belakang
# ---------------------------------------------------------------------------
def _perbarui(id_kerja: str, **nilai) -> None:
    with _kunci:
        if id_kerja in _pekerjaan:
            _pekerjaan[id_kerja].update(nilai)


def _susun_produk(foto: Optional[str], opsi: Dict[str, str]) -> List:
    """Bangun daftar Aset produk dari isian formulir."""
    if not foto:
        return []

    def angka(kunci: str, bawaan: float) -> float:
        try:
            return float(opsi.get(kunci) or bawaan)
        except (TypeError, ValueError):
            return bawaan

    hasil: List = []
    mode = opsi.get("produk_mode") or "sisip"
    if mode in ("sisip", "tempel"):
        aset = modul_produk.Aset(
            berkas=foto,
            mulai=max(0.0, angka("produk_mulai", 3.0)),
            lama=max(0.5, angka("produk_lama", 2.5)),
            mode=mode,
            label=(opsi.get("produk_label") or "").strip(),
        )
        if mode == "tempel":
            aset.posisi = opsi.get("produk_posisi") or "kanan-bawah"
            aset.lebar = angka("produk_lebar", 0.34)
        hasil.append(aset)

    if opsi.get("produk_endcard") == "on":
        hasil.append(modul_produk.Aset(
            berkas=foto,
            lama=max(1.0, angka("produk_endcard_lama", 3.0)),
            mode="endcard",
            label=(opsi.get("produk_endcard_label") or "").strip(),
        ))
    for aset in hasil:
        aset.periksa()
    return hasil


def _kerjakan(id_kerja: str, sumber: str, nama_asli: str, opsi: Dict[str, str],
              foto_produk: Optional[str] = None) -> None:
    try:
        pengaturan = konfigurasi.muat()
        gaya, video, anti = pengaturan["gaya"], pengaturan["video"], pengaturan["anti_duplikat"]

        if opsi.get("font"):
            gaya["font"] = opsi["font"]
        if opsi.get("warna"):
            gaya["warna_teks"] = opsi["warna"]
        if opsi.get("ukuran_judul"):
            gaya["ukuran_judul"] = int(float(opsi["ukuran_judul"]))
        gaya["kotak_latar"] = opsi.get("kotak") == "on"
        if opsi.get("rasio"):
            video["rasio"] = opsi["rasio"]
        if opsi.get("bingkai"):
            video["bingkai"] = float(opsi["bingkai"])
        if opsi.get("cermin") == "on":
            anti["cermin"] = True
        elif opsi.get("cermin") == "off":
            anti["cermin"] = False

        preset = opsi.get("preset") or "seimbang"
        varian_total = max(1, min(5, int(opsi.get("varian") or 1)))

        try:
            daftar_produk = _susun_produk(foto_produk, opsi)
        except Exception as e:  # noqa: BLE001
            daftar_produk = []
            _perbarui(id_kerja, pesan=f"Sisipan produk dilewati: {e}")

        subtitle: List = []
        if opsi.get("auto_teks") == "on":
            if not modul_caption.tersedia():
                _perbarui(id_kerja, pesan="Subtitle otomatis dilewati (paket faster-whisper belum ada)")
            else:
                _perbarui(id_kerja, tahap="Membuat subtitle otomatis dari suara video...", persen=3)
                try:
                    subtitle = modul_caption.transkrip(sumber, bahasa=opsi.get("bahasa") or "id")
                    _perbarui(id_kerja, pesan=f"{len(subtitle)} baris subtitle dibuat")
                except Exception as e:  # noqa: BLE001
                    _perbarui(id_kerja, pesan=f"Subtitle otomatis gagal: {e}")

        dasar = os.path.splitext(os.path.basename(nama_asli))[0][:60] or "video"
        hasil_semua: List[Dict[str, Any]] = []

        for varian in range(varian_total):
            akhiran = f"_v{varian + 1}" if varian_total > 1 else ""
            nama_keluar = f"{dasar}_edit{akhiran}_{id_kerja[:6]}.mp4"
            tujuan = os.path.join(FOLDER_KELUAR, nama_keluar)

            _perbarui(
                id_kerja,
                tahap=f"Mengedit video ({varian + 1} dari {varian_total})...",
                persen=int(varian / varian_total * 100),
            )

            def kabar(persen: int, v=varian) -> None:
                menyeluruh = int((v + persen / 100) / varian_total * 100)
                _perbarui(id_kerja, persen=min(99, menyeluruh))

            hasil = proses(
                Permintaan(
                    masukan=sumber, keluaran=tujuan,
                    judul=opsi.get("judul", ""), caption=opsi.get("caption", ""),
                    handle=opsi.get("handle", ""), subtitle=subtitle,
                    produk=daftar_produk,
                    preset=preset, varian=varian, pengaturan=pengaturan,
                ),
                kabar=kabar,
            )

            skor = None
            try:
                _perbarui(id_kerja, tahap="Menghitung skor anti duplikat...")
                skor = bandingkan(hasil.asal, hasil.hasil, hasil.rencana)
            except Exception:  # noqa: BLE001
                pass

            hasil_semua.append({
                "nama": nama_keluar,
                "url": f"/hasil/{nama_keluar}",
                "ukuran_mb": round(hasil.hasil.ukuran_byte / 1_048_576, 2),
                "asal": hasil.asal.ringkas(),
                "hasil": hasil.hasil.ringkas(),
                "font": hasil.font_dipakai,
                "detik": hasil.lama_proses,
                "skor": skor.skor if skor else None,
                "penilaian": skor.penilaian if skor else "",
                "perubahan": hasil.rencana.ringkasan(),
            })
            _perbarui(id_kerja, hasil=list(hasil_semua))

        _perbarui(id_kerja, status="selesai", persen=100, tahap="Selesai", hasil=hasil_semua)

    except Exception as e:  # noqa: BLE001
        _perbarui(
            id_kerja, status="gagal", tahap="Gagal",
            galat=f"{type(e).__name__}: {e}",
            rincian=traceback.format_exc() if os.environ.get("VIDCLEAN_DEBUG") else "",
        )
    finally:
        for berkas in (sumber, foto_produk):
            if not berkas:
                continue
            try:
                os.remove(berkas)
            except OSError:
                pass


# ---------------------------------------------------------------------------
# HTTP handler
# ---------------------------------------------------------------------------
class Penangan(BaseHTTPRequestHandler):
    server_version = "vidclean"

    def log_message(self, format: str, *args) -> None:  # noqa: A002
        pass

    # -- util --------------------------------------------------------------
    def _kirim(self, kode: int, isi: bytes, tipe: str = "text/html; charset=utf-8",
               tambahan: Optional[Dict[str, str]] = None) -> None:
        self.send_response(kode)
        self.send_header("Content-Type", tipe)
        self.send_header("Content-Length", str(len(isi)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (tambahan or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(isi)

    def _json(self, kode: int, data: Any) -> None:
        self._kirim(kode, json.dumps(data, ensure_ascii=False).encode("utf-8"),
                    "application/json; charset=utf-8")

    def _berkas(self, path: str, unduh: bool = False) -> None:
        if not os.path.isfile(path):
            self._kirim(404, b"Berkas tidak ditemukan", "text/plain; charset=utf-8")
            return
        tipe = mimetypes.guess_type(path)[0] or "application/octet-stream"
        ukuran = os.path.getsize(path)
        self.send_response(200)
        self.send_header("Content-Type", tipe)
        self.send_header("Content-Length", str(ukuran))
        self.send_header("Accept-Ranges", "none")
        if unduh:
            self.send_header("Content-Disposition",
                             f'attachment; filename="{os.path.basename(path)}"')
        self.end_headers()
        with open(path, "rb") as f:
            shutil.copyfileobj(f, self.wfile, 262144)

    # -- GET ---------------------------------------------------------------
    def do_GET(self) -> None:  # noqa: N802
        potong = urlparse(self.path)
        jalur = potong.path

        if jalur in ("/", "/index.html"):
            berkas_ui = os.path.join(FOLDER_UI, "ui.html")
            if not os.path.exists(berkas_ui):
                self._kirim(500, b"assets/ui.html tidak ditemukan", "text/plain; charset=utf-8")
                return
            with open(berkas_ui, "rb") as f:
                self._kirim(200, f.read())
            return

        if jalur == "/api/pilihan":
            self._json(200, {
                "font": modul_font.keluarga_tersedia(),
                "preset": [{"nama": n, "label": konfigurasi.PRESET[n]["label"]}
                           for n in konfigurasi.NAMA_PRESET],
                "posisi_produk": sorted(modul_produk.POSISI),
                "auto_teks": modul_caption.tersedia(),
                "bawaan": konfigurasi.muat(),
            })
            return

        if jalur == "/api/status":
            id_kerja = (parse_qs(potong.query).get("id") or [""])[0]
            with _kunci:
                data = _pekerjaan.get(id_kerja)
            if not data:
                self._json(404, {"galat": "Pekerjaan tidak ditemukan"})
                return
            self._json(200, data)
            return

        if jalur.startswith("/hasil/") or jalur.startswith("/unduh/"):
            nama = os.path.basename(jalur[7:])
            self._berkas(os.path.join(FOLDER_KELUAR, nama), unduh=jalur.startswith("/unduh/"))
            return

        self._kirim(404, b"Halaman tidak ada", "text/plain; charset=utf-8")

    # -- POST --------------------------------------------------------------
    def do_POST(self) -> None:  # noqa: N802
        if urlparse(self.path).path != "/api/proses":
            self._kirim(404, b"Tidak ada", "text/plain; charset=utf-8")
            return

        tipe = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in tipe or "boundary=" not in tipe:
            self._json(400, {"galat": "Format unggahan tidak dikenali"})
            return

        panjang = int(self.headers.get("Content-Length") or 0)
        if panjang <= 0:
            self._json(400, {"galat": "Tidak ada data yang dikirim"})
            return
        if panjang > BATAS_UNGGAH:
            self._json(413, {"galat": f"Video terlalu besar (maksimal {BATAS_UNGGAH // 1048576} MB)"})
            return

        boundary = tipe.split("boundary=", 1)[1].strip().strip('"').encode()
        os.makedirs(FOLDER_UNGGAH, exist_ok=True)
        os.makedirs(FOLDER_KELUAR, exist_ok=True)

        try:
            kolom, berkas = _baca_multipart(self.rfile, boundary, panjang, FOLDER_UNGGAH)
        except Exception as e:  # noqa: BLE001
            self._json(400, {"galat": f"Gagal membaca unggahan: {e}"})
            return

        video_terunggah = [b for b in berkas if b[0] == "video"]
        foto_terunggah = [b for b in berkas if b[0] == "produk"]
        if not video_terunggah:
            video_terunggah = [b for b in berkas if b[0] != "produk"]
        if not video_terunggah:
            self._json(400, {"galat": "Videonya belum dipilih"})
            return

        _, nama_asli, sumber = video_terunggah[0]
        foto_produk = foto_terunggah[0][2] if foto_terunggah else None
        id_kerja = uuid.uuid4().hex
        with _kunci:
            _pekerjaan[id_kerja] = {
                "id": id_kerja, "status": "jalan", "persen": 0,
                "tahap": "Menyiapkan...", "pesan": "", "galat": "",
                "nama_asli": html.escape(nama_asli), "hasil": [],
                "mulai": time.time(),
            }
        threading.Thread(
            target=_kerjakan,
            args=(id_kerja, sumber, nama_asli, kolom, foto_produk),
            daemon=True,
        ).start()
        self._json(200, {"id": id_kerja})


# ---------------------------------------------------------------------------
def jalankan_server(host: str = "127.0.0.1", port: int = 7860) -> None:
    os.makedirs(FOLDER_KELUAR, exist_ok=True)
    os.makedirs(FOLDER_UNGGAH, exist_ok=True)
    server = ThreadingHTTPServer((host, port), Penangan)
    server.daemon_threads = True
    alamat = f"http://{host}:{port}"
    print("=" * 58)
    print("  EDITOR VIDEO ANTI DUPLIKAT sudah siap")
    print("=" * 58)
    print(f"  Buka di browser:  {alamat}")
    print("  Untuk berhenti :  tekan Ctrl + C")
    print("=" * 58)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer dihentikan.")
    finally:
        server.server_close()
