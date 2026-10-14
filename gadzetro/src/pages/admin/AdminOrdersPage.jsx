import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import Pagination from '../../components/common/Pagination.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import useAsync from '../../hooks/useAsync.js'
import { getAdminOrders, ORDER_STATUSES } from '../../services/adminService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/admin.css'

const PAGE_SIZE = 10
const PAYMENT = { cod: 'Cash on Delivery', upi: 'UPI (demo)', card: 'Card (demo)' }

export default function AdminOrdersPage() {
  const { data: orders, loading, error, reload } = useAsync(getAdminOrders, [])
  const [term, setTerm] = useState('')
  const [status, setStatus] = useState('all')
  const [payment, setPayment] = useState('all')
  const [page, setPage] = useState(1)

  if (loading) return <Loader label="Loading orders..." />
  if (error) return <EmptyState title="Could not load orders" message={error} action={<Button onClick={reload}>Try again</Button>} />

  const t = term.trim().toLowerCase()
  const filtered = orders
    .filter((o) => !t || o.id.toLowerCase().includes(t) || o.customer.name.toLowerCase().includes(t) || o.customer.email.toLowerCase().includes(t))
    .filter((o) => status === 'all' || o.status === status)
    .filter((o) => payment === 'all' || o.paymentMethod === payment)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const reset = (setter) => (e) => { setter(e.target.value); setPage(1) }

  const columns = [
    { key: 'id', label: 'Order', render: (o) => <Link to={`/admin/orders/${o.id}`}><strong>{o.id}</strong></Link> },
    { key: 'date', label: 'Date', render: (o) => formatDate(o.createdAt) },
    { key: 'customer', label: 'Customer', render: (o) => <div><strong>{o.customer.name}</strong><small className="muted block">{o.customer.email}</small></div> },
    { key: 'items', label: 'Items', render: (o) => o.items.reduce((n, i) => n + i.qty, 0) },
    { key: 'total', label: 'Total', render: (o) => formatCurrency(o.pricing.total) },
    { key: 'payment', label: 'Payment', render: (o) => PAYMENT[o.paymentMethod] },
    { key: 'status', label: 'Status', render: (o) => <OrderStatusBadge status={o.status} /> },
    { key: 'actions', label: 'Actions', render: (o) => <div className="row-actions"><Link to={`/admin/orders/${o.id}`} aria-label={`View order ${o.id}`}>View</Link></div> },
  ]

  return (
    <div>
      <AdminHeader title="Orders" subtitle={`${orders.length} total`} />
      <div className="toolbar">
        <input type="search" value={term} onChange={reset(setTerm)} placeholder="Search by order ID, name or email" aria-label="Search orders" />
        <select value={status} onChange={reset(setStatus)} aria-label="Order status">
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={payment} onChange={reset(setPayment)} aria-label="Payment method">
          <option value="all">All payment methods</option>
          {Object.entries(PAYMENT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(o) => o.id} empty={<EmptyState icon={<FiShoppingBag />} title="No orders found" message="Try a different search or filter." />} />
      <div className="table-pager"><Pagination page={current} totalPages={totalPages} onChange={setPage} /></div>
    </div>
  )
}