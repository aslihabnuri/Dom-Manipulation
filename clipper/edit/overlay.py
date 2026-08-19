"""Hook and info-card text drawn over the clip.

This is the deliberate, visible contribution the clip adds over the raw live
recording: a hook that frames the moment and an info line that carries the
product fact a silent viewer would otherwise miss. Both sit inside the top safe
zone so TikTok's own chrome never covers them.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from ..config import Config
from .caption import _PRICE, _find_price
from .captions import ass_time, escape

_STOPWORDS = {
    "yang", "untuk", "dengan", "adalah", "kalau", "sudah", "biar", "aja", "nih",
    "kak", "ya", "sih", "deh", "banget", "gitu", "jadi", "terus", "kayak", "emang",
}


@dataclass
class OverlayText:
    hook: str = ""
    info: str = ""


def style_lines(config: Config, width: int, height: int) -> list[str]:
    font = config.get("overlay.font", "DejaVu Sans")
    hook_size = int(config.get("overlay.hook_size", 72))
    info_size = int(config.get("overlay.info_size", 44))
    hook_color = config.get("overlay.hook_color", "&H00FFFFFF")
    back = config.get("overlay.hook_back_color", "&HB0000000")
    top_safe = float(config.get("captions.top_safe", 0.12))

    margin_v = int(height * top_safe)
    margin_h = int(width * 0.08)

    return [
        # BorderStyle 3 paints an opaque box behind the text, which keeps it
        # readable over any frame without dimming the video itself.
        f"Style: Hook,{font},{hook_size},{hook_color},&H000000FF,&H00000000,{back},"
        f"-1,0,0,0,100,100,0,0,3,6,0,8,{margin_h},{margin_h},{margin_v},1",
        f"Style: Info,{font},{info_size},{hook_color},&H000000FF,&H00000000,{back},"
        f"0,0,0,0,100,100,0,0,3,4,0,8,{margin_h},{margin_h},{margin_v + int(hook_size * 1.9)},1",
    ]


def _wrap(text: str, max_chars: int) -> str:
    words, lines, current = text.split(), [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and len(candidate) > max_chars:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return "\\N".join(lines[:3])


def render_events(overlay: OverlayText, clip_duration: float, config: Config) -> list[str]:
    """ASS Dialogue lines for the hook and info card."""
    if not bool(config.get("overlay.enabled", True)):
        return []

    hook_seconds = min(float(config.get("overlay.hook_seconds", 3.5)), clip_duration)
    events: list[str] = []

    if overlay.hook.strip():
        events.append(
            f"Dialogue: 1,{ass_time(0.0)},{ass_time(hook_seconds)},Hook,,0,0,0,,"
            f"{_wrap(escape(overlay.hook), 22)}"
        )
    if overlay.info.strip():
        # The info line outlives the hook: it is the fact worth carrying.
        info_end = min(clip_duration, max(hook_seconds + 3.0, clip_duration * 0.55))
        events.append(
            f"Dialogue: 1,{ass_time(0.0)},{ass_time(info_end)},Info,,0,0,0,,"
            f"{_wrap(escape(overlay.info), 34)}"
        )
    return events


def find_price(text: str) -> str:
    """The price actually being charged, shared with the caption writer.

    Burning "Rp129.000" over a clip where the host said "jadi Rp89.000" would
    put a wrong price on the video itself, so this must stay discount-aware.
    """
    return _find_price(text or "")


def suggest(transcript_text: str, hour_label: str = "", score: float = 0.0) -> OverlayText:
    """Draft a hook and info line from what was actually said.

    Deliberately conservative -- it is a starting point the operator edits, not
    a finished caption. A wrong auto-hook is a misleading claim, so nothing is
    invented that is not in the transcript.
    """
    text = (transcript_text or "").strip()
    if not text:
        return OverlayText(hook="", info="")

    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n", text) if s.strip()]
    price = find_price(text)

    best, best_score = "", -1.0
    for sentence in sentences:
        words = [w for w in re.findall(r"[a-zA-Z']+", sentence.lower()) if w not in _STOPWORDS]
        if not 3 <= len(words) <= 18:
            continue
        value = len(set(words)) / (1 + abs(len(sentence) - 55) / 55)
        if _PRICE.search(sentence):
            value *= 1.4
        if value > best_score:
            best, best_score = sentence, value

    hook = best or (sentences[0] if sentences else "")
    hook = re.sub(r"\s+", " ", hook).strip(" .,-")
    if len(hook) > 64:
        hook = hook[:61].rsplit(" ", 1)[0] + "..."

    info_bits = [b for b in (price, f"LIVE {hour_label}" if hour_label else "") if b]
    return OverlayText(hook=hook, info=" - ".join(info_bits))
