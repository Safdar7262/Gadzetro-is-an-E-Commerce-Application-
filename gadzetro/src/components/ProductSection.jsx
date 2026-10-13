// 
import { Link } from 'react-router-dom'
import ProductCard from './products/ProductCard.jsx'
import { products } from '../data/catalog/products.js'
import '../styles/ProductSection.css'

const deals = products.filter((p) => p.status === 'active' && p.isFeatured).slice(0, 8)

export default function ProductSection() {
  return (
    <section id="deals" className="section product-section">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">Today&apos;s Best Deals</h2>
          <Link to="/deals" className="reset-btn">View all deals →</Link>
        </div>
        <div className="product-grid home-slider">
          {deals.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  )
}