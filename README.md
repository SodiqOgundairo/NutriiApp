# NutriiApp

NutriiApp turns the meals you already eat into a clear daily picture of your nutrition.

## Development

```bash
npm install
npm run dev
```

The app starts at `http://localhost:5173`.

## Checks

```bash
npm run build
npm run lint
```

## USDA nutrition search

Meal logging uses the USDA FoodData Central API through the Supabase Edge Function
`nutrition-search`. The USDA key must stay server-side; do not use a `VITE_` variable
for it because Vite exposes `VITE_*` values to the browser.

From the repository root, log in and link the local Supabase folder to the
`vomujuvkhvfxwpqlqvtu` project. Then set the secret and deploy the function:

```bash
supabase login
supabase link --project-ref vomujuvkhvfxwpqlqvtu
supabase secrets set USDA_API_KEY=your-data-gov-key
supabase functions deploy nutrition-search --project-ref vomujuvkhvfxwpqlqvtu
```

The browser will continue to show a CORS preflight `404` until the deploy
completes, because Supabase does not serve local function files automatically.

Apply the calories column migration in the Supabase SQL editor:

```text
supabase/meal_records_calories.sql
```

In the app, enter a food, choose **Find nutrition**, select the matching USDA food,
and then set the number of USDA servings. The displayed nutrient values are based on
the selected USDA serving and are scaled by that quantity.
