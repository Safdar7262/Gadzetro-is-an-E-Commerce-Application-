import { Link } from 'react-router-dom'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import BarChart from '../../components/admin/BarChart.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import useAsync from '../../hooks/useAsync.js'
import { getAdminStats, ORDER_STATUSES } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/admin.css'

export default function AdminDashboardPage() {
  const { data: stats, loading, error, reload } = useAsync(getAdminStats, [])
  if (loading) return <Loader label="Loading dashboard..." />
  if (error) return <EmptyState title="Could not load the dashboard" message={error} action={<Button onClick={reload}>Try again</Button>} />

  const kpis = [
    { label: 'Total products', value: stats.totalProducts, note: `${stats.lowStock} low stock, ${stats.outOfStock} out of stock`, to: '/admin/products' },
    { label: 'Total orders', value: stats.totalOrders, note: `${stats.statusCounts.Processing + stats.statusCounts.Placed} waiting to ship`, to: '/admin/orders' },
    { label: 'Total customers', value: stats.totalCustomers, note: 'Registered accounts', to: '/admin/customers' },
    { label: 'Revenue (demo)', value: formatCurrency(stats.totalRevenue), note: 'Cancelled orders excluded', to: '/admin/orders' },
  ]
  const orderColumns = [
    { key: 'id', label: 'Order', render: (o) => <Link to={`/admin/orders/${o.id}`}><strong>{o.id}</strong></Link> },
    { key: 'customer', label: 'Customer', render: (o) => o.customer.name },
    { key: 'date', label: 'Date', render: (o) => formatDate(o.createdAt) },
    { key: 'total', label: 'Total', render: (o) => formatCurrency(o.pricing.total) },
    { key: 'status', label: 'Status', render: (o) => <OrderStatusBadge status={o.status} /> },
  ]

  return (
    <div className="dashboard">
      <AdminHeader title="Dashboard" subtitle="Overview of the store" />
      <p className="deal-note">All figures below are calculated from demo data and are not real sales.</p>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className="kpi">
            <span className="kpi-label">{k.label}</span>
            <strong>{k.value}</strong>
            <small className="muted">{k.note}</small>
          </Link>
        ))}
      </div>

      <div className="dash-grid">
        <section className="panel">
          <h2>Revenue, last 6 months</h2>
          <BarChart data={stats.monthlyRevenue} title="Revenue by month (demo data)" />
        </section>
        <section className="panel">
          <h2>Orders by status</h2>
          <ul className="status-list">
            {ORDER_STATUSES.map((s) => (
              <li key={s}>
                <OrderStatusBadge status={s} />
                <span className="status-bar"><i style={{ width: `${stats.totalOrders ? (stats.statusCounts[s] / stats.totalOrders) * 100 : 0}%` }} /></span>
                <strong>{stats.statusCounts[s]}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="dash-grid">
        <section className="panel">
          <div className="deal-head"><h2>Recent orders</h2><Link to="/admin/orders">View all</Link></div>
          <DataTable columns={orderColumns} rows={stats.recentOrders} rowKey={(o) => o.id} empty={<p className="muted">No orders yet.</p>} />
        </section>
        <section className="panel">
          <h2>Best-selling products</h2>
          {stats.bestSelling.length === 0 ? <p className="muted">No sales yet.</p> : (
            <ol className="best-list">
              {stats.bestSelling.map((p) => (
                <li key={p.productId}>
                  <img className="thumb" src={p.image} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} />
                  <div><strong>{p.name}</strong><small className="muted">{p.qty} sold · {formatCurrency(p.revenue)}</small></div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  )
}