import { useState } from 'react'

const PLACEHOLDER = '/images/placeholder.svg'
const EXISTING = ['earbuds', 'smartwatch', 'speaker', 'camera', 'power-bank', 'drone', 'smartphone', 'laptop', 'headphones']
const MAX_BYTES = 300 * 1024 // uploads are stored in the browser, so keep them small

// Pick one of the shop images or upload a small image (preview only; stored as a data URL in this demo).
export default function ImagePicker({ value, onChange, error }) {
  const [uploadError, setUploadError] = useState('')
  const selected = EXISTING.find((n) => value === `/images/products/${n}.jpg`) || ''

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    setUploadError('')
    if (!file) return
    if (!file.type.startsWith('image/')) return setUploadError('Please choose an image file.')
    if (file.size > MAX_BYTES) return setUploadError('Image is too large. Use a file under 300 KB.')
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="image-picker">
      <div className="image-preview">
        {value ? <img src={value} alt="Product preview" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER }} /> : <span className="muted">No image</span>}
      </div>
      <div className="ui-field">
        <label htmlFor="image-existing">Choose an existing image</label>
        <select id="image-existing" value={selected} onChange={(e) => e.target.value && onChange(`/images/products/${e.target.value}.jpg`)}>
          <option value="">Select...</option>
          {EXISTING.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <label htmlFor="image-upload">Or upload (max 300 KB)</label>
        <input id="image-upload" type="file" accept="image/*" onChange={handleFile} />
        {(uploadError || error) && <p className="ui-field-error" role="alert">{uploadError || error}</p>}
      </div>
    </div>
  )
}