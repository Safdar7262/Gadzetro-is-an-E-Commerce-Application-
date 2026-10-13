import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../../data/catalog/products.js'
import { categories } from '../../data/catalog/categories.js'
import { formatCurrency } from '../../utils/currency.js'

// Abhi sirf list dikhti hai: product edit karne ke liye backend chahiye (catalog ek static file hai).
export default function AdminProductsPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const shown = products.filter((p) => (cat === 'all' || p.categoryId === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()))
  return (
    <div className="admin-page">
      <h1 className="admin-title">Products ({shown.length})</h1>
      <div className="admin-toolbar">
        <input type="search" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/product/${p.slug}`}>{p.name}</Link></td>
                <td>{p.categoryId}</td>
                <td>{formatCurrency(p.price)}</td>
                <td className={p.stock <= 10 ? 'admin-low' : ''}>{p.stock}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}