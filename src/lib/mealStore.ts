import { analyzeMeal, MEAL_CATEGORIES, type MealCategory, type MealEntry } from './nutrition'
import { isSupabaseConfigured, supabase } from './supabase'

// Supabase is the source of truth. No localStorage, no seeded demo meals.
// Reads map meal_records rows to MealEntry; writes map back to columns.

interface MealRecordRow {
  id: string
  log_date: string
  meal_category: string | null
  food_text: string | null
  quantity: number | string | null
  unit: string | null
  carbohydrates: number | string | null
  proteins: number | string | null
  fats: number | string | null
  vitamins: number | string | null
  minerals: number | string | null
  water: number | string | null
  calories: number | string | null
  created_at: string | null
}

function num(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function rowToMeal(row: MealRecordRow): MealEntry {
  const text = row.food_text ?? ''
  const quantity = Number(row.quantity) || 1
  const category: MealCategory = MEAL_CATEGORIES.includes(row.meal_category as MealCategory)
    ? (row.meal_category as MealCategory)
    : 'lunch'
  let loggedAt = '12:00'
  if (row.created_at) {
    const created = new Date(row.created_at)
    if (!Number.isNaN(created.getTime())) {
      loggedAt = `${String(created.getHours()).padStart(2, '0')}:${String(created.getMinutes()).padStart(2, '0')}`
    }
  }
  return {
    id: String(row.id),
    date: String(row.log_date).slice(0, 10),
    loggedAt,
    text,
    quantity,
    unit: row.unit ?? 'portion',
    category,
    servings: {
      protein: num(row.proteins),
      carbs: num(row.carbohydrates),
      fats: num(row.fats),
      vitamins: num(row.vitamins),
      minerals: num(row.minerals),
      water: num(row.water),
    },
    calories: row.calories == null ? analyzeMeal(text, quantity).calories : num(row.calories),
  }
}

let meals: MealEntry[] = []
let loaded = false
let loadError: string | null = isSupabaseConfigured ? null : 'Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribeMeals(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getMealsSnapshot(): MealEntry[] {
  return meals
}

export function getMealsError(): string | null {
  return loadError
}

export function isMealsLoaded(): boolean {
  return loaded
}

export async function refreshMeals(): Promise<void> {
  if (!supabase) {
    loadError = 'Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
    emit()
    return
  }
  const { data, error } = await supabase
    .from('meal_records')
    .select('*')
    .order('log_date', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) {
    loadError = error.message
    console.error('[meals] read failed:', error.message)
    emit()
    return
  }
  loadError = null
  loaded = true
  meals = ((data ?? []) as MealRecordRow[]).map(rowToMeal)
  emit()
}

void refreshMeals()

export async function addMeal(input: Omit<MealEntry, 'id' | 'loggedAt'>): Promise<void> {
  if (!supabase) {
    loadError = 'Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
    emit()
    throw new Error(loadError)
  }
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError) {
    console.error('[meals] auth lookup failed:', userError.message)
    throw new Error('Could not verify your signed-in account. Please sign in again.')
  }
  if (!user) {
    throw new Error('You must be signed in to log a meal.')
  }
  const { data, error } = await supabase
    .from('meal_records')
    .insert({
      log_date: input.date,
      meal_category: input.category,
      food_text: input.text,
      quantity: input.quantity,
      unit: input.unit,
      carbohydrates: input.servings.carbs,
      proteins: input.servings.protein,
      fats: input.servings.fats,
      vitamins: input.servings.vitamins,
      minerals: input.servings.minerals,
      water: input.servings.water,
      owner_id: user.id,
      calories: input.calories,
    })
    .select()
    .single()
  if (error) {
    loadError = error.message
    console.error('[meals] write failed:', error.message)
    emit()
    throw new Error(error.message)
  }
  loadError = null
  meals = [...meals, rowToMeal(data as MealRecordRow)]
  emit()
}

export async function updateMeal(id: string, patch: Partial<MealEntry>): Promise<void> {
  if (!supabase) {
    loadError = 'Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
    emit()
    throw new Error(loadError)
  }
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (patch.date !== undefined) payload.log_date = patch.date
  if (patch.category !== undefined) payload.meal_category = patch.category
  if (patch.text !== undefined) payload.food_text = patch.text
  if (patch.quantity !== undefined) payload.quantity = patch.quantity
  if (patch.unit !== undefined) payload.unit = patch.unit
  if (patch.calories !== undefined) payload.calories = patch.calories
  if (patch.servings !== undefined) {
    payload.carbohydrates = patch.servings.carbs
    payload.proteins = patch.servings.protein
    payload.fats = patch.servings.fats
    payload.vitamins = patch.servings.vitamins
    payload.minerals = patch.servings.minerals
    payload.water = patch.servings.water
  }
  const { data, error } = await supabase
    .from('meal_records')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    loadError = error.message
    console.error('[meals] update failed:', error.message)
    emit()
    throw new Error(error.message)
  }
  loadError = null
  meals = meals.map((meal) => (meal.id === id ? rowToMeal(data as MealRecordRow) : meal))
  emit()
}

export function mealsForDate(list: MealEntry[], date: string): MealEntry[] {
  return list.filter((meal) => meal.date === date)
}
