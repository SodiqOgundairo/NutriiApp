import { useMemo, useState } from 'react'
import { EmptyState } from 'devign'
import GlowCard from './GlowCard'
import WaterVessels from './WaterVessels'
import { getMealsSnapshot, mealsForDate } from '../lib/mealStore'
import { FOOD_CLASSES, FOOD_CLASS_LABELS, sumServings, todayISO } from '../lib/nutrition'

function dateFromHash(): string {
  const query = window.location.hash.split('?')[1] ?? ''
  const date = new URLSearchParams(query).get('date') ?? ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number)
    const parsed = new Date(year, month - 1, day)
    if (!Number.isNaN(parsed.getTime()) && parsed.getFullYear() === year && parsed.getMonth() === month - 1) {
      return date
    }
  }
  return todayISO()
}

function formatLongDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function AnalysisScreen() {
  const [date] = useState<string>(() => dateFromHash())
  const dayMeals = useMemo(() => mealsForDate(getMealsSnapshot(), date), [date])
  const totals = useMemo(() => sumServings(dayMeals), [dayMeals])
  const covered = useMemo(() => FOOD_CLASSES.filter((foodClass) => totals[foodClass] > 0), [totals])
  const isToday = date === todayISO()

  return (
    <main className="mx-auto flex min-h-dvh w-[min(1440px,calc(100%-64px))] flex-col pt-5 pb-12" aria-labelledby="analysis-heading">
      <a className="mb-4 inline-block text-sm font-bold text-(--brand-700) no-underline hover:text-(--brand-500)" href="#dashboard">← Back to dashboard</a>
      <div className="grid flex-1 content-center gap-7">
      <p className="m-0 mb-[18px] text-xs font-extrabold uppercase tracking-[0.16em] text-(--brand-700)">Day analysis</p>
      <h1 id="analysis-heading" className="m-0 bg-gradient-to-r from-(--brand-500) to-(--accent-500) bg-clip-text text-[clamp(48px,6vw,84px)] leading-none font-black tracking-[-0.04em] text-transparent">{formatLongDate(date)}</h1>
      <p className="mt-3 text-base text-(--neutral-500)">
        {dayMeals.length === 0
          ? 'Nothing recorded for this day.'
          : `${dayMeals.length} ${dayMeals.length === 1 ? 'meal' : 'meals'} on record.`}
      </p>

      {dayMeals.length === 0 ? (
        <EmptyState
          title={isToday ? 'No data yet today' : 'No data this day'}
          description={isToday ? 'Log a meal and its classes will appear here.' : 'Pick a day with meals to see its breakdown.'}
        />
      ) : (
        <div className="mt-8 grid content-start gap-7">
          <div className="grid grid-cols-2 gap-4">
            <GlowCard>
              <div className="p-5">
                <p className="m-0 text-xs font-extrabold uppercase tracking-[0.08em] text-(--neutral-500)">Meals logged</p>
                <p className="m-0 mt-1 text-4xl font-black tracking-tight">{dayMeals.length}</p>
                <p className="m-0 mt-1 text-sm text-(--neutral-500)">{isToday ? 'today' : 'this day'}</p>
              </div>
            </GlowCard>
            <GlowCard>
              <div className="p-5">
                <p className="m-0 text-xs font-extrabold uppercase tracking-[0.08em] text-(--neutral-500)">Classes covered</p>
                <p className="m-0 mt-1 text-4xl font-black tracking-tight">{covered.length} of 6</p>
                <p className="m-0 mt-1 text-sm text-(--neutral-500)">food classes</p>
              </div>
            </GlowCard>
          </div>

          <section aria-label="Servings by food class">
            <h2 className="m-0 mb-4 text-[22px] font-extrabold tracking-[-0.01em]">Servings by food class</h2>
            <GlowCard>
              <div className="p-5 pt-6">
                <WaterVessels totals={totals} />
              </div>
            </GlowCard>
          </section>

          <section aria-label="Where each class came from">
            <h2 className="m-0 mb-4 text-[22px] font-extrabold tracking-[-0.01em]">Where it came from</h2>
            <GlowCard>
              <div role="list" className="px-5 py-1.5">
                {FOOD_CLASSES.map((foodClass) => {
                  const sources = dayMeals.filter((meal) => meal.servings[foodClass] > 0)
                  return (
                    <div key={foodClass} role="listitem" className="grid grid-cols-[110px_1fr] items-baseline gap-3 border-t border-(--neutral-200) py-3.5 text-sm first:border-t-0 max-md:grid-cols-1 max-md:gap-1">
                      <strong>{FOOD_CLASS_LABELS[foodClass]}</strong>
                      {sources.length === 0 ? (
                        <span className="text-(--neutral-500)">Nothing recorded</span>
                      ) : (
                        <span className="text-(--neutral-800)">
                          {sources.map((meal) => `${meal.text} (${meal.servings[foodClass]})`).join(' · ')}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </GlowCard>
          </section>
        </div>
      )}
      </div>
    </main>
  )
}

export default AnalysisScreen
