# -*- coding: utf-8 -*-
"""
Парсинг сетів (Zestaw ...) з original_menu.txt / exact_filenames.txt у
sets_clean.json. Доповнює parse.py + create_data.py, які обробляють лише
окремі роли.

Запуск:  python3 parse_sets.py
Вхід:    original_menu.txt, exact_filenames.txt (в тій самій папці)
Вихід:   sets_clean.json

Примітка: назва "Zestaw Tokio" не містить складу у назві файлу (він був
задовгий для імені файлу) -- текст додано вручну нижче (TOKIO_TEXT),
як і надав користувач окремим повідомленням.
"""
import re, json

with open('original_menu.txt', encoding='utf-8') as f:
    orig = [l.rstrip('\n') for l in f if l.strip()]
with open('exact_filenames.txt', encoding='utf-8') as f:
    files = [l.rstrip('\n') for l in f if l.strip()]

def is_set(line):
    return line.startswith('Zestaw') or line.startswith('Classic Salmon Set')

def strip_ext(s):
    return s[:-5] if s.endswith('.webp') else s

TOKIO_TEXT = ("Zestaw Tokio - Najczęściej wybierane 1090 g : 32 szt "
              "Philadelphia z wędzonym łososiem 1/2, Philadelphia z łososiem 1/2, "
              "Philadelphia z tuńczykiem 1/2, Philadelphia z węgorzem 1/2, "
              "Philadelphia z krewetką tygrysią 1/2, Philadelphia sezam 1/2, "
              "Hico mak roll + Maki z ogórkiem")

HEADER_RE = re.compile(
    r'^(?P<name>.*?)\s+(?P<weight>\d+)\s*g\.?\s*'
    r'(?:[:,]\s*(?P<count>\d+)\s*szt\s*)?'
    r'[:,]?\s*(?P<rest>.*)$'
)

# ---- pass 1: split each set line into a header (name/weight/count) + a
#      raw "rest" string listing its component rolls ----
sets_raw = []
for idx, (line, fname) in enumerate(zip(orig, files)):
    if not is_set(line):
        continue
    core = strip_ext(line)
    if core.startswith('Zestaw Tokio'):
        core = strip_ext(TOKIO_TEXT)
    fimg = strip_ext(fname) + '.webp'
    m = HEADER_RE.match(core)
    if not m:
        print("NO MATCH:", core)
        continue
    sets_raw.append({
        'idx': idx,
        'name': m.group('name').strip(' -,:'),
        'weight_g': int(m.group('weight')),
        'count': int(m.group('count')) if m.group('count') else None,
        'rest': m.group('rest').strip(' ,.'),
        'image': fimg,
    })

# ---- pass 2: split "rest" into individual component items and match each
#      one to a roll id from rolls_clean.json (fuzzy / rule-based) ----
rolls = json.load(open('rolls_clean.json', encoding='utf-8'))

DIAC = {'ł':'l','ś':'s','ć':'c','ń':'n','ó':'o','ą':'a','ę':'e','ź':'z','ż':'z'}
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

roll_bases = [{
    'id': r['id'], 'name': r['name'],
    'norm_full': norm(r['name']),
    'norm_base': norm(base_name(r['name'])),
    'tokens': frozenset(norm(base_name(r['name'])).split(' ')),
    'count': r['count'],
} for r in rolls]

# Known typo in the source menu ("Hiko" vs "Hico").
ALIASES = {'hiko mak roll': 'r031'}

# Set components with no matching photographed roll -- kept as name-only
# entries rather than force-matched to a lookalike (see README).
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

def match_roll(item_text_norm, raw_item):
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
        rid = match_roll(text_norm, raw)
        entry = {'name': text, 'rollId': rid, 'portion': portion}
        if is_bonus: entry['bonus'] = True
        if qty: entry['qty'] = qty
        items.append(entry)
        if rid is None and not qty:
            unmatched_log.append((s['idx'], s['name'], raw))

    sid = f"s{len(sets_clean)+1:03d}"
    sets_clean.append({
        'id': sid, 'type': 'set', 'name': s['name'],
        'weight_g': s['weight_g'], 'count': s['count'],
        'items': items, 'image': 'images/' + s['image'],
    })

json.dump(sets_clean, open('sets_clean.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f"Побудовано {len(sets_clean)} сетів.")
if unmatched_log:
    print("\nКомпоненти без фото-картки (потребують перевірки вручну):")
    for idx, sname, raw in unmatched_log:
        print(' ', idx, sname, '|', repr(raw))
