"""Caption, tagar, dan berkas pendamping untuk mengunggah video.

Dibuat otomatis setelah video jadi supaya pekerjaan benar-benar selesai
dari hulu ke hilir: video, takarir terpisah, caption per platform, tagar,
dan daftar periksa sebelum unggah.

Catatan penting soal pelabelan konten AI:
aplikasi ini SENGAJA tidak menghapus metadata asal-usul dari berkas hasil
model. Menghapusnya melanggar ketentuan penyedia model dan aturan pelabelan
konten sintetis yang kini berlaku di banyak wilayah. Yang dilakukan aplikasi
adalah membuat videonya bagus, bukan menyembunyikan asalnya.
"""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from pathlib import Path

from .categories import KATEGORI
from .kie import KieClient


@dataclass
class PaketCaption:
    tiktok: str = ""
    instagram: str = ""
    youtube_judul: str = ""
    youtube_deskripsi: str = ""
    tagar: list[str] = field(default_factory=list)
    komentar_pertama: str = ""
    teks_penutup: str = ""

    def dict(self) -> dict:
        return asdict(self)

    @classmethod
    def dari_dict(cls, d: dict) -> "PaketCaption":
        known = {f for f in cls.__dataclass_fields__}
        return cls(**{k: v for k, v in (d or {}).items() if k in known})


_SISTEM = """Kamu ahli caption media sosial Bahasa Indonesia untuk video pendek.

Caption yang kamu tulis:
- Mengulang rasa penasaran dari videonya, bukan meringkas isinya. Jangan bocorkan
  jawaban yang baru terungkap di akhir video.
- Terasa ditulis manusia. Boleh santai, boleh satu kalimat pendek berdiri sendiri.
- Tidak memakai gaya iklan yang kaku dan tidak berteriak dengan huruf kapital.
- Tidak memakai tanda hubung panjang.
- Emoji seperlunya saja, maksimal dua, dan hanya bila benar-benar menambah.
"""


def _prompt(
    judul: str,
    produk: str,
    kode_kategori: str,
    narasi: str,
    hook: str,
) -> str:
    kat = KATEGORI.get(kode_kategori)
    return f"""Buat paket caption untuk video pendek berikut.

JUDUL: {judul}
PRODUK YANG DIPROMOSIKAN HALUS: {produk}
KATEGORI: {kat.nama if kat else kode_kategori}
KALIMAT PEMBUKA VIDEO: {hook}

ISI NARASI LENGKAP:
{narasi[:2500]}

Hasilkan JSON dengan kunci berikut:

- "tiktok": caption TikTok. Maksimal dua kalimat pendek, lalu baris baru berisi
  tagar. Awali dengan kalimat yang memancing komentar.
- "instagram": caption Reels. Boleh sedikit lebih panjang, tiga sampai empat baris,
  dengan jeda baris supaya enak dibaca. Tagar diletakkan di baris paling bawah.
- "youtube_judul": judul Shorts, maksimal enam puluh karakter, tanpa tanda seru berlebihan.
- "youtube_deskripsi": dua sampai tiga kalimat untuk kolom deskripsi.
- "tagar": array berisi dua belas sampai delapan belas tagar Bahasa Indonesia yang
  relevan. Campurkan tagar besar dan tagar khusus niche. Tulis tanpa tanda pagar.
- "komentar_pertama": satu kalimat yang akan dipasang sebagai komentar pertama oleh
  pemilik akun untuk memancing percakapan. Bentuknya pertanyaan.
- "teks_penutup": satu kalimat ajakan lembut yang menyebut {produk} secara wajar.
  Ini dipakai di caption, bukan di dalam video. Hindari kata "beli sekarang".
"""


def buat_caption(
    klien: KieClient,
    *,
    judul: str,
    produk: str,
    kode_kategori: str,
    narasi: str,
    hook: str,
    model: str | None = None,
) -> PaketCaption:
    data = klien.chat_json(
        _prompt(judul, produk, kode_kategori, narasi, hook),
        system=_SISTEM,
        model=model,
        max_tokens=4000,
    )
    if not isinstance(data, dict):
        raise ValueError("Balasan caption bukan objek JSON.")

    tagar = data.get("tagar") or []
    if isinstance(tagar, str):
        tagar = [t.strip() for t in tagar.replace("#", " ").split() if t.strip()]
    tagar = [str(t).lstrip("#").strip() for t in tagar if str(t).strip()]

    return PaketCaption(
        tiktok=str(data.get("tiktok", "")).strip(),
        instagram=str(data.get("instagram", "")).strip(),
        youtube_judul=str(data.get("youtube_judul", ""))[:100].strip(),
        youtube_deskripsi=str(data.get("youtube_deskripsi", "")).strip(),
        tagar=tagar[:18],
        komentar_pertama=str(data.get("komentar_pertama", "")).strip(),
        teks_penutup=str(data.get("teks_penutup", "")).strip(),
    )


DAFTAR_PERIKSA = """DAFTAR PERIKSA SEBELUM UNGGAH

Teknis
  [ ] Tonton sekali penuh tanpa jeda. Perhatikan detik 0-3.
  [ ] Dengarkan dengan earphone. Pastikan tidak ada kata yang keseleo.
  [ ] Cek takarir tidak tertutup tombol antarmuka aplikasi.
      TikTok menutupi sekitar 15% bagian bawah dan 10% sisi kanan.
  [ ] Pastikan suara tidak pecah di bagian paling keras.

Isi
  [ ] Tiga detik pertama sudah memancing rasa penasaran.
  [ ] Tidak ada klaim yang tidak bisa dibuktikan.
  [ ] Produk hanya muncul di bagian akhir dan terasa wajar.

Pelabelan konten AI
  [ ] Nyalakan penanda "konten buatan AI" di aplikasi tempat kamu mengunggah.
      TikTok, Instagram, dan YouTube semuanya menyediakan sakelar ini.
      Memakainya adalah cara yang benar dan tidak menurunkan jangkauan;
      yang menurunkan jangkauan adalah kalau platform mendeteksinya sendiri
      setelah kamu tidak mendeklarasikannya.

Setelah unggah
  [ ] Pasang komentar pertama dari berkas caption.
  [ ] Balas komentar di satu jam pertama.
  [ ] Catat berapa persen penonton bertahan sampai akhir sebagai bahan video berikutnya.
"""


def tulis_berkas_pendamping(
    folder: Path,
    caption: PaketCaption,
    *,
    judul: str,
    produk: str,
    narasi: str,
) -> dict[str, Path]:
    """Simpan caption dan daftar periksa sebagai berkas siap salin-tempel."""
    folder.mkdir(parents=True, exist_ok=True)
    tagar_baris = " ".join(f"#{t}" for t in caption.tagar)

    isi_caption = f"""{judul}

════════════════════════════════════
TIKTOK
════════════════════════════════════
{caption.tiktok}

{tagar_baris}

════════════════════════════════════
INSTAGRAM REELS
════════════════════════════════════
{caption.instagram}

{tagar_baris}

════════════════════════════════════
YOUTUBE SHORTS
════════════════════════════════════
Judul: {caption.youtube_judul}

{caption.youtube_deskripsi}

{tagar_baris}

════════════════════════════════════
KOMENTAR PERTAMA (pasang sendiri setelah unggah)
════════════════════════════════════
{caption.komentar_pertama}

════════════════════════════════════
KALIMAT PENUTUP TENTANG PRODUK
════════════════════════════════════
{caption.teks_penutup}
"""

    berkas = {
        "caption": folder / "caption.txt",
        "checklist": folder / "daftar_periksa.txt",
        "naskah": folder / "naskah.txt",
        "json": folder / "caption.json",
    }
    berkas["caption"].write_text(isi_caption, encoding="utf-8")
    berkas["checklist"].write_text(DAFTAR_PERIKSA, encoding="utf-8")
    berkas["naskah"].write_text(
        f"{judul}\nProduk: {produk}\n\n{narasi}\n", encoding="utf-8"
    )
    berkas["json"].write_text(
        json.dumps(caption.dict(), indent=2, ensure_ascii=False), encoding="utf-8"
    )
    return berkas
