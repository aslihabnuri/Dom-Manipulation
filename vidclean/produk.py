"""Penyisipan produk ke dalam video.

Tiga cara, dari yang paling bersih hasilnya:

  sisip   - gambar dipotong ke foto produk selama beberapa detik, suara asli
            tetap jalan. Ini cara yang dipakai kreator affiliate untuk produk
            yang dipegang tangan, karena tidak perlu mengganti apa pun di
            dalam gambar aslinya.
  tempel  - foto produk muncul sebagai kartu kecil di sudut layar.
  endcard - foto produk ditampilkan sepenuh layar di akhir video.

Semua label teksnya memakai font yang sama dengan teks lain, supaya seragam.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Any, Dict, List, Sequence, Tuple

MODE = ("sisip", "tempel", "endcard")
POSISI = {
    "kanan-bawah": ("W-w-{m}", "H-h-{mb}"),
    "kiri-bawah": ("{m}", "H-h-{mb}"),
    "kanan-atas": ("W-w-{m}", "{mt}"),
    "kiri-atas": ("{m}", "{mt}"),
    "tengah": ("(W-w)/2", "(H-h)/2"),
}


@dataclass
class Aset:
    berkas: str
    mulai: float = 0.0          # detik ke berapa muncul (mengikuti video ASLI)
    lama: float = 2.5
    mode: str = "sisip"
    label: str = ""
    posisi: str = "kanan-bawah"
    lebar: float = 0.34         # porsi lebar layar, khusus mode "tempel"
    zoom: bool = True           # gerakan zoom pelan supaya tidak terlihat mati

    def periksa(self) -> None:
        if not os.path.exists(self.berkas):
            raise FileNotFoundError(f"Berkas produk tidak ditemukan: {self.berkas}")
        if self.mode not in MODE:
            raise ValueError(f"Mode produk '{self.mode}' tidak dikenal. Pilihan: {', '.join(MODE)}")
        if self.posisi not in POSISI:
            raise ValueError(
                f"Posisi '{self.posisi}' tidak dikenal. Pilihan: {', '.join(POSISI)}"
            )
        if self.lama <= 0:
            raise ValueError("Lama tampil produk harus lebih dari 0 detik")


def urai(spec: str, mode: str) -> Aset:
    """Ubah tulisan 'berkas,mulai,lama,label' menjadi satu Aset.

    Untuk mode endcard cukup 'berkas,lama,label' karena selalu di akhir.
    """
    bagian = [b.strip() for b in str(spec).split(",")]
    if not bagian or not bagian[0]:
        raise ValueError("Keterangan produk kosong")

    berkas = bagian[0]

    def angka(teks: str, bawaan: float) -> float:
        try:
            return float(teks)
        except (TypeError, ValueError):
            return bawaan

    if mode == "endcard":
        lama = angka(bagian[1], 3.0) if len(bagian) > 1 else 3.0
        label = ", ".join(bagian[2:]).strip() if len(bagian) > 2 else ""
        return Aset(berkas=berkas, mulai=0.0, lama=lama, mode="endcard", label=label)

    mulai = angka(bagian[1], 0.0) if len(bagian) > 1 else 0.0
    lama = angka(bagian[2], 2.5) if len(bagian) > 2 else 2.5
    label = ", ".join(bagian[3:]).strip() if len(bagian) > 3 else ""
    return Aset(berkas=berkas, mulai=mulai, lama=lama, mode=mode, label=label)


def _gambar(berkas: str) -> bool:
    return berkas.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".bmp", ".gif", ".avif"))


def _genap(n: float) -> int:
    return max(2, int(n // 2) * 2)


@dataclass
class Rakitan:
    """Hasil perakitan: potongan perintah + potongan filtergraph."""
    masukan: List[str] = field(default_factory=list)
    graf: List[str] = field(default_factory=list)
    arus: str = ""
    # (mulai, selesai, teks, gaya, x, y, jangkar)
    label: List[Tuple[float, float, str, str, int, int, int]] = field(default_factory=list)
    tambahan_durasi: float = 0.0


def rakit(
    aset_list: Sequence[Aset],
    arus_masuk: str,
    lebar: int,
    tinggi: int,
    fps: float,
    indeks_awal: int,
    durasi_video: float,
) -> Rakitan:
    """Susun input tambahan dan filtergraph untuk semua aset produk.

    `aset_list` sudah dalam lini masa video HASIL (bukan video asli).
    """
    hasil = Rakitan(arus=arus_masuk)
    if not aset_list:
        return hasil

    # Endcard menambah durasi di ujung video, jadi dihitung lebih dulu.
    endcard = [a for a in aset_list if a.mode == "endcard"]
    tempelan = [a for a in aset_list if a.mode != "endcard"]
    hasil.tambahan_durasi = sum(a.lama for a in endcard)

    if hasil.tambahan_durasi > 0:
        hasil.graf.append(
            f"{hasil.arus}tpad=stop_duration={hasil.tambahan_durasi:.3f}:stop_mode=clone[epad]"
        )
        hasil.arus = "[epad]"

    indeks = indeks_awal
    nomor = 0

    for aset in list(tempelan) + list(endcard):
        aset.periksa()
        if aset.mode == "endcard":
            mulai = durasi_video + sum(
                e.lama for e in endcard[: endcard.index(aset)]
            )
        else:
            mulai = max(0.0, aset.mulai)
        selesai = mulai + aset.lama

        # --- masukan ffmpeg ---
        if _gambar(aset.berkas):
            hasil.masukan += [
                "-loop", "1",
                "-framerate", f"{fps:.5f}",
                "-t", f"{aset.lama:.3f}",
                "-i", aset.berkas,
            ]
        else:
            hasil.masukan += ["-t", f"{aset.lama:.3f}", "-i", aset.berkas]

        sumber = f"[{indeks}:v]"
        siap = f"[pk{nomor}]"
        keluar = f"[po{nomor}]"
        kw = _genap(lebar * max(0.12, min(0.8, aset.lebar)))
        tepi = max(3, kw // 60)
        m = int(lebar * 0.055)

        if aset.mode == "tempel":
            # Kartu kecil di sudut, diberi bingkai putih tipis supaya rapi.
            hasil.graf.append(
                f"{sumber}scale={kw}:-2:force_original_aspect_ratio=decrease:flags=lanczos,"
                f"pad=iw+{tepi * 2}:ih+{tepi * 2}:{tepi}:{tepi}:white,"
                f"format=rgba,"
                f"fade=t=in:st=0:d=0.25:alpha=1,"
                f"fade=t=out:st={max(0.0, aset.lama - 0.25):.3f}:d=0.25:alpha=1,"
                f"setpts=PTS-STARTPTS,tpad=start_duration={mulai:.3f}:start_mode=add:color=black@0"
                f"{siap}"
            )
            x_pola, y_pola = POSISI[aset.posisi]
            x = x_pola.format(m=m, mb=int(tinggi * 0.20), mt=int(tinggi * 0.10))
            y = y_pola.format(m=m, mb=int(tinggi * 0.20), mt=int(tinggi * 0.10))
            hasil.graf.append(
                f"{hasil.arus}{siap}overlay={x}:{y}:format=auto:"
                f"enable='between(t,{mulai:.3f},{selesai:.3f})'{keluar}"
            )
        else:
            # sisip / endcard: menutup satu layar penuh.
            if aset.zoom and _gambar(aset.berkas):
                besar_w, besar_h = _genap(lebar * 1.35), _genap(tinggi * 1.35)
                gerak = (
                    f"scale={besar_w}:{besar_h}:force_original_aspect_ratio=increase:flags=lanczos,"
                    f"crop={besar_w}:{besar_h},"
                    f"zoompan=z='min(1.0+0.00060*on,1.10)':"
                    f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
                    f"d=1:s={lebar}x{tinggi}:fps={fps:.5f}"
                )
            else:
                gerak = (
                    f"scale={lebar}:{tinggi}:force_original_aspect_ratio=increase:flags=lanczos,"
                    f"crop={lebar}:{tinggi}"
                )
            hasil.graf.append(
                f"{sumber}{gerak},setsar=1,format=rgba,"
                f"fade=t=in:st=0:d=0.18:alpha=1,"
                f"fade=t=out:st={max(0.0, aset.lama - 0.18):.3f}:d=0.18:alpha=1,"
                f"setpts=PTS-STARTPTS,tpad=start_duration={mulai:.3f}:start_mode=add:color=black@0"
                f"{siap}"
            )
            hasil.graf.append(
                f"{hasil.arus}{siap}overlay=0:0:format=auto:"
                f"enable='between(t,{mulai:.3f},{selesai:.3f})'{keluar}"
            )

        if aset.label:
            if aset.mode == "tempel":
                # Label diletakkan tepat di bawah / di atas kartu produk.
                kw_total = kw + tepi * 2
                if aset.posisi.startswith("kanan"):
                    lx = lebar - m - kw_total // 2
                elif aset.posisi.startswith("kiri"):
                    lx = m + kw_total // 2
                else:
                    lx = lebar // 2
                if aset.posisi.endswith("atas"):
                    ly, jangkar = int(tinggi * 0.10) - int(tinggi * 0.018), 2
                elif aset.posisi == "tengah":
                    ly, jangkar = int(tinggi * 0.82), 2
                else:
                    ly, jangkar = tinggi - int(tinggi * 0.20) + int(tinggi * 0.022), 8
                gaya = "LabelKecil"
            else:
                lx, ly, jangkar = lebar // 2, int(tinggi * 0.82), 2
                gaya = "LabelBesar"
            hasil.label.append(
                (mulai + 0.15, max(mulai + 0.4, selesai - 0.1), aset.label, gaya, lx, ly, jangkar)
            )

        hasil.arus = keluar
        indeks += 1
        nomor += 1

    return hasil


def geser_waktu(aset_list: Sequence[Aset], potong_awal: float, peta,
                durasi_akhir: float) -> List[Aset]:
    """Pindahkan waktu produk dari lini masa video asli ke lini masa hasil edit.

    `peta` adalah fungsi pemetaan waktu (bisa piecewise kalau kecepatan
    videonya berlapis), dibuat oleh pipeline.
    """
    hasil: List[Aset] = []
    for a in aset_list:
        if a.mode == "endcard":
            hasil.append(a)
            continue
        mulai = peta(a.mulai - potong_awal)
        selesai = peta(a.mulai - potong_awal + a.lama)
        lama = selesai - mulai
        if lama <= 0.05:
            continue
        if durasi_akhir > 0:
            lama = min(lama, max(0.2, durasi_akhir - mulai))
            if mulai >= durasi_akhir:
                continue
        baru = Aset(**{**a.__dict__})
        baru.mulai, baru.lama = round(mulai, 3), round(lama, 3)
        hasil.append(baru)
    return hasil
