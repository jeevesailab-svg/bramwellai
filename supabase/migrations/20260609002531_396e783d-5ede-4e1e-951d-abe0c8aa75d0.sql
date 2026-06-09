-- 1. Transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  stripe_subscription_id text,
  stripe_customer_id text,
  price_id text NOT NULL,
  product_id text,
  pathway text,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'aud',
  status text NOT NULL DEFAULT 'completed',
  environment text NOT NULL DEFAULT 'sandbox',
  customer_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_stripe_session ON public.transactions(stripe_session_id);

GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages transactions"
  ON public.transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 2. Subscription columns on users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS subscription_price_id text,
  ADD COLUMN IF NOT EXISTS welcome_shown boolean NOT NULL DEFAULT false;

-- 3. Drop the over-strict update policy that blocked the user's own row from
--    being updated by service-role-style writes via RPCs. Re-create a policy
--    that lets users update their non-financial fields (cv_text etc), and
--    leaves financial fields exclusively to service_role.
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND payment_status = (SELECT payment_status FROM public.users WHERE id = auth.uid())
    AND sessions_purchased = (SELECT sessions_purchased FROM public.users WHERE id = auth.uid())
    AND minutes_per_session = (SELECT minutes_per_session FROM public.users WHERE id = auth.uid())
    AND NOT (access_expires_at IS DISTINCT FROM (SELECT access_expires_at FROM public.users WHERE id = auth.uid()))
    AND NOT (stripe_subscription_id IS DISTINCT FROM (SELECT stripe_subscription_id FROM public.users WHERE id = auth.uid()))
    AND NOT (subscription_status IS DISTINCT FROM (SELECT subscription_status FROM public.users WHERE id = auth.uid()))
    AND subscription_cancel_at_period_end = (SELECT subscription_cancel_at_period_end FROM public.users WHERE id = auth.uid())
  );

GRANT ALL ON public.users TO service_role;