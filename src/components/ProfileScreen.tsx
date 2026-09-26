import { useState, type FormEvent } from 'react'
import { Button, Input, Label } from 'devign'
import { getDemoSession, updateDemoName } from '../lib/session'

function ProfileScreen() {
  const session = getDemoSession()
  const [name, setName] = useState(session?.name ?? '')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    updateDemoName(name.trim())
    setSaved(true)
    window.location.hash = '#dashboard'
  }

  return (
    <main className="mx-auto flex min-h-dvh w-[min(1440px,calc(100%-64px))] flex-col pt-5 pb-12" aria-labelledby="profile-heading">
      <a className="mb-4 inline-block text-sm font-bold text-(--brand-700) no-underline hover:text-(--brand-500)" href="#dashboard">← Back to dashboard</a>
      <p className="m-0 mb-[18px] text-xs font-extrabold uppercase tracking-[0.16em] text-(--brand-700)">Profile</p>
      <h1 id="profile-heading" className="m-0 text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.03em]">Edit profile</h1>
      <form className="mt-6 grid max-w-[560px] gap-[22px] rounded-2xl border border-(--neutral-200) bg-white p-[clamp(20px,4vw,32px)]" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="profile-name">Your name</Label>
          <Input
            id="profile-name"
            name="name"
            type="text"
            placeholder="Ahmed"
            variant="plain"
            inputSize="lg"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setSaved(false)
            }}
            required
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
        <Button type="submit" variant="primary" size="lg" className="mt-1 w-full">
          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </form>
    </main>
  )
}

export default ProfileScreen
