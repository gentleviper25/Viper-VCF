/**
 * src/pages/dashboard/Dashboard.jsx
 */
import { useEffect, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import DashboardLayout         from '@/components/layout/DashboardLayout'
import SessionCard             from '@/components/shared/SessionCard'
import Modal                   from '@/components/ui/Modal'
import Spinner                 from '@/components/ui/Spinner'
import { useAuth }             from '@/context/AuthContext'
import { useToast }            from '@/context/ToastContext'
import { useSessions }         from '@/hooks/useSessions'
import { isExpired }           from '@/lib/utils'
import { Plus, LayoutDashboard, Users, Clock, Download, Search } from 'lucide-react'

export default function Dashboard() {
  const { profile }  = useAuth()
  const navigate     = useNavigate()
  const toast        = useToast()
  const { sessions, loading, fetchSessions, deleteSession } = useSessions()

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)
  const [search, setSearch]             = useState('')

  useEffect(() => { fetchSessions() }, [])

  const filtered = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.session_code.toLowerCase().includes(search.toLowerCase())
  )

  const activeSessions  = sessions.filter(s => !isExpired(s.expiry_date)).length
  const expiredSessions = sessions.filter(s =>  isExpired(s.expiry_date)).length
  const totalContacts   = sessions.reduce((a, s) => a + (s.contacts?.[0]?.count ?? 0), 0)

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await deleteSession(deleteTarget.id)
    if (error) {
      toast({ message: `Delete failed: ${error}`, type: 'error' })
    } else {
      toast({ message: 'Session deleted.', type: 'success' })
      fetchSessions()
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <DashboardLayout>
      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 'clamp(22px,4vw,30px)', color: '#fff', marginBottom: 4 }}>
              Hey, {firstName} 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Here's an overview of your VCF sessions.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/new')}>
            <Plus size={16} /> New Session
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
        gap: 16, marginBottom: 32,
      }}>
        {[
          { label: 'Total Sessions', value: sessions.length, icon: LayoutDashboard, color: '#a855f7' },
          { label: 'Active',         value: activeSessions,  icon: Clock,            color: '#4ade80' },
          { label: 'Expired',        value: expiredSessions, icon: Clock,            color: '#f87171' },
          { label: 'Total Contacts', value: totalContacts,   icon: Users,            color: '#60a5fa' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, flexShrink: 0,
              }}>
                <Icon size={14} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
            </div>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 28, color: '#fff' }}>
              {loading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Sessions List ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' }}>
            Your Sessions
          </h2>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search sessions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 36, paddingTop: 9, paddingBottom: 9, fontSize: 13 }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 12, color: 'var(--text-muted)' }}>
            <Spinner size={24} color="#8b5cf6" />
            <span>Loading sessions…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            background: 'rgba(139,92,246,0.04)',
            border: '1px dashed rgba(139,92,246,0.2)',
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐍</div>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
              {search ? 'No sessions found' : 'No sessions yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              {search ? 'Try a different search term.' : 'Create your first VCF session to start collecting contacts.'}
            </p>
            {!search && (
              <button className="btn btn-primary" onClick={() => navigate('/dashboard/new')}>
                <Plus size={15} /> Create First Session
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 20 }}>
            {filtered.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Session"
      >
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>
          Are you sure you want to delete{' '}
          <strong style={{ color: '#fff' }}>"{deleteTarget?.title}"</strong>?
        </p>
        <p style={{ color: '#f87171', fontSize: 13, marginBottom: 24 }}>
          This will permanently delete the session and all {deleteTarget?.contacts?.[0]?.count ?? 0} collected contacts.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            style={{ flex: 1 }}
            onClick={confirmDelete}
            disabled={deleting}
          >
            {deleting ? <Spinner size={14} /> : null}
            {deleting ? 'Deleting…' : 'Delete Session'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
