/**
 * src/pages/auth/Register.jsx
 * Matches the Viper VCF design image exactly:
 * - Pure black bg
 * - Real snake coil image on left
 * - "Viper VCF" nav with real logo
 * - "Create Your Account" heading, "Account" in purple
 * - Exact card layout with icon inputs
 * - Purple gradient CTA button
 * - Google OAuth row
 * - 4-feature strip + footer
 */
import { useState }          from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth }           from '@/context/AuthContext'
import { useToast }          from '@/context/ToastContext'
import { LogoMark }          from '@/components/ui/ViperLogo'
import Spinner               from '@/components/ui/Spinner'
import { validateEmail, validatePassword, validateName, runValidators } from '@/lib/validators'
import { Shield, Zap, Users, Download, User, Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

function FieldInput({ icon: Icon, rightIcon, type='text', placeholder, value, onChange, error, autoComplete }) {
  const [showPw, setShowPw] = useState(false)
  const isPass = type === 'password'
  return (
    <div>
      <div style={{ position:'relative' }}>
        {Icon && (
          <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none', display:'flex' }}>
            <Icon size={16}/>
          </span>
        )}
        <input
          type={isPass ? (showPw ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{
            width:'100%', background:'rgba(255,255,255,0.05)',
            border: error ? '1px solid rgba(248,113,113,0.6)' : '1px solid rgba(255,255,255,0.1)',
            borderRadius:12, padding:'15px 48px',
            fontSize:14, color:'#fff', fontFamily:'Inter,sans-serif',
            outline:'none', boxSizing:'border-box',
            transition:'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor='rgba(168,85,247,0.7)'; e.target.style.boxShadow='0 0 0 3px rgba(139,92,246,0.18)' }}
          onBlur={e  => { e.target.style.borderColor=error?'rgba(248,113,113,0.6)':'rgba(255,255,255,0.1)'; e.target.style.boxShadow='none' }}
        />
        {/* Right icon */}
        {isPass ? (
          <button type="button" onClick={()=>setShowPw(s=>!s)}
            style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', display:'flex', padding:0 }}>
            {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        ) : rightIcon ? (
          <span style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.25)', display:'flex' }}>
            {rightIcon}
          </span>
        ) : null}
      </div>
      {error && <p style={{ color:'#f87171', fontSize:12, marginTop:5, fontFamily:'Inter,sans-serif' }}>{error}</p>}
    </div>
  )
}

const FEATURES = [
  { icon: Shield,   title:'Secure & Private',   desc:'Your data is 100% secure with us' },
  { icon: Zap,      title:'Fast & Easy',         desc:'Create sessions in seconds' },
  { icon: Users,    title:'Unlimited Sessions',  desc:'Create unlimited VCF sessions' },
  { icon: Download, title:'Export VCF File',     desc:'Export all contacts in one click' },
]

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const toast    = useToast()

  const [form,    setForm]    = useState({ fullName:'', email:'', password:'', confirm:'' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [gLoad,   setGLoad]   = useState(false)
  const [success, setSuccess] = useState(false)

  function upd(k){ return e => { setForm(f=>({...f,[k]:e.target.value})); setErrors(er=>({...er,[k]:''})) } }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = runValidators([
      { field:'fullName', result: validateName(form.fullName) },
      { field:'email',    result: validateEmail(form.email)    },
      { field:'password', result: validatePassword(form.password) },
      { field:'confirm',  result: { valid: form.password===form.confirm, error:'Passwords do not match.' } },
    ])
    if (err) { setErrors({ [err.field]: err.error }); return }

    setLoading(true)
    try {
      const data = await signUp({ email:form.email, password:form.password, fullName:form.fullName })
      // If email confirmation is required, data.session will be null
      if (!data.session) {
        setSuccess(true) // Show "check your email" state
      } else {
        toast({ message:'Account created! Welcome to Viper VCF.', type:'success' })
        navigate('/dashboard')
      }
    } catch(ex) {
      toast({ message: ex.message, type:'error' })
    } finally { setLoading(false) }
  }

  async function handleGoogle() {
    setGLoad(true)
    try { await signInWithGoogle() }
    catch(ex) { toast({ message:ex.message, type:'error' }); setGLoad(false) }
  }

  /* ── Email confirmation screen ── */
  if (success) return (
    <div style={{ background:'#000', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ textAlign:'center', maxWidth:420 }}>
        <div style={{ fontSize:60, marginBottom:20 }}>📧</div>
        <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:28, color:'#fff', marginBottom:12 }}>Check Your Email</h2>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:15, lineHeight:1.6, marginBottom:28 }}>
          We sent a confirmation link to <strong style={{ color:'#a855f7' }}>{form.email}</strong>.<br/>
          Click it to activate your account, then come back to log in.
        </p>
        <button className="btn btn-primary" style={{ width:'100%', padding:'14px', fontSize:15 }} onClick={()=>navigate('/login')}>
          Go to Login
        </button>
        <p style={{ marginTop:16, fontSize:13, color:'rgba(255,255,255,0.3)' }}>
          Didn't get it? Check spam, or{' '}
          <span style={{ color:'#a855f7', cursor:'pointer' }} onClick={()=>setSuccess(false)}>try again</span>.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ background:'#000', minHeight:'100vh', position:'relative', overflow:'hidden' }}>

      {/* ── Snake coil background image (LEFT side, matches design exactly) ── */}
      <img
        src="/snake-bg.png"
        alt=""
        aria-hidden="true"
        style={{
          position:'fixed', left:0, top:0, height:'100%', width:'auto',
          maxWidth:'45%', objectFit:'cover', objectPosition:'right center',
          opacity:0.85, pointerEvents:'none', zIndex:0,
          maskImage:'linear-gradient(to right, black 60%, transparent 100%)',
          WebkitMaskImage:'linear-gradient(to right, black 60%, transparent 100%)',
        }}
      />

      {/* Purple glow behind snake */}
      <div style={{ position:'fixed', left:0, top:'30%', width:350, height:400, background:'radial-gradient(ellipse, rgba(120,40,220,0.25) 0%, transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

      {/* ── Navbar ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:66, display:'flex', alignItems:'center',
        padding:'0 40px',
        background:'rgba(0,0,0,0.5)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <LogoMark onClick={() => navigate('/')} />
        <div style={{ display:'flex', gap:32, marginLeft:48 }}>
          {['Home','Features','How it Works','Contact'].map(l=>(
            <span key={l} style={{ fontSize:14, color:'rgba(255,255,255,0.55)', cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:500, transition:'color 0.15s' }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.55)'}
              onClick={() => navigate('/')}>{l}</span>
          ))}
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginLeft:'auto',
            background:'transparent', border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:10, padding:'8px 20px',
            color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer',
            fontFamily:'Inter,sans-serif', transition:'border-color 0.2s',
          }}
          onMouseEnter={e=>e.target.style.borderColor='rgba(168,85,247,0.6)'}
          onMouseLeave={e=>e.target.style.borderColor='rgba(255,255,255,0.2)'}
        >Login</button>
      </nav>

      {/* ── Main content ── */}
      <div style={{
        position:'relative', zIndex:1,
        minHeight:'100vh',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'86px 24px 24px',
      }}>
        {/* Join pill */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.35)',
          borderRadius:100, padding:'7px 18px', marginBottom:20,
          fontSize:13, color:'rgba(255,255,255,0.75)', fontFamily:'Inter,sans-serif',
        }}>
          <User size={13} style={{ color:'#a855f7' }}/>
          Join Viper VCF
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily:'Outfit,sans-serif', fontWeight:900,
          fontSize:'clamp(38px,6vw,60px)', lineHeight:1.05,
          color:'#fff', textAlign:'center', marginBottom:12, letterSpacing:'-1px',
        }}>
          Create Your<br/>
          <span style={{ background:'linear-gradient(90deg,#9333ea,#a855f7,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Account
          </span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, textAlign:'center', marginBottom:28, maxWidth:380, lineHeight:1.6 }}>
          Create your account to start your VCF sessions and connect with the world.
        </p>

        {/* ── Card ── */}
        <div style={{
          width:'100%', maxWidth:500,
          background:'rgba(16,8,30,0.88)',
          border:'1px solid rgba(139,92,246,0.28)',
          borderRadius:20, padding:'28px 28px',
          backdropFilter:'blur(24px)',
          boxShadow:'0 24px 80px rgba(0,0,0,0.85)',
        }}>
          {/* Card header */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
            <div style={{
              width:42, height:42, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.35)', color:'#a855f7',
            }}>
              <User size={18}/>
            </div>
            <div>
              <p style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:15, color:'#a855f7', marginBottom:2 }}>Account Details</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'Inter,sans-serif' }}>Fill in your information to get started</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <FieldInput
              icon={User} type="text" placeholder="Full Name"
              value={form.fullName} onChange={upd('fullName')}
              error={errors.fullName} autoComplete="name"
              rightIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h5"/></svg>}
            />
            <FieldInput
              icon={Mail} type="email" placeholder="Email Address"
              value={form.email} onChange={upd('email')}
              error={errors.email} autoComplete="email"
            />
            <FieldInput
              icon={Lock} type="password" placeholder="Password"
              value={form.password} onChange={upd('password')}
              error={errors.password} autoComplete="new-password"
            />
            <FieldInput
              icon={Lock} type="password" placeholder="Confirm Password"
              value={form.confirm} onChange={upd('confirm')}
              error={errors.confirm} autoComplete="new-password"
            />

            {/* Create Account button */}
            <button
              type="submit" disabled={loading}
              style={{
                marginTop:6, width:'100%',
                background: loading ? 'rgba(139,92,246,0.5)' : 'linear-gradient(90deg,#7c3aed,#9333ea,#a855f7)',
                border:'none', borderRadius:12, padding:'15px 24px',
                color:'#fff', fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                boxShadow: loading ? 'none' : '0 4px 24px rgba(139,92,246,0.45)',
                transition:'all 0.2s', letterSpacing:'0.2px',
              }}
            >
              {loading ? <Spinner size={16}/> : null}
              {loading ? 'Creating Account…' : 'Create Account'}
              {!loading && <ChevronRight size={18}/>}
            </button>

            {/* OR divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'4px 0' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }}/>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontFamily:'Inter,sans-serif', fontWeight:500 }}>OR</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }}/>
            </div>

            {/* Google */}
            <button
              type="button" onClick={handleGoogle} disabled={gLoad}
              style={{
                width:'100%', background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.1)', borderRadius:12,
                padding:'14px 24px', color:'#fff', fontSize:14,
                fontWeight:500, fontFamily:'Inter,sans-serif',
                cursor: gLoad ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                transition:'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.2)' }}
              onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)' }}
            >
              {gLoad ? <Spinner size={16}/> : <GoogleIcon/>}
              Continue with Google
            </button>

            <p style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4, fontFamily:'Inter,sans-serif' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#a855f7', fontWeight:600, textDecoration:'none' }}>Login</Link>
            </p>
          </form>
        </div>

        {/* ── Feature strip ── */}
        <div style={{
          width:'100%', maxWidth:680, marginTop:24,
          background:'rgba(16,8,30,0.7)',
          border:'1px solid rgba(139,92,246,0.18)',
          borderRadius:16, padding:'18px 24px',
          display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',
          gap:16, backdropFilter:'blur(12px)',
        }}>
          {FEATURES.map(({ icon:Icon, title, desc }) => (
            <div key={title} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a855f7', flexShrink:0 }}>
                <Icon size={14}/>
              </div>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:'#a855f7', fontFamily:'Outfit,sans-serif', marginBottom:2 }}>{title}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontFamily:'Inter,sans-serif', lineHeight:1.4 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop:20, textAlign:'center' }}>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)', marginBottom:8, fontFamily:'Inter,sans-serif' }}>
            © 2024 Viper VCF. All rights reserved.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
            {['Privacy Policy','Terms of Service','Support'].map(l=>(
              <span key={l} style={{ fontSize:12, color:'rgba(255,255,255,0.3)', cursor:'pointer', fontFamily:'Inter,sans-serif' }}
                onMouseEnter={e=>e.target.style.color='#a855f7'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.3)'}
              >{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
