import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import useAuth from '../../hooks/useAuth.js'
import { profileSchema } from '../../utils/validation.js'
import '../../styles/account.css'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email, phone: user.phone },
  })

  const onSubmit = async (values) => {
    setError(''); setMessage('')
    try {
      const updated = await updateProfile(values)
      reset({ name: updated.name, email: updated.email, phone: updated.phone })
      setEditing(false)
      setMessage('Profile updated.')
    } catch (err) { setError(err.message || 'Could not save your changes.') }
  }
  const cancel = () => { reset({ name: user.name, email: user.email, phone: user.phone }); setEditing(false); setError('') }

  return (
    <div className="account-page">
      <h1 className="page-title">My profile</h1>
      {message && <p className="success-msg" role="status">{message}</p>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      <form className="panel" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-grid">
          <Input label="Full name" disabled={!editing} error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" disabled={!editing} error={errors.email?.message} {...register('email')} />
          <Input label="Phone" inputMode="numeric" maxLength={10} disabled={!editing} error={errors.phone?.message} {...register('phone')} />
        </div>
        <div className="coming-soon-actions">
          {editing ? (
            <>
              <Button type="submit" loading={isSubmitting}>Save changes</Button>
              <Button variant="outline" onClick={cancel}>Cancel</Button>
            </>
          ) : <Button type="button" onClick={() => { setMessage(''); setEditing(true) }}>Edit profile</Button>}
        </div>
      </form>
    </div>
  )
}
