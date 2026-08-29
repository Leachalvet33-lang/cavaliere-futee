/* Logique du comparateur : sélection de catégorie, questions dynamiques, appel au service de recommandation + repli local */

const cfState = { category: null, fields: {}, precisions: '' };
let cfCurrentStep = 1;
const CF_TOTAL_STEPS = 2;

function cfShowStep(step) {
  document.querySelectorAll('.step').forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === step));
  document.querySelectorAll('#progressTrack .seg').forEach((seg, i) => seg.classList.toggle('done', i < step));
  cfCurrentStep = step;
}

function cfOptionCardHtml(opt) {
  const descHtml = opt.desc ? `<span>${opt.desc}</span>` : '';
  return `<div class="option-card" data-value="${opt.value}"><strong>${opt.label}</strong>${descHtml}</div>`;
}

function cfBuildCategoryGrid() {
  const grid = document.getElementById('categoryGrid');
  grid.innerHTML = CF_COMPARE_CATEGORIES.map((cat) => cfOptionCardHtml({
    value: cat.id, label: cat.label, desc: cat.desc,
  })).join('');
  cfSetupOptionCards(grid.closest('.step'));
}

function cfBuildStep2() {
  const cat = cfGetCategory(cfState.category);
  document.getElementById('step2Title').textContent = `${cat.label} — quelques précisions`;
  document.getElementById('submitCompareBtn').textContent = cat.resultCta || 'Voir ma recommandation ✨';
  const container = document.getElementById('dynamicQuestions');
  container.innerHTML = cat.questions.map((q) => `
    <div class="dyn-question">
      <p class="dyn-q-label">${q.question}</p>
      <div class="option-grid" data-field="${q.field}">
        ${q.options.map(cfOptionCardHtml).join('')}
      </div>
    </div>
  `).join('');
  cfState.fields = {};
  cfSetupOptionCards(container);
}

function cfSetupOptionCards(scope) {
  (scope || document).querySelectorAll('.option-grid').forEach((grid) => {
    const field = grid.dataset.field;
    grid.querySelectorAll('.option-card').forEach((card) => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.option-card').forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');
        if (field === 'category') {
          cfState.category = card.dataset.value;
        } else {
          cfState.fields[field] = card.dataset.value;
        }
      });
    });
  });
}

function cfValidateStep(step) {
  const grids = document.querySelectorAll(`.step[data-step="${step}"] .option-grid`);
  let valid = true;
  grids.forEach((grid) => {
    const field = grid.dataset.field;
    const value = field === 'category' ? cfState.category : cfState.fields[field];
    if (!value) {
      valid = false;
      grid.style.boxShadow = '0 0 0 2px #C17B4A';
      grid.style.borderRadius = '14px';
      setTimeout(() => { grid.style.boxShadow = ''; }, 700);
    }
  });
  return valid;
}

function cfSetupNav() {
  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!cfValidateStep(cfCurrentStep)) return;
      if (cfCurrentStep === 1) cfBuildStep2();
      if (cfCurrentStep < CF_TOTAL_STEPS) cfShowStep(cfCurrentStep + 1);
    });
  });
  document.querySelectorAll('[data-prev]').forEach((btn) => {
    btn.addEventListener('click', () => { if (cfCurrentStep > 1) cfShowStep(cfCurrentStep - 1); });
  });
}

function cfEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str == null ? '' : str);
  return div.innerHTML;
}

function cfRenderRedirectResult(redirect) {
  const panel = document.getElementById('resultContent');
  let html = '';

  if (redirect.found) {
    html += `<div class="notice notice-info">Voici notre recommandation pour toi 🐴</div>`;
    html += `<h3>${cfEscapeHtml(redirect.name)}</h3>`;
  } else {
    html += `<div class="notice notice-info">Voici notre sélection pour toi 🐴</div>`;
    html += `<h3>Découvre notre sélection de bons plans équitation</h3>`;
  }

  const btnLabel = redirect.found ? 'Voir la fiche →' : 'Voir les bons plans →';
  html += `<div class="text-center mt-40"><button type="button" class="btn btn-primary" id="goToProductBtn">${btnLabel}</button></div>`;
  panel.innerHTML = html;
  document.getElementById('goToProductBtn').addEventListener('click', () => {
    window.location.href = redirect.url;
  });
}

function cfSubmitCompare(e) {
  e.preventDefault();
  if (!cfValidateStep(2)) return;
  cfState.precisions = document.getElementById('precisions').value.trim();

  document.getElementById('compareForm').style.display = 'none';
  document.getElementById('loadingPanel').classList.add('active');

  const redirect = cfResolveRedirect(cfState.category, cfState.fields);

  setTimeout(() => {
    document.getElementById('loadingPanel').classList.remove('active');
    cfRenderRedirectResult(redirect);
    document.getElementById('resultPanel').classList.add('active');
  }, 500);
}

document.addEventListener('partialsReady', () => {
  cfBuildCategoryGrid();
  cfShowStep(1);
  cfSetupNav();
  document.getElementById('compareForm').addEventListener('submit', cfSubmitCompare);
  document.getElementById('restartBtn').addEventListener('click', () => {
    cfState.category = null;
    cfState.fields = {};
    cfState.precisions = '';
    document.querySelectorAll('.option-card').forEach((c) => c.classList.remove('selected'));
    document.getElementById('precisions').value = '';
    document.getElementById('resultPanel').classList.remove('active');
    document.getElementById('compareForm').style.display = '';
    cfShowStep(1);
  });
});
