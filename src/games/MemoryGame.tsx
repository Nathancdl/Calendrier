import { useEffect, useId, useRef, useState } from 'react'
import type { GameProps } from './types'

type Sock = { id: string; label: string; fill: string; accent: string; pattern: 'plain' | 'stripes' | 'dots' }

const SOCKS: Sock[] = [
  { id: 'brique', label: 'rouge à rayures', fill: '#96303a', accent: '#f8dcc0', pattern: 'stripes' },
  { id: 'sapin', label: 'verte à pois', fill: '#1f5244', accent: '#f1cf85', pattern: 'dots' },
  { id: 'rose', label: 'rose unie', fill: '#e9b6ad', accent: '#96303a', pattern: 'plain' },
  { id: 'moutarde', label: 'jaune à rayures', fill: '#dfa93f', accent: '#1a2256', pattern: 'stripes' },
  { id: 'nuit', label: 'bleu nuit à pois', fill: '#1a2256', accent: '#ffcf7a', pattern: 'dots' },
  { id: 'ciel', label: 'bleu ciel unie', fill: '#8fb8de', accent: '#1a2256', pattern: 'plain' },
]

const OUTLINE = 'M17 5h14v20c0 2 1 3 3 4l6 3c5 2.5 5 10-1 10H25c-5 0-8-4-8-9z'

function SockDrawing({ fill, accent, pattern }: Sock) {
  const clip = `chaussette-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <path d={OUTLINE} />
        </clipPath>
      </defs>
      <path d={OUTLINE} fill={fill} />
      <g clipPath={`url(#${clip})`} fill={accent}>
        {/* revers, talon et pointe */}
        <rect x="14" y="3" width="20" height="7" />
        <circle cx="16" cy="41" r="7" />
        <circle cx="43" cy="38" r="7" />
        {pattern === 'stripes' && (
          <>
            <rect x="14" y="15" width="20" height="3" />
            <rect x="14" y="22" width="20" height="3" />
          </>
        )}
        {pattern === 'dots' && (
          <>
            <circle cx="21" cy="16" r="1.9" />
            <circle cx="27" cy="21" r="1.9" />
            <circle cx="21" cy="26" r="1.9" />
            <circle cx="30" cy="34" r="1.9" />
          </>
        )}
      </g>
      <path d={OUTLINE} fill="none" stroke="rgba(43, 26, 34, 0.25)" strokeWidth="1" />
    </svg>
  )
}

function shuffledDeck(): Sock[] {
  const deck = SOCKS.flatMap((sock) => [sock, sock])
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

/** Memory : retrouver les six paires de chaussettes. */
export function MemoryGame({ onWin }: GameProps) {
  const [deck] = useState(shuffledDeck)
  const [faceUp, setFaceUp] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const locked = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (matched.length < SOCKS.length) return
    const celebration = window.setTimeout(onWin, 450)
    return () => window.clearTimeout(celebration)
  }, [matched, onWin])

  const pick = (index: number) => {
    if (locked.current || faceUp.includes(index) || matched.includes(deck[index].id)) return
    const turned = [...faceUp, index]
    setFaceUp(turned)
    if (turned.length < 2) return

    locked.current = true
    const [first, second] = turned
    const isPair = deck[first].id === deck[second].id
    // Une paire reste visible ; sinon on laisse le temps de mémoriser avant de retourner.
    timer.current = window.setTimeout(
      () => {
        if (isPair) setMatched((found) => [...found, deck[first].id])
        setFaceUp([])
        locked.current = false
      },
      isPair ? 420 : 900,
    )
  }

  return (
    <>
      <div className="memory">
        {deck.map((sock, index) => {
          const found = matched.includes(sock.id)
          const visible = found || faceUp.includes(index)
          return (
            <button
              key={index}
              type="button"
              className="memory__card"
              data-up={visible}
              data-found={found}
              aria-label={visible ? `Chaussette ${sock.label}` : `Carte ${index + 1}, retournée`}
              onClick={() => pick(index)}
            >
              <span className="memory__inner">
                <span className="memory__face memory__face--back" aria-hidden="true">
                  ?
                </span>
                <span className="memory__face memory__face--front">
                  <SockDrawing {...sock} />
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <p className="game__count" aria-live="polite">
        Paires : {matched.length} / {SOCKS.length}
      </p>
    </>
  )
}
