/**
 * src/components/shared/SessionCard.jsx
 */
import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast }    from '@/context/ToastContext'
import { isExpired, timeLeft, sessionUrl, copyToClipboard } from '@/lib/utils'
import {
  Copy, Download, ExternalLink, Users, Clock,
  Trash2, Eye, CheckCheck,
} from 'lucide-react'

export default function SessionCard({ session, onDelete }) {
  const navigate            = useNavigate()
  const toast               = useToast()
  const [copied, setCopied] = useState(false)

  const expired = isExpired(session.expiry_date)
  const count   = session.contacts?.[0]?.count ?? 0
  const url     = sessionUrl(session.session_code)

  async function handleCopy() {
    await copyToClipboard(url)
    setCopied(true)
    toast({ message: 'Session link copied!', type: 'success' })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg,#4c1d95,#7c3aed)',
          border: '1px solid rgba(139,92,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 11,
          color: '#e9d5ff', letterSpacing: 0.5,
        }}>
          VCF
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200,
            }}>
              {session.title}
            </h3>
            <span className={`badge ${expired ? 'badge-expired' : 'badge-active'}`}>
              <span className={`dot ${expired ? 'dot-expired' : 'dot-active'}`} />
              {expired ? 'Expired' : 'Active'}
            </span>
          </div>
          {session.description && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
              {session.description.length > 70 ? session.description.slice(0, 70) + '…' : session.description}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div className="card-sm" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
            <Users size={13} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Contacts</span>
          </div>
          <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 22, color: '#fff' }}>{count}</p>
        </div>
        <div className="card-sm" style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
            <Clock size={13} style={{ color: expired ? '#f87171' : '#a855f7' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              {expired ? 'Expired' : 'Time Left'}
            </span>
          </div>
          <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 14, color: expired ? '#f87171' : '#fff' }}>
            {timeLeft(session.expiry_date)}
          </p>
        </div>
      </div>

      {/* Link row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(139,92,246,0.06)',
        border: '1px solid rgba(139,92,246,0.15)',
        borderRadius: 10, padding: '8px 12px', marginBottom: 16,
      }}>
        <ExternalLink size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {url}
        </span>
        <button className="copy-pill" onClick={handleCopy}>
          {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ flex: 1, border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={() => navigate(`/dashboard/session/${session.session_code}`)}
        >
          <Eye size={13} /> View
        </button>

        {expired && count > 0 && (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={() => navigate(`/dashboard/session/${session.session_code}?download=1`)}
          >
            <Download size={13} /> Download VCF
          </button>
        )}

        <button className="btn-danger btn-sm" onClick={() => onDelete(session)} style={{ flexShrink: 0, display:'flex', alignItems:'center', padding:'8px 10px', borderRadius:8 }}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
