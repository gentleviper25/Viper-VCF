/**
 * src/components/shared/ProtectedRoute.jsx
 * Redirects unauthenticated users to /login.
 */
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth }               from '@/context/AuthContext'
import Spinner                   from '@/components/ui/Spinner'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        <Spinner size={32} color="#8b5cf6" />
        <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'Inter,sans-serif' }}>
          Loading…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
