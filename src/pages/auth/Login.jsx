/**
 * src/pages/auth/Login.jsx — matches Viper VCF design
 */
import { useState }          from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth }           from '@/context/AuthContext'
import { useToast }          from '@/context/ToastContext'
import { LogoMark }          from '@/components/ui/ViperLogo'
import Spinner               from '@/components/ui/Spinner'
import { validateEmail }     from '@/lib/validators'
import { LogIn, Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

function FieldInput({ icon:Icon, type='text', placeholder, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPass = type === 'password'
  return (
    <div>
      <div style={{ position:'relative' }}>
        {Icon && <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)', pointerEvents:'none', display:'flex' }}><Icon size={16}/></span>}
        <input
          type={isPass?(show?'text':'password'):type}
          placeholder={placeholder} value={value} onChange={onChange}
          autoComplete={autoComplete}
          style={{
            width:'100%', background:'rgba(255,255,255,0.05)',
            border: error?'1px solid rgba(248,113,113,0.6)':'1px solid rgba(255,255,255,0.1)',
            borderRadius:12, padding:'15px 48px', fontSize:14,
            color:'#fff', fontFamily:'Inter,sans-serif', outline:'none',
            boxSizing:'border-box', transition:'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e=>{e.target.style.borderColor='rgba(168,85,247,0.7)';e.target.style.boxShadow='0 0 0 3px rgba(139,92,246,0.18)'}}
          onBlur={e=>{e.target.style.borderColor=error?'rgba(248,113,113,0.6)':'rgba(255,255,255,0.1)';e.target.style.boxShadow='none'}}
        />
        {isPass && (
          <button type="button" onClick={()=>setShow(s=>!s)}
            style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', display:'flex', padding:0 }}>
            {show?<EyeOff size={16}/>:<Eye size={16}/>}
          </button>
        )}
      </div>
      {error && <p style={{ color:'#f87171', fontSize:12, marginTop:5, fontFamily:'Inter,sans-serif' }}>{error}</p>}
    </div>
  )
}

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const toast     = useToast()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [form,   setForm]   = useState({ email:'', password:'' })
  const [errors, setErrors] = useState({})
  const [load,   setLoad]   = useState(false)
  const [gLoad,  setGLoad]  = useState(false)

  function upd(k){ return e=>{ setForm(f=>({...f,[k]:e.target.value})); setErrors(er=>({...er,[k]:''})) } }

  async function handleSubmit(e) {
    e.preventDefault()
    const ev = validateEmail(form.email)
    if (!ev.valid) { setErrors({ email:ev.error }); return }
    if (!form.password) { setErrors({ password:'Password is required.' }); return }

    setLoad(true)
    try {
      await signIn({ email:form.email, password:form.password })
      toast({ message:'Welcome back!', type:'success' })
      navigate(from, { replace:true })
    } catch(ex) {
      toast({ message:ex.message, type:'error' })
    } finally { setLoad(false) }
  }

  async function handleGoogle() {
    setGLoad(true)
    try { await signInWithGoogle() }
    catch(ex){ toast({ message:ex.message, type:'error' }); setGLoad(false) }
  }

  return (
    <div style={{ background:'#000', minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      {/* Snake bg */}
      <img src="/snake-bg.png" alt="" aria-hidden="true" style={{
        position:'fixed', left:0, top:0, height:'100%', width:'auto', maxWidth:'45%',
        objectFit:'cover', objectPosition:'right center', opacity:0.85,
        pointerEvents:'none', zIndex:0,
        maskImage:'linear-gradient(to right, black 60%, transparent 100%)',
        WebkitMaskImage:'linear-gradient(to right, black 60%, transparent 100%)',
      }}/>
      <div style={{ position:'fixed', left:0, top:'30%', width:350, height:400, background:'radial-gradient(ellipse,rgba(120,40,220,0.25) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

      {/* Navbar */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:66, display:'flex', alignItems:'center', padding:'0 40px',
        background:'rgba(0,0,0,0.5)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <LogoMark onClick={()=>navigate('/')}/>
        <div style={{ display:'flex', gap:32, marginLeft:48 }}>
          {['Home','Features','How it Works','Contact'].map(l=>(
            <span key={l} style={{ fontSize:14, color:'rgba(255,255,255,0.55)', cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:500 }}
              onClick={()=>navigate('/')}>{l}</span>
          ))}
        </div>
        <button
          onClick={()=>navigate('/login')}
          style={{ marginLeft:'auto', background:'transparent', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 20px', color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif' }}
        >Login</button>
      </nav>

      {/* Content */}
      <div style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'86px 24px 40px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.35)', borderRadius:100, padding:'7px 18px', marginBottom:20, fontSize:13, color:'rgba(255,255,255,0.75)', fontFamily:'Inter,sans-serif' }}>
          <LogIn size={13} style={{ color:'#a855f7' }}/> Welcome back
        </div>

        <h1 style={{ fontFamily:'Outfit,sans-serif', fontWeight:900, fontSize:'clamp(36px,6vw,58px)', lineHeight:1.05, color:'#fff', textAlign:'center', marginBottom:12, letterSpacing:'-1px' }}>
          Sign Into Your<br/>
          <span style={{ background:'linear-gradient(90deg,#9333ea,#a855f7,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Account</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, textAlign:'center', marginBottom:28, fontFamily:'Inter,sans-serif' }}>
          Sign in to manage your VCF sessions and contacts.
        </p>

        <div style={{ width:'100%', maxWidth:500, background:'rgba(16,8,30,0.88)', border:'1px solid rgba(139,92,246,0.28)', borderRadius:20, padding:'28px', backdropFilter:'blur(24px)', boxShadow:'0 24px 80px rgba(0,0,0,0.85)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
            <div style={{ width:42, height:42, borderRadius:10, background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.35)', display:'flex', alignItems:'center', justifyContent:'center', color:'#a855f7' }}>
              <LogIn size={18}/>
            </div>
            <div>
              <p style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:15, color:'#a855f7', marginBottom:2 }}>Login Details</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'Inter,sans-serif' }}>Enter your credentials to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <FieldInput icon={Mail} type="email" placeholder="Email Address" value={form.email} onChange={upd('email')} error={errors.email} autoComplete="email"/>
            <FieldInput icon={Lock} type="password" placeholder="Password" value={form.password} onChange={upd('password')} error={errors.password} autoComplete="current-password"/>

            <button type="submit" disabled={load} style={{
              marginTop:6, width:'100%',
              background: load?'rgba(139,92,246,0.5)':'linear-gradient(90deg,#7c3aed,#9333ea,#a855f7)',
              border:'none', borderRadius:12, padding:'15px 24px',
              color:'#fff', fontSize:15, fontWeight:700, fontFamily:'Inter,sans-serif',
              cursor:load?'not-allowed':'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow:load?'none':'0 4px 24px rgba(139,92,246,0.45)', transition:'all 0.2s',
            }}>
              {load&&<Spinner size={16}/>}
              {load?'Signing in…':'Login'}
              {!load&&<ChevronRight size={18}/>}
            </button>

            <div style={{ display:'flex', alignItems:'center', gap:12, margin:'4px 0' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }}/>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontFamily:'Inter,sans-serif' }}>OR</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }}/>
            </div>

            <button type="button" onClick={handleGoogle} disabled={gLoad} style={{
              width:'100%', background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.1)', borderRadius:12,
              padding:'14px 24px', color:'#fff', fontSize:14, fontWeight:500,
              fontFamily:'Inter,sans-serif', cursor:gLoad?'not-allowed':'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all 0.2s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
            >
              {gLoad?<Spinner size={16}/>:<GoogleIcon/>}
              Continue with Google
            </button>

            <p style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4, fontFamily:'Inter,sans-serif' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#a855f7', fontWeight:600, textDecoration:'none' }}>Sign Up</Link>
            </p>
          </form>
        </div>

        <div style={{ marginTop:24, display:'flex', gap:16 }}>
          {['Privacy Policy','Terms of Service','Support'].map(l=>(
            <span key={l} style={{ fontSize:12, color:'rgba(255,255,255,0.3)', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
