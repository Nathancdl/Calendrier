import { memo, type CSSProperties, type MouseEvent } from 'react'
import { DOORS, patternOf, tiltOf } from '../layout'
import { formatDay } from '../time'

/** locked : pas encore le jour J · ready : peut être ouverte · open : déjà ouverte. */
export type DoorState = 'locked' | 'ready' | 'open'

type Props = {
  day: number
  state: DoorState
  emoji: string
  title: string
  onPress: (day: number, state: DoorState) => void
}

const SHAKE: Keyframe[] = [
  { transform: 'translateX(0) rotate(0)' },
  { transform: 'translateX(-4px) rotate(-1.5deg)' },
  { transform: 'translateX(4px) rotate(1.5deg)' },
  { transform: 'translateX(-3px) rotate(-1deg)' },
  { transform: 'translateX(0) rotate(0)' },
]

export const Door = memo(function Door({ day, state, emoji, title, onPress }: Props) {
  const look = DOORS[day]
  const style = {
    '--area': look.narrow,
    '--area-wide': look.wide,
    '--tilt': `${tiltOf(day)}deg`,
  } as CSSProperties

  const label =
    state === 'locked'
      ? `Porte ${day}, fermée jusqu’au ${formatDay(day)}`
      : state === 'ready'
        ? `Porte ${day}, à ouvrir`
        : `Porte ${day}, ouverte : ${title}`

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (state === 'locked' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      event.currentTarget.animate(SHAKE, { duration: 420, easing: 'ease-in-out' })
    }
    onPress(day, state)
  }

  return (
    <button
      type="button"
      className="door"
      style={style}
      data-tone={look.tone}
      data-pattern={patternOf(day)}
      data-state={state}
      aria-label={label}
      aria-disabled={state === 'locked'}
      onClick={handleClick}
    >
      <span className="door__inside" aria-hidden="true">
        {state === 'open' && <span className="door__emoji">{emoji}</span>}
      </span>
      <span className="door__leaf" aria-hidden="true">
        <span className="door__number">{day}</span>
      </span>
    </button>
  )
})
