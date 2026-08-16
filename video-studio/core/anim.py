"""Animasi vektor berkerangka, meniru cara kerja studio animasi penjelas.

Video acuan dibuat dengan After Effects memakai plugin RubberHose: anggota
badan tokoh bukan garis kaku bersendi, melainkan "selang karet" yang
melengkung luwes antara pangkal dan ujungnya. Itu sebabnya gerakannya terasa
ringan dan tegas, bukan organik seperti keluaran model AI video.

Selang karet sebenarnya hanya kurva Bezier kuadratik antara dua titik, dengan
lengkungan yang membesar ketika ujungnya mendekat ke pangkal supaya panjang
anggota badan terasa tetap. Itu bisa dihitung, jadi tidak perlu model AI sama
sekali.

Alur kerjanya:

    tokoh + gerakan  ->  SVG per bingkai  ->  Chromium headless  ->  PNG
                                                                     |
                                          video  <-  ffmpeg  <-------+

Karena semuanya dihitung di komputer sendiri, animasinya tidak memakan kredit
sama sekali dan hasilnya sama persis setiap kali dijalankan.
"""
from __future__ import annotations

import math
import shutil
import subprocess
from dataclasses import dataclass, field
from pathlib import Path

from .config import RENDER

# ---------------------------------------------------------------------------
# Pelonggaran gerak (easing)
# ---------------------------------------------------------------------------
def linear(t: float) -> float:
    return t


def halus(t: float) -> float:
    """Mulai pelan, cepat di tengah, berhenti pelan."""
    return t * t * (3 - 2 * t)


def keluar_kuat(t: float) -> float:
    """Cepat di awal lalu mengerem. Cocok untuk benda yang meluncur masuk."""
    return 1 - (1 - t) ** 3


def masuk_kuat(t: float) -> float:
    return t**3


def pantul(t: float) -> float:
    """Melewati sasaran sedikit lalu kembali. Ciri khas animasi kartun."""
    c = 1.70158 + 1
    return 1 + c * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2


EASING = {
    "linear": linear,
    "halus": halus,
    "keluar": keluar_kuat,
    "masuk": masuk_kuat,
    "pantul": pantul,
}


def antara(a: float, b: float, t: float, easing: str = "halus") -> float:
    t = max(0.0, min(1.0, t))
    return a + (b - a) * EASING.get(easing, halus)(t)


# ---------------------------------------------------------------------------
# Selang karet
# ---------------------------------------------------------------------------
def selang(
    pangkal: tuple[float, float],
    ujung: tuple[float, float],
    panjang: float,
    *,
    arah_tekuk: float = 1.0,
) -> str:
    """Jalur SVG untuk satu anggota badan bergaya selang karet.

    Ketika ujungnya mendekat ke pangkal, kurvanya menggelembung supaya panjang
    anggota badan terlihat tetap. Itu inti dari kesan luwes pada gaya ini.
    """
    x1, y1 = pangkal
    x2, y2 = ujung
    dx, dy = x2 - x1, y2 - y1
    jarak = math.hypot(dx, dy) or 0.0001

    # Seberapa jauh titik kendali digeser tegak lurus terhadap garis lurus.
    sisa = max(0.0, panjang * panjang - jarak * jarak)
    gelembung = math.sqrt(sisa) * 0.62 * arah_tekuk

    # Vektor tegak lurus terhadap arah pangkal-ujung.
    nx, ny = -dy / jarak, dx / jarak
    cx = (x1 + x2) / 2 + nx * gelembung
    cy = (y1 + y2) / 2 + ny * gelembung
    return f"M {x1:.2f} {y1:.2f} Q {cx:.2f} {cy:.2f} {x2:.2f} {y2:.2f}"


# ---------------------------------------------------------------------------
# Tokoh
# ---------------------------------------------------------------------------
@dataclass
class Palet:
    kulit: str = "#7fd4c1"
    baju: str = "#ff3d7f"
    bawahan: str = "#1fc8db"
    rambut: str = "#4a2b7a"
    sarung: str = "#ffffff"
    sepatu: str = "#ff9f43"
    garis: str = "#14121f"
    mata: str = "#14121f"


@dataclass
class Tokoh:
    """Tokoh sederhana bergaya animasi penjelas.

    Ukurannya dinyatakan relatif terhadap tinggi badan supaya mudah diskalakan.
    """

    x: float = 540.0
    y: float = 1100.0  # posisi kaki menyentuh lantai
    tinggi: float = 520.0
    palet: Palet = field(default_factory=Palet)
    hadap: int = 1  # 1 menghadap kanan, -1 menghadap kiri

    # Ukuran turunan --------------------------------------------------------
    @property
    def r_kepala(self) -> float:
        return self.tinggi * 0.20

    @property
    def tinggi_badan(self) -> float:
        return self.tinggi * 0.34

    @property
    def panjang_kaki(self) -> float:
        return self.tinggi * 0.38

    @property
    def panjang_lengan(self) -> float:
        return self.tinggi * 0.32

    @property
    def tebal_anggota(self) -> float:
        return self.tinggi * 0.055

    @property
    def y_pinggul(self) -> float:
        return self.y - self.panjang_kaki

    @property
    def y_bahu(self) -> float:
        return self.y_pinggul - self.tinggi_badan

    @property
    def y_kepala(self) -> float:
        return self.y_bahu - self.r_kepala * 0.72


def gambar_tokoh(
    tk: Tokoh,
    *,
    fase_jalan: float | None = None,
    goyang: float = 0.0,
    lambai: float | None = None,
    kedip: bool = False,
) -> str:
    """Hasilkan potongan SVG untuk tokoh pada satu bingkai.

    fase_jalan : 0..1, satu putaran langkah penuh. None berarti berdiri diam.
    goyang     : naik-turun badan dalam piksel.
    lambai     : 0..1 untuk satu putaran lambaian tangan kanan.
    """
    p = tk.palet
    naik = goyang
    # Saat berjalan, badan ikut naik-turun dua kali per putaran langkah.
    if fase_jalan is not None:
        naik += -abs(math.sin(fase_jalan * math.pi * 2)) * tk.tinggi * 0.018

    y_pinggul = tk.y_pinggul + naik
    y_bahu = tk.y_bahu + naik
    y_kepala = tk.y_kepala + naik
    # Badan dibuat cukup lebar. Percobaan pertama memakai bahu selebar 0,085
    # kali tinggi dan hasilnya badan setipis lidi dengan lengan tenggelam di
    # baliknya. Gaya animasi penjelas justru memakai tubuh gempal berkepala besar.
    lebar_pinggul = tk.tinggi * 0.115
    lebar_bahu = tk.tinggi * 0.150

    bagian: list[str] = []

    # --- Kaki ---------------------------------------------------------------
    def kaki(offset_fase: float, di_depan: bool) -> None:
        if fase_jalan is None:
            kx = tk.x + (lebar_pinggul if di_depan else -lebar_pinggul) * 0.6
            ky = tk.y
        else:
            a = (fase_jalan + offset_fase) * math.pi * 2
            # Telapak menyusuri lintasan lonjong: maju di udara, mundur di lantai.
            kx = tk.x + math.sin(a) * tk.tinggi * 0.16 * tk.hadap
            angkat = max(0.0, math.sin(a + math.pi / 2)) * tk.tinggi * 0.085
            ky = tk.y - angkat
        pangkal = (tk.x + (lebar_pinggul if di_depan else -lebar_pinggul) * 0.5, y_pinggul)
        bagian.append(
            f'<path d="{selang(pangkal, (kx, ky), tk.panjang_kaki, arah_tekuk=-tk.hadap)}" '
            f'fill="none" stroke="{p.kulit}" stroke-width="{tk.tebal_anggota:.1f}" '
            f'stroke-linecap="round"/>'
        )
        bagian.append(
            f'<ellipse cx="{kx + 6 * tk.hadap:.1f}" cy="{ky + 2:.1f}" '
            f'rx="{tk.tinggi * 0.048:.1f}" ry="{tk.tinggi * 0.028:.1f}" fill="{p.sepatu}"/>'
        )

    kaki(0.5, di_depan=False)  # kaki belakang digambar lebih dulu
    kaki(0.0, di_depan=True)

    # --- Badan --------------------------------------------------------------
    # Bawahan digambar lebih dulu supaya baju menumpuk rapi di atasnya.
    bagian.append(
        f'<path d="M {tk.x - lebar_pinggul * 1.05:.1f} {y_pinggul - tk.tinggi * 0.10:.1f} '
        f'L {tk.x + lebar_pinggul * 1.05:.1f} {y_pinggul - tk.tinggi * 0.10:.1f} '
        f'L {tk.x + lebar_pinggul * 1.15:.1f} {y_pinggul + tk.tinggi * 0.02:.1f} '
        f'L {tk.x - lebar_pinggul * 1.15:.1f} {y_pinggul + tk.tinggi * 0.02:.1f} Z" '
        f'fill="{p.bawahan}"/>'
    )
    # Leher pendek agar kepala tidak terlihat melayang.
    bagian.append(
        f'<rect x="{tk.x - tk.r_kepala * 0.22:.1f}" y="{y_bahu - tk.r_kepala * 0.35:.1f}" '
        f'width="{tk.r_kepala * 0.44:.1f}" height="{tk.r_kepala * 0.45:.1f}" '
        f'fill="{p.kulit}"/>'
    )
    # Baju berbentuk trapesium dengan bahu membulat.
    bagian.append(
        f'<path d="M {tk.x - lebar_bahu:.1f} {y_bahu + tk.tinggi * 0.03:.1f} '
        f'q 0 {-tk.tinggi * 0.035:.1f} {lebar_bahu * 0.42:.1f} {-tk.tinggi * 0.035:.1f} '
        f'L {tk.x + lebar_bahu * 0.58:.1f} {y_bahu - tk.tinggi * 0.005:.1f} '
        f'q {lebar_bahu * 0.42:.1f} 0 {lebar_bahu * 0.42:.1f} {tk.tinggi * 0.035:.1f} '
        f'L {tk.x + lebar_pinggul:.1f} {y_pinggul - tk.tinggi * 0.06:.1f} '
        f'L {tk.x - lebar_pinggul:.1f} {y_pinggul - tk.tinggi * 0.06:.1f} Z" '
        f'fill="{p.baju}"/>'
    )

    # --- Lengan -------------------------------------------------------------
    def lengan(offset_fase: float, kanan: bool) -> None:
        # Pangkal lengan diletakkan sedikit DI LUAR tepi baju supaya selangnya
        # terlihat penuh, tidak tertutup badan.
        bahu = (
            tk.x + (lebar_bahu if kanan else -lebar_bahu) * 1.02,
            y_bahu + tk.tinggi * 0.03,
        )
        if lambai is not None and kanan:
            a = lambai * math.pi * 2
            tx = bahu[0] + tk.panjang_lengan * 0.55 * tk.hadap
            ty = bahu[1] - tk.panjang_lengan * (0.72 + 0.14 * math.sin(a))
        elif fase_jalan is None:
            tx = bahu[0] + tk.tinggi * 0.02 * (1 if kanan else -1)
            ty = bahu[1] + tk.panjang_lengan * 0.88
        else:
            # Lengan berayun berlawanan dengan kaki di sisi yang sama.
            a = (fase_jalan + offset_fase) * math.pi * 2
            tx = bahu[0] - math.sin(a) * tk.tinggi * 0.11 * tk.hadap
            ty = bahu[1] + tk.panjang_lengan * 0.86
        bagian.append(
            f'<path d="{selang(bahu, (tx, ty), tk.panjang_lengan, arah_tekuk=tk.hadap)}" '
            f'fill="none" stroke="{p.kulit}" stroke-width="{tk.tebal_anggota * 0.85:.1f}" '
            f'stroke-linecap="round"/>'
        )
        bagian.append(
            f'<circle cx="{tx:.1f}" cy="{ty:.1f}" r="{tk.tinggi * 0.035:.1f}" '
            f'fill="{p.sarung}"/>'
        )

    lengan(0.0, kanan=False)
    lengan(0.5, kanan=True)

    # --- Kepala -------------------------------------------------------------
    bagian.append(
        f'<circle cx="{tk.x:.1f}" cy="{y_kepala:.1f}" r="{tk.r_kepala:.1f}" fill="{p.kulit}"/>'
    )
    # Rambut: setengah lingkaran atas dengan poni yang sedikit menjorok.
    rk = tk.r_kepala
    bagian.append(
        f'<path d="M {tk.x - rk:.1f} {y_kepala + rk * 0.12:.1f} '
        f'a {rk:.1f} {rk:.1f} 0 0 1 {rk * 2:.1f} 0 '
        f'l 0 {-rk * 0.30:.1f} '
        f'q {-rk * 0.55:.1f} {rk * 0.30:.1f} {-rk * 1.05:.1f} {rk * 0.10:.1f} '
        f'q {-rk * 0.50:.1f} {-rk * 0.12:.1f} {-rk * 0.95:.1f} {-rk * 0.10:.1f} Z" '
        f'fill="{p.rambut}"/>'
    )
    # Mata: bola putih besar dengan pupil gelap, ciri paling khas gaya ini.
    ry = rk * (0.035 if kedip else 0.26)
    for sisi in (-1, 1):
        mx = tk.x + sisi * rk * 0.33 + tk.hadap * rk * 0.09
        my = y_kepala + rk * 0.12
        if kedip:
            bagian.append(
                f'<rect x="{mx - rk * 0.17:.1f}" y="{my - rk * 0.02:.1f}" '
                f'width="{rk * 0.34:.1f}" height="{rk * 0.045:.1f}" '
                f'rx="{rk * 0.02:.1f}" fill="{p.mata}"/>'
            )
            continue
        bagian.append(
            f'<ellipse cx="{mx:.1f}" cy="{my:.1f}" rx="{rk * 0.17:.1f}" '
            f'ry="{ry:.1f}" fill="#ffffff"/>'
        )
        bagian.append(
            f'<ellipse cx="{mx + tk.hadap * rk * 0.045:.1f}" cy="{my + rk * 0.03:.1f}" '
            f'rx="{rk * 0.085:.1f}" ry="{rk * 0.125:.1f}" fill="{p.mata}"/>'
        )
    return "\n".join(bagian)


# ---------------------------------------------------------------------------
# Adegan
# ---------------------------------------------------------------------------
def latar_gradasi(warna_atas: str, warna_bawah: str, *, radial: bool = False) -> str:
    if radial:
        isi = (
            f'<radialGradient id="bg" cx="50%" cy="45%" r="75%">'
            f'<stop offset="0%" stop-color="{warna_atas}"/>'
            f'<stop offset="100%" stop-color="{warna_bawah}"/></radialGradient>'
        )
    else:
        isi = (
            f'<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0%" stop-color="{warna_atas}"/>'
            f'<stop offset="100%" stop-color="{warna_bawah}"/></linearGradient>'
        )
    return (
        f"<defs>{isi}</defs>"
        f'<rect width="{RENDER.width}" height="{RENDER.height}" fill="url(#bg)"/>'
    )


def bungkus_svg(isi: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{RENDER.width}" '
        f'height="{RENDER.height}" viewBox="0 0 {RENDER.width} {RENDER.height}">'
        f"{isi}</svg>"
    )


# ---------------------------------------------------------------------------
# Perender bingkai
# ---------------------------------------------------------------------------
CHROMIUM_KANDIDAT = [
    "/opt/pw-browsers/chromium",
    shutil.which("chromium"),
    shutil.which("chromium-browser"),
    shutil.which("google-chrome"),
]


def chromium_tersedia() -> str:
    for c in CHROMIUM_KANDIDAT:
        if c and Path(c).exists():
            return c
    return ""


def tersedia() -> bool:
    try:
        import playwright  # noqa: F401
    except ImportError:
        return False
    return True


def aset(
    berkas: str | Path,
    x: float,
    y: float,
    *,
    lebar: float,
    tinggi: float | None = None,
    putar: float = 0.0,
    opasitas: float = 1.0,
    cermin: bool = False,
    lebar_kali: float = 1.0,
    tinggi_kali: float = 1.0,
) -> str:
    """Tempatkan satu berkas gambar berlatar transparan sebagai lapisan.

    Titik (x, y) adalah TENGAH BAWAH gambar, supaya benda berdiri di lantai
    adegan. lebar_kali dan tinggi_kali dipakai untuk gerak memipih dan
    memanjang, yang membuat benda terasa punya bobot.
    """
    tinggi = tinggi if tinggi is not None else lebar
    w = lebar * lebar_kali
    h = tinggi * tinggi_kali
    # Skala cermin diterapkan pada sumbu x di sekitar titik acuan.
    sx = -1 if cermin else 1
    transformasi = f"translate({x:.2f},{y:.2f})"
    if abs(putar) > 0.001:
        transformasi += f" rotate({putar:.2f})"
    if sx < 0:
        transformasi += " scale(-1,1)"
    nama = Path(berkas).name
    return (
        f'<g transform="{transformasi}" opacity="{opasitas:.3f}">'
        f'<image href="{nama}" x="{-w/2:.2f}" y="{-h:.2f}" '
        f'width="{w:.2f}" height="{h:.2f}" '
        f'preserveAspectRatio="xMidYMax meet"/></g>'
    )


def bayangan(x: float, y: float, lebar: float, *, opasitas: float = 0.18) -> str:
    """Bayangan lonjong di bawah benda. Membuatnya terasa menapak lantai."""
    return (
        f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{lebar*0.42:.1f}" '
        f'ry="{lebar*0.10:.1f}" fill="#000000" opacity="{opasitas:.2f}"/>'
    )


class Perender:
    """Merender rangkaian SVG menjadi berkas PNG lewat Chromium headless.

    Bila folder_aset diisi, halaman dimuat dari folder itu sehingga elemen
    <image> bisa merujuk berkas PNG lokal cukup dengan namanya. Menyisipkan
    gambar sebagai data URI juga bisa, tetapi satu PNG seukuran seribu piksel
    menjadi sekitar satu megabyte teks, dan mengirimnya ulang di setiap
    bingkai membuat render berkali-kali lebih lambat.
    """

    def __init__(
        self,
        lebar: int = RENDER.width,
        tinggi: int = RENDER.height,
        folder_aset: Path | None = None,
    ):
        self.lebar, self.tinggi = lebar, tinggi
        self.folder_aset = Path(folder_aset) if folder_aset else None
        self._pw = None
        self._browser = None
        self._page = None

    def __enter__(self) -> "Perender":
        from playwright.sync_api import sync_playwright

        self._pw = sync_playwright().start()
        exe = chromium_tersedia()
        opsi = {"args": ["--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                         "--allow-file-access-from-files"]}
        if exe:
            opsi["executable_path"] = exe
        self._browser = self._pw.chromium.launch(**opsi)
        self._page = self._browser.new_page(
            viewport={"width": self.lebar, "height": self.tinggi},
            device_scale_factor=1,
        )
        badan = (
            "<body style='margin:0;padding:0;overflow:hidden'>"
            "<div id='panggung'></div></body>"
        )
        if self.folder_aset:
            self.folder_aset.mkdir(parents=True, exist_ok=True)
            halaman = self.folder_aset / "_panggung.html"
            halaman.write_text(badan, encoding="utf-8")
            self._page.goto(halaman.resolve().as_uri())
        else:
            self._page.set_content(badan)
        return self

    def __exit__(self, *_exc) -> None:
        for obj, tutup in ((self._browser, "close"), (self._pw, "stop")):
            try:
                if obj:
                    getattr(obj, tutup)()
            except Exception:
                pass

    def bingkai(self, svg: str, keluar: Path) -> Path:
        self._page.evaluate(
            "svg => { document.getElementById('panggung').innerHTML = svg; }", svg
        )
        # Pastikan seluruh gambar sudah termuat sebelum layar ditangkap,
        # kalau tidak bingkai pertama bisa keluar kosong.
        self._page.evaluate(
            """() => Promise.all(
                [...document.querySelectorAll('image')].map(el => {
                    const href = el.getAttribute('href');
                    if (!href) return null;
                    return new Promise(res => {
                        const im = new Image();
                        im.onload = im.onerror = res;
                        im.src = href;
                    });
                }).filter(Boolean)
            )"""
        )
        self._page.screenshot(path=str(keluar))
        return keluar


def rangkai_video(
    folder_bingkai: Path, keluar: Path, *, fps: int = RENDER.fps
) -> Path:
    keluar.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y",
            "-framerate", str(fps),
            "-i", str(folder_bingkai / "f_%05d.png"),
            "-c:v", "libx264", "-preset", "medium", "-crf", "17",
            "-pix_fmt", "yuv420p", str(keluar),
        ],
        check=True, capture_output=True,
    )
    return keluar


def render_adegan(
    fungsi_bingkai,
    durasi: float,
    keluar: Path,
    *,
    fps: int = RENDER.fps,
    folder_kerja: Path | None = None,
    folder_aset: Path | None = None,
    lapor=None,
) -> Path:
    """Render satu adegan animasi.

    fungsi_bingkai(t) menerima waktu 0..1 dan mengembalikan isi SVG.
    folder_aset berisi berkas PNG aktor yang dirujuk oleh elemen <image>.
    """
    jumlah = max(2, int(round(durasi * fps)))
    kerja = folder_kerja or (keluar.parent / f".bingkai_{keluar.stem}")
    if kerja.exists():
        shutil.rmtree(kerja, ignore_errors=True)
    kerja.mkdir(parents=True)

    # Bingkai ditulis ke dalam folder aset supaya elemen <image> yang merujuk
    # nama berkas saja tetap ketemu.
    with Perender(folder_aset=folder_aset) as r:
        for i in range(jumlah):
            t = i / (jumlah - 1)
            r.bingkai(bungkus_svg(fungsi_bingkai(t)), kerja / f"f_{i:05d}.png")
            if lapor and i % 30 == 0:
                lapor(f"   bingkai {i}/{jumlah}")

    rangkai_video(kerja, keluar, fps=fps)
    shutil.rmtree(kerja, ignore_errors=True)
    return keluar
