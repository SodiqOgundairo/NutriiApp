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
      <h1 id="privacy-heading" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.03em]">Privacy policy</h1>
      <p className="mt-2 text-sm font-semibold text-(--neutral-500)">Last updated: October 2026.</p>

      <section className="mt-8" aria-labelledby="privacy-intro">
        <h2 id="privacy-intro" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Who we are</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          NutriiApp is a simple app for logging your meals and seeing your day&apos;s
          nutrition at a glance. This policy explains what information we collect, how we
          use it, and the choices you have. If anything here is unclear, contact us at{' '}
          <a className="font-semibold text-(--brand-700)" href="mailto:hello@gr8m.com">hello@gr8m.com</a>.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-collect">
        <h2 id="privacy-collect" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Information we collect</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          We collect the minimum needed to run the app. Everything below is given by you
          when you use the app, except where noted:
        </p>
        <ul className="mt-3 grid gap-2 leading-[1.6] text-(--neutral-800)">
          <li>
            <strong>Account information:</strong> your email address and your username.
            If you sign in with Google, we receive your email address and the name on
            your Google account instead of a chosen username.
          </li>
          <li>
            <strong>Password:</strong> if you sign up with email, your password goes to our
            sign-in provider and is stored scrambled so it cannot be read back, not even
            by us. If you sign in with Google, we never see or store a password for you.
          </li>
          <li>
            <strong>Meals you log:</strong> what you ate, how much, the type of meal, and
            the day it belongs to. This is the content of the app: without it there is
            nothing to show you.
          </li>
          <li>
            <strong>Sign-in session (automatic):</strong> your browser keeps a token so you
            stay signed in between visits. Signing out removes it.
          </li>
          <li>
            <strong>Font request (automatic):</strong> pages load a font from Google Fonts,
            which sees a normal web request when pages load, like any website resource.
          </li>
        </ul>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          We do not collect your location, your contacts, your photos, or anything else
          from your device. There are no ad trackers and no analytics tools watching how
          you use the app.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-use">
        <h2 id="privacy-use" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">How we use it</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          Your information is used only to run the app for you:
        </p>
        <ul className="mt-3 grid gap-2 leading-[1.6] text-(--neutral-800)">
          <li>Creating and protecting your account, and signing you in and out.</li>
          <li>Saving the meals you log and showing them back to you with your daily nutrition.</li>
          <li>Sending password-reset emails when you ask for one.</li>
          <li>Keeping your meals visible only to your account.</li>
        </ul>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          We do not use your information for advertising, we do not sell it, and we do not
          share it with anyone except the service providers named below.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-storage">
        <h2 id="privacy-storage" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Where it is kept and how it is protected</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          Everything you enter is stored in our database, hosted by Supabase. Access is
          restricted so that your meals can only be read or changed by your own signed-in
          account. Passwords are never stored in readable form. Like any internet service,
          no method of storage is perfectly secure, but we limit collection to what the
          app needs and restrict access to your own data.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-sharing">
        <h2 id="privacy-sharing" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Who we share it with</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          We do not sell your personal information and we do not share it with
          advertisers, data brokers, or any other third party, except:
        </p>
        <ul className="mt-3 grid gap-2 leading-[1.6] text-(--neutral-800)">
          <li>
            <strong>Supabase,</strong> which hosts our database and sign-in service and
            stores your information on our behalf ({' '}
            <a className="font-semibold text-(--brand-700)" href="https://supabase.com/privacy" target="_blank" rel="noreferrer">
              supabase.com/privacy
            </a>
            ).
          </li>
          <li>
            <strong>Google,</strong> but only if you choose Google sign-in: that login step
            goes through Google, and Google&apos;s handling of it is covered by their own
            policy ({' '}
            <a className="font-semibold text-(--brand-700)" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              policies.google.com/privacy
            </a>
            ).
          </li>
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="privacy-retention">
        <h2 id="privacy-retention" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">How long we keep it</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          We keep your account and meals for as long as your account exists, so the app
          keeps working for you. When you ask us to delete your account, we delete your
          sign-in, your username, and all of your meals.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-rights">
        <h2 id="privacy-rights" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Your choices and rights</h2>
        <ul className="mt-3 grid gap-2 leading-[1.6] text-(--neutral-800)">
          <li><strong>See your data:</strong> your dashboard and profile show what we hold about you.</li>
          <li><strong>Correct it:</strong> you can change your username on the profile page.</li>
          <li><strong>Sign out:</strong> the account menu signs you out on that browser.</li>
          <li>
            <strong>Delete everything:</strong> email{' '}
            <a className="font-semibold text-(--brand-700)" href="mailto:hello@gr8m.com">hello@gr8m.com</a>{' '}
            from the address you signed up with and ask for deletion.
          </li>
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="privacy-children">
        <h2 id="privacy-children" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Children</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          NutriiApp is not directed at children under 13, and we do not knowingly collect
          their information. If you believe a child has created an account, contact us at{' '}
          <a className="font-semibold text-(--brand-700)" href="mailto:hello@gr8m.com">hello@gr8m.com</a>{' '}
          and we will delete it.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="privacy-changes">
        <h2 id="privacy-changes" className="m-0 text-[22px] font-extrabold tracking-[-0.01em]">Changes and contact</h2>
        <p className="mt-3 leading-[1.6] text-(--neutral-800)">
          If this policy changes, the new version will appear on this page with a new
          date. Questions about privacy, or requests about your data, go to{' '}
          <a className="font-semibold text-(--brand-700)" href="mailto:hello@gr8m.com">hello@gr8m.com</a>.
          Also see our{' '}
          <a className="font-semibold text-(--brand-700)" href="/terms">terms of use</a>.
        </p>
      </section>
    </main>
  )
}

export default PrivacyScreen
