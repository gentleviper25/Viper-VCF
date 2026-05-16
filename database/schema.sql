-- ═══════════════════════════════════════════════════════════════════════════
-- Viper VCF — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. users ─────────────────────────────────────────────────────────────────
-- Mirrors auth.users with a public profile.
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email       TEXT        NOT NULL UNIQUE CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies: users can only read/update their own row
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ─── 2. sessions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sessions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title          TEXT        NOT NULL CHECK (char_length(title) BETWEEN 3 AND 120),
  description    TEXT                 CHECK (char_length(description) <= 500),
  session_code   TEXT        NOT NULL UNIQUE CHECK (session_code ~ '^[A-Z0-9]{6,14}$'),
  whatsapp_link  TEXT                 CHECK (whatsapp_link IS NULL OR whatsapp_link ~* '^https?://'),
  telegram_link  TEXT                 CHECK (telegram_link IS NULL OR telegram_link ~* '^https?://'),
  expiry_date    TIMESTAMPTZ NOT NULL CHECK (expiry_date > created_at),
  is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast code lookups (used on every public page load)
CREATE INDEX IF NOT EXISTS sessions_code_idx     ON public.sessions (session_code);
CREATE INDEX IF NOT EXISTS sessions_user_idx     ON public.sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx   ON public.sessions (expiry_date);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Owner: full CRUD on their sessions
CREATE POLICY "sessions_owner_all"
  ON public.sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public: anyone can read a session (for the public submit page)
CREATE POLICY "sessions_public_read"
  ON public.sessions FOR SELECT
  USING (TRUE);

-- ─── 3. contacts ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code  TEXT        NOT NULL REFERENCES public.sessions(session_code) ON DELETE CASCADE,
  name          TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  phone         TEXT        NOT NULL CHECK (phone ~ '^\+?[0-9][0-9\s\-()]{5,18}[0-9]$'),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent the same phone number submitting twice to the same session
  UNIQUE (session_code, phone)
);

CREATE INDEX IF NOT EXISTS contacts_session_idx ON public.contacts (session_code);
CREATE INDEX IF NOT EXISTS contacts_phone_idx   ON public.contacts (session_code, phone);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Public insert: anyone can submit a contact (if session is valid)
-- The application layer enforces expiry; DB enforces integrity.
CREATE POLICY "contacts_public_insert"
  ON public.contacts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.session_code = contacts.session_code
        AND s.is_active    = TRUE
        AND s.expiry_date  > now()
    )
  );

-- Owner: can read and delete contacts for their own sessions
CREATE POLICY "contacts_owner_read"
  ON public.contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.session_code = contacts.session_code
        AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "contacts_owner_delete"
  ON public.contacts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions s
      WHERE s.session_code = contacts.session_code
        AND s.user_id = auth.uid()
    )
  );

-- ─── 4. Auto-deactivate expired sessions (DB function + cron) ────────────────
CREATE OR REPLACE FUNCTION public.deactivate_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.sessions
  SET    is_active = FALSE
  WHERE  expiry_date <= now()
    AND  is_active  = TRUE;
END;
$$;

-- Schedule via pg_cron (enable in Supabase: Database → Extensions → pg_cron)
-- SELECT cron.schedule('deactivate-expired', '*/5 * * * *', 'SELECT public.deactivate_expired_sessions()');

-- ─── 5. Helper view: sessions with contact count ──────────────────────────────
CREATE OR REPLACE VIEW public.sessions_with_count AS
SELECT
  s.*,
  COUNT(c.id) AS contact_count
FROM public.sessions s
LEFT JOIN public.contacts c ON c.session_code = s.session_code
GROUP BY s.id;

-- ─── 6. Trigger: auto-create user profile on auth sign-up ────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Done ────────────────────────────────────────────────────────────────────
-- Verify:
-- SELECT * FROM public.users;
-- SELECT * FROM public.sessions;
-- SELECT * FROM public.contacts;
