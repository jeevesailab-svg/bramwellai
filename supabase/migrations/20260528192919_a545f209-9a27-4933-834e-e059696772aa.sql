-- Restrict users UPDATE to safe columns only; prevent paywall bypass
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND payment_status = (SELECT payment_status FROM public.users WHERE id = auth.uid())
  AND sessions_purchased = (SELECT sessions_purchased FROM public.users WHERE id = auth.uid())
  AND sessions_completed = (SELECT sessions_completed FROM public.users WHERE id = auth.uid())
  AND minutes_per_session = (SELECT minutes_per_session FROM public.users WHERE id = auth.uid())
  AND access_expires_at IS NOT DISTINCT FROM (SELECT access_expires_at FROM public.users WHERE id = auth.uid())
  AND stripe_customer_id IS NOT DISTINCT FROM (SELECT stripe_customer_id FROM public.users WHERE id = auth.uid())
  AND stripe_payment_id IS NOT DISTINCT FROM (SELECT stripe_payment_id FROM public.users WHERE id = auth.uid())
  AND pathway IS NOT DISTINCT FROM (SELECT pathway FROM public.users WHERE id = auth.uid())
);