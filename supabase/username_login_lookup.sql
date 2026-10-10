-- NutriiApp auth: resolve a username to its account email for login.
-- Run in Supabase dashboard > SQL editor, in order, once.
-- Requires supabase/profiles_username_unique.sql to have been run first.
--
-- Why this exists: Supabase Auth only signs in with email (or phone), never
-- with a username. The sign-in form therefore accepts "email or username" and
-- calls this function to resolve usernames. It returns exactly one email for
-- an exact (case-insensitive) username match, or NULL. It cannot list users.
--
-- Privacy note: usernames on this app are already public (profiles are
-- readable for availability checks), but this function hands out the account
-- email behind a username, so anyone who knows a username learns its email.
-- That is the standard trade-off for username login; the password is still
-- verified by Supabase Auth afterwards, and unknown usernames get the same
-- generic "incorrect" error as wrong passwords.

CREATE OR REPLACE FUNCTION public.email_for_username(p_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  IF p_username IS NULL OR trim(p_username) = '' THEN
    RETURN NULL;
  END IF;

  -- Prefer the profiles registry, fall back to auth metadata for users
  -- created before the registry existed.
  SELECT u.email INTO v_email
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE lower(p.username) = lower(trim(p_username))
  LIMIT 1;

  IF v_email IS NULL THEN
    SELECT u.email INTO v_email
    FROM auth.users u
    WHERE lower(nullif(trim(both from u.raw_user_meta_data->>'username'), ''))
      = lower(trim(p_username))
    LIMIT 1;
  END IF;

  RETURN v_email;
END;
$$;

REVOKE ALL ON FUNCTION public.email_for_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.email_for_username(text) TO anon, authenticated;
