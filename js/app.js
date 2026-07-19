// ---------------------------------------------------------
// Bootstrap aplikacji: przełączanie trybów, start.
// ---------------------------------------------------------

var AppState = { view: 'menu' }; // 'menu' (przeglądanie/szukanie) | 'learn' (nauka)

function renderCurrentView(){
  const menuPanel = document.getElementById('menuPanel');
  const learnRoot = document.getElementById('learnRoot');
  const topbarBrand = document.getElementById('topbarBrand');
  const topbarActions = document.getElementById('topbarActions');
  const backBtn = document.getElementById('backBtn');
  const isMenu = AppState.view === 'menu';

  menuPanel.hidden = !isMenu;
  learnRoot.hidden = isMenu;

  // Menu view: logo/title on the left, "open learning mode" button on the
  // right. Learn view: just a back button on the left, nothing on the right.
  topbarBrand.hidden = !isMenu;
  topbarActions.hidden = !isMenu;
  backBtn.hidden = isMenu;

  if (isMenu) renderSearchBody();
  else renderLearnView(learnRoot);
}

function switchView(name){
  if (name !== 'menu' && name !== 'learn') return;
  AppState.view = name;
  renderCurrentView();
  document.getElementById('viewRoot').scrollTop = 0;
}

function initApp(){
  document.getElementById('openLearnBtn').addEventListener('click', () => switchView('learn'));
  document.getElementById('backBtn').addEventListener('click', () => switchView('menu'));
  initSearch();
  renderCurrentView();
}

document.addEventListener('DOMContentLoaded', initApp);
