import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiGrid } from 'react-icons/fi'
import { categories } from '../../data/catalog/categories.js'
import '../../styles/CategoriesSection.css' // same look as your original categories section

const PLACEHOLDER = '/images/placeholder.svg'

export default function HomeCategories() {
  const sliderRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  // Mouse drag to slide (on narrow screens the row scrolls sideways)
  const onMouseDown = (e) => { drag.current = { active: true, startX: e.pageX, scrollLeft: sliderRef.current.scrollLeft, moved: false } }
  const onMouseMove = (e) => {
    if (!drag.current.active) return
    const distance = e.pageX - drag.current.startX
    if (Math.abs(distance) > 5) drag.current.moved = true
    sliderRef.current.scrollLeft = drag.current.scrollLeft - distance
  }
  const stopDrag = () => { drag.current.active = false }
  const ignoreClickAfterDrag = (e) => { if (drag.current.moved) e.preventDefault() }

  return (
    <section id="categories" className="section categories">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <ul className="category-grid" ref={sliderRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopDrag} onMouseLeave={stopDrag}>
          <li>
            <Link to="/shop" className="category-card" draggable="false" onClick={ignoreClickAfterDrag}>
              <span className="category-circle icon"><FiGrid /></span>
              <span className="category-name">All Products</span>
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/category/${c.slug}`} className="category-card" draggable="false" onClick={ignoreClickAfterDrag}>
                <span className="category-circle">
                  <img src={c.image} alt="" loading="lazy" draggable="false" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
                </span>
                <span className="category-name">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}