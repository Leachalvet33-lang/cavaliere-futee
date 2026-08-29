/* Gestion des onglets de la page Équipement */

function cfActivateTab(tabId) {
  document.querySelectorAll('#tabNav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === 'panel-' + tabId));
}

function cfActivateSubtab(subId) {
  document.querySelectorAll('#subtabNav button').forEach((b) => b.classList.toggle('active', b.dataset.subtab === subId));
  document.querySelectorAll('.subtab-panel').forEach((p) => p.classList.toggle('active', p.id === 'subpanel-' + subId));
}

function cfRenderGuideGrids() {
  const byCategory = (cat) => CF_DATA.products.filter((p) => p.category === cat && p.equipementUrl);
  const bySubcategory = (sub) => CF_DATA.products.filter((p) => p.subcategory === sub && p.equipementUrl);

  cfRenderGrid('grid-selles', byCategory('selles'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-filets', byCategory('filets'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-protections', byCategory('protections'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-tapis', byCategory('tapis'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-complements', byCategory('complements'), { reveal: true, urlKey: 'equipementUrl' });

  cfRenderGrid('grid-casques', bySubcategory('casques'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-veste-concours', bySubcategory('veste-concours'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-tenue-tous-temps', bySubcategory('tenue-tous-temps'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-pantalon', bySubcategory('pantalon'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-bottes', bySubcategory('bottes'), { reveal: true, urlKey: 'equipementUrl' });
  cfRenderGrid('grid-airbag', bySubcategory('airbag'), { reveal: true, urlKey: 'equipementUrl' });
}

document.addEventListener('partialsReady', () => {
  cfRenderGuideGrids();

  document.querySelectorAll('#tabNav button').forEach((btn) => {
    btn.addEventListener('click', () => {
      cfActivateTab(btn.dataset.tab);
      history.replaceState(null, '', '#' + btn.dataset.tab);
    });
  });

  document.querySelectorAll('#subtabNav button').forEach((btn) => {
    btn.addEventListener('click', () => cfActivateSubtab(btn.dataset.subtab));
  });

  const hash = window.location.hash.replace('#', '');
  const validTabs = ['selles', 'filets', 'protections', 'tapis', 'complements', 'vetements'];
  if (validTabs.includes(hash)) cfActivateTab(hash);
});
