// 

import { Link } from 'react-router-dom'
import { brands } from '../../data/brands.js'
import '../../styles/TopBrands.css'

function BrandItem({ brand }) {
  return (
    <li className="brand-item" style={{ color: brand.color }}>
      <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
    </li>
  )
}

export default function TopBrands() {
  return (
    <section id="brands" className="section top-brands">
      <div className="container">
        <h2 className="section-title">Top Brands</h2>
        <div className="brand-marquee">
          <ul className="brand-track">
            {/* Brands 2 baar render hote hain taaki loop beech me rukta hua na dikhe */}
            {[0, 1].map((copy) =>
              brands.map((brand) => (
                <BrandItem key={`${brand.id}-${copy}`} brand={brand} />
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}