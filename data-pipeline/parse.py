import re, json, unicodedata

with open('original_menu.txt', encoding='utf-8') as f:
    orig_lines = [l.rstrip('\n') for l in f if l.strip()]
with open('exact_filenames.txt', encoding='utf-8') as f:
    file_lines = [l.rstrip('\n') for l in f if l.strip()]

assert len(orig_lines) == len(file_lines), (len(orig_lines), len(file_lines))

SET_PREFIXES = ('Zestaw', 'Classic Salmon Set')

def is_set(line):
    return line.startswith('Zestaw') or line.startswith('Classic Salmon Set')

def strip_ext(s):
    return s[:-5] if s.endswith('.webp') else s

def clean_name(s):
    s = s.strip(' -,:')
    # strip emoji
    s = ''.join(ch for ch in s if unicodedata.category(ch) not in ('So','Cn') )
    return s.strip()

weight_re = re.compile(
    r'^(?:\((?P<paren_count>\d+)\s*szt\)\s*)?'
    r'(?P<weight>\d+)\s*(?:gr|g)\.?,?\s*'
    r'(?::\s*(?P<count>\d+)\s*szt\s*:?\s*)?'
    r'(?P<rest>.*)$'
)

PROMO_PATTERNS = [
    re.compile(r'\s*Najlepiej smakuje z .*$', re.IGNORECASE),
    re.compile(r'\s*GRATIS.*$', re.IGNORECASE),
]

rolls = []
sets_raw = []

for idx, (line, fname) in enumerate(zip(orig_lines, file_lines)):
    core = strip_ext(line)
    fimg = strip_ext(fname) + '.webp'
    if is_set(core):
        sets_raw.append((idx, core, fimg))
        continue
    # find first digit (including a preceding "(" if present) -> split name / meta+ingredients
    m = re.search(r'\(?\d', core)
    if not m:
        print("NO DIGIT:", core)
        continue
    name_part = core[:m.start()]
    meta_part = core[m.start():]
    name = clean_name(name_part)
    mm = weight_re.match(meta_part)
    if not mm:
        print("META NO MATCH:", repr(meta_part), "| line:", core)
        continue
    weight = mm.group('weight')
    count = mm.group('count') or mm.group('paren_count') or '1'
    rest = mm.group('rest').strip(' ,.')
    # strip promo suffixes
    for pat in PROMO_PATTERNS:
        rest = pat.sub('', rest).strip(' ,.')
    ingredients = [i.strip(' .') for i in rest.split(',') if i.strip(' .')]
    rolls.append({
        'idx': idx,
        'name': name,
        'weight_g': int(weight),
        'count': int(count),
        'ingredients': ingredients,
        'image': fimg,
    })

print(f"Parsed {len(rolls)} rolls, {len(sets_raw)} set lines (need manual curation)")
print()
for r in rolls:
    print(r['idx'], '|', r['name'], '| w=',r['weight_g'],'count=',r['count'],'|', r['ingredients'])

with open('rolls_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(rolls, f, ensure_ascii=False, indent=2)

print("\n--- SET LINES (raw) ---")
for idx, core, fimg in sets_raw:
    print(idx, '|', core, '|', fimg)
