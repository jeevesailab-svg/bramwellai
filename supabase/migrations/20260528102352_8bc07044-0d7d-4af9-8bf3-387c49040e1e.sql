
-- 1) Allow users to delete their own profile (right to erasure)
CREATE POLICY "Users can delete own profile"
ON public.users
FOR DELETE
USING (auth.uid() = id);

-- 2) Remove the JWT-email-based SELECT policy on quiz_leads.
-- Leads are a lead-gen funnel; reads should go through service role only.
DROP POLICY IF EXISTS "Authed users read own leads" ON public.quiz_leads;

-- 3) Replace the permissive INSERT (WITH CHECK true) with a basic validity check.
DROP POLICY IF EXISTS "Anon or authed can insert quiz lead" ON public.quiz_leads;

CREATE POLICY "Anon or authed can insert quiz lead"
ON public.quiz_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) <= 255
  AND first_name IS NOT NULL
  AND length(first_name) <= 80
  AND converted_to_paid = false
);
