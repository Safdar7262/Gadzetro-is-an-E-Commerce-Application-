import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="ui-empty" role="status">
      <span className="ui-empty-icon" aria-hidden="true">{icon || <FiInbox />}</span>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  )
}
