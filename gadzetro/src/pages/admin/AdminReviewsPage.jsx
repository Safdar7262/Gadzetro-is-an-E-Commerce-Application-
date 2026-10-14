import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import AdminHeader from '../../components/admin/AdminHeader.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Rating from '../../components/common/Rating.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import useAsync from '../../hooks/useAsync.js'
import { deleteAdminReview, getAdminReviews, setAdminReviewStatus } from '../../services/adminService.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/admin.css'

export default function AdminReviewsPage() {
  const { data: reviews, loading, error, reload } = useAsync(getAdminReviews, [])
  const [term, setTerm] = useState('')
  const [rating, setRating] = useState('all')
  const [status, setStatus] = useState('all')
  const [toDelete, setToDelete] = useState(null)
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')

  if (loading) return <Loader label="Loading reviews..." />
  if (error) return <EmptyState title="Could not load reviews" message={error} action={<Button onClick={reload}>Try again</Button>} />

  const t = term.trim().toLowerCase()
  const rows = reviews
    .filter((r) => !t || [r.title, r.text, r.userName, r.productName].some((v) => v.toLowerCase().includes(t)))
    .filter((r) => rating === 'all' || r.rating === Number(rating))
    .filter((r) => status === 'all' || r.status === status)

  const toggle = async (r) => {
    setActionError(''); setMessage('')
    try { await setAdminReviewStatus(r.id, r.status === 'hidden' ? 'published' : 'hidden'); setMessage(`Review ${r.status === 'hidden' ? 'is visible again' : 'was hidden'}.`); reload() } catch (err) { setActionError(err.message) }
  }
  const confirmDelete = async () => {
    setActionError(''); setMessage('')
    try { await deleteAdminReview(toDelete.id); setMessage('Review deleted.'); reload() } catch (err) { setActionError(err.message) }
    setToDelete(null)
  }

  const columns = [
    { key: 'product', label: 'Product', render: (r) => r.productName },
    { key: 'user', label: 'Customer', render: (r) => r.userName },
    { key: 'rating', label: 'Rating', render: (r) => <Rating value={r.rating} showValue={false} /> },
    { key: 'review', label: 'Review', render: (r) => <div className="review-cell"><strong>{r.title}</strong><small className="muted block">{r.text}</small></div> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.createdAt) },
    { key: 'status', label: 'Status', render: (r) => <span className={`pill ${r.status === 'hidden' ? 'pill-amber' : 'pill-green'}`}>{r.status === 'hidden' ? 'Hidden' : 'Published'}</span> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="row-actions">
        <button type="button" onClick={() => toggle(r)} aria-label={`${r.status === 'hidden' ? 'Show' : 'Hide'} review ${r.title}`}>{r.status === 'hidden' ? 'Show' : 'Hide'}</button>
        <button type="button" className="danger" onClick={() => setToDelete(r)} aria-label={`Delete review ${r.title}`}>Delete</button>
      </div>
    ) },
  ]

  return (
    <div>
      <AdminHeader title="Reviews" subtitle={`${reviews.length} total (demo reviews included)`} />
      {message && <p className="success-msg" role="status">{message}</p>}
      {actionError && <p className="auth-error" role="alert">{actionError}</p>}
      <div className="toolbar">
        <input type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search reviews" aria-label="Search reviews" />
        <select value={rating} onChange={(e) => setRating(e.target.value)} aria-label="Rating">
          <option value="all">All ratings</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Review status">
          <option value="all">All statuses</option><option value="published">Published</option><option value="hidden">Hidden</option>
        </select>
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} empty={<EmptyState icon={<FiStar />} title="No reviews found" message="Try a different search or filter." />} />
      <ConfirmDialog open={!!toDelete} danger title="Delete review?" message={`Delete the review "${toDelete?.title}"? This cannot be undone.`} confirmLabel="Delete" onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  )
}