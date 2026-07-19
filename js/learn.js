// ---------------------------------------------------------
// "Nauka" — dawny główny interfejs (Fiszki / Quiz / Skład zestawu),
// teraz zebrany pod jedną zakładką nawigacji. Każdy tryb trzyma swój
// stan tak jak wcześniej (CardsState / QuizState / SetQuizState) --
// ten plik odpowiada tylko za to, który z trzech jest aktualnie
// pokazany.
// ---------------------------------------------------------

var LearnState = { mode: 'cards' }; // 'cards' | 'quiz' | 'setquiz'

var LEARN_MODES = [
  { id: 'cards', label: 'Fiszki' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'setquiz', label: 'Skład zestawu' },
];

var LEARN_RENDERERS = {
  cards: renderCardsView,
  quiz: renderQuizView,
  setquiz: renderSetQuizView,
};

function renderLearnView(root){
  clear(root);
  const wrap = el('div', { class: 'view learn-shell' });

  const seg = el('div', { class: 'segmented segmented--scroll' });
  LEARN_MODES.forEach(m => {
    seg.appendChild(el('button', {
      class: LearnState.mode === m.id ? 'is-active' : '',
      onClick: () => { if (LearnState.mode !== m.id){ LearnState.mode = m.id; renderLearnView(root); } }
    }, m.label));
  });
  wrap.appendChild(seg);

  const inner = el('div', { class: 'learn-inner' });
  wrap.appendChild(inner);
  root.appendChild(wrap);

  LEARN_RENDERERS[LearnState.mode](inner);
}
