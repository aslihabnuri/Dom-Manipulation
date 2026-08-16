"""Pustaka objek bergaya animasi penjelas.

Setiap fungsi mengembalikan potongan SVG untuk satu benda, dengan titik acuan
di tengah bawahnya supaya mudah ditempatkan di atas lantai adegan. Semua benda
digambar datar tanpa bayangan fotografis, sesuai gaya video acuan.

Benda-benda ini yang digerakkan oleh core.anim. Ilustrasi dari model gambar
tetap bisa dipakai sebagai latar atau sebagai benda utama yang dipasangi
anggota badan, tetapi untuk bentuk sederhana menggambarnya lewat kode jauh
lebih murah, lebih tajam, dan hasilnya sama persis setiap kali.
"""
from __future__ import annotations

import math

# Palet dasar bergaya animasi penjelas: pekat, jenuh, kontras tinggi.
HIJAU = "#4caf50"
HIJAU_TUA = "#2e7d32"
HIJAU_MATCHA = "#8bc34a"
HIJAU_MUDA = "#c5e1a5"
KRIM = "#fff8e1"
PUTIH = "#ffffff"
GELAP = "#14121f"
UNGU = "#5b3fa8"
MERAH = "#ff4d6d"
JINGGA = "#ff9f43"
KUNING = "#ffe14d"
BIRU = "#29b6f6"
ABU = "#90a4ae"
COKELAT = "#8d6e63"


def _g(isi: str, x: float, y: float, skala: float = 1.0, putar: float = 0.0) -> str:
    """Bungkus dengan transformasi posisi, skala, dan putaran."""
    t = f"translate({x:.2f},{y:.2f})"
    if abs(skala - 1.0) > 0.001:
        t += f" scale({skala:.4f})"
    if abs(putar) > 0.001:
        t += f" rotate({putar:.2f})"
    return f'<g transform="{t}">{isi}</g>'


# ---------------------------------------------------------------------------
# Minuman
# ---------------------------------------------------------------------------
def cangkir(
    x: float, y: float, *, skala: float = 1.0, isi_warna: str = HIJAU_MATCHA,
    tinggi_isi: float = 0.7, uap: float = 0.0,
) -> str:
    """Cangkir dengan isi berwarna. uap 0..1 menganimasikan kepulan."""
    w, h = 110.0, 120.0
    bagian = [
        # Telinga cangkir
        f'<path d="M {w*0.46:.0f} {-h*0.62:.0f} q {w*0.34:.0f} 0 {w*0.34:.0f} {h*0.22:.0f} '
        f'q 0 {h*0.22:.0f} {-w*0.34:.0f} {h*0.22:.0f}" fill="none" stroke="{KRIM}" '
        f'stroke-width="16" stroke-linecap="round"/>',
        # Badan cangkir
        f'<path d="M {-w*0.5:.0f} {-h:.0f} L {w*0.5:.0f} {-h:.0f} '
        f'L {w*0.38:.0f} 0 L {-w*0.38:.0f} 0 Z" fill="{KRIM}"/>',
    ]
    if tinggi_isi > 0:
        yi = -h + h * (1 - tinggi_isi) * 0.15
        lebar_isi = w * 0.46
        bagian.append(
            f'<ellipse cx="0" cy="{yi:.0f}" rx="{lebar_isi:.0f}" ry="{h*0.075:.0f}" '
            f'fill="{isi_warna}"/>'
        )
    if uap > 0:
        for i in range(3):
            fase = (uap + i * 0.33) % 1.0
            ux = (i - 1) * w * 0.22
            uy = -h - fase * h * 0.75
            op = max(0.0, 0.75 * (1 - fase))
            bagian.append(
                f'<path d="M {ux:.0f} {uy:.0f} q {w*0.11:.0f} {-h*0.13:.0f} 0 {-h*0.25:.0f}" '
                f'fill="none" stroke="{PUTIH}" stroke-width="9" stroke-linecap="round" '
                f'opacity="{op:.2f}"/>'
            )
    return _g("".join(bagian), x, y, skala)


def mangkuk_matcha(
    x: float, y: float, *, skala: float = 1.0, kocok: float = 0.0, isi: float = 1.0
) -> str:
    """Mangkuk teh dengan kocokan bambu. kocok 0..1 menggerakkan kocokannya."""
    w, h = 190.0, 105.0
    sudut = math.sin(kocok * math.pi * 2) * 16
    geser = math.sin(kocok * math.pi * 2) * w * 0.07
    bagian = [
        # Mangkuk
        f'<path d="M {-w*0.5:.0f} {-h:.0f} q 0 {h:.0f} {w*0.5:.0f} {h:.0f} '
        f'q {w*0.5:.0f} 0 {w*0.5:.0f} {-h:.0f} Z" fill="{HIJAU_MUDA}"/>',
    ]
    if isi > 0:
        bagian.append(
            f'<ellipse cx="0" cy="{-h*0.93:.0f}" rx="{w*0.47:.0f}" ry="{h*0.16:.0f}" '
            f'fill="{HIJAU_MATCHA}"/>'
        )
        # Buih di permukaan
        for i in range(4):
            bx = (i - 1.5) * w * 0.16
            by = -h * 0.93 + math.sin(kocok * 6.28 + i) * 4
            bagian.append(
                f'<circle cx="{bx:.0f}" cy="{by:.0f}" r="{7 + i % 2 * 3}" '
                f'fill="{HIJAU_MUDA}" opacity="0.85"/>'
            )
    # Kocokan bambu
    kocokan = [
        f'<rect x="-9" y="{-h*2.0:.0f}" width="18" height="{h*0.95:.0f}" rx="8" fill="{KRIM}"/>',
    ]
    for i in range(7):
        sx = (i - 3) * 11
        kocokan.append(
            f'<path d="M {sx*0.35:.0f} {-h*1.10:.0f} Q {sx:.0f} {-h*0.75:.0f} '
            f'{sx*1.15:.0f} {-h*0.40:.0f}" fill="none" stroke="{KRIM}" '
            f'stroke-width="5" stroke-linecap="round"/>'
        )
    bagian.append(
        f'<g transform="translate({geser:.1f},0) rotate({sudut:.1f})">'
        + "".join(kocokan)
        + "</g>"
    )
    return _g("".join(bagian), x, y, skala)


def kaleng(
    x: float, y: float, *, skala: float = 1.0, warna: str = "#a8d5a2",
    warna_tutup: str = "#96c890", label: str = "",
) -> str:
    """Kaleng bundar bertutup, bentuk umum kemasan bubuk teh."""
    w, h = 150.0, 175.0
    bagian = [
        f'<rect x="{-w*0.5:.0f}" y="{-h:.0f}" width="{w:.0f}" height="{h:.0f}" '
        f'rx="10" fill="{warna}"/>',
        f'<rect x="{-w*0.53:.0f}" y="{-h:.0f}" width="{w*1.06:.0f}" '
        f'height="{h*0.26:.0f}" rx="10" fill="{warna_tutup}"/>',
        f'<ellipse cx="0" cy="{-h:.0f}" rx="{w*0.53:.0f}" ry="{h*0.055:.0f}" '
        f'fill="{warna_tutup}"/>',
    ]
    if label:
        bagian.append(
            f'<text x="0" y="{-h*0.42:.0f}" font-family="Poppins,sans-serif" '
            f'font-size="30" font-weight="800" text-anchor="middle" '
            f'fill="{GELAP}" letter-spacing="2">{label}</text>'
        )
    return _g("".join(bagian), x, y, skala)


def bubuk_tumpah(x: float, y: float, *, jumlah: int = 12, sebar: float = 120.0,
                 maju: float = 0.0, warna: str = HIJAU_MATCHA) -> str:
    """Serbuk yang berhamburan. maju 0..1 menyebarkan dan menjatuhkannya."""
    bagian = []
    for i in range(jumlah):
        a = (i / jumlah) * math.pi * 2
        jarak = sebar * maju * (0.55 + (i % 4) * 0.18)
        px = math.cos(a) * jarak
        py = -abs(math.sin(a)) * jarak * 0.45 + maju * maju * 90
        r = 5 + (i % 3) * 3
        bagian.append(
            f'<circle cx="{px:.0f}" cy="{py:.0f}" r="{r}" fill="{warna}" '
            f'opacity="{max(0.0, 1 - maju * 0.75):.2f}"/>'
        )
    return _g("".join(bagian), x, y)


# ---------------------------------------------------------------------------
# Tanaman dan kebun
# ---------------------------------------------------------------------------
def daun(x: float, y: float, *, skala: float = 1.0, putar: float = 0.0,
         warna: str = HIJAU) -> str:
    isi = (
        f'<path d="M 0 0 Q -55 -40 0 -110 Q 55 -40 0 0 Z" fill="{warna}"/>'
        f'<path d="M 0 -8 L 0 -95" stroke="{HIJAU_TUA}" stroke-width="5" '
        f'stroke-linecap="round"/>'
    )
    return _g(isi, x, y, skala, putar)


def baris_kebun(
    y: float, *, jumlah: int = 5, lebar: float = 1080.0, tinggi_baris: float = 46.0,
    susut: float = 0.0,
) -> str:
    """Kebun teh berundak. susut 0..1 mengurangi jumlah dan lebar barisnya."""
    bagian = []
    tersisa = max(1, int(round(jumlah * (1 - susut * 0.72))))
    for i in range(tersisa):
        t = i / max(1, jumlah - 1)
        by = y - i * tinggi_baris * 1.05
        bw = lebar * (0.98 - t * 0.16) * (1 - susut * 0.35)
        warna = HIJAU_TUA if i % 2 else HIJAU
        bagian.append(
            f'<rect x="{(1080 - bw) / 2:.0f}" y="{by - tinggi_baris:.0f}" '
            f'width="{bw:.0f}" height="{tinggi_baris:.0f}" rx="{tinggi_baris/2:.0f}" '
            f'fill="{warna}"/>'
        )
    return "".join(bagian)


def gunung(y: float, *, warna: str = "#3d2a6b", tinggi: float = 260.0) -> str:
    """Siluet perbukitan sebagai lapisan latar belakang."""
    return (
        f'<path d="M 0 {y:.0f} L 0 {y - tinggi * 0.55:.0f} '
        f'L 220 {y - tinggi:.0f} L 430 {y - tinggi * 0.45:.0f} '
        f'L 640 {y - tinggi * 0.92:.0f} L 880 {y - tinggi * 0.35:.0f} '
        f'L 1080 {y - tinggi * 0.7:.0f} L 1080 {y:.0f} Z" fill="{warna}"/>'
    )


# ---------------------------------------------------------------------------
# Industri
# ---------------------------------------------------------------------------
def pabrik(x: float, y: float, *, skala: float = 1.0, asap: float = 0.0) -> str:
    w, h = 300.0, 210.0
    bagian = [
        f'<rect x="{-w*0.5:.0f}" y="{-h*0.62:.0f}" width="{w:.0f}" '
        f'height="{h*0.62:.0f}" fill="{ABU}"/>',
        f'<rect x="{-w*0.34:.0f}" y="{-h:.0f}" width="{w*0.20:.0f}" '
        f'height="{h*0.42:.0f}" fill="{ABU}"/>',
        f'<rect x="{w*0.10:.0f}" y="{-h*0.90:.0f}" width="{w*0.20:.0f}" '
        f'height="{h*0.32:.0f}" fill="{ABU}"/>',
    ]
    for i in range(3):
        bagian.append(
            f'<rect x="{-w*0.40 + i * w*0.26:.0f}" y="{-h*0.44:.0f}" '
            f'width="{w*0.16:.0f}" height="{h*0.20:.0f}" fill="{KUNING}"/>'
        )
    if asap > 0:
        for i in range(4):
            fase = (asap + i * 0.25) % 1.0
            bagian.append(
                f'<circle cx="{-w*0.24 + fase * 34:.0f}" '
                f'cy="{-h - fase * 150:.0f}" r="{20 + fase * 34:.0f}" '
                f'fill="{ABU}" opacity="{max(0.0, 0.55 * (1 - fase)):.2f}"/>'
            )
    return _g("".join(bagian), x, y, skala)


def roda_gigi(x: float, y: float, *, jari: float = 90.0, gigi: int = 10,
              putar: float = 0.0, warna: str = "#607d8b") -> str:
    bagian = []
    for i in range(gigi):
        a = 360 / gigi * i
        bagian.append(
            f'<rect x="-15" y="{-jari - 26:.0f}" width="30" height="34" rx="6" '
            f'fill="{warna}" transform="rotate({a})"/>'
        )
    bagian.append(f'<circle cx="0" cy="0" r="{jari:.0f}" fill="{warna}"/>')
    bagian.append(f'<circle cx="0" cy="0" r="{jari*0.34:.0f}" fill="{GELAP}" opacity="0.35"/>')
    return _g("".join(bagian), x, y, 1.0, putar)


def kantong(x: float, y: float, *, skala: float = 1.0, warna: str = "#b0bec5",
            warna_isi: str = "#7cb342") -> str:
    w, h = 120.0, 150.0
    isi = (
        f'<path d="M {-w*0.5:.0f} {-h*0.82:.0f} L {w*0.5:.0f} {-h*0.82:.0f} '
        f'L {w*0.42:.0f} 0 L {-w*0.42:.0f} 0 Z" fill="{warna}"/>'
        f'<rect x="{-w*0.5:.0f}" y="{-h:.0f}" width="{w:.0f}" '
        f'height="{h*0.20:.0f}" rx="6" fill="{warna_isi}"/>'
    )
    return _g(isi, x, y, skala)


# ---------------------------------------------------------------------------
# Alat bantu cerita
# ---------------------------------------------------------------------------
def jam_pasir(x: float, y: float, *, skala: float = 1.0, jalan: float = 0.0) -> str:
    """jalan 0..1 memindahkan pasir dari ruang atas ke ruang bawah."""
    w, h = 130.0, 190.0
    sisa = 1 - jalan
    bagian = [
        f'<rect x="{-w*0.5:.0f}" y="{-h:.0f}" width="{w:.0f}" height="16" rx="8" fill="{COKELAT}"/>',
        f'<rect x="{-w*0.5:.0f}" y="-16" width="{w:.0f}" height="16" rx="8" fill="{COKELAT}"/>',
        f'<path d="M {-w*0.36:.0f} {-h+16:.0f} L {w*0.36:.0f} {-h+16:.0f} '
        f'L 0 {-h*0.5:.0f} Z" fill="{PUTIH}" opacity="0.30"/>',
        f'<path d="M {-w*0.36:.0f} -16 L {w*0.36:.0f} -16 L 0 {-h*0.5:.0f} Z" '
        f'fill="{PUTIH}" opacity="0.30"/>',
        # Pasir atas menyusut
        f'<path d="M {-w*0.36*sisa:.0f} {-h*0.5 - (h*0.5-16)*sisa:.0f} '
        f'L {w*0.36*sisa:.0f} {-h*0.5 - (h*0.5-16)*sisa:.0f} L 0 {-h*0.5:.0f} Z" '
        f'fill="{JINGGA}"/>',
        # Pasir bawah bertambah
        f'<path d="M {-w*0.36*jalan:.0f} -16 L {w*0.36*jalan:.0f} -16 '
        f'L 0 {-16 - (h*0.5-16)*jalan:.0f} Z" fill="{JINGGA}"/>',
    ]
    if 0.02 < jalan < 0.98:
        bagian.append(
            f'<rect x="-3" y="{-h*0.5:.0f}" width="6" height="{h*0.42:.0f}" fill="{JINGGA}"/>'
        )
    return _g("".join(bagian), x, y, skala)


def kaca_pembesar(x: float, y: float, *, jari: float = 150.0, skala: float = 1.0,
                  isi: str = "", warna_bingkai: str = KUNING) -> str:
    """Lingkaran pembesar berisi gambar, alat bercerita khas gaya ini."""
    return _g(
        f'<defs><clipPath id="kp{int(x)}{int(y)}">'
        f'<circle cx="0" cy="0" r="{jari:.0f}"/></clipPath></defs>'
        f'<circle cx="0" cy="0" r="{jari:.0f}" fill="{GELAP}"/>'
        f'<g clip-path="url(#kp{int(x)}{int(y)})">{isi}</g>'
        f'<circle cx="0" cy="0" r="{jari:.0f}" fill="none" '
        f'stroke="{warna_bingkai}" stroke-width="16"/>'
        f'<rect x="{jari*0.62:.0f}" y="-14" width="{jari*0.62:.0f}" height="28" rx="14" '
        f'fill="{warna_bingkai}" transform="rotate(45)"/>',
        x, y, skala,
    )


def tanda_seru(x: float, y: float, *, skala: float = 1.0, warna: str = MERAH) -> str:
    isi = (
        f'<path d="M -14 -90 L 14 -90 L 9 -22 L -9 -22 Z" fill="{warna}"/>'
        f'<circle cx="0" cy="0" r="14" fill="{warna}"/>'
    )
    return _g(isi, x, y, skala)


def panah_turun(x: float, y: float, *, panjang: float = 140.0, skala: float = 1.0,
                warna: str = MERAH) -> str:
    isi = (
        f'<rect x="-13" y="{-panjang:.0f}" width="26" height="{panjang*0.72:.0f}" fill="{warna}"/>'
        f'<path d="M -42 {-panjang*0.34:.0f} L 42 {-panjang*0.34:.0f} L 0 0 Z" fill="{warna}"/>'
    )
    return _g(isi, x, y, skala)


def topi_petani(x: float, y: float, *, skala: float = 1.0) -> str:
    """Caping, dipasang di atas kepala tokoh."""
    isi = (
        f'<path d="M -110 0 Q 0 -18 110 0 Q 0 -105 -110 0 Z" fill="{JINGGA}"/>'
        f'<path d="M -110 0 Q 0 16 110 0" fill="none" stroke="{COKELAT}" stroke-width="8"/>'
    )
    return _g(isi, x, y, skala)


def gedung(x: float, y: float, *, lebar: float = 120.0, tinggi: float = 300.0,
           warna: str = "#4a3a7a") -> str:
    bagian = [
        f'<rect x="{-lebar*0.5:.0f}" y="{-tinggi:.0f}" width="{lebar:.0f}" '
        f'height="{tinggi:.0f}" rx="6" fill="{warna}"/>'
    ]
    baris = int(tinggi // 62)
    for r in range(baris):
        for c in range(2):
            bagian.append(
                f'<rect x="{-lebar*0.26 + c * lebar*0.30:.0f}" '
                f'y="{-tinggi + 26 + r * 62:.0f}" width="{lebar*0.20:.0f}" '
                f'height="{lebar*0.20:.0f}" fill="{KUNING}" opacity="0.75"/>'
            )
    return _g("".join(bagian), x, y)
