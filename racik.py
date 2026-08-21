#!/usr/bin/env python3
"""Racik beberapa video menjadi SATU editan baru, lalu proses anti duplikat.

Beda dengan edit.py (yang mengolah satu video apa adanya), racik.py memecah
semua video sumber menjadi shot, menyusun urutan adegan yang belum pernah
ada, menjahitnya, lalu melewatkan hasilnya ke mesin anti duplikat v2.

Contoh:
    python3 racik.py video1.mp4 video2.mp4 video3.mp4 --judul "Tas viral itu"
    python3 racik.py folder_video/ --durasi 25 --handle "@akunku"
"""

import argparse
import os
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from vidclean import config as konfigurasi                     # noqa: E402
from vidclean import racik as modul_racik                      # noqa: E402
from vidclean.cli import EKSTENSI_VIDEO, FOLDER_KELUAR         # noqa: E402
from vidclean.pipeline import Permintaan, proses_hingga_target # noqa: E402


def main() -> int:
    p = argparse.ArgumentParser(
        description="Jahit ulang beberapa video jadi satu editan baru + anti duplikat.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("sumber", nargs="+", help="dua video atau lebih, atau satu folder")
    p.add_argument("-o", "--keluar", default="", help="nama berkas hasil")
    p.add_argument("--durasi", type=float, default=21.0, help="target durasi hasil (detik)")
    p.add_argument("--judul", default="", help="teks hook di bagian atas")
    p.add_argument("--caption", default="", help="teks di bagian bawah")
    p.add_argument("--handle", default="", help="nama akun kecil, mis. @akunku")
    p.add_argument("--preset", default="maksimal", choices=konfigurasi.NAMA_PRESET)
    p.add_argument("--potong-atas", type=float, default=0.0,
                   help="buang bagian atas layar (hapus watermark), mis. 0.08")
    p.add_argument("--look", default="hangat",
                   choices=["", "bersih", "hangat", "sinematik"],
                   help="grading warna seragam (bawaan: hangat)")
    p.add_argument("--tanpa-hapus-teks", action="store_true",
                   help="jangan periksa/hapus teks tertanam di footage")
    p.add_argument("--tanpa-transisi", action="store_true", help="semua sambungan potongan tegas")
    p.add_argument("--tanpa-gerak", action="store_true", help="tanpa gerakan Ken Burns per shot")
    p.add_argument("--seed", type=int, default=None, help="angka acak tetap")
    p.add_argument("--varian", type=int, default=1, help="buat berapa racikan berbeda")
    p.add_argument("--target-skor", type=float, default=None)
    a = p.parse_args()

    # Kumpulkan sumber
    berkas: list[str] = []
    for j in a.sumber:
        if os.path.isdir(j):
            berkas += [os.path.join(j, n) for n in sorted(os.listdir(j))
                       if n.lower().endswith(EKSTENSI_VIDEO)]
        elif os.path.isfile(j):
            berkas.append(j)
        else:
            print(f"Dilewati (tidak ada): {j}")
    if not berkas:
        print("Tidak ada video sumber.")
        return 1
    if len(berkas) == 1:
        print("Catatan: hanya satu sumber - racikan tetap dibuat dari urutan shot")
        print("yang diacak, tapi hasil terbaik didapat dari 2 sumber atau lebih.\n")

    pengaturan = konfigurasi.muat()
    if a.potong_atas:
        pengaturan["video"]["potong_atas"] = a.potong_atas
    if a.look:
        pengaturan["gaya"]["look"] = a.look

    os.makedirs(FOLDER_KELUAR, exist_ok=True)
    gagal = 0

    for varian in range(max(1, a.varian)):
        akhiran = f"_v{varian + 1}" if a.varian > 1 else ""
        if a.keluar:
            akar, ekst = os.path.splitext(a.keluar)
            tujuan = f"{akar}{akhiran}{ekst or '.mp4'}"
        else:
            tujuan = os.path.join(FOLDER_KELUAR, f"racikan{akhiran}.mp4")

        print(f"=== Racikan {varian + 1}/{a.varian} -> {tujuan} ===")
        kerja = tempfile.mkdtemp(prefix="vidclean_racik_")
        master = os.path.join(kerja, "master.mp4")
        try:
            seed = (a.seed + varian * 7919) if a.seed is not None else None
            if seed is None and varian > 0:
                seed = sum(os.path.getsize(b) for b in berkas) % (10 ** 9) + varian * 7919
            modul_racik.racik(
                berkas, master, target_durasi=a.durasi, seed=seed,
                hapus_teks=not a.tanpa_hapus_teks,
                transisi=not a.tanpa_transisi,
                gerak=not a.tanpa_gerak,
                kabar=lambda pesan: print(f"  ... {pesan}"),
            )

            print("  ... memproses anti duplikat")
            hasil, skor, catatan = proses_hingga_target(
                Permintaan(
                    masukan=master, keluaran=tujuan,
                    judul=a.judul, caption=a.caption, handle=a.handle,
                    preset=a.preset, pengaturan=pengaturan,
                ),
                target=a.target_skor,
            )
            for c in catatan:
                print(f"  {c}")
            print(f"  Selesai -> {hasil.keluaran}")
            print(f"  hasil: {hasil.hasil.ringkas()}")
            if skor:
                print(f"  Catatan skor: {skor.skor}/100 dihitung terhadap video master racikan,")
                print(f"  bukan terhadap sumber-sumber aslinya - urutan adegannya sendiri sudah baru.")
        except Exception as e:  # noqa: BLE001
            gagal += 1
            print(f"  GAGAL: {type(e).__name__}: {e}")
        finally:
            import shutil
            shutil.rmtree(kerja, ignore_errors=True)
        print()

    return 1 if gagal else 0


if __name__ == "__main__":
    raise SystemExit(main())
