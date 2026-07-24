// Auto-generated menu data. Do not edit by hand -- regenerate from source files.
//
// Each roll's `ingredients` entry is { name, grams, qty }:
//   name  -- ingredient text, same strings used everywhere else (search,
//            groups, quiz captions, versus table rows) -- edit this and
//            everything downstream still works, nothing keys off it.
//   grams -- weight of that ingredient in the roll, or null if not weighed yet.
//   qty   -- piece count for that ingredient (e.g. 3 shrimp, 2 cheese slices),
//            or null when it is not counted in discrete pieces / not known.
// `weightGrams` on the roll itself is the total weight of the finished roll,
// taken straight from the source weighing rather than summed from the lines
// above (the two can differ by a gram or two from rounding). null until weighed.
//
// Right now only the three new burgers (r088-r090) have real numbers; every
// other roll carries the same shape with null grams/qty/weightGrams. Filling
// one in later is just replacing that null with a number -- no other file
// needs to change (render.js/cards.js show it automatically when present).
//
// `price` (on both a ROLLS entry and a SETS entry) is the menu price in PLN,
// same "null until known" convention as weightGrams above -- it's entirely
// optional, so leave it null for anything not priced yet. Once set to a
// number, render.js/cards.js pick it up automatically and show it as a
// small gold price tag on the flashcard and on the detail view; nothing
// else needs to change.
//
// `comment` is a free-text note for anything that doesn't fit the
// structured fields above -- e.g. "sos podawany osobno", "ostre",
// "dostępne na zapytanie". It's optional and independent at three
// separate levels:
//   - inside one ingredients[] entry -> { name, grams, qty, comment },
//     a note about that specific ingredient. Shown as a second line
//     under the ingredient's own name in every ingredient list.
//   - top-level on a ROLLS entry, sibling of `price` -- a note about
//     the whole roll. Shown under the price tag on the roll's detail
//     view and flashcard back.
//   - top-level on a SETS entry, sibling of `price` -- same, for the
//     whole set.
// Unlike grams/qty/price above, the key doesn't need to be present on
// every object -- a missing `comment` is treated exactly like a null
// one (render.js's buildCommentNote / buildIngredientList), so only
// add it where there's actually something to say. Nothing else needs
// to change.
var ROLLS = [
  {
    "id": "r001",
    "name": "Awokado roll z krewetką",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Mango", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
      { "name": "Krewetka tygrysowa", "grams": 35, "qty": null }, 
      { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Sezam", "grams": null, "qty": null, "comment": "Покрите" }
    ],
    "weightGrams": 290,
    "needsSauce": true,
    "price": 42,
    "image": "images/r001.webp"
  },
  {
    "id": "r002",
    "name": "Awokado roll z łososiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Serek", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Łosoś surowy", "grams": 35, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 300,
    "needsSauce": true,
    "price": 42,
    "image": "images/r002.webp"
  },
  {
    "id": "r003",
    "name": "Awokado roll z mango",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Tobiko", "grams": 5, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
        { "name": "Łosoś smażony", "grams": 35, "qty": null },
        { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Mango", "grams": 20, "qty": null }
    ],
    "weightGrams": 295,
    "needsSauce": true,
    "price": 46,
    "image": "images/r003.webp"
  },
  {
    "id": "r004",
    "name": "Black Mak Roll",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 40, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
        { "name": "Łosoś smażony", "grams": 40, "qty": null },
      { "name": "Sezam czarny", "grams": 20, "qty": null },
      { "name": "Sos unagi", "grams": 10, "qty": null }
    ],
    "weightGrams": 290,
    "needsSauce": true,
    "price": 42,
    "image": "images/r004.webp"
  },
  {
    "id": "r005",
    "name": "Blaze roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1, "comment": "В середину" },
      { "name": "Ryż", "grams": 140, "qty": null, "comment": "В середину" },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null, "comment": "В середину" },
      { "name": "Węgorz", "grams": 40, "qty": null, "comment": "В середину" },
      { "name": "Ogórek", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Ser Gouda", "grams": 40, "qty": null },
      { "name": "Majonez japonski", "grams": 20, "qty": null },
      { "name": "Sos unagi", "grams": 10, "qty": null, "comment": "Поливаємо" }
    ],
    "weightGrams": 300,
    "needsSauce": true,
    "price": 43,
      "comment": "Шапочка: Сирний заміс 60",
    "image": "images/r005.webp"
  },
  {
    "id": "r006",
    "name": "Burger Cheezy - Serowa Bomba",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 2 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 40, "qty": null },
      { "name": "Mango", "grams": 30, "qty": null },
      { "name": "Ser Cheddar", "grams": 45, "qty": null },
      { "name": "Ser Gouda", "grams": 40, "qty": null },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "Tempura", "grams": 50, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 390,
    "needsSauce": true,
    "price": 38,
    "image": "images/r006.webp"
  },
  {
    "id": "r007",
    "name": "Burger z krewetkami i tobiko — Wybór premium!",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 2 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 70, "qty": null },
      { "name": "Tobikko", "grams": 10, "qty": null },
      { "name": "Tykwa marynowana", "grams": 35, "qty": null },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "Tempura", "grams": 50, "qty": null },
      { "name": "Spicy majo", "grams": 10, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 420,
    "needsSauce": true,
    "price": 69,
    "image": "images/r007.webp"
  },
  {
    "id": "r008",
    "name": "Burger z łososiem - Bestseller!",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 2 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 35, "qty": null },
      { "name": "Łosoś surowy", "grams": 70, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
      { "name": "Ser Cheddar", "grams": 30, "qty": 2 },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "Tempura", "grams": 50, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 420,
    "needsSauce": true,
    "price": 58,
    "image": "images/r008.webp"
  },
  {
    "id": "r009",
    "name": "Burger z łososiem smażonym - Totalne must try!",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 2 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Serek Philadelphia", "grams": 35, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Łosoś smażony", "grams": 70, "qty": null },
      { "name": "Ser Cheddar", "grams": 30, "qty": 2 },
      { "name": "Sezam biały", "grams": 5, "qty": null },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "Tempura", "grams": 50, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 405,
    "needsSauce": true,
    "price": 63,
    "image": "images/r009.webp"
  },
  {
    "id": "r010",
    "name": "Burger ze smazonym tunczykiem i mango - Wyjątkowy Smak!",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 2 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Mango", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Tuńczyk smażony", "grams": 60, "qty": null },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "Tempura", "grams": 50, "qty": null },
      { "name": "Spicy majo", "grams": 10, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 395,
    "needsSauce": true,
    "price": 56,
    "image": "images/r010.webp"
  },
  {
    "id": "r011",
    "name": "California z krewetką w tempurze owijane selekcją ryb",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ogórek", "grams": 7, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 30, "qty": null },
      { "name": "Sriracha", "grams": 10, "qty": null },
      { "name": "Łosoś surowy", "grams": 25, "qty": null },
      { "name": "Tuńczyk", "grams": 25, "qty": null }
    ],
    "weightGrams": 237,
    "needsSauce": true,
    "price": 53,
    "image": "images/r011.webp"
  },
  {
    "id": "r012",
    "name": "California z łososiem",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Surowy łosoś", "grams": 35, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Ser Philadelphia", "grams": 40, "qty": null },
      { "name": "Masago", "grams": 20, "qty": null }
    ],
    "weightGrams": 255,
    "needsSauce": false,
    "price": 40,
    "image": "images/r012.webp"
  },
  {
    "id": "r013",
    "name": "California z łososiem w kawiorze",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Masago", "grams": 20, "qty": null, "comment": "На горі" },
      { "name": "Filet z łososia", "grams": 35, "qty": null },
      { "name": "Majonez japoński", "grams": 10, "qty": null }
    ],
    "weightGrams": 255,
    "needsSauce": false,
    "price": 42,
    "image": "images/r013.webp"
  },
  {
    "id": "r014",
    "name": "California z łososiem w sezamie",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Filet z łososia", "grams": 35, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Majonez japoński", "grams": 10, "qty": null },
      { "name": "Sezam", "grams": 20, "qty": null }
    ],
    "weightGrams": 255,
    "needsSauce": false,
    "price": 37,
    "image": "images/r014.webp"
  },
  {
    "id": "r015",
    "name": "California z łososiem w tempurze owijane mango",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ogórek", "grams": 7, "qty": null },
      { "name": "Sriracha", "grams": 10, "qty": null },
      { "name": "Łosoś surowy", "grams": 30, "qty": null },
      { "name": "Tykwa marynowana", "grams": 10, "qty": null },
      { "name": "Mango", "grams": 40, "qty": null }
    ],
    "weightGrams": 237,
    "needsSauce": true,
    "price": 35,
    "image": "images/r015.webp"
  },
  {
    "id": "r016",
    "name": "California z pieczonym łososiem i tykwą marynowaną",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Tykwa marynowana", "grams": 20, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Mango", "grams": 20, "qty": null },
      { "name": "Łosoś smażony", "grams": 40, "qty": null },
      { "name": "Sezam", "grams": 15, "qty": null }
    ],
    "weightGrams": 255,
    "needsSauce": false,
    "price": 38,
    "image": "images/r016.webp"
  },
  {
    "id": "r017",
    "name": "California z wędzonym łososiem w sezamie",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 20, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Łosoś wędzony", "grams": 35, "qty": null },
      { "name": "Sezam", "grams": 20, "qty": null }
    ],
    "weightGrams": 265,
    "needsSauce": false,
    "price": 36,
    "image": "images/r017.webp"
  },
  {
    "id": "r018",
    "name": "Cheese Roll",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 60, "qty": null },
      { "name": "Sos unagi", "grams": 25, "qty": null },
      { "name": "Tostowy ser", "grams": 33, "qty": 2 }
    ],
    "weightGrams": 248,
    "needsSauce": true,
    "price": 28,
    "image": "images/r018.webp"
  },
  {
    "id": "r019",
    "name": "Cheese Roll z krewetką tygrysią",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 40, "qty": null },
        { "name": "Krewetka tygrysia", "grams": 30, "qty": null },
        { "name": "Tobiko", "grams": 5, "qty": null },
        { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Tostowy ser", "grams": 33, "qty": 2 }
    ],
    "weightGrams": 263,
    "needsSauce": true,
    "price": 41,
    "image": "images/r019.webp"
  },
  {
    "id": "r020",
    "name": "Czarny Smok",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Surowy łosoś", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Tobiko", "grams": 10, "qty": null },
      { "name": "Węgorz", "grams": 60, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Sezam", "grams": 5, "qty": null }
    ],
    "weightGrams": 320,
    "needsSauce": true,
    "price": 57,
    "image": "images/r020.webp"
  },
  {
    "id": "r021",
    "name": "Czerwony Smok",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 15, "qty": null },
      { "name": "Awokado", "grams": 15, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 35, "qty": null },
      { "name": "Tobiko", "grams": 10, "qty": null },
      { "name": "Tuńczyk", "grams": 60, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 320,
    "needsSauce": true,
    "price": 52,
    "image": "images/r021.webp"
  },
  {
    "id": "r022",
    "name": "Dabi roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 20, "qty": null },
      { "name": "Surimi", "grams": 50, "qty": null, "comment": "В середину" },
      { "name": "Sezam biały", "grams": 15, "qty": null },
      { "name": "Łosoś surowy", "grams": 20, "qty": null },
      { "name": "Krewetka gotowana", "grams": 40, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 300,
    "needsSauce": true,
    "price": 49,
    "image": "images/r022.webp"
  },
  {
    "id": "r023",
    "name": "Futomaki mieszane",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 160, "qty": null },
      { "name": "Majonez japoński", "grams": 10, "qty": null },
      { "name": "Surimi", "grams": 50, "qty": null },
      { "name": "Surowy łosoś", "grams": 25, "qty": null },
      { "name": "Ogórek", "grams": 25, "qty": null },
      { "name": "Sałata", "grams": 5, "qty": null },
      { "name": "Awokado", "grams": 25, "qty": null }
    ],
    "weightGrams": 300,
    "needsSauce": false,
    "price": 38,
    "image": "images/r023.webp"
  },
  {
    "id": "r024",
    "name": "Futomaki z łososiem surowym",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 160, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Surowy łosoś", "grams": 35, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Kawior tobikо", "grams": 10, "qty": null }
    ],
    "weightGrams": 275,
    "needsSauce": false,
    "price": 41,
    "image": "images/r024.webp"
  },
  {
    "id": "r025",
    "name": "Futomaki ze smażonym tuńczykiem",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 160, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Smażony tuńczyk", "grams": 45, "qty": null },
      { "name": "Sałata", "grams": 5, "qty": null },
      { "name": "Unagi", "grams": 15, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Sezam", "grams": 5, "qty": null }
    ],
    "weightGrams": 300,
    "needsSauce": true,
    "price": 46,
    "image": "images/r025.webp"
  },
  {
    "id": "r026",
    "name": "Grill Gold Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Łosoś smażony", "grams": 45, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Łosoś", "grams": 60, "qty": null },
      { "name": "Pieprz mielony", "grams": 1, "qty": null },
      { "name": "Sos spicy", "grams": null, "qty": null }
    ],
    "weightGrams": 311,
    "needsSauce": true,
    "price": 58,
      "comment": "Поверх унагі, робимо крапочку спайсі",
    "image": "images/r026.webp"
  },
  {
    "id": "r027",
    "name": "Gunkan Krewetka-majo",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.16 },
      { "name": "Ryż", "grams": 25, "qty": null },
      { "name": "Krewetka gotowana", "grams": 20, "qty": null },
      { "name": "Tobikko", "grams": 5, "qty": null },
      { "name": "Spicy", "grams": 5, "qty": null }
    ],
    "weightGrams": 55,
    "needsSauce": true,
    "price": 22,
    "image": "images/r027.webp"
  },
  {
    "id": "r028",
    "name": "Gunkan Onion-Tuna",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.16 },
      { "name": "Ryż", "grams": 25, "qty": null },
      { "name": "Tuńczyk", "grams": 20, "qty": null },
      { "name": "Por", "grams": 5, "qty": null },
      { "name": "Sriracha", "grams": 5, "qty": null }
    ],
    "weightGrams": 55,
    "needsSauce": true,
    "price": 21,
    "image": "images/r028.webp"
  },
  {
    "id": "r029",
    "name": "Gunkan Spicy-Łosoś",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.16 },
      { "name": "Ryż", "grams": 25, "qty": null },
      { "name": "Łosos surowy", "grams": 20, "qty": null },
      { "name": "Tobikko", "grams": 5, "qty": null },
      { "name": "Spicy", "grams": 5, "qty": null }
    ],
    "weightGrams": 55,
    "needsSauce": true,
    "price": 23,
    "image": "images/r029.webp"
  },
  {
    "id": "r030",
    "name": "Gunkan Węgorz-Ser",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.16 },
      { "name": "Ryż", "grams": 25, "qty": null },
      { "name": "Serek Philadelphia", "grams": 15, "qty": null },
      { "name": "Węgorz", "grams": 10, "qty": null },
      { "name": "Unagi", "grams": 5, "qty": null },
      { "name": "Sezam", "grams": 2, "qty": null }
    ],
    "weightGrams": 57,
    "needsSauce": true,
    "price": 21,
    "image": "images/r030.webp"
  },
  {
    "id": "r031",
    "name": "Hico Mak Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Tuńczyk surowy", "grams": 35, "qty": null },
      { "name": "Serek", "grams": 60, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 290,
    "needsSauce": true,
    "price": 41,
    "image": "images/r031.webp"
  },
  {
    "id": "r032",
    "name": "Hokku roll",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Łosoś surowy", "grams": 85, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Krewetka w tempurze", "grams": 40, "qty": null },
      { "name": "Tuńczyk", "grams": 35, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Tykwa marynowana", "grams": 20, "qty": null }
    ],
    "weightGrams": 270,
    "needsSauce": false,
    "price": 70,
      "comment": "Ролл без рису, усе скручуємо у норі",
    "image": "images/r032.webp"
  },
  {
    "id": "r033",
    "name": "Krewetka HOT",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5, "comment": "В середину" },
      { "name": "Ryż", "grams": 140, "qty": null, "comment": "В середину" },
      { "name": "Łosoś surowy", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Krewetka gotowana", "grams": 30, "qty": null, "comment": "В середину" },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null, "comment": "В середину" },
      { "name": "Ser Gouda", "grams": 40, "qty": null },
      { "name": "Majonez japoński", "grams": 20, "qty": null },
      { "name": "Sos unagi", "grams": 10, "qty": null },
      { "name": "Tobikko red", "grams": 30, "qty": null }
    ],
    "weightGrams": 320,
    "needsSauce": true,
    "price": 51,
      "comment": "Шапочка: Сирний заміс 60",
    "image": "images/r033.webp"
  },
  {
    "id": "r034",
    "name": "Krewetka w tempurze",
    "count": 1,
    "ingredients": [
      { "name": "Krewetek w tempurze", "grams": null, "qty": 10 },
      { "name": "Cytryna", "grams": null, "qty": 0.5 },
      { "name": "Sos spicy", "grams": null, "qty": 1 }
    ],
    "weightGrams": null,
    "needsSauce": true,
    "price": 56,
    "image": "images/r034.webp"
  },
  {
    "id": "r035",
    "name": "Krewetka w tempurze",
    "count": 1,
    "ingredients": [
      { "name": "Krewetek w tempurze", "grams": null, "qty": 5 },
      { "name": "Cytryna", "grams": null, "qty": 0.5 },
      { "name": "Sos spicy", "grams": null, "qty": 1 }
    ],
    "weightGrams": null,
    "needsSauce": true,
    "price": 36,
    "image": "images/r035.webp"
  },
  {
    "id": "r036",
    "name": "Kuso roll",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5, "comment": "В середину" },
      { "name": "Ryż", "grams": 140, "qty": null, "comment": "В середину" },
      { "name": "Ser Philadelphia", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Tuńczyk surowy", "grams": 30, "qty": null, "comment": "В середину" },
      { "name": "Krewetka gotowana", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Tykwa marynowana", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Tobikko red", "grams": 5, "qty": null },
      { "name": "Ser Gouda", "grams": 24, "qty": null },
      { "name": "Majonez japoński", "grams": 12, "qty": null },
      { "name": "Sos spicy", "grams": 5, "qty": null },
      { "name": "Sezam biały", "grams": 15, "qty": null, "comment": "Покрите" },
      { "name": "Sos unagi", "grams": 10, "qty": null, "comment": "Поливаємо" }
    ],
    "weightGrams": 330,
    "needsSauce": true,
    "price": 45,
      "comment": "Шапочка: Сирний заміс 35, Креветка 30, Тобико 5, Спайсі 5",
    "image": "images/r036.webp"
  },
  {
    "id": "r037",
    "name": "Maki Philadelphia",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Serek Philadelphia", "grams": 25, "qty": null }
    ],
    "weightGrams": 115,
    "needsSauce": false,
    "price": 19,
    "image": "images/r037.webp"
  },
  {
    "id": "r038",
    "name": "Maki z awokado",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Awokado", "grams": 25, "qty": null }
    ],
    "weightGrams": 115,
    "needsSauce": false,
    "price": 22,
    "image": "images/r038.webp"
  },
  {
    "id": "r039",
    "name": "Maki z łososiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Surowy łosoś", "grams": 25, "qty": null }
    ],
    "weightGrams": 115,
    "needsSauce": false,
    "price": 25,
    "image": "images/r039.webp"
  },
  {
    "id": "r040",
    "name": "Maki z mango",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Mango", "grams": 25, "qty": null }
    ],
    "weightGrams": 115,
    "needsSauce": false,
    "price": 21,
    "image": "images/r040.webp"
  },
  {
    "id": "r041",
    "name": "Maki z ogórkiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Ogórek", "grams": 25, "qty": null },
      { "name": "Sezam", "grams": 5, "qty": null }
    ],
    "weightGrams": 120,
    "needsSauce": false,
    "price": 21,
    "image": "images/r041.webp"
  },
  {
    "id": "r042",
    "name": "Maki z surimi",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Surimi", "grams": 25, "qty": null },
      { "name": "Majonez japoński", "grams": 5, "qty": null }
    ],
    "weightGrams": 120,
    "needsSauce": false,
    "price": 21,
    "image": "images/r042.webp"
  },
  {
    "id": "r043",
    "name": "Maki z tuńczykiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Surowy tuńczyk", "grams": 25, "qty": null },
      { "name": "Unagi", "grams": 3, "qty": null }
    ],
    "weightGrams": 118,
    "needsSauce": true,
    "price": 27,
    "image": "images/r043.webp"
  },
  {
    "id": "r044",
    "name": "Maki z wędzonym łososiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 90, "qty": null },
      { "name": "Wędzony łosoś", "grams": 25, "qty": null }
    ],
    "weightGrams": 115,
    "needsSauce": false,
    "price": 25,
    "image": "images/r044.webp"
  },
  {
    "id": "r045",
    "name": "Mikado roll",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.75 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 40, "qty": null },
      { "name": "Krewetka w tempurze", "grams": 60, "qty": null },
      { "name": "Łosoś surowy", "grams": 50, "qty": null },
      { "name": "Sałata", "grams": 10, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 365,
    "needsSauce": true,
    "price": 63,
      "comment": "Наверх: 1 слой авокадо, поверх авокадо 2 слой лосось і поливаємо унагі",
    "image": "images/r045.webp"
  },
  {
    "id": "r046",
    "name": "Nigiri z krewetką",
    "count": 1,
    "ingredients": [
      { "name": "Ryż", "grams": 30, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 20, "qty": null },
      { "name": "Nori", "grams": null, "qty": null }
    ],
    "weightGrams": 50,
    "needsSauce": false,
    "price": 25,
    "image": "images/r046.webp"
  },
  {
    "id": "r047",
    "name": "Nigiri z łososiem",
    "count": 1,
    "ingredients": [
      { "name": "Ryż", "grams": 30, "qty": null },
      { "name": "Łosoś surowy", "grams": 20, "qty": null }
    ],
    "weightGrams": 50,
    "needsSauce": false,
    "price": 23,
    "image": "images/r047.webp"
  },
  {
    "id": "r048",
    "name": "Nigiri z pieczonym łososiem",
    "count": 1,
    "ingredients": [
      { "name": "Ryż", "grams": 30, "qty": null },
      { "name": "Opalany łosoś", "grams": 20, "qty": null },
      { "name": "Mielony pieprz", "grams": 1, "qty": null },
      { "name": "Sos unagi", "grams": 3, "qty": null },
      { "name": "Sos spicy", "grams": 1, "qty": null },
      { "name": "Sezam", "grams": 1, "qty": null }
    ],
    "weightGrams": 56,
    "needsSauce": true,
    "price": 24,
    "image": "images/r048.webp"
  },
  {
    "id": "r049",
    "name": "Nigiri z wędzonym łososiem",
    "count": 1,
    "ingredients": [
      { "name": "Ryż", "grams": 30, "qty": null },
      { "name": "Wędzony łosoś", "grams": 20, "qty": null }
    ],
    "weightGrams": 50,
    "needsSauce": false,
    "price": 22,
    "image": "images/r049.webp"
  },
  {
    "id": "r050",
    "name": "Ognisty Smok",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 35, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Tobiko", "grams": 25, "qty": null },
      { "name": "Łosoś surowy", "grams": 60, "qty": null }
    ],
    "weightGrams": 320,
    "needsSauce": false,
    "price": 50,
    "image": "images/r050.webp"
  },
  {
    "id": "r051",
    "name": "Okinava roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.75 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Łosoś surowy", "grams": 30, "qty": null },
      { "name": "Ser Philadelphia", "grams": 20, "qty": null },
      { "name": "Tuńczyk", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Węgorz", "grams": 30, "qty": null, "comment": "На горі" },
      { "name": "Mango", "grams": 30, "qty": null, "comment": "На горі" },
      { "name": "Sos unagi", "grams": 10, "qty": null }
    ],
    "weightGrams": 330,
    "needsSauce": true,
    "price": 65,
      "comment": "Накриваємо ролл манго і вугрем, чередуючи пластерами. Унагі поливаємо тільки вугор",
    "image": "images/r051.webp"
  },
  {
    "id": "r052",
    "name": "Ovenly roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5, "comment": "В середину" },
      { "name": "Ryż", "grams": 140, "qty": null, "comment": "В середину" },
      { "name": "Ser Philadelphia", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Łosos surowy", "grams": 30, "qty": null, "comment": "В середину" },
      { "name": "Awokado", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Tykwa marynowana", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Ser Gouda", "grams": 40, "qty": null },
      { "name": "Majonez japoński", "grams": 20, "qty": null },
      { "name": "Sezam biały", "grams": 15, "qty": null, "comment": "Покрите" },
      { "name": "Sos unagi", "grams": 10, "qty": null, "comment": "Поливаємо" },
      { "name": "Sos spicy", "grams": 5, "qty": null, "comment": "Поливаємо(точки)" }
    ],
    "weightGrams": 320,
    "needsSauce": true,
    "price": 39,
    "comment": "Шапочка: Сирний заміс 60",
    "image": "images/r052.webp"
  },
  {
    "id": "r053",
    "name": "Philadelphia grill z mango",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 60, "qty": null },
      { "name": "Mango", "grams": 20, "qty": null },
      { "name": "Łosoś opalony", "grams": 60, "qty": null },
      { "name": "Cytryna", "grams": 15, "qty": null }
    ],
    "weightGrams": 295,
    "needsSauce": false,
    "price": 45,
    "image": "images/r053.webp"
  },
  {
    "id": "r054",
    "name": "Philadelphia klasyczna z łososiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 150, "qty": null },
      { "name": "Ser Philadelphia", "grams": 60, "qty": null },
      { "name": "Łosoś surowy", "grams": 100, "qty": null }
    ],
    "weightGrams": 310,
    "needsSauce": false,
    "price": 51,
    "image": "images/r054.webp"
  },
  {
    "id": "r055",
    "name": "Philadelphia sezam",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 60, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Sezam", "grams": 15, "qty": null }
    ],
    "weightGrams": 235,
    "needsSauce": false,
    "price": 25,
    "image": "images/r055.webp"
  },
  {
    "id": "r056",
    "name": "Philadelphia z krewetką tygrysią",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 50, "qty": null }
    ],
    "weightGrams": 260,
    "needsSauce": false,
    "price": 43,
    "image": "images/r056.webp"
  },
  {
    "id": "r057",
    "name": "Philadelphia z krewetką tygrysią MAXI",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.75 },
      { "name": "Ryż", "grams": 130, "qty": null },
      { "name": "Ser Philadelphia", "grams": 40, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Krewetka", "grams": 40, "qty": null, "comment": "В середину" },
      { "name": "Krewetka tygrysia", "grams": 60, "qty": null }
    ],
    "weightGrams": 310,
    "needsSauce": false,
    "price": 60,
    "image": "images/r057.webp"
  },
  {
    "id": "r058",
    "name": "Philadelphia z łososiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Łosoś surowy", "grams": 60, "qty": null }
    ],
    "weightGrams": 270,
    "needsSauce": false,
    "price": 40,
    "image": "images/r058.webp"
  },
  {
    "id": "r059",
    "name": "Philadelphia z łososiem i surimi",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Surimi", "grams": 25, "qty": null },
      { "name": "Łosoś surowy", "grams": 60, "qty": null }
    ],
    "weightGrams": 275,
    "needsSauce": false,
    "price": 40,
    "image": "images/r059.webp"
  },
  {
    "id": "r060",
    "name": "Philadelphia z łososiem MAXI",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.75 },
      { "name": "Ryż", "grams": 130, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 25, "qty": null },
      { "name": "Łosoś surowy", "grams": 100, "qty": null }
    ],
    "weightGrams": 335,
    "needsSauce": false,
    "price": 55,
    "image": "images/r060.webp"
  },
  {
    "id": "r061",
    "name": "Philadelphia z tuńczykiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Tuńczyk surowy", "grams": 60, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 285,
    "needsSauce": true,
    "price": 53,
    "image": "images/r061.webp"
  },
  {
    "id": "r062",
    "name": "Philadelphia z tuńczykiem MAXI",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.75 },
      { "name": "Ryż", "grams": 130, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 25, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Tuńczyk surowy", "grams": 100, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 350,
    "needsSauce": true,
    "price": 59,
    "image": "images/r062.webp"
  },
  {
    "id": "r063",
    "name": "Philadelphia z wędzonym łososiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Łosoś wędzony", "grams": 60, "qty": null }
    ],
    "weightGrams": 270,
    "needsSauce": false,
    "price": 40,
    "image": "images/r063.webp"
  },
  {
    "id": "r064",
    "name": "Philadelphia z wędzonym łososiem MAXI",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.75 },
      { "name": "Ryż", "grams": 130, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 25, "qty": null },
      { "name": "Łosoś wędzony", "grams": 100, "qty": null }
    ],
    "weightGrams": 335,
    "needsSauce": false,
    "price": 54,
    "image": "images/r064.webp"
  },
  {
    "id": "r065",
    "name": "Philadelphia z węgorzem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Węgorz", "grams": 60, "qty": null },
        { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Sezam", "grams": 5, "qty": null }
    ],
    "weightGrams": 290,
    "needsSauce": true,
    "price": 65,
    "image": "images/r065.webp"
  },
  {
    "id": "r066",
    "name": "Philadelphia z węgorzem MAXI",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.75 },
      { "name": "Ryż", "grams": 130, "qty": null },
      { "name": "Ser Philadelphia", "grams": 50, "qty": null },
      { "name": "Ogórek", "grams": 25, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Węgorz", "grams": 100, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Sezam", "grams": 5, "qty": null }
    ],
    "weightGrams": 355,
    "needsSauce": true,
    "price": 95,
    "image": "images/r066.webp"
  },
  {
    "id": "r067",
    "name": "Premium Autorski Awokado Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Krewetka", "grams": 30, "qty": null },
      { "name": "Mango", "grams": 20, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Unagi", "grams": 15, "qty": null },
      { "name": "Awokado", "grams": 80, "qty": null },
      { "name": "Sezam czarny", "grams": 5, "qty": null }
    ],
    "weightGrams": 320,
    "needsSauce": true,
    "price": 49,
    "image": "images/r067.webp"
  },
  {
    "id": "r068",
    "name": "Premium Grill Gold Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Łosoś surowy", "grams": 90, "qty": null, "comment": "На горі" },
      { "name": "Łosoś pieczony", "grams": 45, "qty": null, "comment": "В середину" },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 340,
    "needsSauce": true,
    "price": 70,
    "image": "images/r068.webp"
  },
  {
    "id": "r069",
    "name": "Premium King Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 240, "qty": null },
      { "name": "Łosoś surowy", "grams": 90, "qty": null, "comment": "На горі" },
      { "name": "Krewetka", "grams": 30, "qty": null },
        { "name": "Serek", "grams": 20, "qty": null },
      { "name": "Łosoś wędzony", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null }
    ],
    "weightGrams": 320,
    "needsSauce": false,
    "price": 66,
    "image": "images/r069.webp"
  },
  {
    "id": "r070",
    "name": "Premium Kioto Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Awokado", "grams": 40, "qty": null },
      { "name": "Węgorz", "grams": 90, "qty": null, "comment": "На горі" },
      { "name": "Tykwa marynowana", "grams": 20, "qty": null },
      { "name": "Łosoś surowy", "grams": 40, "qty": null },
      { "name": "Unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 345,
    "needsSauce": true,
    "price": 103,
    "image": "images/r070.webp"
  },
  {
    "id": "r071",
    "name": "Roll Kiboto",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 25, "qty": null },
      { "name": "Łosoś surowy", "grams": 25, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Tobiko", "grams": 20, "qty": null },
      { "name": "Ser Philadelphia", "grams": 60, "qty": null },
      { "name": "Unagi", "grams": 8, "qty": null }
    ],
    "weightGrams": 298,
    "needsSauce": true,
    "price": 46,
    "image": "images/r071.webp"
  },
  {
    "id": "r072",
    "name": "Roll Orange",
    "count": 8,
    "ingredients": [
      { "name": "Papier sojowy", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Łosoś smażony", "grams": 35, "qty": null },
      { "name": "Ser Philadelphia", "grams": 20, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Węgorz", "grams": 35, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null }
    ],
    "weightGrams": 285,
    "needsSauce": true,
    "price": 66,
    "image": "images/r072.webp"
  },
  {
    "id": "r073",
    "name": "Roll Sunrise",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 130, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Krewetka gotowana", "grams": 40, "qty": null },
      { "name": "Łosoś surowy", "grams": 60, "qty": null },
      { "name": "Mango", "grams": 30, "qty": null },
      { "name": "Sos unagi", "grams": 10, "qty": null }
    ],
    "weightGrams": 350,
    "needsSauce": true,
    "price": 59,
    "image": "images/r073.webp"
  },
  {
    "id": "r074",
    "name": "Roll Yakudza",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 40, "qty": null },
      { "name": "Tykwa marynowana", "grams": 20, "qty": null },
      { "name": "Łosoś opalony", "grams": 60, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Limonka", "grams": 5, "qty": null }
    ],
    "weightGrams": 280,
    "needsSauce": false,
    "price": 43,
      "comment": "Лайм на горі",
    "image": "images/r074.webp"
  },
  {
    "id": "r075",
    "name": "Sakura roll",
    "count": 8,
    "ingredients": [
      { "name": "Papier sojowy", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 100, "qty": null },
      { "name": "Łosoś surowy", "grams": 90, "qty": null },
      { "name": "Ser Philadelphia", "grams": 20, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Majonez japoński", "grams": 10, "qty": null },
      { "name": "Surimi", "grams": 40, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null, "comment": "na górze" }
    ],
    "weightGrams": 345,
    "needsSauce": true,
    "price": 63,
      "comment": "Авокадо на горі, поливаємо унагі",
    "image": "images/r075.webp"
  },
  {
    "id": "r076",
    "name": "Spicy Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Węgorz", "grams": 20, "qty": null },
        { "name": "Łosoś smażony", "grams": 50, "qty": null },
      { "name": "Sezam biały", "grams": 15, "qty": null },
        { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Sriracha", "grams": 2, "qty": null }
    ],
    "weightGrams": 302,
    "needsSauce": true,
    "price": 53,
    "image": "images/r076.webp"
  },
  {
    "id": "r077",
    "name": "Tempura Banzai",
    "count": 10,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Tuńczyk pieczony", "grams": 30, "qty": null },
      { "name": "Tykwa marynowana", "grams": 15, "qty": null },
        { "name": "Spicy", "grams": 5, "qty": null },
        { "name": "Ogórek", "grams": 20, "qty": null },
      // { "name": "Sriracha", "grams": null, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
        { "name": "Panko", "grams": 30, "qty": null },
        { "name": "Tempura", "grams": 30, "qty": null },
      { "name": "Sos unagi", "grams": 10, "qty": null }
    ],
    "weightGrams": 300,
    "needsSauce": true,
    "price": 41,
    "image": "images/r077.webp"
  },
  {
    "id": "r078",
    "name": "Tempura cheese",
    "count": 10,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
        { "name": "Tykwa marynowana", "grams": 15, "qty": null },
      { "name": "Ser tostowy", "grams": 35, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Ser twardy", "grams": 40, "qty": null },
      { "name": "Sos unagi", "grams": 10, "qty": null },
        { "name": "Panko", "grams": 30, "qty": null },
        { "name": "Tempura", "grams": 30, "qty": null }
    ],
    "weightGrams": 330,
    "needsSauce": true,
    "price": 32,
    "image": "images/r078.webp"
  },
  {
    "id": "r079",
    "name": "Tempura Ebi",
    "count": 10,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Krewetka gotowana", "grams": 30, "qty": null },
      { "name": "Mango", "grams": 20, "qty": null },
      { "name": "Spicy sos", "grams": 5, "qty": null },
        { "name": "Panko", "grams": 30, "qty": null },
        { "name": "Tempura", "grams": 30, "qty": null },
        { "name": "Sos unagi", "grams": null, "qty": null }
    ],
    "weightGrams": 305,
    "needsSauce": true,
    "price": 37,
    "image": "images/r079.webp"
  },
  {
    "id": "r080",
    "name": "Tempura mieszana",
    "count": 10,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 20, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Tykwa marynowana", "grams": 15, "qty": null },
      { "name": "Łosoś", "grams": 15, "qty": null },
      { "name": "Surimi", "grams": 25, "qty": null },
        { "name": "Tobiko", "grams": 10, "qty": null },
        { "name": "Panko", "grams": 30, "qty": null },
        { "name": "Tempura", "grams": 30, "qty": null },
      { "name": "Sos unagi", "grams": 10, "qty": null }
    ],
    "weightGrams": 345,
    "needsSauce": true,
    "price": 41,
    "image": "images/r080.webp"
  },
  {
    "id": "r081",
    "name": "Tempura Surimi",
    "count": 10,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
        { "name": "Surimi", "grams": 80, "qty": null },
        { "name": "Por", "grams": 15, "qty": null },
        { "name": "Spicy", "grams": 15, "qty": null },
        { "name": "Sriracha", "grams": 5, "qty": null },
        { "name": "Sos unagi", "grams": 10, "qty": null },
      { "name": "Ryż", "grams": 140, "qty": null },
        { "name": "Panko", "grams": 30, "qty": null },
        { "name": "Tempura", "grams": 30, "qty": null }
    ],
    "weightGrams": 325,
    "needsSauce": true,
    "price": 31,
      "comment": "Заміс: крабова палочка і пор мілко ріжуться + sriracha і спайсі, перемішуємо і в середину темпури",
    "image": "images/r081.webp"
  },
  {
    "id": "r082",
    "name": "Tempura tatar z łososia",
    "count": 10,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ogórek", "grams": 15, "qty": null },
      { "name": "Tykwa marynowana", "grams": 15, "qty": null },
      { "name": "Oshinko", "grams": 15, "qty": null },
      { "name": "Surowy łosoś", "grams": 50, "qty": null },
        { "name": "Sos sojowy", "grams": 10, "qty": null },
      { "name": "Por", "grams": 15, "qty": null },
        { "name": "Panko", "grams": 30, "qty": null },
        { "name": "Tempura", "grams": 30, "qty": null }
    ],
    "weightGrams": 320,
    "needsSauce": false,
    "price": 41,
      "comment": "Робимо заміс: лосось + соєвий + пор + трішки srirachi - перемішуємо і поверх темпури",
    "image": "images/r082.webp"
  },
  {
    "id": "r083",
    "name": "Tempura Unagi",
    "count": 10,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Węgorz", "grams": 40, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null },
      { "name": "Tofu", "grams": 20, "qty": null },
      { "name": "Spicy", "grams": 15, "qty": null },
      { "name": "Unagi", "grams": 10, "qty": null },
      { "name": "Por", "grams": 5, "qty": null },
        { "name": "Panko", "grams": 30, "qty": null },
        { "name": "Tempura", "grams": 30, "qty": null }
    ],
    "weightGrams": 340,
    "needsSauce": true,
    "price": 54,
    "image": "images/r083.webp"
  },
  {
    "id": "r084",
    "name": "Yami Roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Surimi", "grams": 50, "qty": null, "comment": "В середину" },
      { "name": "Łosoś surowy", "grams": 30, "qty": null },
      { "name": "Sezam biały", "grams": 15, "qty": null },
      { "name": "Unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 310,
    "needsSauce": true,
    "price": 42,
      "comment": "Поверх рола кладем авокадо, а потім лосось, поливаємо унагі і посипаємо трішки білим сезамом",
    "image": "images/r084.webp"
  },
  {
    "id": "r085",
    "name": "Zenvy roll",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 1, "comment": "В середину" },
      { "name": "Ryz", "grams": 140, "qty": null, "comment": "В середину" },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null, "comment": "В середину"},
      { "name": "Tykwa marynowana", "grams": 15, "qty": null, "comment": "В середину" },
      { "name": "Awokado", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Surimi", "grams": 20, "qty": null, "comment": "В середину" },
      { "name": "Por", "grams": 5, "qty": null, "comment": "В середину" },
      { "name": "Ser Gouda", "grams": 40, "qty": null },
      { "name": "Majonez japoński", "grams": 20, "qty": null },
      { "name": "Sezam biały", "grams": 5, "qty": null, "comment": "Посипаємо" },
      { "name": "Sos unagi", "grams": 15, "qty": null, "comment": "Поливаємо" }
    ],
    "weightGrams": 310,
    "needsSauce": true,
    "price": 35,
      "comment": "Шапочка: Сирний заміс 60",
    "image": "images/r085.webp"
  },
  {
    "id": "r086",
    "name": "Zielony Smok",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Ser Philadelphia", "grams": 30, "qty": null },
      { "name": "Ogórek", "grams": 30, "qty": null },
      { "name": "Węgorz", "grams": 30, "qty": null },
      { "name": "Tobiko", "grams": 10, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null },
      { "name": "Sezam", "grams": 2.5, "qty": null }
    ],
    "weightGrams": 310,
    "needsSauce": true,
    "price": 46,
    "image": "images/r086.webp"
  },
  {
    "id": "r087",
    "name": "Złoty Smok",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Serek Philadelphia", "grams": 30, "qty": null },
      { "name": "Łosoś surowy", "grams": 35, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Tobiko", "grams": 10, "qty": null },
      { "name": "Krewetka tygrysia", "grams": 55, "qty": null }
    ],
    "weightGrams": 300,
    "needsSauce": false,
    "price": 57,
    "image": "images/r087.webp"
  },
  {
    "id": "r088",
    "name": "Burger z krewetką",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": 2, "qty": null },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Krewetki nobashi", "grams": 48, "qty": 3 },
      { "name": "Tempura", "grams": 24, "qty": null },
      { "name": "Pańko", "grams": 24, "qty": null },
      { "name": "Serek Philadelphia", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 50, "qty": null },
      { "name": "Tobiko", "grams": 10, "qty": null },
      { "name": "Tostowy ser", "grams": 35, "qty": 2 },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "tempura", "grams": 50, "qty": null },
      { "name": "Spicy majo", "grams": 10, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 465,
    "needsSauce": true,
    "price": null,
    "image": "images/r088.jpg"
  },
  {
    "id": "r089",
    "name": "Burger z surimi",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": 2, "qty": null },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Serek Philadelphia", "grams": 35, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Surimi", "grams": 40, "qty": null },
      { "name": "Majonez japonski", "grams": 15, "qty": null },
      { "name": "Łosoś surowy", "grams": 30, "qty": null },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "tempura", "grams": 50, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 385,
    "needsSauce": true,
    "price": null,
    "image": "images/r089.jpg"
  },
  {
    "id": "r090",
    "name": "Burger z węgorzem",
    "count": 1,
    "ingredients": [
      { "name": "Nori", "grams": 2, "qty": null },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Serek Philadelphia", "grams": 35, "qty": null },
      { "name": "Awokado", "grams": 30, "qty": null },
      { "name": "Spicy majo", "grams": 10, "qty": null },
      { "name": "Węgorz", "grams": 60, "qty": null },
      { "name": "Tostowy ser", "grams": 35, "qty": 2 },
      { "name": "Panko", "grams": 30, "qty": null },
      { "name": "tempura", "grams": 50, "qty": null },
      { "name": "Sezam biały", "grams": 5, "qty": null },
      { "name": "Sos unagi", "grams": 15, "qty": null }
    ],
    "weightGrams": 410,
    "needsSauce": true,
    "price": null,
    "image": "images/r090.jpg"
  },
  {
    "id": "r091",
    "name": "California z pieczonym łososiem",
    "count": 8,
    "ingredients": [
      { "name": "Nori", "grams": null, "qty": 0.5 },
      { "name": "Ryż", "grams": 140, "qty": null },
      { "name": "Sezam czarny", "grams": 15, "qty": null },
      { "name": "Łosoś smażony", "grams": 35, "qty": null },
      { "name": "Serek philadelphia", "grams": 30, "qty": null },
      { "name": "Awokado", "grams": 20, "qty": null }
    ],
    "weightGrams": 240,
    "needsSauce": false,
    "price": null,
    "image": "images/nofile.jpeg"
  },
  {
      "id": "r092",
      "name": "Philadelphia z łososiem i awokado",
      "count": 8,
      "ingredients": [
          { "name": "Nori", "grams": null, "qty": 0.5 },
          { "name": "Ryż", "grams": 140, "qty": null },
          { "name": "Serek philadelphia", "grams": 50, "qty": null },
          { "name": "Awokado", "grams": 20, "qty": null },
          { "name": "Łosoś surowy", "grams": 60, "qty": null }
      ],
      "weightGrams": 270,
      "needsSauce": false,
      "price": null,
      "image": "images/nofile.jpeg"
  },
  {
      "id": "r093",
      "name": "Cheese roll z pieczonym łososiem",
      "count": 8,
      "ingredients": [
          { "name": "Nori", "grams": null, "qty": 0.5 },
          { "name": "Ryż", "grams": 140, "qty": null },
          { "name": "Serek philadelphia", "grams": 30, "qty": null },
          { "name": "Sos unagi", "grams": 15, "qty": null },
          { "name": "Ogórek", "grams": 20, "qty": null },
          { "name": "Łosoś", "grams": 35, "qty": null },
          { "name": "Tostowy ser", "grams": 33, "qty": 2 }
      ],
      "weightGrams": 273,
      "needsSauce": true,
      "price": null,
      "image": "images/nofile.jpeg"
  },
  {
      "id": "r094",
      "name": "Pieczone maki z łososiem",
      "count": 8,
      "ingredients": [
          { "name": "Nori", "grams": null, "qty": 0.5 },
          { "name": "Ryż", "grams": 90, "qty": null },
          { "name": "Łosoś surowy", "grams": 25, "qty": null },
          { "name": "Masa na wierzch", "grams": 20, "qty": null },
          { "name": "Unagi", "grams": 5, "qty": null },
          { "name": "Sezam", "grams": 5, "qty": null }
      ],
      "weightGrams": 145,
      "needsSauce": true,
      "price": null,
      "image": "images/nofile.jpeg"
  },
  {
      "id": "r095",
      "name": "Pieczone maki z węgorzem",
      "count": 8,
      "ingredients": [
          { "name": "Nori", "grams": null, "qty": 0.5 },
          { "name": "Ryż", "grams": 90, "qty": null },
          { "name": "Węgorz", "grams": 25, "qty": null },
          { "name": "Masa na wierzch", "grams": 20, "qty": null },
          { "name": "Unagi", "grams": 5, "qty": null },
          { "name": "Sezam", "grams": 5, "qty": null }
      ],
      "weightGrams": 145,
      "needsSauce": true,
      "price": null,
      "image": "images/nofile.jpeg"
  },
 {
      "id": "r096",
      "name": "Pieczone maki z krewetką",
      "count": 8,
      "ingredients": [
          { "name": "Nori", "grams": null, "qty": 0.5 },
          { "name": "Ryż", "grams": 90, "qty": null },
          { "name": "Krewetka gotowana", "grams": 25, "qty": null },
          { "name": "Masa na wierzch", "grams": 20, "qty": null },
          { "name": "Unagi", "grams": 5, "qty": null },
          { "name": "Sezam", "grams": 5, "qty": null }
      ],
      "weightGrams": 145,
      "needsSauce": true,
      "price": null,
      "image": "images/nofile.jpeg"
  },
  {
      "id": "r097",
      "name": "Tuńczyk Tar Tar",
      "count": null,
      "ingredients": [
          { "name": "Nori", "grams": null, "qty": 1 },
          { "name": "Ryż", "grams": 140, "qty": null },
          { "name": "Serek", "grams": 35, "qty": null },
          { "name": "Ogórek", "grams": 20, "qty": null },
          { "name": "Tuńczyk", "grams": 60, "qty": null },
          { "name": "Sriracha", "grams": 5, "qty": null },
          { "name": "Sos unagi", "grams": 10, "qty": null }
      ],
      "weightGrams": 270,
      "needsSauce": true,
      "price": null,
      "image": "images/nofile.jpeg"
  }
];


var SETS = [
  {
    "id": "s001",
    "name": "Classic Salmon Set",
    "count": null,
    "items": [
      {
        "name": "Futomaki z łososiem surowym",
        "rollId": "r024",
        "portion": "full"
      },
      {
        "name": "Nigiri z łososiem",
        "rollId": "r047",
        "portion": "full"
      },
      {
        "name": "Nigiri z wędzonym łososiem",
        "rollId": "r049",
        "portion": "full"
      },
      {
        "name": "Maki z łososiem",
        "rollId": "r039",
        "portion": "full"
      },
      {
        "name": "Maki z wędzonym łososiem",
        "rollId": "r044",
        "portion": "full"
      }
    ],
    "price": 100,
    "image": "images/s001.webp"
  },
  {
    "id": "s002",
    "name": "Zestaw California - Zróżnicowany Smak!",
    "count": 36,
    "items": [
      {
        "name": "Futomaki ze smażonym tuńczykiem",
        "rollId": "r025",
        "portion": "full"
      },
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "California z łososiem w kawiorze",
        "rollId": "r013",
        "portion": "full"
      },
      {
        "name": "Futomaki mieszane",
        "rollId": "r023",
        "portion": "full"
      },
      {
        "name": "Maki z ogórkiem",
        "rollId": "r041",
        "portion": "full"
      }
    ],
    "price": 133,
    "image": "images/s002.webp"
  },
  {
    "id": "s003",
    "name": "Zestaw Fusion - Idealny Balans!",
    "count": 34,
    "items": [
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "Philadelphia z tuńczykiem",
        "rollId": "r061",
        "portion": "full"
      },
      {
        "name": "Cheese roll z pieczonym łososiem",
        "rollId": "r093",
        "portion": "full"
      },
      {
        "name": "Futomaki mieszane",
        "rollId": "r023",
        "portion": "full"
      },
      {
        "name": "Mąki z ogórkiem",
        "rollId": "r041",
        "portion": "full"
      }
    ],
    "price": 133,
    "image": "images/s003.webp"
  },
  {
    "id": "s004",
    "name": "Zestaw Futomaki - Kreatywny Mix",
    "count": 30,
    "items": [
      {
        "name": "Futomaki ze smażonym tuńczykiem",
        "rollId": "r025",
        "portion": "full"
      },
      {
        "name": "Futomaki z łososiem",
        "rollId": "r024",
        "portion": "full"
      },
      {
        "name": "Futomaki mieszane",
        "rollId": "r023",
        "portion": "full"
      },
      {
        "name": "Maki z ogórkiem",
        "rollId": "r041",
        "portion": "full"
      }
    ],
    "price": 112,
    "image": "images/s004.webp"
  },
  {
    "id": "s005",
    "name": "Zestaw Tygodnia(20.07-26.07)",
    "count": null,
    "items": [
      {
        "name": "Futomaki ze smażonym tuńczykiem",
        "rollId": "r025",
        "portion": "full"
      },
      {
        "name": "California z łososiem w kawiorze",
        "rollId": "r013",
        "portion": "full"
      },
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "Philadelphia z tuńczykiem",
        "rollId": "r061",
        "portion": "full"
      },
      {
        "name": "Cheese roll z pieczonym łososiem",
        "rollId": "r093",
        "portion": "full"
      }
    ],
    "price": 154,
    "image": "images/s005.webp"
  },
  {
    "id": "s006",
    "name": "Zestaw Letni - Dopamine Set",
    "count": null,
    "items": [
      {
        "name": "Roll Kiboto",
        "rollId": "r071",
        "portion": "full"
      },
      {
        "name": "Awokado roll z łososiem",
        "rollId": "r002",
        "portion": "full"
      },
      {
        "name": "Cheese roll z pieczonym łososiem",
        "rollId": "r093",
        "portion": "full"
      },
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "Philadelphia z tuńczykiem",
        "rollId": "r061",
        "portion": "full"
      },
      {
        "name": "Maki z mango",
        "rollId": "r040",
        "portion": "full",
        "bonus": true
      }
    ],
    "price": 149,
    "image": "images/s006.webp"
  },
  {
    "id": "s007",
    "name": "Zestaw Maki - Best Deal!",
    "count": 48,
    "items": [
      {
        "name": "Maki z mango",
        "rollId": "r040",
        "portion": "full"
      },
      {
        "name": "Maki z tuńczykiem",
        "rollId": "r043",
        "portion": "full"
      },
      {
        "name": "Maki philadelphia",
        "rollId": "r037",
        "portion": "full"
      },
      {
        "name": "Maki z łososiem",
        "rollId": "r039",
        "portion": "full"
      },
      {
        "name": "Maki z ogórkiem",
        "rollId": "r041",
        "portion": "full"
      },
      {
        "name": "Maki z łososiem wędzonym",
        "rollId": "r044",
        "portion": "full"
      }
    ],
    "price": 80,
    "image": "images/s007.webp"
  },
  {
    "id": "s008",
    "name": "Zestaw Od Szefa - Szef poleca!",
    "count": 42,
    "items": [
      {
        "name": "Futomaki ze smażonym tuńczykiem",
        "rollId": "r025",
        "portion": "full"
      },
      {
        "name": "Grill Gold Roll",
        "rollId": "r026",
        "portion": "full"
      },
      {
        "name": "Awokado roll z łososiem",
        "rollId": "r002",
        "portion": "full"
      },
      {
        "name": "Cheese roll z krewetką",
        "rollId": "r019",
        "portion": "full"
      },
      {
        "name": "Philadelphia grill z mango",
        "rollId": "r053",
        "portion": "full"
      },
      {
        "name": "Maki z wędzonym łososiem",
        "rollId": "r044",
        "portion": "full"
      }
    ],
    "price": 192,
    "image": "images/s008.webp"
  },
  {
    "id": "s009",
    "name": "Zestaw Od Szefa 50:50 - Mini set degustacyjny",
    "count": 20,
    "items": [
      {
        "name": "Futomaki ze smażonym tuńczykiem",
        "rollId": "r025",
        "portion": "half"
      },
      {
        "name": "Grill Gold roll",
        "rollId": "r026",
        "portion": "half"
      },
      {
        "name": "Cheese roll z krewetką",
        "rollId": "r019",
        "portion": "half"
      },
      {
        "name": "Philadelphia grill z mango",
        "rollId": "r053",
        "portion": "half"
      },
      {
        "name": "Awokado roll z łososiem",
        "rollId": "r002",
        "portion": "half"
      }
    ],
    "price": 106,
    "image": "images/s009.webp"
  },
  {
    "id": "s010",
    "name": "Zestaw Omakase - Autorski Przepis!",
    "count": 32,
    "items": [
      {
        "name": "Okinava roll",
        "rollId": "r051",
        "portion": "full"
      },
      {
        "name": "Hokku roll",
        "rollId": "r032",
        "portion": "full"
      },
      {
        "name": "Sakura roll",
        "rollId": "r075",
        "portion": "full"
      },
      {
        "name": "Mikado roll",
        "rollId": "r045",
        "portion": "full"
      }
    ],
    "price": 235,
    "image": "images/s010.webp"
  },
  {
    "id": "s011",
    "name": "Zestaw Osama - Nr 1 wśród klientów",
    "count": 32,
    "items": [
      {
        "name": "Awokado roll z łososiem",
        "rollId": "r002",
        "portion": "full"
      },
      {
        "name": "Grill Gold Roll",
        "rollId": "r026",
        "portion": "full"
      },
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "Spicy roll",
        "rollId": "r076",
        "portion": "full"
      },
      {
        "name": "Maki z wędzonym łososiem",
        "rollId": "r044",
        "portion": "full"
      }
    ],
    "price": 177,
    "image": "images/s011.webp"
  },
  {
    "id": "s012",
    "name": "Zestaw Philadelphia - Classic Set",
    "count": 40,
    "items": [
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "Philadelphia z wędzonym łososiem",
        "rollId": "r063",
        "portion": "full"
      },
      {
        "name": "Philadelphia z tuńczykiem",
        "rollId": "r061",
        "portion": "full"
      },
      {
        "name": "Philadelphia z krewetką tygrysią",
        "rollId": "r056",
        "portion": "full"
      },
      {
        "name": "Philadelphia z węgorzem",
        "rollId": "r065",
        "portion": "full"
      },
      {
        "name": "Maki z wędzonym łososiem",
        "rollId": "r044",
        "portion": "full"
      }
    ],
    "price": 202,
    "image": "images/s012.webp"
  },
  {
    "id": "s013",
    "name": "Zestaw Philadelphia 50:50",
    "count": null,
    "items": [
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "half"
      },
      {
        "name": "Philadelphia z wędzonym łososiem",
        "rollId": "r063",
        "portion": "half"
      },
      {
        "name": "Philadelphia z tuńczykiem",
        "rollId": "r061",
        "portion": "half"
      },
      {
        "name": "Philadelphia z krewetką tygrysią",
        "rollId": "r056",
        "portion": "half"
      },
      {
        "name": "Philadelphia z węgorzem",
        "rollId": "r065",
        "portion": "half"
      }
    ],
    "price": 112,
    "image": "images/s013.webp"
  },
  {
    "id": "s014",
    "name": "Zestaw Philadelphia TOP - idealne dla dwojga!",
    "count": 32,
    "items": [
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "Philadelphia z węgorzem",
        "rollId": "r065",
        "portion": "full"
      },
      {
        "name": "Philadelphia z krewetką tygrysią",
        "rollId": "r056",
        "portion": "full"
      },
      {
        "name": "Philadelphia sezam",
        "rollId": "r055",
        "portion": "full"
      },
      {
        "name": "Mąki z ogórkiem",
        "rollId": "r041",
        "portion": "full"
      }
    ],
    "price": 159,
    "image": "images/s014.webp"
  },
  {
    "id": "s015",
    "name": "Zestaw PREMIUM - Wybór Premium",
    "count": 32,
    "items": [
      {
        "name": "Premium Kioto Roll",
        "rollId": "r070",
        "portion": "full"
      },
      {
        "name": "Premium King Roll",
        "rollId": "r069",
        "portion": "full"
      },
      {
        "name": "Premium Autorski Awokado Roll",
        "rollId": "r067",
        "portion": "full"
      },
      {
        "name": "Premium Grill Gold Roll",
        "rollId": "r068",
        "portion": "full"
      }
    ],
    "price": 256,
    "image": "images/s015.webp"
  },
  {
    "id": "s016",
    "name": "Zestaw Sezam - Najlepsza Cena!",
    "count": 32,
    "items": [
      {
        "name": "Hiko mak roll",
        "rollId": "r031",
        "portion": "full"
      },
      {
        "name": "California z pieczonym łososiem",
        "rollId": "r091",
        "portion": "full"
      },
      {
        "name": "California z wędzonym łososiem w sezamie",
        "rollId": "r017",
        "portion": "full"
      },
      {
        "name": "Cheese roll",
        "rollId": "r018",
        "portion": "full"
      },
      {
        "name": "Maki z ogórkiem",
        "rollId": "r041",
        "portion": "full"
      }
    ],
    "price": 112,
    "image": "images/s016.webp"
  },
  {
    "id": "s017",
    "name": "Zestaw Smok - Idealne dla ekipy!",
    "count": 40,
    "items": [
      {
        "name": "Ognisty smok",
        "rollId": "r050",
        "portion": "full"
      },
      {
        "name": "Zielony smok",
        "rollId": "r086",
        "portion": "full"
      },
      {
        "name": "Złoty smok",
        "rollId": "r087",
        "portion": "full"
      },
      {
        "name": "Czarny smok",
        "rollId": "r020",
        "portion": "full"
      },
      {
        "name": "Czerwony smok",
        "rollId": "r021",
        "portion": "full"
      },
      {
        "name": "Maki z wędzonym łososiem",
        "rollId": "r044",
        "portion": "full"
      }
    ],
    "price": 235,
    "image": "images/s017.webp"
  },
  {
    "id": "s018",
    "name": "Zestaw Sunrise Dragon - Ognisty Mix!",
    "count": 32,
    "items": [
      {
        "name": "Awokado roll z łososiem",
        "rollId": "r002",
        "portion": "full"
      },
      {
        "name": "Ognisty smok",
        "rollId": "r050",
        "portion": "full"
      },
      {
        "name": "Tuńczyk Tar Tar",
        "rollId": "r097",
        "portion": "full"
      },
      {
        "name": "Yakudza",
        "rollId": "r074",
        "portion": "full"
      },
      {
        "name": "Maki z awokado",
        "rollId": "r038",
        "portion": "full"
      }
    ],
    "price": 151,
    "image": "images/s018.webp"
  },
  {
    "id": "s019",
    "name": "Zestaw Tempura - Mega chrupiące!",
    "count": 30,
    "items": [
      {
        "name": "Tempura Banzai",
        "rollId": "r077",
        "portion": "full"
      },
      {
        "name": "Tempura mieszana",
        "rollId": "r080",
        "portion": "full"
      },
      {
        "name": "Tempura Cheese",
        "rollId": "r078",
        "portion": "full"
      }
    ],
    "price": 102,
    "image": "images/s019.webp"
  },
  {
    "id": "s020",
    "name": "Zestaw Tempura Gold — Złocista chrupkość!",
    "count": null,
    "items": [
      {
        "name": "Tempura Ebi",
        "rollId": "r079",
        "portion": "full"
      },
      {
        "name": "Tempura Unagi",
        "rollId": "r083",
        "portion": "full"
      },
      {
        "name": "Tempura Tatar z łososia",
        "rollId": "r082",
        "portion": "full"
      }
    ],
    "price": 123,
    "image": "images/s020.webp"
  },
  {
    "id": "s021",
    "name": "Zestaw Tokio - Najczęściej wybierane",
    "count": 32,
    "items": [
      {
        "name": "Philadelphia z wędzonym łososiem",
        "rollId": "r063",
        "portion": "half"
      },
      {
        "name": "Philadelphia z łososiem",
        "rollId": "r058",
        "portion": "half"
      },
      {
        "name": "Philadelphia z tuńczykiem",
        "rollId": "r061",
        "portion": "half"
      },
      {
        "name": "Philadelphia z węgorzem",
        "rollId": "r065",
        "portion": "half"
      },
      {
        "name": "Philadelphia z krewetką tygrysią",
        "rollId": "r056",
        "portion": "half"
      },
      {
        "name": "Philadelphia sezam",
        "rollId": "r055",
        "portion": "half"
      },
      {
        "name": "Hico mak roll",
        "rollId": "r031",
        "portion": "full"
      },
      {
        "name": "Maki z ogórkiem",
        "rollId": "r041",
        "portion": "full"
      }
    ],
    "price": 138,
    "image": "images/s021.webp"
  },
  {
    "id": "s022",
    "name": "Zestaw Usamaki - Zróżnicowany Smak",
    "count": 36,
    "items": [
      {
        "name": "futomaki mieszane",
        "rollId": "r023",
        "portion": "full"
      },
      {
        "name": "philadelphia z łososiem",
        "rollId": "r058",
        "portion": "full"
      },
      {
        "name": "tempura surimi",
        "rollId": "r081",
        "portion": "full"
      },
      {
        "name": "tempura Tatar z łososia",
        "rollId": "r082",
        "portion": "full"
      },
      {
        "name": "maki z awokado",
        "rollId": "r038",
        "portion": "full"
      }
    ],
    "price": 120,
    "image": "images/s022.webp"
  },
  {
    "id": "s023",
    "name": "Zestaw Zapiekany - Gorący Hit",
    "count": 24,
    "items": [
      {
        "name": "Zenvy roll",
        "rollId": "r085",
        "portion": "full"
      },
      {
        "name": "Ovenly roll",
        "rollId": "r052",
        "portion": "full"
      },
      {
        "name": "Kuso roll",
        "rollId": "r036",
        "portion": "full"
      }
    ],
    "price": 117,
    "image": "images/s023.webp"
  },
  {
    "id": "s024",
    "name": "Zestaw zapiekanych maków",
    "count": null,
    "items": [
      {
        "name": "pieczone maki z łososiem",
        "rollId": "r094",
        "portion": "full"
      },
      {
        "name": "pieczone maki z węgorzem",
        "rollId": "r095",
        "portion": "full"
      },
      {
        "name": "pieczone maki z krewetką",
        "rollId": "r096",
        "portion": "full"
      }
    ],
    "price": 68,
    "comment": "masa: majo 200g, sriraca 30g, czerwona papryka słodka mielona 5g",
    "image": "images/s024.webp"
  }
];
