import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    '🚨 Missing Supabase env vars. Copy .env.example → .env and fill in your keys.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: true,
    storageKey: 'viper-vcf-auth-v1',
    flowType: 'pkce', // PKCE flow — safer than implicit
  },
  global: {
    headers: {
      'X-Client-Info': 'viper-vcf/1.0',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})

export default supabase
