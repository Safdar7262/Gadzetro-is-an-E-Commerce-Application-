import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import AuthCard from '../../components/auth/AuthCard.jsx'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import PasswordInput from '../../components/forms/PasswordInput.jsx'
import PasswordStrength from '../../components/forms/PasswordStrength.jsx'
import useAuth from '../../hooks/useAuth.js'
import { registerSchema } from '../../utils/validation.js'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false },
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      await registerUser({ name: values.name, email: values.email, phone: values.phone, password: values.password })
      setDone(true)
    } catch (err) {
      setError(err.message || 'Could not create the account.')
    }
  }

  if (done) {
    return (
      <AuthCard title="Account created">
        <div className="auth-success">
          <FiCheckCircle aria-hidden="true" />
          <p>Your demo account is ready and you are logged in.</p>
          <Button to="/account">Go to my account</Button>
          <Button to="/shop" variant="outline">Start shopping</Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create your account" subtitle="Demo registration: data stays in this browser only." footer={<>Already have an account? <Link to="/login">Log in</Link></>}>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Mobile number" inputMode="numeric" maxLength={10} autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
        <PasswordInput label="Password" autoComplete="new-password" hint="At least 8 characters with a letter and a number." error={errors.password?.message} {...register('password')} />
        <PasswordStrength password={watch('password')} />
        <PasswordInput label="Confirm password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <div>
          <label className="filter-option"><input type="checkbox" {...register('terms')} /> <span>I agree to the <Link to="/terms">Terms and Conditions</Link></span></label>
          {errors.terms && <p className="ui-field-error" role="alert">{errors.terms.message}</p>}
        </div>
        <Button type="submit" size="lg" className="full" loading={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</Button>
      </form>
    </AuthCard>
  )
}
