"""Inti aplikasi: merakit perintah ffmpeg dan mengeksekusi proses edit."""

from __future__ import annotations

import math
import os
import shutil
import tempfile
import time
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

from . import config as konfigurasi
from . import fonts as modul_font
from .ffmpeg import ffmpeg_bin, jalankan_dengan_progres, punya_filter
from .probe import InfoVideo, periksa
from . import produk as modul_produk
from .textstyle import PembuatASS
from .unique import Rencana, buat_rencana


# ---------------------------------------------------------------------------
@dataclass
class Permintaan:
    """Semua yang diminta pengguna untuk satu video."""
    masukan: str
    keluaran: str
    judul: str = ""
    caption: str = ""
    handle: str = ""
    subtitle: Sequence[Tuple[float, float, str]] = field(default_factory=list)
    subtitle_waktu_sumber: bool = True   # waktu subtitle mengikuti video asli
    produk: Sequence["modul_produk.Aset"] = field(default_factory=list)
    preset: str = "seimbang"
    seed: Optional[int] = None
    varian: int = 0
    pengaturan: Dict[str, Any] = field(default_factory=dict)
    judul_detik: float = 0.0      # 0 = tampil sepanjang video
    caption_detik: float = 0.0


@dataclass
class Hasil:
    keluaran: str
    rencana: Rencana
    asal: InfoVideo
    hasil: InfoVideo
    perintah: List[str]
    lama_proses: float
    berkas_ass: Optional[str] = None
    font_dipakai: str = ""


# ---------------------------------------------------------------------------
def _genap(nilai: float) -> int:
    return max(2, int(math.floor(nilai / 2)) * 2)


def _jalur_filter(path: str) -> str:
    """Bungkus path agar aman dipakai di dalam filtergraph ffmpeg."""
    p = os.path.abspath(path).replace("\\", "/")
    p = p.replace("'", r"\'").replace(":", r"\:")
    return f"'{p}'"


def _geser_waktu(
    potongan: Sequence[Tuple[float, float, str]],
    potong_awal: float,
    kecepatan: float,
    durasi_akhir: float,
) -> List[Tuple[float, float, str]]:
    """Ubah waktu subtitle dari lini masa video asli ke lini masa hasil edit."""
    hasil: List[Tuple[float, float, str]] = []
    for mulai, selesai, teks in potongan:
        m = (float(mulai) - potong_awal) / kecepatan
        s = (float(selesai) - potong_awal) / kecepatan
        if s <= 0 or m >= durasi_akhir:
            continue
        hasil.append((max(0.0, m), min(durasi_akhir, s), teks))
    return hasil


def _kanvas(info: InfoVideo, video_cfg: Dict[str, Any]) -> Tuple[int, int]:
    rasio = str(video_cfg.get("rasio", "9:16")).strip().lower()
    if rasio in ("asli", "sama", "original", "source"):
        lebar, tinggi = _genap(info.lebar), _genap(info.tinggi)
        # Batasi supaya tidak terlalu besar (hemat waktu render & ukuran berkas).
        maks = 1920
        if max(lebar, tinggi) > maks:
            skala = maks / max(lebar, tinggi)
            lebar, tinggi = _genap(lebar * skala), _genap(tinggi * skala)
        return lebar, tinggi
    return _genap(video_cfg.get("lebar", 1080)), _genap(video_cfg.get("tinggi", 1920))


def _rantai_video(
    info: InfoVideo,
    rencana: Rencana,
    lebar: int,
    tinggi: int,
    video_cfg: Dict[str, Any],
    berkas_ass: Optional[str],
    folder_font: Optional[str],
    rakitan: Optional["modul_produk.Rakitan"] = None,
) -> str:
    """Bangun filtergraph video: mulai dari label [0:v], berakhir di label [v]."""
    graf: List[str] = []

    # ---- Tahap 1: perlakuan pada gambar sumber -------------------------
    awal: List[str] = []

    # Buang tepi layar (sekaligus menghapus watermark yang menempel di pinggir).
    p = rencana.potong_tepi
    if p > 0:
        sisa = 1 - 2 * p
        awal.append(
            f"crop=floor(iw*{sisa:.5f}/2)*2:floor(ih*{sisa:.5f}/2)*2:"
            f"floor(iw*{p:.5f}):floor(ih*{p:.5f})"
        )

    # Cermin kiri-kanan.
    if rencana.cermin:
        awal.append("hflip")

    # Putar sangat halus (sudut hitam nanti terpotong oleh zoom).
    if abs(rencana.putar) >= 0.02:
        awal.append(f"rotate={rencana.putar:.4f}*PI/180:ow=iw:oh=ih:c=black")

    prefiks = ",".join(awal) if awal else "null"

    # ---- Tahap 2: pas-kan ke kanvas keluaran ---------------------------
    rasio_sumber = info.lebar / info.tinggi if info.tinggi else 0.5625
    rasio_target = lebar / tinggi
    beda_rasio = abs(rasio_sumber - rasio_target) > 0.01
    latar_blur = bool(video_cfg.get("latar_blur", True))
    sigma = max(12, tinggi // 60)

    if beda_rasio and latar_blur:
        # Video tidak berbentuk 9:16 -> isi ruang kosong dengan latar blur.
        graf.append(f"[0:v]{prefiks},split=2[bg0][fg0]")
        graf.append(
            f"[bg0]scale={lebar}:{tinggi}:force_original_aspect_ratio=increase,"
            f"crop={lebar}:{tinggi},gblur=sigma={sigma},eq=brightness=-0.06:saturation=0.85[bg1]"
        )
        graf.append(
            f"[fg0]scale={lebar}:{tinggi}:force_original_aspect_ratio=decrease:flags=lanczos[fg1]"
        )
        graf.append(f"[bg1][fg1]overlay=(W-w)/2:(H-h)/2:format=auto[konten]")
    else:
        graf.append(
            f"[0:v]{prefiks},scale={lebar}:{tinggi}:force_original_aspect_ratio=increase:"
            f"flags=lanczos,crop={lebar}:{tinggi}[konten]"
        )

    arus = "[konten]"

    # ---- Tahap 3: zoom mikro + geser bingkai ---------------------------
    zw, zh = _genap(lebar * rencana.zoom), _genap(tinggi * rencana.zoom)
    if zw > lebar or zh > tinggi:
        x = int(round((zw - lebar) / 2 + rencana.geser_x * lebar))
        y = int(round((zh - tinggi) / 2 + rencana.geser_y * tinggi))
        x = max(0, min(zw - lebar, x))
        y = max(0, min(zh - tinggi, y))
        graf.append(
            f"{arus}scale={zw}:{zh}:flags=lanczos,crop={lebar}:{tinggi}:{x}:{y}[zoom]"
        )
        arus = "[zoom]"

    # ---- Tahap 4: bingkai (konten dikecilkan di atas latar blur) -------
    # Ini mengubah komposisi gambar secara menyeluruh, jadi paling ampuh
    # melawan pencocokan konten - sekaligus terlihat rapi.
    bingkai = float(video_cfg.get("bingkai", 0) or 0)
    if 0.5 < bingkai < 0.999:
        bw, bh = _genap(lebar * bingkai), _genap(tinggi * bingkai)
        graf.append(f"{arus}split=2[bkbg][bkfg]")
        graf.append(f"[bkbg]gblur=sigma={sigma},eq=brightness=-0.10:saturation=0.80[bkbg2]")
        graf.append(f"[bkfg]scale={bw}:{bh}:flags=lanczos[bkfg2]")
        graf.append(f"[bkbg2][bkfg2]overlay=(W-w)/2:(H-h)/2:format=auto[bk]")
        arus = "[bk]"

    # ---- Tahap 5: warna, ketajaman, butiran ----------------------------
    akhir: List[str] = []
    akhir.append(
        "eq="
        f"brightness={rencana.kecerahan:.4f}:"
        f"contrast={rencana.kontras:.4f}:"
        f"saturation={rencana.saturasi:.4f}:"
        f"gamma={rencana.gamma:.4f}"
    )
    if abs(rencana.hue) >= 0.05:
        akhir.append(f"hue=h={rencana.hue:.3f}")
    if rencana.ketajaman > 0.01:
        akhir.append(f"unsharp=5:5:{rencana.ketajaman:.3f}:5:5:0.0")
    if rencana.butiran > 0:
        akhir.append(f"noise=alls={rencana.butiran}:allf=t+u")
    if rencana.vignette > 0:
        sudut = 4.0 + (0.2 - min(0.2, rencana.vignette)) * 30
        akhir.append(f"vignette=a=PI/{sudut:.2f}")

    # ---- Tahap 6: kecepatan & frame rate -------------------------------
    if abs(rencana.kecepatan - 1.0) > 0.0005:
        akhir.append(f"setpts=PTS/{rencana.kecepatan:.6f}")
    akhir.append(f"fps={rencana.fps:.5f}")

    graf.append(f"{arus}" + ",".join(akhir) + "[dasar]")
    arus = "[dasar]"

    # ---- Tahap 7: sisipan produk ---------------------------------------
    # Ditempel setelah semua perubahan gambar, supaya foto produknya tetap
    # tajam dan tidak ikut tercermin, terputar, atau kena butiran.
    if rakitan is not None and rakitan.graf:
        graf.extend(rakitan.graf)
        arus = rakitan.arus

    # ---- Tahap 8: teks ditempel PALING AKHIR ---------------------------
    # supaya tulisan selalu berada di lapisan teratas dan tetap terbaca.
    penutup: List[str] = []
    if berkas_ass:
        bagian = f"ass=filename={_jalur_filter(berkas_ass)}"
        if folder_font:
            bagian += f":fontsdir={_jalur_filter(folder_font)}"
        penutup.append(bagian)
    penutup.append("format=yuv420p")
    graf.append(f"{arus}" + ",".join(penutup) + "[v]")
    return ";".join(graf)


def _rantai_audio(rencana: Rencana, audio_cfg: Dict[str, Any], label_masuk: str,
                  panjangkan: float = 0.0) -> str:
    langkah: List[str] = ["aresample=48000"]

    if abs(rencana.kecepatan - 1.0) > 0.0005:
        langkah.append(f"atempo={rencana.kecepatan:.6f}")

    nada = rencana.nada_suara
    if abs(nada - 1.0) > 0.0005:
        if punya_filter("rubberband"):
            langkah.append(f"rubberband=pitch={nada:.6f}")
        else:
            # Cara cadangan: naikkan sample rate (nada naik) lalu kembalikan tempo.
            langkah.append(f"asetrate=48000*{nada:.6f}")
            langkah.append("aresample=48000")
            langkah.append(f"atempo={1 / nada:.6f}")

    if audio_cfg.get("normalisasi", True):
        langkah.append("loudnorm=I=-14:TP=-1.5:LRA=11")

    langkah.append("aresample=48000:first_pts=0")
    if panjangkan > 0:
        # Keheningan sepanjang endcard. Sengaja dibatasi: apad tanpa batas
        # membuat ffmpeg menahan paket audio tanpa henti sampai kehabisan buffer.
        langkah.append(f"apad=pad_dur={panjangkan + 0.5:.3f}")
    return f"{label_masuk}" + ",".join(langkah) + "[a]"


# ---------------------------------------------------------------------------
def bangun_perintah(permintaan: Permintaan, kerja: str) -> Tuple[List[str], Rencana, InfoVideo, Optional[str], str]:
    pengaturan = permintaan.pengaturan or konfigurasi.muat()
    video_cfg = pengaturan.get("video", {})
    audio_cfg = pengaturan.get("audio", {})
    gaya_cfg = dict(pengaturan.get("gaya", {}))

    info = periksa(permintaan.masukan)
    preset = konfigurasi.ambil_preset(permintaan.preset)
    rencana = buat_rencana(
        info, preset, pengaturan,
        seed=permintaan.seed, varian=permintaan.varian, nama_preset=permintaan.preset,
    )

    lebar, tinggi = _kanvas(info, video_cfg)

    # Durasi sumber setelah dipotong, dan durasi akhir setelah diubah kecepatannya.
    durasi_diketahui = info.durasi > 0.5
    if durasi_diketahui:
        durasi_potong = max(0.3, info.durasi - rencana.potong_awal - rencana.potong_akhir)
    else:
        # ffprobe tidak bisa membaca durasi (video cacat / siaran) - jangan dipotong,
        # biarkan ffmpeg memproses sampai habis.
        rencana.potong_awal = 0.0
        rencana.potong_akhir = 0.0
        durasi_potong = 0.0
    durasi_akhir = (durasi_potong / rencana.kecepatan) if durasi_diketahui else 0.0

    # --- sisipan produk ---------------------------------------------------
    # Dirakit lebih dulu karena endcard menambah durasi, dan labelnya ikut
    # ditulis ke berkas teks yang sama supaya fontnya seragam.
    tambah_senyap = (not info.ada_audio) and bool(audio_cfg.get("tambah_audio_senyap", True))
    indeks_produk_awal = 2 if tambah_senyap else 1

    daftar_produk = list(permintaan.produk or [])
    if daftar_produk:
        daftar_produk = modul_produk.geser_waktu(
            daftar_produk, rencana.potong_awal, rencana.kecepatan, durasi_akhir
        )
    rakitan = modul_produk.rakit(
        daftar_produk, "[dasar]", lebar, tinggi, rencana.fps,
        indeks_produk_awal, durasi_akhir,
    )
    durasi_total = durasi_akhir + rakitan.tambahan_durasi

    # --- teks -------------------------------------------------------------
    font = modul_font.pilih(gaya_cfg.get("font", "Montserrat"), bool(gaya_cfg.get("font_tebal", True)))
    # Kalau durasi tidak diketahui, pakai batas longgar supaya teks tetap tampil.
    durasi_teks = (durasi_total + 1.0) if durasi_diketahui else 36000.0
    pembuat = PembuatASS(
        lebar=lebar, tinggi=tinggi,
        keluarga_font=font.keluarga, gaya=gaya_cfg, durasi=durasi_teks,
    )
    # Teks utama berhenti sebelum endcard, supaya tidak menutupi foto produk.
    batas_teks = (durasi_akhir if rakitan.tambahan_durasi > 0 and durasi_diketahui
                  else durasi_teks)
    if permintaan.judul:
        akhir = permintaan.judul_detik if permintaan.judul_detik > 0 else batas_teks
        pembuat.judul(permintaan.judul, 0.0, min(akhir, batas_teks))
    if permintaan.caption:
        akhir = permintaan.caption_detik if permintaan.caption_detik > 0 else batas_teks
        pembuat.caption(permintaan.caption, 0.0, min(akhir, batas_teks))
    handle = permintaan.handle or gaya_cfg.get("handle", "")
    if handle:
        pembuat.handle(handle)
    if permintaan.subtitle:
        potongan = permintaan.subtitle
        if permintaan.subtitle_waktu_sumber:
            potongan = _geser_waktu(
                potongan, rencana.potong_awal, rencana.kecepatan, durasi_teks
            )
        pembuat.subtitle(potongan)
    if rakitan.label:
        pembuat.label_produk(rakitan.label)

    berkas_ass = None
    folder_font = None
    if pembuat.ada_isi():
        berkas_ass = os.path.join(kerja, "teks.ass")
        with open(berkas_ass, "w", encoding="utf-8") as f:
            f.write(pembuat.render())
        # Salin font ke folder kerja supaya libass pasti menemukannya.
        folder_font = os.path.join(kerja, "font")
        os.makedirs(folder_font, exist_ok=True)
        shutil.copy2(font.berkas, os.path.join(folder_font, os.path.basename(font.berkas)))

    # --- rakit perintah ---------------------------------------------------
    ff = ffmpeg_bin()
    perintah: List[str] = [ff, "-hide_banner", "-loglevel", "error", "-y"]

    if rencana.potong_awal > 0:
        perintah += ["-ss", f"{rencana.potong_awal:.3f}"]
    if durasi_diketahui:
        perintah += ["-t", f"{durasi_potong:.3f}"]
    perintah += ["-i", permintaan.masukan]

    if tambah_senyap:
        panjang_senyap = (durasi_total + 1) if durasi_diketahui else 36000.0
        perintah += ["-f", "lavfi", "-t", f"{panjang_senyap:.3f}", "-i", "anullsrc=r=48000:cl=stereo"]

    perintah += rakitan.masukan

    graf_video = _rantai_video(
        info, rencana, lebar, tinggi, video_cfg, berkas_ass, folder_font, rakitan
    )
    bagian = [graf_video]
    pakai_audio = info.ada_audio or tambah_senyap
    # Endcard memperpanjang gambar; audionya diberi keheningan supaya tidak
    # berhenti di tengah dan tidak memotong video.
    pad_audio = rakitan.tambahan_durasi
    if info.ada_audio:
        bagian.append(_rantai_audio(rencana, audio_cfg, "[0:a]", pad_audio))
    elif tambah_senyap:
        bagian.append("[1:a]aresample=48000[a]")

    perintah += ["-filter_complex", ";".join(bagian), "-map", "[v]"]
    if pakai_audio:
        perintah += ["-map", "[a]"]

    perintah += [
        "-c:v", "libx264",
        "-preset", str(video_cfg.get("preset_encode", "medium")),
        "-crf", str(rencana.crf),
        "-profile:v", "high", "-level", "4.1",
        "-pix_fmt", "yuv420p",
        "-g", str(rencana.gop), "-keyint_min", str(max(2, rencana.gop // 2)),
        "-sc_threshold", "0",
        "-r", f"{rencana.fps:.5f}",
    ]
    if pakai_audio:
        perintah += ["-c:a", "aac", "-b:a", str(audio_cfg.get("bitrate", "128k")), "-ar", "48000", "-ac", "2"]
    if tambah_senyap:
        perintah += ["-shortest"]
    elif rakitan.tambahan_durasi > 0:
        # Batasi panjang keluaran secara tegas supaya keheningan tambahan
        # tidak membuat berkasnya lebih panjang dari gambarnya.
        perintah += ["-t", f"{durasi_total:.3f}"]

    perintah += [
        "-map_metadata", "-1",
        "-map_chapters", "-1",
        "-movflags", "+faststart",
        "-metadata", f"title={permintaan.judul or ''}",
        "-metadata", f"artist={handle or ''}",
        "-metadata", "comment=",
        permintaan.keluaran,
    ]
    return perintah, rencana, info, berkas_ass, font.label


def proses(permintaan: Permintaan, kabar: Callable[[int], None] | None = None) -> Hasil:
    """Edit satu video dari awal sampai jadi."""
    mulai = time.time()
    os.makedirs(os.path.dirname(os.path.abspath(permintaan.keluaran)) or ".", exist_ok=True)

    kerja = tempfile.mkdtemp(prefix="vidclean_")
    try:
        perintah, rencana, asal, berkas_ass, label_font = bangun_perintah(permintaan, kerja)
        perkiraan = (
            max(0.3, asal.durasi - rencana.potong_awal - rencana.potong_akhir) / rencana.kecepatan
            if asal.durasi > 0.5 else 0.0
        )
        jalankan_dengan_progres(perintah, perkiraan, kabar)
        hasil_info = periksa(permintaan.keluaran)
    finally:
        shutil.rmtree(kerja, ignore_errors=True)

    return Hasil(
        keluaran=permintaan.keluaran,
        rencana=rencana,
        asal=asal,
        hasil=hasil_info,
        perintah=perintah,
        lama_proses=round(time.time() - mulai, 2),
        berkas_ass=berkas_ass,
        font_dipakai=label_font,
    )
