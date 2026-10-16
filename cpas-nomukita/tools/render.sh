#!/usr/bin/env bash
# Pakai: ./render.sh input_9x16.mp4 output_1x1.mp4 [frame_bg.png]
# Menaruh video 9:16 di sisi kiri frame krem 1080x1080 (logo di kanan), seperti format CPAS Puresia.
set -euo pipefail
IN="$1"; OUT="$2"; BG="${3:-$(dirname "$0")/frame_bg_1080.png}"
ffmpeg -y -loop 1 -i "$BG" -i "$IN" \
  -filter_complex "[1:v]scale=456:810:flags=lanczos,setsar=1[v];[0:v][v]overlay=46:135:shortest=1,format=yuv420p[o]" \
  -map "[o]" -map 1:a? -c:v libx264 -preset slow -crf 18 -profile:v high -r 30 \
  -c:a aac -b:a 160k -movflags +faststart "$OUT"
