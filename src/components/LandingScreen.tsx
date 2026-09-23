import { useCallback } from 'react'
import { Button } from 'devign'
import MealCarousel from './MealCarousel'

function LandingScreen() {
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

        <MealCarousel />
      </section>

      <footer className="landing-footer">
        <a href="#signin">Log a meal</a><span className="footer-dot" aria-hidden="true"></span><a href="#signin">See the bigger picture</a><span className="footer-dot" aria-hidden="true"></span><a href="#signin">Build awareness</a>
      </footer>
    </main>
  )
}

export default LandingScreen
