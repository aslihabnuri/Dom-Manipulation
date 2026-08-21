"""Antarmuka baris perintah berbahasa Indonesia."""

from __future__ import annotations

import argparse
import json
import os
import sys
import traceback
from typing import Any, Dict, List

from . import __version__
from . import caption as modul_caption
from . import config as konfigurasi
from . import fonts as modul_font
from . import produk as modul_produk
from .ffmpeg import FFmpegGagal, FFmpegTidakDitemukan
from .pipeline import Permintaan, proses
from .probe import periksa
from .similarity import bandingkan

EKSTENSI_VIDEO = (".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v", ".3gp", ".mpeg", ".mpg", ".ts")
AKAR = konfigurasi.AKAR
FOLDER_MASUK = os.path.join(AKAR, "input")
FOLDER_KELUAR = os.path.join(AKAR, "output")

HIJAU, KUNING, MERAH, ABU, TEBAL, RESET = (
    ("\033[92m", "\033[93m", "\033[91m", "\033[90m", "\033[1m", "\033[0m")
    if sys.stdout.isatty() else ("", "", "", "", "", "")
)


def _cetak_judul(teks: str) -> None:
    print(f"\n{TEBAL}{teks}{RESET}")
    print(ABU + "-" * max(12, len(teks)) + RESET)


def _kumpulkan(jalur: List[str], semua: bool) -> List[str]:
    berkas: List[str] = []
    if semua or not jalur:
        jalur = jalur or [FOLDER_MASUK]
    for j in jalur:
        if os.path.isdir(j):
            for nama in sorted(os.listdir(j)):
                if nama.lower().endswith(EKSTENSI_VIDEO):
                    berkas.append(os.path.join(j, nama))
        elif os.path.isfile(j):
            berkas.append(j)
        else:
            print(f"{KUNING}Dilewati (tidak ditemukan): {j}{RESET}")
    return berkas


def _nama_keluaran(masukan: str, tujuan: str, varian: int, total_varian: int) -> str:
    dasar = os.path.splitext(os.path.basename(masukan))[0]
    akhiran = f"_v{varian + 1}" if total_varian > 1 else ""
    if tujuan.lower().endswith(EKSTENSI_VIDEO):
        if total_varian > 1:
            akar, ekst = os.path.splitext(tujuan)
            return f"{akar}{akhiran}{ekst}"
        return tujuan
    return os.path.join(tujuan, f"{dasar}_edit{akhiran}.mp4")


def _kumpulkan_produk(a: argparse.Namespace) -> List:
    """Ubah semua opsi --sisip / --tempel / --endcard menjadi daftar Aset."""
    hasil: List = []
    for spec in a.sisip or []:
        hasil.append(modul_produk.urai(spec, "sisip"))
    for spec in a.tempel or []:
        aset = modul_produk.urai(spec, "tempel")
        aset.posisi = a.tempel_posisi
        aset.lebar = a.tempel_lebar
        hasil.append(aset)
    if a.endcard:
        hasil.append(modul_produk.urai(a.endcard, "endcard"))
    for aset in hasil:
        aset.periksa()
    return hasil


def _terapkan_opsi(pengaturan: Dict[str, Any], a: argparse.Namespace) -> Dict[str, Any]:
    gaya, video, anti = pengaturan["gaya"], pengaturan["video"], pengaturan["anti_duplikat"]
    if a.font:
        gaya["font"] = a.font
    if a.warna:
        gaya["warna_teks"] = a.warna
    if a.warna_garis:
        gaya["warna_garis"] = a.warna_garis
    if a.ukuran_judul:
        gaya["ukuran_judul"] = a.ukuran_judul
    if a.kotak:
        gaya["kotak_latar"] = True
    if a.handle:
        gaya["handle"] = a.handle
    if a.rasio:
        video["rasio"] = a.rasio
    if a.bingkai is not None:
        video["bingkai"] = a.bingkai
    if a.kualitas:
        video["kualitas"] = a.kualitas
    if a.cermin:
        anti["cermin"] = True
    if a.tanpa_cermin:
        anti["cermin"] = False
    if a.potong_tepi is not None:
        anti["potong_tepi"] = a.potong_tepi
    return pengaturan


def _tampilkan_info() -> None:
    _cetak_judul("Preset anti duplikat")
    for nama in konfigurasi.NAMA_PRESET:
        print(f"  {TEBAL}{nama:<10}{RESET} {konfigurasi.PRESET[nama]['label']}")
    _cetak_judul("Font yang tersedia")
    for f in modul_font.daftar():
        print(f"  {TEBAL}{f.keluarga:<14}{RESET} {ABU}({f.gaya}){RESET}")
    _cetak_judul("Subtitle otomatis")
    print("  " + ("aktif (paket faster-whisper terpasang)" if modul_caption.tersedia()
                  else "belum aktif - jalankan:  pip install faster-whisper"))
    print()



def _cek_sistem() -> int:
    """Periksa semua yang dibutuhkan aplikasi, lalu uji render sungguhan."""
    import shutil as _shutil
    import subprocess
    import tempfile

    from .ffmpeg import ffmpeg_bin, ffprobe_bin, punya_filter
    from .pipeline import Permintaan, proses

    lolos = True

    def baik(teks: str) -> None:
        print(f"  {HIJAU}OK{RESET}    {teks}")

    def buruk(teks: str) -> None:
        nonlocal lolos
        lolos = False
        print(f"  {MERAH}GAGAL{RESET} {teks}")

    _cetak_judul("Memeriksa perkakas")
    try:
        ff = ffmpeg_bin()
        versi = subprocess.run([ff, "-version"], capture_output=True, text=True, timeout=30)
        baik(f"ffmpeg  : {versi.stdout.splitlines()[0][:60]}")
    except Exception as e:  # noqa: BLE001
        buruk(f"ffmpeg  : {e}")
        print(f"\n{MERAH}Tanpa ffmpeg aplikasi tidak bisa jalan.{RESET} Lihat README bagian 2.")
        return 2
    try:
        ffprobe_bin()
        baik("ffprobe : tersedia")
    except Exception as e:  # noqa: BLE001
        buruk(f"ffprobe : {e}")

    for nama_filter, guna in (("ass", "menempel teks"), ("eq", "geser warna"),
                              ("noise", "butiran"), ("hflip", "cermin")):
        if punya_filter(nama_filter):
            baik(f"filter {nama_filter:<6}: siap ({guna})")
        else:
            buruk(f"filter {nama_filter:<6}: TIDAK ADA - {guna} tidak akan bekerja")
    if punya_filter("rubberband"):
        baik("filter rubberband: siap (geser nada suara kualitas terbaik)")
    else:
        print(f"  {KUNING}CATAT{RESET} filter rubberband tidak ada - dipakai cara cadangan")

    _cetak_judul("Memeriksa font")
    daftar_font = modul_font.daftar()
    if daftar_font:
        for f in daftar_font:
            baik(f"{f.label}")
    else:
        buruk(f"tidak ada font di {modul_font.FOLDER_FONT}")

    _cetak_judul("Memeriksa folder")
    for folder in (FOLDER_MASUK, FOLDER_KELUAR):
        try:
            os.makedirs(folder, exist_ok=True)
            uji = os.path.join(folder, ".uji_tulis")
            with open(uji, "w") as f:
                f.write("ok")
            os.remove(uji)
            baik(f"{folder} bisa ditulis")
        except Exception as e:  # noqa: BLE001
            buruk(f"{folder}: {e}")

    _cetak_judul("Uji render sungguhan")
    kerja = tempfile.mkdtemp(prefix="vidclean_cek_")
    try:
        contoh = os.path.join(kerja, "contoh.mp4")
        subprocess.run(
            [ffmpeg_bin(), "-hide_banner", "-loglevel", "error", "-y",
             "-f", "lavfi", "-i", "testsrc2=s=360x640:r=30:d=2",
             "-f", "lavfi", "-i", "sine=f=440:d=2",
             "-t", "2", "-c:v", "libx264", "-preset", "ultrafast",
             "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", contoh],
            check=True, capture_output=True, timeout=180,
        )
        hasil_uji = os.path.join(kerja, "hasil.mp4")
        pengaturan = konfigurasi.muat()
        pengaturan["video"]["preset_encode"] = "ultrafast"
        hasil = proses(Permintaan(
            masukan=contoh, keluaran=hasil_uji,
            judul="Uji coba", caption="teks bawah", handle="@akun",
            preset="seimbang", pengaturan=pengaturan,
        ))
        baik(f"render berhasil: {hasil.hasil.ringkas()}")
        baik(f"font terpakai  : {hasil.font_dipakai}")
    except Exception as e:  # noqa: BLE001
        buruk(f"uji render: {type(e).__name__}: {str(e)[:400]}")
    finally:
        _shutil.rmtree(kerja, ignore_errors=True)

    print()
    if lolos:
        print(f"{HIJAU}{TEBAL}Semua siap. Aplikasi bisa langsung dipakai.{RESET}\n")
        return 0
    print(f"{MERAH}{TEBAL}Ada yang belum beres - lihat baris bertanda GAGAL di atas.{RESET}\n")
    return 1


def buat_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="edit.py",
        description="Editor video anti duplikat konten - tampilan bersih, font seragam.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""Contoh pemakaian:
  python3 edit.py video.mp4
  python3 edit.py video.mp4 --judul "Cara cepat naik followers"
  python3 edit.py --semua --preset kuat
  python3 edit.py video.mp4 --varian 3
  python3 edit.py video.mp4 --auto-teks --handle "@akunku"
  python3 edit.py video.mp4 --sisip "produk.jpg,5,2.5,Serum Vitamin C"
  python3 edit.py video.mp4 --tempel "produk.jpg,3,4,Rp 89.000" --endcard "produk.jpg,3,Cek keranjang"
  python3 edit.py --info
""",
    )
    p.add_argument("video", nargs="*", help="berkas atau folder video yang mau diedit")
    p.add_argument("--semua", action="store_true", help="proses semua video di folder input/")
    p.add_argument("-o", "--keluar", default=FOLDER_KELUAR, help="folder atau nama berkas hasil")

    t = p.add_argument_group("Teks di video")
    t.add_argument("--judul", default="", help="teks besar di bagian atas (hook)")
    t.add_argument("--caption", default="", help="teks di bagian bawah")
    t.add_argument("--handle", default="", help="nama akun kecil sebagai penanda, mis. @akunku")
    t.add_argument("--auto-teks", action="store_true", help="buat subtitle otomatis dari suara video")
    t.add_argument("--bahasa", default="id", help="bahasa untuk subtitle otomatis (bawaan: id)")
    t.add_argument("--model", default="small", help="ukuran model subtitle: tiny/base/small/medium")

    pr = p.add_argument_group("Sisipan produk")
    pr.add_argument("--sisip", action="append", default=[], metavar="FOTO,MULAI,LAMA,LABEL",
                    help="potong ke foto produk sepenuh layar, suara asli tetap jalan")
    pr.add_argument("--tempel", action="append", default=[], metavar="FOTO,MULAI,LAMA,LABEL",
                    help="tampilkan foto produk sebagai kartu kecil di sudut")
    pr.add_argument("--endcard", default="", metavar="FOTO,LAMA,LABEL",
                    help="foto produk sepenuh layar di akhir video")
    pr.add_argument("--tempel-posisi", default="kanan-bawah",
                    choices=sorted(modul_produk.POSISI), help="letak kartu produk")
    pr.add_argument("--tempel-lebar", type=float, default=0.34,
                    help="lebar kartu produk sebagai porsi lebar layar (bawaan 0.34)")

    g = p.add_argument_group("Gaya tampilan")
    g.add_argument("--font", default="", help="nama font, mis. Montserrat / Poppins / Anton")
    g.add_argument("--warna", default="", help="warna teks, mis. #FFFFFF")
    g.add_argument("--warna-garis", default="", help="warna garis tepi teks, mis. #000000")
    g.add_argument("--ukuran-judul", type=int, help="ukuran huruf judul (bawaan 68)")
    g.add_argument("--kotak", action="store_true", help="beri kotak latar di belakang teks")
    g.add_argument("--rasio", choices=["9:16", "asli"], help="bentuk layar hasil")
    g.add_argument("--bingkai", type=float, help="kecilkan gambar di atas latar blur, mis. 0.92")
    g.add_argument("--kualitas", type=int, help="CRF 18-26, makin kecil makin jernih (bawaan 21)")

    a = p.add_argument_group("Anti duplikat")
    a.add_argument("--preset", default="", choices=konfigurasi.NAMA_PRESET + [""],
                   help="aman / seimbang / kuat (bawaan: seimbang)")
    a.add_argument("--cermin", action="store_true", help="paksa balik gambar kiri-kanan")
    a.add_argument("--tanpa-cermin", action="store_true", help="paksa jangan balik gambar")
    a.add_argument("--potong-tepi", type=float, help="porsi tepi yang dibuang, mis. 0.04")
    a.add_argument("--varian", type=int, default=1, help="buat berapa versi berbeda per video")
    a.add_argument("--seed", type=int, help="angka acak tetap (hasil bisa diulang persis)")

    l = p.add_argument_group("Lain-lain")
    l.add_argument("--tanpa-skor", action="store_true", help="lewati pengecekan skor anti duplikat")
    l.add_argument("--laporan", action="store_true", help="simpan laporan .txt di sebelah hasil")
    l.add_argument("--config", default=None, help="pakai berkas config lain")
    l.add_argument("--info", action="store_true", help="tampilkan preset, font, dan status fitur")
    l.add_argument("--cek", action="store_true", help="periksa ffmpeg, font, dan uji render singkat")
    l.add_argument("--daftar-font", action="store_true", help="tampilkan daftar font")
    l.add_argument("--versi", action="version", version=f"vidclean {__version__}")
    return p


def main(argv: List[str] | None = None) -> int:
    p = buat_parser()
    a = p.parse_args(argv)

    if a.info:
        _tampilkan_info()
        return 0
    if a.cek:
        return _cek_sistem()
    if a.daftar_font:
        for f in modul_font.daftar():
            print(f"{f.keluarga}  ({f.gaya})")
        return 0

    try:
        pengaturan = konfigurasi.muat(a.config)
    except ValueError as e:
        print(f"{MERAH}{e}{RESET}")
        return 2
    pengaturan = _terapkan_opsi(pengaturan, a)
    preset = a.preset or pengaturan["anti_duplikat"].get("preset", "seimbang")

    try:
        daftar_produk = _kumpulkan_produk(a)
    except (ValueError, FileNotFoundError) as e:
        print(f"{MERAH}{e}{RESET}")
        return 2

    daftar_video = _kumpulkan(a.video, a.semua)
    if not daftar_video:
        print(f"{KUNING}Tidak ada video untuk diproses.{RESET}")
        print(f"Taruh video di folder {ABU}{FOLDER_MASUK}{RESET} lalu jalankan: "
              f"{TEBAL}python3 edit.py --semua{RESET}")
        return 1

    if not a.keluar.lower().endswith(EKSTENSI_VIDEO):
        os.makedirs(a.keluar, exist_ok=True)

    varian_total = max(1, a.varian)
    print(f"{TEBAL}{len(daftar_video)} video{RESET} x {varian_total} varian "
          f"| preset {TEBAL}{preset}{RESET} | font {TEBAL}{pengaturan['gaya'].get('font')}{RESET}")

    gagal = 0
    for nomor, berkas in enumerate(daftar_video, start=1):
        _cetak_judul(f"[{nomor}/{len(daftar_video)}] {os.path.basename(berkas)}")

        subtitle: List = []
        if a.auto_teks:
            if not modul_caption.tersedia():
                print(f"{KUNING}  Subtitle otomatis dilewati: jalankan 'pip install faster-whisper'.{RESET}")
            else:
                try:
                    print(f"{ABU}  Mendengarkan suara video untuk subtitle...{RESET}")
                    subtitle = modul_caption.transkrip(berkas, bahasa=a.bahasa, model=a.model)
                    print(f"  {HIJAU}{len(subtitle)} baris subtitle dibuat.{RESET}")
                except Exception as e:
                    print(f"{KUNING}  Subtitle otomatis gagal: {e}{RESET}")

        for varian in range(varian_total):
            tujuan = _nama_keluaran(berkas, a.keluar, varian, varian_total)
            permintaan = Permintaan(
                masukan=berkas, keluaran=tujuan,
                judul=a.judul, caption=a.caption, handle=a.handle,
                subtitle=subtitle, preset=preset, produk=daftar_produk,
                seed=a.seed, varian=varian, pengaturan=pengaturan,
            )
            try:
                lebar_bar = 28

                def kabar(persen: int) -> None:
                    isi = int(persen / 100 * lebar_bar)
                    print(f"\r  [{'#' * isi}{'.' * (lebar_bar - isi)}] {persen:3d}%", end="", flush=True)

                hasil = proses(permintaan, kabar=kabar)
                print("\r" + " " * (lebar_bar + 12) + "\r", end="")

                print(f"  {HIJAU}Selesai{RESET} -> {TEBAL}{hasil.keluaran}{RESET}")
                print(f"  {ABU}asal : {hasil.asal.ringkas()}{RESET}")
                print(f"  {ABU}hasil: {hasil.hasil.ringkas()}{RESET}")
                print(f"  {ABU}font : {hasil.font_dipakai} | waktu proses {hasil.lama_proses} detik{RESET}")

                skor = None
                if not a.tanpa_skor:
                    skor = bandingkan(hasil.asal, hasil.hasil, hasil.rencana)
                    warna = HIJAU if skor.skor >= 60 else (KUNING if skor.skor >= 40 else MERAH)
                    print(f"  Skor anti duplikat: {warna}{TEBAL}{skor.skor}/100{RESET} - {skor.penilaian}")

                print(f"  {ABU}Perubahan yang diterapkan:{RESET}")
                for baris in hasil.rencana.ringkasan():
                    print(f"    {ABU}- {baris}{RESET}")

                if a.laporan:
                    _tulis_laporan(hasil, skor)

            except (FFmpegGagal, FFmpegTidakDitemukan) as e:
                gagal += 1
                print(f"\n  {MERAH}Gagal memproses video ini.{RESET}\n  {e}")
            except Exception as e:  # noqa: BLE001
                gagal += 1
                print(f"\n  {MERAH}Gagal: {type(e).__name__}: {e}{RESET}")
                if os.environ.get("VIDCLEAN_DEBUG"):
                    traceback.print_exc()

    print()
    if gagal:
        print(f"{KUNING}Selesai dengan {gagal} kegagalan.{RESET}")
        return 1
    print(f"{HIJAU}{TEBAL}Semua video selesai diproses.{RESET} Hasil ada di folder: {a.keluar}")
    return 0


def _tulis_laporan(hasil, skor) -> None:
    tujuan = os.path.splitext(hasil.keluaran)[0] + "_laporan.txt"
    baris = [
        "LAPORAN EDIT VIDEO ANTI DUPLIKAT",
        "=" * 40,
        f"Berkas asal   : {hasil.asal.berkas}",
        f"Berkas hasil  : {hasil.keluaran}",
        f"Video asal    : {hasil.asal.ringkas()}",
        f"Video hasil   : {hasil.hasil.ringkas()}",
        f"Font dipakai  : {hasil.font_dipakai}",
        f"Preset        : {hasil.rencana.preset}",
        f"Kode acak     : {hasil.rencana.seed} (varian {hasil.rencana.varian + 1})",
        f"Lama proses   : {hasil.lama_proses} detik",
        "",
        "PERUBAHAN YANG DITERAPKAN",
        "-" * 40,
    ]
    baris += [f"- {b}" for b in hasil.rencana.ringkasan()]
    if skor is not None:
        baris += ["", "SKOR ANTI DUPLIKAT", "-" * 40,
                  f"{skor.skor}/100 - {skor.penilaian}"]
        baris += [f"- {r}" for r in skor.rincian]
    baris += ["", "ANGKA TEKNIS (JSON)", "-" * 40,
              json.dumps(hasil.rencana.as_dict(), indent=2, ensure_ascii=False)]
    with open(tujuan, "w", encoding="utf-8") as f:
        f.write("\n".join(baris) + "\n")
