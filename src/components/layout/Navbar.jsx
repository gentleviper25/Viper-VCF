/**
 * src/components/layout/Navbar.jsx — Public pages nav
 */
import { LogoMark }  from '@/components/ui/ViperLogo'
import { useAuth }   from '@/context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      height:66, display:'flex', alignItems:'center', padding:'0 40px',
      background:'rgba(0,0,0,0.6)', backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(255,255,255,0.06)',
    }}>
      <LogoMark onClick={()=>navigate('/')}/>
      <div style={{ display:'flex', gap:32, marginLeft:48 }}>
        {['Home','How it Works','Contact'].map(l=>(
          <span key={l} className="nav-link" onClick={()=>navigate('/')}>{l}</span>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginLeft:'auto' }}>
        {isAuthenticated ? (
          <button className="btn btn-primary btn-sm" onClick={()=>navigate('/dashboard')}>Dashboard</button>
        ) : (
          <>
            <button
              onClick={()=>navigate('/login')}
              style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 20px', color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif' }}
            >Login</button>
            <button
              onClick={()=>navigate('/register')}
              style={{ background:'linear-gradient(90deg,#7c3aed,#a855f7)', border:'none', borderRadius:10, padding:'8px 20px', color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', boxShadow:'0 4px 16px rgba(139,92,246,0.4)' }}
            >Sign Up</button>
          </>
        )}
      </div>
    </nav>
  )
}
