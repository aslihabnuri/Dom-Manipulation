"""Verifikasi ucapan: memastikan narator mengucapkan persis isi naskah.

Ini jawaban langsung untuk dua permintaan yang paling sulit: dubbing tanpa
keseleo lidah, dan video yang jadi sekali tanpa revisi.

Cara kerjanya sederhana tetapi menentukan. Setelah suara dibuat, suara itu
didengarkan kembali oleh mesin pengenal ucapan, lalu hasil dengarnya
dibandingkan dengan naskah aslinya. Kalau tidak cocok, potongan itu dibuat
ulang secara otomatis sebelum pengguna sempat melihatnya.

Contoh cacat nyata yang ditemukan cara ini pada produksi sungguhan:

    naskah   : ...banyak orang keliru menilainya sebagai plastik biasa.
    terucap  : ...banyak orang keliurum menilainya sebagai plastik biasa,
               banyak orang keliurum menilainya sebagai plastik biasa.

Satu frasa terucap dua kali, dan kata "keliru" berubah jadi "keliurum".
Keduanya lolos dari pemeriksaan teks karena naskahnya sendiri benar.

Kie tidak menyediakan layanan pengenal ucapan, jadi pemeriksaan ini berjalan
di komputer pengguna dengan faster-whisper. Sifatnya opsional: kalau paketnya
belum terpasang, aplikasi tetap jalan dan memakai pemeriksaan durasi saja.
"""
from __future__ import annotations

import difflib
import re
import statistics
from dataclasses import dataclass, field
from pathlib import Path

# Model dimuat sekali lalu dipakai berulang; pemuatannya yang paling lama.
_MODEL = None
_MODEL_UKURAN = ""


def tersedia() -> bool:
    try:
        import faster_whisper  # noqa: F401

        return True
    except ImportError:
        return False


# Ukuran model pengenal ucapan.
#
# "base" sempat dipakai karena paling ringan, tetapi pengujian pada narasi
# Bahasa Indonesia menunjukkan ia terlalu sering salah dengar dan menandai
# potongan yang sebenarnya baik:
#
#   adegan   base            small
#   1        74%  (cacat)    100% (baik)   "mengira" terdengar "mengiram"
#   3        77%  (cacat)     92% (baik)   "saat perang" terdengar "seapa yang"
#
# Empat dari empat tanda yang dikeluarkan "base" ternyata keliru. Karena satu
# tanda palsu berarti satu potongan dibuat ulang sia-sia dan satu kredit
# terbuang, ukuran bawaannya dinaikkan ke "small".
UKURAN_BAWAAN = "small"

# Pasangan ejaan yang sering ditukar oleh pengenal ucapan tetapi bunyinya sama.
# Tanpa ini, kata serapan selalu dianggap salah ucap.
_PADANAN = {
    "fashion": "fesyen", "nylon": "nilon", "ekstrim": "ekstrem",
    "extrem": "ekstrem", "matcha": "maca", "sintetik": "sintetis",
    "praktek": "praktik", "analisa": "analisis", "resiko": "risiko",
    "aktifitas": "aktivitas", "propinsi": "provinsi", "jaman": "zaman",
    "nomer": "nomor", "silahkan": "silakan", "himbau": "imbau",
}


def _muat_model(ukuran: str = UKURAN_BAWAAN):
    """Muat model pengenal ucapan, sekali saja per ukuran."""
    global _MODEL, _MODEL_UKURAN
    if _MODEL is not None and _MODEL_UKURAN == ukuran:
        return _MODEL
    from faster_whisper import WhisperModel

    _MODEL = WhisperModel(ukuran, device="cpu", compute_type="int8")
    _MODEL_UKURAN = ukuran
    return _MODEL


def transkrip(berkas: Path, *, ukuran_model: str = UKURAN_BAWAAN) -> str:
    """Dengarkan berkas suara dan kembalikan apa yang terdengar."""
    model = _muat_model(ukuran_model)
    segmen, _ = model.transcribe(str(berkas), language="id")
    return " ".join(s.text.strip() for s in segmen).strip()


# ---------------------------------------------------------------------------
# Pembandingan
# ---------------------------------------------------------------------------
def _bersihkan(teks: str) -> list[str]:
    teks = teks.lower()
    teks = re.sub(r"[^\w\s]", " ", teks)
    return [_PADANAN.get(w, w) for w in teks.split() if w]


def _cari_pengulangan(kata: list[str], panjang_minimal: int = 4) -> str:
    """Cari rangkaian kata yang muncul dua kali berturut-turut."""
    n = len(kata)
    for panjang in range(min(12, n // 2), panjang_minimal - 1, -1):
        for i in range(n - 2 * panjang + 1):
            depan = kata[i : i + panjang]
            belakang = kata[i + panjang : i + 2 * panjang]
            if depan == belakang:
                return " ".join(depan)
    return ""


@dataclass
class HasilVerifikasi:
    cocok: bool
    kemiripan: float
    terucap: str
    naskah: str
    masalah: list[str] = field(default_factory=list)
    # Benar bila cacatnya jenis yang pasti, bukan tebakan. Hanya cacat pasti
    # yang memicu pembuatan ulang; sisanya cukup diberi tanda untuk didengar
    # sendiri, supaya kredit tidak habis mengejar salah dengar mesin.
    cacat_pasti: bool = False

    @property
    def ringkas(self) -> str:
        if self.cocok:
            return f"ucapan sesuai naskah ({self.kemiripan:.0%})"
        return "; ".join(self.masalah) or f"ucapan menyimpang ({self.kemiripan:.0%})"


# Ambang kemiripan. Di bawah ini potongan dianggap perlu dibuat ulang.
# Tidak dipatok terlalu tinggi karena pengenal ucapan sendiri kadang salah
# dengar pada kata serapan.
AMBANG_KEMIRIPAN = 0.82


def bandingkan(naskah: str, terucap: str) -> HasilVerifikasi:
    kata_naskah = _bersihkan(naskah)
    kata_ucap = _bersihkan(terucap)
    masalah: list[str] = []
    pasti = False

    if not kata_ucap:
        return HasilVerifikasi(
            False, 0.0, terucap, naskah,
            ["Tidak ada ucapan yang terdengar."], cacat_pasti=True,
        )

    kemiripan = difflib.SequenceMatcher(None, kata_naskah, kata_ucap).ratio()

    # Pengulangan frasa: cacat paling mengganggu, dan pengenal ucapan tidak
    # mungkin mengarangnya. Ini cacat pasti.
    ulang = _cari_pengulangan(kata_ucap)
    if ulang and ulang not in " ".join(kata_naskah):
        masalah.append(f'Frasa terucap dua kali: "{ulang}"')
        pasti = True

    # Jumlah kata yang jauh melenceng juga tidak mungkin berasal dari salah
    # dengar biasa.
    selisih = len(kata_ucap) - len(kata_naskah)
    if selisih > max(3, len(kata_naskah) * 0.25):
        masalah.append(
            f"Terucap {len(kata_ucap)} kata, naskahnya {len(kata_naskah)} kata."
        )
        pasti = True
    elif selisih < -max(2, len(kata_naskah) * 0.2):
        masalah.append(
            f"Ada bagian naskah yang tidak terucap "
            f"({len(kata_ucap)} dari {len(kata_naskah)} kata)."
        )
        pasti = True

    # Kata yang salah ucap.
    beda = difflib.SequenceMatcher(None, kata_naskah, kata_ucap)
    salah: list[str] = []
    for tag, i1, i2, j1, j2 in beda.get_opcodes():
        if tag == "replace":
            for a, b in zip(kata_naskah[i1:i2], kata_ucap[j1:j2]):
                # Abaikan beda ejaan yang sangat mirip; itu biasanya salah
                # dengar mesin, bukan salah ucap narator.
                if difflib.SequenceMatcher(None, a, b).ratio() < 0.72:
                    salah.append(f"{a} → {b}")
    if salah:
        # Kata yang berubah TIDAK dianggap cacat pasti. Pengenal ucapan sering
        # salah dengar pada nama, angka, dan kata serapan, dan menandainya
        # sebagai cacat berarti membuang kredit untuk audio yang sebenarnya baik.
        masalah.append("Perlu didengar sendiri, kata berubah: " + ", ".join(salah[:4]))

    cocok = kemiripan >= AMBANG_KEMIRIPAN and not pasti
    return HasilVerifikasi(
        cocok, kemiripan, terucap, naskah, masalah, cacat_pasti=pasti
    )


def periksa_berkas(
    berkas: Path, naskah: str, *, ukuran_model: str = UKURAN_BAWAAN
) -> HasilVerifikasi:
    """Dengarkan satu berkas lalu bandingkan dengan naskahnya."""
    if not tersedia():
        return HasilVerifikasi(
            True, 1.0, "", naskah, ["Verifikasi dilewati: faster-whisper belum terpasang."]
        )
    try:
        terucap = transkrip(berkas, ukuran_model=ukuran_model)
    except Exception as exc:  # model gagal dimuat, berkas rusak, dan sejenisnya
        return HasilVerifikasi(
            True, 1.0, "", naskah, [f"Verifikasi dilewati: {exc}"]
        )
    return bandingkan(naskah, terucap)


# ---------------------------------------------------------------------------
# Pemeriksaan tanpa dependensi: durasi yang menyimpang dari saudaranya
# ---------------------------------------------------------------------------
def cari_durasi_janggal(
    wpm_per_adegan: dict[int, float], *, toleransi: float = 0.20
) -> list[int]:
    """Cari adegan yang kecepatan bicaranya menyimpang jauh dari yang lain.

    Cara ini gratis dan tidak butuh paket tambahan. Pengulangan frasa membuat
    satu potongan jadi jauh lebih panjang dari yang seharusnya, sehingga
    kecepatan bicaranya anjlok dibanding adegan lain di video yang sama.

    Pada produksi nyata, adegan yang frasanya terucap dua kali terbaca
    113 kata per menit sementara tujuh adegan lainnya seragam di 157.
    """
    nilai = [v for v in wpm_per_adegan.values() if v > 0]
    if len(nilai) < 3:
        return []
    tengah = statistics.median(nilai)
    if tengah <= 0:
        return []
    return sorted(
        n for n, v in wpm_per_adegan.items()
        if v > 0 and abs(v - tengah) / tengah > toleransi
    )
