import { useMemo } from 'react'
import { passwordRules, type PasswordOptions } from '../lib/password'

interface PasswordStrengthProps {
  password: string
  username?: string
  email?: string
}

function PasswordStrength({ password, username, email }: PasswordStrengthProps) {
  const options: PasswordOptions = useMemo(() => ({ username, email }), [username, email])
  const rules = useMemo(() => passwordRules(password, options), [password, options])

  if (!password) return null

  return (
    <ul className="m-0 grid list-none gap-1 p-0" aria-label="Password requirements">
      {rules.map((rule) => (
        <li
          key={rule.id}
          className={`flex items-center gap-2 text-[13px] font-semibold ${rule.passed ? 'text-(--brand-700)' : 'text-(--neutral-500)'}`}
        >
          <span
            aria-hidden="true"
            className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] leading-none ${
              rule.passed ? 'bg-(--brand-500) text-white' : 'bg-(--neutral-200) text-(--neutral-500)'
            }`}
          >
            {rule.passed ? '✓' : '·'}
          </span>
          {rule.label}
        </li>
      ))}
    </ul>
  )
}

export default PasswordStrength
