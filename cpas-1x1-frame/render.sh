#!/usr/bin/env bash
# Usage: render.sh FRAME_DIR SOURCE_VIDEO OUTPUT_MP4
# Composites: bg.png (static) -> source video scaled into the card -> tapes.png (static)
set -euo pipefail
frame_dir=$1 src=$2 out=$3
read -r cx cy cw ch < <(python3 -I -c "import json,sys;c=json.load(open(sys.argv[1]));print(c['x'],c['y'],c['w'],c['h'])" "$frame_dir/card.json")

ffmpeg -v error -stats -y \
  -loop 1 -framerate 30 -i "$frame_dir/bg.png" \
  -i "$src" \
  -loop 1 -framerate 30 -i "$frame_dir/tapes.png" \
  -filter_complex "
    [1:v]fps=30,scale=${cw}:${ch}:flags=lanczos:in_color_matrix=bt709:in_range=tv,format=gbrp,setsar=1[vid];
    [0:v]format=gbrp[bg];
    [2:v]format=gbrap[tp];
    [bg][vid]overlay=${cx}:${cy}:shortest=1:format=gbrp[b1];
    [b1][tp]overlay=0:0:shortest=1:format=gbrp[b2];
    [b2]scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setsar=1[out]" \
  -map "[out]" -map "1:a?" \
  -c:v libx264 -preset slow -crf 18 -profile:v high -level:v 4.0 -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -r 30 -g 60 \
  -c:a copy \
  -movflags +faststart -shortest \
  "$out"
