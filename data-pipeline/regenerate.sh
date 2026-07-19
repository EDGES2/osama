#!/bin/bash
# Перегенерувати js/data.js з original_menu.txt / exact_filenames.txt.
# Запускати з цієї папки (data-pipeline/).
set -e
python3 parse.py                 # original_menu.txt + exact_filenames.txt -> rolls_parsed.json
python3 create_data.py           # rolls_parsed.json -> rolls_clean.json (+ idx_to_id.json)
python3 parse_sets.py            # original_menu.txt + exact_filenames.txt + rolls_clean.json -> sets_clean.json
python3 build_data_js.py         # rolls_clean.json + sets_clean.json -> data.js
cp data.js ../js/data.js
echo "Готово: ../js/data.js оновлено."
