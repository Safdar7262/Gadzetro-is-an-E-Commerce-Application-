import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAsync from '../../hooks/useAsync.js'
import { getOrders, updateOrderStatus } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import Loader from '../../components/common/Loader.jsx'

export const STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminOrdersPage() {
  const { data: orders, loading, error, reload } = useAsync(getOrders)
  const [filter, setFilter] = useState('All')
  const [message, setMessage] = useState('')

  if (loading) return <Loader />
  if (error) return <p role="alert">{error}</p>

  const change = async (id, status) => {
    try { await updateOrderStatus(id, status); setMessage(`Order ${id} marked ${status}.`); reload() }
    catch (e) { setMessage(e.message || 'Could not update the order.') }
  }
  const shown = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="admin-page">
      <h1 className="admin-title">Orders</h1>
      <div className="admin-toolbar">
        <label>Status{' '}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {['All', ...STATUSES].map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        {message && <span role="status" className="admin-msg">{message}</span>}
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan="7">No orders found.</td></tr>}
            {shown.map((o) => (
              <tr key={o.id}>
                <td><Link to={`/admin/orders/${o.id}`}>{o.id}</Link></td>
                <td>{o.customer?.name}<br /><small>{o.customer?.email}</small></td>
                <td>{formatDate(o.createdAt)}</td>
                <td>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                <td>{formatCurrency(o.pricing.total)}</td>
                <td><OrderStatusBadge status={o.status} /></td>
                <td>
                  <select value={o.status} onChange={(e) => change(o.id, e.target.value)} aria-label={`Change status of ${o.id}`}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}