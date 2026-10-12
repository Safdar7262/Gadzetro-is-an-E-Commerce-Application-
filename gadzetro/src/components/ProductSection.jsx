import ProductCard from './ProductCard.jsx'
import { products } from '../data/products.js'
import { categories } from '../data/categories.js'
import '../styles/ProductSection.css'

export default function ProductSection({ category, setCategory, searchQuery, setSearchQuery }) {
  const query = searchQuery.trim().toLowerCase()
  const visible = products.filter(
    (p) => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(query)
  )
  const filtersActive = category !== 'all' || query !== ''
  const categoryName = categories.find((c) => c.id === category)?.name

  const resetFilters = () => {
    setCategory('all')
    setSearchQuery('')
  }

  return (
    <section id="deals" className="section product-section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Today&apos;s Best Deals</h2>
          {filtersActive && (
            <button className="reset-btn" onClick={resetFilters}>
              Clear filters ✕
            </button>
          )}
        </div>

        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state" role="status">
            <p>No products found{query ? ` for "${searchQuery}"` : ''}{categoryName ? ` in ${categoryName}` : ''}.</p>
            <button className="btn btn-primary" onClick={resetFilters}>Show all products</button>
          </div>
        )}
      </div>
    </section>
  )
}
