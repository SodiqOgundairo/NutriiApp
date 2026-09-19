import { Button, Card, CardContent, CardHeader, CardTitle } from 'devign'

function LandingScreen() {
  return (
    <main className="landing-shell">
      <header className="landing-nav">
        <a className="brand-lockup" href="#home" aria-label="NutriiApp home">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <Button asChild variant="outline-primary" size="sm">
          <a href="#signin">Sign in</a>
        </Button>
      </header>

      <section className="landing-hero" aria-labelledby="landing-heading">
        <div className="landing-copy">
          <p className="eyebrow">Your day, understood</p>
          <h1 id="landing-heading">Eat with a little more intention.</h1>
          <p className="landing-description">
            NutriiApp turns the meals you already eat into a clear daily picture of your nutrition.
          </p>
          <div className="landing-actions">
            <Button asChild variant="primary" size="lg">
              <a href="#signin">See today&apos;s nutrition</a>
            </Button>
            <span className="action-note">No calorie counting. Just clarity.</span>
          </div>
        </div>

        <Card className="nutrition-preview" variant="solid" radius="lg" shadow="lg" animated={false}>
          <CardHeader className="preview-header">
            <div>
              <p className="section-kicker">Today, Wednesday</p>
              <CardTitle>Your daily balance</CardTitle>
            </div>
            <span className="preview-status">On track</span>
          </CardHeader>
          <CardContent>
            <div className="nutrition-ring" aria-label="A sample nutrition balance of 72 percent">
              <strong>72</strong>
              <span>% balanced</span>
            </div>
            <div className="nutrition-bars" aria-label="Sample nutrition classes">
              <div className="bar-row"><span>Protein</span><span className="bar"><i className="bar-fill bar-fill--protein"></i></span><b>Good</b></div>
              <div className="bar-row"><span>Carbs</span><span className="bar"><i className="bar-fill bar-fill--carbs"></i></span><b>Good</b></div>
              <div className="bar-row"><span>Fats</span><span className="bar"><i className="bar-fill bar-fill--fats"></i></span><b>Light</b></div>
              <div className="bar-row"><span>Vitamins</span><span className="bar"><i className="bar-fill bar-fill--vitamins"></i></span><b>Good</b></div>
            </div>
            <div className="preview-meal"><span className="meal-dot"></span><span>Lunch added</span><strong>Rice, vegetables</strong></div>
          </CardContent>
        </Card>
      </section>

      <footer className="landing-footer">
        <span>Log a meal</span><span className="footer-dot"></span><span>See the bigger picture</span><span className="footer-dot"></span><span>Build awareness</span>
      </footer>
    </main>
  )
}

export default LandingScreen