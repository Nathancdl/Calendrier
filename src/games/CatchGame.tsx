import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { GameProps } from './types'

type Item = { id: number; kind: 'bobun' | 'sock'; left: number; duration: number }
type Pop = { id: number; x: number; y: number; text: string; bad: boolean }

const TARGET = 10

/** Des bo bun tombent : il faut en attraper dix. Toucher une soquette en fait perdre un. */
export function CatchGame({ onWin }: GameProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const [items, setItems] = useState<Item[]>([])
  const [pops, setPops] = useState<Pop[]>([])
  const [score, setScore] = useState(0)
  const won = score >= TARGET

  useEffect(() => {
    if (won) return
    const spawn = () => {
      const item: Item = {
        id: nextId.current++,
        kind: Math.random() < 0.72 ? 'bobun' : 'sock',
        left: 10 + Math.random() * 80,
        duration: 2.8 + Math.random() * 1.2,
      }
      setItems((list) => [...list.slice(-11), item])
    }
    spawn()
    const timer = window.setInterval(spawn, 620)
    return () => window.clearInterval(timer)
  }, [won])

  useEffect(() => {
    if (!won) return
    setItems([])
    const celebration = window.setTimeout(onWin, 350)
    return () => window.clearTimeout(celebration)
  }, [won, onWin])

  const remove = (id: number) => setItems((list) => list.filter((item) => item.id !== id))

  const hit = (item: Item, event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const board = boardRef.current
    if (!board || won) return
    const boardRect = board.getBoundingClientRect()
    const itemRect = event.currentTarget.getBoundingClientRect()
    const caught = item.kind === 'bobun'
    const pop: Pop = {
      id: nextId.current++,
      x: itemRect.left + itemRect.width / 2 - boardRect.left,
      y: itemRect.top + itemRect.height / 2 - boardRect.top,
      text: caught ? '+1' : 'Red flag !',
      bad: !caught,
    }
    setPops((list) => [...list, pop])
    remove(item.id)
    setScore((current) => (caught ? current + 1 : Math.max(0, current - 1)))
  }

  return (
    <div className="catch" ref={boardRef}>
      <p className="catch__score" aria-live="polite">
        🍜 {Math.min(score, TARGET)} / {TARGET}
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          tabIndex={-1}
          className="catch__item"
          style={{ left: `${item.left}%`, '--fall': `${item.duration}s` } as CSSProperties}
          aria-label={item.kind === 'bobun' ? 'Bo bun' : 'Soquette'}
          onPointerDown={(event) => hit(item, event)}
          onAnimationEnd={() => remove(item.id)}
        >
          {item.kind === 'bobun' ? '🍜' : '🧦'}
        </button>
      ))}
      {pops.map((pop) => (
        <span
          key={pop.id}
          className="catch__pop"
          data-bad={pop.bad}
          style={{ left: pop.x, top: pop.y }}
          onAnimationEnd={() => setPops((list) => list.filter((other) => other.id !== pop.id))}
        >
          {pop.text}
        </span>
      ))}
    </div>
  )
}
