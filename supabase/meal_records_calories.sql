-- Run this once in Supabase SQL editor for existing deployments.
ALTER TABLE public.meal_records ADD COLUMN IF NOT EXISTS calories numeric NOT NULL DEFAULT 0;
