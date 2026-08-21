"""Pengelolaan font supaya semua video memakai huruf yang sama persis.

Font disimpan di folder assets/fonts sehingga hasil edit terlihat identik
di komputer mana pun, tanpa perlu memasang font di sistem.
"""

from __future__ import annotations

import os
import struct
from dataclasses import dataclass
from typing import Dict, List

AKAR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOLDER_FONT = os.path.join(AKAR, "assets", "fonts")
EKSTENSI = (".ttf", ".otf")


@dataclass(frozen=True)
class Font:
    berkas: str
    keluarga: str      # nama keluarga font, mis. "Montserrat"
    gaya: str          # mis. "Bold", "SemiBold", "Regular"

    @property
    def tebal(self) -> bool:
        return "bold" in self.gaya.lower()

    @property
    def label(self) -> str:
        return f"{self.keluarga} {self.gaya}".strip()


def _baca_nama_ttf(path: str) -> tuple[str, str]:
    """Ambil (keluarga, gaya) dari tabel 'name' di dalam berkas font."""
    with open(path, "rb") as f:
        data = f.read()

    if len(data) < 12:
        raise ValueError("berkas font terlalu pendek")

    jumlah_tabel = struct.unpack(">H", data[4:6])[0]
    posisi_name = panjang_name = None
    for i in range(jumlah_tabel):
        awal = 12 + i * 16
        if awal + 16 > len(data):
            break
        tag = data[awal:awal + 4]
        if tag == b"name":
            posisi_name, panjang_name = struct.unpack(">II", data[awal + 8:awal + 16])
            break
    if posisi_name is None:
        raise ValueError("tabel 'name' tidak ditemukan")

    tabel = data[posisi_name:posisi_name + panjang_name]
    _, jumlah, offset_teks = struct.unpack(">HHH", tabel[:6])

    terkumpul: Dict[int, str] = {}
    for i in range(jumlah):
        awal = 6 + i * 12
        if awal + 12 > len(tabel):
            break
        pid, eid, _lang, nid, panjang, offset = struct.unpack(">HHHHHH", tabel[awal:awal + 12])
        if nid not in (1, 2, 16, 17):
            continue
        potong = tabel[offset_teks + offset: offset_teks + offset + panjang]
        if not potong:
            continue
        try:
            if pid == 3 or (pid == 0):
                teks = potong.decode("utf-16-be", errors="ignore")
            elif pid == 1:
                teks = potong.decode("mac-roman" if eid == 0 else "latin-1", errors="ignore")
            else:
                teks = potong.decode("latin-1", errors="ignore")
        except Exception:
            continue
        teks = teks.strip("\x00 ").strip()
        if teks and nid not in terkumpul:
            terkumpul[nid] = teks

    keluarga = terkumpul.get(16) or terkumpul.get(1) or os.path.splitext(os.path.basename(path))[0]
    gaya = terkumpul.get(17) or terkumpul.get(2) or "Regular"
    return keluarga, gaya


def daftar(folder: str | None = None) -> List[Font]:
    """Semua font yang tersedia di folder assets/fonts."""
    folder = folder or FOLDER_FONT
    hasil: List[Font] = []
    if not os.path.isdir(folder):
        return hasil
    for nama in sorted(os.listdir(folder)):
        if not nama.lower().endswith(EKSTENSI):
            continue
        path = os.path.join(folder, nama)
        try:
            keluarga, gaya = _baca_nama_ttf(path)
        except Exception:
            dasar = os.path.splitext(nama)[0]
            keluarga, _, gaya = dasar.partition("-")
            gaya = gaya or "Regular"
        hasil.append(Font(berkas=path, keluarga=keluarga, gaya=gaya))
    return hasil


def keluarga_tersedia(folder: str | None = None) -> List[str]:
    return sorted({f.keluarga for f in daftar(folder)})


def _skor(font: Font, ingin_tebal: bool) -> int:
    gaya = font.gaya.lower()
    if ingin_tebal:
        if gaya in ("bold", "extrabold", "black"):
            return 0
        if "semibold" in gaya or "demibold" in gaya:
            return 1
        if "medium" in gaya:
            return 2
        if "italic" in gaya or "oblique" in gaya:
            return 6
        return 3
    if gaya in ("regular", "book"):
        return 0
    if "medium" in gaya:
        return 1
    if "semibold" in gaya:
        return 2
    if "italic" in gaya or "oblique" in gaya:
        return 6
    return 3


def pilih(nama: str, tebal: bool = True, folder: str | None = None) -> Font:
    """Cari font berdasarkan nama keluarga, nama berkas, atau path langsung."""
    nama = (nama or "").strip()

    # 1. Pengguna memberi path berkas font miliknya sendiri.
    if nama.lower().endswith(EKSTENSI) and os.path.exists(nama):
        try:
            keluarga, gaya = _baca_nama_ttf(nama)
        except Exception:
            keluarga, gaya = os.path.splitext(os.path.basename(nama))[0], "Regular"
        return Font(berkas=os.path.abspath(nama), keluarga=keluarga, gaya=gaya)

    semua = daftar(folder)
    if not semua:
        raise FileNotFoundError(
            f"Tidak ada font di {folder or FOLDER_FONT}. "
            "Letakkan minimal satu berkas .ttf di folder tersebut."
        )

    kunci = nama.lower().replace(" ", "").replace("-", "").replace("_", "")
    if not kunci:
        cocok = semua
    else:
        cocok = [
            f for f in semua
            if kunci in f.keluarga.lower().replace(" ", "")
            or kunci in os.path.basename(f.berkas).lower().replace("-", "").replace("_", "")
        ]
    if not cocok:
        tersedia = ", ".join(keluarga_tersedia(folder))
        raise ValueError(f"Font '{nama}' tidak ada. Yang tersedia: {tersedia}")

    cocok.sort(key=lambda f: (_skor(f, tebal), len(f.keluarga)))
    return cocok[0]
