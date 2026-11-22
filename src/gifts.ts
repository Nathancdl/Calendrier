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
}

/*
 * Les 24 cadeaux. Les messages sont un premier jet : réécris-les avec tes mots.
 * Les lignes marquées ✏️ attendent quelque chose de ta part (un lien, une photo).
 */
export const GIFTS: Gift[] = [
  {
    day: 1,
    emoji: '💌',
    title: 'Une lettre pour commencer',
    message:
      'Vingt-quatre jours, vingt-quatre petites attentions.\nJ’avais envie que tu te sentes aimée chaque matin de décembre, pas seulement le 25.\nReviens demain, et tous les jours d’après.',
  },
  {
    day: 2,
    emoji: '🍫',
    title: 'Ton chocolat préféré',
    message: 'Parce qu’un mois de décembre sans chocolat, ça n’existe pas.\nViens me le réclamer.',
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
    emoji: '🎬',
    title: 'Bon pour une soirée film',
    message: 'Tu choisis le film. Je ne râle pas, promis.\nJe m’occupe du plaid et du pop-corn.',
  },
  {
    day: 5,
    emoji: '🥐',
    title: 'Bon pour un petit-déjeuner au lit',
    message: 'Ne bouge pas, je m’occupe de tout.\nValable ce week-end, ou quand tu voudras.',
  },
  {
    day: 6,
    emoji: '📸',
    title: 'Un souvenir de nous',
    message: 'Une de mes photos préférées de nous deux.\nJ’aimerais en avoir encore mille comme celle-là.',
    // ✏️ Dépose la photo dans public/photos/ puis retire les deux barres :
    // image: 'photos/nous-deux.jpg',
  },
  {
    day: 7,
    emoji: '🧦',
    title: 'Des chaussettes de Noël',
    message: 'Pour avoir chaud jusqu’au bout des orteils tout l’hiver.\nViens les chercher.',
  },
  {
    day: 8,
    emoji: '💆',
    title: 'Bon pour un massage',
    message: 'Trente minutes, rien que pour toi.\nTu choisis le moment, je m’occupe du reste.',
  },
  {
    day: 9,
    emoji: '🕯️',
    title: 'Une bougie parfumée',
    message: 'Pour tes soirées d’hiver.\nAllume-la et pense à moi.',
  },
  {
    day: 10,
    emoji: '📝',
    title: 'Dix choses que j’aime chez toi',
    // ✏️ À remplacer par tes dix vraies raisons.
    message:
      'Ton rire.\nTon regard quand tu es heureuse.\nTa façon de prendre soin des autres.\nTa force, même quand tu doutes.\nTes câlins.\nTa voix au réveil.\nTon humour.\nTa curiosité.\nTa tendresse.\nEt tout ce que je n’arrive pas à écrire.',
  },
  {
    day: 11,
    emoji: '🍝',
    title: 'Bon pour un dîner maison',
    message: 'Tu choisis le menu, je cuisine.\nEt je fais même la vaisselle.',
  },
  {
    day: 12,
    emoji: '🎄',
    title: 'Marché de Noël',
    message: 'Aujourd’hui, je t’emmène au marché de Noël.\nVin chaud obligatoire.',
  },
  {
    day: 13,
    emoji: '🍪',
    title: 'Atelier biscuits de Noël',
    message: 'Cet après-midi, on fait des biscuits de Noël.\nTu décores, je goûte.',
  },
  {
    day: 14,
    emoji: '📖',
    title: 'Un livre choisi pour toi',
    message: 'Je l’ai choisi en pensant à toi.\nRegarde bien la première page.',
  },
  {
    day: 15,
    emoji: '🎥',
    title: 'Un message vidéo',
    message: 'J’avais quelque chose à te dire, et c’était mieux de vive voix.',
    // ✏️ Colle le lien de ta vidéo puis retire les deux barres :
    // link: { label: 'Regarder', url: 'https://…' },
  },
  {
    day: 16,
    emoji: '🛁',
    title: 'Soirée cocooning',
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
    emoji: '🎟️',
    title: 'Une sortie surprise',
    message: 'Garde ta journée, je t’emmène quelque part.\nTout est déjà réservé, et non, je ne dirai rien.',
  },
  {
    day: 20,
    emoji: '🖼️',
    title: 'Notre photo, encadrée',
    message: 'Notre photo préférée, en vrai, à accrocher où tu veux.\nViens la chercher.',
  },
  {
    day: 21,
    emoji: '🧣',
    title: 'De quoi avoir chaud',
    message: 'Pour les matins d’hiver où je ne suis pas là pour te réchauffer.\nViens voir ce que c’est.',
  },
  {
    day: 22,
    emoji: '🗺️',
    title: 'Chasse au trésor',
    message: 'Un petit cadeau est caché quelque part.\nViens me réclamer le premier indice.',
  },
  {
    day: 23,
    emoji: '✉️',
    title: 'Pour l’année qui vient',
    message:
      'Encore des fous rires, des voyages et des dimanches à ne rien faire.\nEt toi, surtout. Toi, encore.\nC’est tout ce que je nous souhaite.',
  },
  {
    day: 24,
    emoji: '🎁',
    title: 'Ton vrai cadeau',
    message:
      'Tu as été patiente pendant vingt-quatre jours.\nTon cadeau t’attend, viens le chercher.\nJoyeux Noël, mon amour.',
  },
]
