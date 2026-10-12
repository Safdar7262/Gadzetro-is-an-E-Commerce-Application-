import '../../styles/account.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Button from '../common/Button.jsx'
import useAuth from '../../hooks/useAuth.js'

const links = [
  { label: 'Dashboard', to: '/account', end: true },
  { label: 'Profile', to: '/account/profile' },
  { label: 'Addresses', to: '/account/addresses' },
  { label: 'My Orders', to: '/account/orders' },
  { label: 'Reviews', to: '/account/reviews' },
  { label: 'Wishlist', to: '/wishlist' },
]

// Login protection is applied in router.jsx (ProtectedRoute, frontend-only demo guard).
export default function AccountLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="container account-shell">
      <aside className="account-sidebar">
        <h2>My Account</h2>
        <p className="account-user">{user.email}</p>
        <nav aria-label="Account">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'active' : '')}>{l.label}</NavLink>
          ))}
        </nav>
        <Button variant="outline" size="sm" className="logout" onClick={() => { logout(); navigate('/login') }}>Log out</Button>
      </aside>
      <section className="account-content"><Outlet /></section>
    </div>
  )
}
