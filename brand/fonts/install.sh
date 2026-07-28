#!/usr/bin/env bash
# Fetch the two open-licence Nomukita fonts and install them for local rendering.
# All Round Gothic (display) is commercial and must be supplied separately.
set -euo pipefail

BASE=https://raw.githubusercontent.com/google/fonts/main
DEST=${1:-/usr/local/share/fonts/nomukita}

mkdir -p "$DEST"
curl -sSL --fail -o "$DEST/Comfortaa.ttf" "$BASE/ofl/comfortaa/Comfortaa%5Bwght%5D.ttf"
curl -sSL --fail -o "$DEST/ShipporiMincho-Regular.ttf" "$BASE/ofl/shipporimincho/ShipporiMincho-Regular.ttf"
curl -sSL --fail -o "$DEST/OFL.txt" "$BASE/ofl/comfortaa/OFL.txt"

command -v fc-cache >/dev/null && fc-cache -f "$DEST" >/dev/null
echo "Installed to $DEST:"
fc-list 2>/dev/null | grep -iE 'comfortaa|shippori' | sed 's/^.*: //' | sort -u || ls -1 "$DEST"
