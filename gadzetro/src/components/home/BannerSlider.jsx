import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/BannerSlider.css'

const defaultSlides = [
  { id: 1, image: '/images/banners/banner-1.jpg', alt: 'Mega Sale', to: '/deals' },
  { id: 2, image: '/images/banners/banner-2.jpg', alt: 'New Smartphones', to: '/category/smartphones' },
  { id: 3, image: '/images/banners/banner-3.jpg', alt: 'Headphones Offers', to: '/category/headphones' },
]

export default function BannerSlider({ slides = defaultSlides, interval = 4000 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)
  const count = slides.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  // auto-play (pauses while hovering or touching)
  useEffect(() => {
    if (paused || count < 2) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [paused, next, interval, count])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; setPaused(true) }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
    touchStartX.current = null
    setPaused(false)
  }

  return (
    <section className="container banner-slider" aria-roledescription="carousel" aria-label="Featured offers">
      <div
        className="banner-viewport"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="banner-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => (
            <Link key={s.id} to={s.to} className="banner-slide" aria-hidden={i !== index} tabIndex={i === index ? 0 : -1}>
              <img src={s.image} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} draggable="false" />
            </Link>
          ))}
        </div>

        {count > 1 && (
          <>
            <button type="button" className="banner-arrow left" onClick={prev} aria-label="Previous banner">‹</button>
            <button type="button" className="banner-arrow right" onClick={next} aria-label="Next banner">›</button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="banner-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}