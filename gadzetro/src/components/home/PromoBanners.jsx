import { Link } from 'react-router-dom'
import { banners } from '../../data/banners.js' // your original banner data (unchanged)
import '../../styles/PromoBanner.css' // same look as your original promo banners

const PLACEHOLDER = '/images/placeholder.svg'

export default function PromoBanners() {
  return (
    <section className="container promo-grid" aria-label="Promotions">
      {banners.map((b) => (
        <article key={b.id} className="promo-banner" style={{ background: b.bg }}>
          <div className="promo-text">
            <h3>{b.heading}</h3>
            <p>{b.description}</p>
          </div>
          <div className="promo-media">
            <img src={b.image} alt={b.heading} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
            <Link to={b.category === 'all' ? '/deals' : `/category/${b.category}`} className="btn btn-primary">Shop Now</Link>
          </div>
        </article>
      ))}
    </section>
  )
}