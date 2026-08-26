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

Deteksinya memakai OCR, dan sifatnya perlu dipahami: ketepatannya tinggi tapi
jangkauannya rendah. Kalau tesseract bilang "ada MOSSDOOM di sini", itu hampir
pasti benar - tapi dari satu kemunculan selama tiga detik, ia mungkin hanya
menangkapnya sekali. Karena itu setiap temuan diperlakukan sebagai petunjuk,
bukan sebagai batas: jendela waktunya dilonggarkan, dan kotaknya diperluas
sampai tepi tajam di sekitarnya habis.

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


def perluas_judul(berkas: str, temuan: Sequence[Temuan],
                  batas_bawah: int = 110, batas_samping: int = 90,
                  ambang: float = 0.45) -> None:
    """Turunkan batas bawah kotak sampai judul produk ikut tercakup.

    Kunci logo merek ini bertingkat: lambang di atas, wordmark di tengah, lalu
    nama produk di bawahnya ("Doce Bag", "Darby Bag") dengan huruf sambung.
    OCR hampir selalu hanya menangkap wordmark - huruf sambung sulit dibaca -
    jadi kalau batas bawah kotak dipatok tetap, judulnya tertinggal di layar.

    Di sini baris-baris di bawah wordmark diperiksa: selama masih ada tepi
    tajam sebanyak baris wordmark itu sendiri, batas bawah diturunkan. Begitu
    barisnya bersih, berhenti - jadi video tanpa judul tidak ikut terpotong
    lebih dalam dari perlunya.

    Sisi kiri dan kanan diperlakukan sama. Judul produk sering lebih lebar
    daripada wordmark-nya, jadi kotak selebar wordmark saja menyisakan huruf
    pertama dan terakhir judul tetap terbaca di layar.
    """
    import numpy as np
    info = periksa(berkas)
    for g in temuan:
        t = (g.t0 + g.t1) / 2.0
        lebar_g = max(8, g.x1 - g.x0)
        tinggi_g = max(4, g.y1 - g.y0)
        tarik = min(batas_bawah, info.tinggi - g.y1 - 2)
        if tarik <= 4:
            continue
        p = subprocess.run(
            [ffmpeg_bin(), "-v", "error", "-ss", f"{t:.3f}", "-i", berkas,
             "-frames:v", "1",
             "-vf", f"crop={lebar_g}:{tinggi_g + tarik}:{g.x0}:{g.y0},format=gray",
             "-f", "rawvideo", "-pix_fmt", "gray", "-"],
            capture_output=True)
        butuh = lebar_g * (tinggi_g + tarik)
        if len(p.stdout) < butuh:
            continue
        a = np.frombuffer(p.stdout[:butuh], dtype=np.uint8) \
              .reshape(tinggi_g + tarik, lebar_g).astype(np.float32)
        tepi = np.abs(np.diff(a, axis=1)).mean(1)
        acuan = tepi[:tinggi_g].mean()          # kekuatan tepi di wordmark
        if acuan <= 1e-3:
            continue
        bawah = tinggi_g
        kosong = 0
        for i in range(tinggi_g, tinggi_g + tarik):
            if tepi[i] >= acuan * ambang:
                bawah = i + 1
                kosong = 0
            else:
                kosong += 1
                if kosong >= 12:                # jeda cukup panjang = sudah habis
                    break
        g.y1 = g.y0 + bawah

        # --- lebarkan ke kiri dan kanan dengan cara yang sama ---
        tinggi_baru = g.y1 - g.y0
        kiri = min(batas_samping, g.x0 - 2)
        kanan = min(batas_samping, info.lebar - g.x1 - 2)
        if kiri <= 4 and kanan <= 4:
            continue
        x_awal = g.x0 - kiri
        lebar_luas = kiri + (g.x1 - g.x0) + kanan
        p = subprocess.run(
            [ffmpeg_bin(), "-v", "error", "-ss", f"{t:.3f}", "-i", berkas,
             "-frames:v", "1",
             "-vf", f"crop={lebar_luas}:{tinggi_baru}:{x_awal}:{g.y0},format=gray",
             "-f", "rawvideo", "-pix_fmt", "gray", "-"],
            capture_output=True)
        butuh = lebar_luas * tinggi_baru
        if len(p.stdout) < butuh:
            continue
        a = np.frombuffer(p.stdout[:butuh], dtype=np.uint8) \
              .reshape(tinggi_baru, lebar_luas).astype(np.float32)
        tepi_k = np.abs(np.diff(a, axis=0)).mean(0)
        inti = tepi_k[kiri:kiri + (g.x1 - g.x0)]
        if inti.size == 0 or inti.mean() <= 1e-3:
            continue
        acuan_k = inti.mean()
        kosong = 0
        batas_kiri = kiri
        for i in range(kiri - 1, -1, -1):
            if tepi_k[i] >= acuan_k * ambang:
                batas_kiri = i
                kosong = 0
            else:
                kosong += 1
                if kosong >= 12:
                    break
        kosong = 0
        batas_kanan = kiri + (g.x1 - g.x0)
        for i in range(batas_kanan, lebar_luas):
            if tepi_k[i] >= acuan_k * ambang:
                batas_kanan = i + 1
                kosong = 0
            else:
                kosong += 1
                if kosong >= 12:
                    break
        g.x0 = x_awal + batas_kiri
        g.x1 = x_awal + batas_kanan


def saring_ukuran(temuan: List[Temuan], toleransi: float = 1.6,
                  minimal: int = 3) -> List[Temuan]:
    """Buang temuan yang ukurannya jauh menyimpang dari yang lain.

    Watermark yang ditempel di-render sekali dengan satu ukuran, jadi lebarnya
    sama setiap kali muncul dalam satu video. Logo merek yang TERCETAK pada
    benda di dalam adegan - kotak kemasan, kantong belanja - besarnya
    mengikuti jarak kamera, jadi lebarnya menyimpang jauh.

    Bedanya penting: yang ditempel memang harus dihapus, sedangkan yang
    tercetak adalah benda nyata di dalam adegan. Menghapusnya meninggalkan
    tambalan buram di tengah barang yang justru sedang dijual - dan pada satu
    berkas uji, penghapusan separuh menyisakan dua garis melayang bekas
    lambang, yang jauh lebih mencolok daripada dibiarkan utuh.

    Penyaringan hanya dijalankan kalau temuannya cukup banyak. Dengan dua
    temuan berbeda ukuran, tidak ada dasar untuk menebak mana yang menyimpang.
    """
    if len(temuan) < minimal:
        return temuan
    lebar = sorted(g.x1 - g.x0 for g in temuan)
    tengah = lebar[len(lebar) // 2]
    if tengah <= 0:
        return temuan
    return [g for g in temuan
            if (1 / toleransi) <= (g.x1 - g.x0) / tengah <= toleransi]


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
    ambang_waktu: Tuple[float, float] = (1.5, 3.0),
) -> str:
    """Tulis salinan `berkas` tanpa watermark. Audio disalin apa adanya.

    `ambang_waktu` sengaja sangat longgar. OCR pada watermark merek punya
    ketepatan tinggi tapi jangkauan rendah: kalau ia bilang "ada logo di sini",
    itu hampir pasti benar - tapi dari satu kemunculan selama tiga detik, ia
    mungkin hanya menangkapnya sekali. Pada satu berkas uji, logo yang tampil
    dari detik 0 sampai 3 hanya tertangkap di detik 0; jendela +1,6 detik
    membuat sisanya lolos dan logonya tetap terlihat.

    Melebihkan jauh lebih aman daripada kurang: kelebihan hanya memburamkan
    sepetak latar beberapa saat lebih lama - hampir tidak terlihat karena
    latarnya memang mulus - sedangkan kekurangan meninggalkan logonya utuh
    di layar, yang persis ingin dihindari.
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
              judul: bool = True, **kw) -> Tuple[str, List[Temuan]]:
    """Cari lalu hapus dalam satu panggilan. Kembalikan berkas dan temuannya."""
    temuan = cari(berkas, kata, **{k: v for k, v in kw.items()
                                   if k in ("langkah", "pita_x", "jarak_y", "jeda")})
    temuan = saring_ukuran(temuan)
    if judul:
        perluas_judul(berkas, temuan)
    hapus(berkas, keluaran, temuan,
          **{k: v for k, v in kw.items()
             if k in ("crf", "bulu", "sigma", "ambang_waktu")})
    return keluaran, temuan
