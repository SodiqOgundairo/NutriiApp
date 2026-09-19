import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from 'devign'

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

export default LoginScreen