import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, CardContent } from 'devign'

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

function LandingScreen() {
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

  const goSignin = useCallback(() => {
    window.location.hash = '#signin'
  }, [])

  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <a className="brand-lockup" href="#home" aria-label="NutriiApp home">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <Button variant="primary" size="sm" onClick={goSignin}>
          Sign in
        </Button>
      </header>

      <section className="landing-hero" aria-labelledby="landing-heading">
        <div className="landing-copy">
          <p className="eyebrow">Your day, understood</p>
          <h1 id="landing-heading"><span className="h1-accent">Eat with</span> a little more <span className="h1-accent">intention.</span></h1>
          <p className="landing-description">
            NutriiApp turns the meals you already eat into a clear daily picture of your nutrition.
          </p>
          <div className="landing-actions">
            <Button variant="primary" size="lg" onClick={goSignin}>
              See today&apos;s nutrition
            </Button>
            <span className="action-note">No calorie counting. Just clarity.</span>
          </div>
        </div>

        <div
          className="meal-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Meal nutrition spotlights"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <div className="carousel-track">
            {SLIDES.map((slide, index) => (
              <article
                key={slide.dish}
                className={index === active ? 'carousel-slide is-active' : 'carousel-slide'}
                aria-hidden={index !== active}
                aria-roledescription="slide"
                aria-label={`${slide.dish}, ${index + 1} of ${SLIDES.length}`}
              >
                <img src={slide.image} alt={slide.alt} loading={index === 0 ? 'eager' : 'lazy'} />
                <Card variant="glass" glass="lg" radius="2xl" shadow="xl" className="slide-glass">
                  <CardContent padding="none">
                    <p className="slide-dish">{slide.dish}</p>
                    <p className="slide-cals">{slide.totalCals} cal in total</p>
                  </CardContent>
                </Card>
                {slide.popovers.map((popover) => (
                  <div key={popover.name} className={`chat-pop pop--${popover.position}`}>
                    <span className="chat-pop__emoji" aria-hidden="true">{popover.emoji}</span>
                    <div>
                      <strong>{popover.name} <span>({popover.cals} cal)</span></strong>
                      <small>{popover.benefit}</small>
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </div>
          <div className="carousel-controls">
            <button type="button" className="carousel-arrow" onClick={() => go(-1)} aria-label="Previous meal">
              <span aria-hidden="true">‹</span>
            </button>
            <div className="carousel-dots" role="tablist" aria-label="Choose meal">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.dish}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show ${slide.dish}`}
                  className={index === active ? 'carousel-dot is-active' : 'carousel-dot'}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
            <button type="button" className="carousel-arrow" onClick={() => go(1)} aria-label="Next meal">
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <a href="#signin">Log a meal</a><span className="footer-dot" aria-hidden="true"></span><a href="#signin">See the bigger picture</a><span className="footer-dot" aria-hidden="true"></span><a href="#signin">Build awareness</a>
      </footer>
    </main>
  )
}

export default LandingScreen
