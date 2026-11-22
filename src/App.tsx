import { useCallback, useEffect, useRef, useState } from 'react'
import { Countdown, NextDoorTimer } from './components/Countdown'
import { Door, type DoorState } from './components/Door'
import { GiftDialog } from './components/GiftDialog'
import { Snow } from './components/Snow'
import { FOOTER, RECIPIENT, YEAR } from './config'
import { GIFTS, type Gift } from './gifts'
import { DAYS, formatDay, unlockTime, unlockedCount, useNow } from './time'
import { useOpenedDoors } from './useOpenedDoors'

const giftsByDay = new Map(GIFTS.map((gift) => [gift.day, gift]))
const giftFor = (day: number): Gift => giftsByDay.get(day) ?? { day, emoji: '🎁', title: 'Surprise', message: '' }

/** Temps laissé à la porte pour pivoter avant d'afficher le petit mot. */
const REVEAL_DELAY = 800

type Toast = { id: number; text: string }

export default function App() {
  const now = useNow()
  const unlocked = unlockedCount(now)
  const [opened, openDoor] = useOpenedDoors()
  const [activeDay, setActiveDay] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const revealTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(revealTimer.current), [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const handlePress = useCallback(
    (day: number, state: DoorState) => {
      if (state === 'locked') {
        setToast({ id: Date.now(), text: `Patience… la porte ${day} s’ouvre le ${formatDay(day)}.` })
        return
      }
      window.clearTimeout(revealTimer.current)
      if (state === 'open') {
        setActiveDay(day)
        return
      }
      openDoor(day)
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      revealTimer.current = window.setTimeout(() => setActiveDay(day), calm ? 0 : REVEAL_DELAY)
    },
    [openDoor],
  )

  const stateOf = (day: number): DoorState => (day > unlocked ? 'locked' : opened.has(day) ? 'open' : 'ready')
  const openedCount = DAYS.filter((day) => stateOf(day) === 'open').length
  const waiting = unlocked - openedCount

  return (
    <>
      <Snow />

      <div className="page">
        <header className="intro">
          <p className="eyebrow">Calendrier de l’Avent · {YEAR}</p>
          <h1 className="intro__title">
            Pour toi, <em>{RECIPIENT}</em>
          </h1>
          <p className="intro__lede">24 portes, 24 petites attentions. Une chaque jour, jusqu’à Noël.</p>

          {unlocked === 0 ? (
            <section className="status" aria-label="Décompte avant le 1er décembre">
              <p className="status__label">La première porte s’ouvre dans</p>
              <Countdown target={unlockTime(1)} now={now} />
            </section>
          ) : (
            <section className="status" aria-label="Où en est le calendrier">
              <p className="status__headline">
                {waiting > 1
                  ? `${waiting} portes t’attendent`
                  : waiting === 1
                    ? 'Une porte t’attend'
                    : unlocked < 24
                      ? 'À demain pour la suite'
                      : 'Joyeux Noël ♥'}
              </p>
              {unlocked < 24 && (
                <p className="status__next">
                  Prochaine porte dans <NextDoorTimer target={unlockTime(unlocked + 1)} now={now} />
                </p>
              )}
              <div className="progress">
                <div className="progress__dots" aria-hidden="true">
                  {DAYS.map((day) => (
                    <span key={day} className="progress__dot" data-lit={stateOf(day) === 'open'} />
                  ))}
                </div>
                <p className="progress__text">
                  {openedCount} / 24 {openedCount < 2 ? 'porte ouverte' : 'portes ouvertes'}
                </p>
              </div>
            </section>
          )}
        </header>

        <main className="board">
          <div className="board__grid">
            {DAYS.map((day) => {
              const gift = giftFor(day)
              return (
                <Door
                  key={day}
                  day={day}
                  state={stateOf(day)}
                  emoji={gift.emoji}
                  title={gift.title}
                  onPress={handlePress}
                />
              )
            })}
          </div>
        </main>

        <footer className="footer">{FOOTER}</footer>
      </div>

      <div className="toast" role="status">
        {toast && <p key={toast.id}>{toast.text}</p>}
      </div>

      <GiftDialog gift={activeDay === null ? null : giftFor(activeDay)} onClose={() => setActiveDay(null)} />
    </>
  )
}
