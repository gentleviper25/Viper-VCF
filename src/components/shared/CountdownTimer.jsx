/**
 * src/components/shared/CountdownTimer.jsx
 * Displays a live D / H / M / S countdown for a session expiry.
 */
import { useCountdown } from '@/hooks/useCountdown'

function Block({ value, label }) {
  const v = String(value).padStart(2, '0')
  return (
    <div style={{ textAlign: 'center', minWidth: 52 }}>
      <div style={{
        background: 'rgba(139,92,246,0.12)',
        border: '1px solid rgba(139,92,246,0.25)',
        borderRadius: 10,
        padding: '8px 6px',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 800,
        fontSize: 22,
        color: '#fff',
        letterSpacing: 1,
        lineHeight: 1,
        minWidth: 52,
      }}>
        {v}
      </div>
      <p style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 5,
        fontFamily: 'Inter, sans-serif',
      }}>
        {label}
      </p>
    </div>
  )
}

function Colon() {
  return (
    <span style={{
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 800,
      fontSize: 20,
      color: 'rgba(139,92,246,0.6)',
      alignSelf: 'flex-start',
      paddingTop: 6,
    }}>:</span>
  )
}

export default function CountdownTimer({ expiryDate, compact = false }) {
  const { expired, d, h, m, s } = useCountdown(expiryDate)

  if (expired) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(239,68,68,0.10)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 10, padding: '6px 14px',
        color: '#f87171', fontSize: 13, fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f87171', flexShrink: 0 }} />
        Session Expired
      </div>
    )
  }

  if (compact) {
    const parts = []
    if (d > 0) parts.push(`${d}d`)
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    parts.push(`${String(s).padStart(2,'0')}s`)
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(139,92,246,0.10)',
        border: '1px solid rgba(139,92,246,0.22)',
        borderRadius: 10, padding: '5px 12px',
        color: '#c4b5fd', fontSize: 13, fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a855f7', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        {parts.join(' ')} left
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      {d > 0 && <><Block value={d} label="Days" /><Colon /></>}
      <Block value={h} label="Hrs" />
      <Colon />
      <Block value={m} label="Min" />
      <Colon />
      <Block value={s} label="Sec" />
    </div>
  )
}
