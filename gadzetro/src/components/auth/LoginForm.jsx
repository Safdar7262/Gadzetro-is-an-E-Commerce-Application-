import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'
import PasswordInput from '../forms/PasswordInput.jsx'
import useAuth from '../../hooks/useAuth.js'
import { loginSchema } from '../../utils/validation.js'

// Shared by /login and /admin/login. adminMode rejects non-admin accounts (frontend demo check only).
export default function LoginForm({ adminMode = false, onSuccess }) {
  const { login, logout } = useAuth()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      const user = await login(values.email, values.password, values.remember)
      if (adminMode && user.role !== 'admin') {
        logout()
        setError('This account does not have admin access (demo check).')
        return
      }
      onSuccess(user)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <PasswordInput label="Password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
      <div className="auth-row">
        <label className="filter-option"><input type="checkbox" {...register('remember')} /> Remember me</label>
        {!adminMode && <Link to="/forgot-password">Forgot password?</Link>}
      </div>
      <Button type="submit" size="lg" className="full" loading={isSubmitting}>{isSubmitting ? 'Logging in...' : adminMode ? 'Log in to admin' : 'Log in'}</Button>
    </form>
  )
}
