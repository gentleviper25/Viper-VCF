/**
 * src/App.jsx
 * Central router — all routes defined here.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider }    from '@/context/AuthContext'
import { ToastProvider }   from '@/context/ToastContext'
import ProtectedRoute      from '@/components/shared/ProtectedRoute'

/* Pages */
import Landing        from '@/pages/Landing'
import Register       from '@/pages/auth/Register'
import Login          from '@/pages/auth/Login'
import Dashboard      from '@/pages/dashboard/Dashboard'
import CreateSession  from '@/pages/dashboard/CreateSession'
import SessionResults from '@/pages/dashboard/SessionResults'
import SessionSubmit  from '@/pages/public/SessionSubmit'
import NotFound       from '@/pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* ── Public ─────────────────────────────────────────── */}
            <Route path="/"         element={<Landing />}  />
            <Route path="/register" element={<Register />} />
            <Route path="/login"    element={<Login />}    />

            {/* Public session submission — no auth required */}
            <Route path="/s/:code"  element={<SessionSubmit />} />

            {/* ── Protected Dashboard ────────────────────────────── */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/new"
              element={<ProtectedRoute><CreateSession /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/session/:code"
              element={<ProtectedRoute><SessionResults /></ProtectedRoute>}
            />

            {/* ── Fallbacks ──────────────────────────────────────── */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*"    element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
