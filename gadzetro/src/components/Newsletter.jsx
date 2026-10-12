import { useState } from 'react'
import '../styles/Newsletter.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }
    // Frontend-only simulation: no email service is connected.
    setStatus({ type: 'success', message: 'Thanks for subscribing! Check your inbox for our latest offers.' })
    setEmail('')
  }

  return (
    <section id="newsletter" className="newsletter">
      <div className="container newsletter-inner">
        <h2>Stay Updated!</h2>
        <p>Subscribe to get the latest updates on new arrivals, exclusive offers, and more.</p>
        <form onSubmit={handleSubmit} noValidate>
          <input type="email" placeholder="Enter your email address" aria-label="Email address" value={email} onChange={(e) => { setEmail(e.target.value); setStatus({ type: '', message: '' }) }} />
          <button type="submit" className="btn btn-primary">Subscribe</button>
        </form>
        <p className={`form-message ${status.type}`} role="status">{status.message}</p>
      </div>
    </section>
  )
}
