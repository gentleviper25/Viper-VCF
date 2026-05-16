/**
 * src/lib/vcf.js
 * Generates RFC 6350 compliant VCard 3.0 / 4.0 files.
 */

/**
 * Escape special characters per RFC 6350.
 */
function escapeVCard(str = '') {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/,/g,  '\\,')
    .replace(/;/g,  '\\;')
    .replace(/\n/g, '\\n')
}

/**
 * Fold long lines to 75 chars per RFC 5322 / RFC 6350.
 */
function fold(line = '') {
  const max = 75
  if (line.length <= max) return line
  let out = ''
  while (line.length > max) {
    out  += line.slice(0, max) + '\r\n '
    line  = line.slice(max)
  }
  return out + line
}

/**
 * Build a single vCard entry from a contact object.
 * @param {{ name: string, phone: string, session_title?: string, created_at?: string }} contact
 */
export function buildVCard(contact) {
  const nameParts  = escapeVCard(contact.name.trim()).split(' ')
  const firstName  = nameParts[0]
  const lastName   = nameParts.slice(1).join(' ')
  const phone      = contact.phone.replace(/[^0-9+\-\s()]/g, '')
  const now        = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const createdAt  = contact.created_at
    ? new Date(contact.created_at).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    : now

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    fold(`FN:${escapeVCard(contact.name.trim())}`),
    fold(`N:${lastName};${firstName};;;`),
    fold(`TEL;TYPE=CELL,VOICE:${phone}`),
    contact.session_title
      ? fold(`NOTE:Collected via Viper VCF — Session: ${escapeVCard(contact.session_title)}`)
      : 'NOTE:Collected via Viper VCF',
    `REV:${createdAt}`,
    'END:VCARD',
  ]

  return lines.join('\r\n')
}

/**
 * Build a complete .vcf file string from an array of contacts.
 * @param {Array} contacts
 * @param {string} sessionTitle
 */
export function buildVCFFile(contacts, sessionTitle = 'Session') {
  if (!contacts || contacts.length === 0) return ''
  return contacts
    .map(c => buildVCard({ ...c, session_title: sessionTitle }))
    .join('\r\n')
}

/**
 * Trigger browser download of a .vcf file.
 * @param {Array} contacts
 * @param {string} sessionTitle
 */
export function downloadVCF(contacts, sessionTitle = 'contacts') {
  const content  = buildVCFFile(contacts, sessionTitle)
  const blob     = new Blob([content], { type: 'text/vcard;charset=utf-8;' })
  const url      = URL.createObjectURL(blob)
  const filename = `${sessionTitle.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/\s+/g, '_')}_contacts.vcf`

  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return filename
}
