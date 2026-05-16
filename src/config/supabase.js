/**
 * src/config/supabase.js
 * Supabase client — uses ANON (public) key only. Never use the service_role key here.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    '❌ Missing Supabase env vars.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.\n' +
    'Get them from: Supabase Dashboard → Settings → API → Project API keys → anon/public'
  )
}

// Guard: warn if someone accidentally put the secret service_role key here
if (supabaseAnon.includes('service_role') || supabaseAnon.length > 500) {
  console.error(
    '🚨 SECURITY WARNING: You appear to be using the service_role (secret) key.\n' +
    'Use the "anon" / "public" key instead. The service_role key must NEVER be in frontend code.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: true,
    storageKey:         'viper-vcf-auth-v1',
    flowType:           'pkce',
  },
})

export default supabase
