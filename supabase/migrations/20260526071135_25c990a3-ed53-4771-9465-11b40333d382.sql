
-- Lock down the signup trigger function (only trigger context should invoke it)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Re-scope quiz_leads insert policy to specific roles (still allows anonymous submissions, but no PUBLIC pseudo-role)
DROP POLICY IF EXISTS "Anyone can insert quiz lead" ON public.quiz_leads;
CREATE POLICY "Anon or authed can insert quiz lead"
  ON public.quiz_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
