"""Inti aplikasi: merakit perintah ffmpeg dan mengeksekusi proses edit.

Versi 2 menambahkan tiga mekanisme yang jauh lebih sulit dinormalkan oleh
sistem pencocok konten:

  * gerak dinamis  - rotasi & pergeseran bingkai berayun sangat pelan,
                     sehingga TIAP FRAME punya geometri unik
  * kecepatan berlapis - video dibagi beberapa babak dengan kecepatan
                     berbeda, sehingga penyelarasan waktu jadi non-linear
  * pengulangan otomatis - hasil diukur dengan pengukur adversarial; kalau
                     skornya di bawah target, diedit ulang lebih kuat
"""

from __future__ import annotations

import dataclasses
import math
import os
import shutil
import tempfile
import time
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

from . import config as konfigurasi
from . import fonts as modul_font
from .ffmpeg import ffmpeg_bin, jalankan, jalankan_dengan_progres, punya_filter
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
    hook_mulai: float = 0.0       # cold-open: ulangi cuplikan menarik di awal
    hook_lama: float = 0.0


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


def _peta_waktu(segmen: Sequence[Tuple[float, float, float]]) -> Callable[[float], float]:
    """Fungsi pemetaan waktu sumber (setelah potong awal) -> waktu hasil.

    Dengan kecepatan berlapis, pemetaan ini piecewise-linear - satu babak bisa
    lebih cepat dari babak lain, jadi pembagian sederhana tidak lagi benar.
    """
    if not segmen:
        return lambda t: max(0.0, t)
    tabel: List[Tuple[float, float, float, float]] = []
    akumulasi = 0.0
    for t0, t1, v in segmen:
        tabel.append((t0, t1, v, akumulasi))
        akumulasi += (t1 - t0) / v
    total = akumulasi

    def peta(t: float) -> float:
        if t <= tabel[0][0]:
            return 0.0
        for t0, t1, v, acc in tabel:
            if t < t1:
                return acc + (t - t0) / v
        return total

    return peta


def _geser_waktu(
    potongan: Sequence[Tuple[float, float, str]],
    potong_awal: float,
    peta: Callable[[float], float],
    batas: float,
) -> List[Tuple[float, float, str]]:
    """Pindahkan waktu subtitle dari lini masa video asli ke lini masa hasil."""
    hasil: List[Tuple[float, float, str]] = []
    for mulai, selesai, teks in potongan:
        m = peta(float(mulai) - potong_awal)
        s = peta(float(selesai) - potong_awal)
        if s <= 0 or m >= batas or s - m < 0.05:
            continue
        hasil.append((max(0.0, m), min(batas, s), teks))
    return hasil


def _kanvas(info: InfoVideo, video_cfg: Dict[str, Any]) -> Tuple[int, int]:
    rasio = str(video_cfg.get("rasio", "9:16")).strip().lower()
    if rasio in ("asli", "sama", "original", "source"):
        lebar, tinggi = _genap(info.lebar), _genap(info.tinggi)
        maks = 1920
        if max(lebar, tinggi) > maks:
            skala = maks / max(lebar, tinggi)
            lebar, tinggi = _genap(lebar * skala), _genap(tinggi * skala)
        return lebar, tinggi
    return _genap(video_cfg.get("lebar", 1080)), _genap(video_cfg.get("tinggi", 1920))


# ---------------------------------------------------------------------------
def _rantai_ramp(rencana: Rencana, ada_audio: bool) -> Tuple[List[str], str, str, bool]:
    """Bangun tahap kecepatan berlapis.

    Mengembalikan (potongan_graf, label_video, label_audio, ramp_aktif).
    Kalau ramp tidak dipakai, label kembali ke [0:v]/[0:a] dan kecepatan
    ditangani cara lama (setpts/atempo konstan di rantai berikutnya).
    """
    segmen = rencana.segmen
    if not segmen:
        return [], "[0:v]", "[0:a]", False

    n = len(segmen)
    graf: List[str] = []

    if n == 1:
        t0, t1, v = segmen[0]
        if abs(v - 1.0) <= 0.0005:
            return [], "[0:v]", "[0:a]", False
        graf.append(f"[0:v]setpts=PTS/{v:.6f}[vsrc]")
        if ada_audio:
            graf.append(f"[0:a]atempo={v:.6f}[asrc]")
        return graf, "[vsrc]", "[asrc]", True

    keluar_v = "".join(f"[rv{i}]" for i in range(n))
    graf.append(f"[0:v]split={n}{keluar_v}")
    for i, (t0, t1, v) in enumerate(segmen):
        graf.append(
            f"[rv{i}]trim=start={t0:.3f}:end={t1:.3f},"
            f"setpts=(PTS-STARTPTS)/{v:.6f}[rs{i}]"
        )
    graf.append("".join(f"[rs{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[vsrc]")

    if ada_audio:
        keluar_a = "".join(f"[ra{i}]" for i in range(n))
        graf.append(f"[0:a]asplit={n}{keluar_a}")
        for i, (t0, t1, v) in enumerate(segmen):
            graf.append(
                f"[ra{i}]atrim=start={t0:.3f}:end={t1:.3f},"
                f"asetpts=PTS-STARTPTS,atempo={v:.6f}[rt{i}]"
            )
        graf.append("".join(f"[rt{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[asrc]")

    return graf, "[vsrc]", "[asrc]", True


def _rantai_video(
    info: InfoVideo,
    rencana: Rencana,
    lebar: int,
    tinggi: int,
    video_cfg: Dict[str, Any],
    berkas_ass: Optional[str],
    folder_font: Optional[str],
    rakitan: Optional["modul_produk.Rakitan"] = None,
    label_sumber: str = "[0:v]",
    ramp_aktif: bool = False,
) -> str:
    """Bangun filtergraph video, dari label_sumber sampai label [v]."""
    graf: List[str] = []

    # ---- Tahap 1: perlakuan pada gambar sumber -------------------------
    awal: List[str] = []

    # Buang area atas (watermark/logo yang menempel) - sebelum apa pun.
    pa = float(video_cfg.get("potong_atas", 0) or 0)
    pa = max(0.0, min(0.25, pa))
    if pa > 0.005:
        awal.append(
            f"crop=iw:floor(ih*{1 - pa:.5f}/2)*2:0:floor(ih*{pa:.5f})"
        )

    p = rencana.potong_tepi
    if p > 0:
        sisa = 1 - 2 * p
        awal.append(
            f"crop=floor(iw*{sisa:.5f}/2)*2:floor(ih*{sisa:.5f}/2)*2:"
            f"floor(iw*{p:.5f}):floor(ih*{p:.5f})"
        )

    if rencana.cermin:
        awal.append("hflip")

    # Putar: statis + ayunan dinamis (radian, dievaluasi per frame lewat 't').
    rad_statis = rencana.putar * math.pi / 180.0
    rad_ayun = rencana.drift_putar_amp * math.pi / 180.0 if rencana.dinamis else 0.0
    if abs(rad_statis) >= 0.0003 or rad_ayun > 0.0003:
        if rad_ayun > 0.0003:
            ekspresi = (
                f"{rad_statis:.6f}+{rad_ayun:.6f}"
                f"*sin(2*PI*t/{rencana.drift_putar_per:.2f}+{rencana.drift_putar_fase:.3f})"
            )
        else:
            ekspresi = f"{rad_statis:.6f}"
        awal.append(f"rotate=a='{ekspresi}':ow=iw:oh=ih:c=black")

    prefiks = ",".join(awal) if awal else "null"

    # ---- Tahap 2: pas-kan ke kanvas keluaran ---------------------------
    rasio_sumber = info.lebar / info.tinggi if info.tinggi else 0.5625
    rasio_target = lebar / tinggi
    beda_rasio = abs(rasio_sumber - rasio_target) > 0.01
    latar_blur = bool(video_cfg.get("latar_blur", True))
    sigma = max(12, tinggi // 60)

    if beda_rasio and latar_blur:
        graf.append(f"{label_sumber}{prefiks},split=2[bg0][fg0]")
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
            f"{label_sumber}{prefiks},scale={lebar}:{tinggi}:force_original_aspect_ratio=increase:"
            f"flags=lanczos,crop={lebar}:{tinggi}[konten]"
        )

    arus = "[konten]"

    # ---- Tahap 3: zoom mikro + geser bingkai (dengan ayunan dinamis) ---
    zw, zh = _genap(lebar * rencana.zoom), _genap(tinggi * rencana.zoom)
    if zw > lebar or zh > tinggi:
        x0 = int(round((zw - lebar) / 2 + rencana.geser_x * lebar))
        y0 = int(round((zh - tinggi) / 2 + rencana.geser_y * tinggi))
        x0 = max(0, min(zw - lebar, x0))
        y0 = max(0, min(zh - tinggi, y0))

        ax = ay = 0.0
        if rencana.dinamis:
            ax = min(rencana.drift_x_amp * lebar, max(0, x0 - 1), max(0, zw - lebar - x0 - 1))
            ay = min(rencana.drift_y_amp * tinggi, max(0, y0 - 1), max(0, zh - tinggi - y0 - 1))

        if ax >= 0.5 or ay >= 0.5:
            ex = (f"'{x0}+{ax:.2f}*sin(2*PI*t/{rencana.drift_x_per:.2f}"
                  f"+{rencana.drift_x_fase:.3f})'") if ax >= 0.5 else str(x0)
            ey = (f"'{y0}+{ay:.2f}*sin(2*PI*t/{rencana.drift_y_per:.2f}"
                  f"+{rencana.drift_y_fase:.3f})'") if ay >= 0.5 else str(y0)
        else:
            ex, ey = str(x0), str(y0)

        graf.append(
            f"{arus}scale={zw}:{zh}:flags=lanczos,crop={lebar}:{tinggi}:{ex}:{ey}[zoom]"
        )
        arus = "[zoom]"

    # ---- Tahap 4: bingkai (konten dikecilkan di atas latar) ------------
    bingkai = float(video_cfg.get("bingkai", 0) or 0)
    if 0.5 < bingkai < 0.999:
        # Sisi konten sedikit dipipihkan (1.5%) - tak terlihat mata, tapi
        # menggeser kisi geometri yang dipakai sidik jari gambar.
        bw, bh = _genap(lebar * bingkai * 0.985), _genap(tinggi * bingkai)
        gaya_latar = str(video_cfg.get("bingkai_latar", "blur")).lower()
        if gaya_latar == "gelap":
            # Gradasi gelap netral: area tepi sama sekali tidak berkorelasi
            # dengan video asli - paling ampuh untuk konten yang seragam.
            graf.append(
                f"gradients=s={lebar}x{tinggi}:rate={rencana.fps:.5f}:"
                f"c0=0x0d0d12:c1=0x1c1c24:"
                f"x0={lebar // 2}:y0=0:x1={lebar // 2}:y1={tinggi}:d=36000[bkbg2]"
            )
            graf.append(f"{arus}scale={bw}:{bh}:flags=lanczos[bkfg2]")
            graf.append(
                f"[bkbg2][bkfg2]overlay=(W-w)/2:(H-h)/2:format=auto:shortest=1[bk]"
            )
        else:
            graf.append(f"{arus}split=2[bkbg][bkfg]")
            graf.append(
                f"[bkbg]gblur=sigma={int(sigma * 1.6)},eq=brightness=-0.16:saturation=0.72[bkbg2]"
            )
            graf.append(f"[bkfg]scale={bw}:{bh}:flags=lanczos[bkfg2]")
            graf.append(f"[bkbg2][bkfg2]overlay=(W-w)/2:(H-h)/2:format=auto[bk]")
        arus = "[bk]"

    # ---- Tahap 4b: potongan zoom (jump-cut) ----------------------------
    # Babak terpilih ditampilkan lebih dekat; tiap pergantian babak framing
    # berganti - pola editan potong-sambung yang lazim dibuat manual.
    if rencana.punch_kuat > 1.01 and rencana.punch_babak and rencana.segmen:
        akumulasi = 0.0
        batas_babak: List[Tuple[float, float]] = []
        for t0, t1, v in rencana.segmen:
            panjang = (t1 - t0) / v
            batas_babak.append((akumulasi, akumulasi + panjang))
            akumulasi += panjang
        rentang_punch = [batas_babak[i] for i in rencana.punch_babak if i < len(batas_babak)]
        if rentang_punch:
            aktif = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in rentang_punch)
            pw, ph = _genap(lebar * rencana.punch_kuat), _genap(tinggi * rencana.punch_kuat)
            graf.append(f"{arus}split=2[pn0][pn1]")
            graf.append(
                f"[pn1]scale={pw}:{ph}:flags=lanczos,crop={lebar}:{tinggi}[pn2]"
            )
            graf.append(
                f"[pn0][pn2]overlay=0:0:format=auto:enable='{aktif}'[punch]"
            )
            arus = "[punch]"

    # ---- Tahap 5: warna, kurva, ketajaman, butiran ---------------------
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

    # Grading "look" - nada warna seragam yang dipilih pengguna, supaya semua
    # video di akun terasa satu gaya. Diterapkan SEBELUM kurva acak.
    look = str(video_cfg.get("look", "")).lower()
    if look == "bersih":
        akhir.append("curves=master='0/0.015 0.5/0.52 1/0.995'")
        akhir.append("eq=saturation=1.05:contrast=1.02")
    elif look == "hangat":
        akhir.append("colortemperature=temperature=5900")
        akhir.append("curves=master='0/0.01 0.5/0.515 1/1'")
        akhir.append("eq=saturation=1.03")
    elif look == "sinematik":
        akhir.append("colorbalance=bs=0.05:bh=-0.02:rh=0.02")
        akhir.append("curves=master='0/0.03 0.5/0.5 1/0.97'")
        akhir.append("eq=saturation=0.93:contrast=1.06")

    # Grading kurva: menggeser histogram warna secara non-linear.
    if abs(rencana.kurva_m) + abs(rencana.kurva_r) + abs(rencana.kurva_g) + abs(rencana.kurva_b) > 0.001:
        def titik(geser: float) -> str:
            tengah = min(0.62, max(0.38, 0.5 + geser))
            return f"0/0 0.5/{tengah:.4f} 1/1"
        akhir.append(
            f"curves=master='{titik(rencana.kurva_m)}':red='{titik(rencana.kurva_r)}':"
            f"green='{titik(rencana.kurva_g)}':blue='{titik(rencana.kurva_b)}'"
        )

    if rencana.ketajaman > 0.01:
        akhir.append(f"unsharp=5:5:{rencana.ketajaman:.3f}:5:5:0.0")
    if rencana.butiran > 0:
        akhir.append(f"noise=alls={rencana.butiran}:allf=t+u")
    if rencana.vignette > 0:
        sudut = 4.0 + (0.2 - min(0.2, rencana.vignette)) * 30
        akhir.append(f"vignette=a=PI/{sudut:.2f}")

    # ---- Tahap 6: kecepatan (hanya kalau ramp tidak menanganinya) ------
    if not ramp_aktif and abs(rencana.kecepatan - 1.0) > 0.0005:
        akhir.append(f"setpts=PTS/{rencana.kecepatan:.6f}")
    akhir.append(f"fps={rencana.fps:.5f}")

    graf.append(f"{arus}" + ",".join(akhir) + "[dasar]")
    arus = "[dasar]"

    # ---- Tahap 7: sisipan produk ---------------------------------------
    if rakitan is not None and rakitan.graf:
        graf.extend(rakitan.graf)
        arus = rakitan.arus

    # ---- Tahap 8: teks ditempel PALING AKHIR ---------------------------
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
                  panjangkan: float = 0.0, ramp_aktif: bool = False) -> str:
    langkah: List[str] = ["aresample=48000"]

    if not ramp_aktif and abs(rencana.kecepatan - 1.0) > 0.0005:
        langkah.append(f"atempo={rencana.kecepatan:.6f}")

    nada = rencana.nada_suara
    if abs(nada - 1.0) > 0.0005:
        if punya_filter("rubberband"):
            langkah.append(f"rubberband=pitch={nada:.6f}")
        else:
            langkah.append(f"asetrate=48000*{nada:.6f}")
            langkah.append("aresample=48000")
            langkah.append(f"atempo={1 / nada:.6f}")

    # EQ acak: menggeser spektrum suara tanpa terdengar (maks +-1.2 dB).
    for f, g in (rencana.eq_jalur or []):
        langkah.append(f"equalizer=f={int(f)}:t=q:w=1.3:g={g:.2f}")

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
    video_cfg = dict(pengaturan.get("video", {}))
    audio_cfg = pengaturan.get("audio", {})
    gaya_cfg = dict(pengaturan.get("gaya", {}))

    info = periksa(permintaan.masukan)
    preset = konfigurasi.ambil_preset(permintaan.preset)
    if permintaan.hook_lama > 0:
        # Cold-open sudah mengacak bagian awal; jangan sampai potongan awal
        # justru memakan cuplikan pembukanya.
        preset["potong_awal"] = (0.0, 0.0)
    rencana = buat_rencana(
        info, preset, pengaturan,
        seed=permintaan.seed, varian=permintaan.varian, nama_preset=permintaan.preset,
    )

    # Preset boleh membawa bingkai bawaan (mis. maksimal), kecuali sudah diatur.
    if not float(video_cfg.get("bingkai", 0) or 0):
        video_cfg["bingkai"] = float(preset.get("bingkai_bawaan", 0) or 0)
    if not video_cfg.get("bingkai_latar"):
        video_cfg["bingkai_latar"] = preset.get("bingkai_latar", "blur")
    video_cfg["look"] = str(gaya_cfg.get("look", "") or "")

    lebar, tinggi = _kanvas(info, video_cfg)

    # Durasi sumber setelah dipotong, dan durasi akhir setelah diubah kecepatannya.
    durasi_diketahui = info.durasi > 0.5
    if durasi_diketahui:
        durasi_potong = max(0.3, info.durasi - rencana.potong_awal - rencana.potong_akhir)
    else:
        rencana.potong_awal = 0.0
        rencana.potong_akhir = 0.0
        rencana.segmen = []
        durasi_potong = 0.0

    if durasi_diketahui:
        durasi_akhir = rencana.durasi_keluar or (durasi_potong / rencana.kecepatan)
    else:
        durasi_akhir = 0.0

    peta = _peta_waktu(rencana.segmen) if rencana.segmen else (
        lambda t, v=rencana.kecepatan: max(0.0, t) / v
    )

    # --- sisipan produk ---------------------------------------------------
    tambah_senyap = (not info.ada_audio) and bool(audio_cfg.get("tambah_audio_senyap", True))
    indeks_produk_awal = 2 if tambah_senyap else 1

    daftar_produk = list(permintaan.produk or [])
    if daftar_produk:
        daftar_produk = modul_produk.geser_waktu(
            daftar_produk, rencana.potong_awal, peta, durasi_akhir
        )
    rakitan = modul_produk.rakit(
        daftar_produk, "[dasar]", lebar, tinggi, rencana.fps,
        indeks_produk_awal, durasi_akhir,
    )
    durasi_total = durasi_akhir + rakitan.tambahan_durasi

    # --- teks -------------------------------------------------------------
    font = modul_font.pilih(gaya_cfg.get("font", "Montserrat"), bool(gaya_cfg.get("font_tebal", True)))
    durasi_teks = (durasi_total + 1.0) if durasi_diketahui else 36000.0
    pembuat = PembuatASS(
        lebar=lebar, tinggi=tinggi,
        keluarga_font=font.keluarga, gaya=gaya_cfg, durasi=durasi_teks,
    )
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
            potongan = _geser_waktu(potongan, rencana.potong_awal, peta, durasi_teks)
        pembuat.subtitle(potongan)
    if rakitan.label:
        pembuat.label_produk(rakitan.label)

    berkas_ass = None
    folder_font = None
    if pembuat.ada_isi():
        berkas_ass = os.path.join(kerja, "teks.ass")
        with open(berkas_ass, "w", encoding="utf-8") as f:
            f.write(pembuat.render())
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

    # Kecepatan berlapis dirakit paling depan; rantai lain menyambung darinya.
    graf_ramp, label_v, label_a, ramp_aktif = _rantai_ramp(rencana, info.ada_audio)

    graf_video = _rantai_video(
        info, rencana, lebar, tinggi, video_cfg, berkas_ass, folder_font, rakitan,
        label_sumber=label_v, ramp_aktif=ramp_aktif,
    )
    bagian = graf_ramp + [graf_video]
    pakai_audio = info.ada_audio or tambah_senyap
    pad_audio = rakitan.tambahan_durasi
    if info.ada_audio:
        bagian.append(_rantai_audio(rencana, audio_cfg, label_a if ramp_aktif else "[0:a]",
                                    pad_audio, ramp_aktif))
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


# ---------------------------------------------------------------------------
def _pra_hook(masukan: str, mulai: float, lama: float, kerja: str) -> str:
    """Cold-open: cuplikan menarik dari tengah video diulang di detik pertama.

    Mengubah struktur lini masa secara nyata (bagian awal video tidak lagi
    sejajar dengan sumber) sekaligus gaya edit yang lazim di TikTok.
    """
    info = periksa(masukan)
    if info.durasi > 0.5:
        mulai = max(0.0, min(mulai, info.durasi - 0.5))
        lama = max(0.4, min(lama, info.durasi - mulai, 5.0))
    tujuan = os.path.join(kerja, "hook.mp4")

    if info.ada_audio:
        graf = (
            f"[0:v]split=2[va][vb];"
            f"[va]trim=start={mulai:.3f}:end={mulai + lama:.3f},setpts=PTS-STARTPTS[hv];"
            f"[vb]setpts=PTS-STARTPTS[fv];"
            f"[0:a]asplit=2[aa][ab];"
            f"[aa]atrim=start={mulai:.3f}:end={mulai + lama:.3f},asetpts=PTS-STARTPTS[ha];"
            f"[ab]asetpts=PTS-STARTPTS[fa];"
            f"[hv][ha][fv][fa]concat=n=2:v=1:a=1[v][a]"
        )
        peta = ["-map", "[v]", "-map", "[a]", "-c:a", "aac", "-b:a", "192k"]
    else:
        graf = (
            f"[0:v]split=2[va][vb];"
            f"[va]trim=start={mulai:.3f}:end={mulai + lama:.3f},setpts=PTS-STARTPTS[hv];"
            f"[vb]setpts=PTS-STARTPTS[fv];"
            f"[hv][fv]concat=n=2:v=1:a=0[v]"
        )
        peta = ["-map", "[v]"]

    jalankan(
        [ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y",
         "-i", masukan, "-filter_complex", graf, *peta,
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
         "-pix_fmt", "yuv420p", tujuan],
        timeout=1800,
    )
    return tujuan


def proses(permintaan: Permintaan, kabar: Callable[[int], None] | None = None) -> Hasil:
    """Edit satu video dari awal sampai jadi."""
    mulai = time.time()
    os.makedirs(os.path.dirname(os.path.abspath(permintaan.keluaran)) or ".", exist_ok=True)

    kerja = tempfile.mkdtemp(prefix="vidclean_")
    try:
        # Simpan info video ASLI - kalau cold-open dipakai, bangun_perintah bekerja
        # pada berkas antara, tapi laporan & pengukuran skor harus tetap merujuk
        # ke video aslinya.
        asal_asli = periksa(permintaan.masukan)

        if permintaan.hook_lama > 0:
            sumber_baru = _pra_hook(
                permintaan.masukan, permintaan.hook_mulai, permintaan.hook_lama, kerja
            )
            # Seluruh isi asli kini mundur sejauh hook_lama; waktu subtitle dan
            # sisipan produk (yang ditulis pada lini masa asli) ikut digeser.
            geser = permintaan.hook_lama
            subtitle_baru = permintaan.subtitle
            if permintaan.subtitle_waktu_sumber and permintaan.subtitle:
                subtitle_baru = [(m + geser, t + geser, teks)
                                 for m, t, teks in permintaan.subtitle]
            produk_baru = []
            for aset in (permintaan.produk or []):
                salinan = modul_produk.Aset(**{**aset.__dict__})
                if salinan.mode != "endcard":
                    salinan.mulai += geser
                produk_baru.append(salinan)
            permintaan = dataclasses.replace(
                permintaan, masukan=sumber_baru,
                subtitle=subtitle_baru, produk=produk_baru,
            )

        perintah, rencana, asal, berkas_ass, label_font = bangun_perintah(permintaan, kerja)
        asal = asal_asli
        if asal.durasi > 0.5:
            perkiraan = rencana.durasi_keluar or (
                max(0.3, asal.durasi - rencana.potong_awal - rencana.potong_akhir)
                / rencana.kecepatan
            )
        else:
            perkiraan = 0.0
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


# ---------------------------------------------------------------------------
def proses_hingga_target(
    permintaan: Permintaan,
    kabar: Callable[[int], None] | None = None,
    target: Optional[float] = None,
):
    """Edit video, ukur skornya, dan ulangi lebih kuat sampai target tercapai.

    Mengembalikan (Hasil, Kemiripan | None, catatan: list[str]).
    Catatan: skor adalah tolok ukur internal (adversarial), bukan jaminan
    terhadap sistem deteksi platform mana pun.
    """
    import copy

    from .similarity import bandingkan

    pengaturan = permintaan.pengaturan or konfigurasi.muat()
    if target is None:
        target = float(pengaturan.get("anti_duplikat", {}).get("target_skor", 80) or 0)
    if target <= 0:
        return proses(permintaan, kabar), None, []

    upaya = [
        {},
        {"preset": "maksimal", "varian_tambah": 101},
        {"preset": "maksimal", "varian_tambah": 202, "hook": True, "potong_tepi": 0.045},
    ]

    # Cold-open menggeser seluruh lini masa - hanya dipakai kalau videonya
    # cukup panjang dan pengguna belum memasang hook sendiri.
    try:
        durasi_sumber = periksa(permintaan.masukan).durasi
    except Exception:  # noqa: BLE001
        durasi_sumber = 0.0
    boleh_hook = permintaan.hook_lama <= 0 and durasi_sumber > 6.0

    catatan: List[str] = []
    terbaik = None       # (Hasil, Kemiripan, path_sementara)
    sementara: List[str] = []
    galat_terakhir: Optional[Exception] = None

    try:
        for nomor, u in enumerate(upaya, start=1):
            pengaturan_u = copy.deepcopy(pengaturan)
            if "bingkai" in u:
                pengaturan_u.setdefault("video", {})["bingkai"] = u["bingkai"]
            if "potong_tepi" in u:
                pengaturan_u.setdefault("anti_duplikat", {})["potong_tepi"] = u["potong_tepi"]

            path_u = f"{permintaan.keluaran}.coba{nomor}.mp4"
            sementara.append(path_u)
            ganti = dict(
                keluaran=path_u,
                preset=u.get("preset", permintaan.preset),
                varian=permintaan.varian + u.get("varian_tambah", 0),
                pengaturan=pengaturan_u,
            )
            if u.get("hook") and boleh_hook:
                ganti["hook_mulai"] = round(durasi_sumber * 0.38, 2)
                ganti["hook_lama"] = 1.6
            p_u = dataclasses.replace(permintaan, **ganti)

            try:
                hasil = proses(p_u, kabar)
            except Exception as galat:  # noqa: BLE001
                # Satu percobaan gagal tidak boleh membuang hasil percobaan
                # lain yang sudah jadi.
                catatan.append(f"Percobaan {nomor} gagal: {galat}")
                galat_terakhir = galat
                continue
            skor = bandingkan(hasil.asal, hasil.hasil, hasil.rencana)
            tanda_hook = " + cold-open" if p_u.hook_lama > 0 and permintaan.hook_lama <= 0 else ""
            catatan.append(
                f"Percobaan {nomor} (preset {p_u.preset}{tanda_hook}): skor {skor.skor}/100"
            )

            if terbaik is None or skor.skor > terbaik[1].skor:
                terbaik = (hasil, skor, path_u)
            if skor.skor >= target:
                break

        if terbaik is None:
            raise galat_terakhir or RuntimeError("Semua percobaan gagal")
        hasil, skor, path_terbaik = terbaik
        if skor.skor < target:
            catatan.append(
                f"Target {target:.0f} belum tercapai; dipakai percobaan terbaik ({skor.skor}/100)."
            )
        return hasil, skor, catatan
    finally:
        # Hasil terbaik SELALU dipindahkan ke tujuan (juga saat percobaan lain
        # melempar error), dan semua berkas percobaan lain dibersihkan.
        if terbaik is not None and os.path.exists(terbaik[2]):
            try:
                shutil.move(terbaik[2], permintaan.keluaran)
                terbaik[0].keluaran = permintaan.keluaran
                terbaik[0].hasil.berkas = permintaan.keluaran
            except OSError:
                pass
        for path in sementara:
            if os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    pass
