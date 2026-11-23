import { useEffect, useRef, useState } from 'react'
import { formatDay } from '../time'
import type { GameProps } from './types'

type Bubble = { from: 'her' | 'him'; text: string; fresh?: boolean }
type Moment = { when: string; note: string; bubbles: Bubble[] }

/** Écart entre deux bulles d'un même moment, en secondes : la conversation se « rejoue ». */
const STAGGER = 0.42

/*
 * Comment vous en êtes arrivés là, étape par étape : chaque moment a sa date, une courte
 * légende qui dit où on en est (`note`), puis vos vrais messages recopiés tels quels,
 * fautes de frappe comprises.
 * 'her' = ses bulles à elle, à droite comme sur son téléphone ; 'him' = les tiennes, à gauche.
 * Le tout dernier moment est ajouté par le jeu : c'est ta réponse d'aujourd'hui.
 */
const MOMENTS: Moment[] = [
  {
    when: '25 septembre 2012 · 22 h 37',
    note: 'Ton tout premier message',
    bubbles: [{ from: 'her', text: 'hey excuse moi t’es en 3eme ou en seconde ?' }],
  },
  {
    when: '30 septembre 2026',
    note: 'Quatorze ans plus tard, on se réécrit',
    bubbles: [
      { from: 'him', text: 'Ramen ou p’tit verre ?' },
      { from: 'her', text: 'Bo bun bahahah ?' },
      { from: 'him', text: 'Bo bun ca me va !' },
      { from: 'her', text: 'Jeudi ok alors' },
    ],
  },
  {
    when: '1er octobre',
    note: 'Le trac du premier rendez-vous',
    bubbles: [
      { from: 'her', text: 'Tu sais ce qui me stress moi' },
      { from: 'her', text: 'C’est que la à tout moment tu te dises mmmh en fait non' },
      { from: 'him', text: 'Euh qu’il y ait pas de Bo Bun au resto ?' },
      { from: 'him', text: 'Non non je viens bien venir, moi et la tachycardie que je vais faire' },
      { from: 'her', text: 'Respire on se connait depuis qu’on a 15 ans all good' },
    ],
  },
  {
    when: '5 octobre',
    note: 'Le premier « mon chat »',
    bubbles: [
      { from: 'him', text: 'Oki mon chat repose toi bien' },
      { from: 'him', text: 'J’ai dis mon chat c’était too much' },
      { from: 'her', text: '🤣🤣 ça ira pour cette fois' },
    ],
  },
  {
    when: '6 octobre',
    note: 'Le premier « tu me manques »',
    bubbles: [
      { from: 'him', text: 'Tu me manques un tout p’tit peu' },
      { from: 'him', text: 'Genre tout petit' },
      { from: 'him', text: 'Et c’est ok d’ailleurs' },
      { from: 'her', text: 'Euh t’es mims toi 😳 je te manque deja ?' },
    ],
  },
  {
    when: '14 octobre',
    note: 'Mon aveu, quatorze ans après',
    bubbles: [
      {
        from: 'her',
        text: 'Tout ça pour qu’un beau jour tu finisses par reçevoir “hey excuse moi t’es en 3eme ou en seconde ?” 🤣 t’avais du etre trop chokbar',
      },
      { from: 'him', text: 'Arrête j’ai craqué direct sur ce rentre dedans en plus 🤣🤣' },
    ],
  },
  {
    when: '21 octobre',
    note: 'Une brosse à dents chez toi',
    bubbles: [
      { from: 'her', text: 'T’as deja une petite brosse à dents' },
      { from: 'him', text: 'Bah avoir sa brosse à dent quelque part' },
      { from: 'him', text: 'Enfin cest con' },
      { from: 'him', text: 'Mais je trouve que c’est quelque chose quand même mdr' },
    ],
  },
  {
    when: '24 octobre',
    note: 'La première fois que tu l’écris',
    bubbles: [
      { from: 'her', text: 'Toi aussi dors bien mon bébé soleil 🥰🥰🥰🥰🥰' },
      { from: 'her', text: 'Je t’aime' },
      { from: 'him', text: 'Moi aussi je t’aime mon amour 💕💕' },
    ],
  },
  {
    when: '30 octobre',
    note: 'Et tu me donnes un titre',
    bubbles: [{ from: 'her', text: 'Mon petit copain finalement 🤭🤭' }],
  },
  {
    when: '2 novembre',
    note: 'Quand le week-end ne suffit plus',
    bubbles: [
      {
        from: 'him',
        text: 'Je t’aime mon amour, ça fais toujours bizarre de plus t’avoir dans le coin apres les weekends hihi',
      },
      { from: 'her', text: 'Moi aussi je t’aime mon mini bébé, trop bien notre vie' },
    ],
  },
  {
    when: '2 novembre, le soir',
    note: 'Mon parfum dans le panier',
    bubbles: [
      { from: 'her', text: 'Ça sent toi zazou dans le panier' },
      { from: 'him', text: 'Bah uii j’ai mis du pitit parfum pour mon zazou pour pas qu’elle m’oublie en 2j' },
      { from: 'her', text: '12 ans n’ont pas suffit mon coeur' },
      { from: 'her', text: '2j ça risque pas' },
    ],
  },
  {
    when: '6 novembre',
    note: 'Tu l’annonces à tes parents',
    bubbles: [
      { from: 'her', text: 'Zazou j’ai dis 🙈🙈🙈' },
      { from: 'him', text: 'Je suis fier de toi mon amour 🥰' },
      {
        from: 'her',
        text: 'Papa il a dit c’est quoi cette journée je vais faire une crise cardiaque arretez 🤣🤣🤭💕',
      },
      { from: 'her', text: 'Oui oui, ils sont contents en vrai' },
    ],
  },
  {
    when: '12 novembre',
    note: 'Le verdict de ton père',
    bubbles: [
      {
        from: 'her',
        text: 'J’ai eu mes parents au tel mon pere il a dit que t’etais naturel et que t’avais l’air bien dans tes baskets mdr trop chou',
      },
      { from: 'her', text: 'Et qu’on allait bien ensemble' },
      { from: 'him', text: 'Oula' },
      { from: 'her', text: 'C’est trop mims' },
    ],
  },
  {
    when: '12 novembre, juste après',
    note: 'La Normandie en famille',
    bubbles: [
      { from: 'her', text: 'Tu fais quoi du 21 au 23 decembre ? 🤭' },
      { from: 'him', text: 'Tu vas rire je serai avec ma femme et sa famille en normandie' },
      { from: 'her', text: 'Ouiiiiii 💕💕💕💕' },
    ],
  },
  {
    when: '20 novembre',
    note: 'La veille de ton départ',
    bubbles: [
      { from: 'him', text: 'Oui zazou pas chouiné ça prouve a quelle point tu tiens à moi donc ..' },
      { from: 'her', text: 'J’ai pas chouiné parce qu’après je te retrouve pour toute la vie dans le panier 🧺' },
    ],
  },
  {
    when: '21 novembre',
    note: 'Juste avant l’avion',
    bubbles: [
      { from: 'her', text: 'Je t’aime très fort' },
      { from: 'him', text: 'Je t’aime je t’aime je t’aime' },
      { from: 'her', text: 'À la folie 💕💕💕' },
    ],
  },
]

/** Ta réponse du jour, qui clôt le fil : la seule bulle qui n'est pas un vrai message. */
const ANSWER =
  'Pour toute la vie dans le panier : baccord. En attendant que tu rentres, j’ai 24 portes pour toi, une chaque matin jusqu’à Noël. 💕'

/**
 * L'ouverture du calendrier : votre histoire rejouée en quelques messages,
 * jusqu'à sa question « C'est quoi le calendrier des bibs ? » et la réponse.
 */
export function StoryGame({ gift, replay = false, onWin }: GameProps) {
  const threadRef = useRef<HTMLDivElement>(null)
  const moments: Moment[] = [
    ...MOMENTS,
    { when: formatDay(gift.day), note: 'Et maintenant', bubbles: [{ from: 'him', text: ANSWER, fresh: true }] },
  ]
  const total = moments.length
  /** Nombre de moments déjà affichés : le premier d'entrée, ou tous quand on revient relire la conversation. */
  const [shown, setShown] = useState(replay ? total : 1)
  const previous = useRef(shown)
  const complete = shown >= total

  const followTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const thread = threadRef.current
    // On ne fait défiler que lorsqu'un nouveau moment arrive : à la relecture, le fil reste en haut.
    if (!thread || previous.current === shown) return
    previous.current = shown
    const moment = thread.lastElementChild as HTMLElement | null
    if (!moment) return
    // D'abord le haut du nouveau moment, pour lire sa date et sa légende…
    thread.scrollTo({ top: moment.offsetTop - 6, behavior: 'smooth' })
    // …puis, une fois ses bulles arrivées, on suit la conversation jusqu'en bas si elle dépasse.
    window.clearTimeout(followTimer.current)
    const bubbles = moment.querySelectorAll('.story__bubble').length
    followTimer.current = window.setTimeout(
      () => thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' }),
      (0.15 + bubbles * STAGGER + 0.5) * 1000,
    )
  }, [shown])

  useEffect(() => () => window.clearTimeout(followTimer.current), [])

  useEffect(() => {
    // À la relecture, on la laisse lire tranquillement : c'est elle qui revient au mot.
    if (!complete || replay) return
    // On laisse le temps de lire la dernière bulle avant de passer au mot.
    const pause = window.setTimeout(onWin, 2200)
    return () => window.clearTimeout(pause)
  }, [complete, replay, onWin])

  const next = () => setShown((count) => Math.min(total, count + 1))

  return (
    <>
      <div className="story" ref={threadRef} onClick={next} aria-live="polite">
        {moments.slice(0, shown).map((moment, index) => (
          <div className="story__moment" key={index}>
            <p className="story__when">{moment.when}</p>
            <p className="story__note">{moment.note}</p>
            {moment.bubbles.map((bubble, order) => (
              <p
                key={order}
                className="story__bubble"
                data-from={bubble.from}
                data-fresh={Boolean(bubble.fresh)}
                // Le premier moment est déjà là à l'ouverture ; les suivants se déroulent bulle après bulle.
                style={{ animationDelay: replay ? '0s' : `${(index === 0 ? 0.3 : 0.15) + order * STAGGER}s` }}
              >
                {/* Espace insécable avant ? ! : ; pour qu'un signe ne se retrouve jamais seul en début de ligne. */}
                {bubble.text.replace(/ ([?!:;])/g, ' $1')}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="story__controls">
        {!complete && (
          <button type="button" className="button story__next" onClick={next}>
            La suite
          </button>
        )}
        <p className="game__count" aria-hidden="true">
          {shown} / {total}
        </p>
      </div>
    </>
  )
}
