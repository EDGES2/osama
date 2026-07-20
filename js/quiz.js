// ---------------------------------------------------------
// Режим 2 — Мультивибір по ролах (Quiz)
// ---------------------------------------------------------

var QuizState = {
  phase: 'setup',      // 'setup' | 'question' | 'summary'
  showCaption: true,
  order: [],
  index: 0,
  correctCount: 0,
  cache: {},            // index -> { roll, options, answered, selectedId } -- built lazily,
                         // kept around so navigating back to an already-seen question shows
                         // the exact same 4 options and answer state instead of rerolling it.
};

function quizStart(showCaption){
  QuizState.showCaption = showCaption;
  QuizState.order = shuffle(ROLLS.map((_, i) => i));
  QuizState.index = 0;
  QuizState.correctCount = 0;
  QuizState.cache = {};
  QuizState.phase = 'question';
}

function quizGetQuestion(idx){
  if (!QuizState.cache[idx]){
    const roll = ROLLS[QuizState.order[idx]];
    const distractors = pickDistractors(roll, ROLLS, 3);
    QuizState.cache[idx] = {
      roll,
      options: shuffle([roll, ...distractors]),
      answered: false,
      selectedId: null,
    };
  }
  return QuizState.cache[idx];
}

function renderQuizView(root){
  clear(root);
  const view = el('div', { class: 'view' });

  if (QuizState.phase === 'setup'){
    view.appendChild(el('h2', { class: 'view-title' }, 'Quiz: rozpoznaj rolkę'));
    view.appendChild(el('p', { class: 'view-sub' }, 'Zobaczysz zdjęcie i wybierzesz właściwą nazwę spośród 4 opcji.'));

    let captionChoice = true;
    const setupCard = el('div', { class: 'setup-card' }, [
      el('h3', {}, 'Pokazywać skład pod zdjęciem?'),
      el('p', { style: 'font-size:13px;color:var(--ink-soft);' }, 'To ustawienie obowiązuje przez całą sesję quizu.'),
    ]);
    const seg = el('div', { class: 'segmented' });
    const yesBtn = el('button', { class: 'is-active' }, 'Tak, pokazuj skład');
    const noBtn = el('button', {}, 'Nie, tylko zdjęcie');
    yesBtn.addEventListener('click', () => { captionChoice = true; yesBtn.classList.add('is-active'); noBtn.classList.remove('is-active'); });
    noBtn.addEventListener('click', () => { captionChoice = false; noBtn.classList.add('is-active'); yesBtn.classList.remove('is-active'); });
    seg.appendChild(yesBtn); seg.appendChild(noBtn);
    setupCard.appendChild(seg);
    view.appendChild(setupCard);

    view.appendChild(el('button', {
      class: 'btn btn-primary btn-block',
      onClick: () => { quizStart(captionChoice); renderQuizView(root); }
    }, 'Zacznij quiz'));

    root.appendChild(view);
    return;
  }

  if (QuizState.phase === 'summary'){
    const total = ROLLS.length;
    view.appendChild(el('div', { class: 'result-card' }, [
      el('h2', {}, 'Koniec quizu'),
      el('div', { class: 'result-score' }, QuizState.correctCount + ' / ' + total),
      el('p', { style: 'color:var(--ink-soft);font-size:14px;' }, 'poprawnych odpowiedzi'),
      el('button', { class: 'btn btn-primary', onClick: () => { QuizState.phase = 'setup'; renderQuizView(root); } }, 'Zagraj jeszcze raz'),
    ]));
    root.appendChild(view);
    return;
  }

  // phase === 'question'
  const total = ROLLS.length;
  const qc = quizGetQuestion(QuizState.index);
  const roll = qc.roll;

  view.appendChild(el('div', { class: 'score-strip' }, [
    el('span', {}, (QuizState.index + 1) + ' / ' + total),
    el('div', { class: 'progress-track' }, el('div', { class: 'progress-fill', style: 'width:' + (100 * QuizState.index / total) + '%' })),
    el('span', {}, 'Wynik: ' + QuizState.correctCount),
  ]));

  // Free browsing between questions -- doesn't touch answered state or
  // score, just moves the pointer. quizGetQuestion() above keeps each
  // visited question's options/answer stable across visits.
  view.appendChild(el('div', { class: 'card-nav' }, [
    el('button', {
      class: 'round-btn', 'aria-label': 'Poprzednie pytanie',
      disabled: QuizState.index <= 0 ? 'disabled' : null,
      onClick: () => { if (QuizState.index > 0){ QuizState.index--; renderQuizView(root); } }
    }, iconEl('arrowLeft')),
    el('span', { class: 'card-nav__counter' }, (QuizState.index + 1) + ' / ' + total),
    el('button', {
      class: 'round-btn', 'aria-label': 'Następne pytanie',
      disabled: QuizState.index >= total - 1 ? 'disabled' : null,
      onClick: () => { if (QuizState.index < total - 1){ QuizState.index++; renderQuizView(root); } }
    }, iconEl('arrowRight')),
  ]));

  const photoWrap = el('div', { class: 'quiz-photo-wrap' });
  const img = el('img', { src: roll.image, alt: 'Zdjęcie rolki', loading: 'lazy' });
  img.addEventListener('error', () => {
    photoWrap.classList.add('img-missing');
    img.remove();
    photoWrap.appendChild(el('span', { class: 'img-missing__label' }, 'Zdjęcie niedostępne'));
  });
  photoWrap.appendChild(img);
  view.appendChild(photoWrap);

  if (QuizState.showCaption){
    view.appendChild(el('div', { class: 'quiz-caption' }, roll.ingredients.join(', ')));
  }

  const optionsWrap = el('div', { class: 'quiz-options' });
  qc.options.forEach(opt => {
    const isCorrect = opt.id === roll.id;
    const btn = el('button', { class: 'option-btn' }, opt.name);
    btn.disabled = qc.answered;
    if (qc.answered){
      if (isCorrect) btn.classList.add('is-correct');
      else if (opt.id === qc.selectedId) btn.classList.add('is-wrong');
    }
    btn.addEventListener('click', () => {
      if (qc.answered) return;
      qc.answered = true;
      qc.selectedId = opt.id;
      if (isCorrect) QuizState.correctCount++;
      renderQuizView(root);
    });
    optionsWrap.appendChild(btn);
  });
  view.appendChild(optionsWrap);

  if (qc.answered){
    const isLast = QuizState.index >= total - 1;
    view.appendChild(el('button', {
      class: 'btn btn-primary btn-block',
      onClick: () => {
        if (isLast){
          QuizState.phase = 'summary';
        } else {
          QuizState.index++;
        }
        renderQuizView(root);
      }
    }, isLast ? 'Zobacz wynik' : 'Dalej'));
  }

  root.appendChild(view);
}
