/**
 * src/lib/sanitize.js
 * Sanitize all user inputs before DB writes.
 * Prevents XSS, SQL-injection hints, and encoding abuse.
 */

/** Strip HTML tags and trim whitespace */
export function stripHtml(str = '') {
  return String(str)
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()
}

/** Sanitize a plain text field */
export function sanitizeText(str = '', maxLen = 255) {
  return stripHtml(str).slice(0, maxLen)
}

/** Sanitize a phone number — digits, +, spaces, hyphens only */
export function sanitizePhone(str = '') {
  return String(str)
    .replace(/[^0-9+\-\s()]/g, '')
    .trim()
    .slice(0, 20)
}

/** Sanitize a URL — allow only http/https */
export function sanitizeUrl(str = '') {
  const s = String(str).trim().slice(0, 512)
  if (!s) return ''
  try {
    const u = new URL(s)
    if (!['http:', 'https:'].includes(u.protocol)) return ''
    return u.toString()
  } catch {
    return ''
  }
}

/** Sanitize a full session payload */
export function sanitizeSession(data = {}) {
  return {
    title:          sanitizeText(data.title,       120),
    description:    sanitizeText(data.description, 500),
    whatsapp_link:  sanitizeUrl(data.whatsapp_link),
    telegram_link:  sanitizeUrl(data.telegram_link),
  }
}

/** Sanitize a public contact submission */
export function sanitizeContact(data = {}) {
  return {
    name:  sanitizeText(data.name,  100),
    phone: sanitizePhone(data.phone),
  }
}
