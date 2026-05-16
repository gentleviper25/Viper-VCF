/**
 * src/pages/public/SessionSubmit.jsx
 * Public-facing page — no login required.
 * Viper VCF snake design, with submission form.
 */
import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import Spinner                 from '@/components/ui/Spinner'
import { LogoMark, ViperIcon } from '@/components/ui/ViperLogo'
import { useSessions }         from '@/hooks/useSessions'
import { useContacts }         from '@/hooks/useContacts'
import { validateName, validatePhone } from '@/lib/validators'
import { isExpired, timeLeft, checkSubmissionCooldown, recordSubmission } from '@/lib/utils'
import { User, Phone, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react'

/* WhatsApp green / Telegram blue redirect */
function RedirectButtons({ whatsapp, telegram }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer"
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)',
            borderRadius:14, padding:'13px 20px', color:'#4ade80',
            fontWeight:600, fontSize:14, fontFamily:'Inter,sans-serif',
            textDecoration:'none', transition:'all 0.2s',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(34,197,94,0.25)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(34,197,94,0.15)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#4ade80">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          Join WhatsApp Group
        </a>
      )}
      {telegram && (
        <a href={telegram} target="_blank" rel="noopener noreferrer"
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            background:'rgba(96,165,250,0.15)', border:'1px solid rgba(96,165,250,0.3)',
            borderRadius:14, padding:'13px 20px', color:'#60a5fa',
            fontWeight:600, fontSize:14, fontFamily:'Inter,sans-serif',
            textDecoration:'none', transition:'all 0.2s',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(96,165,250,0.25)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(96,165,250,0.15)'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#60a5fa">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Join Telegram Group
        </a>
      )}
    </div>
  )
}

export default function SessionSubmit() {
  const { code } = useParams()
  const { fetchPublicSession } = useSessions()
  const { submitContact }      = useContacts()

  const [session, setSession] = useState(null)
  const [status,  setStatus]  = useState('loading') // loading | open | expired | not_found | submitted | error
  const [form,    setForm]    = useState({ name: '', phone: '' })
  const [errors,  setErrors]  = useState({})
  const [submitting, setSub]  = useState(false)
  const [serverError, setSErr] = useState('')
  const [cooldownWait, setCW] = useState(0)

  useEffect(() => {
    async function load() {
      const { data, error } = await fetchPublicSession(code)
      if (error || !data) { setStatus('not_found'); return }
      setSession(data)
      setStatus(isExpired(data.expiry_date) ? 'expired' : 'open')
    }
    load()
  }, [code])

  /* Client-side rate-limit feedback */
  useEffect(() => {
    if (cooldownWait <= 0) return
    const t = setInterval(() => {
      setCW(w => { if (w <= 1) { clearInterval(t); return 0 } return w - 1 })
    }, 1000)
    return () => clearInterval(t)
  }, [cooldownWait])

  function upd(k) { return e => { setForm(f=>({...f,[k]:e.target.value})); setErrors(er=>({...er,[k]:''})); setSErr('') } }

  async function handleSubmit(e) {
    e.preventDefault()

    // Client-side validation
    const nameV  = validateName(form.name)
    const phoneV = validatePhone(form.phone)
    if (!nameV.valid)  { setErrors({ name:  nameV.error  }); return }
    if (!phoneV.valid) { setErrors({ phone: phoneV.error }); return }

    // Rate limit check
    const cd = checkSubmissionCooldown(code)
    if (!cd.allowed) { setCW(cd.wait); return }

    setSub(true); setSErr('')
    const { error } = await submitContact({
      name:          form.name,
      phone:         form.phone,
      sessionCode:   code,
      sessionExpiry: session.expiry_date,
      isActive:      session.is_active,
    })

    if (error) { setSErr(error); setSub(false); return }

    recordSubmission(code)
    setSub(false)
    setStatus('submitted')

    // Auto-redirect to group link (prefer WhatsApp)
    const redirect = session.whatsapp_link || session.telegram_link
    if (redirect) {
      setTimeout(() => { window.location.href = redirect }, 2000)
    }
  }

  /* ── Snake Background ── */
  const BG = () => (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden', background:'#000' }}>
      <div style={{ position:'absolute', top:'10%', left:'5%', width:500, height:500, background:'radial-gradient(ellipse,rgba(109,40,217,0.14) 0%,transparent 65%)', borderRadius:'50%' }}/>
      <div style={{ position:'absolute', bottom:'5%', right:'5%', width:400, height:400, background:'radial-gradient(ellipse,rgba(139,92,246,0.1) 0%,transparent 65%)', borderRadius:'50%' }}/>
      {/* Faint snake coil left */}
      <svg viewBox="0 0 300 700" fill="none" style={{ position:'absolute', left:0, top:0, height:'100%', width:'auto', opacity:0.35 }}>
        <path d="M-20 0 Q50 110 20 230 Q-5 340 60 430 Q130 530 70 640" stroke="url(#pbl)" strokeWidth="24" fill="none" strokeLinecap="round"/>
        <defs>
          <linearGradient id="pbl" x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b0764"/>
            <stop offset="60%" stopColor="#6d28d9" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )

  /* ── Navbar ── */
  const Nav = () => (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:10,
      height:60, display:'flex', alignItems:'center',
      padding:'0 20px',
      background:'rgba(0,0,0,0.7)', borderBottom:'1px solid rgba(139,92,246,0.1)',
      backdropFilter:'blur(16px)',
    }}>
      <LogoMark />
    </nav>
  )

  /* ── States ── */
  if (status === 'loading') return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
      <Spinner size={28} color="#8b5cf6" />
      <span style={{ color:'var(--text-muted)', fontFamily:'Inter,sans-serif' }}>Loading session…</span>
    </div>
  )

  if (status === 'not_found') return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, textAlign:'center', padding:24 }}>
      <BG /><Nav />
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
        <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:26, marginBottom:8 }}>Session Not Found</h2>
        <p style={{ color:'var(--text-muted)', fontSize:14 }}>This session link is invalid or has been deleted.</p>
      </div>
    </div>
  )

  if (status === 'expired') return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12, textAlign:'center', padding:24 }}>
      <BG /><Nav />
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ fontSize:52, marginBottom:12 }}>⏰</div>
        <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:26, marginBottom:8 }}>{session?.title}</h2>
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:20 }}>This session has expired and is no longer accepting submissions.</p>
        <div style={{
          display:'inline-flex', gap:8, alignItems:'center',
          background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
          borderRadius:100, padding:'6px 16px', color:'#f87171', fontSize:13,
        }}>
          <Clock size={13} /> Session ended
        </div>
      </div>
    </div>
  )

  if (status === 'submitted') return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:'80px 24px 24px', textAlign:'center' }}>
      <BG /><Nav />
      <div style={{ position:'relative', zIndex:1, maxWidth:420, width:'100%' }}>
        <CheckCircle size={56} style={{ color:'#4ade80', marginBottom:20 }} />
        <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:28, marginBottom:8, color:'#fff' }}>
          Contact Saved!
        </h2>
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:28 }}>
          Thank you <strong style={{ color:'#fff' }}>{form.name}</strong>! Your contact has been added to <strong style={{ color:'#a855f7' }}>{session?.title}</strong>.
        </p>

        {(session?.whatsapp_link || session?.telegram_link) && (
          <div style={{
            background:'rgba(12,4,24,0.9)', border:'1px solid rgba(139,92,246,0.25)',
            borderRadius:20, padding:'24px',
            marginBottom:16,
          }}>
            <p style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:15, marginBottom:16, color:'#fff' }}>
              You're being redirected…
            </p>
            <RedirectButtons whatsapp={session?.whatsapp_link} telegram={session?.telegram_link} />
          </div>
        )}
      </div>
    </div>
  )

  /* ── Main submission form ── */
  return (
    <div style={{ background:'#000', minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      <BG /><Nav />

      <div style={{
        position:'relative', zIndex:1,
        minHeight:'100vh',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'90px 20px 40px',
      }}>
        {/* Viper icon */}
        <div style={{ animation:'float 5s ease-in-out infinite', marginBottom:20 }}>
          <ViperIcon size={70} />
        </div>

        {/* Title */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <h1 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:'clamp(24px,5vw,36px)', color:'#fff', marginBottom:8 }}>
            {session?.title}
          </h1>
          {session?.description && (
            <p style={{ color:'var(--text-muted)', fontSize:14, maxWidth:380 }}>{session.description}</p>
          )}
          <div style={{
            display:'inline-flex', gap:7, alignItems:'center',
            background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)',
            borderRadius:100, padding:'5px 14px', marginTop:12,
            color:'#c4b5fd', fontSize:12, fontFamily:'Inter,sans-serif',
          }}>
            <Clock size={11} /> Closes in {timeLeft(session?.expiry_date)}
          </div>
        </div>

        {/* Card */}
        <div style={{
          width:'100%', maxWidth:440,
          background:'rgba(10,3,20,0.93)',
          border:'1px solid rgba(139,92,246,0.25)',
          borderRadius:22, padding:'28px 24px',
          backdropFilter:'blur(20px)',
          boxShadow:'0 24px 64px rgba(0,0,0,0.8)',
        }}>
          <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:16, color:'#a855f7', marginBottom:4 }}>
            Submit Your Contact
          </h2>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:22 }}>
            Enter your details below to join this group.
          </p>

          {serverError && (
            <div style={{
              display:'flex', gap:8, alignItems:'center',
              background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
              borderRadius:10, padding:'10px 14px', marginBottom:16,
              color:'#f87171', fontSize:13,
            }}>
              <AlertCircle size={14} style={{ flexShrink:0 }} />
              {serverError}
            </div>
          )}

          {cooldownWait > 0 && (
            <div style={{
              display:'flex', gap:8, alignItems:'center',
              background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)',
              borderRadius:10, padding:'10px 14px', marginBottom:16,
              color:'#fbbf24', fontSize:13,
            }}>
              <Clock size={14} style={{ flexShrink:0 }} />
              Please wait {cooldownWait}s before submitting again.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Name */}
            <div>
              <div style={{ position:'relative' }}>
                <User size={14} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
                <input
                  type="text" placeholder="Your Full Name"
                  value={form.name} onChange={upd('name')}
                  className="input-field"
                  autoComplete="name"
                  maxLength={100}
                />
              </div>
              {errors.name && <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <div style={{ position:'relative' }}>
                <Phone size={14} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
                <input
                  type="tel" placeholder="Phone Number (e.g. +234 800 000 0000)"
                  value={form.phone} onChange={upd('phone')}
                  className="input-field"
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.phone}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting || cooldownWait > 0}
              style={{
                marginTop:4, width:'100%',
                background: (submitting||cooldownWait>0) ? 'rgba(139,92,246,0.4)':'linear-gradient(135deg,#7c3aed,#a855f7)',
                border:'none', borderRadius:12, padding:'14px 24px',
                color:'#fff', fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif',
                cursor:(submitting||cooldownWait>0)?'not-allowed':'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow:'0 4px 20px rgba(139,92,246,0.35)',
                transition:'all 0.2s',
              }}
            >
              {submitting ? <Spinner size={16}/> : <Send size={16}/>}
              {submitting ? 'Submitting…' : 'Submit My Contact'}
            </button>
          </form>

          <p style={{ fontSize:11, color:'var(--text-faint)', textAlign:'center', marginTop:16, lineHeight:1.5 }}>
            By submitting, you agree your name and phone number will be shared with the session owner.
          </p>
        </div>

        {/* Powered by */}
        <div style={{ marginTop:24, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>Powered by</span>
          <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:13, color:'#a855f7' }}>Viper VCF</span>
        </div>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  )
}
