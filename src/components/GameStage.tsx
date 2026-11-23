import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { CatchGame } from '../games/CatchGame'
import { FlagsGame, QuizGame } from '../games/ChoiceGame'
import { MemoryGame } from '../games/MemoryGame'
import { PenaltyGame } from '../games/PenaltyGame'
import { ScratchGame } from '../games/ScratchGame'
import { StoryGame } from '../games/StoryGame'
import { TreeGame } from '../games/TreeGame'
import type { GameProps } from '../games/types'
import type { GameId, Gift } from '../gifts'
import { formatDay } from '../time'

type GameInfo = {
  title: string
  rule: string
  Component: ComponentType<GameProps>
  /** Texte affiché à la victoire (« Gagné ♥ » par défaut). */
  wonText?: string
  /** Temps laissé pour savourer avant d'afficher le mot, en millisecondes. */
  celebration?: number
  /** Si présent, le mot du cadeau propose de revenir au jeu avec ce libellé. */
  replayLabel?: string
}

const GAMES: Record<GameId, GameInfo> = {
  story: {
    title: 'Notre histoire, en messages',
    rule: 'Touche pour lire la suite.',
    Component: StoryGame,
    wonText: 'C’est parti ♥',
    celebration: 1500,
    replayLabel: 'Revoir la conversation',
  },
  tree: {
    title: 'Le sapin des 24 jours',
    rule: 'Accroche les 24 souvenirs du mois.',
    Component: TreeGame,
    wonText: 'Joyeux Noël ♥',
    celebration: 2600,
  },
  scratch: { title: 'Gratte pour découvrir', rule: 'Frotte la carte avec ton doigt.', Component: ScratchGame },
  memory: { title: 'Les chaussettes dépareillées', rule: 'Retrouve les six paires.', Component: MemoryGame },
  catch: {
    title: 'Attrape dix bo bun',
    rule: 'Touche les bo bun. Les soquettes, c’est red flag.',
    Component: CatchGame,
  },
  penalty: { title: 'Trois buts pour Bauer', rule: 'Vise là où le gardien n’est pas.', Component: PenaltyGame },
  flags: {
    title: 'Red flag ou green flag ?',
    rule: 'Classe chaque carte. Tu connais les réponses.',
    Component: FlagsGame,
  },
  quiz: { title: 'Le quiz du chapitre 1', rule: 'Cinq questions sur nous deux.', Component: QuizGame },
}

/** Délai avant de proposer « Passer le jeu » : personne ne doit rester coincé devant son cadeau. */
const SKIP_DELAY = 10_000
/** Petit temps pour savourer la victoire avant d'afficher le mot. */
const CELEBRATION = 1100

/** Le libellé du bouton « revoir » d'un jeu, s'il en propose un. */
export const replayLabelOf = (game: GameId) => GAMES[game].replayLabel

type Props = {
  gift: Gift
  game: GameId
  opened: ReadonlySet<number>
  /** Vrai quand on revient sur un jeu déjà terminé depuis le mot du cadeau. */
  replay?: boolean
  /** La partie est gagnée (ou passée) : à mémoriser tout de suite. */
  onWon: () => void
  /** Le moment d'afficher le mot du cadeau. */
  onContinue: () => void
}

/** Le mini-jeu à réussir avant de découvrir un cadeau. */
export function GameStage({ gift, game, opened, replay = false, onWon, onContinue }: Props) {
  const { title, rule, Component, wonText = 'Gagné ♥', celebration = CELEBRATION } = GAMES[game]
  const [won, setWon] = useState(false)
  // En relecture, le retour au mot est proposé tout de suite.
  const [canSkip, setCanSkip] = useState(
    () => replay || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const finished = useRef(false)
  const continueTimer = useRef<number | undefined>(undefined)
  const callbacks = useRef({ onWon, onContinue })

  useEffect(() => {
    callbacks.current = { onWon, onContinue }
  })

  useEffect(() => {
    const timer = window.setTimeout(() => setCanSkip(true), SKIP_DELAY)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(continueTimer.current)
    }
  }, [])

  const finish = useCallback((delay: number) => {
    if (finished.current) return
    finished.current = true
    setWon(true)
    callbacks.current.onWon()
    continueTimer.current = window.setTimeout(() => callbacks.current.onContinue(), delay)
  }, [])

  const handleWin = useCallback(() => finish(celebration), [finish, celebration])

  return (
    <div className="game">
      <p className="gift__date">
        {formatDay(gift.day)} · {replay ? 'à revoir' : 'à toi de jouer'}
      </p>
      <h2 id="gift-title" className="gift__title">
        {title}
      </h2>
      {!replay && <p className="game__rule">{rule}</p>}

      <Component gift={gift} opened={opened} replay={replay} onWin={handleWin} />

      <div className="game__footer">
        {replay ? (
          <button type="button" className="button button--outline" data-autofocus onClick={() => finish(0)}>
            Revenir au mot
          </button>
        ) : won ? (
          <p className="game__won">{wonText}</p>
        ) : (
          canSkip && (
            <button type="button" className="game__skip" onClick={() => finish(0)}>
              Passer le jeu
            </button>
          )
        )}
      </div>
    </div>
  )
}
