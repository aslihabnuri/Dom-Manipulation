"""Menyalin hasil video ke Google Drive.

Berkas video berukuran belasan sampai puluhan megabyte. Mengirimnya lewat API
memerlukan pendaftaran proyek Google Cloud, layar persetujuan OAuth, dan
berkas kredensial — beban yang tidak masuk akal untuk pengguna yang tidak
memprogram.

Karena itu aplikasi memakai dua cara yang jauh lebih sederhana:

  1. Folder Google Drive Desktop  (bawaan, tanpa pengaturan apa pun)
     Kalau Google Drive for Desktop terpasang, komputer sudah punya folder
     yang otomatis tersinkron ke Drive. Aplikasi cukup menyalin berkas ke
     sana, dan Drive yang mengurus sisanya. Tidak ada kunci, tidak ada token,
     tidak ada yang bisa kedaluwarsa.

  2. rclone  (untuk yang tidak memakai Drive Desktop)
     Sekali jalankan "rclone config", setelah itu aplikasi memanggil
     "rclone copy" sendiri.

Tiap kategori punya foldernya sendiri, sesuai nama akun media sosialnya.
"""
from __future__ import annotations

import os
import shutil
import subprocess
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

# Nama folder tujuan per kategori. Disamakan dengan nama akun media sosial
# supaya isinya tidak pernah tertukar saat mengunggah.
FOLDER_KATEGORI = {
    "fnb": "seruputsejarah",
    "fashion": "benangmerah",
}


@dataclass
class HasilSalin:
    berhasil: bool
    tujuan: str = ""
    metode: str = ""
    pesan: str = ""


def nama_folder(kode_kategori: str, peta: dict[str, str] | None = None) -> str:
    peta = peta or FOLDER_KATEGORI
    return peta.get(kode_kategori, kode_kategori)


# ---------------------------------------------------------------------------
# Cara 1 — folder Google Drive Desktop
# ---------------------------------------------------------------------------
def _kandidat_folder() -> list[Path]:
    """Lokasi yang biasa dipakai Google Drive for Desktop di tiap sistem."""
    rumah = Path.home()
    kandidat: list[Path] = []

    # macOS versi baru menaruhnya di bawah CloudStorage, satu folder per akun.
    cloud = rumah / "Library" / "CloudStorage"
    if cloud.is_dir():
        try:
            kandidat.extend(sorted(cloud.glob("GoogleDrive-*/My Drive")))
        except OSError:
            pass

    kandidat += [
        rumah / "Google Drive" / "My Drive",
        rumah / "Google Drive",
        rumah / "My Drive",
        Path("/Volumes/GoogleDrive/My Drive"),
        rumah / "GoogleDrive",
        rumah / "gdrive",
    ]

    # Windows memasang Drive sebagai huruf drive tersendiri.
    if os.name == "nt":
        kandidat += [Path(f"{h}:/My Drive") for h in "GHIJKLMNOPQRSTUVWXYZ"]

    return kandidat


def deteksi_folder_drive() -> Path | None:
    """Cari folder Drive yang tersinkron di komputer ini."""
    for p in _kandidat_folder():
        try:
            if p.is_dir():
                return p
        except OSError:
            continue
    return None


def salin_ke_folder(
    berkas: list[Path],
    akar_drive: Path,
    subfolder: str,
    *,
    nama_proyek: str = "",
) -> HasilSalin:
    tujuan = akar_drive / subfolder
    if nama_proyek:
        tanggal = datetime.now().strftime("%Y-%m-%d")
        tujuan = tujuan / f"{tanggal} {nama_proyek}"
    try:
        tujuan.mkdir(parents=True, exist_ok=True)
        for f in berkas:
            if f.exists():
                shutil.copy2(f, tujuan / f.name)
    except OSError as exc:
        return HasilSalin(False, str(tujuan), "folder", f"Gagal menyalin: {exc}")
    return HasilSalin(
        True, str(tujuan), "folder",
        f"{len(berkas)} berkas disalin. Google Drive akan menyinkronkannya sendiri.",
    )


# ---------------------------------------------------------------------------
# Cara 2 — rclone
# ---------------------------------------------------------------------------
def rclone_tersedia() -> bool:
    return shutil.which("rclone") is not None


def daftar_remote_rclone() -> list[str]:
    if not rclone_tersedia():
        return []
    try:
        hasil = subprocess.run(
            ["rclone", "listremotes"], capture_output=True, text=True, timeout=20
        )
        return [r.strip().rstrip(":") for r in hasil.stdout.splitlines() if r.strip()]
    except (subprocess.SubprocessError, OSError):
        return []


def salin_dengan_rclone(
    berkas: list[Path],
    remote: str,
    subfolder: str,
    *,
    nama_proyek: str = "",
) -> HasilSalin:
    if not rclone_tersedia():
        return HasilSalin(
            False, "", "rclone",
            "rclone belum terpasang. Unduh di https://rclone.org/downloads/",
        )
    jalur = subfolder
    if nama_proyek:
        jalur = f"{subfolder}/{datetime.now().strftime('%Y-%m-%d')} {nama_proyek}"
    tujuan = f"{remote.rstrip(':')}:{jalur}"

    gagal: list[str] = []
    for f in berkas:
        if not f.exists():
            continue
        try:
            hasil = subprocess.run(
                ["rclone", "copy", str(f), tujuan, "--no-traverse"],
                capture_output=True, text=True, timeout=900,
            )
            if hasil.returncode != 0:
                gagal.append(f"{f.name}: {(hasil.stderr or '').strip()[:120]}")
        except (subprocess.SubprocessError, OSError) as exc:
            gagal.append(f"{f.name}: {exc}")

    if gagal:
        return HasilSalin(False, tujuan, "rclone", "; ".join(gagal))
    return HasilSalin(
        True, tujuan, "rclone", f"{len(berkas)} berkas terunggah ke Drive."
    )


# ---------------------------------------------------------------------------
# Pintu masuk tunggal
# ---------------------------------------------------------------------------
def kirim(
    berkas: list[Path],
    kode_kategori: str,
    *,
    metode: str = "otomatis",
    folder_drive: str = "",
    remote_rclone: str = "",
    nama_proyek: str = "",
    peta_folder: dict[str, str] | None = None,
) -> HasilSalin:
    """Kirim hasil ke Drive dengan cara yang tersedia.

    metode: "otomatis" | "folder" | "rclone" | "mati"
    """
    if metode == "mati":
        return HasilSalin(False, "", "mati", "Pengiriman ke Drive dimatikan.")

    berkas = [Path(f) for f in berkas if Path(f).exists()]
    if not berkas:
        return HasilSalin(False, "", metode, "Tidak ada berkas yang bisa dikirim.")

    sub = nama_folder(kode_kategori, peta_folder)

    if metode in ("otomatis", "folder"):
        akar = Path(folder_drive) if folder_drive else deteksi_folder_drive()
        if akar and akar.is_dir():
            return salin_ke_folder(berkas, akar, sub, nama_proyek=nama_proyek)
        if metode == "folder":
            return HasilSalin(
                False, "", "folder",
                "Folder Google Drive tidak ditemukan di komputer ini. "
                "Pasang Google Drive for Desktop, atau isi sendiri lokasi "
                "foldernya di halaman Pengaturan.",
            )

    if metode in ("otomatis", "rclone"):
        remote = remote_rclone or (daftar_remote_rclone() or [""])[0]
        if remote:
            return salin_dengan_rclone(berkas, remote, sub, nama_proyek=nama_proyek)

    return HasilSalin(
        False, "", "otomatis",
        "Belum ada cara mengirim ke Drive.\n"
        "Pilihan termudah: pasang Google Drive for Desktop dari "
        "https://www.google.com/drive/download/ lalu jalankan ulang aplikasi.\n"
        "Alternatif: pasang rclone dan jalankan  rclone config  sekali.",
    )


def status() -> dict[str, object]:
    """Ringkasan cara pengiriman yang siap dipakai, untuk ditampilkan di UI."""
    folder = deteksi_folder_drive()
    remotes = daftar_remote_rclone()
    return {
        "folder_ditemukan": str(folder) if folder else "",
        "rclone_terpasang": rclone_tersedia(),
        "rclone_remote": remotes,
        "siap": bool(folder or remotes),
    }
