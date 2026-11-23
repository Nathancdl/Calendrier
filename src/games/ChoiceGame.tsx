import { useEffect, useRef, useState } from 'react'
import type { GameProps } from './types'

type Option = { label: string; right?: boolean; reply: string }
type Round = { prompt: string; options: Option[] }

/** Temps laissé pour lire la réponse avant de passer à la carte suivante, en millisecondes. */
const ADVANCE = 2100

/* ---------- Red flag ou green flag ---------- */

const MISS = 'Raté. Réessaie, tu connais la réponse.'

/** Une carte à classer. La réplique s'affiche quand la bonne réponse est trouvée. */
const flag = (prompt: string, answer: 'red' | 'green' | 'both', reply: string): Round => ({
  prompt,
  options: [
    { label: '🚩 Red flag', right: answer !== 'green', reply: answer !== 'green' ? reply : MISS },
    { label: '💚 Green flag', right: answer !== 'red', reply: answer !== 'red' ? reply : MISS },
  ],
})

const FLAGS: Round[] = [
  flag('Un mec en soquettes', 'red', '« Il avait des soquettes, j’ai mis fin à l’entretien. »'),
  flag('Aller au marché le dimanche', 'green', '« C’est tellement sexy que t’ailles au marché. »'),
  flag('Arriver en retard', 'red', '« C’est hyper de droite. »'),
  flag('Du ketchup dans les pâtes', 'red', 'Carton jaune. Même si c’est ta madeleine de Proust.'),
  flag('Retenir tout ce que tu dis', 'green', '« Tu retiens tout ce que je dis. »'),
  flag('Boire son café dans les tasses du week-end', 'red', '« Qui a bu son café dans les tasses du weekend ? »'),
  flag('Toi', 'both', 'Ton green flag, c’est d’être un peu red flag.'),
]

/* ---------- Le quiz sur vous deux ---------- */

const QUIZ: Round[] = [
  {
    prompt: 'Ton tout premier message, le 25 septembre 2012 ?',
    options: [
      { label: '« Salut, ça va ? »', reply: 'Trop classique pour toi.' },
      { label: '« T’es en 3e ou en 2nde ? »', right: true, reply: 'J’ai craqué direct.' },
      { label: '« C’est qui ? »', reply: 'Non, ça c’est ma réplique.' },
    ],
  },
  {
    prompt: 'Qui a dit « mon chat » en premier ?',
    options: [
      { label: 'Winnie', right: true, reply: '« Ça ira pour cette fois », tu m’avais répondu.' },
      { label: 'Moi', reply: 'Non non, c’est moi qui ai craqué le premier.' },
      { label: 'C’est venu tout seul', reply: 'Presque : c’est venu tout seul, mais de moi.' },
    ],
  },
  {
    prompt: 'Qu’as-tu envoyé au Père Noël pour m’avoir ?',
    options: [
      { label: 'Ma vache', reply: '« J’ai jamais envoyé ma vache au Père Noël. »' },
      { label: 'Une lettre', reply: 'Tu avais mieux à envoyer.' },
      { label: 'Ma teuteute', right: true, reply: '« J’ai envoyé ma teuteute et j’ai eu toi. »' },
    ],
  },
  {
    prompt: 'Depuis le 18 novembre, je m’appelle…',
    options: [
      { label: 'Banane', reply: 'Ça, c’est quand je fais n’importe quoi.' },
      { label: 'Winnie', right: true, reply: 'Hihihi, c’est Winnie.' },
      { label: 'Adibou', reply: 'Seulement quand je joue.' },
    ],
  },
  {
    prompt: 'Le panier, c’est quoi ?',
    options: [
      { label: 'Chez toi, bien au chaud', right: true, reply: '« Dans ton panier tout chaud. »' },
      { label: 'Mon panier du marché', reply: 'Celui-là, il est rempli de panais.' },
      { label: 'Un panier de basket', reply: 'On est plutôt hand et foot, ici.' },
    ],
  },
]

type ChoiceProps = { rounds: Round[]; variant: 'flags' | 'quiz'; onWin: () => void }

/** Une série de cartes à choix : une mauvaise réponse se retente, la bonne fait passer à la suivante. */
function ChoiceGame({ rounds, variant, onWin }: ChoiceProps) {
  const [index, setIndex] = useState(0)
  /** Les mauvaises réponses déjà tentées sur la carte en cours. */
  const [tried, setTried] = useState<number[]>([])
  const [solved, setSolved] = useState<number | null>(null)
  const [reply, setReply] = useState('')
  const timer = useRef<number | undefined>(undefined)
  const round = rounds[index]

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const pick = (choice: number) => {
    if (solved !== null || tried.includes(choice)) return
    const option = round.options[choice]
    setReply(option.reply)
    if (!option.right) {
      setTried((list) => [...list, choice])
      return
    }
    setSolved(choice)
    timer.current = window.setTimeout(() => {
      if (index + 1 >= rounds.length) {
        onWin()
        return
      }
      setIndex(index + 1)
      setTried([])
      setSolved(null)
      setReply('')
    }, ADVANCE)
  }

  return (
    <div className="choice" data-variant={variant}>
      <div className="choice__card" key={index}>
        <span className="choice__count">
          {index + 1} / {rounds.length}
        </span>
        <p className="choice__prompt">{round.prompt}</p>
      </div>

      <div className="choice__options">
        {round.options.map((option, choice) => {
          const state = solved === choice ? 'right' : tried.includes(choice) ? 'wrong' : 'idle'
          return (
            <button
              key={`${index}-${choice}`}
              type="button"
              className="choice__option"
              data-kind={variant === 'flags' ? (choice === 0 ? 'red' : 'green') : undefined}
              data-state={state}
              aria-disabled={state === 'wrong' || solved !== null}
              onClick={() => pick(choice)}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <p className="choice__reply" data-right={solved !== null} aria-live="polite">
        {reply}
      </p>
    </div>
  )
}

/** Des situations à classer en red flag ou green flag, avec vos vraies répliques. */
export function FlagsGame({ onWin }: GameProps) {
  return <ChoiceGame rounds={FLAGS} variant="flags" onWin={onWin} />
}

/** Cinq questions sur votre histoire. */
export function QuizGame({ onWin }: GameProps) {
  return <ChoiceGame rounds={QUIZ} variant="quiz" onWin={onWin} />
}
