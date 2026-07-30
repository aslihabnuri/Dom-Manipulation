#!/usr/bin/env python3
"""Check a video against Shopee's shop-video rules, and conform it if it fails.

Shopee's stated limits (non-YouTube video):
    size       max 30 MB
    resolution max 1280 x 1280 px
    duration   10 - 60 seconds
    file type  MP4

The resolution line is the one that catches people. It means NEITHER SIDE may
exceed 1280 — not "max 1280x1280 of area", and not "must be square". A 1920x1080
web hero fails on width alone, even though its height is well inside the limit.

The duration line has two ends. Everyone checks the 60 second ceiling; the 10
second FLOOR rejects the short seamless loops websites use for hero backgrounds.

"MP4" is the container. In practice the codec has to be H.264 with AAC audio: an
HEVC or ProRes stream in an .mp4 wrapper is still a .mp4 and still gets refused.
Some upload paths also reject a file with no audio track at all, which silent
hero footage usually is.

Usage:
    python3 tools/shopee_video.py check  IN.mp4
    python3 tools/shopee_video.py fix    IN.mp4 OUT.mp4 [--trim START END]
"""
import json
import os
import subprocess
import sys

import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
FFPROBE = FFMPEG.replace("ffmpeg-", "ffprobe-")

MAX_BYTES = 30 * 1024 * 1024
MAX_SIDE = 1280
MIN_SECS, MAX_SECS = 10.0, 60.0


def probe(path):
    """Read the stream facts. Falls back to ffmpeg's own report when the static
    build ships without a matching ffprobe."""
    if os.path.exists(FFPROBE):
        out = subprocess.run(
            [FFPROBE, "-v", "error", "-show_streams", "-show_format",
             "-of", "json", path], capture_output=True, text=True).stdout
        data = json.loads(out)
        v = next((s for s in data["streams"] if s["codec_type"] == "video"), None)
        a = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
        return dict(width=int(v["width"]), height=int(v["height"]),
                    vcodec=v["codec_name"], acodec=a["codec_name"] if a else None,
                    duration=float(data["format"]["duration"]),
                    brand=data["format"].get("tags", {}).get("major_brand", "?"),
                    size=int(data["format"]["size"]))

    err = subprocess.run([FFMPEG, "-hide_banner", "-i", path],
                         capture_output=True, text=True).stderr
    import re
    v = re.search(r"Stream #\d+:\d+.*Video: (\w+).*?, (\d+)x(\d+)", err, re.S)
    a = re.search(r"Stream #\d+:\d+.*Audio: (\w+)", err)
    dur = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    brand = re.search(r"major_brand\s*:\s*(\S+)", err)
    h, m, s = (dur.group(1), dur.group(2), dur.group(3)) if dur else (0, 0, 0)
    return dict(width=int(v.group(2)), height=int(v.group(3)), vcodec=v.group(1),
                acodec=a.group(1) if a else None,
                duration=int(h) * 3600 + int(m) * 60 + float(s),
                brand=brand.group(1) if brand else "?",
                size=os.path.getsize(path))


def end_frame_flatness(path, duration):
    """Standard deviation of the final frame's luminance. Near zero means the clip
    ends on a flat field (a fade to black or white), which is safe to hold."""
    import tempfile
    from PIL import Image
    import numpy as np
    with tempfile.TemporaryDirectory() as td:
        shot = os.path.join(td, "end.png")
        subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
                        "-ss", f"{max(0, duration - 0.08):.3f}", "-i", path,
                        "-frames:v", "1", shot], capture_output=True)
        if not os.path.exists(shot):
            return 999.0                        # unreadable: fall back to looping
        return float(np.asarray(Image.open(shot).convert("L")).std())


def check(path):
    p = probe(path)
    mb = p["size"] / 1024 / 1024
    rows = [
        ("Ukuran berkas", f"{mb:.1f} MB", p["size"] <= MAX_BYTES, "maks. 30 MB"),
        ("Resolusi", f"{p['width']} x {p['height']} px",
         p["width"] <= MAX_SIDE and p["height"] <= MAX_SIDE,
         f"tiap sisi maks. {MAX_SIDE} px"),
        ("Durasi", f"{p['duration']:.1f} detik",
         MIN_SECS <= p["duration"] <= MAX_SECS, "10 sampai 60 detik"),
        # Read major_brand, NOT ffmpeg's format_name. format_name for anything in
        # this family is the shared demuxer list "mov,mp4,m4a,3gp,3g2,mj2", which
        # contains the substring "mp4" for every file it opens — so testing it could
        # never fail, and it passed a QuickTime file branded `qt  ` as valid MP4.
        ("Container", f"brand '{p['brand'].strip()}'",
         p["brand"].strip() in ("mp42", "mp41", "isom", "iso2", "avc1", "M4V", "dash"),
         "MP4 (brand isom/mp42), bukan QuickTime"),
        ("Codec video", p["vcodec"], p["vcodec"] in ("h264", "avc1"),
         "H.264 (yang diterima Shopee)"),
        ("Trek audio", p["acodec"] or "tidak ada", p["acodec"] is not None,
         "ada, AAC"),
    ]
    print(f"\n  {os.path.basename(path)}\n")
    for name, got, ok, want in rows:
        print(f"  {'OK' if ok else 'GAGAL':<5}  {name:<14} {got:<22} ({want})")
    bad = [r[0] for r in rows if not r[2]]
    print(f"\n  {'Semua syarat lolos.' if not bad else 'Gagal di: ' + ', '.join(bad)}\n")
    return p, bad


def fix(src, dst, trim=None):
    p, _ = check(src)

    # Input options, output options and the duration are kept in separate lists on
    # purpose. ffmpeg reads -t as an option on whatever comes NEXT, so a -t written
    # between the video input and the silent-audio input silently becomes a limit on
    # the AUDIO, leaving the video its full length. That is exactly what happened
    # first time: the run reported trimming to 12 s and wrote a 14 s file. Duration
    # belongs with the output.
    pre, dur, pad = [], [], ""

    # Under the 10 second floor there are two ways to buy seconds, and which one is
    # right depends on how the clip ENDS — so measure it rather than assume.
    #
    # If the last frame is essentially flat, the film fades out, and holding that
    # frame is invisible: the viewer sees the film once, then it rests. If the last
    # frame is busy, a freeze reads as a stall, so the clip loops instead.
    #
    # Looping was the only branch at first, and on this footage it was the wrong
    # call: the hero fades to black at 9.5 s, so doubling it made the viewer watch
    # the entire film twice to cover a half-second shortfall.
    if p["duration"] < MIN_SECS and not trim:
        flat = end_frame_flatness(src, p["duration"])
        target = MIN_SECS + 1.0                # 1 s of margin against rounding at 10.0
        if flat < 14:
            pad = f"tpad=stop_mode=clone:stop_duration={round(target - p['duration'], 2)},"
            dur = ["-t", str(target)]
            print(f"  durasi {p['duration']:.1f}s di bawah batas bawah. Frame "
                  f"terakhir rata (sebaran {flat:.1f}) jadi videonya memudar ke "
                  f"gelap — frame itu ditahan sampai {target:.0f}s, bukan diulang.")
        else:
            reps = int(MIN_SECS // p["duration"]) + 1
            target = round(p["duration"] * (reps + 1), 2)
            while target - p["duration"] >= MIN_SECS:   # no more loops than needed
                reps -= 1
                target = round(p["duration"] * (reps + 1), 2)
            pre += ["-stream_loop", str(reps)]
            dur = ["-t", str(target)]
            print(f"  durasi {p['duration']:.1f}s di bawah batas bawah. Frame "
                  f"terakhir masih berisi (sebaran {flat:.1f}) jadi menahannya akan "
                  f"terlihat macet — diputar {reps + 1}x jadi {target:.1f}s.")
    elif trim:
        pre += ["-ss", str(trim[0])]
        dur = ["-t", str(round(float(trim[1]) - float(trim[0]), 2))]
    elif p["duration"] > MAX_SECS:
        raise SystemExit(
            f"\n  Durasi {p['duration']:.1f}s melewati batas 60s. Memotong sendiri "
            "berarti saya yang memilih bagian mana yang dibuang, dan itu keputusan "
            "Anda: jalankan ulang dengan --trim MULAI SELESAI (detik).\n")

    silent = p["acodec"] is None
    if silent:
        print("  tidak ada trek audio — ditambahkan trek senyap")

    def build(crf):
        a = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error"]
        a += pre + ["-i", src]
        if silent:
            a += ["-f", "lavfi", "-i",
                  "anullsrc=channel_layout=stereo:sample_rate=44100"]
        # The target box is min(1280, source), not a flat 1280. force_original_-
        # aspect_ratio=decrease shrinks the REQUESTED box to preserve aspect; it does
        # not stop ffmpeg enlarging the source to fill it. Asking for a flat 1280 box
        # upscaled a 640x360 clip to 1280x720 — spending bitrate to add no detail and
        # softening the picture. Clamping the request to the source size first means a
        # video already inside the limit passes through untouched.
        # force_divisible_by keeps both sides even, which H.264 yuv420p requires.
        a += ["-vf", pad + f"scale='min({MAX_SIDE},iw)':'min({MAX_SIDE},ih)'"
                     ":force_original_aspect_ratio=decrease:force_divisible_by=2",
              "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
              "-crf", str(crf), "-preset", "slow",
              "-c:a", "aac", "-b:a", "128k",
              "-movflags", "+faststart"]     # first frame plays before full download
        a += dur                             # output option, after every input
        if silent:
            a += ["-shortest"]
        return a + [dst]

    # Start at high quality and only compress harder if the 30 MB cap is breached.
    # crf 23 came out at 2.8 MB against a 30 MB allowance — throwing away detail
    # with nine tenths of the budget unspent, on footage whose whole job is showing
    # fabric. The cap is the constraint; quality should run up to it, not sit far
    # below it.
    crf = 18
    while True:
        r = subprocess.run(build(crf), capture_output=True, text=True)
        if r.returncode:
            raise SystemExit(r.stderr[-2500:])
        if os.path.getsize(dst) <= MAX_BYTES or crf >= 34:
            break
        crf += 3
        print(f"  {os.path.getsize(dst)/1024/1024:.1f} MB masih di atas 30 MB — "
              f"ulangi dengan crf {crf}")

    print("  hasil:")
    _, bad = check(dst)
    if bad:
        raise SystemExit(f"  konversi belum memenuhi: {bad}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    if sys.argv[1] == "check":
        check(sys.argv[2])
    else:
        t = None
        if "--trim" in sys.argv:
            i = sys.argv.index("--trim")
            t = (sys.argv[i + 1], sys.argv[i + 2])
        fix(sys.argv[2], sys.argv[3], t)
