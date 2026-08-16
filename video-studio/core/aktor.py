"""Aktor: ilustrasi AI berlatar transparan yang siap dianimasikan.

Percobaan menggambar semua benda dari nol dengan bentuk geometris gagal
mendekati mutu video acuan. Acuan itu dibuat ilustrator: setiap benda punya
wajah, tangan, dan karakternya sendiri, dan komposisinya padat. Bentuk
primitif tidak akan pernah menyamainya.

Pembagian kerja yang benar:

    model gambar  ->  membuat ilustrasinya  (yang memang keahliannya)
    kode          ->  menggerakkannya       (yang memang keahliannya)

Satu aktor dibuat dua langkah:

  1. google/nano-banana menggambar tokoh atau bendanya      4 kredit
  2. recraft/remove-background memotongnya jadi transparan  1 kredit

Hasilnya disimpan di cache dan bisa dipakai berulang kali di banyak adegan
maupun banyak video, jadi biayanya hanya sekali.
"""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path

from .config import CACHE_DIR
from .kie import KieClient, KieError
from .visuals import unggah_gambar

AKTOR_DIR = CACHE_DIR / "aktor"
AKTOR_DIR.mkdir(parents=True, exist_ok=True)
_INDEKS = AKTOR_DIR / "indeks.json"

BIAYA_GAMBAR = 4.0
BIAYA_POTONG = 1.0
BIAYA_AKTOR = BIAYA_GAMBAR + BIAYA_POTONG

# Gaya yang dipakai untuk SEMUA aktor supaya satu video terlihat sepadan.
# Kalimat terakhir yang paling menentukan: tanpa itu model menggambar latar
# lengkap dan bendanya tidak bisa dipisahkan.
GAYA_AKTOR = (
    "Flat 2D vector illustration in the style of a modern animated explainer "
    "channel. Bold heavily saturated colors, clean geometric shapes, smooth "
    "flat fills with no photographic texture, subtle soft shading only where "
    "it adds form, crisp edges, playful but intelligent mood. "
    "SUBJECT ONLY, ISOLATED ON A PLAIN SOLID WHITE BACKGROUND. "
    "No scenery, no floor, no shadow on the ground, no props other than the "
    "subject, no text, no letters, no watermark. "
    "Centered, entire subject visible with clear margin on every side."
)

# Tambahan untuk benda yang perlu bernyawa, seperti pisang berkaki di acuan.
GAYA_BERNYAWA = (
    "The object is a friendly cartoon character: it has two large white oval "
    "eyes with dark pupils, a small simple mouth, thin flexible rubber-hose "
    "arms ending in white glove hands, and short rubber-hose legs ending in "
    "coloured shoes. "
)


@dataclass
class Aktor:
    kunci: str
    berkas: Path
    prompt: str
    kredit: float = 0.0
    dari_cache: bool = False

    @property
    def ada(self) -> bool:
        return self.berkas.exists() and self.berkas.stat().st_size > 1000


def _muat_indeks() -> dict:
    if _INDEKS.exists():
        try:
            return json.loads(_INDEKS.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def _simpan_indeks(d: dict) -> None:
    _INDEKS.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")


def _slug(teks: str) -> str:
    s = re.sub(r"[^\w\s-]", "", teks.lower()).strip()
    return re.sub(r"[\s_-]+", "-", s)[:40] or "aktor"


def kunci_aktor(nama: str, deskripsi: str, bernyawa: bool) -> str:
    sidik = hashlib.sha1(
        f"{deskripsi}|{bernyawa}|{GAYA_AKTOR}".encode("utf-8")
    ).hexdigest()[:10]
    return f"{_slug(nama)}-{sidik}"


def susun_prompt(deskripsi: str, *, bernyawa: bool = False) -> str:
    inti = deskripsi.strip().rstrip(".")
    hidup = GAYA_BERNYAWA if bernyawa else ""
    return f"{inti}. {hidup}{GAYA_AKTOR}"


def buat_aktor(
    klien: KieClient,
    nama: str,
    deskripsi: str,
    *,
    bernyawa: bool = False,
    rasio: str = "1:1",
    acuan_produk: str | None = None,
    paksa_ulang: bool = False,
    lapor=None,
) -> Aktor:
    """Buat satu aktor berlatar transparan, atau ambil dari cache.

    acuan_produk berisi URL foto produk pengguna. Bila diisi, model menggambar
    ulang benda itu alih-alih mengarang bentuknya sendiri.
    """
    kunci = kunci_aktor(nama, deskripsi + (acuan_produk or ""), bernyawa)
    berkas = AKTOR_DIR / f"{kunci}.png"
    indeks = _muat_indeks()

    if berkas.exists() and not paksa_ulang:
        if lapor:
            lapor(f"♻️ Aktor '{nama}' diambil dari cache, tanpa biaya.")
        return Aktor(kunci, berkas, indeks.get(kunci, {}).get("prompt", ""), 0.0, True)

    prompt = susun_prompt(deskripsi, bernyawa=bernyawa)
    kredit = 0.0

    # --- 1. Gambar ---------------------------------------------------------
    if acuan_produk:
        model, payload = "google/nano-banana-edit", {
            "prompt": (
                "Redraw the product from the reference photo as a flat 2D vector "
                "illustration. Keep its exact silhouette, proportions and colour, "
                "but use clean flat fills without photographic texture or shadow. "
                "Do not copy any text or lettering from the packaging. " + prompt
            ),
            "output_format": "png",
            "image_size": rasio,
            "image_urls": [acuan_produk],
        }
    else:
        model, payload = "google/nano-banana", {
            "prompt": prompt,
            "output_format": "png",
            "image_size": rasio,
        }

    if lapor:
        lapor(f"🎨 Menggambar aktor '{nama}'...")
    hasil = klien.run_task(model, payload, max_wait=420)
    kredit += hasil.credits
    url_mentah = hasil.first_url

    # --- 2. Potong latarnya ------------------------------------------------
    if lapor:
        lapor(f"✂️ Memotong latar '{nama}'...")
    potong = klien.run_task(
        "recraft/remove-background", {"image": url_mentah}, max_wait=300
    )
    kredit += potong.credits
    klien.download(potong.first_url, berkas)

    indeks[kunci] = {"nama": nama, "prompt": prompt, "kredit": kredit}
    _simpan_indeks(indeks)
    if lapor:
        lapor(f"✅ Aktor '{nama}' siap ({kredit:.0f} kredit).")
    return Aktor(kunci, berkas, prompt, kredit, False)


def buat_banyak(
    klien: KieClient,
    daftar: list[dict],
    *,
    paralel: int = 3,
    lapor=None,
) -> dict[str, Aktor]:
    """Buat sekumpulan aktor sekaligus.

    Tiap entri daftar: {"nama":..., "deskripsi":..., "bernyawa":bool,
                        "rasio":..., "acuan_produk":...}
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed

    hasil: dict[str, Aktor] = {}
    gagal: list[str] = []

    def kerjakan(d: dict) -> tuple[str, Aktor]:
        return d["nama"], buat_aktor(
            klien, d["nama"], d["deskripsi"],
            bernyawa=d.get("bernyawa", False),
            rasio=d.get("rasio", "1:1"),
            acuan_produk=d.get("acuan_produk"),
            lapor=lapor,
        )

    with ThreadPoolExecutor(max_workers=max(1, paralel)) as pool:
        tugas = {pool.submit(kerjakan, d): d for d in daftar}
        for fut in as_completed(tugas):
            d = tugas[fut]
            try:
                nama, a = fut.result()
                hasil[nama] = a
            except (KieError, OSError) as exc:
                gagal.append(f"{d['nama']}: {exc}")
                if lapor:
                    lapor(f"❌ Aktor '{d['nama']}' gagal: {exc}")

    if gagal and not hasil:
        raise KieError("Semua aktor gagal dibuat:\n" + "\n".join(gagal))
    return hasil


def perkiraan_biaya(daftar: list[dict]) -> float:
    """Hitung biaya aktor yang belum ada di cache."""
    total = 0.0
    for d in daftar:
        kunci = kunci_aktor(
            d["nama"], d["deskripsi"] + (d.get("acuan_produk") or ""),
            d.get("bernyawa", False),
        )
        if not (AKTOR_DIR / f"{kunci}.png").exists():
            total += BIAYA_AKTOR
    return total


def unggah_foto_produk(klien: KieClient, berkas: Path) -> str:
    return unggah_gambar(klien.api_key, berkas)
