// ---------------------------------------------------------
// Ручні групи СЕМАНТИЧНОЇ схожості інгредієнтів -- на відміну від
// groups.js (візуальна схожість ГОТОВИХ ролів на фото), тут йдеться
// про самі назви складників у списку "Składniki" (search.js,
// getIngredientIndex). Об'єднує різні способи приготування/подачі
// ОДНОГО й того ж інгредієнта (напр. krewetka surowa / gotowana /
// tygrysia / w tempurze) в один пункт вибору -- інакше список забитий
// 5 окремими рядками "Krewetka ...", хоча гравцю, який фільтрує
// рол(к)и "чи є тут крищить", неважливо, як саме вона приготована.
//
// !! ЦЕ НЕ ТЕ САМЕ, що вже робить ingredientCanonicalKey() у search.js.
// Та функція склеює РІЗНІ НАПИСАННЯ ОДНИХ І ТИХ САМИХ слів -- інший
// порядок ("Surowy łosoś" / "Łosoś surowy") чи забута діакритика
// ("Majonez japonski" / "Majonez japoński"). Тут же слова РІЗНІ
// ("gotowana" проти "tygrysia" проти "w tempurze") -- жодна
// автоматична нормалізація їх не зловить, потрібна ручна карта, як
// і для ROLL_GROUPS у groups.js.
//
// Формат кожної групи:
//   key   -- внутрішній ідентифікатор (не показується)
//   label -- текст чіпа в UI (search.js бере його замість
//            "найпоширенішого написання", яке вважає для НЕ
//            згрупованих інгредієнтів)
//   keys  -- масив canonical-ключів, ЯК ЇХ РАХУЄ ingredientCanonicalKey
//            в search.js (searchNormalize кожного слова, слова
//            відсортовані). Порахувати ключ для нового варіанту
//            найпростіше просто викликавши цю ж функцію в консолі,
//            напр. ingredientCanonicalKey("Krewetka w tempurze").
//
// Інгредієнт, якого немає в жодній групі нижче, лишається окремим
// пунктом списку -- так само, як roLка поза ROLL_GROUPS лишається
// "Pozostałe" у groups.js.
// ---------------------------------------------------------

var INGREDIENT_GROUPS = [
  {
    key: 'krewetka',
    label: 'Krewetka (dowolna forma)',
    keys: [
      'krewetka',              // Krewetka
      'gotowana krewetka',     // Krewetka gotowana
      'krewetka tygrysia',     // Krewetka tygrysia
      'krewetka tempurze w',   // Krewetka w tempurze
      'krewetek tempurze w',   // Krewetek w tempurze (odmiana zapisu w danych źródłowych)
    ],
  },
  {
    key: 'losos',
    label: 'Łosoś (dowolna forma)',
    keys: [
      'losos',              // Łosoś
      'losos surowy',       // Łosoś surowy / Surowy łosoś / Łosos surowy
      'losos smazony',      // Łosoś smażony
      'losos wedzony',      // Łosoś wędzony / Wędzony łosoś
      'grillowany losos',   // Łosoś grillowany
      'losos opalony',      // Łosoś opalony
      'losos opalany',      // Opalany łosoś
    ],
  },
  {
    key: 'tunczyk',
    label: 'Tuńczyk (dowolna forma)',
    keys: [
      'tunczyk',           // Tuńczyk
      'surowy tunczyk',    // Tuńczyk surowy / Surowy tuńczyk
      'smazony tunczyk',   // Tuńczyk smażony / Smażony tuńczyk
      'pieczony tunczyk',  // Tuńczyk pieczony
    ],
  },
  {
    key: 'tobiko',
    label: 'Tobiko / kawior tobiko',
    keys: [
      'tobiko',         // Tobiko
      'tobikko',        // Tobikko
      'red tobikko',    // Tobikko red
      'kawior tobiko',  // Kawior tobiko / Kawior tobikо (кирилична "о" в одному з файлів)
    ],
  },
  {
    key: 'unagi',
    label: 'Unagi / sos unagi',
    keys: [
      'unagi',      // Unagi
      'sos unagi',  // Sos unagi
    ],
  },
  {
    key: 'spicy',
    label: 'Sos spicy',
    keys: [
      'sos spicy',  // Sos spicy / Spicy sos
      'spicy',      // Spicy
    ],
  },
];

/** canonical ingredient key (search.js) -> group key (INGREDIENT_GROUPS[].key) */
var INGREDIENT_GROUP_OF = {};
INGREDIENT_GROUPS.forEach(g => g.keys.forEach(k => { INGREDIENT_GROUP_OF[k] = g.key; }));

/** group key -> curated display label */
var INGREDIENT_GROUP_LABEL = {};
INGREDIENT_GROUPS.forEach(g => { INGREDIENT_GROUP_LABEL[g.key] = g.label; });

if (typeof module !== 'undefined') {
  module.exports = { INGREDIENT_GROUPS, INGREDIENT_GROUP_OF, INGREDIENT_GROUP_LABEL };
}
