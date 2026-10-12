import { Link } from 'react-router-dom'
import ProductGrid from '../../components/products/ProductGrid.jsx'
import useCatalog from '../../hooks/useCatalog.js'
import { calcDiscountPercent } from '../../utils/currency.js'
import '../../styles/products.css'

const TILES = [
  { categoryId: 'headphones', title: 'Audio deals', text: 'Earbuds and headphones' },
  { categoryId: 'smartwatches', title: 'Smartwatch savings', text: 'Fitness and calling watches' },
  { categoryId: 'accessories', title: 'Power up for less', text: 'Chargers and power banks' },
]

export default function DealsPage() {
  const { products, loading, error } = useCatalog()
  const withDiscount = products.map((p) => ({ ...p, discount: calcDiscountPercent(p.price, p.originalPrice) }))
  const byDiscount = [...withDiscount].sort((a, b) => b.discount - a.discount)
  const topDeals = byDiscount.slice(0, 8)
  const budget = byDiscount.filter((p) => p.price <= 2000 && p.stock > 0).slice(0, 4)
  const premium = byDiscount.filter((p) => p.price >= 30000).slice(0, 4)
  const maxFor = (categoryId) => Math.max(0, ...withDiscount.filter((p) => p.categoryId === categoryId).map((p) => p.discount))

  return (
    <div className="container page">
      <header className="page-header">
        <h1 className="page-title">Deals</h1>
        <p className="deal-note">Sample offers for demonstration only. Prices and discounts are demo data, not real offers.</p>
      </header>

      <div className="deal-tiles">
        {TILES.map((t) => (
          <Link key={t.categoryId} to={`/category/${t.categoryId}`} className="deal-tile">
            <span className="tag">Demo offer</span>
            <h2>{t.title}</h2>
            <p>{t.text}</p>
            <strong>Up to {maxFor(t.categoryId)}% off</strong>
          </Link>
        ))}
      </div>

      <section className="pd-section">
        <div className="deal-head"><h2>Best deals</h2><Link to="/shop?discount=25&sort=price-asc">View all 25%+ off</Link></div>
        <ProductGrid products={topDeals} loading={loading} error={error} />
      </section>
      {!loading && !error && budget.length > 0 && (
        <section className="pd-section">
          <div className="deal-head"><h2>Under ₹2,000</h2><Link to="/shop?max=2000&sort=price-asc">View all</Link></div>
          <ProductGrid products={budget} />
        </section>
      )}
      {!loading && !error && premium.length > 0 && (
        <section className="pd-section">
          <div className="deal-head"><h2>Premium picks</h2><Link to="/shop?min=30000&sort=price-desc">View all</Link></div>
          <ProductGrid products={premium} />
        </section>
      )}
    </div>
  )
}
