ALTER TABLE public.diagnostic_sessions
  ADD COLUMN IF NOT EXISTS needs_followup boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ended_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_needs_followup
  ON public.diagnostic_sessions (needs_followup, created_at DESC)
  WHERE needs_followup = true;