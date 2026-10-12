import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function getPages(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) pages.push('gap-start')
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (end < total - 1) pages.push('gap-end')
  pages.push(total)
  return pages
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="ui-pagination" aria-label="Pagination">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page"><FiChevronLeft /></button>
      {getPages(page, totalPages).map((item) =>
        typeof item === 'number' ? (
          <button key={item} type="button" className={item === page ? 'active' : ''} aria-current={item === page ? 'page' : undefined} onClick={() => onChange(item)}>{item}</button>
        ) : (
          <span key={item} className="gap" aria-hidden="true">…</span>
        )
      )}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page"><FiChevronRight /></button>
    </nav>
  )
}
