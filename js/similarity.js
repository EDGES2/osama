// ---------------------------------------------------------
// Підбір дистракторів (Режим 2) і кандидатів (Режим 3) для квізів.
//
// Пріоритет №1 -- ручні групи візуальної схожості з groups.js
// (ROLL_GROUP_OF), бо саме вони відповідають на питання "з чим
// гравець реально може переплутати цю роlку на фото". Ingredients
// тут ні до чого: два roli можуть мати зовсім різний склад і все
// одно виглядати майже однаково (обидва помаранчеві, обидва залиті
// unagi), або мати спільні інгредієнти і виглядати геть по-різному.
//
// Пріоритет №2 (fallback) -- стара автоматична схожість, порахована
// прямо з ingredients (tagsFromIngredients + jaccard), без окремого
// поля "tags". Вона вмикається лише тоді, коли групи з groups.js не
// вистачає: сама roLка не входить в жодну групу, або її група
// замала, щоб дати потрібну кількість варіантів.
// ---------------------------------------------------------

// Кеш "item -> нормалізовані назви інгредієнтів", щоб не
// перераховувати searchNormalize() на кожен виклик jaccard().
const _ingredientTagsCache = new Map();

/**
 * Automatic stand-in for a hand-curated "tags" list: just the item's
 * own ingredient names, normalized (lowercased, diacritics folded)
 * with fuzzy.js's searchNormalize so wording/case differences don't
 * matter. No translation or exclusion step -- if an ingredient (e.g.
 * "Nori") happens to sit on every roll, it just contributes an equal
 * baseline similarity everywhere and doesn't hurt the ranking.
 */
function tagsFromIngredients(item){
  if (_ingredientTagsCache.has(item)) return _ingredientTagsCache.get(item);
  const tags = (item.ingredients || [])
    .map(i => searchNormalize(i))
    .filter(Boolean);
  _ingredientTagsCache.set(item, tags);
  return tags;
}

function jaccard(tagsA, tagsB){
  const a = new Set(tagsA || []);
  const b = new Set(tagsB || []);
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  a.forEach(t => { if (b.has(t)) inter++; });
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function shuffle(arr){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick up to `count` (max 3 -> 4 options total with the correct
 * answer) distractor rolls for a multiple-choice question about
 * `target`. Same-visual-group rolls (groups.js) come first; if the
 * group is too small (or `target` isn't in any group), the rest is
 * topped up by ingredient-jaccard, and finally by plain random pick
 * if the menu itself is too small.
 */
function pickDistractors(target, allRolls, count){
  const n = Math.min(count || 3, 3);
  const groupKey = (typeof ROLL_GROUP_OF !== 'undefined') ? ROLL_GROUP_OF[target.id] : null;

  // Tier 1 -- hand-curated visual group.
  const groupPool = groupKey
    ? allRolls.filter(r => r.id !== target.id && ROLL_GROUP_OF[r.id] === groupKey)
    : [];
  const chosen = shuffle(groupPool).slice(0, n);

  // Tier 2 -- ingredient-jaccard fallback for whatever's still missing.
  if (chosen.length < n){
    const chosenIds = new Set(chosen.map(r => r.id));
    const scored = allRolls
      .filter(r => r.id !== target.id && !chosenIds.has(r.id))
      .map(r => ({ r, score: jaccard(tagsFromIngredients(r), tagsFromIngredients(target)) }))
      .sort((a, b) => b.score - a.score);
    const need = n - chosen.length;
    const poolSize = Math.max(need * 3, 9);
    const topPool = scored.slice(0, poolSize);
    for (const x of shuffle(topPool)){
      if (chosen.length >= n) break;
      chosen.push(x.r);
    }
  }

  // Tier 3 -- deck too small even for that: top up randomly.
  if (chosen.length < n){
    const chosenIds = new Set(chosen.map(r => r.id));
    const rest = allRolls.filter(r => r.id !== target.id && !chosenIds.has(r.id));
    for (const r of shuffle(rest)){
      if (chosen.length >= n) break;
      chosen.push(r);
    }
  }
  return chosen;
}

/**
 * Build the candidate checkbox pool for a set-composition question:
 * every real (photographed) member of the set, each paired with
 * exactly 2 visually-similar "traps" (same hand-curated group first,
 * ingredient-jaccard against that specific member as a fallback when
 * its group is small or it isn't in one at all).
 *
 * So a 4-roll set -> 4 members x 3 (itself + 2 traps) = 12 candidates.
 * The three items of each member's own cluster are kept next to each
 * other in the returned `candidates` list (only the order of the
 * clusters themselves is shuffled) -- e.g. 3 "green", 3 "orange", 3
 * "red" in a row -- instead of one flat shuffle of all 12, since the
 * whole point is to let the player compare visually-similar options
 * side by side.
 */
function buildSetCandidates(set, allRolls){
  const memberIds = new Set(
    set.items.filter(i => i.rollId).map(i => i.rollId)
  );
  const members = allRolls.filter(r => memberIds.has(r.id));

  const usedTrapIds = new Set(); // a roll can't trap for two different members at once
  const clusters = members.map(member => {
    const groupKey = (typeof ROLL_GROUP_OF !== 'undefined') ? ROLL_GROUP_OF[member.id] : null;

    // Tier 1 -- hand-curated visual group.
    const groupPool = groupKey
      ? allRolls.filter(r => ROLL_GROUP_OF[r.id] === groupKey && !memberIds.has(r.id) && !usedTrapIds.has(r.id))
      : [];
    const traps = shuffle(groupPool).slice(0, 2);

    // Tier 2 -- ingredient-jaccard fallback for whatever's still missing.
    if (traps.length < 2){
      const trapIds = new Set(traps.map(r => r.id));
      const scored = allRolls
        .filter(r => !memberIds.has(r.id) && !usedTrapIds.has(r.id) && !trapIds.has(r.id))
        .map(r => ({ r, score: jaccard(tagsFromIngredients(r), tagsFromIngredients(member)) }))
        .sort((a, b) => b.score - a.score);
      const need = 2 - traps.length;
      const topPool = scored.slice(0, Math.max(need * 3, 6));
      for (const x of shuffle(topPool)){
        if (traps.length >= 2) break;
        traps.push(x.r);
      }
    }

    traps.forEach(r => usedTrapIds.add(r.id));
    return { member, traps, group: shuffle([member, ...traps]) };
  });

  const candidates = shuffle(clusters.map(c => c.group)).flat();
  const traps = clusters.flatMap(c => c.traps);
  const unmatchedExtras = set.items.filter(i => !i.rollId);

  return { members, traps, candidates, unmatchedExtras, clusters };
}

if (typeof module !== 'undefined') {
  module.exports = { jaccard, shuffle, tagsFromIngredients, pickDistractors, buildSetCandidates };
}
