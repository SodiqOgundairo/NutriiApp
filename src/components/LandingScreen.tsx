import { useCallback } from 'react'
import { Button } from 'devign'
import MealCarousel from './MealCarousel'

function LandingScreen() {
  const goSignin = useCallback(() => {
    window.location.hash = '#signin'
  }, [])

  return (
    <main className="mx-auto flex min-h-dvh w-[min(1440px,calc(100%-64px))] flex-col pb-[22px]" aria-label="NutriiApp home">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#fafafa] py-5">
        <a className="inline-flex items-center gap-2.5 text-[15px] font-extrabold text-(--neutral-800) no-underline" href="#home" aria-label="NutriiApp home">
          <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-(--brand-500) text-[21px] font-bold text-[#fffdf8]" aria-hidden="true">N</span>
          <span>NutriiApp</span>
        </a>
        <Button variant="primary" size="sm" onClick={goSignin}>
          Sign in
        </Button>
      </header>

      <section className="flex flex-1 justify-center gap-10 py-10 max-md:flex-col md:items-center lg:gap-[clamp(32px,5vw,72px)]" aria-labelledby="landing-heading">
        <div className="md:flex-1">
          <p className="m-0 mb-5 text-xs font-extrabold tracking-[0.16em] text-(--brand-700) uppercase">Your day, understood</p>
          <h1 id="landing-heading" className="m-0 max-w-[660px] text-[clamp(52px,7vw,94px)] leading-[0.94] font-extrabold tracking-[-0.04em]"><span className="font-black text-(--brand-500) underline decoration-(--accent-500) decoration-[0.08em] underline-offset-[0.14em]">Eat with</span> a little more <span className="font-black text-(--brand-500) underline decoration-(--accent-500) decoration-[0.08em] underline-offset-[0.14em]">intention.</span></h1>
          <p className="mt-7 mb-0 max-w-[470px] text-lg leading-[1.55] text-(--neutral-500)">
            NutriiApp turns the meals you already eat into a clear daily picture of your nutrition.
          </p>
          <div className="mt-9 flex items-center gap-5">
            <Button variant="primary" size="lg" onClick={goSignin}>
              See today&apos;s nutrition
            </Button>
            <span className="text-sm leading-[1.35] whitespace-nowrap text-(--neutral-500)">No calorie counting. Just clarity.</span>
          </div>
        </div>

        <div className="mt-6 max-md:mx-auto max-md:w-full max-md:max-w-[520px] md:mt-0 md:w-[320px] md:shrink-0 lg:w-[440px] xl:w-[560px]">
          <MealCarousel />
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-0 pt-5 pb-1.5 text-[15px] font-semibold max-md:gap-x-3 max-md:gap-y-2 max-md:pt-4 max-md:text-[13px]">
        <a className="rounded-full px-3.5 py-2 text-(--neutral-500) no-underline transition hover:-translate-y-0.5 hover:bg-(--brand-50) hover:text-(--brand-500)" href="#signin">Log a meal</a><span className="h-1 w-1 rounded-full bg-(--accent-500)" aria-hidden="true"></span><a className="rounded-full px-3.5 py-2 text-(--neutral-500) no-underline transition hover:-translate-y-0.5 hover:bg-(--brand-50) hover:text-(--brand-500)" href="#signin">See the bigger picture</a><span className="h-1 w-1 rounded-full bg-(--accent-500)" aria-hidden="true"></span><a className="rounded-full px-3.5 py-2 text-(--neutral-500) no-underline transition hover:-translate-y-0.5 hover:bg-(--brand-50) hover:text-(--brand-500)" href="#signin">Build awareness</a>
      </footer>
    </main>
  )
}

export default LandingScreen
