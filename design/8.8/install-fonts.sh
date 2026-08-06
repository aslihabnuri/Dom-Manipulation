#!/usr/bin/env bash
# Installs the nomukita brand fonts for rendering. The font files are NOT in
# this repo: All Round Gothic ships as a Fontspring DEMO and is licensed per
# seat, so it must not be redistributed. Both zips live in Drive under
# "Nomukita/" — download them next to this script before running.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
dest="$HOME/.fonts/nomukita"
mkdir -p "$dest" "$here/fonts"

for z in "All Round Gothic.zip" "Comforta.zip"; do
  [ -f "$here/fonts/$z" ] || { echo "missing: design/8.8/fonts/$z (get it from Drive)"; exit 1; }
  unzip -o -q "$here/fonts/$z" -d "$here/fonts/extracted"
done

find "$here/fonts/extracted" -type f \( -name '*.otf' -o -name '*.ttf' \) -exec cp {} "$dest/" \;

# Shippori Mincho (kanji) is an open font and can be fetched directly.
curl -sSL -o "$dest/ShipporiMincho-Regular.ttf" \
  https://raw.githubusercontent.com/google/fonts/main/ofl/shipporimincho/ShipporiMincho-Regular.ttf

fc-cache -f
fc-list : family | tr ',' '\n' | grep -iE "round gothic|comfortaa|shippori" | sort -u
