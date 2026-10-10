-- Fix signups failing with 23503 on profiles (profiles_id_fkey).
-- The original trigger ran BEFORE INSERT on auth.users, so the profiles row
-- was inserted before its parent auth row existed and the FK rejected it.
-- AFTER INSERT fixes that; a taken username still aborts the whole signup.
-- Run in Supabase dashboard > SQL editor, once.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
