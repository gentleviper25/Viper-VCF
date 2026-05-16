/**
 * src/hooks/useContacts.js
 * Handles all contact operations — public submission & owner management.
 */
import { useState, useCallback } from 'react'
import { supabase }              from '@/config/supabase'
import { sanitizeContact }       from '@/lib/sanitize'

const MAX_PER_SESSION = parseInt(import.meta.env.VITE_MAX_CONTACTS_PER_SESSION || '500', 10)

export function useContacts() {
  const [contacts, setContacts] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  /**
   * Fetch all contacts for a session (owner view).
   * Returns raw data array AND updates component state.
   */
  const fetchContacts = useCallback(async (sessionCode) => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('contacts')
      .select('id, name, phone, created_at')
      .eq('session_code', sessionCode.toUpperCase())
      .order('created_at', { ascending: false })

    if (err) {
      setError(err.message)
      setLoading(false)
      return []
    }
    const result = data ?? []
    setContacts(result)
    setLoading(false)
    return result  // ← Return raw data for direct VCF download use
  }, [])

  /**
   * Submit a contact via the public session page.
   * Enforces: expiry, active flag, duplicate phone, session cap.
   */
  const submitContact = useCallback(async ({
    name,
    phone,
    sessionCode,
    sessionExpiry,
    isActive,
  }) => {
    // ── Guard: session must be open ──
    if (!isActive) {
      return { error: 'This session is no longer accepting submissions.' }
    }
    if (new Date(sessionExpiry) < new Date()) {
      return { error: 'This session has expired and is no longer accepting contacts.' }
    }

    // ── Sanitize inputs ──
    const clean = sanitizeContact({ name, phone })
    if (!clean.name)  return { error: 'Name is required.' }
    if (!clean.phone) return { error: 'Phone number is required.' }

    // ── Session contact cap ──
    const { count, error: countErr } = await supabase
      .from('contacts')
      .select('id', { count: 'exact', head: true })
      .eq('session_code', sessionCode.toUpperCase())

    if (countErr) return { error: 'Could not validate session capacity.' }
    if ((count ?? 0) >= MAX_PER_SESSION) {
      return { error: 'This session has reached its contact limit.' }
    }

    // ── Duplicate phone check ──
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('session_code', sessionCode.toUpperCase())
      .eq('phone', clean.phone)
      .maybeSingle()

    if (existing) {
      return { error: 'This phone number has already been submitted to this session.' }
    }

    // ── Insert ──
    const { data, error: err } = await supabase
      .from('contacts')
      .insert({
        session_code: sessionCode.toUpperCase(),
        name:         clean.name,
        phone:        clean.phone,
        created_at:   new Date().toISOString(),
      })
      .select()
      .single()

    if (err) return { data: null, error: err.message }
    return { data, error: null }
  }, [])

  /**
   * Delete a single contact (owner only — enforced by Supabase RLS).
   */
  const deleteContact = useCallback(async (contactId) => {
    const { error: err } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
    return { error: err?.message ?? null }
  }, [])

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    submitContact,
    deleteContact,
  }
}
