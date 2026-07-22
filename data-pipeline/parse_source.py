# -*- coding: utf-8 -*-
"""
Крок 1 нового пайплайну.

Читає ДВА паралельні файли:
  - original_menu.txt    -- "людський" опис кожної позиції (назва, вага,
                             к-сть шт, склад), рядок в рядок відповідає...
  - exact_filenames.txt  -- ...реальному імені файлу картинки на диску.

НОВЕ: якщо опис позиції занадто довгий, щоб влізти в один рядок/ім'я
файлу (як було з "Zestaw Tokio"), можна:
  1. лишити в original_menu.txt лише "заглушку" -- назву без ваги/складу
     (як зараз і зроблено для Tokio), і
  2. покласти поруч із картинкою в images/ файл із ТАКОЮ Ж базовою назвою,
     але розширенням .txt, що містить повний опис у тому самому форматі,
     що й звичайний рядок original_menu.txt, напр.:

       images/Zestaw_Tokio_-_Najczęściej_wybierane.webp
       images/Zestaw_Tokio_-_Najczęściej_wybierane.txt   <- повний опис тут

Пайплайн сам знаходить такий .txt і використовує його ЗАМІСТЬ рядка з
original_menu.txt -- жодних хардкод-констант у коді більше не потрібно.

Вихід:
  rolls_parsed.json  -- окремі роли (структуровано: назва/вага/к-сть/склад)
  sets_raw.json       -- сети (структуровано: назва/вага/к-сть/"rest" --
                          нерозібраний текст компонентів, розбір компонентів
                          робить build_sets.py)

Також тут відбувається ВСЯ чистка тексту (емодзі, кириличні гомогліфи,
зайві пробіли) -- одноразово, для обох типів позицій.

НОВЕ: грамовка/к-сть окремого інгредієнта. У списку складу ролі можна
(не обов'язково -- за замовчуванням, як і завжди, нічого не пишеться,
і в даних буде null) дописати в дужках одразу після назви інгредієнта:

    ryż (140g), krewetki nobashi (48g x3), tobiko (10g)

а десь у тому самому списку (будь-де, як ще один пункт через кому)
дописати ЗАГАЛЬНУ, реально зважену вагу готової роли (це ІНША цифра,
ніж "WEIGHT g" в заголовку рядка -- та лишається просто орієнтовною
позначкою з меню, як і завжди):

    waga: 465g

Повний приклад рядка (все, крім дужок і "waga:", виглядає так само,
як завжди):

    Burger z surimi 385 g nori (2g), ryż (140g), serek philadelphia (35g),
    awokado (30g), surimi (40g), majonez japonski (15g), łosoś surowy (30g),
    panko (30g), tempura (50g), sos unagi (15g), waga: 385g.webp
"""
import argparse
import json
import os
import re

from textutils import clean_text, clean_inline, split_ext, strip_trailing_known_ext

SET_PREFIX_RE = re.compile(r'^(zestaw|classic salmon set)\b', re.IGNORECASE)

ROLL_META_RE = re.compile(
    r'^(?:\((?P<paren_count>\d+)\s*szt\)\s*)?'
    r'(?P<weight>\d+)\s*(?:gr|g)\.?,?\s*'
    r'(?::\s*(?P<count>\d+)\s*szt\s*:?\s*)?'
    r'(?P<rest>.*)$'
)

SET_HEADER_RE = re.compile(
    r'^(?P<name>.*?)\s+(?P<weight>\d+)\s*g\.?\s*'
    r'(?:[:,]\s*(?P<count>\d+)\s*szt\s*)?'
    r'[:,]?\s*(?P<rest>.*)$'
)

PROMO_PATTERNS = [
    re.compile(r'\s*Najlepiej smakuje z .*$', re.IGNORECASE),
    re.compile(r'\s*GRATIS.*$', re.IGNORECASE),
]

# --- Грамовка/к-сть окремого інгредієнта -----------------------------------
# Опційна приписка в дужках одразу після назви інгредієнта в списку складу:
#   "ryż (140g)"          -> {"name": "Ryż", "grams": 140, "qty": null}
#   "krewetki (48g x3)"   -> {"name": "Krewetki", "grams": 48, "qty": 3}
#   "ryż"                 -> {"name": "Ryż", "grams": null, "qty": null}  (як і зараз, без змін)
# "grams" -- вага ЦІЄЇ порції інгредієнта в ролі (не за штуку), "qty" --
# скільки штук ця вага означає (3 креветки, 2 шматки сиру, ...).
INGREDIENT_META_RE = re.compile(
    r'^(?P<base>.*?)\s*'
    r'\(\s*(?:(?P<grams>\d+)\s*g)?\s*(?:[x×]\s*(?P<qty>\d+))?\s*\)\s*$',
    re.IGNORECASE
)

# --- Загальна вага готової роли (реальне зважування, окремо від "WEIGHT g"
# у заголовку рядка, яка лишається просто орієнтовною позначкою з меню) --
# спеціальний "псевдо-інгредієнт" будь-де у списку складу:
#   "waga: 465g" / "waga 465g" / "waga=465g" / "Waga: 465 g"
WAGA_TOKEN_RE = re.compile(r'^waga\s*[:=]?\s*(?P<grams>\d+)\s*g\.?$', re.IGNORECASE)


def parse_ingredient_token(token):
    """Розбирає один інгредієнт зі списку складу на (назва, grams, qty)."""
    m = INGREDIENT_META_RE.match(token)
    if m and (m.group('grams') or m.group('qty')) and m.group('base').strip():
        base = m.group('base').strip()
        grams = int(m.group('grams')) if m.group('grams') else None
        qty = int(m.group('qty')) if m.group('qty') else None
        return base, grams, qty
    return token, None, None


def read_lines(path):
    with open(path, encoding='utf-8') as f:
        return [l.rstrip('\n') for l in f if l.strip()]


def find_companion_text(images_dir, base_name):
    """Шукає <images_dir>/<base_name>.txt -- повний опис позиції, коли він
    задовгий для імені файлу картинки. Повертає текст або None."""
    if not images_dir:
        return None
    candidate = os.path.join(images_dir, base_name + '.txt')
    if os.path.isfile(candidate):
        with open(candidate, encoding='utf-8-sig') as f:
            lines = [l.strip() for l in f if l.strip()]
        return ' '.join(lines)
    return None


def parse_roll(core, idx):
    m = re.search(r'\(?\d', core)
    if not m:
        print("NO DIGIT:", core)
        return None
    name = clean_text(core[:m.start()])
    meta_part = core[m.start():]
    mm = ROLL_META_RE.match(meta_part)
    if not mm:
        print("META NO MATCH:", repr(meta_part), "| line:", core)
        return None
    weight = mm.group('weight')
    count = mm.group('count') or mm.group('paren_count') or '1'
    rest = mm.group('rest').strip(' ,.')
    for pat in PROMO_PATTERNS:
        rest = pat.sub('', rest).strip(' ,.')
    raw_tokens = [clean_inline(i) for i in rest.split(',')]
    raw_tokens = [i.strip(' .') for i in raw_tokens if i.strip(' .')]

    weight_grams = None
    ingredients = []
    for tok in raw_tokens:
        wm = WAGA_TOKEN_RE.match(tok)
        if wm:
            weight_grams = int(wm.group('grams'))
            continue
        base, grams, qty = parse_ingredient_token(tok)
        ingredients.append({'name': base, 'grams': grams, 'qty': qty})

    return {
        'idx': idx,
        'name': name,
        'weight_g': int(weight),
        'count': int(count),
        'ingredients': ingredients,
        'weightGrams': weight_grams,
    }


def parse_set_header(core, idx):
    m = SET_HEADER_RE.match(core)
    if not m:
        print("SET NO MATCH:", core)
        return None
    return {
        'idx': idx,
        'name': clean_text(m.group('name')),
        'weight_g': int(m.group('weight')),
        'count': int(m.group('count')) if m.group('count') else None,
        'rest': clean_inline(m.group('rest')).strip(' ,.'),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--menu', default='original_menu.txt')
    ap.add_argument('--filenames', default='exact_filenames.txt')
    ap.add_argument('--images-dir', default='../images',
                     help='Тека з картинками, де також шукати companion .txt '
                          'файли з довгим описом (за замовч. ../images)')
    ap.add_argument('--out-rolls', default='rolls_parsed.json')
    ap.add_argument('--out-sets', default='sets_raw.json')
    ap.add_argument('--allow-errors', action='store_true',
                     help='Не зупинятись, навіть якщо якісь рядки не розпарсились '
                          '(вони будуть тихо пропущені, як раніше). Небезпечно для '
                          'повторних прогонів -- лишає позиції поза rolls_clean.json/'
                          'sets_clean.json.')
    args = ap.parse_args()

    orig = read_lines(args.menu)
    files = read_lines(args.filenames)
    assert len(orig) == len(files), (
        f"original_menu.txt ({len(orig)} рядків) і exact_filenames.txt "
        f"({len(files)} рядків) розійшлись -- перевір відповідність рядок-в-рядок"
    )

    rolls, sets_raw = [], []
    txt_overrides = 0
    errors = 0

    for idx, (line, fname) in enumerate(zip(orig, files)):
        base, ext = split_ext(fname)
        source_image = base + ext

        override = find_companion_text(args.images_dir, base)
        if override is not None:
            txt_overrides += 1
            print(f"TXT OVERRIDE: рядок {idx} ('{base}') -- опис узято з "
                  f"{base}.txt замість original_menu.txt")
            raw_text = override
        else:
            raw_text = strip_trailing_known_ext(line)

        core = clean_text(raw_text)
        if not core:
            print("EMPTY LINE:", idx, fname)
            errors += 1
            continue

        if SET_PREFIX_RE.match(core):
            parsed = parse_set_header(core, idx)
            if parsed:
                parsed['source_image'] = source_image
                sets_raw.append(parsed)
            else:
                errors += 1
        else:
            parsed = parse_roll(core, idx)
            if parsed:
                parsed['source_image'] = source_image
                rolls.append(parsed)
            else:
                errors += 1

    with open(args.out_rolls, 'w', encoding='utf-8') as f:
        json.dump(rolls, f, ensure_ascii=False, indent=2)
    with open(args.out_sets, 'w', encoding='utf-8') as f:
        json.dump(sets_raw, f, ensure_ascii=False, indent=2)

    print(f"\nПозицій: {len(rolls)} ролів, {len(sets_raw)} сетів "
          f"({txt_overrides} із окремого .txt-файлу).")

    if errors and not args.allow_errors:
        print(f"\nПОМИЛКА: {errors} рядок(ів) НЕ розпарсились (див. NO DIGIT / "
              f"META NO MATCH / SET NO MATCH / EMPTY LINE вище) і були б тихо "
              f"пропущені. Зупиняюсь, щоб не перейменувати картинки з неповними "
              f"даними -- виправ рядок(и) і запусти знову (або, якщо це свідомо, "
              f"додай --allow-errors).")
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
