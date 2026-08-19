"""Configuration loading, with defaults that work out of the box."""

from __future__ import annotations

import copy
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

DEFAULTS: dict[str, Any] = {
    "paths": {
        "work_dir": "./work",
        "output_dir": "./output",
        "ledger": "./work/ledger.json",
    },
    "scoring": {
        # How to combine viewers and sales into one number.
        #   geometric  -> rewards hours strong in BOTH (recommended)
        #   weighted   -> plain weighted sum, use when one metric matters more
        "method": "geometric",
        "viewers_weight": 0.5,
        "sales_weight": 0.5,
        # Which column drives the "sales" side: gmv | orders | gmv_per_viewer
        "sales_metric": "gmv",
        # Hours scoring below this (0-1) never produce clips.
        "min_score": 0.35,
        "max_clips_per_session": 6,
        # At most this many clips from a single hour, so one hot hour does not
        # monopolise the batch.
        "max_clips_per_hour": 2,
    },
    "clip": {
        "target_seconds": 45,
        "min_seconds": 21,
        "max_seconds": 60,
        # Padding kept around the chosen speech window.
        "lead_in": 0.4,
        "lead_out": 0.6,
    },
    "refine": {
        # Weights for picking the exact moment inside a strong hour.
        "audio_energy": 0.30,
        "speech_density": 0.25,
        "intent_phrases": 0.45,
        "snap_to_sentences": True,
        "window_stride": 3.0,
    },
    "render": {
        "width": 1080,
        "height": 1920,
        # cover  -> centre-crop to fill 9:16 (best when host is centred)
        # blur   -> fit whole frame, blurred backdrop fills the rest
        "reframe": "blur",
        "crop_bias_x": 0.5,
        "crf": 20,
        "preset": "medium",
        "audio_bitrate": "160k",
        "normalize_audio": True,
        "fps": 30,
    },
    "captions": {
        "enabled": True,
        "font": "DejaVu Sans",
        "font_size": 64,
        "primary_color": "&H00FFFFFF",
        "outline_color": "&H00000000",
        "highlight_color": "&H0000E5FF",
        "outline": 4,
        "shadow": 1,
        # Fraction of frame height kept clear at the bottom for TikTok's own UI.
        "bottom_safe": 0.22,
        "top_safe": 0.12,
        "max_chars_per_line": 24,
        "max_lines": 2,
        "word_highlight": True,
    },
    "overlay": {
        "enabled": True,
        "font": "DejaVu Sans",
        "hook_size": 72,
        "info_size": 44,
        "hook_seconds": 3.5,
        "hook_color": "&H00FFFFFF",
        "hook_back_color": "&HB0000000",
    },
    "compliance": {
        "rules": "id",
        "block_on": ["block"],
        "scan_transcript": True,
        "detect_music": True,
        # Reject a candidate that overlaps an already-published clip by more
        # than this fraction. TikTok treats re-uploads of the same moment as
        # unoriginal, so this is the single most important guard here.
        "max_overlap_with_published": 0.25,
        "require_added_value": True,
    },
    "transcribe": {
        "enabled": True,
        "model": "small",
        "language": "id",
        "device": "auto",
        "compute_type": "int8",
    },
    "drive": {
        "credentials": "~/.config/tiktok-clipper/credentials.json",
        "token": "~/.config/tiktok-clipper/token.json",
    },
}


def _deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    out = copy.deepcopy(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(out.get(key), dict):
            out[key] = _deep_merge(out[key], value)
        else:
            out[key] = value
    return out


@dataclass
class Config:
    data: dict[str, Any] = field(default_factory=lambda: copy.deepcopy(DEFAULTS))
    source: Path | None = None

    @classmethod
    def load(cls, path: str | Path | None = None) -> "Config":
        if path is None:
            for cand in ("clipper.yaml", "clipper.yml", "config.yaml"):
                if Path(cand).exists():
                    path = cand
                    break
        if path is None:
            return cls()

        p = Path(path).expanduser()
        if not p.exists():
            raise FileNotFoundError(f"config not found: {p}")

        raw = p.read_text(encoding="utf-8")
        try:
            import yaml  # type: ignore

            loaded = yaml.safe_load(raw) or {}
        except ImportError:
            import json

            loaded = json.loads(raw)

        if not isinstance(loaded, dict):
            raise ValueError(f"config root must be a mapping, got {type(loaded).__name__}")
        return cls(data=_deep_merge(DEFAULTS, loaded), source=p)

    def get(self, dotted: str, default: Any = None) -> Any:
        node: Any = self.data
        for part in dotted.split("."):
            if not isinstance(node, dict) or part not in node:
                return default
            node = node[part]
        return node

    def section(self, name: str) -> dict[str, Any]:
        value = self.data.get(name, {})
        return value if isinstance(value, dict) else {}

    def path(self, dotted: str) -> Path:
        return Path(str(self.get(dotted))).expanduser()

    def validate(self) -> list[str]:
        """Return a list of human-readable problems; empty means the config is sane."""
        problems: list[str] = []
        cmin = float(self.get("clip.min_seconds", 0))
        cmax = float(self.get("clip.max_seconds", 0))
        target = float(self.get("clip.target_seconds", 0))
        if cmin <= 0:
            problems.append("clip.min_seconds must be > 0")
        if cmax < cmin:
            problems.append("clip.max_seconds must be >= clip.min_seconds")
        if not cmin <= target <= cmax:
            problems.append(
                f"clip.target_seconds ({target}) must sit between min ({cmin}) and max ({cmax})"
            )
        method = self.get("scoring.method")
        if method not in ("geometric", "weighted"):
            problems.append(f"scoring.method must be 'geometric' or 'weighted', got {method!r}")
        metric = self.get("scoring.sales_metric")
        if metric not in ("gmv", "orders", "gmv_per_viewer"):
            problems.append(
                f"scoring.sales_metric must be gmv|orders|gmv_per_viewer, got {metric!r}"
            )
        reframe = self.get("render.reframe")
        if reframe not in ("cover", "blur"):
            problems.append(f"render.reframe must be 'cover' or 'blur', got {reframe!r}")
        overlap = float(self.get("compliance.max_overlap_with_published", 0))
        if not 0.0 <= overlap <= 1.0:
            problems.append("compliance.max_overlap_with_published must be between 0 and 1")
        return problems
