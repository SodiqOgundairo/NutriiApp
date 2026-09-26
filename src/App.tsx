import { useEffect, useState } from 'react'
import LandingScreen from './components/LandingScreen'
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import ForgotScreen from './components/ForgotScreen'
import DashboardScreen from './components/DashboardScreen'
import LogMealScreen from './components/LogMealScreen'
import AnalysisScreen from './components/AnalysisScreen'
import ProfileScreen from './components/ProfileScreen'
import ResetScreen from './components/ResetScreen'
import AmbientBackground from './components/AmbientBackground'
import { SESSION_EVENT, getDemoSession, type DemoSession } from './lib/session'

type Route = 'landing' | 'signin' | 'signup' | 'forgot' | 'reset' | 'dashboard' | 'log-meal' | 'analysis' | 'profile'

function routeFromHash(): Route {
  const hash = window.location.hash.replace(/^#/, '').split('?')[0]
  if (hash === '' || hash === 'home') return 'landing'
  if (hash === 'signin' || hash === 'signup' || hash === 'forgot' || hash === 'reset') return hash
  if (hash === 'dashboard' || hash === 'log-meal' || hash === 'analysis' || hash === 'profile') return hash
  return 'landing'
}

const PROTECTED_ROUTES: Route[] = ['dashboard', 'log-meal', 'analysis', 'profile']

function App() {
  const [route, setRoute] = useState<Route>(() => routeFromHash())
  const [session, setSession] = useState<DemoSession | null>(() => getDemoSession())

  useEffect(() => {
    const handleHashChange = () => setRoute(routeFromHash())
    const handleSessionChange = () => setSession(getDemoSession())
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener(SESSION_EVENT, handleSessionChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener(SESSION_EVENT, handleSessionChange)
    }
  }, [])

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
    case 'log-meal':
      return (
        <>
          {background}
          <LogMealScreen />
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
          <ProfileScreen />
        </>
      )
    default:
      return <LandingScreen />
  }
}

export default App
