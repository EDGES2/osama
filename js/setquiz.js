// ---------------------------------------------------------
// Режим 3 — Склад сету (Skład zestawu)
// ---------------------------------------------------------

var SetQuizState = {
  order: [],
  index: 0,
  checked: false,
  selected: new Set(),
  candidateData: null, // { members, traps, candidates, unmatchedExtras, clusters }
  correctSets: 0,
  hardMode: false, // true = candidate list shows only names, no thumbnails
};

function setQuizBuildQuestion(){
  const set = SETS[SetQuizState.order[SetQuizState.index]];
  SetQuizState.candidateData = buildSetCandidates(set, ROLLS);
  SetQuizState.selected = new Set();
  SetQuizState.checked = false;
  return set;
}

function setQuizInit(){
  SetQuizState.order = shuffle(SETS.map((_, i) => i));
  SetQuizState.index = 0;
  SetQuizState.correctSets = 0;
  setQuizBuildQuestion();
}

function renderSetQuizView(root){
  clear(root);
  const view = el('div', { class: 'view' });

  if (!SetQuizState.candidateData || SetQuizState.order.length !== SETS.length) setQuizInit();

  const set = SETS[SetQuizState.order[SetQuizState.index]];
  const { members, candidates, unmatchedExtras } = SetQuizState.candidateData;

  const modeRow = el('div', { class: 'chip-row' });
  const hardChip = el('button', {
    class: 'chip' + (SetQuizState.hardMode ? ' is-on' : ''),
    onClick: () => { SetQuizState.hardMode = !SetQuizState.hardMode; renderSetQuizView(root); }
  }, SetQuizState.hardMode ? 'Tryb trudny: same nazwy' : 'Tryb łatwy: nazwy ze zdjęciami');
  modeRow.appendChild(hardChip);
  view.appendChild(modeRow);

  view.appendChild(el('div', { class: 'score-strip' }, [
    el('span', {}, (SetQuizState.index + 1) + ' / ' + SETS.length),
    el('div', { class: 'progress-track' }, el('div', { class: 'progress-fill', style: 'width:' + (100 * SetQuizState.index / SETS.length) + '%' })),
    el('span', {}, 'Poprawne: ' + SetQuizState.correctSets),
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
    const isChecked = SetQuizState.selected.has(roll.id);
    let rowClass = 'candidate-row';
    if (SetQuizState.checked){
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
        disabled: SetQuizState.checked ? 'disabled' : null,
        onChange: (e) => {
          if (e.target.checked) SetQuizState.selected.add(roll.id);
          else SetQuizState.selected.delete(roll.id);
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

  if (!SetQuizState.checked){
    view.appendChild(el('button', {
      class: 'btn btn-primary btn-block',
      onClick: () => { SetQuizState.checked = true; 
        const correct = candidates.every(r => SetQuizState.selected.has(r.id) === memberIds.has(r.id));
        if (correct) SetQuizState.correctSets++;
        renderSetQuizView(root);
      }
    }, 'Sprawdź'));
  } else {
    const isLast = SetQuizState.index >= SETS.length - 1;
    view.appendChild(el('button', {
      class: 'btn btn-primary btn-block',
      onClick: () => {
        if (isLast){
          SetQuizState.index = 0;
          SetQuizState.order = shuffle(SETS.map((_, i) => i));
          SetQuizState.correctSets = 0;
        } else {
          SetQuizState.index++;
        }
        setQuizBuildQuestion();
        renderSetQuizView(root);
      }
    }, isLast ? 'Zacznij od nowa' : 'Następny zestaw'));
  }

  root.appendChild(view);
}
