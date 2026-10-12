import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // stop background scroll while open
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="ui-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="ui-modal" role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button type="button" className="ui-icon-btn" onClick={onClose} aria-label="Close dialog"><FiX /></button>
        </header>
        <div className="ui-modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  )
}
