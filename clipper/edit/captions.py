"""Build burned-in captions as an ASS subtitle file.

Captions are not decoration here: they are the "contribution via text" that
TikTok's own seller guidance asks for when a livestream recording is reposted,
and they are what makes a clip watchable with the sound off. Layout keeps the
top and bottom safe zones clear so nothing lands under TikTok's own UI.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from ..config import Config
from ..models import Transcript, TranscriptWord


def ass_time(seconds: float) -> str:
    """Format seconds as ASS ``H:MM:SS.cc``."""
    seconds = max(0.0, seconds)
    centis = int(round(seconds * 100))
    h, rem = divmod(centis, 360000)
    m, rem = divmod(rem, 6000)
    s, cs = divmod(rem, 100)
    return f"{h:d}:{m:02d}:{s:02d}.{cs:02d}"


def escape(text: str) -> str:
    """Escape ASS control characters in dialogue text."""
    return (
        text.replace("\\", "\\\\")
        .replace("{", "\\{")
        .replace("}", "\\}")
        .replace("\n", " ")
        .strip()
    )


@dataclass
class CaptionCard:
    """A screenful of caption text and the words that make it up."""

    start: float
    end: float
    lines: list[list[TranscriptWord]]

    @property
    def words(self) -> list[TranscriptWord]:
        return [w for line in self.lines for w in line]


def _wrap(words: list[TranscriptWord], max_chars: int) -> list[list[TranscriptWord]]:
    lines: list[list[TranscriptWord]] = []
    current: list[TranscriptWord] = []
    length = 0
    for word in words:
        add = len(word.text) + (1 if current else 0)
        if current and length + add > max_chars:
            lines.append(current)
            current, length = [word], len(word.text)
        else:
            current.append(word)
            length += add
    if current:
        lines.append(current)
    return lines


def build_cards(
    transcript: Transcript, start: float, end: float, config: Config
) -> list[CaptionCard]:
    """Split the spoken words in ``[start, end)`` into caption cards."""
    max_chars = int(config.get("captions.max_chars_per_line", 24))
    max_lines = max(1, int(config.get("captions.max_lines", 2)))

    words = [
        TranscriptWord(start=w.start - start, end=w.end - start, text=w.text.strip())
        for w in transcript.words_between(start, end)
        if w.text.strip()
    ]

    if not words:
        # No word timings (e.g. an imported SRT) -- fall back to whole segments.
        cards: list[CaptionCard] = []
        for seg in transcript.segments:
            if seg.end <= start or seg.start >= end or not seg.text.strip():
                continue
            s, e = max(seg.start, start) - start, min(seg.end, end) - start
            if e <= s:
                continue
            fake = [TranscriptWord(s, e, seg.text.strip())]
            cards.append(CaptionCard(start=s, end=e, lines=_wrap(fake, max_chars * max_lines)))
        return cards

    for word in words:  # keep everything inside the clip's own timeline
        word.start = max(0.0, word.start)
        word.end = max(word.start + 0.08, min(word.end, end - start))

    cards = []
    lines = _wrap(words, max_chars)
    for i in range(0, len(lines), max_lines):
        group = lines[i : i + max_lines]
        flat = [w for line in group for w in line]
        if flat:
            cards.append(CaptionCard(start=flat[0].start, end=flat[-1].end, lines=group))

    # Close gaps so captions do not flicker between cards.
    for i in range(len(cards) - 1):
        gap = cards[i + 1].start - cards[i].end
        if 0 < gap <= 0.45:
            cards[i].end = cards[i + 1].start
    return cards


def style_line(config: Config, width: int, height: int) -> str:
    font = config.get("captions.font", "DejaVu Sans")
    size = int(config.get("captions.font_size", 64))
    primary = config.get("captions.primary_color", "&H00FFFFFF")
    outline_c = config.get("captions.outline_color", "&H00000000")
    outline = int(config.get("captions.outline", 4))
    shadow = int(config.get("captions.shadow", 1))
    bottom_safe = float(config.get("captions.bottom_safe", 0.22))

    margin_v = int(height * bottom_safe)
    margin_h = int(width * 0.07)
    # Alignment 2 = bottom-centre; MarginV lifts text clear of TikTok's UI.
    return (
        f"Style: Caption,{font},{size},{primary},&H000000FF,{outline_c},&H64000000,"
        f"-1,0,0,0,100,100,0,0,1,{outline},{shadow},2,{margin_h},{margin_h},{margin_v},1"
    )


def render_cards(cards: list[CaptionCard], config: Config) -> list[str]:
    """Turn caption cards into ASS Dialogue lines."""
    highlight = bool(config.get("captions.word_highlight", True))
    hl_color = config.get("captions.highlight_color", "&H0000E5FF")
    primary = config.get("captions.primary_color", "&H00FFFFFF")
    events: list[str] = []

    for card in cards:
        if card.end <= card.start:
            continue

        if not highlight:
            text = "\\N".join(" ".join(escape(w.text) for w in line) for line in card.lines)
            events.append(
                f"Dialogue: 0,{ass_time(card.start)},{ass_time(card.end)},Caption,,0,0,0,,{text}"
            )
            continue

        # One event per word, re-drawing the whole card with the active word
        # recoloured. Verbose, but it renders identically everywhere.
        words = card.words
        for idx, active in enumerate(words):
            seg_start = active.start
            seg_end = words[idx + 1].start if idx + 1 < len(words) else card.end
            if seg_end <= seg_start:
                seg_end = seg_start + 0.12

            parts: list[str] = []
            for line in card.lines:
                rendered = []
                for word in line:
                    body = escape(word.text)
                    if word is active:
                        rendered.append(f"{{\\c{hl_color}}}{body}{{\\c{primary}}}")
                    else:
                        rendered.append(body)
                parts.append(" ".join(rendered))
            text = "\\N".join(parts)
            events.append(
                f"Dialogue: 0,{ass_time(seg_start)},{ass_time(seg_end)},Caption,,0,0,0,,{text}"
            )
    return events


def build_ass(
    transcript: Transcript | None,
    start: float,
    end: float,
    config: Config,
    extra_styles: list[str] | None = None,
    extra_events: list[str] | None = None,
) -> str:
    """Assemble a complete ASS document for one clip."""
    width = int(config.get("render.width", 1080))
    height = int(config.get("render.height", 1920))

    styles = [style_line(config, width, height)] + list(extra_styles or [])
    events: list[str] = []
    if transcript is not None and bool(config.get("captions.enabled", True)):
        events += render_cards(build_cards(transcript, start, end, config), config)
    events += list(extra_events or [])

    return "\n".join([
        "[Script Info]",
        "ScriptType: v4.00+",
        f"PlayResX: {width}",
        f"PlayResY: {height}",
        "WrapStyle: 2",
        "ScaledBorderAndShadow: yes",
        "YCbCr Matrix: TV.709",
        "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, "
        "BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, "
        "BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        *styles,
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
        *events,
        "",
    ])


def write_ass(content: str, path: str | Path) -> Path:
    p = Path(path).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return p
