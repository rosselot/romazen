#!/bin/sh
set -eu

output_dir="public/assets/images/optimized"
mkdir -p "$output_dir"

find public/assets/images -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0 |
while IFS= read -r -d '' source; do
  name=$(basename "$source")
  base=${name%.*}
  width=$(sips -g pixelWidth "$source" | awk '/pixelWidth/ {print $2}')

  cwebp -quiet -q 78 -mt "$source" -o "$output_dir/$base.webp"
  avifenc -q 58 -s 7 -j all "$source" "$output_dir/$base.avif" >/dev/null

  if [ "$width" -gt 480 ]; then
    height=$(sips -g pixelHeight "$source" | awk '/pixelHeight/ {print $2}')
    small_height=$((height * 480 / width))
    cwebp -quiet -q 76 -mt -resize 480 "$small_height" "$source" -o "$output_dir/$base-480.webp"
    tmp_file=$(mktemp -t "romazen-${base}.XXXXXX.png")
    sips -s format png --resampleWidth 480 "$source" --out "$tmp_file" >/dev/null
    avifenc -q 55 -s 7 -j all "$tmp_file" "$output_dir/$base-480.avif" >/dev/null
    rm "$tmp_file"
  else
    cp "$output_dir/$base.webp" "$output_dir/$base-480.webp"
    cp "$output_dir/$base.avif" "$output_dir/$base-480.avif"
  fi
done
