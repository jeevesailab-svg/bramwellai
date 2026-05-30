-- Enable RLS on diagnostic_sessions. The diagnostic server routes
-- (src/routes/api/public/diagnostic-*.ts) use supabaseAdmin which
-- bypasses RLS, so functionality is preserved. Direct anon/authenticated
-- access is denied by default with no policies attached.
ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;

-- Revoke any broad direct grants so only service_role (used by admin client) can touch it.
REVOKE ALL ON public.diagnostic_sessions FROM anon;
REVOKE ALL ON public.diagnostic_sessions FROM authenticated;
GRANT ALL ON public.diagnostic_sessions TO service_role;