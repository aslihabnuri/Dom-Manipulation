"""Normalisasi teks Bahasa Indonesia untuk dubbing.

Ini adalah pertahanan utama terhadap "slip of tongue" pada mesin TTS.
Kie tidak menyediakan speech-to-text, jadi kita tidak bisa memverifikasi
hasil suara secara otomatis lewat Kie. Sebagai gantinya kita menghilangkan
penyebab kesalahan SEBELUM teks dikirim ke TTS:

1. Angka, tahun, mata uang, persen, dan satuan diubah menjadi kata.
   Mesin TTS paling sering keseleo saat membaca "1972" atau "Rp250.000".
2. Singkatan ("yg", "dll", "tsb") dipanjangkan.
3. Kata serapan Inggris ditulis ulang secara fonetis Indonesia,
   supaya tidak dibaca dengan logat yang salah.
4. Kata ber-"e" ambigu (taling vs pepet) diberi tanda aksen.
5. Kalimat yang terlalu panjang atau sulit diucapkan ditandai untuk direvisi.

Semua aturan bisa ditimpa pengguna lewat kamus di halaman Pengaturan.
"""
from __future__ import annotations

import json
import re
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path

from .config import CACHE_DIR

# ---------------------------------------------------------------------------
# Angka -> kata
# ---------------------------------------------------------------------------
_SATUAN = [
    "nol", "satu", "dua", "tiga", "empat",
    "lima", "enam", "tujuh", "delapan", "sembilan",
]
_SKALA = [
    (10**12, "triliun"),
    (10**9, "miliar"),
    (10**6, "juta"),
    (10**3, "ribu"),
    (100, "ratus"),
]


def angka_ke_kata(n: int) -> str:
    """Ubah bilangan bulat menjadi ejaan Bahasa Indonesia."""
    if n < 0:
        return "minus " + angka_ke_kata(-n)
    if n < 10:
        return _SATUAN[n]
    if n < 12:
        return {10: "sepuluh", 11: "sebelas"}[n]
    if n < 20:
        return f"{_SATUAN[n - 10]} belas"
    if n < 100:
        puluh, sisa = divmod(n, 10)
        out = f"{_SATUAN[puluh]} puluh"
        return f"{out} {_SATUAN[sisa]}" if sisa else out

    for nilai, nama in _SKALA:
        if n >= nilai:
            depan, sisa = divmod(n, nilai)
            # "seratus"/"seribu", bukan "satu ratus"/"satu ribu".
            if depan == 1 and nama in ("ratus", "ribu"):
                kepala = f"se{nama}"
            else:
                kepala = f"{angka_ke_kata(depan)} {nama}"
            return f"{kepala} {angka_ke_kata(sisa)}".strip() if sisa else kepala
    return str(n)


def _desimal_ke_kata(teks: str) -> str:
    """'3,5' -> 'tiga koma lima'  (digit setelah koma dieja satu per satu)."""
    bulat, _, pecahan = teks.partition(",")
    kiri = angka_ke_kata(int(bulat)) if bulat.isdigit() else bulat
    kanan = " ".join(_SATUAN[int(d)] for d in pecahan if d.isdigit())
    return f"{kiri} koma {kanan}".strip()


# ---------------------------------------------------------------------------
# Kamus bawaan
# ---------------------------------------------------------------------------
SINGKATAN = {
    "yg": "yang", "dg": "dengan", "dgn": "dengan", "dll": "dan lain-lain",
    "dsb": "dan sebagainya", "dst": "dan seterusnya", "tsb": "tersebut",
    "sbg": "sebagai", "utk": "untuk", "dr": "dari", "pd": "pada",
    "kpd": "kepada", "spt": "seperti", "krn": "karena", "tdk": "tidak",
    "blm": "belum", "sdh": "sudah", "udh": "sudah", "jg": "juga",
    "hrs": "harus", "bs": "bisa", "org": "orang", "thn": "tahun",
    "bln": "bulan", "hr": "hari", "jd": "jadi", "sm": "sama",
    "tp": "tapi", "klo": "kalau", "kl": "kalau", "bgt": "banget",
    "aja": "saja", "gak": "tidak", "ga": "tidak", "nggak": "tidak",
    "sy": "saya", "km": "kamu", "kmrn": "kemarin", "skrg": "sekarang",
    "no": "nomor", "hlm": "halaman", "a.n": "atas nama",
}

SATUAN_UKUR = {
    "kg": "kilogram", "gr": "gram", "g": "gram", "mg": "miligram",
    "ml": "mililiter", "l": "liter", "cm": "sentimeter", "mm": "milimeter",
    "m": "meter", "km": "kilometer", "km/jam": "kilometer per jam",
    "%": "persen", "°c": "derajat celsius", "°f": "derajat fahrenheit",
    "kkal": "kilokalori", "kal": "kalori", "jt": "juta", "rb": "ribu",
}

# Kata serapan Inggris -> ejaan fonetis Indonesia.
# Tujuannya agar TTS Bahasa Indonesia tidak membacanya dengan aturan Inggris.
FONETIS_ASING = {
    "matcha": "maca", "latte": "late", "espresso": "esprèso",
    "smoothie": "smudi", "brownies": "brownis", "cheese": "cis",
    "cake": "kèik", "cookies": "kukis", "sourdough": "sordo",
    "croissant": "kroasan", "dessert": "dizèrt", "gelato": "jelato",
    "milkshake": "milksyèik", "frappe": "frapé", "boba": "boba",
    "handbag": "hènbèg", "tote": "tot", "clutch": "klac",
    "vintage": "vintèj", "leather": "lèder", "canvas": "kènvas",
    "denim": "dènim", "blazer": "blèzer", "outfit": "autfit",
    "streetwear": "stritwèr", "sneakers": "snikers", "hoodie": "hudi",
    "casual": "kèsual", "luxury": "laksyeri", "brand": "brènd",
    "trend": "trèn", "trendy": "trèndi", "style": "stail",
    "hype": "haip", "review": "rivyu", "content": "kontèn",
    "checkout": "cèk-aut", "voucher": "voucer", "discount": "diskaun",
}

# Kata dengan "e" ambigu: taling (é) vs pepet (ê).
# Ditulis ulang dengan aksen agar mesin TTS memilih bunyi yang benar.
AKSEN_E = {
    "tempe": "témpé", "sate": "saté", "kue": "kué", "es": "és",
    "becak": "bécak", "lele": "lélé", "bebek": "bébék", "tape": "tapé",
    "cabe": "cabé", "toge": "togé", "pete": "peté", "mie": "mié",
    "kecap": "kécap", "gede": "gedé", "sore": "soré", "boneka": "bonéka",
    "kafe": "kafé", "teh": "téh", "rempeyek": "rempéyék",
    "mode": "modé", "model": "modél", "kemeja": "keméja",
    "sepeda": "sepéda", "meja": "méja", "nenek": "nénék",
    "kakek": "kakék", "apotek": "apoték", "efek": "éfék",
    "metode": "métode", "energi": "énergi", "ekonomi": "ékonomi",
}

# Kata yang sering dibaca salah oleh TTS dan sebaiknya dihindari/diganti.
KATA_RAWAN = {
    "mental": "bisa dibaca 'mèntal' (terpental) atau 'mêntal' (jiwa) — perjelas konteksnya",
    "apel": "bisa 'apêl' (buah) atau 'apél' (upacara)",
    "serang": "bisa 'sêrang' (menyerbu) atau 'Sérang' (kota)",
    "seri": "bisa 'sêri' (imbang) atau 'séri' (rangkaian)",
    "per": "sering dibaca sebagai huruf; tulis 'per' dalam kalimat utuh",
    "beri": "bisa 'bêri' (memberi) atau 'béri' (buah beri)",
    "teras": "bisa 'têras' (inti) atau 'téras' (beranda)",
    "semi": "bisa 'sêmi' (bertunas) atau 'sémi' (setengah)",
}


# ---------------------------------------------------------------------------
# Kamus buatan pengguna
# ---------------------------------------------------------------------------
_KAMUS_PATH = CACHE_DIR / "kamus_pengucapan.json"


def muat_kamus() -> dict[str, str]:
    if _KAMUS_PATH.exists():
        try:
            data = json.loads(_KAMUS_PATH.read_text(encoding="utf-8"))
            if isinstance(data, dict):
                return {str(k).lower(): str(v) for k, v in data.items()}
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def simpan_kamus(kamus: dict[str, str]) -> None:
    _KAMUS_PATH.write_text(
        json.dumps(kamus, indent=2, ensure_ascii=False), encoding="utf-8"
    )


# ---------------------------------------------------------------------------
# Hasil pemeriksaan
# ---------------------------------------------------------------------------
@dataclass
class Temuan:
    tingkat: str  # "kritis" | "peringatan" | "info"
    pesan: str
    kutipan: str = ""

    @property
    def ikon(self) -> str:
        return {"kritis": "🔴", "peringatan": "🟡", "info": "🔵"}.get(self.tingkat, "•")


@dataclass
class HasilNormalisasi:
    asli: str
    hasil: str
    perubahan: list[tuple[str, str]] = field(default_factory=list)
    temuan: list[Temuan] = field(default_factory=list)

    @property
    def aman(self) -> bool:
        return not any(t.tingkat == "kritis" for t in self.temuan)

    @property
    def jumlah_kata(self) -> int:
        return len(self.hasil.split())

    def perkiraan_durasi(self, wpm: int = 150) -> float:
        """Perkiraan durasi bicara dalam detik pada kecepatan tertentu."""
        return self.jumlah_kata / max(wpm, 1) * 60.0


# ---------------------------------------------------------------------------
# Normalisasi
# ---------------------------------------------------------------------------
# Pemisah ribuan boleh muncul di tengah, tetapi angka tidak boleh berakhir
# dengan titik — titik terakhir hampir selalu penutup kalimat, bukan pemisah.
_RE_RUPIAH = re.compile(r"\bRp\.?\s*(\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:,\d+)?)", re.IGNORECASE)
_RE_PERSEN = re.compile(r"(\d+(?:[.,]\d+)?)\s*%")
_RE_TAHUN_RENTANG = re.compile(r"\b(1[5-9]\d{2}|20\d{2})\s*[-–]\s*(1[5-9]\d{2}|20\d{2})\b")
_RE_DESIMAL = re.compile(r"\b(\d+),(\d+)\b")
_RE_RIBUAN = re.compile(r"\b(\d{1,3}(?:\.\d{3})+)\b")
_RE_ANGKA = re.compile(r"\b(\d+)\b")
_RE_SUHU = re.compile(r"(\d+)\s*°\s*([CF])", re.IGNORECASE)


def normalisasi(
    teks: str,
    *,
    kamus_tambahan: dict[str, str] | None = None,
    pakai_aksen: bool = True,
    pakai_fonetis: bool = True,
) -> HasilNormalisasi:
    """Ubah teks mentah menjadi teks siap-baca untuk mesin TTS."""
    asli = teks
    perubahan: list[tuple[str, str]] = []
    temuan: list[Temuan] = []

    def catat(sebelum: str, sesudah: str) -> None:
        if sebelum != sesudah:
            perubahan.append((sebelum, sesudah))

    t = unicodedata.normalize("NFC", teks)
    t = t.replace("​", "").replace("—", " — ").replace("–", "-")
    t = re.sub(r"[ \t]+", " ", t)

    # 1. Suhu, sebelum angka polos diproses.
    def _suhu(m: re.Match[str]) -> str:
        unit = "celsius" if m.group(2).upper() == "C" else "fahrenheit"
        hasil = f"{angka_ke_kata(int(m.group(1)))} derajat {unit}"
        catat(m.group(0), hasil)
        return hasil

    t = _RE_SUHU.sub(_suhu, t)

    # 2. Mata uang.
    def _rupiah(m: re.Match[str]) -> str:
        angka = m.group(1).replace(".", "")
        if "," in angka:
            hasil = _desimal_ke_kata(angka) + " rupiah"
        elif angka.isdigit():
            hasil = angka_ke_kata(int(angka)) + " rupiah"
        else:
            return m.group(0)
        catat(m.group(0), hasil)
        return hasil

    t = _RE_RUPIAH.sub(_rupiah, t)

    # 3. Persen.
    def _persen(m: re.Match[str]) -> str:
        nilai = m.group(1)
        kata = _desimal_ke_kata(nilai) if "," in nilai else angka_ke_kata(int(float(nilai)))
        hasil = f"{kata} persen"
        catat(m.group(0), hasil)
        return hasil

    t = _RE_PERSEN.sub(_persen, t)

    # 4. Rentang tahun: "1990-2000" -> "... sampai ...".
    def _rentang(m: re.Match[str]) -> str:
        hasil = f"{angka_ke_kata(int(m.group(1)))} sampai {angka_ke_kata(int(m.group(2)))}"
        catat(m.group(0), hasil)
        return hasil

    t = _RE_TAHUN_RENTANG.sub(_rentang, t)

    # 5. Satuan ukur. Harus lebih dulu dari konversi angka, karena setelah
    #    "1,2" menjadi "satu koma dua" satuan "kg" kehilangan angka acuannya.
    def _eja_bilangan(mentah: str) -> str:
        bersih = mentah.replace(".", "")
        if "," in bersih:
            return _desimal_ke_kata(bersih)
        return angka_ke_kata(int(bersih)) if bersih.isdigit() else mentah

    for singkat, panjang in sorted(SATUAN_UKUR.items(), key=lambda kv: -len(kv[0])):
        if singkat in ("%", "°c", "°f"):
            continue
        pola = re.compile(
            rf"(\d{{1,3}}(?:\.\d{{3}})*(?:,\d+)?|\d+(?:,\d+)?)\s*{re.escape(singkat)}\b",
            re.IGNORECASE,
        )

        def _satuan(m: re.Match[str], p: str = panjang) -> str:
            hasil = f"{_eja_bilangan(m.group(1))} {p}"
            catat(m.group(0), hasil)
            return hasil

        t = pola.sub(_satuan, t)

    # 6. Angka berpemisah ribuan: "250.000".
    def _ribuan(m: re.Match[str]) -> str:
        hasil = angka_ke_kata(int(m.group(1).replace(".", "")))
        catat(m.group(0), hasil)
        return hasil

    t = _RE_RIBUAN.sub(_ribuan, t)

    # 7. Desimal.
    def _desimal(m: re.Match[str]) -> str:
        hasil = _desimal_ke_kata(f"{m.group(1)},{m.group(2)}")
        catat(m.group(0), hasil)
        return hasil

    t = _RE_DESIMAL.sub(_desimal, t)

    # 8. Sisa angka polos (termasuk tahun).
    def _angka(m: re.Match[str]) -> str:
        hasil = angka_ke_kata(int(m.group(1)))
        catat(m.group(0), hasil)
        return hasil

    t = _RE_ANGKA.sub(_angka, t)

    # 9. Singkatan. Titik singkatan hanya dibuang bila jelas berada di tengah
    #    kalimat (diikuti huruf kecil); titik penutup kalimat dipertahankan.
    for singkat, panjang in SINGKATAN.items():
        esc = re.escape(singkat)
        tengah = re.compile(rf"\b{esc}\.(?=\s+[a-z])", re.IGNORECASE)
        akhir = re.compile(rf"\b{esc}\.(?=\s*$|\s+[A-Z])", re.IGNORECASE)
        polos = re.compile(rf"\b{esc}\b(?!\.)", re.IGNORECASE)
        if tengah.search(t) or akhir.search(t) or polos.search(t):
            t = tengah.sub(panjang, t)
            t = akhir.sub(panjang + ".", t)
            t = polos.sub(panjang, t)
            catat(singkat, panjang)

    # 10. Kamus pengguna menang atas kamus bawaan.
    kamus_user = dict(muat_kamus())
    if kamus_tambahan:
        kamus_user.update({k.lower(): v for k, v in kamus_tambahan.items()})

    peta: dict[str, str] = {}
    if pakai_fonetis:
        peta.update(FONETIS_ASING)
    if pakai_aksen:
        peta.update(AKSEN_E)
    peta.update(kamus_user)  # override pengguna paling akhir

    def _samakan_kapital(asal: str, pengganti: str) -> str:
        """Pertahankan huruf besar di awal kata agar kalimat tidak jadi kacau."""
        if asal[:1].isupper():
            return pengganti[:1].upper() + pengganti[1:]
        return pengganti

    for kata, ganti in sorted(peta.items(), key=lambda kv: -len(kv[0])):
        pola = re.compile(rf"\b{re.escape(kata)}\b", re.IGNORECASE)
        if pola.search(t):
            t = pola.sub(lambda m, g=ganti: _samakan_kapital(m.group(0), g), t)
            catat(kata, ganti)

    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"\s+([,.!?;:])", r"\1", t)

    temuan.extend(periksa(t, asli))
    return HasilNormalisasi(asli=asli, hasil=t, perubahan=perubahan, temuan=temuan)


# ---------------------------------------------------------------------------
# Pemeriksaan kualitas naskah
# ---------------------------------------------------------------------------
_RE_LATIN_ASING = re.compile(
    r"\b(?:the|and|with|your|you|this|that|for|from|our|are|is|was|"
    r"very|best|new|now|more|less|just|only|all|can|will|make|made|"
    r"how|why|what|when|who|which|because|but|however)\b",
    re.IGNORECASE,
)


def periksa(teks: str, asli: str = "") -> list[Temuan]:
    """Cari hal-hal yang bisa membuat pengisi suara keseleo."""
    hasil: list[Temuan] = []
    sumber = asli or teks

    # Angka yang lolos normalisasi.
    sisa_angka = re.findall(r"\d+", teks)
    if sisa_angka:
        hasil.append(
            Temuan(
                "kritis",
                f"Masih ada angka mentah yang belum dieja: {', '.join(sisa_angka[:5])}. "
                "Mesin TTS sering salah membaca angka.",
                ", ".join(sisa_angka[:5]),
            )
        )

    # Kalimat terlalu panjang -> narator kehabisan napas.
    for kalimat in re.split(r"(?<=[.!?])\s+", teks):
        jumlah = len(kalimat.split())
        if jumlah > 28:
            hasil.append(
                Temuan(
                    "peringatan",
                    f"Kalimat sepanjang {jumlah} kata sulit dibaca dalam satu tarikan napas. "
                    "Pecah jadi dua kalimat.",
                    kalimat[:90] + ("..." if len(kalimat) > 90 else ""),
                )
            )

    # Kata Inggris yang tersisa.
    asing = sorted(set(m.group(0).lower() for m in _RE_LATIN_ASING.finditer(teks)))
    if asing:
        hasil.append(
            Temuan(
                "peringatan",
                f"Ada kata Inggris yang akan dibaca dengan logat Indonesia: "
                f"{', '.join(asing[:6])}. Ganti dengan padanan Indonesia.",
                ", ".join(asing[:6]),
            )
        )

    # Kata rawan salah baca.
    for kata, alasan in KATA_RAWAN.items():
        if re.search(rf"\b{kata}\b", teks, re.IGNORECASE):
            hasil.append(Temuan("peringatan", f"Kata '{kata}': {alasan}.", kata))

    # Aliterasi berlebihan (pemicu klasik keseleo lidah).
    kata_kata = re.findall(r"\b\w+\b", teks.lower())
    for i in range(len(kata_kata) - 2):
        tiga = kata_kata[i : i + 3]
        if all(len(w) > 3 for w in tiga) and len({w[:2] for w in tiga}) == 1:
            hasil.append(
                Temuan(
                    "peringatan",
                    "Tiga kata berurutan berawalan sama — berisiko keseleo lidah.",
                    " ".join(tiga),
                )
            )
            break

    # Pengulangan suku kata di batas kata ("kata takan", "makan kanan").
    for i in range(len(kata_kata) - 1):
        a, b = kata_kata[i], kata_kata[i + 1]
        if len(a) > 2 and len(b) > 2 and a[-2:] == b[:2]:
            hasil.append(
                Temuan(
                    "info",
                    "Akhiran dan awalan kata bersambung mirip; ucapan bisa terdengar menyatu.",
                    f"{a} {b}",
                )
            )
            break

    # Tanda baca yang tidak dibaca sebagai jeda.
    if re.search(r"[/\\|*_#<>{}\[\]]", teks):
        hasil.append(
            Temuan(
                "kritis",
                "Ada simbol (/ \\ | * _ # dan sejenisnya) yang bisa dibaca keras oleh TTS. "
                "Hapus atau ganti dengan kata.",
            )
        )

    # Huruf kapital semua -> sering dieja per huruf.
    for m in re.finditer(r"\b[A-Z]{2,}\b", sumber):
        if m.group(0) not in ("AI",):
            hasil.append(
                Temuan(
                    "info",
                    f"'{m.group(0)}' ditulis kapital semua dan mungkin dieja per huruf. "
                    "Tulis apa adanya bila ingin dibaca sebagai kata.",
                    m.group(0),
                )
            )
            break

    return hasil


def pecah_kalimat(teks: str) -> list[str]:
    """Pecah naskah jadi kalimat untuk penjadwalan takarir."""
    bagian = re.split(r"(?<=[.!?])\s+", teks.strip())
    return [b.strip() for b in bagian if b.strip()]


def kelompok_takarir(teks: str, maks_kata: int = 4) -> list[str]:
    """Kelompokkan kata menjadi baris takarir pendek seperti video referensi.

    Video acuan menampilkan 2-4 kata sekaligus dan berganti mengikuti ucapan.
    """
    keluaran: list[str] = []
    for kalimat in pecah_kalimat(teks):
        kata = kalimat.split()
        i = 0
        while i < len(kata):
            potong = kata[i : i + maks_kata]
            # Hindari baris terakhir yang cuma satu kata.
            sisa = len(kata) - (i + maks_kata)
            if sisa == 1 and len(potong) > 1:
                potong = kata[i : i + maks_kata + 1]
                i += 1
            keluaran.append(" ".join(potong))
            i += maks_kata
    return keluaran
