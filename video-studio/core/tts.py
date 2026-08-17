"""Pembuatan suara narator Bahasa Indonesia.

Hasil pengujian langsung ke Kie pada saat aplikasi ini dibuat:

  google/gemini-3-1-flash-tts              BERFUNGSI  (dipakai sebagai utama)
  elevenlabs/text-to-speech-multilingual-v2  GAGAL     (galat internal server)
  elevenlabs/text-to-speech-turbo-2-5        GAGAL     (galat internal server)
  elevenlabs/text-to-dialogue-v3             GAGAL     (galat internal server)

Karena itu urutan penyedia dibuat berlapis. Bila satu penyedia gagal,
aplikasi otomatis pindah ke penyedia berikutnya tanpa menghentikan produksi.
ElevenLabs tetap disediakan supaya bisa langsung dipakai bila Kie memperbaikinya.

Suara dibuat PER ADEGAN, bukan sekali untuk seluruh naskah. Alasannya:
durasi tiap adegan jadi diketahui persis, sehingga gambar dan takarir bisa
disinkronkan tanpa menebak.
"""
from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

import requests

from . import config
from .kie import KieClient, KieError


@dataclass
class HasilSuara:
    berkas: Path
    durasi: float
    penyedia: str
    kredit: float = 0.0
    # Diisi oleh gerbang mutu setelah suara jadi.
    wpm: float = 0.0
    jeda_per_kata: float = 0.0
    mengalir: bool = True
    # Diisi oleh verifikasi ucapan bila faster-whisper terpasang.
    sesuai_naskah: bool = True
    terucap: str = ""


class TTSGagal(RuntimeError):
    pass


# ---------------------------------------------------------------------------
# Utilitas audio
# ---------------------------------------------------------------------------
def durasi_audio(berkas: Path) -> float:
    hasil = subprocess.run(
        [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=nw=1:nk=1", str(berkas),
        ],
        capture_output=True, text=True, check=False,
    )
    try:
        return float(hasil.stdout.strip())
    except ValueError:
        return 0.0


# Video acuan berjalan pada 167 kata/menit tanpa satu pun jeda di tengah
# kalimat. Angka di bawah ini adalah batas kewajaran untuk narasi Indonesia.
JEDA_PER_KATA_WAJAR = 0.25
WPM_MINIMAL_WAJAR = 110


def ukur_keterputusan(berkas: Path, jumlah_kata: int) -> dict[str, float]:
    """Ukur seberapa patah-patah sebuah rekaman narasi.

    Rasio keterputusan adalah banyaknya jeda di tengah kalimat dibagi jumlah
    kata. Narasi yang mengalir bernilai mendekati nol; nilai di atas satu
    berarti penutur berhenti setelah hampir setiap kata.

    Metrik ini dipakai sebagai gerbang mutu supaya kesalahan pemilihan gaya
    suara ketahuan sebelum seluruh naskah dibuatkan suaranya.
    """
    durasi = durasi_audio(berkas)
    if durasi <= 0 or jumlah_kata <= 0:
        return {"durasi": durasi, "wpm": 0.0, "jeda": 0, "jeda_per_kata": 0.0}

    hasil = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(berkas),
         "-af", "silencedetect=noise=-38dB:d=0.06", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    mulai = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", hasil.stderr)]
    akhir = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", hasil.stderr)]
    # Keheningan di ujung rekaman tidak dihitung; yang mengganggu telinga
    # adalah jeda di tengah kalimat.
    tengah = [b - a for a, b in zip(mulai, akhir) if a > 0.05 and b < durasi - 0.05]

    return {
        "durasi": durasi,
        "wpm": jumlah_kata / durasi * 60.0,
        "jeda": len(tengah),
        "jeda_per_kata": len(tengah) / jumlah_kata,
        "total_jeda": sum(tengah),
    }


def periksa_narasi(berkas: Path, jumlah_kata: int) -> tuple[bool, str, dict]:
    """Kembalikan (lolos, pesan, ukuran) untuk satu potongan narasi."""
    u = ukur_keterputusan(berkas, jumlah_kata)
    if u["jeda_per_kata"] > JEDA_PER_KATA_WAJAR:
        return False, (
            f"Narasi terdengar patah-patah: {u['jeda']} jeda untuk {jumlah_kata} kata "
            f"({u['jeda_per_kata']:.2f} per kata, wajarnya di bawah {JEDA_PER_KATA_WAJAR}). "
            "Ganti suara atau turunkan kecepatan di halaman Pengaturan."
        ), u
    if 0 < u["wpm"] < WPM_MINIMAL_WAJAR:
        return False, (
            f"Narasi terlalu lambat: {u['wpm']:.0f} kata per menit "
            f"(wajarnya di atas {WPM_MINIMAL_WAJAR})."
        ), u
    return True, f"{u['wpm']:.0f} kata/menit, {u['jeda_per_kata']:.2f} jeda per kata", u


def _rantai_tempo(kecepatan: float) -> list[str]:
    """atempo hanya menerima 0,5 sampai 2,0 — pecah bila di luar rentang."""
    if abs(kecepatan - 1.0) <= 0.01:
        return []
    bagian: list[str] = []
    sisa = kecepatan
    while sisa > 2.0:
        bagian.append("atempo=2.0")
        sisa /= 2.0
    while sisa < 0.5:
        bagian.append("atempo=0.5")
        sisa /= 0.5
    bagian.append(f"atempo={sisa:.4f}")
    return bagian


def _ke_wav(masuk: Path, keluar: Path, *, kecepatan: float = 1.0) -> Path:
    """Seragamkan format audio dan atur kecepatan tanpa mengubah nada suara."""
    filters = ["aresample=48000", "aformat=channel_layouts=mono"] + _rantai_tempo(kecepatan)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(masuk),
         "-af", ",".join(filters), "-ar", "48000", "-ac", "1", str(keluar)],
        check=True, capture_output=True,
    )
    return keluar


# Jeda paling panjang yang boleh tersisa di tengah kalimat, dalam detik.
# 0,12 detik cukup untuk terdengar wajar tanpa membuat video molor.
MAKS_JEDA = 0.12
# Batas penyesuaian tempo. Di luar rentang ini suara mulai terdengar aneh.
MAKS_TEMPO = 1.35
MIN_TEMPO = 0.80


def rapikan_ucapan(
    masuk: Path,
    keluar: Path,
    *,
    target_durasi: float | None = None,
    maks_jeda: float = MAKS_JEDA,
) -> float:
    """Padatkan jeda dan samakan tempo ke durasi yang diinginkan.

    Mesin TTS Gemini menyisipkan jeda dramatis yang sangat panjang di antara
    frasa — pada pengukuran, hampir separuh berkas berisi keheningan. Kalau
    dibiarkan, video 40 detik akan molor menjadi 90 detik.

    Fungsi ini melakukan dua hal:
      1. Memangkas keheningan di awal dan akhir, lalu memotong setiap jeda
         di tengah supaya tidak lebih panjang dari maks_jeda. Jeda pendek
         tetap dipertahankan agar ucapan tidak terdengar seperti robot.
      2. Menyesuaikan tempo agar durasi akhir mendekati target.

    Mengembalikan durasi akhir dalam detik.
    """
    keluar.parent.mkdir(parents=True, exist_ok=True)
    antara = keluar.with_suffix(".padat.wav")

    hapus_hening = (
        "silenceremove="
        "start_periods=1:start_silence=0.04:start_threshold=-45dB:"
        f"stop_periods=-1:stop_duration={maks_jeda}:stop_silence={maks_jeda}:"
        "stop_threshold=-45dB:detection=peak"
    )
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(masuk),
         "-af", f"aresample=48000,aformat=channel_layouts=mono,{hapus_hening}",
         "-ar", "48000", "-ac", "1", str(antara)],
        check=True, capture_output=True,
    )

    durasi = durasi_audio(antara)
    tempo = 1.0
    if target_durasi and durasi > 0.5:
        tempo = max(MIN_TEMPO, min(MAKS_TEMPO, durasi / target_durasi))

    filters = ["aresample=48000"] + _rantai_tempo(tempo)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(antara),
         "-af", ",".join(filters), "-ar", "48000", "-ac", "1", str(keluar)],
        check=True, capture_output=True,
    )
    antara.unlink(missing_ok=True)
    return durasi_audio(keluar)


# ---------------------------------------------------------------------------
# Penyedia 1 — Gemini TTS lewat Kie (utama, sudah diuji berhasil)
# ---------------------------------------------------------------------------
# Pemilihan pace TIDAK boleh didasarkan pada kata per menit saja. Yang
# menentukan enak atau tidaknya narasi adalah seberapa MENYAMBUNG ucapannya,
# dan itu diukur dengan rasio keterputusan: berapa jeda per kata.
#
# Pengukuran pada kalimat Bahasa Indonesia yang sama, suara Callirrhoe,
# dibandingkan dengan video acuan (167 kata/menit, 0,00 jeda per kata):
#
#   pace          style          WPM   jeda/kata
#   Staccato      Vocal Smile     86      1,13    <- berhenti di tiap kata
#   Natural       Promo/Hype     140      0,67
#   Natural       Vocal Smile    145      0,47
#   Natural       (tanpa)        152      0,40
#   Rapid Fire    Vocal Smile    156      0,13    <- dipakai sekarang
#   Rapid Fire    (tanpa)        173      0,13
#
# "Staccato" secara harfiah berarti terputus-putus, dan model memang
# menerjemahkannya begitu. Angka kata per menitnya sempat terlihat paling
# dekat dengan target, tetapi hasil dengarnya patah setiap kata. Pace itu
# sekarang tidak pernah dipakai.
#
# Style "Newscaster" juga dihindari: hasilnya 53 kata/menit dengan jeda
# dramatis yang sangat panjang.
#
# Kecepatan halus diatur belakangan lewat penyesuaian tempo, yang sama sekali
# tidak memengaruhi kemenyambungan ucapan.
def _pace_dari_kecepatan(k: float) -> str:
    return "Natural" if k <= 0.90 else "Rapid Fire"


def suara_gemini(
    klien: KieClient,
    teks: str,
    keluar: Path,
    *,
    voice: str = config.DEFAULT_GEMINI_VOICE,
    kecepatan: float = 1.0,
    gaya: str = "",
    konteks: str = "",
    nama_suasana: str | None = None,
) -> HasilSuara:
    # Suasana menyetel watak narator, gaya, dan suhunya sekaligus. Tanpa
    # ini, narator terdengar gembira di atas musik yang muram, dan video
    # terasa janggal walau sulit ditunjuk letaknya.
    from .suasana import suasana as _suasana

    s = _suasana(nama_suasana)
    profil = gaya or s.watak_suara
    payload = {
        # Suhu rendah menekan improvisasi model, termasuk kecenderungan
        # menyelipkan jeda dramatis yang tidak diminta. Cerita muram
        # memakai suhu lebih rendah lagi supaya model tidak menambahkan
        # keceriaan sendiri.
        "temperature": s.suhu,
        "scene": (
            "Narasi video edukasi pendek Bahasa Indonesia. Kalimat diucapkan "
            "mengalir dalam satu tarikan napas, tanpa berhenti di antara kata."
        ),
        "sample_context": konteks
        or (
            "Bacakan seluruh kalimat secara menyambung dan mengalir. "
            "Jangan memberi jeda di antara kata. Jeda hanya boleh di akhir kalimat."
        ),
        "speakers": [
            {
                "speaker_id": "Speaker 1",
                "voice_name": voice,
                "accent": "Neutral",
                "audio_profile": profil,
                # Gaya diambil dari suasana, dan boleh KOSONG.
                #
                # "Vocal Smile" dulu dipatok mati karena temponya rapat,
                # tetapi namanya harfiah: model menyuarakannya sambil
                # tersenyum. Untuk cerita muram itu salah rasa.
                #
                # Tabel pengukuran di atas menunjukkan jalan keluarnya:
                # "Rapid Fire" tanpa style sama sekali menghasilkan jeda
                # per kata yang SAMA (0,13), hanya kata per menitnya lebih
                # tinggi. Jadi melepas senyumnya tidak mengorbankan
                # kemenyambungan sedikit pun; yang perlu dirapikan cuma
                # temponya, dan itu memang sudah dikerjakan belakangan.
                **({"style": s.gaya_suara} if s.gaya_suara else {}),
                "pace": _pace_dari_kecepatan(kecepatan),
            }
        ],
        "dialogue_turns": [{"speaker_id": "Speaker 1", "text": teks}],
    }
    hasil = klien.run_task(config.TTS_PROVIDERS["gemini-kie"]["id"], payload, max_wait=420)
    mentah = keluar.with_suffix(".mentah.wav")
    klien.download(hasil.first_url, mentah)
    # Pace milik model sudah mendekati target; sisa selisih dirapikan di sini.
    _ke_wav(mentah, keluar)
    mentah.unlink(missing_ok=True)
    return HasilSuara(keluar, durasi_audio(keluar), "Gemini TTS (Kie)", hasil.credits)


# ---------------------------------------------------------------------------
# Penyedia 2 — ElevenLabs lewat Kie
# ---------------------------------------------------------------------------
def suara_elevenlabs_kie(
    klien: KieClient,
    teks: str,
    keluar: Path,
    *,
    voice: str = "Laura",
    kecepatan: float = 1.0,
) -> HasilSuara:
    payload = {
        "text": teks,
        "voice": voice,
        "language_code": "id",
        "stability": 0.5,
        "similarity_boost": 0.8,
        "style": 0.15,
        "speed": max(0.7, min(1.2, kecepatan)),
    }
    hasil = klien.run_task(
        config.TTS_PROVIDERS["elevenlabs-kie"]["id"], payload, max_wait=300
    )
    mentah = keluar.with_suffix(".mentah.mp3")
    klien.download(hasil.first_url, mentah)
    _ke_wav(mentah, keluar)
    mentah.unlink(missing_ok=True)
    return HasilSuara(keluar, durasi_audio(keluar), "ElevenLabs (Kie)", hasil.credits)


# ---------------------------------------------------------------------------
# Penyedia 3 — ElevenLabs langsung dengan API key sendiri
# ---------------------------------------------------------------------------
_VOICE_ID_ELEVEN = {
    "Laura": "FGY2WhTYpPnrIDTdsKH5",
    "Sarah": "EXAVITQu4vr4xnSDxMaL",
    "Charlotte": "XB0fDUnXU5powFXDhCwa",
    "Alice": "Xb7hH8MSUJpSbSDYk0k2",
    "Matilda": "XrExE9yKIg1WjnnlVkGX",
    "George": "JBFqnCBsd6RMkjVDRZzb",
    "Liam": "TX3LSARhy5PjZQPfw9iJ",
    "Daniel": "onwK4e9ZLuTAKqWW03F9",
}


def suara_elevenlabs_langsung(
    teks: str,
    keluar: Path,
    *,
    voice: str = "Laura",
    kecepatan: float = 1.0,
    api_key: str = "",
) -> HasilSuara:
    key = api_key or config.elevenlabs_key()
    if not key:
        raise TTSGagal("API key ElevenLabs belum diisi di halaman Pengaturan.")
    voice_id = _VOICE_ID_ELEVEN.get(voice, voice)
    resp = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={"xi-api-key": key, "Content-Type": "application/json"},
        json={
            "text": teks,
            "model_id": "eleven_multilingual_v2",
            "language_code": "id",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.15,
                "speed": max(0.7, min(1.2, kecepatan)),
            },
        },
        timeout=180,
    )
    if resp.status_code != 200:
        raise TTSGagal(f"ElevenLabs menolak permintaan (HTTP {resp.status_code}).")
    mentah = keluar.with_suffix(".mentah.mp3")
    mentah.write_bytes(resp.content)
    _ke_wav(mentah, keluar)
    mentah.unlink(missing_ok=True)
    return HasilSuara(keluar, durasi_audio(keluar), "ElevenLabs (key sendiri)", 0.0)


# ---------------------------------------------------------------------------
# Penyedia 4 — Edge TTS, gratis dan tanpa API key
# ---------------------------------------------------------------------------
def suara_edge(
    teks: str,
    keluar: Path,
    *,
    voice: str = config.DEFAULT_EDGE_VOICE,
    kecepatan: float = 1.0,
) -> HasilSuara:
    try:
        import asyncio

        import edge_tts
    except ImportError:
        raise TTSGagal(
            "Paket edge-tts belum terpasang. Jalankan: pip install edge-tts"
        )

    persen = int(round((kecepatan - 1.0) * 100))
    rate = f"{persen:+d}%"
    mentah = keluar.with_suffix(".mentah.mp3")

    async def _jalan() -> None:
        await edge_tts.Communicate(teks, voice, rate=rate).save(str(mentah))

    try:
        asyncio.run(_jalan())
    except Exception as exc:  # jaringan, sertifikat, suara tidak ada
        raise TTSGagal(f"Edge TTS gagal: {exc}")

    if not mentah.exists() or mentah.stat().st_size == 0:
        raise TTSGagal("Edge TTS tidak menghasilkan berkas suara.")
    _ke_wav(mentah, keluar)
    mentah.unlink(missing_ok=True)
    return HasilSuara(keluar, durasi_audio(keluar), "Edge TTS (gratis)", 0.0)


# ---------------------------------------------------------------------------
# Pemilih penyedia dengan rantai cadangan
# ---------------------------------------------------------------------------
def buat_suara(
    klien: KieClient | None,
    teks: str,
    keluar: Path,
    *,
    urutan: list[str] | None = None,
    voice_gemini: str = config.DEFAULT_GEMINI_VOICE,
    voice_edge: str = config.DEFAULT_EDGE_VOICE,
    voice_eleven: str = "Laura",
    kecepatan: float = 1.0,
    wpm_target: int = 150,
    catat: callable | None = None,
    nama_suasana: str | None = None,
) -> HasilSuara:
    """Coba tiap penyedia berurutan sampai ada yang berhasil.

    Berapa pun penyedia yang dipakai, hasilnya selalu melewati perapian jeda
    dan penyesuaian tempo, sehingga kecepatan bicara di seluruh video konsisten.
    """
    urutan = urutan or list(config.DEFAULT_TTS_CHAIN)
    keluar.parent.mkdir(parents=True, exist_ok=True)
    galat: list[str] = []

    # Durasi yang diinginkan dihitung dari jumlah kata, bukan dari keluaran model.
    jumlah_kata = len(teks.split())
    target = (jumlah_kata / max(wpm_target * kecepatan, 1)) * 60.0 if jumlah_kata else None

    def _rapikan(h: HasilSuara) -> HasilSuara:
        try:
            durasi_baru = rapikan_ucapan(h.berkas, h.berkas, target_durasi=target)
            if catat and h.durasi > 0 and abs(durasi_baru - h.durasi) > 0.4:
                catat(
                    f"   ⏱️ Jeda dirapikan: {h.durasi:.1f} → {durasi_baru:.1f} detik."
                )
            h.durasi = durasi_baru
        except subprocess.CalledProcessError:
            pass  # kalau perapian gagal, pakai audio apa adanya

        # Gerbang mutu: pastikan narasinya mengalir, bukan patah tiap kata.
        lolos, pesan, ukuran = periksa_narasi(h.berkas, jumlah_kata)
        h.wpm = ukuran.get("wpm", 0.0)
        h.jeda_per_kata = ukuran.get("jeda_per_kata", 0.0)
        h.mengalir = lolos
        if catat and not lolos:
            catat(f"   ⚠️ {pesan}")
        return h

    for nama in urutan:
        try:
            if nama == "gemini-kie":
                if not klien:
                    raise TTSGagal("Klien Kie belum siap.")
                return _rapikan(suara_gemini(
                    klien, teks, keluar, voice=voice_gemini, kecepatan=kecepatan,
                    nama_suasana=nama_suasana
                ))
            if nama == "elevenlabs-kie":
                if not klien:
                    raise TTSGagal("Klien Kie belum siap.")
                return _rapikan(suara_elevenlabs_kie(
                    klien, teks, keluar, voice=voice_eleven, kecepatan=kecepatan
                ))
            if nama == "elevenlabs-direct":
                return _rapikan(suara_elevenlabs_langsung(
                    teks, keluar, voice=voice_eleven, kecepatan=kecepatan
                ))
            if nama == "edge":
                return _rapikan(
                    suara_edge(teks, keluar, voice=voice_edge, kecepatan=kecepatan)
                )
        except (TTSGagal, KieError, subprocess.CalledProcessError, requests.RequestException) as exc:
            pesan = f"{config.TTS_PROVIDERS.get(nama, {}).get('label', nama)}: {exc}"
            galat.append(pesan)
            if catat:
                catat(f"⚠️ {pesan} — mencoba penyedia berikutnya.")
            continue

    raise TTSGagal(
        "Semua penyedia suara gagal.\n\n"
        + "\n".join(f"• {g}" for g in galat)
        + "\n\nSaran: pasang edge-tts (gratis) dengan perintah  pip install edge-tts"
    )


def penyedia_tersedia(klien: KieClient | None) -> dict[str, bool]:
    """Cek kasar penyedia mana yang bisa dipakai saat ini."""
    hasil = {
        "gemini-kie": bool(klien and klien.api_key),
        "elevenlabs-kie": bool(klien and klien.api_key),
        "elevenlabs-direct": bool(config.elevenlabs_key()),
        "edge": False,
    }
    try:
        import edge_tts  # noqa: F401

        hasil["edge"] = True
    except ImportError:
        pass
    return hasil
