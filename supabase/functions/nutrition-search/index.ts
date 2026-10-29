const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  query?: string
}

interface UsdaNutrient {
  nutrientName?: string
  unitName?: string
  value?: number
}

interface UsdaFood {
  fdcId: number
  description: string
  dataType?: string
  servingSize?: number
  servingSizeUnit?: string
  foodNutrients?: UsdaNutrient[]
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function nutrient(food: UsdaFood, name: string): number {
  const found = food.foodNutrients?.find((item) => item.nutrientName === name)
  return Number.isFinite(found?.value) ? Number(found?.value) : 0
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const apiKey = Deno.env.get('USDA_API_KEY')
  if (!apiKey) return json({ error: 'USDA_API_KEY is not configured in Supabase.' }, 500)

  let body: SearchRequest
  try {
    body = await request.json() as SearchRequest
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400)
  }

  const query = body.query?.trim()
  if (!query || query.length < 2 || query.length > 120) {
    return json({ error: 'Enter at least 2 characters and no more than 120 characters.' }, 400)
  }

  const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search')
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('query', query)
  url.searchParams.set('pageSize', '8')
  url.searchParams.set('pageNumber', '1')
  url.searchParams.set('requireAllWords', 'false')

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return json({ error: `USDA request failed (${response.status}).` }, 502)
    }
    const result = await response.json() as { foods?: UsdaFood[] }
    const foods = (result.foods ?? []).map((food) => ({
      fdcId: food.fdcId,
      description: food.description,
      dataType: food.dataType ?? 'Unknown',
      servingSize: food.servingSize ?? null,
      servingSizeUnit: food.servingSizeUnit ?? null,
      calories: nutrient(food, 'Energy'),
      protein: nutrient(food, 'Protein'),
      carbohydrates: nutrient(food, 'Carbohydrate, by difference'),
      fat: nutrient(food, 'Total lipid (fat)'),
      fiber: nutrient(food, 'Fiber, total dietary'),
    }))
    return json({ foods })
  } catch (error) {
    console.error('[nutrition-search] USDA request failed:', error)
    return json({ error: 'Could not reach USDA FoodData Central.' }, 502)
  }
})
