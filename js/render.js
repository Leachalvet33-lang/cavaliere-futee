/* Fonctions de rendu de cartes produit, réutilisées sur plusieurs pages */

const CF_BADGE_LABEL = {
  'nouveau': 'Nouveau',
  'coup-de-coeur': 'Coup de cœur',
  'promo': 'Bon plan',
  'selection': 'Sélection cavalière futée',
  'premium': 'Premium',
  'made-in-france': 'Made in France',
  'dressage': 'Dressage',
  'best-seller': 'Best-seller',
  'cso': 'CSO',
  'tous-budgets': 'Tous budgets',
  'ete-indispensable': 'Été indispensable',
  'ideal-debutants': 'Idéal débutants',
  'niveau-intermediaire': 'Niveau intermédiaire',
  'cso-competition': 'CSO & Compétition',
  'polyvalent': 'Polyvalent',
};

function cfBadgeClass(badge) {
  if (badge === 'promo') return 'badge-terracotta';
  if (badge === 'coup-de-coeur' || badge === 'premium') return 'badge-brun';
  if (badge === 'made-in-france') return 'badge-terracotta';
  return 'badge';
}

function cfImgOnError(p) {
  return `this.onerror=null;this.src='https://picsum.photos/seed/${p.id}/700/525'`;
}

function cfImgClass(p) {
  if (p.imgFit === 'contain') return 'img-contain';
  if (p.imgPosition === 'top') return 'img-top';
  return '';
}

function cfImgWrapStyle(p) {
  return p.imgFit === 'contain' ? ` style="background:${p.imgBg || '#FDF8F2'}"` : '';
}

function cfCtaButtons(p, linkUrl) {
  if (Array.isArray(p.ctas) && p.ctas.length) {
    return p.ctas.map((c) => `<a href="${c.href || '#'}" class="btn btn-primary btn-sm" rel="sponsored noopener" target="_blank">${c.label} →</a>`).join('');
  }
  const ctaLabel = p.ctaLabel || "Voir l'offre";
  const url = linkUrl !== undefined ? linkUrl : p.detailUrl;
  if (url) {
    return `<a href="${url}" class="btn btn-primary btn-sm">${ctaLabel} →</a>`;
  }
  return `<a href="#" class="btn btn-primary btn-sm" rel="sponsored noopener" target="_blank">${ctaLabel} →</a>`;
}

function cfProductCard(p, opts = {}) {
  const linkUrl = opts.urlKey ? p[opts.urlKey] : p.detailUrl;
  const badge = p.badge ? `<span class="${cfBadgeClass(p.badge)} badge">${CF_BADGE_LABEL[p.badge]}</span>` : '';
  const oldPrice = p.oldPrice ? `<span class="old">${p.oldPrice}</span>` : '';
  const subtitle = p.subtitle ? `<p class="card-subtitle">${p.subtitle}</p>` : '';
  const priceHtml = p.price ? `<span class="card-price">${oldPrice}${p.price}</span>` : '';
  const multiCta = Array.isArray(p.ctas) && p.ctas.length > 1;
  const revealClass = opts.reveal ? 'reveal' : '';
  const imgTag = `<img src="${p.img}" alt="${p.name}" loading="lazy" onerror="${cfImgOnError(p)}" class="${cfImgClass(p)}">`;
  const imageBlock = linkUrl
    ? `<a href="${linkUrl}" class="card-img"${cfImgWrapStyle(p)}>${imgTag}${badge}</a>`
    : `<div class="card-img"${cfImgWrapStyle(p)}>${imgTag}${badge}</div>`;
  const titleTag = linkUrl
    ? `<h3 class="card-title"><a href="${linkUrl}">${p.name}</a></h3>`
    : `<h3 class="card-title">${p.name}</h3>`;
  return `
    <article class="card ${revealClass}">
      ${imageBlock}
      <div class="card-body">
        <span class="card-tag">${p.tag}</span>
        ${titleTag}
        ${subtitle}
        <p class="card-desc">${p.desc}</p>
        <div class="card-footer${multiCta ? ' card-footer-multi' : ''}">
          ${priceHtml}
          <div class="card-cta-group">${cfCtaButtons(p, linkUrl)}</div>
        </div>
      </div>
    </article>
  `;
}

function cfRenderGrid(containerId, products, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = products.map((p) => cfProductCard(p, opts)).join('');
  if (opts.reveal) setupScrollReveal();
}

function cfPickCard(p) {
  const badge = p.badge ? `<span class="${cfBadgeClass(p.badge)} badge">${CF_BADGE_LABEL[p.badge]}</span>` : '';
  const subtitle = p.subtitle ? `<p class="pick-subtitle">${p.subtitle}</p>` : '';
  const priceHtml = p.price ? `<span class="pick-price">${p.price}</span>` : '';
  const imgTag = `<img src="${p.img}" alt="${p.name}" loading="lazy" onerror="${cfImgOnError(p)}" class="${cfImgClass(p)}">`;
  const imageBlock = p.detailUrl
    ? `<a href="${p.detailUrl}" class="pick-card-img"${cfImgWrapStyle(p)}>${imgTag}${badge}</a>`
    : `<div class="pick-card-img"${cfImgWrapStyle(p)}>${imgTag}${badge}</div>`;
  const titleTag = p.detailUrl ? `<h4><a href="${p.detailUrl}">${p.name}</a></h4>` : `<h4>${p.name}</h4>`;
  return `
    <div class="pick-card">
      ${imageBlock}
      <div class="pick-card-body">
        <span class="card-tag">${p.tag}</span>
        ${titleTag}
        ${subtitle}
        <div class="pick-card-foot">
          ${priceHtml}
          <div class="pick-card-ctas">${cfCtaButtons(p)}</div>
        </div>
      </div>
    </div>
  `;
}

function cfRenderPicks(containerId, products) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = products.map(cfPickCard).join('');
}

/* "Vous aimerez aussi" — suggestions pertinentes par rubrique, toujours 4, jamais de 404 */

function cfProductUrl(p) {
  return p.equipementUrl || p.pepiteUrl || p.detailUrl || null;
}

const CF_REL = {
  SELLES: ['selle-voltige-confort', 'selle-dressage-antares', 'selle-cso-dos-large', 'selle-cso-devoucoux-biarritz', 'selle-kramer-tous-budgets'],
  TAPIS: ['tapis-harcour-versailles', 'tapis-harcour-chic', 'tapis-horze-bon-plan', 'tapis-kentucky', 'tapis-gem', 'couvre-reins-polaire'],
  AMORTISSEURS: ['acavallo-gel-pad', 'amortisseur-pravins', 'amortisseur-acavallo'],
  MORS: ['mors-simple-chantilly', 'mors-double-brise-doux', 'mors-baucher', 'mors-pessoa'],
  BRIDES: ['filet-horze-clermont-marron', 'filet-horze-clermont-noir'],
  PROTECTIONS: ['guetres-veredus-carbon-gel', 'guetres-horze-supreme', 'guetres-lemieux', 'protections-boulets-cso', 'proteges-boulets-kentucky'],
  PROTECTION_REPOS: ['guetres-repos-kentucky'],
  MASQUE_MOUCHES: ['masque-mouches-fouganza'],
  SPRAY_MOUCHES: ['anti-mouches-duo'],
  COMPLEMENTS: ['complement-electroliq', 'complement-recuperation', 'complement-mash-reverdy'],
  DEMELANT: ['demelant-duo'],
  CASQUES: ['casque-vg1', 'casque-samshield', 'casque-naca', 'casque-equitheme', 'casque-flexon-armet'],
  VESTE_CONCOURS: ['veste-harcour-kanji-hitair', 'veste-harcour-hotaka-hitair', 'veste-equitheme-comptair', 'veste-privilege-airsafe'],
  TENUE_TOUS_TEMPS: ['manteau-horse-pilot', 'veste-harcour-simhat', 'kway-qhp', 'manteau-mountain-horse'],
  PANTALONS: ['jodhpur-silicone-genoux', 'pantalon-pomme-equestrian', 'pantalon-harcour-jaltika', 'pantalon-equitheme-claudine', 'pantalon-horze-mira-grandprix', 'pantalon-kramer'],
  BOTTES: ['bottes-ego7-aries-orion', 'bottes-sergio-grasso', 'bottes-parlanti', 'bottes-horze', 'bottes-kramer'],
  AIRBAGS: ['airbag-twistair-2', 'airbag-hitair-complet3', 'airbag-freejump', 'airbag-helite-zipin2', 'airbag-equitheme-airsafe'],
};
CF_REL.MOUCHES = CF_REL.MASQUE_MOUCHES.concat(CF_REL.SPRAY_MOUCHES);
CF_REL.VESTES_TOUTES = CF_REL.VESTE_CONCOURS.concat(CF_REL.TENUE_TOUS_TEMPS);

function cfPoolPick(ids, excludeId, count, usedIds) {
  const picked = [];
  for (const pid of ids) {
    if (picked.length >= count) break;
    if (pid === excludeId || usedIds.has(pid)) continue;
    const p = CF_DATA.products.find((x) => x.id === pid);
    if (!p || !cfProductUrl(p)) continue;
    picked.push(p);
    usedIds.add(pid);
  }
  return picked;
}

function cfGetSimilarProducts(product, count = 4) {
  if (!product) return [];
  const id = product.id;
  const usedIds = new Set([id]);
  const inPool = (ids) => ids.includes(id);
  let plan;

  if (inPool(CF_REL.SELLES)) {
    plan = [[CF_REL.SELLES, 2], [CF_REL.TAPIS, 1], [CF_REL.AMORTISSEURS, 1]];
  } else if (inPool(CF_REL.AMORTISSEURS)) {
    plan = [[CF_REL.AMORTISSEURS, 2], [CF_REL.TAPIS, 1], [CF_REL.SELLES, 1]];
  } else if (inPool(CF_REL.TAPIS)) {
    plan = [[CF_REL.TAPIS, 2], [CF_REL.AMORTISSEURS, 1], [CF_REL.SELLES, 1]];
  } else if (inPool(CF_REL.MORS)) {
    plan = [[CF_REL.MORS, 2], [CF_REL.BRIDES, 2]];
  } else if (inPool(CF_REL.BRIDES)) {
    plan = [[CF_REL.BRIDES, 1], [CF_REL.MORS, 3]];
  } else if (inPool(CF_REL.PROTECTION_REPOS)) {
    plan = [[CF_REL.PROTECTIONS, 3], [CF_REL.TAPIS, 1]];
  } else if (inPool(CF_REL.MOUCHES)) {
    plan = [[CF_REL.MOUCHES, 1], [CF_REL.PROTECTIONS, 2], [CF_REL.TAPIS, 1]];
  } else if (inPool(CF_REL.PROTECTIONS)) {
    plan = [[CF_REL.PROTECTIONS, 2], [CF_REL.PROTECTION_REPOS, 1], [CF_REL.TAPIS, 1]];
  } else if (inPool(CF_REL.DEMELANT)) {
    plan = [[CF_REL.COMPLEMENTS, 2], [CF_REL.SPRAY_MOUCHES, 1], [CF_REL.MASQUE_MOUCHES, 1]];
  } else if (inPool(CF_REL.COMPLEMENTS)) {
    plan = [[CF_REL.COMPLEMENTS, 2], [CF_REL.DEMELANT, 1], [CF_REL.SPRAY_MOUCHES, 1]];
  } else if (inPool(CF_REL.CASQUES)) {
    plan = [[CF_REL.CASQUES, 2], [CF_REL.VESTE_CONCOURS, 1], [CF_REL.AIRBAGS, 1]];
  } else if (inPool(CF_REL.VESTE_CONCOURS)) {
    plan = [[CF_REL.VESTE_CONCOURS, 1], [CF_REL.PANTALONS, 1], [CF_REL.CASQUES, 1], [CF_REL.AIRBAGS, 1]];
  } else if (inPool(CF_REL.TENUE_TOUS_TEMPS)) {
    plan = [[CF_REL.TENUE_TOUS_TEMPS, 2], [CF_REL.PANTALONS, 1], [CF_REL.CASQUES, 1]];
  } else if (inPool(CF_REL.PANTALONS)) {
    plan = [[CF_REL.PANTALONS, 2], [CF_REL.VESTES_TOUTES, 1], [CF_REL.BOTTES, 1]];
  } else if (inPool(CF_REL.BOTTES)) {
    plan = [[CF_REL.BOTTES, 3], [CF_REL.PANTALONS, 1]];
  } else if (inPool(CF_REL.AIRBAGS)) {
    plan = [[CF_REL.AIRBAGS, 2], [CF_REL.VESTES_TOUTES, 1], [CF_REL.CASQUES, 1]];
  } else {
    plan = [[CF_DATA.products.filter((p) => p.category === product.category).map((p) => p.id), count]];
  }

  let result = [];
  plan.forEach(([pool, n]) => {
    result = result.concat(cfPoolPick(pool, id, n, usedIds));
  });
  if (result.length < count) {
    const fallback = CF_DATA.products.filter((p) => cfProductUrl(p)).map((p) => p.id);
    result = result.concat(cfPoolPick(fallback, id, count - result.length, usedIds));
  }
  return result.slice(0, count).map((p) => Object.assign({}, p, { _relUrl: cfProductUrl(p) }));
}
