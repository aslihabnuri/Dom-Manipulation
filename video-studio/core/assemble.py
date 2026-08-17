"""Perakitan video akhir dengan ffmpeg.

Gerak gambar dibuat secara terprogram, bukan lewat model AI. Alasannya
ditemukan dari pengujian langsung: model image-to-video mengubah bentuk
karakter di tengah klip — mulut hilang, kaki berubah, proporsi bergeser.
Untuk video yang harus jadi sekali tanpa revisi, itu risiko yang tidak
sepadan dengan biayanya.

Gerak terprogram memberi tiga jaminan:
  - ilustrasi tidak pernah berubah bentuk
  - hasilnya sama persis setiap kali dijalankan
  - tidak ada biaya tambahan per adegan

Model image-to-video tetap disediakan sebagai pilihan untuk adegan tertentu
yang benar-benar butuh gerak nyata.
"""
from __future__ import annotations

import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from .config import RENDER
from .subtitles import filter_subtitle

# Resolusi kerja dibuat dua kali lipat resolusi akhir. zoompan membulatkan
# posisi ke piksel sumber, jadi sumber yang lebih besar membuat gerakannya
# halus, tidak tersendat.
KERJA_W = RENDER.width * 2
KERJA_H = RENDER.height * 2


class RenderGagal(RuntimeError):
    pass


def cek_ffmpeg() -> tuple[bool, str]:
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        return False, (
            "ffmpeg belum terpasang. Aplikasi tidak bisa merakit video tanpa ini.\n"
            "Windows : unduh dari https://www.gyan.dev/ffmpeg/builds/ lalu tambahkan ke PATH\n"
            "macOS   : brew install ffmpeg\n"
            "Linux   : sudo apt install ffmpeg"
        )
    try:
        hasil = subprocess.run(
            ["ffmpeg", "-version"], capture_output=True, text=True, timeout=15
        )
        baris = hasil.stdout.splitlines()[0] if hasil.stdout else "ffmpeg"
        return True, baris
    except (subprocess.SubprocessError, OSError) as exc:
        return False, f"ffmpeg ada tetapi gagal dijalankan: {exc}"


def _jalankan(perintah: list[str], keterangan: str) -> None:
    hasil = subprocess.run(perintah, capture_output=True, text=True)
    if hasil.returncode != 0:
        pesan = (hasil.stderr or "").strip().splitlines()
        ekor = "\n".join(pesan[-6:]) if pesan else "tanpa keterangan"
        raise RenderGagal(f"{keterangan} gagal.\n{ekor}")


# ---------------------------------------------------------------------------
# Gerak kamera
# ---------------------------------------------------------------------------
def ekspresi_gerak(jenis: str, jumlah_frame: int) -> tuple[str, str, str]:
    """Kembalikan ekspresi (zoom, x, y) untuk filter zoompan."""
    n = max(2, jumlah_frame)
    tengah_x = "iw/2-(iw/zoom/2)"
    tengah_y = "ih/2-(ih/zoom/2)"
    j = (jenis or "").strip().lower()

    if j in ("zoom-out", "zoom out", "mundur"):
        return f"1.14-0.14*on/{n}", tengah_x, tengah_y
    if j in ("geser-kanan", "pan-right", "geser kanan"):
        return "1.12", f"(iw-iw/zoom)*on/{n}", tengah_y
    if j in ("geser-kiri", "pan-left", "geser kiri"):
        return "1.12", f"(iw-iw/zoom)*(1-on/{n})", tengah_y
    if j in ("naik", "pan-up"):
        return "1.12", tengah_x, f"(ih-ih/zoom)*(1-on/{n})"
    if j in ("turun", "pan-down"):
        return "1.12", tengah_x, f"(ih-ih/zoom)*on/{n}"
    if j == "pop":
        # Membesar cepat lalu mendarat, meniru gerak "muncul" pada animasi.
        # Puncak zoom sengaja ditahan di 1,13 supaya kepala tokoh tidak terpotong
        # pada gambar yang komposisinya agak rapat.
        cepat = max(2, int(n * 0.30))
        return (
            f"if(lt(on,{cepat}),1.13-0.13*on/{cepat},1.001+0.02*(on-{cepat})/{max(1, n-cepat)})",
            tengah_x, tengah_y,
        )
    if j in ("getar", "shake"):
        return "1.08", f"{tengah_x}+14*sin(on/2.1)", f"{tengah_y}+9*sin(on/1.7)"
    # Bawaan: zoom-in perlahan.
    return f"1.001+0.13*on/{n}", tengah_x, tengah_y


def segmen_dari_gambar(
    gambar: Path,
    durasi: float,
    keluar: Path,
    *,
    gerak: str = "zoom-in",
    fps: int = RENDER.fps,
) -> Path:
    """Ubah satu gambar diam menjadi potongan video bergerak."""
    keluar.parent.mkdir(parents=True, exist_ok=True)
    frame = max(2, int(round(durasi * fps)))
    z, x, y = ekspresi_gerak(gerak, frame)

    rantai = (
        # Naikkan ke resolusi kerja, isi penuh bingkai 9:16, potong kelebihannya.
        f"scale={KERJA_W}:{KERJA_H}:force_original_aspect_ratio=increase,"
        f"crop={KERJA_W}:{KERJA_H},"
        f"zoompan=z='{z}':x='{x}':y='{y}':d={frame}:s={RENDER.width}x{RENDER.height}:fps={fps},"
        f"format=yuv420p"
    )
    _jalankan(
        [
            "ffmpeg", "-v", "error", "-y",
            "-loop", "1", "-i", str(gambar),
            "-t", f"{durasi:.3f}",
            "-vf", rantai,
            "-r", str(fps),
            "-c:v", "libx264", "-preset", "medium", "-crf", "17",
            "-pix_fmt", "yuv420p",
            str(keluar),
        ],
        f"Membuat gerak adegan dari {gambar.name}",
    )
    return keluar


def segmen_dari_video(
    video: Path, durasi: float, keluar: Path, *, fps: int = RENDER.fps
) -> Path:
    """Samakan format klip hasil model image-to-video dengan segmen lainnya."""
    keluar.parent.mkdir(parents=True, exist_ok=True)
    rantai = (
        f"scale={RENDER.width}:{RENDER.height}:force_original_aspect_ratio=increase,"
        f"crop={RENDER.width}:{RENDER.height},fps={fps},format=yuv420p"
    )
    _jalankan(
        [
            "ffmpeg", "-v", "error", "-y", "-i", str(video),
            "-t", f"{durasi:.3f}", "-an", "-vf", rantai,
            "-c:v", "libx264", "-preset", "medium", "-crf", "17",
            "-pix_fmt", "yuv420p", str(keluar),
        ],
        f"Menyesuaikan klip {video.name}",
    )
    return keluar


# ---------------------------------------------------------------------------
# Penggabungan
# ---------------------------------------------------------------------------
def sambung_segmen(segmen: list[Path], keluar: Path) -> Path:
    if not segmen:
        raise RenderGagal("Tidak ada segmen video untuk disambung.")
    keluar.parent.mkdir(parents=True, exist_ok=True)
    daftar = keluar.parent / "daftar_segmen.txt"
    daftar.write_text(
        "\n".join(f"file '{p.resolve().as_posix()}'" for p in segmen) + "\n",
        encoding="utf-8",
    )
    _jalankan(
        ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0",
         "-i", str(daftar), "-c", "copy", str(keluar)],
        "Menyambung segmen video",
    )
    return keluar


# ---------------------------------------------------------------------------
# Sentuhan akhir
# ---------------------------------------------------------------------------
def _filter_akhir(
    berkas_ass: Path | None,
    *,
    butiran: bool,
    vignette: bool,
) -> str:
    bagian: list[str] = []
    if berkas_ass:
        bagian.append(filter_subtitle(berkas_ass))
    if vignette:
        # Sangat halus; hanya untuk memecah kesan render digital yang terlalu rata.
        bagian.append("vignette=angle=PI/6:mode=forward")
    if butiran:
        bagian.append("noise=alls=4:allf=t+u")
    bagian.append("format=yuv420p")
    return ",".join(bagian)


def render_akhir(
    video: Path,
    audio: Path,
    keluar: Path,
    *,
    berkas_ass: Path | None = None,
    butiran: bool = True,
    vignette: bool = True,
    fps: int = RENDER.fps,
) -> Path:
    """Bakar takarir, gabungkan audio, dan hasilkan berkas siap unggah."""
    keluar.parent.mkdir(parents=True, exist_ok=True)
    _jalankan(
        [
            "ffmpeg", "-v", "error", "-y",
            "-i", str(video), "-i", str(audio),
            "-vf", _filter_akhir(berkas_ass, butiran=butiran, vignette=vignette),
            "-map", "0:v:0", "-map", "1:a:0",
            "-c:v", "libx264", "-preset", "slow", "-crf", "19",
            "-b:v", RENDER.video_bitrate, "-maxrate", RENDER.video_bitrate,
            "-bufsize", "16M", "-pix_fmt", "yuv420p", "-r", str(fps),
            "-profile:v", "high", "-level", "4.1",
            "-c:a", "aac", "-b:a", RENDER.audio_bitrate, "-ar", "48000", "-ac", "2",
            "-movflags", "+faststart",
            "-shortest",
            str(keluar),
        ],
        "Render video akhir",
    )
    return keluar


# ---------------------------------------------------------------------------
# Pemeriksaan hasil
# ---------------------------------------------------------------------------
@dataclass
class LaporanVideo:
    durasi: float
    lebar: int
    tinggi: int
    fps: float
    punya_audio: bool
    ukuran_mb: float
    lufs: float | None = None
    puncak: float | None = None
    masalah: list[str] | None = None

    @property
    def lolos(self) -> bool:
        return not self.masalah


def periksa_hasil(berkas: Path, *, durasi_harapan: float | None = None) -> LaporanVideo:
    """Pemeriksaan teknis terakhir sebelum video dinyatakan siap unggah."""
    import json

    hasil = subprocess.run(
        ["ffprobe", "-v", "error", "-show_format", "-show_streams",
         "-of", "json", str(berkas)],
        capture_output=True, text=True,
    )
    if hasil.returncode != 0:
        raise RenderGagal("Berkas video akhir tidak bisa dibaca ffprobe.")
    data = json.loads(hasil.stdout)

    v = next((s for s in data["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
    if not v:
        raise RenderGagal("Berkas hasil tidak memiliki jalur video.")

    durasi = float(data["format"].get("duration", 0) or 0)
    num, _, den = (v.get("r_frame_rate") or "30/1").partition("/")
    fps = float(num) / float(den or 1)

    lap = LaporanVideo(
        durasi=durasi,
        lebar=int(v["width"]),
        tinggi=int(v["height"]),
        fps=fps,
        punya_audio=bool(a),
        ukuran_mb=round(int(data["format"].get("size", 0)) / 1_048_576, 2),
        masalah=[],
    )

    # Ukur kenyaringan akhir.
    ukur = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(berkas), "-af", "ebur128=peak=true",
         "-f", "null", "-"],
        capture_output=True, text=True,
    )
    for baris in ukur.stderr.splitlines():
        b = baris.strip()
        if b.startswith("I:") and "LUFS" in b:
            try:
                lap.lufs = float(b.split()[1])
            except (IndexError, ValueError):
                pass
        elif b.startswith("Peak:") and "dBFS" in b:
            try:
                lap.puncak = float(b.split()[1])
            except (IndexError, ValueError):
                pass

    masalah = lap.masalah
    if lap.lebar != RENDER.width or lap.tinggi != RENDER.height:
        masalah.append(
            f"Ukuran {lap.lebar}x{lap.tinggi}, seharusnya {RENDER.width}x{RENDER.height}."
        )
    if not lap.punya_audio:
        masalah.append("Video tidak punya jalur suara.")
    if durasi < 5:
        masalah.append(f"Durasi hanya {durasi:.1f} detik — terlalu pendek.")
    if durasi > 180:
        masalah.append(f"Durasi {durasi:.0f} detik melebihi batas nyaman video pendek.")
    if durasi_harapan and abs(durasi - durasi_harapan) > 2.5:
        masalah.append(
            f"Durasi {durasi:.1f} detik meleset dari perkiraan {durasi_harapan:.1f} detik."
        )
    if lap.lufs is not None and abs(lap.lufs - RENDER.lufs) > 2.0:
        masalah.append(
            f"Kenyaringan {lap.lufs:.1f} LUFS, target {RENDER.lufs} LUFS."
        )
    if lap.puncak is not None and lap.puncak > 0.0:
        masalah.append(f"Puncak audio {lap.puncak:.1f} dBFS berpotensi pecah.")
    if lap.ukuran_mb > 280:
        masalah.append(f"Ukuran berkas {lap.ukuran_mb} MB cukup besar untuk diunggah.")

    return lap
