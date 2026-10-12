import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import { FiMenu, FiX } from 'react-icons/fi'

const links = [
  ['Dashboard', '/admin/dashboard'], ['Products', '/admin/products'], ['Categories', '/admin/categories'],
  ['Brands', '/admin/brands'], ['Orders', '/admin/orders'], ['Customers', '/admin/customers'],
  ['Coupons', '/admin/coupons'], ['Reviews', '/admin/reviews'], ['Settings', '/admin/settings'],
]

// Separate shell from the customer site. Demo UI only: real role-based access comes with the backend.
export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <Link to="/admin/dashboard" className="admin-brand">Gadzetro Admin</Link>
        <nav aria-label="Admin">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setOpen(false)}>{label}</NavLink>
          ))}
        </nav>
        <button type="button" className="admin-back" onClick={() => { logout(); navigate('/admin/login') }}>Log out ({user.name})</button>
        <Link to="/" className="admin-back">← Back to store</Link>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="ui-icon-btn admin-menu" onClick={() => setOpen(!open)} aria-label="Toggle admin menu">{open ? <FiX /> : <FiMenu />}</button>
          <p>Demo admin UI. Not secure: real role-based access arrives with the backend.</p>
        </header>
        <div className="admin-content"><Outlet /></div>
      </div>
    </div>
  )
}
