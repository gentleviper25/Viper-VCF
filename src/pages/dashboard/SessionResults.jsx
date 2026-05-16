/**
 * src/pages/dashboard/SessionResults.jsx
 * Owner's view of a session: contacts table + VCF download.
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Modal           from '@/components/ui/Modal'
import Spinner         from '@/components/ui/Spinner'
import { useSessions } from '@/hooks/useSessions'
import { useContacts } from '@/hooks/useContacts'
import { useToast }    from '@/context/ToastContext'
import { downloadVCF } from '@/lib/vcf'
import { isExpired, formatDate, timeLeft, sessionUrl, copyToClipboard } from '@/lib/utils'
import {
  Download, Copy, CheckCheck, Users, Clock, Link2,
  Trash2, ExternalLink, ArrowLeft, CheckCircle, RefreshCw,
} from 'lucide-react'

export default function SessionResults() {
  const { code }  = useParams()
  const navigate  = useNavigate()
  const toast     = useToast()
  const [sp]      = useSearchParams()
  const autoDownload = sp.get('download') === '1'

  const { fetchPublicSession } = useSessions()
  const { contacts, loading: cLoad, fetchContacts, deleteContact } = useContacts()

  const [session,  setSession]  = useState(null)
  const [sLoad,    setSLoad]    = useState(true)
  const [copied,   setCopied]   = useState(false)
  const [delTarget,setDel]      = useState(null)
  const [deleting, setDeling]   = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await fetchPublicSession(code)
      if (error || !data) { toast({ message: 'Session not found.', type: 'error' }); navigate('/dashboard'); return }
      setSession(data)
      await fetchContacts(code)
      setSLoad(false)
    }
    load()
  }, [code])

  /* Auto-trigger download if ?download=1 */
  useEffect(() => {
    if (autoDownload && session && contacts.length > 0 && isExpired(session.expiry_date)) {
      handleDownload()
    }
  }, [autoDownload, session, contacts])

  async function handleCopy() {
    await copyToClipboard(sessionUrl(code))
    setCopied(true)
    toast({ message: 'Link copied!', type: 'success' })
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    if (!contacts.length) { toast({ message: 'No contacts to download.', type: 'info' }); return }
    const filename = downloadVCF(contacts, session?.title || 'Session')
    toast({ message: `Downloaded ${filename}`, type: 'success' })
  }

  async function confirmDelete() {
    if (!delTarget) return
    setDeling(true)
    const { error } = await deleteContact(delTarget.id)
    if (error) { toast({ message: `Error: ${error}`, type: 'error' }) }
    else { toast({ message: 'Contact removed.', type: 'success' }); fetchContacts(code) }
    setDeling(false); setDel(null)
  }

  if (sLoad) return (
    <DashboardLayout>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300, gap:12, color:'var(--text-muted)' }}>
        <Spinner size={24} color="#8b5cf6" /> Loading session…
      </div>
    </DashboardLayout>
  )

  if (!session) return null

  const expired = isExpired(session.expiry_date)
  const url     = sessionUrl(code)

  return (
    <DashboardLayout>
      {/* Back */}
      <button className="btn btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* ── Session Header ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
          <div style={{
            width:52, height:52, borderRadius:14, flexShrink:0,
            background:'linear-gradient(135deg,#4c1d95,#7c3aed)',
            border:'1px solid rgba(139,92,246,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:12, color:'#e9d5ff',
          }}>VCF</div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
              <h1 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:22, color:'#fff' }}>
                {session.title}
              </h1>
              <span className={`badge ${expired ? 'badge-expired' : 'badge-active'}`}>
                <span className={`dot ${expired ? 'dot-expired' : 'dot-active'}`} />
                {expired ? 'Expired' : 'Active'}
              </span>
            </div>
            {session.description && (
              <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:12 }}>{session.description}</p>
            )}

            {/* Meta row */}
            <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-muted)' }}>
                <Clock size={12} />
                {expired ? `Expired ${formatDate(session.expiry_date)}` : `Expires ${timeLeft(session.expiry_date)}`}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--text-muted)' }}>
                <Users size={12} /> {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', flexShrink:0 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => fetchContacts(code)}>
              <RefreshCw size={13} /> Refresh
            </button>
            {expired && contacts.length > 0 && (
              <button className="btn btn-primary btn-sm" onClick={handleDownload}>
                <Download size={13} /> Download VCF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Contacts', value: contacts.length, color:'#a855f7' },
          { label:'Session Code',   value: code,            color:'#60a5fa', mono:true },
          { label:'Status',         value: expired ? 'Expired':'Active', color: expired?'#f87171':'#4ade80' },
        ].map(({ label, value, color, mono }) => (
          <div key={label} className="stat-card">
            <p style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>{label}</p>
            <p style={{ fontFamily: mono?'monospace':'Outfit,sans-serif', fontWeight:700, fontSize: mono?14:22, color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Public link row ── */}
      <div style={{
        background:'rgba(12,4,24,0.9)', border:'1px solid rgba(139,92,246,0.2)',
        borderRadius:14, padding:'16px 20px', marginBottom:20,
        display:'flex', alignItems:'center', gap:12, flexWrap:'wrap',
      }}>
        <Link2 size={15} style={{ color:'#a855f7', flexShrink:0 }} />
        <span style={{ fontSize:13, color:'var(--text-muted)', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {url}
        </span>
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          <button className="copy-pill" onClick={handleCopy}>
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="copy-pill">
            <ExternalLink size={12} /> Open
          </a>
        </div>
      </div>

      {/* ── Contacts table ── */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(139,92,246,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:17, color:'#fff' }}>
            Collected Contacts
          </h2>
          {expired && contacts.length > 0 && (
            <button className="btn btn-primary btn-sm" onClick={handleDownload}>
              <Download size={13} /> Export .vcf
            </button>
          )}
        </div>

        {cLoad ? (
          <div style={{ padding:'60px', display:'flex', alignItems:'center', justifyContent:'center', gap:12, color:'var(--text-muted)' }}>
            <Spinner size={20} color="#8b5cf6" /> Loading contacts…
          </div>
        ) : contacts.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            <p style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:18, marginBottom:6 }}>No contacts yet</p>
            <p style={{ color:'var(--text-muted)', fontSize:13 }}>
              {expired
                ? 'This session ended with no submissions.'
                : 'Share the session link to start collecting.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft:24 }}>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Submitted</th>
                  <th style={{ paddingRight:24 }}></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={c.id} className="table-row">
                    <td style={{ paddingLeft:24, color:'var(--text-muted)', fontSize:12 }}>{i+1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{
                          width:30, height:30, borderRadius:'50%', flexShrink:0,
                          background:'linear-gradient(135deg,#4c1d95,#7c3aed)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:11, fontWeight:700, color:'#e9d5ff',
                          fontFamily:'Outfit,sans-serif',
                        }}>
                          {c.name[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight:500 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily:'monospace', fontSize:13 }}>{c.phone}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:12 }}>{formatDate(c.created_at)}</td>
                    <td style={{ paddingRight:24 }}>
                      <button className="btn-danger" style={{ padding:'5px 10px', fontSize:12, borderRadius:7 }} onClick={() => setDel(c)}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Download CTA (if expired) ── */}
      {expired && contacts.length > 0 && (
        <div style={{
          marginTop:20, background:'linear-gradient(135deg,rgba(76,29,149,0.25),rgba(109,40,217,0.15))',
          border:'1px solid rgba(139,92,246,0.3)',
          borderRadius:16, padding:'20px 24px',
          display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
        }}>
          <CheckCircle size={22} style={{ color:'#4ade80', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:15, marginBottom:2 }}>
              Session complete! {contacts.length} contacts collected.
            </p>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>
              Your VCF file is ready to download and import into any phone.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={15} /> Download .vcf file
          </button>
        </div>
      )}

      {/* Delete modal */}
      <Modal open={!!delTarget} onClose={() => setDel(null)} title="Remove Contact">
        <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:20 }}>
          Remove <strong style={{ color:'#fff' }}>{delTarget?.name}</strong> ({delTarget?.phone}) from this session?
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => setDel(null)}>Cancel</button>
          <button className="btn btn-danger" style={{ flex:1 }} onClick={confirmDelete} disabled={deleting}>
            {deleting && <Spinner size={13} />}
            {deleting ? 'Removing…' : 'Remove'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
