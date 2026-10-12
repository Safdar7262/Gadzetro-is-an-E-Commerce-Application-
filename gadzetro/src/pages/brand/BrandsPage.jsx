import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState.jsx'
import Loader from '../../components/common/Loader.jsx'
import useCatalog from '../../hooks/useCatalog.js'
import '../../styles/products.css'

export default function BrandsPage() {
  const { brands, products, loading, error } = useCatalog()
  const [term, setTerm] = useState('')
  const matches = brands.filter((b) => b.name.toLowerCase().includes(term.trim().toLowerCase()))

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Brands</h1>
        <p>Shop gadgets from your favourite brands.</p>
        <input className="brand-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search brands" aria-label="Search brands" />
      </header>
      {loading ? <Loader label="Loading brands..." /> : error ? (
        <EmptyState title="Could not load brands" message={error} />
      ) : matches.length === 0 ? (
        <EmptyState title="No brands found" message={`No brand matches "${term}".`} />
      ) : (
        <ul className="brand-cards">
          {matches.map((b) => (
            <li key={b.id}>
              <Link to={`/brand/${b.slug}`} className="brand-card" style={{ color: b.color }}>
                <strong>{b.name}</strong>
                <span>{products.filter((p) => p.brandId === b.id).length} products</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
