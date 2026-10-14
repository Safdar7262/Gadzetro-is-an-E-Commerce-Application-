import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiSearch, FiHeart, FiUser, FiShoppingCart, FiMapPin, FiMenu, FiX } from 'react-icons/fi'
import useCart from '../../hooks/useCart.js'
import useWishlist from '../../hooks/useWishlist.js'
import useAuth from '../../hooks/useAuth.js'
import { storeSettings } from '../../data/storeSettings.js'
import { categories } from '../../data/catalog/categories.js'
import '../../styles/Navbar.css' // reuses the homepage navbar styles so every page looks the same

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Best Sellers', to: '/shop?sort=popularity' },
  { label: 'New Arrivals', to: '/shop?sort=newest' },
  { label: 'Brands', to: '/brands' },
  { label: 'Deals', to: '/deals' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

export default function Navbar() {
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState(new URLSearchParams(location.search).get('q') || '')

  const currentCategory = location.pathname.startsWith('/category/') ? location.pathname.split('/')[2] : 'all'

  const isActive = (to) => {
    if (to.includes('?')) return location.pathname + location.search === to
    if (to === '/') return location.pathname === '/'
    if (to === '/shop') return location.pathname === '/shop' && !location.search
    return location.pathname.startsWith(to)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/shop')
    setMenuOpen(false)
  }

  const handleCategory = (e) => navigate(e.target.value === 'all' ? '/shop' : `/category/${e.target.value}`)

  return (
    <header className="navbar">
      <div className="container navbar-top">
        <Link to="/" className="brand">
                    <img src={storeSettings.logo} alt="" width="36" height="36" />
          <span>{storeSettings.storeName}</span>
        </Link>

        <form className="search-bar" onSubmit={handleSearch} role="search">
          <select aria-label="Product category" value={currentCategory} onChange={handleCategory}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <input type="search" placeholder="Search for gadgets..." aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" aria-label="Search"><FiSearch /></button>
        </form>

        <div className="nav-actions">
          <Link to="/account/orders" className="action-item track"><FiMapPin /><span>Track Order</span></Link>
          <Link to="/wishlist" className="action-item cart" aria-label={`Wishlist, ${wishlistCount} items`}>
            <FiHeart />
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link>
          <Link to={isAuthenticated ? '/account' : '/login'} className="action-item track" aria-label={isAuthenticated ? 'My account' : 'Log in'}>
  <FiUser /><span>{isAuthenticated ? user.name.split(' ')[0] : 'Login'}</span>
</Link>
          <Link to="/cart" className="action-item cart" aria-label={`Shopping cart, ${cartCount} items`}>
            <FiShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </Link>
          <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main">
        <ul className="container">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.to} className={isActive(link.to) ? 'active' : ''} onClick={() => setMenuOpen(false)}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
