import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  EmptyState,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  SkeletonText,
  getInitials,
} from 'devign'
import GlowCard from './GlowCard'
import MealForm from './MealForm'
import WaterVessels from './WaterVessels'
import { signOutDemo, type DemoSession } from '../lib/session'
import { getMealsSnapshot, mealsForDate, subscribeMeals } from '../lib/mealStore'
import { FOOD_CLASSES, MEAL_CATEGORIES, sumServings, todayISO, toISODate, type FoodClass, type MealCategory } from '../lib/nutrition'

const CATEGORY_LABELS: Record<MealCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const BADGE_CLASSES: Record<MealCategory, string> = {
  breakfast: 'bg-[#fdf0dc] text-[#9a6b1e]',
  lunch: 'bg-(--brand-50) text-(--brand-700)',
  dinner: 'bg-[#e9e4f7] text-[#4a3d8f]',
  snack: 'bg-[#fdeee7] text-(--accent-700)',
}

function BowlIllustration() {
  return (
    <svg className="mb-1 block" width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <path d="M21 16c0-3.5 4-3.5 4-7M28 16c0-3.5 4-3.5 4-7M35 16c0-3.5 4-3.5 4-7" stroke="#e4572e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 26h40c0 10-9 18-20 18S8 36 8 26Z" stroke="#045e0a" strokeWidth="3" strokeLinejoin="round" />
      <path d="M22 48h12" stroke="#045e0a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

interface DayStat {
  calories: number
  covered: number
}

interface MonthCalendarProps {
  selectedDate: string
  dayStats: Map<string, DayStat>
  onSelect: (date: string) => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function varietyLevel(covered: number): { label: string; short: string } {
  if (covered >= 5) return { label: 'Good variety, 5 or more of 6 food groups', short: 'Good' }
  if (covered >= 3) return { label: 'Fair variety, 3 to 4 of 6 food groups', short: 'Fair' }
  return { label: 'Low variety, fewer than 3 of 6 food groups', short: 'Low' }
}

const HEALTH_CLASSES: Record<string, string> = {
  good: 'text-(--brand-500)',
  fair: 'text-[#9a6b1e]',
  low: 'text-(--neutral-500)',
}

function MonthCalendar({ selectedDate, dayStats, onSelect }: MonthCalendarProps) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const today = todayISO()

  const [viewYear, setViewYear] = useState(currentYear)
  const [viewMonth, setViewMonth] = useState(currentMonth)

  const viewingToday = selectedDate === today

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const lead = (first.getDay() + 6) % 7
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const list: (string | null)[] = []
    for (let i = 0; i < lead; i += 1) list.push(null)
    for (let day = 1; day <= daysInMonth; day += 1) {
      list.push(toISODate(new Date(viewYear, viewMonth, day)))
    }
    return list
  }, [viewYear, viewMonth])

  const monthLabel = `${MONTH_NAMES[viewMonth]} ${viewYear}`
  const years: number[] = []
  for (let year = currentYear; year >= currentYear - 3; year -= 1) years.push(year)

  const changeMonth = (month: number) => setViewMonth(month)
  const changeYear = (year: number) => {
    setViewYear(year)
    if (year === currentYear && viewMonth > currentMonth) setViewMonth(currentMonth)
  }

  const jumpToToday = () => {
    setViewYear(currentYear)
    setViewMonth(currentMonth)
    onSelect(today)
  }

  return (
    <GlowCard className="p-[clamp(18px,3vw,28px)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-2.5">
          <label className="relative">
            <span className="sr-only">Month</span>
            <select
              value={viewMonth}
              onChange={(event) => changeMonth(Number(event.target.value))}
              aria-label="Month"
              className="cursor-pointer appearance-none rounded-xl border border-(--neutral-200) bg-white/80 py-2.5 pr-9 pl-3.5 text-[15px] font-extrabold text-(--neutral-800)"
            >
              {MONTH_NAMES.map((name, index) => (
                <option key={name} value={index} disabled={viewYear === currentYear && index > currentMonth}>
                  {name}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-(--neutral-500)">▾</span>
          </label>
          <label className="relative">
            <span className="sr-only">Year</span>
            <select
              value={viewYear}
              onChange={(event) => changeYear(Number(event.target.value))}
              aria-label="Year"
              className="cursor-pointer appearance-none rounded-xl border border-(--neutral-200) bg-white/80 py-2.5 pr-9 pl-3.5 text-[15px] font-extrabold text-(--neutral-800)"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-(--neutral-500)">▾</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          {!viewingToday ? (
            <button
              type="button"
              className="rounded-full border border-(--brand-500) bg-transparent px-3.5 py-[7px] text-[13px] font-extrabold text-(--brand-500) transition hover:bg-(--brand-500) hover:text-white"
              onClick={jumpToToday}
            >
              Today
            </button>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2" role="grid" aria-label={monthLabel}>
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`} className="py-1.5 text-center text-[11px] font-extrabold text-(--neutral-500)" aria-hidden="true">
            {day}
          </span>
        ))}
        {cells.map((iso, index) => {
          if (!iso) return <span key={`blank-${index}`} className="min-h-24" />
          const future = iso > today
          const selected = iso === selectedDate
          const isToday = iso === today
          const stat = dayStats.get(iso)
          const dayNumber = Number(iso.split('-')[2])
          const health = stat ? varietyLevel(stat.covered) : null
          const stateClasses = selected
            ? 'border-[1.5px] border-dashed border-(--brand-500) bg-[#dff0e1]'
            : stat
              ? 'border border-transparent bg-[#e9f3ea]'
              : 'border border-transparent bg-[#f3f3f1]'
          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-label={`${dayNumber}${isToday ? ', today' : ''}${stat ? `, ${stat.calories} calories, ${health?.label}` : ''}`}
              className={`relative grid min-h-24 content-start justify-items-start gap-[3px] rounded-[14px] p-2.5 pb-2 text-left transition duration-300 ${stateClasses} ${future ? 'cursor-not-allowed text-[#c9c8c2]' : 'cursor-pointer text-(--neutral-800) hover:-translate-y-0.5 hover:shadow-[inset_0_16px_20px_-12px_rgba(4,94,10,0.5)]'}`}
              disabled={future}
              onClick={() => onSelect(iso)}
            >
              <span className={`text-base leading-none font-extrabold ${isToday ? 'text-(--accent-500)' : ''}`}>{dayNumber}</span>
              {stat ? <span className="text-[11px] font-bold text-(--neutral-500)">{stat.calories} cal</span> : null}
              {stat && health ? (
                <span className={`text-[10px] font-extrabold tracking-[0.04em] uppercase ${HEALTH_CLASSES[health.short.toLowerCase()]}`} title={health.label}>
                  {health.short}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </GlowCard>
  )
}

function DashboardScreen({ session }: { session: DemoSession | null }) {
  const allMeals = useSyncExternalStore(subscribeMeals, getMealsSnapshot)
  const [selectedDate, setSelectedDate] = useState(() => todayISO())
  const [loadingDay, setLoadingDay] = useState(true)
  const [logOpen, setLogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingDay(false), 600)
    return () => window.clearTimeout(timer)
  }, [selectedDate])

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    setLoadingDay(true)
  }
  const isToday = selectedDate === todayISO()
  const dayMeals = useMemo(() => mealsForDate(allMeals, selectedDate), [allMeals, selectedDate])
  const totals = useMemo(() => sumServings(dayMeals), [dayMeals])
  const dayStats = useMemo(() => {
    const acc = new Map<string, { calories: number; classes: Set<FoodClass> }>()
    for (const meal of allMeals) {
      const current = acc.get(meal.date) ?? { calories: 0, classes: new Set<FoodClass>() }
      current.calories += meal.calories
      for (const foodClass of FOOD_CLASSES) {
        if (meal.servings[foodClass] > 0) current.classes.add(foodClass)
      }
      acc.set(meal.date, current)
    }
    return new Map(
      [...acc.entries()].map(([date, value]) => [date, { calories: value.calories, covered: value.classes.size }]),
    )
  }, [allMeals])
  const firstName = session?.name?.trim().split(' ')[0] || session?.email?.split('@')[0] || 'there'
  const reduceMotion = useReducedMotion()

  const handleSignOut = () => {
    signOutDemo()
    window.location.hash = '#home'
  }

  return (
    <main className="mx-auto flex min-h-dvh w-[min(1440px,calc(100%-64px))] flex-col pt-5 pb-12" aria-labelledby="dashboard-heading">
      <header className="mb-[clamp(32px,5vw,64px)] flex items-center justify-between gap-4 py-2">
        <a className="inline-flex items-center gap-2.5 text-[15px] font-extrabold text-(--neutral-800) no-underline" href="#home" aria-label="NutriiApp home">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-(--brand-500) text-[21px] font-bold text-[#fffdf8]" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <div className="flex items-center gap-3 text-sm font-semibold text-(--neutral-500)">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2.5 rounded-full border border-(--neutral-200) bg-white/70 py-1.5 pr-3.5 pl-1.5 text-sm font-bold text-(--neutral-800) transition outline-none hover:-translate-y-px hover:border-(--brand-500) focus-visible:outline-none"
                aria-label="Account menu"
              >
                <Avatar className="ring-0 outline-none">
                  <AvatarFallback className="outline-none">{getInitials(session?.name || session?.email || 'Guest')}</AvatarFallback>
                </Avatar>
                <span>{firstName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="outline-none focus-visible:outline-none focus-visible:ring-0">
              <DropdownMenuLabel>{session?.email || 'Guest'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => { window.location.hash = '#profile' }}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="grid flex-1 content-center items-start gap-[clamp(32px,5vw,72px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="grid min-w-0 content-start gap-7">
          <p className="m-0 text-[clamp(20px,2.4vw,28px)] font-semibold">Greetings, {firstName}</p>
          <motion.h1
            id="dashboard-heading"
            className="m-0 bg-gradient-to-r from-(--brand-500) via-(--accent-500) to-(--brand-500) bg-clip-text bg-[length:200%_auto] text-[clamp(48px,6vw,84px)] leading-none font-black tracking-[-0.04em] text-transparent"
            animate={reduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >Today&apos;s Nutrition</motion.h1>
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.6] text-(--neutral-500)">
            Here is your day at a glance. Pick any day to revisit its meals and balance.
          </p>
          <div className="flex">
            <Button variant="primary" size="lg" onClick={() => setLogOpen(true)}>
              Log a meal
            </Button>
          </div>
          <MonthCalendar selectedDate={selectedDate} dayStats={dayStats} onSelect={handleSelectDate} />
          {!isToday ? (
            <p className="m-0 mt-5 rounded-xl bg-(--brand-50) px-4 py-3 text-sm font-semibold text-(--brand-700)">Viewing a past day. Past meals can be viewed but not edited.</p>
          ) : null}
        </div>

        <div className="grid min-w-0 content-start gap-7">
          <section aria-label="Meals of the day">
            <h2 className="m-0 mb-4 text-[22px] font-extrabold tracking-[-0.01em]">Meals</h2>
            {loadingDay ? (
              <div className="rounded-[20px] border border-white/70 bg-[#fafafa]/40 p-5 shadow-[0_12px_40px_rgba(4,94,10,0.08)] backdrop-blur-[28px] backdrop-saturate-150">
                <SkeletonText lines={3} />
              </div>
            ) : dayMeals.length === 0 ? (
              <EmptyState
                icon={<BowlIllustration />}
                title={isToday ? 'No meals logged today' : 'No meals this day'}
                description={
                  isToday
                    ? 'Your plate is empty. Log breakfast, lunch, dinner or a snack and watch your day take shape.'
                    : 'Nothing was recorded this day. Pick another date to revisit its meals.'
                }
              />
            ) : (
            <GlowCard className="px-5 py-1.5" role="list">
              {MEAL_CATEGORIES.flatMap((category) =>
                dayMeals
                  .filter((meal) => meal.category === category)
                  .map((meal) => (
                    <div key={meal.id} role="listitem" className="flex items-center gap-3.5 border-t border-(--neutral-200) py-3.5 first:border-t-0">
                        <div className="grid shrink-0 justify-items-center gap-1">
                          <span className={`min-w-[86px] shrink-0 rounded-full px-2.5 py-1.5 text-center text-xs font-extrabold ${BADGE_CLASSES[meal.category]}`}>{CATEGORY_LABELS[meal.category]}</span>
                          <span className="text-[11px] font-bold text-(--neutral-500)">{meal.loggedAt}</span>
                        </div>
                        <div className="grid min-w-0 gap-0.5">
                          <strong className="text-[15px]">{meal.text}</strong>
                          <small className="text-[13px] text-(--neutral-500)">{meal.quantity} {meal.unit}</small>
                        </div>
                        {isToday ? (
                          <Popover open={editingId === meal.id} onOpenChange={(open) => setEditingId(open ? meal.id : null)}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost-primary"
                                size="sm"
                                className="ml-auto shrink-0"
                                aria-label={`Edit ${meal.text}`}
                              >
                                Edit
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-[min(360px,calc(100vw-48px))]">
                              <MealForm initial={meal} onDone={() => setEditingId(null)} />
                            </PopoverContent>
                          </Popover>
                        ) : null}
                      </div>
                    )),
                )}
              </GlowCard>
            )}
          </section>

          <section aria-label="Daily balance">
            <h2 className="m-0 mb-4 text-[22px] font-extrabold tracking-[-0.01em]">Daily balance</h2>
            <GlowCard className="p-[clamp(18px,3vw,28px)]">
              {loadingDay ? (
                <div className="grid grid-cols-6 gap-3" aria-hidden="true">
                  {FOOD_CLASSES.map((foodClass) => (
                    <div key={foodClass} className="grid justify-items-center gap-2">
                      <Skeleton size="text-lg" className="w-10" animation="wave" />
                      <Skeleton variant="rectangular" className="h-44 w-16" animation="wave" />
                      <Skeleton size="text-xs" className="w-16" animation="wave" />
                    </div>
                  ))}
                </div>
              ) : (
                <WaterVessels
                  totals={totals}
                  emptyCopy={
                    isToday
                      ? 'Your vessels are empty. Log a meal and watch them fill through the day.'
                      : 'No servings recorded this day, so the vessels stay empty.'
                  }
                />
              )}
            </GlowCard>
            {dayMeals.length > 0 ? (
              <a className="mt-4 inline-block text-sm font-bold text-(--brand-700) no-underline hover:text-(--brand-500)" href={`#analysis?date=${selectedDate}`}>
                View full analysis →
              </a>
            ) : null}
          </section>
        </div>
      </div>
      <Drawer open={logOpen} onOpenChange={setLogOpen}>
        <DrawerContent position="right" size="md">
          <DrawerHeader title="Log a meal" description="What did you eat today?" />
          <DrawerBody>
            <MealForm onDone={() => setLogOpen(false)} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </main>
  )
}

export default DashboardScreen
