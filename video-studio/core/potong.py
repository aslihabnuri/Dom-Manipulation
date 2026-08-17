"""Memotong satu gambar tokoh menjadi bagian tubuh yang bisa digerakkan.

Model gambar mengirim tokoh sebagai satu keping datar. Keping datar tidak
bisa dianimasikan: mau digeser, diputar, atau dibesarkan, ia tetap satu
benda kaku. Itu sebabnya adegan terasa seperti foto yang cuma didorong
kamera.

Animasi guntingan menyelesaikannya dengan cara paling tua di dunia film:
tokohnya digunting di sendi, tiap potongan diputar pada sendinya sendiri,
lalu ditumpuk kembali sesuai urutan kedalaman. Kepala mengangguk di leher,
lengan berayun di bahu, badan bernapas. Tidak perlu membeli gambar baru.

Dua hal yang membuat sambungannya tidak terlihat:

1. Potongan dibuat MELUBER ke dalam badan. Bagian yang meluber selalu
   tertutup badan, jadi seberapa pun potongan itu berputar, tidak pernah
   muncul celah di garis potong.
2. Potongan digambar DI BAWAH badan untuk lengan, dan DI ATAS badan untuk
   kepala. Badan menutupi garis potong lengan; leher yang sempit menutupi
   garis potong kepala.

Sudut putar dijaga kecil. Pada bahu, tiga derajat sudah membuat ujung
lengan berayun dua puluh piksel, dan itu sudah terbaca jelas di layar.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image


@dataclass
class Bagian:
    """Satu potongan tubuh beserta letak sendinya.

    berkas  : PNG potongan, sudah transparan di luar siluet.
    lebar   : lebar potongan dalam piksel gambar asal.
    tinggi  : tinggi potongan dalam piksel gambar asal.
    poros   : titik putar sebagai pecahan kotak potongan, dipakai langsung
              oleh anim.aset(poros=...).
    jangkar : letak sendi dalam koordinat gambar asal (x, y). Dipakai untuk
              menghitung di mana potongan harus ditaruh saat adegan disusun.
    """

    nama: str
    berkas: Path
    lebar: int
    tinggi: int
    poros: tuple[float, float]
    jangkar: tuple[int, int]


def _kotak_isi(im: Image.Image) -> tuple[int, int, int, int]:
    kotak = im.getchannel("A").getbbox()
    return kotak if kotak else (0, 0, im.width, im.height)


def profil_lebar(sumber: Path, langkah: int = 10) -> list[tuple[int, int, int]]:
    """Lebar siluet tiap beberapa baris: (y, x_kiri, x_kanan).

    Dipakai untuk mencari leher dan bahu tanpa menebak: leher adalah baris
    paling sempit di sepertiga atas, bahu adalah baris tempat lebar mulai
    melonjak sesudah leher.
    """
    im = Image.open(sumber).convert("RGBA")
    a = im.getchannel("A").load()
    w, h = im.size
    hasil = []
    for y in range(0, h, langkah):
        kiri = kanan = None
        for x in range(w):
            if a[x, y] > 60:
                if kiri is None:
                    kiri = x
                kanan = x
        if kiri is not None:
            hasil.append((y, kiri, kanan))
    return hasil


def cari_leher(sumber: Path) -> int:
    """Baris tersempit di antara 20% dan 40% tinggi tokoh berdiri.

    Di rentang itu topi sudah selesai dan bahu belum mulai, jadi baris
    tersempit hampir selalu benar-benar leher.
    """
    prof = profil_lebar(sumber, langkah=4)
    if not prof:
        raise ValueError(f"gambar kosong: {sumber}")
    tinggi = prof[-1][0]
    kandidat = [p for p in prof if 0.20 * tinggi <= p[0] <= 0.42 * tinggi]
    if not kandidat:
        kandidat = prof
    y, kiri, kanan = min(kandidat, key=lambda p: p[2] - p[1])
    return y


def iris_kepala(
    sumber: Path,
    keluar_dir: Path,
    *,
    y_potong: int | None = None,
    turun: int = 6,
) -> tuple[Bagian, Bagian]:
    """Pisahkan kepala dan topi dari badan, dipotong di leher.

    Mengembalikan (kepala, badan). Kepala digambar DI ATAS badan. Badan
    diperpanjang ke atas dengan menyalin baris leher supaya, kalau kepala
    miring beberapa derajat, tidak ada celah yang menganga di sambungan.
    """
    im = Image.open(sumber).convert("RGBA")
    w, h = im.size
    yp = (y_potong if y_potong is not None else cari_leher(sumber)) + turun

    kepala = im.crop((0, 0, w, yp))
    badan = im.crop((0, yp, w, h))

    # Baris leher disalin ke atas sebagai penyumbat sambungan. Barisnya
    # ditumpuk apa adanya, tidak dilebarkan, supaya lebar leher tetap.
    sumbat_tinggi = 26
    baris = im.crop((0, max(0, yp - 2), w, yp - 1))
    kanvas = Image.new("RGBA", (w, h - yp + sumbat_tinggi), (0, 0, 0, 0))
    for i in range(sumbat_tinggi):
        kanvas.paste(baris, (0, i), baris)
    kanvas.paste(badan, (0, sumbat_tinggi), badan)

    keluar_dir.mkdir(parents=True, exist_ok=True)
    fk = keluar_dir / f"{sumber.stem}_kepala.png"
    fb = keluar_dir / f"{sumber.stem}_badan.png"
    kepala.save(fk)
    kanvas.save(fb)

    # Poros kepala di tengah bawah potongan, yaitu tepat di leher.
    _, kiri, kanan = min(
        (p for p in profil_lebar(sumber, 4) if abs(p[0] - yp) < 12),
        key=lambda p: p[2] - p[1],
        default=(yp, 0, w),
    )
    px = ((kiri + kanan) / 2) / w
    return (
        Bagian("kepala", fk, w, yp, (px, 1.0), (int((kiri + kanan) / 2), yp)),
        Bagian("badan", fb, w, h - yp + sumbat_tinggi, (0.5, 1.0), (w // 2, h)),
    )


def iris_lengan(
    sumber: Path,
    keluar_dir: Path,
    *,
    y_bahu: int,
    y_bawah: int,
    x_potong_kiri: int,
    x_potong_kanan: int,
    luber: int = 46,
) -> tuple[Bagian, Bagian, Bagian]:
    """Pisahkan dua lengan dari badan, dipotong tegak di bahu.

    Mengembalikan (lengan_kiri, lengan_kanan, badan_tanpa_lengan). Kedua
    lengan digambar DI BAWAH badan, jadi garis potongnya tertutup.

    luber adalah berapa piksel potongan lengan menjorok ke dalam badan.
    Nilainya harus lebih besar daripada simpangan terjauh yang mungkin
    terjadi saat lengan berayun, kalau tidak celah akan terlihat.
    """
    im = Image.open(sumber).convert("RGBA")
    w, h = im.size

    kiri = im.crop((0, y_bahu, min(w, x_potong_kiri + luber), y_bawah))
    kanan = im.crop((max(0, x_potong_kanan - luber), y_bahu, w, y_bawah))

    # Badan kehilangan kedua sisi lengan, tapi hanya di rentang bahu-bawah.
    badan = im.copy()
    kosong = Image.new("RGBA", (x_potong_kiri, y_bawah - y_bahu), (0, 0, 0, 0))
    badan.paste(kosong, (0, y_bahu))
    kosong2 = Image.new("RGBA", (w - x_potong_kanan, y_bawah - y_bahu), (0, 0, 0, 0))
    badan.paste(kosong2, (x_potong_kanan, y_bahu))

    keluar_dir.mkdir(parents=True, exist_ok=True)
    fki = keluar_dir / f"{sumber.stem}_lengan_kiri.png"
    fka = keluar_dir / f"{sumber.stem}_lengan_kanan.png"
    fb = keluar_dir / f"{sumber.stem}_badan2.png"
    kiri.save(fki)
    kanan.save(fka)
    badan.save(fb)

    wk, hk = kiri.size
    wa, ha = kanan.size
    # Poros lengan kiri ada di pojok kanan atas potongan, yaitu di bahu.
    return (
        Bagian("lengan_kiri", fki, wk, hk, ((wk - luber) / wk, 0.04),
               (x_potong_kiri, y_bahu)),
        Bagian("lengan_kanan", fka, wa, ha, (luber / wa, 0.04),
               (x_potong_kanan, y_bahu)),
        Bagian("badan", fb, w, h, (0.5, 1.0), (w // 2, h)),
    )


def urai_tokoh(sumber: Path, keluar_dir: Path) -> dict[str, Bagian]:
    """Potong tokoh berdiri menjadi kepala, dua lengan, dan badan.

    Ukuran potongan ditentukan dari siluetnya sendiri, bukan dari angka
    yang ditebak, supaya cara ini tetap jalan untuk tokoh lain nanti.
    """
    im = Image.open(sumber).convert("RGBA")
    w, h = im.size
    y_leher = cari_leher(sumber)

    prof = profil_lebar(sumber, 6)
    # Bahu: baris pertama sesudah leher yang lebarnya melonjak melewati
    # satu setengah kali lebar leher.
    lebar_leher = next(
        (p[2] - p[1] for p in prof if abs(p[0] - y_leher) < 8), w // 4
    )
    y_bahu = next(
        (p[0] for p in prof if p[0] > y_leher and (p[2] - p[1]) > lebar_leher * 1.45),
        y_leher + 40,
    )
    # Lengan berakhir di baris tempat siluet menyempit lagi (pinggang).
    lebar_maks = max(p[2] - p[1] for p in prof if p[0] > y_bahu)
    y_bawah = next(
        (p[0] for p in prof
         if p[0] > y_bahu + (h - y_bahu) * 0.35 and (p[2] - p[1]) < lebar_maks * 0.72),
        int(y_bahu + (h - y_bahu) * 0.62),
    )
    # Garis potong tegak: di tepi badan pada ketinggian bahu.
    _, bk, bka = next(p for p in prof if p[0] >= y_bahu)

    kepala, _ = iris_kepala(sumber, keluar_dir, y_potong=y_leher)
    lengan_ki, lengan_ka, badan = iris_lengan(
        sumber, keluar_dir,
        y_bahu=y_bahu, y_bawah=y_bawah,
        x_potong_kiri=bk + 8, x_potong_kanan=bka - 8,
    )
    # Badan akhir: sudah tanpa lengan, kepalanya juga dibuang.
    bad_im = Image.open(badan.berkas).convert("RGBA")
    bad_im.paste(Image.new("RGBA", (w, y_leher), (0, 0, 0, 0)), (0, 0))
    baris = im.crop((0, max(0, y_leher - 2), w, y_leher - 1))
    for i in range(20):
        bad_im.paste(baris, (0, y_leher - 14 + i), baris)
    bad_im.save(badan.berkas)

    return {
        "kepala": kepala,
        "lengan_kiri": lengan_ki,
        "lengan_kanan": lengan_ka,
        "badan": Bagian("badan", badan.berkas, w, h, (0.5, 1.0), (w // 2, h)),
    }
