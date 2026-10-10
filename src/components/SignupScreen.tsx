import { useEffect, useState, type FormEvent } from 'react'
import { Alert, AlertDescription, Button, Input, Label } from 'devign'
import PasswordStrength from './PasswordStrength'
import GoogleSignInButton from './GoogleSignInButton'
import {
  USERNAME_TAKEN_MESSAGE,
  isUsernameAvailable,
  signUpWithEmail,
  validateUsername,
} from '../lib/session'
import { validatePassword } from '../lib/password'
import { isSupabaseConfigured } from '../lib/supabase'

function SignupScreen() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [usernameTaken, setUsernameTaken] = useState(false)
  const [checkingName, setCheckingName] = useState(false)

  useEffect(() => {
    if (validateUsername(username) !== null) {
      setUsernameTaken(false)
      setCheckingName(false)
      return
    }
    setCheckingName(true)
    const timer = window.setTimeout(() => {
      void isUsernameAvailable(username).then((available) => {
        setUsernameTaken(available === false)
        setCheckingName(false)
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [username])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    const usernameError = validateUsername(username)
    if (usernameError) {
      setError(usernameError)
      return
    }
    if (!email.trim()) {
      setError('Enter your email address.')
      return
    }
    const passwordError = validatePassword(password, { username, email })
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const fresh = await isUsernameAvailable(username.trim())
      if (fresh === false) {
        setUsernameTaken(true)
        setError(USERNAME_TAKEN_MESSAGE)
        return
      }
      const { needsConfirmation } = await signUpWithEmail({
        username: username.trim(),
        email: email.trim(),
        password,
      })
      if (needsConfirmation) {
        setNotice('Check your email to confirm your account, then sign in.')
      } else {
        window.location.hash = '#dashboard'
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2" aria-labelledby="signup-heading">
      <section
        className="relative flex flex-col justify-center gap-7 overflow-hidden p-10 text-white [background:radial-gradient(600px_circle_at_20%_15%,rgba(228,87,46,0.28),transparent_60%),linear-gradient(150deg,#045e0a_0%,#034307_55%,#022a04_100%)] lg:p-16 xl:p-24"
        aria-labelledby="signup-heading"
      >
        <a className="inline-flex items-center gap-2.5 self-start text-[15px] font-extrabold text-white no-underline" href="#home" aria-label="Return to NutriiApp home">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white text-[21px] font-bold text-(--brand-500)" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <p className="m-0 text-xs font-extrabold uppercase tracking-[0.16em] text-(--brand-100)">Join NutriiApp</p>
        <h1 id="signup-heading" className="m-0 max-w-[460px] text-[clamp(44px,5vw,72px)] font-extrabold leading-[0.98] tracking-[-0.03em] max-md:text-[clamp(40px,12vw,56px)]">Start seeing your day clearly.</h1>
        <p className="m-0 max-w-[360px] text-[17px] leading-[1.6] text-white/80">
          Create an account and turn tonight&apos;s dinner into tomorrow&apos;s insight.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[#fafafa] px-[clamp(24px,5vw,72px)] py-[clamp(40px,6vw,96px)]" aria-label="Create account">
        <div className="w-full max-w-[400px]">
          <p className="m-0 mb-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-(--neutral-500)">Get started</p>
          <h2 className="m-0 text-[32px] font-extrabold tracking-[-0.02em]">Create your account</h2>
          <p className="m-0 mt-2.5 leading-[1.5] text-(--neutral-500)">Sign up with your email and a password.</p>
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
          {notice ? (
            <Alert variant="success" className="mt-4" role="status">
              <AlertDescription>{notice}</AlertDescription>
            </Alert>
          ) : null}
          <form className="mt-[18px] grid gap-[22px]" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Ahmed"
                variant="plain"
                inputSize="lg"
                required
                autoComplete="username"
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setError(null)
                }}
                error={usernameTaken ? USERNAME_TAKEN_MESSAGE : undefined}
                hint={checkingName ? 'Checking availability…' : undefined}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                variant="plain"
                inputSize="lg"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Choose a strong password"
                variant="plain"
                inputSize="lg"
                required
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <PasswordStrength password={password} username={username} email={email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="Repeat the password"
                variant="plain"
                inputSize="lg"
                required
                autoComplete="new-password"
                minLength={8}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" isLoading={loading} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
            <GoogleSignInButton disabled={loading} onError={setError} />
          </form>
          <p className="mt-5 text-center text-xs leading-[1.6] text-(--neutral-500)">
            By creating an account, you agree to our{' '}
            <a className="font-semibold text-(--brand-700) underline decoration-1 underline-offset-[3px]" href="#terms">Terms of Use</a>{' '}
            and{' '}
            <a className="font-semibold text-(--brand-700) underline decoration-1 underline-offset-[3px]" href="#privacy">Privacy Policy</a>.
          </p>
          <p className="mt-7 text-center text-sm text-(--neutral-500)">
            Already have an account? <a className="font-semibold text-(--brand-700) underline decoration-1 underline-offset-[3px]" href="#signin">Sign in</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default SignupScreen
