-- NutriiApp meal_records: fix schema drift + seed demo meals
-- Run in Supabase dashboard > SQL editor, in order.
-- Part A fixes types/defaults to match schema.md. Part B inserts demo data.

-- A1: owner_id must stay nullable with no default tonight (auth lands next week).
ALTER TABLE public.meal_records ALTER COLUMN owner_id DROP DEFAULT;

-- A2: log_date should be date, not timestamptz (dashboard groups by day).
ALTER TABLE public.meal_records ALTER COLUMN log_date TYPE date USING log_date::date;
ALTER TABLE public.meal_records ALTER COLUMN log_date SET DEFAULT CURRENT_DATE;
ALTER TABLE public.meal_records ALTER COLUMN log_date SET NOT NULL;

-- A3: timestamps should default to now() and never stay null.
UPDATE public.meal_records SET created_at = now() WHERE created_at IS NULL;
UPDATE public.meal_records SET updated_at = now() WHERE updated_at IS NULL;
ALTER TABLE public.meal_records ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.meal_records ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE public.meal_records ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE public.meal_records ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE public.meal_records ADD COLUMN IF NOT EXISTS calories numeric NOT NULL DEFAULT 0;

-- A4: week 4 only open policy (Session 08 slide 10: new table returns empty list with no error).
-- Remove this when auth + RLS land next week.
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "week4_open_all" ON public.meal_records;
CREATE POLICY "week4_open_all" ON public.meal_records FOR ALL USING (true) WITH CHECK (true);

-- B: demo seed, ported from src/lib/nutrition.ts seedDemoMeals().
-- log_date uses CURRENT_DATE - N so relative days survive. owner_id left NULL.
-- Column map: servings.carbs -> carbohydrates, servings.protein -> proteins, rest direct.
INSERT INTO public.meal_records
  (log_date, meal_category, food_text, quantity, unit, carbohydrates, proteins, fats, vitamins, minerals, water)
VALUES
  (CURRENT_DATE - 0, 'breakfast', 'Oats with banana', 1, 'bowl', 1, 0, 0, 0, 1, 0),
  (CURRENT_DATE - 0, 'lunch', 'Jollof rice with chicken', 1, 'plate', 2, 0, 0, 0, 0, 0),
  (CURRENT_DATE - 0, 'snack', 'Water', 2, 'glass', 0, 0, 0, 0, 0, 4),
  (CURRENT_DATE - 1, 'breakfast', 'Bread with akara', 1, 'portion', 1, 1, 0, 0, 0, 0),
  (CURRENT_DATE - 1, 'dinner', 'Amala with egusi', 1, 'plate', 2, 0, 0, 0, 0, 0),
  (CURRENT_DATE - 2, 'dinner', 'Indomie with egg', 1, 'pack', 0, 2, 1, 0, 0, 0),
  (CURRENT_DATE - 3, 'breakfast', 'Moi moi with pap', 1, 'portion', 1, 1, 0, 0, 0, 0),
  (CURRENT_DATE - 3, 'lunch', 'Vegetable salad', 1, 'bowl', 0, 0, 0, 2, 1, 0),
  (CURRENT_DATE - 4, 'lunch', 'Fried rice with turkey', 1, 'plate', 2, 0, 0, 0, 0, 0),
  (CURRENT_DATE - 5, 'dinner', 'Yam with egg sauce', 1, 'plate', 0, 2, 1, 0, 0, 0),
  (CURRENT_DATE - 6, 'snack', 'Fruit bowl', 1, 'bowl', 0, 0, 0, 2, 0, 1),
  (CURRENT_DATE - 7, 'dinner', 'Eba with okra', 1, 'plate', 0, 0, 0, 2, 1, 0),
  (CURRENT_DATE - 8, 'snack', 'Suya', 1, 'portion', 0, 2, 1, 0, 0, 0),
  (CURRENT_DATE - 9, 'lunch', 'Rice with beans', 1, 'plate', 2, 0, 0, 0, 0, 0);
