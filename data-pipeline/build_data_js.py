# -*- coding: utf-8 -*-
import json

rolls = json.load(open('rolls_clean.json', encoding='utf-8'))
sets_ = json.load(open('sets_clean.json', encoding='utf-8'))

# trim fields not used in the UI per spec (weight/comment not surfaced),
# but keep weight_g in data in case it's useful later -- just not rendered.
out_rolls = []
for r in rolls:
    out_rolls.append({
        'id': r['id'],
        'name': r['name'],
        'count': r['count'],
        'ingredients': r['ingredients'],
        'tags': r['tags'],
        'needsSauce': r['needsSauce'],
        'image': r['image'],
    })

out_sets = []
for s in sets_:
    out_sets.append({
        'id': s['id'],
        'name': s['name'],
        'count': s['count'],
        'items': s['items'],
        'image': s['image'],
    })

js = "// Auto-generated menu data. Do not edit by hand -- regenerate from source files.\n"
js += "const ROLLS = " + json.dumps(out_rolls, ensure_ascii=False, indent=2) + ";\n\n"
js += "const SETS = " + json.dumps(out_sets, ensure_ascii=False, indent=2) + ";\n"

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("rolls:", len(out_rolls), "sets:", len(out_sets))
print("bytes:", len(js.encode('utf-8')))
