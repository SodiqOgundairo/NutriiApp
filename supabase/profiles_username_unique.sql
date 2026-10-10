-- NutriiApp profiles: enforce unique usernames (case-insensitive).
-- Run in Supabase dashboard > SQL editor, in order, once.
--
-- Why this exists: Supabase Auth does not enforce unique usernames in
-- user_metadata, and anon clients cannot read auth.users. This table is the
-- registry the app checks before signup, and the unique index plus the
-- trigger below are the backstop against two people claiming one name.
-- Username matching is case-insensitive: "Ahmed" and "ahmed" collide.

-- 1: registry table. One row per auth user.
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  username text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2: usernames unique ignoring case. NULLs (users without a name yet) do not collide.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique
  ON public.profiles (lower(username));

-- 3: RLS. Usernames are public identifiers: anyone may read them for
-- availability checks, users may only write their own row.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4: backfill rows for users who signed up before this migration.
-- First row wins per lowercase name; later duplicates keep no row until renamed.
INSERT INTO public.profiles (id, username)
SELECT DISTINCT ON (lower(trim(both from u.raw_user_meta_data->>'username')))
  u.id,
  nullif(trim(both from u.raw_user_meta_data->>'username'), '')
FROM auth.users u
WHERE nullif(trim(both from u.raw_user_meta_data->>'username'), '') IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ORDER BY
  lower(trim(both from u.raw_user_meta_data->>'username')),
  u.created_at ASC
ON CONFLICT DO NOTHING;

-- 5: atomic backstop. Reserves the username inside the signup transaction,
-- so two simultaneous signups for one name cannot both succeed. Raised as
-- errcode 23505; note Supabase may surface trigger failures to the client
-- as a generic "Database error saving new user", which is why the app also
-- pre-checks availability and shows the friendly message itself.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_username text := nullif(trim(both from coalesce(NEW.raw_user_meta_data->>'username', '')), '');
BEGIN
  IF v_username IS NULL THEN
    INSERT INTO public.profiles (id, username) VALUES (NEW.id, NULL);
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(v_username)) THEN
    RAISE EXCEPTION 'Username is already taken.' USING ERRCODE = '23505';
  END IF;
  INSERT INTO public.profiles (id, username) VALUES (NEW.id, v_username);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- AFTER (not BEFORE): the auth.users row must exist first, otherwise the
-- profiles FK rejects every signup. Raising here still rolls the signup back.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
