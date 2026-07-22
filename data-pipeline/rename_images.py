# -*- coding: utf-8 -*-
"""
Крок 4. Перейменовує реальні файли картинок на диску з довгих описових
імен (напр. "Awokado_roll_z_krewetką_295_g_....webp") на короткі канонічні
імена, що збігаються з id позиції в data.js: r001.webp, r002.webp, ...
для ROLLS і s001.webp, s002.webp, ... для SETS. Розширення (.webp/.jpg/...)
береться з реального файлу-джерела, а не вгадується.

Також (якщо існує) перейменовує "компаньйон"-файл з довгим описом
(<стара_назва>.txt) на <нове_ім'я>.txt -- щоб опис лишався поруч із
картинкою і після перейменування.

Після успішного перейменування:
  - ОНОВЛЮЄ поле "image" у rolls_clean.json / sets_clean.json на
    канонічний шлях (напр. "images/r001.webp");
  - СИНХРОНІЗУЄ exact_filenames.txt: замінює старі довгі імена на нові
    канонічні. Це критично для повторних прогонів -- без цього
    exact_filenames.txt і далі вказував би на вже неіснуючі (перейменовані)
    файли, і другий прогін пайплайну не знайшов би жодної старої картинки.
    Завдяки цій синхронізації повторний прогін для вже перейменованих
    позицій просто нічого не робить (джерело й ціль -- один і той самий
    файл), а реально щось перейменовує лише для НОВИХ рядків, дописаних
    в кінець original_menu.txt/exact_filenames.txt.

За замовчуванням працює в режимі --dry-run (нічого не чіпає на диску,
лише показує план) -- щоб застосувати реально, додай --apply.
"""
import argparse
import json
import os
import shutil


def load(path):
    return json.load(open(path, encoding='utf-8'))


def save(path, data):
    json.dump(data, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)


def plan_for(items, source_dir):
    """Формує список (item_dict, src_path, dst_filename, companion_src_or_None)."""
    plan = []
    for it in items:
        src_name = it['source_image']
        ext = os.path.splitext(src_name)[1] or '.webp'
        dst_filename = it['id'] + ext
        src_path = os.path.join(source_dir, src_name)
        companion_src = os.path.join(source_dir, os.path.splitext(src_name)[0] + '.txt')
        if not os.path.isfile(companion_src):
            companion_src = None
        plan.append((it, src_path, dst_filename, companion_src))
    return plan


def sync_exact_filenames(path, rolls, sets_):
    """Переписує exact_filenames.txt: для кожного рядка (за orig. idx)
    підставляє актуальне канонічне ім'я файлу. Пише лише якщо ВСІ позиції
    з початкового файлу знайдені (немає "дірок" через помилки парсингу) --
    інакше безпечніше нічого не чіпати і попередити."""
    if not os.path.isfile(path):
        print(f"  (пропускаю синхронізацію {path} -- файл не знайдено)")
        return
    old_lines = [l.rstrip('\n') for l in open(path, encoding='utf-8') if l.strip()]

    by_idx = {}
    for it in rolls + sets_:
        by_idx[it['idx']] = it['id'] + os.path.splitext(it['source_image'])[1]

    if set(by_idx.keys()) != set(range(len(old_lines))):
        print(f"  УВАГА: {path} НЕ синхронізовано -- кількість/індекси позицій "
              f"у rolls_clean.json+sets_clean.json ({len(by_idx)}) не збігаються "
              f"з кількістю рядків у файлі ({len(old_lines)}). Перевір вручну.")
        return

    new_lines = [by_idx[i] for i in range(len(old_lines))]
    if new_lines == old_lines:
        print(f"  {path}: вже синхронізовано, змін немає.")
        return

    backup_path = path + '.bak'
    shutil.copy2(path, backup_path)
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines) + '\n')
    changed = sum(1 for a, b in zip(old_lines, new_lines) if a != b)
    print(f"  {path}: оновлено ({changed} рядок(ів) замінено на канонічні імена; "
          f"резервна копія -- {backup_path}).")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--rolls', default='rolls_clean.json')
    ap.add_argument('--sets', default='sets_clean.json')
    ap.add_argument('--source-dir', default='../images',
                     help='Тека, де зараз реально лежать картинки (старі, довгі імена)')
    ap.add_argument('--dest-dir', default=None,
                     help='Куди класти перейменовані картинки (за замовч. = --source-dir, тобто перейменування на місці)')
    ap.add_argument('--mode', choices=['move', 'copy'], default='move')
    ap.add_argument('--apply', action='store_true',
                     help='Реально виконати перейменування/копіювання і зберегти оновлені *_clean.json. '
                          'Без цього прапорця -- лише показує план (dry-run).')
    ap.add_argument('--skip-missing', action='store_true',
                     help='Не переривати виконання, якщо якийсь файл-джерело не знайдено -- '
                          'просто лишити його зі старим image-шляхом і попередити.')
    ap.add_argument('--filenames', default='exact_filenames.txt',
                     help='Шлях до exact_filenames.txt -- після --apply буде синхронізований '
                          'з реальними (канонічними) іменами файлів.')
    ap.add_argument('--no-sync-filenames', action='store_true',
                     help='Не чіпати exact_filenames.txt автоматично.')
    args = ap.parse_args()

    dest_dir = args.dest_dir or args.source_dir

    rolls = load(args.rolls)
    sets_ = load(args.sets)

    all_plan = plan_for(rolls, args.source_dir) + plan_for(sets_, args.source_dir)

    missing = [p for p in all_plan if not os.path.isfile(p[1])]
    if missing and not args.skip_missing:
        print(f"НЕ ЗНАЙДЕНО {len(missing)} файл(ів)-джерел у {args.source_dir!r}:")
        for it, src_path, dst_filename, _ in missing:
            print(f"  {it['id']}: очікував {src_path!r}")
        print("\nЖодних змін не внесено. Постав --skip-missing, якщо це очікувано "
              "(наприклад, тестуєш без реальних картинок), або поклади файли на місце.")
        return 1

    print(f"{'ЗАСТОСОВУЮ' if args.apply else 'ПЛАН (dry-run, додай --apply щоб виконати)'}:")
    os.makedirs(dest_dir, exist_ok=True)
    already_canonical = 0
    for it, src_path, dst_filename, companion_src in all_plan:
        dst_path = os.path.join(dest_dir, dst_filename)
        found = os.path.isfile(src_path)

        if found and os.path.abspath(src_path) == os.path.abspath(dst_path):
            # вже канонічне ім'я -- нічого фізично робити не треба, і не варто
            # захаращувати вивід рядком на кожну з давно перейменованих позицій
            already_canonical += 1
            if args.apply:
                it['image'] = 'images/' + dst_filename
            continue

        marker = '' if found else '  [ПРОПУЩЕНО: джерело не знайдено]'
        print(f"  {it['source_image']}  ->  {dst_filename}{marker}")
        if companion_src:
            comp_dst = os.path.join(dest_dir, os.path.splitext(dst_filename)[0] + '.txt')
            print(f"    (+ companion) {os.path.basename(companion_src)}  ->  {os.path.basename(comp_dst)}")

        if not found:
            continue

        if args.apply:
            op = shutil.move if args.mode == 'move' else shutil.copy2
            op(src_path, dst_path)
            if companion_src:
                comp_dst = os.path.join(dest_dir, os.path.splitext(dst_filename)[0] + '.txt')
                op(companion_src, comp_dst)
            it['image'] = 'images/' + dst_filename

    if already_canonical:
        print(f"  (+ ще {already_canonical} позицій(ї) вже мають канонічне ім'я -- пропущено)")

    if args.apply:
        save(args.rolls, rolls)
        save(args.sets, sets_)
        print(f"\nГотово. {args.mode} застосовано, {args.rolls} і {args.sets} оновлено "
              f"(поле 'image' тепер вказує на канонічні імена).")
        if not args.no_sync_filenames:
            sync_exact_filenames(args.filenames, rolls, sets_)
    else:
        print("\nЦе був dry-run -- диск і json НЕ змінені. Додай --apply, щоб виконати насправді.")

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
