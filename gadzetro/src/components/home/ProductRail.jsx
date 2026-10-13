import { Link } from 'react-router-dom'
import ProductGrid from '../products/ProductGrid.jsx'
import '../../styles/home.css'

// One homepage product section: title + "View all" link + product cards.
export default function ProductRail({ id, title, products, viewAllTo, loading, error, alt = false }) {
  return (
    <section id={id} className={`section ${alt ? 'home-alt' : ''}`}>
      <div className="container">
        <div className="deal-head">
          <h2 className="section-title">{title}</h2>
          <Link to={viewAllTo}>View all →</Link>
        </div>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </section>
  )
}