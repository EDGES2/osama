// ---------------------------------------------------------
// Візуальна схожість, порахована прямо з ingredients -- окремого
// поля "tags" більше не потрібно. Щоб додати нову рolку, досить
// вписати її в data.js (ingredients + інше); "теги" підтягуються
// самі. Використовується для підбору дистракторів (Режим 2) і
// кандидатів (Режим 3).
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
 * Pick `count` distractor rolls for a multiple-choice question about
 * `target`, biased toward rolls that share the most visible-topping
 * tags (so the wrong answers "look like" the right one).
 */
function pickDistractors(target, allRolls, count){
  const n = count || 3;
  const scored = allRolls
    .filter(r => r.id !== target.id && r.name !== target.name)
    .map(r => ({ r, score: jaccard(tagsFromIngredients(r), tagsFromIngredients(target)) }))
    .sort((a, b) => b.score - a.score);

  const poolSize = Math.max(n * 3, 9);
  const topPool = scored.slice(0, poolSize);
  const chosen = shuffle(topPool).slice(0, n).map(x => x.r);

  // Fallback: if the deck is small / tags sparse and we somehow got
  // fewer than requested, top up randomly from whatever's left.
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
 * the set's real (photographed) members plus a handful of visually
 * similar "traps" drawn from the rest of the menu.
 */
function buildSetCandidates(set, allRolls){
  const memberIds = new Set(
    set.items.filter(i => i.rollId).map(i => i.rollId)
  );
  const members = allRolls.filter(r => memberIds.has(r.id));
  const memberTagUnion = [...new Set(members.flatMap(r => tagsFromIngredients(r)))];

  const trapScored = allRolls
    .filter(r => !memberIds.has(r.id))
    .map(r => ({ r, score: jaccard(tagsFromIngredients(r), memberTagUnion) }))
    .sort((a, b) => b.score - a.score);

  const trapCount = Math.min(5, Math.max(2, Math.round(members.length * 0.7)));
  const traps = shuffle(trapScored.slice(0, Math.max(trapCount * 2, 8)))
    .slice(0, trapCount)
    .map(x => x.r);

  const candidates = shuffle([...members, ...traps]);
  const unmatchedExtras = set.items.filter(i => !i.rollId);

  return { members, traps, candidates, unmatchedExtras };
}

if (typeof module !== 'undefined') {
  module.exports = { jaccard, shuffle, tagsFromIngredients, pickDistractors, buildSetCandidates };
}
