import { Link } from 'react-router-dom'
import OrderStatusBadge from '../../components/account/OrderStatusBadge.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useAuth from '../../hooks/useAuth.js'
import useWishlist from '../../hooks/useWishlist.js'
import useAsync from '../../hooks/useAsync.js'
import { getOrdersForUser } from '../../services/orderService.js'
import { getAddresses } from '../../services/addressService.js'
import { formatCurrency } from '../../utils/currency.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/account.css'

export default function AccountDashboardPage() {
  const { user } = useAuth()
  const { wishlistCount } = useWishlist()
  const { data, loading, error } = useAsync(() => Promise.all([getOrdersForUser(user), getAddresses(user.id)]), [user.id, user.email])
  if (loading) return <Loader label="Loading your account..." />
  if (error) return <EmptyState title="Could not load your account" message={error} />
  const [orders, addresses] = data
  const defaultAddress = addresses.find((a) => a.isDefault)

  return (
    <div className="account-page">
      <h1 className="page-title">Hello, {user.name.split(' ')[0]}!</h1>
      <div className="stat-grid">
        <Link to="/account/orders" className="stat"><strong>{orders.length}</strong><span>Total orders</span></Link>
        <Link to="/account/addresses" className="stat"><strong>{addresses.length}</strong><span>Saved addresses</span></Link>
        <Link to="/wishlist" className="stat"><strong>{wishlistCount}</strong><span>Wishlist items</span></Link>
      </div>

      <section className="panel">
        <div className="deal-head"><h2>Profile</h2><Link to="/account/profile">Edit</Link></div>
        <p><strong>{user.name}</strong><br />{user.email}<br />{user.phone}</p>
      </section>

      <section className="panel">
        <div className="deal-head"><h2>Recent orders</h2><Link to="/account/orders">View all</Link></div>
        {orders.length === 0 ? <p className="muted">No orders yet. <Link to="/shop">Start shopping</Link></p> : (
          <ul className="order-list">
            {orders.slice(0, 3).map((o) => (
              <li key={o.id}>
                <Link to={`/account/orders/${o.id}`}><strong>{o.id}</strong></Link>
                <span>{formatDate(o.createdAt)}</span>
                <span>{formatCurrency(o.pricing.total)}</span>
                <OrderStatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <div className="deal-head"><h2>Default address</h2><Link to="/account/addresses">Manage</Link></div>
        {defaultAddress ? (
          <address>{defaultAddress.fullName}<br />{defaultAddress.line1}{defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}<br />{defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}</address>
        ) : <p className="muted">No saved address yet.</p>}
      </section>

      <section className="quick-links" aria-label="Quick links">
        <Link to="/account/orders">My orders</Link><Link to="/account/reviews">My reviews</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Cart</Link>
      </section>
    </div>
  )
}
