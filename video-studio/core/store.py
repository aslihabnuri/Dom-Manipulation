"""Penyimpanan proyek di komputer pengguna.

Setiap proyek adalah satu folder di dalam "projects/". Semua keadaan disimpan
di berkas proyek.json, jadi pekerjaan tidak hilang kalau aplikasi ditutup di
tengah jalan. Ini penting karena satu video melewati beberapa tahap yang
dipisahkan oleh persetujuan manusia.
"""
from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

from .config import PROJECTS_DIR

# Urutan tahap. Tahap hanya boleh maju satu langkah dari yang sudah selesai.
TAHAP = [
    "produk",       # 1. unggah foto dan isi keterangan produk
    "riset",        # 2. cari topik cerita
    "naskah",       # 3a. tulis naskah
    "storyboard",   # 3b. buat gambar dan suara
    "disetujui",    # 4. pengguna menekan tombol setuju
    "selesai",      # 5. video dan caption jadi
]

LABEL_TAHAP = {
    "produk": "Produk",
    "riset": "Riset Topik",
    "naskah": "Naskah",
    "storyboard": "Storyboard",
    "disetujui": "Disetujui",
    "selesai": "Selesai",
}


def _slug(teks: str) -> str:
    s = re.sub(r"[^\w\s-]", "", teks.lower()).strip()
    s = re.sub(r"[\s_-]+", "-", s)
    return s[:48] or "proyek"


@dataclass
class Proyek:
    nama: str
    folder: Path
    dibuat: str = ""
    diubah: str = ""
    tahap: str = "produk"
    data: dict[str, Any] = field(default_factory=dict)

    # ------------------------------------------------------------------
    @classmethod
    def baru(cls, nama: str) -> "Proyek":
        dasar = _slug(nama)
        folder = PROJECTS_DIR / dasar
        n = 2
        while folder.exists():
            folder = PROJECTS_DIR / f"{dasar}-{n}"
            n += 1
        folder.mkdir(parents=True)
        (folder / "gambar").mkdir()
        (folder / "suara").mkdir()
        (folder / "hasil").mkdir()
        sekarang = datetime.now().isoformat(timespec="seconds")
        p = cls(nama=nama, folder=folder, dibuat=sekarang, diubah=sekarang)
        p.simpan()
        return p

    @classmethod
    def muat(cls, folder: Path) -> "Proyek":
        berkas = folder / "proyek.json"
        d = json.loads(berkas.read_text(encoding="utf-8"))
        return cls(
            nama=d.get("nama", folder.name),
            folder=folder,
            dibuat=d.get("dibuat", ""),
            diubah=d.get("diubah", ""),
            tahap=d.get("tahap", "produk"),
            data=d.get("data", {}),
        )

    @classmethod
    def daftar(cls) -> list["Proyek"]:
        hasil = []
        for f in sorted(PROJECTS_DIR.iterdir(), reverse=True):
            if f.is_dir() and (f / "proyek.json").exists():
                try:
                    hasil.append(cls.muat(f))
                except (json.JSONDecodeError, OSError):
                    continue
        hasil.sort(key=lambda p: p.diubah, reverse=True)
        return hasil

    # ------------------------------------------------------------------
    def simpan(self) -> None:
        self.diubah = datetime.now().isoformat(timespec="seconds")
        (self.folder / "proyek.json").write_text(
            json.dumps(
                {
                    "nama": self.nama,
                    "dibuat": self.dibuat,
                    "diubah": self.diubah,
                    "tahap": self.tahap,
                    "data": self.data,
                },
                indent=2,
                ensure_ascii=False,
                default=str,
            ),
            encoding="utf-8",
        )

    def hapus(self) -> None:
        shutil.rmtree(self.folder, ignore_errors=True)

    # ------------------------------------------------------------------
    def set(self, kunci: str, nilai: Any) -> None:
        self.data[kunci] = nilai
        self.simpan()

    def get(self, kunci: str, bawaan: Any = None) -> Any:
        return self.data.get(kunci, bawaan)

    def naik_tahap(self, tahap: str) -> None:
        """Majukan tahap, tetapi jangan pernah memundurkannya."""
        if tahap in TAHAP and TAHAP.index(tahap) > TAHAP.index(self.tahap):
            self.tahap = tahap
        self.simpan()

    def sudah_melewati(self, tahap: str) -> bool:
        try:
            return TAHAP.index(self.tahap) >= TAHAP.index(tahap)
        except ValueError:
            return False

    # ------------------------------------------------------------------
    @property
    def dir_gambar(self) -> Path:
        d = self.folder / "gambar"
        d.mkdir(exist_ok=True)
        return d

    @property
    def dir_suara(self) -> Path:
        d = self.folder / "suara"
        d.mkdir(exist_ok=True)
        return d

    @property
    def dir_hasil(self) -> Path:
        d = self.folder / "hasil"
        d.mkdir(exist_ok=True)
        return d

    @property
    def berkas_video(self) -> Path:
        return self.dir_hasil / "video.mp4"

    @property
    def total_kredit(self) -> float:
        return float(self.get("total_kredit", 0.0))

    def tambah_kredit(self, jumlah: float, keterangan: str = "") -> None:
        self.data["total_kredit"] = round(self.total_kredit + float(jumlah), 2)
        catatan = self.data.setdefault("rincian_kredit", [])
        catatan.append(
            {
                "waktu": datetime.now().isoformat(timespec="seconds"),
                "jumlah": round(float(jumlah), 2),
                "keterangan": keterangan,
            }
        )
        self.simpan()

    def catat(self, pesan: str) -> None:
        log = self.data.setdefault("log", [])
        log.append(
            {"waktu": datetime.now().strftime("%H:%M:%S"), "pesan": pesan}
        )
        # Batasi supaya berkas tidak membengkak.
        if len(log) > 400:
            self.data["log"] = log[-400:]
        self.simpan()
