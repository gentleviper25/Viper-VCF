/**
 * src/components/layout/Navbar.jsx
 * Top navigation bar for public pages (Landing, Auth).
 */
import { LogoMark } from '@/components/ui/ViperLogo'
import Button       from '@/components/ui/Button'
import { useAuth }  from '@/context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <nav style={{
      position:        'fixed',
      top:             0,
      left:            0,
      right:           0,
      zIndex:          100,
      height:          68,
      display:         'flex',
      alignItems:      'center',
      padding:         '0 24px',
      borderBottom:    '1px solid rgba(139,92,246,0.1)',
      background:      'rgba(0,0,0,0.7)',
      backdropFilter:  'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40 }}>
        {/* Logo */}
        <LogoMark onClick={() => navigate('/')} />

        {/* Nav links – centered */}
        <div style={{ display: 'flex', gap: 28, flex: 1 }} className="hide-mobile">
          <Link to="/#features" className="nav-link">Features</Link>
          <Link to="/#how"      className="nav-link">How it Works</Link>
          <Link to="/#contact"  className="nav-link">Contact</Link>
        </div>

        {/* Auth CTA */}
        <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
          {isAuthenticated ? (
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/register')}
                style={{ border: '1px solid rgba(139,92,246,0.45)', color: '#fff' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
