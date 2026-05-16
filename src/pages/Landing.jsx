/**
 * src/pages/Landing.jsx
 * Landing page — NO features section per user request.
 * Snake bg left, purple theme, real Viper logo.
 */
import { useNavigate } from 'react-router-dom'
import { LogoMark, ViperIcon } from '@/components/ui/ViperLogo'
import { ArrowRight, Users, Clock, Download, Star, CheckCircle } from 'lucide-react'

function StepCard({ n, title, desc }) {
  return (
    <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
      <div style={{
        width:38, height:38, borderRadius:10, flexShrink:0,
        background:'linear-gradient(135deg,#7c3aed,#a855f7)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:15, color:'#fff',
      }}>{n}</div>
      <div>
        <h4 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:16, marginBottom:5, color:'#fff' }}>{n}. {title}</h4>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background:'#000', minHeight:'100vh', position:'relative', overflow:'hidden' }}>
      {/* Snake bg image */}
      <img src="/snake-bg.png" alt="" aria-hidden="true" style={{
        position:'fixed', left:0, top:0, height:'100%', width:'auto', maxWidth:'42%',
        objectFit:'cover', objectPosition:'right center',
        opacity:0.7, pointerEvents:'none', zIndex:0,
        maskImage:'linear-gradient(to right, black 50%, transparent 100%)',
        WebkitMaskImage:'linear-gradient(to right, black 50%, transparent 100%)',
      }}/>
      <div style={{ position:'fixed', left:0, top:'20%', width:400, height:500, background:'radial-gradient(ellipse,rgba(109,40,217,0.18) 0%,transparent 65%)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'fixed', bottom:0, right:0, width:400, height:400, background:'radial-gradient(ellipse,rgba(139,92,246,0.1) 0%,transparent 65%)', pointerEvents:'none', zIndex:0 }}/>

      {/* ── Navbar ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:66, display:'flex', alignItems:'center', padding:'0 40px',
        background:'rgba(0,0,0,0.6)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <LogoMark onClick={()=>navigate('/')}/>
        <div style={{ display:'flex', gap:32, marginLeft:48 }}>
          {['Home','How it Works','Contact'].map(l=>(
            <span key={l} style={{ fontSize:14, color:'rgba(255,255,255,0.55)', cursor:'pointer', fontFamily:'Inter,sans-serif', fontWeight:500, transition:'color 0.15s' }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.55)'}
              onClick={()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>{l}</span>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, marginLeft:'auto' }}>
          <button
            onClick={()=>navigate('/login')}
            style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 20px', color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'border-color 0.2s' }}
            onMouseEnter={e=>e.target.style.borderColor='rgba(168,85,247,0.6)'}
            onMouseLeave={e=>e.target.style.borderColor='rgba(255,255,255,0.2)'}
          >Login</button>
          <button
            onClick={()=>navigate('/register')}
            style={{ background:'linear-gradient(90deg,#7c3aed,#a855f7)', border:'none', borderRadius:10, padding:'8px 20px', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', boxShadow:'0 4px 16px rgba(139,92,246,0.4)', transition:'all 0.2s' }}
          >Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'100px 24px 60px' }}>
        {/* Pill */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.35)', borderRadius:100, padding:'7px 18px', marginBottom:28, fontSize:13, color:'rgba(255,255,255,0.75)', fontFamily:'Inter,sans-serif', cursor:'pointer' }} onClick={()=>navigate('/register')}>
          <Users size={13} style={{ color:'#a855f7' }}/> Join Viper VCF — Free to start
          <ArrowRight size={13} style={{ color:'#a855f7' }}/>
        </div>

        {/* Logo */}
        <div style={{ marginBottom:28, animation:'float 5s ease-in-out infinite' }}>
          <ViperIcon size={100}/>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily:'Outfit,sans-serif', fontWeight:900, fontSize:'clamp(42px,7vw,76px)', lineHeight:1.05, marginBottom:20, letterSpacing:'-2px', color:'#fff' }}>
          Collect Contacts,<br/>
          <span style={{ background:'linear-gradient(90deg,#9333ea,#a855f7,#c084fc)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            Export Instantly
          </span>
        </h1>

        <p style={{ fontSize:'clamp(15px,2vw,18px)', color:'rgba(255,255,255,0.45)', maxWidth:500, margin:'0 auto 40px', lineHeight:1.7, fontFamily:'Inter,sans-serif' }}>
          Create VCF sessions, share a link, and collect contacts from anyone — no app needed.
          Download a clean <strong style={{ color:'rgba(255,255,255,0.7)' }}>.vcf file</strong> when done.
        </p>

        {/* CTAs */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button
            onClick={()=>navigate('/register')}
            style={{ background:'linear-gradient(90deg,#7c3aed,#a855f7)', border:'none', borderRadius:12, padding:'15px 32px', color:'#fff', fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 6px 28px rgba(139,92,246,0.45)', fontFamily:'Inter,sans-serif', transition:'all 0.2s' }}
          >
            Get Started Free <ArrowRight size={16}/>
          </button>
          <button
            onClick={()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, padding:'15px 28px', color:'#fff', fontSize:16, fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all 0.2s' }}
          >How it Works</button>
        </div>

        {/* Stars */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5, marginTop:24 }}>
          {[1,2,3,4,5].map(i=><Star key={i} size={14} fill="#a855f7" style={{ color:'#a855f7' }}/>)}
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginLeft:6, fontFamily:'Inter,sans-serif' }}>Trusted by 1,000+ users</span>
        </div>

        {/* Quick benefits */}
        <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center', marginTop:32 }}>
          {['No login for submitters','Works on any device','Import to any phone','100% free to start'].map(t=>(
            <div key={t} style={{ display:'flex', alignItems:'center', gap:7 }}>
              <CheckCircle size={14} style={{ color:'#a855f7', flexShrink:0 }}/>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontFamily:'Inter,sans-serif' }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ position:'relative', zIndex:1, padding:'80px 24px 100px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.28)', borderRadius:100, padding:'6px 16px', marginBottom:16, fontSize:12, color:'#a855f7', fontWeight:600, letterSpacing:0.5, textTransform:'uppercase', fontFamily:'Inter,sans-serif' }}>
              How It Works
            </div>
            <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:'clamp(26px,4vw,40px)', color:'#fff' }}>4 simple steps</h2>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
            <StepCard n="1" title="Create a Session" desc="Give it a title, expiry date, and optionally a WhatsApp or Telegram group link."/>
            <StepCard n="2" title="Share Your Link" desc="Copy the auto-generated public link and share it anywhere — chat, QR code, social."/>
            <StepCard n="3" title="Collect Contacts" desc="Anyone opens the link, enters name + phone. No account needed. They join your group."/>
            <StepCard n="4" title="Download VCF" desc="Session expires → download all contacts as a .vcf file → import directly into any phone."/>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ position:'relative', zIndex:1, padding:'0 24px 100px' }}>
        <div style={{
          maxWidth:660, margin:'0 auto', textAlign:'center',
          background:'linear-gradient(135deg,rgba(76,29,149,0.3),rgba(109,40,217,0.2))',
          border:'1px solid rgba(139,92,246,0.3)', borderRadius:24, padding:'52px 40px',
          backdropFilter:'blur(20px)',
        }}>
          <ViperIcon size={60}/>
          <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:'clamp(24px,4vw,36px)', color:'#fff', margin:'20px 0 12px' }}>
            Ready to collect contacts?
          </h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15, marginBottom:28, fontFamily:'Inter,sans-serif' }}>
            Create your first VCF session in under 60 seconds.
          </p>
          <button
            onClick={()=>navigate('/register')}
            style={{ background:'linear-gradient(90deg,#7c3aed,#a855f7)', border:'none', borderRadius:12, padding:'15px 32px', color:'#fff', fontSize:16, fontWeight:700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 6px 28px rgba(139,92,246,0.45)', fontFamily:'Inter,sans-serif' }}
          >
            Create Free Account <ArrowRight size={16}/>
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(139,92,246,0.1)', padding:'28px 24px', textAlign:'center', background:'rgba(0,0,0,0.5)' }}>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.25)', marginBottom:10, fontFamily:'Inter,sans-serif' }}>© 2024 Viper VCF. All rights reserved.</p>
        <div style={{ display:'flex', gap:20, justifyContent:'center' }}>
          {['Privacy Policy','Terms of Service','Support'].map(l=>(
            <span key={l} style={{ fontSize:12, color:'rgba(255,255,255,0.3)', cursor:'pointer', fontFamily:'Inter,sans-serif' }}
              onMouseEnter={e=>e.target.style.color='#a855f7'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.3)'}>
              {l}
            </span>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @media(max-width:768px){
          nav > div:nth-child(2){ display:none !important; }
        }
      `}</style>
    </div>
  )
}
