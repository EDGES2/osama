#!/bin/bash
# Перегенерувати js/data.js з original_menu.txt / exact_filenames.txt
# (+ опційні companion .txt файли з довгими описами поруч із картинками).
#
# Запускати з цієї папки (data-pipeline/).
#
# Використання:
#   ./regenerate.sh                 # dry-run перейменування картинок (нічого не чіпає на диску)
#   ./regenerate.sh --apply-rename  # реально перейменовує картинки в ../images на r001.webp/s001.webp/...
#
# За замовчуванням картинки (і companion .txt файли з довгими описами)
# шукаються в ../images. Якщо в тебе інша структура -- поправ IMAGES_DIR.
set -e
IMAGES_DIR="../images"
APPLY_RENAME=""
if [ "$1" == "--apply-rename" ]; then
  APPLY_RENAME="--apply"
fi

python3 parse_source.py --images-dir "$IMAGES_DIR"     # original_menu.txt + exact_filenames.txt (+ companion .txt) -> rolls_parsed.json, sets_raw.json
python3 build_rolls.py                                 # rolls_parsed.json -> rolls_clean.json (+ idx_to_id.json)
python3 build_sets.py                                  # sets_raw.json + rolls_clean.json -> sets_clean.json
python3 rename_images.py --source-dir "$IMAGES_DIR" $APPLY_RENAME   # перейменування картинок на r001.webp/s001.webp/...
python3 build_data_js.py                               # rolls_clean.json + sets_clean.json -> data.js
cp data.js ../js/data.js

if [ -z "$APPLY_RENAME" ]; then
  echo
  echo "УВАГА: картинки НЕ перейменовано (був dry-run). Якщо план вище виглядає"
  echo "правильно -- запусти ще раз: ./regenerate.sh --apply-rename"
fi
echo "Готово: ../js/data.js оновлено."
