/**
 * src/components/layout/DashboardLayout.jsx
 */
import { useState }             from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { LogoMark }             from '@/components/ui/ViperLogo'
import { useAuth }              from '@/context/AuthContext'
import { useToast }             from '@/context/ToastContext'
import { LayoutDashboard, Plus, LogOut, Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Dashboard', to: '/dashboard',     icon: LayoutDashboard },
  { label: 'New Session', to: '/dashboard/new', icon: Plus },
]

function Sidebar({ onClose }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const toast    = useToast()

  async function handleSignOut() {
    await signOut()
    toast({ message: 'Signed out.', type: 'info' })
    navigate('/')
    onClose?.()
  }

  const initials = profile?.full_name
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <aside style={{
      width: 240, minHeight: '100vh',
      background: 'rgba(6,2,14,0.97)',
      borderRight: '1px solid rgba(139,92,246,0.12)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 14px',
    }}>
      <div style={{ padding: '4px 6px 24px' }}>
        <LogoMark onClick={() => { navigate('/'); onClose?.() }} />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(139,92,246,0.12)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
            fontFamily: 'Outfit,sans-serif',
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.full_name || 'User'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="sidebar-link"
          style={{ color: '#f87171', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}

export default function DashboardLayout({ children }) {
  const navigate     = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      {/* Desktop sidebar */}
      <div style={{ flexShrink: 0, display: 'none' }} className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div
          onClick={e => e.target === e.currentTarget && setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex' }}
        >
          <div style={{ width: 240 }}>
            <Sidebar onClose={() => setOpen(false)} />
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: 8, width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer',
            }}
          ><X size={18} /></button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div className="mobile-topbar" style={{
          display: 'none',
          padding: '0 16px', height: 60,
          alignItems: 'center', gap: 12,
          borderBottom: '1px solid rgba(139,92,246,0.12)',
          background: 'rgba(6,2,14,0.97)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            onClick={() => setOpen(true)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, display: 'flex' }}
          ><Menu size={20} /></button>
          <LogoMark onClick={() => navigate('/')} />
        </div>

        <main style={{ flex: 1, padding: '32px', maxWidth: 1100, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .sidebar-desktop { display: block !important; }
        }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-topbar   { display: flex !important; }
          main { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
