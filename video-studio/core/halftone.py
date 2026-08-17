"""Mengubah gambar apa pun menjadi potongan foto halftone bergaya kolase.

Model gambar sulit diminta menghasilkan potongan halftone hitam-putih yang
konsisten. Diminta "foto halftone terisolasi", ia justru sering menggambar
ikon vektor berwarna. Menagih ulang berarti membayar lagi tanpa jaminan.

Mengubahnya sesudahnya jauh lebih pasti: warna dibuang, kontras dinaikkan,
lalu terangnya diterjemahkan menjadi titik-titik dengan jari-jari berbeda,
persis cara cetak koran lama. Hasilnya seragam untuk semua potongan karena
diproses dengan aturan yang sama, dan biayanya nol.

Tepi kertas putih dan bayangan tipis ikut ditambahkan supaya tiap potongan
terlihat benar-benar digunting lalu ditempel.
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


def _siapkan(im: Image.Image, kontras: float, terang: float) -> Image.Image:
    abu = im.convert("L")
    abu = ImageEnhance.Contrast(abu).enhance(kontras)
    abu = ImageEnhance.Brightness(abu).enhance(terang)
    return abu


def halftone(
    sumber: Path,
    keluar: Path,
    *,
    jarak: int = 7,
    sudut: float = 45.0,
    kontras: float = 1.7,
    terang: float = 1.12,
    warna_tinta: tuple[int, int, int] = (26, 24, 22),
    kertas: tuple[int, int, int] = (247, 243, 232),
) -> Path:
    """Ubah satu PNG transparan menjadi potongan halftone.

    jarak menentukan kerapatan titik dalam piksel; makin kecil makin halus.
    Nilai tujuh cocok untuk gambar seukuran seribu piksel pada bingkai tegak.
    """
    im = Image.open(sumber).convert("RGBA")
    alpha = im.getchannel("A")

    # Buang bagian kosong supaya titik tidak dihitung di area transparan.
    kotak = alpha.getbbox()
    if kotak:
        im = im.crop(kotak)
        alpha = im.getchannel("A")

    w, h = im.size
    abu = _siapkan(im, kontras, terang)

    hasil = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gambar = ImageDraw.Draw(hasil)

    rad = math.radians(sudut)
    cos_a, sin_a = math.cos(rad), math.sin(rad)
    # Kisi diputar agar barisan titik miring seperti cetakan sungguhan.
    diagonal = int(math.hypot(w, h)) + jarak * 2

    piksel = abu.load()
    apiksel = alpha.load()
    maks = jarak * 0.72

    for v in range(-diagonal, diagonal, jarak):
        for u in range(-diagonal, diagonal, jarak):
            x = int(u * cos_a - v * sin_a) + w // 2
            y = int(u * sin_a + v * cos_a) + h // 2
            if not (0 <= x < w and 0 <= y < h):
                continue
            if apiksel[x, y] < 40:
                continue
            # Piksel gelap menghasilkan titik besar.
            gelap = 1.0 - piksel[x, y] / 255.0
            r = maks * (gelap**0.75)
            if r < 0.45:
                continue
            gambar.ellipse([x - r, y - r, x + r, y + r], fill=warna_tinta + (255,))

    # Kertas tipis di belakang titik supaya potongan terasa padat.
    dasar = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bentuk = alpha.point(lambda a: 255 if a > 40 else 0)
    dasar.paste(kertas + (255,), mask=bentuk)
    hasil = Image.alpha_composite(dasar, hasil)
    hasil.putalpha(bentuk)

    keluar.parent.mkdir(parents=True, exist_ok=True)
    hasil.save(keluar)
    return keluar


def tepi_kertas(
    sumber: Path,
    keluar: Path,
    *,
    tebal: int = 10,
    warna: tuple[int, int, int] = (252, 250, 244),
    bayang: int = 7,
) -> Path:
    """Beri tepi kertas putih dan bayangan tipis, seperti hasil guntingan."""
    im = Image.open(sumber).convert("RGBA")
    a = im.getchannel("A")
    w, h = im.size
    pad = tebal + bayang + 6
    kanvas = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))

    # Tepi: siluet yang dilebarkan lalu diwarnai putih kertas.
    lebar = a.filter(ImageFilter.MaxFilter(tebal * 2 + 1))
    tepi = Image.new("RGBA", (w, h), warna + (255,))
    tepi.putalpha(lebar)

    # Bayangan lembut sedikit di bawah kanan.
    bay = Image.new("RGBA", kanvas.size, (0, 0, 0, 0))
    silhu = Image.new("RGBA", (w, h), (40, 34, 28, 90))
    silhu.putalpha(lebar.point(lambda v: int(v * 0.35)))
    bay.paste(silhu, (pad + 3, pad + 4), silhu)
    bay = bay.filter(ImageFilter.GaussianBlur(bayang))

    kanvas = Image.alpha_composite(kanvas, bay)
    kanvas.paste(tepi, (pad, pad), tepi)
    kanvas.paste(im, (pad, pad), im)

    keluar.parent.mkdir(parents=True, exist_ok=True)
    kanvas.save(keluar)
    return keluar


def jadikan_potongan(
    sumber: Path,
    keluar: Path,
    *,
    jarak: int = 7,
    tebal_tepi: int = 10,
    kontras: float = 1.7,
) -> Path:
    """Jalur lengkap: halftone lalu diberi tepi kertas."""
    antara = keluar.with_name(keluar.stem + ".ht.png")
    halftone(sumber, antara, jarak=jarak, kontras=kontras)
    tepi_kertas(antara, keluar, tebal=tebal_tepi)
    antara.unlink(missing_ok=True)
    return keluar
