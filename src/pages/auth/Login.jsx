/**
 * src/pages/auth/Login.jsx
 */
import { useState }     from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth }      from '@/context/AuthContext'
import { useToast }     from '@/context/ToastContext'
import Navbar           from '@/components/layout/Navbar'
import Spinner          from '@/components/ui/Spinner'
import { validateEmail } from '@/lib/validators'
import { LogIn, Mail, Lock, ChevronRight } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const toast     = useToast()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [form, setForm]   = useState({ email: '', password: '' })
  const [errors, setErr]  = useState({})
  const [loading, setL]   = useState(false)
  const [gLoad,   setGL]  = useState(false)

  function upd(k) { return e => { setForm(f=>({...f,[k]:e.target.value})); setErr(er=>({...er,[k]:''})) } }

  async function handleSubmit(e) {
    e.preventDefault()
    const emailV = validateEmail(form.email)
    if (!emailV.valid) { setErr({ email: emailV.error }); return }
    if (!form.password) { setErr({ password: 'Password is required.' }); return }

    setL(true)
    try {
      await signIn({ email: form.email, password: form.password })
      toast({ message: 'Welcome back!', type: 'success' })
      navigate(from, { replace: true })
    } catch (ex) {
      toast({ message: ex.message || 'Login failed. Check your credentials.', type: 'error' })
    } finally { setL(false) }
  }

  async function handleGoogle() {
    setGL(true)
    try { await signInWithGoogle() }
    catch (ex) { toast({ message: ex.message || 'Google sign-in failed.', type: 'error' }); setGL(false) }
  }

  const SnakeBg = () => (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <svg viewBox="0 0 400 900" fill="none" style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: 'auto', opacity: 0.55 }}>
        <path d="M-20 0 Q60 130 30 280 Q0 420 80 530 Q160 640 90 760 Q40 840 100 940"
          stroke="url(#sLL)" strokeWidth="32" fill="none" strokeLinecap="round"/>
        <circle cx="60" cy="180" r="8" fill="#d946ef" opacity="0.8" filter="url(#eg2)"/>
        <circle cx="60" cy="180" r="4" fill="#f0abfc"/>
        <ellipse cx="90" cy="880" rx="70" ry="22" fill="#7c3aed" opacity="0.2" filter="url(#smk2)"/>
        <defs>
          <linearGradient id="sLL" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2e1065"/>
            <stop offset="40%" stopColor="#6d28d9" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1"/>
          </linearGradient>
          <filter id="eg2"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="smk2"><feGaussianBlur stdDeviation="14"/></filter>
        </defs>
      </svg>
      <div style={{ position:'absolute', top:'20%', right:'15%', width:400, height:400, background:'radial-gradient(ellipse,rgba(109,40,217,0.15) 0%,transparent 65%)', borderRadius:'50%' }} />
    </div>
  )

  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <SnakeBg />
      <Navbar />

      <div style={{
        position:'relative', zIndex:1,
        minHeight:'100vh',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'100px 24px 48px',
      }}>
        {/* Heading */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.3)',
            borderRadius:100, padding:'6px 16px', marginBottom:20,
            fontSize:13, color:'#c4b5fd', fontFamily:'Inter,sans-serif',
          }}>
            <LogIn size={13} style={{ color:'#a855f7' }} />
            Welcome back
          </div>
          <h1 style={{
            fontFamily:'Outfit,sans-serif', fontWeight:900,
            fontSize:'clamp(36px,6vw,56px)', lineHeight:1.1, color:'#fff',
          }}>
            Sign Into Your
            <br/>
            <span style={{ background:'linear-gradient(90deg,#a855f7,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Account
            </span>
          </h1>
          <p style={{ fontSize:14, color:'var(--text-muted)', marginTop:10 }}>
            Sign in to manage your VCF sessions and contacts.
          </p>
        </div>

        {/* Card */}
        <div style={{
          width:'100%', maxWidth:460,
          background:'rgba(12,4,24,0.92)',
          border:'1px solid rgba(139,92,246,0.25)',
          borderRadius:24, padding:'32px 28px',
          backdropFilter:'blur(20px)',
          boxShadow:'0 24px 80px rgba(0,0,0,0.8)',
        }}>
          {/* Icon header */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
            <div style={{
              width:40, height:40, borderRadius:10,
              background:'rgba(139,92,246,0.15)',
              border:'1px solid rgba(139,92,246,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#a855f7',
            }}>
              <LogIn size={18} />
            </div>
            <div>
              <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:16, color:'#a855f7' }}>
                Login Details
              </h2>
              <p style={{ fontSize:12, color:'var(--text-muted)' }}>Enter your credentials to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Email */}
            <div>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}>
                  <Mail size={15} />
                </span>
                <input
                  type="email" placeholder="Email Address"
                  value={form.email} onChange={upd('email')}
                  className="input-field" autoComplete="email"
                />
              </div>
              {errors.email && <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}>
                  <Lock size={15} />
                </span>
                <input
                  type="password" placeholder="Password"
                  value={form.password} onChange={upd('password')}
                  className="input-field has-right" autoComplete="current-password"
                />
              </div>
              {errors.password && <p style={{ color:'#f87171', fontSize:12, marginTop:4 }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                marginTop:4, width:'100%',
                background: loading ? 'rgba(139,92,246,0.5)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                border:'none', borderRadius:12, padding:'15px 24px',
                color:'#fff', fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow:'0 4px 20px rgba(139,92,246,0.4)',
                transition:'all 0.2s',
              }}
            >
              {loading && <Spinner size={16} />}
              {loading ? 'Signing in…' : 'Login'}
              {!loading && <ChevronRight size={16} />}
            </button>

            <div className="divider" style={{ margin:'4px 0' }}>OR</div>

            <button
              type="button" onClick={handleGoogle} disabled={gLoad}
              style={{
                width:'100%',
                background:'rgba(13,5,22,0.8)',
                border:'1px solid rgba(139,92,246,0.2)',
                borderRadius:12, padding:'13px 24px',
                color:'#fff', fontSize:14, fontWeight:500, fontFamily:'Inter,sans-serif',
                cursor: gLoad ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                transition:'all 0.2s',
              }}
            >
              {gLoad ? <Spinner size={16}/> : <GoogleIcon />}
              Continue with Google
            </button>

            <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)', marginTop:4 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#a855f7', fontWeight:600 }}>Sign Up</Link>
            </p>
          </form>
        </div>

        <div style={{ marginTop:24, display:'flex', gap:20 }}>
          {['Privacy Policy','Terms of Service','Support'].map(l=>(
            <span key={l} style={{ fontSize:12, color:'var(--text-muted)', cursor:'pointer' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
