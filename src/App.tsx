import { useEffect, useState } from 'react'
import LandingScreen from './components/LandingScreen'
import LoginScreen from './components/LoginScreen'

function App() {
  const [isSigningIn, setIsSigningIn] = useState(() => window.location.hash === '#signin')

  useEffect(() => {
    const handleHashChange = () => setIsSigningIn(window.location.hash === '#signin')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return isSigningIn ? <LoginScreen /> : <LandingScreen />
}

export default App
