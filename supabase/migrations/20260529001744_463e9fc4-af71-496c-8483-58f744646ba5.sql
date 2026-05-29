DROP POLICY IF EXISTS "Users insert own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users update own sessions" ON public.sessions;
REVOKE INSERT, UPDATE ON public.sessions FROM authenticated;