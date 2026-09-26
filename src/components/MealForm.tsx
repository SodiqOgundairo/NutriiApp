import { useMemo, useState, type FormEvent } from 'react'
import { Button, Input, Label, RadioGroup, RadioGroupItem } from 'devign'
import { addMeal, updateMeal } from '../lib/mealStore'
import {
  analyzeMeal,
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

  const preview = useMemo(() => analyzeMeal(text, Number(quantity) || 0).servings, [text, quantity])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const qty = Number(quantity) || 1
    if (!text.trim()) return
    const analysis = analyzeMeal(text, qty)
    if (initial) {
      updateMeal(initial.id, {
        text: text.trim(),
        quantity: qty,
        unit: unit.trim() || 'portion',
        category,
        servings: analysis.servings,
        calories: analysis.calories,
      })
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
    onDone()
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
      <Button type="submit" variant="primary" size="lg" className="mt-1 w-full">
        {initial ? 'Save changes' : 'Log meal'}
      </Button>
    </form>
  )
}

export default MealForm
