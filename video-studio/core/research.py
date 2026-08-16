"""Riset topik yang selalu segar tetapi tetap nyambung dengan produk.

Sumber data semuanya gratis dan tanpa API key tambahan:
  - Google News RSS (Indonesia)
  - Google Trends RSS (tren harian Indonesia)

Hasil mentah itu diserahkan ke LLM bersama konteks produk, lalu dikembalikan
sebagai kartu topik yang sudah diberi skor. Bila jaringan ke sumber RSS gagal,
aplikasi tetap jalan: LLM diminta membuat topik dari pengetahuan umum dan
kartu topiknya ditandai sebagai "tanpa data tren".
"""
from __future__ import annotations

import html
import re
import urllib.parse
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone

import requests

from .categories import KATEGORI, arketipe_untuk
from .kie import KieClient

_TIMEOUT = 20
_UA = {"User-Agent": "Mozilla/5.0 (compatible; VideoStudio/1.0)"}


@dataclass
class KartuTopik:
    judul: str
    hook: str
    kenapa_sekarang: str
    sudut_soft_sell: str
    arketipe: str
    poin_cerita: list[str] = field(default_factory=list)
    skor_segar: int = 0
    skor_relevan: int = 0
    skor_tahan_tonton: int = 0
    sumber: str = ""

    @property
    def skor_total(self) -> int:
        return self.skor_segar + self.skor_relevan + self.skor_tahan_tonton

    def dict(self) -> dict:
        d = asdict(self)
        d["skor_total"] = self.skor_total
        return d


# ---------------------------------------------------------------------------
# Pengambilan sinyal tren
# ---------------------------------------------------------------------------
def _ambil_rss(url: str, batas: int = 15) -> list[dict[str, str]]:
    """Parser RSS ringan. Sengaja tanpa dependensi XML tambahan."""
    try:
        resp = requests.get(url, timeout=_TIMEOUT, headers=_UA)
        resp.raise_for_status()
    except requests.RequestException:
        return []

    isi = resp.text
    keluaran: list[dict[str, str]] = []
    for blok in re.findall(r"<item>(.*?)</item>", isi, re.DOTALL)[:batas]:
        def tarik(tag: str) -> str:
            m = re.search(rf"<{tag}[^>]*>(.*?)</{tag}>", blok, re.DOTALL)
            if not m:
                return ""
            teks = m.group(1)
            teks = re.sub(r"<!\[CDATA\[(.*?)\]\]>", r"\1", teks, flags=re.DOTALL)
            teks = re.sub(r"<[^>]+>", "", teks)
            return html.unescape(teks).strip()

        judul = tarik("title")
        if judul:
            keluaran.append(
                {
                    "judul": judul,
                    "tanggal": tarik("pubDate"),
                    "ringkas": tarik("description")[:200],
                }
            )
    return keluaran


def berita_terkait(kata_kunci: str, batas: int = 12) -> list[dict[str, str]]:
    """Berita Indonesia terbaru untuk sebuah kata kunci."""
    q = urllib.parse.quote(kata_kunci)
    url = f"https://news.google.com/rss/search?q={q}&hl=id&gl=ID&ceid=ID:id"
    return _ambil_rss(url, batas)


def tren_harian(batas: int = 20) -> list[dict[str, str]]:
    """Pencarian yang sedang naik di Indonesia hari ini."""
    return _ambil_rss("https://trends.google.com/trending/rss?geo=ID", batas)


def kumpulkan_sinyal(produk: str, kode_kategori: str) -> dict[str, list]:
    """Kumpulkan semua sinyal tren yang relevan dengan produk."""
    kat = KATEGORI.get(kode_kategori)
    kueri = [produk]
    if kat:
        # Gabungkan produk dengan tema bahasan agar berita yang ditarik
        # tidak melenceng jauh dari materi yang bisa dijadikan cerita.
        kueri.extend(f"{produk} {tema}" for tema in kat.tema_bahasan[:3])

    berita: list[dict[str, str]] = []
    terlihat: set[str] = set()
    for k in kueri:
        for item in berita_terkait(k, batas=6):
            kunci = item["judul"].lower()[:80]
            if kunci not in terlihat:
                terlihat.add(kunci)
                berita.append(item)

    return {"berita": berita[:18], "tren": tren_harian(15)}


# ---------------------------------------------------------------------------
# Sintesis topik
# ---------------------------------------------------------------------------
_SISTEM = """Kamu adalah perencana konten video pendek Bahasa Indonesia yang sangat berpengalaman.

Keahlianmu adalah menemukan sudut cerita yang membuat orang menonton sampai habis,
TANPA terasa sedang menjual apa pun. Penonton harus merasa sedang belajar sesuatu
yang menarik, bukan sedang menonton iklan.

Aturan yang tidak boleh dilanggar:
- Topik TIDAK BOLEH berupa promosi produk. Produk hanya boleh muncul sebagai
  akibat wajar dari cerita, di bagian paling akhir.
- Topik harus benar secara faktual. Jangan mengarang data, angka, atau sejarah.
  Kalau tidak yakin pada sebuah angka, jangan pakai angka itu.
- Topik harus punya alasan "kenapa dibahas sekarang" yang masuk akal.
- Bahasa Indonesia baku tapi hidup. Hindari bahasa kaku ala siaran pers.
"""


def _prompt_topik(
    produk: str,
    kode_kategori: str,
    sinyal: dict[str, list],
    jumlah: int,
    catatan: str,
) -> str:
    kat = KATEGORI[kode_kategori]
    arket = arketipe_untuk(kode_kategori)
    daftar_arketipe = "\n".join(
        f"- {a.kode}: {a.nama} — {a.penjelasan}" for a in arket
    )

    baris_berita = "\n".join(f"- {b['judul']}" for b in sinyal.get("berita", [])[:15])
    baris_tren = "\n".join(f"- {t['judul']}" for t in sinyal.get("tren", [])[:15])
    hari_ini = datetime.now(timezone.utc).strftime("%d %B %Y")

    return f"""Buatkan {jumlah} ide topik video pendek berdurasi 60-75 detik.

PRODUK YANG AKAN DIPROMOSIKAN SECARA HALUS: {produk}
KATEGORI: {kat.nama}
TANGGAL HARI INI: {hari_ini}
FOKUS RISET KATEGORI INI: {kat.catatan_riset}
{f'CATATAN TAMBAHAN DARI PENGGUNA: {catatan}' if catatan else ''}

BERITA INDONESIA TERBARU YANG RELEVAN:
{baris_berita or '(tidak ada data berita — andalkan pengetahuan umum)'}

YANG SEDANG DICARI ORANG INDONESIA HARI INI:
{baris_tren or '(tidak ada data tren)'}

ARKETIPE CERITA YANG BOLEH DIPAKAI:
{daftar_arketipe}

Untuk setiap ide, tentukan:
- judul: judul kerja topiknya, maksimal 10 kata
- hook: kalimat pertama video, maksimal 15 kata, harus bikin orang berhenti menggulir.
  Gunakan orang kedua ("kamu") bila cocok. Jangan pakai angka dalam bentuk digit.
- kenapa_sekarang: alasan topik ini relevan dibahas minggu ini
- sudut_soft_sell: jelaskan bagaimana {produk} muncul di akhir sebagai kesimpulan
  yang wajar, bukan sebagai iklan. Maksimal 2 kalimat.
- arketipe: pilih satu kode arketipe dari daftar di atas
- poin_cerita: 4 sampai 6 poin urutan cerita, masing-masing satu kalimat pendek
- skor_segar: 1-10, seberapa baru dan belum sering dibahas
- skor_relevan: 1-10, seberapa nyambung dengan {produk}
- skor_tahan_tonton: 1-10, seberapa kuat menahan penonton sampai detik terakhir

Balas sebagai array JSON berisi {jumlah} objek dengan kunci persis seperti di atas."""


def cari_topik(
    klien: KieClient,
    produk: str,
    kode_kategori: str,
    *,
    jumlah: int = 6,
    catatan: str = "",
    model: str | None = None,
    pakai_tren: bool = True,
) -> tuple[list[KartuTopik], dict[str, list]]:
    """Hasilkan kartu topik yang sudah diurutkan dari yang terkuat."""
    sinyal: dict[str, list] = {"berita": [], "tren": []}
    if pakai_tren:
        sinyal = kumpulkan_sinyal(produk, kode_kategori)

    ada_sinyal = bool(sinyal.get("berita") or sinyal.get("tren"))
    prompt = _prompt_topik(produk, kode_kategori, sinyal, jumlah, catatan)
    data = klien.chat_json(prompt, system=_SISTEM, model=model, max_tokens=9000)

    if isinstance(data, dict):
        # Kadang LLM membungkusnya dalam sebuah kunci.
        for nilai in data.values():
            if isinstance(nilai, list):
                data = nilai
                break
    if not isinstance(data, list):
        raise ValueError("Balasan riset topik bukan berupa daftar.")

    kartu: list[KartuTopik] = []
    for item in data:
        if not isinstance(item, dict):
            continue
        poin = item.get("poin_cerita") or []
        if isinstance(poin, str):
            poin = [p.strip() for p in poin.split("\n") if p.strip()]
        kartu.append(
            KartuTopik(
                judul=str(item.get("judul", "")).strip(),
                hook=str(item.get("hook", "")).strip(),
                kenapa_sekarang=str(item.get("kenapa_sekarang", "")).strip(),
                sudut_soft_sell=str(item.get("sudut_soft_sell", "")).strip(),
                arketipe=str(item.get("arketipe", "sejarah")).strip(),
                poin_cerita=[str(p) for p in poin],
                skor_segar=_angka(item.get("skor_segar")),
                skor_relevan=_angka(item.get("skor_relevan")),
                skor_tahan_tonton=_angka(item.get("skor_tahan_tonton")),
                sumber="tren + berita" if ada_sinyal else "tanpa data tren",
            )
        )

    kartu.sort(key=lambda k: k.skor_total, reverse=True)
    return kartu, sinyal


def _angka(v: object, bawaan: int = 5) -> int:
    try:
        return max(1, min(10, int(float(str(v)))))
    except (TypeError, ValueError):
        return bawaan
