"""Hapus watermark merek yang ditempel di atas video.

Kenapa ini penting: watermark milik kreator atau merek lain adalah salah satu
pemicu paling langsung untuk penandaan "konten tidak orisinal" - platform bisa
membacanya dengan OCR dan langsung tahu videonya berasal dari sumber lain.

Dua hal yang TIDAK ditangani modul ini, dan memang tidak seharusnya:

  * merek yang tercetak di produknya sendiri (nama di dial jam, huruf timbul
    di kulit tas). Itu bagian fisik barang, bukan tempelan. Mengaburkannya
    merusak shot produk dan menyembunyikan barang yang justru sedang dijual.
  * teks isi dari kreator ("Stop scrolling!", "POV: ..."). Itu urusan
    teksvideo.py.

Cara kerjanya dua tahap:

  1. `delogo` mengangkat logonya. Filter ini menebak isi kotak dari piksel di
     tepinya.
  2. blur bertepi-memudar menutup bekas tahap pertama. Tahap ini perlu karena
     tebakan delogo meleset pada latar bergradasi - gradasi berubah jadi pita
     persegi yang justru lebih mencolok daripada logonya. Alpha yang naik
     landai dari tepi membuat tambalan itu terbaca sebagai blur kedalaman
     biasa, bukan sebagai tambalan.

Posisi watermark tidak selalu tetap: pada video yang disusun dari beberapa
klip, logonya bisa pindah antar scene. Karena itu kotaknya dicari per waktu,
lalu delogo dipasang dengan `enable=between(t,...)` supaya hanya aktif saat
logonya benar-benar ada di layar.

PENTING: jalankan ini pada video SUMBER, sebelum urutan scene diacak. Waktu
hasil deteksi mengacu ke berkas sumber; begitu scene dipindah, waktu itu
tidak lagi menunjuk ke tempat yang benar.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass, field
from typing import List, Optional, Sequence, Set, Tuple

from .ffmpeg import ffmpeg_bin, jalankan
from .probe import periksa


@dataclass
class Temuan:
    """Satu kelompok deteksi: satu logo, hidup dari t0 sampai t1."""
    t0: float
    t1: float
    x0: int
    y0: int
    x1: int
    y1: int
    teks: Set[str] = field(default_factory=set)


def tersedia() -> bool:
    return shutil.which("tesseract") is not None


def cari(
    berkas: str,
    kata: Sequence[str],
    langkah: float = 0.4,
    pita_x: Tuple[float, float] = (0.20, 0.80),
    jarak_y: int = 90,
    jeda: float = 2.0,
) -> List[Temuan]:
    """Cari kotak watermark lewat OCR, satu cuplikan tiap `langkah` detik.

    `kata` adalah pola regex nama merek yang dicari (huruf besar), mis.
    ``[r"MOS+D?OO?M", "MOSSD"]`` - ditulis longgar karena OCR sering meleset
    satu-dua huruf pada teks tipis.

    `pita_x` mempersempit pencarian ke pita mendatar tertentu (pecahan dari
    lebar). Watermark merek hampir selalu duduk di tengah atau di satu sudut,
    jadi mempersempit pita membuat OCR jauh lebih cepat sekaligus mengurangi
    salah tangkap dari teks lain di dalam gambar.
    """
    if not tersedia():
        return []
    info = periksa(berkas)
    x0 = int(info.lebar * pita_x[0])
    x1 = int(info.lebar * pita_x[1])
    lebar = max(2, (x1 - x0) // 2 * 2)

    pola = re.compile("|".join(kata))
    kerja = tempfile.mkdtemp(prefix="vidclean_wm_")
    mentah: List[Tuple[float, int, int, int, int, str]] = []
    try:
        # Satu panggilan ffmpeg untuk semua cuplikan; diperbesar 3x supaya
        # teks tipis masih terbaca tesseract.
        subprocess.run(
            [ffmpeg_bin(), "-v", "error", "-y", "-i", berkas,
             "-vf", f"fps={1 / langkah:.4f},crop={lebar}:{info.tinggi}:{x0}:0,"
                    f"scale={lebar * 3}:{info.tinggi * 3}:flags=lanczos",
             os.path.join(kerja, "f%04d.png")],
            check=True, capture_output=True, timeout=1800,
        )
        for nama in sorted(os.listdir(kerja)):
            if not nama.endswith(".png"):
                continue
            t = (int(nama[1:5]) - 1) * langkah
            hasil = subprocess.run(
                ["tesseract", os.path.join(kerja, nama), "stdout", "tsv"],
                capture_output=True, text=True, timeout=120,
            ).stdout
            for baris in hasil.splitlines()[1:]:
                kolom = baris.split("\t")
                if len(kolom) < 12:
                    continue
                teks = kolom[11].strip().upper()
                if not pola.search(teks):
                    continue
                try:
                    x, y, w, h = (int(kolom[6]), int(kolom[7]),
                                  int(kolom[8]), int(kolom[9]))
                except ValueError:
                    continue
                mentah.append((t, x0 + x // 3, y // 3, w // 3, h // 3, teks))
    except (subprocess.SubprocessError, OSError):
        return []
    finally:
        shutil.rmtree(kerja, ignore_errors=True)

    return _gabung(mentah, jarak_y, jeda)


def _gabung(mentah, jarak_y: int, jeda: float) -> List[Temuan]:
    """Satukan deteksi yang berdekatan waktu dan tingginya jadi satu kelompok."""
    hasil: List[Temuan] = []
    for t, x, y, w, h, teks in sorted(mentah):
        pas = None
        for g in hasil:
            if abs(g.y0 - y) < jarak_y and t - g.t1 <= jeda:
                pas = g
                break
        if pas is None:
            hasil.append(Temuan(t, t, x, y, x + w, y + h, {teks}))
        else:
            pas.t1 = t
            pas.x0 = min(pas.x0, x)
            pas.y0 = min(pas.y0, y)
            pas.x1 = max(pas.x1, x + w)
            pas.y1 = max(pas.y1, y + h)
            pas.teks.add(teks)
    return hasil


def _kotak(g: Temuan, lebar: int, tinggi: int,
           atas: int = 78, samping: int = 16, bawah: int = 14) -> Tuple[int, int, int, int]:
    """Kotak akhir, diberi ruang ke atas untuk monogram di atas wordmark.

    OCR hanya menangkap bagian yang berupa huruf. Lambang merek biasanya
    duduk tepat di atasnya dan tidak terbaca, jadi kotaknya ditarik jauh ke
    atas - kalau tidak, lambangnya tertinggal di layar.
    """
    x = max(1, g.x0 - samping)
    y = max(1, g.y0 - atas)
    w = min(lebar - x - 1, (g.x1 - g.x0) + samping * 2)
    h = min(tinggi - y - 1, (g.y1 - g.y0) + atas + bawah)
    return x, y, w, h


def hapus(
    berkas: str,
    keluaran: str,
    temuan: Sequence[Temuan],
    crf: int = 16,
    bulu: int = 22,
    sigma: float = 9.0,
    ambang_waktu: Tuple[float, float] = (0.8, 1.6),
) -> str:
    """Tulis salinan `berkas` tanpa watermark. Audio disalin apa adanya.

    `ambang_waktu` sengaja longgar, terutama di ujung belakang. OCR hanya
    berhasil di sebagian cuplikan - logo yang tampil 0,8 sampai 2,8 detik bisa
    saja hanya tertangkap sekali di detik 1,2. Rentang yang dilebarkan menutup
    kekurangan itu. Melebihkan jauh lebih aman daripada kurang: kelebihan
    hanya memburamkan sepetak latar beberapa saat lebih lama, sedangkan
    kekurangan meninggalkan logonya terlihat.
    """
    info = periksa(berkas)
    if not temuan:
        shutil.copyfile(berkas, keluaran)
        return keluaran

    def rentang(g: Temuan) -> Tuple[float, float]:
        return (max(0.0, g.t0 - ambang_waktu[0]),
                min(info.durasi, g.t1 + ambang_waktu[1]))

    delogo = []
    for g in temuan:
        x, y, w, h = _kotak(g, info.lebar, info.tinggi)
        a, b = rentang(g)
        delogo.append(f"delogo=x={x}:y={y}:w={w}:h={h}:"
                      f"enable='between(t,{a:.2f},{b:.2f})'")

    bagian = [f"[0:v]{','.join(delogo)}[d]"]
    masuk = "d"
    for i, g in enumerate(temuan):
        x, y, w, h = _kotak(g, info.lebar, info.tinggi)
        a, b = rentang(g)
        f = max(2, min(bulu, w // 3, h // 3))
        bagian.append(f"[{masuk}]split[b{i}][c{i}]")
        bagian.append(
            f"[c{i}]crop={w}:{h}:{x}:{y},gblur=sigma={sigma:g},format=yuva420p,"
            f"geq=lum='p(X,Y)':cb='p(X,Y)':cr='p(X,Y)':"
            f"a='255*min(1,min(min(X,W-X),min(Y,H-Y))/{f})'[k{i}]")
        bagian.append(f"[b{i}][k{i}]overlay={x}:{y}:"
                      f"enable='between(t,{a:.2f},{b:.2f})'[o{i}]")
        masuk = f"o{i}"

    jalankan([
        ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y", "-i", berkas,
        "-filter_complex", ";".join(bagian),
        "-map", f"[{masuk}]", "-map", "0:a?",
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
        "-pix_fmt", "yuv420p", "-c:a", "copy", keluaran,
    ], timeout=3600)
    return keluaran


def bersihkan(berkas: str, keluaran: str, kata: Sequence[str],
              **kw) -> Tuple[str, List[Temuan]]:
    """Cari lalu hapus dalam satu panggilan. Kembalikan berkas dan temuannya."""
    temuan = cari(berkas, kata, **{k: v for k, v in kw.items()
                                   if k in ("langkah", "pita_x", "jarak_y", "jeda")})
    hapus(berkas, keluaran, temuan,
          **{k: v for k, v in kw.items()
             if k in ("crf", "bulu", "sigma", "ambang_waktu")})
    return keluaran, temuan
