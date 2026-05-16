/**
 * src/hooks/useSessions.js
 */
import { useState, useCallback } from 'react'
import { supabase }              from '@/config/supabase'
import { generateSessionCode }   from '@/lib/utils'
import { sanitizeSession }       from '@/lib/sanitize'

export function useSessions() {
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  /** Fetch all sessions owned by the current user */
  const fetchSessions = useCallback(async () => {
    setLoading(true); setError(null)
    const { data, error: err } = await supabase
      .from('sessions')
      .select(`
        id, title, description, session_code, whatsapp_link,
        telegram_link, expiry_date, created_at, is_active,
        contacts(count)
      `)
      .order('created_at', { ascending: false })
    if (err) { setError(err.message); setLoading(false); return }
    setSessions(data ?? [])
    setLoading(false)
  }, [])

  /** Fetch a single session by session_code (public) */
  const fetchPublicSession = useCallback(async (code) => {
    const { data, error: err } = await supabase
      .from('sessions')
      .select('id, title, description, session_code, whatsapp_link, telegram_link, expiry_date, is_active')
      .eq('session_code', code.toUpperCase())
      .single()
    if (err) return { data: null, error: err.message }
    return { data, error: null }
  }, [])

  /** Create a new session */
  const createSession = useCallback(async (payload, userId) => {
    const clean = sanitizeSession(payload)
    const code  = generateSessionCode(10)

    const { data, error: err } = await supabase
      .from('sessions')
      .insert({
        user_id:       userId,
        title:         clean.title,
        description:   clean.description || null,
        session_code:  code,
        whatsapp_link: clean.whatsapp_link || null,
        telegram_link: clean.telegram_link || null,
        expiry_date:   payload.expiry_date,
        is_active:     true,
        created_at:    new Date().toISOString(),
      })
      .select()
      .single()

    if (err) return { data: null, error: err.message }
    return { data, error: null }
  }, [])

  /** Deactivate a session manually */
  const deactivateSession = useCallback(async (sessionId) => {
    const { error: err } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', sessionId)
    return { error: err?.message ?? null }
  }, [])

  /** Delete a session and its contacts */
  const deleteSession = useCallback(async (sessionId) => {
    // RLS + cascade handles contacts
    const { error: err } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId)
    return { error: err?.message ?? null }
  }, [])

  return {
    sessions, loading, error,
    fetchSessions, fetchPublicSession,
    createSession, deactivateSession, deleteSession,
  }
}
