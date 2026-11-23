import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { GameProps } from './types'

const GOALS = 3
/** Durée d'un aller-retour du gardien, en millisecondes. */
const PERIOD = 2800
/** Temps de vol du ballon, en millisecondes. */
const FLIGHT = 380
/** Demi-largeur que le gardien couvre, en pourcentage de la largeur du but. */
const REACH = 15
/** Au-dessus de cette hauteur (en pourcentage depuis la barre), le gardien ne peut rien : c'est la lucarne. */
const TOP_CORNER = 24
const SPOT = { left: 50, top: 86 }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Position du centre du gardien (en % de la largeur du but) : il fait des allers-retours réguliers. */
function keeperAt(elapsed: number) {
  const phase = (elapsed % PERIOD) / PERIOD
  const swing = phase < 0.5 ? phase * 2 : 2 - phase * 2
  return 13 + swing * 74
}

/** Tirs au but : trois buts à marquer en visant là où le gardien n'est pas. */
export function PenaltyGame({ onWin }: GameProps) {
  const pitchRef = useRef<HTMLDivElement>(null)
  const keeperRef = useRef<HTMLDivElement>(null)
  const startedAt = useRef(performance.now())
  /** Temps écoulé figé pendant l'annonce du résultat : le gardien s'arrête là où il était à l'arrivée du ballon. */
  const frozenAt = useRef<number | null>(null)
  const busy = useRef(false)
  const timers = useRef<number[]>([])
  const [goals, setGoals] = useState(0)
  const [ball, setBall] = useState({ ...SPOT, flying: false })
  const [call, setCall] = useState<string | null>(null)

  // Le gardien est déplacé image par image, sans repasser par React.
  useEffect(() => {
    let frame = 0
    const tick = (now: number) => {
      const elapsed = frozenAt.current ?? now - startedAt.current
      if (keeperRef.current) keeperRef.current.style.left = `${keeperAt(elapsed)}%`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), [])

  const shoot = (event: PointerEvent<HTMLDivElement>) => {
    const pitch = pitchRef.current
    if (!pitch || busy.current || goals >= GOALS) return
    busy.current = true

    const goalRect = event.currentTarget.getBoundingClientRect()
    const pitchRect = pitch.getBoundingClientRect()
    const aimX = clamp(((event.clientX - goalRect.left) / goalRect.width) * 100, 5, 95)
    const aimY = clamp(((event.clientY - goalRect.top) / goalRect.height) * 100, 8, 92)
    setBall({
      left: ((goalRect.left - pitchRect.left + (aimX / 100) * goalRect.width) / pitchRect.width) * 100,
      top: ((goalRect.top - pitchRect.top + (aimY / 100) * goalRect.height) / pitchRect.height) * 100,
      flying: true,
    })

    timers.current.push(
      window.setTimeout(() => {
        const elapsed = performance.now() - startedAt.current
        frozenAt.current = elapsed
        const keeper = keeperAt(elapsed)
        const topCorner = aimY <= TOP_CORNER
        const saved = !topCorner && Math.abs(aimX - keeper) < REACH
        const total = saved ? goals : goals + 1
        setCall(saved ? 'Arrêté !' : topCorner ? 'Lucarne !' : 'But !')
        setGoals(total)

        timers.current.push(
          window.setTimeout(() => {
            setCall(null)
            setBall({ ...SPOT, flying: false })
            // Le gardien repart de là où il s'était figé.
            startedAt.current = performance.now() - elapsed
            frozenAt.current = null
            if (total >= GOALS) onWin()
            else busy.current = false
          }, 850),
        )
      }, FLIGHT),
    )
  }

  return (
    <div className="penalty" ref={pitchRef}>
      <p className="penalty__score" aria-label={`${goals} but${goals > 1 ? 's' : ''} sur ${GOALS}`}>
        {Array.from({ length: GOALS }, (_, index) => (
          <span key={index} data-on={index < goals} aria-hidden="true">
            ★
          </span>
        ))}
      </p>
      <div className="penalty__goal" onPointerDown={shoot}>
        <div className="penalty__keeper" ref={keeperRef} aria-hidden="true">
          🧤
        </div>
      </div>
      <span className="penalty__spot" aria-hidden="true" />
      <span
        className="penalty__ball"
        data-flying={ball.flying}
        style={{ left: `${ball.left}%`, top: `${ball.top}%` }}
        aria-hidden="true"
      >
        ⚽
      </span>
      {call && (
        <p className="penalty__call" role="status">
          {call}
        </p>
      )}
    </div>
  )
}
