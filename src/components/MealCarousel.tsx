import { useCallback, useEffect, useRef, useState } from 'react'

type PopoverPosition = 'left' | 'right' | 'bottom-left'

interface MealPopover {
  emoji: string
  name: string
  cals: number
  benefit: string
  position: PopoverPosition
}

interface MealSlide {
  image: string
  alt: string
  dish: string
  totalCals: number
  popovers: MealPopover[]
}

const SLIDES: MealSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80',
    alt: 'A colorful vegetable salad bowl',
    dish: 'Vegetable Salad',
    totalCals: 132,
    popovers: [
      { emoji: '🌱', name: 'Radish', cals: 16, benefit: 'Rich in vitamin C', position: 'left' },
      { emoji: '🌿', name: 'Basil', cals: 22, benefit: 'Good source of vitamin K', position: 'right' },
      { emoji: '🍅', name: 'Tomato', cals: 33, benefit: 'Low in calories but high in fiber', position: 'bottom-left' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80',
    alt: 'A rainbow buddha bowl with fresh vegetables',
    dish: 'Rainbow Buddha Bowl',
    totalCals: 248,
    popovers: [
      { emoji: '🥑', name: 'Avocado', cals: 80, benefit: 'Full of healthy fats', position: 'left' },
      { emoji: '🥕', name: 'Carrot', cals: 25, benefit: 'Great for your eyes', position: 'right' },
      { emoji: '🍠', name: 'Sweet potato', cals: 54, benefit: 'Slow energy that lasts', position: 'bottom-left' },
    ],
  },
  {
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1400&q=80',
    alt: 'A berry and oat breakfast bowl',
    dish: 'Berry Oat Bowl',
    totalCals: 186,
    popovers: [
      { emoji: '🫐', name: 'Blueberry', cals: 28, benefit: 'Antioxidants in every bite', position: 'left' },
      { emoji: '🍓', name: 'Strawberry', cals: 12, benefit: 'A vitamin C superstar', position: 'right' },
      { emoji: '🥣', name: 'Oats', cals: 75, benefit: 'Fibre that keeps you full', position: 'bottom-left' },
    ],
  },
]

const AUTOPLAY_MS = 6000

const POPOVER_POSITIONS: Record<PopoverPosition, string> = {
  left: 'left-[5%] top-[38%]',
  right: 'right-[5%] top-[57%]',
  'bottom-left': 'bottom-[12%] left-[5%]',
}

interface MealCarouselProps {
  ariaLabel?: string
  showControls?: boolean
}

function MealCarousel({ ariaLabel = 'Meal nutrition spotlights', showControls = true }: MealCarouselProps) {
  const [active, setActive] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const stopAutoplay = useCallback(() => {
    if (timer.current !== undefined) {
      window.clearInterval(timer.current)
      timer.current = undefined
    }
  }, [])

  const startAutoplay = useCallback(() => {
    stopAutoplay()
    timer.current = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
  }, [stopAutoplay])

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [startAutoplay, stopAutoplay])

  const go = useCallback((direction: 1 | -1) => {
    setActive((current) => (current + direction + SLIDES.length) % SLIDES.length)
  }, [])

  const goTo = useCallback((index: number) => {
    setActive(index)
  }, [])

  return (
    <div
      className="relative min-w-0 max-md:max-w-[520px]"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      <div className="relative aspect-[1/1.04] max-md:aspect-[1/1.12]">
        {SLIDES.map((slide, index) => {
          const isActive = index === active
          return (
            <article
              key={slide.dish}
              className={
                isActive
                  ? 'absolute inset-0 z-[1] overflow-hidden rounded-2xl border border-(--neutral-200) bg-(--neutral-200) opacity-100 transition-opacity duration-[3000ms] ease'
                  : 'pointer-events-none absolute inset-0 overflow-hidden rounded-2xl border border-(--neutral-200) bg-(--neutral-200) opacity-0 transition-opacity duration-[3000ms] ease'
              }
              aria-hidden={!isActive}
              aria-roledescription="slide"
              aria-label={`${slide.dish}, ${index + 1} of ${SLIDES.length}`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={
                  isActive
                    ? 'absolute inset-0 block h-full w-full scale-110 object-cover transition-transform [transition-duration:6500ms] [transition-timing-function:linear]'
                    : 'absolute inset-0 block h-full w-full scale-100 object-cover transition-transform duration-[3000ms] ease'
                }
              />
              <div className="absolute top-[7%] left-1/2 w-[min(62%,300px)] -translate-x-1/2 rounded-[10px] border border-white/65 bg-[#fafafa]/55 text-center shadow-[0_12px_40px_rgba(4,94,10,0.08)] backdrop-blur-[20px] backdrop-saturate-150">
                <div className="grid justify-items-center gap-1 px-3 pt-1.5 pb-2">
                  <p className="m-0 text-2xl font-extrabold tracking-[-0.01em] text-(--neutral-800) max-md:text-[22px]">{slide.dish}</p>
                  <p className="m-0 text-sm font-semibold text-(--neutral-500)">{slide.totalCals} cal in total</p>
                </div>
              </div>
              {slide.popovers.map((popover) => (
                <div
                  key={popover.name}
                  className={`absolute z-[2] flex max-w-[72%] items-center gap-2.5 rounded-2xl border border-white/10 bg-[#10140f] p-3 px-4 text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-(--accent-500) hover:shadow-[0_16px_40px_rgba(228,87,46,0.35)] ${POPOVER_POSITIONS[popover.position]}`}
                >
                  <span className="text-[26px] leading-none max-md:text-[22px]" aria-hidden="true">{popover.emoji}</span>
                  <div>
                    <strong className="block text-[15px] font-extrabold max-md:text-[13px]">{popover.name} <span className="font-semibold text-white/55">({popover.cals} cal)</span></strong>
                    <small className="mt-0.5 block text-[13px] text-white/80 max-md:text-xs">{popover.benefit}</small>
                  </div>
                </div>
              ))}
            </article>
          )
        })}
      </div>
      {showControls ? (
        <div className="mt-4 flex items-center justify-center gap-3.5">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-(--neutral-200) bg-white text-[22px] leading-none text-(--neutral-800) transition duration-300 hover:-translate-y-0.5 hover:border-(--brand-500) hover:bg-(--brand-500) hover:text-white"
            onClick={() => go(-1)}
            aria-label="Previous meal"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose meal">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.dish}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show ${slide.dish}`}
                className={
                  index === active
                    ? 'h-2 w-7 cursor-pointer rounded-full border-0 bg-(--brand-500) p-0 transition-all duration-300'
                    : 'h-2 w-2 cursor-pointer rounded-full border-0 bg-(--neutral-200) p-0 transition-all duration-300 hover:bg-(--accent-500)'
                }
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-(--neutral-200) bg-white text-[22px] leading-none text-(--neutral-800) transition duration-300 hover:-translate-y-0.5 hover:border-(--brand-500) hover:bg-(--brand-500) hover:text-white"
            onClick={() => go(1)}
            aria-label="Next meal"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default MealCarousel
