"""Mesin gerak berbasis kunci: menggerakkan potongan poster satu per satu.

Ini inti jalur lanjutan vox-director, diadopsi ke aplikasi kita. Bedanya
dengan mesin lama di anim.py: di sini bingkai digambar langsung oleh Pillow,
bukan lewat tangkapan layar Chromium. Lebih cepat, dan tiap potongan punya
jalur kuncinya sendiri.

Gagasan pentingnya, dan ini yang dulu kita lewatkan:

    POTONGAN TERBANG PULANG KE POSISI ASLINYA DI POSTER.

Kalau potongan disebar ke susunan baru di atas latar baru, hasilnya berhenti
terlihat seperti poster sumbernya, dan penonton menyadarinya. Maka posternya
sendiri dipakai sebagai latar, dan tiap potongan mendarat tepat di tempat ia
digunting. Bingkai terakhir jadi sama persis dengan poster aslinya.

Satu masalah menyusul dari situ: sebelum potongan mendarat, bekasnya di
latar sudah kelihatan, jadi ada dua salinan. Meredupkan bekas itu bikin
tambalan gelap yang malah lebih kentara. Yang berhasil adalah MENGABURKAN
bekas itu saja: terang dan warnanya tetap, jadi tidak ada tambalan, dan
potongan tajam yang datang terasa seperti memfokuskan bagian itu.

Catatan halus yang mahal kalau tidak tahu: pelonggaran "balik" melewati
target sedikit sebelum kembali. Pada skala, lewatnya bisa turun di bawah
satu dan sekejap membuka salinan di latar. Maka untuk skala yang mendarat
di atas latar penuh, dipakai "keluar", bukan "balik".
"""
from __future__ import annotations

import math
import random
import subprocess
from dataclasses import dataclass, field
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

from .config import RENDER


# ----------------------------------------------------------------- pelonggaran
def longgar(nama: str, p: float) -> float:
    """Kurva pelonggaran. p berjalan 0..1, hasilnya juga 0..1 (kecuali balik)."""
    p = max(0.0, min(1.0, p))
    if nama == "lurus":
        return p
    if nama == "halus":
        return p * p * (3 - 2 * p)
    if nama == "masuk":
        return p * p
    if nama == "keluar":
        return 1 - (1 - p) ** 2
    if nama == "balik":                      # mendarat sambil melewati sedikit
        s = 1.70158
        q = p - 1
        return 1 + (s + 1) * q ** 3 + s * q ** 2
    if nama == "pantul":                     # jatuh lalu memantul
        if p < 1 / 2.75:
            return 7.5625 * p * p
        if p < 2 / 2.75:
            p -= 1.5 / 2.75
            return 7.5625 * p * p + 0.75
        if p < 2.5 / 2.75:
            p -= 2.25 / 2.75
            return 7.5625 * p * p + 0.9375
        p -= 2.625 / 2.75
        return 7.5625 * p * p + 0.984375
    return p


@dataclass
class Kunci:
    """Satu titik kunci: waktu, pusat x/y, skala, putaran, tembus pandang."""

    t: float
    x: float
    y: float
    s: float = 1.0
    r: float = 0.0
    a: float = 1.0
    e: str = "halus"


class Lapisan:
    """Satu potongan gambar beserta jalur kuncinya.

    ayun dan denyut menambah goyangan berfrekuensi rendah supaya potongan
    yang sudah mendarat tidak mati kaku. Tanpa itu, adegan kembali terasa
    seperti gambar diam, persis keluhan yang dulu kita dapat.
    """

    def __init__(
        self,
        berkas: str | Path | Image.Image,
        kunci: list[Kunci],
        *,
        ayun: float = 0.0,
        denyut: float = 0.0,
        bayangan: bool = True,
        nama: str = "",
    ):
        self.im = (berkas if isinstance(berkas, Image.Image)
                   else Image.open(berkas)).convert("RGBA")
        self.kunci = sorted(kunci, key=lambda k: k.t)
        self.ayun, self.denyut, self.bayangan, self.nama = ayun, denyut, bayangan, nama

    def keadaan(self, t: float) -> tuple[float, float, float, float, float]:
        ks = self.kunci
        if t <= ks[0].t:
            k = ks[0]
            return k.x, k.y, k.s, k.r, k.a
        if t >= ks[-1].t:
            k = ks[-1]
            return k.x, k.y, k.s, k.r, k.a
        for a, b in zip(ks, ks[1:]):
            if a.t <= t <= b.t:
                p = (t - a.t) / (b.t - a.t)
                q = longgar(b.e, p)
                lerp = lambda u, v: u + (v - u) * q
                return (lerp(a.x, b.x), lerp(a.y, b.y), lerp(a.s, b.s),
                        lerp(a.r, b.r), lerp(a.a, b.a))
        k = ks[-1]
        return k.x, k.y, k.s, k.r, k.a

    def gambar(self, kanvas: Image.Image, t: float) -> None:
        x, y, s, r, a = self.keadaan(t)
        if a <= 0.01 or s <= 0.01:
            return
        s *= 1 + self.denyut * math.sin(t * 2.1)
        r += self.ayun * math.sin(t * 1.3)
        w = max(1, int(self.im.width * s))
        h = max(1, int(self.im.height * s))
        im = self.im.resize((w, h), Image.LANCZOS)
        if abs(r) > 0.01:
            im = im.rotate(r, expand=True, resample=Image.BICUBIC)
        if a < 1:
            im.putalpha(im.split()[3].point(lambda v: int(v * a)))
        px, py = int(x - im.width / 2), int(y - im.height / 2)
        if self.bayangan:
            bay = Image.new("RGBA", im.size, (0, 0, 0, 0))
            bay.paste((0, 0, 0, 120), (0, 0), im.split()[3])
            bay = bay.filter(ImageFilter.GaussianBlur(9))
            kanvas.alpha_composite(bay, (px + 9, py + 14))
        kanvas.alpha_composite(im, (px, py))


# ------------------------------------------------------------- pembuka gerakan
def terbang(t0, x, y, W, H, dari="kanan", putar=8.0, lama=0.7, s=1.0) -> list[Kunci]:
    """Masuk dari luar layar lalu mendarat sambil melewati sedikit."""
    asal = {"kanan": (W + 400, y), "kiri": (-400, y),
            "atas": (x, -400), "bawah": (x, H + 400)}[dari]
    return [Kunci(t0, asal[0], asal[1], s, putar, 0.0, "keluar"),
            Kunci(t0 + lama, x, y, s, 0.0, 1.0, "balik")]


def tampar(t0, x, y, s=1.0, lama=0.25) -> list[Kunci]:
    """Muncul membesar lalu mengetat ke tempatnya. Terasa seperti ditempel."""
    return [Kunci(t0, x, y, s * 1.5, 0.0, 0.0, "keluar"),
            Kunci(t0 + lama, x, y, s, 0.0, 1.0, "balik")]


def jatuh(t0, x, y, s=1.0, lama=0.8) -> list[Kunci]:
    """Jatuh dari atas lalu memantul sekali."""
    return [Kunci(t0, x, -300, s, 0.0, 0.0, "lurus"),
            Kunci(t0 + 0.1, x, -300, s, 0.0, 1.0, "lurus"),
            Kunci(t0 + lama, x, y, s, 0.0, 1.0, "pantul")]


def fokus(t0, x, y, s=1.0, lama=0.5, putar=6.0) -> list[Kunci]:
    """Muncul di tempat, mulai lebih besar dan sudah pekat.

    Ini pembuka yang aman di atas latar penuh: karena mulainya lebih besar
    dan tidak tembus pandang, ia menutupi salinan dirinya sendiri di latar,
    jadi tidak ada bayangan ganda dan tidak perlu meredupkan apa pun.
    Skalanya hanya mengecil menuju satu, tidak pernah di bawahnya.
    """
    return [Kunci(t0, x, y, s * 1.35, putar, 0.0, "keluar"),
            Kunci(t0 + 0.03, x, y, s * 1.35, putar, 1.0, "keluar"),
            Kunci(t0 + lama, x, y, s, 0.0, 1.0, "keluar")]


# -------------------------------------------------------------- efek prosedural
class Kepingan:
    """Serpihan kertas yang melayang terus. Sumber rasa 'kertas' yang murah.

    Serpihan yang jatuh perlahan sepanjang adegan menyumbang banyak sekali
    pada kesan buatan tangan, dan biayanya nol karena digambar kode.
    """

    def __init__(self, W, H, n=30, benih=7, warna=None):
        self.r = random.Random(benih)
        self.W, self.H = W, H
        pal = warna or [(212, 175, 55), (240, 240, 235), (200, 50, 40),
                        (40, 110, 110), (230, 205, 110)]
        self.p = [dict(x=self.r.uniform(0, W), y=self.r.uniform(-H, H),
                       vy=self.r.uniform(55, 130), vx=self.r.uniform(-26, 26),
                       w=self.r.randint(6, 14), h=self.r.randint(8, 20),
                       rot=self.r.uniform(0, 360), vr=self.r.uniform(-110, 110),
                       c=self.r.choice(pal)) for _ in range(n)]

    def gambar(self, kanvas, t, dt):
        lay = Image.new("RGBA", kanvas.size, (0, 0, 0, 0))
        for p in self.p:
            p["y"] += p["vy"] * dt
            p["x"] += p["vx"] * dt + 6 * math.sin(t + p["w"])
            p["rot"] += p["vr"] * dt
            if p["y"] > self.H + 20:
                p["y"] = -20
                p["x"] = self.r.uniform(0, self.W)
            cip = Image.new("RGBA", (p["w"], p["h"]), p["c"] + (225,))
            cip = cip.rotate(p["rot"], expand=True)
            lay.alpha_composite(cip, (int(p["x"]), int(p["y"])))
        kanvas.alpha_composite(lay)


def kilau(kanvas, cx, cy, t, R=760, sinar=28, warna=(240, 200, 70)):
    """Berkas sinar berputar pelan di belakang benda utama."""
    lay = Image.new("RGBA", kanvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    rot = t * 18
    for i in range(sinar):
        a0 = math.radians(rot + i * 360 / sinar)
        a1 = math.radians(rot + (i + 0.5) * 360 / sinar)
        d.polygon([(cx, cy),
                   (cx + R * math.cos(a0), cy + R * math.sin(a0)),
                   (cx + R * math.cos(a1), cy + R * math.sin(a1))],
                  fill=warna + (55,))
    kanvas.alpha_composite(lay)


# ---------------------------------------------------------------------- kamera
@dataclass
class Kamera:
    """Gerak kamera satu bidikan, plus getaran benturan saat potongan mendarat.

    Bingkai diambil dari kanvas yang sengaja dirender lebih besar, lalu
    dipotong. Kalau kamera digeser dengan translasi biasa, tepi hitam akan
    tersingkap; dengan memotong dari kanvas lebih besar, itu tidak terjadi.
    """

    gerak: str = "diam"
    kuat: float = 1.0
    benturan: tuple[float, ...] = ()

    def pada(self, t: float, T: float) -> tuple[float, float, float]:
        u = t / max(0.001, T)
        z, gx, gy = 1.045, 0.0, 0.0
        k = self.kuat
        if self.gerak == "maju":
            z = 1.0 + 0.085 * u * k
        elif self.gerak == "mundur":
            z = 1.0 + 0.085 * (1 - u) * k
        elif self.gerak == "geser":
            z = 1.06
            gx = (u - 0.5) * 90 * k
        elif self.gerak == "tegak":
            z = 1.06
            gy = (u - 0.5) * 110 * k
        elif self.gerak == "berlapis":
            z = 1.05 + 0.02 * u * k
            gx = math.sin(u * math.pi) * 26 * k
        # Getaran benturan: gelombang yang meredam cepat, dipicu saat potongan
        # menghantam tempatnya. Ini yang memberi bobot pada pendaratan.
        for hit in self.benturan:
            if t >= hit:
                d = t - hit
                amp = 17 * k * math.exp(-8 * d)
                gx += amp * math.sin(d * 60)
                gy += amp * math.cos(d * 55)
        return z, gx, gy


# ------------------------------------------------------------------- pelataran
def latar_kabur(
    poster: Path | Image.Image,
    kotak: list[tuple[int, int, int, int]],
    *,
    kabur: int = 16,
) -> Image.Image:
    """Poster sebagai latar, dengan bekas tiap potongan dikaburkan saja.

    Bukan diredupkan dan bukan dicerahkan. Meredupkan meninggalkan tambalan
    gelap yang justru lebih terlihat, apalagi di latar berwarna. Dikaburkan,
    terang dan warnanya tetap sama, jadi tidak ada tambalan; potongan tajam
    yang mendarat terasa seperti memfokuskan bagian itu.
    """
    im = (poster if isinstance(poster, Image.Image)
          else Image.open(poster)).convert("RGBA")
    for x0, y0, x1, y1 in kotak:
        x0, y0 = max(0, x0), max(0, y0)
        x1, y1 = min(im.width, x1), min(im.height, y1)
        if x1 <= x0 or y1 <= y0:
            continue
        bagian = im.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(kabur))
        im.paste(bagian, (x0, y0))
    return im


# --------------------------------------------------------------------- perender
def render_bidikan(
    latar: Image.Image,
    lapisan: list[Lapisan],
    keluar: Path,
    *,
    durasi: float,
    W: int = RENDER.width,
    H: int = RENDER.height,
    fps: int = RENDER.fps,
    kamera: Kamera | None = None,
    kepingan: Kepingan | None = None,
    lapor=None,
) -> Path:
    """Gambar tiap bingkai dengan Pillow lalu salurkan ke ffmpeg.

    Kanvas dirender pada ukuran akhir; kamera memotong dari versi yang
    diperbesar, jadi tepinya tidak pernah kosong.
    """
    keluar.parent.mkdir(parents=True, exist_ok=True)
    dasar = latar.convert("RGBA").resize((W, H), Image.LANCZOS)
    kam = kamera or Kamera()
    n = max(2, int(round(durasi * fps)))
    dt = 1.0 / fps

    proses = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
         "-c:v", "libx264", "-preset", "medium", "-crf", "18",
         "-pix_fmt", "yuv420p", str(keluar)],
        stdin=subprocess.PIPE,
    )
    try:
        for f in range(n):
            t = f * dt
            kv = dasar.copy()
            for L in lapisan:
                L.gambar(kv, t)
            if kepingan:
                kepingan.gambar(kv, t, dt)
            z, gx, gy = kam.pada(t, durasi)
            bingkai = kv.convert("RGB")
            zw, zh = int(W * z), int(H * z)
            bingkai = bingkai.resize((zw, zh), Image.LANCZOS)
            cx = (zw - W) // 2 + int(gx)
            cy = (zh - H) // 2 + int(gy)
            cx = max(0, min(zw - W, cx))
            cy = max(0, min(zh - H, cy))
            bingkai = bingkai.crop((cx, cy, cx + W, cy + H))
            proses.stdin.write(bingkai.tobytes())
            if lapor and f % 30 == 0:
                lapor(f"   bingkai {f}/{n}")
    finally:
        proses.stdin.close()
        proses.wait()
    return keluar


def ukur_gerak(video: Path, *, contoh: int = 240) -> dict:
    """Ukur seberapa banyak yang benar-benar bergerak di sebuah video.

    Dipakai sebagai penjaga mutu: kalau bagian diamnya tinggi, adegan itu
    kembali jadi gambar diam berdubbing, dan itu keluhan yang sudah pernah
    kita dapat. Tidak perlu kredit untuk memeriksanya.
    """
    import numpy as np
    from tempfile import TemporaryDirectory

    with TemporaryDirectory() as td:
        subprocess.run(
            ["ffmpeg", "-v", "error", "-i", str(video), "-vf", "scale=320:-2",
             f"{td}/f%04d.png"], check=True)
        berkas = sorted(Path(td).glob("*.png"))[:contoh]
        arr = [np.asarray(Image.open(p).convert("L"), dtype=np.float32) for p in berkas]
    if len(arr) < 2:
        return {"rata": 0.0, "puncak": 0.0, "diam_persen": 100.0}
    d = np.array([np.abs(arr[i - 1] - arr[i]).mean() for i in range(1, len(arr))])
    return {"rata": float(d.mean()), "puncak": float(d.max()),
            "diam_persen": float((d < 0.35).mean() * 100)}
