import { Link, useParams } from 'react-router-dom'
import useAsync from '../../hooks/useAsync.js'
import { getOrderById, updateOrderStatus } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDateTime } from '../../utils/formatDate.js'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import Loader from '../../components/common/Loader.jsx'
import { STATUSES } from './AdminOrdersPage.jsx'

export default function AdminOrderDetailsPage() {
  const { orderId } = useParams()
  const { data: order, loading, error, reload } = useAsync(() => getOrderById(orderId), [orderId])
  if (loading) return <Loader />
  if (error) return <div className="admin-page"><p role="alert">{error}</p><Link to="/admin/orders">← Back to orders</Link></div>

  const a = order.shippingAddress || {}
  return (
    <div className="admin-page">
      <Link to="/admin/orders">← Back to orders</Link>
      <h1 className="admin-title">Order {order.id} <OrderStatusBadge status={order.status} /></h1>
      <div className="admin-toolbar">
        <label>Update status{' '}
          <select value={order.status} onChange={async (e) => { await updateOrderStatus(order.id, e.target.value); reload() }}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="admin-card">
        <h2>Items</h2>
        <ul className="admin-list">
          {order.items.map((i) => <li key={i.productId}><span>{i.name} × {i.qty}</span><strong>{formatCurrency(i.price * i.qty)}</strong></li>)}
        </ul>
        <p>Subtotal {formatCurrency(order.pricing.subtotal)} · Discount {formatCurrency(order.pricing.discount)} · Shipping {formatCurrency(order.pricing.shipping)} · Tax {formatCurrency(order.pricing.tax)}</p>
        <p><strong>Total {formatCurrency(order.pricing.total)}</strong> · Payment: {order.paymentMethod}</p>
      </div>
      <div className="admin-card">
        <h2>Customer & shipping</h2>
        <p>{order.customer?.name} · {order.customer?.email} · {order.customer?.phone}</p>
        <p>{a.line1} {a.line2}, {a.city}, {a.state} {a.pincode}</p>
      </div>
      <div className="admin-card">
        <h2>History</h2>
        <ul className="admin-list">
          {order.statusHistory.map((h, i) => <li key={i}><span>{h.status}</span><small>{formatDateTime(h.at)}</small></li>)}
        </ul>
      </div>
    </div>
  )
}