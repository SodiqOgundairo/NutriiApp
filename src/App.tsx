import { useEffect, useState } from 'react'
import LandingScreen from './components/LandingScreen'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import ForgotScreen from './components/ForgotScreen'
import DashboardScreen from './components/DashboardScreen'
import AnalysisScreen from './components/AnalysisScreen'
import ProfileScreen from './components/ProfileScreen'
import ResetScreen from './components/ResetScreen'
import AmbientBackground from './components/AmbientBackground'
import { sessionFromUser, type AppSession } from './lib/session'
import { supabase } from './lib/supabase'

type Route = 'landing' | 'signin' | 'signup' | 'forgot' | 'reset' | 'dashboard' | 'analysis' | 'profile'

function routeFromHash(): Route {
  const hash = window.location.hash.replace(/^#/, '').split('?')[0]
  if (hash === '' || hash === 'home') return 'landing'
  if (hash === 'signin' || hash === 'signup' || hash === 'forgot' || hash === 'reset') return hash
  if (hash === 'dashboard' || hash === 'analysis' || hash === 'profile') return hash
  return 'landing'
}

const PROTECTED_ROUTES: Route[] = ['dashboard', 'analysis', 'profile']

function App() {
  const [route, setRoute] = useState<Route>(() => routeFromHash())
  const [session, setSession] = useState<AppSession | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const handleHashChange = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true)
      return
    }
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(sessionFromUser(data.session?.user ?? null))
      setAuthReady(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      setSession(sessionFromUser(supabaseSession?.user ?? null))
      setAuthReady(true)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!authReady) {
    return null
  }

  if (PROTECTED_ROUTES.includes(route) && !session) {
    return <LoginScreen />
  }

  const background = session ? <AmbientBackground /> : null

  if ((route === 'signin' || route === 'signup') && session) {
    return (
      <>
        {background}
        <DashboardScreen session={session} />
      </>
    )
  }

  switch (route) {
    case 'signin':
      return <LoginScreen />
    case 'signup':
      return <SignupScreen />
    case 'forgot':
      return <ForgotScreen />
    case 'reset':
      return <ResetScreen />
    case 'dashboard':
      return (
        <>
          {background}
          <DashboardScreen session={session} />
        </>
      )
    case 'analysis':
      return (
        <>
          {background}
          <AnalysisScreen />
        </>
      )
    case 'profile':
      return (
        <>
          {background}
          <ProfileScreen session={session} />
        </>
      )
    default:
      return <LandingScreen />
  }
}

export default App
