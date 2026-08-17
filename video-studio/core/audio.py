"""Efek suara dan penataan audio akhir.

Semua efek suara DIBANGKITKAN secara matematis dengan ffmpeg, bukan diunduh
dari pustaka daring. Tiga alasannya:

  - tidak ada masalah hak cipta sama sekali
  - tidak ada berkas yang perlu diunduh pengguna
  - suaranya konsisten dan bisa diulang persis

Tata suara akhir mengikuti pengukuran video acuan: narasi rata di sekitar
-14 LUFS dengan puncak tidak melebihi -1 dBFS, musik latar ditekan otomatis
saat narator bicara.
"""
from __future__ import annotations

import subprocess
from pathlib import Path

from .config import CACHE_DIR, RENDER

SFX_DIR = CACHE_DIR / "sfx"
SFX_DIR.mkdir(parents=True, exist_ok=True)

# Rumus gelombang untuk tiap efek. Ditulis dalam sintaks ekspresi ffmpeg.
#   t          = waktu berjalan dalam detik
#   random(0)  = derau acak antara 0 dan 1
_RESEP: dict[str, tuple[str, float, str]] = {
    # nama          : (ekspresi, durasi, filter tambahan)
    "pop": (
        "0.55*sin(2*PI*(520+680*exp(-38*t))*t)*exp(-26*t)",
        0.18, "",
    ),
    "klik": (
        "0.5*(random(0)*2-1)*exp(-260*t)",
        0.06, "highpass=f=1200",
    ),
    "tik": (
        "0.4*sin(2*PI*2400*t)*exp(-90*t)",
        0.08, "",
    ),
    "denting": (
        "0.42*(sin(2*PI*1320*t)+0.45*sin(2*PI*2640*t)+0.2*sin(2*PI*3960*t))*exp(-7*t)",
        0.75, "",
    ),
    "swoosh": (
        "0.5*(random(0)*2-1)*exp(-1*((t-0.16)/0.10)*((t-0.16)/0.10))",
        0.42, "lowpass=f=3200,highpass=f=260",
    ),
    "whoosh": (
        "0.5*(random(0)*2-1)*exp(-1*((t-0.20)/0.13)*((t-0.20)/0.13))",
        0.52, "lowpass=f=2600,highpass=f=180",
    ),
    "gedebuk": (
        "0.8*sin(2*PI*(126-46*t)*t)*exp(-12*t)",
        0.38, "lowpass=f=520",
    ),
    "naik": (
        "0.34*sin(2*PI*(180+1500*t/0.9)*t)*(t/0.9)*(t/0.9)",
        0.90, "",
    ),
    "resleting": (
        "0.32*(random(0)*2-1)*(0.45+0.55*sin(2*PI*72*t))*exp(-3.4*t)",
        0.55, "bandpass=f=1800:width_type=h:w=1400",
    ),
    "desis": (
        "0.26*(random(0)*2-1)*(1-exp(-9*t))*exp(-1.1*t)",
        1.30, "highpass=f=1900,lowpass=f=9000",
    ),
    "tuang": (
        "0.30*(random(0)*2-1)*(1-exp(-7*t))*exp(-1.5*t)",
        1.10, "bandpass=f=900:width_type=h:w=1100",
    ),
    "gesek": (
        "0.24*(random(0)*2-1)*exp(-2.4*t)",
        0.60, "lowpass=f=1500",
    ),
}

# Nama lain yang mungkin muncul dari naskah, dipetakan ke resep yang ada.
_ALIAS = {
    "hening": "", "": "", "none": "",
    "click": "klik", "pop-in": "pop", "ding": "denting", "bell": "denting",
    "thud": "gedebuk", "riser": "naik", "zip": "resleting", "zipper": "resleting",
    "sizzle": "desis", "pour": "tuang", "friction": "gesek", "swipe": "swoosh",
    "getar": "gedebuk", "kejut": "gedebuk", "transisi": "swoosh",
}


def daftar_efek() -> list[str]:
    return sorted(_RESEP)


def berkas_efek(nama: str) -> Path | None:
    """Kembalikan berkas WAV untuk sebuah efek, membangkitkannya bila perlu."""
    kunci = _ALIAS.get(nama.strip().lower(), nama.strip().lower())
    if not kunci or kunci not in _RESEP:
        return None

    keluar = SFX_DIR / f"{kunci}.wav"
    if keluar.exists() and keluar.stat().st_size > 1000:
        return keluar

    ekspresi, durasi, tambahan = _RESEP[kunci]
    rantai = [f"aevalsrc={ekspresi}:d={durasi}:s=48000"]
    filters = []
    if tambahan:
        filters.append(tambahan)
    # Redam ujung agar tidak ada bunyi "klik" digital di awal/akhir.
    filters.append(f"afade=t=in:st=0:d=0.005,afade=t=out:st={max(0, durasi-0.03):.3f}:d=0.03")
    perintah = [
        "ffmpeg", "-v", "error", "-y",
        "-f", "lavfi", "-i", rantai[0],
        "-af", ",".join(filters),
        "-ac", "1", "-ar", "48000", str(keluar),
    ]
    try:
        subprocess.run(perintah, check=True, capture_output=True)
    except subprocess.CalledProcessError:
        return None
    return keluar if keluar.exists() else None


def bangkitkan_semua_efek() -> dict[str, Path]:
    """Siapkan seluruh pustaka efek sekali di awal."""
    hasil = {}
    for nama in _RESEP:
        p = berkas_efek(nama)
        if p:
            hasil[nama] = p
    return hasil


# ---------------------------------------------------------------------------
# Musik latar
# ---------------------------------------------------------------------------
def musik_ambient(durasi: float, keluar: Path, *, nada_dasar: float = 110.0) -> Path:
    """Bangkitkan musik latar lembut sebagai cadangan bila Suno tidak dipakai.

    Bukan lagu, melainkan bantalan nada yang tenang supaya video tidak terasa
    kosong di antara kalimat. Sengaja dibuat sangat pelan.
    """
    keluar.parent.mkdir(parents=True, exist_ok=True)
    # Tiga nada bertumpuk (dasar, kuint, oktaf) dengan getaran amplitudo pelan.
    ekspresi = (
        f"0.10*sin(2*PI*{nada_dasar}*t)*(0.65+0.35*sin(2*PI*0.07*t))"
        f"+0.07*sin(2*PI*{nada_dasar*1.5}*t)*(0.6+0.4*sin(2*PI*0.05*t))"
        f"+0.05*sin(2*PI*{nada_dasar*2}*t)*(0.5+0.5*sin(2*PI*0.11*t))"
    )
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y",
            "-f", "lavfi", "-i", f"aevalsrc={ekspresi}:d={durasi:.2f}:s=48000",
            "-af", f"lowpass=f=1600,afade=t=in:st=0:d=1.5,afade=t=out:st={max(0,durasi-2):.2f}:d=2",
            "-ac", "1", "-ar", "48000", str(keluar),
        ],
        check=True, capture_output=True,
    )
    return keluar


# ---------------------------------------------------------------------------
# Penataan akhir
# ---------------------------------------------------------------------------
# Jarak yang dituju antara narator dan musik SEBELUM ditekan, dalam desibel.
#
# Angka ini semula dua belas, hasil tebakan saya sendiri tentang "rentang
# sehat", dan musiknya tetap terdengar terlalu kecil oleh pemakainya.
#
# Satu ukuran yang sempat menyesatkan perlu dicatat supaya tidak dipakai
# lagi: membandingkan bagian keras dan bagian pelan dari campuran akhir.
# Menurut ukuran itu, campuran kita (14,8 dB) bahkan sudah lebih bermusik
# daripada acuan (15,9 dB), padahal telinga mengatakan sebaliknya.
# Penyebabnya loudnorm di ujung rantai: menambah musik menaikkan
# kenyaringan keseluruhan, lalu loudnorm menurunkan seisi trek, sehingga
# selisih kedua bagian nyaris tidak berubah.
#
# Ukuran yang benar adalah kerasnya MUSIK SAJA SAAT NARATOR BICARA,
# dihitung sebagai selisih terhadap campuran tanpa musik. Itulah
# satu-satunya saat yang menentukan, karena narasi kita rapat dan nyaris
# tidak punya sela panjang.
JARAK_MUSIK_DB = 3.0


def _rms_db(berkas: Path) -> float:
    """Kerasnya sebuah berkas audio, diukur sebagai rata-rata, dalam dBFS."""
    hasil = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(berkas), "-af", "volumedetect",
         "-f", "null", "-"], capture_output=True, text=True)
    for baris in hasil.stderr.splitlines():
        if "mean_volume" in baris:
            try:
                return float(baris.split("mean_volume:")[1].split("dB")[0])
            except (IndexError, ValueError):
                break
    return -20.0


def _volume_relatif(narasi: Path, musik: Path, bawaan: float, jarak_db: float) -> float:
    """Pengali volume musik supaya ia duduk jarak_db di bawah narasi.

    Kalau salah satu berkas gagal diukur, nilai bawaan dipakai apa adanya
    daripada menghasilkan campuran yang timpang.
    """
    n_db, m_db = _rms_db(narasi), _rms_db(musik)
    if n_db <= -60 or m_db <= -60:
        return bawaan
    # Musik harus turun sebanyak selisihnya, ditambah jarak yang dituju.
    perlu_db = (n_db - jarak_db) - m_db
    pengali = 10 ** (perlu_db / 20.0)
    # Dibatasi supaya kesalahan pengukuran tidak menghasilkan nilai liar.
    return max(0.05, min(2.5, pengali))


def gabung_audio(
    narasi: Path,
    keluar: Path,
    *,
    isyarat_sfx: list[tuple[float, str, float]] | None = None,
    musik: Path | None = None,
    volume_musik: float = 0.9,
    volume_sfx: float = 0.5,
    lufs: float = RENDER.lufs,
) -> Path:
    """Campur narasi, efek suara, dan musik jadi satu trek.

    isyarat_sfx berisi (detik_mulai, nama_efek, pengali_volume).
    Musik otomatis ditekan saat narator bicara memakai sidechain compressor,
    supaya suara narator selalu jadi yang paling jelas.
    """
    keluar.parent.mkdir(parents=True, exist_ok=True)
    isyarat_sfx = isyarat_sfx or []

    masukan: list[str] = ["-i", str(narasi)]
    bagian: list[str] = []
    label_campur: list[str] = []
    idx = 1

    # Narasi jadi acuan utama.
    bagian.append("[0:a]aresample=48000,aformat=channel_layouts=mono[narasi]")
    label_campur.append("[narasi]")

    # Efek suara, masing-masing digeser ke posisinya.
    for mulai, nama, gain in isyarat_sfx:
        berkas = berkas_efek(nama)
        if not berkas:
            continue
        masukan += ["-i", str(berkas)]
        ms = max(0, int(mulai * 1000))
        bagian.append(
            f"[{idx}:a]adelay={ms}|{ms},volume={volume_sfx * gain:.3f}[sfx{idx}]"
        )
        label_campur.append(f"[sfx{idx}]")
        idx += 1

    # Musik latar dengan penekanan otomatis.
    if musik and musik.exists():
        masukan += ["-i", str(musik)]
        # Volume musik disetel RELATIF terhadap kerasnya narasi, bukan
        # dipatok angka tetap.
        #
        # Alasannya ketahuan waktu suasana narator diubah jadi muram:
        # penyampaian yang menahan diri otomatis lebih pelan, sehingga
        # musik dengan volume tetap jadi terlalu dekat. Terukur jaraknya
        # turun dari 11,1 dB ke 5,8 dB hanya karena suasananya berganti,
        # padahal setelan musiknya sama persis.
        #
        # Dengan menyetel relatif, tiap suasana, tiap suara, dan tiap lagu
        # menghasilkan jarak yang sama tanpa perlu disetel tangan.
        volume_musik = _volume_relatif(narasi, musik, volume_musik, JARAK_MUSIK_DB)
        bagian.append(f"[{idx}:a]volume={volume_musik:.3f}[musikmentah]")
        bagian.append("[narasi]asplit=2[narasi_out][narasi_kunci]")
        # Penekanan LEMBUT, dan ini berlawanan dengan dugaan yang wajar.
        #
        # Video acuan memakai penekanan kuat (ambang 0,02 rasio 12), jadi
        # saya sempat menirunya. Hasilnya justru paling buruk. Diukur
        # sebagai kerasnya musik SAAT NARATOR BICARA, yaitu satu-satunya
        # saat yang menentukan musik terdengar atau tidak pada narasi rapat
        # seperti punya kita:
        #
        #     ambang/rasio     jarak 12 dB   jarak 6 dB   jarak 3 dB
        #     0,02 / 12          -50,5        -44,4        -41,5
        #     0,30 / 3           -31,9        -26,1        -23,4
        #     0,70 / 1,5         -30,9        -25,2        -22,5   <- dipakai
        #
        # Sebabnya: rasio tinggi menggilas masukan yang keras justru lebih
        # dalam, sehingga menaikkan volume malah membuatnya makin hilang.
        # Campuran acuan bisa memakai rasio tinggi karena narasinya diberi
        # ruang lain dan trek akhirnya tidak dinormalkan ulang seperti
        # milik kita.
        #
        # Yang benar untuk kita: masukan keras, ditekan lembut. Musik jadi
        # terdengar DI BAWAH suara narator, bukan cuma di sela-selanya, dan
        # itu penting karena narasi kita nyaris tanpa sela panjang.
        bagian.append(
            "[musikmentah][narasi_kunci]sidechaincompress="
            "threshold=0.7:ratio=1.5:attack=15:release=380[musik]"
        )
        label_campur = ["[narasi_out]"] + label_campur[1:] + ["[musik]"]
        idx += 1

    campur = "".join(label_campur)
    bagian.append(
        f"{campur}amix=inputs={len(label_campur)}:duration=first:"
        f"dropout_transition=0:normalize=0[campur]"
    )
    # Ratakan kenyaringan ke standar media sosial lalu batasi puncaknya.
    bagian.append(
        f"[campur]loudnorm=I={lufs}:TP={RENDER.true_peak}:LRA=9,"
        f"alimiter=limit=0.95,aresample=48000[keluar]"
    )

    perintah = (
        ["ffmpeg", "-v", "error", "-y"]
        + masukan
        + ["-filter_complex", ";".join(bagian), "-map", "[keluar]",
           "-ac", "2", "-ar", "48000", "-c:a", "pcm_s16le", str(keluar)]
    )
    subprocess.run(perintah, check=True, capture_output=True)
    return keluar
