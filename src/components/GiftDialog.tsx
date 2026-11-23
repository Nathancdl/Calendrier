import { useEffect, useRef, useState } from 'react'
import { SIGNATURE } from '../config'
import type { Gift } from '../gifts'
import { formatDay } from '../time'
import { GameStage, replayLabelOf } from './GameStage'

type Props = {
  gift: Gift | null
  /** Le mini-jeu de ce cadeau a déjà été réussi : on affiche directement le mot. */
  gamePlayed: boolean
  /** Les portes déjà ouvertes, pour les jeux qui reviennent sur le mois écoulé. */
  openedDays: ReadonlySet<number>
  onGameDone: (day: number) => void
  onClose: () => void
}

/** La carte qui s'affiche quand une porte est ouverte : un mini-jeu éventuel, puis le petit mot. */
export function GiftDialog({ gift, gamePlayed, openedDays, onGameDone, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (gift && !dialog.open) {
      dialog.showModal()
      // Un mot long défile dans la carte : on l'ouvre toujours en haut, sur l'emoji et le titre.
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true })
      dialog.querySelector('.gift__card')?.scrollTo(0, 0)
    } else if (!gift && dialog.open) {
      dialog.close()
    }
  }, [gift])

  return (
    <dialog
      ref={dialogRef}
      className="gift"
      aria-labelledby="gift-title"
      onClose={onClose}
      // Un clic sur le fond (en dehors de la carte) referme la carte.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      {gift && (
        <GiftCard
          key={gift.day}
          gift={gift}
          startWithGame={Boolean(gift.game) && !gamePlayed}
          openedDays={openedDays}
          onGameDone={onGameDone}
          onDismiss={() => dialogRef.current?.close()}
        />
      )}
    </dialog>
  )
}

type CardProps = {
  gift: Gift
  startWithGame: boolean
  openedDays: ReadonlySet<number>
  onGameDone: (day: number) => void
  onDismiss: () => void
}

function GiftCard({ gift, startWithGame, openedDays, onGameDone, onDismiss }: CardProps) {
  // Décidé une fois à l'ouverture : gagner le jeu ne doit pas faire disparaître l'écran de victoire.
  const [phase, setPhase] = useState<'game' | 'note'>(startWithGame ? 'game' : 'note')
  /** Vrai quand elle est revenue au jeu depuis le mot, pour le revoir. */
  const [replaying, setReplaying] = useState(false)
  const replayLabel = gift.game ? replayLabelOf(gift.game) : undefined
  const cardRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (phase !== 'note') return
    closeRef.current?.focus({ preventScroll: true })
    cardRef.current?.scrollTo(0, 0)
  }, [phase])

  if (phase === 'game' && gift.game) {
    return (
      <article ref={cardRef} className="gift__card">
        <GameStage
          gift={gift}
          game={gift.game}
          opened={openedDays}
          replay={replaying}
          onWon={() => onGameDone(gift.day)}
          onContinue={() => setPhase('note')}
        />
      </article>
    )
  }

  return (
    <article ref={cardRef} className="gift__card" data-revealed={startWithGame}>
      <div className="gift__seal" aria-hidden="true">
        {gift.emoji}
      </div>
      <p className="gift__date">{formatDay(gift.day)}</p>
      <h2 id="gift-title" className="gift__title">
        {gift.title}
      </h2>
      {gift.mims && <p className="gift__warning">⚠️ attention je vais être mims ⚠️</p>}
      {gift.message && <p className="gift__message">{gift.message}</p>}
      {gift.image && <img className="gift__image" src={gift.image} alt="" />}
      {SIGNATURE && <p className="gift__signature">— {SIGNATURE}</p>}
      <div className="gift__actions">
        {gift.link && (
          <a className="button button--outline" href={gift.link.url} target="_blank" rel="noreferrer">
            {gift.link.label}
          </a>
        )}
        <button ref={closeRef} type="button" className="button" data-autofocus onClick={onDismiss}>
          Baccord ♥
        </button>
        {replayLabel && (
          <button
            type="button"
            className="gift__replay"
            onClick={() => {
              setReplaying(true)
              setPhase('game')
            }}
          >
            {replayLabel}
          </button>
        )}
      </div>
    </article>
  )
}
