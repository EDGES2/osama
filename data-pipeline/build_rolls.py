# -*- coding: utf-8 -*-
"""
Крок 2. rolls_parsed.json -> rolls_clean.json (+ idx_to_id.json).

Текст тут вже пройшов загальну чистку (parse_source.py), тому цей крок
відповідає лише за предметну (доменну) логіку:
  - нормалізацію капіталізації брендів у складі ("philadelphia" -> "Philadelphia"),
  - візуальні теги (для similarity.js),
  - needsSauce,
  - призначення id (r001, r002, ...) у порядку появи в джерелі.

`image` поки що вказує на ВИХІДНЕ ім'я файлу картинки (те, що реально
лежить на диску) -- канонічне ім'я (r001.webp) проставить rename_images.py
на наступному кроці.
"""
import argparse
import json
import re

CAP_FIX = {
    'philadelphia': 'Philadelphia', 'cheddar': 'Cheddar', 'gouda': 'Gouda',
    'pepsi': 'Pepsi', 'lipton': 'Lipton', '7up': '7UP', 'filadelphia': 'Philadelphia',
}


def fix_ingredient(s):
    s = re.sub(r'^\d+\s+', '', s)  # "10 krewetek..." -> "krewetek..."
    s = s.strip()
    low = s.lower()
    words = low.split(' ')
    out_words = []
    for w in words:
        wl = w.lower().strip('.,')
        replaced = None
        for k, v in CAP_FIX.items():
            if wl == k.lower():
                replaced = v
                break
        out_words.append(replaced if replaced else wl)
    result = ' '.join(out_words)
    if result:
        result = result[0].upper() + result[1:]
    return result


TAG_RULES = [
    (r'w[eę]dzon\w*.*losos\w*|losos\w*.*w[eę]dzon\w*', 'salmon_smoked'),
    (r'sma[zż]on\w*.*losos\w*|losos\w*.*sma[zż]on\w*', 'salmon_seared'),
    (r'grillowan\w*.*losos\w*|losos\w*.*grillowan\w*', 'salmon_grilled'),
    (r'opalan\w*.*losos\w*|losos\w*.*opalon\w*|opalony.*losos', 'salmon_torched'),
    (r'surow\w*.*losos\w*|losos\w*.*surow\w*|^losos\w*$', 'salmon_raw'),
    (r'sma[zż]on\w*.*tu[nń]czyk\w*|tu[nń]czyk\w*.*sma[zż]on\w*', 'tuna_seared'),
    (r'pieczon\w*.*tu[nń]czyk\w*|tu[nń]czyk\w*.*pieczon\w*', 'tuna_baked'),
    (r'surow\w*.*tu[nń]czyk\w*|tu[nń]czyk\w*.*surow\w*|^tu[nń]czyk\w*$', 'tuna_raw'),
    (r'w[eę]gorz', 'eel'),
    (r'krewet\w*.*tempur\w*', 'shrimp_tempura'),
    (r'krewet\w*', 'shrimp'),
    (r'tobik\w*|kawior', 'tobiko'),
    (r'awokado', 'avocado'),
    (r'mango', 'mango'),
    (r'og[oó]rek', 'cucumber'),
    (r'philadelphia|^serek$', 'cream_cheese'),
    (r'cheddar', 'cheddar_cheese'),
    (r'gouda', 'gouda_cheese'),
    (r'sezam czarny', 'black_sesame'),
    (r'sezam', 'white_sesame'),
    (r'surimi', 'surimi'),
    (r'tykwa', 'marinated_gourd'),
    (r'papier sojowy', 'soy_paper'),
    (r'tofu', 'tofu'),
    (r'sa[lł]ata', 'lettuce'),
    (r'^por$', 'leek'),
    (r'oshinko', 'pickled_radish'),
    (r'limonka', 'lime'),
]
SAUCE_HINT = re.compile(r'unagi|spicy|sriracha|majonez|mayo|sos sojow\w*|pieprz|cytryna', re.IGNORECASE)


def norm(s):
    s = s.lower()
    replacements = {
        'ł': 'l', 'ś': 's', 'ć': 'c', 'ń': 'n',
        'ó': 'o', 'ą': 'a', 'ę': 'e', 'ź': 'z', 'ż': 'z'
    }
    for pl, asc in replacements.items():
        s = s.replace(pl, asc)
    return s


def tags_for(ingredients):
    tags = []
    for ing in ingredients:
        low = norm(ing)
        if low in ('nori', 'ryz'):
            continue
        if SAUCE_HINT.search(low):
            continue
        for pat, tag in TAG_RULES:
            if re.search(pat, low):
                if tag not in tags:
                    tags.append(tag)
                break
    return tags


def has_sauce(ingredients):
    return any(SAUCE_HINT.search(i.lower()) and re.search(r'unagi|spicy|sriracha', i.lower())
               for i in ingredients)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--in-rolls', default='rolls_parsed.json')
    ap.add_argument('--out-rolls', default='rolls_clean.json')
    ap.add_argument('--out-idx', default='idx_to_id.json')
    args = ap.parse_args()

    rolls = json.load(open(args.in_rolls, encoding='utf-8'))

    idx_to_id = {}
    clean_rolls = []
    for i, r in enumerate(rolls):
        rid = f"r{i + 1:03d}"
        idx_to_id[r['idx']] = rid
        raw_names = [ing['name'] for ing in r['ingredients']]
        ingredients = [
            {'name': fix_ingredient(ing['name']), 'grams': ing['grams'], 'qty': ing['qty']}
            for ing in r['ingredients']
        ]
        clean_rolls.append({
            'id': rid,
            'type': 'roll',
            'name': r['name'],
            'count': r['count'],
            'weight_g': r['weight_g'],
            'ingredients': ingredients,
            'weightGrams': r.get('weightGrams'),
            'tags': tags_for(raw_names),
            'needsSauce': has_sauce(raw_names),
            'source_image': r['source_image'],
            'image': 'images/' + r['source_image'],
        })

    json.dump(idx_to_id, open(args.out_idx, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    json.dump(clean_rolls, open(args.out_rolls, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print("Rolls done:", len(clean_rolls))
    for r in clean_rolls:
        weighed = [f"{ing['name']}={ing['grams']}g" + (f"x{ing['qty']}" if ing['qty'] else '')
                   for ing in r['ingredients'] if ing['grams'] is not None]
        extra = f" | weighed: {', '.join(weighed)}" if weighed else ''
        wg = f" | weightGrams={r['weightGrams']}" if r['weightGrams'] is not None else ''
        print(r['id'], r['name'], '| tags:', r['tags'], '| sauce:', r['needsSauce'], wg + extra)


if __name__ == '__main__':
    main()
