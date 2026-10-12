import { useState } from 'react'
import { FiSearch, FiHeart, FiUser, FiShoppingCart, FiMapPin, FiMenu, FiX } from 'react-icons/fi'
import useCart from '../hooks/useCart.js'
import { categories } from '../data/categories.js'
import '../styles/Navbar.css'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#deals' },
  { label: 'Best Sellers', href: '#deals' },
  { label: 'New Arrivals', href: '#deals' },
  { label: 'Brands', href: '#brands' },
  { label: 'Deals', href: '#deals' },
  { label: 'Blog', href: '#newsletter' },
  { label: 'Contact Us', href: '#contact' },
]

export default function Navbar({ searchQuery, setSearchQuery, category, setCategory }) {
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    window.location.hash = 'deals'
  }

  return (
    <header className="navbar">
      <div className="container navbar-top">
        <a href="#home" className="brand">
          <img src="/images/logo/logo.png" alt="" width="36" height="36" />
          <span>Gadzetro</span>
        </a>

        <form className="search-bar" onSubmit={handleSearch} role="search">
          <select aria-label="Product category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input type="search" placeholder="Search for gadgets..." aria-label="Search products" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button type="submit" aria-label="Search"><FiSearch /></button>
        </form>

        <div className="nav-actions">
          <a href="#contact" className="action-item track"><FiMapPin /><span>Track Order</span></a>
          <button className="action-item" aria-label="Wishlist"><FiHeart /></button>
          <button className="action-item" aria-label="Account"><FiUser /></button>
          <button className="action-item cart" aria-label={`Shopping cart, ${cartCount} items`}>
            <FiShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </button>
          <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main">
        <ul className="container">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
