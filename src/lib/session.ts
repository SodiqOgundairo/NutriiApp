import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AppSession {
  userId: string
  email: string
  username?: string
}

export function sessionFromUser(user: User | null): AppSession | null {
  if (!user) return null
  const email = user.email ?? ''
  if (!email) return null
  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>
  const username =
    typeof metadata.username === 'string'
      ? metadata.username
      : typeof metadata.display_name === 'string'
        ? metadata.display_name
        : typeof metadata.name === 'string'
          ? metadata.name
          : undefined
  return { userId: user.id, email, username }
}

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).',
    )
  }
  return supabase
}

export const USERNAME_MIN = 3
export const USERNAME_MAX = 30

/** Format rules for usernames. Returns an error message or null when valid. */
export function validateUsername(username: string): string | null {
  const clean = username.trim()
  if (!clean) return 'Choose a username.'
  if (clean.length < USERNAME_MIN) return 'Username needs at least 3 characters.'
  if (clean.length > USERNAME_MAX) return 'Username must be 30 characters or fewer.'
  if (!/^[a-zA-Z0-9._]+$/.test(clean)) {
    return 'Usernames can only use letters, numbers, dots and underscores.'
  }
  return null
}

export const USERNAME_TAKEN_MESSAGE = 'That username is taken. Try another.'

function escapeIlike(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

/**
 * Best-effort uniqueness check against the profiles registry (case-insensitive).
 * Returns true when free, false when taken, null when it cannot be checked
 * (e.g. Supabase unconfigured or the profiles migration not run yet) so
 * callers can proceed instead of blocking. The unique index + trigger are
 * the real backstop.
 */
export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string,
): Promise<boolean | null> {
  if (!supabase) return null
  const clean = username.trim()
  if (!clean) return null
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', escapeIlike(clean))
      .limit(1)
    if (error) throw error
    const rows = (data ?? []).filter((row) => row.id !== excludeUserId)
    return rows.length === 0
  } catch {
    return null
  }
}

export async function signUpWithEmail(input: {
  username: string
  email: string
  password: string
}): Promise<{ needsConfirmation: boolean }> {
  const client = requireSupabase()
  const cleanUsername = input.username.trim()
  const usernameError = validateUsername(input.username)
  if (usernameError) throw new Error(usernameError)
  const available = await isUsernameAvailable(cleanUsername)
  if (available === false) throw new Error(USERNAME_TAKEN_MESSAGE)
  const { data, error } = await client.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: { username: cleanUsername, display_name: cleanUsername },
    },
  })
  if (error) {
    // Supabase masks trigger failures (e.g. the username-taken backstop) as a
    // generic database error; translate it into something actionable.
    if (/database error saving new user/i.test(error.message)) {
      throw new Error('Sign up failed, the username may already be taken. Try another one.')
    }
    throw error
  }
  // When email confirmation is on, there is no session yet.
  return { needsConfirmation: !data.session }
}

export async function signInWithEmail(input: { email: string; password: string }): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  })
  if (error) throw error
}

export const INVALID_CREDENTIALS_MESSAGE = 'Incorrect email/username or password.'

/**
 * Sign in with either an email address or a username. Usernames are resolved
 * to their account email via the email_for_username function (run
 * supabase/username_login_lookup.sql first); the password is always verified
 * by Supabase Auth. Unknown usernames get the same generic error as wrong
 * passwords.
 */
export async function signInWithIdentifier(input: {
  identifier: string
  password: string
}): Promise<void> {
  const client = requireSupabase()
  const identifier = input.identifier.trim()
  const toGeneric = (err: unknown): Error => {
    const message = err instanceof Error ? err.message : ''
    // Wrong passwords stay generic (no username enumeration); anything else
    // (e.g. email not confirmed) is surfaced as-is so users can act on it.
    if (/invalid login credentials/i.test(message)) return new Error(INVALID_CREDENTIALS_MESSAGE)
    return err instanceof Error ? err : new Error(INVALID_CREDENTIALS_MESSAGE)
  }
  if (identifier.includes('@')) {
    try {
      await signInWithEmail({ email: identifier, password: input.password })
    } catch (err) {
      throw toGeneric(err)
    }
    return
  }
  const { data, error } = await client.rpc('email_for_username', { p_username: identifier })
  if (error) throw error
  const email = typeof data === 'string' ? data : null
  if (!email) throw new Error(INVALID_CREDENTIALS_MESSAGE)
  try {
    await signInWithEmail({ email, password: input.password })
  } catch (err) {
    throw toGeneric(err)
  }
}

/**
 * Start Google sign-in via Supabase Auth (OAuth redirect). Resolves when the
 * redirect starts; Supabase returns the user to redirectTo with a session.
 * Requires the Google provider enabled in Supabase Auth and this origin
 * allowlisted in the Auth URL configuration.
 */
export async function signInWithGoogle(): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}#dashboard`,
      queryParams: { prompt: 'select_account' },
    },
  })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.auth.signOut()
  if (error) throw error
}

export async function updateUsername(username: string): Promise<void> {
  const client = requireSupabase()
  const usernameError = validateUsername(username)
  if (usernameError) throw new Error(usernameError)
  const clean = username.trim()
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) throw new Error('You need to be signed in to update your profile.')
  const available = await isUsernameAvailable(clean, user.id)
  if (available === false) throw new Error(USERNAME_TAKEN_MESSAGE)
  const { error: profileError } = await client
    .from('profiles')
    .upsert({ id: user.id, username: clean }, { onConflict: 'id' })
  if (profileError) {
    if (profileError.code === '23505') throw new Error(USERNAME_TAKEN_MESSAGE)
    throw profileError
  }
  const { error } = await client.auth.updateUser({
    data: { username: clean, display_name: clean },
  })
  if (error) throw error
}
