"""Subtitle otomatis (opsional) memakai Whisper.

Fitur ini butuh paket tambahan:  pip install faster-whisper
Kalau paketnya belum ada, aplikasi tetap berjalan normal - hanya subtitle
otomatis yang dimatikan.
"""

from __future__ import annotations

import os
import subprocess
import tempfile
from typing import List, Optional, Tuple

from .ffmpeg import ffmpeg_bin

Potongan = Tuple[float, float, str]


def tersedia() -> bool:
    try:
        import faster_whisper  # noqa: F401
        return True
    except Exception:
        return False


def _ambil_audio(berkas: str, tujuan: str) -> str:
    subprocess.run(
        [
            ffmpeg_bin(), "-v", "error", "-y",
            "-i", berkas,
            "-vn", "-ac", "1", "-ar", "16000",
            "-c:a", "pcm_s16le", tujuan,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    return tujuan


def _rangkai(kata_kata, maks_kata: int, maks_detik: float) -> List[Potongan]:
    """Gabungkan kata menjadi baris subtitle pendek ala video vertikal."""
    hasil: List[Potongan] = []
    tumpuk: List = []

    def buang():
        if not tumpuk:
            return
        teks = " ".join(k.word.strip() for k in tumpuk).strip()
        if teks:
            hasil.append((float(tumpuk[0].start), float(tumpuk[-1].end), teks))
        tumpuk.clear()

    for kata in kata_kata:
        if not (kata.word or "").strip():
            continue
        tumpuk.append(kata)
        habis_kalimat = kata.word.strip().endswith((".", "!", "?"))
        kepanjangan = float(kata.end) - float(tumpuk[0].start) >= maks_detik
        if len(tumpuk) >= maks_kata or habis_kalimat or kepanjangan:
            buang()
    buang()
    return hasil


def transkrip(
    berkas: str,
    bahasa: Optional[str] = "id",
    model: str = "small",
    maks_kata: int = 4,
    maks_detik: float = 2.4,
) -> List[Potongan]:
    """Hasilkan daftar (mulai, selesai, teks) dalam satuan detik video ASLI."""
    try:
        from faster_whisper import WhisperModel
    except ImportError as e:
        raise RuntimeError(
            "Subtitle otomatis butuh paket 'faster-whisper'.\n"
            "Pasang dengan perintah:  pip install faster-whisper"
        ) from e

    kerja = tempfile.mkdtemp(prefix="vidclean_teks_")
    wav = os.path.join(kerja, "suara.wav")
    try:
        _ambil_audio(berkas, wav)
        mesin = WhisperModel(model, device="cpu", compute_type="int8")
        potongan_whisper, _ = mesin.transcribe(
            wav,
            language=bahasa or None,
            word_timestamps=True,
            vad_filter=True,
            beam_size=5,
        )

        hasil: List[Potongan] = []
        for bagian in potongan_whisper:
            if bagian.words:
                hasil.extend(_rangkai(bagian.words, maks_kata, maks_detik))
            else:
                teks = (bagian.text or "").strip()
                if teks:
                    hasil.append((float(bagian.start), float(bagian.end), teks))
        return hasil
    finally:
        try:
            os.remove(wav)
            os.rmdir(kerja)
        except OSError:
            pass
