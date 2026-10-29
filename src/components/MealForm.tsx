import { useMemo, useState, type FormEvent } from 'react'
import { Button, Input, Label, RadioGroup, RadioGroupItem } from 'devign'
import { addMeal, updateMeal } from '../lib/mealStore'
import { searchNutrition, type NutritionFood } from '../lib/nutritionApi'
import {
  analyzeMeal,
  analysisFromNutrition,
  FOOD_CLASSES,
  FOOD_CLASS_LABELS,
  MEAL_CATEGORIES,
  todayISO,
  type MealCategory,
  type MealEntry,
} from '../lib/nutrition'

const CATEGORY_LABELS: Record<MealCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

interface MealFormProps {
  initial?: MealEntry | null
  onDone: () => void
}

function MealForm({ initial = null, onDone }: MealFormProps) {
  const today = todayISO()
  const [text, setText] = useState(initial?.text ?? '')
  const [quantity, setQuantity] = useState(initial ? String(initial.quantity) : '1')
  const [unit, setUnit] = useState(initial?.unit ?? 'plate')
  const [category, setCategory] = useState<MealCategory>(initial?.category ?? 'lunch')
  const [saving, setSaving] = useState(false)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<NutritionFood[]>([])
  const [selectedFood, setSelectedFood] = useState<NutritionFood | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const nutrition = selectedFood
    ? analysisFromNutrition(selectedFood, Number(quantity) || 1)
    : null
  const preview = useMemo(
    () => (nutrition ?? analyzeMeal(text, Number(quantity) || 0)).servings,
    [nutrition, text, quantity],
  )

  const handleSearch = async () => {
    if (text.trim().length < 2 || searching) return
    setSearching(true)
    setFormError(null)
    setSelectedFood(null)
    try {
      setResults(await searchNutrition(text))
    } catch (error) {
      setResults([])
      setFormError(error instanceof Error ? error.message : 'Nutrition search failed')
    } finally {
      setSearching(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const qty = Number(quantity) || 1
    if (!text.trim() || saving) return
    if (!selectedFood && !initial) {
      setFormError('Search for this food and select a USDA result before saving.')
      return
    }
    const analysis = selectedFood ? analysisFromNutrition(selectedFood, qty) : analyzeMeal(text, qty)
    setSaving(true)
    setFormError(null)
    try {
      if (initial) {
        await updateMeal(initial.id, {
          text: text.trim(),
          quantity: qty,
          unit: unit.trim() || 'portion',
          category,
          servings: analysis.servings,
          calories: analysis.calories,
        })
      } else {
        await addMeal({
          date: today,
          text: text.trim(),
          quantity: qty,
          unit: unit.trim() || 'portion',
          category,
          servings: analysis.servings,
          calories: analysis.calories,
        })
      }
      onDone()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="grid gap-[22px]" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="meal-text">Meal (free text)</Label>
        <Input
          id="meal-text"
          name="meal"
          type="text"
          placeholder="e.g. Jollof rice with chicken"
          variant="plain"
          inputSize="lg"
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
        />
        <Button type="button" variant="outline" size="sm" onClick={() => void handleSearch()} disabled={searching || text.trim().length < 2}>
          {searching ? 'Searching USDA...' : 'Find nutrition'}
        </Button>
        {results.length > 0 ? (
          <div className="grid gap-2 rounded-xl border border-(--neutral-200) bg-white p-2" role="listbox" aria-label="USDA food matches">
            {results.map((food) => (
              <button
                key={food.fdcId}
                type="button"
                role="option"
                aria-selected={selectedFood?.fdcId === food.fdcId}
                className={`rounded-lg p-2 text-left text-sm hover:bg-(--brand-50) ${selectedFood?.fdcId === food.fdcId ? 'bg-(--brand-50)' : ''}`}
                onClick={() => {
                  setSelectedFood(food)
                  setResults([])
                }}
              >
                <strong className="block">{food.description}</strong>
                <span className="text-xs text-(--neutral-500)">
                  {food.calories} kcal · {food.protein} g protein · {food.carbohydrates} g carbs · {food.fat} g fat
                  {food.servingSize ? ` · per ${food.servingSize} ${food.servingSizeUnit ?? 'g'}` : ''}
                </span>
              </button>
            ))}
          </div>
        ) : null}
        {selectedFood ? (
          <p className="m-0 text-xs font-semibold text-(--brand-700)" aria-live="polite">
            USDA food selected: {selectedFood.description}. Quantity scales its listed serving.
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="meal-quantity">Quantity</Label>
          <Input
            id="meal-quantity"
            name="quantity"
            type="number"
            min={1}
            variant="plain"
            inputSize="lg"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="meal-unit">Unit</Label>
          <Input
            id="meal-unit"
            name="unit"
            type="text"
            placeholder="plate, bowl, glass..."
            variant="plain"
            inputSize="lg"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <span id="meal-category-label" className="text-sm font-semibold">Meal category</span>
        <RadioGroup value={category} onValueChange={(value) => setCategory(value as MealCategory)} aria-labelledby="meal-category-label">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {MEAL_CATEGORIES.map((option) => (
              <div
                key={option}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-(--neutral-200) bg-[#fafafa] p-2.5 text-sm"
                onClick={() => setCategory(option)}
              >
                <RadioGroupItem value={option} id={`meal-cat-${option}`} />
                <Label htmlFor={`meal-cat-${option}`}>{CATEGORY_LABELS[option]}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
      <div className="flex flex-wrap items-center gap-2" aria-live="polite">
        <span className="w-full text-xs font-extrabold uppercase tracking-[0.08em] text-(--neutral-500)">Locks in as:</span>
        {FOOD_CLASSES.map((foodClass) => (
          <span key={foodClass} className="rounded-full bg-(--brand-50) px-2.5 py-1.5 text-xs font-semibold text-(--brand-700) [&_b]:font-extrabold">
            {FOOD_CLASS_LABELS[foodClass]} <b>{preview[foodClass]}</b>
          </span>
        ))}
      </div>
      {formError ? (
        <p role="alert" className="m-0 rounded-xl bg-[#fdeee7] px-4 py-3 text-sm font-semibold text-(--accent-700)">
          Could not save: {formError}. Open the console and copy the first red line.
        </p>
      ) : null}
      <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" disabled={saving}>
        {saving ? 'Saving...' : initial ? 'Save changes' : 'Log meal'}
      </Button>
    </form>
  )
}

export default MealForm
