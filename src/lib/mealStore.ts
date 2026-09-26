import { analyzeMeal, seedDemoMeals, type MealEntry } from './nutrition'

const STORAGE_KEY = 'nutriiapp-demo-meals'

function loadMeals(): MealEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MealEntry[]
      if (Array.isArray(parsed)) {
        if (parsed.every((meal) => typeof meal.calories === 'number' && typeof meal.loggedAt === 'string')) {
          return parsed
        }
        const migrated = parsed.map((meal) => {
          const analysis = analyzeMeal(meal.text ?? '', meal.quantity ?? 1)
          return {
            ...meal,
            loggedAt: typeof meal.loggedAt === 'string' ? meal.loggedAt : '12:00',
            servings: meal.servings ?? analysis.servings,
            calories: typeof meal.calories === 'number' ? meal.calories : analysis.calories,
          }
        })
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
        } catch {
          // ignore write failures in demo mode
        }
        return migrated
      }
    }
  } catch {
    // fall through to seed data
  }
  const seeded = seedDemoMeals()
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  } catch {
    // storage unavailable, keep in memory only
  }
  return seeded
}

let meals: MealEntry[] = loadMeals()
const listeners = new Set<() => void>()

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meals))
  } catch {
    // ignore write failures in demo mode
  }
}

function emit() {
  persist()
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

export function addMeal(entry: MealEntry) {
  meals = [...meals, entry]
  emit()
}

export function updateMeal(id: string, patch: Partial<MealEntry>) {
  meals = meals.map((meal) => (meal.id === id ? { ...meal, ...patch } : meal))
  emit()
}

export function mealsForDate(list: MealEntry[], date: string): MealEntry[] {
  return list.filter((meal) => meal.date === date)
}
