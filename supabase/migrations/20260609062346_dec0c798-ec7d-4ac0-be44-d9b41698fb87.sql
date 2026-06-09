
-- Make the handler idempotent (safe if a row already exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
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
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        first_name = COALESCE(NULLIF(public.users.first_name, ''), EXCLUDED.first_name);
  RETURN NEW;
END;
$$;

-- Attach trigger (drop first so this migration is re-runnable)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profile rows for any auth users missing one
INSERT INTO public.users (id, email, first_name)
SELECT au.id,
       au.email,
       COALESCE(au.raw_user_meta_data->>'first_name', '')
FROM auth.users au
LEFT JOIN public.users u ON u.id = au.id
WHERE u.id IS NULL;
