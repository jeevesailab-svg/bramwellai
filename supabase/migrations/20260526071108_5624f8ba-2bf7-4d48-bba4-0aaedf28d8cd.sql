
-- USERS profile table (linked to auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_customer_id TEXT,
  stripe_payment_id TEXT,
  pathway TEXT,
  sessions_purchased INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  minutes_per_session INTEGER NOT NULL DEFAULT 45,
  access_expires_at TIMESTAMPTZ,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  communication_type TEXT,
  quiz_urgency TEXT,
  cv_text TEXT,
  jd_text TEXT,
  jd_key_phrases TEXT,
  last_readiness_score INTEGER,
  upsell_shown BOOLEAN NOT NULL DEFAULT false,
  source TEXT
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SESSIONS table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pathway TEXT,
  session_number INTEGER,
  duration_minutes INTEGER,
  questions_covered TEXT,
  strongest_moment TEXT,
  practice_focus TEXT,
  homework_instructions TEXT,
  readiness_score_start INTEGER,
  readiness_score_end INTEGER,
  clarity_score INTEGER,
  confidence_score INTEGER,
  authority_score INTEGER,
  evidence_score INTEGER,
  transcript TEXT,
  session_status TEXT NOT NULL DEFAULT 'completed',
  upsell_shown BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- QUIZ LEADS (public free benchmark)
CREATE TABLE public.quiz_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  first_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  communication_type TEXT,
  career_moment TEXT,
  urgency TEXT,
  recommended_pathway TEXT,
  recommended_price TEXT,
  converted_to_paid BOOLEAN NOT NULL DEFAULT false,
  source TEXT
);

ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;

-- Anyone (even anonymous) can submit a quiz lead
CREATE POLICY "Anyone can insert quiz lead" ON public.quiz_leads
  FOR INSERT WITH CHECK (true);
-- Authenticated users can read their own lead by email
CREATE POLICY "Authed users read own leads" ON public.quiz_leads
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- STORY BANK
CREATE TABLE public.story_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  question TEXT,
  answer_final TEXT,
  readiness_score INTEGER,
  notes TEXT
);

ALTER TABLE public.story_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own stories" ON public.story_bank
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own stories" ON public.story_bank
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own stories" ON public.story_bank
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own stories" ON public.story_bank
  FOR DELETE USING (auth.uid() = user_id);
