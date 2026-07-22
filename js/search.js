// ---------------------------------------------------------
// Пошук: 5 режимів.
//  - "all"         — bez zapytania: siatka kafelków УСІХ рол(о)к і
//                    сетів за алфавітом, з лічильником можливих сетів
//                    і кнопкою "+" (починає будувати сет, як у
//                    "setsByRolls") на кожній рол(к)і, з якої можна
//                    зібрати сет -- ТІЛЬКИ на рол(к)ах, сету з сета не
//                    збудуєш; КОЖНА картка, і рол(к)а, і сет, також
//                    отримує кнопку "VS" (лівіше "+", де він є) --
//                    додає/забирає з Versus (versus.js), глобального
//                    порівняння (на сеті -- одразу всі його
//                    сфотографовані рол(к)и, toggleVersusSet у
//                    versus.js); з введеним текстом: попередній нечіткий
//                    пошук — список рядків з відсотком збігу (як було),
//                    ті ж "+" (лише рол(к)и) і "VS" (обидва типи)
//  - "sets"        — те саме, але лише серед сетів, сітка карток усіх
//                    сетів за алфавітом (без потреби щось вводити);
//                    кожна картка теж має кнопку "VS"
//  - "other"       — сітка карток рол(о)к, з яких НЕ можна зібрати сет
//                    (немає в жодному SETS.items) -- позиції "тільки
//                    окремо", за алфавітом; так само як у "all", кожна
//                    картка має кнопку "VS"
//  - "setsByRolls" — сітка карток усіх рол(о)к (можна фільтрувати текстом),
//                    обрані лежать чіпами; сітка звужується до сумісних із
//                    уже обраними, знизу — сети, що містять УСІ обрані рол(к)и;
//                    картки в сітці (рол(к)и, не чіпи вибору) і рядки
//                    сетів знизу -- всі мають кнопку "VS"
//  - "ingredients" — вибір інгредієнтів (без тих, що є майже у кожній рол(к)і,
//                    напр. рис і норі); список звужується до сумісних із уже
//                    обраними -> знизу рол(к)и АБО сети (перемикач), що
//                    містять УСІ обрані складники
// ---------------------------------------------------------

var SearchState = {
  mode: 'all',            // 'all' | 'sets' | 'other' | 'setsByRolls' | 'ingredients'
  query: '',
  selectedId: null,       // when set, show detail view instead of results list
  selectedRollIds: [],    // mode: setsByRolls — order = order added
  selectedIngredientKeys: [], // mode: ingredients — order = order added
  ingredientsTarget: 'rolls', // mode: ingredients — 'rolls' | 'sets', what the picker filters
};

var SEARCH_MODES = [
  { id: 'all', label: 'Wszystko', placeholder: 'Nazwa rolki lub zestawu…' },
  { id: 'sets', label: 'Zestawy', placeholder: 'Nazwa zestawu…' },
  { id: 'other', label: 'Inne', placeholder: 'Nazwa pozycji…' },
  { id: 'setsByRolls', label: 'Wg rolek', placeholder: 'Wpisz nazwę rolki…' },
  { id: 'ingredients', label: 'Składniki', placeholder: 'Szukaj składnika…' },
];

function searchGetAllItems(){
  const rolls = ROLLS.map(r => Object.assign({ _type: 'roll' }, r));
  const sets = SETS.map(s => Object.assign({ _type: 'set' }, s));
  return [...rolls, ...sets];
}

// ---------------------------------------------------------
// Індекс "нетривіальних" інгредієнтів для режиму "ingredients".
//
// Ту саму сировину (np. "Łosoś surowy" / "Surowy łosoś" / literówka
// "Łosos surowy") menu.txt zapisuje różną kolejnością słów lub z
// drobną literówką -- grupujemy je jednym kluczem: słowa ingredientu
// po zwinięciu diakrytyków (searchNormalize z fuzzy.js, ta sama
// funkcja co w wyszukiwarce) i posortowaniu alfabetycznie. Do
// wyświetlenia bierzemy najczęściej spotykaną pisownię w grupie.
//
// Składniki obecne w prawie każdej rolce (ryż, nori) są pomijane --
// próg 80% czysto rozdziela je (94% i 91%) od kolejnego najczęstszego
// składnika (ser Philadelphia, 62%), więc nie trzeba niczego wpisywać
// na sztywno ręcznie.
//
// Każdy wpis niesie DWA zestawy id: `rollIds` (rolki zawierające ten
// składnik) i `setIds` (zestawy, które go zawierają za pośrednictwem
// któregoś ze swoich fotografowanych członków-rolek). Człony zestawu
// bez własnego zdjęcia (bez rollId) nie mają listy składników, więc są
// pomijane przy budowie `setIds`. Próg "uniwersalności" filtrujący
// wpisy liczony jest zawsze na bazie ROLLS -- nie duplikujemy go dla
// zestawów, żeby nie mieć dwóch niezależnych definicji "banalnego"
// składnika.
//
// Ponad tym jest jeszcze DRUGA warstwa scalania, z ingredientGroups.js:
// ingredientCanonicalKey() niżej łączy tylko różne ZAPISY tych samych
// słów (kolejność, brakująca diakrytyka), a INGREDIENT_GROUP_OF łączy
// RÓŻNE słowa opisujące ten sam składnik w innej formie przygotowania
// (np. "Krewetka" / "Krewetka gotowana" / "Krewetka w tempurze" -> jeden
// chip "Krewetka (dowolna forma)"). Zobacz nagłówek ingredientGroups.js
// po pełne wytłumaczenie i sposób dodawania nowych wariantów.
// ---------------------------------------------------------
var UNIVERSAL_INGREDIENT_RATIO = 0.8;
var _ingredientIndexCache = null;

function ingredientCanonicalKey(name){
  const norm = searchNormalize(name);
  return norm.split(' ').filter(Boolean).sort().join(' ');
}

/** Canonical ingredient key -> the key actually used to bucket it in
 * getIngredientIndex() below: its INGREDIENT_GROUPS family key if
 * ingredientGroups.js maps it to one, otherwise the canonical key
 * unchanged (stays its own single-ingredient entry). */
function ingredientBucketKey(canonicalKey){
  if (typeof INGREDIENT_GROUP_OF !== 'undefined' && INGREDIENT_GROUP_OF[canonicalKey]) return INGREDIENT_GROUP_OF[canonicalKey];
  return canonicalKey;
}

function getIngredientIndex(){
  if (_ingredientIndexCache) return _ingredientIndexCache;
  const groups = new Map(); // key -> { rollIds: Set, setIds: Set, labelCounts: Map }
  function ensureGroup(key){
    if (!groups.has(key)) groups.set(key, { rollIds: new Set(), setIds: new Set(), labelCounts: new Map() });
    return groups.get(key);
  }

  ROLLS.forEach(roll => {
    const seenKeys = new Set();
    roll.ingredients.forEach(ing => {
      const key = ingredientBucketKey(ingredientCanonicalKey(ing.name));
      if (!key || seenKeys.has(key)) return;
      seenKeys.add(key);
      const g = ensureGroup(key);
      g.rollIds.add(roll.id);
      g.labelCounts.set(ing.name, (g.labelCounts.get(ing.name) || 0) + 1);
    });
  });

  SETS.forEach(set => {
    const setKeys = new Set();
    set.items.forEach(item => {
      const roll = item.rollId ? rollById(item.rollId) : null;
      if (!roll) return;
      roll.ingredients.forEach(ing => {
        const key = ingredientBucketKey(ingredientCanonicalKey(ing.name));
        if (key) setKeys.add(key);
      });
    });
    setKeys.forEach(key => { ensureGroup(key).setIds.add(set.id); });
  });

  const total = ROLLS.length;
  const list = [];
  groups.forEach((g, key) => {
    if (total > 0 && (g.rollIds.size / total) >= UNIVERSAL_INGREDIENT_RATIO) return;
    // Grouped families (ingredientGroups.js) use their own curated label;
    // everything else falls back to the most common raw spelling, as before.
    const curatedLabel = (typeof INGREDIENT_GROUP_LABEL !== 'undefined') ? INGREDIENT_GROUP_LABEL[key] : undefined;
    let label = curatedLabel;
    if (!label){
      let best = -1;
      g.labelCounts.forEach((count, l) => { if (count > best){ best = count; label = l; } });
    }
    list.push({ key, label, rollIds: g.rollIds, setIds: g.setIds });
  });
  list.sort((a, b) => a.label.localeCompare(b.label, 'pl'));
  _ingredientIndexCache = list;
  return list;
}

// ---------------------------------------------------------
// Спільна побудова рядка результату (rolka lub zestaw): miniatura,
// nazwa, opcjonalna etykieta typu i/lub odznaka (procent trafności,
// "x/y" itp).
// ---------------------------------------------------------
/**
 * `onPlus`, jeśli podany, dorysowuje przed odznaką procentową (po
 * lewej od niej, wyśrodkowany pionowo przez istniejący
 * `align-items:center` rodzica) okrągły czarny przycisk "+" -- ta sama
 * akcja co na kafelkach: zaczyna budować zestaw od tej rolki. Z tego
 * samego powodu co buildPhotoNameTile, korzeniem jest div z rolą
 * "button", nie <button> -- może teraz zawierać zagnieżdżony
 * interaktywny przycisk.
 *
 * `onVersus`, jeśli podany, dorysowuje przycisk "VS" (dodaj/usuń z
 * porównania Versus) -- zawsze PRZED `onPlus`, czyli po jego lewej
 * stronie.
 *
 * Gdy `item.price` jest znane, tuż PRZED tymi przyciskami (po prawej
 * od `.result-info`) dorysowuje się mała złota etykieta ceny
 * (`result-row__price`) -- dodawana jako bezpośrednie dziecko
 * `.result-row` (a nie do środka `.result-info`), bo ten wiersz jest
 * już flex-em: inline-flex wrzucony między zwykłe blokowe divy
 * (`.result-name`/`.result-type`) dostałby anonymous-box z fantomowym
 * odstępem, dokładnie ten sam błąd co kiedyś w `.detail-body`. */
function buildResultRow(item, opts){
  opts = opts || {};
  const onClick = opts.onClick || (() => { SearchState.selectedId = item.id; renderSearchBody(); });
  const row = el('div', {
    class: 'result-row', tabindex: '0', role: 'button', 'aria-label': item.name,
    onClick,
    onKeydown: (e) => {
      if (e.target !== row) return; // ignore keydowns bubbling up from the nested + button
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); onClick(); }
    },
  });
  const thumb = el('img', { class: 'result-thumb', src: item.image, alt: '', loading: 'lazy' });
  thumb.addEventListener('error', () => { thumb.style.visibility = 'hidden'; });
  row.appendChild(thumb);
  row.appendChild(el('div', { class: 'result-info' }, [
    el('div', { class: 'result-name' }, item.name),
    opts.subLabel ? el('div', { class: 'result-type' }, opts.subLabel) : null,
  ]));
  const priceLabel = formatPrice(item.price);
  if (priceLabel) row.appendChild(el('span', { class: 'result-row__price' }, priceLabel));
  if (opts.onVersus){
    row.appendChild(buildVersusToggleBtn(item.id, opts.onVersus, { className: 'result-row__vs', label: 'VS', name: item.name }));
  }
  if (opts.onPlus){
    row.appendChild(el('button', {
      class: 'result-row__plus',
      'aria-label': 'Zbuduj zestaw od: ' + item.name,
      onClick: (e) => { e.stopPropagation(); opts.onPlus(); },
    }, iconEl('plus')));
  }
  if (opts.badge) row.appendChild(el('span', { class: 'match-badge' }, opts.badge));
  return row;
}

/** Kafelek ze zdjęciem i nazwą pod spodem -- używany w siatce wyboru
 * rolek (tryb "Wg rolek", ze zdjęciowym licznikiem zestawów w rogu) i
 * w siatce zestawów (tryb "Zestawy", bez licznika). Brak zdjęcia nie
 * pokazuje ikony błędu -- nazwa pod kafelkiem już wystarcza za opis.
 * `count`, jeśli podany jako liczba, pokazuje się jako odznaka w
 * prawym górnym rogu zdjęcia.
 *
 * `onPlus`, jeśli podany, dorysowuje okrągły czarny przycisk "+" w
 * lewym górnym rogu zdjęcia -- osobna akcja (zaczyna budować zestaw od
 * tej rolki), niezależna od kliknięcia w samą kartę. Ponieważ kafelek
 * może teraz zawierać zagnieżdżony interaktywny przycisk, korzeniem
 * jest div z rolą "button" i obsługą klawiatury (ten sam wzorzec co
 * flip-card w cards.js), a nie <button>.
 *
 * `onVersus`, jeśli podany, dorysowuje przycisk "VS" w tym samym rogu,
 * PRZED (na lewo od) "+" -- gdy oba są podane, "+" przesuwa się w
 * prawo (`roll-picker-tile__plus--shifted`), żeby nie nachodziły na
 * siebie.
 *
 * Gdy `item.price` jest znane (formatPrice, render.js), w PRAWYM DOLNYM
 * rogu zdjęcia -- jedynym rogu jeszcze wolnym od innych odznak --
 * dorysowuje się mała złota etykieta ceny (`roll-picker-tile__price`),
 * ten sam wzorzec co `.price-tag` w widoku szczegółów. */
function buildPhotoNameTile(item, count, onClick, onPlus, onVersus){
  const tile = el('div', {
    class: 'roll-picker-tile', tabindex: '0', role: 'button', 'aria-label': item.name,
    onClick,
    onKeydown: (e) => {
      if (e.target !== tile) return; // ignore keydowns bubbling up from the nested + button
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); onClick(); }
    },
  });
  const photo = el('div', { class: 'roll-picker-tile__photo' });
  const img = el('img', { class: 'roll-picker-tile__img', src: item.image, alt: '', loading: 'lazy' });
  img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
  photo.appendChild(img);
  if (typeof count === 'number') photo.appendChild(el('span', { class: 'roll-picker-tile__count' }, String(count)));
  if (onVersus){
    photo.appendChild(buildVersusToggleBtn(item.id, onVersus, { className: 'roll-picker-tile__vs', label: 'VS', name: item.name }));
  }
  if (onPlus){
    photo.appendChild(el('button', {
      class: 'roll-picker-tile__plus' + (onVersus ? ' roll-picker-tile__plus--shifted' : ''),
      'aria-label': 'Zbuduj zestaw od: ' + item.name,
      onClick: (e) => { e.stopPropagation(); onPlus(); },
    }, iconEl('plus')));
  }
  const priceLabel = formatPrice(item.price);
  if (priceLabel) photo.appendChild(el('span', { class: 'roll-picker-tile__price' }, priceLabel));
  tile.appendChild(photo);
  tile.appendChild(el('span', { class: 'roll-picker-tile__name' }, item.name));
  return tile;
}

// ---------------------------------------------------------
// Ile zestawów zawiera daną rolkę -- odznaka w rogu kafelka w trybie
// "Wg rolek". Ta sama logika co licznik przy składniku w trybie
// "Składniki" (patrz comboCount w renderIngredientsMode): bez innych
// wybranych rolek to po prostu łączna liczba zestawów z tą rolką, a
// gdy coś już wybrano -- przecięcie, ile zestawów zawiera WSZYSTKIE
// wybrane rolki RAZEM z tą kandydatką. Rolki, których nie ma w żadnym
// zestawie (count byłby 0), są odfiltrowywane przed dotarciem tutaj --
// patrz getRollsInSets() w renderSetsByRollsMode.
// ---------------------------------------------------------
var _rollsInSetsCache = null;

function getRollsInSets(){
  if (_rollsInSetsCache) return _rollsInSetsCache;
  const ids = new Set();
  SETS.forEach(s => s.items.forEach(it => { if (it.rollId) ids.add(it.rollId); }));
  _rollsInSetsCache = ids;
  return ids;
}

function rollSetCombo(rollId, selectedIds){
  let count = 0;
  SETS.forEach(s => {
    const items = s.items;
    if (!items.some(it => it.rollId === rollId)) return;
    if (selectedIds.every(id => items.some(it => it.rollId === id))) count++;
  });
  return count;
}

/** Chip pokazujący już dodaną pozycję (rolkę / składnik), z krzyżykiem
 * PO LEWEJ od nazwy, którym się ją usuwa. */
function buildRemovableChip(label, onRemove){
  return el('span', { class: 'removable-chip' }, [
    el('button', { class: 'removable-chip__remove', 'aria-label': 'Usuń ' + label, onClick: onRemove }, iconEl('close')),
    el('span', {}, label),
  ]);
}

function buildModeSwitcher(){
  const seg = el('div', { class: 'segmented segmented--scroll' });
  SEARCH_MODES.forEach(m => {
    seg.appendChild(el('button', {
      class: SearchState.mode === m.id ? 'is-active' : '',
      onClick: () => { if (SearchState.mode !== m.id) switchSearchMode(m.id); }
    }, m.label));
  });
  return seg;
}

function switchSearchMode(mode){
  SearchState.mode = mode;
  SearchState.query = '';
  SearchState.selectedId = null;
  const input = document.getElementById('searchInput');
  if (input){
    input.value = '';
    const cfg = SEARCH_MODES.find(m => m.id === mode);
    input.placeholder = cfg ? cfg.placeholder : '';
  }
  renderSearchBody();
  // Celowo BEZ input.focus() -- na telefonie fokus na polu tekstowym od razu
  // wysuwa klawiaturę, więc samo przełączenie zakładki (Wszystko/Zestawy/Inne/
  // Wg rolek/Składniki) nie powinno jej otwierać. Pole aktywuje się dopiero,
  // gdy użytkownik sam w nie stuknie.
}

/**
 * Zaczyna budowanie zestawu od podanej rolki spoza trybu "Wg rolek"
 * (np. z przycisku "+" w trybie "Wszystko"): przełącza na "setsByRolls"
 * i dodaje tę rolkę do wyboru, jeśli jeszcze jej tam nie ma -- ten sam
 * efekt, co kliknięcie przycisku "+" na jej kafelku w tamtym trybie.
 */
function startBuildingSet(rollId){
  SearchState.mode = 'setsByRolls';
  SearchState.query = '';
  SearchState.selectedId = null;
  if (!SearchState.selectedRollIds.includes(rollId)) SearchState.selectedRollIds.push(rollId);
  const input = document.getElementById('searchInput');
  if (input){
    input.value = '';
    const cfg = SEARCH_MODES.find(m => m.id === 'setsByRolls');
    input.placeholder = cfg ? cfg.placeholder : '';
  }
  renderSearchBody();
  // Też bez input.focus() -- ten sam powód co w switchSearchMode powyżej.
}

// ---------------------------------------------------------
// Renderery poszczególnych trybów (wywoływane z renderSearchBody,
// tylko gdy nie jesteśmy w widoku szczegółów).
// ---------------------------------------------------------

/**
 * "Wszystko" -- dwa zachowania w jednym trybie:
 *  - PUSTE zapytanie: cała karta menu (rolki + zestawy) jako siatka
 *    kafelków alfabetycznie. Rolka, z której da się zbudować zestaw,
 *    dostaje w rogu kafelka licznik możliwych zestawów oraz przycisk
 *    "+" rozpoczynający budowanie zestawu (patrz startBuildingSet).
 *  - WPISANA fraza: poprzednie, nieczyste (fuzzy) dopasowanie po
 *    rolkach i zestawach razem, lista wyników z etykietą typu i
 *    odznaką procentowego trafienia -- przywrócone na życzenie, bez
 *    liczników/plusów (te dotyczą tylko widoku przeglądowego).
 */
function renderAllMode(body){
  const query = SearchState.query.trim();

  if (!query){
    const list = searchGetAllItems().slice().sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    const rollsInSets = getRollsInSets();
    const grid = el('div', { class: 'roll-picker-grid' });
    list.forEach(item => {
      const isBuildableRoll = item._type === 'roll' && rollsInSets.has(item.id);
      const count = isBuildableRoll ? rollSetCombo(item.id, []) : null;
      grid.appendChild(buildPhotoNameTile(
        item,
        count,
        () => { SearchState.selectedId = item.id; renderSearchBody(); },
        isBuildableRoll ? () => startBuildingSet(item.id) : null,
        () => renderSearchBody()
      ));
    });
    body.appendChild(grid);
    return;
  }

  const results = fuzzySearchList(query, searchGetAllItems());
  if (!results.length){
    body.appendChild(el('div', { class: 'search-empty' }, 'Brak wyników. Spróbuj innej pisowni.'));
    return;
  }
  const rollsInSets = getRollsInSets();
  results.forEach(r => body.appendChild(buildResultRow(r, {
    subLabel: r._type === 'set' ? 'ZESTAW' : 'ROLKA',
    badge: Math.round(r._score * 100) + '%',
    onPlus: (r._type === 'roll' && rollsInSets.has(r.id)) ? () => startBuildingSet(r.id) : null,
    onVersus: () => renderSearchBody(),
  })));
}

function renderSetsMode(body){
  const query = SearchState.query.trim();
  const list = (query ? fuzzySearchList(query, SETS) : SETS.slice())
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'));

  if (!list.length){
    body.appendChild(el('div', { class: 'search-empty' }, 'Brak wyników. Spróbuj innej pisowni.'));
    return;
  }

  const grid = el('div', { class: 'roll-picker-grid' });
  list.forEach(set => grid.appendChild(buildPhotoNameTile(
    set,
    null,
    () => { SearchState.selectedId = set.id; renderSearchBody(); },
    null,
    () => renderSearchBody()
  )));
  body.appendChild(grid);
}

/**
 * "Inne" -- rolki, których nie ma w żadnym SETS.items (nie da się z
 * nich ułożyć zestawu, dostępne tylko à la carte). Ten sam wzorzec co
 * renderSetsMode: wszystko od razu, siatka kafelków, alfabetycznie,
 * tekst tylko zawęża.
 */
function renderOtherMode(body){
  body.appendChild(el('p', { class: 'view-sub', style: 'margin-top:0;' },
    'Pozycje z menu, których nie ma w żadnym zestawie — zamawiane tylko osobno.'));

  const rollsInSets = getRollsInSets();
  const basePool = ROLLS.filter(r => !rollsInSets.has(r.id));

  const query = SearchState.query.trim();
  const list = (query ? fuzzySearchList(query, basePool) : basePool.slice())
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'));

  if (!list.length){
    body.appendChild(el('div', { class: 'search-empty' },
      query ? 'Brak wyników. Spróbuj innej pisowni.' : 'Wszystkie pozycje z menu wchodzą w skład jakiegoś zestawu.'));
    return;
  }

  const grid = el('div', { class: 'roll-picker-grid' });
  list.forEach(roll => grid.appendChild(buildPhotoNameTile(
    roll,
    null,
    () => { SearchState.selectedId = roll.id; renderSearchBody(); },
    null,
    () => renderSearchBody()
  )));
  body.appendChild(grid);
}

function renderSetsByRollsMode(body){
  body.appendChild(el('p', { class: 'view-sub', style: 'margin-top:0;' },
    'Wybierz jedną lub kilka rolek, aby zobaczyć zestawy, w których występują razem. Możesz też wpisać nazwę, żeby przefiltrować listę.'));

  const selectedIds = SearchState.selectedRollIds;
  const selectedSet = new Set(selectedIds);

  if (selectedIds.length){
    const chipRow = el('div', { class: 'chip-row' });
    selectedIds.forEach(id => {
      const roll = rollById(id);
      if (!roll) return;
      chipRow.appendChild(buildRemovableChip(roll.name, () => {
        SearchState.selectedRollIds = SearchState.selectedRollIds.filter(x => x !== id);
        renderSearchBody();
      }));
    });
    body.appendChild(chipRow);
  }

  // Rolki, które mogą współistnieć z już wybranymi (występują z nimi
  // razem przynajmniej w jednym zestawie) -- reszta po prostu znika z
  // listy wyboru, tak samo jak w trybie "Składniki".
  let compatibleIds = null;
  if (selectedIds.length){
    compatibleIds = new Set();
    SETS.forEach(s => {
      if (selectedIds.every(id => s.items.some(it => it.rollId === id))){
        s.items.forEach(it => { if (it.rollId) compatibleIds.add(it.rollId); });
      }
    });
  }

  const rollsInSets = getRollsInSets();
  let pool = ROLLS.filter(r => !selectedSet.has(r.id) && rollsInSets.has(r.id) && (!compatibleIds || compatibleIds.has(r.id)));

  const query = SearchState.query.trim();
  if (query){
    const matchedIds = new Set(fuzzySearchList(query, pool).map(r => r.id));
    pool = pool.filter(r => matchedIds.has(r.id));
  }
  pool = pool.slice().sort((a, b) => a.name.localeCompare(b.name, 'pl'));

  const grid = el('div', { class: 'roll-picker-grid' });
  if (!pool.length){
    grid.appendChild(el('div', { class: 'search-empty' },
      selectedIds.length ? 'Żadna rolka nie łączy się z wybranymi.' : 'Brak pasujących rolek.'));
  } else {
    pool.forEach(r => grid.appendChild(buildPhotoNameTile(
      r,
      rollSetCombo(r.id, selectedIds),
      () => { SearchState.selectedId = r.id; renderSearchBody(); },
      () => {
        SearchState.selectedRollIds.push(r.id);
        SearchState.query = '';
        const input = document.getElementById('searchInput');
        if (input) input.value = '';
        renderSearchBody();
      },
      () => renderSearchBody()
    )));
  }
  body.appendChild(grid);

  if (!selectedIds.length) return;

  const scored = SETS
    .filter(s => selectedIds.every(id => s.items.some(it => it.rollId === id)))
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'));

  if (!scored.length){
    body.appendChild(el('div', { class: 'search-empty' }, 'Żaden zestaw nie zawiera wszystkich wybranych rolek naraz.'));
    return;
  }

  body.appendChild(el('div', { class: 'view-sub' }, `Zestawy zawierające wszystkie wybrane rolki (${scored.length}):`));
  scored.forEach(set => body.appendChild(buildResultRow(set, { subLabel: 'ZESTAW', onVersus: () => renderSearchBody() })));
}

function renderIngredientsMode(body){
  const isSets = SearchState.ingredientsTarget === 'sets';
  const idsKey = isSets ? 'setIds' : 'rollIds';

  body.appendChild(el('p', { class: 'view-sub', style: 'margin-top:0;' },
    isSets
      ? 'Wybierz jeden lub kilka składników, aby zobaczyć zestawy, które je zawierają (za pośrednictwem swoich rolek). Ryż i nori są pominięte — występują niemal w każdej rolce.'
      : 'Wybierz jeden lub kilka składników, aby zobaczyć rolki, które je zawierają. Ryż i nori są pominięte — występują niemal w każdej rolce.'));

  const targetSeg = el('div', { class: 'segmented' }, [
    el('button', {
      class: !isSets ? 'is-active' : '',
      onClick: () => { if (SearchState.ingredientsTarget !== 'rolls'){ SearchState.ingredientsTarget = 'rolls'; renderSearchBody(); } }
    }, 'Rolki'),
    el('button', {
      class: isSets ? 'is-active' : '',
      onClick: () => { if (SearchState.ingredientsTarget !== 'sets'){ SearchState.ingredientsTarget = 'sets'; renderSearchBody(); } }
    }, 'Zestawy'),
  ]);
  body.appendChild(targetSeg);

  const index = getIngredientIndex();
  const selectedKeys = SearchState.selectedIngredientKeys;
  const selectedSet = new Set(selectedKeys);
  const selectedEntries = selectedKeys.map(key => index.find(x => x.key === key)).filter(Boolean);

  if (selectedKeys.length){
    const chipRow = el('div', { class: 'chip-row' });
    selectedKeys.forEach(key => {
      const entry = index.find(x => x.key === key);
      if (!entry) return;
      chipRow.appendChild(buildRemovableChip(entry.label, () => {
        SearchState.selectedIngredientKeys = SearchState.selectedIngredientKeys.filter(k => k !== key);
        renderSearchBody();
      }));
    });
    body.appendChild(chipRow);
  }

  const query = SearchState.query.trim();
  const pool = index.filter(x => !selectedSet.has(x.key));
  const searched = query
    ? pool.filter(x => searchNormalize(x.label).includes(searchNormalize(query)))
    : pool;

  // Liczba przy składniku w pickerze to NIE globalna liczba rolek/zestawów
  // z nim, tylko przecięcie z już wybranymi -- ile pozycji miałoby
  // WSZYSTKIE składniki, gdyby ten też dodać. Bez wybranych składników
  // pokazujemy po prostu jego łączną liczbę w aktywnym trybie (rolki lub
  // zestawy).
  function comboCount(entry){
    const ids = entry[idsKey];
    if (!selectedEntries.length) return ids.size;
    let count = 0;
    ids.forEach(id => {
      if (selectedEntries.every(se => se[idsKey].has(id))) count++;
    });
    return count;
  }

  // Składniki, które w połączeniu z już wybranymi dają 0 wyników, po
  // prostu znikają z listy -- czytelniejsze niż wyszarzony przycisk.
  const filtered = searched
    .map(entry => ({ entry, count: comboCount(entry) }))
    .filter(x => x.count > 0);

  const pickerWrap = el('div', { class: 'chip-row' });
  if (!filtered.length){
    pickerWrap.appendChild(el('div', { class: 'search-empty' }, 'Brak pasujących składników.'));
  } else {
    filtered.forEach(({ entry, count }) => {
      pickerWrap.appendChild(el('button', {
        class: 'chip',
        onClick: () => {
          SearchState.selectedIngredientKeys.push(entry.key);
          SearchState.query = '';
          const input = document.getElementById('searchInput');
          if (input) input.value = '';
          renderSearchBody();
        }
      }, entry.label + ' · ' + count));
    });
  }
  body.appendChild(pickerWrap);

  if (!selectedEntries.length) return;

  // Rolki lub zestawy zawierające WSZYSTKIE wybrane składniki naraz
  // (przecięcie, nie suma).
  const items = isSets ? SETS : ROLLS;
  const scored = items
    .filter(it => selectedEntries.every(se => se[idsKey].has(it.id)))
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'));

  if (!scored.length){
    body.appendChild(el('div', { class: 'search-empty' },
      isSets ? 'Żaden zestaw nie zawiera wszystkich wybranych składników naraz.' : 'Żadna rolka nie zawiera wszystkich wybranych składników naraz.'));
    return;
  }

  const headerText = isSets
    ? `Zestawy zawierające wszystkie wybrane składniki (${scored.length}):`
    : `Rolki zawierające wszystkie wybrane składniki (${scored.length}):`;
  body.appendChild(el('div', { class: 'view-sub' }, headerText));
  scored.forEach(it => body.appendChild(buildResultRow(it, isSets ? { subLabel: 'ZESTAW' } : undefined)));
}

function renderSearchBody(){
  const body = document.getElementById('searchBody');
  clear(body);

  if (SearchState.selectedId){
    const item = itemById(SearchState.selectedId);
    if (!item){ SearchState.selectedId = null; renderSearchBody(); return; }
    const back = el('button', { class: 'search-back', onClick: () => { SearchState.selectedId = null; renderSearchBody(); } }, [
      iconEl('arrowLeft'), 'Do wyników',
    ]);
    body.appendChild(back);
    body.appendChild(item.id[0] === 's' ? renderSetDetailBlock(item, renderSearchBody) : renderRollDetailBlock(item, renderSearchBody));
    return;
  }

  body.appendChild(buildModeSwitcher());

  if (SearchState.mode === 'sets') renderSetsMode(body);
  else if (SearchState.mode === 'other') renderOtherMode(body);
  else if (SearchState.mode === 'setsByRolls') renderSetsByRollsMode(body);
  else if (SearchState.mode === 'ingredients') renderIngredientsMode(body);
  else renderAllMode(body);
}

function initSearch(){
  document.getElementById('searchInput').addEventListener('input', (e) => {
    SearchState.query = e.target.value;
    SearchState.selectedId = null;
    renderSearchBody();
  });
}
