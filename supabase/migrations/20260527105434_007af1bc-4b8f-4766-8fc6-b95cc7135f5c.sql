ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS last_question_worked_on text,
  ADD COLUMN IF NOT EXISTS practice_focus text;