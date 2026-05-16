-- ═══════════════════════════════════════════════════════════════════════════
-- Viper VCF — Useful Admin SQL Queries
-- Run in Supabase SQL Editor as needed.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Sessions overview with contact count ───────────────────────────────────
SELECT
  u.full_name        AS owner,
  s.title,
  s.session_code,
  s.is_active,
  s.expiry_date,
  s.created_at,
  COUNT(c.id)        AS contact_count
FROM public.sessions s
JOIN public.users    u ON u.id = s.user_id
LEFT JOIN public.contacts c ON c.session_code = s.session_code
GROUP BY s.id, u.full_name
ORDER BY s.created_at DESC;

-- ── 2. Total contacts per user ────────────────────────────────────────────────
SELECT
  u.full_name,
  u.email,
  COUNT(DISTINCT s.id)  AS session_count,
  COUNT(c.id)           AS total_contacts
FROM public.users u
LEFT JOIN public.sessions s ON s.user_id = u.id
LEFT JOIN public.contacts c ON c.session_code = s.session_code
GROUP BY u.id
ORDER BY total_contacts DESC;

-- ── 3. Manually deactivate all expired sessions ───────────────────────────────
UPDATE public.sessions
SET    is_active = FALSE
WHERE  expiry_date <= now()
  AND  is_active  = TRUE
RETURNING session_code, title, expiry_date;

-- ── 4. Delete sessions older than 90 days with zero contacts ─────────────────
DELETE FROM public.sessions
WHERE  created_at < now() - INTERVAL '90 days'
  AND  id NOT IN (
    SELECT DISTINCT s.id
    FROM public.sessions s
    JOIN public.contacts c ON c.session_code = s.session_code
  )
RETURNING title, session_code;

-- ── 5. Most active sessions (last 24h submissions) ────────────────────────────
SELECT
  c.session_code,
  s.title,
  COUNT(c.id) AS submissions_last_24h
FROM public.contacts c
JOIN public.sessions s ON s.session_code = c.session_code
WHERE c.created_at > now() - INTERVAL '24 hours'
GROUP BY c.session_code, s.title
ORDER BY submissions_last_24h DESC
LIMIT 20;

-- ── 6. Check RLS policies ────────────────────────────────────────────────────
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
