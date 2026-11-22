import { useCallback, useEffect, useState } from 'react'
import { YEAR } from './config'

const KEY = `calendrier-avent-${YEAR}`

function read(): number[] {
  try {
    // En développement, ?reset referme toutes les portes.
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reset')) {
      localStorage.removeItem(KEY)
    }
    const stored: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(stored) ? stored.filter((n) => Number.isInteger(n)) : []
  } catch {
    return []
  }
}

/** Les portes déjà ouvertes, mémorisées sur l'appareil pour les retrouver à la prochaine visite. */
export function useOpenedDoors() {
  const [opened, setOpened] = useState<ReadonlySet<number>>(() => new Set(read()))

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify([...opened]))
    } catch {
      // Navigation privée ou stockage bloqué : le calendrier marche quand même, sans mémoire.
    }
  }, [opened])

  const open = useCallback((day: number) => {
    setOpened((prev) => (prev.has(day) ? prev : new Set(prev).add(day)))
  }, [])

  return [opened, open] as const
}
