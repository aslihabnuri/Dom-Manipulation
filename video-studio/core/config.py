"""Konfigurasi global aplikasi.

Semua pengaturan yang bisa diubah pengguna ada di sini atau di file .env.
Tidak ada API key yang pernah ditulis ke dalam kode sumber.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent.parent
PROJECTS_DIR = APP_DIR / "projects"
ASSETS_DIR = APP_DIR / "assets"
FONTS_DIR = ASSETS_DIR / "fonts"
CACHE_DIR = APP_DIR / ".cache"

for _d in (PROJECTS_DIR, ASSETS_DIR, FONTS_DIR, CACHE_DIR):
    _d.mkdir(parents=True, exist_ok=True)


def _load_dotenv() -> None:
    """Baca file .env sederhana tanpa dependensi tambahan."""
    env_path = APP_DIR / ".env"
    if not env_path.exists():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        # Variabel yang sudah ada di environment menang atas file .env.
        if key and key not in os.environ:
            os.environ[key] = value


_load_dotenv()


# --------------------------------------------------------------------------
# Endpoint & model Kie
# --------------------------------------------------------------------------
KIE_BASE = "https://api.kie.ai"
KIE_CREATE_TASK = f"{KIE_BASE}/api/v1/jobs/createTask"
KIE_RECORD_INFO = f"{KIE_BASE}/api/v1/jobs/recordInfo"
KIE_CREDIT = f"{KIE_BASE}/api/v1/chat/credit"
KIE_CLAUDE_MESSAGES = f"{KIE_BASE}/claude/v1/messages"
KIE_UPLOAD_BASE64 = f"{KIE_BASE}/api/v1/file-base64-upload"

# Model teks.
#
# Kie menyediakan dua jalur yang berperilaku sangat berbeda:
#
#   jalur "openai" : https://api.kie.ai/<model>/v1/chat/completions
#                    Bersih, boleh non-stream, mendukung peran "system".
#
#   jalur "claude" : https://api.kie.ai/claude/v1/messages
#                    WAJIB stream=true, dan proxy Kie menyuntikkan system
#                    prompt "Ask mode" berisi persona asisten coding. Akibatnya
#                    model sering MENOLAK tugas penulisan kreatif dan membalas
#                    "this isn't a coding question" alih-alih JSON yang diminta.
#                    Karena itu jalur ini bukan pilihan utama.
#
# Temuan di atas berasal dari pengujian langsung, bukan dokumentasi.
LLM_MODELS = {
    "cepat": {"id": "gemini-3-flash", "jalur": "openai", "label": "Cepat dan murah"},
    "cerdas": {"id": "gemini-3-pro", "jalur": "openai", "label": "Cerdas (disarankan)"},
    "claude": {
        "id": "claude-sonnet-4-5",
        "jalur": "claude",
        "label": "Claude (cadangan, kadang menolak)",
    },
}
DEFAULT_LLM = "cerdas"


def llm_info(tier: str) -> dict:
    return LLM_MODELS.get(tier) or LLM_MODELS[DEFAULT_LLM]


def kie_openai_endpoint(model_id: str) -> str:
    return f"{KIE_BASE}/{model_id}/v1/chat/completions"

# Model gambar (storyboard).
IMAGE_MODELS = {
    "nano-banana": {
        "id": "google/nano-banana",
        "label": "Nano Banana (konsisten, murah)",
        "credits": 4.0,
        "supports_reference": True,
    },
    "nano-banana-2": {
        "id": "google/nanobanana2",
        "label": "Nano Banana 2 (kualitas lebih tinggi)",
        "credits": 8.0,
        "supports_reference": True,
    },
    "seedream-4": {
        "id": "seedream/seedream-v4-text-to-image",
        "label": "Seedream v4 (detail tinggi)",
        "credits": 6.0,
        "supports_reference": False,
    },
}
DEFAULT_IMAGE_MODEL = "nano-banana"

# Model image-to-video untuk shot yang butuh gerak nyata.
VIDEO_MODELS = {
    "wan-flash": {
        "id": "wan/2-6-flash-image-to-video",
        "label": "Wan 2.6 Flash (paling hemat)",
        "credits_per_clip": 30.0,
        "durations": ["5", "10"],
    },
    "seedance-mini": {
        "id": "bytedance/seedance-2-mini",
        "label": "Seedance 2 Mini (gerak halus)",
        "credits_per_clip": 45.0,
        "durations": ["5", "10"],
    },
    "kling-turbo": {
        "id": "kling/v3-turbo-image-to-video",
        "label": "Kling v3 Turbo (kualitas tinggi)",
        "credits_per_clip": 80.0,
        "durations": ["5", "10"],
    },
}
DEFAULT_VIDEO_MODEL = "wan-flash"

# Text-to-speech. Urutan di sini adalah urutan fallback otomatis.
TTS_PROVIDERS = {
    "gemini-kie": {
        "id": "google/gemini-3-1-flash-tts",
        "label": "Gemini 3.1 Flash TTS (via Kie) — direkomendasikan",
        "needs": "kie",
    },
    "elevenlabs-kie": {
        "id": "elevenlabs/text-to-speech-multilingual-v2",
        "label": "ElevenLabs Multilingual v2 (via Kie)",
        "needs": "kie",
    },
    "elevenlabs-direct": {
        "id": "eleven_multilingual_v2",
        "label": "ElevenLabs (API key sendiri)",
        "needs": "elevenlabs_key",
    },
    "edge": {
        "id": "edge-tts",
        "label": "Edge TTS (gratis, tanpa API key)",
        "needs": None,
    },
}
DEFAULT_TTS_CHAIN = ["gemini-kie", "edge", "elevenlabs-kie", "elevenlabs-direct"]

# Suara Gemini yang cocok untuk narasi Bahasa Indonesia.
GEMINI_VOICES = {
    "Aoede": "Perempuan — hangat, naratif, cocok untuk cerita sejarah",
    "Kore": "Perempuan — tegas, jernih, cocok untuk edukasi",
    "Leda": "Perempuan — muda, ramah, cocok untuk lifestyle",
    "Callirrhoe": "Perempuan — lembut, intim, cocok untuk kuliner",
    "Charon": "Laki-laki — dalam, berwibawa, cocok untuk dokumenter",
    "Puck": "Laki-laki — energik, ringan, cocok untuk konten cepat",
    "Orus": "Laki-laki — netral, jernih, serbaguna",
    "Enceladus": "Laki-laki — serak lembut, cocok untuk cerita misteri",
}
DEFAULT_GEMINI_VOICE = "Aoede"

EDGE_VOICES = {
    "id-ID-GadisNeural": "Perempuan — natural, standar Bahasa Indonesia",
    "id-ID-ArdiNeural": "Laki-laki — natural, standar Bahasa Indonesia",
}
DEFAULT_EDGE_VOICE = "id-ID-GadisNeural"


# --------------------------------------------------------------------------
# Target teknis render (disamakan dengan video referensi)
# --------------------------------------------------------------------------
@dataclass
class RenderSpec:
    width: int = 1080
    height: int = 1920
    fps: int = 30
    # Video referensi diukur pada -13.0 LUFS, true peak 0.1 dBFS.
    # -14 LUFS adalah target aman yang diterima TikTok/Reels/Shorts.
    lufs: float = -14.0
    true_peak: float = -1.0
    video_bitrate: str = "8M"
    audio_bitrate: str = "192k"

    @property
    def size(self) -> str:
        return f"{self.width}x{self.height}"


RENDER = RenderSpec()


def kie_key() -> str:
    return os.environ.get("KIE_API_KEY", "").strip()


def elevenlabs_key() -> str:
    return os.environ.get("ELEVENLABS_API_KEY", "").strip()


def set_kie_key(value: str) -> None:
    os.environ["KIE_API_KEY"] = value.strip()


def save_env(kie: str = "", eleven: str = "") -> Path:
    """Tulis .env agar pengguna tidak perlu memasukkan key setiap kali."""
    env_path = APP_DIR / ".env"
    lines = ["# Jangan bagikan file ini. Sudah otomatis diabaikan oleh git.", ""]
    if kie:
        lines.append(f"KIE_API_KEY={kie.strip()}")
    if eleven:
        lines.append(f"ELEVENLABS_API_KEY={eleven.strip()}")
    env_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    try:
        env_path.chmod(0o600)
    except OSError:
        pass
    _load_dotenv()
    if kie:
        set_kie_key(kie)
    if eleven:
        os.environ["ELEVENLABS_API_KEY"] = eleven.strip()
    return env_path


@dataclass
class AppSettings:
    """Pengaturan yang disimpan antar sesi."""

    llm_tier: str = DEFAULT_LLM
    image_model: str = DEFAULT_IMAGE_MODEL
    video_model: str = DEFAULT_VIDEO_MODEL
    tts_provider: str = "gemini-kie"
    gemini_voice: str = DEFAULT_GEMINI_VOICE
    edge_voice: str = DEFAULT_EDGE_VOICE
    motion_mode: str = "hemat"  # "hemat" | "campuran" | "premium"
    verify_pronunciation: bool = False
    extra: dict = field(default_factory=dict)

    _PATH = CACHE_DIR / "settings.json"

    @classmethod
    def load(cls) -> "AppSettings":
        if cls._PATH.exists():
            try:
                data = json.loads(cls._PATH.read_text(encoding="utf-8"))
                known = {f for f in cls.__dataclass_fields__ if not f.startswith("_")}
                s = cls(**{k: v for k, v in data.items() if k in known})
                s._bersihkan()
                return s
            except (json.JSONDecodeError, TypeError, ValueError):
                pass
        return cls()

    def _bersihkan(self) -> None:
        """Kembalikan pilihan yang sudah tidak ada ke nilai bawaan.

        Daftar model bisa berubah antarversi aplikasi. Tanpa ini, pengaturan
        lama membuat halaman Pengaturan gagal dimuat.
        """
        if self.llm_tier not in LLM_MODELS:
            self.llm_tier = DEFAULT_LLM
        if self.image_model not in IMAGE_MODELS:
            self.image_model = DEFAULT_IMAGE_MODEL
        if self.video_model not in VIDEO_MODELS:
            self.video_model = DEFAULT_VIDEO_MODEL
        if self.tts_provider not in TTS_PROVIDERS:
            self.tts_provider = "gemini-kie"
        if self.gemini_voice not in GEMINI_VOICES:
            self.gemini_voice = DEFAULT_GEMINI_VOICE
        if self.edge_voice not in EDGE_VOICES:
            self.edge_voice = DEFAULT_EDGE_VOICE

    def save(self) -> None:
        data = {
            k: getattr(self, k)
            for k in self.__dataclass_fields__
            if not k.startswith("_")
        }
        self._PATH.write_text(
            json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8"
        )
