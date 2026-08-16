"""
Indonesian dubbing through Microsoft Edge's neural voices.

Invoked by src/pipeline/voice.mjs, not by hand. Reads one JSON request on
stdin, writes the audio files, prints one JSON response on stdout. Progress
goes to stderr so it can be streamed into the UI without corrupting the
response.

Why a Python helper in a Node project: the Edge voice protocol is a WebSocket
handshake with a signed token and a binary frame format, and `edge-tts` is the
maintained implementation of it. Reimplementing that in Node to avoid one
subprocess would mean owning a protocol we did not design and cannot test
against. The subprocess boundary is the cheaper of the two.

Request:
  {"voice": "id-ID-GadisNeural", "rate": "+12%",
   "segments": [{"index": 0, "text": "...", "file": "/abs/path/000.mp3"}]}

Response:
  {"ok": true, "segments": [{"index": 0, "file": "...", "seconds": 2.87,
                             "words": [{"text": "Tas", "start": 0.1, "duration": 0.2}]}]}
"""

import asyncio
import json
import pathlib
import sys

try:
    import edge_tts
except ImportError:
    print(
        json.dumps(
            {
                "ok": False,
                "error": "modul-hilang",
                "message": "Paket edge-tts belum terpasang. Jalankan: pip install edge-tts",
            }
        )
    )
    sys.exit(0)


async def satu(voice: str, rate: str, segment: dict) -> dict:
    """Synthesise one segment and report exactly which words were spoken."""
    # Word-level boundaries are the point. Azure defaults to sentence level,
    # which is too coarse to cut a caption on.
    comm = edge_tts.Communicate(
        segment["text"],
        voice,
        rate=segment.get("rate", rate),
        pitch=segment.get("pitch", "+0Hz"),
        boundary="WordBoundary",
    )

    audio = bytearray()
    words = []
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            # Azure counts in 100-nanosecond ticks; the pipeline plans in seconds.
            words.append(
                {
                    "text": chunk["text"],
                    "start": chunk["offset"] / 1e7,
                    "duration": chunk["duration"] / 1e7,
                }
            )

    if not audio:
        raise RuntimeError("tidak ada audio yang diterima")

    path = pathlib.Path(segment["file"])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(bytes(audio))

    # The last word boundary, not the container header: a throttled take comes
    # back short but still reports a plausible header duration, and trusting it
    # would let a truncated line through.
    spoken = words[-1]["start"] + words[-1]["duration"] if words else 0.0
    return {
        "index": segment["index"],
        "file": str(path),
        "seconds": round(spoken, 3),
        "words": words,
    }


async def main() -> None:
    request = json.load(sys.stdin)
    voice = request.get("voice", "id-ID-GadisNeural")
    rate = request.get("rate", "+12%")
    segments = request["segments"]

    hasil = []
    # Sequential on purpose: Azure throttles bursts from one client, and a
    # throttled take is returned truncated rather than refused. A slower loop is
    # the difference between a clean take and a silently clipped one.
    for s in segments:
        hasil.append(await satu(voice, rate, s))
        print(f"dubbing {s['index'] + 1}/{len(segments)}", file=sys.stderr, flush=True)

    print(json.dumps({"ok": True, "voice": voice, "rate": rate, "segments": hasil}))


try:
    asyncio.run(main())
except Exception as exc:  # noqa: BLE001 - the message is the product here
    print(json.dumps({"ok": False, "error": "gagal", "message": str(exc)}))
