-- NutriiApp meal_records: tie owner_id to profiles + give existing data to BigYems.
-- Run in Supabase dashboard > SQL editor, in order, once.
-- Requires supabase/profiles_username_unique.sql to have been run first.
--
-- Effect: every existing unowned meal (plus meals of deleted users) becomes
-- BigYems', owner_id becomes a
-- non-null FK to public.profiles(id), and RLS flips from the week-4 open
-- policy to owner-only (users see and touch only what they uploaded).
-- NOTE: after this, new inserts must send owner_id = the signed-in user's id.

-- 0: profiles registry must exist first.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    RAISE EXCEPTION 'public.profiles is missing. Run supabase/profiles_username_unique.sql first.';
  END IF;
END $$;

-- 1: resolve BigYems (case-insensitive) and move every unowned meal to them.
-- Ground truth is auth.users: a profiles row without an auth user is a ghost
-- and is removed (its meals are reassigned in step 2). Rows already owned by
-- someone else are left alone and reported.
DO $$
DECLARE
  v_auth uuid;
  v_prof uuid;
  v_bigyems uuid;
  v_moved integer := 0;
  v_others integer := 0;
BEGIN
  SELECT u.id INTO v_auth
  FROM auth.users u
  WHERE lower(nullif(trim(both from u.raw_user_meta_data->>'username'), '')) = 'bigyems'
  LIMIT 1;

  SELECT p.id INTO v_prof
  FROM public.profiles p
  WHERE lower(p.username) = 'bigyems'
  LIMIT 1;

  IF v_prof IS NOT NULL AND v_prof IS DISTINCT FROM v_auth THEN
    DELETE FROM public.profiles WHERE id = v_prof;
    RAISE NOTICE 'Removed orphaned profiles row (%) claiming username BigYems.', v_prof;
  END IF;

  IF v_auth IS NULL THEN
    RAISE EXCEPTION 'No user with username BigYems found. Sign up (or set the username) as BigYems first, then re-run.';
  END IF;
  v_bigyems := v_auth;

  -- Guarantee the FK target row exists and carries the name, even if BigYems
  -- signed up before profiles existed or renamed since.
  INSERT INTO public.profiles (id, username) VALUES (v_bigyems, 'BigYems')
  ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_bigyems) THEN
    RAISE EXCEPTION 'Could not ensure a profiles row for BigYems (%).', v_bigyems;
  END IF;

  UPDATE public.meal_records SET owner_id = v_bigyems WHERE owner_id IS NULL;
  GET DIAGNOSTICS v_moved = ROW_COUNT;
  SELECT count(*) INTO v_others
  FROM public.meal_records
  WHERE owner_id IS DISTINCT FROM v_bigyems;
  RAISE NOTICE 'Moved % meal_records to BigYems (%). % rows owned by someone else were left alone.',
    v_moved, v_bigyems, v_others;
END $$;

-- 2: profiles rows can only target live auth users (the FK rejects ghosts), so
-- meals owned by deleted users are reassigned to BigYems first; the remaining
-- (still existing) owners each get a profiles row so the FK below validates.
DO $$
DECLARE
  v_bigyems uuid;
  v_moved integer := 0;
BEGIN
  SELECT p.id INTO v_bigyems
  FROM public.profiles p
  WHERE lower(p.username) = 'bigyems'
  LIMIT 1;

  IF v_bigyems IS NULL THEN
    RAISE EXCEPTION 'BigYems profiles row missing at step 2. Re-run the script from the top.';
  END IF;

  UPDATE public.meal_records m
  SET owner_id = v_bigyems
  WHERE m.owner_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = m.owner_id);
  GET DIAGNOSTICS v_moved = ROW_COUNT;
  RAISE NOTICE 'Reassigned % meal_records from deleted users to BigYems.', v_moved;
END $$;

-- Username left NULL; those users can set it in the app (uniqueness enforced there).
INSERT INTO public.profiles (id, username)
SELECT DISTINCT m.owner_id, NULL
FROM public.meal_records m
WHERE m.owner_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = m.owner_id)
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = m.owner_id)
ON CONFLICT (id) DO NOTHING;

-- 3: tie owner_id to profiles.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'meal_records_owner_id_fkey') THEN
    ALTER TABLE public.meal_records
      ADD CONSTRAINT meal_records_owner_id_fkey
      FOREIGN KEY (owner_id) REFERENCES public.profiles (id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4: every meal must have an owner from here on.
ALTER TABLE public.meal_records ALTER COLUMN owner_id SET NOT NULL;

-- 5: owner-only access. Replaces the week-4 open policy: users see and touch
-- only rows they uploaded. Reads need no app change (RLS filters); inserts
-- must send owner_id = the signed-in user's id (app wiring is next).
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "week4_open_all" ON public.meal_records;
DROP POLICY IF EXISTS "meal_records_owner_select" ON public.meal_records;
CREATE POLICY "meal_records_owner_select" ON public.meal_records
  FOR SELECT USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "meal_records_owner_insert" ON public.meal_records;
CREATE POLICY "meal_records_owner_insert" ON public.meal_records
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "meal_records_owner_update" ON public.meal_records;
CREATE POLICY "meal_records_owner_update" ON public.meal_records
  FOR UPDATE USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "meal_records_owner_delete" ON public.meal_records;
CREATE POLICY "meal_records_owner_delete" ON public.meal_records
  FOR DELETE USING (auth.uid() = owner_id);
