import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { FiMail } from 'react-icons/fi'
import AuthCard from '../../components/auth/AuthCard.jsx'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { requestPasswordReset } from '../../services/authService.js'
import { forgotPasswordSchema } from '../../utils/validation.js'

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState('')
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } })

  const onSubmit = async ({ email }) => {
    setError('')
    try { await requestPasswordReset(email); setSentTo(email) } catch (err) { setError(err.message || 'Something went wrong.') }
  }

  if (sentTo) {
    return (
      <AuthCard title="Check your email">
        <div className="auth-success">
          <FiMail aria-hidden="true" />
          <p>If an account exists for <strong>{sentTo}</strong>, reset instructions would be sent.</p>
          <p className="muted small">Simulated: no email is sent in this demo. With the backend, the email will contain a one-time reset link.</p>
          <Button to="/reset-password" variant="outline">Open reset page (demo)</Button>
          <Link to="/login">Back to login</Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Forgot password?" subtitle="Enter your email and we will send reset instructions." footer={<Link to="/login">Back to login</Link>}>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Button type="submit" size="lg" className="full" loading={isSubmitting}>Send reset instructions</Button>
      </form>
    </AuthCard>
  )
}
