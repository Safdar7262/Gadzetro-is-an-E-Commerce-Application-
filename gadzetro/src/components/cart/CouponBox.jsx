import { useState } from 'react'
import { coupons } from '../../data/coupons.js'
import Button from '../common/Button.jsx'

export default function CouponBox({ appliedCoupon, couponState, onApply, onRemove }) {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState(null)

  const submit = (value) => {
    const result = onApply(value)
    setMessage(result)
    if (result.ok) setCode('')
  }

  if (appliedCoupon) {
    return (
      <div className="coupon-box">
        <p className="coupon-applied">
          <strong>{appliedCoupon.code}</strong> applied
          <button type="button" className="chip-clear" onClick={() => { onRemove(); setMessage(null) }}>Remove</button>
        </p>
        {couponState && !couponState.valid && <p className="cart-warning" role="alert">{couponState.reason}</p>}
      </div>
    )
  }

  return (
    <div className="coupon-box">
      <form onSubmit={(e) => { e.preventDefault(); submit(code) }}>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Coupon code" aria-label="Coupon code" />
        <Button type="submit" variant="outline" size="sm">Apply</Button>
      </form>
      {message && <p className={message.ok ? 'pin-msg ok' : 'pin-msg bad'} role="status">{message.message}</p>}
      <details>
        <summary>Demo coupon codes</summary>
        <ul className="coupon-list">
          {coupons.map((c) => (
            <li key={c.code}><button type="button" className="chip" onClick={() => submit(c.code)}>{c.code}</button> <span className="muted small">{c.description}</span></li>
          ))}
        </ul>
      </details>
    </div>
  )
}
