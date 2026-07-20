// ---------------------------------------------------------
// Режим 3 — Склад сету (Skład zestawu)
// ---------------------------------------------------------

var SetQuizState = {
  order: [],
  index: 0,
  correctSets: 0,
  hardMode: false, // true = candidate list shows only names, no thumbnails (persists across questions)
  cache: {},        // index -> { candidateData, selected: Set, checked } -- built lazily, kept
                     // around so navigating back to an already-seen set shows the exact same
                     // candidate pool and checkbox/checked state instead of rerolling it.
};

function setQuizGetQuestion(idx){
  if (!SetQuizState.cache[idx]){
    const set = SETS[SetQuizState.order[idx]];
    SetQuizState.cache[idx] = {
      candidateData: buildSetCandidates(set, ROLLS),
      selected: new Set(),
      checked: false,
    };
  }
  return SetQuizState.cache[idx];
}

function setQuizInit(){
  SetQuizState.order = shuffle(SETS.map((_, i) => i));
  SetQuizState.index = 0;
  SetQuizState.correctSets = 0;
  SetQuizState.cache = {};
}

function renderSetQuizView(root){
  clear(root);
  const view = el('div', { class: 'view' });

  if (!SetQuizState.order.length || SetQuizState.order.length !== SETS.length) setQuizInit();

  const total = SETS.length;
  const set = SETS[SetQuizState.order[SetQuizState.index]];
  const qc = setQuizGetQuestion(SetQuizState.index);
  const { members, candidates, unmatchedExtras } = qc.candidateData;

  const modeRow = el('div', { class: 'chip-row' });
  const hardChip = el('button', {
    class: 'chip' + (SetQuizState.hardMode ? ' is-on' : ''),
    onClick: () => { SetQuizState.hardMode = !SetQuizState.hardMode; renderSetQuizView(root); }
  }, SetQuizState.hardMode ? 'Tryb trudny: same nazwy' : 'Tryb łatwy: nazwy ze zdjęciami');
  modeRow.appendChild(hardChip);
  view.appendChild(modeRow);

  view.appendChild(el('div', { class: 'score-strip' }, [
    el('span', {}, (SetQuizState.index + 1) + ' / ' + total),
    el('div', { class: 'progress-track' }, el('div', { class: 'progress-fill', style: 'width:' + (100 * SetQuizState.index / total) + '%' })),
    el('span', {}, 'Poprawne: ' + SetQuizState.correctSets),
  ]));

  // Free browsing between sets -- doesn't touch checked state or score,
  // just moves the pointer. setQuizGetQuestion() above keeps each
  // visited set's candidates/selection stable across visits.
  view.appendChild(el('div', { class: 'card-nav' }, [
    el('button', {
      class: 'round-btn', 'aria-label': 'Poprzedni zestaw',
      disabled: SetQuizState.index <= 0 ? 'disabled' : null,
      onClick: () => { if (SetQuizState.index > 0){ SetQuizState.index--; renderSetQuizView(root); } }
    }, iconEl('arrowLeft')),
    el('span', { class: 'card-nav__counter' }, (SetQuizState.index + 1) + ' / ' + total),
    el('button', {
      class: 'round-btn', 'aria-label': 'Następny zestaw',
      disabled: SetQuizState.index >= total - 1 ? 'disabled' : null,
      onClick: () => { if (SetQuizState.index < total - 1){ SetQuizState.index++; renderSetQuizView(root); } }
    }, iconEl('arrowRight')),
  ]));

  const photoWrap = el('div', { class: 'quiz-photo-wrap' });
  const img = el('img', { src: set.image, alt: set.name, loading: 'lazy' });
  img.addEventListener('error', () => {
    photoWrap.classList.add('img-missing');
    img.remove();
    photoWrap.appendChild(el('span', { class: 'img-missing__label' }, set.name));
  });
  photoWrap.appendChild(img);
  view.appendChild(photoWrap);
  view.appendChild(el('h2', { class: 'view-title', style: 'font-size:22px;' }, set.name));
  view.appendChild(el('p', { class: 'view-sub' }, 'Zaznacz rolki, które wchodzą w skład tego zestawu.'));

  const memberIds = new Set(members.map(r => r.id));
  const list = el('ul', { class: 'candidate-list' });
  candidates.forEach(roll => {
    const isChecked = qc.selected.has(roll.id);
    let rowClass = 'candidate-row';
    if (qc.checked){
      const isMember = memberIds.has(roll.id);
      if (isMember && isChecked) rowClass += ' is-hit';
      else if (!isMember && isChecked) rowClass += ' is-miss';
      else if (isMember && !isChecked) rowClass += ' is-missed-correct';
    } else if (isChecked){
      rowClass += ' is-on';
    }
    const row = el('label', { class: rowClass }, [
      el('input', {
        type: 'checkbox', checked: isChecked ? 'checked' : null,
        disabled: qc.checked ? 'disabled' : null,
        onChange: (e) => {
          if (e.target.checked) qc.selected.add(roll.id);
          else qc.selected.delete(roll.id);
          renderSetQuizView(root);
        }
      }),
    ]);
    if (!SetQuizState.hardMode){
      const thumb = el('img', { class: 'candidate-thumb', src: roll.image, alt: '', loading: 'lazy' });
      thumb.addEventListener('error', () => { thumb.style.visibility = 'hidden'; });
      row.appendChild(thumb);
    }
    row.appendChild(el('span', { class: 'candidate-name' }, roll.name));
    list.appendChild(el('li', {}, row));
  });
  view.appendChild(list);

  if (unmatchedExtras.length){
    unmatchedExtras.forEach(it => {
      view.appendChild(el('div', { class: 'extra-note' }, `Do zestawu należy też: ${it.name}${it.bonus ? ' (gratis)' : ''} — bez osobnego zdjęcia, więc nie ma go na liście wyboru.`));
    });
  }

  if (!qc.checked){
    view.appendChild(el('button', {
      class: 'btn btn-primary btn-block',
      onClick: () => {
        qc.checked = true;
        const correct = candidates.every(r => qc.selected.has(r.id) === memberIds.has(r.id));
        if (correct) SetQuizState.correctSets++;
        renderSetQuizView(root);
      }
    }, 'Sprawdź'));
  } else {
    const isLast = SetQuizState.index >= total - 1;
    view.appendChild(el('button', {
      class: 'btn btn-primary btn-block',
      onClick: () => {
        if (isLast){
          setQuizInit();
        } else {
          SetQuizState.index++;
        }
        renderSetQuizView(root);
      }
    }, isLast ? 'Zacznij od nowa' : 'Następny zestaw'));
  }

  root.appendChild(view);
}
