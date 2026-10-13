import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle } from 'react-icons/fi'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import { submitContactMessage } from '../../services/contactService.js'
import { contactSchema } from '../../utils/validation.js'
import '../../styles/account.css' // textarea + form message styles
import '../../styles/info.css'

export default function ContactPage() {
  const [sent, setSent] = useState(null) // { id, name } after a successful submit
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = async (values) => {
    setError('')
    try {
      const result = await submitContactMessage(values)
      setSent({ id: result.id, name: values.name })
      reset()
    } catch (err) {
      setError(err.message || 'Could not send your message. Please try again.')
    }
  }

  return (
    <div className="container page info">
      <header className="page-header">
        <h1 className="page-title">Contact us</h1>
        <p>Have a question about an order or a product? Send us a message.</p>
      </header>

      <div className="contact-layout">
        <section className="panel" aria-label="Contact form">
          {sent ? (
            <div className="auth-success">
              <FiCheckCircle aria-hidden="true" />
              <h2>Thanks, {sent.name.split(' ')[0]}!</h2>
              <p>Your message was recorded. Reference: <strong>{sent.id}</strong></p>
              <p className="muted small">Demo only: the message is saved in this browser and nobody receives it.</p>
              <Button variant="outline" onClick={() => setSent(null)}>Send another message</Button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <div className="form-grid">
                <Input label="Your name" autoComplete="name" error={errors.name?.message} {...register('name')} />
                <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
                <Input label="Subject" className="span-2" error={errors.subject?.message} {...register('subject')} />
                <div className="ui-field span-2">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" rows={5} aria-invalid={errors.message ? true : undefined} {...register('message')} />
                  {errors.message && <p className="ui-field-error" role="alert">{errors.message.message}</p>}
                </div>
              </div>
              <Button type="submit" size="lg" loading={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send message'}</Button>
            </form>
          )}
        </section>

        <aside className="panel contact-details" aria-label="Store details">
          <h2>Store details</h2>
          <p className="muted small">Placeholder details: replace with your real information.</p>
          <ul>
            <li><FiMail /> support@gadzetro.example</li>
            <li><FiPhone /> +91 00000 00000</li>
            <li><FiMapPin /> Your Store Address, City, State</li>
            <li><FiClock /> Mon to Sat, 10:00 to 18:00 (placeholder)</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}