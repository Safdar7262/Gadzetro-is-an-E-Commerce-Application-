import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { getOrderById } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/cart.css'

const PAYMENT_LABELS = { cod: 'Cash on Delivery', upi: 'UPI (demo)', card: 'Card (demo)' }

export default function OrderSuccessPage() {
  const { orderId } = useParams()
  const [state, setState] = useState({ order: null, loading: true, error: '' })

  useEffect(() => {
    let cancelled = false
    setState({ order: null, loading: true, error: '' })
    getOrderById(orderId)
      .then((order) => { if (!cancelled) setState({ order, loading: false, error: '' }) })
      .catch((err) => { if (!cancelled) setState({ order: null, loading: false, error: err.message || 'Could not load order' }) })
    return () => { cancelled = true }
  }, [orderId])

  const { order, loading, error } = state
  if (loading) return <div className="container page"><Loader label="Loading your order..." /></div>
  if (!order) {
    return (
      <div className="container page">
        <EmptyState title="Order not found" message={error} action={<Button to="/shop">Continue shopping</Button>} />
      </div>
    )
  }

  const a = order.shippingAddress
  return (
    <div className="container page success">
      <div className="success-head">
        <FiCheckCircle aria-hidden="true" />
        <h1>Thank you, your demo order is placed!</h1>
        <p>Demo order number: <strong>{order.id}</strong></p>
        <p className="muted">This is a demo order saved on this device only. No payment was taken.</p>
      </div>

      <div className="success-grid">
        <section className="panel">
          <h2>Items</h2>
          <ul className="mini-items">
            {order.items.map((i) => <li key={i.productId}><span>{i.name} × {i.qty}</span><span>{formatCurrency(i.price * i.qty)}</span></li>)}
          </ul>
          <dl className="summary-rows">
            <div><dt>Subtotal</dt><dd>{formatCurrency(order.pricing.subtotal)}</dd></div>
            {order.pricing.discount > 0 && <div><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>−{formatCurrency(order.pricing.discount)}</dd></div>}
            <div><dt>Shipping</dt><dd>{order.pricing.shipping === 0 ? 'Free' : formatCurrency(order.pricing.shipping)}</dd></div>
            <div><dt>Estimated tax</dt><dd>{formatCurrency(order.pricing.tax)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatCurrency(order.pricing.total)}</dd></div>
          </dl>
        </section>

        <section className="panel">
          <h2>Delivery details</h2>
          <address>
            <strong>{a.fullName}</strong><br />
            {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
            {a.city}, {a.state} {a.pincode}<br />
            Phone: {a.phone}
          </address>
          <p><strong>Payment:</strong> {PAYMENT_LABELS[order.paymentMethod]}</p>
          <p><strong>Placed on:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Estimated delivery:</strong> placeholder (3-5 business days)</p>
        </section>
      </div>

      <div className="coming-soon-actions">
        <Button to="/shop">Continue shopping</Button>
        <Button to={`/account/orders/${order.id}`} variant="outline">View order details</Button>
      </div>
    </div>
  )
}
