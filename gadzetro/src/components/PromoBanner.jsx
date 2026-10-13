// 

import { Link } from 'react-router-dom'
import '../styles/PromoBanner.css'

const PLACEHOLDER = '/images/placeholder.svg'

export default function PromoBanner({ banner }) {
  return (
    <article className="promo-banner" style={{ background: banner.bg }}>
      <div className="promo-text">
        <h3>{banner.heading}</h3>
        <p>{banner.description}</p>
        <Link to={banner.category === 'all' ? '/deals' : `/category/${banner.category}`} className="btn btn-primary">Shop Now</Link>
      </div>
      <img src={banner.image} alt={banner.heading} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
    </article>
  )
}