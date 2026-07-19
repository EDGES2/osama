# -*- coding: utf-8 -*-
import json, re

rolls = json.load(open('rolls_parsed.json', encoding='utf-8'))

# ---------- ingredient cleanup ----------
CAP_FIX = {
    'philadelphia': 'Philadelphia', 'cheddar': 'Cheddar', 'gouda': 'Gouda',
    'pepsi': 'Pepsi', 'lipton': 'Lipton', '7up': '7UP', 'filadelphia': 'Philadelphia',
}

def fix_ingredient(s):
    s = re.sub(r'^\d+\s+', '', s)  # strip leading count like "10 " in "10 krewetek..."
    s = s.strip()
    low = s.lower()
    for k, v in CAP_FIX.items():
        low = re.sub(re.escape(k), v, low, flags=re.IGNORECASE)
    # lowercase everything except our fixed brand words, then capitalize first letter of the phrase
    words = low.split(' ')
    out_words = []
    for w in words:
        wl = w.lower().strip('.,')
        if wl in [v.lower() for v in CAP_FIX.values()]:
            # restore proper capitalization
            for v in CAP_FIX.values():
                if v.lower() == wl:
                    out_words.append(v)
                    break
        else:
            out_words.append(wl)
    result = ' '.join(out_words)
    if result:
        result = result[0].upper() + result[1:]
    return result

# ---------- visual tag rules (order matters, first match per ingredient wins) ----------
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
    # Flatten Polish diacritics so regex patterns like 'losos' will match 'łosoś'
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
    return any(SAUCE_HINT.search(i.lower()) and re.search(r'unagi|spicy|sriracha', i.lower()) for i in ingredients)

idx_to_id = {}
clean_rolls = []
for i, r in enumerate(rolls):
    rid = f"r{i+1:03d}"
    idx_to_id[r['idx']] = rid
    ingredients = [fix_ingredient(x) for x in r['ingredients']]
    clean_rolls.append({
        'id': rid,
        'type': 'roll',
        'name': r['name'],
        'count': r['count'],
        'weight_g': r['weight_g'],
        'ingredients': ingredients,
        'tags': tags_for(r['ingredients']),
        'needsSauce': has_sauce(r['ingredients']),
        'image': 'images/' + r['image'],
    })

json.dump(idx_to_id, open('idx_to_id.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
json.dump(clean_rolls, open('rolls_clean.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print("Rolls done:", len(clean_rolls))
for r in clean_rolls:
    print(r['id'], r['name'], '| tags:', r['tags'], '| sauce:', r['needsSauce'])
