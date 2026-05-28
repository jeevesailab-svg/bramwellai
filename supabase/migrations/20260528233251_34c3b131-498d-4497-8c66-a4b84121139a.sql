
-- Diagnostic sessions: anonymous free voice diagnostics. Tracks per-IP usage
-- (for rate limiting) and stores final structured results when Bramwell calls
-- the submitDiagnostic client tool.
CREATE TABLE public.diagnostic_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  -- Captured at the end of the session
  first_name TEXT,
  email TEXT,
  communication_type TEXT,
  readiness_score INTEGER,
  gaps JSONB,
  career_moment TEXT,
  recommended_pathway TEXT,
  recommended_pathway_name TEXT,
  recommended_price TEXT,
  transcript TEXT
);

CREATE INDEX idx_diagnostic_sessions_ip_created
  ON public.diagnostic_sessions (ip_address, created_at DESC);

GRANT ALL ON public.diagnostic_sessions TO service_role;

ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: only the service role (server routes)
-- ever reads or writes this table.
