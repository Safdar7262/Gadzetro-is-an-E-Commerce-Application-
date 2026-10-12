import { useState } from 'react'

const PLACEHOLDER = '/images/placeholder.svg'
const onImageError = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }

// Parent should pass key={product.id} so the selected thumbnail resets when the product changes.
export default function ProductGallery({ images, name }) {
  const [index, setIndex] = useState(0)
  return (
    <div className="gallery">
      <div className="gallery-main">
        <img src={images[index]} alt={`${name} - view ${index + 1}`} onError={onImageError} />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Show view ${i + 1}`} aria-pressed={i === index}>
              <img src={src} alt="" onError={onImageError} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
