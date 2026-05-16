/**
 * src/pages/dashboard/CreateSession.jsx
 */
import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Spinner         from '@/components/ui/Spinner'
import { useAuth }     from '@/context/AuthContext'
import { useToast }    from '@/context/ToastContext'
import { useSessions } from '@/hooks/useSessions'
import { validateSessionTitle, validateExpiry, validateUrl, runValidators } from '@/lib/validators'
import { sessionUrl }  from '@/lib/utils'
import { FileText, Clock, Link2, ChevronRight, Copy, CheckCheck, Calendar, AlignLeft } from 'lucide-react'

/* WhatsApp icon */
const WAIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#4ade80">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
)

/* Telegram icon */
const TGIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#60a5fa">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

function FormSection({ icon: Icon, title, children }) {
  return (
    <div style={{
      background: 'rgba(12,4,24,0.92)',
      border: '1px solid rgba(139,92,246,0.2)',
      borderRadius: 20, padding: '24px',
      marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7',
        }}>
          <Icon size={15} />
        </div>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, color: '#a855f7' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function CreateSession() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const toast       = useToast()
  const { createSession } = useSessions()

  const [form, setForm]     = useState({
    title: '', description: '', expiry_date: '',
    whatsapp_link: '', telegram_link: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoad]  = useState(false)
  const [created, setCreated] = useState(null) // { session_code, title }
  const [copied,  setCopied]  = useState(false)

  function upd(k) { return e => { setForm(f=>({...f,[k]:e.target.value})); setErrors(er=>({...er,[k]:''})) } }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = runValidators([
      { field: 'title',       result: validateSessionTitle(form.title) },
      { field: 'expiry_date', result: validateExpiry(form.expiry_date) },
      { field: 'whatsapp_link', result: validateUrl(form.whatsapp_link) },
      { field: 'telegram_link', result: validateUrl(form.telegram_link) },
    ])
    if (err) { setErrors({ [err.field]: err.error }); return }

    setLoad(true)
    const { data, error } = await createSession(form, user.id)
    setLoad(false)

    if (error) { toast({ message: `Error: ${error}`, type: 'error' }); return }
    setCreated({ session_code: data.session_code, title: data.title })
    toast({ message: 'Session created!', type: 'success' })
  }

  async function handleCopy() {
    if (!created) return
    await navigator.clipboard.writeText(sessionUrl(created.session_code))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── Success state ── */
  if (created) {
    const url = sessionUrl(created.session_code)
    return (
      <DashboardLayout>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', paddingTop: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 8 }}>
            Session Created!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
            Share this link with your audience so they can submit their contacts.
          </p>

          <div style={{
            background: 'rgba(12,4,24,0.9)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 16, padding: '20px 24px',
            marginBottom: 24,
          }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'left' }}>Public session link</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                readOnly value={url}
                className="input-field no-icon"
                style={{ fontSize: 13 }}
              />
              <button className="copy-pill" style={{ flexShrink: 0, whiteSpace: 'nowrap' }} onClick={handleCopy}>
                {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button className="btn btn-primary" onClick={() => navigate(`/dashboard/session/${created.session_code}`)}>
              View Session <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  /* ── Default: min expiry value = now+1min ── */
  const minExpiry = new Date(Date.now() + 60_000).toISOString().slice(0, 16)

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <button className="btn btn-ghost" style={{ marginBottom: 16 }} onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 28, color: '#fff', marginBottom: 4 }}>
            New VCF Session
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Set up a session to collect contacts from your audience.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Basic Info */}
          <FormSection icon={FileText} title="Session Details">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Session Title *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}>
                    <FileText size={14} />
                  </span>
                  <input type="text" placeholder="e.g. Lagos Tech Meetup Contacts"
                    value={form.title} onChange={upd('title')} className="input-field"
                    maxLength={120}
                  />
                </div>
                {errors.title && <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.title}</p>}
              </div>

              <div>
                <label className="label">Description (optional)</label>
                <div style={{ position: 'relative' }}>
                  <AlignLeft size={14} style={{ position:'absolute', left:14, top:14, color:'var(--text-muted)', pointerEvents:'none' }} />
                  <textarea
                    placeholder="Tell submitters what this session is about…"
                    value={form.description} onChange={upd('description')}
                    className="input-field"
                    style={{ paddingLeft: 40, minHeight: 90, resize: 'vertical' }}
                    maxLength={500}
                  />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Expiry */}
          <FormSection icon={Clock} title="Session Expiry">
            <div>
              <label className="label">Expiry Date & Time *</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={14} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} />
                <input
                  type="datetime-local"
                  value={form.expiry_date}
                  onChange={upd('expiry_date')}
                  min={minExpiry}
                  className="input-field"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              {errors.expiry_date
                ? <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.expiry_date}</p>
                : <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:5 }}>After this time, submissions will be locked and you can download the VCF file.</p>
              }
            </div>
          </FormSection>

          {/* Group Links */}
          <FormSection icon={Link2} title="Group Links (optional)">
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              After someone submits their contact, they'll be redirected to one of these links.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label" style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <WAIcon /> WhatsApp Group Link
                </label>
                <input type="url" placeholder="https://chat.whatsapp.com/…"
                  value={form.whatsapp_link} onChange={upd('whatsapp_link')}
                  className="input-field no-icon"
                />
                {errors.whatsapp_link && <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.whatsapp_link}</p>}
              </div>
              <div>
                <label className="label" style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <TGIcon /> Telegram Group Link
                </label>
                <input type="url" placeholder="https://t.me/…"
                  value={form.telegram_link} onChange={upd('telegram_link')}
                  className="input-field no-icon"
                />
                {errors.telegram_link && <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.telegram_link}</p>}
              </div>
            </div>
          </FormSection>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: 16, padding: '15px 24px' }}
          >
            {loading && <Spinner size={16} />}
            {loading ? 'Creating Session…' : 'Create VCF Session'}
            {!loading && <ChevronRight size={16} />}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
