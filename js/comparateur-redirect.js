/* Système de redirection intelligente : à partir des réponses du comparateur, détermine
   la fiche produit la plus pertinente et renvoie son URL réelle (jamais de lien mort).
   Règle absolue : chaque combinaison de réponses produit toujours un résultat — soit une
   fiche produit précise, soit la page Bons Plans (jamais de page introuvable). */

function cfPickProduct(id) {
  return CF_DATA.products.find((p) => p.id === id) || null;
}

function cfRedirectSelle(f) {
  const b = f.budget;
  const highBudget = b === '1500-3000' || b === '3000+';
  const midBudget = b === '500-1500';

  if (f.discipline === 'cso') {
    if (highBudget) return 'selle-voltige-confort'; // CWD SE01
    if (midBudget) return 'selle-cso-devoucoux-biarritz'; // Devoucoux Biarritz
    return 'selle-kramer-tous-budgets'; // Kramer Wintec / Fouganza (petit budget)
  }
  if (f.discipline === 'dressage') {
    if (highBudget) return 'selle-dressage-antares'; // Antarès
    return 'selle-kramer-tous-budgets'; // Kramer Showmaster (budget moyen/petit)
  }
  // endurance / loisir (polyvalent)
  return 'selle-kramer-tous-budgets';
}

function cfRedirectCasque(f) {
  const b = f.budget;
  const highBudget = b === '300+';
  const midBudget = b === '150-300';

  if (highBudget) {
    return f.style === 'personnalise' ? 'casque-naca' : 'casque-samshield';
  }
  if (midBudget) {
    return f.style === 'personnalise' ? 'casque-flexon-armet' : 'casque-vg1'; // Flex-On Armet ou Kask Star Lady
  }
  return 'casque-equitheme'; // petit budget
}

function cfRedirectPantalon(f) {
  const b = f.budget;
  const competition = f.discipline === 'cso' || f.discipline === 'dressage';

  if (b === '200+') {
    return competition ? 'jodhpur-silicone-genoux' : 'pantalon-pomme-equestrian'; // Horse Pilot X-Design ou Pomme Equestrian
  }
  if (b === '100-200') {
    return f.besoin === 'grip-genoux' ? 'pantalon-harcour-jaltika' : 'pantalon-horze-mira-grandprix'; // Harcour Jaltika ou Horze Mira
  }
  return f.besoin === 'grip-genoux' ? 'pantalon-equitheme-claudine' : 'pantalon-kramer'; // petit budget
}

function cfRedirectGuetres(f) {
  if (f.niveau_protection === 'maximale') return 'guetres-veredus-carbon-gel'; // compétition intensive
  if (f.niveau_protection === 'renforcee') {
    return f.terrain === 'herbe' ? 'guetres-lemieux' : 'guetres-horze-supreme'; // entraînement, budget moyen
  }
  return 'guetres-repos-kentucky'; // légère = quotidien / transport / repos
}

function cfRedirectAirbag(f) {
  const b = f.budget;
  if (b === '300+') return 'airbag-twistair-2'; // sécurité maximale
  if (b === '150-300') return f.niveau === 'confirmee' ? 'airbag-helite-zipin2' : 'airbag-hitair-complet3'; // discrétion
  return f.niveau === 'debutante' ? 'airbag-equitheme-airsafe' : 'airbag-freejump'; // petit budget
}

function cfRedirectFiletMors(f) {
  if (f.budget === '200+') return 'filet-horze-clermont-marron'; // budget élevé + élégance
  if (f.sensibilite === 'tres-sensible' || f.contact === 'apprentissage') {
    return f.contact === 'doux' ? 'mors-double-brise-doux' : 'mors-simple-chantilly'; // débutant + bouche sensible
  }
  if (f.contact === 'franc' && f.discipline === 'cso') return 'mors-pessoa'; // CSO confirmé + contrôle
  if (f.discipline === 'dressage') return 'mors-baucher'; // dressage + mise en main
  return 'mors-double-brise-doux'; // polyvalent
}

function cfRedirectMasque(f) {
  if (f.usage === 'quotidien') return 'BONS_PLANS'; // usage intensif -> sélection Bons Plans
  return 'complement-masque-anti-mouches-redirect'; // Masque Decathlon Fouganza 500
}

function cfRedirectComplements(f) {
  if (f.objectif === 'recuperation') return f.budget === '<30' ? 'complement-electroliq' : 'complement-recuperation';
  if (f.objectif === 'digestion') return 'complement-mash-reverdy'; // cheval sensible
  return 'BONS_PLANS'; // articulations & tendons : pas de fiche dédiée -> sélection Bons Plans
}

const CF_REDIRECT_RESOLVERS = {
  selle: cfRedirectSelle,
  casque: cfRedirectCasque,
  pantalon: cfRedirectPantalon,
  guetres: cfRedirectGuetres,
  airbag: cfRedirectAirbag,
  'filet-mors': cfRedirectFiletMors,
  masque: cfRedirectMasque,
  complements: cfRedirectComplements,
};

function cfResolveRedirect(categoryId, fields) {
  const resolver = CF_REDIRECT_RESOLVERS[categoryId];
  const productId = resolver ? resolver(fields || {}) : null;
  const product = (productId && productId !== 'BONS_PLANS') ? cfPickProduct(productId) : null;

  if (product && product.equipementUrl) {
    return { found: true, name: product.name, url: product.equipementUrl };
  }

  // Règle absolue : jamais de lien mort. Si aucune fiche produit ne correspond,
  // on redirige toujours vers la page Bons Plans (large variété pour tous budgets).
  return { found: false, url: '/bons-plans.html' };
}
