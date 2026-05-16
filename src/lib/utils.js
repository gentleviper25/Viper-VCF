/**
 * src/lib/utils.js
 * Shared utility helpers — zero external dependencies.
 */

/** Generate a cryptographically random session code */
export function generateSessionCode(len = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no confusable chars
  const arr   = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr, b => chars[b % chars.length]).join('')
}

/** Format a date string nicely using Intl */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      month:  'short',
      day:    'numeric',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  } catch {
    return '—'
  }
}

/** Relative time e.g. "3 hours ago" using Intl.RelativeTimeFormat */
export function relativeTime(dateStr) {
  if (!dateStr) return '—'
  try {
    const diff = new Date(dateStr) - Date.now()
    const rtf  = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const abs  = Math.abs(diff)
    if (abs < 60_000)        return rtf.format(Math.round(diff / 1_000),        'second')
    if (abs < 3_600_000)     return rtf.format(Math.round(diff / 60_000),       'minute')
    if (abs < 86_400_000)    return rtf.format(Math.round(diff / 3_600_000),    'hour')
    if (abs < 2_592_000_000) return rtf.format(Math.round(diff / 86_400_000),   'day')
    return rtf.format(Math.round(diff / 2_592_000_000), 'month')
  } catch {
    return '—'
  }
}

/** Check if a session is expired */
export function isExpired(expiryStr) {
  if (!expiryStr) return false
  try { return new Date(expiryStr) < new Date() } catch { return false }
}

/** Time remaining label e.g. "3h 22m left" */
export function timeLeft(expiryStr) {
  if (!expiryStr) return '—'
  try {
    const diff = new Date(expiryStr) - Date.now()
    if (diff <= 0) return 'Expired'
    const d = Math.floor(diff / 86_400_000)
    const h = Math.floor((diff % 86_400_000) / 3_600_000)
    const m = Math.floor((diff % 3_600_000)  / 60_000)
    if (d > 0) return `${d}d ${h}h left`
    if (h > 0) return `${h}h ${m}m left`
    return `${m}m left`
  } catch { return '—' }
}

/** Copy text to clipboard */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    el.style.cssText = 'position:fixed;opacity:0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }
}

/** Public session URL */
export function sessionUrl(code) {
  return `${window.location.origin}/s/${code}`
}

/** Clamp a number between min and max */
export function clamp(n, min, max) { return Math.min(Math.max(n, min), max) }

/** Debounce a function */
export function debounce(fn, ms = 300) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

/** Client-side rate-limiter using sessionStorage */
export function checkSubmissionCooldown(sessionCode) {
  const key      = `vcf_cooldown_${sessionCode}`
  const last     = sessionStorage.getItem(key)
  const cooldown = parseInt(import.meta.env.VITE_SUBMISSION_COOLDOWN || '30', 10) * 1000
  if (last && Date.now() - parseInt(last, 10) < cooldown) {
    const wait = Math.ceil((cooldown - (Date.now() - parseInt(last, 10))) / 1000)
    return { allowed: false, wait }
  }
  return { allowed: true, wait: 0 }
}

export function recordSubmission(sessionCode) {
  sessionStorage.setItem(`vcf_cooldown_${sessionCode}`, Date.now().toString())
}
