ALTER TABLE public.diagnostic_sessions
  ADD COLUMN IF NOT EXISTS metrics jsonb;