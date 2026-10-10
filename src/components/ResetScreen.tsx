import { useEffect, useState, type FormEvent } from 'react'
import { Alert, AlertDescription, Button, Input, Label } from 'devign'
import PasswordStrength from './PasswordStrength'
import { validatePassword } from '../lib/password'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

type LinkStatus = 'checking' | 'ready' | 'invalid'

function ResetScreen() {
  const [status, setStatus] = useState<LinkStatus>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [account, setAccount] = useState<{ username?: string; email?: string }>({})

  useEffect(() => {
    let cancelled = false

    async function establishRecoverySession() {
      if (!supabase) {
        setStatus('invalid')
        return
      }
      const { data: initial } = await supabase.auth.getSession()
      if (cancelled) return
      if (initial.session) {
        setStatus('ready')
        void rememberAccount()
        return
      }
      // Supabase sends the user back with either ?code= (PKCE) or fragment
      // tokens (implicit flow). With hash routing the code can land in
      // location.search or inside the hash itself, so check both.
      const searchParams = new URLSearchParams(window.location.search)
      const hash = window.location.hash
      const hashQueryIndex = hash.indexOf('?')
      const hashQuery =
        hashQueryIndex >= 0 ? new URLSearchParams(hash.slice(hashQueryIndex + 1)) : null
      const code = searchParams.get('code') ?? hashQuery?.get('code')
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (cancelled) return
        if (!exchangeError) {
          setStatus('ready')
          void rememberAccount()
          return
        }
      }
      const fragment = hash.includes('#reset')
        ? hash.slice(hash.indexOf('#reset') + '#reset'.length)
        : hash
      const fragParams = new URLSearchParams(fragment.replace(/^[#?&]/, ''))
      const accessToken = fragParams.get('access_token')
      const refreshToken = fragParams.get('refresh_token')
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        if (cancelled) return
        if (!sessionError) {
          setStatus('ready')
          void rememberAccount()
          return
        }
      }
      setStatus('invalid')
    }

    async function rememberAccount() {
      if (!supabase) return
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled || !user) return
      const metadata = (user.user_metadata ?? {}) as Record<string, unknown>
      const username =
        typeof metadata.username === 'string'
          ? metadata.username
          : typeof metadata.display_name === 'string'
            ? metadata.display_name
            : undefined
      setAccount({ username, email: user.email ?? undefined })
    }

    void establishRecoverySession()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const passwordError = validatePassword(password, account)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!supabase) {
      setError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).')
      return
    }
    setUpdating(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password. Try again.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <main className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2" aria-labelledby="reset-heading">
      <section
        className="relative flex flex-col justify-center gap-7 overflow-hidden p-10 text-white [background:radial-gradient(600px_circle_at_20%_15%,rgba(228,87,46,0.28),transparent_60%),linear-gradient(150deg,#045e0a_0%,#034307_55%,#022a04_100%)] lg:p-16 xl:p-24"
        aria-labelledby="reset-heading"
      >
        <a className="inline-flex items-center gap-2.5 self-start text-[15px] font-extrabold text-white no-underline" href="#home" aria-label="Return to NutriiApp home">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white text-[21px] font-bold text-(--brand-500)" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <p className="m-0 text-xs font-extrabold uppercase tracking-[0.16em] text-(--brand-100)">Account recovery</p>
        <h1 id="reset-heading" className="m-0 max-w-[460px] text-[clamp(44px,5vw,72px)] font-extrabold leading-[0.98] tracking-[-0.03em] max-md:text-[clamp(40px,12vw,56px)]">Choose a fresh password.</h1>
        <p className="m-0 max-w-[360px] text-[17px] leading-[1.6] text-white/80">
          Make it something memorable. You&apos;ll use it next time you sign in.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[#fafafa] px-[clamp(24px,5vw,72px)] py-[clamp(40px,6vw,96px)]" aria-label="Set new password">
        <div className="w-full max-w-[400px]">
          <p className="m-0 mb-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-(--neutral-500)">Reset password</p>
          <h2 className="m-0 text-[32px] font-extrabold tracking-[-0.02em]">Set a new password</h2>
          {!isSupabaseConfigured ? (
            <Alert variant="error" className="mt-4">
              <AlertDescription>
                Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).
              </AlertDescription>
            </Alert>
          ) : null}
          {status === 'checking' ? (
            <p className="m-0 mt-2.5 leading-[1.5] text-(--neutral-500)">Checking your reset link…</p>
          ) : status === 'invalid' ? (
            <>
              <Alert variant="error" className="mt-4" role="alert">
                <AlertDescription>
                  This reset link is invalid or has expired. Request a new one to continue.
                </AlertDescription>
              </Alert>
              <Button variant="primary" size="lg" className="mt-4 w-full" onClick={() => { window.location.hash = '#forgot' }}>
                Request a new link
              </Button>
            </>
          ) : done ? (
            <>
              <p className="m-0 mt-2.5 leading-[1.5] text-(--neutral-500)">
                Password updated. You&apos;re signed in, continue to your dashboard.
              </p>
              <Button variant="primary" size="lg" className="mt-1 w-full" onClick={() => { window.location.hash = '#dashboard' }}>
                Continue to dashboard
              </Button>
            </>
          ) : (
            <form
              className="mt-[18px] grid gap-[22px]"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  placeholder="Choose a strong password"
                  variant="plain"
                  inputSize="lg"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
                <PasswordStrength password={password} username={account.username} email={account.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  name="confirm"
                  type="password"
                  placeholder="Repeat the password"
                  variant="plain"
                  inputSize="lg"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>
              {error ? (
                <Alert variant="error" role="alert">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" isLoading={updating} disabled={updating}>
                {updating ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default ResetScreen
