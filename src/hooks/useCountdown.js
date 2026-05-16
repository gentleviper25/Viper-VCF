/**
 * src/hooks/useCountdown.js
 * Returns a live countdown object from a target date string.
 */
import { useState, useEffect } from 'react'

function calcLeft(target) {
  const diff = new Date(target) - Date.now()
  if (diff <= 0) return { expired: true, d: 0, h: 0, m: 0, s: 0, total: 0 }
  return {
    expired: false,
    total: diff,
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff % 86_400_000) / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
  }
}

export function useCountdown(targetDateStr) {
  const [tick, setTick] = useState(() => calcLeft(targetDateStr))

  useEffect(() => {
    if (!targetDateStr) return
    const id = setInterval(() => {
      const next = calcLeft(targetDateStr)
      setTick(next)
      if (next.expired) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [targetDateStr])

  return tick
}
