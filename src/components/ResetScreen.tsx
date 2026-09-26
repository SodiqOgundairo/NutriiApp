import { useState, type FormEvent } from 'react'
import { Button, Input, Label } from 'devign'

function ResetScreen() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password.length < 6) {
      setError('Use at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    setDone(true)
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
          Make it something memorable. Demo mode: nothing is actually stored anywhere new.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[#fafafa] px-[clamp(24px,5vw,72px)] py-[clamp(40px,6vw,96px)]" aria-label="Set new password">
        <div className="w-full max-w-[400px]">
          <p className="m-0 mb-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-(--neutral-500)">Reset password</p>
          <h2 className="m-0 text-[32px] font-extrabold tracking-[-0.02em]">Set a new password</h2>
          {done ? (
            <>
              <p className="m-0 mt-2.5 leading-[1.5] text-(--neutral-500)">
                Password updated. Sign in with your new password to continue.
              </p>
              <Button variant="primary" size="lg" className="mt-1 w-full" onClick={() => { window.location.hash = '#signin' }}>
                Back to sign in
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
                  placeholder="At least 6 characters"
                  variant="plain"
                  inputSize="lg"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
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
                />
              </div>
              {error ? (
                <p className="m-0 text-sm font-semibold text-(--accent-700)" role="alert">{error}</p>
              ) : null}
              <Button type="submit" variant="primary" size="lg" className="mt-1 w-full">Update password</Button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default ResetScreen
