import { useEffect, useState, type FormEvent } from 'react'
import { Alert, AlertDescription, Button, Input, Label } from 'devign'
import GoogleSignInButton from './GoogleSignInButton'
import { signInWithIdentifier } from '../lib/session'
import { isSupabaseConfigured } from '../lib/supabase'

function LoginScreen() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // If Google redirects back with an error (e.g. access denied), surface it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hashIndex = window.location.hash.indexOf('?')
    const hashQuery = hashIndex >= 0 ? new URLSearchParams(window.location.hash.slice(hashIndex + 1)) : null
    const oauthError =
      params.get('error_description') ??
      params.get('error') ??
      hashQuery?.get('error_description') ??
      hashQuery?.get('error')
    if (oauthError) setError(decodeURIComponent(oauthError).replace(/\+/g, ' '))
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const data = new FormData(event.currentTarget)
    const identifier = String(data.get('identifier') ?? '').trim()
    const password = String(data.get('password') ?? '')
    if (!identifier || !password) {
      setError('Enter your email or username and password.')
      return
    }
    setLoading(true)
    try {
      await signInWithIdentifier({ identifier, password })
      window.location.hash = '#dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2" aria-labelledby="welcome-heading">
      <section
        className="relative flex flex-col justify-center gap-7 overflow-hidden p-10 text-white [background:radial-gradient(600px_circle_at_20%_15%,rgba(228,87,46,0.28),transparent_60%),linear-gradient(150deg,#045e0a_0%,#034307_55%,#022a04_100%)] lg:p-16 xl:p-24"
        aria-labelledby="welcome-heading"
      >
        <a className="inline-flex items-center gap-2.5 self-start text-[15px] font-extrabold text-white no-underline" href="#home" aria-label="Return to NutriiApp home">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white text-[21px] font-bold text-(--brand-500)" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <h1 id="welcome-heading" className="m-0 max-w-[460px] text-[clamp(44px,5vw,72px)] font-extrabold leading-[0.98] tracking-[-0.03em] max-md:text-[clamp(40px,12vw,56px)]">Make sense of what you eat.</h1>
        <p className="m-0 max-w-[360px] text-[17px] leading-[1.6] text-white/80">
          A simple daily view of your meals and the nutrients that keep you moving.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[#fafafa] px-[clamp(24px,5vw,72px)] py-[clamp(40px,6vw,96px)]" aria-label="Sign in">
        <div className="w-full max-w-[400px]">
          <p className="m-0 mb-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-(--neutral-500)">Welcome back</p>
          <h2 className="m-0 text-[32px] font-extrabold tracking-[-0.02em]">Sign in to NutriiApp</h2>
          <p className="m-0 mt-2.5 leading-[1.5] text-(--neutral-500)">Pick up where you left off with today&apos;s meals.</p>
          {!isSupabaseConfigured ? (
            <Alert variant="error" className="mt-4">
              <AlertDescription>
                Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).
              </AlertDescription>
            </Alert>
          ) : null}
          {error ? (
            <Alert variant="error" className="mt-4" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <form className="mt-[18px] grid gap-[22px]" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="identifier">Email or username</Label>
              <Input id="identifier" name="identifier" type="text" placeholder="you@example.com or Ahmed" variant="plain" inputSize="lg" required autoComplete="username" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="password">Password</Label>
                <a className="text-xs font-semibold text-(--brand-700) underline decoration-1 underline-offset-[3px]" href="#forgot">Forgot password?</a>
              </div>
              <Input id="password" name="password" type="password" placeholder="Enter your password" variant="plain" inputSize="lg" required autoComplete="current-password" />
            </div>
            <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" isLoading={loading} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
            <GoogleSignInButton disabled={loading} onError={setError} />
          </form>
          <p className="mt-7 text-center text-sm text-(--neutral-500)">
            New to NutriiApp? <a className="font-semibold text-(--brand-700) underline decoration-1 underline-offset-[3px]" href="#signup">Create an account</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginScreen
