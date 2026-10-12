export default function OrderStatusBadge({ status }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
}
