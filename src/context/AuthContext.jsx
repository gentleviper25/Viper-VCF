/**
 * src/context/AuthContext.jsx
 * Global authentication state via Supabase.
 * Handles email confirmation, Google OAuth, and session persistence.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    if (!userId) { setProfile(null); return }
    const { data } = await supabase
      .from('users')
      .select('id, full_name, email, created_at')
      .eq('id', userId)
      .single()
    setProfile(data ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      fetchProfile(session?.user?.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        await fetchProfile(session?.user?.id)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  /* ── friendly error messages ── */
  function friendlyError(message = '') {
    if (message.includes('Invalid login credentials'))
      return 'Incorrect email or password. Please try again.'
    if (message.includes('Email not confirmed'))
      return 'Please check your email and click the confirmation link before logging in.'
    if (message.includes('User already registered'))
      return 'An account with this email already exists. Try logging in instead.'
    if (message.includes('Password should be at least'))
      return 'Password must be at least 6 characters.'
    if (message.includes('Unable to validate email'))
      return 'Please enter a valid email address.'
    if (message.includes('signup is disabled'))
      return 'Sign-ups are temporarily disabled. Please try again later.'
    if (message.includes('rate limit') || message.includes('too many'))
      return 'Too many attempts. Please wait a moment and try again.'
    return message || 'Something went wrong. Please try again.'
  }

  async function signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email:    email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw new Error(friendlyError(error.message))

    // Insert profile row (trigger also does this, belt-and-suspenders)
    if (data.user) {
      await supabase.from('users').upsert({
        id:        data.user.id,
        full_name: fullName.trim(),
        email:     email.trim().toLowerCase(),
      }, { onConflict: 'id', ignoreDuplicates: true })
    }
    return data
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    })
    if (error) throw new Error(friendlyError(error.message))
    return data
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) throw new Error(friendlyError(error.message))
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isAuthenticated: !!user,
      signUp, signIn, signInWithGoogle, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>')
  return ctx
}

export default AuthContext
