import type { Gift } from '../gifts'

export type GameProps = {
  /** Le cadeau caché derrière le jeu (la carte à gratter s'en sert pour ce qu'elle dévoile). */
  gift: Gift
  /** Les portes déjà ouvertes (le sapin s'en sert pour ne pas dévoiler un cadeau pas encore vu). */
  opened: ReadonlySet<number>
  /** Vrai quand on revient sur un jeu déjà terminé, pour le revoir (seule l'histoire en messages s'en sert). */
  replay?: boolean
  /** À appeler une seule fois, quand la partie est gagnée. */
  onWin: () => void
}
