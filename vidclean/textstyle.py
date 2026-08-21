"""Pembuat berkas ASS (subtitle) supaya semua teks di semua video seragam.

Kenapa ASS dan bukan drawtext ffmpeg?
  * satu blok gaya mengatur font, ukuran, warna, garis tepi, dan bayangan
  * font diambil dari folder assets/fonts, jadi hasilnya sama di komputer mana pun
  * ukuran & posisi dihitung sebagai porsi tinggi layar, jadi video 720p dan
    1080p menghasilkan tampilan yang identik
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Sequence, Tuple

TINGGI_ACUAN = 1920.0  # semua ukuran di config ditulis untuk layar setinggi 1920px


# ---------------------------------------------------------------------------
# Warna
# ---------------------------------------------------------------------------
def ass_warna(hex_warna: str, transparansi_persen: float = 0.0) -> str:
    """'#FFCC00' + transparansi 0-100 -> '&H00 00 CC FF' (format ASS: AABBGGRR)."""
    t = (hex_warna or "#FFFFFF").strip().lstrip("#")
    if len(t) == 3:
        t = "".join(c * 2 for c in t)
    if len(t) != 6 or not re.fullmatch(r"[0-9a-fA-F]{6}", t):
        t = "FFFFFF"
    r, g, b = t[0:2], t[2:4], t[4:6]
    alpha = int(round(max(0.0, min(100.0, float(transparansi_persen))) * 255 / 100))
    return f"&H{alpha:02X}{b}{g}{r}".upper()


def waktu_ass(detik: float) -> str:
    detik = max(0.0, float(detik))
    jam = int(detik // 3600)
    menit = int((detik % 3600) // 60)
    sisa = detik - jam * 3600 - menit * 60
    return f"{jam:d}:{menit:02d}:{sisa:05.2f}"


def bersihkan(teks: str) -> str:
    """Amankan karakter yang punya arti khusus di format ASS."""
    return (
        (teks or "")
        .replace("\\", "\\\\")
        .replace("{", "(")
        .replace("}", ")")
        .replace("\r", "")
    )


def bungkus(teks: str, maks_karakter: int) -> str:
    """Pecah teks jadi beberapa baris supaya rapi, memakai penanda \\N milik ASS."""
    teks = re.sub(r"\s+", " ", (teks or "").strip())
    if not teks:
        return ""
    if maks_karakter <= 0:
        return teks.replace("\n", "\\N")

    baris: List[str] = []
    sekarang = ""
    for kata in teks.split(" "):
        calon = f"{sekarang} {kata}".strip()
        if len(calon) <= maks_karakter or not sekarang:
            sekarang = calon
        else:
            baris.append(sekarang)
            sekarang = kata
    if sekarang:
        baris.append(sekarang)
    return "\\N".join(baris)


# ---------------------------------------------------------------------------
# Pembuat berkas ASS
# ---------------------------------------------------------------------------
@dataclass
class PembuatASS:
    lebar: int
    tinggi: int
    keluarga_font: str
    gaya: Dict[str, Any]
    durasi: float
    kejadian: List[str] = field(default_factory=list)

    # -- helper ------------------------------------------------------------
    @property
    def _skala(self) -> float:
        return self.tinggi / TINGGI_ACUAN

    def _ukuran(self, kunci: str, bawaan: float) -> int:
        nilai = float(self.gaya.get(kunci, bawaan) or bawaan)
        return max(8, int(round(nilai * self._skala)))

    def _margin(self) -> int:
        return int(round(float(self.gaya.get("margin_samping", 0.09)) * self.lebar))

    def _blok_gaya(self, nama: str, ukuran: int, tebal: bool, transparansi: float = 0.0) -> str:
        g = self.gaya
        utama = ass_warna(g.get("warna_teks", "#FFFFFF"), transparansi)
        garis = ass_warna(g.get("warna_garis", "#000000"), transparansi)
        kotak = ass_warna(g.get("warna_kotak", "#000000"), g.get("transparansi_kotak", 45))

        pakai_kotak = bool(g.get("kotak_latar", False))
        border_style = 3 if pakai_kotak else 1
        tebal_garis = float(g.get("tebal_garis", 4)) * self._skala
        if pakai_kotak:
            tebal_garis = max(tebal_garis, 12 * self._skala)  # padding kotak
        bayangan = float(g.get("bayangan", 1)) * self._skala
        spasi = float(g.get("jarak_huruf", 0.0)) * self._skala
        margin = self._margin()

        return (
            f"Style: {nama},{self.keluarga_font},{ukuran},"
            f"{utama},{utama},{garis},{kotak},"
            f"{-1 if tebal else 0},0,0,0,100,100,{spasi:.2f},0,"
            f"{border_style},{tebal_garis:.2f},{bayangan:.2f},5,"
            f"{margin},{margin},{margin},1"
        )

    def _tambah(self, gaya: str, mulai: float, selesai: float, tag: str, teks: str) -> None:
        if not teks:
            return
        selesai = max(selesai, mulai + 0.05)
        self.kejadian.append(
            f"Dialogue: 0,{waktu_ass(mulai)},{waktu_ass(selesai)},{gaya},,0,0,0,,{tag}{teks}"
        )

    # -- elemen teks -------------------------------------------------------
    def judul(self, teks: str, mulai: float = 0.0, selesai: float | None = None) -> None:
        if not teks:
            return
        if self.gaya.get("huruf_besar_judul", True):
            teks = teks.upper()
        isi = bungkus(bersihkan(teks), int(self.gaya.get("maks_karakter_baris", 22)))
        x = self.lebar // 2
        y = int(round(float(self.gaya.get("posisi_judul", 0.13)) * self.tinggi))
        selesai = self.durasi if selesai is None else selesai
        self._tambah("Judul", mulai, selesai, f"{{\\an8\\pos({x},{y})}}", isi)

    def caption(self, teks: str, mulai: float = 0.0, selesai: float | None = None) -> None:
        if not teks:
            return
        isi = bungkus(bersihkan(teks), int(self.gaya.get("maks_karakter_baris", 22)) + 6)
        x = self.lebar // 2
        y = int(round(float(self.gaya.get("posisi_caption", 0.80)) * self.tinggi))
        selesai = self.durasi if selesai is None else selesai
        self._tambah("Caption", mulai, selesai, f"{{\\an2\\pos({x},{y})}}", isi)

    def handle(self, teks: str) -> None:
        if not teks:
            return
        isi = bersihkan(re.sub(r"\s+", " ", teks.strip()))
        x = self.lebar // 2
        di_atas = str(self.gaya.get("posisi_handle", "atas")).lower().startswith("a")
        if di_atas:
            y = int(round(0.055 * self.tinggi))
            tag = f"{{\\an8\\pos({x},{y})}}"
        else:
            y = int(round(0.945 * self.tinggi))
            tag = f"{{\\an2\\pos({x},{y})}}"
        self._tambah("Handle", 0.0, self.durasi, tag, isi)

    def subtitle(self, potongan: Sequence[Tuple[float, float, str]]) -> None:
        x = self.lebar // 2
        y = int(round(float(self.gaya.get("posisi_subtitle", 0.74)) * self.tinggi))
        maks = int(self.gaya.get("maks_karakter_baris", 22))
        for mulai, selesai, teks in potongan:
            isi = bungkus(bersihkan(teks), maks)
            if not isi:
                continue
            self._tambah("Sub", float(mulai), float(selesai), f"{{\\an2\\pos({x},{y})}}", isi)

    # -- keluaran ----------------------------------------------------------
    def ada_isi(self) -> bool:
        return bool(self.kejadian)

    def render(self) -> str:
        tebal = bool(self.gaya.get("font_tebal", True))
        kepala = [
            "[Script Info]",
            "; Dibuat otomatis oleh vidclean - gaya teks seragam untuk semua video",
            "ScriptType: v4.00+",
            f"PlayResX: {self.lebar}",
            f"PlayResY: {self.tinggi}",
            "WrapStyle: 2",
            "ScaledBorderAndShadow: yes",
            "YCbCr Matrix: TV.709",
            "",
            "[V4+ Styles]",
            "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour,"
            " BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle,"
            " BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
            self._blok_gaya("Judul", self._ukuran("ukuran_judul", 68), tebal),
            self._blok_gaya("Caption", self._ukuran("ukuran_caption", 52), tebal),
            self._blok_gaya("Sub", self._ukuran("ukuran_subtitle", 62), tebal),
            self._blok_gaya(
                "Handle",
                self._ukuran("ukuran_handle", 32),
                tebal,
                transparansi=float(self.gaya.get("transparansi_handle", 35)),
            ),
            "",
            "[Events]",
            "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
        ]
        return "\n".join(kepala + self.kejadian) + "\n"
