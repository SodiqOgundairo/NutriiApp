import { useEffect } from 'react'

function TermsScreen() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="mx-auto w-[min(768px,calc(100%-48px))] pt-8 pb-16" aria-labelledby="terms-heading">
      <a className="inline-flex items-center gap-2.5 text-[15px] font-extrabold text-(--neutral-800) no-underline" href="#home" aria-label="NutriiApp home">
        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-(--brand-500) text-[21px] font-bold text-[#fffdf8]" aria-hidden="true">N</span>
        <span>NutriiApp</span>
      </a>
      <p className="mt-10 mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-(--neutral-500)">Terms of use</p>
      <h1 id="terms-heading" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.03em]">Terms</h1>
      <p className="mt-2 text-sm font-semibold text-(--neutral-500)">Last updated: October 2026.</p>

      <section className="mt-8" aria-labelledby="terms-what">
        <h2 id="terms-what" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">What NutriiApp is</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          A simple way to log your meals and see your day&apos;s nutrition at a glance.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="terms-medical">
        <h2 id="terms-medical" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Not medical advice</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          What the app shows about your meals is information, not medical advice, diagnosis,
          or treatment. Talk to a qualified professional about health decisions.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="terms-account">
        <h2 id="terms-account" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Your account</h2>
        <ul className="mt-3 grid gap-2 leading-[1.6] text-(--neutral-800)">
          <li>Give accurate sign-up details and keep your password to yourself.</li>
          <li>You are responsible for anything done through your account.</li>
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="terms-content">
        <h2 id="terms-content" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Your content</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          The meals you enter are yours. Don&apos;t enter someone else&apos;s private information.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="terms-fair">
        <h2 id="terms-fair" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Fair use</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          Don&apos;t misuse the app: no trying to access other people&apos;s accounts or data,
          and no interfering with the service.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="terms-availability">
        <h2 id="terms-availability" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Availability</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          The app is provided as-is. We may change or stop parts of the service, and we
          don&apos;t guarantee it will always be available or error-free.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="terms-delete">
        <h2 id="terms-delete" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Deleting your account</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          Email <strong>[add your contact email here]</strong> from the address you signed
          up with and ask for deletion, as described in our{' '}
          <a className="font-semibold text-(--brand-700)" href="#privacy">privacy policy</a>.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="terms-changes">
        <h2 id="terms-changes" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Changes</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          These terms may change. The current version always lives on this page, and
          continuing to use the app means you accept it.
        </p>
      </section>
    </main>
  )
}

export default TermsScreen
