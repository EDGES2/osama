// ---------------------------------------------------------
// Режим Versus — вільне порівняння будь-якої кількості ролів.
//
// Це не окрема "картка" з фіксованими 2 позиціями, а глобальний вибір
// (VersusState.ids), який можна наповнювати звідусіль: кнопка "VS" у
// пошуку -- на картках і рол(о)к, і сетів, в УСІХ категоріях, де вони
// показані (search.js: "all", "sets", "other", "setsByRolls"; лівіше
// "+", де він є) -- і на картці деталей рол(к)и чи сета (render.js).
// Переглядається кнопкою "VS" у topbarze.
//
// Склад показаний як таблиця: рядки -- інгредієнти (об'єднання по
// всіх вибраних ролках, дублікати написання одного й того ж
// інгредієнта згорнуті так само, як у search.js), стовпці -- вибрані
// роли, з ✓/– чи є цей інгредієнт у цій ролці. Найпоширеніші (спільні)
// інгредієнти -- зверху, унікальні -- знизу, так одразу видно і що
// спільне, і чим ролки відрізняються.
//
// Стовпці згруповані за groups.js (та ж візуальна схожість, що й для
// дистракторів у квізах) -- ролки з однієї "родини" стоять поруч, з
// підписом групи над ними.
//
// Порівняння ЗЕСТАВІВ не існує як окрема сутність -- замість цього
// додавання зеставу (toggleVersusSet нижче) просто вкидає в те саме
// VersusState.ids усі його сфотографовані рол(к)и одразу, позначені
// (VersusState.setOrigins) звідки вони прийшли. Завдяки цьому:
//   - вони одразу стають звичайними стовпцями і підхоплюються тим самим
//     групуванням за візуальною схожістю (groupedVersusRolls) -- два
//     додані зестави самі перемішаються по спільних "родинах" замість
//     того, щоб лежати одним блоком;
//   - під назвою рол(к)и в шапці таблиці з'являється маленька мітка з
//     назвою зеставу(ів), звідки вона взялась (versusOriginLabel).
// ---------------------------------------------------------

var VersusState = {
  ids: [],            // roll id-и, порядок = порядок додавання
  setOrigins: {},      // rollId -> Set(setId) -- з якого зеставу(ів) ця рол(к)а
                       // потрапила в порівняння через toggleVersusSet; відсутній
                       // запис = рол(к)у додано вручну (toggleVersus), не через
                       // зестав. Суто інформаційне поле (мітка в шапці стовпця +
                       // чіпи "Z zestawów" в тулбарі) -- на самі рядки/стовпці
                       // таблиці не впливає.
  pickerOpen: false,   // чи розгорнута секція додавання під таблицею
                       // (коли VersusState.ids порожній, секція показується завжди,
                       // незалежно від цього прапорця -- дивись renderVersusView)
  pickerTab: 'rolls',  // 'rolls' | 'sets' -- яку секцію показує buildVersusPicker
};

function isInVersus(rollId){ return VersusState.ids.indexOf(rollId) !== -1; }

function toggleVersus(rollId){
  const i = VersusState.ids.indexOf(rollId);
  if (i === -1) {
    VersusState.ids.push(rollId);
  } else {
    VersusState.ids.splice(i, 1);
    delete VersusState.setOrigins[rollId]; // ручне видалення -- прибираємо й мітку "з якого зеставу"
  }
  if (typeof updateVersusBadge === 'function') updateVersusBadge();
}

function clearVersus(){
  VersusState.ids = [];
  VersusState.setOrigins = {};
  if (typeof updateVersusBadge === 'function') updateVersusBadge();
}

/** Той самий принцип згортання написань, що й ingredientCanonicalKey
 * у search.js (слова після searchNormalize, відсортовані) -- окрема
 * маленька копія тут, щоб versus.js не залежав від порядку підключення
 * search.js. */
function versusIngredientKey(name){
  return searchNormalize(name).split(' ').filter(Boolean).sort().join(' ');
}

/**
 * Рядки порівняльної таблиці: один рядок на унікальний інгредієнт
 * (об'єднання по всіх переданих ролках), з набором id ролок, де він є.
 * Сортування -- спершу найпоширеніші (спільні для більшості вибраних
 * позицій), далі за алфавітом.
 */
function buildVersusRows(rolls){
  const map = new Map(); // key -> { label, presentIds: Set }
  rolls.forEach(roll => {
    const seen = new Set();
    (roll.ingredients || []).forEach(ing => {
      const key = versusIngredientKey(ing.name);
      if (!key || seen.has(key)) return;
      seen.add(key);
      if (!map.has(key)) map.set(key, { label: ing.name, presentIds: new Set() });
      map.get(key).presentIds.add(roll.id);
    });
  });
  const rows = [...map.values()];
  rows.sort((a, b) => {
    const diff = b.presentIds.size - a.presentIds.size;
    if (diff !== 0) return diff;
    return a.label.localeCompare(b.label, 'pl');
  });
  return rows;
}

/**
 * Вибрані ролки, згруповані по ROLL_GROUP_OF (groups.js) і впорядковані
 * кластерами -- кластер йде в позиції першої обраної ролки з нього, а
 * всередині кластера зберігається порядок додавання. Ролки без
 * curated-групи потрапляють в один спільний кластер UNGROUPED_LABEL.
 */
function groupedVersusRolls(){
  const rolls = VersusState.ids.map(id => rollById(id)).filter(Boolean);
  const buckets = new Map(); // groupKey -> roll[]
  rolls.forEach(r => {
    const key = ROLL_GROUP_OF[r.id] || '__ungrouped__';
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(r);
  });
  const orderedKeys = [...buckets.keys()].sort((a, b) => {
    const ia = rolls.indexOf(buckets.get(a)[0]);
    const ib = rolls.indexOf(buckets.get(b)[0]);
    return ia - ib;
  });
  return orderedKeys.map(key => ({
    key,
    label: key === '__ungrouped__' ? UNGROUPED_LABEL : ROLL_GROUP_LABEL[key],
    rolls: buckets.get(key),
  }));
}

// ---------------------------------------------------------
// Dodawanie CAŁEGO zestawu do porównania naraz -- patrz komentarz
// na górze pliku. "Członkowie" zestawu to tylko te jego pozycje, które
// mają własne zdjęcie (item.rollId) -- ten sam warunek, co w
// renderSetDetailBlock (render.js) i buildSetCandidates (similarity.js):
// pozycja bez rollId nie ma własnej listy składników, więc nie da się
// jej narysować jako kolumny w tabeli porównania.
// ---------------------------------------------------------

function setMemberRollIds(setId){
  const set = SETS.find(s => s.id === setId);
  return set ? set.items.filter(it => it.rollId).map(it => it.rollId) : [];
}

/** Чи ВСІ сфотографовані рол(к)и зеставу зараз є в порівнянні -- керує
 * станом is-on плитки зеставу в пікері. */
function isSetFullyInVersus(setId){
  const ids = setMemberRollIds(setId);
  return ids.length > 0 && ids.every(id => VersusState.ids.indexOf(id) !== -1);
}

/** Знімає мітку setId з усіх рол(о)к цього зеставу; рол(к)а, для якої
 * це була ОСТАННЯ мітка (не додана вручну і не з іншого досі активного
 * зеставу), при цьому й сама покидає порівняння. Використовується і
 * плиткою зеставу в пікері (коли зестав уже повністю доданий -- тоді
 * тап на нього означає "прибери"), і окремим чіпом "Z zestawów" у
 * тулбарі таблиці. */
function removeSetOriginFromVersus(setId){
  setMemberRollIds(setId).forEach(id => {
    const origins = VersusState.setOrigins[id];
    if (!origins) return; // додано вручну, без мітки зеставу -- не чіпаємо
    origins.delete(setId);
    if (origins.size === 0){
      delete VersusState.setOrigins[id];
      const i = VersusState.ids.indexOf(id);
      if (i !== -1) VersusState.ids.splice(i, 1);
    }
  });
  if (typeof updateVersusBadge === 'function') updateVersusBadge();
}

/**
 * Тап на плитку зеставу в пікері: якщо зестав ще не повністю в
 * порівнянні -- додає всі його рол(к)и (ті, кого там ще нема) і мітить
 * кожну setId (рол(к)а може накопичити кілька міток одразу, якщо
 * входить одразу в декілька доданих зеставів -- тоді бейдж у шапці
 * покаже обидві назви через кому). Якщо зестав УЖЕ повністю доданий --
 * тап знімає саме його мітку (removeSetOriginFromVersus), а не рол(к)и
 * наосліп: рол(к)а, додана вручну ДО того, як з'явився цей зестав, або
 * потрібна ще й іншому досі активному зеставу, залишається на місці.
 * (Один нюанс, яким свідомо нехтуємо: якщо рол(к)у додали вручну ПІСЛЯ
 * того, як вона вже потрапила сюди через цей зестав, друга дія -- це
 * no-op, і мітки зеставу вона так і не втрачає, тож при знятті зеставу
 * піде разом з ним. Розрізнити ці два випадки зсередини неможливо, а
 * трапляється це рідко.)
 */
function toggleVersusSet(setId){
  const memberIds = setMemberRollIds(setId);
  if (!memberIds.length) return;
  if (isSetFullyInVersus(setId)){
    removeSetOriginFromVersus(setId);
    return;
  }
  memberIds.forEach(id => {
    if (VersusState.ids.indexOf(id) === -1) VersusState.ids.push(id);
    if (!VersusState.setOrigins[id]) VersusState.setOrigins[id] = new Set();
    VersusState.setOrigins[id].add(setId);
  });
  if (typeof updateVersusBadge === 'function') updateVersusBadge();
}

/** Назви зеставів (через кому), звідки рол(к)а потрапила в порівняння,
 * або '' якщо додана вручну -- маленька мітка під її ім'ям у шапці
 * стовпця таблиці. */
function versusOriginLabel(rollId){
  const origins = VersusState.setOrigins[rollId];
  if (!origins || !origins.size) return '';
  return [...origins]
    .map(id => { const s = SETS.find(x => x.id === id); return s ? s.name : id; })
    .sort((a, b) => a.localeCompare(b, 'pl'))
    .join(', ');
}

/** Rolka jest "wspólna" dla porównania, gdy pochodzi jednocześnie z więcej
 * niż jednego z aktywnych zestawów (VersusState.setOrigins[rollId].size >= 2)
 * -- czyli oba (lub więcej) dodane "Z zestawów" zestawy faktycznie się
 * pokrywają na tej konkretnej rolce. Rolki dodane ręcznie (brak wpisu w
 * setOrigins) albo należące tylko do jednego aktywnego zestawu nie liczą
 * się jako wspólne, nawet jeśli są wizualnie bardzo podobne -- to pole mówi
 * wyłącznie o faktycznej przynależności do zestawów, nie o podobieństwie z
 * groups.js. Używane do zielonej nakładki na zdjęciu kolumny w
 * renderVersusView. */
function isSharedVersusRoll(rollId){
  const origins = VersusState.setOrigins[rollId];
  return !!origins && origins.size >= 2;
}

/** Усі зестави, з яких зараз щось є в порівнянні -- для чіпів "Z
 * zestawów" над таблицею (кожен чіп прибирає свій зестав одним тапом
 * через removeSetOriginFromVersus). */
function activeVersusSetOrigins(){
  const ids = new Set();
  Object.values(VersusState.setOrigins).forEach(origins => origins.forEach(id => ids.add(id)));
  return [...ids]
    .map(id => SETS.find(s => s.id === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, 'pl'));
}

/**
 * Picker for adding rolls to the comparison right here in the Versus
 * tab, browsed by the same hand-curated visual-similarity groups from
 * groups.js that already drive quiz distractors and the column
 * clustering above (see groupedVersusRolls) -- the whole point being
 * "which rolls could I mix this one up with by sight", so picking by
 * that same grouping (rather than an alphabetical list or a text
 * search) is what actually helps here. Rolls with no curated group
 * fall into one trailing UNGROUPED_LABEL section, same fallback as
 * groupLabelOf() in groups.js.
 *
 * Each roll is a small photo tile; tapping it toggles membership via
 * the same toggleVersus() used everywhere else, then re-renders this
 * whole view via `root` so the table above (or the empty state) picks
 * up the change immediately.
 */
function buildVersusRollPicker(root){
  const wrap = el('div', { class: 'versus-picker' });
  wrap.appendChild(el('h3', { class: 'versus-picker__title' }, 'Dodaj rolki wg grup podobieństwa'));
  wrap.appendChild(el('p', { class: 'view-sub', style: 'margin-top:-4px;' },
    'Pogrupowane tak, jak wyglądają na zdjęciu -- stuknij, aby dodać lub usunąć rolkę z porównania.'));

  const groupedIds = new Set(ROLL_GROUPS.flatMap(g => g.ids));
  const sections = ROLL_GROUPS.map(g => ({ label: g.label, rolls: g.ids.map(rollById).filter(Boolean) }));
  const ungrouped = ROLLS.filter(r => !groupedIds.has(r.id));
  if (ungrouped.length) sections.push({ label: UNGROUPED_LABEL, rolls: ungrouped });

  sections.forEach(sec => {
    if (!sec.rolls.length) return;
    const section = el('div', { class: 'versus-picker__group' });
    section.appendChild(el('div', { class: 'versus-picker__group-title' }, sec.label));
    const row = el('div', { class: 'versus-picker__row' });
    sec.rolls.forEach(roll => {
      const on = isInVersus(roll.id);
      const tile = el('button', {
        class: 'versus-picker__tile' + (on ? ' is-on' : ''),
        type: 'button',
        'aria-pressed': on ? 'true' : 'false',
        'aria-label': (on ? 'Usuń z porównania: ' : 'Dodaj do porównania: ') + roll.name,
        onClick: () => { toggleVersus(roll.id); VersusState.pickerOpen = true; renderVersusView(root); },
      });
      const imgWrap = el('span', { class: 'versus-picker__tile-photo' });
      const img = el('img', { class: 'versus-picker__tile-img', src: roll.image, alt: '', loading: 'lazy' });
      img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
      imgWrap.appendChild(img);
      imgWrap.appendChild(el('span', { class: 'versus-picker__tile-check' }, iconEl('check')));
      const priceLabel = formatPrice(roll.price);
      if (priceLabel) imgWrap.appendChild(el('span', { class: 'versus-picker__tile-price' }, priceLabel));
      tile.appendChild(imgWrap);
      tile.appendChild(el('span', { class: 'versus-picker__tile-name' }, roll.name));
      row.appendChild(tile);
    });
    section.appendChild(row);
    wrap.appendChild(section);
  });

  return wrap;
}

/**
 * Picker for adding a whole SET to the comparison in one tap -- every
 * photographed roll it contains gets pushed into VersusState.ids and
 * tagged with this set's id (toggleVersusSet), so two added sets land
 * as ordinary columns and fall into place via the same visual-group
 * clustering as everything else (groupedVersusRolls). A tile is "on"
 * when every one of the set's photographed rolls is already present.
 * Sets with nothing photographable (no member has its own rollId)
 * are skipped -- there'd be nothing to add.
 */
function buildVersusSetPicker(root){
  const wrap = el('div', { class: 'versus-picker' });
  wrap.appendChild(el('h3', { class: 'versus-picker__title' }, 'Dodaj cały zestaw'));
  wrap.appendChild(el('p', { class: 'view-sub', style: 'margin-top:-4px;' },
    'Dodaje naraz wszystkie sfotografowane rolki z zestawu, oznaczone jego nazwą w tabeli -- dobre do zestawienia dwóch zestawów obok siebie.'));

  const sets = SETS.filter(s => setMemberRollIds(s.id).length).slice().sort((a, b) => a.name.localeCompare(b.name, 'pl'));
  if (!sets.length){
    wrap.appendChild(el('div', { class: 'search-empty' }, 'Brak zestawów z własnymi zdjęciami rolek.'));
    return wrap;
  }

  const row = el('div', { class: 'versus-picker__row' });
  sets.forEach(set => {
    const on = isSetFullyInVersus(set.id);
    const tile = el('button', {
      class: 'versus-picker__tile' + (on ? ' is-on' : ''),
      type: 'button',
      'aria-pressed': on ? 'true' : 'false',
      'aria-label': (on ? 'Usuń zestaw z porównania: ' : 'Dodaj zestaw do porównania: ') + set.name,
      onClick: () => { toggleVersusSet(set.id); VersusState.pickerOpen = true; renderVersusView(root); },
    });
    const imgWrap = el('span', { class: 'versus-picker__tile-photo' });
    const img = el('img', { class: 'versus-picker__tile-img', src: set.image, alt: '', loading: 'lazy' });
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
    imgWrap.appendChild(img);
    imgWrap.appendChild(el('span', { class: 'versus-picker__tile-check' }, iconEl('check')));
    const priceLabel = formatPrice(set.price);
    if (priceLabel) imgWrap.appendChild(el('span', { class: 'versus-picker__tile-price' }, priceLabel));
    tile.appendChild(imgWrap);
    tile.appendChild(el('span', { class: 'versus-picker__tile-name' }, set.name));
    row.appendChild(tile);
  });
  wrap.appendChild(row);

  return wrap;
}

/** Umbrella picker shown under the Versus table (and always, in the
 * empty state): a Rolki/Zestawy tab switch on top of either
 * buildVersusRollPicker (single rolls, by visual group) or
 * buildVersusSetPicker (whole sets) below it. */
function buildVersusPicker(root){
  const wrap = el('div', { class: 'versus-picker-shell' });

  const seg = el('div', { class: 'segmented' }, [
    el('button', {
      class: VersusState.pickerTab !== 'sets' ? 'is-active' : '',
      onClick: () => { if (VersusState.pickerTab !== 'rolls'){ VersusState.pickerTab = 'rolls'; renderVersusView(root); } }
    }, 'Rolki'),
    el('button', {
      class: VersusState.pickerTab === 'sets' ? 'is-active' : '',
      onClick: () => { if (VersusState.pickerTab !== 'sets'){ VersusState.pickerTab = 'sets'; renderVersusView(root); } }
    }, 'Zestawy'),
  ]);
  wrap.appendChild(seg);
  wrap.appendChild(VersusState.pickerTab === 'sets' ? buildVersusSetPicker(root) : buildVersusRollPicker(root));

  return wrap;
}

function renderVersusView(root){
  clear(root);
  const view = el('div', { class: 'view versus-view' });

  view.appendChild(el('h2', { class: 'view-title' }, 'Versus'));
  view.appendChild(el('p', { class: 'view-sub' },
    'Porównaj dowolną liczbę rolek obok siebie — skład jak w tabeli, od składników wspólnych dla większości do tych, które je różnią.'));

  if (!VersusState.ids.length){
    view.appendChild(el('div', { class: 'versus-empty' }, [
      el('p', {}, 'Nic jeszcze nie dodano do porównania.'),
      el('p', { style: 'font-size:13px;' }, 'Wybierz rolki poniżej, albo przejdź do pełnej wyszukiwarki.'),
      el('button', { class: 'btn btn-ghost', onClick: () => switchView('menu') }, 'Przejdź do wyszukiwania'),
    ]));
    view.appendChild(buildVersusPicker(root));
    root.appendChild(view);
    return;
  }

  const clusters = groupedVersusRolls();
  const orderedRolls = clusters.flatMap(c => c.rolls);
  const rows = buildVersusRows(orderedRolls);
  // Kolumny (rolki), które trafiają do porównania jako "karta" na całą
  // wysokość tabeli -- patrz isSharedVersusRoll. Liczone raz i używane i
  // przy nagłówku kolumny (poniżej), i przy każdej komórce ciała tabeli,
  // żeby cała pionowa kolumna miała jednolite zielone tło, a nie tylko jej
  // górna część.
  const sharedRollIds = new Set(orderedRolls.filter(r => isSharedVersusRoll(r.id)).map(r => r.id));

  view.appendChild(el('div', { class: 'versus-toolbar' }, [
    el('span', {}, orderedRolls.length + (orderedRolls.length === 1 ? ' pozycja w porównaniu' : ' pozycji w porównaniu')),
    el('div', { style: 'display:flex;gap:8px;' }, [
      el('button', {
        class: 'chip' + (VersusState.pickerOpen ? ' is-on' : ''),
        onClick: () => { VersusState.pickerOpen = !VersusState.pickerOpen; renderVersusView(root); }
      }, VersusState.pickerOpen ? 'Ukryj dodawanie' : '+ Dodaj rolki'),
      el('button', { class: 'chip', onClick: () => { clearVersus(); renderVersusView(root); } }, 'Wyczyść wszystko'),
    ]),
  ]));

  // Zestawy reprezentowane teraz w tabeli (przez swoje rolki) -- każdy
  // chip usuwa dokładnie swój zestaw (removeSetOriginFromVersus), nie
  // dotykając rolek dodanych ręcznie albo należących też do innego,
  // wciąż aktywnego zestawu. Puste, gdy wszystko dodano ręcznie.
  const activeOrigins = activeVersusSetOrigins();
  if (activeOrigins.length){
    const originRow = el('div', { class: 'chip-row versus-origin-row' }, [
      el('span', { class: 'versus-origin-row__label' }, 'Z zestawów:'),
    ]);
    activeOrigins.forEach(set => {
      originRow.appendChild(buildRemovableChip(set.name, () => { removeSetOriginFromVersus(set.id); renderVersusView(root); }));
    });
    view.appendChild(originRow);

    // Legenda do zielonej nakładki poniżej -- pokazujemy tylko wtedy, gdy
    // faktycznie jest co tłumaczyć: 2+ zestawy w porównaniu I przynajmniej
    // jedna rolka, która się między nimi powtarza (isSharedVersusRoll).
    if (activeOrigins.length > 1 && sharedRollIds.size){
      view.appendChild(el('p', { class: 'versus-shared-hint' }, [
        el('span', { class: 'versus-shared-hint__swatch', 'aria-hidden': 'true' }),
        'zielone tło karty = rolka wspólna dla kilku wybranych zestawów',
      ]));
    }
  }

  const scrollWrap = el('div', { class: 'versus-scroll' });
  const table = el('table', { class: 'versus-table' });

  const groupHeadRow = el('tr');
  groupHeadRow.appendChild(el('th', { class: 'versus-corner', scope: 'col' }));
  clusters.forEach(c => {
    groupHeadRow.appendChild(el('th', {
      class: 'versus-group-head', scope: 'col', colspan: String(c.rolls.length),
    }, c.label));
  });

  const colHeadRow = el('tr');
  colHeadRow.appendChild(el('th', { class: 'versus-corner versus-corner--label', scope: 'col' }, 'Składnik'));
  orderedRolls.forEach(roll => {
    const col = el('div', { class: 'versus-col' });
    const shared = sharedRollIds.has(roll.id);
    const originLabel = versusOriginLabel(roll.id);
    const photoBox = buildPhotoBox(roll.image, roll.name, { boxClass: 'versus-col__photo', ticket: formatTicket(roll.id) });
    photoBox.appendChild(el('button', {
      class: 'versus-col__remove',
      'aria-label': 'Usuń z porównania: ' + roll.name,
      onClick: () => { toggleVersus(roll.id); renderVersusView(root); },
    }, iconEl('close')));
    const priceLabel = formatPrice(roll.price);
    if (priceLabel) photoBox.appendChild(el('span', { class: 'versus-col__price' }, priceLabel));
    col.appendChild(photoBox);
    col.appendChild(el('div', { class: 'versus-col__name' }, roll.name));
    if (originLabel){
      col.appendChild(el('div', { class: 'versus-col__origin', title: 'Dodano z zestawu: ' + originLabel }, originLabel));
    }
    // Zielone tło "karty" na CAŁEJ komórce nagłówka (nie na samym zdjęciu --
    // patrz isSharedVersusRoll wyżej) dla rolek wspólnych dla >=2 dodanych
    // zestawów.
    colHeadRow.appendChild(el('th', {
      class: 'versus-col-head' + (shared ? ' is-shared' : ''),
      scope: 'col',
      title: shared ? ('Rolka wspólna dla kilku porównywanych zestawów: ' + originLabel) : null,
    }, col));
  });

  table.appendChild(el('thead', {}, [groupHeadRow, colHeadRow]));

  const tbody = el('tbody');
  rows.forEach(row => {
    const tr = el('tr');
    tr.appendChild(el('th', { class: 'versus-row-label', scope: 'row' }, row.label));
    orderedRolls.forEach(roll => {
      const has = row.presentIds.has(roll.id);
      const cls = 'versus-cell' + (has ? ' is-yes' : ' is-no') + (sharedRollIds.has(roll.id) ? ' is-shared' : '');
      tr.appendChild(el('td', { class: cls }, has ? '✓' : '–'));
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  scrollWrap.appendChild(table);
  view.appendChild(scrollWrap);

  if (VersusState.pickerOpen) view.appendChild(buildVersusPicker(root));

  root.appendChild(view);
}
