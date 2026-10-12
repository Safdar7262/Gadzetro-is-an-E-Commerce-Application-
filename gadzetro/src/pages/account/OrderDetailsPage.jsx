import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import OrderTimeline from '../../components/account/OrderTimeline.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useAuth from '../../hooks/useAuth.js'
import useAsync from '../../hooks/useAsync.js'
import { belongsToUser, canCancel, cancelOrder, getOrderById } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/account.css'

const PAYMENT = { cod: 'Cash on Delivery', upi: 'UPI (demo)', card: 'Card (demo)' }

export default function OrderDetailsPage() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const { data: order, loading, error, setData } = useAsync(() => getOrderById(orderId), [orderId])
  const [confirming, setConfirming] = useState(false)
  const [cancelError, setCancelError] = useState('')

  if (loading) return <Loader label="Loading order..." />
  if (error || !belongsToUser(order, user)) {
    return <EmptyState title="Order not found" message="We could not find this order in your account." action={<Button to="/account/orders">Back to my orders</Button>} />
  }

  const handleCancel = async () => {
    setCancelError('')
    try { setData(await cancelOrder(order.id)) } catch (err) { setCancelError(err.message || 'Could not cancel this order.') }
    setConfirming(false)
  }
  const a = order.shippingAddress
  const p = order.pricing

  return (
    <div className="account-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/account/orders">My orders</Link> / <span>{order.id}</span></nav>
      <div className="deal-head"><h1 className="page-title">Order {order.id}</h1><OrderStatusBadge status={order.status} /></div>
      <p className="muted">Placed on {formatDate(order.createdAt)} · {PAYMENT[order.paymentMethod]}</p>
      {cancelError && <p className="auth-error" role="alert">{cancelError}</p>}

      <section className="panel"><h2>Order status</h2><OrderTimeline order={order} />
        {canCancel(order) && <div><Button variant="danger" size="sm" onClick={() => setConfirming(true)}>Cancel order</Button></div>}
        <p className="muted small">Demo timeline only: no real shipment tracking or cancellation API exists yet.</p>
      </section>

      <section className="panel">
        <h2>Items</h2>
        {order.items.map((i) => (
          <article key={i.productId} className="saved-item">
            <img src={i.image} alt={i.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} />
            <div><Link to={`/product/${i.slug}`}><strong>{i.name}</strong></Link><p className="muted">Qty {i.qty} × {formatCurrency(i.price)}</p></div>
            <strong>{formatCurrency(i.price * i.qty)}</strong>
          </article>
        ))}
        <dl className="summary-rows">
          <div><dt>Subtotal</dt><dd>{formatCurrency(p.subtotal)}</dd></div>
          {p.discount > 0 && <div><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>−{formatCurrency(p.discount)}</dd></div>}
          <div><dt>Shipping</dt><dd>{p.shipping === 0 ? 'Free' : formatCurrency(p.shipping)}</dd></div>
          <div><dt>Estimated tax</dt><dd>{formatCurrency(p.tax)}</dd></div>
          <div className="total"><dt>Total</dt><dd>{formatCurrency(p.total)}</dd></div>
        </dl>
      </section>

      <section className="panel"><h2>Shipping address</h2>
        <address>{a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city}, {a.state} {a.pincode}<br />Phone: {a.phone}</address>
      </section>

      <ConfirmDialog open={confirming} danger title="Cancel this order?" message="This demo order will be marked as cancelled." confirmLabel="Yes, cancel order" onCancel={() => setConfirming(false)} onConfirm={handleCancel} />
    </div>
  )
}
