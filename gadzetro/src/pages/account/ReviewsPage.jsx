import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'
import StarSelector from '../../components/forms/StarSelector.jsx'
import Input from '../../components/common/Input.jsx'
import Modal from '../../components/common/Modal.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Rating from '../../components/common/Rating.jsx'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import useAuth from '../../hooks/useAuth.js'
import useAsync from '../../hooks/useAsync.js'
import { getOrdersForUser } from '../../services/orderService.js'
import { deleteReview, getReviewsByUser, saveReview } from '../../services/reviewService.js'
import { reviewSchema } from '../../utils/validation.js'
import { formatDate } from '../../utils/formatDate.js'
import '../../styles/account.css'

export default function ReviewsPage() {
  const { user } = useAuth()
  const { data, loading, error, setData } = useAsync(() => Promise.all([getOrdersForUser(user), getReviewsByUser(user.id)]), [user.id, user.email])
  const [writing, setWriting] = useState(null) // product being reviewed
  const [toDelete, setToDelete] = useState(null)
  const [actionError, setActionError] = useState('')
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, title: '', text: '' },
  })

  // Products from the customer's non-cancelled orders can be reviewed (one entry per product).
  const reviewable = useMemo(() => {
    if (!data) return []
    const map = new Map()
    data[0].filter((o) => o.status !== 'Cancelled').forEach((o) => o.items.forEach((i) => map.set(i.productId, i)))
    return [...map.values()]
  }, [data])

  if (loading) return <Loader label="Loading your reviews..." />
  if (error) return <EmptyState title="Could not load reviews" message={error} />
  const reviews = data[1]
  const reviewFor = (productId) => reviews.find((r) => r.productId === productId)

  const open = (item) => {
    const existing = reviewFor(item.productId)
    reset(existing ? { rating: existing.rating, title: existing.title, text: existing.text } : { rating: 0, title: '', text: '' })
    setActionError('')
    setWriting(item)
  }
  const onSubmit = async (values) => {
    try {
      await saveReview({ userId: user.id, userName: user.name, productId: writing.productId, ...values })
      setData([data[0], await getReviewsByUser(user.id)])
      setWriting(null)
    } catch (err) { setActionError(err.message || 'Could not save your review.') }
  }
  const confirmDelete = async () => {
    try { await deleteReview(user.id, toDelete.id); setData([data[0], await getReviewsByUser(user.id)]) } catch (err) { setActionError(err.message) }
    setToDelete(null)
  }

  return (
    <div className="account-page">
      <h1 className="page-title">My reviews</h1>
      <p className="muted">Review products from your orders. Reviews are saved on this device (demo).</p>
      {actionError && <p className="auth-error" role="alert">{actionError}</p>}
      {reviewable.length === 0 ? (
        <EmptyState icon={<FiStar />} title="Nothing to review yet" message="Products from your orders will appear here." action={<Button to="/shop">Start shopping</Button>} />
      ) : reviewable.map((item) => {
        const review = reviewFor(item.productId)
        return (
          <article key={item.productId} className="panel review-card">
            <div className="saved-item">
              <img src={item.image} alt={item.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg' }} />
              <div><Link to={`/product/${item.slug}`}><strong>{item.name}</strong></Link></div>
              {!review && <Button size="sm" onClick={() => open(item)}>Write review</Button>}
            </div>
            {review && (
              <div className="my-review">
                <Rating value={review.rating} showValue={false} />
                <h3>{review.title}</h3>
                <p>{review.text}</p>
                <small className="muted">{formatDate(review.updatedAt || review.createdAt)}</small>
                <div className="cart-item-actions"><button type="button" onClick={() => open(item)}>Edit</button><button type="button" onClick={() => setToDelete(review)}>Delete</button></div>
              </div>
            )}
          </article>
        )
      })}

      <Modal open={!!writing} onClose={() => setWriting(null)} title={writing ? `Review: ${writing.name}` : 'Review'}>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <StarSelector value={watch('rating')} onChange={(n) => setValue('rating', n, { shouldValidate: true })} error={errors.rating?.message} />
          <Input label="Review title" error={errors.title?.message} {...register('title')} />
          <div className="ui-field">
            <label htmlFor="review-text">Your review</label>
            <textarea id="review-text" rows={4} aria-invalid={errors.text ? true : undefined} {...register('text')} />
            {errors.text && <p className="ui-field-error" role="alert">{errors.text.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting}>Submit review</Button>
        </form>
      </Modal>
      <ConfirmDialog open={!!toDelete} danger title="Delete review?" message="Your review will be removed." confirmLabel="Delete" onCancel={() => setToDelete(null)} onConfirm={confirmDelete} />
    </div>
  )
}
