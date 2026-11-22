export type Tone = 'cream' | 'brick' | 'pine' | 'rose' | 'mustard'
export type Pattern = 'plain' | 'dots' | 'stripes' | 'diagonal'

export type DoorLook = {
  /** Emplacement dans la grille à 4 colonnes (mobile), au format CSS grid-area. */
  narrow: string
  /** Emplacement dans la grille à 6 colonnes (écrans larges). */
  wide: string
  tone: Tone
}

const at = (row: number, col: number, rowSpan = 1, colSpan = 1) =>
  `${row} / ${col} / span ${rowSpan} / span ${colSpan}`

/*
 * Les portes sont volontairement dans le désordre, comme sur un vrai calendrier.
 * Chaque grille est entièrement remplie (4 × 8 et 6 × 5) et deux portes voisines
 * n'ont jamais la même couleur, dans aucune des deux dispositions.
 */
export const DOORS: Record<number, DoorLook> = {
  1: { narrow: at(3, 4), wide: at(2, 5), tone: 'rose' },
  2: { narrow: at(5, 3, 1, 2), wide: at(3, 6), tone: 'rose' },
  3: { narrow: at(1, 4, 2, 1), wide: at(1, 6, 2, 1), tone: 'cream' },
  4: { narrow: at(7, 4), wide: at(5, 2), tone: 'rose' },
  5: { narrow: at(4, 1), wide: at(3, 1), tone: 'pine' },
  6: { narrow: at(6, 3), wide: at(4, 3), tone: 'cream' },
  7: { narrow: at(1, 1, 1, 2), wide: at(1, 2, 1, 2), tone: 'brick' },
  8: { narrow: at(8, 1), wide: at(5, 3), tone: 'mustard' },
  9: { narrow: at(2, 3), wide: at(2, 2), tone: 'rose' },
  10: { narrow: at(5, 1, 2, 1), wide: at(4, 1, 2, 1), tone: 'brick' },
  11: { narrow: at(7, 2, 1, 2), wide: at(4, 6), tone: 'brick' },
  12: { narrow: at(2, 1), wide: at(1, 4), tone: 'cream' },
  13: { narrow: at(8, 3), wide: at(5, 5), tone: 'pine' },
  14: { narrow: at(5, 2), wide: at(3, 5), tone: 'pine' },
  15: { narrow: at(3, 1), wide: at(2, 1), tone: 'brick' },
  16: { narrow: at(8, 4), wide: at(5, 6), tone: 'mustard' },
  17: { narrow: at(6, 4), wide: at(4, 4), tone: 'pine' },
  18: { narrow: at(1, 3), wide: at(1, 1), tone: 'pine' },
  19: { narrow: at(7, 1), wide: at(4, 5), tone: 'cream' },
  20: { narrow: at(4, 4), wide: at(3, 2), tone: 'cream' },
  21: { narrow: at(2, 2), wide: at(1, 5), tone: 'pine' },
  22: { narrow: at(8, 2), wide: at(5, 4), tone: 'cream' },
  23: { narrow: at(6, 2), wide: at(4, 2), tone: 'mustard' },
  24: { narrow: at(3, 2, 2, 2), wide: at(2, 3, 2, 2), tone: 'mustard' },
}

const PATTERNS: Pattern[] = ['plain', 'dots', 'stripes', 'plain', 'diagonal']

/** Motif imprimé sur la porte — réparti de façon fixe pour que rien ne bouge d'un rendu à l'autre. */
export const patternOf = (day: number): Pattern => PATTERNS[(day * 7) % PATTERNS.length]

/** Légère inclinaison du numéro, entre −3° et +3°. */
export const tiltOf = (day: number): number => ((day * 37) % 7) - 3
