"""Pembuatan gambar storyboard.

Dua jalur pembuatan gambar:

  1. Adegan cerita biasa  -> google/nano-banana (teks ke gambar)
  2. Adegan yang memuat produk -> google/nano-banana-edit dengan foto produk
     asli sebagai acuan, sehingga bentuk dan warna barang tetap sama persis
     seperti milik pengguna.

Semua gambar memakai kalimat gaya yang sama supaya satu video terlihat
digambar oleh satu tangan.
"""
from __future__ import annotations

import mimetypes
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path

import requests

from . import config
from .kie import KieClient, KieError

UPLOAD_HOST = "https://kieai.redpandaai.co"
UPLOAD_STREAM = f"{UPLOAD_HOST}/api/file-stream-upload"


@dataclass
class HasilGambar:
    nomor: int
    berkas: Path
    kredit: float
    prompt: str
    pakai_acuan: bool = False


def unggah_gambar(api_key: str, berkas: Path, *, attempts: int = 3) -> str:
    """Unggah berkas lokal ke penyimpanan Kie dan kembalikan URL publiknya.

    Model image-to-image hanya menerima URL, jadi foto produk harus diunggah
    lebih dulu. Berkas di Kie otomatis terhapus setelah tiga hari.
    """
    if not berkas.exists():
        raise KieError(f"Berkas tidak ditemukan: {berkas}")
    tipe = mimetypes.guess_type(berkas.name)[0] or "image/jpeg"
    galat: Exception | None = None
    for i in range(attempts):
        try:
            with open(berkas, "rb") as fh:
                resp = requests.post(
                    UPLOAD_STREAM,
                    headers={"Authorization": f"Bearer {api_key}"},
                    files={"file": (berkas.name, fh, tipe)},
                    data={"uploadPath": "images/produk", "fileName": berkas.name},
                    timeout=180,
                )
            data = resp.json()
            if data.get("code") == 200 and data.get("data", {}).get("downloadUrl"):
                return data["data"]["downloadUrl"]
            galat = KieError(f"Unggah ditolak: {data.get('msg', 'tanpa keterangan')}")
        except (requests.RequestException, ValueError) as exc:
            galat = exc
        if i < attempts - 1:
            import time

            time.sleep(2**i)
    raise KieError(f"Gagal mengunggah foto produk: {galat}")


# Tanpa instruksi tegas, model image-to-image cenderung menyunting foto
# aslinya, bukan menggambar ulangnya dengan gaya video. Kalimat ini yang
# memaksa foto produk diterjemahkan menjadi ilustrasi vektor datar sambil
# mempertahankan bentuk, warna, dan proporsi barang yang sebenarnya.
INSTRUKSI_ACUAN = (
    "THE PRODUCT IN THE REFERENCE PHOTO IS THE HERO OF THIS SHOT. "
    "Redraw that exact product as a flat 2D vector illustration and make it the "
    "unmistakable focal point: large, centred, occupying roughly the middle third "
    "of the frame, fully visible and never cropped. "
    "Keep its silhouette, proportions, colour and distinctive details faithful to "
    "the reference, but render it with clean flat fills and simple geometric shapes "
    "— drop the photographic texture, lighting and shadows. "
    "Do not copy any text, label, or lettering from the packaging; leave those "
    "surfaces blank. "
    "Everything described below is background context that must stay secondary to "
    "the product and must not replace it with a different object. "
    "Scene context: "
)


def _payload_gambar(
    prompt: str,
    model_kode: str,
    acuan: str | None,
    deskripsi_produk: str = "",
) -> tuple[str, dict]:
    info = config.IMAGE_MODELS[model_kode]
    model_id = info["id"]
    payload: dict = {"prompt": prompt, "output_format": "png", "image_size": "9:16"}
    if acuan:
        # Varian "-edit" adalah yang menerima gambar acuan.
        if model_id in ("google/nano-banana", "google/nanobanana2"):
            model_id = "google/nano-banana-edit"
        # Keterangan produk dari pengguna ikut disertakan sebagai penjangkar
        # warna. Tanpa ini model pernah menggambar matcha berwarna cokelat.
        tambahan = (
            f" The product is: {deskripsi_produk.strip()} "
            "Any food or drink derived from this product must match its real colour."
            if deskripsi_produk.strip()
            else ""
        )
        payload["prompt"] = INSTRUKSI_ACUAN + prompt + tambahan
        payload["image_urls"] = [acuan]
    return model_id, payload


def buat_gambar_adegan(
    klien: KieClient,
    nomor: int,
    prompt: str,
    keluar: Path,
    *,
    model_kode: str = config.DEFAULT_IMAGE_MODEL,
    acuan_url: str | None = None,
    deskripsi_produk: str = "",
) -> HasilGambar:
    model_id, payload = _payload_gambar(
        prompt, model_kode, acuan_url, deskripsi_produk
    )
    hasil = klien.run_task(model_id, payload, max_wait=420)
    klien.download(hasil.first_url, keluar)
    return HasilGambar(nomor, keluar, hasil.credits, prompt, bool(acuan_url))


def buat_semua_gambar(
    klien: KieClient,
    adegan: list,
    folder: Path,
    *,
    model_kode: str = config.DEFAULT_IMAGE_MODEL,
    acuan_url: str | None = None,
    adegan_produk: set[int] | None = None,
    deskripsi_produk: str = "",
    paralel: int = 3,
    catat: callable | None = None,
) -> list[HasilGambar]:
    """Buat semua gambar storyboard, beberapa sekaligus supaya tidak lama.

    Kie membatasi 20 permintaan baru per 10 detik, jadi tiga sekaligus aman.
    """
    folder.mkdir(parents=True, exist_ok=True)
    adegan_produk = adegan_produk or set()
    hasil: dict[int, HasilGambar] = {}
    gagal: list[str] = []

    def kerjakan(a) -> HasilGambar:
        acuan = acuan_url if a.nomor in adegan_produk else None
        keluar = folder / f"adegan_{a.nomor:02d}.png"
        return buat_gambar_adegan(
            klien, a.nomor, a.prompt_gambar, keluar,
            model_kode=model_kode, acuan_url=acuan,
            deskripsi_produk=deskripsi_produk if acuan else "",
        )

    with ThreadPoolExecutor(max_workers=max(1, paralel)) as pool:
        tugas = {pool.submit(kerjakan, a): a for a in adegan}
        for fut in as_completed(tugas):
            a = tugas[fut]
            try:
                g = fut.result()
                hasil[a.nomor] = g
                if catat:
                    catat(f"✅ Gambar adegan {a.nomor} selesai ({g.kredit:.0f} kredit).")
            except (KieError, OSError) as exc:
                gagal.append(f"Adegan {a.nomor}: {exc}")
                if catat:
                    catat(f"❌ Gambar adegan {a.nomor} gagal: {exc}")

    if gagal:
        raise KieError(
            "Sebagian gambar gagal dibuat:\n" + "\n".join(f"• {g}" for g in gagal)
        )
    return [hasil[n] for n in sorted(hasil)]


def perkiraan_biaya_gambar(jumlah: int, model_kode: str) -> float:
    return jumlah * config.IMAGE_MODELS[model_kode]["credits"]
