"""Universe saham yang dipindai.

Default: konstituen LQ45 periode 3 Agustus - 30 Oktober 2026 (evaluasi BEI, sumber: kontan.co.id/indeks-lq45,
liputan6.com). LQ45 dipilih karena likuiditasnya menjamin spread tipis dan risiko "nyangkut" lebih rendah.
Perbarui daftar ini setiap rebalancing (kuartalan) dari https://www.idx.co.id/id/data-pasar/data-saham/indeks-saham/
atau tambahkan ticker lain lewat file data/watchlist.txt (satu kode per baris).
"""
from __future__ import annotations

from pathlib import Path

LQ45_PERIOD = "Agu-Okt 2026"

# kode -> nama emiten (dipakai untuk query berita)
LQ45: dict[str, str] = {
    "AADI": "Adaro Andalan Indonesia", "ADMR": "Adaro Minerals Indonesia", "ADRO": "Alamtri Resources Indonesia",
    "AKRA": "AKR Corporindo", "AMMN": "Amman Mineral Internasional", "AMRT": "Sumber Alfaria Trijaya",
    "ANTM": "Aneka Tambang", "ASII": "Astra International", "BBCA": "Bank Central Asia",
    "BBNI": "Bank Negara Indonesia", "BBRI": "Bank Rakyat Indonesia", "BBTN": "Bank Tabungan Negara",
    "BMRI": "Bank Mandiri", "BRPT": "Barito Pacific", "BUMI": "Bumi Resources", "CPIN": "Charoen Pokphand Indonesia",
    "CUAN": "Petrindo Jaya Kreasi", "DEWA": "Darma Henwa", "EMTK": "Elang Mahkota Teknologi",
    "ESSA": "ESSA Industries Indonesia", "EXCL": "XLSmart Telecom Sejahtera", "GOTO": "GoTo Gojek Tokopedia",
    "HRTA": "Hartadinata Abadi", "ICBP": "Indofood CBP Sukses Makmur", "INCO": "Vale Indonesia",
    "INDF": "Indofood Sukses Makmur", "INDY": "Indika Energy", "INKP": "Indah Kiat Pulp & Paper",
    "ISAT": "Indosat Ooredoo Hutchison", "ITMG": "Indo Tambangraya Megah", "JPFA": "Japfa Comfeed Indonesia",
    "KLBF": "Kalbe Farma", "MAPI": "Mitra Adiperkasa", "MBMA": "Merdeka Battery Materials",
    "MDKA": "Merdeka Copper Gold", "MEDC": "Medco Energi Internasional", "NCKL": "Trimegah Bangun Persada",
    "PGAS": "Perusahaan Gas Negara", "PGEO": "Pertamina Geothermal Energy", "PTBA": "Bukit Asam",
    "SCMA": "Surya Citra Media", "TLKM": "Telkom Indonesia", "UNTR": "United Tractors",
    "UNVR": "Unilever Indonesia", "WIFI": "Solusi Sinergi Digital",
}

WATCHLIST_FILE = Path(__file__).resolve().parent.parent / "data" / "watchlist.txt"


def load_watchlist() -> list[str]:
    if not WATCHLIST_FILE.exists():
        return []
    out = []
    for line in WATCHLIST_FILE.read_text().splitlines():
        t = line.split("#")[0].strip().upper()
        if t:
            out.append(t)
    return out


def default_universe() -> list[str]:
    seen = dict.fromkeys(list(LQ45) + load_watchlist())
    return list(seen)


def company_name(ticker: str) -> str | None:
    return LQ45.get(ticker.upper())
