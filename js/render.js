// ---------------------------------------------------------
// Спільні хелпери для побудови DOM без фреймворків.
// ---------------------------------------------------------

function el(tag, attrs, children){
  const node = document.createElement(tag);
  attrs = attrs || {};
  for (const k in attrs){
    const v = attrs[k];
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  const kids = children === undefined ? [] : (Array.isArray(children) ? children : [children]);
  kids.forEach(c => {
    if (c === null || c === undefined || c === false) return;
    node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(c) : c);
  });
  return node;
}

function clear(node){ while (node.firstChild) node.removeChild(node.firstChild); }

function rollById(id){ return ROLLS.find(r => r.id === id) || null; }
function itemById(id){
  if (!id) return null;
  return id[0] === 's' ? SETS.find(s => s.id === id) : ROLLS.find(r => r.id === id);
}

const ICONS = {
  chevron: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z" fill="#fff"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 6h3.5c2 0 3 1 4.5 3M4 18h3.5c2 0 3-1 4.5-3M15 6h5v0M15 18h5v0M16.5 4L20 6l-3.5 2M16.5 20L20 18l-3.5-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>'
};

function iconEl(name, cls){
  const span = el('span', { class: cls || '' });
  span.innerHTML = ICONS[name] || '';
  return span.firstElementChild;
}

/**
 * Guess a photo's background color by averaging the pixels along its
 * edges (top/bottom rows, left/right columns) on a small downscaled
 * canvas. Product photos are almost always shot on a seamless backdrop,
 * so the edges are reliably background -- unlike a whole-image average,
 * which the food itself would skew. Used to color the letterbox bars
 * behind a `contain`-fit photo so they blend into the photo instead of
 * showing as an obvious dark frame.
 *
 * Returns an "rgb(r, g, b)" string, or null if it can't be read (e.g. a
 * tainted canvas when opening the site via file:// instead of a server).
 */
function sampleEdgeColor(imgEl){
  try {
    const w = 24, h = 24;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgEl, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = 0; y < h; y++){
      for (let x = 0; x < w; x++){
        if (x !== 0 && x !== w - 1 && y !== 0 && y !== h - 1) continue; // edges only
        const i = (y * w + x) * 4;
        r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
      }
    }
    if (!n) return null;
    return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
  } catch (err){
    return null; // tainted / cross-origin canvas -- caller keeps the default background
  }
}

/**
 * Photo box with graceful fallback: since the real .webp photos are
 * dropped in by the person running the site (not part of this data
 * export), a missing file shouldn't show a broken-image icon -- it
 * should show a calm placeholder with the item's name so the trainer
 * stays usable before photos are added.
 */
function buildPhotoBox(imagePath, name, opts){
  opts = opts || {};
  const box = el('div', { class: opts.boxClass || 'detail-photo' });
  const img = el('img', { src: imagePath, alt: name, loading: 'lazy' });
  img.addEventListener('load', () => {
    const color = sampleEdgeColor(img);
    if (color) img.style.backgroundColor = color;
  });
  img.addEventListener('error', () => {
    if (box.contains(img)) box.removeChild(img);
    box.classList.add('img-missing');
    box.appendChild(el('span', { class: 'img-missing__label' }, `Zdjęcie: ${name}`));
  });
  box.appendChild(img);
  if (opts.ticket) box.appendChild(el('span', { class: 'flip-card__ticket' }, opts.ticket));
  if (opts.stamp) box.appendChild(buildStamp());
  return box;
}

function buildStamp(){
  const s = el('div', { class: 'stamp', title: 'Sos dodawany osobno' });
  s.innerHTML = ICONS.drop;
  return s;
}

/**
 * `ingredients` is data.js's { name, grams, qty }[] -- grams/qty are
 * null until that item has been weighed (see data.js header comment).
 * Known values render as a small mono tag after the name (e.g.
 * "48 g · ×3"); unweighed ingredients just show the bare name, same
 * as before this field existed.
 */
function buildIngredientList(ingredients){
  return el('ul', { class: 'ingredient-list' }, ingredients.map(ing => {
    const metaParts = [];
    if (ing.grams != null) metaParts.push(ing.grams + ' g');
    if (ing.qty != null) metaParts.push('×' + ing.qty);
    return el('li', {}, [
      el('span', { class: 'ingredient-list__name' }, ing.name),
      metaParts.length ? el('span', { class: 'portion-tag' }, metaParts.join(' · ')) : null,
    ]);
  }));
}

/**
 * One row referencing a roll inside a set (used on the flashcard back
 * of a set, and as the label content of an accordion trigger).
 */
function buildRollRefRow(item){
  const roll = item.rollId ? rollById(item.rollId) : null;
  const nameText = roll ? roll.name : item.name;
  const row = el('div', { class: 'roll-ref-row-inner', style: 'display:flex;align-items:center;justify-content:space-between;gap:8px;flex:1;min-width:0;' }, [
    el('span', {}, nameText),
  ]);
  const tags = [];
  if (item.portion === 'half') tags.push(el('span', { class: 'portion-tag' }, '1/2'));
  if (item.qty) tags.push(el('span', { class: 'portion-tag' }, 'x' + item.qty));
  if (item.bonus) tags.push(el('span', { class: 'bonus-tag' }, 'gratis'));
  if (tags.length) row.appendChild(el('span', { style: 'display:flex;gap:6px;flex:none;' }, tags));
  return row;
}

function formatTicket(id){ return id.toUpperCase(); }

/**
 * Small pill toggle used anywhere a roll's OR a set's own card/tile is
 * shown -- adds/removes it from the cross-page Versus comparison (see
 * versus.js, loaded after this file but only called at click-time, by
 * which point everything is loaded). Dispatches on the id prefix, same
 * convention as itemById() above: a roll id ("r...") toggles just that
 * roll (toggleVersus/isInVersus); a set id ("s...") toggles the whole
 * set at once (toggleVersusSet/isSetFullyInVersus, versus.js) -- every
 * photographed roll it contains, tagged with the set's origin.
 *
 * A set with no photographed rolls at all (nothing for toggleVersusSet
 * to add -- see setMemberRollIds) renders the button disabled instead
 * of hiding it, so the card layout stays consistent with every other
 * card of the same kind.
 *
 * Otherwise deliberately dumb: it doesn't know or care which view is
 * showing it, so the caller supplies `onToggle` to re-render whatever
 * root needs to reflect the new on/off state (the label and `is-on`
 * class only update on next render, not live inside this closure).
 */
function buildVersusToggleBtn(itemId, onToggle, opts){
  opts = opts || {};
  const isSet = itemId[0] === 's';
  const disabled = isSet && setMemberRollIds(itemId).length === 0;
  const on = !disabled && (isSet ? isSetFullyInVersus(itemId) : isInVersus(itemId));
  const label = opts.label !== undefined ? opts.label : (on ? 'W porównaniu' : '+ Porównaj');
  const who = opts.name || itemId;
  const btn = el('button', {
    class: (opts.className || 'versus-toggle') + (on ? ' is-on' : '') + (disabled ? ' is-disabled' : ''),
    disabled: disabled ? 'disabled' : null,
    'aria-label': disabled
      ? ('Brak zdjęć rolek w zestawie -- nie da się porównać: ' + who)
      : (on ? ('Usuń z porównania: ' + who) : ('Dodaj do porównania (Versus): ' + who)),
    'aria-pressed': on ? 'true' : 'false',
    onClick: (e) => {
      e.stopPropagation();
      if (disabled) return;
      if (isSet) toggleVersusSet(itemId); else toggleVersus(itemId);
      if (onToggle) onToggle();
    },
  }, label);
  return btn;
}

/** Direct roll detail block: photo + name + full composition, no accordion.
 * `onVersusChange`, if given, is called after the Versus toggle button is
 * clicked so the caller can re-render its own root (this block itself
 * doesn't re-render -- it's a one-shot element tree like the rest of
 * render.js). */
function renderRollDetailBlock(roll, onVersusChange){
  const metaParts = [];
  if (roll.count > 1) metaParts.push(roll.count + ' szt');
  if (roll.weightGrams != null) metaParts.push('~' + roll.weightGrams + ' g');
  return el('div', { class: 'detail-head detail-head--roll' }, [
    buildPhotoBox(roll.image, roll.name, { ticket: formatTicket(roll.id), stamp: roll.needsSauce }),
    el('div', { class: 'detail-body' }, [
      el('div', { class: 'detail-name-row' }, [
        el('h2', { class: 'detail-name' }, roll.name),
        buildVersusToggleBtn(roll.id, onVersusChange, { className: 'detail-versus-btn', name: roll.name }),
      ]),
      metaParts.length ? el('p', { class: 'flip-card__meta' }, metaParts.join(' · ')) : null,
      buildIngredientList(roll.ingredients),
    ]),
  ]);
}

/** Set detail block: photo+name row (with a Versus toggle for the whole
 * set, same spot as renderRollDetailBlock's), then an accordion of its
 * rolls. `onVersusChange` behaves exactly as in renderRollDetailBlock. */
function renderSetDetailBlock(set, onVersusChange){
  const membersWrap = el('div', { class: 'accordion-list', style: 'display:flex;flex-direction:column;gap:10px;' });

  set.items.forEach((item, idx) => {
    const roll = item.rollId ? rollById(item.rollId) : null;
    if (!roll){
      // no photographed card for this component -- show as a plain info line
      membersWrap.appendChild(el('div', { class: 'extra-note' }, `${item.name}${item.bonus ? ' (gratis)' : ''} — bez osobnego zdjęcia`));
      return;
    }
    const panelInner = el('div', { class: 'accordion-panel-inner' }, [
      buildPhotoBox(roll.image, roll.name, { boxClass: 'detail-photo', stamp: roll.needsSauce }),
      el('div', {}, [
        el('h3', { style: 'font-family:var(--font-body);font-weight:600;font-size:15px;margin-bottom:8px;' }, roll.name),
        roll.weightGrams != null ? el('p', { class: 'flip-card__meta' }, '~' + roll.weightGrams + ' g') : null,
        buildIngredientList(roll.ingredients),
      ]),
    ]);
    const item_id = `acc-${set.id}-${idx}`;
    const trigger = el('button', { class: 'accordion-trigger', 'aria-expanded': 'false', id: item_id + '-btn' }, [
      buildRollRefRow(item),
      iconEl('chevron'),
    ]);
    const panel = el('div', { class: 'accordion-panel', role: 'region' }, panelInner);
    const wrap = el('div', { class: 'accordion-item' }, [trigger, panel]);
    trigger.addEventListener('click', () => {
      const open = wrap.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
    });
    membersWrap.appendChild(wrap);
  });

  return el('div', { class: 'detail-head detail-head--set' }, [
    buildPhotoBox(set.image, set.name, { ticket: formatTicket(set.id) }),
    el('div', { class: 'detail-body', style: 'flex:1;display:flex;flex-direction:column;gap:12px;' }, [
      el('div', { class: 'detail-name-row' }, [
        el('h2', { class: 'detail-name' }, set.name),
        buildVersusToggleBtn(set.id, onVersusChange, { className: 'detail-versus-btn', name: set.name }),
      ]),
      set.count ? el('p', { class: 'flip-card__meta' }, set.count + ' szt w zestawie') : null,
      membersWrap,
    ]),
  ]);
}
