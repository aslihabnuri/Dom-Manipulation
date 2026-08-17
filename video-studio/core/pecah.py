"""Memecah satu poster kolase menjadi potongan-potongan yang bisa digerakkan.

Pasangan dari gerak.py. Poster dibuat sekali oleh model gambar, lalu di sini
digunting jadi bagian-bagian; tiap bagian mengingat kotak asalnya, supaya
nanti bisa terbang pulang ke tempat yang persis sama.

Dua cara memotong:

  potong   kotak diambil apa adanya. Untuk guntingan koran, pita judul,
           balok teks. Cepat, bersih, dan gratis.
  gunting  kotak diambil lalu latarnya dibuang jadi transparan. Untuk
           tokoh, benda, stiker.

Penghematan yang penting di sini: latar poster memang SATU WARNA RATA,
karena begitulah kita memintanya di gaya.py. Warna rata bisa dibuang
sendiri oleh kode, gratis, tanpa memanggil layanan berbayar.

    lama  : 3 potongan x (4 kredit gambar + 1 kredit buang latar) = 15
    baru  : 1 poster x 4 kredit + buang latar sendiri             =  4

Pembuangan latar berbayar tetap disediakan sebagai cadangan, dipakai hanya
kalau pemeriksaan mutu menyatakan hasil lokalnya gagal. Jadi kredit hanya
keluar kalau memang perlu, bukan karena kebiasaan.

Kenapa harus merambat dari tepi, bukan sekadar membuang semua piksel yang
mirip warna latar: kalau tokohnya memakai baju krem dan latarnya juga krem,
membuang berdasarkan warna saja akan melubangi bajunya. Dengan merambat
dari tepi, hanya latar yang benar-benar bersambung ke luar yang dibuang,
dan krem yang terkurung di dalam siluet tetap aman.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


@dataclass
class Elemen:
    """Satu potongan poster.

    kotak adalah (x0, y0, x1, y1) dalam koordinat poster. Pusat kotak inilah
    tempat potongan itu pulang saat animasi selesai.
    """

    nama: str
    kotak: tuple[int, int, int, int]
    mode: str = "potong"                 # potong | gunting
    hapus: list[tuple[int, int, int, int]] = field(default_factory=list)
    berkas: Path | None = None
    lapis: int = 0                       # urutan gambar, kecil di belakang

    @property
    def pusat(self) -> tuple[float, float]:
        x0, y0, x1, y1 = self.kotak
        return (x0 + x1) / 2.0, (y0 + y1) / 2.0


@dataclass
class Mutu:
    """Hasil pemeriksaan pembuangan latar lokal."""

    terbuang: float          # persen piksel yang jadi transparan
    sisa_tepi: float         # persen piksel tepi kotak yang masih pekat
    layak: bool
    alasan: str = ""


def _warna_tepi(im: Image.Image, tebal: int = 14) -> np.ndarray:
    """Tebak warna latar dari empat pojok kotak.

    Pojok dipakai, bukan seluruh pita tepi. Kotak yang rapat mengelilingi
    sebuah benda memang menyenggol bendanya di tengah tiap sisi, jadi pita
    tepi penuh akan selalu terlihat tidak seragam dan pemeriksaan jadi
    salah menolak. Pojok hampir selalu latar.

    Nilai tengah dipakai, bukan rata-rata, supaya satu pojok yang kebetulan
    tertutup benda tidak menggeser tebakannya.
    """
    a = np.asarray(im.convert("RGB"), dtype=np.float32)
    h, w = a.shape[:2]
    t = max(3, min(tebal, h // 4, w // 4))
    pojok = np.concatenate([
        a[:t, :t].reshape(-1, 3), a[:t, -t:].reshape(-1, 3),
        a[-t:, :t].reshape(-1, 3), a[-t:, -t:].reshape(-1, 3),
    ])
    return np.median(pojok, axis=0)


def buang_latar_lokal(
    im: Image.Image,
    *,
    toleransi: float = 26.0,
    haluskan: int = 2,
) -> tuple[Image.Image, Mutu]:
    """Buang latar rata dengan merambat dari tepi. Gratis.

    toleransi adalah jarak warna yang masih dianggap latar, diukur pada
    salinan yang sudah dikaburkan supaya titik halftone tidak ikut dihitung.
    """
    rgb = im.convert("RGB")
    a = np.asarray(rgb, dtype=np.float32)
    h, w = a.shape[:2]
    warna = _warna_tepi(rgb)

    # Keputusan diambil di atas salinan yang dikaburkan, bukan di gambar
    # aslinya. Titik halftone membuat latar yang seharusnya rata tersebar
    # sampai enam puluh satuan warna, sehingga toleransi harus dilebarkan,
    # dan toleransi selebar itu ikut memakan tepi kertas putih potongannya.
    # Dikaburkan lebih dulu, sebaran latar turun ke belasan, jadi toleransi
    # bisa diperketat dan tepi potongan selamat. Topengnya tetap diterapkan
    # ke gambar asli yang masih tajam.
    kabur = np.asarray(rgb.filter(ImageFilter.GaussianBlur(3)), dtype=np.float32)
    jarak = np.sqrt(((kabur - warna) ** 2).sum(axis=2))
    mirip = (jarak < toleransi).astype(np.uint8) * 255

    # Merambat dari tepi: gambar dibingkai dulu supaya satu titik semai di
    # pojok sudah menjangkau semua tepi sekaligus.
    bingkai = Image.new("L", (w + 2, h + 2), 255)
    bingkai.paste(Image.fromarray(mirip, "L"), (1, 1))
    ImageDraw.floodfill(bingkai, (0, 0), 128, thresh=0)
    rambat = np.asarray(bingkai, dtype=np.uint8)[1:h + 1, 1:w + 1]
    latar = rambat == 128

    alpha = np.where(latar, 0, 255).astype(np.uint8)
    amask = Image.fromarray(alpha, "L")
    if haluskan:
        # Sedikit dikaburkan lalu dipertegas: menghilangkan gerigi piksel
        # tanpa membuat tepi jadi lembek.
        amask = amask.filter(ImageFilter.GaussianBlur(haluskan))
        amask = amask.point(lambda v: 0 if v < 110 else (255 if v > 165 else v))

    hasil = im.convert("RGBA")
    hasil.putalpha(amask)

    terbuang = float(latar.mean() * 100)
    # Uji kejujuran: piksel yang DINYATAKAN latar harus benar-benar seragam.
    # Ini pemeriksaan yang tepat, karena menilai hasil keputusannya sendiri,
    # bukan menebak dari pita tepi yang memang menyenggol bendanya.
    #
    # Diukur pada salinan kabur yang sama dengan yang dipakai memutuskan.
    # Kalau diukur di gambar asli, titik halftone latar selalu membuatnya
    # terlihat tidak seragam, dan potongan yang benar ikut tertolak.
    sebar = float(kabur[latar].std(axis=0).mean()) if latar.any() else 999.0
    tepi_pekat = float(np.asarray(amask)[[0, -1], :].mean() / 255 * 100)

    layak, alasan = True, ""
    if terbuang < 4:
        layak, alasan = False, "hampir tidak ada yang terbuang, latarnya mungkin tidak rata"
    elif terbuang > 96:
        layak, alasan = False, "hampir semuanya terbuang, kotaknya mungkin salah"
    elif sebar > 30:
        layak, alasan = False, (f"yang dibuang ternyata tidak seragam (sebar {sebar:.0f}), "
                                "latarnya bukan warna rata")
    else:
        # Penjaga yang paling penting, dan yang paling mudah terlewat: latar
        # boleh terbuang seluruhnya dan tetap salah, kalau yang ikut termakan
        # adalah tepi kertas putih potongannya sendiri. Warna tepi kertas
        # memang dekat sekali dengan warna kertas latar.
        #
        # Kotak dipilih rapat mengelilingi bendanya, jadi tengah kotak
        # seharusnya benda. Kalau tengahnya ikut hilang, atau yang tersisa
        # jauh lebih kurus daripada kotaknya, berarti pembuangan menggerogoti
        # ke dalam dan hasilnya tidak boleh dipakai diam-diam.
        pekat = np.asarray(amask, dtype=np.uint8) > 40
        ty, tx = h // 2, w // 2
        inti = pekat[max(0, ty - h // 12):ty + h // 12 + 1,
                     max(0, tx - w // 12):tx + w // 12 + 1]
        if inti.size and inti.mean() < 0.35:
            layak, alasan = False, "tengah kotak ikut terbuang, tepi potongan tergerogoti"
        elif pekat.any():
            ys, xs = np.nonzero(pekat)
            isi = (xs.max() - xs.min() + 1) * (ys.max() - ys.min() + 1) / float(w * h)
            if isi < 0.35:
                layak, alasan = False, (f"sisa potongan cuma {isi*100:.0f}% dari kotaknya, "
                                        "kemungkinan tepinya ikut termakan")
    return hasil, Mutu(terbuang, tepi_pekat, layak, alasan)


def _hapus_bagian(el: Image.Image, kotak: tuple[int, int, int, int],
                  hapus: list[tuple[int, int, int, int]]) -> Image.Image:
    """Hapus daerah tertentu dari potongan, dalam koordinat poster.

    Dipakai kalau satu guntingan ikut menyeret tetangganya, misalnya tokoh
    yang terpotong bersama benda di sebelahnya yang seharusnya digerakkan
    sendiri.
    """
    ox, oy = kotak[0], kotak[1]
    topeng = Image.new("L", el.size, 255)
    d = ImageDraw.Draw(topeng)
    for r in hapus:
        d.rounded_rectangle([r[0] - ox, r[1] - oy, r[2] - ox, r[3] - oy],
                            radius=28, fill=0)
    topeng = topeng.filter(ImageFilter.GaussianBlur(12))
    a = np.asarray(el.split()[3], dtype=float) * (np.asarray(topeng, dtype=float) / 255.0)
    el.putalpha(Image.fromarray(a.astype("uint8"), "L"))
    return el


def buang_terbesar(im: Image.Image, ambang: int = 40) -> Image.Image:
    """Sisakan gumpalan pekat terbesar saja, buang sisa kotoran di sekitarnya.

    Pembuangan latar apa pun, lokal maupun berbayar, biasanya meninggalkan
    serpihan kecil di tepi. Serpihan itu ikut terbang saat dianimasikan dan
    terlihat seperti debu yang salah.
    """
    a = np.asarray(im.split()[3], dtype=np.uint8)
    pekat = (a > ambang).astype(np.uint8) * 255
    h, w = pekat.shape
    bingkai = Image.new("L", (w + 2, h + 2), 0)
    bingkai.paste(Image.fromarray(pekat, "L"), (1, 1))

    # Setiap gumpalan diwarnai lewat perambatan, lalu yang terbesar dipilih.
    kerja = bingkai.copy()
    arr = np.asarray(kerja, dtype=np.uint8)
    terbaik, luas_terbaik = None, 0
    tanda = 60
    while True:
        sisa = np.argwhere(np.asarray(kerja, dtype=np.uint8) == 255)
        if len(sisa) == 0 or tanda > 250:
            break
        y, x = sisa[0]
        ImageDraw.floodfill(kerja, (int(x), int(y)), tanda, thresh=0)
        luas = int((np.asarray(kerja, dtype=np.uint8) == tanda).sum())
        if luas > luas_terbaik:
            luas_terbaik, terbaik = luas, tanda
        tanda += 1
    if terbaik is None:
        return im
    simpan = (np.asarray(kerja, dtype=np.uint8) == terbaik)[1:h + 1, 1:w + 1]
    baru = im.copy()
    alpha = np.asarray(baru.split()[3], dtype=np.uint8) * simpan.astype(np.uint8)
    baru.putalpha(Image.fromarray(alpha, "L"))
    return baru


def pecah_poster(
    poster: Path,
    elemen: list[Elemen],
    keluar_dir: Path,
    *,
    klien=None,
    izinkan_berbayar: bool = False,
    lapor=None,
) -> tuple[list[Elemen], list[str]]:
    """Gunting poster jadi potongan. Mengembalikan (elemen, catatan).

    klien dan izinkan_berbayar hanya dipakai kalau pembuangan latar lokal
    dinyatakan gagal untuk sebuah potongan. Kalau berbayar tidak diizinkan,
    potongan itu tetap dipakai apa adanya dan dicatat sebagai keluhan,
    supaya tidak ada kredit yang keluar diam-diam.
    """
    kartu = Image.open(poster).convert("RGBA")
    keluar_dir.mkdir(parents=True, exist_ok=True)
    catatan: list[str] = []

    for el in elemen:
        x0, y0, x1, y1 = el.kotak
        potongan = kartu.crop((max(0, x0), max(0, y0),
                               min(kartu.width, x1), min(kartu.height, y1)))
        tujuan = keluar_dir / f"{el.nama}.png"

        if el.mode == "gunting":
            hasil, mutu = buang_latar_lokal(potongan)
            if mutu.layak:
                hasil = buang_terbesar(hasil)
                if lapor:
                    lapor(f"  {el.nama:14} gunting lokal, {mutu.terbuang:.0f}% latar dibuang, 0 kredit")
            elif izinkan_berbayar and klien is not None:
                if lapor:
                    lapor(f"  {el.nama:14} lokal gagal ({mutu.alasan}), pakai berbayar 1 kredit")
                hasil = _gunting_berbayar(klien, potongan, keluar_dir, el.nama) or hasil
                catatan.append(f"{el.nama}: pakai pembuangan latar berbayar ({mutu.alasan})")
            else:
                catatan.append(f"{el.nama}: {mutu.alasan}; dipakai apa adanya, tidak ada kredit dipakai")
                if lapor:
                    lapor(f"  {el.nama:14} lokal ragu ({mutu.alasan}), dibiarkan utuh")
                hasil = potongan
        else:
            hasil = potongan
            if lapor:
                lapor(f"  {el.nama:14} potong kotak, 0 kredit")

        if el.hapus:
            hasil = _hapus_bagian(hasil.convert("RGBA"), el.kotak, el.hapus)
        hasil.save(tujuan)
        el.berkas = tujuan

    return elemen, catatan


def _gunting_berbayar(klien, potongan: Image.Image, keluar_dir: Path, nama: str):
    """Cadangan berbayar: unggah lalu buang latar lewat layanan. 1 kredit."""
    from .aktor import MODEL_POTONG  # satu-satunya sumber nama model
    from .visuals import unggah_gambar

    mentah = keluar_dir / f"_mentah_{nama}.png"
    potongan.save(mentah)
    try:
        url = unggah_gambar(klien.api_key, mentah)
        hasil = klien.run_task(MODEL_POTONG, {"image": url}, max_wait=300)
        tujuan = keluar_dir / f"_bersih_{nama}.png"
        klien.download(hasil.first_url, tujuan)
        return Image.open(tujuan).convert("RGBA")
    except Exception:
        return None
    finally:
        mentah.unlink(missing_ok=True)


def _sumber_terbersih(im: Image.Image, kotak: tuple[int, int, int, int]) -> tuple[int, int]:
    """Cari daerah kertas paling polos di sekitar kotak, untuk bahan tambalan.

    Memilih daerah sumber dengan menebak arah, misalnya "ambil dari bawah",
    sering meleset: yang terambil malah tepi kertas sobek atau tulisan lain.

    Tetapi memilih yang paling rata saja juga salah, dan itu terbukti:
    daerah paling rata di poster kita justru MARJIN MERAH di luar kartu,
    jadi tulisan krem tertambal balok merah. Kerataan harus dipasangkan
    dengan kemiripan warna terhadap kertas di sekeliling tulisan itu.
    """
    x0, y0, x1, y1 = kotak
    w, h = x1 - x0, y1 - y0
    a = np.asarray(im, dtype=np.float32)

    # Warna kertas yang benar diambil dari pita tepat di kiri dan kanan
    # tulisan, karena di situ pasti kertas yang sama.
    pita = []
    if x0 - w // 3 >= 0:
        pita.append(a[y0:y1, max(0, x0 - w // 3):x0].reshape(-1, 3))
    if x1 + w // 3 <= im.width:
        pita.append(a[y0:y1, x1:min(im.width, x1 + w // 3)].reshape(-1, 3))
    acuan = (np.median(np.concatenate(pita), axis=0) if pita
             else np.median(a[y0:y1, x0:x1].reshape(-1, 3), axis=0))

    terbaik, nilai_terbaik = None, None
    for dy in range(-3 * h, 3 * h + 1, max(4, h // 4)):
        for dx in range(-3 * w, 3 * w + 1, max(6, w // 6)):
            sx, sy = x0 + dx, y0 + dy
            if sx < 0 or sy < 0 or sx + w > im.width or sy + h > im.height:
                continue
            if abs(dx) < w * 0.6 and abs(dy) < h * 0.6:
                continue                       # jangan menyalin dirinya sendiri
            petak = a[sy:sy + h, sx:sx + w]
            ragam = float(petak.std(axis=(0, 1)).mean())
            beda = float(np.abs(petak.reshape(-1, 3).mean(axis=0) - acuan).mean())
            # Warna dibobot berat: kertas seragam yang salah warna jauh
            # lebih merusak daripada kertas sewarna yang sedikit bertekstur.
            nilai = beda * 3.0 + ragam
            if nilai_terbaik is None or nilai < nilai_terbaik:
                nilai_terbaik, terbaik = nilai, (sx, sy)
    return terbaik or (x0, max(0, y0 - h - 4))


def tambal(
    sumber: Path,
    keluar: Path,
    kotak: tuple[int, int, int, int],
    *,
    ambil_dari: tuple[int, int] | None = None,
    lembut: int = 6,
) -> Path:
    """Tutup satu daerah poster dengan tekstur dari daerah lain di dekatnya.

    Model gambar menulis judul pendek dengan rapi, tetapi sering mengarang
    baris tambahan yang tidak diminta dan mengejanya ngawur. Poster kedua
    kita menulis judulnya benar lalu menambahkan subjudul "WERORLY IPUS"
    yang tidak berarti apa-apa.

    Menagih ulang berarti membayar lagi tanpa jaminan barisnya tidak
    muncul lagi. Menambalnya di sini gratis dan pasti: tekstur kertas di
    sebelahnya disalin menimpa tulisan itu, lalu tepinya dilembutkan
    supaya sambungannya tidak terlihat. Teks yang memang penting sebaiknya
    ditumpangkan belakangan sebagai takarir, bukan dipanggang ke gambar.

    ambil_dari adalah pojok kiri atas daerah yang disalin. Bila kosong,
    tekstur diambil dari tepat di bawah daerah yang ditambal.
    """
    im = Image.open(sumber).convert("RGB")
    x0, y0, x1, y1 = kotak
    w, h = x1 - x0, y1 - y0
    if ambil_dari is None:
        ambil_dari = _sumber_terbersih(im, kotak)
    ax, ay = ambil_dari
    tempelan = im.crop((ax, ay, ax + w, ay + h))

    # Tepi tempelan dibuat memudar supaya sambungannya tidak berupa garis.
    #
    # Bulunya harus mengecil mengikuti daerahnya. Pada percobaan pertama
    # bulu delapan piksel dikenakan pada daerah setinggi lima puluh piksel,
    # dan kaburnya bertemu di tengah sehingga bagian tengah tambalan pun
    # ikut tembus pandang: tulisan yang mau dihapus masih membayang.
    bulu = max(1, min(lembut, w // 6, h // 6))
    topeng = Image.new("L", (w, h), 0)
    ImageDraw.Draw(topeng).rectangle([bulu, bulu, w - bulu - 1, h - bulu - 1], fill=255)
    topeng = topeng.filter(ImageFilter.GaussianBlur(bulu / 2.0))

    im.paste(tempelan, (x0, y0), topeng)
    keluar.parent.mkdir(parents=True, exist_ok=True)
    im.save(keluar)
    return keluar


def kisi_bantu(poster: Path, keluar: Path, *, langkah: int = 100) -> Path:
    """Tempelkan kisi berlabel di atas poster, untuk membaca koordinat kotak.

    Cara paling cepat menentukan kotak tiap potongan adalah melihat poster
    dengan kisi berangka di atasnya, lalu membaca angkanya. Gratis dan
    tidak perlu menebak.
    """
    im = Image.open(poster).convert("RGB")
    d = ImageDraw.Draw(im)
    for x in range(0, im.width, langkah):
        d.line([(x, 0), (x, im.height)], fill=(255, 0, 128), width=1)
        d.text((x + 3, 3), str(x), fill=(255, 0, 128))
    for y in range(0, im.height, langkah):
        d.line([(0, y), (im.width, y)], fill=(0, 160, 255), width=1)
        d.text((3, y + 3), str(y), fill=(0, 160, 255))
    keluar.parent.mkdir(parents=True, exist_ok=True)
    im.save(keluar)
    return keluar
