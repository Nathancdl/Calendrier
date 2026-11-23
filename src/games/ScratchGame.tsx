import { useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import type { GameProps } from './types'

/** Rayon du « doigt », en pixels. */
const BRUSH = 22
/** Part de la carte à gratter avant de considérer que c'est gagné. */
const GOAL = 0.5

/** Carte à gratter : on frotte la couche dorée pour découvrir le cadeau dessous. */
export function ScratchGame({ gift, onWin }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scratching = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const lastCheck = useRef(0)
  const [done, setDone] = useState(false)

  // La couche dorée est peinte avant le premier affichage, pour ne jamais laisser voir le cadeau.
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { willReadFrequently: true })
    if (!canvas || !context) return

    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    context.scale(ratio, ratio)

    const coat = context.createLinearGradient(0, 0, width, height)
    coat.addColorStop(0, '#f1c766')
    coat.addColorStop(0.5, '#dfa93f')
    coat.addColorStop(1, '#c98f2b')
    context.fillStyle = coat
    context.fillRect(0, 0, width, height)

    context.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    context.lineWidth = 2
    for (let x = -height; x < width; x += 12) {
      context.beginPath()
      context.moveTo(x, height)
      context.lineTo(x + height, 0)
      context.stroke()
    }

    context.fillStyle = '#1a2256'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = '600 20px "Figtree Variable", system-ui, sans-serif'
    context.fillText('✨ Gratte ici ✨', width / 2, height / 2)
  }, [])

  const scratch = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget
    const context = canvas.getContext('2d')
    if (!context) return
    // La carte peut encore être en train de s'animer : on convertit la position à l'écran en position sur le canvas.
    const rect = canvas.getBoundingClientRect()
    const to = {
      x: ((event.clientX - rect.left) / rect.width) * canvas.offsetWidth,
      y: ((event.clientY - rect.top) / rect.height) * canvas.offsetHeight,
    }
    const from = last.current ?? to
    // Trait opaque : en mode « destination-out », c'est l'opacité du trait qui décide de ce qui est effacé.
    context.globalCompositeOperation = 'destination-out'
    context.strokeStyle = '#000'
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = BRUSH * 2
    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x + 0.01, to.y)
    context.stroke()
    last.current = to
  }

  const checkProgress = (canvas: HTMLCanvasElement, force: boolean) => {
    const now = performance.now()
    if (!force && now - lastCheck.current < 180) return
    lastCheck.current = now
    const context = canvas.getContext('2d')
    if (!context) return
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
    let cleared = 0
    let total = 0
    // Un pixel sur treize suffit largement pour estimer la surface grattée.
    for (let i = 3; i < data.length; i += 4 * 13) {
      total++
      if (data[i] < 40) cleared++
    }
    if (cleared / total >= GOAL) {
      setDone(true)
      onWin()
    }
  }

  const stop = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!scratching.current) return
    scratching.current = false
    last.current = null
    if (!done) checkProgress(event.currentTarget, true)
  }

  return (
    <div className="scratch" data-done={done}>
      <span className="scratch__emoji" aria-hidden="true">
        {gift.emoji}
      </span>
      <span className="scratch__title">{gift.title}</span>
      <canvas
        ref={canvasRef}
        className="scratch__canvas"
        aria-label="Carte à gratter"
        onPointerDown={(event) => {
          if (done) return
          event.currentTarget.setPointerCapture(event.pointerId)
          scratching.current = true
          last.current = null
          scratch(event)
        }}
        onPointerMove={(event) => {
          if (!scratching.current || done) return
          scratch(event)
          checkProgress(event.currentTarget, false)
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
      />
    </div>
  )
}
