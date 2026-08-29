/* Configuration du comparateur : catégories d'équipement et questions contextuelles associées */

const CF_COMPARE_CATEGORIES = [
  {
    id: 'selle',
    label: 'Selle',
    desc: 'Confort du cheval et du dos',
    recoSlug: 'selles',
    resultCta: 'Voir ma selle →',
    filter: (p) => p.category === 'selles',
    questions: [
      {
        field: 'morphologie',
        question: 'Comment est le dos de ton cheval ?',
        options: [
          { value: 'dos-creux', label: 'Dos creux', desc: 'Ligne du dessus affaissée, souvent chez les chevaux âgés' },
          { value: 'dos-large', label: 'Dos large / rond', desc: 'Chevaux typés, cobs, dos généreux' },
          { value: 'garrot-saillant', label: 'Garrot saillant', desc: 'Garrot marqué, pincement fréquent' },
          { value: 'dos-droit', label: 'Dos droit / standard', desc: 'Morphologie sans particularité notable' },
          { value: 'je-ne-sais-pas', label: 'Je ne sais pas', desc: 'On reste prudents dans la recommandation' },
        ],
      },
      {
        field: 'discipline',
        question: 'Quelle est ta discipline principale ?',
        options: [
          { value: 'cso', label: 'CSO' },
          { value: 'dressage', label: 'Dressage' },
          { value: 'endurance', label: 'Endurance' },
          { value: 'loisir', label: 'Loisir / balade' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget veux-tu y consacrer ?',
        options: [
          { value: '<500', label: 'Moins de 500€' },
          { value: '500-1500', label: '500 à 1500€' },
          { value: '1500-3000', label: '1500 à 3000€' },
          { value: '3000+', label: 'Plus de 3000€' },
        ],
      },
    ],
  },
  {
    id: 'filet-mors',
    label: 'Filet & Mors',
    desc: 'La bonne communication',
    recoSlug: 'filets-embouchures',
    resultCta: 'Voir mon filet →',
    filter: (p) => p.category === 'filets',
    questions: [
      {
        field: 'discipline',
        question: 'Quelle est ta discipline principale ?',
        options: [
          { value: 'cso', label: 'CSO' },
          { value: 'dressage', label: 'Dressage' },
          { value: 'loisir', label: 'Loisir / balade' },
        ],
      },
      {
        field: 'sensibilite',
        question: 'Quel est le niveau de sensibilité de ton cheval ?',
        options: [
          { value: 'tres-sensible', label: 'Bouche très sensible', desc: 'Réactif au moindre contact' },
          { value: 'moderee', label: 'Sensibilité moyenne', desc: 'Ni trop dur ni trop mou' },
          { value: 'peu-sensible', label: 'Peu sensible', desc: 'Bouche robuste, appui plus franc' },
        ],
      },
      {
        field: 'contact',
        question: 'Quel type de contact recherches-tu ?',
        options: [
          { value: 'franc', label: 'Contact franc et direct', desc: 'Précision et réactivité immédiate' },
          { value: 'doux', label: 'Contact doux et progressif', desc: 'En douceur, sans brusquerie' },
          { value: 'apprentissage', label: 'En apprentissage / transition', desc: 'Jeune cheval ou rééducation' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget veux-tu y consacrer ?',
        options: [
          { value: '<100', label: 'Moins de 100€' },
          { value: '100-200', label: '100 à 200€' },
          { value: '200+', label: 'Plus de 200€' },
        ],
      },
    ],
  },
  {
    id: 'casque',
    label: 'Casque',
    desc: 'Sécurité et style',
    recoSlug: 'equipement-cavalier',
    resultCta: 'Voir mon casque →',
    filter: (p) => p.subcategory === 'casques',
    questions: [
      {
        field: 'pratique',
        question: 'Pour quelle pratique ?',
        options: [
          { value: 'loisir', label: 'Loisir', desc: 'Usage courant, confort avant tout' },
          { value: 'competition', label: 'Compétition', desc: 'Épreuves officielles, exigences FFE' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget veux-tu y consacrer ?',
        options: [
          { value: '<150', label: 'Moins de 150€' },
          { value: '150-300', label: '150 à 300€' },
          { value: '300+', label: 'Plus de 300€' },
        ],
      },
      {
        field: 'style',
        question: 'Quel style recherches-tu ?',
        options: [
          { value: 'sobre', label: 'Sobre et discret', desc: 'Un classique qui passe partout' },
          { value: 'personnalise', label: 'Personnalisable', desc: 'Couleurs, strass, options déco' },
        ],
      },
    ],
  },
  {
    id: 'pantalon',
    label: 'Pantalon',
    desc: 'Confort et technicité',
    recoSlug: 'equipement-cavalier',
    resultCta: 'Voir mon pantalon →',
    filter: (p) => p.subcategory === 'pantalon',
    questions: [
      {
        field: 'discipline',
        question: 'Quelle est ta discipline principale ?',
        options: [
          { value: 'cso', label: 'CSO' },
          { value: 'dressage', label: 'Dressage' },
          { value: 'endurance', label: 'Endurance' },
          { value: 'loisir', label: 'Loisir / balade' },
        ],
      },
      {
        field: 'saison',
        question: 'Pour quelle saison ?',
        options: [
          { value: 'ete', label: 'Été', desc: 'Matière légère et respirante' },
          { value: 'hiver', label: 'Hiver', desc: 'Chaud et coupe-vent' },
          { value: 'toutes-saisons', label: 'Toutes saisons', desc: 'Un modèle polyvalent' },
        ],
      },
      {
        field: 'besoin',
        question: 'Un besoin particulier ?',
        options: [
          { value: 'grip-genoux', label: 'Grip renforcé genoux', desc: "Tenue en selle à l'obstacle" },
          { value: 'taille-haute', label: 'Confort taille haute', desc: 'Maintien optimal du dos' },
          { value: 'standard', label: 'Pas de besoin particulier', desc: 'Une coupe classique suffit' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget veux-tu y consacrer ?',
        options: [
          { value: '<100', label: 'Moins de 100€' },
          { value: '100-200', label: '100 à 200€' },
          { value: '200+', label: 'Plus de 200€' },
        ],
      },
    ],
  },
  {
    id: 'guetres',
    label: 'Guêtres',
    desc: 'Protection des membres',
    recoSlug: 'protections',
    resultCta: 'Voir mes guêtres →',
    filter: (p) => p.category === 'protections' && p.id !== 'masque-mouches-fouganza' && p.id !== 'anti-mouches-duo',
    questions: [
      {
        field: 'discipline',
        question: 'Quelle est ta discipline principale ?',
        options: [
          { value: 'cso', label: 'CSO' },
          { value: 'dressage', label: 'Dressage' },
          { value: 'endurance', label: 'Endurance' },
          { value: 'loisir', label: 'Loisir / balade' },
        ],
      },
      {
        field: 'terrain',
        question: 'Sur quel type de terrain principalement ?',
        options: [
          { value: 'sable', label: 'Carrière / sable', desc: 'Terrain travaillé et régulier' },
          { value: 'herbe', label: 'Extérieur / herbe', desc: 'Terrain naturel, plus irrégulier' },
          { value: 'mixte', label: 'Mixte', desc: 'Un peu des deux' },
        ],
      },
      {
        field: 'niveau_protection',
        question: 'Quel niveau de protection recherches-tu ?',
        options: [
          { value: 'legere', label: 'Légère', desc: "Usage quotidien à l'entraînement" },
          { value: 'renforcee', label: 'Renforcée', desc: 'Terrain difficile ou cheval imprudent' },
          { value: 'maximale', label: 'Maximale', desc: 'Compétition et niveaux exigeants' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget veux-tu y consacrer ?',
        options: [
          { value: '<50', label: 'Moins de 50€' },
          { value: '50-100', label: '50 à 100€' },
          { value: '100+', label: 'Plus de 100€' },
        ],
      },
    ],
  },
  {
    id: 'airbag',
    label: 'Airbag',
    desc: 'La sécurité en plus',
    recoSlug: 'equipement-cavalier',
    resultCta: 'Voir mon airbag →',
    filter: (p) => p.subcategory === 'airbag',
    questions: [
      {
        field: 'pratique',
        question: 'Pour quelle pratique ?',
        options: [
          { value: 'loisir', label: 'Loisir', desc: 'Usage courant, confort avant tout' },
          { value: 'competition', label: 'Compétition', desc: 'Épreuves officielles, exigences FFE' },
        ],
      },
      {
        field: 'niveau',
        question: 'Quel est ton niveau ?',
        options: [
          { value: 'debutante', label: 'Débutante', desc: 'Encore en apprentissage' },
          { value: 'intermediaire', label: 'Intermédiaire', desc: 'À l\'aise dans la plupart des situations' },
          { value: 'confirmee', label: 'Confirmée / compétition', desc: 'Niveau avancé, épreuves régulières' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget veux-tu y consacrer ?',
        options: [
          { value: '<150', label: 'Moins de 150€' },
          { value: '150-300', label: '150 à 300€' },
          { value: '300+', label: 'Plus de 300€' },
        ],
      },
    ],
  },
  {
    id: 'masque',
    label: 'Masque anti-mouches',
    desc: 'Confort en été',
    recoSlug: 'protections',
    resultCta: 'Voir mon masque →',
    filter: (p) => p.id === 'masque-mouches-fouganza' || p.id === 'anti-mouches-duo',
    questions: [
      {
        field: 'usage',
        question: 'Pour quel usage ?',
        options: [
          { value: 'quotidien', label: 'Usage quotidien', desc: 'Porté toute la belle saison' },
          { value: 'competition', label: 'Compétition ponctuelle', desc: "Le temps d'une épreuve" },
        ],
      },
      {
        field: 'sensibilite',
        question: 'Ton cheval a-t-il la peau sensible ?',
        options: [
          { value: 'peau-sensible', label: 'Peau sensible', desc: 'Besoin de matières douces' },
          { value: 'standard', label: 'Peau standard', desc: 'Pas de contrainte particulière' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget veux-tu y consacrer ?',
        options: [
          { value: '<20', label: 'Moins de 20€' },
          { value: '20-40', label: '20 à 40€' },
          { value: '40+', label: 'Plus de 40€' },
        ],
      },
    ],
  },
  {
    id: 'complements',
    label: 'Compléments alimentaires',
    desc: 'Nutrition et récupération',
    recoSlug: 'complements',
    resultCta: 'Voir mes compléments →',
    filter: (p) => p.category === 'complements',
    questions: [
      {
        field: 'objectif',
        question: "Quel est l'objectif recherché ?",
        options: [
          { value: 'recuperation', label: 'Récupération / hydratation', desc: 'Après effort ou compétition' },
          { value: 'articulations', label: 'Articulations & tendons', desc: 'Confort locomoteur' },
          { value: 'digestion', label: 'Digestion', desc: 'Confort digestif au quotidien' },
        ],
      },
      {
        field: 'budget',
        question: 'Quel budget mensuel veux-tu y consacrer ?',
        options: [
          { value: '<30', label: 'Moins de 30€' },
          { value: '30-60', label: '30 à 60€' },
          { value: '60+', label: 'Plus de 60€' },
        ],
      },
    ],
  },
];

function cfGetCategory(id) {
  return CF_COMPARE_CATEGORIES.find((c) => c.id === id);
}
