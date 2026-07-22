# -*- coding: utf-8 -*-
"""
Крок 3. sets_raw.json + rolls_clean.json -> sets_clean.json.

sets_raw.json вже містить назву/вагу/к-сть та нерозібраний рядок
компонентів (`rest`) для кожного сету -- і байдуже, узятий він зі
звичайного рядка original_menu.txt чи з окремого .txt-файлу (це вже
вирішив parse_source.py). Тут лишається лише доменна логіка: розбити
`rest` на окремі компоненти і зіставити кожен із фото-карткою ролу.
"""
import argparse
import json
import re

DIAC = {'ł': 'l', 'ś': 's', 'ć': 'c', 'ń': 'n', 'ó': 'o', 'ą': 'a', 'ę': 'e', 'ź': 'z', 'ż': 'z'}


def norm(s):
    s = s.lower()
    for pl, asc in DIAC.items():
        s = s.replace(pl, asc)
    s = re.sub(r'[^\w\s]', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def base_name(name):
    n = re.split(r'\s+-\s+|\s+—\s+', name)[0]
    n = re.sub(r'\s+MAX[IІ]$', '', n, flags=re.IGNORECASE)
    return n


# Відомий одруківок у вихідному меню ("Hiko" замість "Hico").
ALIASES = {'hiko mak roll': 'r031'}

# Компоненти сетів без відповідної фото-картки серед ROLLS -- лишаються
# як текстові пункти (rollId: null), а не примусово прив'язуються до
# візуально схожого, але насправді іншого ролу (див. README).
KNOWN_UNMATCHED = {
    'cheese roll z pieczonym lososiem',
    'tunczyk tar tar',
    'pieczone maki z lososiem',
    'pieczone maki z wegorzem',
    'pieczone maki z krewetka',
}

PROMO_RE = re.compile(r'\s*Najlepiej smakuje z .*$', re.IGNORECASE)
GRATIS_RE = re.compile(r'\s*GRATIS\s*$', re.IGNORECASE)
HALF_RE = re.compile(r'\s*[1I][\s]*[/:]\s*2\s*$')
QTY_PREFIX_RE = re.compile(r'^(\d+)\s*[xX]\s+')


def match_roll(item_text_norm, raw_item, roll_bases):
    if 'krewetk' in item_text_norm and 'tempur' in item_text_norm:
        m = re.search(r'\b(10|5)\b', raw_item)
        if m:
            want = int(m.group(1))
            for rb in roll_bases:
                if rb['id'] in ('r034', 'r035') and rb['count'] == want:
                    return rb['id']
    if item_text_norm in ALIASES:
        return ALIASES[item_text_norm]
    if item_text_norm in KNOWN_UNMATCHED:
        return None
    for rb in roll_bases:
        if rb['norm_full'] == item_text_norm or rb['norm_base'] == item_text_norm:
            return rb['id']
    item_tokens = frozenset(item_text_norm.split(' '))
    candidates = [rb for rb in roll_bases if rb['tokens'] == item_tokens]
    if len(candidates) == 1:
        return candidates[0]['id']
    candidates = [rb for rb in roll_bases if rb['norm_base'].startswith(item_text_norm + ' ')
                  or rb['norm_base'] == item_text_norm]
    if len(candidates) == 1:
        return candidates[0]['id']
    if len(item_text_norm) >= 5:
        candidates = [rb for rb in roll_bases
                      if re.search(r'(?:^|\s)' + re.escape(item_text_norm) + r'(?:\s|$)', rb['norm_base'])]
        if len(candidates) == 1:
            return candidates[0]['id']
    return None


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--in-sets', default='sets_raw.json')
    ap.add_argument('--in-rolls', default='rolls_clean.json')
    ap.add_argument('--out', default='sets_clean.json')
    args = ap.parse_args()

    sets_raw = json.load(open(args.in_sets, encoding='utf-8'))
    rolls = json.load(open(args.in_rolls, encoding='utf-8'))

    roll_bases = [{
        'id': r['id'], 'name': r['name'],
        'norm_full': norm(r['name']),
        'norm_base': norm(base_name(r['name'])),
        'tokens': frozenset(norm(base_name(r['name'])).split(' ')),
        'count': r['count'],
    } for r in rolls]

    sets_clean = []
    unmatched_log = []

    for s in sets_raw:
        rest = PROMO_RE.sub('', s['rest']).strip(' ,.')
        raw_items = [it.strip(' .') for it in re.split(r'\s*[,+]\s*', rest) if it.strip(' .')]
        items = []
        for raw in raw_items:
            text = raw
            is_bonus = False
            portion = 'full'
            qty = None
            if GRATIS_RE.search(text):
                is_bonus = True
                text = GRATIS_RE.sub('', text).strip()
            if HALF_RE.search(text):
                portion = 'half'
                text = HALF_RE.sub('', text).strip()
            mqty = QTY_PREFIX_RE.match(text)
            if mqty:
                qty = int(mqty.group(1))
                text = QTY_PREFIX_RE.sub('', text).strip()
            text_norm = norm(text)
            rid = match_roll(text_norm, raw, roll_bases)
            entry = {'name': text, 'rollId': rid, 'portion': portion}
            if is_bonus:
                entry['bonus'] = True
            if qty:
                entry['qty'] = qty
            items.append(entry)
            if rid is None and not qty:
                unmatched_log.append((s['idx'], s['name'], raw))

        sid = f"s{len(sets_clean) + 1:03d}"
        sets_clean.append({
            'id': sid, 'type': 'set', 'idx': s['idx'], 'name': s['name'],
            'weight_g': s['weight_g'], 'count': s['count'],
            'items': items,
            'source_image': s['source_image'],
            'image': 'images/' + s['source_image'],
        })

    json.dump(sets_clean, open(args.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f"Побудовано {len(sets_clean)} сетів.")
    if unmatched_log:
        print("\nКомпоненти без фото-картки (потребують перевірки вручну):")
        for idx, sname, raw in unmatched_log:
            print(' ', idx, sname, '|', repr(raw))


if __name__ == '__main__':
    main()
