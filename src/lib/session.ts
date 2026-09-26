export interface DemoSession {
  email: string
  name?: string
}

const STORAGE_KEY = 'nutriiapp-demo-session'

export const SESSION_EVENT = 'nutriiapp:session'

function readSession(): DemoSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DemoSession
    if (!parsed || typeof parsed.email !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

export function getDemoSession(): DemoSession | null {
  return readSession()
}

function notifySessionChanged() {
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function signInDemo(email: string) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email }))
  notifySessionChanged()
}

export function signUpDemo(name: string, email: string) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email }))
  notifySessionChanged()
}

export function signOutDemo() {
  window.localStorage.removeItem(STORAGE_KEY)
  notifySessionChanged()
}

export function updateDemoName(name: string) {
  const current = readSession()
  if (!current) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, name }))
  notifySessionChanged()
}
