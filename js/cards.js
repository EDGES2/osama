// ---------------------------------------------------------
// Режим 1 — Картки (флешкартки)
// ---------------------------------------------------------

var CardsState = {
  deck: 'rolls',       // 'rolls' | 'sets'
  sauceOnly: false,
  shuffled: false,
  order: [],
  index: 0,
  flipped: false,
};

function cardsGetItems(){
  let items = CardsState.deck === 'rolls' ? ROLLS : SETS;
  if (CardsState.deck === 'rolls' && CardsState.sauceOnly) items = items.filter(r => r.needsSauce);
  return items;
}

function cardsRebuildOrder(){
  const items = cardsGetItems();
  let order = items.map((_, i) => i);
  if (CardsState.shuffled) order = shuffle(order);
  CardsState.order = order;
  CardsState.index = 0;
  CardsState.flipped = false;
}

function renderCardsView(root){
  clear(root);
  const items = cardsGetItems();
  if (CardsState.order.length !== items.length) cardsRebuildOrder();

  const view = el('div', { class: 'view' });

  const seg = el('div', { class: 'segmented' }, [
    el('button', {
      class: CardsState.deck === 'rolls' ? 'is-active' : '',
      onClick: () => { CardsState.deck = 'rolls'; cardsRebuildOrder(); renderCardsView(root); }
    }, 'Rolki'),
    el('button', {
      class: CardsState.deck === 'sets' ? 'is-active' : '',
      onClick: () => { CardsState.deck = 'sets'; CardsState.sauceOnly = false; cardsRebuildOrder(); renderCardsView(root); }
    }, 'Zestawy'),
  ]);
  view.appendChild(seg);

  const toolRow = el('div', { class: 'chip-row' });
  if (CardsState.deck === 'rolls'){
    const chip = el('label', { class: 'chip' + (CardsState.sauceOnly ? ' is-on' : '') }, [
      el('input', {
        type: 'checkbox', checked: CardsState.sauceOnly ? 'checked' : null,
        onChange: (e) => { CardsState.sauceOnly = e.target.checked; cardsRebuildOrder(); renderCardsView(root); }
      }),
      'Z dodatkowym sosem',
    ]);
    toolRow.appendChild(chip);
  }
  const shuffleChip = el('button', {
    class: 'chip' + (CardsState.shuffled ? ' is-on' : ''),
    onClick: () => { CardsState.shuffled = !CardsState.shuffled; cardsRebuildOrder(); renderCardsView(root); }
  });
  shuffleChip.appendChild(iconEl('shuffle'));
  shuffleChip.appendChild(document.createTextNode(CardsState.shuffled ? ' Losowa kolejność' : ' Kolejno'));
  toolRow.appendChild(shuffleChip);
  view.appendChild(toolRow);

  const currentItems = cardsGetItems();
  if (currentItems.length === 0){
    view.appendChild(el('div', { class: 'empty-state' }, 'Brak kart dla tego filtra.'));
    root.appendChild(view);
    return;
  }
  if (CardsState.index >= currentItems.length) CardsState.index = 0;
  const idx = CardsState.order[CardsState.index];
  const item = currentItems[idx];

  const stage = el('div', { class: 'card-stage' });
  const card = el('div', {
    class: 'flip-card' + (CardsState.flipped ? ' is-flipped' : ''),
    tabindex: '0', role: 'button', 'aria-label': 'Odwróć kartę: ' + item.name,
  });

  const front = el('div', { class: 'flip-card__face flip-card__face--front' });
  const img = el('img', { class: 'flip-card__photo', src: item.image, alt: item.name, loading: 'lazy' });
  img.addEventListener('load', () => {
    const color = sampleEdgeColor(img);
    if (color) img.style.backgroundColor = color;
  });
  img.addEventListener('error', () => {
    front.classList.add('img-missing');
    img.remove();
    front.appendChild(el('span', { class: 'img-missing__label' }, item.name));
  });
  front.appendChild(img);
  front.appendChild(el('span', { class: 'flip-card__ticket' }, formatTicket(item.id)));
  if (CardsState.deck === 'rolls' && item.needsSauce) front.appendChild(buildStamp());
  front.appendChild(el('span', { class: 'flip-card__hint' }, 'Dotknij'));
  card.appendChild(front);

  const back = el('div', { class: 'flip-card__face flip-card__face--back' });
  back.appendChild(el('div', { class: 'flip-card__name' }, item.name));
  if (CardsState.deck === 'rolls'){
    if (item.count > 1) back.appendChild(el('div', { class: 'flip-card__meta' }, item.count + ' szt'));
    back.appendChild(buildIngredientList(item.ingredients));
  } else {
    if (item.count) back.appendChild(el('div', { class: 'flip-card__meta' }, item.count + ' szt w zestawie'));
    const list = el('ul', { class: 'roll-ref-list' });
    item.items.forEach(it => list.appendChild(el('li', {}, buildRollRefRow(it))));
    back.appendChild(list);
  }
  card.appendChild(back);

  const flip = () => { CardsState.flipped = !CardsState.flipped; card.classList.toggle('is-flipped'); };
  card.addEventListener('click', flip);
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); flip(); } });

  stage.appendChild(card);
  view.appendChild(stage);

  const nav = el('div', { class: 'card-nav' }, [
    el('button', {
      class: 'round-btn', 'aria-label': 'Poprzednia karta',
      disabled: CardsState.index <= 0 ? 'disabled' : null,
      onClick: () => { if (CardsState.index > 0){ CardsState.index--; CardsState.flipped = false; renderCardsView(root); } }
    }, iconEl('arrowLeft')),
    el('span', { class: 'card-nav__counter' }, (CardsState.index + 1) + ' / ' + currentItems.length),
    el('button', {
      class: 'round-btn', 'aria-label': 'Następna karta',
      disabled: CardsState.index >= currentItems.length - 1 ? 'disabled' : null,
      onClick: () => { if (CardsState.index < currentItems.length - 1){ CardsState.index++; CardsState.flipped = false; renderCardsView(root); } }
    }, iconEl('arrowRight')),
  ]);
  view.appendChild(nav);

  root.appendChild(view);
}
