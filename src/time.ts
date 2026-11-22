import { useEffect, useState } from 'react'
import { YEAR } from './config'

export const DAYS = Array.from({ length: 24 }, (_, i) => i + 1)

/*
 * En développement uniquement, on peut simuler une date pour tester :
 *   http://localhost:5173/?date=2026-12-05
 *   http://localhost:5173/?date=2026-11-30T23:59:50   (pour voir le passage à minuit)
 * Une fois le site en ligne, ce paramètre est ignoré : pas de triche possible.
 */
function readOffset(): number {
  if (!import.meta.env.DEV) return 0
  const raw = new URLSearchParams(window.location.search).get('date')
  if (!raw) return 0
  const simulated = new Date(raw.includes('T') ? raw : `${raw}T09:00:00`).getTime()
  return Number.isNaN(simulated) ? 0 : simulated - Date.now()
}

const offset = readOffset()

export const getNow = () => Date.now() + offset

/** Instant où la porte s'ouvre : minuit, heure locale, le jour J. */
export const unlockTime = (day: number) => new Date(YEAR, 11, day).getTime()

/** Nombre de portes déjà déverrouillées (0 avant le 1er décembre, 24 à partir du 24). */
export const unlockedCount = (now: number) => DAYS.filter((day) => unlockTime(day) <= now).length

export const formatDay = (day: number) => (day === 1 ? '1er décembre' : `${day} décembre`)

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

/** L'heure courante, rafraîchie à chaque changement de seconde. */
export function useNow(): number {
  const [now, setNow] = useState(getNow)

  useEffect(() => {
    let timer: number
    const schedule = () => {
      timer = window.setTimeout(() => {
        setNow(getNow())
        schedule()
      }, 1000 - (getNow() % 1000) + 5)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [])

  return now
}
