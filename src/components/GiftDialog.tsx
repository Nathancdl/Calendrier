import { useEffect, useRef } from 'react'
import { SIGNATURE } from '../config'
import type { Gift } from '../gifts'
import { formatDay } from '../time'

type Props = { gift: Gift | null; onClose: () => void }

/** Le petit mot qui s'affiche quand une porte est ouverte. */
export function GiftDialog({ gift, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (gift && !dialog.open) {
      dialog.showModal()
      // Un mot long défile dans la carte : on l'ouvre toujours en haut, sur l'emoji et le titre.
      closeRef.current?.focus({ preventScroll: true })
      cardRef.current?.scrollTo(0, 0)
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
      // Un clic sur le fond (en dehors de la carte) referme le mot.
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      {gift && (
        <article ref={cardRef} className="gift__card">
          <div className="gift__seal" aria-hidden="true">
            {gift.emoji}
          </div>
          <p className="gift__date">{formatDay(gift.day)}</p>
          <h2 id="gift-title" className="gift__title">
            {gift.title}
          </h2>
          {gift.message && <p className="gift__message">{gift.message}</p>}
          {gift.image && <img className="gift__image" src={gift.image} alt="" />}
          {SIGNATURE && <p className="gift__signature">— {SIGNATURE}</p>}
          <div className="gift__actions">
            {gift.link && (
              <a className="button button--outline" href={gift.link.url} target="_blank" rel="noreferrer">
                {gift.link.label}
              </a>
            )}
            <button ref={closeRef} type="button" className="button" onClick={() => dialogRef.current?.close()}>
              Merci ♥
            </button>
          </div>
        </article>
      )}
    </dialog>
  )
}
