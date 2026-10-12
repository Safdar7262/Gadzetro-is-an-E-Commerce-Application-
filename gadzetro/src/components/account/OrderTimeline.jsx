import { ORDER_STEPS } from '../../data/mockOrders.js'
import { formatDateTime } from '../../utils/formatDate.js'

// Placed -> Processing -> Shipped -> Delivered. A cancelled order lists the steps it actually went through.
export default function OrderTimeline({ order }) {
  const cancelled = order.status === 'Cancelled'
  const steps = cancelled
    ? order.statusHistory.map((h) => ({ label: h.status, at: h.at, done: true, cancelled: h.status === 'Cancelled' }))
    : ORDER_STEPS.map((label) => {
        const entry = order.statusHistory.find((h) => h.status === label)
        return { label, at: entry?.at, done: !!entry }
      })
  return (
    <ol className="timeline" aria-label="Order timeline">
      {steps.map((s) => (
        <li key={s.label} className={`${s.done ? 'done' : ''} ${s.cancelled ? 'cancelled' : ''}`}>
          <strong>{s.label}</strong>
          <small>{s.at ? formatDateTime(s.at) : 'Pending'}</small>
        </li>
      ))}
    </ol>
  )
}
