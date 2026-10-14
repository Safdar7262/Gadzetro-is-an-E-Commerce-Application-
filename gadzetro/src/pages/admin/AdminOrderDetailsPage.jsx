import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import OrderTimeline from '../../components/account/OrderTimeline.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import useAsync from '../../hooks/useAsync.js'
import { changeOrderStatus, getAdminOrderById } from '../../services/adminService.js'
import { NEXT_STATUSES } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDateTime } from '../../utils/formatDate.js'
import '../../styles/admin.css'

const PAYMENT = { cod: 'Cash on Delivery', upi: 'UPI (demo)', card: 'Card (demo)' }
const Address = ({ a }) => (
  <address>{a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city}, {a.state} {a.pincode}<br />Phone: {a.phone}</address>
)

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams()
  const { data: order, loading, error, setData } = useAsync(() => getAdminOrderById(orderId), [orderId])
  const [next, setNext] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  if (loading) return <Loader label="Loading order..." />
  if (error) return <EmptyState title="Order not found" message={error === 'Order not found' ? 'We could not find an order with this ID.' : error} action={<Button to="/admin/orders">Back to orders</Button>} />

  const options = NEXT_STATUSES[order.status] || []
  const selected = next && options.includes(next) ? next : options[0] || ''

  const apply = async () => {
    setActionError(''); setMessage('')
    try {
      const updated = await changeOrderStatus(order.id, selected)
      setData(updated); setNext(''); setMessage(`Status changed to ${updated.status}.`)
    } catch (err) { setActionError(err.message || 'Could not change the status.') }
    setConfirmCancel(false)
  }
  const p = order.pricing

  return (
    <div className="admin-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/admin/orders">Orders</Link> / <span>{order.id}</span></nav>
      <AdminHeader title={`Order ${order.id}`} subtitle={`Placed ${formatDateTime(order.createdAt)} · ${PAYMENT[order.paymentMethod]}`}>
        <OrderStatusBadge status={order.status} />
      </AdminHeader>
      {message && <p className="success-msg" role="status">{message}</p>}
      {actionError && <p className="auth-error" role="alert">{actionError}</p>}

      <div className="dash-grid">
        <section className="panel">
          <h2>Update status</h2>
          {options.length === 0 ? <p className="muted">This order is {order.status}, so no further changes are possible.</p> : (
            <div className="status-form">
              <label htmlFor="next-status">Change status to</label>
              <select id="next-status" value={selected} onChange={(e) => setNext(e.target.value)}>
                {options.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <Button variant={selected === 'Cancelled' ? 'danger' : 'primary'} onClick={() => (selected === 'Cancelled' ? setConfirmCancel(true) : apply())}>Update status</Button>
            </div>
          )}
          <OrderTimeline order={order} />
          <p className="muted small">Demo only: no real shipment or customer notification happens.</p>
        </section>

        <section className="panel">
          <h2>Customer</h2>
          <p><strong>{order.customer.name}</strong><br />{order.customer.email}<br />{order.customer.phone}</p>
          <p className="muted small">{order.userId ? `Account ID: ${order.userId}` : 'Guest checkout'}</p>
          <h2>Shipping address</h2>
          <Address a={order.shippingAddress} />
          <h2>Billing address</h2>
          <Address a={order.billingAddress} />
        </section>
      </div>

      <section className="panel">
        <h2>Items</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Product</th><th scope="col">Price</th><th scope="col">Qty</th><th scope="col">Total</th></tr></thead>
            <tbody>
              {order.items.map((i) => (
                <tr key={i.productId}>
                  <td><div className="cell-product"><img className="thumb" src={i.image} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} /><Link to={`/product/${i.slug}`}>{i.name}</Link></div></td>
                  <td>{formatCurrency(i.price)}</td><td>{i.qty}</td><td>{formatCurrency(i.price * i.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="summary-rows">
          <div><dt>Subtotal</dt><dd>{formatCurrency(p.subtotal)}</dd></div>
          {p.discount > 0 && <div><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>−{formatCurrency(p.discount)}</dd></div>}
          <div><dt>Shipping</dt><dd>{p.shipping === 0 ? 'Free' : formatCurrency(p.shipping)}</dd></div>
          <div><dt>Estimated tax</dt><dd>{formatCurrency(p.tax)}</dd></div>
          <div className="total"><dt>Total</dt><dd>{formatCurrency(p.total)}</dd></div>
        </dl>
      </section>

      <ConfirmDialog open={confirmCancel} danger title="Cancel this order?" message="The order will be marked as Cancelled and cannot be changed again."
        confirmLabel="Yes, cancel order" onCancel={() => setConfirmCancel(false)} onConfirm={apply} />
    </div>
  )
}