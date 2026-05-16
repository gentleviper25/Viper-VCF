/**
 * src/pages/Landing.jsx
 * Public marketing page — matches Viper VCF brand: pure black, purple gradients.
 */
import { useNavigate } from 'react-router-dom'
import Navbar          from '@/components/layout/Navbar'
import { ViperIcon }   from '@/components/ui/ViperLogo'
import {
  Shield, Zap, Users, Download, ArrowRight,
  CheckCircle, Link2, Clock, Star,
} from 'lucide-react'

/* ── Snake coil SVG background element ─── */
function SnakeBg() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Purple radial behind hero */}
      <div style={{
        position: 'absolute', top: '-15%', left: '25%',
        width: 700, height: 700,
        background: 'radial-gradient(ellipse, rgba(109,40,217,0.18) 0%, transparent 65%)',
        borderRadius: '50%',
      }} />
      {/* Bottom right glow */}
      <div style={{
        position: 'absolute', bottom: '-10%', right: '10%',
        width: 500, height: 500,
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)',
        borderRadius: '50%',
      }} />
      {/* Left-side coil SVG (stylised snake path) */}
      <svg
        viewBox="0 0 400 900" fill="none"
        style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: 'auto', opacity: 0.55 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-30 0 Q40 120 20 250 Q-10 380 60 480 Q140 590 80 700 Q20 800 80 920"
          stroke="url(#sl)" strokeWidth="28" fill="none" strokeLinecap="round"
        />
        <path
          d="M-10 0 Q50 130 30 260 Q0 390 70 490 Q150 600 90 710 Q30 810 90 930"
          stroke="url(#sl2)" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5"
        />
        <defs>
          <linearGradient id="sl" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#3b0764" />
            <stop offset="50%"  stopColor="#6d28d9" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="sl2" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Right coil lines */}
      <svg
        viewBox="0 0 300 600" fill="none"
        style={{ position: 'absolute', right: 0, bottom: 0, height: '60%', width: 'auto', opacity: 0.4 }}
      >
        <path d="M320 600 Q260 500 290 380 Q320 260 270 160" stroke="url(#sr)" strokeWidth="20" fill="none" strokeLinecap="round"/>
        <path d="M300 600 Q240 500 270 380 Q300 260 250 160" stroke="#a855f7" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4"/>
        {/* Bottom purple smoke */}
        <ellipse cx="120" cy="580" rx="60" ry="30" fill="#7c3aed" opacity="0.25" filter="url(#blur)"/>
        <defs>
          <linearGradient id="sr" x1="0" y1="600" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#a855f7" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </linearGradient>
          <filter id="blur"><feGaussianBlur stdDeviation="16"/></filter>
        </defs>
      </svg>
    </div>
  )
}

/* ── Feature card ─── */
function FeatureCard({ icon: Icon, title, desc, delay = 0 }) {
  return (
    <div
      className="card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-icon" style={{ marginBottom: 16 }}>
        <Icon size={18} />
      </div>
      <h4 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 8, color: '#fff' }}>
        {title}
      </h4>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}

/* ── Step card ─── */
function StepCard({ n, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 14, color: '#fff',
      }}>{n}</div>
      <div>
        <h4 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</h4>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
      <SnakeBg />
      <Navbar />

      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative', zIndex: 1,
        paddingTop: 140, paddingBottom: 100,
        textAlign: 'center',
        padding: '140px 24px 100px',
      }}>
        {/* Join pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(139,92,246,0.12)',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 100, padding: '6px 16px',
          marginBottom: 28, cursor: 'pointer',
          fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#c4b5fd',
        }} onClick={() => navigate('/register')}>
          <Users size={13} style={{ color: '#a855f7' }} />
          Join Viper VCF — Free to start
          <ArrowRight size={13} style={{ color: '#a855f7' }} />
        </div>

        {/* Viper icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ animation: 'float 5s ease-in-out infinite' }}>
            <ViperIcon size={90} />
          </div>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Outfit,sans-serif',
          fontWeight: 900, fontSize: 'clamp(40px, 7vw, 72px)',
          lineHeight: 1.1, marginBottom: 20,
          letterSpacing: '-1px', color: '#fff',
        }}>
          Collect Contacts,
          <br />
          <span style={{
            background: 'linear-gradient(90deg,#a855f7,#c084fc,#8b5cf6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Export Instantly
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px,2vw,18px)', color: 'var(--text-muted)',
          maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7,
        }}>
          Create VCF sessions, share a link, and collect contacts from anyone — 
          no app needed. Download a clean <strong style={{ color: '#c4b5fd' }}>.vcf file</strong> when done.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: 16, padding: '14px 32px' }}
            onClick={() => navigate('/register')}
          >
            Get Started Free <ArrowRight size={16} />
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: 16, padding: '14px 28px' }}
            onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
          >
            How it Works
          </button>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 28 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={14} fill="#a855f7" style={{ color: '#a855f7' }} />
          ))}
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 4 }}>
            Trusted by 1,000+ users
          </span>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="badge badge-viper" style={{ marginBottom: 14 }}>Features</span>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,42px)', color: '#fff', marginBottom: 12 }}>
            Everything you need
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
            Built for professionals who need to collect contacts quickly, securely, and at scale.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
          <FeatureCard icon={Shield}   title="Secure & Private"       desc="All data stored securely in Supabase. Session owners have full control over their contacts."    delay={0}  />
          <FeatureCard icon={Zap}      title="Fast & Easy"            desc="Create a session in seconds, share the link, and start collecting contacts immediately."         delay={80} />
          <FeatureCard icon={Users}    title="Unlimited Sessions"     desc="Create as many VCF sessions as you need. No limits on how many contacts per session."           delay={160}/>
          <FeatureCard icon={Download} title="Export VCF File"        desc="One-click export of all contacts as a .vcf file — importable directly into any phone or app."   delay={240}/>
          <FeatureCard icon={Link2}    title="Unique Public Links"    desc="Each session gets a unique URL. Share it via WhatsApp, Telegram, email, or anywhere."          delay={320}/>
          <FeatureCard icon={Clock}    title="Session Expiry Control" desc="Set an exact date/time for your session to stop accepting submissions automatically."           delay={400}/>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="badge badge-viper" style={{ marginBottom: 14 }}>How It Works</span>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(26px,4vw,38px)', color: '#fff' }}>
              4 simple steps
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <StepCard n="1" title="Create a VCF Session" desc="Give your session a title, description, expiry date, and optionally add a WhatsApp or Telegram group link." />
            <StepCard n="2" title="Share Your Unique Link" desc="Copy the auto-generated session link and share it with your community anywhere online or offline." />
            <StepCard n="3" title="Collect Contacts" desc="Anyone can open the link and submit their name and phone number — no account needed. They get redirected to your group." />
            <StepCard n="4" title="Download Your VCF File" desc="Once the session expires, download all collected contacts as a single .vcf file, importable into any phone." />
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px 100px' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(76,29,149,0.3), rgba(109,40,217,0.2))',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 28, padding: '56px 40px',
          backdropFilter: 'blur(20px)',
        }}>
          <ViperIcon size={56} />
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(24px,4vw,36px)', color: '#fff', margin: '20px 0 12px' }}>
            Ready to start collecting?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28 }}>
            Create your first VCF session in under 60 seconds.
          </p>
          <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => navigate('/register')}>
            Create Free Account <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(139,92,246,0.12)',
        padding: '24px', textAlign: 'center',
        background: 'rgba(0,0,0,0.6)',
      }}>
        {/* Feature strip matching design */}
        <div style={{
          maxWidth: 900, margin: '0 auto 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 20, padding: '24px 0', borderBottom: '1px solid rgba(139,92,246,0.1)',
        }}>
          {[
            { icon: Shield,   title: 'Secure & Private',     desc: 'Your data is 100% secure with us' },
            { icon: Zap,      title: 'Fast & Easy',           desc: 'Create sessions in seconds' },
            { icon: Users,    title: 'Unlimited Sessions',    desc: 'Create unlimited VCF sessions' },
            { icon: Download, title: 'Export VCF File',       desc: 'Export all contacts in one click' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="feature-icon" style={{ width: 36, height: 36, borderRadius: 8 }}>
                <Icon size={15} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 13, color: '#a855f7' }}>{title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>© 2024 Viper VCF. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 10 }}>
          {['Privacy Policy','Terms of Service','Support'].map(l => (
            <span key={l} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  )
}
