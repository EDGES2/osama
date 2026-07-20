// ---------------------------------------------------------
// Bootstrap aplikacji: przełączanie trybów, start.
// ---------------------------------------------------------

var AppState = { view: 'menu' }; // 'menu' (przeglądanie/szukanie) | 'learn' (nauka) | 'versus' (porównanie)

function renderCurrentView(){
  const menuPanel = document.getElementById('menuPanel');
  const learnRoot = document.getElementById('learnRoot');
  const versusRoot = document.getElementById('versusRoot');
  const topbarBrand = document.getElementById('topbarBrand');
  const topbarActions = document.getElementById('topbarActions');
  const backBtn = document.getElementById('backBtn');
  const isMenu = AppState.view === 'menu';

  menuPanel.hidden = !isMenu;
  learnRoot.hidden = AppState.view !== 'learn';
  versusRoot.hidden = AppState.view !== 'versus';

  // Menu view: logo/title on the left, "open learning mode"/"open versus"
  // buttons on the right. Learn/Versus views: just a back button on the
  // left, nothing on the right.
  topbarBrand.hidden = !isMenu;
  topbarActions.hidden = !isMenu;
  backBtn.hidden = isMenu;

  if (isMenu) renderSearchBody();
  else if (AppState.view === 'learn') renderLearnView(learnRoot);
  else if (AppState.view === 'versus') renderVersusView(versusRoot);

  updateVersusBadge();
}

function switchView(name){
  if (name !== 'menu' && name !== 'learn' && name !== 'versus') return;
  AppState.view = name;
  renderCurrentView();
  document.getElementById('viewRoot').scrollTop = 0;
}

/** Mały licznik na przycisku "VS" w topbarze -- pokazuje ile pozycji
 * jest teraz w porównaniu (VersusState.ids z versus.js), ukryty przy
 * zerze. Wywoływane po każdej zmianie wyboru (patrz toggleVersus /
 * clearVersus w versus.js) i po każdym renderCurrentView, więc zawsze
 * jest aktualny niezależnie od tego, z którego widoku dodano/usunięto
 * pozycję. */
function updateVersusBadge(){
  const badge = document.getElementById('versusBadge');
  if (!badge) return;
  const count = VersusState.ids.length;
  badge.hidden = count === 0;
  badge.textContent = String(count);
}

function initApp(){
  document.getElementById('openLearnBtn').addEventListener('click', () => switchView('learn'));
  document.getElementById('openVersusBtn').addEventListener('click', () => switchView('versus'));
  document.getElementById('backBtn').addEventListener('click', () => switchView('menu'));
  initSearch();
  renderCurrentView();
}

document.addEventListener('DOMContentLoaded', initApp);
