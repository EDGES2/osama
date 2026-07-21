# -*- coding: utf-8 -*-
"""
Крок 5 (останній). rolls_clean.json + sets_clean.json -> data.js.

Запускати ПІСЛЯ rename_images.py --apply, щоб поле "image" уже вказувало
на канонічні короткі імена (images/r001.webp, images/s001.webp, ...).
"""
import argparse
import json

HEADER_COMMENT = """\
// Auto-generated menu data. Do not edit by hand -- regenerate from source files.
//
// Each roll's `ingredients` entry is { name, grams, qty }:
//   name  -- ingredient text, same strings used everywhere else (search,
//            groups, quiz captions, versus table rows) -- edit this and
//            everything downstream still works, nothing keys off it.
//   grams -- weight of that ingredient in the roll, or null if not weighed yet.
//   qty   -- piece count for that ingredient (e.g. 3 shrimp, 2 cheese slices),
//            or null when it is not counted in discrete pieces / not known.
// `weightGrams` on the roll itself is the total weight of the finished roll,
// taken straight from the source weighing rather than summed from the lines
// above (the two can differ by a gram or two from rounding). null until weighed.
"""


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--in-rolls', default='rolls_clean.json')
    ap.add_argument('--in-sets', default='sets_clean.json')
    ap.add_argument('--out', default='data.js')
    args = ap.parse_args()

    rolls = json.load(open(args.in_rolls, encoding='utf-8'))
    sets_ = json.load(open(args.in_sets, encoding='utf-8'))

    out_rolls = [{
        'id': r['id'],
        'name': r['name'],
        'count': r['count'],
        'ingredients': [
            {'name': ing['name'], 'grams': ing['grams'], 'qty': ing['qty']}
            for ing in r['ingredients']
        ],
        'weightGrams': r.get('weightGrams'),
        'needsSauce': r['needsSauce'],
        'image': r['image'],
    } for r in rolls]

    out_sets = [{
        'id': s['id'],
        'name': s['name'],
        'count': s['count'],
        'items': s['items'],
        'image': s['image'],
    } for s in sets_]

    js = HEADER_COMMENT
    js += "var ROLLS = " + json.dumps(out_rolls, ensure_ascii=False, indent=2) + ";\n\n"
    js += "var SETS = " + json.dumps(out_sets, ensure_ascii=False, indent=2) + ";\n"

    with open(args.out, 'w', encoding='utf-8') as f:
        f.write(js)

    weighed_rolls = sum(1 for r in out_rolls if r['weightGrams'] is not None)
    print("rolls:", len(out_rolls), f"({weighed_rolls} with weightGrams)", "sets:", len(out_sets))
    print("bytes:", len(js.encode('utf-8')))


if __name__ == '__main__':
    main()
