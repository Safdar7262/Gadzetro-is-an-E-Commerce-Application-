import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearchParams } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import AuthCard from '../../components/auth/AuthCard.jsx'
import Button from '../../components/common/Button.jsx'
import PasswordInput from '../../components/forms/PasswordInput.jsx'
import PasswordStrength from '../../components/forms/PasswordStrength.jsx'
import { resetPassword } from '../../services/authService.js'
import { resetPasswordSchema } from '../../utils/validation.js'

// Ready for a backend-issued token (?token=...). In the demo no token is generated or checked.
export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema), mode: 'onTouched', defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (values) => {
    setError('')
    try { await resetPassword({ token, password: values.password }); setDone(true) } catch (err) { setError(err.message || 'Could not reset the password.') }
  }

  if (done) {
    return (
      <AuthCard title="Password reset (simulated)">
        <div className="auth-success">
          <FiCheckCircle aria-hidden="true" />
          <p>This is a simulation, so your real password was <strong>not</strong> changed.</p>
          <Button to="/login">Go to login</Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a strong password you have not used before." footer={<Link to="/login">Back to login</Link>}>
      {!token && <p className="deal-note">Demo mode: the real app will require a token from the reset email link.</p>}
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <PasswordInput label="New password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <PasswordStrength password={watch('password')} />
        <PasswordInput label="Confirm new password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" size="lg" className="full" loading={isSubmitting}>Reset password</Button>
      </form>
    </AuthCard>
  )
}
