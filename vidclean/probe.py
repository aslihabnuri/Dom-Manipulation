"""Membaca informasi teknis video memakai ffprobe."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, asdict

from .ffmpeg import ffmpeg_bin, ffprobe_bin, jalankan


@dataclass
class InfoVideo:
    berkas: str
    lebar: int
    tinggi: int
    fps: float
    durasi: float
    ada_audio: bool
    codec_video: str
    codec_audio: str
    ukuran_byte: int
    rotasi: int = 0

    @property
    def rasio(self) -> float:
        return (self.lebar / self.tinggi) if self.tinggi else 0.0

    @property
    def vertikal(self) -> bool:
        return self.rasio < 1.0

    def ringkas(self) -> str:
        mb = self.ukuran_byte / 1_048_576
        au = self.codec_audio if self.ada_audio else "tidak ada"
        return (
            f"{self.lebar}x{self.tinggi} | {self.fps:.2f} fps | "
            f"{self.durasi:.2f} detik | video: {self.codec_video} | audio: {au} | {mb:.2f} MB"
        )

    def as_dict(self) -> dict:
        return asdict(self)


def _pecahan(teks: str) -> float:
    try:
        if "/" in teks:
            atas, bawah = teks.split("/", 1)
            bawah_f = float(bawah)
            return float(atas) / bawah_f if bawah_f else 0.0
        return float(teks)
    except (ValueError, ZeroDivisionError):
        return 0.0


def _ukur_durasi_decode(berkas: str) -> float:
    """Durasi lewat decode penuh, dibaca dari kemajuan 'out_time' ffmpeg."""
    import subprocess

    try:
        hasil = subprocess.run(
            [ffmpeg_bin(), "-hide_banner", "-nostats", "-i", berkas,
             "-map", "0:v:0", "-f", "null", "-progress", "pipe:1", "-"],
            capture_output=True, text=True, timeout=600,
        )
    except Exception:  # noqa: BLE001
        return 0.0
    detik = 0.0
    for baris in hasil.stdout.splitlines():
        if baris.startswith("out_time_us="):
            try:
                detik = max(detik, float(baris.split("=", 1)[1]) / 1_000_000.0)
            except ValueError:
                continue
    return round(detik, 3)


def periksa(berkas: str) -> InfoVideo:
    if not os.path.exists(berkas):
        raise FileNotFoundError(f"Video tidak ditemukan: {berkas}")

    keluaran = jalankan(
        [
            ffprobe_bin(), "-v", "error",
            "-print_format", "json",
            "-show_format", "-show_streams",
            berkas,
        ],
        timeout=120,
    )
    data = json.loads(keluaran)
    streams = data.get("streams", [])
    fmt = data.get("format", {})

    v = next((s for s in streams if s.get("codec_type") == "video"), None)
    a = next((s for s in streams if s.get("codec_type") == "audio"), None)
    if v is None:
        raise ValueError(f"Berkas ini tidak punya jalur video: {berkas}")

    lebar = int(v.get("width") or 0)
    tinggi = int(v.get("height") or 0)

    rotasi = 0
    for sd in v.get("side_data_list") or []:
        if "rotation" in sd:
            try:
                rotasi = int(round(float(sd["rotation"]))) % 360
            except (TypeError, ValueError):
                rotasi = 0
    if rotasi in (90, 270):
        lebar, tinggi = tinggi, lebar

    fps = _pecahan(v.get("avg_frame_rate") or "0") or _pecahan(v.get("r_frame_rate") or "0")
    if fps <= 0 or fps > 240:
        fps = 30.0

    durasi = 0.0
    for kandidat in (fmt.get("duration"), v.get("duration")):
        try:
            durasi = float(kandidat)
            if durasi > 0:
                break
        except (TypeError, ValueError):
            continue

    if durasi <= 0.0:
        # Wadah tidak menyimpan durasi (stream mentah / berkas cacat).
        # Ukur lewat decode penuh - lambat tapi hanya terjadi pada kasus
        # langka ini, dan tanpa angka durasi pipa hilir bisa menghasilkan
        # keluaran bermasalah (mis. audio senyap berjam-jam).
        durasi = _ukur_durasi_decode(berkas)

    return InfoVideo(
        berkas=berkas,
        lebar=lebar,
        tinggi=tinggi,
        fps=round(fps, 3),
        durasi=round(durasi, 3),
        ada_audio=a is not None,
        codec_video=v.get("codec_name", "?"),
        codec_audio=(a or {}).get("codec_name", "-"),
        ukuran_byte=int(fmt.get("size") or os.path.getsize(berkas)),
        rotasi=rotasi,
    )
