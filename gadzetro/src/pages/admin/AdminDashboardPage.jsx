import { Link } from 'react-router-dom'
import useAsync from '../../hooks/useAsync.js'
import { getOrders } from '../../services/orderService.js'
import { getStoredUsers } from '../../services/authService.js'
import { products } from '../../data/catalog/products.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import Loader from '../../components/common/Loader.jsx'

export default function AdminDashboardPage() {
  const { data: orders, loading, error } = useAsync(getOrders)
  if (loading) return <Loader />
  if (error) return <p role="alert">{error}</p>

  const customers = getStoredUsers().filter((u) => u.role === 'customer')
  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.pricing.total, 0)
  const pending = orders.filter((o) => ['Placed', 'Processing'].includes(o.status)).length
  const lowStock = products.filter((p) => p.stock <= 10)
  const stats = [
    ['Total revenue', formatCurrency(revenue)],
    ['Orders', orders.length],
    ['Pending orders', pending],
    ['Products', products.length],
    ['Customers', customers.length],
    ['Low stock items', lowStock.length],
  ]

  return (
    <div className="admin-page">
      <h1 className="admin-title">Dashboard</h1>
      <div className="admin-stats">
        {stats.map(([label, value]) => (
          <div className="admin-stat" key={label}><span>{label}</span><strong>{value}</strong></div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h2>Recent orders</h2><Link to="/admin/orders">View all</Link></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td><Link to={`/admin/orders/${o.id}`}>{o.id}</Link></td>
                  <td>{o.customer?.name}</td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td>{formatCurrency(o.pricing.total)}</td>
                  <td><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h2>Low stock (10 or fewer)</h2><Link to="/admin/products">All products</Link></div>
        <ul className="admin-list">
          {lowStock.map((p) => <li key={p.id}><span>{p.name}</span><strong>{p.stock} left</strong></li>)}
        </ul>
      </div>
    </div>
  )
}