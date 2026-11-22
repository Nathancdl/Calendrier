import { useEffect, useRef } from 'react'

type Flake = { x: number; y: number; radius: number; speed: number; sway: number; phase: number; alpha: number }

/** Neige légère dessinée sur un canvas plein écran. Désactivée si l'appareil demande moins d'animations. */
export function Snow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = 0
    let height = 0
    let flakes: Flake[] = []
    let frame = 0
    let last = performance.now()

    const spawn = (anywhere: boolean): Flake => {
      // Les flocons « proches » sont plus gros, plus rapides et plus nets.
      const depth = Math.random()
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -8,
        radius: 0.7 + depth * 2,
        speed: 14 + depth * 32,
        sway: 6 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + depth * 0.55,
      }
    }

    const resize = () => {
      const widthChanged = window.innerWidth !== width
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      // Sur mobile, la barre d'adresse change la hauteur en plein défilement :
      // on ne redistribue les flocons que si la largeur a vraiment changé.
      if (widthChanged) {
        const count = Math.min(110, Math.round((width * height) / 11000))
        flakes = Array.from({ length: count }, () => spawn(true))
      }
    }

    const draw = (time: number) => {
      const delta = Math.min(0.05, (time - last) / 1000)
      last = time
      context.clearRect(0, 0, width, height)
      context.fillStyle = '#fff'
      for (const flake of flakes) {
        flake.y += flake.speed * delta
        flake.phase += delta * 0.8
        if (flake.y > height + 8) Object.assign(flake, spawn(false))
        context.globalAlpha = flake.alpha
        context.beginPath()
        context.arc(flake.x + Math.sin(flake.phase) * flake.sway, flake.y, flake.radius, 0, Math.PI * 2)
        context.fill()
      }
      frame = requestAnimationFrame(draw)
    }

    resize()
    frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="snow" aria-hidden="true" />
}
