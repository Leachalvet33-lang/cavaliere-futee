/* Moteur de recherche de la page d'accueil : redirige vers la fiche produit correspondante
   à partir de l'index /search-index.json (nom, catégorie, mots-clés, slug). */

let cfSearchIndex = null;

function cfNormalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

async function cfLoadSearchIndex() {
  if (cfSearchIndex) return cfSearchIndex;
  const res = await fetch('/search-index.json');
  cfSearchIndex = await res.json();
  return cfSearchIndex;
}

function cfMatchProducts(index, rawQuery) {
  const query = cfNormalize(rawQuery);
  if (!query) return [];

  const starts = [];
  const contains = [];
  index.forEach((entry) => {
    const nom = cfNormalize(entry.nom);
    const keywords = entry.mots_cles.map(cfNormalize);
    const isStart = nom.startsWith(query) || keywords.some((k) => k.startsWith(query));
    const isMatch = isStart || nom.includes(query) || keywords.some((k) => k.includes(query));
    if (isStart) starts.push(entry);
    else if (isMatch) contains.push(entry);
  });
  return [...starts, ...contains];
}

function cfRenderSuggestions(panel, matches) {
  if (matches.length === 0) {
    panel.innerHTML = `
      <div class="search-empty">
        <p>Aucun produit trouvé — essaie le comparateur pour trouver ton équipement idéal 🐴</p>
        <a href="/comparateur.html" class="btn btn-outline btn-sm">Essayer le comparateur →</a>
      </div>
    `;
  } else {
    panel.innerHTML = matches.map((m) => `
      <button type="button" class="search-suggestion-item" data-slug="${m.slug}">
        <span class="search-suggestion-name">${m.nom}</span>
        <span class="search-suggestion-cat">${m.categorie}</span>
      </button>
    `).join('');
    panel.querySelectorAll('.search-suggestion-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        cfNavigateWithTransition(btn.dataset.slug);
      });
    });
  }
  panel.classList.add('active');
}

function cfHideSuggestions(panel) {
  panel.classList.remove('active');
  panel.innerHTML = '';
}

function cfSetupSearch() {
  const form = document.getElementById('heroSearchForm');
  const input = document.getElementById('heroSearchInput');
  const panel = document.getElementById('searchSuggestions');
  if (!form || !input || !panel) return;

  cfLoadSearchIndex();

  input.addEventListener('input', async () => {
    const query = input.value.trim();
    if (query.length < 3) {
      cfHideSuggestions(panel);
      return;
    }
    const index = await cfLoadSearchIndex();
    cfRenderSuggestions(panel, cfMatchProducts(index, query));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    const index = await cfLoadSearchIndex();
    const matches = cfMatchProducts(index, query);
    if (matches.length === 1) {
      cfNavigateWithTransition(matches[0].slug);
    } else {
      cfRenderSuggestions(panel, matches);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) cfHideSuggestions(panel);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cfHideSuggestions(panel);
  });
}

document.addEventListener('partialsReady', cfSetupSearch);
