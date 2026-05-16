/**
 * src/lib/validators.js
 * Pure validation functions — return { valid: bool, error: string }
 */

export function validateEmail(email = '') {
  const re = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/
  if (!email.trim())          return { valid: false, error: 'Email is required.' }
  if (!re.test(email.trim())) return { valid: false, error: 'Enter a valid email address.' }
  return { valid: true, error: '' }
}

export function validatePassword(pw = '') {
  if (!pw)          return { valid: false, error: 'Password is required.' }
  if (pw.length < 8) return { valid: false, error: 'Password must be at least 8 characters.' }
  if (!/[A-Z]/.test(pw)) return { valid: false, error: 'Include at least one uppercase letter.' }
  if (!/[0-9]/.test(pw)) return { valid: false, error: 'Include at least one number.' }
  return { valid: true, error: '' }
}

export function validateName(name = '') {
  const n = name.trim()
  if (!n)           return { valid: false, error: 'Name is required.' }
  if (n.length < 2) return { valid: false, error: 'Name is too short.' }
  if (n.length > 100) return { valid: false, error: 'Name is too long.' }
  if (/[<>{}]/.test(n)) return { valid: false, error: 'Name contains invalid characters.' }
  return { valid: true, error: '' }
}

export function validatePhone(phone = '') {
  const p = phone.replace(/[\s\-()]/g, '')
  if (!p)           return { valid: false, error: 'Phone number is required.' }
  if (!/^\+?[0-9]{7,15}$/.test(p)) return { valid: false, error: 'Enter a valid phone number (7–15 digits).' }
  return { valid: true, error: '' }
}

export function validateSessionTitle(title = '') {
  const t = title.trim()
  if (!t)            return { valid: false, error: 'Session title is required.' }
  if (t.length < 3)  return { valid: false, error: 'Title must be at least 3 characters.' }
  if (t.length > 120) return { valid: false, error: 'Title must be 120 characters or fewer.' }
  return { valid: true, error: '' }
}

export function validateExpiry(dateStr = '') {
  if (!dateStr) return { valid: false, error: 'Expiry date is required.' }
  const d = new Date(dateStr)
  if (isNaN(d.getTime()))  return { valid: false, error: 'Invalid date.' }
  if (d <= new Date())     return { valid: false, error: 'Expiry must be in the future.' }
  return { valid: true, error: '' }
}

export function validateUrl(url = '') {
  if (!url) return { valid: true, error: '' } // optional
  try {
    const u = new URL(url)
    if (!['http:', 'https:'].includes(u.protocol)) return { valid: false, error: 'URL must start with http:// or https://' }
    return { valid: true, error: '' }
  } catch {
    return { valid: false, error: 'Enter a valid URL.' }
  }
}

/** Run multiple validators, return first error found or null */
export function runValidators(checks = []) {
  for (const { result, field } of checks) {
    if (!result.valid) return { field, error: result.error }
  }
  return null
}
