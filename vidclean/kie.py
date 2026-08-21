"""Pembuat aset produk lewat API kie.ai (opsional).

Dipakai untuk MEMBUAT foto atau klip produk yang nanti disisipkan ke video
(lihat modul produk). API ini tidak bisa mengganti wajah di dalam video yang
sudah ada - layanannya hanya membuat gambar dan video baru.

Alur kerjanya:
  1. foto lokal diunggah  -> dapat URL sementara
  2. tugas dibuat         -> dapat taskId
  3. tugas ditunggu       -> dapat URL hasil
  4. hasil diunduh        -> berkas lokal siap dipakai

Kunci API dibaca dari environment variable KIE_API_KEY, atau dari berkas
.env di folder aplikasi. Kunci tidak pernah ditulis ke log maupun ke repo.
"""

from __future__ import annotations

import base64
import json
import mimetypes
import os
import ssl
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

from . import config as konfigurasi

DASAR = "https://api.kie.ai"
JALUR_UNGGAH = "/api/file-base64-upload"
JALUR_BUAT = "/api/v1/jobs/createTask"
JALUR_CEK = "/api/v1/jobs/recordInfo"

# Slug model yang sudah diverifikasi dari dokumentasi resmi.
# Daftar lengkap dan terbaru ada di https://kie.ai/market
MODEL_GAMBAR = "qwen/image-to-image"

BATAS_UNGGAH = 10 * 1024 * 1024


class KieGagal(RuntimeError):
    pass


class KunciTidakAda(KieGagal):
    def __init__(self) -> None:
        super().__init__(
            "Kunci API kie.ai belum diisi.\n"
            "Pilih salah satu cara:\n"
            "  1. Isi environment variable KIE_API_KEY di pengaturan environment "
            "Claude Code (paling aman, tidak masuk ke riwayat percakapan)\n"
            "  2. Buat berkas .env di folder aplikasi berisi satu baris:\n"
            "       KIE_API_KEY=kunci_anda_di_sini\n"
            "Berkas .env sudah masuk daftar abaikan git, jadi tidak akan ikut terunggah."
        )


def _baca_dotenv(path: Optional[str] = None) -> Dict[str, str]:
    path = path or os.path.join(konfigurasi.AKAR, ".env")
    hasil: Dict[str, str] = {}
    if not os.path.exists(path):
        return hasil
    try:
        with open(path, "r", encoding="utf-8") as f:
            for baris in f:
                baris = baris.strip()
                if not baris or baris.startswith("#") or "=" not in baris:
                    continue
                kunci, _, nilai = baris.partition("=")
                hasil[kunci.strip()] = nilai.strip().strip("'\"")
    except OSError:
        pass
    return hasil


def ambil_kunci() -> str:
    kunci = os.environ.get("KIE_API_KEY") or _baca_dotenv().get("KIE_API_KEY") or ""
    kunci = kunci.strip()
    if not kunci:
        raise KunciTidakAda()
    return kunci


def tersedia() -> bool:
    try:
        ambil_kunci()
        return True
    except KunciTidakAda:
        return False


def _konteks_ssl() -> ssl.SSLContext:
    """Hormati CA bundle milik proxy kalau ada, tanpa pernah mematikan verifikasi."""
    for berkas in (os.environ.get("SSL_CERT_FILE"), os.environ.get("REQUESTS_CA_BUNDLE"),
                   "/root/.ccr/ca-bundle.crt"):
        if berkas and os.path.exists(berkas):
            try:
                return ssl.create_default_context(cafile=berkas)
            except Exception:  # noqa: BLE001
                continue
    return ssl.create_default_context()


@dataclass
class Klien:
    kunci: str = ""
    jeda_cek: float = 4.0
    batas_tunggu: float = 600.0

    def __post_init__(self) -> None:
        self.kunci = self.kunci or ambil_kunci()

    # -- dasar ------------------------------------------------------------
    def _minta(self, jalur: str, muatan: Optional[dict] = None,
               metode: str = "POST", timeout: int = 120) -> dict:
        alamat = jalur if jalur.startswith("http") else DASAR + jalur
        data = json.dumps(muatan).encode("utf-8") if muatan is not None else None
        permintaan = urllib.request.Request(alamat, data=data, method=metode)
        permintaan.add_header("Authorization", f"Bearer {self.kunci}")
        permintaan.add_header("Content-Type", "application/json")
        permintaan.add_header("Accept", "application/json")
        try:
            with urllib.request.urlopen(permintaan, timeout=timeout,
                                        context=_konteks_ssl()) as tanggapan:
                isi = tanggapan.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            rincian = e.read().decode("utf-8", "replace")[:400]
            if e.code in (401, 403):
                raise KieGagal(
                    "Kunci API kie.ai ditolak (401/403). Periksa kembali kuncinya, "
                    "atau buat kunci baru di kie.ai."
                ) from e
            if e.code == 402:
                raise KieGagal("Saldo kredit kie.ai habis.") from e
            raise KieGagal(f"kie.ai menolak permintaan (HTTP {e.code}): {rincian}") from e
        except urllib.error.URLError as e:
            raise KieGagal(f"Tidak bisa menghubungi kie.ai: {e.reason}") from e

        try:
            hasil = json.loads(isi)
        except json.JSONDecodeError as e:
            raise KieGagal(f"Jawaban kie.ai tidak bisa dibaca: {isi[:200]}") from e

        kode = hasil.get("code")
        if kode not in (200, None) and not hasil.get("success", False):
            raise KieGagal(f"kie.ai: {hasil.get('msg') or hasil}")
        return hasil

    # -- langkah ----------------------------------------------------------
    def unggah(self, berkas: str, folder: str = "images/vidclean") -> str:
        """Unggah berkas lokal, kembalikan URL sementara (berlaku 3 hari)."""
        if not os.path.exists(berkas):
            raise FileNotFoundError(f"Berkas tidak ditemukan: {berkas}")
        ukuran = os.path.getsize(berkas)
        if ukuran > BATAS_UNGGAH:
            raise KieGagal(
                f"Berkas terlalu besar untuk diunggah ({ukuran / 1048576:.1f} MB, "
                f"batasnya {BATAS_UNGGAH // 1048576} MB). Perkecil dulu fotonya."
            )
        tipe = mimetypes.guess_type(berkas)[0] or "image/png"
        with open(berkas, "rb") as f:
            sandi = base64.b64encode(f.read()).decode("ascii")
        hasil = self._minta(JALUR_UNGGAH, {
            "base64Data": f"data:{tipe};base64,{sandi}",
            "uploadPath": folder,
            "fileName": os.path.basename(berkas),
        }, timeout=300)
        url = (hasil.get("data") or {}).get("downloadUrl")
        if not url:
            raise KieGagal(f"Unggahan tidak mengembalikan URL: {hasil}")
        return url

    def buat_tugas(self, model: str, masukan: Dict[str, Any]) -> str:
        hasil = self._minta(JALUR_BUAT, {"model": model, "input": masukan})
        tugas = (hasil.get("data") or {}).get("taskId")
        if not tugas:
            raise KieGagal(f"Tugas tidak dibuat: {hasil}")
        return tugas

    def tunggu(self, id_tugas: str, kabar=None) -> List[str]:
        """Tunggu sampai tugas selesai, kembalikan daftar URL hasil."""
        tenggat = time.time() + self.batas_tunggu
        while time.time() < tenggat:
            hasil = self._minta(f"{JALUR_CEK}?taskId={id_tugas}", metode="GET", timeout=60)
            data = hasil.get("data") or {}
            keadaan = str(data.get("state") or "").lower()

            if keadaan in ("success", "succeeded", "completed"):
                mentah = data.get("resultJson") or "{}"
                try:
                    isi = json.loads(mentah) if isinstance(mentah, str) else mentah
                except json.JSONDecodeError:
                    isi = {}
                url = isi.get("resultUrls") or isi.get("result_urls") or []
                if isinstance(url, str):
                    url = [url]
                if not url:
                    raise KieGagal(f"Tugas selesai tapi tidak ada hasilnya: {data}")
                return list(url)

            if keadaan in ("fail", "failed", "error"):
                raise KieGagal(
                    "Pembuatan gagal di kie.ai: "
                    f"{data.get('failMsg') or data.get('msg') or data}"
                )

            if kabar:
                kabar(keadaan or "menunggu")
            time.sleep(self.jeda_cek)

        raise KieGagal(
            f"Tugas belum selesai setelah {int(self.batas_tunggu)} detik. "
            "Coba lagi, atau naikkan batas waktunya."
        )

    def unduh(self, url: str, tujuan: str) -> str:
        os.makedirs(os.path.dirname(os.path.abspath(tujuan)) or ".", exist_ok=True)
        permintaan = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(permintaan, timeout=300, context=_konteks_ssl()) as t, \
                open(tujuan, "wb") as f:
            while True:
                potong = t.read(262144)
                if not potong:
                    break
                f.write(potong)
        return tujuan

    # -- gabungan ---------------------------------------------------------
    def olah_gambar(self, foto: str, perintah: str, tujuan: str,
                    model: str = MODEL_GAMBAR, tambahan: Optional[dict] = None,
                    kabar=None) -> str:
        """Ubah satu foto produk menjadi versi baru sesuai perintah teks."""
        if kabar:
            kabar("mengunggah foto")
        url_masuk = self.unggah(foto)

        masukan: Dict[str, Any] = {"prompt": perintah, "image_url": url_masuk}
        masukan.update(tambahan or {})

        if kabar:
            kabar("membuat tugas")
        tugas = self.buat_tugas(model, masukan)

        if kabar:
            kabar("menunggu hasil")
        url_hasil = self.tunggu(tugas, kabar)

        if kabar:
            kabar("mengunduh hasil")
        return self.unduh(url_hasil[0], tujuan)

    def dari_perintah(self, perintah: str, tujuan: str, model: str,
                      tambahan: Optional[dict] = None, kabar=None) -> str:
        """Buat gambar atau video baru hanya dari perintah teks."""
        masukan: Dict[str, Any] = {"prompt": perintah}
        masukan.update(tambahan or {})
        tugas = self.buat_tugas(model, masukan)
        url_hasil = self.tunggu(tugas, kabar)
        return self.unduh(url_hasil[0], tujuan)
