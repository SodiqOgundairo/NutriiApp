import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from 'devign'
import './assets/css/index.css'

function LoginScreen() {
  return (
    <main className="auth-shell" aria-labelledby="welcome-heading">
      <section className="auth-intro" aria-labelledby="welcome-heading">
        <a className="brand-lockup" href="#home" aria-label="Return to NutriiApp home">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <p className="eyebrow">NutriiApp</p>
        <h1 id="welcome-heading">Make sense of what you eat.</h1>
        <p className="intro-copy">
          A simple daily view of your meals and the nutrients that keep you moving.
        </p>
        <div className="nutrition-note" aria-hidden="true">
          <span className="nutrition-note__line"></span>
          <span>Start with today</span>
        </div>
      </section>

      <Card className="auth-card" variant="solid" radius="lg" shadow="lg" animated={false}>
        <CardHeader className="auth-card__header">
          <p className="section-kicker">Welcome back</p>
          <CardTitle>Sign in to NutriiApp</CardTitle>
          <p className="auth-card__description">Pick up where you left off with today&apos;s meals.</p>
        </CardHeader>
        <CardContent>
          <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
            <div className="field-group">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" variant="plain" inputSize="lg" required />
            </div>
            <div className="field-group">
              <div className="field-label-row">
                <Label htmlFor="password">Password</Label>
                <a href="#forgot-password">Forgot password?</a>
              </div>
              <Input id="password" name="password" type="password" placeholder="Enter your password" variant="plain" inputSize="lg" required />
            </div>
            <Button type="submit" variant="primary" size="lg" className="auth-submit">Sign in</Button>
          </form>
          <p className="auth-footer">
            New to NutriiApp? <a href="#create-account">Create an account</a>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

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

function App() {
  const [isSigningIn, setIsSigningIn] = useState(() => window.location.hash === '#signin')

  useEffect(() => {
    const handleHashChange = () => setIsSigningIn(window.location.hash === '#signin')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return isSigningIn ? <LoginScreen /> : <LandingScreen />
}

export default App
