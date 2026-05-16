/**
 * src/pages/auth/Register.jsx
 * Matches the Viper VCF design reference: black bg, snake coil left,
 * purple card, gradient button, Google OAuth row.
 */
import { useState }     from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth }      from '@/context/AuthContext'
import { useToast }     from '@/context/ToastContext'
import Navbar           from '@/components/layout/Navbar'
import { LogoMark, ViperIcon } from '@/components/ui/ViperLogo'
import Spinner          from '@/components/ui/Spinner'
import {
  validateEmail, validatePassword, validateName, runValidators,
} from '@/lib/validators'
import { User, Mail, Lock, ChevronRight } from 'lucide-react'

/* Google icon */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const toast    = useToast()

  const [form, setForm]     = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading]   = useState(false)
  const [gLoading, setGLoading] = useState(false)

  function update(field) {
    return e => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = runValidators([
      { field: 'fullName',  result: validateName(form.fullName) },
      { field: 'email',     result: validateEmail(form.email) },
      { field: 'password',  result: validatePassword(form.password) },
      { field: 'confirm',   result: { valid: form.password === form.confirm, error: 'Passwords do not match.' } },
    ])
    if (err) { setErrors({ [err.field]: err.error }); return }

    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, fullName: form.fullName })
      toast({ message: 'Account created! Check your email to confirm.', type: 'success' })
      navigate('/dashboard')
    } catch (ex) {
      toast({ message: ex.message || 'Registration failed.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGLoading(true)
    try { await signInWithGoogle() }
    catch (ex) { toast({ message: ex.message || 'Google sign-in failed.', type: 'error' }); setGLoading(false) }
  }

  /* ── Snake background (left coil from reference image) ── */
  const SnakeLeft = () => (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '38%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <svg viewBox="0 0 400 900" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M-20 0 Q60 130 30 280 Q0 420 80 530 Q160 640 90 760 Q40 840 100 940"
          stroke="url(#sL)" strokeWidth="32" fill="none" strokeLinecap="round"/>
        <path d="M-10 0 Q65 140 35 290 Q5 430 85 540 Q165 650 95 770"
          stroke="url(#sL2)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.45"/>
        {/* Eye glow */}
        <circle cx="60" cy="180" r="8" fill="#d946ef" opacity="0.8" filter="url(#eg)"/>
        <circle cx="60" cy="180" r="4" fill="#f0abfc"/>
        {/* Bottom smoke */}
        <ellipse cx="90" cy="880" rx="70" ry="22" fill="#7c3aed" opacity="0.22" filter="url(#smk)"/>
        <ellipse cx="140" cy="860" rx="40" ry="16" fill="#a855f7" opacity="0.16" filter="url(#smk)"/>
        <defs>
          <linearGradient id="sL" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#2e1065" />
            <stop offset="40%"  stopColor="#6d28d9" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="sL2" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </linearGradient>
          <filter id="eg"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="smk"><feGaussianBlur stdDeviation="14"/></filter>
        </defs>
      </svg>
    </div>
  )

  const SnakeRight = () => (
    <div style={{ position: 'fixed', right: 0, bottom: 0, width: '28%', height: '55%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <svg viewBox="0 0 300 550" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M330 550 Q260 460 290 350 Q320 240 270 130"
          stroke="url(#sR)" strokeWidth="22" fill="none" strokeLinecap="round"/>
        <path d="M320 550 Q250 460 280 350 Q310 240 260 130"
          stroke="#a855f7" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.3"/>
        <ellipse cx="130" cy="530" rx="80" ry="28" fill="#7c3aed" opacity="0.18" filter="url(#smkR)"/>
        <defs>
          <linearGradient id="sR" x1="0" y1="550" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </linearGradient>
          <filter id="smkR"><feGaussianBlur stdDeviation="16"/></filter>
        </defs>
      </svg>
    </div>
  )

  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <SnakeLeft />
      <SnakeRight />
      <Navbar />

      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 48px',
      }}>
        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          {/* "Join Viper VCF" pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            fontSize: 13, color: '#c4b5fd', fontFamily: 'Inter,sans-serif',
          }}>
            <User size={13} style={{ color: '#a855f7' }} />
            Join Viper VCF
          </div>

          <h1 style={{
            fontFamily: 'Outfit,sans-serif', fontWeight: 900,
            fontSize: 'clamp(36px,6vw,58px)', lineHeight: 1.1, color: '#fff',
          }}>
            Create Your
            <br />
            <span style={{
              background: 'linear-gradient(90deg,#a855f7,#c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Account</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 10, maxWidth: 360 }}>
            Create your account to start your VCF sessions and connect with the world.
          </p>
        </div>

        {/* Card */}
        <div style={{
          width: '100%', maxWidth: 480,
          background: 'rgba(12,4,24,0.92)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: 24,
          padding: '32px 28px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.08)',
        }}>
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#a855f7',
            }}>
              <User size={18} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#a855f7' }}>
                Account Details
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Fill in your information to get started</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Full Name */}
            <div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <User size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={update('fullName')}
                  className="input-field"
                  style={{ paddingRight: 44 }}
                  autoComplete="name"
                />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h8M8 16h5"/>
                  </svg>
                </span>
              </div>
              {errors.fullName && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={update('email')}
                  className="input-field"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Lock size={15} />
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={update('password')}
                  className="input-field has-right"
                  autoComplete="new-password"
                />
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <Lock size={15} />
                </span>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={update('confirm')}
                  className="input-field has-right"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirm && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.confirm}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                width: '100%',
                background: loading ? 'rgba(139,92,246,0.5)' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
                border: 'none',
                borderRadius: 12,
                padding: '15px 24px',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'Inter,sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
              }}
            >
              {loading ? <Spinner size={16} /> : null}
              {loading ? 'Creating Account…' : 'Create Account'}
              {!loading && <ChevronRight size={16} />}
            </button>

            {/* Divider */}
            <div className="divider" style={{ margin: '4px 0' }}>OR</div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={gLoading}
              style={{
                width: '100%',
                background: 'rgba(13,5,22,0.8)',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 12,
                padding: '13px 24px',
                color: '#fff',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'Inter,sans-serif',
                cursor: gLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.2s',
              }}
            >
              {gLoading ? <Spinner size={16} /> : <GoogleIcon />}
              Continue with Google
            </button>

            {/* Login link */}
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#a855f7', fontWeight: 600 }}>Login</Link>
            </p>
          </form>
        </div>

        {/* Footer strip */}
        <div style={{ marginTop: 24, display: 'flex', gap: 20 }}>
          {['Privacy Policy','Terms of Service','Support'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
