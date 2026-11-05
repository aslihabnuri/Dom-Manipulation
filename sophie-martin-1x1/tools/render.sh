#!/bin/bash
# Render video ke format 1:1 (1080x1080) dengan frame Sophie Martin
# (diambil dari "SM ADS_7 SEPT.mp4": panel 9:16 di x=43,y=54, 548x972 + tape pink + logo).
# usage: tools/render.sh <src.mp4> <out.mp4> <mode>
#   mode cover : video portrait -> isi penuh panel (crop tengah)
#   mode jezz1 : video split-screen 4:3 (Jezz Bag 1) -> video kiri di atas, strip teks di bawah
set -e
OV="$(dirname "$0")/frame_overlay.png"
case "$3" in
  cover) P="[0:v]fps=30,scale=548:972:force_original_aspect_ratio=increase:flags=lanczos,crop=548:972,setsar=1[p]";;
  jezz1) P="[0:v]fps=30,split[a][b];[a]crop=476:646:0:37,scale=548:744:flags=lanczos,setsar=1[top];[b]crop=470:196:490:207,scale=548:228:flags=lanczos,setsar=1[bot];[top][bot]vstack[p]";;
  *) echo "mode harus cover atau jezz1"; exit 1;;
esac
ffmpeg -v error -y -i "$1" -loop 1 -i "$OV" -filter_complex \
 "$P;[p]pad=1080:1080:43:54:color=0xFEFEE7[bg];[bg][1:v]overlay=0:0:shortest=1:format=auto,format=yuv420p[v]" \
 -map "[v]" -map 0:a? -c:v libx264 -preset slow -crf 18 -profile:v high -r 30 \
 -c:a aac -b:a 192k -ar 44100 -movflags +faststart -shortest "$2"
