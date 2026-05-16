/**
 * src/pages/NotFound.jsx
 */
import { useNavigate } from 'react-router-dom'
import { ViperIcon }   from '@/components/ui/ViperLogo'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      background: '#000', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* BG glows */}
      <div style={{ position:'absolute', top:'10%', left:'20%', width:500, height:500, background:'radial-gradient(ellipse,rgba(109,40,217,0.14) 0%,transparent 65%)', borderRadius:'50%', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'5%', right:'15%', width:350, height:350, background:'radial-gradient(ellipse,rgba(139,92,246,0.1) 0%,transparent 65%)', borderRadius:'50%', pointerEvents:'none' }}/>

      {/* Snake coil left */}
      <svg viewBox="0 0 300 700" fill="none" style={{ position:'absolute', left:0, top:0, height:'100%', width:'auto', opacity:0.3, pointerEvents:'none' }}>
        <path d="M-20 0 Q55 120 25 255 Q-5 375 65 470 Q135 570 75 680"
          stroke="url(#nf404)" strokeWidth="28" fill="none" strokeLinecap="round"/>
        <defs>
          <linearGradient id="nf404" x1="0" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b0764"/>
            <stop offset="55%" stopColor="#6d28d9" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Big 404 */}
        <div style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(100px, 18vw, 180px)',
          lineHeight: 1,
          background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-4px',
          marginBottom: 8,
          userSelect: 'none',
        }}>
          404
        </div>

        {/* Snake icon */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <ViperIcon size={68} />
        </div>

        <h1 style={{
          fontFamily: 'Outfit, sans-serif', fontWeight: 800,
          fontSize: 'clamp(22px,4vw,32px)', color: '#fff', marginBottom: 10,
        }}>
          Page Not Found
        </h1>
        <p style={{
          color: 'var(--text-muted)', fontSize: 15, maxWidth: 400,
          margin: '0 auto 36px', lineHeight: 1.6,
        }}>
          The page you're looking for has slithered away. It may have been deleted or never existed.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-ghost"
            style={{ border: '1px solid rgba(139,92,246,0.3)' }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} /> Go Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            <Home size={15} /> Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
