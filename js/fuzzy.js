// ---------------------------------------------------------
// Швидкий нечіткий пошук: n-грами (2-3 символи) + коефіцієнт
// Дайса. Чистий JS, без бібліотек.
//
// Query is matched both against the full candidate name and,
// word-by-word, against each token of it -- otherwise a short
// query (or a query with a typo) gets diluted into oblivion by
// long multi-word names ("tokjo" vs "Zestaw Tokio - ...") and
// silently returns nothing, which defeats the point of a
// typo-tolerant search.
// ---------------------------------------------------------

const DIACRITICS_MAP = {
  'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z',
  'Ą':'a','Ć':'c','Ę':'e','Ł':'l','Ń':'n','Ó':'o','Ś':'s','Ź':'z','Ż':'z',
  'і':'i','а':'a','о':'o','е':'e' // stray cyrillic look-alikes found in a couple of filenames
};

function foldDiacritics(str){
  let out = '';
  for (const ch of str) out += DIACRITICS_MAP[ch] || ch;
  return out;
}

function searchNormalize(str){
  return foldDiacritics(String(str).toLowerCase())
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function nGrams(str, n){
  const grams = [];
  for (let i = 0; i <= str.length - n; i++) grams.push(str.slice(i, i + n));
  return grams;
}

function diceCoefficient(a, b, n){
  if (a === b) return 1;
  const ga = nGrams(a, n), gb = nGrams(b, n);
  if (ga.length === 0 || gb.length === 0) return a === b ? 1 : 0;
  const pool = gb.slice();
  let matches = 0;
  for (const g of ga){
    const idx = pool.indexOf(g);
    if (idx !== -1){ matches++; pool.splice(idx, 1); }
  }
  return (2 * matches) / (ga.length + gb.length);
}

// Combined bigram+trigram Dice for two roughly-comparable-length strings.
function diceCombined(a, b){
  if (!a || !b) return 0;
  if (a === b) return 1;
  const bigram = diceCoefficient(a, b, 2);
  const trigram = (a.length >= 3 && b.length >= 3) ? diceCoefficient(a, b, 3) : bigram;
  return (bigram * 0.5) + (trigram * 0.5);
}

// Best score of `query` against any single whitespace token of `candidate`
// (and, for multi-word queries, the average of each query token's best match).
function bestTokenScore(query, candidate){
  const qTokens = query.split(' ').filter(Boolean);
  const cTokens = candidate.split(' ').filter(Boolean);
  if (cTokens.length === 0 || qTokens.length === 0) return 0;
  if (qTokens.length === 1){
    let best = 0;
    for (const ct of cTokens) best = Math.max(best, diceCombined(query, ct));
    return best;
  }
  let total = 0;
  for (const qt of qTokens){
    let best = 0;
    for (const ct of cTokens) best = Math.max(best, diceCombined(qt, ct));
    total += best;
  }
  return total / qTokens.length;
}

/**
 * Similarity score 0..1 between a search query and a candidate string.
 */
function fuzzyScore(query, candidate){
  const q = searchNormalize(query);
  const c = searchNormalize(candidate);
  if (!q) return 0;
  if (c.includes(q)) {
    const coverage = q.length / Math.max(c.length, 1);
    return 0.9 + 0.1 * coverage;
  }
  if (q.length < 2) return 0;

  const whole = diceCombined(q, c);
  const tokenwise = bestTokenScore(q, c);
  return Math.max(whole, tokenwise);
}

/**
 * Search a list of {id, name, ...} items by name. Returns items with a
 * `_score` (0..1) attached, sorted descending, filtered by a minimum
 * threshold.
 */
function fuzzySearchList(query, items, opts){
  const options = Object.assign({ minScore: 0.32, nameKey: 'name' }, opts || {});
  const q = query.trim();
  if (!q) return [];
  return items
    .map(item => ({ item, score: fuzzyScore(q, item[options.nameKey]) }))
    .filter(x => x.score >= options.minScore)
    .sort((a, b) => b.score - a.score)
    .map(x => Object.assign({}, x.item, { _score: x.score }));
}

if (typeof module !== 'undefined') {
  module.exports = { searchNormalize, diceCoefficient, diceCombined, fuzzyScore, fuzzySearchList };
}
