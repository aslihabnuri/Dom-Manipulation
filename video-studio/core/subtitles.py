"""Takarir dan teks di layar, meniru tata letak video acuan.

Tiga jenis teks yang dipakai:

  1. Kartu pembuka  — pita miring warna kuning dengan tulisan hitam tebal,
     muncul di dua detik pertama. Ini yang menahan jempol penonton.
  2. Label sorotan  — kotak berwarna berisi satu atau dua kata kapital,
     muncul di tengah bawah untuk menegaskan kata kunci adegan.
  3. Takarir jalan  — dua sampai empat kata putih di bagian bawah layar,
     berganti mengikuti ucapan narator.

Semuanya ditulis sebagai berkas ASS lalu dibakar ke video oleh libass.
Waktu tiap potongan takarir dibagi proporsional menurut jumlah suku kata,
bukan jumlah kata, supaya kata panjang mendapat jatah waktu lebih banyak.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

from .config import FONTS_DIR, RENDER
from .idn import kelompok_takarir

# Warna ASS memakai urutan &HAABBGGRR (alfa, biru, hijau, merah).
PUTIH = "&H00FFFFFF"
HITAM = "&H00000000"
KUNING = "&H0000E5FF"
GARIS_GELAP = "&HC0000000"
BAYANG = "&H80000000"


@dataclass
class Potongan:
    mulai: float
    selesai: float
    teks: str
    gaya: str = "Takarir"


def _waktu(detik: float) -> str:
    detik = max(0.0, detik)
    jam = int(detik // 3600)
    menit = int((detik % 3600) // 60)
    sisa = detik % 60
    return f"{jam}:{menit:02d}:{sisa:05.2f}"


def _bobot_suku_kata(kata: str) -> float:
    """Perkiraan kasar jumlah suku kata Bahasa Indonesia dari jumlah vokal."""
    vokal = len(re.findall(r"[aeiouAEIOU]", kata))
    return max(1.0, float(vokal))


def jadwal_takarir(
    teks: str,
    mulai: float,
    durasi: float,
    *,
    maks_kata: int = 4,
) -> list[Potongan]:
    """Bagi satu narasi adegan menjadi potongan takarir yang berurutan."""
    kelompok = kelompok_takarir(teks, maks_kata=maks_kata)
    if not kelompok:
        return []

    bobot = [sum(_bobot_suku_kata(k) for k in g.split()) for g in kelompok]
    total = sum(bobot) or 1.0

    potongan: list[Potongan] = []
    jalan = mulai
    for g, b in zip(kelompok, bobot):
        panjang = durasi * (b / total)
        potongan.append(Potongan(jalan, jalan + panjang, g))
        jalan += panjang

    # Rapatkan ujung terakhir tepat di akhir adegan.
    if potongan:
        potongan[-1].selesai = mulai + durasi
    return potongan


# Perbandingan rata-rata lebar huruf terhadap tinggi font untuk Poppins
# ExtraBold dalam huruf kapital. Dipakai untuk menaksir lebar teks tanpa
# harus memuat berkas fontnya.
_RASIO_LEBAR_HURUF = 0.62


def ukuran_yang_muat(
    teks: str, lebar_tersedia: int, ukuran_maks: int, ukuran_min: int = 34
) -> int:
    """Perkecil font secukupnya supaya satu baris teks tidak keluar layar."""
    if not teks.strip():
        return ukuran_maks
    perkiraan = lebar_tersedia / (_RASIO_LEBAR_HURUF * len(teks))
    return int(max(ukuran_min, min(ukuran_maks, perkiraan)))


def pecah_dua_baris(teks: str) -> tuple[str, str]:
    """Bagi kalimat pembuka jadi dua baris yang panjangnya seimbang.

    Titik potong dipilih pada batas kata yang membuat selisih panjang kedua
    baris paling kecil, supaya pita kuningnya terlihat rapi.
    """
    kata = teks.strip().split()
    if len(kata) <= 1:
        return teks.strip(), ""
    terbaik = 1
    selisih_terkecil = None
    for i in range(1, len(kata)):
        atas = len(" ".join(kata[:i]))
        bawah = len(" ".join(kata[i:]))
        selisih = abs(atas - bawah)
        if selisih_terkecil is None or selisih < selisih_terkecil:
            selisih_terkecil = selisih
            terbaik = i
    return " ".join(kata[:terbaik]), " ".join(kata[terbaik:])


def _escape(teks: str) -> str:
    return (
        teks.replace("\\", "\\\\")
        .replace("{", "\\{")
        .replace("}", "\\}")
        .replace("\n", "\\N")
    )


# Titik pasang teks di layar, dihitung dari atas dalam piksel.
# Video acuan menaruh pita pembuka di sekitar sepertiga atas layar, label
# sorotan tepat di atas takarir, dan takarir di seperlima bawah.
Y_HOOK_ATAS = int(RENDER.height * 0.30)
Y_HOOK_BAWAH = Y_HOOK_ATAS + 132
Y_SOROTAN = int(RENDER.height * 0.735)
Y_SOROTAN_SUB = Y_SOROTAN + 78


def kepala_ass(
    *,
    ukuran_takarir: int = 56,
    ukuran_sorotan: int = 74,
    ukuran_hook: int = 92,
    margin_bawah: int = 250,
) -> str:
    """Bagian gaya berkas ASS."""
    return f"""[Script Info]
ScriptType: v4.00+
PlayResX: {RENDER.width}
PlayResY: {RENDER.height}
WrapStyle: 2
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Takarir,Poppins SemiBold,{ukuran_takarir},{PUTIH},{PUTIH},{GARIS_GELAP},{BAYANG},0,0,0,0,100,100,0,0,1,5,3,2,90,90,{margin_bawah},1
Style: Sorotan,Poppins ExtraBold,{ukuran_sorotan},{HITAM},{HITAM},{KUNING},{KUNING},0,0,0,0,100,100,2,0,3,16,0,5,80,80,0,1
Style: SorotanSub,Poppins SemiBold,42,{PUTIH},{PUTIH},{GARIS_GELAP},{BAYANG},0,0,0,0,100,100,0,0,1,4,2,5,80,80,0,1
Style: Hook,Poppins ExtraBold,{ukuran_hook},{HITAM},{HITAM},{KUNING},{KUNING},0,0,0,0,100,100,1,0,3,22,0,5,70,70,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def _baris(p: Potongan, layer: int = 0, tag: str = "") -> str:
    return (
        f"Dialogue: {layer},{_waktu(p.mulai)},{_waktu(p.selesai)},{p.gaya},,"
        f"0,0,0,,{tag}{_escape(p.teks)}"
    )


def bangun_ass(
    adegan_waktu: list[tuple[object, float, float]],
    keluar: Path,
    *,
    hook: str = "",
    durasi_hook: float = 2.4,
    tampilkan_hook: bool = True,
    maks_kata: int = 4,
    ukuran_takarir: int = 56,
    ukuran_sorotan: int = 74,
    ukuran_hook: int = 92,
) -> Path:
    """Susun berkas ASS lengkap.

    adegan_waktu berisi (objek_adegan, waktu_mulai, durasi) untuk tiap adegan.
    """
    baris: list[str] = [
        kepala_ass(
            ukuran_takarir=ukuran_takarir,
            ukuran_sorotan=ukuran_sorotan,
            ukuran_hook=ukuran_hook,
        )
    ]

    # Kartu pembuka: dua pita miring bertumpuk di tengah layar.
    # Pita dimiringkan, jadi lebar amannya lebih sempit dari lebar layar.
    LEBAR_AMAN_HOOK = int(RENDER.width * 0.80)
    if tampilkan_hook and hook.strip():
        atas, bawah = pecah_dua_baris(hook.strip().rstrip(".?!"))
        # Satu ukuran untuk kedua pita, diambil dari baris yang paling panjang,
        # supaya tinggi hurufnya sama.
        terpanjang = max(atas, bawah, key=len) if bawah else atas
        ukuran = ukuran_yang_muat(terpanjang.upper(), LEBAR_AMAN_HOOK, ukuran_hook)
        # Jarak antarpita ikut mengecil bila fontnya mengecil.
        y_bawah = Y_HOOK_ATAS + int(ukuran * 1.45)
        x = RENDER.width // 2
        if atas:
            baris.append(
                f"Dialogue: 2,{_waktu(0)},{_waktu(durasi_hook)},Hook,,0,0,0,,"
                f"{{\\pos({x},{Y_HOOK_ATAS})\\fs{ukuran}\\frz4\\fad(120,220)}}"
                f"{_escape(atas.upper())}"
            )
        if bawah:
            baris.append(
                f"Dialogue: 2,{_waktu(0.12)},{_waktu(durasi_hook)},Hook,,0,0,0,,"
                f"{{\\pos({x},{y_bawah})\\fs{ukuran}\\frz-3\\fad(180,220)}}"
                f"{_escape(bawah.upper())}"
            )

    for adegan, mulai, durasi in adegan_waktu:
        # Takarir berjalan.
        for p in jadwal_takarir(
            getattr(adegan, "narasi", ""), mulai, durasi, maks_kata=maks_kata
        ):
            baris.append(_baris(p))

        # Label sorotan muncul sebentar di awal adegan.
        sorotan = (getattr(adegan, "sorotan", "") or "").strip()
        if sorotan:
            tampil = min(2.2, max(1.2, durasi * 0.55))
            x = RENDER.width // 2
            ukuran_s = ukuran_yang_muat(
                sorotan, int(RENDER.width * 0.84), ukuran_sorotan, ukuran_min=40
            )
            baris.append(
                _baris(
                    Potongan(mulai + 0.15, mulai + 0.15 + tampil, sorotan, "Sorotan"),
                    layer=1,
                    tag=f"{{\\pos({x},{Y_SOROTAN})\\fs{ukuran_s}\\fad(140,180)}}",
                )
            )
            sub = (getattr(adegan, "sorotan_sub", "") or "").strip()
            if sub:
                baris.append(
                    _baris(
                        Potongan(mulai + 0.25, mulai + 0.15 + tampil, sub, "SorotanSub"),
                        layer=1,
                        tag=f"{{\\pos({x},{Y_SOROTAN_SUB})\\fad(140,180)}}",
                    )
                )

    keluar.parent.mkdir(parents=True, exist_ok=True)
    keluar.write_text("\n".join(baris) + "\n", encoding="utf-8")
    return keluar


def filter_subtitle(berkas_ass: Path) -> str:
    """Potongan filter ffmpeg untuk membakar takarir, lengkap dengan folder font."""
    jalur = str(berkas_ass).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")
    fonts = str(FONTS_DIR).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")
    return f"subtitles='{jalur}':fontsdir='{fonts}'"


def tulis_srt(adegan_waktu: list[tuple[object, float, float]], keluar: Path) -> Path:
    """Berkas SRT terpisah, berguna untuk diunggah ke YouTube sebagai takarir."""
    baris: list[str] = []
    n = 1
    for adegan, mulai, durasi in adegan_waktu:
        for p in jadwal_takarir(getattr(adegan, "narasi", ""), mulai, durasi):
            awal = _waktu(p.mulai).replace(".", ",")
            akhir = _waktu(p.selesai).replace(".", ",")
            baris.append(f"{n}\n0{awal}0 --> 0{akhir}0\n{p.teks}\n")
            n += 1
    keluar.parent.mkdir(parents=True, exist_ok=True)
    keluar.write_text("\n".join(baris), encoding="utf-8")
    return keluar
