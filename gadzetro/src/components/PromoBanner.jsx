import '../styles/PromoBanner.css'

const PLACEHOLDER = '/images/placeholder.svg'

export default function PromoBanner({ banner, onSelectCategory }) {
  return (
    <article className="promo-banner" style={{ background: banner.bg }}>
      <div className="promo-text">
        <h3>{banner.heading}</h3>
        <p>{banner.description}</p>
        <a href="#deals" className="btn btn-primary" onClick={() => onSelectCategory(banner.category)}>Shop Now</a>
      </div>
      <img src={banner.image} alt={banner.heading} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
    </article>
  )
}
