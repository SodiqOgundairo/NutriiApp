import { useEffect, useState, type FormEvent } from 'react'
import { Alert, AlertDescription, Button, Input, Label } from 'devign'
import {
  USERNAME_TAKEN_MESSAGE,
  isUsernameAvailable,
  updateUsername,
  validateUsername,
  type AppSession,
} from '../lib/session'

function ProfileScreen({ session }: { session: AppSession | null }) {
  const [username, setUsername] = useState(session?.username ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [usernameTaken, setUsernameTaken] = useState(false)
  const [checkingName, setCheckingName] = useState(false)

  const ownId = session?.userId

  useEffect(() => {
    if (validateUsername(username) !== null) {
      setUsernameTaken(false)
      setCheckingName(false)
      return
    }
    setCheckingName(true)
    const timer = window.setTimeout(() => {
      void isUsernameAvailable(username, ownId).then((available) => {
        setUsernameTaken(available === false)
        setCheckingName(false)
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [username, ownId])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const usernameError = validateUsername(username)
    if (usernameError) {
      setError(usernameError)
      return
    }
    setSaving(true)
    try {
      await updateUsername(username.trim())
      setSaved(true)
      window.location.hash = '#dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-[min(1440px,calc(100%-64px))] flex-col pt-5 pb-12" aria-labelledby="profile-heading">
      <a className="mb-4 inline-block text-sm font-bold text-(--brand-700) no-underline hover:text-(--brand-500)" href="#dashboard">← Back to dashboard</a>
      <p className="m-0 mb-[18px] text-xs font-extrabold uppercase tracking-[0.16em] text-(--brand-700)">Profile</p>
      <h1 id="profile-heading" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.03em]">Edit profile</h1>
      {error ? (
        <Alert variant="error" className="mt-4 max-w-[560px]" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <form className="mt-6 grid max-w-[560px] gap-[22px] rounded-2xl border border-(--neutral-200) bg-white p-[clamp(20px,4vw,32px)]" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="profile-name">Username</Label>
          <Input
            id="profile-name"
            name="username"
            type="text"
            placeholder="Ahmed"
            variant="plain"
            inputSize="lg"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
              setSaved(false)
            }}
            required
            maxLength={30}
            error={usernameTaken ? USERNAME_TAKEN_MESSAGE : undefined}
            hint={checkingName ? 'Checking availability…' : undefined}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-email">Email address</Label>
          <Input
            id="profile-email"
            name="email"
            type="email"
            variant="plain"
            inputSize="lg"
            value={session?.email ?? ''}
            disabled
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="mt-1 w-full" isLoading={saving} disabled={saving}>
          {saved ? 'Saved' : saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </main>
  )
}

export default ProfileScreen
