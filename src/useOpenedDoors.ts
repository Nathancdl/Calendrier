import { useCallback, useEffect, useState } from 'react'
import { YEAR } from './config'

const DOORS_KEY = `calendrier-avent-${YEAR}`
const GAMES_KEY = `${DOORS_KEY}-jeux`

// En développement, ?reset referme toutes les portes et remet les mini-jeux à zéro.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('reset')) {
  try {
    localStorage.removeItem(DOORS_KEY)
    localStorage.removeItem(GAMES_KEY)
  } catch {
    // Stockage indisponible : rien à effacer.
  }
}

function read(key: string): number[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(stored) ? stored.filter((n) => Number.isInteger(n)) : []
  } catch {
    return []
  }
}

/** Un ensemble de jours mémorisé sur l'appareil, pour le retrouver à la prochaine visite. */
function useStoredDays(key: string) {
  const [days, setDays] = useState<ReadonlySet<number>>(() => new Set(read(key)))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify([...days]))
    } catch {
      // Navigation privée ou stockage bloqué : le calendrier marche quand même, sans mémoire.
    }
  }, [key, days])

  const add = useCallback((day: number) => {
    setDays((prev) => (prev.has(day) ? prev : new Set(prev).add(day)))
  }, [])

  return [days, add] as const
}

/** Les portes déjà ouvertes. */
export const useOpenedDoors = () => useStoredDays(DOORS_KEY)

/** Les jours dont le mini-jeu a déjà été réussi (ou passé) : on ne le repropose pas. */
export const usePlayedGames = () => useStoredDays(GAMES_KEY)
