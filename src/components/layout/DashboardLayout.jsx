/**
 * src/components/layout/DashboardLayout.jsx
 */
import { useState }         from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { LogoMark }         from '@/components/ui/ViperLogo'
import { useAuth }          from '@/context/AuthContext'
import { useToast }         from '@/context/ToastContext'
import {
  LayoutDashboard, Plus, LogOut, Menu, X,
  Download, Settings, ChevronRight,
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard',      to: '/dashboard',        icon: LayoutDashboard },
  { label: 'New Session',    to: '/dashboard/new',    icon: Plus },
]

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const toast    = useToast()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    toast({ message: 'Signed out successfully.', type: 'info' })
    navigate('/')
  }

  const initials = profile?.full_name
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'

  const Sidebar = () => (
    <aside style={{
      width:           240,
      minHeight:       '100vh',
      background:      'rgba(6,2,14,0.92)',
      borderRight:     '1px solid rgba(139,92,246,0.12)',
      display:         'flex',
      flexDirection:   'column',
      padding:         '20px 14px',
      backdropFilter:  'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '4px 6px 24px' }}>
        <LogoMark onClick={() => navigate('/')} />
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{
        borderTop:  '1px solid rgba(139,92,246,0.12)',
        paddingTop: 16,
        display:    'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            fontFamily: 'Outfit, sans-serif',
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', truncate: true, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.full_name || 'User'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="sidebar-link"
          style={{ color: '#f87171', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      {/* Desktop sidebar */}
      <div className="hide-mobile" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}
          onClick={e => e.target === e.currentTarget && setMobileOpen(false)}
        >
          <div style={{ width: 240 }}><Sidebar /></div>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', cursor: 'pointer',
            }}
          ><X size={18} /></button>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div className="show-mobile" style={{
          display: 'none', // shown via CSS media query override below
          padding: '0 16px',
          height: 60,
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid rgba(139,92,246,0.12)',
          background: 'rgba(6,2,14,0.95)',
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          ><Menu size={20} /></button>
          <LogoMark onClick={() => navigate('/')} />
        </div>

        {/* Page content */}
        <main style={{
          flex:      1,
          padding:   '32px 32px',
          maxWidth:  1100,
          width:     '100%',
          margin:    '0 auto',
        }}>
          {children}
        </main>
      </div>

      <style>{`
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .show-mobile{display:flex!important}
          main{padding:20px 16px!important}
        }
      `}</style>
    </div>
  )
}
