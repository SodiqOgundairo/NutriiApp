export type FoodClass = 'protein' | 'carbs' | 'fats' | 'vitamins' | 'minerals' | 'water'

export const FOOD_CLASSES: FoodClass[] = ['protein', 'carbs', 'fats', 'vitamins', 'minerals', 'water']

export const FOOD_CLASS_LABELS: Record<FoodClass, string> = {
  protein: 'Protein',
  carbs: 'Carbs',
  fats: 'Fats',
  vitamins: 'Vitamins',
  minerals: 'Minerals',
  water: 'Water',
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export const MEAL_CATEGORIES: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack']

export type Servings = Record<FoodClass, number>

export interface MealEntry {
  id: string
  date: string
  loggedAt: string
  text: string
  quantity: number
  unit: string
  category: MealCategory
  servings: Servings
  calories: number
}

const emptyServings = (): Servings => ({
  protein: 0,
  carbs: 0,
  fats: 0,
  vitamins: 0,
  minerals: 0,
  water: 0,
})

interface FoodRule {
  match: string[]
  perUnit: Servings
  kcal: number
}

const FOOD_TABLE: FoodRule[] = [
  { match: ['rice', 'jollof', 'fried rice', 'ofada'], perUnit: { ...emptyServings(), carbs: 2 }, kcal: 200 },
  { match: ['beans', 'moi moi', 'akara'], perUnit: { ...emptyServings(), protein: 1, carbs: 1 }, kcal: 180 },
  { match: ['chicken', 'turkey', 'beef', 'fish', 'tilapia', 'croaker', 'egg', 'eggs'], perUnit: { ...emptyServings(), protein: 2, fats: 1 }, kcal: 250 },
  { match: ['yam', 'plantain', 'dodo', 'boli', 'potato', 'sweet potato'], perUnit: { ...emptyServings(), carbs: 2 }, kcal: 220 },
  { match: ['bread', 'agege'], perUnit: { ...emptyServings(), carbs: 2 }, kcal: 150 },
  { match: ['oats', 'pap', 'ogi', 'custard'], perUnit: { ...emptyServings(), carbs: 1, minerals: 1 }, kcal: 120 },
  { match: ['salad', 'vegetable', 'ugu', 'spinach', 'ewedu', 'okra', 'tomato', 'carrot', 'cabbage'], perUnit: { ...emptyServings(), vitamins: 2, minerals: 1 }, kcal: 60 },
  { match: ['fruit', 'banana', 'orange', 'apple', 'mango', 'pineapple', 'watermelon'], perUnit: { ...emptyServings(), vitamins: 2, water: 1 }, kcal: 90 },
  { match: ['avocado', 'pear'], perUnit: { ...emptyServings(), fats: 2, vitamins: 1 }, kcal: 160 },
  { match: ['groundnut', 'peanut', 'cashew', 'kulikuli'], perUnit: { ...emptyServings(), fats: 2, protein: 1 }, kcal: 200 },
  { match: ['milk', 'yoghurt', 'yogurt'], perUnit: { ...emptyServings(), protein: 1, minerals: 1 }, kcal: 100 },
  { match: ['water'], perUnit: { ...emptyServings(), water: 2 }, kcal: 0 },
  { match: ['tea', 'coffee', 'zobo'], perUnit: { ...emptyServings(), water: 1 }, kcal: 10 },
  { match: ['suya'], perUnit: { ...emptyServings(), protein: 2, fats: 1 }, kcal: 300 },
  { match: ['indomie', 'noodles', 'spaghetti', 'pasta'], perUnit: { ...emptyServings(), carbs: 2, fats: 1 }, kcal: 220 },
  { match: ['amala', 'eba', 'fufu', 'pounded yam', 'semo', 'tuwo'], perUnit: { ...emptyServings(), carbs: 2 }, kcal: 250 },
  { match: ['egusi', 'ogbono', 'pepper soup', 'stew'], perUnit: { ...emptyServings(), fats: 1, protein: 1 }, kcal: 150 },
]

export interface MealAnalysis {
  servings: Servings
  calories: number
}

export function analyzeMeal(text: string, quantity: number): MealAnalysis {
  const servings = emptyServings()
  const lowered = text.toLowerCase()
  const rule = FOOD_TABLE.find((entry) => entry.match.some((keyword) => lowered.includes(keyword)))
  const base = rule ? rule.perUnit : { ...emptyServings(), carbs: 1 }
  const factor = Number.isFinite(quantity) && quantity > 0 ? quantity : 1
  for (const foodClass of FOOD_CLASSES) {
    servings[foodClass] = Math.round(base[foodClass] * factor * 10) / 10
  }
  return { servings, calories: Math.round((rule ? rule.kcal : 150) * factor) }
}

export function sumServings(meals: MealEntry[]): Servings {
  const total = emptyServings()
  for (const meal of meals) {
    for (const foodClass of FOOD_CLASSES) {
      total[foodClass] += meal.servings[foodClass]
    }
  }
  return total
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

const seed = (id: string, daysAgo: number, loggedAt: string, text: string, quantity: number, unit: string, category: MealCategory): MealEntry => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  const analysis = analyzeMeal(text, quantity)
  return {
    id,
    date: toISODate(date),
    loggedAt,
    text,
    quantity,
    unit,
    category,
    servings: analysis.servings,
    calories: analysis.calories,
  }
}

export function seedDemoMeals(): MealEntry[] {
  return [
    seed('demo-today-1', 0, '08:15', 'Oats with banana', 1, 'bowl', 'breakfast'),
    seed('demo-today-2', 0, '13:05', 'Jollof rice with chicken', 1, 'plate', 'lunch'),
    seed('demo-today-3', 0, '16:20', 'Water', 2, 'glass', 'snack'),
    seed('demo-1-1', 1, '08:40', 'Bread with akara', 1, 'portion', 'breakfast'),
    seed('demo-1-2', 1, '19:30', 'Amala with egusi', 1, 'plate', 'dinner'),
    seed('demo-2-1', 2, '20:05', 'Indomie with egg', 1, 'pack', 'dinner'),
    seed('demo-3-1', 3, '09:00', 'Moi moi with pap', 1, 'portion', 'breakfast'),
    seed('demo-3-2', 3, '13:20', 'Vegetable salad', 1, 'bowl', 'lunch'),
    seed('demo-4-1', 4, '12:45', 'Fried rice with turkey', 1, 'plate', 'lunch'),
    seed('demo-5-1', 5, '19:10', 'Yam with egg sauce', 1, 'plate', 'dinner'),
    seed('demo-6-1', 6, '15:30', 'Fruit bowl', 1, 'bowl', 'snack'),
    seed('demo-7-1', 7, '19:50', 'Eba with okra', 1, 'plate', 'dinner'),
    seed('demo-8-1', 8, '17:00', 'Suya', 1, 'portion', 'snack'),
    seed('demo-9-1', 9, '13:15', 'Rice with beans', 1, 'plate', 'lunch'),
  ]
}
