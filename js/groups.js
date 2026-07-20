// ---------------------------------------------------------
// Ручні групи ВІЗУАЛЬНОЇ схожості -- джерело: те, як фотографії
// рolлів фізично розкладені по папках на диску (baked/, orange/,
// green/, sezam/, ...). На відміну від similarity.js, де "схожість"
// рахується автоматично з ingredients (tagsFromIngredients + jaccard),
// тут групи описують те, що людина БАЧИТЬ на фото -- колір топінгу,
// форму шматка, текстуру покриття. Саме це важливо для квізу: гравець
// відрізняє роли одне від одного по зовнішньому вигляду, а не по
// списку складників, тож дистрактори мають бути "схожі на фото", а
// не просто "мають спільні інгредієнти".
//
// Кожен ролл входить щонайбільше в одну групу. Кожна group.note нижче
// пояснює, чому саме ці roll_id опинились разом -- це не точна наука
// (я не бачив самих фото, лише назви папок + id файлів + назви/склад
// ролів з data.js), тож якщо якась група виглядає не так на реальних
// фото -- просто підправ ids/notes тут, решта коду (similarity.js,
// quiz.js, setquiz.js) підхопить зміни автоматично.
//
// Роли, яких немає в жодній групі нижче (лежали поза підпапками на
// диску -- r022, r032, r034, r035, r055), візуально унікальні: явного
// "близнюка" для них немає, тож дистрактор/trap підбір для них
// відкочується на ingredient-based jaccard() із similarity.js.
// ---------------------------------------------------------

var ROLL_GROUPS = [
  {
    key: 'avocado_green',
    label: 'Zielone (awokado)',
    note: 'Awokado зверху або по всій довжині rola -- домінує зелений колір (в т.ч. "Zielony Smok" -- Зелений дракон, буквально зелений).',
    ids: ['r001', 'r002', 'r003', 'r045', 'r067', 'r075', 'r086'],
  },
  {
    key: 'salmon_orange',
    label: 'Pomarańczowe (łosoś)',
    note: 'Класична форма Philadelphia з цілим шматком лосося (surowy / smażony / wędzony) покладеним на кожен шматок -- домінує помаранчевий. Найбільша група в меню, бо це найпопулярніший стиль подачі.',
    ids: ['r011', 'r026', 'r050', 'r054', 'r058', 'r059', 'r060', 'r063', 'r064', 'r068', 'r069', 'r072', 'r073'],
  },
  {
    key: 'roe_coated_red',
    label: 'Czerwone (ikra)',
    note: 'California, рис зовні повністю обкатаний в ікрі тобіко/kawior -- дрібнозерниста червоно-помаранчева "шкірка" по всій поверхні, інакше ніж один шматок топінгу згори.',
    ids: ['r012', 'r013'],
  },
  {
    key: 'tuna_dragon_red',
    label: 'Czerwone (tuńczyk)',
    note: 'Сирий тунець зверху АБО "smok" з насиченою червоною глазур\'ю -- темніший і холодніший червоний, ніж помаранчевий лосось із salmon_orange.',
    ids: ['r021', 'r061', 'r062'],
  },
  {
    key: 'mango_cheese_yellow',
    label: 'Żółte (mango / ser)',
    note: 'Жовтий колір від скибок mango, якими обгорнутий/притрушений rolItem, або від сиру cheddar зверху.',
    ids: ['r015', 'r018', 'r019', 'r051'],
  },
  {
    key: 'eel_glaze_dark',
    label: 'Ciemne (węgorz)',
    note: 'Węgorz/unagi зверху з глянцевим темно-коричневим соусом unagi -- темна, майже чорна блискуча поверхня.',
    ids: ['r020', 'r065', 'r066', 'r070'],
  },
  {
    key: 'sesame_coated',
    label: 'W sezamie',
    note: 'Рис зовні обкатаний у sezam -- крапчаста біло-чорна текстура замість гладкого топінгу.',
    ids: ['r014', 'r016', 'r017'],
  },
  {
    key: 'baked_gratin',
    label: 'Zapiekane',
    note: 'Запечені під саламандрою roli із сирно-майонезним топінгом -- золотисто-брунатна запечена скоринка (це ж підмножина, яку сам заклад називає "zapiekane" -- див. set s023).',
    ids: ['r004', 'r005', 'r033', 'r036', 'r052', 'r085'],
  },
  {
    key: 'tempura_fried',
    label: 'W tempurze',
    note: 'Обсмажені у клярі -- хрустка золотиста скоринка на весь rolItem, зовсім інша текстура, ніж сирі/запечені варіанти.',
    ids: ['r077', 'r078', 'r079', 'r080', 'r081', 'r083'],
  },
  {
    key: 'sushi_burger',
    label: 'Burgery',
    note: 'Не rolItem, а пресований "burger" -- геть інший силует (круглий, товстий, без характерних кружечків макі).',
    ids: ['r006', 'r007', 'r008', 'r009', 'r010', 'r088', 'r089', 'r090'],
  },
  {
    key: 'gunkan_battleship',
    label: 'Gunkany',
    note: 'Gunkan: "комір" з nori навколо рису, топінг насипом зверху -- інша форма, ніж класичний нарізаний rolItem.',
    ids: ['r027', 'r028', 'r029', 'r030'],
  },
  {
    key: 'nigiri_hand',
    label: 'Nigiri',
    note: 'Nigiri: пресована рисова "подушечка" без обгортки nori навколо, топінг зверху -- легко впізнаваний профіль, інший за roli.',
    ids: ['r046', 'r047', 'r048', 'r049'],
  },
  {
    key: 'futomaki_thick',
    label: 'Grube maki',
    note: 'Товсті futomaki -- великий діаметр шматка, кілька начинок одразу видно у розрізі.',
    ids: ['r023', 'r024', 'r025'],
  },
  {
    key: 'hosomaki_thin',
    label: 'Cienkie maki',
    note: 'Тонкі класичні maki -- один вид начинки, найменший діаметр шматка з усього меню.',
    ids: ['r037', 'r038', 'r039', 'r040', 'r041', 'r042', 'r043', 'r044'],
  },
  {
    key: 'draped_topping_citrus',
    label: 'Z krewetką / opalane',
    note: 'Philadelphia-основа з ОДНИМ цілим шматком (варена krewetka або opalany лосось), покладеним впоперек кожного шматка, часто з часточкою cytryna/limonka -- інший ритм топінгу, ніж рівномірно нарізаний salmon_orange.',
    ids: ['r053', 'r056', 'r057', 'r074', 'r087'],
  },
  {
    key: 'saucy_zigzag',
    label: 'W sosie',
    note: '[менш впевнена група, самих фото я не бачив -- перевір і поправ за потреби] Топінг у вигляді розмазаного/збризканого соусу (spicy majo, unagi зигзаг, tatar) замість одного цілого шматка риби.',
    ids: ['r076', 'r082', 'r084'],
  },
  {
    key: 'striped_medley',
    label: 'Kolorowa mozaika',
    note: '[менш впевнена група, самих фото я не бачив -- перевір і поправ за потреби] Кілька різнокольорових топінгів, викладених смугами/віялом по всій довжині rolItem.',
    ids: ['r031', 'r071'],
  },
];

var ROLL_GROUP_OF = {};
ROLL_GROUPS.forEach(g => g.ids.forEach(id => { ROLL_GROUP_OF[id] = g.key; }));

var ROLL_GROUP_LABEL = {};
ROLL_GROUPS.forEach(g => { ROLL_GROUP_LABEL[g.key] = g.label; });

var UNGROUPED_LABEL = 'Pozostałe';

/** Human-readable Polish label for the roll's visual group -- used
 * wherever we show groups to the user (np. Versus). Rolls with no
 * curated group (see file header) fall back to UNGROUPED_LABEL. */
function groupLabelOf(rollId){
  const key = ROLL_GROUP_OF[rollId];
  return key ? ROLL_GROUP_LABEL[key] : UNGROUPED_LABEL;
}

if (typeof module !== 'undefined') {
  module.exports = { ROLL_GROUPS, ROLL_GROUP_OF, ROLL_GROUP_LABEL, UNGROUPED_LABEL, groupLabelOf };
}
