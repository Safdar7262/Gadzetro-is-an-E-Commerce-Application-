import { getPasswordStrength } from '../../utils/validation.js'

export default function PasswordStrength({ password }) {
  if (!password) return null
  const { score, label } = getPasswordStrength(password)
  return (
    <div className="pw-strength" aria-live="polite">
      <div className="pw-bars" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => <span key={n} className={n <= score ? `on level-${score}` : ''} />)}
      </div>
      <small>Password strength: <strong>{label}</strong></small>
    </div>
  )
}
