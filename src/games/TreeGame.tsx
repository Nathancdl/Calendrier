import { useEffect, useMemo, useState } from 'react'
import { GIFTS } from '../gifts'
import { formatDay } from '../time'
import type { GameProps } from './types'

const TOTAL = 24

/* Les 24 crochets, rangée par rangée, en pourcentage du cadre (x = gauche, y = haut). */
const ROWS: Array<{ y: number; xs: number[] }> = [
  { y: 22, xs: [50] },
  { y: 33, xs: [43.5, 56.5] },
  { y: 44, xs: [37.5, 50, 62.5] },
  { y: 54.5, xs: [33, 50, 67] },
  { y: 65, xs: [24.5, 41.5, 58.5, 75.5] },
  { y: 76, xs: [20, 35, 50, 65, 80] },
  { y: 87, xs: [12.5, 27.5, 42.5, 57.5, 72.5, 87.5] },
]
const HOOKS = ROWS.flatMap((row) => row.xs.map((x) => ({ x, y: row.y })))

/**
 * Le final : un sapin vide et les 24 souvenirs du mois à accrocher un par un.
 * Quand le dernier est posé, l'étoile s'allume.
 */
export function TreeGame({ gift, opened, onWin }: GameProps) {
  // Pour chaque jour, la boule à accrocher. Une porte pas encore ouverte reste une surprise.
  const ornaments = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, index) => {
        const day = index + 1
        const source = GIFTS.find((candidate) => candidate.day === day)
        return source && (day === gift.day || opened.has(day))
          ? { day, emoji: source.emoji, title: source.title }
          : { day, emoji: '🎀', title: 'Une porte encore fermée' }
      }),
    [gift.day, opened],
  )

  /** Pour chaque crochet : le jour qui y est accroché, ou 0 s'il est libre. */
  const [placed, setPlaced] = useState<number[]>(() => HOOKS.map(() => 0))
  const count = placed.filter(Boolean).length
  const complete = count >= TOTAL
  const current = ornaments[count]

  useEffect(() => {
    if (!complete) return
    // On laisse l'étoile s'allumer avant d'annoncer la victoire.
    const celebration = window.setTimeout(onWin, 900)
    return () => window.clearTimeout(celebration)
  }, [complete, onWin])

  const hang = (hook: number) =>
    setPlaced((hooks) => {
      const hung = hooks.filter(Boolean).length
      if (hooks[hook] || hung >= TOTAL) return hooks
      const next = [...hooks]
      next[hook] = hung + 1
      return next
    })

  const hangAnywhere = () => {
    const free = placed.flatMap((day, hook) => (day ? [] : [hook]))
    if (free.length) hang(free[Math.floor(Math.random() * free.length)])
  }

  return (
    <>
      <div className="tree" data-lit={complete}>
        <svg className="tree__fir" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect x="45" y="91" width="10" height="7" fill="#6b4226" />
          <polygon points="50,34 97,92 3,92" fill="#1b4a3d" />
          <polygon points="50,22 86,69 14,69" fill="#215a49" />
          <polygon points="50,9 73,45 27,45" fill="#286a55" />
        </svg>
        <span className="tree__star" aria-hidden="true">
          ★
        </span>
        {HOOKS.map((hook, index) => {
          const ornament = placed[index] ? ornaments[placed[index] - 1] : null
          return (
            <button
              key={index}
              type="button"
              className="tree__hook"
              style={{ left: `${hook.x}%`, top: `${hook.y}%` }}
              data-filled={Boolean(ornament)}
              aria-disabled={Boolean(ornament)}
              aria-label={ornament ? `${formatDay(ornament.day)} : ${ornament.title}` : 'Crochet libre'}
              onClick={() => hang(index)}
            >
              {ornament?.emoji}
            </button>
          )
        })}
      </div>

      <div className="tree-tray">
        {current ? (
          <>
            <button
              key={current.day}
              type="button"
              className="tree-tray__bauble"
              aria-label="Accrocher cette boule"
              onClick={hangAnywhere}
            >
              {current.emoji}
            </button>
            <p className="tree-tray__text">
              <span className="tree-tray__day">{formatDay(current.day)}</span>
              <span className="tree-tray__title">{current.title}</span>
            </p>
          </>
        ) : (
          <p className="tree-tray__text tree-tray__text--done">
            <span className="tree-tray__title">Tout y est. Regarde l’étoile.</span>
          </p>
        )}
        <p className="tree-tray__count" aria-live="polite">
          {count} / {TOTAL}
        </p>
      </div>
    </>
  )
}
