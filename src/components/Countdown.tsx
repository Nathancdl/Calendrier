import { splitDuration } from '../time'

const pad = (value: number) => String(value).padStart(2, '0')
// En français, 0 et 1 restent au singulier.
const plural = (value: number, word: string) => (value < 2 ? word : `${word}s`)

type Props = { target: number; now: number }

/** Grand décompte en quatre tuiles : jours, heures, minutes, secondes. */
export function Countdown({ target, now }: Props) {
  const { days, hours, minutes, seconds } = splitDuration(target - now)
  const units = [
    { value: days, label: plural(days, 'jour') },
    { value: hours, label: plural(hours, 'heure') },
    { value: minutes, label: plural(minutes, 'minute') },
    { value: seconds, label: plural(seconds, 'seconde') },
  ]

  return (
    <div className="clock" role="timer">
      {units.map((unit, index) => (
        <div className="clock__unit" key={index}>
          <span className="clock__value">{pad(unit.value)}</span>
          <span className="clock__label">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Version compacte, pour l'attente entre deux portes (toujours moins de 24 h). */
export function NextDoorTimer({ target, now }: Props) {
  const { hours, minutes, seconds } = splitDuration(target - now)
  return (
    <strong role="timer">
      {pad(hours)} h {pad(minutes)} min {pad(seconds)} s
    </strong>
  )
}
