import { useRef } from 'react'
import { FiGrid, FiMoreHorizontal } from 'react-icons/fi'
import { categories } from '../data/categories.js'
import '../styles/CategoriesSection.css'

const PLACEHOLDER = '/images/placeholder.svg'

export default function CategoriesSection({ category, setCategory }) {
  const sliderRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX, scrollLeft: sliderRef.current.scrollLeft, moved: false }
  }
  const onMouseMove = (e) => {
    if (!drag.current.active) return
    const distance = e.pageX - drag.current.startX
    if (Math.abs(distance) > 5) drag.current.moved = true
    sliderRef.current.scrollLeft = drag.current.scrollLeft - distance
  }
  const stopDrag = () => { drag.current.active = false }

  const select = (id) => {
    if (drag.current.moved) return // drag ke baad accidental click ignore karo
    setCategory(id)
    window.location.hash = 'deals'
  }

  return (
    <section id="categories" className="section categories">
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        <ul
          className="category-grid"
          ref={sliderRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <li>
            <button className={`category-card ${category === 'all' ? 'active' : ''}`} onClick={() => select('all')}>
              <span className="category-circle icon"><FiGrid /></span>
              <span className="category-name">All Products</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button className={`category-card ${category === c.id ? 'active' : ''}`} onClick={() => select(c.id)}>
                <span className="category-circle">
                  <img src={c.image} alt="" loading="lazy" draggable="false" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} />
                </span>
                <span className="category-name">{c.name}</span>
              </button>
            </li>
          ))}
          <li>
            <button className="category-card" onClick={() => select('all')}>
              <span className="category-circle icon"><FiMoreHorizontal /></span>
              <span className="category-name">More Categories</span>
            </button>
          </li>
        </ul>
      </div>
    </section>
  )
}