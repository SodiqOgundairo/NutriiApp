import { useMemo, useState, type FormEvent } from 'react'
import { Button, Input, Label, RadioGroup, RadioGroupItem } from 'devign'
import { addMeal, getMealsSnapshot, updateMeal } from '../lib/mealStore'
import {
  analyzeMeal,
  FOOD_CLASSES,
  FOOD_CLASS_LABELS,
  MEAL_CATEGORIES,
  todayISO,
  type MealCategory,
} from '../lib/nutrition'

const CATEGORY_LABELS: Record<MealCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

function idFromHash(): string | null {
  const query = window.location.hash.split('?')[1] ?? ''
  return new URLSearchParams(query).get('id')
}

function LogMealScreen() {
  const today = todayISO()
  const [editingId] = useState<string | null>(() => idFromHash())
  const existing = useMemo(
    () => getMealsSnapshot().find((meal) => meal.id === editingId && meal.date === today) ?? null,
    [editingId, today],
  )

  const [text, setText] = useState(existing?.text ?? '')
  const [quantity, setQuantity] = useState(existing ? String(existing.quantity) : '1')
  const [unit, setUnit] = useState(existing?.unit ?? 'plate')
  const [category, setCategory] = useState<MealCategory>(existing?.category ?? 'lunch')
  const [saved, setSaved] = useState(false)

  const preview = useMemo(() => analyzeMeal(text, Number(quantity) || 0).servings, [text, quantity])
  const invalidId = editingId !== null && existing === null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const qty = Number(quantity) || 1
    if (!text.trim()) return
    const analysis = analyzeMeal(text, qty)
    if (existing) {
      updateMeal(existing.id, { text: text.trim(), quantity: qty, unit: unit.trim() || 'portion', category, servings: analysis.servings, calories: analysis.calories })
    } else {
      const now = new Date()
      const loggedAt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      addMeal({
        id: `meal-${Date.now()}`,
        date: today,
        loggedAt,
        text: text.trim(),
        quantity: qty,
        unit: unit.trim() || 'portion',
        category,
        servings: analysis.servings,
        calories: analysis.calories,
      })
    }
    setSaved(true)
    window.location.hash = '#dashboard'
  }

  return (
    <main className="mx-auto flex min-h-dvh w-[min(1440px,calc(100%-64px))] flex-col pt-5 pb-12" aria-labelledby="meal-heading">
      <a className="mb-4 inline-block text-sm font-bold text-(--brand-700) no-underline hover:text-(--brand-500)" href="#dashboard">← Back to dashboard</a>
      <p className="m-0 mb-[18px] text-xs font-extrabold uppercase tracking-[0.16em] text-(--brand-700)">{existing ? 'Edit meal' : 'Log a meal'}</p>
      <h1 id="meal-heading" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.03em]">{existing ? 'Edit today\u2019s meal' : 'What did you eat?'}</h1>

      {invalidId ? (
        <p className="m-0 mt-5 rounded-xl bg-(--brand-50) px-4 py-3 text-sm font-semibold text-(--brand-700)">That meal can&apos;t be edited. Only today&apos;s meals can change.</p>
      ) : (
        <form className="mt-6 grid max-w-[560px] gap-[22px] rounded-2xl border border-(--neutral-200) bg-white p-[clamp(20px,4vw,32px)]" onSubmit={handleSubmit}>
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
            <span id="category-label" className="text-sm font-semibold">Meal category</span>
            <RadioGroup value={category} onValueChange={(value) => setCategory(value as MealCategory)} aria-labelledby="category-label">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {MEAL_CATEGORIES.map((option) => (
                  <div key={option} className="flex items-center gap-2 rounded-xl border border-(--neutral-200) bg-[#fafafa] p-2.5 text-sm">
                    <RadioGroupItem value={option} id={`cat-${option}`} />
                    <Label htmlFor={`cat-${option}`}>{CATEGORY_LABELS[option]}</Label>
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
          <Button type="submit" variant="primary" size="lg" className="mt-1 w-full">
            {existing ? 'Save changes' : saved ? 'Saved' : 'Log meal'}
          </Button>
        </form>
      )}
    </main>
  )
}

export default LogMealScreen
