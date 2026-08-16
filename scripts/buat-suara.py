"""
Indonesian voice-over via Microsoft Edge Neural TTS.

Why this engine. The dubbing requirement is the strictest part of the brief:
proper Indonesian, no slip of tongue, and one shot at it because re-rendering
costs money. `id-ID-GadisNeural` is a real Indonesian neural voice — not an
English model reading Indonesian phonemes — so pepet/taling land correctly and
the prosody is native. It needs no API key and no paid credits, which matters
more than it sounds: it means a failed take costs nothing to redo.

The word boundaries are the other half of the value. Azure streams the start
time of every spoken word, so the burned-in captions can be cut to the frame
the word is actually said, instead of guessed from an average speaking rate.
"""

import asyncio
import json
import pathlib
import sys

import edge_tts

# Azure's default reading rate is a newsreader's, not a documentary narrator's.
# The references sit around 2.3 words/second; +12% moves the voice there without
# the clipped consonants that show up past about +20%.
RATE = "+12%"
VOICE = "id-ID-GadisNeural"

naskah_path = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "demo/naskah.json")
naskah = json.loads(naskah_path.read_text(encoding="utf-8"))

slug = "".join(c if c.isalnum() else "-" for c in naskah["judul"].lower())
slug = "-".join(filter(None, slug.split("-")))[:48]
out_dir = pathlib.Path("cache/suara") / slug
out_dir.mkdir(parents=True, exist_ok=True)


async def satu_segmen(index: int, teks: str) -> dict:
    """Synthesise one line and return its file, duration and word timings."""
    mp3 = out_dir / f"{index:02d}.mp3"
    # Azure defaults to sentence-level marks. Word level is the whole point:
    # it is what lets a caption word appear on the frame it is spoken.
    comm = edge_tts.Communicate(teks, VOICE, rate=RATE, boundary="WordBoundary")

    audio = bytearray()
    kata = []
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            # Azure reports in 100-nanosecond ticks; seconds are what we plan in.
            kata.append(
                {
                    "teks": chunk["text"],
                    "mulai": chunk["offset"] / 1e7,
                    "durasi": chunk["duration"] / 1e7,
                }
            )

    if not audio:
        raise RuntimeError(f"segmen {index}: tidak ada audio dari Azure")
    mp3.write_bytes(bytes(audio))

    # Trust the last word boundary over the container header: a truncated MP3
    # still reports a plausible duration, and a short read here would silently
    # cut the last word off the video.
    akhir = kata[-1]["mulai"] + kata[-1]["durasi"] if kata else 0.0
    return {"index": index, "file": str(mp3), "detik": round(akhir, 3), "kata": kata}


async def main() -> None:
    segmen = naskah["segmen"]
    hasil = []
    # Sequential on purpose. Azure throttles bursts from one client, and a
    # throttled take comes back truncated rather than failing loudly — exactly
    # the defect this whole pipeline exists to prevent.
    for i, s in enumerate(segmen):
        r = await satu_segmen(i, s["vo"])
        hasil.append(r)
        print(f"  {i + 1}/{len(segmen)}  {r['detik']:5.2f}s  {s['vo'][:52]}")

    total = sum(r["detik"] for r in hasil)
    (out_dir / "manifest.json").write_text(
        json.dumps(
            {"judul": naskah["judul"], "suara": VOICE, "rate": RATE,
             "total_detik": round(total, 2), "segmen": hasil},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"\n{len(hasil)} segmen · {total:.1f} detik total · {out_dir}")


asyncio.run(main())
