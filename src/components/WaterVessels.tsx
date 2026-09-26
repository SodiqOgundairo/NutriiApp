import { motion, useReducedMotion } from 'motion/react'
import { FOOD_CLASSES, FOOD_CLASS_LABELS, type Servings } from '../lib/nutrition'

interface WaterVesselsProps {
  totals: Servings
  emptyCopy?: string | null
}

function WaterVessels({ totals, emptyCopy }: WaterVesselsProps) {
  const reduceMotion = useReducedMotion()
  const max = Math.max(1, ...FOOD_CLASSES.map((foodClass) => totals[foodClass]))
  const isEmpty = FOOD_CLASSES.every((foodClass) => totals[foodClass] === 0)

  return (
    <>
      <div className="grid grid-cols-6 gap-3 max-md:grid-cols-[repeat(6,minmax(72px,1fr))] max-md:overflow-x-auto">
        {FOOD_CLASSES.map((foodClass) => (
          <div key={foodClass} className="grid justify-items-center gap-2">
            <span className="text-lg font-extrabold">{totals[foodClass]}</span>
            <div
              className={
                isEmpty
                  ? 'relative h-[170px] w-full max-w-16 overflow-hidden rounded-2xl border border-dashed border-(--neutral-200) bg-[#f3f3f1]'
                  : 'relative h-[170px] w-full max-w-16 overflow-hidden rounded-2xl bg-(--neutral-100)'
              }
              role="img"
              aria-label={`${FOOD_CLASS_LABELS[foodClass]}: ${totals[foodClass]} servings`}
            >
              <div
                className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-2xl bg-gradient-to-b from-[#6db374]/90 to-[#045e0a]/95 transition-[height] duration-[1200ms] ease motion-reduce:transition-none"
                style={{ height: `${Math.round((totals[foodClass] / max) * 100)}%` }}
              >
                <motion.i
                  aria-hidden="true"
                  className="absolute -top-3 left-[-50%] h-6 w-[200%] rounded-[45%] bg-white/60"
                  animate={reduceMotion ? undefined : { x: ['-22%', '22%'] }}
                  transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
                />
                <motion.i
                  aria-hidden="true"
                  className="absolute top-[-7px] left-[-50%] h-6 w-[200%] rounded-[45%] bg-white/35"
                  animate={reduceMotion ? undefined : { x: ['22%', '-22%'] }}
                  transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
                />
              </div>
            </div>
            <span className="text-xs font-bold text-(--neutral-500)">{FOOD_CLASS_LABELS[foodClass]}</span>
          </div>
        ))}
      </div>
      {isEmpty && emptyCopy ? (
        <p className="mt-4 text-center text-sm leading-[1.55] text-(--neutral-500)">{emptyCopy}</p>
      ) : null}
    </>
  )
}

export default WaterVessels
