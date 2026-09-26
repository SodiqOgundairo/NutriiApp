import { useState, type FormEvent } from 'react'
import { Button, Input, Label } from 'devign'

function ForgotScreen() {
  const [sentTo, setSentTo] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '')
    if (!email) return
    setSentTo(email)
  }

  return (
    <main className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2" aria-labelledby="forgot-heading">
      <section
        className="relative flex flex-col justify-center gap-7 overflow-hidden p-10 text-white [background:radial-gradient(600px_circle_at_20%_15%,rgba(228,87,46,0.28),transparent_60%),linear-gradient(150deg,#045e0a_0%,#034307_55%,#022a04_100%)] lg:p-16 xl:p-24"
        aria-labelledby="forgot-heading"
      >
        <a className="inline-flex items-center gap-2.5 self-start text-[15px] font-extrabold text-white no-underline" href="#home" aria-label="Return to NutriiApp home">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white text-[21px] font-bold text-(--brand-500)" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <p className="m-0 text-xs font-extrabold uppercase tracking-[0.16em] text-(--brand-100)">Account recovery</p>
        <h1 id="forgot-heading" className="m-0 max-w-[460px] text-[clamp(44px,5vw,72px)] font-extrabold leading-[0.98] tracking-[-0.03em] max-md:text-[clamp(40px,12vw,56px)]">Locked out? Let&apos;s fix that.</h1>
        <p className="m-0 max-w-[360px] text-[17px] leading-[1.6] text-white/80">
          Enter your email and we&apos;ll send a reset link. Demo mode: no email actually goes out.
        </p>
      </section>

      <section className="flex items-center justify-center bg-[#fafafa] px-[clamp(24px,5vw,72px)] py-[clamp(40px,6vw,96px)]" aria-label="Reset password">
        <div className="w-full max-w-[400px]">
          <p className="m-0 mb-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-(--neutral-500)">Reset password</p>
          <h2 className="m-0 text-[32px] font-extrabold tracking-[-0.02em]">Forgot your password</h2>
          {sentTo ? (
            <p className="m-0 mt-2.5 leading-[1.5] text-(--neutral-500)">
              If an account exists for <strong>{sentTo}</strong>, a reset link is on its way.
            </p>
          ) : (
            <p className="m-0 mt-2.5 leading-[1.5] text-(--neutral-500)">Enter the email you signed up with.</p>
          )}
          {sentTo ? (
            <Button variant="primary" size="lg" className="mt-1 w-full" onClick={() => { window.location.hash = '#signin' }}>
              Back to sign in
            </Button>
          ) : (
            <form className="mt-[18px] grid gap-[22px]" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" variant="plain" inputSize="lg" required />
              </div>
              <Button type="submit" variant="primary" size="lg" className="mt-1 w-full">Send reset link</Button>
            </form>
          )}
          <p className="mt-7 text-center text-sm text-(--neutral-500)">
            Remembered it? <a className="font-semibold text-(--brand-700) underline decoration-1 underline-offset-[3px]" href="#signin">Sign in</a>
            {' · '}
            <a className="font-semibold text-(--brand-700) underline decoration-1 underline-offset-[3px]" href="#reset">Demo reset</a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default ForgotScreen
