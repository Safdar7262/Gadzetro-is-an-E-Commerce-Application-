import { Link } from 'react-router-dom'
import { FiPackage } from 'react-icons/fi'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useAuth from '../../hooks/useAuth.js'
import useAsync from '../../hooks/useAsync.js'
import { getOrdersForUser } from '../../services/orderService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/account.css'

const PAYMENT = { cod: 'Cash on Delivery', upi: 'UPI (demo)', card: 'Card (demo)' }

export default function OrdersPage() {
  const { user } = useAuth()
  const { data: orders, loading, error, reload } = useAsync(() => getOrdersForUser(user), [user.id, user.email])
  if (loading) return <Loader label="Loading your orders..." />
  if (error) return <EmptyState title="Could not load orders" message={error} action={<Button onClick={reload}>Try again</Button>} />
  return (
    <div className="account-page">
      <h1 className="page-title">My orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon={<FiPackage />} title="No orders yet" message="Your demo orders will appear here." action={<Button to="/shop">Start shopping</Button>} />
      ) : orders.map((o) => (
        <article key={o.id} className="panel order-card">
          <header>
            <div><strong>{o.id}</strong><small className="muted"> · {formatDate(o.createdAt)}</small></div>
            <OrderStatusBadge status={o.status} />
          </header>
          <p>{o.items[0].name}{o.items.length > 1 ? ` + ${o.items.length - 1} more` : ''}</p>
          <footer>
            <span>{formatCurrency(o.pricing.total)} · {PAYMENT[o.paymentMethod]}</span>
            <Link to={`/account/orders/${o.id}`} className="ui-btn ui-btn-outline ui-btn-sm">View details</Link>
          </footer>
        </article>
      ))}
    </div>
  )
}
