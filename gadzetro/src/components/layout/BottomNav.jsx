import { NavLink } from 'react-router-dom'
import { FiHome, FiGrid, FiPackage, FiShoppingCart, FiUser } from 'react-icons/fi'
import useCart from '../../hooks/useCart.js'

// Sirf mobile ke liye bottom tab bar (desktop par CSS se chhup jata hai).
export default function BottomNav() {
  const { cartCount } = useCart()
  const tabs = [
    { to: '/', label: 'Home', icon: <FiHome />, end: true },
    { to: '/shop', label: 'Categories', icon: <FiGrid /> },
    { to: '/account/orders', label: 'Orders', icon: <FiPackage /> },
    { to: '/cart', label: 'Cart', icon: <FiShoppingCart />, badge: cartCount },
    { to: '/account', label: 'Account', icon: <FiUser />, end: true },
  ]
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {tabs.map((t) => (
        <NavLink key={t.label} to={t.to} end={t.end} className={({ isActive }) => `bottom-tab ${isActive ? 'active' : ''}`}>
          <span className="bottom-tab-icon">{t.icon}{t.badge > 0 && <span className="bottom-badge">{t.badge}</span>}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}