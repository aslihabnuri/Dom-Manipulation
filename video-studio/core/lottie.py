"""Memakai animasi Lottie sebagai adegan video.

Lottie adalah format ekspor After Effects. Berkasnya berupa JSON berisi
seluruh data animasi: bentuk, kurva gerak, dan kerangka tokoh. Artinya
animasi yang dibuat animator profesional bisa dipakai langsung, termasuk
tokoh yang benar-benar melangkah dan menggerakkan tangannya.

Ini menutup keterbatasan yang tidak bisa diatasi dengan menggerakkan gambar
diam: aktor hasil model gambar hanya bisa digeser dan diputar sebagai satu
benda kaku, sedangkan tokoh Lottie punya kerangka di dalamnya.

Cara kerjanya:

    berkas .json  ->  lottie-web di Chromium  ->  tangkap tiap bingkai  ->  PNG
                                                                            |
                                                video  <-  ffmpeg  <--------+

Warna dan teks di dalamnya bisa diubah lewat kode, jadi satu animasi bisa
disesuaikan dengan palet tiap adegan.
"""
from __future__ import annotations

import json
import re
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

import requests

from .anim import chromium_tersedia, rangkai_video
from .config import CACHE_DIR, RENDER

LOTTIE_DIR = CACHE_DIR / "lottie"
LOTTIE_DIR.mkdir(parents=True, exist_ok=True)

# Pustaka pemutar. Diunduh sekali lalu disimpan supaya render tidak
# bergantung pada jaringan.
PEMUTAR_URL = "https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js"
PEMUTAR = LOTTIE_DIR / "lottie.min.js"

# Alamat berkas di jaringan pengiriman LottieFiles. Pencarian katalognya
# tidak terbuka untuk umum, jadi ID animasinya harus sudah diketahui.
POLA_CDN = "https://assets{n}.lottiefiles.com/packages/{id}.json"


@dataclass
class Animasi:
    berkas: Path
    lebar: int
    tinggi: int
    fps: float
    bingkai: int

    @property
    def durasi(self) -> float:
        return self.bingkai / max(self.fps, 1)


class LottieGagal(RuntimeError):
    pass


# ---------------------------------------------------------------------------
# Pengambilan berkas
# ---------------------------------------------------------------------------
def _pastikan_pemutar() -> Path:
    if PEMUTAR.exists() and PEMUTAR.stat().st_size > 100_000:
        return PEMUTAR
    try:
        r = requests.get(PEMUTAR_URL, timeout=90)
        r.raise_for_status()
        PEMUTAR.write_bytes(r.content)
    except requests.RequestException as exc:
        raise LottieGagal(
            "Gagal mengunduh pustaka pemutar Lottie. Periksa koneksi internet."
        ) from exc
    return PEMUTAR


def _id_dari_alamat(alamat: str) -> str:
    """Ambil kode animasi dari berbagai bentuk alamat LottieFiles."""
    m = re.search(r"(lf\d{2}_[A-Za-z0-9]+)", alamat)
    if m:
        return m.group(1)
    return alamat.strip().strip("/").split("/")[-1].replace(".json", "")


def ambil(alamat: str, nama: str = "") -> Path:
    """Unduh satu berkas Lottie. Menerima URL penuh maupun kode animasinya."""
    kode = _id_dari_alamat(alamat)
    tujuan = LOTTIE_DIR / f"{nama or kode}.json"
    if tujuan.exists() and tujuan.stat().st_size > 500:
        return tujuan

    calon: list[str] = []
    if alamat.startswith("http") and alamat.endswith(".json"):
        calon.append(alamat)
    calon += [POLA_CDN.format(n=n, id=kode) for n in range(1, 11)]

    galat = ""
    for url in calon:
        try:
            r = requests.get(url, timeout=45)
            if r.status_code == 200 and r.content.strip().startswith(b"{"):
                tujuan.write_bytes(r.content)
                return tujuan
            galat = f"HTTP {r.status_code}"
        except requests.RequestException as exc:
            galat = str(exc)
    raise LottieGagal(
        f"Animasi '{alamat}' tidak bisa diunduh ({galat}).\n"
        "Salin alamat berkas .json-nya langsung dari halaman LottieFiles."
    )


def baca(berkas: Path) -> Animasi:
    d = json.loads(Path(berkas).read_text(encoding="utf-8"))
    return Animasi(
        berkas=Path(berkas),
        lebar=int(d.get("w", 512)),
        tinggi=int(d.get("h", 512)),
        fps=float(d.get("fr", 30)),
        bingkai=int(d.get("op", 0) - d.get("ip", 0)),
    )


# ---------------------------------------------------------------------------
# Penyesuaian warna
# ---------------------------------------------------------------------------
def _ke_rgb(hexs: str) -> list[float]:
    h = hexs.lstrip("#")
    return [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]


def _jarak(a: list[float], b: list[float]) -> float:
    return sum((x - y) ** 2 for x, y in zip(a[:3], b[:3])) ** 0.5


def ganti_warna(
    berkas: Path, peta: dict[str, str], keluar: Path, *, toleransi: float = 0.28
) -> Path:
    """Ganti warna di dalam animasi agar cocok dengan palet adegan.

    peta berisi {warna_lama_hex: warna_baru_hex}. Warna yang mirip ikut
    diganti, karena satu bentuk sering memakai beberapa nuansa berdekatan.
    """
    data = json.loads(Path(berkas).read_text(encoding="utf-8"))
    sasaran = [(_ke_rgb(a), _ke_rgb(b)) for a, b in peta.items()]

    def telusuri(simpul):
        if isinstance(simpul, dict):
            # Warna solid pada Lottie tersimpan sebagai {"a":0,"k":[r,g,b,a]}
            k = simpul.get("k")
            if (
                isinstance(k, list)
                and 3 <= len(k) <= 4
                and all(isinstance(v, (int, float)) for v in k)
                and all(0 <= v <= 1 for v in k)
            ):
                for lama, baru in sasaran:
                    if _jarak(k, lama) < toleransi:
                        simpul["k"] = baru + ([k[3]] if len(k) == 4 else [])
                        break
            for v in simpul.values():
                telusuri(v)
        elif isinstance(simpul, list):
            for v in simpul:
                telusuri(v)

    telusuri(data)
    keluar.parent.mkdir(parents=True, exist_ok=True)
    keluar.write_text(json.dumps(data), encoding="utf-8")
    return keluar


def daftar_warna(berkas: Path, batas: int = 12) -> list[str]:
    """Kumpulkan warna yang dipakai, untuk ditawarkan sebagai pilihan ganti."""
    data = json.loads(Path(berkas).read_text(encoding="utf-8"))
    hasil: dict[str, int] = {}

    def telusuri(simpul):
        if isinstance(simpul, dict):
            k = simpul.get("k")
            if (
                isinstance(k, list)
                and 3 <= len(k) <= 4
                and all(isinstance(v, (int, float)) and 0 <= v <= 1 for v in k)
            ):
                h = "#" + "".join(f"{int(round(v*255)):02x}" for v in k[:3])
                hasil[h] = hasil.get(h, 0) + 1
            for v in simpul.values():
                telusuri(v)
        elif isinstance(simpul, list):
            for v in simpul:
                telusuri(v)

    telusuri(data)
    return [w for w, _ in sorted(hasil.items(), key=lambda kv: -kv[1])[:batas]]


# ---------------------------------------------------------------------------
# Perender
# ---------------------------------------------------------------------------
_HALAMAN = """<body style="margin:0;padding:0;overflow:hidden;background:{latar}">
<div id="panggung" style="width:{w}px;height:{h}px"></div>
<script src="lottie.min.js"></script>
<script>
window.SIAP = false;
window.A = lottie.loadAnimation({{
  container: document.getElementById('panggung'),
  renderer: 'svg', loop: false, autoplay: false, path: '{berkas}'
}});
window.A.addEventListener('DOMLoaded', function () {{ window.SIAP = true; }});
</script></body>"""


def render(
    berkas: Path,
    keluar: Path,
    *,
    durasi: float | None = None,
    lebar: int = RENDER.width,
    tinggi: int = RENDER.height,
    latar: str = "#00000000",
    fps: int = RENDER.fps,
    ulang: bool = True,
    lapor=None,
) -> Path:
    """Render animasi Lottie menjadi berkas video.

    Bila durasi lebih panjang dari animasinya dan ulang bernilai benar,
    animasi diputar berulang sampai durasi terpenuhi.
    """
    if not chromium_tersedia():
        raise LottieGagal(
            "Chromium tidak ditemukan. Jalankan sekali:  playwright install chromium"
        )
    from playwright.sync_api import sync_playwright

    info = baca(berkas)
    kerja = keluar.parent / f".lottie_{keluar.stem}"
    if kerja.exists():
        shutil.rmtree(kerja, ignore_errors=True)
    kerja.mkdir(parents=True)

    # Semua berkas diletakkan berdampingan supaya halaman bisa memuatnya
    # lewat nama berkas saja.
    shutil.copy(_pastikan_pemutar(), kerja / "lottie.min.js")
    shutil.copy(berkas, kerja / "anim.json")
    (kerja / "halaman.html").write_text(
        _HALAMAN.format(w=lebar, h=tinggi, berkas="anim.json", latar=latar),
        encoding="utf-8",
    )

    total = int(round((durasi or info.durasi) * fps))
    with sync_playwright() as p:
        b = p.chromium.launch(
            executable_path=chromium_tersedia(),
            args=["--no-sandbox", "--disable-gpu", "--allow-file-access-from-files",
                  "--hide-scrollbars"],
        )
        pg = b.new_page(viewport={"width": lebar, "height": tinggi})
        pg.goto((kerja / "halaman.html").resolve().as_uri())
        pg.wait_for_function("window.SIAP === true", timeout=45000)
        jumlah_bingkai = pg.evaluate("window.A.totalFrames")

        for i in range(total):
            # Peta waktu video ke bingkai animasi, dengan pengulangan bila perlu.
            posisi = i / fps * info.fps
            f = posisi % jumlah_bingkai if ulang else min(posisi, jumlah_bingkai - 1)
            pg.evaluate(f"window.A.goToAndStop({f}, true)")
            pg.screenshot(path=str(kerja / f"f_{i:05d}.png"), omit_background=True)
            if lapor and i % 30 == 0:
                lapor(f"   bingkai {i}/{total}")
        b.close()

    rangkai_video(kerja, keluar, fps=fps)
    shutil.rmtree(kerja, ignore_errors=True)
    return keluar


def render_bingkai_png(
    berkas: Path,
    folder: Path,
    *,
    durasi: float,
    lebar: int,
    tinggi: int,
    fps: int = RENDER.fps,
    ulang: bool = True,
) -> list[Path]:
    """Sama seperti render, tetapi menyimpan PNG transparan.

    Dipakai bila animasi Lottie perlu ditumpuk di atas latar buatan sendiri,
    bukan berdiri sebagai adegan utuh.
    """
    from playwright.sync_api import sync_playwright

    info = baca(berkas)
    folder.mkdir(parents=True, exist_ok=True)
    shutil.copy(_pastikan_pemutar(), folder / "lottie.min.js")
    shutil.copy(berkas, folder / "anim.json")
    (folder / "halaman.html").write_text(
        _HALAMAN.format(w=lebar, h=tinggi, berkas="anim.json", latar="#00000000"),
        encoding="utf-8",
    )
    keluar: list[Path] = []
    total = int(round(durasi * fps))
    with sync_playwright() as p:
        b = p.chromium.launch(
            executable_path=chromium_tersedia(),
            args=["--no-sandbox", "--disable-gpu", "--allow-file-access-from-files"],
        )
        pg = b.new_page(viewport={"width": lebar, "height": tinggi})
        pg.goto((folder / "halaman.html").resolve().as_uri())
        pg.wait_for_function("window.SIAP === true", timeout=45000)
        n = pg.evaluate("window.A.totalFrames")
        for i in range(total):
            posisi = i / fps * info.fps
            f = posisi % n if ulang else min(posisi, n - 1)
            pg.evaluate(f"window.A.goToAndStop({f}, true)")
            jalur = folder / f"l_{i:05d}.png"
            pg.screenshot(path=str(jalur), omit_background=True)
            keluar.append(jalur)
        b.close()
    return keluar


def tersedia() -> bool:
    try:
        import playwright  # noqa: F401
    except ImportError:
        return False
    return bool(chromium_tersedia())
