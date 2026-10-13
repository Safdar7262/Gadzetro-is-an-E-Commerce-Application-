import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscribeToNewsletter } from '../../services/newsletterService.js'
import { newsletterSchema } from '../../utils/validation.js'
import '../../styles/Newsletter.css' // reuses the homepage newsletter look

export default function NewsletterBand() {
  const [status, setStatus] = useState({ type: '', message: '' })
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async ({ email }) => {
    setStatus({ type: '', message: '' })
    try {
      const result = await subscribeToNewsletter(email)
      setStatus({
        type: 'success',
        message: result.alreadySubscribed ? 'You are already subscribed with this email.' : 'Thanks for subscribing! (Demo: no email is actually sent.)',
      })
      reset()
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Could not subscribe. Please try again.' })
    }
  }

  const feedback = errors.email?.message || status.message
  const feedbackType = errors.email ? 'error' : status.type

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="container newsletter-inner">
        <h2 id="newsletter-title">Stay Updated!</h2>
        <p>Subscribe to get the latest updates on new arrivals, exclusive offers, and more.</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="email" placeholder="Enter your email address" aria-label="Email address" aria-invalid={errors.email ? true : undefined} {...register('email')} />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</button>
        </form>
        <p className={`form-message ${feedbackType}`} role="status">{feedback}</p>
      </div>
    </section>
  )
}