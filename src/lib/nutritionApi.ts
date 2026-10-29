import { supabase } from './supabase'

export interface NutritionFood {
  fdcId: number
  description: string
  dataType: string
  servingSize: number | null
  servingSizeUnit: string | null
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
}

export async function searchNutrition(query: string): Promise<NutritionFood[]> {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }
  const { data, error } = await supabase.functions.invoke<{ foods?: NutritionFood[]; error?: string }>('nutrition-search', {
    body: { query },
  })
  if (error) throw new Error(error.message)
  if (!data || data.error) throw new Error(data?.error ?? 'Nutrition search failed.')
  return data.foods ?? []
}
