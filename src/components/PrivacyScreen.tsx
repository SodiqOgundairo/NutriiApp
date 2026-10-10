import { useEffect } from 'react'

function PrivacyScreen() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="mx-auto w-[min(768px,calc(100%-48px))] pt-8 pb-16" aria-labelledby="privacy-heading">
      <a className="inline-flex items-center gap-2.5 text-[15px] font-extrabold text-(--neutral-800) no-underline" href="#home" aria-label="NutriiApp home">
        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-(--brand-500) text-[21px] font-bold text-[#fffdf8]" aria-hidden="true">N</span>
        <span>NutriiApp</span>
      </a>
      <p className="mt-10 mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-(--neutral-500)">Privacy policy</p>
      <h1 id="privacy-heading" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.03em]">Privacy</h1>
      <p className="mt-2 text-sm font-semibold text-(--neutral-500)">Last updated: October 2026.</p>

      <section className="mt-8" aria-labelledby="privacy-collect">
        <h2 id="privacy-collect" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">What we collect</h2>
        <ul className="mt-3 grid gap-2 leading-[1.6] text-(--neutral-800)">
          <li><strong>Your email address</strong>, when you sign up or sign in (including password resets).</li>
          <li><strong>Your username.</strong> If you sign in with Google, we receive the name on your Google account instead.</li>
          <li><strong>Your password.</strong> It goes to our sign-in provider and is stored scrambled so it cannot be read back, not even by us.</li>
          <li><strong>The meals you log:</strong> what you ate, how much, the type of meal, and the day it belongs to.</li>
          <li><strong>Your sign-in session.</strong> Your browser keeps a token so you stay signed in; signing out removes it.</li>
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="privacy-where">
        <h2 id="privacy-where" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Where it is kept</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          Everything is stored in our database, hosted by Supabase. Your meals are tied to
          your account and are only visible when you are signed in as you.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-sharing">
        <h2 id="privacy-sharing" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Who else sees it</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          No one. We do not sell your information and we do not share it with advertisers
          or anyone else, except for what is needed to run the app:
        </p>
        <ul className="mt-3 grid gap-2 leading-[1.6] text-(--neutral-800)">
          <li><strong>Supabase,</strong> which hosts our database and sign-in.</li>
          <li><strong>Google,</strong> but only if you choose Google sign-in: that login step goes through Google.</li>
        </ul>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          The app loads its font from Google, which sees a normal web request when pages load,
          like any website resource. There are no ad trackers and no analytics tools watching
          how you use the app.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-delete">
        <h2 id="privacy-delete" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Deleting your account</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          There is no delete button in the app yet. To delete your account, email{' '}
          <strong>[add your contact email here]</strong> from the address you signed up with
          and ask for deletion. We will delete your sign-in, your username, and all of your meals.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-changes">
        <h2 id="privacy-changes" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Changes</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          If this policy changes, the new version will appear on this page. Also see our{' '}
          <a className="font-semibold text-(--brand-700)" href="#terms">terms of use</a>.
        </p>
      </section>
    </main>
  )
}

export default PrivacyScreen
