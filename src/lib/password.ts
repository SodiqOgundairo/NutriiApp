// Shared password policy: composition rules plus a denylist of commonly
// used passwords (with light leet-speak normalisation), so users cannot
// sign up with easily guessed passwords. Used by signup and reset screens.

const MIN_LENGTH = 8

// Well-known passwords, all lowercase. Compared after lowercasing,
// leet-normalising and stripping trailing digits/symbols, so variants
// like "Password123" or "P@ssw0rd1!" are also rejected.
const COMMON_PASSWORDS = new Set([
  '12345678',
  '123456789',
  '1234567890',
  '123123',
  '1234567',
  '11111111',
  '00000000',
  'password',
  'password1',
  'password12',
  'password123',
  'passw0rd',
  'p@ssword',
  'p@ssw0rd',
  'qwerty',
  'qwerty123',
  'qwertyuiop',
  'abc123',
  'abc12345',
  '1q2w3e4r',
  '1qaz2wsx',
  'letmein',
  'welcome',
  'welcome1',
  'welcome123',
  'monkey',
  'dragon',
  'sunshine',
  'princess',
  'football',
  'iloveyou',
  'charlie',
  'aa123456',
  'admin123',
  'login123',
  'changeme',
  'master',
  'shadow',
  'michael',
  'jennifer',
  'jordan',
  'hunter',
  'buster',
  'soccer',
  'harley',
  'ranger',
  'thomas',
  'robert',
  'daniel',
  'whatever',
  'freedom',
  'superman',
  'batman',
  'trustno1',
  'michelle',
  'pepper',
  'ginger',
  'summer',
  'tigger',
  'pepper123',
  'ginger123',
  'summer123',
  'liverpool',
  'chelsea',
  'arsenal',
  'manchester',
  'qazwsx',
  'starwars',
  'flower',
  'hello123',
  'jesus123',
  'killer',
  'matrix',
  'mustang',
  'nutriiapp',
  'nutrii',
])

function normaliseForDenylist(password: string): string {
  return password
    .replace(/[^a-zA-Z]+$/, '')
    .toLowerCase()
    .replace(/[@]/g, 'a')
    .replace(/0/g, 'o')
    .replace(/3/g, 'e')
    .replace(/[$]/g, 's')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/1/g, 'l')
    .replace(/!/g, 'l')
}

function isCommonPassword(password: string): boolean {
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return true
  if (COMMON_PASSWORDS.has(normaliseForDenylist(password))) return true
  // Four or more of the same character in a row is trivially guessable.
  if (/(.)\1{3,}/.test(password)) return true
  return false
}

export interface PasswordOptions {
  username?: string
  email?: string
}

export interface PasswordRule {
  id: 'length' | 'cases' | 'number' | 'symbol' | 'common' | 'personal'
  label: string
  passed: boolean
}

export function passwordRules(password: string, options: PasswordOptions = {}): PasswordRule[] {
  const username = (options.username ?? '').trim().toLowerCase()
  const emailLocal = (options.email ?? '').trim().toLowerCase().split('@')[0] ?? ''
  const lowered = password.toLowerCase()
  const containsPersonal =
    (username.length >= 3 && lowered.includes(username)) ||
    (emailLocal.length >= 3 && lowered.includes(emailLocal))

  return [
    { id: 'length', label: 'At least 8 characters', passed: password.length >= MIN_LENGTH },
    {
      id: 'cases',
      label: 'Upper and lower case letters',
      passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    { id: 'number', label: 'At least one number', passed: /[0-9]/.test(password) },
    {
      id: 'symbol',
      label: 'At least one symbol (e.g. !@#$%)',
      passed: /[^a-zA-Z0-9]/.test(password),
    },
    {
      id: 'common',
      label: 'Not a commonly used password',
      passed: password.length > 0 && !isCommonPassword(password),
    },
    {
      id: 'personal',
      label: 'Does not contain your username or email',
      passed: password.length > 0 && !containsPersonal,
    },
  ]
}

const RULE_MESSAGES: Record<PasswordRule['id'], string> = {
  length: 'Use at least 8 characters.',
  cases: 'Include both upper and lower case letters.',
  number: 'Include at least one number.',
  symbol: 'Include at least one symbol (e.g. !@#$%).',
  common: 'That password is too easy to guess. Try something less common.',
  personal: 'Do not include your username or email in your password.',
}

/** Returns the first failing rule message, or null when the password passes. */
export function validatePassword(password: string, options: PasswordOptions = {}): string | null {
  for (const rule of passwordRules(password, options)) {
    if (!rule.passed) return RULE_MESSAGES[rule.id]
  }
  return null
}
