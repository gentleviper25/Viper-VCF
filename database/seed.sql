-- ═══════════════════════════════════════════════════════════════════════════
-- Viper VCF — Sample Seed Data (DEV / TESTING ONLY)
-- Run AFTER schema.sql.
-- Replace UUIDs with real auth.users IDs from your Supabase project.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Create a test session ────────────────────────────────────────────────────
-- Replace 'YOUR-USER-UUID-HERE' with a real user ID from auth.users
INSERT INTO public.sessions (
  id, user_id, title, description,
  session_code, whatsapp_link, telegram_link,
  expiry_date, is_active, created_at
) VALUES (
  gen_random_uuid(),
  'YOUR-USER-UUID-HERE',
  'Lagos Tech Meetup Q1 2025',
  'Collect contacts for our upcoming tech meetup. Join the WhatsApp group after submitting.',
  'LAGOSMEET25',
  'https://chat.whatsapp.com/example',
  NULL,
  now() + INTERVAL '7 days',
  TRUE,
  now()
) ON CONFLICT DO NOTHING;

-- ── Sample contacts ──────────────────────────────────────────────────────────
INSERT INTO public.contacts (id, session_code, name, phone, created_at) VALUES
  (gen_random_uuid(), 'LAGOSMEET25', 'Chukwuemeka Obi',   '+2348012345678', now() - INTERVAL '2 hours'),
  (gen_random_uuid(), 'LAGOSMEET25', 'Fatima Al-Hassan',  '+2348023456789', now() - INTERVAL '1 hour 45 min'),
  (gen_random_uuid(), 'LAGOSMEET25', 'Tunde Adeyemi',     '+2348034567890', now() - INTERVAL '1 hour 30 min'),
  (gen_random_uuid(), 'LAGOSMEET25', 'Ngozi Eze',         '+2348045678901', now() - INTERVAL '1 hour 10 min'),
  (gen_random_uuid(), 'LAGOSMEET25', 'Bola Akinwande',    '+2348056789012', now() - INTERVAL '55 minutes'),
  (gen_random_uuid(), 'LAGOSMEET25', 'Kemi Olatunde',     '+2348067890123', now() - INTERVAL '40 minutes'),
  (gen_random_uuid(), 'LAGOSMEET25', 'Emeka Nwosu',       '+2348078901234', now() - INTERVAL '28 minutes'),
  (gen_random_uuid(), 'LAGOSMEET25', 'Aisha Musa',        '+2348089012345', now() - INTERVAL '12 minutes')
ON CONFLICT DO NOTHING;

-- ── Create an expired test session ──────────────────────────────────────────
INSERT INTO public.sessions (
  id, user_id, title, description,
  session_code, whatsapp_link, telegram_link,
  expiry_date, is_active, created_at
) VALUES (
  gen_random_uuid(),
  'YOUR-USER-UUID-HERE',
  'Abuja Dev Summit (Expired)',
  'Contacts from the Abuja Developer Summit.',
  'ABUJADEV24',
  NULL,
  'https://t.me/example',
  now() - INTERVAL '2 days',
  FALSE,
  now() - INTERVAL '10 days'
) ON CONFLICT DO NOTHING;

INSERT INTO public.contacts (id, session_code, name, phone, created_at) VALUES
  (gen_random_uuid(), 'ABUJADEV24', 'Ibrahim Yusuf',   '+2348011111111', now() - INTERVAL '5 days'),
  (gen_random_uuid(), 'ABUJADEV24', 'Chioma Okafor',   '+2348022222222', now() - INTERVAL '5 days'),
  (gen_random_uuid(), 'ABUJADEV24', 'Musa Garba',      '+2348033333333', now() - INTERVAL '4 days')
ON CONFLICT DO NOTHING;

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT s.title, s.session_code, s.is_active, COUNT(c.id) AS contacts
FROM public.sessions s
LEFT JOIN public.contacts c ON c.session_code = s.session_code
GROUP BY s.id, s.title, s.session_code, s.is_active;
