/**
 * Mini-jeux disponibles :
 * 'scratch' carte à gratter · 'memory' paires de chaussettes · 'catch' attrape les bo bun · 'penalty' tirs au but ·
 * 'tree' le sapin des 24 jours (le final : on y accroche les souvenirs de tout le mois) ·
 * 'flags' red flag ou green flag · 'quiz' le quiz sur vous deux ·
 * 'story' votre histoire rejouée en messages (l'ouverture du calendrier).
 * Les cartes et les questions se modifient dans src/games/ChoiceGame.tsx, les messages dans src/games/StoryGame.tsx.
 */
export type GameId = 'scratch' | 'memory' | 'catch' | 'penalty' | 'tree' | 'flags' | 'quiz' | 'story'

export type Gift = {
  /** Jour de décembre (1 à 24). */
  day: number
  /** Emoji visible derrière la porte une fois ouverte. */
  emoji: string
  /** Le cadeau, en quelques mots. */
  title: string
  /** Ton petit mot. Les retours à la ligne (\n) sont conservés. */
  message: string
  /** Photo facultative : dépose le fichier dans public/photos/ puis écris 'photos/mon-image.jpg'. */
  image?: string
  /** Lien facultatif (playlist, réservation, vidéo…). */
  link?: { label: string; url: string }
  /** Mini-jeu facultatif à réussir avant de voir le cadeau. Retire la ligne pour ouvrir la porte directement. */
  game?: GameId
  /** Pour les mots doux : affiche « ⚠️ attention je vais être mims ⚠️ » juste avant le message. */
  mims?: boolean
}

/*
 * Les 24 cadeaux. Les messages sont un premier jet : réécris-les avec tes mots.
 * Les lignes marquées ✏️ attendent quelque chose de ta part (un lien, une photo).
 */
export const GIFTS: Gift[] = [
  {
    day: 1,
    emoji: '🧸',
    title: 'Bienvenue, bibs',
    game: 'story',
    mims: true,
    // Le cadeau du jour 1 : une peluche Winnie, à poser sur son lit avant son retour du vendredi 4.
    message:
      'Tu as envoyé ta teuteute au Père Noël et tu m’as eu.\nMoi, je t’ai préparé vingt-quatre jours de rab : une petite attention chaque matin jusqu’à Noël.\nLa première t’attend déjà : un petit Winnie garde le panier jusqu’à ton retour vendredi.',
  },
  {
    day: 2,
    emoji: '🍫',
    title: 'Ton chocolat préféré',
    game: 'scratch',
    message: 'Parce qu’un mois de décembre sans chocolat, ça n’existe pas.\nIl t’attend sagement au panier pour ton retour.',
  },
  {
    day: 3,
    emoji: '🎶',
    title: 'Une playlist rien que pour toi',
    message: 'Des chansons qui me font penser à toi.\nÀ écouter fort ou tout bas, comme tu veux.',
    // ✏️ Colle le lien de ta playlist puis retire les deux barres :
    // link: { label: 'Écouter', url: 'https://…' },
  },
  {
    day: 4,
    emoji: '🍜',
    title: 'Bon pour un bo bun de retour',
    game: 'catch',
    message:
      'Tu m’as manqué plus que les bo bun, et c’est dire.\nBon pour un bo bun de retour, ce soir ou quand tu auras récupéré.',
  },
  {
    day: 5,
    emoji: '🎄',
    title: 'Une déco pour le sapin',
    message:
      'Un petit Winnie à accrocher dans ton sapin.\nOn le pose ensemble, tu me diras où : je ne suis pas un génie de la déco.',
  },
  {
    day: 6,
    emoji: '🥐',
    title: 'Bon pour un petit-déjeuner au lit',
    message: 'Ne bouge pas, je m’occupe de tout.\nValable ce week-end, ou quand tu voudras.',
  },
  {
    day: 7,
    emoji: '🧦',
    title: 'Des chaussettes bien hautes',
    game: 'memory',
    message:
      'Pour avoir chaud jusqu’au bout des orteils tout l’hiver.\nBien hautes : zéro soquette, promis.\nViens les chercher.',
  },
  {
    day: 8,
    emoji: '💆',
    title: 'Bon pour un massage',
    message: 'Trente minutes, rien que pour toi.\nTu choisis le moment, je m’occupe du reste.',
  },
  {
    day: 9,
    emoji: '📸',
    title: 'Bon pour un photomaton à deux',
    message:
      'Tu avais raison : on n’a aucune photo correcte de nous deux.\nBon pour une séance photomaton, grimaces autorisées.',
  },
  {
    day: 10,
    emoji: '💚',
    title: 'Tes dix green flags',
    game: 'flags',
    mims: true,
    // Tirés de ce que vous vous êtes écrit : ajuste la liste à ton goût.
    message:
      'T’es pleine de vie.\nTes bouclettes.\nTa p’tite tête.\nTon planning de tasses.\nTa mémoire, qui me redébloque des souvenirs.\nTa passion pour le bo bun.\nTes petits plats d’automne.\nTon fou rire quand j’imite Mickey.\nPersonne ne touche à doudou.\nEt le plus beau : ton green flag, c’est d’être un peu red flag.',
  },
  {
    day: 11,
    emoji: '🍝',
    title: 'Bon pour un dîner maison',
    message: 'Tu choisis le menu, je cuisine.\nEt je fais même la vaisselle.',
  },
  {
    day: 12,
    emoji: '🌊',
    title: 'L’océan, puis le marché de Noël',
    game: 'scratch',
    message:
      'Aujourd’hui, je t’emmène voir l’océan sans quitter Paris, à l’Atelier des Lumières.\nEt après, marché de Noël : vin chaud obligatoire.',
  },
  {
    day: 13,
    emoji: '🎂',
    title: 'Le gâteau au chocolat d’Adibou',
    message:
      'Cet après-midi, on ressort ta recette imprimée de la cuisine d’Adibou.\nTu diriges, je touille, et on se partage le fond du plat.',
  },
  {
    day: 14,
    emoji: '📖',
    title: 'Un roman noir choisi pour toi',
    message: 'Pour tes soirées thé et pilou pilou.\nJe l’ai choisi en pensant à toi : regarde bien la première page.',
  },
  {
    day: 15,
    emoji: '🌙',
    title: 'Une histoire du soir',
    message: 'Tu m’avais écrit « Tu m’as pas lu d’histoire ».\nCe soir, c’est réparé : je te la lis.',
    // ✏️ Facultatif : si tu enregistres l'histoire, colle le lien de l'audio puis retire les deux barres.
    // Sans lien, le mot fonctionne quand même : tu la lis en vrai ou au téléphone.
    // link: { label: 'Écouter', url: 'https://…' },
  },
  {
    day: 16,
    emoji: '🛁',
    title: 'Soirée cocooning',
    game: 'scratch',
    message: 'Un bain, un masque, un thé.\nCe soir, tu ne t’occupes que de toi.',
  },
  {
    day: 17,
    emoji: '🃏',
    title: 'Bon joker',
    message: 'Une corvée de ton choix, faite à ta place.\nSans discuter, et avec le sourire.',
  },
  {
    day: 18,
    emoji: '🍷',
    title: 'Apéro et jeu de société',
    message: 'Ce soir, c’est apéro et jeu de société à deux.\nJe te préviens, je ne te laisserai pas gagner.',
  },
  {
    day: 19,
    emoji: '⚽',
    title: 'Bon pour un match du Red Star',
    game: 'penalty',
    message:
      'Toi, moi, les tribunes de Bauer et une barquette de frites.\nÇa fait trop longtemps que ça me chauffe d’y aller, et c’est avec toi que je veux le faire.',
  },
  {
    day: 20,
    emoji: '🖼️',
    title: 'Nous deux, avant et maintenant',
    message:
      'Nous à 17 ans et nous aujourd’hui, dans le même cadre.\nQuatorze ans n’ont pas suffi.\nViens le chercher.',
  },
  {
    day: 21,
    emoji: '🧣',
    title: 'De quoi avoir chaud',
    message: 'Pour les matins d’hiver où je ne suis pas là pour te réchauffer.\nViens voir ce que c’est.',
  },
  {
    day: 22,
    emoji: '🍾',
    title: 'Champomy et jacuzzi',
    message:
      'Tu avais réclamé la suite jacuzzi en Normandie.\nJ’ai fait mieux : j’ai apporté le Champomy.\nUn petit Champomy et au dodo.',
  },
  {
    day: 23,
    emoji: '✉️',
    title: 'Le chapitre 2',
    game: 'quiz',
    mims: true,
    message:
      'Tu m’as demandé où on sera dans douze ans.\nJe ne sais pas où, mais je sais avec qui.\nLe chapitre 1 a mis quatorze ans à s’écrire. Le chapitre 2, je ne le lâche plus.',
  },
  {
    day: 24,
    emoji: '🎁',
    title: 'Ton vrai cadeau',
    game: 'tree',
    message:
      'Tu as été patiente pendant vingt-quatre jours.\nTon cadeau t’attend : appelle-moi, je te dis où il est.\nJoyeux Noël, mon amour.',
  },
]
